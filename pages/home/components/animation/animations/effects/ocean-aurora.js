/**
 * effects/ocean-aurora.js - 优化重构版
 * 海洋波浪 + 极光特效
 * 深邃、神秘、绚烂
 *
 * 使用统一模块:
 * - 统一极光着色器模块
 * - 统一星空系统模块
 * - 粒子配置管理模块
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createAuroraCurtain } from './unified-aurora-shader.js'
import { createStarField } from './unified-star-field.js'
import { getAdaptiveParticleCount, performanceMonitor } from './particle-config.js'

/**
 * 创建海洋极光
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 海洋极光对象
 */
export function createOceanAurora(scene, options = {}) {
  const {
    waveSize = 100,
    waveSegments = 256,
    auroraBandCount = 8
  } = options

  // 检测设备性能等级
  performanceMonitor.update()
  const deviceTier = performanceMonitor.getCurrentTier()

  // 海洋Shader
  const oceanGeometry = new THREE.PlaneGeometry(waveSize, waveSize, waveSegments, waveSegments)
  oceanGeometry.rotateX(-Math.PI / 2)

  const oceanMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color(0x001a33) },
      uSurfaceColor: { value: new THREE.Color(0x0066cc) },
      uFoamColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // 多层波浪
        float wave1 = sin(pos.x * 0.1 + uTime * 1.0) * 2.0;
        float wave2 = sin(pos.z * 0.15 + uTime * 1.2) * 1.5;
        float wave3 = sin((pos.x + pos.z) * 0.05 + uTime * 0.8) * 3.0;

        pos.y += wave1 + wave2 + wave3;
        vElevation = (wave1 + wave2 + wave3) / 6.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uDeepColor;
      uniform vec3 uSurfaceColor;
      uniform vec3 uFoamColor;
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        // 深浅渐变
        vec3 color = mix(uDeepColor, uSurfaceColor, vElevation * 0.5 + 0.5);

        // 泡沫
        float foam = step(0.7, vElevation);
        color = mix(color, uFoamColor, foam * 0.3);

        // 闪烁
        float shimmer = sin(uTime * 3.0 + vUv.x * 10.0) * 0.05 + 0.95;
        color *= shimmer;

        gl_FragColor = vec4(color, 0.95);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  })

  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
  ocean.position.y = -10
  scene.add(ocean)

  // 统一极光系统（使用统一模块）
  const auroraLayerCount = deviceTier === 'HIGH' ? auroraBandCount : deviceTier === 'MEDIUM' ? auroraBandCount - 2 : auroraBandCount - 4
  const auroraColors = [0x00ff00, 0xff00ff, 0x00ffff, 0x0066ff]
  const auroraCurtains = []

  for (let i = 0; i < auroraLayerCount; i++) {
    const color = auroraColors[i % auroraColors.length]
    const curtain = createAuroraCurtain(scene, {
      color: color,
      opacity: 0.4,
      width: waveSize,
      height: waveSize * 0.6,
      intensity: 1.0,
      speed: 1.0
    })

    curtain.mesh.position.y = 30 + i * 8
    curtain.mesh.position.z = -20
    auroraCurtains.push(curtain)
  }

  // 统一星空系统（使用统一模块）
  const starCount = getAdaptiveParticleCount('star', deviceTier)
  const stars = createStarField(scene, {
    count: starCount,
    radius: 300,
    color: 0xffffff,
    twinkleSpeed: 0.5
  })

  return {
    ocean,
    auroraCurtains,
    stars,
    update(deltaTime, time) {
      oceanMaterial.uniforms.uTime.value = time

      auroraCurtains.forEach((curtain, i) => {
        curtain.mesh.material.uniforms.uTime.value = time + i * 0.5
      })

      // 星星更新
      stars.update(time)
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 极光增强
      auroraCurtains.forEach((curtain, i) => {
        gsap.to(curtain.mesh.material.uniforms.uIntensity, {
          value: 1.0 + i * 0.1,
          duration: 2,
          ease: 'power2.inOut'
        })
      })

      // 海浪加强
      tl.to(ocean.scale, {
        y: 1.2,
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })

      return tl
    },
    destroy() {
      scene.remove(ocean)
      auroraCurtains.forEach(curtain => curtain.dispose())
      stars.dispose()
      oceanGeometry.dispose()
      oceanMaterial.dispose()
    }
  }
}
