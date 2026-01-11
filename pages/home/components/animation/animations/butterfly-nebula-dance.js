/**
 * 蝴蝶星云之舞动画
 * 组合特效：蝴蝶群 + 星云漩涡
 * 创意：成群的蝴蝶在绚丽的星云漩涡中翩翩起舞
 */

// 延迟导入，避免 SSR 问题
export default function animateButterflyNebulaDance(props, callbacks) {
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
        const butterflyModule = await import('./effects/butterfly-swarm')
        const nebulaModule = await import('./effects/nebula-vortex')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createButterflySwarm } = butterflyModule
        const { createNebulaVortex } = nebulaModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 15, 70), 80, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
            () => {
              if (onComplete) onComplete({ type: 'butterfly-nebula-dance' })
            },
            onError,
            '蝴蝶星云之舞',
            controls
        )

        // 检查特效函数是否存在
        if (typeof createButterflySwarm !== 'function' || typeof createNebulaVortex !== 'function') {
          throw new Error('Required animation effects are not available')
        }

        const nebulaVortex = createNebulaVortex(scene, {
          particleCount: 6000,
          armCount: 5
        })

        const butterflySwarm = createButterflySwarm(scene, {
          butterflyCount: 300,
          wingColor: { h: 0.85, s: 0.8, l: 0.7 }
        })

        // 验证创建的对象是否有效
        if (!butterflySwarm || !butterflySwarm.butterflies || butterflySwarm.butterflies.length === 0) {
          throw new Error('Butterfly swarm creation failed')
        }

        if (!nebulaVortex) {
          throw new Error('Nebula vortex creation failed')
        }

        // 阶段1: 星云开始旋转
        if (nebulaVortex && typeof nebulaVortex.animate === 'function') {
          nebulaVortex.animate(2.5)
        }

        tl.to(camera.position, {
          x: 25,
          y: 20,
          z: 55,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
              () => camera.lookAt(0, 0, 0),
              '观察星云错误'
          )
        })

        // 阶段2: 蝴蝶出现
        tl.call(() => {
          if (butterflySwarm && typeof butterflySwarm.animate === 'function') {
            butterflySwarm.animate(3.5)
          }
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: -20,
          y: 25,
          z: 45,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
              () => camera.lookAt(0, 5, 0),
              '跟随蝴蝶错误'
          )
        })

        // 阶段3: 蝴蝶在星云中飞舞
        tl.to(camera.position, {
          x: 10,
          y: 18,
          z: 60,
          duration: 3,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
              () => camera.lookAt(0, 0, 0),
              '欣赏舞蹈错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 10
        let currentEffects = [nebulaVortex]
        let switchTimes = [2.5]
        let animationId = null
        let isDestroyed = false

        const animate = (time) => {
          if (isDestroyed) return

          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration && !isDestroyed) {
            const deltaTime = 0.016

            if (elapsed > switchTimes[0] && currentEffects.length === 1) {
              currentEffects.push(butterflySwarm)
            }

            try {
              currentEffects.forEach(effect => {
                if (effect && typeof effect.update === 'function') {
                  // 添加额外的安全检查，防止访问已销毁的对象
                  try {
                    // 检查特效是否已被销毁
                    if (effect.isDestroyed === true) {
                      return
                    }

                    // 对于 butterflySwarm，额外检查 butterflies 数组
                    if (effect.butterflies) {
                      if (!Array.isArray(effect.butterflies) || effect.butterflies.length === 0) {
                        return
                      }
                    }

                    effect.update(deltaTime, elapsed)
                  } catch (effectError) {
                    console.error('Error updating individual effect:', effectError)
                    // 单个特效出错不应阻止其他特效更新
                  }
                }
              })
            } catch (updateError) {
              console.error('Error in animation update:', updateError)
              if (callbacks && callbacks.onError) {
                callbacks.onError(updateError, '动画更新错误')
              }
              // 发生错误时立即清理资源并停止动画
              isDestroyed = true
              if (animationId) {
                cancelAnimationFrame(animationId)
                animationId = null
              }
              cleanupEffects()
              return
            }

            try {
              renderer.render(scene, camera)
            } catch (renderError) {
              console.error('Error in rendering:', renderError)
              if (callbacks && callbacks.onError) {
                callbacks.onError(renderError, '渲染错误')
              }
              // 发生错误时立即清理资源并停止动画
              isDestroyed = true
              if (animationId) {
                cancelAnimationFrame(animationId)
                animationId = null
              }
              cleanupEffects()
              return
            }

            if (!isDestroyed) {
              animationId = requestAnimationFrame(animate)
            }
          } else {
            // 确保在动画结束时也进行清理
            if (!isDestroyed) {
              cleanupEffects()
            }
          }
        }

        const cleanupEffects = () => {
          if (isDestroyed) return

          isDestroyed = true

          // 标记特效为已销毁
          if (nebulaVortex) nebulaVortex.isDestroyed = true
          if (butterflySwarm) butterflySwarm.isDestroyed = true

          if (nebulaVortex && typeof nebulaVortex.destroy === 'function') {
            try {
              nebulaVortex.destroy()
            } catch (e) {
              console.error('Error destroying nebula vortex:', e)
            }
          }
          if (butterflySwarm && typeof butterflySwarm.destroy === 'function') {
            try {
              butterflySwarm.destroy()
            } catch (e) {
              console.error('Error destroying butterfly swarm:', e)
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          cleanupEffects()
          if (animationId) {
            cancelAnimationFrame(animationId)
            animationId = null
          }
          // 重置状态变量
          startTime = null
          currentEffects = []
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '蝴蝶星云之舞动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
