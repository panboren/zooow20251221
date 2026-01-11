/**
 * 赛博能量爆炸动画
 * 组合特效：赛博网格城市 + 能量球 + 粒子爆炸
 * 创意：赛博城市中心能量球突然爆炸，粒子四散
 */

// 延迟导入，避免 SSR 问题
export default function animateCyberEnergyExplosion(props, callbacks) {
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
        const cyberCityModule = await import('./effects/cyber-grid-city')
        const energyModule = await import('./effects/energy-sphere')
        const particleModule = await import('./effects/particle-system')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createCyberGridCity } = cyberCityModule
        const { createEnergySphere } = energyModule
        const { createExplosionParticles, animateExplosionParticles } = particleModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 60, 130), 150, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'cyber-energy-explosion' })
          },
          onError,
          '赛博能量爆炸',
          controls
        )

        const cyberCity = createCyberGridCity(scene, {
          gridSize: 150,
          gridCells: 15,
          buildingCount: 80
        })

        const energySphere = createEnergySphere(scene, {
          layerCount: 5,
          particleCount: 3000
        })

        const particleExplosion = createExplosionParticles(scene, new THREE.Vector3(0, 0, 0), 8000, { h: 0.05, s: 1, l: 0.5 })

        // 阶段1: 赛博城市建造
        cyberCity.animate(2)

        tl.to(camera.position, {
          x: 25,
          y: 70,
          z: 80,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '城市观察错误'
          )
        })

        // 阶段2: 能量球聚集
        tl.call(() => {
          energySphere.animate(2.5)
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: 0,
          y: 50,
          z: 60,
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '靠近能量球错误'
          )
        })

        // 阶段3: 能量爆炸
        tl.call(() => {
          if (energySphere && typeof energySphere.destroy === 'function') {
            energySphere.destroy()
          }
          animateExplosionParticles(particleExplosion, 3.5)
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: -20,
          y: 55,
          z: 90,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '爆炸后相机错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 9
        let currentEffects = [cyberCity]
        let switchTimes = [2, 4.5]
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            // 阶段切换
            if (elapsed > switchTimes[0] && currentEffects.length === 1) {
              currentEffects.push(energySphere)
            }
            if (elapsed > switchTimes[1] && currentEffects.includes(energySphere)) {
              currentEffects = [cyberCity, particleExplosion]
            }

            currentEffects.forEach(effect => {
              if (effect && typeof effect.update === 'function') {
                effect.update(deltaTime, elapsed)
              }
            })

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (cyberCity && typeof cyberCity.destroy === 'function') {
              cyberCity.destroy()
            }
            if (particleExplosion && typeof particleExplosion.destroy === 'function') {
              particleExplosion.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (cyberCity && typeof cyberCity.destroy === 'function') {
            cyberCity.destroy()
          }
          if (energySphere && typeof energySphere.destroy === 'function') {
            energySphere.destroy()
          }
          if (particleExplosion && typeof particleExplosion.destroy === 'function') {
            particleExplosion.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, '赛博能量爆炸动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
