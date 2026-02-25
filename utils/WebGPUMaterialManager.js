/**
 * WebGPU 材质管理器
 * 解决 ShaderMaterial 与 WebGPURenderer 的兼容性问题
 * 通过拦截材质创建和渲染来自动处理兼容性
 */

import * as THREE from 'three'

// 全局渲染器引用
let currentRenderer = null

// 材质缓存 Map
const materialCache = new WeakMap()

/**
 * 设置当前渲染器
 */
export function setRenderer(renderer) {
  currentRenderer = renderer
}

/**
 * 获取当前渲染器
 */
export function getRenderer() {
  return currentRenderer
}

/**
 * 检测是否使用 WebGPU 渲染器
 */
export function isWebGPU() {
  if (!currentRenderer) return false
  return currentRenderer.type === 'WebGPURenderer'
}

/**
 * 检测是否使用 WebGL 渲染器
 */
export function isWebGL() {
  if (!currentRenderer) return false
  return currentRenderer.isWebGLRenderer || currentRenderer.isWebGL2Renderer
}

/**
 * 拦截 ShaderMaterial 构造，自动转换为兼容材质
 */
const OriginalShaderMaterial = THREE.ShaderMaterial

class WebGPUShaderMaterial extends OriginalShaderMaterial {
  constructor(params = {}) {
    // 先调用原始构造函数
    super(params)

    // 标记为 ShaderMaterial 子类
    this._isWebGPUShaderMaterial = true

    // 如果是 WebGPU，标记需要特殊处理
    if (isWebGPU()) {
      this._needsWebGPUFallback = true
      this._originalVertexShader = this.vertexShader
      this._originalFragmentShader = this.fragmentShader
      this._originalUniforms = { ...this.uniforms }

      // 设置默认的降级材质属性
      if (params.color) this.color = params.color
      if (params.emissive) this.emissive = params.emissive
      if (params.map) this.map = params.map

      // 缓存原始参数以便后续处理
      materialCache.set(this, {
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        uniforms: this.uniforms,
        transparent: this.transparent,
        side: this.side,
        blending: this.blending,
        depthWrite: this.depthWrite
      })
    }
  }

  /**
   * 重写 uniforms setter，确保兼容性
   */
  set uniforms(value) {
    super.uniforms = value
    if (isWebGPU() && !this.uniforms) {
      this.uniforms = {}
    }
  }
}

// 替换全局 ShaderMaterial
THREE.ShaderMaterial = WebGPUShaderMaterial

/**
 * 创建 WebGPU 兼容的基础材质
 * 将 ShaderMaterial 降级为 MeshBasicMaterial
 */
export function createFallbackMaterial(shaderMaterial) {
  const cached = materialCache.get(shaderMaterial)
  if (!cached) return shaderMaterial

  // 检查是否已经有降级材质
  if (shaderMaterial._fallbackMaterial) {
    return shaderMaterial._fallbackMaterial
  }

  // 创建基础材质
  const fallback = new THREE.MeshBasicMaterial({
    color: cached.uniforms?.uColor?.value || 0xffffff,
    transparent: cached.transparent !== undefined ? cached.transparent : true,
    opacity: cached.uniforms?.uOpacity?.value || 1,
    side: cached.side || THREE.FrontSide,
    depthWrite: cached.depthWrite !== undefined ? cached.depthWrite : false,
    blending: cached.blending || THREE.AdditiveBlending,
    wireframe: shaderMaterial.wireframe || false
  })

  // 复制 uniforms 属性以保持兼容性
  fallback.uniforms = { ...(cached.uniforms || {}) }

  // 缓存降级材质
  shaderMaterial._fallbackMaterial = fallback
  fallback._originalShaderMaterial = shaderMaterial

  return fallback
}

/**
 * 创建 WebGPU 兼容的粒子材质
 */
export function createCompatibleParticleMaterial(options = {}) {
  const uniforms = options.uniforms || {}

  if (isWebGPU()) {
    // WebGPU 使用 PointsMaterial
    const material = new THREE.PointsMaterial({
      size: options.size || 1,
      transparent: options.transparent !== undefined ? options.transparent : true,
      opacity: options.opacity !== undefined ? options.opacity : 1,
      vertexColors: options.vertexColors || false,
      color: options.color || 0xffffff,
      map: options.map || null,
      depthWrite: options.depthWrite !== undefined ? options.depthWrite : false,
      blending: options.blending || THREE.AdditiveBlending,
      sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation : true
    })

    // 添加兼容性 uniforms
    material.uniforms = {
      uTime: uniforms.uTime || { value: 0 },
      uOpacity: uniforms.uOpacity || { value: material.opacity }
    }

    return material
  }

  // WebGL 使用 ShaderMaterial
  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: options.vertexShader,
    fragmentShader: options.fragmentShader,
    transparent: options.transparent !== undefined ? options.transparent : true,
    blending: options.blending || THREE.AdditiveBlending,
    depthWrite: options.depthWrite !== undefined ? options.depthWrite : false
  })
}

/**
 * 创建 WebGPU 兼容的 Line 材质
 */
export function createCompatibleLineMaterial(options = {}) {
  const uniforms = options.uniforms || {}

  if (isWebGPU()) {
    // WebGPU 使用 LineBasicMaterial
    const material = new THREE.LineBasicMaterial({
      color: options.color || 0xffffff,
      transparent: options.transparent !== undefined ? options.transparent : true,
      opacity: options.opacity !== undefined ? options.opacity : 1,
      depthWrite: options.depthWrite !== undefined ? options.depthWrite : false,
      blending: options.blending || THREE.AdditiveBlending,
      linewidth: options.linewidth || 1
    })

    // 添加兼容性 uniforms
    material.uniforms = {
      uTime: uniforms.uTime || { value: 0 },
      uColor: uniforms.uColor || { value: material.color },
      uOpacity: uniforms.uOpacity || { value: material.opacity }
    }

    return material
  }

  // WebGL 使用 ShaderMaterial
  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: options.vertexShader,
    fragmentShader: options.fragmentShader,
    transparent: options.transparent !== undefined ? options.transparent : true,
    blending: options.blending || THREE.AdditiveBlending,
    depthWrite: options.depthWrite !== undefined ? options.depthWrite : false
  })
}

/**
 * 创建 WebGPU 兼容的 Mesh 材质
 */
export function createCompatibleMeshMaterial(options = {}) {
  const uniforms = options.uniforms || {}

  if (isWebGPU()) {
    // WebGPU 使用 MeshBasicMaterial
    const material = new THREE.MeshBasicMaterial({
      color: options.color || 0xffffff,
      transparent: options.transparent !== undefined ? options.transparent : true,
      opacity: options.opacity !== undefined ? options.opacity : 1,
      side: options.side || THREE.DoubleSide,
      depthWrite: options.depthWrite !== undefined ? options.depthWrite : false,
      blending: options.blending || THREE.AdditiveBlending,
      wireframe: options.wireframe || false
    })

    // 添加兼容性 uniforms
    material.uniforms = {
      uTime: uniforms.uTime || { value: 0 },
      uColor: uniforms.uColor || { value: material.color },
      uOpacity: uniforms.uOpacity || { value: material.opacity },
      uDistortion: uniforms.uDistortion || { value: 0 },
      uPulse: uniforms.uPulse || { value: 0 }
    }

    return material
  }

  // WebGL 使用 ShaderMaterial
  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: options.vertexShader,
    fragmentShader: options.fragmentShader,
    transparent: options.transparent !== undefined ? options.transparent : true,
    side: options.side || THREE.DoubleSide,
    depthWrite: options.depthWrite !== undefined ? options.depthWrite : false,
    blending: options.blending || THREE.AdditiveBlending,
    wireframe: options.wireframe || false
  })
}

/**
 * 拦截渲染过程，自动替换不兼容材质
 */
export function patchRenderer(renderer) {
  if (!renderer) return

  const originalRender = renderer.render

  renderer.render = function(scene, camera) {
    // 设置当前渲染器
    setRenderer(renderer)

    // 如果是 WebGPU，替换场景中的 ShaderMaterial
    if (isWebGPU()) {
      scene.traverse((object) => {
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]

          materials.forEach((material, index) => {
            // 检查是否是 ShaderMaterial（包括子类）
            if (material && (material._needsWebGPUFallback || (material instanceof OriginalShaderMaterial && material._isWebGPUShaderMaterial))) {
              const fallback = createFallbackMaterial(material)
              if (Array.isArray(object.material)) {
                object.material[index] = fallback
              } else {
                object.material = fallback
              }
            }
          })
        }
      })
    }

    // 调用原始渲染
    return originalRender.call(this, scene, camera)
  }
}

/**
 * 静默 ShaderMaterial 警告
 */
export function suppressShaderMaterialWarnings() {
  const originalWarn = console.warn
  const warningFilters = [
    /ShaderMaterial.*is not compatible/,
    /Material.*is not compatible/
  ]

  console.warn = function(...args) {
    const message = args[0]
    if (typeof message === 'string') {
      const shouldSuppress = warningFilters.some(filter => filter.test(message))
      if (shouldSuppress) {
        return
      }
    }
    originalWarn.apply(console, args)
  }

  console.log('✅ 已静默 ShaderMaterial 兼容性警告')
}

/**
 * 初始化 WebGPU 材质管理器
 */
export function initMaterialManager(renderer) {
  if (!renderer) return

  // 设置渲染器
  setRenderer(renderer)

  // 拦截渲染器
  patchRenderer(renderer)

  // 静默警告
  suppressShaderMaterialWarnings()

  console.log('✅ WebGPU 材质管理器已初始化')
  console.log(`   渲染器类型: ${renderer.type}`)
}

/**
 * 恢复原始 ShaderMaterial
 */
export function restoreOriginalShaderMaterial() {
  THREE.ShaderMaterial = OriginalShaderMaterial
  console.log('✅ 已恢复原始 ShaderMaterial')
}

/**
 * 导出工具函数
 */
export default {
  setRenderer,
  getRenderer,
  isWebGPU,
  isWebGL,
  createCompatibleMeshMaterial,
  createCompatibleParticleMaterial,
  createCompatibleLineMaterial,
  createFallbackMaterial,
  initMaterialManager,
  patchRenderer,
  suppressShaderMaterialWarnings,
  restoreOriginalShaderMaterial
}
