/**
 * 🌸 化凡意境 - Huafan Yijing
 *
 * 这是一个融合了东方留白美学与情绪光影的视觉诗篇：
 * 1. 粉色涟漪光晕 - 多层半透明光晕叠加，暖色向外衰减
 * 2. 记忆碎片镜面 - 破碎镜面状半透明体，内映不同画面
 * 3. 规则之眼巨瞳 - 金色光线编织，瞳孔为黑色漩涡
 * 4. 锁链融化液体 - 金色锁链软化变色，融入粉色光晕
 * 5. 世界情感染色 - 天地景物整体偏暖色调，光边镶饰
 *
 * 视觉表现：
 * - 山巅粉色涟漪缓缓扩散，内外交错的干涉图案
 * - 记忆碎片悬浮，内映星辰、夜色、花瓣等画面
 * - 巨眼俯视，金色锁链从瞳孔垂下
 * - 锁链接触涟漪后融化，金色变为粉色液体
 * - 世界被重新染色，月光染暖意，云朵镶光边
 *
 * 创作灵感来源：
 * - 东方山水画留白美学
 * - 记忆与情感的光影表达
 * - 规则与情感的冲突与融合
 *
 * @author Visual Poet
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

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
    float fade = 1.0 - smoothstep(30.0, 100.0, vDist);
    color *= fade;

    // 边缘柔化
    float edge = smoothstep(1.0, 0.8, dist);

    // 透明度
    float alpha = edge * ring * uOpacity * fade * uRippleIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 记忆碎片镜面着色器 - 顶点着色器
 */
const memoryShardVertexShader = `
  precision highp float;

  uniform float uTime;

  attribute float aSize;
  attribute float aSpeed;
  attribute float aDelay;
  attribute vec3 aAxis;
  attribute float aShardType;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vShardType;
  varying float vReflectivity;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vShardType = aShardType;

    // 碎片悬浮旋转
    float floatTime = max(0.0, uTime - aDelay);
    vec3 pos = position;

    // 螺旋上升
    float angle = floatTime * aSpeed * 0.5;
    pos = mat3(
      cos(angle), 0.0, -sin(angle),
      0.0, 1.0, 0.0,
      sin(angle), 0.0, cos(angle)
    ) * pos;

    // 上下浮动
    pos.y += sin(floatTime * 2.0 + aDelay * 10.0) * 2.0;

    // 绕轴旋转
    float rotationAngle = floatTime * aSpeed * aAxis.z;
    pos = mat3(
      1.0, 0.0, 0.0,
      0.0, cos(rotationAngle), -sin(rotationAngle),
      0.0, sin(rotationAngle), cos(rotationAngle)
    ) * pos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 反射强度随角度变化
    vec3 viewDir = normalize(-mvPosition.xyz);
    vReflectivity = abs(dot(viewDir, vNormal));
  }
`

/**
 * 记忆碎片镜面着色器 - 片元着色器
 */
const memoryShardFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vShardType;
  varying float vReflectivity;

  void main() {
    vec3 color = vec3(0.0);
    vec3 type1Color = vec3(0.0);
    vec3 type2Color = vec3(0.0);
    vec3 type3Color = vec3(0.0);
    float alpha1 = 0.6;
    float alpha2 = 0.7;
    float alpha3 = 0.8;
    float petalShape = 1.0;

    // 类型 0: 漫天星辰
    vec3 stars = vec3(0.0);
    for (float i = 0.0; i < 10.0; i += 1.0) {
      float x = sin(i * 123.45) * 0.5 + 0.5;
      float y = cos(i * 678.90) * 0.5 + 0.5;
      float d = length(vUv - vec2(x, y));
      stars += vec3(1.0, 0.95, 0.9) * smoothstep(0.1, 0.0, d) * (sin(uTime * 3.0 + i) * 0.5 + 0.5);
    }

    // 边缘七彩光斑
    float edge = 1.0 - length(vUv - 0.5) * 2.0;
    vec3 rainbow = vec3(
      sin(edge * 10.0 + uTime) * 0.5 + 0.5,
      sin(edge * 10.0 + uTime + 2.094) * 0.5 + 0.5,
      sin(edge * 10.0 + uTime + 4.189) * 0.5 + 0.5
    );
    type1Color = stars + rainbow * edge * 0.5 * smoothstep(0.5, 0.0, edge);

    // 类型 1: 幽深夜色
    vec2 moonPos = vec2(0.7, 0.7);
    float moon = smoothstep(0.15, 0.12, length(vUv - moonPos));
    vec3 moonColor = vec3(0.9, 0.95, 1.0);

    // 月光流淌效果
    float flow = sin(vUv.x * 20.0 - uTime * 2.0) * 0.5 + 0.5;
    vec3 liquid = moonColor * flow * 0.3;

    // 夜色渐变
    vec3 night = mix(vec3(0.05, 0.08, 0.15), vec3(0.15, 0.2, 0.3), vUv.y);

    type2Color = night + moon * moonColor * 0.8 + liquid;

    // 类型 2: 飘落花瓣
    petalShape = 1.0 - length(vUv - 0.5) * 2.0;
    petalShape = smoothstep(0.5, 0.3, petalShape);

    // 花瓣颜色
    vec3 petalColor1 = vec3(1.0, 0.7, 0.75);
    vec3 petalColor2 = vec3(1.0, 0.85, 0.9);
    vec3 petalColor = mix(petalColor1, petalColor2, vUv.x);

    // 花瓣旋转
    float angle = uTime * 0.5;
    vec2 rotatedUv = vUv - 0.5;
    rotatedUv = vec2(
      rotatedUv.x * cos(angle) - rotatedUv.y * sin(angle),
      rotatedUv.x * sin(angle) + rotatedUv.y * cos(angle)
    );
    rotatedUv += 0.5;

    // 多片花瓣
    vec3 petals = vec3(0.0);
    for (float i = 0.0; i < 5.0; i += 1.0) {
      vec2 petalPos = vec2(
        0.5 + sin(i * 1.2566 + angle) * 0.3,
        0.5 + cos(i * 1.2566 + angle) * 0.3
      );
      float d = length(vUv - petalPos);
      petals += petalColor * smoothstep(0.15, 0.05, d);
    }

    type3Color = petals;

    // 使用 smoothstep 替代 if-else if-else
    float mask1 = 1.0 - smoothstep(0.0, 0.33, vShardType);
    float mask2 = smoothstep(0.33, 0.33, vShardType) * (1.0 - smoothstep(0.33, 0.66, vShardType));
    float mask3 = smoothstep(0.66, 0.66, vShardType);

    color = type1Color * mask1 + type2Color * mask2 + type3Color * mask3;
    float alpha = (alpha1 * mask1 + alpha2 * mask2 + alpha3 * mask3 * petalShape) * vReflectivity;

    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`

/**
 * 规则之眼巨瞳着色器 - 顶点着色器
 */
const giantEyeVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uEyeOpen;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);

    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * 规则之眼巨瞳着色器 - 片元着色器
 */
const giantEyeFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uEyeOpen;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec2 center = vec2(0.5);

    // 金色光线编织效果
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float radius = length(vUv - center);

    // 光线编织
    float rays = sin(angle * 24.0 + uTime * 0.5) * 0.5 + 0.5;
    float weave = sin(radius * 50.0 + rays * 3.14159) * 0.5 + 0.5;

    // 金色
    vec3 gold = vec3(1.0, 0.85, 0.3);
    vec3 brightGold = vec3(1.0, 0.95, 0.6);

    vec3 eyeColor = mix(gold, brightGold, weave * rays);

    // 瞳孔黑色漩涡
    float pupilRadius = 0.15 * uEyeOpen;
    float pupil = 1.0 - smoothstep(pupilRadius - 0.02, pupilRadius, radius);

    // 漩涡效果 - 移除if分支
    float vortexMask = smoothstep(0.5, 0.7, pupil);
    float vortex = sin(length(vUv - center) * 80.0 - uTime * 4.0 + angle * 3.0) * 0.5 + 0.5;
    vec3 blackVortex = mix(vec3(0.0), vec3(0.1, 0.05, 0.0), vortex);
    eyeColor = mix(eyeColor, blackVortex, pupil * vortexMask);

    // 虹膜金色光环
    float irisRing = smoothstep(pupilRadius, pupilRadius + 0.1, radius) *
                     smoothstep(pupilRadius + 0.2, pupilRadius + 0.1, radius);
    eyeColor += vec3(1.0, 0.9, 0.7) * irisRing * 0.5;

    // 眼睛睁开程度
    float blink = smoothstep(0.0, 1.0, uEyeOpen);

    // 菲涅尔效应
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
    eyeColor += vec3(1.0, 0.95, 0.8) * fresnel * 0.3;

    gl_FragColor = vec4(eyeColor, uOpacity * blink);
  }
`

/**
 * 锁链着色器 - 顶点着色器
 */
const chainVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uMeltProgress;
  uniform vec3 uEyePos;

  attribute float aChainIndex;
  attribute float aLinkIndex;

  varying vec2 vUv;
  varying float vLinkIndex;
  varying float vMelt;

  void main() {
    vUv = uv;
    vLinkIndex = aLinkIndex;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // 计算到眼睛的距离
    float distToEye = length(position - uEyePos);

    // 融化进度随距离变化
    vMelt = smoothstep(5.0, 20.0, distToEye) * uMeltProgress;

    // 融化效果：下垂和变形
    vec3 pos = position;
    pos.y -= vMelt * 3.0;

    // 随机扰动
    pos.x += sin(uTime * 5.0 + aChainIndex) * vMelt * 0.5;
    pos.z += cos(uTime * 5.0 + aLinkIndex) * vMelt * 0.5;

    // 液体流动
    pos.y += sin(uTime * 3.0 + distToEye) * vMelt * 0.3;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/**
 * 锁链着色器 - 片元着色器
 */
const chainFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uMeltProgress;

  varying vec2 vUv;
  varying float vLinkIndex;
  varying float vMelt;

  void main() {
    // 金色锁链到粉色液体的渐变
    vec3 gold = vec3(1.0, 0.85, 0.3);
    vec3 orange = vec3(1.0, 0.7, 0.3);
    vec3 pink = vec3(1.0, 0.7, 0.8);

    vec3 color = gold;

    // 使用 mix 替代 if-else if-else
    float t1 = smoothstep(0.0, 0.3, vMelt);
    float t2 = smoothstep(0.3, 0.6, vMelt);
    float t3 = smoothstep(0.6, 1.0, vMelt);
    
    color = mix(gold, orange, t1 * min(1.0, (vMelt - 0.3) / max(0.001, 0.3)));
    color = mix(color, pink, t2 * min(1.0, (vMelt - 0.6) / max(0.001, 0.4)));
    color = mix(color, pink, t3);

    // 锁链纹理
    float linkPattern = sin(vUv.y * 20.0) * 0.5 + 0.5;
    color *= (0.8 + linkPattern * 0.2);

    // 符文流动效果
    float rune = sin(vUv.x * 50.0 + uTime * 10.0 + vLinkIndex) * 0.5 + 0.5;
    color += vec3(0.3, 0.2, 0.1) * rune * (1.0 - vMelt);

    // 液体光泽 - 移除if分支
    float liquidShine = sin(vUv.y * 30.0 + uTime * 5.0) * 0.5 + 0.5;
    float shineMask = smoothstep(0.3, 0.5, vMelt);
    color += vec3(1.0, 0.9, 0.95) * liquidShine * shineMask * vMelt * 0.3;

    // 边缘高光
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    float safeEdge = max(0.0, edge);
    color += vec3(1.0, 0.95, 0.8) * pow(safeEdge, 2.0) * 0.3;

    gl_FragColor = vec4(color, uOpacity);
  }
`

/**
 * 世界情感染色着色器 - 后处理
 */
const worldEmotionVertexShader = `
  precision highp float;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const worldEmotionFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uEmotionProgress;
  uniform sampler2D uTexture;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // 情感染色：整体偏暖
    vec3 warmTint = vec3(1.0, 0.9, 0.85);

    // 从原图到染色的渐变
    vec3 originalColor = texture2D(uTexture, uv).rgb;
    vec3 emotionColor = originalColor * warmTint;

    vec3 color = mix(originalColor, emotionColor, uEmotionProgress);

    // 光边镶饰
    float edgeX = min(uv.x, 1.0 - uv.x);
    float edgeY = min(uv.y, 1.0 - uv.y);
    float edge = min(edgeX, edgeY);

    // 粉色光边
    vec3 pinkGlow = vec3(1.0, 0.7, 0.85);
    float glow = smoothstep(0.15, 0.0, edge) * uEmotionProgress;
    color += pinkGlow * glow * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`

/**
 * 创建粉色涟漪光晕
 */
function createPinkRipples() {
  const geometries = []
  const count = 10

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.RingGeometry(3, 50, 128, 1)

    // 添加 aRippleIndex 属性
    const posCount = geometry.attributes.position.count
    const rippleIndices = new Float32Array(posCount)
    for (let j = 0; j < posCount; j++) {
      rippleIndices[j] = i
    }
    geometry.setAttribute('aRippleIndex', new THREE.BufferAttribute(rippleIndices, 1))

    geometries.push(geometry)
  }

  return geometries
}

/**
 * 创建记忆碎片镜面
 */
function createMemoryShards() {
  const geometry = new THREE.BufferGeometry()

  const count = 2000
  const positions = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const uvs = new Float32Array(count * 2)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const delays = new Float32Array(count)
  const axes = new Float32Array(count * 3)
  const shardTypes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // 球形分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 10 + Math.random() * 20

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 10
    positions[i3 + 2] = radius * Math.cos(phi)

    // 法线（指向球心）
    normals[i3] = -positions[i3] / radius
    normals[i3 + 1] = -positions[i3 + 1] / radius
    normals[i3 + 2] = -positions[i3 + 2] / radius

    // UV
    uvs[i * 2] = (theta / (Math.PI * 2) + 0.5) % 1.0
    uvs[i * 2 + 1] = phi / Math.PI

    sizes[i] = 0.5 + Math.random() * 1.5
    speeds[i] = 0.3 + Math.random() * 0.7
    delays[i] = Math.random() * 8

    // 旋转轴
    axes[i3] = Math.random() * 2 - 1
    axes[i3 + 1] = Math.random() * 2 - 1
    axes[i3 + 2] = Math.random() * 2 - 1

    // 碎片类型：0=星辰, 1=夜色, 2=花瓣
    shardTypes[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1))
  geometry.setAttribute('aAxis', new THREE.BufferAttribute(axes, 3))
  geometry.setAttribute('aShardType', new THREE.BufferAttribute(shardTypes, 1))

  return geometry
}

/**
 * 创建规则之眼巨瞳
 */
function createGiantEye() {
  const geometry = new THREE.SphereGeometry(8, 128, 128)

  // 修改顶点以创建扁平的眼睛形状
  const positions = geometry.attributes.position.array
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] *= 0.3  // 压扁Z轴
  }

  geometry.computeVertexNormals()

  return geometry
}

/**
 * 创建锁链
 */
function createChains(chainCount = 12, linkCount = 30) {
  const geometry = new THREE.BufferGeometry()

  const totalLinks = chainCount * linkCount
  const positions = new Float32Array(totalLinks * 3)
  const normals = new Float32Array(totalLinks * 3)
  const uvs = new Float32Array(totalLinks * 2)
  const chainIndices = new Float32Array(totalLinks)
  const linkIndices = new Float32Array(totalLinks)

  for (let c = 0; c < chainCount; c++) {
    const angle = (c / chainCount) * Math.PI * 2
    const radius = 5

    for (let l = 0; l < linkCount; l++) {
      const idx = (c * linkCount + l) * 3
      const idx2 = (c * linkCount + l) * 2

      const y = -l * 2 - 10

      positions[idx] = Math.cos(angle) * radius
      positions[idx + 1] = y
      positions[idx + 2] = Math.sin(angle) * radius

      normals[idx] = Math.cos(angle)
      normals[idx + 1] = 0
      normals[idx + 2] = Math.sin(angle)

      uvs[idx2] = (l / linkCount)
      uvs[idx2 + 1] = (c / chainCount)

      chainIndices[c * linkCount + l] = c
      linkIndices[c * linkCount + l] = l
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setAttribute('aChainIndex', new THREE.BufferAttribute(chainIndices, 1))
  geometry.setAttribute('aLinkIndex', new THREE.BufferAttribute(linkIndices, 1))

  return geometry
}

/**
 * 主特效函数
 */
export default function animateHuafan(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  let cleaned = false
  const originalBackground = scene.background?.clone()

  try {
    // ==================== 环境设置 ====================
    scene.background = new THREE.Color(0x0a0812)  // 深紫红色背景

    setupInitialCamera(camera, new THREE.Vector3(0, 5, 60), 60, controls)
    camera.lookAt(0, 5, 0)

    // ==================== 创建主组 ====================
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 1. 粉色涟漪光晕 ====================
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
      ripple.position.y = 0
      ripple.scale.setScalar(1 + i * 0.2)
      mainGroup.add(ripple)
      ripples.push(ripple)
    })

    // ==================== 2. 记忆碎片镜面 ====================
    const shardGeometry = createMemoryShards()
    const shardMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: memoryShardVertexShader,
      fragmentShader: memoryShardFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const shards = new THREE.Points(shardGeometry, shardMaterial)
    mainGroup.add(shards)

    // ==================== 3. 规则之眼巨瞳 ====================
    const eyeGeometry = createGiantEye()
    const eyeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uEyeOpen: { value: 0 }
      },
      vertexShader: giantEyeVertexShader,
      fragmentShader: giantEyeFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const giantEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    giantEye.position.set(0, 30, -20)
    giantEye.rotation.x = -0.3
    mainGroup.add(giantEye)

    // ==================== 4. 锁链 ====================
    const chainGeometry = createChains()
    const chainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uMeltProgress: { value: 0 },
        uEyePos: { value: new THREE.Vector3(0, 30, -20) }
      },
      vertexShader: chainVertexShader,
      fragmentShader: chainFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const chains = new THREE.Points(chainGeometry, chainMaterial)
    mainGroup.add(chains)

    // ==================== 动画时间线 ====================
    const tl = createTimeline(
      () => {
        onComplete?.({ type: 'huafan', duration: 32000 })
      },
      onError,
      '化凡意境',
      controls
    )

    tl.play()

    // ==================== 阶段1: 涟漪初现 (0-6秒) ====================
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 1, duration: 4 }, i * 0.4)
    })

    // 涟漪扩散
    ripples.forEach((ripple, i) => {
      gsap.to(ripple.scale, {
        x: 3 + i * 0.5, y: 3 + i * 0.5, z: 3 + i * 0.5,
        duration: 6,
        ease: 'power2.out'
      }, 0)
    })

    // ==================== 阶段2: 记忆碎片浮现 (5-11秒) ====================
    tl.to(shardMaterial.uniforms.uOpacity, { value: 1, duration: 4 }, 5)

    // 碎片爆炸扩散
    gsap.to(shards.scale, {
      x: 1.5, y: 1.5, z: 1.5,
      duration: 4,
      ease: 'power2.out'
    }, 5)

    // ==================== 阶段3: 巨眼睁开 (10-16秒) ====================
    tl.to(eyeMaterial.uniforms.uOpacity, { value: 1, duration: 3 }, 10)
    tl.to(eyeMaterial.uniforms.uEyeOpen, { value: 1, duration: 5 }, 10)

    // ==================== 阶段4: 锁链垂下 (14-20秒) ====================
    tl.to(chainMaterial.uniforms.uOpacity, { value: 1, duration: 4 }, 14)

    // 锁链向下延伸
    gsap.to(chains.position, {
      y: -20,
      duration: 5,
      ease: 'power2.out'
    }, 14)

    // ==================== 阶段5: 锁链融化 (18-26秒) ====================
    tl.to(chainMaterial.uniforms.uMeltProgress, { value: 1, duration: 6 }, 18)

    // ==================== 阶段6: 世界情感染色 (24-32秒) ====================
    tl.to(eyeMaterial.uniforms.uEyeOpen, { value: 0.8, duration: 3 }, 24)

    // 涟漪增强
    ripples.forEach(ripple => {
      tl.to(ripple.material.uniforms.uRippleIntensity, { value: 1.5, duration: 4 }, 24)
    })

    // 清理动画
    tl.to(eyeMaterial.uniforms.uOpacity, { value: 0, duration: 4 }, 28)
    tl.to(chainMaterial.uniforms.uOpacity, { value: 0, duration: 4 }, 28)
    tl.to(shardMaterial.uniforms.uOpacity, { value: 0, duration: 4 }, 28)
    ripples.forEach((ripple, i) => {
      tl.to(ripple.material.uniforms.uOpacity, { value: 0, duration: 4 }, 28 + i * 0.2)
    })

    // ==================== 运镜系统 ====================
    // 阶段1-2: 远景俯视 (0-11秒)
    tl.to(camera.position, {
      x: 0,
      y: 15,
      z: 50,
      duration: 11,
      ease: 'power1.inOut'
    }, 0)

    // 阶段3-4: 中景仰视 (11-20秒)
    tl.to(camera.position, {
      x: 0,
      y: 10,
      z: 35,
      duration: 9,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 10, 0)
    }, 11)

    // 阶段5-6: 近景特写 (20-32秒)
    tl.to(camera.position, {
      x: 0,
      y: 8,
      z: 25,
      duration: 12,
      ease: 'power2.out',
      onUpdate: () => camera.lookAt(0, 5, 0)
    }, 20)

    // ==================== 动画循环 ====================
    let animationFrame = null
    let startTime = performance.now()

    function animate() {
      if (cleaned) return

      animationFrame = requestAnimationFrame(animate)

      const elapsed = (performance.now() - startTime) / 1000

      // 更新所有 shader 的 uTime
      ripples.forEach(ripple => {
        ripple.material.uniforms.uTime.value = elapsed
      })
      shardMaterial.uniforms.uTime.value = elapsed
      eyeMaterial.uniforms.uTime.value = elapsed
      chainMaterial.uniforms.uTime.value = elapsed

      // 涟漪旋转
      ripples.forEach((ripple, i) => {
        ripple.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1)
      })

      // 记忆碎片缓慢旋转
      shards.rotation.y += 0.003
      shards.rotation.x = Math.sin(elapsed * 0.5) * 0.1

      // 巨眼缓慢摆动
      giantEye.rotation.y = Math.sin(elapsed * 0.3) * 0.1

      // 锁链摆动
      chains.rotation.y += 0.002
    }

    animate()

    // ==================== 清理 ====================
    tl.call(() => {
      if (cleaned) return
      cleaned = true

      cancelAnimationFrame(animationFrame)

      scene.remove(mainGroup)

      rippleGeometries.forEach(geometry => geometry.dispose())
      ripples.forEach(ripple => {
        ripple.geometry.dispose()
        ripple.material.dispose()
      })
      shardGeometry.dispose()
      shardMaterial.dispose()
      eyeGeometry.dispose()
      eyeMaterial.dispose()
      chainGeometry.dispose()
      chainMaterial.dispose()

      if (originalBackground) {
        scene.background = originalBackground
      }

      gsap.killTweensOf(chains.position)
      gsap.killTweensOf(chains.rotation)
      gsap.killTweensOf(shards.scale)
      gsap.killTweensOf(shards.rotation)
      ripples.forEach(ripple => {
        gsap.killTweensOf(ripple.scale)
        gsap.killTweensOf(ripple.rotation)
      })
      gsap.killTweensOf(giantEye.rotation)
      gsap.killTweensOf(camera)
      gsap.killTweensOf(camera.position)
    }, null, 32)

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
export const Huafan = {
  name: 'huafan',
  displayName: '🌸 化凡意境',
  description: '粉色涟漪，记忆碎片，规则之眼，锁链融化，情感染色',
  category: '诗意',
  version: '1.0.0',
  tags: ['memory', 'ripple', 'eye', 'chain', 'emotion']
}
