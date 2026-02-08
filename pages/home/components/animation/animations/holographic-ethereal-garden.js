/**
 * 🌸 全息灵空花园特效
 * 传说级视觉特效 - 天界奇观重现
 *
 * 技术特点:
 * - 灵光粒子系统
 - 空灵花朵绽放
 - 光之藤蔓生长
 - 飞舞蝴蝶效果
 - 诗意氛围渲染
 *
 * 视觉表现:
 * 灵光花瓣
 - 光之藤蔓
 - 飞舞光蝶
 - 灵动光点
 - 天界氛围
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建灵光花瓣
 */
function createEtherealPetals(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const rotations = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.3 + 0.8
    const color = new THREE.Color().setHSL(hue, 0.7, 0.8)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 3 + 1

    rotations[i * 3] = Math.random() * Math.PI * 2
    rotations[i * 3 + 1] = Math.random() * Math.PI * 2
    rotations[i * 3 + 2] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 3))

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
      attribute vec3 rotation;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 花瓣飘落
        float fall = sin(uTime * 1.5 + pos.x * 0.3) * 1.5;
        pos.y += fall;

        // 花瓣旋转
        float angle = uTime * 0.8;
        vec3 rotatedPos = pos;
        float cosY = cos(angle * rotation.y);
        float sinY = sin(angle * rotation.y);
        vec3 temp = rotatedPos;
        rotatedPos.x = temp.x * cosY - temp.z * sinY;
        rotatedPos.z = temp.x * sinY + temp.z * cosY;

        // 花瓣波动
        float wave = sin(uTime * 2.0 + length(pos) * 0.2) * 2.0;
        pos.z += wave;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (250.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;

      varying vec3 vColor;

      void main() {
        // 花瓣形状
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        float petal = smoothstep(0.5, 0.2, dist);

        // 花瓣纹理
        float texture = sin(uv.x * 10.0) * sin(uv.y * 10.0) * 0.5 + 0.5;

        vec3 color = vColor * (1.0 + texture * 0.3);
        float alpha = petal * uOpacity;

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
 * 创建光之藤蔓
 */
function createLightVine(length, radius, color) {
  const geometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -20, 0),
      new THREE.Vector3(5, -10, 5),
      new THREE.Vector3(-5, 0, -5),
      new THREE.Vector3(3, 10, 3),
      new THREE.Vector3(0, 20, 0)
    ]),
    100,
    radius,
    16,
    false
  )

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uGrowth: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uGrowth;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vUv;

      void main() {
        vNormal = normal;
        vPosition = position;
        vUv = uv.x;

        vec3 pos = position;

        // 藤蔓生长
        float growth = smoothstep(0.0, uGrowth, uv.x);
        pos *= growth;

        // 藤蔓波动
        float wave = sin(uTime * 2.0 + pos.y * 0.5) * 0.5;
        pos.x += wave;
        pos.z += wave * 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vUv;

      void main() {
        // 光之流动
        float flow = sin(vUv * 10.0 - uTime * 3.0) * 0.5 + 0.5;

        // 发光效果
        float glow = sin(vUv * 3.14159) * 0.5 + 0.5;

        vec3 color = uColor * (flow + glow * 0.5);

        float alpha = (glow + flow * 0.5) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 创建光蝶
 */
function createLightButterflies(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.4 + 0.7
    const color = new THREE.Color().setHSL(hue, 0.9, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 2 + 1
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
      precision highp int;

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

        // 蝴蝶飞舞
        float fly = sin(uTime * 5.0 + phase) * 3.0;
        pos.x += fly;
        pos.y += fly * 0.5;

        // 蝴蝶上升
        float rise = sin(uTime * 2.0 + pos.x * 0.2) * 2.0;
        pos.y += rise;

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
      varying float vPhase;

      void main() {
        // 蝴蝶形状
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        float butterfly = smoothstep(0.5, 0.2, dist);

        // 翅膀纹理
        float wing = sin(uv.x * 20.0) * sin(uv.y * 20.0) * 0.5 + 0.5;

        vec3 color = vColor * (1.0 + wing * 0.4);
        float alpha = butterfly * uOpacity;

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
 * 灵空花园动画主函数
 */
export default function animateHolographicEtherealGarden(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 5, 70), 65, controls)
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-ethereal-garden' })
    },
    onError,
    '🌸 全息灵空花园（传说级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0510)
  scene.fog = new THREE.FogExp2(0x0a0510, 0.001)

  // 创建灵光花瓣
  const etherealPetals = createEtherealPetals(6000, 40)
  scene.add(etherealPetals)

  // 创建光之藤蔓
  const lightVines = []
  const vineColors = [0xff88ff, 0xffccff, 0xffaaff, 0xffddff]
  for (let i = 0; i < 4; i++) {
    const vine = createLightVine(40, 0.3, vineColors[i])
    vine.position.set(
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30
    )
    vine.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    scene.add(vine)
    lightVines.push(vine)
  }

  // 创建光蝶
  const lightButterflies = createLightButterflies(3000, 35)
  scene.add(lightButterflies)

  // 入场动画
  tl.to(
    etherealPetals.material.uniforms.uOpacity,
    { value: 0.8, duration: 2 },
    'start'
  )

  lightVines.forEach((vine, i) => {
    tl.to(
      vine.material.uniforms.uOpacity,
      { value: 0.7, duration: 1.5 },
      `start+=${i * 0.3}`
    )
    tl.to(
      vine.material.uniforms.uGrowth,
      { value: 1, duration: 2.5 },
      `start+=${i * 0.3 + 0.5}`
    )
  })

  tl.to(
    lightButterflies.material.uniforms.uOpacity,
    { value: 0.9, duration: 1.5 },
    'start+=1.5'
  )

  // 相机动画
  tl.to(camera.position, {
    x: 10,
    y: 15,
    z: 60,
    duration: 4,
    ease: 'power2.out'
  }, 'start+=2')

  // 飞舞动画
  tl.to(
    {},
    {
      duration: 5,
      onUpdate: () => {
        const time = Date.now() * 0.001
        etherealPetals.rotation.y = time * 0.15
        lightButterflies.rotation.y = time * 0.25
      }
    },
    '+=1'
  )

  // 退出动画
  tl.to(
    etherealPetals.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )
  tl.to(
    lightVines.map(v => v.material.uniforms.uOpacity),
    { value: 0, duration: 2 },
    'end-=1'
  )
  tl.to(
    lightButterflies.material.uniforms.uOpacity,
    { value: 0, duration: 2 },
    'end'
  )

  // 动画循环
  const animate = (time) => {
    requestAnimationFrame(animate)

    const elapsedTime = time * 0.001

    // 更新花瓣
    etherealPetals.material.uniforms.uTime.value = elapsedTime
    etherealPetals.rotation.y = elapsedTime * 0.1
    etherealPetals.rotation.z = elapsedTime * 0.05

    // 更新藤蔓
    lightVines.forEach((vine, i) => {
      vine.material.uniforms.uTime.value = elapsedTime
      vine.rotation.y = elapsedTime * 0.2 + i * 0.5
    })

    // 更新光蝶
    lightButterflies.material.uniforms.uTime.value = elapsedTime
    lightButterflies.rotation.y = elapsedTime * 0.15
    lightButterflies.position.y = Math.sin(elapsedTime * 0.5) * 5

    renderer.render(scene, camera)
  }

  animate(0)

  // 清理函数
  return () => {
    scene.remove(etherealPetals)
    lightVines.forEach(v => scene.remove(v))
    scene.remove(lightButterflies)
    scene.background = originalBackground
    scene.fog = originalFog
  }
}
