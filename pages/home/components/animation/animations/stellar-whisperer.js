/**
 * 星语者特效
 * 模拟星光投影、星座形成与宇宙低语的神秘体验
 * 优化版：增加粒子流、光晕、能量波等酷炫效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateStellarWhisperer(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 120), 140, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'stellar-whisperer' })
      },
      onError,
      '星语者',
      controls,
    )

    // 创建星语者系统
    const stellarWhisperer = createStellarWhispererSystem(scene, {
      starCount: 2000,
      particleFlowCount: 800,
      constellationCount: 5,
      projectionBeams: 8,
      whisperEffect: true
    })

    // 阶段1: 星光初现
    tl.to(camera.position, {
      x: 0,
      y: 40,
      z: 80,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '星光初现错误',
      ),
    })

    // 阶段2: 星座形成
    stellarWhisperer.awaken(5)

    // 阶段3: 星光投影
    tl.to(camera.position, {
      x: 30,
      y: 25,
      z: 50,
      duration: 3,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(10, 15, 0),
        '星光投影错误',
      ),
    })

    // 持续星光演绎
    let startTime = null
    const duration = 8

    const animate = (time) => {
      if (!startTime) startTime = time
      const elapsed = (time - startTime) / 1000

      if (elapsed < duration) {
        const deltaTime = 0.016
        stellarWhisperer.whisper(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        stellarWhisperer.fade()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '星语者特效执行错误')
    }
    return gsap.timeline()
  }
}

// 星语者系统创建函数
function createStellarWhispererSystem(scene, options = {}) {
  const {
    starCount = 2000,
    particleFlowCount = 800,
    constellationCount = 5,
    projectionBeams: beamCount = 8,
    whisperEffect = true
  } = options

  // 星空容器
  const cosmos = new THREE.Group()
  scene.add(cosmos)

  // 创建多层星空背景
  const backgroundStars = []
  const bgLayers = [
    { count: 300, scale: 250, opacity: 0.3, size: 0.2 },
    { count: 200, scale: 180, opacity: 0.5, size: 0.3 },
    { count: 150, scale: 120, opacity: 0.7, size: 0.4 }
  ]

  bgLayers.forEach(layer => {
    const bgStarGeometry = new THREE.SphereGeometry(layer.size, 8, 8)
    for (let i = 0; i < layer.count; i++) {
      const hue = Math.random() * 0.15 + 0.55  // 蓝紫色调
      const starMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.6, 0.8),
        transparent: true,
        opacity: layer.opacity
      })

      const star = new THREE.Mesh(bgStarGeometry, starMaterial)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = layer.scale
      star.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
      cosmos.add(star)
      backgroundStars.push({ mesh: star, layerScale: layer.scale })
    }
  })

  // 创建主要星光系统
  const starGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const sizes = new Float32Array(starCount)

  const stars = []

  // 定义星座形状模板（更多星座）
  const constellations = [
    { shape: 'orion', scale: 18, color: 0x4fc3f7, rotation: Math.PI / 4 },
    { shape: 'bigDipper', scale: 15, color: 0x7986cb, rotation: -Math.PI / 6 },
    { shape: 'cygnus', scale: 20, color: 0x81c784, rotation: Math.PI / 3 },
    { shape: 'cassiopeia', scale: 14, color: 0xffb74d, rotation: -Math.PI / 4 },
    { shape: 'scorpio', scale: 17, color: 0xe57373, rotation: Math.PI / 6 }
  ]

  // 生成星座星星
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3
    const constellationIndex = i % constellationCount
    const constellation = constellations[constellationIndex]

    let x, y, z
    switch(constellation.shape) {
      case 'orion':
        const angle1 = (i / starCount) * Math.PI * 2
        const radius1 = constellation.scale * (0.8 + Math.sin(angle1 * 3) * 0.2)
        const height1 = Math.cos(angle1 * 2) * 6
        x = Math.cos(angle1 + constellation.rotation) * radius1
        y = height1
        z = Math.sin(angle1 + constellation.rotation) * radius1
        break
      case 'bigDipper':
        const angle2 = (i / starCount) * Math.PI * 1.5
        const radius2 = constellation.scale * (0.7 + Math.cos(angle2 * 4) * 0.3)
        const height2 = Math.sin(angle2 * 3) * 9
        x = Math.cos(angle2 + constellation.rotation) * radius2
        y = height2
        z = Math.sin(angle2 + constellation.rotation) * radius2
        break
      case 'cygnus':
        const angle3 = (i / starCount) * Math.PI * 3
        const radius3 = constellation.scale * (0.6 + Math.sin(angle3 * 5) * 0.4)
        const height3 = Math.cos(angle3 * 1.5) * 11
        x = Math.cos(angle3 + constellation.rotation) * radius3
        y = height3
        z = Math.sin(angle3 + constellation.rotation) * radius3
        break
      case 'cassiopeia':
        const angle4 = (i / starCount) * Math.PI * 2.5
        const radius4 = constellation.scale * (0.75 + Math.sin(angle4 * 6) * 0.25)
        const height4 = Math.sin(angle4 * 4) * 7
        x = Math.cos(angle4 + constellation.rotation) * radius4
        y = height4
        z = Math.sin(angle4 + constellation.rotation) * radius4
        break
      case 'scorpio':
        const angle5 = (i / starCount) * Math.PI * 1.8
        const radius5 = constellation.scale * (0.65 + Math.cos(angle5 * 5) * 0.35)
        const height5 = Math.cos(angle5 * 2.5) * 8
        x = Math.cos(angle5 + constellation.rotation) * radius5
        y = height5
        z = Math.sin(angle5 + constellation.rotation) * radius5
        break
    }

    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z

    const color = new THREE.Color(constellation.color)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    sizes[i] = 0.6 + Math.random() * 2.0

    stars.push({
      originalPosition: new THREE.Vector3(x, y, z),
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 1.5 + Math.random() * 2.5,
      brightness: 0.6 + Math.random() * 0.4,
      constellationIndex
    })
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  const starSystem = new THREE.Points(starGeometry, starMaterial)
  cosmos.add(starSystem)

  // 创建粒子流系统
  const flowGeometry = new THREE.BufferGeometry()
  const flowPositions = new Float32Array(particleFlowCount * 3)
  const flowColors = new Float32Array(particleFlowCount * 3)
  const flowSizes = new Float32Array(particleFlowCount)

  const flowParticles = []

  for (let i = 0; i < particleFlowCount; i++) {
    const i3 = i * 3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 30 + Math.random() * 40

    flowPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    flowPositions[i3 + 1] = radius * Math.cos(phi)
    flowPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const hue = 0.5 + Math.random() * 0.3
    const color = new THREE.Color().setHSL(hue, 0.9, 0.7)
    flowColors[i3] = color.r
    flowColors[i3 + 1] = color.g
    flowColors[i3 + 2] = color.b

    flowSizes[i] = 0.2 + Math.random() * 0.4

    flowParticles.push({
      originalPos: new THREE.Vector3(flowPositions[i3], flowPositions[i3 + 1], flowPositions[i3 + 2]),
      angle: theta,
      phi: phi,
      radius: radius,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2
    })
  }

  flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3))
  flowGeometry.setAttribute('color', new THREE.BufferAttribute(flowColors, 3))
  flowGeometry.setAttribute('size', new THREE.BufferAttribute(flowSizes, 1))

  const flowMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  const flowSystem = new THREE.Points(flowGeometry, flowMaterial)
  cosmos.add(flowSystem)

  // 创建星光投影光束
  const projectionBeamsArray = []
  for (let i = 0; i < beamCount; i++) {
    const beamGeometry = new THREE.CylinderGeometry(0.4, 2, 50, 12)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i * 0.12, 0.9, 0.7),
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)
    const angle = (i / beamCount) * Math.PI * 2
    beam.position.set(
      Math.cos(angle) * 30,
      -20,
      Math.sin(angle) * 30
    )
    beam.rotation.x = Math.PI / 2
    cosmos.add(beam)
    projectionBeamsArray.push(beam)
  }

  // 创建星语核心（水晶）
  const crystalGeometry = new THREE.OctahedronGeometry(7, 1)
  const crystalMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x99ddff,
    shininess: 200,
    transparent: true,
    opacity: 0.9
  })
  const crystalCore = new THREE.Mesh(crystalGeometry, crystalMaterial)
  cosmos.add(crystalCore)

  // 创建水晶光晕
  const glowGeometry = new THREE.SphereGeometry(10, 32, 32)
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      glowColor: { value: new THREE.Color(0x66ccff) }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        float pulse = sin(time * 2.0) * 0.2 + 0.8;
        gl_FragColor = vec4(glowColor * intensity * pulse, 0.3);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
  const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
  cosmos.add(glowSphere)

  // 创建能量波纹环
  const energyRings = []
  for (let i = 0; i < 4; i++) {
    const ringGeometry = new THREE.TorusGeometry(15 + i * 8, 0.3, 8, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.55 + i * 0.1, 0.8, 0.7),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    cosmos.add(ring)
    energyRings.push(ring)
  }

  // 创建星座连线
  const constellationLines = []
  constellations.forEach((constellation, index) => {
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(50 * 3)

    for (let j = 0; j < 50; j++) {
      const progress = j / 49
      const angle = progress * Math.PI * 2
      const radius = constellation.scale * (0.9 + Math.sin(progress * Math.PI) * 0.1)
      const height = Math.sin(progress * Math.PI * 1.5) * 9

      linePositions[j * 3] = Math.cos(angle + constellation.rotation) * radius
      linePositions[j * 3 + 1] = height
      linePositions[j * 3 + 2] = Math.sin(angle + constellation.rotation) * radius
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: constellation.color,
      transparent: true,
      opacity: 0,
      linewidth: 2,
      blending: THREE.AdditiveBlending
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    cosmos.add(line)
    constellationLines.push({ line, material: lineMaterial })
  })

  // 创建旋转星带
  const starBelt = []
  for (let i = 0; i < 3; i++) {
    const beltGeometry = new THREE.TorusGeometry(25 + i * 10, 0.5, 8, 100)
    const beltMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 + i * 0.15, 0.7, 0.6),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
    const belt = new THREE.Mesh(beltGeometry, beltMaterial)
    belt.rotation.x = Math.PI / 3 + i * 0.2
    cosmos.add(belt)
    starBelt.push(belt)
  }

  const result = Object.create(null)

  const animationState = {
    active: false,
    phase: 0,
    lastUpdate: 0
  }

  result.awaken = function(duration) {
    animationState.active = true
    animationState.phase = 1
    animationState.lastUpdate = 0

    setTimeout(() => { animationState.phase = 2 }, duration * 1000 * 0.35)
    if (whisperEffect) {
      setTimeout(() => { animationState.phase = 3 }, duration * 1000 * 0.6)
    }
  }

  result.whisper = function(deltaTime, elapsed) {
    if (!animationState.active) return

    const time = elapsed * 1.8
    animationState.lastUpdate = time

    // 水晶核心旋转 + 脉动
    crystalCore.rotation.x = time * 0.4
    crystalCore.rotation.y = time * 0.6
    crystalCore.scale.setScalar(1 + Math.sin(time * 3) * 0.15)

    // 更新光晕
    glowMaterial.uniforms.time.value = time

    // 星光脉动效果
    const positions = starGeometry.attributes.position.array
    const colors = starGeometry.attributes.color.array

    stars.forEach((star, i) => {
      const i3 = i * 3
      const pulse = Math.sin(time * star.pulseSpeed + star.phase) * 0.5 + 0.5

      positions[i3] = star.originalPosition.x + Math.sin(time + i * 0.1) * 0.8
      positions[i3 + 1] = star.originalPosition.y + Math.cos(time * 1.5 + i * 0.05) * 0.5
      positions[i3 + 2] = star.originalPosition.z + Math.sin(time * 1.0 + i * 0.08) * 0.6

      const brightness = star.brightness + pulse * 0.4
      const constellation = constellations[star.constellationIndex]
      const baseColor = new THREE.Color(constellation.color)
      baseColor.multiplyScalar(brightness)

      colors[i3] = baseColor.r
      colors[i3 + 1] = baseColor.g
      colors[i3 + 2] = baseColor.b
    })

    starGeometry.attributes.position.needsUpdate = true
    starGeometry.attributes.color.needsUpdate = true

    // 粒子流效果
    if (animationState.phase >= 2) {
      const flowPositions = flowGeometry.attributes.position.array
      const flowColors = flowGeometry.attributes.color.array

      flowParticles.forEach((particle, i) => {
        const i3 = i * 3

        particle.angle += particle.speed * 0.02
        const newRadius = particle.radius - Math.sin(time + particle.phase) * 2
        particle.phi += Math.cos(time * 0.5 + particle.phase) * 0.005

        flowPositions[i3] = newRadius * Math.sin(particle.phi) * Math.cos(particle.angle)
        flowPositions[i3 + 1] = newRadius * Math.cos(particle.phi)
        flowPositions[i3 + 2] = newRadius * Math.sin(particle.phi) * Math.sin(particle.angle)

        const hue = 0.5 + Math.sin(time + particle.phase) * 0.2
        const color = new THREE.Color().setHSL(hue, 0.9, 0.7)
        flowColors[i3] = color.r
        flowColors[i3 + 1] = color.g
        flowColors[i3 + 2] = color.b
      })

      flowGeometry.attributes.position.needsUpdate = true
      flowGeometry.attributes.color.needsUpdate = true
    }

    // 投影光束效果
    if (animationState.phase >= 2) {
      projectionBeamsArray.forEach((beam, index) => {
        beam.rotation.y = time * (0.15 + index * 0.08)
        beam.material.opacity = 0.25 + Math.sin(time * 3 + index) * 0.2
        beam.scale.y = 1 + Math.sin(time * 2 + index * 0.5) * 0.3
      })
    }

    // 能量波纹环
    if (animationState.phase >= 3) {
      energyRings.forEach((ring, index) => {
        ring.material.opacity = 0.4 + Math.sin(time * 2.5 + index * 0.8) * 0.3
        ring.rotation.z = time * (0.2 + index * 0.1) * (index % 2 === 0 ? 1 : -1)
        ring.scale.setScalar(1 + Math.sin(time + index) * 0.15)
      })
    }

    // 星座连线
    if (animationState.phase >= 3) {
      constellationLines.forEach((constellation, index) => {
        constellation.material.opacity = 0.6 + Math.sin(time * 2 + index) * 0.4
      })
    }

    // 旋转星带
    starBelt.forEach((belt, index) => {
      belt.rotation.z = time * (0.1 + index * 0.05) * (index % 2 === 0 ? 1 : -1)
      belt.material.opacity = 0.3 + Math.sin(time * 1.5 + index) * 0.2
    })

    // 背景星星闪烁
    backgroundStars.forEach((bgStar, index) => {
      bgStar.mesh.material.opacity = (0.3 + Math.sin(time * 2 + index * 0.1) * 0.15) * (3 - bgStar.layerScale / 100)
    })

    // 宇宙旋转
    cosmos.rotation.y = elapsed * 0.1
    cosmos.rotation.x = Math.sin(elapsed * 0.15) * 0.04
  }

  result.fade = function() {
    if (backgroundStars) {
      backgroundStars.forEach(star => {
        if (star.mesh.geometry) star.mesh.geometry.dispose()
        if (star.mesh.material) star.mesh.material.dispose()
        cosmos.remove(star.mesh)
      })
    }

    if (starSystem?.geometry) starSystem.geometry.dispose()
    if (starSystem?.material) starSystem.material.dispose()
    cosmos.remove(starSystem)

    if (flowSystem?.geometry) flowSystem.geometry.dispose()
    if (flowSystem?.material) flowSystem.material.dispose()
    cosmos.remove(flowSystem)

    if (projectionBeamsArray) {
      projectionBeamsArray.forEach(beam => {
        if (beam.geometry) beam.geometry.dispose()
        if (beam.material) beam.material.dispose()
        cosmos.remove(beam)
      })
    }

    if (crystalCore?.geometry) crystalCore.geometry.dispose()
    if (crystalCore?.material) crystalCore.material.dispose()
    cosmos.remove(crystalCore)

    if (glowSphere?.geometry) glowSphere.geometry.dispose()
    if (glowSphere?.material) glowSphere.material.dispose()
    cosmos.remove(glowSphere)

    if (energyRings) {
      energyRings.forEach(ring => {
        if (ring.geometry) ring.geometry.dispose()
        if (ring.material) ring.material.dispose()
        cosmos.remove(ring)
      })
    }

    if (constellationLines) {
      constellationLines.forEach(constellation => {
        if (constellation.line?.geometry) constellation.line.geometry.dispose()
        if (constellation.material) constellation.material.dispose()
        cosmos.remove(constellation.line)
      })
    }

    if (starBelt) {
      starBelt.forEach(belt => {
        if (belt.geometry) belt.geometry.dispose()
        if (belt.material) belt.material.dispose()
        cosmos.remove(belt)
      })
    }

    scene.remove(cosmos)
    animationState.active = false
  }

  return result
}
