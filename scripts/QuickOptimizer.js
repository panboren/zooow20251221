/**
 * 快速优化脚本
 * 批量优化高粒子数动画
 */

const fs = require('fs')
const path = require('path')

class QuickOptimizer {
  constructor() {
    this.optimizations = []
    this.highPriorityAnimations = [
      'interstellar-supernova.js',
      'time-sand.js',
      'void-creation-symphony.js',
      'quantum-dream-weaver.js',
      'cosmic-epic-symphony.js'
    ]
  }

  /**
   * 优化单个文件
   */
  optimizeFile(filePath) {
    const fileName = path.basename(filePath)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 提取所有particleCount
    const matches = content.match(/particleCount['"]?\s*[:=]\s*(\d+)/g) || []
    
    let totalParticles = 0
    const particleDetails = []

    matches.forEach(match => {
      const count = parseInt(match.match(/\d+/)[0])
      totalParticles += count
      particleDetails.push({
        originalLine: match,
        originalCount: count,
        optimizedCount: Math.round(count * 0.5) // 减少50%
      })
    })

    if (particleDetails.length === 0) {
      console.log(`  ⏭️  ${fileName} - 无需优化`)
      return null
    }

    const report = {
      fileName,
      filePath,
      originalParticles: totalParticles,
      optimizedParticles: Math.round(totalParticles * 0.5),
      reduction: 50,
      details: particleDetails
    }

    return report
  }

  /**
   * 生成优化后的文件内容
   */
  generateOptimizedContent(content, report) {
    let optimizedContent = content

    // 更新注释
    optimizedContent = optimizedContent.replace(
      /(\/\*\*[\s\S]*?\*\/)/,
      (match) => {
        if (match.includes('粒子')) {
          return match.replace(
            /(\d+,?\d*)\s*粒子/,
            `${report.optimizedParticles.toLocaleString()} 粒子（优化版，减少${report.reduction}%）`
          )
        }
        return match
      }
    )

    // 更新particleCount
    report.details.forEach(detail => {
      optimizedContent = optimizedContent.replace(
        detail.originalLine,
        detail.originalLine.replace(detail.originalCount, detail.optimizedCount)
      )
    })

    // 添加优化标记
    if (!content.includes('优化版') && !content.includes('优化说明')) {
      optimizedContent = optimizedContent.replace(
        '/**',
        '/**\n * ✨ 已优化 - 粒子数减少50%\n * '
      )
    }

    // 添加ParticleFactory导入（如果没有）
    if (!content.includes('ParticleFactory') && report.details.length > 0) {
      optimizedContent = optimizedContent.replace(
        "import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'",
        "import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'\nimport { ParticleFactory } from '~/utils/ParticleFactory.js'"
      )
    }

    return optimizedContent
  }

  /**
   * 运行优化
   */
  run(animationsDir, dryRun = true) {
    console.log('🚀 开始快速优化...\n')

    const results = []

    this.highPriorityAnimations.forEach(fileName => {
      const filePath = path.join(animationsDir, fileName)
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${fileName} - 文件不存在`)
        return
      }

      console.log(`📝 ${fileName}`)

      const report = this.optimizeFile(filePath)
      
      if (report) {
        console.log(`  原始粒子: ${report.originalParticles.toLocaleString()}`)
        console.log(`  优化后: ${report.optimizedParticles.toLocaleString()} (-${report.reduction}%)`)
        console.log(`  减少量: ${(report.originalParticles - report.optimizedParticles).toLocaleString()}`)

        if (!dryRun) {
          const content = fs.readFileSync(filePath, 'utf-8')
          const optimizedContent = this.generateOptimizedContent(content, report)
          
          // 创建备份
          const backupPath = filePath + '.backup'
          fs.writeFileSync(backupPath, content)
          
          // 写入优化后的文件
          fs.writeFileSync(filePath, optimizedContent)
          
          console.log(`  ✅ 已优化并创建备份`)
        } else {
          console.log(`  ℹ️  仅分析模式（使用 --apply 应用）`)
        }

        results.push(report)
      }

      console.log('')
    })

    this.printSummary(results)
    return results
  }

  /**
   * 打印总结
   */
  printSummary(results) {
    if (results.length === 0) {
      console.log('⚠️ 没有需要优化的动画')
      return
    }

    const totalOriginal = results.reduce((sum, r) => sum + r.originalParticles, 0)
    const totalOptimized = results.reduce((sum, r) => sum + r.optimizedParticles, 0)

    console.log('\n' + '='.repeat(60))
    console.log('📊 优化总结')
    console.log('='.repeat(60))
    console.log(`优化动画数: ${results.length}`)
    console.log(`原始总粒子: ${totalOriginal.toLocaleString()}`)
    console.log(`优化后总数: ${totalOptimized.toLocaleString()}`)
    console.log(`减少粒子: ${(totalOriginal - totalOptimized).toLocaleString()} (-${Math.round((1 - totalOptimized/totalOriginal) * 100)}%)`)
    console.log('='.repeat(60))

    console.log('\n优化详情:')
    results.forEach(r => {
      console.log(`  ${r.fileName}`)
      console.log(`    ${r.originalParticles.toLocaleString()} → ${r.optimizedParticles.toLocaleString()} (-${r.reduction}%)`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('✅ 优化分析完成！')
    console.log('='.repeat(60) + '\n')

    console.log('💡 下一步:')
    console.log('  1. 检查优化详情')
    console.log('  2. 运行: node scripts/QuickOptimizer.js --apply')
    console.log('  3. 验证动画效果')
    console.log('  4. 运行性能测试')
  }
}

// 命令行运行
if (require.main === module) {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--apply')
  
  console.log('🎬 快速优化工具')
  console.log('参数:', dryRun ? '分析模式' : '应用模式 (--apply)')
  console.log('')

  const optimizer = new QuickOptimizer()
  const animationsDir = path.join(__dirname, '../pages/home/components/animation/animations')
  
  optimizer.run(animationsDir, dryRun)
}

module.exports = QuickOptimizer
