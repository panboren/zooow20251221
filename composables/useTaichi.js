/**
 * Taichi.js Composable
 * 提供对Taichi.js的全局访问
 */

export const useTaichi = () => {
  // 尝试从全局window对象获取
  if (typeof window !== 'undefined' && window.__TAICHI_UTILS__) {
    return window.__TAICHI_UTILS__
  }

  // 返回一个默认的工具对象（未初始化状态）
  return {
    isReady: () => false,
    isGPU: () => false,
    getModule: () => null,
    createParticleSystem: () => {
      throw new Error('Taichi.js未初始化')
    },
    createField: () => {
      throw new Error('Taichi.js未初始化')
    }
  }
}
