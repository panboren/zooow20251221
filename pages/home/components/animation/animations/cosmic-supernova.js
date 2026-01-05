/**
 * 宇宙超级新星爆炸动画
 * 融合超新星爆炸、黑洞吸积、引力波等炸裂特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateCosmicSupernova(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 俯视视角
    setupInitialCamera(camera, new THREE.Vector3(0, 200, 100), 250, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-supernova' })
      },
      onError,
      '宇宙超级新星',
      controls
    )

    // 创建简化的超新星爆炸特效 - 移除粒子系统，使用青春绚丽配色
    const supernova = createSupernovaExplosion(scene, {
      coreRadius: 15,
      shockwaveRadius: 150,
      coreColor: new THREE.Color(0xFF1493), // 深粉色
      explosionColor: new THREE.Color(0x00FFFF) // 青色
    })

    // 创建黑洞引力场 - 使用青春绚丽配色
    const blackHole = createBlackHole(scene, {
      radius: 8,
      accretionDiskRadius: 50,
      particleStreamCount: 2000,
      diskColor: new THREE.Color(0xFF00FF), // 品红色
      particleColors: [new THREE.Color(0xFF1493), new THREE.Color(0x00FFFF), new THREE.Color(0x00FF00)] // 粉、青、绿
    })

    // 创建引力波 - 使用青春绚丽配色
    const gravitationalWaves = createGravitationalWaves(scene, {
      waveCount: 12,
      maxRadius: 200,
      waveColor: new THREE.Color(0x9400D3) // 紫色
    })

    // 阶段1: 恒星宁静期 - 缓慢旋转
    tl.to(camera.position, {
      x: 0,
      y: 100,
      z: 80,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '摄像机移动错误'
      )
    })

    // 阶段2: 核心不稳定 - 恒星脉动
    tl.call(() => {
      supernova.animatePulsation()
    }, null, 3)

    tl.to(camera, {
      fov: 110,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3)

    // 阶段3: 超新星爆发 - 剧烈爆炸
    tl.call(() => {
      supernova.animateExplosion(4)
      blackHole.activate()
      gravitationalWaves.animate()
    }, null, 4.5)

    // 剧烈震动效果
    tl.to(camera.position, {
      x: 5,
      y: 60,
      z: 45,
      duration: 1,
      ease: 'elastic.out(1, 0.8)',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '爆炸震动错误'
      )
    }, 4.5)

    // FOV冲击波效果
    tl.to(camera, {
      fov: 140,
      duration: 0.3,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV冲击错误'
      )
    }, 4.5)

    tl.to(camera, {
      fov: 90,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 4.8)

    // 阶段4: 黑洞形成 - 物质吸积
    tl.call(() => {
      blackHole.animateAccretion(3)
      gravitationalWaves.intensify()
    }, null, 6)

    tl.to(camera.position, {
      x: 0,
      y: 40,
      z: 25,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '黑洞接近错误'
      )
    }, 6)

    // 阶段5: 时空扭曲 - 引力场效应
    tl.call(() => {
      blackHole.animateDistortion()
    }, null, 9)

    tl.to(camera, {
      fov: 130,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '引力扭曲错误'
      )
    }, 9)

    // 阶段6: 最终平静 - 回到默认视角
    tl.to(camera.position, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定位错误'
      )
    }, 11)

    // FOV恢复
    tl.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终恢复错误'
      )
    }, 11)

    // 更新循环 - 移除粒子更新以提升性能
    const updateHandler = () => {
      const time = Date.now() * 0.001
      supernova.update(time)
      blackHole.update(time)
      gravitationalWaves.update(time)
    }

    // 清理函数
    const cleanup = () => {
      supernova.destroy()
      blackHole.destroy()
      gravitationalWaves.destroy()
    }

    tl.call(cleanup, null, 14)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建简化的超新星爆炸效果 - 移除粒子系统，使用青春绚丽配色
 */
function createSupernovaExplosion(scene, options) {
  const {
    coreRadius = 10,
    shockwaveRadius = 100,
    coreColor = new THREE.Color(0xFF1493), // 深粉色
    explosionColor = new THREE.Color(0x00FFFF) // 青色
  } = options

  const group = new THREE.Group()
  scene.add(group)

  // 恒星核心 - 青春绚丽配色
  const coreGeometry = new THREE.SphereGeometry(coreRadius, 32, 32)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: coreColor,
    emissive: coreColor,
    emissiveIntensity: 2.5, // 增强发光效果
    transparent: true,
    opacity: 0.9
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 冲击波环 - 青春绚丽配色
  const shockwaveGeometry = new THREE.TorusGeometry(coreRadius * 1.5, 1, 16, 100)
  const shockwaveMaterial = new THREE.MeshBasicMaterial({
    color: explosionColor,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
  })
  const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial)
  group.add(shockwave)

  let isExploded = false

  return {
    group,
    animatePulsation() {
      gsap.to(core.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
        yoyo: true,
        repeat: 3
      })
    },
    animateExplosion(duration) {
      isExploded = true

      // 核心爆炸
      gsap.to(core.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: duration * 0.2,
        ease: 'power4.in'
      })

      // 冲击波扩散
      gsap.to(shockwave.scale, {
        x: shockwaveRadius / coreRadius,
        y: shockwaveRadius / coreRadius,
        z: shockwaveRadius / coreRadius,
        duration: duration,
        ease: 'power2.out'
      })

      gsap.to(shockwaveMaterial, {
        opacity: 0.9, // 提高透明度
        duration: duration * 0.3,
        ease: 'power2.in'
      })

      gsap.to(shockwaveMaterial, {
        opacity: 0,
        duration: duration * 0.7,
        ease: 'power2.out',
        delay: duration * 0.3
      })
    },
    animateRemnants() {
      // 无粒子系统，此方法为空
    },
    update(time) {
      // 无粒子系统，此方法为空
    },
    destroy() {
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      shockwaveGeometry.dispose()
      shockwaveMaterial.dispose()
    }
  }
}

/**
 * 创建黑洞效果 - 使用青春绚丽配色
 */
function createBlackHole(scene, options) {
  const {
    radius = 8,
    accretionDiskRadius = 50,
    particleStreamCount = 2000,
    diskColor = new THREE.Color(0xFF00FF), // 品红色
    particleColors = [new THREE.Color(0xFF1493), new THREE.Color(0x00FFFF), new THREE.Color(0x00FF00)] // 粉、青、绿
  } = options

  const group = new THREE.Group()
  scene.add(group)

  // 黑洞本体（事件视界）
  const blackHoleGeometry = new THREE.SphereGeometry(radius, 32, 32)
  const blackHoleMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    emissive: 0x111111,
    emissiveIntensity: 0.8 // 增强发光效果
  })
  const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial)
  group.add(blackHole)

  // 吸积盘 - 青春绚丽配色
  const diskGeometry = new THREE.TorusGeometry(radius * 3, radius * 0.5, 16, 100)
  const diskMaterial = new THREE.MeshBasicMaterial({
    color: diskColor,
    emissive: diskColor.clone().multiplyScalar(1.5), // 增强发光效果
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  })
  const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial)
  accretionDisk.rotation.x = Math.PI / 2
  group.add(accretionDisk)

  // 粒子流（吸积物质）- 青春绚丽配色
  const streamGeometry = new THREE.BufferGeometry()
  const streamPositions = new Float32Array(particleStreamCount * 3)
  const streamColors = new Float32Array(particleStreamCount * 3)
  const originalPositions = new Float32Array(particleStreamCount * 3)  // 保存原始位置

  for (let i = 0; i < particleStreamCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * accretionDiskRadius + radius * 4
    const height = (Math.random() - 0.5) * radius * 2

    const x = Math.cos(angle) * distance
    const y = height
    const z = Math.sin(angle) * distance

    streamPositions[i * 3] = x
    streamPositions[i * 3 + 1] = y
    streamPositions[i * 3 + 2] = z

    // 保存原始位置用于重置
    originalPositions[i * 3] = x
    originalPositions[i * 3 + 1] = y
    originalPositions[i * 3 + 2] = z

    // 使用青春绚丽的多色配色方案
    const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)].clone()
    const temperature = Math.random()
    const color = new THREE.Color()
    color.lerpColors(randomColor, new THREE.Color(0xFFFFFF), temperature * 0.3)
    streamColors[i * 3] = color.r
    streamColors[i * 3 + 1] = color.g
    streamColors[i * 3 + 2] = color.b
  }

  streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3))
  streamGeometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3))

  const streamMaterial = new THREE.PointsMaterial({
    size: 1.8, // 增大粒子尺寸
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particleStream = new THREE.Points(streamGeometry, streamMaterial)
  group.add(particleStream)

  let isActive = false

  return {
    group,
    activate() {
      isActive = true
    },
    animateAccretion(duration) {
      // 吸积盘加速旋转
      gsap.to(accretionDisk.rotation, {
        y: Math.PI * 8,
        duration: duration,
        ease: 'power2.inOut'
      })

      // 黑洞引力效应
      gsap.to(blackHole.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: duration * 0.5,
        ease: 'power2.in',
        yoyo: true,
        repeat: 1
      })
    },
    animateDistortion() {
      // 时空扭曲效果
      gsap.to(group.rotation, {
        x: Math.PI / 4,
        z: Math.PI / 6,
        duration: 2,
        ease: 'elastic.out(1, 0.5)'
      })
    },
    update(time) {
      if (isActive) {
        accretionDisk.rotation.y += 0.03 // 加快旋转速度

        // 优化粒子向黑洞坠落的计算
        const positions = streamGeometry.attributes.position.array
        for (let i = 0; i < particleStreamCount; i++) {
          const idx = i * 3
          let x = positions[idx]
          let y = positions[idx + 1]
          let z = positions[idx + 2]

          const distance = Math.sqrt(x * x + y * y + z * z)

          if (distance > radius) {
            // 使用预计算的原始位置，避免重复创建向量
            const directionX = -x / distance
            const directionY = -y / distance
            const directionZ = -z / distance

            const speed = 0.7 / (distance * 0.1 + 1) // 提高速度
            positions[idx] += directionX * speed
            positions[idx + 1] += directionY * speed
            positions[idx + 2] += directionZ * speed
          } else {
            // 重置粒子到原始位置
            positions[idx] = originalPositions[idx]
            positions[idx + 1] = originalPositions[idx + 1]
            positions[idx + 2] = originalPositions[idx + 2]
          }
        }
        streamGeometry.attributes.position.needsUpdate = true
      }
    },
    destroy() {
      scene.remove(group)
      blackHoleGeometry.dispose()
      blackHoleMaterial.dispose()
      diskGeometry.dispose()
      diskMaterial.dispose()
      streamGeometry.dispose()
      streamMaterial.dispose()
    }
  }
}

/**
 * 创建引力波效果 - 使用青春绚丽配色
 */
function createGravitationalWaves(scene, options) {
  const {
    waveCount = 12,
    maxRadius = 200,
    waveColor = new THREE.Color(0x9400D3) // 紫色
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const waves = []
  const waveMaterials = []

  for (let i = 0; i < waveCount; i++) {
    const radius = maxRadius * (i + 1) / waveCount
    const geometry = new THREE.RingGeometry(radius - 2, radius + 2, 64)
    const material = new THREE.MeshBasicMaterial({
      color: waveColor,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
    const wave = new THREE.Mesh(geometry, material)
    wave.rotation.x = Math.PI / 2
    group.add(wave)
    waves.push(wave)
    waveMaterials.push(material)
  }

  let isAnimating = false

  return {
    group,
    animate() {
      isAnimating = true

      waves.forEach((wave, i) => {
        gsap.to(waveMaterials[i], {
          opacity: 0.8, // 提高透明度
          duration: 0.5,
          delay: i * 0.1,
          ease: 'power2.in'
        })

        gsap.to(waveMaterials[i], {
          opacity: 0,
          duration: 2,
          delay: i * 0.1 + 0.5,
          ease: 'power2.out'
        })
      })
    },
    intensify() {
      // 加强引力波效果
      waves.forEach((wave, i) => {
        gsap.to(wave.scale, {
          x: 1.3, // 增大比例
          y: 1.3,
          z: 1.3,
          duration: 1,
          delay: i * 0.05,
          ease: 'elastic.out(1, 0.5)',
          yoyo: true,
          repeat: 1
        })
      })
    },
    update(time) {
      if (isAnimating) {
        waves.forEach((wave, i) => {
          wave.rotation.z = Math.sin(time * 0.7 + i) * 0.15 // 提高速度和幅度
        })
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
