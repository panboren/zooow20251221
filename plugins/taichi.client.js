/**
 * Taichi.js 插件 - 全局初始化
 * 
 * 功能：
 * 1. 在Nuxt启动时初始化Taichi.js实例
 * 2. 提供全局可用的Taichi.js API
 * 3. 自动初始化WebGPU（不支持时会自动降级）
 * 4. 提供粒子系统工具函数
 * 
 * Taichi.js API说明：
 * - init(): 初始化Taichi.js（不需要传递arch参数）
 * - field(): 创建场
 * - kernel(): 创建内核
 * - sync(): 同步GPU
 */

import { defineNuxtPlugin } from '#app'

let taichiModule = null
let isInitialized = false
let isGPU = true

export default defineNuxtPlugin((nuxtApp) => {
  console.log('🚀 初始化 Taichi.js 插件...')

  /**
   * 初始化Taichi.js实例
   * @returns {Promise<void>}
   */
  async function initTaichi() {
    if (isInitialized) {
      return
    }

    try {
      console.log('⏳ 正在加载 Taichi.js 模块...')
      // 动态导入taichi.js
      const taichi = await import('taichi.js')
      
      console.log('✅ Taichi.js 模块加载成功')
      taichiModule = taichi

      console.log('⏳ 正在初始化 Taichi.js...')
      // 初始化Taichi.js（不需要传递arch参数）
      await taichi.init()
      
      console.log('✅ Taichi.js 初始化完成')
      
      taichiModule = taichi
      isInitialized = true
      isGPU = checkGPUAvailable()
      
      if (isGPU) {
        console.log('✅ Taichi.js WebGPU 模式初始化成功')
      } else {
        console.log('✅ Taichi.js 初始化成功（使用CPU后备）')
      }

    } catch (error) {
      console.error('❌ Taichi.js 初始化失败:', error)
      isInitialized = false
      // 不抛出错误，让应用继续运行（降级到JavaScript）
    }
  }

  /**
   * 检查GPU是否可用
   * @returns {boolean}
   */
  function checkGPUAvailable() {
    if (typeof navigator !== 'undefined' && navigator.gpu) {
      return true
    }
    return false
  }

  /**
   * 创建粒子系统
   * @param {Object} config - 粒子系统配置
   * @returns {Object} 粒子系统对象
   */
  function createParticleSystem(config = {}) {
    const {
      particleCount = 10000,
      timeStep = 0.016
    } = config

    if (!isInitialized || !taichiModule) {
      throw new Error('Taichi.js 未初始化')
    }

    const ti = taichiModule
    const N = particleCount

    // 创建场：位置、速度、颜色
    const positions = ti.Vector.field(3, ti.f32, [N])
    const velocities = ti.Vector.field(3, ti.f32, [N])
    const colors = ti.Vector.field(3, ti.f32, [N])

    // 将变量添加到kernel作用域
    ti.addToKernelScope({
      positions,
      velocities,
      colors,
      N
    })

    // 定义初始化内核
    const initKernel = ti.kernel(() => {
      for (let i of ti.range(N)) {
        positions[i] = [
          (ti.random() - 0.5) * 200,
          (ti.random() - 0.5) * 200,
          (ti.random() - 0.5) * 200
        ]
        
        velocities[i] = [
          (ti.random() - 0.5) * 10,
          (ti.random() - 0.5) * 10,
          (ti.random() - 0.5) * 10
        ]
      }
    })

    // 定义更新内核
    const updateKernel = ti.kernel(() => {
      for (let i of ti.range(N)) {
        // 简单的粒子运动
        positions[i][0] += velocities[i][0] * 0.016
        positions[i][1] += velocities[i][1] * 0.016
        positions[i][2] += velocities[i][2] * 0.016

        // 边界反弹 - X轴
        if (positions[i][0] > 100) {
          positions[i][0] = 100
          velocities[i][0] *= -0.9
        } else if (positions[i][0] < -100) {
          positions[i][0] = -100
          velocities[i][0] *= -0.9
        }

        // 边界反弹 - Y轴
        if (positions[i][1] > 100) {
          positions[i][1] = 100
          velocities[i][1] *= -0.9
        } else if (positions[i][1] < -100) {
          positions[i][1] = -100
          velocities[i][1] *= -0.9
        }

        // 边界反弹 - Z轴
        if (positions[i][2] > 100) {
          positions[i][2] = 100
          velocities[i][2] *= -0.9
        } else if (positions[i][2] < -100) {
          positions[i][2] = -100
          velocities[i][2] *= -0.9
        }

        // 颜色脉动
        colors[i][0] = 0.5 + 0.5 * ti.sin(ti.random() * 6.28)
        colors[i][1] = 0.5 + 0.5 * ti.cos(ti.random() * 6.28)
        colors[i][2] = 0.5 + 0.5 * ti.sin(ti.random() * 6.28 + 1.57)
      }
    })

    // 初始化
    initKernel()

    return {
      positions,
      velocities,
      colors,
      update: async (dt, time) => {
        updateKernel()
        await ti.sync()
      },
      getPositions: () => positions.toArray(),
      getVelocities: () => velocities.toArray(),
      getColors: () => colors.toArray(),
      destroy: () => {
        // 场会自动清理
      }
    }
  }

  /**
   * 创建场（用于复杂物理模拟）
   * @param {Object} config - 场配置
   * @returns {Object} 场对象
   */
  function createField(config = {}) {
    const {
      shape = [256, 256],
      dtype = 'f32'
    } = config

    if (!isInitialized || !taichiModule) {
      throw new Error('Taichi.js 未初始化')
    }

    const taichi = taichiModule
    const field = taichi.field(taichi[dtype], shape)

    return {
      field,
      fill: (value) => {
        const fillKernel = taichi.kernel((f, val) => {
          for (let i = 0; i < shape[0]; i++) {
            for (let j = 0; j < shape[1]; j++) {
              f[i, j] = val
            }
          }
        })
        fillKernel(field, value)
      },
      toArray: () => field.toArray(),
      destroy: () => {
        // 场会自动清理
      }
    }
  }

  // 创建工具对象（在插件创建时立即提供，即使还未初始化）
  const taichiUtils = {
    isReady: () => isInitialized,
    isGPU: () => isGPU,
    getModule: () => taichiModule,
    createParticleSystem,
    createField,
    init: initTaichi  // 添加init方法供手动调用
  }

  // 立即提供给Nuxt应用
  nuxtApp.provide('taichi', taichiModule)
  nuxtApp.provide('taichiUtils', taichiUtils)

  // 立即附加到全局window对象（同步操作）
  if (typeof window !== 'undefined') {
    window.__TAICHI_UTILS__ = taichiUtils
    console.log('✅ TaichiUtils 已附加到全局 window.__TAICHI_UTILS__')
  }

  // 插件挂载后自动初始化（异步）
  nuxtApp.hook('app:mounted', async () => {
    console.log('🎬 app:mounted 钩子触发，开始初始化 Taichi.js')
    try {
      await initTaichi()
    } catch (error) {
      console.error('插件自动初始化失败:', error)
    }
  })

  return {
    provide: {
      initTaichi,
      createParticleSystem,
      createField
    }
  }
})
