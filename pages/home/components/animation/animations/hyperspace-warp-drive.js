/**
 * 超空间曲速驱动动画
 * 使用超空间曲速驱动特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createHyperspaceWarpDrive } from './effects/hyperspace-warp-drive'

export default function animateHyperspaceWarpDrive(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, -80), 100, controls)
    camera.lookAt(0, 0, 100)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'hyperspace-warp-drive' })
      },
      onError,
      '超空间曲速驱动',
      controls
    )

    // 创建超空间曲速驱动
    const warpDrive = createHyperspaceWarpDrive(scene, {
      starCount: 10000,
      tunnelLength: 200
    })

    // 阶段1: 曲速启动
    tl.to(camera.position, {
      z: 50,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 100),
        '相机推进错误'
      )
    })

    // 阶段2: 曲速驱动动画
    warpDrive.animate(6)

    // 阶段3: 曲速结束
    tl.to(camera.position, {
      z: 0,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 100),
        '相机减速错误'
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
        warpDrive.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        warpDrive.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, '超空间曲速驱动动画执行错误')
    }
    return gsap.timeline()
  }
}
