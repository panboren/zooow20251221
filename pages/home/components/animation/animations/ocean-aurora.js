/**
 * 海洋极光动画
 * 使用海洋极光特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createOceanAurora } from './effects/ocean-aurora'

export default function animateOceanAurora(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 80), 100, controls)
    camera.lookAt(0, 20, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'ocean-aurora' })
      },
      onError,
      '海洋极光',
      controls
    )

    // 创建海洋极光
    const oceanAurora = createOceanAurora(scene, {
      waveSize: 120,
      waveSegments: 256,
      auroraBands: 10
    })

    // 阶段1: 相机高空俯视
    tl.to(camera.position, {
      x: 30,
      y: 60,
      z: 30,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 20, 0),
        '相机俯视错误'
      )
    })

    // 阶段2: 极光增强
    tl.call(() => {
      oceanAurora.animate(3)
    }, null, 2)

    // 阶段3: 相机下降接近海面
    tl.to(camera.position, {
      x: 20,
      y: 20,
      z: 20,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机接近错误'
      )
    }, 4)

    // 阶段4: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 25
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 15 + Math.sin(angle * 2) * 5
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '相机环绕错误'
        )
      }
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
    }, 6)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 6.5)

    // 阶段5: 最终定位
    /*    tl.to(camera.position, {
      x: 10,
      y: 10,
      z: 10,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终定位错误'
      )
    }, 8)*/
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
    }, 8)


    // 清理
    tl.call(() => {
      oceanAurora.destroy()
    }, null, 10)

    // 更新循环
    const updateHandler = () => {
      oceanAurora.update(0.016, Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
