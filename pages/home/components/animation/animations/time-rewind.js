/**
 * 时空逆流动画
 * 模拟时间倒流和因果律混乱效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateTimeRewind(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1000, 800, 1000), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建时间逆流参数
    const reverseFlow = { intensity: 0, direction: 0 } // -1: 倒流, 1: 正流
    const temporalFragments = { density: 0, disorder: 0 }
    const causalityLoop = { instability: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    // 创建时间点用于因果律倒流
    const timePoints = [
      new THREE.Vector3(700, 500, 700),
      new THREE.Vector3(500, 400, 500),
      new THREE.Vector3(300, 250, 300),
      new THREE.Vector3(150, 120, 150),
      new THREE.Vector3(80, 60, 80),
      new THREE.Vector3(30, 20, 30)
    ]

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'time-rewind' })
      },
      onError,
      '时空逆流'
    )

    // 动画阶段1: 接近
    tl.to(camera.position, {
      x: 600,
      y: 500,
      z: 600,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 开始时间逆流
    tl.to(camera.position, {
      x: 400,
      y: 320,
      z: 400,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()

          // 时间逆流开始效果
          const reverseX = Math.sin(time * 5) * 15 * reverseFlow.intensity
          const reverseY = Math.cos(time * 4) * 12 * reverseFlow.intensity
          const reverseZ = Math.sin(time * 6) * 15 * reverseFlow.intensity

          camera.position.x -= reverseX * 0.3
          camera.position.y -= reverseY * 0.3
          camera.position.z -= reverseZ * 0.3

          camera.lookAt(controls.target)
        },
        '逆流开始错误'
      )
    }, 1.2)

    tl.to(reverseFlow, {
      intensity: 1,
      direction: -0.5,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    tl.to(temporalFragments, {
      density: 1,
      disorder: 0.3,
      duration: 1,
      ease: 'power2.in'
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

    // 动画阶段3: 快速时间倒流
    tl.to(reverseFlow, {
      direction: -1,
      duration: 2,
      ease: 'power4.inOut'
    }, 2.5)

    tl.to(causalityLoop, {
      instability: 1,
      duration: 2,
      ease: 'power4.inOut'
    }, 2.5)

    // 在时间线上逆流
    for (let i = 0; i < timePoints.length - 1; i++) {
      const startPoint = timePoints[i]
      const endPoint = timePoints[i + 1]

      tl.to(camera.position, {
        x: endPoint.x,
        y: endPoint.y,
        z: endPoint.z,
        duration: 0.5,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
          () => {
            const time = tl.time()
            const reverseAmount = Math.abs(reverseFlow.direction)
            const instabilityAmount = causalityLoop.instability

            // 时间逆流增强效果
            const reverseX = Math.sin(time * 10) * 18 * reverseAmount
            const reverseY = Math.cos(time * 8) * 15 * reverseAmount
            const reverseZ = Math.sin(time * 12) * 18 * reverseAmount

            camera.position.x -= reverseX * 0.5
            camera.position.y -= reverseY * 0.5
            camera.position.z -= reverseZ * 0.5

            // 因果律混乱效果
            const chaosX = (Math.random() - 0.5) * 25 * instabilityAmount
            const chaosY = (Math.random() - 0.5) * 25 * instabilityAmount
            const chaosZ = (Math.random() - 0.5) * 25 * instabilityAmount

            camera.position.x += chaosX
            camera.position.y += chaosY
            camera.position.z += chaosZ

            // 相机旋转混乱
            cameraRotation.x = Math.sin(time * 5) * 0.25 * instabilityAmount
            cameraRotation.y += 0.02 * reverseAmount * instabilityAmount
            cameraRotation.z = Math.cos(time * 6) * 0.15 * instabilityAmount

            camera.rotation.set(
              cameraRotation.x,
              cameraRotation.y,
              cameraRotation.z
            )

            camera.lookAt(controls.target)
          },
          `时间点 ${i + 1} 错误`
        )
      }, 2.8 + i * 0.5)

      // 视觉冲击效果
      tl.to(camera, {
        opacity: 0.8,
        duration: 0.1,
        ease: 'power1.inOut'
      }, 2.8 + i * 0.5 + 0.1)

      tl.to(camera, {
        opacity: 1,
        duration: 0.1,
        ease: 'power1.inOut'
      }, 2.8 + i * 0.5 + 0.2)
    }

    // 动画阶段4: 时间恢复正常
    tl.to(reverseFlow, {
      direction: 0,
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 5.8)

    tl.to(causalityLoop, {
      instability: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 5.8)

    tl.to(temporalFragments, {
      density: 0,
      disorder: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 5.8)

    tl.to(camera.position, {
      x: 50,
      y: 40,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()

          // 时间恢复效果
          const restoreX = Math.sin(time * 4) * 10
          const restoreY = Math.cos(time * 3) * 8
          const restoreZ = Math.sin(time * 5) * 10

          camera.position.x += restoreX * 0.2
          camera.position.y += restoreY * 0.2
          camera.position.z += restoreZ * 0.2

          camera.lookAt(controls.target)
        },
        '时间恢复阶段错误'
      )
    }, 5.8)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 7.3)

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
    }, 7.3)

  } catch (error) {
    if (onError) onError(error)
  }
}
