/**
 * 量子彩虹隧道动画
 * 使用量子彩虹隧道特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createQuantumRainbowTunnel } from './effects/quantum-rainbow-tunnel'

export default function animateQuantumRainbowTunnel(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 100), 120, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'quantum-rainbow-tunnel' })
      },
      onError,
      '量子彩虹隧道',
      controls
    )

    // 创建量子彩虹隧道
    const quantumTunnel = createQuantumRainbowTunnel(scene, {
      radius: 25,
      length: 150,
      segmentCount: 8,
      speed: 3.0
    })

    // 阶段1: 隧道展开
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 60,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '隧道展开错误'
      )
    })

    // 阶段2: 穿越开始
    tl.call(() => {
      quantumTunnel.animate(3)
    }, null, 1.5)

    // 阶段3: 快速穿越
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: -20,
      duration: 2,
      ease: 'expo.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '快速穿越错误'
      )
    }, 2.5)

    // FOV变化
    tl.to(camera, {
      fov: 150,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 2.5)

    tl.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 3.5)

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
    }, 6)

    // 清理
    tl.call(() => {
      quantumTunnel.destroy()
    }, null, 8.5)

    // 更新循环
    const updateHandler = () => {
      quantumTunnel.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
