/**
 * 🌌 超越级万花球 (Transcendent Kaleidosphere)
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - Danilo Guanabara风格万花筒分形算法
 * - 多层迭代深度场渲染
 * - 空间折叠与对称变换
 * - 模运算分形纹理
 * - 元球融合技术
 * - 量子干涉条纹
 *
 * 视觉表现:
 * 3层迭代万花筒效果
 * 动态空间折叠
 * 模运算发光条纹
 * 元球核心脉动
 * 维度光谱循环
 * 深度衰减光晕
 *
 * @author Professional VFX Designer
 * Credits: Original kaleidoscope algorithm by Danilo Guanabara
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建万花球核心 - 融合元球与万花筒效果
 */
function createKaleidoCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 128, 128)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uKaleidoIntensity: { value: 0 },
      uFractalDepth: { value: 0 },
      uPhaseShift: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uKaleidoIntensity;
      uniform float uFractalDepth;
      uniform float uPhaseShift;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPosition);

        vec3 pos = position;

        // 万花筒对称变形
        float angle = atan(pos.z, pos.x);
        float symmetry = 6.0 + uFractalDepth * 12.0;
        float foldedAngle = mod(angle + uPhaseShift, TWO_PI / symmetry) - (TWO_PI / symmetry) * 0.5;
        
        vec3 foldedPos;
        foldedPos.x = cos(foldedAngle) * length(pos.xz);
        foldedPos.z = sin(foldedAngle) * length(pos.xz);
        foldedPos.y = pos.y;

        // 应用变形强度
        pos = mix(pos, foldedPos, uKaleidoIntensity);

        // 模运算纹理变形
        float modDist = length(mod(pos * 0.3, 1.0) - 0.5);
        pos += normal * (1.0 / modDist) * uKaleidoIntensity * 0.05;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uKaleidoIntensity;
      uniform float uFractalDepth;
      uniform float uPhaseShift;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;

      #define TWO_PI 6.2831853

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 万花筒迭代计算（模拟Danilo Guanabara算法）
        vec3 c = vec3(0.0);
        float l = 0.0;
        float z = uTime * 0.5;

        for(int i = 0; i < 3; i++) {
          vec2 uv = (vPosition.xz + vec2(1.0)) * 0.5;
          vec2 p = uv - 0.5;
          p.x *= 1.0; // 保持纵横比

          z += 0.07;
          l = length(p);

          // 万花筒折叠
          vec2 foldedUV = uv + p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z * 2.0 - z));

          // 模运算发光条纹
          c[i] = 0.01 / length(mod(foldedUV, 1.0) - 0.5);
        }

        // 归一化颜色
        vec3 kaleidoColor = c / l;

        // 分形层次
        float fractalLevel = floor(uFractalDepth * 3.0) + 1.0;
        float fractalPattern = sin(vPosition.x * fractalLevel + uTime) *
                               sin(vPosition.y * fractalLevel + uTime * 1.1) *
                               sin(vPosition.z * fractalLevel + uTime * 1.2);
        fractalPattern = fractalPattern * 0.5 + 0.5;

        // 维度光谱循环
        vec3 spectrum;
        spectrum.r = sin(uTime * 2.0) * 0.5 + 0.5;
        spectrum.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        spectrum.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;

        // 混合所有效果
        vec3 baseColor = uColor;
        vec3 finalColor = mix(baseColor, kaleidoColor, uKaleidoIntensity * 0.7);
        finalColor = mix(finalColor, spectrum, fractalPattern * uFractalDepth * 0.3);
        finalColor += kaleidoColor * uKaleidoIntensity * 0.5;
        finalColor += fresnel * baseColor * 0.3;

        float alpha = (fresnel * 0.3 + fractalPattern * 0.2 + 
                      uKaleidoIntensity * 0.5) * uOpacity;

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
 * 创建万花筒分形环
 */
function createKaleidoRing(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uKaleidoPhase: { value: 0 },
      uSymmetry: { value: 8 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uKaleidoPhase;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      void main() {
        vUv = uv;
        vPosition = position;
        vRadius = length(position.xz);

        vec3 pos = position;

        // 万花筒螺旋变形
        float angle = atan(pos.z, pos.x);
        float symmetry = 8.0;
        float foldedAngle = mod(angle + uKaleidoPhase, TWO_PI / symmetry) - (TWO_PI / symmetry) * 0.5;
        
        float spiral = sin(foldedAngle * 3.0 + uTime * 2.0) * 0.3;
        pos.y += spiral * uKaleidoPhase;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uKaleidoPhase;
      uniform float uSymmetry;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;

      #define TWO_PI 6.2831853

      void main() {
        // 万花筒模运算效果
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        
        float z = uTime * 0.3;
        float l = length(p);
        
        // 万花筒折叠
        vec2 foldedUV = uv + p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z * 2.0 - z));
        
        vec3 kaleidoColor = vec3(0.0);
        for(int i = 0; i < 3; i++) {
          kaleidoColor[i] = 0.01 / length(mod(foldedUV, 1.0) - 0.5);
        }
        kaleidoColor /= l;

        // 角度图案
        float angle = atan(vPosition.z, vPosition.x);
        float anglePattern = sin(angle * uSymmetry + uTime * 3.0 + uKaleidoPhase) * 0.5 + 0.5;

        // 环状波
        float ringWave = sin(vRadius * 2.0 - uTime * 4.0 + uKaleidoPhase * 3.0) * 0.5 + 0.5;

        // 边缘发光
        float edgeGlow = smoothstep(uInnerRadius, uOuterRadius, vRadius) *
                        (1.0 - smoothstep(uInnerRadius, uOuterRadius, vRadius));
        edgeGlow = pow(edgeGlow, 0.5);

        vec3 finalColor = mix(uColor, kaleidoColor, 0.6);
        finalColor *= (ringWave * 0.4 + anglePattern * 0.3 + edgeGlow * 0.3);

        float alpha = (ringWave * 0.4 + anglePattern * 0.3 + edgeGlow * 0.3) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
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
 * 创建万花筒粒子系统
 */
function createKaleidoParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const symmetryIndices = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.2 + Math.random() * 0.6
    phases[i] = Math.random() * Math.PI * 2
    symmetryIndices[i] = Math.floor(Math.random() * 8)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('symmetryIndex', new THREE.BufferAttribute(symmetryIndices, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uKaleidoIntensity: { value: 0 },
      uRadius: { value: radius }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uOpacity;
      uniform float uKaleidoIntensity;
      uniform float uRadius;

      attribute float size;
      attribute vec3 color;
      attribute float phase;
      attribute float symmetryIndex;

      varying vec3 vColor;
      varying float vPhase;
      varying float vSymmetryIndex;

      void main() {
        vColor = color;
        vPhase = phase;
        vSymmetryIndex = symmetryIndex;

        vec3 pos = position;

        // 万花筒对称运动
        float angle = atan(pos.z, pos.x);
        float symmetry = 8.0;
        float foldedAngle = mod(angle + uTime * 0.5, TWO_PI / symmetry) - (TWO_PI / symmetry) * 0.5;
        
        vec2 foldedPos = vec2(cos(foldedAngle), sin(foldedAngle)) * length(pos.xz);
        
        vec3 foldedPos3;
        foldedPos3.x = foldedPos.x;
        foldedPos3.z = foldedPos.y;
        foldedPos3.y = pos.y;

        pos = mix(pos, foldedPos3, uKaleidoIntensity);

        // 螺旋运动
        float spiralAngle = uTime * 0.3 + phase;
        float cosAngle = cos(spiralAngle);
        float sinAngle = sin(spiralAngle);
        
        vec3 spiralPos;
        spiralPos.x = pos.x * cosAngle - pos.z * sinAngle;
        spiralPos.z = pos.x * sinAngle + pos.z * cosAngle;
        spiralPos.y = pos.y;

        // 模运算闪烁位置
        float modFactor = length(mod(spiralPos * 0.2, 1.0) - 0.5);
        spiralPos += normalize(spiralPos) * (0.01 / modFactor) * uKaleidoIntensity * 0.5;

        vec4 mvPosition = modelViewMatrix * vec4(spiralPos, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z) * (1.0 + uKaleidoIntensity);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uKaleidoIntensity;

      varying vec3 vColor;
      varying float vPhase;
      varying float vSymmetryIndex;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 万花筒闪烁
        float kaleidoFlicker = sin(uTime * 10.0 + vPhase * 20.0 + vSymmetryIndex) * 0.5 + 0.5;
        
        // 模运算发光
        vec2 uv = gl_PointCoord;
        float modDist = 0.01 / length(mod(uv, 0.5) - 0.25);
        
        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * kaleidoFlicker * (1.0 + modDist * uKaleidoIntensity);
        vec3 color = vColor * (1.0 + kaleidoFlicker * 0.5);

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
export default function animateTranscendentKaleidosphere(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 120), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-kaleidosphere' })
      },
      onError,
      '🌌 超越级万花球（Danilo Guanabara风格）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x020210)
    scene.fog = new THREE.FogExp2(0x020210, 0.0012)

    // 创建万花球核心
    const kaleidoCore = createKaleidoCore(25, 0x6b5b95)
    scene.add(kaleidoCore)

    // 创建万花筒分形环
    const kaleidoRings = []
    for (let i = 0; i < 5; i++) {
      const innerRadius = 32 + i * 12
      const outerRadius = 36 + i * 12
      const hue = (i * 0.2) % 1.0
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6).getHex()
      const ring = createKaleidoRing(innerRadius, outerRadius, 128, color)
      ring.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.08 : -0.08)
      ring.rotation.z = i * 0.2
      scene.add(ring)
      kaleidoRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.008, phase: i * 0.6 })
    }

    // 创建万花筒粒子
    const kaleidoParticles = createKaleidoParticles(10000, 100)
    scene.add(kaleidoParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新万花球核心
      kaleidoCore.material.uniforms.uTime.value = time
      kaleidoCore.material.uniforms.uKaleidoIntensity.value = 0.6 + 0.4 * Math.sin(time * 0.7)
      kaleidoCore.material.uniforms.uFractalDepth.value = 0.4 + 0.6 * Math.sin(time * 0.5)
      kaleidoCore.material.uniforms.uPhaseShift.value = time * 0.5
      kaleidoCore.rotation.x += 0.004
      kaleidoCore.rotation.y += 0.006

      // 更新万花筒环
      kaleidoRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = -Math.PI / 2 + Math.sin(time + ring.phase) * 0.12
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uKaleidoPhase.value = time + ring.phase
        const pulse = 1 + 0.06 * Math.sin(time * 2.5 + ring.phase)
        ring.mesh.scale.setScalar(pulse)
      })

      // 更新万花筒粒子
      kaleidoParticles.material.uniforms.uTime.value = time
      kaleidoParticles.material.uniforms.uKaleidoIntensity.value = 0.5 + 0.5 * Math.sin(time * 0.6)
      kaleidoParticles.rotation.y += 0.003
      kaleidoParticles.rotation.x = Math.sin(time * 0.4) * 0.06
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(kaleidoCore.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2.5,
      ease: 'power2.out'
    })

    gsap.to(kaleidoCore.material.uniforms.uKaleidoIntensity, {
      value: 0.85,
      duration: 3,
      ease: 'power2.out'
    })

    gsap.to(kaleidoCore.material.uniforms.uFractalDepth, {
      value: 0.9,
      duration: 3,
      ease: 'power2.out'
    })

    kaleidoRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 2.2,
        ease: 'power2.out',
        delay: i * 0.25
      })
    })

    gsap.to(kaleidoParticles.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(kaleidoParticles.material.uniforms.uKaleidoIntensity, {
      value: 0.75,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    // 相机运动
    tl.to(camera.position, {
      x: 60,
      y: 25,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -60,
      y: -10,
      z: 95,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 105,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 20 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(kaleidoCore.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(kaleidoCore.material.uniforms.uKaleidoIntensity, { value: 0, duration: 1.5 })
        gsap.to(kaleidoCore.material.uniforms.uFractalDepth, { value: 0, duration: 1.5 })

        kaleidoRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
        })

        gsap.to(kaleidoParticles.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
        gsap.to(kaleidoParticles.material.uniforms.uKaleidoIntensity, { value: 0, duration: 1.2 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(kaleidoCore)
        kaleidoCore.geometry.dispose()
        kaleidoCore.material.dispose()

        kaleidoRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(kaleidoParticles)
        kaleidoParticles.geometry.dispose()
        kaleidoParticles.material.dispose()

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
    console.error('超越级万花球动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
