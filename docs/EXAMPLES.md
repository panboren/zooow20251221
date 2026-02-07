# 示例代码

本文档包含各种使用场景的完整示例代码。

## 目录

1. [基础动画示例](#基础动画示例)
2. [使用EnhancedBaseEffect](#使用enhancedbaseeffect)
3. [粒子系统示例](#粒子系统示例)
4. [LOD系统示例](#lod系统示例)
5. [性能监控示例](#性能监控示例)
6. [动画组合示例](#动画组合示例)

---

## 基础动画示例

### 简单的粒子动画

```javascript
import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

export default function animateSimpleParticles(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 设置相机
    setupInitialCamera(camera, new THREE.Vector3(0, 50, 100), 75, controls)

    // 创建时间线
    const tl = createTimeline(
      () => {
        if (onComplete) onComplete({ type: 'simple-particles' })
      },
      onError,
      'Simple Particles',
      controls
    )

    // 创建粒子系统
    const particleCount = 10000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // 随机分布
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // 创建材质
    const material = new THREE.PointsMaterial({
      size: 0.5,
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // 动画：淡入
    gsap.to(material, { opacity: 1, duration: 2 })

    // 动画：旋转
    gsap.to(points.rotation, {
      y: Math.PI * 2,
      duration: 10,
      ease: 'none'
    })

    // 更新循环
    const updateHandler = () => {
      const time = Date.now() * 0.001

      // 粒子波动
      const pos = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        pos[idx + 1] += Math.sin(time + i * 0.01) * 0.01
      }
      geometry.attributes.position.needsUpdate = true
    }

    // 清理
    tl.call(() => {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }, null, 5)

    return { updateHandler }

  } catch (error) {
    if (onError) onError(error)
    return null
  }
}
```

---

## 使用EnhancedBaseEffect

### 完整的增强动画

```javascript
import { EnhancedBaseEffect } from './base/EnhancedBaseEffect.js'
import { ParticleFactory } from '~/utils/ParticleFactory.js'
import * as THREE from 'three'
import { gsap } from 'gsap'

export class CosmicNebula extends EnhancedBaseEffect {
  constructor(scene, camera, renderer, controls) {
    super(scene, camera, renderer, controls)

    this.config = {
      baseParticleCount: 15000,
      animationDuration: 7000
    }

    this.particleSystems = []
  }

  /**
   * 播放动画
   */
  play() {
    console.log(\`开始播放: \${this.constructor.name}\`)

    this.setupCamera()
    this.createParticleSystems()
    this.setupAnimations()
    this.startAnimationLoop()
  }

  /**
   * 设置相机
   */
  setupCamera() {
    this.camera.position.set(0, 80, 120)
    this.camera.lookAt(0, 0, 0)

    // 相机动画
    gsap.to(this.camera.position, {
      x: 0,
      y: 30,
      z: 60,
      duration: 5,
      ease: 'power2.inOut'
    })

    gsap.to(this.camera, {
      fov: 60,
      duration: 5,
      onUpdate: () => this.camera.updateProjectionMatrix()
    })
  }

  /**
   * 创建粒子系统（使用LOD）
   */
  createParticleSystems() {
    const particleCount = this.getAdjustedParticleCount(this.config.baseParticleCount)

    // 创建主星云
    const mainNebula = ParticleFactory.create({
      count: particleCount,
      shape: 'spiral',
      colorMode: 'gradient',
      color1: 0x00ffff,
      color2: 0xff00ff,
      size: 0.3
    })

    this.scene.add(mainNebula.particleSystem)
    this.particleSystems.push(mainNebula)

    // 创建星尘
    const starDust = ParticleFactory.create({
      count: Math.floor(particleCount * 0.3),
      shape: 'sphere',
      colorMode: 'white',
      size: 0.15
    })

    this.scene.add(starDust.particleSystem)
    this.particleSystems.push(starDust)

    console.log(\`粒子数量 (LOD \${this.lodLevel}): \${particleCount}\`)
  }

  /**
   * 设置动画
   */
  setupAnimations() {
    // 粒子淡入
    this.particleSystems.forEach((system, index) => {
      gsap.to(system.material, {
        opacity: 1,
        duration: 2,
        delay: index * 0.5,
        ease: 'power2.out'
      })
    })

    // 相机动画
    const tl = this.createTimeline(() => {
      console.log('动画完成')
      this.cleanup()
    })
  }

  /**
   * 启动动画循环
   */
  startAnimationLoop() {
    this.isActive = true
    const animate = () => {
      if (!this.isActive) return

      this.update()
      requestAnimationFrame(animate)
    }
    animate()
  }

  /**
   * 每帧更新
   */
  update() {
    const time = performance.now() * 0.001

    // 更新粒子
    this.updateParticles(time)

    // 更新粒子系统
    this.particleSystems.forEach(system => {
      system.particleSystem.rotation.y += 0.001
      system.particleSystem.rotation.x += 0.0005
    })

    // 更新性能监控
    const totalParticles = this.particleSystems.reduce(
      (sum, p) => sum + p.geometry.attributes.position.count,
      0
    )
    this.updatePerformance(totalParticles)

    // 定期打印性能报告
    if (Math.random() < 0.002) {
      this.logPerformanceReport()
    }
  }

  /**
   * 更新粒子位置
   */
  updateParticles(time) {
    // 根据LOD调整更新频率
    const updateInterval = this.lodLevel === 'low' ? 4 : 1

    this.particleSystems.forEach(system => {
      const positions = system.geometry.attributes.position.array
      const count = positions.length / 3

      for (let i = 0; i < count; i += updateInterval) {
        const idx = i * 3
        const angle = i * 0.01 + time * 0.5

        // 螺旋运动
        const radius = 20 + Math.sin(angle) * 5
        positions[idx] = Math.cos(angle) * radius
        positions[idx + 1] += Math.sin(time + i * 0.01) * 0.005
        positions[idx + 2] = Math.sin(angle) * radius
      }

      system.geometry.attributes.position.needsUpdate = true
    })
  }

  /**
   * LOD变化回调
   */
  onLODChange(level, multiplier) {
    console.log(\`LOD变化: \${level} (\${multiplier})\`)

    // 重新创建粒子系统
    this.cleanupParticleSystems()
    this.createParticleSystems()
  }

  /**
   * 清理粒子系统
   */
  cleanupParticleSystems() {
    this.particleSystems.forEach(system => {
      this.scene.remove(system.particleSystem)
      system.dispose()
    })
    this.particleSystems = []
  }

  /**
   * 清理资源
   */
  cleanup() {
    console.log(\`清理: \${this.constructor.name}\`)
    this.cleanupParticleSystems()
    super.cleanup()
  }
}

// 兼容旧代码的导出
export default function animateCosmicNebula(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    const effect = new CosmicNebula(scene, camera, renderer, controls)
    effect.play()

    if (onComplete) {
      setTimeout(() => onComplete({ type: 'cosmic-nebula' }), 7000)
    }
  } catch (error) {
    console.error(\`动画播放失败: \${error.message}\`)
    if (onError) onError(error)
  }
}
```

---

## 粒子系统示例

### 使用不同形状和颜色

```javascript
import { ParticleFactory } from '~/utils/ParticleFactory.js'

// 1. 螺旋形渐变色
const spiral = ParticleFactory.create({
  count: 10000,
  shape: 'spiral',
  colorMode: 'gradient',
  color1: 0xff0000,  // 红色
  color2: 0x0000ff,  // 蓝色
  size: 0.3
})

// 2. 球形彩虹色
const sphere = ParticleFactory.create({
  count: 8000,
  shape: 'sphere',
  colorMode: 'rainbow',
  size: 0.2
})

// 3. 环形白色
const ring = ParticleFactory.create({
  count: 5000,
  shape: 'ring',
  colorMode: 'white',
  size: 0.25
})

// 4. 立方体渐变
const cube = ParticleFactory.create({
  count: 12000,
  shape: 'cube',
  colorMode: 'gradient',
  color1: 0x00ff00,
  color2: 0xffff00,
  size: 0.15
})

// 添加到场景
scene.add(spiral.particleSystem)
scene.add(sphere.particleSystem)
scene.add(ring.particleSystem)
scene.add(cube.particleSystem)
```

### 使用InstancedMesh

```javascript
// 创建大量相同的几何体
const instanced = ParticleFactory.createInstanced({
  count: 5000,
  geometry: new THREE.SphereGeometry(0.5, 16, 16),
  material: new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  shape: 'sphere',
  range: 50
})

scene.add(instanced.instancedMesh)

// 清理
instanced.dispose()
scene.remove(instanced.instancedMesh)
```

### 使用流式粒子

```javascript
// 创建流动效果
const stream = ParticleFactory.createStream({
  count: 8000,
  flowSpeed: 1.5,
  flowAxis: 'y',  // 沿Y轴流动
  shape: 'spiral',
  color: 0x00ffff,
  size: 0.4
})

scene.add(stream.particleSystem)

// 每帧更新流式效果
const time = performance.now() * 0.001
stream.updateFlow(time)
```

---

## LOD系统示例

### 手动控制LOD

```javascript
import { LODManager } from '~/utils/LODManager.js'

const lodManager = new LODManager()
lodManager.start()

// 禁用自动LOD
lodManager.setAutoLOD(false)

// 手动设置不同等级
function setLOD(level) {
  lodManager.setLODLevel(level)
  console.log(\`LOD设置为: \${level}\`)

  // 根据LOD调整粒子数量
  const baseCount = 10000
  const adjustedCount = lodManager.getAdjustedCount(baseCount)

  // 重新创建粒子系统
  recreateParticles(adjustedCount)
}

// 低配设备
setLOD('low')

// 中配设备
setLOD('medium')

// 高配设备
setLOD('high')

// 超高配设备
setLOD('ultra')
```

### 自动LOD

```javascript
import { EnhancedBaseEffect } from './base/EnhancedBaseEffect.js'

class AutoLODEffect extends EnhancedBaseEffect {
  play() {
    // 自动LOD已启用
    this.createParticles()
    this.startAnimationLoop()
  }

  createParticles() {
    // 自动根据性能调整
    const count = this.getAdjustedParticleCount(10000)

    // FPS≥55: 15000粒子
    // FPS≥50: 10000粒子
    // FPS≥40: 7000粒子
    // FPS≥30: 5000粒子
    // FPS<30: 3000粒子

    const particles = ParticleFactory.create({
      count,
      shape: 'spiral',
      colorMode: 'gradient',
      color1: 0x00ffff,
      color2: 0xff00ff
    })

    this.scene.add(particles.particleSystem)
    this.particleSystems.push(particles)
  }

  onLODChange(level, multiplier) {
    console.log(\`性能变化，LOD自动调整为: \${level}\`)
    // 自动重新创建粒子
    this.cleanupParticles()
    this.createParticles()
  }
}
```

---

## 性能监控示例

### 实时性能监控

```javascript
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

const monitor = new PerformanceMonitor()
monitor.start()

// 在动画循环中
function animate() {
  // 更新监控
  monitor.tick(renderer, particleCount)

  // 每60帧打印一次
  if (renderer.info.render.frame % 60 === 0) {
    const report = monitor.getReport()
    console.log(\`
      FPS: \${report.fps}
      平均FPS: \${report.averageFPS}
      粒子数: \${report.particleCount}
      Draw Calls: \${report.drawCalls}
      内存: \${report.memoryUsed} MB
      状态: \${report.status}
    \`)
  }

  requestAnimationFrame(animate)
}
```

### 性能警告系统

```javascript
class PerformanceAlertSystem {
  constructor() {
    this.monitor = new PerformanceMonitor()
    this.monitor.start()

    this.alertThresholds = {
      fps: 30,
      memory: 512,  // MB
      drawCalls: 100
    }

    this.hasAlerted = false
  }

  checkPerformance() {
    const report = this.monitor.getReport()

    // FPS过低警告
    if (report.averageFPS < this.alertThresholds.fps) {
      this.showAlert('FPS过低', \`当前FPS: \${report.averageFPS.toFixed(1)}\`)
    }

    // 内存过高警告
    if (report.memoryUsed > this.alertThresholds.memory) {
      this.showAlert('内存过高', \`当前内存: \${report.memoryUsed.toFixed(2)} MB\`)
    }

    // Draw Calls过多警告
    if (report.drawCalls > this.alertThresholds.drawCalls) {
      this.showAlert('Draw Calls过多', \`当前: \${report.drawCalls}\`)
    }
  }

  showAlert(title, message) {
    if (!this.hasAlerted) {
      console.warn(\`⚠️ \${title}: \${message}\`)
      this.hasAlerted = true
    }
  }

  reset() {
    this.hasAlerted = false
    this.monitor.reset()
  }
}
```

---

## 动画组合示例

### 多阶段动画

```javascript
class MultiStageAnimation extends EnhancedBaseEffect {
  play() {
    this.stage = 0
    this.createParticles()
    this.startAnimationLoop()
  }

  update() {
    const time = performance.now() * 0.001

    // 阶段1: 展开 (0-3秒)
    if (time < 3) {
      this.stage1Expand(time)
    }
    // 阶段2: 旋转 (3-6秒)
    else if (time < 6) {
      this.stage2Rotate(time)
    }
    // 阶段3: 收缩 (6-9秒)
    else if (time < 9) {
      this.stage3Contract(time)
    }
    // 阶段4: 爆炸 (9-12秒)
    else {
      this.stage4Explode(time)
    }

    this.updatePerformance(10000)
  }

  stage1Expand(time) {
    // 粒子向外展开
    const progress = time / 3
    this.particles.material.opacity = progress
  }

  stage2Rotate(time) {
    // 粒子旋转
    const progress = (time - 3) / 3
    this.particles.particleSystem.rotation.y = progress * Math.PI * 2
  }

  stage3Contract(time) {
    // 粒子向内收缩
    const progress = (time - 3) / 3
    this.particles.material.opacity = 1 - progress
  }

  stage4Explode(time) {
    // 粒子爆炸效果
    this.triggerExplosion()
  }
}
```

### 动画序列

```javascript
class AnimationSequence extends EnhancedBaseEffect {
  play() {
    this.sequences = [
      { name: 'fadeIn', duration: 2, fn: () => this.fadeIn() },
      { name: 'rotate', duration: 3, fn: () => this.rotate() },
      { name: 'scale', duration: 2, fn: () => this.scale() },
      { name: 'fadeOut', duration: 2, fn: () => this.fadeOut() }
    ]

    this.currentSequence = 0
    this.sequenceStartTime = performance.now()
    this.createParticles()
    this.startAnimationLoop()
  }

  update() {
    const now = performance.now()
    const elapsed = (now - this.sequenceStartTime) * 0.001

    const sequence = this.sequences[this.currentSequence]

    if (elapsed < sequence.duration) {
      sequence.fn()
    } else {
      // 切换到下一个序列
      this.currentSequence++
      this.sequenceStartTime = now

      if (this.currentSequence >= this.sequences.length) {
        console.log('所有序列完成')
        this.cleanup()
      }
    }

    this.updatePerformance(10000)
  }
}
```

---

## 更多示例

完整项目示例请查看：

- `./examples/basic-effect/` - BaseEffect基础示例
- `./examples/enhanced-effect/` - EnhancedBaseEffect完整示例
- `./examples/particle-factory/` - ParticleFactory各种用法
- `./examples/lod-system/` - LOD系统实现
- `./examples/performance/` - 性能监控和优化

---

## 常见问题

### Q: 如何选择使用哪个基类？

**A:**
- 新动画：使用 `EnhancedBaseEffect`（推荐）
- 简单动画：使用 `BaseEffect`
- 向后兼容：使用函数式写法

### Q: 粒子数量多少合适？

**A:**
- 移动设备：5000-10000
- 普通桌面：10000-30000
- 高性能设备：30000-100000

使用LOD系统自动调整。

### Q: 如何调试性能问题？

**A:**
1. 使用 `PerformanceMonitor` 监控
2. 使用 `CodeAnalyzer` 分析代码
3. 运行 `PerformanceBenchmark` 测试
4. 检查是否有O(n²)循环

### Q: LOD多久更新一次？

**A:**
默认2秒更新一次，可在 `LODManager` 中调整 `updateInterval`。
