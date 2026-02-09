/**
 * ⚛️ 超越级熵增奇点特效
 * 次世代视觉特效 - 奥斯卡级别VFX
 *
 * 创新突破：
 * ✨ 时间倒流可视化 - 熵减过程的视觉表现
 * ✨ 混沌分形生成 - 有序与无序的动态转换
 * ✨ 宏观-量子耦合 - 双尺度粒子系统
 * ✨ 信息密度场 - 数据流的可视化
 * ✨ 宇宙热寂终局 - 熵最大化的隐喻
 *
 * 视觉表现：
 * - 熵减过程：有序结构从混沌中自发形成
 * - 时间逆流：粒子轨迹呈现逆转效果
 * - 分形演化：复杂结构迭代生成
 * - 信息重构：数据流组装成有序形态
 * - 热寂前夜：最终平衡态的临界时刻
 *
 * 技术亮点：
 * - 双尺度粒子系统（宏观10000 + 量子50000）
 * - 实时分形迭代渲染
 * - 时间可逆着色器
 * - 信息熵场模拟
 * - 相变动态表现
 *
 * @author Master VFX Designer
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建熵球 - 有序与无序的动态表现
 */
function createEntropySphere(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 128, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uEntropy: { value: 0 },
      uOrderLevel: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uEntropy;
      uniform float uOrderLevel;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      // Simplex Noise
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

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;

        // 熵变导致的混沌 - 噪声幅度随熵值增加
        float chaosLevel = uEntropy * (1.0 - uOrderLevel);
        float noise = snoise(vec3(pos.x * 0.3, pos.y * 0.3, pos.z * 0.3 + uTime * 0.5));
        pos += normal * noise * chaosLevel * 15.0;

        // 有序结构 - 晶体化效果
        float orderStructure = uOrderLevel * sin(pos.x * 2.0) * sin(pos.y * 2.0) * sin(pos.z * 2.0);
        pos += normal * orderStructure * 2.0;

        // 时间倒流效果 - 波动逆行
        float timeReverse = sin(length(pos) * 0.5 - uTime * 3.0) * uEntropy * 3.0;
        pos += normal * timeReverse;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEntropy;
      uniform float uOrderLevel;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 熵变发光 - 混沌度影响亮度
        float entropyGlow = uEntropy * (sin(uTime * 5.0) * 0.5 + 0.5);

        // 有序发光 - 晶体结构发光
        float orderGlow = uOrderLevel * (sin(length(vPosition) * 3.0 - uTime * 2.0) * 0.5 + 0.5);

        // 信息密度 - 表面复杂度
        float informationDensity = sin(vPosition.x * 5.0 + uTime) *
                                   sin(vPosition.y * 5.0 + uTime * 1.2) *
                                   sin(vPosition.z * 5.0 + uTime * 1.5);
        informationDensity = informationDensity * 0.5 + 0.5;

        // 时间颜色偏移
        vec3 timeShiftColor;
        timeShiftColor.r = sin(uTime * 2.0) * 0.5 + 0.5;
        timeShiftColor.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        timeShiftColor.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;

        // 混沌色
        vec3 chaosColor = mix(uColor, timeShiftColor, uEntropy * 0.5);

        // 有序色
        vec3 orderColor = uColor * (1.0 + orderGlow * 0.5);

        vec3 finalColor = mix(chaosColor, orderColor, uOrderLevel);
        finalColor += entropyGlow * uColor * 0.5;
        finalColor += orderGlow * uColor * 0.3;
        finalColor += informationDensity * timeShiftColor * 0.2 * uEntropy;

        // 菲涅尔增强
        finalColor += fresnel * uColor * 0.3 * (0.5 + uEntropy);

        float alpha = (fresnel * 0.4 + entropyGlow * 0.3 + orderGlow * 0.2 + informationDensity * 0.1) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
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
 * 创建分形结构 - 迭代生成
 */
function createFractalStructure(iterations, scale) {
  const geometry = new THREE.IcosahedronGeometry(scale, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ffff) },
      uOpacity: { value: 0 },
      uIteration: { value: 0 },
      uMaxIterations: { value: iterations }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uIteration;
      uniform float uMaxIterations;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;

        // 分形迭代效果 - 几何体分裂
        float iterationFactor = uIteration / uMaxIterations;
        float subdivision = pow(2.0, floor(iterationFactor * 4.0));

        // 分形变形
        float fractalDeform = sin(pos.x * subdivision + uTime) *
                               sin(pos.y * subdivision + uTime * 1.1) *
                               sin(pos.z * subdivision + uTime * 1.2);
        pos += normal * fractalDeform * 2.0 * iterationFactor;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uIteration;
      uniform float uMaxIterations;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);

        float iterationFactor = uIteration / uMaxIterations;

        // 分形颜色 - 迭代深度影响颜色
        vec3 fractalColor = mix(uColor, vec3(0.0, 1.0, 1.0), iterationFactor * 0.5);

        // 分形纹理
        float subdivision = pow(2.0, floor(iterationFactor * 4.0));
        float fractalPattern = sin(vPosition.x * subdivision) *
                                sin(vPosition.y * subdivision) *
                                sin(vPosition.z * subdivision);
        fractalPattern = fractalPattern * 0.5 + 0.5;

        // 迭代发光
        float iterationGlow = sin(uTime * 4.0 + iterationFactor * 10.0) * 0.5 + 0.5;

        vec3 finalColor = fractalColor * (0.5 + fractalPattern * 0.3 + iterationGlow * 0.2);
        finalColor += fresnel * fractalColor * 0.3;

        float alpha = (fresnel * 0.5 + fractalPattern * 0.3 + iterationGlow * 0.2) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建宏观粒子 - 大尺度有序运动
 */
function createMacroParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)
  const entropies = new Float32Array(count)
  const timeReversalFactors = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.pow(Math.random(), 0.3)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = 0.5 + Math.random() * 0.2
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.8 + Math.random() * 1.5
    entropies[i] = Math.random()
    timeReversalFactors[i] = Math.random()

    velocities[i * 3] = (Math.random() - 0.5) * 0.5
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  geometry.setAttribute('entropy', new THREE.BufferAttribute(entropies, 1))
  geometry.setAttribute('timeReversalFactor', new THREE.BufferAttribute(timeReversalFactors, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uGlobalEntropy: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uGlobalEntropy;

      attribute float size;
      attribute vec3 color;
      attribute vec3 velocity;
      attribute float entropy;
      attribute float timeReversalFactor;

      varying vec3 vColor;
      varying float vEntropy;
      varying float vTimeReversalFactor;

      void main() {
        vColor = color;
        vEntropy = entropy;
        vTimeReversalFactor = timeReversalFactor;

        vec3 pos = position;

        // 时间倒流运动 - 粒子逆向移动
        float reverseSign = 1.0 - 2.0 * (uGlobalEntropy * timeReversalFactor);
        vec3 reverseVelocity = velocity * reverseSign;

        pos += reverseVelocity * uTime * 20.0;

        // 有序轨道
        float orbit = sin(uTime * 2.0 + entropy * 10.0) * 5.0;
        pos += normalize(pos) * orbit * (1.0 - uGlobalEntropy);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z) * (0.5 + 0.5 * sin(uTime * 3.0 + entropy * 20.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uGlobalEntropy;

      varying vec3 vColor;
      varying float vEntropy;
      varying float vTimeReversalFactor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 熵变发光
        float entropyGlow = sin(uTime * 6.0 + vEntropy * 50.0) * 0.5 + 0.5;
        entropyGlow *= vEntropy * uGlobalEntropy;

        // 时间倒流闪烁
        float reverseFlicker = sin(uTime * 15.0 + vTimeReversalFactor * 30.0) * 0.3 + 0.7;
        reverseFlicker *= uGlobalEntropy * vTimeReversalFactor;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * (1.0 + entropyGlow) * reverseFlicker;
        gl_FragColor = vec4(vColor * (1.0 + entropyGlow * 0.5), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 创建量子粒子 - 小尺度混沌运动
 */
function createQuantumParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const superpositionFactors = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.pow(Math.random(), 0.5)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1.0, 0.65)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.1 + Math.random() * 0.3
    phases[i] = Math.random() * Math.PI * 2
    superpositionFactors[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('superpositionFactor', new THREE.BufferAttribute(superpositionFactors, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uGlobalEntropy: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uGlobalEntropy;

      attribute float size;
      attribute vec3 color;
      attribute float phase;
      attribute float superpositionFactor;

      varying vec3 vColor;
      varying float vPhase;
      varying float vSuperpositionFactor;

      void main() {
        vColor = color;
        vPhase = phase;
        vSuperpositionFactor = superpositionFactor;

        vec3 pos = position;

        // 量子涨落 - 随机瞬时移动
        float quantumFluctuation = sin(uTime * 20.0 + phase * 30.0) *
                                    cos(uTime * 25.0 + phase * 40.0) *
                                    sin(uTime * 30.0 + phase * 50.0);
        pos += normalize(pos) * quantumFluctuation * 3.0 * uGlobalEntropy;

        // 叠加态 - 多位置同时存在
        float superposition = sin(uTime * 10.0 + phase * 20.0) * superpositionFactor;
        pos += vec3(superposition, superposition * 1.1, superposition * 1.2) * 2.0;

        // 量子隧穿 - 瞬间位移
        float tunneling = step(0.95, sin(uTime * 5.0 + phase * 10.0)) * superpositionFactor * 10.0;
        pos += normalize(pos) * tunneling * uGlobalEntropy;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * (0.3 + 0.7 * sin(uTime * 8.0 + phase * 15.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uGlobalEntropy;

      varying vec3 vColor;
      varying float vPhase;
      varying float vSuperpositionFactor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 量子闪烁
        float quantumFlicker = sin(uTime * 20.0 + vPhase * 50.0) * 0.5 + 0.5;

        // 叠加态发光
        float superpositionGlow = sin(uTime * 15.0 + vPhase * 30.0) * 0.5 + 0.5;
        superpositionGlow *= vSuperpositionFactor;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity *
                     (quantumFlicker * 0.6 + superpositionGlow * 0.4) *
                     (0.5 + 0.5 * uGlobalEntropy);
        gl_FragColor = vec4(vColor * (1.0 + superpositionGlow * 0.5), alpha);
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
export default function animateTranscendentEntropy(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 130), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-entropy' })
      },
      onError,
      '⚛️ 超越级熵增奇点（次世代VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x030310)
    scene.fog = new THREE.FogExp2(0x030310, 0.0012)

    // 熵球
    const entropySphere = createEntropySphere(25, 0x0088ff)
    scene.add(entropySphere)

    // 分形结构
    const fractalStructures = []
    const fractalIterations = 8

    for (let i = 0; i < fractalIterations; i++) {
      const scale = 30 + i * 5
      const hue = (i / fractalIterations) * 0.4 + 0.4
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6).getHex()
      const fractal = createFractalStructure(i + 1, scale)
      fractal.position.x = (Math.random() - 0.5) * 20
      fractal.position.y = (Math.random() - 0.5) * 20
      fractal.position.z = (Math.random() - 0.5) * 20
      scene.add(fractal)
      fractalStructures.push({
        mesh: fractal,
        basePosition: fractal.position.clone(),
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        }
      })
    }

    // 宏观粒子
    const macroParticles = createMacroParticles(10000, 80)
    scene.add(macroParticles)

    // 量子粒子
    const quantumParticles = createQuantumParticles(50000, 60)
    scene.add(quantumParticles)

    let time = 0
    let animId = null
    let globalEntropy = 0
    let orderLevel = 0

    function update() {
      time += 0.016

      // 熵的动态变化 - 混沌到有序再回到混沌
      globalEntropy = (Math.sin(time * 0.2) * 0.5 + 0.5)
      orderLevel = 1.0 - globalEntropy

      // 更新熵球
      entropySphere.material.uniforms.uTime.value = time
      entropySphere.material.uniforms.uEntropy.value = globalEntropy
      entropySphere.material.uniforms.uOrderLevel.value = orderLevel

      // 更新分形结构
      fractalStructures.forEach((fractal, i) => {
        fractal.mesh.rotation.x += fractal.rotSpeed.x
        fractal.mesh.rotation.y += fractal.rotSpeed.y
        fractal.mesh.rotation.z += fractal.rotSpeed.z
        fractal.mesh.material.uniforms.uTime.value = time
        fractal.mesh.material.uniforms.uIteration.value = (i + 1) * orderLevel

        const floatX = Math.sin(time * 0.3 + i) * 2
        const floatY = Math.cos(time * 0.3 + i * 1.1) * 2
        const floatZ = Math.sin(time * 0.3 + i * 1.2) * 2
        fractal.mesh.position.x = fractal.basePosition.x + floatX
        fractal.mesh.position.y = fractal.basePosition.y + floatY
        fractal.mesh.position.z = fractal.basePosition.z + floatZ
      })

      // 更新宏观粒子
      macroParticles.material.uniforms.uTime.value = time
      macroParticles.material.uniforms.uGlobalEntropy.value = globalEntropy
      macroParticles.rotation.y += 0.001

      // 更新量子粒子
      quantumParticles.material.uniforms.uTime.value = time
      quantumParticles.material.uniforms.uGlobalEntropy.value = globalEntropy
      quantumParticles.rotation.y -= 0.002
      quantumParticles.rotation.x = Math.sin(time * 0.4) * 0.1
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(entropySphere.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 3,
      ease: 'power2.out'
    })

    fractalStructures.forEach((fractal, i) => {
      gsap.to(fractal.mesh.material.uniforms.uOpacity, {
        value: 0.5,
        duration: 2,
        ease: 'power2.out',
        delay: 1 + i * 0.2
      })
    })

    gsap.to(macroParticles.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(quantumParticles.material.uniforms.uOpacity, {
      value: 0.5,
      duration: 2.5,
      ease: 'power2.out',
      delay: 1
    })

    // 相机运动
    tl.to(camera.position, {
      x: 65,
      y: 25,
      z: 85,
      duration: 7,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -55,
      y: -10,
      z: 95,
      duration: 7,
      ease: 'power2.inOut'
    }, 7)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 110,
      duration: 5,
      ease: 'power2.inOut'
    }, 14)

    animate()

    tl.to({}, { duration: 20 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(entropySphere.material.uniforms.uOpacity, { value: 0, duration: 1.5 })

        fractalStructures.forEach(fractal => {
          gsap.to(fractal.mesh.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        })

        gsap.to(macroParticles.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(quantumParticles.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(entropySphere)
        entropySphere.geometry.dispose()
        entropySphere.material.dispose()

        fractalStructures.forEach(fractal => {
          scene.remove(fractal.mesh)
          fractal.mesh.geometry.dispose()
          fractal.mesh.material.dispose()
        })

        scene.remove(macroParticles)
        macroParticles.geometry.dispose()
        macroParticles.material.dispose()

        scene.remove(quantumParticles)
        quantumParticles.geometry.dispose()
        quantumParticles.material.dispose()

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 20)

    return tl

  } catch (error) {
    console.error('超越级熵增奇点动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
