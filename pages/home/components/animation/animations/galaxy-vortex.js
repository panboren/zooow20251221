/**
 * 银河漩涡动画
 * 使用银河漩涡特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createGalaxyVortex } from './effects/galaxy-vortex'

export default function animateGalaxyVortex(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 100), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'galaxy-vortex' })
      },
      onError,
      '银河漩涡',
      controls
    )

    // 创建银河
    const galaxyVortex = createGalaxyVortex(scene, {
      starCount: 25000,
      galaxyRadius: 120,
      spiralArms: 5
    })

    // 阶段1: 相机远观
    tl.to(camera.position, {
      x: 50,
      y: 60,
      z: 50,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机远观错误'
      )
    })

    // 阶段2: 超新星爆发
    tl.call(() => {
      galaxyVortex.animate(4)
    }, null, 2)

    // 阶段3: 相机接近
    tl.to(camera.position, {
      x: 25,
      y: 30,
      z: 25,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机接近错误'
      )
    }, 4)

    // 阶段4: 相机穿越漩涡
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 20 - this.progress() * 15
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 25 + Math.sin(angle * 3) * 5
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '相机穿越错误'
        )
      }
    }, 6)

    // FOV变化
    tl.to(camera, {
      fov: 120,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 6)

    tl.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 6.5)

    // 阶段5: 最终定位
    /*    tl.to(camera.position, {
      x: 5,
      y: 5,
      z: 5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定位错误'
      )
    }, 8.5)*/
    // 阶段5: 最终定位
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
    }, 8.5)


    // 清理
    tl.call(() => {
      galaxyVortex.destroy()
    }, null, 10.5)

    // 更新循环
    const updateHandler = () => {
      galaxyVortex.update(0.016, Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
