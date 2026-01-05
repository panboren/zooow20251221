/**
 * 粒子爆炸动画
 * 使用粒子系统实现爆炸特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createExplosionParticles, animateExplosionParticles } from './effects/particle-system'

export default function animateParticleExplosion(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置
    setupInitialCamera(camera, new THREE.Vector3(0, 150, 150), 170, controls)
    camera.lookAt(0, 0, 0)

    // 渲染初始状态
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'particle-explosion' })
      },
      onError,
      '粒子爆炸',
      controls
    )

    // 创建爆炸粒子
    let explosionParticles = null

    // 阶段1: 相机快速接近
    tl.to(camera.position, {
      x: 30,
      y: 30,
      z: 30,
      duration: 2,
      ease: 'power4.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '相机位置更新错误'
      )
    })

    // 阶段2: 触发爆炸
    tl.call(() => {
      // 创建爆炸粒子
      explosionParticles = createExplosionParticles(
        scene,
        new THREE.Vector3(0, 0, 0),
        5000,
        { h: 0.05, s: 1, l: 0.5 }
      )
      animateExplosionParticles(explosionParticles, 4)
    }, null, 2)

    // 阶段3: 爆炸冲击波效果
    tl.to(camera.position, {
      x: 15,
      y: 15,
      z: 15,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '冲击波位置更新错误'
      )
    }, 2)

    // FOV 震动效果
    tl.to(camera, {
      fov: 150,
      duration: 0.3,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV震动错误'
      )
    }, 2)

    tl.to(camera, {
      fov: 90,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV恢复错误'
      )
    }, 2.3)

    // 阶段4: 平滑过渡到最终位置
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 2,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '最终定位错误'
      )
    }, 3)

  } catch (error) {
    if (onError) onError(error)
  }
}
