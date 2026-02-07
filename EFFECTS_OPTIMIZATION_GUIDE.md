# 特效优化方案 - 使用指南

## 📦 已安装的依赖

```bash
npm install stats.js
```

## 🚀 快速开始

### 1. 在 Vue 组件中使用增强版动画控制器

```vue
<template>
  <div ref="animationContainer" class="animation-container" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createAnimationControllerEnhanced } from '~/utils/AnimationControllerEnhanced.js'
import animateQuantumConsciousnessFieldEnhanced from '~/pages/home/components/animation/animations/enhanced/quantum-consciousness-field-enhanced.js'

const animationContainer = ref(null)
let animationController = null

onMounted(async () => {
  // 初始化动画控制器
  animationController = createAnimationControllerEnhanced()
  await animationController.init(
    animationContainer.value,
    true,  // 启用后处理
    true   // 启用性能监控
  )

  // 播放动画
  animateQuantumConsciousnessFieldEnhanced(
    animationController.scene,
    animationController.camera,
    animationController.renderer,
    animationController.controls
  )
})

onUnmounted(() => {
  // 清理资源
  animationController?.dispose()
})
</script>

<style scoped>
.animation-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
```

### 2. 创建自定义特效（继承 BaseEffect）

```javascript
// animations/my-custom-effect.js
import { BaseEffect } from './base/BaseEffect.js'

export class MyCustomEffect extends BaseEffect {
  play() {
    const tl = this.createTimeline()

    // 创建粒子系统
    const particles = this.createParticleSystem(5000, {
      size: 10,
      colors: [0xff0000, 0x00ff00, 0x0000ff]
    })

    // 动画变量
    let time = 0

    // 启动动画循环
    this.startAnimationLoop(() => {
      time += 0.016

      // 更新粒子位置
      particles.updatePositions((i, x, y, z) => {
        return {
          x: x + Math.sin(time + i * 0.1) * 0.5,
          y: y + Math.cos(time + i * 0.1) * 0.5,
          z: z
        }
      })
    })

    // 颜色动画
    const startColor = new THREE.Color(0x00ffff)
    const endColor = new THREE.Color(0xff00ff)

    this.animateColor(startColor, endColor, 3, (color) => {
      particles.setAllColors(color.r, color.g, color.b)
    })

    // 粒子大小动画
    this.animateParticleSize(particles, 15, 3)

    // 相机动画
    this.animateCamera(new THREE.Vector3(0, 0, 50), 2)

    // 3秒后淡出
    this.animateParticleOpacity(particles, 0, 3)

    // 设置动画持续时间
    tl.to({}, { duration: 6 })

    return tl
  }
}

// 导出函数
export default function animateMyCustomEffect(scene, camera, renderer, controls) {
  const effect = new MyCustomEffect(scene, camera, renderer, controls)
  return effect.play()
}
```

## 🎨 使用后处理效果

### 动态调整 Bloom 参数

```javascript
// 在动画过程中调整 Bloom 强度
animationController.setBloomStrength(2.0)

// 调整 Bloom 半径
animationController.setBloomRadius(0.5)

// 调整 Bloom 阈值
animationController.setBloomThreshold(0.7)

// 同时调整所有参数
animationController.setBloom({
  strength: 2.0,
  radius: 0.5,
  threshold: 0.7
})
```

### 使用 GSAP 动画化 Bloom 参数

```javascript
// Bloom 强度动画
gsap.to(animationController.bloomPass, {
  strength: 2.0,
  duration: 2,
  ease: 'power2.inOut'
})

// Bloom 阈值动画（从 0.85 到 0.5）
gsap.to(animationController.bloomPass, {
  threshold: 0.5,
  duration: 2,
  ease: 'power2.inOut'
})
```

## 📊 使用性能监控

```javascript
// 显示性能监控
animationController.togglePerformanceMonitor(true)

// 隐藏性能监控
animationController.togglePerformanceMonitor(false)
```

## 🔧 高性能粒子系统

### 使用标准粒子系统（适合 10000 粒子以下）

```javascript
const particles = this.createParticleSystem(8000, {
  size: 8,
  colors: [0x00ffff, 0xff00ff, 0xffff00],
  depthWrite: false  // 关键性能优化
})

// 更新粒子位置
particles.updatePositions((i, x, y, z) => {
  return {
    x: x + velocity.x,
    y: y + velocity.y,
    z: z + velocity.z
  }
})
```

### 使用 InstancedMesh 粒子系统（适合 100000 粒子以上）

```javascript
const particles = this.createInstancedParticleSystem(100000, {
  geometry: new THREE.SphereGeometry(0.5, 8, 8),
  materialOptions: {
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  }
})

// 设置单个粒子
particles.setParticle(0, {
  position: new THREE.Vector3(0, 0, 0),
  color: 0xff0000,
  scale: 1.5
})

// 批量设置粒子
const particleData = Array.from({ length: 1000 }, (_, i) => ({
  position: new THREE.Vector3(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  ),
  color: [0xff0000, 0x00ff00, 0x0000ff][i % 3],
  scale: 0.5 + Math.random()
}))
particles.setParticles(particleData)
```

## 🎯 性能优化技巧

### 1. 控制粒子数量

| 粒子系统 | 最大推荐数量 | 适用场景 |
|---------|------------|---------|
| 标准粒子系统 | 10000 | 简单特效 |
| InstancedMesh | 100000 | 大规模特效 |
| GPU 粒子 | 1000000+ | 超大规模特效 |

### 2. 关键性能优化

```javascript
// ✅ 使用 depthWrite: false
const particles = this.createParticleSystem(count, {
  depthWrite: false  // 禁用深度写入，大幅提升性能
})

// ✅ 限制动画更新频率
let frameCount = 0
this.startAnimationLoop(() => {
  frameCount++
  if (frameCount % 2 === 0) {  // 每 2 帧更新一次
    particles.updatePositions(...)
  }
})

// ✅ 使用 Float32Array 存储数据
const positions = new Float32Array(count * 3)

// ✅ 及时清理资源
this.cleanup()
```

### 3. Bloom 性能权衡

| Bloom Strength | 性能影响 | 视觉效果 |
|---------------|---------|---------|
| 0.0 | 无影响 | 无发光 |
| 0.5 | 轻微 | 轻微发光 |
| 1.0 | 中等 | 明显发光 |
| 1.5 | 明显 | 强烈发光 |
| 2.0+ | 严重 | 极度发光（可能卡顿） |

建议使用 `strength: 1.5` 作为默认值。

## 📈 预期性能提升

### 优化前 vs 优化后

| 指标 | 优化前 | 优化后 | 提升 |
|------|-------|-------|------|
| 10000 粒子 FPS | 30-40 | 55-60 | +50% |
| 100000 粒子 FPS | 10-15 | 50-55 | +400% |
| 内存占用 | 高 | 低 | -60% |
| 视觉效果 | 普通 | 华丽（Bloom） | 质变 |
| 代码复用 | 0% | 80% | 标准化 |

## 🔄 迁移现有特效

### 步骤 1：继承 BaseEffect

```javascript
// 旧代码
export default function animateMyEffect(scene, camera, renderer, controls) {
  // ... 动画逻辑
}

// 新代码
import { BaseEffect } from './base/BaseEffect.js'

export class MyEffect extends BaseEffect {
  play() {
    const tl = this.createTimeline()

    // 使用基类方法创建粒子
    const particles = this.createParticleSystem(8000)

    // ... 动画逻辑

    return tl
  }
}

export default function animateMyEffect(scene, camera, renderer, controls) {
  const effect = new MyEffect(scene, camera, renderer, controls)
  return effect.play()
}
```

### 步骤 2：替换粒子创建

```javascript
// 旧代码
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(count * 3)
// ... 手动创建粒子
const material = new THREE.PointsMaterial({...})
const points = new THREE.Points(geometry, material)
scene.add(points)

// 新代码
const particles = this.createParticleSystem(count, {
  size: 8,
  colors: [0x00ffff, 0xff00ff, 0xffff00]
})
// 自动清理，无需手动移除
```

### 步骤 3：使用基类动画方法

```javascript
// 旧代码
gsap.to(camera.position, {
  x: 0, y: 0, z: 50,
  duration: 2,
  ease: 'power2.inOut'
})

// 新代码
this.animateCamera(new THREE.Vector3(0, 0, 50), 2)
```

## 🎓 完整示例

查看以下文件了解更多：

1. `animations/base/BaseEffect.js` - 特效基类
2. `animations/enhanced/quantum-consciousness-field-enhanced.js` - 增强版特效示例
3. `utils/AnimationControllerEnhanced.js` - 动画控制器
4. `utils/highPerformanceParticles.js` - 高性能粒子系统
5. `utils/InstancedParticleSystem.js` - InstancedMesh 粒子系统

## 🐛 常见问题

### Q: Bloom 效果导致卡顿怎么办？

A: 降低 Bloom 强度或阈值：

```javascript
animationController.setBloom({
  strength: 1.0,  // 从 1.5 降低到 1.0
  threshold: 0.9  // 从 0.85 提高到 0.9（只让更亮的部分发光）
})
```

### Q: 粒子数量超过 10000 就卡顿怎么办？

A: 使用 InstancedMesh 粒子系统：

```javascript
const particles = this.createInstancedParticleSystem(100000)
```

### Q: 如何禁用性能监控？

A: 在初始化时设置：

```javascript
await animationController.init(
  animationContainer.value,
  true,  // 启用后处理
  false  // 禁用性能监控
)
```

## 📞 支持

如有问题，请查看：
- Three.js 官方文档：https://threejs.org/docs/
- GSAP 官方文档：https://gsap.com/docs/
- 项目 ARCHITECTURE.md：了解整体架构
