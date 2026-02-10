/**
 * 🌈 超越级分形色相风景 (Transcendent Fractal Hue-Scape)
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - YIQ色彩空间变换
 * - 分形几何迭代
 * - 平滑最小值操作
 * - 体积光线追踪
 * - 6次方长度计算
 * - 动态色相偏移
 *
 * 视觉表现:
 * 多层分形迭代几何
 * 动态色相循环变换
 * 体积光散射效果
 * 平滑边缘融合
 * 分形深度层次
 * 颜色空间插值
 *
 * @author Professional VFX Designer
 * Credits: Based on fractal hue-shift techniques
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建分形色相风景核心
 */
function createFractalHueScapeCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uFractalIntensity: { value: 0 },
      uHueShift: { value: 0 },
      uIterationDepth: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uFractalIntensity;
      uniform float uHueShift;
      uniform float uIterationDepth;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vFractalValue;

      // YIQ to RGB conversion for hue shift
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

      // Smooth minimum (smin)
      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }

      // 6th power length
      float length6(vec3 p) {
        p = p * p * p;
        p = p * p;
        return pow(p.x + p.y + p.z, 1.0 / 6.0);
      }

      // 2D rotation
      void pR(inout vec2 p, float a) {
        p = cos(a) * p + sin(a) * vec2(p.y, -p.x);
      }

      // Fractal function
      float fractal(vec3 p) {
        const int iterations = 15;
        float d = uTime * 3.0 - p.z;
        p = p.yxz;
        pR(p.yz, 1.570795);
        p.x += 5.0;

        p.yz = mod(abs(p.yz) - 0.0, 15.0) - 7.5;
        float scale = 1.2;

        float depthScale = 1.0 + uIterationDepth * 0.5;
        p.xy /= (1.0 + d * d * 0.0003);

        float l = 0.0;

        for (int i = 0; i < iterations; i++) {
          p.xy = abs(p.xy);
          p = p * scale + vec3(-2.5 + d * 0.008, -1.2, -0.4);

          pR(p.xy, 0.3 - d * 0.01);
          pR(p.yz, 0.45 + d * 0.015);

          l = length6(p);
        }
        return l * pow(scale, -float(iterations)) - 0.15;
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPosition);

        vec3 pos = position;

        // Calculate fractal value at position
        float fractalVal = fractal(pos * 0.3);
        vFractalValue = fractalVal;

        // Fractal deformation
        float fractalDeform = smoothstep(0.0, 1.0, fractalVal);
        pos += normal * fractalDeform * uFractalIntensity * 4.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uFractalIntensity;
      uniform float uHueShift;
      uniform float uIterationDepth;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vFractalValue;

      // YIQ hue shift
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

        // Fractal pattern
        float fractalPattern = smoothstep(0.0, 1.0, vFractalValue);
        
        // Hue shifted color
        vec3 baseColor = uColor;
        vec3 hueShiftedColor = hue(baseColor, uHueShift * 6.28318);

        // Iteration depth color variation
        vec3 depthColor = mix(baseColor, hueShiftedColor, uIterationDepth * 0.5);

        // Fractal edge highlight
        float edgeHighlight = smoothstep(0.1, 0.25, fractalPattern) * smoothstep(0.6, 0.4, fractalPattern);

        // Final color mixing
        vec3 finalColor = mix(baseColor, depthColor, fractalPattern * uFractalIntensity * 0.6);
        finalColor = mix(finalColor, hueShiftedColor, edgeHighlight * 0.5);

        // Add spectral bands
        float spectral = sin(vPosition.x * 3.0 + uTime * 2.0) * 
                       sin(vPosition.y * 3.0 + uTime * 2.2) * 
                       sin(vPosition.z * 3.0 + uTime * 2.4);
        spectral = spectral * 0.5 + 0.5;
        vec3 spectralColor = hue(vec3(1.0, 0.5, 0.0), spectral * 6.28318);
        finalColor += spectralColor * uFractalIntensity * 0.2;

        // Fresnel glow
        finalColor += baseColor * fresnel * 0.3;

        // Depth fog
        float depth = length(vPosition);
        float fog = exp(-depth * 0.025);

        // Alpha
        float alpha = (fresnel * 0.3 + fractalPattern * 0.4 + edgeHighlight * 0.3) * uOpacity * fog;
        alpha += spectral * uFractalIntensity * 0.1;

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
 * 创建分形色相风景环
 */
function createFractalHueScapeRing(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uHuePhase: { value: 0 },
      uFractalDensity: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uHuePhase;
      uniform float uFractalDensity;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      // 6th power length
      float length6(vec3 p) {
        p = p * p * p;
        p = p * p;
        return pow(p.x + p.y + p.z, 1.0 / 6.0);
      }

      // 2D rotation
      void pR(inout vec2 p, float a) {
        p = cos(a) * p + sin(a) * vec2(p.y, -p.x);
      }

      void main() {
        vUv = uv;
        vPosition = position;
        vRadius = length(position.xz);

        vec3 pos = position;

        // Fractal pattern on ring
        vec3 fp = pos * 0.15;
        for (int i = 0; i < 5; i++) {
          fp.xy = abs(fp.xy);
          fp = fp * 1.2 + vec3(-0.8, -0.4, -0.2);
          pR(fp.xy, 0.3 + uHuePhase * 0.1);
        }
        float fractalVal = length6(fp);

        // Ring deformation
        float angle = atan(pos.z, pos.x);
        float wave = sin(angle * 6.0 + uTime * 3.0 + uHuePhase * 2.0) * 0.5 + 0.5;
        pos.y += wave * uFractalDensity * 3.0 * (0.5 + fractalVal * 0.5);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uHuePhase;
      uniform float uFractalDensity;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      // YIQ hue shift
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
        // Ring pattern
        float ringPattern = sin(vRadius * 1.8 - uTime * 4.0 + uHuePhase * 3.0) * 0.5 + 0.5;

        // Angle pattern with hue shift
        float angle = atan(vPosition.z, vPosition.x);
        float hueAngle = angle + uHuePhase;
        vec3 hueShifted = hue(uColor, hueAngle);

        // Edge glow
        float edgeGlow = smoothstep(uInnerRadius, uOuterRadius, vRadius) *
                        (1.0 - smoothstep(uInnerRadius, uOuterRadius, vRadius));
        edgeGlow = pow(edgeGlow, 0.5);

        // Fractal density pattern
        float fractalPattern = smoothstep(0.2, 0.8, uFractalDensity);

        vec3 color = mix(uColor, hueShifted, ringPattern * 0.6);
        color *= (ringPattern * 0.4 + edgeGlow * 0.35 + fractalPattern * 0.25);

        float alpha = (ringPattern * 0.4 + edgeGlow * 0.35 + fractalPattern * 0.25) * uOpacity;

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
 * 创建分形色相粒子
 */
function createFractalHueScapeParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const hueOffsets = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() // Full spectrum
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.4 + Math.random() * 1.0
    phases[i] = Math.random() * Math.PI * 2
    hueOffsets[i] = Math.random() * 6.28318
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('hueOffset', new THREE.BufferAttribute(hueOffsets, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uHueIntensity: { value: 0 },
      uRadius: { value: radius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uHueIntensity;
      uniform float uRadius;

      attribute float size;
      attribute vec3 color;
      attribute float phase;
      attribute float hueOffset;

      varying vec3 vColor;
      varying float vPhase;
      varying float vHueOffset;

      void main() {
        vColor = color;
        vPhase = phase;
        vHueOffset = hueOffset;

        vec3 pos = position;

        // Spiral motion
        float spiralAngle = uTime * 0.4 + phase * 0.5;
        float cosAngle = cos(spiralAngle);
        float sinAngle = sin(spiralAngle);

        vec3 spiralPos;
        spiralPos.x = pos.x * cosAngle - pos.z * sinAngle;
        spiralPos.z = pos.x * sinAngle + pos.z * cosAngle;
        spiralPos.y = pos.y;

        // Vertical oscillation
        spiralPos.y += sin(uTime * 2.0 + phase) * uHueIntensity * 2.0;

        pos = mix(position, spiralPos, uHueIntensity * 0.5);

        // Fractal-like pulsing
        float fractalPulse = 1.0 + 0.3 * sin(uTime * 3.0 + phase * 4.0);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * fractalPulse * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uHueIntensity;

      // YIQ hue shift
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
      varying float vHueOffset;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // Dynamic hue shift
        float hueShift = uTime * 2.0 + vPhase * 5.0 + vHueOffset;
        vec3 hueColor = hue(vColor, hueShift * uHueIntensity);

        // Fractal glow
        float fractalGlow = smoothstep(0.5, 0.0, dist);
        fractalGlow *= (1.0 + 0.4 * sin(uTime * 5.0 + vPhase * 8.0) * uHueIntensity);

        float alpha = fractalGlow * uOpacity;
        vec3 color = hueColor * (1.0 + fractalGlow * 0.3);

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
export default function animateTranscendentFractalHueScape(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 18, 105), 85, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-fractal-hue-scape' })
      },
      onError,
      '🌈 超越级分形色相风景（YIQ色相偏移）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x0d0818)
    scene.fog = new THREE.FogExp2(0x0d0818, 0.0012)

    // 创建分形色相风景核心
    const fractalHueScape = createFractalHueScapeCore(24, 0xff0080)
    scene.add(fractalHueScape)

    // 创建分形色相风景环
    const hueRings = []
    for (let i = 0; i < 4; i++) {
      const innerRadius = 32 + i * 14
      const outerRadius = 36 + i * 14
      const hue = (i * 0.25) % 1.0
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6).getHex()
      const ring = createFractalHueScapeRing(innerRadius, outerRadius, 128, color)
      ring.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.1 : -0.1)
      ring.rotation.z = i * 0.2
      scene.add(ring)
      hueRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.006, phase: i * 0.7 })
    }

    // 创建分形色相粒子
    const hueParticles = createFractalHueScapeParticles(9000, 95)
    scene.add(hueParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新分形色相风景核心
      fractalHueScape.material.uniforms.uTime.value = time
      fractalHueScape.material.uniforms.uFractalIntensity.value = 0.6 + 0.4 * Math.sin(time * 0.5)
      fractalHueScape.material.uniforms.uHueShift.value = time * 0.1
      fractalHueScape.material.uniforms.uIterationDepth.value = 0.5 + 0.5 * Math.sin(time * 0.4)
      fractalHueScape.rotation.y += 0.004
      fractalHueScape.rotation.x = Math.sin(time * 0.3) * 0.04

      // 更新分形色相风景环
      hueRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = -Math.PI / 2 + Math.sin(time * 0.5 + ring.phase) * 0.15
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uHuePhase.value = time + ring.phase
        ring.mesh.material.uniforms.uFractalDensity.value = 0.5 + 0.5 * Math.sin(time * 0.6 + ring.phase)
        const pulse = 1 + 0.07 * Math.sin(time * 1.8 + ring.phase)
        ring.mesh.scale.setScalar(pulse)
      })

      // 更新分形色相粒子
      hueParticles.material.uniforms.uTime.value = time
      hueParticles.material.uniforms.uHueIntensity.value = 0.6 + 0.4 * Math.sin(time * 0.5)
      hueParticles.rotation.y += 0.003
      hueParticles.rotation.x = Math.sin(time * 0.25) * 0.05
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(fractalHueScape.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2.5,
      ease: 'power2.out'
    })

    gsap.to(fractalHueScape.material.uniforms.uFractalIntensity, {
      value: 0.85,
      duration: 3,
      ease: 'power2.out'
    })

    gsap.to(fractalHueScape.material.uniforms.uIterationDepth, {
      value: 0.9,
      duration: 3,
      ease: 'power2.out'
    })

    hueRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.75,
        duration: 2.2,
        ease: 'power2.out',
        delay: i * 0.3
      })
    })

    gsap.to(hueParticles.material.uniforms.uOpacity, {
      value: 0.85,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(hueParticles.material.uniforms.uHueIntensity, {
      value: 0.8,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    // 相机运动
    tl.to(camera.position, {
      x: 50,
      y: 18,
      z: 75,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -50,
      y: -6,
      z: 88,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 6,
      z: 98,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(fractalHueScape.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(fractalHueScape.material.uniforms.uFractalIntensity, { value: 0, duration: 1.5 })
        gsap.to(fractalHueScape.material.uniforms.uIterationDepth, { value: 0, duration: 1.5 })

        hueRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
          gsap.to(ring.mesh.material.uniforms.uFractalDensity, { value: 0, duration: 1.2 })
        })

        gsap.to(hueParticles.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
        gsap.to(hueParticles.material.uniforms.uHueIntensity, { value: 0, duration: 1.2 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(fractalHueScape)
        fractalHueScape.geometry.dispose()
        fractalHueScape.material.dispose()

        hueRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(hueParticles)
        hueParticles.geometry.dispose()
        hueParticles.material.dispose()

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
    console.error('超越级分形色相风景动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
