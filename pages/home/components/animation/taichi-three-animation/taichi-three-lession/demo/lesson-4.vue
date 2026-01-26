<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第4课：Taichi.js 字段系统详解</h2>
          <span class="lesson-tag">入门</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>深入理解 Taichi.js 字段（Field）的概念和作用</li>
            <li>学习标量字段、向量字段、矩阵字段的使用</li>
            <li>理解字段的多维索引和访问方式</li>
            <li>掌握字段在 GPU 内存中的存储和访问</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 什么是字段（Field）？</h3>
          <p>
            <strong>字段</strong>
            是 Taichi.js 中的核心数据结构，存储在 GPU 显存中。 可以把它理解为"GPU
            上的数组"，但比普通数组更强大、更高效。
          </p>
          <div class="highlight-box">
            <strong>字段的特点：</strong>
            <ul>
              <li>
                📦
                <strong>GPU 显存存储</strong>
                ：数据直接存储在 GPU 上，避免频繁传输
              </li>
              <li>
                ⚡
                <strong>并行访问</strong>
                ：GPU 可以同时访问多个字段元素
              </li>
              <li>
                🎯
                <strong>类型安全</strong>
                ：每个字段有明确的类型定义
              </li>
              <li>
                📐
                <strong>多维支持</strong>
                ：支持 1D、2D、3D 甚至更高维度
              </li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h3>📖 字段类型</h3>
          <div class="field-types">
            <div class="type-card scalar">
              <h4>1. 标量字段</h4>
              <p>存储单个数值（整数或浮点数）</p>
              <pre><code>// 1D 标量字段：1000 个浮点数
let f = ti.field(ti.f32, 1000)

// 访问
f[0] = 42.0
let x = f[0]  // 42.0</code></pre>
            </div>

            <div class="type-card vector">
              <h4>2. 向量字段</h4>
              <p>存储向量（如 2D、3D 位置）</p>
              <pre><code>// 1D 向量字段：1000 个 3D 向量
let v = ti.Vector.field(3, ti.f32, 1000)

// 访问（类似数组）
v[0] = [1.0, 2.0, 3.0]
let pos = v[0]  // [1.0, 2.0, 3.0]

// 访问向量分量
v[0].x = 1.0
v[0].y = 2.0
v[0].z = 3.0</code></pre>
            </div>

            <div class="type-card matrix">
              <h4>3. 矩阵字段</h4>
              <p>存储矩阵（如变换矩阵）</p>
              <pre><code>// 1D 矩阵字段：1000 个 2x2 矩阵
let m = ti.Matrix.field(2, 2, ti.f32, 1000)

// 访问
m[0] = [[1.0, 0.0],
          [0.0, 1.0]]</code></pre>
            </div>

            <div class="type-card multidim">
              <h4>4. 多维字段</h4>
              <p>支持 2D、3D 等多维数组</p>
              <pre><code>// 2D 标量字段：100x100 网格
let grid = ti.field(ti.f32, [100, 100])

// 访问 2D 索引
grid[10, 20] = 5.0
let val = grid[10, 20]  // 5.0

// 2D 向量字段（每个格点一个 3D 向量）
let vectorGrid = ti.Vector.field(3, ti.f32, [100, 100])
vectorGrid[10, 20] = [1.0, 2.0, 3.0]</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💻 代码示例：粒子系统使用字段</h3>
          <div class="code-demo">
            <pre><code>// 定义粒子数量
const N = 10000

// 创建字段：位置、速度、颜色
let positions = ti.Vector.field(3, ti.f32, [N])
let velocities = ti.Vector.field(3, ti.f32, [N])
let colors = ti.Vector.field(3, ti.f32, [N])

// 添加到内核作用域
ti.addToKernelScope({ positions, velocities, colors, N })

// 初始化内核
let init = ti.kernel(() => {
  for (let i of ti.range(N)) {
    // 随机位置
    positions[i] = [ti.random() * 6 - 3, 
                   ti.random() * 6 - 3, 
                   ti.random() * 6 - 3]
    // 随机速度
    velocities[i] = [0, 0.01, 0]
    // 随机颜色（绿色系）
    colors[i] = [0.0, 1.0, ti.random() * 0.3 + 0.5]
  }
})

// 更新内核
let update = ti.kernel(() => {
  for (let i of ti.range(N)) {
    // 更新位置
    positions[i] += velocities[i]
    
    // 边界反弹
    if (positions[i].y < -3) {
      velocities[i].y *= -1
    }
  }
})

// 执行
await init()
// 然后在每一帧执行 update()</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                网格大小: {{ gridSize }}x{{ gridSize }}
                <input
                  v-model.number="gridSize"
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  @change="initGrid"
                />
              </label>
              <label>
                显示模式:
                <select v-model="displayMode">
                  <option value="density">密度</option>
                  <option value="x">X 分量</option>
                  <option value="y">Y 分量</option>
                  <option value="z">Z 分量</option>
                </select>
              </label>
              <button @click="animateGrid">{{ isAnimating ? '暂停' : '动画' }}</button>
            </div>
            <div ref="canvasContainer" class="demo-canvas-container"></div>
            <div class="demo-info">
              <p>
                状态:
                <span :class="statusClass">{{ status }}</span>
              </p>
              <p>网格点数: {{ gridSize * gridSize }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ Taichi.js 字段系统的核心概念</li>
            <li>✅ 如何创建和使用不同类型的字段</li>
            <li>✅ 字段在 GPU 计算中的重要作用</li>
          </ul>
          <p class="next-lesson">
            下一课将学习 GPU 计算与数据传输，了解如何高效地将数据从 GPU 传输到渲染层。
          </p>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第3课：第一个粒子系统</button>
        <button class="nav-btn next" @click="goToNext">第5课：GPU 计算与数据传输 →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const gridSize = ref(30)
const displayMode = ref('density')
const isAnimating = ref(true)
const status = ref('初始化中...')

const canvasContainer = ref<HTMLElement>()
const statusClass = computed(() => {
  if (status.value === '运行中') return 'running'
  if (status.value === '已暂停') return 'paused'
  if (status.value === '错误') return 'error'
  return 'idle'
})

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let gridMesh: THREE.Mesh

// Taichi.js 变量
let tiGrid: any = null
let tiTime: any = null
let tiUpdate: any = null
let size = 30
let time = 0

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 400

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 15
  camera.position.y = 5
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)
}

// 初始化 Taichi.js 字段网格
async function initTaichi() {
  try {
    await ti.init()

    // 使用局部变量避免闭包问题
    const newSize = gridSize.value
    size = newSize

    // 创建 2D 向量字段：每个网格点一个 3D 向量
    tiGrid = ti.Vector.field(3, ti.f32, [size, size])
    tiTime = ti.field(ti.f32, [1]) // 标量字段，用于存储时间

    ti.addToKernelScope({ tiGrid, tiTime, size })

    // 初始化内核：创建波动效果
    tiUpdate = ti.kernel(() => {
      tiTime[0] += 0.02
      let t = tiTime[0]

      for (let x of ti.range(size)) {
        for (let y of ti.range(size)) {
          // 使用正弦波创建动态效果
          let fx = (x / size) * 4.0
          let fy = (y / size) * 4.0
          tiGrid[[x, y]] = [
            ti.sin(fx + t) * 0.5 + 0.5,
            ti.sin(fy + t) * 0.5 + 0.5,
            ti.sin(fx + fy + t * 2) * 0.5 + 0.5
          ]
        }
      }
    })

    // 执行一次初始化
    await tiUpdate()
    status.value = '运行中'
  } catch (error) {
    console.error('Taichi.js 初始化失败:', error)
    status.value = 'Taichi.js 不可用'
    tiUpdate = null
  }
}

// 创建 Three.js 网格
function createGrid() {
  const geometry = new THREE.PlaneGeometry(10, 10, size - 1, size - 1)

  // 创建顶点颜色属性 - 顶点数量是 size * size
  const vertexCount = geometry.attributes.position.count
  const colors = new Float32Array(vertexCount * 3)
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    wireframe: true,
    side: THREE.DoubleSide
  })

  gridMesh = new THREE.Mesh(geometry, material)
  gridMesh.rotation.x = -Math.PI / 2
  scene.add(gridMesh)

  console.log(`创建网格: size=${size}, 顶点数=${vertexCount}, 期望=${size * size}`)
}

// 更新网格颜色
async function updateGrid() {
  if (!tiUpdate || !gridMesh) return

  try {
    await tiUpdate()

    // 从 GPU 读取数据 - gridData 是 2D 数组
    const gridData = await tiGrid.toArray()

    // 检查第一个元素，了解数据结构
    if (gridData.length > 0 && gridData[0]) {
      console.log('gridData[0][0]:', gridData[0][0])
      console.log('gridData[0] 长度:', gridData[0].length)
    }

    // 更新 Three.js 网格颜色
    const colors = gridMesh.geometry.attributes.color

    // 添加边界检查
    const dataRows = gridData.length
    const dataCols = dataRows > 0 ? gridData[0].length : 0

    console.log(`数据尺寸: ${dataRows}x${dataCols}, 期望: ${size}x${size}`)

    // 遍历所有网格点
    for (let x = 0; x < Math.min(size, dataRows); x++) {
      for (let y = 0; y < Math.min(size, dataCols); y++) {
        // Taichi.js 2D 字段: gridData[x][y]
        const vector = gridData[x][y]

        // 跳过无效数据
        if (!vector) {
          continue
        }

        // Three.js 顶点索引 (列优先: x + size * y)
        const vertexIndex = x + size * y

        // 安全访问 vector 的元素
        const vx = vector[0] !== undefined ? vector[0] : 0
        const vy = vector[1] !== undefined ? vector[1] : 0
        const vz = vector[2] !== undefined ? vector[2] : 0

        let r, g, b
        if (displayMode.value === 'density') {
          r = vx
          g = vy
          b = vz
        } else if (displayMode.value === 'x') {
          r = g = b = vx
        } else if (displayMode.value === 'y') {
          r = g = b = vy
        } else if (displayMode.value === 'z') {
          r = g = b = vz
        }

        colors.setXYZ(vertexIndex, r, g, b)
      }
    }

    colors.needsUpdate = true
  } catch (error) {
    console.error('更新失败:', error)
    status.value = '错误'
  }
}

// 动画循环
function animate() {
  if (isAnimating.value) {
    updateGrid()
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }

  requestAnimationFrame(animate)
}

// 重新初始化网格
async function initGrid() {
  size = gridSize.value

  if (gridMesh) {
    scene.remove(gridMesh)
    // 安全释放几何体
    if (gridMesh.geometry && typeof gridMesh.geometry.dispose === 'function') {
      gridMesh.geometry.dispose()
    }
    // 安全释放材质
    if (gridMesh.material && typeof gridMesh.material.dispose === 'function') {
      gridMesh.material.dispose()
    }
  }

  await initTaichi()
  createGrid()

  // 初始更新一次
  await updateGrid()
}

// 切换动画
function animateGrid() {
  isAnimating.value = !isAnimating.value
  status.value = isAnimating.value ? '运行中' : '已暂停'
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第5课即将推出！')
}

onMounted(async () => {
  initThreeJS()
  await initTaichi()
  createGrid()
  await updateGrid()
  animate()
})

onUnmounted(() => {
  if (gridMesh) {
    scene.remove(gridMesh)
    if (gridMesh.geometry && typeof gridMesh.geometry.dispose === 'function') {
      gridMesh.geometry.dispose()
    }
    if (gridMesh.material && typeof gridMesh.material.dispose === 'function') {
      gridMesh.material.dispose()
    }
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped lang="scss">
.lesson-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%);
  padding: 80px 30px 30px 30px;
  color: white;
}

.content-area {
  max-width: 900px;
  margin: 0 auto;
}

.lesson-info {
  .lesson-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;

    h2 {
      margin: 0;
      font-size: 32px;
      color: #00ff88;
    }

    .lesson-tag {
      padding: 6px 15px;
      background: rgba(0, 255, 136, 0.2);
      border: 1px solid rgba(0, 255, 136, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #00ff88;
    }
  }

  .section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    h3 {
      margin: 0 0 15px 0;
      font-size: 22px;
      color: #00aaff;
    }

    p {
      font-size: 15px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 15px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 8px 0 8px 25px;
        position: relative;
        font-size: 15px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.85);

        &:before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #00ff88;
        }
      }
    }
  }

  .highlight-box {
    background: rgba(255, 200, 0, 0.1);
    border-left: 4px solid rgba(255, 200, 0, 0.6);
    padding: 15px 20px;
    border-radius: 8px;
    margin: 20px 0;

    strong {
      color: #ffc800;
      font-size: 16px;
    }

    ul li:before {
      color: #ffc800;
    }
  }

  .field-types {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 20px 0;

    .type-card {
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(0, 170, 255, 0.2);
      border-radius: 10px;
      padding: 15px;

      &.scalar {
        border-color: rgba(100, 200, 255, 0.4);
      }
      &.vector {
        border-color: rgba(100, 255, 100, 0.4);
      }
      &.matrix {
        border-color: rgba(255, 200, 100, 0.4);
      }
      &.multidim {
        border-color: rgba(255, 100, 200, 0.4);
      }

      h4 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #88ccff;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }

      pre {
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 0;

        code {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          line-height: 1.4;
          color: #aaffaa;
        }
      }
    }
  }

  .code-demo {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 255, 136, 0.2);
    border-radius: 12px;
    padding: 20px;

    pre {
      background: rgba(0, 0, 0, 0.6);
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;

      code {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.6;
        color: #aaffaa;
      }
    }
  }

  .demo-container {
    background: rgba(0, 50, 100, 0.15);
    border: 1px solid rgba(0, 170, 255, 0.2);
    border-radius: 12px;
    padding: 25px;

    .demo-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
      align-items: center;

      label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;

        input[type='range'],
        select {
          cursor: pointer;
          padding: 5px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 136, 0.4);
          border-radius: 5px;
          color: white;
        }
      }

      button {
        padding: 10px 20px;
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid rgba(0, 255, 136, 0.4);
        border-radius: 8px;
        color: #00ff88;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 255, 136, 0.3);
        }
      }
    }

    .demo-canvas-container {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      margin-bottom: 15px;
      overflow: hidden;
    }

    .demo-info {
      p {
        font-size: 14px;
        margin-bottom: 5px;

        .running {
          color: #00ff88;
          font-weight: bold;
        }
        .paused {
          color: #ffaa00;
          font-weight: bold;
        }
        .error {
          color: #ff4444;
          font-weight: bold;
        }
        .idle {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }

  .next-lesson {
    padding: 15px;
    background: rgba(0, 255, 136, 0.1);
    border-left: 3px solid #00ff88;
    border-radius: 6px;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
  }
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  .nav-btn {
    padding: 12px 25px;
    background: rgba(0, 170, 255, 0.2);
    border: 1px solid rgba(0, 170, 255, 0.3);
    border-radius: 8px;
    color: #00aaff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 170, 255, 0.3);
      transform: translateX(-2px);
    }

    &.next:hover {
      transform: translateX(2px);
    }
  }
}
</style>
