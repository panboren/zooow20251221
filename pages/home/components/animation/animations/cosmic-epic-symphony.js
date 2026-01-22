/**
 * 宇宙史诗交响曲特效 - 精简版
 * 融合宇宙演化、星系诞生、黑洞等宏大场景
 * 简约设计，去除重复镜头，聚焦核心视觉冲击
 * 技术亮点：
 * - 宇宙大爆炸瞬间
 * - 星系形成与演化
 * - 超大质量黑洞
 * - 50000+ 粒子系统
 * - 星尘流、能量涟漪、脉冲星束
 * - 流畅的视觉叙事
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateCosmicEpic(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 宇宙原点
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 0.001), 175, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-epic' })
      },
      onError,
      '宇宙史诗交响曲',
      controls
    )

    // 创世奇点
    const creationSingularity = createCreationSingularity(scene)

    // 宇宙爆炸粒子系统（30000粒子）
    const cosmicExplosion = createCosmicExplosion(scene, {
      particleCount: 30000
    })

    // 星系生成器（40个星系）
    const galaxyGenerator = createGalaxyGenerator(scene, {
      galaxyCount: 40
    })

    // 超大质量黑洞
    const supermassiveBlackHole = createSupermassiveBlackHole(scene)

    // 星尘流（15000粒子）
    const stellarDust = createStellarDust(scene, {
      particleCount: 15000
    })

    // 能量涟漪
    const energyRipples = createEnergyRipples(scene)

    // 脉冲星束（2000粒子）
    const pulsarBeams = createPulsarBeams(scene, {
      beamCount: 2000
    })

    // 阶段1: 创世 - 奇点形成与大爆炸
    tl.to(camera, {
      fov: 175,
      duration: 0.3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '创世错误'
      )
    })

    tl.call(() => {
      creationSingularity.form()
    }, null, 0.2)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 15,
      duration: 0.8,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '大爆炸错误'
      )
    }, 0.3)

    tl.call(() => {
      creationSingularity.explode()
      cosmicExplosion.ignite()
    }, null, 0.8)

    // 阶段2: 星系形成 - 恒星诞生（持续3.5秒）
    tl.to(camera.position, {
      x: 25,
      y: 20,
      z: 60,
      duration: 3.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '星系形成错误'
      )
    }, 1.1)

    tl.call(() => {
      galaxyGenerator.generate()
      stellarDust.flow()
    }, null, 2.5)

    // 阶段3: 黑洞时代 - 引力统治（持续3秒）
    tl.to(camera.position, {
      x: -20,
      y: 15,
      z: 45,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '黑洞时代错误'
      )
    }, 4.6)

    tl.call(() => {
      supermassiveBlackHole.form()
      energyRipples.expand()
      pulsarBeams.pulse()
    }, null, 6)

    // 阶段4: 宇宙终极 - 所有元素融合（持续2.5秒）
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 35,
      duration: 2.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '宇宙终极错误'
      )
    }, 7.6)

    tl.call(() => {
      supermassiveBlackHole.evaporate()
      galaxyGenerator.unify()
    }, null, 9)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 9.5)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      creationSingularity.update(time)
      cosmicExplosion.update(time)
      galaxyGenerator.update(time)
      supermassiveBlackHole.update(time)
      stellarDust.update(time)
      energyRipples.update(time)
      pulsarBeams.update(time)
    }

    // 清理函数
    const cleanup = () => {
      creationSingularity.destroy()
      cosmicExplosion.destroy()
      galaxyGenerator.destroy()
      supermassiveBlackHole.destroy()
      stellarDust.destroy()
      energyRipples.destroy()
      pulsarBeams.destroy()
    }

    tl.call(cleanup, null, 11)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建创世奇点
 */
function createCreationSingularity(scene) {
  // 核心奇点
  const coreGeometry = new THREE.SphereGeometry(0.5, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  scene.add(core)

  // 能量场
  const fieldGeometry = new THREE.SphereGeometry(2, 64, 64)
  const fieldMaterial = new THREE.MeshBasicMaterial({
    color: 0xff64ff,
    transparent: true,
    opacity: 0
  })
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial)
  scene.add(field)

  // 外层光环
  const ringGeometry = new THREE.TorusGeometry(3, 0.3, 16, 100)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x96ffff,
    transparent: true,
    opacity: 0
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2
  scene.add(ring)

  const singularity = {
    core,
    field,
    ring,

    form() {
      gsap.to(core.material, { opacity: 1, duration: 0.5 })
      gsap.to(field.material, { opacity: 0.8, duration: 0.8 })
      gsap.to(ring.material, { opacity: 0.6, duration: 1 })
      
      // 脉动效果
      gsap.to(core.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.2,
        yoyo: true,
        repeat: 3
      })
    },

    explode() {
      // 爆炸瞬间
      gsap.to(core.scale, {
        x: 5,
        y: 5,
        z: 5,
        duration: 0.3,
        ease: 'power4.out'
      })
      gsap.to(field.scale, {
        x: 8,
        y: 8,
        z: 8,
        duration: 0.4,
        ease: 'power4.out'
      })
      gsap.to(ring.scale, {
        x: 10,
        y: 10,
        z: 10,
        duration: 0.5,
        ease: 'power4.out'
      })
      
      // 随后消失
      gsap.to(core.material, { opacity: 0, duration: 0.5, delay: 0.3 })
      gsap.to(field.material, { opacity: 0, duration: 0.5, delay: 0.4 })
      gsap.to(ring.material, { opacity: 0, duration: 0.5, delay: 0.5 })
    },

    update(time) {
      ring.rotation.z += 0.05
      field.rotation.x += 0.02
      field.rotation.y += 0.03
    },

    destroy() {
      scene.remove(core)
      scene.remove(field)
      scene.remove(ring)
      core.geometry.dispose()
      core.material.dispose()
      field.geometry.dispose()
      field.material.dispose()
      ring.geometry.dispose()
      ring.material.dispose()
    }
  }

  return singularity
}

/**
 * 创建宇宙爆炸粒子系统
 */
function createCosmicExplosion(scene, options) {
  const { particleCount = 20000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  const colorPalette = [
    new THREE.Color(0xff6464),
    new THREE.Color(0xffff64),
    new THREE.Color(0x64ff64),
    new THREE.Color(0x6464ff),
    new THREE.Color(0xff64ff),
    new THREE.Color(0xffffff)
  ]

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const explosion = {
    points,
    material,
    geometry,
    ignited: false,

    ignite() {
      gsap.to(material, { opacity: 1, duration: 0.5 })
      this.ignited = true
      
      const targetPositions = new Float32Array(particleCount * 3)
      const velocities = new Float32Array(particleCount * 3)
      
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const speed = 30 + Math.random() * 150
        
        targetPositions[i * 3] = speed * Math.sin(phi) * Math.cos(theta)
        targetPositions[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta)
        targetPositions[i * 3 + 2] = speed * Math.cos(phi)
        
        velocities[i * 3] = targetPositions[i * 3] * 0.1
        velocities[i * 3 + 1] = targetPositions[i * 3 + 1] * 0.1
        velocities[i * 3 + 2] = targetPositions[i * 3 + 2] * 0.1
      }

      this.targetPositions = targetPositions
      this.velocities = velocities
      this.startTime = Date.now()
      this.duration = 3
    },

    update(time) {
      if (this.ignited && this.startTime) {
        const elapsed = (Date.now() - this.startTime) / 1000
        const progress = Math.min(elapsed / this.duration, 1)
        const ease = 1 - Math.pow(1 - progress, 2)

        const pos = geometry.attributes.position.array
        for (let i = 0; i < this.particleCount; i++) {
          const idx = i * 3
          pos[idx] = this.velocities[idx] * elapsed * 20 * ease
          pos[idx + 1] = this.velocities[idx + 1] * elapsed * 20 * ease
          pos[idx + 2] = this.velocities[idx + 2] * elapsed * 20 * ease
        }
        geometry.attributes.position.needsUpdate = true
      }
      
      points.rotation.y += 0.0003
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  explosion.particleCount = particleCount
  return explosion
}

/**
 * 创建星系生成器
 */
function createGalaxyGenerator(scene, options) {
  const { galaxyCount = 30 } = options
  const galaxies = []

  for (let g = 0; g < galaxyCount; g++) {
    const galaxy = new THREE.Group()
    
    const armCount = 2 + Math.floor(Math.random() * 3)
    const starCount = 800 + Math.floor(Math.random() * 1200)
    const radius = 8 + Math.random() * 12
    const tiltX = (Math.random() - 0.5) * Math.PI
    const tiltY = (Math.random() - 0.5) * Math.PI
    
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    
    const coreColor = new THREE.Color().setHSL(0.08 + Math.random() * 0.08, 0.9, 0.8)
    const armColor = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.7)
    
    for (let i = 0; i < starCount; i++) {
      const armIndex = i % armCount
      const armProgress = i / starCount
      const radiusAtArm = armProgress * radius
      const armAngle = (armIndex / armCount) * Math.PI * 2 + armProgress * Math.PI * 4
      
      const spiralTightness = 2.5 + Math.random() * 1.5
      const spread = Math.random() * radius * 0.25
      
      const x = Math.cos(armAngle) * radiusAtArm + (Math.random() - 0.5) * spread
      const y = (Math.random() - 0.5) * spread * 0.3
      const z = Math.sin(armAngle) * radiusAtArm + (Math.random() - 0.5) * spread
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      const color = Math.random() < 0.35 ? coreColor : armColor
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
    
    const points = new THREE.Points(geometry, material)
    
    // 星系核
    const coreGeometry = new THREE.SphereGeometry(radius * 0.08, 16, 16)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: 0
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    
    galaxy.add(points)
    galaxy.add(core)
    galaxy.rotation.x = tiltX
    galaxy.rotation.y = tiltY
    galaxy.position.set(
      (Math.random() - 0.5) * 250,
      (Math.random() - 0.5) * 250,
      (Math.random() - 0.5) * 250
    )
    
    galaxies.push({
      group: galaxy,
      points,
      core,
      rotationSpeed: (Math.random() - 0.5) * 0.002
    })
    
    scene.add(galaxy)
  }

  const generator = {
    galaxies,

    generate() {
      galaxies.forEach((galaxy, i) => {
        gsap.to(galaxy.points.material, {
          opacity: 0.9,
          duration: 1,
          delay: i * 0.03
        })
        gsap.to(galaxy.core.material, {
          opacity: 1,
          duration: 1,
          delay: i * 0.03
        })
        gsap.to(galaxy.group.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          delay: i * 0.03,
          ease: 'back.out',
          onStart: () => {
            galaxy.group.scale.set(0, 0, 0)
          }
        })
      })
    },

    unify() {
      // 星系向中心汇聚
      galaxies.forEach(galaxy => {
        gsap.to(galaxy.group.position, {
          x: galaxy.group.position.x * 0.3,
          y: galaxy.group.position.y * 0.3,
          z: galaxy.group.position.z * 0.3,
          duration: 2,
          ease: 'power2.inOut'
        })
        gsap.to(galaxy.points.material, {
          opacity: 0.6,
          duration: 2
        })
      })
    },

    update(time) {
      galaxies.forEach(galaxy => {
        galaxy.group.rotation.y += galaxy.rotationSpeed
      })
    },

    destroy() {
      galaxies.forEach(galaxy => {
        scene.remove(galaxy.group)
        galaxy.points.geometry.dispose()
        galaxy.points.material.dispose()
        galaxy.core.geometry.dispose()
        galaxy.core.material.dispose()
      })
    }
  }

  return generator
}

/**
 * 创建超大质量黑洞
 */
function createSupermassiveBlackHole(scene) {
  const blackHoleGroup = new THREE.Group()
  blackHoleGroup.position.set(0, 0, 0)

  // 事件视界
  const horizonGeometry = new THREE.SphereGeometry(12, 64, 64)
  const horizonMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0
  })
  const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial)
  blackHoleGroup.add(horizon)

  // 吸积盘
  const diskGeometry = new THREE.RingGeometry(15, 35, 64, 12)
  const diskMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa55,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  const disk = new THREE.Mesh(diskGeometry, diskMaterial)
  disk.rotation.x = Math.PI / 2
  blackHoleGroup.add(disk)

  // 引力透镜环（3层）
  const lensRings = []
  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(
      20 + i * 12,
      0.6,
      16,
      100
    )
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.08 + i * 0.02, 0.95, 0.65),
      transparent: true,
      opacity: 0
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    ring.userData = { rotationSpeed: 0.015 + i * 0.008 }
    lensRings.push(ring)
    blackHoleGroup.add(ring)
  }

  // 霍金辐射粒子
  const radiationGeometry = new THREE.BufferGeometry()
  const radiationPositions = new Float32Array(800 * 3)
  const radiationColors = new Float32Array(800 * 3)

  for (let i = 0; i < 800; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 12 + Math.random() * 6
    radiationPositions[i * 3] = Math.cos(angle) * radius
    radiationPositions[i * 3 + 1] = (Math.random() - 0.5) * 3
    radiationPositions[i * 3 + 2] = Math.sin(angle) * radius
    
    const color = new THREE.Color().setHSL(Math.random() * 0.15 + 0.05, 1, 0.75)
    radiationColors[i * 3] = color.r
    radiationColors[i * 3 + 1] = color.g
    radiationColors[i * 3 + 2] = color.b
  }

  radiationGeometry.setAttribute('position', new THREE.BufferAttribute(radiationPositions, 3))
  radiationGeometry.setAttribute('color', new THREE.BufferAttribute(radiationColors, 3))

  const radiationMaterial = new THREE.PointsMaterial({
    size: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const radiationPoints = new THREE.Points(radiationGeometry, radiationMaterial)
  blackHoleGroup.add(radiationPoints)

  scene.add(blackHoleGroup)

  const blackHole = {
    group: blackHoleGroup,
    horizon,
    disk,
    lensRings,
    radiationPoints,
    evaporating: false,

    form() {
      gsap.to(horizon.material, { opacity: 1, duration: 1.2 })
      gsap.to(disk.material, { opacity: 0.85, duration: 1.5, delay: 0.5 })
      lensRings.forEach((ring, i) => {
        gsap.to(ring.material, {
          opacity: 0.6,
          duration: 1,
          delay: 1 + i * 0.15
        })
      })
    },

    evaporate() {
      this.evaporating = true
      gsap.to(horizon.scale, {
        x: 0.4,
        y: 0.4,
        z: 0.4,
        duration: 2.5,
        ease: 'power2.in'
      })
      gsap.to(horizon.material, { opacity: 0.4, duration: 2 })
      gsap.to(radiationMaterial, { opacity: 1, duration: 1 })
      gsap.to(disk.material, { opacity: 0.3, duration: 2 })
      
      lensRings.forEach(ring => {
        gsap.to(ring.material, { opacity: 0, duration: 2 })
      })
    },

    update(time) {
      disk.rotation.z -= 0.025
      lensRings.forEach(ring => {
        ring.rotation.z -= ring.userData.rotationSpeed
      })
      
      if (this.evaporating) {
        const positions = radiationGeometry.attributes.position.array
        for (let i = 0; i < 800; i++) {
          positions[i * 3] *= 1.015
          positions[i * 3 + 2] *= 1.015
        }
        radiationGeometry.attributes.position.needsUpdate = true
      } else {
        const positions = radiationGeometry.attributes.position.array
        for (let i = 0; i < 800; i++) {
          const angle = time + i * 0.08
          const radius = 15 + Math.sin(time * 4 + i) * 4
          positions[i * 3] = Math.cos(angle) * radius
          positions[i * 3 + 2] = Math.sin(angle) * radius
        }
        radiationGeometry.attributes.position.needsUpdate = true
      }
    },

    destroy() {
      scene.remove(blackHoleGroup)
      horizon.geometry.dispose()
      horizon.material.dispose()
      disk.geometry.dispose()
      disk.material.dispose()
      lensRings.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })
      radiationGeometry.dispose()
      radiationMaterial.dispose()
    }
  }

  return blackHole
}

/**
 * 创建星尘流粒子系统
 */
function createStellarDust(scene, options) {
  const { particleCount = 15000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  const colorPalette = [
    new THREE.Color(0x88ccff),
    new THREE.Color(0xff88cc),
    new THREE.Color(0xccff88),
    new THREE.Color(0x88ffff),
    new THREE.Color(0xffff88),
    new THREE.Color(0xffaaff)
  ]

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 50 + Math.random() * 200

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.3 + Math.random() * 0.8
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const stellarDust = {
    points,
    material,
    geometry,
    flowing: false,
    originalPositions: positions.slice(),
    velocities: new Float32Array(particleCount * 3),

    flow() {
      gsap.to(material, { opacity: 0.7, duration: 1.5 })
      this.flowing = true

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        const speed = 0.5 + Math.random() * 1.5
        const angle = Math.random() * Math.PI * 2
        this.velocities[idx] = Math.cos(angle) * speed
        this.velocities[idx + 1] = Math.sin(angle) * speed
        this.velocities[idx + 2] = (Math.random() - 0.5) * speed
      }
    },

    update(time) {
      if (this.flowing) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          pos[idx] += this.velocities[idx] * 0.02
          pos[idx + 1] += this.velocities[idx + 1] * 0.02
          pos[idx + 2] += this.velocities[idx + 2] * 0.02

          // 闪烁效果
          if (Math.random() < 0.001) {
            sizes[i] = 1.2 + Math.random() * 0.8
          } else if (sizes[i] > 0.3) {
            sizes[i] *= 0.99
          }
        }
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.size.needsUpdate = true
      }

      points.rotation.y += 0.0002
      points.rotation.x += 0.00005
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return stellarDust
}

/**
 * 创建能量涟漪
 */
function createEnergyRipples(scene) {
  const rippleCount = 5
  const ripples = []

  for (let i = 0; i < rippleCount; i++) {
    const geometry = new THREE.RingGeometry(
      8 + i * 5,
      10 + i * 5,
      128
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.5 + i * 0.1, 0.9, 0.7),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    ripple.userData = {
      maxScale: 3 + i * 0.5,
      expansionSpeed: 0.8 + i * 0.15
    }

    ripples.push(ripple)
    scene.add(ripple)
  }

  const energyRipples = {
    ripples,
    expanding: false,

    expand() {
      this.expanding = true
      ripples.forEach((ripple, i) => {
        gsap.to(ripple.material, {
          opacity: 0.8,
          duration: 0.8,
          delay: i * 0.2
        })
      })
    },

    update(time) {
      if (this.expanding) {
        ripples.forEach(ripple => {
          const currentScale = ripple.scale.x
          if (currentScale < ripple.userData.maxScale) {
            const scale = currentScale + 0.003
            ripple.scale.set(scale, scale, scale)

            const opacity = 0.8 * (1 - scale / ripple.userData.maxScale)
            ripple.material.opacity = opacity
          } else {
            // 重置涟漪
            ripple.scale.set(0.5, 0.5, 0.5)
          }
        })
      }

      ripples.forEach((ripple, i) => {
        ripple.rotation.z += 0.001 * (i + 1)
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

  return energyRipples
}

/**
 * 创建脉冲星束
 */
function createPulsarBeams(scene, options) {
  const { beamCount = 2000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(beamCount * 3)
  const colors = new Float32Array(beamCount * 3)
  const velocities = new Float32Array(beamCount * 3)

  for (let i = 0; i < beamCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const radius = 0.5 + Math.random() * 2

    positions[i * 3] = Math.cos(theta) * radius
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3
    positions[i * 3 + 2] = Math.sin(theta) * radius

    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 1, 0.8)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    const speed = 30 + Math.random() * 70
    velocities[i * 3] = Math.cos(theta) * speed
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 5
    velocities[i * 3 + 2] = Math.sin(theta) * speed
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

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

  const pulsar = {
    points,
    material,
    geometry,
    pulsing: false,
    startTime: 0,
    beamDuration: 4,

    pulse() {
      gsap.to(material, { opacity: 1, duration: 0.3 })
      this.pulsing = true
      this.startTime = Date.now()
    },

    update(time) {
      if (this.pulsing) {
        const elapsed = (Date.now() - this.startTime) / 1000
        const progress = elapsed / this.beamDuration

        if (progress < 1) {
          const pos = geometry.attributes.position.array
          for (let i = 0; i < beamCount; i++) {
            const idx = i * 3
            pos[idx] += velocities[idx] * 0.008
            pos[idx + 1] += velocities[idx + 1] * 0.008
            pos[idx + 2] += velocities[idx + 2] * 0.008
          }
          geometry.attributes.position.needsUpdate = true

          // 闪烁效果
          const flicker = 0.7 + Math.sin(time * 15) * 0.3
          material.opacity = flicker * (1 - progress * 0.5)
        } else {
          // 重置脉冲
          const pos = geometry.attributes.position.array
          for (let i = 0; i < beamCount; i++) {
            const theta = Math.random() * Math.PI * 2
            const radius = 0.5 + Math.random() * 2
            pos[i * 3] = Math.cos(theta) * radius
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
            pos[i * 3 + 2] = Math.sin(theta) * radius
          }
          geometry.attributes.position.needsUpdate = true

          this.startTime = Date.now()
        }
      }

      points.rotation.y += 0.02
      points.rotation.x += 0.005
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return pulsar
}
