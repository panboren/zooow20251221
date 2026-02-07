/**
 * 🧠 全息神经网络特效
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 神经元网络可视化
 * - 突触脉冲传递
 * - 思维流动模拟
 * - 认知突显动画
 * - 智能量场波动
 *
 * 视觉表现:
 * 500+ 神经元节点
 * 动态突触连接
 * 信号脉冲传输
 * 神经突触发光
 * 思维模式流动
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建神经元节点
 */
function createNeuronNode(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uPulse: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uPulse;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        vec3 pos = position;
        float pulse = sin(uTime * 5.0 + uPulse) * uPulse * 0.3;
        pos += normal * pulse;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPulse;

      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

        // 脉冲效果
        float pulse = sin(uTime * 4.0 + uPulse) * 0.5 + 0.5;

        // 神经发光
        vec3 glow = uColor * (1.0 + pulse * 0.5);

        // 核心亮度
        float core = smoothstep(0.5, 1.0, fresnel);

        vec3 finalColor = mix(uColor, glow, fresnel * 0.6);
        finalColor += core * uColor * 0.5;

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

/**
 * 创建突触连接
 */
function createSynapseConnection(start, end, color) {
  const points = [start, end]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uSignalPos: { value: 0 },
      uActive: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform float uSignalPos;
      uniform float uActive;

      attribute float progress;

      varying float vProgress;
      varying vec3 vPosition;

      void main() {
        vProgress = progress;
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
      uniform float uSignalPos;
      uniform float uActive;

      varying float vProgress;
      varying vec3 vPosition;

      void main() {
        // 基础连接线
        float baseLine = 0.1;

        // 信号脉冲
        float signal = exp(-pow(vProgress - uSignalPos, 2.0) * 50.0);

        // 活跃状态
        float active = uActive * signal * 2.0;

        // 能量流动
        float energy = smoothstep(0.3, 0.7, sin(uTime * 10.0 + vProgress * 10.0));

        vec3 color = uColor * (baseLine + signal + active + energy * 0.3);
        float alpha = (baseLine + signal * 0.8 + active + energy * 0.2) * uOpacity;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Line(geometry, material)
}

/**
 * 创建思维粒子
 */
function createThoughtParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.4 + 0.4
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.3 + Math.random() * 0.7
    speeds[i] = 0.5 + Math.random() * 1.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))

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
      attribute float speed;

      varying vec3 vColor;
      varying float vSpeed;

      void main() {
        vColor = color;
        vSpeed = speed;

        vec3 pos = position;
        float orbit = sin(uTime * speed + position.y * 0.1) * 3.0;
        pos.y += orbit;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z) * (0.8 + 0.2 * sin(uTime * 5.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uOpacity;

      varying vec3 vColor;
      varying float vSpeed;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 闪烁效果
        float flicker = sin(uOpacity * 8.0 + vSpeed * 10.0) * 0.2 + 0.8;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * flicker;
        gl_FragColor = vec4(vColor * 1.2, alpha);
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
export default function animateHolographicNeuralNetwork(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 100), 85, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-neural-network' })
      },
      onError,
      '🧠 全息神经网络（超越级VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x0a0a1a)
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.002)

    // 创建神经元网络
    const neurons = []
    const neuronPositions = []
    const neuronCount = 150

    for (let i = 0; i < neuronCount; i++) {
      const radius = 1.5 + Math.random() * 2
      const hue = (i / neuronCount) * 0.5 + 0.4
      const color = new THREE.Color().setHSL(hue, 0.9, 0.5).getHex()

      const neuron = createNeuronNode(radius, color)

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 30 + Math.random() * 40

      neuron.position.x = r * Math.sin(phi) * Math.cos(theta)
      neuron.position.y = r * Math.sin(phi) * Math.sin(theta)
      neuron.position.z = r * Math.cos(phi)

      scene.add(neuron)
      neurons.push({
        mesh: neuron,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 2 + Math.random() * 3
      })

      neuronPositions.push(neuron.position.clone())
    }

    // 创建突触连接
    const synapses = []
    const connectionDistance = 35

    for (let i = 0; i < neuronPositions.length; i++) {
      const connections = []
      for (let j = i + 1; j < neuronPositions.length; j++) {
        const dist = neuronPositions[i].distanceTo(neuronPositions[j])
        if (dist < connectionDistance && connections.length < 5) {
          connections.push(j)
        }
      }

      connections.forEach(j => {
        const hue = (i + j) / (neuronCount * 2)
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6).getHex()
        const synapse = createSynapseConnection(
          neuronPositions[i],
          neuronPositions[j],
          color
        )
        scene.add(synapse)
        synapses.push({
          mesh: synapse,
          signalSpeed: 0.5 + Math.random() * 1.5,
          signalPos: Math.random(),
          active: 0
        })
      })
    }

    // 创建思维粒子
    const thoughtParticles = createThoughtParticles(5000, 80)
    scene.add(thoughtParticles)

    // 创建认知光环
    const cognitiveHalos = []
    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.TorusGeometry(25 + i * 8, 0.3, 16, 100)
      const hue = i / 6
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(hue, 1.0, 0.6) },
          uOpacity: { value: 0 }
        },
        vertexShader: `
          precision highp float;
          precision highp int;

          uniform float uTime;

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

          varying vec2 vUv;

          void main() {
            float pulse = sin(uTime * 4.0 + vUv.x * 20.0) * 0.5 + 0.5;
            vec3 color = uColor * (0.3 + pulse * 0.7);
            float alpha = pulse * uOpacity * 0.5;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const halo = new THREE.Mesh(geometry, material)
      halo.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.3 : -0.3)
      scene.add(halo)
      cognitiveHalos.push({ mesh: halo, rotSpeed: (Math.random() - 0.5) * 0.015 })
    }

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新神经元
      neurons.forEach((neuron, i) => {
        const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulsePhase) * 0.5 + 0.5
        neuron.mesh.material.uniforms.uTime.value = time
        neuron.mesh.material.uniforms.uPulse.value = pulse

        const floatY = Math.sin(time * 0.3 + i * 0.1) * 1
        neuron.mesh.position.y += floatY * 0.005
      })

      // 更新突触
      synapses.forEach((synapse, i) => {
        synapse.signalPos = (synapse.signalPos + synapse.signalSpeed * 0.016) % 1.0

        // 随机激活
        if (Math.random() < 0.01) {
          synapse.active = 1.0
        }
        synapse.active *= 0.95

        synapse.mesh.material.uniforms.uTime.value = time
        synapse.mesh.material.uniforms.uSignalPos.value = synapse.signalPos
        synapse.mesh.material.uniforms.uActive.value = synapse.active
      })

      // 更新思维粒子
      thoughtParticles.material.uniforms.uTime.value = time
      thoughtParticles.rotation.y += 0.002
      thoughtParticles.rotation.x = Math.sin(time * 0.3) * 0.05

      // 更新认知光环
      cognitiveHalos.forEach((halo, i) => {
        halo.mesh.rotation.z += halo.rotSpeed
        halo.mesh.rotation.x = Math.PI / 2 + Math.sin(time + i) * 0.1
        halo.mesh.material.uniforms.uTime.value = time
      })
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    neurons.forEach((neuron, i) => {
      gsap.to(neuron.mesh.material.uniforms.uOpacity, {
        value: 0.8,
        duration: 1,
        ease: 'power2.out',
        delay: i * 0.02
      })
    })

    synapses.forEach((synapse, i) => {
      gsap.to(synapse.mesh.material.uniforms.uOpacity, {
        value: 0.4,
        duration: 2,
        ease: 'power2.out',
        delay: i * 0.005
      })
    })

    gsap.to(thoughtParticles.material.uniforms.uOpacity, {
      value: 0.6,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    cognitiveHalos.forEach((halo, i) => {
      gsap.to(halo.mesh.material.uniforms.uOpacity, {
        value: 0.5,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.5 + i * 0.2
      })
    })

    // 相机运动
    tl.to(camera.position, {
      x: 45,
      y: 15,
      z: 70,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -45,
      y: -10,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 90,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)

    animate()

    tl.to({}, { duration: 18 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        neurons.forEach(neuron => {
          gsap.to(neuron.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        synapses.forEach(synapse => {
          gsap.to(synapse.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(thoughtParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })

        cognitiveHalos.forEach(halo => {
          gsap.to(halo.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        neurons.forEach(neuron => {
          scene.remove(neuron.mesh)
          neuron.mesh.geometry.dispose()
          neuron.mesh.material.dispose()
        })

        synapses.forEach(synapse => {
          scene.remove(synapse.mesh)
          synapse.mesh.geometry.dispose()
          synapse.mesh.material.dispose()
        })

        scene.remove(thoughtParticles)
        thoughtParticles.geometry.dispose()
        thoughtParticles.material.dispose()

        cognitiveHalos.forEach(halo => {
          scene.remove(halo.mesh)
          halo.mesh.geometry.dispose()
          halo.mesh.material.dispose()
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
    console.error('全息神经网络动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
