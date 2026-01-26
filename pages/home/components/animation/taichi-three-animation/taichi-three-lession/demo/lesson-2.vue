<template>
  <div class="lesson-page">
    <div id="canvas-container" class="canvas-container"></div>
    
    <div class="info-panel">
      <div class="lesson-header">
        <h3>第2课：Three.js 基础场景搭建</h3>
        <span class="lesson-tag">基础渲染</span>
      </div>

      <div class="controls">
        <label>
          旋转速度: {{ rotationSpeed.toFixed(2) }}
          <input type="range" v-model.number="rotationSpeed" min="0" max="2" step="0.01" />
        </label>
        <label>
          物体大小: {{ objectSize }}
          <input type="range" v-model.number="objectSize" min="0.5" max="3" step="0.1" />
        </label>
      </div>

      <div class="info-section">
        <h4>📚 核心组件</h4>
        <ul>
          <li><strong>Scene</strong> - 场景，所有3D对象的容器</li>
          <li><strong>Camera</strong> - 相机，定义视角和视野</li>
          <li><strong>Renderer</strong> - 渲染器，负责绘制场景</li>
          <li><strong>Geometry</strong> - 几何体，定义物体的形状</li>
          <li><strong>Material</strong> - 材质，定义物体的外观</li>
          <li><strong>Mesh</strong> - 网格，几何体+材质的组合</li>
        </ul>
      </div>

      <div class="info-section">
        <h4>🎯 Three.js 角色</h4>
        <p>
          在 Taichi.js + Three.js 架构中，Three.js 负责<strong>高质量3D渲染</strong>。
          它不参与物理计算，专注于展示计算结果。
        </p>
      </div>

      <div class="code-section">
        <h4>💻 代码结构</h4>
        <pre><code>// 1. 创建场景
const scene = new THREE.Scene()

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,    // 视野角度
  width/height,  // 宽高比
  0.1,   // 近裁剪面
  1000   // 远裁剪面
)
camera.position.set(0, 5, 10)

// 3. 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
container.appendChild(renderer.domElement)

// 4. 添加灯光
const light = new THREE.PointLight(0xffffff, 1)
light.position.set(10, 10, 10)
scene.add(light)

// 5. 创建物体
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshStandardMaterial({ 
  color: 0x00aaff 
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// 6. 渲染循环
function animate() {
  requestAnimationFrame(animate)
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()</code></pre>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">
          ← 第1课：Hello World
        </button>
        <button class="nav-btn next" @click="goToNext">
          第3课：第一个粒子系统 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { ref, onMounted, onUnmounted } from 'vue'

const rotationSpeed = ref(0.5)
const objectSize = ref(1)

// Three.js 变量
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let cube: THREE.Mesh | null = null
let sphere: THREE.Mesh | null = null
let torus: THREE.Mesh | null = null
let animationId: number = 0

function initThreeJS() {
  console.log('初始化 Three.js...')
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000510)

  // 创建相机
  const container = document.getElementById('canvas-container')
  const width = container?.clientWidth || window.innerWidth
  const height = container?.clientHeight || window.innerHeight
  
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 5, 12)
  camera.lookAt(0, 0, 0)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  if (container) {
    container.appendChild(renderer.domElement)
  }

  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight(0x00aaff, 1.5)
  pointLight1.position.set(10, 10, 10)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0xff4400, 1.5)
  pointLight2.position.set(-10, -10, 10)
  scene.add(pointLight2)

  // 创建物体
  createObjects()
  
  console.log('Three.js 初始化成功')
}

function createObjects() {
  if (!scene) return

  // 立方体
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
  const cubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00aaff,
    metalness: 0.5,
    roughness: 0.3
  })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(-4, 0, 0)
  scene.add(cube)

  // 球体
  const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff4400,
    metalness: 0.6,
    roughness: 0.2
  })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(0, 0, 0)
  scene.add(sphere)

  // 圆环
  const torusGeometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100)
  const torusMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ff88,
    metalness: 0.4,
    roughness: 0.4
  })
  torus = new THREE.Mesh(torusGeometry, torusMaterial)
  torus.position.set(4, 0, 0)
  scene.add(torus)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const time = Date.now() * 0.001
  const speed = rotationSpeed.value
  const scale = objectSize.value

  // 旋转立方体
  if (cube) {
    cube.rotation.x += 0.01 * speed
    cube.rotation.y += 0.02 * speed
    cube.scale.setScalar(scale)
  }

  // 旋转球体
  if (sphere) {
    sphere.position.y = Math.sin(time * 2 * speed) * 1
    sphere.scale.setScalar(scale * 1.2)
  }

  // 旋转圆环
  if (torus) {
    torus.rotation.x += 0.02 * speed
    torus.rotation.z += 0.01 * speed
    torus.scale.setScalar(scale * 0.9)
  }

  // 渲染
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

function onWindowResize() {
  if (!camera || !renderer) return
  const container = document.getElementById('canvas-container')
  const width = container?.clientWidth || window.innerWidth
  const height = container?.clientHeight || window.innerHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function cleanup() {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  
  if (renderer) {
    const container = document.getElementById('canvas-container')
    if (container && renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }
  
  if (cube) {
    cube.geometry.dispose()
    ;(cube.material as THREE.Material).dispose()
  }
  if (sphere) {
    sphere.geometry.dispose()
    ;(sphere.material as THREE.Material).dispose()
  }
  if (torus) {
    torus.geometry.dispose()
    ;(torus.material as THREE.Material).dispose()
  }
}

function goToPrev() {
  alert('返回第1课：Hello World')
}

function goToNext() {
  alert('即将进入第3课：第一个粒子系统')
}

onMounted(() => {
  initThreeJS()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped lang="scss">
.lesson-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.canvas-container {
  flex: 1;
  width: 100%;
  height: 100%;
}

.info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 380px;
  max-height: calc(100vh - 40px);
  background: rgba(0, 5, 16, 0.95);
  border-radius: 16px;
  border: 1px solid rgba(0, 170, 255, 0.3);
  padding: 25px;
  color: white;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 170, 255, 0.4);
    border-radius: 4px;
  }

  .lesson-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 170, 255, 0.2);

    h3 {
      margin: 0;
      font-size: 18px;
      color: #00ff88;
    }

    .lesson-tag {
      padding: 4px 12px;
      background: rgba(0, 255, 136, 0.2);
      border: 1px solid rgba(0, 255, 136, 0.4);
      border-radius: 12px;
      font-size: 12px;
      color: #00ff88;
    }
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(0, 50, 100, 0.15);
    border-radius: 8px;

    label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;

      input[type="range"] {
        flex: 1;
        cursor: pointer;
      }
    }
  }

  .info-section {
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 15px;
      color: #88ccff;
    }

    p {
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);

      strong {
        color: #00ff88;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 6px 0 6px 20px;
        position: relative;
        font-size: 13px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.85);

        strong {
          color: #ffc800;
        }

        &:before {
          content: '•';
          position: absolute;
          left: 0;
          color: #00aaff;
        }
      }
    }
  }

  .code-section {
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 8px;
    border: 1px solid rgba(0, 255, 136, 0.15);

    h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #00ff88;
    }

    pre {
      margin: 0;
      overflow-x: auto;

      code {
        font-family: 'Courier New', monospace;
        font-size: 11px;
        line-height: 1.4;
        color: #aaffaa;
      }
    }
  }

  .navigation {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(0, 170, 255, 0.2);

    .nav-btn {
      flex: 1;
      padding: 10px 15px;
      background: rgba(0, 170, 255, 0.2);
      border: 1px solid rgba(0, 170, 255, 0.3);
      border-radius: 8px;
      color: #00aaff;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;

      &:hover {
        background: rgba(0, 170, 255, 0.3);
      }
    }
  }
}
</style>
