/**
 * WebGPU 深度诊断工具
 * 专业级 WebGPU 渲染器诊断和测试
 */

import * as THREE from 'three'
// WebGPU 渲染器 (Three.js r183+)
import { WebGPURenderer } from 'three/webgpu'

export class WebGPUDiagnostic {
  constructor() {
    this.results = {}
  }

  /**
   * 全面诊断 WebGPU 环境
   */
  async diagnose() {
    console.group('🔍 WebGPU 深度诊断')

    this.results.browserSupport = await this.checkBrowserSupport()
    this.results.threeVersion = this.checkThreeVersion()
    this.results.webgpuClass = this.checkWebGPUClass()
    this.results.adapterInfo = await this.getAdapterInfo()
    this.results.capabilities = await this.getCapabilities()

    console.groupEnd()

    this.printReport()
    return this.results
  }

  /**
   * 检查浏览器支持
   */
  async checkBrowserSupport() {
    console.group('1️⃣ 浏览器支持检查')

    const result = {
      hasGPU: false,
      hasAdapter: false,
      device: null,
      adapter: null,
      browserInfo: this.getBrowserInfo()
    }

    // 检查 navigator.gpu
    result.hasGPU = 'gpu' in navigator
    console.log('navigator.gpu:', result.hasGPU ? '✅ 存在' : '❌ 不存在')

    if (result.hasGPU) {
      try {
        // 请求适配器
        result.adapter = await navigator.gpu.requestAdapter()
        result.hasAdapter = !!result.adapter
        console.log('GPU Adapter:', result.hasAdapter ? '✅ 可用' : '❌ 不可用')

        if (result.adapter) {
          // 请求设备
          result.device = await result.adapter.requestDevice()
          console.log('GPU Device:', result.device ? '✅ 可用' : '❌ 不可用')
        }
      } catch (error) {
        console.error('GPU 初始化错误:', error)
      }
    }

    console.groupEnd()
    return result
  }

  /**
   * 检查 Three.js 版本
   */
  checkThreeVersion() {
    console.group('2️⃣ Three.js 版本检查')

    const version = THREE.REVISION || 'unknown'
    console.log('Three.js 版本:', `r${version}`)
    console.log('REVISION:', THREE.REVISION)
    console.log('WebGPURenderer 可用:', typeof WebGPURenderer !== 'undefined' ? '✅' : '❌')

    const result = {
      version: `r${version}`,
      revision: THREE.REVISION,
      hasWebGPURenderer: typeof WebGPURenderer !== 'undefined'
    }

    console.groupEnd()
    return result
  }

  /**
   * 检查 WebGPU 类
   */
  checkWebGPUClass() {
    console.group('3️⃣ WebGPURenderer 类检查')

    const classes = {
      WebGPURenderer: typeof WebGPURenderer,
      WGSLNodeBuilder: typeof THREE.WGSLNodeBuilder,
      ComputeNode: typeof THREE.ComputeNode,
      StorageTexture: typeof THREE.StorageTexture,
      StorageBufferAttribute: typeof THREE.StorageBufferAttribute
    }

    for (const [name, type] of Object.entries(classes)) {
      console.log(`${name}:`, type === 'undefined' ? '❌ 未定义' : '✅ 可用')
    }

    console.groupEnd()
    return classes
  }

  /**
   * 获取适配器信息
   */
  async getAdapterInfo() {
    console.group('4️⃣ GPU 适配器信息')

    let result = { available: false }

    if ('gpu' in navigator) {
      try {
        const adapter = await navigator.gpu.requestAdapter()
        if (adapter) {
          // 兼容性: 检查 requestAdapterInfo 方法是否存在
          if (typeof adapter.requestAdapterInfo === 'function') {
            result = {
              available: true,
              info: await adapter.requestAdapterInfo()
            }
            console.log('GPU 供应商:', result.info.vendor)
            console.log('GPU 架构:', result.info.architecture)
            console.log('GPU 设备:', result.info.device)
            console.log('GPU 描述:', result.info.description)
          } else {
            // 旧版本浏览器不支持 requestAdapterInfo
            result = {
              available: true,
              info: {
                vendor: 'Unknown (legacy browser)',
                architecture: 'Unknown',
                device: 'Unknown',
                description: 'Adapter info not available'
              }
            }
            console.log('GPU Adapter: 可用 (legacy API)')
          }
        }
      } catch (error) {
        console.error('获取适配器信息失败:', error)
      }
    }

    console.groupEnd()
    return result
  }

  /**
   * 获取 WebGPU 能力
   */
  async getCapabilities() {
    console.group('5️⃣ WebGPU 能力测试')

    let result = { available: false }

    try {
      // 尝试创建一个最小的 WebGPU 渲染器
      const canvas = document.createElement('canvas')
      const renderer = new WebGPURenderer({ canvas, alpha: false })

      // Three.js r183+ WebGPURenderer 不需要 init()
      // 直接获取能力信息
      result = {
        available: true,
        maxTextureDimension2D: renderer.capabilities?.maxTextureDimension2D || 0,
        maxTextureDimension3D: renderer.capabilities?.maxTextureDimension3D || 0,
        maxTextureArrayLayers: renderer.capabilities?.maxTextureArrayLayers || 0,
        maxBindGroups: renderer.capabilities?.maxBindGroups || 0,
        maxComputeWorkgroupsPerDimension: renderer.capabilities?.maxComputeWorkgroupsPerDimension || 0,
        features: renderer.capabilities?.features || []
      }

      console.log('最大 2D 纹理尺寸:', result.maxTextureDimension2D)
      console.log('最大 3D 纹理尺寸:', result.maxTextureDimension3D)
      console.log('最大计算工作组:', result.maxComputeWorkgroupsPerDimension)
      console.log('支持的特性:', result.features)

      // 清理
      renderer.dispose()
    } catch (error) {
      console.error('能力测试失败:', error.message)
      result.error = error.message
    }

    console.groupEnd()
    return result
  }

  /**
   * 获取浏览器信息
   */
  getBrowserInfo() {
    const ua = navigator.userAgent
    let browser = 'Unknown'
    let os = 'Unknown'

    if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Edge')) browser = 'Edge'

    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS')) os = 'iOS'

    return { browser, os, userAgent: ua }
  }

  /**
   * 打印诊断报告
   */
  printReport() {
    console.log('\n')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('              WebGPU 诊断报告')
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`📊 Three.js 版本: ${this.results.threeVersion.version}`)
    console.log(`🌐 浏览器: ${this.results.browserSupport.browserInfo.browser}`)
    console.log(`💻 操作系统: ${this.results.browserSupport.browserInfo.os}`)
    console.log(`🎮 GPU: ${this.results.adapterInfo.available ? this.results.adapterInfo.info.vendor + ' ' + this.results.adapterInfo.info.device : 'N/A'}`)
    console.log(`✅ WebGPU 可用: ${this.results.capabilities.available ? '是' : '否'}`)
    console.log(`⚡ WebGPURenderer: ${this.results.threeVersion.hasWebGPURenderer ? '可用' : '不可用'}`)
    console.log('═══════════════════════════════════════════════════════════')

    // 给出建议
    if (this.results.capabilities.available) {
      console.log('✅ 恭喜!您的浏览器支持 WebGPU,可以启用 WebGPU 渲染')
      console.log('💡 建议: 在渲染器工厂中设置 preferredRenderer = "webgpu"')
    } else {
      console.log('⚠️  WebGPU 不可用,将使用 WebGL2 作为后备')
      console.log('💡 建议: 更新浏览器到最新版本以支持 WebGPU')
    }
    console.log('\n')
  }

  /**
   * 创建一个简单的 WebGPU 测试场景
   */
  async createTestScene() {
    console.group('🎬 创建 WebGPU 测试场景')

    try {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512

      // ✅ 使用正确的 WebGPURenderer 导入
      const renderer = new WebGPURenderer({ canvas, alpha: false })

      // 🔧 Three.js r183+ 某些场景下仍需要等待 backend 初始化
      // 检查是否有 init 方法，如果有则调用
      if (typeof renderer.init === 'function' && renderer.backend && !renderer.backend.initialized) {
        await renderer.init()
      }

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      camera.position.z = 2

      // 创建一个旋转的立方体
      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      // 渲染一帧
      renderer.render(scene, camera)

      console.log('✅ WebGPU 渲染测试成功!')
      console.log('渲染器信息:', {
        type: 'WebGPU',
        info: renderer.info
      })

      // 清理
      renderer.dispose()

      console.groupEnd()
      return true
    } catch (error) {
      console.error('❌ WebGPU 渲染测试失败:', error)
      console.groupEnd()
      return false
    }
  }
}

/**
 * 快速诊断函数
 */
export async function quickDiagnose() {
  const diagnostic = new WebGPUDiagnostic()
  const results = await diagnostic.diagnose()

  // 可选: 运行渲染测试
  if (results.capabilities.available) {
    await diagnostic.createTestScene()
  }

  return results
}
