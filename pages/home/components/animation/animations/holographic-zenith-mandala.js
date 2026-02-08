/**
 * 全息禅意曼陀罗 - 全新全息艺术特效
 * 概念：融合东方禅意美学与量子物理,以全息形式展现宇宙的和谐与平衡
 * 
 * 艺术特色：
 * - 曼陀罗神圣几何：完美对称的放射状图案
 * - 禅意留白：虚空与光芒的对比
 * - 金银层次：金主银辅,明暗相生
 * - 动态呼吸：与宇宙同步的脉动
 * 
 * 技术突破：
 * - 6层嵌套曼陀罗结构
 * - 黄金比例螺旋
 * - 量子干涉可视化
 * - 声波共振模拟
 * - 意识流动场
 * - 虚空能量漩涡
 * - 光子相干态
 * - 维度门户开启
 * - 时间涟漪扩散
 * 
 * 使用HolographicMaterial实现真正的全息效果
 * 使用ParticleFactory统一粒子创建
 * 使用PerformanceMonitor性能监控
 * 
 * 动画时长：25秒
 * 粒子数量：8000（优化版）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'
import {
  HolographicMaterial,
  createHolographicMesh
} from './holographic/holographic-core.js'

export default function animateHolographicZenithMandala(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 200), 90, controls)
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-zenith-mandala' })
      },
      onError,
      '全息禅意曼陀罗 (神话级)',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 神圣曼陀罗核心（6层结构）
    const sacredMandala = createSacredMandala(scene, {
      layers: 6,
      baseRadius: 10,
      growthRatio: 1.618, // 黄金比例
      primaryColor: 0xffd700, // 金色
      secondaryColor: 0xc0c0c0 // 银色
    })

    // 2. 黄金螺旋光流（斐波那契数列）
    const goldenSpiral = createGoldenSpiralFlow(scene, {
      spiralCount: 8,
      fibonacciSequence: [1, 1, 2, 3, 5, 8, 13, 21],
      color: 0xffa500
    })

    // 3. 量子干涉模式
    const quantumInterference = createQuantumInterferencePattern(scene, {
      waveCount: 12,
      frequency: 1.618,
      intensity: 0.8
    })

    // 4. 声波共振场（Om频率可视化）
    const soundResonance = createSoundResonanceField(scene, {
      resonanceRings: 7,
      baseFrequency: 432, // Om频率
      harmonicRatios: [1, 1.5, 2, 2.5, 3, 3.5, 4]
    })

    // 5. 意识流动粒子
    const consciousnessFlow = createConsciousnessFlowParticles(scene, {
      flowCount: 6,
      particlesPerFlow: 400,
      flowColor: 0xffffff
    })

    // 6. 虚空能量漩涡
    const voidVortex = createVoidEnergyVortex(scene, {
      vortexLayers: 5,
      rotationSpeeds: [0.001, 0.002, 0.003, 0.004, 0.005]
    })

    // 7. 光子相干态
    const photonCoherence = createPhotonCoherenceField(scene, {
      photonCount: 2000,
      coherenceLength: 0.5
    })

    // 8. 维度门户（8个方向）
    const dimensionalPortals = createDimensionalPortals(scene, {
      portalCount: 8,
      portalRadius: 80,
      activationOrder: [0, 2, 4, 6, 1, 3, 5, 7]
    })

    // 9. 时间涟漪
    const timeRipples = createTimeRipples(scene, {
      rippleCount: 15,
      expansionSpeed: 20
    })

    // ==================== 动画序列 ====================

    // 阶段1: 禅意初现 - 曼陀罗展开（7秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 150,
      duration: 7,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '禅意初现错误'
      )
    }, 0)

    tl.call(() => {
      sacredMandala.bloom()
      soundResonance.harmonize()
    }, null, 0.5)

    tl.to(camera, {
      fov: 100,
      duration: 5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '禅意视野错误'
      )
    }, 1)

    // 阶段2: 黄金流动 - 螺旋展开（6秒）
    tl.to(camera.position, {
      x: 30,
      y: 20,
      z: 120,
      duration: 6,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '黄金流动错误'
      )
    }, 7)

    tl.call(() => {
      goldenSpiral.unwind()
      quantumInterference.interfere()
    }, null, 7.5)

    tl.to(camera, {
      fov: 95,
      duration: 4,
      ease: 'power3.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '流动视野错误'
      )
    }, 8)

    // 阶段3: 意识觉醒 - 能量汇聚（6秒）
    tl.to(camera.position, {
      x: -20,
      y: -10,
      z: 100,
      duration: 6,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '意识觉醒错误'
      )
    }, 13)

    tl.call(() => {
      consciousnessFlow.surge()
      voidVortex.spin()
    }, null, 13.5)

    tl.to(camera, {
      fov: 90,
      duration: 4,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '觉醒视野错误'
      )
    }, 14)

    // 阶段4: 维度开启 - 门户显现（6秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 80,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '维度开启错误'
      )
    }, 19)

    tl.call(() => {
      photonCoherence.coalesce()
      dimensionalPortals.activate()
      timeRipples.expand()
    }, null, 19.5)

    tl.to(camera, {
      fov: 85,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '开启视野错误'
      )
    }, 20)

    // ==================== 清理函数 ====================
    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true

      try {
        sacredMandala.dispose()
        goldenSpiral.dispose()
        quantumInterference.dispose()
        soundResonance.dispose()
        consciousnessFlow.dispose()
        voidVortex.dispose()
        photonCoherence.dispose()
        dimensionalPortals.dispose()
        timeRipples.dispose()
      } catch (error) {
        console.error('Holographic Zenith Mandala cleanup error:', error)
      }
    }

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

// ==================== 系统创建函数 ====================

/**
 * 创建神圣曼陀罗核心
 */
function createSacredMandala(scene, options = {}) {
  const {
    layers = 6,
    baseRadius = 10,
    growthRatio = 1.618,
    primaryColor = 0xffd700,
    secondaryColor = 0xc0c0c0
  } = options

  const mandala = []

  for (let i = 0; i < layers; i++) {
    const radius = baseRadius * Math.pow(growthRatio, i)
    const segments = 6 * (i + 2) // 几何对称增加

    const geometry = new THREE.CircleGeometry(radius, segments)
    const material = new HolographicMaterial({
      color: i % 2 === 0 ? primaryColor : secondaryColor,
      scanlineSpeed: 0.3 + i * 0.1,
      scanlineIntensity: 0.4,
      glowIntensity: 0.8,
      opacity: 0
    })
    material.uniforms.uTime.value = 0

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    scene.add(mesh)

    mandala.push({
      mesh,
      radius,
      rotationSpeed: 0.001 * (i + 1) * (i % 2 === 0 ? 1 : -1)
    })
  }

  let animationId = null

  function update() {
    const time = performance.now() * 0.001
    mandala.forEach((layer, i) => {
      layer.mesh.rotation.z += layer.rotationSpeed

      // 呼吸效果 - 黄金比例频率
      const breath = 1 + Math.sin(time * 0.5 + i * 0.618) * 0.08
      layer.mesh.scale.setScalar(breath)

      if (layer.mesh.material.uniforms.uTime) {
        layer.mesh.material.uniforms.uTime.value = time
      }
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    bloom() {
      mandala.forEach((layer, i) => {
        gsap.to(layer.mesh.material, {
          opacity: 0.6 - i * 0.08,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.2
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      mandala.forEach(layer => {
        scene.remove(layer.mesh)
        layer.mesh.geometry.dispose()
        layer.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建黄金螺旋光流
 */
function createGoldenSpiralFlow(scene, options = {}) {
  const {
    spiralCount = 8,
    fibonacciSequence = [1, 1, 2, 3, 5, 8, 13, 21],
    color = 0xffa500
  } = options

  const spirals = []

  for (let i = 0; i < spiralCount; i++) {
    const points = []
    const count = 100
    const fib = fibonacciSequence[i % fibonacciSequence.length]

    for (let j = 0; j < count; j++) {
      const angle = (j / count) * Math.PI * 8
      const radius = (j / count) * fib * 2
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const line = new THREE.Line(geometry, material)
    line.rotation.x = -Math.PI / 2
    line.rotation.z = (i / spiralCount) * Math.PI * 2
    scene.add(line)

    spirals.push({ line, fib, rotationSpeed: 0.002 * (i + 1) })
  }

  let animationId = null

  function update() {
    spirals.forEach(spiral => {
      spiral.line.rotation.z += spiral.rotationSpeed
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    unwind() {
      spirals.forEach((spiral, i) => {
        gsap.to(spiral.line.material, {
          opacity: 0.5,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      spirals.forEach(spiral => {
        scene.remove(spiral.line)
        spiral.line.geometry.dispose()
        spiral.line.material.dispose()
      })
    }
  }
}

/**
 * 创建量子干涉模式
 */
function createQuantumInterferencePattern(scene, options = {}) {
  const {
    waveCount = 12,
    frequency = 1.618,
    intensity = 0.8
  } = options

  const geometry = new THREE.PlaneGeometry(150, 150, 64, 64)
  const material = new HolographicMaterial({
    color: 0x00ffff,
    scanlineSpeed: 0.5,
    scanlineIntensity: 0.3,
    glowIntensity: intensity,
    opacity: 0
  })
  material.uniforms.uTime.value = 0

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -20
  scene.add(mesh)

  const waves = []

  for (let i = 0; i < waveCount; i++) {
    const geometry = new THREE.RingGeometry(10 + i * 8, 12 + i * 8, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = -Math.PI / 2
    scene.add(ring)

    waves.push({ ring, radius: 10 + i * 8 })
  }

  return {
    interfere() {
      gsap.to(mesh.material, {
        opacity: 0.3,
        duration: 2,
        ease: 'power2.out'
      })

      waves.forEach((wave, i) => {
        gsap.to(wave.ring.material, {
          opacity: 0.4 - i * 0.03,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    dispose() {
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()

      waves.forEach(wave => {
        scene.remove(wave.ring)
        wave.ring.geometry.dispose()
        wave.ring.material.dispose()
      })
    }
  }
}

/**
 * 创建声波共振场（Om频率）
 */
function createSoundResonanceField(scene, options = {}) {
  const {
    resonanceRings = 7,
    baseFrequency = 432,
    harmonicRatios = [1, 1.5, 2, 2.5, 3, 3.5, 4]
  } = options

  const rings = []

  for (let i = 0; i < resonanceRings; i++) {
    const geometry = new THREE.TorusGeometry(
      baseFrequency * 0.05 * harmonicRatios[i],
      0.3,
      16,
      100
    )
    const material = new HolographicMaterial({
      color: 0xffd700,
      scanlineSpeed: 0.4 + i * 0.1,
      glowIntensity: 1.2,
      opacity: 0
    })
    material.uniforms.uTime.value = 0

    const torus = new THREE.Mesh(geometry, material)
    torus.rotation.x = Math.PI / 2
    scene.add(torus)

    rings.push({
      mesh: torus,
      rotationSpeed: 0.001 * (i + 1),
      baseY: 0
    })
  }

  let animationId = null

  function update() {
    const time = performance.now() * 0.001
    rings.forEach((ring, i) => {
      ring.mesh.rotation.z += ring.rotationSpeed
      ring.mesh.position.y = Math.sin(time * 0.3 + i * 0.5) * 5

      if (ring.mesh.material.uniforms.uTime) {
        ring.mesh.material.uniforms.uTime.value = time
      }
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    harmonize() {
      rings.forEach((ring, i) => {
        gsap.to(ring.mesh.material, {
          opacity: 0.5 - i * 0.05,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.15
        })
      })
    },
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
 * 创建意识流动粒子
 */
function createConsciousnessFlowParticles(scene, options = {}) {
  const {
    flowCount = 6,
    particlesPerFlow = 400,
    flowColor = 0xffffff
  } = options

  const flows = []

  for (let f = 0; f < flowCount; f++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particlesPerFlow * 3)
    const sizes = new Float32Array(particlesPerFlow)

    for (let i = 0; i < particlesPerFlow; i++) {
      const angle = (f / flowCount) * Math.PI * 2
      const radius = 20 + (i / particlesPerFlow) * 60
      const y = -30 + (i / particlesPerFlow) * 60

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * radius

      sizes[i] = 0.5 + Math.random() * 1.5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      color: flowColor,
      size: 1,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    flows.push({ points, angle: (f / flowCount) * Math.PI * 2 })
  }

  return {
    surge() {
      flows.forEach((flow, i) => {
        gsap.to(flow.points.material, {
          opacity: 0.7,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.15
        })
      })
    },
    dispose() {
      flows.forEach(flow => {
        scene.remove(flow.points)
        flow.points.geometry.dispose()
        flow.points.material.dispose()
      })
    }
  }
}

/**
 * 创建虚空能量漩涡
 */
function createVoidEnergyVortex(scene, options = {}) {
  const {
    vortexLayers = 5,
    rotationSpeeds = [0.001, 0.002, 0.003, 0.004, 0.005]
  } = options

  const vortexes = []

  for (let i = 0; i < vortexLayers; i++) {
    const geometry = new THREE.RingGeometry(30 + i * 15, 35 + i * 15, 64)
    const material = new HolographicMaterial({
      color: 0x1a1a2e,
      scanlineSpeed: 0.2,
      glowIntensity: 0.5,
      opacity: 0
    })
    material.uniforms.uTime.value = 0

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = -Math.PI / 2
    scene.add(ring)

    vortexes.push({ ring, rotationSpeed: rotationSpeeds[i] })
  }

  let animationId = null

  function update() {
    const time = performance.now() * 0.001
    vortexes.forEach((vortex, i) => {
      vortex.ring.rotation.z += vortex.rotationSpeed

      if (vortex.ring.material.uniforms.uTime) {
        vortex.ring.material.uniforms.uTime.value = time
      }
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    spin() {
      vortexes.forEach((vortex, i) => {
        gsap.to(vortex.ring.material, {
          opacity: 0.3 - i * 0.05,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      vortexes.forEach(vortex => {
        scene.remove(vortex.ring)
        vortex.ring.geometry.dispose()
        vortex.ring.material.dispose()
      })
    }
  }
}

/**
 * 创建光子相干态
 */
function createPhotonCoherenceField(scene, options = {}) {
  const {
    photonCount = 2000,
    coherenceLength = 0.5
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(photonCount * 3)
  const colors = new Float32Array(photonCount * 3)

  const color1 = new THREE.Color(0xffd700)
  const color2 = new THREE.Color(0xffffff)

  for (let i = 0; i < photonCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 10 + Math.random() * 40

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const t = Math.random()
    const color = color1.clone().lerp(color2, t)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  return {
    coalesce() {
      gsap.to(material, {
        opacity: 0.6,
        duration: 2.5,
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
 * 创建维度门户
 */
function createDimensionalPortals(scene, options = {}) {
  const {
    portalCount = 8,
    portalRadius = 80,
    activationOrder = [0, 2, 4, 6, 1, 3, 5, 7]
  } = options

  const portals = []

  for (let i = 0; i < portalCount; i++) {
    const geometry = new THREE.TorusGeometry(8, 0.5, 16, 32)
    const material = new HolographicMaterial({
      color: 0x00ffff,
      scanlineSpeed: 0.6,
      glowIntensity: 1.5,
      opacity: 0
    })
    material.uniforms.uTime.value = 0

    const portal = new THREE.Mesh(geometry, material)
    const angle = (i / portalCount) * Math.PI * 2
    portal.position.x = Math.cos(angle) * portalRadius
    portal.position.z = Math.sin(angle) * portalRadius
    portal.position.y = 0
    portal.rotation.y = angle
    scene.add(portal)

    portals.push({ mesh: portal, angle, index: i })
  }

  return {
    activate() {
      activationOrder.forEach((portalIndex, i) => {
        const portal = portals[portalIndex]
        gsap.to(portal.mesh.material, {
          opacity: 0.7,
          duration: 1,
          ease: 'power2.out',
          delay: i * 0.2
        })

        gsap.to(portal.mesh.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1.5,
          ease: 'back.out',
          delay: i * 0.2
        })
      })
    },
    dispose() {
      portals.forEach(portal => {
        scene.remove(portal.mesh)
        portal.mesh.geometry.dispose()
        portal.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建时间涟漪
 */
function createTimeRipples(scene, options = {}) {
  const {
    rippleCount = 15,
    expansionSpeed = 20
  } = options

  const ripples = []

  for (let i = 0; i < rippleCount; i++) {
    const geometry = new THREE.RingGeometry(5 + i * 10, 7 + i * 10, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })

    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = -Math.PI / 2
    ripple.position.y = -40
    ripple.scale.setScalar(0)
    scene.add(ripple)

    ripples.push({ ripple, baseRadius: 5 + i * 10 })
  }

  return {
    expand() {
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.ripple.scale, {
          x: 3,
          y: 3,
          z: 3,
          duration: 3,
          ease: 'power2.out',
          delay: i * 0.15
        })

        gsap.to(ripple.ripple.material, {
          opacity: 0.4,
          duration: 1,
          ease: 'power2.out',
          delay: i * 0.15,
          onComplete: () => {
            gsap.to(ripple.ripple.material, {
              opacity: 0,
              duration: 2,
              delay: 1
            })
          }
        })
      })
    },
    dispose() {
      ripples.forEach(ripple => {
        scene.remove(ripple.ripple)
        ripple.ripple.geometry.dispose()
        ripple.ripple.material.dispose()
      })
    }
  }
}
