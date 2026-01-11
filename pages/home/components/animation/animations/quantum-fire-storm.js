/**
 * 量子火焰风暴动画
 * 组合特效：量子维度破碎 + 火焰风暴
 * 创意：量子维度破碎后，从裂缝中喷涌出狂暴的火焰风暴
 */

// 延迟导入，避免 SSR 问题
export default function animateQuantumFireStorm(props, callbacks) {
  // 只在客户端运行
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Animation only runs on client'))
  }

  // 动态导入，确保只在客户端执行
  return new Promise((resolve, reject) => {
    const loadAnimation = async () => {
      try {
        const threeModule = await import('three')
        const gsapModule = await import('gsap')
        const utilsModule = await import('./utils')
        const quantumModule = await import('./effects/quantum-dimension-break')
        const fireModule = await import('./effects/fire-storm')
        const particleModule = await import('./effects/particle-system')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createQuantumDimensionBreak } = quantumModule
        const { createFireStorm } = fireModule
        const { createExplosionParticles, animateExplosionParticles } = particleModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 30, 100), 120, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'quantum-fire-storm' })
          },
          onError,
          '量子火焰风暴',
          controls
        )

        // 检查特效函数是否存在
        if (typeof createQuantumDimensionBreak !== 'function' || typeof createFireStorm !== 'function') {
          throw new Error('Required animation effects are not available')
        }

        const quantumBreak = createQuantumDimensionBreak(scene, {
          fragmentCount: 3000,
          dimensionCount: 4
        })

        const fireStorm = createFireStorm(scene, {
          particleCount: 5000,
          radius: 30,
          height: 60
        })

        // 阶段1: 量子维度破碎
        if (quantumBreak && typeof quantumBreak.animate === 'function') {
          quantumBreak.animate(3)
        }

        tl.to(camera.position, {
          x: 20,
          y: 40,
          z: 70,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '观察维度破碎错误'
          )
        })

        // 阶段2: 维度裂缝出现
        tl.to(camera.position, {
          x: -15,
          y: 35,
          z: 55,
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '靠近裂缝错误'
          )
        })

        // 阶段3: 火焰爆发
        tl.call(() => {
          if (quantumBreak && typeof quantumBreak.destroy === 'function') {
            quantumBreak.destroy()
          }
          if (fireStorm && typeof fireStorm.animate === 'function') {
            fireStorm.animate(4)
          }

          // 添加爆炸粒子
          try {
            const explosionParticles = createExplosionParticles(scene, new THREE.Vector3(0, -20, 0), 6000, { h: 0.08, s: 1, l: 0.5 })
            animateExplosionParticles(explosionParticles, 3)
          } catch (particleError) {
            console.warn('Failed to create explosion particles:', particleError)
          }
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: 10,
          y: 50,
          z: 85,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 10, 0),
            '躲避火焰错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 9
        let currentEffect = quantumBreak
        let switchTime = 3.5
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            if (elapsed > switchTime && currentEffect === quantumBreak) {
              currentEffect = fireStorm
            }

            if (currentEffect && typeof currentEffect.update === 'function') {
              currentEffect.update(deltaTime, elapsed)
            }

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (fireStorm && typeof fireStorm.destroy === 'function') {
              fireStorm.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (quantumBreak && typeof quantumBreak.destroy === 'function') {
            quantumBreak.destroy()
          }
          if (fireStorm && typeof fireStorm.destroy === 'function') {
            fireStorm.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '量子火焰风暴动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
