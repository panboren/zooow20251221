# Taichi.js Kernel 语法修复说明

## 问题

```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'kind')
    at ir.visitForOfStatement (taichi__js.js:79662:23)
```

## 根本原因

Taichi.js的kernel函数需要特定的语法，不能使用普通的JavaScript循环和函数。

### 错误的用法 ❌

```javascript
// 错误：使用参数
const updateKernel = taichi.kernel((positions, velocities, dt) => {
  // 错误：使用普通的for循环
  for (let i = 0; i < particleCount; i++) {
    positions[i] += velocities[i] * dt
  }
})

// 错误：使用Math.sin等JavaScript函数
colors[i] = 0.5 + 0.5 * Math.sin(time)
```

### 正确的用法 ✅

```javascript
// 正确：使用ti.addToKernelScope()
ti.addToKernelScope({
  positions,
  velocities,
  colors,
  N
})

// 正确：kernel无参数
const updateKernel = ti.kernel(() => {
  // 正确：使用ti.range()
  for (let i of ti.range(N)) {
    positions[i][0] += velocities[i][0] * dt
  }
})

// 正确：使用Taichi内置函数
colors[i][0] = 0.5 + 0.5 * ti.sin(ti.random() * 6.28)
```

## Taichi.js Kernel 语法要点

### 1. 使用 `ti.addToKernelScope()`

```javascript
// 将变量添加到kernel作用域
ti.addToKernelScope({
  positions,
  velocities,
  colors,
  N,  // 常量
  dt,  // 参数
  time // 参数
})
```

### 2. Kernel函数无参数

```javascript
// ❌ 错误
const kernel = ti.kernel((pos, vel) => { ... })

// ✅ 正确
const kernel = ti.kernel(() => { ... })
// 通过addToKernelScope访问变量
```

### 3. 使用 `ti.range()` 进行循环

```javascript
// ❌ 错误
for (let i = 0; i < N; i++) { ... }

// ✅ 正确
for (let i of ti.range(N)) { ... }
```

### 4. 向量场访问语法

```javascript
// 创建向量场
const positions = ti.Vector.field(3, ti.f32, [N])

// 访问向量元素
positions[i][0]  // x分量
positions[i][1]  // y分量
positions[i][2]  // z分量

// 或使用向量操作
positions[i] = [x, y, z]
```

### 5. 使用Taichi内置数学函数

```javascript
// ❌ 错误（JavaScript函数）
ti.sin()    // ❌
Math.sin()   // ❌

// ✅ 正确（Taichi函数）
ti.sin()    // ✅
ti.cos()    // ✅
ti.sqrt()   // ✅
ti.pow()    // ✅
ti.random() // ✅
ti.dot()    // ✅（点积）
```

## 完整示例

### 创建粒子系统

```javascript
function createParticleSystem(config = {}) {
  const { particleCount = 10000 } = config
  const N = particleCount

  // 1. 创建场
  const positions = ti.Vector.field(3, ti.f32, [N])
  const velocities = ti.Vector.field(3, ti.f32, [N])
  const colors = ti.Vector.field(3, ti.f32, [N])

  // 2. 添加到kernel作用域
  ti.addToKernelScope({
    positions,
    velocities,
    colors,
    N
  })

  // 3. 定义初始化kernel
  const initKernel = ti.kernel(() => {
    for (let i of ti.range(N)) {
      // 使用Ti随机数
      positions[i] = [
        (ti.random() - 0.5) * 200,
        (ti.random() - 0.5) * 200,
        (ti.random() - 0.5) * 200
      ]
      
      velocities[i] = [
        (ti.random() - 0.5) * 10,
        (ti.random() - 0.5) * 10,
        (ti.random() - 0.5) * 10
      ]
    }
  })

  // 4. 定义更新kernel
  const updateKernel = ti.kernel(() => {
    for (let i of ti.range(N)) {
      // 粒子运动
      positions[i][0] += velocities[i][0] * 0.016
      positions[i][1] += velocities[i][1] * 0.016
      positions[i][2] += velocities[i][2] * 0.016

      // 边界反弹
      for (let j = 0; j < 3; j++) {
        if (positions[i][j] > 100) {
          positions[i][j] = 100
          velocities[i][j] *= -0.9
        } else if (positions[i][j] < -100) {
          positions[i][j] = -100
          velocities[i][j] *= -0.9
        }
      }

      // 颜色脉动
      colors[i][0] = 0.5 + 0.5 * ti.sin(ti.random() * 6.28)
      colors[i][1] = 0.5 + 0.5 * ti.cos(ti.random() * 6.28)
      colors[i][2] = 0.5 + 0.5 * ti.sin(ti.random() * 6.28 + 1.57)
    }
  })

  // 5. 初始化
  initKernel()

  // 6. 返回对象
  return {
    positions,
    velocities,
    colors,
    update: async () => {
      updateKernel()
      await ti.sync()
    },
    getPositions: () => positions.toArray(),
    // ...
  }
}
```

## 常见错误和修复

### 错误1: `undefined is not an object`

**原因**: 使用了JavaScript循环语法

**修复**: 改用 `ti.range()`

```javascript
// ❌
for (let i = 0; i < N; i++)

// ✅
for (let i of ti.range(N))
```

### 错误2: `reading 'kind' of undefined`

**原因**: 使用了参数的kernel函数

**修复**: 使用无参数kernel + addToKernelScope

```javascript
// ❌
const kernel = ti.kernel((pos) => { ... })

// ✅
ti.addToKernelScope({ pos })
const kernel = ti.kernel(() => { ... })
```

### 错误3: 函数未定义

**原因**: 使用了JavaScript数学函数

**修复**: 使用Taichi内置函数

```javascript
// ❌
Math.sin(x)

// ✅
ti.sin(x)
```

## Taichi.js内置函数参考

### 数学函数
- `ti.sin(x)` - 正弦
- `ti.cos(x)` - 余弦
- `ti.tan(x)` - 正切
- `ti.sqrt(x)` - 平方根
- `ti.pow(x, y)` - 幂运算
- `ti.abs(x)` - 绝对值
- `ti.min(a, b)` - 最小值
- `ti.max(a, b)` - 最大值
- `ti.random()` - 随机数 [0, 1)

### 向量操作
- `ti.dot(a, b)` - 点积
- `ti.cross(a, b)` - 叉积
- `ti.length(v)` - 向量长度

### 类型
- `ti.i32` - 32位整数
- `ti.f32` - 32位浮点数

### 场创建
- `ti.field(type, shape)` - 标量场
- `ti.Vector.field(n, type, shape)` - 向量场
- `ti.Matrix.field(m, n, type, shape)` - 矩阵场

## 性能优化建议

1. **减少kernel调用**: 合并多个操作到一个kernel
2. **使用range**: `ti.range(N)` 比for循环更高效
3. **避免主机-设备数据传输**: 尽量在GPU上完成所有计算
4. **使用向量化**: 向量场比多个标量场更快

## 总结

✅ **正确流程**:
1. 使用 `ti.Vector.field()` 创建场
2. 使用 `ti.addToKernelScope()` 添加变量
3. 使用 `ti.kernel(() => {})` 定义kernel（无参数）
4. 使用 `ti.range()` 进行循环
5. 使用Taichi内置函数（`ti.sin`, `ti.cos`等）

现在Taichi.js应该可以正常工作了！
