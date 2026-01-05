/**
 * 轨道环绕动画
 * 模拟环绕轨道运行的螺旋上升效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateOrbitalRotation(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从远处开始
    setupInitialCamera(camera, new THREE.Vector3(0, 800, 800), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建轨道参数
    const orbitParams = {
      radius: 1131, // sqrt(800^2 + 800^2)
      height: 800,
      angle: 0,
      descendSpeed: 0
    }

    const cameraRotation = { x: 0, y: 0, z: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'orbital-rotation' })
      },
      onError,
      '轨道环绕'
    )

    // 动画阶段1: 轨道环绕
    tl.to(orbitParams, {
      descendSpeed: 0.8,
      duration: 3,
      ease: 'power2.in',
      onUpdate: () => {
        const time = tl.time()

        // 计算轨道位置
        const angle = time * 0.5
        const radius = orbitParams.radius * (1 - orbitParams.descendSpeed * 0.5)
        const height = orbitParams.height * (1 - orbitParams.descendSpeed * 0.7)

        camera.position.x = Math.cos(angle) * radius
        camera.position.y = height
        camera.position.z = Math.sin(angle) * radius

        camera.lookAt(controls.target)
      }
    })

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

    // 动画阶段2: 螺旋下降
    tl.to(orbitParams, {
      radius: 100,
      height: 80,
      descendSpeed: 1,
      duration: 2.5,
      ease: 'power4.inOut',
      onUpdate: () => {
        const time = tl.time()
        const speed = orbitParams.descendSpeed

        // 加速下降
        const angle = 1.5 + (time - 3) * speed * 0.8
        const radius = THREE.MathUtils.lerp(orbitParams.radius, 100, (time - 3) / 2.5)
        const height = THREE.MathUtils.lerp(orbitParams.height, 80, (time - 3) / 2.5)

        camera.position.x = Math.cos(angle) * radius
        camera.position.y = height
        camera.position.z = Math.sin(angle) * radius

        // 轻微的轨道倾斜
        cameraRotation.x = Math.sin(time * 5) * 0.1
        cameraRotation.z = Math.cos(time * 4) * 0.1

        camera.rotation.set(
          cameraRotation.x,
          angle + Math.PI / 2,
          cameraRotation.z
        )

        camera.lookAt(controls.target)
      }
    }, 3)

    tl.to(camera, {
      fov: 90,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV最终调整错误'
      )
    }, 5)

    // 动画阶段3: 最终定位
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
    }, 5.5)

  } catch (error) {
    if (onError) onError(error)
  }
}
