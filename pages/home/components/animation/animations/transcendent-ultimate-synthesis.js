/**
 * ✨ 超越级终极融合 (Transcendent Ultimate Synthesis)
 * 超越级视觉特效 - 电影级VFX巅峰之作
 *
 * 技术特点:
 * - SDF距离场 + 元球融合 (来自transcendent-meta-orb)
 * - Danilo万花筒分形算法 (来自transcendent-kaleidosphere)
 * - FBM体积云渲染 (来自transcendent-volumetric-cloud)
 * - 胶囊体建筑结构 (来自transcendent-sdf-architecture)
 * - YIQ色相空间变换 (来自transcendent-fractal-hue-scape)
 * - 多技术深度融合
 *
 * 视觉表现:
 * 万花筒元球体积云
 * 建筑胶囊体结构
 * 动态色相循环变换
 - 分形迭代深度
 * 体积光线散射
 * 多层次混合融合
 *
 * @author Professional VFX Designer
 * Credits: Synthesis of multiple advanced shader techniques
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建终极融合核心 - 融合所有5大技术
 */
function createUltimateSynthesisCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 128, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uMetaIntensity: { value: 0 },        // 元球强度
      uKaleidoIntensity: { value: 0 },    // 万花筒强度
      uCloudDensity: { value: 0 },         // 体积云密度
      uSDFComplexity: { value: 0 },       // SDF复杂度
      uHueShift: { value: 0 }            // 色相偏移
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uMetaIntensity;
      uniform float uKaleidoIntensity;
      uniform float uCloudDensity;
      uniform float uSDFComplexity;
      uniform float uHueShift;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vMetaValue;
      varying float vKaleidoValue;
      varying float vCloudValue;
      varying float vSDFValue;

      // ========== 来自transcendent-meta-orb: Simplex Noise ===========
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
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
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // ========== 来自transcendent-kaleidosphere: 万花筒算法 ===========
      void pR(inout vec2 p, float a) {
        p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
      }

      // ========== 来自transcendent-volumetric-cloud: FBM噪声 ===========
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }

      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        float res = mix(
          mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
              mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
          mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
              mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
        );
        return res;
      }

      mat3 m = mat3(
        0.00,  0.80,  0.60,
        -0.80,  0.36, -0.48,
        -0.60, -0.48,  0.64
      );

      float fbm(vec3 p) {
        float f = 0.0;
        f  = 0.5000 * noise(p); p = m * p * 2.02;
        f += 0.2500 * noise(p); p = m * p * 2.03;
        f += 0.1250 * noise(p);
        return f;
      }

      // ========== 来自transcendent-sdf-architecture: 胶囊体SDF ===========
      float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
        vec3 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h) - r;
      }

      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }

      // ========== 来自transcendent-fractal-hue-scape: 6次方长度 ===========
      float length6(vec3 p) {
        p = p * p * p;
        p = p * p;
        return pow(p.x + p.y + p.z, 1.0 / 6.0);
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPosition);

        vec3 pos = position;

        // ========== 元球变形 (transcendent-meta-orb) ==========
        float metaNoise = snoise(vec3(pos.x * 0.4, pos.y * 0.4, pos.z * 0.4 + uTime * 0.3));
        vMetaValue = metaNoise;
        pos += normal * metaNoise * uMetaIntensity * 6.0;

        // ========== 万花筒折叠 (transcendent-kaleidosphere) ==========
        float angle = atan(pos.z, pos.x);
        float symmetry = 6.0 + uSDFComplexity * 12.0;
        float foldedAngle = mod(angle + uTime * 0.3, TWO_PI / symmetry) - (TWO_PI / symmetry) * 0.5;
        vec3 foldedPos;
        foldedPos.x = cos(foldedAngle) * length(pos.xz);
        foldedPos.z = sin(foldedAngle) * length(pos.xz);
        foldedPos.y = pos.y;
        pos = mix(pos, foldedPos, uKaleidoIntensity * 0.4);
        vKaleidoValue = length(pos - foldedPos);

        // ========== 体积云变形 (transcendent-volumetric-cloud) ==========
        vec3 windOffset = vec3(uTime * 0.5, 0.0, uTime * 0.3);
        float cloudNoise = fbm(pos * 0.25 + windOffset);
        vCloudValue = cloudNoise;
        pos += normal * cloudNoise * uCloudDensity * 4.0;

        // ========== SDF胶囊体结构 (transcendent-sdf-architecture) ==========
        vec3 sdfPos = pos * 0.2;
        float sdfDist = sdCapsule(sdfPos, vec3(-0.5, 0, 0), vec3(0.5, 0, 0), 0.3);
        vSDFValue = smoothstep(0.0, 1.0, sdfDist);
        pos += normal * vSDFValue * uSDFComplexity * 2.0;

        // ========== 分形迭代 (transcendent-fractal-hue-scape) ==========
        float l6 = length6(pos * 0.15);
        pos += normal * l6 * uSDFComplexity * 1.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uMetaIntensity;
      uniform float uKaleidoIntensity;
      uniform float uCloudDensity;
      uniform float uSDFComplexity;
      uniform float uHueShift;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      varying float vMetaValue;
      varying float vKaleidoValue;
      varying float vCloudValue;
      varying float vSDFValue;

      // ========== YIQ色相变换 (transcendent-fractal-hue-scape) ===========
      vec3 hue(vec3 color, float shift) {
        const vec3 kRGBToYPrime = vec3(0.299, 0.587, 0.114);
        const vec3 kRGBToI = vec3(0.596, -0.275, -0.321);
        const vec3 kRGBToQ = vec3(0.212, -0.523, 0.311);
        const vec3 kYIQToR = vec3(1.0, 0.956, 0.621);
        const vec3 kYIQToG = vec3(1.0, -0.272, -0.647);
        const vec3 kYIQToB = vec3(1.0, -1.107, 1.704);

        float YPrime = dot(color, kRGBToYPrime);
        float I = dot(color, kRGBToI);
        float Q = dot(color, kRGBToQ);

        float hue = atan(Q, I);
        float chroma = sqrt(I * I + Q * Q);
        hue += shift;

        Q = chroma * sin(hue);
        I = chroma * cos(hue);

        vec3 yIQ = vec3(YPrime, I, Q);
        color.r = dot(yIQ, kYIQToR);
        color.g = dot(yIQ, kYIQToG);
        color.b = dot(yIQ, kYIQToB);

        return color;
      }

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        vec3 baseColor = uColor;

        // ========== 元球效果 ==========
        vec3 metaColor = baseColor * (0.5 + 0.5 * vMetaValue);

        // ========== 万花筒效果 ==========
        vec3 kaleidoColor = hue(baseColor, vKaleidoValue * 6.28318);

        // ========== 体积云效果 ==========
        vec3 cloudColorLight = vec3(1.0, 0.95, 0.9);
        vec3 cloudColorShadow = vec3(0.6, 0.7, 0.9);
        float cloudLight = 0.5 + 0.5 * vCloudValue;
        vec3 cloudColor = mix(cloudColorShadow, cloudColorLight, cloudLight);

        // ========== SDF建筑效果 ==========
        vec3 sdfEdgeColor = vec3(1.0, 1.0, 0.8);
        vec3 sdfColor = mix(baseColor, sdfEdgeColor, vSDFValue * 0.5);

        // ========== 色相变换 ==========
        vec3 hueShiftedColor = hue(baseColor, uHueShift * 6.28318);

        // ========== 融合所有效果 ==========
        vec3 color = metaColor * 0.25 + kaleidoColor * 0.2 + 
                     cloudColor * 0.25 + sdfColor * 0.2 + hueShiftedColor * 0.1;

        // 光谱混合
        vec3 spectrum;
        spectrum.r = sin(uTime * 2.0) * 0.5 + 0.5;
        spectrum.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        spectrum.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;
        color = mix(color, spectrum, uMetaIntensity * 0.3);

        // Fresnel发光
        color += baseColor * fresnel * 0.3;

        // 深度雾化
        float depth = length(vPosition);
        float fog = exp(-depth * 0.02);

        // Alpha融合
        float alpha = (fresnel * 0.25 + 
                     abs(vMetaValue) * 0.2 + 
                     vCloudValue * 0.2 + 
                     vSDFValue * 0.2 + 
                     0.15) * uOpacity * fog;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建终极融合环
 */
function createUltimateSynthesisRing(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uRingPhase: { value: 0 },
      uBlendIntensity: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uRingPhase;
      uniform float uBlendIntensity;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      // FBM噪声 (体积云技术)
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }

      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        float res = mix(
          mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
              mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
          mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
              mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
        );
        return res;
      }

      mat3 m = mat3(
        0.00,  0.80,  0.60,
        -0.80,  0.36, -0.48,
        -0.60, -0.48,  0.64
      );

      float fbm(vec3 p) {
        float f = 0.0;
        f  = 0.5000 * noise(p); p = m * p * 2.02;
        f += 0.2500 * noise(p);
        return f;
      }

      void main() {
        vUv = uv;
        vPosition = position;
        vRadius = length(position.xz);

        vec3 pos = position;

        // 万花筒折叠
        float angle = atan(pos.z, pos.x);
        float symmetry = 8.0;
        float foldedAngle = mod(angle + uTime * 0.5, TWO_PI / symmetry) - (TWO_PI / symmetry) * 0.5;
        
        // FBM云变形
        vec3 noisePos = vec3(pos.x * 0.15, pos.y * 0.15, uTime * 0.3 + uRingPhase);
        float cloudNoise = fbm(noisePos);

        // 环形波
        float ringWave = sin(vRadius * 1.5 - uTime * 4.0 + uRingPhase * 2.0) * 0.5 + 0.5;
        
        // 胶囊体波
        float capsuleWave = sin(foldedAngle * 6.0 + uTime * 3.0) * 0.5 + 0.5;

        pos.y += (ringWave * 0.5 + cloudNoise * 0.3 + capsuleWave * 0.2) * uBlendIntensity * 4.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uRingPhase;
      uniform float uBlendIntensity;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      // YIQ色相变换
      vec3 hue(vec3 color, float shift) {
        const vec3 kRGBToYPrime = vec3(0.299, 0.587, 0.114);
        const vec3 kRGBToI = vec3(0.596, -0.275, -0.321);
        const vec3 kRGBToQ = vec3(0.212, -0.523, 0.311);
        const vec3 kYIQToR = vec3(1.0, 0.956, 0.621);
        const vec3 kYIQToG = vec3(1.0, -0.272, -0.647);
        const vec3 kYIQToB = vec3(1.0, -1.107, 1.704);

        float YPrime = dot(color, kRGBToYPrime);
        float I = dot(color, kRGBToI);
        float Q = dot(color, kRGBToQ);

        float hue = atan(Q, I);
        float chroma = sqrt(I * I + Q * Q);
        hue += shift;

        Q = chroma * sin(hue);
        I = chroma * cos(hue);

        vec3 yIQ = vec3(YPrime, I, Q);
        color.r = dot(yIQ, kYIQToR);
        color.g = dot(yIQ, kYIQToG);
        color.b = dot(yIQ, kYIQToB);

        return color;
      }

      void main() {
        // 环形图案
        float ringPattern = sin(vRadius * 1.8 - uTime * 4.0 + uRingPhase * 3.0) * 0.5 + 0.5;

        // 角度图案
        float angle = atan(vPosition.z, vPosition.x);
        float anglePattern = sin(angle * 10.0 + uTime * 3.0 + uRingPhase) * 0.5 + 0.5;

        // 色相变换
        float hueShift = angle + uTime * 0.5 + uRingPhase;
        vec3 hueColor = hue(uColor, hueShift);

        // 边缘发光
        float edgeGlow = smoothstep(uInnerRadius, uOuterRadius, vRadius) *
                        (1.0 - smoothstep(uInnerRadius, uOuterRadius, vRadius));
        edgeGlow = pow(edgeGlow, 0.5);

        // 融合所有效果
        vec3 color = mix(uColor, hueColor, ringPattern * 0.6);
        color *= (ringPattern * 0.4 + anglePattern * 0.3 + edgeGlow * 0.3);
        color *= (0.6 + uBlendIntensity * 0.4);

        float alpha = (ringPattern * 0.4 + anglePattern * 0.3 + edgeGlow * 0.3) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  return mesh
}

/**
 * 创建终极融合粒子
 */
function createUltimateSynthesisParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const techniqueIndices = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 全光谱颜色
    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1.0, 0.65)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.4 + Math.random() * 1.2
    phases[i] = Math.random() * Math.PI * 2
    techniqueIndices[i] = Math.floor(Math.random() * 5) // 5种技术
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('techniqueIndex', new THREE.BufferAttribute(techniqueIndices, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uBlendIntensity: { value: 0 },
      uRadius: { value: radius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uBlendIntensity;
      uniform float uRadius;

      attribute float size;
      attribute vec3 color;
      attribute float phase;
      attribute float techniqueIndex;

      varying vec3 vColor;
      varying float vPhase;
      varying float vTechniqueIndex;

      void main() {
        vColor = color;
        vPhase = phase;
        vTechniqueIndex = techniqueIndex;

        vec3 pos = position;

        // 根据技术索引应用不同运动
        float angle = atan(pos.z, pos.x);
        
        // 万花筒运动
        float symmetry = 8.0;
        float foldedAngle = mod(angle + uTime * 0.3, 6.28318 / symmetry) - (6.28318 / symmetry) * 0.5;
        
        vec3 foldedPos;
        foldedPos.x = cos(foldedAngle) * length(pos.xz);
        foldedPos.z = sin(foldedAngle) * length(pos.xz);
        foldedPos.y = pos.y;

        // 螺旋运动
        float spiralAngle = uTime * 0.35 + phase * 0.3;
        float cosAngle = cos(spiralAngle);
        float sinAngle = sin(spiralAngle);

        vec3 spiralPos;
        spiralPos.x = pos.x * cosAngle - pos.z * sinAngle;
        spiralPos.z = pos.x * sinAngle + pos.z * cosAngle;
        spiralPos.y = pos.y;

        // 垂直振荡
        float verticalOsc = sin(uTime * 2.5 + phase) * uBlendIntensity * 2.5;
        spiralPos.y += verticalOsc;

        // 混合运动
        pos = mix(pos, foldedPos, uBlendIntensity * 0.3);
        pos = mix(pos, spiralPos, uBlendIntensity * 0.5);

        // 脉冲
        float pulse = 1.0 + 0.35 * sin(uTime * 4.0 + phase * 5.0);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * pulse * (320.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uBlendIntensity;

      // YIQ色相变换
      vec3 hue(vec3 color, float shift) {
        const vec3 kRGBToYPrime = vec3(0.299, 0.587, 0.114);
        const vec3 kRGBToI = vec3(0.596, -0.275, -0.321);
        const vec3 kRGBToQ = vec3(0.212, -0.523, 0.311);
        const vec3 kYIQToR = vec3(1.0, 0.956, 0.621);
        const vec3 kYIQToG = vec3(1.0, -0.272, -0.647);
        const vec3 kYIQToB = vec3(1.0, -1.107, 1.704);

        float YPrime = dot(color, kRGBToYPrime);
        float I = dot(color, kRGBToI);
        float Q = dot(color, kRGBToQ);

        float hue = atan(Q, I);
        float chroma = sqrt(I * I + Q * Q);
        hue += shift;

        Q = chroma * sin(hue);
        I = chroma * cos(hue);

        vec3 yIQ = vec3(YPrime, I, Q);
        color.r = dot(yIQ, kYIQToR);
        color.g = dot(yIQ, kYIQToG);
        color.b = dot(yIQ, kYIQToB);

        return color;
      }

      varying vec3 vColor;
      varying float vPhase;
      varying float vTechniqueIndex;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 动态色相变换
        float hueShift = uTime * 3.0 + vPhase * 8.0 + vTechniqueIndex;
        vec3 hueColor = hue(vColor, hueShift * uBlendIntensity);

        // 多技术发光
        float techGlow = smoothstep(0.5, 0.0, dist);
        techGlow *= (1.0 + 0.5 * sin(uTime * 6.0 + vPhase * 10.0 + vTechniqueIndex) * uBlendIntensity);

        float alpha = techGlow * uOpacity;
        vec3 color = hueColor * (1.0 + techGlow * 0.35);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateTranscendentUltimateSynthesis(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 108), 88, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-ultimate-synthesis' })
      },
      onError,
      '✨ 超越级终极融合（5大技术合成）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x0a0816)
    scene.fog = new THREE.FogExp2(0x0a0816, 0.001)

    // 创建终极融合核心
    const ultimateCore = createUltimateSynthesisCore(26, 0x6b5b95)
    scene.add(ultimateCore)

    // 创建终极融合环
    const synthesisRings = []
    for (let i = 0; i < 5; i++) {
      const innerRadius = 34 + i * 12
      const outerRadius = 38 + i * 12
      const hue = (i * 0.2) % 1.0
      const color = new THREE.Color().setHSL(hue, 0.95, 0.65).getHex()
      const ring = createUltimateSynthesisRing(innerRadius, outerRadius, 128, color)
      ring.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.08 : -0.08)
      ring.rotation.z = i * 0.18
      scene.add(ring)
      synthesisRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.005, phase: i * 0.6 })
    }

    // 创建终极融合粒子
    const synthesisParticles = createUltimateSynthesisParticles(12000, 100)
    scene.add(synthesisParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新终极融合核心
      ultimateCore.material.uniforms.uTime.value = time
      ultimateCore.material.uniforms.uMetaIntensity.value = 0.55 + 0.45 * Math.sin(time * 0.45)
      ultimateCore.material.uniforms.uKaleidoIntensity.value = 0.6 + 0.4 * Math.sin(time * 0.5)
      ultimateCore.material.uniforms.uCloudDensity.value = 0.5 + 0.5 * Math.sin(time * 0.4)
      ultimateCore.material.uniforms.uSDFComplexity.value = 0.55 + 0.45 * Math.sin(time * 0.35)
      ultimateCore.material.uniforms.uHueShift.value = time * 0.08
      ultimateCore.rotation.y += 0.004
      ultimateCore.rotation.x = Math.sin(time * 0.28) * 0.04

      // 更新终极融合环
      synthesisRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = -Math.PI / 2 + Math.sin(time * 0.4 + ring.phase) * 0.12
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uRingPhase.value = time + ring.phase
        ring.mesh.material.uniforms.uBlendIntensity.value = 0.5 + 0.5 * Math.sin(time * 0.5 + ring.phase)
        const pulse = 1 + 0.06 * Math.sin(time * 1.6 + ring.phase)
        ring.mesh.scale.setScalar(pulse)
      })

      // 更新终极融合粒子
      synthesisParticles.material.uniforms.uTime.value = time
      synthesisParticles.material.uniforms.uBlendIntensity.value = 0.55 + 0.45 * Math.sin(time * 0.45)
      synthesisParticles.rotation.y += 0.0025
      synthesisParticles.rotation.x = Math.sin(time * 0.22) * 0.045
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(ultimateCore.material.uniforms.uOpacity, {
      value: 0.85,
      duration: 2.8,
      ease: 'power2.out'
    })

    gsap.to(ultimateCore.material.uniforms.uMetaIntensity, {
      value: 0.9,
      duration: 3.2,
      ease: 'power2.out'
    })

    gsap.to(ultimateCore.material.uniforms.uKaleidoIntensity, {
      value: 0.85,
      duration: 3.2,
      ease: 'power2.out'
    })

    gsap.to(ultimateCore.material.uniforms.uCloudDensity, {
      value: 0.88,
      duration: 3.2,
      ease: 'power2.out'
    })

    gsap.to(ultimateCore.material.uniforms.uSDFComplexity, {
      value: 0.92,
      duration: 3.2,
      ease: 'power2.out'
    })

    synthesisRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.78,
        duration: 2.3,
        ease: 'power2.out',
        delay: i * 0.25
      })
    })

    gsap.to(synthesisParticles.material.uniforms.uOpacity, {
      value: 0.88,
      duration: 3.2,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(synthesisParticles.material.uniforms.uBlendIntensity, {
      value: 0.82,
      duration: 2.8,
      ease: 'power2.out',
      delay: 0.5
    })

    // 相机运动
    tl.to(camera.position, {
      x: 52,
      y: 18,
      z: 72,
      duration: 6.5,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -52,
      y: -7,
      z: 86,
      duration: 6.5,
      ease: 'power2.inOut'
    }, 6.5)

    tl.to(camera.position, {
      x: 0,
      y: 7,
      z: 96,
      duration: 4.5,
      ease: 'power2.inOut'
    }, 13)

    animate()

    tl.to({}, { duration: 19 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(ultimateCore.material.uniforms.uOpacity, { value: 0, duration: 1.6 })
        gsap.to(ultimateCore.material.uniforms.uMetaIntensity, { value: 0, duration: 1.6 })
        gsap.to(ultimateCore.material.uniforms.uKaleidoIntensity, { value: 0, duration: 1.6 })
        gsap.to(ultimateCore.material.uniforms.uCloudDensity, { value: 0, duration: 1.6 })
        gsap.to(ultimateCore.material.uniforms.uSDFComplexity, { value: 0, duration: 1.6 })

        synthesisRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1.3 })
          gsap.to(ring.mesh.material.uniforms.uBlendIntensity, { value: 0, duration: 1.3 })
        })

        gsap.to(synthesisParticles.material.uniforms.uOpacity, { value: 0, duration: 1.3 })
        gsap.to(synthesisParticles.material.uniforms.uBlendIntensity, { value: 0, duration: 1.3 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(ultimateCore)
        ultimateCore.geometry.dispose()
        ultimateCore.material.dispose()

        synthesisRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(synthesisParticles)
        synthesisParticles.geometry.dispose()
        synthesisParticles.material.dispose()

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 19)

    return tl

  } catch (error) {
    console.error('超越级终极融合动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
