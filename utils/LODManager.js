/**
 * LOD管理器 - 统一的自适应细节等级管理
 * 根据性能自动调整粒子数量和渲染质量
 */

import { PerformanceMonitor } from './PerformanceMonitor.js'

export class LODManager {
  constructor() {
    this.monitor = new PerformanceMonitor()
    this.lodLevels = {
      ultra: { multiplier: 1.5, quality: 'ultra', fpsThreshold: 55 },
      high: { multiplier: 1.0, quality: 'high', fpsThreshold: 50 },
      medium: { multiplier: 0.7, quality: 'medium', fpsThreshold: 40 },
      low: { multiplier: 0.5, quality: 'low', fpsThreshold: 30 },
      potato: { multiplier: 0.3, quality: 'potato', fpsThreshold: 20 }
    }
    this.currentLevel = 'high'
    this.autoLODEnabled = true
    this.lastUpdate = 0
    this.updateInterval = 2000 // 2秒更新一次
  }

  /**
   * 开始LOD管理
   */
  start() {
    this.monitor.start()
  }

  /**
   * 停止LOD管理
   */
  stop() {
    this.monitor.stop()
  }

  /**
   * 更新LOD等级（每帧调用）
   */
  update(particleCount = 0, renderer = null) {
    this.monitor.tick(renderer, particleCount)

    if (this.autoLODEnabled) {
      this.autoUpdateLOD()
    }
  }

  /**
   * 自动更新LOD等级
   */
  autoUpdateLOD() {
    const now = performance.now()
    if (now - this.lastUpdate < this.updateInterval) {
      return
    }

    const report = this.monitor.getReport()
    const newLevel = this.calculateLODLevel(report.averageFPS)

    if (newLevel !== this.currentLevel) {
      this.setLODLevel(newLevel)
      console.log(`LOD自动调整: ${this.currentLevel} -> ${newLevel}`)
    }

    this.lastUpdate = now
  }

  /**
   * 根据FPS计算LOD等级
   */
  calculateLODLevel(fps) {
    if (fps >= this.lodLevels.ultra.fpsThreshold) return 'ultra'
    if (fps >= this.lodLevels.high.fpsThreshold) return 'high'
    if (fps >= this.lodLevels.medium.fpsThreshold) return 'medium'
    if (fps >= this.lodLevels.low.fpsThreshold) return 'low'
    return 'potato'
  }

  /**
   * 手动设置LOD等级
   */
  setLODLevel(level) {
    if (this.lodLevels[level]) {
      this.currentLevel = level
      this.autoLODEnabled = false
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
  getAdjustedCount(baseCount) {
    return Math.round(baseCount * this.lodLevels[this.currentLevel].multiplier)
  }

  /**
   * 获取当前LOD配置
   */
  getCurrentConfig() {
    return this.lodLevels[this.currentLevel]
  }

  /**
   * 获取性能报告
   */
  getReport() {
    return {
      ...this.monitor.getReport(),
      currentLevel: this.currentLevel,
      currentMultiplier: this.lodLevels[this.currentLevel].multiplier,
      autoLODEnabled: this.autoLODEnabled
    }
  }

  /**
   * 打印报告
   */
  logReport() {
    const report = this.getReport()
    console.group('📊 LOD性能报告')
    console.log(`FPS: ${report.fps} (平均: ${report.averageFPS})`)
    console.log(`LOD等级: ${report.currentLevel.toUpperCase()} (乘数: ${report.currentMultiplier})`)
    console.log(`状态: ${this.monitor.getStatusIcon(report.status)} ${report.status}`)
    console.groupEnd()
  }

  /**
   * 批量调整粒子数量
   */
  adjustParticleSystemCounts(systems) {
    Object.keys(systems).forEach(key => {
      const baseCount = systems[key].baseCount
      systems[key].currentCount = this.getAdjustedCount(baseCount)
    })
  }

  /**
   * 获取渲染质量建议
   */
  getRenderQuality() {
    const config = this.lodLevels[this.currentLevel]
    return {
      level: this.currentLevel,
      shadowQuality: this.getShadowQuality(),
      antialiasing: this.getAntialiasing(),
      textureQuality: this.getTextureQuality()
    }
  }

  getShadowQuality() {
    const qualities = {
      ultra: 2048,
      high: 1024,
      medium: 512,
      low: 256,
      potato: 128
    }
    return qualities[this.currentLevel]
  }

  getAntialiasing() {
    const qualities = {
      ultra: true,
      high: true,
      medium: false,
      low: false,
      potato: false
    }
    return qualities[this.currentLevel]
  }

  getTextureQuality() {
    const qualities = {
      ultra: 1.0,
      high: 1.0,
      medium: 0.75,
      low: 0.5,
      potato: 0.25
    }
    return qualities[this.currentLevel]
  }

  /**
   * 重置
   */
  reset() {
    this.monitor.reset()
    this.currentLevel = 'high'
    this.autoLODEnabled = true
  }
}
