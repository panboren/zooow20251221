<template>
  <div class="home-page">
    <Home></Home>
  </div>
</template>

<script setup lang="ts">
import Home from './home/home.vue'


</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>














<!--
<template>
  <div class="home-page" :class="{ 'dark': isDark }">
    &lt;!&ndash; Three.js Canvas &ndash;&gt;
    <canvas ref="canvasRef" class="three-canvas" />

    &lt;!&ndash; Dark Mode Toggle &ndash;&gt;
    <div class="fixed top-4 right-4 z-50">
      <el-button
        circle
        size="small"
        class="theme-btn"
        @click="toggleColorMode"
      >
        {{ isDark ? '🌙' : '☀️' }}
      </el-button>
    </div>

    &lt;!&ndash; Content Overlay &ndash;&gt;
    <div class="content-overlay">
      <h1 class="title">Three.js 3D 场景</h1>
      <p class="subtitle">使用 GSAP 动画的旋转方块</p>
      <el-button type="primary" @click="triggerAnimation">触发动画</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, shallowRef } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import type { SeoMeta } from '~/types'


// SEO 元数据
const seoMeta: SeoMeta = {
  title: '企业产品官网',
  description: '专业的企业产品展示官网，使用最新技术构建',
  keywords: '企业,产品,官网',
  ogType: 'website',
}

useSeoMeta({
  title: seoMeta.title,
  description: seoMeta.description,
  keywords: seoMeta.keywords,
  ogType: seoMeta.ogType,
})

// 获取当前主题
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 切换主题
const toggleColorMode = () => {
  colorMode.value = isDark.value ? 'light' : 'dark'
}

// Three.js 相关
const canvasRef = ref<HTMLCanvasElement | null>(null)
const scene = shallowRef<THREE.Scene | null>(null)
const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
const renderer = shallowRef<THREE.WebGLRenderer | null>(null)
const cube = shallowRef<THREE.Mesh | null>(null)
const animationId = ref<number | null>(null)

// 初始化 Three.js 场景
const initThreeJS = () => {
  if (!canvasRef.value) return

  // 创建场景
  scene.value = new THREE.Scene()
  scene.value.background = new THREE.Color(isDark.value ? '#1a1a2e' : '#f5f5f5')

  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.value.position.z = 5

  // 创建渲染器
  renderer.value = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.value.setSize(window.innerWidth, window.innerHeight)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 创建方块
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshPhongMaterial({
    color: isDark.value ? 0x6c5ce7 : 0x0984e3,
    shininess: 100
  })
  cube.value = new THREE.Mesh(geometry, material)
  scene.value.add(cube.value)

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.value.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.value.add(directionalLight)

  // 开始动画循环
  animate()
}

// 动画循环
const animate = () => {
  animationId.value = requestAnimationFrame(animate)

  if (cube.value) {
    cube.value.rotation.x += 0.01
    cube.value.rotation.y += 0.01
  }

  if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value)
  }
}

// 触发 GSAP 动画
const triggerAnimation = () => {
  if (!cube.value) return

  // 使用 GSAP 创建旋转动画
  gsap.to(cube.value.rotation, {
    x: cube.value.rotation.x + Math.PI * 2,
    y: cube.value.rotation.y + Math.PI * 2,
    duration: 2,
    ease: 'elastic.out(1, 0.3)'
  })

  // 同时缩放动画
  gsap.to(cube.value.scale, {
    x: 1.5,
    y: 1.5,
    z: 1.5,
    duration: 0.5,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  })
}

// 处理窗口大小变化
const handleResize = () => {
  if (!camera.value || !renderer.value) return

  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()
  renderer.value.setSize(window.innerWidth, window.innerHeight)
}

// 清理资源
const cleanup = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }

  if (renderer.value) {
    renderer.value.dispose()
    renderer.value = null
  }

  if (cube.value) {
    cube.value.geometry.dispose()
    cube.value.material.dispose()
    cube.value = null
  }

  window.removeEventListener('resize', handleResize)
}

// 生命周期钩子
onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', handleResize)

  // 初始动画
  setTimeout(() => {
    triggerAnimation()
  }, 1000)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.three-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  color: #333;

  .title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
}

.theme-btn {
  font-size: 16px;
  padding: 8px;
}

.dark .content-overlay {
  color: #fff;
}
</style>
-->
