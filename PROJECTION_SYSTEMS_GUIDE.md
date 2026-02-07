# 全息投影特效系统 - 完整指南

## 🔮 系统概述

全新的全息投影特效系统，专注于创造科幻电影级别的全息视觉效果。系统包含自定义 Shader 材质、全息对象工厂、完整动画集和交互式演示组件。

## 📦 核心模块

### 1. 全息材质核心库 (`holographic-core.js`)

提供 6 种专业全息 Shader 材质：

#### HolographicMaterial - 全息投影材质
**特点**：
- 边缘发光（Fresnel 效果）
- 扫描线动画
- 故障效果
- 半透明叠加
- 青色/蓝色调

**参数**：
```javascript
{
  color: new THREE.Color(0x00ffff),      // 基础颜色
  scanlineSpeed: 0.5,                     // 扫描线速度
  scanlineIntensity: 0.3,                 // 扫描线强度
  glitchIntensity: 0.0,                   // 故障强度
  glowIntensity: 1.0                      // 发光强度
}
```

**使用**：
```javascript
const material = new HolographicMaterial({
  color: new THREE.Color(0x00ffff),
  glowIntensity: 1.5
})

material.update(time)           // 更新时间
material.setGlitch(0.5)         // 设置故障强度
material.setColor(0xff00ff)     // 设置颜色
```

#### HolographicScanlineMaterial - 全息扫描线
**特点**：
- 垂直移动的扫描线
- 渐变透明度
- 网格平面显示

#### HolographicParticleMaterial - 全息粒子
**特点**：
- AdditiveBlending 叠加混合
- 大小衰减
- 高性能渲染

#### HolographicGridMaterial - 全息网格
**特点**：
- 地面网格效果
- 距离衰减
- 发光网格线

#### HolographicGlitchMaterial - 全息故障
**特点**：
- RGB 色彩分离
- 随机故障块
- 闪烁效果

#### HolographicBeamMaterial - 全息光束
**特点**：
- 核心发光
- 脉动效果
- 流动光束

### 2. 全息对象工厂 (`holographic-factory.js`)

快速创建各种全息对象的工厂函数：

#### 基础几何体
```javascript
// 全息立方体
const cube = createHolographicCube(10, {
  color: new THREE.Color(0x00ffff),
  glowIntensity: 1.5
})

// 全息球体
const sphere = createHolographicSphere(10, {
  color: new THREE.Color(0xff00ff),
  glowIntensity: 2.0
})

// 全息环形
const torus = createHolographicTorus(8, 12, {
  color: new THREE.Color(0xffff00)
})

// 全息锥体
const cone = createHolographicCone(10, 20, {
  color: new THREE.Color(0x00ff00)
})
```

#### 复杂组合
```javascript
// 全息扫描线
const scanlines = createHolographicScanlines(100, {
  color: new THREE.Color(0x00ffff),
  lineCount: 50,
  lineSpeed: 2.0
})

// 全息粒子系统
const particles = createHolographicParticles(5000, {
  size: 2,
  color: 0x00ffff,
  radius: 50
})

// 全息网格
const grid = createHolographicGrid(100, 10, {
  color: new THREE.Color(0x00ffff),
  gridSpacing: 10
})

// 全息光束
const beam = createHolographicBeam(100, {
  color: new THREE.Color(0x00ffff),
  beamWidth: 0.5,
  beamIntensity: 1.0
})

// 全息数据流
const dataStream = createHolographicDataStream(2000, {
  color: 0x00ff00
})

// 全息环形阵列
const ringArray = createHolographicRingArray(12, 30, {
  color: new THREE.Color(0x00ffff)
})

// 全息螺旋
const spiral = createHolographicSpiral(8, 200, 40, {
  color: 0xff00ff
})

// 全息球体阵列
const sphereArray = createHolographicSphereArray(4, 4, 4, 15, {
  color: new THREE.Color(0x00ffff)
})
```

#### 工具函数
```javascript
// 更新所有全息对象
updateHolographicObjects(scene, time)

// 设置全局故障强度
setHolographicGlitchIntensity(scene, 0.5)

// 设置全局颜色
setHolographicColor(scene, 0x00ffff)
```

### 3. 全息动画集 (`holographic-animations.js`)

包含 5 个完整的全息动画特效：

#### 1. 全息数据流 (`animateHolographicDataStream`)
- 绿色垂直流动的数据流
- 扫描线效果
- 地面网格
- 故障效果动画

#### 2. 全息环形阵列 (`animateHolographicRingArray`)
- 12 个环形组成的阵列
- 中心脉动球体
- 环绕粒子系统
- 颜色变化动画

#### 3. 全息螺旋 (`animateHolographicSpiral`)
- 1600 个粒子组成的螺旋
- 6 个旋转光束
- 相机绕行动画
- 动态光束运动

#### 4. 全息球体阵列 (`animateHolographicSphereArray`)
- 4×4×4 球体阵列
- 波浪缩放效果
- 颜色循环变换
- 扫描线背景

#### 5. 全息故障艺术 (`animateHolographicGlitch`)
- 多个几何体组合
- 随机故障效果
- 对象交换动画
- 粒子环绕

## 🎨 使用示例

### 基础使用

```vue
<template>
  <div ref="container" class="holographic-container" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import {
  createHolographicCube,
  createHolographicScanlines,
  updateHolographicObjects
} from '~/pages/home/components/animation/animations/holographic/holographic-factory.js'

const container = ref(null)
let scene, camera, renderer
let animationId
let holographicTime = 0

onMounted(() => {
  // 初始化场景
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 50

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // 创建全息对象
  const cube = createHolographicCube(10, {
    color: new THREE.Color(0x00ffff),
    glowIntensity: 1.5
  })
  scene.add(cube)

  const scanlines = createHolographicScanlines(100, {
    color: new THREE.Color(0x00ffff)
  })
  scene.add(scanlines)

  // 启动动画循环
  animate()
})

function animate() {
  animationId = requestAnimationFrame(animate)

  holographicTime += 0.016

  // 更新全息材质
  updateHolographicObjects(scene, holographicTime)

  // 旋转立方体
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  // 清理资源...
})
</script>

<style scoped>
.holographic-container {
  width: 100%;
  height: 100vh;
  background: #000;
}
</style>
```

### 使用完整动画

```vue
<script setup>
import { onMounted } from 'vue'
import { createAnimationControllerEnhanced } from '~/utils/AnimationControllerEnhanced.js'
import { animateHolographicDataStream } from '~/pages/home/components/animation/animations/holographic/holographic-animations.js'

const container = ref(null)

onMounted(async () => {
  // 初始化动画控制器
  const animationController = createAnimationControllerEnhanced()
  await animationController.init(container.value, true, true)

  // 播放全息数据流动画
  animateHolographicDataStream(
    animationController.scene,
    animationController.camera,
    animationController.renderer,
    animationController.controls
  )
})
</script>
```

### 使用演示组件

```vue
<template>
  <HolographicEffectsDemo />
</template>

<script setup>
import HolographicEffectsDemo from '~/components/HolographicEffectsDemo.vue'
</script>
```

## 🎯 自定义全息材质

### 创建自定义全息材质

```javascript
import * as THREE from 'three'

export class CustomHolographicMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: options.color || new THREE.Color(0x00ffff) },
        uCustomParam: { value: options.customParam || 1.0 }
      },

      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uCustomParam;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // 自定义效果
          vec3 color = uColor;
          float alpha = 0.5;

          gl_FragColor = vec4(color, alpha);
        }
      `,

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  update(time) {
    this.uniforms.uTime.value = time
  }
}
```

## 📊 性能优化

### 1. 使用高性能粒子系统

```javascript
// 对于大量粒子（>10000），使用 InstancedMesh
import { InstancedParticleSystem } from '~/utils/InstancedParticleSystem.js'

const particles = new InstancedParticleSystem(scene, {
  count: 100000
})
```

### 2. 控制对象数量

| 特效 | 推荐对象数 | 性能 |
|------|-----------|------|
| 全息数据流 | 4000 | 60 FPS |
| 全息环形阵列 | 3000 | 60 FPS |
| 全息螺旋 | 2000 | 60 FPS |
| 全息球体阵列 | 64 | 60 FPS |
| 全息故障 | 2000 | 60 FPS |

### 3. 优化 Shader 复杂度

```javascript
// 降低故障强度提升性能
material.setGlitch(0.1)  // 代替 0.5

// 降低发光强度
material.uniforms.uGlowIntensity.value = 0.5  // 代替 1.5
```

### 4. 启用后处理

```javascript
// Bloom 后处理增强全息发光效果
await animationController.init(container.value, true, true)
animationController.setBloom({
  strength: 1.5,
  radius: 0.4,
  threshold: 0.85
})
```

## 🎨 视觉风格配置

### 颜色方案

```javascript
// 赛博朋克风格
{
  color: new THREE.Color(0xff00ff),
  glowIntensity: 2.0
}

// 科幻未来风格
{
  color: new THREE.Color(0x00ffff),
  glowIntensity: 1.5
}

// 黑客帝国风格
{
  color: new THREE.Color(0x00ff00),
  scanlineIntensity: 0.5
}

// 警告风格
{
  color: new THREE.Color(0xffff00),
  glitchIntensity: 0.5
}
```

### 效果组合

```javascript
// 数据中心效果
const grid = createHolographicGrid(200, 20)
const scanlines = createHolographicScanlines(200, {
  color: new THREE.Color(0x00ff00),
  lineCount: 80
})
const dataStream = createHolographicDataStream(3000)

// 战术界面效果
const ringArray = createHolographicRingArray(16, 40)
const beams = Array.from({ length: 8 }, () => createHolographicBeam(120))
const particles = createHolographicParticles(5000)
```

## 🚀 快速开始

### 1. 查看演示
使用 `HolographicEffectsDemo.vue` 组件查看所有效果

### 2. 创建自定义特效
1. 选择合适的全息材质
2. 使用工厂函数创建对象
3. 实现动画逻辑
4. 调整视觉参数

### 3. 优化性能
- 控制对象数量
- 优化 Shader 复杂度
- 使用 InstancedMesh 处理大量粒子

## 📖 相关文档

- `holographic-core.js` - 全息材质实现
- `holographic-factory.js` - 全息对象工厂
- `holographic-animations.js` - 完整动画集
- `HolographicEffectsDemo.vue` - 交互式演示
- `AnimationControllerEnhanced.js` - 动画控制器
- `EFFECTS_OPTIMIZATION_GUIDE.md` - 性能优化指南

## 💡 创意灵感

1. **数据可视化** - 使用数据流 + 网格展示实时数据
2. **战术界面** - 使用环形阵列 + 光束创建 HUD 效果
3. **AI 意识** - 使用螺旋 + 粒子表现 AI 思维
4. **时间旅行** - 使用故障效果表现时空扭曲
5. **虚拟现实** - 使用球体阵列创建虚拟空间

## 🎯 技术特点

✅ **自定义 Shader** - 完全控制视觉效果
✅ **高性能** - 优化过的渲染管线
✅ **易于使用** - 简洁的工厂 API
✅ **完整动画** - 5 个即用动画
✅ **交互演示** - 可视化控制面板
✅ **模块化设计** - 灵活组合组件

开始创造你的全息世界吧！🔮
