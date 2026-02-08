/**
 * 全息永恒之巅 - 传说级全息特效
 * 概念：超越时空的永恒真理，以全息形式展现无限与永恒
 * 技术突破：
 * - 永恒时间螺旋可视化（无限嵌套时间环）
 * - 维度坍缩序列（10D→3D逐级坍缩）
 * - 无限分形宇宙（递归分形结构）
 * - 永恒对称场（完美对称可视化）
 * - 全息记忆库（永恒信息存储）
 * - 时间全息投影（过去现在未来同时存在）
 * - 无限能量共振场
 * - 永恒光子流
 * - 维度交织网络（高维空间结构）
 * - 存在性场可视化（存在本身的全息）
 * - 使用HolographicMaterial实现真正的全息效果
 * - 使用ParticleFactory统一粒子创建
 * - 使用PerformanceMonitor性能监控
 * 动画时长：30秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'
import {
  HolographicMaterial,
  createHolographicMesh,
  createHolographicParticles
} from './holographic/holographic-core.js'

export default function animateHolographicEternityZenith(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  // 创建性能监控器
  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  try {
    // 初始设置 - 永恒视角
    setupInitialCamera(camera, new THREE.Vector3(0, 150, 350), 75, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-eternity-zenith' })
      },
      onError,
      '全息永恒之巅 (传说级)',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 永恒时间螺旋系统（5层嵌套螺旋 - 优化）
    const eternalSpirals = createEternalTimeSpirals(scene, {
      spiralCount: 5,
      spiralColors: [
        0xffffff, // 纯白 - 核心
        0xffff00, // 金色
        0xff8800, // 橙色
        0x0088ff, // 蓝色
        0x00ffff  // 青色 - 最外层
      ],
      spiralRadii: [5, 15, 30, 50, 80]
    })

    // 2. 维度坍缩序列（5D到3D - 优化）
    const dimensionCollapse = createDimensionCollapseSequence(scene, {
      startDimension: 5,
      endDimension: 3,
      collapseSpeed: 1.0
    })

    // 3. 无限分形宇宙
    const infiniteFractal = createInfiniteFractalUniverse(scene, {
      fractalDepth: 2,
      fractalIterations: 2,
      fractalColor: 0x00ffff
    })

    // 4. 永恒对称场（完美几何 - 优化）
    const eternalSymmetry = createEternalSymmetryField(scene, {
      symmetryPlatonic: ['tetrahedron', 'cube', 'octahedron'],
      symmetryCount: 3
    })

    // 5. 全息记忆库（永恒信息 - 优化）
    const holographicMemory = createHolographicMemoryLibrary(scene, {
      memoryBlocks: 300,
      blockLayers: 3,
      informationDensity: 1.0
    })

    // 6. 时间全息投影（过去现在未来 - 优化）
    const timeHolography = createTimeHolography(scene, {
      timelineStreams: 5,
      temporalPoints: 80
    })

    // 7. 无限能量共振场
    const infiniteResonance = createInfiniteResonanceField(scene, {
      resonanceRings: 8,
      resonanceHarmonics: [1, 2, 3, 5] // 斐波那契数列
    })

    // 8. 永恒光子流（大幅优化）
    const eternalPhotons = createEternalPhotonStream(scene, {
      photonCount: 2000,
      photonSpeed: 3.0,
      photonColor: 0xffff00
    })

    // 9. 维度交织网络
    const dimensionalWeave = createDimensionalWeaveNetwork(scene, {
      weaveStrands: 10,
      strandNodes: 30
    })

    // 10. 存在性场可视化（优化）
    const existenceField = createExistenceField(scene, {
      fieldResolution: 20,
      fieldIntensity: 1.0
    })

    // ==================== 动画序列 ====================

    // 阶段1: 永恒觉醒 - 时间螺旋展开（8秒）
    tl.to(camera.position, {
      x: 25,
      y: 80,
      z: 300,
      duration: 8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '永恒觉醒错误'
      )
    }, 0)

    tl.call(() => {
      eternalSpirals.unwind()
      infiniteFractal.expand()
    }, null, 0.5)

    tl.to(camera, {
      fov: 110,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '永恒视野错误'
      )
    }, 1)

    // 阶段2: 维度坍缩 - 10D到3D降维（8秒）
    tl.to(camera.position, {
      x: -20,
      y: 50,
      z: 250,
      duration: 8,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '维度坍缩错误'
      )
    }, 8)

    tl.call(() => {
      dimensionCollapse.collapse()
      eternalSymmetry.manifest()
    }, null, 8.5)

    tl.to(camera, {
      fov: 100,
      duration: 6,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '坍缩视野错误'
      )
    }, 9)

    // 阶段3: 永恒记忆 - 信息全息投影（8秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 150,
      duration: 8,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '永恒记忆错误'
      )
    }, 16)

    tl.call(() => {
      holographicMemory.access()
      timeHolography.project()
    }, null, 16.5)

    tl.to(camera, {
      fov: 90,
      duration: 6,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '记忆视野错误'
      )
    }, 17)

    // 阶段4: 存在之巅 - 完美和谐（6秒）
    tl.to(camera.position, {
      x: 10,
      y: -15,
      z: 80,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '存在之巅错误'
      )
    }, 24)

    tl.call(() => {
      infiniteResonance.resonate()
      eternalPhotons.flow()
      dimensionalWeave.weave()
      existenceField.manifest()
    }, null, 24.5)

    tl.to(camera, {
      fov: 85,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '存在视野错误'
      )
    }, 26)

    // ==================== 清理函数 ====================
    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true

      try {
        eternalSpirals.dispose()
        dimensionCollapse.dispose()
        infiniteFractal.dispose()
        eternalSymmetry.dispose()
        holographicMemory.dispose()
        timeHolography.dispose()
        infiniteResonance.dispose()
        eternalPhotons.dispose()
        dimensionalWeave.dispose()
        existenceField.dispose()
      } catch (error) {
        console.error('Holographic Eternity Zenith cleanup error:', error)
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
  }
  catch (error) {
    onError && onError(error)
    throw error
  }
}

// ==================== 系统创建函数 ====================

/**
 * 创建永恒时间螺旋系统
 */
function createEternalTimeSpirals(scene, options = {}) {
  const { spiralCount = 8, spiralColors = [], spiralRadii = [] } = options
  const spirals = []

  for (let i = 0; i < spiralCount; i++) {
    const geometry = new THREE.TorusGeometry(spiralRadii[i], 0.5, 16, 200)
    const material = new HolographicMaterial({
      color: spiralColors[i] || 0x00ffff,
      scanlineSpeed: 0.3 + i * 0.15,
      scanlineIntensity: 0.3,
      glowIntensity: 1.2,
      opacity: 0
    })

    const torus = new THREE.Mesh(geometry, material)
    torus.rotation.x = Math.PI / 2
    scene.add(torus)

    spirals.push({
      mesh: torus,
      radius: spiralRadii[i],
      rotationSpeed: 0.002 * (i + 1),
      verticalSpeed: 0.001 * (i + 1)
    })
  }

  let animationId = null

  function update() {
    const time = performance.now() * 0.001
    spirals.forEach((spiral, i) => {
      spiral.mesh.rotation.z += spiral.rotationSpeed
      spiral.mesh.position.y = Math.sin(Date.now() * 0.0005 + i * 0.5) * 10

      // 更新材质时间
      if (spiral.mesh.material.uniforms.uTime) {
        spiral.mesh.material.uniforms.uTime.value = time
      }
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    unwind() {
      spirals.forEach((spiral, i) => {
        gsap.to(spiral.mesh.material, {
          opacity: 0.5,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.15
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      spirals.forEach(spiral => {
        scene.remove(spiral.mesh)
        spiral.mesh.geometry.dispose()
        spiral.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建维度坍缩序列
 */
function createDimensionCollapseSequence(scene, options = {}) {
  const { startDimension = 10, endDimension = 3, collapseSpeed = 1.0 } = options

  const dimensions = []

  for (let d = startDimension; d >= endDimension; d--) {
    const radius = (startDimension - d + 1) * 30
    const geometry = new THREE.IcosahedronGeometry(radius, d)
    const material = new HolographicMaterial({
      color: new THREE.Color().setHSL(d / startDimension, 1, 0.5),
      scanlineSpeed: 0.5,
      glitchIntensity: 0.2,
      opacity: 0
    })

    const icosahedron = new THREE.Mesh(geometry, material)
    scene.add(icosahedron)

    dimensions.push({ mesh: icosahedron, dimension: d, baseRadius: radius })
  }

  return {
    collapse() {
      dimensions.forEach((dim, i) => {
        gsap.to(dim.mesh.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 3,
          ease: 'power2.in',
          delay: i * 0.5
        })
        gsap.to(dim.mesh.material, {
          opacity: 0.4,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.5,
          onComplete: () => {
            gsap.to(dim.mesh.material, {
              opacity: 0,
              duration: 2,
              delay: 1
            })
          }
        })
      })
    },
    dispose() {
      dimensions.forEach(dim => {
        scene.remove(dim.mesh)
        dim.mesh.geometry.dispose()
        dim.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建无限分形宇宙
 */
function createInfiniteFractalUniverse(scene, options = {}) {
  const { fractalDepth = 5, fractalIterations = 3, fractalColor = 0x00ffff } = options

  const fractalGroup = new THREE.Group()

  function createFractalIteration(parent, depth) {
    if (depth > fractalDepth) return

    const scale = 0.5
    const count = Math.pow(fractalIterations, depth)
    const geometry = new THREE.OctahedronGeometry(5, 0)
    const material = new HolographicMaterial({
      color: fractalColor,
      scanlineSpeed: 0.5 + depth * 0.2,
      glowIntensity: 0.8,
      opacity: 0
    })

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geometry, material)

      const theta = (i / count) * Math.PI * 2
      const phi = Math.acos(2 * (i / count) - 1)
      const r = parent ? parent.scale.x * 2 : 10

      mesh.position.set(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r
      )

      mesh.scale.setScalar(scale)
      fractalGroup.add(mesh)

      createFractalIteration(mesh, depth + 1)
    }
  }

  createFractalIteration(null, 0)
  scene.add(fractalGroup)

  return {
    expand() {
      const meshes = []
      fractalGroup.traverse(obj => {
        if (obj.isMesh) meshes.push(obj)
      })

      meshes.forEach((mesh, i) => {
        gsap.to(mesh.material, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.001
        })
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 2,
          ease: 'back.out',
          delay: i * 0.001
        })
      })
    },
    dispose() {
      scene.remove(fractalGroup)
      fractalGroup.traverse(obj => {
        if (obj.isMesh) {
          obj.geometry.dispose()
          obj.material.dispose()
        }
      })
    }
  }
}

/**
 * 创建永恒对称场
 */
function createEternalSymmetryField(scene, options = {}) {
  const { symmetryPlatonic = [], symmetryCount = 4 } = options

  const solids = []

  symmetryPlatonic.forEach((type, i) => {
    let geometry

    switch (type) {
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(15, 0)
        break
      case 'cube':
        geometry = new THREE.BoxGeometry(20, 20, 20)
        break
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(15, 0)
        break
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(12, 0)
        break
    }

    const material = new HolographicMaterial({
      color: new THREE.Color().setHSL(i / symmetryPlatonic.length, 1, 0.5),
      scanlineSpeed: 0.5,
      glowIntensity: 1.0,
      opacity: 0
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    solids.push({ mesh, type, rotationSpeed: 0.005 * (i + 1) })
  })

  let animationId = null

  function update() {
    const time = performance.now() * 0.001
    solids.forEach(solid => {
      solid.mesh.rotation.x += solid.rotationSpeed
      solid.mesh.rotation.y += solid.rotationSpeed * 0.7

      // 更新材质时间
      if (solid.mesh.material.uniforms.uTime) {
        solid.mesh.material.uniforms.uTime.value = time
      }
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    manifest() {
      solids.forEach((solid, i) => {
        gsap.to(solid.mesh.material, {
          opacity: 0.4,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.3
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      solids.forEach(solid => {
        scene.remove(solid.mesh)
        solid.mesh.geometry.dispose()
        solid.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建全息记忆库
 */
function createHolographicMemoryLibrary(scene, options = {}) {
  const { memoryBlocks = 4000, blockLayers = 10, informationDensity = 1.0 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(memoryBlocks * 3)
  const colors = new Float32Array(memoryBlocks * 3)

  for (let i = 0; i < memoryBlocks; i++) {
    const layer = Math.floor(i / (memoryBlocks / blockLayers))
    const radius = 20 + layer * 15
    const angle = (i / (memoryBlocks / blockLayers)) * Math.PI * 2 + layer * 0.5

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const hue = 0.5 + (layer / blockLayers) * 0.5
    const color = new THREE.Color().setHSL(hue, 0.8, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  return {
    access() {
      gsap.to(material, {
        opacity: 0.7,
        duration: 3,
        ease: 'power2.out'
      })
    },
    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建时间全息投影
 */
function createTimeHolography(scene, options = {}) {
  const { timelineStreams = 12, temporalPoints = 200 } = options

  const streams = []

  for (let s = 0; s < timelineStreams; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(temporalPoints * 3)
    const colors = new Float32Array(temporalPoints * 3)

    const baseAngle = (s / timelineStreams) * Math.PI * 2

    for (let i = 0; i < temporalPoints; i++) {
      const t = i / temporalPoints
      const radius = 40 + t * 80

      positions[i * 3] = Math.cos(baseAngle) * radius
      positions[i * 3 + 1] = (t - 0.5) * 100
      positions[i * 3 + 2] = Math.sin(baseAngle) * radius

      // 过去绿色，现在白色，未来金色
      const hue = t < 0.33 ? 0.33 : t < 0.66 ? 0 : 0.15
      const color = new THREE.Color().setHSL(hue, 1, 0.6)
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
    scene.add(line)

    streams.push({ line, baseAngle })
  }

  return {
    project() {
      streams.forEach((stream, i) => {
        gsap.to(stream.line.material, {
          opacity: 0.5,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    dispose() {
      streams.forEach(stream => {
        scene.remove(stream.line)
        stream.line.geometry.dispose()
        stream.line.material.dispose()
      })
    }
  }
}

/**
 * 创建无限能量共振场
 */
function createInfiniteResonanceField(scene, options = {}) {
  const { resonanceRings = 20, resonanceHarmonics = [] } = options

  const rings = []

  for (let i = 0; i < resonanceRings; i++) {
    const harmonic = resonanceHarmonics[i % resonanceHarmonics.length]
    const radius = 10 + i * 8

    const geometry = new THREE.TorusGeometry(radius, 0.2, 16, 100)
    const material = new HolographicMaterial({
      color: 0xffff00,
      scanlineSpeed: harmonic * 0.5,
      glowIntensity: 1.5,
      opacity: 0
    })

    const torus = new THREE.Mesh(geometry, material)
    torus.rotation.x = Math.PI / 2
    scene.add(torus)

    rings.push({ mesh: torus, harmonic, radius })
  }

  return {
    resonate() {
      rings.forEach((ring, i) => {
        gsap.to(ring.mesh.material, {
          opacity: 0.4,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.05
        })
      })
    },
    dispose() {
      rings.forEach(ring => {
        scene.remove(ring.mesh)
        ring.mesh.geometry.dispose()
        ring.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建永恒光子流
 */
function createEternalPhotonStream(scene, options = {}) {
  const { photonCount = 15000, photonSpeed = 3.0, photonColor = 0xffff00 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(photonCount * 3)
  const colors = new Float32Array(photonCount * 3)

  const baseColor = new THREE.Color(photonColor)

  for (let i = 0; i < photonCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 200 * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const colorVar = 0.8 + Math.random() * 0.4
    colors[i * 3] = baseColor.r * colorVar
    colors[i * 3 + 1] = baseColor.g * colorVar
    colors[i * 3 + 2] = baseColor.b * colorVar
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let animationId = null

  function update() {
    const posArray = geometry.attributes.position.array
    for (let i = 0; i < photonCount; i++) {
      // 光子向内流动
      const x = posArray[i * 3]
      const y = posArray[i * 3 + 1]
      const z = posArray[i * 3 + 2]

      const dist = Math.sqrt(x * x + y * y + z * z)
      const factor = 0.99

      posArray[i * 3] = x * factor
      posArray[i * 3 + 1] = y * factor
      posArray[i * 3 + 2] = z * factor

      // 重置到外围
      if (dist < 5) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 200

        posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        posArray[i * 3 + 2] = r * Math.cos(phi)
      }
    }
    geometry.attributes.position.needsUpdate = true
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    flow() {
      gsap.to(material, {
        opacity: 0.6,
        duration: 3,
        ease: 'power2.out'
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
 * 创建维度交织网络
 */
function createDimensionalWeaveNetwork(scene, options = {}) {
  const { weaveStrands = 30, strandNodes = 100 } = options

  const strands = []

  for (let s = 0; s < weaveStrands; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(strandNodes * 3)
    const colors = new Float32Array(strandNodes * 3)

    const baseAngle = (s / weaveStrands) * Math.PI * 2
    const hue = s / weaveStrands

    for (let i = 0; i < strandNodes; i++) {
      const t = i / strandNodes
      const radius = 30 + t * 70
      const verticalOffset = Math.sin(t * Math.PI * 4 + s * 0.5) * 20

      positions[i * 3] = Math.cos(baseAngle + t * Math.PI) * radius
      positions[i * 3 + 1] = verticalOffset
      positions[i * 3 + 2] = Math.sin(baseAngle + t * Math.PI) * radius

      const color = new THREE.Color().setHSL(hue, 1, 0.5)
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
    scene.add(line)

    strands.push({ line, baseAngle })
  }

  return {
    weave() {
      strands.forEach((strand, i) => {
        gsap.to(strand.line.material, {
          opacity: 0.4,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.05
        })
      })
    },
    dispose() {
      strands.forEach(strand => {
        scene.remove(strand.line)
        strand.line.geometry.dispose()
        strand.line.material.dispose()
      })
    }
  }
}

/**
 * 创建存在性场可视化
 */
function createExistenceField(scene, options = {}) {
  const { fieldResolution = 50, fieldIntensity = 1.0 } = options

  const geometry = new THREE.PlaneGeometry(300, 300, fieldResolution, fieldResolution)
  const material = new HolographicMaterial({
    color: 0xffffff,
    scanlineSpeed: 0.5,
    glowIntensity: fieldIntensity,
    opacity: 0.1
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -50
  scene.add(mesh)

  return {
    manifest() {
      gsap.to(material, {
        opacity: 0.2,
        duration: 3,
        ease: 'power2.out'
      })
    },
    dispose() {
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    }
  }
}
