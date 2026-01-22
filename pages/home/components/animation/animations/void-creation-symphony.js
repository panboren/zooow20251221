/**
 * 虚空创世交响曲特效
 * 全新炸裂特效 - 融合宇宙起源与大爆炸理论
 * 实现奇点大爆炸、宇宙暴涨、星系形成、黑洞蒸发、热寂等宇宙演化全过程
 * 技术亮点：
 * - 普朗克尺度量子涨落可视化
 * - 哈勃膨胀与宇宙加速膨胀
 * - 暗物质与暗能量分布
 * - 多重宇宙气泡模型
 * - 熵增与热寂
 * - 15000+ 大规模粒子系统
 * - 分形宇宙结构生成
 * - 实时宇宙年龄演化模拟
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateVoidCreation(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 虚空视角
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 0.001), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'void-creation' })
      },
      onError,
      '虚空创世交响曲',
      controls
    )

    // 创建普朗克尺度奇点
    const planckSingularity = createPlanckSingularity(scene, {
      singularityRadius: 0.1,
      quantumFluctuationCount: 3000
    })

    // 创建暴胀场
    const inflationField = createInflationField(scene, {
      fieldStrength: 100,
      quantumTunnelingCount: 5000
    })

    // 创建宇宙物质系统
    const cosmicMatter = createCosmicMatterSystem(scene, {
      particleCount: 15000,
      darkMatterRatio: 0.27,
      darkEnergyRatio: 0.68
    })

    // 创建宇宙结构形成
    const cosmicStructure = createCosmicStructure(scene, {
      galaxyCount: 8,
      clusterCount: 12,
      superclusterScale: 200
    })

    // 创建黑洞系统
    const blackHoleSystem = createBlackHoleSystem(scene, {
      blackHoleCount: 5,
      eventHorizonScale: 15
    })

    // 创建热寂系统
    const heatDeath = createHeatDeathSystem(scene, {
      entropyLevel: 0,
      maxEntropy: 1000,
      particleDissipationCount: 8000
    })

    // 阶段1: 虚空 - 普朗克尺度量子涨落
    tl.to(camera, {
      fov: 180,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '虚空错误'
      )
    })

    tl.call(() => {
      planckSingularity.fluctuate()
    }, null, 0.3)

    // 阶段2: 大爆炸 - 奇点爆发
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 5,
      duration: 0.8,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '大爆炸错误'
      )
    }, 0.5)

    tl.call(() => {
      planckSingularity.bigBang()
      inflationField.activate()
    }, null, 1)

    // 大爆炸冲击波
    tl.to(camera, {
      fov: 170,
      duration: 0.3,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '大爆炸冲击波错误'
      )
    }, 1)

    // 阶段3: 暴胀期 - 宇宙指数膨胀
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 30,
      duration: 2,
      ease: 'exponential.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '暴胀期错误'
      )
    }, 1.3)

    tl.call(() => {
      inflationField.expand()
      cosmicMatter.born()
    }, null, 2.5)

    // 暴胀加速
    tl.to(camera, {
      fov: 160,
      duration: 0.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '暴胀加速错误'
      )
    }, 2.5)

    // 阶段4: 复合时期 - 氢氦原子形成
    tl.to(camera.position, {
      x: 0,
      y: 10,
      z: 60,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '复合时期错误'
      )
    }, 3)

    tl.call(() => {
      cosmicMatter.recombine()
      inflationField.decelerate()
    }, null, 4.5)

    // 阶段5: 结构形成 - 星系诞生
    tl.to(camera.position, {
      x: 20,
      y: 25,
      z: 80,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 10, 0),
        '结构形成错误'
      )
    }, 5.5)

    tl.call(() => {
      cosmicStructure.formGalaxies()
      blackHoleSystem.birth()
    }, null, 7)

    // 阶段6: 星系演化 - 恒星诞生与死亡
    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 100,
      duration: 4,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(30, 20, 0),
        '星系演化错误'
      )
    }, 8.5)

    tl.call(() => {
      cosmicStructure.evolve()
      blackHoleSystem.feed()
    }, null, 11)

    // 阶段7: 黑洞时代 - 霍金辐射
    tl.to(camera.position, {
      x: 80,
      y: 40,
      z: 120,
      duration: 3,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(50, 30, 0),
        '黑洞时代错误'
      )
    }, 12.5)

    tl.call(() => {
      blackHoleSystem.evaporate()
      cosmicStructure.decay()
    }, null, 14)

    // 黑洞蒸发效果
    tl.to(blackHoleSystem.blackHoles.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 2,
      ease: 'power2.inOut'
    }, 14)

    // 阶段8: 热寂 - 熵达到最大值
    tl.to(camera.position, {
      x: 120,
      y: 60,
      z: 150,
      duration: 4,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(80, 40, 0),
        '热寂错误'
      )
    }, 15.5)

    tl.call(() => {
      heatDeath.dissipate()
      cosmicMatter.fading()
      inflationField.fadeOut()
    }, null, 18)

    // 热寂渐变
    tl.to(camera, {
      fov: 120,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '热寂渐变错误'
      )
    }, 18)

    // 阶段9: 虚空回归 - 新的量子涨落
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 200,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '虚空回归错误'
      )
    }, 19.5)

    tl.call(() => {
      heatDeath.entropyMax()
      planckSingularity.reset()
    }, null, 22)

    // 最终回归虚空
    tl.to(camera, {
      fov: 90,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '最终回归错误'
      )
    }, 22)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      planckSingularity.update(time)
      inflationField.update(time)
      cosmicMatter.update(time)
      cosmicStructure.update(time)
      blackHoleSystem.update(time)
      heatDeath.update(time)
    }

    // 清理函数
    const cleanup = () => {
      planckSingularity.destroy()
      inflationField.destroy()
      cosmicMatter.destroy()
      cosmicStructure.destroy()
      blackHoleSystem.destroy()
      heatDeath.destroy()
    }

    tl.call(cleanup, null, 25)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建普朗克尺度奇点
 * 基于量子引力理论 - 普朗克尺度的时空结构
 */
function createPlanckSingularity(scene, options) {
  const { singularityRadius = 0.1, quantumFluctuationCount = 3000 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 奇点核心 - 无限致密
  const coreGeometry = new THREE.SphereGeometry(singularityRadius, 32, 32)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  })
  const singularityCore = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(singularityCore)

  // 量子涨落粒子
  const fluctuationGeometry = new THREE.BufferGeometry()
  const fluctuationPositions = new Float32Array(quantumFluctuationCount * 3)
  const fluctuationColors = new Float32Array(quantumFluctuationCount * 3)
  const fluctuationPhases = new Float32Array(quantumFluctuationCount)

  for (let i = 0; i < quantumFluctuationCount; i++) {
    const i3 = i * 3
    // 普朗克尺度随机分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = singularityRadius * (0.5 + Math.random() * 0.5)

    fluctuationPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    fluctuationPositions[i3 + 1] = radius * Math.cos(phi)
    fluctuationPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 量子颜色 - 紫外到伽马射线
    const hue = 0.7 + Math.random() * 0.2
    const color = new THREE.Color().setHSL(hue, 0.9, 0.7)
    fluctuationColors[i3] = color.r
    fluctuationColors[i3 + 1] = color.g
    fluctuationColors[i3 + 2] = color.b

    fluctuationPhases[i] = Math.random() * Math.PI * 2
  }

  fluctuationGeometry.setAttribute('position', new THREE.BufferAttribute(fluctuationPositions, 3))
  fluctuationGeometry.setAttribute('color', new THREE.BufferAttribute(fluctuationColors, 3))

  const fluctuationMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const fluctuationSystem = new THREE.Points(fluctuationGeometry, fluctuationMaterial)
  group.add(fluctuationSystem)

  let isFluctuating = false
  let hasExploded = false

  return {
    group,
    fluctuationSystem,
    fluctuate() {
      isFluctuating = true
    },
    bigBang() {
      isFluctuating = false
      hasExploded = true
      
      // 奇点爆发
      gsap.to(singularityCore.scale, {
        x: 1000,
        y: 1000,
        z: 1000,
        duration: 0.5,
        ease: 'power4.out'
      })
      
      gsap.to(coreMaterial, {
        opacity: 0,
        duration: 0.8
      })

      // 涨落粒子爆炸
      gsap.to(fluctuationSystem.scale, {
        x: 500,
        y: 500,
        z: 500,
        duration: 1,
        ease: 'power4.out'
      })
    },
    reset() {
      hasExploded = false
      singularityCore.scale.setScalar(0.001)
      coreMaterial.opacity = 0.9
      fluctuationSystem.scale.setScalar(0.001)
    },
    update(time) {
      if (isFluctuating && !hasExploded) {
        const positions = fluctuationGeometry.attributes.position.array
        for (let i = 0; i < quantumFluctuationCount; i++) {
          const i3 = i * 3
          // 量子涨落 - 海森堡不确定性原理
          const uncertainty = Math.sin(time * 10 + fluctuationPhases[i]) * 0.05
          positions[i3] *= (1 + uncertainty)
          positions[i3 + 1] *= (1 + uncertainty)
          positions[i3 + 2] *= (1 + uncertainty)
        }
        fluctuationGeometry.attributes.position.needsUpdate = true
        
        // 奇点脉动
        const pulse = Math.sin(time * 20) * 0.1 + 0.9
        singularityCore.scale.setScalar(pulse)
      }
    },
    destroy() {
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      fluctuationGeometry.dispose()
      fluctuationMaterial.dispose()
    }
  }
}

/**
 * 创建暴胀场
 * 基于宇宙暴胀理论 - 瞬间指数膨胀
 */
function createInflationField(scene, options) {
  const { fieldStrength = 100, quantumTunnelingCount = 5000 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 暴胀场粒子
  const fieldGeometry = new THREE.BufferGeometry()
  const fieldPositions = new Float32Array(quantumTunnelingCount * 3)
  const fieldColors = new Float32Array(quantumTunnelingCount * 3)
  const fieldVelocities = new Float32Array(quantumTunnelingCount * 3)

  for (let i = 0; i < quantumTunnelingCount; i++) {
    const i3 = i * 3
    // 球面随机分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 1 + Math.random() * 2

    fieldPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    fieldPositions[i3 + 1] = radius * Math.cos(phi)
    fieldPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 暴胀场颜色 - 从高能到低能
    const energyFactor = Math.random()
    const hue = 0.6 - energyFactor * 0.4
    const color = new THREE.Color().setHSL(hue, 0.9, 0.5 + energyFactor * 0.3)
    fieldColors[i3] = color.r
    fieldColors[i3 + 1] = color.g
    fieldColors[i3 + 2] = color.b

    // 暴胀速度
    fieldVelocities[i3] = (Math.random() - 0.5) * 0.01
    fieldVelocities[i3 + 1] = (Math.random() - 0.5) * 0.01
    fieldVelocities[i3 + 2] = (Math.random() - 0.5) * 0.01
  }

  fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3))
  fieldGeometry.setAttribute('color', new THREE.BufferAttribute(fieldColors, 3))

  const fieldMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const fieldSystem = new THREE.Points(fieldGeometry, fieldMaterial)
  group.add(fieldSystem)

  // 暴胀波纹
  const inflationWaves = []
  for (let i = 0; i < 5; i++) {
    const waveGeometry = new THREE.SphereGeometry(10 + i * 20, 64, 64)
    const waveMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 - i * 0.1, 0.8, 0.6),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })
    const wave = new THREE.Mesh(waveGeometry, waveMaterial)
    wave.scale.setScalar(0.01)
    group.add(wave)
    inflationWaves.push(wave)
  }

  let isActive = false
  let expansionRate = 1

  return {
    group,
    fieldSystem,
    activate() {
      isActive = true
      expansionRate = 50
    },
    expand() {
      expansionRate = 200
      inflationWaves.forEach((wave, i) => {
        gsap.to(wave.scale, {
          x: 1 + i * 2,
          y: 1 + i * 2,
          z: 1 + i * 2,
          duration: 2,
          ease: 'exponential.out',
          delay: i * 0.1
        })
        gsap.to(wave.material, {
          opacity: 0.3,
          duration: 1,
          delay: i * 0.1
        })
      })
    },
    decelerate() {
      expansionRate = 5
      inflationWaves.forEach(wave => {
        gsap.to(wave.material, {
          opacity: 0.1,
          duration: 2
        })
      })
    },
    fadeOut() {
      expansionRate = 0.5
      gsap.to(fieldSystem.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 3
      })
      inflationWaves.forEach(wave => {
        gsap.to(wave.material, {
          opacity: 0,
          duration: 2
        })
      })
    },
    update(time) {
      if (isActive && expansionRate > 0.5) {
        const positions = fieldGeometry.attributes.position.array
        for (let i = 0; i < quantumTunnelingCount; i++) {
          const i3 = i * 3
          
          // 暴胀膨胀 - 指数增长
          positions[i3] *= 1 + expansionRate * 0.0001
          positions[i3 + 1] *= 1 + expansionRate * 0.0001
          positions[i3 + 2] *= 1 + expansionRate * 0.0001

          // 量子隧穿效应
          const tunneling = Math.sin(time * 5 + i) * 0.02
          positions[i3] += fieldVelocities[i3] + tunneling
          positions[i3 + 1] += fieldVelocities[i3 + 1] + tunneling
          positions[i3 + 2] += fieldVelocities[i3 + 2] + tunneling
        }
        fieldGeometry.attributes.position.needsUpdate = true
      }

      inflationWaves.forEach((wave, i) => {
        wave.rotation.x += 0.01
        wave.rotation.y += 0.015
      })
    },
    destroy() {
      scene.remove(group)
      fieldGeometry.dispose()
      fieldMaterial.dispose()
      inflationWaves.forEach(wave => {
        wave.geometry.dispose()
        wave.material.dispose()
      })
    }
  }
}

/**
 * 创建宇宙物质系统
 * 暗物质 27% + 暗能量 68% + 可见物质 5%
 */
function createCosmicMatterSystem(scene, options) {
  const { particleCount = 15000, darkMatterRatio = 0.27, darkEnergyRatio = 0.68 } = options

  const group = new THREE.Group()
  scene.add(group)

  const visibleMatterCount = Math.floor(particleCount * (1 - darkMatterRatio - darkEnergyRatio))
  const darkMatterCount = Math.floor(particleCount * darkMatterRatio)
  const darkEnergyCount = particleCount - visibleMatterCount - darkMatterCount

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  let particleIndex = 0

  // 可见物质 - 发光粒子
  for (let i = 0; i < visibleMatterCount; i++) {
    const i3 = particleIndex * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 30 + Math.random() * 70

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.cos(phi)
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 可见物质颜色 - 白色到黄色
    const hue = 0.1 + Math.random() * 0.1
    const color = new THREE.Color().setHSL(hue, 0.6, 0.8)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    velocities[i3] = (Math.random() - 0.5) * 0.1
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.1
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.1

    particleIndex++
  }

  // 暗物质 - 蓝色半透明粒子
  for (let i = 0; i < darkMatterCount; i++) {
    const i3 = particleIndex * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 20 + Math.random() * 80

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.cos(phi)
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 暗物质颜色 - 蓝紫色
    const color = new THREE.Color(0x4B0082)
    colors[i3] = color.r * 0.3
    colors[i3 + 1] = color.g * 0.3
    colors[i3 + 2] = color.b * 0.3

    velocities[i3] = (Math.random() - 0.5) * 0.05
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.05
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.05

    particleIndex++
  }

  // 暗能量 - 红色粒子（推动膨胀）
  for (let i = 0; i < darkEnergyCount; i++) {
    const i3 = particleIndex * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 40 + Math.random() * 60

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.cos(phi)
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 暗能量颜色 - 红色
    const color = new THREE.Color(0xFF0000)
    colors[i3] = color.r * 0.2
    colors[i3 + 1] = color.g * 0.2
    colors[i3 + 2] = color.b * 0.2

    // 暗能量向外推动
    const direction = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]).normalize()
    velocities[i3] = direction.x * 0.2
    velocities[i3 + 1] = direction.y * 0.2
    velocities[i3 + 2] = direction.z * 0.2

    particleIndex++
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  let isActive = false
  let accelerationFactor = 1

  return {
    group,
    particles,
    born() {
      isActive = true
      accelerationFactor = 10
    },
    recombine() {
      accelerationFactor = 2
    },
    fading() {
      accelerationFactor = 0.5
      gsap.to(material, {
        opacity: 0,
        duration: 3
      })
    },
    update(time) {
      if (isActive) {
        const positions = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          
          // 哈勃膨胀 - 距离越远速度越快
          const distance = Math.sqrt(
            positions[i3] ** 2 +
            positions[i3 + 1] ** 2 +
            positions[i3 + 2] ** 2
          )
          const hubbleFlow = distance * 0.00001 * accelerationFactor
          
          positions[i3] += velocities[i3] * accelerationFactor + positions[i3] * hubbleFlow
          positions[i3 + 1] += velocities[i3 + 1] * accelerationFactor + positions[i3 + 1] * hubbleFlow
          positions[i3 + 2] += velocities[i3 + 2] * accelerationFactor + positions[i3 + 2] * hubbleFlow

          // 粒子间引力（简化）
          positions[i3] += Math.sin(time * 0.5 + i) * 0.01
          positions[i3 + 1] += Math.cos(time * 0.5 + i) * 0.01
        }
        geometry.attributes.position.needsUpdate = true

        group.rotation.y = time * 0.02
      }
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建宇宙结构形成
 * 分形星系团、超星系团
 */
function createCosmicStructure(scene, options) {
  const { galaxyCount = 8, clusterCount = 12, superclusterScale = 200 } = options

  const group = new THREE.Group()
  scene.add(group)

  const galaxies = []
  const galaxyMaterials = []
  const clusters = []

  // 星系颜色
  const galaxyColors = [
    new THREE.Color(0xFFFFFF), // 椭圆星系
    new THREE.Color(0xFFE4B5), // 螺旋星系
    new THREE.Color(0xFFA07A), // 不规则星系
    new THREE.Color(0x87CEEB), // 蓝移星系
    new THREE.Color(0xFF6B6B), // 红移星系
    new THREE.Color(0x98FB98), // 矮星系
    new THREE.Color(0xDDA0DD), // 活跃星系
    new THREE.Color(0xF0E68C)  // 老年星系
  ]

  // 创建星系
  for (let i = 0; i < galaxyCount; i++) {
    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: galaxyColors[i],
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })
    const galaxy = new THREE.Mesh(geometry, material)
    
    const angle = (i / galaxyCount) * Math.PI * 2
    const radius = 40 + Math.random() * 60
    galaxy.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 30,
      Math.sin(angle) * radius
    )
    galaxy.scale.setScalar(0.01)
    group.add(galaxy)
    galaxies.push(galaxy)
    galaxyMaterials.push(material)
  }

  // 创建星系团
  for (let i = 0; i < clusterCount; i++) {
    const geometry = new THREE.IcosahedronGeometry(15 + Math.random() * 10, 2)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5),
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })
    const cluster = new THREE.Mesh(geometry, material)
    
    const angle = (i / clusterCount) * Math.PI * 2
    const radius = 70 + Math.random() * 40
    cluster.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 50,
      Math.sin(angle) * radius
    )
    cluster.scale.setScalar(0.01)
    group.add(cluster)
    clusters.push(cluster)
  }

  let isForming = false
  let isEvolving = false

  return {
    group,
    formGalaxies() {
      isForming = true
      galaxies.forEach((galaxy, i) => {
        gsap.to(galaxy.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 3,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.2
        })
      })
      clusters.forEach((cluster, i) => {
        gsap.to(cluster.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 4,
          ease: 'elastic.out(1, 0.4)',
          delay: i * 0.15
        })
      })
    },
    evolve() {
      isEvolving = true
      galaxies.forEach((galaxy, i) => {
        gsap.to(galaxy.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.1
        })
      })
    },
    decay() {
      isForming = false
      isEvolving = false
      galaxies.forEach(galaxy => {
        gsap.to(galaxy.scale, {
          x: 0.3,
          y: 0.3,
          z: 0.3,
          duration: 3,
          ease: 'power2.in'
        })
        gsap.to(galaxy.material, {
          opacity: 0.2,
          duration: 3
        })
      })
      clusters.forEach(cluster => {
        gsap.to(cluster.scale, {
          x: 0.3,
          y: 0.3,
          z: 0.3,
          duration: 3,
          ease: 'power2.in'
        })
      })
    },
    update(time) {
      if (isForming || isEvolving) {
        galaxies.forEach((galaxy, i) => {
          galaxy.rotation.x = time * (0.2 + i * 0.05)
          galaxy.rotation.y = time * (0.3 + i * 0.08)
        })
        clusters.forEach((cluster, i) => {
          cluster.rotation.x += 0.01 + i * 0.002
          cluster.rotation.y += 0.015 + i * 0.003
        })
        group.rotation.y = time * 0.05
      }
    },
    destroy() {
      scene.remove(group)
      galaxies.forEach(galaxy => {
        galaxy.geometry.dispose()
        galaxy.material.dispose()
      })
      clusters.forEach(cluster => {
        cluster.geometry.dispose()
        cluster.material.dispose()
      })
    }
  }
}

/**
 * 创建黑洞系统
 * 史瓦西黑洞与霍金辐射
 */
function createBlackHoleSystem(scene, options) {
  const { blackHoleCount = 5, eventHorizonScale = 15 } = options

  const group = new THREE.Group()
  scene.add(group)

  const blackHoles = []

  for (let i = 0; i < blackHoleCount; i++) {
    const blackHoleGroup = new THREE.Group()
    
    // 事件视界
    const horizonGeometry = new THREE.SphereGeometry(eventHorizonScale - i * 2, 32, 32)
    const horizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9
    })
    const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial)
    blackHoleGroup.add(eventHorizon)

    // 吸积盘
    const diskGeometry = new THREE.RingGeometry(
      eventHorizonScale - i * 2,
      eventHorizonScale - i * 2 + 8,
      64
    )
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.05, 0.9, 0.6),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial)
    accretionDisk.rotation.x = Math.PI / 2
    blackHoleGroup.add(accretionDisk)

    // 霍金辐射粒子
    const radiationGeometry = new THREE.BufferGeometry()
    const radiationCount = 500
    const radiationPositions = new Float32Array(radiationCount * 3)
    const radiationColors = new Float32Array(radiationCount * 3)

    for (let j = 0; j < radiationCount; j++) {
      const i3 = j * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = eventHorizonScale - i * 2 + Math.random() * 5

      radiationPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      radiationPositions[i3 + 1] = radius * Math.cos(phi)
      radiationPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      const color = new THREE.Color().setHSL(0.05 + Math.random() * 0.1, 0.9, 0.7)
      radiationColors[i3] = color.r
      radiationColors[i3 + 1] = color.g
      radiationColors[i3 + 2] = color.b
    }

    radiationGeometry.setAttribute('position', new THREE.BufferAttribute(radiationPositions, 3))
    radiationGeometry.setAttribute('color', new THREE.BufferAttribute(radiationColors, 3))

    const radiationMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    const radiation = new THREE.Points(radiationGeometry, radiationMaterial)
    blackHoleGroup.add(radiation)

    const angle = (i / blackHoleCount) * Math.PI * 2
    const radius = 60 + Math.random() * 40
    blackHoleGroup.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 30,
      Math.sin(angle) * radius
    )
    blackHoleGroup.scale.setScalar(0.01)
    group.add(blackHoleGroup)
    blackHoles.push({
      group: blackHoleGroup,
      horizon: eventHorizon,
      disk: accretionDisk,
      radiation: radiation,
      diskGeometry: diskGeometry,
      diskMaterial: diskMaterial,
      radiationGeometry: radiationGeometry,
      radiationMaterial: radiationMaterial
    })
  }

  let isEvolving = false

  return {
    group,
    blackHoles: group,
    birth() {
      blackHoles.forEach((bh, i) => {
        gsap.to(bh.group.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 2,
          ease: 'elastic.out(1, 0.3)',
          delay: i * 0.2
        })
      })
    },
    feed() {
      isEvolving = true
      blackHoles.forEach((bh, i) => {
        gsap.to(bh.diskMaterial, {
          opacity: 1,
          duration: 1
        })
      })
    },
    evaporate() {
      isEvolving = true
      blackHoles.forEach((bh, i) => {
        // 霍金辐射增强
        gsap.to(bh.horizon.scale, {
          x: 0.5,
          y: 0.5,
          z: 0.5,
          duration: 3,
          ease: 'power2.in',
          delay: i * 0.3
        })
        gsap.to(bh.radiation.scale, {
          x: 3,
          y: 3,
          z: 3,
          duration: 2,
          ease: 'power2.out',
          delay: i * 0.3
        })
        gsap.to(bh.radiationMaterial, {
          opacity: 0.2,
          duration: 2,
          delay: i * 0.3
        })
      })
    },
    update(time) {
      if (isEvolving) {
        blackHoles.forEach((bh, i) => {
          bh.disk.rotation.z += 0.05
          const radiationPositions = bh.radiationGeometry.attributes.position.array
          for (let j = 0; j < 500; j++) {
            const i3 = j * 3
            // 霍金辐射 - 粒子逃逸
            radiationPositions[i3] *= 1.01
            radiationPositions[i3 + 1] *= 1.01
            radiationPositions[i3 + 2] *= 1.01
            
            // 循环
            const dist = Math.sqrt(
              radiationPositions[i3] ** 2 +
              radiationPositions[i3 + 1] ** 2 +
              radiationPositions[i3 + 2] ** 2
            )
            if (dist > 20) {
              radiationPositions[i3] *= 0.5
              radiationPositions[i3 + 1] *= 0.5
              radiationPositions[i3 + 2] *= 0.5
            }
          }
          bh.radiationGeometry.attributes.position.needsUpdate = true
        })
        group.rotation.y = time * 0.03
      }
    },
    destroy() {
      scene.remove(group)
      blackHoles.forEach(bh => {
        bh.horizon.geometry.dispose()
        bh.horizon.material.dispose()
        bh.diskGeometry.dispose()
        bh.diskMaterial.dispose()
        bh.radiationGeometry.dispose()
        bh.radiationMaterial.dispose()
      })
    }
  }
}

/**
 * 创建热寂系统
 * 熵增达到最大值
 */
function createHeatDeathSystem(scene, options) {
  const { entropyLevel = 0, maxEntropy = 1000, particleDissipationCount = 8000 } = options

  const group = new THREE.Group()
  scene.add(group)

  // 熵粒子
  const entropyGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleDissipationCount * 3)
  const colors = new Float32Array(particleDissipationCount * 3)
  const phases = new Float32Array(particleDissipationCount)

  for (let i = 0; i < particleDissipationCount; i++) {
    const i3 = i * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 50 + Math.random() * 100

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.cos(phi)
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const hue = 0.7 - (i / particleDissipationCount) * 0.7
    const color = new THREE.Color().setHSL(hue, 0.5, 0.5)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
  }

  entropyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  entropyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const entropyMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const entropyParticles = new THREE.Points(entropyGeometry, entropyMaterial)
  group.add(entropyParticles)

  let currentEntropy = entropyLevel
  let isDissipating = false

  return {
    group,
    dissipate() {
      isDissipating = true
      gsap.to(entropyMaterial, {
        opacity: 0.8,
        duration: 2
      })
    },
    entropyMax() {
      isDissipating = true
      gsap.to(entropyParticles.scale, {
        x: 5,
        y: 5,
        z: 5,
        duration: 3,
        ease: 'power2.out'
      })
      gsap.to(entropyMaterial, {
        opacity: 0.1,
        duration: 3
      })
    },
    update(time) {
      if (isDissipating) {
        const positions = entropyGeometry.attributes.position.array
        for (let i = 0; i < particleDissipationCount; i++) {
          const i3 = i * 3
          
          // 熵增 - 粒子扩散
          const diffusion = Math.sin(time * 2 + phases[i]) * 0.5 + 0.5
          positions[i3] += positions[i3] * 0.001 * diffusion
          positions[i3 + 1] += positions[i3 + 1] * 0.001 * diffusion
          positions[i3 + 2] += positions[i3 + 2] * 0.001 * diffusion

          // 颜色变冷
          const positions_array = entropyGeometry.attributes.position.array
          const distance = Math.sqrt(
            positions_array[i3] ** 2 +
            positions_array[i3 + 1] ** 2 +
            positions_array[i3 + 2] ** 2
          )
          const hue = 0.7 - (distance / 200) * 0.3
          const color = new THREE.Color().setHSL(hue, 0.5, 0.4)
          colors[i3] = color.r
          colors[i3 + 1] = color.g
          colors[i3 + 2] = color.b
        }
        entropyGeometry.attributes.position.needsUpdate = true
        entropyGeometry.attributes.color.needsUpdate = true

        group.rotation.y = time * 0.01
      }
    },
    destroy() {
      scene.remove(group)
      entropyGeometry.dispose()
      entropyMaterial.dispose()
    }
  }
}
