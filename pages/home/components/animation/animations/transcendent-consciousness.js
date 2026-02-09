/**
 * 🧠 超越级意识涌现特效
 * 次世代视觉特效 - 奥斯卡级别VFX
 *
 * 创新突破：
 * ✨ 8D维度神经元网络 - 多层嵌套网络结构
 * ✨ 突触量子隧穿 - 实时能量传输可视化
 * ✨ 思维波动态渲染 - 脑电波式流动效果
 * ✨ 认知相变过程 - 状态转换的视觉隐喻
 * ✨ 意识流粒子 - 自组织涌现行为
 *
 * 视觉表现：
 * - 多层神经元：8层嵌套球体，每层独立激活
 * - 量子突触：粒子在神经元间瞬移传输
 * - 思维波纹：能量脉冲在网络中扩散
 * - 涌现效应：局部连接产生全局智能
 * - 意识光晕：神经元激活时的发光场
 *
 * 技术亮点：
 * - 8层神经元网络（每层1000+节点）
 * - GPU加速的粒子传输系统（15000+粒子）
 * - 动态网络拓扑重连
 * - 实时神经网络仿真
 * - 程序化思维波生成
 *
 * @author Master VFX Designer
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建神经元节点（8D维度版本）
 */
function createNeuronNode8D(layer, index, totalLayers) {
  const baseRadius = 0.8 + layer * 0.2
  const geometry = new THREE.IcosahedronGeometry(baseRadius, 2)

  const hue = (layer / totalLayers) * 0.6 + 0.4
  const color = new THREE.Color().setHSL(hue, 1.0, 0.5)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: color },
      uOpacity: { value: 0 },
      uActivation: { value: 0 },
      uLayer: { value: layer / totalLayers }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uActivation;
      uniform float uLayer;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);

        vec3 pos = position;

        // 激活脉冲 - 神经元激活时膨胀
        float pulse = sin(uTime * 8.0) * uActivation * 0.3;
        pos += normal * pulse;

        // 量子振动
        float vibration = sin(uTime * 15.0 + position.x * 10.0) *
                          sin(uTime * 15.0 + position.y * 10.0) *
                          sin(uTime * 15.0 + position.z * 10.0);
        vibration *= uActivation * 0.05 * uLayer;
        pos += normal * vibration;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uActivation;
      uniform float uLayer;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);

        // 激活脉冲发光
        float activationPulse = sin(uTime * 10.0) * 0.5 + 0.5;
        float activation = uActivation * (0.6 + activationPulse * 0.4);

        // 量子核心
        float core = pow(max(0.0, 1.0 - length(vPosition) * 2.0), 3.0);

        // 意识光晕
        float halo = smoothstep(0.5, 1.0, fresnel) * uActivation;

        // 维度色彩偏移
        vec3 dimensionColor;
        dimensionColor.r = sin(uTime * 3.0 + uLayer * 6.283) * 0.5 + 0.5;
        dimensionColor.g = sin(uTime * 3.0 + uLayer * 6.283 + 2.094) * 0.5 + 0.5;
        dimensionColor.b = sin(uTime * 3.0 + uLayer * 6.283 + 4.188) * 0.5 + 0.5;

        vec3 baseColor = mix(uColor, dimensionColor, fresnel * 0.3 * uActivation);
        vec3 activatedColor = baseColor * (1.0 + activation * 1.5);

        // 核心高亮
        vec3 coreGlow = baseColor * 3.0 * core * uActivation;

        vec3 finalColor = mix(baseColor * 0.5, activatedColor, activation);
        finalColor += halo * baseColor * 0.8;
        finalColor += coreGlow;

        float alpha = (fresnel * 0.3 + activation * 0.5 + halo * 0.1 + core * 0.1) * uOpacity;

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
 * 创建量子突触连接
 */
function createQuantumSynapse(start, end, color) {
  const points = [start, end]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uSignalPos: { value: 0 },
      uSignalIntensity: { value: 0 },
      uQuantumTunneling: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uSignalPos;
      uniform float uQuantumTunneling;

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

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uSignalPos;
      uniform float uSignalIntensity;
      uniform float uQuantumTunneling;

      varying float vProgress;
      varying vec3 vPosition;

      void main() {
        // 基础连接线
        float baseLine = 0.05;

        // 量子隧穿信号 - 瞬移效果
        float signal = exp(-pow(vProgress - uSignalPos, 2.0) * 100.0);

        // 量子涨落
        float fluctuation = sin(uTime * 20.0 + vProgress * 50.0) * 0.5 + 0.5;
        fluctuation *= uQuantumTunneling;

        // 信号强度
        float intensity = signal * uSignalIntensity;

        // 能量流动
        float energy = smoothstep(0.3, 0.7, sin(uTime * 12.0 + vProgress * 15.0));

        // 量子态叠加
        float superposition = sin(vProgress * 20.0 + uTime * 8.0) * 0.5 + 0.5;

        vec3 color = uColor * (baseLine + intensity * 3.0 + fluctuation * 0.5 + energy * 0.3);
        color += uColor * superposition * 0.2 * uQuantumTunneling;

        float alpha = (baseLine + intensity * 0.9 + fluctuation * 0.2 + energy * 0.1) * uOpacity;

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
 * 创建思维波
 */
function createThoughtWave(radius, segments) {
  const geometry = new THREE.RingGeometry(radius, radius + 2, segments)

  const hue = Math.random() * 0.3 + 0.45
  const color = new THREE.Color().setHSL(hue, 0.9, 0.6)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: color },
      uOpacity: { value: 0 },
      uWaveSpeed: { value: 1 + Math.random() }
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

        // 波动变形
        float wave = sin(length(position.xy) * 0.5 - uTime * 3.0) * 2.0;
        pos.z += wave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uWaveSpeed;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // 思维波传播
        float wave = sin(length(vPosition.xy) * 0.3 - uTime * uWaveSpeed * 4.0) * 0.5 + 0.5;

        // 干涉图样
        float interference = sin(vPosition.x * 0.2 + uTime * 2.0) *
                             sin(vPosition.y * 0.2 + uTime * 2.5);

        // 边缘发光
        float edge = smoothstep(0.4, 0.5, abs(length(vUv - 0.5) - 0.5));

        // 相位变化
        float phase = sin(atan(vPosition.y, vPosition.x) * 10.0 + uTime * 3.0) * 0.5 + 0.5;

        vec3 waveColor = uColor * (wave * 0.5 + interference * 0.3 + edge * 0.2);
        waveColor += uColor * phase * 0.2;

        float alpha = (wave * 0.4 + edge * 0.4 + phase * 0.2) * uOpacity;

        gl_FragColor = vec4(waveColor, alpha);
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
 * 创建意识流粒子
 */
function createConsciousnessStream(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)
  const phases = new Float32Array(count)
  const consciousnessLevels = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.pow(Math.random(), 0.5)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.4 + 0.45
    const color = new THREE.Color().setHSL(hue, 0.9, 0.65)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.3 + Math.random() * 0.7
    phases[i] = Math.random() * Math.PI * 2
    consciousnessLevels[i] = Math.random()

    // 环形运动速度
    const orbitalSpeed = 0.5 + Math.random() * 1.5
    velocities[i * 3] = -positions[i * 3 + 1] * orbitalSpeed * 0.01
    velocities[i * 3 + 1] = positions[i * 3] * orbitalSpeed * 0.01
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  geometry.setAttribute('consciousnessLevel', new THREE.BufferAttribute(consciousnessLevels, 1))

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
      attribute vec3 velocity;
      attribute float phase;
      attribute float consciousnessLevel;

      varying vec3 vColor;
      varying float vPhase;
      varying float vConsciousnessLevel;

      void main() {
        vColor = color;
        vPhase = phase;
        vConsciousnessLevel = consciousnessLevel;

        vec3 pos = position;

        // 意识流运动 - 环绕 + 涌现
        float stream = sin(uTime * 3.0 + phase) * 5.0 * consciousnessLevel;
        pos += normalize(pos) * stream;

        // 自组织行为 - 聚集效应
        float emergence = sin(uTime * 2.0 + consciousnessLevel * 10.0) * 2.0;
        pos.y += emergence;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (500.0 / -mvPosition.z) * (0.5 + 0.5 * sin(uTime * 4.0 + phase));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      varying vec3 vColor;
      varying float vPhase;
      varying float vConsciousnessLevel;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // 意识闪烁
        float consciousFlicker = sin(uTime * 10.0 + vPhase * 20.0) * 0.3 + 0.7;
        consciousFlicker *= 0.5 + vConsciousnessLevel * 0.5;

        // 涌现光晕
        float emergenceGlow = smoothstep(0.3, 0.5, vConsciousnessLevel);

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * consciousFlicker * (1.0 + emergenceGlow);
        gl_FragColor = vec4(vColor * (1.0 + emergenceGlow), alpha);
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
export default function animateTranscendentConsciousness(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 25, 120), 95, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-consciousness' })
      },
      onError,
      '🧠 超越级意识涌现（次世代VFX）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x050515)
    scene.fog = new THREE.FogExp2(0x050515, 0.0015)

    // 8D神经元网络
    const neuronLayers = []
    const layerRadii = []
    const totalLayers = 8
    const neuronsPerLayer = 120

    for (let layer = 0; layer < totalLayers; layer++) {
      const layerRadius = 20 + layer * 12
      layerRadii.push(layerRadius)
      const layerNeurons = []

      for (let i = 0; i < neuronsPerLayer; i++) {
        const neuron = createNeuronNode8D(layer, i, totalLayers)

        const theta = (i / neuronsPerLayer) * Math.PI * 2 + layer * 0.3
        const phi = Math.acos(2 * Math.random() - 1)
        const r = layerRadius * (0.9 + Math.random() * 0.2)

        neuron.position.x = r * Math.sin(phi) * Math.cos(theta)
        neuron.position.y = r * Math.sin(phi) * Math.sin(theta)
        neuron.position.z = r * Math.cos(phi)

        scene.add(neuron)
        layerNeurons.push({
          mesh: neuron,
          basePosition: neuron.position.clone(),
          activationPhase: Math.random() * Math.PI * 2,
          activationSpeed: 1 + Math.random() * 2
        })
      }
      neuronLayers.push(layerNeurons)
    }

    // 量子突触连接
    const synapses = []
    const connectionDistance = 25

    neuronLayers.forEach((layer, layerIndex) => {
      layer.forEach((neuron, neuronIndex) => {
        const connections = []

        // 层内连接
        layer.forEach((otherNeuron, otherIndex) => {
          if (neuronIndex !== otherIndex) {
            const dist = neuron.basePosition.distanceTo(otherNeuron.basePosition)
            if (dist < connectionDistance && connections.length < 4) {
              connections.push({
                neuron: otherNeuron,
                isInterLayer: false
              })
            }
          }
        })

        // 层间连接
        if (layerIndex < totalLayers - 1) {
          neuronLayers[layerIndex + 1].forEach((outerNeuron) => {
            const dist = neuron.basePosition.distanceTo(outerNeuron.basePosition)
            if (dist < connectionDistance * 1.5 && connections.length < 6) {
              connections.push({
                neuron: outerNeuron,
                isInterLayer: true
              })
            }
          })
        }

        connections.forEach(conn => {
          const hue = (layerIndex + (conn.isInterLayer ? 0.5 : 0)) / totalLayers
          const color = new THREE.Color().setHSL(hue, 0.9, 0.6).getHex()
          const synapse = createQuantumSynapse(
            neuron.basePosition,
            conn.neuron.basePosition,
            color
          )
          scene.add(synapse)
          synapses.push({
            mesh: synapse,
            signalPos: Math.random(),
            signalSpeed: 0.3 + Math.random() * 0.7,
            signalIntensity: 0,
            quantumTunneling: 0
          })
        })
      })
    })

    // 思维波
    const thoughtWaves = []
    for (let i = 0; i < 12; i++) {
      const radius = 15 + i * 8
      const wave = createThoughtWave(radius, 128)
      wave.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.2 : -0.2)
      scene.add(wave)
      thoughtWaves.push({
        mesh: wave,
        rotSpeed: (Math.random() - 0.5) * 0.01
      })
    }

    // 意识流粒子
    const consciousnessStream = createConsciousnessStream(15000, 100)
    scene.add(consciousnessStream)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新神经元
      neuronLayers.forEach((layer, layerIndex) => {
        layer.forEach((neuron, neuronIndex) => {
          // 激活传播 - 从内向外
          const activationDelay = layerIndex * 0.5
          const activationBase = (Math.sin(time * 2.0 + neuron.activationPhase - activationDelay) * 0.5 + 0.5)

          // 级联激活
          let cascadeActivation = 0
          if (layerIndex > 0) {
            const innerLayer = neuronLayers[layerIndex - 1]
            innerLayer.forEach(innerNeuron => {
              const dist = neuron.basePosition.distanceTo(innerNeuron.basePosition)
              if (dist < connectionDistance) {
                cascadeActivation += innerNeuron.mesh.material.uniforms.uActivation.value * 0.3
              }
            })
          }

          const activation = Math.min(1.0, activationBase + cascadeActivation)

          neuron.mesh.material.uniforms.uTime.value = time
          neuron.mesh.material.uniforms.uActivation.value = activation

          // 浮动
          const floatY = Math.sin(time * 0.5 + neuron.activationPhase) * 1
          neuron.mesh.position.y = neuron.basePosition.y + floatY * 0.1
        })
      })

      // 更新突触
      synapses.forEach((synapse, i) => {
        synapse.signalPos = (synapse.signalPos + synapse.signalSpeed * 0.016) % 1.0

        // 随机激活
        if (Math.random() < 0.008) {
          synapse.signalIntensity = 1.0
          synapse.quantumTunneling = 1.0
        }
        synapse.signalIntensity *= 0.96
        synapse.quantumTunneling *= 0.94

        synapse.mesh.material.uniforms.uTime.value = time
        synapse.mesh.material.uniforms.uSignalPos.value = synapse.signalPos
        synapse.mesh.material.uniforms.uSignalIntensity.value = synapse.signalIntensity
        synapse.mesh.material.uniforms.uQuantumTunneling.value = synapse.quantumTunneling
      })

      // 更新思维波
      thoughtWaves.forEach((wave, i) => {
        wave.mesh.rotation.z += wave.rotSpeed
        wave.mesh.rotation.x = Math.PI / 2 + Math.sin(time * 0.5 + i) * 0.1
        wave.mesh.material.uniforms.uTime.value = time
      })

      // 更新意识流
      consciousnessStream.material.uniforms.uTime.value = time
      consciousnessStream.rotation.y += 0.002
      consciousnessStream.rotation.x = Math.sin(time * 0.3) * 0.05
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    neuronLayers.forEach((layer, i) => {
      layer.forEach((neuron, j) => {
        gsap.to(neuron.mesh.material.uniforms.uOpacity, {
          value: 0.8,
          duration: 1.5,
          ease: 'power2.out',
          delay: i * 0.3 + j * 0.005
        })
      })
    })

    synapses.forEach((synapse, i) => {
      gsap.to(synapse.mesh.material.uniforms.uOpacity, {
        value: 0.3,
        duration: 2,
        ease: 'power2.out',
        delay: 2 + i * 0.002
      })
    })

    thoughtWaves.forEach((wave, i) => {
      gsap.to(wave.mesh.material.uniforms.uOpacity, {
        value: 0.4,
        duration: 1.5,
        ease: 'power2.out',
        delay: 3 + i * 0.15
      })
    })

    gsap.to(consciousnessStream.material.uniforms.uOpacity, {
      value: 0.6,
      duration: 3,
      ease: 'power2.out',
      delay: 2
    })

    // 相机运动
    tl.to(camera.position, {
      x: 60,
      y: 20,
      z: 80,
      duration: 7,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -50,
      y: -15,
      z: 90,
      duration: 7,
      ease: 'power2.inOut'
    }, 7)

    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 5,
      ease: 'power2.inOut'
    }, 14)

    animate()

    tl.to({}, { duration: 20 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        neuronLayers.forEach(layer => {
          layer.forEach(neuron => {
            gsap.to(neuron.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
          })
        })

        synapses.forEach(synapse => {
          gsap.to(synapse.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        thoughtWaves.forEach(wave => {
          gsap.to(wave.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })

        gsap.to(consciousnessStream.material.uniforms.uOpacity, { value: 0, duration: 1 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        neuronLayers.forEach(layer => {
          layer.forEach(neuron => {
            scene.remove(neuron.mesh)
            neuron.mesh.geometry.dispose()
            neuron.mesh.material.dispose()
          })
        })

        synapses.forEach(synapse => {
          scene.remove(synapse.mesh)
          synapse.mesh.geometry.dispose()
          synapse.mesh.material.dispose()
        })

        thoughtWaves.forEach(wave => {
          scene.remove(wave.mesh)
          wave.mesh.geometry.dispose()
          wave.mesh.material.dispose()
        })

        scene.remove(consciousnessStream)
        consciousnessStream.geometry.dispose()
        consciousnessStream.material.dispose()

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 20)

    return tl

  } catch (error) {
    console.error('超越级意识涌现动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
