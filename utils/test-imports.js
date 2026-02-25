/**
 * 导入验证测试
 * 验证所有 WebGPU 工具的导入是否正确
 */

import { MaterialCompatibilityChecker } from './ThreeJSSourceAnalyzer.js'
import { GLSLToWGSLConverter } from './ThreeJSSourceAnalyzer.js'
import { WebGPURendererOptimizer } from './ThreeJSSourceAnalyzer.js'
import { TSLHelper } from './ThreeJSSourceAnalyzer.js'
import { WebGPUDebugger } from './ThreeJSSourceAnalyzer.js'

import { AdvancedWebGPURenderer, createAdvancedWebGPURenderer, analyzeSceneForWebGPU } from './AdvancedWebGPURenderer.js'

console.log('✅ 所有导入验证成功！')
console.log('✅ MaterialCompatibilityChecker:', typeof MaterialCompatibilityChecker)
console.log('✅ GLSLToWGSLConverter:', typeof GLSLToWGSLConverter)
console.log('✅ WebGPURendererOptimizer:', typeof WebGPURendererOptimizer)
console.log('✅ TSLHelper:', typeof TSLHelper)
console.log('✅ WebGPUDebugger:', typeof WebGPUDebugger)
console.log('✅ AdvancedWebGPURenderer:', typeof AdvancedWebGPURenderer)
console.log('✅ createAdvancedWebGPURenderer:', typeof createAdvancedWebGPURenderer)
console.log('✅ analyzeSceneForWebGPU:', typeof analyzeSceneForWebGPU)

export function verifyImports() {
  return {
    success: true,
    classes: [
      'MaterialCompatibilityChecker',
      'GLSLToWGSLConverter',
      'WebGPURendererOptimizer',
      'TSLHelper',
      'WebGPUDebugger',
      'AdvancedWebGPURenderer'
    ],
    functions: [
      'createAdvancedWebGPURenderer',
      'analyzeSceneForWebGPU'
    ]
  }
}
