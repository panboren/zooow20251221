/**
 * 增强型GPU计算着色器系统
 * 支持WebGL Compute Shader和GPGPU计算
 * 提供粒子系统、物理模拟、噪声生成等功能
 */

import * as THREE from 'three'
import { ResourceContext } from './ResourceCleaner.js'

export class EnhancedGPUCompute {
  constructor(renderer, options = {}) {
    this.renderer = renderer
    this.options = {
      floatType: THREE.FloatType,
      filterType: THREE.NearestFilter,
      wrapType: THREE.ClampToEdgeWrapping,
      ...options
    }

    this.computeRenderer = null
    this.computeTargets = []
    this.currentRenderTargetIndex = 0
    this.resources = new ResourceContext('GPUCompute')
  }

  /**
   * 初始化
   */
  init() {
    if (!this.renderer.capabilities.isWebGL2) {
      console.warn('GPU Compute requires WebGL 2')
      return false
    }

    return true
  }

  /**
   * 创建计算着色器材质
   */
  createComputeMaterial(fragmentShader, uniforms = {}) {
    const material = new THREE.ShaderMaterial({
      vertexShader: this.getVertexShader(),
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      depthWrite: false,
      depthTest: false
    })

    return material
  }

  /**
   * 创建数据纹理
   */
  createDataTexture(width, height, data = null, format = THREE.RGBAFormat) {
    const size = width * height * 4
    const buffer = data || new Float32Array(size)

    const texture = new THREE.DataTexture(
      buffer,
      width,
      height,
      format,
      this.options.floatType
    )

    texture.needsUpdate = true
    texture.minFilter = this.options.filterType
    texture.magFilter = this.options.filterType
    texture.wrapS = this.options.wrapType
    texture.wrapT = this.options.wrapType
    texture.generateMipmaps = false

    this.resources.add(texture, 'texture')

    return texture
  }

  /**
   * 创建渲染目标
   */
  createRenderTarget(width, height, format = THREE.RGBAFormat) {
    const target = new THREE.WebGLRenderTarget(width, height, {
      format: format,
      type: this.options.floatType,
      minFilter: this.options.filterType,
      magFilter: this.options.filterType,
      wrapS: this.options.wrapType,
      wrapT: this.options.wrapType,
      generateMipmaps: false,
      depthBuffer: false,
      stencilBuffer: false
    })

    this.resources.add(target, 'renderTarget')

    return target
  }

  /**
   * 创建双缓冲渲染目标
   */
  createDoubleBuffer(width, height, format = THREE.RGBAFormat) {
    const targets = [
      this.createRenderTarget(width, height, format),
      this.createRenderTarget(width, height, format)
    ]

    this.computeTargets.push(targets)

    return targets
  }

  /**
   * 执行计算Pass
   */
  compute(material, inputTexture, outputTarget) {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      material
    )

    scene.add(quad)

    // 设置输入纹理
    if (inputTexture && material.uniforms.inputTexture !== undefined) {
      material.uniforms.inputTexture.value = inputTexture
    }

    // 渲染到输出目标
    this.renderer.setRenderTarget(outputTarget)
    this.renderer.render(scene, camera)
    this.renderer.setRenderTarget(null)

    outputTarget.texture.needsUpdate = true
  }

  /**
   * Ping-Pong缓冲区计算
   */
  computePingPong(material, targets, deltaTime = 1, time = 0) {
    const readIndex = this.currentRenderTargetIndex
    const writeIndex = 1 - this.currentRenderTargetIndex

    // 设置时间uniforms
    if (material.uniforms.deltaTime) {
      material.uniforms.deltaTime.value = deltaTime
    }
    if (material.uniforms.time) {
      material.uniforms.time.value = time
    }

    // 执行计算
    this.compute(
      material,
      targets[readIndex].texture,
      targets[writeIndex]
    )

    // 切换缓冲区
    this.currentRenderTargetIndex = writeIndex

    return writeIndex
  }

  /**
   * 获取顶点着色器
   */
  getVertexShader() {
    return `
      precision highp float;
      precision highp int;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `
  }

  /**
   * 获取粒子运动Shader
   */
  getParticleMotionShader(config = {}) {
    return `
      precision highp float;
      precision highp int;

      uniform sampler2D positionTexture;
      uniform sampler2D velocityTexture;
      uniform float time;
      uniform float deltaTime;
      uniform vec3 gravity;
      uniform float damping;
      uniform float speed;

      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        // 读取当前位置和速度
        vec4 posData = texture2D(positionTexture, uv);
        vec4 velData = texture2D(velocityTexture, uv);
        vec3 position = posData.xyz;
        vec3 velocity = velData.xyz;
        float life = velData.w;

        // 更新速度（重力）
        velocity += gravity * deltaTime * speed;

        // 更新位置
        position += velocity * deltaTime * speed;

        // 阻尼
        velocity *= damping;

        // 写入新数据
        gl_FragColor = vec4(position, life);
      }
    `
  }

  /**
   * 获取粒子生命周期Shader
   */
  getParticleLifeShader(config = {}) {
    const spawnRate = config.spawnRate || 0.01
    const maxLife = config.maxLife || 1.0

    return `
      precision highp float;
      precision highp int;

      uniform sampler2D lifeTexture;
      uniform float time;
      uniform float deltaTime;
      uniform float spawnRate;
      uniform float maxLife;

      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        vec4 lifeData = texture2D(lifeTexture, uv);
        float life = lifeData.x;
        float age = lifeData.y;

        // 更新年龄
        age += deltaTime;

        // 随机重生
        float random = fract(sin(dot(uv * time, vec2(12.9898, 78.233))) * 43758.5453);
        if (age >= maxLife && random < spawnRate) {
          age = 0.0;
        }

        // 计算生命值
        float normalizedLife = 1.0 - (age / maxLife);
        life = clamp(normalizedLife, 0.0, 1.0);

        gl_FragColor = vec4(life, age, 0.0, 0.0);
      }
    `
  }

  /**
   * 获取粒子力场Shader
   */
  getParticleForceShader(config = {}) {
    const forceType = config.forceType || 'attract' // attract, repel, vortex, noise

    return `
      precision highp float;
      precision highp int;

      uniform sampler2D positionTexture;
      uniform sampler2D velocityTexture;
      uniform vec3 forcePosition;
      uniform float forceStrength;
      uniform float forceRadius;
      uniform float time;

      varying vec2 vUv;

      // 伪随机函数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // 3D噪声函数
      vec3 hash33(vec3 p) {
        p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                 dot(p, vec3(269.5, 183.3, 246.1)),
                 dot(p, vec3(113.5, 271.9, 124.6)));

        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        return mix(mix(mix(dot(hash33(i + vec3(0, 0, 0)), f - vec3(0, 0, 0)),
                         dot(hash33(i + vec3(1, 0, 0)), f - vec3(1, 0, 0)), f.x),
                    mix(mix(dot(hash33(i + vec3(0, 1, 0)), f - vec3(0, 1, 0)),
                         dot(hash33(i + vec3(1, 1, 0)), f - vec3(1, 1, 0)), f.x), f.y),
                    mix(mix(dot(hash33(i + vec3(0, 0, 1)), f - vec3(0, 0, 1)),
                         dot(hash33(i + vec3(1, 0, 1)), f - vec3(1, 0, 1)), f.x),
                    mix(mix(dot(hash33(i + vec3(0, 1, 1)), f - vec3(0, 1, 1)),
                         dot(hash33(i + vec3(1, 1, 1)), f - vec3(1, 1, 1)), f.x), f.y), f.z);
      }

      void main() {
        vec2 uv = vUv;

        vec3 position = texture2D(positionTexture, uv).xyz;
        vec3 velocity = texture2D(velocityTexture, uv).xyz;

        vec3 force = vec3(0.0);

        // 力场计算
        vec3 toCenter = forcePosition - position;
        float distance = length(toCenter);
        vec3 direction = normalize(toCenter);

        // 引力/斥力
        if (distance < forceRadius && distance > 0.1) {
          float falloff = 1.0 - (distance / forceRadius);
          falloff = falloff * falloff;

          force += direction * forceStrength * falloff;
        }

        // 噪声力
        float noiseValue = noise(position * 0.1 + time * 0.1);
        force += hash33(position) * noiseValue * forceStrength * 0.3;

        gl_FragColor = vec4(force, 0.0);
      }
    `
  }

  /**
   * 获取流体模拟Shader
   */
  getFluidSimulationShader(config = {}) {
    return `
      precision highp float;
      precision highp int;

      uniform sampler2D velocityTexture;
      uniform sampler2D divergenceTexture;
      uniform sampler2D pressureTexture;
      uniform float dt;

      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        vec2 velocity = texture2D(velocityTexture, uv).xy;
        vec2 divergence = texture2D(divergenceTexture, uv).xy;
        float pressure = texture2D(pressureTexture, uv).r;

        vec2 left = texture2D(pressureTexture, uv + vec2(-0.01, 0.0)).r;
        vec2 right = texture2D(pressureTexture, uv + vec2(0.01, 0.0)).r;
        vec2 up = texture2D(pressureTexture, uv + vec2(0.0, -0.01)).r;
        vec2 down = texture2D(pressureTexture, uv + vec2(0.0, 0.01)).r;

        vec2 pressureGradient = vec2(right - left, down - up) * 0.5;
        vec2 newVelocity = velocity - pressureGradient;

        gl_FragColor = vec4(newVelocity, 0.0, 0.0);
      }
    `
  }

  /**
   * 获取波浪噪声Shader
   */
  getWaveNoiseShader(config = {}) {
    const frequency = config.frequency || 1.0
    const amplitude = config.amplitude || 1.0
    const speed = config.speed || 1.0

    return `
      precision highp float;
      precision highp int;

      uniform float time;
      uniform float frequency;
      uniform float amplitude;
      uniform float speed;

      varying vec2 vUv;

      void main() {
        vec2 uv = vUv * frequency;

        float wave1 = sin(uv.x * 2.0 + time * speed) * amplitude;
        float wave2 = sin(uv.y * 2.0 + time * speed * 1.3) * amplitude * 0.7;
        float wave3 = sin((uv.x + uv.y) * 1.5 + time * speed * 0.8) * amplitude * 0.5;

        float value = wave1 + wave2 + wave3;

        gl_FragColor = vec4(value, value, value, 1.0);
      }
    `
  }

  /**
   * 获取Perlin噪声Shader
   */
  getPerlinNoiseShader(config = {}) {
    const scale = config.scale || 1.0
    const octaves = config.octaves || 4
    const persistence = config.persistence || 0.5

    return `
      precision highp float;
      precision highp int;

      uniform float time;
      uniform float scale;
      uniform int octaves;
      uniform float persistence;

      varying vec2 vUv;

      vec2 hash2(vec2 p) {
        return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),
                           dot(p, vec2(269.5, 183.3)))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;

        for (int i = 0; i < 8; i++) {
          if (i >= octaves) break;
          value += amplitude * noise(p * frequency);
          amplitude *= persistence;
          frequency *= 2.0;
        }

        return value;
      }

      void main() {
        vec2 uv = vUv * scale;
        float value = fbm(uv + time * 0.1);

        gl_FragColor = vec4(value, value, value, 1.0);
      }
    `
  }

  /**
   * 清理资源
   */
  dispose() {
    this.resources.clear()
    this.computeTargets = []
    this.currentRenderTargetIndex = 0
  }
}

/**
 * GPU粒子系统
 */
export class GPUParticleSystem extends EnhancedGPUCompute {
  constructor(renderer, options = {}) {
    super(renderer, options)

    this.particleCount = options.particleCount || 10000
    this.width = Math.ceil(Math.sqrt(this.particleCount))
    this.height = Math.ceil(this.particleCount / this.width)

    this.positionTargets = null
    this.velocityTargets = null
    this.lifeTargets = null

    this.geometry = null
    this.material = null
    this.mesh = null

    // 配置
    this.config = {
      gravity: new THREE.Vector3(0, -9.8, 0),
      damping: 0.99,
      speed: 1.0,
      maxLife: 1.0,
      spawnRate: 0.01,
      forcePosition: new THREE.Vector3(0, 0, 0),
      forceStrength: 10.0,
      forceRadius: 50.0,
      ...options.config
    }

    this.isInitialized = false
  }

  /**
   * 初始化粒子系统
   */
  init() {
    if (!super.init()) {
      console.error('GPU Compute not supported')
      return false
    }

    // 创建双缓冲区
    this.positionTargets = this.createDoubleBuffer(this.width, this.height)
    this.velocityTargets = this.createDoubleBuffer(this.width, this.height)
    this.lifeTargets = this.createDoubleBuffer(this.width, this.height, THREE.RedFormat)

    // 初始化粒子数据
    this.initializeParticles()

    // 创建渲染几何体
    this.createRenderGeometry()

    this.isInitialized = true
    return true
  }

  /**
   * 初始化粒子数据
   */
  initializeParticles() {
    const size = this.width * this.height * 4
    const positions = new Float32Array(size)
    const velocities = new Float32Array(size)
    const lives = new Float32Array(size / 4)

    for (let i = 0; i < this.width * this.height; i++) {
      const i4 = i * 4

      // 随机位置
      positions[i4] = (Math.random() - 0.5) * 100
      positions[i4 + 1] = (Math.random() - 0.5) * 100
      positions[i4 + 2] = (Math.random() - 0.5) * 100
      positions[i4 + 3] = 1.0

      // 随机速度
      velocities[i4] = (Math.random() - 0.5) * 2
      velocities[i4 + 1] = (Math.random() - 0.5) * 2
      velocities[i4 + 2] = (Math.random() - 0.5) * 2
      velocities[i4 + 3] = Math.random() * this.config.maxLife

      // 生命值
      lives[i] = 1.0
    }

    // 上传初始数据
    this.updateTargetData(this.positionTargets[0], positions)
    this.updateTargetData(this.velocityTargets[0], velocities)
    this.updateTargetData(this.lifeTargets[0], lives)
  }

  /**
   * 更新目标数据
   */
  updateTargetData(target, data) {
    const texture = target.texture
    const buffer = texture.image.data

    if (buffer.length === data.length) {
      buffer.set(data)
      texture.needsUpdate = true
    }
  }

  /**
   * 创建渲染几何体
   */
  createRenderGeometry() {
    this.geometry = new THREE.BufferGeometry()

    // 创建顶点
    const positions = new Float32Array(this.width * this.height * 3)
    const uvs = new Float32Array(this.width * this.height * 2)

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = (y * this.width + x) * 3
        const iuv = (y * this.width + x) * 2

        positions[i] = 0
        positions[i + 1] = 0
        positions[i + 2] = 0

        uvs[iuv] = (x + 0.5) / this.width
        uvs[iuv + 1] = (y + 0.5) / this.height
      }
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  }

  /**
   * 创建渲染材质
   */
  createRenderMaterial(options = {}) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.getParticleVertexShader(),
      fragmentShader: this.getParticleFragmentShader(options),
      uniforms: {
        positionTexture: { value: this.positionTargets[0].texture },
        lifeTexture: { value: this.lifeTargets[0].texture },
        color: { value: options.color || new THREE.Color(0xffffff) },
        size: { value: options.size || 2.0 },
        opacity: { value: options.opacity !== undefined ? options.opacity : 1.0 }
      },
      transparent: true,
      depthWrite: false,
      blending: options.blending || THREE.AdditiveBlending
    })

    this.mesh = new THREE.Points(this.geometry, this.material)
    return this.mesh
  }

  /**
   * 获取粒子顶点Shader
   */
  getParticleVertexShader() {
    return `
      precision highp float;
      precision highp int;

      uniform sampler2D positionTexture;
      uniform sampler2D lifeTexture;
      uniform float size;

      attribute vec2 uv;
      attribute vec3 position;

      varying float vLife;

      void main() {
        vLife = texture2D(lifeTexture, uv).r;

        vec3 particlePosition = texture2D(positionTexture, uv).xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(particlePosition + position, 1.0);
        gl_PointSize = size * vLife;
      }
    `
  }

  /**
   * 获取粒子片段Shader
   */
  getParticleFragmentShader(options = {}) {
    return `
      precision highp float;
      precision highp int;

      uniform vec3 color;
      uniform float opacity;

      varying float vLife;

      void main() {
        // 圆形粒子
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);

        if (dist > 0.5) {
          discard;
        }

        float alpha = smoothstep(0.5, 0.2, dist) * vLife * opacity;

        gl_FragColor = vec4(color, alpha);
      }
    `
  }

  /**
   * 更新粒子系统
   */
  update(deltaTime, time) {
    if (!this.isInitialized) return

    // 更新位置
    const motionMaterial = this.createComputeMaterial(
      this.getParticleMotionShader(this.config),
      {
        deltaTime: { value: deltaTime },
        time: { value: time },
        gravity: { value: this.config.gravity },
        damping: { value: this.config.damping },
        speed: { value: this.config.speed }
      }
    )

    this.computePingPong(motionMaterial, this.positionTargets, deltaTime, time)

    // 更新速度（力场）
    const forceMaterial = this.createComputeMaterial(
      this.getParticleForceShader(this.config),
      {
        positionTexture: { value: this.positionTargets[this.currentRenderTargetIndex].texture },
        velocityTexture: { value: this.velocityTargets[0].texture },
        forcePosition: { value: this.config.forcePosition },
        forceStrength: { value: this.config.forceStrength },
        forceRadius: { value: this.config.forceRadius },
        time: { value: time }
      }
    )

    this.computePingPong(forceMaterial, this.velocityTargets, deltaTime, time)

    // 更新生命周期
    const lifeMaterial = this.createComputeMaterial(
      this.getParticleLifeShader(this.config),
      {
        time: { value: time },
        deltaTime: { value: deltaTime },
        spawnRate: { value: this.config.spawnRate },
        maxLife: { value: this.config.maxLife }
      }
    )

    this.computePingPong(lifeMaterial, this.lifeTargets, deltaTime, time)

    // 更新渲染材质uniforms
    if (this.material) {
      this.material.uniforms.positionTexture.value =
        this.positionTargets[this.currentRenderTargetIndex].texture
      this.material.uniforms.lifeTexture.value =
        this.lifeTargets[this.currentRenderTargetIndex].texture
    }
  }

  /**
   * 设置力场参数
   */
  setForce(position, strength, radius) {
    this.config.forcePosition.copy(position)
    this.config.forceStrength = strength
    this.config.forceRadius = radius
  }

  /**
   * 获取粒子数
   */
  getParticleCount() {
    return this.particleCount
  }

  /**
   * 获取网格
   */
  getMesh() {
    return this.mesh
  }

  /**
   * 清理
   */
  dispose() {
    super.dispose()

    if (this.geometry) {
      this.geometry.dispose()
      this.geometry = null
    }

    if (this.material) {
      this.material.dispose()
      this.material = null
    }

    this.mesh = null
    this.isInitialized = false
  }
}

export default EnhancedGPUCompute
