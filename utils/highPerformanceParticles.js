/**
 * 高性能粒子系统 - 优化版
 * 针对 Vue.js + Three.js 项目深度优化
 */

import * as THREE from 'three'

/**
 * 创建高性能粒子系统
 * @param {THREE.Scene} scene - 场景对象
 * @param {Object} options - 配置选项
 * @returns {Object} 粒子系统控制对象
 */
export function createHighPerformanceParticles(scene, options = {}) {
  const {
    count = 8000,
    size = 8,
    colors = [0x00ffff, 0xff00ff, 0xffff00],
    blending = THREE.AdditiveBlending,
    transparent = true,
    opacity = 1,
    depthWrite = false,  // 关键性能优化
    sizeAttenuation = true
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const particleColors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count * 3)  // 速度数据

  const colorPalette = colors.map(c => new THREE.Color(c))

  for (let i = 0; i < count; i++) {
    // 位置
    positions[i * 3] = (Math.random() - 0.5) * 100
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100

    // 速度（初始化为 0）
    velocities[i * 3] = 0
    velocities[i * 3 + 1] = 0
    velocities[i * 3 + 2] = 0

    // 颜色（从调色板随机选择）
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b

    // 大小变化
    sizes[i] = size * (0.5 + Math.random() * 0.5)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
    transparent: transparent,
    opacity: opacity,
    blending: blending,
    depthWrite: depthWrite,        // 禁用深度写入，大幅提升性能
    sizeAttenuation: sizeAttenuation
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  return {
    mesh: points,
    geometry,
    material,
    count,

    /**
     * 更新粒子位置（高性能版本）
     */
    updatePositions(updateFn) {
      const positions = geometry.attributes.position.array
      let needsUpdate = false

      for (let i = 0; i < count; i++) {
        const idx = i * 3
        const result = updateFn(i, positions[idx], positions[idx + 1], positions[idx + 2])
        if (result) {
          positions[idx] = result.x
          positions[idx + 1] = result.y
          positions[idx + 2] = result.z
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        geometry.attributes.position.needsUpdate = true
      }
    },

    /**
     * 根据速度更新粒子位置（高性能版本）
     */
    updateByVelocity() {
      const positions = geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        const idx = i * 3
        positions[idx] += velocities[idx]
        positions[idx + 1] += velocities[idx + 1]
        positions[idx + 2] += velocities[idx + 2]
      }

      geometry.attributes.position.needsUpdate = true
    },

    /**
     * 设置粒子速度
     */
    setVelocity(index, vx, vy, vz) {
      velocities[index * 3] = vx
      velocities[index * 3 + 1] = vy
      velocities[index * 3 + 2] = vz
    },

    /**
     * 设置粒子颜色
     */
    setColor(index, r, g, b) {
      const colors = geometry.attributes.color.array
      colors[index * 3] = r
      colors[index * 3 + 1] = g
      colors[index * 3 + 2] = b
      geometry.attributes.color.needsUpdate = true
    },

    /**
     * 设置所有粒子的颜色
     */
    setAllColors(r, g, b) {
      const colors = geometry.attributes.color.array
      for (let i = 0; i < count; i++) {
        colors[i * 3] = r
        colors[i * 3 + 1] = g
        colors[i * 3 + 2] = b
      }
      geometry.attributes.color.needsUpdate = true
    },

    /**
     * 设置粒子大小
     */
    setSize(index, size) {
      const sizes = geometry.attributes.size.array
      sizes[index] = size
      geometry.attributes.size.needsUpdate = true
    },

    /**
     * 设置所有粒子大小
     */
    setAllSize(size) {
      const sizes = geometry.attributes.size.array
      for (let i = 0; i < count; i++) {
        sizes[i] = size
      }
      geometry.attributes.size.needsUpdate = true
    },

    /**
     * 设置不透明度
     */
    setOpacity(opacity) {
      material.opacity = opacity
    },

    /**
     * 设置可见性
     */
    setVisible(visible) {
      points.visible = visible
    },

    /**
     * 清理资源
     */
    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

/**
 * 创建发光粒子（多层叠加模拟发光效果）
 */
export function createGlowParticle(scene, position, color, options = {}) {
  const {
    coreSize = 8,
    glowSize = 24,
    coreOpacity = 1,
    glowOpacity = 0.3
  } = options

  const group = new THREE.Group()

  // 核心（亮）
  const coreGeometry = new THREE.BufferGeometry()
  coreGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3))
  const coreMaterial = new THREE.PointsMaterial({
    color: color,
    size: coreSize,
    transparent: true,
    opacity: coreOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const core = new THREE.Points(coreGeometry, coreMaterial)

  // 光晕（淡）
  const glowGeometry = new THREE.BufferGeometry()
  glowGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3))
  const glowMaterial = new THREE.PointsMaterial({
    color: color,
    size: glowSize,
    transparent: true,
    opacity: glowOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const glow = new THREE.Points(glowGeometry, glowMaterial)

  group.add(core, glow)
  group.position.copy(position)
  scene.add(group)

  return {
    group,
    core,
    glow,
    setColor: (newColor) => {
      coreMaterial.color.set(newColor)
      glowMaterial.color.set(newColor)
    },
    setOpacity: (coreOp, glowOp) => {
      coreMaterial.opacity = coreOp
      glowMaterial.opacity = glowOp
    },
    dispose: () => {
      scene.remove(group)
      coreGeometry.dispose()
      coreMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
    }
  }
}
