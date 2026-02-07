/**
 * 增强版特效基类 - 集成性能监控和自适应LOD
 * 所有新特效应继承此类以获得完整的性能优化功能
 */

import { BaseEffect } from './BaseEffect.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

export class EnhancedBaseEffect extends BaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)

    // 性能监控
    this.monitor = new PerformanceMonitor()

    // LOD配置
    this.lodLevel = 'high'
    this.particleMultiplier = 1.0
    this.lodSettings = {
      high: { multiplier: 1.0, quality: 'high' },
      medium: { multiplier: 0.7, quality: 'medium' },
      low: { multiplier: 0.5, quality: 'low' }
    }

    // 自动LOD开关
    this.autoLODEnabled = true
    this.lodUpdateInterval = 2000  // 2秒更新一次LOD
    this.lastLODUpdate = 0

    // 性能指标
    this.performanceMetrics = {
      fps: 60,
      averageFPS: 60,
      particleCount: 0,
      drawCalls: 0,
      memoryUsed: 0
    }

    // 开始监控
    this.monitor.start()
  }

  /**
   * 更新性能指标（每帧调用）
   * @param {Number} particleCount - 当前粒子数量
   */
  updatePerformance(particleCount = 0) {
    this.monitor.tick(this.renderer, particleCount)

    const report = this.monitor.getReport()
    this.performanceMetrics = {
      fps: report.fps,
      averageFPS: report.averageFPS,
      particleCount: report.particleCount,
      drawCalls: report.drawCalls,
      memoryUsed: report.memoryUsed
    }

    // 自动更新LOD
    if (this.autoLODEnabled) {
      this.autoUpdateLOD()
    }
  }

  /**
   * 自动更新LOD等级
   */
  autoUpdateLOD() {
    const now = performance.now()
    if (now - this.lastLODUpdate < this.lodUpdateInterval) {
      return
    }

    const report = this.monitor.getReport()
    const newMultiplier = report.recommendations.length > 0
      ? this.monitor.calculateParticleMultiplier()
      : 1.0

    // 确定LOD等级
    if (newMultiplier >= 1.0) {
      this.lodLevel = 'high'
    } else if (newMultiplier >= 0.7) {
      this.lodLevel = 'medium'
    } else {
      this.lodLevel = 'low'
    }

    // 如果乘数变化超过10%，则应用新值
    if (Math.abs(this.particleMultiplier - newMultiplier) > 0.1) {
      this.particleMultiplier = newMultiplier
      this.onLODChange?.(this.lodLevel, this.particleMultiplier)
    }

    this.lastLODUpdate = now
  }

  /**
   * 手动设置LOD等级
   */
  setLODLevel(level) {
    if (this.lodSettings[level]) {
      this.lodLevel = level
      this.particleMultiplier = this.lodSettings[level].multiplier
      this.autoLODEnabled = false  // 手动设置后禁用自动LOD
      this.onLODChange?.(this.lodLevel, this.particleMultiplier)
    }
  }

  /**
   * 启用/禁用自动LOD
   */
  setAutoLOD(enabled) {
    this.autoLODEnabled = enabled
  }

  /**
   * 获取调整后的粒子数量
   */
  getAdjustedParticleCount(baseCount) {
    return Math.round(baseCount * this.particleMultiplier)
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    const report = this.monitor.getReport()
    return {
      ...report,
      lodLevel: this.lodLevel,
      particleMultiplier: this.particleMultiplier,
      autoLODEnabled: this.autoLODEnabled
    }
  }

  /**
   * 打印性能报告
   */
  logPerformanceReport() {
    const report = this.getPerformanceReport()
    console.group(`📊 ${this.constructor.name} 性能报告`)
    console.log(`FPS: ${report.fps} (平均: ${report.averageFPS})`)
    console.log(`LOD等级: ${report.lodLevel.toUpperCase()} (乘数: ${report.particleMultiplier})`)
    console.log(`粒子数量: ${report.particleCount.toLocaleString()}`)
    console.log(`Draw Calls: ${report.drawCalls}`)
    console.log(`状态: ${this.monitor.getStatusIcon(report.status)} ${report.status}`)
    console.groupEnd()
  }

  /**
   * 获取LOD配置
   */
  getLODConfig(level) {
    return this.lodSettings[level] || this.lodSettings.high
  }

  /**
   * 检查是否应该降低质量
   */
  shouldReduceQuality() {
    return this.monitor.shouldReduceQuality()
  }

  /**
   * 检查是否可以提高质量
   */
  canIncreaseQuality() {
    return this.monitor.canIncreaseQuality()
  }

  /**
   * 重置监控数据
   */
  resetMonitor() {
    this.monitor.reset()
  }

  /**
   * 清理资源
   */
  cleanup() {
    // 停止监控
    this.monitor.stop()
    this.monitor.reset()

    // 调用父类清理
    super.cleanup()
  }

  /**
   * 获取优化建议
   */
  getRecommendations() {
    return this.monitor.getRecommendations()
  }

  /**
   * 子类可选：LOD变化回调
   * @param {String} level - 新的LOD等级
   * @param {Number} multiplier - 新的粒子乘数
   */
  onLODChange(level, multiplier) {
    // 子类可以重写此方法来响应LOD变化
    // 例如：动态调整粒子数量、质量等
  }

  /**
   * 获取当前状态摘要
   */
  getStatusSummary() {
    return {
      isActive: this.isActive,
      lodLevel: this.lodLevel,
      fps: this.performanceMetrics.fps,
      particleCount: this.performanceMetrics.particleCount,
      status: this.monitor.getStatus()
    }
  }
}
