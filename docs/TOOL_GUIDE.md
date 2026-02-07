# 工具使用指南

本文档介绍特效动画系统的所有核心工具和它们的使用方法。

## 目录

1. [ParticleFactory - 粒子工厂](#particlefactory)
2. [PerformanceMonitor - 性能监控](#performancemonitor)
3. [LODManager - LOD管理](#lodmanager)
4. [BaseEffect - 基础特效类](#baseeffect)
5. [EnhancedBaseEffect - 增强特效类](#enhancedbaseeffect)
6. [CodeAnalyzer - 代码分析器](#codeanalyzer)
7. [AnimationTemplateGenerator - 模板生成器](#animationtemplategenerator)
8. [AnimationTestSuite - 测试套件](#animationtestsuite)
9. [PerformanceBenchmark - 性能基准](#performancebenchmark)

---

## ParticleFactory - 粒子工厂

统一粒子创建接口，减少代码重复。

### 基本用法

```javascript
import { ParticleFactory } from '~/utils/ParticleFactory.js'

// 创建螺旋形粒子
const particles = ParticleFactory.create({
  count: 10000,
  shape: 'spiral',
  colorMode: 'gradient',
  color1: 0x00ffff,
  color2: 0xff00ff,
  size: 0.5
})

scene.add(particles.particleSystem)
```

### 支持的形状

- `random` - 随机分布
- `sphere` - 球形分布
- `cube` - 立方体分布
- `spiral` - 螺旋分布
- `ring` - 环形分布

### 支持的颜色模式

- `white` - 纯白色
- `gradient` - 渐变色（color1到color2）
- `rainbow` - 彩虹色

### InstancedMesh粒子

```javascript
const instanced = ParticleFactory.createInstanced({
  count: 5000,
  shape: 'sphere',
  size: 1.0
})

scene.add(instanced.instancedMesh)
```

### 流式粒子

```javascript
const stream = ParticleFactory.createStream({
  count: 8000,
  flowSpeed: 1,
  flowAxis: 'y',
  shape: 'spiral'
})

// 每帧更新
stream.updateFlow(time)
```

### 清理

```javascript
particles.dispose()
scene.remove(particles.particleSystem)
```

---

## PerformanceMonitor - 性能监控

实时监控FPS、内存、Draw Calls等性能指标。

### 基本用法

```javascript
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

const monitor = new PerformanceMonitor()
monitor.start()

// 每帧更新
monitor.tick(renderer, particleCount)

// 获取报告
const report = monitor.getReport()
console.log(\`FPS: \${report.fps}, 平均FPS: \${report.averageFPS}\`)
```

### 性能报告

```javascript
{
  fps: 55,              // 当前FPS
  averageFPS: 53,       // 平均FPS
  fpsHistory: [...],    // FPS历史
  particleCount: 10000,  // 粒子数量
  drawCalls: 25,        // Draw Calls
  triangles: 50000,     // 三角形数量
  memoryUsed: 45.2,     // 内存使用(MB)
  memoryTotal: 128.0,   // 总内存(MB)
  status: 'good',       // 性能状态: excellent | good | fair | poor
  recommendations: [...] // 优化建议
}
```

### 建议使用方式

```javascript
// 在EnhancedBaseEffect中自动使用
class MyEffect extends EnhancedBaseEffect {
  update() {
    const totalParticles = this.calculateTotalParticles()
    this.updatePerformance(totalParticles)
  }
}
```

### 停止监控

```javascript
monitor.stop()
monitor.reset()
```

---

## LODManager - LOD管理

自适应细节等级管理，根据性能自动调整质量。

### 基本用法

```javascript
import { LODManager } from '~/utils/LODManager.js'

const lodManager = new LODManager()
lodManager.start()

// 每帧更新
lodManager.update(particleCount, renderer)

// 获取调整后的数量
const adjustedCount = lodManager.getAdjustedCount(10000)
```

### LOD等级

| 等级 | FPS要求 | 乘数 | 说明 |
|------|---------|------|------|
| Ultra | ≥55 | 1.5x | 最高质量 |
| High | ≥50 | 1.0x | 高质量 |
| Medium | ≥40 | 0.7x | 中等质量 |
| Low | ≥30 | 0.5x | 低质量 |
| Potato | <30 | 0.3x | 最低质量 |

### 手动设置LOD

```javascript
// 禁用自动LOD
lodManager.setAutoLOD(false)

// 手动设置等级
lodManager.setLODLevel('medium')
```

### 获取渲染质量建议

```javascript
const quality = lodManager.getRenderQuality()

// quality.level: 'medium'
// quality.shadowQuality: 512
// quality.antialiasing: false
// quality.textureQuality: 0.75
```

### 应用质量设置

```javascript
const quality = lodManager.getRenderQuality()

// 阴影质量
renderer.shadowMap.type = quality.shadowQuality

// 抗锯齿
renderer.setPixelRatio(quality.antialiasing ? window.devicePixelRatio : 1)

// 纹理质量
// 应用到纹理加载
```

---

## BaseEffect - 基础特效类

所有特效的基类，提供统一的接口和生命周期管理。

### 基本用法

```javascript
import { BaseEffect } from '~/pages/home/components/animation/animations/base/BaseEffect.js'

export class MyEffect extends BaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)
  }

  play() {
    // 必须实现
  }
}
```

### 可用方法

```javascript
// 创建粒子系统
const particles = this.createParticleSystem(10000, options)

// 创建InstancedMesh粒子
const instanced = this.createInstancedParticleSystem(10000, options)

// 创建几何体
const mesh = this.createMesh(geometry, material)

// 创建点云
const points = this.createPoints(geometry, material)

// 创建线条
const line = this.createLine(geometry, material)

// 创建组
const group = this.createGroup()

// 创建时间线
const tl = this.createTimeline(onComplete)

// 动画
this.animate(object, { opacity: 1 }, { duration: 2 })
this.animateCamera({ x: 0, y: 20, z: 50 }, 2)
this.animateCameraLookAt({ x: 0, y: 0, z: 0 }, 2)

// 启动动画循环
this.startAnimationLoop(() => {
  this.update()
})

// 停止动画循环
this.stopAnimationLoop()

// 清理
this.cleanup()
```

### 生命周期

```javascript
class MyEffect extends BaseEffect {
  play() {
    // 1. 创建对象
    this.createObject()

    // 2. 设置动画
    this.setupAnimation()

    // 3. 启动循环
    this.startAnimationLoop()
  }

  update() {
    // 每帧更新
  }

  pause() {
    this.stopAnimationLoop()
  }

  resume() {
    this.startAnimationLoop()
  }

  stop() {
    this.stopAnimationLoop()
    this.cleanup()
  }

  cleanup() {
    // 清理资源
    super.cleanup()
  }
}
```

---

## EnhancedBaseEffect - 增强特效类

继承BaseEffect，添加性能监控和自适应LOD。

### 基本用法

```javascript
import { EnhancedBaseEffect } from '~/pages/home/components/animation/animations/base/EnhancedBaseEffect.js'

export class MyEffect extends EnhancedBaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)
  }

  play() {
    // 自动性能监控已启用
    this.createParticleSystem()
    this.startAnimationLoop()
  }

  update() {
    // 更新性能监控
    const totalParticles = this.getTotalParticles()
    this.updatePerformance(totalParticles)
  }
}
```

### 自动LOD

```javascript
// 获取LOD调整后的粒子数量
const adjustedCount = this.getAdjustedParticleCount(10000)

// 创建粒子
const particles = ParticleFactory.create({ count: adjustedCount, ... })

// LOD变化回调
onLODChange(level, multiplier) {
  console.log(\`LOD调整为: \${level} (\${multiplier})\`)
  // 重新创建粒子系统
}
```

### 性能报告

```javascript
// 打印性能报告
this.logPerformanceReport()

// 获取报告
const report = this.getPerformanceReport()
console.log(\`LOD: \${report.lodLevel}, FPS: \${report.fps}\`)
```

### 状态检查

```javascript
// 是否应该降低质量
if (this.shouldReduceQuality()) {
  // 减少粒子
}

// 是否可以提高质量
if (this.canIncreaseQuality()) {
  // 增加粒子
}
```

---

## CodeAnalyzer - 代码分析器

自动分析动画文件的代码质量和性能问题。

### 基本用法

```javascript
import { CodeAnalyzer } from '~/utils/CodeAnalyzer.js'

const analyzer = new CodeAnalyzer()

// 分析单个文件
const result = analyzer.analyzeFile('./my-animation.js')

// 分析整个目录
const summary = analyzer.analyzeDirectory('./animations')

// 打印报告
analyzer.logReport()

// 导出JSON
const json = analyzer.generateJSONReport()
```

### 分析结果

```javascript
{
  fileName: 'my-animation.js',
  lines: 500,
  particleCount: 10000,
  complexity: 45,
  usesBaseEffect: true,
  hasCleanup: true,
  hasON2Loops: false,
  issues: [
    {
      type: 'performance',
      severity: 'warning',
      message: '粒子数量超过5万，建议使用LOD系统'
    }
  ],
  priority: 'P1'  // P0 | P1 | P2 | P3
}
```

### 优先级列表

```javascript
const priorityList = analyzer.getPriorityList()

// P0: 严重问题（O(n²)循环）
// P1: 重要问题（内存泄漏、高粒子数）
// P2: 一般问题（代码质量）
// P3: 无问题
```

---

## AnimationTemplateGenerator - 模板生成器

快速创建标准化的动画文件。

### 命令行使用

```bash
# 生成BaseEffect模板
node scripts/AnimationTemplateGenerator.js MyAnimation baseEffect

# 生成EnhancedBaseEffect模板
node scripts/AnimationTemplateGenerator.js MyAnimation enhancedBaseEffect

# 生成简单模板
node scripts/AnimationTemplateGenerator.js MyAnimation simple
```

### 编程使用

```javascript
import { AnimationTemplateGenerator } from '~/scripts/AnimationTemplateGenerator.js'

const generator = new AnimationTemplateGenerator()

// 生成单个动画
generator.generate({
  name: 'CosmicNebula',
  className: 'CosmicNebula',
  templateType: 'enhancedBaseEffect',
  outputPath: './animations/'
})

// 列出可用模板
const templates = generator.listTemplates()
console.log(templates)
```

### 可用模板

1. **baseEffect** - BaseEffect基础模板
2. **enhancedBaseEffect** - EnhancedBaseEffect增强模板（推荐）
3. **simple** - 简单函数式模板

---

## AnimationTestSuite - 测试套件

自动化测试动画的基本功能和性能。

### 基本用法

```javascript
import { AnimationTestSuite, BasicFunctionalityTests, PerformanceTests } from '~/scripts/AnimationTestSuite.js'

const suite = new AnimationTestSuite()

// 准备测试
const tests = [
  BasicFunctionalityTests.testInitialization(MyAnimation, scene, camera, renderer, controls),
  BasicFunctionalityTests.testPlayMethod(MyAnimation, scene, camera, renderer, controls),
  BasicFunctionalityTests.testCleanup(MyAnimation, scene, camera, renderer, controls),
  PerformanceTests.testFPS(MyAnimation, scene, camera, renderer, controls, 45),
  PerformanceTests.testMemoryLeak(MyAnimation, scene, camera, renderer, controls)
]

// 运行测试
await suite.runAllTests(tests)

// 生成报告
const report = suite.generateReport()
console.log(report)
```

### 测试类型

**基础功能测试**
- 初始化测试
- Play方法测试
- Cleanup测试

**性能测试**
- FPS测试
- 内存泄漏测试
- Draw Calls测试

**代码质量测试**
- 继承BaseEffect测试
- ParticleFactory使用测试

### 测试结果

```javascript
{
  total: 5,
  passed: 4,
  failed: 1,
  successRate: 80,
  results: [...]
}
```

---

## PerformanceBenchmark - 性能基准

对比不同动画的性能表现。

### 基本用法

```javascript
import { PerformanceBenchmark, BenchmarkScenarios } from '~/scripts/PerformanceBenchmark.js'

const benchmark = new PerformanceBenchmark()

// 准备Three.js环境
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const renderer = new THREE.WebGLRenderer()

// 运行基准测试
const result = await benchmark.runBenchmark({
  name: 'MyAnimation',
  animationFn: async ({ scene, camera, renderer, controls }) => {
    // 动画函数
  },
  scene, camera, renderer, controls,
  duration: 5000
})

// 对比两个结果
benchmark.compare(result1, result2)

// 导出报告
benchmark.exportJSON('./performance-report.json')
```

### LOD基准测试

```javascript
// 测试不同LOD等级的性能
const lodResults = await benchmark.runLODBenchmark({
  name: 'MyAnimation',
  animationFn,
  scene, camera, renderer, controls,
  lods: BenchmarkScenarios.lodScenarios()
})
```

### 预定义场景

```javascript
BenchmarkScenarios.smallParticles()    // 1000粒子
BenchmarkScenarios.mediumParticles()   // 10000粒子
BenchmarkScenarios.largeParticles()    // 50000粒子
BenchmarkScenarios.ultraParticles()    // 100000粒子
BenchmarkScenarios.lodScenarios()      // LOD测试场景
```

---

## 最佳实践

### 1. 始终使用基类

```javascript
// ✅ 推荐
export class MyEffect extends EnhancedBaseEffect {
  play() { }
}

// ❌ 不推荐
export default function animateMyAnimation(props, callbacks) {
  // ...
}
```

### 2. 使用ParticleFactory

```javascript
// ✅ 推荐
const particles = ParticleFactory.create({
  count: 10000,
  shape: 'spiral'
})

// ❌ 不推荐
const geometry = new THREE.BufferGeometry()
for (let i = 0; i < 10000; i++) {
  // 重复代码...
}
```

### 3. 清理资源

```javascript
// ✅ 推荐
cleanup() {
  this.particleSystems.forEach(p => p.dispose())
  super.cleanup()
}

// ❌ 不推荐
// 缺少cleanup方法
```

### 4. 避免O(n²)循环

```javascript
// ❌ 错误
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    // O(n²)
  }
}

// ✅ 正确
// 使用简化模型或空间划分
```

### 5. 使用LOD系统

```javascript
// ✅ 推荐
export class MyEffect extends EnhancedBaseEffect {
  createParticles() {
    const count = this.getAdjustedParticleCount(10000)
    // ...
  }
}
```

---

## 故障排除

### 性能问题

**问题**: FPS过低
- 使用PerformanceMonitor找出瓶颈
- 启用LOD自动调整
- 减少粒子数量
- 检查Draw Calls

**问题**: 内存泄漏
- 检查cleanup方法
- 运行内存泄漏测试
- 使用CodeAnalyzer检测

### 代码问题

**问题**: 粒子不显示
- 检查材质透明度
- 检查相机位置
- 确认已添加到scene

**问题**: 动画不更新
- 确认启动了动画循环
- 检查needsUpdate标志
- 验证update方法被调用

---

## 示例项目

完整示例项目：`./examples/`

- `basic-effect/` - BaseEffect基础示例
- `enhanced-effect/` - EnhancedBaseEffect增强示例
- `particle-factory/` - ParticleFactory使用示例
- `lod-system/` - LOD系统示例

---

## 更多资源

- [API文档](./API.md)
- [性能优化指南](./PERFORMANCE.md)
- [最佳实践](./BEST_PRACTICES.md)
