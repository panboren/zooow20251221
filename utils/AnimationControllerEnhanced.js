/**
 * 动画控制器 - 增强版
 * 集成后处理和性能监控
 */

import * as THREE from 'three'
import { usePostProcessing } from '~/composables/usePostProcessing.js'
import { usePerformanceMonitor } from '~/composables/usePerformanceMonitor.js'

export class AnimationControllerEnhanced {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.composer = null
    this.bloomPass = null
    this.stats = null
    this.animationId = null
    this.currentAnimation = null
  }

  /**
   * 初始化动画系统
   */
  async init(container, enablePostProcessing = true, enablePerformanceMonitor = true) {
    // 创建场景
    this.scene = new THREE.Scene()

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 100

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.5
    container.appendChild(this.renderer.domElement)

    // 初始化后处理
    if (enablePostProcessing) {
      const postProcessing = usePostProcessing(this.renderer, this.scene, this.camera)
      await postProcessing.init()
      this.composer = postProcessing.composer
      this.bloomPass = postProcessing.bloomPass

      // 设置默认 Bloom 参数
      postProcessing.setBloom({
        strength: 1.5,
        radius: 0.4,
        threshold: 0.85
      })
    }

    // 初始化性能监控
    if (enablePerformanceMonitor) {
      const performanceMonitor = usePerformanceMonitor()
      this.stats = performanceMonitor
      performanceMonitor.init()
    }

    // 响应窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this))

    // 启动渲染循环
    this.startRenderLoop()

    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    }
  }

  /**
   * 启动渲染循环
   */
  startRenderLoop() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)

      // 性能监控开始
      if (this.stats) {
        this.stats.start()
      }

      // 渲染
      if (this.composer) {
        // 使用后处理渲染器
        this.composer.render()
      } else {
        // 使用标准渲染器
        this.renderer.render(this.scene, this.camera)
      }

      // 性能监控结束
      if (this.stats) {
        this.stats.end()
      }
    }

    animate()
  }

  /**
   * 停止渲染循环
   */
  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    if (!this.camera || !this.renderer) return

    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  /**
   * 设置 Bloom 强度
   */
  setBloomStrength(strength) {
    if (this.bloomPass) {
      this.bloomPass.strength = strength
    }
  }

  /**
   * 设置 Bloom 半径
   */
  setBloomRadius(radius) {
    if (this.bloomPass) {
      this.bloomPass.radius = radius
    }
  }

  /**
   * 设置 Bloom 阈值
   */
  setBloomThreshold(threshold) {
    if (this.bloomPass) {
      this.bloomPass.threshold = threshold
    }
  }

  /**
   * 设置所有 Bloom 参数
   */
  setBloom({ strength, radius, threshold }) {
    if (this.bloomPass) {
      if (strength !== undefined) this.bloomPass.strength = strength
      if (radius !== undefined) this.bloomPass.radius = radius
      if (threshold !== undefined) this.bloomPass.threshold = threshold
    }
  }

  /**
   * 显示/隐藏性能监控
   */
  togglePerformanceMonitor(visible) {
    if (this.stats) {
      if (visible) {
        this.stats.show()
      } else {
        this.stats.hide()
      }
    }
  }

  /**
   * 清理资源
   */
  dispose() {
    this.stopRenderLoop()

    // 清理性能监控
    if (this.stats) {
      this.stats.destroy()
    }

    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose()
    }

    // 清理场景
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }

    // 移除事件监听
    window.removeEventListener('resize', this.handleResize)
  }
}

/**
 * 创建动画控制器的工厂函数
 */
export function createAnimationControllerEnhanced() {
  return new AnimationControllerEnhanced()
}
