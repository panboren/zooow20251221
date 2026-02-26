/**
 * 🏰 永夜魔城 - Yongye Mocheng
 *
 * 这是一个融合了赛博朋克与东方玄学的视觉特效：
 * 1. 机械齿轮矩阵 - 千米金属齿轮群，咬合转动中符文依次亮起
 * 2. 幽蓝蒸汽粒子 - 关节喷射的蒸汽凝结为冰晶，形成光雾
 * 3. 血色符文链条 - 攀附金属表面的动态符文，金红交错的能量波纹
 * 4. 多层光环核心 - 不同转速的光环嵌套，向外辐射波纹
 * 5. 悬浮碎片带 - 静止的机械碎片层，月光投射斑驳光影
 *
 * 视觉表现：
 * - 千米高的机械巨城悬浮于空，齿轮咬合转动
 * - 血色符文在齿轮上依次亮起，如同城市的脉搏
 * - 幽蓝蒸汽喷射，凝结成冰晶光雾
 * - 血色符文链条攀附在金属表面，有节奏闪烁
 * - 金色能量核心辐射波纹，激发符文亮起
 * - 机械碎片带悬浮周围，月光投下斑驳光影
 *
 * 创作灵感来源：
 * - 赛博朋克机械美学
 * - 东方玄学符文阵法
 * - 工业蒸汽朋克元素
 *
 * @author Cyber Mystic
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

/**
 * 机械齿轮着色器 - 顶点着色器
 */
const gearVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRotation;
  uniform float uPulse;

  attribute float aGearIndex;
  attribute float aRuneIndex;

  varying vec2 vUv;
  varying float vGearIndex;
  varying float vRuneIndex;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vGearIndex = aGearIndex;
    vRuneIndex = aRuneIndex;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);

    // 齿轮旋转
    vec3 pos = position;
    float rotation = uRotation * (1.0 + aGearIndex * 0.1);
    pos.xz = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation)) * pos.xz;

    // 脉冲缩放
    pos *= (1.0 + uPulse * 0.02);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 机械齿轮着色器 - 片元着色器
 */
const gearFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uCoreWave;

  varying vec2 vUv;
  varying float vGearIndex;
  varying float vRuneIndex;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    // 紫黑色金属基础色
    vec3 darkMetal = vec3(0.08, 0.05, 0.12);
    vec3 midMetal = vec3(0.12, 0.08, 0.18);
    vec3 brightMetal = vec3(0.18, 0.12, 0.25);

    // 根据高度混合金属色
    float height = (vPosition.y + 20.0) / 40.0;
    vec3 metalColor = mix(darkMetal, midMetal, height);
    metalColor = mix(metalColor, brightMetal, smoothstep(0.7, 1.0, height));

    // 齿轮纹理
    float gearPattern = sin(vUv.x * 50.0) * sin(vUv.y * 50.0) * 0.5 + 0.5;
    metalColor *= (0.7 + gearPattern * 0.3);

    // 紫色魔性符文
    float runePhase = vRuneIndex * 0.1 + vGearIndex * 0.05;
    float runePulse = sin(uTime * 2.0 + runePhase) * 0.5 + 0.5;
    float runeBright = smoothstep(0.75, 1.0, runePulse);
    
    // 核心波纹激发符文
    float coreExcite = smoothstep(0.4, 0.6, uCoreWave);
    runeBright += coreExcite * 0.6;

    vec3 darkPurple = vec3(0.4, 0.1, 0.6);
    vec3 brightPurple = vec3(0.7, 0.2, 0.9);
    vec3 runeColor = mix(darkPurple, brightPurple, runeBright);

    // 符文位置
    float runePattern = sin(vUv.x * 20.0 + vUv.y * 20.0 + runePhase * 10.0);
    float runeMask = smoothstep(0.92, 1.0, runePattern) * 0.4;

    metalColor = mix(metalColor, runeColor, runeMask * (0.4 + runeBright * 0.6));

    // 紫色高光
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(0.0, dot(vNormal, lightDir));
    metalColor += vec3(0.15, 0.08, 0.25) * diff;

    // 边缘发光
    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    metalColor += vec3(0.2, 0.1, 0.4) * pow(edge, 3.0);

    gl_FragColor = vec4(metalColor, uOpacity * 0.85);
  }
`

/**
 * 幽蓝蒸汽粒子着色器 - 顶点着色器
 */
const steamVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRise;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aDelay;
  attribute float aParticleType;

  varying float vParticleType;
  varying float vFade;

  void main() {
    vParticleType = aParticleType;

    vec3 pos = position;
    
    // 蒸汽上升
    float riseTime = max(0.0, uTime - aDelay);
    pos.y += riseTime * aSpeed * uRise;

    // 横向扩散
    pos.x += sin(riseTime * 2.0 + aDelay * 10.0) * 0.5;
    pos.z += cos(riseTime * 2.0 + aDelay * 10.0) * 0.5;

    // 旋转扩散
    float angle = riseTime * 0.5 + aDelay;
    vec2 rotated = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * pos.xz;
    pos.xz = rotated;

    // 淡出效果
    vFade = 1.0 - smoothstep(5.0, 10.0, riseTime);
    vFade *= smoothstep(0.0, 1.0, riseTime);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * 幽蓝蒸汽粒子着色器 - 片元着色器
 */
const steamFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying float vParticleType;
  varying float vFade;

  void main() {
    // 粒子形状
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float shape = 1.0 - smoothstep(0.0, 0.5, dist);

    // 晶体折射效果
    float crystalPattern = sin(center.x * 30.0) * sin(center.y * 30.0);
    float crystal = smoothstep(0.7, 1.0, crystalPattern) * 0.5;

    // 暗紫黑色
    vec3 deepPurple = vec3(0.08, 0.04, 0.15);
    vec3 midPurple = vec3(0.12, 0.08, 0.25);
    vec3 brightPurple = vec3(0.25, 0.15, 0.45);

    vec3 color = mix(deepPurple, midPurple, dist);
    color = mix(color, brightPurple, crystal);

    // 内部发光
    float glow = smoothstep(0.5, 0.0, dist);
    color += vec3(0.15, 0.08, 0.3) * glow * 0.4;

    gl_FragColor = vec4(color, shape * vFade * uOpacity * 0.7);
  }
`

/**
 * 血色符文链条着色器 - 顶点着色器
 */
const runeChainVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uExpansion;

  attribute float aChainIndex;
  attribute float aRunePhase;

  varying vec2 vUv;
  varying float vChainIndex;
  varying float vRunePhase;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vChainIndex = aChainIndex;
    vRunePhase = aRunePhase;
    vPosition = position;

    vec3 pos = position;

    // 链条收缩舒展
    float pulse = sin(uTime * 3.0 + aChainIndex * 0.5) * 0.5 + 0.5;
    pos *= (1.0 + pulse * 0.1 * uExpansion);

    // 沿表面运动
    float movePhase = uTime * 2.0 + aRunePhase;
    pos.y += sin(movePhase) * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 血色符文链条着色器 - 片元着色器
 */
const runeChainFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uCoreWave;

  varying vec2 vUv;
  varying float vChainIndex;
  varying float vRunePhase;
  varying vec3 vPosition;

  void main() {
    // 暗紫黑色基底
    vec3 darkPurple = vec3(0.12, 0.06, 0.18);
    vec3 brightPurple = vec3(0.45, 0.15, 0.65);

    // 符文闪烁
    float pulse = sin(uTime * 4.0 + vRunePhase) * 0.5 + 0.5;
    
    // 核心波纹激发
    float coreExcite = smoothstep(0.4, 0.6, uCoreWave);
    pulse += coreExcite * 0.8;

    vec3 chainColor = mix(darkPurple, brightPurple, pulse);

    // 符文纹理
    float runePattern = sin(vUv.x * 50.0 + vRunePhase * 10.0) *
                        cos(vUv.y * 50.0 + uTime * 5.0);
    float runeBright = smoothstep(0.8, 1.0, runePattern);

    chainColor += vec3(0.15, 0.08, 0.25) * runeBright;

    // 链节纹理
    float linkPattern = sin(vUv.y * 20.0) * 0.5 + 0.5;
    chainColor *= (0.6 + linkPattern * 0.4);

    // 能量流动效果
    float flow = sin(vUv.y * 30.0 + uTime * 10.0 + vChainIndex) * 0.5 + 0.5;
    chainColor += vec3(0.2, 0.1, 0.35) * flow;

    gl_FragColor = vec4(chainColor, uOpacity * 0.75);
  }
`

/**
 * 多层光环核心着色器 - 顶点着色器
 */
const coreVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRingSpeed;

  attribute float aRingLayer;

  varying vec2 vUv;
  varying float vRingLayer;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vRingLayer = aRingLayer;
    vPosition = position;

    vec3 pos = position;

    // 不同层不同转速
    float layerSpeed = uRingSpeed * (1.0 - aRingLayer * 0.2);
    float angle = uTime * layerSpeed;

    pos.xz = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * pos.xz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 多层光环核心着色器 - 片元着色器
 */
const coreFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vRingLayer;
  varying vec3 vPosition;

  void main() {
    // 紫黑色光环
    vec3 darkPurple = vec3(0.15, 0.08, 0.25);
    vec3 midPurple = vec3(0.35, 0.18, 0.55);
    vec3 brightPurple = vec3(0.6, 0.35, 0.85);

    // 根据层混合颜色
    vec3 ringColor = mix(darkPurple, midPurple, vRingLayer);
    ringColor = mix(ringColor, brightPurple, smoothstep(0.7, 1.0, vRingLayer));

    // 光环旋转模糊效果
    float radius = length(vPosition.xz);
    float angle = atan(vPosition.z, vPosition.x);
    float rotationBlur = sin(angle * 10.0 + uTime * 2.0) * 0.5 + 0.5;
    
    ringColor *= (0.7 + rotationBlur * 0.3);

    // 符文纹理
    float runePattern = sin(vUv.x * 100.0 + vRingLayer * 20.0) *
                        cos(vUv.y * 100.0 + uTime * 5.0);
    float runeBright = smoothstep(0.85, 1.0, runePattern);

    ringColor += vec3(0.15, 0.08, 0.3) * runeBright;

    // 能量辐射
    float wave = sin(radius * 5.0 - uTime * 3.0) * 0.5 + 0.5;
    ringColor += vec3(0.2, 0.1, 0.4) * wave;

    // 边缘发光
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    ringColor += vec3(0.5, 0.25, 0.75) * pow(edge, 3.0) * 0.4;

    gl_FragColor = vec4(ringColor, uOpacity * 0.8);
  }
`

/**
 * 悬浮碎片带着色器 - 顶点着色器
 */
const debrisVertexShader = `
  precision highp float;

  uniform float uTime;

  attribute float aDebrisType;
  attribute float aRotationSpeed;
  attribute vec3 aRotationAxis;

  varying float vDebrisType;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vDebrisType = aDebrisType;
    vPosition = position;

    // 缓慢旋转
    float angle = uTime * aRotationSpeed;
    vec3 pos = position;
    pos = mat3(
      1.0, 0.0, 0.0,
      0.0, cos(angle), -sin(angle),
      0.0, sin(angle), cos(angle)
    ) * pos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * 悬浮碎片带着色器 - 片元着色器
 */
const debrisFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying float vDebrisType;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    // 暗紫黑色碎片
    vec3 darkRust = vec3(0.1, 0.06, 0.12);
    vec3 midRust = vec3(0.18, 0.1, 0.22);
    vec3 lightRust = vec3(0.28, 0.18, 0.35);

    vec3 debrisColor = mix(darkRust, midRust, vDebrisType);
    debrisColor = mix(debrisColor, lightRust, smoothstep(0.5, 1.0, vDebrisType));

    // 淡紫光照效果
    float moonPhase = sin(uTime * 0.1) * 0.5 + 0.5;
    vec3 moonLight = vec3(0.4, 0.3, 0.6) * moonPhase * 0.25;

    // 表面纹理
    float surfacePattern = sin(vUv.x * 30.0) * cos(vUv.y * 30.0);
    debrisColor *= (0.75 + surfacePattern * 0.15);

    debrisColor += moonLight;

    // 边缘高光
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    debrisColor += vec3(0.2, 0.12, 0.35) * pow(edge, 2.0) * 0.15;

    gl_FragColor = vec4(debrisColor, uOpacity * 0.7);
  }
`

/**
 * 能量波纹着色器 - 后处理
 */
const energyWaveVertexShader = `
  precision highp float;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const energyWaveFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uWaveRadius;
  uniform sampler2D uTexture;

  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    // 能量波纹
    float wave = smoothstep(uWaveRadius, uWaveRadius - 0.1, dist);
    wave *= smoothstep(uWaveRadius - 0.2, uWaveRadius - 0.1, dist);

    // 金色波纹
    vec3 goldWave = vec3(1.0, 0.8, 0.2);

    vec3 color = texture2D(uTexture, vUv).rgb;
    color += goldWave * wave * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`

/**
 * 创建机械齿轮
 */
function createGears() {
  const geometries = []
  const gearCount = 50

  for (let i = 0; i < gearCount; i++) {
    const radius = 5 + Math.random() * 15
    const geometry = new THREE.CylinderGeometry(radius, radius, 2, 32)

    // 添加齿轮齿
    const posCount = geometry.attributes.position.count
    const gearIndices = new Float32Array(posCount)
    const runeIndices = new Float32Array(posCount)

    for (let j = 0; j < posCount; j++) {
      gearIndices[j] = i
      runeIndices[j] = Math.random()
    }

    geometry.setAttribute('aGearIndex', new THREE.BufferAttribute(gearIndices, 1))
    geometry.setAttribute('aRuneIndex', new THREE.BufferAttribute(runeIndices, 1))

    geometries.push(geometry)
  }

  return geometries
}

/**
 * 创建幽蓝蒸汽粒子
 */
function createSteamParticles() {
  const geometry = new THREE.BufferGeometry()

  const count = 5000
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const delays = new Float32Array(count)
  const particleTypes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 底部喷射
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 30

    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = -20 + Math.random() * 5
    positions[i3 + 2] = Math.sin(angle) * radius

    sizes[i] = 0.5 + Math.random() * 1.5
    speeds[i] = 0.3 + Math.random() * 0.5
    delays[i] = Math.random() * 10
    particleTypes[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))
  geometry.setAttribute('aParticleType', new THREE.BufferAttribute(particleTypes, 1))

  return geometry
}

/**
 * 创建血色符文链条
 */
function createRuneChains() {
  const geometry = new THREE.BufferGeometry()

  const chainCount = 100
  const segmentsPerChain = 20
  const totalSegments = chainCount * segmentsPerChain

  const positions = new Float32Array(totalSegments * 3)
  const normals = new Float32Array(totalSegments * 3)
  const uvs = new Float32Array(totalSegments * 2)
  const chainIndices = new Float32Array(totalSegments)
  const runePhases = new Float32Array(totalSegments)

  for (let c = 0; c < chainCount; c++) {
    const angle = (c / chainCount) * Math.PI * 2
    const radius = 10 + Math.random() * 25
    const startY = -15 + Math.random() * 30

    for (let s = 0; s < segmentsPerChain; s++) {
      const idx = (c * segmentsPerChain + s) * 3
      const idx2 = (c * segmentsPerChain + s) * 2

      const y = startY + s * 2

      positions[idx] = Math.cos(angle) * radius
      positions[idx + 1] = y
      positions[idx + 2] = Math.sin(angle) * radius

      // 法线指向圆心
      normals[idx] = -Math.cos(angle)
      normals[idx + 1] = 0
      normals[idx + 2] = -Math.sin(angle)

      uvs[idx2] = s / segmentsPerChain
      uvs[idx2 + 1] = (c / chainCount)

      chainIndices[c * segmentsPerChain + s] = c
      runePhases[c * segmentsPerChain + s] = Math.random()
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setAttribute('aChainIndex', new THREE.BufferAttribute(chainIndices, 1))
  geometry.setAttribute('aRunePhase', new THREE.BufferAttribute(runePhases, 1))

  return geometry
}

/**
 * 创建多层光环核心
 */
function createEnergyCore() {
  const geometries = []
  const ringCount = 10

  for (let i = 0; i < ringCount; i++) {
    const innerRadius = 3 + i * 1.5
    const outerRadius = innerRadius + 1.5
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128, 1)

    const posCount = geometry.attributes.position.count
    const ringLayers = new Float32Array(posCount)

    for (let j = 0; j < posCount; j++) {
      ringLayers[j] = i / ringCount
    }

    geometry.setAttribute('aRingLayer', new THREE.BufferAttribute(ringLayers, 1))
    geometries.push(geometry)
  }

  return geometries
}

/**
 * 创建悬浮碎片带
 */
function createDebris() {
  const geometry = new THREE.BufferGeometry()

  const count = 2000
  const positions = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const uvs = new Float32Array(count * 2)
  const debrisTypes = new Float32Array(count)
  const rotationSpeeds = new Float32Array(count)
  const rotationAxes = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 球形分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 40 + Math.random() * 30

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    normals[i3] = Math.random() * 2 - 1
    normals[i3 + 1] = Math.random() * 2 - 1
    normals[i3 + 2] = Math.random() * 2 - 1

    uvs[i * 2] = Math.random()
    uvs[i * 2 + 1] = Math.random()

    debrisTypes[i] = Math.random()
    rotationSpeeds[i] = 0.1 + Math.random() * 0.3

    rotationAxes[i3] = Math.random() * 2 - 1
    rotationAxes[i3 + 1] = Math.random() * 2 - 1
    rotationAxes[i3 + 2] = Math.random() * 2 - 1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setAttribute('aDebrisType', new THREE.BufferAttribute(debrisTypes, 1))
  geometry.setAttribute('aRotationSpeed', new THREE.BufferAttribute(rotationSpeeds, 1))
  geometry.setAttribute('aRotationAxis', new THREE.BufferAttribute(rotationAxes, 3))

  return geometry
}

/**
 * 主特效函数
 */
export default function animateYongye(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  let cleaned = false
  const originalBackground = scene.background?.clone()

  try {
    // ==================== 环境设置 ====================
    scene.background = new THREE.Color(0x020205)  // 暗黑色背景

    setupInitialCamera(camera, new THREE.Vector3(0, 10, 80), 80, controls)
    camera.lookAt(0, 10, 0)

    // ==================== 创建主组 ====================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 1. 机械齿轮矩阵 ====================
    const gearGeometries = createGears()
    const gears = []

    gearGeometries.forEach((geometry, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uRotation: { value: 0 },
          uPulse: { value: 0 }
        },
        vertexShader: gearVertexShader,
        fragmentShader: gearFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const gear = new THREE.Mesh(geometry, material)
      gear.position.y = -20 + (i / gearGeometries.length) * 40
      gear.rotation.x = Math.PI / 2
      mainGroup.add(gear)
      gears.push(gear)
    })

    // ==================== 2. 幽蓝蒸汽粒子 ====================
    const steamGeometry = createSteamParticles()
    const steamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uRise: { value: 0 }
      },
      vertexShader: steamVertexShader,
      fragmentShader: steamFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const steam = new THREE.Points(steamGeometry, steamMaterial)
    mainGroup.add(steam)

    // ==================== 3. 血色符文链条 ====================
    const runeChainGeometry = createRuneChains()
    const runeChainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uExpansion: { value: 0 },
        uCoreWave: { value: 0 }
      },
      vertexShader: runeChainVertexShader,
      fragmentShader: runeChainFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const runeChains = new THREE.Points(runeChainGeometry, runeChainMaterial)
    mainGroup.add(runeChains)

    // ==================== 4. 多层光环核心 ====================
    const coreGeometries = createEnergyCore()
    const coreRings = []

    coreGeometries.forEach((geometry, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uRingSpeed: { value: 0 }
        },
        vertexShader: coreVertexShader,
        fragmentShader: coreFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const ring = new THREE.Mesh(geometry, material)
      ring.position.set(0, 30, 0)
      ring.rotation.x = -Math.PI / 2
      mainGroup.add(ring)
      coreRings.push(ring)
    })

    // ==================== 5. 悬浮碎片带 ====================
    const debrisGeometry = createDebris()
    const debrisMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: debrisVertexShader,
      fragmentShader: debrisFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const debris = new THREE.Points(debrisGeometry, debrisMaterial)
    mainGroup.add(debris)

    // ==================== 动画时间线 ====================
    const tl = createTimeline(
      () => {
        onComplete?.({ type: 'yongye', duration: 35000 })
      },
      onError,
      '永夜魔城',
      controls
    )

    tl.play()

    // ==================== 阶段1: 齿轮矩阵显现 (0-7秒) ====================
    gears.forEach((gear, i) => {
      tl.to(gear.material.uniforms.uOpacity, { value: 1, duration: 5 }, i * 0.1)
      tl.to(gear.material.uniforms.uRotation, { value: Math.PI * 2, duration: 7, repeat: -1 }, 0)
    })

    // ==================== 阶段2: 蒸汽粒子喷发 (6-13秒) ====================
    tl.to(steam.material.uniforms.uOpacity, { value: 0.8, duration: 5 }, 6)
    tl.to(steam.material.uniforms.uRise, { value: 1, duration: 5 }, 6)

    // ==================== 阶段3: 符文链条舒展 (12-19秒) ====================
    tl.to(runeChainMaterial.uniforms.uOpacity, { value: 1, duration: 5 }, 12)
    tl.to(runeChainMaterial.uniforms.uExpansion, { value: 1, duration: 5 }, 12)

    // ==================== 阶段4: 能量核心启动 (18-25秒) ====================
    coreRings.forEach((ring, i) => {
      tl.to(ring.material.uniforms.uOpacity, { value: 1, duration: 5 }, 18 + i * 0.2)
      tl.to(ring.material.uniforms.uRingSpeed, { value: 3.0 - i * 0.2, duration: 5 }, 18)
    })

    // ==================== 运镜 ====================
    tl.to(camera.position, { x: 20, y: 30, z: 60, duration: 15, ease: 'power2.inOut' }, 0)
    tl.to(camera.position, { x: -20, y: 20, z: 50, duration: 10, ease: 'power2.inOut' }, 15)
    tl.to(camera.position, { x: 0, y: 40, z: 70, duration: 10, ease: 'power2.inOut' }, 25)

    // 必须在创建 gearMaterials 之前定义
    const gearMaterials = gears.map(g => g.material)

    // ==================== 阶段5: 能量波纹辐射 (24-32秒) ====================
    const coreWaveObj = { value: 0 }
    tl.to(coreWaveObj, { value: 1, duration: 8, ease: 'power2.out', onUpdate: () => {
      gearMaterials.forEach(m => {
        if (m.uniforms.uCoreWave) {
          m.uniforms.uCoreWave.value = coreWaveObj.value
        }
      })
      if (runeChainMaterial.uniforms.uCoreWave) {
        runeChainMaterial.uniforms.uCoreWave.value = coreWaveObj.value
      }
    }}, 24)

    // ==================== 阶段6: 碎片带显现 (28-35秒) ====================
    tl.to(debris.material.uniforms.uOpacity, { value: 0.6, duration: 5 }, 28)

    // ==================== 动画循环 ====================
    const clock = new THREE.Clock()

    function animate() {
      if (cleaned) return

      const time = clock.getElapsedTime()

      // 更新 uniform
      gears.forEach(gear => {
        gear.material.uniforms.uTime.value = time
        gear.material.uniforms.uPulse.value = Math.sin(time * 2.0) * 0.5 + 0.5
      })

      steam.material.uniforms.uTime.value = time
      runeChainMaterial.uniforms.uTime.value = time
      coreRings.forEach(ring => {
        ring.material.uniforms.uTime.value = time
      })
      debris.material.uniforms.uTime.value = time

      // 齿轮缓慢自转
      mainGroup.rotation.y = time * 0.05

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // ==================== 清理 ====================
    tl.call(() => {
      if (cleaned) return
      cleaned = true

      scene.remove(mainGroup)

      // 清理齿轮
      gears.forEach(gear => {
        gear.material.dispose()
        gear.geometry.dispose()
      })

      // 清理蒸汽
      steam.material.dispose()
      steam.geometry.dispose()

      // 清理符文链条
      runeChainMaterial.dispose()
      runeChainGeometry.dispose()

      // 清理核心光环
      coreRings.forEach(ring => {
        ring.material.dispose()
        ring.geometry.dispose()
      })

      // 清理碎片
      debris.material.dispose()
      debris.geometry.dispose()

      // 恢复背景
      if (originalBackground) {
        scene.background = originalBackground
      }

      // 清理 GSAP 动画
      gsap.killTweensOf(mainGroup.rotation)
      gsap.killTweensOf(camera)
      gsap.killTweensOf(camera.position)
    }, null, 35)

    return {
      timeline: tl,
      cleanup: () => {
        if (cleaned) return
        cleaned = true
        scene.remove(mainGroup)
        gsap.killTweensOf('*')
      }
    }
      steam.geometry.dispose()
      mainGroup.remove(steam)

      runeChainMaterial.dispose()
      runeChainGeometry.dispose()
      mainGroup.remove(runeChains)

      coreRings.forEach(ring => {
        ring.material.dispose()
        ring.geometry.dispose()
        mainGroup.remove(ring)
      })

      debris.material.dispose()
      debris.geometry.dispose()
      mainGroup.remove(debris)

      scene.remove(mainGroup)

      if (originalBackground) {
        scene.background = originalBackground
      }

      tl.kill()
      gsap.killTweensOf(camera.position)

  } catch (error) {
    onError?.(error)
    throw error
  }
}
