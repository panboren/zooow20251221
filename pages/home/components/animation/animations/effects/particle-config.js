/**
 * 粒子配置模块
 * 统一管理粒子数量和性能优化策略
 * 根据设备性能自适应调整粒子数量
 */

/**
 * 设备性能等级定义
 */
export const DEVICE_TIERS = {
  HIGH: {
    fps: 55,
    name: '高端设备',
    description: '高性能设备，可使用全特效'
  },
  MEDIUM: {
    fps: 40,
    name: '中端设备',
    description: '中等性能设备，使用中等粒子数量'
  },
  LOW: {
    fps: 25,
    name: '低端设备',
    description: '低性能设备，使用简化特效'
  }
}

/**
 * 粒子数量配置（根据设备等级）
 */
export const PARTICLE_COUNTS = {
  HIGH: {
    // 极光相关
    aurora: 50000,
    auroraBands: 10,
    stars: 5000,
    crystals: 3000,
    mist: 8000,
    fantasy: 10000,
    photons: 20000,
    snowflakes: 15000,
    plasma: 5000,

    // 宇宙相关
    galaxy: 60000,
    nebula: 15000,
    supernova: 50000,
    cosmic: 30000,

    // 量子相关
    quantum: 30000,
    entanglement: 10000,
    waveFunction: 5000,

    // 其他
    firework: 3000,
    rain: 20000,
    dust: 10000,
    bubbles: 5000
  },
  MEDIUM: {
    // 极光相关
    aurora: 25000,
    auroraBands: 8,
    stars: 2500,
    crystals: 1500,
    mist: 4000,
    fantasy: 5000,
    photons: 10000,
    snowflakes: 7500,
    plasma: 2500,

    // 宇宙相关
    galaxy: 30000,
    nebula: 8000,
    supernova: 25000,
    cosmic: 15000,

    // 量子相关
    quantum: 15000,
    entanglement: 5000,
    waveFunction: 2500,

    // 其他
    firework: 1500,
    rain: 10000,
    dust: 5000,
    bubbles: 2500
  },
  LOW: {
    // 极光相关
    aurora: 10000,
    auroraBands: 5,
    stars: 1000,
    crystals: 500,
    mist: 2000,
    fantasy: 2000,
    photons: 5000,
    snowflakes: 3000,
    plasma: 1000,

    // 宇宙相关
    galaxy: 8000,
    nebula: 3000,
    supernova: 10000,
    cosmic: 5000,

    // 量子相关
    quantum: 5000,
    entanglement: 2000,
    waveFunction: 1000,

    // 其他
    firework: 500,
    rain: 5000,
    dust: 2000,
    bubbles: 1000
  }
}

/**
 * 特效类型映射
 */
export const EFFECT_TYPES = {
  // 极光系列
  AURORA_FANTASY: 'aurora-fantasy',
  OCEAN_AURORA: 'ocean-aurora',
  HOLOGRAPHIC_AURORA: 'holographic-aurora',

  // 宇宙系列
  BIG_BANG_GENESIS: 'big-bang-genesis',
  COSMIC_EPIC: 'cosmic-epic',
  GALAXY_FLOW: 'galaxy-flow',
  NEBULA_VORTEX: 'nebula-vortex',

  // 量子系列
  QUANTUM_DREAM: 'quantum-dream',
  QUANTUM_ENTANGLEMENT: 'quantum-entanglement',
  QUANTUM_MATRIX: 'quantum-matrix',

  // 其他
  SNOWFALL: 'snowfall',
  RAIN: 'rain',
  FIREWORKS: 'fireworks'
}

/**
 * 粒子类型到配置的映射
 */
export const PARTICLE_TYPE_MAP = {
  'aurora-fantasy': {
    aurora: 'aurora',
    stars: 'stars',
    crystals: 'crystals',
    mist: 'mist',
    fantasy: 'fantasy',
    photons: 'photons',
    snowflakes: 'snowflakes'
  },
  'ocean-aurora': {
    stars: 'stars',
    auroraBands: 'auroraBands'
  },
  'holographic-aurora': {
    stars: 'stars',
    plasma: 'plasma'
  },
  'big-bang-genesis': {
    supernova: 'supernova',
    cosmic: 'cosmic'
  },
  'cosmic-epic': {
    galaxy: 'galaxy',
    nebula: 'nebula',
    stars: 'stars'
  },
  'quantum-dream': {
    quantum: 'quantum',
    waveFunction: 'waveFunction',
    entanglement: 'entanglement'
  }
}

/**
 * 获取设备性能等级
 * @param {Number} fps - 当前帧率
 * @returns {String} 设备等级 ('HIGH' | 'MEDIUM' | 'LOW')
 */
export function getDeviceTier(fps) {
  if (fps >= DEVICE_TIERS.HIGH.fps) return 'HIGH'
  if (fps >= DEVICE_TIERS.MEDIUM.fps) return 'MEDIUM'
  return 'LOW'
}

/**
 * 获取设备性能等级信息
 * @param {Number} fps - 当前帧率
 * @returns {Object} 设备等级信息
 */
export function getDeviceTierInfo(fps) {
  const tier = getDeviceTier(fps)
  return {
    tier,
    ...DEVICE_TIERS[tier]
  }
}

/**
 * 根据设备等级获取粒子数量
 * @param {String} type - 粒子类型
 * @param {String} tier - 设备等级 ('HIGH' | 'MEDIUM' | 'LOW')
 * @returns {Number} 粒子数量
 */
export function getParticleCount(type, tier) {
  return PARTICLE_COUNTS[tier][type] || PARTICLE_COUNTS.MEDIUM[type] || 1000
}

/**
 * 自适应粒子数量
 * @param {String} type - 粒子类型
 * @param {Number} currentFPS - 当前帧率
 * @returns {Number} 适配的粒子数量
 */
export function getAdaptiveParticleCount(type, currentFPS) {
  const tier = getDeviceTier(currentFPS)
  return getParticleCount(type, tier)
}

/**
 * 根据特效类型获取所有粒子配置
 * @param {String} effectType - 特效类型
 * @param {Number} currentFPS - 当前帧率
 * @returns {Object} 粒子配置对象
 */
export function getEffectParticleConfig(effectType, currentFPS) {
  const tier = getDeviceTier(currentFPS)
  const typeMap = PARTICLE_TYPE_MAP[effectType]

  if (!typeMap) {
    console.warn(`Unknown effect type: ${effectType}`)
    return {}
  }

  const config = {}
  for (const [key, particleType] of Object.entries(typeMap)) {
    config[key] = getParticleCount(particleType, tier)
  }

  return config
}

/**
 * 检测设备性能（简化版）
 * @returns {Promise<String>} 设备等级
 */
export async function detectDevicePerformance() {
  return new Promise((resolve) => {
    let frameCount = 0
    let startTime = performance.now()
    let lastTime = startTime

    const testDuration = 2000 // 2秒测试

    const measure = () => {
      const currentTime = performance.now()
      frameCount++

      if (currentTime - startTime < testDuration) {
        requestAnimationFrame(measure)
      } else {
        const fps = Math.round((frameCount / (currentTime - startTime)) * 1000)
        resolve(getDeviceTier(fps))
      }
    }

    requestAnimationFrame(measure)
  })
}

/**
 * 性能监控器
 * 用于实时监控和调整粒子数量
 */
export class ParticlePerformanceMonitor {
  constructor() {
    this.fpsHistory = []
    this.maxHistorySize = 60 // 保留最近60帧
    this.currentFPS = 60
    this.targetFPS = 60
    this.adaptiveMode = true
    this.minFPS = 30
  }

  /**
   * 更新帧率
   */
  update() {
    const now = performance.now()
    if (!this.lastFrameTime) {
      this.lastFrameTime = now
      return
    }

    const delta = now - this.lastFrameTime
    const fps = 1000 / delta

    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > this.maxHistorySize) {
      this.fpsHistory.shift()
    }

    // 计算平均FPS
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
    this.currentFPS = avgFPS

    this.lastFrameTime = now

    // 自适应调整
    if (this.adaptiveMode && this.shouldAdjustQuality()) {
      this.adjustQuality()
    }
  }

  /**
   * 判断是否需要调整质量
   */
  shouldAdjustQuality() {
    return this.currentFPS < this.minFPS || this.currentFPS > this.targetFPS + 10
  }

  /**
   * 调整质量
   */
  adjustQuality() {
    const tier = getDeviceTier(this.currentFPS)
    console.log(`Performance adjusted: FPS=${this.currentFPS.toFixed(1)}, Tier=${tier}`)

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('particleQualityAdjust', {
      detail: { tier, fps: this.currentFPS }
    }))
  }

  /**
   * 获取当前设备等级
   */
  getCurrentTier() {
    return getDeviceTier(this.currentFPS)
  }

  /**
   * 获取当前FPS
   */
  getFPS() {
    return this.currentFPS
  }

  /**
   * 重置监控
   */
  reset() {
    this.fpsHistory = []
    this.lastFrameTime = null
    this.currentFPS = 60
  }
}

/**
 * 创建默认性能监控器实例
 */
export const performanceMonitor = new ParticlePerformanceMonitor()

/**
 * 导出默认配置
 */
export default {
  DEVICE_TIERS,
  PARTICLE_COUNTS,
  EFFECT_TYPES,
  PARTICLE_TYPE_MAP,
  getDeviceTier,
  getDeviceTierInfo,
  getParticleCount,
  getAdaptiveParticleCount,
  getEffectParticleConfig,
  detectDevicePerformance,
  ParticlePerformanceMonitor,
  performanceMonitor
}
