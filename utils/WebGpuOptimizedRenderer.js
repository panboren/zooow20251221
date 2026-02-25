/**
 * 优化的 WebGPU 渲染器包装器
 * 提供性能监控、自适应质量、错误处理等功能
 */

import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'

/**
 * WebGPU 渲染器状态
 */
export const RendererState = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  RENDERING: 'rendering',
  ERROR: 'error',
  DISPOSED: 'disposed'
}

/**
 * 渲染质量配置
 */
export const QualityPresets = {
  low: {
    pixelRatio: 1,
    antialias: false,
    shadowsEnabled: false,
    toneMapping: THREE.LinearToneMapping,
    sampleCount: 1
  },
  medium: {
    pixelRatio: window.devicePixelRatio > 1 ? 1.5 : 1,
    antialias: true,
    shadowsEnabled: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    sampleCount: 4
  },
  high: {
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    antialias: true,
    shadowsEnabled: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    sampleCount: 4
  },
  ultra: {
    pixelRatio: Math.min(window.devicePixelRatio, 3),
    antialias: true,
    shadowsEnabled: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    sampleCount: 8
  }
}

/**
 * 优化的 WebGPU 渲染器
 */
export class OptimizedWebGPURenderer {
  constructor(options = {}) {
    this.options = {
      enablePerformanceMonitoring: true,
      enableAdaptiveQuality: true,
      enableErrorRecovery: true,
      targetFPS: 60,
      minFPS: 30,
      ...options
    }

    this.renderer = null
    this.state = RendererState.INITIALIZING
    this.currentQuality = 'medium'
    this.performanceMetrics = {
      fps: 0,
      frameTime: 0,
      frameCount: 0,
      lastFPSUpdate: 0
    }

    this.errorCallbacks = []
    this.qualityChangeCallbacks = []

    this._initRenderer(options)
  }

  /**
   * 初始化渲染器
   */
  async _initRenderer(options) {
    try {
      // 创建 WebGPU 渲染器
      const rendererOptions = {
        antialias: options.antialias ?? false,
        alpha: options.alpha ?? false,
        powerPreference: options.powerPreference ?? 'high-performance',
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        ...options.rendererOptions
      }

      this.renderer = new WebGPURenderer(rendererOptions)
      this.renderer.setPixelRatio(QualityPresets.medium.pixelRatio)
      this.renderer.setSize(options.width || window.innerWidth, options.height || window.innerHeight)

      // 设置颜色空间
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = options.toneMappingExposure ?? 1.3

      // 禁用不需要的功能以提升性能
      this.renderer.autoClear = options.autoClear ?? true
      this.renderer.autoClearColor = options.autoClearColor ?? true
      this.renderer.autoClearDepth = options.autoClearDepth ?? true

      this.state = RendererState.READY
      console.log('✅ WebGPU 渲染器初始化成功')

    } catch (error) {
      console.error('WebGPU 渲染器初始化失败:', error)
      this.state = RendererState.ERROR
      this._notifyError(error)
      throw error
    }
  }

  /**
   * 渲染场景
   */
  render(scene, camera, deltaTime = 0) {
    if (this.state !== RendererState.READY && this.state !== RendererState.RENDERING) {
      console.warn('渲染器未就绪，跳过渲染')
      return
    }

    this.state = RendererState.RENDERING

    try {
      const startTime = performance.now()

      this.renderer.render(scene, camera)

      const frameTime = performance.now() - startTime

      // 更新性能指标
      if (this.options.enablePerformanceMonitoring) {
        this._updatePerformanceMetrics(frameTime)
      }

      // 自适应质量调整
      if (this.options.enableAdaptiveQuality) {
        this._adaptiveQualityAdjustment()
      }

    } catch (error) {
      console.error('渲染失败:', error)
      this.state = RendererState.ERROR
      this._notifyError(error)

      if (this.options.enableErrorRecovery) {
        this._attemptRecovery()
      }
    }

    this.state = RendererState.READY
  }

  /**
   * 更新性能指标
   */
  _updatePerformanceMetrics(frameTime) {
    this.performanceMetrics.frameTime = frameTime
    this.performanceMetrics.frameCount++

    const now = performance.now()
    if (now - this.performanceMetrics.lastFPSUpdate > 1000) {
      this.performanceMetrics.fps = this.performanceMetrics.frameCount * 1000 / (now - this.performanceMetrics.lastFPSUpdate)
      this.performanceMetrics.frameCount = 0
      this.performanceMetrics.lastFPSUpdate = now

      // FPS 过低警告
      if (this.performanceMetrics.fps < this.options.minFPS) {
        console.warn(`⚠️ FPS 过低: ${this.performanceMetrics.fps.toFixed(1)}`)
      }
    }
  }

  /**
   * 自适应质量调整
   */
  _adaptiveQualityAdjustment() {
    if (this.performanceMetrics.fps < this.options.minFPS && this.currentQuality !== 'low') {
      const qualities = ['ultra', 'high', 'medium', 'low']
      const currentIndex = qualities.indexOf(this.currentQuality)
      if (currentIndex < qualities.length - 1) {
        this.setQuality(qualities[currentIndex + 1])
      }
    } else if (this.performanceMetrics.fps > this.options.targetFPS && this.currentQuality !== 'ultra') {
      const qualities = ['ultra', 'high', 'medium', 'low']
      const currentIndex = qualities.indexOf(this.currentQuality)
      if (currentIndex > 0) {
        this.setQuality(qualities[currentIndex - 1])
      }
    }
  }

  /**
   * 设置渲染质量
   */
  setQuality(quality) {
    if (!QualityPresets[quality]) {
      console.warn(`未知的质量预设: ${quality}`)
      return
    }

    const preset = QualityPresets[quality]
    const oldQuality = this.currentQuality
    this.currentQuality = quality

    // 应用质量设置
    this.renderer.setPixelRatio(preset.pixelRatio)

    this.qualityChangeCallbacks.forEach(callback => {
      callback(quality, oldQuality, preset)
    })

    console.log(`🎨 渲染质量已调整: ${oldQuality} → ${quality}`)
  }

  /**
   * 错误恢复尝试
   */
  async _attemptRecovery() {
    console.log('🔄 尝试错误恢复...')

    try {
      // 清理当前渲染器
      if (this.renderer) {
        this.renderer.dispose()
      }

      // 重新初始化
      await this._initRenderer(this.options)

      console.log('✅ 错误恢复成功')
    } catch (error) {
      console.error('❌ 错误恢复失败:', error)
    }
  }

  /**
   * 通知错误回调
   */
  _notifyError(error) {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (err) {
        console.error('错误回调执行失败:', err)
      }
    })
  }

  /**
   * 添加错误回调
   */
  onError(callback) {
    this.errorCallbacks.push(callback)
    return () => {
      const index = this.errorCallbacks.indexOf(callback)
      if (index > -1) {
        this.errorCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * 添加质量变化回调
   */
  onQualityChange(callback) {
    this.qualityChangeCallbacks.push(callback)
    return () => {
      const index = this.qualityChangeCallbacks.indexOf(callback)
      if (index > -1) {
        this.qualityChangeCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics }
  }

  /**
   * 获取渲染器
   */
  getRenderer() {
    return this.renderer
  }

  /**
   * 设置尺寸
   */
  setSize(width, height) {
    if (this.renderer) {
      this.renderer.setSize(width, height)
    }
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.renderer) {
      this.renderer.dispose()
    }
    this.state = RendererState.DISPOSED
    this.errorCallbacks = []
    this.qualityChangeCallbacks = []

    console.log('✅ WebGPU 渲染器已清理')
  }
}

/**
 * 创建优化的渲染器
 */
export function createOptimizedRenderer(options = {}) {
  return new OptimizedWebGPURenderer(options)
}
