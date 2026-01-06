/**
 * 宇宙超级新星动画
 * 使用宇宙超级新星爆炸特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createCosmicSupernova } from './effects/cosmic-supernova'

export default function animateCosmicSupernova(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 120), 150, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cosmic-supernova' })
      },
      onError,
      '宇宙超级新星',
      controls
    )

    // 创建宇宙超级新星
    const supernova = createCosmicSupernova(scene, {
      particleCount: 15000,
      shockwaveCount: 5
    })

    // 阶段1: 相机推进
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 80,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机推进错误'
      )
    })

    // 阶段2: 超级新星爆炸
    supernova.animate(5)

    // 阶段3: 爆炸后相机后退
    tl.to(camera.position, {
      x: 0,
      y: 30,
      z: 100,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机后退错误'
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
        supernova.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        supernova.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, '宇宙超级新星动画执行错误')
    }
    return gsap.timeline()
  }
}
