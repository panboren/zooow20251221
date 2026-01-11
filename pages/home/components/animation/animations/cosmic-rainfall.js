/**
 * 宇宙雨落动画
 * 组合特效：超级新星爆炸 + 数字雨
 * 创意：宇宙爆炸后，星光如雨般落下
 */

// 延迟导入，避免 SSR 问题
export default function animateCosmicRainfall(props, callbacks) {
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
        const supernovaModule = await import('./effects/cosmic-supernova')
        const digitalRainModule = await import('./effects/digital-rain')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createCosmicSupernova } = supernovaModule
        const { createDigitalRain } = digitalRainModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 50, 120), 150, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'cosmic-rainfall' })
          },
          onError,
          '宇宙雨落',
          controls
        )

        const supernova = createCosmicSupernova(scene, {
          particleCount: 12000,
          shockwaveCount: 3
        })

        const digitalRain = createDigitalRain(scene, {
          streamCount: 150,
          dropCount: 2500
        })

        // 阶段1: 宇宙爆炸
        supernova.animate(3)

        tl.to(camera.position, {
          x: 0,
          y: 30,
          z: 80,
          duration: 2,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '相机推进错误'
          )
        })

        // 阶段2: 星光雨落
        tl.call(() => {
          if (supernova && typeof supernova.destroy === 'function') {
            supernova.destroy()
          }
          digitalRain.animate(4)
        }, null, '-=1')

        tl.to(camera.position, {
          x: 20,
          y: 40,
          z: 60,
          duration: 3,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '相机调整错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 8
        let currentEffect = supernova
        let switchTime = 3.5
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            if (elapsed > switchTime && currentEffect === supernova) {
              currentEffect = digitalRain
            }

            if (currentEffect && typeof currentEffect.update === 'function') {
              currentEffect.update(deltaTime, elapsed)
            }

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (digitalRain && typeof digitalRain.destroy === 'function') {
              digitalRain.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (supernova && typeof supernova.destroy === 'function') {
            supernova.destroy()
          }
          if (digitalRain && typeof digitalRain.destroy === 'function') {
            digitalRain.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '宇宙雨落动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
