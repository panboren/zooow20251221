/**
 * 内存池管理
 * 重用对象以减少GC压力和内存分配
 */

export class MemoryPool {
  constructor(createFn, resetFn, initialSize = 100) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.pool = []
    this.active = []
    this.created = 0
    this.reused = 0

    // 预分配对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn())
      this.created++
    }
  }

  /**
   * 获取对象
   */
  get() {
    let obj

    if (this.pool.length > 0) {
      obj = this.pool.pop()
      this.reused++
    } else {
      obj = this.createFn()
      this.created++
    }

    this.active.push(obj)
    return obj
  }

  /**
   * 释放对象
   */
  release(obj) {
    const index = this.active.indexOf(obj)
    if (index !== -1) {
      this.active.splice(index, 1)
      this.resetFn(obj)
      this.pool.push(obj)
    }
  }

  /**
   * 释放所有活动对象
   */
  releaseAll() {
    while (this.active.length > 0) {
      const obj = this.active.pop()
      this.resetFn(obj)
      this.pool.push(obj)
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalCreated: this.created,
      totalReused: this.reused,
      reuseRate: this.created > 0 ? ((this.reused / this.created) * 100).toFixed(2) + '%' : '0%',
      poolSize: this.pool.length,
      activeSize: this.active.length
    }
  }

  /**
   * 清空池
   */
  clear() {
    this.releaseAll()
    this.pool = []
    this.created = 0
    this.reused = 0
  }
}

/**
 * 向量内存池
 */
export class Vector3Pool extends MemoryPool {
  constructor(initialSize = 1000) {
    super(
      () => new THREE.Vector3(),
      (v) => v.set(0, 0, 0),
      initialSize
    )
  }

  /**
   * 释放向量
   */
  release(v) {
    super.release(v)
  }
}

/**
 * 颜色内存池
 */
export class ColorPool extends MemoryPool {
  constructor(initialSize = 1000) {
    super(
      () => new THREE.Color(),
      (c) => c.set(0xffffff),
      initialSize
    )
  }
}

/**
 * 粒子数据池
 */
export class ParticleDataPool extends MemoryPool {
  constructor(initialSize = 1000) {
    super(
      () => ({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        color: new THREE.Color(),
        size: 1,
        life: 1,
        age: 0
      }),
      (data) => {
        data.position.set(0, 0, 0)
        data.velocity.set(0, 0, 0)
        data.color.set(0xffffff)
        data.size = 1
        data.life = 1
        data.age = 0
      },
      initialSize
    )
  }
}

/**
 * 数组池
 */
export class ArrayPool {
  constructor(initialSize = 10, arraySize = 1000) {
    this.pool = []
    this.active = []
    this.arraySize = arraySize
    this.created = 0
    this.reused = 0

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new Float32Array(this.arraySize))
      this.created++
    }
  }

  /**
   * 获取数组
   */
  get() {
    let arr

    if (this.pool.length > 0) {
      arr = this.pool.pop()
      this.reused++
    } else {
      arr = new Float32Array(this.arraySize)
      this.created++
    }

    this.active.push(arr)
    return arr
  }

  /**
   * 释放数组
   */
  release(arr) {
    const index = this.active.indexOf(arr)
    if (index !== -1) {
      this.active.splice(index, 1)
      this.pool.push(arr)
    }
  }

  /**
   * 获取统计
   */
  getStats() {
    return {
      totalCreated: this.created,
      totalReused: this.reused,
      reuseRate: this.created > 0 ? ((this.reused / this.created) * 100).toFixed(2) + '%' : '0%',
      poolSize: this.pool.length,
      activeSize: this.active.length
    }
  }
}

/**
 * 统一内存池管理器
 */
export class PoolManager {
  constructor() {
    this.pools = new Map()
  }

  /**
   * 注册池
   */
  registerPool(name, pool) {
    this.pools.set(name, pool)
  }

  /**
   * 获取池
   */
  getPool(name) {
    return this.pools.get(name)
  }

  /**
   * 从指定池获取对象
   */
  get(poolName) {
    const pool = this.pools.get(poolName)
    if (!pool) {
      throw new Error(`Pool not found: ${poolName}`)
    }
    return pool.get()
  }

  /**
   * 释放对象到指定池
   */
  release(poolName, obj) {
    const pool = this.pools.get(poolName)
    if (pool) {
      pool.release(obj)
    }
  }

  /**
   * 释放所有池
   */
  releaseAll() {
    this.pools.forEach(pool => {
      if (pool.releaseAll) {
        pool.releaseAll()
      }
    })
  }

  /**
   * 获取所有统计
   */
  getAllStats() {
    const stats = {}
    this.pools.forEach((pool, name) => {
      stats[name] = pool.getStats ? pool.getStats() : {}
    })
    return stats
  }

  /**
   * 清空所有池
   */
  clear() {
    this.pools.forEach(pool => {
      if (pool.clear) {
        pool.clear()
      }
    })
  }
}

// 创建全局单例
let globalPoolManager = null

export function getPoolManager() {
  if (!globalPoolManager) {
    globalPoolManager = new PoolManager()

    // 注册默认池
    globalPoolManager.registerPool('vector3', new Vector3Pool(1000))
    globalPoolManager.registerPool('color', new ColorPool(1000))
    globalPoolManager.registerPool('particle', new ParticleDataPool(1000))
    globalPoolManager.registerPool('array', new ArrayPool(10, 10000))
  }

  return globalPoolManager
}

export default PoolManager
