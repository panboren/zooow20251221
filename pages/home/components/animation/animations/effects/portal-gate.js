/**
 * effects/portal-gate.js
 * 传送门特效
 * 空间折叠、神秘入口、穿越之门
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建传送门
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 传送门对象
 */
export function createPortalGate(scene, options = {}) {
  const {
    ringCount = 8,
    portalParticleCount = 5000
  } = options

  // 传送门环
  const rings = []
  const ringColors = [0x00ffff, 0xff00ff, 0x00ff00, 0xffff00, 0xff6600]

  for (let i = 0; i < ringCount; i++) {
    const geometry = new THREE.TorusGeometry(8 + i * 2, 0.5, 16, 64)
    const material = new THREE.MeshBasicMaterial({
      color: ringColors[i % ringColors.length],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.rotation.z = Math.PI * 2 * (i / ringCount)
    ring.visible = false
    scene.add(ring)
    rings.push(ring)
  }

  // 传送门粒子
  const portalGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(portalParticleCount * 3)
  const colors = new Float32Array(portalParticleCount * 3)
  const phases = new Float32Array(portalParticleCount)
  const radii = new Float32Array(portalParticleCount)

  for (let i = 0; i < portalParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 5 + Math.random() * 20

    positions[i * 3] = Math.sin(phi) * Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.cos(phi) * radius
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(angle) * radius

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
    radii[i] = radius
  }

  portalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  portalGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  portalGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  portalGeometry.setAttribute('radius', new THREE.BufferAttribute(radii, 1))

  const portalMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const portal = new THREE.Points(portalGeometry, portalMaterial)
  scene.add(portal)

  // 能量光柱
  const pillars = []
  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.CylinderGeometry(1, 1, 50, 16)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const pillar = new THREE.Mesh(geometry, material)
    const angle = (i / 4) * Math.PI * 2
    pillar.position.set(
      Math.cos(angle) * 30,
      0,
      Math.sin(angle) * 30
    )
    pillar.visible = false
    scene.add(pillar)
    pillars.push(pillar)
  }

  // 传送门中心
  const gateGeometry = new THREE.CircleGeometry(8, 64)
  const gateMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  const gate = new THREE.Mesh(gateGeometry, gateMaterial)
  gate.visible = false
  scene.add(gate)

  // 星星碎片
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 1000
  const starPositions = new Float32Array(starCount * 3)
  const starColors = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 150
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 150

    const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.7)
    starColors[i * 3] = color.r
    starColors[i * 3 + 1] = color.g
    starColors[i * 3 + 2] = color.b
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

  const starMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // 灯光
  const portalLight = new THREE.PointLight(0x00ffff, 0, 100)
  portalLight.position.set(0, 0, 0)
  scene.add(portalLight)

  return {
    rings,
    portal,
    portalGeometry,
    pillars,
    gate,
    stars,
    starGeometry,
    portalLight,
    update(deltaTime, time) {
      // 更新环
      rings.forEach((ring, i) => {
        if (ring.visible) {
          ring.rotation.z += deltaTime * (1 + i * 0.2) * (i % 2 === 0 ? 1 : -1)
          ring.rotation.x = Math.PI / 2 + Math.sin(time * 3 + i) * 0.3
          ring.material.opacity = 0.6 + Math.sin(time * 4 + i) * 0.4
        }
      })

      // 更新传送门粒子
      if (portalMaterial.opacity > 0) {
        const pos = portalGeometry.attributes.position.array
        const phasesArr = portalGeometry.attributes.phase.array
        const radiiArr = portalGeometry.attributes.radius.array

        for (let i = 0; i < portalParticleCount; i++) {
          const angle = Math.atan2(pos[i * 3 + 2], pos[i * 3])
          const phi = Math.acos(pos[i * 3 + 1] / radiiArr[i])
          const newAngle = angle + deltaTime * (3 + i % 3)

          pos[i * 3] = Math.sin(phi) * Math.cos(newAngle) * radiiArr[i]
          pos[i * 3 + 2] = Math.sin(phi) * Math.sin(newAngle) * radiiArr[i]
          pos[i * 3 + 1] += Math.sin(time * 5 + phasesArr[i]) * deltaTime * 2
        }
        portalGeometry.attributes.position.needsUpdate = true
      }

      // 更新光柱
      pillars.forEach((pillar, i) => {
        if (pillar.visible) {
          pillar.material.opacity = 0.5 + Math.sin(time * 6 + i) * 0.3
        }
      })

      // 更新门
      if (gate.visible) {
        gate.material.opacity = 0.4 + Math.sin(time * 8) * 0.3
      }

      // 更新星星
      if (starMaterial.opacity > 0) {
        const pos = starGeometry.attributes.position.array
        for (let i = 0; i < starCount; i++) {
          pos[i * 3] += Math.sin(time + i) * deltaTime * 5
          pos[i * 3 + 2] += Math.cos(time + i) * deltaTime * 5
        }
        starGeometry.attributes.position.needsUpdate = true
      }

      // 灯光
      if (portalLight.intensity > 0) {
        portalLight.intensity = 1.5 + Math.sin(time * 6) * 0.5
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 环出现
      rings.forEach((ring, i) => {
        gsap.delayedCall(0.5 + i * 0.15, () => {
          ring.visible = true
          gsap.to(ring.material, {
            opacity: 0.6,
            duration: 1,
            ease: 'power2.out'
          })
        })
      })

      // 传送门粒子激活
      gsap.to(portalMaterial, {
        opacity: 1,
        duration: 1.5,
        delay: 1
      })

      // 光柱出现
      pillars.forEach((pillar, i) => {
        gsap.delayedCall(1.5 + i * 0.2, () => {
          pillar.visible = true
          gsap.to(pillar.material, {
            opacity: 0.5,
            duration: 1
          })
        })
      })

      // 门打开
      gsap.delayedCall(2.5, () => {
        gate.visible = true
        gsap.to(gate.material, {
          opacity: 0.5,
          duration: 1
        })
      })

      // 星星出现
      gsap.to(starMaterial, {
        opacity: 0.8,
        duration: 2,
        delay: 3
      })

      // 灯光
      gsap.to(portalLight, {
        intensity: 1.5,
        duration: 1,
        delay: 2
      })

      return tl
    },
    destroy() {
      rings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      scene.remove(portal)
      scene.remove(gate)
      scene.remove(stars)
      pillars.forEach(pillar => {
        scene.remove(pillar)
        pillar.geometry.dispose()
        pillar.material.dispose()
      })
      scene.remove(portalLight)
      portalGeometry.dispose()
      portalMaterial.dispose()
      gateGeometry.dispose()
      gateMaterial.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }
}
