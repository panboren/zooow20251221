/**
 * 快速代码分析 - 使用Node.js fs模块
 */

const fs = require('fs')
const path = require('path')

function analyzeDirectory(dirPath) {
  const results = {
    totalFiles: 0,
    usingBaseEffect: 0,
    hasCleanup: 0,
    totalParticles: 0,
    highComplexity: [],
    recommendations: []
  }

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        if (!item.includes('node_modules') && !item.startsWith('.')) {
          scanDirectory(fullPath)
        }
      } else if (item.endsWith('.js') && !item.includes('test')) {
        analyzeFile(fullPath)
      }
    }
  }

  function analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      const fileName = path.basename(filePath)

      results.totalFiles++

      // 检查BaseEffect
      if (/extends\s+BaseEffect|import.*BaseEffect/.test(content)) {
        results.usingBaseEffect++
      }

      // 检查cleanup
      if (/cleanup\s*\(|\.dispose\(\)/.test(content)) {
        results.hasCleanup++
      }

      // 提取粒子数量
      const particleMatch = content.match(/(?:count|particle).*[:=]\s*(\d{3,6})/i)
      if (particleMatch) {
        const count = parseInt(particleMatch[1])
        results.totalParticles += count

        if (count > 100000) {
          results.highComplexity.push({
            file: fileName,
            particles: count,
            issue: '粒子数量过多'
          })
        }
      }

      // 检查循环嵌套
      const loopMatches = content.match(/for\s*\(/g)
      if (loopMatches && loopMatches.length > 20) {
        results.highComplexity.push({
          file: fileName,
          loops: loopMatches.length,
          issue: '循环过多'
        })
      }
    } catch (error) {
      console.error(`分析失败: ${filePath}`, error.message)
    }
  }

  scanDirectory(dirPath)

  // 生成建议
  const noBaseEffect = results.totalFiles - results.usingBaseEffect
  if (noBaseEffect > 10) {
    results.recommendations.push(`${noBaseEffect}个文件未使用BaseEffect，建议重构`)
  }

  const noCleanup = results.totalFiles - results.hasCleanup
  if (noCleanup > 10) {
    results.recommendations.push(`${noCleanup}个文件缺少cleanup逻辑`)
  }

  if (results.totalParticles > 10000000) {
    results.recommendations.push('总粒子数超过1000万，建议使用LOD系统')
  }

  return results
}

const animationsDir = path.join(__dirname, 'pages/home/components/animation/animations')

console.log('🔍 快速代码分析...\n')

const results = analyzeDirectory(animationsDir)

console.log('📊 分析结果:')
console.log(`总文件数: ${results.totalFiles}`)
console.log(`使用BaseEffect: ${results.usingBaseEffect} (${((results.usingBaseEffect/results.totalFiles)*100).toFixed(1)}%)`)
console.log(`有cleanup: ${results.hasCleanup} (${((results.hasCleanup/results.totalFiles)*100).toFixed(1)}%)`)
console.log(`总粒子数: ${results.totalParticles.toLocaleString()}`)

console.log('\n⚠️  高复杂度文件:')
results.highComplexity.forEach(item => {
  console.log(`  - ${item.file}: ${item.particles || item.loops}${item.issue}`)
})

console.log('\n💡 建议:')
results.recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`)
})
