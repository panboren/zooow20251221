/**
 * Web Workers 后台任务管理系统
 * 将计算密集型任务移至Worker线程，避免阻塞主线程
 */

export class WorkerManager {
  constructor(options = {}) {
    this.options = {
      maxWorkers: navigator.hardwareConcurrency || 4,
      workerScript: null,
      autoTerminate: false,
      terminateTimeout: 30000,  // 30秒无任务自动终止
      ...options
    }

    this.workers = new Map()
    this.taskQueue = []
    this.activeTasks = new Map()
    this.isInitialized = false

    // 统计
    this.stats = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageTime: 0
    }
  }

  /**
   * 初始化Worker管理器
   */
  async init() {
    if (this.isInitialized) return true

    if (this.options.workerScript) {
      // 使用指定的Worker脚本
      this.workerScriptURL = this.options.workerScript
    } else {
      // 创建默认Worker脚本
      this.workerScriptURL = this.createDefaultWorkerScript()
    }

    this.isInitialized = true
    return true
  }

  /**
   * 创建默认Worker脚本
   */
  createDefaultWorkerScript() {
    const workerCode = `
      // Worker消息处理
      self.onmessage = function(e) {
        const { id, type, data } = e.data

        try {
          let result

          switch (type) {
            case 'compute':
              result = compute(data)
              break
            case 'generateNoise':
              result = generateNoise(data)
              break
            case 'processTexture':
              result = processTexture(data)
              break
            case 'analyzeData':
              result = analyzeData(data)
              break
            case 'simulate':
              result = simulate(data)
              break
            default:
              throw new Error(\`Unknown task type: \${type}\`)
          }

          self.postMessage({ id, type, result, success: true })
        } catch (error) {
          self.postMessage({ id, type, error: error.message, success: false })
        }
      }

      // 矩阵计算
      function compute(data) {
        const { matrixA, matrixB } = data
        const rowsA = matrixA.length
        const colsA = matrixA[0].length
        const colsB = matrixB[0].length

        const result = new Array(rowsA)
        for (let i = 0; i < rowsA; i++) {
          result[i] = new Float32Array(colsB)
          for (let j = 0; j < colsB; j++) {
            let sum = 0
            for (let k = 0; k < colsA; k++) {
              sum += matrixA[i][k] * matrixB[k][j]
            }
            result[i][j] = sum
          }
        }

        return result
      }

      // 噪声生成
      function generateNoise(data) {
        const { width, height, type, seed } = data
        const noise = new Float32Array(width * height)

        for (let i = 0; i < width * height; i++) {
          const x = i % width
          const y = Math.floor(i / width)

          switch (type) {
            case 'random':
              noise[i] = Math.random()
              break
            case 'perlin':
              noise[i] = perlinNoise(x, y, seed)
              break
            case 'value':
              noise[i] = valueNoise(x, y, seed)
              break
            default:
              noise[i] = Math.random()
          }
        }

        return {
          data: noise,
          width,
          height
        }
      }

      function perlinNoise(x, y, seed) {
        // 简化的Perlin噪声
        const n = x + y * 57 + seed * 131
        const nn = (n << 13) ^ n
        return 1.0 - ((nn * (nn * nn * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0
      }

      function valueNoise(x, y, seed) {
        const n = x * 3711 + y * 65543 + seed * 8191
        return Math.sin(n) * 0.5 + 0.5
      }

      // 纹理处理
      function processTexture(data) {
        const { imageData, operation, params } = data
        const { width, height } = imageData
        const result = new Uint8ClampedArray(imageData.data)

        switch (operation) {
          case 'blur':
            applyBlur(result, width, height, params.radius)
            break
          case 'grayscale':
            applyGrayscale(result, width, height)
            break
          case 'edge':
            applyEdgeDetection(result, width, height)
            break
        }

        return { data: result, width, height }
      }

      function applyBlur(data, width, height, radius) {
        // 简单盒式模糊
        const temp = new Uint8ClampedArray(data)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, count = 0

            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx
                const ny = y + dy
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const idx = (ny * width + nx) * 4
                  r += temp[idx]
                  g += temp[idx + 1]
                  b += temp[idx + 2]
                  count++
                }
              }
            }

            const idx = (y * width + x) * 4
            data[idx] = r / count
            data[idx + 1] = g / count
            data[idx + 2] = b / count
          }
        }
      }

      function applyGrayscale(data, width, height) {
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          data[i] = data[i + 1] = data[i + 2] = gray
        }
      }

      function applyEdgeDetection(data, width, height) {
        const temp = new Uint8ClampedArray(data)
        const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
        const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0

            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const idx = ((y + dy) * width + (x + dx)) * 4
                const gray = (temp[idx] + temp[idx + 1] + temp[idx + 2]) / 3
                gx += gray * sobelX[dy + 1][dx + 1]
                gy += gray * sobelY[dy + 1][dx + 1]
              }
            }

            const magnitude = Math.sqrt(gx * gx + gy * gy)
            const idx = (y * width + x) * 4
            data[idx] = data[idx + 1] = data[idx + 2] = magnitude
          }
        }
      }

      // 数据分析
      function analyzeData(data) {
        const { values } = data

        let min = Infinity, max = -Infinity
        let sum = 0, sumSquares = 0

        for (let i = 0; i < values.length; i++) {
          const v = values[i]
          if (v < min) min = v
          if (v > max) max = v
          sum += v
          sumSquares += v * v
        }

        const mean = sum / values.length
        const variance = sumSquares / values.length - mean * mean
        const stdDev = Math.sqrt(variance)

        return {
          min, max, mean, stdDev,
          count: values.length
        }
      }

      // 模拟计算
      function simulate(data) {
        const { type, steps, initialState } = data
        let state = { ...initialState }

        switch (type) {
          case 'particle':
            return simulateParticle(state, steps)
          case 'physics':
            return simulatePhysics(state, steps)
          case 'random':
            return simulateRandom(state, steps)
          default:
            return state
        }
      }

      function simulateParticle(state, steps) {
        const positions = []
        let pos = { ...state.position }
        let vel = { ...state.velocity }

        for (let i = 0; i < steps; i++) {
          vel.x += state.gravity.x * 0.016
          vel.y += state.gravity.y * 0.016
          vel.z += state.gravity.z * 0.016

          vel.x *= state.damping
          vel.y *= state.damping
          vel.z *= state.damping

          pos.x += vel.x * 0.016
          pos.y += vel.y * 0.016
          pos.z += vel.z * 0.016

          positions.push({ ...pos })
        }

        return positions
      }

      function simulatePhysics(state, steps) {
        const trajectory = []
        let pos = { ...state.position }

        for (let i = 0; i < steps; i++) {
          trajectory.push({ ...pos })
        }

        return trajectory
      }

      function simulateRandom(state, steps) {
        return Array(steps).fill(0).map(() => Math.random())
      }
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    return URL.createObjectURL(blob)
  }

  /**
   * 获取或创建Worker
   */
  getWorker() {
    // 查找空闲Worker
    for (const [id, worker] of this.workers) {
      if (worker.tasks === 0) {
        worker.lastUsed = Date.now()
        return { id, worker }
      }
    }

    // 创建新Worker
    if (this.workers.size < this.options.maxWorkers) {
      const id = Date.now() + Math.random()
      const worker = new Worker(this.workerScriptURL)
      worker.tasks = 0
      worker.lastUsed = Date.now()

      this.workers.set(id, worker)

      return { id, worker }
    }

    // 返回任务最少的Worker
    let minTasks = Infinity
    let minWorkerId = null

    for (const [id, worker] of this.workers) {
      if (worker.tasks < minTasks) {
        minTasks = worker.tasks
        minWorkerId = id
      }
    }

    return {
      id: minWorkerId,
      worker: this.workers.get(minWorkerId)
    }
  }

  /**
   * 执行任务
   */
  async execute(type, data, options = {}) {
    await this.init()

    return new Promise((resolve, reject) => {
      const taskId = Date.now() + Math.random()
      const startTime = Date.now()

      const { id: workerId, worker } = this.getWorker()
      worker.tasks++
      worker.lastUsed = Date.now()

      // 设置消息处理
      const handleMessage = (e) => {
        const { id, result, error, success } = e.data

        if (id === taskId) {
          const duration = Date.now() - startTime
          worker.tasks--
          worker.lastUsed = Date.now()

          worker.removeEventListener('message', handleMessage)

          if (success) {
            this.stats.completedTasks++
            this.stats.averageTime =
              (this.stats.averageTime * (this.stats.completedTasks - 1) + duration) /
              this.stats.completedTasks

            resolve(result)
          } else {
            this.stats.failedTasks++
            reject(new Error(error))
          }

          this.activeTasks.delete(taskId)
        }
      }

      worker.addEventListener('message', handleMessage)

      // 发送任务
      worker.postMessage({
        id: taskId,
        type,
        data,
        options
      })

      this.activeTasks.set(taskId, {
        type,
        startTime,
        workerId
      })

      this.stats.totalTasks++

      // 超时处理
      if (options.timeout) {
        setTimeout(() => {
          if (this.activeTasks.has(taskId)) {
            this.activeTasks.delete(taskId)
            worker.tasks--
            reject(new Error('Task timeout'))
          }
        }, options.timeout)
      }
    })
  }

  /**
   * 批量执行任务
   */
  async executeAll(tasks, options = {}) {
    const concurrency = options.concurrency || this.options.maxWorkers
    const results = []

    for (let i = 0; i < tasks.length; i += concurrency) {
      const batch = tasks.slice(i, i + concurrency)
      const batchResults = await Promise.all(
        batch.map(task => this.execute(task.type, task.data, task.options))
      )
      results.push(...batchResults)
    }

    return results
  }

  /**
   * 噪声生成
   */
  async generateNoise(width, height, type = 'random', seed = 0) {
    return this.execute('generateNoise', { width, height, type, seed })
  }

  /**
   * 矩阵计算
   */
  async computeMatrices(matrixA, matrixB) {
    return this.execute('compute', { matrixA, matrixB })
  }

  /**
   * 纹理处理
   */
  async processTexture(imageData, operation, params = {}) {
    return this.execute('processTexture', { imageData, operation, params })
  }

  /**
   * 数据分析
   */
  async analyzeData(values) {
    return this.execute('analyzeData', { values })
  }

  /**
   * 物理模拟
   */
  async simulatePhysics(state, steps) {
    return this.execute('simulate', { type: 'physics', steps, initialState: state })
  }

  /**
   * 粒子模拟
   */
  async simulateParticles(state, steps) {
    return this.execute('simulate', { type: 'particle', steps, initialState: state })
  }

  /**
   * 终止空闲Worker
   */
  terminateIdleWorkers() {
    const now = Date.now()

    for (const [id, worker] of this.workers) {
      if (worker.tasks === 0 &&
          (now - worker.lastUsed) > this.options.terminateTimeout) {
        worker.terminate()
        this.workers.delete(id)
        console.log(`Worker ${id} terminated (idle)`)
      }
    }
  }

  /**
   * 终止所有Worker
   */
  terminateAll() {
    for (const [id, worker] of this.workers) {
      worker.terminate()
    }
    this.workers.clear()
    this.activeTasks.clear()
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      activeWorkers: this.workers.size,
      totalWorkers: this.options.maxWorkers,
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length
    }
  }

  /**
   * 重置统计
   */
  resetStats() {
    this.stats = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageTime: 0
    }
  }

  /**
   * 清理
   */
  dispose() {
    this.terminateAll()
    if (this.workerScriptURL) {
      URL.revokeObjectURL(this.workerScriptURL)
    }
    this.isInitialized = false
  }
}

/**
 * 粒子计算Worker
 */
export class ParticleComputeWorker extends WorkerManager {
  constructor(options = {}) {
    super(options)
    this.particleData = null
  }

  /**
   * 初始化粒子数据
   */
  initParticles(particleCount) {
    this.particleData = {
      positions: new Float32Array(particleCount * 3),
      velocities: new Float32Array(particleCount * 3),
      forces: new Float32Array(particleCount * 3),
      life: new Float32Array(particleCount)
    }

    // 初始化随机位置和速度
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      this.particleData.positions[i3] = (Math.random() - 0.5) * 100
      this.particleData.positions[i3 + 1] = (Math.random() - 0.5) * 100
      this.particleData.positions[i3 + 2] = (Math.random() - 0.5) * 100

      this.particleData.velocities[i3] = (Math.random() - 0.5) * 2
      this.particleData.velocities[i3 + 1] = (Math.random() - 0.5) * 2
      this.particleData.velocities[i3 + 2] = (Math.random() - 0.5) * 2

      this.particleData.life[i] = Math.random()
    }
  }

  /**
   * 更新粒子（Worker中计算）
   */
  async updateParticles(deltaTime, gravity, damping) {
    if (!this.particleData) return null

    const count = this.particleData.life.length
    const chunks = []

    // 分块处理
    const chunkSize = 10000
    for (let i = 0; i < count; i += chunkSize) {
      const end = Math.min(i + chunkSize, count)
      chunks.push(this.simulateParticles({
        positions: this.particleData.positions.slice(i * 3, end * 3),
        velocities: this.particleData.velocities.slice(i * 3, end * 3),
        gravity,
        damping
      }, 1))
    }

    const results = await Promise.all(chunks)

    // 合并结果
    for (let i = 0; i < results.length; i++) {
      const offset = i * chunkSize * 3
      this.particleData.positions.set(results[i].positions, offset)
      this.particleData.velocities.set(results[i].velocities, offset)
    }

    return this.particleData
  }

  /**
   * 获取粒子数据
   */
  getParticleData() {
    return this.particleData
  }
}

export default WorkerManager
