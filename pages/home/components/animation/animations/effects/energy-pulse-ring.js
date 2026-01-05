/**
 * effects/energy-pulse-ring.js
 * 能量脉冲环特效
 * 震撼冲击、多层光波、强烈视觉冲击
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建能量脉冲环
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 脉冲环对象
 */
export function createEnergyPulseRing(scene, options = {}) {
  const {
    ringCount = 6,
    maxRadius = 80,
    baseColor = new THREE.Color(0x00ffff),
    secondaryColor = new THREE.Color(0xff00ff)
  } = options

  const rings = []
  const shockwaves = []

  // 创建主脉冲环
  for (let i = 0; i < ringCount; i++) {
    const radius = 10 + i * 12
    const tubeRadius = 2 - i * 0.2

    const geometry = new THREE.TorusGeometry(radius, tubeRadius, 16, 100)

    // 能量 Shader 材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: baseColor.clone() },
        uColor2: { value: secondaryColor.clone() },
        uRingIndex: { value: i }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uRingIndex;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vPulse;

        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);

          // 脉冲变形
          float pulse = sin(uTime * 3.0 + vPosition.y * 0.5) * 0.5 + 0.5;
          vPulse = pulse;

          vec3 pos = position;
          pos += normal * pulse * (2.0 - uRingIndex * 0.3);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uRingIndex;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vPulse;

        void main() {
          // 能量流动
          float flow = sin(vUv.x * 20.0 - uTime * 4.0) * 0.5 + 0.5;

          // 菲涅尔效应
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

          // 颜色混合
          vec3 color = mix(uColor1, uColor2, flow + uRingIndex * 0.15);

          // 脉冲光晕
          color *= 1.0 + fresnel * 3.0 + vPulse * 2.0;

          // 能量线
          float energyLine = step(0.9, sin(vUv.x * 40.0 + uTime * 5.0));
          color += vec3(1.0) * energyLine * 0.5;

          // 透明度
          float alpha = 0.4 + fresnel * 0.3 + vPulse * 0.2;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })

    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -20 + i * 5
    scene.add(ring)
    rings.push(ring)
  }

  // 创建冲击波
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.SphereGeometry(5, 64, 64)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: baseColor.clone() },
        uWaveIndex: { value: i },
        uMaxRadius: { value: maxRadius }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWaveIndex;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vRipple;

        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);

          // 波纹变形
          float ripple = sin(length(position) * 2.0 - uTime * 3.0 - uWaveIndex * 2.0);
          vRipple = ripple;

          vec3 pos = position;
          pos += normal * ripple * 2.0;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uWaveIndex;
        uniform float uMaxRadius;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vRipple;

        void main() {
          // 冲击波纹
          float wave = sin(vRipple * 3.0) * 0.5 + 0.5;

          // 边缘发光
          float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

          // 能量强度
          float intensity = wave * edge;

          vec3 color = uColor * (1.0 + intensity * 4.0);

          // 透明度渐变
          float alpha = intensity * 0.6 * (1.0 - smoothstep(0.0, uMaxRadius, length(vPosition)));

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })

    const shockwave = new THREE.Mesh(geometry, material)
    shockwave.visible = false
    scene.add(shockwave)
    shockwaves.push(shockwave)
  }

  // 能量粒子
  const particleCount = 500
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)
  const particleVelocities = []

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = Math.random() * 30

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = r * Math.cos(phi)
    particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    const color = new THREE.Color().lerpColors(baseColor, secondaryColor, Math.random())
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b

    // 径向速度
    const v = new THREE.Vector3(
      particlePositions[i * 3],
      particlePositions[i * 3 + 1],
      particlePositions[i * 3 + 2]
    ).normalize().multiplyScalar(0.5 + Math.random())
    particleVelocities.push(v)
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  particles.visible = false
  scene.add(particles)

  return {
    rings,
    shockwaves,
    particles,
    particleGeometry,
    particleVelocities,
    update(time) {
      // 更新脉冲环
      rings.forEach((ring, i) => {
        ring.material.uniforms.uTime.value = time
        ring.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1)
      })

      // 更新冲击波
      shockwaves.forEach((wave, i) => {
        if (wave.visible) {
          wave.material.uniforms.uTime.value = time
          wave.rotation.y += time * 0.02
        }
      })

      // 更新能量粒子
      if (particles.visible) {
        const positions = particleGeometry.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += particleVelocities[i].x
          positions[i * 3 + 1] += particleVelocities[i].y
          positions[i * 3 + 2] += particleVelocities[i].z

          // 重置超出的粒子
          const dist = Math.sqrt(
            positions[i * 3] ** 2 +
                        positions[i * 3 + 1] ** 2 +
                        positions[i * 3 + 2] ** 2
          )
          if (dist > maxRadius) {
            positions[i * 3] = 0
            positions[i * 3 + 1] = 0
            positions[i * 3 + 2] = 0
          }
        }
        particleGeometry.attributes.position.needsUpdate = true
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 脉冲环爆发
      rings.forEach((ring, i) => {
        gsap.to(ring.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 0.4,
          delay: i * 0.08,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        })
      })

      // 冲击波爆发
      tl.call(() => {
        shockwaves.forEach((wave, i) => {
          wave.visible = true
          wave.scale.setScalar(0.1)
        })
        particles.visible = true
      }, null, 0.5)

      tl.to(shockwaves, {
        scale: {
          x: maxRadius / 5,
          y: maxRadius / 5,
          z: maxRadius / 5
        },
        duration: 1.5,
        ease: 'power2.out'
      }, 0.5)

      tl.to(shockwaves, {
        material: {
          opacity: 0
        },
        duration: 1,
        ease: 'power2.in',
        onComplete: () => {
          shockwaves.forEach(wave => {
            wave.visible = false
            wave.material.opacity = 1
            wave.scale.setScalar(0.1)
          })
        }
      }, '<')

      // 粒子爆发
      tl.to(particles.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.5)

      return tl
    },
    destroy() {
      rings.forEach(ring => {
        scene.remove(ring)
        ring.geometry.dispose()
        ring.material.dispose()
      })
      shockwaves.forEach(wave => {
        scene.remove(wave)
        wave.geometry.dispose()
        wave.material.dispose()
      })
      scene.remove(particles)
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
