/**
 * 项目常量定义
 * 集中管理所有常量，便于维护和修改
 */

// 相机配置
export const CAMERA_CONFIG = {
  FOV: 75,
  NEAR: 0.01,
  FAR: 2000,
  DEFAULT_POSITION: {
    x: 0,
    y: 0,
    z: 1
  },
  DEFAULT_ROTATION: {
    x: 0,
    y: Math.PI / 4,
    z: 0
  }
}

// 渲染器配置
export const RENDER_CONFIG = {
  MAX_PIXEL_RATIO: 4,
  ANTIALIAS: true,
  ALPHA: true,
  POWER_PREFERENCE: 'high-performance',
  PRESERVE_DRAWING_BUFFER: false,
  PRECISION: 'highp',
  STENCIL: false,
  DEPTH: true
}

// 控制器配置
export const CONTROLS_CONFIG = {
  ENABLE_ZOOM: false,
  ENABLE_PAN: false,
  AUTO_ROTATE_SPEED: 0.3,
  ROTATE_SPEED: 0.4,
  DAMPING_FACTOR: 0.04,
  MIN_POLAR_ANGLE: 0.1,
  MAX_POLAR_ANGLE: Math.PI - 0.1,
  MIN_AZIMUTH_ANGLE: -Infinity,
  MAX_AZIMUTH_ANGLE: Infinity
}

// 视角预设
export const VIEW_PRESETS = {
  FRONT: {
    name: 'front',
    theta: 0,
    phi: Math.PI / 2,
    label: '正前方'
  },
  RIGHT: {
    name: 'right',
    theta: Math.PI / 2,
    phi: Math.PI / 2,
    label: '右侧'
  },
  LEFT: {
    name: 'left',
    theta: -Math.PI / 2,
    phi: Math.PI / 2,
    label: '左侧'
  },
  BACK: {
    name: 'back',
    theta: Math.PI,
    phi: Math.PI / 2,
    label: '后方'
  },
  UP: {
    name: 'up',
    theta: 0,
    phi: Math.PI / 2 - Math.PI / 6,
    label: '仰视'
  },
  DOWN: {
    name: 'down',
    theta: 0,
    phi: Math.PI / 2 + Math.PI / 6,
    label: '俯视'
  },
  DEFAULT: {
    name: 'default',
    theta: Math.PI / 2.5,
    phi: Math.PI / 1.9,
    label: '默认'
  }
}

// 性能配置
export const PERFORMANCE_CONFIG = {
  MIN_FRAME_TIME: 16, // 最小帧时间 (ms)
  RESIZE_DELAY: 100, // 窗口大小变化节流延迟 (ms)
  LOG_LEVEL: 'info', // 日志级别
  MEMORY_CLEANUP_INTERVAL: 60000 // 内存清理间隔 (ms)
}

// 样式配置
export const STYLE_CONFIG = {
  PRIMARY_COLOR: '#4CAF50',
  SECONDARY_COLOR: '#2196F3',
  ACCENT_COLOR: '#FF9800',
  BACKGROUND_COLOR: '#000000',
  TEXT_COLOR: '#FFFFFF',
  LOADING_BACKGROUND: 'rgba(0, 0, 0, 0.9)',
  CONTROLS_BACKGROUND: 'rgba(0, 0, 0, 0.8)'
}
