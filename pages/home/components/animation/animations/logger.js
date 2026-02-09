/**
 * 统一日志工具
 * 开发环境显示详细日志，生产环境只显示错误和警告
 */

const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development'

export const logger = {
  log: isDev ? console.log.bind(console) : () => {},
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  info: isDev ? console.info.bind(console) : () => {},
  debug: isDev ? console.debug.bind(console) : () => {}
}

/**
 * 性能日志
 */
export const perfLogger = {
  start(label) {
    if (isDev) console.time(label)
  },
  end(label) {
    if (isDev) console.timeEnd(label)
  }
}
