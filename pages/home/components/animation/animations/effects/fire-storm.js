/**
 * effects/fire-storm.js
 * 火焰风暴特效 - 使用噪声纹理和粒子系统
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建火焰风暴
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 火焰风暴对象
 */
export function createFireStorm(scene, options = {}) {
  const {
    particleCount = 5000,
    radius = 30,
    height = 60,
    color1 = new THREE.Color(0xff4500),
    color2 = new THREE.Color(0xffa500),
    color3 = new THREE.Color(0xffff00)
  } = options

  // 创建粒子几何体
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const velocities = []
  const lifeTimes = []

  for (let i = 0; i < particleCount; i++) {
    // 初始位置：圆锥体底部
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * radius
    positions[i * 3] = Math.cos(angle) * r
    positions[i * 3 + 1] = Math.random() * 5 - 2.5
    positions[i * 3 + 2] = Math.sin(angle) * r

    // 颜色
    const colorMix = Math.random()
    let color
    if (colorMix < 0.33) {
      color = color1
    } else if (colorMix < 0.66) {
      color = color2
    } else {
      color = color3
    }
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // 大小
    sizes[i] = Math.random() * 3 + 1

    // 速度（向上螺旋）
    velocities.push({
      x: (Math.random() - 0.5) * 0.5,
      y: Math.random() * 0.5 + 0.5,
      z: (Math.random() - 0.5) * 0.5
    })

    // 生命周期
    lifeTimes.push(Math.random())
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // 粒子材质
  const textureLoader = new THREE.TextureLoader()
  const particleTexture = textureLoader.load('textures/particle.png')

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // 创建火焰球体（核心）
  const coreGeometry = new THREE.SphereGeometry(10, 32, 32)
  const coreMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: color1 },
      uColor2: { value: color2 }
    },
    vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(vec3(normalMatrix * vec4(normal, 0.0)));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec3 vNormal;

      // 简单噪声
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        float intensity = dot(vNormal, vec3(0.0, 1.0, 0.0));
        vec3 color = mix(uColor1, uColor2, intensity * 0.5 + 0.5);

        // 添加动态效果
        float noise = random(vNormal.xy + uTime);
        color *= (0.8 + noise * 0.4);

        gl_FragColor = vec4(color, 0.6);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  })

  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  scene.add(core)

  // 添加光照
  const light = new THREE.PointLight(color1, 3, 100)
  light.position.set(0, height / 2, 0)
  scene.add(light)

  return {
    particles,
    core,
    light,
    geometry,
    material,
    update(deltaTime, time) {
      const positions = particles.geometry.attributes.position.array
      const colors = particles.geometry.attributes.color.array

      for (let i = 0; i < particleCount; i++) {
        // 更新位置
        positions[i * 3] += velocities[i].x * deltaTime * 10
        positions[i * 3 + 1] += velocities[i].y * deltaTime * 20
        positions[i * 3 + 2] += velocities[i].z * deltaTime * 10

        // 螺旋效果
        const x = positions[i * 3]
        const z = positions[i * 3 + 2]
        const dist = Math.sqrt(x * x + z * z)
        const angle = Math.atan2(z, x)
        const spiralSpeed = (1 - dist / radius) * deltaTime * 2
        positions[i * 3] = Math.cos(angle + spiralSpeed) * dist
        positions[i * 3 + 2] = Math.sin(angle + spiralSpeed) * dist

        // 更新生命周期
        lifeTimes[i] -= deltaTime * 0.5

        // 重置粒子
        if (lifeTimes[i] < 0 || positions[i * 3 + 1] > height) {
          const newAngle = Math.random() * Math.PI * 2
          const newR = Math.random() * radius
          positions[i * 3] = Math.cos(newAngle) * newR
          positions[i * 3 + 1] = -5
          positions[i * 3 + 2] = Math.sin(newAngle) * newR
          lifeTimes[i] = Math.random()

          // 更新颜色（根据生命周期）
          const colorMix = Math.random()
          let color
          if (colorMix < 0.33) {
            color = color1
          } else if (colorMix < 0.66) {
            color = color2
          } else {
            color = color3
          }
          colors[i * 3] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b
        }
      }

      particles.geometry.attributes.position.needsUpdate = true
      particles.geometry.attributes.color.needsUpdate = true

      // 旋转粒子系统
      particles.rotation.y += deltaTime * 0.5

      // 更新核心
      core.material.uniforms.uTime.value = time
      core.scale.setScalar(1 + Math.sin(time * 3) * 0.1)

      // 更新光照
      light.intensity = 3 + Math.sin(time * 5) * 1
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 火焰爆发
      tl.to(material, {
        size: 5,
        duration: duration * 0.2,
        ease: 'power2.in'
      })

      tl.to(material, {
        size: 2,
        duration: duration * 0.8,
        ease: 'power2.out'
      })

      // 核心膨胀
      tl.to(core.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: duration * 0.3,
        ease: 'power2.in',
        yoyo: true,
        repeat: 1
      }, '<')

      return tl
    },
    destroy() {
      scene.remove(particles)
      scene.remove(core)
      scene.remove(light)
      geometry.dispose()
      material.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
    }
  }
}
