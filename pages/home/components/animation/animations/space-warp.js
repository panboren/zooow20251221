/**
 * 空间扭曲动画
 * 模拟空间扭曲和重排效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateSpaceWarp(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处开始
    setupInitialCamera(camera, new THREE.Vector3(0, 1200, 0), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建空间扭曲参数
    const spaceDistortion = { warp: 0, intensity: 0 }
    const gravityWaves = { amplitude: 0, frequency: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'space-warp' })
      },
      onError,
      '空间扭曲'
    )

    // 动画阶段1: 下降
    tl.to(camera.position, {
      x: 0,
      y: 800,
      z: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '下降阶段错误'
      )
    })

    // 动画阶段2: 空间扭曲开始
    tl.to(camera.position, {
      x: 0,
      y: 500,
      z: 0,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()

          // 空间扭曲效果
          const distortX = Math.sin(time * 6) * 15 * spaceDistortion.warp
          const distortY = Math.cos(time * 5) * 12 * spaceDistortion.warp
          const distortZ = Math.sin(time * 7) * 15 * spaceDistortion.warp

          camera.position.x += distortX
          camera.position.y += distortY
          camera.position.z += distortZ

          camera.lookAt(controls.target)
        },
        '扭曲开始错误'
      )
    }, 1.2)

    tl.to(spaceDistortion, {
      warp: 1,
      intensity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    tl.to(gravityWaves, {
      amplitude: 1,
      frequency: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    // 调整FOV
    tl.to(camera, {
      fov: 125,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 深度扭曲
    tl.to(camera.position, {
      x: 0,
      y: 200,
      z: 0,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const warpIntensity = spaceDistortion.intensity
          const waveAmplitude = gravityWaves.amplitude
          const waveFrequency = gravityWaves.frequency

          // 深度扭曲效果
          const depthX = Math.sin(time * 8 * waveFrequency) * 35 * warpIntensity
          const depthY = Math.cos(time * 6 * waveFrequency) * 28 * warpIntensity
          const depthZ = Math.sin(time * 10 * waveFrequency) * 35 * warpIntensity

          camera.position.x += depthX * 0.6
          camera.position.y += depthY * 0.6
          camera.position.z += depthZ * 0.4

          // 重力波效果
          const gravityX = Math.sin(time * 5 * waveFrequency) * 25 * waveAmplitude
          const gravityY = Math.cos(time * 4 * waveFrequency) * 20 * waveAmplitude
          const gravityZ = Math.sin(time * 6 * waveFrequency) * 25 * waveAmplitude

          camera.position.x += gravityX * 0.5
          camera.position.y += gravityY * 0.5
          camera.position.z += gravityZ * 0.3

          // 相机旋转
          cameraRotation.x = Math.sin(time * 4) * 0.2 * warpIntensity
          cameraRotation.y += 0.015
          cameraRotation.z = Math.cos(time * 5) * 0.15 * warpIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '深度扭曲阶段错误'
      )
    }, 2.5)

    // 动画阶段4: 稳定
    tl.to(spaceDistortion, {
      warp: 0,
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(gravityWaves, {
      amplitude: 0,
      frequency: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera.position, {
      x: 50,
      y: 40,
      z: 50,
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
