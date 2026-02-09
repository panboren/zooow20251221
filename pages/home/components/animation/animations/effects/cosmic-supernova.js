/**
 * effects/cosmic-supernova.js
 * 宇宙超级新星爆炸特效
 * 毁灭、重生、震撼
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 获取新星颜色
 */
function getNovaColor(progress) {
  const colors = [
    { t: 0.0, color: new THREE.Color(0xff0000) },   // 红
    { t: 0.2, color: new THREE.Color(0xff6600) },   // 橙
    { t: 0.4, color: new THREE.Color(0xffff00) },   // 黄
    { t: 0.6, color: new THREE.Color(0xffffff) },   // 白
    { t: 0.8, color: new THREE.Color(0x00ffff) },   // 青
    { t: 1.0, color: new THREE.Color(0xff00ff) }    // 紫
  ]

  for (let i = 0; i < colors.length - 1; i++) {
    if (progress >= colors[i].t && progress <= colors[i + 1].t) {
      const t = (progress - colors[i].t) / (colors[i + 1].t - colors[i].t)
      return colors[i].color.clone().lerp(colors[i + 1].color, t)
    }
  }
  return colors[0].color.clone()
}

/**
 * 创建宇宙超级新星爆炸
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 新星对象
 */
export function createCosmicSupernova(scene, options = {}) {
  const {
    particleCount = 15000,
    shockwaveCount = 5
  } = options

  // 核心光球
  const coreGeometry = new THREE.SphereGeometry(5, 64, 64)
  const coreMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xff6600) },
      uIntensity: { value: 1 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        vec3 pos = position;
        float noise = sin(pos.x * 3.0 + uTime * 10.0) * cos(pos.y * 3.0 + uTime * 8.0) * 0.3;
        pos += normal * noise * uIntensity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        float pulse = sin(uTime * 20.0) * 0.3 + 0.7;
        float turbulence = sin(vPos.x * 5.0 + uTime * 15.0) * sin(vPos.y * 5.0 + uTime * 12.0) * 0.5 + 0.5;
        vec3 color = uColor * (1.0 + turbulence * 0.5);
        color += vec3(1.0, 0.8, 0.5) * fresnel * pulse * uIntensity;
        float alpha = 0.8 + fresnel * 0.2;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  })

  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  core.scale.setScalar(0)
  scene.add(core)

  // 爆炸粒子
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  const velocities = []

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0

    const hue = Math.random() * 0.3
    const color = new THREE.Color().setHSL(hue, 1, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 3 + 1

    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const speed = 30 + Math.random() * 50
    velocities.push({
      x: Math.sin(phi) * Math.cos(theta) * speed,
      y: Math.cos(phi) * speed,
      z: Math.sin(phi) * Math.sin(theta) * speed
    })
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

  // 冲击波环
  const shockwaves = []
  for (let i = 0; i < shockwaveCount; i++) {
    const geometry = new THREE.TorusGeometry(20, 1, 32, 100)
    const material = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const shockwave = new THREE.Mesh(geometry, material)
    shockwave.rotation.x = Math.PI / 2
    shockwave.visible = false
    scene.add(shockwave)
    shockwaves.push(shockwave)
  }

  // 辐射光束
  const beams = []
  const beamCount = 24
  for (let i = 0; i < beamCount; i++) {
    const geometry = new THREE.CylinderGeometry(0.5, 3, 150, 8)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const beam = new THREE.Mesh(geometry, material)
    beam.position.y = 75
    beam.rotation.x = Math.PI / 2
    beam.rotation.z = (i / beamCount) * Math.PI * 2
    beam.visible = false
    scene.add(beam)
    beams.push(beam)
  }

  return {
    core,
    particles,
    particleGeometry,
    shockwaves,
    beams,
    update(deltaTime, time) {
      core.material.uniforms.uTime.value = time

      // 更新粒子
      const pos = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        if (particleMaterial.opacity > 0) {
          pos[i * 3] += velocities[i].x * deltaTime
          pos[i * 3 + 1] += velocities[i].y * deltaTime
          pos[i * 3 + 2] += velocities[i].z * deltaTime
        }
      }
      particleGeometry.attributes.position.needsUpdate = true

      // 更新冲击波
      shockwaves.forEach((wave, i) => {
        if (wave.visible) {
          wave.scale.multiplyScalar(1 + deltaTime * 2)
          wave.material.opacity -= deltaTime * 0.3
          if (wave.material.opacity < 0) {
            wave.material.opacity = 0
            wave.visible = false
          }
        }
      })

      // 更新光束
      beams.forEach((beam, i) => {
        if (beam.visible) {
          beam.rotation.z += deltaTime * 0.5
          beam.material.opacity -= deltaTime * 0.2
          if (beam.material.opacity < 0) {
            beam.material.opacity = 0
            beam.visible = false
          }
        }
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 阶段1: 蓄能收缩
      gsap.to(core.scale, {
        x: 0.3, y: 0.3, z: 0.3,
        duration: 0.5,
        ease: 'power2.in'
      })

      gsap.to(core.material.uniforms.uIntensity, {
        value: 3,
        duration: 0.5
      })

      // 阶段2: 爆炸扩张
      gsap.to(core.scale, {
        x: 3, y: 3, z: 3,
        duration: 0.3,
        delay: 0.5,
        ease: 'power4.out'
      })

      // 颜色变化
      const colorSequence = [
        { t: 0, color: 0xff0000 },
        { t: 0.2, color: 0xff6600 },
        { t: 0.4, color: 0xffff00 },
        { t: 0.6, color: 0xffffff },
        { t: 0.8, color: 0x00ffff },
        { t: 1, color: 0xff00ff }
      ]

      colorSequence.forEach(seq => {
        gsap.to(core.material.uniforms.uColor.value, {
          r: new THREE.Color(seq.color).r,
          g: new THREE.Color(seq.color).g,
          b: new THREE.Color(seq.color).b,
          duration: 0.2,
          delay: 0.5 + seq.t * duration * 0.5
        })
      })

      // 粒子爆发
      gsap.to(particleMaterial, {
        opacity: 1,
        duration: 0.2,
        delay: 0.5
      })

      gsap.to(particleMaterial, {
        opacity: 0,
        duration: 2,
        delay: 0.7,
        ease: 'power2.in'
      })

      // 冲击波扩散
      shockwaves.forEach((wave, i) => {
        gsap.delayedCall(0.5 + i * 0.15, () => {
          wave.visible = true
          wave.scale.setScalar(0.1)
          wave.material.opacity = 0.8
        })
      })

      // 光束发射
      beams.forEach((beam, i) => {
        gsap.delayedCall(0.5 + i * 0.02, () => {
          beam.visible = true
          beam.material.opacity = 0.6
        })
      })

      // 核心收缩
      gsap.to(core.scale, {
        x: 0.1, y: 0.1, z: 0.1,
        duration: 1.5,
        delay: 1.5,
        ease: 'power2.in'
      })

      gsap.to(core.material.uniforms.uIntensity, {
        value: 0.5,
        duration: 1.5,
        delay: 1.5
      })

      return tl
    },
    destroy() {
      scene.remove(core)
      scene.remove(particles)
      shockwaves.forEach(wave => {
        scene.remove(wave)
        wave.geometry.dispose()
        wave.material.dispose()
      })
      beams.forEach(beam => {
        scene.remove(beam)
        beam.geometry.dispose()
        beam.material.dispose()
      })
      coreGeometry.dispose()
      coreMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }
}
