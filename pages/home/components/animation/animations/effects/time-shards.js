/**
 * effects/time-shards.js
 * 时光碎片特效
 * 时间冻结、碎片重构、神秘感
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建时光碎片
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 碎片对象
 */
export function createTimeShards(scene, options = {}) {
  const {
    shardCount = 3000,
    timelineRings = 7
  } = options

  // 时间碎片
  const shards = []
  const shardColors = [
    0x00ffff, // 青
    0xff00ff, // 紫
    0x00ff00, // 绿
    0xff6600, // 橙
    0x0099ff, // 蓝
    0xffcc00  // 金
  ]

  for (let i = 0; i < shardCount; i++) {
    const size = 0.5 + Math.random() * 1.5
    const geometry = new THREE.BoxGeometry(size, size, size * 0.1)
    const material = new THREE.MeshBasicMaterial({
      color: shardColors[Math.floor(Math.random() * shardColors.length)],
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
    const shard = new THREE.Mesh(geometry, material)

    // 球形分布
    const radius = 20 + Math.random() * 50
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

    shard.userData.originalPos = shard.position.clone()
    shard.userData.originalRot = shard.rotation.clone()
    shard.userData.targetPos = shard.position.clone().multiplyScalar(2)
    shard.userData.targetRot = new THREE.Vector3(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
    shard.userData.speed = 0.5 + Math.random() * 1.5
    shard.userData.delay = Math.random() * 2

    scene.add(shard)
    shards.push(shard)
  }

  // 时间环
  const timelineRingsMeshes = []
  for (let i = 0; i < timelineRings; i++) {
    const radius = 15 + i * 8
    const geometry = new THREE.TorusGeometry(radius, 0.3, 16, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setHSL(i / timelineRings, 1, 0.5) },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 pos = position;
          float wave = sin(uTime * 3.0 + length(pos) * 0.1) * 0.5;
          pos += normal * wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vPos;

        void main() {
          float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float pulse = sin(uTime * 5.0 + length(vPos) * 0.1) * 0.5 + 0.5;
          vec3 color = uColor * (0.5 + pulse * 0.5);
          float alpha = edge * uOpacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)
    timelineRingsMeshes.push(ring)
  }

  // 时空漩涡中心
  const vortexGeometry = new THREE.ConeGeometry(5, 15, 32, 1, true)
  const vortexMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec3 pos = position;

        // 螺旋扭曲
        float angle = atan(pos.z, pos.x);
        float twist = uTime * 2.0 * (1.0 - uv.y);
        angle += twist;

        float radius = length(pos.xz);
        pos.x = cos(angle) * radius;
        pos.z = sin(angle) * radius;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        float flow = sin(vUv.y * 20.0 - uTime * 10.0) * 0.5 + 0.5;
        float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        vec3 color = uColor * (0.5 + flow * 0.5);
        float alpha = edge * (1.0 - vUv.y) * 0.8;
        gl_FragColor = vec4(color, alpha);
      }
    `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
  })

  const vortex = new THREE.Mesh(vortexGeometry, vortexMaterial)
  vortex.rotation.x = Math.PI
  vortex.visible = false
  scene.add(vortex)

  // 粒子流
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 2000
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = 0
    particlePositions[i * 3 + 1] = 0
    particlePositions[i * 3 + 2] = 0

    const color = new THREE.Color().setHSL(Math.random(), 1, 0.6)
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

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

  const particleVelocities = []
  for (let i = 0; i < particleCount; i++) {
    particleVelocities.push({
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI,
      radius: 5 + Math.random() * 10,
      speed: 2 + Math.random() * 3
    })
  }

  return {
    shards,
    timelineRingsMeshes,
    vortex,
    particles,
    particleGeometry,
    update(deltaTime, time) {
      // 更新时间环
      timelineRingsMeshes.forEach((ring, i) => {
        ring.rotation.z += deltaTime * (0.5 + i * 0.2) * (i % 2 === 0 ? 1 : -1)
        ring.material.uniforms.uTime.value = time
      })

      // 更新漩涡
      if (vortex.visible) {
        vortex.material.uniforms.uTime.value = time
      }

      // 更新碎片
      shards.forEach(shard => {
        shard.rotation.x += deltaTime * shard.userData.speed
        shard.rotation.y += deltaTime * shard.userData.speed * 0.7
      })

      // 更新粒子
      if (particleMaterial.opacity > 0) {
        const pos = particleGeometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          const vel = particleVelocities[i]

          // 螺旋运动
          vel.theta += deltaTime * vel.speed
          vel.radius += deltaTime * 5

          pos[i * 3] = Math.cos(vel.theta) * Math.sin(vel.phi) * vel.radius
          pos[i * 3 + 1] = Math.cos(vel.phi) * vel.radius * 0.5
          pos[i * 3 + 2] = Math.sin(vel.theta) * Math.sin(vel.phi) * vel.radius

          // 重置
          if (vel.radius > 100) {
            vel.radius = 5
            vel.theta = Math.random() * Math.PI * 2
            vel.phi = Math.random() * Math.PI
          }
        }
        particleGeometry.attributes.position.needsUpdate = true
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 阶段1: 时间冻结 - 碎片浮现
      shards.forEach((shard, i) => {
        gsap.to(shard.material, {
          opacity: 0.8,
          duration: 0.5,
          delay: i * 0.001,
          ease: 'power2.out'
        })
      })

      // 阶段2: 时间环出现
      timelineRingsMeshes.forEach((ring, i) => {
        gsap.to(ring.material.uniforms.uOpacity, {
          value: 0.6,
          duration: 0.5,
          delay: 0.5 + i * 0.1,
          ease: 'power2.out'
        })
      })

      // 阶段3: 漩涡开启
      gsap.delayedCall(1.5, () => {
        vortex.visible = true
        vortex.scale.setScalar(0)
      })

      gsap.to(vortex.scale, {
        x: 1, y: 1, z: 1,
        duration: 1,
        delay: 1.5,
        ease: 'elastic.out(1, 0.5)'
      })

      // 粒子爆发
      gsap.to(particleMaterial, {
        opacity: 1,
        duration: 0.5,
        delay: 2
      })

      // 阶段4: 时间重组 - 碎片飞向目标
      shards.forEach((shard, i) => {
        gsap.to(shard.position, {
          x: shard.userData.targetPos.x,
          y: shard.userData.targetPos.y,
          z: shard.userData.targetPos.z,
          duration: 2,
          delay: 2.5 + shard.userData.delay,
          ease: 'power2.inOut'
        })

        gsap.to(shard.rotation, {
          x: shard.userData.targetRot.x,
          y: shard.userData.targetRot.y,
          z: shard.userData.targetRot.z,
          duration: 2,
          delay: 2.5 + shard.userData.delay,
          ease: 'power2.inOut'
        })
      })

      // 阶段5: 回归原位
      shards.forEach((shard, i) => {
        gsap.to(shard.position, {
          x: shard.userData.originalPos.x,
          y: shard.userData.originalPos.y,
          z: shard.userData.originalPos.z,
          duration: 1.5,
          delay: 5,
          ease: 'power2.inOut'
        })

        gsap.to(shard.rotation, {
          x: shard.userData.originalRot.x,
          y: shard.userData.originalRot.y,
          z: shard.userData.originalRot.z,
          duration: 1.5,
          delay: 5,
          ease: 'power2.inOut'
        })

        gsap.to(shard.material, {
          opacity: 0,
          duration: 1,
          delay: 6
        })
      })

      // 收尾
      gsap.to(particleMaterial, {
        opacity: 0,
        duration: 1,
        delay: 6
      })

      timelineRingsMeshes.forEach((ring, i) => {
        gsap.to(ring.material.uniforms.uOpacity, {
          value: 0,
          duration: 1,
          delay: 6
        })
      })

      gsap.to(vortex.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.5,
        delay: 6,
        ease: 'power2.in',
        onComplete: () => {
          vortex.visible = false
        }
      })

      return tl
    },
    destroy() {
      shards.forEach(shard => {
        scene.remove(shard)
        shard.geometry.dispose()
        shard.material.dispose()
      })
      timelineRingsMeshes.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      scene.remove(vortex)
      scene.remove(particles)
      vortexGeometry.dispose()
      vortexMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
