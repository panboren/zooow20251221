/**
 * 星际漩涡特效
 * 模拟银河系中心的旋转漩涡与能量传播效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateGalacticVortex(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 100), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'galactic-vortex' })
      },
      onError,
      '星际漩涡',
      controls,
    )

    // 创建星际漩涡系统
    const galacticVortex = createGalacticVortexSystem(scene, {
      particleCount: 1500,
      spiralArms: 4,
      energyRings: 5,
      starClusters: 8
    })

    // 阶段1: 漩涡初现
    tl.to(camera.position, {
      x: 0,
      y: 30,
      z: 70,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '漩涡初现错误',
      ),
    })

    // 阶段2: 漩涡激活
    galacticVortex.activate(4)

    // 阶段3: 漩涡旋转欣赏
    tl.to(camera.position, {
      x: 40,
      y: 20,
      z: 60,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '漩涡旋转错误',
      ),
    })

    // 持续漩涡演绎
    let startTime = null
    const duration = 6

    const animate = (time) => {
      if (!startTime) startTime = time
      const elapsed = (time - startTime) / 1000

      if (elapsed < duration) {
        const deltaTime = 0.016
        galacticVortex.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        galacticVortex.deactivate()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '星际漩涡特效执行错误')
    }
    return gsap.timeline()
  }
}

// 星际漩涡系统创建函数
function createGalacticVortexSystem(scene, options = {}) {
  const {
    particleCount = 1500,
    spiralArms = 4,
    energyRings = 5,
    starClusters = 8
  } = options

  // 漩涡容器
  const galaxy = new THREE.Group()
  scene.add(galaxy)

  // 创建漩涡中心黑洞
  const blackHoleGeometry = new THREE.SphereGeometry(5, 32, 32)
  const blackHoleMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true
  })
  const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial)
  galaxy.add(blackHole)

  // 创建吸积盘
  const accretionDiskGeometry = new THREE.RingGeometry(5, 15, 64)
  const accretionDiskMaterial = new THREE.MeshBasicMaterial({
    color: 0xff5500,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  })
  const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial)
  accretionDisk.rotation.x = Math.PI / 2
  galaxy.add(accretionDisk)

  // 创建螺旋臂粒子系统
  const spiralGeometry = new THREE.BufferGeometry()
  const spiralPositions = new Float32Array(particleCount * 3)
  const spiralColors = new Float32Array(particleCount * 3)
  const spiralSizes = new Float32Array(particleCount)

  const spiralParticles = []

  for (let i = 0; i < particleCount; i++) {
    // 基于对数螺旋生成位置
    const arm = i % spiralArms
    const angle = (i / particleCount) * Math.PI * 8
    const radius = 10 + (i / particleCount) * 50
    const armOffset = (arm / spiralArms) * Math.PI * 2

    // 螺旋臂位置计算
    const x = Math.cos(angle + armOffset) * radius
    const y = (Math.random() - 0.5) * 8  // 稍微偏离平面
    const z = Math.sin(angle + armOffset) * radius

    const i3 = i * 3
    spiralPositions[i3] = x
    spiralPositions[i3 + 1] = y
    spiralPositions[i3 + 2] = z

    // 根据距离中心的距离设置颜色
    const distanceFactor = Math.min(1, radius / 60)
    const hue = 0.6 + distanceFactor * 0.2  // 蓝紫色调
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    spiralColors[i3] = color.r
    spiralColors[i3 + 1] = color.g
    spiralColors[i3 + 2] = color.b

    spiralSizes[i] = 0.3 + Math.random() * 0.7

    spiralParticles.push({
      originalPosition: new THREE.Vector3(x, y, z),
      arm: arm,
      angle: angle,
      radius: radius,
      speed: 0.01 + Math.random() * 0.02,
      pulsePhase: Math.random() * Math.PI * 2
    })
  }

  spiralGeometry.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3))
  spiralGeometry.setAttribute('color', new THREE.BufferAttribute(spiralColors, 3))
  spiralGeometry.setAttribute('size', new THREE.BufferAttribute(spiralSizes, 1))

  const spiralMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  const spiralSystem = new THREE.Points(spiralGeometry, spiralMaterial)
  galaxy.add(spiralSystem)

  // 创建能量环
  const energyRingsArray = []
  for (let i = 0; i < energyRings; i++) {
    const ringRadius = 20 + i * 12
    const ringGeometry = new THREE.RingGeometry(ringRadius - 0.5, ringRadius + 0.5, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.7, 0.8, 0.6),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    galaxy.add(ring)
    energyRingsArray.push(ring)
  }

  // 创建星团
  const starClustersArray = []
  for (let i = 0; i < starClusters; i++) {
    const clusterGeometry = new THREE.SphereGeometry(1.5, 16, 16)
    const clusterMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.1 + i * 0.1, 0.8, 0.7),
      emissive: new THREE.Color().setHSL(0.1 + i * 0.1, 0.5, 0.3),
      transparent: true,
      opacity: 0.9
    })

    const cluster = new THREE.Mesh(clusterGeometry, clusterMaterial)
    const angle = (i / starClusters) * Math.PI * 2
    const distance = 25 + Math.random() * 20
    cluster.position.set(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 5,
      Math.sin(angle) * distance
    )
    galaxy.add(cluster)
    starClustersArray.push(cluster)
  }

  // 创建能量射线
  const energyBeams = []
  for (let i = 0; i < spiralArms; i++) {
    const beamGeometry = new THREE.CylinderGeometry(0.2, 0.5, 40, 8)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6, 0.9, 0.7),
      transparent: true,
      opacity: 0.4
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)
    const angle = (i / spiralArms) * Math.PI * 2
    beam.position.set(
      Math.cos(angle) * 25,
      0,
      Math.sin(angle) * 25
    )
    beam.lookAt(0, 0, 0)
    galaxy.add(beam)
    energyBeams.push(beam)
  }

  // 使用纯净对象避免原型链问题
  const result = Object.create(null)

  // 动画状态管理
  const animationState = {
    active: false,
    phase: 0,
    lastUpdate: 0
  }

  // 激活漩涡
  result.activate = function(duration) {
    animationState.active = true
    animationState.phase = 1
    animationState.lastUpdate = 0

    // 黑洞脉动效果
    gsap.to(blackHole.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 吸积盘旋转
    gsap.to(accretionDisk.rotation, {
      z: Math.PI * 2,
      duration: 6,
      repeat: -1,
      ease: 'linear'
    })
  }

  // 更新函数
  result.update = function(deltaTime, elapsed) {
    if (!animationState.active) return

    const time = elapsed * 2
    animationState.lastUpdate = time

    // 更新螺旋臂粒子
    const positions = spiralGeometry.attributes.position.array
    const colors = spiralGeometry.attributes.color.array

    spiralParticles.forEach((particle, i) => {
      const i3 = i * 3

      // 计算新的角度（模拟旋转）
      const newAngle = particle.angle + particle.speed * time
      const newRadius = particle.radius

      // 螺旋臂运动
      positions[i3] = Math.cos(newAngle) * newRadius
      positions[i3 + 1] = particle.originalPosition.y + Math.sin(time * 2 + i * 0.01) * 0.5
      positions[i3 + 2] = Math.sin(newAngle) * newRadius

      // 脉动效果
      const pulse = Math.sin(time * 3 + particle.pulsePhase) * 0.3 + 0.7
      const distanceFactor = Math.min(1, particle.radius / 60)
      const hue = 0.6 + distanceFactor * 0.2
      const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
      color.multiplyScalar(pulse)

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    })

    spiralGeometry.attributes.position.needsUpdate = true
    spiralGeometry.attributes.color.needsUpdate = true

    // 更新星团位置
    starClustersArray.forEach((cluster, index) => {
      const orbitRadius = 25 + Math.random() * 20
      const angle = (index / starClusters) * Math.PI * 2 + time * 0.3
      cluster.position.x = Math.cos(angle) * orbitRadius
      cluster.position.z = Math.sin(angle) * orbitRadius
      cluster.rotation.y = time * 0.5
    })

    // 更新能量环
    energyRingsArray.forEach((ring, index) => {
      ring.material.opacity = 0.1 + Math.sin(time * 1.5 + index) * 0.1
      ring.rotation.z = time * 0.1 * (index + 1)
    })

    // 更新能量射线
    energyBeams.forEach((beam, index) => {
      beam.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.2
      beam.rotation.y = time * 0.2
    })

    // 整体漩涡旋转
    galaxy.rotation.y = elapsed * 0.1
    galaxy.rotation.x = Math.sin(elapsed * 0.15) * 0.05
  }

  // 停止动画
  result.deactivate = function() {
    // 清理资源
    if (spiralSystem?.geometry) spiralSystem.geometry.dispose()
    if (spiralSystem?.material) spiralSystem.material.dispose()
    galaxy.remove(spiralSystem)

    if (blackHole?.geometry) blackHole.geometry.dispose()
    if (blackHole?.material) blackHole.material.dispose()
    galaxy.remove(blackHole)

    if (accretionDisk?.geometry) accretionDisk.geometry.dispose()
    if (accretionDisk?.material) accretionDisk.material.dispose()
    galaxy.remove(accretionDisk)

    if (energyRingsArray) {
      energyRingsArray.forEach(ring => {
        if (ring.geometry) ring.geometry.dispose()
        if (ring.material) ring.material.dispose()
        galaxy.remove(ring)
      })
    }

    if (starClustersArray) {
      starClustersArray.forEach(cluster => {
        if (cluster.geometry) cluster.geometry.dispose()
        if (cluster.material) cluster.material.dispose()
        galaxy.remove(cluster)
      })
    }

    if (energyBeams) {
      energyBeams.forEach(beam => {
        if (beam.geometry) beam.geometry.dispose()
        if (beam.material) beam.material.dispose()
        galaxy.remove(beam)
      })
    }

    scene.remove(galaxy)
    animationState.active = false
  }

  return result
}
