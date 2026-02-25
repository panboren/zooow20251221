/**
 * 日志工具
 * 提供统一的日志记录接口，支持不同级别的日志
 */

/**
 * 创建日志实例
 * @param {string} namespace - 日志命名空间
 * @param {Object} options - 配置选项
 * @param {string} options.level - 日志级别 'debug' | 'info' | 'warn' | 'error'
 * @param {boolean} options.enableTimestamp - 启用时间戳
 * @param {boolean} options.enablePerformance - 启用性能日志
 * @returns {Object} 日志实例
 */
export const createLogger = (namespace = 'App', options = {}) => {
  const {
    level: customLevel,
    enableTimestamp = false,
    enablePerformance = false
  } = options

  const isDev = import.meta.env.DEV
  // 🔧 生产环境仅显示错误日志
  const logLevel = customLevel || (isDev ? 'debug' : 'error')

  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }

  const currentLevel = levels[logLevel] || levels.info

  // 性能日志缓存
  const performanceLogs = []
  const MAX_PERFORMANCE_LOGS = 100

  const formatTime = () => {
    if (!enableTimestamp) return ''
    return new Date().toISOString().slice(11, 23)
  }

  const log = (level, ...args) => {
    if (levels[level] >= currentLevel) {
      const time = formatTime()
      const prefix = time
        ? `[${time}][${namespace}][${level.toUpperCase()}]`
        : `[${namespace}][${level.toUpperCase()}]`

      switch (level) {
      case 'debug':
        console.debug(prefix, ...args)
        break
      case 'info':
        console.info(prefix, ...args)
        break
      case 'warn':
        console.warn(prefix, ...args)
        break
      case 'error':
        console.error(prefix, ...args)
        break
      }
    }
  }

  // 性能日志记录
  const perfLog = (label, duration, extra = {}) => {
    if (!enablePerformance) return

    performanceLogs.push({
      timestamp: Date.now(),
      label,
      duration,
      ...extra
    })

    // 限制日志数量
    if (performanceLogs.length > MAX_PERFORMANCE_LOGS) {
      performanceLogs.shift()
    }

    // 慢操作警告
    if (duration > 1000) {
      warn(`性能警告: ${label} 耗时 ${duration.toFixed(2)}ms`, extra)
    }
  }

  // 获取性能日志统计
  const getPerformanceStats = () => {
    if (performanceLogs.length === 0) return null

    const avgDuration = performanceLogs.reduce((sum, log) => sum + log.duration, 0) / performanceLogs.length
    const maxDuration = Math.max(...performanceLogs.map(log => log.duration))
    const slowOperations = performanceLogs.filter(log => log.duration > 1000)

    return {
      totalLogs: performanceLogs.length,
      avgDuration: avgDuration.toFixed(2),
      maxDuration: maxDuration.toFixed(2),
      slowOperations: slowOperations.length
    }
  }

  return {
    debug: (...args) => log('debug', ...args),
    info: (...args) => log('info', ...args),
    warn: (...args) => log('warn', ...args),
    error: (...args) => log('error', ...args),

    // 性能日志方法
    perfLog,
    getPerformanceStats,
    clearPerformanceLogs: () => performanceLogs.length = 0,

    // 设置日志级别
    setLevel: (newLevel) => {
      if (levels[newLevel] !== undefined) {
        logLevel = newLevel
      }
    },

    // 性能测量包装器
    async measure(label, fn) {
      const start = performance.now()
      try {
        const result = await fn()
        const duration = performance.now() - start
        perfLog(label, duration, { status: 'success' })
        return result
      } catch (error) {
        const duration = performance.now() - start
        perfLog(label, duration, { status: 'error', error: error.message })
        throw error
      }
    }
  }
}

