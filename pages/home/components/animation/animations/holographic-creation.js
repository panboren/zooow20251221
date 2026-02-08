/**
 * 🌟 全息宇宙创世之光特效
 * 神话级视觉特效 - 创世神话重现
 *
 * 技术特点:
 * - 创世光束爆发
 * - 维度裂隙开启
 * - 星河诞生模拟
 * - 时空奇点可视化
 * - 原始能量喷发
 *
 * 视觉表现:
 * 创世之光束
 * 维度裂隙
 * 新生星河
 * 原始能量
 * 宇宙诞生瞬间
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建创世光束
 */
function createCreationBeams(count) {
  const group = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const height = 50 + Math.random() * 100
    const radius = 0.5 + Math.random() * 2

    const geometry = new THREE.CylinderGeometry(radius, radius * 2, height, 8, 1, true)
    const hue = Math.random() * 0.3 + 0.55
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setHSL(hue, 1.0, 0.6) },
        uOpacity: { value: 0 },
        uGrowth: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        precision highp int;

        uniform float uTime;
        uniform float uGrowth;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;

          vec3 pos = position;

          // 创世光束生长
          float growth = smoothstep(0.0, uGrowth, uv.y);
          pos.y *= growth;

          // 光束波动
          float wave = sin(uTime * 2.0 + pos.y * 0.1) * 0.5;
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
        uniform float uGrowth;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          // 能量流动
          float flow = sin(vUv.y * 20.0 - uTime * 5.0) * 0.5 + 0.5;

          // 光束发光
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)), 3.0);

          vec3 color = uColor * (flow + fresnel * 0.5) * 2.0;
          float alpha = (fresnel + flow * 0.5) * uOpacity * smoothstep(0.0, uGrowth, vUv.y);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const beam = new THREE.Mesh(geometry, material)
    beam.position.set(
      (Math.random() - 0.5) * 80,
      height / 2,
      (Math.random() - 0.5) * 80
    )
    beam.rotation.x = (Math.random() - 0.5) * 0.3
    beam.rotation.z = (Math.random() - 0.5) * 0.3
    group.add(beam)
  }

  return group
}

/**
 * 创建维度裂隙
 */
function createDimensionRifts(count, radius) {
  const group = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.RingGeometry(5, 15, 64)
    const hue = Math.random() * 0.4 + 0.6
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setHSL(hue, 1.0, 0.6) },
        uOpacity: { value: 0 },
        uRiftOpen: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        precision highp int;

        uniform float uTime;
        uniform float uRiftOpen;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;

          vec3 pos = position;

          // 裂隙开启
          float rift = smoothstep(0.0, uRiftOpen, 1.0 - length(pos.xy) / 15.0);
          pos.z *= rift;

          // 裂隙波动
          float wave = sin(uTime * 3.0 + length(pos) * 0.2) * 0.3;
          pos.z += wave;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        precision highp int;

        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uRiftOpen;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          // 裂隙波动
          float wave = sin(length(vPosition) * 2.0 - uTime * 4.0) * 0.5 + 0.5;

          // 裂隙边缘发光
          float dist = length(vUv - 0.5);
          float edge = smoothstep(0.5, 0.3, dist);

          vec3 color = uColor * (wave + edge * 0.5);
          float alpha = edge * wave * uOpacity * uRiftOpen;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const rift = new THREE.Mesh(geometry, material)
    const r = radius * (0.2 + Math.random() * 0.8)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    rift.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    )

    rift.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    group.add(rift)
  }

  return group
}

/**
 * 创建新生星河
 */
function createNewbornGalaxies(count, radius) {
  const group = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.SphereGeometry(1 + Math.random() * 3, 32, 32)
    const hue = Math.random()
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setHSL(hue, 0.8, 0.6) },
        uOpacity: { value: 0 },
        uBirth: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        precision highp int;

        uniform float uTime;
        uniform float uBirth;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          vec3 pos = position;

          // 星河诞生
          float birth = smoothstep(0.0, uBirth, 1.0);
          pos *= birth;

          // 星河旋转
          float angle = uTime * 0.5;
          float cosA = cos(angle);
          float sinA = sin(angle);
          vec3 temp = pos;
          pos.x = temp.x * cosA - temp.z * sinA;
          pos.z = temp.x * sinA + temp.z * cosA;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        precision highp int;

        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uBirth;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // 星核发光
          float glow = pow(1.0 - length(vPosition) / 3.0, 2.0);

          // 脉动效果
          float pulse = sin(uTime * 2.0) * 0.3 + 0.7;

          vec3 color = uColor * (glow + pulse * 0.5);
          float alpha = glow * pulse * uOpacity * uBirth;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const galaxy = new THREE.Mesh(geometry, material)
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    galaxy.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    )

    group.add(galaxy)
  }

  return group
}

/**
 * 创建时空奇点
 */
function createSingularity() {
  const geometry = new THREE.SphereGeometry(5, 64, 64)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: 0 },
      uIntensity: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uIntensity;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        vec3 pos = position;

        // 奇点脉动
        float pulse = sin(uTime * 5.0) * uIntensity * 0.3;
        pos *= (1.0 + pulse);

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

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        // 奇点光辉
        float glow = pow(1.0 - length(vPosition) / 5.0, 4.0);

        // 能量脉动
        float pulse = sin(uTime * 8.0) * 0.5 + 0.5;

        vec3 color = uColor * glow * (1.0 + pulse * uIntensity);
        float alpha = glow * (0.5 + pulse * 0.5 * uIntensity) * uOpacity;

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
 * 创建原始能量粒子
 */
function createPrimordialParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.pow(Math.random(), 0.3)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.5 + 0.5
    const color = new THREE.Color().setHSL(hue, 1.0, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 1 + Math.random() * 3

    velocities[i * 3] = (Math.random() - 0.5) * 2
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 2
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uBurst: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uBurst;

      attribute float size;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = position;

        // 爆发效果
        float burst = uBurst * (1.0 - smoothstep(0.0, 20.0, length(pos)));
        pos += normalize(pos) * burst * 20.0;

        // 粒子旋转
        float angle = uTime * 0.3;
        float cosA = cos(angle);
        float sinA = sin(angle);
        vec3 temp = pos;
        pos.x = temp.x * cosA - temp.z * sinA;
        pos.z = temp.x * sinA + temp.z * cosA;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z) * (0.5 + 0.5 * sin(uTime * 3.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;
      uniform float uBurst;

      varying vec3 vColor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 能量核心
        float core = smoothstep(0.5, 0.0, dist);

        // 闪烁效果
        float flicker = sin(uBurst * 10.0) * 0.3 + 0.7;

        float alpha = core * uOpacity * flicker;

        gl_FragColor = vec4(vColor * 1.5, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(geometry, material)
  return particles
}

/**
 * 主动画函数
 */
export default function animateHolographicCreation(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 50, 150), 120, controls)
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-creation' })
    },
    onError,
    '🌟 全息宇宙创世之光（神话级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x000205)
  scene.fog = new THREE.FogExp2(0x000205, 0.0008)

  // 创建时空奇点
  const singularity = createSingularity()
  scene.add(singularity)

  // 创建创世光束
  const creationBeams = createCreationBeams(30)
  scene.add(creationBeams)

  // 创建维度裂隙
  const dimensionRifts = createDimensionRifts(20, 100)
  scene.add(dimensionRifts)

  // 创建新生星河
  const newbornGalaxies = createNewbornGalaxies(100, 120)
  scene.add(newbornGalaxies)

  // 创建原始能量粒子
  const primordialParticles = createPrimordialParticles(10000, 150)
  scene.add(primordialParticles)

  let time = 0
  let animId = null

  function update() {
    time += 0.016

    // 更新奇点
    singularity.material.uniforms.uTime.value = time

    // 更新创世光束
    creationBeams.children.forEach(beam => {
      beam.material.uniforms.uTime.value = time
      beam.rotation.y += 0.005
    })

    // 更新维度裂隙
    dimensionRifts.children.forEach(rift => {
      rift.material.uniforms.uTime.value = time
      rift.rotation.z += 0.003
    })

    // 更新新生星河
    newbornGalaxies.children.forEach(galaxy => {
      galaxy.material.uniforms.uTime.value = time
    })

    // 更新原始能量粒子
    primordialParticles.material.uniforms.uTime.value = time
    primordialParticles.rotation.y += 0.002
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  // 入场动画
  gsap.to(singularity.material.uniforms.uOpacity, {
    value: 1,
    duration: 2,
    ease: 'power2.out'
  })

  gsap.to(singularity.material.uniforms.uIntensity, {
    value: 1,
    duration: 2,
    ease: 'power2.out'
  })

  gsap.to(primordialParticles.material.uniforms.uOpacity, {
    value: 0.8,
    duration: 2.5,
    ease: 'power2.out',
    delay: 0.5
  })

  gsap.to(primordialParticles.material.uniforms.uBurst, {
    value: 1,
    duration: 3,
    ease: 'power2.out',
    delay: 1
  })

  creationBeams.children.forEach((beam, i) => {
    gsap.to(beam.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 2,
      ease: 'power2.out',
      delay: 1 + i * 0.05
    })
    gsap.to(beam.material.uniforms.uGrowth, {
      value: 1,
      duration: 2.5,
      ease: 'power2.out',
      delay: 1 + i * 0.05
    })
  })

  dimensionRifts.children.forEach((rift, i) => {
    gsap.to(rift.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5 + i * 0.08
    })
    gsap.to(rift.material.uniforms.uRiftOpen, {
      value: 1,
      duration: 2.5,
      ease: 'power2.out',
      delay: 1.5 + i * 0.08
    })
  })

  newbornGalaxies.children.forEach((galaxy, i) => {
    gsap.to(galaxy.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 2,
      ease: 'power2.out',
      delay: 2 + i * 0.01
    })
    gsap.to(galaxy.material.uniforms.uBirth, {
      value: 1,
      duration: 3,
      ease: 'power2.out',
      delay: 2 + i * 0.01
    })
  })

  // 相机运动
  tl.to(camera.position, {
    x: 80,
    y: 60,
    z: 100,
    duration: 8,
    ease: 'power2.inOut'
  }, 0)

  tl.to(camera.position, {
    x: -80,
    y: -40,
    z: 120,
    duration: 8,
    ease: 'power2.inOut'
  }, 8)

  tl.to(camera.position, {
    x: 0,
    y: 0,
    z: 130,
    duration: 5,
    ease: 'power2.inOut'
  }, 16)

  animate()

  tl.to({}, { duration: 24 }, 0)

  // 退场动画
  tl.to({}, {
    duration: 2,
    onStart: () => {
      gsap.to(singularity.material.uniforms.uOpacity, { value: 0, duration: 1 })
      gsap.to(singularity.material.uniforms.uIntensity, { value: 0, duration: 1 })

      gsap.to(primordialParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })
      gsap.to(primordialParticles.material.uniforms.uBurst, { value: 0, duration: 1 })

      creationBeams.children.forEach(beam => {
        gsap.to(beam.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(beam.material.uniforms.uGrowth, { value: 0, duration: 1 })
      })

      dimensionRifts.children.forEach(rift => {
        gsap.to(rift.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(rift.material.uniforms.uRiftOpen, { value: 0, duration: 1 })
      })

      newbornGalaxies.children.forEach(galaxy => {
        gsap.to(galaxy.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(galaxy.material.uniforms.uBirth, { value: 0, duration: 1 })
      })
    },
    onComplete: () => {
      cancelAnimationFrame(animId)

      scene.remove(singularity)
      singularity.geometry.dispose()
      singularity.material.dispose()

      scene.remove(creationBeams)
      creationBeams.children.forEach(beam => {
        beam.geometry.dispose()
        beam.material.dispose()
      })

      scene.remove(dimensionRifts)
      dimensionRifts.children.forEach(rift => {
        rift.geometry.dispose()
        rift.material.dispose()
      })

      scene.remove(newbornGalaxies)
      newbornGalaxies.children.forEach(galaxy => {
        galaxy.geometry.dispose()
        galaxy.material.dispose()
      })

      scene.remove(primordialParticles)
      primordialParticles.geometry.dispose()
      primordialParticles.material.dispose()

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 24)

  return tl
}
