/**
 * 维度传送门动画
 * 模拟通过维度传送门穿越的效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateDimensionalPortal(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察传送门
    setupInitialCamera(camera, new THREE.Vector3(0, 600, 800), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建传送门参数
    const portalRing = { scale: 0, rotation: 0 }
    const dimensionShift = { intensity: 0 }
    const portalParticles = { density: 0 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dimensional-portal' })
      },
      onError,
      '维度传送门'
    )

    // 动画阶段1: 接近传送门
    tl.to(camera.position, {
      x: 0,
      y: 400,
      z: 500,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '接近阶段错误'
      )
    })

    tl.to(portalRing, {
      scale: 1,
      rotation: Math.PI * 2,
      duration: 1,
      ease: 'power2.inOut'
    }, 1.2)

    // 动画阶段2: 进入传送门
    tl.to(camera.position, {
      x: 0,
      y: 200,
      z: 300,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const ringScale = portalRing.scale

          // 传送门旋转效果
          const rotationAmount = portalRing.rotation
          cameraRotation.y = Math.sin(time * 3) * 0.2 * ringScale

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '进入阶段错误'
      )
    }, 1.2)

    tl.to(dimensionShift, {
      intensity: 1,
      duration: 1,
      ease: 'power2.in'
    }, 2.2)

    tl.to(portalParticles, {
      density: 1,
      duration: 0.5,
      ease: 'power2.in'
    }, 2.5)

    // 调整FOV
    tl.to(camera, {
      fov: 150,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    // 动画阶段3: 穿越维度
    tl.to(camera.position, {
      x: 0,
      y: 100,
      z: 150,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const shiftIntensity = dimensionShift.intensity
          const particleDensity = portalParticles.density

          // 维度位移效果
          const shiftX = Math.sin(time * 10) * 30 * shiftIntensity
          const shiftY = Math.cos(time * 8) * 25 * shiftIntensity
          const shiftZ = Math.sin(time * 12) * 30 * shiftIntensity

          camera.position.x += shiftX * 0.5
          camera.position.y += shiftY * 0.5
          camera.position.z += shiftZ * 0.5

          // 传送门粒子效果
          const particleX = (Math.random() - 0.5) * 20 * particleDensity
          const particleY = (Math.random() - 0.5) * 20 * particleDensity
          const particleZ = (Math.random() - 0.5) * 20 * particleDensity

          camera.position.x += particleX
          camera.position.y += particleY
          camera.position.z += particleZ

          // 相机旋转
          cameraRotation.x = Math.sin(time * 5) * 0.25 * shiftIntensity
          cameraRotation.y += 0.03 * shiftIntensity
          cameraRotation.z = Math.cos(time * 6) * 0.15 * shiftIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '穿越阶段错误'
      )
    }, 2.7)

    // 动画阶段4: 退出传送门
    tl.to(dimensionShift, {
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.7)

    tl.to(portalParticles, {
      density: 0,
      duration: 1.5,
      ease: 'power2.out'
    }, 4.7)

    tl.to(camera.position, {
      x: 50,
      y: 40,
      z: 50,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()

          // 传送门退出效果
          const exitX = Math.sin(time * 6) * 10
          const exitY = Math.cos(time * 5) * 8
          const exitZ = Math.sin(time * 7) * 10

          camera.position.x += exitX * 0.3
          camera.position.y += exitY * 0.3
          camera.position.z += exitZ * 0.3

          camera.lookAt(controls.target)
        },
        '退出阶段错误'
      )
    }, 4.7)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 6.2)

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
    }, 6.2)

  } catch (error) {
    if (onError) onError(error)
  }
}
