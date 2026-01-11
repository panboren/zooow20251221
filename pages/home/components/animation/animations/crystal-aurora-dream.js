/**
 * 极光水晶梦境动画
 * 组合特效：水晶金字塔 + 极光流体
 * 创意：神秘的水晶金字塔在极光中缓缓升起，散发着梦幻光芒
 */

// 延迟导入，避免 SSR 问题
export default function animateCrystalAuroraDream(props, callbacks) {
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
        const crystalModule = await import('./effects/crystal-pyramid')
        const auroraModule = await import('./effects/aurora-fluid')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createCrystalPyramid } = crystalModule
        const { createAuroraFluid } = auroraModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 20, 80), 100, controls)
        camera.lookAt(0, 10, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'crystal-aurora-dream' })
          },
          onError,
          '极光水晶梦境',
          controls
        )

        // 检查特效函数是否存在
        if (typeof createCrystalPyramid !== 'function' || typeof createAuroraFluid !== 'function') {
          throw new Error('Required animation effects are not available')
        }

        const aurora = createAuroraFluid(scene, {
          waveCount: 8,
          particleCount: 4000
        })

        const crystalPyramid = createCrystalPyramid(scene, {
          layerCount: 6,
          particleCount: 5000
        })

        // 阶段1: 极光开始舞动
        if (aurora && typeof aurora.animate === 'function') {
          aurora.animate(3)
        }

        tl.to(camera.position, {
          x: -15,
          y: 25,
          z: 60,
          duration: 2.5,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 10, 0),
            '观察极光错误'
          )
        })

        // 阶段2: 水晶金字塔升起
        tl.call(() => {
          if (crystalPyramid && typeof crystalPyramid.animate === 'function') {
            crystalPyramid.animate(3.5)
          }
        }, null, '-=1')

        tl.to(camera.position, {
          x: 0,
          y: 35,
          z: 45,
          duration: 2,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 15, 0),
            '靠近水晶错误'
          )
        })

        // 阶段3: 水晶与极光融合
        tl.to(camera.position, {
          x: 20,
          y: 30,
          z: 55,
          duration: 2.5,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 10, 0),
            '环绕水晶错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 10
        let currentEffects = [aurora]
        let switchTime = 3
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            if (elapsed > switchTime && currentEffects.length === 1) {
              currentEffects.push(crystalPyramid)
            }

            currentEffects.forEach(effect => {
              if (effect && typeof effect.update === 'function') {
                effect.update(deltaTime, elapsed)
              }
            })

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (aurora && typeof aurora.destroy === 'function') {
              aurora.destroy()
            }
            if (crystalPyramid && typeof crystalPyramid.destroy === 'function') {
              crystalPyramid.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (aurora && typeof aurora.destroy === 'function') {
            aurora.destroy()
          }
          if (crystalPyramid && typeof crystalPyramid.destroy === 'function') {
            crystalPyramid.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '极光水晶梦境动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
