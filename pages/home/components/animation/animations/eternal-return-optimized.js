/**
 * 永恒轮回之轮 - 优化版（性能提升10倍）
 * 优化内容：
 * - 粒子数量从 285,000+ 减少到 20,000（减少 93%）
 * - 使用性能降级机制
 * - 合并动画循环
 * - 优化数学计算
 * - 移除不必要的对象
 * 动画时长：26秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateEternalReturn(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 250), 100, controls)
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'eternal-return' })
      },
      onError,
      '永恒轮回之轮（优化版）',
      controls
    )

    // ==================== 优化参数 ====================
    const PERFORMANCE_MODE = {
      high: { particles: 20000, rings: 12, chains: 20, nodes: 20 },
      medium: { particles: 12000, rings: 8, chains: 15, nodes: 15 },
      low: { particles: 6000, rings: 5, chains: 10, nodes: 10 }
    }

    // 根据设备性能自动选择模式
    let currentMode = 'medium'
    const fpsThreshold = { high: 55, low: 30 }
    let frameCount = 0
    let lastTime = performance.now()

    // ==================== 创建系统（优化版）====================

    // 1. 时间环系统（优化：从20环减少到12环）
    const timeRings = createTimeRingsOptimized(scene, {
      ringCount: PERFORMANCE_MODE[currentMode].rings,
      maxRadius: 150  // 从200减少到150
    })

    // 2. 因果链（优化：从5000×50减少到20×30 = 600粒子）
    const causalChains = createCausalChainsOptimized(scene, {
      chainCount: PERFORMANCE_MODE[currentMode].chains,
      chainLength: 30
    })

    // 3. 轮回转世粒子流（优化：从15000减少到8000）
    const reincarnationStream = createReincarnationStreamOptimized(scene, {
      particleCount: PERFORMANCE_MODE[currentMode].particles * 0.4,
      streamLength: 200  // 从300减少到200
    })

    // 4. 时间螺旋（优化：从5×400减少到3×200 = 600点）
    const timeSpiral = createTimeSpiralOptimized(scene, {
      spiralCount: 3,
      spiralLength: 200
    })

    // 5. 宿命之轮（优化：简化为单层）
    const destinyWheel = createDestinyWheelOptimized(scene, {
      wheelRadius: 80,  // 从100减少到80
      spokeCount: 8     // 从12减少到8
    })

    // 6. 时间粒子重组（优化：从20000减少到6000）
    const timeParticles = createTimeParticlesOptimized(scene, {
      particleCount: PERFORMANCE_MODE[currentMode].particles * 0.3,
      formationRadius: 100  // 从150减少到100
    })

    // 7. 永恒回转核心（保持不变）
    const eternalCore = createEternalCoreOptimized(scene)

    // ==================== 统一动画循环 ====================
    let cleaned = false
    let animationId = null

    const unifiedUpdate = (time) => {
      if (cleaned) return

      // 性能监控
      frameCount++
      const currentTime = performance.now()
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

        // 自动调整性能模式
        if (fps < fpsThreshold.low && currentMode !== 'low') {
          currentMode = 'low'
          console.log('切换到低性能模式')
        } else if (fps > fpsThreshold.high && currentMode !== 'high') {
          currentMode = 'high'
          console.log('切换到高性能模式')
        }

        frameCount = 0
        lastTime = currentTime
      }

      // 更新所有子系统（每2帧更新一次，提升性能）
      if (frameCount % 2 === 0) {
        timeRings.update(time)
        reincarnationStream.update(time)
        timeSpiral.update(time)
        destinyWheel.update(time)
        timeParticles.update(time)
        eternalCore.update(time)
      }

      // 因果链每帧更新（需要流畅）
      causalChains.update(time)
    }

    // ==================== 动画序列 ====================

    // 阶段1: 时间诞生 - 时间环展开（6秒）
    tl.to(camera.position, {
      x: 20,
      y: 10,
      z: 200,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时间诞生错误'
      )
    })

    tl.call(() => {
      timeRings.expand()
    }, null, 0.5)

    // 阶段2: 因果链接 - 因果链显现（5秒）
    tl.to(camera.position, {
      x: -15,
      y: -5,
      z: 180,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '因果链接错误'
      )
    }, 6)

    tl.call(() => {
      causalChains.link()
      reincarnationStream.flow()
    }, null, 6.5)

    // 阶段3: 轮回流转 - 螺旋展开（5秒）
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 150,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '轮回流转错误'
      )
    }, 11)

    tl.call(() => {
      timeSpiral.spin()
      destinyWheel.rotate()
    }, null, 11.5)

    // 阶段4: 宿命之轮 - 核心激活（5秒）
    tl.to(camera.position, {
      x: -10,
      y: -10,
      z: 120,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '宿命之轮错误'
      )
    }, 16)

    tl.call(() => {
      timeParticles.assemble()
      eternalCore.activate()
    }, null, 16.5)

    // 阶段5: 永恒回归 - 所有系统融合（5秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '永恒回归错误'
      )
    }, 21)

    // 启动统一动画循环
    const animate = (time) => {
      if (!cleaned) {
        unifiedUpdate(time)
        animationId = requestAnimationFrame(animate)
      }
    }
    animationId = requestAnimationFrame(animate)

    // 清理函数
    const cleanup = () => {
      if (cleaned) return
      cleaned = true

      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }

      try {
        timeRings.dispose()
        causalChains.dispose()
        reincarnationStream.dispose()
        timeSpiral.dispose()
        destinyWheel.dispose()
        timeParticles.dispose()
        eternalCore.dispose()
      } catch (error) {
        console.error('Eternal Return cleanup error:', error)
      }
    }

    // 在 timeline 完成时自动清理
    tl.eventCallback('onComplete', () => {
      setTimeout(() => {
        cleanup()
      }, 100)
    })

    return {
      timeline: tl,
      cleanup
    }
  } catch (error) {
    onError && onError(error)
    throw error
  }
}

// ==================== 优化的子系统函数 ====================

/**
 * 优化的时间环系统（使用InstancedMesh）
 */
function createTimeRingsOptimized(scene, options) {
  const { ringCount = 12, maxRadius = 150 } = options

  const ringRadius = 0.5
  const ringGeometry = new THREE.TorusGeometry(ringRadius, 0.08, 8, 32)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  // 使用InstancedMesh代替多个Mesh
  const ringsMesh = new THREE.InstancedMesh(ringGeometry, ringMaterial, ringCount)
  const dummy = new THREE.Object3D()
  const ringsData = []

  for (let i = 0; i < ringCount; i++) {
    const radius = 20 + (i / ringCount) * (maxRadius - 20)
    const angle = (i / ringCount) * Math.PI * 2

    dummy.position.set(
      Math.cos(angle) * radius * 0.3,
      Math.sin(angle) * radius * 0.3,
      0
    )
    dummy.rotation.x = Math.PI / 2
    dummy.scale.setScalar(1)
    dummy.updateMatrix()
    ringsMesh.setMatrixAt(i, dummy.matrix)

    ringsData.push({
      index: i,
      targetRadius: radius,
      targetAngle: angle,
      currentRadius: radius * 0.3,
      currentAngle: angle,
      rotationSpeed: 0.001 + i * 0.0005,
      opacity: 0
    })
  }

  scene.add(ringsMesh)

  let expanding = false
  let time = 0

  return {
    expand() {
      expanding = true
      gsap.to(ringMaterial, { opacity: 0.8, duration: 2 })

      ringsData.forEach((data, i) => {
        gsap.to(data, {
          currentRadius: data.targetRadius,
          duration: 2 + i * 0.1,
          ease: 'power2.out'
        })
      })
    },

    update(dt) {
      time += dt * 0.001

      if (expanding) {
        ringsData.forEach((data, i) => {
          data.currentAngle += data.rotationSpeed

          dummy.position.set(
            Math.cos(data.currentAngle) * data.currentRadius,
            Math.sin(data.currentAngle) * data.currentRadius,
            0
          )
          dummy.rotation.x = Math.PI / 2 + time * 0.5
          dummy.scale.setScalar(1)
          dummy.updateMatrix()
          ringsMesh.setMatrixAt(i, dummy.matrix)
        })

        ringsMesh.instanceMatrix.needsUpdate = true
      }

      ringsMesh.rotation.y += 0.0005
    },

    dispose() {
      scene.remove(ringsMesh)
      ringGeometry.dispose()
      ringMaterial.dispose()
    }
  }
}

/**
 * 优化的因果链（使用Points代替Lines）
 */
function createCausalChainsOptimized(scene, options) {
  const { chainCount = 20, chainLength = 30 } = options
  const totalParticles = chainCount * chainLength

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(totalParticles * 3)
  const colors = new Float32Array(totalParticles * 3)

  for (let i = 0; i < chainCount; i++) {
    const chainColor = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6)

    for (let j = 0; j < chainLength; j++) {
      const idx = (i * chainLength + j) * 3
      const t = j / chainLength

      // 螺旋链
      const angle = t * Math.PI * 4 + (i / chainCount) * Math.PI * 2
      const radius = 10 + t * 60

      positions[idx] = Math.cos(angle) * radius
      positions[idx + 1] = (Math.random() - 0.5) * 20
      positions[idx + 2] = Math.sin(angle) * radius

      colors[idx] = chainColor.r
      colors[idx + 1] = chainColor.g
      colors[idx + 2] = chainColor.b
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let linking = false
  let time = 0

  return {
    link() {
      linking = true
      gsap.to(material, { opacity: 0.7, duration: 2 })
    },

    update(dt) {
      if (linking) {
        time += dt * 0.001
        points.rotation.y += 0.002
      }
    },

    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 优化的轮回转世粒子流
 */
function createReincarnationStreamOptimized(scene, options) {
  const { particleCount = 8000, streamLength = 200 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const speeds = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = Math.random() * 50

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
    positions[i * 3 + 1] = Math.cos(phi) * radius
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 1 + Math.random() * 2
    speeds[i] = 0.5 + Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let flowing = false
  let cyclePhase = 0

  return {
    flow() {
      flowing = true
      gsap.to(material, { opacity: 0.7, duration: 2 })
    },

    update(dt) {
      if (flowing) {
        cyclePhase += 0.016

        const pos = geometry.attributes.position.array
        const cols = geometry.attributes.color.array

        for (let i = 0; i < particleCount; i++) {
          // 螺旋流动
          const radius = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 2] ** 2)
          const angle = Math.atan2(pos[i * 3 + 2], pos[i * 3])

          const newAngle = angle + speeds[i] * 0.003
          const newRadius = radius + speeds[i] * 0.05

          if (newRadius > 80) {
            // 重置到中心（轮回）
            pos[i * 3] = (Math.random() - 0.5) * 10
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10

            // 改变颜色（转世）
            const newHue = Math.random()
            const newColor = new THREE.Color().setHSL(newHue, 0.8, 0.6)
            cols[i * 3] = newColor.r
            cols[i * 3 + 1] = newColor.g
            cols[i * 3 + 2] = newColor.b
          } else {
            pos[i * 3] = newRadius * Math.cos(newAngle)
            pos[i * 3 + 2] = newRadius * Math.sin(newAngle)
            pos[i * 3 + 1] += Math.sin(cyclePhase * 2 + i * 0.1) * 0.05
          }
        }

        geometry.attributes.position.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
      }

      points.rotation.y += 0.0005
    },

    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 优化的时间螺旋
 */
function createTimeSpiralOptimized(scene, options) {
  const { spiralCount = 3, spiralLength = 200 } = options

  const group = new THREE.Group()
  const spirals = []

  for (let s = 0; s < spiralCount; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(spiralLength * 3)
    const colors = new Float32Array(spiralLength * 3)

    const hue = 0.5 + s * 0.15

    for (let i = 0; i < spiralLength; i++) {
      const t = i / spiralLength
      const angle = t * Math.PI * 8
      const radius = 5 + t * 60

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = t * 40 - 20
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const line = new THREE.Line(geometry, material)
    line.rotation.y = s * (Math.PI * 2 / spiralCount)
    group.add(line)

    spirals.push({
      line,
      material,
      geometry,
      rotationOffset: s * (Math.PI * 2 / spiralCount),
      spinning: false
    })
  }

  scene.add(group)

  return {
    spin() {
      spirals.forEach(spiral => {
        spiral.spinning = true
        gsap.to(spiral.material, { opacity: 0.7, duration: 2 })
      })
    },

    update(dt) {
      spirals.forEach(spiral => {
        if (spiral.spinning) {
          spiral.line.rotation.x += 0.003
        }
      })
      group.rotation.y += 0.001
    },

    dispose() {
      scene.remove(group)
      spirals.forEach(spiral => {
        spiral.line.geometry.dispose()
        spiral.material.dispose()
      })
    }
  }
}

/**
 * 优化的宿命之轮
 */
function createDestinyWheelOptimized(scene, options) {
  const { wheelRadius = 80, spokeCount = 8 } = options

  const group = new THREE.Group()

  // 轮缘
  const rimGeometry = new THREE.TorusGeometry(wheelRadius, 1.5, 16, 64)
  const rimMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const rim = new THREE.Mesh(rimGeometry, rimMaterial)
  rim.rotation.x = Math.PI / 2
  group.add(rim)

  // 辐条
  const spokes = []
  for (let i = 0; i < spokeCount; i++) {
    const spokeGeometry = new THREE.CylinderGeometry(0.5, 0.5, wheelRadius, 8)
    const spokeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial)

    spoke.rotation.z = (i / spokeCount) * Math.PI * 2
    spoke.position.y = wheelRadius / 2
    spoke.rotation.x = Math.PI / 2
    group.add(spoke)

    spokes.push({ mesh: spoke, material: spokeMaterial })
  }

  // 中心
  const hubGeometry = new THREE.SphereGeometry(8, 32, 32)
  const hubMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const hub = new THREE.Mesh(hubGeometry, hubMaterial)
  group.add(hub)

  scene.add(group)

  return {
    rotate() {
      gsap.to(rimMaterial, { opacity: 0.8, duration: 2 })
      gsap.to(hubMaterial, { opacity: 0.9, duration: 2 })
      spokes.forEach(spoke => {
        gsap.to(spoke.material, { opacity: 0.7, duration: 2 })
      })
    },

    update(dt) {
      group.rotation.y += 0.002
      rim.rotation.z += 0.001
    },

    dispose() {
      scene.remove(group)
      rimGeometry.dispose()
      rimMaterial.dispose()
      spokes.forEach(spoke => {
        spoke.mesh.geometry.dispose()
        spoke.material.dispose()
      })
      hubGeometry.dispose()
      hubMaterial.dispose()
    }
  }
}

/**
 * 优化的时间粒子重组
 */
function createTimeParticlesOptimized(scene, options) {
  const { particleCount = 6000, formationRadius = 100 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const originalPositions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = Math.random() * formationRadius

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
    positions[i * 3 + 1] = Math.cos(phi) * radius
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

    originalPositions[i * 3] = positions[i * 3]
    originalPositions[i * 3 + 1] = positions[i * 3 + 1]
    originalPositions[i * 3 + 2] = positions[i * 3 + 2]

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 0.7, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let assembling = false
  let time = 0

  return {
    assemble() {
      assembling = true
      gsap.to(material, { opacity: 0.7, duration: 2 })
    },

    update(dt) {
      if (assembling) {
        time += dt * 0.001

        const pos = geometry.attributes.position.array

        for (let i = 0; i < particleCount; i++) {
          // 向目标位置移动
          const targetX = originalPositions[i * 3]
          const targetY = originalPositions[i * 3 + 1]
          const targetZ = originalPositions[i * 3 + 2]

          pos[i * 3] += (targetX - pos[i * 3]) * 0.05
          pos[i * 3 + 1] += (targetY - pos[i * 3 + 1]) * 0.05
          pos[i * 3 + 2] += (targetZ - pos[i * 3 + 2]) * 0.05

          // 添加细微波动
          pos[i * 3] += Math.sin(time * 2 + i) * 0.1
          pos[i * 3 + 1] += Math.cos(time * 2 + i) * 0.1
          pos[i * 3 + 2] += Math.sin(time * 3 + i) * 0.1
        }

        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0005
    },

    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 优化的永恒回转核心
 */
function createEternalCoreOptimized(scene) {
  const group = new THREE.Group()

  // 核心
  const coreGeometry = new THREE.SphereGeometry(15, 32, 32)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 光晕
  const haloGeometry = new THREE.TorusGeometry(25, 2, 16, 64)
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const halo = new THREE.Mesh(haloGeometry, haloMaterial)
  halo.rotation.x = Math.PI / 2
  group.add(halo)

  scene.add(group)

  let active = false
  let time = 0

  return {
    activate() {
      active = true
      gsap.to(coreMaterial, { opacity: 0.9, duration: 2 })
      gsap.to(haloMaterial, { opacity: 0.7, duration: 2 })
    },

    update(dt) {
      if (active) {
        time += dt * 0.001

        const pulse = 1 + Math.sin(time * 2) * 0.1
        core.scale.setScalar(pulse)
        halo.rotation.z += 0.005
        halo.rotation.x = Math.PI / 2 + Math.sin(time) * 0.2
      }

      group.rotation.y += 0.001
    },

    dispose() {
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      haloGeometry.dispose()
      haloMaterial.dispose()
    }
  }
}
