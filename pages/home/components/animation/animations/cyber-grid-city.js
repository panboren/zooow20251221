/**
 * 赛博网格城市动画
 * 使用赛博网格城市特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createCyberGridCity } from './effects/cyber-grid-city'

export default function animateCyberGridCity(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 120), 150, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cyber-grid-city' })
      },
      onError,
      '赛博网格城市',
      controls
    )

    // 创建赛博网格城市
    const cyberCity = createCyberGridCity(scene, {
      gridSize: 200,
      gridCells: 20,
      buildingCount: 100
    })

    // 阶段1: 相机俯瞰
    tl.to(camera.position, {
      x: 30,
      y: 80,
      z: 50,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机俯瞰错误'
      )
    })

    // 阶段2: 城市建造动画
    cyberCity.animate(6)

    // 阶段3: 飞行游览
    tl.to(camera.position, {
      x: -30,
      y: 60,
      z: 40,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机飞行错误'
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
        cyberCity.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        cyberCity.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, '赛博网格城市动画执行错误')
    }
    return gsap.timeline()
  }
}
