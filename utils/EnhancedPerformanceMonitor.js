/**
 * 增强型性能监控系统
 * 集成FPS、内存、GPU、帧时间等多维度性能指标
 * 提供性能预警、趋势分析和优化建议
 */

export class EnhancedPerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      sampleInterval: 1000,           // 采样间隔
      historyLength: 120,              // 历史数据长度
      enableMemoryTracking: true,      // 启用内存跟踪
      enableGPUTracking: true,         // 启用GPU跟踪
      enableFrameTime: true,           // 启用帧时间跟踪
      enablePredictiveAlerts: true,    // 启用预测性告警
      ...options
    }

    // FPS相关
    this.frames = 0
    this.lastTime = performance.now()
    this.fps = 0
    this.averageFPS = 0
    this.fpsHistory = []
    this.minFPS = Infinity
    this.maxFPS = 0

    // 帧时间
    this.frameTimes = []
    this.averageFrameTime = 0
    this.maxFrameTime = 0
    this.frameJitter = 0

    // 内存相关
    this.memoryUsed = 0
    this.memoryTotal = 0
    this.memoryHistory = []
    this.memoryPeak = 0
    this.gcCount = 0
    this.lastGCTime = 0

    // 渲染相关
    this.drawCalls = 0
    this.triangles = 0
    this.geometries = 0
    this.textures = 0
    this.programs = 0
    this.renderHistory = []

    // 自定义指标
    this.customMetrics = new Map()
    this.metricHistory = new Map()

    // 告警系统
    this.alerts = []
    this.alertCallbacks = []
    this.thresholds = {
      fps: { warning: 45, critical: 30 },
      frameTime: { warning: 22, critical: 33 },  // ms
      memory: { warning: 200, critical: 400 },  // MB
      drawCalls: { warning: 100, critical: 200 }
    }

    this.isMonitoring = false
    this.updateInterval = null
    this.sampleStartTime = null
  }

  /**
   * 开始监控
   */
  start() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.frames = 0
    this.lastTime = performance.now()
    this.sampleStartTime = performance.now()
    this.fpsHistory = []
    this.frameTimes = []
    this.memoryHistory = []
    this.renderHistory = []

    this.updateInterval = setInterval(() => {
      this.updateStats()
    }, this.options.sampleInterval)
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
  tick(renderer, particleCount = 0, deltaTime = 0) {
    if (!this.isMonitoring) return

    const currentTime = performance.now()
    this.frames++

    // 记录帧时间
    const frameTime = currentTime - this.lastTime
    this.lastTime = currentTime

    if (this.options.enableFrameTime) {
      this.trackFrameTime(frameTime)
    }

    // 从渲染器获取信息
    if (renderer && renderer.info) {
      this.drawCalls = renderer.info.render.calls
      this.triangles = renderer.info.render.triangles
      this.geometries = renderer.info.memory?.geometries || 0
      this.textures = renderer.info.memory?.textures || 0
      this.programs = renderer.info.programs?.length || 0
    }

    // 自定义指标更新
    this.updateCustomMetrics(particleCount)

    // 获取内存信息
    if (this.options.enableMemoryTracking && performance.memory) {
      const currentMemory = performance.memory.usedJSHeapSize / 1048576
      this.memoryUsed = currentMemory
      this.memoryTotal = performance.memory.totalJSHeapSize / 1048576

      // 检测GC
      if (this.lastGCTime > 0 && currentMemory < this.lastGCTime * 0.9) {
        this.gcCount++
      }
      this.lastGCTime = currentMemory

      // 记录内存峰值
      if (currentMemory > this.memoryPeak) {
        this.memoryPeak = currentMemory
      }
    }

    // 预测性告警
    if (this.options.enablePredictiveAlerts) {
      this.checkPredictiveAlerts()
    }
  }

  /**
   * 跟踪帧时间
   */
  trackFrameTime(frameTime) {
    this.frameTimes.push(frameTime)

    if (this.frameTimes.length > 60) {
      this.frameTimes.shift()
    }

    this.averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    this.maxFrameTime = Math.max(...this.frameTimes)

    // 计算帧抖动
    const sumSquaredDiff = this.frameTimes.reduce((sum, ft) => {
      const diff = ft - this.averageFrameTime
      return sum + diff * diff
    }, 0)
    this.frameJitter = Math.sqrt(sumSquaredDiff / this.frameTimes.length)
  }

  /**
   * 更新统计信息
   */
  updateStats() {
    const currentTime = performance.now()
    const delta = currentTime - this.sampleStartTime

    // 计算FPS
    this.fps = Math.round((this.frames * 1000) / delta)
    this.fpsHistory.push(this.fps)

    if (this.fpsHistory.length > this.options.historyLength) {
      this.fpsHistory.shift()
    }

    // 统计FPS范围
    if (this.fps > this.maxFPS) this.maxFPS = this.fps
    if (this.fps < this.minFPS) this.minFPS = this.fps

    // 计算平均FPS
    this.averageFPS = Math.round(
      this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
    )

    // 记录内存历史
    if (this.options.enableMemoryTracking) {
      this.memoryHistory.push(this.memoryUsed)
      if (this.memoryHistory.length > this.options.historyLength) {
        this.memoryHistory.shift()
      }
    }

    // 记录渲染历史
    this.renderHistory.push({
      drawCalls: this.drawCalls,
      triangles: this.triangles,
      geometries: this.geometries,
      textures: this.textures,
      programs: this.programs
    })
    if (this.renderHistory.length > this.options.historyLength) {
      this.renderHistory.shift()
    }

    // 更新自定义指标历史
    this.updateMetricHistory()

    // 重置计数器
    this.frames = 0
    this.sampleStartTime = currentTime

    // 检查阈值
    this.checkThresholds()
  }

  /**
   * 注册自定义指标
   */
  registerMetric(name, options = {}) {
    this.customMetrics.set(name, {
      value: 0,
      min: Infinity,
      max: -Infinity,
      average: 0,
      history: [],
      unit: options.unit || '',
      threshold: options.threshold || null,
      description: options.description || ''
    })

    this.metricHistory.set(name, [])
  }

  /**
   * 更新自定义指标
   */
  updateCustomMetrics(particleCount = 0) {
    // 粒子数量
    if (this.customMetrics.has('particles')) {
      this.setMetric('particles', particleCount)
    }

    // 纹理加载进度
    if (this.customMetrics.has('textureLoadProgress')) {
      const progress = THREE.DefaultLoadingManager ? THREE.DefaultLoadingManager.itemsLoaded /
                       Math.max(THREE.DefaultLoadingManager.itemsTotal, 1) * 100 : 0
      this.setMetric('textureLoadProgress', progress)
    }
  }

  /**
   * 设置自定义指标值
   */
  setMetric(name, value) {
    const metric = this.customMetrics.get(name)
    if (!metric) return

    metric.value = value
    if (value < metric.min) metric.min = value
    if (value > metric.max) metric.max = value
  }

  /**
   * 更新指标历史
   */
  updateMetricHistory() {
    this.customMetrics.forEach((metric, name) => {
      const history = this.metricHistory.get(name)
      if (history) {
        history.push(metric.value)
        if (history.length > this.options.historyLength) {
          history.shift()
        }

        // 计算平均值
        metric.average = history.reduce((sum, val) => sum + val, 0) / history.length
      }
    })
  }

  /**
   * 检查阈值
   */
  checkThresholds() {
    this.alerts = []

    // FPS检查
    if (this.fps < this.thresholds.fps.critical) {
      this.addAlert('critical', 'fps', `FPS过低: ${this.fps}`)
    } else if (this.fps < this.thresholds.fps.warning) {
      this.addAlert('warning', 'fps', `FPS偏低: ${this.fps}`)
    }

    // 帧时间检查
    if (this.maxFrameTime > this.thresholds.frameTime.critical) {
      this.addAlert('critical', 'frameTime', `帧时间过长: ${this.maxFrameTime.toFixed(2)}ms`)
    } else if (this.maxFrameTime > this.thresholds.frameTime.warning) {
      this.addAlert('warning', 'frameTime', `帧时间偏高: ${this.maxFrameTime.toFixed(2)}ms`)
    }

    // 内存检查
    if (this.memoryUsed > this.thresholds.memory.critical) {
      this.addAlert('critical', 'memory', `内存占用过高: ${Math.round(this.memoryUsed)}MB`)
    } else if (this.memoryUsed > this.thresholds.memory.warning) {
      this.addAlert('warning', 'memory', `内存占用偏高: ${Math.round(this.memoryUsed)}MB`)
    }

    // Draw Calls检查
    if (this.drawCalls > this.thresholds.drawCalls.critical) {
      this.addAlert('critical', 'drawCalls', `Draw Calls过多: ${this.drawCalls}`)
    } else if (this.drawCalls > this.thresholds.drawCalls.warning) {
      this.addAlert('warning', 'drawCalls', `Draw Calls较多: ${this.drawCalls}`)
    }

    // 通知告警回调
    this.notifyAlerts()
  }

  /**
   * 预测性告警
   */
  checkPredictiveAlerts() {
    const fpsTrend = this.calculateTrend(this.fpsHistory.slice(-10))
    const memoryTrend = this.calculateTrend(this.memoryHistory.slice(-10))

    // FPS下降趋势
    if (fpsTrend < -2) {
      this.addAlert('warning', 'trend', `FPS呈下降趋势 (${fpsTrend.toFixed(2)})`)
    }

    // 内存增长趋势
    if (memoryTrend > 5) {
      this.addAlert('warning', 'trend', `内存呈增长趋势 (${memoryTrend.toFixed(2)}MB)`)
    }
  }

  /**
   * 计算趋势
   */
  calculateTrend(data) {
    if (data.length < 2) return 0

    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

    return secondAvg - firstAvg
  }

  /**
   * 添加告警
   */
  addAlert(level, type, message) {
    this.alerts.push({
      level,
      type,
      message,
      timestamp: Date.now()
    })
  }

  /**
   * 通知告警
   */
  notifyAlerts() {
    this.alerts.forEach(alert => {
      this.alertCallbacks.forEach(callback => callback(alert))
    })
  }

  /**
   * 添加告警回调
   */
  onAlert(callback) {
    this.alertCallbacks.push(callback)
  }

  /**
   * 获取完整报告
   */
  getReport() {
    return {
      // 基本信息
      timestamp: Date.now(),
      uptime: Math.round((performance.now() - this.sampleStartTime) / 1000),

      // FPS信息
      fps: this.fps,
      averageFPS: this.averageFPS,
      minFPS: this.minFPS === Infinity ? 0 : this.minFPS,
      maxFPS: this.maxFPS,
      fpsHistory: [...this.fpsHistory],
      fpsStability: this.calculateStability(this.fpsHistory),

      // 帧时间信息
      averageFrameTime: this.averageFrameTime.toFixed(2),
      maxFrameTime: this.maxFrameTime.toFixed(2),
      frameJitter: this.frameJitter.toFixed(2),
      frameTimeHistory: [...this.frameTimes],

      // 内存信息
      memoryUsed: Math.round(this.memoryUsed * 100) / 100,
      memoryTotal: Math.round(this.memoryTotal * 100) / 100,
      memoryUsagePercent: this.memoryTotal > 0
        ? Math.round((this.memoryUsed / this.memoryTotal) * 100)
        : 0,
      memoryPeak: Math.round(this.memoryPeak * 100) / 100,
      memoryHistory: [...this.memoryHistory],
      gcCount: this.gcCount,

      // 渲染信息
      drawCalls: this.drawCalls,
      triangles: this.triangles,
      geometries: this.geometries,
      textures: this.textures,
      programs: this.programs,
      renderHistory: [...this.renderHistory],

      // 自定义指标
      customMetrics: this.getCustomMetrics(),

      // 告警信息
      alerts: [...this.alerts],
      status: this.getStatus(),

      // 建议
      recommendations: this.getRecommendations(),
      score: this.calculatePerformanceScore()
    }
  }

  /**
   * 获取自定义指标
   */
  getCustomMetrics() {
    const metrics = {}
    this.customMetrics.forEach((metric, name) => {
      metrics[name] = {
        value: metric.value,
        min: metric.min === Infinity ? 0 : metric.min,
        max: metric.max === -Infinity ? 0 : metric.max,
        average: metric.average,
        unit: metric.unit,
        description: metric.description
      }
    })
    return metrics
  }

  /**
   * 计算稳定性
   */
  calculateStability(history) {
    if (history.length < 2) return 100

    const avg = history.reduce((a, b) => a + b, 0) / history.length
    const variance = history.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / history.length
    const stdDev = Math.sqrt(variance)

    // 稳定性百分比（标准差越小越稳定）
    return Math.max(0, Math.min(100, 100 - (stdDev / avg) * 100))
  }

  /**
   * 获取性能状态
   */
  getStatus() {
    const score = this.calculatePerformanceScore()
    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'fair'
    return 'poor'
  }

  /**
   * 计算性能得分
   */
  calculatePerformanceScore() {
    let score = 100

    // FPS得分
    const fpsScore = Math.min(100, (this.averageFPS / 60) * 100)
    score = score * 0.4 + fpsScore * 0.4

    // 帧时间得分
    const frameTimeScore = Math.min(100, (33 / this.averageFrameTime) * 100)
    score = score * 0.7 + frameTimeScore * 0.3

    // 内存得分
    const memoryScore = Math.min(100, (200 / Math.max(this.memoryUsed, 1)) * 100)
    score = score * 0.8 + memoryScore * 0.2

    return Math.round(score)
  }

  /**
   * 获取优化建议
   */
  getRecommendations() {
    const recommendations = []

    // FPS建议
    if (this.averageFPS < 30) {
      recommendations.push('FPS严重不足，建议：大幅减少粒子数量、降低特效质量')
    } else if (this.averageFPS < 45) {
      recommendations.push('FPS偏低，建议：适度减少粒子数量、启用LOD系统')
    }

    // 帧时间建议
    if (this.averageFrameTime > 33) {
      recommendations.push('帧时间过长，建议：优化渲染逻辑、使用GPU计算着色器')
    }

    // 帧抖动建议
    if (this.frameJitter > 5) {
      recommendations.push('帧抖动较高，建议：检查是否有不稳定的计算、优化时间步长')
    }

    // Draw Calls建议
    if (this.drawCalls > 200) {
      recommendations.push('Draw Calls过多，建议：合并几何体、使用InstancedMesh、减少材质切换')
    } else if (this.drawCalls > 100) {
      recommendations.push('Draw Calls较多，建议：考虑合并渲染对象')
    }

    // 内存建议
    if (this.memoryUsed > 400) {
      recommendations.push('内存占用过高，建议：优化纹理尺寸、释放未使用资源、启用纹理压缩')
    } else if (this.memoryUsed > 200) {
      recommendations.push('内存占用偏高，建议：检查内存泄漏、优化资源加载')
    }

    // 纹理建议
    if (this.textures > 50) {
      recommendations.push('纹理数量过多，建议：使用纹理图集、压缩纹理')
    }

    // GC建议
    if (this.gcCount > 10) {
      recommendations.push('GC频繁，建议：使用对象池、减少临时对象创建')
    }

    return recommendations
  }

  /**
   * 重置统计
   */
  reset() {
    this.frames = 0
    this.lastTime = performance.now()
    this.sampleStartTime = performance.now()
    this.fps = 0
    this.averageFPS = 0
    this.minFPS = Infinity
    this.maxFPS = 0
    this.fpsHistory = []
    this.frameTimes = []
    this.memoryHistory = []
    this.renderHistory = []
    this.memoryPeak = 0
    this.gcCount = 0
    this.alerts = []

    this.customMetrics.forEach(metric => {
      metric.min = Infinity
      metric.max = -Infinity
      metric.average = 0
    })
  }

  /**
   * 打印报告到控制台
   */
  logReport() {
    const report = this.getReport()
    console.group('📊 增强性能监控报告')

    console.log(`📈 性能得分: ${report.score}/100`)
    console.log(`🎯 状态: ${this.getStatusIcon(report.status)} ${report.status.toUpperCase()}`)

    console.group('FPS')
    console.log(`当前: ${report.fps} | 平均: ${report.averageFPS} | 范围: ${report.minFPS}-${report.maxFPS}`)
    console.log(`稳定性: ${report.fpsStability.toFixed(1)}%`)
    console.groupEnd()

    console.group('帧时间')
    console.log(`平均: ${report.averageFrameTime}ms | 最大: ${report.maxFrameTime}ms | 抖动: ${report.frameJitter}ms`)
    console.groupEnd()

    console.group('内存')
    console.log(`已用: ${report.memoryUsed}MB / ${report.memoryTotal}MB (${report.memoryUsagePercent}%)`)
    console.log(`峰值: ${report.memoryPeak}MB | GC次数: ${report.gcCount}`)
    console.groupEnd()

    console.group('渲染')
    console.log(`Draw Calls: ${report.drawCalls} | 三角形: ${report.triangles.toLocaleString()}`)
    console.log(`几何体: ${report.geometries} | 纹理: ${report.textures} | 程序: ${report.programs}`)
    console.groupEnd()

    if (Object.keys(report.customMetrics).length > 0) {
      console.group('自定义指标')
      Object.entries(report.customMetrics).forEach(([name, metric]) => {
        console.log(`${name}: ${metric.value}${metric.unit} (平均: ${metric.average.toFixed(2)})`)
      })
      console.groupEnd()
    }

    if (report.alerts.length > 0) {
      console.group('告警')
      report.alerts.forEach(alert => {
        const icon = alert.level === 'critical' ? '🔴' : '🟡'
        console.log(`${icon} ${alert.message}`)
      })
      console.groupEnd()
    }

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
    return this.averageFPS < 45 || this.averageFrameTime > 22
  }

  /**
   * 判断是否可以提高质量
   */
  canIncreaseQuality() {
    return this.averageFPS > 55 && this.averageFrameTime < 18
  }

  /**
   * 获取趋势信息
   */
  getTrend() {
    const fpsTrend = this.calculateTrend(this.fpsHistory.slice(-10))
    const memoryTrend = this.calculateTrend(this.memoryHistory.slice(-10))

    return {
      fps: {
        current: fpsTrend,
        direction: fpsTrend > 0 ? 'improving' : fpsTrend < 0 ? 'declining' : 'stable',
        magnitude: Math.abs(fpsTrend)
      },
      memory: {
        current: memoryTrend,
        direction: memoryTrend > 0 ? 'increasing' : memoryTrend < 0 ? 'decreasing' : 'stable',
        magnitude: Math.abs(memoryTrend)
      }
    }
  }
}

export default EnhancedPerformanceMonitor
