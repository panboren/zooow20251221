/**
 * 量子意识场 - 增强版
 * 使用 BaseEffect 基类和高性能粒子系统
 */

import { BaseEffect } from '../base/BaseEffect.js'

export class QuantumConsciousnessFieldEnhanced extends BaseEffect {
  play() {
    const tl = this.createTimeline()

    // 创建 8000 个粒子
    const particles = this.createParticleSystem(8000, {
      count: 8000,
      size: 8,
      colors: [0x00ffff, 0xff00ff, 0xffff00],
      depthWrite: false
    })

    // 初始化粒子位置（球体分布）
    const positions = particles.geometry.attributes.position.array
    for (let i = 0; i < particles.count; i++) {
      const idx = i * 3
      const radius = 50 * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta)
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[idx + 2] = radius * Math.cos(phi)
    }
    particles.geometry.attributes.position.needsUpdate = true

    // 动画变量
    let time = 0
    let rotationSpeed = 0.001

    // 启动动画循环
    this.startAnimationLoop(() => {
      time += 0.016

      // 粒子系统旋转
      particles.mesh.rotation.y += rotationSpeed
      particles.mesh.rotation.x += rotationSpeed * 0.5

      // 粒子波动效果
      particles.updatePositions((i, x, y, z) => {
        const idx = i * 3
        const originalRadius = Math.sqrt(x * x + y * y + z * z)

        // 添加波动
        const wave = Math.sin(time * 2 + i * 0.01) * 0.5

        // 计算新位置
        const scale = (originalRadius + wave) / originalRadius

        return {
          x: x * scale,
          y: y * scale,
          z: z * scale
        }
      })
    })

    // 颜色动画 - 从青色渐变到紫色
    const startColor = new THREE.Color(0x00ffff)
    const endColor = new THREE.Color(0xff00ff)

    this.animateColor(startColor, endColor, 6, (color) => {
      particles.setAllColors(color.r, color.g, color.b)
    })

    // 粒子大小动画
    this.animateParticleSize(particles, 12, 6)

    // 相机动画 - 从远处推进
    const initialCameraPosition = new THREE.Vector3(0, 0, 150)
    const targetCameraPosition = new THREE.Vector3(0, 0, 60)

    this.animateCamera(targetCameraPosition, 4)

    // 6秒后开始淡出
    this.animateParticleOpacity(particles, 0, 7)

    // 旋转速度变化
    tl.to({}, {
      duration: 13,
      onUpdate: () => {
        rotationSpeed = 0.001 * (1 - tl.progress() * 0.8)
      }
    })

    return tl
  }
}

/**
 * 导出函数供现有系统使用
 */
export default function animateQuantumConsciousnessFieldEnhanced(scene, camera, renderer, controls) {
  const effect = new QuantumConsciousnessFieldEnhanced(scene, camera, renderer, controls)
  return effect.play()
}
