/**
 * 设备性能检测工具
 * 根据设备性能动态调整粒子数量
 */

/**
 * 获取设备性能等级
 */
export function getDeviceTier() {
  // 检测是否是移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // 检测 CPU 核心数（低性能设备）
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

  // 检测内存限制（部分浏览器支持）
  const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4

  if (isMobile || isLowEnd || isLowMemory) {
    return 'LOW'
  }

  // 高性能设备
  const isHighEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8

  if (isHighEnd) {
    return 'HIGH'
  }

  return 'MEDIUM'
}

/**
 * 获取自适应粒子数量
 */
export function getAdaptiveParticleCount(type, deviceTier = getDeviceTier()) {
  const config = {
    star: {
      HIGH: 8000,
      MEDIUM: 4000,
      LOW: 2000
    },
    aurora: {
      HIGH: 15000,
      MEDIUM: 8000,
      LOW: 4000
    },
    plasma: {
      HIGH: 5000,
      MEDIUM: 3000,
      LOW: 1500
    },
    vortex: {
      HIGH: 1500,
      MEDIUM: 800,
      LOW: 400
    },
    youth: {
      HIGH: 30000,
      MEDIUM: 15000,
      LOW: 8000
    },
    shuimo: {
      HIGH: 20000,
      MEDIUM: 10000,
      LOW: 5000
    },
    butterfly: {
      HIGH: 20000,
      MEDIUM: 10000,
      LOW: 5000
    },
    supernova: {
      HIGH: 15000,
      MEDIUM: 8000,
      LOW: 4000
    },
    quantum: {
      HIGH: 15000,
      MEDIUM: 8000,
      LOW: 4000
    },
    entanglement: {
      HIGH: 5000,
      MEDIUM: 3000,
      LOW: 1500
    },
    void: {
      HIGH: 6000,
      MEDIUM: 3000,
      LOW: 1500
    },
    epic: {
      HIGH: 10000,
      MEDIUM: 5000,
      LOW: 2500
    },
    timeSand: {
      HIGH: 8000,
      MEDIUM: 4000,
      LOW: 2000
    },
    windFlower: {
      HIGH: 8000,
      MEDIUM: 4000,
      LOW: 2000
    },
    mandala: {
      HIGH: 8000,
      MEDIUM: 4000,
      LOW: 2000
    },
    fireworks: {
      HIGH: 6000,
      MEDIUM: 3000,
      LOW: 1500
    }
  }

  return config[type]?.[deviceTier] || config[type]?.MEDIUM || 3000
}

/**
 * 检测 WebGL 支持
 */
export function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}
