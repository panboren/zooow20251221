/**
 * 青春年华 - 唯美青春特效（终极升级版）
 * 融合青春图片、绚丽粒子、唯美光效、动态元素，展现青春活力与美好
 *
 * 动画阶段（共20秒）：
 * 1. 晨曦微露 - 青春记忆渐显（4秒）
 * 2. 花季绽放 - 粒子飞舞绽放（5秒）
 * 3. 热血青春 - 激情迸发（6秒）
 * 4. 永恒记忆 - 画面定格（5秒）
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateYouthfulYears(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 中远景
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 120), 70, controls)
    camera.lookAt(0, 30, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'youthful-years' })
      },
      onError,
      '青春年华',
      controls
    )

    // ==================== 镜头运动 ====================
    // 阶段1: 缓慢上升
    tl.to(camera.position, {
      x: 20,
      y: 50,
      z: 110,
      duration: 4,
      ease: 'power1.inOut'
    }, 0)
    tl.add(() => camera.lookAt(0, 40, 0), 4)

    // 阶段2: 环绕观察
    tl.to(camera.position, {
      x: -20,
      y: 45,
      z: 100,
      duration: 5,
      ease: 'power1.inOut'
    }, 4)
    tl.add(() => camera.lookAt(0, 35, 0), 9)

    // 阶段3: 推近观察
    tl.to(camera.position, {
      x: 0,
      y: 55,
      z: 85,
      duration: 6,
      ease: 'power1.inOut'
    }, 9)
    tl.add(() => camera.lookAt(0, 45, 0), 15)

    // 阶段4: 升华远景
    tl.to(camera.position, {
      x: 0,
      y: 70,
      z: 120,
      duration: 5,
      ease: 'power1.inOut'
    }, 15)
    tl.add(() => camera.lookAt(0, 30, 0), 20)

    // ==================== 青春图片漂浮系统（增强版）====================
    const createFloatingImages = () => {

      let url='https://zooow-1258443890.cos.ap-guangzhou.myqcloud.com/assets-image'

      const imageUrls = [`${url}/1.png`, `${url}/2.png`,`${url}/3.png`,`${url}/4.png`,`${url}/5.png`,`${url}/6.png`]
      const imageMeshes = []




      // 每个图片创建多个副本
      imageUrls.forEach((url, index) => {
        const loader = new THREE.TextureLoader()
        loader.load(url, (texture) => {
          // 每个图片创建3个副本，增加丰富度
          for (let copy = 0; copy < 3; copy++) {
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
              blending: THREE.NormalBlending
            })

            const geometry = new THREE.PlaneGeometry(12 + copy * 3, 8 + copy * 2)
            const mesh = new THREE.Mesh(geometry, material)

            // 随机位置
            mesh.position.x = (Math.random() - 0.5) * 120
            mesh.position.y = (Math.random() - 0.5) * 80 + 40
            mesh.position.z = (Math.random() - 0.5) * 80

            // 随机旋转
            mesh.rotation.x = (Math.random() - 0.5) * 0.4
            mesh.rotation.y = (Math.random() - 0.5) * 0.4
            mesh.rotation.z = (Math.random() - 0.5) * 0.4

            mesh.userData = {
              initialY: mesh.position.y,
              floatSpeed: 0.6 + Math.random() * 0.6,
              floatAmplitude: 4 + Math.random() * 6,
              floatPhase: Math.random() * Math.PI * 2,
              rotateSpeed: 0.2 + Math.random() * 0.3,
              orbitSpeed: 0.1 + Math.random() * 0.2,
              orbitRadius: 10 + Math.random() * 20,
              orbitCenterX: mesh.position.x,
              orbitCenterZ: mesh.position.z
            }

            scene.add(mesh)
            imageMeshes.push(mesh)
          }
        })
      })

      return {
        imageMeshes,

        fadeIn(duration = 2) {
          imageMeshes.forEach((mesh, index) => {
            gsap.to(mesh.material, {
              opacity: 0.7,
              duration: duration,
              delay: index * 0.05,
              ease: 'power2.out'
            })
          })
        },

        update(time) {
          imageMeshes.forEach(mesh => {
            // 漂浮动画
            mesh.position.y = mesh.userData.initialY +
              Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatPhase) * mesh.userData.floatAmplitude

            // 环绕动画
            const orbitAngle = time * mesh.userData.orbitSpeed
            mesh.position.x = mesh.userData.orbitCenterX +
              Math.cos(orbitAngle) * mesh.userData.orbitRadius
            mesh.position.z = mesh.userData.orbitCenterZ +
              Math.sin(orbitAngle) * mesh.userData.orbitRadius

            // 旋转动画
            mesh.rotation.x += mesh.userData.rotateSpeed * 0.01
            mesh.rotation.y += mesh.userData.rotateSpeed * 0.01
            mesh.rotation.z += mesh.userData.rotateSpeed * 0.005
          })
        },

        pulse() {
          imageMeshes.forEach(mesh => {
            const currentOpacity = mesh.material.opacity
            gsap.to(mesh.material, {
              opacity: currentOpacity * 0.8,
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: 'power1.inOut'
            })
          })
        },

        spin() {
          imageMeshes.forEach(mesh => {
            gsap.to(mesh.rotation, {
              y: mesh.rotation.y + Math.PI * 2,
              duration: 2 + Math.random(),
              ease: 'power2.inOut'
            })
          })
        },

        fadeOut(duration = 2) {
          imageMeshes.forEach((mesh, index) => {
            gsap.to(mesh.material, {
              opacity: 0,
              duration: duration,
              delay: index * 0.02,
              ease: 'power2.in'
            })
          })
        },

        destroy() {
          imageMeshes.forEach(mesh => {
            scene.remove(mesh)
            mesh.geometry.dispose()
            mesh.material.dispose()
            if (mesh.material.map) mesh.material.map.dispose()
          })
        }
      }
    }

    const floatingImages = createFloatingImages()

    // ==================== 绚丽花瓣系统（大幅增强）====================
    const createColorfulPetals = (count = 35000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)
      const velocities = []

      // 更丰富的青春色系
      const colorPalettes = [
        [1.0, 0.5, 0.7],  // 深粉色
        [1.0, 0.7, 0.8],  // 浅粉色
        [1.0, 0.6, 0.4],  // 橙粉色
        [1.0, 0.8, 0.5],  // 金橙色
        [0.9, 0.5, 1.0],  // 紫粉色
        [0.8, 0.6, 1.0],  // 浅紫色
        [0.4, 0.9, 1.0],  // 天青色
        [0.6, 0.8, 1.0],  // 淡蓝色
        [1.0, 0.95, 0.4], // 金黄色
        [1.0, 0.85, 0.6], // 蜜桃色
        [1.0, 0.75, 0.8], // 珊瑚粉
        [0.9, 0.7, 0.5]   // 暖杏色
      ]

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 250
        positions[i * 3 + 1] = (Math.random() - 0.5) * 180 + 50
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150

        const color = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
        colors[i * 3] = color[0]
        colors[i * 3 + 1] = color[1]
        colors[i * 3 + 2] = color[2]

        sizes[i] = 0.8 + Math.random() * 3.5

        velocities.push({
          x: (Math.random() - 0.5) * 25,
          y: -12 - Math.random() * 35,
          z: (Math.random() - 0.5) * 12,
          rotSpeed: Math.random() * 3
        })
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: true,
        sizeAttenuation: true
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      return {
        points,
        material,
        geometry,
        velocities,
        originalPositions: positions.slice(),
        active: false,

        start(duration = 2) {
          this.active = true
          gsap.to(material, { opacity: 0.7, duration: duration, ease: 'power2.out' })
        },

        update(deltaTime, time) {
          if (!this.active) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            const vel = velocities[i]

            // 飘落
            positions[i * 3] += vel.x * deltaTime
            positions[i * 3 + 1] += vel.y * deltaTime
            positions[i * 3 + 2] += vel.z * deltaTime

            // 飘动效果 - 更强烈的摆动
            positions[i * 3] += Math.sin(time * 3 + i * 0.015) * 0.8
            positions[i * 3 + 2] += Math.cos(time * 2 + i * 0.01) * 0.5

            // 循环
            if (positions[i * 3 + 1] < -100) {
              positions[i * 3 + 1] = 120 + Math.random() * 60
              positions[i * 3] = (Math.random() - 0.5) * 250
              positions[i * 3 + 2] = (Math.random() - 0.5) * 150
            }
          }

          geometry.attributes.position.needsUpdate = true
        },

        burst() {
          const positions = geometry.attributes.position.array
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.4) {
              positions[i * 3] += (Math.random() - 0.5) * 60
              positions[i * 3 + 1] += Math.random() * 40
              positions[i * 3 + 2] += (Math.random() - 0.5) * 60
            }
          }
          geometry.attributes.position.needsUpdate = true
        },

        colorWave() {
          const colors = geometry.attributes.color.array
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.3) {
              const color = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
              colors[i * 3] = color[0]
              colors[i * 3 + 1] = color[1]
              colors[i * 3 + 2] = color[2]
            }
          }
          geometry.attributes.color.needsUpdate = true
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    const petals = createColorfulPetals(35000)

    // ==================== 梦幻光晕系统（增强版）====================
    const createDreamyHalos = (count = 12) => {
      const halos = []
      const colors = [0xff69b4, 0xffa500, 0x9932cc, 0x00ced1, 0xffd700,
                      0xff6347, 0x7b68ee, 0x20b2aa, 0xff1493, 0x00bfff,
                      0xff4500, 0xba55d3]

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.RingGeometry(12, 28, 64)
        const material = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending
        })

        const ring = new THREE.Mesh(geometry, material)
        ring.position.x = (Math.random() - 0.5) * 100
        ring.position.y = (Math.random() - 0.5) * 70 + 45
        ring.position.z = (Math.random() - 0.5) * 50 - 30

        ring.rotation.x = Math.random() * Math.PI * 0.4
        ring.rotation.z = Math.random() * Math.PI * 0.4

        ring.userData = {
          pulseSpeed: 0.6 + Math.random() * 1.2,
          pulsePhase: Math.random() * Math.PI * 2,
          rotateSpeed: 0.15 + Math.random() * 0.35,
          orbitRadius: 5 + Math.random() * 15,
          orbitSpeed: 0.05 + Math.random() * 0.15,
          orbitCenterX: ring.position.x,
          orbitCenterZ: ring.position.z
        }

        scene.add(ring)
        halos.push(ring)
      }

      return {
        halos,

        fadeIn(duration = 2) {
          halos.forEach((halo, index) => {
            gsap.to(halo.material, {
              opacity: 0.3,
              duration: duration,
              delay: index * 0.15,
              ease: 'power2.out'
            })
          })
        },

        update(time) {
          halos.forEach(halo => {
            // 脉冲动画
            const scale = 1 + Math.sin(time * halo.userData.pulseSpeed + halo.userData.pulsePhase) * 0.18
            halo.scale.set(scale, scale, scale)

            // 旋转动画
            halo.rotation.z += halo.userData.rotateSpeed * 0.02

            // 环绕动画
            const orbitAngle = time * halo.userData.orbitSpeed
            halo.position.x = halo.userData.orbitCenterX +
              Math.cos(orbitAngle) * halo.userData.orbitRadius
            halo.position.z = halo.userData.orbitCenterZ +
              Math.sin(orbitAngle) * halo.userData.orbitRadius
          })
        },

        flash() {
          halos.forEach(halo => {
            const currentOpacity = halo.material.opacity
            gsap.to(halo.material, {
              opacity: currentOpacity * 2.5,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: 'power1.inOut'
            })
          })
        },

        expand() {
          halos.forEach(halo => {
            const currentScale = halo.scale.x
            gsap.to(halo.scale, {
              x: currentScale * 1.8,
              y: currentScale * 1.8,
              z: currentScale * 1.8,
              duration: 0.8,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut'
            })
          })
        },

        fadeOut(duration = 2) {
          halos.forEach((halo, index) => {
            gsap.to(halo.material, {
              opacity: 0,
              duration: duration,
              delay: index * 0.1,
              ease: 'power2.in'
            })
          })
        },

        destroy() {
          halos.forEach(halo => {
            scene.remove(halo)
            halo.geometry.dispose()
            halo.material.dispose()
          })
        }
      }
    }

    const dreamyHalos = createDreamyHalos(12)

    // ==================== 星光粒子系统（增强版）====================
    const createStarParticles = (count = 25000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      // 金色、白色、粉色星光
      const starColors = [
        [1.0, 0.85, 0.3],  // 金色
        [1.0, 1.0, 0.9],   // 白色
        [1.0, 0.6, 0.8],   // 粉色
        [0.9, 0.7, 1.0],   // 淡紫色
        [1.0, 0.8, 0.6]    // 暖黄色
      ]

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 300
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200 + 50
        positions[i * 3 + 2] = (Math.random() - 0.5) * 180

        const color = starColors[Math.floor(Math.random() * starColors.length)]
        colors[i * 3] = color[0]
        colors[i * 3 + 1] = color[1]
        colors[i * 3 + 2] = color[2]

        sizes[i] = 0.5 + Math.random() * 2.5
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: true,
        sizeAttenuation: true
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      return {
        points,
        material,
        geometry,
        originalPositions: positions.slice(),
        active: false,
        time: 0,

        start(duration = 2) {
          this.active = true
          gsap.to(material, { opacity: 0.6, duration: duration, ease: 'power2.out' })
        },

        update(deltaTime, time) {
          if (!this.active) return

          this.time += deltaTime
          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            // 缓慢旋转 - 更快的旋转速度
            const angle = time * 0.08
            const x = positions[i * 3]
            const y = positions[i * 3 + 1]
            const z = positions[i * 3 + 2]

            positions[i * 3] = x * Math.cos(angle * 0.5) - z * Math.sin(angle * 0.5)
            positions[i * 3 + 2] = x * Math.sin(angle * 0.5) + z * Math.cos(angle * 0.5)

            // 闪烁效果
            if (Math.random() < 0.015) {
              sizes[i] = 0.5 + Math.random() * 2.5
            }
          }

          geometry.attributes.position.needsUpdate = true
          geometry.attributes.size.needsUpdate = true
        },

        sparkle() {
          const sizes = geometry.attributes.size.array
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.3) {
              sizes[i] = 2 + Math.random() * 4
            }
          }
          geometry.attributes.size.needsUpdate = true
        },

        colorShift() {
          const colors = geometry.attributes.color.array
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.15) {
              const color = starColors[Math.floor(Math.random() * starColors.length)]
              colors[i * 3] = color[0]
              colors[i * 3 + 1] = color[1]
              colors[i * 3 + 2] = color[2]
            }
          }
          geometry.attributes.color.needsUpdate = true
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    const starParticles = createStarParticles(25000)

    // ==================== 青春光束系统（增强版）====================
    const createYouthBeams = (count = 10) => {
      const beams = []
      const colors = [0xff69b4, 0xffa500, 0x9932cc, 0x00ced1, 0xffd700,
                      0xff6347, 0x7b68ee, 0x20b2aa, 0xff1493, 0x00bfff]

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.CylinderGeometry(0.4, 2.5, 160, 32)
        const material = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0,
          blending: THREE.NormalBlending
        })

        const beam = new THREE.Mesh(geometry, material)
        beam.position.x = (Math.random() - 0.5) * 110
        beam.position.y = 85
        beam.position.z = (Math.random() - 0.5) * 90 - 40

        beam.userData = {
          baseY: beam.position.y,
          pulseSpeed: 1.0 + Math.random() * 0.8,
          pulsePhase: Math.random() * Math.PI * 2,
          rotateSpeed: 0.1 + Math.random() * 0.2
        }

        scene.add(beam)
        beams.push(beam)
      }

      return {
        beams,

        fadeIn(duration = 2) {
          beams.forEach((beam, index) => {
            gsap.to(beam.material, {
              opacity: 0.35,
              duration: duration,
              delay: index * 0.2,
              ease: 'power2.out'
            })
          })
        },

        update(time) {
          beams.forEach(beam => {
            // 脉冲动画
            const scaleY = 1 + Math.sin(time * beam.userData.pulseSpeed + beam.userData.pulsePhase) * 0.25
            beam.scale.set(1, scaleY, 1)

            // 旋转动画
            beam.rotation.y += beam.userData.rotateSpeed * 0.01

            // 颜色闪烁
            const opacity = 0.25 + Math.sin(time * 2.5 + beam.userData.pulsePhase) * 0.15
            beam.material.opacity = opacity
          })
        },

        shoot() {
          beams.forEach(beam => {
            const currentScale = beam.scale.y
            gsap.to(beam.scale, {
              y: currentScale * 2,
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut'
            })
          })
        },

        wave() {
          beams.forEach((beam, index) => {
            gsap.to(beam.rotation, {
              z: beam.rotation.z + Math.PI * 0.5,
              duration: 1 + index * 0.1,
              ease: 'power2.inOut'
            })
          })
        },

        fadeOut(duration = 2) {
          beams.forEach((beam, index) => {
            gsap.to(beam.material, {
              opacity: 0,
              duration: duration,
              delay: index * 0.15,
              ease: 'power2.in'
            })
          })
        },

        destroy() {
          beams.forEach(beam => {
            scene.remove(beam)
            beam.geometry.dispose()
            beam.material.dispose()
          })
        }
      }
    }

    const youthBeams = createYouthBeams(10)

    // ==================== 新增：青春能量球系统 ====================
    const createEnergyOrbs = (count = 20) => {
      const orbs = []
      const colors = [0xff69b4, 0xffa500, 0x9932cc, 0x00ced1, 0xffd700,
                      0xff6347, 0x7b68ee, 0x20b2aa]

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.SphereGeometry(3 + Math.random() * 4, 32, 32)
        const material = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0,
          blending: THREE.NormalBlending
        })

        const orb = new THREE.Mesh(geometry, material)
        orb.position.x = (Math.random() - 0.5) * 150
        orb.position.y = (Math.random() - 0.5) * 100 + 50
        orb.position.z = (Math.random() - 0.5) * 100

        orb.userData = {
          floatSpeed: 0.8 + Math.random() * 1.0,
          floatAmplitude: 5 + Math.random() * 8,
          floatPhase: Math.random() * Math.PI * 2,
          orbitSpeed: 0.3 + Math.random() * 0.5,
          orbitRadius: 8 + Math.random() * 15,
          orbitCenterX: orb.position.x,
          orbitCenterZ: orb.position.z
        }

        scene.add(orb)
        orbs.push(orb)
      }

      return {
        orbs,

        fadeIn(duration = 2) {
          orbs.forEach((orb, index) => {
            gsap.to(orb.material, {
              opacity: 0.4,
              duration: duration,
              delay: index * 0.08,
              ease: 'power2.out'
            })
          })
        },

        update(time) {
          orbs.forEach(orb => {
            // 漂浮动画
            orb.position.y += Math.sin(time * orb.userData.floatSpeed + orb.userData.floatPhase) * 0.1

            // 环绕动画
            const orbitAngle = time * orb.userData.orbitSpeed
            orb.position.x = orb.userData.orbitCenterX +
              Math.cos(orbitAngle) * orb.userData.orbitRadius
            orb.position.z = orb.userData.orbitCenterZ +
              Math.sin(orbitAngle) * orb.userData.orbitRadius

            // 脉冲动画
            const scale = 1 + Math.sin(time * 1.5 + orb.userData.floatPhase) * 0.2
            orb.scale.set(scale, scale, scale)
          })
        },

        burst() {
          orbs.forEach(orb => {
            const currentScale = orb.scale.x
            gsap.to(orb.scale, {
              x: currentScale * 2.5,
              y: currentScale * 2.5,
              z: currentScale * 2.5,
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut'
            })
          })
        },

        fadeOut(duration = 2) {
          orbs.forEach((orb, index) => {
            gsap.to(orb.material, {
              opacity: 0,
              duration: duration,
              delay: index * 0.05,
              ease: 'power2.in'
            })
          })
        },

        destroy() {
          orbs.forEach(orb => {
            scene.remove(orb)
            orb.geometry.dispose()
            orb.material.dispose()
          })
        }
      }
    }

    const energyOrbs = createEnergyOrbs(20)

    // ==================== 新增：青春粒子螺旋系统 ====================
    const createSpiralParticles = (count = 15000) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      const spiralColors = [
        [1.0, 0.6, 0.8],  // 粉色
        [1.0, 0.8, 0.5],  // 金色
        [0.9, 0.6, 1.0],  // 紫色
        [0.5, 0.9, 1.0]   // 青色
      ]

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 8
        const radius = 20 + (i % 100) * 0.5

        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = (i / count) * 120 - 60
        positions[i * 3 + 2] = Math.sin(angle) * radius

        const color = spiralColors[Math.floor(Math.random() * spiralColors.length)]
        colors[i * 3] = color[0]
        colors[i * 3 + 1] = color[1]
        colors[i * 3 + 2] = color[2]

        sizes[i] = 0.8 + Math.random() * 2
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: true,
        sizeAttenuation: true
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      return {
        points,
        material,
        geometry,
        active: false,

        start(duration = 2) {
          this.active = true
          gsap.to(material, { opacity: 0.6, duration: duration, ease: 'power2.out' })
        },

        update(deltaTime, time) {
          if (!this.active) return

          const positions = geometry.attributes.position.array

          for (let i = 0; i < count; i++) {
            // 螺旋旋转
            const angle = time * 1.5 + (i / count) * Math.PI * 8
            const radius = 20 + (i % 100) * 0.5

            positions[i * 3] = Math.cos(angle) * radius
            positions[i * 3 + 2] = Math.sin(angle) * radius
          }

          geometry.attributes.position.needsUpdate = true
        },

        expand() {
          const positions = geometry.attributes.position.array
          for (let i = 0; i < count; i++) {
            positions[i * 3] *= 1.3
            positions[i * 3 + 1] *= 1.3
            positions[i * 3 + 2] *= 1.3
          }
          geometry.attributes.position.needsUpdate = true
        },

        fadeOut(duration = 2) {
          gsap.to(material, { opacity: 0, duration: duration, ease: 'power2.in' })
        },

        destroy() {
          scene.remove(points)
          geometry.dispose()
          material.dispose()
        }
      }
    }

    const spiralParticles = createSpiralParticles(15000)

    // ==================== 更新处理函数 ====================
    const updateHandler = (deltaTime, time) => {
      floatingImages.update(time)
      petals.update(deltaTime, time)
      dreamyHalos.update(time)
      starParticles.update(deltaTime, time)
      youthBeams.update(time)
      energyOrbs.update(time)
      spiralParticles.update(deltaTime, time)
    }

    // ==================== 动画时间线 ====================
    // 阶段1: 晨曦微露（0-4秒）
    tl.add(() => {
      floatingImages.fadeIn(3)
      starParticles.start(3)
    }, 0)

    tl.add(() => starParticles.sparkle(), 2)
    tl.add(() => starParticles.colorShift(), 3)

    // 阶段2: 花季绽放（4-9秒）
    tl.add(() => {
      petals.start(2)
      dreamyHalos.fadeIn(2)
      spiralParticles.start(2)
    }, 4)

    tl.add(() => floatingImages.pulse(), 5)
    tl.add(() => petals.burst(), 6)
    tl.add(() => dreamyHalos.flash(), 7)
    tl.add(() => spiralParticles.expand(), 8)

    // 阶段3: 热血青春（9-15秒）
    tl.add(() => {
      youthBeams.fadeIn(2)
      energyOrbs.fadeIn(2)
    }, 9)

    tl.add(() => {
      floatingImages.spin()
      youthBeams.shoot()
    }, 10)

    tl.add(() => {
      starParticles.sparkle()
      energyOrbs.burst()
    }, 11)

    tl.add(() => {
      petals.burst()
      petals.colorWave()
    }, 12)

    tl.add(() => dreamyHalos.expand(), 13)
    tl.add(() => youthBeams.wave(), 14)

    // 阶段4: 永恒记忆（15-20秒）
    tl.add(() => {
      youthBeams.fadeOut(3)
      petals.material.opacity = 0
    }, 15)

    tl.add(() => {
      starParticles.sparkle()
      energyOrbs.burst()
    }, 16)

    tl.add(() => {
      dreamyHalos.flash()
      spiralParticles.fadeOut(2)
    }, 17)

    tl.add(() => {
      floatingImages.fadeOut(2.5)
      dreamyHalos.fadeOut(2)
      starParticles.material.opacity = 0
      energyOrbs.fadeOut(2)
    }, 17.5)

    // ==================== 清理函数 ====================
    const cleanup = () => {
      floatingImages.destroy()
      petals.destroy()
      dreamyHalos.destroy()
      starParticles.destroy()
      youthBeams.destroy()
      energyOrbs.destroy()
      spiralParticles.destroy()
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
    console.error('青春年华动画错误:', error)
    if (onError) onError(error)
    return { cleanup: () => {}, update: () => {} }
  }
}
