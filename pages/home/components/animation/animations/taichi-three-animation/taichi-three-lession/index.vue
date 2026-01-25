<template>
  <div class="course-index-page">
    <!-- 课程列表视图 -->
    <div v-if="!currentLesson">
      <div class="header">
        <h1>Taichi.js + Three.js 学习课程</h1>
        <p class="subtitle">从基础到高级：GPU计算与3D渲染的完美协作</p>
      </div>

      <div class="learning-path">
        <div class="path-header">
          <h2>🎯 学习路径</h2>
          <p>按照顺序学习，逐步掌握 Taichi.js 和 Three.js 的协作开发</p>
        </div>

        <div class="path-stages">
          <!-- 阶段一：基础入门 -->
          <div class="stage">
            <div class="stage-title">阶段一：基础入门</div>
            <div class="stage-desc">理解两个框架的基本概念和各自优势</div>
            <div class="courses">
              <div
                v-for="(course, idx) in stage1Courses"
                :key="idx"
                class="course-card"
                @click="selectCourse(course)"
              >
                <div class="course-num">L{{ course.number }}</div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="tags">
                    <span v-for="tag in course.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 阶段二：数据传输 -->
          <div class="stage">
            <div class="stage-title">阶段二：数据传输</div>
            <div class="stage-desc">学习如何在 GPU 计算和渲染之间高效传输数据</div>
            <div class="courses">
              <div
                v-for="(course, idx) in stage2Courses"
                :key="idx"
                class="course-card"
                @click="selectCourse(course)"
              >
                <div class="course-num">L{{ course.number }}</div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="tags">
                    <span v-for="tag in course.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 阶段三：物理模拟 -->
          <div class="stage">
            <div class="stage-title">阶段三：物理模拟</div>
            <div class="stage-desc">使用 Taichi.js 实现复杂的物理效果</div>
            <div class="courses">
              <div
                v-for="(course, idx) in stage3Courses"
                :key="idx"
                class="course-card"
                @click="selectCourse(course)"
              >
                <div class="course-num">L{{ course.number }}</div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="tags">
                    <span v-for="tag in course.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 阶段五：高级GPU计算技术 -->
          <div class="stage">
            <div class="stage-title">阶段五：高级GPU计算技术</div>
            <div class="stage-desc">深入学习 WebGPU Compute Shader 和并行算法</div>
            <div class="courses">
              <div
                v-for="(course, idx) in stage5Courses"
                :key="idx"
                class="course-card"
                @click="selectCourse(course)"
              >
                <div class="course-num">L{{ course.number }}</div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="tags">
                    <span v-for="tag in course.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 阶段四：综合应用 -->
          <div class="stage">
            <div class="stage-title">阶段四：综合应用</div>
            <div class="stage-desc">完整项目实践，性能优化</div>
            <div class="courses">
              <div
                v-for="(course, idx) in stage4Courses"
                :key="idx"
                class="course-card"
                @click="selectCourse(course)"
              >
                <div class="course-num">L{{ course.number }}</div>
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="tags">
                    <span v-for="tag in course.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 架构说明 -->
      <div class="architecture-section">
        <h2>🏗️ Taichi.js + Three.js 架构</h2>
        <div class="architecture-diagram">
          <div class="diagram-box taichi">
            <div class="box-icon">⚡</div>
            <div class="box-title">Taichi.js</div>
            <div class="box-desc">GPU 通用计算</div>
            <ul class="box-items">
              <li>• 物理模拟</li>
              <li>• 粒子系统</li>
              <li>• 碰撞检测</li>
              <li>• 流体计算</li>
            </ul>
          </div>
          <div class="diagram-arrow">
            <div class="arrow-label">数据传输</div>
            <div class="arrow-label-sub">ArrayBuffer / Texture</div>
            <div class="arrow-icon">→</div>
          </div>
          <div class="diagram-box three">
            <div class="box-icon">🎨</div>
            <div class="box-title">Three.js</div>
            <div class="box-desc">3D 渲染</div>
            <ul class="box-items">
              <li>• 场景管理</li>
              <li>• 灯光材质</li>
              <li>• 相机控制</li>
              <li>• 后处理特效</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 核心概念 -->
      <div class="concepts-section">
        <h2>💡 核心概念</h2>
        <div class="concepts-grid">
          <div class="concept-card">
            <h3>1. 性能分工</h3>
            <p>
              <strong>Taichi.js</strong>
              负责计算密集型任务，利用 GPU 并行能力大幅提升物理计算性能。
            </p>
            <p>
              <strong>Three.js</strong>
              专注于渲染，提供高质量的 3D 图形展示。
            </p>
          </div>
          <div class="concept-card">
            <h3>2. 数据共享</h3>
            <p>
              通过 ArrayBuffer、Texture 等方式在 GPU 计算和渲染之间共享数据，减少 CPU-GPU 传输开销。
            </p>
            <p>优化传输策略对性能至关重要。</p>
          </div>
          <div class="concept-card">
            <h3>3. WebGPU</h3>
            <p>Taichi.js 使用 WebGPU 进行 GPU 计算，比传统 WebGL Compute Shader 更高效。</p>
            <p>需要现代浏览器支持（Chrome 113+）。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程内容展示区域 -->
    <div v-else class="lesson-viewer">
      <button class="close-lesson" @click="closeLesson">← 返回课程列表</button>
      <component :is="currentLesson" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import Lesson1 from './demo/lesson-1.vue'
import Lesson2 from './demo/lesson-2.vue'
import Lesson3 from './demo/lesson-3.vue'
import Lesson4 from './demo/lesson-4.vue'
import Lesson5 from './demo/lesson-5.vue'
import Lesson6 from './demo/lesson-6.vue'
import Lesson7 from './demo/lesson-7.vue'
import Lesson8 from './demo/lesson-8.vue'
import Lesson9 from './demo/lesson-9.vue'
import Lesson10 from './demo/lesson-10.vue'
import Lesson11 from './demo/lesson-11.vue'
import Lesson12 from './demo/lesson-12.vue'
import Lesson13 from './demo/lesson-13.vue'
import Lesson14 from './demo/lesson-14.vue'

// 当前展示的课程
const currentLesson = shallowRef<any>(null)

// 阶段一课程
const stage1Courses = ref([
  {
    number: 1,
    title: 'Hello World - 认识 Taichi.js',
    description: '学习 Taichi.js 的基本概念，创建第一个 GPU 计算程序。理解 @ti.kernel 和字段系统。',
    file: 'lesson-1.vue',
    tags: ['入门', '基础概念', 'WebGPU']
  },
  {
    number: 2,
    title: 'Three.js 基础场景搭建',
    description: '使用 Three.js 创建基础 3D 场景，包括相机、灯光、渲染器等核心组件。',
    file: 'lesson-2.vue',
    tags: ['Three.js', '场景搭建', '基础渲染']
  },
  {
    number: 3,
    title: '第一个粒子系统',
    description:
      '真正展示 Taichi.js + Three.js 的协作：使用 Taichi.js 在 GPU 上计算粒子位置，Three.js 负责渲染。',
    file: 'lesson-3.vue',
    tags: ['协作', 'GPU计算', '粒子系统', '数据传输']
  }
])

// 阶段二课程
const stage2Courses = ref([
  {
    number: 4,
    title: 'Taichi.js 字段系统',
    description:
      '深入学习 Taichi.js 的字段系统，创建 GPU 上的数据结构。理解 ti.field 和 ti.Vector。',
    file: 'lesson-4.vue',
    tags: ['字段系统', 'GPU数据', 'Taichi.js']
  },
  {
    number: 5,
    title: 'GPU 计算与数据传输',
    description:
      '使用 Taichi.js 进行 GPU 计算，将结果传输到 Three.js 渲染。学习 ArrayBuffer 传输。',
    file: 'lesson-5.vue',
    tags: ['数据传输', 'GPU计算', 'ArrayBuffer']
  },
  {
    number: 6,
    title: 'Texture 数据传输优化',
    description: '使用 Texture 进行更高效的数据传输。理解 GPU-GPU 零拷贝共享。',
    file: 'lesson-6.vue',
    tags: ['Texture', '性能优化', '零拷贝']
  }
])

// 阶段三课程
const stage3Courses = ref([
  {
    number: 7,
    title: '粒子物理模拟（重力场）',
    description: '使用 Taichi.js 实现简单的粒子重力模拟。GPU 并行计算所有粒子的运动。',
    file: 'lesson-7.vue',
    tags: ['物理模拟', '重力场', 'GPU并行']
  },
  {
    number: 8,
    title: '流体粒子模拟（SPH）',
    description: '实现平滑粒子流体动力学算法。学习密度计算、压力计算和粒子间相互作用。',
    file: 'lesson-8.vue',
    tags: ['流体模拟', 'SPH算法', '高级物理']
  },
  {
    number: 9,
    title: '碰撞检测与响应',
    description: '实现粒子与几何体的碰撞检测。学习空间分区优化算法。',
    file: 'lesson-9.vue',
    tags: ['碰撞检测', '空间分区', '响应计算']
  }
])

// 阶段五课程
const stage5Courses = ref([
  {
    number: 13,
    title: 'Taichi.js 与 Three.js 数据交互总结',
    description: '总结 Taichi.js 和 Three.js 的数据共享机制，对比不同数据传输模式，掌握高效的数据同步策略。',
    file: 'lesson-13.vue',
    tags: ['数据共享', '性能优化', '最佳实践', '总结']
  },
  {
    number: 14,
    title: 'TaichiThreeBridge 实战应用',
    description: '学习使用 TaichiThreeBridge 桥接器，简化数据交互代码，提升开发效率。包含完整的粒子系统、实例化网格和纹理传输演示。',
    file: 'lesson-14.vue',
    tags: ['桥接器', '实战应用', '性能优化', '完整演示']
  },
  {
    number: 15,
    title: '流体动力学高级应用 - SPH 深度优化',
    description: '深入学习 SPH 算法原理，实现空间哈希加速，优化邻近粒子搜索，添加表面张力和粘度。',
    file: 'lesson-15.vue',
    tags: ['流体动力学', 'SPH', '空间哈希', '高级物理']
  },
  {
    number: 16,
    title: '刚体动力学与碰撞系统',
    description: '实现刚体物理模拟，碰撞检测与响应，接触点求解，摩擦和反弹。',
    file: 'lesson-16.vue',
    tags: ['刚体动力学', '碰撞检测', 'SAT', 'GJK算法']
  },
  {
    number: 17,
    title: 'GPU 加速的空间数据结构',
    description: '掌握 GPU 上的空间分区算法，实现并行构建的加速结构，优化大规模场景查询。',
    file: 'lesson-17.vue',
    tags: ['空间分区', 'BVH', '并行算法', '光线追踪']
  },
  {
    number: 18,
    title: '并行算法与数值计算',
    description: '学习经典的并行算法，理解 GPU 并行模式，实现高效数值计算。',
    file: 'lesson-18.vue',
    tags: ['并行算法', 'Map/Reduce', 'FFT', '数值计算']
  }
])

// 阶段四课程
const stage4Courses = ref([
  {
    number: 10,
    title: '大规模粒子系统（10万+）',
    description: '创建超大规模粒子系统，使用 GPU 实例化渲染。学习 LOD 和视锥体剔除优化。',
    file: 'lesson-10.vue',
    tags: ['大规模', '实例化渲染', 'LOD优化']
  },
  {
    number: 11,
    title: '性能分析与优化',
    description: '学习性能分析工具，识别瓶颈。应用各种优化技巧提升帧率。',
    file: 'lesson-11.vue',
    tags: ['性能分析', '优化技巧', '帧率提升']
  },
  {
    number: 12,
    title: '综合项目：完整演示',
    description: '综合运用所学知识，创建一个功能完整的 Taichi.js + Three.js 演示项目。',
    file: 'lesson-12.vue',
    tags: ['综合项目', '完整演示', '最佳实践']
  },
  {
    number: 13,
    title: '第13课：Taichi.js 与 Three.js 数据交互总结',
    description: '第13课：Taichi.js 与 Three.js 数据交互总结',
    file: 'lesson-13.vue',
    tags: ['综合项目', '完整演示', '最佳实践']
  }
])

function selectCourse(course: any) {
  console.log('选择课程:', course.title)

  // 根据课程编号加载对应的组件
  switch (course.number) {
    case 1:
      currentLesson.value = Lesson1
      break
    case 2:
      currentLesson.value = Lesson2
      break
    case 3:
      currentLesson.value = Lesson3
      break
    case 4:
      currentLesson.value = Lesson4
      break
    case 5:
      currentLesson.value = Lesson5
      break
    case 6:
      currentLesson.value = Lesson6
      break
    case 7:
      currentLesson.value = Lesson7
      break
    case 8:
      currentLesson.value = Lesson8
      break
    case 9:
      currentLesson.value = Lesson9
      break
    case 10:
      currentLesson.value = Lesson10
      break
    case 11:
      currentLesson.value = Lesson11
      break
    case 12:
      currentLesson.value = Lesson12
      break
    case 13:
      currentLesson.value = Lesson13
      break
    case 14:
      currentLesson.value = Lesson14
      break
    default:
      alert(`${course.title} 即将推出！`)
  }
}

function closeLesson() {
  currentLesson.value = null
}
</script>

<style scoped lang="scss">
.course-index-page {
  height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%);
  padding: 40px;
  color: white;
  overflow-y: scroll;
}

.header {
  text-align: center;
  margin-bottom: 60px;

  h1 {
    font-size: 48px;
    margin: 0 0 10px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
}

.learning-path {
  margin-bottom: 60px;

  .path-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      margin: 0 0 10px 0;
      font-size: 32px;
      color: #00ff88;
    }

    p {
      margin: 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .stage {
    margin-bottom: 40px;
    padding: 25px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .stage-title {
      font-size: 24px;
      font-weight: bold;
      color: #00aaff;
      margin-bottom: 8px;
    }

    .stage-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 20px;
    }

    .courses {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;

      .course-card {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 170, 255, 0.2);
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: rgba(0, 170, 255, 0.1);
          border-color: rgba(0, 170, 255, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 170, 255, 0.15);
        }

        .course-num {
          font-size: 24px;
          font-weight: bold;
          color: #00aaff;
          margin-bottom: 10px;
        }

        .course-info {
          h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #ffffff;
          }

          p {
            margin: 0 0 12px 0;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
          }

          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;

            .tag {
              padding: 3px 10px;
              background: rgba(102, 126, 234, 0.3);
              border-radius: 10px;
              font-size: 11px;
              color: #a0a0ff;
            }
          }
        }
      }
    }
  }
}

.architecture-section {
  margin-bottom: 60px;
  padding: 30px;
  background: rgba(0, 50, 100, 0.15);
  border-radius: 16px;
  border: 1px solid rgba(0, 170, 255, 0.2);

  h2 {
    margin: 0 0 25px 0;
    font-size: 28px;
    color: #00ff88;
    text-align: center;
  }

  .architecture-diagram {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;

    .diagram-box {
      flex: 1;
      max-width: 280px;
      padding: 25px;
      border-radius: 16px;
      text-align: center;

      &.taichi {
        background: rgba(255, 200, 0, 0.15);
        border: 2px solid rgba(255, 200, 0, 0.4);
      }

      &.three {
        background: rgba(100, 100, 255, 0.15);
        border: 2px solid rgba(100, 100, 255, 0.4);
      }

      .box-icon {
        font-size: 48px;
        margin-bottom: 10px;
      }

      .box-title {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .box-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 15px;
      }

      .box-items {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: left;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);

        li {
          padding: 5px 0;
        }
      }
    }

    .diagram-arrow {
      flex: 0 0 150px;
      text-align: center;

      .arrow-label {
        font-size: 14px;
        font-weight: bold;
        color: #00ff88;
        margin-bottom: 5px;
      }

      .arrow-label-sub {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 10px;
      }

      .arrow-icon {
        font-size: 48px;
        color: rgba(0, 255, 136, 0.5);
      }
    }
  }
}

.concepts-section {
  margin-bottom: 40px;

  h2 {
    margin: 0 0 25px 0;
    font-size: 28px;
    color: #00ff88;
    text-align: center;
  }

  .concepts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;

    .concept-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;

      h3 {
        margin: 0 0 12px 0;
        font-size: 18px;
        color: #00aaff;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.8);

        &:last-child {
          margin-bottom: 0;
        }

        strong {
          color: #00ff88;
        }
      }
    }
  }
}

.lesson-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;

  .close-lesson {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 12px 24px;
    background: rgba(0, 170, 255, 0.9);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1001;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 170, 255, 1);
      transform: translateX(-3px);
    }
  }
}

@media (max-width: 768px) {
  .course-index-page {
    padding: 20px;
    overflow-y: scroll;
  }

  .header h1 {
    font-size: 32px;
  }

  .architecture-diagram {
    flex-direction: column;

    .diagram-arrow {
      .arrow-icon {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
