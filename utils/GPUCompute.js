/**
 * GPU Compute Shader 加速计算
 * 使用WebGL Compute Shader进行高性能粒子计算
 */

import * as THREE from 'three'

export class GPUCompute {
  constructor(renderer) {
    this.renderer = renderer
    this.computeRenderer = null
    this.computeTargets = []
    this.workgroups = [1, 1, 1]
  }

  /**
   * 初始化Compute Shader
   */
  init() {
    if (!this.renderer.capabilities.isWebGL2) {
      console.warn('GPU Compute requires WebGL 2')
      return false
    }

    // 创建compute renderer
    this.computeRenderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance'
    })

    return true
  }

  /**
   * 创建Compute Shader
   */
  createComputeShader(fragmentShader, uniforms = {}) {
    const material = new THREE.ShaderMaterial({
      vertexShader: this.getVertexShader(),
      fragmentShader: fragmentShader,
      uniforms: uniforms
    })

    return material
  }

  /**
   * 创建纹理数据
   */
  createTexture(width, height, format = THREE.RGBAFormat, type = THREE.FloatType) {
    const texture = new THREE.DataTexture(
      new Float32Array(width * height * 4),
      width,
      height,
      format,
      type
    )
    texture.needsUpdate = true
    return texture
  }

  /**
   * 创建帧缓冲
   */
  createFrameBuffer(texture) {
    const frameBuffer = new THREE.WebGLRenderTarget(
      texture.image.width,
      texture.image.height,
      {
        format: texture.format,
        type: texture.type,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter
      }
    )
    return frameBuffer
  }

  /**
   * 执行Compute Pass
   */
  compute(material, input, output) {
    if (!this.computeRenderer) {
      console.error('Compute renderer not initialized')
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      material
    )

    scene.add(quad)

    // 设置输入纹理
    if (input) {
      material.uniforms.inputTexture = { value: input }
    }

    // 渲染到输出纹理
    this.computeRenderer.setRenderTarget(output)
    this.computeRenderer.render(scene, camera)
    this.computeRenderer.setRenderTarget(null)

    output.texture.needsUpdate = true
  }

  /**
   * 获取粒子运动Compute Shader
   */
  getParticleMotionShader() {
    return `
      uniform sampler2D inputTexture;
      uniform float time;
      uniform float deltaTime;
      uniform vec3 gravity;
      uniform float damping;

      void main() {
        vec2 uv = gl_FragCoord.xy / vec2(${this.width}, ${this.height});

        // 读取当前位置和速度
        vec4 data = texture2D(inputTexture, uv);
        vec3 position = data.xyz;
        float life = data.w;

        // 计算新位置（示例：重力+阻尼）
        vec3 newPosition = position + gravity * deltaTime * damping;

        // 写入新数据
        gl_FragColor = vec4(newPosition, life);
      }
    `
  }

  /**
   * 获取粒子碰撞Compute Shader
   */
  getParticleCollisionShader() {
    return `
      uniform sampler2D positionTexture;
      uniform sampler2D velocityTexture;
      uniform float collisionRadius;
      uniform float bounceFactor;

      void main() {
        vec2 uv = gl_FragCoord.xy / vec2(${this.width}, ${this.height});

        vec3 position = texture2D(positionTexture, uv).xyz;
        vec3 velocity = texture2D(velocityTexture, uv).xyz;

        // 检测边界碰撞
        if (abs(position.x) > 50.0) {
          velocity.x *= -bounceFactor;
        }
        if (abs(position.y) > 50.0) {
          velocity.y *= -bounceFactor;
        }
        if (abs(position.z) > 50.0) {
          velocity.z *= -bounceFactor;
        }

        gl_FragColor = vec4(velocity, 1.0);
      }
    `
  }

  /**
   * 获取引力Compute Shader
   */
  getGravityShader() {
    return `
      uniform sampler2D positionTexture;
      uniform sampler2D massTexture;
      uniform vec3 attractorPosition;
      uniform float attractorMass;
      uniform float G;

      void main() {
        vec2 uv = gl_FragCoord.xy / vec2(${this.width}, ${this.height});

        vec3 position = texture2D(positionTexture, uv).xyz;
        float mass = texture2D(massTexture, uv).r;

        // 计算引力
        vec3 direction = attractorPosition - position;
        float distance = length(direction);
        direction = normalize(direction);

        // F = G * m1 * m2 / r^2
        float force = G * mass * attractorMass / (distance * distance + 1.0);

        gl_FragColor = vec4(direction * force, 0.0);
      }
    `
  }

  /**
   * 获取顶点着色器
   */
  getVertexShader() {
    return `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `
  }

  /**
   * 清理资源
   */
  dispose() {
    this.computeTargets.forEach(target => {
      if (target.texture) {
        target.texture.dispose()
      }
      target.dispose()
    })
    this.computeTargets = []

    if (this.computeRenderer) {
      this.computeRenderer.dispose()
      this.computeRenderer = null
    }
  }
}

// 使用示例
export class GPUParticleSystem extends GPUCompute {
  constructor(renderer, options = {}) {
    super(renderer)
    this.particleCount = options.particleCount || 10000
    this.width = Math.ceil(Math.sqrt(this.particleCount))
    this.height = Math.ceil(this.particleCount / this.width)

    this.positionTexture = null
    this.velocityTexture = null
    this.massTexture = null

    this.init()
  }

  init() {
    super.init()

    // 创建位置纹理
    this.positionTexture = this.createTexture(this.width, this.height)
    this.velocityTexture = this.createTexture(this.width, this.height)
    this.massTexture = this.createTexture(this.width, this.height)
  }

  update(deltaTime, time) {
    // 使用GPU计算粒子运动
    const motionMaterial = this.createComputeShader(
      this.getParticleMotionShader(),
      {
        time: { value: time },
        deltaTime: { value: deltaTime },
        gravity: { value: new THREE.Vector3(0, -9.8, 0) },
        damping: { value: 0.99 }
      }
    )

    const outputTexture = this.createTexture(this.width, this.height)
    const outputBuffer = this.createFrameBuffer(outputTexture)

    this.compute(motionMaterial, this.positionTexture, outputBuffer)

    // 更新位置纹理
    this.positionTexture.dispose()
    this.positionTexture = outputTexture
  }

  dispose() {
    super.dispose()

    if (this.positionTexture) this.positionTexture.dispose()
    if (this.velocityTexture) this.velocityTexture.dispose()
    if (this.massTexture) this.massTexture.dispose()
  }
}
