/**
 * 统一星空系统模块
 * 整合所有特效的星空背景逻辑
 * 减少代码重复，统一视觉风格
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建星空系统
 * @param {THREE.Scene} scene - Three.js 场景
 * @param {Object} options - 配置选项
 * @returns {Object} 星空控制对象
 */
export function createStarField(scene, options = {}) {
  const {
    count = 5000,
    radius = 300,
    colorRange = [0.55, 0.65], // HSL 色相范围
    minBrightness = 0.7,
    maxBrightness = 1.0,
    twinkleSpeed = 1.0,
    size = 2,
    opacity = 0.9
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const twinklePhases = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // 球面分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 颜色
    const hue = colorRange[0] + Math.random() * (colorRange[1] - colorRange[0])
    const brightness = minBrightness + Math.random() * (maxBrightness - minBrightness)
    const color = new THREE.Color().setHSL(hue, 0.5, brightness)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = size * (0.5 + Math.random())
    twinklePhases[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let animationId = null
  let time = 0

  const update = () => {
    time += 0.016 * twinkleSpeed

    // 星星闪烁
    const colors = points.geometry.attributes.color.array

    for (let i = 0; i < count; i++) {
      const twinkle = 0.5 + 0.5 * Math.sin(time + twinklePhases[i])
      const baseColor = new THREE.Color()
      baseColor.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
      baseColor.multiplyScalar(0.8 + twinkle * 0.2)

      colors[i * 3] = baseColor.r
      colors[i * 3 + 1] = baseColor.g
      colors[i * 3 + 2] = baseColor.b
    }

    points.geometry.attributes.color.needsUpdate = true
  }

  const startAnimation = () => {
    if (animationId) return
    const animate = () => {
      update()
      points.rotation.y += 0.0002
      animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  return {
    mesh: points,
    material,
    geometry,

    /**
     * 淡入显示
     */
    appear(duration = 3) {
      gsap.to(material, { opacity, duration })
    },

    /**
     * 淡出隐藏
     */
    fade(duration = 3) {
      gsap.to(material, { opacity: 0, duration })
    },

    /**
     * 更新动画
     */
    update(time) {
      const colors = points.geometry.attributes.color.array

      for (let i = 0; i < count; i++) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * twinkleSpeed + twinklePhases[i])
        const baseColor = new THREE.Color()
        baseColor.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
        baseColor.multiplyScalar(0.8 + twinkle * 0.2)

        colors[i * 3] = baseColor.r
        colors[i * 3 + 1] = baseColor.g
        colors[i * 3 + 2] = baseColor.b
      }

      points.geometry.attributes.color.needsUpdate = true
    },

    /**
     * 旋转星空
     */
    rotate(y) {
      points.rotation.y = y
    },

    /**
     * 开始动画
     */
    startAnimation() {
      startAnimation()
    },

    /**
     * 停止动画
     */
    stopAnimation() {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    },

    /**
     * 释放资源
     */
    dispose() {
      stopAnimation()
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建带自定义着色器的星空系统
 * @param {THREE.Scene} scene - Three.js 场景
 * @param {Object} options - 配置选项
 * @returns {Object} 星空控制对象
 */
export function createShaderStarField(scene, options = {}) {
  const {
    count = 8000,
    radius = 300,
    colorRange = [0.55, 0.65],
    minBrightness = 0.7,
    maxBrightness = 1.0,
    twinkleSpeed = 1.0,
    size = 2,
    opacity = 0.9
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const twinklePhases = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = colorRange[0] + Math.random() * (colorRange[1] - colorRange[0])
    const brightness = minBrightness + Math.random() * (maxBrightness - minBrightness)
    const color = new THREE.Color().setHSL(hue, 0.5, brightness)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = size * (0.5 + Math.random())
    twinklePhases[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(twinklePhases, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uTwinkleSpeed: { value: twinkleSpeed }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform float uTwinkleSpeed;

      attribute float size;
      attribute vec3 color;
      attribute float phase;

      varying vec3 vColor;
      varying float vTwinkle;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 星星闪烁
        float twinkle = sin(uTime * uTwinkleSpeed * 3.0 + phase) * 0.5 + 0.5;
        vTwinkle = twinkle;

        pos *= (1.0 + twinkle * 0.01);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;

      varying vec3 vColor;
      varying float vTwinkle;

      void main() {
        // 圆形粒子
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.3, dist);

        vec3 color = vColor * (0.8 + vTwinkle * 0.2);
        gl_FragColor = vec4(color, alpha * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  let animationId = null

  const update = () => {
    material.uniforms.uTime.value += 0.016
    points.rotation.y += 0.0002
  }

  const startAnimation = () => {
    if (animationId) return
    const animate = () => {
      update()
      animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  return {
    mesh: points,
    material,
    geometry,

    /**
     * 淡入显示
     */
    appear(duration = 3) {
      gsap.to(material.uniforms.uOpacity, { value: opacity, duration })
    },

    /**
     * 淡出隐藏
     */
    fade(duration = 3) {
      gsap.to(material.uniforms.uOpacity, { value: 0, duration })
    },

    /**
     * 更新动画
     */
    update(time) {
      material.uniforms.uTime.value = time
    },

    /**
     * 旋转星空
     */
    rotate(y) {
      points.rotation.y = y
    },

    /**
     * 开始动画
     */
    startAnimation() {
      startAnimation()
    },

    /**
     * 停止动画
     */
    stopAnimation() {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    },

    /**
     * 释放资源
     */
    dispose() {
      stopAnimation()
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}
