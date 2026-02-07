/**
 * 动画模板生成器 - 快速创建标准化的动画文件
 * 支持BaseEffect和EnhancedBaseEffect两种模板
 */

import * as fs from 'fs'
import * as path from 'path'

export class AnimationTemplateGenerator {
  constructor() {
    this.templates = {
      baseEffect: this.getBaseEffectTemplate(),
      enhancedBaseEffect: this.getEnhancedBaseEffectTemplate(),
      simple: this.getSimpleTemplate()
    }
  }

  /**
   * 生成BaseEffect模板
   */
  getBaseEffectTemplate() {
    return `/**
 * [动画名称] - [简短描述]
 *
 * 技术亮点：
 * - [特性1]
 * - [特性2]
 * - [特性3]
 *
 * 性能指标：
 * - 粒子数量: [数量]
 * - 预计FPS: [数值]
 * - 内存占用: [大小]
 */

import { BaseEffect } from '~/pages/home/components/animation/animations/base/BaseEffect.js'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import * as THREE from 'three'
import { gsap } from 'gsap'

export class [ClassName] extends BaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)

    this.config = {
      particleCount: 10000,
      animationDuration: 7000
    }

    this.particleSystems = []
  }

  play() {
    console.log(\`开始播放: \${this.constructor.name}\`)
    this.createParticleSystems()
    this.setupAnimations()
    this.startAnimationLoop()
  }

  createParticleSystems() {
    const particles = ParticleFactory.create({
      count: this.config.particleCount,
      shape: 'spiral',
      colorMode: 'gradient',
      color1: 0x00ffff,
      color2: 0xff00ff,
      size: 0.5
    })

    this.scene.add(particles.particleSystem)
    this.particleSystems.push(particles)
  }

  setupAnimations() {
    const tl = this.createTimeline(() => {
      console.log('动画完成')
      this.cleanup()
    })

    this.animateCamera({ x: 0, y: 20, z: 50 }, 7)
  }

  update() {
    const time = performance.now() * 0.001
    this.updateParticles(time)

    this.particleSystems.forEach(system => {
      system.particleSystem.rotation.y += 0.001
    })
  }

  updateParticles(time) {
    const positions = this.particleSystems[0].geometry.attributes.position.array

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i) * 0.01
      positions[i + 1] += Math.cos(time + i) * 0.01
    }

    this.particleSystems[0].geometry.attributes.position.needsUpdate = true
  }

  cleanup() {
    console.log(\`清理: \${this.constructor.name}\`)

    this.particleSystems.forEach(system => {
      this.scene.remove(system.particleSystem)
      system.dispose()
    })
    this.particleSystems = []

    super.cleanup()
  }
}

export default function animate[ClassName](props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    const effect = new [ClassName](scene, camera, renderer, controls)
    effect.play()

    if (onComplete) {
      setTimeout(() => onComplete({ type: '[animation-type]' }), 7000)
    }
  } catch (error) {
    console.error(\`动画播放失败: \${error.message}\`)
    if (onError) onError(error)
  }
}
`
  }

  /**
   * 生成EnhancedBaseEffect模板
   */
  getEnhancedBaseEffectTemplate() {
    return `/**
 * [动画名称] - [简短描述]（增强版）
 *
 * 技术亮点：
 * - [特性1]
 * - [特性2]
 * - 集成性能监控和自适应LOD
 *
 * 性能指标：
 * - 基础粒子数量: [数量]
 * - 自适应范围: 30%-150%
 * - 预计FPS: 45-60
 */

import { EnhancedBaseEffect } from '~/pages/home/components/animation/animations/base/EnhancedBaseEffect.js'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import * as THREE from 'three'
import { gsap } from 'gsap'

export class [ClassName] extends EnhancedBaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)

    this.config = {
      baseParticleCount: 10000,
      animationDuration: 7000
    }

    this.particleSystems = []
  }

  play() {
    console.log(\`开始播放: \${this.constructor.name}\`)
    this.setupCamera()
    this.createParticleSystems()
    this.setupAnimations()
    this.startAnimationLoop()
  }

  setupCamera() {
    this.camera.position.set(0, 50, 100)
    this.camera.lookAt(0, 0, 0)

    gsap.to(this.camera.position, {
      x: 0, y: 20, z: 50,
      duration: 3,
      ease: 'power2.inOut'
    })
  }

  createParticleSystems() {
    const particleCount = this.getAdjustedParticleCount(this.config.baseParticleCount)

    const particles = ParticleFactory.create({
      count: particleCount,
      shape: 'spiral',
      colorMode: 'gradient',
      color1: 0x00ffff,
      color2: 0xff00ff,
      size: 0.5
    })

    this.scene.add(particles.particleSystem)
    this.particleSystems.push(particles)

    console.log(\`粒子数量 (LOD \${this.lodLevel}): \${particleCount}\`)
  }

  setupAnimations() {
    gsap.to(this.particleSystems[0].material, {
      opacity: 1,
      duration: 2,
      ease: 'power2.out'
    })
  }

  update() {
    const time = performance.now() * 0.001
    this.updateParticles(time)

    this.particleSystems.forEach(system => {
      system.particleSystem.rotation.y += 0.001
    })

    const totalParticles = this.particleSystems.reduce(
      (sum, p) => sum + p.geometry.attributes.position.count, 0
    )
    this.updatePerformance(totalParticles)
  }

  updateParticles(time) {
    const updateInterval = this.lodLevel === 'low' ? 3 : 1

    this.particleSystems.forEach(system => {
      const positions = system.geometry.attributes.position.array

      for (let i = 0; i < positions.length; i += 3 * updateInterval) {
        const angle = i * 0.01 + time * 0.5
        const radius = 20 + Math.sin(angle) * 5

        positions[i] = Math.cos(angle) * radius
        positions[i + 1] += Math.sin(time + i * 0.01) * 0.01
        positions[i + 2] = Math.sin(angle) * radius
      }

      system.geometry.attributes.position.needsUpdate = true
    })
  }

  onLODChange(level, multiplier) {
    console.log(\`LOD变化: \${level} (\${multiplier})\`)
    this.cleanupParticleSystems()
    this.createParticleSystems()
  }

  cleanupParticleSystems() {
    this.particleSystems.forEach(system => {
      this.scene.remove(system.particleSystem)
      system.dispose()
    })
    this.particleSystems = []
  }

  cleanup() {
    console.log(\`清理: \${this.constructor.name}\`)
    this.cleanupParticleSystems()
    super.cleanup()
  }
}

export default function animate[ClassName](props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    const effect = new [ClassName](scene, camera, renderer, controls)
    effect.play()

    if (onComplete) {
      setTimeout(() => onComplete({ type: '[animation-type]' }), 7000)
    }
  } catch (error) {
    console.error(\`动画播放失败: \${error.message}\`)
    if (onError) onError(error)
  }
}
`
  }

  /**
   * 生成简单模板
   */
  getSimpleTemplate() {
    return `/**
 * [动画名称] - [简短描述]
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animate[AnimationName](props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 100), 75, controls)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: '[animation-type]' })
      },
      onError,
      '[动画名称]',
      controls
    )

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(10000 * 3)

    for (let i = 0; i < 10000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 0.5,
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    gsap.to(material, { opacity: 1, duration: 2 })

    const updateHandler = () => {
      const time = Date.now() * 0.001

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i * 0.01) * 0.01
      }

      geometry.attributes.position.needsUpdate = true
      points.rotation.y += 0.001
    }

    tl.call(() => {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }, null, 5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
`
  }

  /**
   * 生成动画文件
   */
  generate(options) {
    const {
      name = 'MyAnimation',
      className = 'MyAnimation',
      templateType = 'baseEffect',
      outputPath = './'
    } = options

    const template = this.templates[templateType]

    if (!template) {
      throw new Error(\`未知的模板类型: \${templateType}\`)
    }

    let content = template
      .replace(/\[ClassName\]/g, className)
      .replace(/\[AnimationName\]/g, name)
      .replace(/\[animation-name\]/g, name.toLowerCase().replace(/\s+/g, '-'))
      .replace(/\[animation-type\]/g, name.toLowerCase().replace(/\s+/g, '-'))

    const fileName = \`\${name.toLowerCase().replace(/\s+/g, '-')}.js\`
    const filePath = path.join(outputPath, fileName)

    fs.writeFileSync(filePath, content, 'utf-8')

    console.log(\`✅ 动画文件已生成: \${filePath}\`)

    return filePath
  }

  /**
   * 列出可用模板
   */
  listTemplates() {
    return [
      { name: 'baseEffect', description: 'BaseEffect模板 - 基础特效类' },
      { name: 'enhancedBaseEffect', description: 'EnhancedBaseEffect模板 - 带性能监控的增强类' },
      { name: 'simple', description: 'Simple模板 - 简单函数式动画' }
    ]
  }
}

// 命令行使用
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const generator = new AnimationTemplateGenerator()

  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.log('用法: node AnimationTemplateGenerator.js <name> [templateType]')
    console.log('模板类型: baseEffect, enhancedBaseEffect, simple')
    process.exit(0)
  }

  const name = args[0]
  const templateType = args[1] || 'baseEffect'

  try {
    generator.generate({
      name,
      className: name.replace(/\s+/g, ''),
      templateType,
      outputPath: './pages/home/components/animation/animations/'
    })
  } catch (error) {
    console.error('❌ 生成失败:', error.message)
    process.exit(1)
  }
}
