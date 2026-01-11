/**
 * DNA量子进化动画
 * 组合特效：DNA双螺旋 + 量子维度破碎
 * 创意：DNA在量子维度中进化，揭示生命与宇宙的奥秘
 */

// 延迟导入，避免 SSR 问题
export default function animateDNAQuantumEvolution(props, callbacks) {
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
        const dnaModule = await import('./effects/dna-helix')
        const quantumModule = await import('./effects/quantum-dimension-break')
        const energyModule = await import('./effects/energy-sphere')

        const THREE = threeModule.default || threeModule
        const gsap = gsapModule.gsap || gsapModule
        const { createTimeline, setupInitialCamera, safeCameraTransform } = utilsModule
        const { createDNAHelix } = dnaModule
        const { createQuantumDimensionBreak } = quantumModule
        const { createEnergySphere } = energyModule

        const { camera, renderer, scene, controls } = props
        const { onComplete, onError } = callbacks || {}

        setupInitialCamera(camera, new THREE.Vector3(0, 0, 80), 100, controls)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)

        const tl = createTimeline(
          () => {
            if (onComplete) onComplete({ type: 'dna-quantum-evolution' })
          },
          onError,
          'DNA量子进化',
          controls
        )

        // 检查特效函数是否存在
        if (typeof createDNAHelix !== 'function' || typeof createQuantumDimensionBreak !== 'function' || typeof createEnergySphere !== 'function') {
          throw new Error('Required animation effects are not available')
        }

        const dnaHelix = createDNAHelix(scene, {
          helixCount: 2,
          basePairCount: 20,
          particleCount: 4000
        })

        const quantumDimension = createQuantumDimensionBreak(scene, {
          fragmentCount: 2500,
          dimensionCount: 3
        })

        const energySphere = createEnergySphere(scene, {
          layerCount: 4,
          particleCount: 2000
        })

        // 阶段1: DNA螺旋显现
        if (dnaHelix && typeof dnaHelix.animate === 'function') {
          dnaHelix.animate(2.5)
        }

        tl.to(camera.position, {
          x: -20,
          y: 10,
          z: 60,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '观察DNA错误'
          )
        })

        // 阶段2: 量子维度出现
        tl.call(() => {
          if (quantumDimension && typeof quantumDimension.animate === 'function') {
            quantumDimension.animate(2.5)
          }
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: 25,
          y: -5,
          z: 50,
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '进入量子维度错误'
          )
        })

        // 阶段3: 能量球融合
        tl.call(() => {
          if (energySphere && typeof energySphere.animate === 'function') {
            energySphere.animate(2)
          }
        }, null, '-=0.5')

        tl.to(camera.position, {
          x: 0,
          y: 5,
          z: 65,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: () => safeCameraTransform(
            () => camera.lookAt(0, 0, 0),
            '观察进化错误'
          )
        })

        // 持续更新
        let startTime = null
        const duration = 9
        let currentEffects = [dnaHelix]
        let switchTimes = [2.5, 4]
        let animationId = null

        const animate = (time) => {
          if (!startTime) startTime = time
          const elapsed = (time - startTime) / 1000

          if (elapsed < duration) {
            const deltaTime = 0.016

            if (elapsed > switchTimes[0] && currentEffects.length === 1) {
              currentEffects.push(quantumDimension)
            }
            if (elapsed > switchTimes[1] && currentEffects.includes(quantumDimension)) {
              currentEffects.push(energySphere)
            }

            currentEffects.forEach(effect => {
              if (effect && typeof effect.update === 'function') {
                effect.update(deltaTime, elapsed)
              }
            })

            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
          } else {
            if (dnaHelix && typeof dnaHelix.destroy === 'function') {
              dnaHelix.destroy()
            }
            if (quantumDimension && typeof quantumDimension.destroy === 'function') {
              quantumDimension.destroy()
            }
            if (energySphere && typeof energySphere.destroy === 'function') {
              energySphere.destroy()
            }
          }
        }

        animationId = requestAnimationFrame(animate)

        // 添加清理方法
        tl.destroy = () => {
          if (animationId) {
            cancelAnimationFrame(animationId)
          }
          if (dnaHelix && typeof dnaHelix.destroy === 'function') {
            dnaHelix.destroy()
          }
          if (quantumDimension && typeof quantumDimension.destroy === 'function') {
            quantumDimension.destroy()
          }
          if (energySphere && typeof energySphere.destroy === 'function') {
            energySphere.destroy()
          }
        }

        resolve(tl)
      } catch (error) {
        if (callbacks && callbacks.onError) {
          callbacks.onError(error, 'DNA量子进化动画执行错误')
        }
        reject(error)
      }
    }

    loadAnimation()
  })
}
