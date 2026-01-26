<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第13课：Taichi.js 与 Three.js 数据交互总结</h2>
          <span class="lesson-tag">数据共享与交互</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>总结 Taichi.js 和 Three.js 的数据共享机制</li>
            <li>掌握不同数据传输模式的优缺点</li>
            <li>理解 WebGPU 共享纹理的使用</li>
            <li>学习高效的数据同步策略</li>
            <li>实践性能优化技巧</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 数据传输模式对比</h3>
          <div class="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>模式</th>
                  <th>速度</th>
                  <th>复杂度</th>
                  <th>适用场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>WebGPU 共享纹理</td>
                  <td class="excellent">极快</td>
                  <td class="high">高</td>
                  <td>需要最高性能的场景</td>
                </tr>
                <tr>
                  <td>Canvas 纹理上传</td>
                  <td class="good">快</td>
                  <td class="medium">中</td>
                  <td>大多数应用场景</td>
                </tr>
                <tr>
                  <td>ArrayBuffer 转换</td>
                  <td class="fair">一般</td>
                  <td class="low">低</td>
                  <td>简单应用或调试</td>
                </tr>
                <tr>
                  <td>toTypedArray()</td>
                  <td class="slow">慢</td>
                  <td class="low">低</td>
                  <td>原型开发</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="section">
          <h3>📊 核心概念回顾</h3>
          <div class="concept-card">
            <h4>1. Taichi.js 字段系统</h4>
            <p>Taichi.js 使用字段来管理 GPU 上的数据：</p>
            <pre><code>// 标量字段
const positions = ti.field(ti.f32, [N])

// 向量字段
const velocities = ti.Vector.field(3, ti.f32, [N])

// 矩阵字段
const transforms = ti.Matrix.field(3, 3, ti.f32, [N])

// 纹理字段
const texture = ti.field(ti.f32, [width, height])</code></pre>
          </div>

          <div class="concept-card">
            <h4>2. Three.js BufferGeometry</h4>
            <p>Three.js 使用 BufferGeometry 存储顶点数据：</p>
            <pre><code>// 创建 BufferGeometry
const geometry = new THREE.BufferGeometry()

// 设置位置属性
const positions = new Float32Array(N * 3)
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// 设置颜色属性
const colors = new Float32Array(N * 3)
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// 使用实例化
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  N
)</code></pre>
          </div>

          <div class="concept-card">
            <h4>3. 数据同步流程</h4>
            <div class="flow-diagram">
              <div class="flow-step">
                <span class="step-num">1</span>
                <div class="step-content">
                  <h5>Taichi.js 计算</h5>
                  <p>GPU 并行计算物理模拟</p>
                </div>
              </div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step">
                <span class="step-num">2</span>
                <div class="step-content">
                  <h5>数据传输</h5>
                  <p>从 GPU 传输到 CPU</p>
                </div>
              </div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step">
                <span class="step-num">3</span>
                <div class="step-content">
                  <h5>更新 Three.js</h5>
                  <p>更新 BufferAttribute</p>
                </div>
              </div>
              <div class="flow-arrow">↓</div>
              <div class="flow-step">
                <span class="step-num">4</span>
                <div class="step-content">
                  <h5>渲染</h5>
                  <p>GPU 渲染场景</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💡 最佳实践</h3>
          <div class="tips-container">
            <div class="tip-card">
              <h4>1. 减少数据传输</h4>
              <p>尽量减少 CPU-GPU 之间的数据传输次数：</p>
              <pre><code>// 差：每帧都传输
function animate() {
  await simulation.step()
  const data = await positions.toArray()
  updateThreeJS(data)
}

// 好：批量更新
function animate() {
  await simulation.step()
  // 只在需要时更新
  if (needsUpdate) {
    const data = await positions.toArray()
    updateThreeJS(data)
  }
}</code></pre>
            </div>

            <div class="tip-card">
              <h4>2. 使用实例化渲染</h4>
              <p>对于大量粒子，使用 InstancedMesh 提高性能：</p>
              <pre><code>// 创建实例化网格
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  particleCount
)

// 更新实例矩阵
const dummy = new THREE.Object3D()
for (let i = 0; i < particleCount; i++) {
  dummy.position.set(pos[i][0], pos[i][1], pos[i][2])
  dummy.updateMatrix()
  instancedMesh.setMatrixAt(i, dummy.matrix)
}

instancedMesh.instanceMatrix.needsUpdate = true</code></pre>
            </div>

            <div class="tip-card">
              <h4>3. 使用纹理传输数据</h4>
              <p>对于二维数据，使用纹理传输更高效：</p>
              <pre><code>// Taichi.js 创建纹理
const textureField = ti.field(ti.f32, [width, height])
ti.addToKernelScope({ textureField })

// Three.js 创建纹理
const texture = new THREE.DataTexture(
  new Float32Array(width * height),
  width,
  height,
  THREE.RedFormat,
  THREE.FloatType
)

// 更新纹理数据
const data = await textureField.toArray()
texture.image.data = new Float32Array(data)
texture.needsUpdate = true</code></pre>
            </div>

            <div class="tip-card">
              <h4>4. 性能监控</h4>
              <p>使用性能监控工具优化瓶颈：</p>
              <pre><code>// 监控计算时间
const computeStart = performance.now()
await simulation.step()
const computeTime = performance.now() - computeStart

// 监控渲染时间
const renderStart = performance.now()
renderer.render(scene, camera)
const renderTime = performance.now() - renderStart

// 监控数据传输时间
const transferStart = performance.now()
const data = await positions.toArray()
const transferTime = performance.now() - transferStart

console.log({
  compute: computeTime.toFixed(2),
  transfer: transferTime.toFixed(2),
  render: renderTime.toFixed(2)
})</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🔧 实用代码模板</h3>
          <div class="code-demo">
            <h4>完整的粒子系统模板</h4>
            <pre><code>import * as ti from 'taichi.js'
import * as THREE from 'three'

// 1. 初始化 Taichi.js
await ti.init()

// 2. 定义粒子数量
const N = 10000

// 3. 创建字段
const positions = ti.Vector.field(3, ti.f32, [N])
const velocities = ti.Vector.field(3, ti.f32, [N])
const colors = ti.Vector.field(3, ti.f32, [N])

// 4. 初始化数据
ti.addToKernelScope({ positions, velocities, colors })
const init = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] = [0, 0, 0]
    velocities[i] = [
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ]
    colors[i] = [1, 1, 1]
  }
})

await init()

// 5. 创建更新内核
const update = ti.kernel(() => {
  for (let i of ti.range(N)) {
    // 简单的物理更新
    positions[i] += velocities[i] * 0.01

    // 边界反弹
    if (positions[i][0] > 10 || positions[i][0] < -10) {
      velocities[i][0] *= -1
    }
    if (positions[i][1] > 10 || positions[i][1] < -10) {
      velocities[i][1] *= -1
    }
    if (positions[i][2] > 10 || positions[i][2] < -10) {
      velocities[i][2] *= -1
    }

    // 根据位置更新颜色
    colors[i] = [
      (positions[i][0] + 10) / 20,
      (positions[i][1] + 10) / 20,
      (positions[i][2] + 10) / 20
    ]
  }
})

// 6. 初始化 Three.js
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 20

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 7. 创建粒子几何体
const geometry = new THREE.BufferGeometry()
const posArray = new Float32Array(N * 3)
const colorArray = new Float32Array(N * 3)

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

// 8. 创建粒子材质
const material = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
})

// 9. 创建粒子系统
const particles = new THREE.Points(geometry, material)
scene.add(particles)

// 10. 动画循环
async function animate() {
  requestAnimationFrame(animate)

  // 更新 Taichi.js
  await update()

  // 获取数据
  const posData = await positions.toArray()
  const colorData = await colors.toArray()

  // 更新 Three.js
  for (let i = 0; i < N; i++) {
    posArray[i * 3] = posData[i * 3]
    posArray[i * 3 + 1] = posData[i * 3 + 1]
    posArray[i * 3 + 2] = posData[i * 3 + 2]

    colorArray[i * 3] = colorData[i * 3]
    colorArray[i * 3 + 1] = colorData[i * 3 + 1]
    colorArray[i * 3 + 2] = colorData[i * 3 + 2]
  }

  geometry.attributes.position.needsUpdate = true
  geometry.attributes.color.needsUpdate = true

  // 渲染
  renderer.render(scene, camera)
}

animate()</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>📈 性能优化建议</h3>
          <div class="optimization-list">
            <div class="optimization-item">
              <h4>🚀 计算优化</h4>
              <ul>
                <li>使用空间哈希减少计算复杂度</li>
                <li>优化循环边界检查</li>
                <li>使用适当的 workgroup 大小</li>
                <li>减少内存访问次数</li>
              </ul>
            </div>

            <div class="optimization-item">
              <h4>📤 传输优化</h4>
              <ul>
                <li>使用 WebGPU 共享纹理（零拷贝）</li>
                <li>批量传输而非频繁传输</li>
                <li>只传输变化的数据</li>
                <li>使用压缩格式减少带宽</li>
              </ul>
            </div>

            <div class="optimization-item">
              <h4>🎨 渲染优化</h4>
              <ul>
                <li>使用实例化渲染减少 draw call</li>
                <li>使用 Points 或 InstancedMesh</li>
                <li>启用视锥体剔除</li>
                <li>使用 LOD（细节级别）</li>
              </ul>
            </div>

            <div class="optimization-item">
              <h4>💾 内存优化</h4>
              <ul>
                <li>复用 buffer 避免频繁分配</li>
                <li>使用合适的数据类型（f32 vs f64）</li>
                <li>及时释放不再使用的数据</li>
                <li>使用纹理池管理内存</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🎓 课程总结</h3>
          <div class="summary-box">
            <h4>核心要点</h4>
            <ul>
              <li><strong>数据传输是瓶颈</strong>：CPU-GPU 数据传输通常比计算和渲染慢得多</li>
              <li><strong>选择合适的模式</strong>：根据应用需求选择最佳的数据传输模式</li>
              <li><strong>减少传输次数</strong>：批量更新，避免频繁的小数据传输</li>
              <li><strong>利用 GPU 能力</strong>：尽可能在 GPU 上完成计算，减少 CPU 参与</li>
              <li><strong>性能监控</strong>：持续监控各环节性能，找出并优化瓶颈</li>
            </ul>
          </div>

          <div class="next-lessons">
            <h4>后续学习方向</h4>
            <div class="lesson-grid">
              <div class="lesson-card">
                <h5>第14课</h5>
                <p>柔体动力学与布料模拟</p>
              </div>
              <div class="lesson-card">
                <h5>第15课</h5>
                <p>流体动力学高级应用</p>
              </div>
              <div class="lesson-card">
                <h5>第16课</h5>
                <p>刚体动力学与碰撞系统</p>
              </div>
              <div class="lesson-card">
                <h5>第17课</h5>
                <p>GPU 加速的空间数据结构</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">
          ← 第12课：综合项目
        </button>
        <button class="nav-btn next" @click="goToNext">
          第14课：柔体动力学 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第14课即将推出！')
}

onMounted(() => {
  console.log('第13课：Taichi.js 与 Three.js 数据交互总结')
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
  max-width: 1000px;
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
      margin: 0 0 20px 0;
      font-size: 24px;
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

    h4 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #88ccff;
    }

    h5 {
      margin: 0 0 5px 0;
      font-size: 16px;
      color: #aaddff;
    }
  }

  .comparison-table {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    overflow: hidden;

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      th {
        background: rgba(0, 170, 255, 0.2);
        color: #00aaff;
        font-weight: 600;
      }

      td {
        color: rgba(255, 255, 255, 0.9);
      }

      .excellent {
        color: #00ff88;
        font-weight: bold;
      }

      .good {
        color: #88ff00;
      }

      .fair {
        color: #ffaa00;
      }

      .slow {
        color: #ff4444;
      }

      .high, .medium, .low {
        font-weight: bold;
      }

      .high {
        color: #ff4444;
      }

      .medium {
        color: #ffaa00;
      }

      .low {
        color: #00ff88;
      }
    }
  }

  .concept-card {
    background: rgba(0, 50, 100, 0.2);
    border: 1px solid rgba(0, 170, 255, 0.2);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;

    pre {
      background: rgba(0, 0, 0, 0.5);
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 10px 0;

      code {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.6;
        color: #aaffaa;
      }
    }
  }

  .flow-diagram {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin: 20px 0;

    .flow-step {
      display: flex;
      align-items: center;
      gap: 15px;
      width: 100%;

      .step-num {
        width: 35px;
        height: 35px;
        background: rgba(0, 255, 136, 0.3);
        border: 2px solid #00ff88;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
        color: #00ff88;
        flex-shrink: 0;
      }

      .step-content {
        flex: 1;

        h5 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #88ccff;
        }

        p {
          margin: 0;
          font-size: 13px;
        }
      }
    }

    .flow-arrow {
      font-size: 24px;
      color: rgba(0, 255, 136, 0.5);
    }
  }

  .tips-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 15px;

    .tip-card {
      background: rgba(255, 200, 0, 0.1);
      border: 1px solid rgba(255, 200, 0, 0.3);
      border-radius: 10px;
      padding: 15px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 15px;
        color: #ffc800;
      }

      p {
        font-size: 13px;
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.8);
      }

      pre {
        background: rgba(0, 0, 0, 0.4);
        padding: 10px;
        border-radius: 6px;
        font-size: 11px;

        code {
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
    margin-bottom: 20px;

    h4 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #00ff88;
    }

    pre {
      background: rgba(0, 0, 0, 0.6);
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;

      code {
        font-family: 'Courier New', monospace;
        font-size: 11px;
        line-height: 1.6;
        color: #aaffaa;
      }
    }
  }

  .optimization-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;

    .optimization-item {
      background: rgba(0, 100, 150, 0.15);
      border: 1px solid rgba(0, 150, 200, 0.3);
      border-radius: 10px;
      padding: 15px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 15px;
        color: #88ddff;
      }

      ul {
        padding-left: 20px;

        li {
          padding: 5px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);

          &:before {
            content: '•';
            position: absolute;
            left: 5px;
            color: #00ff88;
          }
        }
      }
    }
  }

  .summary-box {
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;

    h4 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #00ff88;
    }

    ul {
      li {
        padding: 10px 0 10px 25px;

        strong {
          color: #00ff88;
        }
      }
    }
  }

  .next-lessons {
    h4 {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: #88ccff;
    }

    .lesson-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;

      .lesson-card {
        background: rgba(0, 50, 100, 0.2);
        border: 1px solid rgba(0, 170, 255, 0.3);
        border-radius: 10px;
        padding: 15px;
        text-align: center;

        h5 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #00aaff;
        }

        p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
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
