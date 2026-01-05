/**
 * 史诗俯冲动画
 * 从高空快速俯冲到目标位置
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateEpicDive(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处开始
    setupInitialCamera(camera, new THREE.Vector3(0, 200, 200), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        // 动画完成
        if (onComplete) onComplete({ type: 'epic-dive' })
      },
      onError,
      '史诗俯冲',
      controls
    )

    // 动画阶段1: 快速接近
    tl.to(camera.position, {
      x: 50,
      y: 50,
      z: 50,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '相机位置更新错误'
      )
    })

    // 动画阶段2: 减速并调整视角
    tl.to(camera.position, {
      x: 20,
      y: 20,
      z: 20,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '视角调整错误'
      )
    }, 2)

    // 调整FOV
    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3.5)

    // 动画阶段3: 最终精确定位
    tl.to(camera.position, {
      x: 5,
      y: 5,
      z: 5,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '精确定位错误'
      )
    }, 4)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 5.5)

    // 动画阶段4: 平滑过渡到最终位置
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 1,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '最终定位错误'
      )
    }, 6)

  } catch (error) {
    if (onError) onError(error)
  }
}
