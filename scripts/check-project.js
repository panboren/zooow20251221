#!/usr/bin/env node

/**
 * ZOOOW 项目检查脚本
 * 检查项目中的常见问题和优化建议
 */

const fs = require('fs')
const path = require('path')

// 配置
const PROJECT_ROOT = path.resolve(__dirname, '..')
const ANIMATIONS_DIR = path.join(PROJECT_ROOT, 'pages/home/components/animation/animations')
const UTILS_DIR = path.join(PROJECT_ROOT, 'utils')

// 检查结果
const results = {
  errors: [],
  warnings: [],
  suggestions: []
}

// 颜色输出
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

/**
 * 检查动画文件是否有清理逻辑
 */
function checkCleanupLogic() {
  console.log('\n🔍 检查动画文件清理逻辑...')

  const animationFiles = fs.readdirSync(ANIMATIONS_DIR)
    .filter(file => file.endsWith('.js') && file !== 'index.js' && file !== 'utils.js')

  let filesWithoutCleanup = []

  animationFiles.forEach(file => {
    const filePath = path.join(ANIMATIONS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 检查是否有 cleanup 相关代码
    const hasCleanup = /cleanup|dispose|remove\(|clear\(|kill\(/i.test(content)

    if (!hasCleanup) {
      filesWithoutCleanup.push(file)
    }
  })

  if (filesWithoutCleanup.length > 0) {
    results.warnings.push({
      type: 'cleanup',
      message: `${filesWithoutCleanup.length} 个动画文件缺少清理逻辑`,
      files: filesWithoutCleanup
    })

    console.log(`${colors.yellow}⚠️  发现 ${filesWithoutCleanup.length} 个文件缺少清理逻辑${colors.reset}`)
    filesWithoutCleanup.forEach(file => {
      console.log(`   - ${file}`)
    })
  } else {
    console.log(`${colors.green}✅ 所有动画文件都有清理逻辑${colors.reset}`)
  }
}

/**
 * 检查是否有大量粒子的动画
 */
function checkParticleCount() {
  console.log('\n🔍 检查粒子数量...')

  const animationFiles = fs.readdirSync(ANIMATIONS_DIR)
    .filter(file => file.endsWith('.js') && file !== 'index.js' && file !== 'utils.js')

  let highParticleFiles = []

  animationFiles.forEach(file => {
    const filePath = path.join(ANIMATIONS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 检查粒子数量
    const particleMatch = content.match(/particle[s]?.*?(\d{3,})/i)
    if (particleMatch) {
      const count = parseInt(particleMatch[1])
      if (count > 5000) {
        highParticleFiles.push({
          file,
          count
        })
      }
    }
  })

  if (highParticleFiles.length > 0) {
    results.warnings.push({
      type: 'particles',
      message: `${highParticleFiles.length} 个动画文件粒子数量过多`,
      files: highParticleFiles
    })

    console.log(`${colors.yellow}⚠️  发现 ${highParticleFiles.length} 个文件粒子数量 > 5000${colors.reset}`)
    highParticleFiles.forEach(({ file, count }) => {
      console.log(`   - ${file}: ${count} 粒子`)
    })
  } else {
    console.log(`${colors.green}✅ 粒子数量在合理范围内${colors.reset}`)
  }
}

/**
 * 检查是否有重复的着色器代码
 */
function checkShaderDuplication() {
  console.log('\n🔍 检查着色器代码重复...')

  const animationFiles = fs.readdirSync(ANIMATIONS_DIR)
    .filter(file => file.endsWith('.js') && file !== 'index.js' && file !== 'utils.js')

  const vertexShaders = new Map()
  const fragmentShaders = new Map()

  animationFiles.forEach(file => {
    const filePath = path.join(ANIMATIONS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 提取 vertexShader
    const vertexMatch = content.match(/vertexShader:\s*`([\s\S]*?)`/)
    if (vertexMatch) {
      const shader = vertexMatch[1].trim()
      if (vertexShaders.has(shader)) {
        vertexShaders.get(shader).push(file)
      } else {
        vertexShaders.set(shader, [file])
      }
    }

    // 提取 fragmentShader
    const fragmentMatch = content.match(/fragmentShader:\s*`([\s\S]*?)`/)
    if (fragmentMatch) {
      const shader = fragmentMatch[1].trim()
      if (fragmentShaders.has(shader)) {
        fragmentShaders.get(shader).push(file)
      } else {
        fragmentShaders.set(shader, [file])
      }
    }
  })

  let duplicateVertex = 0
  let duplicateFragment = 0

  vertexShaders.forEach((files, shader) => {
    if (files.length > 1) {
      duplicateVertex++
      results.suggestions.push({
        type: 'shader',
        message: `Vertex Shader 在 ${files.length} 个文件中重复`,
        files
      })
    }
  })

  fragmentShaders.forEach((files, shader) => {
    if (files.length > 1) {
      duplicateFragment++
      results.suggestions.push({
        type: 'shader',
        message: `Fragment Shader 在 ${files.length} 个文件中重复`,
        files
      })
    }
  })

  if (duplicateVertex > 0 || duplicateFragment > 0) {
    console.log(`${colors.yellow}⚠️  发现 ${duplicateVertex} 个重复的 Vertex Shader, ${duplicateFragment} 个重复的 Fragment Shader${colors.reset}`)
  } else {
    console.log(`${colors.green}✅ 未发现重复的着色器代码${colors.reset}`)
  }
}

/**
 * 检查 TypeScript 覆盖率
 */
function checkTypeScriptCoverage() {
  console.log('\n🔍 检查 TypeScript 覆盖率...')

  const utilsFiles = fs.readdirSync(UTILS_DIR)
    .filter(file => file.endsWith('.js'))

  const typescriptFiles = utilsFiles.filter(file => file.endsWith('.ts') || file.endsWith('.d.ts'))
  const jsFiles = utilsFiles.filter(file => file.endsWith('.js') && !file.endsWith('.d.ts'))

  const totalFiles = utilsFiles.length
  const tsCount = typescriptFiles.length
  const jsCount = jsFiles.length
  const coverage = ((tsCount / totalFiles) * 100).toFixed(1)

  console.log(`   TypeScript 文件: ${tsCount}`)
  console.log(`   JavaScript 文件: ${jsCount}`)
  console.log(`   覆盖率: ${coverage}%`)

  if (tsCount < jsCount) {
    results.suggestions.push({
      type: 'typescript',
      message: `TypeScript 覆盖率仅为 ${coverage}%，建议迁移核心文件到 TypeScript`,
      stats: { ts: tsCount, js: jsCount, coverage }
    })
    console.log(`${colors.yellow}⚠️  TypeScript 覆盖率较低${colors.reset}`)
  } else {
    console.log(`${colors.green}✅ TypeScript 覆盖率良好${colors.reset}`)
  }
}

/**
 * 检查 WebGPU 文档
 */
function checkWebGPUDocs() {
  console.log('\n🔍 检查 WebGPU 文档...')

  const webgpuDocs = fs.readdirSync(PROJECT_ROOT)
    .filter(file => file.startsWith('WebGPU') && file.endsWith('.md'))

  if (webgpuDocs.length > 0) {
    results.warnings.push({
      type: 'webgpu',
      message: `发现 ${webgpuDocs.length} 个 WebGPU 文档，但项目未实现 WebGPU`,
      files: webgpuDocs
    })

    console.log(`${colors.yellow}⚠️  发现 ${webgpuDocs.length} 个 WebGPU 文档${colors.reset}`)
    webgpuDocs.forEach(doc => {
      console.log(`   - ${doc}`)
    })
    console.log(`   建议: 移动到 docs/archive/ 目录`)
  } else {
    console.log(`${colors.green}✅ 无误导性 WebGPU 文档${colors.reset}`)
  }
}

/**
 * 检查 LOD 系统是否启用
 */
function checkLODSystem() {
  console.log('\n🔍 检查 LOD 系统...')

  const homeVuePath = path.join(PROJECT_ROOT, 'pages/home/home.vue')
  if (fs.existsSync(homeVuePath)) {
    const content = fs.readFileSync(homeVuePath, 'utf-8')

    const hasLODImport = /LODManager|from.*LODManager/.test(content)
    const hasLODUsage = /lodManager|new LODManager/.test(content)

    if (!hasLODImport || !hasLODUsage) {
      results.warnings.push({
        type: 'lod',
        message: 'LOD 系统未启用'
      })
      console.log(`${colors.yellow}⚠️  LOD 系统未启用${colors.reset}`)
      console.log(`   建议: 在 home.vue 中导入并初始化 LODManager`)
    } else {
      console.log(`${colors.green}✅ LOD 系统已启用${colors.reset}`)
    }
  } else {
    console.log(`${colors.blue}ℹ️  home.vue 不存在，跳过检查${colors.reset}`)
  }
}

/**
 * 打印摘要
 */
function printSummary() {
  console.log('\n' + '='.repeat(60))
  console.log('📊 检查摘要')
  console.log('='.repeat(60))

  console.log(`\n${colors.red}❌ 错误: ${results.errors.length}${colors.reset}`)
  results.errors.forEach(error => {
    console.log(`   - ${error.message}`)
  })

  console.log(`\n${colors.yellow}⚠️  警告: ${results.warnings.length}${colors.reset}`)
  results.warnings.forEach(warning => {
    console.log(`   - ${warning.message}`)
  })

  console.log(`\n${colors.green}💡 建议: ${results.suggestions.length}${colors.reset}`)
  results.suggestions.forEach(suggestion => {
    console.log(`   - ${suggestion.message}`)
  })

  console.log('\n' + '='.repeat(60))
  console.log('📚 详细优化方案请查看: docs/OPTIMIZATION_PLAN.md')
  console.log('='.repeat(60) + '\n')
}

// 主函数
async function main() {
  console.log(`${colors.blue}
╔════════════════════════════════════════════════════════════╗
║                                                          ║
║          ZOOOW 项目检查工具 v1.0                         ║
║                                                          ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`)

  try {
    checkCleanupLogic()
    checkParticleCount()
    checkShaderDuplication()
    checkTypeScriptCoverage()
    checkWebGPUDocs()
    checkLODSystem()

    printSummary()
  } catch (error) {
    console.error(`${colors.red}❌ 检查过程出错:${colors.reset}`, error)
    process.exit(1)
  }
}

// 运行
main()
