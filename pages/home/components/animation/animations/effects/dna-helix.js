/**
 * effects/dna-helix.js
 * DNA双螺旋特效
 * 生命起源、科学之美、螺旋结构
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建DNA双螺旋
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} DNA对象
 */
export function createDNAHelix(scene, options = {}) {
  const {
    pairCount = 50,
    radius = 10,
    height = 80,
    twistCount = 3
  } = options

  const basePairs = []
  const backbone1 = []
  const backbone2 = []
  const hydrogenBonds = []

  // 创建碱基对
  const colors = [
    new THREE.Color(0xff0000), // 腺嘌呤 A
    new THREE.Color(0x0000ff), // 胸腺嘧啶 T
    new THREE.Color(0x00ff00), // 鸟嘌呤 G
    new THREE.Color(0xffff00)  // 胞嘧啶 C
  ]

  for (let i = 0; i < pairCount; i++) {
    const t = i / pairCount
    const angle = t * Math.PI * 2 * twistCount
    const y = (t - 0.5) * height

    // 两条链的位置
    const x1 = Math.cos(angle) * radius
    const z1 = Math.sin(angle) * radius
    const x2 = -x1
    const z2 = -z1

    // 碱基对球体
    const base1Geometry = new THREE.SphereGeometry(1.2, 16, 16)
    const base1Material = new THREE.MeshPhongMaterial({
      color: colors[Math.floor(Math.random() * 4)],
      emissive: colors[Math.floor(Math.random() * 4)],
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0
    })
    const base1 = new THREE.Mesh(base1Geometry, base1Material)
    base1.position.set(x1, y, z1)
    base1.scale.setScalar(0)
    scene.add(base1)
    basePairs.push(base1)

    const base2Geometry = new THREE.SphereGeometry(1.2, 16, 16)
    const base2Material = new THREE.MeshPhongMaterial({
      color: colors[Math.floor(Math.random() * 4)],
      emissive: colors[Math.floor(Math.random() * 4)],
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0
    })
    const base2 = new THREE.Mesh(base2Geometry, base2Material)
    base2.position.set(x2, y, z2)
    base2.scale.setScalar(0)
    scene.add(base2)
    basePairs.push(base2)

    // 氢键连接
    const bondGeometry = new THREE.CylinderGeometry(0.3, 0.3, radius * 2, 8)
    const bondMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const bond = new THREE.Mesh(bondGeometry, bondMaterial)
    bond.position.set(0, y, 0)
    bond.rotation.z = Math.PI / 2
    bond.rotation.y = -angle
    scene.add(bond)
    hydrogenBonds.push(bond)
  }

  // 粒子光晕
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  const colorsArr = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const t = Math.random()
    const angle = t * Math.PI * 2 * twistCount + Math.random() * 0.5
    const r = radius + (Math.random() - 0.5) * 4
    const y = (t - 0.5) * height

    positions[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 2
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 2
    positions[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 2

    const color = colors[Math.floor(Math.random() * 4)]
    colorsArr[i * 3] = color.r
    colorsArr[i * 3 + 1] = color.g
    colorsArr[i * 3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3))
  particleGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  // 能量环
  const energyRings = []
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.TorusGeometry(radius + 5 + i * 3, 0.5, 16, 64)
    const material = new THREE.MeshBasicMaterial({
      color: colors[i],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0
    ring.visible = false
    scene.add(ring)
    energyRings.push(ring)
  }

  // 灯光
  const light = new THREE.PointLight(0x00ffff, 0, 100)
  light.position.set(0, 0, 0)
  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0x404040, 0)
  scene.add(ambientLight)

  return {
    basePairs,
    hydrogenBonds,
    particles,
    particleGeometry,
    energyRings,
    light,
    ambientLight,
    update(deltaTime, time) {
      // 更新碱基对发光
      basePairs.forEach((base, i) => {
        const phase = phases ? phases[i % phases.length] : 0
        base.material.emissiveIntensity = 0.3 + Math.sin(time * 3 + phase) * 0.2
      })

      // 更新粒子
      if (particleMaterial.opacity > 0) {
        const pos = particleGeometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += Math.sin(time * 2 + phases[i]) * deltaTime * 2
        }
        particleGeometry.attributes.position.needsUpdate = true
        particleMaterial.uniforms = particleMaterial.uniforms || { uTime: { value: 0 } }
        particleMaterial.uniforms.uTime = { value: time }
      }

      // 更新能量环
      energyRings.forEach((ring, i) => {
        if (ring.visible) {
          ring.rotation.z += deltaTime * (1 + i * 0.3)
        }
      })

      // 灯光脉动
      if (light.intensity > 0) {
        light.intensity = 1 + Math.sin(time * 5) * 0.5
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 灯光出现
      gsap.to(light, {
        intensity: 1,
        duration: 1
      })

      gsap.to(ambientLight, {
        intensity: 0.5,
        duration: 1
      })

      // 碱基对依次出现
      basePairs.forEach((base, i) => {
        gsap.delayedCall(i * 0.02, () => {
          gsap.to(base.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
          })
          gsap.to(base.material, {
            opacity: 0.9,
            duration: 0.3
          })
        })
      })

      // 氢键连接
      hydrogenBonds.forEach((bond, i) => {
        gsap.delayedCall(1 + i * 0.02, () => {
          gsap.to(bond.material, {
            opacity: 0.4,
            duration: 0.3
          })
        })
      })

      // 粒子浮现
      gsap.to(particleMaterial, {
        opacity: 0.8,
        duration: 1,
        delay: 1.5
      })

      // 能量环出现
      energyRings.forEach((ring, i) => {
        gsap.delayedCall(2 + i * 0.3, () => {
          ring.visible = true
          gsap.to(ring.material, {
            opacity: 0.5,
            duration: 0.5
          })
        })
      })

      // 整体旋转
      gsap.to(basePairs[0].rotation, {
        y: Math.PI * 4,
        duration: 5,
        delay: 3,
        ease: 'power2.inOut'
      })

      return tl
    },
    destroy() {
      basePairs.forEach(base => {
        scene.remove(base)
        base.geometry.dispose()
        base.material.dispose()
      })
      hydrogenBonds.forEach(bond => {
        scene.remove(bond)
        bond.geometry.dispose()
        bond.material.dispose()
      })
      scene.remove(particles)
      energyRings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      scene.remove(light)
      scene.remove(ambientLight)
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
