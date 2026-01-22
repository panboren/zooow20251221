/**
 * 宇宙超新星 - 宇宙爆炸特效（终极炸裂版）
 * 恒星演化到超新星爆炸的震撼场景
 * 
 * 动画阶段（共18秒）：
 * 1. 恒星形成 - 气体云聚集成恒星（4秒）
 * 2. 恒星稳定 - 恒星主序期，光焰稳定（3秒）
 * 3. 超新星爆发 - 剧烈爆炸，冲击波扩散（5秒）
 * 4. 星云形成 - 爆炸残留形成星云（6秒）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateCosmicSupernova(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 远景
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 150), 70, controls)
    camera.lookAt(0, 20, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-supernova' })
      },
      onError,
      '宇宙超新星',
      controls
    )

    // ==================== 气体云系统 ====================
    const createGasCloud = (count = 8000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 30 + Math.random() * 40

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = radius * Math.cos(phi)

        const hue = 0.55 + Math.random() * 0.15
        const color = new THREE.Color().setHSL(hue, 0.6, 0.3 + Math.random() * 0.3)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

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
        originalPositions: positions.slice(),
        contracting: false,

        start() {
          this.contracting = true
          gsap.to(material, { opacity: 0.6, duration: 2 })
        },

        update(time) {
          if (!this.contracting) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            // 向中心收缩
            const idx = i * 3
            const dist = Math.sqrt(
              positions[idx] ** 2 + 
              positions[idx + 1] ** 2 + 
              positions[idx + 2] ** 2
            )
            
            if (dist > 8) {
              positions[idx] *= 0.995
              positions[idx + 1] *= 0.995
              positions[idx + 2] *= 0.995
            }
          }

          geometry.attributes.position.needsUpdate = true
          points.rotation.y += 0.001
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 恒星系统 ====================
    const createStar = () => {
      const group = new THREE.Group()

      // 恒星核心
      const coreGeometry = new THREE.SphereGeometry(6, 64, 64)
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0
      })
      const core = new THREE.Mesh(coreGeometry, coreMaterial)
      group.add(core)

      // 恒星光晕
      const glowGeometry = new THREE.SphereGeometry(12, 64, 64)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa44,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      group.add(glow)

      // 外层光晕（3层）
      const outerGlows = []
      for (let i = 0; i < 3; i++) {
        const outerGlowGeo = new THREE.SphereGeometry(18 + i * 6, 64, 64)
        const outerGlowMat = new THREE.MeshBasicMaterial({
          color: 0xff8844,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        })
        const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat)
        group.add(outerGlow)
        outerGlows.push({ mesh: outerGlow, material: outerGlowMat })
      }

      // 光焰粒子
      const flameGeometry = new THREE.BufferGeometry()
      const flamePositions = new Float32Array(2000 * 3)
      const flameColors = new Float32Array(2000 * 3)

      for (let i = 0; i < 2000; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 8 + Math.random() * 15

        flamePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        flamePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        flamePositions[i * 3 + 2] = radius * Math.cos(phi)

        const color = new THREE.Color().setHSL(0.08 + Math.random() * 0.05, 1, 0.5 + Math.random() * 0.5)
        flameColors[i * 3] = color.r
        flameColors[i * 3 + 1] = color.g
        flameColors[i * 3 + 2] = color.b
      }

      flameGeometry.setAttribute('position', new THREE.BufferAttribute(flamePositions, 3))
      flameGeometry.setAttribute('color', new THREE.BufferAttribute(flameColors, 3))

      const flameMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      })

      const flames = new THREE.Points(flameGeometry, flameMaterial)
      group.add(flames)

      scene.add(group)

      return {
        group,
        coreMaterial,
        glowMaterial,
        outerGlows,
        flameMaterial,
        flameGeometry,
        visible: false,

        show() {
          this.visible = true
          gsap.to(coreMaterial, { opacity: 1, duration: 1 })
          gsap.to(glowMaterial, { opacity: 0.8, duration: 1.5, delay: 0.3 })
          outerGlows.forEach((g, i) => {
            gsap.to(g.material, { opacity: 0.5 - i * 0.12, duration: 2, delay: 0.5 + i * 0.2 })
          })
          gsap.to(flameMaterial, { opacity: 1, duration: 1.5, delay: 1 })
        },

        update(time) {
          if (this.visible) {
            glow.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
            outerGlows.forEach((g, i) => {
              g.mesh.scale.setScalar(1 + Math.sin(time * (3 + i * 0.5)) * 0.15)
            })

            // 光焰流动
            const positions = flameGeometry.attributes.position.array
            for (let i = 0; i < 2000; i++) {
              const dist = Math.sqrt(
                positions[i * 3] ** 2 + 
                positions[i * 3 + 1] ** 2 + 
                positions[i * 3 + 2] ** 2
              )
              if (dist > 30) {
                const theta = Math.random() * Math.PI * 2
                const phi = Math.acos(2 * Math.random() - 1)
                const r = 8 + Math.random() * 5
                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
                positions[i * 3 + 2] = r * Math.cos(phi)
              }
            }
            flameGeometry.attributes.position.needsUpdate = true
          }
        },

        explode() {
          this.visible = false
          gsap.to(coreMaterial, { opacity: 0, duration: 0.2 })
          gsap.to(glowMaterial, { opacity: 0, duration: 0.3 })
          outerGlows.forEach(g => gsap.to(g.material, { opacity: 0, duration: 0.4 }))
          gsap.to(flameMaterial, { opacity: 0, duration: 0.5 })
        },

        destroy() {
          scene.remove(group)
          coreGeometry.dispose()
          coreMaterial.dispose()
          glowGeometry.dispose()
          glowMaterial.dispose()
          outerGlows.forEach(g => {
            g.mesh.geometry.dispose()
            g.mesh.material.dispose()
          })
          flameGeometry.dispose()
          flameMaterial.dispose()
        }
      }
    }

    // ==================== 超新星爆炸系统 ====================
    const createSupernovaExplosion = () => {
      const explosions = []

      const createShockwave = () => {
        const geometry = new THREE.RingGeometry(0.1, 1, 128)
        const material = new THREE.MeshBasicMaterial({
          color: 0xffaa44,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })
        const ring = new THREE.Mesh(geometry, material)
        ring.rotation.x = Math.PI / 2
        scene.add(ring)

        return {
          mesh: ring,
          material,
          geometry,
          age: 0,
          maxAge: 3,
          active: true,

          update(deltaTime) {
            if (!this.active) return

            this.age += deltaTime
            const scale = 1 + this.age * 80
            this.mesh.scale.set(scale, scale, scale)
            this.material.opacity = Math.max(0, 1 - this.age / this.maxAge)

            if (this.age >= this.maxAge) {
              this.active = false
            }
          },

          destroy() {
            scene.remove(this.mesh)
            this.geometry.dispose()
            this.material.dispose()
          }
        }
      }

      const createExplosionParticles = (count = 25000) => {
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
          const speed = 100 + Math.random() * 200

          velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
          velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
          velocities[i * 3 + 2] = Math.cos(phi) * speed

          const hue = 0.02 + Math.random() * 0.15
          const color = new THREE.Color().setHSL(hue, 1, 0.6 + Math.random() * 0.4)
          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b

          sizes[i] = 1 + Math.random() * 3
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.PointsMaterial({
          size: 2.5,
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
          maxAge: 6,
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
              velocities[i * 3] *= 0.985
              velocities[i * 3 + 1] *= 0.985
              velocities[i * 3 + 2] *= 0.985

              positions[i * 3] += velocities[i * 3] * deltaTime
              positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime
              positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime

              sizes[i] *= 0.995
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

      return {
        shockwaves: [],
        particles: null,
        active: false,

        explode() {
          this.active = true

          // 创建多个冲击波
          for (let i = 0; i < 8; i++) {
            setTimeout(() => {
              this.shockwaves.push(createShockwave())
            }, i * 200)
          }

          // 创建爆炸粒子
          this.particles = createExplosionParticles()
          this.particles.start()
        },

        update(deltaTime) {
          if (!this.active) return

          this.shockwaves.forEach(wave => wave.update(deltaTime))

          // 清理已结束的冲击波
          for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            if (!this.shockwaves[i].active) {
              this.shockwaves[i].destroy()
              this.shockwaves.splice(i, 1)
            }
          }

          if (this.particles) {
            this.particles.update(deltaTime)
          }
        },

        destroy() {
          this.shockwaves.forEach(wave => wave.destroy())
          if (this.particles) this.particles.destroy()
        }
      }
    }

    // ==================== 星云系统 ====================
    const createNebula = (count = 15000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 20 + Math.random() * 60

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = radius * Math.cos(phi)

        const hue = 0.55 + Math.random() * 0.25
        const color = new THREE.Color().setHSL(hue, 0.8, 0.4 + Math.random() * 0.4)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.5 + Math.random() * 1.5
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
        forming: false,

        start() {
          this.forming = true
          gsap.to(material, { opacity: 0.7, duration: 3 })
        },

        update(time) {
          if (!this.forming) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            // 缓慢旋转和扩散
            positions[i * 3] += Math.sin(time + i * 0.01) * 0.02
            positions[i * 3 + 1] += Math.cos(time + i * 0.01) * 0.02
          }

          geometry.attributes.position.needsUpdate = true
          points.rotation.y += 0.0005
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 初始化系统 ====================
    const gasCloud = createGasCloud()
    const star = createStar()
    const supernova = createSupernovaExplosion()
    const nebula = createNebula()

    // ==================== 镜头运动 ====================
    // 阶段1: 恒星形成
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 120,
      duration: 4,
      ease: 'power1.inOut'
    }, 0)
    tl.add(() => camera.lookAt(0, 20, 0), 4)

    // 阶段2: 恒星稳定
    tl.to(camera.position, {
      x: 0,
      y: 25,
      z: 100,
      duration: 3,
      ease: 'power1.inOut'
    }, 4)
    tl.add(() => camera.lookAt(0, 20, 0), 7)

    // 阶段3: 超新星爆发
    tl.to(camera.position, {
      x: 0,
      y: 15,
      z: 80,
      duration: 2,
      ease: 'power2.in'
    }, 7)
    tl.add(() => camera.lookAt(0, 20, 0), 9)
    tl.to(camera.position, {
      x: 0,
      y: 30,
      z: 140,
      duration: 3,
      ease: 'power2.out'
    }, 9)
    tl.add(() => camera.lookAt(0, 20, 0), 12)

    // 阶段4: 星云形成
    tl.to(camera.position, {
      x: 20,
      y: 25,
      z: 110,
      duration: 6,
      ease: 'power1.inOut'
    }, 12)
    tl.add(() => camera.lookAt(0, 15, 0), 18)

    // ==================== 动画时间线 ====================
    tl.call(() => gasCloud.start(), null, 0)
    tl.call(() => star.show(), null, 3)
    tl.call(() => star.explode(), null, 7)
    tl.call(() => supernova.explode(), null, 7.2)
    tl.call(() => nebula.start(), null, 12)

    // ==================== 更新循环 ====================
    const updateHandler = () => {
      const time = Date.now() * 0.001
      const deltaTime = 0.016

      gasCloud.update(time)
      star.update(time)
      supernova.update(deltaTime)
      nebula.update(time)
    }

    // ==================== 清理函数 ====================
    const cleanup = () => {
      gasCloud.destroy()
      star.destroy()
      supernova.destroy()
      nebula.destroy()
    }

    tl.eventCallback('onComplete', cleanup)
    tl.eventCallback('onInterrupt', cleanup)

    return {
      cleanup,
      update: updateHandler
    }

  } catch (error) {
    console.error('宇宙超新星动画错误:', error)
    if (onError) onError(error)
    return { cleanup: () => {}, update: () => {} }
  }
}
