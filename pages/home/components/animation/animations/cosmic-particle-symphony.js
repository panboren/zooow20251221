/**
 * 宇宙粒子交响曲动画
 * 使用宇宙粒子交响曲特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createCosmicParticleSymphony } from './effects/cosmic-particle-symphony'

export default function animateCosmicParticleSymphony(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 100), 140, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-particle-symphony' })
      },
      onError,
      '宇宙粒子交响曲',
      controls
    )

    // 创建宇宙粒子交响曲
    const particleSymphony = createCosmicParticleSymphony(scene, {
      particleCount: 20000,
      waveLayers: 5
    })

    // 阶段1: 相机推进
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 60,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机推进错误'
      )
    })

    // 阶段2: 粒子交响曲动画
    particleSymphony.animate(7)

    // 阶段3: 相机环绕欣赏
    tl.to(camera.position, {
      x: 50,
      y: 40,
      z: 50,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机环绕错误'
      )
    })

    // 持续更新
    let startTime = null
    const duration = 8

    const animate = (time) => {
      if (!startTime) startTime = time
      const elapsed = (time - startTime) / 1000

      if (elapsed < duration) {
        const deltaTime = 0.016
        particleSymphony.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        particleSymphony.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, '宇宙粒子交响曲动画执行错误')
    }
    return gsap.timeline()
  }
}
