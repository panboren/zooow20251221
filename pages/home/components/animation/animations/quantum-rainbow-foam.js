/**
 * 彩虹量子泡沫动画
 * 全新创新特效 - 量子泡沫理论 + 彩虹元素
 * 实现量子涨落、泡沫浮现、彩虹波纹、概率云等超现实效果
 * 基于量子力学中的"时空泡沫"理论
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateRainbowQuantumFoam(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 量子视角
    setupInitialCamera(camera, new THREE.Vector3(0, 70, 110), 130, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'rainbow-quantum-foam' })
      },
      onError,
      '彩虹量子泡沫',
      controls
    )

    // 创建量子泡沫核心 - 彩虹色彩
    const quantumCore = createQuantumCore(scene, {
      coreRadius: 25,
      foamCount: 12
    })

    // 创建彩虹波纹 - 彩虹色彩
    const rainbowRipples = createRainbowRipples(scene, {
      rippleCount: 10,
      maxRadius: 140
    })

    // 创建概率云 - 彩虹色彩
    const probabilityClouds = createProbabilityClouds(scene, {
      cloudCount: 15,
      particleCount: 8000
    })

    // 创建时空泡沫 - 彩虹色彩
    const spacetimeFoam = createSpacetimeFoam(scene, {
      foamCellCount: 20,
      cellSize: 15
    })

    // 阶段1: 量子涨落 - 泡沫诞生
    tl.to(camera.position, {
      x: 30,
      y: 60,
      z: 85,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子涨落错误'
      )
    })

    tl.call(() => {
      quantumCore.fluctuate()
      spacetimeFoam.birth()
    }, null, 1.5)

    // 阶段2: 泡沫浮现 - 彩虹绽放
    tl.to(camera.position, {
      x: 20,
      y: 45,
      z: 65,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '泡沫浮现错误'
      )
    }, 3)

    tl.call(() => {
      rainbowRipples.bloom()
      quantumCore.superposition()
    }, null, 4)

    // 量子干涉效果
    tl.to(camera, {
      fov: 120,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '量子干涉错误'
      )
    }, 4)

    // 阶段3: 彩虹波纹 - 波动扩散
    tl.to(camera.position, {
      x: 12,
      y: 30,
      z: 45,
      duration: 1.8,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '彩虹波纹错误'
      )
    }, 4.6)

    tl.call(() => {
      rainbowRipples.expand()
      probabilityClouds.materialize()
    }, null, 5.5)

    // 波纹扩散效果
    tl.to(camera, {
      fov: 170,
      duration: 0.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '波纹扩散错误'
      )
    }, 5.5)

    // 阶段4: 概率云 - 不确定性爆发
    tl.to(camera.position, {
      x: 6,
      y: 18,
      z: 25,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '概率云错误'
      )
    }, 6)

    tl.call(() => {
      probabilityClouds.uncertainty()
      spacetimeFoam.expand()
    }, null, 7.5)

    // 量子纠缠效果
    tl.to(probabilityClouds.particles.scale, {
      x: 3.5,
      y: 0.8,
      z: 3.5,
      duration: 0.5,
      ease: 'power2.in'
    }, 7.5)

    // 阶段5: 时空泡沫 - 泡沫融合
    tl.to(camera.position, {
      x: 3,
      y: 10,
      z: 12,
      duration: 2.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时空泡沫错误'
      )
    }, 8.2)

    tl.call(() => {
      spacetimeFoam.fuse()
      quantumCore.entangle()
      rainbowRipples.resonate()
    }, null, 10)

    // 泡沫融合效果
    tl.to(camera, {
      fov: 130,
      duration: 0.4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '泡沫融合错误'
      )
    }, 10)

    // 阶段6: 量子稳定 - 观察者效应
    tl.to(camera.position, {
      x: 1.5,
      y: 5,
      z: 6,
      duration: 3,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子稳定错误'
      )
    }, 10.4)

    // 阶段7: 波函数坍缩 - 最终着陆
    tl.call(() => {
      quantumCore.collapse()
      probabilityClouds.observe()
      spacetimeFoam.dissipate()
      rainbowRipples.fade()
    }, null, 13.5)

    tl.to(camera.position, {
      x: 0.02,
      y: 0.02,
      z: 0.02,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '波函数坍缩错误'
      )
    }, 13.5)

    tl.to(camera, {
      fov: 75,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 13.5)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      quantumCore.update(time)
      rainbowRipples.update(time)
      probabilityClouds.update(time)
      spacetimeFoam.update(time)
    }

    // 清理函数
    const cleanup = () => {
      quantumCore.destroy()
      rainbowRipples.destroy()
      probabilityClouds.destroy()
      spacetimeFoam.destroy()
    }

    tl.call(cleanup, null, 15.5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建量子泡沫核心 - 彩虹色彩
 */
function createQuantumCore(scene, options) {
  const { coreRadius = 25, foamCount = 12 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 彩虹颜色
  const rainbowColors = [
    new THREE.Color(0xFF0000), // 红
    new THREE.Color(0xFF7F00), // 橙
    new THREE.Color(0xFFFF00), // 黄
    new THREE.Color(0x00FF00), // 绿
    new THREE.Color(0x0000FF), // 蓝
    new THREE.Color(0x4B0082), // 靛
    new THREE.Color(0x9400D3), // 紫
    new THREE.Color(0xFF69B4), // 粉
    new THREE.Color(0x00FFFF), // 青
    new THREE.Color(0xFF1493), // 深粉
    new THREE.Color(0x00FF7F), // 青绿
    new THREE.Color(0xFFD700)  // 金黄
  ]

  const foams = []
  const foamMaterials = []
  const orbitRings = []

  for (let i = 0; i < foamCount; i++) {
    // 量子泡沫球体
    const geometry = new THREE.IcosahedronGeometry(coreRadius - i * 1.8, 2)
    const material = new THREE.MeshBasicMaterial({
      color: rainbowColors[i],
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })
    const foam = new THREE.Mesh(geometry, material)
    group.add(foam)
    foams.push(foam)
    foamMaterials.push(material)

    // 轨道环
    const orbitRadius = coreRadius + i * 8
    const orbitGeometry = new THREE.TorusGeometry(orbitRadius, 0.5, 8, 64)
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: rainbowColors[i],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    })
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
    orbit.rotation.x = Math.PI / 2
    group.add(orbit)
    orbitRings.push(orbit)
  }

  let isActive = false

  return {
    group,
    fluctuate() {
      isActive = true
      foams.forEach((foam, i) => {
        gsap.to(foam.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 2,
          ease: 'elastic.out(1, 0.5)',
          delay: i * 0.15
        })
      })
    },
    superposition() {
      foams.forEach((foam, i) => {
        gsap.to(foam.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 1.2,
          ease: 'power2.in',
          delay: i * 0.05
        })
        gsap.to(foamMaterials[i], {
          opacity: 0.8,
          duration: 1
        })
      })
    },
    entangle() {
      orbitRings.forEach((orbit, i) => {
        gsap.to(orbit.rotation, {
          z: orbit.rotation.z + Math.PI * 2,
          duration: 2.5,
          ease: 'power2.inOut',
          delay: i * 0.08
        })
      })
    },
    collapse() {
      isActive = false
      foams.forEach((foam, i) => {
        gsap.to(foam.scale, {
          x: 0.15,
          y: 0.15,
          z: 0.15,
          duration: 2,
          ease: 'power2.in',
          delay: i * 0.05
        })
        gsap.to(foamMaterials[i], {
          opacity: 0,
          duration: 1.5
        })
      })
      orbitRings.forEach(orbit => {
        gsap.to(orbit.material, {
          opacity: 0,
          duration: 1.8
        })
      })
    },
    update(time) {
      if (isActive) {
        foams.forEach((foam, i) => {
          foam.rotation.x = time * (0.3 + i * 0.05)
          foam.rotation.y = time * (0.4 + i * 0.08)
        })
        orbitRings.forEach((orbit, i) => {
          orbit.rotation.x = Math.PI / 2 + Math.sin(time * 2 + i) * 0.2
          orbit.rotation.y = time * (0.2 + i * 0.03)
        })
        group.rotation.z = Math.sin(time * 0.3) * 0.15
      }
    },
    destroy() {
      scene.remove(group)
      foams.forEach(foam => {
        foam.geometry.dispose()
        foam.material.dispose()
      })
      orbitRings.forEach(orbit => {
        orbit.geometry.dispose()
        orbit.material.dispose()
      })
    }
  }
}

/**
 * 创建彩虹波纹 - 彩虹色彩
 */
function createRainbowRipples(scene, options) {
  const { rippleCount = 10, maxRadius = 140 } = options

  const group = new THREE.Group()
  scene.add(group)

  const ripples = []
  const rippleMaterials = []

  // 彩虹颜色
  const rainbowColors = [
    new THREE.Color(0xFF0000), // 红
    new THREE.Color(0xFF7F00), // 橙
    new THREE.Color(0xFFFF00), // 黄
    new THREE.Color(0x00FF00), // 绿
    new THREE.Color(0x0000FF), // 蓝
    new THREE.Color(0x4B0082), // 靛
    new THREE.Color(0x9400D3), // 紫
    new THREE.Color(0xFF69B4), // 粉
    new THREE.Color(0x00FFFF), // 青
    new THREE.Color(0xFF1493)  // 深粉
  ]

  for (let i = 0; i < rippleCount; i++) {
    const radius = maxRadius / 3 + i * 12
    const geometry = new THREE.RingGeometry(radius - 2, radius, 128)
    const material = new THREE.MeshBasicMaterial({
      color: rainbowColors[i],
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    group.add(ripple)
    ripples.push(ripple)
    rippleMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    bloom() {
      isActive = true
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 2,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.12
        })
        gsap.to(rippleMaterials[i], {
          opacity: 0.8,
          duration: 1.5,
          delay: i * 0.12
        })
      })
    },
    expand() {
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 3,
          y: 3,
          z: 3,
          duration: 1.5,
          ease: 'power3.out'
        })
      })
    },
    resonate() {
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 2.5 + Math.random() * 0.5,
          y: 2.5 + Math.random() * 0.5,
          z: 2.5 + Math.random() * 0.5,
          duration: 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 3
        })
      })
    },
    fade() {
      isActive = false
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.scale, {
          x: 0.2,
          y: 0.2,
          z: 0.2,
          duration: 2,
          ease: 'power2.out'
        })
        gsap.to(rippleMaterials[i], {
          opacity: 0,
          duration: 1.8
        })
      })
    },
    update(time) {
      if (isActive) {
        ripples.forEach((ripple, i) => {
          ripple.rotation.z += 0.02 + i * 0.005
          const pulse = Math.sin(time * 4 + i * 0.5) * 0.1 + 1
          ripple.scale.setScalar(pulse * (i > 0 ? 1 : 1.5))
        })
        group.rotation.x = Math.sin(time * 0.4) * 0.1
      }
    },
    destroy() {
      scene.remove(group)
      ripples.forEach(ripple => {
        ripple.geometry.dispose()
        ripple.material.dispose()
      })
    }
  }
}

/**
 * 创建概率云 - 彩虹色彩
 */
function createProbabilityClouds(scene, options) {
  const { cloudCount = 15, particleCount = 8000 } = options

  const group = new THREE.Group()
  scene.add(group)

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)

  // 彩虹颜色
  const rainbowColors = [
    new THREE.Color(0xFF0000), // 红
    new THREE.Color(0xFF7F00), // 橙
    new THREE.Color(0xFFFF00), // 黄
    new THREE.Color(0x00FF00), // 绿
    new THREE.Color(0x0000FF), // 蓝
    new THREE.Color(0x4B0082), // 靛
    new THREE.Color(0x9400D3), // 紫
    new THREE.Color(0xFF69B4), // 粉
    new THREE.Color(0x00FFFF), // 青
    new THREE.Color(0xFF1493), // 深粉
    new THREE.Color(0x00FF7F), // 青绿
    new THREE.Color(0xFFD700), // 金黄
    new THREE.Color(0xFF6347), // 番茄红
    new THREE.Color(0x7B68EE), // 中紫色
    new THREE.Color(0x00CED1)  // 暗青色
  ]

  for (let i = 0; i < particleCount; i++) {
    const cloudIndex = i % cloudCount
    const angle = (cloudIndex / cloudCount) * Math.PI * 2
    const radius = 30 + Math.random() * 50
    const y = (Math.random() - 0.5) * 60
    const z = Math.random() * 20 - 10

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(angle) * radius + z

    const color = rainbowColors[cloudIndex]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.3
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.3
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3

    phases[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 3,
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
    materialize() {
      speedMultiplier = 5
      gsap.to(material, {
        opacity: 0.8,
        duration: 1.5
      })
    },
    uncertainty() {
      speedMultiplier = 15
    },
    observe() {
      speedMultiplier = 1
      gsap.to(particles.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: 'power2.out'
      })
      gsap.to(material, {
        opacity: 0,
        duration: 1.5
      })
    },
    update(time) {
      const positions = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * speedMultiplier
        positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier
        positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier

        // 量子涨落
        const phase = phases[i] + time * 2
        positions[i * 3] += Math.sin(phase) * 0.1
        positions[i * 3 + 1] += Math.cos(phase) * 0.1

        // 边界循环
        const dist = Math.sqrt(
          positions[i * 3] ** 2 +
                    positions[i * 3 + 1] ** 2 +
                    positions[i * 3 + 2] ** 2
        )
        if (dist > 120) {
          positions[i * 3] *= 0.05
          positions[i * 3 + 1] *= 0.05
          positions[i * 3 + 2] *= 0.05
        }
      }
      geometry.attributes.position.needsUpdate = true
      group.rotation.y = time * 0.08
      group.rotation.x = Math.sin(time * 0.3) * 0.1
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建时空泡沫 - 彩虹色彩
 */
function createSpacetimeFoam(scene, options) {
  const { foamCellCount = 20, cellSize = 15 } = options

  const group = new THREE.Group()
  scene.add(group)

  const cells = []
  const cellMaterials = []

  // 彩虹颜色
  const rainbowColors = [
    new THREE.Color(0xFF0000), // 红
    new THREE.Color(0xFF7F00), // 橙
    new THREE.Color(0xFFFF00), // 黄
    new THREE.Color(0x00FF00), // 绿
    new THREE.Color(0x0000FF), // 蓝
    new THREE.Color(0x4B0082), // 靛
    new THREE.Color(0x9400D3), // 紫
    new THREE.Color(0xFF69B4), // 粉
    new THREE.Color(0x00FFFF), // 青
    new THREE.Color(0xFF1493), // 深粉
    new THREE.Color(0x00FF7F), // 青绿
    new THREE.Color(0xFFD700), // 金黄
    new THREE.Color(0xFF6347), // 番茄红
    new THREE.Color(0x7B68EE), // 中紫色
    new THREE.Color(0x00CED1), // 暗青色
    new THREE.Color(0xFF6B6B), // 浅红
    new THREE.Color(0x9ACD32), // 黄绿
    new THREE.Color(0x20B2AA), // 浅海蓝
    new THREE.Color(0xFF00FF), // 品红
    new THREE.Color(0xFFFFE0)  // 淡黄
  ]

  for (let i = 0; i < foamCellCount; i++) {
    const angle = (i / foamCellCount) * Math.PI * 2
    const radius = 60 + Math.random() * 40
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize)
    const material = new THREE.MeshBasicMaterial({
      color: rainbowColors[i % rainbowColors.length],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })
    const cell = new THREE.Mesh(geometry, material)
    cell.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 80,
      Math.sin(angle) * radius
    )
    group.add(cell)
    cells.push(cell)
    cellMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    birth() {
      isActive = true
      cells.forEach((cell, i) => {
        cell.scale.setScalar(0.01)
        gsap.to(cell.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 2.5,
          ease: 'elastic.out(1, 0.3)',
          delay: i * 0.1
        })
      })
    },
    expand() {
      cells.forEach((cell, i) => {
        gsap.to(cell.scale, {
          x: 1.8,
          y: 1.8,
          z: 1.8,
          duration: 1.5,
          ease: 'power3.out',
          delay: i * 0.05
        })
      })
    },
    fuse() {
      cells.forEach((cell, i) => {
        gsap.to(cell.rotation, {
          x: cell.rotation.x + Math.PI * 2,
          y: cell.rotation.y + Math.PI * 2,
          z: cell.rotation.z + Math.PI * 2,
          duration: 3,
          ease: 'power2.inOut',
          delay: i * 0.08
        })
      })
    },
    dissipate() {
      isActive = false
      cells.forEach((cell, i) => {
        gsap.to(cell.scale, {
          x: 0.05,
          y: 0.05,
          z: 0.05,
          duration: 2,
          ease: 'power2.in',
          delay: i * 0.03
        })
        gsap.to(cellMaterials[i], {
          opacity: 0,
          duration: 1.5
        })
      })
    },
    update(time) {
      if (isActive) {
        cells.forEach((cell, i) => {
          cell.rotation.x += 0.02 + i * 0.003
          cell.rotation.y += 0.03 + i * 0.005
          const pulse = Math.sin(time * 5 + i * 0.5) * 0.15 + 1
          cell.scale.setScalar(pulse)
        })
        group.rotation.z = time * 0.05
      }
    },
    destroy() {
      scene.remove(group)
      cells.forEach(cell => {
        cell.geometry.dispose()
        cell.material.dispose()
      })
    }
  }
}
