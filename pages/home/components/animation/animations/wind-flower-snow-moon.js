/**
 * 风花雪月 - 诗意自然特效（唯美增强版）
 * 融合风、花、雪、月四大自然元素的唯美诗意视觉效果
 * 技术亮点：
 * - 风之絮语：流动的风粒子
 * - 花之绽放：绽放的花瓣雨
 * - 雪之飘零：飘落的雪花
 * - 月之盈亏：月亮的变化
 * - 樱花飘舞：樱花飞舞特效
 * - 星空闪烁：璀璨星空
 * - 梦幻光晕：柔和光晕效果
 * - 羽毛飘落：轻盈羽毛
 * - 彩虹涟漪：七彩涟漪
 * - 100000+ 自然粒子
 * - 极度唯美的视觉叙事
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateWindFlowerSnowMoon(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 远景俯视
    setupInitialCamera(camera, new THREE.Vector3(0, 70, 0), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'wind-flower-snow-moon' })
      },
      onError,
      '风花雪月',
      controls
    )

    // 月亮盈亏（唯美版）
    const moonPhase = createMoonPhase(scene)

    // 风之絮语（15000粒子）
    const windWhispers = createWindWhispers(scene, {
      particleCount: 15000
    })

    // 花之绽放（20000花瓣）
    const flowerBloom = createFlowerBloom(scene, {
      petalCount: 20000
    })

    // 樱花飘舞（12000樱花）
    const cherryBlossom = createCherryBlossom(scene, {
      blossomCount: 12000
    })

    // 雪之飘零（20000雪花）
    const snowDrift = createSnowDrift(scene, {
      snowflakeCount: 20000
    })

    // 花之涟漪
    const flowerRipples = createFlowerRipples(scene)

    // 风之轨迹（10000粒子）
    const windTrails = createWindTrails(scene, {
      trailCount: 10000
    })

    // 月光晕染
    const moonGlow = createMoonGlow(scene)

    // 花语星尘（10000粒子）
    const flowerStardust = createFlowerStardust(scene, {
      stardustCount: 10000
    })

    // 星空闪烁（8000星星）
    const starField = createStarField(scene, {
      starCount: 8000
    })

    // 梦幻光晕
    const dreamHalo = createDreamHalo(scene)

    // 羽毛飘落（5000羽毛）
    const featherFall = createFeatherFall(scene, {
      featherCount: 5000
    })

    // 彩虹涟漪
    const rainbowRipples = createRainbowRipples(scene)

    // 阶段1: 风起 - 风之絮语（持续3秒）
    tl.to(camera, {
      fov: 110,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '风起错误'
      )
    })

    tl.to(camera.position, {
      x: 25,
      y: 20,
      z: 38,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '风之移动错误'
      )
    }, 0.5)

    tl.call(() => {
      windWhispers.blow()
      windTrails.flow()
      moonGlow.emerge()
      dreamHalo.awaken()
      featherFall.float()
    }, null, 0.7)

    // 阶段2: 花开 - 花之绽放（持续3.5秒）
    tl.to(camera.position, {
      x: -20,
      y: 15,
      z: 32,
      duration: 3.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '花开移动错误'
      )
    }, 3.5)

    tl.call(() => {
      flowerBloom.blossom()
      cherryBlossom.dance()
      flowerRipples.expand()
      flowerStardust.scatter()
      starField.twinkle()
    }, null, 3.8)

    // 阶段3: 雪落 - 雪之飘零（持续3秒）
    tl.to(camera.position, {
      x: 0,
      y: -18,
      z: 30,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '雪落移动错误'
      )
    }, 7)

    tl.call(() => {
      snowDrift.fall()
      rainbowRipples.spread()
    }, null, 7.3)

    // 阶段4: 月明 - 月之盈亏（持续2.5秒）
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 42,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '月明移动错误'
      )
    }, 10)

    tl.call(() => {
      moonPhase.wax()
    }, null, 10.3)

    tl.to(camera, {
      fov: 70,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 11.5)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      moonPhase.update(time)
      windWhispers.update(time)
      flowerBloom.update(time)
      cherryBlossom.update(time)
      snowDrift.update(time)
      flowerRipples.update(time)
      windTrails.update(time)
      moonGlow.update(time)
      flowerStardust.update(time)
      starField.update(time)
      dreamHalo.update(time)
      featherFall.update(time)
      rainbowRipples.update(time)
    }

    // 清理函数
    const cleanup = () => {
      moonPhase.destroy()
      windWhispers.destroy()
      flowerBloom.destroy()
      cherryBlossom.destroy()
      snowDrift.destroy()
      flowerRipples.destroy()
      windTrails.destroy()
      moonGlow.destroy()
      flowerStardust.destroy()
      starField.destroy()
      dreamHalo.destroy()
      featherFall.destroy()
      rainbowRipples.destroy()
    }

    tl.call(cleanup, null, 12.5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建月亮盈亏（唯美版）
 */
function createMoonPhase(scene) {
  const moonGroup = new THREE.Group()
  moonGroup.position.set(0, 28, 0)

  // 月球主体
  const moonGeometry = new THREE.SphereGeometry(12, 128, 128)
  const moonMaterial = new THREE.MeshBasicMaterial({
    color: 0xfffff7,
    transparent: true,
    opacity: 0
  })
  const moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moonGroup.add(moon)

  // 月球阴影层（盈亏效果）
  const shadowGeometry = new THREE.SphereGeometry(12.1, 128, 128)
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x0a0a18,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide
  })
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
  shadow.position.x = -12
  moonGroup.add(shadow)

  // 月球表面纹理粒子（增强）
  const craterParticleCount = 800
  const craterGeometry = new THREE.BufferGeometry()
  const craterPositions = new Float32Array(craterParticleCount * 3)
  const craterColors = new Float32Array(craterParticleCount * 3)

  for (let i = 0; i < craterParticleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    craterPositions[i * 3] = 12.3 * Math.sin(phi) * Math.cos(theta)
    craterPositions[i * 3 + 1] = 12.3 * Math.cos(phi)
    craterPositions[i * 3 + 2] = 12.3 * Math.sin(phi) * Math.sin(theta)

    const gray = 0.85 + Math.random() * 0.15
    craterColors[i * 3] = gray
    craterColors[i * 3 + 1] = gray
    craterColors[i * 3 + 2] = gray
  }

  craterGeometry.setAttribute('position', new THREE.BufferAttribute(craterPositions, 3))
  craterGeometry.setAttribute('color', new THREE.BufferAttribute(craterColors, 3))

  const craterMaterial = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0
  })

  const craterPoints = new THREE.Points(craterGeometry, craterMaterial)
  moonGroup.add(craterPoints)

  // 月晕光圈（多层）
  const haloCount = 5
  const halos = []
  for (let i = 0; i < haloCount; i++) {
    const haloGeometry = new THREE.RingGeometry(15 + i * 3, 16 + i * 3, 128)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.12, 0.3, 0.95 - i * 0.05),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.rotation.x = Math.PI / 2
    halo.userData = { pulsePhase: i * Math.PI / 4 }
    halos.push(halo)
    moonGroup.add(halo)
  }

  // 月星光芒（增加）
  const rayCount = 16
  const rays = []
  for (let i = 0; i < rayCount; i++) {
    const rayGeometry = new THREE.CylinderGeometry(0.4, 0.12, 25, 16)
    const rayMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.12, 0.6, 0.9),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ray = new THREE.Mesh(rayGeometry, rayMaterial)
    ray.rotation.z = (i / rayCount) * Math.PI * 2
    ray.position.y = 18
    ray.userData = { rotationSpeed: 0.003 + i * 0.0003 }
    rays.push(ray)
    moonGroup.add(ray)
  }

  scene.add(moonGroup)

  const moonPhase = {
    group: moonGroup,
    moon,
    shadow,
    craterPoints,
    halos,
    rays,
    waxing: false,

    wax() {
      this.waxing = true
      gsap.to(moonMaterial, { opacity: 0.98, duration: 2 })
      gsap.to(craterMaterial, { opacity: 0.7, duration: 2, delay: 0.6 })

      halos.forEach((halo, i) => {
        gsap.to(halo.material, {
          opacity: 0.4 - i * 0.05,
          duration: 1.5,
          delay: 1 + i * 0.2
        })
      })

      rays.forEach((ray, i) => {
        gsap.to(ray.material, {
          opacity: 0.6,
          duration: 1.2,
          delay: 1.5 + i * 0.04
        })
      })

      // 月亮盈亏动画
      gsap.to(shadow.position, {
        x: 12,
        duration: 3,
        ease: 'power2.inOut'
      })
    },

    update(time) {
      // 月晕呼吸效果
      halos.forEach((halo, i) => {
        const haloScale = 1 + Math.sin(time * 0.4 + halo.userData.pulsePhase) * 0.12
        halo.scale.set(haloScale, haloScale, haloScale)
      })

      // 月光光芒旋转
      rays.forEach((ray, i) => {
        ray.rotation.z += ray.userData.rotationSpeed
      })

      // 月球自转（极慢）
      moonGroup.rotation.y += 0.00008

      // 月晕旋转
      halos.forEach((halo, i) => {
        halo.rotation.z += 0.0005 * (i + 1)
      })
    },

    destroy() {
      scene.remove(moonGroup)
      moonGeometry.dispose()
      moonMaterial.dispose()
      shadowGeometry.dispose()
      shadowMaterial.dispose()
      craterGeometry.dispose()
      craterMaterial.dispose()

      halos.forEach(halo => {
        halo.geometry.dispose()
        halo.material.dispose()
      })

      rays.forEach(ray => {
        ray.geometry.dispose()
        ray.material.dispose()
      })
    }
  }

  return moonPhase
}

/**
 * 创建风之絮语（增强版）
 */
function createWindWhispers(scene, options) {
  const { particleCount = 15000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const windData = []

  const windColors = [
    new THREE.Color(0x87ceeb),
    new THREE.Color(0xadd8e6),
    new THREE.Color(0xb0e0e6),
    new THREE.Color(0x778899),
    new THREE.Color(0xafeeee),
    new THREE.Color(0x98fb98)
  ]

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 70
    positions[i * 3 + 1] = (Math.random() - 0.5) * 45
    positions[i * 3 + 2] = (Math.random() - 0.5) * 70

    const color = windColors[Math.floor(Math.random() * windColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    windData.push({
      angle: Math.random() * Math.PI * 2,
      radius: 12 + Math.random() * 28,
      speed: 0.25 + Math.random() * 0.65,
      verticalSpeed: (Math.random() - 0.5) * 0.08,
      waveOffset: Math.random() * Math.PI * 2,
      waveAmplitude: 0.3 + Math.random() * 0.5
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const windWhispers = {
    points,
    material,
    geometry,
    windData,
    blowing: false,

    blow() {
      gsap.to(material, { opacity: 0.7, duration: 1.5 })
      this.blowing = true
    },

    update(time) {
      if (this.blowing) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          const data = windData[i]

          data.angle += data.speed * 0.018

          const wave = Math.sin(time * 2.5 + data.waveOffset) * data.waveAmplitude

          const x = Math.cos(data.angle) * data.radius + wave
          const y = Math.sin(data.angle * 0.4) * 6 + data.verticalSpeed * time
          const z = Math.sin(data.angle) * data.radius + wave

          pos[idx] = x
          pos[idx + 1] = y
          pos[idx + 2] = z

          if (pos[idx + 1] > 22) pos[idx + 1] = -22
          if (pos[idx + 1] < -22) pos[idx + 1] = 22
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0004
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return windWhispers
}

/**
 * 创建花之绽放（增强版）
 */
function createFlowerBloom(scene, options) {
  const { petalCount = 20000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(petalCount * 3)
  const colors = new Float32Array(petalCount * 3)
  const petalData = []

  const flowerColors = [
    new THREE.Color(0xffb6c1), // 浅粉色
    new THREE.Color(0xffc0cb), // 粉红色
    new THREE.Color(0xff69b4), // 热粉色
    new THREE.Color(0xff1493), // 深粉色
    new THREE.Color(0xda70d6), // 兰花紫
    new THREE.Color(0xee82ee), // 紫罗兰
    new THREE.Color(0xffffff), // 纯白
    new THREE.Color(0xfff0f5)  // 淡紫红
  ]

  for (let i = 0; i < petalCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 6 + Math.random() * 18

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    petalData.push({
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      floatSpeed: 0.4 + Math.random() * 0.9,
      floatOffset: Math.random() * Math.PI * 2,
      scale: 0,
      flutterAmplitude: 0.002 + Math.random() * 0.004,
      flutterOffset: Math.random() * Math.PI * 2
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const flowerBloom = {
    points,
    material,
    geometry,
    petalData,
    blossoming: false,

    blossom() {
      gsap.to(material, { opacity: 0.9, duration: 1.8 })

      this.blossoming = true

      petalData.forEach((data, i) => {
        gsap.to(data, {
          scale: 1,
          duration: 2.5,
          delay: i * 0.00008,
          ease: 'back.out(1.8)'
        })
      })
    },

    update(time) {
      if (this.blossoming) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < petalCount; i++) {
          const idx = i * 3
          const data = petalData[i]

          pos[idx + 1] -= 0.008 * data.scale

          const angle = data.rotationSpeed * time * 4
          const radius = Math.sqrt(pos[idx] * pos[idx] + pos[idx + 2] * pos[idx + 2])

          pos[idx] = Math.cos(angle) * radius + Math.sin(time * 3 + i) * data.flutterAmplitude
          pos[idx + 2] = Math.sin(angle) * radius + Math.cos(time * 3 + i) * data.flutterAmplitude

          pos[idx] += Math.sin(time * data.floatSpeed + data.floatOffset) * 0.0015

          if (pos[idx + 1] < -25) {
            pos[idx + 1] = 25
            pos[idx] = (Math.random() - 0.5) * 35
            pos[idx + 2] = (Math.random() - 0.5) * 35
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.00025
      points.rotation.x += 0.00008
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return flowerBloom
}

/**
 * 创建樱花飘舞（新增）
 */
function createCherryBlossom(scene, options) {
  const { blossomCount = 12000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(blossomCount * 3)
  const colors = new Float32Array(blossomCount * 3)
  const blossomData = []

  const cherryColors = [
    new THREE.Color(0xffb7c5), // 樱花粉
    new THREE.Color(0xffc0cb), // 粉红
    new THREE.Color(0xffd1dc), // 浅粉
    new THREE.Color(0xfff0f5), // 淡紫
    new THREE.Color(0xffffff)  // 纯白
  ]

  for (let i = 0; i < blossomCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 8 + Math.random() * 20

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = cherryColors[Math.floor(Math.random() * cherryColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    blossomData.push({
      angle: Math.random() * Math.PI * 2,
      radius: 8 + Math.random() * 20,
      spinSpeed: (Math.random() - 0.5) * 0.012,
      fallSpeed: 0.3 + Math.random() * 0.7,
      swayAmplitude: 0.5 + Math.random() * 0.8,
      swayOffset: Math.random() * Math.PI * 2,
      scale: 0
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const cherryBlossom = {
    points,
    material,
    geometry,
    blossomData,
    dancing: false,

    dance() {
      gsap.to(material, { opacity: 0.88, duration: 1.6 })

      this.dancing = true

      blossomData.forEach((data, i) => {
        gsap.to(data, {
          scale: 1,
          duration: 2.2,
          delay: i * 0.0001,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    },

    update(time) {
      if (this.dancing) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < blossomCount; i++) {
          const idx = i * 3
          const data = blossomData[i]

          pos[idx + 1] -= data.fallSpeed * 0.006 * data.scale

          data.angle += data.spinSpeed

          const sway = Math.sin(time * 2 + data.swayOffset) * data.swayAmplitude * 0.01

          pos[idx] += sway
          pos[idx + 2] += Math.cos(time * 2 + data.swayOffset) * 0.005

          if (pos[idx + 1] < -22) {
            pos[idx + 1] = 22
            pos[idx] = (Math.random() - 0.5) * 40
            pos[idx + 2] = (Math.random() - 0.5) * 40
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0003
      points.rotation.z += 0.0001
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return cherryBlossom
}

/**
 * 创建雪之飘零（增强版）
 */
function createSnowDrift(scene, options) {
  const { snowflakeCount = 20000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(snowflakeCount * 3)
  const colors = new Float32Array(snowflakeCount * 3)
  const snowData = []

  for (let i = 0; i < snowflakeCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 75
    positions[i * 3 + 1] = 25 + Math.random() * 35
    positions[i * 3 + 2] = (Math.random() - 0.5) * 75

    const grayLevel = 0.92 + Math.random() * 0.08
    colors[i * 3] = grayLevel
    colors[i * 3 + 1] = grayLevel
    colors[i * 3 + 2] = grayLevel

    snowData.push({
      fallSpeed: 0.4 + Math.random() * 1.4,
      driftSpeed: (Math.random() - 0.5) * 0.08,
      driftAngle: Math.random() * Math.PI * 2,
      size: 0.12 + Math.random() * 0.18,
      swayAmplitude: 0.3 + Math.random() * 0.5
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const snowDrift = {
    points,
    material,
    geometry,
    snowData,
    falling: false,

    fall() {
      gsap.to(material, { opacity: 0.92, duration: 1.8 })
      this.falling = true
    },

    update(time) {
      if (this.falling) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < snowflakeCount; i++) {
          const idx = i * 3
          const data = snowData[i]

          pos[idx + 1] -= data.fallSpeed * 0.009

          data.driftAngle += data.driftSpeed
          const sway = Math.sin(time * 1.5 + i * 0.01) * data.swayAmplitude * 0.01

          pos[idx] += Math.cos(data.driftAngle) * 0.015 + sway
          pos[idx + 2] += Math.sin(data.driftAngle) * 0.015 + sway

          if (pos[idx + 1] < -28) {
            pos[idx + 1] = 28
            pos[idx] = (Math.random() - 0.5) * 75
            pos[idx + 2] = (Math.random() - 0.5) * 75
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.00015
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return snowDrift
}

/**
 * 创建花之涟漪
 */
function createFlowerRipples(scene) {
  const rippleCount = 10
  const ripples = []

  for (let i = 0; i < rippleCount; i++) {
    const geometry = new THREE.RingGeometry(
      2 + i * 1,
      2.3 + i * 1,
      128
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.92 + (i % 3) * 0.015, 0.65, 0.9),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    ripple.userData = {
      maxScale: 4,
      currentScale: 0.25,
      expanding: false,
      delay: i * 0.15
    }

    ripples.push(ripple)
    scene.add(ripple)
  }

  const flowerRipples = {
    ripples,
    expanding: false,

    expand() {
      this.expanding = true
      ripples.forEach((ripple, i) => {
        ripple.userData.currentScale = 0.25
        gsap.to(ripple.material, {
          opacity: 0.6,
          duration: 0.5,
          delay: ripple.userData.delay
        })
      })
    },

    update(time) {
      if (this.expanding) {
        ripples.forEach((ripple, i) => {
          if (ripple.userData.currentScale < ripple.userData.maxScale) {
            ripple.userData.currentScale += 0.006
            const scale = ripple.userData.currentScale
            ripple.scale.set(scale, scale, scale)

            const opacity = 0.6 * (1 - scale / ripple.userData.maxScale)
            ripple.material.opacity = opacity
          } else {
            ripple.userData.currentScale = 0.25
            ripple.material.opacity = 0.6
          }
        })
      }

      ripples.forEach((ripple, i) => {
        ripple.rotation.z += 0.0006 * (i + 1)
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

  return flowerRipples
}

/**
 * 创建风之轨迹（增强版）
 */
function createWindTrails(scene, options) {
  const { trailCount = 10000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(trailCount * 3)
  const colors = new Float32Array(trailCount * 3)
  const trailData = []

  for (let i = 0; i < trailCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 8 + Math.random() * 28

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (Math.random() - 0.5) * 45
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const hue = 0.5 + Math.random() * 0.12
    const color = new THREE.Color().setHSL(hue, 0.55, 0.88)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    trailData.push({
      angle: Math.random() * Math.PI * 2,
      radius: 8 + Math.random() * 28,
      speed: 0.35 + Math.random() * 0.75,
      verticalOffset: Math.random() * Math.PI * 2,
      waveAmplitude: 0.5 + Math.random() * 1
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const trails = {
    points,
    material,
    geometry,
    trailData,
    flowing: false,

    flow() {
      gsap.to(material, { opacity: 0.65, duration: 1.4 })
      this.flowing = true
    },

    update(time) {
      if (this.flowing) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < trailCount; i++) {
          const idx = i * 3
          const data = trailData[i]

          data.angle += data.speed * 0.022

          const wave = Math.sin(time * 2 + data.verticalOffset) * data.waveAmplitude

          const x = Math.cos(data.angle) * data.radius + wave
          const y = Math.sin(time * 2.5 + data.verticalOffset) * 10
          const z = Math.sin(data.angle) * data.radius + wave

          pos[idx] = x
          pos[idx + 1] = y
          pos[idx + 2] = z
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0006
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return trails
}

/**
 * 创建月光晕染（增强版）
 */
function createMoonGlow(scene) {
  const glowGroup = new THREE.Group()

  // 主光晕
  const mainGlowGeometry = new THREE.SphereGeometry(20, 128, 128)
  const mainGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xfffff8,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const mainGlow = new THREE.Mesh(mainGlowGeometry, mainGlowMaterial)
  glowGroup.add(mainGlow)

  // 外层光晕（增加层）
  for (let i = 0; i < 5; i++) {
    const outerGlowGeometry = new THREE.SphereGeometry(
      25 + i * 5,
      128,
      128
    )
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.11 + i * 0.015, 0.25, 0.96 - i * 0.03),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial)
    outerGlow.userData = { pulsePhase: i * Math.PI / 4 }
    glowGroup.add(outerGlow)
  }

  // 光晕粒子（增加）
  const glowParticleCount = 2500
  const glowParticleGeometry = new THREE.BufferGeometry()
  const glowPositions = new Float32Array(glowParticleCount * 3)
  const glowColors = new Float32Array(glowParticleCount * 3)

  for (let i = 0; i < glowParticleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 20 + Math.random() * 15

    glowPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    glowPositions[i * 3 + 1] = radius * Math.cos(phi)
    glowPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = new THREE.Color().setHSL(0.11 + Math.random() * 0.06, 0.45, 0.92)
    glowColors[i * 3] = color.r
    glowColors[i * 3 + 1] = color.g
    glowColors[i * 3 + 2] = color.b
  }

  glowParticleGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
  glowParticleGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3))

  const glowParticleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const glowParticles = new THREE.Points(glowParticleGeometry, glowParticleMaterial)
  glowGroup.add(glowParticles)

  glowGroup.position.set(0, 28, 0)
  scene.add(glowGroup)

  const moonGlow = {
    group: glowGroup,
    mainGlow,
    outerGlows: glowGroup.children.slice(1, 6),
    glowParticles,
    emerging: false,

    emerge() {
      this.emerging = true

      gsap.to(mainGlowMaterial, { opacity: 0.25, duration: 2 })
      gsap.to(glowParticleMaterial, { opacity: 0.55, duration: 2, delay: 0.6 })

      glowGroup.children.slice(1, 6).forEach((glow, i) => {
        gsap.to(glow.material, {
          opacity: 0.15 - i * 0.02,
          duration: 1.8,
          delay: 1 + i * 0.25
        })
      })
    },

    update(time) {
      if (this.emerging) {
        const mainGlowScale = 1 + Math.sin(time * 0.4) * 0.08
        mainGlow.scale.set(mainGlowScale, mainGlowScale, mainGlowScale)

        glowGroup.children.slice(1, 6).forEach((glow, i) => {
          const pulse = 1 + Math.sin(time * 0.7 + glow.userData.pulsePhase) * 0.1
          glow.scale.set(pulse, pulse, pulse)
        })

        const pos = glowParticleGeometry.attributes.position.array
        for (let i = 0; i < glowParticleCount; i++) {
          if (Math.random() < 0.0015) {
            glowColors[i * 3] *= 1.08
            glowColors[i * 3 + 1] *= 1.08
            glowColors[i * 3 + 2] *= 1.08
          }
        }
        glowParticleGeometry.attributes.color.needsUpdate = true
      }

      glowParticles.rotation.y += 0.00025
    },

    destroy() {
      scene.remove(glowGroup)
      mainGlowGeometry.dispose()
      mainGlowMaterial.dispose()

      glowGroup.children.slice(1, 6).forEach(glow => {
        glow.geometry.dispose()
        glow.material.dispose()
      })

      glowParticleGeometry.dispose()
      glowParticleMaterial.dispose()
    }
  }

  return moonGlow
}

/**
 * 创建花语星尘（增强版）
 */
function createFlowerStardust(scene, options) {
  const { stardustCount = 10000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(stardustCount * 3)
  const colors = new Float32Array(stardustCount * 3)
  const stardustData = []

  for (let i = 0; i < stardustCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 14 + Math.random() * 28

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = new THREE.Color().setHSL(0.78 + Math.random() * 0.18, 0.65, 0.88)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    stardustData.push({
      angle: Math.random() * Math.PI * 2,
      radius: 14 + Math.random() * 28,
      speed: 0.15 + Math.random() * 0.35,
      verticalSpeed: (Math.random() - 0.5) * 0.04,
      twinklePhase: Math.random() * Math.PI * 2
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const stardust = {
    points,
    material,
    geometry,
    stardustData,
    scattering: false,

    scatter() {
      gsap.to(material, { opacity: 0.78, duration: 1.6 })
      this.scattering = true
    },

    update(time) {
      if (this.scattering) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < stardustCount; i++) {
          const idx = i * 3
          const data = stardustData[i]

          data.angle += data.speed * 0.012

          const x = Math.cos(data.angle) * data.radius
          const y = pos[idx + 1] + data.verticalSpeed * 0.015
          const z = Math.sin(data.angle) * data.radius

          pos[idx] = x
          pos[idx + 1] = y
          pos[idx + 2] = z

          data.radius *= 0.9993

          // 闪烁效果
          if (Math.random() < 0.0012) {
            colors[i * 3] *= 1.12
            colors[i * 3 + 1] *= 1.12
            colors[i * 3 + 2] *= 1.12
          }
        }
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
      }

      points.rotation.y += 0.0003
      points.rotation.x += 0.00003
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return stardust
}

/**
 * 创建星空闪烁（新增）
 */
function createStarField(scene, options) {
  const { starCount = 8000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const starData = []

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 50 + Math.random() * 60

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.3, 0.95)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    starData.push({
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleAmplitude: 0.3 + Math.random() * 0.5
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const starField = {
    points,
    material,
    geometry,
    starData,
    twinkling: false,

    twinkle() {
      gsap.to(material, { opacity: 0.85, duration: 2 })
      this.twinkling = true
    },

    update(time) {
      if (this.twinkling) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < starCount; i++) {
          const data = starData[i]

          const twinkle = Math.sin(time * data.twinkleSpeed + data.twinklePhase) * data.twinkleAmplitude

          colors[i * 3] = Math.max(0.7, Math.min(1, 0.85 + twinkle * 0.15))
          colors[i * 3 + 1] = Math.max(0.7, Math.min(1, 0.85 + twinkle * 0.15))
          colors[i * 3 + 2] = Math.max(0.7, Math.min(1, 0.85 + twinkle * 0.15))
        }
        geometry.attributes.color.needsUpdate = true
      }

      points.rotation.y += 0.00008
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return starField
}

/**
 * 创建梦幻光晕（新增）
 */
function createDreamHalo(scene) {
  const haloGroup = new THREE.Group()

  // 梦幻光晕层（多层）
  for (let i = 0; i < 8; i++) {
    const haloGeometry = new THREE.RingGeometry(
      30 + i * 5,
      32 + i * 5,
      128
    )
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.75 + i * 0.03, 0.4, 0.93),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.rotation.x = Math.PI / 2
    halo.userData = {
      pulsePhase: i * Math.PI / 5,
      rotationSpeed: 0.0005 + i * 0.0001
    }
    haloGroup.add(halo)
  }

  scene.add(haloGroup)

  const dreamHalo = {
    group: haloGroup,
    halos: haloGroup.children,
    awakening: false,

    awaken() {
      this.awakening = true

      this.halos.forEach((halo, i) => {
        gsap.to(halo.material, {
          opacity: 0.25 - i * 0.02,
          duration: 2,
          delay: i * 0.2
        })
      })
    },

    update(time) {
      if (this.awakening) {
        this.halos.forEach((halo, i) => {
          const pulse = 1 + Math.sin(time * 0.5 + halo.userData.pulsePhase) * 0.15
          halo.scale.set(pulse, pulse, pulse)

          halo.rotation.z += halo.userData.rotationSpeed
        })
      }
    },

    destroy() {
      scene.remove(haloGroup)
      this.halos.forEach(halo => {
        halo.geometry.dispose()
        halo.material.dispose()
      })
    }
  }

  return dreamHalo
}

/**
 * 创建羽毛飘落（新增）
 */
function createFeatherFall(scene, options) {
  const { featherCount = 5000 } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(featherCount * 3)
  const colors = new Float32Array(featherCount * 3)
  const featherData = []

  for (let i = 0; i < featherCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 10 + Math.random() * 25

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    // 白色到淡紫色渐变
    const hue = 0.75 + Math.random() * 0.1
    const color = new THREE.Color().setHSL(hue, 0.2, 0.95)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    featherData.push({
      angle: Math.random() * Math.PI * 2,
      radius: 10 + Math.random() * 25,
      fallSpeed: 0.2 + Math.random() * 0.5,
      swayAmplitude: 1 + Math.random() * 1.5,
      swayOffset: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      scale: 0
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const featherFall = {
    points,
    material,
    geometry,
    featherData,
    floating: false,

    float() {
      gsap.to(material, { opacity: 0.75, duration: 1.8 })

      this.floating = true

      featherData.forEach((data, i) => {
        gsap.to(data, {
          scale: 1,
          duration: 2,
          delay: i * 0.0002,
          ease: 'back.out(1.5)'
        })
      })
    },

    update(time) {
      if (this.floating) {
        const pos = geometry.attributes.position.array
        for (let i = 0; i < featherCount; i++) {
          const idx = i * 3
          const data = featherData[i]

          pos[idx + 1] -= data.fallSpeed * 0.005 * data.scale

          data.angle += data.spinSpeed

          const sway = Math.sin(time * 1.2 + data.swayOffset) * data.swayAmplitude * 0.01

          pos[idx] += sway
          pos[idx + 2] += Math.cos(time * 1.2 + data.swayOffset) * 0.008

          if (pos[idx + 1] < -20) {
            pos[idx + 1] = 20
            pos[idx] = (Math.random() - 0.5) * 35
            pos[idx + 2] = (Math.random() - 0.5) * 35
          }
        }
        geometry.attributes.position.needsUpdate = true
      }

      points.rotation.y += 0.0002
    },

    destroy() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }

  return featherFall
}

/**
 * 创建彩虹涟漪（新增）
 */
function createRainbowRipples(scene) {
  const rippleCount = 7
  const ripples = []

  for (let i = 0; i < rippleCount; i++) {
    const geometry = new THREE.RingGeometry(
      4 + i * 1.5,
      4.5 + i * 1.5,
      128
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / rippleCount, 0.85, 0.8),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const ripple = new THREE.Mesh(geometry, material)
    ripple.rotation.x = Math.PI / 2
    ripple.userData = {
      maxScale: 3.5,
      currentScale: 0.2,
      spreading: false,
      delay: i * 0.2
    }

    ripples.push(ripple)
    scene.add(ripple)
  }

  const rainbowRipples = {
    ripples,
    spreading: false,

    spread() {
      this.spreading = true
      ripples.forEach((ripple, i) => {
        ripple.userData.currentScale = 0.2
        gsap.to(ripple.material, {
          opacity: 0.55,
          duration: 0.6,
          delay: ripple.userData.delay
        })
      })
    },

    update(time) {
      if (this.spreading) {
        ripples.forEach((ripple, i) => {
          if (ripple.userData.currentScale < ripple.userData.maxScale) {
            ripple.userData.currentScale += 0.007
            const scale = ripple.userData.currentScale
            ripple.scale.set(scale, scale, scale)

            const opacity = 0.55 * (1 - scale / ripple.userData.maxScale)
            ripple.material.opacity = opacity
          } else {
            ripple.userData.currentScale = 0.2
            ripple.material.opacity = 0.55
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

  return rainbowRipples
}
