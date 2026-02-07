/**
 * 动画系统TypeScript类型定义
 * 提供完整的类型支持
 */

import * as THREE from 'three'

// ==================== 基础类型 ====================

export type ColorMode = 'white' | 'gradient' | 'rainbow'

export type ParticleType = 'points' | 'instanced' | 'stream'

export type ParticleShape = 'random' | 'sphere' | 'cube' | 'spiral' | 'ring'

export type LODLevel = 'potato' | 'low' | 'medium' | 'high' | 'ultra'

export type PerformanceRating = 'excellent' | 'good' | 'fair' | 'poor'

// ==================== 粒子系统 ====================

export interface ParticleConfig {
  count?: number
  type?: ParticleType
  shape?: ParticleShape
  colorMode?: ColorMode
  color1?: THREE.Color | number
  color2?: THREE.Color | number
  color3?: THREE.Color | number
  size?: number
  sizeRange?: [number, number]
  opacity?: number
  velocity?: THREE.Vector3
  lifeTime?: number
}

export interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  color: THREE.Color
  size: number
  lifeTime: number
  age: number
}

export interface IParticleFactory {
  create(config: ParticleConfig): THREE.Points | THREE.InstancedMesh
  createPoints(config: ParticleConfig): THREE.Points
  createInstanced(config: ParticleConfig): THREE.InstancedMesh
  createStream(config: ParticleConfig): THREE.Points
}

// ==================== 性能监控 ====================

export interface PerformanceMetrics {
  fps: number
  memory: number
  drawCalls: number
  triangles: number
  particles: number
  rating: PerformanceRating
}

export interface IPerformanceMonitor {
  start(): void
  tick(renderer: THREE.WebGLRenderer, particleCount: number): void
  stop(): void
  getReport(): PerformanceMetrics
  getOptimizationSuggestions(): string[]
}

export interface PerformanceOptions {
  targetFPS?: number
  warningThreshold?: number
  criticalThreshold?: number
  memoryThreshold?: number
}

// ==================== LOD系统 ====================

export interface LODConfig {
  currentLevel: LODLevel
  targetFPS: number
  autoAdjust: boolean
  adjustInterval: number
}

export interface LODThresholds {
  ultra: { minFPS: number, particleMultiplier: number }
  high: { minFPS: number, particleMultiplier: number }
  medium: { minFPS: number, particleMultiplier: number }
  low: { minFPS: number, particleMultiplier: number }
  potato: { minFPS: number, particleMultiplier: number }
}

export interface ILODManager {
  getCurrentLevel(): LODLevel
  setLevel(level: LODLevel): void
  getParticleMultiplier(): number
  update(): void
  enableAutoAdjust(): void
  disableAutoAdjust(): void
}

// ==================== BaseEffect ====================

export interface BaseEffectOptions {
  name?: string
  particleCount?: number
  duration?: number
  loop?: boolean
  camera?: THREE.Camera
  renderer?: THREE.WebGLRenderer
  performanceMonitor?: IPerformanceMonitor
  lodManager?: ILODManager
}

export interface IBaseEffect {
  name: string
  isPlaying: boolean
  scene: THREE.Scene
  camera: THREE.Camera
  renderer?: THREE.WebGLRenderer
  options: BaseEffectOptions

  play(): Promise<void> | void
  pause(): void
  resume(): void
  stop(): void
  cleanup(): void
  update(time: number): void
}

export interface IEnhancedBaseEffect extends IBaseEffect {
  performanceMonitor: IPerformanceMonitor
  lodManager: ILODManager

  init(): void
  animate(): void
  updatePerformance(particleCount: number): void
  adjustLOD(): void
}

// ==================== 动画模板 ====================

export interface AnimationTemplate {
  name: string
  description: string
  category: string
  baseEffect: boolean
  particleConfig: ParticleConfig
  performanceConfig: PerformanceOptions
  lodConfig: LODConfig
}

export interface TemplateGeneratorOptions {
  name: string
  type: 'baseEffect' | 'enhancedBaseEffect' | 'simple'
  particleCount?: number
  duration?: number
  description?: string
}

// ==================== 代码分析 ====================

export interface CodeIssue {
  file: string
  line: number
  type: 'complexity' | 'duplication' | 'performance' | 'memory' | 'architecture'
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  suggestion: string
}

export interface CodeMetrics {
  file: string
  linesOfCode: number
  complexity: number
  duplication: number
  particleCount: number
  issues: CodeIssue[]
}

export interface ICodeAnalyzer {
  analyze(filePath: string): CodeMetrics
  analyzeDirectory(dirPath: string): CodeMetrics[]
  findNestedLoops(code: string): CodeIssue[]
  calculateComplexity(code: string): number
  detectMemoryLeaks(code: string): CodeIssue[]
}

// ==================== 测试 ====================

export interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: Error
  metrics?: PerformanceMetrics
}

export interface TestSuite {
  name: string
  tests: TestResult[]
  passed: number
  failed: number
  duration: number
}

export interface IAnimationTestSuite {
  addTest(name: string, testFn: () => Promise<void> | void): void
  runAll(): Promise<TestSuite>
  getCoverage(): number
}

// ==================== 性能基准 ====================

export interface BenchmarkConfig {
  duration: number
  warmupTime: number
  iterations: number
  lodLevels: LODLevel[]
}

export interface BenchmarkResult {
  animationName: string
  lodLevel: LODLevel
  fps: number
  memory: number
  frameTime: {
    avg: number
    min: number
    max: number
    stdDev: number
  }
}

export interface IBenchmark {
  run(config: BenchmarkConfig): Promise<BenchmarkResult[]>
  exportJSON(results: BenchmarkResult[], path: string): void
  exportMarkdown(results: BenchmarkResult[], path: string): void
}

// ==================== UI组件 ====================

export interface PerformancePanelOptions {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showFPS?: boolean
  showMemory?: boolean
  showDrawCalls?: boolean
  showParticles?: boolean
  autoHide?: boolean
}

export interface IPerformancePanel {
  show(): void
  hide(): void
  update(metrics: PerformanceMetrics): void
  setPosition(position: string): void
  setOptions(options: PerformancePanelOptions): void
}

// ==================== 工具函数 ====================

export type EasingFunction = (t: number) => number

export type AnimationCallback = (time: number) => void

export type CleanupCallback = () => void

// ==================== 常量 ====================

export const CONSTANTS = {
  DEFAULT_FPS: 60,
  DEFAULT_PARTICLE_COUNT: 5000,
  DEFAULT_DURATION: 10,
  MIN_FPS_FOR_HIGH_QUALITY: 55,
  MIN_FPS_FOR_MEDIUM_QUALITY: 30,
  MIN_FPS_FOR_LOW_QUALITY: 20,
  MEMORY_WARNING_THRESHOLD: 200, // MB
  MEMORY_CRITICAL_THRESHOLD: 400, // MB
} as const

// ==================== 导出 ====================

export type {
  // 基础
  ParticleConfig,
  Particle,
  ParticleType,
  ParticleShape,
  ColorMode,
  LODLevel,
  PerformanceRating,

  // 性能
  PerformanceMetrics,
  PerformanceOptions,
  IPerformanceMonitor,

  // LOD
  LODConfig,
  LODThresholds,
  ILODManager,

  // Effect
  BaseEffectOptions,
  IBaseEffect,
  IEnhancedBaseEffect,

  // 模板
  AnimationTemplate,
  TemplateGeneratorOptions,

  // 分析
  CodeIssue,
  CodeMetrics,
  ICodeAnalyzer,

  // 测试
  TestResult,
  TestSuite,
  IAnimationTestSuite,

  // 基准
  BenchmarkConfig,
  BenchmarkResult,
  IBenchmark,

  // UI
  PerformancePanelOptions,
  IPerformancePanel,

  // 工具
  EasingFunction,
  AnimationCallback,
  CleanupCallback,
}
