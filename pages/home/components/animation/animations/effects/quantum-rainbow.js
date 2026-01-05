// animations/quantum-rainbow.js
import { createQuantumRainbowTunnel } from './effects/quantum-rainbow-tunnel'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils'

export default function animateQuantumRainbow(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 80), 100, controls)

    const tl = createTimeline(
      () => onComplete({ type: 'quantum-rainbow' }),
      onError,
      '量子彩虹隧道',
      controls
    )

    // 创建量子彩虹隧道
    const quantumTunnel = createQuantumRainbowTunnel(scene, {
      radius: 25,
      length: 150,
      segmentCount: 8,
      speed: 3.0
    })

    // 相机动画
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 5,
      ease: 'power2.in',
      onUpdate: () => camera.lookAt(0, 0, 0)
    })

    // 触发特效动画
    tl.call(() => {
      quantumTunnel.animate(3)
    }, null, 1)

    // 清理
    tl.call(() => {
      quantumTunnel.destroy()
    }, null, 6)

    // 更新循环
    const updateHandler = () => {
      quantumTunnel.update(Date.now() * 0.001)
    }

    return { updateHandler }
  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
