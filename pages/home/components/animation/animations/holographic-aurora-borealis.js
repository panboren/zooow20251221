/**
 * 🌌 全息极光特效
 * 传说级视觉特效 - 自然奇观重现
 *
 * 技术特点:
 * - 极光波段模拟
 * - 磁场线可视化
 * - 等离子体波动
 * - 天体大气层效果
 * - 动态光谱分析
 *
 * 视觉表现:
 * 多层极光帷幕
 * 磁场线流动
 * 等离子体波纹
 * 星空背景
 * 极光色彩变化
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建极光帷幕
 */
function createAuroraCurtain(width, height, color) {
  const geometry = new THREE.PlaneGeometry(width, height, 100, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uIntensity: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uIntensity;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;

        // 极光波动
        float wave1 = sin(pos.x * 0.5 + uTime * 2.0) * uIntensity * 10.0;
        float wave2 = sin(pos.x * 0.8 + uTime * 3.5) * uIntensity * 7.0;
        float wave3 = sin(pos.x * 1.2 + uTime * 4.8) * uIntensity * 5.0;
        
        pos.y += wave1 + wave2 + wave3;

        // 幅度调制
        float amplitude = sin(uTime * 1.5) * 0.5 + 0.5;
        pos.y *= (1.0 + amplitude * 0.3);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uIntensity;

      varying vec2 vUv;
      varying vec3 vPosition;

      // 伪随机函数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // 柏林噪声
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        // 极光波段
        float band1 = noise(vPosition.xy * 0.02 + vec2(uTime * 0.5, 0.0));
        float band2 = noise(vPosition.xy * 0.03 + vec2(uTime * 0.7, 0.0));
        float band3 = noise(vPosition.xy * 0.04 + vec2(uTime * 0.9, 0.0));

        float aurora = band1 * 0.4 + band2 * 0.3 + band3 * 0.3;

        // 垂直渐变
        float verticalGrad = smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));

        // 水平渐变
        float horizontalGrad = smoothstep(0.1, 0.4, vUv.x) * (1.0 - smoothstep(0.6, 0.9, vUv.x));

        // 色彩偏移
        vec3 colorOffset;
        colorOffset.r = sin(uTime * 0.5 + vUv.x * 3.14159) * 0.5 + 0.5;
        colorOffset.g = sin(uTime * 0.5 + vUv.x * 3.14159 + 2.094) * 0.5 + 0.5;
        colorOffset.b = sin(uTime * 0.5 + vUv.x * 3.14159 + 4.188) * 0.5 + 0.5;

        vec3 auroraColor = uColor * colorOffset;

        // 辉光效果
        float glow = aurora * uIntensity * 2.0;
        vec3 finalColor = auroraColor * (aurora + glow * 0.5);

        // 混合基础色
        finalColor = mix(vec3(0.0), finalColor, verticalGrad * horizontalGrad);

        float alpha = aurora * verticalGrad * horizontalGrad * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

/**
 * 创建星空背景
 */
function createStarField(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.55, 0.5, 0.8)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 2 + 1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;
        
        // 星星闪烁
        float twinkle = sin(uTime * 3.0 + position.x * 100.0) * 0.5 + 0.5;
        pos *= (1.0 + twinkle * 0.01);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;

      varying vec3 vColor;

      void main() {
        // 圆形粒子
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.3, dist);

        vec3 color = vColor;
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
 * 创建等离子体粒子
 */
function createPlasmaParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.3 + 0.5
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 3 + 1

    velocities[i * 3] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 1] = Math.random() * 0.1 + 0.05
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 等离子体运动
        float wave = sin(uTime * 2.0 + pos.x * 0.1) * cos(uTime * 1.5 + pos.z * 0.1);
        pos.y += wave * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;

      varying vec3 vColor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.2, dist);

        vec3 color = vColor;
        gl_FragColor = vec4(color, alpha * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(geometry, material)
  particles.userData.velocities = velocities
  return particles
}

/**
 * 极光动画主函数
 */
export default function animateHolographicAuroraBorealis(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 0, 150), 110, controls)
  camera.lookAt(0, 30, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-aurora-borealis' })
    },
    onError,
    '🌌 全息极光（传说级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0a1a)
  scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0008)

  // 创建星空
  const starField = createStarField(8000, 300)
  scene.add(starField)

  // 创建极光帷幕
  const auroraCurtains = []
  const colors = [0x00ff00, 0x00ffff, 0xff00ff, 0xffff00]
  for (let i = 0; i < 4; i++) {
    const curtain = createAuroraCurtain(100, 80, colors[i])
    curtain.position.y = 30 + i * 10
    curtain.position.z = -20 - i * 10
    scene.add(curtain)
    auroraCurtains.push(curtain)
  }

  // 创建等离子体粒子
  const plasmaParticles = createPlasmaParticles(5000, 80)
  scene.add(plasmaParticles)

  // 入场动画
  tl.to(
    starField.material.uniforms.uOpacity,
    { value: 1, duration: 2 },
    'start'
  )

  auroraCurtains.forEach((curtain, i) => {
    tl.to(
      curtain.material.uniforms.uOpacity,
      { value: 0.8, duration: 1.5 },
      `start+=${i * 0.3}`
    )
    tl.to(
      curtain.material.uniforms.uIntensity,
      { value: 1, duration: 2 },
      `start+=${i * 0.3 + 0.5}`
    )
  })

  tl.to(
    plasmaParticles.material.uniforms.uOpacity,
    { value: 0.7, duration: 1.5 },
    'start+=1.5'
  )

  // 相机动画
  tl.to(camera.position, {
    x: 0,
    y: 40,
    z: 120,
    duration: 4,
    ease: 'power2.out'
  }, 'start+=2')

  // 极光波动动画
  tl.to(
    {},
    {
      duration: 5,
      onUpdate: () => {
        const time = Date.now() * 0.001
        auroraCurtains.forEach((curtain, i) => {
          curtain.rotation.y = Math.sin(time * 0.5 + i) * 0.1
          curtain.rotation.x = Math.sin(time * 0.3 + i * 0.5) * 0.05
        })
      }
    },
    '+=1'
  )

  // 退出动画
  tl.to(
    auroraCurtains.map(c => c.material.uniforms.uOpacity),
    { value: 0, duration: 2 },
    'end'
  )
  tl.to(
    plasmaParticles.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )
  tl.to(
    starField.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end-=1'
  )

  // 动画循环
  const animate = (time) => {
    requestAnimationFrame(animate)

    const elapsedTime = time * 0.001

    // 更新星空
    starField.material.uniforms.uTime.value = elapsedTime
    starField.rotation.y = elapsedTime * 0.02

    // 更新极光帷幕
    auroraCurtains.forEach((curtain, i) => {
      curtain.material.uniforms.uTime.value = elapsedTime
      curtain.rotation.y = Math.sin(elapsedTime * 0.3 + i) * 0.15
    })

    // 更新等离子体粒子
    plasmaParticles.material.uniforms.uTime.value = elapsedTime
    const positions = plasmaParticles.geometry.attributes.position.array
    const velocities = plasmaParticles.userData.velocities

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      if (positions[i * 3 + 1] > 100) {
        positions[i * 3 + 1] = -40
      }
    }
    plasmaParticles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  animate(0)

  // 清理函数
  return () => {
    scene.remove(starField)
    scene.remove(plasmaParticles)
    auroraCurtains.forEach(c => scene.remove(c))
    scene.background = originalBackground
    scene.fog = originalFog
  }
}
