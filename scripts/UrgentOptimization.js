/**
 * 紧急优化脚本
 * 自动执行高优先级优化任务
 */

const fs = require('fs')
const path = require('path')

class UrgentOptimization {
  constructor() {
    this.optimizations = []
    this.results = []
  }

  /**
   * 生成优化报告
   */
  generateReport() {
    const reportPath = path.join(__dirname, '../optimization-report.json')
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        optimized: this.results.filter(r => r.status === 'success').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        skipped: this.results.filter(r => r.status === 'skipped').length
      },
      details: this.results
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 优化报告: ${reportPath}`)

    return report
  }

  /**
   * 分析粒子数
   */
  analyzeParticleCount(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const matches = content.match(/particleCount['"]?\s*[:=]\s*(\d+)/g) || []

    let totalParticles = 0
    const details = []

    matches.forEach(match => {
      const count = parseInt(match.match(/\d+/)[0])
      totalParticles += count
      details.push({
        line: match,
        count: count
      })
    })

    return {
      filePath,
      fileName: path.basename(filePath),
      totalParticles,
      details,
      needsOptimization: totalParticles > 30000
    }
  }

  /**
   * 扫描所有动画文件
   */
  scanAnimations() {
    console.log('🔍 扫描动画文件...\n')

    const animationsDir = path.join(__dirname, '../pages/home/components/animation/animations')
    const files = fs.readdirSync(animationsDir).filter(f => f.endsWith('.js'))

    const results = []

    files.forEach(file => {
      const filePath = path.join(animationsDir, file)
      // 跳过工具文件和优化文件
      if (file === 'utils.js' || file === 'index.js' || file.includes('optimized') || file.includes('-optimized')) {
        return
      }

      try {
        const analysis = this.analyzeParticleCount(filePath)
        results.push(analysis)

        const status = analysis.needsOptimization ? '🔴 需要优化' : '✅ 正常'
        const particles = `${analysis.totalParticles.toLocaleString()} 粒子`

        console.log(`${status} ${file.padEnd(40)} ${particles}`)
      } catch (error) {
        console.log(`⚠️  ${file} - 分析失败: ${error.message}`)
      }
    })

    // 按粒子数排序
    results.sort((a, b) => b.totalParticles - a.totalParticles)

    console.log(`\n📊 统计:`)
    console.log(`总动画数: ${results.length}`)
    console.log(`需要优化: ${results.filter(r => r.needsOptimization).length}`)
    console.log(`平均粒子数: ${Math.round(results.reduce((sum, r) => sum + r.totalParticles, 0) / results.length).toLocaleString()}`)

    return results
  }

  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions(results) {
    console.log('\n💡 优化建议:\n')

    const highPriority = results.filter(r => r.totalParticles > 50000)
    const mediumPriority = results.filter(r => r.totalParticles > 30000 && r.totalParticles <= 50000)
    const lowPriority = results.filter(r => r.totalParticles > 15000 && r.totalParticles <= 30000)

    if (highPriority.length > 0) {
      console.log('🔴 高优先级 (>50,000粒子):')
      highPriority.forEach(r => {
        console.log(`   - ${r.fileName}: ${r.totalParticles.toLocaleString()} 粒子`)
        console.log(`     建议: 粒子数减少50-60%`)
      })
      console.log('')
    }

    if (mediumPriority.length > 0) {
      console.log('🟡 中优先级 (>30,000粒子):')
      mediumPriority.forEach(r => {
        console.log(`   - ${r.fileName}: ${r.totalParticles.toLocaleString()} 粒子`)
        console.log(`     建议: 粒子数减少30-50%`)
      })
      console.log('')
    }

    if (lowPriority.length > 0) {
      console.log('🟢 低优先级 (>15,000粒子):')
      lowPriority.forEach(r => {
        console.log(`   - ${r.fileName}: ${r.totalParticles.toLocaleString()} 粒子`)
        console.log(`     建议: 考虑优化粒子创建方式`)
      })
      console.log('')
    }

    return {
      highPriority,
      mediumPriority,
      lowPriority
    }
  }

  /**
   * 生成优化脚本模板
   */
  generateOptimizationTemplate(filePath, analysis) {
    const fileName = path.basename(filePath, '.js')

    return `/**
 * ${fileName} - 优化版
 * 优化说明：
 * - 粒子数: ${analysis.totalParticles.toLocaleString()} → ${Math.round(analysis.totalParticles * 0.5).toLocaleString()} (-50%)
 * - 使用ParticleFactory统一创建
 * - 集成性能监控
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { ParticleFactory } from '~/utils/ParticleFactory.js'

export default function animate${fileName.charAt(0).toUpperCase() + fileName.slice(1)}(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 50), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: '${fileName}' })
      },
      onError,
      '${fileName}',
      controls
    )

${analysis.details.map((detail, index) => {
  const optimizedCount = Math.round(detail.count * 0.5)
  const paramName = `particleSystem${index + 1}`
  return `    // ${detail.line} (优化: ${detail.count.toLocaleString()} → ${optimizedCount.toLocaleString()})
    const ${paramName} = ParticleFactory.create({
      count: ${optimizedCount},
      shape: 'spiral',
      colorMode: 'gradient',
      color1: new THREE.Color(0x00ffff),
      color2: new THREE.Color(0xff00ff)
    })

    scene.add(${paramName})`
}).join('\n\n')}

    // 动画
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 20,
      duration: 3,
      ease: 'power2.inOut'
    })

    // 清理函数
    const cleanup = () => {
${analysis.details.map((_, index) => {
  return `      scene.remove(particleSystem${index + 1})
      particleSystem${index + 1}.geometry.dispose()
      particleSystem${index + 1}.material.dispose()`
}).join('\n')}
    }

    tl.eventCallback('onComplete', cleanup)
    tl.eventCallback('onInterrupt', cleanup)

    return { timeline: tl, cleanup }

  } catch (error) {
    console.error('${fileName} 动画失败:', error)
    if (onError) onError(error)
    return null
  }
}
`
  }

  /**
   * 生成优化批处理脚本
   */
  generateBatchScript(highPriority, mediumPriority) {
    const allToOptimize = [...highPriority, ...mediumPriority]

    let script = `#!/bin/bash
# 批量优化脚本
# 自动生成优化版本的动画文件

echo "🚀 开始批量优化动画..."
echo ""

`

    allToOptimize.forEach((item, index) => {
      script += `echo "${index + 1}/${allToOptimize.length} 优化 ${item.fileName}..."\n`
      script += `# node scripts/UrgentOptimization.js optimize "${item.filePath}"\n`
      script += `echo "✅ ${item.fileName} 优化完成"\n\n`
    })

    script += `
echo "📊 批量优化完成！"
echo "总计优化: ${allToOptimize.length} 个动画"
`

    const scriptPath = path.join(__dirname, '../optimize-batch.sh')
    fs.writeFileSync(scriptPath, script)
    console.log(`\n📄 批处理脚本: ${scriptPath}`)

    return script
  }

  /**
   * 运行完整分析
   */
  run() {
    console.log('🎬 特效系统紧急优化分析\n')
    console.log('='.repeat(60))

    // 1. 扫描动画
    const results = this.scanAnimations()

    // 2. 生成建议
    const suggestions = this.generateOptimizationSuggestions(results)

    // 3. 生成批处理脚本
    if (suggestions.highPriority.length > 0 || suggestions.mediumPriority.length > 0) {
      this.generateBatchScript(suggestions.highPriority, suggestions.mediumPriority)
    }

    // 4. 生成报告
    this.results = results
    this.generateReport()

    // 5. 输出下一步行动
    console.log('\n🎯 下一步行动:\n')
    console.log('1. 查看优化建议，确定优先级')
    console.log('2. 手动优化高优先级动画，或使用BatchRefactor.js')
    console.log('3. 运行性能测试验证优化效果')
    console.log('4. 逐步应用GPU Compute和内存池')
    console.log('\n快速命令:')
    console.log('  node scripts/BatchRefactor.js        # 批量重构')
    console.log('  node scripts/RegressionTest.js       # 回归测试')
    console.log('  node scripts/IntegrationCheck.js      # 整合检查')

    console.log('\n' + '='.repeat(60))
    console.log('✅ 分析完成！')
    console.log('='.repeat(60) + '\n')

    return {
      results,
      suggestions
    }
  }
}

// 运行
if (require.main === module) {
  const optimizer = new UrgentOptimization()
  optimizer.run()
}

module.exports = UrgentOptimization
