/**
 * 粒子系统特效
 * 创建和管理 Three.js 粒子系统
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建爆炸粒子系统
 * @param {Scene} scene - Three.js 场景对象
 * @param {Vector3} position - 爆炸中心位置
 * @param {Number} count - 粒子数量
 * @param {Object} colorConfig - 颜色配置 { h, s, l }
 * @returns {Points} 粒子对象
 */
export function createExplosionParticles(scene, position, count = 3000, colorConfig = { h: 0.05, s: 1, l: 0.5 }) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const velocities = []

  for (let i = 0; i < count; i++) {
    // 爆炸中心位置
    positions[i * 3] = position.x
    positions[i * 3 + 1] = position.y
    positions[i * 3 + 2] = position.z

    // 随机颜色
    const color = new THREE.Color()
    const hue = colorConfig.h + Math.random() * 0.1
    color.setHSL(hue, colorConfig.s, colorConfig.l + Math.random() * 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // 爆炸速度（球形扩散）
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const speed = 0.5 + Math.random() * 2

    velocities.push({
      x: Math.sin(phi) * Math.cos(theta) * speed,
      y: Math.sin(phi) * Math.sin(theta) * speed,
      z: Math.cos(phi) * speed
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  particles.userData = { velocities, count }
  scene.add(particles)

  return particles
}

/**
 * 爆炸粒子动画
 * @param {Points} particles - 粒子对象
 * @param {Number} duration - 动画持续时间（秒）
 * @returns {Timeline} GSAP 时间线
 */
export function animateExplosionParticles(particles, duration = 3) {
  const { velocities } = particles.userData
  const positions = particles.geometry.attributes.position.array

  return gsap.timeline({
    onComplete: () => {
      // 动画完成后清理
      particles.geometry.dispose()
      particles.material.dispose()
      particles.parent?.remove(particles)
    }
  }).to({}, {
    duration: duration,
    onUpdate: function() {
      const progress = this.progress()

      for (let i = 0; i < velocities.length; i++) {
        // 更新位置
        positions[i * 3] += velocities[i].x
        positions[i * 3 + 1] += velocities[i].y
        positions[i * 3 + 2] += velocities[i].z

        // 减速效果
        velocities[i].x *= 0.98
        velocities[i].y *= 0.98
        velocities[i].z *= 0.98
      }

      particles.geometry.attributes.position.needsUpdate = true
      // 渐隐效果
      particles.material.opacity = 1 - progress
    }
  })
}

/**
 * 创建流星/星尘效果
 * @param {Scene} scene - Three.js 场景对象
 * @param {Number} count - 粒子数量
 * @returns {Points} 粒子对象
 */
export function createStarDust(scene, count = 2000) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400

    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.2 + 0.55, 0.8, 0.6 + Math.random() * 0.4)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  return particles
}

/**
 * 星尘动画
 * @param {Points} particles - 粒子对象
 * @param {Number} duration - 动画持续时间（秒）
 */
export function animateStarDust(particles, duration = 5) {
  const positions = particles.geometry.attributes.position.array

  gsap.to({}, {
    duration: duration,
    repeat: -1,
    ease: 'none',
    onUpdate: function() {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.5 // 向相机移动

        // 重置到远处
        if (positions[i + 2] > 200) {
          positions[i + 2] = -200
        }
      }
      particles.geometry.attributes.position.needsUpdate = true
    }
  })
}
