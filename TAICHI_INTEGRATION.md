# Taichi.js 与 Nuxt.js 集成文档

## 概述

本项目中集成了 Taichi.js 高性能计算框架，用于加速粒子物理模拟和复杂特效计算。

## 架构说明

### 1. 插件系统

- **插件位置**: `plugins/taichi.client.js`
- **初始化时机**: Nuxt应用挂载后自动初始化
- **运行模式**: 自动检测WebGPU支持，不支持时降级到CPU模式

### 2. 全局访问

在Vue组件中可以通过以下方式访问：

```vue
<script setup>
const { $taichi, $taichiUtils } = useNuxtApp()

// 检查是否就绪
if ($taichiUtils.isReady()) {
  console.log('使用GPU模式:', $taichiUtils.isGPU())
  
  // 获取Taichi实例
  const ti = $taichiUtils.getDevice()
}
</script>
```

### 3. 粒子系统

创建高性能粒子系统：

```javascript
const particleSystem = $taichiUtils.createParticleSystem({
  particleCount: 20000,
  timeStep: 0.016
})

// 更新粒子
particleSystem.update(0.016, performance.now() / 1000)

// 获取粒子数据（用于Three.js渲染）
const positions = particleSystem.positions.toJS()
```

## 使用场景

### 1. 太极特效

- **阴阳性粒子**: 使用双螺旋场模拟阴阳运动
- **物理模拟**: 粒子碰撞、融合、分离
- **能量场**: 多层光环的场耦合

### 2. 其他特效

所有需要大量粒子计算的特效都可以使用Taichi.js加速：

- 维度共鸣交响曲
- 虚空创世交响曲
- 量子纠缠交响曲
- 宇宙史诗交响曲
- 时间之沙

## 性能优势

1. **GPU加速**: WebGPU模式下，粒子计算速度提升10-100倍
2. **并行计算**: 大量粒子同时计算，充分利用GPU并行能力
3. **CPU降级**: 不支持WebGPU的环境自动降级，保证兼容性

## 注意事项

1. **客户端专用**: Taichi.js仅运行在客户端，插件名为`taichi.client.js`
2. **异步初始化**: 需要等待Taichi.js初始化完成后才能使用
3. **内存管理**: 大量粒子时注意内存使用，及时清理
4. **浏览器兼容**: 需要支持WebGPU的现代浏览器

## API 参考

### $taichiUtils

- `isReady()`: 返回Taichi.js是否初始化完成
- `isGPU()`: 返回是否使用GPU模式
- `getDevice()`: 获取Taichi.js实例
- `createParticleSystem(config)`: 创建粒子系统
- `createField(config)`: 创建场对象

## 扩展开发

如需添加自定义Taichi内核，可以在插件中定义：

```javascript
const customKernel = ti.kernel(({ field, time }) => {
  // 自定义计算逻辑
})
```

参考Taichi.js官方文档: https://docs.taichi-lang.org/
