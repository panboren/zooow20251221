/**
 * DNA双螺旋 - 生命密码特效（终极绚丽版）
 * DNA双螺旋结构，融合粒子效果和量子连接
 * 
 * 动画阶段（共16秒）：
 * 1. 密码苏醒 - DNA粒子开始凝聚（4秒）
 * 2. 螺旋形成 - 双螺旋结构形成（4秒）
 * 3. 量子连接 - 碱基对连接发光（4秒）
 * 4. 基因爆发 - 粒子四散，形成新星（4秒）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateDNAHelix(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 中远景
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 100), 70, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dna-helix' })
      },
      onError,
      'DNA双螺旋',
      controls
    )

    // ==================== DNA粒子系统 ====================
    const createDNAParticles = (count = 15000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)
      const targetPositions = new Float32Array(count * 3)

      // DNA螺旋参数
      const pairCount = 100
      const height = 120
      const radius = 15
      const twistCount = 4

      for (let i = 0; i < count; i++) {
        // 初始位置（散乱）
        positions[i * 3] = (Math.random() - 0.5) * 100
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100

        // 目标位置（螺旋结构）
        const pairIndex = Math.floor(i / (count / (pairCount * 2)))
        const strandIndex = (Math.floor(i / (count / pairCount))) % 2
        const t = pairIndex / pairCount
        const y = (t - 0.5) * height
        const theta = t * twistCount * Math.PI * 2 + (strandIndex ? Math.PI : 0)
        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius

        targetPositions[i * 3] = x + (Math.random() - 0.5) * 3
        targetPositions[i * 3 + 1] = y + (Math.random() - 0.5) * 3
        targetPositions[i * 3 + 2] = z + (Math.random() - 0.5) * 3

        // 颜色
        const hue = strandIndex === 0 ? 0.55 : 0.85 // 蓝色和紫色
        const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.8 + Math.random() * 1.2
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 1.2,
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
        originalPositions: positions.slice(),
        targetPositions,
        forming: false,
        formed: false,
        progress: 0,

        start() {
          this.forming = true
          gsap.to(material, { opacity: 0.9, duration: 2 })
        },

        update(time) {
          if (!this.forming) return

          if (this.progress < 1) {
            this.progress += 0.003
            const p = Math.min(this.progress, 1)

            const positions = geometry.attributes.position.array
            for (let i = 0; i < count; i++) {
              const idx = i * 3
              positions[idx] = this.originalPositions[idx] + 
                (this.targetPositions[idx] - this.originalPositions[idx]) * p
              positions[idx + 1] = this.originalPositions[idx + 1] + 
                (this.targetPositions[idx + 1] - this.originalPositions[idx + 1]) * p
              positions[idx + 2] = this.originalPositions[idx + 2] + 
                (this.targetPositions[idx + 2] - this.originalPositions[idx + 2]) * p
            }
            geometry.attributes.position.needsUpdate = true
          } else if (!this.formed) {
            this.formed = true
          }

          // 螺旋旋转
          points.rotation.y += 0.003
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 碱基对连接系统 ====================
    const createBasePairs = () => {
      const connections = []
      const pairCount = 100

      for (let i = 0; i < pairCount; i++) {
        const t = i / pairCount
        const y = (t - 0.5) * 120
        const theta = t * 4 * Math.PI * 2

        const x1 = Math.cos(theta) * 15
        const z1 = Math.sin(theta) * 15
        const x2 = Math.cos(theta + Math.PI) * 15
        const z2 = Math.sin(theta + Math.PI) * 15

        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array([
          x1, y, z1,
          x2, y, z2
        ])
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const material = new THREE.LineBasicMaterial({
          color: 0x66ffcc,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        })

        const line = new THREE.Line(geometry, material)
        scene.add(line)

        connections.push({
          mesh: line,
          material,
          geometry,
          active: false
        })
      }

      return {
        connections,
        connecting: false,

        start() {
          this.connecting = true
          connections.forEach((conn, i) => {
            setTimeout(() => {
              conn.active = true
              gsap.to(conn.material, { opacity: 0.6, duration: 0.5 })
            }, i * 40)
          })
        },

        update(time) {
          if (this.connecting) {
            connections.forEach(conn => {
              if (conn.active) {
                conn.material.opacity = 0.6 + Math.sin(time * 2) * 0.2
              }
            })
          }
        },

        destroy() {
          connections.forEach(conn => {
            scene.remove(conn.mesh)
            conn.geometry.dispose()
            conn.material.dispose()
          })
        }
      }
    }

    // ==================== 能量脉冲系统 ====================
    const createEnergyPulses = (count = 10) => {
      const pulses = []

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.RingGeometry(
          10,
          12,
          64
        )
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5, 1, 0.6),
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })

        const pulse = new THREE.Mesh(geometry, material)
        pulse.rotation.x = Math.PI / 2
        pulse.position.y = (i / count - 0.5) * 120
        scene.add(pulse)

        pulses.push({
          mesh: pulse,
          material,
          geometry,
          active: false
        })
      }

      return {
        pulses,
        pulsing: false,

        start() {
          this.pulsing = true
          pulses.forEach((pulse, i) => {
            setTimeout(() => {
              pulse.active = true
              gsap.to(pulse.material, { opacity: 0.5, duration: 0.3 })
            }, i * 200)
          })
        },

        update(time) {
          if (this.pulsing) {
            pulses.forEach(pulse => {
              if (pulse.active) {
                const scale = 1 + Math.sin(time * 3) * 0.3
                pulse.mesh.scale.set(scale, scale, scale)
                pulse.material.opacity = 0.5 * (0.7 + Math.sin(time * 3) * 0.3)
              }
            })
          }
        },

        destroy() {
          pulses.forEach(pulse => {
            scene.remove(pulse.mesh)
            pulse.geometry.dispose()
            pulse.material.dispose()
          })
        }
      }
    }

    // ==================== 基因爆发粒子 ====================
    const createGeneBurst = (count = 20000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0

        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const speed = 80 + Math.random() * 120

        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
        velocities[i * 3 + 2] = Math.cos(phi) * speed

        const hue = 0.55 + Math.random() * 0.3
        const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 1 + Math.random() * 2
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
        sizeAttenuation: true,
        depthWrite: false
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      return {
        points,
        material,
        geometry,
        velocities,
        age: 0,
        maxAge: 5,
        active: false,

        start() {
          this.active = true
          gsap.to(material, { opacity: 1, duration: 0.3 })
        },

        update(deltaTime) {
          if (!this.active) return

          this.age += deltaTime
          const lifeRatio = this.age / this.maxAge

          if (lifeRatio >= 1) {
            this.active = false
            gsap.to(material, { opacity: 0, duration: 1 })
            return
          }

          const positions = geometry.attributes.position.array
          const sizes = geometry.attributes.size.array

          for (let i = 0; i < count; i++) {
            velocities[i * 3] *= 0.98
            velocities[i * 3 + 1] *= 0.98
            velocities[i * 3 + 2] *= 0.98

            positions[i * 3] += velocities[i * 3] * deltaTime
            positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime
            positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime

            sizes[i] *= 0.997
          }

          material.opacity = 1 - lifeRatio * lifeRatio
          geometry.attributes.position.needsUpdate = true
          geometry.attributes.size.needsUpdate = true
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 量子连接线 ====================
    const createQuantumLinks = (count = 200) => {
      const lines = []

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(6)
        
        positions[0] = (Math.random() - 0.5) * 60
        positions[1] = (Math.random() - 0.5) * 100
        positions[2] = (Math.random() - 0.5) * 60
        positions[3] = (Math.random() - 0.5) * 60
        positions[4] = (Math.random() - 0.5) * 100
        positions[5] = (Math.random() - 0.5) * 60

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        })

        const line = new THREE.Line(geometry, material)
        scene.add(line)
        lines.push({ mesh: line, material, geometry })
      }

      return {
        lines,
        linking: false,

        start() {
          this.linking = true
          lines.forEach((line, i) => {
            setTimeout(() => {
              gsap.to(line.material, { opacity: 0.3, duration: 0.5 })
            }, i * 30)
          })
        },

        update(time) {
          if (this.linking) {
            lines.forEach(line => {
              line.material.opacity = 0.3 * (0.5 + Math.sin(time * 2 + Math.random()) * 0.5)
            })
          }
        },

        destroy() {
          lines.forEach(line => {
            scene.remove(line.mesh)
            line.geometry.dispose()
            line.material.dispose()
          })
        }
      }
    }

    // ==================== 初始化系统 ====================
    const dnaParticles = createDNAParticles()
    const basePairs = createBasePairs()
    const energyPulses = createEnergyPulses()
    const geneBurst = createGeneBurst()
    const quantumLinks = createQuantumLinks()

    // ==================== 镜头运动 ====================
    // 阶段1: 密码苏醒
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 80,
      duration: 4,
      ease: 'power1.inOut'
    }, 0)

    // 阶段2: 螺旋形成
    tl.to(camera.position, {
      x: 30,
      y: 0,
      z: 60,
      duration: 4,
      ease: 'power1.inOut'
    }, 4)

    // 阶段3: 量子连接
    tl.to(camera.position, {
      x: -30,
      y: 0,
      z: 60,
      duration: 4,
      ease: 'power1.inOut'
    }, 8)

    // 阶段4: 基因爆发
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 90,
      duration: 4,
      ease: 'power1.inOut'
    }, 12)

    // ==================== 动画时间线 ====================
    tl.call(() => dnaParticles.start(), null, 0)
    tl.call(() => basePairs.start(), null, 4)
    tl.call(() => energyPulses.start(), null, 6)
    tl.call(() => quantumLinks.start(), null, 8)
    tl.call(() => geneBurst.start(), null, 12)

    // ==================== 更新循环 ====================
    const updateHandler = () => {
      const time = Date.now() * 0.001
      const deltaTime = 0.016

      dnaParticles.update(time)
      basePairs.update(time)
      energyPulses.update(time)
      geneBurst.update(deltaTime)
      quantumLinks.update(time)
    }

    // ==================== 清理函数 ====================
    const cleanup = () => {
      dnaParticles.destroy()
      basePairs.destroy()
      energyPulses.destroy()
      geneBurst.destroy()
      quantumLinks.destroy()
    }

    tl.eventCallback('onComplete', cleanup)
    tl.eventCallback('onInterrupt', cleanup)

    return {
      cleanup,
      update: updateHandler
    }

  } catch (error) {
    console.error('DNA双螺旋动画错误:', error)
    if (onError) onError(error)
    return { cleanup: () => {}, update: () => {} }
  }
}
