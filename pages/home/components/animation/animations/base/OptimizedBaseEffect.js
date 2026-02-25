/**
 * 优化的基础特效类
 * 统一资源管理和性能优化
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { AnimationCleanupManager, PerformanceOptimizer } from '~/utils/AnimationCleanupManager.js'

export class OptimizedBaseEffect {
  constructor(scene, camera, renderer, controls, rendererType = 'webgl2') {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.rendererType = rendererType
    this.controls = controls

    // 检测渲染器类型
    this.isWebGPU = rendererType === 'webgpu'

    // 资源管理
    this.cleanupManager = new AnimationCleanupManager()

    // 性能监控
    this.performanceOptimizer = new PerformanceOptimizer()

    // 动画状态
    this.timeline = null
    this.animationId = null
    this.isActive = false
    this.objectCount = 0
  }

  /**
   * 创建粒子系统（自动优化）
   */
  createParticleSystem(count, options = {}) {
    const {
      maxSize = 8,
      useInstancedMesh = count > 10000,
      colors = [0x00ffff, 0xff00ff, 0xffff00]
    } = options

    // 性能优化：根据当前 FPS 调整粒子数量
    const optimizedCount = this.performanceOptimizer.getOptimizedParticleCount(count)
    console.log(`粒子数量优化: ${count} → ${optimizedCount}`)

    this.objectCount += optimizedCount

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(optimizedCount * 3)
    const particleColors = new Float32Array(optimizedCount * 3)
    const sizes = new Float32Array(optimizedCount)

    const colorPalette = colors.map(c => new THREE.Color(c))

    for (let i = 0; i < optimizedCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b

      sizes[i] = maxSize * (0.5 + Math.random() * 0.5)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: maxSize,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })

    const points = new THREE.Points(geometry, material)
    this.scene.add(points)

    // 注册到清理管理器
    this.cleanupManager.addObject(points)

    return {
      mesh: points,
      geometry,
      material,
      count: optimizedCount,

      updatePositions: (updateFn) => {
        // 性能优化：跳帧
        if (this.performanceOptimizer.shouldSkipFrame()) {
          return
        }

        const positions = geometry.attributes.position.array
        let needsUpdate = false

        for (let i = 0; i < optimizedCount; i++) {
          const idx = i * 3
          const result = updateFn(i, positions[idx], positions[idx + 1], positions[idx + 2])
          if (result) {
            positions[idx] = result.x
            positions[idx + 1] = result.y
            positions[idx + 2] = result.z
            needsUpdate = true
          }
        }

        if (needsUpdate) {
          geometry.attributes.position.needsUpdate = true
        }
      },

      setColor: (index, r, g, b) => {
        const colors = geometry.attributes.color.array
        colors[index * 3] = r
        colors[index * 3 + 1] = g
        colors[index * 3 + 2] = b
        geometry.attributes.color.needsUpdate = true
      },

      setAllColors: (r, g, b) => {
        const colors = geometry.attributes.color.array
        for (let i = 0; i < optimizedCount; i++) {
          colors[i * 3] = r
          colors[i * 3 + 1] = g
          colors[i * 3 + 2] = b
        }
        geometry.attributes.color.needsUpdate = true
      },

      dispose: () => {
        this.scene.remove(points)
        geometry.dispose()
        material.dispose()
      }
    }
  }

  /**
   * 创建几何体
   */
  createMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
    this.cleanupManager.addObject(mesh)
    this.objectCount++
    return mesh
  }

  /**
   * 创建点云
   */
  createPoints(geometry, material) {
    const points = new THREE.Points(geometry, material)
    this.scene.add(points)
    this.cleanupManager.addObject(points)
    this.objectCount++
    return points
  }

  /**
   * 创建线条
   */
  createLine(geometry, material) {
    const line = new THREE.Line(geometry, material)
    this.scene.add(line)
    this.cleanupManager.addObject(line)
    this.objectCount++
    return line
  }

  /**
   * 创建组
   */
  createGroup() {
    const group = new THREE.Group()
    this.scene.add(group)
    this.cleanupManager.addObject(group)
    return group
  }

  /**
   * 创建 GSAP 时间线
   */
  createTimeline(options = {}) {
    this.timeline = gsap.timeline({
      ...options,
      onComplete: () => {
        console.log('动画完成，开始清理...')
        this.cleanup()
        const payload = { success: true, animationId: this.animationId }
        options.onComplete?.(payload)
      },
      onInterrupt: () => {
        console.warn('动画被中断，开始清理...')
        this.cleanup()
        options.onInterrupt?.()
      }
    })

    this.cleanupManager.addTimeline(this.timeline)
    return this.timeline
  }

  /**
   * 启动动画循环
   */
  startAnimationLoop(updateFn) {
    this.isActive = true

    const animate = () => {
      if (!this.isActive) return

      // 更新 FPS
      this.performanceOptimizer.updateFPS()

      // 性能警告
      if (this.performanceOptimizer.fps < 20) {
        console.warn(`FPS 较低: ${this.performanceOptimizer.fps}`)
      }

      // 执行更新函数
      updateFn?.()

      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = this.cleanupManager.addAnimationId(requestAnimationFrame(animate))
  }

  /**
   * 停止动画循环
   */
  stopAnimationLoop() {
    this.isActive = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  /**
   * 清理资源（统一入口）
   */
  cleanup() {
    console.log('开始清理资源...')
    console.log('对象数量:', this.objectCount)

    // 停止动画循环
    this.stopAnimationLoop()

    // 清理所有资源
    this.cleanupManager.cleanup()

    // 输出清理统计
    const stats = this.cleanupManager.getStats()
    console.log('清理统计:', stats)

    // 重置状态
    this.timeline = null
    this.objectCount = 0
  }

  /**
   * 获取性能状态
   */
  getPerformanceStatus() {
    return {
      fps: this.performanceOptimizer.fps,
      status: this.performanceOptimizer.getStatus(),
      downgradeRatio: this.performanceOptimizer.getDowngradeRatio(),
      objectCount: this.objectCount,
      stats: this.cleanupManager.getStats()
    }
  }

  /**
   * 子类必须实现的播放方法
   */
  play() {
    throw new Error('子类必须实现 play 方法')
  }

  /**
   * 子类可选实现的暂停方法
   */
  pause() {
    if (this.timeline) {
      this.timeline.pause()
    }
    this.stopAnimationLoop()
  }

  /**
   * 子类可选实现的恢复方法
   */
  resume() {
    if (this.timeline) {
      this.timeline.resume()
    }
    this.isActive = true
  }

  /**
   * 子类可选实现的停止方法
   */
  stop() {
    this.pause()
    this.cleanup()
  }
}

export default OptimizedBaseEffect
