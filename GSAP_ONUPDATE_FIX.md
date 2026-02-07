# GSAP onUpdate 回调错误修复

## 🔴 错误信息

```
Uncaught TypeError: Cannot read properties of undefined (reading 'value')
    at Tween2.onUpdate [as _onUpdate] (cyber-space-rift.js:542:26)
```

---

## 🔍 根本原因

**GSAP 的 `onUpdate` 回调参数不是目标对象**

### ❌ 错误用法

```javascript
gsap.to({ value: 0 }, {
  value: 3,
  duration: 3,
  onUpdate: (target) => {
    speed = target.value  // ❌ target 是 undefined
  }
})
```

### ✅ 正确用法

```javascript
const speedObj = { value: 0 }
gsap.to(speedObj, {
  value: 3,
  duration: 3,
  onUpdate: () => {
    speed = speedObj.value  // ✅ 使用外部引用
  }
})
```

---

## 📝 修复位置

在 `cyber-space-rift.js` 中修复了 3 处错误：

### 1. Space Rift Core - pulse() 方法 (第 440 行)

```javascript
// ❌ 修复前
gsap.to({ value: 0 }, {
  value: 0.3,
  duration: 2,
  repeat: -1,
  yoyo: true,
  onUpdate: (target) => {
    pulseIntensity = target.value
  }
})

// ✅ 修复后
const pulseObj = { value: 0 }
gsap.to(pulseObj, {
  value: 0.3,
  duration: 2,
  repeat: -1,
  yoyo: true,
  onUpdate: () => {
    pulseIntensity = pulseObj.value
  }
})
```

### 2. Quantum Tunnel - ignite() 方法 (第 541 行)

```javascript
// ❌ 修复前
gsap.to({ value: 0 }, {
  value: 3,
  duration: 3,
  onUpdate: (target) => {
    speed = target.value
  }
})

// ✅ 修复后
const speedObj = { value: 0 }
gsap.to(speedObj, {
  value: 3,
  duration: 3,
  onUpdate: () => {
    speed = speedObj.value
  }
})
```

### 3. Digital Rain - accelerate() 方法 (第 719 行)

```javascript
// ❌ 修复前
gsap.to({ value: 1 }, {
  value: 3,
  duration: 2,
  onUpdate: (target) => {
    acceleration = target.value
  }
})

// ✅ 修复后
const accObj = { value: 1 }
gsap.to(accObj, {
  value: 3,
  duration: 2,
  onUpdate: () => {
    acceleration = accObj.value
  }
})
```

---

## 🎯 修复效果

- ✅ 不再出现 `Cannot read properties of undefined` 错误
- ✅ 动画参数正常更新
- ✅ 赛博时空裂缝动画正常运行

---

## 📚 技术说明

### GSAP onUpdate 回调参数

GSAP 的 `onUpdate` 回调函数参数：
- **第一个参数**：不是目标对象
- **正确做法**：使用闭包捕获外部引用的对象

```javascript
// ❌ 错误：期望 target 是动画对象
onUpdate: (target) => {
  console.log(target.value)  // undefined!
}

// ✅ 正确：使用闭包
const obj = { value: 0 }
gsap.to(obj, { value: 100, onUpdate: () => {
  console.log(obj.value)  // 正常工作
}})
```

---

## 🔬 测试验证

1. 选择"赛博时空裂缝"动画
2. 观察控制台
3. ✅ 不再出现 `Cannot read properties of undefined` 错误
4. ✅ 动画正常运行

---

## 📝 相关文档

- `WEBGL_CONTEXT_LOST_FIX.md` - WebGL Context Lost 修复
- `CONTEXT_LOST_QUICK_FIX.md` - 快速修复总结
