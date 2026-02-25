/**
 * WebGPU 极光特效
 * 使用 WGSL 着色器语言实现高性能极光效果
 * 同时支持 WebGL2 (GLSL) 和 WebGPU (WGSL)
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createCompatibleShaderMaterial } from '~/utils/WebGPURendererFactory.js'

/**
 * WebGPU 顶点着色器 (WGSL)
 */
const AURORA_VERTEX_WGSL = `
struct Uniforms {
  time: f32,
  intensity: f32,
  waveSpeed: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) worldPos: vec3<f32>,
  @location(2) elevation: f32,
}

@vertex
fn main(
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>
) -> VertexOutput {
  var output: VertexOutput;
  output.uv = uv;
  output.worldPos = position;

  var pos = position;

  // 多层波浪叠加
  let wave1 = sin(pos.x * 0.5 + uniforms.time * uniforms.waveSpeed * 2.0) * uniforms.intensity * 10.0;
  let wave2 = sin(pos.x * 0.8 + uniforms.time * uniforms.waveSpeed * 3.5) * uniforms.intensity * 7.0;
  let wave3 = sin(pos.x * 1.2 + uniforms.time * uniforms.waveSpeed * 4.8) * uniforms.intensity * 5.0;

  pos.y = pos.y + wave1 + wave2 + wave3;

  // 幅度调制
  let amplitude = sin(uniforms.time * 1.5) * 0.5 + 0.5;
  pos.y = pos.y * (1.0 + amplitude * 0.3);

  output.elevation = (wave1 + wave2 + wave3) / 22.0;
  output.position = vec4<f32>(pos, 1.0);

  return output;
}
`

/**
 * WebGL2 顶点着色器 (GLSL)
 */
const AURORA_VERTEX_GLSL = `
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
 * WebGPU 片段着色器 (WGSL)
 */
const AURORA_FRAGMENT_WGSL = `
struct Uniforms {
  time: f32,
  color: vec3<f32>,
  opacity: f32,
  intensity: f32,
  glow: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct FragmentInput {
  @location(0) uv: vec2<f32>,
  @location(1) worldPos: vec3<f32>,
  @location(2) elevation: f32,
}

// 伪随机函数
fn random(st: vec2<f32>) -> f32 {
  return fract(sin(dot(st, vec2<f32>(12.9898, 78.233))) * 43758.5453);
}

// 柏林噪声
fn noise(st: vec2<f32>) -> f32 {
  let i = floor(st);
  let f = fract(st);

  let a = random(i);
  let b = random(i + vec2<f32>(1.0, 0.0));
  let c = random(i + vec2<f32>(0.0, 1.0));
  let d = random(i + vec2<f32>(1.0, 1.0));

  let u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // 极光波段
  let band1 = noise(input.worldPos.xy * 0.02 + vec2<f32>(uniforms.time * 0.5, 0.0));
  let band2 = noise(input.worldPos.xy * 0.03 + vec2<f32>(uniforms.time * 0.7, 0.0));
  let band3 = noise(input.worldPos.xy * 0.04 + vec2<f32>(uniforms.time * 0.9, 0.0));

  let aurora = band1 * 0.4 + band2 * 0.3 + band3 * 0.3;

  // 垂直渐变
  let verticalGrad = smoothstep(0.0, 0.3, input.uv.y) * (1.0 - smoothstep(0.7, 1.0, input.uv.y));

  // 水平渐变
  let horizontalGrad = smoothstep(0.1, 0.4, input.uv.x) * (1.0 - smoothstep(0.6, 0.9, input.uv.x));

  // 色彩偏移
  var colorOffset: vec3<f32>;
  colorOffset.r = sin(uniforms.time * 0.5 + input.uv.x * 3.14159) * 0.5 + 0.5;
  colorOffset.g = sin(uniforms.time * 0.5 + input.uv.x * 3.14159 + 2.094) * 0.5 + 0.5;
  colorOffset.b = sin(uniforms.time * 0.5 + input.uv.x * 3.14159 + 4.188) * 0.5 + 0.5;

  let auroraColor = uniforms.color * colorOffset;

  // 辉光效果
  let glow = aurora * uniforms.intensity * uniforms.glow;
  let finalColor = auroraColor * (aurora + glow * 0.5);

  // 混合基础色
  let mixedColor = mix(vec3<f32>(0.0), finalColor, verticalGrad * horizontalGrad);

  let alpha = aurora * verticalGrad * horizontalGrad * uniforms.opacity;

  return vec4<f32>(mixedColor, alpha);
}
`

/**
 * WebGL2 片段着色器 (GLSL)
 */
const AURORA_FRAGMENT_GLSL = `
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
 * 创建 WebGPU 极光帷幕
 */
export function createWebGPUAuroraCurtain(scene, options = {}) {
  const {
    width = 100,
    height = 80,
    color = 0x00ff00,
    opacity = 0.8,
    intensity = 1.0,
    glow = 2.0,
    waveSpeed = 1.0,
    position = { x: 0, y: 30, z: -20 },
    rotation = { x: 0, y: 0, z: 0 },
    rendererType = 'webgl2'
  } = options

  const geometry = new THREE.PlaneGeometry(width, height, 100, 1)

  // 根据渲染器类型选择着色器
  let vertexShader, fragmentShader
  if (rendererType === 'webgpu') {
    vertexShader = AURORA_VERTEX_WGSL
    fragmentShader = AURORA_FRAGMENT_WGSL
  } else {
    vertexShader = AURORA_VERTEX_GLSL
    fragmentShader = AURORA_FRAGMENT_GLSL
  }

  const material = createCompatibleShaderMaterial(
    vertexShader,
    fragmentShader,
    {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uIntensity: { value: intensity },
      uGlow: { value: glow },
      uWaveSpeed: { value: waveSpeed }
    },
    rendererType
  )

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

  const _stopInternalAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  const _startInternalAnimation = () => {
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

    update(time) {
      material.uniforms.uTime.value = time
    },

    setColor(color) {
      material.uniforms.uColor.value = new THREE.Color(color)
    },

    setOpacity(opacity, duration = 1) {
      gsap.to(material.uniforms.uOpacity, { value: opacity, duration })
    },

    setIntensity(intensity, duration = 1) {
      gsap.to(material.uniforms.uIntensity, { value: intensity, duration })
    },

    setGlow(glow, duration = 1) {
      gsap.to(material.uniforms.uGlow, { value: glow, duration })
    },

    setWaveSpeed(speed) {
      material.uniforms.uWaveSpeed.value = speed
    },

    startAnimation() {
      _startInternalAnimation()
    },

    stopAnimation() {
      _stopInternalAnimation()
    },

    dispose() {
      _stopInternalAnimation()
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建多层 WebGPU 极光帷幕系统
 */
export function createWebGPUMultiLayerAurora(scene, options = {}) {
  const {
    layerCount = 4,
    colors = [0x00ff00, 0x00ffff, 0xff00ff, 0xffff00],
    width = 100,
    height = 80,
    spacing = 10,
    rendererType = 'webgl2'
  } = options

  const layers = []

  for (let i = 0; i < layerCount; i++) {
    const color = colors[i % colors.length]
    const layer = createWebGPUAuroraCurtain(scene, {
      width,
      height,
      color,
      position: {
        x: 0,
        y: 30 + i * spacing,
        z: -20 - i * 5
      },
      opacity: 0,
      intensity: 0,
      rendererType
    })

    layers.push({
      curtain: layer,
      color,
      phase: i * 0.5
    })
  }

  return {
    layers,

    appear(delay = 0.3) {
      layers.forEach((layer, i) => {
        setTimeout(() => {
          layer.curtain.setOpacity(0.8, 1.5)
          layer.curtain.setIntensity(1.0, 2.0)
        }, i * delay * 1000)
      })
    },

    fade(duration = 2) {
      layers.forEach(layer => {
        layer.curtain.setOpacity(0, duration)
      })
    },

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

    update(time) {
      layers.forEach((layer, i) => {
        layer.curtain.update(time + layer.phase)
        layer.curtain.mesh.rotation.y = Math.sin(time * 0.3 + i) * 0.15
        layer.curtain.mesh.rotation.x = Math.sin(time * 0.2 + i * 0.5) * 0.05
      })
    },

    dispose() {
      layers.forEach(layer => layer.curtain.dispose())
    }
  }
}
