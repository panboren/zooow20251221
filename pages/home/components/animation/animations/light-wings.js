/**
 * 光之羽翼动画
 * 使用光之羽翼特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createLightWings } from './effects/light-wings'

export default function animateLightWings(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 60), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'light-wings' })
      },
      onError,
      '光之羽翼',
      controls
    )

    // 创建光之羽翼
    const lightWings = createLightWings(scene, {
      wingCount: 8,
      featherCount: 15,
      wingSpan: 60,
      featherLength: 12
    })

    // 阶段1: 羽翼展开
    tl.to(camera.position, {
      x: 0,
      y: 5,
      z: 20,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '羽翼展开错误'
      )
    })

    // 阶段2: 羽翼飘动
    tl.call(() => {
      lightWings.animate(3)
    }, null, 2)

    // 阶段3: 穿越羽翼
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: -5,
      duration: 2,
      ease: 'sine.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '穿越羽翼错误'
      )
    }, 3.5)

    // FOV变化
    tl.to(camera, {
      fov: 110,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3.5)

    tl.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 4.5)

    // 阶段4: 最终定位
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定位错误'
      )
    }, 7)

    // 清理
    tl.call(() => {
      lightWings.destroy()
    }, null, 9.5)

    // 更新循环
    const updateHandler = () => {
      lightWings.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
