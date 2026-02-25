/**
 * WebGPU 快速测试脚本
 * 直接运行此文件来测试 WebGPU 支持
 */

import * as THREE from 'three'
import { quickDiagnose } from './WebGPUDiagnostic.js'

async function runWebGPUTest() {
  console.log('🚀 WebGPU 快速测试开始...\n')

  // 运行诊断
  const results = await quickDiagnose()

  // 测试结果总结
  console.log('\n' + '='.repeat(60))
  console.log('📊 测试结果总结')
  console.log('='.repeat(60))

  if (results.capabilities.available) {
    console.log('✅ WebGPU 完全可用!')
    console.log('✅ Three.js WebGPURenderer 已就绪')
    console.log('✅ 您可以开始使用 WebGPU 渲染')
  } else {
    console.log('⚠️  WebGPU 不可用')
    console.log('💡 建议:')
    console.log('   1. 更新浏览器到最新版本')
    console.log('   2. 启用 WebGPU 标志 (Firefox: about:config)')
    console.log('   3. 使用 Chrome/Edge 113+')
  }

  console.log('\n' + '='.repeat(60))
}

// 运行测试
runWebGPUTest().catch(console.error)
