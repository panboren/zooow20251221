/**
 * effects/digital-rain.js
 * 数字雨特效
 * 赛博朋克、黑客帝国风格、代码流动
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建数字雨
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 数字雨对象
 */
export function createDigitalRain(scene, options = {}) {
  const {
    streamCount = 200,
    dropCount = 3000
  } = options

  // 背景网格
  const bgGrid = new THREE.GridHelper(200, 40, 0x001100, 0x000a00)
  bgGrid.position.y = -50
  bgGrid.material.transparent = true
  bgGrid.material.opacity = 0
  scene.add(bgGrid)

  // 数字流
  const streams = []
  const colors = [0x00ff00, 0x00cc00, 0x009900, 0x33ff33, 0x66ff66]

  for (let i = 0; i < streamCount; i++) {
    const geometry = new THREE.BufferGeometry()
    const dropCountInStream = 20 + Math.floor(Math.random() * 30)
    const positions = new Float32Array(dropCountInStream * 3)
    const streamColors = new Float32Array(dropCountInStream * 3)
    const sizes = new Float32Array(dropCountInStream)

    const startX = (Math.random() - 0.5) * 150
    const startZ = (Math.random() - 0.5) * 150
    const speed = 20 + Math.random() * 30
    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])

    for (let j = 0; j < dropCountInStream; j++) {
      positions[j * 3] = startX
      positions[j * 3 + 1] = -60 - j * 5 + Math.random() * 10
      positions[j * 3 + 2] = startZ

      // 头部更亮
      const brightness = 1 - (j / dropCountInStream)
      streamColors[j * 3] = color.r * brightness
      streamColors[j * 3 + 1] = color.g * brightness
      streamColors[j * 3 + 2] = color.b * brightness

      sizes[j] = 1 + (1 - j / dropCountInStream) * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    const stream = new THREE.Points(geometry, material)
    stream.visible = false
    scene.add(stream)

    streams.push({
      mesh: stream,
      positions,
      speed,
      yOffset: Math.random() * 100
    })
  }

  // 代码粒子
  const codeGeometry = new THREE.BufferGeometry()
  const codeCount = 2000
  const codePositions = new Float32Array(codeCount * 3)
  const codeColors = new Float32Array(codeCount * 3)

  for (let i = 0; i < codeCount; i++) {
    codePositions[i * 3] = (Math.random() - 0.5) * 200
    codePositions[i * 3 + 1] = (Math.random() - 0.5) * 120
    codePositions[i * 3 + 2] = (Math.random() - 0.5) * 200

    const color = new THREE.Color().setHSL(0.33, 1, 0.3 + Math.random() * 0.4)
    codeColors[i * 3] = color.r
    codeColors[i * 3 + 1] = color.g
    codeColors[i * 3 + 2] = color.b
  }

  codeGeometry.setAttribute('position', new THREE.BufferAttribute(codePositions, 3))
  codeGeometry.setAttribute('color', new THREE.BufferAttribute(codeColors, 3))

  const codeMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const codeParticles = new THREE.Points(codeGeometry, codeMaterial)
  scene.add(codeParticles)

  // 矩阵框
  const boxGeometry = new THREE.BoxGeometry(180, 120, 180)
  const boxMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const boxEdges = new THREE.EdgesGeometry(boxGeometry)
  const box = new THREE.LineSegments(boxEdges, boxMaterial)
  box.visible = false
  scene.add(box)

  // 核心数据球
  const coreGeometry = new THREE.IcosahedronGeometry(10, 2)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0,
    wireframe: true,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  core.visible = false
  scene.add(core)

  // 能量环
  const rings = []
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.TorusGeometry(15 + i * 5, 0.3, 16, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0
    ring.visible = false
    scene.add(ring)
    rings.push(ring)
  }

  // 灯光
  const greenLight = new THREE.PointLight(0x00ff00, 0, 150)
  greenLight.position.set(0, 0, 0)
  scene.add(greenLight)

  return {
    streams,
    codeParticles,
    codeGeometry,
    box,
    core,
    rings,
    bgGrid,
    greenLight,
    update(deltaTime, time) {
      // 更新数字流
      streams.forEach(stream => {
        if (stream.mesh.visible) {
          const pos = stream.positions
          for (let i = 0; i < pos.length / 3; i++) {
            pos[i * 3 + 1] += stream.speed * deltaTime
            if (pos[i * 3 + 1] > 60) {
              pos[i * 3 + 1] = -60
            }
          }
          stream.mesh.geometry.attributes.position.needsUpdate = true
        }
      })

      // 更新代码粒子
      if (codeMaterial.opacity > 0) {
        const pos = codeGeometry.attributes.position.array
        for (let i = 0; i < codeCount; i++) {
          pos[i * 3 + 1] += Math.sin(time * 3 + i) * deltaTime * 10
        }
        codeGeometry.attributes.position.needsUpdate = true
      }

      // 更新核心
      if (core.visible) {
        core.rotation.x += deltaTime
        core.rotation.y += deltaTime * 0.7
        core.material.opacity = 0.8 + Math.sin(time * 5) * 0.2
      }

      // 更新环
      rings.forEach((ring, i) => {
        if (ring.visible) {
          ring.rotation.z += deltaTime * (1 + i * 0.2)
          ring.rotation.x = Math.PI / 2 + Math.sin(time * 2 + i) * 0.3
          ring.material.opacity = 0.5 + Math.sin(time * 4 + i) * 0.3
        }
      })

      // 灯光脉动
      if (greenLight.intensity > 0) {
        greenLight.intensity = 1 + Math.sin(time * 5) * 0.5
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 背景出现
      gsap.to(bgGrid.material, {
        opacity: 0.3,
        duration: 1
      })

      // 数字流启动
      streams.forEach((stream, i) => {
        gsap.delayedCall(0.5 + i * 0.01, () => {
          stream.mesh.visible = true
          gsap.to(stream.mesh.material, {
            opacity: 1,
            duration: 0.5
          })
        })
      })

      // 代码粒子浮现
      gsap.to(codeMaterial, {
        opacity: 0.6,
        duration: 1.5,
        delay: 1
      })

      // 矩阵框出现
      gsap.delayedCall(2, () => {
        box.visible = true
        gsap.to(box.material, {
          opacity: 0.5,
          duration: 1
        })
      })

      // 核心出现
      gsap.delayedCall(2.5, () => {
        core.visible = true
        gsap.to(core.material, {
          opacity: 1,
          duration: 1
        })
      })

      // 能量环出现
      rings.forEach((ring, i) => {
        gsap.delayedCall(3 + i * 0.15, () => {
          ring.visible = true
          gsap.to(ring.material, {
            opacity: 0.5,
            duration: 0.8
          })
        })
      })

      // 灯光出现
      gsap.to(greenLight, {
        intensity: 1,
        duration: 1,
        delay: 3
      })

      return tl
    },
    destroy() {
      streams.forEach(stream => {
        scene.remove(stream.mesh)
        stream.mesh.geometry.dispose()
        stream.mesh.material.dispose()
      })
      scene.remove(codeParticles)
      scene.remove(box)
      scene.remove(core)
      rings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      scene.remove(bgGrid)
      scene.remove(greenLight)
      codeGeometry.dispose()
      codeMaterial.dispose()
      boxGeometry.dispose()
      boxMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
    }
  }
}
