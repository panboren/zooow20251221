/**
 * 时间之沙 - 时空粒子流特效（增强版）
 * 融合沙漏、时光倒流、粒子流动的唯美视觉效果
 * 技术亮点：
 * - 沙漏形态变换
 * - 80000+ 流动粒子
 * - 时空涟漪效应
 * - 黄金粒子流
 * - 时间冻结与倒流
 * - 银河星尘
 * - 光之轨迹
 * - 时间碎片
 * - 能量脉冲
 * - 螺旋时光隧道
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateTimeSand(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 远距离俯视视角
    setupInitialCamera(camera, new THREE.Vector3(0, 80, 0), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'time-sand' })
      },
      onError,
      '时间之沙',
      controls
    )

    // 沙漏框架（增强版）
    const hourglassFrame = createHourglassFrame(scene)

    // 黄金时间沙（25000粒子）
    const goldenSand = createGoldenSand(scene, {
      particleCount: 25000
    })

    // 银河星尘（15000粒子）
    const galaxyStardust = createGalaxyStardust(scene, {
      particleCount: 15000
    })

    // 时空涟漪
    const timeRipples = createTimeRipples(scene)

    // 倒流粒子（15000粒子）
    const reversedParticles = createReversedParticles(scene, {
      particleCount: 15000
    })

    // 时间漩涡
    const timeVortex = createTimeVortex(scene)

    // 光之轨迹（5000粒子）
    const lightTrails = createLightTrails(scene, {
      particleCount: 5000
    })

    // 时间碎片（3000粒子）
    const timeShards = createTimeShards(scene, {
      shardCount: 3000
    })

    // 能量脉冲
    const energyPulses = createEnergyPulses(scene)

    // 螺旋时光隧道
    const timeTunnel = createTimeTunnel(scene)

    // 阶段1: 沙漏显现 - 从虚空中浮现（持续2秒）
    tl.to(camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '沙漏显现错误'
      )
    })

    tl.call(() => {
      hourglassFrame.appear()
      energyPulses.start()
    }, null, 0.3)

    tl.to(camera.position, {
      x: 25,
      y: 20,
      z: 35,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '视角移动错误'
      )
    }, 0.5)

    tl.call(() => {
      goldenSand.flow()
      galaxyStardust.drift()
    }, null, 1)

    // 阶段2: 时间流逝 - 沙粒落下（持续3秒）
    tl.to(camera.position, {
      x: 18,
      y: -12,
      z: 30,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间流逝错误'
      )
    }, 2)

    tl.call(() => {
      timeRipples.emit()
      lightTrails.trace()
    }, null, 2.3)

    tl.call(() => {
      timeShards.fragment()
    }, null, 3)

    // 阶段3: 时间冻结 - 粒子悬停（持续2.5秒）
    tl.to(camera.position, {
      x: -20,
      y: 12,
      z: 25,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间冻结错误'
      )
    }, 5)

    tl.call(() => {
      goldenSand.freeze()
      galaxyStardust.freeze()
      reversedParticles.reverse()
    }, null, 5.3)

    // 阶段4: 时光倒流 - 粒子上升（持续2.5秒）
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 40,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时光倒流错误'
      )
    }, 7.5)

    tl.call(() => {
      timeVortex.activate()
      timeTunnel.spin()
      reversedParticles.ascend()
      lightTrails.reverse()
    }, null, 7.8)

    tl.to(camera, {
      fov: 75,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 9)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      hourglassFrame.update(time)
      goldenSand.update(time)
      galaxyStardust.update(time)
      timeRipples.update(time)
      reversedParticles.update(time)
      timeVortex.update(time)
      lightTrails.update(time)
      timeShards.update(time)
      energyPulses.update(time)
      timeTunnel.update(time)
    }

    // 清理函数
    const cleanup = () => {
      hourglassFrame.destroy()
      goldenSand.destroy()
      galaxyStardust.destroy()
      timeRipples.destroy()
      reversedParticles.destroy()
      timeVortex.destroy()
      lightTrails.destroy()
      timeShards.destroy()
      energyPulses.destroy()
      timeTunnel.destroy()
    }

    tl.call(cleanup, null, 10.5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建沙漏框架（增强版）
 */
function createHourglassFrame(scene) {
  const frameGroup = new THREE.Group()

  // 上半球框架
  const topSphereGeometry = new THREE.SphereGeometry(8, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2)
  const frameMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  const topSphere = new THREE.Mesh(topSphereGeometry, frameMaterial)
  frameGroup.add(topSphere)

  // 下半球框架
  const bottomSphereGeometry = new THREE.SphereGeometry(8, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)
  const bottomSphere = new THREE.Mesh(bottomSphereGeometry, frameMaterial)
  frameGroup.add(bottomSphere)

  // 连接环
  const ringGeometry = new THREE.TorusGeometry(1.5, 0.2, 32, 128)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2
  frameGroup.add(ring)

  // 装饰性光圈（5层）
  for (let i = 0; i < 5; i++) {
    const decorativeRingGeometry = new THREE.TorusGeometry(
      9 + i * 1.2,
      0.1,
      32,
      128
    )
    const decorativeRingMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.12 + i * 0.03, 0.9, 0.7),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const decorativeRing = new THREE.Mesh(decorativeRingGeometry, decorativeRingMaterial)
    decorativeRing.rotation.x = Math.PI / 2
    decorativeRing.userData = { rotationSpeed: 0.002 + i * 0.001 }
    frameGroup.add(decorativeRing)
  }

  // 悬浮粒子环
  const ringParticleCount = 800
  const ringParticleGeometry = new THREE.BufferGeometry()
  const ringPositions = new Float32Array(ringParticleCount * 3)
  const ringColors = new Float32Array(ringParticleCount * 3)

  for (let i = 0; i < ringParticleCount; i++) {
    const angle = (i / ringParticleCount) * Math.PI * 2
    const radius = 14 + Math.random() * 3

    ringPositions[i * 3] = Math.cos(angle) * radius
    ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.5
    ringPositions[i * 3 + 2] = Math.sin(angle) * radius

    const color = new THREE.Color().setHSL(0.12 + Math.random() * 0.08, 0.8, 0.8)
    ringColors[i * 3] = color.r
    ringColors[i * 3 + 1] = color.g
    ringColors[i * 3 + 2] = color.b
  }

  ringParticleGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
  ringParticleGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))

  const ringParticleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const ringParticles = new THREE.Points(ringParticleGeometry, ringParticleMaterial)
  frameGroup.add(ringParticles)

  scene.add(frameGroup)

  const hourglass = {
    group: frameGroup,
    topSphere,
    bottomSphere,
    ring,
    decorativeRings: frameGroup.children.slice(3, 8),
    ringParticles,

    appear() {
      gsap.to(topSphere.material, { opacity: 0.6, duration: 1.5 })
      gsap.to(bottomSphere.material, { opacity: 0.6, duration: 1.5 })
      gsap.to(ring.material, { opacity: 0.9, duration: 1 })

      this.decorativeRings.forEach((ring, i) => {
        gsap.to(ring.material, {
          opacity: 0.5,
          duration: 1.2,
          delay: 0.3 + i * 0.15
        })
      })

      gsap.to(ringParticleMaterial, { opacity: 0.8, duration: 1.5, delay: 0.5 })
    },

    update(time) {
      this.group.rotation.y += 0.001
      this.ring.rotation.z += 0.005

      this.decorativeRings.forEach(ring => {
        ring.rotation.z += ring.userData.rotationSpeed
      })

      ringParticles.rotation.y -= 0.002

      // 缓慢上下浮动
      this.group.position.y = Math.sin(time * 0.5) * 0.5

      // 粒子闪烁
      const ringPos = ringParticleGeometry.attributes.position.array
      for (let i = 0; i < ringParticleCount; i++) {
        if (Math.random() < 0.002) {
          ringPos[i * 3 + 1] = (Math.random() - 0.5) * 1
        }
      }
      ringParticleGeometry.attributes.position.needsUpdate = true
    },

    destroy() {
      scene.remove(frameGroup)
      topSphere.geometry.dispose()
      topSphere.material.dispose()
      bottomSphere.geometry.dispose()
      bottomSphere.material.dispose()
      ring.geometry.dispose()
      ring.material.dispose()

      this.decorativeRings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })

      ringParticleGeometry.dispose()
      ringParticleMaterial.dispose()
    }
  }

  return hourglass
}

/**
 * 创建黄金时间沙
 */
function createGoldenSand(scene, options) {
  const { particleCount = 25000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  const goldColors = [
    new THREE.Color(0xffd700),
    new THREE.Color(0xffa500),
    new THREE.Color(0xffb347),
    new THREE.Color(0xffec8b),
    new THREE.Color(0xffe135),
    new THREE.Color(0xffe4b5)
  ]

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * (Math.PI / 2 - 0.2)
    const radius = Math.random() * 6

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = goldColors[Math.floor(Math.random() * goldColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = 0
    velocities[i * 3 + 1] = -3 - Math.random() * 5
    velocities[i * 3 + 2] = 0
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const goldenSand = {
    points,
    material,
    geometry,
    flowing: false,
    frozen: false,

    flow() {
      gsap.to(material, { opacity: 0.9, duration: 1 })
      this.flowing = true
    },

    freeze() {
      this.frozen = true
      this.flowing = false
    },

    update(time) {
      if (this.flowing && !this.frozen) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3

          pos[idx + 1] += velocities[idx + 1] * 0.008

          // 添加随机扰动
          pos[idx] += Math.sin(time * 5 + i) * 0.0001
          pos[idx + 2] += Math.cos(time * 5 + i) * 0.0001

          if (pos[idx + 1] < -6) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * (Math.PI / 2 - 0.2)
            const radius = Math.random() * 6

            pos[idx] = radius * Math.sin(phi) * Math.cos(theta)
            pos[idx + 1] = 6 * Math.cos(phi)
            pos[idx + 2] = radius * Math.sin(phi) * Math.sin(theta)
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      if (this.frozen) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          pos[idx] += Math.sin(time * 2 + i) * 0.0002
          pos[idx + 2] += Math.cos(time * 2 + i) * 0.0002
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0003
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return goldenSand
}

/**
 * 创建银河星尘
 */
function createGalaxyStardust(scene, options) {
  const { particleCount = 15000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  const stardustColors = [
    new THREE.Color(0x8a2be2),
    new THREE.Color(0x9370db),
    new THREE.Color(0xba55d3),
    new THREE.Color(0xff69b4),
    new THREE.Color(0xff1493)
  ]

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 20 + Math.random() * 30

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = stardustColors[Math.floor(Math.random() * stardustColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.02
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const galaxy = {
    points,
    material,
    geometry,
    drifting: false,
    frozen: false,

    drift() {
      gsap.to(material, { opacity: 0.7, duration: 1.5 })
      this.drifting = true
    },

    freeze() {
      this.frozen = true
      this.drifting = false
    },

    update(time) {
      if (this.drifting && !this.frozen) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          pos[idx] += velocities[idx * 3]
          pos[idx + 1] += velocities[idx * 3 + 1]
          pos[idx + 2] += velocities[idx * 3 + 2]

          // 闪烁效果
          if (Math.random() < 0.001) {
            pos[idx] *= 1.01
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      if (this.frozen) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          pos[idx] += Math.sin(time * 1.5 + i * 0.001) * 0.0003
          pos[idx + 1] += Math.cos(time * 1.5 + i * 0.001) * 0.0003
          pos[idx + 2] += Math.sin(time * 1.5 + i * 0.001) * 0.0003
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0002
      points.rotation.x += 0.00005
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return galaxy
}

/**
 * 创建时空涟漪
 */
function createTimeRipples(scene) {
  const rippleCount = 6
  const ripples = []

  for (let i = 0; i < rippleCount; i++) {
    const geometry = new THREE.RingGeometry(
      3 + i * 1.5,
      3.5 + i * 1.5,
      128
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.5 + i * 0.06, 0.8, 0.8),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    ripple.userData = {
      maxScale: 3,
      currentScale: 0.4,
      expanding: false,
      delay: i * 0.25
    }

    ripples.push(ripple)
    scene.add(ripple)
  }

  const timeRipples = {
    ripples,
    emitting: false,

    emit() {
      this.emitting = true
      ripples.forEach((ripple, i) => {
        ripple.userData.currentScale = 0.4
        gsap.to(ripple.material, {
          opacity: 0.7,
          duration: 0.5,
          delay: ripple.userData.delay
        })
      })
    },

    update(time) {
      if (this.emitting) {
        ripples.forEach((ripple, i) => {
          if (ripple.userData.currentScale < ripple.userData.maxScale) {
            ripple.userData.currentScale += 0.006
            const scale = ripple.userData.currentScale
            ripple.scale.set(scale, scale, scale)

            const opacity = 0.7 * (1 - scale / ripple.userData.maxScale)
            ripple.material.opacity = opacity
          } else {
            ripple.userData.currentScale = 0.4
            ripple.material.opacity = 0.7
          }
        })
      }

      ripples.forEach((ripple, i) => {
        ripple.rotation.z += 0.0012 * (i + 1)
      })
    },

    destroy() {
      ripples.forEach(ripple => {
        scene.remove(ripple)
        ripple.geometry.dispose()
        ripple.material.dispose()
      })
    }
  }

  return timeRipples
}

/**
 * 创建倒流粒子
 */
function createReversedParticles(scene, options) {
  const { particleCount = 15000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  const reversedColors = [
    new THREE.Color(0x00bfff),
    new THREE.Color(0x87ceeb),
    new THREE.Color(0xadd8e6),
    new THREE.Color(0x7fffd4),
    new THREE.Color(0x40e0d0),
    new THREE.Color(0x48d1cc)
  ]

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 8 + Math.random() * 15

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = reversedColors[Math.floor(Math.random() * reversedColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const reversed = {
    points,
    material,
    geometry,
    reversing: false,
    ascending: false,
    originalPositions: positions.slice(),

    reverse() {
      this.reversing = true
      gsap.to(material, { opacity: 0.85, duration: 1 })
    },

    ascend() {
      this.ascending = true
      this.reversing = false
    },

    update(time) {
      if (this.reversing) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          pos[idx] *= 0.994
          pos[idx + 1] *= 0.994
          pos[idx + 2] *= 0.994

          // 添加螺旋效果
          pos[idx] += Math.sin(time * 3 + i) * 0.0003
          pos[idx + 2] += Math.cos(time * 3 + i) * 0.0003
        }
        geometry.attributes.position.needsUpdate = true
      }

      if (this.ascending) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3

          const angle = time * 2.5 + i * 0.001
          const radius = Math.sqrt(pos[idx] * pos[idx] + pos[idx + 2] * pos[idx + 2])

          pos[idx] = Math.cos(angle) * radius
          pos[idx + 1] += 0.04
          pos[idx + 2] = Math.sin(angle) * radius

          // 添加旋转效果
          pos[idx] += Math.sin(angle) * 0.01
          pos[idx + 2] += Math.cos(angle) * 0.01

          if (pos[idx + 1] > 15) {
            pos[idx + 1] = -15
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      if (!this.reversing && !this.ascending) {
        points.rotation.y += 0.0006
      }
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return reversed
}

/**
 * 创建时间漩涡
 */
function createTimeVortex(scene) {
  const vortexGroup = new THREE.Group()

  const rings = []
  for (let i = 0; i < 6; i++) {
    const geometry = new THREE.TorusGeometry(
      5 + i * 1.8,
      0.25,
      32,
      128
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.7 + i * 0.035, 0.9, 0.65),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.userData = {
      rotationSpeed: 0.025 + i * 0.006,
      scaleSpeed: 0.5 + i * 0.1
    }
    rings.push(ring)
    vortexGroup.add(ring)
  }

  const vortexParticleCount = 4000
  const vortexGeometry = new THREE.BufferGeometry()
  const vortexPositions = new Float32Array(vortexParticleCount * 3)
  const vortexColors = new Float32Array(vortexParticleCount * 3)

  for (let i = 0; i < vortexParticleCount; i++) {
    const angle = (i / vortexParticleCount) * Math.PI * 2
    const radius = 4 + Math.random() * 8

    vortexPositions[i * 3] = Math.cos(angle) * radius
    vortexPositions[i * 3 + 1] = (Math.random() - 0.5) * 2.5
    vortexPositions[i * 3 + 2] = Math.sin(angle) * radius

    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.25, 1, 0.8)
    vortexColors[i * 3] = color.r
    vortexColors[i * 3 + 1] = color.g
    vortexColors[i * 3 + 2] = color.b
  }

  vortexGeometry.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3))
  vortexGeometry.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3))

  const vortexMaterial = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const vortexPoints = new THREE.Points(vortexGeometry, vortexMaterial)
  vortexGroup.add(vortexPoints)

  scene.add(vortexGroup)

  const vortex = {
    group: vortexGroup,
    rings,
    points: vortexPoints,
    activated: false,

    activate() {
      this.activated = true

      rings.forEach((ring, i) => {
        gsap.to(ring.material, {
          opacity: 0.85,
          duration: 0.8,
          delay: i * 0.12
        })
      })

      gsap.to(vortexMaterial, { opacity: 0.95, duration: 1 })
    },

    update(time) {
      if (this.activated) {
        rings.forEach((ring, i) => {
          ring.rotation.z -= ring.userData.rotationSpeed

          const scale = 1 + Math.sin(time * 2.5 + i) * 0.12
          ring.scale.set(scale, scale, scale)
        })

        const pos = vortexGeometry.attributes.position.array
        for (let i = 0; i < vortexParticleCount; i++) {
          const idx = i * 3
          const angle = time * 3.5 + i * 0.001
          const radius = Math.sqrt(pos[idx] * pos[idx] + pos[idx + 2] * pos[idx + 2])

          const newRadius = radius * 0.997
          if (newRadius > 3) {
            pos[idx] = Math.cos(angle) * newRadius
            pos[idx + 2] = Math.sin(angle) * newRadius
          } else {
            const resetRadius = 11 + Math.random() * 2
            pos[idx] = Math.cos(angle) * resetRadius
            pos[idx + 2] = Math.sin(angle) * resetRadius
          }
        }
        vortexGeometry.attributes.position.needsUpdate = true
      }

      this.group.rotation.y += 0.004
    },

    destroy() {
      scene.remove(vortexGroup)
      rings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
      vortexGeometry.dispose()
      vortexMaterial.dispose()
    }
  }

  return vortex
}

/**
 * 创建光之轨迹
 */
function createLightTrails(scene, options) {
  const { particleCount = 5000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const trailData = []

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30

    const color = new THREE.Color().setHSL(Math.random() * 0.15 + 0.1, 1, 0.85)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    trailData.push({
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 8,
      speed: 0.5 + Math.random() * 1.5,
      direction: Math.random() > 0.5 ? 1 : -1
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const trails = {
    points,
    material,
    geometry,
    trailData,
    tracing: false,
    reversed: false,

    trace() {
      gsap.to(material, { opacity: 0.8, duration: 1 })
      this.tracing = true
    },

    reverse() {
      this.reversed = true
    },

    update(time) {
      if (this.tracing) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          const data = trailData[i]

          data.angle += data.speed * 0.02 * (this.reversed ? -1 : 1)

          const x = Math.cos(data.angle) * data.radius
          const z = Math.sin(data.angle) * data.radius
          const y = Math.sin(time * 3 + i * 0.002) * 3

          pos[idx] = x
          pos[idx + 1] = y
          pos[idx + 2] = z
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.001
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return trails
}

/**
 * 创建时间碎片
 */
function createTimeShards(scene, options) {
  const { shardCount = 3000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(shardCount * 3)
  const colors = new Float32Array(shardCount * 3)
  const shardData = []

  for (let i = 0; i < shardCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 25 + Math.random() * 20

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = new THREE.Color().setHSL(0.3 + Math.random() * 0.4, 0.8, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    shardData.push({
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      floatSpeed: 0.5 + Math.random() * 1,
      floatOffset: Math.random() * Math.PI * 2
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const shards = {
    points,
    material,
    geometry,
    shardData,
    fragmenting: false,

    fragment() {
      gsap.to(material, { opacity: 0.75, duration: 1.2 })
      this.fragmenting = true
    },

    update(time) {
      if (this.fragmenting) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < shardCount; i++) {
          const idx = i * 3
          const data = shardData[i]

          const angle = data.rotationSpeed * time * 10
          const floatY = Math.sin(time * data.floatSpeed + data.floatOffset) * 0.01

          pos[idx] += Math.sin(angle) * 0.005
          pos[idx + 1] += floatY
          pos[idx + 2] += Math.cos(angle) * 0.005

          // 闪烁效果
          if (Math.random() < 0.001) {
            colors[i * 3] *= 1.2
            colors[i * 3 + 1] *= 1.2
            colors[i * 3 + 2] *= 1.2
          }
        }
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
      }

      points.rotation.y += 0.0003
      points.rotation.x += 0.0001
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return shards
}

/**
 * 创建能量脉冲
 */
function createEnergyPulses(scene) {
  const pulseCount = 3
  const pulses = []

  for (let i = 0; i < pulseCount; i++) {
    const geometry = new THREE.SphereGeometry(12 + i * 4, 64, 64)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.55 + i * 0.1, 0.9, 0.7),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const pulse = new THREE.Mesh(geometry, material)
    pulse.userData = {
      baseScale: 1,
      pulseSpeed: 1.5 + i * 0.3,
      phaseOffset: i * Math.PI / 3
    }
    pulses.push(pulse)
    scene.add(pulse)
  }

  const energyPulses = {
    pulses,
    started: false,

    start() {
      this.started = true
      pulses.forEach((pulse, i) => {
        gsap.to(pulse.material, {
          opacity: 0.4,
          duration: 1,
          delay: i * 0.3
        })
      })
    },

    update(time) {
      if (this.started) {
        pulses.forEach((pulse, i) => {
          const scale = pulse.userData.baseScale + Math.sin(time * pulse.userData.pulseSpeed + pulse.userData.phaseOffset) * 0.2
          pulse.scale.set(scale, scale, scale)
          pulse.rotation.y += 0.001 * (i + 1)
        })
      }
    },

    destroy() {
      pulses.forEach(pulse => {
        scene.remove(pulse)
        pulse.geometry.dispose()
        pulse.material.dispose()
      })
    }
  }

  return energyPulses
}

/**
 * 创建螺旋时光隧道
 */
function createTimeTunnel(scene) {
  const tunnelGroup = new THREE.Group()

  const ringCount = 20
  const rings = []

  for (let i = 0; i < ringCount; i++) {
    const geometry = new THREE.TorusGeometry(
      15 + i * 2,
      0.15,
      16,
      100
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.65 + i * 0.015, 0.85, 0.7),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.position.y = (i - ringCount / 2) * 3
    ring.userData = {
      rotationSpeed: 0.015 + i * 0.002,
      index: i
    }
    rings.push(ring)
    tunnelGroup.add(ring)
  }

  // 隧道粒子
  const tunnelParticleCount = 2000
  const tunnelGeometry = new THREE.BufferGeometry()
  const tunnelPositions = new Float32Array(tunnelParticleCount * 3)
  const tunnelColors = new Float32Array(tunnelParticleCount * 3)

  for (let i = 0; i < tunnelParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 15 + Math.random() * 35

    tunnelPositions[i * 3] = Math.cos(angle) * radius
    tunnelPositions[i * 3 + 1] = (Math.random() - 0.5) * 60
    tunnelPositions[i * 3 + 2] = Math.sin(angle) * radius

    const color = new THREE.Color().setHSL(0.65 + Math.random() * 0.2, 0.9, 0.75)
    tunnelColors[i * 3] = color.r
    tunnelColors[i * 3 + 1] = color.g
    tunnelColors[i * 3 + 2] = color.b
  }

  tunnelGeometry.setAttribute('position', new THREE.BufferAttribute(tunnelPositions, 3))
  tunnelGeometry.setAttribute('color', new THREE.BufferAttribute(tunnelColors, 3))

  const tunnelMaterial = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const tunnelPoints = new THREE.Points(tunnelGeometry, tunnelMaterial)
  tunnelGroup.add(tunnelPoints)

  scene.add(tunnelGroup)

  const tunnel = {
    group: tunnelGroup,
    rings,
    points: tunnelPoints,
    spinning: false,

    spin() {
      this.spinning = true
      rings.forEach((ring, i) => {
        gsap.to(ring.material, {
          opacity: 0.7,
          duration: 0.6,
          delay: i * 0.05
        })
      })
      gsap.to(tunnelMaterial, { opacity: 0.85, duration: 1 })
    },

    update(time) {
      if (this.spinning) {
        rings.forEach((ring, i) => {
          ring.rotation.z -= ring.userData.rotationSpeed

          const scale = 1 + Math.sin(time * 2 + i * 0.3) * 0.05
          ring.scale.set(scale, scale, scale)
        })

        const pos = tunnelGeometry.attributes.position.array
        for (let i = 0; i < tunnelParticleCount; i++) {
          const idx = i * 3
          const angle = time * 2 + i * 0.001
          const radius = Math.sqrt(pos[idx] * pos[idx] + pos[idx + 2] * pos[idx + 2])

          pos[idx] = Math.cos(angle) * radius
          pos[idx + 2] = Math.sin(angle) * radius
        }
        tunnelGeometry.attributes.position.needsUpdate = true
      }

      this.group.rotation.y += 0.002
    },

    destroy() {
      scene.remove(tunnelGroup)
      rings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
      tunnelGeometry.dispose()
      tunnelMaterial.dispose()
    }
  }

  return tunnel
}
