/**
 * 蝴蝶飞舞动画
 * 使用蝴蝶飞舞特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createButterflySwarm } from './effects/butterfly-swarm'

export default function animateButterflySwarm(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 50), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'butterfly-swarm' })
      },
      onError,
      '蝴蝶飞舞',
      controls
    )

    // 创建蝴蝶
    const butterflySwarm = createButterflySwarm(scene, {
      butterflyCount: 300,
      flyRadius: 40
    })

    // 阶段1: 相机环绕观察
    tl.to(camera.position, {
      angle: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: function() {
        const angle = this.progress() * Math.PI * 2
        const radius = 50
        camera.position.x = Math.cos(angle) * radius
        camera.position.z = Math.sin(angle) * radius
        camera.position.y = 30 + Math.sin(angle * 2) * 10
        safeCameraTransform(
          () => camera.lookAt(0, 5, 0),
          '相机环绕错误'
        )
      }
    })

    // 阶段2: 蝴蝶聚集
    tl.call(() => {
      butterflySwarm.animate(2)
    }, null, 2)

    // 阶段3: 相机接近
    tl.to(camera.position, {
      x: 15,
      y: 15,
      z: 15,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 5, 0),
        '相机接近错误'
      )
    }, 4)

    // FOV变化
    tl.to(camera, {
      fov: 110,
      duration: 0.5,
      ease: 'power1.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 5)

    tl.to(camera, {
      fov: 75,
      duration: 1.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 5.5)

    // 阶段4: 最终定位
    /*    tl.to(camera.position, {
      x: 5,
      y: 8,
      z: 5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 5, 0),
        '最终定位错误'
      )
    }, 7)*/

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
    }, 7)


    // 清理
    tl.call(() => {
      butterflySwarm.destroy()
    }, null, 9)

    // 更新循环
    const updateHandler = () => {
      butterflySwarm.update(0.016, Date.now() * 0.001)
    }

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
