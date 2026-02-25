/**
 * 全息特效Shader库
 * 专门用于全息、故障、扫描线等效果
 */

export const HOLOGRAPHIC_SHADERS = {
  /**
   * 全息发光Shader
   * 用于创建发光的粒子效果
   */
  holographicGlow: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uPulse;
      uniform float uGlowIntensity;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vPulse;

      void main() {
        vColor = color;
        vPosition = position;
        vPulse = sin(uTime * 2.0 + position.y * 0.5) * uPulse;

        vec3 pos = position;
        pos += normal * vPulse * 0.2;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (1.0 + vPulse * uGlowIntensity);
      }
    `,
    fragment: `
      precision highp float;

      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGlowIntensity;

      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vPulse;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);

        vec3 glow = vColor * uGlowIntensity;
        vec3 finalColor = vColor * uColor + glow * vPulse;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  },

  /**
   * 故障效果Shader
   * 用于创建数字故障效果
   */
  glitchEffect: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uGlitchIntensity;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        vColor = color;
        vUv = gl_PointCoord;

        vec3 pos = position;
        float glitch = step(0.95, sin(uTime * 10.0 + position.x * 5.0));
        pos.x += glitch * uGlitchIntensity;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size;
      }
    `,
    fragment: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uGlitchIntensity;

      varying vec3 vColor;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;

        // RGB分离效果
        float split = step(uGlitchIntensity, random(uv + uTime * 0.1));
        float r = texture2D(uv + vec2(split * 0.02, 0.0)).r;
        float g = texture2D(uv + vec2(0.0, 0.0)).g;
        float b = texture2D(uv - vec2(split * 0.02, 0.0)).b;

        vec3 finalColor = vec3(r, g, b) * vColor;

        float alpha = smoothstep(0.5, 0.0, length(uv - 0.5)) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  },

  /**
   * 扫描线Shader
   * 用于创建扫描线效果
   */
  scanline: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uScanSpeed;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        vColor = color;
        vUv = gl_PointCoord;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size;
      }
    `,
    fragment: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uScanSpeed;

      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        float scanline = sin(vUv.y * 100.0 + uTime * uScanSpeed) * 0.5 + 0.5;

        vec3 finalColor = vColor * (1.0 + scanline * 0.3);

        float alpha = smoothstep(0.5, 0.0, length(vUv - 0.5)) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  },

  /**
   * 体积云Shader
   * 用于创建体积云效果
   */
  volumetricCloud: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uDensity;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vDensity;

      void main() {
        vColor = color;
        vPosition = position;
        vDensity = uDensity;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size;
      }
    `,
    fragment: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vDensity;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);

        // 创建体积感
        float noise = fract(sin(dot(vPosition, vec3(12.9898, 78.233, 45.164)) * 43758.5453);
        float density = smoothstep(0.0, 1.0, 1.0 - dist) * vDensity;

        vec3 finalColor = vColor * (1.0 + density * 0.5);

        float alpha = density * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  },

  /**
   * 能量波Shader
   * 用于创建能量波效果
   */
  energyWave: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uWaveFrequency;
      uniform float uWaveAmplitude;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vWave;

      void main() {
        vColor = color;
        vPosition = position;

        float wave = sin(position.y * uWaveFrequency + uTime * 2.0) * uWaveAmplitude;
        vWave = wave;

        vec3 pos = position;
        pos.x += wave;
        pos.z += wave * 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (1.0 + wave * 0.2);
      }
    `,
    fragment: `
      precision highp float;

      uniform float uOpacity;
      uniform float uWaveIntensity;

      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vWave;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);

        vec3 waveColor = vec3(0.0, 1.0, 1.0) * abs(vWave) * uWaveIntensity;
        vec3 finalColor = vColor + waveColor;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  },

  /**
   * 矩阵数字雨Shader
   * 用于创建数字雨效果
   */
  matrixRain: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uFallSpeed;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        vColor = color;
        vUv = gl_PointCoord;

        vec3 pos = position;
        pos.y = mod(pos.y - uTime * uFallSpeed, 100.0) - 50.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size;
      }
    `,
    fragment: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uCharacterDensity;

      varying vec3 vColor;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        float dist = length(uv - 0.5);

        // 字符效果
        float charIndex = floor(random(uv + uTime * 0.5) * uCharacterDensity * 16.0);
        float charY = floor(charIndex / 4.0) * 0.25;
        float charX = mod(charIndex, 4.0) * 0.25;

        vec3 finalColor = vColor;

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  },

  /**
   * 神经网络Shader
   * 用于创建神经网络连接效果
   */
  neuralNetwork: {
    vertex: `
      precision highp float;

      uniform float uTime;
      uniform float uConnectionOpacity;

      attribute vec3 color;
      attribute float size;

      varying vec3 vColor;
      varying vec3 vPosition;

      void main() {
        vColor = color;
        vPosition = position;

        float pulse = sin(uTime * 3.0 + position.z) * 0.5 + 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (1.0 + pulse * 0.5);
      }
    `,
    fragment: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uConnectionOpacity;

      varying vec3 vColor;
      varying vec3 vPosition;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);

        // 连接线效果
        float connection = sin(uv.x * 20.0 + uTime * 2.0) *
                         sin(uv.y * 20.0 + uTime * 2.0) *
                         uConnectionOpacity;

        vec3 finalColor = vColor * (1.0 + connection);

        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  }
}

/**
 * 获取全息Shader
 * @param {string} type - Shader类型
 * @returns {object} Shader对象 {vertex, fragment}
 */
export function getHolographicShader(type) {
  return HOLOGRAPHIC_SHADERS[type]
}

/**
 * 获取所有全息Shader类型
 * @returns {string[]} 类型数组
 */
export function getHolographicShaderTypes() {
  return Object.keys(HOLOGRAPHIC_SHADERS)
}

/**
 * 默认导出
 */
export default {
  HOLOGRAPHIC_SHADERS,
  getHolographicShader,
  getHolographicShaderTypes
}
