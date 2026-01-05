/**
 * 时空穿梭动画
 * 模拟穿越时间时的涟漪和时空扭曲效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateTimeTravel(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(900, 700, 900), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建时空穿梭参数
    const timeRipples = { intensity: 0 }
    const pastFutureShift = { direction: 0 } // -1: 过去, 1: 未来
    const temporalDistortion = { amount: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'time-travel' })
      },
      onError,
      '时空穿梭'
    )

    // 动画阶段1: 接近
    tl.to(camera.position, {
      x: 500,
      y: 400,
      z: 500,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 时间涟漪开始
    tl.to(camera.position, {
      x: 300,
      y: 250,
      z: 300,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '涟漪接近错误'
      )
    }, 1.2)

    tl.to(timeRipples, {
      intensity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    tl.to(temporalDistortion, {
      amount: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    // 调整FOV
    tl.to(camera, {
      fov: 130,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 穿越时间
    tl.to(pastFutureShift, {
      direction: 1,
      duration: 2.5,
      ease: 'power4.inOut'
    }, 2.5)

    tl.to(camera.position, {
      x: 150,
      y: 120,
      z: 150,
      duration: 2.5,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const rippleIntensity = timeRipples.intensity
          const distortionAmount = temporalDistortion.amount
          const shiftDirection = pastFutureShift.direction

          // 时间涟漪效果
          const rippleX = Math.sin(time * 8) * 25 * rippleIntensity
          const rippleY = Math.cos(time * 6) * 20 * rippleIntensity
          const rippleZ = Math.sin(time * 10) * 25 * rippleIntensity

          camera.position.x += rippleX
          camera.position.y += rippleY
          camera.position.z += rippleZ

          // 时空扭曲效果
          const distortX = Math.sin(time * 12) * 30 * distortionAmount * shiftDirection
          const distortY = Math.cos(time * 9) * 25 * distortionAmount * shiftDirection
          const distortZ = Math.sin(time * 15) * 30 * distortionAmount * shiftDirection

          camera.position.x += distortX * 0.5
          camera.position.y += distortY * 0.5
          camera.position.z += distortZ * 0.5

          // 相机旋转
          cameraRotation.x = Math.sin(time * 5) * 0.2 * distortionAmount
          cameraRotation.y += 0.02 * shiftDirection * distortionAmount
          cameraRotation.z = Math.cos(time * 6) * 0.15 * distortionAmount

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '穿越阶段错误'
      )
    }, 2.5)

    // 动画阶段4: 稳定
    tl.to(timeRipples, {
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 5)

    tl.to(temporalDistortion, {
      amount: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 5)

    tl.to(pastFutureShift, {
      direction: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 5)

    tl.to(camera.position, {
      x: 80,
      y: 60,
      z: 80,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()

          // 稳定效果
          const stableX = Math.sin(time * 4) * 10
          const stableY = Math.cos(time * 3) * 8
          const stableZ = Math.sin(time * 5) * 10

          camera.position.x += stableX * 0.2
          camera.position.y += stableY * 0.2
          camera.position.z += stableZ * 0.2

          camera.lookAt(controls.target)
        },
        '稳定阶段错误'
      )
    }, 5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 6.5)

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
    }, 6.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
