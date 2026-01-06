/**
 * 数字雨动画
 * 使用数字雨特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createDigitalRain } from './effects/digital-rain'

export default function animateDigitalRain(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 100), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'digital-rain' })
      },
      onError,
      '数字雨',
      controls,
    )

    // 创建数字雨
    const digitalRain = createDigitalRain(scene, {
      streamCount: 200,
      dropCount: 3000,
    })

    // 阶段1: 相机俯瞰
    tl.to(camera.position, {
      x: 20,
      y: 60,
      z: 50,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机俯瞰错误',
      ),
    })

    // 阶段2: 数字雨启动
    digitalRain.animate(6)

    // 阶段3: 穿越核心
    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 30,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机推进错误',
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
        digitalRain.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        digitalRain.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '数字雨动画执行错误')
    }
    return gsap.timeline()
  }
}
