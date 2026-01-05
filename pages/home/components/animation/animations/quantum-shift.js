/**
 * 量子跃迁动画
 * 模拟量子跃迁时的多次跳跃效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateQuantumShift(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从随机位置开始
    const randomTheta = Math.random() * Math.PI * 2
    const randomPhi = Math.random() * Math.PI
    const randomRadius = 1000

    const randomPos = new THREE.Vector3()
    randomPos.setFromSphericalCoords(randomRadius, randomPhi, randomTheta)
    setupInitialCamera(camera, randomPos, 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-shift' })
      },
      onError,
      '量子跃迁'
    )

    // 动画阶段1: 多次跃迁
    let targetPosition = new THREE.Vector3()
    for (let i = 0; i < 3; i++) {
      targetPosition.set(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
      )

      tl.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 0.3,
        ease: 'power1.inOut',
        onUpdate: () => safeCameraTransform(
          () => camera.lookAt(controls.target),
          '量子跃迁位置更新错误'
        )
      }, i * 0.4)

      // 闪烁效果
      tl.to(camera, {
        opacity: 0.2,
        duration: 0.1,
        ease: 'power1.inOut'
      }, i * 0.4 + 0.1)

      tl.to(camera, {
        opacity: 1,
        duration: 0.1,
        ease: 'power1.inOut'
      }, i * 0.4 + 0.2)
    }

    // 动画阶段2: 最终跃迁到附近
    tl.to(camera.position, {
      x: 10,
      y: 15,
      z: 10,
      duration: 0.5,
      ease: 'power1.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '最终跃迁位置更新错误'
      )
    }, 1.5)

    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终跃迁错误'
      )
    }, 1.5)

    // 动画阶段3: 稳定接近
    tl.to(camera.position, {
      x: 2,
      y: 3,
      z: 2,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const wobbleX = (Math.random() - 0.5) * 0.1
          const wobbleY = (Math.random() - 0.5) * 0.1
          const wobbleZ = (Math.random() - 0.5) * 0.1
          camera.position.x = 2 + wobbleX
          camera.position.y = 3 + wobbleY
          camera.position.z = 2 + wobbleZ
          camera.lookAt(controls.target)
        },
        '量子抖动更新错误'
      )
    }, 2)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV稳定接近错误'
      )
    }, 2.5)

    // 动画阶段4: 最终定位
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const wobbleX = (Math.random() - 0.5) * 0.02
          const wobbleY = (Math.random() - 0.5) * 0.02
          const wobbleZ = (Math.random() - 0.5) * 0.02
          camera.position.x = wobbleX
          camera.position.y = wobbleY
          camera.position.z = wobbleZ
          camera.lookAt(controls.target)
        },
        '量子抖动减小错误'
      )
    }, 3)

    tl.to(camera, {
      fov: 60,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终定位错误'
      )
    }, 3.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
