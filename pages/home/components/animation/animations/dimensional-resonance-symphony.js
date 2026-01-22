/**
 * 维度共鸣交响曲特效
 * 全新炸裂特效 - 融合弦理论与多重宇宙概念
 * 实现11维空间可视化、弦振动、维度共鸣、时空折叠等超现实效果
 * 技术亮点：
 * - 卡鲁扎-克莱因理论可视化
 * - 额外维度紧致化
 * - 弦理论振模式
 * - 多元宇宙膜碰撞
 * - 高维投影到3D空间
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateDimensionalResonance(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 11维视角
    setupInitialCamera(camera, new THREE.Vector3(0, 80, 140), 160, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dimensional-resonance' })
      },
      onError,
      '维度共鸣交响曲',
      controls
    )

    // 创建11维空间核心
    const dimensionalCore = createDimensionalCore(scene, {
      dimensionCount: 11,
      stringCount: 5000,
      resonanceCount: 8
    })

    // 创建额外维度紧致化空间
    const compactDimensions = createCompactDimensions(scene, {
      compactCount: 7,
      manifoldRadius: 50
    })

    // 创建弦理论振动系统
    const stringTheory = createStringTheorySystem(scene, {
      stringCount: 8000,
      vibrationMode: 12,
      braneCount: 5
    })

    // 创建多元宇宙膜
    const multiverse = createMultiverse(scene, {
      universeCount: 6,
      braneSeparation: 100
    })

    // 创建共鸣波纹
    const resonanceWaves = createResonanceWaves(scene, {
      waveCount: 15,
      maxRadius: 180
    })

    // 阶段1: 维度苏醒 - 11维展开
    tl.to(camera.position, {
      x: 30,
      y: 70,
      z: 100,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '维度苏醒错误'
      )
    })

    tl.call(() => {
      dimensionalCore.awaken()
      compactDimensions.expand()
    }, null, 1.5)

    // 阶段2: 额外维度 - 紧致化展开
    tl.to(camera.position, {
      x: 20,
      y: 50,
      z: 70,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '额外维度错误'
      )
    }, 3)

    tl.call(() => {
      compactDimensions.activate()
      stringTheory.startVibration()
    }, null, 4.5)

    // 维度扭曲效果
    tl.to(camera, {
      fov: 110,
      duration: 0.7,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '维度扭曲错误'
      )
    }, 4.5)

    // 阶段3: 弦振动 - 粒子共振
    tl.to(camera.position, {
      x: 12,
      y: 35,
      z: 50,
      duration: 1.8,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '弦振动错误'
      )
    }, 5.2)

    tl.call(() => {
      stringTheory.resonance()
      multiverse.appear()
    }, null, 6.5)

    // 共振爆炸效果
    tl.to(camera, {
      fov: 170,
      duration: 0.4,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '共振爆炸错误'
      )
    }, 6.5)

    // 阶段4: 多元宇宙 - 膜碰撞
    tl.to(camera.position, {
      x: 6,
      y: 20,
      z: 28,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '多元宇宙错误'
      )
    }, 6.9)

    tl.call(() => {
      multiverse.branesCollide()
      resonanceWaves.expand()
    }, null, 8)

    // 膜碰撞冲击波
    tl.to(stringTheory.particles.scale, {
      x: 5,
      y: 0.5,
      z: 5,
      duration: 0.5,
      ease: 'power2.in'
    }, 8)

    // 阶段5: 维度共鸣 - 11维合一
    tl.to(camera.position, {
      x: 3,
      y: 10,
      z: 14,
      duration: 2.2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '维度共鸣错误'
      )
    }, 8.5)

    tl.call(() => {
      dimensionalCore.singularity()
      resonanceWaves.harmonic()
      stringTheory.entangle()
    }, null, 10.5)

    // 维度折叠效果
    tl.to(camera, {
      fov: 140,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '维度折叠错误'
      )
    }, 10.5)

    // 阶段6: 时空稳定 - 观察者效应
    tl.to(camera.position, {
      x: 1.5,
      y: 5,
      z: 7,
      duration: 2.8,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时空稳定错误'
      )
    }, 11)

    // 阶段7: 维度坍缩 - 波函数坍缩
    tl.call(() => {
      dimensionalCore.collapse()
      stringTheory.observe()
      multiverse.merge()
      resonanceWaves.fade()
    }, null, 14)

    tl.to(camera.position, {
      x: 0.02,
      y: 0.02,
      z: 0.02,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '波函数坍缩错误'
      )
    }, 14)

    tl.to(camera, {
      fov: 75,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 14)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      dimensionalCore.update(time)
      compactDimensions.update(time)
      stringTheory.update(time)
      multiverse.update(time)
      resonanceWaves.update(time)
    }

    // 清理函数
    const cleanup = () => {
      dimensionalCore.destroy()
      compactDimensions.destroy()
      stringTheory.destroy()
      multiverse.destroy()
      resonanceWaves.destroy()
    }

    tl.call(cleanup, null, 16)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建11维空间核心
 * 基于弦理论 - 11维超引力理论
 */
function createDimensionalCore(scene, options) {
  const { dimensionCount = 11, stringCount = 5000, resonanceCount = 8 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 维度颜色 - 基于11维理论
  const dimensionColors = [
    new THREE.Color(0xFF0000), // 1维 - 时间
    new THREE.Color(0xFF7F00), // 2维
    new THREE.Color(0xFFFF00), // 3维
    new THREE.Color(0x00FF00), // 4维
    new THREE.Color(0x0000FF), // 5维
    new THREE.Color(0x4B0082), // 6维
    new THREE.Color(0x9400D3), // 7维
    new THREE.Color(0xFF69B4), // 8维
    new THREE.Color(0x00FFFF), // 9维
    new THREE.Color(0xFF1493), // 10维
    new THREE.Color(0xFFFFFF)  // 11维 - 奇点
  ]

  const dimensions = []
  const dimensionSpheres = []
  const dimensionRings = []

  for (let i = 0; i < dimensionCount; i++) {
    // 维度球体
    const radius = 30 - i * 2.5
    const geometry = new THREE.IcosahedronGeometry(radius, 3)
    const material = new THREE.MeshBasicMaterial({
      color: dimensionColors[i],
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })
    const sphere = new THREE.Mesh(geometry, material)
    group.add(sphere)
    dimensions.push(sphere)
    dimensionSpheres.push(material)

    // 维度环
    const ringRadius = 35 + i * 10
    const ringGeometry = new THREE.TorusGeometry(ringRadius, 0.5, 8, 128)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: dimensionColors[i],
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    dimensionRings.push(ring)
  }

  // 弦粒子系统
  const stringGeometry = new THREE.BufferGeometry()
  const stringPositions = new Float32Array(stringCount * 3)
  const stringColors = new Float32Array(stringCount * 3)
  const stringPhases = new Float32Array(stringCount)
  const stringFrequencies = new Float32Array(stringCount)

  for (let i = 0; i < stringCount; i++) {
    const dimensionIndex = i % dimensionCount
    const angle = Math.random() * Math.PI * 2
    const radius = 10 + Math.random() * 30
    const phi = Math.random() * Math.PI

    stringPositions[i * 3] = radius * Math.sin(phi) * Math.cos(angle)
    stringPositions[i * 3 + 1] = radius * Math.cos(phi)
    stringPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(angle)

    const color = dimensionColors[dimensionIndex]
    stringColors[i * 3] = color.r
    stringColors[i * 3 + 1] = color.g
    stringColors[i * 3 + 2] = color.b

    stringPhases[i] = Math.random() * Math.PI * 2
    stringFrequencies[i] = 1 + Math.random() * 5
  }

  stringGeometry.setAttribute('position', new THREE.BufferAttribute(stringPositions, 3))
  stringGeometry.setAttribute('color', new THREE.BufferAttribute(stringColors, 3))

  const stringMaterial = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const stringSystem = new THREE.Points(stringGeometry, stringMaterial)
  group.add(stringSystem)

  // 共鸣核心
  const coreGeometry = new THREE.SphereGeometry(8, 64, 64)
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x88aaff,
    shininess: 150,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  })
  const resonanceCore = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(resonanceCore)

  // 共鸣光环
  const resonanceRingsArray = []
  for (let i = 0; i < resonanceCount; i++) {
    const ringRadius = 12 + i * 8
    const resonanceRingGeometry = new THREE.TorusGeometry(ringRadius, 0.8, 16, 100)
    const resonanceRingMaterial = new THREE.MeshBasicMaterial({
      color: dimensionColors[i % dimensionCount],
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
    const resonanceRing = new THREE.Mesh(resonanceRingGeometry, resonanceRingMaterial)
    resonanceRing.rotation.x = Math.PI / 2
    group.add(resonanceRing)
    resonanceRingsArray.push(resonanceRing)
  }

  let isActive = false

  return {
    group,
    stringSystem,
    awaken() {
      isActive = true
      dimensions.forEach((dim, i) => {
        gsap.to(dim.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 2,
          ease: 'elastic.out(1, 0.5)',
          delay: i * 0.08
        })
        gsap.to(dimensionSpheres[i], {
          opacity: 0.4,
          duration: 1.5,
          delay: i * 0.08
        })
      })
      resonanceRingsArray.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 1.8,
          y: 1.8,
          z: 1.8,
          duration: 1.5,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.1
        })
      })
    },
    singularity() {
      dimensions.forEach((dim, i) => {
        gsap.to(dim.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 0.6,
          ease: 'power4.in',
          delay: (dimensionCount - 1 - i) * 0.05
        })
      })
      gsap.to(resonanceCore.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      })
      gsap.to(coreMaterial, {
        emissive: 0xffffff,
        duration: 0.8
      })
    },
    collapse() {
      isActive = false
      gsap.to(resonanceCore.scale, {
        x: 0.05,
        y: 0.05,
        z: 0.05,
        duration: 1.5,
        ease: 'power2.in'
      })
      gsap.to(coreMaterial, {
        opacity: 0,
        duration: 1
      })
      resonanceRingsArray.forEach(ring => {
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
        dimensions.forEach((dim, i) => {
          dim.rotation.x = time * (0.1 + i * 0.05)
          dim.rotation.y = time * (0.15 + i * 0.08)
        })
        dimensionRings.forEach((ring, i) => {
          ring.rotation.z += 0.02 + i * 0.003
          ring.material.opacity = 0.2 + Math.sin(time * 3 + i) * 0.1
        })

        // 弦振动更新
        const positions = stringGeometry.attributes.position.array
        for (let i = 0; i < stringCount; i++) {
          const i3 = i * 3
          const dimensionIndex = i % dimensionCount

          // 弦振动模式 - 基于频率的复杂波形
          const vibration = Math.sin(time * stringFrequencies[i] + stringPhases[i]) *
                           Math.cos(time * stringFrequencies[i] * 1.5 + stringPhases[i] * 1.3) *
                           0.8

          positions[i3] += vibration * 0.05
          positions[i3 + 1] += vibration * 0.05 * Math.cos(time + dimensionIndex)
          positions[i3 + 2] += vibration * 0.05 * Math.sin(time + dimensionIndex)
        }
        stringGeometry.attributes.position.needsUpdate = true

        // 共鸣环更新
        resonanceRingsArray.forEach((ring, i) => {
          ring.rotation.z = time * (0.3 + i * 0.05)
          const pulse = Math.sin(time * 4 + i * 0.5) * 0.15 + 0.85
          ring.scale.setScalar(pulse)
          ring.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.2
        })

        // 核心脉动
        const corePulse = Math.sin(time * 5) * 0.3 + 1
        resonanceCore.scale.setScalar(corePulse * 1.2)
        resonanceCore.rotation.x = time * 0.2
        resonanceCore.rotation.y = time * 0.3

        group.rotation.y = time * 0.08
        group.rotation.x = Math.sin(time * 0.15) * 0.05
      }
    },
    destroy() {
      scene.remove(group)
      dimensions.forEach(dim => {
        dim.geometry.dispose()
        dim.material.dispose()
      })
      dimensionRings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
      stringGeometry.dispose()
      stringMaterial.dispose()
      resonanceCore.geometry.dispose()
      resonanceCore.material.dispose()
      resonanceRingsArray.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
    }
  }
}

/**
 * 创建额外维度紧致化空间
 * 基于卡鲁扎-克莱因理论 - 额外7维卷曲成卡拉比-丘流形
 */
function createCompactDimensions(scene, options) {
  const { compactCount = 7, manifoldRadius = 50 } = options

  const group = new THREE.Group()
  scene.add(group)

  const manifolds = []
  const manifoldMaterials = []

  // 卡拉比-丘流形颜色
  const manifoldColors = [
    new THREE.Color(0xFF00FF), // 品红
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0xFFFF00), // 黄色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFF6600), // 橙色
    new THREE.Color(0x9900FF), // 紫色
    new THREE.Color(0xFF0099)  // 粉色
  ]

  for (let i = 0; i < compactCount; i++) {
    // 卡拉比-丘流形 - 使用多面体模拟
    const geometry = new THREE.DodecahedronGeometry(manifoldRadius * 0.15, 1)
    const material = new THREE.MeshBasicMaterial({
      color: manifoldColors[i],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })

    const manifold = new THREE.Mesh(geometry, material)
    const angle = (i / compactCount) * Math.PI * 2
    const radius = 35 + Math.random() * 20
    manifold.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 30,
      Math.sin(angle) * radius
    )
    group.add(manifold)
    manifolds.push(manifold)
    manifoldMaterials.push(material)
  }

  // 流形连接线
  const connectionLines = []
  for (let i = 0; i < compactCount; i++) {
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(50 * 3)

    for (let j = 0; j < 50; j++) {
      const progress = j / 49
      const angle = progress * Math.PI * 2
      const radius = 25 + Math.sin(progress * Math.PI) * 15
      const height = Math.sin(progress * Math.PI * 1.5) * 10

      linePositions[j * 3] = Math.cos(angle) * radius
      linePositions[j * 3 + 1] = height
      linePositions[j * 3 + 2] = Math.sin(angle) * radius
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: manifoldColors[i],
      transparent: true,
      opacity: 0.15,
      linewidth: 1
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    group.add(line)
    connectionLines.push(line)
  }

  let isActive = false

  return {
    group,
    expand() {
      manifolds.forEach((manifold, i) => {
        manifold.scale.setScalar(0.01)
        gsap.to(manifold.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 2,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.1
        })
      })
    },
    activate() {
      isActive = true
      manifolds.forEach((manifold, i) => {
        gsap.to(manifoldMaterials[i], {
          opacity: 0.5,
          duration: 1
        })
      })
    },
    update(time) {
      if (isActive) {
        manifolds.forEach((manifold, i) => {
          manifold.rotation.x += 0.03 + i * 0.005
          manifold.rotation.y += 0.04 + i * 0.008
          manifold.rotation.z += 0.02 + i * 0.003
        })
        connectionLines.forEach((line, i) => {
          line.rotation.y = time * 0.2
          line.material.opacity = 0.15 + Math.sin(time * 2 + i) * 0.1
        })
        group.rotation.z = time * 0.1
      }
    },
    destroy() {
      scene.remove(group)
      manifolds.forEach(manifold => {
        manifold.geometry.dispose()
        manifold.material.dispose()
      })
      connectionLines.forEach(line => {
        line.geometry.dispose()
        line.material.dispose()
      })
    }
  }
}

/**
 * 创建弦理论振动系统
 * 基于M理论 - 弦的不同振模式对应不同粒子
 */
function createStringTheorySystem(scene, options) {
  const { stringCount = 8000, vibrationMode = 12, braneCount = 5 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 弦粒子系统
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(stringCount * 3)
  const colors = new Float32Array(stringCount * 3)
  const velocities = new Float32Array(stringCount * 3)
  const phases = new Float32Array(stringCount)
  const amplitudes = new Float32Array(stringCount)
  const frequencies = new Float32Array(stringCount)

  // 振动模式颜色
  const vibrationColors = [
    new THREE.Color(0xFF0000), // 开弦
    new THREE.Color(0x00FF00), // 闭弦
    new THREE.Color(0x0000FF), // D膜
    new THREE.Color(0xFFFF00), // NS5膜
    new THREE.Color(0xFF00FF), // M5膜
    new THREE.Color(0x00FFFF)  // KK模
  ]

  for (let i = 0; i < stringCount; i++) {
    const modeIndex = i % vibrationColors.length
    const angle = Math.random() * Math.PI * 2
    const radius = 15 + Math.random() * 40
    const phi = Math.random() * Math.PI

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(angle)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(angle)

    const color = vibrationColors[modeIndex]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.2
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2

    phases[i] = Math.random() * Math.PI * 2
    amplitudes[i] = 0.5 + Math.random() * 1.5
    frequencies[i] = 1 + Math.random() * 8
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  // D膜 - 超曲面
  const branes = []
  const braneMaterials = []

  for (let i = 0; i < braneCount; i++) {
    const braneGeometry = new THREE.PlaneGeometry(80, 80, 32, 32)
    const braneMaterial = new THREE.MeshBasicMaterial({
      color: vibrationColors[i % vibrationColors.length],
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })

    const brane = new THREE.Mesh(braneGeometry, braneMaterial)
    const angle = (i / braneCount) * Math.PI * 2
    const radius = 45 + i * 10
    brane.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 20,
      Math.sin(angle) * radius
    )
    brane.lookAt(0, 0, 0)
    group.add(brane)
    branes.push(brane)
    braneMaterials.push(braneMaterial)
  }

  let speedMultiplier = 1

  return {
    group,
    particles,
    startVibration() {
      speedMultiplier = 3
    },
    resonance() {
      speedMultiplier = 10
      branes.forEach((brane, i) => {
        gsap.to(braneMaterials[i], {
          opacity: 0.15,
          duration: 1
        })
      })
    },
    entangle() {
      branes.forEach((brane, i) => {
        gsap.to(brane.rotation, {
          x: brane.rotation.x + Math.PI * 2,
          duration: 3,
          ease: 'power2.inOut'
        })
      })
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
    },
    update(time) {
      const pos = geometry.attributes.position.array
      for (let i = 0; i < stringCount; i++) {
        const i3 = i * 3

        // 复杂的弦振动模式
        const vibration1 = Math.sin(time * frequencies[i] + phases[i])
        const vibration2 = Math.cos(time * frequencies[i] * 1.3 + phases[i] * 1.7)
        const vibration3 = Math.sin(time * frequencies[i] * 0.7 + phases[i] * 2.3)

        const amplitude = amplitudes[i] * speedMultiplier * 0.5
        pos[i * 3] += (vibration1 * vibration2) * amplitude * 0.02
        pos[i * 3 + 1] += (vibration2 * vibration3) * amplitude * 0.02
        pos[i * 3 + 2] += (vibration3 * vibration1) * amplitude * 0.02

        // 弦的随机运动
        pos[i * 3] += velocities[i * 3] * speedMultiplier * 0.01
        pos[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier * 0.01
        pos[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier * 0.01

        // 边界循环
        const dist = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2)
        if (dist > 80) {
          pos[i * 3] *= 0.1
          pos[i * 3 + 1] *= 0.1
          pos[i * 3 + 2] *= 0.1
        }
      }
      geometry.attributes.position.needsUpdate = true

      branes.forEach((brane, i) => {
        brane.material.opacity = 0.05 + Math.sin(time * 2 + i) * 0.05
      })

      group.rotation.y = time * 0.05
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
      branes.forEach(brane => {
        brane.geometry.dispose()
        brane.material.dispose()
      })
    }
  }
}

/**
 * 创建多元宇宙膜
 * 基于多重宇宙理论 - 多个平行宇宙的膜
 */
function createMultiverse(scene, options) {
  const { universeCount = 6, braneSeparation = 100 } = options

  const group = new THREE.Group()
  scene.add(group)

  const universes = []
  const universeMaterials = []

  const universeColors = [
    new THREE.Color(0xFF0000), // 宇宙1
    new THREE.Color(0x00FF00), // 宇宙2
    new THREE.Color(0x0000FF), // 宇宙3
    new THREE.Color(0xFFFF00), // 宇宙4
    new THREE.Color(0xFF00FF), // 宇宙5
    new THREE.Color(0x00FFFF)  // 宇宙6
  ]

  for (let i = 0; i < universeCount; i++) {
    const geometry = new THREE.SphereGeometry(40, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: universeColors[i],
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })

    const universe = new THREE.Mesh(geometry, material)
    const angle = (i / universeCount) * Math.PI * 2
    const radius = braneSeparation + i * 15
    universe.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 40,
      Math.sin(angle) * radius
    )
    group.add(universe)
    universes.push(universe)
    universeMaterials.push(material)
  }

  // 宇宙间连接隧道
  const wormholes = []
  for (let i = 0; i < universeCount; i++) {
    const nextIndex = (i + 1) % universeCount
    const tunnelGeometry = new THREE.CylinderGeometry(2, 2, 20, 8, 1, true)
    const tunnelMaterial = new THREE.MeshBasicMaterial({
      color: universeColors[i],
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })

    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial)
    tunnel.position.set(0, 0, 0)
    tunnel.rotation.x = Math.PI / 2
    group.add(tunnel)
    wormholes.push(tunnel)
  }

  let isActive = false

  return {
    group,
    appear() {
      universes.forEach((uni, i) => {
        gsap.to(universeMaterials[i], {
          opacity: 0.25,
          duration: 1.5,
          delay: i * 0.15
        })
      })
    },
    branesCollide() {
      isActive = true
      universes.forEach((uni, i) => {
        gsap.to(uni.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.05
        })
      })
      wormholes.forEach((wormhole, i) => {
        gsap.to(wormhole.material, {
          opacity: 0.4,
          duration: 1
        })
      })
    },
    merge() {
      isActive = false
      universes.forEach((uni, i) => {
        gsap.to(uni.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 1.5,
          ease: 'power2.in'
        })
      })
      wormholes.forEach(wormhole => {
        gsap.to(wormhole.material, {
          opacity: 0,
          duration: 1
        })
      })
    },
    update(time) {
      if (isActive) {
        universes.forEach((uni, i) => {
          uni.rotation.x = time * 0.1
          uni.rotation.y = time * 0.15
          uni.material.opacity = 0.15 + Math.sin(time * 2 + i) * 0.15
        })
        wormholes.forEach((wormhole, i) => {
          wormhole.rotation.z += 0.05
        })
        group.rotation.y = time * 0.08
      }
    },
    destroy() {
      scene.remove(group)
      universes.forEach(uni => {
        uni.geometry.dispose()
        uni.material.dispose()
      })
      wormholes.forEach(wormhole => {
        wormhole.geometry.dispose()
        wormhole.material.dispose()
      })
    }
  }
}

/**
 * 创建共鸣波纹
 * 基于共鸣理论 - 多频率波的叠加产生和谐
 */
function createResonanceWaves(scene, options) {
  const { waveCount = 15, maxRadius = 180 } = options

  const group = new THREE.Group()
  scene.add(group)

  const waves = []
  const waveMaterials = []

  const waveColors = [
    new THREE.Color(0xFF0000), new THREE.Color(0xFF7F00), new THREE.Color(0xFFFF00),
    new THREE.Color(0x00FF00), new THREE.Color(0x00FFFF), new THREE.Color(0x0000FF),
    new THREE.Color(0x4B0082), new THREE.Color(0x9400D3), new THREE.Color(0xFF69B4),
    new THREE.Color(0xFF1493), new THREE.Color(0x00FF7F), new THREE.Color(0xFFD700),
    new THREE.Color(0x00BFFF), new THREE.Color(0xFF6347), new THREE.Color(0x7B68EE)
  ]

  for (let i = 0; i < waveCount; i++) {
    const radius = maxRadius / 4 + i * 12
    const geometry = new THREE.RingGeometry(radius - 1.5, radius + 1.5, 200)
    const material = new THREE.MeshBasicMaterial({
      color: waveColors[i],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const wave = new THREE.Mesh(geometry, material)
    wave.rotation.x = Math.PI / 2
    group.add(wave)
    waves.push(wave)
    waveMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    expand() {
      isActive = true
      waves.forEach((wave, i) => {
        gsap.to(wave.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 1.5,
          ease: 'power3.out',
          delay: i * 0.08
        })
        gsap.to(waveMaterials[i], {
          opacity: 0.6,
          duration: 1,
          delay: i * 0.08
        })
      })
    },
    harmonic() {
      waves.forEach((wave, i) => {
        gsap.to(wave.rotation, {
          z: wave.rotation.z + Math.PI * 2,
          duration: 2.5,
          ease: 'power2.inOut',
          delay: i * 0.1
        })
      })
    },
    fade() {
      isActive = false
      waves.forEach((wave, i) => {
        gsap.to(wave.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.03
        })
        gsap.to(waveMaterials[i], {
          opacity: 0,
          duration: 1
        })
      })
    },
    update(time) {
      if (isActive) {
        waves.forEach((wave, i) => {
          wave.rotation.z += 0.03 + i * 0.005
          const pulse = Math.sin(time * 5 + i * 0.5) * 0.2 + 1
          wave.material.opacity = (0.3 + Math.sin(time * 3 + i) * 0.2) * pulse
        })
        group.rotation.x = Math.sin(time * 0.3) * 0.1
      }
    },
    destroy() {
      scene.remove(group)
      waves.forEach(wave => {
        wave.geometry.dispose()
        wave.material.dispose()
      })
    }
  }
}
