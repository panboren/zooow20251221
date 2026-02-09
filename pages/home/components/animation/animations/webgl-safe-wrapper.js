/**
 * WebGL 安全包装器
 * 提供 WebGL 上下文丢失/恢复的统一处理
 */

import * as THREE from 'three'
import { logger } from './logger.js'

/**
 * WebGL 安全包装器类
 */
class WebGLSafeWrapper {
  constructor(canvas, renderer) {
    this.canvas = canvas
    this.renderer = renderer
    this.contextLost = false
    this.callbacks = []
    this._setupContextListeners()
  }

  /**
   * 设置 WebGL 上下文监听器
   */
  _setupContextListeners() {
    // WebGL 上下文丢失
    this.canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      this.contextLost = true
      logger.warn('WebGL context lost')

      // 通知所有注册的回调
      this.callbacks.forEach(callback => {
        if (callback.onContextLost) callback.onContextLost(event)
      })
    }, false)

    // WebGL 上下文恢复
    this.canvas.addEventListener('webglcontextrestored', (event) => {
      logger.log('WebGL context restored')
      this.contextLost = false

      // 通知所有注册的回调
      this.callbacks.forEach(callback => {
        if (callback.onContextRestored) callback.onContextRestored(event)
      })
    }, false)
  }

  /**
   * 注册上下文事件回调
   */
  onContext(callbacks) {
    this.callbacks.push(callbacks)
    return () => {
      const index = this.callbacks.indexOf(callbacks)
      if (index > -1) this.callbacks.splice(index, 1)
    }
  }

  /**
   * 安全渲染（检查上下文是否丢失）
   */
  safeRender(scene, camera) {
    if (this.contextLost) {
      logger.warn('Skipping render - WebGL context lost')
      return false
    }
    try {
      this.renderer.render(scene, camera)
      return true
    } catch (error) {
      logger.error('Render error:', error)
      return false
    }
  }

  /**
   * 检查 WebGL 上下文状态
   */
  isContextLost() {
    return this.contextLost
  }

  /**
   * 销毁监听器
   */
  dispose() {
    // 移除监听器需要使用 clone 的事件监听器
    // 这里简化处理，实际使用时需要注意
  }
}

/**
 * 安全的 TextureLoader 包装器
 */
export class SafeTextureLoader {
  constructor() {
    this.loader = new THREE.TextureLoader()
  }

  /**
   * 带错误处理的纹理加载
   */
  load(url, onSuccess, onError, fallbackColor = 0x888888) {
    this.loader.load(
      url,
      (texture) => {
        logger.log('Texture loaded:', url)
        if (onSuccess) onSuccess(texture)
      },
      undefined,
      (error) => {
        logger.warn('Texture load failed, using fallback:', url, error)
        if (onError) onError(error, fallbackColor)
      }
    )
  }

  /**
   * 带降级方案的纹理加载
   * 加载失败时返回纯色材质
   */
  loadWithFallback(url, material, colorAttr = 'color') {
    this.loader.load(
      url,
      (texture) => {
        material.map = texture
        material.needsUpdate = true
      },
      undefined,
      (error) => {
        logger.warn('Texture load failed, using fallback color:', url)
        material[colorAttr] = new THREE.Color(0x888888)
        material.needsUpdate = true
      }
    )
  }
}

/**
 * 创建 WebGL 安全包装器实例
 */
export function createWebGLSafeWrapper(canvas, renderer) {
  return new WebGLSafeWrapper(canvas, renderer)
}

export default WebGLSafeWrapper
