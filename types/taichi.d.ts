/**
 * Taichi.js 类型定义
 * 为TypeScript提供类型支持
 */

declare module '#app' {
  interface NuxtApp {
    $taichi: any
    $taichiUtils: {
      isReady: () => boolean
      isGPU: () => boolean
      getDevice: () => any
      createParticleSystem: (config?: any) => any
      createField: (config?: any) => any
    }
  }
}

export {}
