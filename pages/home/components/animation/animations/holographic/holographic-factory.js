/**
 * 全息特效工厂
 * 快速创建各种全息效果
 */

import * as THREE from 'three'
import {
  HolographicMaterial,
  HolographicScanlineMaterial,
  HolographicParticleMaterial,
  HolographicGridMaterial,
  HolographicGlitchMaterial,
  HolographicBeamMaterial
} from './holographic-core.js'

/**
 * 创建全息几何体
 */
export function createHolographicMesh(geometry, options = {}) {
  const material = new HolographicMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.userData.isHolographic = true
  return mesh
}

/**
 * 创建全息扫描线平面
 */
export function createHolographicScanlines(size = 100, options = {}) {
  const geometry = new THREE.PlaneGeometry(size, size)
  const material = new HolographicScanlineMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)

  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -20
  mesh.userData.isHolographic = true

  return mesh
}

/**
 * 创建全息粒子系统
 */
export function createHolographicParticles(count = 1000, options = {}) {
  const {
    size = 2,
    color = 0x00ffff,
    radius = 50
  } = options

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  const baseColor = new THREE.Color(color)

  for (let i = 0; i < count; i++) {
    // 球体分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // 颜色变化
    const colorVar = 0.8 + Math.random() * 0.2
    colors[i * 3] = baseColor.r * colorVar
    colors[i * 3 + 1] = baseColor.g * colorVar
    colors[i * 3 + 2] = baseColor.b * colorVar

    // 大小变化
    sizes[i] = size * (0.5 + Math.random() * 1.5)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new HolographicParticleMaterial({
    color: color,
    size: size,
    opacity: 0.8
  })
  material.vertexColors = true

  const points = new THREE.Points(geometry, material)
  points.userData.isHolographic = true

  return points
}

/**
 * 创建全息网格
 */
export function createHolographicGrid(size = 100, divisions = 10, options = {}) {
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions)
  const material = new HolographicGridMaterial(options)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.userData.isHolographic = true

  return mesh
}

/**
 * 创建全息光束
 */
export function createHolographicBeam(length = 100, options = {}) {
  const geometry = new THREE.PlaneGeometry(2, length)
  const material = new HolographicBeamMaterial(options)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.userData.isHolographic = true

  return mesh
}

/**
 * 创建全息立方体
 */
export function createHolographicCube(size = 10, options = {}) {
  const geometry = new THREE.BoxGeometry(size, size, size)
  return createHolographicMesh(geometry, options)
}

/**
 * 创建全息球体
 */
export function createHolographicSphere(radius = 10, options = {}) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  return createHolographicMesh(geometry, options)
}

/**
 * 创建全息环形
 */
export function createHolographicTorus(innerRadius = 8, outerRadius = 12, options = {}) {
  const geometry = new THREE.TorusGeometry(10, 2, 16, 100)
  return createHolographicMesh(geometry, options)
}

/**
 * 创建全息锥体
 */
export function createHolographicCone(radius = 10, height = 20, options = {}) {
  const geometry = new THREE.ConeGeometry(radius, height, 32)
  return createHolographicMesh(geometry, options)
}

/**
 * 创建全息文本效果（使用粒子）
 */
export function createHolographicText(text, options = {}) {
  // 注意：这需要字体加载，简化版本返回粒子
  const particleCount = text.length * 100
  return createHolographicParticles(particleCount, {
    ...options,
    radius: 30
  })
}

/**
 * 创建全息数据流效果
 */
export function createHolographicDataStream(count = 2000, options = {}) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const streamColor = new THREE.Color(0x00ff00)

  for (let i = 0; i < count; i++) {
    // 垂直流动的数据流
    const x = (Math.random() - 0.5) * 80
    const y = (Math.random() - 0.5) * 100
    const z = (Math.random() - 0.5) * 80

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // 绿色数据流
    colors[i * 3] = streamColor.r
    colors[i * 3 + 1] = streamColor.g * (0.5 + Math.random() * 0.5)
    colors[i * 3 + 2] = streamColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new HolographicParticleMaterial({
    color: 0x00ff00,
    size: 1.5,
    opacity: 0.6
  })
  material.vertexColors = true

  const points = new THREE.Points(geometry, material)
  points.userData.isHolographic = true

  return points
}

/**
 * 创建全息故障效果
 */
export function createHolographicGlitch(mesh, options = {}) {
  const originalMaterial = mesh.material
  const glitchMaterial = new HolographicGlitchMaterial(options)

  mesh.userData.originalMaterial = originalMaterial
  mesh.userData.glitchMaterial = glitchMaterial

  return mesh
}

/**
 * 切换故障效果
 */
export function toggleHolographicGlitch(mesh, enable) {
  if (enable && mesh.userData.glitchMaterial) {
    mesh.material = mesh.userData.glitchMaterial
  } else if (mesh.userData.originalMaterial) {
    mesh.material = mesh.userData.originalMaterial
  }
}

/**
 * 创建全息环形阵列
 */
export function createHolographicRingArray(count = 8, radius = 20, options = {}) {
  const group = new THREE.Group()

  for (let i = 0; i < count; i++) {
    const ring = createHolographicTorus(2, 3, options)
    const angle = (i / count) * Math.PI * 2

    ring.position.x = Math.cos(angle) * radius
    ring.position.y = Math.sin(angle) * radius
    ring.rotation.z = angle

    group.add(ring)
  }

  group.userData.isHolographic = true
  return group
}

/**
 * 创建全息螺旋
 */
export function createHolographicSpiral(turns = 5, particlesPerTurn = 100, radius = 30, options = {}) {
  const count = turns * particlesPerTurn
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const baseColor = new THREE.Color(options.color || 0x00ffff)

  for (let i = 0; i < count; i++) {
    const t = i / count
    const angle = t * turns * Math.PI * 2
    const r = radius * t

    const x = Math.cos(angle) * r
    const y = (t - 0.5) * 60
    const z = Math.sin(angle) * r

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // 颜色渐变
    colors[i * 3] = baseColor.r * (0.5 + t * 0.5)
    colors[i * 3 + 1] = baseColor.g * (0.5 + t * 0.5)
    colors[i * 3 + 2] = baseColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new HolographicParticleMaterial({
    color: 0x00ffff,
    size: 2,
    opacity: 0.8
  })
  material.vertexColors = true

  const points = new THREE.Points(geometry, material)
  points.userData.isHolographic = true

  return points
}

/**
 * 创建全息球体阵列
 */
export function createHolographicSphereArray(rows = 5, cols = 5, layers = 5, spacing = 15, options = {}) {
  const group = new THREE.Group()

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      for (let z = 0; z < layers; z++) {
        const sphere = createHolographicSphere(2, options)

        sphere.position.x = (x - cols / 2 + 0.5) * spacing
        sphere.position.y = (y - rows / 2 + 0.5) * spacing
        sphere.position.z = (z - layers / 2 + 0.5) * spacing

        group.add(sphere)
      }
    }
  }

  group.userData.isHolographic = true
  return group
}

/**
 * 更新所有全息材质
 */
export function updateHolographicObjects(scene, time) {
  scene.traverse((object) => {
    if (object.userData.isHolographic && object.material.update) {
      object.material.update(time)
    }
  })
}

/**
 * 设置所有全息对象的故障效果
 */
export function setHolographicGlitchIntensity(scene, intensity) {
  scene.traverse((object) => {
    if (object.userData.isHolographic && object.material.uniforms?.uGlitchIntensity) {
      object.material.uniforms.uGlitchIntensity.value = intensity
    }
  })
}

/**
 * 设置所有全息对象的颜色
 */
export function setHolographicColor(scene, color) {
  const colorObj = new THREE.Color(color)

  scene.traverse((object) => {
    if (object.userData.isHolographic && object.material.uniforms?.uColor) {
      object.material.uniforms.uColor.value.set(colorObj)
    }
  })
}
