/**
 * 日志工具
 * 提供统一的日志记录接口，支持不同级别的日志
 */

/**
 * 创建日志实例
 * @param {string} namespace - 日志命名空间
 * @returns {Object} 日志实例
 */
export const createLogger = (namespace = 'App') => {
  const isDev = import.meta.env.DEV
  const logLevel = isDev ? 'debug' : 'info'

  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }

  const currentLevel = levels[logLevel] || levels.info

  const log = (level, ...args) => {
    if (levels[level] >= currentLevel) {
      const prefix = `[${namespace}][${level.toUpperCase()}]`

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

  return {
    debug: (...args) => log('debug', ...args),
    info: (...args) => log('info', ...args),
    warn: (...args) => log('warn', ...args),
    error: (...args) => log('error', ...args)
  }
}
