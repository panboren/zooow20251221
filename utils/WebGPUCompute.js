/**
 * WebGPU Compute Shader 加速计算
 * 支持 WebGPU Compute Shader 和 WebGL2 Compute Shader (GPGPU)
 */

import * as THREE from 'three'

export class WebGPUCompute {
  constructor(renderer, rendererType = 'webgl2') {
    this.renderer = renderer
    this.rendererType = rendererType
    this.device = null
    this.computePipeline = null
    this.bindGroups = []
    this.buffers = []
    this.textures = []
    this.workgroups = [1, 1, 1]
  }

  /**
   * 初始化 Compute Shader
   */
  async init() {
    if (this.rendererType === 'webgpu') {
      return await this.initWebGPUCompute()
    } else {
      return this.initWebGL2Compute()
    }
  }

  /**
   * 初始化 WebGPU Compute Shader
   */
  async initWebGPUCompute() {
    if (!navigator.gpu) {
      console.error('WebGPU is not supported')
      return false
    }

    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        console.error('No WebGPU adapter found')
        return false
      }

      this.device = await adapter.requestDevice({
        requiredFeatures: [],
        requiredLimits: {
          maxBufferSize: adapter.limits.maxBufferSize,
          maxBufferSizeAlignment: adapter.limits.maxBufferSizeAlignment
        }
      })

      console.log('✓ WebGPU Compute initialized')
      console.log('Device:', this.device)

      return true
    } catch (error) {
      console.error('WebGPU Compute initialization error:', error)
      return false
    }
  }

  /**
   * 初始化 WebGL2 Compute Shader (GPGPU)
   */
  initWebGL2Compute() {
    if (!this.renderer.capabilities.isWebGL2) {
      console.warn('GPGPU requires WebGL 2')
      return false
    }

    this.computeRenderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance'
    })

    console.log('✓ WebGL2 GPGPU initialized')
    return true
  }

  /**
   * 创建缓冲区 (WebGPU)
   */
  createBuffer(size, usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST, data = null) {
    if (this.rendererType !== 'webgpu') {
      console.warn('createBuffer is only available for WebGPU')
      return null
    }

    const buffer = this.device.createBuffer({
      size: size,
      usage: usage,
      mappedAtCreation: data !== null
    })

    if (data !== null) {
      const mappedRange = buffer.getMappedRange()
      new Float32Array(mappedRange).set(data)
      buffer.unmap()
    }

    this.buffers.push(buffer)
    return buffer
  }

  /**
   * 创建纹理 (WebGPU)
   */
  async createTexture(width, height, format = 'rgba32float', usage = GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING) {
    if (this.rendererType !== 'webgpu') {
      console.warn('createTexture is only available for WebGPU')
      return null
    }

    const texture = this.device.createTexture({
      size: [width, height, 1],
      format: format,
      usage: usage
    })

    this.textures.push(texture)
    return texture
  }

  /**
   * 创建 Compute Shader Pipeline (WebGPU)
   */
  createComputePipeline(wgslCode, bindGroupLayouts = []) {
    if (this.rendererType !== 'webgpu') {
      console.warn('createComputePipeline is only available for WebGPU')
      return null
    }

    const shaderModule = this.device.createShaderModule({
      code: wgslCode
    })

    this.computePipeline = this.device.createComputePipeline({
      layout: this.device.createPipelineLayout({ bindGroupLayouts }),
      compute: {
        module: shaderModule,
        entryPoint: 'main'
      }
    })

    return this.computePipeline
  }

  /**
   * 创建绑定组 (WebGPU)
   */
  createBindGroup(layout, entries) {
    if (this.rendererType !== 'webgpu') {
      console.warn('createBindGroup is only available for WebGPU')
      return null
    }

    const bindGroup = this.device.createBindGroup({
      layout: layout,
      entries: entries
    })

    this.bindGroups.push(bindGroup)
    return bindGroup
  }

  /**
   * 执行 Compute Pass (WebGPU)
   */
  dispatch(workgroupsX, workgroupsY = 1, workgroupsZ = 1) {
    if (this.rendererType !== 'webgpu') {
      console.warn('dispatch is only available for WebGPU')
      return
    }

    const commandEncoder = this.device.createCommandEncoder()
    const passEncoder = commandEncoder.beginComputePass()

    passEncoder.setPipeline(this.computePipeline)
    this.bindGroups.forEach((bindGroup, index) => {
      passEncoder.setBindGroup(index, bindGroup)
    })
    passEncoder.dispatchWorkgroups(workgroupsX, workgroupsY, workgroupsZ)
    passEncoder.end()

    this.device.queue.submit([commandEncoder.finish()])
  }

  /**
   * 创建纹理数据 (WebGL2 GPGPU)
   */
  createTextureData(width, height, format = THREE.RGBAFormat, type = THREE.FloatType, data = null) {
    if (this.rendererType !== 'webgl2') {
      return null
    }

    let dataArray
    if (data) {
      dataArray = data
    } else {
      dataArray = new Float32Array(width * height * 4)
    }

    const texture = new THREE.DataTexture(
      dataArray,
      width,
      height,
      format,
      type
    )
    texture.needsUpdate = true
    return texture
  }

  /**
   * 创建帧缓冲 (WebGL2 GPGPU)
   */
  createRenderTarget(width, height, format = THREE.RGBAFormat, type = THREE.FloatType) {
    if (this.rendererType !== 'webgl2') {
      return null
    }

    return new THREE.WebGLRenderTarget(
      width,
      height,
      {
        format: format,
        type: type,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
      }
    )
  }

  /**
   * 执行 Compute Pass (WebGL2 GPGPU)
   */
  computeGPGPU(material, input, output, width, height) {
    if (this.rendererType !== 'webgl2') {
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

    material.uniforms.resolution = { value: new THREE.Vector2(width, height) }

    // 渲染到输出纹理
    this.computeRenderer.setRenderTarget(output)
    this.computeRenderer.render(scene, camera)
    this.computeRenderer.setRenderTarget(null)

    output.texture.needsUpdate = true
  }

  /**
   * 获取粒子运动 WGSL Compute Shader
   */
  getParticleMotionWGSL() {
    return `
      struct Particle {
        position: vec3<f32>,
        velocity: vec3<f32>,
        life: f32,
      }

      struct Uniforms {
        deltaTime: f32,
        gravity: vec3<f32>,
        damping: f32,
        time: f32,
      }

      @group(0) @binding(0) var<storage, read> inputParticles: array<Particle>;
      @group(0) @binding(1) var<storage, read_write> outputParticles: array<Particle>;
      @group(0) @binding(2) var<uniform> uniforms: Uniforms;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let index = global_id.x;
        if (index >= arrayLength(&inputParticles)) {
          return;
        }

        let particle = inputParticles[index];
        var newPosition = particle.position + particle.velocity * uniforms.deltaTime;

        // 应用重力
        newPosition = newPosition + uniforms.gravity * uniforms.deltaTime * uniforms.deltaTime * 0.5;

        // 应用阻尼
        var newVelocity = particle.velocity * uniforms.damping;
        newVelocity = newVelocity + uniforms.gravity * uniforms.deltaTime;

        // 更新生命周期
        var newLife = particle.life - uniforms.deltaTime;

        outputParticles[index] = Particle(
          newPosition,
          newVelocity,
          newLife
        );
      }
    `
  }

  /**
   * 获取粒子碰撞 WGSL Compute Shader
   */
  getParticleCollisionWGSL() {
    return `
      struct Particle {
        position: vec3<f32>,
        velocity: vec3<f32>,
        life: f32,
      }

      struct Uniforms {
        boundsRadius: f32,
        bounceFactor: f32,
        particleCount: u32,
      }

      @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
      @group(0) @binding(1) var<uniform> uniforms: Uniforms;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let index = global_id.x;
        if (index >= uniforms.particleCount) {
          return;
        }

        var particle = particles[index];

        // 边界碰撞检测
        if (abs(particle.position.x) > uniforms.boundsRadius) {
          particle.velocity.x *= -uniforms.bounceFactor;
          particle.position.x = sign(particle.position.x) * uniforms.boundsRadius;
        }
        if (abs(particle.position.y) > uniforms.boundsRadius) {
          particle.velocity.y *= -uniforms.bounceFactor;
          particle.position.y = sign(particle.position.y) * uniforms.boundsRadius;
        }
        if (abs(particle.position.z) > uniforms.boundsRadius) {
          particle.velocity.z *= -uniforms.bounceFactor;
          particle.position.z = sign(particle.position.z) * uniforms.boundsRadius;
        }

        particles[index] = particle;
      }
    `
  }

  /**
   * 获取引力 WGSL Compute Shader
   */
  getGravityWGSL() {
    return `
      struct Particle {
        position: vec3<f32>,
        velocity: vec3<f32>,
        mass: f32,
        life: f32,
      }

      struct Uniforms {
        attractorPosition: vec3<f32>,
        attractorMass: f32,
        G: f32,
        particleCount: u32,
      }

      @group(0) @binding(0) var<storage, read> inputParticles: array<Particle>;
      @group(0) @binding(1) var<storage, read_write> outputParticles: array<Particle>;
      @group(0) @binding(2) var<uniform> uniforms: Uniforms;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let index = global_id.x;
        if (index >= uniforms.particleCount) {
          return;
        }

        let particle = inputParticles[index];

        // 计算引力
        let direction = uniforms.attractorPosition - particle.position;
        let distance = length(direction);
        let normalizedDirection = normalize(direction);

        // F = G * m1 * m2 / r^2
        let force = uniforms.G * particle.mass * uniforms.attractorMass / (distance * distance + 0.001);

        // 更新速度
        let newVelocity = particle.velocity + normalizedDirection * force * 0.016;

        // 更新位置
        let newPosition = particle.position + newVelocity * 0.016;

        outputParticles[index] = Particle(
          newPosition,
          newVelocity,
          particle.mass,
          particle.life
        );
      }
    `
  }

  /**
   * 读取缓冲区数据 (WebGPU)
   */
  async readBuffer(buffer, size) {
    if (this.rendererType !== 'webgpu') {
      return null
    }

    const readBuffer = this.device.createBuffer({
      size: size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    })

    const commandEncoder = this.device.createCommandEncoder()
    commandEncoder.copyBufferToBuffer(buffer, 0, readBuffer, 0, size)
    this.device.queue.submit([commandEncoder.finish()])

    await readBuffer.mapAsync(GPUMapMode.READ)
    const data = new Float32Array(readBuffer.getMappedRange())
    readBuffer.unmap()

    return data
  }

  /**
   * 清理资源
   */
  dispose() {
    // 清理 WebGPU 资源
    if (this.rendererType === 'webgpu') {
      this.buffers.forEach(buffer => buffer.destroy())
      this.textures.forEach(texture => texture.destroy())
      this.bindGroups.forEach(bindGroup => {})
      this.buffers = []
      this.textures = []
      this.bindGroups = []

      if (this.device) {
        this.device.destroy()
        this.device = null
      }
    }

    // 清理 WebGL2 资源
    if (this.computeRenderer) {
      this.computeRenderer.dispose()
      this.computeRenderer = null
    }
  }
}

/**
 * WebGPU 粒子系统
 */
export class WebGPUParticleSystem extends WebGPUCompute {
  constructor(renderer, options = {}) {
    const {
      rendererType = 'webgl2',
      particleCount = 10000
    } = options

    super(renderer, rendererType)
    this.particleCount = particleCount
    this.width = Math.ceil(Math.sqrt(particleCount))
    this.height = Math.ceil(particleCount / this.width)
    this.initialized = false
  }

  async init() {
    const success = await super.init()
    if (!success) {
      return false
    }

    this.initialized = true
    return true
  }

  /**
   * 初始化 WebGPU 粒子系统
   */
  async initWebGPUParticles() {
    if (this.rendererType !== 'webgpu') {
      return
    }

    const particleSize = 4 * 4  // vec3 position + vec3 velocity + float mass + float life = 16 floats

    // 创建粒子数据
    const initialParticles = new Float32Array(this.particleCount * 16)
    for (let i = 0; i < this.particleCount; i++) {
      const offset = i * 16
      initialParticles[offset + 0] = (Math.random() - 0.5) * 100  // x
      initialParticles[offset + 1] = (Math.random() - 0.5) * 100  // y
      initialParticles[offset + 2] = (Math.random() - 0.5) * 100  // z
      initialParticles[offset + 3] = 0  // velocity x
      initialParticles[offset + 4] = 0  // velocity y
      initialParticles[offset + 5] = 0  // velocity z
      initialParticles[offset + 6] = 1.0  // mass
      initialParticles[offset + 7] = 1.0  // life
    }

    this.particleBuffer = this.createBuffer(
      this.particleCount * 16 * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
      initialParticles
    )

    // 创建输出缓冲区
    this.outputBuffer = this.createBuffer(
      this.particleCount * 16 * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    )
  }

  /**
   * 更新粒子 (WebGPU)
   */
  updateWebGPU(time, deltaTime) {
    if (!this.initialized || this.rendererType !== 'webgpu') {
      return
    }

    // 创建 uniform 缓冲区
    const uniformData = new Float32Array(8)  // deltaTime (1) + gravity (3) + damping (1) + time (1) + padding (2)
    uniformData[0] = deltaTime
    uniformData[1] = 0   // gravity x
    uniformData[2] = -9.8  // gravity y
    uniformData[3] = 0   // gravity z
    uniformData[4] = 0.99  // damping
    uniformData[5] = time

    this.uniformBuffer = this.createBuffer(8 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, uniformData)

    // 创建 compute pipeline
    const wgslCode = this.getParticleMotionWGSL()
    this.createComputePipeline(wgslCode, [])

    // 创建绑定组
    const bindGroup = this.createBindGroup(
      this.computePipeline.getBindGroupLayout(0),
      [
        { binding: 0, resource: { buffer: this.particleBuffer } },
        { binding: 1, resource: { buffer: this.outputBuffer } },
        { binding: 2, resource: { buffer: this.uniformBuffer } }
      ]
    )

    // 调度计算
    const workgroups = Math.ceil(this.particleCount / 64)
    this.dispatch(workgroups)

    // 交换缓冲区
    const temp = this.particleBuffer
    this.particleBuffer = this.outputBuffer
    this.outputBuffer = temp
  }

  /**
   * 更新粒子 (WebGL2)
   */
  updateWebGL2(time, deltaTime) {
    if (!this.initialized || this.rendererType !== 'webgl2') {
      return
    }

    // 使用 GPGPU 更新
    const motionMaterial = new THREE.ShaderMaterial({
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getParticleMotionShader(),
      uniforms: {
        inputTexture: { value: this.positionTexture },
        time: { value: time },
        deltaTime: { value: deltaTime },
        gravity: { value: new THREE.Vector3(0, -9.8, 0) },
        damping: { value: 0.99 }
      }
    })

    const outputTexture = this.createTextureData(this.width, this.height)
    const outputBuffer = this.createRenderTarget(this.width, this.height)

    this.computeGPGPU(motionMaterial, this.positionTexture, outputBuffer, this.width, this.height)

    // 更新位置纹理
    this.positionTexture.dispose()
    this.positionTexture = outputTexture
  }

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

  getParticleMotionShader() {
    return `
      precision highp float;
      precision highp int;
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
        vec3 newPosition = position + gravity * deltaTime * deltaTime * 0.5;

        // 写入新数据
        gl_FragColor = vec4(newPosition, life);
      }
    `
  }

  dispose() {
    super.dispose()
  }
}
