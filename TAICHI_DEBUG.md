# Taichi.js 调试指南

## 修复说明

### 问题
```
⚠️ Taichi.js未就绪，使用JavaScript模拟
```

### 根本原因
插件初始化是异步的（在 `app:mounted` 钩子中），但特效可能在插件初始化完成之前就被调用。

### 解决方案

#### 1. **同步提供工具对象**
在插件创建时立即提供 `taichiUtils`，即使Taichi.js还未初始化：

```javascript
// plugins/taichi.client.js
const taichiUtils = {
  isReady: () => isInitialized,
  isGPU: () => isGPU,
  getModule: () => taichiModule,
  createParticleSystem,
  createField,
  init: initTaichi  // 添加init方法
}

// 立即提供（同步）
nuxtApp.provide('taichiUtils', taichiUtils)
window.__TAICHI_UTILS__ = taichiUtils
```

#### 2. **特效中等待初始化**
如果Taichi.js未就绪，尝试手动初始化并等待：

```javascript
// main.js
if (useTaichiUtils && useTaichiUtils.isReady()) {
  // 已就绪，直接使用
  useTaichi = true
} else if (useTaichiUtils && useTaichiUtils.init) {
  // 未就绪，尝试初始化
  await useTaichiUtils.init()
  await new Promise(resolve => setTimeout(resolve, 500)) // 等待完成
  
  if (useTaichiUtils.isReady()) {
    useTaichi = true
  } else {
    useTaichi = false  // 降级到JavaScript
  }
}
```

## 预期日志

### 1. 应用启动时
```
🚀 初始化 Taichi.js 插件...
✅ TaichiUtils 已附加到全局 window.__TAICHI_UTILS__
```

### 2. app:mounted 钩子触发
```
🎬 app:mounted 钩子触发，开始初始化 Taichi.js
⏳ 正在加载 Taichi.js 模块...
✅ Taichi.js 模块加载成功
⏳ 正在初始化 Taichi.js...
✅ Taichi.js 初始化完成
✅ Taichi.js WebGPU 模式初始化成功
```

### 3. 启动太极特效时
```
🎬 启动太极-Taichi.js 特效
✅ 使用Taichi.js加速 (GPU: Yes )
```

## 调试步骤

### 1. 检查全局对象
在浏览器控制台输入：
```javascript
console.log(window.__TAICHI_UTILS__)
```

**预期输出：**
```javascript
{
  isReady: ƒ isReady(),
  isGPU: ƒ isGPU(),
  getModule: ƒ getModule(),
  createParticleSystem: ƒ createParticleSystem(),
  createField: ƒ createField(),
  init: ƒ initTaichi()
}
```

### 2. 检查初始化状态
```javascript
console.log('Taichi是否就绪:', window.__TAICHI_UTILS__?.isReady())
console.log('使用GPU:', window.__TAICHI_UTILS__?.isGPU())
```

### 3. 手动初始化
```javascript
await window.__TAICHI_UTILS__?.init()
```

### 4. 测试粒子系统
```javascript
const particles = window.__TAICHI_UTILS__?.createParticleSystem({
  particleCount: 1000
})
await particles.update(0.016, 0)
console.log('粒子位置:', particles.getPositions())
```

## 常见问题

### Q1: 还是显示"Taichi.js未就绪"？

**检查步骤：**
1. 控制台是否有 "✅ TaichiUtils 已附加到全局"？
2. 控制台是否有 "✅ Taichi.js 模块加载成功"？
3. 控制台是否有 "✅ Taichi.js 初始化完成"？
4. 是否有错误信息？

**如果没有错误，说明初始化还未完成。等待几秒后再试。**

### Q2: 初始化失败？

**可能原因：**
1. **浏览器不支持WebGPU**: 这是正常的，会降级到CPU
2. **网络问题**: taichi.js模块加载失败
3. **内存不足**: 浏览器内存限制

**查看错误信息：**
```javascript
// 控制台查找
❌ Taichi.js 初始化失败: [错误详情]
```

### Q3: 如何强制使用JavaScript模拟？

如果你想要完全禁用Taichi.js，可以在插件开头返回：

```javascript
// plugins/taichi.client.js
export default defineNuxtPlugin((nuxtApp) => {
  // 直接返回不初始化
  const taichiUtils = {
    isReady: () => false,
    isGPU: () => false,
    // ... 其他方法
  }
  
  nuxtApp.provide('taichiUtils', taichiUtils)
  window.__TAICHI_UTILS__ = taichiUtils
})
```

## 性能测试

使用浏览器开发者工具的Performance面板：

1. 打开Performance面板
2. 点击Record
3. 启动太极特效
4. 运行几秒后停止
5. 查看FPS和帧时间

**目标：**
- Taichi.js GPU: 60 FPS, ~16ms/frame
- Taichi.js CPU: 45+ FPS, ~22ms/frame
- JavaScript: 30 FPS, ~33ms/frame

## 测试文件

使用 `TAICHI_TEST.vue` 进行完整测试：

```vue
<template>
  <div>
    <h2>Taichi.js 测试</h2>
    <p>状态: {{ taichiReady ? '就绪' : '未就绪' }}</p>
    <p>GPU: {{ useGPU ? '是' : '否' }}</p>
    <button @click="runTest">运行测试</button>
  </div>
</template>

<script setup>
import { useTaichi } from '~/composables/useTaichi'
const taichiUtils = useTaichi()
const taichiReady = taichiUtils.isReady()
const useGPU = taichiUtils.isGPU()

async function runTest() {
  const particles = taichiUtils.createParticleSystem({
    particleCount: 10000
  })
  // ...
}
</script>
```

## 总结

现在Taichi.js的初始化流程：

1. ✅ 插件创建时立即提供 `window.__TAICHI_UTILS__`（同步）
2. ✅ `app:mounted` 钩子触发后开始初始化（异步）
3. ✅ 特效启动时检查状态，未就绪则尝试手动初始化
4. ✅ 初始化超时或失败时降级到JavaScript模拟

这样可以确保：
- 全局对象始终可用
- 特效可以自动初始化Taichi.js
- 失败时优雅降级
- 不影响应用正常运行
