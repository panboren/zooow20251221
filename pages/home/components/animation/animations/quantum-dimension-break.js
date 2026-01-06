/**
 * 量子维度分裂动画
 * 使用量子维度分裂特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createQuantumDimensionBreak } from './effects/quantum-dimension-break'

export default function animateQuantumDimensionBreak(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 60, 100), 150, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-dimension-break' })
      },
      onError,
      '量子维度分裂',
      controls,
    )

    // 创建量子维度分裂
    const dimensionBreak = createQuantumDimensionBreak(scene, {
      segmentCount: 12,
      shardCount: 2000,
    })

    // 阶段1: 相机靠近
    tl.to(camera.position, {
      x: 0,
      y: 30,
      z: 60,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机移动错误',
      ),
    })

    // 阶段2: 维度分裂动画
    dimensionBreak.animate(5)

    // 阶段3: 相机环绕
    tl.to(camera.position, {
      x: 50,
      y: 40,
      z: 0,
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
        dimensionBreak.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      else {
        dimensionBreak.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  }
  catch (error) {
    if (onError) {
      onError(error, '量子维度分裂动画执行错误')
    }
    return gsap.timeline()
  }
}
