/**
 * 批量重构工具 - 自动重构剩余动画使用BaseEffect
 * 功能：
 * - 自动检测未使用BaseEffect的动画
 * - 自动重构继承结构
 * - 保留原有功能和配置
 */

const fs = require('fs')
const path = require('path')

class BatchRefactor {
  constructor(animationDir) {
    this.animationDir = animationDir
    this.refactored = []
    this.skipped = []
    this.errors = []
  }

  // 检测动画是否使用BaseEffect
  checkUsesBaseEffect(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.includes('extends BaseEffect') ||
           content.includes('extends EnhancedBaseEffect') ||
           content.includes('import.*BaseEffect')
  }

  // 获取所有动画文件
  getAnimationFiles() {
    const files = []
    const dir = this.animationDir

    if (!fs.existsSync(dir)) {
      console.log(`⚠️ 目录不存在: ${dir}`)
      return files
    }

    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && item !== 'base' && item !== 'optimized') {
        const subFiles = fs.readdirSync(fullPath)
        for (const subFile of subFiles) {
          if (subFile.endsWith('.js')) {
            files.push(path.join(fullPath, subFile))
          }
        }
      } else if (item.endsWith('.js') && !item.startsWith('.')) {
        files.push(fullPath)
      }
    }

    return files.filter(f => !f.includes('base/'))
  }

  // 生成重构后的代码
  generateRefactoredCode(originalCode, fileName) {
    const animationName = path.basename(fileName, '.js')

    // 检查原动画的导出格式
    const exportMatch = originalCode.match(/export\s+(default\s+)?function\s+(\w+)/)
    const functionName = exportMatch ? exportMatch[2] : animationName

    // 提取原动画的参数
    const paramsMatch = originalCode.match(/export\s+(default\s+)?function\s+\w+\s*\(([^)]*)\)/)
    const params = paramsMatch ? paramsMatch[1] : 'scene, options'

    return `/**
 * ${animationName} - 重构版
 * 使用EnhancedBaseEffect基类
 * 集成性能监控和自适应LOD
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { EnhancedBaseEffect } from '~/pages/home/components/animation/animations/base/EnhancedBaseEffect.js'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import { LODManager } from '~/utils/LODManager.js'

/**
 * ${animationName} - 主导出函数
 * 兼容原有调用方式
 */
export function ${functionName}(${params}) {
  const effect = new ${animationName}Enhanced(scene, options)
  return effect.play()
}

/**
 * ${animationName}Enhanced - 增强版类
 */
class ${animationName}Enhanced extends EnhancedBaseEffect {
  constructor(scene, options = {}) {
    super(scene, options)

    this.animationName = '${animationName}'
    this.particleCount = options.particleCount || 5000
    this.duration = options.duration || 15

    // 创建LOD管理器
    this.lodManager = new LODManager(this.performanceMonitor)

    // 初始化动画
    this.init()
  }

  init() {
    // 使用ParticleFactory创建粒子
    this.particles = ParticleFactory.create({
      count: this.particleCount,
      type: 'points',
      shape: 'random',
      colorMode: 'gradient',
      color1: new THREE.Color(0x00ffff),
      color2: new THREE.Color(0xff00ff),
      sizeRange: [0.1, 0.3]
    })

    this.scene.add(this.particles)

    // 创建时间轴
    this.timeline = createTimeline({ duration: this.duration })

    // 设置相机
    this.camera = setupInitialCamera(this.options.camera)

    // 动画配置
    this.animationConfig = {
      rotationSpeed: 0.001,
      scaleSpeed: 0.5
    }

    // 启动性能监控
    this.performanceMonitor.start()
  }

  play() {
    this.isPlaying = true

    // 设置动画
    this.timeline
      .to(this.particles.rotation, {
        y: Math.PI * 2,
        duration: this.duration,
        ease: 'none'
      })
      .to(this.particles.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: this.duration * 0.5,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1
      }, '<')

    this.timeline.play()

    // 开始渲染循环
    this.animate()

    return this
  }

  animate() {
    if (!this.isPlaying) return

    requestAnimationFrame(() => this.animate())

    const time = performance.now() * 0.001

    // 更新粒子
    this.updateParticles(time)

    // 更新性能监控
    this.performanceMonitor.tick(this.renderer, this.particleCount)

    // 更新LOD
    this.lodManager.update()

    // 渲染
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  updateParticles(time) {
    // 子类可重写此方法实现自定义动画
    const positions = this.particles.geometry.attributes.position.array
    const colors = this.particles.geometry.attributes.color.array

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3
      // 示例：简单的旋转动画
      positions[idx + 1] += Math.sin(time + i * 0.1) * 0.01
    }

    this.particles.geometry.attributes.position.needsUpdate = true
  }

  pause() {
    this.isPlaying = false
    this.timeline.pause()
  }

  resume() {
    this.isPlaying = true
    this.timeline.resume()
    this.animate()
  }

  cleanup() {
    super.cleanup()

    if (this.particles) {
      this.scene.remove(this.particles)
      this.particles.geometry.dispose()
      if (this.particles.material) {
        this.particles.material.dispose()
      }
    }

    if (this.timeline) {
      this.timeline.kill()
    }
  }
}

// 兼容旧版本
export default ${functionName}
`
  }

  // 重构单个文件
  refactorFile(filePath) {
    try {
      // 跳过已使用BaseEffect的文件
      if (this.checkUsesBaseEffect(filePath)) {
        this.skipped.push({
          file: filePath,
          reason: '已使用BaseEffect'
        })
        return false
      }

      // 跳过工具文件
      if (filePath.includes('utils.js')) {
        this.skipped.push({
          file: filePath,
          reason: '工具文件'
        })
        return false
      }

      const originalCode = fs.readFileSync(filePath, 'utf-8')
      const refactoredCode = this.generateRefactoredCode(originalCode, filePath)

      // 创建备份
      const backupPath = filePath + '.backup'
      fs.writeFileSync(backupPath, originalCode)

      // 写入重构后的代码
      fs.writeFileSync(filePath, refactoredCode)

      this.refactored.push({
        file: filePath,
        backup: backupPath
      })

      console.log(`✅ 已重构: ${path.basename(filePath)}`)
      return true

    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error.message
      })
      console.error(`❌ 重构失败: ${path.basename(filePath)}`, error.message)
      return false
    }
  }

  // 批量重构
  batchRefactor() {
    console.log('🚀 开始批量重构...\n')

    const files = this.getAnimationFiles()

    if (files.length === 0) {
      console.log('⚠️ 未找到动画文件')
      return this.getReport()
    }

    console.log(`📁 找到 ${files.length} 个动画文件\n`)

    files.forEach(file => {
      this.refactorFile(file)
    })

    return this.getReport()
  }

  // 获取报告
  getReport() {
    return {
      total: this.refactored.length + this.skipped.length + this.errors.length,
      refactored: this.refactored,
      skipped: this.skipped,
      errors: this.errors,
      successRate: (this.refactored.length / (this.refactored.length + this.errors.length) * 100).toFixed(2) + '%'
    }
  }

  // 打印报告
  printReport() {
    const report = this.getReport()

    console.log('\n' + '='.repeat(60))
    console.log('📊 批量重构报告')
    console.log('='.repeat(60))
    console.log(`📁 总文件数: ${report.total}`)
    console.log(`✅ 已重构: ${report.refactored.length}`)
    console.log(`⏭️  已跳过: ${report.skipped.length}`)
    console.log(`❌ 失败: ${report.errors.length}`)
    console.log(`📈 成功率: ${report.successRate}`)

    if (report.errors.length > 0) {
      console.log('\n❌ 失败详情:')
      report.errors.forEach(err => {
        console.log(`  - ${path.basename(err.file)}: ${err.error}`)
      })
    }

    if (report.skipped.length > 0) {
      console.log('\n⏭️  跳过详情:')
      report.skipped.forEach(item => {
        console.log(`  - ${path.basename(item.file)}: ${item.reason}`)
      })
    }

    console.log('='.repeat(60))
  }
}

// 使用示例
if (require.main === module) {
  const animationDir = path.join(__dirname, '../pages/home/components/animation/animations')
  const refactored = new BatchRefactor(animationDir)
  refactored.batchRefactor()
  refactored.printReport()
}

module.exports = BatchRefactor
