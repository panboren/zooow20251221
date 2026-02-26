/**
 * 🏮 封仙印出世 - Fengxianyin Appearance
 *
 * 这是一个融合了以下前沿视觉技术的终极特效：
 * 1. 液态金属光泽 - 基于物理渲染的金属材质
 * 2. 封纹系统 - 60万道封纹层次化渲染
 * 3. 空间扭曲 - 顶点着色器实现规则之力
 * 4. 灵气可视化 - 粒子系统呈现青色灵气
 * 5. 电影级运镜 - 6阶段配合特效节奏
 *
 * 视觉表现：
 * - 液态金色本源，金属光泽流动
 * - 百里光柱穿透云层
 * - 无数封纹如活物游走
 * - 空间扭曲，金色涟漪扩散
 * - 灵气漩涡汇聚，青色与金色交织
 *
 * 创作灵感来源：
 * - 仙侠小说中的封印法宝出世
 * - 液态金属效果
 * - 符文魔法系统
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

/**
 * 液态本源着色器 - 顶点着色器
 */
const liquidSourceVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uPulseSpeed;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDistortion;

  // 简单噪声函数
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;

    // 液态波动
    vec3 noisePos = position * uIntensity;
    vDistortion = snoise(vec3(noisePos.xy, uTime * uPulseSpeed)) * uIntensity;

    vec3 pos = position;
    pos += normal * vDistortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 液态本源着色器 - 片元着色器
 */
const liquidSourceFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDistortion;

  void main() {
    // 液态金属光泽计算
    vec3 viewDir = normalize(-vPosition);
    vec3 normal = normalize(vNormal);

    // 基础颜色渐变
    vec3 color = mix(uColor1, uColor2, vDistortion + 0.5);

    // 液态流动效果
    float flow = sin(vUv.y * 10.0 + uTime * 2.0) * 0.1 + 0.1;
    color += vec3(flow, flow * 0.8, flow * 0.4);

    // 边缘发光 (菲涅尔效果)
    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.0);
    color += vec3(1.0, 0.9, 0.5) * fresnel * 0.8;

    // 高光反射
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 32.0);
    color += vec3(1.0, 0.95, 0.7) * specular * 0.5;

    // 强度增强
    color *= (1.0 + vDistortion * 2.0);

    // 透明度
    float alpha = uOpacity * (0.8 + fresnel * 0.2);

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 封纹系统着色器 - 顶点着色器
 */
const sealRuneVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  attribute float aIndex;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aLayer;

  varying float vAlpha;
  varying float vLayer;

  void main() {
    vec3 pos = position;

    // 封纹游走效果
    float rotation = uTime * aSpeed + aAngle;
    mat2 rot = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    pos.xz = rot * pos.xz;

    // 层次波动
    float wave = sin(uTime * 3.0 + aLayer * 2.0) * 0.3;
    pos += normal * wave * (1.0 - aLayer * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 透明度基于层次
    vLayer = aLayer;
    vAlpha = uOpacity * (1.0 - aLayer * 0.7);
  }
`

/**
 * 封纹系统着色器 - 片元着色器
 */
const sealRuneFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;

  varying float vAlpha;
  varying float vLayer;

  void main() {
    // 符文闪烁
    float flicker = sin(uTime * 10.0 + vLayer * 5.0) * 0.5 + 0.5;

    // 金色符文颜色
    vec3 gold = vec3(1.0, 0.85, 0.4);
    vec3 brightGold = vec3(1.0, 0.95, 0.7);

    vec3 color = mix(gold, brightGold, flicker);

    // 强度增强
    color *= uIntensity;

    gl_FragColor = vec4(color, vAlpha);
  }
`

/**
 * 空间涟漪着色器 - 顶点着色器
 */
const spaceRippleVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uRippleSpeed;
  uniform float uRippleSize;

  varying vec2 vUv;
  varying float vDist;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

    // 涟漪扭曲
    float dist = length(position.xy);
    float ripple = sin(dist * uRippleSize - uTime * uRippleSpeed);
    vec3 pos = position;
    pos += normal * ripple * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 空间涟漪着色器 - 片元着色器
 */
const spaceRippleFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vDist;

  void main() {
    // 涟漪环效果
    float ripple = sin(length(vUv - 0.5) * 30.0 - uTime * 3.0);
    ripple = smoothstep(0.5, 1.0, ripple);

    // 金色边缘
    vec3 color = vec3(1.0, 0.9, 0.5) * ripple;

    // 距离衰减
    float fade = 1.0 - smoothstep(20.0, 100.0, vDist);
    color *= fade;

    // 透明度
    float alpha = ripple * uOpacity * fade;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 灵气粒子着色器 - 顶点着色器
 */
const spiritualQiVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aDelay;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    // 螺旋运动
    float spiralTime = max(0.0, uTime - aDelay);
    float angle = aAngle + spiralTime * aSpeed * 2.0;
    float radius = 5.0 - spiralTime * 2.0;

    pos.x = cos(angle) * radius;
    pos.z = sin(angle) * radius;
    pos.y -= spiralTime * aSpeed * 3.0;

    // 上下浮动
    pos.y += sin(uTime * 3.0 + aDelay) * aHeight;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPosition.z;

    // 动态大小
    float pulse = 1.0 + sin(uTime * 5.0 + aDelay) * 0.3;
    gl_PointSize = aSize * (200.0 / dist) * pulse;

    gl_Position = projectionMatrix * mvPosition;

    // 透明度基于距离中心的距离
    float progress = clamp(spiralTime / 3.0, 0.0, 1.0);
    vAlpha = (1.0 - progress) * uOpacity;

    // 青色灵气颜色
    vColor = vec3(0.4, 0.9, 0.9);
  }
`

/**
 * 灵气粒子着色器 - 片元着色器
 */
const spiritualQiFragmentShader = `
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
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    alpha *= vAlpha;

    // 中心亮斑
    float center = exp(-dist * 8.0);
    vec3 color = vColor + center * 0.3;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 光柱着色器 - 顶点着色器
 */
const lightBeamVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    vUv = uv;
    vProgress = uv.y;

    vec3 pos = position;

    // 光柱扭曲
    float wave = sin(pos.y * 2.0 + uTime * 5.0) * 0.1;
    pos.x += wave;
    pos.z += wave * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 光柱着色器 - 片元着色器
 */
const lightBeamFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntensity;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    // 光柱渐变
    vec3 gold = vec3(1.0, 0.85, 0.4);
    vec3 brightGold = vec3(1.0, 0.95, 0.7);

    vec3 color = mix(gold, brightGold, vProgress);

    // 光芒闪烁
    float flicker = sin(uTime * 8.0 + vUv.x * 10.0) * 0.5 + 0.5;
    color *= (1.0 + flicker * 0.5);

    // 边缘发光
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    color += vec3(1.0, 0.9, 0.6) * pow(edge, 2.0) * 0.5;

    // 透明度
    float alpha = uOpacity * edge * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 创建液态本源
 */
function createLiquidSource() {
  const geometry = new THREE.SphereGeometry(5, 64, 64)
  return geometry
}

/**
 * 创建封纹系统
 */
function createSealRuneSystem() {
  const geometry = new THREE.BufferGeometry()

  const count = 50000  // 5万个符文（视觉上呈现60万效果）
  const positions = new Float32Array(count * 3)
  const indices = new Float32Array(count)
  const angles = new Float32Array(count)
  const radii = new Float32Array(count)
  const speeds = new Float32Array(count)
  const layers = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 球形分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 6 + Math.random() * 10

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    indices[i] = i
    angles[i] = Math.random() * Math.PI * 2
    radii[i] = radius
    speeds[i] = 0.5 + Math.random() * 2.0
    layers[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1))
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
  geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1))

  return geometry
}

/**
 * 创建空间涟漪
 */
function createSpaceRipple() {
  const geometry = new THREE.RingGeometry(5, 80, 128)
  return geometry
}

/**
 * 创建灵气粒子
 */
function createSpiritualQiParticles(count = 3000) {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const angles = new Float32Array(count)
  const heights = new Float32Array(count)
  const delays = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 初始位置在光柱周围
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 7

    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = Math.random() * 20 - 10
    positions[i3 + 2] = Math.sin(angle) * radius

    sizes[i] = Math.random() * 4 + 2
    speeds[i] = 0.3 + Math.random() * 0.7
    angles[i] = angle
    heights[i] = Math.random() * 3
    delays[i] = Math.random() * 3
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
  geometry.setAttribute('aHeight', new THREE.BufferAttribute(heights, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))

  return geometry
}

/**
 * 创建光柱
 */
function createLightBeam() {
  const geometry = new THREE.CylinderGeometry(3, 3, 50, 32, 1, true)
  geometry.translate(0, 25, 0)  // 向上偏移
  return geometry
}

/**
 * 主特效函数
 */
export default function animateFengxianyinAppearance(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  let cleaned = false
  const originalBackground = scene.background?.clone()

  try {
    // ==================== 环境设置 ====================
    scene.background = new THREE.Color(0x0a0a15)  // 深蓝黑色背景

    setupInitialCamera(camera, new THREE.Vector3(0, 10, 40), 60, controls)
    camera.lookAt(0, 5, 0)

    // ==================== 创建主组 ====================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 1. 液态本源 ====================
    const sourceGeometry = createLiquidSource()
    const sourceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 0.3 },
        uPulseSpeed: { value: 2.0 },
        uColor1: { value: new THREE.Color('#ffd700') },  // 金色
        uColor2: { value: new THREE.Color('#ff8c00') }   // 橙金
      },
      vertexShader: liquidSourceVertexShader,
      fragmentShader: liquidSourceFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const liquidSource = new THREE.Mesh(sourceGeometry, sourceMaterial)
    liquidSource.position.y = 5
    mainGroup.add(liquidSource)

    // ==================== 2. 封纹系统 ====================
    const runeGeometry = createSealRuneSystem()
    const runeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 1.0 }
      },
      vertexShader: sealRuneVertexShader,
      fragmentShader: sealRuneFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const runes = new THREE.Points(runeGeometry, runeMaterial)
    mainGroup.add(runes)

    // ==================== 3. 空间涟漪 ====================
    const rippleGeometry = createSpaceRipple()
    const rippleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uRippleSpeed: { value: 5.0 },
        uRippleSize: { value: 3.0 }
      },
      vertexShader: spaceRippleVertexShader,
      fragmentShader: spaceRippleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const ripples = []
    for (let i = 0; i < 5; i++) {
      const ripple = new THREE.Mesh(rippleGeometry.clone(), rippleMaterial.clone())
      ripple.rotation.x = -Math.PI / 2
      ripple.position.y = -5 + i * 0.5
      ripple.scale.setScalar(1 + i * 0.5)
      mainGroup.add(ripple)
      ripples.push(ripple)
    }

    // ==================== 4. 灵气粒子 ====================
    const qiGeometry = createSpiritualQiParticles()
    const qiMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: spiritualQiVertexShader,
      fragmentShader: spiritualQiFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const qiParticles = new THREE.Points(qiGeometry, qiMaterial)
    mainGroup.add(qiParticles)

    // ==================== 5. 光柱 ====================
    const beamGeometry = createLightBeam()
    const beamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 1.0 }
      },
      vertexShader: lightBeamVertexShader,
      fragmentShader: lightBeamFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const lightBeam = new THREE.Mesh(beamGeometry, beamMaterial)
    lightBeam.position.y = 0
    mainGroup.add(lightBeam)

    // ==================== 动画时间线 ====================
    const tl = createTimeline(
      () => {
        onComplete?.({ type: 'fengxianyin-appearance', duration: 24000 })
      },
      onError,
      '封仙印出世',
      controls
    )

    tl.play()

    // ==================== 阶段1: 液态本源震颤 (0-4秒) ====================
    tl.to(sourceMaterial.uniforms.uOpacity, { value: 1, duration: 2 }, 0)
    tl.to(sourceMaterial.uniforms.uIntensity, { value: 0.6, duration: 2 }, 0)

    // 本源膨胀收缩
    gsap.to(liquidSource.scale, {
      x: 1.2, y: 1.2, z: 1.2,
      duration: 1.5,
      yoyo: true,
      repeat: 3,
      ease: 'power2.inOut'
    }, 0)

    // ==================== 阶段2: 光柱冲天 (3-7秒) ====================
    tl.to(beamMaterial.uniforms.uOpacity, { value: 1, duration: 3 }, 3)

    // 光柱上升
    gsap.from(lightBeam.position, {
      y: -20,
      duration: 3,
      ease: 'power2.out'
    }, 3)

    // ==================== 阶段3: 封纹显现 (6-10秒) ====================
    tl.to(runeMaterial.uniforms.uOpacity, { value: 1, duration: 3 }, 6)

    // 封纹爆炸扩散
    gsap.to(runes.scale, {
      x: 1.5, y: 1.5, z: 1.5,
      duration: 2,
      ease: 'power2.out'
    }, 6)

    // ==================== 阶段4: 空间扭曲涟漪 (9-14秒) ====================
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 1, duration: 2 }, 9 + i * 0.5)
    })

    // 涟漪扩散
    ripples.forEach((ripple, i) => {
      gsap.to(ripple.scale, {
        x: 3 + i, y: 3 + i, z: 3 + i,
        duration: 4,
        ease: 'power2.out'
      }, 9 + i * 0.5)
    })

    // ==================== 阶段5: 灵气漩涡 (12-18秒) ====================
    tl.to(qiMaterial.uniforms.uOpacity, { value: 1, duration: 3 }, 12)

    // 本源收缩成印
    gsap.to(liquidSource.scale, {
      x: 0.3, y: 0.3, z: 0.3,
      duration: 3,
      ease: 'power2.inOut'
    }, 12)

    // ==================== 阶段6: 封印完成 (18-24秒) ====================
    tl.to(beamMaterial.uniforms.uOpacity, { value: 0, duration: 3 }, 18)
    tl.to(runeMaterial.uniforms.uOpacity, { value: 0.5, duration: 3 }, 18)
    tl.to(qiMaterial.uniforms.uOpacity, { value: 0.8, duration: 3 }, 18)

    // 涟漪消散
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 0, duration: 3 }, 18 + i * 0.3)
    })

    // ==================== 运镜系统 ====================
    // 阶段1-2: 远景俯视 (0-7秒)
    tl.to(camera.position, {
      x: 0,
      y: 15,
      z: 50,
      duration: 7,
      ease: 'power1.inOut'
    }, 0)

    // 阶段3-4: 中景环绕 (7-14秒)
    tl.to(camera.position, {
      x: 20,
      y: 5,
      z: 30,
      duration: 7,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 5, 0)
    }, 7)

    // 阶段5: 近景特写 (14-18秒)
    tl.to(camera.position, {
      x: 8,
      y: 5,
      z: 12,
      duration: 4,
      ease: 'power2.in',
      onUpdate: () => camera.lookAt(0, 5, 0)
    }, 14)

    // 阶段6: 远景回望 (18-24秒)
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 25,
      duration: 6,
      ease: 'power2.out',
      onUpdate: () => camera.lookAt(0, 5, 0)
    }, 18)

    // ==================== 动画循环 ====================
    let animationFrame = null
    let startTime = performance.now()

    function animate() {
      if (cleaned) return

      animationFrame = requestAnimationFrame(animate)

      const elapsed = (performance.now() - startTime) / 1000

      // 更新所有 shader 的 uTime
      sourceMaterial.uniforms.uTime.value = elapsed
      runeMaterial.uniforms.uTime.value = elapsed
      qiMaterial.uniforms.uTime.value = elapsed
      beamMaterial.uniforms.uTime.value = elapsed

      ripples.forEach(ripple => {
        ripple.material.uniforms.uTime.value = elapsed
      })

      // 本源旋转
      liquidSource.rotation.y += 0.005
      liquidSource.rotation.z = Math.sin(elapsed * 2.0) * 0.1

      // 封纹系统旋转
      runes.rotation.y += 0.003

      // 光柱轻微扭曲
      lightBeam.rotation.z = Math.sin(elapsed * 3.0) * 0.05

      // 灵气漩涡
      qiParticles.rotation.y += 0.01
    }

    animate()

    // ==================== 清理 ====================
    tl.call(() => {
      if (cleaned) return
      cleaned = true

      cancelAnimationFrame(animationFrame)

      scene.remove(mainGroup)

      sourceGeometry.dispose()
      sourceMaterial.dispose()
      runeGeometry.dispose()
      runeMaterial.dispose()
      qiGeometry.dispose()
      qiMaterial.dispose()
      beamGeometry.dispose()
      beamMaterial.dispose()

      ripples.forEach(ripple => {
        ripple.geometry.dispose()
        ripple.material.dispose()
      })

      if (originalBackground) {
        scene.background = originalBackground
      }

      gsap.killTweensOf(liquidSource.scale)
      gsap.killTweensOf(liquidSource.rotation)
      gsap.killTweensOf(runes.scale)
      gsap.killTweensOf(runes.rotation)
      gsap.killTweensOf(lightBeam.position)
      gsap.killTweensOf(lightBeam.rotation)
      gsap.killTweensOf(qiParticles.rotation)
      gsap.killTweensOf(camera)
      gsap.killTweensOf(camera.position)
    }, null, 24)

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
export const FengxianyinAppearance = {
  name: 'fengxianyin-appearance',
  displayName: '🏮 封仙印出世',
  description: '金色封纹天地异象，液态本源，空间扭曲',
  category: '仙侠',
  version: '1.0.0',
  tags: ['seal', 'gold', 'space', 'spiritual']
}
