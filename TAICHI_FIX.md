# Taichi.js API 修复说明

## 问题诊断

### 原错误
```
⚠️ WebGPU 初始化失败，降级到 CPU 模式: Cannot read properties of undefined (reading 'gpu')
❌ Taichi.js 初始化失败: TypeError: Cannot read properties of undefined (reading 'cpu')
```

### 原因分析

1. **错误的API调用**: 尝试使用 `taichi.arch.gpu` 和 `taichi.arch.cpu`，这些属性不存在
2. **错误的初始化参数**: Taichi.js的 `init()` 函数不接受 `arch` 参数
3. **Nuxt实例访问问题**: 在特效文件中使用 `useNuxtApp?.()` 不可靠

## 解决方案

### 1. 修复插件初始化 (`plugins/taichi.client.js`)

#### 正确的Taichi.js API
```javascript
// ❌ 错误的方式
await taichi.init({
  arch: useGPU ? taichi.arch.gpu : taichi.arch.cpu
})

// ✅ 正确的方式
await taichi.init()
```

#### 关键修复点
- 移除了不存在的 `taichi.arch` 引用
- 直接调用 `await taichi.init()`，Taichi.js会自动检测GPU
- 添加GPU可用性检查 `checkGPUAvailable()`

### 2. 修复特效文件 (`main.js`)

#### 正确的Nuxt实例访问
```javascript
// ❌ 不可靠的方式
const { $taichiUtils } = useNuxtApp?.() || {}

// ✅ 可靠的方式
if (typeof window !== 'undefined' && window.$nuxt) {
  const nuxtApp = window.$nuxt
  const taichiUtils = nuxtApp.$taichiUtils
}
```

#### 异步更新处理
```javascript
// Taichi更新是异步的
const updateHandler = async () => {
  if (useTaichi && taichiParticleSystem) {
    await taichiParticleSystem.update(0.016, time)
  }
}
```

## 正确的Taichi.js API使用

### 1. 初始化
```javascript
import taichi from 'taichi.js'

// 直接初始化，不需要参数
await taichi.init()
```

### 2. 创建场
```javascript
// 创建标量场
const field = taichi.field(taichi.f32, [256, 256])

// 创建向量场
const positions = taichi.field(taichi.f32, [10000, 3])
```

### 3. 创建内核
```javascript
const kernel = taichi.kernel((positions, velocities, dt) => {
  for (let i = 0; i < positions.shape[0]; i++) {
    positions[i, 0] += velocities[i, 0] * dt
    positions[i, 1] += velocities[i, 1] * dt
  }
})
```

### 4. 执行和同步
```javascript
kernel(positions, velocities, 0.016)
await taichi.sync()
```

### 5. 获取数据
```javascript
const positionsArray = positions.toArray()
```

## 数据类型

### 支持的原始类型
```javascript
taichi.f32  // 32位浮点数
taichi.i32  // 32位整数
```

### 场的维度
```javascript
// 1D场
taichi.field(taichi.f32, 100)

// 2D场
taichi.field(taichi.f32, [100, 100])

// 3D场
taichi.field(taichi.f32, [100, 100, 100])
```

## 测试验证

### 预期的控制台输出
```
🚀 初始化 Taichi.js 插件...
✅ Taichi.js 模块加载成功
✅ Taichi.js WebGPU 模式初始化成功
```

或（不支持WebGPU时）
```
🚀 初始化 Taichi.js 插件...
✅ Taichi.js 模块加载成功
✅ Taichi.js 初始化成功（使用CPU后备）
```

### 特效启动时
```
🎬 启动太极-Taichi.js 特效
✅ 使用Taichi.js加速 (GPU: Yes )
```

## 注意事项

1. **WebGPU检测**: Taichi.js会自动检测WebGPU支持，不支持时会降级
2. **异步操作**: `update()` 和 `sync()` 都是异步的，需要await
3. **数据传输**: 场的 `toArray()` 操作会有性能开销，避免频繁调用
4. **客户端专用**: Taichi.js仅运行在客户端，使用 `typeof window !== 'undefined'` 检查

## 性能优化建议

1. **减少数据传输**: 尽量减少主机和GPU之间的数据传输
2. **批量操作**: 将多个操作合并到一个内核中
3. **使用异步**: `await taichi.sync()` 可以与其他操作并行

## 参考文档

- Taichi.js GitHub: https://github.com/AmesingFlank/taichi.js
- Taichi.js 官网: https://taichi-js.com
