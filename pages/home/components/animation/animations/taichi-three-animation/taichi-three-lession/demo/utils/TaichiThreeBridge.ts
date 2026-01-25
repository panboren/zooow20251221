/**
 * TaichiThreeBridge - 简单易用的 Taichi.js 和 Three.js 数据共享与交互封装
 *
 * 功能特点：
 * - 简化的 API，一行代码完成数据同步
 * - 自动选择最佳数据传输模式
 * - 支持字段同步到几何体、实例化网格、纹理
 * - 内置性能监控和优化
 * - 完整的 TypeScript 类型支持
 */

import * as THREE from 'three'

// 类型定义
export type TransferMode = 'auto' | 'texture' | 'array' | 'webgpu'

export interface BridgeOptions {
  /** 数据传输模式 */
  mode?: TransferMode
  /** 是否启用性能监控 */
  enablePerformanceMonitor?: boolean
  /** 目标帧率（用于自适应优化） */
  targetFps?: number
  /** 最小分辨率（纹理模式） */
  minResolution?: number
  /** 最大分辨率（纹理模式） */
  maxResolution?: number
}

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  transferTime: number
  mode: TransferMode
  dataSize: number
}

// 字段类型
export type TaichiField = {
  toArray(): Promise<any[]>
  toArray1D(): Promise<number[]>
  toFloat32Array(): Promise<Float32Array>
  toInt32Array(): Promise<Int32Array>
  fromArray(values: any): Promise<void>
  dimensions: number[]
}

// 主桥接类
export class TaichiThreeBridge {
  private renderer: THREE.WebGLRenderer
  private mode: TransferMode
  private performanceMonitor: PerformanceMonitor
  private cache: Map<string, any>
  private frameCount: number
  private lastFrameTime: number

  constructor(renderer: THREE.WebGLRenderer, options: BridgeOptions = {}) {
    this.renderer = renderer
    this.mode = options.mode || 'auto'
    this.performanceMonitor = new PerformanceMonitor(options.targetFps || 60)
    this.cache = new Map()
    this.frameCount = 0
    this.lastFrameTime = performance.now()

    // 自动检测最佳模式
    if (this.mode === 'auto') {
      this.detectBestMode()
    }
  }

  /**
   * 检测最佳数据传输模式
   */
  private detectBestMode(): void {
    // 优先使用 WebGPU（如果可用）
    if ('gpu' in navigator) {
      this.mode = 'webgpu'
    } else if (typeof createImageBitmap === 'function') {
      // 使用 Transferable ImageBitmap
      this.mode = 'texture'
    } else {
      // 回退到数组传输
      this.mode = 'array'
    }
  }

  /**
   * 同步 Taichi 字段到 Three.js 几何体
   *
   * @param field - Taichi 字段
   * @param geometry - Three.js 几何体
   * @param attributeName - 属性名称（默认 'position'）
   * @param itemSize - 每个元素的分量数（自动检测）
   *
   * @example
   * ```typescript
   * await bridge.syncFieldToGeometry(positions, geometry, 'position')
   * await bridge.syncFieldToGeometry(colors, geometry, 'color')
   * ```
   */
  async syncFieldToGeometry(
    field: TaichiField,
    geometry: THREE.BufferGeometry,
    attributeName: string = 'position',
    itemSize?: number
  ): Promise<void> {
    const startTime = performance.now()

    try {
      // 获取数据（使用最快的方法）
      const data = await this.getFieldData(field, itemSize)

      // 创建或更新 BufferAttribute
      const attribute = new THREE.Float32BufferAttribute(data, itemSize || this.detectItemSize(field))
      geometry.setAttribute(attributeName, attribute)
      attribute.needsUpdate = true

      // 更新性能监控
      const transferTime = performance.now() - startTime
      this.performanceMonitor.update(transferTime, data.byteLength)
    } catch (error) {
      console.error('[TaichiThreeBridge] syncFieldToGeometry error:', error)
      throw error
    }
  }

  /**
   * 同步 Taichi 字段到 Three.js 实例化网格
   *
   * @param positionField - 位置字段（3D 向量）
   * @param colorField - 颜色字段（可选，3D 向量）
   * @param scaleField - 缩放字段（可选，3D 向量）
   * @param instancedMesh - 实例化网格
   *
   * @example
   * ```typescript
   * await bridge.syncFieldToInstancedMesh(positions, colors, mesh)
   * await bridge.syncFieldToInstancedMesh(positions, null, scales, mesh)
   * ```
   */
  async syncFieldToInstancedMesh(
    positionField: TaichiField,
    colorField: TaichiField | null,
    scaleField: TaichiField | null,
    instancedMesh: THREE.InstancedMesh
  ): Promise<void> {
    const startTime = performance.now()

    try {
      // 获取位置数据
      const positions = await positionField.toArray1D()
      const count = positions.length / 3

      // 临时对象（避免在循环中创建）
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()
      const scale = new THREE.Vector3(1, 1, 1)
      const quaternion = new THREE.Quaternion()

      // 更新实例矩阵
      for (let i = 0; i < count; i++) {
        position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        )

        // 如果有缩放字段，使用自定义缩放
        if (scaleField) {
          const scaleData = await scaleField.toArray1D()
          scale.set(
            scaleData[i * 3],
            scaleData[i * 3 + 1],
            scaleData[i * 3 + 2]
          )
        }

        matrix.compose(position, quaternion, scale)
        instancedMesh.setMatrixAt(i, matrix)
      }

      instancedMesh.instanceMatrix.needsUpdate = true

      // 更新颜色（如果有）
      if (colorField && instancedMesh.instanceColor) {
        const colors = await colorField.toArray1D()
        const color = new THREE.Color()

        for (let i = 0; i < count; i++) {
          color.setRGB(
            colors[i * 3],
            colors[i * 3 + 1],
            colors[i * 3 + 2]
          )
          instancedMesh.setColorAt(i, color)
        }

        instancedMesh.instanceColor.needsUpdate = true
      }

      // 更新性能监控
      const transferTime = performance.now() - startTime
      this.performanceMonitor.update(transferTime, positions.byteLength)
    } catch (error) {
      console.error('[TaichiThreeBridge] syncFieldToInstancedMesh error:', error)
      throw error
    }
  }

  /**
   * 同步 Taichi 字段到 Three.js 纹理
   *
   * @param field - Taichi 字段（2D）
   * @param texture - Three.js 纹理
   * @param options - 可选配置
   *
   * @example
   * ```typescript
   * await bridge.syncFieldToTexture(densityField, texture)
   * ```
   */
  async syncFieldToTexture(
    field: TaichiField,
    texture: THREE.Texture,
    options: {
      format?: THREE.PixelFormat
      type?: THREE.TextureDataType
      flipY?: boolean
    } = {}
  ): Promise<void> {
    const startTime = performance.now()

    try {
      // 获取数据
      const data = await field.toArray1D()

      // 更新纹理数据
      if (texture instanceof THREE.DataTexture) {
        texture.image.data = new Float32Array(data)
      } else {
        texture.image = { data: new Float32Array(data), width: texture.image.width, height: texture.image.height }
      }

      // 应用配置
      if (options.flipY !== undefined) texture.flipY = options.flipY
      if (options.format) texture.format = options.format
      if (options.type) texture.type = options.type

      // 标记更新
      texture.needsUpdate = true

      // 更新性能监控
      const transferTime = performance.now() - startTime
      this.performanceMonitor.update(transferTime, data.byteLength)
    } catch (error) {
      console.error('[TaichiThreeBridge] syncFieldToTexture error:', error)
      throw error
    }
  }

  /**
   * 创建 DataTexture 从 Taichi 字段
   *
   * @param field - Taichi 字段（2D）
   * @param width - 纹理宽度
   * @param height - 纹理高度
   * @param options - 可选配置
   *
   * @returns DataTexture
   *
   * @example
   * ```typescript
   * const texture = await bridge.createDataTexture(densityField, 512, 512)
   * scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture })))
   * ```
   */
  async createDataTexture(
    field: TaichiField,
    width: number,
    height: number,
    options: {
      format?: THREE.PixelFormat
      type?: THREE.TextureDataType
      flipY?: boolean
    } = {}
  ): Promise<THREE.DataTexture> {
    const data = await field.toArray1D()
    const texture = new THREE.DataTexture(
      new Float32Array(data),
      width,
      height,
      options.format || THREE.RedFormat,
      options.type || THREE.FloatType
    )

    if (options.flipY !== undefined) texture.flipY = options.flipY

    return texture
  }

  /**
   * 创建粒子系统（Points）
   *
   * @param positionField - 位置字段
   * @param colorField - 颜色字段（可选）
   * @param options - 可选配置
   *
   * @returns Points 对象
   *
   * @example
   * ```typescript
   * const particleSystem = await bridge.createParticleSystem(positions, colors, {
   *   size: 0.1,
   *   vertexColors: true
   * })
   * scene.add(particleSystem)
   * ```
   */
  async createParticleSystem(
    positionField: TaichiField,
    colorField: TaichiField | null = null,
    options: {
      size?: number
      vertexColors?: boolean
      transparent?: boolean
      opacity?: number
      blending?: THREE.Blending
    } = {}
  ): Promise<THREE.Points> {
    const geometry = new THREE.BufferGeometry()

    // 同步位置
    await this.syncFieldToGeometry(positionField, geometry, 'position', 3)

    // 同步颜色（如果有）
    if (colorField && options.vertexColors !== false) {
      await this.syncFieldToGeometry(colorField, geometry, 'color', 3)
    }

    // 创建材质
    const material = new THREE.PointsMaterial({
      size: options.size || 0.1,
      vertexColors: options.vertexColors !== false,
      transparent: options.transparent || false,
      opacity: options.opacity || 1,
      blending: options.blending || THREE.NormalBlending
    })

    return new THREE.Points(geometry, material)
  }

  /**
   * 创建实例化网格系统
   *
   * @param geometry - 基础几何体
   * @param material - 基础材质
   * @param positionField - 位置字段
   * @param colorField - 颜色字段（可选）
   * @param count - 实例数量
   *
   * @returns InstancedMesh 对象
   *
   * @example
   * ```typescript
   * const instancedMesh = await bridge.createInstancedMeshSystem(
   *   geometry,
   *   material,
   *   positions,
   *   colors,
   *   10000
   * )
   * scene.add(instancedMesh)
   * ```
   */
  async createInstancedMeshSystem(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    positionField: TaichiField,
    colorField: TaichiField | null = null,
    count: number
  ): Promise<THREE.InstancedMesh> {
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count)

    // 如果有颜色字段，初始化实例颜色
    if (colorField) {
      instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3)
    }

    // 初始同步
    await this.syncFieldToInstancedMesh(positionField, colorField, null, instancedMesh)

    return instancedMesh
  }

  /**
   * 更新粒子系统
   *
   * @param points - Points 对象
   * @param positionField - 位置字段
   * @param colorField - 颜色字段（可选）
   *
   * @example
   * ```typescript
   * await bridge.updateParticleSystem(particleSystem, positions, colors)
   * ```
   */
  async updateParticleSystem(
    points: THREE.Points,
    positionField: TaichiField,
    colorField: TaichiField | null = null
  ): Promise<void> {
    await this.syncFieldToGeometry(positionField, points.geometry, 'position', 3)

    if (colorField) {
      await this.syncFieldToGeometry(colorField, points.geometry, 'color', 3)
    }
  }

  /**
   * 更新实例化网格系统
   *
   * @param instancedMesh - InstancedMesh 对象
   * @param positionField - 位置字段
   * @param colorField - 颜色字段（可选）
   * @param scaleField - 缩放字段（可选）
   *
   * @example
   * ```typescript
   * await bridge.updateInstancedMeshSystem(mesh, positions, colors)
   * ```
   */
  async updateInstancedMeshSystem(
    instancedMesh: THREE.InstancedMesh,
    positionField: TaichiField,
    colorField: TaichiField | null = null,
    scaleField: TaichiField | null = null
  ): Promise<void> {
    await this.syncFieldToInstancedMesh(positionField, colorField, scaleField, instancedMesh)
  }

  /**
   * 获取字段数据（智能选择最优方法）
   */
  private async getFieldData(field: TaichiField, itemSize?: number): Promise<Float32Array> {
    // 优先使用 toFloat32Array（最快）
    if (typeof field.toFloat32Array === 'function') {
      return await field.toFloat32Array()
    }

    // 其次使用 toInt32Array
    if (typeof field.toInt32Array === 'function') {
      const data = await field.toInt32Array()
      return new Float32Array(data)
    }

    // 最后使用 toArray1D
    const data = await field.toArray1D()
    return new Float32Array(data)
  }

  /**
   * 检测字段的 itemSize
   */
  private detectItemSize(field: TaichiField): number {
    const dims = field.dimensions
    if (dims.length === 1) {
      // 1D 字段，假设是标量
      return 1
    } else if (dims.length === 2) {
      // 2D 字段，第二个维度是 itemSize
      return dims[1]
    }
    return 1
  }

  /**
   * 获取性能指标
   */
  getPerformance(): PerformanceMetrics {
    return {
      fps: this.performanceMonitor.getFps(),
      frameTime: this.performanceMonitor.getFrameTime(),
      transferTime: this.performanceMonitor.getTransferTime(),
      mode: this.mode,
      dataSize: this.performanceMonitor.getDataSize()
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 销毁桥接器
   */
  dispose(): void {
    this.clearCache()
    this.performanceMonitor.dispose()
  }
}

// 性能监控器
class PerformanceMonitor {
  private frameTimes: number[] = []
  private transferTimes: number[] = []
  private dataSizes: number[] = []
  private maxSamples: number = 60
  private targetFps: number

  constructor(targetFps: number) {
    this.targetFps = targetFps
  }

  update(transferTime: number, dataSize: number): void {
    const now = performance.now()
    this.frameTimes.push(now)
    this.transferTimes.push(transferTime)
    this.dataSizes.push(dataSize)

    // 保持固定大小的样本
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift()
      this.transferTimes.shift()
      this.dataSizes.shift()
    }
  }

  getFps(): number {
    if (this.frameTimes.length < 2) return 0

    const duration = this.frameTimes[this.frameTimes.length - 1] - this.frameTimes[0]
    const frames = this.frameTimes.length - 1

    return (frames / duration) * 1000
  }

  getFrameTime(): number {
    if (this.frameTimes.length < 2) return 0

    let total = 0
    for (let i = 1; i < this.frameTimes.length; i++) {
      total += this.frameTimes[i] - this.frameTimes[i - 1]
    }

    return total / (this.frameTimes.length - 1)
  }

  getTransferTime(): number {
    if (this.transferTimes.length === 0) return 0

    const sum = this.transferTimes.reduce((a, b) => a + b, 0)
    return sum / this.transferTimes.length
  }

  getDataSize(): number {
    if (this.dataSizes.length === 0) return 0

    const sum = this.dataSizes.reduce((a, b) => a + b, 0)
    return sum / this.dataSizes.length
  }

  dispose(): void {
    this.frameTimes = []
    this.transferTimes = []
    this.dataSizes = []
  }
}

// 默认导出
export default TaichiThreeBridge
