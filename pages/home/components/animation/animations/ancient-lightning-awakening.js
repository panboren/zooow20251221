/**
 * 远古雷电觉醒动画
 * 组合特效：远古遗迹 + 雷电链
 * 创意：神秘的远古遗迹被雷电唤醒，散发出古老的能量
 */

// 延迟导入，避免 SSR 问题
export default function animateAncientLightningAwakening(props, callbacks) {
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
        const ancientModule = await import('./effects/ancient-ruins')
        const lightningModule = await import('./effects/lightning-chain')
        const particleModule = await import('./effects/particle-system')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createAncientRuins } = ancientModule
        const { createLightningChain } = lightningModule
        const { createExplosionParticles, animateExplosionParticles } = particleModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 40, 100), 120, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'ancient-lightning-awakening' })
          },
          onError,
          '远古雷电觉醒',
          controls
        )

        // 检查特效函数是否存在
        if (typeof createAncientRuins !== 'function' || typeof createLightningChain !== 'function') {
          throw new Error('Required animation effects are not available')
        }

        const ancientRuins = createAncientRuins(scene, {
          pillarCount: 12,
          platformSize: 80
        })

        const lightningChain = createLightningChain(scene, {
          boltCount: 8,
          segmentCount: 50
        })

        // 阶段1: 远古遗迹显现
        if (ancientRuins && typeof ancientRuins.animate === 'function') {
          ancientRuins.animate(2.5)
        }

        tl.to(camera.position, {
          x: 30,
          y: 50,
          z: 75,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '观察遗迹错误'
          )
        })

        // 阶段2: 雷电开始击中遗迹
        tl.call(() => {
          if (lightningChain && typeof lightningChain.animate === 'function') {
            lightningChain.animate(3)
          }
        }, null, '-=1')

        tl.to(camera.position, {
          x: -25,
          y: 45,
          z: 60,
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 10, 0),
            '靠近雷电错误'
          )
        })

        // 阶段3: 能量爆发
        tl.call(() => {
          // 添加能量爆发粒子
          try {
            const explosionParticles = createExplosionParticles(scene, new THREE.Vector3(0, 25, 0), 5000, { h: 0.65, s: 0.9, l: 0.6 })
            animateExplosionParticles(explosionParticles, 2.5)
          } catch (particleError) {
            console.warn('Failed to create explosion particles:', particleError)
          }
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: 15,
          y: 60,
          z: 90,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 15, 0),
            '观看觉醒错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 9
        let currentEffects = [ancientRuins]
        let switchTimes = [2]
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            if (elapsed > switchTimes[0] && currentEffects.length === 1) {
              currentEffects.push(lightningChain)
            }

            currentEffects.forEach(effect => {
              if (effect && typeof effect.update === 'function') {
                effect.update(deltaTime, elapsed)
              }
            })

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (ancientRuins && typeof ancientRuins.destroy === 'function') {
              ancientRuins.destroy()
            }
            if (lightningChain && typeof lightningChain.destroy === 'function') {
              lightningChain.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (ancientRuins && typeof ancientRuins.destroy === 'function') {
            ancientRuins.destroy()
          }
          if (lightningChain && typeof lightningChain.destroy === 'function') {
            lightningChain.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '远古雷电觉醒动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
