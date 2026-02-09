/**
 * ⚛️ 全息量子涨落特效
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 量子涨落模拟
 * - 波函数坍缩动画
 * - 量子纠缠可视化
 * - 叠加态表现
 * - 观察者效应
 *
 * 视觉表现:
 * 量子云波动
 * 概率分布图
 * 纠缠粒子对
 * 波包干涉
 * 测量塌缩
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建量子云
 */
function createQuantumCloud(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uTurbulence: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uTurbulence;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      // 噪声函数
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
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

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;
        float noise = snoise(vec3(pos.x * 0.5 + uTime, pos.y * 0.5, pos.z * 0.5 + uTime * 0.5));
        pos += normal * noise * uTurbulence * 10.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTurbulence;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 量子概率波
        float probability = sin(vPosition.x * 3.0 + uTime * 2.0) *
                          sin(vPosition.y * 3.0 + uTime * 2.5) *
                          sin(vPosition.z * 3.0 + uTime * 2.0);
        probability = probability * 0.5 + 0.5;

        // 波函数干涉
        float interference = sin(distance(vPosition, vec3(0.0)) * 2.0 - uTime * 3.0) * 0.5 + 0.5;

        // 量子涨落
        float flux = sin(uTime * 4.0 + probability * 10.0) * 0.3 + 0.7;

        // 叠加态颜色
        vec3 superposition;
        superposition.r = sin(uTime * 3.0 + 0.0) * 0.5 + 0.5;
        superposition.g = sin(uTime * 3.0 + 2.094) * 0.5 + 0.5;
        superposition.b = sin(uTime * 3.0 + 4.188) * 0.5 + 0.5;

        vec3 finalColor = mix(uColor, superposition, fresnel * 0.4);
        finalColor += probability * uColor * 0.3;
        finalColor += interference * uColor * 0.2;
        finalColor *= flux;

        float alpha = (fresnel * 0.6 + probability * 0.2 + interference * 0.2) * uOpacity;

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
 * 创建纠缠粒子对
 */
function createEntangledParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const partners = new Int16Array(count)

  for (let i = 0; i < count; i += 2) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)

    // 纠缠粒子对
    for (let j = 0; j < 2; j++) {
      const sign = j === 0 ? 1 : -1
      const idx = i + j

      positions[idx * 3] = sign * r * Math.sin(phi) * Math.cos(theta)
      positions[idx * 3 + 1] = sign * r * Math.sin(phi) * Math.sin(theta)
      positions[idx * 3 + 2] = sign * r * Math.cos(phi)

      colors[idx * 3] = color.r
      colors[idx * 3 + 1] = color.g
      colors[idx * 3 + 2] = color.b

      sizes[idx] = 0.5 + Math.random() * 1
      phases[idx] = Math.random() * Math.PI * 2
      partners[idx] = i + 1 - j
    }
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
      attribute vec3 color;
      attribute float phase;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vColor = color;
        vPhase = phase;

        vec3 pos = position;
        float entanglement = sin(uTime * 4.0 + phase) * 2.0;
        pos += normalize(pos) * entanglement;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z) * (0.6 + 0.4 * sin(uTime * 3.0 + phase));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 纠缠发光
        float entangleGlow = sin(uOpacity * 12.0 + vPhase * 15.0) * 0.2 + 0.8;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * entangleGlow;
        gl_FragColor = vec4(vColor * 1.3, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

/**
 * 创建波包
 */
function createWavePacket(radius, color) {
  const geometry = new THREE.TorusGeometry(radius * 0.8, radius * 0.1, 32, 100)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;

        vec3 pos = position;
        float wave = sin(pos.x * 2.0 + uTime * 5.0) * 0.3;
        pos += normal * wave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 波函数包络
        float envelope = exp(-pow(vUv.x - 0.5, 2.0) * 8.0) *
                       exp(-pow(vUv.y - 0.5, 2.0) * 8.0);

        // 相位波动
        float phase = sin(vUv.x * 20.0 + uTime * 8.0) * 0.5 + 0.5;

        // 干涉图样
        float interference = sin(vPosition.z * 3.0 + uTime * 4.0) * 0.5 + 0.5;

        vec3 color = uColor * (envelope * 0.5 + phase * 0.3 + interference * 0.2);
        float alpha = (envelope * 0.6 + phase * 0.4) * uOpacity;

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
export default function animateHolographicQuantumFlux(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 25, 110), 90, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-quantum-flux' })
      },
      onError,
      '⚛️ 全息量子涨落（超越级VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x080818)
    scene.fog = new THREE.FogExp2(0x080818, 0.0018)

    // 创建量子云
    const quantumClouds = []
    for (let i = 0; i < 5; i++) {
      const radius = 15 + i * 8
      const hue = (i / 5) * 0.4 + 0.5
      const color = new THREE.Color().setHSL(hue, 1.0, 0.5).getHex()
      const cloud = createQuantumCloud(radius, color)
      cloud.position.x = (Math.random() - 0.5) * 40
      cloud.position.y = (Math.random() - 0.5) * 40
      cloud.position.z = (Math.random() - 0.5) * 40
      scene.add(cloud)
      quantumClouds.push({
        mesh: cloud,
        basePosition: cloud.position.clone(),
        driftSpeed: 0.5 + Math.random() * 1.5
      })
    }

    // 创建纠缠粒子
    const entangledParticles = createEntangledParticles(6000, 80)
    scene.add(entangledParticles)

    // 创建波包
    const wavePackets = []
    for (let i = 0; i < 8; i++) {
      const radius = 20 + i * 5
      const hue = (i / 8) * 0.5 + 0.4
      const color = new THREE.Color().setHSL(hue, 0.9, 0.5).getHex()
      const packet = createWavePacket(radius, color)
      packet.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      scene.add(packet)
      wavePackets.push({
        mesh: packet,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        }
      })
    }

    // 创建概率波纹
    const probabilityRipples = []
    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.RingGeometry(10 + i * 12, 11 + i * 12, 64)
      const hue = i / 6
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(hue, 1.0, 0.6) },
          uOpacity: { value: 0 }
        },
        vertexShader: `
          precision highp float;

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

          varying vec2 vUv;

          void main() {
            float dist = length(vUv - 0.5);
            float wave = sin(dist * 20.0 - uTime * 6.0) * 0.5 + 0.5;
            vec3 color = uColor * wave;
            float alpha = wave * uOpacity * 0.3;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const ripple = new THREE.Mesh(geometry, material)
      ripple.rotation.x = Math.PI / 2
      scene.add(ripple)
      probabilityRipples.push({ mesh: ripple, phase: i * 0.5 })
    }

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新量子云
      quantumClouds.forEach((cloud, i) => {
        cloud.mesh.material.uniforms.uTime.value = time
        cloud.mesh.material.uniforms.uTurbulence.value = 0.5 + 0.5 * Math.sin(time * cloud.driftSpeed + i)

        cloud.mesh.rotation.x += 0.003
        cloud.mesh.rotation.y += 0.005

        const driftX = Math.sin(time * cloud.driftSpeed * 0.5 + i) * 0.02
        const driftY = Math.cos(time * cloud.driftSpeed * 0.5 + i) * 0.02
        const driftZ = Math.sin(time * cloud.driftSpeed * 0.3 + i) * 0.02

        cloud.mesh.position.x = cloud.basePosition.x + driftX
        cloud.mesh.position.y = cloud.basePosition.y + driftY
        cloud.mesh.position.z = cloud.basePosition.z + driftZ
      })

      // 更新纠缠粒子
      entangledParticles.material.uniforms.uTime.value = time
      entangledParticles.rotation.y += 0.003
      entangledParticles.rotation.x = Math.sin(time * 0.4) * 0.08

      // 更新波包
      wavePackets.forEach((packet, i) => {
        packet.mesh.rotation.x += packet.rotSpeed.x
        packet.mesh.rotation.y += packet.rotSpeed.y
        packet.mesh.rotation.z += packet.rotSpeed.z
        packet.mesh.material.uniforms.uTime.value = time
      })

      // 更新概率波纹
      probabilityRipples.forEach((ripple, i) => {
        ripple.mesh.material.uniforms.uTime.value = time
        ripple.mesh.rotation.z += 0.005
        const pulse = 0.8 + 0.2 * Math.sin(time * 2 + ripple.phase)
        ripple.mesh.scale.setScalar(pulse)
      })
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    quantumClouds.forEach((cloud, i) => {
      gsap.to(cloud.mesh.material.uniforms.uOpacity, {
        value: 0.6,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.3
      })
    })

    gsap.to(entangledParticles.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    wavePackets.forEach((packet, i) => {
      gsap.to(packet.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1 + i * 0.15
      })
    })

    probabilityRipples.forEach((ripple, i) => {
      gsap.to(ripple.mesh.material.uniforms.uOpacity, {
        value: 0.4,
        duration: 2,
        ease: 'power2.out',
        delay: 2 + i * 0.2
      })
    })

    // 相机运动
    tl.to(camera.position, {
      x: 55,
      y: 20,
      z: 75,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -55,
      y: -5,
      z: 85,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 95,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        quantumClouds.forEach(cloud => {
          gsap.to(cloud.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(entangledParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })

        wavePackets.forEach(packet => {
          gsap.to(packet.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        probabilityRipples.forEach(ripple => {
          gsap.to(ripple.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        quantumClouds.forEach(cloud => {
          scene.remove(cloud.mesh)
          cloud.mesh.geometry.dispose()
          cloud.mesh.material.dispose()
        })

        scene.remove(entangledParticles)
        entangledParticles.geometry.dispose()
        entangledParticles.material.dispose()

        wavePackets.forEach(packet => {
          scene.remove(packet.mesh)
          packet.mesh.geometry.dispose()
          packet.mesh.material.dispose()
        })

        probabilityRipples.forEach(ripple => {
          scene.remove(ripple.mesh)
          ripple.mesh.geometry.dispose()
          ripple.mesh.material.dispose()
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
    console.error('全息量子涨落动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
