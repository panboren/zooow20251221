/**
 * 统一资源清理工具
 * 为Three.js对象提供标准化的清理接口
 */

const prefix = '[ResourceCleaner]'

/**
 * 安全地清理一个对象
 * @param {Object} obj - 要清理的对象
 * @param {string} type - 对象类型（用于日志）
 */
export function safeDispose(obj, type = 'unknown') {
  if (!obj) {
    return
  }

  try {
    if (typeof obj.dispose === 'function') {
      obj.dispose()
      console.debug(`${prefix} 已清理 ${type}`)
    } else if (typeof obj.clear === 'function') {
      obj.clear()
      console.debug(`${prefix} 已清理 ${type} (使用clear方法)`)
    }
  } catch (error) {
    console.warn(`${prefix} 清理 ${type} 失败:`, error)
  }
}

/**
 * 清理几何体
 * @param {THREE.Geometry|THREE.BufferGeometry} geometry - 几何体对象
 */
export function cleanupGeometry(geometry) {
  if (!geometry) return

  try {
    geometry.dispose()
    console.debug(`${prefix} 已清理几何体`)
  } catch (error) {
    console.warn(`${prefix} 清理几何体失败:`, error)
  }
}

/**
 * 清理材质
 * @param {THREE.Material|THREE.Material[]} material - 材质对象或材质数组
 */
export function cleanupMaterial(material) {
  if (!material) return

  try {
    const materials = Array.isArray(material) ? material : [material]

    materials.forEach((mat) => {
      // 清理纹理
      if (mat.map) {
        cleanupTexture(mat.map)
        mat.map = null
      }

      // 清理其他纹理属性
      const textureProps = ['normalMap', 'displacementMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'lightMap', 'envMap', 'alphaMap', 'bumpMap']
      textureProps.forEach(prop => {
        if (mat[prop]) {
          cleanupTexture(mat[prop])
          mat[prop] = null
        }
      })

      // 释放材质
      mat.dispose()
    })

    console.debug(`${prefix} 已清理材质`)
  } catch (error) {
    console.warn(`${prefix} 清理材质失败:`, error)
  }
}

/**
 * 清理纹理
 * @param {THREE.Texture} texture - 纹理对象
 */
export function cleanupTexture(texture) {
  if (!texture) return

  try {
    texture.dispose()
    console.debug(`${prefix} 已清理纹理`)
  } catch (error) {
    console.warn(`${prefix} 清理纹理失败:`, error)
  }
}

/**
 * 清理网格
 * @param {THREE.Mesh|THREE.Group} object - 网格对象或组对象
 * @param {boolean} recursive - 是否递归清理子对象
 */
export function cleanupMesh(object, recursive = true) {
  if (!object) return

  try {
    if (recursive && object.children && object.children.length > 0) {
      // 从后往前删除子对象
      for (let i = object.children.length - 1; i >= 0; i--) {
        cleanupMesh(object.children[i], true)
      }
    }

    if (object.geometry) {
      cleanupGeometry(object.geometry)
      object.geometry = null
    }

    if (object.material) {
      cleanupMaterial(object.material)
      object.material = null
    }

    if (object.parent) {
      object.parent.remove(object)
    }

    console.debug(`${prefix} 已清理网格`)
  } catch (error) {
    console.warn(`${prefix} 清理网格失败:`, error)
  }
}

/**
 * 清理场景中的所有对象
 * @param {THREE.Scene} scene - 场景对象
 */
export function cleanupScene(scene) {
  if (!scene) return

  try {
    scene.traverse((object) => {
      if (object.geometry) {
        cleanupGeometry(object.geometry)
        object.geometry = null
      }

      if (object.material) {
        cleanupMaterial(object.material)
        object.material = null
      }
    })

    scene.clear()
    console.debug(`${prefix} 已清理场景`)
  } catch (error) {
    console.warn(`${prefix} 清理场景失败:`, error)
  }
}

/**
 * 清理粒子系统
 * @param {THREE.Points} points - 粒子系统对象
 */
export function cleanupParticleSystem(points) {
  if (!points) return

  try {
    cleanupGeometry(points.geometry)
    cleanupMaterial(points.material)

    if (points.parent) {
      points.parent.remove(points)
    }

    console.debug(`${prefix} 已清理粒子系统`)
  } catch (error) {
    console.warn(`${prefix} 清理粒子系统失败:`, error)
  }
}

/**
 * 清理动画混合器
 * @param {THREE.AnimationMixer} mixer - 动画混合器
 */
export function cleanupAnimationMixer(mixer) {
  if (!mixer) return

  try {
    mixer.stopAllAction()
    // 混合器本身没有dispose方法，手动清理引用
    mixer.uncacheRoot(mixer.getRoot())
    console.debug(`${prefix} 已清理动画混合器`)
  } catch (error) {
    console.warn(`${prefix} 清理动画混合器失败:`, error)
  }
}

/**
 * 清理控制器
 * @param {THREE.OrbitControls|THREE.Controls} controls - 控制器对象
 */
export function cleanupControls(controls) {
  if (!controls) return

  try {
    safeDispose(controls, '控制器')
  } catch (error) {
    console.warn(`${prefix} 清理控制器失败:`, error)
  }
}

/**
 * 清理渲染器
 * @param {THREE.WebGLRenderer|THREE.WebGPURenderer} renderer - 渲染器对象
 */
export function cleanupRenderer(renderer) {
  if (!renderer) return

  try {
    // 清理渲染目标和缓冲区
    renderer.dispose()
    console.debug(`${prefix} 已清理渲染器`)
  } catch (error) {
    console.warn(`${prefix} 清理渲染器失败:`, error)
  }
}

/**
 * 批量清理对象
 * @param {Array<Object>} objects - 要清理的对象数组
 * @param {Function} cleanupFn - 清理函数
 */
export function batchCleanup(objects, cleanupFn) {
  if (!Array.isArray(objects)) {
    console.warn(`${prefix} batchCleanup: 传入的不是一个数组`)
    return
  }

  let count = 0
  objects.forEach((obj, index) => {
    if (obj) {
      try {
        cleanupFn(obj, index)
        count++
      } catch (error) {
        console.warn(`${prefix} 批量清理第 ${index} 项失败:`, error)
      }
    }
  })

  console.debug(`${prefix} 批量清理完成: ${count}/${objects.length}`)
}

/**
 * 清理Blob URL
 * @param {string} blobUrl - Blob URL
 */
export function cleanupBlobURL(blobUrl) {
  if (!blobUrl || typeof blobUrl !== 'string') return

  try {
    URL.revokeObjectURL(blobUrl)
    console.debug(`${prefix} 已释放 Blob URL`)
  } catch (error) {
    console.warn(`${prefix} 释放 Blob URL 失败:`, error)
  }
}

/**
 * 清理Blob URL缓存
 * @param {Map<string, string>} cache - Blob URL缓存Map
 */
export function cleanupBlobCache(cache) {
  if (!cache || !(cache instanceof Map)) return

  let count = 0
  cache.forEach((blobUrl) => {
    cleanupBlobURL(blobUrl)
    count++
  })

  cache.clear()
  console.debug(`${prefix} 已清理 Blob 缓存: ${count} 个URL`)
}

/**
 * 创建统一的清理上下文
 * 用于管理动画资源的生命周期
 */
export class ResourceContext {
  constructor(name = 'ResourceContext') {
    this.name = name
    this.resources = []
    this.disposables = new Set()
    console.debug(`${prefix} 创建资源上下文: ${name}`)
  }

  /**
   * 注册一个资源
   * @param {Object} resource - 资源对象
   * @param {Function} cleanupFn - 清理函数
   */
  register(resource, cleanupFn) {
    if (resource) {
      this.resources.push({ resource, cleanupFn })
      console.debug(`${prefix} ${this.name}: 注册资源`)
    }
  }

  /**
   * 注册一个可释放对象
   * @param {Object} disposable - 可释放对象
   */
  registerDisposable(disposable) {
    if (disposable && typeof disposable.dispose === 'function') {
      this.disposables.add(disposable)
      console.debug(`${prefix} ${this.name}: 注册可释放对象`)
    }
  }

  /**
   * 清理所有注册的资源
   */
  cleanup() {
    console.info(`${prefix} ${this.name}: 开始清理资源`)

    // 清理自定义资源
    for (let i = this.resources.length - 1; i >= 0; i--) {
      const { resource, cleanupFn } = this.resources[i]
      try {
        cleanupFn(resource)
      } catch (error) {
        console.warn(`${prefix} ${this.name}: 清理资源失败`, error)
      }
    }
    this.resources = []

    // 清理可释放对象
    this.disposables.forEach((disposable) => {
      try {
        disposable.dispose()
      } catch (error) {
        console.warn(`${prefix} ${this.name}: 释放对象失败`, error)
      }
    })
    this.disposables.clear()

    console.info(`${prefix} ${this.name}: 资源清理完成`)
  }

  /**
   * 获取资源数量
   */
  getResourceCount() {
    return this.resources.length + this.disposables.size
  }
}

/**
 * 默认导出 - 所有清理函数
 */
export default {
  safeDispose,
  cleanupGeometry,
  cleanupMaterial,
  cleanupTexture,
  cleanupMesh,
  cleanupScene,
  cleanupParticleSystem,
  cleanupAnimationMixer,
  cleanupControls,
  cleanupRenderer,
  batchCleanup,
  cleanupBlobURL,
  cleanupBlobCache,
  ResourceContext
}
