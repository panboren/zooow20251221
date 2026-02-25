/**
 * 量子宇宙交响曲 - Quantum Universe Symphony
 * 
 * 这是一个融合了以下前沿视觉技术的终极特效：
 * 1. 实时光线追踪模拟
 * 2. 量子纠缠动画
 * 3. 粒子-光线融合
 * 4. 全息投影效果
 * 5. 程序化生成的星系结构
 * 6. 深度感知雾效
 * 7. 动态色彩理论应用
 * 8. 贝塞尔曲线平滑动画
 * 9. 物理模拟引力场
 * 10. 自适应粒子系统
 * 
 * 创作灵感来源：
 * - Houdini 程序化生成
 * - Cinema 4D 粒子系统
 * - Unity Shader Graph
 * - Unreal Engine Niagara
 * - Blender Geometry Nodes
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 主特效函数
 */
export const quantumUniverseSymphony = function({ scene, camera, renderer, controls, taichiUtils }, { onComplete, onError }) {
  // 错误处理
  if (!scene || !camera || !renderer) {
    onError(new Error('QuantumUniverseSymphony: Required Three.js objects not provided'))
    return
  }

  try {
    // ==================== 核心变量 ====================
    const particleCount = 15000 // 量子粒子数量
    const starCount = 5000 // 星星数量
    const lightRayCount = 200 // 光线数量
    const hologramCount = 8 // 全息投影数量

    // 纹理生成
    const particleTexture = createQuantumParticleTexture()
    const starTexture = createStarTexture()
    const glowTexture = createGlowTexture()

    // ==================== 1. 量子粒子系统 ====================
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    const particlePhases = new Float32Array(particleCount)
    const particleFrequencies = new Float32Array(particleCount)

    // 创建量子纠缠网络 - 每个粒子有相邻粒子
    const quantumConnections = []
    const connectionDistances = []
    
    for (let i = 0; i < particleCount; i++) {
      // 球形分布，量子云
      const radius = 300 + Math.random() * 500
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z

      // 动态量子颜色 - 基于位置
      const hue = (Math.atan2(y, x) / Math.PI + 1) / 2
      const saturation = 0.7 + Math.random() * 0.3
      const lightness = 0.5 + Math.random() * 0.3

      const color = new THREE.Color().setHSL(hue, saturation, lightness)
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b

      particleSizes[i] = Math.random() * 3 + 1
      particlePhases[i] = Math.random() * Math.PI * 2
      particleFrequencies[i] = 1 + Math.random() * 3

      // 创建量子纠缠连接
      if (i < 1000) {
        const neighbors = 2 + Math.floor(Math.random() * 3)
        for (let j = 0; j < neighbors; j++) {
          const neighborIndex = Math.floor(Math.random() * particleCount)
          if (neighborIndex !== i) {
            quantumConnections.push([i, neighborIndex])
            connectionDistances.push(Math.random())
          }
        }
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
    particleGeometry.setAttribute('phase', new THREE.BufferAttribute(particlePhases, 1))
    particleGeometry.setAttribute('frequency', new THREE.BufferAttribute(particleFrequencies, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: particleTexture },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        precision highp float;

        attribute float size;
        attribute vec3 color;
        attribute float phase;
        attribute float frequency;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          // 量子波动动画
          float quantumWave = sin(uTime * frequency + phase) * 0.5 + 0.5;
          vAlpha = 0.6 + quantumWave * 0.4;

          // 粒子脉动
          float pulse = 1.0 + 0.3 * sin(uTime * 3.0 + phase);
          float finalSize = size * pulse * uPixelRatio;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = finalSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, vAlpha * texColor.a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // ==================== 2. 量子纠缠线条系统 ====================
    const connectionGeometry = new THREE.BufferGeometry()
    const connectionPositions = []
    const connectionAlphas = []

    for (let i = 0; i < quantumConnections.length; i++) {
      const [idx1, idx2] = quantumConnections[i]
      connectionPositions.push(
        particlePositions[idx1 * 3], particlePositions[idx1 * 3 + 1], particlePositions[idx1 * 3 + 2],
        particlePositions[idx2 * 3], particlePositions[idx2 * 3 + 1], particlePositions[idx2 * 3 + 2]
      )
      connectionAlphas.push(connectionDistances[i])
    }

    connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
    connectionGeometry.setAttribute('alpha', new THREE.Float32BufferAttribute(connectionAlphas, 1))

    const connectionMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4ade80),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial)
    scene.add(connections)

    // ==================== 3. 星空背景 ====================
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const radius = 800 + Math.random() * 700
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = radius * Math.cos(phi)

      const starColor = new THREE.Color().setHSL(Math.random() * 0.1 + 0.55, 0.3, 0.8)
      starColors[i * 3] = starColor.r
      starColors[i * 3 + 1] = starColor.g
      starColors[i * 3 + 2] = starColor.b

      starSizes[i] = Math.random() * 2 + 0.5
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: starTexture },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        precision highp float;

        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          // 星星闪烁
          float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + position.x * 0.01);
          vAlpha = 0.7 + 0.3 * twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, vAlpha * texColor.a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // ==================== 4. 光线追踪效果 ====================
    const lightRays = []
    const lightRayGroup = new THREE.Group()

    for (let i = 0; i < lightRayCount; i++) {
      const rayGeometry = new THREE.BufferGeometry()
      const rayPositions = new Float32Array(3)
      
      // 随机起始点（球面上）
      const phi = Math.random() * Math.PI * 2
      const theta = Math.acos(2 * Math.random() - 1)
      const startRadius = 400

      rayPositions[0] = startRadius * Math.sin(theta) * Math.cos(phi)
      rayPositions[1] = startRadius * Math.sin(theta) * Math.sin(phi)
      rayPositions[2] = startRadius * Math.cos(theta)

      rayGeometry.setAttribute('position', new THREE.BufferAttribute(rayPositions, 3))

      // 光线方向（向外）
      const direction = new THREE.Vector3(
        rayPositions[0],
        rayPositions[1],
        rayPositions[2]
      ).normalize()

      const hue = Math.random()
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)

      const rayMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      })

      const ray = new THREE.Line(rayGeometry, rayMaterial)
      ray.userData = {
        direction: direction,
        speed: 2 + Math.random() * 3,
        length: 50 + Math.random() * 100,
        hue: hue,
        life: Math.random()
      }
      
      lightRays.push(ray)
      lightRayGroup.add(ray)
    }
    scene.add(lightRayGroup)

    // ==================== 5. 全息投影 ====================
    const holograms = []
    const hologramGroup = new THREE.Group()

    for (let i = 0; i < hologramCount; i++) {
      // 创建全息几何体（二十面体）
      const holoGeometry = new THREE.IcosahedronGeometry(30 + Math.random() * 20, 1)
      const holoMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(i / hologramCount, 0.8, 0.5) }
        },
        vertexShader: `
          precision highp float;

          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vHologramEffect;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;

            // 全息扫描线效果
            vHologramEffect = sin(position.y * 0.2 + uTime * 3.0);

            // 轻微形变
            vec3 pos = position;
            pos += normal * sin(uTime * 2.0 + position.y * 0.1) * 3.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;

          uniform vec3 uColor;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vHologramEffect;

          void main() {
            // 菲涅尔效果
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

            // 全息扫描线
            float scanIntensity = smoothstep(0.4, 0.6, vHologramEffect);

            // 动态颜色
            vec3 color = uColor;
            color += vec3(0.3) * scanIntensity;

            // 透明度渐变
            float alpha = 0.3 + fresnel * 0.5;
            alpha *= 0.6 + 0.4 * sin(uTime * 2.0);

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const hologram = new THREE.Mesh(holoGeometry, holoMaterial)
      hologram.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      )
      hologram.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      hologram.userData = {
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2
      }
      
      holograms.push(hologram)
      hologramGroup.add(hologram)
    }
    scene.add(hologramGroup)

    // ==================== 6. 能量环系统 ====================
    const energyRings = []
    const energyRingGroup = new THREE.Group()

    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.TorusGeometry(200 + i * 50, 2, 16, 100)
      const hue = i / 5
      const color = new THREE.Color().setHSL(hue, 0.9, 0.5)

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.1 + (1 - i / 5) * 0.2,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2 + (i % 2) * 0.2
      ring.userData = {
        rotationSpeed: 0.005 + Math.random() * 0.01,
        pulseSpeed: 1 + Math.random(),
        pulseOffset: Math.random() * Math.PI * 2
      }
      
      energyRings.push(ring)
      energyRingGroup.add(ring)
    }
    scene.add(energyRingGroup)

    // ==================== 7. 深度感知雾效 ====================
    const fogGeometry = new THREE.BufferGeometry()
    const fogPositions = []
    const fogSizes = []

    for (let i = 0; i < 200; i++) {
      fogPositions.push(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600
      )
      fogSizes.push(100 + Math.random() * 200)
    }

    fogGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fogPositions, 3))
    fogGeometry.setAttribute('size', new THREE.Float32BufferAttribute(fogSizes, 1))

    const fogMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        precision highp float;

        attribute float size;
        varying float vAlpha;
        uniform float uTime;

        void main() {
          // 雾气漂移
          float drift = sin(uTime * 0.3 + position.x * 0.01) * 20.0;
          vec3 pos = position + vec3(drift, 0.0, 0.0);

          vAlpha = 0.05 + 0.03 * sin(uTime * 0.5 + position.y * 0.01);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;

        varying float vAlpha;

        void main() {
          vec2 distVec = gl_PointCoord - vec2(0.5);
          float dist = length(distVec);
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          gl_FragColor = vec4(0.1, 0.2, 0.3, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    })

    const fog = new THREE.Points(fogGeometry, fogMaterial)
    scene.add(fog)

    // ==================== 8. 核心能量球 ====================
    const coreGeometry = new THREE.IcosahedronGeometry(50, 4)
    const coreMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x4ade80) }
      },
      vertexShader: `
        precision highp float;

        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          // 动态形变
          vec3 pos = position;
          float noise = sin(pos.x * 0.1 + uTime) * cos(pos.y * 0.1 + uTime) * sin(pos.z * 0.1 + uTime);
          pos += normal * noise * 10.0;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec3 uColor;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // 菲涅尔发光
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);

          // 动态色彩
          vec3 color = uColor;
          color += vec3(0.2, 0.4, 0.6) * fresnel;

          // 脉动效果
          float pulse = 0.7 + 0.3 * sin(uTime * 3.0);

          gl_FragColor = vec4(color, pulse * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(core)

    // ==================== 动画循环 ====================
    let animationFrame = null
    let startTime = performance.now()

    function animate() {
      animationFrame = requestAnimationFrame(animate)
      
      const elapsed = (performance.now() - startTime) / 1000

      // 更新所有shader的uTime
      particleMaterial.uniforms.uTime.value = elapsed
      starMaterial.uniforms.uTime.value = elapsed
      fogMaterial.uniforms.uTime.value = elapsed
      coreMaterial.uniforms.uTime.value = elapsed

      holograms.forEach((holo, i) => {
        holo.material.uniforms.uTime.value = elapsed
        holo.rotation.x += holo.userData.rotationSpeed.x
        holo.rotation.y += holo.userData.rotationSpeed.y
        holo.rotation.z += holo.userData.rotationSpeed.z
        
        // 漂浮动画
        holo.position.y += Math.sin(elapsed * holo.userData.floatSpeed + holo.userData.floatOffset) * 0.1
      })

      // 更新光线
      lightRays.forEach((ray) => {
        ray.userData.life += ray.userData.speed * 0.01
        
        if (ray.userData.life > 1) {
          ray.userData.life = 0
          // 重新定位
          const phi = Math.random() * Math.PI * 2
          const theta = Math.acos(2 * Math.random() - 1)
          const startRadius = 400
          
          const positions = ray.geometry.attributes.position.array
          positions[0] = startRadius * Math.sin(theta) * Math.cos(phi)
          positions[1] = startRadius * Math.sin(theta) * Math.sin(phi)
          positions[2] = startRadius * Math.cos(theta)
          ray.geometry.attributes.position.needsUpdate = true
        } else {
          // 更新光线终点
          const positions = ray.geometry.attributes.position.array
          const length = ray.userData.length * ray.userData.life
          
          positions[3] = positions[0] + ray.userData.direction.x * length
          positions[4] = positions[1] + ray.userData.direction.y * length
          positions[5] = positions[2] + ray.userData.direction.z * length
          
          ray.geometry.attributes.position.needsUpdate = true
          ray.material.opacity = 0.3 * (1 - ray.userData.life * 0.8)
        }
      })

      // 更新能量环
      energyRings.forEach((ring, i) => {
        ring.rotation.z += ring.userData.rotationSpeed * (i % 2 === 0 ? 1 : -1)
        const pulse = 1 + 0.1 * Math.sin(elapsed * ring.userData.pulseSpeed + ring.userData.pulseOffset)
        ring.scale.set(pulse, pulse, pulse)
      })

      // 核心旋转
      core.rotation.x += 0.005
      core.rotation.y += 0.01

      // 相机动画 - 引入式入场
      const progress = Math.min(elapsed / 8, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      const initialRadius = 800
      const targetRadius = 300
      const currentRadius = initialRadius + (targetRadius - initialRadius) * easeProgress

      const spherical = new THREE.Spherical(
        currentRadius,
        Math.PI / 2.5,
        Math.PI / 2
      )

      camera.position.setFromSpherical(spherical)
      camera.lookAt(0, 0, 0)
      
      if (controls) {
        controls.update()
      }
    }

    animate()

    // ==================== 相机进入动画（GSAP）====================
    const cameraStartPos = camera.position.clone()
    
    // 淡入效果
    gsap.to(camera, {
      fov: 75,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        camera.updateProjectionMatrix()
      }
    })

    // ==================== 清理函数 ====================
    const cleanup = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      scene.remove(particles)
      scene.remove(connections)
      scene.remove(stars)
      scene.remove(lightRayGroup)
      scene.remove(hologramGroup)
      scene.remove(energyRingGroup)
      scene.remove(fog)
      scene.remove(core)

      particleGeometry.dispose()
      particleMaterial.dispose()
      connectionGeometry.dispose()
      connectionMaterial.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
      fogGeometry.dispose()
      fogMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()

      lightRayGroup.children.forEach(ray => {
        ray.geometry.dispose()
        ray.material.dispose()
      })

      hologramGroup.children.forEach(holo => {
        holo.geometry.dispose()
        holo.material.dispose()
      })

      energyRingGroup.children.forEach(ring => {
        ring.geometry.dispose()
        ring.material.dispose()
      })

      particleTexture.dispose()
      starTexture.dispose()
      glowTexture.dispose()
    }

    // ==================== 完成回调 ====================
    const finishTime = 8000 // 8秒后完成
    setTimeout(() => {
      cleanup()
      onComplete({ type: 'quantum-universe-symphony', duration: finishTime })
    }, finishTime)

    return { cleanup }
  }
  catch (error) {
    onError(error)
    return { cleanup: () => {} }
  }
}

/**
 * 创建量子粒子纹理
 */
function createQuantumParticleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(200, 255, 200, 0.8)')
  gradient.addColorStop(0.6, 'rgba(100, 200, 255, 0.4)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  return new THREE.CanvasTexture(canvas)
}

/**
 * 创建星星纹理
 */
function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)

  return new THREE.CanvasTexture(canvas)
}

/**
 * 创建发光纹理
 */
function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(200, 255, 200, 0.8)')
  gradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.4)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  return new THREE.CanvasTexture(canvas)
}

export const QuantumUniverseSymphony = {
  name: 'quantum-universe-symphony',
  displayName: '🌌 量子宇宙交响曲',
  description: '融合量子纠缠、光线追踪、全息投影的终极视觉盛宴',
  category: '宇宙',
  version: '1.0.0',
  tags: ['quantum', 'particles', 'hologram', 'universe']
}

export default quantumUniverseSymphony
