/**
 * 统一极光着色器模块
 * 整合所有极光特效的着色器逻辑
 * 减少代码重复，统一视觉效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 统一极光着色器配置
 */
export const AURORA_SHADER_CONFIG = {
  // 波形参数
  waveIntensity: 1.0,
  waveSpeed: 1.0,
  waveLayers: 3,

  // 色彩参数
  colorPalette: [
    0x00ff00, // 绿色
    0x00ffff, // 青色
    0xff00ff, // 紫色
    0xffff00, // 黄色
    0x0066ff  // 蓝色
  ],

  // 强度参数
  opacity: 0.8,
  intensity: 1.0,
  glow: 2.0
}

/**
 * 统一顶点着色器
 * 多层波浪叠加，模拟极光波动效果
 */
export const AURORA_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uWaveSpeed;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vElevation;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;

    // 多层波浪叠加
    float wave1 = sin(pos.x * 0.5 + uTime * uWaveSpeed * 2.0) * uIntensity * 10.0;
    float wave2 = sin(pos.x * 0.8 + uTime * uWaveSpeed * 3.5) * uIntensity * 7.0;
    float wave3 = sin(pos.x * 1.2 + uTime * uWaveSpeed * 4.8) * uIntensity * 5.0;

    pos.y += wave1 + wave2 + wave3;

    // 幅度调制
    float amplitude = sin(uTime * 1.5) * 0.5 + 0.5;
    pos.y *= (1.0 + amplitude * 0.3);

    vElevation = (wave1 + wave2 + wave3) / 22.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 统一片段着色器
 * 使用柏林噪声生成极光波段效果
 */
export const AURORA_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uIntensity;
  uniform float uGlow;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vElevation;

  // 伪随机函数
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 柏林噪声
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // 极光波段
    float band1 = noise(vPosition.xy * 0.02 + vec2(uTime * 0.5, 0.0));
    float band2 = noise(vPosition.xy * 0.03 + vec2(uTime * 0.7, 0.0));
    float band3 = noise(vPosition.xy * 0.04 + vec2(uTime * 0.9, 0.0));

    float aurora = band1 * 0.4 + band2 * 0.3 + band3 * 0.3;

    // 垂直渐变
    float verticalGrad = smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));

    // 水平渐变
    float horizontalGrad = smoothstep(0.1, 0.4, vUv.x) * (1.0 - smoothstep(0.6, 0.9, vUv.x));

    // 色彩偏移
    vec3 colorOffset;
    colorOffset.r = sin(uTime * 0.5 + vUv.x * 3.14159) * 0.5 + 0.5;
    colorOffset.g = sin(uTime * 0.5 + vUv.x * 3.14159 + 2.094) * 0.5 + 0.5;
    colorOffset.b = sin(uTime * 0.5 + vUv.x * 3.14159 + 4.188) * 0.5 + 0.5;

    vec3 auroraColor = uColor * colorOffset;

    // 辉光效果
    float glow = aurora * uIntensity * uGlow;
    vec3 finalColor = auroraColor * (aurora + glow * 0.5);

    // 混合基础色
    finalColor = mix(vec3(0.0), finalColor, verticalGrad * horizontalGrad);

    float alpha = aurora * verticalGrad * horizontalGrad * uOpacity;

    gl_FragColor = vec4(finalColor, alpha);
  }
`

/**
 * 创建极光帷幕工厂函数
 * @param {THREE.Scene} scene - Three.js 场景
 * @param {Object} options - 配置选项
 * @returns {Object} 极光帷幕控制对象
 */
export function createAuroraCurtain(scene, options = {}) {
  const {
    width = 100,
    height = 80,
    color = 0x00ff00,
    opacity = 0.8,
    intensity = 1.0,
    glow = 2.0,
    waveSpeed = 1.0,
    position = { x: 0, y: 30, z: -20 },
    rotation = { x: 0, y: 0, z: 0 }
  } = options

  const geometry = new THREE.PlaneGeometry(width, height, 100, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uIntensity: { value: intensity },
      uGlow: { value: glow },
      uWaveSpeed: { value: waveSpeed }
    },
    vertexShader: AURORA_VERTEX_SHADER,
    fragmentShader: AURORA_FRAGMENT_SHADER,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(position.x, position.y, position.z)
  mesh.rotation.set(rotation.x, rotation.y, rotation.z)
  scene.add(mesh)

  let animationId = null
  let time = 0

  const update = () => {
    time += 0.016
    material.uniforms.uTime.value = time
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
    mesh,
    material,

    /**
     * 更新极光动画
     */
    update(time) {
      material.uniforms.uTime.value = time
    },

    /**
     * 设置颜色
     */
    setColor(color) {
      material.uniforms.uColor.value = new THREE.Color(color)
    },

    /**
     * 设置透明度
     */
    setOpacity(opacity, duration = 1) {
      gsap.to(material.uniforms.uOpacity, { value: opacity, duration })
    },

    /**
     * 设置强度
     */
    setIntensity(intensity, duration = 1) {
      gsap.to(material.uniforms.uIntensity, { value: intensity, duration })
    },

    /**
     * 设置辉光强度
     */
    setGlow(glow, duration = 1) {
      gsap.to(material.uniforms.uGlow, { value: glow, duration })
    },

    /**
     * 设置波速
     */
    setWaveSpeed(speed) {
      material.uniforms.uWaveSpeed.value = speed
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
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建多层极光帷幕系统
 * @param {THREE.Scene} scene - Three.js 场景
 * @param {Object} options - 配置选项
 * @returns {Object} 多层极光控制对象
 */
export function createMultiLayerAurora(scene, options = {}) {
  const {
    layerCount = 4,
    colors = [0x00ff00, 0x00ffff, 0xff00ff, 0xffff00],
    width = 100,
    height = 80,
    spacing = 10
  } = options

  const layers = []

  for (let i = 0; i < layerCount; i++) {
    const color = colors[i % colors.length]
    const layer = createAuroraCurtain(scene, {
      width,
      height,
      color,
      position: {
        x: 0,
        y: 30 + i * spacing,
        z: -20 - i * 5
      },
      opacity: 0,
      intensity: 0
    })

    layers.push({
      curtain: layer,
      color,
      phase: i * 0.5
    })
  }

  return {
    layers,

    /**
     * 依次显示所有层
     */
    appear(delay = 0.3) {
      layers.forEach((layer, i) => {
        setTimeout(() => {
          layer.curtain.setOpacity(0.8, 1.5)
          layer.curtain.setIntensity(1.0, 2.0)
        }, i * delay * 1000)
      })
    },

    /**
     * 依次隐藏所有层
     */
    fade(duration = 2) {
      layers.forEach(layer => {
        layer.curtain.setOpacity(0, duration)
      })
    },

    /**
     * 颜色循环动画
     */
    animateColors(duration = 5) {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000
        layers.forEach((layer, i) => {
          const hue = (elapsed * 0.1 + i * 0.1) % 1
          const color = new THREE.Color().setHSL(hue, 1, 0.5)
          layer.curtain.setColor(color)
        })
        if (elapsed < duration) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    },

    /**
     * 更新所有层
     */
    update(time) {
      layers.forEach((layer, i) => {
        layer.curtain.update(time + layer.phase)
        layer.curtain.mesh.rotation.y = Math.sin(time * 0.3 + i) * 0.15
        layer.curtain.mesh.rotation.x = Math.sin(time * 0.2 + i * 0.5) * 0.05
      })
    },

    /**
     * 释放所有层
     */
    dispose() {
      layers.forEach(layer => layer.curtain.dispose())
    }
  }
}
