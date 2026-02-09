/**
 * 🌊 全息生物发光特效
 * 传说级视觉特效 - 自然奇迹重现
 *
 * 技术特点:
 * - 生物发光模拟
 * - 脉冲波动传播
 * - 有机形态变形
 * - 粒子群智能行为
 * - 动态光效渲染
 *
 * 视觉表现:
 * 发光海洋生物
 - 脉冲光波扩散
 - 有机流动形态
 - 生物粒子群
 - 深海光影效果
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建生物发光生物
 */
function createBioluminescentCreature(radius, color) {
  const geometry = new THREE.IcosahedronGeometry(radius, 32)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uPulse: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uPulse;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normal;
        vPosition = position;
        vViewDir = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);

        vec3 pos = position;

        // 脉冲变形
        float pulse = sin(uTime * 2.0 + pos.y * 0.5) * uPulse * 0.2;
        pos += normal * pulse;

        // 有机波动
        float organicWave = sin(pos.x * 0.3 + uTime * 1.5) * sin(pos.z * 0.3 + uTime * 1.8) * uPulse * 0.15;
        pos += normal * organicWave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPulse;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 生物发光脉冲
        float pulse = sin(uTime * 3.0 + length(vPosition) * 0.5) * 0.5 + 0.5;
        pulse *= uPulse;

        // 深度发光
        float depthGlow = 1.0 - length(vPosition) * 0.05;
        depthGlow = clamp(depthGlow, 0.0, 1.0);

        // 细胞纹理
        float cellular = sin(vPosition.x * 2.0) * sin(vPosition.y * 2.0) * sin(vPosition.z * 2.0);
        cellular = cellular * 0.5 + 0.5;

        // 颜色变化
        vec3 glowColor = uColor;
        glowColor.r += sin(uTime * 2.0) * 0.2;
        glowColor.g += sin(uTime * 2.0 + 2.094) * 0.2;
        glowColor.b += sin(uTime * 2.0 + 4.188) * 0.2;

        vec3 finalColor = glowColor * (fresnel * 0.6 + pulse * 0.3 + depthGlow * 0.4 + cellular * 0.2);

        float alpha = (fresnel * 0.5 + pulse * 0.3 + depthGlow * 0.4) * uOpacity;

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
 * 创建光波扩散
 */
function createLightWave(radius, color) {
  const geometry = new THREE.RingGeometry(0.1, radius, 128, 4)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uWaveSpeed: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uWaveSpeed;

      varying vec2 vUv;

      void main() {
        vUv = uv;

        vec3 pos = position;

        // 波浪起伏
        float wave = sin(length(pos.xz) * 0.2 - uTime * uWaveSpeed) * 2.0;
        pos.y += wave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;

      varying vec2 vUv;

      void main() {
        // 波纹效果
        float wave = sin(length(vUv - 0.5) * 20.0 - uTime * 5.0) * 0.5 + 0.5;

        // 边缘渐变
        float edge = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x)) *
                     smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));

        vec3 color = uColor * (wave + 0.3);

        float alpha = edge * (wave * 0.7 + 0.3) * uOpacity;

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
 * 创建光粒子群
 */
function createLightParticles(count, radius, color) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)

  const baseColor = new THREE.Color(color)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hueVariation = (Math.random() - 0.5) * 0.1
    const colorVariated = baseColor.clone().offsetHSL(hueVariation, 0, 0)
    colors[i * 3] = colorVariated.r
    colors[i * 3 + 1] = colorVariated.g
    colors[i * 3 + 2] = colorVariated.b

    sizes[i] = Math.random() * 3 + 1
    phases[i] = Math.random() * Math.PI * 2
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
      attribute float phase;
      attribute vec3 color;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vColor = color;
        vPhase = phase;

        vec3 pos = position;

        // 粒子波动
        float wave = sin(uTime * 3.0 + phase) * 2.0;
        pos += normalize(pos) * wave;

        // 有机运动
        float organic = sin(uTime * 2.0 + pos.x * 0.1) * cos(uTime * 2.5 + pos.z * 0.1);
        pos.y += organic * 1.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        // 圆形粒子
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.2, dist);

        // 脉冲闪烁
        float pulse = sin(uOpacity * 10.0 + vPhase) * 0.5 + 0.5;

        vec3 color = vColor * (1.0 + pulse * 0.5);
        gl_FragColor = vec4(color, alpha * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 生物发光动画主函数
 */
export default function animateHolographicBioluminescence(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 0, 100), 80, controls)
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-bioluminescence' })
    },
    onError,
    '🌊 全息生物发光（传说级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x000510)
  scene.fog = new THREE.FogExp2(0x000510, 0.0015)

  // 创建生物发光生物
  const creatures = []
  const creatureColors = [0x00ff88, 0x00ffaa, 0x00ffcc, 0x88ff00]
  for (let i = 0; i < 4; i++) {
    const creature = createBioluminescentCreature(8, creatureColors[i])
    creature.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    )
    scene.add(creature)
    creatures.push(creature)
  }

  // 创建光波
  const lightWaves = []
  for (let i = 0; i < 3; i++) {
    const wave = createLightWave(30 + i * 10, 0x00ff88)
    wave.position.y = -20 + i * 10
    scene.add(wave)
    lightWaves.push(wave)
  }

  // 创建光粒子
  const lightParticles = createLightParticles(6000, 60, 0x00ffaa)
  scene.add(lightParticles)

  // 入场动画
  creatures.forEach((creature, i) => {
    tl.to(
      creature.material.uniforms.uOpacity,
      { value: 0.9, duration: 1.5 },
      `start+=${i * 0.3}`
    )
    tl.to(
      creature.material.uniforms.uPulse,
      { value: 1, duration: 2 },
      `start+=${i * 0.3 + 0.5}`
    )
  })

  lightWaves.forEach((wave, i) => {
    tl.to(
      wave.material.uniforms.uOpacity,
      { value: 0.7, duration: 1.5 },
      `start+=${i * 0.2}`
    )
    tl.to(
      wave.material.uniforms.uWaveSpeed,
      { value: 3, duration: 2 },
      `start+=${i * 0.2 + 0.5}`
    )
  })

  tl.to(
    lightParticles.material.uniforms.uOpacity,
    { value: 0.8, duration: 1.5 },
    'start+=1'
  )

  // 相机动画
  tl.to(camera.position, {
    x: 20,
    y: 10,
    z: 80,
    duration: 4,
    ease: 'power2.out'
  }, 'start+=2')

  // 生物移动动画
  tl.to(
    {},
    {
      duration: 5,
      onUpdate: () => {
        const time = Date.now() * 0.001
        creatures.forEach((creature, i) => {
          creature.position.x = Math.sin(time * 0.5 + i) * 20
          creature.position.y = Math.cos(time * 0.3 + i * 0.5) * 15
        })
      }
    },
    '+=1'
  )

  // 退出动画
  tl.to(
    creatures.map(c => c.material.uniforms.uOpacity),
    { value: 0, duration: 2 },
    'end'
  )
  tl.to(
    lightWaves.map(w => w.material.uniforms.uOpacity),
    { value: 0, duration: 2 },
    'end-=1'
  )
  tl.to(
    lightParticles.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )

  // 动画循环
  const animate = (time) => {
    requestAnimationFrame(animate)

    const elapsedTime = time * 0.001

    // 更新生物
    creatures.forEach((creature, i) => {
      creature.material.uniforms.uTime.value = elapsedTime
      creature.position.x = Math.sin(elapsedTime * 0.3 + i) * 15
      creature.position.y = Math.cos(elapsedTime * 0.2 + i * 0.5) * 10
      creature.rotation.y = elapsedTime * 0.5
    })

    // 更新光波
    lightWaves.forEach((wave, i) => {
      wave.material.uniforms.uTime.value = elapsedTime
      wave.rotation.z = elapsedTime * 0.2 * (i + 1)
    })

    // 更新粒子
    lightParticles.material.uniforms.uTime.value = elapsedTime
    lightParticles.rotation.y = elapsedTime * 0.1

    renderer.render(scene, camera)
  }

  animate(0)

  // 清理函数
  return () => {
    creatures.forEach(c => scene.remove(c))
    lightWaves.forEach(w => scene.remove(w))
    scene.remove(lightParticles)
    scene.background = originalBackground
    scene.fog = originalFog
  }
}
