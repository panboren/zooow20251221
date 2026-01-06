/**
 * DNA双螺旋动画
 * 使用DNA双螺旋特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createDNAHelix } from './effects/dna-helix'

export default function animateDNAHelix(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 60), 100, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'dna-helix' })
      },
      onError,
      'DNA双螺旋',
      controls
    )

    // 创建DNA双螺旋
    const dna = createDNAHelix(scene, {
      pairCount: 50,
      radius: 10,
      height: 80,
      twistCount: 3
    })

    // 阶段1: 相机靠近
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 40,
      duration: 2,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机靠近错误'
      )
    })

    // 阶段2: DNA形成动画
    dna.animate(6)

    // 阶段3: 环绕观察
    tl.to(camera.position, {
      x: 50,
      y: 0,
      z: 0,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(0, 0, 0),
        '相机环绕错误'
      )
    })

    // 持续更新
    let startTime = null
    const duration = 8

    const animate = (time) => {
      if (!startTime) startTime = time
      const elapsed = (time - startTime) / 1000

      if (elapsed < duration) {
        const deltaTime = 0.016
        dna.update(deltaTime, elapsed)
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      } else {
        dna.destroy()
      }
    }

    requestAnimationFrame(animate)

    return tl
  } catch (error) {
    if (onError) {
      onError(error, 'DNA双螺旋动画执行错误')
    }
    return gsap.timeline()
  }
}
