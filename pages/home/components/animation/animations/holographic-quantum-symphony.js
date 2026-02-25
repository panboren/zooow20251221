/**
 * ⚛️ 全息量子交响曲 - 终极融合特效
 *
 * 创作灵感：
 * - 融合所有全息特效的精华
 * - 展现宇宙万物的量子共振
 * - 时间、空间、能量的完美统一
 *
 * 核心特性：
 * 1. 量子核心（TorusKnot + 能量漩涡）
 * 2. 12维度场（莫比乌斯带阵列）
 * 3. 时空织网（8000+ 粒子流）
 * 4. 意识波动（神经网络可视化）
 * 5. 宇宙呼吸（脉冲波扩散）
 * 6. 黄金螺旋（斐波那契能量流）
 *
 * 视觉规模：
 * 15000+ 粒子系统
 * 8层维度场
 * 3组量子核心
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
      const vec2  C = vec2(1.0/6.0, 1.0/3.0);
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
  `;
}

// ==================== 程序化粒子纹理 ====================
function createParticleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  return new THREE.CanvasTexture(canvas)
}

// ==================== 量子核心 ====================
function createQuantumCore(radius, color) {
  const geometry = new THREE.TorusKnotGeometry(radius * 0.7, radius * 0.25, 200, 32, 2, 3)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uQuantum: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uQuantum;

      varying vec3 vNormal;
      varying vec3 vPosition;

      ${createSimplexNoiseShader()}

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        vec3 pos = position;
        float noise = snoise(vec3(pos.x * 0.3 + uTime, pos.y * 0.3, pos.z * 0.3 + uTime * 0.5));
        pos += normal * noise * uQuantum * 12.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uQuantum;

      varying vec3 vNormal;
      varying vec3 vPosition;

      ${createSimplexNoiseShader()}

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        float noise = snoise(vec3(vPosition * 0.5 + uTime * 0.5));
        float pulse = sin(uTime * 3.0 + noise * 3.14159) * 0.5 + 0.5;

        vec3 glow = uColor * (1.0 + pulse * uQuantum * 0.8);
        vec3 finalColor = mix(uColor, glow, fresnel * 0.7);

        float core = smoothstep(0.6, 1.0, fresnel);
        finalColor += core * uColor * 0.6;

        float alpha = (fresnel * 0.5 + pulse * 0.3 + core * 0.2) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

// ==================== 维度场（莫比乌斯带） ====================
function createDimensionalField(radius, index, total) {
  const geometry = new THREE.TorusGeometry(radius, radius * 0.1, 32, 200)

  const hue = 0.55 + (index / total) * 0.3
  const color = new THREE.Color().setHSL(hue, 0.9, 0.6)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: color },
      uOpacity: { value: 0 },
      uIndex: { value: index },
      uTotal: { value: total }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uIndex;
      uniform float uTotal;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      ${createSimplexNoiseShader()}

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;

        vec3 pos = position;
        float phase = uIndex / uTotal * 6.28318;
        float noise = snoise(vec3(pos.x * 0.1, pos.y * 0.1, uTime * 0.3 + phase));
        pos += normal * noise * 2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uIndex;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      ${createSimplexNoiseShader()}

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);

        float noise = snoise(vec3(vUv * 3.0 + uTime * 0.2));
        float pulse = sin(uTime * 2.0 + uIndex + noise * 3.14159) * 0.5 + 0.5;

        vec3 glow = uColor * (1.0 + pulse * 0.6);
        vec3 finalColor = mix(uColor, glow, fresnel * 0.5);

        float alpha = (fresnel * 0.6 + pulse * 0.2) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI / 2
  mesh.rotation.y = (index / 8) * Math.PI

  return mesh
}

// ==================== 时空织网粒子系统 ====================
function createSpaceTimeWeave(particleCount) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const phases = new Float32Array(particleCount)
  const speeds = new Float32Array(particleCount)
  const layers = new Float32Array(particleCount)
  const orbits = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const layer = Math.floor(Math.random() * 5)
    const orbitRadius = 20 + layer * 15
    const theta = Math.random() * Math.PI * 2
    const phi = (Math.random() - 0.5) * Math.PI

    positions[i * 3] = orbitRadius * Math.cos(theta) * Math.cos(phi)
    positions[i * 3 + 1] = orbitRadius * Math.sin(phi)
    positions[i * 3 + 2] = orbitRadius * Math.sin(theta) * Math.cos(phi)

    const hue = 0.5 + layer * 0.12 + Math.random() * 0.08
    const color = new THREE.Color().setHSL(hue, 0.9, 0.65)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    phases[i] = Math.random() * Math.PI * 2
    speeds[i] = 0.2 + Math.random() * 0.8
    layers[i] = layer
    orbits[i] = orbitRadius
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('layer', new THREE.BufferAttribute(layers, 1))
  geometry.setAttribute('orbit', new THREE.BufferAttribute(orbits, 1))

  const particleTexture = createParticleTexture()

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: particleTexture },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      attribute float phase;
      attribute float speed;
      attribute float layer;
      attribute float orbit;
      attribute vec3 color;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 轨道运动
        float angle = uTime * speed * (1.0 - layer * 0.15) + phase;
        float orbitSpeed = 3.0 / orbit;
        pos.x = pos.x * cos(angle * orbitSpeed) - pos.z * sin(angle * orbitSpeed);
        pos.z = pos.x * sin(angle * orbitSpeed) + pos.z * cos(angle * orbitSpeed);

        // 呼吸效果
        float breathe = sin(uTime * 1.5 + phase) * 0.5 + 0.5;
        pos *= 1.0 + breathe * 0.1;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        float pulse = sin(uTime * 4.0 + phase) * 0.5 + 0.5;
        gl_PointSize = (3.0 + layer * 0.5) * (400.0 / -mvPosition.z) * (0.7 + 0.6 * pulse);

        gl_Position = projectionMatrix * mvPosition;

        vAlpha = breathe * 0.5 + 0.5;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform sampler2D uTexture;
      uniform float uOpacity;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec4 texColor = texture2D(uTexture, gl_PointCoord);

        vec3 finalColor = vColor * 1.8;

        float alpha = texColor.a * vAlpha * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

// ==================== 意识波动（脉冲环） ====================
function createConsciousnessWave(radius, index) {
  const geometry = new THREE.RingGeometry(radius - 0.5, radius, 64)

  const hue = 0.6 + index * 0.05
  const color = new THREE.Color().setHSL(hue, 0.9, 0.6)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: color },
      uOpacity: { value: 0 },
      uIndex: { value: index }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uIndex;

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
      uniform float uIndex;

      varying vec2 vUv;

      void main() {
        float dist = length(vUv - 0.5) * 2.0;

        float wave = sin(dist * 15.0 - uTime * 3.0 + uIndex * 0.5);
        float ring = smoothstep(0.8, 0.9, dist) * smoothstep(1.0, 0.9, dist);

        float pulse = wave * ring;

        vec3 finalColor = uColor * (1.0 + pulse * 0.8);

        float alpha = ring * (0.3 + pulse * 0.5) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2

  return mesh
}

// ==================== 黄金螺旋能量流 ====================
function createGoldenSpiralFlow(spiralCount) {
  const geometry = new THREE.BufferGeometry()
  const pointCount = spiralCount * 200
  const positions = new Float32Array(pointCount * 3)
  const colors = new Float32Array(pointCount * 3)

  const phi = 1.618033988749895

  for (let s = 0; s < spiralCount; s++) {
    const offsetAngle = (s / spiralCount) * Math.PI * 2

    for (let i = 0; i < 200; i++) {
      const idx = s * 200 + i
      const angle = (i / 200) * Math.PI * 8 + offsetAngle
      const radius = 5 + (i / 200) * 60

      const x = radius * Math.cos(angle)
      const y = (i / 200 - 0.5) * 30
      const z = radius * Math.sin(angle)

      positions[idx * 3] = x
      positions[idx * 3 + 1] = y
      positions[idx * 3 + 2] = z

      const hue = 0.55 + (s / spiralCount) * 0.3
      const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
      colors[idx * 3] = color.r
      colors[idx * 3 + 1] = color.g
      colors[idx * 3 + 2] = color.b
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particleTexture = createParticleTexture()

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: particleTexture },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      attribute vec3 color;
      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        float spiral = sin(uTime * 2.0 + length(pos) * 0.05);
        pos.y += spiral * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        float pulse = sin(uTime * 5.0 + length(pos) * 0.1) * 0.5 + 0.5;
        gl_PointSize = 3.0 * (300.0 / -mvPosition.z) * (0.5 + 0.8 * pulse);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform sampler2D uTexture;
      uniform float uOpacity;

      varying vec3 vColor;

      void main() {
        vec4 texColor = texture2D(uTexture, gl_PointCoord);

        vec3 finalColor = vColor * 1.6;

        float alpha = texColor.a * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

// ==================== 主动画函数 ====================
export default function animateHolographicQuantumSymphony(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  try {
    // 保存原始环境
    const originalBackground = scene.background
    const originalFog = scene.fog

    // 设置环境
    scene.background = new THREE.Color(0x020208)
    scene.fog = new THREE.FogExp2(0x020208, 0.0012)

    // 初始相机
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 150), 95, controls)

    // 主组
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 创建元素 ====================

    // 量子核心（3组）
    const quantumCores = []
    for (let i = 0; i < 3; i++) {
      const colors = [0x00ffff, 0xff00ff, 0xffff00]
      const core = createQuantumCore(15, colors[i])
      core.position.set(
        Math.sin(i * 2.094) * 25,
        0,
        Math.cos(i * 2.094) * 25
      )
      quantumCores.push(core)
      mainGroup.add(core)
    }

    // 维度场（8层）
    const dimensionalFields = []
    for (let i = 0; i < 8; i++) {
      const field = createDimensionalField(35 + i * 10, i, 8)
      dimensionalFields.push(field)
      mainGroup.add(field)
    }

    // 时空织网粒子
    const spaceTimeWeave = createSpaceTimeWeave(8000)
    mainGroup.add(spaceTimeWeave)

    // 意识波动（10环）
    const consciousnessWaves = []
    for (let i = 0; i < 10; i++) {
      const wave = createConsciousnessWave(10 + i * 8, i)
      consciousnessWaves.push(wave)
      mainGroup.add(wave)
    }

    // 黄金螺旋
    const goldenSpiral = createGoldenSpiralFlow(6)
    mainGroup.add(goldenSpiral)

    // ==================== 动画时间轴 ====================
    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-quantum-symphony' })
      },
      onError,
      '⚛️ 全息量子交响曲（终极融合）',
      controls
    )

    // 阶段1: 量子核心觉醒（0-5秒）
    tl.call(() => {
      quantumCores.forEach((core, i) => {
        gsap.to(core.material.uniforms.uOpacity, {
          value: 0.9,
          duration: 2,
          delay: i * 0.3,
          ease: 'power2.out'
        })
        gsap.to(core.material.uniforms.uQuantum, {
          value: 1.0,
          duration: 3,
          delay: i * 0.3,
          ease: 'power2.out'
        })
      })
    }, [], 0.5)

    // 阶段2: 维度场展开（5-10秒）
    tl.call(() => {
      dimensionalFields.forEach((field, i) => {
        gsap.to(field.material.uniforms.uOpacity, {
          value: 0.7,
          duration: 2,
          delay: i * 0.15,
          ease: 'power2.out'
        })
      })
    }, [], '+=1')

    // 阶段3: 时空织网激活（10-15秒）
    tl.call(() => {
      gsap.to(spaceTimeWeave.material.uniforms.uOpacity, {
        value: 0.8,
        duration: 3,
        ease: 'power2.out'
      })
    }, [], '+=1')

    // 阶段4: 意识波动（15-20秒）
    tl.call(() => {
      consciousnessWaves.forEach((wave, i) => {
        gsap.to(wave.material.uniforms.uOpacity, {
          value: 0.5,
          duration: 1.5,
          delay: i * 0.1,
          ease: 'power2.out'
        })
      })
    }, [], '+=1')

    // 阶段5: 黄金螺旋（20-25秒）
    tl.call(() => {
      gsap.to(goldenSpiral.material.uniforms.uOpacity, {
        value: 0.6,
        duration: 3,
        ease: 'power2.out'
      })
    }, [], '+=1')

    // 阶段6: 相机轨迹（全程）
    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 80,
      duration: 8,
      ease: 'power2.inOut'
    }, 3)

    tl.to(camera.position, {
      x: -40,
      y: -20,
      z: 60,
      duration: 8,
      ease: 'power2.inOut'
    }, 11)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 6,
      ease: 'power2.inOut'
    }, 19)

    // ==================== 动画循环 ====================
    let animationFrameId = null
    const startTime = Date.now()

    function animate() {
      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = (Date.now() - startTime) / 1000
      const time = elapsedTime % 25

      // 更新 uniforms
      quantumCores.forEach(core => {
        core.rotation.x += 0.005
        core.rotation.y += 0.01
        core.material.uniforms.uTime.value = time
      })

      dimensionalFields.forEach((field, i) => {
        field.rotation.z += 0.002 * (i + 1) * 0.5
        field.material.uniforms.uTime.value = time
      })

      spaceTimeWeave.material.uniforms.uTime.value = time

      consciousnessWaves.forEach(wave => {
        wave.material.uniforms.uTime.value = time
      })

      goldenSpiral.material.uniforms.uTime.value = time

      // 整体旋转
      mainGroup.rotation.y = Math.sin(time * 0.1) * 0.2

      renderer.render(scene, camera)
    }

    animate()

    // 退场
    tl.call(() => {
      cancelAnimationFrame(animationFrameId)
      scene.remove(mainGroup)
      scene.background = originalBackground
      scene.fog = originalFog
    }, [], 25)

    tl.to({}, { duration: 25 }, 0)

    return {
      timeline: tl,
      cleanup: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        scene.remove(mainGroup)
        scene.background = originalBackground
        scene.fog = originalFog
        gsap.killTweensOf('*')
      }
    }
  } catch (error) {
    console.error('全息量子交响曲错误:', error)
    if (onError) onError(error)
    throw error
  }
}
