# GSAP ScrollTrigger 快速参考指南

## 🚀 核心配置模板

### 基础滚动触发动画
```javascript
gsap.to('.element', {
  x: 100,
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',      // 元素顶部到达视口80%位置时触发
    end: 'bottom 20%',     // 元素底部到达视口20%位置时结束
    scrub: 1,              // 1秒延迟平滑scrub
    toggleActions: 'play none none reverse'  // 进:play 出:none 回:play 回出:reverse
  }
})
```

### Pin元素
```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top top',
  pin: true,
  pinSpacing: true,       // 自动添加间距
  anticipatePin: 1        // 防止快速滚动时闪烁
})
```

### Snap吸附
```javascript
scrollTrigger: {
  snap: {
    snapTo: 1 / sections.length,  // 吸附到每个section
    duration: 0.5,                // 吸附动画时长
    delay: 0.2,                   // 滚动停止后延迟开始
    ease: 'power2.out',
    inertia: false
  }
}
```

### Timeline + ScrollTrigger
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.container',
    pin: true,
    start: 'top top',
    end: '+=1000',        // 滚动1000px后结束
    scrub: 1
  }
})

tl.from('.step1', { opacity: 0, y: 50 })
  .from('.step2', { opacity: 0, y: 50 })
  .from('.step3', { opacity: 0, y: 50 })
```

---

## 📝 关键属性速查表

| 属性 | 值类型 | 默认值 | 说明 |
|------|--------|--------|------|
| `trigger` | Selector/Element | - | 触发元素 |
| `start` | String | 'top bottom' | 开始位置: '触发元素位置 视口位置' |
| `end` | String/Number/Function | 'bottom top' | 结束位置 |
| `scrub` | Boolean/Number | false | true=直接链接, 1=1秒延迟 |
| `pin` | Boolean/Selector | false | 固定元素 |
| `pinSpacing` | Boolean/String | true | 是否自动添加间距 |
| `anticipatePin` | Number | 0 | 提前pin防止闪烁 |
| `snap` | Number/Array/Object | - | 吸附配置 |
| `toggleActions` | String | 'play none none none' | 四个动作: onEnter onLeave onEnterBack onLeaveBack |
| `markers` | Boolean/Object | false | 调试标记(生产环境必须false) |
| `once` | Boolean | false | 只触发一次 |
| `preventOverlaps` | Boolean/String | false | 防止动画重叠 |

---

## 🔧 常用方法

### 创建ScrollTrigger
```javascript
const st = ScrollTrigger.create({
  trigger: '.element',
  start: 'top center'
})

// 或嵌入动画中
gsap.to('.element', {
  x: 100,
  scrollTrigger: { trigger: '.element' }
})
```

### 清理ScrollTrigger
```javascript
// 清理单个
st.kill()

// 清理所有
ScrollTrigger.getAll().forEach(st => st.kill())

// 或
ScrollTrigger.killAll()
```

### 刷新ScrollTrigger
```javascript
// 刷新所有
ScrollTrigger.refresh()

// 刷新单个
st.refresh()
```

### 获取滚动信息
```javascript
// 当前滚动速度(px/s)
const velocity = st.getVelocity()

// 当前进度(0-1)
const progress = st.progress

// 滚动方向(1=前进, -1=后退)
const direction = st.direction

// 是否激活
const isActive = st.isActive
```

---

## ⚡ 性能优化技巧

### 1. 使用markers调试后关闭
```javascript
// 开发环境
markers: true

// 生产环境(必须!)
markers: false
```

### 2. 使用preventOverlaps
```javascript
ScrollTrigger.create({
  trigger: '.section1',
  preventOverlaps: 'group1'  // 相同组名不会重叠
})
```

### 3. 使用batch批量处理
```javascript
ScrollTrigger.batch('.card', {
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0 }),
  start: 'top 80%',
  interval: 0.1  // 100ms内的元素批量处理
})
```

### 4. 使用once一次性动画
```javascript
ScrollTrigger.create({
  trigger: '.intro',
  once: true,  // 只触发一次
  toggleActions: 'play none none none'
})
```

### 5. 使用invalidateOnRefresh
```javascript
scrollTrigger: {
  trigger: '.element',
  start: 'top 80%',
  invalidateOnRefresh: true  // 窗口resize时重新计算
}
```

---

## 🎯 常见问题解决

### 问题1: 动画在生产环境失效
**原因**: 忘记注册插件，被tree-shaking删除
**解决**:
```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

### 问题2: Pin时元素闪烁
**原因**: 快速滚动时渲染延迟
**解决**:
```javascript
pin: true,
anticipatePin: 1
```

### 问题3: Snap不工作
**原因**: snap需要配合scrub使用
**解决**:
```javascript
scrub: 1,
snap: { snapTo: 0.1 }
```

### 问题4: 窗口resize后位置错误
**原因**: 动态计算的值没有更新
**解决**:
```javascript
end: () => '+=' + window.innerWidth,
invalidateOnRefresh: true
```

### 问题5: 动画重叠
**原因**: 多个ScrollTrigger同时触发
**解决**:
```javascript
preventOverlaps: 'group1'  // 相同组名
```

### 问题6: 内存泄漏
**原因**: 没有清理ScrollTrigger
**解决**:
```javascript
onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(st => st.kill())
})
```

---

## 📊 监控和调试

### 调试模式
```javascript
// 显示所有标记
ScrollTrigger.defaults({ markers: true })

// 为特定ScrollTrigger添加标记
ScrollTrigger.create({
  trigger: '.element',
  markers: { startColor: 'green', endColor: 'red' }
})
```

### 监控滚动事件
```javascript
ScrollTrigger.addEventListener('refresh', () => {
  console.log('ScrollTrigger已刷新')
})

ScrollTrigger.addEventListener('scrollStart', () => {
  console.log('开始滚动')
})

ScrollTrigger.addEventListener('scrollEnd', () => {
  console.log('停止滚动')
})
```

### 性能监控
```javascript
let lastTime = performance.now()

const monitorVelocity = () => {
  const now = performance.now()
  const delta = now - lastTime
  const fps = 1000 / delta

  if (fps > 120) {
    console.log('快速滚动:', fps.toFixed(0))
  }

  lastTime = now
  requestAnimationFrame(monitorVelocity)
}

monitorVelocity()
```

---

## 🎨 高级技巧

### 1. 动态计算start/end
```javascript
start: (self) => self.previous().end + 100,
end: () => '+=' + (window.innerHeight * 0.8)
```

### 2. 响应式设计
```javascript
const setupAnimations = () => {
  const isMobile = window.innerWidth < 768

  gsap.to('.element', {
    scrollTrigger: {
      trigger: '.element',
      start: isMobile ? 'top 90%' : 'top 70%'
    },
    x: isMobile ? 100 : 500
  })
}

window.addEventListener('resize', () => {
  ScrollTrigger.getAll().forEach(st => st.kill())
  setupAnimations()
})
setupAnimations()
```

### 3. 链接多个动画
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.container',
    pin: true,
    scrub: 1
  }
})

tl.addLabel('step1')
  .from('.part1', { x: -100 })
  .addLabel('step2')
  .from('.part2', { x: 100 })
  .addLabel('step3')
  .to('.part3', { rotation: 360 })

// Snap到label
snap: {
  snapTo: 'labels',
  duration: 0.5
}
```

### 4. 垂直+水平滚动混合
```javascript
// 主垂直滚动
gsap.to('.vertical-section', {
  scrollTrigger: {
    trigger: '.vertical-section',
    start: 'top top',
    pin: true
  }
})

// 内部水平滚动
gsap.to('.horizontal-container', {
  xPercent: -100,
  scrollTrigger: {
    trigger: '.horizontal-container',
    containerAnimation: verticalTl,  // 链接到垂直动画
    pin: true,
    scrub: 1
  }
})
```

---

## 🔐 生产环境检查清单

- [ ] 所有markers设置为false
- [ ] 所有插件正确注册
- [ ] 添加onBeforeUnmount清理逻辑
- [ ] 错误处理完善(try-catch)
- [ ] 性能测试通过(60fps)
- [ ] 窗口resize测试通过
- [ ] 移动端测试通过
- [ ] 低端设备测试通过

---

## 📚 相关资源

- 官方文档: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- 官方示例: https://greensock.com/scrolltrigger-demos/
- 常见错误: https://greensock.com/st-common-mistakes/
- 论坛: https://greensock.com/forums/
