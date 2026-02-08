/**
 * 🌌 全息时空裂缝特效
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 维度撕裂效果
 * - 时空扭曲模拟
 * - 粒子穿越虫洞
 * - 重力透镜可视化
 * - 多层空间折叠
 *
 * 视觉表现:
 * 裂缝能量爆发
 * 粒子时空穿越
 * 频率共振波动
 * 维度碎片散落
 * 光子流喷发
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建时空裂缝核心
 */
function createNexusCore(radius, color) {
  const geometry = new THREE.TorusKnotGeometry(radius * 0.6, radius * 0.1, 200, 32, 2, 3)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uDistortion: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uDistortion;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;
        float distortion = sin(pos.x * 2.0 + uTime * 3.0) *
                         sin(pos.y * 2.0 + uTime * 2.5) *
                         sin(pos.z * 2.0 + uTime * 2.0) * uDistortion;
        pos += normal * distortion;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uDistortion;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);

        // 时空扭曲效果
        float distortion = sin(vPosition.x * 3.0 + uTime * 4.0) *
                          sin(vPosition.y * 3.0 + uTime * 3.5) *
                          sin(vPosition.z * 3.0 + uTime * 3.0);
        distortion = distortion * 0.5 + 0.5;

        // 维度光谱
        vec3 spectrum;
        spectrum.r = sin(uTime * 2.0 + 0.0) * 0.5 + 0.5;
        spectrum.g = sin(uTime * 2.0 + 2.094) * 0.5 + 0.5;
        spectrum.b = sin(uTime * 2.0 + 4.188) * 0.5 + 0.5;

        // 能量脉动
        float pulse = sin(uTime * 5.0) * 0.3 + 0.7;

        vec3 finalColor = mix(uColor, spectrum, fresnel * 0.5);
        finalColor += fresnel * pulse * 0.5;
        finalColor += distortion * uColor * 0.3;

        float alpha = (fresnel * 0.7 + distortion * 0.3) * uOpacity;

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
 * 创建裂缝能量环
 */
function createRiftEnergyRing(radius, segments, color) {
  const geometry = new THREE.TorusGeometry(radius, 0.5, 16, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 能量流动
        float energy = sin(vUv.x * 20.0 + uTime * 8.0) * 0.5 + 0.5;

        // 频率波动
        float freq = sin(vPosition.z * 2.0 + uTime * 3.0) * 0.5 + 0.5;

        // 发光边缘
        float glow = smoothstep(0.3, 0.5, abs(vUv.y - 0.5));

        vec3 color = uColor * (energy * 0.6 + freq * 0.3 + glow * 0.1);
        float alpha = (energy * 0.5 + glow * 0.5) * uOpacity;

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
 * 创建时空粒子流
 */
function createRiftParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)
  const lifetimes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * (0.1 + Math.random() * 0.9)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.3 + 0.5
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.5 + Math.random() * 1.5
    lifetimes[i] = Math.random()

    // 向外运动的速度
    velocities[i * 3] = positions[i * 3] * 0.02
    velocities[i * 3 + 1] = positions[i * 3 + 1] * 0.02
    velocities[i * 3 + 2] = positions[i * 3 + 2] * 0.02
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1))

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
      attribute float lifetime;

      varying vec3 vColor;
      varying float vLifetime;

      void main() {
        vColor = color;
        vLifetime = lifetime;

        vec3 pos = position;
        float spiral = sin(uTime * 2.0 + lifetime * 10.0) * 5.0;
        pos += normalize(pos) * spiral;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (400.0 / -mvPosition.z) * (0.5 + 0.5 * sin(uTime * 5.0 + lifetime * 20.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vLifetime;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 闪烁效果
        float flicker = sin(uTime * 10.0 + vLifetime * 50.0) * 0.3 + 0.7;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * flicker;
        gl_FragColor = vec4(vColor * 1.5, alpha);
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
export default function animateHolographicNexusRift(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 120), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-nexus-rift' })
      },
      onError,
      '🌌 全息时空裂缝（超越级VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x050510)
    scene.fog = new THREE.FogExp2(0x050510, 0.0015)

    // 创建裂缝核心
    const nexusCore = createNexusCore(20, 0x8a2be2)
    scene.add(nexusCore)

    // 创建能量环
    const energyRings = []
    for (let i = 0; i < 8; i++) {
      const radius = 30 + i * 12
      const hue = i / 8
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6).getHex()
      const ring = createRiftEnergyRing(radius, 100, color)
      ring.rotation.x = (Math.random() - 0.5) * 0.5
      ring.rotation.z = (Math.random() - 0.5) * 0.5
      scene.add(ring)
      energyRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.02 })
    }

    // 创建时空粒子
    const riftParticles = createRiftParticles(8000, 100)
    scene.add(riftParticles)

    // 创建维度碎片
    const dimensionFragments = []
    for (let i = 0; i < 200; i++) {
      const geometry = new THREE.TetrahedronGeometry(1 + Math.random() * 3, 0)
      const hue = Math.random()
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1.0, 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })

      const fragment = new THREE.Mesh(geometry, material)
      const r = 40 + Math.random() * 80
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      fragment.position.x = r * Math.sin(phi) * Math.cos(theta)
      fragment.position.y = r * Math.sin(phi) * Math.sin(theta)
      fragment.position.z = r * Math.cos(phi)

      fragment.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      scene.add(fragment)
      dimensionFragments.push({
        mesh: fragment,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.03,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.03
        },
        floatSpeed: Math.random() * 2
      })
    }

    // 创建重力透镜光晕
    const lensFlares = []
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.SphereGeometry(3 + i * 2, 32, 32)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(0.7 + i * 0.05, 1.0, 0.6) },
          uOpacity: { value: 0 }
        },
        vertexShader: `
          precision highp float;
          precision highp int;

          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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

          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
            vec3 color = uColor * fresnel;
            float alpha = fresnel * uOpacity * 0.5;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const flare = new THREE.Mesh(geometry, material)
      scene.add(flare)
      lensFlares.push({ mesh: flare, pulseSpeed: 2 + i * 0.5 })
    }

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新裂缝核心
      nexusCore.rotation.x += 0.01
      nexusCore.rotation.y += 0.015
      nexusCore.material.uniforms.uTime.value = time
      nexusCore.material.uniforms.uDistortion.value = 0.5 + 0.5 * Math.sin(time * 2)

      // 更新能量环
      energyRings.forEach((ring, i) => {
        ring.mesh.rotation.x += ring.rotSpeed
        ring.mesh.rotation.y += ring.rotSpeed * 1.5
        ring.mesh.rotation.z += ring.rotSpeed * 0.5
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.scale.setScalar(1 + 0.1 * Math.sin(time * 2 + i))
      })

      // 更新时空粒子
      riftParticles.material.uniforms.uTime.value = time
      riftParticles.rotation.y += 0.003
      riftParticles.rotation.x = Math.sin(time * 0.5) * 0.1

      // 更新维度碎片
      dimensionFragments.forEach((frag, i) => {
        frag.mesh.rotation.x += frag.rotSpeed.x
        frag.mesh.rotation.y += frag.rotSpeed.y
        frag.mesh.rotation.z += frag.rotSpeed.z

        const float = Math.sin(time * frag.floatSpeed + i) * 0.5
        frag.mesh.position.y += float * 0.02
      })

      // 更新重力透镜
      lensFlares.forEach((flare, i) => {
        const pulse = Math.sin(time * flare.pulseSpeed) * 0.5 + 0.5
        flare.mesh.scale.setScalar(1 + pulse * 0.3)
        flare.mesh.material.uniforms.uTime.value = time
        flare.mesh.material.uniforms.uOpacity.value = 0.3 + pulse * 0.2
      })
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(nexusCore.material.uniforms.uOpacity, {
      value: 0.9,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })

    gsap.to(nexusCore.material.uniforms.uDistortion, {
      value: 1,
      duration: 2.5,
      ease: 'power2.out'
    })

    energyRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.6,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.15
      })
    })

    gsap.to(riftParticles.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    dimensionFragments.forEach((frag, i) => {
      gsap.to(frag.mesh.material, {
        opacity: 0.7,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1 + i * 0.01
      })
    })

    lensFlares.forEach((flare, i) => {
      gsap.to(flare.mesh.material.uniforms.uOpacity, {
        value: 0.5,
        duration: 2,
        ease: 'power2.out',
        delay: 2 + i * 0.2
      })
    })

    // 相机运动
    tl.to(camera.position, {
      x: 50,
      y: 20,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -50,
      y: -10,
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

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(nexusCore.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(nexusCore.material.uniforms.uDistortion, { value: 0, duration: 1 })

        energyRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(riftParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })

        dimensionFragments.forEach(frag => {
          gsap.to(frag.mesh.material, { opacity: 0, duration: 1 })
        })

        lensFlares.forEach(flare => {
          gsap.to(flare.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(nexusCore)
        nexusCore.geometry.dispose()
        nexusCore.material.dispose()

        energyRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(riftParticles)
        riftParticles.geometry.dispose()
        riftParticles.material.dispose()

        dimensionFragments.forEach(frag => {
          scene.remove(frag.mesh)
          frag.mesh.geometry.dispose()
          frag.mesh.material.dispose()
        })

        lensFlares.forEach(flare => {
          scene.remove(flare.mesh)
          flare.mesh.geometry.dispose()
          flare.mesh.material.dispose()
        })

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
    console.error('全息时空裂缝动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
