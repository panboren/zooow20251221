/**
 * 远古遗迹动画
 * 使用远古遗迹特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createAncientRuins } from './effects/ancient-ruins'

export default function animateAncientRuins(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 60, 100), 140, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'ancient-ruins' })
      },
      onError,
      '远古遗迹',
      controls
    )

    // 创建远古遗迹
    const ruins = createAncientRuins(scene, {
      pillarCount: 12,
      ruinCount: 30
    })

    // 阶段1: 相机俯瞰
    tl.to(camera.position, {
      x: 20,
      y: 40,
      z: 70,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机俯瞰错误'
      )
    })

    // 阶段2: 遗迹重现动画
    ruins.animate(7)

    // 阶段3: 环绕探索
    tl.to(camera.position, {
      x: -40,
      y: 30,
      z: 60,
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
        ruins.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        ruins.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, '远古遗迹动画执行错误')
    }
    return gsap.timeline()
  }
}
