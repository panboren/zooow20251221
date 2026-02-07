/**
 * 纹理图集优化工具
 * 将多个小纹理合并为一个大纹理，减少Draw Calls
 */

import * as THREE from 'three'

export class TextureAtlas {
  constructor(options = {}) {
    this.textures = []
    this.atlasTexture = null
    this.canvas = null
    this.context = null

    this.options = {
      width: options.width || 2048,
      height: options.height || 2048,
      padding: options.padding || 2,
      powerOfTwo: options.powerOfTwo !== false
    }
  }

  /**
   * 添加纹理到图集
   */
  addTexture(texture, name) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const region = {
          name: name,
          width: img.width,
          height: img.height,
          image: img
        }

        this.textures.push(region)
        resolve(region)
      }

      img.onerror = () => {
        reject(new Error(`Failed to load texture: ${name}`))
      }

      img.src = texture
    })
  }

  /**
   * 计算图集布局（简单左上角布局）
   */
  calculateLayout() {
    let currentX = this.options.padding
    let currentY = this.options.padding
    let maxHeightInRow = 0

    this.textures.forEach(texture => {
      // 检查是否需要换行
      if (currentX + texture.width > this.options.width - this.options.padding) {
        currentX = this.options.padding
        currentY += maxHeightInRow + this.options.padding
        maxHeightInRow = 0
      }

      // 记录位置
      texture.x = currentX
      texture.y = currentY

      // 更新当前坐标
      currentX += texture.width + this.options.padding
      maxHeightInRow = Math.max(maxHeightInRow, texture.height)
    })

    return this.textures
  }

  /**
   * 生成图集
   */
  async build() {
    return new Promise((resolve, reject) => {
      try {
        // 创建画布
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.options.width
        this.canvas.height = this.options.height
        this.context = this.canvas.getContext('2d')

        // 填充背景
        this.context.fillStyle = 'rgba(0, 0, 0, 0)'
        this.context.fillRect(0, 0, this.options.width, this.options.height)

        // 计算布局
        const layout = this.calculateLayout()

        // 绘制所有纹理
        layout.forEach(texture => {
          this.context.drawImage(
            texture.image,
            texture.x,
            texture.y
          )
        })

        // 创建Three.js纹理
        this.atlasTexture = new THREE.CanvasTexture(this.canvas)
        this.atlasTexture.needsUpdate = true

        // 创建UV映射数据
        const uvData = this.createUVMapping(layout)

        resolve({
          texture: this.atlasTexture,
          regions: uvData
        })

      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 创建UV映射数据
   */
  createUVMapping(layout) {
    const uvMap = {}

    layout.forEach(texture => {
      const u0 = texture.x / this.options.width
      const v0 = 1 - (texture.y + texture.height) / this.options.height
      const u1 = (texture.x + texture.width) / this.options.width
      const v1 = 1 - texture.y / this.options.height

      uvMap[texture.name] = {
        u0, v0, u1, v1,
        uv: [u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1]
      }
    })

    return uvMap
  }

  /**
   * 获取子纹理UV
   */
  getUV(name) {
    if (!this.atlasTexture) {
      console.warn('Atlas not built yet')
      return { u0: 0, v0: 0, u1: 1, v1: 1 }
    }

    const layout = this.textures.find(t => t.name === name)
    if (!layout) {
      console.warn(`Texture not found in atlas: ${name}`)
      return { u0: 0, v0: 0, u1: 1, v1: 1 }
    }

    const u0 = layout.x / this.options.width
    const v0 = 1 - (layout.y + layout.height) / this.options.height
    const u1 = (layout.x + layout.width) / this.options.width
    const v1 = 1 - layout.y / this.options.height

    return { u0, v0, u1, v1 }
  }

  /**
   * 应用UV到几何体
   */
  applyUVToGeometry(geometry, uvName, uvData) {
    const uvAttribute = geometry.attributes.uv
    const uv = uvData.uv

    // 设置UV
    for (let i = 0; i < uv.length; i += 2) {
      uvAttribute.array[i] = uv[i]
      uvAttribute.array[i + 1] = uv[i + 1]
    }

    uvAttribute.needsUpdate = true
  }

  /**
   * 获取图集信息
   */
  getInfo() {
    return {
      width: this.options.width,
      height: this.options.height,
      textureCount: this.textures.length,
      usedArea: this.calculateUsedArea(),
      efficiency: this.calculateEfficiency()
    }
  }

  /**
   * 计算已使用面积
   */
  calculateUsedArea() {
    let usedArea = 0
    this.textures.forEach(texture => {
      usedArea += texture.width * texture.height
    })
    return usedArea
  }

  /**
   * 计算空间利用率
   */
  calculateEfficiency() {
    const totalArea = this.options.width * this.options.height
    const usedArea = this.calculateUsedArea()
    return (usedArea / totalArea * 100).toFixed(2) + '%'
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.atlasTexture) {
      this.atlasTexture.dispose()
      this.atlasTexture = null
    }

    this.textures = []
    this.canvas = null
    this.context = null
  }
}

/**
 * 粒子纹理图集生成器
 * 专门用于粒子系统的图集
 */
export class ParticleTextureAtlas extends TextureAtlas {
  constructor(options = {}) {
    super({
      width: options.width || 1024,
      height: options.height || 1024,
      padding: options.padding || 4
    })

    this.particleTypes = []
  }

  /**
   * 添加粒子类型
   */
  addParticleType(type, config = {}) {
    const canvas = document.createElement('canvas')
    const size = config.size || 64
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // 绘制粒子
    this.drawParticle(ctx, type, config)

    // 添加到图集
    return this.addTexture(canvas.toDataURL(), type)
  }

  /**
   * 绘制粒子
   */
  drawParticle(ctx, type, config) {
    const size = ctx.canvas.width
    const center = size / 2

    // 径向渐变
    const gradient = ctx.createRadialGradient(
      center, center, 0,
      center, center, center
    )

    const color = config.color || '#ffffff'
    const alpha = config.alpha !== undefined ? config.alpha : 1

    gradient.addColorStop(0, this.hexToRgba(color, alpha))
    gradient.addColorStop(0.3, this.hexToRgba(color, alpha * 0.8))
    gradient.addColorStop(0.7, this.hexToRgba(color, alpha * 0.3))
    gradient.addColorStop(1, this.hexToRgba(color, 0))

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    // 自定义形状
    if (config.shape === 'star') {
      this.drawStar(ctx, center, center, 5, center * 0.8, center * 0.4, color, alpha)
    } else if (config.shape === 'diamond') {
      this.drawDiamond(ctx, center, center, center * 0.8, color, alpha)
    }
  }

  /**
   * 绘制星星
   */
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    let rot = Math.PI / 2 * 3
    let step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius)
      rot += step
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius)
      rot += step
    }

    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius)
    gradient.addColorStop(0, this.hexToRgba(color, alpha))
    gradient.addColorStop(1, this.hexToRgba(color, 0))

    ctx.fillStyle = gradient
    ctx.fill()
  }

  /**
   * 绘制菱形
   */
  drawDiamond(ctx, cx, cy, radius, color, alpha) {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    gradient.addColorStop(0, this.hexToRgba(color, alpha))
    gradient.addColorStop(1, this.hexToRgba(color, 0))

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(cx, cy - radius)
    ctx.lineTo(cx + radius, cy)
    ctx.lineTo(cx, cy + radius)
    ctx.lineTo(cx - radius, cy)
    ctx.closePath()
    ctx.fill()
  }

  /**
   * 十六进制颜色转RGBA
   */
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /**
   * 生成默认粒子图集
   */
  async buildDefaultAtlas() {
    // 添加默认粒子类型
    await this.addParticleType('circle', { color: '#ffffff' })
    await this.addParticleType('star', { color: '#ffff00', shape: 'star' })
    await this.addParticleType('diamond', { color: '#ff00ff', shape: 'diamond' })
    await this.addParticleType('glow', { color: '#00ffff', size: 64 })
    await this.addParticleType('spark', { color: '#ffaa00', size: 32 })

    // 构建图集
    return this.build()
  }
}
