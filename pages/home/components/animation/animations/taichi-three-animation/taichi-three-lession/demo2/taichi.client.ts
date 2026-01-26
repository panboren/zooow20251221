import type { NuxtApp } from 'nuxt/app'

// 缓存 taichi 实例
let taichiInstance: any = null

// 声明 Nuxt App 的类型
declare module '#app' {
  interface NuxtApp {
    $loadTaichi: () => Promise<any>
  }
}

// 创建 taichi.js 插件
export default defineNuxtPlugin({
  name: 'taichi',

  async setup(nuxtApp: NuxtApp) {
    // 加载 taichi.js
    nuxtApp.provide('loadTaichi', async () => {
      // 如果已经加载过，直接返回缓存的实例
      if (taichiInstance) {
        return taichiInstance
      }

      // 动态导入 taichi.js（从项目根目录）
      const taichi = await import('../taichi.js-master/dist/taichi.js')

      // 缓存实例
      taichiInstance = taichi

      console.log('✅ taichi.js 加载成功')

      return taichi
    })
  },
})
