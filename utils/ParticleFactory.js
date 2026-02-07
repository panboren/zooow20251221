/**
 * 粒子工厂 - 统一粒子创建接口
 * 解决代码重复问题，提供统一的粒子创建方式
 */

import * as THREE from 'three'

export class ParticleFactory {
  /**
   * 创建粒子系统
   * @param {Object} options - 粒子配置
   * @param {Scene} scene - 场景对象
   * @returns {THREE.Points} 粒子系统
   */
  static create(options = {}) {
    const {
      type = 'points',          // points | instanced | stream
      count = 1000,            // 粒子数量
      shape = 'random',        // random | sphere | cube | spiral | ring
      colorMode = 'white',     // white | gradient | rainbow
      color1 = 0xffffff,       // 颜色1 (hex 或 string)
      color2 = 0xffffff,       // 颜色2
      size = 1,                // 粒子大小
      sizeRange = { min: 0.5, max: 1.5 },
      opacity = 1,
      transparent = true,
      blending = THREE.AdditiveBlending,
      depthWrite = false,
      vertexColors = false,
      range = 50               // 分布范围
    } = options

    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []

    // 生成位置
    for (let i = 0; i < count; i++) {
      const pos = this.generatePosition(shape, i, count, range)
      positions.push(pos.x, pos.y, pos.z)

      // 生成大小
      const sizeVariation = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min)
      sizes.push(size * sizeVariation)

      // 生成颜色
      const color = this.generateColor(colorMode, i, count, color1, color2)
      colors.push(color.r, color.g, color.b)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    // 创建材质
    const material = new THREE.PointsMaterial({
      size,
      color: vertexColors ? 0xffffff : new THREE.Color(color1),
      transparent,
      opacity,
      blending,
      depthWrite,
      vertexColors,
      sizeAttenuation: true
    })

    const particleSystem = new THREE.Points(geometry, material)

    return {
      particleSystem,
      geometry,
      material,
      positions: positions,
      colors: colors,
      sizes: sizes,
      dispose: () => {
        geometry.dispose()
        material.dispose()
      }
    }
  }

  /**
   * 生成位置
   */
  static generatePosition(shape, index, count, range) {
    const r = range
    switch (shape) {
      case 'sphere':
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = Math.random() * r
        return new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )

      case 'cube':
        return new THREE.Vector3(
          (Math.random() - 0.5) * 2 * r,
          (Math.random() - 0.5) * 2 * r,
          (Math.random() - 0.5) * 2 * r
        )

      case 'spiral':
        const angle = (index / count) * Math.PI * 8
        const spiralRadius = (index / count) * r
        return new THREE.Vector3(
          Math.cos(angle) * spiralRadius,
          (index / count) * r * 2 - r,
          Math.sin(angle) * spiralRadius
        )

      case 'ring':
        const ringAngle = (index / count) * Math.PI * 2
        const ringRadius = r * (0.5 + Math.random() * 0.5)
        return new THREE.Vector3(
          Math.cos(ringAngle) * ringRadius,
          (Math.random() - 0.5) * r * 0.2,
          Math.sin(ringAngle) * ringRadius
        )

      case 'random':
      default:
        return new THREE.Vector3(
          (Math.random() - 0.5) * 2 * r,
          (Math.random() - 0.5) * 2 * r,
          (Math.random() - 0.5) * 2 * r
        )
    }
  }

  /**
   * 生成颜色
   */
  static generateColor(mode, index, count, color1, color2) {
    const c1 = new THREE.Color(color1)
    const c2 = new THREE.Color(color2)

    switch (mode) {
      case 'gradient':
        const t = index / count
        return new THREE.Color().lerpColors(c1, c2, t)

      case 'rainbow':
        const hue = (index / count) * 360
        return new THREE.Color().setHSL(hue / 360, 0.8, 0.6)

      case 'white':
      default:
        return new THREE.Color(0xffffff)
    }
  }

  /**
   * 创建InstancedMesh粒子系统（适合大量相同粒子）
   */
  static createInstanced(options = {}) {
    const {
      count = 1000,
      geometry = new THREE.SphereGeometry(0.5, 8, 8),
      material = new THREE.MeshBasicMaterial({ color: 0xffffff }),
      shape = 'random',
      range = 50,
      scaleRange = { min: 0.5, max: 1.5 }
    } = options

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const pos = this.generatePosition(shape, i, count, range)
      const scale = scaleRange.min + Math.random() * (scaleRange.max - scaleRange.min)

      dummy.position.copy(pos)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()

      instancedMesh.setMatrixAt(i, dummy.matrix)

      // 彩虹色
      const hue = (i / count) * 360
      color.setHSL(hue / 360, 0.8, 0.6)
      instancedMesh.setColorAt(i, color)
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    instancedMesh.instanceColor.needsUpdate = true

    return {
      instancedMesh,
      geometry,
      material,
      dispose: () => {
        geometry.dispose()
        material.dispose()
      }
    }
  }

  /**
   * 创建流式粒子系统（适合连续流动效果）
   */
  static createStream(options = {}) {
    const {
      count = 1000,
      flowSpeed = 1,
      flowAxis = 'x',      // x | y | z
      shape = 'spiral',
      range = 50,
      color = 0x00ffff,
      size = 2
    } = options

    const particleSystem = this.create({
      count,
      shape,
      colorMode: 'white',
      color1: color,
      size,
      range
    })

    // 添加流式属性
    particleSystem.flowData = {
      speed: flowSpeed,
      axis: flowAxis,
      originalPositions: [...particleSystem.positions]
    }

    particleSystem.updateFlow = function(time) {
      const positions = this.geometry.attributes.position.array
      const original = this.originalPositions
      const speed = this.flowData.speed

      for (let i = 0; i < positions.length; i += 3) {
        const axisIndex = this.flowData.axis === 'x' ? 0 : this.flowData.axis === 'y' ? 1 : 2
        positions[i + axisIndex] = original[i + axisIndex] + Math.sin(time * speed + i * 0.01) * 5
      }

      this.geometry.attributes.position.needsUpdate = true
    }

    return particleSystem
  }
}
