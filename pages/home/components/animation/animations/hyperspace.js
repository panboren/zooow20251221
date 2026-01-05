/**
 * 超空间跳跃动画
 * 模拟穿越超空间时的拉伸和隧道效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  createTimeline,
  setupInitialCamera,
  safeCameraTransform
} from './utils'

export default function animateHyperspace(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置：从极远处开始
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 2000), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    // 创建辅助对象
    const starStretch = { stretch: 0 }
    const tunnelVision = { tunnel: 0 }
    const lightBurst = { intensity: 0 }

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'hyperspace' })
      },
      onError,
      '超空间跳跃'
    )

    // 动画阶段1: 启动超空间
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 1000,
      duration: 1,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '启动阶段错误'
      )
    })

    tl.to(starStretch, {
      stretch: 1,
      duration: 0.5,
      ease: 'power2.in'
    }, 0)

    // 调整FOV
    tl.to(camera, {
      fov: 150,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 1)

    // 动画阶段2: 超空间穿越
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 500,
      duration: 3,
      ease: 'power4.inOut',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const stretchAmount = starStretch.stretch
          const tunnelAmount = tunnelVision.tunnel

          // 星星拉伸效果 - 快速移动
          const stretchZ = Math.sin(time * 20) * 50 * stretchAmount
          camera.position.z -= Math.abs(stretchZ)

          // 隧道视野效果
          const tunnelFOV = 150 - tunnelAmount * 60
          camera.fov = THREE.MathUtils.lerp(camera.fov, tunnelFOV, 0.1)
          camera.updateProjectionMatrix()

          camera.lookAt(controls.target)
        },
        '超空间穿越阶段错误'
      )
    }, 1)

    tl.to(tunnelVision, {
      tunnel: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 2)

    tl.to(lightBurst, {
      intensity: 1,
      duration: 0.5,
      ease: 'power2.in'
    }, 3)

    // 动画阶段3: 超空间退出
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 2,
      ease: 'power4.out',
      onUpdate: () => safeCameraTransform(
        () => {
          const time = tl.time()
          const burstAmount = lightBurst.intensity

          // 光爆发果 - 逐渐消失
          const flashIntensity = burstAmount * Math.sin(time * 10)
          camera.fov = THREE.MathUtils.lerp(camera.fov, 90, 0.1)
          camera.updateProjectionMatrix()

          camera.lookAt(controls.target)
        },
        '超空间退出阶段错误'
      )
    }, 4)

    tl.to(lightBurst, {
      intensity: 0,
      duration: 2,
      ease: 'power2.out'
    }, 4)

    // 动画阶段4: 最终定位
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
