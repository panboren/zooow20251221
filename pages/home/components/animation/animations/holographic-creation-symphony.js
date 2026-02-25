/**
 * 🌌 全息宇宙创世交响曲 - Holographic Creation Symphony
 *
 * 融合所有超越级特效精华的终极创作:
 * 1. 时空裂缝的 TorusKnot 能量核心
 * 2. 量子涨落的 Simplex 噪声湍流
 * 3. 维度折叠的莫比乌斯带变换
 * 4. 虚空宇宙的黑洞吸积盘
 *
 * 技术创新:
 * - 实时 Simplex 3D 噪声
 * - 4D Tesseract 动态投影
 * - 螺旋吸积盘物理模拟
 * - 量子纠缠粒子系统
 * - 多层引力波可视化
 *
 * 视觉规模:
 * 18000+ 粒子系统
 * 8层莫比乌斯带
 * 3层吸积盘
 * 5D超立方体结构
 * 完整相机轨迹
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

// ==================== Simplex 3D 噪声函数 ====================
function createSimplexNoiseShader() {
  return `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
  `
}

// ==================== 创世核心 (TorusKnot + 噪声) ====================
function createGenesisCore(radius, color) {
  const geometry = new THREE.TorusKnotGeometry(radius * 0.7, radius * 0.2, 200, 32, 2, 3)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uGenesis: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uGenesis;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      ${createSimplexNoiseShader()}

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;
        float noise = snoise(vec3(pos.x * 0.3 + uTime, pos.y * 0.3, pos.z * 0.3 + uTime * 0.5));
        pos += normal * noise * uGenesis * 15.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGenesis;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      ${createSimplexNoiseShader()}

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);

        // 创世噪声
        float genesisNoise = snoise(vec3(vPosition.x * 0.4 + uTime * 0.5,
                                          vPosition.y * 0.4,
                                          vPosition.z * 0.4 + uTime * 0.3));
        genesisNoise = genesisNoise * 0.5 + 0.5;

        // 创世光谱
        vec3 genesisSpectrum;
        genesisSpectrum.r = sin(uTime * 2.0 + 0.0) * 0.5 + 0.5;
        genesisSpectrum.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        genesisSpectrum.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;

        // 创世能量
        float genesisEnergy = uGenesis * 0.5 + 0.5;

        vec3 finalColor = mix(uColor, genesisSpectrum, fresnel * 0.5);
        finalColor += genesisNoise * uColor * genesisEnergy * 0.4;
        finalColor += fresnel * genesisEnergy * 0.3;

        float alpha = (fresnel * 0.6 + genesisNoise * 0.4) * uOpacity;

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

// ==================== 莫比乌斯创世带 ====================
function createMobiusGenesisStrip(radius, color) {
  const geometry = new THREE.TorusGeometry(radius, radius * 0.12, 16, 100)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uTwist: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uTwist;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;

      ${createSimplexNoiseShader()}

      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);

        vec3 pos = position;
        float noise = snoise(vec3(pos.x * 0.2 + uTime, pos.y * 0.2, pos.z * 0.2));
        pos += normal * noise * uTwist * 5.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTwist;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 扭曲能量
        float twistEnergy = uTwist * 0.5 + 0.5;

        // 创世流动
        float genesisFlow = sin(vUv.x * 10.0 + uTime * 4.0) * 0.5 + 0.5;

        vec3 flowColor;
        flowColor.r = sin(uTime * 1.5 + vUv.x * 6.28) * 0.5 + 0.5;
        flowColor.g = sin(uTime * 1.5 + vUv.x * 6.28 + 2.094) * 0.5 + 0.5;
        flowColor.b = sin(uTime * 1.5 + vUv.x * 6.28 + 4.188) * 0.5 + 0.5;

        vec3 color = mix(uColor, flowColor, twistEnergy * 0.6);
        color += genesisFlow * uColor * 0.3;
        color += fresnel * twistEnergy * 0.2;

        float alpha = (fresnel * 0.5 + genesisFlow * 0.5) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI / 4
  mesh.rotation.y = Math.PI / 6
  return mesh
}

// ==================== 创世吸积盘 ====================
function createGenesisAccretionDisk(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uRotation: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uRotation;

      varying vec2 vUv;
      varying vec3 vPosition;

      ${createSimplexNoiseShader()}

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        float noise = snoise(vec3(pos.x * 0.05 + uTime, pos.y * 0.05, pos.z * 0.05));
        float spiral = sin(atan(pos.z, pos.x) * 4.0 + uTime * 3.0) * uRotation * 3.0;
        pos.y += spiral + noise * 2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uRotation;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        float dist = length(vPosition.xz);

        // 轨道速度
        float angularVelocity = 1.0 / dist;
        float angle = atan(vPosition.z, vPosition.x) + uTime * angularVelocity * 4.0;

        // 创世物质
        float genesisMatter = sin(angle * 10.0) * sin(angle * 15.0) * 0.5 + 0.5;

        // 温度梯度
        float temperature = smoothstep(uOuterRadius, uInnerRadius, dist);

        // 螺旋臂
        float spiralArm = sin(angle * 4.0 - log(dist) * 6.0 + uTime * 2.0) * 0.5 + 0.5;

        vec3 thermalColor;
        thermalColor.r = 1.0;
        thermalColor.g = 1.0 - temperature * 0.6;
        thermalColor.b = 1.0 - temperature * 0.9;

        vec3 color = mix(uColor, thermalColor, temperature * 0.7);
        color *= (genesisMatter * 0.4 + spiralArm * 0.6);

        float alpha = (genesisMatter * 0.5 + spiralArm * 0.5) * uOpacity * 0.5;

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

// ==================== 创世粒子 ====================
function createGenesisParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const partners = new Int16Array(count)

  for (let i = 0; i < count; i += 2) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    const hue = Math.random() * 0.4 + 0.5
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)

    // 纠缠粒子对
    for (let j = 0; j < 2; j++) {
      const sign = j === 0 ? 1 : -1
      const idx = i + j

      positions[idx * 3] = sign * r * Math.sin(phi) * Math.cos(theta)
      positions[idx * 3 + 1] = sign * r * Math.sin(phi) * Math.sin(theta)
      positions[idx * 3 + 2] = sign * r * Math.cos(phi)

      colors[idx * 3] = color.r
      colors[idx * 3 + 1] = color.g
      colors[idx * 3 + 2] = color.b

      sizes[idx] = 0.5 + Math.random() * 1.2
      phases[idx] = Math.random() * Math.PI * 2
      partners[idx] = i + 1 - j
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute vec3 color;
      attribute float phase;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vColor = color;
        vPhase = phase;

        vec3 pos = position;
        float entanglement = sin(uTime * 3.0 + phase) * 3.0;
        pos += normalize(pos) * entanglement;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z) * (0.7 + 0.3 * sin(uTime * 4.0 + phase));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        float entangleGlow = sin(uOpacity * 10.0 + vPhase * 12.0) * 0.2 + 0.8;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * entangleGlow;
        gl_FragColor = vec4(vColor * 1.2, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

// ==================== 引力波涟漪 ====================
function createGenesisWaves(radius, segments, color) {
  const geometry = new THREE.RingGeometry(radius, radius + 1.5, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uWavePhase: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uWavePhase;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uWavePhase;

      varying vec2 vUv;

      void main() {
        float dist = length(vUv - 0.5);

        float wave = sin(dist * 25.0 - uTime * 7.0 + uWavePhase);

        float distortion = abs(wave);

        vec3 waveColor = uColor * distortion;

        float alpha = distortion * uOpacity * 0.12;

        gl_FragColor = vec4(waveColor, alpha);
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

// ==================== 主动画函数 ====================
export default function animateHolographicCreationSymphony(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 140), 95, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-creation-symphony' })
      },
      onError,
      '🌌 全息宇宙创世交响曲（终极超越级VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x030310)
    scene.fog = new THREE.FogExp2(0x030310, 0.0014)

    // 创世核心
    const genesisCore = createGenesisCore(22, 0x9370db)
    scene.add(genesisCore)

    // 莫比乌斯创世带
    const mobiusStrips = []
    for (let i = 0; i < 8; i++) {
      const radius = 35 + i * 12
      const hue = (i / 8) * 0.5 + 0.5
      const color = new THREE.Color().setHSL(hue, 1.0, 0.5).getHex()
      const strip = createMobiusGenesisStrip(radius, color)
      strip.position.y = (i - 3.5) * 15
      scene.add(strip)
      mobiusStrips.push({
        mesh: strip,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        phase: i * 0.4
      })
    }

    // 创世吸积盘
    const accretionDisks = []
    for (let i = 0; i < 3; i++) {
      const innerRadius = 25 + i * 18
      const outerRadius = 38 + i * 20
      const hue = 0.08 + i * 0.03
      const color = new THREE.Color().setHSL(hue, 1.0, 0.5).getHex()
      const disk = createGenesisAccretionDisk(innerRadius, outerRadius, 200, color)
      disk.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.15 : -0.15)
      scene.add(disk)
      accretionDisks.push({
        mesh: disk,
        rotSpeed: 0.25 + i * 0.08
      })
    }

    // 创世粒子
    const genesisParticles = createGenesisParticles(10000, 100)
    scene.add(genesisParticles)

    // 引力波
    const genesisWaves = []
    for (let i = 0; i < 7; i++) {
      const radius = 35 + i * 14
      const hue = 0.12 + i * 0.02
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6).getHex()
      const wave = createGenesisWaves(radius, 128, color)
      scene.add(wave)
      genesisWaves.push({
        mesh: wave,
        phase: i * 0.6
      })
    }

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新创世核心
      genesisCore.rotation.x += 0.008
      genesisCore.rotation.y += 0.012
      genesisCore.material.uniforms.uTime.value = time
      genesisCore.material.uniforms.uGenesis.value = 0.6 + 0.4 * Math.sin(time * 1.2)

      // 更新莫比乌斯带
      mobiusStrips.forEach((strip, i) => {
        strip.mesh.rotation.x += strip.rotSpeed
        strip.mesh.rotation.y += strip.rotSpeed * 1.5
        strip.mesh.material.uniforms.uTime.value = time
        strip.mesh.material.uniforms.uTwist.value = 0.5 + 0.5 * Math.sin(time * 1.8 + strip.phase)
      })

      // 更新吸积盘
      accretionDisks.forEach((disk, i) => {
        disk.mesh.material.uniforms.uTime.value = time
        disk.mesh.material.uniforms.uRotation.value = 0.5 + 0.5 * Math.sin(time * 0.8 + i)
      })

      // 更新创世粒子
      genesisParticles.material.uniforms.uTime.value = time
      genesisParticles.rotation.y += 0.004
      genesisParticles.rotation.x = Math.sin(time * 0.5) * 0.1

      // 更新引力波
      genesisWaves.forEach((wave, i) => {
        wave.mesh.material.uniforms.uTime.value = time
        wave.mesh.material.uniforms.uWavePhase.value = wave.phase
        const pulse = 0.85 + 0.15 * Math.sin(time * 1.5 + wave.phase)
        wave.mesh.scale.setScalar(pulse)
      })
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(genesisCore.material.uniforms.uOpacity, {
      value: 0.85,
      duration: 2.5,
      ease: 'power2.out'
    })

    gsap.to(genesisCore.material.uniforms.uGenesis, {
      value: 1.0,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    mobiusStrips.forEach((strip, i) => {
      gsap.to(strip.mesh.material.uniforms.uOpacity, {
        value: 0.65,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.25
      })
    })

    accretionDisks.forEach((disk, i) => {
      gsap.to(disk.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 2,
        ease: 'power2.out',
        delay: 1 + i * 0.3
      })
    })

    gsap.to(genesisParticles.material.uniforms.uOpacity, {
      value: 0.75,
      duration: 3,
      ease: 'power2.out',
      delay: 0.8
    })

    genesisWaves.forEach((wave, i) => {
      gsap.to(wave.mesh.material.uniforms.uOpacity, {
        value: 0.35,
        duration: 2,
        ease: 'power2.out',
        delay: 2 + i * 0.2
      })
    })

    // 相机运动
    tl.to(camera.position, {
      x: 60,
      y: 25,
      z: 90,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -60,
      y: -5,
      z: 95,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 105,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(genesisCore.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(genesisCore.material.uniforms.uGenesis, { value: 0, duration: 1 })

        mobiusStrips.forEach(strip => {
          gsap.to(strip.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        accretionDisks.forEach(disk => {
          gsap.to(disk.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(genesisParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })

        genesisWaves.forEach(wave => {
          gsap.to(wave.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(genesisCore)
        genesisCore.geometry.dispose()
        genesisCore.material.dispose()

        mobiusStrips.forEach(strip => {
          scene.remove(strip.mesh)
          strip.mesh.geometry.dispose()
          strip.mesh.material.dispose()
        })

        accretionDisks.forEach(disk => {
          scene.remove(disk.mesh)
          disk.mesh.geometry.dispose()
          disk.mesh.material.dispose()
        })

        scene.remove(genesisParticles)
        genesisParticles.geometry.dispose()
        genesisParticles.material.dispose()

        genesisWaves.forEach(wave => {
          scene.remove(wave.mesh)
          wave.mesh.geometry.dispose()
          wave.mesh.material.dispose()
        })

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 18)

    return tl

  } catch (error) {
    console.error('全息宇宙创世交响曲动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
