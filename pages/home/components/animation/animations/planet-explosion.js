/**
 * 星球爆炸动画
 * 模拟星球爆炸时的冲击波和碎片效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animatePlanetExplosion(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处观察
    setupInitialCamera(camera, new THREE.Vector3(1000, 800, 1000), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建辅助变量
    const explosionCore = { intensity: 0 }
    const debrisField = { density: 0 }
    const shockwaveSphere = { radius: 0, opacity: 1 }
    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'planet-explosion' })
      },
      onError,
      '星球爆炸'
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

    // 动画阶段2: 爆炸开始
    tl.to(camera.position, {
      x: 300,
      y: 250,
      z: 300,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '爆炸接近错误'
      )
    }, 1.2)

    tl.to(explosionCore, {
      intensity: 1,
      duration: 0.5,
      ease: 'power2.in'
    }, 2.2)

    tl.to(debrisField, {
      density: 1,
      duration: 0.5,
      ease: 'power2.in'
    }, 2.2)

    tl.to(shockwaveSphere, {
      radius: 1,
      duration: 0.3,
      ease: 'power2.in'
    }, 2.4)

    // 调整FOV
    tl.to(camera, {
      fov: 140,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.2)

    // 动画阶段3: 冲击波扩散
    tl.to(camera.position, {
      x: 150,
      y: 120,
      z: 150,
      duration: 2,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const coreIntensity = explosionCore.intensity
          const debrisAmount = debrisField.density

          // 爆炸核心效果
          const corePulse = Math.sin(time * 10) * 10 * coreIntensity
          camera.position.x += corePulse * 0.3
          camera.position.y += corePulse * 0.2
          camera.position.z += corePulse * 0.3

          // 碎片飞溅效果
          const debrisX = Math.sin(time * 15) * 20 * debrisAmount
          const debrisY = Math.cos(time * 12) * 15 * debrisAmount
          const debrisZ = Math.sin(time * 18) * 20 * debrisAmount

          camera.position.x += debrisX * 0.5
          camera.position.y += debrisY * 0.5
          camera.position.z += debrisZ * 0.5

          // 相机震动
          cameraRotation.x = (Math.random() - 0.5) * 0.3 * coreIntensity
          cameraRotation.y = (Math.random() - 0.5) * 0.3 * coreIntensity
          cameraRotation.z = (Math.random() - 0.5) * 0.2 * coreIntensity

          camera.rotation.set(
            cameraRotation.x,
            cameraRotation.y,
            cameraRotation.z
          )

          camera.lookAt(controls.target)
        },
        '冲击波扩散阶段错误'
      )
    }, 2.5)

    tl.to(shockwaveSphere, {
      radius: 5,
      opacity: 0.5,
      duration: 2,
      ease: 'power2.out'
    }, 2.5)

    // 动画阶段4: 爆炸消散
    tl.to(camera.position, {
      x: 50,
      y: 40,
      z: 50,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()

          // 爆炸消散效果
          const dissipationX = Math.sin(time * 5) * 5
          const dissipationY = Math.cos(time * 4) * 4
          const dissipationZ = Math.sin(time * 6) * 5

          camera.position.x += dissipationX * 0.2
          camera.position.y += dissipationY * 0.2
          camera.position.z += dissipationZ * 0.2

          camera.lookAt(controls.target)
        },
        '爆炸消散阶段错误'
      )
    }, 4.5)

    tl.to(explosionCore, {
      intensity: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(debrisField, {
      density: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(shockwaveSphere, {
      radius: 10,
      opacity: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4.5)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 6.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
