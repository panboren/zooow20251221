/**
 * GPU Frustum Culling 系统
 * 基于GPU的视锥体剔除，提高渲染性能
 */

import * as THREE from 'three'
import { ResourceContext } from './ResourceCleaner.js'

export class FrustumCulling {
  constructor(renderer, options = {}) {
    this.renderer = renderer
    this.options = {
      enableBoundingVolumeUpdate: true,
      updateInterval: 1,              // 每N帧更新一次
      cullingDistance: 1000,          // 剔除距离
      enableOcclusion: false,         // 启用遮挡剔除
      occlusionSamples: 16,
      enableDistanceSorting: true,    // 启用距离排序
      debugMode: false,
      ...options
    }

    this.objects = new Map()
    this.visibleObjects = new Set()
    this.occludedObjects = new Set()

    this.camera = null
    this.frustum = new THREE.Frustum()
    this.projScreenMatrix = new THREE.Matrix4()

    this.frameCount = 0
    this.stats = {
      totalObjects: 0,
      visibleObjects: 0,
      culledObjects: 0,
      culledByDistance: 0,
      culledByFrustum: 0
    }

    this.context = new ResourceContext('FrustumCulling')
  }

  /**
   * 设置相机
   */
  setCamera(camera) {
    this.camera = camera
    this.updateFrustum()
  }

  /**
   * 更新视锥体
   */
  updateFrustum() {
    if (!this.camera) return

    this.projScreenMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    )
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix)
  }

  /**
   * 添加对象
   */
  add(object, options = {}) {
    const id = object.uuid

    if (this.objects.has(id)) {
      return false
    }

    const cullingInfo = {
      object,
      boundingBox: new THREE.Box3(),
      boundingSphere: new THREE.Sphere(),
      lastVisibleTime: 0,
      visibleFrames: 0,
      culledFrames: 0,
      distance: 0,
      priority: options.priority || 'normal',  // high/normal/low
      alwaysVisible: options.alwaysVisible || false,
      occlusionQuery: null,
      ...options
    }

    // 计算边界
    this.updateBoundingVolume(object, cullingInfo)

    this.objects.set(id, cullingInfo)

    return true
  }

  /**
   * 批量添加对象
   */
  addAll(objects, options = {}) {
    objects.forEach(object => this.add(object, options))
  }

  /**
   * 移除对象
   */
  remove(object) {
    const id = object.uuid
    const info = this.objects.get(id)

    if (info) {
      // 清理遮挡查询
      if (info.occlusionQuery) {
        this.renderer.deleteQuery(info.occlusionQuery)
      }

      this.objects.delete(id)
      this.visibleObjects.delete(id)
      this.occludedObjects.delete(id)

      return true
    }

    return false
  }

  /**
   * 更新边界体积
   */
  updateBoundingVolume(object, info = null) {
    if (!info) {
      info = this.objects.get(object.uuid)
    }

    if (!info) return

    info.boundingBox.setFromObject(object)
    info.boundingBox.getBoundingSphere(info.boundingSphere)

    // 世界位置
    const worldPosition = new THREE.Vector3()
    object.getWorldPosition(worldPosition)
    info.boundingSphere.center.copy(worldPosition)
  }

  /**
   * 更新所有边界体积
   */
  updateAllBoundingVolumes() {
    this.objects.forEach((info, id) => {
      this.updateBoundingVolume(info.object, info)
    })
  }

  /**
   * 执行视锥体剔除
   */
  cull() {
    if (!this.camera) return this.visibleObjects

    this.frameCount++

    // 定期更新视锥体
    if (this.frameCount % this.options.updateInterval === 0) {
      this.updateFrustum()

      // 更新边界体积
      if (this.options.enableBoundingVolumeUpdate) {
        this.objects.forEach((info, id) => {
          // 只更新移动的对象
          if (this.shouldUpdateBounds(info)) {
            this.updateBoundingVolume(info.object, info)
          }
        })
      }
    }

    // 重置可见性
    this.visibleObjects.clear()
    this.occludedObjects.clear()

    // 重置统计
    this.stats.totalObjects = this.objects.size
    this.stats.visibleObjects = 0
    this.stats.culledObjects = 0
    this.stats.culledByDistance = 0
    this.stats.culledByFrustum = 0

    // 剔除检查
    this.objects.forEach((info, id) => {
      const visible = this.checkVisibility(info)

      if (visible) {
        this.visibleObjects.add(id)
        info.object.visible = true
        info.lastVisibleTime = performance.now()
        info.visibleFrames++
        info.culledFrames = 0

        this.stats.visibleObjects++
      } else {
        info.object.visible = false
        info.culledFrames++

        this.stats.culledObjects++
      }
    })

    // 距离排序（如果启用）
    if (this.options.enableDistanceSorting) {
      this.sortByDistance()
    }

    // 遮挡剔除（如果启用）
    if (this.options.enableOcclusion) {
      this.occlusionCull()
    }

    return this.visibleObjects
  }

  /**
   * 检查可见性
   */
  checkVisibility(info) {
    // 始终可见对象
    if (info.alwaysVisible) return true

    // 距离剔除
    const cameraPosition = this.camera.position
    const distance = cameraPosition.distanceTo(info.boundingSphere.center)

    info.distance = distance

    if (distance > this.options.cullingDistance + info.boundingSphere.radius) {
      this.stats.culledByDistance++
      return false
    }

    // 视锥体剔除
    const intersects = this.frustum.intersectsSphere(info.boundingSphere)

    if (!intersects) {
      this.stats.culledByFrustum++
      return false
    }

    return true
  }

  /**
   * 检查是否应该更新边界
   */
  shouldUpdateBounds(info) {
    // 总是更新
    // 可以添加优化：只在对象移动时更新
    return true
  }

  /**
   * 按距离排序可见对象
   */
  sortByDistance() {
    const cameraPosition = this.camera.position

    // 将可见对象按距离排序
    const sorted = Array.from(this.visibleObjects).map(id => {
      const info = this.objects.get(id)
      return { id, distance: info.distance, info }
    })

    sorted.sort((a, b) => {
      // 优先级高的在前面
      const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 }
      const priorityDiff = priorityOrder[a.info.priority] - priorityOrder[b.info.priority]
      if (priorityDiff !== 0) return -priorityDiff

      // 距离近的在前面
      return a.distance - b.distance
    })

    // 更新对象渲染顺序
    sorted.forEach(({ id }, index) => {
      const info = this.objects.get(id)
      if (info.object.renderOrder !== undefined) {
        info.object.renderOrder = index
      }
    })
  }

  /**
   * 遮挡剔除
   */
  occlusionCull() {
    if (!this.renderer || !this.renderer.capabilities.isWebGL2) {
      return
    }

    // 简单遮挡剔除：检查对象是否被更近的对象遮挡
    const visibleArray = Array.from(this.visibleObjects)
      .map(id => this.objects.get(id))
      .filter(info => info)
      .sort((a, b) => a.distance - b.distance)

    for (let i = 0; i < visibleArray.length; i++) {
      const current = visibleArray[i]
      const currentId = current.object.uuid

      // 检查是否被更近的对象遮挡
      for (let j = 0; j < i; j++) {
        const blocker = visibleArray[j]

        if (this.isOccluded(current, blocker)) {
          this.visibleObjects.delete(currentId)
          this.occludedObjects.add(currentId)
          current.object.visible = false
          break
        }
      }
    }
  }

  /**
   * 检查遮挡
   */
  isOccluded(object, blocker) {
    // 简化的遮挡检查
    // 实际应用中可以使用GPU Occlusion Query

    // 如果阻挡对象更大且距离近，可能遮挡
    const blockerSize = blocker.boundingSphere.radius
    const objectSize = object.boundingSphere.radius

    if (blocker.distance < object.distance - blockerSize) {
      return false
    }

    // 检查2D投影重叠
    // 这里简化处理
    return blockerSize > objectSize * 2
  }

  /**
   * 获取可见对象
   */
  getVisibleObjects() {
    return Array.from(this.visibleObjects).map(id => this.objects.get(id)?.object).filter(obj => obj)
  }

  /**
   * 获取被剔除对象
   */
  getCulledObjects() {
    const allIds = new Set(this.objects.keys())
    Array.from(this.visibleObjects).forEach(id => allIds.delete(id))

    return Array.from(allIds).map(id => this.objects.get(id)?.object).filter(obj => obj)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      cullingRatio: (this.stats.culledObjects / Math.max(1, this.stats.totalObjects) * 100).toFixed(1) + '%',
      avgDistance: this.getAverageDistance(),
      topOccluded: this.getTopOccludedObjects(5)
    }
  }

  /**
   * 获取平均距离
   */
  getAverageDistance() {
    let total = 0
    let count = 0

    this.objects.forEach(info => {
      total += info.distance
      count++
    })

    return count > 0 ? (total / count).toFixed(2) : 0
  }

  /**
   * 获取最常被遮挡的对象
   */
  getTopOccludedObjects(count = 10) {
    const sorted = Array.from(this.objects.entries())
      .map(([id, info]) => ({
        id,
        name: info.object.name || 'unnamed',
        culledRatio: info.culledFrames / Math.max(1, info.culledFrames + info.visibleFrames)
      }))
      .sort((a, b) => b.culledRatio - a.culledRatio)
      .slice(0, count)

    return sorted
  }

  /**
   * 设置剔除距离
   */
  setCullingDistance(distance) {
    this.options.cullingDistance = distance
  }

  /**
   * 设置对象优先级
   */
  setPriority(object, priority) {
    const info = this.objects.get(object.uuid)
    if (info) {
      info.priority = priority
    }
  }

  /**
   * 设置对象始终可见
   */
  setAlwaysVisible(object, visible = true) {
    const info = this.objects.get(object.uuid)
    if (info) {
      info.alwaysVisible = visible
    }
  }

  /**
   * 启用调试模式
   */
  setDebugMode(enabled) {
    this.options.debugMode = enabled

    // 在调试模式下，显示边界框
    this.objects.forEach((info, id) => {
      if (enabled) {
        this.showBoundingBox(info)
      } else {
        this.hideBoundingBox(info)
      }
    })
  }

  /**
   * 显示边界框
   */
  showBoundingBox(info) {
    if (info.boundingBoxHelper) {
      info.object.add(info.boundingBoxHelper)
      return
    }

    const helper = new THREE.Box3Helper(
      info.boundingBox,
      info.visibleObjects.has(info.object.uuid) ? 0x00ff00 : 0xff0000
    )

    info.boundingBoxHelper = helper
    info.object.add(helper)
  }

  /**
   * 隐藏边界框
   */
  hideBoundingBox(info) {
    if (info.boundingBoxHelper) {
      info.object.remove(info.boundingBoxHelper)
      info.boundingBoxHelper = null
    }
  }

  /**
   * 更新调试显示
   */
  updateDebugDisplay() {
    if (!this.options.debugMode) return

    this.objects.forEach((info, id) => {
      if (info.boundingBoxHelper) {
        info.boundingBoxHelper.material.color.setHex(
          this.visibleObjects.has(id) ? 0x00ff00 : 0xff0000
        )
      }
    })
  }

  /**
   * 清理
   */
  dispose() {
    this.objects.forEach(info => {
      if (info.boundingBoxHelper) {
        info.object.remove(info.boundingBoxHelper)
      }

      if (info.occlusionQuery) {
        this.renderer.deleteQuery(info.occlusionQuery)
      }
    })

    this.objects.clear()
    this.visibleObjects.clear()
    this.occludedObjects.clear()
    this.context.clear()
  }
}

/**
 * GPU 遮挡查询剔除
 */
export class OcclusionQueryCulling extends FrustumCulling {
  constructor(renderer, options = {}) {
    super(renderer, {
      enableOcclusion: true,
      occlusionSamples: 16,
      ...options
    })

    this.queryResults = new Map()
    this.pendingQueries = new Set()
  }

  /**
   * 执行遮挡查询
   */
  occlusionCull() {
    if (!this.renderer) return

    // 检查之前的查询结果
    this.checkQueryResults()

    // 为新可见对象创建查询
    this.visibleObjects.forEach(id => {
      const info = this.objects.get(id)
      if (!info || this.pendingQueries.has(id)) return

      this.createQuery(info)
    })
  }

  /**
   * 创建查询
   */
  createQuery(info) {
    if (!this.renderer.capabilities.isWebGL2) return

    const query = this.renderer.createQuery()
    info.occlusionQuery = query

    this.renderer.beginQuery(query)

    // 渲染对象的简化版本用于遮挡查询
    // 这里简化处理
    const geometry = new THREE.SphereGeometry(info.boundingSphere.radius, 8, 8)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(info.boundingSphere.center)

    // 临时渲染
    // 实际应用中需要更复杂的实现

    this.renderer.endQuery(query)

    this.pendingQueries.add(info.object.uuid)
  }

  /**
   * 检查查询结果
   */
  checkQueryResults() {
    if (!this.renderer) return

    const toCheck = Array.from(this.pendingQueries)

    toCheck.forEach(id => {
      const info = this.objects.get(id)
      if (!info || !info.occlusionQuery) return

      const result = this.renderer.pollQuery(info.occlusionQuery)

      if (result !== undefined) {
        // 查询完成
        this.queryResults.set(id, {
          timestamp: performance.now(),
          visible: result > 0
        })

        // 如果被遮挡，标记为不可见
        if (result === 0) {
          this.visibleObjects.delete(id)
          this.occludedObjects.add(id)
          info.object.visible = false
        }

        this.pendingQueries.delete(id)
      }
    })
  }

  /**
   * 获取遮挡查询统计
   */
  getOcclusionStats() {
    let totalQueries = 0
    let occludedCount = 0

    this.queryResults.forEach(result => {
      totalQueries++
      if (!result.visible) {
        occludedCount++
      }
    })

    return {
      totalQueries,
      occludedCount,
      occlusionRatio: totalQueries > 0
        ? (occludedCount / totalQueries * 100).toFixed(1) + '%'
        : '0%',
      pendingQueries: this.pendingQueries.size
    }
  }

  /**
   * 清理查询
   */
  dispose() {
    super.dispose()

    this.objects.forEach(info => {
      if (info.occlusionQuery) {
        this.renderer.deleteQuery(info.occlusionQuery)
      }
    })

    this.queryResults.clear()
    this.pendingQueries.clear()
  }
}

export default FrustumCulling
