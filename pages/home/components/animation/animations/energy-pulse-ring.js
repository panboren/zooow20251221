/**
 * 能量脉冲环动画
 * 使用能量脉冲环特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createEnergyPulseRing } from './effects/energy-pulse-ring'

export default function animateEnergyPulseRing(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 80), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'energy-pulse-ring' })
      },
      onError,
      '能量脉冲环',
      controls
    )

    // 创建能量脉冲环
    const energyPulseRing = createEnergyPulseRing(scene, {
      ringCount: 6,
      maxRadius: 80,
      baseColor: new THREE.Color(0x00ffff),
      secondaryColor: new THREE.Color(0xff00ff)
    })

    // 阶段1: 相机接近
    tl.to(camera.position, {
      x: 0,
      y: 10,
      z: 30,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机接近错误'
      )
    })

    // 阶段2: 能量爆发
    tl.call(() => {
      energyPulseRing.animate(3.5)
    }, null, 2)

    // 阶段3: 穿越脉冲
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: -10,
      duration: 2,
      ease: 'expo.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '穿越脉冲错误'
      )
    }, 3)

    // FOV变化
    tl.to(camera, {
      fov: 140,
      duration: 0.8,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 3)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 3.8)

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
    }, 5.5)

    // 清理
    tl.call(() => {
      energyPulseRing.destroy()
    }, null, 8)

    // 更新循环
    const updateHandler = () => {
      energyPulseRing.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
