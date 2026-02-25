/**
 * WebGPU + Three.js 项目优化配置
 * 集中管理所有优化参数和配置
 */

/**
 * 设备检测配置
 */
export const DeviceDetection = {
  // 低端设备判断标准
  isLowEnd() {
    return (
      navigator.hardwareConcurrency < 4 ||
      navigator.deviceMemory < 4 ||
      window.devicePixelRatio < 2
    )
  },

  // 高端设备判断标准
  isHighEnd() {
    return (
      navigator.hardwareConcurrency >= 8 &&
      navigator.deviceMemory >= 8 &&
      window.devicePixelRatio >= 2
    )
  },

  // 获取设备等级
  getDeviceTier() {
    if (this.isHighEnd()) return 'high'
    if (this.isLowEnd()) return 'low'
    return 'medium'
  }
}

/**
 * 缓存配置
 */
export const CacheConfig = {
  // 纹理缓存
  texture: {
    maxMemoryCache: 5, // 内存缓存最大数量
    maxDBCache: 100, // IndexedDB 最大缓存数量
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天过期
    maxDBSize: 100 * 1024 * 1024, // 100MB
    cleanupInterval: 3600000 // 每小时清理一次
  },

  // Blob URL 缓存
  blob: {
    maxSize: 5,
    checkInterval: 60000
  },

  // 几何体缓存
  geometry: {
    maxSize: 20,
    enabled: true
  }
}

/**
 * 渲染配置
 */
export const RenderConfig = {
  // 智能帧率控制
  frameRate: {
    highFPS: 60,
    lowFPS: 30,
    targetFPS: 60,
    minFPS: 24,

    // 高帧率触发条件
    highFPSConditions: {
      userInteracting: true,
      autoRotate: true,
      deltaTimeThreshold: 2000
    }
  },

  // 渲染质量预设
  quality: {
    low: {
      pixelRatio: 1,
      antialias: false,
      shadowMap: false,
      toneMapping: THREE.LinearToneMapping,
      anisotropy: 2,
      maxAnisotropy: 2
    },
    medium: {
      pixelRatio: 1.5,
      antialias: true,
      shadowMap: false,
      toneMapping: THREE.ACESFilmicToneMapping,
      anisotropy: 4,
      maxAnisotropy: 4
    },
    high: {
      pixelRatio: 2,
      antialias: true,
      shadowMap: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      anisotropy: 8,
      maxAnisotropy: 8
    }
  },

  // 纹理配置
  texture: {
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    colorSpace: THREE.SRGBColorSpace,
    format: THREE.RGBAFormat
  },

  // 全景图几何体配置
  panorama: {
    widthSegments: 70,
    heightSegments: 35,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI
  },

  // 相机配置
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    initialZ: 0.1
  },

  // 控制器配置
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    zoomSpeed: 0.6,
    enablePan: false,
    minDistance: 0.1,
    maxDistance: 1000,
    autoRotate: false,
    autoRotateSpeed: 0.5
  }
}

/**
 * 粒子系统配置
 */
export const ParticleConfig = {
  // 粒子数量（根据设备等级）
  maxParticles: {
    low: 1000,
    medium: 5000,
    high: 20000
  },

  // 更新配置
  update: {
    useGPU: true, // 优先使用 GPU Compute Shader
    batchSize: 1000, // CPU 批量更新大小
    maxUpdateTime: 8 // 最大更新时间（ms）
  },

  // 渲染配置
  render: {
    useInstancing: true, // 使用实例化渲染
    textureAtlas: true, // 使用纹理图集
    useFog: false // 禁用雾效以提升性能
  }
}

/**
 * 动画配置
 */
export const AnimationConfig = {
  // GSAP 配置
  gsap: {
    defaultDuration: 1.5,
    defaultEase: 'power2.inOut',
    overwrite: true
  },

  // 相机动画
  camera: {
    transitionDuration: 2,
    transitionEase: 'power2.inOut'
  },

  // 全景图切换动画
  panorama: {
    fadeDuration: 1,
    fadeEase: 'power1.inOut'
  }
}

/**
 * WebGPU 配置
 */
export const WebGPUConfig = {
  // 特性检测
  features: {
    asyncCompilation: true,
    computeShaders: true,
    timestampQuery: false // 性能分析时启用
  },

  // 内存管理
  memory: {
    maxBufferSize: 64 * 1024 * 1024, // 64MB
    maxTextureSize: 4096
  },

  // 回退配置
  fallback: {
    toWebGL2: true,
    fallbackReasons: ['deviceLost', 'outOfMemory', 'error']
  }
}

/**
 * 性能监控配置
 */
export const PerformanceMonitorConfig = {
  // 监控间隔
  monitorInterval: 1000,

  // 性能评级
  rating: {
    excellent: { minFPS: 55, description: '优秀' },
    good: { minFPS: 45, description: '良好' },
    fair: { minFPS: 30, description: '一般' },
    poor: { minFPS: 0, description: '较差' }
  },

  // 警告阈值
  warnings: {
    lowFPS: 30,
    highFrameTime: 33.33, // 30 FPS = 33.33ms
    highMemoryUsage: 500 * 1024 * 1024 // 500MB
  },

  // 指标记录
  metrics: {
    fps: true,
    frameTime: true,
    memory: true,
    drawCalls: true,
    triangles: true,
    textures: true,
    geometries: true
  }
}

/**
 * 日志配置
 */
export const LoggerConfig = {
  // 日志级别
  level: {
    development: 'debug',
    production: 'error'
  },

  // 功能开关
  features: {
    enableTimestamp: true,
    enablePerformance: true,
    enableSourceTracking: false
  },

  // 性能日志配置
  performance: {
    maxLogs: 100,
    slowThreshold: 1000, // 慢操作阈值（ms）
    logSlowOperations: true
  }
}

/**
 * 错误处理配置
 */
export const ErrorHandlingConfig = {
  // 错误恢复策略
  recovery: {
    maxAttempts: 3,
    retryDelay: 1000,
    fallbackToWebGL2: true
  },

  // 错误上报
  reporting: {
    enabled: process.env.NODE_ENV === 'production',
    endpoint: '/api/errors',
    throttleTime: 60000 // 1分钟内只上报一次
  },

  // 用户通知
  notification: {
    showUserFriendlyMessage: true,
    showTechnicalDetails: false
  }
}

/**
 * 获取配置的辅助函数
 */
export const getConfig = (category, key) => {
  const config = {
    device: DeviceDetection,
    cache: CacheConfig,
    render: RenderConfig,
    particle: ParticleConfig,
    animation: AnimationConfig,
    webgpu: WebGPUConfig,
    performance: PerformanceMonitorConfig,
    logger: LoggerConfig,
    error: ErrorHandlingConfig
  }

  if (!config[category]) {
    console.warn(`未找到配置类别: ${category}`)
    return null
  }

  if (key) {
    return config[category][key]
  }

  return config[category]
}

/**
 * 根据设备等级自动选择配置
 */
export const getAutoConfig = () => {
  const deviceTier = DeviceDetection.getDeviceTier()

  return {
    quality: RenderConfig.quality[deviceTier],
    particles: ParticleConfig.maxParticles[deviceTier],
    frameRate: RenderConfig.frameRate,
    enableGPU: !DeviceDetection.isLowEnd() && ParticleConfig.update.useGPU
  }
}

/**
 * 导出默认配置
 */
export default {
  device: DeviceDetection,
  cache: CacheConfig,
  render: RenderConfig,
  particle: ParticleConfig,
  animation: AnimationConfig,
  webgpu: WebGPUConfig,
  performance: PerformanceMonitorConfig,
  logger: LoggerConfig,
  error: ErrorHandlingConfig,
  getConfig,
  getAutoConfig
}
