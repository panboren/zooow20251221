/**
 * 🔥 火之神神乐 - Hinokami Kagura
 *
 * 这是一个融合了以下前沿视觉技术的终极特效：
 * 1. 弯曲火焰状刀光 - 使用 ShaderMaterial 实现
 * 2. 动态火焰流动 - 着色器实时计算
 * 3. 灼热粒子散落 - 高性能粒子系统
 * 4. 地面焦黑痕迹 - 程序化生成
 * 5. 电影级运镜 - 6 阶段配合特效
 *
 * 视觉表现：
 * - 弯曲的火焰刀光，从橙红到黄渐变
 * - 火焰沿刀身流动，动态变化
 * - 火星粒子四散落下
 * - 地面留下焦黑轨迹
 *
 * 创作灵感来源：
 * - 《鬼灭之刃》火之神神乐
 * - 炎之呼吸动画效果
 * - 火焰粒子模拟
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

/**
 * 火焰刀光着色器 - 顶点着色器
 */
const flameBladeVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uWaveSpeed;
  uniform float uWaveAmplitude;

  attribute float aIndex;
  attribute float aProgress;

  varying vec2 vUv;
  varying float vProgress;
  varying float vFlicker;

  void main() {
    vUv = uv;
    vProgress = aProgress;

    // 火焰闪烁
    vFlicker = sin(uTime * 15.0 + aIndex * 10.0) * 0.5 + 0.5;

    vec3 pos = position;

    // 弯曲效果 - 沿刀身方向的正弦波
    float bend = sin(aProgress * 10.0 + uTime * uWaveSpeed) * uWaveAmplitude * vFlicker;
    pos.x += bend * (1.0 - aProgress);  // 越靠近刀尖弯曲越大

    // 宽度波动
    float widthPulse = sin(uTime * 8.0 + aIndex * 5.0) * 0.1 + 0.9;
    pos.y *= widthPulse;

    // 强度影响顶点位置
    pos += normal * uIntensity * vFlicker * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 火焰刀光着色器 - 片元着色器
 */
const flameBladeFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uIntensity;

  varying vec2 vUv;
  varying float vProgress;
  varying float vFlicker;

  // 噪声函数
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
  }

  void main() {
    // 火焰流动效果
    float flow1 = noise(vec2(vUv.x * 5.0, vUv.y * 10.0 - uTime * 3.0));
    float flow2 = noise(vec2(vUv.x * 10.0, vUv.y * 15.0 - uTime * 4.0));
    float flow = (flow1 + flow2) * 0.5;

    // 颜色渐变：橙红 -> 黄
    vec3 color = mix(uColor1, uColor2, vProgress + flow * 0.3);

    // 强度增强
    color *= (0.8 + flow * 0.4 + vFlicker * 0.3);

    // 边缘发光
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    color += vec3(1.0, 0.8, 0.4) * pow(edge, 2.0) * 0.5;

    // 刀尖更亮
    float tip = smoothstep(0.7, 1.0, vProgress);
    color += vec3(1.0, 0.95, 0.6) * tip * 0.8;

    // 透明度渐变
    float alpha = vProgress * uOpacity;
    alpha *= (0.6 + flow * 0.4);

    // 强度影响透明度
    alpha *= uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 火星粒子着色器 - 顶点着色器
 */
const sparkVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aDelay;
  attribute float aAngle;
  attribute float aHeight;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    // 火星下落运动
    float fallTime = max(0.0, uTime - aDelay);
    float fall = fallTime * aSpeed * 5.0;
    pos.y -= fall;

    // 水平扩散
    float spread = sin(aAngle) * fall * 0.3;
    pos.x += spread;
    pos.z += cos(aAngle) * fall * 0.3;

    // 旋转
    float rotation = fallTime * aSpeed * 2.0;
    mat2 rot = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    pos.xz = rot * pos.xz;

    // 距离衰减
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPosition.z;

    // 动态大小
    float pulse = 1.0 + sin(uTime * 10.0 + aDelay) * 0.3;
    gl_PointSize = aSize * (200.0 / dist) * pulse;

    gl_Position = projectionMatrix * mvPosition;

    // 透明度渐变
    float progress = clamp(fall / 3.0, 0.0, 1.0);
    vAlpha = (1.0 - progress) * uOpacity;

    // 颜色变化：黄 -> 橙 -> 红暗淡
    vec3 yellow = vec3(1.0, 0.9, 0.4);
    vec3 orange = vec3(1.0, 0.5, 0.1);
    vec3 dark = vec3(0.3, 0.1, 0.0);

    if (progress < 0.5) {
      vColor = mix(yellow, orange, progress * 2.0);
    } else {
      vColor = mix(orange, dark, (progress - 0.5) * 2.0);
    }
  }
`

/**
 * 火星粒子着色器 - 片元着色器
 */
const sparkFragmentShader = `
  precision highp float;

  uniform float uOpacity;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // 圆形粒子
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);

    if (dist > 0.5) discard;

    // 软边缘
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    alpha *= vAlpha;

    // 中心亮斑
    float center = exp(-dist * 8.0);
    vec3 color = vColor + center * 0.5;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 焦黑痕迹着色器 - 顶点着色器
 */
const scorchVertexShader = `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * 焦黑痕迹着色器 - 片元着色器
 */
const scorchFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    // 焦黑颜色
    vec3 darkBrown = vec3(0.15, 0.08, 0.05);
    vec3 black = vec3(0.02, 0.01, 0.01);

    // 边缘羽化
    float edge = length(vPosition.xz) / 5.0;
    edge = 1.0 - smoothstep(0.8, 1.0, edge);

    vec3 color = mix(black, darkBrown, edge * 0.5);

    // 热浪效果
    float heat = sin(vUv.y * 20.0 - uTime * 2.0) * 0.1 + 0.1;
    color += vec3(heat, heat * 0.5, 0.0);

    // 透明度
    float alpha = edge * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 创建火焰刀光网格
 */
function createFlameBlade() {
  // 使用 PlaneGeometry 创建刀光形状
  const geometry = new THREE.PlaneGeometry(1, 10, 30, 60)

  // 添加自定义属性
  const indices = []
  const progresses = []

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const y = geometry.attributes.position.getY(i)
    // y 从 -5 到 5，归一化到 0-1
    const progress = (y + 5) / 10
    indices.push(i)
    progresses.push(progress)
  }

  geometry.setAttribute('aIndex', new THREE.Float32BufferAttribute(indices, 1))
  geometry.setAttribute('aProgress', new THREE.Float32BufferAttribute(progresses, 1))

  return geometry
}

/**
 * 创建火星粒子系统
 */
function createSparkParticles(count = 1000) {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const delays = new Float32Array(count)
  const angles = new Float32Array(count)
  const heights = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // 初始位置在刀光附近
    positions[i * 3] = (Math.random() - 0.5) * 2
    positions[i * 3 + 1] = Math.random() * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2

    sizes[i] = Math.random() * 3 + 1
    speeds[i] = 0.5 + Math.random() * 1.5
    delays[i] = Math.random() * 3  // 延迟发射
    angles[i] = Math.random() * Math.PI * 2
    heights[i] = Math.random() * 5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
  geometry.setAttribute('aHeight', new THREE.BufferAttribute(heights, 1))

  return geometry
}

/**
 * 主特效函数
 */
export default function animateHinokamiKagura(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  let cleaned = false
  const originalBackground = scene.background?.clone()

  try {
    // ==================== 环境设置 ====================
    scene.background = new THREE.Color(0x1a0a05)  // 深褐色背景

    setupInitialCamera(camera, new THREE.Vector3(0, 5, 20), 90, controls)
    camera.lookAt(0, 0, 0)

    // ==================== 创建主组 ====================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 1. 火焰刀光 ====================
    const bladeGeometry = createFlameBlade()
    const bladeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 0 },
        uWaveSpeed: { value: 5.0 },
        uWaveAmplitude: { value: 0.3 },
        uColor1: { value: new THREE.Color('#ff4500') },  // 橙红
        uColor2: { value: new THREE.Color('#ffd700') }   // 金黄
      },
      vertexShader: flameBladeVertexShader,
      fragmentShader: flameBladeFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial)
    blade.rotation.z = Math.PI * 0.25  // 刀光倾斜
    mainGroup.add(blade)

    // ==================== 2. 火星粒子 ====================
    const sparkGeometry = createSparkParticles(1500)
    const sparkMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: sparkVertexShader,
      fragmentShader: sparkFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const sparks = new THREE.Points(sparkGeometry, sparkMaterial)
    mainGroup.add(sparks)

    // ==================== 3. 焦黑痕迹 ====================
    const scorchGeometry = new THREE.PlaneGeometry(8, 15, 20, 40)
    const scorchMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: scorchVertexShader,
      fragmentShader: scorchFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    })

    const scorch = new THREE.Mesh(scorchGeometry, scorchMaterial)
    scorch.rotation.x = -Math.PI / 2
    scorch.position.y = -0.1
    mainGroup.add(scorch)

    // ==================== 动画时间线 ====================
    const tl = createTimeline(
      () => {
        onComplete?.({ type: 'hinokami-kagura', duration: 18000 })
      },
      onError,
      '火之神神乐',
      controls
    )

    tl.play()

    // ==================== 阶段1: 刀光显现 (0-3秒) ====================
    tl.to(bladeMaterial.uniforms.uOpacity, { value: 1, duration: 2 }, 0)
    tl.to(bladeMaterial.uniforms.uIntensity, { value: 1, duration: 2 }, 0)

    // 刀光上升
    gsap.from(blade.position, {
      y: -10,
      duration: 2,
      ease: 'power2.out'
    })

    // ==================== 阶段2: 火焰舞动 (3-6秒) ====================
    tl.to(bladeMaterial.uniforms.uWaveAmplitude, { value: 0.6, duration: 2 }, 3)

    // 刀光挥舞
    gsap.to(blade.rotation, {
      z: Math.PI * 0.25 + Math.PI * 0.5,
      duration: 2,
      ease: 'power2.inOut'
    }, 3)

    // ==================== 阶段3: 火星迸发 (5-10秒) ====================
    tl.to(sparkMaterial.uniforms.uOpacity, { value: 1, duration: 2 }, 5)
    tl.to(scorchMaterial.uniforms.uOpacity, { value: 1, duration: 2 }, 5)

    // 刀光剧烈挥舞
    gsap.to(blade.rotation, {
      z: Math.PI * 0.75 + Math.PI * 0.5,
      duration: 3,
      ease: 'power2.inOut'
    }, 5)

    gsap.to(bladeMaterial.uniforms.uWaveAmplitude, { value: 1.0, duration: 3 }, 5)

    // ==================== 阶段4: 强度爆发 (10-14秒) ====================
    tl.to(bladeMaterial.uniforms.uIntensity, { value: 2, duration: 2 }, 10)
    tl.to(sparkMaterial.uniforms.uOpacity, { value: 1.5, duration: 2 }, 10)

    // 刀光快速挥舞
    gsap.to(blade.rotation, {
      z: Math.PI * 1.25 + Math.PI * 0.5,
      duration: 4,
      ease: 'power1.inOut'
    }, 10)

    // ==================== 阶段5: 火焰消散 (14-16秒) ====================
    tl.to(bladeMaterial.uniforms.uOpacity, { value: 0, duration: 2 }, 14)
    tl.to(bladeMaterial.uniforms.uIntensity, { value: 0, duration: 2 }, 14)
    tl.to(sparkMaterial.uniforms.uOpacity, { value: 0, duration: 2 }, 14)

    // ==================== 阶段6: 焦黑消散 (16-18秒) ====================
    tl.to(scorchMaterial.uniforms.uOpacity, { value: 0, duration: 2 }, 16)

    // ==================== 运镜系统 ====================
    // 阶段1-2: 远景观察 (0-6秒)
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 20,
      duration: 6,
      ease: 'power1.inOut'
    }, 0)

    // 阶段3: 中景观察 (6-12秒)
    tl.to(camera.position, {
      x: 5,
      y: 3,
      z: 12,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 0, 0)
    }, 6)

    // 阶段4-5: 近景特写 (12-16秒)
    tl.to(camera.position, {
      x: 3,
      y: 2,
      z: 8,
      duration: 4,
      ease: 'power2.in',
      onUpdate: () => camera.lookAt(0, 0, 0)
    }, 12)

    // 阶段6: 远景回望 (16-18秒)
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 15,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => camera.lookAt(0, 0, 0)
    }, 16)

    // ==================== 动画循环 ====================
    let animationFrame = null
    let startTime = performance.now()

    function animate() {
      if (cleaned) return

      animationFrame = requestAnimationFrame(animate)

      const elapsed = (performance.now() - startTime) / 1000

      // 更新所有 shader 的 uTime
      bladeMaterial.uniforms.uTime.value = elapsed
      sparkMaterial.uniforms.uTime.value = elapsed
      scorchMaterial.uniforms.uTime.value = elapsed

      // 刀光轻微旋转
      blade.rotation.y = Math.sin(elapsed * 2.0) * 0.1

      // 粒子旋转
      sparks.rotation.y += 0.005
    }

    animate()

    // ==================== 清理 ====================
    tl.call(() => {
      if (cleaned) return
      cleaned = true

      cancelAnimationFrame(animationFrame)

      scene.remove(mainGroup)

      bladeGeometry.dispose()
      bladeMaterial.dispose()
      sparkGeometry.dispose()
      sparkMaterial.dispose()
      scorchGeometry.dispose()
      scorchMaterial.dispose()

      if (originalBackground) {
        scene.background = originalBackground
      }

      gsap.killTweensOf(blade.position)
      gsap.killTweensOf(blade.rotation)
      gsap.killTweensOf(camera)
      gsap.killTweensOf(camera.position)
    }, null, 18)

    return {
      timeline: tl,
      cleanup: () => {
        if (cleaned) return
        cleaned = true
        cancelAnimationFrame(animationFrame)
        scene.remove(mainGroup)
        gsap.killTweensOf('*')
      }
    }
  } catch (error) {
    onError?.(error)
    return null
  }
}

/**
 * 特效配置
 */
export const HinokamiKagura = {
  name: 'hinokami-kagura',
  displayName: '🔥 火之神神乐',
  description: '弯曲的火焰刀光，灼热火星散落，地面焦黑痕迹',
  category: '元素',
  version: '1.0.0',
  tags: ['fire', 'blade', 'flame', 'particles']
}
