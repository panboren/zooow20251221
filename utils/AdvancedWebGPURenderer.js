/**
 * 高级 WebGPU 渲染器
 * 基于 Three.js r183 源码的深度优化实现
 * 
 * 核心特性：
 * 1. 自动材质兼容性检测
 * 2. GLSL 到 WGSL 自动转换
 * 3. 渲染性能优化
 * 4. 完整的错误处理和降级
 */

import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { 
  MaterialCompatibilityChecker, 
  GLSLToWGSLConverter,
  WebGPURendererOptimizer,
  WebGPUDebugger
} from './ThreeJSSourceAnalyzer.js'

/**
 * 高级 WebGPU 渲染器
 * 集成了材质兼容性检查、着色器转换和性能优化
 */
export class AdvancedWebGPURenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.options = {
      antialias: false,
      alpha: true,
      logarithmicDepthBuffer: false,
      sampleCount: 1,
      powerPreference: 'high-performance',
      ...options
    }
    
    this.renderer = null
    this.initialized = false
    this.materialConversionMap = new Map()
    this.performanceStats = {
      frameTime: 0,
      fps: 0,
      drawCalls: 0,
      triangles: 0,
      textureMemory: 0
    }
  }

  /**
   * 初始化 WebGPU 渲染器
   */
  async init() {
    try {
      // 启用 WebGPU 调试层
      WebGPUDebugger.enableDebugLayer()

      // 创建基础 WebGPU 渲染器
      this.renderer = new WebGPURenderer(this.options)

      // 等待 WebGPU 初始化
      await this.renderer.init()

      // 应用性能优化
      WebGPURendererOptimizer.optimizeRenderer(this.renderer, {
        enableCompute: true,
        enableAsyncCompile: true,
        optimizeTextureMemory: true,
        enableTimestampQueries: this.options.debug || false
      })

      // 配置渲染器
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = this.options.toneMappingExposure ?? 1.3

      // 渲染状态
      this.renderer.autoClear = true
      this.renderer.autoClearColor = true
      this.renderer.autoClearDepth = true

      this.initialized = true

      console.log('✅ 高级 WebGPU 渲染器初始化成功')
      console.log('📊 渲染器信息:', this.getRendererInfo())

      return this.renderer
    } catch (error) {
      console.error('❌ WebGPU 渲染器初始化失败:', error)
      throw new Error('WebGPU 初始化失败: ' + error.message)
    }
  }

  /**
   * 扫描并转换场景中的材质
   * 
   * 检测不兼容的材质并自动转换
   */
  async scanAndConvertMaterials(scene) {
    const results = MaterialCompatibilityChecker.scanSceneMaterials(scene)
    
    const incompatible = results.filter(r => !r.compatible)
    const compatible = results.filter(r => r.compatible)

    console.log(`📊 材质扫描结果: ${compatible.length} 兼容, ${incompatible.length} 不兼容`)

    // 转换不兼容的材质
    for (const item of incompatible) {
      const object = scene.getObjectByProperty('uuid', item.object)
      if (object && object.material) {
        const converted = await this.convertMaterial(object.material)
        if (converted) {
          object.material = converted
          console.log(`✅ 已转换材质: ${item.name} (${item.materialType})`)
        } else {
          console.warn(`⚠️ 无法转换材质: ${item.name} (${item.materialType})`)
        }
      }
    }

    return {
      total: results.length,
      compatible: compatible.length,
      incompatible: incompatible.length,
      details: results
    }
  }

  /**
   * 转换材质到 WebGPU 兼容格式
   */
  async convertMaterial(material) {
    // 如果已经是兼容的材质，直接返回
    const check = MaterialCompatibilityChecker.isWebGPUCompatible(material)
    if (check.compatible) {
      return material
    }

    // ShaderMaterial - 尝试转换 GLSL 到 WGSL
    if (material.type === 'ShaderMaterial') {
      const vertexLang = GLSLToWGSLConverter.detectShaderLanguage(material.vertexShader || '')
      const fragmentLang = GLSLToWGSLConverter.detectShaderLanguage(material.fragmentShader || '')

      // 如果是 GLSL，尝试转换
      if (vertexLang === 'glsl' || fragmentLang === 'glsl') {
        console.log('🔄 检测到 GLSL 着色器，正在转换到 WGSL...')

        const vertexWGSL = GLSLToWGSLConverter.convert(material.vertexShader || '', 'vertex')
        const fragmentWGSL = GLSLToWGSLConverter.convert(material.fragmentShader || '', 'fragment')

        const convertedMaterial = material.clone()
        convertedMaterial.vertexShader = vertexWGSL
        convertedMaterial.fragmentShader = fragmentWGSL

        // 标记为已转换
        this.materialConversionMap.set(material.uuid, {
          original: material,
          converted: convertedMaterial,
          timestamp: Date.now()
        })

        return convertedMaterial
      }
    }

    // NodeMaterial - 需要降级
    if (material.type === 'NodeMaterial') {
      console.warn('⚠️ NodeMaterial 需要导入 TSL 模块，建议使用标准材质')
      // 降级为标准材质
      if (material.colorNode) {
        return new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.5,
          metalness: 0.5
        })
      }
    }

    // 无法转换，返回 null
    console.error('❌ 无法转换材质类型:', material.type)
    return null
  }

  /**
   * 智能渲染（带性能优化）
   */
  render(scene, camera) {
    if (!this.initialized || !this.renderer) {
      throw new Error('渲染器未初始化')
    }

    const startTime = performance.now()

    // 执行渲染
    this.renderer.render(scene, camera)

    // 更新性能统计
    const endTime = performance.now()
    this.performanceStats.frameTime = endTime - startTime
    this.performanceStats.fps = 1000 / this.performanceStats.frameTime
    this.performanceStats.drawCalls = this.renderer.info.render.calls
    this.performanceStats.triangles = this.renderer.info.render.triangles

    return {
      frameTime: this.performanceStats.frameTime,
      fps: this.performanceStats.fps,
      drawCalls: this.performanceStats.drawCalls,
      triangles: this.performanceStats.triangles
    }
  }

  /**
   * 获取渲染器详细信息
   */
  getRendererInfo() {
    if (!this.renderer) {
      return null
    }

    return {
      type: 'WebGPU',
      initialized: this.initialized,
      canvas: this.canvas,
      capabilities: this.renderer.capabilities,
      ...WebGPURendererOptimizer.getRendererInfo(this.renderer),
      performance: this.performanceStats
    }
  }

  /**
   * 获取材质兼容性报告
   */
  getMaterialCompatibilityReport(scene) {
    const results = MaterialCompatibilityChecker.scanSceneMaterials(scene)
    
    return {
      totalMaterials: results.length,
      compatible: results.filter(r => r.compatible),
      incompatible: results.filter(r => !r.compatible),
      conversions: Array.from(this.materialConversionMap.entries()).map(([uuid, data]) => ({
        uuid,
        originalType: data.original.type,
        convertedType: data.converted.type,
        timestamp: new Date(data.timestamp).toISOString()
      }))
    }
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer = null
    }
    this.materialConversionMap.clear()
    this.initialized = false
    console.log('🧹 WebGPU 渲染器资源已清理')
  }

  /**
   * 调整尺寸
   */
  setSize(width, height, pixelRatio = window.devicePixelRatio) {
    if (this.renderer) {
      this.renderer.setSize(width, height, false)
      this.renderer.setPixelRatio(pixelRatio)
    }
  }

  /**
   * 设置像素比
   */
  setPixelRatio(pixelRatio) {
    if (this.renderer) {
      this.renderer.setPixelRatio(pixelRatio)
    }
  }

  /**
   * 截图
   */
  getScreenshot() {
    if (this.renderer) {
      return this.renderer.domElement.toDataURL('image/png')
    }
    return null
  }

  /**
   * 启用/禁用自动清除
   */
  setAutoClear(autoClear) {
    if (this.renderer) {
      this.renderer.autoClear = autoClear
    }
  }

  /**
   * 获取渲染目标
   */
  getRenderTarget() {
    return this.renderer?.getRenderTarget?.() || null
  }

  /**
   * 设置渲染目标
   */
  setRenderTarget(renderTarget) {
    if (this.renderer) {
      this.renderer.setRenderTarget(renderTarget)
    }
  }
}

/**
 * 便捷函数：创建高级 WebGPU 渲染器
 */
export async function createAdvancedWebGPURenderer(canvas, options = {}) {
  const advancedRenderer = new AdvancedWebGPURenderer(canvas, options)
  await advancedRenderer.init()
  return advancedRenderer
}

/**
 * 便捷函数：检测并扫描场景
 */
export async function analyzeSceneForWebGPU(scene) {
  return MaterialCompatibilityChecker.scanSceneMaterials(scene)
}

/**
 * 使用示例
 * 
 * // 1. 创建高级渲染器
 * const advancedRenderer = await createAdvancedWebGPURenderer(canvas, {
 *   alpha: true,
 *   antialias: false,
 *   debug: true // 开发模式启用调试
 * })
 * 
 * // 2. 扫描并转换材质
 * const report = await advancedRenderer.scanAndConvertMaterials(scene)
 * console.log('材质兼容性:', report)
 * 
 * // 3. 渲染（带性能统计）
 * const stats = advancedRenderer.render(scene, camera)
 * console.log('FPS:', stats.fps, 'Draw Calls:', stats.drawCalls)
 * 
 * // 4. 获取渲染器信息
 * const info = advancedRenderer.getRendererInfo()
 * console.log('渲染器:', info.type, 'Tier:', info.tier)
 * 
 * // 5. 清理
 * advancedRenderer.dispose()
 */
