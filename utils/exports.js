/**
 * 工具库统一导出文件
 * 集成所有优化工具，提供统一的导入接口
 */

// ==================== 粒子系统 ====================

export { ParticleFactory } from './ParticleFactory.js'
export { GPUCompute, GPUParticleSystem } from './GPUCompute.js'
export { EnhancedGPUCompute, GPUParticleSystem as EnhancedGPUParticleSystem } from './EnhancedGPUCompute.js'
export { TextureAtlas, ParticleTextureAtlas } from './TextureAtlas.js'
export {
  MemoryPool,
  Vector3Pool,
  ColorPool,
  ParticleDataPool,
  ArrayPool,
  PoolManager,
  getPoolManager
} from './MemoryPool.js'

// ==================== 资源预加载 ====================

export { ResourcePreloader, TextureAtlasPreloader, ResourceManager } from './ResourcePreloader.js'

// ==================== Web Workers ====================

export { WorkerManager, ParticleComputeWorker } from './WorkerManager.js'

// ==================== 智能资源管理 ====================

export { SmartResourceManager, TextureLODManager } from './SmartResourceManager.js'

// ==================== 纹理优化 ====================

export { MipmapOptimizer, TextureStreamLoader } from './MipmapOptimizer.js'

// ==================== 视锥体剔除 ====================

export { FrustumCulling, OcclusionQueryCulling } from './FrustumCulling.js'

// ==================== 立体渲染 ====================

export { StereoRendering, VRRenderer, ARRenderer } from './StereoRendering.js'

// ==================== 性能监控 ====================

export { PerformanceMonitor } from './PerformanceMonitor.js'
export { EnhancedPerformanceMonitor } from './EnhancedPerformanceMonitor.js'
export { LODManager } from './LODManager.js'

// ==================== 代码分析 ====================

export { CodeAnalyzer } from './CodeAnalyzer.js'

// ==================== 基类 ====================

export { default as BaseEffect } from '../pages/home/components/animation/animations/base/BaseEffect.js'
export { default as EnhancedBaseEffect } from '../pages/home/components/animation/animations/base/EnhancedBaseEffect.js'

// ==================== Shader系统 ====================

export { default as NoiseLibrary } from './shaders/NoiseLibrary.js'
export { default as HolographicShaders } from './shaders/HolographicShaders.js'
export { default as ShaderUtils } from './shaders/ShaderUtils.js'

// ==================== 资源清理 ====================

export {
  safeDispose,
  cleanupGeometry,
  cleanupMaterial,
  cleanupTexture,
  cleanupMesh,
  cleanupScene,
  cleanupParticleSystem,
  cleanupAnimationMixer,
  cleanupControls,
  cleanupRenderer,
  batchCleanup,
  cleanupBlobURL,
  cleanupBlobCache,
  ResourceContext
} from './ResourceCleaner.js'

// ==================== 动画模板 ====================

export {
  ParticleEffectTemplate,
  ParticleAnimationConfig,
  createParticleAnimation
} from './animation-templates/ParticleEffectTemplate.js'

// ==================== Composables ====================

export { usePerformanceMonitor } from '../composables/usePerformanceMonitor.js'
export { usePostProcessing } from '../composables/usePostProcessing.js'

// ==================== 辅助工具 ====================

export { default as isPc } from './index.js'

// ==================== 类型导出 ====================

export type {
  ParticleConfig,
  Particle,
  ParticleType,
  ParticleShape,
  ColorMode,
  LODLevel,
  PerformanceRating,
  PerformanceMetrics,
  PerformanceOptions,
  IPerformanceMonitor,
  LODConfig,
  LODThresholds,
  ILODManager,
  BaseEffectOptions,
  IBaseEffect,
  IEnhancedBaseEffect,
  AnimationTemplate,
  TemplateGeneratorOptions,
  CodeIssue,
  CodeMetrics,
  ICodeAnalyzer,
  TestResult,
  TestSuite,
  IAnimationTestSuite,
  BenchmarkConfig,
  BenchmarkResult,
  IBenchmark,
  PerformancePanelOptions,
  IPerformancePanel
} from '../types/animation.d.ts'

// ==================== 快捷创建函数 ====================

/**
 * 快速创建粒子系统
 */
export const createParticles = ParticleFactory.create.bind(ParticleFactory)

/**
 * 快速创建性能监控
 */
export const createPerformanceMonitor = (options) => new PerformanceMonitor(options)

/**
 * 快速创建增强性能监控
 */
export const createEnhancedPerformanceMonitor = (options) => new EnhancedPerformanceMonitor(options)

/**
 * 快速创建LOD管理器
 */
export const createLODManager = (monitor) => new LODManager(monitor)

/**
 * 快速创建GPU粒子系统（增强版）
 */
export const createEnhancedGPUParticles = (renderer, options) => {
  const system = new GPUParticleSystem(renderer, options)
  system.init()
  return system
}

/**
 * 快速创建预加载器
 */
export const createResourcePreloader = (options) => new ResourcePreloader(options)

/**
 * 快速创建资源管理器
 */
export const createResourceManager = (options) => new ResourceManager(options)

/**
 * 快速创建Worker管理器
 */
export const createWorkerManager = (options) => new WorkerManager(options)

/**
 * 快速创建智能资源管理器
 */
export const createSmartResourceManager = (options) => new SmartResourceManager(options)

/**
 * 快速创建Mipmap优化器
 */
export const createMipmapOptimizer = (options) => new MipmapOptimizer(options)

/**
 * 快速创建视锥体剔除器
 */
export const createFrustumCulling = (renderer, options) => new FrustumCulling(renderer, options)

/**
 * 快速创建立体渲染器
 */
export const createStereoRendering = (renderer, options) => new StereoRendering(renderer, options)

/**
 * 快速创建VR渲染器
 */
export const createVRRenderer = (renderer, options) => new VRRenderer(renderer, options)

/**
 * 快速创建AR渲染器
 */
export const createARRenderer = (renderer, options) => new ARRenderer(renderer, options)

/**
 * 快速分析代码
 */
export const analyzeCode = (filePath) => {
  const analyzer = new CodeAnalyzer()
  return analyzer.analyze(filePath)
}

/**
 * 快速创建粒子动画
 */
export const createParticleEffect = (config, implementation) => {
  return createParticleAnimation(implementation, config)
}

// ==================== Shader便捷导出 ====================

/**
 * 快速获取噪声Shader
 */
export const getNoiseShader = (type) => {
  const library = require('./shaders/NoiseLibrary.js')
  return library.default?.NOISE_SHADERS?.[type]
}

/**
 * 快速获取全息Shader
 */
export const getHolographicShader = (type) => {
  const library = require('./shaders/HolographicShaders.js')
  return library.default?.getHolographicShader(type)
}

/**
 * 快速创建Shader材质
 */
export const createShaderMaterial = (options) => {
  const utils = require('./shaders/ShaderUtils.js')
  return utils.default?.createShaderMaterial(options)
}

/**
 * 快速创建清理管理器
 */
export const createResourceContext = (name) => {
  return new ResourceContext(name)
}

// ==================== 版本信息 ====================

export const UTILS_VERSION = '2.4.0'

export const UTILS_INFO = {
  version: UTILS_VERSION,
  buildDate: '2026-02-26',
  tools: [
    'ParticleFactory',
    'PerformanceMonitor',
    'EnhancedPerformanceMonitor',
    'LODManager',
    'CodeAnalyzer',
    'GPUCompute',
    'EnhancedGPUCompute',
    'TextureAtlas',
    'MemoryPool',
    'ResourcePreloader',
    'ResourceManager',
    'WorkerManager',
    'SmartResourceManager',
    'MipmapOptimizer',
    'FrustumCulling',
    'StereoRendering',
    'BaseEffect',
    'EnhancedBaseEffect',
    'NoiseLibrary',
    'HolographicShaders',
    'ShaderUtils',
    'ResourceCleaner',
    'ParticleEffectTemplate'
  ],
  newInV2: [
    '统一Shader库',
    '全息特效Shader',
    'Shader工具函数',
    '统一资源清理',
    '粒子动画模板系统'
  ],
  newInV2_1: [
    'Shader噪声库',
    '全息特效库',
    'Shader工具集',
    '粒子动画模板'
  ],
  newInV2_3: [
    '增强性能监控系统',
    '资源预加载系统',
    '增强GPU计算系统',
    '纹理图集预加载器',
    '预测性性能告警',
    'GPU粒子系统'
  ],
  newInV2_4: [
    'Web Workers后台任务',
    '智能资源卸载',
    '多级纹理优化',
    'GPU视锥体剔除',
    'VR/AR立体渲染',
    '遮挡查询剔除',
    '纹理流式加载'
  ]
}

