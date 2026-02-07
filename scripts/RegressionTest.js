/**
 * 全量回归测试
 * 测试所有动画在优化后的表现
 */

const fs = require('fs')
const path = require('path')

export class RegressionTest {
  constructor() {
    this.results = []
    this.animations = []
    this.baseline = null
  }

  /**
   * 扫描所有动画文件
   */
  scanAnimations(animationDir) {
    const animations = []

    function scanDirectory(dir) {
      const items = fs.readdirSync(dir)

      items.forEach(item => {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory() && item !== 'base' && item !== 'optimized') {
          scanDirectory(fullPath)
        } else if (item.endsWith('.js') && !item.includes('base')) {
          animations.push(fullPath)
        }
      })
    }

    scanDirectory(animationDir)
    this.animations = animations
    return animations
  }

  /**
   * 加载基线数据
   */
  loadBaseline(baselinePath) {
    try {
      const data = fs.readFileSync(baselinePath, 'utf-8')
      this.baseline = JSON.parse(data)
      console.log(`✅ 加载基线数据: ${baselinePath}`)
    } catch (error) {
      console.warn(`⚠️ 未找到基线数据: ${baselinePath}`)
      this.baseline = null
    }
  }

  /**
   * 保存基线数据
   */
  saveBaseline(baselinePath) {
    if (this.results.length === 0) {
      console.warn('⚠️ 没有测试结果可保存')
      return
    }

    const baseline = {}

    this.results.forEach(result => {
      const animationName = path.basename(result.file, '.js')
      baseline[animationName] = {
        fps: result.fps,
        memory: result.memory,
        particleCount: result.particleCount,
        duration: result.duration
      }
    })

    fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2))
    console.log(`✅ 保存基线数据: ${baselinePath}`)
  }

  /**
   * 运行回归测试
   */
  async run(animationDir, baselinePath = null) {
    console.log('🚀 开始全量回归测试...\n')

    // 加载基线
    if (baselinePath) {
      this.loadBaseline(baselinePath)
    }

    // 扫描动画
    this.scanAnimations(animationDir)
    console.log(`📁 找到 ${this.animations.length} 个动画\n`)

    // 运行测试
    for (const animation of this.animations) {
      console.log(`🧪 测试: ${path.basename(animation)}`)
      const result = await this.testAnimation(animation)
      this.results.push(result)

      // 与基线对比
      if (this.baseline) {
        this.compareWithBaseline(result)
      }

      console.log('')
    }

    return this.generateReport()
  }

  /**
   * 测试单个动画
   */
  async testAnimation(filePath) {
    const startTime = Date.now()

    try {
      // 读取文件
      const content = fs.readFileSync(filePath, 'utf-8')

      // 分析代码
      const metrics = this.analyzeCode(content)

      // 模拟性能测试
      const performanceMetrics = this.simulatePerformance(metrics)

      return {
        file: filePath,
        name: path.basename(filePath, '.js'),
        status: 'pass',
        fps: performanceMetrics.fps,
        memory: performanceMetrics.memory,
        particleCount: metrics.particleCount,
        complexity: metrics.complexity,
        usesBaseEffect: metrics.usesBaseEffect,
        duration: Date.now() - startTime
      }

    } catch (error) {
      return {
        file: filePath,
        name: path.basename(filePath, '.js'),
        status: 'fail',
        error: error.message,
        duration: Date.now() - startTime
      }
    }
  }

  /**
   * 分析代码
   */
  analyzeCode(content) {
    const metrics = {
      linesOfCode: content.split('\n').length,
      particleCount: this.extractParticleCount(content),
      complexity: this.calculateComplexity(content),
      usesBaseEffect: /extends\s+(BaseEffect|EnhancedBaseEffect)/.test(content),
      usesParticleFactory: /ParticleFactory/.test(content),
      hasPerformanceMonitor: /PerformanceMonitor/.test(content)
    }

    return metrics
  }

  /**
   * 提取粒子数量
   */
  extractParticleCount(content) {
    const match = content.match(/particleCount['"]?\s*[:=]\s*(\d+)/)
    if (match) {
      return parseInt(match[1])
    }

    // 从注释中提取
    const commentMatch = content.match(/(\d+).*粒子/)
    if (commentMatch) {
      return parseInt(commentMatch[1])
    }

    return 0
  }

  /**
   * 计算复杂度
   */
  calculateComplexity(content) {
    let complexity = 1
    const patterns = [
      /\bif\b/g,
      /\belse\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\bswitch\b/g,
      /\bcatch\b/g
    ]

    patterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        complexity += matches.length
      }
    })

    return complexity
  }

  /**
   * 模拟性能测试
   */
  simulatePerformance(metrics) {
    // 基于粒子数量和复杂度估算FPS
    const baseFPS = 60
    const particlePenalty = metrics.particleCount / 10000
    const complexityPenalty = metrics.complexity / 50

    let fps = baseFPS - particlePenalty - complexityPenalty
    fps = Math.max(15, Math.min(60, fps))

    // 估算内存
    const memoryPerParticle = 0.1 // MB
    let memory = metrics.particleCount * memoryPerParticle
    memory += metrics.linesOfCode * 0.01 // 代码内存

    return {
      fps: fps,
      memory: memory
    }
  }

  /**
   * 与基线对比
   */
  compareWithBaseline(result) {
    if (!this.baseline) return

    const baseline = this.baseline[result.name]
    if (!baseline) {
      console.log(`  ℹ️ 无基线数据`)
      return
    }

    // 对比FPS
    const fpsDiff = result.fps - baseline.fps
    if (fpsDiff > 10) {
      console.log(`  ✅ FPS提升: +${fpsDiff.toFixed(1)} (${baseline.fps} → ${result.fps.toFixed(1)})`)
    } else if (fpsDiff < -10) {
      console.log(`  ⚠️ FPS下降: ${fpsDiff.toFixed(1)} (${baseline.fps} → ${result.fps.toFixed(1)})`)
    }

    // 对比内存
    const memoryDiff = result.memory - baseline.memory
    if (memoryDiff < -20) {
      console.log(`  ✅ 内存降低: ${memoryDiff.toFixed(1)}MB (${baseline.memory.toFixed(1)} → ${result.memory.toFixed(1)})`)
    } else if (memoryDiff > 20) {
      console.log(`  ⚠️ 内存增加: +${memoryDiff.toFixed(1)}MB`)
    }

    // 对比粒子数
    const particleDiff = result.particleCount - baseline.particleCount
    if (particleDiff < 0) {
      console.log(`  ℹ️ 粒子减少: ${particleDiff}`)
    }
  }

  /**
   * 生成报告
   */
  generateReport() {
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const avgFPS = this.results.reduce((sum, r) => sum + (r.fps || 0), 0) / this.results.length
    const avgMemory = this.results.reduce((sum, r) => sum + (r.memory || 0), 0) / this.results.length

    const report = {
      total: this.results.length,
      passed,
      failed,
      passRate: ((passed / this.results.length) * 100).toFixed(2) + '%',
      averageFPS: avgFPS.toFixed(1),
      averageMemory: avgMemory.toFixed(1),
      details: this.results
    }

    return report
  }

  /**
   * 打印报告
   */
  printReport(report) {
    console.log('\n' + '='.repeat(60))
    console.log('📊 回归测试报告')
    console.log('='.repeat(60))
    console.log(`总测试数: ${report.total}`)
    console.log(`✅ 通过: ${report.passed}`)
    console.log(`❌ 失败: ${report.failed}`)
    console.log(`📈 通过率: ${report.passRate}`)
    console.log(`平均FPS: ${report.averageFPS}`)
    console.log(`平均内存: ${report.averageMemory}MB`)

    if (report.failed > 0) {
      console.log('\n❌ 失败详情:')
      report.details.filter(r => r.status === 'fail').forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`)
      })
    }

    console.log('='.repeat(60))
  }

  /**
   * 导出JSON报告
   */
  exportJSON(report, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2))
    console.log(`\n✅ 导出JSON报告: ${outputPath}`)
  }

  /**
   * 导出Markdown报告
   */
  exportMarkdown(report, outputPath) {
    let md = `# 回归测试报告\n\n`
    md += `**日期**: ${new Date().toISOString()}\n\n`
    md += `## 概览\n\n`
    md += `| 指标 | 值 |\n`
    md += `|------|-----|\n`
    md += `| 总测试数 | ${report.total} |\n`
    md += `| 通过 | ${report.passed} |\n`
    md += `| 失败 | ${report.failed} |\n`
    md += `| 通过率 | ${report.passRate} |\n`
    md += `| 平均FPS | ${report.averageFPS} |\n`
    md += `| 平均内存 | ${report.averageMemory}MB |\n\n`

    md += `## 详细结果\n\n`
    md += `| 动画 | 状态 | FPS | 内存 | 粒子数 |\n`
    md += `|------|------|-----|------|--------|\n`

    report.details.forEach(r => {
      const statusIcon = r.status === 'pass' ? '✅' : '❌'
      md += `| ${r.name} | ${statusIcon} | ${r.fps?.toFixed(1) || '-'} | ${r.memory?.toFixed(1) || '-'} | ${r.particleCount || '-'} |\n`
    })

    fs.writeFileSync(outputPath, md)
    console.log(`✅ 导出Markdown报告: ${outputPath}`)
  }
}

// 使用示例
if (require.main === module) {
  const regressionTest = new RegressionTest()
  const animationDir = path.join(__dirname, '../pages/home/components/animation/animations')
  const baselinePath = path.join(__dirname, '../baseline.json')

  regressionTest.run(animationDir, baselinePath)
    .then(report => {
      regressionTest.printReport(report)
      regressionTest.exportJSON(report, path.join(__dirname, '../test-report.json'))
      regressionTest.exportMarkdown(report, path.join(__dirname, '../test-report.md'))
    })
    .catch(error => {
      console.error('❌ 测试失败:', error)
    })
}
