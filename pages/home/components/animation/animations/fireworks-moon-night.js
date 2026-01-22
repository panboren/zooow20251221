/**
 * 烟花月夜 - 综合唯美特效
 * 融合风花雪月与烟花易冷的精华元素
 * 
 * 动画阶段（共20秒）：
 * 1. 星空月升 - 星空浮现，月亮升起（4秒）
 * 2. 风起花开 - 风粒子流动，花瓣绽放（5秒）
 * 3. 烟花绽放 - 多彩烟花慢慢绽放（6秒）
 * 4. 雪落余晖 - 雪花飘落，星火闪烁（5秒）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateFireworksMoonNight(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 远景，仰视角度
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 150), 60, controls)
    camera.lookAt(0, 60, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'fireworks-moon-night' })
      },
      onError,
      '烟花月夜',
      controls
    )

    // ==================== 镜头运动 ====================
    // 阶段1: 仰视月亮，镜头缓慢上升
    tl.to(camera.position, {
      x: 0,
      y: 40,
      z: 130,
      duration: 4,
      ease: 'power1.inOut'
    }, 0)
    tl.add(() => camera.lookAt(0, 70, 0), 0)
    tl.add(() => camera.lookAt(0, 75, 0), 4)

    // 阶段2: 镜头环绕，观察风花
    tl.to(camera.position, {
      x: 30,
      y: 45,
      z: 110,
      duration: 5,
      ease: 'power1.inOut'
    }, 4)
    tl.add(() => camera.lookAt(0, 50, 0), 9)

    // 阶段3: 镜头推近，观察烟花
    tl.to(camera.position, {
      x: 0,
      y: 55,
      z: 90,
      duration: 6,
      ease: 'power1.inOut'
    }, 9)
    tl.add(() => camera.lookAt(0, 60, 0), 15)

    // 阶段4: 镜头俯视，观察雪花
    tl.to(camera.position, {
      x: -20,
      y: 80,
      z: 80,
      duration: 5,
      ease: 'power1.inOut'
    }, 15)
    tl.add(() => camera.lookAt(0, 40, 0), 20)

    // ==================== 星空系统 ====================
    const createStarField = (starCount = 10000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(starCount * 3)
      const colors = new Float32Array(starCount * 3)
      const sizes = new Float32Array(starCount)
      const twinkleSpeeds = new Float32Array(starCount)

      for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 350 + Math.random() * 150

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = radius * Math.cos(phi)

        const brightness = 0.5 + Math.random() * 0.5
        const hue = 0.55 + Math.random() * 0.1
        const color = new THREE.Color().setHSL(hue, 0.4, brightness)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.3 + Math.random() * 1.2
        twinkleSpeeds[i] = 0.3 + Math.random() * 4
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 0.9,
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
        twinkleSpeeds,
        originalSizes: sizes.slice(),
        visible: false,

        show() {
          this.visible = true
          gsap.to(material, { opacity: 1, duration: 3 })
        },

        update(time) {
          if (this.visible) {
            const sizes = geometry.attributes.size.array
            for (let i = 0; i < starCount; i++) {
              sizes[i] = this.originalSizes[i] * (0.5 + Math.sin(time * this.twinkleSpeeds[i] * 2) * 0.5)
            }
            geometry.attributes.size.needsUpdate = true
            points.rotation.y += 0.00025
            points.rotation.x += 0.00006
          }
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 月亮系统 ====================
    const createMoon = () => {
      const moonGroup = new THREE.Group()

      // 月球主体
      const moonGeometry = new THREE.SphereGeometry(14, 64, 64)
      const moonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0
      })
      const moon = new THREE.Mesh(moonGeometry, moonMaterial)
      moonGroup.add(moon)

      // 月晕
      const haloGeometry = new THREE.RingGeometry(18, 22, 64)
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })
      const halo = new THREE.Mesh(haloGeometry, haloMaterial)
      halo.rotation.x = Math.PI / 2
      moonGroup.add(halo)

      // 外层月晕（5层）
      const outerHalos = []
      for (let i = 0; i < 5; i++) {
        const outerHaloGeo = new THREE.RingGeometry(25 + i * 5, 29 + i * 5, 64)
        const outerHaloMat = new THREE.MeshBasicMaterial({
          color: 0xffffee,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })
        const outerHalo = new THREE.Mesh(outerHaloGeo, outerHaloMat)
        outerHalo.rotation.x = Math.PI / 2
        moonGroup.add(outerHalo)
        outerHalos.push({ mesh: outerHalo, material: outerHaloMat })
      }

      moonGroup.position.set(0, 75, -130)
      scene.add(moonGroup)

      return {
        group: moonGroup,
        moonMaterial,
        haloMaterial,
        outerHalos,
        visible: false,

        show() {
          this.visible = true
          gsap.to(moonMaterial, { opacity: 1, duration: 3 })
          gsap.to(haloMaterial, { opacity: 0.45, duration: 3, delay: 0.5 })
          outerHalos.forEach((halo, i) => {
            gsap.to(halo.material, { opacity: 0.28 - i * 0.04, duration: 3, delay: 0.8 + i * 0.2 })
          })
        },

        update(time) {
          if (this.visible) {
            halo.scale.setScalar(1 + Math.sin(time * 0.28) * 0.1)
            outerHalos.forEach((halo, i) => {
              halo.mesh.scale.setScalar(1 + Math.sin(time * (0.28 + i * 0.1)) * 0.14)
            })
            group.position.x = Math.sin(time * 0.045) * 6
            group.position.y = 75 + Math.cos(time * 0.035) * 2.5
          }
        },

        destroy() {
          scene.remove(moonGroup)
          moonGeometry.dispose()
          moonMaterial.dispose()
          haloGeometry.dispose()
          haloMaterial.dispose()
          outerHalos.forEach(halo => {
            halo.mesh.geometry.dispose()
            halo.mesh.material.dispose()
          })
        }
      }
    }

    // ==================== 风粒子系统 ====================
    const createWindParticles = (count = 12000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      const windColors = [
        new THREE.Color(0x66ccff),
        new THREE.Color(0x99ddff),
        new THREE.Color(0x66ffcc),
        new THREE.Color(0xaaffee)
      ]

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 80 + Math.random() * 120

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

        const speed = 15 + Math.random() * 25
        const angle = theta + Math.PI / 2
        velocities[i * 3] = Math.cos(angle) * speed
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 5
        velocities[i * 3 + 2] = Math.sin(angle) * speed

        const color = windColors[Math.floor(Math.random() * windColors.length)]
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.4 + Math.random() * 1
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 0.7,
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
        velocities,
        flowing: false,

        start() {
          this.flowing = true
          gsap.to(material, { opacity: 0.7, duration: 2 })
        },

        update(time, deltaTime) {
          if (!this.flowing) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3] * deltaTime * 0.4
            positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime * 0.3 + Math.sin(time * 2 + i * 0.01) * 0.02
            positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime * 0.4

            // 循环
            const dist = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2)
            if (dist > 200) {
              const theta = Math.random() * Math.PI * 2
              const r = 60 + Math.random() * 40
              positions[i * 3] = Math.cos(theta) * r
              positions[i * 3 + 2] = Math.sin(theta) * r
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

    // ==================== 花瓣系统 ====================
    const createPetals = (count = 15000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)
      const rotations = new Float32Array(count * 3)

      const petalColors = [
        new THREE.Color(0xffb6c1),
        new THREE.Color(0xff69b4),
        new THREE.Color(0xffc0cb),
        new THREE.Color(0xff1493),
        new THREE.Color(0xda70d6),
        new THREE.Color(0xffffff),
        new THREE.Color(0xffa0b4)
      ]

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 180
        positions[i * 3 + 1] = 80 + Math.random() * 60
        positions[i * 3 + 2] = (Math.random() - 0.5) * 180

        velocities[i * 3] = (Math.random() - 0.5) * 4
        velocities[i * 3 + 1] = -3 - Math.random() * 6
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 4

        const color = petalColors[Math.floor(Math.random() * petalColors.length)]
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.8 + Math.random() * 2

        rotations[i * 3] = Math.random() * Math.PI * 2
        rotations[i * 3 + 1] = Math.random() * Math.PI * 2
        rotations[i * 3 + 2] = Math.random() * Math.PI * 2
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 1.5,
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
        velocities,
        falling: false,

        start() {
          this.falling = true
          gsap.to(material, { opacity: 0.85, duration: 2 })
        },

        update(time, deltaTime) {
          if (!this.falling) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3] * deltaTime * 0.5 + Math.sin(time + i * 0.01) * 0.03
            positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime * 0.4
            positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime * 0.5 + Math.cos(time + i * 0.01) * 0.03

            if (positions[i * 3 + 1] < -40) {
              positions[i * 3] = (Math.random() - 0.5) * 180
              positions[i * 3 + 1] = 80 + Math.random() * 40
              positions[i * 3 + 2] = (Math.random() - 0.5) * 180
            }
          }

          geometry.attributes.position.needsUpdate = true
          points.rotation.y += 0.0008
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 烟花系统 ====================
    const createFireworkSystem = () => {
      const fireworks = []

      const colorPalettes = [
        { colors: [0xff0066, 0xff6699, 0xff99bb, 0xffccdd] },
        { colors: [0xffcc00, 0xffee66, 0xffff99, 0xffffcc] },
        { colors: [0x00ccff, 0x66e6ff, 0x99f0ff, 0xccf8ff] },
        { colors: [0xcc66ff, 0xdd99ff, 0xeebbff, 0xffddff] },
        { colors: [0x66ff66, 0x99ff99, 0xccffcc, 0xeeffee] },
        { colors: [0xff66ff, 0xff99ff, 0xffccff, 0xffeeff] },
        { colors: [0xff9966, 0xffbb99, 0xffddcc, 0xffeedd] },
        { colors: [0x6699ff, 0x99bbff, 0xccddff, 0xddeeff] },
        { colors: [0xffaa00, 0xffcc44, 0xffdd77, 0xffeeaa] },
        { colors: [0x00ffaa, 0x44ffcc, 0x88ffdd, 0xbbffee] }
      ]

      const createExplosion = (position, palette, particleCount = 700) => {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const velocities = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)
        const sizes = new Float32Array(particleCount)

        const colorObjs = palette.colors.map(c => new THREE.Color(c))

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] = position.x
          positions[i * 3 + 1] = position.y
          positions[i * 3 + 2] = position.z

          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          const speed = 25 + Math.random() * 55

          velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
          velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
          velocities[i * 3 + 2] = Math.cos(phi) * speed

          const color = colorObjs[Math.floor(Math.random() * colorObjs.length)]
          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b

          sizes[i] = 1.2 + Math.random() * 2.5
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

        const flashGeometry = new THREE.RingGeometry(0.1, 0.5, 96)
        const flashMaterial = new THREE.MeshBasicMaterial({
          color: colorObjs[0],
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })
        const flash = new THREE.Mesh(flashGeometry, flashMaterial)
        flash.position.copy(position)
        flash.rotation.x = Math.PI / 2
        scene.add(flash)

        const explosion = {
          points,
          material,
          flash,
          flashMaterial,
          geometry,
          velocities,
          age: 0,
          maxAge: 7 + Math.random() * 2.5,
          active: false,

          fadeIn() {
            gsap.to(material, { opacity: 1, duration: 2 })
            gsap.to(flashMaterial, { opacity: 1, duration: 0.3 })
            this.active = true
          },

          update(deltaTime) {
            if (!this.active) return

            this.age += deltaTime
            const lifeRatio = this.age / this.maxAge

            if (lifeRatio > 0.6) {
              const fadeOutRatio = (lifeRatio - 0.6) / 0.4
              material.opacity = 1 - fadeOutRatio * fadeOutRatio
            }

            if (lifeRatio >= 1) {
              this.active = false
              gsap.to(material, { opacity: 0, duration: 1.5 })
              gsap.to(flashMaterial, { opacity: 0, duration: 1.5 })
              return
            }

            const positions = geometry.attributes.position.array
            const sizes = geometry.attributes.size.array

            for (let i = 0; i < particleCount; i++) {
              velocities[i * 3] *= 0.993
              velocities[i * 3 + 1] *= 0.993
              velocities[i * 3 + 2] *= 0.993
              velocities[i * 3 + 1] += -7 * deltaTime

              positions[i * 3] += velocities[i * 3] * deltaTime
              positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime
              positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime

              sizes[i] *= 0.9985
            }

            const flashScale = Math.min(this.age * 45, 70)
            flash.scale.set(flashScale, flashScale, 1)
            flashMaterial.opacity = Math.max(0, 1 - this.age * 0.8)

            geometry.attributes.position.needsUpdate = true
            geometry.attributes.size.needsUpdate = true
          },

          destroy() {
            scene.remove(points)
            scene.remove(flash)
            geometry.dispose()
            material.dispose()
            flashGeometry.dispose()
            flashMaterial.dispose()
          }
        }

        return explosion
      }

      return {
        fireworks,
        palettes: colorPalettes,
        exploding: false,
        startTime: 0,

        start() {
          this.exploding = true
          this.startTime = Date.now()
        },

        update(time, deltaTime) {
          if (!this.exploding) return

          const elapsed = (Date.now() - this.startTime) / 1000

          if (elapsed < 6) {
            const fireworkInterval = 0.45 + Math.random() * 0.25
            if (Math.floor(elapsed / fireworkInterval) > Math.floor((elapsed - deltaTime) / fireworkInterval)) {
              const position = {
                x: (Math.random() - 0.5) * 180,
                y: 55 + Math.random() * 55,
                z: -90 + (Math.random() - 0.5) * 110
              }
              const palette = this.palettes[Math.floor(Math.random() * this.palettes.length)]
              const particleCount = 500 + Math.floor(Math.random() * 350)
              const explosion = createExplosion(position, palette, particleCount)

              setTimeout(() => explosion.fadeIn(), 120 + Math.random() * 250)
              this.fireworks.push(explosion)

              if (Math.random() < 0.45) {
                const clusterCount = Math.floor(Math.random() * 3) + 2
                for (let j = 0; j < clusterCount; j++) {
                  const pos2 = {
                    x: position.x + (Math.random() - 0.5) * 35,
                    y: position.y + (Math.random() - 0.5) * 28,
                    z: position.z + (Math.random() - 0.5) * 35
                  }
                  const palette2 = this.palettes[Math.floor(Math.random() * this.palettes.length)]
                  const explosion2 = createExplosion(pos2, palette2, 350 + Math.floor(Math.random() * 250))
                  setTimeout(() => explosion2.fadeIn(), 220 + Math.random() * 320)
                  this.fireworks.push(explosion2)
                }
              }
            }
          }

          this.fireworks.forEach(firework => firework.update(deltaTime))

          for (let i = this.fireworks.length - 1; i >= 0; i--) {
            if (!this.fireworks[i].active && this.fireworks[i].material.opacity <= 0) {
              this.fireworks[i].destroy()
              this.fireworks.splice(i, 1)
            }
          }
        },

        destroy() {
          this.fireworks.forEach(firework => firework.destroy())
          this.fireworks = []
        }
      }
    }

    // ==================== 雪花系统 ====================
    const createSnowflakes = (count = 15000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 250
        positions[i * 3 + 1] = 70 + Math.random() * 70
        positions[i * 3 + 2] = (Math.random() - 0.5) * 250

        velocities[i * 3] = (Math.random() - 0.5) * 3
        velocities[i * 3 + 1] = -4 - Math.random() * 10
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 3

        sizes[i] = 0.5 + Math.random() * 2
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 1.1,
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
        velocities,
        falling: false,

        start() {
          this.falling = true
          gsap.to(material, { opacity: 0.9, duration: 2 })
        },

        update(time, deltaTime) {
          if (!this.falling) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3] * deltaTime * 0.45 + Math.sin(time * 0.8 + i * 0.01) * 0.02
            positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime * 0.35
            positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime * 0.45 + Math.cos(time * 0.8 + i * 0.01) * 0.02

            if (positions[i * 3 + 1] < -50) {
              positions[i * 3] = (Math.random() - 0.5) * 250
              positions[i * 3 + 1] = 70 + Math.random() * 45
              positions[i * 3 + 2] = (Math.random() - 0.5) * 250
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

    // ==================== 星火余晖 ====================
    const createEmberGlow = (count = 4000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 180
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100
        positions[i * 3 + 2] = (Math.random() - 0.5) * 180

        const brightness = 0.35 + Math.random() * 0.65
        const hue = 0.03 + Math.random() * 0.09
        const color = new THREE.Color().setHSL(hue, 0.92, brightness)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b * 0.45

        sizes[i] = 0.4 + Math.random() * 1.1
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 0.85,
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
        originalSizes: sizes.slice(),
        glowing: false,

        start() {
          this.glowing = true
          gsap.to(material, { opacity: 0.75, duration: 2 })
        },

        update(time) {
          if (!this.glowing) return

          const sizes = geometry.attributes.size.array
          for (let i = 0; i < count; i++) {
            const twinkleSpeed = 0.85 + Math.random() * 2.2
            sizes[i] = this.originalSizes[i] * (0.35 + Math.sin(time * twinkleSpeed * 3) * 0.65)
          }
          geometry.attributes.size.needsUpdate = true

          points.rotation.y += 0.00035
          points.rotation.x += 0.00009
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 初始化所有系统 ====================
    const starField = createStarField()
    const moon = createMoon()
    const windParticles = createWindParticles()
    const petals = createPetals()
    const fireworkSystem = createFireworkSystem()
    const snowflakes = createSnowflakes()
    const emberGlow = createEmberGlow()

    // ==================== 动画时间线 ====================

    // 阶段1: 星空月升
    tl.call(() => starField.show(), null, 0)
    tl.call(() => moon.show(), null, 1)

    // 阶段2: 风起花开
    tl.call(() => windParticles.start(), null, 4)
    tl.call(() => petals.start(), null, 5)

    // 阶段3: 烟花绽放
    tl.call(() => fireworkSystem.start(), null, 9)

    // 阶段4: 雪落余晖
    tl.call(() => snowflakes.start(), null, 15)
    tl.call(() => emberGlow.start(), null, 18)

    // ==================== 更新循环 ====================
    const updateHandler = () => {
      const time = Date.now() * 0.001
      const deltaTime = 0.016

      starField.update(time)
      moon.update(time)
      windParticles.update(time, deltaTime)
      petals.update(time, deltaTime)
      fireworkSystem.update(time, deltaTime)
      snowflakes.update(time, deltaTime)
      emberGlow.update(time)
    }

    // ==================== 清理函数 ====================
    const cleanup = () => {
      starField.destroy()
      moon.destroy()
      windParticles.destroy()
      petals.destroy()
      fireworkSystem.destroy()
      snowflakes.destroy()
      emberGlow.destroy()
    }

    // 注册清理函数
    tl.eventCallback('onComplete', () => {
      cleanup()
    })

    // 错误处理
    tl.eventCallback('onInterrupt', () => {
      cleanup()
    })

    return {
      cleanup,
      update: updateHandler
    }

  } catch (error) {
    console.error('烟花月夜动画错误:', error)
    if (onError) onError(error)
    return { cleanup: () => {}, update: () => {} }
  }
}
