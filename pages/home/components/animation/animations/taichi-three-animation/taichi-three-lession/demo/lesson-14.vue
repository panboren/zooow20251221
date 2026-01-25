<template>
  <div class="lesson-page">
    <div class="header">
      <h1>TaichiThreeBridge 实战演示</h1>
      <p class="subtitle">简单的 API，强大的数据交互能力</p>
    </div>

    <!-- 性能监控面板 -->
    <div class="performance-panel">
      <div class="metric">
        <span class="label">FPS</span>
        <span class="value" :class="{ good: performance.fps > 50, warning: performance.fps > 30 && performance.fps <= 50, bad: performance.fps <= 30 }">
          {{ performance.fps.toFixed(1) }}
        </span>
      </div>
      <div class="metric">
        <span class="label">帧时间</span>
        <span class="value">{{ performance.frameTime.toFixed(2) }} ms</span>
      </div>
      <div class="metric">
        <span class="label">传输时间</span>
        <span class="value">{{ performance.transferTime.toFixed(2) }} ms</span>
      </div>
      <div class="metric">
        <span class="label">传输模式</span>
        <span class="value mode-badge">{{ performance.mode }}</span>
      </div>
      <div class="metric">
        <span class="label">数据量</span>
        <span class="value">{{ (performance.dataSize / 1024).toFixed(2) }} KB</span>
      </div>
    </div>

    <!-- Three.js 画布 -->
    <div ref="canvasContainer" class="canvas-container"></div>

    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-group">
        <label>演示模式：</label>
        <select v-model="currentDemo">
          <option value="particles">粒子系统 (10,000)</option>
          <option value="instanced">实例化网格 (1,000)</option>
          <option value="texture">密度场纹理 (512x512)</option>
          <option value="all">全部显示</option>
        </select>
      </div>

      <div class="control-group">
        <label>动画速度：</label>
        <input type="range" v-model.number="animationSpeed" min="0" max="2" step="0.1" />
        <span>{{ animationSpeed.toFixed(1) }}x</span>
      </div>

      <div class="control-group">
        <label>传输模式：</label>
        <select v-model="transferMode">
          <option value="auto">自动</option>
          <option value="array">Array</option>
          <option value="texture">Texture</option>
        </select>
      </div>

      <button @click="toggleAnimation" class="btn-toggle">
        {{ isAnimating ? '暂停' : '播放' }}
      </button>
    </div>

    <!-- API 示例代码 -->
    <div class="code-examples">
      <h2>使用示例</h2>

      <div class="example-block">
        <h3>1. 初始化桥接器</h3>
        <pre><code>import { TaichiThreeBridge } from '@/utils/TaichiThreeBridge'

// 创建桥接器（自动选择最佳传输模式）
const bridge = new TaichiThreeBridge(renderer, {
  enablePerformanceMonitor: true,
  targetFps: 60,
  mode: 'auto'  // 'auto' | 'array' | 'texture'
})</code></pre>
      </div>

      <div class="example-block">
        <h3>2. 创建粒子系统</h3>
        <pre><code>// 一行代码创建粒子系统
const particleSystem = await bridge.createParticleSystem(
  positionField,  // Taichi 字段
  colorField,     // 可选：颜色字段
  {
    size: 0.1,
    vertexColors: true,
    transparent: true
  }
)

// 添加到场景
scene.add(particleSystem)

// 每帧更新（在动画循环中）
await bridge.updateParticleSystem(
  particleSystem,
  newPositionField,
  newColorField
)</code></pre>
      </div>

      <div class="example-block">
        <h3>3. 创建实例化网格</h3>
        <pre><code>// 创建实例化网格系统
const instancedMesh = await bridge.createInstancedMeshSystem(
  geometry,      // Three.js 几何体
  material,      // Three.js 材质
  positionField, // Taichi 位置字段
  colorField,    // 可选：颜色字段
  10000          // 实例数量
)

// 添加到场景
scene.add(instancedMesh)

// 每帧更新
await bridge.updateInstancedMeshSystem(
  instancedMesh,
  newPositionField,
  newColorField
)</code></pre>
      </div>

      <div class="example-block">
        <h3>4. 同步到纹理</h3>
        <pre><code>// 创建密度场纹理
const densityTexture = await bridge.createDataTexture(
  densityField,  // Taichi 2D 字段
  512,           // 宽度
  512            // 高度
)

// 创建材质
const material = new THREE.MeshBasicMaterial({
  map: densityTexture
})

// 更新纹理
await bridge.syncFieldToTexture(
  newDensityField,
  densityTexture
)</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { TaichiThreeBridge } from '@/utils/TaichiThreeBridge'

// 引用
const canvasContainer = ref<HTMLElement>()

// 状态
const currentDemo = ref<'particles' | 'instanced' | 'texture' | 'all'>('particles')
const animationSpeed = ref(1.0)
const transferMode = ref<'auto' | 'array' | 'texture'>('auto')
const isAnimating = ref(true)

// 性能指标
const performance = ref({
  fps: 60,
  frameTime: 16.67,
  transferTime: 0,
  mode: 'auto' as any,
  dataSize: 0
})

// Three.js 对象
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let bridge: TaichiThreeBridge
let particleSystem: THREE.Points | null = null
let instancedMesh: THREE.InstancedMesh | null = null
let textureMesh: THREE.Mesh | null = null
let densityTexture: THREE.DataTexture | null = null

// Taichi 字段（模拟）
let positions: any
let colors: any
let instancedPositions: any
let instancedColors: any
let densityField: any

// 动画帧ID
let animationId: number

// 模拟 Taichi 字段
class MockTaichiField {
  constructor(
    private data: Float32Array,
    public dimensions: number[]
  ) {}

  async toArray1D(): Promise<number[]> {
    return Array.from(this.data)
  }

  async toFloat32Array(): Promise<Float32Array> {
    return this.data
  }

  async fromArray(values: any): Promise<void> {}

  update(offset: number, value: number): void {
    this.data[offset] = value
  }
}

// 初始化
onMounted(async () => {
  await initThree()
  await initTaichiFields()
  await createDemoObjects()
  animate()
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (bridge) bridge.dispose()
})

// 初始化 Three.js
async function initThree() {
  const width = canvasContainer.value!.clientWidth
  const height = 600

  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  // 相机
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(0, 0, 15)

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  canvasContainer.value!.appendChild(renderer.domElement)

  // 桥接器
  bridge = new TaichiThreeBridge(renderer, {
    enablePerformanceMonitor: true,
    targetFps: 60,
    mode: transferMode.value
  })

  // 灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 10)
  scene.add(directionalLight)
}

// 初始化模拟的 Taichi 字段
async function initTaichiFields() {
  // 粒子位置 (10,000 个粒子)
  const particlePositions = new Float32Array(10000 * 3)
  const particleColors = new Float32Array(10000 * 3)

  for (let i = 0; i < 10000; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 3 + Math.random() * 2

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    particlePositions[i * 3 + 2] = radius * Math.cos(phi)

    particleColors[i * 3] = Math.random()
    particleColors[i * 3 + 1] = Math.random()
    particleColors[i * 3 + 2] = Math.random()
  }

  positions = new MockTaichiField(particlePositions, [10000, 3])
  colors = new MockTaichiField(particleColors, [10000, 3])

  // 实例化网格位置 (1,000 个实例)
  const instPos = new Float32Array(1000 * 3)
  const instColors = new Float32Array(1000 * 3)

  for (let i = 0; i < 1000; i++) {
    instPos[i * 3] = (Math.random() - 0.5) * 10
    instPos[i * 3 + 1] = (Math.random() - 0.5) * 10
    instPos[i * 3 + 2] = (Math.random() - 0.5) * 10

    instColors[i * 3] = Math.random()
    instColors[i * 3 + 1] = Math.random() * 0.5
    instColors[i * 3 + 2] = 0.8
  }

  instancedPositions = new MockTaichiField(instPos, [1000, 3])
  instancedColors = new MockTaichiField(instColors, [1000, 3])

  // 密度场 (512x512)
  const densityData = new Float32Array(512 * 512)
  densityField = new MockTaichiField(densityData, [512, 512])
}

// 创建演示对象
async function createDemoObjects() {
  // 粒子系统
  particleSystem = await bridge.createParticleSystem(positions, colors, {
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  })
  particleSystem.visible = currentDemo.value === 'particles' || currentDemo.value === 'all'
  scene.add(particleSystem)

  // 实例化网格
  const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  const boxMaterial = new THREE.MeshPhongMaterial({ vertexColors: true })
  instancedMesh = await bridge.createInstancedMeshSystem(
    boxGeometry,
    boxMaterial,
    instancedPositions,
    instancedColors,
    1000
  )
  instancedMesh.visible = currentDemo.value === 'instanced' || currentDemo.value === 'all'
  scene.add(instancedMesh)

  // 密度场纹理
  densityTexture = await bridge.createDataTexture(densityField, 512, 512, {
    format: THREE.RedFormat,
    type: THREE.FloatType
  })

  const planeGeometry = new THREE.PlaneGeometry(10, 10)
  const planeMaterial = new THREE.MeshBasicMaterial({ map: densityTexture })
  textureMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  textureMesh.position.z = -5
  textureMesh.visible = currentDemo.value === 'texture' || currentDemo.value === 'all'
  scene.add(textureMesh)
}

// 更新 Taichi 字段数据
function updateTaichiFields(time: number) {
  const speed = animationSpeed.value

  // 更新粒子位置（旋转效果）
  for (let i = 0; i < 10000; i++) {
    const x = positions.data[i * 3]
    const y = positions.data[i * 3 + 1]
    const z = positions.data[i * 3 + 2]

    const cos = Math.cos(time * 0.001 * speed)
    const sin = Math.sin(time * 0.001 * speed)

    positions.data[i * 3] = x * cos - z * sin
    positions.data[i * 3 + 1] = y + Math.sin(time * 0.002 * speed + i * 0.1) * 0.01
    positions.data[i * 3 + 2] = x * sin + z * cos

    // 颜色变化
    colors.data[i * 3] = Math.sin(time * 0.001 + i * 0.01) * 0.5 + 0.5
    colors.data[i * 3 + 1] = Math.cos(time * 0.001 + i * 0.01) * 0.5 + 0.5
    colors.data[i * 3 + 2] = 0.8
  }

  // 更新实例化网格
  for (let i = 0; i < 1000; i++) {
    const x = instancedPositions.data[i * 3]
    const y = instancedPositions.data[i * 3 + 1]
    const z = instancedPositions.data[i * 3 + 2]

    const cos = Math.cos(time * 0.0005 * speed)
    const sin = Math.sin(time * 0.0005 * speed)

    instancedPositions.data[i * 3] = x * cos - z * sin
    instancedPositions.data[i * 3 + 1] = y + Math.sin(time * 0.001 * speed + i * 0.5) * 0.02
    instancedPositions.data[i * 3 + 2] = x * sin + z * cos

    instancedColors.data[i * 3] = Math.sin(time * 0.002 + i * 0.05) * 0.5 + 0.5
    instancedColors.data[i * 3 + 1] = 0.5
    instancedColors.data[i * 3 + 2] = Math.cos(time * 0.002 + i * 0.05) * 0.5 + 0.5
  }

  // 更新密度场（波纹效果）
  for (let i = 0; i < 512; i++) {
    for (let j = 0; j < 512; j++) {
      const x = (i / 512 - 0.5) * 10
      const y = (j / 512 - 0.5) * 10
      const dist = Math.sqrt(x * x + y * y)
      densityField.data[i * 512 + j] = Math.sin(dist - time * 0.005 * speed) * 0.5 + 0.5
    }
  }
}

// 动画循环
async function animate(time: number = 0) {
  animationId = requestAnimationFrame(animate)

  if (!isAnimating.value) return

  // 更新 Taichi 字段
  updateTaichiFields(time)

  // 更新 Three.js 对象
  try {
    if (particleSystem && particleSystem.visible) {
      await bridge.updateParticleSystem(particleSystem, positions, colors)
    }

    if (instancedMesh && instancedMesh.visible) {
      await bridge.updateInstancedMeshSystem(instancedMesh, instancedPositions, instancedColors)
    }

    if (densityTexture && textureMesh && textureMesh.visible) {
      await bridge.syncFieldToTexture(densityField, densityTexture)
    }

    // 更新性能指标
    const perf = bridge.getPerformance()
    performance.value = {
      fps: perf.fps,
      frameTime: perf.frameTime,
      transferTime: perf.transferTime,
      mode: perf.mode,
      dataSize: perf.dataSize
    }
  } catch (error) {
    console.error('[Demo] Update error:', error)
  }

  renderer.render(scene, camera)
}

// 切换动画
function toggleAnimation() {
  isAnimating.value = !isAnimating.value
}

// 监听演示模式变化
watch(currentDemo, async () => {
  if (particleSystem) particleSystem.visible = currentDemo.value === 'particles' || currentDemo.value === 'all'
  if (instancedMesh) instancedMesh.visible = currentDemo.value === 'instanced' || currentDemo.value === 'all'
  if (textureMesh) textureMesh.visible = currentDemo.value === 'texture' || currentDemo.value === 'all'
})

// 监听传输模式变化
watch(transferMode, () => {
  bridge = new TaichiThreeBridge(renderer, {
    enablePerformanceMonitor: true,
    targetFps: 60,
    mode: transferMode.value
  })
})
</script>

<style scoped lang="scss">
.lesson-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%);
  padding: 80px 30px 30px 30px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #64b5f6, #e57373);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.7);
  }
}

.performance-panel {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 20px;

  .metric {
    text-align: center;

    .label {
      display: block;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 5px;
    }

    .value {
      font-size: 1.5rem;
      font-weight: bold;
      display: block;

      &.good { color: #4caf50; }
      &.warning { color: #ff9800; }
      &.bad { color: #f44336; }

      &.mode-badge {
        font-size: 1rem;
        padding: 4px 12px;
        background: rgba(100, 181, 246, 0.2);
        border-radius: 12px;
        color: #64b5f6;
      }
    }
  }
}

.canvas-container {
  width: 100%;
  height: 600px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
}

.controls {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 30px;

  .control-group {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      color: rgba(255, 255, 255, 0.8);
    }

    select,
    input[type="range"] {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      color: white;
      padding: 5px 10px;

      &:focus {
        outline: none;
        border-color: #64b5f6;
      }
    }

    input[type="range"] {
      width: 120px;
    }
  }

  .btn-toggle {
    padding: 8px 20px;
    background: linear-gradient(135deg, #64b5f6, #42a5f5);
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.code-examples {
  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #64b5f6;
  }

  .example-block {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;

    h3 {
      color: #e57373;
      margin-bottom: 15px;
    }

    pre {
      background: rgba(0, 0, 0, 0.5);
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;

      code {
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
        color: #b0bec5;
      }
    }
  }
}
</style>
