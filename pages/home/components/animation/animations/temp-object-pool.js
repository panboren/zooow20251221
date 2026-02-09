import * as THREE from 'three'

/**
 * Three.js 临时对象池
 * 解决频繁创建 new THREE.XXX() 导致的 GC 压力
 *
 * 用法：
 * const pool = new TempObjectPool()
 * const color = pool.getColor().setHSL(0.5, 0.8, 0.6)
 * // 使用 color
 * pool.release(color) // 或让 GC 自动回收
 */

class TempObjectPool {
  constructor() {
    this._colorPool = new THREE.Color()
    this._vectorPool = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ]
    this._vectorIndex = 0
  }

  /**
   * 获取临时 Color 对象（复用）
   */
  getColor() {
    return this._colorPool
  }

  /**
   * 获取临时 Vector3 对象（轮询复用）
   */
  getVector() {
    const vec = this._vectorPool[this._vectorIndex]
    this._vectorIndex = (this._vectorIndex + 1) % this._vectorPool.length
    return vec
  }

  /**
   * 创建新的 Color（仅在需要持久化时使用）
   */
  newColor(h, s, l) {
    return new THREE.Color().setHSL(h, s, l)
  }

  /**
   * 创建新的 Vector3（仅在需要持久化时使用）
   */
  newVector(x, y, z) {
    return new THREE.Vector3(x, y, z)
  }

  /**
   * 辅助函数：从 HSL 创建颜色并克隆
   */
  createHSLColor(hue, saturation, lightness) {
    return this._colorPool.setHSL(hue, saturation, lightness).clone()
  }
}

// 导出单例
export const tempPool = new TempObjectPool()

/**
 * 辅助函数：创建 HSL 颜色（使用对象池）
 * @param {number} hue - 色相 0-1
 * @param {number} saturation - 饱和度 0-1
 * @param {number} lightness - 亮度 0-1
 * @param {boolean} clone - 是否克隆（需要持久化时为 true）
 */
export function createHSLColor(hue, saturation, lightness, clone = false) {
  if (clone) {
    return tempPool.createHSLColor(hue, saturation, lightness)
  }
  return tempPool.getColor().setHSL(hue, saturation, lightness)
}

export default TempObjectPool
