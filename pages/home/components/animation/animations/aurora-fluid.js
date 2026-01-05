/**
 * 极光流体动画
 * 使用极光流体特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createAuroraFluid } from './effects/aurora-fluid'

export default function animateAuroraFluid(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 60), 100, controls)
    camera.lookAt(0, 20, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'aurora-fluid' })
      },
      onError,
      '极光流体',
      controls
    )

    // 创建极光流体
    const auroraFluid = createAuroraFluid(scene, {
      fluidCount: 15,
      fluidRadius: 50
    })

    // 阶段1: 相机观察
    tl.to(camera.position, {
      x: 30,
      y: 50,
      z: 30,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '相机观察错误'
      )
    })

    // 阶段2: 极光流动
    tl.call(() => {
      auroraFluid.animate(3)
    }, null, 2)

    // 阶段3: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 40
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 40 + Math.sin(angle * 2) * 8
        safeCameraTransform(
          () => camera.lookAt(0, 20, 0),
          '相机环绕错误'
        )
      }
    }, 4)

    // 阶段4: 相机接近
    tl.to(camera.position, {
      x: 15,
      y: 25,
      z: 15,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '相机接近错误'
      )
    }, 7)

    // FOV调整
    tl.to(camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 7)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 7.5)

    // 阶段5: 最终定位
    /*    tl.to(camera.position, {
      x: 8,
      y: 15,
      z: 8,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '最终定位错误'
      )
    }, 9)*/
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
    }, 9)


    // 清理
    tl.call(() => {
      auroraFluid.destroy()
    }, null, 11)

    // 更新循环
    const updateHandler = () => {
      auroraFluid.update(0.016, Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
