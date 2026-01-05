/**
 * 闪电连锁动画
 * 使用闪电连锁特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createLightningChain } from './effects/lightning-chain'

export default function animateLightningChain(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 60), 100, controls)
    camera.lookAt(0, 20, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'lightning-chain' })
      },
      onError,
      '闪电连锁',
      controls
    )

    // 创建闪电
    const lightning = createLightningChain(scene, {
      maxDepth: 5,
      maxBranches: 6,
      branchChance: 0.8,
      length: 60,
      color: new THREE.Color(0x88ddff),
      glowColor: new THREE.Color(0xffffff)
    })

    // 阶段1: 相机观察
    tl.to(camera.position, {
      x: 30,
      y: 30,
      z: 40,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '相机观察错误'
      )
    })

    // 阶段2: 闪电爆发
    tl.call(() => {
      lightning.animate(2)
    }, null, 1.5)

    // 阶段3: 相机晃动
    tl.to(camera.position, {
      x: 35,
      y: 35,
      z: 45,
      duration: 0.2,
      ease: 'power1.in',
      yoyo: true,
      repeat: 5,
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '相机晃动错误'
      )
    }, 1.5)

    // 阶段4: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 45
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        safeCameraTransform(
          () => camera.lookAt(0, 20, 0),
          '相机环绕错误'
        )
      }
    }, 2.5)

    // 阶段5: 最终接近
    tl.to(camera.position, {
      x: 10,
      y: 15,
      z: 15,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '最终接近错误'
      )
    }, 5.5)

    // FOV闪烁
    tl.to(camera, {
      fov: 110,
      duration: 0.1,
      ease: 'power1.in',
      yoyo: true,
      repeat: 3,
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV闪烁错误'
      )
    }, 1.5)

    tl.to(camera, {
      fov: 90,
      duration: 1,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 6.5)

    // 清理
    tl.call(() => {
      lightning.destroy()
    }, null, 7.5)

    // 更新循环
    const updateHandler = () => {
      lightning.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
