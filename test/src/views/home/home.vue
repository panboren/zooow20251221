<template>
  <div
    ref="containerRef"
    class="home-content"
    tabindex="-1"
    @dblclick="toggleAutoRotate"
  >
    <canvas ref="canvasRef" />

    <!-- 电影级加载状态指示器 -->
    <LoadingIndicator
      v-if="isLoading"
      :text="loadingText"
      :progress="loadingProgress"
    />

    <!-- 电影级动画组件 -->
    <CinematicAnimations
      v-if="scene && !isLoading"
      ref="cinematicAnimationsRef"
      :is-loading="isLoading"
      :scene="scene"
      :camera="camera"
      :renderer="renderer"
      :controls="controls"
      :animation-type="animationType"
      @animation-complete="onAnimationComplete"
    />

    <!-- 动画选择器组件 -->
    <AnimationSelector
      v-if="!isLoading"
      v-model="animationType"
      @change="resetAnimation"
      @reset="resetAnimation"
    />

    <!-- 视角控制组件 -->
    <CameraControls @set-camera-view="setCameraView" />

    <!-- 全景图切换器 -->
    <PanoramaSwitcher
      v-model="currentPanorama"
      :is-changing-panorama="isChangingPanorama"
      @change="switchPanorama"
    />

    <!-- 控制提示 -->
    <ControlsHint />
  </div>
</template>
<script setup>
/**
 * Home View Component - 带全景图切换功能
 * 主页视图组件，包含3D全景展示、交互控制和全景图切换
 */

import { onMounted, onUnmounted, watch, ref, computed, shallowRef } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { gsap } from 'gsap'

// 导入组件
import LoadingIndicator from '@/components/ui/LoadingIndicator.vue'
import CinematicAnimations from '@/components/animation/CinematicAnimations.vue'
import AnimationSelector from '@/components/animation/AnimationSelector.vue'
import CameraControls from '@/components/animation/CameraControls.vue'
import ControlsHint from '@/components/ui/ControlsHint.vue'
import PanoramaSwitcher from '@components/animation/panorama-switcher.vue'


// 导入常量和配置
import {
  CAMERA_CONFIG,
  RENDER_CONFIG,
  CONTROLS_CONFIG,
  VIEW_PRESETS,
  PERFORMANCE_CONFIG,
  STYLE_CONFIG
} from '@/config/constants'

// 导入工具函数
import { createLogger } from '@/utils/logger'
import { debounce } from '@/utils/performance'

// 创建日志实例
const logger = createLogger('HomeView')

// ==================== 全景图配置 ====================












// ==================== 响应式引用 ====================
const containerRef = ref(null)
const canvasRef = ref(null)
const cinematicAnimationsRef = ref(null)

// Three.js 相关变量（使用 shallowRef 避免深度响应式）
const scene = shallowRef(null)
const camera = shallowRef(null)
const renderer = shallowRef(null)
const mesh = shallowRef(null)
const controls = shallowRef(null)
const texture = shallowRef(null) // 保存当前纹理
const animationId = ref(null)
const lastRenderTime = ref(performance.now())

// ==================== 状态管理 ====================
const isLoading = ref(true)
const autoRotateEnabled = ref(false)
const animationComplete = ref(false)
const animationType = ref('epic-dive')
const isInitialized = ref(false)

// ==================== 计算属性 ====================
const loadingText = computed(() => '正在加载ZOOOW智慧工具...')
const loadingProgress = computed(() => '准备进入沉浸式体验')

// 当前全景图索引
const currentPanorama = ref({})
const isChangingPanorama = ref(false)


// ==================== 性能监控工具 ====================
const performanceMonitor = {
  frameCount: 0,
  lastCheckTime: performance.now(),
  fps: 0,

  update() {
    this.frameCount++
    const now = performance.now()

    if (now - this.lastCheckTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastCheckTime))
      this.frameCount = 0
      this.lastCheckTime = now

      // 每5秒输出一次 FPS
      if (Math.floor(now / 5000) > Math.floor((now - 1000) / 5000)) {
        logger.debug(`当前 FPS: ${this.fps}`)
      }
    }
  }
}

// ==================== Three.js 初始化函数 ====================

/**
 * 创建场景
 * @returns {THREE.Scene} 创建的场景对象
 */
const createScene = () => {
  logger.debug('创建Three.js场景')
  const newScene = new THREE.Scene()
  newScene.background = new THREE.Color(STYLE_CONFIG.BACKGROUND_COLOR)
  return newScene
}

/**
 * 创建相机
 * @returns {THREE.PerspectiveCamera} 创建的相机对象
 */
const createCamera = () => {
  if (!containerRef.value) {
    throw new Error('容器元素不存在')
  }

  logger.debug('创建相机')

  const aspectRatio = containerRef.value.clientWidth / containerRef.value.clientHeight
  const newCamera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.FOV,
    aspectRatio,
    CAMERA_CONFIG.NEAR,
    CAMERA_CONFIG.FAR
  )

  // 设置相机初始位置和旋转
  newCamera.position.set(
    CAMERA_CONFIG.DEFAULT_POSITION.x,
    CAMERA_CONFIG.DEFAULT_POSITION.y,
    CAMERA_CONFIG.DEFAULT_POSITION.z
  )
  newCamera.rotation.set(
    CAMERA_CONFIG.DEFAULT_ROTATION.x,
    CAMERA_CONFIG.DEFAULT_ROTATION.y,
    CAMERA_CONFIG.DEFAULT_ROTATION.z
  )
  newCamera.fov = CAMERA_CONFIG.FOV
  newCamera.updateProjectionMatrix()

  return newCamera
}

/**
 * 创建渲染器 - 保守性能优化版本
 * @returns {THREE.WebGLRenderer} 创建的渲染器对象
 */
const createRenderer = () => {
  if (!canvasRef.value) {
    throw new Error('Canvas元素不存在')
  }

  logger.debug('创建渲染器')

  const newRenderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    // 🔧 性能优化：关闭抗锯齿
    antialias: false,
    // 保留 alpha 通道配置
    alpha: RENDER_CONFIG.ALPHA,
    // 🔧 性能优化：优先性能
    powerPreference: 'high-performance',
    preserveDrawingBuffer: RENDER_CONFIG.PRESERVE_DRAWING_BUFFER,
    // 🔧 性能优化：使用中等精度
    precision: 'mediump',
    // 🔧 性能优化：关闭模板缓冲
    stencil: false,
    // 保留深度缓冲
    depth: RENDER_CONFIG.DEPTH,
    // 🔧 性能优化：禁用对数深度
    logarithmicDepthBuffer: false
  })

  // 🔧 性能优化：适度限制像素比
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5)
  newRenderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight,
    true
  )
  newRenderer.setPixelRatio(pixelRatio)

  // 应用高级渲染设置
  applyRendererSettings(newRenderer)

  logger.debug(`渲染器创建完成，像素比: ${pixelRatio}`)
  return newRenderer
}

/**
 * 应用渲染器高级设置
 * @param {THREE.WebGLRenderer} renderer - 渲染器对象
 */
const applyRendererSettings = (renderer) => {
  logger.debug('应用渲染器高级设置')

  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3

  // 颜色空间设置
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // 🔧 性能优化：禁用物理灯光计算
  renderer.physicallyCorrectLights = false

  // 🔧 性能优化：关闭阴影贴图
  renderer.shadowMap.enabled = false

  // 🔧 性能优化：禁用对数深度缓冲区
  renderer.logarithmicDepthBuffer = false

  // 保留自动清除
  renderer.autoClear = true

  logger.debug('渲染器设置应用完成')
}

/**
 * 创建球体几何体 - 保守性能优化版本
 * @returns {THREE.Mesh} 创建的球体网格对象
 */
const createSphereGeometry = () => {
  logger.debug('创建球体几何体')

  try {
    // 🔧 性能优化：适度减少球体几何体顶点数
    const geometry = new THREE.SphereGeometry(500, 70, 35)

    // 翻转球体以显示内部
    geometry.scale(-1, 1, 1)

    // 计算法线（保持兼容性）
    geometry.computeVertexNormals()

    // 创建材质（保留 DoubleSide 确保正常显示）
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: false,
      depthTest: true,
      depthWrite: false
    })

    // 创建网格
    const newMesh = new THREE.Mesh(geometry, material)
    scene.value.add(newMesh)

    return newMesh
  } catch (error) {
    logger.error('创建球体几何体失败:', error)
    throw error
  }
}

/**
 * 加载纹理 - 支持切换全景图
 * @param {string} imageUrl - 全景图URL
 * @returns {Promise<THREE.Texture>} 加载的纹理对象
 */
const loadTexture = (imageUrl) => {
  return new Promise((resolve, reject) => {
    logger.info(`开始加载纹理: ${imageUrl}`)

    const textureLoader = new THREE.TextureLoader()

    const onLoad = (loadedTexture) => {
      try {
        logger.info('纹理加载成功')
        isLoading.value = false

        // 优化纹理参数
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping

        // 保留 mipmap
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.generateMipmaps = true

        // 🔧 性能优化：动态调整各向异性
        const isLowEndDevice = window.devicePixelRatio < 2 ||
            navigator.hardwareConcurrency < 4
        const maxAnisotropy = isLowEndDevice ? 2 : Math.min(4, renderer.value.capabilities.getMaxAnisotropy())
        loadedTexture.anisotropy = maxAnisotropy

        // 颜色空间设置
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.format = THREE.RGBAFormat

        // 更新材质
        if (mesh.value && mesh.value.material) {
          mesh.value.material.map = loadedTexture
          mesh.value.material.needsUpdate = true
        }

        // 保存纹理引用
        texture.value = loadedTexture

        // 动画进入默认视角
        setTimeout(() => {
          if (cinematicAnimationsRef.value) {
            cinematicAnimationsRef.value.animateToDefaultView()
          }
        }, 100)

        resolve(loadedTexture)
      } catch (error) {
        logger.error('纹理处理失败:', error)
        reject(error)
      }
    }

    const onProgress = (progress) => {
      const percentComplete = (progress.loaded / progress.total) * 100
      logger.debug(`纹理加载进度: ${percentComplete.toFixed(2)}%`)
    }

    const onError = (error) => {
      logger.error('纹理加载失败:', error)
      isLoading.value = false

      // 创建备用纹理
      try {
        const fallbackTexture = createFallbackTexture()
        resolve(fallbackTexture)
      } catch (fallbackError) {
        logger.error('创建备用纹理失败:', fallbackError)
        reject(fallbackError)
      }
    }

    textureLoader.load(imageUrl, onLoad, onProgress, onError)
  })
}

/**
 * 切换全景图
 * @param {number} index - 全景图索引
 */
const switchPanorama = async () => {
  if (isChangingPanorama.value) {
    return
  }

  try {
    logger.info(`切换全景图: ${currentPanorama.value.title}`)
    isChangingPanorama.value = true
    isLoading.value = true

    // 释放旧纹理
    if (texture.value) {
      texture.value.dispose()
      texture.value = null
    }

    // 加载新纹理
    const newImageUrl = currentPanorama.value.image
    await loadTexture(newImageUrl)

    // 获取新全景图的目标位置
    const targetPosition = currentPanorama.value.target || { x: 0, y: 0, z: 0 }

    // 平滑移动到目标位置
    gsap.to(camera.value.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (camera.value) {
          camera.value.lookAt(0, 0, 0)
          if (controls.value) {
            controls.value.update()
          }
        }
      }
    })

    isChangingPanorama.value = false
    logger.info(`全景图切换完成: ${currentPanorama.value.title}`)
  } catch (error) {
    logger.error('切换全景图失败:', error)
    isChangingPanorama.value = false
    isLoading.value = false
  }
}




/**
 * 创建备用纹理
 * @returns {THREE.CanvasTexture} 备用纹理对象
 */
const createFallbackTexture = () => {
  logger.warn('创建备用纹理')

  // 使用 64x64 画布
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  // 使用简单的渐变填充
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, '#c532f6')
  gradient.addColorStop(1, '#c4163e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const fallbackTexture = new THREE.CanvasTexture(canvas)

  // 优化纹理参数
  fallbackTexture.minFilter = THREE.NearestFilter
  fallbackTexture.magFilter = THREE.NearestFilter
  fallbackTexture.generateMipmaps = false

  if (mesh.value && mesh.value.material) {
    mesh.value.material.map = fallbackTexture
    mesh.value.material.needsUpdate = true
  }

  return fallbackTexture
}

// ==================== 控制器设置 ====================

/**
 * 设置轨道控制器
 */
const setupOrbitControls = () => {
  logger.debug('设置轨道控制器')

  try {
    // 创建轨道控制器
    controls.value = new OrbitControls(camera.value, renderer.value.domElement)

    // 应用控制器配置
    applyControlsConfig()

    // 设置交互优化
    setupInteractionOptimizations()

    // 设置自定义滚轮缩放
    setupCustomZoom()

    // 触摸设备优化
    if ('ontouchstart' in window) {
      setupTouchOptimizations()
    }

    // 确保控制器生效
    setTimeout(() => {
      renderer.value.domElement.focus()
    }, 100)

    logger.info('轨道控制器设置完成')
  } catch (error) {
    logger.error('设置轨道控制器失败:', error)
    throw error
  }
}

/**
 * 应用控制器配置
 */
const applyControlsConfig = () => {
  // 基础控制设置
  controls.value.enableZoom = CONTROLS_CONFIG.ENABLE_ZOOM
  controls.value.enablePan = CONTROLS_CONFIG.ENABLE_PAN
  controls.value.autoRotate = autoRotateEnabled.value

  // 旋转速度设置
  controls.value.autoRotateSpeed = CONTROLS_CONFIG.AUTO_ROTATE_SPEED
  controls.value.rotateSpeed = CONTROLS_CONFIG.ROTATE_SPEED

  // 阻尼设置
  controls.value.enableDamping = true
  controls.value.dampingFactor = CONTROLS_CONFIG.DAMPING_FACTOR

  // 角度限制
  controls.value.minPolarAngle = CONTROLS_CONFIG.MIN_POLAR_ANGLE
  controls.value.maxPolarAngle = CONTROLS_CONFIG.MAX_POLAR_ANGLE
  controls.value.minAzimuthAngle = CONTROLS_CONFIG.MIN_AZIMUTH_ANGLE
  controls.value.maxAzimuthAngle = CONTROLS_CONFIG.MAX_AZIMUTH_ANGLE

  // 设置默认视角
  controls.value.target.set(0, 0, 0)
  controls.value.object.rotation.set(
    CAMERA_CONFIG.DEFAULT_ROTATION.x,
    CAMERA_CONFIG.DEFAULT_ROTATION.y,
    CAMERA_CONFIG.DEFAULT_ROTATION.z
  )
  controls.value.update()

  // 其他优化设置
  controls.value.screenSpacePanning = false
  controls.value.enableKeys = false
  controls.value.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  }
}

/**
 * 设置交互优化 - 使用 passive 事件监听器提升性能
 */
const setupInteractionOptimizations = () => {
  const domElement = renderer.value.domElement

  // 确保 canvas 元素可以接收焦点并优化交互
  domElement.setAttribute('tabindex', '0')
  domElement.style.outline = 'none'
  domElement.style.cursor = 'grab'

  // 🔧 性能优化：使用 passive 事件监听器
  const passiveOptions = { passive: true }

  // 鼠标交互优化
  const handleMouseEvent = (event) => {
    if (event.type === 'mousedown') {
      domElement.style.cursor = 'grabbing'
    } else if (event.type === 'mouseup' || event.type === 'mouseleave') {
      domElement.style.cursor = 'grab'
    }
  }

  // 使用 passive 选项监听鼠标事件
  domElement.addEventListener('mousedown', handleMouseEvent, passiveOptions)
  domElement.addEventListener('mouseup', handleMouseEvent, passiveOptions)
  domElement.addEventListener('mouseleave', handleMouseEvent, passiveOptions)

  // 设置初始焦点
  domElement.focus()
}

/**
 * 设置自定义滚轮缩放
 */
const setupCustomZoom = () => {
  renderer.value.domElement.addEventListener('wheel', (event) => {
    event.preventDefault()

    if (!camera.value) return

    // 计算缩放方向
    const delta = event.deltaY * 0.001
    const currentFov = camera.value.fov

    // 设置FOV范围 (30-120度)
    const minFov = 30
    const maxFov = 120

    // 计算新的FOV
    let newFov = currentFov + delta * 10
    newFov = Math.max(minFov, Math.min(maxFov, newFov))

    // 更新相机FOV
    camera.value.fov = newFov
    camera.value.updateProjectionMatrix()

    // 控制器同步
    if (controls.value) {
      controls.value.update()
    }

    logger.debug(`FOV: ${newFov.toFixed(1)}°`)
  }, { passive: false })
}

/**
 * 设置触摸设备优化
 */
const setupTouchOptimizations = () => {
  controls.value.enablePan = true
  controls.value.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }
}

// ==================== 事件处理 ====================

/**
 * 设置事件监听器
 */
const setupEventListeners = () => {
  logger.debug('设置事件监听器')

  // 窗口大小变化监听
  window.addEventListener('resize', handleResize)

  // 页面可见性变化监听
  document.addEventListener('visibilitychange', handleVisibilityChange)


}

/**
 * 处理窗口大小变化
 */
const handleResize = debounce(() => {
  if (!camera.value || !renderer.value || !containerRef.value) {
    return
  }

  // 更新相机宽高比
  camera.value.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.value.updateProjectionMatrix()

  // 更新渲染器尺寸
  renderer.value.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )

  // 保留 1.5 像素比限制
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  logger.debug('窗口大小变化已处理')
}, PERFORMANCE_CONFIG.RESIZE_DELAY)

/**
 * 页面可见性变化处理
 */
const handleVisibilityChange = () => {
  if (document.hidden) {
    // 页面隐藏时暂停渲染
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
    logger.debug('页面隐藏，暂停渲染')
  } else {
    // 页面显示时恢复渲染
    if (!animationId.value) {
      animate()
      logger.debug('页面显示，恢复渲染')
    }
  }
}

// ==================== 渲染循环 ====================

/**
 * 渲染动画循环 - 带智能帧率控制和性能监控
 */
const animate = () => {
  try {
    animationId.value = requestAnimationFrame(animate)
    // 更新控制器
    if (controls.value) {
      controls.value.update()
    }

    // 智能帧率控制
    const now = performance.now()
    const lastTime = lastRenderTime.value || now
    const deltaTime = now - lastTime

    // 判断是否需要高帧率渲染
    const needsHighFPS = controls.value?.autoRotate ||
        controls.value?.isUserInteracting ||
        deltaTime < 2000

    // 🔧 性能优化：非交互时降低到 30fps
    const targetFPS = needsHighFPS ? 60 : 30
    const frameTime = 1000 / targetFPS

    if (deltaTime >= frameTime || needsHighFPS) {
      lastRenderTime.value = now

      if (scene.value && camera.value && renderer.value) {
        renderer.value.render(scene.value, camera.value)

        // 更新性能监控
        performanceMonitor.update()
      }
    }
  } catch (error) {
    logger.error('渲染循环错误:', error)
  }
}

// ==================== 用户交互函数 ====================

/**
 * 双击切换自动旋转
 */
const toggleAutoRotate = () => {
  try {
    if (controls.value) {
      autoRotateEnabled.value = !autoRotateEnabled.value
      controls.value.autoRotate = autoRotateEnabled.value
      logger.info(`自动旋转: ${autoRotateEnabled.value ? '开启' : '关闭'}`)
    }
  } catch (error) {
    logger.error('切换自动旋转失败:', error)
  }
}

/**
 * 重置动画
 */
const resetAnimation = () => {
  try {
    animationComplete.value = false
    setTimeout(() => {
      if (cinematicAnimationsRef.value) {
        cinematicAnimationsRef.value.resetAnimation()
      }
    }, 100)
  } catch (error) {
    logger.error('重置动画失败:', error)
  }
}

/**
 * 动画完成回调 - 移动到目标位置
 */
const onAnimationComplete = () => {
  animationComplete.value = true
  logger.debug('动画完成，移动到目标位置')

  // 获取当前全景图的目标位置
  const targetPosition = currentPanorama.value.target || { x: 0, y: 0, z: 0 }

  // 使用 GSAP 平滑移动到目标位置
  gsap.to(camera.value.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 1,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (camera.value) {
        camera.value.lookAt(0, 0, 0)
        if (controls.value) {
          controls.value.update()
        }
      }
    },
    onComplete: () => {
      logger.info(`已移动到目标位置: (${targetPosition.x}, ${targetPosition.y}, ${targetPosition.z})`)
    }
  })

  // 恢复默认 FOV
  gsap.to(camera.value, {
    fov: 75,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => {
      if (camera.value) {
        camera.value.updateProjectionMatrix()
      }
    }
  })
}


/**
 * 预设视角函数
 * @param {string} preset - 预设视角名称
 */
const setCameraView = (preset) => {
  try {
    if (!camera.value || !controls.value) {
      logger.warn('相机或控制器未初始化，无法设置视角')
      return
    }

    // 确保目标点在球心
    controls.value.target.set(0, 0, 0)

    // 获取预设配置
    const presetConfig = VIEW_PRESETS[preset.toUpperCase()] || VIEW_PRESETS.DEFAULT
    const { theta: targetTheta, phi: targetPhi } = presetConfig

    // 获取当前球坐标
    const currentSpherical = new THREE.Spherical()
    const offset = new THREE.Vector3()
    offset.copy(controls.value.object.position).sub(controls.value.target)
    currentSpherical.setFromVector3(offset)

    // 处理角度差异（选择最短路径）
    let thetaDiff = targetTheta - currentSpherical.theta
    while (thetaDiff > Math.PI) thetaDiff -= 2 * Math.PI
    while (thetaDiff < -Math.PI) thetaDiff += 2 * Math.PI

    const targetThetaAdjusted = currentSpherical.theta + thetaDiff

    // 使用GSAP创建流畅动画
    gsap.to(currentSpherical, {
      theta: targetThetaAdjusted,
      phi: targetPhi,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        try {
          // 限制极角在控制器范围内
          currentSpherical.phi = Math.max(
            controls.value.minPolarAngle,
            Math.min(controls.value.maxPolarAngle, currentSpherical.phi)
          )
          currentSpherical.makeSafe()

          // 从当前位置平滑过渡到新位置
          controls.value.object.position.setFromSpherical(currentSpherical)
          controls.value.object.lookAt(controls.value.target)
          controls.value.update()
        } catch (error) {
          logger.error('视角更新错误:', error)
        }
      },
      onComplete: () => {
        logger.info(`切换到预设视角: ${preset}`)
      }
    })
  } catch (error) {
    logger.error('设置预设视角失败:', error)
  }
}

// ==================== 资源清理 ====================

/**
 * 清理资源 - 确保所有资源被正确释放
 */
const cleanup = () => {
  try {
    logger.info('开始清理Three.js资源')

    // 清理动画帧
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }

    // 清理事件监听器
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    // 移除 canvas 事件监听器
    const domElement = renderer.value?.domElement
    if (domElement) {
      const clone = domElement.cloneNode(true)
      domElement.parentNode.replaceChild(clone, domElement)
    }

    // 销毁控制器
    if (controls.value) {
      controls.value.dispose()
      controls.value = null
    }

    // 销毁渲染器
    if (renderer.value) {
      renderer.value.dispose()
      renderer.value = null
    }

    // 清理几何体和材质
    if (mesh.value) {
      if (mesh.value.geometry) {
        mesh.value.geometry.dispose()
        mesh.value.geometry = null
      }
      if (mesh.value.material) {
        // 深度清理材质属性
        if (mesh.value.material.map) {
          mesh.value.material.map.dispose()
          mesh.value.material.map = null
        }
        mesh.value.material.dispose()
        mesh.value.material = null
      }
      scene.value?.remove(mesh.value)
      mesh.value = null
    }

    // 清理纹理
    if (texture.value) {
      texture.value.dispose()
      texture.value = null
    }

    // 清理场景
    if (scene.value) {
      scene.value.clear()
      scene.value = null
    }

    // 强制垃圾回收提示（仅开发环境）
    if (process.env.NODE_ENV === 'development' && window.gc) {
      window.gc()
    }

    logger.info('Three.js资源清理完成')
  } catch (error) {
    logger.error('Three.js资源清理失败:', error)
  }
}

// ==================== 初始化函数 ====================

/**
 * 初始化Three.js
 */
const initThreeJS = async () => {
  try {
    logger.info('开始初始化Three.js')

    // 创建场景
    scene.value = createScene()

    // 创建相机
    camera.value = createCamera()

    // 创建渲染器
    renderer.value = createRenderer()

    // 创建球体几何体
    mesh.value = createSphereGeometry()

    // 设置轨道控制器
    setupOrbitControls()

    // 设置事件监听器
    setupEventListeners()

    // 加载初始纹理
    await loadTexture(currentPanorama.value.image)

    // 启动渲染循环
    animate()

    isInitialized.value = true
    logger.info('Three.js初始化完成')
  } catch (error) {
    logger.error('初始化Three.js失败:', error)
    isLoading.value = false
    throw error
  }
}

// ==================== 生命周期钩子 ====================

onMounted(async () => {
  try {
    // 设置CSS变量
    const root = document.documentElement
    root.style.setProperty('--background-color', STYLE_CONFIG.BACKGROUND_COLOR)
    root.style.setProperty('--text-color', STYLE_CONFIG.TEXT_COLOR)
    root.style.setProperty('--primary-color', STYLE_CONFIG.PRIMARY_COLOR)

    await initThreeJS()
  } catch (error) {
    logger.error('组件挂载失败:', error)
  }
})

// 监听动画类型变化
watch(animationType, () => {
  if (cinematicAnimationsRef.value?.resetAnimation) {
    cinematicAnimationsRef.value.resetAnimation()
  }
})

onUnmounted(() => {
  try {
    cleanup()
  } catch (error) {
    logger.error('组件卸载清理失败:', error)
  }
})
</script>
<style scoped lang="scss">
.home-content {
  width: 100vw;
  height: 100vh;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background: var(--background-color, #000000);

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    touch-action: none;
    user-select: none;

    // 提升图像渲染质量
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;

    // 优化移动端体验
    @media (pointer: coarse) {
      touch-action: pan-y pinch-zoom;
    }
  }

}

</style>
