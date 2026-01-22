/**
 * 数字雨 - 赛博朋克矩阵特效（终极绚丽版）
 * 经典的Matrix数字雨，增加故障效果、光晕、多层深度
 * 
 * 动画阶段（共15秒）：
 * 1. 矩阵启动 - 数字流开始下落（3秒）
 * 2. 穿越数据 - 镜头穿越数据流（5秒）
 * 3. 核心解码 - 故障闪烁，代码解密（4秒）
 * 4. 矩阵重构 - 系统重新构建（3秒）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateDigitalRain(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 中远景
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 180), 80, controls)
    camera.lookAt(0, 30, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'digital-rain' })
      },
      onError,
      '数字雨',
      controls
    )

    // ==================== 数字雨系统 ====================
    const createDigitalRain = (options = {}) => {
      const {
        streamCount = 400,
        dropCount = 15000,
        characterSet = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
      } = options

      const streams = []
      const characters = characterSet.split('')
      const colorSchemes = [
        { main: 0x00ff00, glow: 0x00ff88 }, // 经典绿色
        { main: 0x00cc66, glow: 0x66ff99 }, // 亮绿色
        { main: 0x00ffcc, glow: 0xccffff }, // 青绿色
        { main: 0x66ff66, glow: 0xccffcc }  // 浅绿色
      ]

      // 创建数字流
      for (let i = 0; i < streamCount; i++) {
        const stream = {
          x: (Math.random() - 0.5) * 300,
          y: Math.random() * 200 - 100,
          z: (Math.random() - 0.5) * 150,
          speed: 50 + Math.random() * 100,
          characters: [],
          colorIndex: Math.floor(Math.random() * colorSchemes.length),
          phase: Math.random() * Math.PI * 2,
          active: false
        }

        // 每个流有多个字符
        const charCount = 15 + Math.floor(Math.random() * 20)
        for (let j = 0; j < charCount; j++) {
          stream.characters.push({
            char: characters[Math.floor(Math.random() * characters.length)],
            yOffset: j * -2.5,
            opacity: Math.max(0, 1 - j / charCount)
          })
        }

        streams.push(stream)
      }

      // 创建粒子系统
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(dropCount * 3)
      const colors = new Float32Array(dropCount * 3)
      const sizes = new Float32Array(dropCount)

      for (let i = 0; i < dropCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 300
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150

        const colorSet = colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
        const colorObj = new THREE.Color(colorSet.main)
        colors[i * 3] = colorObj.r
        colors[i * 3 + 1] = colorObj.g
        colors[i * 3 + 2] = colorObj.b

        sizes[i] = 0.5 + Math.random() * 1.5
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      return {
        points,
        material,
        geometry,
        streams,
        colors,
        originalPositions: positions.slice(),
        active: false,
        time: 0,

        start() {
          this.active = true
          streams.forEach(stream => stream.active = true)
          gsap.to(material, { opacity: 1, duration: 2 })
        },

        update(deltaTime, time) {
          if (!this.active) return

          this.time += deltaTime
          const positions = geometry.attributes.position.array

          streams.forEach(stream => {
            if (!stream.active) return

            // 更新流的位置
            stream.y -= stream.speed * deltaTime

            // 循环
            if (stream.y < -150) {
              stream.y = 150
              stream.x = (Math.random() - 0.5) * 300
              stream.colorIndex = Math.floor(Math.random() * colorSchemes.length)
            }

            // 故障闪烁
            if (Math.random() < 0.005) {
              stream.x += (Math.random() - 0.5) * 20
            }
          })

          // 更新粒子位置
          for (let i = 0; i < dropCount; i++) {
            const streamIndex = i % streamCount
            const stream = streams[streamIndex]

            if (stream.active) {
              const charIndex = Math.floor(i / streamCount) % stream.characters.length
              const char = stream.characters[charIndex]

              positions[i * 3] = stream.x + Math.sin(time * 2 + i * 0.1) * 2
              positions[i * 3 + 1] = stream.y + char.yOffset
              positions[i * 3 + 2] = stream.z

              // 更新颜色
              const colorSet = colorSchemes[stream.colorIndex]
              const baseColor = new THREE.Color(colorSet.main)
              const glowColor = new THREE.Color(colorSet.glow)
              const mixedColor = baseColor.lerp(glowColor, Math.sin(time * 3 + i * 0.05) * 0.5 + 0.5)

              colors[i * 3] = mixedColor.r
              colors[i * 3 + 1] = mixedColor.g
              colors[i * 3 + 2] = mixedColor.b
            }
          }

          geometry.attributes.position.needsUpdate = true
          geometry.attributes.color.needsUpdate = true
        },

        glitch() {
          // 故障效果
          const positions = geometry.attributes.position.array
          for (let i = 0; i < dropCount; i++) {
            if (Math.random() < 0.1) {
              positions[i * 3] += (Math.random() - 0.5) * 30
              positions[i * 3 + 1] += (Math.random() - 0.5) * 30
            }
          }
          geometry.attributes.position.needsUpdate = true
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 故障方块系统 ====================
    const createGlitchBlocks = (count = 3000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 300
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150

        const brightness = Math.random()
        colors[i * 3] = brightness
        colors[i * 3 + 1] = brightness
        colors[i * 3 + 2] = brightness

        sizes[i] = 2 + Math.random() * 6
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 4,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      return {
        points,
        material,
        geometry,
        active: false,

        start() {
          this.active = true
          gsap.to(material, { opacity: 0.8, duration: 1 })
        },

        glitch() {
          if (!this.active) return

          const positions = geometry.attributes.position.array
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.3) {
              positions[i * 3] = (Math.random() - 0.5) * 300
              positions[i * 3 + 1] = (Math.random() - 0.5) * 200
              positions[i * 3 + 2] = (Math.random() - 0.5) * 150
            }
          }
          geometry.attributes.position.needsUpdate = true

          // 闪烁
          material.opacity = 0.8 * (0.5 + Math.random() * 0.5)
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 光晕环系统 ====================
    const createGlowRings = (count = 8) => {
      const rings = []

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.RingGeometry(
          20 + i * 8,
          25 + i * 8,
          64
        )
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff66,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })

        const ring = new THREE.Mesh(geometry, material)
        ring.rotation.x = Math.PI / 2
        ring.position.y = 30
        scene.add(ring)
        rings.push({ mesh: ring, material, baseScale: 1 })
      }

      return {
        rings,
        active: false,

        start() {
          this.active = true
          rings.forEach((ring, i) => {
            gsap.to(ring.material, { opacity: 0.3 - i * 0.03, duration: 2, delay: i * 0.1 })
          })
        },

        update(time) {
          if (!this.active) return
          rings.forEach((ring, i) => {
            ring.mesh.scale.setScalar(
              ring.baseScale + Math.sin(time * (1 + i * 0.2)) * 0.15
            )
            ring.mesh.rotation.z += 0.001 * (i + 1)
          })
        },

        destroy() {
          rings.forEach(ring => {
            scene.remove(ring.mesh)
            ring.mesh.geometry.dispose()
            ring.mesh.material.dispose()
          })
        }
      }
    }

    // ==================== 初始化系统 ====================
    const digitalRain = createDigitalRain()
    const glitchBlocks = createGlitchBlocks()
    const glowRings = createGlowRings()

    // ==================== 镜头运动 ====================
    // 阶段1: 矩阵启动
    tl.to(camera.position, {
      x: 0,
      y: 50,
      z: 150,
      duration: 3,
      ease: 'power1.inOut'
    }, 0)
    tl.add(() => camera.lookAt(0, 30, 0), 0)

    // 阶段2: 穿越数据
    tl.to(camera.position, {
      x: 30,
      y: 40,
      z: 100,
      duration: 5,
      ease: 'power1.inOut'
    }, 3)
    tl.add(() => camera.lookAt(0, 35, 0), 8)

    // 阶段3: 核心解码
    tl.to(camera.position, {
      x: -20,
      y: 45,
      z: 80,
      duration: 4,
      ease: 'power1.inOut'
    }, 8)
    tl.add(() => camera.lookAt(0, 40, 0), 12)

    // 阶段4: 矩阵重构
    tl.to(camera.position, {
      x: 0,
      y: 55,
      z: 120,
      duration: 3,
      ease: 'power1.inOut'
    }, 12)
    tl.add(() => camera.lookAt(0, 45, 0), 15)

    // ==================== 动画时间线 ====================
    tl.call(() => digitalRain.start(), null, 0.5)
    tl.call(() => glowRings.start(), null, 2)

    // 阶段3: 故障效果
    tl.call(() => glitchBlocks.start(), null, 8)
    tl.to({}, {
      duration: 4,
      onUpdate: () => {
        digitalRain.glitch()
        glitchBlocks.glitch()
      },
      repeat: 4
    }, 8)

    // ==================== 更新循环 ====================
    const updateHandler = () => {
      const time = Date.now() * 0.001
      const deltaTime = 0.016

      digitalRain.update(deltaTime, time)
      glowRings.update(time)
    }

    // ==================== 清理函数 ====================
    const cleanup = () => {
      digitalRain.destroy()
      glitchBlocks.destroy()
      glowRings.destroy()
    }

    tl.eventCallback('onComplete', cleanup)
    tl.eventCallback('onInterrupt', cleanup)

    return {
      cleanup,
      update: updateHandler
    }

  } catch (error) {
    console.error('数字雨动画错误:', error)
    if (onError) onError(error)
    return { cleanup: () => {}, update: () => {} }
  }
}
