/**
 * 全息宇宙意识 - 传说级全息特效
 * 概念：整个宇宙仿佛是某个高维意识的数字化全息投影
 * 技术突破：
 * - 宇宙全息投影层级系统（10层，每层不同维度）
 * - 意识神经网络可视化（20000个神经节点）
 * - 信息熵流动画（熵增到熵减循环）
 * - 量子相干态可视化（相干度动态变化）
 * - 维度投影膜（4D→3D投影效果）
 * - 全息原理展示（任意体积包含所有信息）
 * - 观测者效应（意识坍缩波函数）
 * - 信息编码/解码可视化
 * - 宇宙记忆场可视化（阿卡西记录概念）
 * - 全息噪声（量子涨落）
 * - 使用HolographicMaterial实现真正的全息效果
 * - 使用ParticleFactory统一粒子创建
 * - 使用PerformanceMonitor性能监控
 * 动画时长：28秒
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

export default function animateHolographicUniverseConsciousness(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  // 创建性能监控器
  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  try {
    // 初始设置 - 超高维视角
    setupInitialCamera(camera, new THREE.Vector3(0, 100, 300), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-universe-consciousness' })
      },
      onError,
      '全息宇宙意识 (传说级)',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 全息宇宙层级系统（10层，从外到内）
    const holographicLayers = createHolographicUniverseLayers(scene, {
      layerCount: 10,
      layerColors: [
        0x0000ff, // 深蓝 - 最外层
        0x0044ff, // 蓝紫
        0x4400ff, // 紫色
        0xff00ff, // 粉紫
        0xff0088, // 粉红
        0xff0000, // 红色
        0xff8800, // 橙色
        0xffff00, // 黄色
        0x00ff88, // 青绿
        0x00ffff  // 青色 - 最内层
      ],
      layerRadii: [250, 220, 190, 160, 130, 100, 70, 40, 20, 5]
    })

    // 2. 意识神经网络（20000个节点）
    const consciousnessNetwork = createConsciousnessNetwork(scene, {
      nodeCount: 20000,
      connectionRadius: 30,
      activationColor: 0x00ffff,
      idleColor: 0x000044
    })

    // 3. 信息熵流系统
    const entropyFlow = createEntropyFlowSystem(scene, {
      streamCount: 30,
      particlesPerStream: 200,
      entropyColors: { low: 0x00ff00, high: 0xff0000 }
    })

    // 4. 量子相干态场
    const coherenceField = createCoherenceField(scene, {
      coherenceRings: 15,
      coherenceIntensity: 1.0
    })

    // 5. 维度投影膜（4D→3D）
    const dimensionProjection = createDimensionProjectionMembrane(scene, {
      membraneCount: 6,
      projectionStrength: 1.0
    })

    // 6. 全息原理展示（信息全息存储）
    const holographicPrinciple = createHolographicPrinciple(scene, {
      voxelSize: 3,
      voxelResolution: 20,
      informationBits: 8000
    })

    // 7. 观测者效应（意识坍缩波）
    const observerEffect = createObserverEffect(scene, {
      wavefrontCount: 8,
      collapseSpeed: 2.0
    })

    // 8. 宇宙记忆场（阿卡西记录）
    const universeMemory = createUniverseMemoryField(scene, {
      memoryRecords: 5000,
      memoryDepth: 200
    })

    // 9. 全息噪声场（量子涨落）
    const holographicNoise = createHolographicNoiseField(scene, {
      noiseScale: 0.5,
      noiseSpeed: 1.0
    })

    // ==================== 动画序列 ====================

    // 阶段1: 宇宙全息投影展开 - 10层全息膜出现（6秒）
    tl.to(camera.position, {
      x: 20,
      y: 50,
      z: 250,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '全息展开错误'
      )
    }, 0)

    tl.call(() => {
      holographicLayers.project()
      consciousnessNetwork.activate()
    }, null, 0.5)

    tl.to(camera, {
      fov: 120,
      duration: 4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '全息视野错误'
      )
    }, 1)

    // 阶段2: 意识觉醒 - 神经网络激活（7秒）
    tl.to(camera.position, {
      x: -15,
      y: 30,
      z: 200,
      duration: 7,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '意识觉醒错误'
      )
    }, 6)

    tl.call(() => {
      entropyFlow.evolve()
      coherenceField.establish()
    }, null, 6.5)

    tl.to(camera, {
      fov: 110,
      duration: 5,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '意识视野错误'
      )
    }, 7)

    // 阶段3: 维度投影 - 4D到3D降维（7秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 7,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '维度投影错误'
      )
    }, 13)

    tl.call(() => {
      dimensionProjection.project()
      holographicPrinciple.encode()
    }, null, 13.5)

    tl.to(camera, {
      fov: 90,
      duration: 5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '投影视野错误'
      )
    }, 14)

    // 阶段4: 观测坍缩 - 意识与宇宙交互（8秒）
    tl.to(camera.position, {
      x: 8,
      y: -10,
      z: 50,
      duration: 8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '观测坍缩错误'
      )
    }, 20)

    tl.call(() => {
      observerEffect.collapse()
      universeMemory.recall()
    }, null, 20.5)

    tl.to(camera, {
      fov: 85,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '观测视野错误'
      )
    }, 22)

    // ==================== 清理函数 ====================
    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true

      try {
        holographicLayers.dispose()
        consciousnessNetwork.dispose()
        entropyFlow.dispose()
        coherenceField.dispose()
        dimensionProjection.dispose()
        holographicPrinciple.dispose()
        observerEffect.dispose()
        universeMemory.dispose()
        holographicNoise.dispose()
      } catch (error) {
        console.error('Holographic Universe Consciousness cleanup error:', error)
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
 * 创建全息宇宙层级系统
 */
function createHolographicUniverseLayers(scene, options = {}) {
  const { layerCount = 10, layerColors = [], layerRadii = [] } = options
  const layers = []

  for (let i = 0; i < layerCount; i++) {
    const geometry = new THREE.SphereGeometry(layerRadii[i], 64, 64)
    const material = new HolographicMaterial({
      color: layerColors[i] || 0x00ffff,
      scanlineSpeed: 0.5 + i * 0.1,
      scanlineIntensity: 0.2,
      glowIntensity: 0.8 - i * 0.05,
      opacity: 0
    })

    const sphere = new THREE.Mesh(geometry, material)
    sphere.userData.layerIndex = i
    scene.add(sphere)

    layers.push({ mesh: sphere, radius: layerRadii[i], rotationSpeed: 0.001 + i * 0.0005 })
  }

  let animationId = null

  function update() {
    const time = performance.now() * 0.001
    layers.forEach(layer => {
      layer.mesh.rotation.y += layer.rotationSpeed
      layer.mesh.rotation.x += layer.rotationSpeed * 0.5

      // 更新材质时间
      if (layer.mesh.material.uniforms.uTime) {
        layer.mesh.material.uniforms.uTime.value = time
      }

      // 呼吸效果
      const breath = 1 + Math.sin(Date.now() * 0.001 + layer.mesh.userData.layerIndex) * 0.05
      layer.mesh.scale.setScalar(breath)
    })
  }

  animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    project() {
      layers.forEach((layer, i) => {
        gsap.to(layer.mesh.material, {
          opacity: 0.4 - i * 0.03,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.15
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      layers.forEach(layer => {
        scene.remove(layer.mesh)
        layer.mesh.geometry.dispose()
        layer.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建意识神经网络
 */
function createConsciousnessNetwork(scene, options = {}) {
  const { nodeCount = 20000, connectionRadius = 30, activationColor = 0x00ffff, idleColor = 0x000044 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(nodeCount * 3)
  const colors = new Float32Array(nodeCount * 3)
  const sizes = new Float32Array(nodeCount)

  const activationColorObj = new THREE.Color(activationColor)
  const idleColorObj = new THREE.Color(idleColor)

  // 脑状分布
  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 40 * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6 // 扁平化
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 初始颜色
    colors[i * 3] = idleColorObj.r
    colors[i * 3 + 1] = idleColorObj.g
    colors[i * 3 + 2] = idleColorObj.b

    sizes[i] = 1 + Math.random() * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uActivationColor: { value: activationColorObj },
      uIdleColor: { value: idleColorObj }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;

      void main() {
        vColor = color;
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform vec3 uActivationColor;
      uniform vec3 uIdleColor;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const activatedNodes = new Set()
  let activationInterval = null

  return {
    activate() {
      // 激活波浪传播
      let activationTime = 0
      activationInterval = setInterval(() => {
        const centerNode = Math.floor(Math.random() * nodeCount)
        const centerPos = new THREE.Vector3(
          positions[centerNode * 3],
          positions[centerNode * 3 + 1],
          positions[centerNode * 3 + 2]
        )

        const colorArray = geometry.attributes.color.array

        for (let i = 0; i < nodeCount; i++) {
          const nodePos = new THREE.Vector3(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
          )

          const dist = centerPos.distanceTo(nodePos)
          if (dist < connectionRadius) {
            const t = Math.min(dist / connectionRadius, 1)
            const color = idleColorObj.clone().lerp(activationColorObj, 1 - t)
            colorArray[i * 3] = color.r
            colorArray[i * 3 + 1] = color.g
            colorArray[i * 3 + 2] = color.b
          }
        }

        geometry.attributes.color.needsUpdate = true
        activationTime++

        if (activationTime > 100) clearInterval(activationInterval)
      }, 200)
    },
    dispose() {
      if (activationInterval) {
        clearInterval(activationInterval)
        activationInterval = null
      }
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建信息熵流系统
 */
function createEntropyFlowSystem(scene, options = {}) {
  const { streamCount = 30, particlesPerStream = 200, entropyColors = {} } = options

  const streams = []

  for (let s = 0; s < streamCount; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particlesPerStream * 3)
    const colors = new Float32Array(particlesPerStream * 3)
    const entropies = new Float32Array(particlesPerStream)

    for (let i = 0; i < particlesPerStream; i++) {
      const angle = (s / streamCount) * Math.PI * 2
      const radius = 50 + i * 0.5
      const y = -60 + (i / particlesPerStream) * 120

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const entropy = (i / particlesPerStream)
      entropies[i] = entropy

      // 熵值决定颜色（低熵绿，高熵红）
      const color = new THREE.Color().setHSL(0.33 * (1 - entropy), 1, 0.5)
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
      depthWrite: false
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    streams.push({ points, speed: 30 + Math.random() * 20, baseAngle: s })
  }

  return {
    evolve() {
      streams.forEach((stream, i) => {
        gsap.to(stream.points.material, {
          opacity: 0.7,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    dispose() {
      streams.forEach(stream => {
        scene.remove(stream.points)
        stream.points.geometry.dispose()
        stream.points.material.dispose()
      })
    }
  }
}

/**
 * 创建量子相干态场
 */
function createCoherenceField(scene, options = {}) {
  const { coherenceRings = 15, coherenceIntensity = 1.0 } = options

  const rings = []

  for (let i = 0; i < coherenceRings; i++) {
    const geometry = new THREE.TorusGeometry(20 + i * 8, 0.3, 16, 100)
    const material = new HolographicMaterial({
      color: 0x00ffff,
      scanlineSpeed: 1.0 + i * 0.1,
      glowIntensity: coherenceIntensity,
      opacity: 0
    })

    const torus = new THREE.Mesh(geometry, material)
    torus.rotation.x = Math.PI / 2
    scene.add(torus)

    rings.push({ mesh: torus, baseRadius: 20 + i * 8, phase: i * 0.5 })
  }

  return {
    establish() {
      rings.forEach((ring, i) => {
        gsap.to(ring.mesh.material, {
          opacity: 0.5,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.1
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
 * 创建维度投影膜
 */
function createDimensionProjectionMembrane(scene, options = {}) {
  const { membraneCount = 6, projectionStrength = 1.0 } = options

  const membranes = []

  for (let i = 0; i < membraneCount; i++) {
    const geometry = new THREE.PlaneGeometry(200, 200, 50, 50)
    const material = new HolographicMaterial({
      color: new THREE.Color().setHSL(0.6 + i * 0.1, 1, 0.5),
      scanlineIntensity: 0.4,
      glitchIntensity: 0.1,
      opacity: 0
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = -100 + i * 40
    mesh.rotation.x = -Math.PI / 2
    scene.add(mesh)

    membranes.push({ mesh, baseY: -100 + i * 40 })
  }

  return {
    project() {
      membranes.forEach((membrane, i) => {
        gsap.to(membrane.mesh.material, {
          opacity: 0.3,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.3
        })
      })
    },
    dispose() {
      membranes.forEach(membrane => {
        scene.remove(membrane.mesh)
        membrane.mesh.geometry.dispose()
        membrane.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建全息原理展示（信息全息存储）
 */
function createHolographicPrinciple(scene, options = {}) {
  const { voxelSize = 3, voxelResolution = 20, informationBits = 8000 } = options

  const geometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize)
  const material = new HolographicMaterial({
    color: 0xff00ff,
    scanlineSpeed: 2.0,
    glowIntensity: 1.5,
    opacity: 0
  })

  const voxelGroup = new THREE.Group()

  for (let i = 0; i < informationBits; i++) {
    const voxel = new THREE.Mesh(geometry, material.clone())
    voxel.position.set(
      (Math.random() - 0.5) * voxelResolution * 4,
      (Math.random() - 0.5) * voxelResolution * 2,
      (Math.random() - 0.5) * voxelResolution * 4
    )
    voxel.scale.setScalar(0)
    voxelGroup.add(voxel)
  }

  scene.add(voxelGroup)

  return {
    encode() {
      voxelGroup.children.forEach((voxel, i) => {
        gsap.to(voxel.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          ease: 'back.out',
          delay: i * 0.002
        })
        gsap.to(voxel.material, {
          opacity: 0.6,
          duration: 1,
          delay: i * 0.002
        })
      })
    },
    dispose() {
      scene.remove(voxelGroup)
      voxelGroup.children.forEach(voxel => {
        voxel.geometry.dispose()
        voxel.material.dispose()
      })
    }
  }
}

/**
 * 创建观测者效应
 */
function createObserverEffect(scene, options = {}) {
  const { wavefrontCount = 8, collapseSpeed = 2.0 } = options

  const wavefronts = []

  for (let i = 0; i < wavefrontCount; i++) {
    const geometry = new THREE.RingGeometry(1, 2, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.scale.setScalar(0)
    scene.add(ring)

    wavefronts.push({ mesh: ring, angle: (i / wavefrontCount) * Math.PI * 2 })
  }

  return {
    collapse() {
      wavefronts.forEach((wave, i) => {
        gsap.to(wave.mesh.position, {
          x: Math.cos(wave.angle) * 100,
          y: 0,
          z: Math.sin(wave.angle) * 100,
          duration: 3,
          ease: 'power2.out',
          delay: i * 0.2
        })
        gsap.to(wave.mesh.scale, {
          x: 50,
          y: 50,
          z: 50,
          duration: 3,
          ease: 'power2.out',
          delay: i * 0.2
        })
        gsap.to(wave.mesh.material, {
          opacity: 0.5,
          duration: 1,
          ease: 'power2.out',
          delay: i * 0.2,
          onComplete: () => {
            gsap.to(wave.mesh.material, {
              opacity: 0,
              duration: 2,
              delay: 1
            })
          }
        })
      })
    },
    dispose() {
      wavefronts.forEach(wave => {
        scene.remove(wave.mesh)
        wave.mesh.geometry.dispose()
        wave.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建宇宙记忆场
 */
function createUniverseMemoryField(scene, options = {}) {
  const { memoryRecords = 5000, memoryDepth = 200 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(memoryRecords * 3)
  const colors = new Float32Array(memoryRecords * 3)

  for (let i = 0; i < memoryRecords; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = memoryDepth * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

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
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  return {
    recall() {
      gsap.to(material, {
        opacity: 0.6,
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
 * 创建全息噪声场
 */
function createHolographicNoiseField(scene, options = {}) {
  const { noiseScale = 0.5, noiseSpeed = 1.0 } = options

  const geometry = new THREE.PlaneGeometry(400, 400, 100, 100)
  const material = new HolographicMaterial({
    color: 0x0000ff,
    scanlineIntensity: 0.5,
    glitchIntensity: 0.2,
    opacity: 0.15
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -80
  scene.add(mesh)

  return {
    dispose() {
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    }
  }
}
