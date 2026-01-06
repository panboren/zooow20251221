/**
 * effects/cyber-grid-city.js
 * 赛博网格城市特效
 * 未来感、数字矩阵、霓虹风格
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建赛博网格城市
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 赛博城市对象
 */
export function createCyberGridCity(scene, options = {}) {
  const {
    gridSize = 200,
    gridCells = 20,
    buildingCount = 100
  } = options

  // 网格地面
  const gridHelper = new THREE.GridHelper(gridSize, gridCells, 0x00ffff, 0x004444)
  gridHelper.position.y = -20
  gridHelper.material.transparent = true
  gridHelper.material.opacity = 0
  scene.add(gridHelper)

  // 垂直网格墙
  const walls = []
  const wallGeometry = new THREE.PlaneGeometry(gridSize, 100, gridCells, 10)
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    wireframe: true
  })

  for (let i = 0; i < 4; i++) {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial.clone())
    wall.position.y = 30
    wall.rotation.y = (i / 4) * Math.PI * 2
    wall.position.x = Math.sin(wall.rotation.y) * (gridSize / 2)
    wall.position.z = Math.cos(wall.rotation.y) * (gridSize / 2)
    wall.visible = false
    scene.add(wall)
    walls.push(wall)
  }

  // 霓虹建筑
  const buildings = []
  const neonColors = [0xff00ff, 0x00ffff, 0x00ff00, 0xffff00, 0xff6600]

  for (let i = 0; i < buildingCount; i++) {
    const height = 10 + Math.random() * 50
    const width = 2 + Math.random() * 4

    const geometry = new THREE.BoxGeometry(width, height, width)
    const material = new THREE.MeshBasicMaterial({
      color: neonColors[Math.floor(Math.random() * neonColors.length)],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      wireframe: true
    })

    const building = new THREE.Mesh(geometry, material)
    const angle = Math.random() * Math.PI * 2
    const radius = 20 + Math.random() * 60

    building.position.x = Math.cos(angle) * radius
    building.position.z = Math.sin(angle) * radius
    building.position.y = -20 + height / 2
    building.scale.y = 0
    building.visible = false
    scene.add(building)
    buildings.push(building)
  }

  // 数据流粒子
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 5000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * gridSize
    positions[i * 3 + 1] = Math.random() * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * gridSize

    const hue = 0.5 + Math.random() * 0.2
    const color = new THREE.Color().setHSL(hue, 1, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  // 全息中心
  const hologramGeometry = new THREE.IcosahedronGeometry(15, 2)
  const hologramMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    wireframe: true,
    blending: THREE.AdditiveBlending
  })

  const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial)
  hologram.position.y = 30
  hologram.visible = false
  scene.add(hologram)

  // 灯光
  const light = new THREE.PointLight(0x00ffff, 0, 100)
  light.position.set(0, 30, 0)
  scene.add(light)

  return {
    gridHelper,
    walls,
    buildings,
    particles,
    particleGeometry,
    phases,
    hologram,
    light,
    update(deltaTime, time) {
      // 更新墙壁
      walls.forEach((wall, i) => {
        if (wall.visible) {
          wall.material.opacity = 0.6 + Math.sin(time * 3 + i) * 0.2
        }
      })

      // 更新建筑
      buildings.forEach((building, i) => {
        if (building.visible) {
          building.rotation.y += deltaTime * 0.2
          building.material.opacity = 0.8 + Math.sin(time * 2 + i) * 0.2
        }
      })

      // 更新全息
      if (hologram.visible) {
        hologram.rotation.x += deltaTime
        hologram.rotation.y += deltaTime * 0.7
        hologram.material.opacity = 0.8 + Math.sin(time * 5) * 0.2
      }

      // 更新粒子
      if (particleMaterial.opacity > 0) {
        const pos = particleGeometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += (10 + Math.random() * 20) * deltaTime
          if (pos[i * 3 + 1] > 80) {
            pos[i * 3 + 1] = -20
            pos[i * 3] = (Math.random() - 0.5) * gridSize
            pos[i * 3 + 2] = (Math.random() - 0.5) * gridSize
          }
        }
        particleGeometry.attributes.position.needsUpdate = true
      }

      // 灯光脉动
      if (light.intensity > 0) {
        light.intensity = 1 + Math.sin(time * 5) * 0.5
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 网格出现
      gsap.to(gridHelper.material, {
        opacity: 0.5,
        duration: 1
      })

      // 墙壁出现
      walls.forEach((wall, i) => {
        gsap.delayedCall(0.5 + i * 0.2, () => {
          wall.visible = true
          gsap.to(wall.material, {
            opacity: 0.6,
            duration: 1,
            ease: 'power2.out'
          })
        })
      })

      // 建筑升起
      buildings.forEach((building, i) => {
        gsap.delayedCall(1 + i * 0.01, () => {
          building.visible = true
          gsap.to(building.scale, {
            y: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
          })
          gsap.to(building.material, {
            opacity: 0.8,
            duration: 1,
            delay: 0.5
          })
        })
      })

      // 粒子流
      gsap.to(particleMaterial, {
        opacity: 0.8,
        duration: 1,
        delay: 1.5
      })

      // 全息出现
      gsap.delayedCall(2.5, () => {
        hologram.visible = true
        gsap.to(hologram.material, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        })
      })

      // 灯光出现
      gsap.to(light, {
        intensity: 1,
        duration: 1,
        delay: 2.5
      })

      // 旋转建筑
      gsap.to(buildings[0].rotation, {
        y: Math.PI * 2,
        duration: 5,
        delay: 3,
        ease: 'power2.inOut'
      })

      return tl
    },
    destroy() {
      scene.remove(gridHelper)
      walls.forEach(wall => {
        scene.remove(wall)
        wall.geometry.dispose()
        wall.material.dispose()
      })
      buildings.forEach(building => {
        scene.remove(building)
        building.geometry.dispose()
        building.material.dispose()
      })
      scene.remove(particles)
      scene.remove(hologram)
      scene.remove(light)
      wallGeometry.dispose()
      wallMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      hologramGeometry.dispose()
      hologramMaterial.dispose()
    }
  }
}
