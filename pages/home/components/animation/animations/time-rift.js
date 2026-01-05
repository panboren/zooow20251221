/**
 * 时空裂缝动画
 * 模拟时空裂缝和现实重组效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateTimeRift(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1200, 800, 1200), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建辅助变量
    const riftIntensity = { value: 0 }
    const fragmentCount = { value: 0 }
    const realityStability = { value: 1 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'time-rift' })
      },
      onError,
      '时空裂缝'
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
        '接近阶段错误'
      )
    })

    // 动画阶段2: 时空裂缝形成
    tl.to(riftIntensity, {
      value: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.2)

    tl.to(camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 1.5,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const riftAmount = riftIntensity.value

          // 时空扭曲效果 - 随机位移
          const riftX = Math.sin(time * 15) * 20 * riftAmount
          const riftY = Math.cos(time * 12) * 15 * riftAmount
          const riftZ = Math.sin(time * 18) * 20 * riftAmount

          camera.position.x += riftX
          camera.position.y += riftY
          camera.position.z += riftZ

          // 相机随机倾斜
          cameraRotation.x = Math.sin(time * 8) * 0.3 * riftAmount
          cameraRotation.y = Math.cos(time * 6) * 0.3 * riftAmount
          cameraRotation.z = Math.sin(time * 10) * 0.2 * riftAmount

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '时空裂缝效果更新错误'
      )
    }, 1.2)

    // 动画阶段3: 时间碎片化
    tl.to(fragmentCount, {
      value: 100,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(realityStability, {
      value: 0.2,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.5)

    tl.to(camera, {
      fov: 130,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段4: 现实重组
    tl.to(realityStability, {
      value: 0.8,
      duration: 1.5,
      ease: 'power2.out'
    }, 3.5)

    tl.to(riftIntensity, {
      value: 0.4,
      duration: 1.5,
      ease: 'power2.out'
    }, 3.5)

    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const riftAmount = riftIntensity.value
          const stability = realityStability.value

          // 减少的时空扭曲效果
          const riftX = Math.sin(time * 8) * 5 * riftAmount
          const riftY = Math.cos(time * 6) * 4 * riftAmount
          const riftZ = Math.sin(time * 10) * 5 * riftAmount

          camera.position.x += riftX * stability
          camera.position.y += riftY * stability
          camera.position.z += riftZ * stability

          // 稳定的相机倾斜
          cameraRotation.x = Math.sin(time * 4) * 0.1 * riftAmount
          cameraRotation.y = Math.cos(time * 3) * 0.1 * riftAmount
          cameraRotation.z = Math.sin(time * 5) * 0.05 * riftAmount

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '现实重组效果更新错误'
      )
    }, 3.5)

    // 动画阶段5: 最终稳定
    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 5)

    tl.to(riftIntensity, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(fragmentCount, {
      value: 0,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

    tl.to(realityStability, {
      value: 1,
      duration: 0.5,
      ease: 'power1.out'
    }, 5)

  } catch (error) {
    if (onError) onError(error)
  }
}
