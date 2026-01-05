/**
 * 星云能量爆发动画
 * 全新炸裂特效 - 青春洋溢、活力四射
 * 实现能量积累、星云爆发、能量冲浪、时空漩涡等震撼效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateNebulaEnergyBurst(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 远景视角
    setupInitialCamera(camera, new THREE.Vector3(0, 60, 100), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'nebula-energy-burst' })
      },
      onError,
      '星云能量爆发',
      controls
    )

    // 创建能量核心 - 青春色彩
    const energyCore = createEnergyCore(scene, {
      coreRadius: 20,
      coreCount: 6
    })

    // 创建星云光环 - 青春色彩
    const nebulaRings = createNebulaRings(scene, {
      ringCount: 8,
      maxRadius: 120
    })

    // 创建能量粒子风暴 - 青春色彩
    const particleStorm = createParticleStorm(scene, {
      particleCount: 10000,
      stormRadius: 150
    })

    // 创建时空漩涡 - 青春色彩
    const spacetimeVortex = createSpacetimeVortex(scene, {
      vortexRadius: 100,
      spiralCount: 6
    })

    // 阶段1: 能量积累 - 核心苏醒
    tl.to(camera.position, {
      x: 25,
      y: 50,
      z: 70,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '能量积累错误'
      )
    })

    tl.call(() => {
      energyCore.wakeUp()
      nebulaRings.pulseStart()
    }, null, 1)

    // 阶段2: 能量汇聚 - 光环激活
    tl.to(camera.position, {
      x: 15,
      y: 35,
      z: 50,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '能量汇聚错误'
      )
    }, 2.5)

    tl.call(() => {
      nebulaRings.activate()
      energyCore.chargeUp()
    }, null, 3.5)

    // 能量波动效果
    tl.to(camera, {
      fov: 100,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '能量波动错误'
      )
    }, 3.5)

    // 阶段3: 能量爆发 - 星云炸裂
    tl.to(camera.position, {
      x: 8,
      y: 20,
      z: 30,
      duration: 1.5,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '能量爆发错误'
      )
    }, 4)

    tl.call(() => {
      energyCore.burst()
      nebulaRings.explode()
      particleStorm.activate()
    }, null, 5)

    // 能量冲击波
    tl.to(camera, {
      fov: 160,
      duration: 0.4,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '能量冲击波错误'
      )
    }, 5)

    // 阶段4: 能量冲浪 - 粒子狂潮
    tl.to(camera.position, {
      x: 4,
      y: 10,
      z: 15,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '能量冲浪错误'
      )
    }, 5.4)

    tl.call(() => {
      particleStorm.maxSpeed()
      spacetimeVortex.activate()
    }, null, 7)

    // 粒子速度线效果
    tl.to(particleStorm.particles.scale, {
      x: 4,
      y: 1,
      z: 4,
      duration: 0.6,
      ease: 'power2.in'
    }, 7)

    // 阶段5: 时空漩涡 - 进入星云
    tl.to(camera.position, {
      x: 2,
      y: 5,
      z: 8,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时空漩涡错误'
      )
    }, 7.5)

    tl.call(() => {
      spacetimeVortex.maxPower()
      nebulaRings.spiral()
    }, null, 9)

    // 漩涡旋转效果
    tl.to(camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '漩涡旋转错误'
      )
    }, 9)

    // 阶段6: 能量稳定 - 漂浮在星云中
    tl.to(camera.position, {
      x: 1,
      y: 2.5,
      z: 4,
      duration: 2.5,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '能量稳定错误'
      )
    }, 9.5)

    // 阶段7: 能量释放 - 最终着陆
    tl.call(() => {
      energyCore.stabilize()
      particleStorm.settle()
      spacetimeVortex.deactivate()
    }, null, 12)

    tl.to(camera.position, {
      x: 0.02,
      y: 0.02,
      z: 0.02,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终着陆错误'
      )
    }, 12)

    tl.to(camera, {
      fov: 75,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 12)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      energyCore.update(time)
      nebulaRings.update(time)
      particleStorm.update(time)
      spacetimeVortex.update(time)
    }

    // 清理函数
    const cleanup = () => {
      energyCore.destroy()
      nebulaRings.destroy()
      particleStorm.destroy()
      spacetimeVortex.destroy()
    }

    tl.call(cleanup, null, 14)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建能量核心 - 青春色彩
 */
function createEnergyCore(scene, options) {
  const { coreRadius = 20, coreCount = 6 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 核心颜色 - 青春色彩
  const coreColors = [
    new THREE.Color(0xFF1493), // 深粉色
    new THREE.Color(0xFF69B4), // 热粉色
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFFFF00), // 黄色
    new THREE.Color(0xFF00FF)  // 品红
  ]

  const cores = []
  const coreMaterials = []
  const glowRings = []

  for (let i = 0; i < coreCount; i++) {
    // 能量球体
    const geometry = new THREE.SphereGeometry(coreRadius - i * 3, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: coreColors[i],
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    })
    const core = new THREE.Mesh(geometry, material)
    group.add(core)
    cores.push(core)
    coreMaterials.push(material)

    // 光环效果
    const ringGeometry = new THREE.RingGeometry(coreRadius - i * 3, coreRadius - i * 3 + 2, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: coreColors[i],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    glowRings.push(ring)
  }

  let isActive = false

  return {
    group,
    wakeUp() {
      isActive = true
      cores.forEach((core, i) => {
        gsap.to(core.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1.5,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.1
        })
        gsap.to(coreMaterials[i], {
          opacity: 0.7,
          duration: 1,
          delay: i * 0.1
        })
      })
    },
    chargeUp() {
      cores.forEach((core, i) => {
        gsap.to(core.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 1,
          ease: 'power2.in'
        })
      })
    },
    burst() {
      cores.forEach((core, i) => {
        gsap.to(core.scale, {
          x: 4,
          y: 4,
          z: 4,
          duration: 0.4,
          ease: 'power4.in'
        })
        gsap.to(coreMaterials[i], {
          opacity: 1,
          duration: 0.2
        })
      })
      glowRings.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 3,
          y: 3,
          z: 3,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.05
        })
      })
    },
    stabilize() {
      isActive = false
      cores.forEach((core, i) => {
        gsap.to(core.scale, {
          x: 0.2,
          y: 0.2,
          z: 0.2,
          duration: 1.5,
          ease: 'power2.in'
        })
        gsap.to(coreMaterials[i], {
          opacity: 0,
          duration: 1
        })
      })
      glowRings.forEach(ring => {
        gsap.to(ring.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 1,
          ease: 'power2.out'
        })
      })
    },
    update(time) {
      if (isActive) {
        cores.forEach((core, i) => {
          const pulse = Math.sin(time * 8 + i) * 0.3 + 1
          core.rotation.y = time * (0.3 + i * 0.1)
        })
        glowRings.forEach((ring, i) => {
          ring.rotation.z = time * (0.5 + i * 0.1)
          ring.scale.setScalar(Math.sin(time * 3 + i) * 0.2 + 1)
        })
        group.rotation.y = time * 0.15
      }
    },
    destroy() {
      scene.remove(group)
      cores.forEach(core => {
        core.geometry.dispose()
        core.material.dispose()
      })
      glowRings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
    }
  }
}

/**
 * 创建星云光环 - 青春色彩
 */
function createNebulaRings(scene, options) {
  const { ringCount = 8, maxRadius = 120 } = options

  const group = new THREE.Group()
  scene.add(group)

  const rings = []
  const ringMaterials = []

  // 光环颜色 - 青春色彩
  const ringColors = [
    new THREE.Color(0xFF1493), // 深粉色
    new THREE.Color(0xFF69B4), // 热粉色
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFFFF00), // 黄色
    new THREE.Color(0xFF00FF), // 品红
    new THREE.Color(0x00BFFF), // 深天蓝
    new THREE.Color(0x9370DB)  // 中紫色
  ]

  for (let i = 0; i < ringCount; i++) {
    const radius = maxRadius / 2 + i * 15
    const geometry = new THREE.TorusGeometry(radius, 2, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: ringColors[i],
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2 + Math.random() * 0.5
    ring.rotation.y = Math.random() * Math.PI
    group.add(ring)
    rings.push(ring)
    ringMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    pulseStart() {
      rings.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 1.5,
          ease: 'sine.inOut',
          delay: i * 0.1
        })
      })
    },
    activate() {
      isActive = true
      rings.forEach((ring, i) => {
        gsap.to(ringMaterials[i], {
          opacity: 0.8,
          duration: 1
        })
        gsap.to(ring.rotation, {
          y: ring.rotation.y + Math.PI,
          duration: 2,
          ease: 'power2.out'
        })
      })
    },
    explode() {
      rings.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 0.5,
          ease: 'power3.out'
        })
      })
    },
    spiral() {
      rings.forEach((ring, i) => {
        gsap.to(ring.rotation, {
          x: ring.rotation.x + Math.PI * 2,
          y: ring.rotation.y + Math.PI * 2,
          duration: 3,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (isActive) {
        rings.forEach((ring, i) => {
          ring.rotation.x += 0.02 + i * 0.005
          ring.rotation.y += 0.01 + i * 0.003
        })
        group.rotation.z = Math.sin(time * 0.5) * 0.1
      }
    },
    destroy() {
      scene.remove(group)
      rings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
    }
  }
}

/**
 * 创建能量粒子风暴 - 青春色彩
 */
function createParticleStorm(scene, options) {
  const { particleCount = 10000, stormRadius = 150 } = options

  const group = new THREE.Group()
  scene.add(group)

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  // 粒子颜色 - 青春色彩
  const particleColors = [
    new THREE.Color(0xFF1493), // 深粉色
    new THREE.Color(0xFF69B4), // 热粉色
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFFFF00), // 黄色
    new THREE.Color(0xFF00FF), // 品红
    new THREE.Color(0x00BFFF)  // 深天蓝
  ]

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * stormRadius
    const y = (Math.random() - 0.5) * stormRadius * 0.5

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const color = particleColors[Math.floor(Math.random() * particleColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.5
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  let speedMultiplier = 1

  return {
    group,
    particles,
    activate() {
      speedMultiplier = 8
    },
    maxSpeed() {
      speedMultiplier = 20
    },
    settle() {
      speedMultiplier = 1
      gsap.to(particles.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: 'power2.out'
      })
    },
    update(time) {
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * speedMultiplier
        positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier
        positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier

        // 循环使用粒子
        const dist = Math.sqrt(
          positions[i * 3] ** 2 +
                    positions[i * 3 + 1] ** 2 +
                    positions[i * 3 + 2] ** 2
        )
        if (dist > stormRadius) {
          positions[i * 3] *= 0.1
          positions[i * 3 + 1] *= 0.1
          positions[i * 3 + 2] *= 0.1
        }
      }
      geometry.attributes.position.needsUpdate = true
      group.rotation.y = time * 0.1
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建时空漩涡 - 青春色彩
 */
function createSpacetimeVortex(scene, options) {
  const { vortexRadius = 100, spiralCount = 6 } = options

  const group = new THREE.Group()
  scene.add(group)

  const spirals = []
  const spiralMaterials = []

  // 漩涡颜色 - 青春色彩
  const vortexColors = [
    new THREE.Color(0xFF1493), // 深粉色
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFFFF00), // 黄色
    new THREE.Color(0xFF00FF), // 品红
    new THREE.Color(0xFF69B4)  // 热粉色
  ]

  for (let i = 0; i < spiralCount; i++) {
    const points = []
    for (let j = 0; j <= 100; j++) {
      const t = j / 100
      const angle = t * Math.PI * 4 + (i / spiralCount) * Math.PI * 2
      const radius = vortexRadius * (1 - t) * (0.5 + Math.sin(t * Math.PI) * 0.5)
      const x = Math.cos(angle) * radius
      const y = Math.sin(t * Math.PI * 2) * radius * 0.3
      const z = Math.sin(angle) * radius
      points.push(new THREE.Vector3(x, y, z))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: vortexColors[i],
      transparent: true,
      opacity: 0.5,
      linewidth: 2
    })
    const spiral = new THREE.Line(geometry, material)
    group.add(spiral)
    spirals.push(spiral)
    spiralMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    activate() {
      isActive = true
      spirals.forEach((spiral, i) => {
        gsap.to(spiralMaterials[i], {
          opacity: 0.8,
          duration: 1
        })
      })
    },
    maxPower() {
      spirals.forEach((spiral, i) => {
        gsap.to(spiral.rotation, {
          x: spiral.rotation.x + Math.PI * 2,
          duration: 2,
          ease: 'power2.in'
        })
      })
    },
    deactivate() {
      isActive = false
      spirals.forEach((spiral, i) => {
        gsap.to(spiralMaterials[i], {
          opacity: 0,
          duration: 1.5
        })
      })
    },
    update(time) {
      if (isActive) {
        spirals.forEach((spiral, i) => {
          spiral.rotation.y += 0.05 + i * 0.01
          spiral.rotation.x += 0.03 + i * 0.005
        })
        group.rotation.y = time * 0.2
      }
    },
    destroy() {
      scene.remove(group)
      spirals.forEach(spiral => {
        spiral.geometry.dispose()
        spiral.material.dispose()
      })
    }
  }
}
