/**
 * 银河时光传送门动画
 * 组合特效：银河漩涡 + 时光碎片 + 传送门
 * 创意：时光碎片在银河中旋转，形成传送门穿越时空
 */

// 延迟导入，避免 SSR 问题
export default function animateGalaxyTimePortal(props, callbacks) {
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
        const galaxyModule = await import('./effects/galaxy-vortex')
        const timeShardsModule = await import('./effects/time-shards')
        const portalModule = await import('./effects/portal-gate')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createGalaxyVortex } = galaxyModule
        const { createTimeShards } = timeShardsModule
        const { createPortalGate } = portalModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 40, 110), 140, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'galaxy-time-portal' })
          },
          onError,
          '银河时光传送门',
          controls
        )

        const galaxyVortex = createGalaxyVortex(scene, {
          particleCount: 10000,
          spiralCount: 5
        })

        const timeShards = createTimeShards(scene, {
          shardCount: 500,
          fragmentCount: 3000
        })

        const portalGate = createPortalGate(scene, {
          ringCount: 4,
          particleCount: 2500
        })

        // 阶段1: 银河漩涡启动
        galaxyVortex.animate(2.5)

        tl.to(camera.position, {
          x: 20,
          y: 50,
          z: 70,
          duration: 2.5,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '银河观察错误'
          )
        })

        // 阶段2: 时光碎片出现
        tl.call(() => {
          timeShards.animate(2.5)
        }, null, '-=1')

        tl.to(camera.position, {
          x: 0,
          y: 35,
          z: 50,
          duration: 2,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '靠近时光碎片错误'
          )
        })

        // 阶段3: 传送门开启
        tl.call(() => {
          if (timeShards && typeof timeShards.destroy === 'function') {
            timeShards.destroy()
          }
          portalGate.animate(3)
        }, null, '-=1')

        tl.to(camera.position, {
          x: 10,
          y: 30,
          z: -10,
          duration: 2,
          ease: 'power3.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '进入传送门错误'
          )
        })

        // 阶段4: 穿越传送门
        tl.to(camera.position, {
          x: -15,
          y: 45,
          z: 70,
          duration: 2.5,
          ease: 'power3.out',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '穿越后相机错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 10
        let currentEffects = [galaxyVortex]
        let switchTimes = [2, 4, 6]
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            // 阶段切换
            if (elapsed > switchTimes[0] && currentEffects.length === 1) {
              currentEffects.push(timeShards)
            }
            if (elapsed > switchTimes[1] && currentEffects.includes(timeShards)) {
              currentEffects = [galaxyVortex, portalGate]
            }
            if (elapsed > switchTimes[2]) {
              currentEffects = [portalGate]
            }

            currentEffects.forEach(effect => {
              if (effect && typeof effect.update === 'function') {
                effect.update(deltaTime, elapsed)
              }
            })

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (galaxyVortex && typeof galaxyVortex.destroy === 'function') {
              galaxyVortex.destroy()
            }
            if (portalGate && typeof portalGate.destroy === 'function') {
              portalGate.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (galaxyVortex && typeof galaxyVortex.destroy === 'function') {
            galaxyVortex.destroy()
          }
          if (timeShards && typeof timeShards.destroy === 'function') {
            timeShards.destroy()
          }
          if (portalGate && typeof portalGate.destroy === 'function') {
            portalGate.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '银河时光传送门动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
