/**
 * 故障效果动画
 * 使用后期处理实现故障特效
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'
import { createPostProcessor, animateGlitch, animateBloom } from './effects/post-processing'

export default function animateGlitchEffect(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 初始设置
    setupInitialCamera(camera, new THREE.Vector3(0, 100, 100), 170, controls)
    camera.lookAt(0, 0, 0)

    // 创建后期处理器
    const postProcessor = createPostProcessor(
      renderer,
      scene,
      camera,
      renderer.domElement.width,
      renderer.domElement.height
    )

    // 渲染初始状态
    renderer.render(scene, camera)

    const tl = createTimeline(
      () => {
        // 清理后期处理器
        gsap.to(postProcessor.bloomPass, {
          strength: 0,
          duration: 0.5,
          onComplete: () => {
            postProcessor.bloomPass.enabled = false
          }
        })

        if (onComplete) onComplete({ type: 'glitch-effect' })
      },
      onError,
      '故障效果',
      controls
    )

    // 标记使用后期处理
    let usePostProcessing = false

    // 阶段1: 启用后期处理
    tl.call(() => {
      usePostProcessing = true
      postProcessor.bloomPass.enabled = true
    }, null, 0)

    // 阶段2: 相机接近
    tl.to(camera.position, {
      x: 20,
      y: 20,
      z: 20,
      duration: 1.5,
      ease: 'power2.in',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '相机位置更新错误'
      )
    })

    // 阶段3: 启动泛光
    tl.call(() => {
      animateBloom(postProcessor.bloomPass, 2, false)
    }, null, 1.5)

    // 阶段4: 故障效果
    tl.call(() => {
      animateGlitch(postProcessor.glitchPass, 2, 0.6)
    }, null, 2)

    // 阶段5: 相机继续接近
    tl.to(camera.position, {
      x: 10,
      y: 10,
      z: 10,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '相机位置更新错误'
      )
    }, 3)

    // FOV 调整
    tl.to(camera, {
      fov: 75,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.updateProjectionMatrix(),
        'FOV调整错误'
      )
    }, 4)

    // 阶段6: 最终定位
    tl.to(camera.position, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 1,
      ease: 'power1.out',
      onUpdate: () => safeCameraTransform(
        () => camera.lookAt(controls.target),
        '最终定位错误'
      )
    }, 4.5)

    // 恢复正常渲染
    tl.call(() => {
      usePostProcessing = false
      postProcessor.bloomPass.enabled = false
      postProcessor.glitchPass.enabled = false
    }, null, 5.5)

    // 返回后期处理器引用，供外部渲染循环使用
    return {
      postProcessor,
      shouldUsePostProcessing: () => usePostProcessing
    }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
