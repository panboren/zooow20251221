/**
 * effects/quantum-dimension-break.js
 * 量子维度分裂特效
 * 震撼、空间撕裂、维度崩塌
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建量子维度分裂
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 分裂对象
 */
export function createQuantumDimensionBreak(scene, options = {}) {
  const {
    segmentCount = 12,
    shardCount = 2000
  } = options

  const shards = []
  const energyRings = []

  // 维度碎片
  const shardGeometry = new THREE.TetrahedronGeometry(1, 0)
  const shardMaterials = [
    new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.9,
      wireframe: true
    }),
    new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.9,
      wireframe: true
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.9,
      wireframe: true
    })
  ]

  // 创建碎片场
  for (let i = 0; i < shardCount; i++) {
    const material = shardMaterials[Math.floor(Math.random() * shardMaterials.length)]
    const shard = new THREE.Mesh(shardGeometry, material)

    const radius = 30 + Math.random() * 40
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    shard.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )

    shard.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    shard.scale.setScalar(0.5 + Math.random() * 1.5)
    shard.userData.originalPos = shard.position.clone()
    shard.userData.velocity = new THREE.Vector3()

    scene.add(shard)
    shards.push(shard)
  }

  // 能量环
  for (let i = 0; i < segmentCount; i++) {
    const geometry = new THREE.RingGeometry(10 + i * 3, 11 + i * 3, 64)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i / segmentCount, 1, 0.6),
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.visible = false
    scene.add(ring)
    energyRings.push(ring)
  }

  // 中心维度裂缝
  const riftGeometry = new THREE.TorusGeometry(20, 3, 16, 100)
  const riftMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec3 pos = position;
        pos += normal * sin(uTime * 5.0 + pos.x * 0.5) * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
        float pulse = sin(uTime * 10.0) * 0.5 + 0.5;
        vec3 color = mix(uColor * 0.5, uColor * 1.5, pulse);
        float alpha = edge * (0.3 + pulse * 0.7);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })

  const rift = new THREE.Mesh(riftGeometry, riftMaterial)
  rift.rotation.x = Math.PI / 2
  rift.scale.setScalar(0)
  scene.add(rift)

  // 粒子爆发
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 5000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 2 + 0.5
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  const velocities = []
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const speed = 20 + Math.random() * 40
    velocities.push(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta) * speed,
      Math.cos(phi) * speed,
      Math.sin(phi) * Math.sin(theta) * speed
    ))
  }

  return {
    shards,
    energyRings,
    rift,
    particles,
    particleGeometry,
    update(deltaTime, time) {
      // 更新碎片
      shards.forEach((shard, i) => {
        shard.rotation.x += deltaTime * 0.5
        shard.rotation.y += deltaTime * 0.3
        shard.position.y += Math.sin(time * 2 + i * 0.1) * 0.01
      })

      // 更新能量环
      energyRings.forEach((ring, i) => {
        if (ring.visible) {
          ring.rotation.z += deltaTime * (1 + i * 0.2)
          ring.scale.multiplyScalar(1 + deltaTime * 0.3)
          ring.material.opacity -= deltaTime * 0.1
          if (ring.material.opacity < 0) {
            ring.material.opacity = 0
            ring.visible = false
          }
        }
      })

      // 更新裂缝
      rift.material.uniforms.uTime.value = time

      // 更新粒子
      const pos = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x * deltaTime
        pos[i * 3 + 1] += velocities[i].y * deltaTime
        pos[i * 3 + 2] += velocities[i].z * deltaTime
      }
      particleGeometry.attributes.position.needsUpdate = true
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 裂缝展开
      gsap.to(rift.scale, {
        x: 1, y: 1, z: 1,
        duration: 1,
        ease: 'power2.out'
      })

      // 碎片爆炸
      shards.forEach((shard, i) => {
        const delay = Math.random() * 0.5
        const angle = Math.atan2(shard.position.z, shard.position.x)
        const dist = Math.sqrt(
          shard.position.x * shard.position.x +
          shard.position.z * shard.position.z
        )

        gsap.to(shard.position, {
          x: Math.cos(angle) * (dist * 3),
          z: Math.sin(angle) * (dist * 3),
          duration: 2,
          delay,
          ease: 'power2.out'
        })

        gsap.to(shard.rotation, {
          x: shard.rotation.x + Math.PI * 4,
          y: shard.rotation.y + Math.PI * 4,
          duration: 2,
          delay,
          ease: 'power2.inOut'
        })
      })

      // 能量环扩散
      energyRings.forEach((ring, i) => {
        gsap.delayedCall(0.3 + i * 0.1, () => {
          ring.visible = true
          ring.scale.setScalar(0.5)
          ring.material.opacity = 0.8
        })
      })

      // 粒子爆发
      gsap.to(particleMaterial, {
        opacity: 1,
        duration: 0.5,
        delay: 0.5
      })

      gsap.to(particleMaterial, {
        opacity: 0,
        duration: 1.5,
        delay: 1.5,
        ease: 'power2.in'
      })

      // 裂缝收缩
      gsap.to(rift.scale, {
        x: 0.1, y: 0.1, z: 0.1,
        duration: 1,
        delay: 2,
        ease: 'power2.in'
      })

      return tl
    },
    destroy() {
      shards.forEach(shard => {
        scene.remove(shard)
        shardGeometry.dispose()
        shardMaterials.forEach(m => m.dispose())
      })
      energyRings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      scene.remove(rift)
      scene.remove(particles)
      riftGeometry.dispose()
      riftMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
