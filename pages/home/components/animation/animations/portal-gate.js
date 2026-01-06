/**
 * 传送门动画
 * 使用传送门特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createPortalGate } from './effects/portal-gate'

export default function animatePortalGate(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 80), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'portal-gate' })
      },
      onError,
      '传送门',
      controls,
    )

    // 创建传送门
    const portal = createPortalGate(scene, {
      ringCount: 8,
      portalParticleCount: 5000,
    })

    // 阶段1: 相机靠近
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 40,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机靠近错误',
      ),
    })

    // 阶段2: 传送门开启
    portal.animate(6)

    // 阶段3: 穿越传送门
    tl.to(camera.position, {
      x: 0,
      y: 10,
      z: 15,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机穿越错误',
      ),
    })

    // 持续更新
    let startTime = null
    const duration = 8

    const animate = (time) => {
      if (!startTime) startTime = time
      const elapsed = (time - startTime) / 1000

      if (elapsed < duration) {
        const deltaTime = 0.016
        portal.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        portal.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '传送门动画执行错误')
    }
    return gsap.timeline()
  }
}
