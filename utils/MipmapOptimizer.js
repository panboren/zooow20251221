/**
 * 多级纹理 Mipmap 优化系统
 * 自动生成和管理纹理Mipmap，根据距离和性能动态调整
 */

import * as THREE from 'three'
import { ResourceContext } from './ResourceCleaner.js'

export class MipmapOptimizer {
  constructor(options = {}) {
    this.options = {
      generateMipmaps: true,
      anisotropy: 16,
      minFilter: THREE.LinearMipmapLinearFilter,
      maxAnisotropy: 16,
      autoGenerate: true,
      compressTextures: true,
      qualityLevels: ['ultra', 'high', 'medium', 'low'],
      ...options
    }

    this.resources = new Map()
    this.context = new ResourceContext('MipmapOptimizer')

    // LOD配置
    this.lodConfig = {
      ultra: { anisotropy: 16, mipmaps: true, minFilter: THREE.LinearMipmapLinearFilter },
      high: { anisotropy: 8, mipmaps: true, minFilter: THREE.LinearMipmapLinearFilter },
      medium: { anisotropy: 4, mipmaps: true, minFilter: THREE.LinearMipmapLinearFilter },
      low: { anisotropy: 1, mipmaps: false, minFilter: THREE.LinearFilter }
    }

    // 统计
    this.stats = {
      totalTextures: 0,
      optimizedTextures: 0,
      memorySaved: 0
    }
  }

  /**
   * 优化纹理
   */
  optimizeTexture(texture, options = {}) {
    if (!texture) return texture

    const config = { ...this.options, ...options }

    // 检查是否已优化
    if (this.resources.has(texture.uuid)) {
      return this.resources.get(texture.uuid).optimizedTexture
    }

    const originalSize = this.estimateTextureSize(texture)

    // 生成Mipmap
    if (config.generateMipmaps && !texture.generateMipmaps) {
      texture.generateMipmaps = true
    }

    // 设置各向异性过滤
    if (config.anisotropy) {
      const maxAniso = Math.min(
        config.maxAnisotropy,
        this.getRenderer().capabilities.getMaxAnisotropy()
      )
      texture.anisotropy = Math.min(config.anisotropy, maxAniso)
    }

    // 设置过滤模式
    if (config.mipmaps) {
      texture.minFilter = config.minFilter
    } else {
      texture.minFilter = THREE.LinearFilter
    }
    texture.magFilter = THREE.LinearFilter

    // 设置颜色空间
    if (config.colorSpace) {
      texture.colorSpace = config.colorSpace
    }

    // 优化像素存储
    texture.internalFormat = this.getOptimalFormat(texture)

    const optimizedSize = this.estimateTextureSize(texture)

    // 记录
    this.resources.set(texture.uuid, {
      originalTexture: texture,
      optimizedTexture: texture,
      originalSize,
      optimizedSize,
      saved: originalSize - optimizedSize
    })

    this.stats.optimizedTextures++
    this.stats.memorySaved += originalSize - optimizedSize

    return texture
  }

  /**
   * 批量优化纹理
   */
  optimizeTextures(textures, options = {}) {
    return textures.map(texture => this.optimizeTexture(texture, options))
  }

  /**
   * 优化材质中的纹理
   */
  optimizeMaterial(material, options = {}) {
    const textureProps = [
      'map', 'normalMap', 'roughnessMap', 'metalnessMap',
      'aoMap', 'emissiveMap', 'bumpMap', 'displacementMap',
      'alphaMap', 'envMap', 'lightMap'
    ]

    textureProps.forEach(prop => {
      if (material[prop]) {
        material[prop] = this.optimizeTexture(material[prop], options)
      }
    })

    return material
  }

  /**
   * 优化对象中的所有纹理
   */
  optimizeObject(object, options = {}) {
    object.traverse(node => {
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(mat => this.optimizeMaterial(mat, options))
        } else {
          this.optimizeMaterial(node.material, options)
        }
      }
    })

    return object
  }

  /**
   * 优化场景
   */
  optimizeScene(scene, options = {}) {
    scene.traverse(node => {
      if (node.material) {
        this.optimizeMaterial(node.material, options)
      }
    })

    return scene
  }

  /**
   * 根据LOD优化纹理
   */
  optimizeByLOD(texture, level, options = {}) {
    const config = this.lodConfig[level] || this.lodConfig.high

    if (texture) {
      texture.anisotropy = config.anisotropy

      if (config.mipmaps) {
        texture.generateMipmaps = true
        texture.minFilter = config.minFilter
      } else {
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
      }

      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    }

    return texture
  }

  /**
   * 批量LOD优化
   */
  optimizeSceneByLOD(scene, level, options = {}) {
    const config = this.lodConfig[level] || this.lodConfig.high

    scene.traverse(node => {
      if (node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material]

        materials.forEach(mat => {
          this.optimizeMaterialByLOD(mat, config)
        })
      }
    })

    return scene
  }

  /**
   * 优化材质LOD
   */
  optimizeMaterialByLOD(material, config) {
    const textureProps = [
      'map', 'normalMap', 'roughnessMap', 'metalnessMap',
      'aoMap', 'emissiveMap', 'bumpMap', 'displacementMap',
      'alphaMap', 'envMap'
    ]

    textureProps.forEach(prop => {
      if (material[prop]) {
        material[prop].anisotropy = config.anisotropy

        if (config.mipmaps) {
          material[prop].generateMipmaps = true
          material[prop].minFilter = config.minFilter
        } else {
          material[prop].generateMipmaps = false
          material[prop].minFilter = THREE.LinearFilter
        }

        material[prop].magFilter = THREE.LinearFilter
        material[prop].needsUpdate = true
      }
    })
  }

  /**
   * 创建纹理LOD变体
   */
  createTextureLOD(texture, qualityLevels = ['ultra', 'high', 'medium', 'low']) {
    const variants = {}

    qualityLevels.forEach(level => {
      const config = this.lodConfig[level]

      // 克隆纹理
      const variant = texture.clone()
      variant.source = texture.source
      variant.image = texture.image

      // 应用LOD设置
      variant.anisotropy = config.anisotropy

      if (config.mipmaps) {
        variant.generateMipmaps = true
        variant.minFilter = config.minFilter
      } else {
        variant.generateMipmaps = false
        variant.minFilter = THREE.LinearFilter
      }

      variant.magFilter = THREE.LinearFilter
      variant.needsUpdate = true

      variants[level] = variant

      this.context.add(variant, 'texture')
    })

    return variants
  }

  /**
   * 压缩纹理
   */
  compressTexture(texture, quality = 'medium') {
    // 注意：实际压缩需要WebGL扩展或后处理
    // 这里提供基础的优化设置

    const qualityConfig = {
      high: { format: THREE.RGBAFormat, type: THREE.UnsignedByteType },
      medium: { format: THREE.RGBAFormat, type: THREE.UnsignedByteType },
      low: { format: THREE.RGBFormat, type: THREE.UnsignedByteType }
    }

    const config = qualityConfig[quality] || qualityConfig.medium

    if (texture.image) {
      // 可以在这里进行图像降采样
      // 这需要Canvas API或WebGL支持
    }

    return texture
  }

  /**
   * 纹理降采样
   */
  downsampleTexture(texture, factor = 0.5) {
    if (!texture.image) return texture

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const newWidth = Math.floor(texture.image.width * factor)
    const newHeight = Math.floor(texture.image.height * factor)

    canvas.width = newWidth
    canvas.height = newHeight

    ctx.drawImage(texture.image, 0, 0, newWidth, newHeight)

    // 创建新纹理
    const newTexture = texture.clone()
    newTexture.image = canvas
    newTexture.needsUpdate = true

    return newTexture
  }

  /**
   * 创建纹理图集
   */
  createTextureAtlas(textures, options = {}) {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      padding = 2
    } = options

    // 计算总大小
    let totalWidth = 0
    let totalHeight = 0

    textures.forEach(tex => {
      totalWidth += tex.image.width + padding
      totalHeight = Math.max(totalHeight, tex.image.height + padding)
    })

    // 创建图集
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = Math.min(maxWidth, totalWidth)
    canvas.height = Math.min(maxHeight, totalHeight)

    // 绘制纹理
    let offsetX = padding
    const uvs = {}

    textures.forEach((tex, index) => {
      const x = offsetX
      const y = padding

      ctx.drawImage(
        tex.image,
        x, y,
        tex.image.width,
        tex.image.height
      )

      // 记录UV坐标
      uvs[index] = {
        x: x / canvas.width,
        y: y / canvas.height,
        width: tex.image.width / canvas.width,
        height: tex.image.height / canvas.height
      }

      offsetX += tex.image.width + padding
    })

    // 创建图集纹理
    const atlasTexture = new THREE.CanvasTexture(canvas)
    atlasTexture.generateMipmaps = true
    atlasTexture.minFilter = THREE.LinearMipmapLinearFilter
    atlasTexture.magFilter = THREE.LinearFilter
    atlasTexture.wrapS = THREE.ClampToEdgeWrapping
    atlasTexture.wrapT = THREE.ClampToEdgeWrapping

    this.optimizeTexture(atlasTexture)

    return {
      texture: atlasTexture,
      uvs,
      canvas
    }
  }

  /**
   * 估算纹理大小
   */
  estimateTextureSize(texture) {
    if (!texture || !texture.image) return 0

    const width = texture.image.width || 1
    const height = texture.image.height || 1

    // 基础大小
    let size = width * height * 4  // RGBA

    // Mipmap大小（约增加1/3）
    if (texture.generateMipmaps) {
      size = size * 1.33
    }

    // 转换为MB
    return size / 1024 / 1024
  }

  /**
   * 获取最优格式
   */
  getOptimalFormat(texture) {
    // 根据纹理类型选择最优内部格式
    if (texture.isCompressedTexture) {
      return texture.format
    }

    // 检查可用扩展
    // 这里简化处理，实际应根据renderer capabilities

    return THREE.RGBAFormat
  }

  /**
   * 获取渲染器（需要外部设置）
   */
  getRenderer() {
    // 返回全局renderer或通过其他方式获取
    return this.renderer
  }

  /**
   * 设置渲染器
   */
  setRenderer(renderer) {
    this.renderer = renderer
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      memorySavedMB: this.stats.memorySaved.toFixed(2)
    }
  }

  /**
   * 清理
   */
  dispose() {
    this.context.clear()
    this.resources.clear()
  }
}

/**
 * 纹理流式加载器
 */
export class TextureStreamLoader extends MipmapOptimizer {
  constructor(options = {}) {
    super(options)
    this.loadingTextures = new Map()
  }

  /**
   * 流式加载纹理（从低质量到高质量）
   */
  async streamLoadTexture(url, options = {}) {
    const {
      levels = ['low', 'medium', 'high'],
      onLoad = null,
      onProgress = null
    } = options

    // 首先加载低质量版本
    for (const level of levels) {
      const levelUrl = this.getLevelUrl(url, level)

      try {
        const texture = await this.loadTexture(levelUrl)
        const optimizedTexture = this.optimizeTexture(texture, this.lodConfig[level])

        if (onLoad) {
          onLoad(optimizedTexture, level)
        }

        if (onProgress) {
          onProgress({
            level,
            progress: (levels.indexOf(level) + 1) / levels.length * 100
          })
        }

        // 返回当前级别，继续加载更高级别
        // 实际应用中可能需要返回Promise
      } catch (error) {
        console.error(`Failed to load ${level} texture:`, error)
      }
    }
  }

  /**
   * 获取级别URL
   */
  getLevelUrl(baseUrl, level) {
    // 例如：/textures/texture.png -> /textures/texture_low.png
    const extIndex = baseUrl.lastIndexOf('.')
    if (extIndex === -1) return baseUrl

    const base = baseUrl.substring(0, extIndex)
    const ext = baseUrl.substring(extIndex)

    return `${base}_${level}${ext}`
  }

  /**
   * 加载纹理
   */
  async loadTexture(url) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader()
      loader.load(url, resolve, undefined, reject)
    })
  }
}

export default MipmapOptimizer
