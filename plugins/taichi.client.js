/**
 * Taichi.js 插件 - 仅负责加载和初始化 Taichi.js
 *
 * 参考 demo2/taichi.client.ts 的简洁设计：
 * - 只负责加载taichi.js模块
 * - 提供全局访问接口
 * - 不涉及任何特效逻辑
 *
 * 特效逻辑应该写在 taichi-three-effect.js 中
 */

import { defineNuxtPlugin } from '#app'

// 缓存 taichi 实例
let taichiInstance = null
let isInitialized = false

export default defineNuxtPlugin({
  name: 'taichi',

  async setup(nuxtApp) {
    /**
     * 加载并初始化 Taichi.js
     * @returns {Promise<any>} Taichi.js 模块
     */
    nuxtApp.provide('loadTaichi', async () => {
      // 如果已经加载过，直接返回缓存的实例
      if (taichiInstance) {
        return taichiInstance
      }

      try {
        console.log('📦 开始加载 Taichi.js...')

        // 优先从本地路径加载（参考 demo2/taichi.client.ts）
        let taichi
        try {
          console.log('📂 尝试从本地路径加载...')
          // taichi = await import('../taichijs/dist/taichi.js')
          taichi = await import('taichi.js')
          console.log('✅ 从本地路径加载成功')
        } catch (localError) {
          console.warn('⚠️ 本地加载失败，尝试从 npm 包加载:', localError.message)
          // 回退到 npm 包
          taichi = await import('taichi.js')
          console.log('✅ 从 npm 包加载成功')
        }

        // 缓存实例
        taichiInstance = taichi

        console.log('✅ Taichi.js 加载成功')

        return taichi
      } catch (error) {
        console.error('❌ Taichi.js 加载失败:', error)
        throw new Error(`Taichi.js 加载失败: ${error.message}`)
      }
    })

    /**
     * 初始化 Taichi.js（调用 ti.init()）
     * 这个方法应该在特效逻辑中使用
     */
    nuxtApp.provide('initTaichi', async (ti) => {
      if (isInitialized) {
        console.log('✅ Taichi.js 已经初始化')
        return ti
      }

      try {
        console.log('⚙️  开始初始化 Taichi.js (ti.init())...')
        await ti.init()
        isInitialized = true
        console.log('✅ Taichi.js 初始化成功')
        return ti
      } catch (error) {
        console.error('❌ Taichi.js 初始化失败:', error)
        throw error
      }
    })
  }
})
