/**
 * effects/quantum-rainbow-tunnel.js
 * 量子彩虹隧道特效
 * 前卫科技感、七彩霓虹、速度穿越
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建量子彩虹隧道
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 隧道对象
 */
export function createQuantumRainbowTunnel(scene, options = {}) {
  const {
    radius = 25,
    length = 150,
    segmentCount = 8,
    speed = 3.0
  } = options

  // 彩虹颜色渐变
  const rainbowColors = [
    new THREE.Color(0xff0000), // 红
    new THREE.Color(0xff7f00), // 橙
    new THREE.Color(0xffff00), // 黄
    new THREE.Color(0x00ff00), // 绿
    new THREE.Color(0x0000ff), // 蓝
    new THREE.Color(0x4b0082), // 靛
    new THREE.Color(0x9400d3)  // 紫
  ]

  const tunnels = []

  // 创建多层彩虹隧道
  for (let i = 0; i < segmentCount; i++) {
    const color = rainbowColors[i % rainbowColors.length]
    const currentRadius = radius + i * 3

    const geometry = new THREE.CylinderGeometry(
      currentRadius,
      currentRadius,
      length,
      64,
      100,
      true
    )

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uColor: { value: color },
        uSegmentIndex: { value: i }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSegmentIndex;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDist;

        void main() {
          vUv = uv;
          vPosition = position;
          vDist = length(position.xz);

          // 螺旋扭曲
          float angle = atan(position.z, position.x);
          float spiral = sin(angle * 6.0 + uTime * 0.5 + uSegmentIndex * 0.5) * 2.0;
          
          vec3 pos = position;
          pos.y += spiral;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uSpeed;
        uniform vec3 uColor;
        uniform float uSegmentIndex;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDist;

        void main() {
          // 速度线效果
          float speedLine = sin(vUv.y * 50.0 - uTime * uSpeed * 5.0);
          
          // 螺旋光带
          float spiral = sin(atan(vPosition.z, vPosition.x) * 8.0 + uTime * 0.3 + vUv.y * 10.0);
          
          // 霓虹发光
          float glow = pow(spiral * 0.5 + 0.5, 3.0);
          
          // 速度模糊
          float motion = smoothstep(0.3, 0.7, abs(speedLine));
          
          vec3 color = uColor * (1.0 + glow * 2.0);
          color *= 1.0 + motion * 0.5;
          
          // 透明度渐变
          float alpha = 0.3 + glow * 0.4;
          alpha *= 1.0 - smoothstep(0.4, 0.5, abs(vUv.x - 0.5) * 2.0);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const tunnel = new THREE.Mesh(geometry, material)
    tunnel.rotation.x = Math.PI / 2
    tunnel.position.y = -length / 2 + i * 2
    scene.add(tunnel)
    tunnels.push(tunnel)
  }

  // 能量粒子流
  const particleCount = 2000
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleColors = new Float32Array(particleCount * 3)
  const particleSizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * radius * 1.5
    const y = (Math.random() - 0.5) * length

    particlePositions[i * 3] = Math.cos(angle) * r
    particlePositions[i * 3 + 1] = y
    particlePositions[i * 3 + 2] = Math.sin(angle) * r

    const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b

    particleSizes[i] = Math.random() * 2 + 0.5
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)

  return {
    tunnels,
    particles,
    particleGeometry,
    update(time) {
      // 更新隧道
      tunnels.forEach((tunnel, i) => {
        tunnel.material.uniforms.uTime.value = time
        tunnel.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1)
      })

      // 更新粒子
      const positions = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += speed * 2
        if (positions[i * 3 + 1] > length / 2) {
          positions[i * 3 + 1] = -length / 2
        }
      }
      particleGeometry.attributes.position.needsUpdate = true
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 隧道加速
      gsap.to(tunnels, {
        scale: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        duration: duration * 0.3,
        ease: 'power2.in'
      })

      // 隧道爆发
      gsap.to(tunnels, {
        scale: {
          x: 1.5,
          y: 1.5,
          z: 1.5
        },
        duration: duration * 0.7,
        ease: 'elastic.out(1, 0.3)'
      })

      // 粒子爆发
      tl.to(particles.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)

      tl.to(particles.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'power2.in'
      }, 0.5)

      return tl
    },
    destroy() {
      tunnels.forEach(tunnel => {
        scene.remove(tunnel)
        tunnel.geometry.dispose()
        tunnel.material.dispose()
      })
      scene.remove(particles)
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
