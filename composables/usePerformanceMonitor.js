/**
 * 性能监控 composable
 * 使用 Stats.js 监控 FPS 和性能指标
 */

export function usePerformanceMonitor() {
  let stats = null
  let isActive = false

  /**
   * 初始化性能监控
   */
  const init = () => {
    if (stats) return stats

    try {
      // 动态导入 Stats.js
      import('stats.js').then((StatsModule) => {
        const Stats = StatsModule.default
        stats = new Stats()

        // 默认显示 FPS 面板
        stats.showPanel(0) // 0: fps, 1: ms, 2: mb

        // 设置样式
        stats.dom.style.position = 'fixed'
        stats.dom.style.top = '0px'
        stats.dom.style.left = '0px'
        stats.dom.style.zIndex = '9999'
        stats.dom.style.opacity = '0.8'

        document.body.appendChild(stats.dom)
        isActive = true
      }).catch((error) => {
        console.error('Stats.js 加载失败:', error)
      })
    } catch (error) {
      console.error('性能监控初始化失败:', error)
    }

    return stats
  }

  /**
   * 开始监控
   */
  const start = () => {
    if (!stats) init()
    if (stats) stats.begin()
  }

  /**
   * 结束监控
   */
  const end = () => {
    if (stats) stats.end()
  }

  /**
   * 显示指定面板
   */
  const showPanel = (panelId) => {
    if (stats) stats.showPanel(panelId)
  }

  /**
   * 隐藏监控器
   */
  const hide = () => {
    if (stats && stats.dom) {
      stats.dom.style.display = 'none'
    }
  }

  /**
   * 显示监控器
   */
  const show = () => {
    if (stats && stats.dom) {
      stats.dom.style.display = 'block'
    }
  }

  /**
   * 销毁监控器
   */
  const destroy = () => {
    if (stats && stats.dom) {
      document.body.removeChild(stats.dom)
      stats = null
      isActive = false
    }
  }

  return {
    init,
    start,
    end,
    showPanel,
    hide,
    show,
    destroy,
    isActive: () => isActive
  }
}
