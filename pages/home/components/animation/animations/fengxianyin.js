/**
 * 🏮 封仙印 - Fengxianyin
 *
 * 这是一个融合了以下前沿视觉技术的终极特效：
 * 1. 液态金属质感 - 基于物理渲染的多色相金属材质
 * 2. 螺旋光柱 - 多道光丝螺旋缠绕，粒子流喷射
 * 3. 立体封纹系统 - 立体符文链条，近实远虚层次
 * 4. 金色涟漪 - 空间扭曲波纹扩散
 * 5. 灵气漩涡 - 青色流质与金色交织
 * 6. 电影级运镜 - 6阶段配合特效节奏
 *
 * 视觉表现：
 * - 液态金色本源，随视角变色（金黄-赤红-青白）
 * - 螺旋光柱冲天，粒子流沿轨迹喷射
 * - 立体符文链条游走交织，近实远虚
 * - 金色涟漪从底部扩散，云层蒸发
 * - 灵气漩涡汇聚，金青交织梦幻色彩
 *
 * 创作灵感来源：
 * - 仙侠小说中的封印法宝
 * - 液态金属与螺旋光束
 * - 立体符文系统
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
  varying vec2 vUv;
  varying float vDistortion;
  varying float vFresnel;
  varying vec3 vViewDir;

  // 3D 噪声函数
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    vec2 C = vec2(1.0/6.0, 1.0/3.0);
    vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

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
    vUv = uv;

    // Liquid fluctuation - multi-layer noise overlay
    vec3 noisePos = position * uIntensity;
    float noise1 = snoise(vec3(noisePos.xy, uTime * uPulseSpeed));
    float noise2 = snoise(vec3(noisePos.yz, uTime * uPulseSpeed * 1.5));
    float noise3 = snoise(vec3(noisePos.xz, uTime * uPulseSpeed * 2.0));
    vDistortion = (noise1 + noise2 * 0.5 + noise3 * 0.25) * uIntensity;

    vec3 pos = position;
    pos += normal * vDistortion;

    // Fresnel effect - use deformed position
    vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    vec3 viewDir = normalize(cameraPosition - worldPos);
    vFresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
    vViewDir = viewDir;

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
  uniform vec3 uColor1;  // 金黄
  uniform vec3 uColor2;  // 赤红
  uniform vec3 uColor3;  // 青白
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vDistortion;
  varying float vFresnel;
  varying vec3 vViewDir;

  void main() {
    // 使用菲涅尔效应进行视角相关的颜色变化
    vec3 normal = normalize(vNormal);

    vec3 gold = uColor1;
    vec3 red = uColor2;
    vec3 cyan = uColor3;

    // 基于菲涅尔的颜色混合
    vec3 color;
    if (vFresnel > 0.5) {
      // 边缘：青白
      color = mix(gold, cyan, (vFresnel - 0.5) * 2.0);
    } else if (vFresnel > 0.2) {
      // 中间：金黄
      color = gold;
    } else {
      // 正面：赤红
      color = mix(red, gold, vFresnel * 3.33);
    }

    // 液态流动效果
    float flow1 = sin(vUv.y * 15.0 + uTime * 3.0) * 0.15;
    float flow2 = sin(vUv.x * 12.0 + uTime * 2.5) * 0.1;
    color += vec3(flow1 + flow2, (flow1 + flow2) * 0.7, (flow1 + flow2) * 0.3);

    // 金属光泽 - 强菲涅尔
    color += vec3(1.0, 0.95, 0.8) * vFresnel * 1.2;

    // 波纹闪烁
    float shimmer = sin(vDistortion * 20.0 + uTime * 5.0) * 0.5 + 0.5;
    color *= (0.9 + shimmer * 0.3);

    // 高光反射
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfDir = normalize(lightDir + vViewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 48.0);
    color += vec3(1.0, 0.98, 0.9) * specular * 0.7;

    // 强度增强
    color *= (1.0 + vDistortion * 1.5 + vFresnel * 0.5);

    // 透明度
    float alpha = uOpacity * (0.85 + vFresnel * 0.15);

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 螺旋光柱着色器 - 顶点着色器
 */
const spiralBeamVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uSpiralSpeed;
  uniform float uSpiralDensity;

  attribute float aSpiralIndex;
  attribute float aSpiralOffset;
  attribute float aSpiralSpeed;

  varying vec2 vUv;
  varying float vSpiral;
  varying float vAlpha;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Spiral twist
    float spiral = aSpiralIndex * uSpiralDensity + aSpiralOffset;
    float rotation = uTime * uSpiralSpeed * aSpiralSpeed + spiral;
    mat2 rot = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    pos.xz = rot * pos.xz;

    // Spiral light thread effect
    vSpiral = sin(spiral * 3.0) * 0.5 + 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Alpha based on spiral
    vAlpha = vSpiral * uOpacity;
  }
`

/**
 * 螺旋光柱着色器 - 片元着色器
 */
const spiralBeamFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntensity;

  varying vec2 vUv;
  varying float vSpiral;
  varying float vAlpha;

  void main() {
    // 光丝颜色
    vec3 gold = vec3(1.0, 0.85, 0.4);
    vec3 brightGold = vec3(1.0, 0.95, 0.7);

    vec3 color = mix(gold, brightGold, vSpiral);

    // 光芒闪烁
    float flicker = sin(uTime * 10.0 + vUv.y * 20.0) * 0.5 + 0.5;
    color *= (1.0 + flicker * 0.4);

    // 边缘发光
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    color += vec3(1.0, 0.9, 0.6) * pow(edge, 3.0) * 0.8;

    // 高度渐变
    float heightFade = vUv.y;
    color *= heightFade;

    // 透明度
    float alpha = edge * vAlpha * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 立体封纹着色器 - 顶点着色器
 */
const threeDimensionalRuneVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  attribute float aIndex;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aLayer;
  attribute float aChainIndex;

  varying float vAlpha;
  varying float vLayer;
  varying float vChain;

  void main() {
    vec3 pos = position;

    // Rune wandering - spiral motion
    float timeOffset = aIndex * 0.001;
    float spiralAngle = aAngle + uTime * aSpeed + timeOffset;
    float radius = aRadius + sin(uTime * 2.0 + aLayer * 5.0) * 0.5;

    pos.x = cos(spiralAngle) * radius;
    pos.z = sin(spiralAngle) * radius;

    // 3D fold effect
    float fold = sin(uTime * aSpeed + aLayer * 3.0) * 2.0;
    pos.y += fold;

    // Rune chain effect
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPosition.z;

    gl_Position = projectionMatrix * mvPosition;

    // Distance attenuation
    float distanceFade = 1.0 - smoothstep(20.0, 80.0, dist);

    // Layer transparency
    vLayer = aLayer;
    vChain = aChainIndex;

    // Near solid far faded
    vAlpha = uOpacity * distanceFade * (1.0 - aLayer * 0.6);
  }
`

/**
 * 立体封纹着色器 - 片元着色器
 */
const threeDimensionalRuneFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;

  varying float vAlpha;
  varying float vLayer;
  varying float vChain;

  void main() {
    // 符文颜色 - 近实远虚
    vec3 gold = vec3(1.0, 0.85, 0.4);
    vec3 paleGold = vec3(0.9, 0.7, 0.3);

    vec3 color = mix(paleGold, gold, 1.0 - vLayer);

    // 符文闪烁
    float flicker = sin(uTime * 8.0 + vLayer * 4.0 + vChain * 10.0) * 0.5 + 0.5;
    color *= (0.8 + flicker * 0.4);

    // 链条连接效果
    float chainGlow = sin(vChain * 3.14159) * 0.3 + 0.7;
    color *= chainGlow;

    // 强度增强
    color *= uIntensity;

    gl_FragColor = vec4(color, vAlpha);
  }
`

/**
 * 金色涟漪着色器 - 顶点着色器
 */
const goldenRippleVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uRippleSpeed;
  uniform float uRippleSize;

  attribute float aRippleIndex;

  varying vec2 vUv;
  varying float vDist;
  varying float vRippleIndex;

  void main() {
    vUv = uv;
    vRippleIndex = aRippleIndex;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

    // Ripple distortion - push from bottom to top
    float rippleWave = sin(length(uv - 0.5) * uRippleSize - uTime * uRippleSpeed + aRippleIndex);
    vec3 pos = position;
    pos += normal * rippleWave * 0.8;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 金色涟漪着色器 - 片元着色器
 */
const goldenRippleFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vDist;
  varying float vRippleIndex;

  void main() {
    // 涟漪环效果
    float ring = sin(length(vUv - 0.5) * 40.0 - uTime * 4.0 + vRippleIndex * 2.0);
    ring = smoothstep(0.3, 1.0, ring);

    // 金色边缘
    vec3 gold = vec3(1.0, 0.9, 0.5);
    vec3 brightGold = vec3(1.0, 0.95, 0.7);

    vec3 color = mix(gold, brightGold, ring);

    // 扩散效果
    float spread = smoothstep(0.0, 1.0, vRippleIndex * 0.5);
    color *= (1.0 - spread * 0.5);

    // 距离衰减
    float fade = 1.0 - smoothstep(30.0, 100.0, vDist);
    color *= fade;

    // 透明度
    float alpha = ring * uOpacity * fade;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 灵气漩涡着色器 - 顶点着色器
 */
const spiritualVortexVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aDelay;
  attribute float aRadius;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    // Spiral vortex motion
    float vortexTime = max(0.0, uTime - aDelay);
    float angle = aAngle + vortexTime * aSpeed * 3.0;
    float radius = aRadius - vortexTime * 1.5;
    radius = max(radius, 1.0);

    pos.x = cos(angle) * radius;
    pos.z = sin(angle) * radius;
    pos.y -= vortexTime * aSpeed * 2.0;

    // Up-down fluctuation
    pos.y += sin(uTime * 4.0 + aDelay) * aHeight;

    // Vertical vortex
    float verticalWave = sin(vortexTime * 2.0 + aAngle) * 2.0;
    pos.y += verticalWave;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPosition.z;

    // Dynamic size
    float pulse = 1.0 + sin(uTime * 6.0 + aDelay) * 0.4;
    gl_PointSize = aSize * (300.0 / dist) * pulse;

    gl_Position = projectionMatrix * mvPosition;

    // Alpha based on convergence degree
    float progress = clamp(vortexTime / 4.0, 0.0, 1.0);
    vAlpha = (1.0 - progress * 0.3) * uOpacity;

    // Cyan spirit energy color - varies by position
    vec3 cyan = vec3(0.3, 0.9, 0.95);
    vec3 lightCyan = vec3(0.6, 0.95, 1.0);
    vColor = mix(cyan, lightCyan, sin(angle) * 0.5 + 0.5);
  }
`

/**
 * 灵气漩涡着色器 - 片元着色器
 */
const spiritualVortexFragmentShader = `
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
    float alpha = 1.0 - smoothstep(0.15, 0.5, dist);
    alpha *= vAlpha;

    // 中心亮斑
    float center = exp(-dist * 10.0);
    vec3 color = vColor + center * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 粒子流着色器 - 顶点着色器
 */
const particleFlowVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  attribute float aSpeed;
  attribute float aAngle;
  attribute float aDelay;
  attribute float aSpiralOffset;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;

    // Shoot upward along spiral trajectory
    float flowTime = max(0.0, uTime - aDelay);
    float progress = flowTime * aSpeed * 5.0;

    // Spiral rise
    float spiralAngle = aAngle + progress * 0.5 + aSpiralOffset;
    float radius = 2.5 + sin(progress * 2.0) * 0.5;

    pos.x = cos(spiralAngle) * radius;
    pos.z = sin(spiralAngle) * radius;
    pos.y += progress;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPosition.z;

    // Dynamic size
    float pulse = 1.0 + sin(uTime * 8.0 + aDelay) * 0.5;
    gl_PointSize = (3.0 + sin(flowTime * 10.0) * 2.0) * (200.0 / dist) * pulse;

    gl_Position = projectionMatrix * mvPosition;

    // Alpha gradient
    float alphaProgress = clamp(progress / 15.0, 0.0, 1.0);
    vAlpha = (1.0 - alphaProgress) * uOpacity;

    // Gold particle color
    vec3 gold = vec3(1.0, 0.85, 0.4);
    vec3 brightGold = vec3(1.0, 0.95, 0.7);
    vColor = mix(gold, brightGold, sin(flowTime * 5.0) * 0.5 + 0.5);
  }
`

/**
 * 粒子流着色器 - 片元着色器
 */
const particleFlowFragmentShader = `
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
    float center = exp(-dist * 12.0);
    vec3 color = vColor + center * 0.5;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 创建液态本源
 */
function createLiquidSource() {
  const geometry = new THREE.SphereGeometry(5, 128, 128)

  // SphereGeometry 会自动生成 uv，但需要验证
  if (!geometry.attributes.uv) {
    const count = geometry.attributes.position.count
    const uvs = new Float32Array(count * 2)

    for (let i = 0; i < count; i++) {
      const pos = new THREE.Vector3()
      pos.fromBufferAttribute(geometry.attributes.position, i)

      // 球面坐标映射到 uv
      const phi = Math.acos(pos.y / 5.0)  // 5.0 是半径
      const theta = Math.atan2(pos.z, pos.x)

      uvs[i * 2] = (theta / (Math.PI * 2) + 0.5)
      uvs[i * 2 + 1] = phi / Math.PI
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  }

  return geometry
}

/**
 * 创建螺旋光柱
 */
function createSpiralBeam() {
  const geometry = new THREE.CylinderGeometry(2.5, 2.5, 60, 64, 60, true)

  // 添加螺旋属性
  const count = geometry.attributes.position.count
  const spiralIndices = new Float32Array(count)
  const spiralOffsets = new Float32Array(count)
  const spiralSpeeds = new Float32Array(count)

  // 手动生成 uv attribute（CylinderGeometry 默认不生成）
  const uvs = new Float32Array(count * 2)
  const positions = geometry.attributes.position.array

  for (let i = 0; i < count; i++) {
    const y = positions[i * 3 + 1]
    const angle = Math.atan2(positions[i * 3 + 2], positions[i * 3])

    uvs[i * 2] = (angle / Math.PI + 1.0) * 0.5  // 映射到 [0, 1]
    uvs[i * 2 + 1] = (y + 30.0) / 60.0  // 映射到 [0, 1]

    spiralIndices[i] = i % 8  // 8道光丝
    spiralOffsets[i] = Math.random() * Math.PI * 2
    spiralSpeeds[i] = 0.5 + Math.random() * 1.5
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setAttribute('aSpiralIndex', new THREE.BufferAttribute(spiralIndices, 1))
  geometry.setAttribute('aSpiralOffset', new THREE.BufferAttribute(spiralOffsets, 1))
  geometry.setAttribute('aSpiralSpeed', new THREE.BufferAttribute(spiralSpeeds, 1))

  return geometry
}

/**
 * 创建立体封纹系统
 */
function createThreeDimensionalRuneSystem() {
  const geometry = new THREE.BufferGeometry()

  const count = 80000  // 8万符文
  const positions = new Float32Array(count * 3)
  const indices = new Float32Array(count)
  const angles = new Float32Array(count)
  const radii = new Float32Array(count)
  const speeds = new Float32Array(count)
  const layers = new Float32Array(count)
  const chainIndices = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 球形分层分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const layer = Math.random()
    const radius = 6 + layer * 15  // 多层次

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    indices[i] = i
    angles[i] = theta
    radii[i] = radius
    speeds[i] = 0.3 + Math.random() * 2.0
    layers[i] = layer
    chainIndices[i] = i % 10  // 链条分组
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1))
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
  geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1))
  geometry.setAttribute('aChainIndex', new THREE.BufferAttribute(chainIndices, 1))

  return geometry
}

/**
 * 创建金色涟漪
 */
function createGoldenRipples() {
  const geometries = []
  const count = 7

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.RingGeometry(5, 60, 128, 1)

    // 手动生成 uv attribute（RingGeometry 默认不生成）
    const posCount = geometry.attributes.position.count
    const uvs = new Float32Array(posCount * 2)
    const normals = new Float32Array(posCount * 3)
    const positions = geometry.attributes.position.array

    for (let j = 0; j < posCount; j++) {
      const x = positions[j * 3]
      const y = positions[j * 3 + 1]
      const z = positions[j * 3 + 2]

      // 将圆环的坐标映射到 uv [0, 1]
      uvs[j * 2] = (x + 60.0) / 120.0
      uvs[j * 2 + 1] = (y + 60.0) / 120.0

      // RingGeometry 是平面，法线统一指向 Z 轴正方向
      normals[j * 3] = 0.0
      normals[j * 3 + 1] = 0.0
      normals[j * 3 + 2] = 1.0
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))

    const rippleIndices = new Float32Array(posCount)
    for (let j = 0; j < rippleIndices.length; j++) {
      rippleIndices[j] = i
    }
    geometry.setAttribute('aRippleIndex', new THREE.BufferAttribute(rippleIndices, 1))

    geometries.push(geometry)
  }

  return geometries
}

/**
 * 创建灵气漩涡
 */
function createSpiritualVortex(count = 5000) {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const angles = new Float32Array(count)
  const heights = new Float32Array(count)
  const delays = new Float32Array(count)
  const radii = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const angle = Math.random() * Math.PI * 2
    const radius = 8 + Math.random() * 12

    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = Math.random() * 30 - 15
    positions[i3 + 2] = Math.sin(angle) * radius

    sizes[i] = Math.random() * 5 + 3
    speeds[i] = 0.5 + Math.random() * 1.0
    angles[i] = angle
    heights[i] = Math.random() * 4
    delays[i] = Math.random() * 5
    radii[i] = radius
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
  geometry.setAttribute('aHeight', new THREE.BufferAttribute(heights, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))
  geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1))

  return geometry
}

/**
 * 创建粒子流
 */
function createParticleFlow(count = 2000) {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  const angles = new Float32Array(count)
  const delays = new Float32Array(count)
  const spiralOffsets = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const angle = Math.random() * Math.PI * 2
    const radius = 2 + Math.random() * 1

    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = Math.random() * 10 - 5
    positions[i3 + 2] = Math.sin(angle) * radius

    speeds[i] = 0.5 + Math.random() * 1.5
    angles[i] = angle
    delays[i] = Math.random() * 3
    spiralOffsets[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))
  geometry.setAttribute('aSpiralOffset', new THREE.BufferAttribute(spiralOffsets, 1))

  return geometry
}

/**
 * 主特效函数
 */
export default function animateFengxianyin(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  let cleaned = false
  const originalBackground = scene.background?.clone()

  try {
    // ==================== 环境设置 ====================
    scene.background = new THREE.Color(0x080510)  // 深紫黑色背景

    setupInitialCamera(camera, new THREE.Vector3(0, 15, 45), 60, controls)
    camera.lookAt(0, 10, 0)

    // ==================== 创建主组 ====================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 1. 液态本源 ====================
    const sourceGeometry = createLiquidSource()
    const sourceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 0.5 },
        uPulseSpeed: { value: 2.5 },
        uColor1: { value: new THREE.Color('#ffd700') },  // 金黄
        uColor2: { value: new THREE.Color('#ff4500') },  // 赤红
        uColor3: { value: new THREE.Color('#e0ffff') }   // 青白
      },
      vertexShader: liquidSourceVertexShader,
      fragmentShader: liquidSourceFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const liquidSource = new THREE.Mesh(sourceGeometry, sourceMaterial)
    liquidSource.position.y = 10
    mainGroup.add(liquidSource)

    // ==================== 2. 螺旋光柱 ====================
    const beamGeometry = createSpiralBeam()
    const beamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uSpiralSpeed: { value: 3.0 },
        uSpiralDensity: { value: 8.0 },
        uIntensity: { value: 1.0 }
      },
      vertexShader: spiralBeamVertexShader,
      fragmentShader: spiralBeamFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const spiralBeam = new THREE.Mesh(beamGeometry, beamMaterial)
    spiralBeam.position.y = 0
    mainGroup.add(spiralBeam)

    // ==================== 3. 立体封纹系统 ====================
    const runeGeometry = createThreeDimensionalRuneSystem()
    const runeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uIntensity: { value: 1.0 }
      },
      vertexShader: threeDimensionalRuneVertexShader,
      fragmentShader: threeDimensionalRuneFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const runes = new THREE.Points(runeGeometry, runeMaterial)
    mainGroup.add(runes)

    // ==================== 4. 金色涟漪 ====================
    const rippleGeometries = createGoldenRipples()
    const ripples = []

    rippleGeometries.forEach((geometry, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uRippleSpeed: { value: 6.0 },
          uRippleSize: { value: 4.0 }
        },
        vertexShader: goldenRippleVertexShader,
        fragmentShader: goldenRippleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const ripple = new THREE.Mesh(geometry, material)
      ripple.rotation.x = -Math.PI / 2
      ripple.position.y = -5 + i * 2
      ripple.scale.setScalar(1 + i * 0.3)
      mainGroup.add(ripple)
      ripples.push(ripple)
    })

    // ==================== 5. 灵气漩涡 ====================
    const vortexGeometry = createSpiritualVortex()
    const vortexMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: spiritualVortexVertexShader,
      fragmentShader: spiritualVortexFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const vortex = new THREE.Points(vortexGeometry, vortexMaterial)
    mainGroup.add(vortex)

    // ==================== 6. 粒子流 ====================
    const flowGeometry = createParticleFlow()
    const flowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: particleFlowVertexShader,
      fragmentShader: particleFlowFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const particleFlow = new THREE.Points(flowGeometry, flowMaterial)
    mainGroup.add(particleFlow)

    // ==================== 动画时间线 ====================
    const tl = createTimeline(
      () => {
        onComplete?.({ type: 'fengxianyin', duration: 28000 })
      },
      onError,
      '封仙印',
      controls
    )

    tl.play()

    // ==================== 阶段1: 液态本源震颤 (0-5秒) ====================
    tl.to(sourceMaterial.uniforms.uOpacity, { value: 1, duration: 3 }, 0)
    tl.to(sourceMaterial.uniforms.uIntensity, { value: 0.8, duration: 3 }, 0)

    // 本源剧烈震颤
    gsap.to(liquidSource.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.8,
      yoyo: true,
      repeat: 6,
      ease: 'power2.inOut'
    }, 0)

    // ==================== 阶段2: 光柱冲天 (4-9秒) ====================
    tl.to(beamMaterial.uniforms.uOpacity, { value: 1, duration: 4 }, 4)
    tl.to(flowMaterial.uniforms.uOpacity, { value: 1, duration: 4 }, 4)

    // 光柱上升
    gsap.from(spiralBeam.position, {
      y: -25,
      duration: 4,
      ease: 'power2.out'
    }, 4)

    // ==================== 阶段3: 封纹显现 (8-14秒) ====================
    tl.to(runeMaterial.uniforms.uOpacity, { value: 1, duration: 4 }, 8)

    // 封纹爆炸扩散
    gsap.to(runes.scale, {
      x: 2, y: 2, z: 2,
      duration: 3,
      ease: 'power2.out'
    }, 8)

    // ==================== 阶段4: 涟漪扩散 (12-18秒) ====================
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 1, duration: 3 }, 12 + i * 0.6)
    })

    // 涟漪扩散
    ripples.forEach((ripple, i) => {
      gsap.to(ripple.scale, {
        x: 4 + i * 1.5, y: 4 + i * 1.5, z: 4 + i * 1.5,
        duration: 5,
        ease: 'power2.out'
      }, 12 + i * 0.6)
    })

    // ==================== 阶段5: 本源收缩 (16-22秒) ====================
    tl.to(vortexMaterial.uniforms.uOpacity, { value: 1, duration: 4 }, 16)

    // 本源收缩成印
    gsap.to(liquidSource.scale, {
      x: 0.2, y: 0.2, z: 0.2,
      duration: 4,
      ease: 'power2.inOut'
    }, 16)

    // ==================== 阶段6: 封印完成 (22-28秒) ====================
    tl.to(beamMaterial.uniforms.uOpacity, { value: 0, duration: 4 }, 22)
    tl.to(runeMaterial.uniforms.uOpacity, { value: 0.3, duration: 4 }, 22)
    tl.to(vortexMaterial.uniforms.uOpacity, { value: 1.2, duration: 4 }, 22)
    tl.to(flowMaterial.uniforms.uOpacity, { value: 0, duration: 4 }, 22)

    // 涟漪消散
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 0, duration: 4 }, 22 + i * 0.4)
    })

    // ==================== 运镜系统 ====================
    // 阶段1-2: 远景俯视 (0-9秒)
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 55,
      duration: 9,
      ease: 'power1.inOut'
    }, 0)

    // 阶段3-4: 中景环绕 (9-18秒)
    tl.to(camera.position, {
      x: 25,
      y: 8,
      z: 35,
      duration: 9,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 10, 0)
    }, 9)

    // 阶段5: 近景特写 (18-22秒)
    tl.to(camera.position, {
      x: 10,
      y: 10,
      z: 15,
      duration: 4,
      ease: 'power2.in',
      onUpdate: () => camera.lookAt(0, 10, 0)
    }, 18)

    // 阶段6: 远景回望 (22-28秒)
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 30,
      duration: 6,
      ease: 'power2.out',
      onUpdate: () => camera.lookAt(0, 10, 0)
    }, 22)

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
      vortexMaterial.uniforms.uTime.value = elapsed
      beamMaterial.uniforms.uTime.value = elapsed
      flowMaterial.uniforms.uTime.value = elapsed

      ripples.forEach(ripple => {
        ripple.material.uniforms.uTime.value = elapsed
      })

      // 本源旋转
      liquidSource.rotation.y += 0.006
      liquidSource.rotation.z = Math.sin(elapsed * 3.0) * 0.15

      // 封纹系统旋转
      runes.rotation.y += 0.004
      runes.rotation.x = Math.sin(elapsed * 2.0) * 0.05

      // 螺旋光柱旋转
      spiralBeam.rotation.y += 0.008

      // 灵气漩涡
      vortex.rotation.y += 0.012
      vortex.rotation.x = Math.sin(elapsed * 1.5) * 0.1

      // 粒子流
      particleFlow.rotation.y += 0.005
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
      beamGeometry.dispose()
      beamMaterial.dispose()
      runeGeometry.dispose()
      runeMaterial.dispose()
      vortexGeometry.dispose()
      vortexMaterial.dispose()
      flowGeometry.dispose()
      flowMaterial.dispose()

      ripples.forEach(ripple => {
        ripple.geometry.dispose()
        ripple.material.dispose()
      })

      if (originalBackground) {
        scene.background = originalBackground
      }

      gsap.killTweensOf(liquidSource.scale)
      gsap.killTweensOf(liquidSource.rotation)
      gsap.killTweensOf(spiralBeam.position)
      gsap.killTweensOf(spiralBeam.rotation)
      gsap.killTweensOf(runes.scale)
      gsap.killTweensOf(runes.rotation)
      gsap.killTweensOf(vortex.rotation)
      gsap.killTweensOf(particleFlow.rotation)
      ripples.forEach(ripple => {
        gsap.killTweensOf(ripple.scale)
      })
      gsap.killTweensOf(camera)
      gsap.killTweensOf(camera.position)
    }, null, 28)

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
export const Fengxianyin = {
  name: 'fengxianyin',
  displayName: '🏮 封仙印',
  description: '液态金属本源，螺旋光柱，立体封纹，灵气漩涡',
  category: '仙侠',
  version: '1.0.0',
  tags: ['seal', 'liquid', 'spiral', 'spiritual', 'immortal']
}
