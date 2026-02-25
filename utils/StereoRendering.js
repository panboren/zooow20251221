/**
 * 立体渲染优化系统
 * 支持VR/AR/立体显示的高效渲染
 */

import * as THREE from 'three'
import { ResourceContext } from './ResourceCleaner.js'

export class StereoRendering {
  constructor(renderer, options = {}) {
    this.renderer = renderer
    this.options = {
      eyeSeparation: 0.064,        // 眼睛间距（米）
      convergence: 1,              // 聚焦距离
      method: 'webxr',              // webxr/manual/offset
      enableOcclusion: true,       // 启用双眼遮挡
      enableMultiView: false,       // 启用多视图（WebGL 2）
      enableAsyncReprojection: true, // 启用异步重投影
      ...options
    }

    this.cameras = {
      left: new THREE.PerspectiveCamera(),
      right: new THREE.PerspectiveCamera()
    }

    this.stereoCamera = null
    this.scene = null
    this.renderTarget = null

    // 性能优化
    this.sharedMaterials = new Map()
    this.sharedGeometries = new Map()
    this.lastFrameTime = 0

    // 统计
    this.stats = {
      leftEyeTime: 0,
      rightEyeTime: 0,
      totalFrames: 0,
      averageTime: 0
    }

    this.context = new ResourceContext('StereoRendering')

    this.init()
  }

  /**
   * 初始化
   */
  init() {
    this.stereoCamera = new THREE.StereoCamera()
    this.stereoCamera.eyeSep = this.options.eyeSeparation
    this.stereoCamera.cameraL = this.cameras.left
    this.stereoCamera.cameraR = this.cameras.right

    // 创建渲染目标（用于非WebXR模式）
    this.createRenderTarget()
  }

  /**
   * 创建渲染目标
   */
  createRenderTarget(width = 1024, height = 1024) {
    if (this.renderTarget) {
      this.context.clear()
    }

    this.renderTarget = new THREE.WebGLRenderTarget(
      width,
      height,
      {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter
      }
    )

    return this.renderTarget
  }

  /**
   * 设置场景
   */
  setScene(scene) {
    this.scene = scene
  }

  /**
   * 更新立体相机
   */
  updateStereoCamera(baseCamera) {
    this.stereoCamera.update(baseCamera)
  }

  /**
   * 渲染立体视图
   */
  render(scene, camera) {
    this.scene = scene

    if (this.options.method === 'webxr') {
      return this.renderWebXR(scene, camera)
    } else {
      return this.renderManual(scene, camera)
    }
  }

  /**
   * WebXR渲染
   */
  renderWebXR(scene, camera) {
    const baseLayer = this.renderer.xr.getBaseLayer()
    if (!baseLayer) return

    const frame = this.renderer.xr.getFrame()
    const referenceSpace = this.renderer.xr.getReferenceSpace()

    const startTime = performance.now()

    // 获取视图
    for (const view of frame.views) {
      const viewport = baseLayer.getViewport(view)
      const pose = frame.getPose(view.transform, referenceSpace)

      // 设置相机
      const eyeCamera = view.eye === 'left' ? this.cameras.left : this.cameras.right
      eyeCamera.matrix.fromArray(pose.transform.matrix)
      eyeCamera.matrix.decompose(
        eyeCamera.position,
        eyeCamera.quaternion,
        eyeCamera.scale
      )
      eyeCamera.projectionMatrix.fromArray(view.projectionMatrix)

      // 渲染
      this.renderer.setScissorTest(true)
      this.renderer.setScissor(viewport.x, viewport.y, viewport.width, viewport.height)
      this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height)
      this.renderer.render(scene, eyeCamera)
    }

    this.renderer.setScissorTest(false)

    // 更新统计
    const duration = performance.now() - startTime
    this.stats.totalFrames++
    this.stats.averageTime =
      (this.stats.averageTime * (this.stats.totalFrames - 1) + duration) /
      this.stats.totalFrames

    return baseLayer
  }

  /**
   * 手动立体渲染
   */
  renderManual(scene, camera) {
    this.updateStereoCamera(camera)

    const leftEyeTime = performance.now()

    // 渲染左眼
    this.renderEye(scene, this.cameras.left, 'left', 0, 0)

    this.stats.leftEyeTime = performance.now() - leftEyeTime

    const rightEyeTime = performance.now()

    // 渲染右眼
    this.renderEye(scene, this.cameras.right, 'right', 0.5, 0)

    this.stats.rightEyeTime = performance.now() - rightEyeTime

    // 更新统计
    this.stats.totalFrames++
    this.stats.averageTime = (this.stats.leftEyeTime + this.stats.rightEyeTime) / 2

    return this.renderTarget
  }

  /**
   * 渲染单眼
   */
  renderEye(scene, camera, eye, x, y) {
    const width = this.renderTarget.texture.image.width / 2
    const height = this.renderTarget.texture.image.height

    this.renderer.setScissorTest(true)
    this.renderer.setScissor(x * width, y * height, width, height)
    this.renderer.setViewport(x * width, y * height, width, height)

    this.renderer.render(scene, camera)

    this.renderer.setScissorTest(false)
  }

  /**
   * 优化材质共享
   */
  optimizeMaterialSharing(scene) {
    scene.traverse(object => {
      if (object.material) {
        const materialKey = this.getMaterialKey(object.material)

        if (!this.sharedMaterials.has(materialKey)) {
          this.sharedMaterials.set(materialKey, object.material)
        } else {
          object.material = this.sharedMaterials.get(materialKey)
        }
      }
    })

    return this.sharedMaterials
  }

  /**
   * 获取材质键值
   */
  getMaterialKey(material) {
    const key = [
      material.type,
      material.uuid
    ].join('_')

    return key
  }

  /**
   * 优化几何体共享
   */
  optimizeGeometrySharing(scene) {
    scene.traverse(object => {
      if (object.geometry) {
        const geometryKey = this.getGeometryKey(object.geometry)

        if (!this.sharedGeometries.has(geometryKey)) {
          this.sharedGeometries.set(geometryKey, object.geometry)
        } else {
          object.geometry = this.sharedGeometries.get(geometryKey)
        }
      }
    })

    return this.sharedGeometries
  }

  /**
   * 获取几何体键值
   */
  getGeometryKey(geometry) {
    const key = [
      geometry.type,
      geometry.uuid,
      geometry.attributes.position ? geometry.attributes.position.count : 0
    ].join('_')

    return key
  }

  /**
   * 创建深度纹理（用于双眼遮挡）
   */
  createDepthTexture(width, height) {
    const depthTexture = new THREE.DepthTexture(width, height)
    depthTexture.format = THREE.DepthFormat
    depthTexture.type = THREE.UnsignedInt248Type

    return depthTexture
  }

  /**
   * 执行双眼遮挡
   */
  performOcclusion() {
    if (!this.options.enableOcclusion) return

    // 这里实现双眼之间的遮挡处理
    // 实际应用中需要更复杂的实现
  }

  /**
   * 设置眼睛间距
   */
  setEyeSeparation(separation) {
    this.options.eyeSeparation = separation
    this.stereoCamera.eyeSep = separation
  }

  /**
   * 设置聚焦距离
   */
  setConvergence(convergence) {
    this.options.convergence = convergence
    this.stereoCamera.convergence = convergence
  }

  /**
   * 自动调整眼睛间距
   */
  autoAdjustEyeSeparation(scene, camera) {
    // 根据场景深度自动调整眼睛间距
    const depthInfo = this.analyzeSceneDepth(scene, camera)

    if (depthInfo) {
      const optimalSeparation = Math.min(
        this.options.eyeSeparation,
        depthInfo.minDistance * 0.1
      )

      this.setEyeSeparation(optimalSeparation)
    }

    return depthInfo
  }

  /**
   * 分析场景深度
   */
  analyzeSceneDepth(scene, camera) {
    let minDistance = Infinity
    let maxDistance = 0

    scene.traverse(object => {
      if (object.position) {
        const distance = camera.position.distanceTo(object.position)
        minDistance = Math.min(minDistance, distance)
        maxDistance = Math.max(maxDistance, distance)
      }
    })

    return {
      minDistance,
      maxDistance,
      depthRange: maxDistance - minDistance
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      sharedMaterials: this.sharedMaterials.size,
      sharedGeometries: this.sharedGeometries.size,
      currentMethod: this.options.method
    }
  }

  /**
   * 重置统计
   */
  resetStats() {
    this.stats = {
      leftEyeTime: 0,
      rightEyeTime: 0,
      totalFrames: 0,
      averageTime: 0
    }
  }

  /**
   * 清理
   */
  dispose() {
    this.context.clear()

    this.sharedMaterials.clear()
    this.sharedGeometries.clear()

    if (this.renderTarget) {
      this.renderTarget.dispose()
      this.renderTarget = null
    }
  }
}

/**
 * VR渲染器
 */
export class VRRenderer extends StereoRendering {
  constructor(renderer, options = {}) {
    super(renderer, {
      ...options,
      method: 'webxr'
    })

    this.xrSession = null
    this.xrReferenceSpace = null
    this.xrFrame = null
  }

  /**
   * 初始化VR会话
   */
  async initVR(options = {}) {
    const sessionInit = {
      optionalFeatures: ['local-floor', 'bounded-floor', 'high-refresh-rate'],
      ...options
    }

    try {
      this.xrSession = await navigator.xr.requestSession('immersive-vr', sessionInit)

      await this.renderer.xr.setSession(this.xrSession)
      this.xrReferenceSpace = await this.xrSession.requestReferenceSpace('local-floor')

      console.log('[VRRenderer] VR session initialized')

      return true
    } catch (error) {
      console.error('[VRRenderer] Failed to initialize VR:', error)
      return false
    }
  }

  /**
   * 结束VR会话
   */
  endVR() {
    if (this.xrSession) {
      this.xrSession.end()
      this.xrSession = null
    }
  }

  /**
   * 检查VR支持
   */
  static isSupported() {
    return 'xr' in navigator && navigator.xr.isSessionSupported('immersive-vr')
  }

  /**
   * 渲染VR帧
   */
  renderVRFrame(scene, camera) {
    if (!this.xrSession) return

    const baseLayer = this.renderer.xr.getBaseLayer()
    if (!baseLayer) return

    const frame = this.renderer.xr.getFrame()
    const referenceSpace = this.renderer.xr.getReferenceSpace()

    for (const view of frame.views) {
      const viewport = baseLayer.getViewport(view)
      const pose = frame.getPose(view.transform, referenceSpace)

      const eyeCamera = view.eye === 'left' ? this.cameras.left : this.cameras.right
      eyeCamera.matrix.fromArray(pose.transform.matrix)
      eyeCamera.matrix.decompose(
        eyeCamera.position,
        eyeCamera.quaternion,
        eyeCamera.scale
      )
      eyeCamera.projectionMatrix.fromArray(view.projectionMatrix)

      this.renderer.setScissorTest(true)
      this.renderer.setScissor(viewport.x, viewport.y, viewport.width, viewport.height)
      this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height)
      this.renderer.render(scene, eyeCamera)
    }

    this.renderer.setScissorTest(false)
  }

  /**
   * 获取控制器
   */
  getControllers() {
    const controllers = []

    for (let i = 0; i < 2; i++) {
      const controller = this.renderer.xr.getController(i)
      if (controller) {
        controllers.push(controller)
      }
    }

    return controllers
  }

  /**
   * 获取手柄
   */
  getGamepads() {
    const gamepads = navigator.getGamepads()
    const vrGamepads = []

    gamepads.forEach(gamepad => {
      if (gamepad && gamepad.connected) {
        vrGamepads.push(gamepad)
      }
    })

    return vrGamepads
  }
}

/**
 * AR渲染器
 */
export class ARRenderer extends StereoRendering {
  constructor(renderer, options = {}) {
    super(renderer, {
      ...options,
      method: 'webxr'
    })

    this.arSession = null
  }

  /**
   * 初始化AR会话
   */
  async initAR(options = {}) {
    const sessionInit = {
      optionalFeatures: ['dom-overlay', 'hit-test', 'planes'],
      domOverlay: {
        root: document.body
      },
      ...options
    }

    try {
      this.arSession = await navigator.xr.requestSession('immersive-ar', sessionInit)

      await this.renderer.xr.setSession(this.arSession)

      console.log('[ARRenderer] AR session initialized')

      return true
    } catch (error) {
      console.error('[ARRenderer] Failed to initialize AR:', error)
      return false
    }
  }

  /**
   * 结束AR会话
   */
  endAR() {
    if (this.arSession) {
      this.arSession.end()
      this.arSession = null
    }
  }

  /**
   * 检查AR支持
   */
  static isSupported() {
    return 'xr' in navigator && navigator.xr.isSessionSupported('immersive-ar')
  }

  /**
   * 执行命中测试
   */
  async hitTest(x, y) {
    if (!this.arSession) return null

    const viewerPose = this.renderer.xr.getViewerPose(this.arSession)
    if (!viewerPose) return null

    const hitTestResults = await this.arSession.requestHitTest(
      { x, y },
      viewerPose.transformMatrix,
      viewerPose.referenceSpace
    )

    return hitTestResults
  }

  /**
   * 获取检测到的平面
   */
  async getPlanes() {
    if (!this.arSession) return []

    const planes = await this.arSession.requestPlanes()
    return planes
  }
}

export default StereoRendering
