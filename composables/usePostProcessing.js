/**
 * 后处理系统 - Bloom 发光效果
 * 为所有特效提供华丽的发光渲染
 */

export function usePostProcessing(renderer, scene, camera) {
  // 动态导入 Three.js 后处理模块
  let EffectComposer, RenderPass, UnrealBloomPass, OutputPass

  const initPostProcessing = async () => {
    if (EffectComposer) return true

    try {
      const [
        EffectComposerModule,
        RenderPassModule,
        UnrealBloomPassModule,
        OutputPassModule
      ] = await Promise.all([
        import('three/examples/jsm/postprocessing/EffectComposer.js'),
        import('three/examples/jsm/postprocessing/RenderPass.js'),
        import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        import('three/examples/jsm/postprocessing/OutputPass.js')
      ])

      EffectComposer = EffectComposerModule.EffectComposer
      RenderPass = RenderPassModule.RenderPass
      UnrealBloomPass = UnrealBloomPassModule.UnrealBloomPass
      OutputPass = OutputPassModule.OutputPass

      return true
    } catch (error) {
      console.error('后处理模块加载失败:', error)
      return false
    }
  }

  const composer = new THREE.EffectComposer(renderer)

  // 基础渲染通道
  const renderPass = new THREE.RenderPass(scene, camera)
  composer.addPass(renderPass)

  // Bloom 发光通道 - 关键！让粒子更华丽
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // strength - 发光强度
    0.4,  // radius - 发光半径
    0.85  // threshold - 阈值（只让亮部发光）
  )
  composer.addPass(bloomPass)

  // 输出转换通道（sRGB）
  const outputPass = new THREE.OutputPass()
  composer.addPass(outputPass)

  // 响应窗口大小变化
  const resize = () => {
    composer.setSize(window.innerWidth, window.innerHeight)
    bloomPass.resolution.set(window.innerWidth, window.innerHeight)
  }

  return {
    composer,
    bloomPass,

    // 设置 Bloom 强度
    setBloomStrength: (strength) => {
      bloomPass.strength = strength
    },

    // 设置 Bloom 半径
    setBloomRadius: (radius) => {
      bloomPass.radius = radius
    },

    // 设置 Bloom 阈值
    setBloomThreshold: (threshold) => {
      bloomPass.threshold = threshold
    },

    // 快速调整所有参数
    setBloom: ({ strength, radius, threshold }) => {
      if (strength !== undefined) bloomPass.strength = strength
      if (radius !== undefined) bloomPass.radius = radius
      if (threshold !== undefined) bloomPass.threshold = threshold
    },

    // 初始化后处理系统
    init: initPostProcessing,

    // 响应窗口大小变化
    resize
  }
}
