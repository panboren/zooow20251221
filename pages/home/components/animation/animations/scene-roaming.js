/**
 * 场景漫游动画
 * 模拟在场景中漫游的自由视角效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateSceneRoaming(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从高处开始
    setupInitialCamera(camera, new THREE.Vector3(100, 200, 100), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建漫游路径点
    const pathPoints = [
      new THREE.Vector3(100, 200, 100),
      new THREE.Vector3(150, 150, 50),
      new THREE.Vector3(100, 100, -50),
      new THREE.Vector3(0, 80, -100),
      new THREE.Vector3(-100, 100, -50),
      new THREE.Vector3(-150, 150, 50),
      new THREE.Vector3(-100, 200, 100),
      new THREE.Vector3(0, 150, 150)
    ]

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'scene-roaming' })
      },
      onError,
      '场景漫游'
    )

    // 动画阶段1: 沿路径漫游
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const start = pathPoints[i]
      const end = pathPoints[i + 1]

      tl.to(camera.position, {
        x: end.x,
        y: end.y,
        z: end.z,
        duration: 0.8,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
          () => {
            // 平滑转向下一个点
            const nextPoint = pathPoints[Math.min(i + 2, pathPoints.length - 1)]
            camera.lookAt(nextPoint)
          },
          `漫游点 ${i + 1} 错误`
        )
      }, i * 0.8)
    }

    // 调整FOV
    tl.to(camera, {
      fov: 100,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3)

    // 动画阶段2: 逐渐接近目标
    tl.to(camera.position, {
      x: 20,
      y: 15,
      z: 20,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近目标错误'
      )
    }, 6)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 8)

    // 动画阶段3: 最终定位
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
    }, 8.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
