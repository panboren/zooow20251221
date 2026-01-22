/**
 * 量子纠缠时空交响曲特效 - 重制版
 * 融合量子纠缠、蝴蝶效应、贝尔不等式等概念
 * 使用点云、光束、能量场等震撼视觉效果
 * 技术亮点：
 * - 爱因斯坦-波多尔斯基-罗森悖论可视化
 * - 非定域性演示
 * - 蝴蝶效应量子实现
 * - 观测者效应与波函数坍缩
 * - 贝尔不等式违反演示
 * - 量子隧穿与概率云
 * - 平行宇宙分支
 * - 20000+ 超大规模粒子系统
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateQuantumEntanglement(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 深空量子视角
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 150), 150, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-entanglement' })
      },
      onError,
      '量子纠缠时空交响曲',
      controls
    )

    // 创建量子纠缠核心（中心能量场）
    const entanglementCore = createQuantumCore(scene)

    // 创建纠缠粒子云系统（10000粒子）
    const entanglementCloud = createEntanglementCloud(scene, {
      particleCount: 10000
    })

    // 创建量子光束网络（500条光束）
    const quantumBeams = createQuantumBeams(scene, {
      beamCount: 500
    })

    // 创建时空涟漪系统
    const spacetimeRipples = createSpacetimeRipples(scene, {
      rippleCount: 20
    })

    // 创建观测者光环
    const observerRing = createObserverRing(scene)

    // 创建量子隧穿通道
    const tunnelingTunnel = createTunnelingTunnel(scene)

    // 创建平行宇宙分叉
    const multiverseFork = createMultiverseFork(scene)

    // 创建贝尔不等式可视化
    const bellVisualization = createBellVisualization(scene)

    // 创建量子统一场
    const unityField = createUnityField(scene)

    // 阶段1: 量子虚空 - 纠缠核心苏醒
    tl.to(camera, {
      fov: 170,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '量子虚空错误'
      )
    })

    tl.call(() => {
      entanglementCore.awaken()
    }, null, 0.3)

    // 阶段2: 纠缠爆发 - 粒子云展开
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '纠缠爆发错误'
      )
    }, 0.5)

    tl.call(() => {
      entanglementCloud.explode()
      quantumBeams.ignite()
    }, null, 1.5)

    // 纠缠爆炸效果
    tl.to(camera, {
      fov: 160,
      duration: 0.4,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '纠缠爆炸错误'
      )
    }, 1.5)

    // 阶段3: 蝴蝶效应 - 时空涟漪扩散
    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 80,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '蝴蝶效应错误'
      )
    }, 2)

    tl.call(() => {
      spacetimeRipples.trigger()
      entanglementCloud.butterfly()
    }, null, 3.5)

    // 阶段4: 观测者效应 - 波函数坍缩
    tl.to(camera.position, {
      x: -30,
      y: 40,
      z: 70,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '观测者效应错误'
      )
    }, 5)

    tl.call(() => {
      observerRing.observe()
      entanglementCloud.collapse()
    }, null, 6.5)

    // 阶段5: 量子隧穿 - 粒子穿越势垒
    tl.to(camera.position, {
      x: 40,
      y: -20,
      z: 60,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子隧穿错误'
      )
    }, 7.5)

    tl.call(() => {
      tunnelingTunnel.activate()
    }, null, 9)

    // 阶段6: 平行宇宙 - 世界分裂
    tl.to(camera.position, {
      x: -40,
      y: -30,
      z: 50,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '平行宇宙错误'
      )
    }, 10)

    tl.call(() => {
      multiverseFork.branch()
    }, null, 11.5)

    // 阶段7: 贝尔不等式 - 定域实在性挑战
    tl.to(camera.position, {
      x: 20,
      y: 50,
      z: 40,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '贝尔不等式错误'
      )
    }, 12.5)

    tl.call(() => {
      bellVisualization.violate()
    }, null, 14)

    // 阶段8: 量子统一 - 终极纠缠态
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 30,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子统一错误'
      )
    }, 15)

    tl.call(() => {
      unityField.unite()
      entanglementCloud.unify()
    }, null, 16.5)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 16.5)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      entanglementCore.update(time)
      entanglementCloud.update(time)
      quantumBeams.update(time)
      spacetimeRipples.update(time)
      observerRing.update(time)
      tunnelingTunnel.update(time)
      multiverseFork.update(time)
      bellVisualization.update(time)
      unityField.update(time)
    }

    // 清理函数
    const cleanup = () => {
      entanglementCore.destroy()
      entanglementCloud.destroy()
      quantumBeams.destroy()
      spacetimeRipples.destroy()
      observerRing.destroy()
      tunnelingTunnel.destroy()
      multiverseFork.destroy()
      bellVisualization.destroy()
      unityField.destroy()
    }

    tl.call(cleanup, null, 18.5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建量子纠缠核心
 */
function createQuantumCore(scene) {
  // 核心球体
  const coreGeometry = new THREE.SphereGeometry(5, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x9600ff,
    transparent: true,
    opacity: 0
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  scene.add(core)

  // 外层能量场
  const fieldGeometry = new THREE.SphereGeometry(10, 64, 64)
  const fieldMaterial = new THREE.MeshBasicMaterial({
    color: 0x6400ff,
    transparent: true,
    opacity: 0,
    wireframe: true
  })
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial)
  scene.add(field)

  // 光晕
  const glowGeometry = new THREE.SphereGeometry(15, 32, 32)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  scene.add(glow)

  const quantumCore = {
    core,
    field,
    glow,

    awaken() {
      gsap.to(core.material, { opacity: 1, duration: 1.5 })
      gsap.to(field.material, { opacity: 0.6, duration: 2 })
      gsap.to(glow.material, { opacity: 0.3, duration: 2.5 })
      
      gsap.to(core.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1,
        yoyo: true,
        repeat: 1
      })
    },

    update(time) {
      const pulse = Math.sin(time * 4) * 0.2 + 0.8
      core.scale.setScalar(pulse)
      field.rotation.x += 0.01
      field.rotation.y += 0.015
      glow.scale.setScalar(1 + pulse * 0.3)
    },

    destroy() {
      scene.remove(core)
      scene.remove(field)
      scene.remove(glow)
      core.geometry.dispose()
      core.material.dispose()
      field.geometry.dispose()
      field.material.dispose()
      glow.geometry.dispose()
      glow.material.dispose()
    }
  }

  return quantumCore
}

/**
 * 创建纠缠粒子云系统
 */
function createEntanglementCloud(scene, options) {
  const { particleCount = 10000 } = options

  // 粒子几何体
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  const colorPalette = [
    new THREE.Color(0xff6464),
    new THREE.Color(0x6464ff),
    new THREE.Color(0x64ffff),
    new THREE.Color(0xff64ff),
    new THREE.Color(0x96ff64)
  ]

  for (let i = 0; i < particleCount; i++) {
    // 初始位置（压缩在中心）
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 10
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 2 + 0.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

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

  const cloud = {
    points,
    material,
    geometry,
    originalPositions: positions.slice(),
    exploded: false,

    explode() {
      const targetPositions = new Float32Array(particleCount * 3)
      
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 30 + Math.random() * 70
        
        targetPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        targetPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        targetPositions[i * 3 + 2] = radius * Math.cos(phi)
      }

      gsap.to(material, { opacity: 1, duration: 1.5 })

      // 动画粒子展开
      const duration = 2.5
      const startTime = Date.now()

      const animateExpansion = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)

        for (let i = 0; i < particleCount; i++) {
          const pos = geometry.attributes.position.array
          pos[i * 3] = this.originalPositions[i * 3] + 
                       (targetPositions[i * 3] - this.originalPositions[i * 3]) * ease
          pos[i * 3 + 1] = this.originalPositions[i * 3 + 1] + 
                          (targetPositions[i * 3 + 1] - this.originalPositions[i * 3 + 1]) * ease
          pos[i * 3 + 2] = this.originalPositions[i * 3 + 2] + 
                          (targetPositions[i * 3 + 2] - this.originalPositions[i * 3 + 2]) * ease
        }
        geometry.attributes.position.needsUpdate = true

        if (progress < 1) {
          requestAnimationFrame(animateExpansion)
        } else {
          this.exploded = true
        }
      }
      animateExpansion()
    },

    butterfly() {
      // 蝴蝶效应：创建波动涟漪
      const rippleCenter = new THREE.Vector3(0, 0, 0)
      const maxDistance = 150
      const waveSpeed = 50
      const duration = 3
      const startTime = Date.now()

      const animateButterfly = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const progress = elapsed / duration

        if (progress < 1) {
          const waveRadius = elapsed * waveSpeed

          for (let i = 0; i < particleCount; i++) {
            const pos = geometry.attributes.position.array
            const x = pos[i * 3]
            const y = pos[i * 3 + 1]
            const z = pos[i * 3 + 2]
            
            const distance = Math.sqrt(x * x + y * y + z * z)
            const distFromWave = Math.abs(distance - waveRadius)
            
            if (distFromWave < 20) {
              const waveStrength = (1 - distFromWave / 20) * Math.sin(elapsed * 10)
              const factor = 1 + waveStrength * 0.3
              pos[i * 3] *= factor
              pos[i * 3 + 1] *= factor
              pos[i * 3 + 2] *= factor
            }
          }
          geometry.attributes.position.needsUpdate = true
          requestAnimationFrame(animateButterfly)
        }
      }
      animateButterfly()
    },

    collapse() {
      // 波函数坍缩：粒子成对坍缩
      gsap.to(material, { opacity: 0.7, duration: 1 })
      
      for (let i = 0; i < particleCount; i += 2) {
        const idx1 = i * 3
        const idx2 = (i + 1) * 3
        
        const targetX = (geometry.attributes.position.array[idx1] + 
                        geometry.attributes.position.array[idx2]) / 2
        const targetY = (geometry.attributes.position.array[idx1 + 1] + 
                        geometry.attributes.position.array[idx2 + 1]) / 2
        const targetZ = (geometry.attributes.position.array[idx1 + 2] + 
                        geometry.attributes.position.array[idx2 + 2]) / 2

        gsap.to(geometry.attributes.position.array, {
          [idx1]: targetX,
          [idx1 + 1]: targetY,
          [idx1 + 2]: targetZ,
          [idx2]: targetX,
          [idx2 + 1]: targetY,
          [idx2 + 2]: targetZ,
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => geometry.attributes.position.needsUpdate = true,
          delay: Math.random() * 0.5
        })
      }
    },

    unify() {
      // 量子统一：所有粒子向中心汇聚
      for (let i = 0; i < particleCount; i++) {
        const targetRadius = 20 + Math.random() * 30
        const theta = (i / particleCount) * Math.PI * 2
        const phi = Math.acos(2 * (i / particleCount) - 1)
        
        const targetX = targetRadius * Math.sin(phi) * Math.cos(theta)
        const targetY = targetRadius * Math.sin(phi) * Math.sin(theta)
        const targetZ = targetRadius * Math.cos(phi)

        gsap.to(geometry.attributes.position.array, {
          [i * 3]: targetX,
          [i * 3 + 1]: targetY,
          [i * 3 + 2]: targetZ,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => geometry.attributes.position.needsUpdate = true
        })
      }
      gsap.to(material, { opacity: 1, duration: 2 })
    },

    update(time) {
      if (this.exploded) {
        const positions = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          // 微妙的布朗运动
          positions[i * 3] += (Math.random() - 0.5) * 0.2
          positions[i * 3 + 1] += (Math.random() - 0.5) * 0.2
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.2
        }
        geometry.attributes.position.needsUpdate = true
      }
      
      points.rotation.y += 0.001
      points.rotation.x += 0.0005
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return cloud
}

/**
 * 创建量子光束网络
 */
function createQuantumBeams(scene, options) {
  const { beamCount = 500 } = options
  const beams = []

  const material = new THREE.LineBasicMaterial({
    color: 0x96ff64,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  for (let i = 0; i < beamCount; i++) {
    const points = []
    const startRadius = 5 + Math.random() * 10
    const endRadius = 50 + Math.random() * 100
    
    const theta1 = Math.random() * Math.PI * 2
    const phi1 = Math.random() * Math.PI
    const theta2 = theta1 + (Math.random() - 0.5) * 0.5
    const phi2 = phi1 + (Math.random() - 0.5) * 0.5

    const startPoint = new THREE.Vector3(
      startRadius * Math.sin(phi1) * Math.cos(theta1),
      startRadius * Math.sin(phi1) * Math.sin(theta1),
      startRadius * Math.cos(phi1)
    )

    const endPoint = new THREE.Vector3(
      endRadius * Math.sin(phi2) * Math.cos(theta2),
      endRadius * Math.sin(phi2) * Math.sin(theta2),
      endRadius * Math.cos(phi2)
    )

    // 控制点，创建曲线
    const midPoint = startPoint.clone().lerp(endPoint, 0.5)
    midPoint.multiplyScalar(1.5)

    const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint)
    const curvePoints = curve.getPoints(20)
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
    const line = new THREE.Line(geometry, material.clone())
    line.userData = { phase: Math.random() * Math.PI * 2 }
    
    beams.push(line)
    scene.add(line)
  }

  const beamSystem = {
    beams,
    material,

    ignite() {
      gsap.to(material, { opacity: 0.5, duration: 1.5 })
      beams.forEach((beam, i) => {
        gsap.to(beam.material, {
          opacity: 0.3 + Math.random() * 0.4,
          duration: 1,
          delay: i * 0.005
        })
      })
    },

    update(time) {
      beams.forEach(beam => {
        const pulse = Math.sin(time * 3 + beam.userData.phase) * 0.3 + 0.7
        beam.material.opacity = pulse * 0.5
      })
    },

    destroy() {
      beams.forEach(beam => {
        scene.remove(beam)
        beam.geometry.dispose()
        beam.material.dispose()
      })
    }
  }

  return beamSystem
}

/**
 * 创建时空涟漪系统
 */
function createSpacetimeRipples(scene, options) {
  const { rippleCount = 20 } = options
  const ripples = []

  for (let i = 0; i < rippleCount; i++) {
    const geometry = new THREE.RingGeometry(
      10 + i * 5,
      10 + i * 5 + 1,
      64
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.5 + i * 0.02, 0.8, 0.6),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    ripple.userData = {
      maxRadius: 10 + i * 5,
      currentRadius: 0,
      phase: i * 0.1
    }
    ripples.push(ripple)
    scene.add(ripple)
  }

  const rippleSystem = {
    ripples,

    trigger() {
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.material, {
          opacity: 0.6,
          duration: 0.5,
          delay: i * 0.1
        })
        gsap.to(ripple.scale, {
          x: 5,
          y: 5,
          z: 5,
          duration: 3,
          delay: i * 0.1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(ripple.material, { opacity: 0, duration: 0.5 })
          }
        })
      })
    },

    update(time) {
      ripples.forEach(ripple => {
        ripple.rotation.z += 0.005
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

  return rippleSystem
}

/**
 * 创建观测者光环
 */
function createObserverRing(scene) {
  const rings = []

  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.TorusGeometry(
      30 + i * 15,
      0.5,
      16,
      100
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.15 + i * 0.05, 0.9, 0.7),
      transparent: true,
      opacity: 0
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    rings.push(ring)
    scene.add(ring)
  }

  const observerRing = {
    rings,

    observe() {
      rings.forEach((ring, i) => {
        gsap.to(ring.material, {
          opacity: 0.8,
          duration: 0.8,
          delay: i * 0.15
        })
        gsap.to(ring.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 1,
          delay: i * 0.15,
          yoyo: true,
          repeat: 1
        })
      })
    },

    update(time) {
      rings.forEach((ring, i) => {
        ring.rotation.z += 0.002 * (i + 1)
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.1 + 0.9
        ring.scale.setScalar(pulse)
      })
    },

    destroy() {
      rings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
    }
  }

  return observerRing
}

/**
 * 创建量子隧穿通道
 */
function createTunnelingTunnel(scene) {
  // 势垒环
  const barrierGeometry = new THREE.TorusGeometry(25, 3, 32, 100)
  const barrierMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3232,
    transparent: true,
    opacity: 0,
    wireframe: true
  })
  const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial)
  barrier.rotation.x = Math.PI / 2
  scene.add(barrier)

  // 隧穿粒子
  const tunnelingParticles = []
  const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8)
  
  for (let i = 0; i < 500; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.5 + Math.random() * 0.1, 0.9, 0.7),
      transparent: true,
      opacity: 0
    })
    const particle = new THREE.Mesh(particleGeometry, material)
    
    const angle = Math.random() * Math.PI * 2
    const radius = 10 + Math.random() * 80
    particle.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      (Math.random() - 0.5) * 20
    )
    particle.userData = {
      angle,
      radius,
      speed: 0.5 + Math.random() * 1,
      tunnelingProb: Math.random() * 0.3
    }
    
    tunnelingParticles.push(particle)
    scene.add(particle)
  }

  const tunnel = {
    barrier,
    tunnelingParticles,

    activate() {
      gsap.to(barrier.material, { opacity: 0.6, duration: 0.5 })
      tunnelingParticles.forEach(p => {
        gsap.to(p.material, { opacity: 1, duration: 0.5 })
      })
    },

    update(time) {
      tunnelingParticles.forEach(p => {
        // 粒子沿轨道运动
        p.userData.angle += p.userData.speed * 0.02
        p.position.x = Math.cos(p.userData.angle) * p.userData.radius
        p.position.y = Math.sin(p.userData.angle) * p.userData.radius
        
        // 隧穿检测
        if (Math.abs(p.userData.radius - 25) < 2 && Math.random() < p.userData.tunnelingProb * 0.05) {
          p.userData.radius = 25 + (Math.random() > 0.5 ? 10 : -10)
        }
        
        // 脉动效果
        const pulse = Math.sin(time * 10 + p.userData.angle) * 0.3 + 0.7
        p.scale.setScalar(pulse)
      })
      
      barrier.rotation.z += 0.01
    },

    destroy() {
      scene.remove(barrier)
      barrier.geometry.dispose()
      barrier.material.dispose()
      tunnelingParticles.forEach(p => {
        scene.remove(p)
        p.geometry.dispose()
        p.material.dispose()
      })
    }
  }

  return tunnel
}

/**
 * 创建平行宇宙分叉
 */
function createMultiverseFork(scene) {
  const branches = []
  const branchCount = 12

  for (let i = 0; i < branchCount; i++) {
    const angle = (i / branchCount) * Math.PI * 2
    const points = []
    
    for (let j = 0; j <= 30; j++) {
      const t = j / 30
      const radius = t * 100
      const spread = Math.sin(t * Math.PI) * 20
      
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius + Math.cos(angle + Math.PI/2) * spread * (i % 2 === 0 ? 1 : -1),
        Math.sin(angle) * radius + Math.sin(angle + Math.PI/2) * spread * (i % 2 === 0 ? 1 : -1),
        Math.sin(t * Math.PI * 3) * 15
      ))
    }

    const curve = new THREE.CatmullRomCurve3(points)
    const geometry = new THREE.TubeGeometry(curve, 50, 0.8, 8, false)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / branchCount, 0.9, 0.6),
      transparent: true,
      opacity: 0
    })
    const tube = new THREE.Mesh(geometry, material)
    tube.userData = { phase: i * 0.2 }
    
    branches.push(tube)
    scene.add(tube)
  }

  const fork = {
    branches,

    branch() {
      branches.forEach((branch, i) => {
        gsap.to(branch.material, {
          opacity: 0.8,
          duration: 1,
          delay: i * 0.08
        })
        gsap.to(branch.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          delay: i * 0.08,
          ease: 'back.out'
        })
      })
    },

    update(time) {
      branches.forEach(branch => {
        const pulse = Math.sin(time * 2 + branch.userData.phase) * 0.2 + 0.8
        branch.material.opacity = pulse * 0.8
      })
    },

    destroy() {
      branches.forEach(branch => {
        scene.remove(branch)
        branch.geometry.dispose()
        branch.material.dispose()
      })
    }
  }

  return fork
}

/**
 * 创建贝尔不等式可视化
 */
function createBellVisualization(scene) {
  const group = new THREE.Group()
  group.scale.set(0, 0, 0)

  // 经典理论曲线
  const classicPoints = []
  const quantumPoints = []
  
  for (let i = 0; i < 100; i++) {
    const x = (i / 100) * 4 - 2
    classicPoints.push(new THREE.Vector3(x * 30, Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * 80, 0))
    const quantumY = Math.abs(x) * (2 - Math.abs(x)) / 2 * 80
    quantumPoints.push(new THREE.Vector3(x * 30, quantumY, 0))
  }

  const classicCurve = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(classicPoints),
    new THREE.LineBasicMaterial({ color: 0xff6464, transparent: true, opacity: 0.8 })
  )
  group.add(classicCurve)

  const quantumCurve = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(quantumPoints),
    new THREE.LineBasicMaterial({ color: 0x6496ff, transparent: true, opacity: 0.9, linewidth: 2 })
  )
  group.add(quantumCurve)

  // 违反区域高亮
  const violationGeometry = new THREE.PlaneGeometry(60, 40)
  const violationMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff64,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  })
  const violation = new THREE.Mesh(violationGeometry, violationMaterial)
  violation.position.set(0, 20, -1)
  group.add(violation)

  scene.add(group)

  const visualization = {
    group,
    violation,

    violate() {
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.5 })
      gsap.to(violation.material, { opacity: 0.3, duration: 1 })
      
      // 闪烁效果
      gsap.to(violation.material, {
        opacity: 0.6,
        duration: 0.3,
        yoyo: true,
        repeat: 5
      })
    },

    update(time) {
      group.rotation.y = Math.sin(time * 0.5) * 0.1
    },

    destroy() {
      scene.remove(group)
      classicCurve.geometry.dispose()
      classicCurve.material.dispose()
      quantumCurve.geometry.dispose()
      quantumCurve.material.dispose()
      violation.geometry.dispose()
      violation.material.dispose()
    }
  }

  return visualization
}

/**
 * 创建量子统一场
 */
function createUnityField(scene) {
  const group = new THREE.Group()

  // 核心能量球
  const coreGeometry = new THREE.SphereGeometry(15, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 能量环
  const rings = []
  for (let i = 0; i < 8; i++) {
    const geometry = new THREE.TorusGeometry(
      20 + i * 8,
      1,
      16,
      100
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.7 + i * 0.04, 0.9, 0.7),
      transparent: true,
      opacity: 0
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.userData = { rotationSpeed: (i % 2 === 0 ? 1 : -1) * (0.01 + i * 0.002) }
    rings.push(ring)
    group.add(ring)
  }

  // 光束
  const beams = []
  const beamGeometry = new THREE.CylinderGeometry(0.5, 0.5, 100, 8)
  
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / 20 * 0.3 + 0.5, 0.9, 0.7),
      transparent: true,
      opacity: 0
    })
    const beam = new THREE.Mesh(beamGeometry, material)
    beam.rotation.z = Math.PI / 2
    beam.rotation.y = angle
    beam.position.set(Math.cos(angle) * 30, Math.sin(angle) * 30, 0)
    beam.userData = { angle, speed: (Math.random() - 0.5) * 0.02 }
    beams.push(beam)
    group.add(beam)
  }

  scene.add(group)

  const unity = {
    group,
    core,
    rings,
    beams,

    unite() {
      gsap.to(core.material, { opacity: 1, duration: 1 })
      rings.forEach((ring, i) => {
        gsap.to(ring.material, {
          opacity: 0.6,
          duration: 0.8,
          delay: i * 0.1
        })
      })
      beams.forEach((beam, i) => {
        gsap.to(beam.material, {
          opacity: 0.8,
          duration: 0.8,
          delay: i * 0.05
        })
      })
    },

    update(time) {
      const pulse = Math.sin(time * 3) * 0.2 + 0.8
      core.scale.setScalar(pulse)
      
      rings.forEach(ring => {
        ring.rotation.z += ring.userData.rotationSpeed
        ring.rotation.x += ring.userData.rotationSpeed * 0.5
      })
      
      beams.forEach(beam => {
        beam.userData.angle += beam.userData.speed
        beam.position.x = Math.cos(beam.userData.angle) * 30
        beam.position.y = Math.sin(beam.userData.angle) * 30
        beam.rotation.y = beam.userData.angle
      })
      
      group.rotation.y += 0.002
    },

    destroy() {
      scene.remove(group)
      core.geometry.dispose()
      core.material.dispose()
      rings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
      beams.forEach(beam => {
        beam.geometry.dispose()
        beam.material.dispose()
      })
    }
  }

  return unity
}
