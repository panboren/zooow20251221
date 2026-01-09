/**
 * 量子跃迁特效
 * 模拟量子场中的粒子跃迁与能量释放效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateQuantumLeap(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始化相机位置
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 80), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-leap' })
      },
      onError,
      '量子跃迁',
      controls,
    )

    // 创建量子场系统
    const quantumField = createQuantumFieldSystem(scene, {
      particleCount: 2000,
      energyLevels: 5,
      quantumTunnels: 3
    })

    // 阶段1: 量子场激活
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 50,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子场激活错误',
      ),
    })

    // 阶段2: 量子跃迁开始
    quantumField.activate(3.5)

    // 阶段3: 量子态观察
    tl.to(camera.position, {
      x: 30,
      y: 15,
      z: 40,
      duration: 2.8,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子态观察错误',
      ),
    })

    // 持续动画
    let startTime = null
    const duration = 7

    const animate = (time) => {
      if (!startTime) startTime = time
      const elapsed = (time - startTime) / 1000

      if (elapsed < duration) {
        const deltaTime = 0.016
        quantumField.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        quantumField.deactivate()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '量子跃迁特效执行错误')
    }
    return gsap.timeline()
  }
}

// 量子场系统创建函数
function createQuantumFieldSystem(scene, options = {}) {
  const {
    particleCount = 2000,
    energyLevels = 5,
    quantumTunnels = 3
  } = options

  // 量子场容器
  const field = new THREE.Group()
  scene.add(field)

  // 创建量子核心
  const coreGeometry = new THREE.IcosahedronGeometry(4, 3)
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    emissive: 0x0044ff,
    transparent: true,
    opacity: 0.8
  })
  const quantumCore = new THREE.Mesh(coreGeometry, coreMaterial)
  field.add(quantumCore)

  // 创建概率云粒子系统
  const cloudGeometry = new THREE.BufferGeometry()
  const cloudPositions = new Float32Array(particleCount * 3)
  const cloudColors = new Float32Array(particleCount * 3)
  const cloudSizes = new Float32Array(particleCount)

  const cloudParticles = []

  // 初始化粒子位置和状态
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // 球面随机分布
    const radius = 5 + Math.random() * 40
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    cloudPositions[i3] = x
    cloudPositions[i3 + 1] = y
    cloudPositions[i3 + 2] = z

    // 根据能量级设置颜色
    const energyLevel = Math.floor(Math.random() * energyLevels)
    const hue = 0.55 + energyLevel * 0.07
    const color = new THREE.Color().setHSL(hue, 0.9, 0.5)

    cloudColors[i3] = color.r
    cloudColors[i3 + 1] = color.g
    cloudColors[i3 + 2] = color.b

    cloudSizes[i] = 0.2 + Math.random() * 0.5

    cloudParticles.push({
      originalPosition: new THREE.Vector3(x, y, z),
      targetPosition: new THREE.Vector3(),
      energyLevel: energyLevel,
      transitionProgress: 0,
      transitionSpeed: 0.01 + Math.random() * 0.02,
      isTransitioning: false
    })
  }

  cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3))
  cloudGeometry.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3))
  cloudGeometry.setAttribute('size', new THREE.BufferAttribute(cloudSizes, 1))

  const cloudMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  const cloudSystem = new THREE.Points(cloudGeometry, cloudMaterial)
  field.add(cloudSystem)

  // 创建量子隧道
  const tunnels = []
  for (let i = 0; i < quantumTunnels; i++) {
    const tunnelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 8, 1, true)
    const tunnelMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6, 0.8, 0.7),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    })

    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial)
    const angle = (i / quantumTunnels) * Math.PI * 2
    tunnel.position.set(
      Math.cos(angle) * 20,
      0,
      Math.sin(angle) * 20
    )
    tunnel.rotation.x = Math.PI / 2
    field.add(tunnel)
    tunnels.push(tunnel)
  }

  // 创建能量级轨道
  const energyOrbits = []
  for (let i = 0; i < energyLevels; i++) {
    const radius = 10 + i * 8
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.3, 16, 64)
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.55 + i * 0.07, 0.8, 0.6),
      transparent: true,
      opacity: 0.2
    })

    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
    orbit.rotation.x = Math.PI / 2
    field.add(orbit)
    energyOrbits.push(orbit)
  }

  // 使用纯净对象避免原型链问题
  const result = Object.create(null)

  // 动画状态管理
  const animationState = {
    active: false,
    phase: 0,
    lastUpdate: 0
  }

  // 激活量子场
  result.activate = function(duration) {
    animationState.active = true
    animationState.phase = 1
    animationState.lastUpdate = 0

    // 核心脉动效果
    gsap.to(quantumCore.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 随机触发粒子跃迁
    setInterval(() => {
      if (!animationState.active) return

      // 随机选择10%的粒子开始跃迁
      const transitioningCount = Math.floor(cloudParticles.length * 0.1)
      for (let i = 0; i < transitioningCount; i++) {
        const randomIndex = Math.floor(Math.random() * cloudParticles.length)
        const particle = cloudParticles[randomIndex]

        if (!particle.isTransitioning) {
          particle.isTransitioning = true
          particle.transitionProgress = 0

          // 设置新的目标位置（可能在不同能量级）
          const newEnergyLevel = (particle.energyLevel + 1 + Math.floor(Math.random() * (energyLevels - 1))) % energyLevels
          particle.energyLevel = newEnergyLevel

          // 计算新位置
          const radius = 10 + newEnergyLevel * 8
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)

          particle.targetPosition.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          )
        }
      }
    }, 500)
  }

  // 更新函数
  result.update = function(deltaTime, elapsed) {
    if (!animationState.active) return

    const time = elapsed * 1.5
    animationState.lastUpdate = time

    // 更新核心旋转
    quantumCore.rotation.x = time * 0.1
    quantumCore.rotation.y = time * 0.15

    // 更新概率云粒子
    const positions = cloudGeometry.attributes.position.array
    const colors = cloudGeometry.attributes.color.array

    cloudParticles.forEach((particle, i) => {
      const i3 = i * 3

      if (particle.isTransitioning) {
        // 粒子跃迁动画
        particle.transitionProgress += particle.transitionSpeed * deltaTime * 60

        if (particle.transitionProgress >= 1) {
          particle.transitionProgress = 1
          particle.isTransitioning = false
          particle.originalPosition.copy(particle.targetPosition)
        }

        // 插值位置
        positions[i3] = THREE.MathUtils.lerp(
          particle.originalPosition.x,
          particle.targetPosition.x,
          particle.transitionProgress
        )
        positions[i3 + 1] = THREE.MathUtils.lerp(
          particle.originalPosition.y,
          particle.targetPosition.y,
          particle.transitionProgress
        )
        positions[i3 + 2] = THREE.MathUtils.lerp(
          particle.originalPosition.z,
          particle.targetPosition.z,
          particle.transitionProgress
        )

        // 跃迁时颜色变化
        const pulse = Math.sin(particle.transitionProgress * Math.PI) * 0.5 + 0.5
        const hue = 0.55 + particle.energyLevel * 0.07
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + pulse * 0.3)

        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b

        // 跃迁时大小变化
        cloudSizes[i] = 0.5 + Math.sin(particle.transitionProgress * Math.PI) * 0.8
      } else {
        // 正常状态下的轻微波动
        positions[i3] = particle.originalPosition.x + Math.sin(time + i) * 0.1
        positions[i3 + 1] = particle.originalPosition.y + Math.cos(time * 1.3 + i) * 0.1
        positions[i3 + 2] = particle.originalPosition.z + Math.sin(time * 0.7 + i) * 0.1

        // 根据能量级设置基础颜色
        const hue = 0.55 + particle.energyLevel * 0.07
        const color = new THREE.Color().setHSL(hue, 0.9, 0.5)

        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b

        cloudSizes[i] = 0.3 + Math.random() * 0.4
      }
    })

    cloudGeometry.attributes.position.needsUpdate = true
    cloudGeometry.attributes.color.needsUpdate = true
    cloudGeometry.attributes.size.needsUpdate = true

    // 更新量子隧道
    tunnels.forEach((tunnel, index) => {
      tunnel.material.opacity = 0.2 + Math.sin(time * 1.2 + index) * 0.15
      tunnel.rotation.z = time * 0.05 * (index + 1)
    })

    // 更新能量级轨道
    energyOrbits.forEach((orbit, index) => {
      orbit.material.opacity = 0.15 + Math.sin(time * 0.8 + index) * 0.1
      orbit.rotation.y = time * 0.03 * (index + 1)
    })

    // 整体场旋转
    field.rotation.y = elapsed * 0.05
  }

  // 停止动画
  result.deactivate = function() {
    // 清理资源
    if (cloudSystem?.geometry) cloudSystem.geometry.dispose()
    if (cloudSystem?.material) cloudSystem.material.dispose()
    field.remove(cloudSystem)

    if (quantumCore?.geometry) quantumCore.geometry.dispose()
    if (quantumCore?.material) quantumCore.material.dispose()
    field.remove(quantumCore)

    if (tunnels) {
      tunnels.forEach(tunnel => {
        if (tunnel.geometry) tunnel.geometry.dispose()
        if (tunnel.material) tunnel.material.dispose()
        field.remove(tunnel)
      })
    }

    if (energyOrbits) {
      energyOrbits.forEach(orbit => {
        if (orbit.geometry) orbit.geometry.dispose()
        if (orbit.material) orbit.material.dispose()
        field.remove(orbit)
      })
    }

    scene.remove(field)
    animationState.active = false
  }

  return result
}
