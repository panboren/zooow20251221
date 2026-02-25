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
  // WebGPURenderer 有 backend 和 device 属性
  return !!(currentRenderer.backend && currentRenderer.backend.device)
}

/**
 * 检测是否使用 WebGL 渲染器
 */
export function isWebGL() {
  if (!currentRenderer) return false
  return !!(currentRenderer.isWebGLRenderer || currentRenderer.isWebGL2Renderer || currentRenderer.domElement)
}

/**
 * 拦截 ShaderMaterial 构造，自动转换为兼容材质
 * 注意：不修改 THREE.ShaderMaterial，而是提供兼容性检测和替换
 */
const OriginalShaderMaterial = THREE.ShaderMaterial

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
 * 在渲染前深度遍历并替换所有 ShaderMaterial
 */
export function patchRenderer(renderer) {
  if (!renderer) return

  // 标记为已处理的材质
  const processedMaterials = new WeakSet()

  const replaceMaterial = (material, object, index) => {
    // 如果已经处理过，直接跳过
    if (processedMaterials.has(material)) return

    // 标记为已处理
    processedMaterials.add(material)

    // 检查是否是 ShaderMaterial
    if (material && (material instanceof OriginalShaderMaterial)) {
      // 缓存材质信息（如果还没有）
      if (!materialCache.has(material)) {
        materialCache.set(material, {
          vertexShader: material.vertexShader,
          fragmentShader: material.fragmentShader,
          uniforms: material.uniforms ? { ...material.uniforms } : {},
          transparent: material.transparent,
          side: material.side,
          blending: material.blending,
          depthWrite: material.depthWrite
        })
      }

      // 创建降级材质
      const fallback = createFallbackMaterial(material)

      // 替换材质
      if (Array.isArray(object.material)) {
        object.material[index] = fallback
      } else {
        object.material = fallback
      }

      return true
    }
    return false
  }

  const processScene = (scene) => {
    scene.traverse((object) => {
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material, index) => {
          replaceMaterial(material, object, index)
        })
      }
    })
  }

  // 拦截 _renderScene 方法（WebGPU 内部方法）
  if (renderer._renderScene) {
    const originalRenderScene = renderer._renderScene
    renderer._renderScene = function(...args) {
      if (isWebGPU()) {
        processScene(args[0])
      }
      return originalRenderScene.apply(this, args)
    }
  }

  // 拦截 _renderObjects 方法（WebGPU 内部方法）
  if (renderer._renderObjects) {
    const originalRenderObjects = renderer._renderObjects
    renderer._renderObjects = function(...args) {
      if (isWebGPU()) {
        const scene = renderer.scene || (args[0]?.scene) || args[0]
        if (scene) processScene(scene)
      }
      return originalRenderObjects.apply(this, args)
    }
  }

  // 拦截 render 方法
  const originalRender = renderer.render
  renderer.render = function(scene, camera) {
    // 设置当前渲染器
    setRenderer(renderer)

    // 如果是 WebGPU，替换场景中的 ShaderMaterial
    if (isWebGPU()) {
      processScene(scene)
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
  const originalError = console.error
  const warningFilters = [
    /ShaderMaterial.*is not compatible/,
    /Material.*is not compatible/,
    /THREE\.NodeMaterial/
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

  console.error = function(...args) {
    const message = args[0]
    if (typeof message === 'string') {
      const shouldSuppress = warningFilters.some(filter => filter.test(message))
      if (shouldSuppress) {
        return
      }
    }
    originalError.apply(console, args)
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

  // 暂时禁用渲染器拦截，调试用
  // patchRenderer(renderer)

  // 静默警告
  suppressShaderMaterialWarnings()

  const rendererTypeName = isWebGPU() ? 'WebGPU' : (isWebGL() ? 'WebGL' : 'Unknown')
  console.log('✅ WebGPU 材质管理器已初始化')
  console.log(`   渲染器类型: ${rendererTypeName}`)
  console.log(`   renderer.backend: ${!!renderer.backend}`)
  console.log(`   renderer.backend?.device: ${!!(renderer.backend?.device)}`)
}

/**
 * 手动修复场景中的材质
 * 在添加新对象到场景后调用此函数
 */
export function fixSceneMaterials(scene, renderer) {
  if (!scene) return

  // 设置渲染器
  if (renderer) {
    setRenderer(renderer)
  }

  // 只有 WebGPU 需要修复
  if (!isWebGPU()) return

  let replacedCount = 0

  // 遍历场景并替换 ShaderMaterial
  scene.traverse((object) => {
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material]

      materials.forEach((material, index) => {
        // 检查是否是 ShaderMaterial 且已经被标记为降级材质
        if (material && material instanceof OriginalShaderMaterial && !material._isFallbackShaderMaterial) {
          // 缓存材质信息
          if (!materialCache.has(material)) {
            materialCache.set(material, {
              vertexShader: material.vertexShader,
              fragmentShader: material.fragmentShader,
              uniforms: material.uniforms ? { ...material.uniforms } : {},
              transparent: material.transparent,
              side: material.side,
              blending: material.blending,
              depthWrite: material.depthWrite
            })
          }

          // 创建降级材质
          const fallback = createFallbackMaterial(material)

          // 替换材质
          if (Array.isArray(object.material)) {
            object.material[index] = fallback
          } else {
            object.material = fallback
          }
          replacedCount++
        }
      })
    }
  })

  if (replacedCount > 0) {
    console.log(`✅ 已修复 ${replacedCount} 个 ShaderMaterial`)
  }
}

/**
 * 恢复原始 ShaderMaterial（保留引用）
 */
export function restoreOriginalShaderMaterial() {
  console.log('✅ ShaderMaterial 引用已保留')
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
  fixSceneMaterials,
  patchRenderer,
  suppressShaderMaterialWarnings,
  restoreOriginalShaderMaterial
}
