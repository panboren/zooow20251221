/**
 * effects/cherry-blossom.js
 * 樱花飘落特效
 * 诗意、柔美、浪漫
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建花瓣纹理
 */
function createPetalTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  // 绘制樱花花瓣形状
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 220, 225, 0.8)')
  gradient.addColorStop(1, 'rgba(255, 200, 210, 0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(32, 8)
  ctx.bezierCurveTo(56, 8, 56, 32, 56, 48)
  ctx.bezierCurveTo(56, 56, 48, 64, 32, 56)
  ctx.bezierCurveTo(16, 64, 8, 56, 8, 48)
  ctx.bezierCurveTo(8, 32, 8, 8, 32, 8)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * 创建樱花飘落
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 樱花对象
 */
export function createCherryBlossom(scene, options = {}) {
  const {
    petalCount = 2000,
    treeRadius = 30,
    fallHeight = 100
  } = options

  // 樱花颜色渐变
  const sakuraColors = [
    new THREE.Color(0xffb7c5), // 浅粉
    new THREE.Color(0xffaeb9), // 粉红
    new THREE.Color(0xffccd5), // 淡粉
    new THREE.Color(0xffffff)   // 纯白
  ]

  // 创建花瓣粒子
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(petalCount * 3)
  const colors = new Float32Array(petalCount * 3)
  const scales = new Float32Array(petalCount)
  const phases = new Float32Array(petalCount)

  for (let i = 0; i < petalCount; i++) {
    // 初始位置（树冠区域）
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * treeRadius

    positions[i * 3] = r * Math.cos(angle)
    positions[i * 3 + 1] = 20 + Math.random() * 30
    positions[i * 3 + 2] = r * Math.sin(angle)

    // 随机颜色
    const color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // 随机大小
    scales[i] = 0.3 + Math.random() * 0.7

    // 随机相位
    phases[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

  // 花瓣材质
  const petalTexture = createPetalTexture()

  const petalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: petalTexture }
    },
    vertexShader: `
      attribute float scale;
      attribute float phase;
      attribute vec3 color;
      varying vec2 vUv;
      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vUv = uv;
        vColor = color;
        vPhase = phase;

        vec3 pos = position;
        pos *= scale;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 30.0 * scale * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vec4 texColor = texture(uTexture, vUv);
        float shimmer = sin(uTime * 2.0 + vPhase) * 0.1 + 0.9;
        gl_FragColor = vec4(vColor * shimmer, texColor.a * 0.9);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const petals = new THREE.Points(geometry, petalMaterial)
  scene.add(petals)

  // 诗意光效
  const ambientLight = new THREE.AmbientLight(0xffb7c5, 0.4)
  scene.add(ambientLight)

  const sunLight = new THREE.DirectionalLight(0xffe4b5, 1.2)
  sunLight.position.set(50, 80, 50)
  scene.add(sunLight)

  // 柔和的光晕
  const glowGeometry = new THREE.SphereGeometry(40, 32, 32)
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xffb7c5) }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(vec3(normalMatrix * vec4(normal, 0.0)));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(uColor, intensity * 0.15);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  scene.add(glow)

  return {
    petals,
    geometry,
    material: petalMaterial,
    glow,
    petalTexture,
    ambientLight,
    sunLight,
    update(deltaTime, time) {
      const positions = geometry.attributes.position.array

      for (let i = 0; i < petalCount; i++) {
        // 飘落动画
        positions[i * 3 + 1] -= deltaTime * 8

        // 左右摇摆
        positions[i * 3] += Math.sin(time * 2 + phases[i]) * deltaTime * 5
        positions[i * 3 + 2] += Math.cos(time * 2 + phases[i]) * deltaTime * 5

        // 重置到顶部
        if (positions[i * 3 + 1] < -50) {
          const angle = Math.random() * Math.PI * 2
          const r = Math.random() * treeRadius
          positions[i * 3] = r * Math.cos(angle)
          positions[i * 3 + 1] = 50
          positions[i * 3 + 2] = r * Math.sin(angle)
        }
      }

      geometry.attributes.position.needsUpdate = true
      petalMaterial.uniforms.uTime.value = time

      // 光晕呼吸
      glow.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05)
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 光效增强
      tl.to(sunLight, {
        intensity: 2.0,
        duration: duration * 0.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })

      return tl
    },
    destroy() {
      scene.remove(petals)
      scene.remove(ambientLight)
      scene.remove(sunLight)
      scene.remove(glow)
      geometry.dispose()
      petalMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      petalTexture.dispose()
    }
  }
}
