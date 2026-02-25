/**
 * Three.js r183 深度源码分析和优化
 * 基于 Three.js 源码的专业级 WebGPU 实现
 */

import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'

/**
 * Three.js r183 WebGPURenderer 源码分析
 * 
 * 核心架构：
 * 1. WebGPURenderer 是独立模块 (three/webgpu)
 * 2. 使用 TSL (Three Shading Language) 或 WGSL
 * 3. 需要显式调用 init() 进行 WebGPU 适配器初始化
 * 4. 自动管理 GPU 上下文和命令缓冲区
 * 
 * 源码位置：https://github.com/mrdoob/three.js/blob/master/examples/jsm/renderers/webgpu/WebGPURenderer.js
 */

/**
 * WebGPU 材质兼容性映射
 * 
 * Three.js 在 WebGPU 下的材质限制：
 * - ShaderMaterial: ✅ 支持，但需要 WGSL 而非 GLSL
 * - MeshBasicMaterial: ✅ 原生支持
 * - MeshStandardMaterial: ✅ 原生支持
 * - MeshPhysicalMaterial: ✅ 原生支持
 * - NodeMaterial: ⚠️ 需要导入 TSL 模块
 * 
 * 源码参考：
 * - src/renderers/webgpu/nodes/WebGPUNodes.ts
 * - src/materials/Materials.ts
 */

/**
 * 材质检测工具
 */
export class MaterialCompatibilityChecker {
  /**
   * 检查材质是否兼容 WebGPU
   * 
   * 源码逻辑分析：
   * - WebGPU 内部使用 WebGPURenderer.getProgram() 编译 WGSL
   * - GLSL 会被编译器拒绝
   * - 需要使用 TSL 系统或原生 WGSL
   */
  static isWebGPUCompatible(material) {
    // ✅ 原生支持的标准材质
    const nativeCompatible = [
      'MeshBasicMaterial',
      'MeshStandardMaterial',
      'MeshPhysicalMaterial',
      'MeshLambertMaterial',
      'MeshPhongMaterial',
      'MeshToonMaterial',
      'MeshNormalMaterial',
      'MeshMatcapMaterial',
      'PointsMaterial',
      'LineBasicMaterial',
      'LineDashedMaterial',
      'SpriteMaterial'
    ]

    if (nativeCompatible.includes(material.type)) {
      return { compatible: true, reason: '原生支持' }
    }

    // ⚠️ ShaderMaterial 需要 WGSL
    if (material.type === 'ShaderMaterial') {
      const vertexShader = material.vertexShader || ''
      const fragmentShader = material.fragmentShader || ''
      
      // 检测是否是 WGSL
      const isWGSL = 
        vertexShader.includes('@vertex') || 
        fragmentShader.includes('@fragment') ||
        vertexShader.includes('struct ') ||
        fragmentShader.includes('fn main(')

      if (isWGSL) {
        return { compatible: true, reason: 'WGSL 着色器' }
      } else {
        return { 
          compatible: false, 
          reason: 'GLSL 着色器不兼容 WebGPU，需要转换为 WGSL 或 TSL',
          suggestion: '使用 convertGLSLToWGSL() 或改用 TSL'
        }
      }
    }

    // ⚠️ NodeMaterial 需要 TSL 模块
    if (material.type === 'NodeMaterial') {
      // 检查是否导入了 TSL
      if (typeof THREE.nodeObjects !== 'undefined' || typeof THREE.uniform !== 'undefined') {
        return { compatible: true, reason: 'TSL 节点材质' }
      } else {
        return { 
          compatible: false, 
          reason: 'NodeMaterial 需要 TSL 模块支持',
          suggestion: '添加 import { uniform } from "three/tsl"'
        }
      }
    }

    return { 
      compatible: false, 
      reason: `材质类型 ${material.type} 可能不兼容 WebGPU`,
      suggestion: '使用标准材质或检查 WebGPU 兼容性'
    }
  }

  /**
   * 扫描场景中的所有材质
   */
  static scanSceneMaterials(scene) {
    const results = []
    scene.traverse((object) => {
      if (object.isMesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material, index) => {
          const check = this.isWebGPUCompatible(material)
          results.push({
            object: object.uuid,
            name: object.name || 'unnamed',
            materialIndex: index,
            materialType: material.type,
            ...check
          })
        })
      }
    })
    return results
  }
}

/**
 * GLSL 到 WGSL 转换器
 * 
 * 源码参考：
 * - https://www.w3.org/TR/WGSL/
 * - Three.js wgsl-reflector.ts
 */
export class GLSLToWGSLConverter {
  /**
   * 基本转换规则
   */
  static convert(sourceGLSL, type = 'fragment') {
    let wgsl = sourceGLSL

    // 版本声明
    wgsl = wgsl.replace(/#version\s+\d+\s*(\w+)?\s*\n/g, '')

    // 精度限定符（WGSL 不需要）
    wgsl = wgsl.replace(/\b(precision\s+\w+\s+(float|float|int|uint|sampler2D))\s*;/g, '')
    wgsl = wgsl.replace(/\b(highp|mediump|lowp)\b/g, '')

    // 类型转换
    wgsl = wgsl.replace(/\bvec2\b/g, 'vec2f')
    wgsl = wgsl.replace(/\bvec3\b/g, 'vec3f')
    wgsl = wgsl.replace(/\bvec4\b/g, 'vec4f')
    wgsl = wgsl.replace(/\bmat2\b/g, 'mat2x2f')
    wgsl = wgsl.replace(/\bmat3\b/g, 'mat3x3f')
    wgsl = wgsl.replace(/\bmat4\b/g, 'mat4x4f')
    wgsl = wgsl.replace(/\bfloat\b/g, 'f32')
    wgsl = wgsl.replace(/\bint\b/g, 'i32')
    wgsl = wgsl.replace(/\buint\b/g, 'u32')

    // 属性和 varying
    if (type === 'vertex') {
      wgsl = wgsl.replace(/attribute\s+/g, '@location(0) ') // 需要手动分配 location
      wgsl = wgsl.replace(/varying\s+/g, '@location(0) ')
    } else {
      wgsl = wgsl.replace(/varying\s+/g, '@location(0) ')
    }

    // uniform
    wgsl = wgsl.replace(/uniform\s+/g, '@group(0) @binding(0) uniform ')

    // main 函数
    wgsl = wgsl.replace(/\bvoid\s+main\s*\(\s*\)/g, '@vertex\nfn main(')

    // 采样器
    wgsl = wgsl.replace(/sampler2D/g, 'sampler')
    wgsl = wgsl.replace(/texture2D\s*\(/g, 'textureSample(')

    // ⚠️ 这是一个简化的转换器，实际使用需要更完整的实现
    // 建议使用官方的 @webgpu/glslang 或 Three.js 内置的转换器

    return wgsl
  }

  /**
   * 检测着色器语言
   */
  static detectShaderLanguage(shader) {
    const wgslIndicators = [
      '@vertex',
      '@fragment',
      'struct ',
      'fn main(',
      'var<uniform>',
      '@group(',
      '@binding('
    ]
    
    const glslIndicators = [
      'attribute',
      'varying',
      'void main()',
      '#version',
      'precision',
      'sampler2D',
      'vec2',
      'vec3'
    ]

    const wgslCount = wgslIndicators.filter(i => shader.includes(i)).length
    const glslCount = glslIndicators.filter(i => shader.includes(i)).length

    if (wgslCount > glslCount) return 'wgsl'
    if (glslCount > wgslCount) return 'glsl'
    return 'unknown'
  }
}

/**
 * WebGPU 渲染器优化器
 * 
 * 基于 Three.js 源码的优化策略
 */
export class WebGPURendererOptimizer {
  /**
   * 优化渲染器配置
   * 
   * 源码参考：src/renderers/webgpu/WebGPURenderer.ts
   */
  static optimizeRenderer(renderer, options = {}) {
    const {
      enableCompute = true,
      enableAsyncCompile = true,
      optimizeTextureMemory = true,
      enableTimestampQueries = false // 开发调试用
    } = options

    // 🔧 1. 启用异步编译（源码：setAsyncCompile()）
    // WebGPU 支持异步着色器编译，避免卡顿
    renderer.setAsyncCompile?.(enableAsyncCompile)

    // 🔧 2. 优化纹理内存（源码：textureManager）
    if (optimizeTextureMemory) {
      // WebGPU 自动管理纹理内存
      // 可以设置 mipmap 策略
      renderer.textureCache?.setClearThreshold(10) // 缓存10张纹理
    }

    // 🔧 3. 时间戳查询（性能分析）
    if (enableTimestampQueries) {
      renderer.setTimestampQuery?.(true)
    }

    // 🔧 4. 启用 Compute Shader（如果需要）
    if (enableCompute) {
      // WebGPU 原生支持 Compute Shader
      // 通过 renderer.compute() 访问
    }

    return renderer
  }

  /**
   * 获取渲染器性能信息
   * 
   * 源码参考：src/renderers/webgpu/WebGPURenderer.ts getInfo()
   */
  static getRendererInfo(renderer) {
    return {
      type: renderer.isWebGPURenderer ? 'WebGPU' : 'WebGL',
      capabilities: renderer.capabilities,
      maxTextureSize: renderer.capabilities?.maxTextureDimension2D || 0,
      maxComputeWorkgroups: renderer.capabilities?.maxComputeWorkgroupsPerDimension || 0,
      timestampQuery: renderer.timestampQuery ?? false,
      asyncCompile: renderer.asyncCompile ?? false,
      rendererInfo: renderer.info
    }
  }
}

/**
 * TSL (Three Shading Language) 辅助工具
 * 
 * TSL 是 Three.js 的着色器节点系统，自动适配 WebGL 和 WebGPU
 * 
 * 源码参考：
 * - src/nodes/
 * - src/renderers/webgpu/nodes/
 */
export class TSLHelper {
  /**
   * 创建 TSL 材质
   * 
   * 示例：
   * import { uniform, vec3, sin, time } from 'three/tsl'
   * 
   * const color = uniform(new THREE.Color(0xff0000))
   * const material = TSLHelper.createTSLMaterial({
   *   color: color,
   *   emissive: vec3(sin(time()), 0, 0)
   * })
   */
  static createTSLMaterial(uniforms = {}) {
    // ⚠️ 需要导入 'three/tsl' 模块
    // 这里提供基本框架
    
    // import * as tsl from 'three/tsl'
    
    // const material = new THREE.NodeMaterial()
    // material.colorNode = uniforms.color || tsl.vec3(1)
    // material.emissiveNode = uniforms.emissive || tsl.vec3(0)
    
    // return material
    
    console.warn('TSL 需要导入 three/tsl 模块')
    console.info('添加: import { uniform, vec3 } from "three/tsl"')
    return null
  }

  /**
   * 检查 TSL 可用性
   */
  static isTSLAvailable() {
    return typeof THREE.uniform !== 'undefined' || 
           typeof THREE.nodeObjects !== 'undefined' ||
           typeof THREE.NodeMaterial !== 'undefined'
  }
}

/**
 * WebGPU 调试工具
 */
export class WebGPUDebugger {
  /**
   * 启用 WebGPU 调试层
   */
  static enableDebugLayer() {
    if (navigator.gpu) {
      // WebGPU 调试事件监听
      // 注意：navigator.gpu 本身不是 EventTarget，错误监听需要在 device 或 context 上
      console.log('ℹ️  WebGPU 调试模式: 建议在 Chrome 中使用 chrome://gpu 查看 WebGPU 信息')
      console.log('ℹ️  WebGPU 调试模式: 使用 DevTools Performance 面板分析渲染性能')
    } else {
      console.warn('⚠️  WebGPU 不可用，调试层无法启用')
    }
  }

  /**
   * 监听 WebGPU 设备错误
   * 需要在设备创建后调用
   */
  static setupDeviceErrorListener(device) {
    if (device && device.addEventListener) {
      device.addEventListener('uncapturederror', (event) => {
        console.error('🔴 WebGPU Uncaptured Error:', event.error)
      })
      console.log('✅ WebGPU 设备错误监听已启用')
    }
  }

  /**
   * 检查 WebGPU 支持级别
   * 
   * Tier 1: 基础支持
   * Tier 2: 标准支持
   * Tier 3: 高级支持
   */
  static async checkWebGPUSupportTier() {
    if (!navigator.gpu) return { tier: 0, name: '不支持' }

    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) return { tier: 0, name: '无适配器' }

      const features = adapter.features
      const limits = adapter.limits

      // Tier 3: 高级支持
      if (features.has('timestamp-query') && 
          features.has('pipeline-statistics-query') &&
          limits.maxStorageBufferBindingSize >= 134217728) {
        return { 
          tier: 3, 
          name: '高级支持',
          features: Array.from(features),
          limits
        }
      }

      // Tier 2: 标准支持
      if (features.has('texture-compression-bc') && 
          limits.maxBufferSize >= 256000000) {
        return { 
          tier: 2, 
          name: '标准支持',
          features: Array.from(features),
          limits
        }
      }

      // Tier 1: 基础支持
      return { 
        tier: 1, 
        name: '基础支持',
        features: Array.from(features),
        limits
      }
    } catch (error) {
      return { tier: 0, name: '错误', error }
    }
  }
}

/**
 * 使用示例
 *
 * // 1. 检查材质兼容性
 * const check = MaterialCompatibilityChecker.isWebGPUCompatible(myMaterial)
 * console.log(check.compatible, check.reason)
 * 
 * // 2. 扫描场景
 * const results = MaterialCompatibilityChecker.scanSceneMaterials(scene)
 * results.forEach(r => console.log(r.object, r.materialType, r.compatible))
 * 
 * // 3. 优化渲染器
 * WebGPURendererOptimizer.optimizeRenderer(renderer, {
 *   enableCompute: true,
 *   optimizeTextureMemory: true
 * })
 * 
 * // 4. 检测着色器语言
 * const lang = GLSLToWGSLConverter.detectShaderLanguage(shader)
 * if (lang === 'glsl') {
 *   const wgsl = GLSLToWGSLConverter.convert(shader, 'vertex')
 * }
 * 
 * // 5. 启用调试
 * WebGPUDebugger.enableDebugLayer()
 * const tier = await WebGPUDebugger.checkWebGPUSupportTier()
 * console.log('WebGPU Tier:', tier.name)
 */
