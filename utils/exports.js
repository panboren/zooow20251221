/**
 * 工具库统一导出文件
 * 集成所有优化工具，提供统一的导入接口
 */

// ==================== 粒子系统 ====================

export { ParticleFactory } from './ParticleFactory.js'
export { GPUCompute, GPUParticleSystem } from './GPUCompute.js'
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

// ==================== 性能监控 ====================

export { PerformanceMonitor } from './PerformanceMonitor.js'
export { LODManager } from './LODManager.js'

// ==================== 代码分析 ====================

export { CodeAnalyzer } from './CodeAnalyzer.js'

// ==================== 基类 ====================

export { default as BaseEffect } from '../pages/home/components/animation/animations/base/BaseEffect.js'
export { default as EnhancedBaseEffect } from '../pages/home/components/animation/animations/base/EnhancedBaseEffect.js'

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

// ==================== 便捷导出 ====================

/**
 * 快速创建粒子系统
 */
export const createParticles = ParticleFactory.create.bind(ParticleFactory)

/**
 * 快速创建性能监控
 */
export const createPerformanceMonitor = (options) => new PerformanceMonitor(options)

/**
 * 快速创建LOD管理器
 */
export const createLODManager = (monitor) => new LODManager(monitor)

/**
 * 快速获取内存池
 */
export const getMemoryPool = getPoolManager

/**
 * 快速分析代码
 */
export const analyzeCode = (filePath) => {
  const analyzer = new CodeAnalyzer()
  return analyzer.analyze(filePath)
}

// ==================== 版本信息 ====================

export const UTILS_VERSION = '2.0.0'

export const UTILS_INFO = {
  version: UTILS_VERSION,
  buildDate: '2026-02-07',
  tools: [
    'ParticleFactory',
    'PerformanceMonitor',
    'LODManager',
    'CodeAnalyzer',
    'GPUCompute',
    'TextureAtlas',
    'MemoryPool',
    'BaseEffect',
    'EnhancedBaseEffect'
  ]
}
