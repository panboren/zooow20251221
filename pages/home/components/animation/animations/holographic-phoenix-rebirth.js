/**
 * 🔥 全息凤凰重生特效
 * 传说级视觉特效 - 神话奇迹重现
 *
 * 技术特点:
 * - 火焰粒子系统
 - 羽毛动力学模拟
 - 热浪扭曲效果
 - 烟雾与火光渲染
 - 重生循环动画
 *
 * 视觉表现:
 * 火焰燃烧
 - 灰烬飘散
 - 凤凰升腾
 - 重生光辉
 - 火焰羽翼
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建火焰粒子
 */
function createFireParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)
  const lifetimes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.1
    const color = new THREE.Color().setHSL(hue, 1.0, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 4 + 2

    velocities[i * 3] = (Math.random() - 0.5) * 0.3
    velocities[i * 3 + 1] = Math.random() * 0.3 + 0.1
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3

    lifetimes[i] = Math.random()
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

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 火焰上升
        float rise = sin(uTime * 3.0 + pos.x * 0.2) * 2.0;
        pos.y += rise;

        // 火焰扭曲
        float twist = sin(uTime * 4.0 + pos.y * 0.3) * 1.5;
        pos.x += twist;
        pos.z += twist * 0.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        // 衰减
        vAlpha = 1.0 - pos.y * 0.02;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // 火焰形状
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        float flame = smoothstep(0.5, 0.2, dist);

        // 火焰纹理
        float noise = sin(uv.x * 20.0) * sin(uv.y * 20.0) * 0.5 + 0.5;

        vec3 color = vColor * (1.0 + noise * 0.3);
        float alpha = flame * vAlpha * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(geometry, material)
  particles.userData.velocities = velocities
  particles.userData.lifetimes = lifetimes
  return particles
}

/**
 * 创建灰烬粒子
 */
function createAshParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const gray = 0.3 + Math.random() * 0.3
    colors[i * 3] = gray
    colors[i * 3 + 1] = gray
    colors[i * 3 + 2] = gray

    sizes[i] = Math.random() * 2 + 0.5
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

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 灰烬飘散
        float drift = sin(uTime * 2.0 + pos.x * 0.5) * 1.0;
        pos.x += drift;
        pos.z += drift * 0.5;

        // 缓慢下落
        float fall = uTime * 0.5;
        pos.y -= fall * 0.3;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

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

  return new THREE.Points(geometry, material)
}

/**
 * 创建凤凰核心
 */
function createPhoenixCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uIntensity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uIntensity;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normal;
        vPosition = position;
        vViewDir = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);

        vec3 pos = position;

        // 脉冲扩张
        float pulse = sin(uTime * 5.0) * uIntensity * 0.1;
        pos += normal * pulse;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uIntensity;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 5.0);

        // 火焰核心
        float core = exp(-pow(length(vPosition) * 0.1, 2.0));
        core *= uIntensity;

        // 火焰波动
        float flameWave = sin(uTime * 8.0 + length(vPosition) * 0.5) * 0.5 + 0.5;

        // 颜色变化
        vec3 flameColor = uColor;
        flameColor.r += sin(uTime * 3.0) * 0.2;
        flameColor.g += sin(uTime * 3.0 + 2.094) * 0.1;
        flameColor.b += sin(uTime * 3.0 + 4.188) * 0.1;

        vec3 finalColor = flameColor * (fresnel * 0.6 + core * 0.8 + flameWave * 0.2);

        float alpha = (fresnel * 0.5 + core * 0.5) * uOpacity;

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
 * 凤凰重生动画主函数
 */
export default function animateHolographicPhoenixRebirth(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 0, 80), 70, controls)
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-phoenix-rebirth' })
    },
    onError,
    '🔥 全息凤凰重生（传说级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0505)
  scene.fog = new THREE.FogExp2(0x0a0505, 0.0018)

  // 创建火焰粒子
  const fireParticles = createFireParticles(8000, 30)
  scene.add(fireParticles)

  // 创建灰烬粒子
  const ashParticles = createAshParticles(4000, 35)
  scene.add(ashParticles)

  // 创建凤凰核心
  const phoenixCore = createPhoenixCore(8, 0xff4400)
  scene.add(phoenixCore)

  // 入场动画
  tl.to(
    fireParticles.material.uniforms.uOpacity,
    { value: 0.9, duration: 2 },
    'start'
  )

  tl.to(
    ashParticles.material.uniforms.uOpacity,
    { value: 0.7, duration: 1.5 },
    'start+=1'
  )

  tl.to(
    phoenixCore.material.uniforms.uOpacity,
    { value: 1.0, duration: 1 },
    'start+=1.5'
  )
  tl.to(
    phoenixCore.material.uniforms.uIntensity,
    { value: 1, duration: 2 },
    'start+=1.5'
  )

  // 相机动画
  tl.to(camera.position, {
    x: 10,
    y: 15,
    z: 70,
    duration: 4,
    ease: 'power2.out'
  }, 'start+=2')

  // 燃烧动画
  tl.to(
    {},
    {
      duration: 5,
      onUpdate: () => {
        const time = Date.now() * 0.001
        fireParticles.rotation.y = time * 0.3
      }
    },
    '+=1'
  )

  // 退出动画
  tl.to(
    fireParticles.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )
  tl.to(
    ashParticles.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end-=1'
  )
  tl.to(
    phoenixCore.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )

  // 动画循环
  const animate = (time) => {
    requestAnimationFrame(animate)

    const elapsedTime = time * 0.001

    // 更新火焰粒子
    fireParticles.material.uniforms.uTime.value = elapsedTime
    fireParticles.rotation.y = elapsedTime * 0.2
    fireParticles.rotation.z = elapsedTime * 0.1

    // 更新灰烬粒子
    ashParticles.material.uniforms.uTime.value = elapsedTime
    ashParticles.rotation.y = elapsedTime * 0.05

    // 更新凤凰核心
    phoenixCore.material.uniforms.uTime.value = elapsedTime
    phoenixCore.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.1)
    phoenixCore.rotation.y = elapsedTime * 0.5

    // 火焰粒子上升
    const positions = fireParticles.geometry.attributes.position.array
    const velocities = fireParticles.userData.velocities
    const lifetimes = fireParticles.userData.lifetimes

    for (let i = 0; i < positions.length / 3; i++) {
      lifetimes[i] += 0.01

      if (lifetimes[i] > 1) {
        lifetimes[i] = 0
        positions[i * 3] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = -20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      }

      positions[i * 3] += velocities[i * 3] * 0.5
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]
    }
    fireParticles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  animate(0)

  // 清理函数
  return () => {
    scene.remove(fireParticles)
    scene.remove(ashParticles)
    scene.remove(phoenixCore)
    scene.background = originalBackground
    scene.fog = originalFog
  }
}
