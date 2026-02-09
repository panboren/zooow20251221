/**
 * 🐲 全息神龙觉醒特效
 * 神话级视觉特效 - 东方神龙再现
 *
 * 技术特点:
 * - 神龙身躯建模
 * - 龙鳞动态光效
 * - 龙焰粒子系统
 * - 神云缭绕效果
 * - 觉醒能量爆发
 *
 * 视觉表现:
 * 神龙游动
 * 龙鳞流光
 * 龙焰喷射
 * 神云飘逸
 * 觉醒之光
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建神龙身躯
 */
function createDragonBody() {
  const group = new THREE.Group()
  const segments = 30
  const radius = 3

  for (let i = 0; i < segments; i++) {
    const geometry = new THREE.SphereGeometry(radius * (1 - i * 0.02), 32, 32)
    const hue = 0.1 + i * 0.01
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setHSL(hue, 0.9, 0.6) },
        uOpacity: { value: 0 },
        uAwakening: { value: 0 }
      },
      vertexShader: `
        precision highp float;

        uniform float uTime;
        uniform float uAwakening;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;

          vec3 pos = position;

          // 觉醒脉动
          float pulse = sin(uTime * 3.0 + length(pos) * 0.5) * uAwakening * 0.3;
          pos += normal * pulse;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uAwakening;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          // 龙鳞光效
          float scale = sin(vUv.y * 50.0 + uTime * 2.0) * 0.5 + 0.5;
          float scales = step(0.5, fract(vUv.y * 30.0));
          scales *= scale;

          // 觉醒光辉
          float glow = sin(uTime * 4.0) * 0.3 + 0.7;
          glow *= uAwakening;

          vec3 color = uColor * (1.0 + scales * 0.5 + glow * 0.3);
          float alpha = (0.6 + scales * 0.2 + glow * 0.2) * uOpacity;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const segment = new THREE.Mesh(geometry, material)
    const t = i / segments
    const angle = t * Math.PI * 4
    segment.position.set(
      Math.sin(angle) * 20,
      t * 80 - 40,
      Math.cos(angle) * 10
    )
    group.add(segment)
  }

  return group
}

/**
 * 创建龙焰
 */
function createDragonFlames(count) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const lifetimes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const r = Math.random() * 15

    positions[i * 3] = r * Math.cos(theta)
    positions[i * 3 + 1] = Math.random() * 60 - 30
    positions[i * 3 + 2] = r * Math.sin(theta)

    const hue = Math.random() * 0.1 + 0.05
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 2 + Math.random() * 3
    lifetimes[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uBurst: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uBurst;

      attribute float size;
      attribute vec3 color;
      attribute float lifetime;

      varying vec3 vColor;
      varying float vLifetime;

      void main() {
        vColor = color;
        vLifetime = lifetime;

        vec3 pos = position;

        // 火焰喷射
        float flame = sin(uTime * 5.0 + lifetime * 20.0) * uBurst * 10.0;
        pos.y += flame;
        pos.x += flame * 0.3;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * (0.5 + 0.5 * sin(uTime * 8.0 + lifetime * 30.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;
      uniform float uBurst;

      varying vec3 vColor;
      varying float vLifetime;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 火焰形状
        float flame = smoothstep(0.5, 0.2, dist);

        // 火焰闪烁
        float flicker = sin(uBurst * 15.0 + vLifetime * 50.0) * 0.4 + 0.6;

        float alpha = flame * flicker * uOpacity;

        gl_FragColor = vec4(vColor * 1.8, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 创建神云
 */
function createDivineClouds(count, radius) {
  const group = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const geometry = new THREE.SphereGeometry(5 + Math.random() * 10, 32, 32)
    const hue = Math.random() * 0.1 + 0.05
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setHSL(hue, 0.8, 0.7) },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        precision highp float;

        uniform float uTime;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          vec3 pos = position;

          // 云朵飘动
          float drift = sin(uTime * 0.5 + vPosition.x * 0.1) * 2.0;
          pos.x += drift;
          pos.z += drift * 0.5;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // 云朵纹理
          float noise = sin(vPosition.x * 0.5 + uTime) * sin(vPosition.y * 0.5 + uTime) * sin(vPosition.z * 0.5 + uTime);
          noise = noise * 0.5 + 0.5;

          // 云朵柔和
          float soft = smoothstep(0.0, 1.0, noise);

          vec3 color = uColor * (0.6 + soft * 0.4);
          float alpha = soft * uOpacity * 0.4;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const cloud = new THREE.Mesh(geometry, material)
    const r = radius * (0.3 + Math.random() * 0.7)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    cloud.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) + 30,
      r * Math.cos(phi)
    )

    group.add(cloud)
  }

  return group
}

/**
 * 创建觉醒之光
 */
function createAwakeningLight() {
  const geometry = new THREE.CylinderGeometry(1, 50, 200, 64, 1, true)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uIntensity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uIntensity;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;

        // 光柱脉动
        float pulse = sin(uTime * 2.0 + vUv.y * 10.0) * uIntensity * 0.5;
        pos.x += pulse;
        pos.z += pulse;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uIntensity;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 光柱流动
        float flow = sin(vUv.y * 20.0 - uTime * 3.0) * 0.5 + 0.5;

        // 光辉效果
        float glow = sin(vUv.y * 3.14159) * uIntensity * 0.5 + 0.5;

        vec3 color = vec3(1.0, 0.9, 0.5) * (flow + glow * 0.5);
        float alpha = glow * flow * uOpacity;

        gl_FragColor = vec4(color, alpha);
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
 * 主动画函数
 */
export default function animateHolographicDragonAwakening(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 0, 100), 90, controls)
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-dragon-awakening' })
    },
    onError,
    '🐲 全息神龙觉醒（神话级VFX）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0205)
  scene.fog = new THREE.FogExp2(0x0a0205, 0.001)

  // 创建神龙身躯
  const dragonBody = createDragonBody()
  scene.add(dragonBody)

  // 创建龙焰
  const dragonFlames = createDragonFlames(5000)
  scene.add(dragonFlames)

  // 创建神云
  const divineClouds = createDivineClouds(20, 80)
  scene.add(divineClouds)

  // 创建觉醒之光
  const awakeningLight = createAwakeningLight()
  scene.add(awakeningLight)

  let time = 0
  let animId = null

  function update() {
    time += 0.016

    // 更新神龙身躯
    dragonBody.children.forEach((segment, i) => {
      segment.material.uniforms.uTime.value = time
      const t = i / dragonBody.children.length
      const angle = t * Math.PI * 4 + time * 0.3
      segment.position.x = Math.sin(angle) * 20
      segment.position.z = Math.cos(angle) * 10
    })

    // 更新龙焰
    dragonFlames.material.uniforms.uTime.value = time
    dragonFlames.rotation.y += 0.003

    // 更新神云
    divineClouds.children.forEach(cloud => {
      cloud.material.uniforms.uTime.value = time
    })
    divineClouds.rotation.y += 0.001

    // 更新觉醒之光
    awakeningLight.material.uniforms.uTime.value = time
  }

  function animate() {
    update()
    animId = requestAnimationFrame(animate)
  }

  // 入场动画
  dragonBody.children.forEach((segment, i) => {
    gsap.to(segment.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 2,
      ease: 'power2.out',
      delay: i * 0.05
    })
    gsap.to(segment.material.uniforms.uAwakening, {
      value: 1,
      duration: 3,
      ease: 'power2.out',
      delay: 2 + i * 0.05
    })
  })

  gsap.to(dragonFlames.material.uniforms.uOpacity, {
    value: 0.9,
    duration: 2.5,
    ease: 'power2.out',
    delay: 1
  })

  gsap.to(dragonFlames.material.uniforms.uBurst, {
    value: 1,
    duration: 3,
    ease: 'power2.out',
    delay: 2
  })

  divineClouds.children.forEach((cloud, i) => {
    gsap.to(cloud.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5 + i * 0.1
    })
  })

  gsap.to(awakeningLight.material.uniforms.uOpacity, {
    value: 0.8,
    duration: 2.5,
    ease: 'power2.out',
    delay: 3
  })

  gsap.to(awakeningLight.material.uniforms.uIntensity, {
    value: 1,
    duration: 3,
    ease: 'power2.out',
    delay: 3
  })

  // 相机运动
  tl.to(camera.position, {
    x: 40,
    y: 30,
    z: 80,
    duration: 6,
    ease: 'power2.inOut'
  }, 0)

  tl.to(camera.position, {
    x: -40,
    y: -20,
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

  tl.to({}, { duration: 20 }, 0)

  // 退场动画
  tl.to({}, {
    duration: 2,
    onStart: () => {
      gsap.to(awakeningLight.material.uniforms.uOpacity, { value: 0, duration: 1 })
      gsap.to(awakeningLight.material.uniforms.uIntensity, { value: 0, duration: 1 })

      dragonBody.children.forEach(segment => {
        gsap.to(segment.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(segment.material.uniforms.uAwakening, { value: 0, duration: 1 })
      })

      gsap.to(dragonFlames.material.uniforms.uOpacity, { value: 0, duration: 1 })
      gsap.to(dragonFlames.material.uniforms.uBurst, { value: 0, duration: 1 })

      divineClouds.children.forEach(cloud => {
        gsap.to(cloud.material.uniforms.uOpacity, { value: 0, duration: 1 })
      })
    },
    onComplete: () => {
      cancelAnimationFrame(animId)

      scene.remove(awakeningLight)
      awakeningLight.geometry.dispose()
      awakeningLight.material.dispose()

      scene.remove(dragonBody)
      dragonBody.children.forEach(segment => {
        segment.geometry.dispose()
        segment.material.dispose()
      })

      scene.remove(dragonFlames)
      dragonFlames.geometry.dispose()
      dragonFlames.material.dispose()

      scene.remove(divineClouds)
      divineClouds.children.forEach(cloud => {
        cloud.geometry.dispose()
        cloud.material.dispose()
      })

      scene.background = originalBackground
      if (originalFog) {
        scene.fog = originalFog
      } else {
        scene.fog = null
      }
    }
  }, 20)

  return tl
}
