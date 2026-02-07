/**
 * 生产环境部署工具
 * 自动化构建、测试和部署流程
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

export class Deploy {
  constructor(options = {}) {
    this.options = {
      buildDir: options.buildDir || path.join(__dirname, '../dist'),
      sourceDir: options.sourceDir || path.join(__dirname, '../zooow20251221'),
      skipTests: options.skipTests || false,
      skipLint: options.skipLint || false,
      skipBuild: options.skipBuild || false,
      ...options
    }

    this.report = {
      build: null,
      test: null,
      lint: null,
      deploy: null
    }
  }

  /**
   * 运行完整部署流程
   */
  async run() {
    console.log('🚀 开始生产环境部署...\n')

    try {
      // 1. 代码检查
      if (!this.options.skipLint) {
        await this.lint()
      } else {
        console.log('⏭️  跳过代码检查\n')
      }

      // 2. 构建项目
      if (!this.options.skipBuild) {
        await this.build()
      } else {
        console.log('⏭️  跳过构建\n')
      }

      // 3. 运行测试
      if (!this.options.skipTests) {
        await this.test()
      } else {
        console.log('⏭️  跳过测试\n')
      }

      // 4. 部署
      await this.deploy()

      // 5. 生成报告
      this.printSummary()

    } catch (error) {
      console.error('\n❌ 部署失败:', error.message)
      process.exit(1)
    }
  }

  /**
   * 代码检查
   */
  async lint() {
    console.log('🔍 运行代码检查...')

    try {
      // 检查TypeScript
      if (fs.existsSync('tsconfig.json')) {
        execSync('npx tsc --noEmit', { stdio: 'inherit' })
      }

      // 检查ESLint
      if (fs.existsSync('.eslintrc.js') || fs.existsSync('.eslintrc.json')) {
        execSync('npx eslint . --ext .js,.ts,.jsx,.tsx', { stdio: 'inherit' })
      }

      this.report.lint = 'pass'
      console.log('✅ 代码检查通过\n')

    } catch (error) {
      this.report.lint = 'fail'
      throw new Error('代码检查失败')
    }
  }

  /**
   * 构建项目
   */
  async build() {
    console.log('🔨 构建项目...')

    try {
      // 清理构建目录
      if (fs.existsSync(this.options.buildDir)) {
        fs.rmSync(this.options.buildDir, { recursive: true, force: true })
      }

      // 检查构建工具
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.options.sourceDir, 'package.json'), 'utf-8'))

      if (packageJson.scripts?.build) {
        execSync('npm run build', { cwd: this.options.sourceDir, stdio: 'inherit' })
      } else if (fs.existsSync('vite.config.js') || fs.existsSync('vite.config.ts')) {
        execSync('npx vite build', { cwd: this.options.sourceDir, stdio: 'inherit' })
      } else if (fs.existsSync('webpack.config.js')) {
        execSync('npx webpack', { cwd: this.options.sourceDir, stdio: 'inherit' })
      } else {
        throw new Error('未找到构建配置')
      }

      this.report.build = 'pass'
      console.log('✅ 构建完成\n')

    } catch (error) {
      this.report.build = 'fail'
      throw new Error('构建失败')
    }
  }

  /**
   * 运行测试
   */
  async test() {
    console.log('🧪 运行测试...')

    try {
      // 运行单元测试
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.options.sourceDir, 'package.json'), 'utf-8'))

      if (packageJson.scripts?.test) {
        execSync('npm test', { cwd: this.options.sourceDir, stdio: 'inherit' })
      }

      // 运行回归测试
      const RegressionTest = require('./RegressionTest.js').default || require('./RegressionTest.js')
      const regressionTest = new RegressionTest()

      const animationDir = path.join(this.options.sourceDir, 'pages/home/components/animation/animations')
      const report = await regressionTest.run(animationDir)

      this.report.test = report
      console.log('✅ 测试通过\n')

    } catch (error) {
      this.report.test = { status: 'fail', error: error.message }
      throw new Error('测试失败')
    }
  }

  /**
   * 部署
   */
  async deploy() {
    console.log('📦 准备部署...')

    try {
      // 1. 检查构建产物
      if (!fs.existsSync(this.options.buildDir)) {
        throw new Error('构建目录不存在')
      }

      // 2. 生成部署清单
      this.generateDeploymentManifest()

      // 3. 生成性能报告
      this.generatePerformanceReport()

      // 4. 压缩构建产物（可选）
      // await this.compressBuild()

      this.report.deploy = 'pass'
      console.log('✅ 部署准备完成\n')

    } catch (error) {
      this.report.deploy = 'fail'
      throw new Error('部署准备失败')
    }
  }

  /**
   * 生成部署清单
   */
  generateDeploymentManifest() {
    const manifest = {
      version: this.getVersion(),
      buildTime: new Date().toISOString(),
      files: [],
      size: 0
    }

    // 统计文件
    function countFiles(dir) {
      const items = fs.readdirSync(dir)

      items.forEach(item => {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          countFiles(fullPath)
        } else {
          const relativePath = path.relative(manifest.baseDir || fullPath, fullPath)
          manifest.files.push({
            path: relativePath,
            size: stat.size,
            hash: require('crypto').createHash('md5').update(fs.readFileSync(fullPath)).digest('hex')
          })
          manifest.size += stat.size
        }
      })
    }

    manifest.baseDir = this.options.buildDir
    countFiles(this.options.buildDir)

    // 保存清单
    const manifestPath = path.join(this.options.buildDir, 'manifest.json')
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

    console.log(`📄 部署清单: ${manifestPath}`)
    console.log(`   文件数: ${manifest.files.length}`)
    console.log(`   总大小: ${(manifest.size / 1024 / 1024).toFixed(2)}MB\n`)
  }

  /**
   * 生成性能报告
   */
  generatePerformanceReport() {
    if (!this.report.test || !this.report.test.details) {
      return
    }

    const report = {
      summary: {
        totalAnimations: this.report.test.total,
        averageFPS: this.report.test.averageFPS,
        averageMemory: this.report.test.averageMemory
      },
      topPerformers: [],
      needsOptimization: []
    }

    // 排序
    const sorted = [...this.report.test.details].sort((a, b) => (b.fps || 0) - (a.fps || 0))

    // Top 5
    report.topPerformers = sorted.slice(0, 5).map(r => ({
      name: r.name,
      fps: r.fps,
      particleCount: r.particleCount
    }))

    // Needs optimization
    report.needsOptimization = sorted.filter(r => r.fps && r.fps < 30).map(r => ({
      name: r.name,
      fps: r.fps,
      particleCount: r.particleCount
    }))

    const reportPath = path.join(this.options.buildDir, 'performance-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    console.log(`📊 性能报告: ${reportPath}`)
  }

  /**
   * 获取版本号
   */
  getVersion() {
    try {
      const packageJson = JSON.readFileSync(path.join(this.options.sourceDir, 'package.json'), 'utf-8')
      return packageJson.version || '1.0.0'
    } catch {
      return '1.0.0'
    }
  }

  /**
   * 打印总结
   */
  printSummary() {
    console.log('='.repeat(60))
    console.log('📦 部署总结')
    console.log('='.repeat(60))
    console.log(`代码检查: ${this.getReportIcon(this.report.lint)}`)
    console.log(`构建:      ${this.getReportIcon(this.report.build)}`)
    console.log(`测试:      ${this.getReportIcon(this.report.test)}`)
    console.log(`部署:      ${this.getReportIcon(this.report.deploy)}`)

    if (this.report.test && this.report.test.averageFPS) {
      console.log(`平均FPS:   ${this.report.test.averageFPS}`)
    }

    console.log('='.repeat(60))
    console.log('✅ 部署完成!')
    console.log('\n下一步:')
    console.log('1. 检查构建产物目录')
    console.log('2. 查看性能报告')
    console.log('3. 上传到服务器')
    console.log('4. 在生产环境验证')
    console.log()
  }

  /**
   * 获取报告图标
   */
  getReportIcon(status) {
    if (status === 'pass') return '✅ 通过'
    if (status === 'fail') return '❌ 失败'
    return '⏭️ 跳过'
  }

  /**
   * 导出报告
   */
  exportReport(outputPath) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.report,
      version: this.getVersion()
    }

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 部署报告: ${outputPath}`)
  }
}

// 使用示例
if (require.main === module) {
  const deploy = new Deploy({
    skipTests: false,
    skipLint: false
  })

  deploy.run()
    .then(() => {
      deploy.exportReport(path.join(__dirname, '../deploy-report.json'))
    })
    .catch(error => {
      console.error('部署失败:', error)
      process.exit(1)
    })
}

export default Deploy
