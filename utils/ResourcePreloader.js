/**
 * 资源预加载系统
 * 智能预加载纹理、模型、音频等资源
 * 支持优先级队列、进度跟踪、错误重试
 */

import * as THREE from 'three'
import { ResourceContext } from './ResourceCleaner.js'

export class ResourcePreloader {
  constructor(options = {}) {
    this.options = {
      concurrentLoads: 4,              // 并发加载数
      retryAttempts: 3,                // 重试次数
      retryDelay: 1000,                // 重试延迟
      enableCache: true,               // 启用缓存
      enableProgress: true,            // 启用进度跟踪
      ...options
    }

    // 资源队列
    this.queue = []
    this.loaded = new Map()
    this.failed = new Map()
    this.loading = new Set()
    this.cache = new Map()

    // 进度跟踪
    this.total = 0
    this.loadedCount = 0
    this.failedCount = 0
    this.progress = 0

    // 回调
    this.onProgress = null
    this.onComplete = null
    this.onError = null
    this.onResourceLoaded = null

    // 优先级定义
    this.priority = {
      critical: 0,    // 关键资源（必需立即加载）
      high: 1,        // 高优先级（首屏）
      medium: 2,      // 中等优先级（常用）
      low: 3,         // 低优先级（按需）
      background: 4   // 后台加载
    }

    this.isRunning = false
  }

  /**
   * 添加资源到队列
   */
  add(resource) {
    const resourceConfig = {
      url: resource.url,
      type: resource.type || 'texture',
      priority: this.priority[resource.priority] ?? this.priority.medium,
      key: resource.key || resource.url,
      options: resource.options || {},
      retryCount: 0,
      ...resource
    }

    // 检查缓存
    if (this.options.enableCache && this.cache.has(resourceConfig.key)) {
      console.log(`[Preloader] Cache hit: ${resourceConfig.key}`)
      return Promise.resolve(this.cache.get(resourceConfig.key))
    }

    this.queue.push(resourceConfig)
    this.total++

    return this.promiseMap.get(resourceConfig.key) || this.createLoadPromise(resourceConfig)
  }

  /**
   * 批量添加资源
   */
  addAll(resources) {
    const promises = resources.map(resource => this.add(resource))
    return Promise.all(promises)
  }

  /**
   * 创建加载Promise
   */
  createLoadPromise(resource) {
    const promise = new Promise((resolve, reject) => {
      resource.resolve = resolve
      resource.reject = reject
    })

    this.promiseMap.set(resource.key, promise)
    return promise
  }

  /**
   * 开始加载
   */
  async start() {
    if (this.isRunning) return
    this.isRunning = true

    // 按优先级排序
    this.queue.sort((a, b) => a.priority - b.priority)

    // 开始并发加载
    await this.processQueue()

    // 完成回调
    if (this.onComplete) {
      this.onComplete({
        total: this.total,
        loaded: this.loadedCount,
        failed: this.failedCount,
        progress: 100
      })
    }

    this.isRunning = false
  }

  /**
   * 处理队列
   */
  async processQueue() {
    const workers = []

    for (let i = 0; i < this.options.concurrentLoads; i++) {
      workers.push(this.worker())
    }

    await Promise.all(workers)
  }

  /**
   * 工作线程
   */
  async worker() {
    while (this.queue.length > 0) {
      const resource = this.queue.shift()
      await this.loadResource(resource)
    }
  }

  /**
   * 加载单个资源
   */
  async loadResource(resource) {
    this.loading.add(resource.key)

    try {
      let data

      switch (resource.type) {
        case 'texture':
          data = await this.loadTexture(resource.url, resource.options)
          break
        case 'textureArray':
          data = await this.loadTextureArray(resource.urls, resource.options)
          break
        case 'cubeTexture':
          data = await this.loadCubeTexture(resource.urls, resource.options)
          break
        case 'model':
          data = await this.loadModel(resource.url, resource.options)
          break
        case 'json':
          data = await this.loadJSON(resource.url)
          break
        case 'audio':
          data = await this.loadAudio(resource.url)
          break
        case 'image':
          data = await this.loadImage(resource.url)
          break
        default:
          throw new Error(`Unknown resource type: ${resource.type}`)
      }

      // 缓存资源
      if (this.options.enableCache) {
        this.cache.set(resource.key, data)
      }

      this.loaded.set(resource.key, data)
      this.loading.delete(resource.key)
      this.loadedCount++

      // 更新进度
      this.updateProgress()

      // 回调
      if (this.onResourceLoaded) {
        this.onResourceLoaded(resource.key, data)
      }

      // 解析Promise
      if (resource.resolve) {
        resource.resolve(data)
      }

    } catch (error) {
      console.error(`[Preloader] Failed to load ${resource.key}:`, error)

      // 重试
      if (resource.retryCount < this.options.retryAttempts) {
        resource.retryCount++
        console.log(`[Preloader] Retrying ${resource.key} (${resource.retryCount}/${this.options.retryAttempts})`)

        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay))
        await this.loadResource(resource)
      } else {
        this.failed.set(resource.key, error)
        this.loading.delete(resource.key)
        this.failedCount++

        this.updateProgress()

        // 错误回调
        if (this.onError) {
          this.onError(resource.key, error)
        }

        // 拒绝Promise
        if (resource.reject) {
          resource.reject(error)
        }
      }
    }
  }

  /**
   * 加载纹理
   */
  async loadTexture(url, options = {}) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader()

      loader.load(
        url,
        (texture) => {
          // 应用纹理选项
          if (options.wrapS) texture.wrapS = options.wrapS
          if (options.wrapT) texture.wrapT = options.wrapT
          if (options.minFilter) texture.minFilter = options.minFilter
          if (options.magFilter) texture.magFilter = options.magFilter
          if (options.encoding) texture.encoding = options.encoding
          if (options.anisotropy !== undefined) texture.anisotropy = options.anisotropy

          if (options.colorSpace) {
            texture.colorSpace = options.colorSpace
          }

          if (options.flipY !== undefined) {
            texture.flipY = options.flipY
          }

          resolve(texture)
        },
        undefined,
        reject
      )
    })
  }

  /**
   * 加载纹理数组
   */
  async loadTextureArray(urls, options = {}) {
    const textures = await Promise.all(
      urls.map(url => this.loadTexture(url, options))
    )

    return textures
  }

  /**
   * 加载立方体贴图
   */
  async loadCubeTexture(urls, options = {}) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.CubeTextureLoader()

      loader.load(
        urls,
        (texture) => {
          if (options.colorSpace) {
            texture.colorSpace = options.colorSpace
          }
          resolve(texture)
        },
        undefined,
        reject
      )
    })
  }

  /**
   * 加载模型
   */
  async loadModel(url, options = {}) {
    // 根据文件扩展名选择加载器
    const ext = url.split('.').pop().toLowerCase()

    if (ext === 'gltf' || ext === 'glb') {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader(options.dracoLoader)
        loader.load(url, resolve, undefined, reject)
      })
    } else if (ext === 'obj') {
      const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js')
      return new Promise((resolve, reject) => {
        const loader = new OBJLoader()
        loader.load(url, resolve, undefined, reject)
      })
    } else if (ext === 'fbx') {
      const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')
      return new Promise((resolve, reject) => {
        const loader = new FBXLoader()
        loader.load(url, resolve, undefined, reject)
      })
    } else {
      throw new Error(`Unsupported model format: ${ext}`)
    }
  }

  /**
   * 加载JSON
   */
  async loadJSON(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`)
    }
    return await response.json()
  }

  /**
   * 加载音频
   */
  async loadAudio(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.src = url

      audio.addEventListener('canplaythrough', () => resolve(audio))
      audio.addEventListener('error', reject)
    })
  }

  /**
   * 加载图片
   */
  async loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  /**
   * 更新进度
   */
  updateProgress() {
    const totalProcessed = this.loadedCount + this.failedCount
    this.progress = this.total > 0 ? (totalProcessed / this.total) * 100 : 0

    if (this.onProgress) {
      this.onProgress({
        loaded: this.loadedCount,
        failed: this.failedCount,
        total: this.total,
        progress: this.progress
      })
    }
  }

  /**
   * 获取资源
   */
  get(key) {
    return this.loaded.get(key) || this.cache.get(key)
  }

  /**
   * 检查资源是否已加载
   */
  has(key) {
    return this.loaded.has(key) || this.cache.has(key)
  }

  /**
   * 移除资源
   */
  remove(key) {
    const resource = this.loaded.get(key) || this.cache.get(key)
    if (resource) {
      // 清理Three.js资源
      if (resource instanceof THREE.Texture) {
        resource.dispose()
      } else if (resource instanceof THREE.Material) {
        resource.dispose()
      } else if (resource instanceof THREE.BufferGeometry) {
        resource.dispose()
      }

      this.loaded.delete(key)
      this.cache.delete(key)
    }
  }

  /**
   * 清空所有资源
   */
  clear() {
    this.loaded.forEach((resource, key) => {
      this.remove(key)
    })

    this.loaded.clear()
    this.cache.clear()
    this.queue = []
    this.total = 0
    this.loadedCount = 0
    this.failedCount = 0
    this.progress = 0
  }

  /**
   * 获取进度
   */
  getProgress() {
    return {
      loaded: this.loadedCount,
      failed: this.failedCount,
      total: this.total,
      progress: this.progress,
      isLoading: this.isRunning
    }
  }

  /**
   * 取消加载
   */
  cancel() {
    this.isRunning = false
    this.queue = []
    this.loading.forEach(key => {
      const resource = this.promiseMap.get(key)
      if (resource && resource.reject) {
        resource.reject(new Error('Load cancelled'))
      }
    })
    this.loading.clear()
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      total: this.total,
      loaded: this.loadedCount,
      failed: this.failedCount,
      queued: this.queue.length,
      loading: this.loading.size,
      cached: this.cache.size,
      progress: this.progress
    }
  }
}

/**
 * 纹理图集预加载器
 */
export class TextureAtlasPreloader {
  constructor(options = {}) {
    this.options = {
      maxWidth: 2048,
      maxHeight: 2048,
      padding: 2,
      generateMipmaps: true,
      ...options
    }

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  /**
   * 创建纹理图集
   */
  async createAtlas(imageUrls) {
    const images = await Promise.all(
      imageUrls.map(url => this.loadImage(url))
    )

    return this.packImages(images)
  }

  /**
   * 加载图片
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  /**
   * 打包图片到图集
   */
  packImages(images) {
    // 简单的矩形打包算法
    const rects = images.map((img, index) => ({
      width: img.width + this.options.padding * 2,
      height: img.height + this.options.padding * 2,
      image: img,
      x: 0,
      y: 0,
      index
    }))

    // 计算图集尺寸
    let atlasWidth = this.options.maxWidth
    let atlasHeight = this.options.maxHeight

    // 简单的网格布局
    let x = 0
    let y = 0
    let rowHeight = 0

    rects.forEach(rect => {
      if (x + rect.width > atlasWidth) {
        x = 0
        y += rowHeight
        rowHeight = 0
      }

      rect.x = x + this.options.padding
      rect.y = y + this.options.padding
      x += rect.width
      rowHeight = Math.max(rowHeight, rect.height)
    })

    atlasHeight = y + rowHeight + this.options.padding

    // 创建画布
    this.canvas.width = atlasWidth
    this.canvas.height = atlasHeight

    // 绘制图片
    rects.forEach(rect => {
      this.ctx.drawImage(
        rect.image,
        rect.x,
        rect.y,
        rect.width - this.options.padding * 2,
        rect.height - this.options.padding * 2
      )
    })

    // 创建纹理
    const texture = new THREE.CanvasTexture(this.canvas)
    texture.needsUpdate = true

    if (this.options.generateMipmaps) {
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
    } else {
      texture.minFilter = THREE.LinearFilter
    }

    texture.magFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.colorSpace = THREE.SRGBColorSpace

    // 返回纹理和UV映射
    return {
      texture,
      uvs: rects.map(rect => ({
        index: rect.index,
        x: rect.x / atlasWidth,
        y: rect.y / atlasHeight,
        width: (rect.width - this.options.padding * 2) / atlasWidth,
        height: (rect.height - this.options.padding * 2) / atlasHeight
      }))
    }
  }
}

/**
 * 资源管理器 - 整合预加载和清理
 */
export class ResourceManager {
  constructor(options = {}) {
    this.preloader = new ResourcePreloader(options.preloader || {})
    this.context = new ResourceContext('ResourceManager')
  }

  /**
   * 预加载资源
   */
  async preload(resources) {
    const results = await this.preloader.addAll(resources)

    // 将加载的资源添加到清理上下文
    results.forEach((resource, index) => {
      if (resource instanceof THREE.Object3D) {
        this.context.add(resource, 'mesh')
      } else if (resource instanceof THREE.Texture) {
        this.context.add(resource, 'texture')
      } else if (resource instanceof THREE.Material) {
        this.context.add(resource, 'material')
      }
    })

    return results
  }

  /**
   * 获取资源
   */
  get(key) {
    return this.preloader.get(key)
  }

  /**
   * 清理所有资源
   */
  dispose() {
    this.preloader.clear()
    this.context.clear()
  }
}

export default ResourcePreloader
