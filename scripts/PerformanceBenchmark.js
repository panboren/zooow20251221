/**
 * 性能基准测试工具
 * 对比不同动画的性能表现，建立性能基准
 */

import { performance } from 'perf_hooks'
import { PerformanceMonitor } from '../utils/PerformanceMonitor.js'
import * as THREE from 'three'

export class PerformanceBenchmark {
  constructor() {
    this.results = []
    this.benchmarks = {}
  }

  /**
   * 运行基准测试
   */
  async runBenchmark(config) {
    const {
      name,
      animationFn,
      scene,
      camera,
      renderer,
      controls,
      duration = 5000,
      warmupDuration = 1000
    } = config

    console.log(\`\\n🏃 运行基准测试: \${name}\`)
    console.log(\`持续时间: \${duration}ms (预热: \${warmupDuration}ms)\`)

    // 预热
    await this.warmup(animationFn, scene, camera, renderer, controls, warmupDuration)

    // 正式测试
    const result = await this.measurePerformance(
      animationFn,
      scene,
      camera,
      renderer,
      controls,
      duration
    )

    this.results.push({
      name,
      ...result,
      timestamp: Date.now()
    })

    this.printResult(result)

    return result
  }

  /**
   * 预热阶段
   */
  async warmup(animationFn, scene, camera, renderer, controls, duration) {
    try {
      await animationFn({ scene, camera, renderer, controls })
      await new Promise(resolve => setTimeout(resolve, duration))
    } catch (error) {
      console.log(\`预热失败: \${error.message}\`)
    }
  }

  /**
   * 测量性能
   */
  async measurePerformance(animationFn, scene, camera, renderer, controls, duration) {
    const monitor = new PerformanceMonitor()
    monitor.start()

    const startTime = performance.now()

    // 执行动画
    let updateFn = null
    try {
      const result = await animationFn({ scene, camera, renderer, controls })
      updateFn = result?.updateHandler
    } catch (error) {
      return {
        error: error.message,
        success: false
      }
    }

    // 运行性能监控
    let frameCount = 0
    const startFrame = renderer.info.render.frame

    const monitorInterval = setInterval(() => {
      monitor.tick(renderer)
      frameCount++
    }, 16)

    await new Promise(resolve => setTimeout(resolve, duration))

    clearInterval(monitorInterval)

    const endTime = performance.now()
    const totalFrames = renderer.info.render.frame - startFrame

    monitor.stop()

    const report = monitor.getReport()

    // 清理
    scene.clear()

    return {
      success: true,
      duration: Math.round(endTime - startTime),
      totalFrames,
      averageFPS: report.averageFPS,
      minFPS: Math.min(...report.fpsHistory),
      maxFPS: Math.max(...report.fpsHistory),
      fpsStdDev: this.calculateStdDev(report.fpsHistory),
      particleCount: report.particleCount,
      drawCalls: report.drawCalls,
      triangles: report.triangles,
      memoryUsed: report.memoryUsed,
      memoryTotal: report.memoryTotal,
      status: report.status
    }
  }

  /**
   * 计算标准差
   */
  calculateStdDev(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
    return Math.sqrt(avgSquaredDiff)
  }

  /**
   * 打印结果
   */
  printResult(result) {
    if (!result.success) {
      console.log(\`❌ 测试失败: \${result.error}\`)
      return
    }

    console.log('\\n📊 性能指标:')
    console.log(\`  平均FPS: \${result.averageFPS.toFixed(1)}\`)
    console.log(\`  FPS范围: \${result.minFPS.toFixed(1)} - \${result.maxFPS.toFixed(1)}\`)
    console.log(\`  FPS标准差: \${result.fpsStdDev.toFixed(2)}\`)
    console.log(\`  总帧数: \${result.totalFrames}\`)
    console.log(\`  粒子数量: \${result.particleCount.toLocaleString()}\`)
    console.log(\`  Draw Calls: \${result.drawCalls}\`)
    console.log(\`  三角形: \${result.triangles.toLocaleString()}\`)
    console.log(\`  内存使用: \${result.memoryUsed.toFixed(2)} MB\`)
    console.log(\`  状态: \${this.getStatusIcon(result.status)} \${result.status.toUpperCase()}\`)
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
   * 对比两个基准测试结果
   */
  compare(result1, result2) {
    const comparison = {
      name: \`\${result1.name} vs \${result2.name}\`,
      fpsDiff: result2.averageFPS - result1.averageFPS,
      fpsPercent: ((result2.averageFPS - result1.averageFPS) / result1.averageFPS * 100).toFixed(1),
      particleDiff: result2.particleCount - result1.particleCount,
      drawCallsDiff: result2.drawCalls - result1.drawCalls,
      memoryDiff: result2.memoryUsed - result1.memoryUsed
    }

    console.log('\\n' + '='.repeat(50))
    console.log(\`📈 对比: \${comparison.name}\`)
    console.log('='.repeat(50))

    const fpsSymbol = comparison.fpsDiff > 0 ? '📈' : '📉'
    console.log(\`  FPS: \${result1.averageFPS.toFixed(1)} → \${result2.averageFPS.toFixed(1)} \${fpsSymbol} (\${comparison.fpsPercent}%)\`)
    console.log(\`  粒子: \${result1.particleCount.toLocaleString()} → \${result2.particleCount.toLocaleString()}\`)
    console.log(\`  Draw Calls: \${result1.drawCalls} → \${result2.drawCalls}\`)
    console.log(\`  内存: \${result1.memoryUsed.toFixed(2)} → \${result2.memoryUsed.toFixed(2)} MB\`)

    return comparison
  }

  /**
   * 生成性能报告
   */
  generateReport() {
    const report = {
      timestamp: Date.now(),
      totalTests: this.results.length,
      summary: {
        bestFPS: 0,
        worstFPS: Infinity,
        avgFPS: 0,
        avgDrawCalls: 0,
        avgMemory: 0
      },
      results: this.results
    }

    if (this.results.length === 0) return report

    // 计算汇总
    report.summary.bestFPS = Math.max(...this.results.map(r => r.averageFPS))
    report.summary.worstFPS = Math.min(...this.results.map(r => r.averageFPS))
    report.summary.avgFPS = this.results.reduce((sum, r) => sum + r.averageFPS, 0) / this.results.length
    report.summary.avgDrawCalls = this.results.reduce((sum, r) => sum + r.drawCalls, 0) / this.results.length
    report.summary.avgMemory = this.results.reduce((sum, r) => sum + r.memoryUsed, 0) / this.results.length

    return report
  }

  /**
   * 导出为JSON
   */
  exportJSON(filePath) {
    const report = this.generateReport()
    const fs = require('fs')
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8')
    console.log(\`✅ 性能报告已导出: \${filePath}\`)
  }

  /**
   * 运行LOD基准测试
   */
  async runLODBenchmark(config) {
    const { name, animationFn, scene, camera, renderer, controls, lods } = config

    console.log(\`\\n🎯 运行LOD基准测试: \${name}\`)

    const lodResults = []

    for (const lod of lods) {
      console.log(\`\\n  测试LOD: \${lod.name} (乘数: \${lod.multiplier})\`)

      // 模拟LOD设置
      const result = await this.runBenchmark({
        name: \`\${name} - \${lod.name}\`,
        animationFn,
        scene,
        camera,
        renderer,
        controls,
        duration: 3000
      })

      lodResults.push({
        lod: lod.name,
        multiplier: lod.multiplier,
        ...result
      })
    }

    this.printLODResults(lodResults)

    return lodResults
  }

  /**
   * 打印LOD结果
   */
  printLODResults(results) {
    console.log('\\n📊 LOD性能对比:')
    console.log('='.repeat(60))
    console.log(\`  LOD等级    FPS    粒子数    Draw Calls    内存(MB)\`)
    console.log('  '.repeat(60))

    results.forEach(r => {
      console.log(
        \`  \${r.lod.padEnd(10)} \${r.averageFPS.toFixed(1).padStart(6)} \${r.particleCount.toLocaleString().padStart(10)} \${r.drawCalls.toString().padStart(12)} \${r.memoryUsed.toFixed(2).padStart(10)}\`
      )
    })
  }

  /**
   * 重置
   */
  reset() {
    this.results = []
    this.benchmarks = {}
  }
}

/**
 * 预定义基准测试场景
 */
export class BenchmarkScenarios {
  /**
   * 小规模粒子测试
   */
  static smallParticles() {
    return {
      name: '小规模粒子 (1000)',
      particleCount: 1000,
      targetFPS: 60
    }
  }

  /**
   * 中等规模粒子测试
   */
  static mediumParticles() {
    return {
      name: '中等规模粒子 (10000)',
      particleCount: 10000,
      targetFPS: 55
    }
  }

  /**
   * 大规模粒子测试
   */
  static largeParticles() {
    return {
      name: '大规模粒子 (50000)',
      particleCount: 50000,
      targetFPS: 45
    }
  }

  /**
   * 超大规模粒子测试
   */
  static ultraParticles() {
    return {
      name: '超大规模粒子 (100000)',
      particleCount: 100000,
      targetFPS: 30
    }
  }

  /**
   * LOD场景
   */
  static lodScenarios() {
    return [
      { name: 'Ultra', multiplier: 1.5, targetFPS: 55 },
      { name: 'High', multiplier: 1.0, targetFPS: 50 },
      { name: 'Medium', multiplier: 0.7, targetFPS: 40 },
      { name: 'Low', multiplier: 0.5, targetFPS: 30 },
      { name: 'Potato', multiplier: 0.3, targetFPS: 20 }
    ]
  }
}

// 命令行使用
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  console.log('性能基准测试工具')
  console.log('用法: node PerformanceBenchmark.js <animation-module>')
  console.log('示例: node PerformanceBenchmark.js ./my-animation.js')
}
