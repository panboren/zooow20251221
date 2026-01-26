/**
 * 永恒轮回之轮 - 超越时间之沙的哲学震撼
 * 融合尼采永恒轮回、时间循环、因果轮回、生死轮回、宇宙轮回等哲学概念
 * 技术突破：
 * - 多层时间环系统（20+时间环）
 * - 因果链动态渲染（5000+粒子）
 * - 轮回转世粒子流
 * - 时间螺旋可视化
 * - 宿命线交织
 * - 时空循环效果
 * - 永恒回转动画
 * - 多维时间线
 * - 宿命之轮
 * - 时间粒子重组
 * 动画时长：26秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateEternalReturn(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 时间流视角
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 250), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'eternal-return' })
      },
      onError,
      '永恒轮回之轮',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 时间环系统（20环）
    const timeRings = createTimeRings(scene, {
      ringCount: 20,
      maxRadius: 200
    })

    // 2. 因果链（5000粒子）
    const causalChains = createCausalChains(scene, {
      chainCount: 5000,
      chainLength: 50
    })

    // 3. 轮回转世粒子流
    const reincarnationStream = createReincarnationStream(scene, {
      particleCount: 15000,
      streamLength: 300
    })

    // 4. 时间螺旋
    const timeSpiral = createTimeSpiral(scene, {
      spiralCount: 5,
      spiralLength: 400
    })

    // 5. 宿命之轮
    const destinyWheel = createDestinyWheel(scene, {
      wheelRadius: 100,
      spokeCount: 12
    })

    // 6. 因果交织网
    const causalWeb = createCausalWeb(scene, {
      nodeCount: 3000,
      connectionCount: 8000
    })

    // 7. 时间粒子重组
    const timeParticles = createTimeParticles(scene, {
      particleCount: 20000,
      formationRadius: 150
    })

    // 8. 永恒回转核心
    const eternalCore = createEternalCore(scene)

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
    }, 0)

    tl.call(() => {
      timeRings.expand()
      timeSpiral.unwind()
    }, null, 0.5)

    tl.to(camera, {
      fov: 120,
      duration: 4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时间视野错误'
      )
    }, 1)

    // 阶段2: 因果建立 - 因果链形成（7秒）
    tl.to(camera.position, {
      x: -15,
      y: 20,
      z: 150,
      duration: 7,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '因果建立错误'
      )
    }, 6)

    tl.call(() => {
      causalChains.establish()
      causalWeb.weave()
    }, null, 6.5)

    tl.to(camera, {
      fov: 140,
      duration: 5,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '因果视野错误'
      )
    }, 7)

    // 阶段3: 轮回流转 - 转世粒子流（7秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 80,
      duration: 7,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '轮回流转错误'
      )
    }, 13)

    tl.call(() => {
      reincarnationStream.flow()
      destinyWheel.spin()
    }, null, 13.5)

    tl.to(camera, {
      fov: 100,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '轮回视野错误'
      )
    }, 14)

    // 阶段4: 永恒回转 - 时间重组（6秒）
    tl.to(camera.position, {
      x: 5,
      y: -5,
      z: 40,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '永恒回转错误'
      )
    }, 20)

    tl.call(() => {
      timeParticles.reform()
      eternalCore.activate()
    }, null, 20.5)

    tl.to(camera, {
      fov: 85,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '最终视角错误'
      )
    }, 21)

    // ==================== 清理函数 ====================
    const cleanup = () => {
      timeRings.dispose()
      causalChains.dispose()
      reincarnationStream.dispose()
      timeSpiral.dispose()
      destinyWheel.dispose()
      causalWeb.dispose()
      timeParticles.dispose()
      eternalCore.dispose()
    }

    return {
      timeline: tl,
      cleanup
    }
  }
  catch (error) {
    onError && onError(error)
    throw error
  }
}

// ==================== 系统创建函数 ====================

/**
 * 创建时间环系统
 */
function createTimeRings(scene, options = {}) {
  const {
    ringCount = 20,
    maxRadius = 200
  } = options

  const rings = []

  for (let i = 0; i < ringCount; i++) {
    const radius = 20 + (i / ringCount) * maxRadius
    const geometry = new THREE.TorusGeometry(radius, 1, 16, 64)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 + i * 0.02, 0.8, 0.5),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2

    rings.push({
      mesh: ring,
      expanded: false,
      phase: i * 0.2
    })

    scene.add(ring)
  }

  const expand = () => {
    rings.forEach((ring, i) => {
      setTimeout(() => {
        ring.expanded = true

        gsap.to(ring.mesh.material, {
          opacity: 0.4,
          duration: 1
        })

        // 旋转展开动画
        gsap.to(ring.mesh.scale, {
          z: 1 + i * 0.05,
          duration: 2,
          ease: 'power2.out'
        })
      }, i * 150)
    })
  }

  const update = () => {
    rings.forEach(ring => {
      if (ring.expanded) {
        ring.mesh.rotation.z += 0.005 * (1 + ring.phase)
        const pulse = Math.sin(Date.now() * 0.002 + ring.phase)
        ring.mesh.material.opacity = 0.3 + pulse * 0.2
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    expand,
    dispose() {
      cancelAnimationFrame(animationId)
      rings.forEach(ring => {
        scene.remove(ring.mesh)
        ring.mesh.geometry.dispose()
        ring.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建因果链
 */
function createCausalChains(scene, options = {}) {
  const {
    chainCount = 5000,
    chainLength = 50
  } = options

  const group = new THREE.Group()
  const chains = []

  for (let i = 0; i < chainCount; i++) {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(chainLength * 3)

    const startX = (Math.random() - 0.5) * 200
    const startY = (Math.random() - 0.5) * 200
    const startZ = (Math.random() - 0.5) * 200

    for (let j = 0; j < chainLength; j++) {
      positions[j * 3] = startX
      positions[j * 3 + 1] = startY
      positions[j * 3 + 2] = startZ
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const line = new THREE.Line(geometry, material)

    chains.push({
      line,
      material,
      established: false,
      phase: Math.random() * Math.PI * 2,
      endPosition: new THREE.Vector3(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      )
    })

    group.add(line)
  }

  scene.add(group)

  const establish = () => {
    chains.forEach((chain, i) => {
      setTimeout(() => {
        chain.established = true

        gsap.to(chain.material, {
          opacity: 0.3,
          duration: 1
        })

        // 链条展开动画
        const positions = chain.line.geometry.attributes.position.array
        const targetPositions = []

        for (let j = 0; j < chainLength; j++) {
          const t = j / chainLength
          targetPositions.push(
            chain.endPosition.x * t,
            chain.endPosition.y * t,
            chain.endPosition.z * t
          )
        }

        gsap.to(positions, {
          ...targetPositions,
          duration: 3,
          ease: 'power2.out',
          onUpdate: () => {
            chain.line.geometry.attributes.position.needsUpdate = true
          }
        })
      }, i * 2)
    })
  }

  const update = () => {
    chains.forEach(chain => {
      if (chain.established) {
        const flow = Math.sin(Date.now() * 0.005 + chain.phase)
        chain.material.opacity = 0.2 + flow * 0.2
      }
    })

    group.rotation.y += 0.001
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    establish,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      chains.forEach(chain => {
        chain.line.geometry.dispose()
        chain.material.dispose()
      })
    }
  }
}

/**
 * 创建轮回转世粒子流
 */
function createReincarnationStream(scene, options = {}) {
  const {
    particleCount = 15000,
    streamLength = 300
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const speeds = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 30 + Math.random() * 50

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 1 + Math.random() * 2
    speeds[i] = 1 + Math.random() * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let flowing = false
  let cyclePhase = 0

  const update = () => {
    if (flowing) {
      cyclePhase += 0.016
      const positions = points.geometry.attributes.position.array
      const colors = points.geometry.attributes.color.array

      for (let i = 0; i < particleCount; i++) {
        // 螺旋流动
        const radius = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2)
        const angle = Math.atan2(positions[i * 3 + 2], positions[i * 3])

        const newAngle = angle + speeds[i] * 0.005
        const newRadius = radius + speeds[i] * 0.1

        if (newRadius > 100) {
          // 重置到中心（轮回）
          positions[i * 3] = (Math.random() - 0.5) * 10
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10

          // 改变颜色（转世）
          const newHue = Math.random()
          const newColor = new THREE.Color().setHSL(newHue, 0.8, 0.6)
          colors[i * 3] = newColor.r
          colors[i * 3 + 1] = newColor.g
          colors[i * 3 + 2] = newColor.b
        } else {
          positions[i * 3] = newRadius * Math.cos(newAngle)
          positions[i * 3 + 2] = newRadius * Math.sin(newAngle)
          positions[i * 3 + 1] += Math.sin(cyclePhase * 2 + i * 0.1) * 0.1
        }
      }

      points.geometry.attributes.position.needsUpdate = true
      points.geometry.attributes.color.needsUpdate = true
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    flow() {
      flowing = true
      gsap.to(material, {
        opacity: 0.7,
        duration: 2
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建时间螺旋
 */
function createTimeSpiral(scene, options = {}) {
  const {
    spiralCount = 5,
    spiralLength = 400
  } = options

  const spirals = []

  for (let s = 0; s < spiralCount; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(spiralLength * 3)
    const colors = new Float32Array(spiralLength * 3)

    for (let i = 0; i < spiralLength; i++) {
      const t = i / spiralLength
      const angle = t * Math.PI * 10
      const radius = t * 80

      positions[i * 3] = radius * Math.cos(angle)
      positions[i * 3 + 1] = t * 200 - 100
      positions[i * 3 + 2] = radius * Math.sin(angle)

      const color = new THREE.Color().setHSL(0.5 + s * 0.1 + t * 0.2, 0.8, 0.6)
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

    spirals.push({
      line,
      material,
      unwound: false,
      rotationOffset: s * (Math.PI * 2 / spiralCount)
    })

    scene.add(line)
  }

  const unwind = () => {
    spirals.forEach((spiral, i) => {
      setTimeout(() => {
        spiral.unwound = true

        gsap.to(spiral.material, {
          opacity: 0.5,
          duration: 1.5
        })

        gsap.to(spiral.line.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 3,
          ease: 'power2.out'
        })
      }, i * 300)
    })
  }

  const update = () => {
    spirals.forEach(spiral => {
      if (spiral.unwound) {
        spiral.line.rotation.y += 0.005
        spiral.line.rotation.x = spiral.rotationOffset + Math.sin(Date.now() * 0.001) * 0.2
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    unwind,
    dispose() {
      cancelAnimationFrame(animationId)
      spirals.forEach(spiral => {
        scene.remove(spiral.line)
        spiral.line.geometry.dispose()
        spiral.material.dispose()
      })
    }
  }
}

/**
 * 创建宿命之轮
 */
function createDestinyWheel(scene, options = {}) {
  const {
    wheelRadius = 100,
    spokeCount = 12
  } = options

  const group = new THREE.Group()

  // 轮缘
  const rimGeometry = new THREE.TorusGeometry(wheelRadius, 3, 16, 64)
  const rimMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
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
    const spokeGeometry = new THREE.CylinderGeometry(1, 1, wheelRadius * 2, 8)
    const spokeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial)
    spoke.rotation.z = Math.PI / 2
    spoke.rotation.y = (i / spokeCount) * Math.PI * 2

    spokes.push({
      mesh: spoke,
      material: spokeMaterial
    })

    group.add(spoke)
  }

  // 中心
  const hubGeometry = new THREE.SphereGeometry(15, 32, 32)
  const hubMaterial = new THREE.MeshBasicMaterial({
    color: 0xff8800,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const hub = new THREE.Mesh(hubGeometry, hubMaterial)
  group.add(hub)

  scene.add(group)

  let spinning = false

  const spin = () => {
    spinning = true

    gsap.to(rimMaterial, {
      opacity: 0.6,
      duration: 1
    })

    spokes.forEach((spoke, i) => {
      gsap.to(spoke.material, {
        opacity: 0.5,
        duration: 1,
        delay: i * 0.05
      })
    })

    gsap.to(hubMaterial, {
      opacity: 0.7,
      duration: 1
    })
  }

  const update = () => {
    if (spinning) {
      group.rotation.y += 0.01
      const pulse = Math.sin(Date.now() * 0.005)
      hub.scale.setScalar(1 + pulse * 0.1)
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    spin,
    dispose() {
      cancelAnimationFrame(animationId)
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
 * 创建因果交织网
 */
function createCausalWeb(scene, options = {}) {
  const {
    nodeCount = 3000,
    connectionCount = 8000
  } = options

  const group = new THREE.Group()

  // 节点
  const nodeGeometry = new THREE.BufferGeometry()
  const nodePositions = new Float32Array(nodeCount * 3)
  const nodeColors = new Float32Array(nodeCount * 3)

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 80 + Math.random() * 120

    nodePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    nodePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    nodePositions[i * 3 + 2] = radius * Math.cos(phi)

    const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
    nodeColors[i * 3] = color.r
    nodeColors[i * 3 + 1] = color.g
    nodeColors[i * 3 + 2] = color.b
  }

  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
  nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3))

  const nodeMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0
  })

  const nodes = new THREE.Points(nodeGeometry, nodeMaterial)
  group.add(nodes)

  // 连接线
  const connections = []
  for (let i = 0; i < connectionCount; i++) {
    const startIdx = Math.floor(Math.random() * nodeCount)
    const endIdx = Math.floor(Math.random() * nodeCount)

    const lineGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(6)

    positions[0] = nodePositions[startIdx * 3]
    positions[1] = nodePositions[startIdx * 3 + 1]
    positions[2] = nodePositions[startIdx * 3 + 2]
    positions[3] = nodePositions[endIdx * 3]
    positions[4] = nodePositions[endIdx * 3 + 1]
    positions[5] = nodePositions[endIdx * 3 + 2]

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.6, 0.5),
      transparent: true,
      opacity: 0
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    connections.push({ mesh: line, material: lineMaterial })
    group.add(line)
  }

  scene.add(group)

  let woven = false

  const weave = () => {
    woven = true

    gsap.to(nodeMaterial, {
      opacity: 0.6,
      duration: 2
    })

    connections.forEach((conn, i) => {
      gsap.to(conn.material, {
        opacity: 0.2,
        duration: 1,
        delay: i * 0.0005
      })
    })
  }

  const update = () => {
    if (woven) {
      group.rotation.y += 0.002
      group.rotation.x += 0.001

      // 节点脉冲
      const pulse = Math.sin(Date.now() * 0.003)
      nodes.material.opacity = 0.5 + pulse * 0.2
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    weave,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      connections.forEach(conn => {
        conn.mesh.geometry.dispose()
        conn.material.dispose()
      })
    }
  }
}

/**
 * 创建时间粒子重组
 */
function createTimeParticles(scene, options = {}) {
  const {
    particleCount = 20000,
    formationRadius = 150
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const originalPositions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = formationRadius * Math.cbrt(Math.random())

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    originalPositions[i * 3] = positions[i * 3]
    originalPositions[i * 3 + 1] = positions[i * 3 + 1]
    originalPositions[i * 3 + 2] = positions[i * 3 + 2]

    const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let reforming = false
  let reformPhase = 0

  const reform = () => {
    reforming = true
  }

  const update = () => {
    if (reforming) {
      reformPhase += 0.016
      const positions = points.geometry.attributes.position.array

      // 螺旋重组
      for (let i = 0; i < particleCount; i++) {
        const targetX = originalPositions[i * 3]
        const targetY = originalPositions[i * 3 + 1]
        const targetZ = originalPositions[i * 3 + 2]

        // 添加螺旋运动
        const spiralAngle = reformPhase * 2 + i * 0.001
        const spiralRadius = Math.sqrt(
          positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2
        ) * 0.95

        positions[i * 3] += (targetX - positions[i * 3]) * 0.01
        positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * 0.01
        positions[i * 3 + 2] += (targetZ - positions[i * 3 + 2]) * 0.01

        // 螺旋偏移
        positions[i * 3] += Math.cos(spiralAngle) * 0.5
        positions[i * 3 + 2] += Math.sin(spiralAngle) * 0.5
      }

      points.geometry.attributes.position.needsUpdate = true
    }

    points.rotation.y += 0.001
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    reform,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建永恒回转核心
 */
function createEternalCore(scene) {
  const group = new THREE.Group()

  // 核心
  const coreGeometry = new THREE.SphereGeometry(20, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 外层光环
  const haloGeometry = new THREE.TorusGeometry(35, 2, 16, 64)
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const halo = new THREE.Mesh(haloGeometry, haloMaterial)
  halo.rotation.x = Math.PI / 2
  group.add(halo)

  scene.add(group)

  let activated = false

  const activate = () => {
    activated = true

    gsap.to(coreMaterial, {
      opacity: 0.8,
      duration: 1
    })

    gsap.to(haloMaterial, {
      opacity: 0.6,
      duration: 1.5
    })

    // 核心膨胀
    gsap.to(core.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 2,
      yoyo: true,
      repeat: -1
    })
  }

  const update = () => {
    if (activated) {
      group.rotation.y += 0.02
      group.rotation.x += 0.01

      halo.rotation.z += 0.01
      halo.rotation.x = Math.PI / 2 + Math.sin(Date.now() * 0.002) * 0.3

      const pulse = Math.sin(Date.now() * 0.005)
      halo.scale.setScalar(1 + pulse * 0.2)
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    activate,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      haloGeometry.dispose()
      haloMaterial.dispose()
    }
  }
}
