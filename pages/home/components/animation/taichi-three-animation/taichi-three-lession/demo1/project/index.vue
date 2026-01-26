<template>
  <div class="page-content">
    <div class="container">
      <h1>🎨 图片质量优化工具</h1>
      <p class="subtitle">使用 taichi.js GPU 加速的实时图片优化</p>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <label class="control-label">
            <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" class="file-input">
            <div class="file-button">
              <span>📁 选择图片</span>
            </div>
          </label>
          <div class="hint">支持 JPG、PNG 等格式</div>
        </div>

        <div class="control-group">
          <label class="control-label">优化模式</label>
          <div class="mode-selector">
            <button
              v-for="(mode, index) in optimizationModes"
              :key="index"
              :class="['mode-button', { active: currentMode === index }]"
              @click="setMode(index)"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">参数调整</label>
          <div class="sliders">
            <div class="slider-item">
              <label>
                <span>强度</span>
                <span class="slider-value">{{ (intensity * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="intensity"
                min="0"
                max="1"
                step="0.01"
                class="slider"
                @input="updateIntensity"
              >
            </div>
          </div>
        </div>

        <div class="control-group">
          <button class="action-button primary" @click="toggleAnimation">
            {{ isAnimating ? '⏸ 暂停' : '▶ 播放' }}
          </button>
          <button class="action-button" @click="downloadImage">
            💾 下载图片
          </button>
          <button class="action-button" @click="resetImage">
            ↺ 重置
          </button>
        </div>
      </div>

      <!-- 画布区域 -->
      <div class="canvas-container">
        <div class="canvas-wrapper">
          <div class="canvas-header">原图</div>
          <canvas ref="originalCanvas" width="512" height="512"></canvas>
        </div>
        <div class="canvas-wrapper">
          <div class="canvas-header">
            优化后
            <span class="fps-counter" v-if="isAnimating">{{ fps }} FPS</span>
          </div>
          <canvas ref="optimizedCanvas" width="512" height="512"></canvas>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="status-bar">
        <span class="status-text">{{ status }}</span>
        <span class="performance-info">{{ performanceInfo }}</span>
      </div>

      <!-- 使用说明 -->
      <div class="instructions">
        <h2>📖 使用说明</h2>
        <ul>
          <li>点击"选择图片"按钮上传本地图片</li>
          <li>选择不同的优化模式查看效果</li>
          <li>调整强度滑块控制优化程度</li>
          <li>点击"下载图片"保存优化后的图片</li>
          <li>所有优化在 GPU 上实时处理，性能优异</li>
        </ul>

        <h3>优化模式说明</h3>
        <div class="mode-descriptions">
          <div v-for="(mode, index) in optimizationModes" :key="index" class="mode-desc">
            <strong>{{ mode.name }}</strong>
            <p>{{ mode.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const { $loadTaichi } = useNuxtApp()

// Canvas 引用
const originalCanvas = ref<HTMLCanvasElement | null>(null)
const optimizedCanvas = ref<HTMLCanvasElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 状态
const status = ref('请选择一张图片')
const isAnimating = ref(false)
const currentMode = ref(0)
const intensity = ref(0.5)
const fps = ref(0)

// 性能信息
const performanceInfo = ref('')

// 优化模式
const optimizationModes = [
  {
    name: '原图',
    description: '显示原始图片，不应用任何优化',
    params: {}
  },
  {
    name: '锐化',
    description: '增强边缘清晰度，使图片更清晰锐利',
    params: {}
  },
  {
    name: '对比度增强',
    description: '提升明暗对比，使图片更有层次感',
    params: {}
  },
  {
    name: '饱和度提升',
    description: '增强色彩鲜艳度，使图片更生动',
    params: {}
  },
  {
    name: '色彩校正',
    description: '综合优化（对比度+饱和度+亮度），提升整体质量',
    params: {}
  },
  {
    name: '高对比黑白',
    description: '转换为黑白并增强对比，艺术效果',
    params: {}
  },
  {
    name: '暖色调',
    description: '添加暖色滤镜，营造温暖氛围',
    params: {}
  },
  {
    name: '冷色调',
    description: '添加冷色滤镜，营造清凉氛围',
    params: {}
  }
]

let ti: any = null
let texture: any = null
let targetTexture: any = null
let vertices: any = null
let indices: any = null
let intensityField: any = null
let modeField: any = null
let renderKernel: any = null

let animationId: number | null = null
let lastFrameTime = 0
let frameCount = 0

const IMAGE_SIZE = 512

// 初始化 taichi.js
async function initTaichi() {
  try {
    ti = await $loadTaichi()
    await ti.init()
    status.value = 'taichi.js 初始化成功'
  } catch (error) {
    status.value = '❌ taichi.js 初始化失败: ' + (error as Error).message
    console.error('taichi.js 初始化错误:', error)
  }
}

// 处理文件选择
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  status.value = '正在加载图片...'

  const reader = new FileReader()
  reader.onload = async (e) => {
    const img = new Image()
    img.onload = () => {
      // 绘制到原始画布
      const ctx = originalCanvas.value?.getContext('2d')
      if (ctx) {
        // 保持宽高比，缩放到 512x512
        const scale = Math.min(IMAGE_SIZE / img.width, IMAGE_SIZE / img.height)
        const width = img.width * scale
        const height = img.height * scale
        const offsetX = (IMAGE_SIZE - width) / 2
        const offsetY = (IMAGE_SIZE - height) / 2

        ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE)
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE)
        ctx.drawImage(img, offsetX, offsetY, width, height)
      }

      // 创建纹理 - 直接从 img 创建
      createTexture(img)
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 创建纹理
async function createTexture(img: HTMLImageElement) {
  try {
    if (!ti) {
      await initTaichi()
    }

    status.value = '正在创建纹理...'

    // 创建 ImageBitmap
    const bitmap = await createImageBitmap(img)

    // 创建纹理
    texture = await ti.Texture.createFromBitmap(bitmap)
    targetTexture = ti.texture(4, [IMAGE_SIZE, IMAGE_SIZE])

    // 顶点数据
    vertices = ti.field(ti.types.vector(ti.f32, 2), 4)
    await vertices.fromArray([[-1.0, -1.0], [1.0, -1.0], [-1.0, 1.0], [1.0, 1.0]])

    indices = ti.field(ti.i32, 6)
    await indices.fromArray([0, 1, 2, 2, 1, 3])

    // 参数字段
    intensityField = ti.field(ti.f32, [1])
    await intensityField.fromArray([intensity.value])

    modeField = ti.field(ti.i32, [1])
    await modeField.fromArray([currentMode.value])

    // 添加到 kernel scope
    ti.addToKernelScope({
      texture,
      targetTexture,
      vertices,
      indices,
      intensityField,
      modeField,
      IMAGE_SIZE
    })

    // 创建渲染 kernel
    createRenderKernel()

    status.value = '图片加载成功！'
    performanceInfo.value = '纹理: 512x512 | 格式: RGBA'

    // 开始动画
    if (!isAnimating.value) {
      startAnimation()
    }
  } catch (error) {
    status.value = '❌ 纹理创建失败: ' + (error as Error).message
    console.error('纹理创建错误:', error)
  }
}

// 创建渲染 kernel
function createRenderKernel() {
  renderKernel = ti.kernel(function render(time: any) {
    // Vertex Shader
    for (let v of ti.inputVertices(vertices, indices)) {
      ti.outputPosition([v.x, v.y, 0.0, 1.0])
      ti.outputVertex(v)
    }

    // Fragment Shader
    for (let f of ti.inputFragments()) {
      let uv = (f + 1.0) / 2.0
      let color = ti.textureSample(texture, uv)

      let mode = modeField[0]
      let intensityVal = intensityField[0]

      // 根据模式应用不同的优化
      if (mode === 1) {
        // 锐化滤镜
        let offset = 1.0 / IMAGE_SIZE
        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])
        let sharp = center * 5.0 - (up + down + left + right)
        let strength = intensityVal * 0.5
        color = center * (1.0 - strength) + sharp * strength
      } else if (mode === 2) {
        // 对比度增强
        let contrast = 1.0 + intensityVal * 1.0
        color.rgb = (color.rgb - 0.5) * contrast + 0.5
      } else if (mode === 3) {
        // 饱和度提升
        let saturation = 1.0 + intensityVal * 1.5
        let gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        color.rgb = gray + (color.rgb - gray) * saturation
      } else if (mode === 4) {
        // 色彩校正
        let contrast = 1.0 + intensityVal * 0.3
        let saturation = 1.0 + intensityVal * 0.4
        let brightness = intensityVal * 0.1
        color.rgb = (color.rgb - 0.5) * contrast + 0.5
        let gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        color.rgb = gray + (color.rgb - gray) * saturation
        color.rgb = color.rgb + brightness
      } else if (mode === 5) {
        // 高对比黑白
        let gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        let contrast = 1.0 + intensityVal * 2.0
        gray = (gray - 0.5) * contrast + 0.5
        color = [gray, gray, gray, color.a]
      } else if (mode === 6) {
        // 暖色调
        let warmth = intensityVal * 0.2
        color.r = color.r + warmth
        color.b = color.b - warmth * 0.5
      } else if (mode === 7) {
        // 冷色调
        let coolness = intensityVal * 0.2
        color.b = color.b + coolness
        color.r = color.r - coolness * 0.5
      }

      // 轻微动态效果
      let dynamicBrightness = 1.0 + 0.01 * ti.sin(time * 0.001)
      color.rgb = color.rgb * dynamicBrightness

      ti.outputColor(targetTexture, color)
    }
  })
}

// 更新强度
async function updateIntensity() {
  if (intensityField) {
    await intensityField.fromArray([intensity.value])
  }
}

// 更新模式
async function setMode(index: number) {
  currentMode.value = index
  if (modeField) {
    await modeField.fromArray([index])
  }
  status.value = `已切换到: ${optimizationModes[index].name}`
}

// 开始动画
function startAnimation() {
  isAnimating.value = true
  lastFrameTime = performance.now()
  frameCount = 0

  function animate() {
    if (!isAnimating.value) return

    const currentTime = performance.now()

    // 渲染
    if (renderKernel) {
      renderKernel(currentTime)
    }

    // 显示到 canvas - 每次都创建新的 ti.Canvas
    if (ti && optimizedCanvas.value) {
      const tiCanvas = new ti.Canvas(optimizedCanvas.value)
      tiCanvas.setImage(targetTexture)
    }

    // 计算 FPS
    frameCount++
    if (currentTime - lastFrameTime >= 1000) {
      fps.value = frameCount
      frameCount = 0
      lastFrameTime = currentTime
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

// 停止动画
function stopAnimation() {
  isAnimating.value = false
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// 切换动画状态
function toggleAnimation() {
  if (isAnimating.value) {
    stopAnimation()
    status.value = '动画已暂停'
  } else {
    startAnimation()
    status.value = '动画播放中'
  }
}

// 重置图片
async function resetImage() {
  currentMode.value = 0
  intensity.value = 0.5
  await setMode(0)
  await updateIntensity()
  status.value = '已重置'
}

// 下载图片
function downloadImage() {
  if (!optimizedCanvas.value) return

  const link = document.createElement('a')
  link.download = `optimized-image-${Date.now()}.png`
  link.href = optimizedCanvas.value.toDataURL('image/png')
  link.click()

  status.value = '图片已下载'
}

// 生命周期
onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped lang="scss">
.page-content {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d30 100%);
  color: #d4d4d4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #4ec9b0;
  font-size: 36px;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #858585;
  margin-bottom: 40px;
}

.control-panel {
  background: #252526;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.control-group {
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
}

.control-label {
  display: block;
  color: #9cdcfe;
  margin-bottom: 10px;
  font-weight: 500;
}

.file-input {
  display: none;
}

.file-button {
  display: inline-block;
  padding: 12px 24px;
  background: #4ec9b0;
  color: #1e1e1e;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #3db89a;
    transform: translateY(-2px);
  }
}

.hint {
  display: block;
  color: #858585;
  font-size: 12px;
  margin-top: 5px;
}

.mode-selector {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mode-button {
  padding: 10px 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #2d2d30;
    border-color: #4ec9b0;
  }

  &.active {
    background: #4ec9b0;
    color: #1e1e1e;
    border-color: #4ec9b0;
  }
}

.sliders {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
}

.slider-item {
  margin-bottom: 15px;

  label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #d4d4d4;
  }

  .slider-value {
    color: #4ec9b0;
    font-weight: 500;
  }
}

.slider {
  width: 100%;
  height: 6px;
  background: #3d3d3d;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #4ec9b0;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }
}

.action-button {
  padding: 12px 24px;
  margin-right: 10px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid #4ec9b0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #4ec9b0;
    color: #1e1e1e;
    transform: translateY(-2px);
  }

  &.primary {
    background: #4ec9b0;
    color: #1e1e1e;

    &:hover {
      background: #3db89a;
    }
  }
}

.canvas-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(512px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.canvas-wrapper {
  background: #252526;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  canvas {
    width: 100%;
    height: auto;
    border-radius: 8px;
    background: #1e1e1e;
  }
}

.canvas-header {
  color: #9cdcfe;
  margin-bottom: 15px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fps-counter {
  background: #4ec9b0;
  color: #1e1e1e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.status-bar {
  background: #252526;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  .status-text {
    color: #d4d4d4;
  }

  .performance-info {
    color: #858585;
  }
}

.instructions {
  background: #252526;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  h2 {
    color: #4ec9b0;
    margin-bottom: 20px;
  }

  h3 {
    color: #9cdcfe;
    margin-top: 30px;
    margin-bottom: 15px;
  }

  ul {
    color: #d4d4d4;
    line-height: 1.8;
    margin-left: 20px;

    li {
      margin-bottom: 10px;
    }
  }
}

.mode-descriptions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.mode-desc {
  background: #1e1e1e;
  padding: 15px;
  border-radius: 8px;

  strong {
    color: #4ec9b0;
    display: block;
    margin-bottom: 8px;
  }

  p {
    color: #858585;
    margin: 0;
    line-height: 1.6;
  }
}
</style>
