/**
 * WebGPU 材质兼容性修复工具
 * 修复 ShaderMaterial 与 NodeMaterial 的兼容性问题
 */

import * as THREE from 'three'

/**
 * 检测当前渲染器类型
 */
export function getRendererType(renderer) {
  if (!renderer) return 'unknown'
  if (renderer.backend && renderer.backend.device) return 'webgpu'
  if (renderer.isWebGLRenderer || renderer.isWebGL2Renderer) return 'webgl'
  return 'unknown'
}

/**
 * 检查材质是否兼容 WebGPU
 */
export function isMaterialCompatible(material) {
  // 基础材质通常兼容
  if (
    material instanceof THREE.MeshBasicMaterial ||
    material instanceof THREE.MeshStandardMaterial ||
    material instanceof THREE.MeshPhongMaterial ||
    material instanceof THREE.MeshLambertMaterial
  ) {
    return true
  }

  // ShaderMaterial 在 WebGPU 下需要特殊处理
  if (material instanceof THREE.ShaderMaterial) {
    return false // 不直接兼容，需要转换
  }

  // NodeMaterial 完全兼容 WebGPU
  if (material.type === 'NodeMaterial') {
    return true
  }

  return false
}

/**
 * 将 ShaderMaterial 转换为兼容的材质
 * 如果在 WebGPU 下，返回降级的基础材质
 */
export function createCompatibleMaterial(originalMaterial, renderer) {
  const rendererType = getRendererType(renderer)

  // WebGL 下可以直接使用 ShaderMaterial
  if (rendererType === 'webgl') {
    return originalMaterial
  }

  // WebGPU 下需要降级处理
  if (rendererType === 'webgpu' && originalMaterial instanceof THREE.ShaderMaterial) {
    console.warn('⚠️ ShaderMaterial 在 WebGPU 下不支持，使用基础材质替代')

    // 创建基础材质，尽量保留原材质的属性
    const compatibleMaterial = new THREE.MeshBasicMaterial({
      color: originalMaterial.color || 0xffffff,
      transparent: originalMaterial.transparent || false,
      opacity: originalMaterial.opacity !== undefined ? originalMaterial.opacity : 1.0,
      side: originalMaterial.side || THREE.FrontSide,
      depthTest: originalMaterial.depthTest !== undefined ? originalMaterial.depthTest : true,
      depthWrite: originalMaterial.depthWrite !== undefined ? originalMaterial.depthWrite : true,
      blending: originalMaterial.blending || THREE.NormalBlending,
      wireframe: originalMaterial.wireframe || false
    })

    return compatibleMaterial
  }

  return originalMaterial
}

/**
 * 自动修复场景中的不兼容材质
 */
export function fixSceneMaterials(scene, renderer) {
  const rendererType = getRendererType(renderer)

  // WebGL 下不需要修复
  if (rendererType !== 'webgpu') {
    return
  }

  console.log('🔧 检查场景材质兼容性...')

  let fixedCount = 0

  scene.traverse((object) => {
    if (object.isMesh && object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material]

      materials.forEach((material, index) => {
        if (!isMaterialCompatible(material)) {
          console.warn(`发现不兼容材质: ${material.type} (对象: ${object.uuid})`)

          const compatibleMaterial = createCompatibleMaterial(material, renderer)

          if (Array.isArray(object.material)) {
            object.material[index] = compatibleMaterial
          } else {
            object.material = compatibleMaterial
          }

          fixedCount++
        }
      })
    }
  })

  if (fixedCount > 0) {
    console.log(`✅ 已修复 ${fixedCount} 个不兼容材质`)
  } else {
    console.log('✅ 所有材质均兼容 WebGPU')
  }
}

/**
 * 创建 WebGPU 兼容的粒子材质
 */
export function createCompatibleParticleMaterial(options = {}) {
  const renderer = window.renderer // 从全局获取渲染器
  const rendererType = getRendererType(renderer)

  // WebGPU 下使用基础材质
  if (rendererType === 'webgpu') {
    return new THREE.PointsMaterial({
      color: options.color || 0xffffff,
      size: options.size || 1,
      transparent: options.transparent !== undefined ? options.transparent : true,
      opacity: options.opacity !== undefined ? options.opacity : 1,
      blending: options.blending || THREE.AdditiveBlending,
      depthWrite: options.depthWrite !== undefined ? options.depthWrite : false,
      sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation : true
    })
  }

  // WebGL 下可以使用 ShaderMaterial
  if (options.vertexShader || options.fragmentShader) {
    return new THREE.ShaderMaterial({
      uniforms: options.uniforms || {},
      vertexShader: options.vertexShader || `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: options.fragmentShader || `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(color, 1.0);
          gl_FragColor.a = 0.5;
        }
      `,
      transparent: options.transparent !== undefined ? options.transparent : true,
      blending: options.blending || THREE.AdditiveBlending,
      depthWrite: options.depthWrite !== undefined ? options.depthWrite : false
    })
  }

  // 默认使用基础材质
  return new THREE.PointsMaterial({
    color: options.color || 0xffffff,
    size: options.size || 1,
    transparent: true,
    opacity: options.opacity !== undefined ? options.opacity : 1
  })
}

/**
 * 批量修复材质
 */
export function batchFixMaterials(materials, renderer) {
  return materials.map(material => createCompatibleMaterial(material, renderer))
}

/**
 * 全局材质修复器
 */
export class GlobalMaterialFixer {
  constructor() {
    this.fixEnabled = true
    this.fixedMaterials = new Map()
  }

  /**
   * 启用修复
   */
  enable() {
    this.fixEnabled = true
  }

  /**
   * 禁用修复
   */
  disable() {
    this.fixEnabled = false
  }

  /**
   * 检查并修复材质
   */
  checkAndFix(material, renderer) {
    if (!this.fixEnabled) {
      return material
    }

    if (!isMaterialCompatible(material)) {
      const fixed = createCompatibleMaterial(material, renderer)
      this.fixedMaterials.set(material.uuid, {
        original: material,
        fixed: fixed
      })
      return fixed
    }

    return material
  }

  /**
   * 获取修复统计
   */
  getStats() {
    return {
      totalFixed: this.fixedMaterials.size,
      fixedMaterials: Array.from(this.fixedMaterials.keys())
    }
  }

  /**
   * 清理统计
   */
  clearStats() {
    this.fixedMaterials.clear()
  }
}

// 全局单例
const globalFixer = new GlobalMaterialFixer()

export { globalFixer }

/**
 * 快捷修复函数
 */
export function fixMaterial(material, renderer) {
  return globalFixer.checkAndFix(material, renderer)
}

/**
 * 静默 ShaderMaterial 警告
 */
export function suppressShaderMaterialWarnings() {
  const originalWarn = console.warn
  const warningFilter = /ShaderMaterial.*is not compatible/

  console.warn = function(...args) {
    const message = args[0]
    if (typeof message === 'string' && warningFilter.test(message)) {
      // 静默过滤 ShaderMaterial 兼容性警告
      return
    }
    originalWarn.apply(console, args)
  }

  console.log('✅ 已静默 ShaderMaterial 兼容性警告')
}
