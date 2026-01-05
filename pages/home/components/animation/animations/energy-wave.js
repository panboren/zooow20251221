/**
 * 能量波动画
 * 使用能量波动特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createEnergyWave } from './effects/energy-wave'

export default function animateEnergyWave(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 60, 60), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'energy-wave' })
      },
      onError,
      '能量波动',
      controls
    )

    // 创建能量波
    const energyWave = createEnergyWave(scene, {
      size: 80,
      color: new THREE.Color(0x00ff88),
      glowColor: new THREE.Color(0x00ffff),
      amplitude: 5,
      frequency: 0.3
    })

    // 阶段1: 相机接近
    tl.to(camera.position, {
      x: 30,
      y: 30,
      z: 30,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机接近错误'
      )
    })

    // 阶段2: 能量波爆发
    tl.call(() => {
      energyWave.animate(3)
    }, null, 1.5)

    // 阶段3: 相机上下运动
    tl.to(camera.position, {
      y: 50,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
      onUpdate: function() {
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '相机运动错误'
        )
      }
    }, 1.5)

    // 阶段4: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 40
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 30 + Math.sin(angle * 2) * 10
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '相机环绕错误'
        )
      }
    }, 3)

    // 阶段5: 最终接近
    tl.to(camera.position, {
      x: 5,
      y: 5,
      z: 5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终接近错误'
      )
    }, 6)

    // FOV调整
    tl.to(camera, {
      fov: 100,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 6.5)

    tl.to(camera, {
      fov: 90,
      duration: 1.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 7)

    // 清理
    tl.call(() => {
      energyWave.destroy()
    }, null, 8.5)

    // 更新循环
    const updateHandler = () => {
      energyWave.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
