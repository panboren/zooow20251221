/**
 * 粒子动画模板系统
 * 提供统一的动画开发模板，减少代码重复
 */

import { EnhancedBaseEffect } from '../../pages/home/components/animation/animations/base/EnhancedBaseEffect.js'
import { ParticleFactory } from '../ParticleFactory.js'
import { ResourceContext } from '../ResourceCleaner.js'

/**
 * 粒子动画配置接口
 */
export interface ParticleAnimationConfig {
  /** 动画名称 */
  name: string

  /** 基础粒子数量（LOD调整前） */
  particleCount: number

  /** 动画持续时间（毫秒） */
  duration: number

  /** 是否包含相机动画 */
  hasCameraAnimation: boolean

  /** 相机目标位置 */
  cameraTarget?: THREE.Vector3

  /** 粒子颜色模式 */
  colorMode?: 'random' | 'gradient' | 'fixed'

  /** 基础颜色 */
  baseColor?: THREE.Color

  /** 结束颜色 */
  endColor?: THREE.Color

  /** 粒子大小范围 */
  sizeRange?: [number, number]

  /** 粒子透明度范围 */
  opacityRange?: [number, number]

  /** 是否使用混合模式 */
  blending?: THREE.Blending

  /** 是否使用深度写入 */
  depthWrite?: boolean

  /** 是否使用深度测试 */
  depthTest?: boolean

  /** 粒子运动类型 */
  motionType?: 'explosion' | 'implosion' | 'swirl' | 'wave' | 'spiral' | 'custom'

  /** 自定义动画函数 */
  customAnimate?: (particles: THREE.Points, timeline: gsap.core.Timeline) => void
}

/**
 * 粒子动画模板类
 */
export class ParticleEffectTemplate extends EnhancedBaseEffect {
  constructor(
    scene,
    camera,
    renderer,
    controls,
    config: ParticleAnimationConfig
  ) {
    super(scene, camera, renderer, controls, config.name)

    this.config = {
      particleCount: 10000,
      duration: 7000,
      hasCameraAnimation: false,
      colorMode: 'random',
      sizeRange: [1.0, 3.0],
      opacityRange: [0.0, 1.0],
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      motionType: 'explosion',
      ...config
    }

    // 应用LOD调整
    this.particleCount = this.lodManager.getAdjustedCount(
      this.config.particleCount
    )

    this.setupAnimation()
  }

  /**
   * 设置动画
   */
  setupAnimation() {
    this.timeline = this.createTimeline(() => {
      this.cleanup()
      this.onComplete?.()
    })

    // 创建粒子系统
    this.particles = this.createParticleSystem()

    // 添加到场景
    this.scene.add(this.particles)

    // 应用动画
    this.applyAnimation()
  }

  /**
   * 创建粒子系统
   * @returns {THREE.Points} 粒子系统对象
   */
  createParticleSystem() {
    const [minSize, maxSize] = this.config.sizeRange
    const [minOpacity, maxOpacity] = this.config.opacityRange

    // 使用ParticleFactory创建粒子
    return ParticleFactory.create({
      count: this.particleCount,
      size: (minSize + maxSize) / 2,
      sizeVariation: (maxSize - minSize) / 2,
      colorMode: this.config.colorMode,
      baseColor: this.config.baseColor,
      endColor: this.config.endColor,
      opacity: (minOpacity + maxOpacity) / 2,
      opacityVariation: (maxOpacity - minOpacity) / 2,
      blending: this.config.blending,
      depthWrite: this.config.depthWrite,
      depthTest: this.config.depthTest
    })
  }

  /**
   * 应用动画
   */
  applyAnimation() {
    const { particles, timeline, config } = this

    switch (config.motionType) {
      case 'explosion':
        this.animateExplosion()
        break
      case 'implosion':
        this.animateImplosion()
        break
      case 'swirl':
        this.animateSwirl()
        break
      case 'wave':
        this.animateWave()
        break
      case 'spiral':
        this.animateSpiral()
        break
      case 'custom':
        if (typeof config.customAnimate === 'function') {
          config.customAnimate(particles, timeline)
        }
        break
      default:
        this.animateExplosion()
    }
  }

  /**
   * 爆炸动画
   */
  animateExplosion() {
    const { particles, timeline, config } = this

    timeline.fromTo(
      particles.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      {
        duration: config.duration * 0.6,
        ease: 'power2.out'
      }
    )

    timeline.to(
      particles.material,
      { opacity: 0 },
      {
        duration: config.duration * 0.4,
        ease: 'power2.in'
      }
    )
  }

  /**
   * 内爆动画
   */
  animateImplosion() {
    const { particles, timeline, config } = this

    timeline.fromTo(
      particles.scale,
      { x: 2, y: 2, z: 2 },
      { x: 0, y: 0, z: 0 },
      {
        duration: config.duration * 0.6,
        ease: 'power2.in'
      }
    )

    timeline.to(
      particles.material,
      { opacity: 0 },
      {
        duration: config.duration * 0.4,
        ease: 'power2.out'
      }
    )
  }

  /**
   * 漩涡动画
   */
  animateSwirl() {
    const { particles, timeline, config } = this

    const positions = particles.geometry.attributes.position.array
    const originalPositions = Float32Array.from(positions)

    timeline.to(
      {},
      {
        duration: config.duration,
        ease: 'none',
        onUpdate: () => {
          const progress = timeline.progress()
          const angle = progress * Math.PI * 4

          for (let i = 0; i < positions.length; i += 3) {
            const x = originalPositions[i]
            const y = originalPositions[i + 1]
            const z = originalPositions[i + 2]

            // 应用旋转
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            positions[i] = x * cos - z * sin
            positions[i + 1] = y
            positions[i + 2] = x * sin + z * cos
          }

          particles.geometry.attributes.position.needsUpdate = true
        }
      }
    )
  }

  /**
   * 波浪动画
   */
  animateWave() {
    const { particles, timeline, config } = this

    const positions = particles.geometry.attributes.position.array
    const originalPositions = Float32Array.from(positions)

    timeline.to(
      {},
      {
        duration: config.duration,
        ease: 'none',
        onUpdate: () => {
          const progress = timeline.progress()
          const wave = Math.sin(progress * Math.PI * 4)

          for (let i = 0; i < positions.length; i += 3) {
            const y = originalPositions[i + 1]
            positions[i + 1] = y + wave * 10
          }

          particles.geometry.attributes.position.needsUpdate = true
        }
      }
    )
  }

  /**
   * 螺旋动画
   */
  animateSpiral() {
    const { particles, timeline, config } = this

    const positions = particles.geometry.attributes.position.array
    const originalPositions = Float32Array.from(positions)

    timeline.to(
      {},
      {
        duration: config.duration,
        ease: 'none',
        onUpdate: () => {
          const progress = timeline.progress()
          const angle = progress * Math.PI * 6

          for (let i = 0; i < positions.length; i += 3) {
            const x = originalPositions[i]
            const z = originalPositions[i + 2]
            const radius = Math.sqrt(x * x + z * z)

            // 螺旋扩张
            const newRadius = radius * (1 + progress * 2)
            positions[i] = newRadius * Math.cos(angle)
            positions[i + 2] = newRadius * Math.sin(angle)
          }

          particles.geometry.attributes.position.needsUpdate = true
        }
      }
    )
  }

  /**
   * 应用相机动画
   */
  applyCameraAnimation() {
    const { camera, controls, timeline, config } = this

    if (!config.hasCameraAnimation) return

    const target = config.cameraTarget || new THREE.Vector3(0, 0, 0)

    timeline.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: config.duration * 0.8,
      ease: 'power2.inOut'
    })

    timeline.to(controls.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: config.duration * 0.8,
      ease: 'power2.inOut'
    })
  }

  /**
   * 播放动画
   * @param {Function} onComplete - 完成回调
   * @returns {Object} 返回对象
   */
  play(onComplete) {
    this.onComplete = onComplete

    // 应用相机动画
    if (this.config.hasCameraAnimation) {
      this.applyCameraAnimation()
    }

    // 播放时间轴
    this.timeline.play()

    return {
      cleanup: () => this.cleanup()
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.particles) {
      this.scene.remove(this.particles)
      this.particles.geometry.dispose()
      this.particles.material.dispose()
      this.particles = null
    }

    if (this.timeline) {
      this.timeline.kill()
      this.timeline = null
    }

    super.cleanup()
  }
}

/**
 * 快速创建粒子动画
 * @param {Function} implementation - 动画实现函数
 * @param {ParticleAnimationConfig} config - 动画配置
 * @returns {Function} 动画函数
 */
export function createParticleAnimation(
  implementation: (
    particles: THREE.Points,
    timeline: gsap.core.Timeline,
    config: ParticleAnimationConfig
  ) => void,
  config: ParticleAnimationConfig
) {
  return (props, callbacks) => {
    const { scene, camera, renderer, controls } = props

    const effect = new ParticleEffectTemplate(
      scene,
      camera,
      renderer,
      controls,
      config
    )

    // 应用自定义实现
    if (typeof implementation === 'function') {
      effect.customAnimate = implementation
    }

    return effect.play(callbacks.onComplete)
  }
}

/**
 * 默认导出
 */
export default {
  ParticleEffectTemplate,
  ParticleAnimationConfig,
  createParticleAnimation
}
