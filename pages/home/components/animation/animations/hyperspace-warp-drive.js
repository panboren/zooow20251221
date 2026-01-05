/**
 * 超空间曲速驱动动画
 * 实现光速穿越、时空弯曲、星云拉伸等炸裂特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateHyperspaceWarpDrive(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 飞船视角
    setupInitialCamera(camera, new THREE.Vector3(0, 10, 50), 80, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'hyperspace-warp-drive' })
      },
      onError,
      '超空间曲速驱动',
      controls
    )

    // 创建曲速引擎特效 - 青春色彩
    const warpEngine = createWarpEngine(scene, {
      engineCount: 4,
      maxPower: 100,
      trailLength: 200
    })

    // 创建星云走廊 - 青春色彩
    const nebulaCorridor = createNebulaCorridor(scene, {
      length: 400,
      sectionCount: 50,
      particleCount: 8000
    })

    // 创建时空扭曲场 - 青春色彩
    const spacetimeWarp = createSpacetimeWarp(scene, {
      warpRadius: 80,
      distortionStrength: 5
    })

    // 阶段1: 引擎预热 - 能量积累
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 30,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '摄像机移动错误'
      )
    })

    tl.call(() => {
      warpEngine.animateWarmup()
    }, null, 1)

    // 阶段2: 曲速启动 - 时空压缩
    tl.call(() => {
      warpEngine.activateWarpDrive()
      spacetimeWarp.activate()
    }, null, 3)

    tl.to(camera.position, {
      x: 0,
      y: 2,
      z: 15,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '曲速启动错误'
      )
    }, 3)

    // 时空压缩效果
    tl.to(camera, {
      fov: 60,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时空压缩错误'
      )
    }, 3)

    // 阶段3: 光速穿越 - 星云拉伸
    tl.call(() => {
      nebulaCorridor.animateAcceleration()
      warpEngine.animateMaxPower()
    }, null, 4)

    tl.to(camera.position, {
      x: 0,
      y: 1,
      z: 5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '光速穿越错误'
      )
    }, 4)

    // 星云拉伸效果
    tl.to(camera, {
      fov: 150,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '星云拉伸错误'
      )
    }, 4)

    // 速度线效果
    tl.call(() => {
      spacetimeWarp.animateLightSpeed()
    }, null, 5)

    // 阶段4: 曲速稳定 - 持续航行
    tl.to(camera.position, {
      x: 0,
      y: 0.5,
      z: 2,
      duration: 3,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '曲速稳定错误'
      )
    }, 6)

    // 阶段5: 曲速退出 - 时空恢复
    tl.call(() => {
      warpEngine.animateShutdown()
      nebulaCorridor.animateDeceleration()
    }, null, 9)

    tl.to(camera.position, {
      x: 0,
      y: 10,
      z: 20,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '曲速退出错误'
      )
    }, 9)

    // 时空恢复
    tl.to(camera, {
      fov: 90,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '时空恢复错误'
      )
    }, 9)

    // 阶段6: 最终停靠
    tl.to(camera.position, {
      x: 0.02,
      y: 0.02,
      z: 0.02,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终停靠错误'
      )
    }, 11)

    // FOV恢复
    tl.to(camera, {
      fov: 75,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终恢复错误'
      )
    }, 11)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      warpEngine.update(time)
      nebulaCorridor.update(time)
      spacetimeWarp.update(time)
    }

    // 清理函数
    const cleanup = () => {
      warpEngine.destroy()
      nebulaCorridor.destroy()
      spacetimeWarp.destroy()
    }

    tl.call(cleanup, null, 13)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建曲速引擎特效 - 青春色彩
 */
function createWarpEngine(scene, options) {
  const {
    engineCount = 4,
    maxPower = 100,
    trailLength = 200
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const engines = []
  const engineMaterials = []
  const trails = []

  // 引擎核心颜色 - 青春色彩
  const engineColors = [
    new THREE.Color(0xFF1493), // 深粉色
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFFFF00)  // 黄色
  ]

  for (let i = 0; i < engineCount; i++) {
    // 引擎核心
    const coreGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 16)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: engineColors[i],
      emissive: engineColors[i],
      emissiveIntensity: 2.5, // 增强发光效果
      transparent: true
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)

    // 引擎布局（飞船尾部的四个方向）
    const angle = (i / engineCount) * Math.PI * 2
    const distance = 2
    core.position.set(
      Math.cos(angle) * distance,
      Math.sin(angle) * distance,
      -4
    )
    core.rotation.x = Math.PI / 2

    group.add(core)
    engines.push(core)
    engineMaterials.push(coreMaterial)

    // 引擎尾迹 - 青春色彩
    const trailGeometry = new THREE.BufferGeometry()
    const trailPositions = new Float32Array(trailLength * 3)
    const trailColors = new Float32Array(trailLength * 3)
    const trailSizes = new Float32Array(trailLength)

    for (let j = 0; j < trailLength; j++) {
      trailPositions[j * 3] = Math.cos(angle) * distance
      trailPositions[j * 3 + 1] = Math.sin(angle) * distance
      trailPositions[j * 3 + 2] = -4 - j * 0.2

      const color = engineColors[i].clone()
      color.multiplyScalar(1 - j / trailLength)
      trailColors[j * 3] = color.r
      trailColors[j * 3 + 1] = color.g
      trailColors[j * 3 + 2] = color.b

      trailSizes[j] = (1 - j / trailLength) * 3
    }

    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
    trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1))

    const trailMaterial = new THREE.PointsMaterial({
      size: 2.5, // 增大粒子尺寸
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const trail = new THREE.Points(trailGeometry, trailMaterial)
    group.add(trail)
    trails.push({ trail, geometry: trailGeometry, material: trailMaterial })
  }

  let isActive = false
  let currentPower = 0

  return {
    group,
    animateWarmup() {
      // 引擎预热动画
      engines.forEach((engine, i) => {
        gsap.to(engine.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
          yoyo: true,
          repeat: 2
        })
      })
    },
    activateWarpDrive() {
      isActive = true
      currentPower = maxPower

      // 引擎功率提升
      engines.forEach((engine, i) => {
        gsap.to(engine.scale, {
          x: 3,
          y: 3,
          z: 3,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(engineMaterials[i], {
          emissiveIntensity: 6, // 增强发光效果
          duration: 0.3,
          ease: 'power2.in'
        })
      })
    },
    animateMaxPower() {
      // 最大功率爆发
      engines.forEach((engine, i) => {
        gsap.to(engine.scale, {
          x: 5,
          y: 5,
          z: 5,
          duration: 0.2,
          ease: 'power4.in'
        })

        gsap.to(engine.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    },
    animateShutdown() {
      isActive = false
      currentPower = 0

      // 引擎关闭
      engines.forEach((engine, i) => {
        gsap.to(engine.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 1,
          ease: 'power2.in'
        })

        gsap.to(engineMaterials[i], {
          emissiveIntensity: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    },
    update(time) {
      if (isActive) {
        // 引擎脉动
        engines.forEach((engine, i) => {
          const pulse = Math.sin(time * 10 + i) * 0.2 + 1
          engine.scale.set(pulse, pulse, pulse)
        })

        // 更新尾迹
        trails.forEach(({ geometry }) => {
          const positions = geometry.attributes.position.array
          for (let i = positions.length - 3; i >= 3; i -= 3) {
            positions[i] = positions[i - 3]
            positions[i + 1] = positions[i - 2]
            positions[i + 2] = positions[i - 1]
          }
          geometry.attributes.position.needsUpdate = true
        })
      }
    },
    destroy() {
      scene.remove(group)
      engines.forEach(engine => {
        engine.geometry.dispose()
        engine.material.dispose()
      })
      trails.forEach(({ geometry, material }) => {
        geometry.dispose()
        material.dispose()
      })
    }
  }
}

/**
 * 创建星云走廊 - 青春色彩
 */
function createNebulaCorridor(scene, options) {
  const {
    length = 400,
    sectionCount = 50,
    particleCount = 8000
  } = options

  const group = new THREE.Group()
  scene.add(group)

  // 星云粒子系统 - 青春色彩
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  // 星云颜色（青春明亮色调）
  const nebulaColors = [
    new THREE.Color(0xFF1493), // 深粉色
    new THREE.Color(0xFF69B4), // 热粉色
    new THREE.Color(0x00FFFF), // 青色
    new THREE.Color(0x00FF00), // 绿色
    new THREE.Color(0xFFFF00), // 黄色
    new THREE.Color(0xFF00FF), // 品红
    new THREE.Color(0x9370DB)  // 中紫色
  ]

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 30 + 5
    const z = (Math.random() - 0.5) * length

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.sin(angle) * radius
    positions[i * 3 + 2] = z

    const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 2] = -0.5 - Math.random() * 2 // 向后流动
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2, // 增大粒子尺寸
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  let speedMultiplier = 1

  return {
    group,
    animateAcceleration() {
      speedMultiplier = 10

      // 速度线拉伸效果
      gsap.to(particles.scale, {
        x: 3,
        y: 3,
        z: 0.3,
        duration: 1,
        ease: 'power2.in'
      })
    },
    animateDeceleration() {
      speedMultiplier = 1

      // 恢复正常形状
      gsap.to(particles.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: 'power2.out'
      })
    },
    update(time) {
      const positions = geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * speedMultiplier
        positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier
        positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier

        // 循环使用粒子
        if (positions[i * 3 + 2] < -length / 2) {
          positions[i * 3 + 2] = length / 2
        }
      }
      geometry.attributes.position.needsUpdate = true
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建时空扭曲场 - 青春色彩
 */
function createSpacetimeWarp(scene, options) {
  const {
    warpRadius = 80,
    distortionStrength = 5
  } = options

  const group = new THREE.Group()
  scene.add(group)

  // 扭曲网格 - 青春色彩
  const gridGeometry = new THREE.SphereGeometry(warpRadius, 32, 32)
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF1493, // 深粉色
    transparent: true,
    opacity: 0.2, // 提高透明度
    wireframe: true,
    side: THREE.DoubleSide
  })
  const grid = new THREE.Mesh(gridGeometry, gridMaterial)
  group.add(grid)

  // 扭曲力场线 - 青春色彩
  const fieldLines = []
  const lineCount = 24

  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2
    const points = []

    for (let j = 0; j <= 20; j++) {
      const t = j / 20
      const radius = warpRadius * (1 + Math.sin(t * Math.PI) * 0.3)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius * Math.sin(t * Math.PI)
      const z = -warpRadius * 2 * t
      points.push(new THREE.Vector3(x, y, z))
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00FFFF, // 青色
      transparent: true,
      opacity: 0.4 // 提高透明度
    })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    group.add(line)
    fieldLines.push(line)
  }

  let isActive = false

  return {
    group,
    activate() {
      isActive = true

      // 扭曲场激活
      gsap.to(gridMaterial, {
        opacity: 0.4, // 提高透明度
        duration: 0.5,
        ease: 'power2.in'
      })
    },
    animateLightSpeed() {
      // 光速效果
      gsap.to(grid.scale, {
        x: 0.5,
        y: 0.5,
        z: 2,
        duration: 1,
        ease: 'power2.inOut'
      })

      fieldLines.forEach((line, i) => {
        gsap.to(line.material, {
          opacity: 0.9, // 提高透明度
          duration: 0.3,
          delay: i * 0.02,
          ease: 'power2.in'
        })
      })
    },
    update(time) {
      if (isActive) {
        // 扭曲场脉动
        const pulse = Math.sin(time * 2) * 0.1 + 1
        grid.scale.set(pulse, pulse, pulse)

        // 力场线旋转
        group.rotation.y += 0.01
        group.rotation.x = Math.sin(time * 0.5) * 0.1
      }
    },
    destroy() {
      scene.remove(group)
      gridGeometry.dispose()
      gridMaterial.dispose()
      fieldLines.forEach(line => {
        line.geometry.dispose()
        line.material.dispose()
      })
    }
  }
}
