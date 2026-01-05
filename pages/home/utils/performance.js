/**
 * 性能优化工具函数
 * 提供常用的性能优化函数，如节流和防抖
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, delay) => {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func.apply(this, args)
  }
}

/**
 * 空闲时执行函数
 * @param {Function} func - 要执行的函数
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise} Promise对象
 */
export const runWhenIdle = (func, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('空闲时执行超时'))
    }, timeout)

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          clearTimeout(timeoutId)
          resolve(func())
        },
        { timeout }
      )
    } else {
      // 降级处理
      setTimeout(() => {
        clearTimeout(timeoutId)
        resolve(func())
      }, 1)
    }
  })
}
