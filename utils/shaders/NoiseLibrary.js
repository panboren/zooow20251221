/**
 * 统一Shader噪声库
 * 消除重复的Shader代码，提供统一的噪声算法
 */

export const NOISE_SHADERS = {
  /**
   * Simplex 3D Noise
   * 经典的Simplex噪声算法，用于生成平滑的随机效果
   */
  simplexNoise3D: `
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise3D(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - 0.5 + C.zzz;

      i = mod289(i);
      vec4 p = permute(permute(i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x +
                 vec4(0.0, i1.x, i2.x, 1.0)) + i.z +
                 vec4(0.0, i1.z, i2.z, 1.0));

      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1),
                                     dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;

      return 42.0 * dot(m * m,
                            vec4(dot(p[0], x0), dot(p[1], x1),
                                 dot(p[2], x2), dot(p[3], x3)));
    }
  `,

  /**
   * Perlin 3D Noise
   * 经典的Perlin噪声算法
   */
  perlinNoise3D: `
    float fade(float t) {
      return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    float lerp(float t, float a, float b) {
      return a + t * (b - a);
    }

    float grad(int hash, vec3 p) {
      int h = hash & 15;
      float u = h < 8 ? p.x : p.y;
      float v = h < 4 ? p.y : h == 12 || h == 14 ? p.x : p.z;
      return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }

    float perlin3D(vec3 p) {
      vec3 P0 = floor(p);
      vec3 Pf0 = fract(p);

      vec3 Pf1 = Pf0 - vec3(1.0, 0.0, 0.0);
      vec3 Pf2 = Pf0 - vec3(0.0, 1.0, 0.0);
      vec3 Pf3 = Pf0 - vec3(0.0, 0.0, 1.0);

      int ix = int(P0.x) & 255;
      int iy = int(P0.y) & 255;
      int iz = int(P0.z) & 255;

      float n000 = grad(int(PERM[ix + PERM[iy + PERM[iz]]), Pf0);
      float n001 = grad(int(PERM[ix + PERM[iy + PERM[iz + 1]]), vec3(Pf0.x, Pf0.y, Pf3.z));
      float n010 = grad(int(PERM[ix + PERM[iy + 1 + PERM[iz]]), vec3(Pf0.x, Pf2.y, Pf0.z));
      float n011 = grad(int(PERM[ix + PERM[iy + 1 + PERM[iz + 1]]), vec3(Pf0.x, Pf2.y, Pf3.z));
      float n100 = grad(int(PERM[ix + 1 + PERM[iy + PERM[iz]]), vec3(Pf1.x, Pf0.y, Pf0.z));
      float n101 = grad(int(PERM[ix + 1 + PERM[iy + PERM[iz + 1]]), vec3(Pf1.x, Pf0.y, Pf3.z));
      float n110 = grad(int(PERM[ix + 1 + PERM[iy + 1 + PERM[iz]]), vec3(Pf1.x, Pf2.y, Pf0.z));
      float n111 = grad(int(PERM[ix + 1 + PERM[iy + 1 + PERM[iz + 1]]), vec3(Pf1.x, Pf2.y, Pf3.z));

      vec3 fade_xyz = fade(Pf0);
      vec4 n_x = mix(vec4(n000, n100, fade_xyz.x),
                     vec4(n001, n101, fade_xyz.x));
      vec4 n_xy = mix(n_x.xy, n_x.zw, fade_xyz.y);
      vec4 n_xy_z = mix(vec4(n010, n110, fade_xyz.x),
                        vec4(n011, n111, fade_xyz.x));
      float n_xyz = mix(n_xy.xy, n_xy_z.xy, fade_xyz.y);
      float n_xyzw = mix(n_xy.zw, n_xy_z.zw, fade_xyz.y);
      float n_yz = mix(n_xyz, n_xyzw, fade_xyz.z);

      return n_yz * 0.5 + 0.5;
    }
  `,

  /**
   * Fractal Brownian Motion (FBM)
   * 分形布朗运动，用于生成自然纹理
   */
  fbm3D: `
    #define OCTAVES 6

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;

      for(int i = 0; i < OCTAVES; i++) {
        value += amplitude * snoise3D(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
  `,

  /**
   * Domain Warped FBM
   * 域扭曲FBM，用于生成更复杂的纹理
   */
  domainWarpFbm: `
    vec2 domainWarp(vec2 p) {
      vec2 q = vec2(
        fbm(p + vec2(0.0, 0.0)),
        fbm(p + vec2(5.2, 1.3))
      );
      return q;
    }
  `,

  /**
   * Voronoi 3D
   * Voronoi图，用于细胞状纹理
   */
  voronoi3D: `
    vec3 voronoi(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      float m = 8.0;
      vec3 mr;

      for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
          for(int z = -1; z <= 1; z++) {
            vec3 b = vec3(float(x), float(y), float(z));
            vec3 r = vec3(b) - f;
            float d = length(r);
            if(d < m) {
              m = d;
              mr = r;
            }
          }
        }
      }
      return mr;
    }
  `,

  /**
   * Worley Noise
   * Worley噪声，Voronoi噪声的变体
   */
  worleyNoise: `
    vec2 worley(vec2 p) {
      vec2 n = floor(p);
      vec2 f = fract(p);

      float m1 = 8.0;
      float m2 = 8.0;
      float m3 = 8.0;
      vec2 mr1;
      vec2 mr2;
      vec2 mr3;

      for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
          vec2 b = vec2(float(x), float(y));
          vec2 r = vec2(b) - f;
          float d = length(r);

          if(d < m1) {
            m3 = m2;
            mr3 = mr2;
            m2 = m1;
            mr2 = mr1;
            m1 = d;
            mr1 = r;
          }
          else if(d < m2) {
            m3 = m2;
            mr3 = mr2;
            m2 = d;
            mr2 = r;
          }
          else if(d < m3) {
            m3 = d;
            mr3 = r;
          }
        }
      }

      return vec2(m1, m2 - m1);
    }
  `,

  /**
   * Ashima Noise
   * 异质噪声，用于生成云雾效果
   */
  ashimaNoise: `
    float ashima(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      vec3 h = 0.123 + 0.456 * i + 0.789 * i.yzx;
      i += vec3(7.0, 157.0, 113.0);

      vec4 a = mod(vec4(i.x, i.y, i.z, 0.0), 289.0);
      vec4 b = mod(vec4(i.y, i.z, 0.0, i.x), 289.0);
      vec4 c = mod(vec4(i.z, 0.0, i.x, i.y), 289.0);
      vec4 d = mod(vec4(0.0, i.x, i.y, i.z), 289.0);

      vec4 n = a + b * 1.0 + c * 2.0 + d * 3.0;
      n = mod(n, 289.0);

      return fract(sin(dot(n, vec4(0.143, 0.143, 0.143, 0.143))) *
             43758.5453 * f);
    }
  `,

  /**
   * Curl Noise
   * 旋度噪声，用于生成流体效果
   */
  curlNoise: `
    const float EPSILON = 0.1;

    vec3 curlNoise(vec3 p) {
      float n1 = snoise3D(vec3(p.x, p.y + EPSILON, p.z));
      float n2 = snoise3D(vec3(p.x, p.y - EPSILON, p.z));
      float n3 = snoise3D(vec3(p.x, p.y, p.z + EPSILON));
      float n4 = snoise3D(vec3(p.x, p.y, p.z - EPSILON));
      float n5 = snoise3D(vec3(p.x + EPSILON, p.y, p.z));
      float n6 = snoise3D(vec3(p.x - EPSILON, p.y, p.z));

      float x = n2 - n1 - n4 + n3;
      float y = n4 - n3 - n6 + n5;
      float z = n1 - n2 + n5 - n6;

      return normalize(vec3(x, y, z));
    }
  `
}

/**
 * 预定义的Shader uniform组合
 */
export const COMMON_UNIFORMS = {
  time: 'uTime',
  resolution: 'uResolution',
  mouse: 'uMouse',
  color: 'uColor',
  opacity: 'uOpacity',
  scale: 'uScale'
}

/**
 * 预定义的Shader属性
 */
export const COMMON_ATTRIBUTES = {
  position: 'position',
  color: 'color',
  normal: 'normal',
  uv: 'uv'
}

/**
 * 辅助函数：获取噪声Shader组合
 * @param {string[]} noiseTypes - 需要的噪声类型数组
 * @returns {string} 组合后的Shader代码
 */
export function getNoiseShader(...noiseTypes) {
  let shaderCode = ''

  noiseTypes.forEach((type) => {
    if (NOISE_SHADERS[type]) {
      shaderCode += NOISE_SHADERS[type]
      shaderCode += '\n\n'
    }
  })

  return shaderCode
}

/**
 * 辅助函数：创建带噪声的顶点Shader
 * @param {string} noiseType - 噪声类型
 * @param {string} customCode - 自定义代码
 * @returns {string} 完整的顶点Shader
 */
export function createVertexShader(noiseType, customCode = '') {
  const noiseCode = NOISE_SHADERS[noiseType] || ''

  return `
    precision highp float;

    ${NOISE_SHADERS.simplexNoise3D}

    uniform float uTime;
    uniform float uScale;
    uniform vec3 uColor;
    uniform float uOpacity;

    attribute vec3 color;
    attribute float size;

    varying vec3 vColor;
    varying float vOpacity;
    varying vec3 vPosition;

    void main() {
      vec3 pos = position;
      float noise = snoise3D(pos * uScale + uTime * 0.1);
      pos += normal * noise * 0.5;

      ${customCode}

      vColor = color;
      vOpacity = uOpacity;
      vPosition = pos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (1.0 + noise * 0.3);
    }
  `
}

/**
 * 辅助函数：创建带噪声的片段Shader
 * @param {string} effectType - 效果类型
 * @param {string} customCode - 自定义代码
 * @returns {string} 完整的片段Shader
 */
export function createFragmentShader(effectType = 'basic', customCode = '') {
  const effectShaders = {
    basic: `
      void main() {
        vec3 color = vColor * uColor;
        float alpha = vOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    glow: `
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        vec3 color = vColor * uColor * (1.0 + alpha * 0.5);
        gl_FragColor = vec4(color, alpha * vOpacity);
      }
    `,
    holographic: `
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);
        float scanline = sin(uv.y * 100.0 + uTime) * 0.1;
        vec3 color = vColor * uColor;
        color += vec3(0.0, 1.0, 1.0) * scanline;
        float alpha = (1.0 - dist * 2.0) * vOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `
  }

  const effectCode = effectShaders[effectType] || effectShaders.basic

  return `
    precision highp float;

    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;

    varying vec3 vColor;
    varying float vOpacity;
    varying vec3 vPosition;

    ${customCode}

    ${effectCode}
  `
}

/**
 * 默认导出
 */
export default {
  NOISE_SHADERS,
  COMMON_UNIFORMS,
  COMMON_ATTRIBUTES,
  getNoiseShader,
  createVertexShader,
  createFragmentShader
}
