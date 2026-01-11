/**
 * 超空间传送门动画
 * 组合特效：超空间曲速驱动 + 传送门
 * 创意：穿越超空间后通过传送门到达新世界
 */

// 延迟导入，避免 SSR 问题
export default function animateHyperspacePortal(props, callbacks) {
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
        const warpDriveModule = await import('./effects/hyperspace-warp-drive')
        const portalModule = await import('./effects/portal-gate')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createHyperspaceWarpDrive } = warpDriveModule
        const { createPortalGate } = portalModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 0, -100), 120, controls)
        camera.lookAt(0, 0, 100)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'hyperspace-portal' })
          },
          onError,
          '超空间传送门',
          controls
        )

        const warpDrive = createHyperspaceWarpDrive(scene, {
          starCount: 8000,
          tunnelLength: 150
        })

        const portalGate = createPortalGate(scene, {
          ringCount: 5,
          particleCount: 3000
        })

        // 阶段1: 超空间穿梭
        warpDrive.animate(4)

        tl.to(camera.position, {
          z: 30,
          duration: 4,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 100),
            '超空间穿梭错误'
          )
        })

        // 阶段2: 传送门出现
        tl.call(() => {
          if (warpDrive && typeof warpDrive.destroy === 'function') {
            warpDrive.destroy()
          }
          portalGate.animate(3)
        }, null, '-=1')

        tl.to(camera.position, {
          z: -20,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '传送门进入错误'
          )
        })

        // 阶段3: 通过传送门
        tl.to(camera.position, {
          z: 80,
          duration: 2.5,
          ease: 'power3.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '穿越传送门错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 9
        let currentEffect = warpDrive
        let switchTime = 3.5
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            if (elapsed > switchTime && currentEffect === warpDrive) {
              currentEffect = portalGate
            }

            if (currentEffect && typeof currentEffect.update === 'function') {
              currentEffect.update(deltaTime, elapsed)
            }

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
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
          if (warpDrive && typeof warpDrive.destroy === 'function') {
            warpDrive.destroy()
          }
          if (portalGate && typeof portalGate.destroy === 'function') {
            portalGate.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '超空间传送门动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
