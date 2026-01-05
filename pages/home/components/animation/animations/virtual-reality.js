/**
 * 虚拟现实动画
 * 模拟虚拟现实中的像素化和数字噪声效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateVirtualReality(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1100, 850, 1100), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建辅助变量
    const pixelation = { level: 0 }
    const digitalNoise = { intensity: 0 }
    const realityMaterialize = { progress: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'virtual-reality' })
      },
      onError,
      '虚拟现实'
    )

    // 动画阶段1: 接近
    tl.to(camera.position, {
      x: 650,
      y: 500,
      z: 650,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    // 动画阶段2: 像素化开始
    tl.to(camera.position, {
      x: 400,
      y: 300,
      z: 400,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '像素化接近错误'
      )
    }, 1.2)

    tl.to(pixelation, {
      level: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    tl.to(digitalNoise, {
      intensity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, 2.2)

    // 调整FOV
    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 数字世界
    tl.to(camera.position, {
      x: 200,
      y: 150,
      z: 200,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const pixelLevel = pixelation.level
          const noiseIntensity = digitalNoise.intensity

          // 像素化效果
          const pixelX = Math.floor(Math.sin(time * 5) * 20) * pixelLevel
          const pixelY = Math.floor(Math.cos(time * 4) * 15) * pixelLevel
          const pixelZ = Math.floor(Math.sin(time * 6) * 20) * pixelLevel

          camera.position.x += pixelX * 0.3
          camera.position.y += pixelY * 0.3
          camera.position.z += pixelZ * 0.3

          // 数字噪声效果
          const noiseX = (Math.random() - 0.5) * 15 * noiseIntensity
          const noiseY = (Math.random() - 0.5) * 15 * noiseIntensity
          const noiseZ = (Math.random() - 0.5) * 15 * noiseIntensity

          camera.position.x += noiseX
          camera.position.y += noiseY
          camera.position.z += noiseZ

          // 相机数字抖动
          cameraRotation.x = (Math.random() - 0.5) * 0.15 * noiseIntensity
          cameraRotation.y = (Math.random() - 0.5) * 0.15 * noiseIntensity
          cameraRotation.z = (Math.random() - 0.5) * 0.1 * noiseIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '数字世界阶段错误'
      )
    }, 2.5)

    // 动画阶段4: 现实化
    tl.to(pixelation, {
      level: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(realityMaterialize, {
      progress: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(digitalNoise, {
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera.position, {
      x: 80,
      y: 60,
      z: 80,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const materializeProgress = realityMaterialize.progress

          // 现实化效果
          const materializeX = Math.sin(time * 4) * 10 * (1 - materializeProgress)
          const materializeY = Math.cos(time * 3) * 8 * (1 - materializeProgress)
          const materializeZ = Math.sin(time * 5) * 10 * (1 - materializeProgress)

          camera.position.x += materializeX
          camera.position.y += materializeY
          camera.position.z += materializeZ

          camera.lookAt(controls.target)
        },
        '现实化阶段错误'
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
