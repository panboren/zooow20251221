/**
 * effects/energy-sphere.js
 * 能量球特效
 * 力场、防护罩、核心能量
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建能量球
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 能量球对象
 */
export function createEnergySphere(scene, options = {}) {
  const {
    layerCount = 6,
    particleCount = 4000
  } = options

  // 核心球
  const coreGeometry = new THREE.SphereGeometry(5, 64, 64)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  core.scale.setScalar(0)
  scene.add(core)

  // 能量层
  const layers = []
  const layerColors = [0x00ffff, 0x0099ff, 0x0066ff, 0x3300ff, 0x6600ff, 0x9900ff]

  for (let i = 0; i < layerCount; i++) {
    const geometry = new THREE.SphereGeometry(8 + i * 3, 64, 64)
    const material = new THREE.MeshBasicMaterial({
      color: layerColors[i % layerColors.length],
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending
    })
    const layer = new THREE.Mesh(geometry, material)
    layer.scale.setScalar(0)
    scene.add(layer)
    layers.push(layer)
  }

  // 能量粒子
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)
  const orbitRadii = new Float32Array(particleCount)
  const orbitAngles = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 15 + Math.random() * 30

    positions[i * 3] = Math.sin(phi) * Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.cos(phi) * radius
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(angle) * radius

    const hue = 0.5 + Math.random() * 0.2
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
    orbitRadii[i] = radius
    orbitAngles[i] = Math.random() * Math.PI * 2
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  particleGeometry.setAttribute('orbitRadius', new THREE.BufferAttribute(orbitRadii, 1))
  particleGeometry.setAttribute('orbitAngle', new THREE.BufferAttribute(orbitAngles, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  // 能量射线
  const rays = []
  const rayCount = 24

  for (let i = 0; i < rayCount; i++) {
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 50, 8)
    const material = new THREE.MeshBasicMaterial({
      color: layerColors[i % layerColors.length],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ray = new THREE.Mesh(geometry, material)
    const angle = (i / rayCount) * Math.PI * 2
    ray.position.set(
      Math.cos(angle) * 25,
      0,
      Math.sin(angle) * 25
    )
    ray.rotation.z = Math.PI / 2
    ray.visible = false
    scene.add(ray)
    rays.push(ray)
  }

  // 外环
  const outerRings = []
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.TorusGeometry(35 + i * 8, 1, 16, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.visible = false
    scene.add(ring)
    outerRings.push(ring)
  }

  // 灯光
  const centerLight = new THREE.PointLight(0x00ffff, 0, 150)
  centerLight.position.set(0, 0, 0)
  scene.add(centerLight)

  const ambientLight = new THREE.AmbientLight(0x001133, 0)
  scene.add(ambientLight)

  return {
    core,
    layers,
    particles,
    particleGeometry,
    rays,
    outerRings,
    centerLight,
    ambientLight,
    update(deltaTime, time) {
      // 更新核心
      if (core.visible) {
        core.material.opacity = 0.8 + Math.sin(time * 8) * 0.2
      }

      // 更新层
      layers.forEach((layer, i) => {
        if (layer.visible) {
          layer.rotation.x += deltaTime * (1 + i * 0.2)
          layer.rotation.y += deltaTime * (1.5 + i * 0.3) * (i % 2 === 0 ? 1 : -1)
          layer.material.opacity = 0.4 + Math.sin(time * 4 + i) * 0.3
        }
      })

      // 更新粒子
      if (particleMaterial.opacity > 0) {
        const pos = particleGeometry.attributes.position.array
        const phasesArr = particleGeometry.attributes.phase.array
        const radiiArr = particleGeometry.attributes.orbitRadius.array
        const anglesArr = particleGeometry.attributes.orbitAngle.array

        for (let i = 0; i < particleCount; i++) {
          anglesArr[i] += deltaTime * (2 + i % 3)
          const angle = anglesArr[i]
          const phi = Math.asin(pos[i * 3 + 1] / radiiArr[i])

          pos[i * 3] = Math.sin(phi) * Math.cos(angle) * radiiArr[i]
          pos[i * 3 + 2] = Math.sin(phi) * Math.sin(angle) * radiiArr[i]
          pos[i * 3 + 1] += Math.sin(time * 3 + phasesArr[i]) * deltaTime * 2
        }
        particleGeometry.attributes.position.needsUpdate = true
        particleGeometry.attributes.orbitAngle.needsUpdate = true
      }

      // 更新射线
      rays.forEach((ray, i) => {
        if (ray.visible) {
          ray.rotation.y += deltaTime * (3 + i % 3)
          ray.material.opacity = 0.4 + Math.sin(time * 5 + i) * 0.3
        }
      })

      // 更新外环
      outerRings.forEach((ring, i) => {
        if (ring.visible) {
          ring.rotation.z += deltaTime * (1 + i * 0.3) * (i % 2 === 0 ? 1 : -1)
          ring.rotation.x = Math.PI / 2 + Math.sin(time * 2 + i) * 0.5
          ring.material.opacity = 0.5 + Math.sin(time * 3 + i) * 0.4
        }
      })

      // 灯光
      if (centerLight.intensity > 0) {
        centerLight.intensity = 2 + Math.sin(time * 6) * 0.8
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 核心出现
      gsap.to(core.scale, {
        x: 1, y: 1, z: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      })
      gsap.to(core.material, {
        opacity: 0.8,
        duration: 1
      })

      // 层展开
      layers.forEach((layer, i) => {
        gsap.delayedCall(0.5 + i * 0.15, () => {
          gsap.to(layer.scale, {
            x: 1, y: 1, z: 1,
            duration: 1.5,
            ease: 'power2.out'
          })
          gsap.to(layer.material, {
            opacity: 0.4,
            duration: 1
          })
        })
      })

      // 粒子激活
      gsap.to(particleMaterial, {
        opacity: 1,
        duration: 1.5,
        delay: 1
      })

      // 射线出现
      rays.forEach((ray, i) => {
        gsap.delayedCall(1.5 + i * 0.03, () => {
          ray.visible = true
          gsap.to(ray.material, {
            opacity: 0.4,
            duration: 0.8
          })
        })
      })

      // 外环出现
      outerRings.forEach((ring, i) => {
        gsap.delayedCall(2.5 + i * 0.2, () => {
          ring.visible = true
          gsap.to(ring.material, {
            opacity: 0.5,
            duration: 1
          })
        })
      })

      // 灯光
      gsap.to(centerLight, {
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
      scene.remove(core)
      layers.forEach(layer => {
        scene.remove(layer)
        layer.geometry.dispose()
        layer.material.dispose()
      })
      scene.remove(particles)
      rays.forEach(ray => {
        scene.remove(ray)
        ray.geometry.dispose()
        ray.material.dispose()
      })
      outerRings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      scene.remove(centerLight)
      scene.remove(ambientLight)
      coreGeometry.dispose()
      coreMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
