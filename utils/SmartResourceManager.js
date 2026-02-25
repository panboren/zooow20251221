/**
 * 智能资源卸载系统
 * 根据使用频率、距离、内存占用等智能管理资源生命周期
 */

import * as THREE from 'three'
import { ResourceContext } from './ResourceCleaner.js'

export class SmartResourceManager {
  constructor(options = {}) {
    this.options = {
      maxMemoryMB: 500,              // 最大内存限制（MB）
      cacheSize: 100,                // 缓存资源数量
      unloadDelay: 30000,            // 卸载延迟（ms）
      memoryCheckInterval: 5000,      // 内存检查间隔
      enableDistanceCheck: true,       // 启用距离检查
      distanceThreshold: 200,          // 距离阈值
      autoUnload: true,               // 自动卸载
      ...options
    }

    // 资源映射
    this.resources = new Map()
    this.resourcesByType = new Map()
    this.usageStats = new Map()

    // 内存跟踪
    this.memoryUsed = 0
    this.memoryPeak = 0
    this.lastMemoryCheck = 0

    // 引用跟踪
    this.references = new WeakMap()
    this.activeReferences = new Set()

    // 清理上下文
    this.context = new ResourceContext('SmartResourceManager')

    // 定时器
    this.checkInterval = null

    // 回调
    this.onUnload = null
    this.onMemoryWarning = null

    this.init()
  }

  /**
   * 初始化
   */
  init() {
    if (this.options.autoUnload) {
      this.startMemoryCheck()
    }
  }

  /**
   * 注册资源
   */
  register(key, resource, options = {}) {
    if (this.resources.has(key)) {
      console.warn(`Resource ${key} already registered`)
      return
    }

    const resourceInfo = {
      key,
      resource,
      type: options.type || this.detectResourceType(resource),
      size: options.size || this.estimateSize(resource),
      priority: options.priority || 'normal',  // critical/high/normal/low
      keep: options.keep || false,
      lastUsed: Date.now(),
      useCount: 0,
      position: options.position || new THREE.Vector3(),
      dependencies: options.dependencies || [],
      metadata: options.metadata || {}
    }

    this.resources.set(key, resourceInfo)

    // 按类型分类
    if (!this.resourcesByType.has(resourceInfo.type)) {
      this.resourcesByType.set(resourceInfo.type, new Set())
    }
    this.resourcesByType.get(resourceInfo.type).add(key)

    // 初始化使用统计
    this.usageStats.set(key, {
      totalUses: 0,
      avgInterval: 0,
      lastInterval: 0,
      firstUsed: Date.now()
    })

    // 更新内存
    this.memoryUsed += resourceInfo.size
    if (this.memoryUsed > this.memoryPeak) {
      this.memoryPeak = this.memoryUsed
    }

    console.log(`[SmartResourceManager] Registered: ${key} (${this.formatSize(resourceInfo.size)})`)

    return resourceInfo
  }

  /**
   * 检测资源类型
   */
  detectResourceType(resource) {
    if (resource instanceof THREE.Texture) return 'texture'
    if (resource instanceof THREE.BufferGeometry) return 'geometry'
    if (resource instanceof THREE.Material) return 'material'
    if (resource instanceof THREE.Object3D) return 'mesh'
    if (resource instanceof THREE.Audio) return 'audio'
    if (resource instanceof THREE.VideoTexture) return 'video'
    return 'other'
  }

  /**
   * 估算资源大小
   */
  estimateSize(resource) {
    if (resource instanceof THREE.Texture) {
      if (resource.image) {
        const w = resource.image.width || 1
        const h = resource.image.height || 1
        return Math.ceil((w * h * 4) / 1024 / 1024)  // 估算MB
      }
      return 1
    }

    if (resource instanceof THREE.BufferGeometry) {
      let size = 0
      resource.attributes.forEach(attr => {
        size += attr.array.byteLength
      })
      return Math.ceil(size / 1024 / 1024)
    }

    if (resource instanceof THREE.Object3D) {
      let size = 1
      resource.traverse(obj => {
        if (obj.geometry) {
          obj.geometry.attributes.forEach(attr => {
            size += attr.array.byteLength
          })
        }
        if (obj.material) {
          if (obj.material.map) {
            const tex = obj.material.map
            if (tex.image) {
              size += tex.image.width * tex.image.height * 4
            }
          }
        }
      })
      return Math.ceil(size / 1024 / 1024)
    }

    return 1  // 默认1MB
  }

  /**
   * 获取资源
   */
  get(key) {
    const info = this.resources.get(key)
    if (!info) return null

    // 更新使用统计
    info.lastUsed = Date.now()
    info.useCount++

    const stats = this.usageStats.get(key)
    stats.totalUses++
    stats.lastInterval = Date.now() - stats.lastUsed
    stats.lastUsed = Date.now()

    this.activeReferences.add(key)

    return info.resource
  }

  /**
   * 检查资源是否存在
   */
  has(key) {
    return this.resources.has(key)
  }

  /**
   * 引用资源
   */
  ref(key) {
    this.activeReferences.add(key)
  }

  /**
   * 释放引用
   */
  unref(key) {
    this.activeReferences.delete(key)

    const info = this.resources.get(key)
    if (info && !info.keep && !this.activeReferences.has(key)) {
      // 可以考虑延迟卸载
      setTimeout(() => {
        if (!this.activeReferences.has(key)) {
          this.unload(key)
        }
      }, this.options.unloadDelay)
    }
  }

  /**
   * 更新资源位置
   */
  updatePosition(key, position) {
    const info = this.resources.get(key)
    if (info) {
      info.position.copy(position)
    }
  }

  /**
   * 设置资源优先级
   */
  setPriority(key, priority) {
    const info = this.resources.get(key)
    if (info) {
      info.priority = priority
    }
  }

  /**
   * 锁定资源（防止卸载）
   */
  lock(key) {
    const info = this.resources.get(key)
    if (info) {
      info.keep = true
    }
  }

  /**
   * 解锁资源
   */
  unlock(key) {
    const info = this.resources.get(key)
    if (info) {
      info.keep = false
    }
  }

  /**
   * 卸载资源
   */
  unload(key) {
    const info = this.resources.get(key)
    if (!info) return false

    // 检查是否应该保留
    if (info.keep) {
      console.log(`[SmartResourceManager] Skipping locked resource: ${key}`)
      return false
    }

    // 检查依赖
    for (const depKey of info.dependencies) {
      if (this.activeReferences.has(depKey)) {
        console.log(`[SmartResourceManager] Resource has active dependencies: ${key}`)
        return false
      }
    }

    // 清理资源
    this.disposeResource(info.resource, info.type)

    // 从映射中移除
    this.resources.delete(key)
    this.resourcesByType.get(info.type)?.delete(key)
    this.usageStats.delete(key)
    this.activeReferences.delete(key)

    // 更新内存
    this.memoryUsed -= info.size

    console.log(`[SmartResourceManager] Unloaded: ${key} (${this.formatSize(info.size)})`)

    // 回调
    if (this.onUnload) {
      this.onUnload(key, info)
    }

    return true
  }

  /**
   * 清理资源对象
   */
  disposeResource(resource, type) {
    switch (type) {
      case 'texture':
      case 'video':
        if (resource.dispose) resource.dispose()
        break
      case 'geometry':
        if (resource.dispose) resource.dispose()
        break
      case 'material':
        if (resource.dispose) resource.dispose()
        break
      case 'mesh':
        this.context.add(resource, 'mesh')
        this.context.clear()
        break
      case 'audio':
        if (resource.stop) resource.stop()
        if (resource.dispose) resource.dispose()
        break
    }
  }

  /**
   * 智能清理
   */
  smartCleanup(camera, options = {}) {
    const now = Date.now()
    const toUnload = []

    this.resources.forEach((info, key) => {
      // 跳过锁定和活跃引用
      if (info.keep || this.activeReferences.has(key)) return

      // 跳过关键资源
      if (info.priority === 'critical') return

      let shouldUnload = false

      // 1. 时间检查（长时间未使用）
      if (now - info.lastUsed > this.options.unloadDelay) {
        shouldUnload = true
      }

      // 2. 距离检查
      if (this.options.enableDistanceCheck && camera && info.position) {
        const distance = camera.position.distanceTo(info.position)
        if (distance > this.options.distanceThreshold) {
          shouldUnload = true
        }
      }

      // 3. 内存压力
      if (this.memoryUsed > this.options.maxMemoryMB) {
        shouldUnload = true
      }

      // 4. 使用频率低
      const stats = this.usageStats.get(key)
      if (stats && stats.totalUses < 2) {
        shouldUnload = true
      }

      if (shouldUnload) {
        toUnload.push({ key, score: this.calculateUnloadScore(info, stats) })
      }
    })

    // 按分数排序卸载
    toUnload.sort((a, b) => b.score - a.score)

    // 卸载直到内存充足
    for (const { key } of toUnload) {
      if (this.memoryUsed < this.options.maxMemoryMB * 0.8) break
      this.unload(key)
    }
  }

  /**
   * 计算卸载分数（越高优先卸载）
   */
  calculateUnloadScore(info, stats) {
    let score = 0

    // 时间因素
    const timeSinceLastUse = (Date.now() - info.lastUsed) / 1000
    score += Math.log(timeSinceLastUse + 1) * 10

    // 优先级因素
    const priorityScore = {
      'critical': -100,
      'high': -50,
      'normal': 0,
      'low': 50
    }
    score += priorityScore[info.priority] || 0

    // 大小因素
    score += info.size * 2

    // 使用频率因素
    const useFrequency = stats ? stats.totalUses / Math.max(1, (Date.now() - stats.firstUsed) / 1000) : 0
    score -= useFrequency * 100

    return score
  }

  /**
   * 强制清理
   */
  forceCleanup() {
    const toUnload = Array.from(this.resources.keys())

    for (const key of toUnload) {
      this.unload(key)
    }
  }

  /**
   * 按类型清理
   */
  cleanupByType(type) {
    const keys = this.resourcesByType.get(type)
    if (!keys) return 0

    let count = 0
    for (const key of keys) {
      if (this.unload(key)) {
        count++
      }
    }

    return count
  }

  /**
   * 清理低优先级资源
   */
  cleanupLowPriority() {
    let count = 0

    this.resources.forEach((info, key) => {
      if (info.priority === 'low' && !info.keep) {
        if (this.unload(key)) {
          count++
        }
      }
    })

    return count
  }

  /**
   * 开始内存检查
   */
  startMemoryCheck() {
    if (this.checkInterval) return

    this.checkInterval = setInterval(() => {
      this.checkMemory()
    }, this.options.memoryCheckInterval)
  }

  /**
   * 停止内存检查
   */
  stopMemoryCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  /**
   * 检查内存
   */
  checkMemory() {
    // 获取浏览器内存信息
    let browserMemory = 0
    if (performance.memory) {
      browserMemory = performance.memory.usedJSHeapSize / 1048576
    }

    const totalMemory = this.memoryUsed + browserMemory
    const percentage = totalMemory / this.options.maxMemoryMB * 100

    if (percentage > 90) {
      console.warn(`[SmartResourceManager] Memory critical: ${percentage.toFixed(1)}%`)
      this.forceCleanup()

      if (this.onMemoryWarning) {
        this.onMemoryWarning('critical', totalMemory)
      }
    } else if (percentage > 75) {
      console.warn(`[SmartResourceManager] Memory warning: ${percentage.toFixed(1)}%`)
      this.cleanupLowPriority()

      if (this.onMemoryWarning) {
        this.onMemoryWarning('warning', totalMemory)
      }
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const typeStats = {}

    this.resourcesByType.forEach((keys, type) => {
      typeStats[type] = keys.size
    })

    return {
      totalResources: this.resources.size,
      totalMemory: this.memoryUsed,
      memoryPeak: this.memoryPeak,
      memoryLimit: this.options.maxMemoryMB,
      memoryUsage: (this.memoryUsed / this.options.maxMemoryMB * 100).toFixed(1) + '%',
      activeReferences: this.activeReferences.size,
      byType: typeStats,
      topUsed: this.getTopUsedResources(5)
    }
  }

  /**
   * 获取最常用资源
   */
  getTopUsedResources(count = 10) {
    const sorted = Array.from(this.usageStats.entries())
      .sort((a, b) => b[1].totalUses - a[1].totalUses)
      .slice(0, count)
      .map(([key, stats]) => ({
        key,
        uses: stats.totalUses,
        size: this.resources.get(key)?.size || 0
      }))

    return sorted
  }

  /**
   * 格式化大小
   */
  formatSize(bytes) {
    if (bytes < 1) return '1KB'
    if (bytes < 1024) return `${bytes.toFixed(1)}MB`
    return `${(bytes / 1024).toFixed(2)}GB`
  }

  /**
   * 导出资源信息
   */
  exportInfo() {
    const info = {
      resources: [],
      stats: this.getStats()
    }

    this.resources.forEach((resInfo, key) => {
      info.resources.push({
        key,
        type: resInfo.type,
        size: resInfo.size,
        priority: resInfo.priority,
        useCount: resInfo.useCount,
        lastUsed: new Date(resInfo.lastUsed).toISOString()
      })
    })

    return info
  }

  /**
   * 清理所有资源
   */
  dispose() {
    this.stopMemoryCheck()
    this.forceCleanup()
    this.context.clear()
  }
}

/**
 * 纹理LOD管理器
 */
export class TextureLODManager extends SmartResourceManager {
  constructor(options = {}) {
    super(options)
    this.lodTextures = new Map()
  }

  /**
   * 注册LOD纹理
   */
  registerLOD(key, textures, options = {}) {
    const lodInfo = {
      key,
      textures: {
        low: textures.low,
        medium: textures.medium,
        high: textures.high,
        ultra: textures.ultra
      },
      currentLevel: 'high',
      ...options
    }

    this.lodTextures.set(key, lodInfo)

    // 注册所有LOD级别
    Object.values(textures).forEach((texture, index) => {
      this.register(`${key}_${index}`, texture, {
        type: 'texture',
        priority: options.priority || 'normal',
        keep: true
      })
    })

    return lodInfo
  }

  /**
   * 设置LOD级别
   */
  setLODLevel(key, level) {
    const lodInfo = this.lodTextures.get(key)
    if (!lodInfo) return false

    const texture = lodInfo.textures[level]
    if (!texture) return false

    // 释放旧纹理
    if (lodInfo.currentLevel !== level) {
      this.unload(`${key}_${lodInfo.currentLevel}`)
      this.activeReferences.delete(`${key}_${lodInfo.currentLevel}`)
    }

    lodInfo.currentLevel = level
    this.activeReferences.add(`${key}_${level}`)

    return texture
  }

  /**
   * 根据距离自动切换LOD
   */
  autoLOD(key, camera, thresholds = { high: 50, medium: 100, low: 200 }) {
    const info = this.resources.get(key)
    if (!info || !info.position) return

    const distance = camera.position.distanceTo(info.position)

    let level
    if (distance < thresholds.high) level = 'ultra'
    else if (distance < thresholds.medium) level = 'high'
    else if (distance < thresholds.low) level = 'medium'
    else level = 'low'

    this.setLODLevel(key, level)
  }
}

export default SmartResourceManager
