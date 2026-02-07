/**
 * 性能监控器 - 实时监控WebGL性能
 * 提供FPS、内存、Draw Calls等关键指标
 */

export class PerformanceMonitor {
  constructor() {
    this.frames = 0
    this.lastTime = performance.now()
    this.fps = 0
    this.averageFPS = 0
    this.fpsHistory = []
    this.maxHistoryLength = 60

    this.particleCount = 0
    this.drawCalls = 0
    this.triangles = 0
    this.memoryUsed = 0
    this.memoryTotal = 0

    this.isMonitoring = false
    this.updateInterval = null
  }

  /**
   * 开始监控
   */
  start() {
    this.isMonitoring = true
    this.frames = 0
    this.lastTime = performance.now()
    this.fpsHistory = []

    // 每秒更新一次统计
    this.updateInterval = setInterval(() => {
      this.updateStats()
    }, 1000)
  }

  /**
   * 停止监控
   */
  stop() {
    this.isMonitoring = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  /**
   * 帧更新（每帧调用）
   */
  tick(renderer, particleCount = 0) {
    if (!this.isMonitoring) return

    this.frames++
    this.particleCount = particleCount

    // 从渲染器获取信息
    if (renderer && renderer.info) {
      this.drawCalls = renderer.info.render.calls
      this.triangles = renderer.info.render.triangles
    }

    // 获取内存信息（如果可用）
    if (performance.memory) {
      this.memoryUsed = performance.memory.usedJSHeapSize / 1048576  // MB
      this.memoryTotal = performance.memory.totalJSHeapSize / 1048576
    }
  }

  /**
   * 更新统计信息
   */
  updateStats() {
    const currentTime = performance.now()
    const delta = currentTime - this.lastTime

    this.fps = Math.round((this.frames * 1000) / delta)
    this.fpsHistory.push(this.fps)

    if (this.fpsHistory.length > this.maxHistoryLength) {
      this.fpsHistory.shift()
    }

    // 计算平均FPS
    this.averageFPS = Math.round(
      this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
    )

    this.frames = 0
    this.lastTime = currentTime
  }

  /**
   * 获取性能报告
   */
  getReport() {
    return {
      fps: this.fps,
      averageFPS: this.averageFPS,
      fpsHistory: [...this.fpsHistory],
      particleCount: this.particleCount,
      drawCalls: this.drawCalls,
      triangles: this.triangles,
      memoryUsed: Math.round(this.memoryUsed * 100) / 100,
      memoryTotal: Math.round(this.memoryTotal * 100) / 100,
      memoryUsagePercent: this.memoryTotal > 0
        ? Math.round((this.memoryUsed / this.memoryTotal) * 100)
        : 0,
      status: this.getStatus(),
      recommendations: this.getRecommendations()
    }
  }

  /**
   * 获取性能状态
   */
  getStatus() {
    const fps = this.averageFPS
    if (fps >= 55) return 'excellent'
    if (fps >= 45) return 'good'
    if (fps >= 30) return 'fair'
    return 'poor'
  }

  /**
   * 获取优化建议
   */
  getRecommendations() {
    const recommendations = []

    // FPS建议
    if (this.averageFPS < 30) {
      recommendations.push('FPS过低，建议大幅减少粒子数量')
    } else if (this.averageFPS < 45) {
      recommendations.push('FPS偏低，建议适度减少粒子数量或使用LOD')
    }

    // Draw Calls建议
    if (this.drawCalls > 100) {
      recommendations.push('Draw Calls过多，建议合并几何体或使用InstancedMesh')
    }

    // 内存建议
    if (this.memoryUsagePercent > 80) {
      recommendations.push('内存占用过高，建议优化纹理和几何体')
    }

    // 粒子建议
    if (this.particleCount > 100000 && this.averageFPS < 45) {
      recommendations.push('粒子数量过多，建议启用LOD系统或使用GPU加速')
    }

    return recommendations
  }

  /**
   * 重置统计
   */
  reset() {
    this.frames = 0
    this.lastTime = performance.now()
    this.fps = 0
    this.averageFPS = 0
    this.fpsHistory = []
    this.particleCount = 0
    this.drawCalls = 0
    this.triangles = 0
  }

  /**
   * 打印报告到控制台
   */
  logReport() {
    const report = this.getReport()
    console.group('📊 性能监控报告')
    console.log(`FPS: ${report.fps} (平均: ${report.averageFPS})`)
    console.log(`粒子数量: ${report.particleCount.toLocaleString()}`)
    console.log(`Draw Calls: ${report.drawCalls}`)
    console.log(`三角形: ${report.triangles.toLocaleString()}`)
    console.log(`内存: ${report.memoryUsed} MB / ${report.memoryTotal} MB (${report.memoryUsagePercent}%)`)
    console.log(`状态: ${this.getStatusIcon(report.status)} ${report.status.toUpperCase()}`)

    if (report.recommendations.length > 0) {
      console.group('优化建议')
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`)
      })
      console.groupEnd()
    }

    console.groupEnd()
  }

  /**
   * 获取状态图标
   */
  getStatusIcon(status) {
    const icons = {
      excellent: '🟢',
      good: '🟡',
      fair: '🟠',
      poor: '🔴'
    }
    return icons[status] || '⚪'
  }

  /**
   * 判断是否需要降低质量
   */
  shouldReduceQuality() {
    return this.averageFPS < 45
  }

  /**
   * 判断是否可以提高质量
   */
  canIncreaseQuality() {
    return this.averageFPS > 55
  }

  /**
   * 计算建议的粒子数量乘数
   */
  calculateParticleMultiplier() {
    const fps = this.averageFPS
    if (fps >= 55) return 1.2      // 可以增加20%
    if (fps >= 45) return 1.0      // 保持不变
    if (fps >= 30) return 0.7      // 减少30%
    return 0.5                     // 减少50%
  }
}
