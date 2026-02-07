/**
 * 批量应用优化脚本
 * 自动为动画添加ParticleFactory和PerformanceMonitor
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ANIMATIONS_DIR = path.join(__dirname, '../pages/home/components/animation/animations')

// 需要优化的动画文件
const TARGET_FILES = [
  'aurora-borealis.js',
  'butterfly-dance.js',
  'dolphin-jump.js',
  'firefly-night.js',
  'galaxy-spiral.js',
  'lotus-blooming.js',
  'meteor-shower.js',
  'mountain-mist.js',
  'ocean-waves.js',
  'sakura-falling.js',
  'star-field.js',
  'sunrise-glow.js',
  'tropical-fish.js',
  'waterfall.js',
  'wind-flower-snow-moon.js'
]

// 导入语句模板
const IMPORT_TEMPLATE = `import { ParticleFactory } from '~/utils/ParticleFactory.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'`

// 性能监控初始化
const PERF_MONITOR_INIT = `  // 创建性能监控器
  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()`

// 性能监控结束
const PERF_MONITOR_END = `        perfMonitor.stop()
        perfMonitor.logReport()`

/**
 * 检查文件是否已经有这些导入
 */
function hasImports(content) {
  return content.includes('ParticleFactory') || content.includes('PerformanceMonitor')
}

/**
 * 检查是否已经有性能监控
 */
function hasPerformanceMonitoring(content) {
  return content.includes('new PerformanceMonitor()')
}

/**
 * 优化单个文件
 */
function optimizeFile(filename) {
  const filepath = path.join(ANIMATIONS_DIR, filename)

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  文件不存在: ${filename}`)
    return
  }

  let content = fs.readFileSync(filepath, 'utf-8')
  const originalContent = content

  // 1. 添加导入语句（如果不存在）
  if (!hasImports(content)) {
    const importMatch = content.match(/import\s+\*\s+as\s+THREE\s+from\s+['"]three['"]/)
    if (importMatch) {
      const insertPos = importMatch.index + importMatch[0].length
      content = content.slice(0, insertPos) + '\n' + IMPORT_TEMPLATE + content.slice(insertPos)
      console.log(`  ✅ 添加导入语句`)
    }
  }

  // 2. 添加性能监控（如果不存在）
  if (!hasPerformanceMonitoring(content)) {
    // 在函数开始处添加初始化
    const functionMatch = content.match(/export default function\s+(\w+)\s*\([^)]*\)\s*\{/)
    if (functionMatch) {
      const afterFunctionStart = functionMatch.index + functionMatch[0].length
      const tryMatch = content.slice(afterFunctionStart).match(/\s*try\s*\{/)

      if (tryMatch) {
        const insertPos = afterFunctionStart + tryMatch.index + tryMatch[0].length
        content = content.slice(0, insertPos) + '\n' + PERF_MONITOR_INIT + '\n' + content.slice(insertPos)
        console.log(`  ✅ 添加性能监控初始化`)
      }
    }

    // 在onComplete回调中添加报告
    const onCompleteMatch = content.match(/if\s*\(\s*onComplete\s*\)\s*\{[^}]*onComplete\(([^)]+)\)[^}]*\}/)
    if (onCompleteMatch) {
      const insertPos = onCompleteMatch.index
      content = content.slice(0, insertPos) + PERF_MONITOR_END + '\n        ' + content.slice(insertPos)
      console.log(`  ✅ 添加性能监控报告`)
    }
  }

  // 3. 查找并减少高粒子数（可选）
  const highParticlePatterns = [
    { pattern: /particleCount:\s*(\d{5,})/g, message: '高粒子数' },
    { pattern: /PARTICLE_COUNT\s*=\s*(\d{5,})/g, message: '粒子常量' }
  ]

  highParticlePatterns.forEach(({ pattern, message }) => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const count = parseInt(match[1])
      if (count > 20000) {
        const newCount = Math.floor(count * 0.5)
        const oldStr = match[0]
        const newStr = oldStr.replace(count.toString(), newCount.toString())
        content = content.replace(oldStr, newStr)
        console.log(`  📉 ${message}: ${count} → ${newCount}`)
      }
    }
  })

  // 保存文件
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf-8')
    console.log(`✅ 已优化: ${filename}\n`)
  } else {
    console.log(`ℹ️  无需优化: ${filename}\n`)
  }
}

/**
 * 批量优化所有文件
 */
function batchOptimize() {
  console.log('🚀 开始批量优化动画文件...\n')
  console.log(`目标目录: ${ANIMATIONS_DIR}`)
  console.log(`待优化文件数: ${TARGET_FILES.length}\n`)

  let successCount = 0
  let skipCount = 0

  TARGET_FILES.forEach((filename, index) => {
    console.log(`[${index + 1}/${TARGET_FILES.length}] 处理: ${filename}`)
    const filepath = path.join(ANIMATIONS_DIR, filename)

    if (fs.existsSync(filepath)) {
      optimizeFile(filename)
      successCount++
    } else {
      console.log(`⚠️  文件不存在，跳过\n`)
      skipCount++
    }
  })

  console.log('\n' + '='.repeat(50))
  console.log(`📊 批量优化完成`)
  console.log(`  ✅ 成功: ${successCount} 个文件`)
  console.log(`  ⏭️  跳过: ${skipCount} 个文件`)
  console.log('='.repeat(50))
}

// 执行批量优化
batchOptimize()

export { optimizeFile, batchOptimize }
