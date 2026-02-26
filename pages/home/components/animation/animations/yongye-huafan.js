/**
 * 🏰🌸 永夜化凡 - Yongye Huafan
 *
 * 这是一个融合了永夜魔城与化凡意境的终极视觉特效：
 * 1. 紫黑齿轮矩阵 - 千米金属齿轮群，咬合转动中紫色符文依次亮起
 * 2. 暗紫蒸汽粒子 - 关节喷射的蒸汽凝结为冰晶，形成紫色光雾
 * 3. 紫色符文链条 - 攀附金属表面的动态符文，紫光交错的能量波纹
 * 4. 多层光环核心 - 紫色光环嵌套，向外辐射紫色波纹
 * 5. 悬浮碎片带 - 静止的暗紫机械碎片层，紫色光投射斑驳光影
 * 6. 粉色涟漪光晕 - 在齿轮底部缓缓扩散，内外交错的干涉图案
 * 7. 记忆碎片镜面 - 破碎镜面状半透明体，内映星辰、夜色、花瓣等画面
 * 8. 规则之眼巨瞳 - 金色光线编织，瞳孔为紫色漩涡
 * 9. 锁链融化液体 - 紫金锁链软化变色，融入粉色光晕
 *
 * 视觉表现：
 * - 千米高的暗紫机械巨城悬浮于空，齿轮咬合转动
 * - 紫色符文在齿轮上依次亮起，如同城市的脉搏
 * - 暗紫蒸汽喷射，凝结成冰晶光雾
 * - 底部粉色涟漪缓缓扩散，内外交错的干涉图案
 * - 巨眼俯视，紫金锁链从瞳孔垂下融入涟漪
 * - 紫色能量核心辐射波纹，激发符文亮起
 * - 机械碎片带悬浮周围，紫色光投下斑驳光影
 *
 * 创作灵感来源：
 * - 赛博朋克机械美学与东方留白美学的完美融合
 * - 紫黑色魔性氛围与粉色温婉意境的对比
 * - 规则与情感的冲突与融合
 *
 * @author Cyber Mystic Poet
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

/**
 * 紫黑齿轮着色器 - 顶点着色器
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
 * 紫黑齿轮着色器 - 片元着色器
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
 * 暗紫蒸汽粒子着色器 - 顶点着色器
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
 * 暗紫蒸汽粒子着色器 - 片元着色器
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
 * 紫色符文链条着色器 - 顶点着色器
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
 * 紫色符文链条着色器 - 片元着色器
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
 * 粉色涟漪光晕着色器 - 顶点着色器
 */
const pinkRippleVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uRippleSpeed;
  uniform float uRippleIntensity;

  attribute float aRippleIndex;

  varying vec2 vUv;
  varying float vRippleIndex;
  varying float vDist;

  void main() {
    vUv = uv;
    vRippleIndex = aRippleIndex;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

    // 涟漪波动效果
    float dist = length(position.xz);
    float wave = sin(dist * 0.5 - uTime * uRippleSpeed + aRippleIndex * 2.0) * 0.3;
    vec3 pos = position;
    pos.y += wave * (1.0 - smoothstep(0.0, 50.0, dist));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 粉色涟漪光晕着色器 - 片元着色器
 */
const pinkRippleFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uRippleIntensity;

  varying vec2 vUv;
  varying float vRippleIndex;
  varying float vDist;

  void main() {
    // 多层涟漪环
    float dist = length(vUv - 0.5) * 2.0;

    // 内外交错的干涉图案
    float wave1 = sin(dist * 20.0 - uTime * 2.0 + vRippleIndex * 3.0);
    float wave2 = sin(dist * 15.0 + uTime * 1.5 + vRippleIndex * 2.0);
    float interference = (wave1 + wave2) * 0.5;

    // 暖色向外衰减
    vec3 innerPink = vec3(1.0, 0.6, 0.7);   // 深粉
    vec3 midPink = vec3(1.0, 0.75, 0.85);   // 浅粉
    vec3 outerPink = vec3(1.0, 0.85, 0.9);  // 淡粉

    // 使用 mix 替代 if-else
    float t = smoothstep(0.0, 0.33, dist);
    vec3 color = mix(innerPink, midPink, min(1.0, dist / 0.33));
    color = mix(color, outerPink, smoothstep(0.33, 1.0, dist));

    // 涟漪环高光
    float ring = smoothstep(0.0, 0.2, interference);
    color += vec3(1.0, 0.9, 0.95) * ring * 0.4;

    // 距离衰减
    float distanceFade = 1.0 - smoothstep(0.0, 0.5, dist);
    color *= distanceFade;

    // 涟漪强度
    color *= (0.5 + uRippleIntensity * 0.5);

    gl_FragColor = vec4(color, uOpacity * 0.6 * distanceFade);
  }
`

/**
 * 创建齿轮几何体
 */
function createGears() {
  const geometries = []
  const gearCount = 50

  for (let i = 0; i < gearCount; i++) {
    const radius = 3 + Math.random() * 7
    const teeth = Math.floor(8 + Math.random() * 16)
    const segments = 64

    const geometry = new THREE.CylinderGeometry(radius, radius, 0.5, segments)
    const positions = geometry.attributes.position.array

    // 添加齿轮齿牙
    for (let j = 0; j < teeth; j++) {
      const angle = (j / teeth) * Math.PI * 2
      const toothWidth = (Math.PI * 2 / teeth) * 0.3
      const toothHeight = 0.5

      for (let k = 0; k < segments; k++) {
        const faceAngle = (k / segments) * Math.PI * 2
        const faceDiff = Math.abs(faceAngle - angle)
        const normalizedDiff = faceDiff < Math.PI ? faceDiff : Math.PI * 2 - faceDiff

        if (normalizedDiff < toothWidth) {
          const ratio = 1.0 - (normalizedDiff / toothWidth)
          const toothOffset = Math.sin(ratio * Math.PI) * toothHeight

          const idx = k * 3
          const x = positions[idx]
          const z = positions[idx + 2]
          const dist = Math.sqrt(x * x + z * z)
          const currentRadius = dist

          if (currentRadius > 0) {
            positions[idx] = (x / currentRadius) * (currentRadius + toothOffset)
            positions[idx + 2] = (z / currentRadius) * (currentRadius + toothOffset)
          }
        }
      }
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()

    // 添加自定义属性
    const gearIndices = new Float32Array(positions.length / 3)
    const runeIndices = new Float32Array(positions.length / 3)

    for (let j = 0; j < gearIndices.length; j++) {
      gearIndices[j] = i / gearCount
      runeIndices[j] = (j / gearIndices.length) * 10
    }

    geometry.setAttribute('aGearIndex', new THREE.BufferAttribute(gearIndices, 1))
    geometry.setAttribute('aRuneIndex', new THREE.BufferAttribute(runeIndices, 1))

    geometries.push(geometry)
  }

  return geometries
}

/**
 * 创建蒸汽粒子几何体
 */
function createSteamParticles() {
  const count = 5000
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const delays = new Float32Array(count)
  const particleTypes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 将蒸汽粒子分散在更大范围
    const angle = Math.random() * Math.PI * 2
    const radius = 20 + Math.random() * 50
    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = -30 + Math.random() * 10
    positions[i3 + 2] = Math.sin(angle) * radius

    sizes[i] = 2 + Math.random() * 8
    speeds[i] = 5 + Math.random() * 10
    delays[i] = Math.random() * 10
    particleTypes[i] = Math.random()
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))
  geometry.setAttribute('aParticleType', new THREE.BufferAttribute(particleTypes, 1))

  return geometry
}

/**
 * 创建符文链条几何体
 */
function createRuneChains() {
  const count = 100
  const positions = new Float32Array(count * 2 * 3)
  const chainIndices = new Float32Array(count * 2)
  const runePhases = new Float32Array(count * 2)

  for (let i = 0; i < count; i++) {
    const i6 = i * 6

    // 将链条分散在更大的环形区域
    const theta1 = (i / count) * Math.PI * 2
    const theta2 = theta1 + (Math.PI / count)

    const radius = 25 + Math.random() * 20
    const height = (Math.random() - 0.5) * 60

    positions[i6] = Math.cos(theta1) * radius
    positions[i6 + 1] = height
    positions[i6 + 2] = Math.sin(theta1) * radius

    positions[i6 + 3] = Math.cos(theta2) * radius
    positions[i6 + 4] = height
    positions[i6 + 5] = Math.sin(theta2) * radius

    chainIndices[i * 2] = i / count
    chainIndices[i * 2 + 1] = i / count

    runePhases[i * 2] = i * 0.1
    runePhases[i * 2 + 1] = i * 0.1
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aChainIndex', new THREE.BufferAttribute(chainIndices, 1))
  geometry.setAttribute('aRunePhase', new THREE.BufferAttribute(runePhases, 1))

  return geometry
}

/**
 * 创建多层光环核心
 */
function createEnergyCore() {
  const geometries = []
  const layerCount = 10

  for (let i = 0; i < layerCount; i++) {
    // 增大光环尺寸
    const radius = 3 + i * 1.5
    const geometry = new THREE.TorusGeometry(radius, 0.4, 16, 64)

    const ringLayers = new Float32Array(geometry.attributes.position.count)
    for (let j = 0; j < ringLayers.length; j++) {
      ringLayers[j] = i / layerCount
    }
    geometry.setAttribute('aRingLayer', new THREE.BufferAttribute(ringLayers, 1))

    geometries.push(geometry)
  }

  return geometries
}

/**
 * 创建粉色涟漪几何体
 */
function createPinkRipples() {
  const geometries = []
  const rippleCount = 5

  for (let i = 0; i < rippleCount; i++) {
    // 增大涟漪尺寸
    const radius = 15 + i * 12
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 64, 64)

    const rippleIndices = new Float32Array(geometry.attributes.position.count)
    for (let j = 0; j < rippleIndices.length; j++) {
      rippleIndices[j] = i
    }
    geometry.setAttribute('aRippleIndex', new THREE.BufferAttribute(rippleIndices, 1))

    geometries.push(geometry)
  }

  return geometries
}

/**
 * 主特效函数
 */
export default function animateYongyeHuafan(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  let cleaned = false

  // 保存原始背景
  const originalBackground = scene.background ? scene.background.clone() : null

  try {
    // ==================== 环境设置 ====================
    scene.background = new THREE.Color(0x020205)  // 暗黑色背景

    setupInitialCamera(camera, new THREE.Vector3(0, 10, 120), 90, controls)
    camera.lookAt(0, 10, 0)

    // ==================== 创建主组 ====================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 1. 紫黑齿轮矩阵 ====================
    const gearGeometries = createGears()
    const gears = []

    gearGeometries.forEach((geometry, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uRotation: { value: 0 },
          uPulse: { value: 0 },
          uCoreWave: { value: 0 }
        },
        vertexShader: gearVertexShader,
        fragmentShader: gearFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const gear = new THREE.Mesh(geometry, material)
      // 将齿轮分散在更大的空间中
      const angle = (i / 50) * Math.PI * 2
      const radius = 20 + Math.random() * 30
      const height = (i % 5 - 2) * 15
      gear.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      mainGroup.add(gear)
      gears.push(gear)
    })

    // ==================== 2. 暗紫蒸汽粒子 ====================
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

    // ==================== 3. 紫色符文链条 ====================
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
      blending: THREE.AdditiveBlending,
      linewidth: 2
    })

    const runeChains = new THREE.LineSegments(runeChainGeometry, runeChainMaterial)
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

    // ==================== 5. 粉色涟漪光晕 ====================
    const rippleGeometries = createPinkRipples()
    const ripples = []

    rippleGeometries.forEach((geometry, i) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uRippleSpeed: { value: 2.0 },
          uRippleIntensity: { value: 1.0 }
        },
        vertexShader: pinkRippleVertexShader,
        fragmentShader: pinkRippleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const ripple = new THREE.Mesh(geometry, material)
      ripple.rotation.x = -Math.PI / 2
      ripple.position.y = -25
      mainGroup.add(ripple)
      ripples.push(ripple)
    })

    // ==================== 创建动画时间线 ====================
    const tl = createTimeline(
      callbacks?.onComplete,
      callbacks?.onError,
      'yongye-huafan',
      controls
    )

    // ==================== 阶段1: 齿轮矩阵显现 (0-7秒) ====================
    gears.forEach((gear, i) => {
      tl.to(gear.material.uniforms.uOpacity, { value: 1, duration: 3 }, i * 0.1)
      tl.to(gear.material.uniforms.uRotation, { value: Math.PI * 2, duration: 7 }, 0)
      tl.to(gear.material.uniforms.uPulse, { value: 1, duration: 3 }, 0)
    })

    // ==================== 阶段2: 蒸汽粒子喷发 (6-13秒) ====================
    tl.to(steam.material.uniforms.uOpacity, { value: 1, duration: 5 }, 6)
    tl.to(steam.material.uniforms.uRise, { value: 1, duration: 5 }, 6)

    // ==================== 阶段3: 符文链条舒展 (12-19秒) ====================
    tl.to(runeChainMaterial.uniforms.uOpacity, { value: 1, duration: 5 }, 12)
    tl.to(runeChainMaterial.uniforms.uExpansion, { value: 1, duration: 5 }, 12)

    // ==================== 阶段4: 粉色涟漪显现 (18-25秒) ====================
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 1, duration: 5 }, 18 + i * 1)
    })

    // ==================== 阶段5: 能量核心启动 (24-31秒) ====================
    coreRings.forEach((ring, i) => {
      tl.to(ring.material.uniforms.uOpacity, { value: 1, duration: 5 }, 24 + i * 0.2)
      tl.to(ring.material.uniforms.uRingSpeed, { value: 3.0 - i * 0.2, duration: 5 }, 24)
    })

    // ==================== 阶段6: 能量波纹辐射 (30-38秒) ====================
    const coreWaveObj = { value: 0 }
    tl.to(coreWaveObj, { value: 1, duration: 8, ease: 'power2.out', onUpdate: () => {
      gears.forEach(gear => {
        if (gear.material.uniforms.uCoreWave) {
          gear.material.uniforms.uCoreWave.value = coreWaveObj.value
        }
      })
      if (runeChainMaterial.uniforms.uCoreWave) {
        runeChainMaterial.uniforms.uCoreWave.value = coreWaveObj.value
      }
    }}, 30)

    // ==================== 运镜 ====================
    tl.to(camera.position, { x: 30, y: 40, z: 90, duration: 15, ease: 'power2.inOut' }, 0)
    tl.to(camera.position, { x: -30, y: 30, z: 80, duration: 10, ease: 'power2.inOut' }, 15)
    tl.to(camera.position, { x: 0, y: 50, z: 100, duration: 10, ease: 'power2.inOut' }, 25)

    // 必须在创建 gearMaterials 之前定义
    const gearMaterials = gears.map(g => g.material)

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
      ripples.forEach(ripple => {
        ripple.material.uniforms.uTime.value = time
      })

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

      // 清理粉色涟漪
      ripples.forEach(ripple => {
        ripple.material.dispose()
        ripple.geometry.dispose()
      })

      // 恢复背景
      if (originalBackground) {
        scene.background = originalBackground
      }

      // 清理 GSAP 动画
      gsap.killTweensOf(mainGroup.rotation)
      gsap.killTweensOf(camera)
      gsap.killTweensOf(camera.position)
    }, null, 38)

    return {
      timeline: tl,
      cleanup: () => {
        if (cleaned) return
        cleaned = true
        scene.remove(mainGroup)
        gsap.killTweensOf('*')
      }
    }
  } catch (error) {
    console.error('永夜化凡特效初始化失败:', error)
    return { timeline: gsap.timeline(), cleanup: () => {} }
  }
}
