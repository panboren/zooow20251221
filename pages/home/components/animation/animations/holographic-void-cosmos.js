/**
 * 🌌 全息虚空宇宙特效
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 虚空物质模拟
 * - 黑洞视界表现
 * - 吸积盘粒子
 * - 引力透镜效果
 * - 奇点发光
 *
 * 视觉表现:
 * 事件视界膨胀
 * 物质吸积旋转
 * 光子球发光
 * 引力波涟漪
 * 虚空能量流动
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建黑洞核心(事件视界)
 */
function createBlackHoleCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uEventHorizon: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uEventHorizon;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;
        float distortion = uEventHorizon * sin(pos.x * 3.0 + uTime * 4.0) *
                                         sin(pos.y * 3.0 + uTime * 3.5) * 0.1;
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
      uniform float uEventHorizon;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 5.0);

        // 引力扭曲
        float gravity = sin(distance(vPosition, vec3(0.0)) * 0.5 - uTime * 3.0) * 0.5 + 0.5;

        // 事件视界边缘
        float horizonEdge = smoothstep(0.95, 1.0, length(vPosition) / 15.0);

        // 奇点能量
        float singularity = exp(-pow(distance(vPosition, vec3(0.0)) * 0.1, 2.0));

        // 吸积盘辉光
        float accretionGlow = sin(vPosition.x * 2.0 + uTime * 5.0) *
                             sin(vPosition.z * 2.0 + uTime * 4.5) * 0.5 + 0.5;

        // 虚空色彩
        vec3 voidColor;
        voidColor.r = sin(uTime * 1.5 + 0.0) * 0.5 + 0.5;
        voidColor.g = sin(uTime * 1.5 + 2.094) * 0.5 + 0.5;
        voidColor.b = sin(uTime * 1.5 + 4.188) * 0.5 + 0.5;

        vec3 finalColor = mix(uColor, voidColor, fresnel * 0.3);
        finalColor += gravity * uColor * 0.2;
        finalColor += horizonEdge * uColor * 0.3;
        finalColor += singularity * uColor * 0.5;
        finalColor += accretionGlow * uColor * 0.1;

        float alpha = (fresnel * 0.6 + gravity * 0.2 + singularity * 0.2) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

/**
 * 创建吸积盘
 */
function createAccretionDisk(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 50)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uRotation: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uRotation;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        float spiral = sin(atan(pos.z, pos.x) * 4.0 + uTime * 3.0) * uRotation * 2.0;
        pos.y += spiral;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uRotation;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 距离中心的距离
        float dist = length(vPosition.xz);

        // 旋转速度(内圈快外圈慢)
        float angularVelocity = 1.0 / dist;
        float angle = atan(vPosition.z, vPosition.x) + uTime * angularVelocity * 5.0;

        // 物质密度
        float density = sin(angle * 8.0) * sin(angle * 12.0) * 0.5 + 0.5;

        // 温度(内圈热外圈冷)
        float temperature = smoothstep(outerRadius, innerRadius, dist);

        // 多普勒效应
        float doppler = sin(angle) * 0.5 + 0.5;

        // 热辐射颜色
        vec3 thermalColor;
        thermalColor.r = 1.0;
        thermalColor.g = 1.0 - temperature * 0.5;
        thermalColor.b = 1.0 - temperature * 0.8;

        vec3 color = mix(uColor, thermalColor, temperature * 0.6);
        color *= (density * 0.5 + doppler * 0.3 + temperature * 0.2);

        // 螺旋臂
        float spiralArm = sin(angle * 3.0 - log(dist) * 5.0 + uTime * 2.0) * 0.5 + 0.5;
        color *= (0.3 + spiralArm * 0.7);

        float alpha = (density * 0.4 + doppler * 0.3 + temperature * 0.3) * uOpacity;

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
 * 创建吸积粒子
 */
function createAccretionParticles(count, innerRadius, outerRadius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const r = innerRadius + Math.random() * (outerRadius - innerRadius)
    const theta = Math.random() * Math.PI * 2
    const verticalSpread = (Math.random() - 0.5) * 4

    positions[i * 3] = r * Math.cos(theta)
    positions[i * 3 + 1] = verticalSpread
    positions[i * 3 + 2] = r * Math.sin(theta)

    // 距离中心越近,颜色越亮(温度越高)
    const temperature = 1.0 - (r - innerRadius) / (outerRadius - innerRadius)
    const hue = 0.0 + temperature * 0.15
    const color = new THREE.Color().setHSL(hue, 1.0, 0.5 + temperature * 0.3)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.3 + Math.random() * 0.7
    velocities[i] = 0.5 + Math.random() * 1.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1))

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
      attribute float velocity;

      varying vec3 vColor;
      varying float vVelocity;

      void main() {
        vColor = color;
        vVelocity = velocity;

        vec3 pos = position;

        // 轨道运动
        float dist = length(pos.xz);
        float angularVelocity = velocity / dist;
        float angle = uTime * angularVelocity;

        float cosAngle = cos(angle);
        float sinAngle = sin(angle);

        vec3 orbitPos;
        orbitPos.x = pos.x * cosAngle - pos.z * sinAngle;
        orbitPos.z = pos.x * sinAngle + pos.z * cosAngle;
        orbitPos.y = pos.y;

        // 引力吸引
        float gravity = 1.0 - exp(-pow(dist * 0.1, 2.0)) * 0.3;
        orbitPos.y *= gravity;

        vec4 mvPosition = modelViewMatrix * vec4(orbitPos, 1.0);
        gl_PointSize = size * (600.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vVelocity;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 相对论亮度增强
        float relativistic = 1.0 + vVelocity * 0.5;

        // 多普勒频移闪烁
        float doppler = sin(uOpacity * 8.0 + vVelocity * 10.0) * 0.1 + 0.9;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * relativistic * doppler;
        gl_FragColor = vec4(vColor * 1.4, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 创建引力波涟漪
 */
function createGravitationalWaves(radius, segments, color) {
  const geometry = new THREE.RingGeometry(radius, radius + 1, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uWavePhase: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uWavePhase;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uWavePhase;

      varying vec2 vUv;

      void main() {
        // 引力波传播
        float wave = sin(length(vUv - 0.5) * 20.0 - uTime * 8.0 + uWavePhase);

        // 空间扭曲强度
        float distortion = abs(wave);

        // 引力波颜色偏移
        vec3 waveColor = uColor * distortion;

        float alpha = distortion * uOpacity * 0.15;

        gl_FragColor = vec4(waveColor, alpha);
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
 * 主动画函数
 */
export default function animateHolographicVoidCosmos(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 130), 95, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-void-cosmos' })
      },
      onError,
      '🌌 全息虚空宇宙（超越级VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.FogExp2(0x000000, 0.0012)

    // 创建黑洞核心
    const blackHoleCore = createBlackHoleCore(15, 0x1a0033)
    scene.add(blackHoleCore)

    // 创建吸积盘
    const accretionDisks = []
    for (let i = 0; i < 3; i++) {
      const innerRadius = 18 + i * 12
      const outerRadius = 28 + i * 15
      const hue = 0.05 + i * 0.02
      const color = new THREE.Color().setHSL(hue, 1.0, 0.5).getHex()
      const disk = createAccretionDisk(innerRadius, outerRadius, 200, color)
      disk.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.1 : -0.1)
      scene.add(disk)
      accretionDisks.push({
        mesh: disk,
        rotSpeed: 0.3 + i * 0.1
      })
    }

    // 创建吸积粒子
    const accretionParticles = createAccretionParticles(10000, 18, 75)
    scene.add(accretionParticles)

    // 创建引力波
    const gravitationalWaves = []
    for (let i = 0; i < 6; i++) {
      const radius = 30 + i * 15
      const color = new THREE.Color().setHSL(0.1, 1.0, 0.6).getHex()
      const wave = createGravitationalWaves(radius, 128, color)
      scene.add(wave)
      gravitationalWaves.push({
        mesh: wave,
        phase: i * 0.5
      })
    }

    // 创建光子球
    const photonSphereRadius = 16.5
    const photonSphereGeometry = new THREE.SphereGeometry(photonSphereRadius, 64, 64)
    const photonSphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffaa00) },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        precision highp int;

        varying vec3 vNormal;

        void main() {
          vNormal = normalize(normalMatrix * normal);
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

        void main() {
          // 光子球发光
          float photonGlow = sin(uTime * 6.0) * 0.3 + 0.7;

          vec3 color = uColor * photonGlow;
          float alpha = 0.1 * uOpacity * photonGlow;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const photonSphere = new THREE.Mesh(photonSphereGeometry, photonSphereMaterial)
    scene.add(photonSphere)

    // 创建虚空粒子
    const voidParticles = createAccretionParticles(5000, 80, 120)
    voidParticles.material.uniforms.uOpacity.value = 0
    scene.add(voidParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新黑洞核心
      blackHoleCore.material.uniforms.uTime.value = time
      blackHoleCore.material.uniforms.uEventHorizon.value = 0.5 + 0.5 * Math.sin(time * 1.5)

      // 更新吸积盘
      accretionDisks.forEach((disk, i) => {
        disk.mesh.material.uniforms.uTime.value = time
        disk.mesh.material.uniforms.uRotation.value = 0.6 + 0.4 * Math.sin(time * 0.5 + i)
      })

      // 更新吸积粒子
      accretionParticles.material.uniforms.uTime.value = time

      // 更新引力波
      gravitationalWaves.forEach((wave, i) => {
        wave.mesh.material.uniforms.uTime.value = time
        wave.mesh.material.uniforms.uWavePhase.value = wave.phase
        const pulse = 0.8 + 0.2 * Math.sin(time * 1.2 + wave.phase)
        wave.mesh.scale.setScalar(pulse)
      })

      // 更新光子球
      photonSphere.material.uniforms.uTime.value = time

      // 更新虚空粒子
      voidParticles.material.uniforms.uTime.value = time
      voidParticles.rotation.y += 0.001
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(blackHoleCore.material.uniforms.uOpacity, {
      value: 1.0,
      duration: 2,
      ease: 'power2.out'
    })

    gsap.to(blackHoleCore.material.uniforms.uEventHorizon, {
      value: 1.0,
      duration: 3,
      ease: 'power2.out'
    })

    accretionDisks.forEach((disk, i) => {
      gsap.to(disk.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.3
      })
    })

    gsap.to(accretionParticles.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    gravitationalWaves.forEach((wave, i) => {
      gsap.to(wave.mesh.material.uniforms.uOpacity, {
        value: 0.4,
        duration: 2,
        ease: 'power2.out',
        delay: 1 + i * 0.2
      })
    })

    gsap.to(photonSphere.material.uniforms.uOpacity, {
      value: 0.6,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5
    })

    gsap.to(voidParticles.material.uniforms.uOpacity, {
      value: 0.3,
      duration: 3,
      ease: 'power2.out',
      delay: 2
    })

    // 相机运动
    tl.to(camera.position, {
      x: 50,
      y: 15,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -50,
      y: -5,
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
        gsap.to(blackHoleCore.material.uniforms.uOpacity, { value: 0, duration: 1 })

        accretionDisks.forEach(disk => {
          gsap.to(disk.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(accretionParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })

        gravitationalWaves.forEach(wave => {
          gsap.to(wave.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(photonSphere.material.uniforms.uOpacity, { value: 0, duration: 1 })

        gsap.to(voidParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(blackHoleCore)
        blackHoleCore.geometry.dispose()
        blackHoleCore.material.dispose()

        accretionDisks.forEach(disk => {
          scene.remove(disk.mesh)
          disk.mesh.geometry.dispose()
          disk.mesh.material.dispose()
        })

        scene.remove(accretionParticles)
        accretionParticles.geometry.dispose()
        accretionParticles.material.dispose()

        gravitationalWaves.forEach(wave => {
          scene.remove(wave.mesh)
          wave.mesh.geometry.dispose()
          wave.mesh.material.dispose()
        })

        scene.remove(photonSphere)
        photonSphere.geometry.dispose()
        photonSphere.material.dispose()

        scene.remove(voidParticles)
        voidParticles.geometry.dispose()
        voidParticles.material.dispose()

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
    console.error('全息虚空宇宙动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
