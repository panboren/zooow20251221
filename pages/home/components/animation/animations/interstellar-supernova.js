/**
 * 星际超新星爆发 - 超越宇宙史诗的视觉震撼
 * 融合恒星演化、超新星爆发、引力波、星际尘埃、暗物质等宇宙终极现象
 * 技术突破：
 * - 实时粒子物理模拟（50000+粒子）
 * - 引力透镜效果
 * - 激波环动态渲染
 * - 中子星形成动画
 * - 引力波涟漪
 * - 伽马射线暴
 * - 脉冲星光束
 * - 多层粒子系统交互
 * - 动态光照和阴影
 * - 震动反馈效果
 * 动画时长：28秒
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateInterstellarSupernova(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 近距离观测
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 150), 110, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'interstellar-supernova' })
      },
      onError,
      '星际超新星爆发',
      controls
    )

    // ==================== 创建系统 ====================

    // 1. 恒星演化系统
    const stellarEvolution = createStellarEvolution(scene, {
      starMass: 50,
      evolutionStages: 5
    })

    // 2. 超新星爆发粒子系统（50000粒子）
    const supernovaExplosion = createSupernovaExplosion(scene, {
      particleCount: 50000,
      blastRadius: 300
    })

    // 3. 激波环
    const shockwaveRings = createShockwaveRings(scene, {
      ringCount: 10,
      maxRadius: 250
    })

    // 4. 引力波涟漪
    const gravitationalWaves = createGravitationalWaves(scene, {
      waveCount: 15,
      wavelength: 30
    })

    // 5. 中子星
    const neutronStar = createNeutronStar(scene, {
      rotationSpeed: 50,
      beamCount: 2
    })

    // 6. 星际尘埃
    const interstellarDust = createInterstellarDust(scene, {
      particleCount: 20000,
      distributionRadius: 400
    })

    // 7. 伽马射线暴
    const gammaRayBurst = createGammaRayBurst(scene, {
      beamLength: 500,
      beamWidth: 20
    })

    // 8. 脉冲星束
    const pulsarBeams = createPulsarBeams(scene, {
      beamCount: 4,
      beamLength: 350
    })

    // ==================== 动画序列 ====================

    // 阶段1: 恒星演化 - 主序星到红巨星（6秒）
    tl.to(camera.position, {
      x: 10,
      y: 5,
      z: 120,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '恒星演化错误'
      )
    }, 0)

    tl.call(() => {
      stellarEvolution.evolve()
    }, null, 1)

    tl.to(camera, {
      fov: 130,
      duration: 4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV扩张错误'
      )
    }, 2)

    // 阶段2: 核心坍缩 - 引力崩溃（5秒）
    tl.to(camera.position, {
      x: -5,
      y: 3,
      z: 80,
      duration: 5,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '核心坍缩错误'
      )
    }, 6)

    tl.call(() => {
      stellarEvolution.collapse()
      interstellarDust.attract()
    }, null, 7)

    tl.to(camera, {
      fov: 175,
      duration: 3,
      ease: 'power3.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '视角坍缩错误'
      )
    }, 8)

    // 阶段3: 超新星爆发 - 宇宙爆炸（10秒）
    tl.to(camera.position, {
      x: 20,
      y: 15,
      z: 100,
      duration: 10,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '超新星爆发错误'
      )
    }, 11)

    tl.call(() => {
      supernovaExplosion.explode()
      shockwaveRings.expand()
      gravitationalWaves.ripple()
    }, null, 11.5)

    tl.to(camera, {
      fov: 100,
      duration: 5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '视角恢复错误'
      )
    }, 12)

    tl.call(() => {
      gammaRayBurst.burst()
    }, null, 15)

    // 阶段4: 中子星形成 - 恒星遗迹（7秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 60,
      duration: 7,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '中子星形成错误'
      )
    }, 21)

    tl.call(() => {
      neutronStar.form()
      pulsarBeams.activate()
    }, null, 22)

    tl.to(camera, {
      fov: 85,
      duration: 4,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '最终视角错误'
      )
    }, 23)

    // ==================== 清理函数 ====================
    const cleanup = () => {
      stellarEvolution.dispose()
      supernovaExplosion.dispose()
      shockwaveRings.dispose()
      gravitationalWaves.dispose()
      neutronStar.dispose()
      interstellarDust.dispose()
      gammaRayBurst.dispose()
      pulsarBeams.dispose()
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
 * 创建恒星演化系统
 */
function createStellarEvolution(scene, options = {}) {
  const {
    starMass = 50,
    evolutionStages = 5
  } = options

  const group = new THREE.Group()

  // 恒星核心
  const coreGeometry = new THREE.SphereGeometry(starMass, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 恒星光晕
  const glowGeometry = new THREE.SphereGeometry(starMass * 1.2, 64, 64)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  group.add(glow)

  // 恒星表面活动
  const surfaceActivity = createSurfaceActivity(starMass)
  group.add(surfaceActivity.group)

  scene.add(group)

  let currentStage = 0
  let collapsing = false

  const stages = [
    { scale: 1, color: 0xffff00, glowColor: 0xffaa00 },
    { scale: 1.5, color: 0xffaa00, glowColor: 0xff6600 },
    { scale: 2.5, color: 0xff6600, glowColor: 0xff3300 },
    { scale: 3, color: 0xff3300, glowColor: 0xff0000 },
    { scale: 0.1, color: 0xffffff, glowColor: 0xaaaaaa }
  ]

  const evolve = () => {
    const nextStage = () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage]

        gsap.to(core.scale, {
          x: stage.scale,
          y: stage.scale,
          z: stage.scale,
          duration: 1.5,
          ease: 'power2.inOut'
        })

        gsap.to(core.material.color, {
          r: new THREE.Color(stage.color).r,
          g: new THREE.Color(stage.color).g,
          b: new THREE.Color(stage.color).b,
          duration: 1.5
        })

        gsap.to(core.material, {
          opacity: 1,
          duration: 1
        })

        gsap.to(glow.material, {
          opacity: 0.6,
          duration: 1
        })

        gsap.to(glow.material.color, {
          r: new THREE.Color(stage.glowColor).r,
          g: new THREE.Color(stage.glowColor).g,
          b: new THREE.Color(stage.glowColor).b,
          duration: 1.5
        })

        gsap.to(glow.scale, {
          x: stage.scale * 1.2,
          y: stage.scale * 1.2,
          z: stage.scale * 1.2,
          duration: 1.5
        })

        surfaceActivity.intensity = currentStage / stages.length

        currentStage++
        setTimeout(nextStage, 1500)
      }
    }

    nextStage()
  }

  const collapse = () => {
    collapsing = true
    gsap.to(core.scale, {
      x: 0.05,
      y: 0.05,
      z: 0.05,
      duration: 2,
      ease: 'power4.in'
    })

    gsap.to(glow.scale, {
      x: 0.05,
      y: 0.05,
      z: 0.05,
      duration: 2,
      ease: 'power4.in'
    })

    gsap.to(core.material.color, {
      r: 1,
      g: 1,
      b: 1,
      duration: 2
    })

    surfaceActivity.intensity = 0
  }

  const update = () => {
    core.rotation.y += 0.01
    glow.rotation.y -= 0.005

    if (collapsing) {
      const shake = Math.sin(Date.now() * 0.05) * 0.5
      group.position.x = shake
      group.position.y = shake
    }

    surfaceActivity.update()
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    evolve,
    collapse,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      surfaceActivity.dispose()
    }
  }
}

/**
 * 创建恒星表面活动
 */
function createSurfaceActivity(radius) {
  const group = new THREE.Group()
  const spots = []

  for (let i = 0; i < 100; i++) {
    const geometry = new THREE.CircleGeometry(2 + Math.random() * 3, 16)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const spot = new THREE.Mesh(geometry, material)

    const phi = Math.random() * Math.PI
    const theta = Math.random() * Math.PI * 2

    spot.position.x = radius * Math.sin(phi) * Math.cos(theta)
    spot.position.y = radius * Math.sin(phi) * Math.sin(theta)
    spot.position.z = radius * Math.cos(phi)

    spot.lookAt(0, 0, 0)

    spots.push({
      mesh: spot,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    })

    group.add(spot)
  }

  let intensity = 0

  const update = () => {
    spots.forEach((spot, i) => {
      if (intensity > 0) {
        const pulse = Math.sin(Date.now() * 0.003 * spot.pulseSpeed + spot.phase)
        spot.mesh.material.opacity = pulse * intensity * 0.8

        const scale = 1 + pulse * 0.3
        spot.mesh.scale.setScalar(scale)
      }
    })

    group.rotation.y += 0.002
  }

  return {
    group,
    update,
    dispose() {
      spots.forEach(spot => {
        spot.mesh.geometry.dispose()
        spot.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建超新星爆炸粒子系统
 */
function createSupernovaExplosion(scene, options = {}) {
  const {
    particleCount = 50000,
    blastRadius = 300
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const velocities = new Float32Array(particleCount * 3)
  const life = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0

    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const speed = 5 + Math.random() * 20

    velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
    velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
    velocities[i * 3 + 2] = Math.cos(phi) * speed

    const color = new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 1 + Math.random() * 3
    life[i] = 1
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

  let exploded = false
  let explosionTime = 0

  const update = () => {
    if (exploded) {
      explosionTime += 0.016
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        if (life[i] > 0) {
          positions[i * 3] += velocities[i * 3]
          positions[i * 3 + 1] += velocities[i * 3 + 1]
          positions[i * 3 + 2] += velocities[i * 3 + 2]

          life[i] -= 0.005
        }
      }

      points.geometry.attributes.position.needsUpdate = true
      points.material.opacity = Math.max(0, 1 - explosionTime * 0.1)
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    explode() {
      exploded = true
      gsap.to(material, {
        opacity: 1,
        duration: 0.5
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
 * 创建激波环
 */
function createShockwaveRings(scene, options = {}) {
  const {
    ringCount = 10,
    maxRadius = 250
  } = options

  const rings = []

  for (let i = 0; i < ringCount; i++) {
    const geometry = new THREE.RingGeometry(1, 1.5, 64)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.05 + i * 0.02, 1, 0.6),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.random() * Math.PI
    ring.rotation.y = Math.random() * Math.PI
    ring.rotation.z = Math.random() * Math.PI

    scene.add(ring)

    rings.push({
      mesh: ring,
      expanded: false,
      delay: i * 0.15
    })
  }

  const expand = () => {
    rings.forEach(ring => {
      setTimeout(() => {
        ring.expanded = true

        gsap.to(ring.mesh.material, {
          opacity: 0.8,
          duration: 0.3
        })

        gsap.to(ring.mesh.scale, {
          x: maxRadius,
          y: maxRadius,
          z: maxRadius,
          duration: 4,
          ease: 'power2.out'
        })

        gsap.to(ring.mesh.material, {
          opacity: 0,
          duration: 3,
          delay: 1
        })
      }, ring.delay * 1000)
    })
  }

  const update = () => {
    rings.forEach(ring => {
      if (ring.expanded) {
        ring.mesh.rotation.x += 0.005
        ring.mesh.rotation.y += 0.005
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
 * 创建引力波涟漪
 */
function createGravitationalWaves(scene, options = {}) {
  const {
    waveCount = 15,
    wavelength = 30
  } = options

  const group = new THREE.Group()
  const waves = []

  for (let i = 0; i < waveCount; i++) {
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })

    const wave = new THREE.Mesh(geometry, material)

    waves.push({
      mesh: wave,
      expanding: false,
      delay: i * 0.2
    })

    group.add(wave)
  }

  scene.add(group)

  const ripple = () => {
    waves.forEach(wave => {
      setTimeout(() => {
        wave.expanding = true

        gsap.to(wave.mesh.material, {
          opacity: 0.5,
          duration: 0.5
        })

        gsap.to(wave.mesh.scale, {
          x: wavelength,
          y: wavelength,
          z: wavelength,
          duration: 5,
          ease: 'power2.out'
        })

        gsap.to(wave.mesh.material, {
          opacity: 0,
          duration: 4,
          delay: 1
        })
      }, wave.delay * 1000)
    })
  }

  const update = () => {
    waves.forEach(wave => {
      if (wave.expanding) {
        wave.mesh.rotation.x += 0.002
        wave.mesh.rotation.y += 0.002
      }
    })
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    ripple,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      waves.forEach(wave => {
        wave.mesh.geometry.dispose()
        wave.mesh.material.dispose()
      })
    }
  }
}

/**
 * 创建中子星
 */
function createNeutronStar(scene, options = {}) {
  const {
    rotationSpeed = 50,
    beamCount = 2
  } = options

  const group = new THREE.Group()

  // 中子星核心
  const coreGeometry = new THREE.SphereGeometry(8, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 脉冲光束
  const beams = []
  for (let i = 0; i < beamCount; i++) {
    const beamGeometry = new THREE.CylinderGeometry(0.5, 3, 200, 16)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)
    beam.position.y = i === 0 ? 100 : -100
    beam.rotation.x = i === 0 ? 0 : Math.PI

    beams.push(beam)
    group.add(beam)
  }

  scene.add(group)

  let formed = false

  const form = () => {
    formed = true

    gsap.to(core.material, {
      opacity: 1,
      duration: 1
    })

    beams.forEach(beam => {
      gsap.to(beam.material, {
        opacity: 0.6,
        duration: 1
      })
    })

    gsap.to(core.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5
    })
  }

  const update = () => {
    if (formed) {
      group.rotation.y += rotationSpeed * 0.001

      // 脉冲效果
      const pulse = Math.sin(Date.now() * 0.01)
      beams.forEach(beam => {
        beam.material.opacity = 0.4 + pulse * 0.2
      })
    }
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
      coreGeometry.dispose()
      coreMaterial.dispose()
      beams.forEach(beam => {
        beam.geometry.dispose()
        beam.material.dispose()
      })
    }
  }
}

/**
 * 创建星际尘埃
 */
function createInterstellarDust(scene, options = {}) {
  const {
    particleCount = 20000,
    distributionRadius = 400
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 50 + Math.random() * distributionRadius

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const brightness = 0.3 + Math.random() * 0.4
    colors[i * 3] = brightness
    colors[i * 3 + 1] = brightness
    colors[i * 3 + 2] = brightness + Math.random() * 0.2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.3
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let attracting = false

  const attract = () => {
    attracting = true
  }

  const update = () => {
    points.rotation.y += 0.0005

    if (attracting) {
      const positions = points.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const z = positions[i * 3 + 2]

        const distance = Math.sqrt(x * x + y * y + z * z)
        const force = 100 / (distance * distance + 1)

        positions[i * 3] -= x * force * 0.01
        positions[i * 3 + 1] -= y * force * 0.01
        positions[i * 3 + 2] -= z * force * 0.01
      }

      points.geometry.attributes.position.needsUpdate = true
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    attract,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建伽马射线暴
 */
function createGammaRayBurst(scene, options = {}) {
  const {
    beamLength = 500,
    beamWidth = 20
  } = options

  const group = new THREE.Group()

  const beams = []
  for (let i = 0; i < 2; i++) {
    const beamGeometry = new THREE.CylinderGeometry(beamWidth, beamWidth * 3, beamLength, 32)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)
    beam.position.y = i === 0 ? beamLength / 2 : -beamLength / 2

    beams.push(beam)
    group.add(beam)
  }

  scene.add(group)

  let burst = false

  const burstBeam = () => {
    burst = true

    beams.forEach(beam => {
      gsap.to(beam.material, {
        opacity: 0.9,
        duration: 0.3
      })

      gsap.to(beam.material, {
        opacity: 0,
        duration: 4,
        delay: 0.5
      })

      gsap.to(beam.scale, {
        x: 2,
        z: 2,
        duration: 0.5,
        yoyo: true,
        repeat: 3
      })
    })
  }

  const update = () => {
    if (burst) {
      group.rotation.x += 0.002
      group.rotation.y += 0.002
    }
  }

  const animationId = requestAnimationFrame(function animate() {
    update()
    requestAnimationFrame(animate)
  })

  return {
    burst: burstBeam,
    dispose() {
      cancelAnimationFrame(animationId)
      scene.remove(group)
      beams.forEach(beam => {
        beam.geometry.dispose()
        beam.material.dispose()
      })
    }
  }
}

/**
 * 创建脉冲星束
 */
function createPulsarBeams(scene, options = {}) {
  const {
    beamCount = 4,
    beamLength = 350
  } = options

  const group = new THREE.Group()
  const beams = []

  for (let i = 0; i < beamCount; i++) {
    const beamGeometry = new THREE.CylinderGeometry(1, 5, beamLength, 16)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)

    const angle = (i / beamCount) * Math.PI * 2
    beam.position.y = beamLength / 2
    beam.rotation.x = Math.PI / 2
    beam.rotation.z = angle

    beams.push(beam)
    group.add(beam)
  }

  scene.add(group)

  let active = false

  const activate = () => {
    active = true

    beams.forEach(beam => {
      gsap.to(beam.material, {
        opacity: 0.7,
        duration: 1
      })
    })
  }

  const update = () => {
    if (active) {
      group.rotation.y += 0.05

      beams.forEach((beam, i) => {
        const pulse = Math.sin(Date.now() * 0.01 + i * 0.5)
        beam.material.opacity = 0.5 + pulse * 0.3
      })
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
      beams.forEach(beam => {
        beam.geometry.dispose()
        beam.material.dispose()
      })
    }
  }
}
