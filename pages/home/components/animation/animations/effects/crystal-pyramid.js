/**
 * effects/crystal-pyramid.js
 * 水晶金字塔特效
 * 神秘、能量聚集、古老文明
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建水晶金字塔
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 金字塔对象
 */
export function createCrystalPyramid(scene, options = {}) {
  const {
    particleCount = 3000,
    shardCount = 500
  } = options

  // 金字塔
  const pyramidGeometry = new THREE.ConeGeometry(30, 20, 4)
  const pyramidMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff,
    emissive: 0x0099ff,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    flatShading: true
  })
  const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
  pyramid.position.y = 10
  pyramid.scale.setScalar(0)
  scene.add(pyramid)

  // 线框金字塔
  const wireframeGeometry = new THREE.ConeGeometry(30, 20, 4)
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    wireframe: true,
    blending: THREE.AdditiveBlending
  })
  const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
  wireframe.position.y = 10
  wireframe.scale.setScalar(0)
  scene.add(wireframe)

  // 水晶碎片
  const shards = []
  const shardColors = [0x00ffff, 0x0099ff, 0x0066ff, 0x9900ff, 0xff00ff]

  for (let i = 0; i < shardCount; i++) {
    const size = 0.5 + Math.random() * 2
    const geometry = new THREE.TetrahedronGeometry(size, 0)
    const material = new THREE.MeshPhongMaterial({
      color: shardColors[Math.floor(Math.random() * shardColors.length)],
      emissive: shardColors[Math.floor(Math.random() * shardColors.length)],
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0,
      flatShading: true
    })
    const shard = new THREE.Mesh(geometry, material)

    const angle = Math.random() * Math.PI * 2
    const radius = 20 + Math.random() * 40

    shard.position.set(
      Math.cos(angle) * radius,
      Math.random() * 60 - 20,
      Math.sin(angle) * radius
    )
    shard.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    shard.scale.setScalar(0)
    scene.add(shard)
    shards.push(shard)
  }

  // 能量粒子
  const energyGeometry = new THREE.BufferGeometry()
  const energyPositions = new Float32Array(particleCount * 3)
  const energyColors = new Float32Array(particleCount * 3)
  const energyPhases = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 10 + Math.random() * 50

    energyPositions[i * 3] = Math.cos(angle) * radius
    energyPositions[i * 3 + 1] = Math.random() * 50
    energyPositions[i * 3 + 2] = Math.sin(angle) * radius

    const hue = 0.5 + Math.random() * 0.15
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
    energyColors[i * 3] = color.r
    energyColors[i * 3 + 1] = color.g
    energyColors[i * 3 + 2] = color.b

    energyPhases[i] = Math.random() * Math.PI * 2
  }

  energyGeometry.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3))
  energyGeometry.setAttribute('color', new THREE.BufferAttribute(energyColors, 3))
  energyGeometry.setAttribute('phase', new THREE.BufferAttribute(energyPhases, 1))

  const energyMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const energy = new THREE.Points(energyGeometry, energyMaterial)
  scene.add(energy)

  // 地面图案
  const floorGeometry = new THREE.RingGeometry(30, 35, 64)
  const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = Math.PI / 2
  floor.position.y = -10
  floor.visible = false
  scene.add(floor)

  // 能量柱
  const pillars = []
  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 40, 16)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const pillar = new THREE.Mesh(geometry, material)
    const angle = (i / 4) * Math.PI * 2
    pillar.position.set(
      Math.cos(angle) * 35,
      10,
      Math.sin(angle) * 35
    )
    pillar.visible = false
    scene.add(pillar)
    pillars.push(pillar)
  }

  // 灯光
  const pyramidLight = new THREE.PointLight(0x00ffff, 0, 150)
  pyramidLight.position.set(0, 20, 0)
  scene.add(pyramidLight)

  const ambientLight = new THREE.AmbientLight(0x002244, 0)
  scene.add(ambientLight)

  return {
    pyramid,
    wireframe,
    shards,
    energy,
    energyGeometry,
    floor,
    pillars,
    pyramidLight,
    ambientLight,
    update(deltaTime, time) {
      // 更新金字塔
      if (pyramid.visible) {
        pyramid.material.opacity = 0.7 + Math.sin(time * 3) * 0.2
        pyramid.material.emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.2
      }

      // 更新线框
      if (wireframe.visible) {
        wireframe.rotation.y += deltaTime * 0.3
        wireframe.material.opacity = 0.5 + Math.sin(time * 5) * 0.3
      }

      // 更新碎片
      shards.forEach((shard, i) => {
        if (shard.visible) {
          shard.rotation.x += deltaTime
          shard.rotation.y += deltaTime * 0.7
          shard.material.opacity = 0.8 + Math.sin(time * 4 + i) * 0.2
        }
      })

      // 更新能量粒子
      if (energyMaterial.opacity > 0) {
        const pos = energyGeometry.attributes.position.array
        const phasesArr = energyGeometry.attributes.phase.array

        for (let i = 0; i < particleCount; i++) {
          const angle = Math.atan2(pos[i * 3 + 2], pos[i * 3])
          const newAngle = angle + deltaTime * 2
          const radius = Math.sqrt(pos[i * 3] * pos[i * 3] + pos[i * 3 + 2] * pos[i * 3 + 2])

          pos[i * 3] = Math.cos(newAngle) * radius
          pos[i * 3 + 2] = Math.sin(newAngle) * radius
          pos[i * 3 + 1] += Math.sin(time * 3 + phasesArr[i]) * deltaTime * 3
        }
        energyGeometry.attributes.position.needsUpdate = true
      }

      // 更新地面
      if (floor.visible) {
        floor.rotation.z += deltaTime * 0.5
        floor.material.opacity = 0.4 + Math.sin(time * 6) * 0.3
      }

      // 更新柱子
      pillars.forEach((pillar, i) => {
        if (pillar.visible) {
          pillar.material.opacity = 0.6 + Math.sin(time * 5 + i) * 0.4
        }
      })

      // 灯光
      if (pyramidLight.intensity > 0) {
        pyramidLight.intensity = 2 + Math.sin(time * 4) * 1
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 金字塔出现
      gsap.to(pyramid.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
      })
      gsap.to(pyramid.material, {
        opacity: 0.7,
        duration: 1.5
      })

      // 线框出现
      gsap.delayedCall(0.5, () => {
        gsap.to(wireframe.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.5,
          ease: 'power2.out'
        })
        gsap.to(wireframe.material, {
          opacity: 0.5,
          duration: 1
        })
      })

      // 碎片浮现
      shards.forEach((shard, i) => {
        gsap.delayedCall(1 + i * 0.003, () => {
          shard.visible = true
          gsap.to(shard.scale, {
            x: 1, y: 1, z: 1,
            duration: 1,
            ease: 'back.out(0.7)'
          })
          gsap.to(shard.material, {
            opacity: 0.8,
            duration: 0.8
          })
        })
      })

      // 能量激活
      gsap.to(energyMaterial, {
        opacity: 1,
        duration: 1.5,
        delay: 1.5
      })

      // 地面出现
      gsap.delayedCall(2, () => {
        floor.visible = true
        gsap.to(floor.material, {
          opacity: 0.4,
          duration: 1
        })
      })

      // 柱子出现
      pillars.forEach((pillar, i) => {
        gsap.delayedCall(2.5 + i * 0.15, () => {
          pillar.visible = true
          gsap.to(pillar.material, {
            opacity: 0.6,
            duration: 1
          })
        })
      })

      // 灯光
      gsap.to(pyramidLight, {
        intensity: 2,
        duration: 1,
        delay: 1
      })

      gsap.to(ambientLight, {
        intensity: 0.3,
        duration: 1,
        delay: 1.5
      })

      return tl
    },
    destroy() {
      scene.remove(pyramid)
      scene.remove(wireframe)
      shards.forEach(shard => {
        scene.remove(shard)
        shard.geometry.dispose()
        shard.material.dispose()
      })
      scene.remove(energy)
      scene.remove(floor)
      pillars.forEach(pillar => {
        scene.remove(pillar)
        pillar.geometry.dispose()
        pillar.material.dispose()
      })
      scene.remove(pyramidLight)
      scene.remove(ambientLight)
      pyramidGeometry.dispose()
      pyramidMaterial.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      energyGeometry.dispose()
      energyMaterial.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
    }
  }
}
