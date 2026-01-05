/**
 * effects/nebula-vortex.js
 * 星云漩涡特效
 * 梦幻浪漫、柔和星光、唯美色彩
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建星云漩涡
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 漩涡对象
 */
export function createNebulaVortex(scene, options = {}) {
  const {
    nebulaCount = 5,
    starCount = 3000,
    vortexRadius = 60
  } = options

  // 梦幻色彩
  const nebulaColors = [
    new THREE.Color(0xff69b4), // 粉色
    new THREE.Color(0x9370db), // 淡紫
    new THREE.Color(0x00bfff), // 深天蓝
    new THREE.Color(0xffa07a), // 浅珊瑚色
    new THREE.Color(0x98fb98)  // 苍绿
  ]

  const nebulas = []

  // 创建星云
  for (let i = 0; i < nebulaCount; i++) {
    const color = nebulaColors[i % nebulaColors.length]
    const radius = vortexRadius + i * 10

    const geometry = new THREE.SphereGeometry(radius, 48, 48)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color }
      },
      vertexShader: `    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          float viewDot = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float fresnel = pow(1.0 - viewDot, 3.0);
          float flow = sin(vUv.y * 10.0 + uTime * 0.5) * 0.5 + 0.5;
          float edge = 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5) * 2.0);
          vec3 glow = uColor * (0.3 + fresnel * 0.5);
          vec3 dreamColor = uColor * 1.3;
          dreamColor += vec3(0.5, 0.3, 0.8) * fresnel * 0.3;
          vec3 finalColor = mix(glow, dreamColor, flow);
          finalColor *= edge;
          float alpha = 0.2 + fresnel * 0.4;
          alpha *= edge * (0.5 + flow * 0.5);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const nebula = new THREE.Mesh(geometry, material)
    nebula.position.y = -20 + i * 10
    scene.add(nebula)
    nebulas.push(nebula)
  }

  // 创建星尘粒子
  const starGeometry = new THREE.BufferGeometry()
  const starPositions = new Float32Array(starCount * 3)
  const starColors = new Float32Array(starCount * 3)
  const starSizes = new Float32Array(starCount)

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = Math.random() * vortexRadius

    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    starPositions[i * 3 + 1] = r * Math.cos(phi)
    starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
    starColors[i * 3] = color.r
    starColors[i * 3 + 1] = color.g
    starColors[i * 3 + 2] = color.b

    starSizes[i] = Math.random() * 1.5 + 0.5
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
  starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // 光束效果
  const lightRays = []
  for (let i = 0; i < 12; i++) {
    const rayGeometry = new THREE.CylinderGeometry(0.1, 2, 80, 8)
    const rayMaterial = new THREE.MeshBasicMaterial({
      color: nebulaColors[i % nebulaColors.length],
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    })
    const ray = new THREE.Mesh(rayGeometry, rayMaterial)
    ray.position.set(0, 0, 0)
    ray.rotation.x = (Math.random() - 0.5) * Math.PI
    ray.rotation.z = (Math.random() - 0.5) * Math.PI
    scene.add(ray)
    lightRays.push(ray)
  }

  return {
    nebulas,
    stars,
    starGeometry,
    starMaterial,
    lightRays,
    update(time) {
      // 更新星云
      nebulas.forEach((nebula, i) => {
        nebula.material.uniforms.uTime.value = time
        nebula.rotation.y = time * 0.05 * (i % 2 === 0 ? 1 : -1)
        nebula.rotation.z = Math.sin(time * 0.1 + i) * 0.1
      })

      // 更新星星
      const positions = starGeometry.attributes.position.array
      for (let i = 0; i < starCount; i++) {
        const x = positions[i * 3]
        const z = positions[i * 3 + 2]
        const r = Math.sqrt(x * x + z * z)
        const angle = Math.atan2(z, x)

        const newAngle = angle + time * 0.02 / (r * 0.02 + 1)
        const newR = r * (1 + Math.sin(time * 0.5) * 0.001)

        positions[i * 3] = Math.cos(newAngle) * newR
        positions[i * 3 + 2] = Math.sin(newAngle) * newR
      }
      starGeometry.attributes.position.needsUpdate = true
      stars.rotation.y = time * 0.01

      // 更新光束
      lightRays.forEach((ray, i) => {
        ray.rotation.y += time * 0.02 * (i % 2 === 0 ? 1 : -1)
        ray.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      gsap.to(nebulas, {
        scale: 0.5,
        duration: duration * 0.3,
        ease: 'power2.in'
      })

      gsap.to(nebulas, {
        scale: 1.5,
        duration: duration * 0.7,
        ease: 'elastic.out(1, 0.4)'
      })

      tl.to(stars.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)

      tl.to(stars.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'power2.in'
      }, 0.5)

      lightRays.forEach((ray, i) => {
        gsap.to(ray.material, {
          opacity: 0.8,
          duration: 0.3,
          delay: i * 0.05,
          yoyo: true,
          repeat: 1
        })
      })

      return tl
    },
    destroy() {
      nebulas.forEach(nebula => {
        scene.remove(nebula)
        nebula.geometry.dispose()
        nebula.material.dispose()
      })
      scene.remove(stars)
      lightRays.forEach(ray => {
        scene.remove(ray)
        ray.geometry.dispose()
        ray.material.dispose()
      })
      starGeometry.dispose()
      if (starMaterial) starMaterial.dispose()
    }
  }
}
