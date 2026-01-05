/**
 * 量子维度分裂动画
 * 实现量子纠缠、维度折叠、现实裂痕等炸裂特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateQuantumDimensionBreak(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置 - 量子观察者视角
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 80), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-dimension-break' })
      },
      onError,
      '量子维度分裂',
      controls
    )

    // 创建量子纠缠系统
    const quantumEntanglement = createQuantumEntanglement(scene, {
      particleCount: 12000,
      dimensionCount: 5,
      maxDistance: 60
    })

    // 创建维度裂缝
    const dimensionRifts = createDimensionRifts(scene, {
      riftCount: 8,
      maxSize: 40
    })

    // 创建现实扭曲器
    const realityDistorter = createRealityDistorter(scene, {
      distortionRadius: 100,
      waveCount: 20
    })

    // 阶段1: 量子叠加态 - 观察前状态
    tl.to(camera.position, {
      x: 0,
      y: 30,
      z: 40,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '摄像机移动错误'
      )
    })

    // 量子粒子震荡
    tl.call(() => {
      quantumEntanglement.animateSuperposition()
    }, null, 2)

    // 阶段2: 观察者效应 - 波函数坍缩
    tl.call(() => {
      quantumEntanglement.animateCollapse()
      dimensionRifts.activate()
    }, null, 4)

    tl.to(camera, {
      fov: 120,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV坍缩错误'
      )
    }, 4)

    // 阶段3: 维度撕裂 - 现实裂痕
    tl.call(() => {
      dimensionRifts.animateExpansion()
      realityDistorter.activate()
    }, null, 5)

    tl.to(camera.position, {
      x: 10,
      y: 15,
      z: 20,
      duration: 2,
      ease: 'elastic.out(1, 0.8)',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '维度撕裂错误'
      )
    }, 5)

    // FOV拉伸效果（维度扭曲）
    tl.to(camera, {
      fov: 160,
      duration: 0.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV扭曲错误'
      )
    }, 5)

    tl.to(camera, {
      fov: 100,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 5.5)

    // 阶段4: 量子穿越 - 维度穿梭
    tl.call(() => {
      quantumEntanglement.animateQuantumJump()
      dimensionRifts.animateVortex()
    }, null, 7)

    tl.to(camera.position, {
      x: -5,
      y: 8,
      z: 15,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '量子穿越错误'
      )
    }, 7)

    // 阶段5: 现实重组 - 维度融合
    tl.call(() => {
      realityDistorter.animateReassembly()
      quantumEntanglement.animateCoherence()
    }, null, 10)

    // 阶段6: 最终稳定 - 回到默认视角
    tl.to(camera.position, {
      x: 0.05,
      y: 0.05,
      z: 0.05,
      duration: 3,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定位错误'
      )
    }, 12)

    // FOV恢复
    tl.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终恢复错误'
      )
    }, 12)

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001
      quantumEntanglement.update(time)
      dimensionRifts.update(time)
      realityDistorter.update(time)
    }

    // 清理函数
    const cleanup = () => {
      quantumEntanglement.destroy()
      dimensionRifts.destroy()
      realityDistorter.destroy()
    }

    tl.call(cleanup, null, 15)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}

/**
 * 创建量子纠缠系统
 */
function createQuantumEntanglement(scene, options) {
  const {
    particleCount = 4000,
    dimensionCount = 5,
    maxDistance = 60
  } = options

  const group = new THREE.Group()
  scene.add(group)

  // 量子粒子系统
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  const states = new Float32Array(particleCount) // 0 = 叠加态，1 = 坍缩态
  const dimensions = new Float32Array(particleCount) // 所在维度

  // 量子颜色光谱
  const quantumColors = [
    new THREE.Color(0x00FF88), // 量子绿
    new THREE.Color(0x8800FF), // 量子紫
    new THREE.Color(0xFF0088), // 量子粉
    new THREE.Color(0x88FF00), // 量子黄绿
    new THREE.Color(0x0088FF)  // 量子蓝
  ]

  for (let i = 0; i < particleCount; i++) {
    const angle1 = Math.random() * Math.PI * 2
    const angle2 = Math.random() * Math.PI
    const distance = Math.random() * maxDistance

    positions[i * 3] = Math.sin(angle2) * Math.cos(angle1) * distance
    positions[i * 3 + 1] = Math.cos(angle2) * distance
    positions[i * 3 + 2] = Math.sin(angle2) * Math.sin(angle1) * distance

    const dim = Math.floor(Math.random() * dimensionCount)
    const color = quantumColors[dim]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    velocities[i * 3] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1

    states[i] = 0 // 初始为叠加态
    dimensions[i] = dim
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particles = new THREE.Points(geometry, material)
  group.add(particles)

  let isCollapsed = false

  return {
    group,
    animateSuperposition() {
      // 叠加态震荡
      gsap.to(particles.rotation, {
        y: Math.PI * 4,
        duration: 3,
        ease: 'power1.inOut'
      })
    },
    animateCollapse() {
      isCollapsed = true

      // 波函数坍缩动画
      gsap.to(material, {
        size: 3,
        duration: 0.5,
        ease: 'power2.out'
      })

      gsap.to(material, {
        size: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      })
    },
    animateQuantumJump() {
      // 量子跳跃效果
      gsap.to(group.position, {
        y: 10,
        duration: 1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 2
      })
    },
    animateCoherence() {
      // 量子相干性建立
      gsap.to(material, {
        opacity: 0.8,
        duration: 2,
        ease: 'power2.inOut'
      })
    },
    update(time) {
      const positions = geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        if (isCollapsed) {
          // 坍缩态 - 粒子聚集
          const distance = Math.sqrt(
            positions[i * 3] * positions[i * 3] +
            positions[i * 3 + 1] * positions[i * 3 + 1] +
            positions[i * 3 + 2] * positions[i * 3 + 2]
          )

          if (distance > 5) {
            const speed = 0.02
            positions[i * 3] -= positions[i * 3] / distance * speed
            positions[i * 3 + 1] -= positions[i * 3 + 1] / distance * speed
            positions[i * 3 + 2] -= positions[i * 3 + 2] / distance * speed
          }
        } else {
          // 叠加态 - 随机运动
          positions[i * 3] += velocities[i * 3] * Math.sin(time + i)
          positions[i * 3 + 1] += velocities[i * 3 + 1] * Math.cos(time + i)
          positions[i * 3 + 2] += velocities[i * 3 + 2] * Math.sin(time * 0.5 + i)
        }
      }
      geometry.attributes.position.needsUpdate = true

      // 整体旋转
      particles.rotation.y += 0.01
    },
    destroy() {
      scene.remove(group)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建维度裂缝效果
 */
function createDimensionRifts(scene, options) {
  const {
    riftCount = 8,
    maxSize = 40
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const rifts = []
  const riftMaterials = []

  for (let i = 0; i < riftCount; i++) {
    const size = Math.random() * maxSize + 10
    const geometry = new THREE.PlaneGeometry(size, size, 8, 8)

    // 裂缝Shader材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uColor: { value: new THREE.Color(0xFF00FF) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vec2 centered = vUv - 0.5;
          float dist = length(centered);

          // 裂缝核心
          float crack = sin(vUv.x * 20.0 + uTime * 2.0) * 0.1;
          crack += sin(vUv.y * 15.0 - uTime * 1.5) * 0.08;

          // 边缘发光
          float edge = 1.0 - smoothstep(0.3, 0.5, dist);
          float glow = pow(edge, 3.0) * uIntensity;

          // 裂缝闪烁
          float flicker = sin(uTime * 10.0) * 0.5 + 0.5;

          vec3 finalColor = uColor * (glow + crack * 0.5) * (0.8 + flicker * 0.2);
          float alpha = (glow + crack * 0.3) * uIntensity;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    const rift = new THREE.Mesh(geometry, material)

    // 随机位置和旋转
    const angle = (i / riftCount) * Math.PI * 2
    const distance = Math.random() * 30 + 20
    rift.position.set(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 20,
      Math.sin(angle) * distance
    )
    rift.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    group.add(rift)
    rifts.push(rift)
    riftMaterials.push(material)
  }

  let isActive = false

  return {
    group,
    activate() {
      isActive = true
    },
    animateExpansion() {
      rifts.forEach((rift, i) => {
        gsap.to(rift.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1,
          delay: i * 0.1,
          ease: 'power2.out'
        })

        gsap.to(riftMaterials[i].uniforms.uIntensity, {
          value: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.in'
        })
      })
    },
    animateVortex() {
      // 形成漩涡效果
      rifts.forEach((rift, i) => {
        gsap.to(rift.rotation, {
          y: Math.PI * 4,
          duration: 3,
          ease: 'power1.inOut'
        })

        gsap.to(rift.position, {
          y: 0,
          duration: 2,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (isActive) {
        riftMaterials.forEach(material => {
          material.uniforms.uTime.value = time
        })
      }
    },
    destroy() {
      scene.remove(group)
      rifts.forEach(rift => {
        rift.geometry.dispose()
        rift.material.dispose()
      })
    }
  }
}

/**
 * 创建现实扭曲器
 */
function createRealityDistorter(scene, options) {
  const {
    distortionRadius = 100,
    waveCount = 20
  } = options

  const group = new THREE.Group()
  scene.add(group)

  const waves = []
  const waveGeometries = []

  for (let i = 0; i < waveCount; i++) {
    const radius = distortionRadius * (i + 1) / waveCount
    const geometry = new THREE.SphereGeometry(radius, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00FFFF,
      transparent: true,
      opacity: 0.05,
      wireframe: true,
      side: THREE.DoubleSide
    })

    const wave = new THREE.Mesh(geometry, material)
    group.add(wave)
    waves.push(wave)
    waveGeometries.push(geometry)
  }

  let isActive = false

  return {
    group,
    activate() {
      isActive = true
    },
    animateReassembly() {
      // 现实重组动画
      waves.forEach((wave, i) => {
        gsap.to(wave.material, {
          opacity: 0.3,
          duration: 0.5,
          delay: i * 0.05,
          ease: 'power2.in'
        })

        gsap.to(wave.material, {
          opacity: 0,
          duration: 1,
          delay: i * 0.05 + 0.5,
          ease: 'power2.out'
        })

        gsap.to(wave.scale, {
          x: 0.5,
          y: 0.5,
          z: 0.5,
          duration: 1.5,
          ease: 'power2.inOut'
        })
      })
    },
    update(time) {
      if (isActive) {
        waves.forEach((wave, i) => {
          wave.rotation.y += 0.01 * (i % 2 === 0 ? 1 : -1)
          wave.rotation.x = Math.sin(time * 0.5 + i) * 0.1

          // 脉动效果
          const pulse = Math.sin(time * 2 + i) * 0.1 + 1
          wave.scale.set(pulse, pulse, pulse)
        })
      }
    },
    destroy() {
      scene.remove(group)
      waves.forEach(wave => {
        wave.geometry.dispose()
        wave.material.dispose()
      })
    }
  }
}
