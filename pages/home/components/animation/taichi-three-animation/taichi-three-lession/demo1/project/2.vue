<template>
  <div class="page-content">
    <div class="container">
      <h1>🎨 专业图片美化工具</h1>
      <p class="subtitle">GPU 加速 · 14 种专业滤镜 · 实时预览</p>

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
          <label class="control-label">滤镜效果（可多选）</label>
          <div class="mode-category-tabs">
            <button
              v-for="category in categories"
              :key="category"
              :class="['category-tab', { active: activeCategory === category }]"
              @click="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>
          <div class="mode-selector">
            <label
              v-for="mode in filteredModes"
              :key="mode.id"
              :class="['mode-checkbox', { checked: selectedModes.includes(mode.id) }]"
            >
              <input type="checkbox" :checked="selectedModes.includes(mode.id)" @change="toggleMode(mode.id)">
              <span>{{ mode.name }}</span>
            </label>
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

        <h3>🎨 滤镜说明</h3>
        <p style="color: #858585; margin-bottom: 20px;">
          基础: 基础图像调整 | 人像: 人像美化 | 滤镜: 风格滤镜 | 色调: 色彩风格 | 特效: 特殊效果
        </p>
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
import { ref, onUnmounted, computed } from 'vue'

const { $loadTaichi } = useNuxtApp()

// Canvas 引用
const originalCanvas = ref<HTMLCanvasElement | null>(null)
const optimizedCanvas = ref<HTMLCanvasElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 状态
const status = ref('请选择一张图片')
const isAnimating = ref(false)
const selectedModes = ref<number[]>([])
const intensity = ref(0.5)
const fps = ref(0)
const activeCategory = ref('基础')

// 分类
const categories = ['基础', '人像', '滤镜', '色调', '特效']

// 过滤后的模式
const filteredModes = computed(() => {
  return optimizationModes.filter(m => m.category === activeCategory.value)
})

// 性能信息
const performanceInfo = ref('')

// 优化模式
const optimizationModes = [
  {
    name: '锐化',
    description: '增强边缘清晰度，使图片更清晰锐利',
    id: 0,
    category: '基础'
  },
  {
    name: '磨皮',
    description: '平滑皮肤，去除瑕疵，美颜效果',
    id: 1,
    category: '人像'
  },
  {
    name: '美白',
    description: '提亮肤色，使皮肤更加白皙',
    id: 2,
    category: '人像'
  },
  {
    name: '对比度',
    description: '提升明暗对比，使图片更有层次感',
    id: 3,
    category: '基础'
  },
  {
    name: '饱和度',
    description: '增强色彩鲜艳度，使图片更生动',
    id: 4,
    category: '基础'
  },
  {
    name: '胶片',
    description: '复古胶片质感，怀旧风格',
    id: 5,
    category: '滤镜'
  },
  {
    name: '黑白电影',
    description: '经典黑白高对比度，电影质感',
    id: 6,
    category: '滤镜'
  },
  {
    name: '暖阳',
    description: '温暖阳光色调，温馨氛围',
    id: 7,
    category: '色调'
  },
  {
    name: '清凉',
    description: '清冷蓝色调，清爽舒适',
    id: 8,
    category: '色调'
  },
  {
    name: '暗角',
    description: '边缘渐暗，聚焦中心主体',
    id: 9,
    category: '特效'
  },
  {
    name: '梦幻光晕',
    description: '柔光晕影，梦幻朦胧效果',
    id: 10,
    category: '特效'
  },
  {
    name: '赛博朋克',
    description: '霓虹色彩，未来科技感',
    id: 11,
    category: '滤镜'
  },
  {
    name: '复古黄',
    description: '复古黄色调，老照片质感',
    id: 12,
    category: '色调'
  },
  {
    name: '蓝调',
    description: '忧郁蓝调，文艺风格',
    id: 13,
    category: '色调'
  }
]

let ti: any = null
let texture: any = null
let targetTexture: any = null
let vertices: any = null
let indices: any = null
let intensityField: any = null
let modesField: any = null
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

    // 多选模式字段 - 用布尔数组表示哪些模式被选中
    modesField = ti.field(ti.i32, [14])
    const modesArray = new Array(14).fill(0)
    selectedModes.value.forEach(id => {
      if (id >= 0 && id < 14) modesArray[id] = 1
    })
    await modesField.fromArray(modesArray)

    // 添加到 kernel scope
    ti.addToKernelScope({
      texture,
      targetTexture,
      vertices,
      indices,
      intensityField,
      modesField,
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

      let intensityVal = intensityField[0]

      // 获取选中的模式列表
      let mode0 = modesField[0]
      let mode1 = modesField[1]
      let mode2 = modesField[2]
      let mode3 = modesField[3]
      let mode4 = modesField[4]
      let mode5 = modesField[5]
      let mode6 = modesField[6]
      let mode7 = modesField[7]
      let mode8 = modesField[8]
      let mode9 = modesField[9]
      let mode10 = modesField[10]
      let mode11 = modesField[11]
      let mode12 = modesField[12]
      let mode13 = modesField[13]

      // 锐化滤镜
      if (mode0 === 1) {
        let offset = 1.0 / IMAGE_SIZE
        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])
        let sharp = center * 5.0 - (up + down + left + right)
        let strength = intensityVal * 0.5
        color = center * (1.0 - strength) + sharp * strength
      }

      // 磨皮 - 简化版，只采样4个方向
      if (mode1 === 1) {
        let blurRadius = 2.0 / IMAGE_SIZE

        let up = ti.textureSample(texture, [uv.x, uv.y - blurRadius])
        let down = ti.textureSample(texture, [uv.x, uv.y + blurRadius])
        let left = ti.textureSample(texture, [uv.x - blurRadius, uv.y])
        let right = ti.textureSample(texture, [uv.x + blurRadius, uv.y])
        let center = color

        let blurredR = (center.r + up.r + down.r + left.r + right.r) / 5.0
        let blurredG = (center.g + up.g + down.g + left.g + right.g) / 5.0
        let blurredB = (center.b + up.b + down.b + left.b + right.b) / 5.0

        let mixStrength = intensityVal * 0.5
        color.r = center.r * (1.0 - mixStrength) + blurredR * mixStrength
        color.g = center.g * (1.0 - mixStrength) + blurredG * mixStrength
        color.b = center.b * (1.0 - mixStrength) + blurredB * mixStrength
      }

      // 美白
      if (mode2 === 1) {
        let whiten = intensityVal * 0.3
        color.r = color.r + whiten
        color.g = color.g + whiten
        color.b = color.b + whiten
        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 对比度增强
      if (mode3 === 1) {
        let contrast = 1.0 + intensityVal * 1.0
        color.r = (color.r - 0.5) * contrast + 0.5
        color.g = (color.g - 0.5) * contrast + 0.5
        color.b = (color.b - 0.5) * contrast + 0.5
      }

      // 饱和度提升
      if (mode4 === 1) {
        let saturation = 1.0 + intensityVal * 1.5
        let gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        color.r = gray + (color.r - gray) * saturation
        color.g = gray + (color.g - gray) * saturation
        color.b = gray + (color.b - gray) * saturation
      }

      // 胶片滤镜 - 复古怀旧
      if (mode5 === 1) {
        let sepia = [1.2, 1.0, 0.8]
        color.r = color.r * sepia[0]
        color.g = color.g * sepia[1]
        color.b = color.b * sepia[2]

        let vignetteStrength = intensityVal * 0.3
        let centerDist = ti.sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5))
        let vignette = 1.0 - vignetteStrength * centerDist
        color.r = color.r * vignette
        color.g = color.g * vignette
        color.b = color.b * vignette
      }

      // 黑白电影
      if (mode6 === 1) {
        let gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        let contrast = 1.0 + intensityVal * 1.5
        gray = (gray - 0.5) * contrast + 0.5
        color = [gray, gray, gray, color.a]
      }

      // 暖阳色调
      if (mode7 === 1) {
        let warmth = intensityVal * 0.3
        color.r = color.r + warmth * 0.2
        color.g = color.g + warmth * 0.1
        color.b = color.b - warmth * 0.1
        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 清凉蓝调
      if (mode8 === 1) {
        let coolness = intensityVal * 0.3
        color.b = color.b + coolness * 0.2
        color.r = color.r - coolness * 0.1
        color.g = color.g + coolness * 0.05
        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 暗角效果
      if (mode9 === 1) {
        let vignetteStrength = intensityVal * 0.6
        let centerDist = ti.sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5))
        let vignette = 1.0 - vignetteStrength * centerDist * 2.0
        color.r = color.r * vignette
        color.g = color.g * vignette
        color.b = color.b * vignette
      }

      // 梦幻光晕
      if (mode10 === 1) {
        let glow = intensityVal * 0.3
        let centerDist = ti.sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5))
        let glowAmount = glow * (1.0 - centerDist * 1.5)
        color.r = color.r + glowAmount * 0.15
        color.g = color.g + glowAmount * 0.2
        color.b = color.b + glowAmount * 0.1
        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 赛博朋克 - 霓虹色彩
      if (mode11 === 1) {
        let neonStrength = intensityVal * 0.4

        let bright = ti.max(color.r, ti.max(color.g, color.b))
        if (bright > 0.5) {
          color.r = color.r * (1.0 + neonStrength * 0.3)
          color.g = color.g * (1.0 - neonStrength * 0.2)
          color.b = color.b * (1.0 + neonStrength * 0.5)
        }

        let cyanBlue = [0.0, 0.2, 0.4]
        color.r = color.r * (1.0 - neonStrength * 0.2) + cyanBlue[0] * neonStrength * 0.3
        color.g = color.g * (1.0 - neonStrength * 0.1) + cyanBlue[1] * neonStrength * 0.2
        color.b = color.b * (1.0 - neonStrength * 0.1) + cyanBlue[2] * neonStrength * 0.4

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 复古黄
      if (mode12 === 1) {
        let vintage = intensityVal * 0.4
        let yellowTint = [1.2, 1.1, 0.8]
        color.r = color.r * yellowTint[0]
        color.g = color.g * yellowTint[1]
        color.b = color.b * yellowTint[2]
      }

      // 蓝调
      if (mode13 === 1) {
        let blueStrength = intensityVal * 0.35
        color.b = color.b * (1.0 + blueStrength * 0.4)
        color.r = color.r * (1.0 - blueStrength * 0.2)
        color.g = color.g * (1.0 - blueStrength * 0.1)

        let darkness = 0.05 * blueStrength
        color.r = color.r - darkness
        color.g = color.g - darkness
        color.b = color.b - darkness * 0.5

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 轻微动态效果
      let dynamicBrightness = 1.0 + 0.005 * ti.sin(time * 0.001)
      color.r = color.r * dynamicBrightness
      color.g = color.g * dynamicBrightness
      color.b = color.b * dynamicBrightness

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

// 切换模式（多选）
async function toggleMode(modeId: number) {
  const index = selectedModes.value.indexOf(modeId)
  if (index === -1) {
    selectedModes.value.push(modeId)
  } else {
    selectedModes.value.splice(index, 1)
  }

  // 更新 modesField
  const modesArray = new Array(14).fill(0)
  selectedModes.value.forEach(id => {
    if (id >= 0 && id < 14) modesArray[id] = 1
  })

  if (modesField) {
    await modesField.fromArray(modesArray)
  }

  const selectedNames = selectedModes.value.map(id => optimizationModes[id].name).join('、')
  status.value = selectedModes.value.length > 0
    ? `已选中: ${selectedNames}`
    : '请选择优化模式'
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
  selectedModes.value = []
  intensity.value = 0.5
  await toggleMode(-1) // 初始化空数组
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

.mode-category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 8px 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

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

.mode-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  min-height: 150px;
}

.mode-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;

  input[type="checkbox"] {
    display: none;
  }

  span {
    flex: 1;
    text-align: center;
  }

  &:hover {
    background: #2d2d30;
    border-color: #4ec9b0;
  }

  &.checked {
    background: #4ec9b0;
    color: #1e1e1e;
    border-color: #4ec9b0;

    &::before {
      content: '✓';
      margin-right: 4px;
    }
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
  gap: 15px;
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
