/**
 * 可视化性能监控面板
 * 实时显示FPS、内存、粒子数等性能指标
 */

export class PerformancePanel {
  constructor(options = {}) {
    this.options = {
      position: 'top-right',
      showFPS: true,
      showMemory: true,
      showDrawCalls: true,
      showParticles: true,
      showLOD: true,
      autoHide: false,
      autoHideDelay: 3000,
      ...options
    }

    this.element = null
    this.lastActivityTime = Date.now()
    this.isVisible = true
    this.animationId = null

    this.init()
  }

  init() {
    // 创建面板元素
    this.element = document.createElement('div')
    this.element.id = 'performance-panel'
    this.element.innerHTML = this.getTemplate()

    // 应用样式
    this.applyStyles()

    // 添加到DOM
    document.body.appendChild(this.element)

    // 设置初始位置
    this.setPosition(this.options.position)

    // 监听鼠标移动
    if (this.options.autoHide) {
      this.setupAutoHide()
    }
  }

  getTemplate() {
    return `
      <div class="perf-panel-header">
        <span class="perf-title">🎬 性能监控</span>
        <button class="perf-close" onclick="this.closest('#performance-panel').remove()">✕</button>
      </div>
      <div class="perf-metrics">
        <div class="perf-metric" data-metric="fps" style="display: ${this.options.showFPS ? 'flex' : 'none'}">
          <span class="perf-label">FPS:</span>
          <span class="perf-value">--</span>
          <div class="perf-bar"></div>
        </div>
        <div class="perf-metric" data-metric="memory" style="display: ${this.options.showMemory ? 'flex' : 'none'}">
          <span class="perf-label">内存:</span>
          <span class="perf-value">--</span>
          <div class="perf-bar"></div>
        </div>
        <div class="perf-metric" data-metric="drawCalls" style="display: ${this.options.showDrawCalls ? 'flex' : 'none'}">
          <span class="perf-label">Draw Calls:</span>
          <span class="perf-value">--</span>
        </div>
        <div class="perf-metric" data-metric="particles" style="display: ${this.options.showParticles ? 'flex' : 'none'}">
          <span class="perf-label">粒子数:</span>
          <span class="perf-value">--</span>
        </div>
        <div class="perf-metric" data-metric="lod" style="display: ${this.options.showLOD ? 'flex' : 'none'}">
          <span class="perf-label">LOD:</span>
          <span class="perf-value">--</span>
        </div>
      </div>
      <div class="perf-alerts"></div>
      <div class="perf-suggestions"></div>
    `
  }

  applyStyles() {
    const style = document.createElement('style')
    style.textContent = `
      #performance-panel {
        position: fixed;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.85);
        border-radius: 12px;
        padding: 16px;
        font-family: 'Segoe UI', system-ui, sans-serif;
        font-size: 13px;
        color: #fff;
        min-width: 280px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: opacity 0.3s ease;
      }

      #performance-panel .perf-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      #performance-panel .perf-title {
        font-weight: 600;
        font-size: 14px;
        color: #fff;
      }

      #performance-panel .perf-close {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 16px;
        padding: 2px 6px;
        border-radius: 4px;
        transition: all 0.2s;
      }

      #performance-panel .perf-close:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      #performance-panel .perf-metrics {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      #performance-panel .perf-metric {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #performance-panel .perf-label {
        color: #aaa;
        min-width: 90px;
      }

      #performance-panel .perf-value {
        font-weight: 600;
        min-width: 60px;
        color: #4ade80;
      }

      #performance-panel .perf-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        min-width: 80px;
      }

      #performance-panel .perf-bar::after {
        content: '';
        display: block;
        height: 100%;
        background: linear-gradient(90deg, #4ade80, #22c55e);
        width: 0%;
        transition: width 0.3s ease;
        border-radius: 2px;
      }

      #performance-panel .perf-alerts {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      #performance-panel .perf-alert {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: rgba(239, 68, 68, 0.2);
        border-radius: 6px;
        margin-bottom: 6px;
        font-size: 12px;
      }

      #performance-panel .perf-suggestion {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        padding: 6px 10px;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 6px;
        margin-bottom: 6px;
        font-size: 12px;
        line-height: 1.4;
      }

      #performance-panel .perf-value.warning {
        color: #fbbf24;
      }

      #performance-panel .perf-value.danger {
        color: #ef4444;
      }

      #performance-panel.hidden {
        opacity: 0;
        pointer-events: none;
      }

      /* 位置样式 */
      #performance-panel.position-top-left { top: 20px; left: 20px; }
      #performance-panel.position-top-right { top: 20px; right: 20px; }
      #performance-panel.position-bottom-left { bottom: 20px; left: 20px; }
      #performance-panel.position-bottom-right { bottom: 20px; right: 20px; }
    `

    document.head.appendChild(style)
  }

  setPosition(position) {
    if (!this.element) return

    // 移除旧位置类
    this.element.classList.remove('position-top-left', 'position-top-right', 'position-bottom-left', 'position-bottom-right')

    // 添加新位置类
    this.element.classList.add(`position-${position}`)
  }

  setupAutoHide() {
    document.addEventListener('mousemove', () => {
      this.lastActivityTime = Date.now()
      this.show()
    })

    // 检查是否需要自动隐藏
    setInterval(() => {
      if (Date.now() - this.lastActivityTime > this.options.autoHideDelay) {
        this.hide()
      }
    }, 1000)
  }

  update(metrics) {
    if (!this.element) return

    // 更新FPS
    if (this.options.showFPS) {
      const fpsElement = this.element.querySelector('[data-metric="fps"] .perf-value')
      const barElement = this.element.querySelector('[data-metric="fps"] .perf-bar')

      if (fpsElement) {
        fpsElement.textContent = Math.round(metrics.fps)
        fpsElement.className = 'perf-value'

        if (metrics.fps < 20) {
          fpsElement.classList.add('danger')
        } else if (metrics.fps < 30) {
          fpsElement.classList.add('warning')
        }
      }

      if (barElement) {
        const percentage = Math.min(metrics.fps / 60 * 100, 100)
        barElement.style.setProperty('--bar-width', `${percentage}%`)
      }
    }

    // 更新内存
    if (this.options.showMemory) {
      const memoryElement = this.element.querySelector('[data-metric="memory"] .perf-value')
      const barElement = this.element.querySelector('[data-metric="memory"] .perf-bar')

      if (memoryElement) {
        memoryElement.textContent = `${Math.round(metrics.memory)}MB`
        memoryElement.className = 'perf-value'

        if (metrics.memory > 400) {
          memoryElement.classList.add('danger')
        } else if (metrics.memory > 200) {
          memoryElement.classList.add('warning')
        }
      }

      if (barElement) {
        const percentage = Math.min(metrics.memory / 500 * 100, 100)
        barElement.style.setProperty('--bar-width', `${percentage}%`)
      }
    }

    // 更新Draw Calls
    if (this.options.showDrawCalls) {
      const drawCallsElement = this.element.querySelector('[data-metric="drawCalls"] .perf-value')
      if (drawCallsElement) {
        drawCallsElement.textContent = metrics.drawCalls
      }
    }

    // 更新粒子数
    if (this.options.showParticles) {
      const particlesElement = this.element.querySelector('[data-metric="particles"] .perf-value')
      if (particlesElement) {
        particlesElement.textContent = metrics.particles.toLocaleString()
      }
    }

    // 更新LOD
    if (this.options.showLOD && metrics.lod) {
      const lodElement = this.element.querySelector('[data-metric="lod"] .perf-value')
      if (lodElement) {
        lodElement.textContent = metrics.lod.toUpperCase()
      }
    }

    // 更新建议
    this.updateSuggestions(metrics)
  }

  updateSuggestions(metrics) {
    const alertsElement = this.element.querySelector('.perf-alerts')
    const suggestionsElement = this.element.querySelector('.perf-suggestions')

    if (!alertsElement || !suggestionsElement) return

    let alertsHTML = ''
    let suggestionsHTML = ''

    // FPS警告
    if (metrics.fps < 20) {
      alertsHTML += `<div class="perf-alert">⚠️ FPS过低 (${Math.round(metrics.fps)})</div>`
      suggestionsHTML += `<div class="perf-suggestion">💡 建议：降低粒子数量或LOD等级</div>`
    } else if (metrics.fps < 30) {
      suggestionsHTML += `<div class="perf-suggestion">💡 考虑降低LOD以获得更流畅体验</div>`
    }

    // 内存警告
    if (metrics.memory > 400) {
      alertsHTML += `<div class="perf-alert">⚠️ 内存占用过高 (${Math.round(metrics.memory)}MB)</div>`
      suggestionsHTML += `<div class="perf-suggestion">💡 建议：减少粒子数量或优化纹理</div>`
    }

    // 粒子数建议
    if (metrics.particles > 100000 && metrics.fps < 30) {
      suggestionsHTML += `<div class="perf-suggestion">💡 粒子数过多，建议降至5万以内</div>`
    }

    alertsElement.innerHTML = alertsHTML
    suggestionsElement.innerHTML = suggestionsHTML
  }

  show() {
    if (this.element) {
      this.element.classList.remove('hidden')
      this.isVisible = true
    }
  }

  hide() {
    if (this.element) {
      this.element.classList.add('hidden')
      this.isVisible = false
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove()
      this.element = null
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}

// 创建全局单例
let globalPanel = null

export function createPerformancePanel(options) {
  if (globalPanel) {
    globalPanel.destroy()
  }
  globalPanel = new PerformancePanel(options)
  return globalPanel
}

export function getPerformancePanel() {
  return globalPanel
}

export function updatePerformancePanel(metrics) {
  if (globalPanel) {
    globalPanel.update(metrics)
  }
}

export default PerformancePanel
