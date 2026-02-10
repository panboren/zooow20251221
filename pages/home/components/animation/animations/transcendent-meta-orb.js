/**
 * 🌐 超越级元球体 (Meta-Orb SDF Shadertoy)
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - SDF距离场实时渲染
 * - 平滑联合操作
 * - 元球动态变形
 * - 分形迭代深度
 * - 量子概率波叠加
 *
 * 视觉表现:
 * 16层元球融合
 * 动态分形变形
 * 量子干涉图样
 * 元能量脉动
 * 维度时空扭曲
 *
 * @author Professional VFX Designer
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建SDF元球体
 */
function createMetaOrb(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 128, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uMetaIntensity: { value: 0 },
      uFractalDepth: { value: 0 },
      uQuantumFlux: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uMetaIntensity;
      uniform float uFractalDepth;
      uniform float uQuantumFlux;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      varying float vDepth;

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

        // 元球变形 - 模拟SDF平滑联合效果
        float metaNoise = snoise(vec3(pos.x * 0.5, pos.y * 0.5, pos.z * 0.5 + uTime * 0.3));
        pos += normal * metaNoise * uMetaIntensity * 8.0;

        // 分形迭代效果
        float fractalLevel = floor(uFractalDepth * 4.0) + 1.0;
        float fractalDeform = sin(pos.x * fractalLevel + uTime) *
                               sin(pos.y * fractalLevel + uTime * 1.1) *
                               sin(pos.z * fractalLevel + uTime * 1.2);
        pos += normal * fractalDeform * uFractalDepth * 3.0;

        // 量子涨落
        float quantumNoise = snoise(vec3(pos.x * 2.0 + uTime * 2.0,
                                        pos.y * 2.0 + uTime * 2.5,
                                        pos.z * 2.0 + uTime * 3.0));
        pos += normal * quantumNoise * uQuantumFlux * 2.0;

        // 计算深度信息
        vDepth = length(pos) / 30.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uMetaIntensity;
      uniform float uFractalDepth;
      uniform float uQuantumFlux;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      varying float vDepth;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 元球融合光晕
        float metaGlow = sin(vPosition.x * 2.0 + uTime * 3.0) *
                         sin(vPosition.y * 2.0 + uTime * 2.5) *
                         sin(vPosition.z * 2.0 + uTime * 2.0);
        metaGlow = metaGlow * 0.5 + 0.5;

        // 分形层次颜色
        float fractalLevel = floor(uFractalDepth * 4.0) + 1.0;
        float fractalColor = sin(vPosition.x * fractalLevel) *
                             sin(vPosition.y * fractalLevel) *
                             sin(vPosition.z * fractalLevel);
        fractalColor = fractalColor * 0.5 + 0.5;

        // 量子干涉图样
        float quantumInterference = sin(vPosition.x * 5.0 + uTime * 2.0) *
                                    sin(vPosition.y * 5.0 + uTime * 2.5) *
                                    sin(vPosition.z * 5.0 + uTime * 3.0);
        quantumInterference = quantumInterference * 0.5 + 0.5;

        // 概率波
        float probabilityWave = sin(length(vPosition) * 3.0 - uTime * 4.0) * 0.5 + 0.5;

        // 维度光谱
        vec3 spectrum;
        spectrum.r = sin(uTime * 2.0) * 0.5 + 0.5;
        spectrum.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        spectrum.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;

        // 混合所有效果
        vec3 baseColor = uColor;
        vec3 metaColor = mix(baseColor, spectrum, metaGlow * uMetaIntensity * 0.4);
        vec3 fractalColor2 = mix(metaColor, vec3(0.0, 1.0, 1.0), fractalColor * uFractalDepth * 0.3);
        vec3 quantumColor = mix(fractalColor2, spectrum, quantumInterference * uQuantumFlux * 0.3);

        vec3 finalColor = quantumColor;
        finalColor += metaGlow * baseColor * 0.3 * uMetaIntensity;
        finalColor += fractalColor * baseColor * 0.2 * uFractalDepth;
        finalColor += quantumInterference * spectrum * 0.15 * uQuantumFlux;
        finalColor += probabilityWave * baseColor * 0.1;
        finalColor += fresnel * baseColor * 0.25;

        // 深度雾化
        float depthFog = exp(-vDepth * 0.5);

        float alpha = (fresnel * 0.4 + metaGlow * 0.25 + fractalColor * 0.15 +
                      quantumInterference * 0.1 + probabilityWave * 0.1) * uOpacity * depthFog;

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
 * 创建SDF分形环
 */
function createSDFRing(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uRingPhase: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uRingPhase;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      void main() {
        vUv = uv;
        vPosition = position;
        vRadius = length(position.xz);

        vec3 pos = position;

        // 螺旋变形
        float spiral = sin(atan(pos.z, pos.x) * 4.0 + uTime * 3.0 + uRingPhase) * 0.5;
        pos.y += spiral * uRingPhase * 2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uRingPhase;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      void main() {
        // 环状波
        float ringWave = sin(vRadius * 2.0 - uTime * 4.0 + uRingPhase * 5.0) * 0.5 + 0.5;

        // 角度纹理
        float anglePattern = sin(atan(vPosition.z, vPosition.x) * 8.0 + uTime * 3.0) * 0.5 + 0.5;

        // SDF边缘发光
        float edgeGlow = smoothstep(uInnerRadius, uOuterRadius, vRadius) *
                        (1.0 - smoothstep(uInnerRadius, uOuterRadius, vRadius));
        edgeGlow = pow(edgeGlow, 0.5);

        vec3 color = uColor * (ringWave * 0.5 + anglePattern * 0.3 + edgeGlow * 0.2);
        float alpha = (ringWave * 0.5 + anglePattern * 0.3 + edgeGlow * 0.2) * uOpacity;

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
 * 创建量子粒子流
 */
function createQuantumParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const orbitSpeeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.3 + 0.5
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.3 + Math.random() * 0.7
    phases[i] = Math.random() * Math.PI * 2
    orbitSpeeds[i] = 0.5 + Math.random() * 2.0
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('orbitSpeed', new THREE.BufferAttribute(orbitSpeeds, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uFluxIntensity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uFluxIntensity;

      attribute float size;
      attribute vec3 color;
      attribute float phase;
      attribute float orbitSpeed;

      varying vec3 vColor;
      varying float vPhase;
      varying float vOrbitSpeed;

      void main() {
        vColor = color;
        vPhase = phase;
        vOrbitSpeed = orbitSpeed;

        vec3 pos = position;

        // 轨道运动
        float dist = length(pos.xz);
        float angle = uTime * orbitSpeed * 0.5;

        float cosAngle = cos(angle);
        float sinAngle = sin(angle);

        vec3 orbitPos;
        orbitPos.x = pos.x * cosAngle - pos.z * sinAngle;
        orbitPos.z = pos.x * sinAngle + pos.z * cosAngle;
        orbitPos.y = pos.y;

        // 量子涨落
        float flux = sin(uTime * 15.0 + phase * 20.0) *
                     cos(uTime * 18.0 + phase * 25.0) *
                     sin(uTime * 20.0 + phase * 30.0);
        orbitPos += normalize(orbitPos) * flux * uFluxIntensity * 3.0;

        vec4 mvPosition = modelViewMatrix * vec4(orbitPos, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z) * (0.5 + 0.5 * sin(uTime * 5.0 + phase));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uFluxIntensity;

      varying vec3 vColor;
      varying float vPhase;
      varying float vOrbitSpeed;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 量子闪烁
        float quantumFlicker = sin(uTime * 20.0 + vPhase * 50.0) * 0.3 + 0.7;

        // 涨落发光
        float fluxGlow = sin(uTime * 15.0 + vOrbitSpeed * 10.0) * 0.5 + 0.5;
        fluxGlow *= vOrbitSpeed * uFluxIntensity;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * quantumFlicker * (1.0 + fluxGlow);
        gl_FragColor = vec4(vColor * (1.0 + fluxGlow * 0.5), alpha);
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
export default function animateTranscendentMetaOrb(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 25, 115), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-meta-orb' })
      },
      onError,
      '🌐 超越级元球体（SDF Shadertoy）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x050515)
    scene.fog = new THREE.FogExp2(0x050515, 0.0015)

    // 创建元球核心
    const metaOrb = createMetaOrb(28, 0x4a90e2)
    scene.add(metaOrb)

    // 创建SDF分形环
    const sdfRings = []
    for (let i = 0; i < 6; i++) {
      const innerRadius = 35 + i * 10
      const outerRadius = 38 + i * 10
      const hue = i / 6
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6).getHex()
      const ring = createSDFRing(innerRadius, outerRadius, 128, color)
      ring.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.1 : -0.1)
      ring.rotation.z = i * 0.15
      scene.add(ring)
      sdfRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.01, phase: i * 0.5 })
    }

    // 创建量子粒子
    const quantumParticles = createQuantumParticles(8000, 90)
    scene.add(quantumParticles)

    // 创建概率波球
    const probabilitySphereGeometry = new THREE.SphereGeometry(40, 64, 64)
    const probabilitySphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ffff) },
        uOpacity: { value: 0 },
        uWavePhase: { value: 0 }
      },
      vertexShader: `
        precision highp float;

        uniform float uTime;
        uniform float uWavePhase;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewDir;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vViewDir = normalize(cameraPosition - position);

          vec3 pos = position;
          float wave = sin(pos.x * 2.0 + uTime * 4.0 + uWavePhase) *
                       sin(pos.y * 2.0 + uTime * 4.5 + uWavePhase * 1.1) *
                       sin(pos.z * 2.0 + uTime * 5.0 + uWavePhase * 1.2);
          pos += normal * wave * 2.0;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uWavePhase;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewDir;

        void main() {
          vec3 viewDir = normalize(vViewDir);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);

          // 概率波干涉
          float interference = sin(vPosition.x * 3.0 + uTime * 3.0 + uWavePhase) *
                              sin(vPosition.y * 3.0 + uTime * 3.5 + uWavePhase * 1.1) *
                              sin(vPosition.z * 3.0 + uTime * 4.0 + uWavePhase * 1.2);
          interference = interference * 0.5 + 0.5;

          vec3 color = uColor * interference;
          float alpha = fresnel * uOpacity * 0.15;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const probabilitySphere = new THREE.Mesh(probabilitySphereGeometry, probabilitySphereMaterial)
    scene.add(probabilitySphere)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新元球核心
      metaOrb.material.uniforms.uTime.value = time
      metaOrb.material.uniforms.uMetaIntensity.value = 0.5 + 0.5 * Math.sin(time * 0.8)
      metaOrb.material.uniforms.uFractalDepth.value = 0.3 + 0.7 * Math.sin(time * 0.5)
      metaOrb.material.uniforms.uQuantumFlux.value = 0.4 + 0.6 * Math.sin(time * 0.6)
      metaOrb.rotation.x += 0.003
      metaOrb.rotation.y += 0.005

      // 更新SDF环
      sdfRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = -Math.PI / 2 + Math.sin(time + ring.phase) * 0.1
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uRingPhase.value = ring.phase
        const pulse = 1 + 0.08 * Math.sin(time * 2 + ring.phase)
        ring.mesh.scale.setScalar(pulse)
      })

      // 更新量子粒子
      quantumParticles.material.uniforms.uTime.value = time
      quantumParticles.material.uniforms.uFluxIntensity.value = 0.5 + 0.5 * Math.sin(time * 0.7)
      quantumParticles.rotation.y += 0.002
      quantumParticles.rotation.x = Math.sin(time * 0.3) * 0.05

      // 更新概率波球
      probabilitySphere.material.uniforms.uTime.value = time
      probabilitySphere.material.uniforms.uWavePhase.value = time * 2
      probabilitySphere.rotation.y -= 0.003
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(metaOrb.material.uniforms.uOpacity, {
      value: 0.85,
      duration: 2.5,
      ease: 'power2.out'
    })

    gsap.to(metaOrb.material.uniforms.uMetaIntensity, {
      value: 0.8,
      duration: 3,
      ease: 'power2.out'
    })

    gsap.to(metaOrb.material.uniforms.uFractalDepth, {
      value: 0.9,
      duration: 3,
      ease: 'power2.out'
    })

    sdfRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.6,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.2
      })
    })

    gsap.to(quantumParticles.material.uniforms.uOpacity, {
      value: 0.75,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(quantumParticles.material.uniforms.uFluxIntensity, {
      value: 0.7,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(probabilitySphere.material.uniforms.uOpacity, {
      value: 0.4,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5
    })

    // 相机运动
    tl.to(camera.position, {
      x: 55,
      y: 20,
      z: 75,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -55,
      y: -5,
      z: 90,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(metaOrb.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(metaOrb.material.uniforms.uMetaIntensity, { value: 0, duration: 1.5 })
        gsap.to(metaOrb.material.uniforms.uFractalDepth, { value: 0, duration: 1.5 })

        sdfRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(quantumParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(quantumParticles.material.uniforms.uFluxIntensity, { value: 0, duration: 1 })

        gsap.to(probabilitySphere.material.uniforms.uOpacity, { value: 0, duration: 1 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(metaOrb)
        metaOrb.geometry.dispose()
        metaOrb.material.dispose()

        sdfRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(quantumParticles)
        quantumParticles.geometry.dispose()
        quantumParticles.material.dispose()

        scene.remove(probabilitySphere)
        probabilitySphere.geometry.dispose()
        probabilitySphere.material.dispose()

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
    console.error('超越级元球体动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
