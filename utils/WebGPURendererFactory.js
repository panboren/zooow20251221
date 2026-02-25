/**
 * WebGPU 渲染器工厂
 * 自动检测并创建最优的渲染器（WebGPU 或 WebGL2）
 * 提供统一的渲染器接口，简化特效系统的渲染器适配
 */

import * as THREE from 'three'
// WebGPU 渲染器 (Three.js r183+)
import { WebGPURenderer } from 'three/webgpu'

export class RendererFactory {
  constructor() {
    this.preferredRenderer = 'webgpu'
    this.fallbackRenderer = 'webgl2'
    this.currentRenderer = null
    this.rendererType = null
  }

  /**
   * 检查 WebGPU 支持
   */
  async checkWebGPUSupport() {
    if (!navigator.gpu) {
      console.log('ℹ️  WebGPU not supported by browser, will use WebGL2')
      return false
    }

    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        console.log('ℹ️  No WebGPU adapter found, will use WebGL2')
        return false
      }

      console.log('ℹ️  WebGPU is available in browser')
      return true
    } catch (error) {
      console.log('ℹ️  WebGPU initialization error, will use WebGL2:', error.message)
      return false
    }
  }

  /**
   * 检查 WebGL2 支持
   */
  checkWebGL2Support() {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')

    if (!gl) {
      console.warn('WebGL2 is not supported')
      return false
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      console.log('WebGL2 Renderer:', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
    }

    return true
  }

  /**
   * 创建渲染器
   * @param {Object} options - 渲染器配置
   * @param {boolean} options.forceWebGPU - 强制使用 WebGPU
   * @param {boolean} options.forceWebGL - 强制使用 WebGL2
   * @param {HTMLCanvasElement} options.canvas - 画布元素
   * @returns {Promise<THREE.WebGLRenderer>}
   */
  async createRenderer(options = {}) {
    const {
      forceWebGPU = false,
      forceWebGL = false,
      canvas = null,
      ...rendererOptions
    } = options

    // 强制使用 WebGPU
    if (forceWebGPU) {
      if (await this.checkWebGPUSupport()) {
        try {
          const renderer = await this.createWebGPURenderer(canvas, rendererOptions)
          this.currentRenderer = renderer
          this.rendererType = 'webgpu'
          console.log('✓ WebGPU renderer created successfully')
          return renderer
        } catch (error) {
          console.error('Failed to create WebGPU renderer:', error)
          throw new Error('WebGPU renderer creation failed')
        }
      } else {
        throw new Error('WebGPU is not supported')
      }
    }

    // 强制使用 WebGL
    if (forceWebGL) {
      if (this.checkWebGL2Support()) {
        const renderer = this.createWebGLRenderer(canvas, rendererOptions)
        this.currentRenderer = renderer
        this.rendererType = 'webgl2'
        console.log('✓ WebGL2 renderer created (forced)')
        return renderer
      } else {
        throw new Error('WebGL2 is not supported')
      }
    }

    // 优先使用 WebGPU，回退到 WebGL2
    if (this.preferredRenderer === 'webgpu') {
      if (await this.checkWebGPUSupport()) {
        try {
          const renderer = await this.createWebGPURenderer(canvas, rendererOptions)
          this.currentRenderer = renderer
          this.rendererType = 'webgpu'
          console.log('✓ WebGPU renderer created successfully')
          return renderer
        } catch (error) {
          console.error('WebGPU creation failed, falling back to WebGL2:', error)
        }
      }
    }

    // 回退到 WebGL2
    if (this.checkWebGL2Support()) {
      const renderer = this.createWebGLRenderer(canvas, rendererOptions)
      this.currentRenderer = renderer
      this.rendererType = 'webgl2'
      console.log('✓ WebGL2 renderer created')
      return renderer
    }

    throw new Error('No supported renderer found (neither WebGPU nor WebGL2)')
  }

  /**
   * 创建 WebGPU 渲染器
   * 使用 Three.js r183+ WebGPURenderer API
   */
  async createWebGPURenderer(canvas, options = {}) {
    // 检查 WebGPURenderer 是否可用
    if (typeof WebGPURenderer === 'undefined') {
      throw new Error('WebGPURenderer not available in this Three.js version')
    }

    try {
      // 准备 WebGPU 渲染器配置
      const rendererOptions = {
        canvas: canvas,
        antialias: options.antialias ?? false,
        alpha: options.alpha ?? true,
        logarithmicDepthBuffer: options.logarithmicDepthBuffer ?? false,
        sampleCount: options.sampleCount ?? 1,
        powerPreference: options.powerPreference ?? 'high-performance',
        ...options
      }

      // 创建 WebGPU 渲染器
      const renderer = new WebGPURenderer(rendererOptions)

      // Three.js r183+ WebGPURenderer 不需要 init()
      console.log('✓ WebGPU renderer created successfully (Three.js r183+)')

      // 颜色空间配置
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = options.toneMappingExposure ?? 1.3

      // 渲染状态
      renderer.autoClear = options.autoClear ?? true
      renderer.autoClearColor = options.autoClearColor ?? true
      renderer.autoClearDepth = options.autoClearDepth ?? true

      // 输出 WebGPU 特性
      if (renderer.capabilities) {
        console.log('🚀 WebGPU Capabilities:', {
          maxTextureDimension2D: renderer.capabilities.maxTextureDimension2D,
          maxComputeWorkgroupsPerDimension: renderer.capabilities.maxComputeWorkgroupsPerDimension,
          isWebGPU: true
        })
      }

      return renderer
    } catch (error) {
      console.error('❌ Failed to create WebGPU renderer:', error)
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      throw new Error('WebGPU renderer creation failed: ' + error.message)
    }
  }

  /**
   * 创建 WebGL2 渲染器
   */
  createWebGLRenderer(canvas, options = {}) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: options.antialias ?? false,
      alpha: options.alpha ?? true,
      powerPreference: options.powerPreference ?? 'high-performance',
      precision: options.precision ?? 'mediump',
      stencil: options.stencil ?? false,
      depth: options.depth ?? true,
      logarithmicDepthBuffer: options.logarithmicDepthBuffer ?? false,
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
      ...options
    })

    // WebGL 特定配置
    renderer.setPixelRatio(options.pixelRatio ?? Math.min(window.devicePixelRatio, 1.5))

    // 颜色空间配置
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = options.toneMappingExposure ?? 1.3

    // 阴影配置（默认关闭以提升性能）
    renderer.shadowMap.enabled = options.shadowMap ?? false
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 物理灯光（默认关闭）
    renderer.physicallyCorrectLights = options.physicallyCorrectLights ?? false

    return renderer
  }

  /**
   * 获取当前渲染器类型
   */
  getRendererType() {
    return this.rendererType
  }

  /**
   * 判断是否为 WebGPU 渲染器
   */
  isWebGPU() {
    return this.rendererType === 'webgpu'
  }

  /**
   * 判断是否为 WebGL2 渲染器
   */
  isWebGL2() {
    return this.rendererType === 'webgl2'
  }

  /**
   * 获取渲染器信息
   */
  getRendererInfo() {
    if (!this.currentRenderer) return null

    return {
      type: this.rendererType,
      isWebGPU: this.isWebGPU(),
      isWebGL2: this.isWebGL2(),
      capabilities: this.currentRenderer.capabilities,
      info: this.currentRenderer.info
    }
  }

  /**
   * 清理渲染器
   */
  dispose() {
    if (this.currentRenderer) {
      this.currentRenderer.dispose()
      this.currentRenderer = null
    }
    this.rendererType = null
  }
}

// 单例模式
let rendererFactoryInstance = null

export function getRendererFactory() {
  if (!rendererFactoryInstance) {
    rendererFactoryInstance = new RendererFactory()
  }
  return rendererFactoryInstance
}

/**
 * 创建兼容的着色器材质
 * 根据渲染器类型创建适配的材质
 */
export function createCompatibleShaderMaterial(vertexShader, fragmentShader, uniforms = {}, rendererType = 'webgl2') {
  // 当前 WebGL2 和 WebGPU 都使用 ShaderMaterial
  // 但需要提供正确的着色器语言
  return new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms
  })
}

/**
 * GLSL 转 WGSL 转换器（简化版）
 * 注意：完整转换需要复杂的解析器，这里提供基础支持
 * 建议：为 WebGPU 编写专门的 WGSL 着色器
 */
export function convertGLSLToWGSL(glsl) {
  // 基础类型转换
  let wgsl = glsl
    .replace(/\bvec2\b/g, 'vec2<f32>')
    .replace(/\bvec3\b/g, 'vec3<f32>')
    .replace(/\bvec4\b/g, 'vec4<f32>')
    .replace(/\bmat2\b/g, 'mat2x2<f32>')
    .replace(/\bmat3\b/g, 'mat3x3<f32>')
    .replace(/\bmat4\b/g, 'mat4x4<f32>')
    .replace(/\bfloat\b/g, 'f32')
    .replace(/\bint\b/g, 'i32')
    .replace(/\bbool\b/g, 'bool')
    .replace(/\bvoid\b/g, 'fn')
    .replace(/\bgl_Position\b/g, 'output.position')
    .replace(/\bgl_FragColor\b/g, 'output.color')
    .replace(/\bgl_FragCoord\b/g, 'fragment_coords')
    .replace(/\btexture2D\b/g, 'textureSample')
    .replace(/\buniform\b/g, 'uniform')
    .replace(/\bvarying\b/g, 'varying')

  return wgsl
}
