<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第6课：Texture 数据传输优化</h2>
          <span class="lesson-tag">进阶课程</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 Texture 作为数据容器的优势</li>
            <li>学习使用 ti.field 的 Texture 属性</li>
            <li>掌握 GPU-GPU 零拷贝数据传输</li>
            <li>实现高性能的实时渲染</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 为什么使用 Texture？</h3>
          <p>
            <strong>Texture（纹理）</strong>
            是 GPU 上高效存储和访问 2D 数据的方式。 相比 toArray() 方法，Texture 传输有以下优势：
          </p>
          <div class="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>特性</th>
                  <th>toArray() 传输</th>
                  <th>Texture 传输</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>数据路径</td>
                  <td>GPU → CPU → GPU</td>
                  <td>GPU → GPU</td>
                </tr>
                <tr>
                  <td>拷贝次数</td>
                  <td>2 次（显存→内存→显存）</td>
                  <td>1 次（显存内）</td>
                </tr>
                <tr>
                  <td>延迟</td>
                  <td>高</td>
                  <td>极低</td>
                </tr>
                <tr>
                  <td>带宽占用</td>
                  <td>高</td>
                  <td>低</td>
                </tr>
                <tr>
                  <td>适用场景</td>
                  <td>调试、小规模数据</td>
                  <td>实时渲染、大规模数据</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="highlight-box">
            <strong>关键概念：</strong>
            <p>
              Texture 传输是
              <strong>GPU-GPU 零拷贝</strong>
              ，数据直接在显存内共享，无需经过 CPU，性能提升可达 10-100 倍！
            </p>
          </div>
        </div>

        <div class="section">
          <h3>📖 Texture API 详解</h3>
          <p>
            <strong>注意：</strong>
            Taichi.js 的 Texture API 可能因版本而异。当前演示使用 Canvas 方式模拟 Texture 传输概念。
          </p>
          <p>理想情况下，Taichi.js 应该支持以下 API（未来版本可能实现）：</p>
          <pre><code>// 1. 创建字段并指定为 Texture
let field = ti.field(ti.f32, [512, 512])
let texture = field.toTexture()  // 创建纹理

// 2. 在内核中使用纹理
ti.addToKernelScope({ texture })

let update = ti.kernel(() => {
  for (let x of ti.range(512)) {
    for (let y of ti.range(512)) {
      // 直接写入纹理
      texture.store([x, y], ti.sin(x * 0.01) * ti.cos(y * 0.01))
    }
  }
})

// 3. 获取 WebGL 纹理对象（用于 Three.js）
const glTexture = texture.getWebGLTexture()
const threeTexture = new THREE.DataTexture(
  glTexture.image,
  512, 512,
  THREE.RGBAFormat
)
threeTexture.needsUpdate = true</code></pre>
          <div class="highlight-box">
            <strong>当前实现：</strong>
            <p>
              本演示使用 Canvas 2D API 渲染效果，展示 Texture 数据传输的概念。在实际项目中，应该使用
              Taichi.js 的 toArray() 传输数据到 Canvas，然后创建 Three.js 纹理。
            </p>
          </div>
        </div>

        <div class="section">
          <h3>💻 代码示例：流体场模拟</h3>
          <div class="code-demo">
            <pre><code>// 创建 2D 场（密度场）
const WIDTH = 256
const HEIGHT = 256
let densityField = ti.Vector.field(4, ti.f32, [WIDTH, HEIGHT])  // RGBA
let densityTexture = densityField.toTexture()

ti.addToKernelScope({ densityField, densityTexture })

// 初始化密度场
let initDensity = ti.kernel(() => {
  for (let x of ti.range(WIDTH)) {
    for (let y of ti.range(HEIGHT)) {
      // 创建圆形密度分布
      let cx = x / WIDTH * 2.0 - 1.0
      let cy = y / HEIGHT * 2.0 - 1.0
      let dist = ti.sqrt(cx * cx + cy * cy)
      let value = ti.max(0.0, 1.0 - dist)
      
      densityField[[x, y]] = [
        value,    // R - 红色
        value * 0.5,  // G - 绿色
        value * 0.2,  // B - 蓝色
        1.0       // A - 透明度
      ]
    }
  }
})

// 更新密度场（添加波动）
let updateDensity = ti.kernel(() => {
  for (let x of ti.range(WIDTH)) {
    for (let y of ti.range(HEIGHT)) {
      let t = ti.time() * 2.0
      let fx = x / WIDTH * 4.0
      let fy = y / HEIGHT * 4.0
      
      densityField[[x, y]] = [
        ti.sin(fx + t) * 0.5 + 0.5,
        ti.sin(fy + t * 0.8) * 0.5 + 0.5,
        ti.sin((fx + fy) + t * 1.2) * 0.5 + 0.5,
        1.0
      ]
    }
  }
})

// Three.js 渲染
const planeGeometry = new THREE.PlaneGeometry(8, 6)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: densityTexture.getWebGLTexture(),
  side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>⚡ 性能对比</h3>
          <div class="performance-chart">
            <div class="chart-item">
              <div class="chart-label">toArray() 传输</div>
              <div class="chart-bar slow" :style="{ width: '100%' }">
                <span>~50ms (10000 particles)</span>
              </div>
            </div>
            <div class="chart-item">
              <div class="chart-label">Texture 传输</div>
              <div class="chart-bar fast" :style="{ width: '15%' }">
                <span>~0.1ms (256x256 texture)</span>
              </div>
            </div>
          </div>
          <p class="chart-note">* 数据仅供参考，实际性能取决于硬件和数据规模</p>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                纹理尺寸: {{ textureSize }}x{{ textureSize }}
                <select v-model.number="textureSize" @change="resetDemo">
                  <option :value="64">64x64</option>
                  <option :value="128">128x128</option>
                  <option :value="256">256x256</option>
                  <option :value="512">512x512</option>
                </select>
              </label>
              <label>
                效果模式:
                <select v-model="effectMode">
                  <option value="plasma">等离子波</option>
                  <option value="ripple">水波纹</option>
                  <option value="noise">噪声纹理</option>
                  <option value="gradient">渐变流</option>
                </select>
              </label>
              <label>
                动画速度: {{ animationSpeed }}x
                <input v-model.number="animationSpeed" type="range" min="0.1" max="5" step="0.1" />
              </label>
              <label>
                <input v-model="showWireframe" type="checkbox" />
                显示网格
              </label>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
            </div>
            <div ref="canvasContainer" class="demo-canvas-container"></div>
            <div class="demo-info">
              <p>
                传输方式:
                <span class="highlight">Taichi GPU → CPU → Three.js Texture</span>
              </p>
              <p>FPS: {{ fps }}</p>
              <p>更新时间: {{ updateTime }}ms</p>
              <p>纹理分辨率: {{ textureSize }}x{{ textureSize }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 最佳实践</h3>
          <div class="best-practices">
            <div class="practice-card">
              <h4>1. 选择合适的纹理尺寸</h4>
              <p>使用 2 的幂次方尺寸（64, 128, 256, 512）以获得最佳性能</p>
            </div>
            <div class="practice-card">
              <h4>2. 使用向量化字段</h4>
              <p>ti.Vector.field(4, ...) 对应 RGBA 纹理格式，效率最高</p>
            </div>
            <div class="practice-card">
              <h4>3. 避免频繁创建纹理</h4>
              <p>初始化时创建一次，后续只需更新数据</p>
            </div>
            <div class="practice-card">
              <h4>4. 合理使用 needsUpdate</h4>
              <p>只在数据变化后设置 needsUpdate = true</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ Texture 数据传输的核心概念</li>
            <li>✅ 如何使用 GPU-GPU 零拷贝传输</li>
            <li>✅ 性能优化的关键技巧</li>
          </ul>
          <p class="next-lesson">下一课将学习粒子物理模拟，实现重力场效果。</p>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第5课：GPU 计算与数据传输</button>
        <button class="nav-btn next" @click="goToNext">第7课：粒子物理模拟（重力场） →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const textureSize = ref(256)
const effectMode = ref('plasma')
const animationSpeed = ref(1.0)
const showWireframe = ref(false)
const isAnimating = ref(true)
const fps = ref(0)
const updateTime = ref(0)

const canvasContainer = ref<HTMLElement>()

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let mesh: THREE.Mesh

// Taichi.js 变量
let tiField: any = null
let tiTime: any = null
let tiInit: any = null
let tiUpdatePlasma: any = null
let tiUpdateRipple: any = null
let tiUpdateNoise: any = null
let tiUpdateGradient: any = null

let size = 256
let lastFrameTime = performance.now()
let frameCount = 0
let canvasTexture: THREE.CanvasTexture | null = null
let timeValue = 0

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 500

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)

  // 创建平面
  createMesh()
}

// 创建网格
function createMesh() {
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) mesh.material.dispose()
  }

  const geometry = new THREE.PlaneGeometry(8, 6, size - 1, size - 1)

  // 创建临时纹理占位
  const tempTexture = createPlaceholderTexture()

  // 使用两种材质：wireframe 和 textured
  if (showWireframe.value) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      wireframe: true,
      side: THREE.DoubleSide
    })
    mesh = new THREE.Mesh(geometry, material)
  } else {
    const material = new THREE.MeshBasicMaterial({
      map: tempTexture,
      side: THREE.DoubleSide,
      wireframe: false
    })
    mesh = new THREE.Mesh(geometry, material)
  }

  scene.add(mesh)
}

// 创建占位纹理
function createPlaceholderTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#1a1a3a')
  gradient.addColorStop(1, '#0a0a1a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

// 初始化 Taichi.js
async function initTaichi() {
  try {
    await ti.init()

    size = textureSize.value

    // 创建 2D 字段（RGBA 4 通道）和时间字段
    tiField = ti.Vector.field(4, ti.f32, [size, size])
    tiTime = ti.field(ti.f32, [1])

    ti.addToKernelScope({ tiField, tiTime, size })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let x of ti.range(size)) {
        for (let y of ti.range(size)) {
          tiField[[x, y]] = [0, 0, 0, 1]
        }
      }
      tiTime[0] = 0.0
    })

    // 等离子波效果内核
    tiUpdatePlasma = ti.kernel(() => {
      let t = tiTime[0]
      for (let x of ti.range(size)) {
        for (let y of ti.range(size)) {
          let fx = (x / size) * 4.0
          let fy = (y / size) * 4.0
          let r = ti.sin(fx + t) * 0.5 + 0.5
          let g = ti.sin(fy + t * 0.8) * 0.5 + 0.5
          let b = ti.sin(fx + fy + t * 1.2) * 0.5 + 0.5
          tiField[[x, y]] = [r, g, b, 1.0]
        }
      }
    })

    // 水波纹效果内核
    tiUpdateRipple = ti.kernel(() => {
      let t = tiTime[0]
      for (let x of ti.range(size)) {
        for (let y of ti.range(size)) {
          let fx = (x / size) * 4.0
          let fy = (y / size) * 4.0
          let cx = fx - 2.0
          let cy = fy - 2.0
          let dist = ti.sqrt(cx * cx + cy * cy)
          let wave = ti.sin(dist * 5 - t * 3) * 0.5 + 0.5
          let r = wave * 0.3 + 0.1
          let g = wave * 0.5 + 0.2
          let b = wave * 0.8 + 0.4
          tiField[[x, y]] = [r, g, b, 1.0]
        }
      }
    })

    // 噪声纹理内核
    tiUpdateNoise = ti.kernel(() => {
      let t = tiTime[0]
      for (let x of ti.range(size)) {
        for (let y of ti.range(size)) {
          let nx = ti.sin(x * 0.1 + t) * ti.cos(y * 0.1 + t)
          let ny = ti.cos(x * 0.1 - t) * ti.sin(y * 0.1 - t)
          let r = nx * 0.5 + 0.5
          let g = ny * 0.5 + 0.5
          let b = (nx + ny) * 0.25 + 0.5
          tiField[[x, y]] = [r, g, b, 1.0]
        }
      }
    })

    // 渐变流内核
    tiUpdateGradient = ti.kernel(() => {
      let t = tiTime[0]
      for (let x of ti.range(size)) {
        for (let y of ti.range(size)) {
          let fx = (x / size) * 4.0
          let r = ti.sin(fx + t) * 0.5 + 0.5
          let g = ti.sin(fx + t + 2.0) * 0.5 + 0.5
          let b = ti.sin(fx + t + 4.0) * 0.5 + 0.5
          tiField[[x, y]] = [r, g, b, 1.0]
        }
      }
    })

    await tiInit()

    // 更新 Three.js 材质纹理
    updateMeshTexture()
  } catch (error) {
    console.error('Taichi.js 初始化失败:', error)
    tiUpdate = null
  }
}

// 更新网格纹理
async function updateMeshTexture() {
  if (!mesh || !tiField) return

  try {
    // 如果是 wireframe 模式，不需要更新纹理
    if (showWireframe.value) {
      return
    }

    // 从 Taichi 获取数据（GPU → CPU）
    const fieldData = await tiField.toArray()

    // 使用 Canvas 更新纹理
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    // 将 Taichi 数据填充到 Canvas
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const index = (y * size + x) * 4
        const pixel = fieldData[x][y]

        data[index] = Math.floor((pixel[0] ?? 0) * 255)     // R
        data[index + 1] = Math.floor((pixel[1] ?? 0) * 255) // G
        data[index + 2] = Math.floor((pixel[2] ?? 0) * 255) // B
        data[index + 3] = Math.floor((pixel[3] ?? 1) * 255) // A
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // 释放旧纹理
    if (canvasTexture && canvasTexture.dispose) {
      canvasTexture.dispose()
    }

    canvasTexture = new THREE.CanvasTexture(canvas)
    canvasTexture.wrapS = THREE.ClampToEdgeWrapping
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping
    canvasTexture.minFilter = THREE.LinearFilter
    canvasTexture.magFilter = THREE.LinearFilter
    canvasTexture.needsUpdate = true

    // 获取材质
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material

    // 只有非 wireframe 材质才有 map
    if (material.map) {
      // 释放旧纹理
      if (material.map && material.map.dispose) {
        material.map.dispose()
      }

      // 更新材质
      material.map = canvasTexture
    }

    // 强制更新材质
    material.needsUpdate = true
  } catch (error) {
    console.error('纹理更新失败:', error)
  }
}

// 在 Canvas 上绘制效果（保留用于占位纹理初始化）
function updateCanvasWithEffect(ctx: CanvasRenderingContext2D, imageData: ImageData) {
  const t = performance.now() * 0.001 * animationSpeed.value
  const data = imageData.data

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const fx = (x / size) * 4.0
      const fy = (y / size) * 4.0
      let r, g, b

      if (effectMode.value === 'plasma') {
        r = Math.sin(fx + t) * 0.5 + 0.5
        g = Math.sin(fy + t * 0.8) * 0.5 + 0.5
        b = Math.sin(fx + fy + t * 1.2) * 0.5 + 0.5
      } else if (effectMode.value === 'ripple') {
        const cx = fx - 2.0
        const cy = fy - 2.0
        const dist = Math.sqrt(cx * cx + cy * cy)
        const wave = Math.sin(dist * 5 - t * 3) * 0.5 + 0.5
        r = wave * 0.3 + 0.1
        g = wave * 0.5 + 0.2
        b = wave * 0.8 + 0.4
      } else if (effectMode.value === 'noise') {
        const nx = Math.sin(x * 0.1 + t) * Math.cos(y * 0.1 + t)
        const ny = Math.cos(x * 0.1 - t) * Math.sin(y * 0.1 - t)
        r = nx * 0.5 + 0.5
        g = ny * 0.5 + 0.5
        b = (nx + ny) * 0.25 + 0.5
      } else {
        r = Math.sin(fx + t) * 0.5 + 0.5
        g = Math.sin(fx + t + 2.0) * 0.5 + 0.5
        b = Math.sin(fx + t + 4.0) * 0.5 + 0.5
      }

      const index = (y * size + x) * 4
      data[index] = Math.floor(r * 255)
      data[index + 1] = Math.floor(g * 255)
      data[index + 2] = Math.floor(b * 255)
      data[index + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

// 更新场景
async function updateScene() {
  if (!tiUpdatePlasma || !mesh) return

  const updateStart = performance.now()

  try {
    // 更新时间
    timeValue += 0.016 * animationSpeed.value
    tiTime[0] = timeValue

    // 根据效果模式选择对应的内核
    let updateKernel
    if (effectMode.value === 'plasma') {
      updateKernel = tiUpdatePlasma
    } else if (effectMode.value === 'ripple') {
      updateKernel = tiUpdateRipple
    } else if (effectMode.value === 'noise') {
      updateKernel = tiUpdateNoise
    } else {
      updateKernel = tiUpdateGradient
    }

    await updateKernel()

    const updateEnd = performance.now()
    updateTime.value = (updateEnd - updateStart).toFixed(2)

    // 更新纹理
    updateMeshTexture()
  } catch (error) {
    console.error('更新失败:', error)
  }
}

// 动画循环
function animate() {
  const now = performance.now()
  frameCount++

  if (now - lastFrameTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFrameTime = now
  }

  if (isAnimating.value) {
    updateScene()
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }

  requestAnimationFrame(animate)
}

// 切换动画
function toggleAnimation() {
  isAnimating.value = !isAnimating.value
}

// 重置演示
async function resetDemo() {
  size = textureSize.value

  // 完全重新创建 mesh 以切换 wireframe 模式
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) mesh.material.dispose()
  }

  createMesh()
  await initTaichi()
}

// 监听 wireframe 变化
watch(showWireframe, () => {
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) mesh.material.dispose()
  }
  createMesh()
})

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第7课即将推出！')
}

onMounted(async () => {
  initThreeJS()
  await initTaichi()
  animate()
})

onUnmounted(() => {
  if (mesh) {
    scene.remove(mesh)
    if (mesh.geometry) mesh.geometry.dispose()
    if (mesh.material) mesh.material.dispose()
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
      background: rgba(255, 100, 100, 0.2);
      border: 1px solid rgba(255, 100, 100, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #ff6666;
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

  .comparison-table {
    overflow-x: auto;
    margin: 20px 0;

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;

      th,
      td {
        padding: 12px;
        text-align: left;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      th {
        background: rgba(0, 170, 255, 0.15);
        color: #00aaff;
        font-weight: bold;
      }

      td {
        background: rgba(0, 0, 0, 0.2);
      }

      tr:nth-child(even) td {
        background: rgba(0, 0, 0, 0.3);
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

    p {
      margin: 10px 0 0 0;
      color: rgba(255, 255, 255, 0.85);
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
        font-size: 11px;
        line-height: 1.5;
        color: #aaffaa;
      }
    }
  }

  .performance-chart {
    margin: 20px 0;

    .chart-item {
      margin-bottom: 15px;

      .chart-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.85);
        margin-bottom: 5px;
      }

      .chart-bar {
        height: 30px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        font-size: 12px;
        color: white;
        transition: width 0.5s ease;

        &.slow {
          background: linear-gradient(135deg, #ff6666 0%, #cc4444 100%);
        }

        &.fast {
          background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
        }
      }
    }
  }

  .chart-note {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
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
        gap: 8px;
        font-size: 14px;

        select,
        input[type='range'],
        input[type='checkbox'] {
          cursor: pointer;
        }

        select {
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

        .highlight {
          color: #00ff88;
          font-weight: bold;
        }
      }
    }
  }

  .best-practices {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;

    .practice-card {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.2);
      border-radius: 10px;
      padding: 15px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #00ff88;
      }

      p {
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
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

@media (max-width: 768px) {
  .lesson-page {
    padding: 60px 15px 20px 15px;
  }

  .best-practices {
    grid-template-columns: 1fr;
  }
}
</style>
