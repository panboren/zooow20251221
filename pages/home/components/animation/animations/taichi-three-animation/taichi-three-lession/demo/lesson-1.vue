<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第1课：Hello World - 认识 Taichi.js</h2>
          <span class="lesson-tag">入门</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 Taichi.js 的基本概念</li>
            <li>学习 @ti.kernel 装饰器</li>
            <li>了解字段系统（Field System）</li>
            <li>创建第一个 GPU 计算程序</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 Taichi.js 是什么？</h3>
          <p>
            Taichi.js 是一个现代的 GPU 计算框架，它将 JavaScript 函数转换为 WebGPU Compute Shader，
            实现大规模并行计算。它是 Python 版 Taichi 的 JavaScript 移植版。
          </p>
          <div class="highlight-box">
            <strong>核心特点：</strong>
            <ul>
              <li>⚡ 利用 GPU 进行大规模并行计算</li>
              <li>🔧 将 JS 代码自动转换为 Compute Shader</li>
              <li>📦 简洁的语法，类似 Python Taichi</li>
              <li>🌐 基于 WebGPU，支持现代浏览器</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h3>📖 核心概念</h3>
          <div class="concept-card">
            <h4>1. @ti.kernel（计算内核）</h4>
            <p>
              <code>@ti.kernel</code> 装饰的函数会在 GPU 上并行执行。
              每个元素的计算都是独立的，可以同时处理成千上万个数据。
            </p>
            <pre><code>// Taichi.js 计算内核示例
let kernel = ti.kernel((n) => {
  for (let i = 0; i < n; i++) {
    // 这里的循环会被 GPU 并行执行
    result[i] = i * i
  }
})</code></pre>
          </div>

          <div class="concept-card">
            <h4>2. 字段（Field）</h4>
            <p>
              字段是 Taichi.js 中的核心数据结构，存储在 GPU 显存中。
              可以是一维、二维、三维数组，支持标量、向量、矩阵等类型。
            </p>
            <pre><code>// 创建字段
let scalarField = ti.field(ti.f32, [100])           // 1D 标量字段
let vectorField = ti.Vector.field(3, ti.f32, [100]) // 1D 向量字段
let matrixField = ti.Matrix.field(2, 2, ti.f32, [50]) // 2D 矩阵字段</code></pre>
          </div>

          <div class="concept-card">
            <h4>3. 数据类型</h4>
            <p>Taichi.js 支持多种数据类型：</p>
            <ul>
              <li><code>ti.f32</code> - 32位浮点数（最常用）</li>
              <li><code>ti.i32</code> - 32位整数</li>
              <li><code>ti.Vector</code> - 向量类型</li>
              <li><code>ti.Matrix</code> - 矩阵类型</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h3>💻 代码演示</h3>
          <div class="code-demo">
            <h4>示例：计算平方数</h4>
            <pre><code>// 1. 初始化 Taichi.js
await ti.init()

// 2. 创建字段（GPU 数据）
const n = 1000
const result = ti.field(ti.f32, [n])

// 3. 添加到内核作用域
ti.addToKernelScope({ result, n })

// 4. 创建计算内核
const computeSquares = ti.kernel(() => {
  for (let i = 0; i < n; i++) {
    result[i] = i * i
  }
})

// 5. 执行内核
computeSquares()

// 6. 读取结果
for (let i = 0; i < 10; i++) {
  console.log(`result[${i}] = ${result[i]}`)
}</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                数据量 N:
                <input type="range" v-model.number="demoN" min="100" max="10000" step="100" />
                {{ demoN }}
              </label>
              <button @click="runDemo" :disabled="isRunning">
                {{ isRunning ? '运行中...' : '运行演示' }}
              </button>
              <button @click="clearResult">清除结果</button>
            </div>
            <div class="demo-result">
              <h4>执行结果</h4>
              <div class="result-stats">
                <p>状态: <span :class="statusClass">{{ status }}</span></p>
                <p>执行时间: {{ executionTime.toFixed(2) }}ms</p>
                <p>计算结果（前10个）:</p>
              </div>
              <div class="result-values">
                <span v-for="(val, idx) in displayResults" :key="idx" class="result-value">
                  result[{{ idx }}] = {{ val }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ Taichi.js 的基本概念和优势</li>
            <li>✅ 如何创建和使用字段</li>
            <li>✅ 如何编写计算内核</li>
          </ul>
          <p class="next-lesson">
            下一课将学习 Three.js 基础场景搭建，为后续的协作打下基础。
          </p>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" disabled>
          ← 上一课
        </button>
        <button class="nav-btn next" @click="goToNext">
          第2课：Three.js 基础场景搭建 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 演示参数
const demoN = ref(1000)
const isRunning = ref(false)
const status = ref('就绪')
const executionTime = ref(0)
const results = ref<number[]>([])

const statusClass = computed(() => {
  if (status.value === '运行成功') return 'success'
  if (status.value === '运行失败') return 'error'
  return 'idle'
})

const displayResults = computed(() => {
  return results.value.slice(0, 10)
})

async function runDemo() {
  isRunning.value = true
  status.value = '初始化 Taichi.js...'
  results.value = []

  try {
    // 尝试初始化 Taichi.js
    let ti: any = null
    
    // 检查全局 ti
    if ((window as any).ti) {
      ti = (window as any).ti
      await ti.init()
    } else {
      // 尝试动态导入
      const taichiModule = await import('taichi.js')
      ti = taichiModule
      await ti.init()
    }

    status.value = '创建字段...'
    const n = demoN.value

    // 创建字段 - 使用 ti.f32 作为类型
    const result = ti.field(ti.f32, [n])
    ti.addToKernelScope({ result, n })

    status.value = '创建内核...'
    const computeSquares = ti.kernel(() => {
      // 使用 ti.range 进行一维循环（参考官方文档）
      for (let i of ti.range(n)) {
        // 直接赋值，编译器会自动推断类型
        result[i] = i * i
      }
    })

    status.value = 'GPU 计算中...'
    const start = performance.now()

    // 执行内核
    await computeSquares()

    // 读取结果 - 使用 toArray 从 GPU 读取数据到 CPU
    const allResults = await result.toArray()
    const output = allResults.slice(0, 10)

    executionTime.value = performance.now() - start
    results.value = output
    status.value = '运行成功'
    
  } catch (error) {
    console.error('运行失败:', error)
    status.value = '运行失败: ' + error
  }

  isRunning.value = false
}

function clearResult() {
  results.value = []
  status.value = '就绪'
  executionTime.value = 0
}

function goToNext() {
  alert('即将跳转到第2课：Three.js 基础场景搭建')
  // TODO: 实现跳转
}
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

    ul {
      li {
        &:before {
          color: #ffc800;
        }
      }
    }
  }

  .concept-card {
    background: rgba(0, 50, 100, 0.2);
    border: 1px solid rgba(0, 170, 255, 0.2);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;

    h4 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #88ccff;
    }

    p {
      margin-bottom: 10px;
    }

    pre {
      background: rgba(0, 0, 0, 0.5);
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 10px 0;

      code {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
        color: #aaffaa;
      }
    }
  }

  .code-demo {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 255, 136, 0.2);
    border-radius: 12px;
    padding: 20px;

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

        input[type="range"] {
          cursor: pointer;
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

        &:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .demo-result {
      h4 {
        margin: 0 0 15px 0;
        font-size: 16px;
        color: #88ccff;
      }

      .result-stats {
        p {
          font-size: 14px;
          margin-bottom: 8px;

          .success {
            color: #00ff88;
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

      .result-values {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;

        .result-value {
          padding: 8px 12px;
          background: rgba(0, 170, 255, 0.2);
          border-radius: 6px;
          font-size: 13px;
          font-family: 'Courier New', monospace;
          color: #a0a0ff;
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

    &:hover:not(:disabled) {
      background: rgba(0, 170, 255, 0.3);
      transform: translateX(-2px);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.next:hover {
      transform: translateX(2px);
    }
  }
}
</style>
