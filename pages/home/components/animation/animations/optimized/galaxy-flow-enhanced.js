/**
 * 星河涌动 - 增强版（使用EnhancedBaseEffect）
 * 集成性能监控和自适应LOD系统
 */

import { EnhancedBaseEffect } from '../base/EnhancedBaseEffect.js'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import * as THREE from 'three'
import { gsap } from 'gsap'

export class GalaxyFlowEnhanced extends EnhancedBaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)
    this.particleSystems = []
  }

  play() {
    // 初始化相机
    this.setupCamera()

    // 创建粒子系统（使用LOD调整后的数量）
    this.createParticleSystems()

    // 开始动画
    this.startAnimation()
  }

  setupCamera() {
    this.camera.position.set(0, 100, 0)
    this.camera.fov = 150
    this.camera.updateProjectionMatrix()
    this.camera.lookAt(0, 0, 0)

    gsap.to(this.camera.position, {
      x: 35,
      y: 25,
      z: 50,
      duration: 4,
      ease: 'power2.inOut'
    })

    gsap.to(this.camera, {
      fov: 75,
      duration: 4,
      onUpdate: () => this.camera.updateProjectionMatrix()
    })
  }

  createParticleSystems() {
    // 使用LOD调整后的粒子数量
    const nebulaCount = this.getAdjustedParticleCount(15000)
    const stellarCount = this.getAdjustedParticleCount(8000)

    // 使用ParticleFactory创建
    const nebula = ParticleFactory.create({
      count: nebulaCount,
      shape: 'spiral',
      colorMode: 'gradient',
      color1: 0xff4500,
      color2: 0x4b0082,
      size: 0.25
    })

    this.scene.add(nebula.particleSystem)
    this.particleSystems.push(nebula)

    // 更多粒子系统...
  }

  startAnimation() {
    const startTime = Date.now()

    const animate = () => {
      if (!this.isActive) return

      const time = (Date.now() - startTime) * 0.001

      // 更新所有粒子系统
      this.updateParticles(time)

      // 更新性能监控
      const totalParticles = this.particleSystems.reduce((sum, p) => sum + p.geometry.attributes.position.count, 0)
      this.updatePerformance(totalParticles)

      requestAnimationFrame(animate)
    }

    animate()
  }

  updateParticles(time) {
    // 根据LOD调整更新频率
    const updateInterval = this.lodLevel === 'low' ? 3 : 1

    this.particleSystems.forEach(system => {
      const positions = system.geometry.attributes.position.array

      for (let i = 0; i < positions.length; i += 3 * updateInterval) {
        // 简单的螺旋运动
        const angle = i * 0.01 + time * 0.5
        const radius = 20 + Math.sin(angle) * 5

        positions[i] = Math.cos(angle) * radius
        positions[i + 1] = Math.sin(time + i * 0.01) * 2
        positions[i + 2] = Math.sin(angle) * radius
      }

      system.geometry.attributes.position.needsUpdate = true
      system.particleSystem.rotation.y += 0.001
    })
  }

  onLODChange(level, multiplier) {
    // LOD变化时重新创建粒子系统
    console.log(`LOD变化: ${level} (${multiplier})`)

    // 清理旧系统
    this.particleSystems.forEach(p => p.dispose())
    this.particleSystems = []

    // 使用新数量创建
    this.createParticleSystems()
  }

  cleanup() {
    this.particleSystems.forEach(p => {
      this.scene.remove(p.particleSystem)
      p.dispose()
    })
    this.particleSystems = []
    super.cleanup()
  }
}
