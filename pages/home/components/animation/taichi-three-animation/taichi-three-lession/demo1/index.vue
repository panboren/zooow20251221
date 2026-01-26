<template>
  <div class="page-content">
    <div class="container">
      <h1>🎨 专业图片美化工具</h1>
      <p class="subtitle">GPU 加速 · 21 种顶级滤镜 · 好莱坞算法</p>

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
                <span>曝光</span>
                <span class="slider-value">{{ (exposure * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="exposure"
                min="0"
                max="2"
                step="0.01"
                class="slider"
                @input="updateBasicParams"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>对比度</span>
                <span class="slider-value">{{ (contrast * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="contrast"
                min="0"
                max="2"
                step="0.01"
                class="slider"
                @input="updateBasicParams"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>饱和度</span>
                <span class="slider-value">{{ (saturation * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="saturation"
                min="0"
                max="2"
                step="0.01"
                class="slider"
                @input="updateBasicParams"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>滤镜强度</span>
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
          <label class="control-label">控制</label>
          <div class="control-buttons">
            <button :class="['action-button', { primary: isAnimating }]" @click="toggleAnimation">
              {{ isAnimating ? '⏸ 暂停' : '▶ 播放' }}
            </button>
            <button :class="['action-button', { active: showCompare }]" @click="toggleCompareMode">
              {{ showCompare ? '👁️ 原图' : '👁️ 对比' }}
            </button>
            <button :class="['action-button']" @click="toggleSplitCompare" :disabled="!originalImageLoaded">
              {{ showSplitCompare ? '🔄 滑块对比' : '↔️ 滑块对比' }}
            </button>
            <label class="toggle-button">
              <input type="checkbox" v-model="realtimePreview">
              <span>⚡ 实时预览</span>
            </label>
          </div>
        </div>

        <!-- AI 人脸美化控制面板 -->
        <div class="control-group ai-panel" v-if="activeCategory === 'AI 智能增强'">
          <label class="control-label">
            🤖 AI 人脸美化
            <span class="model-status" :class="{ loaded: aiModelLoaded, loading: aiModelLoading, error: aiModelError }">
              {{ aiModelLoading ? '加载中...' : aiModelLoaded ? '✓ 模型就绪' : aiModelError ? '❌ 加载失败' : '未加载' }}
            </span>
          </label>

          <!-- 错误提示和重试按钮 -->
          <div v-if="aiModelError" class="ai-error-message">
            <p>⚠️ 模型加载失败，可能是网络问题</p>
            <p class="error-detail">系统已尝试轻量级和完整版模型，都未能成功加载</p>
            <button class="retry-button" @click="retryLoadAIModel" :disabled="aiModelLoading">
              {{ aiModelLoading ? '重试中...' : '🔄 重新加载模型' }}
            </button>
            <div class="error-tips">
              <p class="tip-title">💡 解决方案：</p>
              <ul>
                <li><strong>使用 VPN</strong>：推荐香港、日本等节点（最有效）</li>
                <li><strong>更换网络</strong>：尝试使用手机热点或公司网络</li>
                <li><strong>时间选择</strong>：在凌晨或网络通畅时段重试</li>
                <li><strong>清除缓存</strong>：清除浏览器缓存后重试</li>
                <li><strong>防火墙设置</strong>：确保允许访问 jsdelivr.net</li>
                <li><strong>使用有线网络</strong>：用网线代替 Wi-Fi 更稳定</li>
              </ul>
            </div>
          </div>

          <div class="ai-controls" v-else>
            <div class="slider-item">
              <label>
                <span>磨皮</span>
                <span class="slider-value">{{ (aiSmoothness * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="aiSmoothness"
                min="0"
                max="1"
                step="0.05"
                class="slider"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>美白</span>
                <span class="slider-value">{{ (aiWhitening * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="aiWhitening"
                min="0"
                max="1"
                step="0.05"
                class="slider"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>大眼</span>
                <span class="slider-value">{{ (aiEyeEnlarge * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="aiEyeEnlarge"
                min="0"
                max="1"
                step="0.05"
                class="slider"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>瘦脸</span>
                <span class="slider-value">{{ (aiFaceSlim * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="aiFaceSlim"
                min="0"
                max="1"
                step="0.05"
                class="slider"
              >
            </div>
            <div class="slider-item">
              <label>
                <span>整体强度</span>
                <span class="slider-value">{{ (aiIntensity * 100).toFixed(0) }}%</span>
              </label>
              <input
                type="range"
                v-model.number="aiIntensity"
                min="0"
                max="1"
                step="0.1"
                class="slider"
              >
            </div>
            <button
              class="action-button ai-button"
              @click="applyAIFaceBeautify"
              :disabled="isProcessingAI || !originalImageLoaded"
            >
              {{ isProcessingAI ? '⏳ 处理中...' : '✨ 应用 AI 美化' }}
            </button>
            <button
              class="action-button test-button"
              @click="testFaceDetection"
              :disabled="!originalImageLoaded || aiModelLoading"
            >
              🔍 测试人脸检测
            </button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">预设</label>
          <div class="preset-controls">
            <input
              type="text"
              v-model="currentPresetName"
              placeholder="预设名称"
              class="preset-input"
            >
            <button class="action-button" @click="savePreset" :disabled="!currentPresetName.trim()">
              💾 保存
            </button>
            <select v-model="selectedPresetIndex" @change="loadPreset" class="preset-select">
              <option value="">选择预设...</option>
              <option v-for="(preset, idx) in presets" :key="idx" :value="idx">
                {{ preset.name }}
              </option>
            </select>
            <button
              class="action-button danger"
              @click="deletePreset"
              v-if="selectedPresetIndex !== ''"
            >
              🗑️ 删除
            </button>
          </div>
        </div>

        <div class="control-group">
          <div class="undo-redo-buttons">
            <button class="action-button" @click="undo" :disabled="!canUndo">
              ↩️ 撤销
            </button>
            <button class="action-button" @click="redo" :disabled="!canRedo">
              ↪️ 重做
            </button>
          </div>
          <button class="action-button primary" @click="downloadImage">
            📥 下载图片
          </button>
          <button class="action-button" @click="resetImage">
            ↺ 重置
          </button>
        </div>
      </div>

      <!-- 画布区域 -->
      <div
        class="canvas-container"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        :class="{ 'drag-over': isDragging }"
      >
        <!-- 原图显示（仅在非滑块对比模式下显示） -->
        <div class="canvas-wrapper" v-if="!showSplitCompare">
          <div class="canvas-header">原图</div>
          <canvas ref="originalCanvas" :width="imageWidth" :height="imageHeight"></canvas>
        </div>
        <!-- 优化后显示（仅在非滑块对比模式下显示） -->
        <div class="canvas-wrapper" v-if="!showSplitCompare">
          <div class="canvas-header">
            {{ showCompare ? '原图对比' : '优化后' }}
            <span class="fps-counter" v-if="isAnimating">{{ fps }} FPS</span>
          </div>
          <canvas ref="optimizedCanvas" :width="imageWidth" :height="imageHeight"></canvas>
        </div>

        <!-- 滑块对比模式 -->
        <div class="canvas-wrapper split-compare" v-if="showSplitCompare">
          <div class="canvas-header">滑块对比 (拖动滑块对比原图和效果)</div>
          <div class="split-container" ref="splitContainer" @mousemove="onSplitDrag" @touchmove="onSplitDrag">
            <canvas ref="originalCanvas" :width="imageWidth" :height="imageHeight" class="split-canvas"></canvas>
            <canvas ref="optimizedCanvas" :width="imageWidth" :height="imageHeight" class="split-canvas split-overlay"></canvas>
            <div class="split-slider" :style="{ left: splitPosition + '%' }">
              <div class="split-handle"></div>
            </div>
          </div>
        </div>

        <!-- 拖拽提示 -->
        <div v-if="isDragging" class="drag-overlay">
          <div class="drag-message">
            📁 释放鼠标上传图片
          </div>
        </div>
      </div>

      <!-- 直方图 -->
      <div class="histogram-container" v-if="originalImageLoaded">
        <div class="histogram-wrapper">
          <div class="histogram-header">RGB 直方图</div>
          <canvas ref="histogramCanvas" width="800" height="200" class="histogram-canvas"></canvas>
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
          <li><strong>上传图片</strong>: 点击"选择图片"按钮或直接拖拽图片到画布区域</li>
          <li><strong>滤镜选择</strong>: 在不同分类下选择滤镜效果,支持多选叠加</li>
          <li><strong>参数调整</strong>: 调整强度滑块控制滤镜效果程度</li>
          <li><strong>实时预览</strong>: 开启/关闭实时预览模式,关闭后仅手动触发渲染以节省性能</li>
          <li><strong>对比功能</strong>: 点击"对比"按钮在原图和优化效果间切换</li>
          <li><strong>预设管理</strong>: 保存常用滤镜组合为预设,快速加载</li>
          <li><strong>导出图片</strong>: 点击"下载图片"保存优化后的图片到本地</li>
          <li><strong>GPU加速</strong>: 所有优化在GPU上实时处理,性能优异</li>
        </ul>

        <h3>🎨 滤镜说明</h3>
        <p style="color: #858585; margin-bottom: 20px;">
          基础: 基础图像调整 | 人像: 人像美化 | 滤镜: 风格滤镜 | 色调: 色彩风格 | 特效: 特殊效果 | 高级: 专业级算法
        </p>

        <h3>⚡ 性能优化提示</h3>
        <p style="color: #858585; margin-bottom: 20px;">
          • 关闭"实时预览"可显著降低CPU/GPU占用,仅在参数调整时渲染<br>
          • 多滤镜叠加时建议先单独测试每个滤镜效果<br>
          • 导出图片时会自动渲染当前设置的最高质量版本
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
import { ref, onUnmounted, computed, onMounted, watch } from 'vue'
import { getFaceBeautifier, type FaceBeautifyParams } from '~/composables/useAIEnhance'

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

// 基础调整参数
const exposure = ref(1.0) // 曝光
const contrast = ref(1.0) // 对比度
const saturation = ref(1.0) // 饱和度

// 新增状态
const showCompare = ref(false)  // 对比模式
const showSplitCompare = ref(false) // 滑块对比模式
const realtimePreview = ref(true) // 实时预览
const presets = ref<Array<{ name: string; modes: number[]; intensity: number; exposure?: number; contrast?: number; saturation?: number }>>([]) // 预设列表
const currentPresetName = ref('') // 当前预设名称

// AI 人脸美化状态
const aiModelLoading = ref(false)
const aiModelLoaded = ref(false)
const aiModelError = ref(false)     // 模型加载是否出错
const aiSmoothness = ref(0.5)      // 磨皮程度
const aiWhitening = ref(0.4)       // 美白程度
const aiEyeEnlarge = ref(0.4)      // 大眼程度
const aiFaceSlim = ref(0.35)       // 瘦脸程度
const aiIntensity = ref(1.0)       // 整体强度
const isProcessingAI = ref(false)  // AI 处理中

// 人脸美化器实例
let faceBeautifier: ReturnType<typeof getFaceBeautifier> | null = null

// 撤销/重做
const historyStack = ref<any[]>([])
const historyIndex = ref(-1)
const maxHistorySize = 50

// 图片尺寸
const imageWidth = ref(512)
const imageHeight = ref(512)
const originalImageLoaded = ref(false)

// 滑块对比
const splitPosition = ref(50)
const splitContainer = ref<HTMLElement | null>(null)

// 常量
const MAX_MODES = 31

// 分类
const categories = ['基础', '人像', '高级', '滤镜', '色调', '特效', 'AI 智能增强']

// 过滤后的模式
const filteredModes = computed(() => {
  return optimizationModes.filter(m => m.category === activeCategory.value)
})

// 撤销/重做计算属性
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1)

// 获取当前状态快照
function getCurrentState() {
  return {
    selectedModes: [...selectedModes.value],
    intensity: intensity.value,
    exposure: exposure.value,
    contrast: contrast.value,
    saturation: saturation.value
  }
}

// 应用状态快照
async function applyState(state: any) {
  selectedModes.value = [...state.selectedModes]
  intensity.value = state.intensity
  exposure.value = state.exposure
  contrast.value = state.contrast
  saturation.value = state.saturation

  await updateModesField()
  await updateIntensity()
  await updateBasicParams()

  status.value = '已恢复状态'
}

// 更新 modesField 的辅助函数
async function updateModesField() {
  if (!modesField) {
    console.warn('⚠️ modesField 未初始化，跳过更新')
    return
  }

  const modesArray = new Array(MAX_MODES).fill(0)
  selectedModes.value.forEach(id => {
    if (id >= 0 && id < MAX_MODES) modesArray[id] = 1
  })

  const activeIndices = modesArray
    .map((val, idx) => val === 1 ? idx : -1)
    .filter(idx => idx !== -1)

  console.log('=== 更新 modesField ===')
  console.log('selectedModes:', selectedModes.value)
  console.log('modesArray (长度:', MAX_MODES, '):', modesArray)
  console.log('激活的索引:', activeIndices)
  console.log('激活的滤镜:', activeIndices.map(id => optimizationModes[id]?.name || `ID:${id}`))
  console.log('======================')

  await modesField.fromArray(modesArray)

  // 确保 modesField 在 kernel scope 中是更新的
  if (ti) {
    ti.addToKernelScope({ modesField })
  }
}

// 更新基础参数（曝光、对比度、饱和度）
async function updateBasicParams() {
  if (!ti) return

  if (exposureField) {
    await exposureField.fromArray([exposure.value])
    ti.addToKernelScope({ exposureField })
  }

  if (contrastField) {
    await contrastField.fromArray([contrast.value])
    ti.addToKernelScope({ contrastField })
  }

  if (saturationField) {
    await saturationField.fromArray([saturation.value])
    ti.addToKernelScope({ saturationField })
  }

  triggerRender()
}

// 保存历史记录
function saveHistory() {
  const state = getCurrentState()

  // 如果当前位置不在栈顶，删除后面的记录
  if (historyIndex.value < historyStack.value.length - 1) {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  }

  historyStack.value.push(state)

  // 限制历史记录大小
  if (historyStack.value.length > maxHistorySize) {
    historyStack.value.shift()
  } else {
    historyIndex.value++
  }

  console.log('保存历史记录，当前索引:', historyIndex.value)
}

// 撤销
async function undo() {
  if (!canUndo.value) return

  historyIndex.value--
  const state = historyStack.value[historyIndex.value]
  await applyState(state)

  console.log('撤销，当前索引:', historyIndex.value)
}

// 重做
async function redo() {
  if (!canRedo.value) return

  historyIndex.value++
  const state = historyStack.value[historyIndex.value]
  await applyState(state)

  console.log('重做，当前索引:', historyIndex.value)
}

// 手动触发渲染
function triggerRender() {
  if (renderKernel && !realtimePreview.value && !isAnimating.value) {
    renderKernel(performance.now())
    // 确保 tiCanvas 已初始化
    if (!tiCanvas && ti && optimizedCanvas.value) {
      tiCanvas = new ti.Canvas(optimizedCanvas.value)
    }
    if (tiCanvas && targetTexture) {
      tiCanvas.setImage(targetTexture)
    }
  }
}

// 监听 showCompare 变化
watch(showCompare, async (newValue) => {
  if (ti) {
    ti.addToKernelScope({ showCompare: newValue ? 1.0 : 0.0 })
  }
  triggerRender()
})

// 监听基础参数变化，保存历史记录
watch([exposure, contrast, saturation], () => {
  saveHistory()
  setTimeout(updateHistogram, 100)
}, { deep: true })

// 监听 intensity 变化
watch(intensity, () => {
  saveHistory()
})

// 切换对比模式
function toggleCompareMode() {
  showCompare.value = !showCompare.value
  showSplitCompare.value = false
}

// 切换滑块对比模式
async function toggleSplitCompare() {
  showSplitCompare.value = !showSplitCompare.value
  showCompare.value = false

  if (showSplitCompare.value) {
    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 100))
    updateSplitCanvas()
  }
}

// 更新滑块对比画布
function updateSplitCanvas() {
  const originalCanvasEl = originalCanvas.value
  const optimizedCanvasEl = optimizedCanvas.value

  if (!originalCanvasEl || !optimizedCanvasEl) return

  const ctxOriginal = originalCanvasEl.getContext('2d')
  const ctxOptimized = optimizedCanvasEl.getContext('2d')

  if (!ctxOriginal || !ctxOptimized) return

  // 设置优化画布的裁剪
  const optimizedCtx = optimizedCanvasEl.getContext('2d')
  if (!optimizedCtx) return

  const width = originalCanvasEl.width
  const height = originalCanvasEl.height
  const splitX = (splitPosition.value / 100) * width

  // 创建临时画布来存储原图数据
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  // 复制原图到临时画布
  tempCtx.drawImage(originalCanvasEl, 0, 0)

  // 清空优化画布
  optimizedCtx.clearRect(0, 0, width, height)

  // 绘制原图到左侧
  optimizedCtx.drawImage(originalCanvasEl, 0, 0, splitX, height, 0, 0, splitX, height)

  // 绘制优化后的到右侧（从 splitX 开始）
  const imageData = optimizedCanvasEl.toDataURL()
  const img = new Image()
  img.onload = () => {
    optimizedCtx.drawImage(img, splitX, 0, width - splitX, height, splitX, 0, width - splitX, height)
  }
  img.src = imageData
}

// 滑块拖动事件
function onSplitDrag(event: MouseEvent | TouchEvent) {
  if (!showSplitCompare.value || !splitContainer.value) return

  const rect = splitContainer.value.getBoundingClientRect()
  let clientX: number

  if ('touches' in event) {
    clientX = event.touches[0].clientX
  } else {
    clientX = event.clientX
  }

  const x = clientX - rect.left
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
  splitPosition.value = percentage

  // 使用 requestAnimationFrame 优化性能
  requestAnimationFrame(updateSplitCanvas)
}

// 性能信息
const performanceInfo = ref('')
const histogramCanvas = ref<HTMLCanvasElement | null>(null)

// 优化模式
const optimizationModes = [
  {
    name: '锐化',
    description: '增强边缘清晰度，使图片更清晰锐利',
    id: 0,
    category: '基础'
  },
  {
    name: '双边磨皮',
    description: '高级磨皮算法，平滑皮肤同时保留边缘细节',
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
    name: 'USM锐化',
    description: 'Photoshop级别锐化，精确控制细节',
    id: 3,
    category: '高级'
  },
  {
    name: 'HDR效果',
    description: '局部对比度增强，电影级HDR质感',
    id: 4,
    category: '高级'
  },
  {
    name: '色调映射',
    description: 'ACES电影色调映射，好莱坞级别',
    id: 5,
    category: '高级'
  },
  {
    name: '电影色调',
    description: 'Teal&Orange色调，经典电影配色',
    id: 6,
    category: '高级'
  },
  {
    name: '胶片',
    description: '复古胶片质感，怀旧风格',
    id: 7,
    category: '滤镜'
  },
  {
    name: '黑白电影',
    description: '经典黑白高对比度，电影质感',
    id: 8,
    category: '滤镜'
  },
  {
    name: '暖阳',
    description: '温暖阳光色调，温馨氛围',
    id: 9,
    category: '色调'
  },
  {
    name: '清凉',
    description: '清冷蓝色调，清爽舒适',
    id: 10,
    category: '色调'
  },
  {
    name: '暗角',
    description: '边缘渐暗，聚焦中心主体',
    id: 11,
    category: '特效'
  },
  {
    name: '镜头光晕',
    description: '模拟镜头光晕，电影级光效',
    id: 12,
    category: '特效'
  },
  {
    name: '边缘发光',
    description: '检测边缘并添加发光，赛博朋克风格',
    id: 13,
    category: '特效'
  },
  {
    name: '色散',
    description: '镜头色差失真，电影镜头感',
    id: 14,
    category: '特效'
  },
  {
    name: '赛博朋克',
    description: '霓虹色彩，未来科技感',
    id: 15,
    category: '滤镜'
  },
  {
    name: '复古黄',
    description: '复古黄色调，老照片质感',
    id: 16,
    category: '色调'
  },
  {
    name: '蓝调',
    description: '忧郁蓝调，文艺风格',
    id: 17,
    category: '色调'
  },
  {
    name: '高光增强',
    description: '提升高光细节，增加立体感',
    id: 18,
    category: '高级'
  },
  {
    name: '阴影提亮',
    description: '提亮暗部细节，保留层次',
    id: 19,
    category: '高级'
  },
  {
    name: '降噪',
    description: '智能降噪，去除噪点保留细节',
    id: 20,
    category: '高级'
  },
  {
    name: '导向滤波',
    description: '比双边滤波更快更精细的保边滤波',
    id: 21,
    category: '高级'
  },
  {
    name: '肤色保护',
    description: 'YCbCr肤色检测，保护自然肤色',
    id: 22,
    category: '人像'
  },
  {
    name: '局部白平衡',
    description: '多区域智能色彩校正',
    id: 23,
    category: '高级'
  },
  {
    name: '暗部修复',
    description: 'AI级暗部细节智能恢复',
    id: 24,
    category: '高级'
  },
  {
    name: '纹理增强',
    description: '强化皮肤质感，保留自然细节',
    id: 25,
    category: '人像'
  },
  {
    name: '景深虚化',
    description: '模拟大光圈镜头，突出主体',
    id: 26,
    category: '特效'
  },
  {
    name: '镜头校正',
    description: '修复广角畸变，还原真实比例',
    id: 27,
    category: '高级'
  },
  {
    name: '光晕去除',
    description: '逆光拍摄优化，恢复细节',
    id: 28,
    category: '高级'
  },
  {
    name: '动态对比度',
    description: '自适应对比度，增强层次感',
    id: 29,
    category: '高级'
  },
  {
    name: '🤖 AI 人脸美化',
    description: 'AI 智能检测人脸，自动磨皮美白大眼瘦脸',
    id: 30,
    category: 'AI 智能增强'
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
let exposureField: any = null
let contrastField: any = null
let saturationField: any = null

let animationId: number | null = null
let lastFrameTime = 0
let frameCount = 0
let tiCanvas: any = null // 复用的 Canvas 对象
let histogramUpdateFrame = 0 // 控制直方图更新频率

const selectedPresetIndex = ref<number | string>('')
const isDragging = ref(false) // 拖拽状态

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

  handleFile(file)
}

// 创建纹理
async function createTexture(img: HTMLImageElement) {
  try {
    if (!ti) {
      await initTaichi()
    }

    status.value = '正在创建纹理...'

    // 计算图片尺寸（限制最大边长为 1024）
    const maxSize = 1024
    let width = img.width
    let height = img.height

    if (width > maxSize || height > maxSize) {
      const scale = maxSize / Math.max(width, height)
      width = Math.floor(width * scale)
      height = Math.floor(height * scale)
    }

    imageWidth.value = width
    imageHeight.value = height

    performanceInfo.value = `纹理: ${width}x${height} | 格式: RGBA`

    // 创建 ImageBitmap
    const bitmap = await createImageBitmap(img, { resizeWidth: width, resizeHeight: height })

    // 创建纹理
    texture = await ti.Texture.createFromBitmap(bitmap)
    targetTexture = ti.texture(4, [width, height])

    // 顶点数据
    vertices = ti.field(ti.types.vector(ti.f32, 2), 4)
    await vertices.fromArray([[-1.0, -1.0], [1.0, -1.0], [-1.0, 1.0], [1.0, 1.0]])

    indices = ti.field(ti.i32, 6)
    await indices.fromArray([0, 1, 2, 2, 1, 3])

    // 参数字段
    intensityField = ti.field(ti.f32, [1])
    await intensityField.fromArray([intensity.value])

    // 基础参数字段
    exposureField = ti.field(ti.f32, [1])
    await exposureField.fromArray([exposure.value])

    contrastField = ti.field(ti.f32, [1])
    await contrastField.fromArray([contrast.value])

    saturationField = ti.field(ti.f32, [1])
    await saturationField.fromArray([saturation.value])

    // 多选模式字段 - 用布尔数组表示哪些模式被选中
    modesField = ti.field(ti.i32, [MAX_MODES])
    const modesArray = new Array(MAX_MODES).fill(0)
    selectedModes.value.forEach(id => {
      if (id >= 0 && id < MAX_MODES) modesArray[id] = 1
    })

    console.log('创建纹理时 selectedModes:', selectedModes.value)
    console.log('创建纹理时 modesArray:', modesArray)

    await modesField.fromArray(modesArray)

    // 添加到 kernel scope
    ti.addToKernelScope({
      texture,
      targetTexture,
      vertices,
      indices,
      intensityField,
      exposureField,
      contrastField,
      saturationField,
      modesField,
      imageWidth: width as any,
      imageHeight: height as any,
      showCompare: showCompare.value ? 1.0 : 0.0
    })

    // 创建渲染 kernel
    createRenderKernel()

    status.value = '图片加载成功！'

    // 开始动画
    if (!isAnimating.value) {
      startAnimation()
    }

    // 确保应用当前的滤镜效果
    triggerRender()

    // 绘制直方图
    updateHistogram()

    // 保存初始状态到历史记录
    saveHistory()
    originalImageLoaded.value = true
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

      // 基础参数调整（曝光、对比度、饱和度）
      let exposureVal = exposureField[0]
      let contrastVal = contrastField[0]
      let saturationVal = saturationField[0]

      // 曝光调整
      color.r = color.r * exposureVal
      color.g = color.g * exposureVal
      color.b = color.b * exposureVal

      // 对比度调整
      color.r = (color.r - 0.5) * contrastVal + 0.5
      color.g = (color.g - 0.5) * contrastVal + 0.5
      color.b = (color.b - 0.5) * contrastVal + 0.5

      // 钳制范围
      if (color.r < 0.0) color.r = 0.0
      if (color.g < 0.0) color.g = 0.0
      if (color.b < 0.0) color.b = 0.0
      if (color.r > 1.0) color.r = 1.0
      if (color.g > 1.0) color.g = 1.0
      if (color.b > 1.0) color.b = 1.0

      // 饱和度调整
      let gray = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
      color.r = gray + (color.r - gray) * saturationVal
      color.g = gray + (color.g - gray) * saturationVal
      color.b = gray + (color.b - gray) * saturationVal

      // 钳制范围
      if (color.r < 0.0) color.r = 0.0
      if (color.g < 0.0) color.g = 0.0
      if (color.b < 0.0) color.b = 0.0
      if (color.r > 1.0) color.r = 1.0
      if (color.g > 1.0) color.g = 1.0
      if (color.b > 1.0) color.b = 1.0

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
      let mode14 = modesField[14]
      let mode15 = modesField[15]
      let mode16 = modesField[16]
      let mode17 = modesField[17]
      let mode18 = modesField[18]
      let mode19 = modesField[19]
      let mode20 = modesField[20]
      let mode21 = modesField[21]
      let mode22 = modesField[22]
      let mode23 = modesField[23]
      let mode24 = modesField[24]
      let mode25 = modesField[25]
      let mode26 = modesField[26]
      let mode27 = modesField[27]
      let mode28 = modesField[28]
      let mode29 = modesField[29]

      // 对比模式: 跳过所有滤镜处理
      let isCompareMode = showCompare > 0.5

      // 锐化滤镜 - 画质增强（细节+对比度+动态范围）
      if (mode0 === 1 && !isCompareMode) {
        let offset = 1.0 / imageWidth

        // 获取邻域像素
        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])

        // 拉普拉斯锐化 - 增强细节
        let laplacian = center * 4.0 - (up + down + left + right)

        // 计算边缘强度（局部方差）
        let meanR: f32 = (center.r + up.r + down.r + left.r + right.r) / 5.0
        let meanG: f32 = (center.g + up.g + down.g + left.g + right.g) / 5.0
        let meanB: f32 = (center.b + up.b + down.b + left.b + right.b) / 5.0

        let variance: f32 = (center.r - meanR) * (center.r - meanR)
        variance = variance + (up.r - meanR) * (up.r - meanR)
        variance = variance + (down.r - meanR) * (down.r - meanR)
        variance = variance + (left.r - meanR) * (left.r - meanR)
        variance = variance + (right.r - meanR) * (right.r - meanR)
        variance = variance / 5.0

        // 细节增强因子（基于局部方差）
        let detailStrength: f32 = intensityVal * 0.8 * (variance / (variance + 0.01))

        // 应用细节增强
        let enhancedR: f32 = color.r + laplacian.r * detailStrength
        let enhancedG: f32 = color.g + laplacian.g * detailStrength
        let enhancedB: f32 = color.b + laplacian.b * detailStrength

        // 局部对比度增强（自适应）
        let localContrast: f32 = intensityVal * 0.3
        enhancedR = enhancedR + (enhancedR - meanR) * localContrast * (variance / (variance + 0.02))
        enhancedG = enhancedG + (enhancedG - meanG) * localContrast * (variance / (variance + 0.02))
        enhancedB = enhancedB + (enhancedB - meanB) * localContrast * (variance / (variance + 0.02))

        // 动态范围扩展（Gamma校正）
        let gamma: f32 = 1.0 - intensityVal * 0.2
        enhancedR = enhancedR * (enhancedR * gamma)
        enhancedG = enhancedG * (enhancedG * gamma)
        enhancedB = enhancedB * (enhancedB * gamma)

        // 钳制范围
        enhancedR = enhancedR * enhancedR * (3.0 - 2.0 * enhancedR)
        enhancedG = enhancedG * enhancedG * (3.0 - 2.0 * enhancedG)
        enhancedB = enhancedB * enhancedB * (3.0 - 2.0 * enhancedB)

        if (enhancedR > 1.0) enhancedR = 1.0
        if (enhancedG > 1.0) enhancedG = 1.0
        if (enhancedB > 1.0) enhancedB = 1.0
        if (enhancedR < 0.0) enhancedR = 0.0
        if (enhancedG < 0.0) enhancedG = 0.0
        if (enhancedB < 0.0) enhancedB = 0.0

        color.r = enhancedR
        color.g = enhancedG
        color.b = enhancedB
      }

      // 双边滤波磨皮 - 高级算法，保留边缘
      if (mode1 === 1 && !isCompareMode) {
        let offset = 2.0 / imageWidth
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])
        let center = color

        let centerLum: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        let upLum: f32 = up.r * 0.299 + up.g * 0.587 + up.b * 0.114
        let downLum: f32 = down.r * 0.299 + down.g * 0.587 + down.b * 0.114
        let leftLum: f32 = left.r * 0.299 + left.g * 0.587 + left.b * 0.114
        let rightLum: f32 = right.r * 0.299 + right.g * 0.587 + right.b * 0.114

        let diff1: f32 = centerLum - upLum
        let diff2: f32 = centerLum - downLum
        let diff3: f32 = centerLum - leftLum
        let diff4: f32 = centerLum - rightLum

        let sigmaRange: f32 = 0.15
        let sigmaRangeSq: f32 = sigmaRange * sigmaRange

        let w1: f32 = 1.0 / (1.0 + diff1 * diff1 / sigmaRangeSq)
        let w2: f32 = 1.0 / (1.0 + diff2 * diff2 / sigmaRangeSq)
        let w3: f32 = 1.0 / (1.0 + diff3 * diff3 / sigmaRangeSq)
        let w4: f32 = 1.0 / (1.0 + diff4 * diff4 / sigmaRangeSq)

        let wSum: f32 = 1.0 + w1 + w2 + w3 + w4

        let rSum: f32 = color.r + up.r * w1 + down.r * w2 + left.r * w3 + right.r * w4
        let gSum: f32 = color.g + up.g * w1 + down.g * w2 + left.g * w3 + right.g * w4
        let bSum: f32 = color.b + up.b * w1 + down.b * w2 + left.b * w3 + right.b * w4

        let mixStrength: f32 = intensityVal * 0.7
        color.r = color.r * (1.0 - mixStrength) + (rSum / wSum) * mixStrength
        color.g = color.g * (1.0 - mixStrength) + (gSum / wSum) * mixStrength
        color.b = color.b * (1.0 - mixStrength) + (bSum / wSum) * mixStrength
      }

      // 美白
      if (mode2 === 1 && !isCompareMode) {
        let whiten: f32 = intensityVal * 0.3

        color.r = color.r + whiten
        color.g = color.g + whiten
        color.b = color.b + whiten * 0.8

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // USM锐化 - Photoshop级别
      if (mode3 === 1 && !isCompareMode) {
        let offset = 2.0 / imageWidth

        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])

        let blur = (up + down + left + right) / 4.0
        let unsharp = center - blur

        let amount: f32 = intensityVal * 2.5
        let threshold: f32 = 0.05

        let edgeMask: f32 = ti.abs(center.r - blur.r) + ti.abs(center.g - blur.g) + ti.abs(center.b - blur.b)
        edgeMask = edgeMask / 3.0

        let sharpFactor: f32 = amount * (edgeMask / (edgeMask + 0.05))

        color.r = color.r + unsharp.r * sharpFactor
        color.g = color.g + unsharp.g * sharpFactor
        color.b = color.b + unsharp.b * sharpFactor
      }

      // HDR效果 - 局部对比度增强
      if (mode4 === 1 && !isCompareMode) {
        let localContrast: f32 = intensityVal * 0.4

        let offset = 3.0 / imageWidth
        let blur = ti.textureSample(texture, [uv.x + offset, uv.y])
        blur.r = (blur.r + ti.textureSample(texture, [uv.x - offset, uv.y]).r) / 2.0
        blur.g = (blur.g + ti.textureSample(texture, [uv.x - offset, uv.y]).g) / 2.0
        blur.b = (blur.b + ti.textureSample(texture, [uv.x - offset, uv.y]).b) / 2.0

        let detailR: f32 = color.r - blur.r
        let detailG: f32 = color.g - blur.g
        let detailB: f32 = color.b - blur.b
        detailR = detailR * (1.0 + localContrast)
        detailG = detailG * (1.0 + localContrast)
        detailB = detailB * (1.0 + localContrast)

        color.r = blur.r + detailR
        color.g = blur.g + detailG
        color.b = blur.b + detailB
      }

      // ACES色调映射 - 电影级
      if (mode5 === 1 && !isCompareMode) {
        let a: f32 = 2.51
        let b: f32 = 0.03
        let c: f32 = 2.43
        let d: f32 = 0.59
        let e: f32 = 0.14

        let exposure: f32 = 1.0 + intensityVal * 0.5
        color.r = color.r * exposure
        color.g = color.g * exposure
        color.b = color.b * exposure

        color.r = (color.r * (a * color.r + b)) / (color.r * (c * color.r + d) + e)
        color.g = (color.g * (a * color.g + b)) / (color.g * (c * color.g + d) + e)
        color.b = (color.b * (a * color.b + b)) / (color.b * (c * color.b + d) + e)
      }

      // Teal & Orange 电影色调
      if (mode6 === 1 && !isCompareMode) {
        let strength: f32 = intensityVal * 0.6
        let luminance: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

        let orangeR: f32 = 1.0
        let orangeG: f32 = 0.6
        let orangeB: f32 = 0.2
        let tealR: f32 = 0.0
        let tealG: f32 = 0.5
        let tealB: f32 = 0.6

        let mixFactor: f32 = (luminance - 0.5) * 2.0
        let clampedMix: f32 = ti.max(0.0, ti.min(1.0, mixFactor))

        let tintR: f32 = tealR * (1.0 - clampedMix) + orangeR * clampedMix
        let tintG: f32 = tealG * (1.0 - clampedMix) + orangeG * clampedMix
        let tintB: f32 = tealB * (1.0 - clampedMix) + orangeB * clampedMix

        color.r = color.r * (1.0 - strength * 0.3) + tintR * strength * 0.4
        color.g = color.g * (1.0 - strength * 0.2) + tintG * strength * 0.3
        color.b = color.b * (1.0 - strength * 0.2) + tintB * strength * 0.4
      }

      // 胶片滤镜 - 复古怀旧
      if (mode7 === 1 && !isCompareMode) {
        let sepiaR: f32 = 1.2
        let sepiaG: f32 = 1.0
        let sepiaB: f32 = 0.8
        color.r = color.r * sepiaR
        color.g = color.g * sepiaG
        color.b = color.b * sepiaB

        let vignetteStrength: f32 = intensityVal * 0.3
        let centerDist: f32 = ti.sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5))
        let vignette: f32 = 1.0 - vignetteStrength * centerDist
        color.r = color.r * vignette
        color.g = color.g * vignette
        color.b = color.b * vignette
      }

      // 黑白电影
      if (mode8 === 1 && !isCompareMode) {
        let gray: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
        let contrast: f32 = 1.0 + intensityVal * 1.5
        gray = (gray - 0.5) * contrast + 0.5
        color = [gray, gray, gray, color.a]
      }

      // 暖阳色调
      if (mode9 === 1 && !isCompareMode) {
        let warmth: f32 = intensityVal * 0.3
        color.r = color.r + warmth * 0.2
        color.g = color.g + warmth * 0.1
        color.b = color.b - warmth * 0.1
        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 清凉蓝调
      if (mode10 === 1 && !isCompareMode) {
        let coolness: f32 = intensityVal * 0.3
        color.b = color.b + coolness * 0.2
        color.r = color.r - coolness * 0.1
        color.g = color.g + coolness * 0.05
        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 暗角效果
      if (mode11 === 1 && !isCompareMode) {
        let vignetteStrength: f32 = intensityVal * 0.6
        let centerDist: f32 = ti.sqrt((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5))
        let vignette: f32 = 1.0 - vignetteStrength * centerDist * 2.0
        color.r = color.r * vignette
        color.g = color.g * vignette
        color.b = color.b * vignette
      }

      // 镜头光晕
      if (mode12 === 1 && !isCompareMode) {
        let flareStrength: f32 = intensityVal * 0.5
        let centerX: f32 = 0.5
        let centerY: f32 = 0.5
        let dist: f32 = ti.sqrt((uv.x - centerX) * (uv.x - centerX) + (uv.y - centerY) * (uv.y - centerY))

        let distSq: f32 = dist * dist
        let flare1: f32 = 1.0 / (1.0 + distSq * 30.0) * 0.6
        let flare2: f32 = 1.0 / (1.0 + distSq * 8.0) * 0.3
        let flare3: f32 = 1.0 / (1.0 + distSq * 2.0) * 0.1

        let totalFlare: f32 = flare1 + flare2 + flare3

        let flareR: f32 = 1.0
        let flareG: f32 = 0.9
        let flareB: f32 = 0.7

        color.r = color.r + flareR * totalFlare * flareStrength
        color.g = color.g + flareG * totalFlare * flareStrength
        color.b = color.b + flareB * totalFlare * flareStrength

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 边缘发光 - 赛博朋克风格
      if (mode13 === 1 && !isCompareMode) {
        let offset = 1.0 / imageWidth

        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])

        let edgeR: f32 = ti.abs(center.r - up.r) + ti.abs(center.r - down.r) + ti.abs(center.r - left.r) + ti.abs(center.r - right.r)
        let edgeG: f32 = ti.abs(center.g - up.g) + ti.abs(center.g - down.g) + ti.abs(center.g - left.g) + ti.abs(center.g - right.g)
        let edgeB: f32 = ti.abs(center.b - up.b) + ti.abs(center.b - down.b) + ti.abs(center.b - left.b) + ti.abs(center.b - right.b)

        let edge: f32 = (edgeR + edgeG + edgeB) / 3.0
        edge = edge / 4.0

        let glowStrength: f32 = intensityVal * 2.0
        let glowColor: f32 = edge * glowStrength

        let neonR: f32 = 0.0
        let neonG: f32 = 0.8
        let neonB: f32 = 1.0

        color.r = color.r + neonR * glowColor * 0.5
        color.g = color.g + neonG * glowColor * 0.5
        color.b = color.b + neonB * glowColor * 0.5

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 色散 - 镜头色差失真
      if (mode14 === 1 && !isCompareMode) {
        let chromaStrength: f32 = intensityVal * 0.01

        let sampleR = ti.textureSample(texture, [uv.x + chromaStrength, uv.y])
        let sampleG = ti.textureSample(texture, [uv.x, uv.y])
        let sampleB = ti.textureSample(texture, [uv.x - chromaStrength, uv.y])

        let mixStrength: f32 = intensityVal * 0.6

        color.r = color.r * (1.0 - mixStrength) + sampleR.r * mixStrength
        color.g = color.g * (1.0 - mixStrength) + sampleG.g * mixStrength
        color.b = color.b * (1.0 - mixStrength) + sampleB.b * mixStrength
      }

      // 赛博朋克 - 霓虹色彩
      if (mode15 === 1 && !isCompareMode) {
        let neonStrength: f32 = intensityVal * 0.4

        let bright: f32 = ti.max(color.r, ti.max(color.g, color.b))
        if (bright > 0.5) {
          color.r = color.r * (1.0 + neonStrength * 0.3)
          color.g = color.g * (1.0 - neonStrength * 0.2)
          color.b = color.b * (1.0 + neonStrength * 0.5)
        }

        let cyanR: f32 = 0.0
        let cyanG: f32 = 0.2
        let cyanB: f32 = 0.4
        color.r = color.r * (1.0 - neonStrength * 0.2) + cyanR * neonStrength * 0.3
        color.g = color.g * (1.0 - neonStrength * 0.1) + cyanG * neonStrength * 0.2
        color.b = color.b * (1.0 - neonStrength * 0.1) + cyanB * neonStrength * 0.4

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 复古黄
      if (mode16 === 1 && !isCompareMode) {
        let vintage: f32 = intensityVal * 0.4
        let yellowR: f32 = 1.2
        let yellowG: f32 = 1.1
        let yellowB: f32 = 0.8
        color.r = color.r * yellowR
        color.g = color.g * yellowG
        color.b = color.b * yellowB
      }

      // 蓝调
      if (mode17 === 1 && !isCompareMode) {
        let blueStrength: f32 = intensityVal * 0.35
        color.b = color.b * (1.0 + blueStrength * 0.4)
        color.r = color.r * (1.0 - blueStrength * 0.2)
        color.g = color.g * (1.0 - blueStrength * 0.1)

        let darkness: f32 = 0.05 * blueStrength
        color.r = color.r - darkness
        color.g = color.g - darkness
        color.b = color.b - darkness * 0.5

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 高光增强
      if (mode18 === 1 && !isCompareMode) {
        let highlightBoost: f32 = intensityVal * 0.5
        let luminance: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

        if (luminance > 0.6) {
          let boost: f32 = (luminance - 0.6) * 2.5 * highlightBoost
          color.r = color.r + boost
          color.g = color.g + boost
          color.b = color.b + boost
        }

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 阴影提亮
      if (mode19 === 1 && !isCompareMode) {
        let shadowLift: f32 = intensityVal * 0.4
        let luminance: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

        if (luminance < 0.4) {
          let lift: f32 = (0.4 - luminance) * 1.5 * shadowLift
          color.r = color.r + lift * 0.5
          color.g = color.g + lift * 0.5
          color.b = color.b + lift * 0.5
        }

        color.r = ti.max(0.0, ti.min(1.0, color.r))
        color.g = ti.max(0.0, ti.min(1.0, color.g))
        color.b = ti.max(0.0, ti.min(1.0, color.b))
      }

      // 降噪 - 智能降噪
      if (mode20 === 1 && !isCompareMode) {
        let offset = 1.5 / imageWidth

        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])

        let diffSum: f32 = ti.abs(center.r - up.r) + ti.abs(center.r - down.r) + ti.abs(center.r - left.r) + ti.abs(center.r - right.r)
        diffSum = diffSum + ti.abs(center.g - up.g) + ti.abs(center.g - down.g) + ti.abs(center.g - left.g) + ti.abs(center.g - right.g)
        diffSum = diffSum + ti.abs(center.b - up.b) + ti.abs(center.b - down.b) + ti.abs(center.b - left.b) + ti.abs(center.b - right.b)

        let avgDiff: f32 = diffSum / 12.0

        let noiseStrength: f32 = intensityVal * 0.8
        let noiseFactor: f32 = noiseStrength / (avgDiff + 0.05)
        if (noiseFactor > noiseStrength) {
          noiseFactor = noiseStrength
        }

        let blurredR: f32 = (center.r + up.r + down.r + left.r + right.r) / 5.0
        let blurredG: f32 = (center.g + up.g + down.g + left.g + right.g) / 5.0
        let blurredB: f32 = (center.b + up.b + down.b + left.b + right.b) / 5.0

        color.r = center.r * (1.0 - noiseFactor) + blurredR * noiseFactor
        color.g = center.g * (1.0 - noiseFactor) + blurredG * noiseFactor
        color.b = center.b * (1.0 - noiseFactor) + blurredB * noiseFactor
      }

      // 导向滤波 - 比双边滤波更快更精细
      if (mode21 === 1 && !isCompareMode) {
        let offset = 2.0 / imageWidth

        // 计算局部均值
        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])

        let meanR: f32 = (center.r + up.r + down.r + left.r + right.r) / 5.0
        let meanG: f32 = (center.g + up.g + down.g + left.g + right.g) / 5.0
        let meanB: f32 = (center.b + up.b + down.b + left.b + right.b) / 5.0

        // 计算局部方差
        let varR: f32 = (center.r - meanR) * (center.r - meanR)
        varR = varR + (up.r - meanR) * (up.r - meanR)
        varR = varR + (down.r - meanR) * (down.r - meanR)
        varR = varR + (left.r - meanR) * (left.r - meanR)
        varR = varR + (right.r - meanR) * (right.r - meanR)
        varR = varR / 5.0

        // 导向滤波核心公式
        let aR: f32 = varR / (varR + 0.01 * intensityVal + 0.001)
        let bR: f32 = meanR - aR * meanR

        let filteredR: f32 = aR * color.r + bR
        let filteredG: f32 = aR * color.g + bR
        let filteredB: f32 = aR * color.b + bR

        let guideStrength: f32 = intensityVal * 0.6
        color.r = color.r * (1.0 - guideStrength) + filteredR * guideStrength
        color.g = color.g * (1.0 - guideStrength) + filteredG * guideStrength
        color.b = color.b * (1.0 - guideStrength) + filteredB * guideStrength
      }

      // 肤色保护 - YCbCr肤色检测
      if (mode22 === 1 && !isCompareMode) {
        let r = color.r
        let g = color.g
        let b = color.b

        // RGB to YCbCr
        let yVal: f32 = 0.299 * r + 0.587 * g + 0.114 * b
        let cb: f32 = 128.0 - 0.169 * r - 0.331 * g + 0.5 * b
        let cr: f32 = 128.0 + 0.5 * r - 0.419 * g - 0.081 * b

        // 肤色检测范围（扩展）
        let isSkin: f32 = 0.0
        let crInRange: f32 = 0.0
        if (cr > 133.0 && cr < 173.0) {
          crInRange = 1.0
        }
        let cbInRange: f32 = 0.0
        if (cb > 77.0 && cb < 127.0) {
          cbInRange = 1.0
        }
        isSkin = crInRange * cbInRange

        // 肤色增强 - 保护自然肤色
        let skinEnhance: f32 = intensityVal * 0.15
        if (isSkin > 0.5) {
          // 提亮肤色同时保持自然
          let skinBright: f32 = yVal * (1.0 + skinEnhance * 0.3)
          yVal = skinBright

          // 增加暖色调
          cr = cr + 2.0 * skinEnhance
        }

        // YCbCr back to RGB
        let newR: f32 = yVal + 1.402 * (cr - 128.0)
        let newG: f32 = yVal - 0.344 * (cb - 128.0) - 0.714 * (cr - 128.0)
        let newB: f32 = yVal + 1.772 * (cb - 128.0)

        // 平滑过渡
        let protectStrength: f32 = 0.7 * isSkin * intensityVal
        color.r = color.r * (1.0 - protectStrength) + newR * protectStrength
        color.g = color.g * (1.0 - protectStrength) + newG * protectStrength
        color.b = color.b * (1.0 - protectStrength) + newB * protectStrength
      }

      // 局部白平衡 - 多区域色彩校正
      if (mode23 === 1 && !isCompareMode) {
        let offset = 4.0 / imageWidth

        // 获取多个区域的颜色
        let center = color
        let top = ti.textureSample(texture, [uv.x, uv.y - offset])
        let bottom = ti.textureSample(texture, [uv.x, uv.y + offset])
        let topLeft = ti.textureSample(texture, [uv.x - offset, uv.y - offset])
        let topRight = ti.textureSample(texture, [uv.x + offset, uv.y - offset])
        let bottomLeft = ti.textureSample(texture, [uv.x - offset, uv.y + offset])
        let bottomRight = ti.textureSample(texture, [uv.x + offset, uv.y + offset])

        // 计算局部平均颜色
        let localR: f32 = (center.r + top.r + bottom.r + topLeft.r + topRight.r + bottomLeft.r + bottomRight.r) / 7.0
        let localG: f32 = (center.g + top.g + bottom.g + topLeft.g + topRight.g + bottomLeft.g + bottomRight.g) / 7.0
        let localB: f32 = (center.b + top.b + bottom.b + topLeft.b + topRight.b + bottomLeft.b + bottomRight.b) / 7.0

        // 计算局部灰度世界
        let localGray: f32 = (localR + localG + localB) / 3.0
        let grayWorld: f32 = (localR + localG + localB) / 3.0

        // 白平衡校正系数
        let balanceR: f32 = grayWorld / (localR + 0.001)
        let balanceG: f32 = grayWorld / (localG + 0.001)
        let balanceB: f32 = grayWorld / (localB + 0.001)

        // 限制校正强度
        let maxBalance: f32 = 1.0 + intensityVal * 0.3
        let minBalance: f32 = 1.0 - intensityVal * 0.2
        if (balanceR > maxBalance) balanceR = maxBalance
        if (balanceR < minBalance) balanceR = minBalance
        if (balanceG > maxBalance) balanceG = maxBalance
        if (balanceG < minBalance) balanceG = minBalance
        if (balanceB > maxBalance) balanceB = maxBalance
        if (balanceB < minBalance) balanceB = minBalance

        // 应用局部白平衡
        let wbStrength: f32 = intensityVal * 0.4
        color.r = color.r * (1.0 - wbStrength) + color.r * balanceR * wbStrength
        color.g = color.g * (1.0 - wbStrength) + color.g * balanceG * wbStrength
        color.b = color.b * (1.0 - wbStrength) + color.b * balanceB * wbStrength
      }

      // 暗部修复 - AI级暗部细节智能恢复
      if (mode24 === 1 && !isCompareMode) {
        let luminance: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

        // 暗部检测 - 用max函数避免if
        let shadowMaskVal: f32 = ti.max(0.0, (0.4 - luminance)) / 0.4
        if (shadowMaskVal > 1.0) {
          shadowMaskVal = 1.0
        }

        // 计算局部亮度的参考
        let offset = 3.0 / imageWidth
        let localAvg = ti.textureSample(texture, [uv.x + offset, uv.y])
        localAvg.r = (localAvg.r + ti.textureSample(texture, [uv.x - offset, uv.y]).r) / 2.0
        localAvg.g = (localAvg.g + ti.textureSample(texture, [uv.x - offset, uv.y]).g) / 2.0
        localAvg.b = (localAvg.b + ti.textureSample(texture, [uv.x - offset, uv.y]).b) / 2.0

        let localLuma: f32 = localAvg.r * 0.299 + localAvg.g * 0.587 + localAvg.b * 0.114

        // 智能提亮 - 保护高光细节
        let liftAmount: f32 = intensityVal * 0.4 * shadowMaskVal
        let preservedLift: f32 = liftAmount * (1.0 - luminance / 0.5)

        let liftedR: f32 = color.r + preservedLift * 0.3
        let liftedG: f32 = color.g + preservedLift * 0.3
        let liftedB: f32 = color.b + preservedLift * 0.3

        // 暗部对比度增强
        let shadowContrast: f32 = 1.0 + intensityVal * 0.3 * shadowMaskVal
        liftedR = (liftedR - 0.3) * shadowContrast + 0.3
        liftedG = (liftedG - 0.3) * shadowContrast + 0.3
        liftedB = (liftedB - 0.3) * shadowContrast + 0.3

        // 色彩饱和度补偿
        let colorBoost: f32 = 1.0 + intensityVal * 0.2 * shadowMaskVal
        let meanColor: f32 = (liftedR + liftedG + liftedB) / 3.0
        liftedR = meanColor + (liftedR - meanColor) * colorBoost
        liftedG = meanColor + (liftedG - meanColor) * colorBoost
        liftedB = meanColor + (liftedB - meanColor) * colorBoost

        color.r = color.r * (1.0 - shadowMaskVal) + liftedR * shadowMaskVal
        color.g = color.g * (1.0 - shadowMaskVal) + liftedG * shadowMaskVal
        color.b = color.b * (1.0 - shadowMaskVal) + liftedB * shadowMaskVal
      }

      // 纹理增强 - 强化皮肤质感
      if (mode25 === 1 && !isCompareMode) {
        let offset = 1.5 / imageWidth

        // 高频细节提取
        let center = color
        let up = ti.textureSample(texture, [uv.x, uv.y - offset])
        let down = ti.textureSample(texture, [uv.x, uv.y + offset])
        let left = ti.textureSample(texture, [uv.x - offset, uv.y])
        let right = ti.textureSample(texture, [uv.x + offset, uv.y])

        // 拉普拉斯算子提取细节
        let detailR: f32 = center.r * 4.0 - (up.r + down.r + left.r + right.r)
        let detailG: f32 = center.g * 4.0 - (up.g + down.g + left.g + right.g)
        let detailB: f32 = center.b * 4.0 - (up.b + down.b + left.b + right.b)

        // 细节强度自适应
        let detailStrength: f32 = ti.abs(detailR) + ti.abs(detailG) + ti.abs(detailB)
        detailStrength = detailStrength / 3.0

        let adaptiveStrength: f32 = intensityVal * 0.5 * (detailStrength / (detailStrength + 0.02))

        // 增强纹理
        let textureR: f32 = center.r + detailR * adaptiveStrength
        let textureG: f32 = center.g + detailG * adaptiveStrength
        let textureB: f32 = center.b + detailB * adaptiveStrength

        // 防止过度锐化产生噪点
        let smoothR: f32 = (center.r + up.r + down.r + left.r + right.r) / 5.0
        let smoothG: f32 = (center.g + up.g + down.g + left.g + right.g) / 5.0
        let smoothB: f32 = (center.b + up.b + down.b + left.b + right.b) / 5.0

        let noiseThreshold: f32 = 0.02
        if (ti.abs(center.r - smoothR) < noiseThreshold) {
          textureR = center.r
        }
        if (ti.abs(center.g - smoothG) < noiseThreshold) {
          textureG = center.g
        }
        if (ti.abs(center.b - smoothB) < noiseThreshold) {
          textureB = center.b
        }

        color.r = color.r * (1.0 - adaptiveStrength) + textureR * adaptiveStrength
        color.g = color.g * (1.0 - adaptiveStrength) + textureG * adaptiveStrength
        color.b = color.b * (1.0 - adaptiveStrength) + textureB * adaptiveStrength
      }

      // 景深虚化 - 模拟大光圈镜头
      if (mode26 === 1 && !isCompareMode) {
        let centerX: f32 = 0.5
        let centerY: f32 = 0.5
        let dist: f32 = ti.sqrt((uv.x - centerX) * (uv.x - centerX) + (uv.y - centerY) * (uv.y - centerY))

        // 模糊半径基于距离中心的距离
        let maxBlur: f32 = intensityVal * 0.15
        let blurRadius: f32 = dist * maxBlur

        // 多层模糊模拟
        let blurredColor = color
        let blurLayers: f32 = 3.0

        let layer1: f32 = blurRadius * 1.0 / imageWidth
        let layer2: f32 = blurRadius * 2.0 / imageWidth
        let layer3: f32 = blurRadius * 3.0 / imageWidth

        let b1 = ti.textureSample(texture, [uv.x + layer1, uv.y])
        let b2 = ti.textureSample(texture, [uv.x - layer1, uv.y])
        let b3 = ti.textureSample(texture, [uv.x, uv.y + layer1])
        let b4 = ti.textureSample(texture, [uv.x, uv.y - layer1])

        let b5 = ti.textureSample(texture, [uv.x + layer2, uv.y + layer2])
        let b6 = ti.textureSample(texture, [uv.x - layer2, uv.y - layer2])
        let b7 = ti.textureSample(texture, [uv.x + layer2, uv.y - layer2])
        let b8 = ti.textureSample(texture, [uv.x - layer2, uv.y + layer2])

        let b9 = ti.textureSample(texture, [uv.x + layer3, uv.y])
        let b10 = ti.textureSample(texture, [uv.x - layer3, uv.y])
        let b11 = ti.textureSample(texture, [uv.x, uv.y + layer3])
        let b12 = ti.textureSample(texture, [uv.x, uv.y - layer3])

        // 加权平均
        let blurR: f32 = (b1.r + b2.r + b3.r + b4.r) / 4.0
        blurR = (blurR + (b5.r + b6.r + b7.r + b8.r) / 4.0) / 2.0
        blurR = (blurR + (b9.r + b10.r + b11.r + b12.r) / 4.0) / 2.0

        let blurG: f32 = (b1.g + b2.g + b3.g + b4.g) / 4.0
        blurG = (blurG + (b5.g + b6.g + b7.g + b8.g) / 4.0) / 2.0
        blurG = (blurG + (b9.g + b10.g + b11.g + b12.g) / 4.0) / 2.0

        let blurB: f32 = (b1.b + b2.b + b3.b + b4.b) / 4.0
        blurB = (blurB + (b5.b + b6.b + b7.b + b8.b) / 4.0) / 2.0
        blurB = (blurB + (b9.b + b10.b + b11.b + b12.b) / 4.0) / 2.0

        // 基于距离混合原色和模糊色 - 用min/max避免if
        let focusRegionVal: f32 = ti.max(0.0, ti.min(1.0, 1.0 - dist * 2.0))

        let bokehStrength: f32 = intensityVal * 0.8
        color.r = color.r * focusRegionVal + blurR * (1.0 - focusRegionVal) * bokehStrength + color.r * (1.0 - bokehStrength)
        color.g = color.g * focusRegionVal + blurG * (1.0 - focusRegionVal) * bokehStrength + color.g * (1.0 - bokehStrength)
        color.b = color.b * focusRegionVal + blurB * (1.0 - focusRegionVal) * bokehStrength + color.b * (1.0 - bokehStrength)
      }

      // 镜头校正 - 修复广角畸变
      if (mode27 === 1 && !isCompareMode) {
        let centerX: f32 = 0.5
        let centerY: f32 = 0.5

        let dx: f32 = uv.x - centerX
        let dy: f32 = uv.y - centerY

        let dist: f32 = ti.sqrt(dx * dx + dy * dy)

        // 畸变校正系数
        let correction: f32 = intensityVal * 0.15
        let k1: f32 = 0.1 * correction
        let k2: f32 = -0.05 * correction

        let dist2: f32 = dist * dist
        let dist4: f32 = dist2 * dist2

        let rNew: f32 = dist * (1.0 + k1 * dist2 + k2 * dist4)

        // 避免除以零，用小常数
        let safeDist: f32 = ti.max(0.001, dist)
        let scale: f32 = rNew / safeDist

        let correctedX: f32 = centerX + dx * scale
        let correctedY: f32 = centerY + dy * scale

        let corrected = ti.textureSample(texture, [correctedX, correctedY])

        let lensStrength: f32 = intensityVal * 0.6
        color.r = color.r * (1.0 - lensStrength) + corrected.r * lensStrength
        color.g = color.g * (1.0 - lensStrength) + corrected.g * lensStrength
        color.b = color.b * (1.0 - lensStrength) + corrected.b * lensStrength
      }

      // 光晕去除 - 逆光拍摄优化
      if (mode28 === 1 && !isCompareMode) {
        let luminance: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

        // 光晕检测 - 用max函数避免if
        let glareMaskVal: f32 = ti.max(0.0, (luminance - 0.85)) / 0.15

        // 周围区域的参考颜色
        let offset = 3.0 / imageWidth
        let surrounding = ti.textureSample(texture, [uv.x + offset, uv.y])
        surrounding.r = (surrounding.r + ti.textureSample(texture, [uv.x - offset, uv.y]).r) / 2.0
        surrounding.g = (surrounding.g + ti.textureSample(texture, [uv.x - offset, uv.y]).g) / 2.0
        surrounding.b = (surrounding.b + ti.textureSample(texture, [uv.x - offset, uv.y]).b) / 2.0

        let surrLuma: f32 = surrounding.r * 0.299 + surrounding.g * 0.587 + surrounding.b * 0.114

        // 恢复丢失的细节
        let recoverAmount: f32 = intensityVal * 0.4 * glareMaskVal
        let recoveredR: f32 = color.r + (surrounding.r - color.r) * recoverAmount * 0.5
        let recoveredG: f32 = color.g + (surrounding.g - color.g) * recoverAmount * 0.5
        let recoveredB: f32 = color.b + (surrounding.b - color.b) * recoverAmount * 0.5

        // 对比度恢复
        let contrastRestore: f32 = 1.0 + intensityVal * 0.3 * glareMaskVal
        recoveredR = (recoveredR - 0.7) * contrastRestore + 0.7
        recoveredG = (recoveredG - 0.7) * contrastRestore + 0.7
        recoveredB = (recoveredB - 0.7) * contrastRestore + 0.7

        // 色彩恢复
        let colorRestore: f32 = 1.0 + intensityVal * 0.2 * glareMaskVal
        let meanRec: f32 = (recoveredR + recoveredG + recoveredB) / 3.0
        recoveredR = meanRec + (recoveredR - meanRec) * colorRestore
        recoveredG = meanRec + (recoveredG - meanRec) * colorRestore
        recoveredB = meanRec + (recoveredB - meanRec) * colorRestore

        color.r = color.r * (1.0 - glareMaskVal) + recoveredR * glareMaskVal
        color.g = color.g * (1.0 - glareMaskVal) + recoveredG * glareMaskVal
        color.b = color.b * (1.0 - glareMaskVal) + recoveredB * glareMaskVal
      }

      // 动态对比度 - 自适应对比度
      if (mode29 === 1 && !isCompareMode) {
        let luminance: f32 = color.r * 0.299 + color.g * 0.587 + color.b * 0.114

        // 基于亮度的对比度调整 - 用数学公式避免复杂if
        let contrastAdj: f32 = intensityVal * 0.2
        let lumaFactor: f32 = (luminance - 0.5) * 2.0
        lumaFactor = lumaFactor * lumaFactor

        let dynamicFactor: f32 = 1.0 - lumaFactor * contrastAdj * 0.5

        let contrastedR: f32 = (color.r - 0.5) * dynamicFactor + 0.5
        let contrastedG: f32 = (color.g - 0.5) * dynamicFactor + 0.5
        let contrastedB: f32 = (color.b - 0.5) * dynamicFactor + 0.5

        // 局部对比度微调
        let offset = 2.0 / imageWidth
        let localAvg = ti.textureSample(texture, [uv.x + offset, uv.y])
        localAvg.r = (localAvg.r + ti.textureSample(texture, [uv.x - offset, uv.y]).r) / 2.0
        localAvg.g = (localAvg.g + ti.textureSample(texture, [uv.x - offset, uv.y]).g) / 2.0
        localAvg.b = (localAvg.b + ti.textureSample(texture, [uv.x - offset, uv.y]).b) / 2.0

        let localLuma: f32 = localAvg.r * 0.299 + localAvg.g * 0.587 + localAvg.b * 0.114
        let localDeviation: f32 = ti.abs(luminance - localLuma)

        let microContrast: f32 = 1.0 + intensityVal * 0.15 * (localDeviation / (localDeviation + 0.05))
        contrastedR = (contrastedR - localAvg.r) * microContrast + localAvg.r
        contrastedG = (contrastedG - localAvg.g) * microContrast + localAvg.g
        contrastedB = (contrastedB - localAvg.b) * microContrast + localAvg.b

        color.r = contrastedR
        color.g = contrastedG
        color.b = contrastedB
      }

      // 轻微动态效果
      let dynamicBrightness = 1.0 + 0.003 * ti.sin(time * 0.001)
      color.r = color.r * dynamicBrightness
      color.g = color.g * dynamicBrightness
      color.b = color.b * dynamicBrightness

      ti.outputColor(targetTexture, color)
    }
  })
}

// 更新强度
async function updateIntensity() {
  if (!intensityField) {
    console.warn('intensityField 未初始化')
    return
  }

  console.log('更新 intensityField:', intensity.value)
  await intensityField.fromArray([intensity.value])

  // 确保 intensityField 在 kernel scope 中是更新的
  if (ti) {
    ti.addToKernelScope({ intensityField })
  }
}

// 更新直方图
function updateHistogram() {
  if (!histogramCanvas.value || !optimizedCanvas.value) return

  const ctx = histogramCanvas.value.getContext('2d')
  if (!ctx) return

  const sourceCtx = optimizedCanvas.value.getContext('2d')
  if (!sourceCtx) return

  const width = histogramCanvas.value.width
  const height = histogramCanvas.value.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 获取图像数据
  const imageData = sourceCtx.getImageData(0, 0, optimizedCanvas.value.width, optimizedCanvas.value.height)
  const data = imageData.data

  // 创建直方图数据
  const histogramR = new Array(256).fill(0)
  const histogramG = new Array(256).fill(0)
  const histogramB = new Array(256).fill(0)

  // 统计像素值
  for (let i = 0; i < data.length; i += 4) {
    histogramR[data[i]]++
    histogramG[data[i + 1]]++
    histogramB[data[i + 2]]++
  }

  // 找到最大值用于归一化
  const maxR = Math.max(...histogramR)
  const maxG = Math.max(...histogramG)
  const maxB = Math.max(...histogramB)
  const maxVal = Math.max(maxR, maxG, maxB)

  // 绘制直方图
  const binWidth = width / 256

  // 绘制红色通道
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  for (let i = 0; i < 256; i++) {
    const barHeight = (histogramR[i] / maxVal) * height
    ctx.fillRect(i * binWidth, height - barHeight, binWidth + 1, barHeight)
  }

  // 绘制绿色通道
  ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
  for (let i = 0; i < 256; i++) {
    const barHeight = (histogramG[i] / maxVal) * height
    ctx.fillRect(i * binWidth, height - barHeight, binWidth + 1, barHeight)
  }

  // 绘制蓝色通道
  ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
  for (let i = 0; i < 256; i++) {
    const barHeight = (histogramB[i] / maxVal) * height
    ctx.fillRect(i * binWidth, height - barHeight, binWidth + 1, barHeight)
  }

  // 绘制背景网格
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = (height / 4) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
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
  await updateModesField()

  // 如果不是实时预览模式,手动触发一次渲染
  triggerRender()

  // 保存历史记录
  saveHistory()

  // 更新直方图
  setTimeout(updateHistogram, 100)

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

  // 复用 Canvas 对象,避免频繁创建
  if (ti && optimizedCanvas.value && !tiCanvas) {
    tiCanvas = new ti.Canvas(optimizedCanvas.value)
  }

  function animate() {
    if (!isAnimating.value) return

    const currentTime = performance.now()

    // 渲染
    if (renderKernel) {
      renderKernel(currentTime)
    }

    // 显示到 canvas - 复用对象
    if (tiCanvas && targetTexture) {
      tiCanvas.setImage(targetTexture)
    }

    // 计算 FPS
    frameCount++
    if (currentTime - lastFrameTime >= 1000) {
      fps.value = frameCount
      frameCount = 0
      lastFrameTime = currentTime
    }

    // 每30帧更新一次直方图
    histogramUpdateFrame++
    if (histogramUpdateFrame >= 30 && histogramCanvas.value) {
      updateHistogram()
      histogramUpdateFrame = 0
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
  exposure.value = 1.0
  contrast.value = 1.0
  saturation.value = 1.0
  currentPresetName.value = ''
  selectedPresetIndex.value = ''
  showCompare.value = false
  showSplitCompare.value = false
  splitPosition.value = 50
  await updateModesField()
  await updateIntensity()
  await updateBasicParams()

  // 清空历史记录
  historyStack.value = []
  historyIndex.value = -1

  // 更新直方图
  setTimeout(updateHistogram, 100)

  status.value = '已重置'
}

// 保存预设
function savePreset() {
  if (!currentPresetName.value.trim()) {
    status.value = '请输入预设名称'
    return
  }

  const preset = {
    name: currentPresetName.value.trim(),
    modes: [...selectedModes.value],
    intensity: intensity.value,
    exposure: exposure.value,
    contrast: contrast.value,
    saturation: saturation.value
  }

  const modeNames = preset.modes.map(id => optimizationModes[id]?.name || `ID:${id}`).join(', ')

  console.log('=== 保存预设 ===')
  console.log('预设名称:', preset.name)
  console.log('滤镜数量:', preset.modes.length)
  console.log('滤镜列表:', preset.modes)
  console.log('滤镜名称:', modeNames)
  console.log('强度:', preset.intensity)
  console.log('曝光:', preset.exposure)
  console.log('对比度:', preset.contrast)
  console.log('饱和度:', preset.saturation)
  console.log('================')

  // 检查是否已存在同名预设
  const existingIndex = presets.value.findIndex(p => p.name === preset.name)
  if (existingIndex !== -1) {
    presets.value[existingIndex] = preset
  } else {
    presets.value.push(preset)
  }

  // 持久化到 localStorage
  try {
    localStorage.setItem('image-optimizer-presets', JSON.stringify(presets.value))
    const filterCount = selectedModes.value.length
    status.value = filterCount > 0
      ? `预设 "${preset.name}" 已保存 (${filterCount} 个滤镜: ${modeNames})`
      : `预设 "${preset.name}" 已保存 (无滤镜)`
    selectedPresetIndex.value = presets.value.length - 1
  } catch (e) {
    console.error('保存预设失败:', e)
    status.value = '保存预设失败'
  }
}

// 加载预设
async function loadPreset() {
  const idx = selectedPresetIndex.value
  if (idx === '' || typeof idx === 'string') return

  const preset = presets.value[Number(idx)]
  if (!preset) return

  const modeNames = preset.modes.map(id => optimizationModes[id]?.name || `ID:${id}`).join(', ')

  console.log('=== 加载预设 ===')
  console.log('预设名称:', preset.name)
  console.log('滤镜数量:', preset.modes.length)
  console.log('滤镜列表:', preset.modes)
  console.log('滤镜名称:', modeNames)
  console.log('强度:', preset.intensity)
  console.log('================')

  currentPresetName.value = preset.name
  intensity.value = preset.intensity

  // 加载基础参数
  if (preset.exposure !== undefined) exposure.value = preset.exposure
  if (preset.contrast !== undefined) contrast.value = preset.contrast
  if (preset.saturation !== undefined) saturation.value = preset.saturation

  // 更新模式选择
  selectedModes.value = [...preset.modes]

  console.log('加载后 selectedModes:', selectedModes.value)

  // 更新 modesField 和强度
  await updateModesField()
  await updateIntensity()
  await updateBasicParams()

  status.value = `已加载预设: ${preset.name} (${selectedModes.value.length} 个滤镜: ${modeNames})`

  // 更新直方图
  setTimeout(updateHistogram, 100)

  // 保存历史记录
  saveHistory()

  // 如果不是实时预览,手动触发渲染
  triggerRender()
}

// 删除预设
function deletePreset() {
  const idx = selectedPresetIndex.value
  if (idx === '' || typeof idx === 'string') return

  const preset = presets.value[Number(idx)]
  if (!preset) return

  if (confirm(`确定要删除预设 "${preset.name}" 吗?`)) {
    presets.value.splice(Number(idx), 1)
    try {
      localStorage.setItem('image-optimizer-presets', JSON.stringify(presets.value))
      status.value = `预设 "${preset.name}" 已删除`
      selectedPresetIndex.value = ''
      currentPresetName.value = ''
    } catch (e) {
      console.error('删除预设失败:', e)
      status.value = '删除预设失败'
    }
  }
}

// 初始化时加载预设
onMounted(() => {
  try {
    const saved = localStorage.getItem('image-optimizer-presets')
    if (saved) {
      presets.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载预设失败:', e)
  }
})

// 拖拽事件处理
function onDragOver() {
  isDragging.value = true
}

function onDragLeave(event: DragEvent) {
  // 只在离开整个容器时才隐藏提示
  const target = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement
  if (!relatedTarget || !target.contains(relatedTarget)) {
    isDragging.value = false
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    status.value = '❌ 请选择图片文件'
    return
  }

  // 手动触发文件选择处理
  handleFile(file)
}

async function handleFile(file: File) {
  status.value = '正在加载图片...'

  const reader = new FileReader()
  reader.onload = async (e) => {
    const img = new Image()
    img.onload = async () => {
      // 重置参数
      exposure.value = 1.0
      contrast.value = 1.0
      saturation.value = 1.0
      showSplitCompare.value = false
      splitPosition.value = 50

      // 计算图片尺寸（限制最大边长为 1024）
      const maxSize = 1024
      let width = img.width
      let height = img.height

      if (width > maxSize || height > maxSize) {
        const scale = maxSize / Math.max(width, height)
        width = Math.floor(width * scale)
        height = Math.floor(height * scale)
      }

      imageWidth.value = width
      imageHeight.value = height

      // 等待 Vue 更新 DOM
      await new Promise(resolve => setTimeout(resolve, 50))

      // 绘制到原始画布（必须先绘制原图）
      if (originalCanvas.value) {
        originalCanvas.value.width = width
        originalCanvas.value.height = height
        const ctx = originalCanvas.value.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
        }
        console.log('原图已绘制到 canvas')
      } else {
        console.error('originalCanvas.value 为空，无法绘制原图')
      }

      console.log('handleFile - 上传图片前 selectedModes:', selectedModes.value)
      console.log('图片尺寸:', width, 'x', height)

      // 创建纹理（会使用当前的 selectedModes）
      await createTexture(img)

      // 确保更新 fields（防止异步问题）
      if (modesField && intensityField && exposureField && contrastField && saturationField) {
        await updateModesField()
        await updateIntensity()
        await updateBasicParams()
      }

      // 显示当前应用的滤镜信息
      if (selectedModes.value.length > 0) {
        const modeNames = selectedModes.value.map(id => optimizationModes[id]?.name || '').filter(Boolean).join('、')
        status.value = `已应用: ${modeNames} (强度: ${(intensity.value * 100).toFixed(0)}%)`
      } else {
        status.value = '图片加载成功！请选择滤镜效果'
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 下载图片
function downloadImage() {
  if (!optimizedCanvas.value) return

  // 如果在对比模式,先切换回优化视图
  const wasComparing = showCompare.value
  showCompare.value = false

  // 等待一帧渲染完成
  setTimeout(() => {
    const link = document.createElement('a')
    link.download = `optimized-image-${Date.now()}.png`
    link.href = optimizedCanvas.value!.toDataURL('image/png', 0.95)
    link.click()

    status.value = '图片已下载'

    // 恢复对比状态
    if (wasComparing) {
      setTimeout(() => {
        showCompare.value = true
      }, 100)
    }
  }, 100)
}

// 初始化 AI 模型
async function initAIModel(retryCount = 0) {
  if (aiModelLoaded.value) {
    console.log('AI 模型已加载')
    return
  }

  if (aiModelLoading.value) {
    console.log('AI 模型正在加载中...')
    return
  }

  aiModelError.value = false

  try {
    aiModelLoading.value = true
    status.value = '正在加载 AI 模型，请稍候...'

    faceBeautifier = getFaceBeautifier()
    await faceBeautifier.init()

    aiModelLoaded.value = true
    aiModelError.value = false
    status.value = '✅ AI 模型加载成功！可使用 AI 人脸美化功能'
    console.log('✅ AI 模型加载完成')
  } catch (error) {
    console.error('❌ AI 模型加载失败:', error)

    const errorMessage = (error as Error).message

    // 网络错误，提供重试选项
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      aiModelError.value = true

      if (retryCount < 2) {
        console.log(`正在重试加载模型... (第 ${retryCount + 1} 次)`)
        status.value = `网络错误，正在重试... (${retryCount + 1}/3)`

        // 等待 2 秒后重试
        await new Promise(resolve => setTimeout(resolve, 2000))
        return initAIModel(retryCount + 1)
      } else {
        status.value = '❌ 模型加载失败：网络连接问题。请检查网络或点击重试按钮。'
        console.error('💡 可能的原因和解决方案：')
        console.error('   1. 网络连接不稳定')
        console.error('   2. 防火墙阻止了模型下载')
        console.error('   3. 模型服务器暂时不可用')
        console.error('   4. 尝试使用 VPN 或代理（推荐香港/日本/新加坡节点）')
        console.error('   5. 使用手机热点')
        console.error('   6. 在凌晨等网络通畅时段重试')
      }
    } else {
      aiModelError.value = true
      status.value = '❌ AI 模型加载失败: ' + errorMessage
    }
  } finally {
    aiModelLoading.value = false
  }
}

// 手动重试加载模型
async function retryLoadAIModel() {
  console.log('用户手动重试加载模型')
  await initAIModel(0)
}

// 应用 AI 人脸美化
async function applyAIFaceBeautify() {
  // 必须使用 optimizedCanvas 作为处理目标
  const targetCanvas = optimizedCanvas.value

  if (!targetCanvas) {
    status.value = '请先上传图片'
    return
  }

  // 先将原图复制到优化画布
  if (originalCanvas.value) {
    const ctx = targetCanvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
      ctx.drawImage(originalCanvas.value, 0, 0)
    }
  }

  if (!faceBeautifier) {
    await initAIModel()
    if (!faceBeautifier) {
      status.value = 'AI 模型初始化失败'
      return
    }
  }

  try {
    isProcessingAI.value = true
    status.value = '正在处理 AI 人脸美化...'

    const params: FaceBeautifyParams = {
      smoothness: aiSmoothness.value,
      whitening: aiWhitening.value,
      eyeEnlarge: aiEyeEnlarge.value,
      faceSlim: aiFaceSlim.value,
      intensity: aiIntensity.value
    }

    console.log('使用 optimizedCanvas 进行美化处理')

    const success = await faceBeautifier.beautify(targetCanvas, params)

    if (success) {
      status.value = '✨ AI 人脸美化完成！'
      saveHistory()
    } else {
      status.value = '未检测到人脸，美化失败'
    }
  } catch (error) {
    console.error('AI 美化失败:', error)
    status.value = 'AI 美化失败: ' + (error as Error).message
  } finally {
    isProcessingAI.value = false
  }
}

// 监听 AI 分类切换，自动加载模型
watch(activeCategory, async (newCategory) => {
  if (newCategory === 'AI 智能增强' && !aiModelLoaded.value) {
    // 延迟加载，避免阻塞 UI
    setTimeout(() => {
      initAIModel()
    }, 500)
  }
})

// 测试人脸检测
async function testFaceDetection() {
  // 使用 optimizedCanvas 进行检测，避免修改原图
  const targetCanvas = optimizedCanvas.value

  if (!targetCanvas) {
    status.value = '请先上传图片'
    return
  }

  // 确保 optimizedCanvas 有内容
  if (originalCanvas.value) {
    const ctx = targetCanvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
      ctx.drawImage(originalCanvas.value, 0, 0)
    }
  }

  if (!faceBeautifier) {
    await initAIModel()
  }

  try {
    status.value = '正在测试人脸检测...'

    console.log('测试人脸检测，使用 optimizedCanvas')
    console.log('Canvas 尺寸:', targetCanvas.width, 'x', targetCanvas.height)

    // 检查 canvas 是否有内容
    const ctx = targetCanvas.getContext('2d')
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height)
      const pixelCount = (imageData.data.length / 4)
      console.log('Canvas 像素数量:', pixelCount)

      // 检查前 10 个像素
      for (let i = 0; i < 10 && i * 4 < imageData.data.length; i++) {
        console.log(`像素 ${i}:`, {
          r: imageData.data[i * 4],
          g: imageData.data[i * 4 + 1],
          b: imageData.data[i * 4 + 2],
          a: imageData.data[i * 4 + 3]
        })
      }
    }

    const faces = await faceBeautifier!.detectFaces(targetCanvas)

    if (faces && faces.length > 0) {
      status.value = `✅ 检测到 ${faces.length} 张人脸！关键点: ${faces[0].keypoints?.length}`
      console.log('人脸检测结果:', faces)
    } else {
      status.value = '⚠️ 未检测到人脸，请确保图片包含清晰的人脸'
    }
  } catch (error) {
    console.error('人脸检测测试失败:', error)
    status.value = '❌ 人脸检测失败: ' + (error as Error).message
  }
}

// 生命周期
onUnmounted(() => {
  stopAnimation()
  // 清理 Canvas 对象
  tiCanvas = null
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

.control-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toggle-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid #4ec9b0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;

  input[type="checkbox"] {
    accent-color: #4ec9b0;
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #4ec9b0;
    color: #1e1e1e;
  }
}

.preset-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.preset-input {
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid #3d3d3d;
  border-radius: 6px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #4ec9b0;
  }

  &::placeholder {
    color: #858585;
  }
}

.preset-select {
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid #3d3d3d;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    border-color: #4ec9b0;
  }

  option {
    background: #1e1e1e;
    color: #d4d4d4;
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

  &:hover:not(:disabled) {
    background: #4ec9b0;
    color: #1e1e1e;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background: #4ec9b0;
    color: #1e1e1e;

    &:hover:not(:disabled) {
      background: #3db89a;
    }
  }

  &.active {
    background: #4ec9b0;
    color: #1e1e1e;
  }

  &.danger {
    border-color: #e74c3c;
    color: #e74c3c;

    &:hover:not(:disabled) {
      background: #e74c3c;
      color: #fff;
    }
  }
}

// AI 控制面板样式
.ai-panel {
  background: linear-gradient(135deg, rgba(78, 201, 176, 0.1) 0%, rgba(78, 201, 176, 0.05) 100%);
  border: 2px solid #4ec9b0;
  border-radius: 8px;
  padding: 20px;
}

.model-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 12px;
  background: #3d3d3d;
  color: #858585;

  &.loading {
    background: #f39c12;
    color: #fff;
    animation: pulse 1.5s ease-in-out infinite;
  }

  &.loaded {
    background: #27ae60;
    color: #fff;
  }

  &.error {
    background: #e74c3c;
    color: #fff;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.ai-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.ai-button {
  margin-top: 16px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #4ec9b0 0%, #2ecc71 100%);
  border: none;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(78, 201, 176, 0.4);
  }

  &:disabled {
    background: #3d3d3d;
    color: #858585;
    cursor: not-allowed;
    transform: none;
  }
}

.test-button {
  margin-top: 8px;
  padding: 10px 20px;
  background: #3d3d3d;
  border: 2px solid #f39c12;
  color: #f39c12;
  font-weight: 500;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: #f39c12;
    color: #1e1e1e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ai-error-message {
  background: rgba(231, 76, 60, 0.1);
  border: 2px solid #e74c3c;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  p {
    color: #e74c3c;
    margin: 0 0 12px 0;
    font-size: 14px;
  }

  .error-detail {
    color: #858585;
    font-size: 12px;
    margin: 0 0 16px 0;
    line-height: 1.6;
  }
}

.error-tips {
  margin-top: 16px;
  padding: 12px;
  background: rgba(243, 156, 18, 0.1);
  border-radius: 6px;

  .tip-title {
    color: #f39c12;
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  ul {
    color: #d4d4d4;
    font-size: 12px;
    margin: 0;
    padding-left: 20px;
    line-height: 1.8;

    li {
      margin-bottom: 4px;
    }
  }
}

.retry-button {
  width: 100%;
  padding: 12px 20px;
  background: #f39c12;
  color: #1e1e1e;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: #e67e22;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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



.canvas-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(512px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
  position: relative;
  min-height: 512px;

  &.drag-over {
    border: 3px dashed #4ec9b0;
    border-radius: 12px;
  }
}

.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(78, 201, 176, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  pointer-events: none;
  z-index: 10;
}

.drag-message {
  background: rgba(30, 30, 30, 0.95);
  padding: 30px 50px;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 600;
  color: #4ec9b0;
  border: 2px solid #4ec9b0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
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

.undo-redo-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.split-compare {
  position: relative;
  overflow: hidden;
}

.split-container {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  cursor: ew-resize;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
}

.split-canvas {
  z-index: 1;
}

.split-overlay {
  z-index: 2;
}

.split-slider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #4ec9b0;
  z-index: 3;
  cursor: ew-resize;
  box-shadow: 0 0 10px rgba(78, 201, 176, 0.5);
}

.split-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: #4ec9b0;
  border-radius: 50%;
  border: 3px solid #1e1e1e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.histogram-container {
  background: #252526;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.histogram-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.histogram-header {
  color: #9cdcfe;
  font-weight: 500;
}

.histogram-canvas {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background: #1e1e1e;
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
