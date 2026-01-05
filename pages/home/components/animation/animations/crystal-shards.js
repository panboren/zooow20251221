/**
 * 水晶碎片爆炸动画
 * 使用水晶碎片特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createCrystalShards } from './effects/crystal-shards'

export default function animateCrystalShards(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 50), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'crystal-shards' })
      },
      onError,
      '水晶碎片爆炸',
      controls
    )

    // 创建水晶碎片
    const crystalShards = createCrystalShards(scene, {
      count: 150,
      size: 2.5,
      color: new THREE.Color(0x00ffff),
      explosionForce: 60
    })

    // 阶段1: 相机接近
    tl.to(camera.position, {
      x: 20,
      y: 20,
      z: 20,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机接近错误'
      )
    })

    // 阶段2: 碎片爆炸
    tl.call(() => {
      crystalShards.animate(3)
    }, null, 1.5)

    // 阶段3: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 35
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 20 + Math.sin(angle * 2) * 5
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '相机环绕错误'
        )
      }
    }, 1.5)

    // 阶段4: 最终接近
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
    }, 4.5)

    // FOV调整
    tl.to(camera, {
      fov: 100,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 5)

    tl.to(camera, {
      fov: 90,
      duration: 1.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 5.5)

    // 清理
    tl.call(() => {
      crystalShards.destroy()
    }, null, 7)

    // 更新循环
    const updateHandler = () => {
      crystalShards.update(0.016)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
