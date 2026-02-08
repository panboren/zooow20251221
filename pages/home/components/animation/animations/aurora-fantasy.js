/**
 * 极光幻境 - 优化重构版
 * 融合极光、极地、星空、冰雪、幻境、梦境等唯美自然景观
 * 技术突破：
 * - 使用统一极光着色器模块
 * - 使用统一星空系统模块
 * - 使用粒子配置管理模块
 * - 粒子光子流（自适应粒子数量）
 * - 冰晶折射效果
 * - 极地风光渲染
 * - 梦境迷雾效果
 * - 幻境粒子
 * - 动态色彩渐变
 * - 极光舞动模拟
 * - 冰雪粒子沉降
 * - 使用ParticleFactory统一创建
 * - 使用PerformanceMonitor性能监控
 * 动画时长：24秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { createMultiLayerAurora } from './effects/unified-aurora-shader.js'
import { createStarField } from './effects/unified-star-field.js'
import { getAdaptiveParticleCount, performanceMonitor } from './effects/particle-config.js'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

export default function animateAuroraFantasy(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  // 创建性能监控器
  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  // 检测设备性能等级 - 使用 particle-config.js 的 performanceMonitor
  performanceMonitor.update()
  const deviceTier = performanceMonitor.getCurrentTier()

  try {
    // 初始设置 - 远景仰视
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 200), 100, controls)
    camera.lookAt(0, 100, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'aurora-fantasy' })
      },
      onError,
      '极光幻境 (优化重构版)',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 统一极光系统（使用统一模块）
    const auroraLayerCount = deviceTier === 'HIGH' ? 10 : deviceTier === 'MEDIUM' ? 7 : 5
    const aurora = createMultiLayerAurora(scene, {
      layerCount: auroraLayerCount,
      colors: [0x00ff00, 0x00ffff, 0xff00ff, 0xffff00],
      opacity: 0.6,
      height: 150,
      intensity: 1.0
    })

    // 2. 统一星空系统（使用统一模块）
    const starCount = getAdaptiveParticleCount('star', deviceTier)
    const starField = createStarField(scene, {
      count: starCount,
      radius: 400,
      color: 0x88ccff,
      twinkleSpeed: 1.0
    })

    // 3. 冰晶系统（使用自适应粒子数量）
    const crystalCount = getAdaptiveParticleCount('crystal', deviceTier)
    const iceCrystals = createIceCrystals(scene, {
      crystalCount: crystalCount,
      crystalSize: 5
    })

    // 4. 极地风光
    const polarLandscape = createPolarLandscape(scene)

    // 5. 梦境迷雾（使用自适应粒子数量）
    const mistCount = getAdaptiveParticleCount('mist', deviceTier)
    const dreamMist = createDreamMist(scene, {
      mistParticleCount: mistCount
    })

    // 6. 幻境粒子（使用自适应粒子数量）
    const fantasyCount = getAdaptiveParticleCount('fantasy', deviceTier)
    const fantasyParticles = createFantasyParticles(scene, {
      particleCount: fantasyCount
    })

    // 7. 光子流（使用自适应粒子数量）
    const photonCount = getAdaptiveParticleCount('photon', deviceTier)
    const photonStream = createPhotonStream(scene, {
      photonCount: photonCount
    })

    // 8. 冰雪沉降（使用自适应粒子数量）
    const snowCount = getAdaptiveParticleCount('snow', deviceTier)
    const snowfall = createSnowfall(scene, {
      snowflakeCount: snowCount
    })

    // ==================== 动画序列 ====================

    // 阶段1: 夜幕降临 - 星空浮现（6秒）
    tl.to(camera.position, {
      x: 10,
      y: 40,
      z: 180,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 100, 0),
        '夜幕降临错误'
      )
    }, 0)

    tl.call(() => {
      starField.appear(0.9, 3)
      dreamMist.materialize(0.3, 3)
    }, null, 0.5)

    tl.to(camera, {
      fov: 110,
      duration: 4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '夜幕视野错误'
      )
    }, 1)

    // 阶段2: 极光初现 - 绿色光带（6秒）
    tl.to(camera.position, {
      x: -10,
      y: 50,
      z: 150,
      duration: 6,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 120, 0),
        '极光初现错误'
      )
    }, 6)

    tl.call(() => {
      // 设置所有层的颜色
      aurora.layers.forEach(layer => {
        layer.curtain.setColor(0x00ff00)
      })
      aurora.appear(0.6, 2)
      iceCrystals.form()
      photonStream.flow()
    }, null, 6.5)

    tl.to(camera, {
      fov: 120,
      duration: 4,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '极光视野错误'
      )
    }, 7)

    // 阶段3: 极光舞动 - 多彩变幻（7秒）
    tl.to(camera.position, {
      x: 0,
      y: 60,
      z: 100,
      duration: 7,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 140, 0),
        '极光舞动错误'
      )
    }, 12)

    tl.call(() => {
      aurora.animateColors(10) // 开始10秒的颜色循环
      fantasyParticles.scatter()
    }, null, 12.5)

    tl.to(camera, {
      fov: 100,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '舞动视野错误'
      )
    }, 13)

    // 阶段4: 梦境入夜 - 冰雪飘落（5秒）
    tl.to(camera.position, {
      x: 5,
      y: 70,
      z: 80,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 100, 0),
        '梦境入夜错误'
      )
    }, 19)

    tl.call(() => {
      snowfall.fall()
      aurora.fade(0, 4)
    }, null, 19.5)

    tl.to(camera, {
      fov: 85,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '最终视角错误'
      )
    }, 20)

    // ==================== 清理函数 ====================
    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true

      try {
        aurora.dispose()
        starField.dispose()
        iceCrystals.dispose()
        polarLandscape.dispose()
        dreamMist.dispose()
        fantasyParticles.dispose()
        photonStream.dispose()
        snowfall.dispose()
      } catch (error) {
        console.error('Aurora Fantasy cleanup error:', error)
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
 * 创建冰晶系统
 */
function createIceCrystals(scene, options = {}) {
  const {
    crystalCount = 3000,
    crystalSize = 5
  } = options

  const group = new THREE.Group()
  const crystals = []

  for (let i = 0; i < crystalCount; i++) {
    const geometry = new THREE.OctahedronGeometry(1 + Math.random() * 3, 0)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.55, 0.3, 0.8),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const crystal = new THREE.Mesh(geometry, material)
    crystal.position.set(
      (Math.random() - 0.5) * 300,
      Math.random() * 100,
      (Math.random() - 0.5) * 300
    )
    crystal.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    crystals.push({
      mesh: crystal,
      formed: false,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      }
    })

    group.add(crystal)
  }

  scene.add(group)

  const form = () => {
    crystals.forEach((crystal, i) => {
      setTimeout(() => {
        crystal.formed = true

        gsap.to(crystal.mesh.material, {
          opacity: 0.5,
          duration: 1
        })

        gsap.to(crystal.mesh.scale, {
          x: crystalSize / 3,
          y: crystalSize / 3,
          z: crystalSize / 3,
          duration: 1.5,
          ease: 'back.out'
        })
      }, i * 2)
    })
  }

  const update = () => {
    crystals.forEach(crystal => {
      if (crystal.formed) {
        crystal.mesh.rotation.x += crystal.rotationSpeed.x
        crystal.mesh.rotation.y += crystal.rotationSpeed.y
        crystal.mesh.rotation.z += crystal.rotationSpeed.z

        const pulse = Math.sin(Date.now() * 0.002) * 0.1
        crystal.mesh.material.opacity = 0.4 + pulse
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    form,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      crystals.forEach(crystal => {
        crystal.mesh.geometry.dispose()
        crystal.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建极地风光
 */
function createPolarLandscape(scene) {
  const group = new THREE.Group()

  // 雪地
  const groundGeometry = new THREE.PlaneGeometry(800, 800, 50, 50)
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xeeeeff,
    transparent: true,
    opacity: 0.6
  })

  // 添加山脉起伏
  const positions = groundGeometry.attributes.position.array
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] += Math.random() * 5
  }
  groundGeometry.computeVertexNormals()

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -50
  group.add(ground)

  scene.add(group)

  const update = () => {
    // 极地风光缓慢移动
    group.rotation.y += 0.0002
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      groundGeometry.dispose()
      groundMaterial.dispose()
    }
  }
}

/**
 * 创建梦境迷雾
 */
function createDreamMist(scene, options = {}) {
  const {
    mistParticleCount = 8000
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(mistParticleCount * 3)
  const colors = new Float32Array(mistParticleCount * 3)

  for (let i = 0; i < mistParticleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400
    positions[i * 3 + 1] = Math.random() * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400

    const hue = 0.55 + Math.random() * 0.15
    const color = new THREE.Color().setHSL(hue, 0.5, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let materialized = false
  let time = 0

  const update = () => {
    time += 0.016

    if (materialized) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < mistParticleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.05
      }

      points.geometry.attributes.position.needsUpdate = true
      points.rotation.y += 0.0005
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    materialize(targetOpacity = 0.3, duration = 3) {
      materialized = true
      gsap.to(material.uniforms.uOpacity, {
        value: targetOpacity,
        duration: duration
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
 * 创建幻境粒子
 */
function createFantasyParticles(scene, options = {}) {
  const {
    particleCount = 10000
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300
    positions[i * 3 + 1] = 80 + Math.random() * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7)
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
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let scattered = false
  let time = 0

  const update = () => {
    time += 0.016

    if (scattered) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += Math.sin(time * 2 + i * 0.01) * 0.2
        positions[i * 3 + 1] += Math.cos(time * 1.5 + i * 0.01) * 0.1
        positions[i * 3 + 2] += Math.sin(time * 1.8 + i * 0.01) * 0.2
      }

      points.geometry.attributes.position.needsUpdate = true

      // 颜色循环
      const colors = points.geometry.attributes.color.array
      for (let i = 0; i < particleCount * 3; i += 3) {
        const hue = (time * 0.05 + i * 0.001) % 1
        const color = new THREE.Color().setHSL(hue, 0.8, 0.7)
        colors[i] = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b
      }
      points.geometry.attributes.color.needsUpdate = true
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    scatter() {
      scattered = true
      gsap.to(material, {
        opacity: 0.6,
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
 * 创建光子流
 */
function createPhotonStream(scene, options = {}) {
  const {
    photonCount = 20000
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(photonCount * 3)
  const colors = new Float32Array(photonCount * 3)
  const velocities = new Float32Array(photonCount * 3)

  for (let i = 0; i < photonCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400
    positions[i * 3 + 1] = 100 + Math.random() * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400

    velocities[i * 3] = (Math.random() - 0.5) * 0.5
    velocities[i * 3 + 1] = Math.random() * 0.3
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5

    const hue = 0.4 + Math.random() * 0.2
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
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
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let flowing = false

  const update = () => {
    if (flowing) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < photonCount; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]

        // 循环
        if (positions[i * 3 + 1] > 200) {
          positions[i * 3 + 1] = 100
          positions[i * 3] = (Math.random() - 0.5) * 400
          positions[i * 3 + 2] = (Math.random() - 0.5) * 400
        }
      }

      points.geometry.attributes.position.needsUpdate = true
      points.rotation.y += 0.001
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
 * 创建冰雪沉降
 */
function createSnowfall(scene, options = {}) {
  const {
    snowflakeCount = 15000
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(snowflakeCount * 3)
  const sizes = new Float32Array(snowflakeCount)
  const fallSpeeds = new Float32Array(snowflakeCount)

  for (let i = 0; i < snowflakeCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 500
    positions[i * 3 + 1] = 150 + Math.random() * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500

    sizes[i] = 1 + Math.random() * 2
    fallSpeeds[i] = 0.5 + Math.random() * 1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 2,
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let falling = false

  const update = () => {
    if (falling) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < snowflakeCount; i++) {
        positions[i * 3 + 1] -= fallSpeeds[i]

        // 飘落效果
        positions[i * 3] += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.2
        positions[i * 3 + 2] += Math.cos(Date.now() * 0.001 + i * 0.1) * 0.2

        // 循环
        if (positions[i * 3 + 1] < -100) {
          positions[i * 3 + 1] = 150 + Math.random() * 50
          positions[i * 3] = (Math.random() - 0.5) * 500
          positions[i * 3 + 2] = (Math.random() - 0.5) * 500
        }
      }

      points.geometry.attributes.position.needsUpdate = true
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    fall() {
      falling = true
      gsap.to(material, {
        opacity: 0.8,
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
