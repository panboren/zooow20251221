/**
 * 特效系统整合检查工具
 * 检查所有工具的完整性和一致性
 */

const fs = require('fs')
const path = require('path')

class IntegrationCheck {
  constructor() {
    this.issues = []
    this.warnings = []
    this.results = {
      utils: [],
      scripts: [],
      base: [],
      animations: [],
      docs: []
    }
  }

  /**
   * 运行完整检查
   */
  run() {
    console.log('🔍 开始特效系统整合检查...\n')

    this.checkUtils()
    this.checkScripts()
    this.checkBaseEffects()
    this.checkAnimations()
    this.checkDocs()
    this.checkImports()
    this.checkConsistency()

    this.printReport()
    this.saveReport()

    return {
      issues: this.issues,
      warnings: this.warnings,
      results: this.results
    }
  }

  /**
   * 检查工具文件
   */
  checkUtils() {
    console.log('📦 检查工具文件...')

    const utilsDir = path.join(__dirname, '../utils')
    const expectedUtils = [
      'ParticleFactory.js',
      'PerformanceMonitor.js',
      'LODManager.js',
      'CodeAnalyzer.js',
      'GPUCompute.js',
      'TextureAtlas.js',
      'MemoryPool.js',
      'exports.js',
      'index.js'
    ]

    expectedUtils.forEach(file => {
      const filePath = path.join(utilsDir, file)
      if (fs.existsSync(filePath)) {
        this.results.utils.push({ file: file, status: 'exists' })
        console.log(`  ✅ ${file}`)
      } else {
        this.issues.push({ type: 'utils', file: file, message: '文件不存在' })
        this.results.utils.push({ file: file, status: 'missing' })
        console.log(`  ❌ ${file} - 不存在`)
      }
    })

    // 检查exports.js的完整性
    const exportsPath = path.join(utilsDir, 'exports.js')
    if (fs.existsSync(exportsPath)) {
      const content = fs.readFileSync(exportsPath, 'utf-8')
      const expectedExports = [
        'ParticleFactory',
        'PerformanceMonitor',
        'LODManager',
        'CodeAnalyzer',
        'GPUCompute',
        'TextureAtlas',
        'MemoryPool'
      ]

      expectedExports.forEach(exp => {
        if (!content.includes(`export { ${exp}`) && !content.includes(`export { default as ${exp}`)) {
          this.warnings.push({
            type: 'exports',
            export: exp,
            message: `exports.js中未导出${exp}`
          })
        }
      })
    }

    console.log('')
  }

  /**
   * 检查脚本文件
   */
  checkScripts() {
    console.log('📜 检查脚本文件...')

    const scriptsDir = path.join(__dirname)
    const expectedScripts = [
      'AnimationTemplateGenerator.js',
      'AnimationTestSuite.js',
      'PerformanceBenchmark.js',
      'BatchRefactor.js',
      'RegressionTest.js',
      'Deploy.js',
      'IntegrationCheck.js'
    ]

    expectedScripts.forEach(file => {
      const filePath = path.join(scriptsDir, file)
      if (fs.existsSync(filePath)) {
        this.results.scripts.push({ file: file, status: 'exists' })
        console.log(`  ✅ ${file}`)
      } else {
        this.issues.push({ type: 'scripts', file: file, message: '文件不存在' })
        this.results.scripts.push({ file: file, status: 'missing' })
        console.log(`  ❌ ${file} - 不存在`)
      }
    })

    console.log('')
  }

  /**
   * 检查基类文件
   */
  checkBaseEffects() {
    console.log('🎯 检查基类文件...')

    const baseDir = path.join(__dirname, '../pages/home/components/animation/animations/base')
    const expectedBase = [
      'BaseEffect.js',
      'EnhancedBaseEffect.js'
    ]

    expectedBase.forEach(file => {
      const filePath = path.join(baseDir, file)
      if (fs.existsSync(filePath)) {
        this.results.base.push({ file: file, status: 'exists' })
        console.log(`  ✅ ${file}`)
      } else {
        this.issues.push({ type: 'base', file: file, message: '文件不存在' })
        this.results.base.push({ file: file, status: 'missing' })
        console.log(`  ❌ ${file} - 不存在`)
      }
    })

    // 检查EnhancedBaseEffect是否继承了BaseEffect
    const enhancedPath = path.join(baseDir, 'EnhancedBaseEffect.js')
    if (fs.existsSync(enhancedPath)) {
      const content = fs.readFileSync(enhancedPath, 'utf-8')
      if (!content.includes('extends BaseEffect')) {
        this.warnings.push({
          type: 'base',
          file: 'EnhancedBaseEffect.js',
          message: '未继承BaseEffect'
        })
      }
    }

    console.log('')
  }

  /**
   * 检查优化后的动画
   */
  checkAnimations() {
    console.log('🎬 检查优化后的动画...')

    const animationsDir = path.join(__dirname, '../pages/home/components/animation/animations')
    const optimizedAnimations = [
      'galaxy-flow.js',
      'wind-flower-snow-moon.js'
    ]

    optimizedAnimations.forEach(file => {
      const filePath = path.join(animationsDir, file)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')

        // 检查是否使用了优化标记
        const hasOptimizationComment = content.includes('优化版') || content.includes('优化说明')

        this.results.animations.push({
          file: file,
          status: 'exists',
          optimized: hasOptimizationComment
        })

        console.log(`  ✅ ${file} ${hasOptimizationComment ? '(已优化)' : '(未标记优化)'}`)
      } else {
        this.results.animations.push({ file: file, status: 'missing' })
        console.log(`  ⚠️  ${file} - 不存在`)
      }
    })

    console.log('')
  }

  /**
   * 检查文档
   */
  checkDocs() {
    console.log('📚 检查文档...')

    const rootDir = path.join(__dirname, '..')
    const expectedDocs = [
      '完整优化总结.md',
      '快速开始.md',
      'FILES_INDEX.md'
    ]

    expectedDocs.forEach(file => {
      const filePath = path.join(rootDir, file)
      if (fs.existsSync(filePath)) {
        this.results.docs.push({ file: file, status: 'exists' })
        console.log(`  ✅ ${file}`)
      } else {
        this.warnings.push({ type: 'docs', file: file, message: '文档不存在' })
        this.results.docs.push({ file: file, status: 'missing' })
        console.log(`  ⚠️  ${file} - 不存在`)
      }
    })

    // 检查docs目录
    const docsDir = path.join(rootDir, 'docs')
    if (fs.existsSync(docsDir)) {
      const docFiles = fs.readdirSync(docsDir)
      console.log(`  📁 docs/ 目录包含 ${docFiles.length} 个文件`)
    }

    console.log('')
  }

  /**
   * 检查导入一致性
   */
  checkImports() {
    console.log('🔗 检查导入一致性...')

    const utilsExportsPath = path.join(__dirname, '../utils/exports.js')
    if (!fs.existsSync(utilsExportsPath)) {
      this.issues.push({
        type: 'imports',
        message: 'utils/exports.js不存在'
      })
      return
    }

    const exportsContent = fs.readFileSync(utilsExportsPath, 'utf-8')

    // 检查是否导出了所有工具
    const utilsDir = path.join(__dirname, '../utils')
    const utilsFiles = fs.readdirSync(utilsDir).filter(f => f.endsWith('.js') && f !== 'exports.js')

    utilsFiles.forEach(file => {
      const utilName = file.replace('.js', '')
      if (!exportsContent.includes(`from './${file}`)) {
        this.warnings.push({
          type: 'imports',
          file: file,
          message: `exports.js中未导入${file}`
        })
      }
    })

    console.log('  ✅ 导入检查完成')
    console.log('')
  }

  /**
   * 检查一致性
   */
  checkConsistency() {
    console.log('⚖️  检查一致性...')

    // 检查TypeScript类型定义
    const typesPath = path.join(__dirname, '../types/animation.d.ts')
    if (!fs.existsSync(typesPath)) {
      this.warnings.push({
        type: 'types',
        message: 'types/animation.d.ts不存在'
      })
    } else {
      console.log('  ✅ 类型定义存在')
    }

    // 检查组件目录
    const componentsDir = path.join(__dirname, '../components')
    if (!fs.existsSync(componentsDir)) {
      this.warnings.push({
        type: 'components',
        message: 'components目录不存在'
      })
    } else {
      const panelPath = path.join(componentsDir, 'PerformancePanel.js')
      if (fs.existsSync(panelPath)) {
        console.log('  ✅ PerformancePanel存在')
      } else {
        this.warnings.push({
          type: 'components',
          message: 'PerformancePanel.js不存在'
        })
      }
    }

    console.log('')
  }

  /**
   * 打印报告
   */
  printReport() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 整合检查报告')
    console.log('='.repeat(60))
    console.log(`工具文件: ${this.results.utils.filter(r => r.status === 'exists').length}/${this.results.utils.length}`)
    console.log(`脚本文件: ${this.results.scripts.filter(r => r.status === 'exists').length}/${this.results.scripts.length}`)
    console.log(`基类文件: ${this.results.base.filter(r => r.status === 'exists').length}/${this.results.base.length}`)
    console.log(`优化动画: ${this.results.animations.filter(r => r.status === 'exists').length}/${this.results.animations.length}`)
    console.log(`文档文件: ${this.results.docs.filter(r => r.status === 'exists').length}/${this.results.docs.length}`)
    console.log(`问题: ${this.issues.length}`)
    console.log(`警告: ${this.warnings.length}`)

    if (this.issues.length > 0) {
      console.log('\n❌ 问题:')
      this.issues.forEach(issue => {
        console.log(`  - [${issue.type}] ${issue.file || ''}: ${issue.message}`)
      })
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  警告:')
      this.warnings.forEach(warning => {
        console.log(`  - [${warning.type}] ${warning.file || warning.export || ''}: ${warning.message}`)
      })
    }

    console.log('='.repeat(60))

    if (this.issues.length === 0) {
      console.log('✅ 所有检查通过！系统已完整整合。')
    } else {
      console.log(`⚠️  发现 ${this.issues.length} 个问题需要修复。`)
    }

    console.log('')
  }

  /**
   * 保存报告
   */
  saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        utils: this.results.utils,
        scripts: this.results.scripts,
        base: this.results.base,
        animations: this.results.animations,
        docs: this.results.docs
      },
      issues: this.issues,
      warnings: this.warnings
    }

    const reportPath = path.join(__dirname, '../integration-check-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`📄 报告已保存: ${reportPath}\n`)
  }
}

// 运行检查
if (require.main === module) {
  const checker = new IntegrationCheck()
  checker.run()
}

module.exports = IntegrationCheck
