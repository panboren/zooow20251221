/**
 * 眩晕相机动画
 * 模拟眩晕时的旋转和色彩偏移效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateDizzyCam(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从上方开始
    setupInitialCamera(camera, new THREE.Vector3(0, 300, 100), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建旋转对象
    const cameraRotation = { x: 0, y: 0, z: 0, spinSpeed: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dizzy-cam' })
      },
      onError,
      '眩晕相机'
    )

    // 动画阶段1: 开始旋转
    tl.to(cameraRotation, {
      spinSpeed: 0.5,
      duration: 1,
      ease: 'power2.in'
    })

    tl.to(camera.position, {
      x: 50,
      y: 50,
      z: 50,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const spinAmount = cameraRotation.spinSpeed

          // 旋转效果
          cameraRotation.x = Math.sin(time * 10 * spinAmount) * 0.3
          cameraRotation.y += 0.02 * spinAmount
          cameraRotation.z = Math.cos(time * 8 * spinAmount) * 0.2

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '旋转阶段错误'
      )
    }, 0.5)

    // 调整FOV
    tl.to(camera, {
      fov: 130,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2)

    // 动画阶段2: 旋转加速
    tl.to(cameraRotation, {
      spinSpeed: 1,
      duration: 1,
      ease: 'power2.in'
    }, 2.5)

    tl.to(camera.position, {
      x: 20,
      y: 20,
      z: 20,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const spinAmount = cameraRotation.spinSpeed

          // 加速旋转效果
          cameraRotation.x = Math.sin(time * 15 * spinAmount) * 0.4
          cameraRotation.y += 0.03 * spinAmount
          cameraRotation.z = Math.cos(time * 12 * spinAmount) * 0.3

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '加速旋转阶段错误'
      )
    }, 2.5)

    // 动画阶段3: 减速并稳定
    tl.to(cameraRotation, {
      spinSpeed: 0.1,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera.position, {
      x: 5,
      y: 5,
      z: 5,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const spinAmount = cameraRotation.spinSpeed

          // 减速旋转效果
          cameraRotation.x = Math.sin(time * 8 * spinAmount) * 0.15
          cameraRotation.y += 0.01 * spinAmount
          cameraRotation.z = Math.cos(time * 6 * spinAmount) * 0.1

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '减速稳定阶段错误'
      )
    }, 4.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 6)

  } catch (error) {
    if (onError) onError(error)
  }
}
