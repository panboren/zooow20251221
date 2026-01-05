/**
 * 维度折叠动画
 * 模拟空间维度的折叠和展开效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateDimensionFold(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1500, 1000, 1500), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建旋转对象
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dimension-fold' })
      },
      onError,
      '维度折叠'
    )

    // 动画阶段1: 平稳接近
    tl.to(camera.position, {
      x: 600,
      y: 400,
      z: 600,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '相机位置更新错误'
      )
    })

    // 动画阶段2: 维度折叠效果
    tl.to(camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          // 维度扭曲效果 - 随机位移
          const riftX = Math.sin(time * 8) * 10
          const riftY = Math.cos(time * 6) * 8
          const riftZ = Math.sin(time * 7) * 10

          camera.position.x += riftX
          camera.position.y += riftY
          camera.position.z += riftZ

          // 相机随机倾斜
          cameraRotation.x = Math.sin(time * 5) * 0.2
          cameraRotation.y = Math.cos(time * 4) * 0.2
          cameraRotation.z = Math.sin(time * 6) * 0.1

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '维度折叠效果更新错误'
      )
    }, 1.2)

    // 调整FOV
    tl.to(camera, {
      fov: 130,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3)

    // 动画阶段3: 维度展开
    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          // 减少的维度扭曲效果
          const riftX = Math.sin(time * 6) * 3
          const riftY = Math.cos(time * 4) * 2
          const riftZ = Math.sin(time * 5) * 3

          camera.position.x += riftX
          camera.position.y += riftY
          camera.position.z += riftZ

          // 稳定的相机倾斜
          cameraRotation.x = Math.sin(time * 3) * 0.05
          cameraRotation.y = Math.cos(time * 2) * 0.05
          cameraRotation.z = Math.sin(time * 4) * 0.02

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '维度展开效果更新错误'
      )
    }, 3.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 5.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
