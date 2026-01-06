/**
 * 能量球动画
 * 使用能量球特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createEnergySphere } from './effects/energy-sphere'

export default function animateEnergySphere(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 100), 130, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'energy-sphere' })
      },
      onError,
      '能量球',
      controls,
    )

    // 创建能量球
    const energySphere = createEnergySphere(scene, {
      layerCount: 6,
      particleCount: 4000,
    })

    // 阶段1: 相机靠近
    tl.to(camera.position, {
      x: 0,
      y: 30,
      z: 60,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机靠近错误',
      ),
    })

    // 阶段2: 能量球激活
    energySphere.animate(6)

    // 阶段3: 环绕观察
    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机环绕错误',
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
        energySphere.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        energySphere.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '能量球动画执行错误')
    }
    return gsap.timeline()
  }
}
