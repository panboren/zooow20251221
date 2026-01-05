/**
 * 星云漩涡动画
 * 使用星云漩涡特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createNebulaVortex } from './effects/nebula-vortex'

export default function animateNebulaVortex(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 90), 150, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'nebula-vortex' })
      },
      onError,
      '星云漩涡',
      controls
    )

    // 创建星云漩涡
    const nebulaVortex = createNebulaVortex(scene, {
      nebulaCount: 5,
      starCount: 3000,
      vortexRadius: 60
    })

    // 阶段1: 相机俯视
    tl.to(camera.position, {
      x: 20,
      y: 50,
      z: 40,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机俯视错误'
      )
    })

    // 阶段2: 星云激活
    tl.call(() => {
      nebulaVortex.animate(4)
    }, null, 2)

    // 阶段3: 相机下降
    tl.to(camera.position, {
      x: 10,
      y: 20,
      z: 15,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机下降错误'
      )
    }, 4)

    // 阶段4: 螺旋下降
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 15 - this.progress() * 10
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 20 - this.progress() * 18
        safeCameraTransform(
          () => camera.lookAt(0, 0, 0),
          '螺旋下降错误'
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
      nebulaVortex.destroy()
    }, null, 10.5)

    // 更新循环
    const updateHandler = () => {
      nebulaVortex.update(Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
