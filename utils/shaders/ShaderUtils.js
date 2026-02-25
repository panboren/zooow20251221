/**
 * Shader工具函数库
 * 提供常用的Shader辅助函数和工具
 */

/**
 * 创建ShaderMaterial
 * @param {Object} options - 材质配置
 * @returns {THREE.ShaderMaterial} Shader材质对象
 */
export function createShaderMaterial(options = {}) {
  const {
    vertexShader = '',
    fragmentShader = '',
    uniforms = {},
    defines = {},
    ...rest
  } = options

  return {
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(1, 1, 1) },
      uOpacity: { value: 1.0 },
      uScale: { value: 1.0 },
      ...uniforms
    },
    defines,
    ...rest
  }
}

/**
 * 更新Shader uniform
 * @param {THREE.ShaderMaterial} material - Shader材质
 * @param {string} name - uniform名称
 * @param {*} value - uniform值
 */
export function updateUniform(material, name, value) {
  if (material && material.uniforms && material.uniforms[name]) {
    material.uniforms[name].value = value
  }
}

/**
 * 批量更新Shader uniforms
 * @param {THREE.ShaderMaterial} material - Shader材质
 * @param {Object} uniforms - uniforms对象
 */
export function updateUniforms(material, uniforms) {
  if (!material || !material.uniforms) return

  Object.entries(uniforms).forEach(([name, value]) => {
    updateUniform(material, name, value)
  })
}

/**
 * 编译Shader
 * @param {string} vertexShader - 顶点Shader
 * @param {string} fragmentShader - 片段Shader
 * @returns {Object} 编译结果 {success, error}
 */
export function compileShader(vertexShader, fragmentShader) {
  try {
    const testMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader
    })

    const gl = new THREE.WebGLRenderer().getContext()

    if (!gl) {
      return { success: false, error: 'WebGL not available' }
    }

    const program = gl.createProgram()
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vs, vertexShader)
    gl.compileShader(vs)

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      return {
        success: false,
        error: `Vertex shader error: ${gl.getShaderInfoLog(vs)}`
      }
    }

    gl.shaderSource(fs, fragmentShader)
    gl.compileShader(fs)

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      return {
        success: false,
        error: `Fragment shader error: ${gl.getShaderInfoLog(fs)}`
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 创建噪声uniform配置
 * @param {Object} config - 噪声配置
 * @returns {Object} uniforms对象
 */
export function createNoiseUniforms(config = {}) {
  const {
    time = 0,
    scale = 1.0,
    octaves = 4,
    persistence = 0.5,
    lacunarity = 2.0,
    seed = 0.0
  } = config

  return {
    uTime: { value: time },
    uScale: { value: scale },
    uOctaves: { value: octaves },
    uPersistence: { value: persistence },
    uLacunarity: { value: lacunarity },
    uSeed: { value: seed }
  }
}

/**
 * 创建全息特效uniform配置
 * @param {Object} config - 全息配置
 * @returns {Object} uniforms对象
 */
export function createHolographicUniforms(config = {}) {
  const {
    time = 0,
    color = new THREE.Color(0.5, 0.8, 1.0),
    opacity = 1.0,
    glowIntensity = 1.0,
    pulseSpeed = 2.0,
    scanSpeed = 1.0,
    glitchIntensity = 0.0
  } = config

  return {
    uTime: { value: time },
    uColor: { value: color },
    uOpacity: { value: opacity },
    uGlowIntensity: { value: glowIntensity },
    uPulse: { value: pulseSpeed },
    uScanSpeed: { value: scanSpeed },
    uGlitchIntensity: { value: glitchIntensity }
  }
}

/**
 * Shader预处理器
 * 替换模板变量
 * @param {string} shader - Shader代码
 * @param {Object} variables - 变量映射
 * @returns {string} 处理后的Shader代码
 */
export function preprocessShader(shader, variables = {}) {
  let processed = shader

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'g')
    processed = processed.replace(regex, value)
  })

  return processed
}

/**
 * 优化Shader代码
 * 移除注释、空行，压缩代码
 * @param {string} shader - Shader代码
 * @returns {string} 优化后的代码
 */
export function optimizeShader(shader) {
  return shader
    // 移除单行注释
    .replace(/\/\/.*$/gm, '')
    // 移除多行注释
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // 移除空行
    .replace(/^\s*[\r\n]/gm, '')
    // 移除多余空格
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 获取Shader信息
 * @param {string} shader - Shader代码
 * @returns {Object} Shader统计信息
 */
export function getShaderInfo(shader) {
  const lines = shader.split('\n').filter(line => line.trim())

  return {
    lineCount: lines.length,
    charCount: shader.length,
    hasUniforms: /uniform\s+/.test(shader),
    hasAttributes: /attribute\s+/.test(shader),
    hasVaryings: /varying\s+/.test(shader),
    hasMain: /void\s+main\(\)/.test(shader)
  }
}

/**
 * 默认导出
 */
export default {
  createShaderMaterial,
  updateUniform,
  updateUniforms,
  compileShader,
  createNoiseUniforms,
  createHolographicUniforms,
  preprocessShader,
  optimizeShader,
  getShaderInfo
}
