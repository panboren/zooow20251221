/**
 * 全息特效导入测试
 * 验证全息特效是否正确导入
 */

// 测试导入动画索引
import { animations } from '../pages/home/components/animation/animations/index.js'

console.log('=== 全息特效导入测试 ===')

// 测试全息特效是否存在
const holographicEffects = [
  'holographic-data-stream',
  'holographic-ring-array',
  'holographic-spiral',
  'holographic-sphere-array',
  'holographic-glitch'
]

holographicEffects.forEach(effectName => {
  const exists = animations[effectName]
  const type = typeof exists

  console.log(`${effectName}: ${exists ? '✅ 存在' : '❌ 不存在'} (类型: ${type})`)

  if (exists && type === 'function') {
    console.log(`  - 函数名: ${exists.name}`)
  }
})

console.log('=== 测试完成 ===')

export default holographicEffects
