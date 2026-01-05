/**
 * 樱花飘落动画
 * 使用樱花飘落特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createCherryBlossom } from './effects/cherry-blossom'

export default function animateCherryBlossom(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 60), 100, controls)
    camera.lookAt(0, 10, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'cherry-blossom' })
      },
      onError,
      '樱花飘落',
      controls
    )

    // 创建樱花
    const cherryBlossom = createCherryBlossom(scene, {
      petalCount: 3000,
      treeRadius: 35,
      fallHeight: 100
    })

    // 阶段1: 相机环绕
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 60
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 40 + Math.sin(angle * 2) * 5
        safeCameraTransform(
          () => camera.lookAt(0, 10, 0),
          '相机环绕错误'
        )
      }
    })

    // 阶段2: 樱花飘落加速
    tl.call(() => {
      cherryBlossom.animate(3)
    }, null, 2)

    // 阶段3: 相机下降
    tl.to(camera.position, {
      y: 20,
      duration: 2,
      ease: 'power2.in',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2 + Math.PI
        const radius = 50 - this.progress() * 20
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        safeCameraTransform(
          () => camera.lookAt(0, 5, 0),
          '相机下降错误'
        )
      }
    }, 5)

    // FOV调整
    tl.to(camera, {
      fov: 100,
      duration: 1,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 5)

    tl.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 6)

    // 阶段4: 最终接近
    tl.to(camera.position, {
      x: 5,
      y: 5,
      z: 5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 5, 0),
        '最终接近错误'
      )
    }, 8)

    // 清理
    tl.call(() => {
      cherryBlossom.destroy()
    }, null, 10)

    // 更新循环
    const updateHandler = () => {
      cherryBlossom.update(0.016, Date.now() * 0.001)
    }


    // 阶段4: 最终接近
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '最终接近错误'
      )
    }, 8)




    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
