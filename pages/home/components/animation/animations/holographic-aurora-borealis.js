/**
 * 🌌 全息极光特效 - 优化重构版
 * 传说级视觉特效 - 自然奇观重现
 *
 * 技术特点:
 * - 使用统一极光着色器模块
 * - 使用统一星空系统模块
 * - 使用粒子配置管理模块
 * - 极光波段模拟
 * - 磁场线可视化
 * - 等离子体波动
 * - 天体大气层效果
 * - 动态光谱分析
 *
 * 视觉表现:
 * 多层极光帷幕
 * 磁场线流动
 * 等离子体波纹
 * 星空背景
 * 极光色彩变化
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { createMultiLayerAurora } from './effects/unified-aurora-shader.js'
import { createShaderStarField } from './effects/unified-star-field.js'
import { getAdaptiveParticleCount, performanceMonitor } from './effects/particle-config.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'
import { logger } from './logger.js'
import { getDeviceTier } from './device-detection.js'

/**
 * 创建等离子体粒子
 */
function createPlasmaParticles(scene, count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    const hue = Math.random() * 0.3 + 0.5
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 3 + 1

    velocities[i * 3] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 1] = Math.random() * 0.1 + 0.05
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
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

        // 等离子体运动
        float wave = sin(uTime * 2.0 + pos.x * 0.1) * cos(uTime * 1.5 + pos.z * 0.1);
        pos.y += wave * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
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

  const particles = new THREE.Points(geometry, material)
  particles.userData.velocities = velocities
  scene.add(particles)

  return particles
}

/**
 * 极光动画主函数
 */
export default function animateHolographicAuroraBorealis(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  setupInitialCamera(camera, new THREE.Vector3(0, 0, 150), 110, controls)
  camera.lookAt(0, 30, 0)

  renderer.render(scene, camera)

  const perfMonitor = new PerformanceMonitor()
  perfMonitor.start()

  // 检测设备性能等级
  const deviceTier = getDeviceTier()

  const tl = createTimeline(
    () => {
      perfMonitor.stop()
      perfMonitor.logReport()
      if (onComplete) onComplete({ type: 'holographic-aurora-borealis' })
      // 动画完成后取消动画循环
      cancelAnimationFrame(animationId)
    },
    onError,
    '🌌 全息极光（传说级VFX - 重构版）',
    controls
  )

  const originalBackground = scene.background
  const originalFog = scene.fog

  scene.background = new THREE.Color(0x0a0a1a)
  scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0008)

  // 创建统一星空系统（使用统一模块）
  const starCount = getAdaptiveParticleCount('star', deviceTier)
  const starField = createShaderStarField(scene, {
    count: starCount,
    radius: 300,
    twinkleSpeed: 3.0
  })

  // 创建统一极光系统（使用统一模块）
  const auroraLayerCount = deviceTier === 'HIGH' ? 4 : deviceTier === 'MEDIUM' ? 3 : 2
  const aurora = createMultiLayerAurora(scene, {
    layerCount: auroraLayerCount,
    colors: [0x00ff00, 0x00ffff, 0xff00ff, 0xffff00],
    opacity: 0.8,
    height: 80,
    intensity: 1.0
  })

  // 创建等离子体粒子
  const plasmaCount = getAdaptiveParticleCount('plasma', deviceTier)
  const plasmaParticles = createPlasmaParticles(scene, plasmaCount, 80)

  // 入场动画
  tl.call(() => {
    starField.appear(1.0, 2)
  }, null, 'start')

  tl.call(() => {
    aurora.appear(0.8, 2)
  }, null, 'start+=0.5')

  tl.call(() => {
    const plasmaMaterial = plasmaParticles.material
    gsap.to(plasmaMaterial.uniforms.uOpacity, {
      value: 0.7,
      duration: 1.5
    })
  }, null, 'start+=1.5')

  // 相机动画
  tl.to(camera.position, {
    x: 0,
    y: 40,
    z: 120,
    duration: 4,
    ease: 'power2.out'
  }, 'start+=2')

  // 极光波动动画
  tl.to(
    {},
    {
      duration: 5,
      onUpdate: () => {
        const time = Date.now() * 0.001
        aurora.layers.forEach((layer, i) => {
          layer.curtain.mesh.rotation.y = Math.sin(time * 0.5 + i) * 0.1
          layer.curtain.mesh.rotation.x = Math.sin(time * 0.3 + i * 0.5) * 0.05
        })
      }
    },
    '+=1'
  )

  // 退出动画
  tl.call(() => {
    aurora.fade(0, 2)
  }, null, 'end')

  tl.call(() => {
    const plasmaMaterial = plasmaParticles.material
    gsap.to(plasmaMaterial.uniforms.uOpacity, {
      value: 0,
      duration: 2
    })
  }, null, 'end')

  tl.call(() => {
    starField.fade(0, 2)
  }, null, 'end-=1')

  // 动画循环
  let animationId = null
  const animate = (time) => {
    animationId = requestAnimationFrame(animate)

    const elapsedTime = time * 0.001

    // 更新星空
    starField.update(elapsedTime)

    // 更新极光帷幕 - aurora 直接包含 layers 数组
    aurora.layers.forEach((layer, i) => {
      layer.curtain.mesh.material.uniforms.uTime.value = elapsedTime
      layer.curtain.mesh.rotation.y = Math.sin(elapsedTime * 0.3 + i) * 0.15
    })

    // 更新等离子体粒子
    plasmaParticles.material.uniforms.uTime.value = elapsedTime
    const positions = plasmaParticles.geometry.attributes.position.array
    const velocities = plasmaParticles.userData.velocities

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      if (positions[i * 3 + 1] > 100) {
        positions[i * 3 + 1] = -40
      }
    }
    plasmaParticles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  animationId = requestAnimationFrame(animate)

  // 清理函数
  return () => {
    // 取消动画循环
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    // 清理资源
    starField.dispose()
    aurora.dispose()
    scene.remove(plasmaParticles)
    plasmaParticles.geometry.dispose()
    plasmaParticles.material.dispose()
    scene.background = originalBackground
    scene.fog = originalFog

    logger.log('全息极光特效清理完成')
  }
}
