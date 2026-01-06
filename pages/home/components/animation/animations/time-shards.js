/**
 * 时光碎片动画
 * 使用时光碎片特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createTimeShards } from './effects/time-shards'

export default function animateTimeShards(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 80), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'time-shards' })
      },
      onError,
      '时光碎片',
      controls
    )

    // 创建时光碎片
    const timeShards = createTimeShards(scene, {
      shardCount: 3000,
      timelineRings: 7
    })

    // 阶段1: 相机旋转靠近
    tl.to(camera.position, {
      x: 40,
      y: 30,
      z: 50,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机移动错误'
      )
    })

    // 阶段2: 时光碎片动画
    timeShards.animate(7)

    // 阶段3: 相机环绕观察
    tl.to(camera.position, {
      x: -40,
      y: 30,
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
        timeShards.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        timeShards.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, '时光碎片动画执行错误')
    }
    return gsap.timeline()
  }
}
