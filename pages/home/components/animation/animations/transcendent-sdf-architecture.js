/**
 * 🏗️ 超越级SDF建筑体 (Transcendent SDF Architecture)
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - SDF有向距离场渲染
 * - 胶囊体几何构建
 * - 平滑联合操作
 * - 空间重复平铺
 * - Raymarching光线追踪
 * - 动态SDF变形
 *
 * 视觉表现:
 * 多层胶囊体建筑结构
 * SDF平滑融合效果
 * 空间平铺与重复
 * 动态光线追踪
 * 建筑轮廓发光
 * 透明度深度衰减
 *
 * @author Professional VFX Designer
 * Credits: Based on SDF architecture rendering techniques
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建SDF建筑核心 - 胶囊体结构
 */
function createSDFArchitectureCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uSDFIntensity: { value: 0 },
      uArchDensity: { value: 0 },
      uPhaseShift: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uSDFIntensity;
      uniform float uArchDensity;
      uniform float uPhaseShift;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vSDFPattern;

      // Hash function for SDF variation
      float hash13(vec3 p3) {
        p3 = fract(p3 * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      // Smooth Union operation
      float opSmoothUnion(float d1, float d2, float k) {
        float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
        return mix(d2, d1, h) - k * h * (1.0 - h);
      }

      // Space repetition
      vec3 opRep(vec3 p, vec3 c, out vec3 idx) {
        p = (p + 0.5 * c) / c;
        vec3 floorP = floor(p);
        vec3 fractP = fract(p);
        idx = floorP;
        return fractP * c - 0.5 * c;
      }

      // Box SDF
      float sdBox(vec3 p, vec3 b) {
        vec3 q = abs(p) - b;
        return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
      }

      // Capsule SDF
      float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
        vec3 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h) - r;
      }

      // SDF Map function
      vec2 map(vec3 p) {
        vec3 idx;
        p = opRep(p, vec3(8.0, 4.0, 6.0), idx);

        vec2 res = vec2(100.0, 0.0);
        float thickness = 0.3;
        
        // Random selection based on hash
        float r = hash13(idx * 100.0 + floor(uTime * 2.0 + uPhaseShift));
        
        // Skip some cells for variation
        if (r > 0.3 + step(dot(idx, idx), 0.5)) {
          return vec2(2.0, 0.0);
        }

        // Building-like capsule structures
        vec3 bp = p;
        res.x = min(res.x, sdCapsule(bp, vec3(-2.5, 0, 0), vec3(-1.2, 0, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(-1.8, -0.5, 0), vec3(-1.8, 0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(-1.0, 0.5, 0), vec3(-1.8, 0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(-0.5, -0.5, 0), vec3(-1.0, 0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(0.0, 0.5, 0), vec3(-0.5, -0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(0.5, -0.5, 0), vec3(0.0, 0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(1.0, 0.5, 0), vec3(0.5, -0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(1.8, 0.5, 0), vec3(1.0, 0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(1.8, -0.4, 0), vec3(1.8, 0.5, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(1.0, -0.4, 0), vec3(1.8, -0.4, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(1.0, 0.0, 0), vec3(1.0, -0.4, 0), thickness));
        res.x = min(res.x, sdCapsule(bp, vec3(2.2, 0.0, 0), vec3(1.0, 0.0, 0), thickness));

        res.y = step(0.25, p.z);
        
        return res;
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPosition);

        vec3 pos = position;

        // Sample SDF at position
        vec2 sdfResult = map(pos * 0.5);
        vSDFPattern = sdfResult.x;

        // SDF deformation
        float sdfDeform = smoothstep(0.0, 1.0, sdfResult.x);
        pos += normal * sdfDeform * uSDFIntensity * 3.0;

        // Arch density variation
        float archNoise = hash13(pos * 2.0 + uTime);
        pos += normal * (archNoise - 0.5) * uArchDensity * 2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uSDFIntensity;
      uniform float uArchDensity;
      uniform float uPhaseShift;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vSDFPattern;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // SDF pattern visualization
        float sdfPattern = smoothstep(0.0, 1.0, vSDFPattern);
        
        // Building edges highlight
        float edgeHighlight = smoothstep(0.1, 0.2, sdfPattern) * smoothstep(0.5, 0.3, sdfPattern);
        
        // Architectural grid pattern
        float gridPattern = sin(vPosition.x * 4.0 + uTime) * 
                          sin(vPosition.y * 4.0 + uTime * 1.1) * 
                          sin(vPosition.z * 4.0 + uTime * 1.2);
        gridPattern = gridPattern * 0.5 + 0.5;

        // Color variation based on SDF
        vec3 baseColor = uColor;
        vec3 edgeColor = vec3(1.0, 1.0, 0.8);
        vec3 gridColor = vec3(0.6, 0.8, 1.0);

        vec3 finalColor = mix(baseColor, edgeColor, edgeHighlight * uSDFIntensity * 0.5);
        finalColor = mix(finalColor, gridColor, gridPattern * uArchDensity * 0.3);

        // Fresnel glow
        finalColor += baseColor * fresnel * 0.3;

        // Depth fog
        float depth = length(vPosition);
        float fog = exp(-depth * 0.02);

        // Alpha
        float alpha = (fresnel * 0.3 + sdfPattern * 0.4 + edgeHighlight * 0.3) * uOpacity * fog;
        alpha += gridPattern * uArchDensity * 0.15;

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
 * 创建SDF建筑环 - 胶囊体平铺
 */
function createSDFArchitectureRing(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uArchPhase: { value: 0 },
      uSDFDensity: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uArchPhase;
      uniform float uSDFDensity;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      // Hash function
      float hash13(vec3 p3) {
        p3 = fract(p3 * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      // Capsule SDF
      float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
        vec3 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h) - r;
      }

      void main() {
        vUv = uv;
        vPosition = position;
        vRadius = length(position.xz);

        vec3 pos = position;

        // Building pattern on ring
        float angle = atan(pos.z, pos.x);
        float buildingIndex = floor(angle * 6.0 + uArchPhase);
        float buildingHash = hash13(vec3(buildingIndex, 0.0, uTime));
        
        // Building height variation
        float buildingHeight = buildingHash * uSDFDensity * 4.0;
        pos.y += buildingHeight;

        // Ring wave
        float ringWave = sin(vRadius * 2.0 - uTime * 3.0 + uArchPhase * 2.0);
        pos.y += ringWave * uSDFDensity * 2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uArchPhase;
      uniform float uSDFDensity;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      void main() {
        // Ring pattern
        float ringPattern = sin(vRadius * 1.5 - uTime * 4.0 + uArchPhase * 3.0) * 0.5 + 0.5;

        // Angle pattern (building positions)
        float angle = atan(vPosition.z, vPosition.x);
        float buildingPattern = sin(angle * 12.0 + uTime * 2.0 + uArchPhase) * 0.5 + 0.5;

        // Edge glow
        float edgeGlow = smoothstep(uInnerRadius, uOuterRadius, vRadius) *
                        (1.0 - smoothstep(uInnerRadius, uOuterRadius, vRadius));
        edgeGlow = pow(edgeGlow, 0.5);

        // SDF density pattern
        float sdfPattern = smoothstep(0.2, 0.8, uSDFDensity);

        vec3 color = uColor;
        color *= (ringPattern * 0.4 + buildingPattern * 0.35 + edgeGlow * 0.25);
        color *= (0.6 + sdfPattern * 0.4);

        float alpha = (ringPattern * 0.4 + buildingPattern * 0.35 + edgeGlow * 0.25) * uOpacity;
        alpha *= (0.6 + sdfPattern * 0.4);

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
 * 创建SDF建筑粒子
 */
function createSDFArchitectureParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const buildingIndices = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = 0.55 + Math.random() * 0.15 // Cyan to blue
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.3 + Math.random() * 0.8
    phases[i] = Math.random() * Math.PI * 2
    buildingIndices[i] = Math.floor(Math.random() * 6)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('buildingIndex', new THREE.BufferAttribute(buildingIndices, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uSDFIntensity: { value: 0 },
      uRadius: { value: radius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uSDFIntensity;
      uniform float uRadius;

      attribute float size;
      attribute vec3 color;
      attribute float phase;
      attribute float buildingIndex;

      varying vec3 vColor;
      varying float vPhase;
      varying float vBuildingIndex;

      void main() {
        vColor = color;
        vPhase = phase;
        vBuildingIndex = buildingIndex;

        vec3 pos = position;

        // Building-like motion
        float buildingAngle = buildingIndex * 1.0472 + uTime * 0.5; // 60 degrees each
        vec3 targetPos = pos;
        targetPos.x += cos(buildingAngle) * 2.0;
        targetPos.z += sin(buildingAngle) * 2.0;

        pos = mix(pos, targetPos, uSDFIntensity * 0.5);

        // Vertical motion
        pos.y += sin(uTime * 0.3 + phase) * uSDFIntensity * 3.0;

        // SDF glow
        float sdfPulse = 1.0 + 0.4 * sin(uTime * 4.0 + phase * 5.0);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * sdfPulse * (350.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uSDFIntensity;

      varying vec3 vColor;
      varying float vPhase;
      varying float vBuildingIndex;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // Building pattern
        float buildingPattern = sin(vBuildingIndex * 3.1416 + uTime * 2.0) * 0.5 + 0.5;

        // SDF glow effect
        float sdfGlow = smoothstep(0.5, 0.0, dist);
        sdfGlow *= (1.0 + buildingPattern * uSDFIntensity);

        float alpha = sdfGlow * uOpacity;
        vec3 color = vColor * (1.0 + buildingPattern * 0.3);

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
export default function animateTranscendentSDFArchitecture(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 110), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-sdf-architecture' })
      },
      onError,
      '🏗️ 超越级SDF建筑体（胶囊体SDF）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x0a1525)
    scene.fog = new THREE.FogExp2(0x0a1525, 0.001)

    // 创建SDF建筑核心
    const sdfArchitecture = createSDFArchitectureCore(22, 0x4fc3f7)
    scene.add(sdfArchitecture)

    // 创建SDF建筑环
    const archRings = []
    for (let i = 0; i < 4; i++) {
      const innerRadius = 30 + i * 16
      const outerRadius = 34 + i * 16
      const hue = 0.52 + i * 0.08
      const color = new THREE.Color().setHSL(hue, 0.85, 0.65).getHex()
      const ring = createSDFArchitectureRing(innerRadius, outerRadius, 128, color)
      ring.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.08 : -0.08)
      ring.rotation.z = i * 0.2
      scene.add(ring)
      archRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.005, phase: i * 0.8 })
    }

    // 创建SDF建筑粒子
    const archParticles = createSDFArchitectureParticles(10000, 100)
    scene.add(archParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新SDF建筑核心
      sdfArchitecture.material.uniforms.uTime.value = time
      sdfArchitecture.material.uniforms.uSDFIntensity.value = 0.5 + 0.5 * Math.sin(time * 0.5)
      sdfArchitecture.material.uniforms.uArchDensity.value = 0.4 + 0.6 * Math.sin(time * 0.4)
      sdfArchitecture.material.uniforms.uPhaseShift.value = time * 0.3
      sdfArchitecture.rotation.y += 0.004
      sdfArchitecture.rotation.x = Math.sin(time * 0.3) * 0.03

      // 更新SDF建筑环
      archRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = -Math.PI / 2 + Math.sin(time * 0.4 + ring.phase) * 0.12
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uArchPhase.value = time + ring.phase
        ring.mesh.material.uniforms.uSDFDensity.value = 0.5 + 0.5 * Math.sin(time * 0.5 + ring.phase)
        const pulse = 1 + 0.06 * Math.sin(time * 1.8 + ring.phase)
        ring.mesh.scale.setScalar(pulse)
      })

      // 更新SDF建筑粒子
      archParticles.material.uniforms.uTime.value = time
      archParticles.material.uniforms.uSDFIntensity.value = 0.6 + 0.4 * Math.sin(time * 0.6)
      archParticles.rotation.y += 0.002
      archParticles.rotation.x = Math.sin(time * 0.25) * 0.04
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(sdfArchitecture.material.uniforms.uOpacity, {
      value: 0.75,
      duration: 2.5,
      ease: 'power2.out'
    })

    gsap.to(sdfArchitecture.material.uniforms.uSDFIntensity, {
      value: 0.8,
      duration: 3,
      ease: 'power2.out'
    })

    gsap.to(sdfArchitecture.material.uniforms.uArchDensity, {
      value: 0.9,
      duration: 3,
      ease: 'power2.out'
    })

    archRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 2.2,
        ease: 'power2.out',
        delay: i * 0.3
      })
    })

    gsap.to(archParticles.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(archParticles.material.uniforms.uSDFIntensity, {
      value: 0.75,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    // 相机运动
    tl.to(camera.position, {
      x: 55,
      y: 20,
      z: 70,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -55,
      y: -8,
      z: 85,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 95,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(sdfArchitecture.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(sdfArchitecture.material.uniforms.uSDFIntensity, { value: 0, duration: 1.5 })
        gsap.to(sdfArchitecture.material.uniforms.uArchDensity, { value: 0, duration: 1.5 })

        archRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
          gsap.to(ring.mesh.material.uniforms.uSDFDensity, { value: 0, duration: 1.2 })
        })

        gsap.to(archParticles.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
        gsap.to(archParticles.material.uniforms.uSDFIntensity, { value: 0, duration: 1.2 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(sdfArchitecture)
        sdfArchitecture.geometry.dispose()
        sdfArchitecture.material.dispose()

        archRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(archParticles)
        archParticles.geometry.dispose()
        archParticles.material.dispose()

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
    console.error('超越级SDF建筑体动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
