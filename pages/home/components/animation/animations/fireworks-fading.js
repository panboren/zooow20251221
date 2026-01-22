/**
 * 烟花易冷 - 唯美烟花特效（终极动感版）
 *
 * 动画阶段（共25秒）：
 * 1. 夜幕降临 - 星空浮现，月亮升起，天空开始旋转（5秒）
 * 2. 飞碟登场 - 飞碟飞入，光束闪烁（4秒）
 * 3. 烟花绽放 - 多彩烟花慢慢绽放，持续绽放（12秒）
 * 4. 星火飘落 - 烟花碎片飘落（6秒）
 * 5. 寂夜余晖 - 残留星火闪烁（2秒）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateFireworksFading(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 中远景
    setupInitialCamera(camera, new THREE.Vector3(0, 60, 150), 80, controls)
    camera.lookAt(0, 50, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'fireworks-fading' })
      },
      onError,
      '烟花易冷',
      controls
    )

    // ==================== 夜空背景 ====================
    const createNightSky = () => {
      const skyGeometry = new THREE.SphereGeometry(600, 80, 80)
      const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x010105,
        side: THREE.BackSide
      })
      const sky = new THREE.Mesh(skyGeometry, skyMaterial)
      sky.material.opacity = 0
      sky.material.transparent = true
      scene.add(sky)
      return { mesh: sky, material: skyMaterial }
    }

    // ==================== 星空系统 ====================
    const createStarField = (starCount = 12000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(starCount * 3)
      const colors = new Float32Array(starCount * 3)
      const sizes = new Float32Array(starCount)
      const twinkleSpeeds = new Float32Array(starCount)

      for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 400 + Math.random() * 200

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = radius * Math.cos(phi)

        const brightness = 0.4 + Math.random() * 0.6
        const hue = 0.5 + Math.random() * 0.2 // 蓝白紫色调
        const color = new THREE.Color().setHSL(hue, 0.5, brightness)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.2 + Math.random() * 1.3
        twinkleSpeeds[i] = 0.2 + Math.random() * 5
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

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

      return {
        points,
        material,
        geometry,
        twinkleSpeeds,
        originalSizes: sizes.slice(),
        visible: false,

        show() {
          this.visible = true
          gsap.to(material, { opacity: 1, duration: 4 })
        },

        update(time) {
          if (this.visible) {
            const sizes = geometry.attributes.size.array
            for (let i = 0; i < starCount; i++) {
              sizes[i] = this.originalSizes[i] * (0.4 + Math.sin(time * this.twinkleSpeeds[i] * 2) * 0.6)
            }
            geometry.attributes.size.needsUpdate = true
            // 天空加速旋转
            points.rotation.y += 0.0003
            points.rotation.x += 0.00008
          }
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 月亮 ====================
    const createMoon = () => {
      const moonGroup = new THREE.Group()

      // 月球主体
      const moonGeometry = new THREE.SphereGeometry(15, 64, 64)
      const moonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0
      })
      const moon = new THREE.Mesh(moonGeometry, moonMaterial)
      moonGroup.add(moon)

      // 月晕
      const haloGeometry = new THREE.RingGeometry(20, 25, 64)
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

      // 外层月晕（6层）
      const outerHalos = []
      for (let i = 0; i < 6; i++) {
        const outerHaloGeo = new THREE.RingGeometry(28 + i * 6, 33 + i * 6, 64)
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

      moonGroup.position.set(0, 80, -150)
      scene.add(moonGroup)

      return {
        group: moonGroup,
        moonMaterial,
        haloMaterial,
        outerHalos,
        visible: false,

        show() {
          this.visible = true
          gsap.to(moonMaterial, { opacity: 1, duration: 4 })
          gsap.to(haloMaterial, { opacity: 0.5, duration: 4, delay: 0.5 })
          outerHalos.forEach((halo, i) => {
            gsap.to(halo.material, { opacity: 0.3 - i * 0.04, duration: 4, delay: 0.8 + i * 0.2 })
          })
        },

        update(time) {
          if (this.visible) {
            halo.scale.setScalar(1 + Math.sin(time * 0.25) * 0.12)
            outerHalos.forEach((halo, i) => {
              halo.mesh.scale.setScalar(1 + Math.sin(time * (0.25 + i * 0.08)) * 0.18)
            })
            // 月球移动
            group.position.x = Math.sin(time * 0.04) * 8
            group.position.y = 80 + Math.cos(time * 0.03) * 3
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

    // ==================== 飞碟系统 ====================
    const createUFO = () => {
      const ufoGroup = new THREE.Group()

      // 飞碟主体
      const bodyGeometry = new THREE.CylinderGeometry(8, 12, 3, 32)
      const bodyMaterial = new THREE.MeshBasicMaterial({
        color: 0x666688,
        transparent: true,
        opacity: 0
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.rotation.x = Math.PI / 2
      ufoGroup.add(body)

      // 飞碟顶部圆顶
      const domeGeometry = new THREE.SphereGeometry(5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
      const domeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8888aa,
        transparent: true,
        opacity: 0
      })
      const dome = new THREE.Mesh(domeGeometry, domeMaterial)
      dome.rotation.x = -Math.PI / 2
      dome.position.y = 1.5
      ufoGroup.add(dome)

      // 飞碟底部环
      const ringGeometry = new THREE.TorusGeometry(10, 1.5, 16, 48)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x555577,
        transparent: true,
        opacity: 0
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2
      ring.position.y = -1.5
      ufoGroup.add(ring)

      // 飞碟灯光（底部一圈）
      const lights = []
      const lightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]
      for (let i = 0; i < 12; i++) {
        const lightGeometry = new THREE.SphereGeometry(0.8, 16, 16)
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: lightColors[i % lightColors.length],
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        })
        const light = new THREE.Mesh(lightGeometry, lightMaterial)
        const angle = (i / 12) * Math.PI * 2
        light.position.x = Math.cos(angle) * 8
        light.position.z = Math.sin(angle) * 8
        light.position.y = -2.5
        ufoGroup.add(light)
        lights.push({ mesh: light, material: lightMaterial, angle })
      }

      // 光束（从底部射出）
      const beamGeometry = new THREE.ConeGeometry(15, 60, 32, 1, true)
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      beam.rotation.x = Math.PI
      beam.position.y = -33
      ufoGroup.add(beam)

      // 飞碟初始位置（屏幕外）
      ufoGroup.position.set(-200, 100, 50)
      scene.add(ufoGroup)

      return {
        group: ufoGroup,
        bodyMaterial,
        domeMaterial,
        ringMaterial,
        lights,
        beamMaterial,
        visible: false,
        phase: 'approach', // approach, hover, depart

        show() {
          this.visible = true
          // 飞碟飞入
          gsap.to(ufoGroup.position, {
            x: 30,
            y: 80,
            z: 20,
            duration: 3,
            ease: 'power2.out'
          })
          gsap.to(bodyMaterial, { opacity: 1, duration: 2 })
          gsap.to(domeMaterial, { opacity: 1, duration: 2, delay: 0.3 })
          gsap.to(ringMaterial, { opacity: 1, duration: 2, delay: 0.5 })
          lights.forEach((light, i) => {
            gsap.to(light.material, { opacity: 1, duration: 1, delay: 0.5 + i * 0.05 })
          })
        },

        showBeam() {
          gsap.to(beamMaterial, { opacity: 0.6, duration: 1 })
          this.phase = 'hover'
        },

        hideBeam() {
          gsap.to(beamMaterial, { opacity: 0, duration: 1 })
        },

        depart() {
          this.phase = 'depart'
          this.hideBeam()
          gsap.to(ufoGroup.position, {
            x: 250,
            y: 120,
            z: -50,
            duration: 4,
            ease: 'power2.in'
          })
          gsap.to(bodyMaterial, { opacity: 0, duration: 2, delay: 2 })
          gsap.to(domeMaterial, { opacity: 0, duration: 2, delay: 2 })
          gsap.to(ringMaterial, { opacity: 0, duration: 2, delay: 2 })
          lights.forEach((light, i) => {
            gsap.to(light.material, { opacity: 0, duration: 1.5, delay: 2 })
          })
        },

        update(time) {
          if (this.visible) {
            // 悬停时上下浮动
            if (this.phase === 'hover') {
              this.group.position.y = 80 + Math.sin(time * 1.5) * 3
              this.group.position.x = 30 + Math.sin(time * 0.5) * 5
            }

            // 旋转飞碟
            this.group.rotation.y += 0.01

            // 灯光闪烁
            this.lights.forEach((light, i) => {
              const speed = 2 + i * 0.3
              light.material.opacity = 0.5 + Math.sin(time * speed + i) * 0.5
            })

            // 光束闪烁
            if (this.phase === 'hover') {
              beamMaterial.opacity = 0.4 + Math.sin(time * 3) * 0.2
            }
          }
        },

        destroy() {
          scene.remove(ufoGroup)
          bodyGeometry.dispose()
          bodyMaterial.dispose()
          domeGeometry.dispose()
          domeMaterial.dispose()
          ringGeometry.dispose()
          ringMaterial.dispose()
          beamGeometry.dispose()
          beamMaterial.dispose()
          lights.forEach(light => {
            light.mesh.geometry.dispose()
            light.mesh.material.dispose()
          })
        }
      }
    }

    // ==================== 特效光束系统 ====================
    const createLightBeams = () => {
      const beams = []

      const createBeam = (position, color, height = 80) => {
        const beamGeometry = new THREE.ConeGeometry(8, height, 16, 1, true)
        const beamMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })
        const beam = new THREE.Mesh(beamGeometry, beamMaterial)
        beam.position.copy(position)
        beam.rotation.x = Math.PI / 2
        beam.position.z -= height / 2
        scene.add(beam)

        return {
          mesh: beam,
          material: beamMaterial,
          geometry: beamGeometry,
          active: false,

          show() {
            this.active = true
            gsap.to(material, { opacity: 0.5, duration: 1.5 })
          },

          hide() {
            this.active = false
            gsap.to(material, { opacity: 0, duration: 1 })
          },

          update(time) {
            if (this.active) {
              material.opacity = 0.3 + Math.sin(time * 2) * 0.2
            }
          },

          destroy() {
            scene.remove(mesh)
            geometry.dispose()
            material.dispose()
          }
        }
      }

      // 创建多个光束
      const beamConfigs = [
        { pos: new THREE.Vector3(-60, 30, -20), color: 0xff0066 },
        { pos: new THREE.Vector3(60, 40, -30), color: 0x00ccff },
        { pos: new THREE.Vector3(0, 50, -40), color: 0xffcc00 },
        { pos: new THREE.Vector3(-30, 35, -10), color: 0xcc66ff },
        { pos: new THREE.Vector3(30, 45, -25), color: 0x66ff66 }
      ]

      beamConfigs.forEach(config => {
        beams.push(createBeam(config.pos, config.color))
      })

      return {
        beams,
        visible: false,

        show() {
          this.visible = true
          beams.forEach((beam, i) => {
            setTimeout(() => beam.show(), i * 300)
          })
        },

        hide() {
          this.visible = false
          beams.forEach((beam, i) => {
            setTimeout(() => beam.hide(), i * 200)
          })
        },

        update(time) {
          beams.forEach(beam => beam.update(time))
        },

        destroy() {
          beams.forEach(beam => beam.destroy())
        }
      }
    }

    // ==================== 流星系统 ====================
    const createMeteors = (count = 50) => {
      const meteors = []

      const createMeteor = () => {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(3)
        positions[0] = (Math.random() - 0.5) * 400
        positions[1] = 100 + Math.random() * 100
        positions[2] = (Math.random() - 0.5) * 400

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const material = new THREE.PointsMaterial({
          size: 3,
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        })

        const meteor = new THREE.Points(geometry, material)
        scene.add(meteor)

        return {
          mesh: meteor,
          material,
          geometry,
          active: false,
          velocity: new THREE.Vector3(
            -50 - Math.random() * 100,
            -100 - Math.random() * 150,
            50 + Math.random() * 100
          ),
          trail: [],

          activate() {
            this.active = true
            material.opacity = 1

            const pos = geometry.attributes.position.array
            pos[0] = 100 + Math.random() * 200
            pos[1] = 150 + Math.random() * 100
            pos[2] = (Math.random() - 0.5) * 300
            geometry.attributes.position.needsUpdate = true
          },

          update(deltaTime) {
            if (!this.active) return

            const pos = geometry.attributes.position.array
            pos[0] += this.velocity.x * deltaTime
            pos[1] += this.velocity.y * deltaTime
            pos[2] += this.velocity.z * deltaTime

            if (pos[1] < -50 || pos[0] < -200) {
              this.active = false
              material.opacity = 0
            }

            geometry.attributes.position.needsUpdate = true
          },

          destroy() {
            scene.remove(mesh)
            geometry.dispose()
            material.dispose()
          }
        }
      }

      for (let i = 0; i < count; i++) {
        meteors.push(createMeteor())
      }

      return {
        meteors,
        active: false,
        nextMeteorTime: 0,

        start() {
          this.active = true
        },

        update(time, deltaTime) {
          if (!this.active) return

          if (time > this.nextMeteorTime) {
            const inactiveMeteor = this.meteors.find(m => !m.active)
            if (inactiveMeteor) {
              inactiveMeteor.activate()
              this.nextMeteorTime = time + 0.1 + Math.random() * 0.3
            }
          }

          this.meteors.forEach(meteor => meteor.update(deltaTime))
        },

        destroy() {
          this.meteors.forEach(meteor => meteor.destroy())
        }
      }
    }

    // ==================== 彩色烟花系统 ====================
    const createFireworkSystem = () => {
      const fireworks = []

      // 20种五颜六色的配色方案
      const colorPalettes = [
        { colors: [0xff0000, 0xff4444, 0xff8888, 0xffcccc] },
        { colors: [0xff6600, 0xff9933, 0xffcc66, 0xffee99] },
        { colors: [0xffff00, 0xffff66, 0xffffaa, 0xffffdd] },
        { colors: [0x00ff00, 0x44ff44, 0x88ff88, 0xccffcc] },
        { colors: [0x00ffff, 0x66ffff, 0xaaffff, 0xddffff] },
        { colors: [0x0000ff, 0x4444ff, 0x8888ff, 0xccccff] },
        { colors: [0x9900ff, 0xaa44ff, 0xbb88ff, 0xddccff] },
        { colors: [0xff66ff, 0xff99ff, 0xffccff, 0xffeeff] },
        { colors: [0xff0066, 0xff4499, 0xff88cc, 0xffccdd] },
        { colors: [0xffd700, 0xffe033, 0xffeb66, 0xfff599] },
        { colors: [0xc0c0c0, 0xd4d4d4, 0xe8e8e8, 0xfafafa] },
        { colors: [0xff7f50, 0xffa07a, 0xffc4a4, 0xffe2d4] },
        { colors: [0xff00ff, 0xff44ff, 0xff88ff, 0xffccff] },
        { colors: [0x00ff88, 0x44ffaa, 0x88ffcc, 0xccffee] },
        { colors: [0x66ccff, 0x99ddff, 0xcceeff, 0xeeffff] },
        { colors: [0xcc0066, 0xdd4488, 0xee88aa, 0xffaacc] },
        { colors: [0xffaa00, 0xffbb44, 0xffcc88, 0xffddbb] },
        { colors: [0x0088ff, 0x44aaff, 0x88ccff, 0xbbddff] },
        { colors: [0xff66cc, 0xff99dd, 0xffccee, 0xffe6f6] },
        { colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00] }
      ]

      const createExplosion = (position, palette, particleCount = 800) => {
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
          const speed = 20 + Math.random() * 60

          velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
          velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
          velocities[i * 3 + 2] = Math.cos(phi) * speed

          const color = colorObjs[Math.floor(Math.random() * colorObjs.length)]
          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b

          sizes[i] = 1.5 + Math.random() * 3
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

        const flashGeometry = new THREE.RingGeometry(0.1, 0.5, 128)
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
          maxAge: 8 + Math.random() * 3,
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
              velocities[i * 3] *= 0.992
              velocities[i * 3 + 1] *= 0.992
              velocities[i * 3 + 2] *= 0.992
              velocities[i * 3 + 1] += -8 * deltaTime

              positions[i * 3] += velocities[i * 3] * deltaTime
              positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime
              positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime

              sizes[i] *= 0.999
            }

            const flashScale = Math.min(this.age * 50, 80)
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

          if (elapsed < 12) {
            const fireworkInterval = 0.4 + Math.random() * 0.2
            if (Math.floor(elapsed / fireworkInterval) > Math.floor((elapsed - deltaTime) / fireworkInterval)) {
              const position = {
                x: (Math.random() - 0.5) * 200,
                y: 60 + Math.random() * 60,
                z: -100 + (Math.random() - 0.5) * 120
              }
              const palette = this.palettes[Math.floor(Math.random() * this.palettes.length)]
              const particleCount = 600 + Math.floor(Math.random() * 400)
              const explosion = createExplosion(position, palette, particleCount)

              setTimeout(() => explosion.fadeIn(), 100 + Math.random() * 200)
              this.fireworks.push(explosion)

              if (Math.random() < 0.5) {
                const clusterCount = Math.floor(Math.random() * 3) + 2
                for (let j = 0; j < clusterCount; j++) {
                  const pos2 = {
                    x: position.x + (Math.random() - 0.5) * 40,
                    y: position.y + (Math.random() - 0.5) * 30,
                    z: position.z + (Math.random() - 0.5) * 40
                  }
                  const palette2 = this.palettes[Math.floor(Math.random() * this.palettes.length)]
                  const explosion2 = createExplosion(pos2, palette2, 400 + Math.floor(Math.random() * 300))
                  setTimeout(() => explosion2.fadeIn(), 200 + Math.random() * 300)
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

    // ==================== 星火飘落 ====================
    const createSparkles = (count = 12000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      const sparkleColors = [
        new THREE.Color(0xff0066),
        new THREE.Color(0xffcc00),
        new THREE.Color(0x00ccff),
        new THREE.Color(0xcc66ff),
        new THREE.Color(0xff66ff),
        new THREE.Color(0x66ff66),
        new THREE.Color(0x00ff88),
        new THREE.Color(0xffaa00),
        new THREE.Color(0x6666ff),
        new THREE.Color(0xffffff)
      ]

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 300
        positions[i * 3 + 1] = 80 + Math.random() * 80
        positions[i * 3 + 2] = (Math.random() - 0.5) * 300

        velocities[i * 3] = (Math.random() - 0.5) * 6
        velocities[i * 3 + 1] = -5 - Math.random() * 12
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 6

        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.8 + Math.random() * 2.5
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
        velocities,
        falling: false,

        start() {
          this.falling = true
          gsap.to(material, { opacity: 1, duration: 2 })
        },

        update(time, deltaTime) {
          if (!this.falling) return

          const positions = geometry.attributes.position.array
          const sizes = geometry.attributes.size.array

          for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3] * deltaTime * 0.5
            positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime * 0.5
            positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime * 0.5

            velocities[i * 3] += Math.sin(time * 0.3 + i * 0.01) * 0.03
            velocities[i * 3 + 2] += Math.cos(time * 0.3 + i * 0.01) * 0.03

            if (positions[i * 3 + 1] < -60) {
              positions[i * 3] = (Math.random() - 0.5) * 300
              positions[i * 3 + 1] = 80 + Math.random() * 50
              positions[i * 3 + 2] = (Math.random() - 0.5) * 300
            }

            if (Math.random() < 0.02) {
              sizes[i] = 2.5 + Math.random() * 1.5
            } else if (sizes[i] > 0.8) {
              sizes[i] *= 0.999
            }
          }

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

    // ==================== 寂夜余晖 ====================
    const createEmberGlow = (count = 5000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200
        positions[i * 3 + 1] = (Math.random() - 0.5) * 120
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200

        const brightness = 0.3 + Math.random() * 0.7
        const hue = 0.02 + Math.random() * 0.1
        const color = new THREE.Color().setHSL(hue, 0.95, brightness)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b * 0.4

        sizes[i] = 0.4 + Math.random() * 1.2
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

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

      return {
        points,
        material,
        geometry,
        originalSizes: sizes.slice(),
        glowing: false,

        start() {
          this.glowing = true
          gsap.to(material, { opacity: 0.7, duration: 2 })
        },

        update(time) {
          if (!this.glowing) return

          const sizes = geometry.attributes.size.array
          for (let i = 0; i < count; i++) {
            const twinkleSpeed = 0.8 + Math.random() * 2
            sizes[i] = this.originalSizes[i] * (0.3 + Math.sin(time * twinkleSpeed * 3) * 0.7)
          }
          geometry.attributes.size.needsUpdate = true

          points.rotation.y += 0.0004
          points.rotation.x += 0.0001
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    // ==================== 初始化所有系统 ====================
    const nightSky = createNightSky()
    const starField = createStarField()
    const moon = createMoon()
    const ufo = createUFO()
    const lightBeams = createLightBeams()
    const meteors = createMeteors()
    const fireworkSystem = createFireworkSystem()
    const sparkles = createSparkles()
    const emberGlow = createEmberGlow()

    // ==================== 动画时间线 ====================

    // 1. 夜幕降临
    tl.to(nightSky.material, { opacity: 1, duration: 5 })
    tl.call(() => starField.show(), null, 0.5)
    tl.call(() => moon.show(), null, 2)

    // 2. 飞碟登场
    tl.call(() => ufo.show(), null, 5)
    tl.call(() => lightBeams.show(), null, 6)
    tl.call(() => meteors.start(), null, 7)
    tl.call(() => ufo.showBeam(), null, 8)

    // 3. 烟花绽放
    tl.call(() => fireworkSystem.start(), null, 9)
    tl.call(() => lightBeams.hide(), null, 18)
    tl.call(() => ufo.hideBeam(), null, 18)
    tl.call(() => ufo.depart(), null, 19)

    // 4. 星火飘落
    tl.call(() => sparkles.start(), null, 21)

    // 5. 寂夜余晖
    tl.call(() => emberGlow.start(), null, 23)

    // ==================== 更新循环 ====================
    const updateHandler = () => {
      const time = Date.now() * 0.001
      const deltaTime = 0.016

      starField.update(time)
      moon.update(time)
      ufo.update(time)
      lightBeams.update(time)
      meteors.update(time, deltaTime)
      fireworkSystem.update(time, deltaTime)
      sparkles.update(time, deltaTime)
      emberGlow.update(time)
    }

    // ==================== 清理函数 ====================
    const cleanup = () => {
      scene.remove(nightSky.mesh)
      nightSky.mesh.geometry.dispose()
      nightSky.mesh.material.dispose()

      starField.destroy()
      moon.destroy()
      ufo.destroy()
      lightBeams.destroy()
      meteors.destroy()
      fireworkSystem.destroy()
      sparkles.destroy()
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
    console.error('烟花易冷动画错误:', error)
    if (onError) onError(error)
    return { cleanup: () => {}, update: () => {} }
  }
}
