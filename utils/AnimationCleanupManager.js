/**
 * 动画清理管理器
 * 统一管理动画资源的清理，防止内存泄漏
 */

export class AnimationCleanupManager {
  constructor() {
    this.objects = []
    this.animationIds = []
    this.timelines = []
    this.timers = []
    this.eventListeners = []
  }

  /**
   * 添加需要清理的对象
   */
  addObject(obj) {
    this.objects.push(obj)
    return obj
  }

  /**
   * 添加需要取消的动画 ID
   */
  addAnimationId(id) {
    if (id) {
      this.animationIds.push(id)
    }
    return id
  }

  /**
   * 添加需要清理的 GSAP 时间线
   */
  addTimeline(timeline) {
    if (timeline) {
      this.timelines.push(timeline)
    }
    return timeline
  }

  /**
   * 添加需要清理的定时器
   */
  addTimer(timer) {
    if (timer) {
      this.timers.push(timer)
    }
    return timer
  }

  /**
   * 添加需要移除的事件监听器
   */
  addEventListener(target, event, handler) {
    if (target && event && handler) {
      this.eventListeners.push({ target, event, handler })
    }
  }

  /**
   * 清理所有资源
   */
  cleanup() {
    // 清理对象
    this.objects.forEach(obj => {
      try {
        if (obj.geometry) {
          obj.geometry.dispose()
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      } catch (error) {
        console.warn('清理对象失败:', error)
      }
    })

    // 取消动画帧
    this.animationIds.forEach(id => {
      try {
        if (id) {
          cancelAnimationFrame(id)
        }
      } catch (error) {
        console.warn('取消动画帧失败:', error)
      }
    })

    // 清理 GSAP 时间线
    this.timelines.forEach(timeline => {
      try {
        if (timeline && timeline.kill) {
          timeline.kill()
        }
      } catch (error) {
        console.warn('清理时间线失败:', error)
      }
    })

    // 清理定时器
    this.timers.forEach(timer => {
      try {
        if (timer) {
          clearTimeout(timer)
          clearInterval(timer)
        }
      } catch (error) {
        console.warn('清理定时器失败:', error)
      }
    })

    // 移除事件监听器
    this.eventListeners.forEach(({ target, event, handler }) => {
      try {
        if (target && event && handler) {
          target.removeEventListener(event, handler)
        }
      } catch (error) {
        console.warn('移除事件监听器失败:', error)
      }
    })

    // 清空数组
    this.objects = []
    this.animationIds = []
    this.timelines = []
    this.timers = []
    this.eventListeners = []
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      objects: this.objects.length,
      animationIds: this.animationIds.length,
      timelines: this.timelines.length,
      timers: this.timers.length,
      eventListeners: this.eventListeners.length
    }
  }
}

/**
 * 创建性能优化器
 */
export class PerformanceOptimizer {
  constructor() {
    this.fps = 60
    this.frameTime = 16.67
    this.lastTime = performance.now()
    this.frameCount = 0
    this.sampleSize = 60
    this.samples = []
  }

  /**
   * 更新 FPS
   */
  updateFPS() {
    const now = performance.now()
    const delta = now - this.lastTime

    this.frameCount++

    if (this.frameCount >= this.sampleSize) {
      const averageFrameTime = delta / this.sampleSize
      this.fps = Math.round(1000 / averageFrameTime)
      this.frameTime = averageFrameTime

      this.frameCount = 0
      this.lastTime = now
    }

    return this.fps
  }

  /**
   * 检查是否需要性能降级
   */
  needsDowngrade() {
    return this.fps < 30
  }

  /**
   * 获取降级比例
   */
  getDowngradeRatio() {
    if (this.fps >= 55) return 1.0
    if (this.fps >= 45) return 0.75
    if (this.fps >= 30) return 0.5
    return 0.25
  }

  /**
   * 计算优化后的粒子数量
   */
  getOptimizedParticleCount(originalCount) {
    const ratio = this.getDowngradeRatio()
    return Math.max(Math.floor(originalCount * ratio), 100)
  }

  /**
   * 建议是否跳过此帧
   */
  shouldSkipFrame() {
    return this.fps < 20 && this.frameCount % 2 !== 0
  }

  /**
   * 获取性能状态
   */
  getStatus() {
    if (this.fps >= 55) return '优秀'
    if (this.fps >= 45) return '良好'
    if (this.fps >= 30) return '中等'
    if (this.fps >= 20) return '较差'
    return '严重'
  }
}

/**
 * 创建优化的粒子系统
 */
export class OptimizedParticleSystem {
  constructor(scene, options = {}) {
    const {
      count = 1000,
      maxSize = 10,
      useInstancedMesh = count > 10000
    } = options

    this.scene = scene
    this.count = count
    this.maxSize = maxSize
    this.useInstancedMesh = useInstancedMesh
    this.cleanupManager = new AnimationCleanupManager()

    if (useInstancedMesh) {
      this._createInstancedMesh()
    } else {
      this._createPoints()
    }
  }

  /**
   * 创建优化的 Points 粒子系统
   */
  _createPoints() {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.count * 3)
    const colors = new Float32Array(this.count * 3)
    const sizes = new Float32Array(this.count)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: this.maxSize,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })

    this.points = new THREE.Points(geometry, material)
    this.scene.add(this.points)

    this.cleanupManager.addObject(this.points)
  }

  /**
   * 创建 InstancedMesh 粒子系统
   */
  _createInstancedMesh() {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    this.mesh = new THREE.InstancedMesh(geometry, material, this.count)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    this.dummy = new THREE.Object3D()

    this.scene.add(this.mesh)

    this.cleanupManager.addObject(this.mesh)
  }

  /**
   * 设置粒子位置
   */
  setPositions(positions) {
    if (this.useInstancedMesh) {
      for (let i = 0; i < this.count; i++) {
        const idx = i * 3
        this.dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2])
        this.dummy.updateMatrix()
        this.mesh.setMatrixAt(i, this.dummy.matrix)
      }
      this.mesh.instanceMatrix.needsUpdate = true
    } else {
      const positionsAttr = this.points.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i++) {
        positionsAttr[i] = positions[i]
      }
      this.points.geometry.attributes.position.needsUpdate = true
    }
  }

  /**
   * 设置粒子颜色
   */
  setColors(colors) {
    if (this.useInstancedMesh) {
      const colorObj = new THREE.Color()
      for (let i = 0; i < this.count; i++) {
        const idx = i * 3
        colorObj.setRGB(colors[idx], colors[idx + 1], colors[idx + 2])
        this.mesh.setColorAt(i, colorObj)
      }
      if (this.mesh.instanceColor) {
        this.mesh.instanceColor.needsUpdate = true
      }
    } else {
      const colorsAttr = this.points.geometry.attributes.color.array
      for (let i = 0; i < colors.length; i++) {
        colorsAttr[i] = colors[i]
      }
      this.points.geometry.attributes.color.needsUpdate = true
    }
  }

  /**
   * 清理资源
   */
  dispose() {
    this.cleanupManager.cleanup()
    this.points = null
    this.mesh = null
    this.dummy = null
  }
}

/**
 * 数学计算优化工具
 */
export class MathOptimizer {
  constructor() {
    this.sinCache = new Map()
    this.cosCache = new Map()
    this.cacheSize = 360
    this._initCache()
  }

  /**
   * 初始化缓存
   */
  _initCache() {
    for (let i = 0; i < this.cacheSize; i++) {
      const radians = (i * Math.PI) / 180
      this.sinCache.set(i, Math.sin(radians))
      this.cosCache.set(i, Math.cos(radians))
    }
  }

  /**
   * 获取缓存的 sin 值
   */
  sin(degrees) {
    const key = Math.round(degrees) % this.cacheSize
    return this.sinCache.get(key) || Math.sin((degrees * Math.PI) / 180)
  }

  /**
   * 获取缓存的 cos 值
   */
  cos(degrees) {
    const key = Math.round(degrees) % this.cacheSize
    return this.cosCache.get(key) || Math.cos((degrees * Math.PI) / 180)
  }

  /**
   * 距离计算（使用平方距离避免 sqrt）
   */
  distanceSquared(x1, y1, x2, y2) {
    const dx = x2 - x1
    const dy = y2 - y1
    return dx * dx + dy * dy
  }

  /**
   * 快速随机数
   */
  random(min = 0, max = 1) {
    return min + Math.random() * (max - min)
  }

  /**
   * 线性插值
   */
  lerp(start, end, t) {
    return start + (end - start) * t
  }
}

export default AnimationCleanupManager
