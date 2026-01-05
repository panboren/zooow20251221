/**
 * 宇宙粒子交响曲动画（细腻版）
 * 展现粒子如同交响乐般交织、融合、爆发的壮丽景象
 * 优化：更细腻的粒子、更高的可见度、更平滑的过渡
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateCosmicParticleSymphony(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 观众视角
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 55), 85, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-particle-symphony' })
      },
      onError,
      '宇宙粒子交响曲',
      controls
    )

    // 创建粒子音符系统 - 细腻版（更小粒子、更高密度）
    const particleNotes = createParticleNotes(scene, {
      noteCount: 50000,
      octaveRange: 15,
      spreadRadius: 55
    })

    // 创建波纹和声 - 细腻版
    const harmonyRipples = createHarmonyRipples(scene, {
      rippleCount: 25,
      rippleSpeed: 3,
      colorPalette: 'rainbow'
    })

    // 创建能量和弦 - 细腻版
    const energyChords = createEnergyChords(scene, {
      chordCount: 12,
      beamCount: 120
    })

    // 创建旋律粒子流 - 细腻版
    const melodyStreams = createMelodyStreams(scene, {
      streamCount: 10,
      particleCount: 1500
    })

    // 创建光爆系统 - 细腻版
    const lightBursts = createLightBursts(scene, {
      burstCount: 4
    })

    // 阶段1: 序曲 - 立即激活所有元素
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 45,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '摄像机移动错误'
      )
    })

    // 立即激活所有系统
    tl.call(() => {
      particleNotes.animateActive()
      harmonyRipples.animateActive()
      melodyStreams.animateActive()
    }, null, 0)

    // 阶段2: 渐强 - 平滑增强
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 30,
      duration: 0.8,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '渐强阶段错误'
      )
    }, 1)

    tl.to(camera, {
      fov: 100,
      duration: 0.8,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 1)

    tl.call(() => {
      particleNotes.animateIntensify()
      harmonyRipples.animateIntensify()
      energyChords.animateIntensify()
      melodyStreams.animateIntensify()
    }, null, 1)

    // 阶段3: 能量爆发 - 平滑过渡到高潮
    tl.call(() => {
      energyChords.animateClimax()
      particleNotes.animateClimax()
      harmonyRipples.animateClimax()
      lightBursts.animateBurst()
      addCameraShake(camera, 0.25, 0.06)
    }, null, 1.8)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 20,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '能量爆发错误'
      )
    }, 1.8)

    tl.to(camera, {
      fov: 135,
      duration: 0.4,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        '能量爆发错误'
      )
    }, 1.8)

    // 阶段4: 高潮 - 全开
    tl.call(() => {
      melodyStreams.animateClimax()
      energyChords.animateSymphony()
      lightBursts.animateSecondBurst()
      addCameraShake(camera, 0.4, 0.1)
    }, null, 2.4)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 12,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '高潮阶段错误'
      )
    }, 2.4)

    // 阶段5: 尾声 - 平滑收尾
    tl.call(() => {
      particleNotes.animateCoda()
      harmonyRipples.animateCoda()
      energyChords.animateCoda()
      lightBursts.animateCoda()
    }, null, 3.2)

    tl.to(camera.position, {
      x: 0,
      y: 8,
      z: 20,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '尾声阶段错误'
      )
    }, 3.2)

    tl.to(camera, {
      fov: 75,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 3.2)

    // 阶段6: 最终定格
    tl.to(camera.position, {
      x: 0.003,
      y: 0.003,
      z: 0.003,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定格错误'
      )
    }, 4)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      particleNotes.update(time)
      harmonyRipples.update(time)
      energyChords.update(time)
      melodyStreams.update(time)
      lightBursts.update(time)
    }

    // 清理函数
    const cleanup = () => {
      particleNotes.destroy()
      harmonyRipples.destroy()
      energyChords.destroy()
      melodyStreams.destroy()
      lightBursts.destroy()
    }

    tl.call(cleanup, null, 5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 添加摄像机震动效果
 */
function addCameraShake(camera, duration, intensity) {
  const originalPosition = camera.position.clone()
  const timeline = gsap.timeline({
    onComplete: () => {
      camera.position.copy(originalPosition)
    }
  })

  const shakeCount = Math.floor(duration * 60)
  for (let i = 0; i < shakeCount; i++) {
    timeline.to(camera.position, {
      x: originalPosition.x + (Math.random() - 0.5) * intensity * 2,
      y: originalPosition.y + (Math.random() - 0.5) * intensity * 2,
      z: originalPosition.z + (Math.random() - 0.5) * intensity,
      duration: 0.016
    })
  }
}

/**
 * 创建粒子音符系统 - 细腻版
 */
function createParticleNotes(scene, options) {
  const {
    noteCount = 50000,
    octaveRange = 15,
    spreadRadius = 55
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(noteCount * 3)
  const colors = new Float32Array(noteCount * 3)
  const sizes = new Float32Array(noteCount)
  const phases = new Float32Array(noteCount)
  const frequencies = new Float32Array(noteCount)
  const originalPositions = new Float32Array(noteCount * 3)

  // 扩展色板 - 更高对比度
  const noteColors = [
    new THREE.Color(0xFF1744),
    new THREE.Color(0xFF4081),
    new THREE.Color(0xE040FB),
    new THREE.Color(0x7C4DFF),
    new THREE.Color(0x536DFE),
    new THREE.Color(0x448AFF),
    new THREE.Color(0x40C4FF),
    new THREE.Color(0x18FFFF),
    new THREE.Color(0x69F0AE),
    new THREE.Color(0x00E676),
    new THREE.Color(0xFFC400),
    new THREE.Color(0xFF9100),
    new THREE.Color(0xFF3D00),
    new THREE.Color(0x00B0FF),
    new THREE.Color(0x00E5FF),
    new THREE.Color(0xFF80AB),
    new THREE.Color(0xB388FF),
    new THREE.Color(0xFF6D00)
  ]

  for (let i = 0; i < noteCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = Math.pow(Math.random(), 0.5) * spreadRadius

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    originalPositions[i * 3] = x
    originalPositions[i * 3 + 1] = y
    originalPositions[i * 3 + 2] = z

    const colorIndex = Math.floor((radius / spreadRadius) * noteColors.length)
    const color = noteColors[Math.min(colorIndex, noteColors.length - 1)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // 更小的粒子尺寸 - 更细腻
    sizes[i] = Math.random() * 1.5 + 0.8
    phases[i] = Math.random() * Math.PI * 2
    frequencies[i] = (Math.random() * 0.6 + 0.4) * octaveRange
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // 更高的透明度 - 始终清晰可见
  const material = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.85
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  let animationPhase = 'active'
  let intensity = 0.5

  return {
    group,
    animateActive() {
      animationPhase = 'active'
      intensity = 0.5
      material.size = 1.2
      material.opacity = 0.85
    },
    animateIntensify() {
      animationPhase = 'intensify'
      intensity = 0.75

      gsap.to(material, {
        size: 2,
        opacity: 0.92,
        duration: 0.8,
        ease: 'power2.inOut'
      })

      gsap.to(group.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.8,
        ease: 'power2.inOut'
      })
    },
    animateClimax() {
      animationPhase = 'climax'
      intensity = 1

      gsap.to(material, {
        size: 3,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      })

      gsap.to(group.scale, {
        x: 1.8,
        y: 1.8,
        z: 1.8,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    },
    animateCoda() {
      animationPhase = 'coda'
      intensity = 0.4

      gsap.to(material, {
        size: 1.5,
        opacity: 0.7,
        duration: 0.8,
        ease: 'power2.inOut'
      })

      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: 'power2.inOut'
      })
    },
    update(time) {
      const positions = geometry.attributes.position.array

      for (let i = 0; i < noteCount; i++) {
        const frequency = frequencies[i]
        const phase = phases[i]
        const origX = originalPositions[i * 3]
        const origY = originalPositions[i * 3 + 1]
        const origZ = originalPositions[i * 3 + 2]

        // 更平滑的跳动 - 减少幅度
        const bounce = Math.sin(time * frequency + phase) * intensity * 2

        if (animationPhase === 'climax') {
          positions[i * 3] = origX * (1 + bounce * 0.3)
          positions[i * 3 + 1] = origY * (1 + bounce * 0.3)
          positions[i * 3 + 2] = origZ * (1 + bounce * 0.3)
        } else if (animationPhase === 'intensify') {
          positions[i * 3] = origX + bounce * 0.12
          positions[i * 3 + 1] = origY + bounce * 0.12
          positions[i * 3 + 2] = origZ + bounce * 0.12
        } else {
          positions[i * 3] = origX + bounce * 0.08
          positions[i * 3 + 1] = origY + bounce * 0.08
          positions[i * 3 + 2] = origZ + bounce * 0.08
        }
      }

      geometry.attributes.position.needsUpdate = true
      // 更平滑的旋转
      group.rotation.y += 0.003 * intensity
      group.rotation.x += 0.002 * intensity
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建波纹和声 - 细腻版
 */
function createHarmonyRipples(scene, options) {
  const {
    rippleCount = 25,
    rippleSpeed = 3,
    colorPalette = 'rainbow'
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const ripples = []
  const rippleMaterials = []

  const colors = [
    new THREE.Color(0xFF1744),
    new THREE.Color(0xE040FB),
    new THREE.Color(0x7C4DFF),
    new THREE.Color(0x18FFFF),
    new THREE.Color(0x00E676),
    new THREE.Color(0xFFC400)
  ]

  for (let i = 0; i < rippleCount; i++) {
    const is3D = i >= rippleCount / 2
    let geometry

    if (is3D) {
      geometry = new THREE.SphereGeometry(
        5 + (i - rippleCount / 2) * 2,
        32,
        32
      )
    } else {
      geometry = new THREE.RingGeometry(
        5 + i * 2,
        5 + i * 2 + 0.8,
        64
      )
    }

    const color = colors[i % colors.length]
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      wireframe: is3D
    })

    const ripple = new THREE.Mesh(geometry, material)
    if (!is3D) {
      ripple.rotation.x = Math.PI / 2
    }
    ripple.visible = true

    group.add(ripple)
    ripples.push(ripple)
    rippleMaterials.push(material)
  }

  let isAnimating = true

  return {
    group,
    animateActive() {
      isAnimating = true
      ripples.forEach((ripple, i) => {
        ripple.visible = true
        rippleMaterials[i].opacity = 0.4
      })
    },
    animateIntensify() {
      ripples.forEach((ripple, i) => {
        gsap.to(rippleMaterials[i], {
          opacity: 0.65,
          duration: 0.8,
          delay: i * 0.02,
          ease: 'power2.inOut'
        })
      })
    },
    animateClimax() {
      ripples.forEach((ripple, i) => {
        gsap.to(rippleMaterials[i], {
          opacity: 0.85,
          duration: 0.4,
          delay: i * 0.015,
          ease: 'power2.inOut'
        })
      })
    },
    animateCoda() {
      isAnimating = false
      ripples.forEach((ripple, i) => {
        gsap.to(rippleMaterials[i], {
          opacity: 0,
          duration: 0.8,
          delay: i * 0.02,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (!isAnimating) return

      ripples.forEach((ripple, i) => {
        const progress = (time * rippleSpeed - i * 0.2) % 6 / 6
        const scale = 1 + progress * 3
        const opacity = rippleMaterials[i].opacity * (1 - progress * 0.5)

        ripple.scale.set(scale, scale, scale)
        ripple.material.opacity = opacity

        if (ripple.geometry.type === 'SphereGeometry') {
          // 更平滑的旋转
          ripple.rotation.y += 0.01
          ripple.rotation.x += 0.005
        }
      })
    },
    destroy() {
      scene.remove(group)
      ripples.forEach(ripple => {
        ripple.geometry.dispose()
        ripple.material.dispose()
      })
    }
  }
}

/**
 * 创建能量和弦 - 细腻版
 */
function createEnergyChords(scene, options) {
  const {
    chordCount = 12,
    beamCount = 120
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const beams = []
  const beamMaterials = []

  // 发光核心
  const coreGeometry = new THREE.SphereGeometry(8, 32, 32)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xFF4081),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  // 外层光晕
  const glowGeometry = new THREE.SphereGeometry(12, 32, 32)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xE040FB),
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  group.add(glow)

  const chordColors = [
    new THREE.Color(0xFF1744),
    new THREE.Color(0xFF4081),
    new THREE.Color(0xE040FB),
    new THREE.Color(0x7C4DFF),
    new THREE.Color(0x18FFFF),
    new THREE.Color(0x00E676),
    new THREE.Color(0xFFC400),
    new THREE.Color(0xFF9100),
    new THREE.Color(0xFF80AB),
    new THREE.Color(0xB388FF),
    new THREE.Color(0x448AFF),
    new THREE.Color(0x69F0AE)
  ]

  for (let c = 0; c < chordCount; c++) {
    const chordGroup = new THREE.Group()
    group.add(chordGroup)

    for (let b = 0; b < beamCount; b++) {
      const geometry = new THREE.CylinderGeometry(0.1, 0.1, 100, 8)
      const color = chordColors[c]
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      })

      const beam = new THREE.Mesh(geometry, material)
      const angle = (b / beamCount) * Math.PI * 2
      beam.position.set(
        Math.cos(angle) * 25,
        Math.sin(angle) * 25,
        0
      )
      beam.rotation.x = Math.PI / 2
      beam.rotation.z = angle

      chordGroup.add(beam)
      beams.push(beam)
      beamMaterials.push(material)
    }
  }

  let isAnimating = true

  return {
    group,
    animateActive() {
      isAnimating = true
    },
    animateIntensify() {
      gsap.to(coreMaterial, {
        opacity: 0.75,
        duration: 0.8,
        ease: 'power2.inOut'
      })

      gsap.to(glowMaterial, {
        opacity: 0.6,
        duration: 0.8,
        ease: 'power2.inOut'
      })

      beamMaterials.forEach((material, i) => {
        gsap.to(material, {
          opacity: 0.6,
          duration: 0.8,
          delay: (i % beamCount) * 0.004,
          ease: 'power2.inOut'
        })
      })
    },
    animateClimax() {
      gsap.to(coreMaterial, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      })

      gsap.to(glowMaterial, {
        opacity: 0.85,
        duration: 0.4,
        ease: 'power2.inOut'
      })

      beamMaterials.forEach((material, i) => {
        gsap.to(material, {
          opacity: 0.85,
          duration: 0.35,
          delay: (i % beamCount) * 0.003,
          ease: 'power2.inOut'
        })
      })
    },
    animateSymphony() {
      gsap.to(core.scale, {
        x: 1.6,
        y: 1.6,
        z: 1.6,
        duration: 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })

      gsap.to(glow.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 0.6,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })
    },
    animateCoda() {
      isAnimating = false

      gsap.to(coreMaterial, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      })

      gsap.to(glowMaterial, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      })

      beamMaterials.forEach((material, i) => {
        gsap.to(material, {
          opacity: 0,
          duration: 0.8,
          delay: i * 0.002,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (isAnimating) {
        // 更平滑的旋转
        group.rotation.y += 0.008
        group.rotation.x = Math.sin(time * 1) * 0.2

        const pulse = Math.sin(time * 8) * 0.12 + 1
        core.scale.set(pulse, pulse, pulse)

        const glowPulse = Math.sin(time * 6) * 0.15 + 1
        glow.scale.set(glowPulse, glowPulse, glowPulse)
      }
    },
    destroy() {
      scene.remove(group)
      core.geometry.dispose()
      core.material.dispose()
      glow.geometry.dispose()
      glow.material.dispose()
      beams.forEach(beam => {
        beam.geometry.dispose()
        beam.material.dispose()
      })
    }
  }
}

/**
 * 创建旋律粒子流 - 细腻版
 */
function createMelodyStreams(scene, options) {
  const {
    streamCount = 10,
    particleCount = 1500
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const streams = []

  const streamColors = [
    new THREE.Color(0xFF1744),
    new THREE.Color(0xE040FB),
    new THREE.Color(0x7C4DFF),
    new THREE.Color(0x18FFFF),
    new THREE.Color(0x00E676),
    new THREE.Color(0xFFC400),
    new THREE.Color(0xFF4081),
    new THREE.Color(0x00E5FF),
    new THREE.Color(0xFF80AB),
    new THREE.Color(0xB388FF)
  ]

  for (let s = 0; s < streamCount; s++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const color = streamColors[s % streamColors.length]

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount
      const angle = (Math.PI * 2 / streamCount) * s + t * Math.PI * 4

      positions[i * 3] = Math.cos(angle) * (10 + t * 40)
      positions[i * 3 + 1] = Math.sin(angle) * (10 + t * 40)
      positions[i * 3 + 2] = (t - 0.5) * 120

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // 更小的粒子尺寸
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    })

    const stream = new THREE.Points(geometry, material)
    group.add(stream)
    streams.push({ stream, geometry, material, originalColor: color.clone() })
  }

  let isAnimating = true

  return {
    group,
    animateActive() {
      isAnimating = true
      streams.forEach(s => {
        s.material.opacity = 0.85
      })
    },
    animateIntensify() {
      streams.forEach((s, i) => {
        gsap.to(s.material, {
          opacity: 0.92,
          size: 2.2,
          duration: 0.8,
          delay: i * 0.04,
          ease: 'power2.inOut'
        })
      })
    },
    animateClimax() {
      streams.forEach((s, i) => {
        gsap.to(s.material, {
          opacity: 1,
          size: 3,
          duration: 0.4,
          delay: i * 0.025,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (!isAnimating) return

      streams.forEach((s, i) => {
        const positions = s.geometry.attributes.position.array

        for (let j = 0; j < particleCount; j++) {
          const t = j / particleCount
          const speed = 2 + (particleCount - j) * 0.004
          const angle = (Math.PI * 2 / streamCount) * i + t * Math.PI * 4 + time * 1

          positions[j * 3] = Math.cos(angle) * (10 + t * 45)
          positions[j * 3 + 1] = Math.sin(angle) * (10 + t * 45)
          positions[j * 3 + 2] = (t - 0.5) * 130
        }

        s.geometry.attributes.position.needsUpdate = true
        // 更平滑的旋转
        s.stream.rotation.z += 0.002
      })
    },
    destroy() {
      scene.remove(group)
      streams.forEach(s => {
        s.geometry.dispose()
        s.material.dispose()
      })
    }
  }
}

/**
 * 创建光爆系统 - 细腻版
 */
function createLightBursts(scene, options) {
  const {
    burstCount = 4
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const bursts = []

  const burstColors = [
    new THREE.Color(0xFF4081),
    new THREE.Color(0x18FFFF),
    new THREE.Color(0xFFC400),
    new THREE.Color(0xE040FB)
  ]

  for (let b = 0; b < burstCount; b++) {
    // 光爆核心
    const coreGeometry = new THREE.SphereGeometry(15, 32, 32)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: burstColors[b],
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)

    // 光爆光晕
    const haloGeometry = new THREE.SphereGeometry(25, 32, 32)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: burstColors[b],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)

    // 光爆射线
    const rayGroup = new THREE.Group()
    const rayCount = 20
    for (let r = 0; r < rayCount; r++) {
      const rayGeometry = new THREE.CylinderGeometry(0.3, 1, 40, 8)
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: burstColors[b],
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      })
      const ray = new THREE.Mesh(rayGeometry, rayMaterial)
      const angle = (r / rayCount) * Math.PI * 2
      ray.position.set(
        Math.cos(angle) * 30,
        Math.sin(angle) * 30,
        0
      )
      ray.rotation.x = Math.PI / 2
      ray.rotation.z = angle
      rayGroup.add(ray)
    }

    group.add(core)
    group.add(halo)
    group.add(rayGroup)

    bursts.push({ core, halo, rayGroup, coreMaterial, haloMaterial })
  }

  let isAnimating = true

  return {
    group,
    animateBurst() {
      bursts.forEach((burst, i) => {
        gsap.to(burst.coreMaterial, {
          opacity: 0.95,
          duration: 0.3,
          delay: i * 0.12,
          ease: 'power2.inOut'
        })

        gsap.to(burst.haloMaterial, {
          opacity: 0.8,
          duration: 0.3,
          delay: i * 0.12 + 0.06,
          ease: 'power2.inOut'
        })

        burst.rayGroup.children.forEach((ray, r) => {
          gsap.to(ray.material, {
            opacity: 0.85,
            duration: 0.3,
            delay: i * 0.12 + r * 0.006,
            ease: 'power2.inOut'
          })
        })

        gsap.to(burst.core.scale, {
          x: 2.5,
          y: 2.5,
          z: 2.5,
          duration: 0.4,
          delay: i * 0.12,
          ease: 'power2.inOut'
        })

        gsap.to(burst.halo.scale, {
          x: 2.2,
          y: 2.2,
          z: 2.2,
          duration: 0.4,
          delay: i * 0.12,
          ease: 'power2.inOut'
        })
      })
    },
    animateSecondBurst() {
      bursts.forEach((burst, i) => {
        gsap.to(burst.core.scale, {
          x: 3.2,
          y: 3.2,
          z: 3.2,
          duration: 0.35,
          delay: i * 0.08,
          ease: 'power2.inOut'
        })

        gsap.to(burst.halo.scale, {
          x: 2.8,
          y: 2.8,
          z: 2.8,
          duration: 0.35,
          delay: i * 0.08,
          ease: 'power2.inOut'
        })
      })
    },
    animateCoda() {
      isAnimating = false

      bursts.forEach((burst, i) => {
        gsap.to(burst.coreMaterial, {
          opacity: 0,
          duration: 0.8,
          delay: i * 0.06,
          ease: 'power2.inOut'
        })

        gsap.to(burst.haloMaterial, {
          opacity: 0,
          duration: 0.8,
          delay: i * 0.06,
          ease: 'power2.inOut'
        })

        burst.rayGroup.children.forEach(ray => {
          gsap.to(ray.material, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut'
          })
        })

        gsap.to(burst.core.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: 'power2.inOut'
        })

        gsap.to(burst.halo.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (isAnimating) {
        bursts.forEach((burst, i) => {
          // 更平滑的旋转
          burst.rayGroup.rotation.z += 0.02
          burst.core.rotation.y += 0.01
        })
      }
    },
    destroy() {
      scene.remove(group)
      bursts.forEach(burst => {
        burst.core.geometry.dispose()
        burst.core.material.dispose()
        burst.halo.geometry.dispose()
        burst.halo.material.dispose()
        burst.rayGroup.children.forEach(ray => {
          ray.geometry.dispose()
          ray.material.dispose()
        })
      })
    }
  }
}
