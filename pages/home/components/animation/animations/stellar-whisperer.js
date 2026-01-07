/**
 * 星语者特效
 * 模拟星光投影、星座形成与宇宙低语的神秘体验
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
      starCount: 800,
      constellationCount: 3,
      projectionBeams: 6,
      whisperEffect: true
    })

    // 阶段1: 星光初现
    tl.to(camera.position, {
      x: 0,
      y: 40,
      z: 80,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '星光初现错误',
      ),
    })

    // 阶段2: 星座形成
    stellarWhisperer.awaken(6)

    // 阶段3: 星光投影
    tl.to(camera.position, {
      x: 30,
      y: 25,
      z: 50,
      duration: 5,
      ease: 'power3.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(10, 15, 0),
        '星光投影错误',
      ),
    })

    // 持续星光演绎
    let startTime = null
    const duration = 12

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
    starCount = 800,
    constellationCount = 3,
    projectionBeams: beamCount = 6,  // 重命名参数
    whisperEffect = true
  } = options

  // 星空容器
  const cosmos = new THREE.Group()
  scene.add(cosmos)

  // 创建基础星空背景
  const backgroundStars = []
  const bgStarGeometry = new THREE.SphereGeometry(0.3, 8, 8)

  for (let i = 0; i < 200; i++) {
    const starMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.2, 0.3, 0.7),
      transparent: true,
      opacity: 0.4
    })

    const star = new THREE.Mesh(bgStarGeometry, starMaterial)
    star.position.set(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200
    )
    cosmos.add(star)
    backgroundStars.push(star)
  }

  // 创建主要星光系统
  const starGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const sizes = new Float32Array(starCount)

  const stars = []

  // 定义星座形状模板
  const constellations = [
    // 猎户座
    { shape: 'orion', scale: 15, color: 0x4fc3f7, rotation: Math.PI / 4 },
    // 北斗七星
    { shape: 'bigDipper', scale: 12, color: 0x7986cb, rotation: -Math.PI / 6 },
    // 天鹅座
    { shape: 'cygnus', scale: 18, color: 0x81c784, rotation: Math.PI / 3 }
  ]

  // 生成星座星星
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3
    const constellationIndex = i % constellationCount
    const constellation = constellations[constellationIndex]

    // 基于星座形状生成位置
    let x, y, z
    switch(constellation.shape) {
      case 'orion':
        const angle1 = (i / starCount) * Math.PI * 2
        const radius1 = constellation.scale * (0.8 + Math.sin(angle1 * 3) * 0.2)
        const height1 = Math.cos(angle1 * 2) * 5
        x = Math.cos(angle1 + constellation.rotation) * radius1
        y = height1
        z = Math.sin(angle1 + constellation.rotation) * radius1
        break
      case 'bigDipper':
        const angle2 = (i / starCount) * Math.PI * 1.5
        const radius2 = constellation.scale * (0.7 + Math.cos(angle2 * 4) * 0.3)
        const height2 = Math.sin(angle2 * 3) * 8
        x = Math.cos(angle2 + constellation.rotation) * radius2
        y = height2
        z = Math.sin(angle2 + constellation.rotation) * radius2
        break
      case 'cygnus':
        const angle3 = (i / starCount) * Math.PI * 3
        const radius3 = constellation.scale * (0.6 + Math.sin(angle3 * 5) * 0.4)
        const height3 = Math.cos(angle3 * 1.5) * 10
        x = Math.cos(angle3 + constellation.rotation) * radius3
        y = height3
        z = Math.sin(angle3 + constellation.rotation) * radius3
        break
    }

    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z

    // 星座颜色主题
    const color = new THREE.Color(constellation.color)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    sizes[i] = 0.5 + Math.random() * 1.5

    stars.push({
      originalPosition: new THREE.Vector3(x, y, z),
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 1 + Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.5,
      constellationIndex
    })
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const starMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  const starSystem = new THREE.Points(starGeometry, starMaterial)
  cosmos.add(starSystem)

  // 创建星光投影光束 - 修复变量名冲突
  const projectionBeamsArray = []  // 重命名数组变量
  for (let i = 0; i < beamCount; i++) {  // 使用重命名的参数
    const beamGeometry = new THREE.CylinderGeometry(0.3, 1.5, 40, 8)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i * 0.15, 0.8, 0.6),
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)
    const angle = (i / beamCount) * Math.PI * 2
    beam.position.set(
      Math.cos(angle) * 25,
      -15,
      Math.sin(angle) * 25
    )
    beam.rotation.x = Math.PI / 2
    cosmos.add(beam)
    projectionBeamsArray.push(beam)
  }

  // 创建星语核心（水晶）
  const crystalGeometry = new THREE.OctahedronGeometry(6, 0)
  const crystalMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x88ccff,
    shininess: 150,
    transparent: true,
    opacity: 0.8
  })
  const crystalCore = new THREE.Mesh(crystalGeometry, crystalMaterial)
  cosmos.add(crystalCore)

  // 创建星座连线
  const constellationLines = []
  constellations.forEach((constellation, index) => {
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(40 * 3)

    for (let j = 0; j < 40; j++) {
      const progress = j / 39
      const angle = progress * Math.PI * 2
      const radius = constellation.scale * (0.9 + Math.sin(progress * Math.PI) * 0.1)
      const height = Math.sin(progress * Math.PI * 1.5) * 8

      linePositions[j * 3] = Math.cos(angle + constellation.rotation) * radius
      linePositions[j * 3 + 1] = height
      linePositions[j * 3 + 2] = Math.sin(angle + constellation.rotation) * radius
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: constellation.color,
      transparent: true,
      opacity: 0,
      linewidth: 1
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    cosmos.add(line)
    constellationLines.push({ line, material: lineMaterial })
  })

  // 使用更安全的方式返回对象，避免原型链问题
  const result = Object.create(null) // 创建一个纯对象，没有原型链

  // 创建动画状态管理
  const animationState = {
    active: false,
    phase: 0,
    lastUpdate: 0
  }

  // 安全的动画方法
  result.awaken = function(duration) {
    animationState.active = true
    animationState.phase = 1
    animationState.lastUpdate = 0

    // 阶段过渡
    setTimeout(() => { animationState.phase = 2 }, duration * 1000 * 0.4)
    if (whisperEffect) {
      setTimeout(() => { animationState.phase = 3 }, duration * 1000 * 0.7)
    }
  }

  result.whisper = function(deltaTime, elapsed) {
    if (!animationState.active) return

    const time = elapsed * 1.2
    animationState.lastUpdate = time

    // 水晶核心旋转
    crystalCore.rotation.x = time * 0.3
    crystalCore.rotation.y = time * 0.5

    // 星光脉动效果
    const positions = starGeometry.attributes.position.array
    const colors = starGeometry.attributes.color.array

    stars.forEach((star, i) => {
      const i3 = i * 3
      const pulse = Math.sin(time * star.pulseSpeed + star.phase) * 0.5 + 0.5

      // 星光位置浮动
      positions[i3] = star.originalPosition.x + Math.sin(time + i * 0.1) * 0.5
      positions[i3 + 1] = star.originalPosition.y + Math.cos(time * 1.3 + i * 0.05) * 0.3
      positions[i3 + 2] = star.originalPosition.z + Math.sin(time * 0.8 + i * 0.08) * 0.4

      // 亮度变化
      const brightness = star.brightness + pulse * 0.3
      const constellation = constellations[star.constellationIndex]
      const baseColor = new THREE.Color(constellation.color)
      baseColor.multiplyScalar(brightness)

      colors[i3] = baseColor.r
      colors[i3 + 1] = baseColor.g
      colors[i3 + 2] = baseColor.b
    })

    starGeometry.attributes.position.needsUpdate = true
    starGeometry.attributes.color.needsUpdate = true

    // 投影光束效果
    if (animationState.phase >= 2) {
      projectionBeamsArray.forEach((beam, index) => {  // 使用重命名的数组
        beam.rotation.y = time * (0.1 + index * 0.05)
        beam.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.2
      })
    }

    // 星座连线脉动
    if (animationState.phase >= 3) {
      constellationLines.forEach((constellation, index) => {
        constellation.material.opacity = 0.5 + Math.sin(time * 1.5 + index) * 0.3
      })
    }

    // 宇宙缓慢旋转
    cosmos.rotation.y = elapsed * 0.08
    cosmos.rotation.x = Math.sin(elapsed * 0.2) * 0.03
  }

  result.fade = function() {
    // 清理资源
    if (backgroundStars) {
      backgroundStars.forEach(star => {
        if (star.geometry) star.geometry.dispose()
        if (star.material) star.material.dispose()
        cosmos.remove(star)
      })
    }

    if (starSystem?.geometry) starSystem.geometry.dispose()
    if (starSystem?.material) starSystem.material.dispose()
    cosmos.remove(starSystem)

    if (projectionBeamsArray) {  // 使用重命名的数组
      projectionBeamsArray.forEach(beam => {
        if (beam.geometry) beam.geometry.dispose()
        if (beam.material) beam.material.dispose()
        cosmos.remove(beam)
      })
    }

    if (constellationLines) {
      constellationLines.forEach(constellation => {
        if (constellation.line?.geometry) constellation.line.geometry.dispose()
        if (constellation.material) constellation.material.dispose()
        cosmos.remove(constellation.line)
      })
    }

    if (crystalCore?.geometry) crystalCore.geometry.dispose()
    if (crystalCore?.material) crystalCore.material.dispose()
    cosmos.remove(crystalCore)

    scene.remove(cosmos)
    animationState.active = false
  }

  return result
}
