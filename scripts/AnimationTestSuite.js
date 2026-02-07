/**
 * 动画自动化测试套件
 * 测试动画的基本功能、性能、内存泄漏等
 */

import { performance } from 'perf_hooks'
import { PerformanceMonitor } from '../utils/PerformanceMonitor.js'

export class AnimationTestSuite {
  constructor() {
    this.testResults = []
    this.failedTests = []
    this.passedTests = []
  }

  /**
   * 运行所有测试
   */
  async runAllTests(tests) {
    console.log('🧪 开始运行测试套件...\n')

    for (const test of tests) {
      await this.runTest(test)
    }

    this.printSummary()
    return this.testResults
  }

  /**
   * 运行单个测试
   */
  async runTest(test) {
    const startTime = performance.now()

    try {
      console.log(\`运行: \${test.name}\`)
      const result = await test.execute()
      const duration = performance.now() - startTime

      const testResult = {
        name: test.name,
        passed: result.passed,
        duration: Math.round(duration),
        message: result.message,
        metrics: result.metrics || {}
      }

      this.testResults.push(testResult)

      if (result.passed) {
        this.passedTests.push(test.name)
        console.log(\`✅ 通过: \${test.name} (\${duration}ms)\`)
      } else {
        this.failedTests.push(test.name)
        console.log(\`❌ 失败: \${test.name} - \${result.message}\`)
      }

    } catch (error) {
      const duration = performance.now() - startTime
      const testResult = {
        name: test.name,
        passed: false,
        duration: Math.round(duration),
        message: error.message,
        error: error.stack
      }

      this.testResults.push(testResult)
      this.failedTests.push(test.name)

      console.log(\`❌ 错误: \${test.name} - \${error.message}\`)
    }

    console.log('')
  }

  /**
   * 打印测试总结
   */
  printSummary() {
    console.log('\\n' + '='.repeat(50))
    console.log('📊 测试总结')
    console.log('='.repeat(50))

    console.log(\`总测试数: \${this.testResults.length}\`)
    console.log(\`通过: \${this.passedTests.length} ✅\`)
    console.log(\`失败: \${this.failedTests.length} ❌\`)
    console.log(\`成功率: \${((this.passedTests.length / this.testResults.length) * 100).toFixed(1)}%\`)

    if (this.failedTests.length > 0) {
      console.log('\\n失败的测试:')
      this.failedTests.forEach(name => console.log(\`  - \${name}\`))
    }

    console.log('\\n')
  }

  /**
   * 生成测试报告
   */
  generateReport() {
    return {
      total: this.testResults.length,
      passed: this.passedTests.length,
      failed: this.failedTests.length,
      successRate: (this.passedTests.length / this.testResults.length) * 100,
      results: this.testResults
    }
  }
}

/**
 * 基础功能测试
 */
export class BasicFunctionalityTests {
  /**
   * 测试动画能正常初始化
   */
  static async testInitialization(animationClass, scene, camera, renderer, controls) {
    return {
      name: '初始化测试',
      execute: async () => {
        try {
          const effect = new animationClass(scene, camera, renderer, controls)

          if (!effect.scene || !effect.camera || !effect.renderer) {
            return {
              passed: false,
              message: '缺少必要的属性'
            }
          }

          return {
            passed: true,
            message: '初始化成功'
          }
        } catch (error) {
          return {
            passed: false,
            message: \`初始化失败: \${error.message}\`
          }
        }
      }
    }
  }

  /**
   * 测试play方法存在
   */
  static async testPlayMethod(animationClass, scene, camera, renderer, controls) {
    return {
      name: 'Play方法测试',
      execute: async () => {
        try {
          const effect = new animationClass(scene, camera, renderer, controls)

          if (typeof effect.play !== 'function') {
            return {
              passed: false,
              message: '缺少play方法'
            }
          }

          effect.play()

          return {
            passed: true,
            message: 'Play方法执行成功'
          }
        } catch (error) {
          return {
            passed: false,
            message: \`Play方法执行失败: \${error.message}\`
          }
        }
      }
    }
  }

  /**
   * 测试cleanup方法
   */
  static async testCleanup(animationClass, scene, camera, renderer, controls) {
    return {
      name: 'Cleanup测试',
      execute: async () => {
        try {
          const effect = new animationClass(scene, camera, renderer, controls)
          effect.play()

          await new Promise(resolve => setTimeout(resolve, 100))

          const initialObjects = scene.children.length
          effect.cleanup()

          if (typeof effect.cleanup !== 'function') {
            return {
              passed: false,
              message: '缺少cleanup方法'
            }
          }

          const finalObjects = scene.children.length

          if (finalObjects >= initialObjects) {
            return {
              passed: false,
              message: 'Cleanup后对象未移除'
            }
          }

          return {
            passed: true,
            message: 'Cleanup成功'
          }
        } catch (error) {
          return {
            passed: false,
            message: \`Cleanup失败: \${error.message}\`
          }
        }
      }
    }
  }
}

/**
 * 性能测试
 */
export class PerformanceTests {
  /**
   * 测试FPS
   */
  static async testFPS(animationClass, scene, camera, renderer, controls, targetFPS = 45) {
    return {
      name: \`FPS测试 (目标: \${targetFPS})\`,
      execute: async () => {
        try {
          const monitor = new PerformanceMonitor()
          monitor.start()

          const effect = new animationClass(scene, camera, renderer, controls)
          effect.play()

          // 运行2秒
          await new Promise(resolve => setTimeout(resolve, 2000))

          const report = monitor.getReport()
          monitor.stop()
          effect.cleanup()

          const passed = report.averageFPS >= targetFPS

          return {
            passed,
            message: \`平均FPS: \${report.averageFPS.toFixed(1)}\`,
            metrics: {
              averageFPS: report.averageFPS,
              minFPS: report.fps,
              particleCount: report.particleCount
            }
          }
        } catch (error) {
          return {
            passed: false,
            message: \`FPS测试失败: \${error.message}\`
          }
        }
      }
    }
  }

  /**
   * 测试内存泄漏
   */
  static async testMemoryLeak(animationClass, scene, camera, renderer, controls) {
    return {
      name: '内存泄漏测试',
      execute: async () => {
        try {
          const iterations = 3
          const memoryUsage = []

          for (let i = 0; i < iterations; i++) {
            const effect = new animationClass(scene, camera, renderer, controls)
            effect.play()

            await new Promise(resolve => setTimeout(resolve, 500))

            effect.cleanup()

            // 强制垃圾回收（如果可用）
            if (global.gc) {
              global.gc()
            }

            // 获取内存使用
            if (performance.memory) {
              memoryUsage.push(performance.memory.usedJSHeapSize / 1024 / 1024)
            }
          }

          if (memoryUsage.length < 2) {
            return {
              passed: true,
              message: '内存监控不可用，跳过测试'
            }
          }

          // 检查内存增长
          const firstUsage = memoryUsage[0]
          const lastUsage = memoryUsage[memoryUsage.length - 1]
          const growth = lastUsage - firstUsage
          const growthPercent = (growth / firstUsage) * 100

          const passed = growthPercent < 50 // 允许50%的增长

          return {
            passed,
            message: \`内存增长: \${growthPercent.toFixed(1)}%\`,
            metrics: {
              initialMemory: firstUsage.toFixed(2),
              finalMemory: lastUsage.toFixed(2),
              growthPercent: growthPercent.toFixed(2)
            }
          }
        } catch (error) {
          return {
            passed: false,
            message: \`内存泄漏测试失败: \${error.message}\`
          }
        }
      }
    }
  }

  /**
   * 测试Draw Calls
   */
  static async testDrawCalls(animationClass, scene, camera, renderer, controls, maxDrawCalls = 100) {
    return {
      name: \`Draw Calls测试 (最大: \${maxDrawCalls})\`,
      execute: async () => {
        try {
          const effect = new animationClass(scene, camera, renderer, controls)
          effect.play()

          // 运行1秒
          await new Promise(resolve => setTimeout(resolve, 1000))

          const drawCalls = renderer.info.render.calls
          effect.cleanup()

          const passed = drawCalls <= maxDrawCalls

          return {
            passed,
            message: \`Draw Calls: \${drawCalls}\`,
            metrics: {
              drawCalls,
              maxDrawCalls
            }
          }
        } catch (error) {
          return {
            passed: false,
            message: \`Draw Calls测试失败: \${error.message}\`
          }
        }
      }
    }
  }
}

/**
 * 代码质量测试
 */
export class CodeQualityTests {
  /**
   * 测试是否继承BaseEffect
   */
  static async testInheritsBaseEffect(animationClass) {
    return {
      name: '继承BaseEffect测试',
      execute: async () => {
        try {
          // 检查原型链
          let proto = Object.getPrototypeOf(animationClass.prototype)
          let found = false

          while (proto) {
            if (proto.constructor.name === 'BaseEffect' ||
                proto.constructor.name === 'EnhancedBaseEffect') {
              found = true
              break
            }
            proto = Object.getPrototypeOf(proto)
          }

          return {
            passed: found,
            message: found ? '正确继承BaseEffect' : '未继承BaseEffect'
          }
        } catch (error) {
          return {
            passed: false,
            message: \`继承测试失败: \${error.message}\`
          }
        }
      }
    }
  }

  /**
   * 测试使用ParticleFactory
   */
  static async testUsesParticleFactory(animationFileContent) {
    return {
      name: 'ParticleFactory使用测试',
      execute: async () => {
        const usesFactory = animationFileContent.includes('ParticleFactory')

        return {
          passed: usesFactory,
          message: usesFactory ? '使用ParticleFactory' : '未使用ParticleFactory'
        }
      }
    }
  }
}

// 命令行使用
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  console.log('动画测试套件 - 需要传入动画类进行测试')
  console.log('用法示例见文档')
}
