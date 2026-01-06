/**
 * 水晶金字塔动画
 * 使用水晶金字塔特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createCrystalPyramid } from './effects/crystal-pyramid'

export default function animateCrystalPyramid(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 100), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'crystal-pyramid' })
      },
      onError,
      '水晶金字塔',
      controls,
    )

    // 创建水晶金字塔
    const crystalPyramid = createCrystalPyramid(scene, {
      particleCount: 3000,
      shardCount: 500,
    })

    // 阶段1: 相机俯瞰
    tl.to(camera.position, {
      x: 30,
      y: 60,
      z: 70,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机俯瞰错误',
      ),
    })

    // 阶段2: 金字塔浮现
    crystalPyramid.animate(7)

    // 阶段3: 环绕欣赏
    tl.to(camera.position, {
      x: -40,
      y: 40,
      z: 60,
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
        crystalPyramid.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        crystalPyramid.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '水晶金字塔动画执行错误')
    }
    return gsap.timeline()
  }
}
