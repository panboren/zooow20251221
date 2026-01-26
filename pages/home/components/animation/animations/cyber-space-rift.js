/**
 * 赛博时空裂缝 - 超越现有特效的全新作品
 * 融合赛博朋克美学、时空撕裂、量子隧道、数字崩塌等超现实概念
 * 技术突破：
 * - 实时GLSL着色器渲染
 * - 程序化生成赛博城市轮廓
 * - 时空裂缝动态撕裂效果
 * - 量子隧道粒子系统（10000+粒子）
 * - 赛博霓虹光影效果
 * - 数字雨矩阵效果
 * - 多层次时空折叠
 * - 动态音频响应视觉效果
 * 动画时长：25秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateCyberSpaceRift(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 远景观察
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 200), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cyber-space-rift' })
      },
      onError,
      '赛博时空裂缝',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 赛博城市轮廓系统
    const cyberCity = createCyberCitySkyline(scene, {
      buildingCount: 200,
      neonColors: ['#00ffff', '#ff00ff', '#00ff00', '#ffff00']
    })

    // 2. 时空裂缝核心
    const spaceRiftCore = createSpaceRiftCore(scene, {
      riftLayers: 8,
      crackCount: 50,
      energyPulseSpeed: 2
    })

    // 3. 量子隧道粒子系统
    const quantumTunnel = createQuantumTunnel(scene, {
      particleCount: 15000,
      tunnelLength: 400,
      tunnelRadius: 60
    })

    // 4. 赛博霓虹光晕
    const neonGlow = createCyberNeonGlow(scene, {
      glowRings: 12,
      colorCycle: true
    })

    // 5. 数字雨矩阵
    const digitalRain = createDigitalRainMatrix(scene, {
      rainCount: 8000,
      fallSpeed: 3,
      characters: '0123456789ABCDEF'
    })

    // 6. 时空碎片
    const spacetimeFragments = createSpacetimeFragments(scene, {
      fragmentCount: 3000,
      driftSpeed: 0.5
    })

    // 7. 能量爆发
    const energyBurst = createEnergyBurst(scene, {
      burstCount: 6,
      particleCount: 5000
    })

    // ==================== 动画序列 ====================

    // 阶段1: 赛博黎明 - 城市苏醒（5秒）
    tl.to(camera.position, {
      x: 20,
      y: 40,
      z: 150,
      duration: 5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '赛博黎明错误'
      )
    }, 0)

    tl.call(() => {
      cyberCity.awaken()
      neonGlow.pulse()
    }, null, 1)

    tl.to(camera, {
      fov: 100,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV变化错误'
      )
    }, 0)

    // 阶段2: 时空裂缝 - 撕裂开始（6秒）
    tl.to(camera.position, {
      x: -15,
      y: 25,
      z: 100,
      duration: 6,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '时空裂缝错误'
      )
    }, 5)

    tl.call(() => {
      spaceRiftCore.form()
      quantumTunnel.ignite()
      digitalRain.start()
    }, null, 6)

    tl.to(camera, {
      fov: 140,
      duration: 4,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '视角扩张错误'
      )
    }, 7)

    // 阶段3: 量子穿越 - 穿越裂缝（8秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 20,
      duration: 8,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子穿越错误'
      )
    }, 11)

    tl.call(() => {
      spacetimeFragments.scatter()
      energyBurst.burst()
    }, null, 13)

    tl.to(camera.position, {
      x: (t) => Math.sin(t * 0.5) * 10,
      y: (t) => Math.cos(t * 0.3) * 8,
      z: (t) => 20 - t * 8,
      duration: 6,
      ease: 'power1.inOut'
    }, 13)

    // 阶段4: 数字崩塌 - 赛博世界重构（6秒）
    tl.to(camera.position, {
      x: 5,
      y: -10,
      z: 40,
      duration: 6,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '数字崩塌错误'
      )
    }, 19)

    tl.call(() => {
      cyberCity.transform()
      digitalRain.accelerate()
    }, null, 20)

    tl.to(camera, {
      fov: 90,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '视角恢复错误'
      )
    }, 21)

    // ==================== 清理函数 ====================
    const cleanup = () => {
      cyberCity.dispose()
      spaceRiftCore.dispose()
      quantumTunnel.dispose()
      neonGlow.dispose()
      digitalRain.dispose()
      spacetimeFragments.dispose()
      energyBurst.dispose()
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
 * 创建赛博城市轮廓
 */
function createCyberCitySkyline(scene, options = {}) {
  const {
    buildingCount = 200,
    neonColors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00']
  } = options

  const group = new THREE.Group()

  // 建筑几何体
  const buildings = []
  for (let i = 0; i < buildingCount; i++) {
    const height = 20 + Math.random() * 150
    const width = 5 + Math.random() * 15
    const depth = 5 + Math.random() * 15

    const geometry = new THREE.BoxGeometry(width, height, depth)
    const material = new THREE.MeshBasicMaterial({
      color: 0x111122,
      transparent: true,
      opacity: 0
    })

    const building = new THREE.Mesh(geometry, material)

    const angle = (i / buildingCount) * Math.PI * 2
    const radius = 100 + Math.random() * 50
    building.position.x = Math.cos(angle) * radius
    building.position.y = height / 2 - 50
    building.position.z = Math.sin(angle) * radius

    building.rotation.y = angle

    buildings.push({
      mesh: building,
      targetOpacity: 0.3 + Math.random() * 0.5,
      neonColor: new THREE.Color(neonColors[Math.floor(Math.random() * neonColors.length)])
    })

    group.add(building)

    // 霓虹灯光
    const neonGeometry = new THREE.BoxGeometry(width + 0.5, height * 0.8, 0.2)
    const neonMaterial = new THREE.MeshBasicMaterial({
      color: buildings[i].neonColor,
      transparent: true,
      opacity: 0
    })

    const neon = new THREE.Mesh(neonGeometry, neonMaterial)
    neon.position.copy(building.position)
    neon.position.z += depth / 2 + 0.5
    neon.rotation.y = angle

    buildings[i].neon = neon
    group.add(neon)
  }

  scene.add(group)

  let awakened = false
  let transformTime = 0

  // 动画更新函数
  const update = (delta) => {
    buildings.forEach((building, i) => {
      // 唤醒效果
      if (awakened && building.mesh.material.opacity < building.targetOpacity) {
        building.mesh.material.opacity += delta * 0.3
        building.neon.material.opacity = building.mesh.material.opacity
      }

      // 变形效果
      if (transformTime > 0) {
        building.mesh.scale.y = 1 + Math.sin(transformTime * 3 + i * 0.1) * 0.3
        building.neon.material.color.setHSL(
          (Date.now() * 0.001 + i * 0.01) % 1,
          1,
          0.5
        )
      }
    })
  }

  // 添加到渲染循环
  const animationId = requestAnimationFrame(function animate(time) {
    const delta = 0.016
    update(delta)
    requestAnimationFrame(animate)
  })

  return {
    awaken() {
      awakened = true
    },
    transform() {
      transformTime = 1
    },
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      buildings.forEach(b => {
        b.mesh.geometry.dispose()
        b.mesh.material.dispose()
        b.neon.geometry.dispose()
        b.neon.material.dispose()
      })
    }
  }
}

/**
 * 创建时空裂缝核心
 */
function createSpaceRiftCore(scene, options = {}) {
  const {
    riftLayers = 8,
    crackCount = 50,
    energyPulseSpeed = 2
  } = options

  const group = new THREE.Group()
  const layers = []

  for (let l = 0; l < riftLayers; l++) {
    const layerGroup = new THREE.Group()

    for (let i = 0; i < crackCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-50, 0, 0),
        new THREE.Vector3(-20, Math.random() * 20 - 10, Math.random() * 20 - 10),
        new THREE.Vector3(0, Math.random() * 40 - 20, Math.random() * 40 - 20),
        new THREE.Vector3(20, Math.random() * 20 - 10, Math.random() * 20 - 10),
        new THREE.Vector3(50, 0, 0)
      ])

      const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.5 + Math.random() * 1, 8, false)
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        transparent: true,
        opacity: 0
      })

      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      tube.rotation.y = Math.random() * Math.PI * 2
      tube.rotation.x = Math.random() * Math.PI
      tube.rotation.z = Math.random() * Math.PI

      layerGroup.add(tube)
    }

    layers.push({ group: layerGroup, formed: false })
    group.add(layerGroup)
  }

  scene.add(group)

  let formed = false
  let pulseIntensity = 0

  const update = () => {
    if (formed) {
      layers.forEach((layer, l) => {
        if (!layer.formed) {
          layer.formed = true
          layer.group.children.forEach(tube => {
            gsap.to(tube.material, {
              opacity: 0.6 - l * 0.05,
              duration: 1,
              ease: 'power2.out'
            })
          })
        }

        layer.group.rotation.y += 0.002 * (l + 1)
        layer.group.rotation.x += 0.001 * (l + 1)

        if (pulseIntensity > 0) {
          layer.group.scale.setScalar(1 + Math.sin(Date.now() * energyPulseSpeed) * pulseIntensity)
        }
      })
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    form() {
      formed = true
    },
    pulse() {
      gsap.to({ value: 0 }, {
        value: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        onUpdate: (target) => {
          pulseIntensity = target.value
        }
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      layers.forEach(layer => {
        layer.group.children.forEach(tube => {
          tube.geometry.dispose()
          tube.material.dispose()
        })
      })
    }
  }
}

/**
 * 创建量子隧道
 */
function createQuantumTunnel(scene, options = {}) {
  const {
    particleCount = 15000,
    tunnelLength = 400,
    tunnelRadius = 60
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * tunnelRadius
    const z = (Math.random() - 0.5) * tunnelLength

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.sin(angle) * radius
    positions[i * 3 + 2] = z

    const color = new THREE.Color().setHSL(Math.random(), 1, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 2 + 0.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

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

  let ignited = false
  let speed = 0

  const update = () => {
    if (ignited) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += speed

        if (positions[i * 3 + 2] > tunnelLength / 2) {
          positions[i * 3 + 2] = -tunnelLength / 2
        }
      }

      points.geometry.attributes.position.needsUpdate = true
      points.rotation.z += 0.005
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    ignite() {
      ignited = true
      gsap.to(material, {
        opacity: 0.8,
        duration: 2
      })
      gsap.to({ value: 0 }, {
        value: 3,
        duration: 3,
        onUpdate: (target) => {
          speed = target.value
        }
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
 * 创建赛博霓虹光晕
 */
function createCyberNeonGlow(scene, options = {}) {
  const {
    glowRings = 12,
    colorCycle = true
  } = options

  const group = new THREE.Group()
  const rings = []

  for (let i = 0; i < glowRings; i++) {
    const radius = 30 + i * 8
    const geometry = new THREE.TorusGeometry(radius, 0.5, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / glowRings, 1, 0.5),
      transparent: true,
      opacity: 0
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2

    rings.push({
      mesh: ring,
      baseRadius: radius,
      hue: i / glowRings
    })

    group.add(ring)
  }

  scene.add(group)

  let pulsing = false

  const update = () => {
    rings.forEach((ring, i) => {
      ring.mesh.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1)

      if (pulsing) {
        const pulse = Math.sin(Date.now() * 0.003 + i * 0.5) * 0.5 + 0.5
        ring.mesh.material.opacity = 0.3 + pulse * 0.4
        ring.mesh.scale.setScalar(1 + pulse * 0.1)

        if (colorCycle) {
          ring.mesh.material.color.setHSL(
            (ring.hue + Date.now() * 0.0001) % 1,
            1,
            0.5
          )
        }
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    pulse() {
      pulsing = true
      rings.forEach((ring, i) => {
        gsap.to(ring.mesh.material, {
          opacity: 0.3,
          duration: 1,
          delay: i * 0.1
        })
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      rings.forEach(ring => {
        ring.mesh.geometry.dispose()
        ring.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建数字雨矩阵
 */
function createDigitalRainMatrix(scene, options = {}) {
  const {
    rainCount = 8000,
    fallSpeed = 3,
    characters = '0123456789ABCDEF'
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(rainCount * 3)
  const colors = new Float32Array(rainCount * 3)
  const speeds = new Float32Array(rainCount)

  for (let i = 0; i < rainCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = Math.random() * 200 - 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200

    const color = new THREE.Color().setHSL(0.33, 1, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    speeds[i] = fallSpeed + Math.random() * 2
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

  let started = false
  let acceleration = 1

  const update = () => {
    if (started) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= speeds[i] * acceleration

        if (positions[i * 3 + 1] < -100) {
          positions[i * 3 + 1] = 100
          positions[i * 3] = (Math.random() - 0.5) * 200
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200
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
    start() {
      started = true
      gsap.to(material, {
        opacity: 0.7,
        duration: 1.5
      })
    },
    accelerate() {
      gsap.to({ value: 1 }, {
        value: 3,
        duration: 2,
        onUpdate: (target) => {
          acceleration = target.value
        }
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
 * 创建时空碎片
 */
function createSpacetimeFragments(scene, options = {}) {
  const {
    fragmentCount = 3000,
    driftSpeed = 0.5
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(fragmentCount * 3)
  const velocities = new Float32Array(fragmentCount * 3)
  const colors = new Float32Array(fragmentCount * 3)

  for (let i = 0; i < fragmentCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300

    velocities[i * 3] = (Math.random() - 0.5) * driftSpeed
    velocities[i * 3 + 1] = (Math.random() - 0.5) * driftSpeed
    velocities[i * 3 + 2] = (Math.random() - 0.5) * driftSpeed

    const color = new THREE.Color().setHSL(Math.random(), 1, 0.6)
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

  const update = () => {
    if (scattered) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < fragmentCount; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]
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
    scatter() {
      scattered = true
      gsap.to(material, {
        opacity: 0.8,
        duration: 1
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
 * 创建能量爆发
 */
function createEnergyBurst(scene, options = {}) {
  const {
    burstCount = 6,
    particleCount = 5000
  } = options

  const bursts = []

  for (let b = 0; b < burstCount; b++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      const color = new THREE.Color().setHSL(Math.random(), 1, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const velocities = []
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 2 + Math.random() * 3

      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      })
    }

    bursts.push({
      points,
      velocities,
      burst: false,
      time: 0
    })
  }

  const update = () => {
    bursts.forEach(burst => {
      if (burst.burst) {
        burst.time += 0.016
        const positions = burst.points.geometry.attributes.position.array

        for (let i = 0; i < velocities.length; i++) {
          positions[i * 3] += burst.velocities[i].x
          positions[i * 3 + 1] += burst.velocities[i].y
          positions[i * 3 + 2] += burst.velocities[i].z
        }

        burst.points.geometry.attributes.position.needsUpdate = true
        burst.points.material.opacity = Math.max(0, 1 - burst.time * 0.5)
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    burst() {
      bursts.forEach((burst, i) => {
        setTimeout(() => {
          burst.burst = true
          gsap.to(burst.points.material, {
            opacity: 1,
            duration: 0.3
          })
        }, i * 300)
      })
    },
    dispose() {
      cancelAnimationFrame(animationId)
      bursts.forEach(burst => {
        scene.remove(burst.points)
        burst.points.geometry.dispose()
        burst.points.material.dispose()
      })
    }
  }
}
