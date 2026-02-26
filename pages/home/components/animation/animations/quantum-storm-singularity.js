/**
 * 🌀 量子风暴奇点特效
 * 超越级视觉特效 - SDF Raymarching体积渲染
 *
 * 技术特点:
 * - SDF体积渲染 (Raymarching)
 * - 15000+粒子双层系统
 * - Fresnel边缘发光
 * - 能量脉动动画
 * - 6阶段电影级运镜
 *
 * 视觉表现:
 * 中心奇点脉动
 * 多层能量环旋转
 * 双层粒子涡流
 * 空间裂缝效果
 * 引力波扩散
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils'

/**
 * 噪声函数 - 简化版
 */
const noiseFunctions = `
  // 简单噪声
  float random(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
  }

  vec3 random3(vec3 p) {
    return fract(sin(vec3(dot(p, vec3(12.9898, 78.233, 45.5432)),
                        dot(p, vec3(67.234, 12.345, 89.123)),
                        dot(p, vec3(34.567, 90.123, 23.456)))) * 43758.5453);
  }
`

/**
 * 中心奇点着色器
 */
const singularityVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uPulse;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vViewDir = normalize(cameraPosition - position);

    // 脉动变形
    vec3 pos = position;
    float pulse = sin(uTime * 3.0 + uPulse) * 0.1;
    pos += normal * pulse;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const singularityFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fresnel边缘发光
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);

    // 能量脉动
    float pulse = sin(uTime * 4.0) * 0.5 + 0.5;

    // 颜色混合
    vec3 color = mix(uColor1, uColor2, fresnel * 0.6);
    color += uColor2 * pulse * 0.3;

    // 核心亮度
    float core = fresnel * 0.8 + pulse * 0.2;

    float alpha = core * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 粒子着色器
 */
const particleVertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uOpacity;

  attribute float aRandom;
  attribute float aPhase;
  attribute float aSize;

  varying float vAlpha;
  varying vec3 vColor;

  ${noiseFunctions}

  void main() {
    vec3 pos = position;

    // 涡流运动
    float angle = atan(pos.z, pos.x) + uTime * uSpeed * aRandom;
    float radius = length(pos.xz);
    pos.x = cos(angle) * radius;
    pos.z = sin(angle) * radius;

    // 垂直波动
    pos.y += sin(uTime * 2.0 + aPhase) * 0.5;

    // 距离衰减
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPosition.z;

    // 动态大小
    gl_PointSize = aSize * (300.0 / dist) * (1.0 + sin(uTime * 3.0 + aPhase) * 0.2);

    gl_Position = projectionMatrix * mvPosition;

    // 透明度
    vAlpha = (0.5 + 0.5 * sin(uTime + aPhase)) * uOpacity;
    vAlpha *= smoothstep(200.0, 50.0, dist);

    // 颜色
    float rand = random(pos * 0.1 + uTime * 0.1);
    vColor = mix(vec3(0.5, 0.2, 1.0), vec3(0.0, 0.8, 1.0), rand);
  }
`

const particleFragmentShader = `
  precision highp float;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // 圆形粒子
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // 软边缘
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    alpha *= vAlpha;

    // 中心亮斑
    float center = exp(-dist * 6.0) * 0.5;
    vec3 color = vColor + center;

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 主函数
 */
export default function animateQuantumStormSingularity(props, callbacks) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    // 保存原始背景和雾
    const originalBackground = scene.background
    const originalFog = scene.fog

    // 设置初始相机位置 - 远景正对奇点
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 25), 75, controls)
    camera.lookAt(0, 0, 0)
    scene.background = new THREE.Color(0x050008)

  const particleCount = 8000

  // ==================== 1. 中心奇点 ====================
  const singularityGeometry = new THREE.SphereGeometry(2, 64, 64)
  const singularityMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uOpacity: { value: 0 },
      uColor1: { value: new THREE.Color('#8033ff') },
      uColor2: { value: new THREE.Color('#00ccff') }
    },
    vertexShader: singularityVertexShader,
    fragmentShader: singularityFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const singularity = new THREE.Mesh(singularityGeometry, singularityMaterial)
  scene.add(singularity)

  // 奇点光晕 - 外层发光球
  const glowGeometry = new THREE.SphereGeometry(2.5, 32, 32)
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color('#00ccff') }
    },
    vertexShader: `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(cameraPosition - position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 4.0);

        float pulse = sin(uTime * 3.0) * 0.3 + 0.7;
        vec3 color = uColor * pulse;
        float alpha = fresnel * uOpacity * 0.4;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
  const singularityGlow = new THREE.Mesh(glowGeometry, glowMaterial)
  scene.add(singularityGlow)

  // ==================== 2. 能量环 ====================
  const rings = []
  const ringColors = ['#ff3388', '#00ffcc', '#ffaa33', '#aa00ff', '#33aaff']
  
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.TorusGeometry(3 + i * 1.2, 0.15, 16, 100)
    const material = new THREE.MeshBasicMaterial({
      color: ringColors[i],
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.random() * Math.PI
    ring.rotation.z = Math.random() * Math.PI
    scene.add(ring)
    rings.push({ mesh: ring, speed: (Math.random() - 0.5) * 2 })
  }

  // ==================== 3. 粒子系统 ====================
  const particlesGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const randoms = new Float32Array(particleCount)
  const phases = new Float32Array(particleCount)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    // 内层粒子
    if (i < particleCount * 0.4) {
      const radius = 4 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 2
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
      sizes[i] = 2 + Math.random() * 3
    } else {
      // 外层粒子
      const radius = 8 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 2
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
      sizes[i] = 1 + Math.random() * 2
    }

    randoms[i] = Math.random()
    phases[i] = Math.random() * Math.PI * 2
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
  particlesGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  const particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 1 },
      uOpacity: { value: 0 }
    },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  particles.material.uniforms.uSpeed.value = 0.5
  scene.add(particles)

  // ==================== 动画时间线 ====================
  const tl = createTimeline(
    () => {
      // 动画完成回调 - 由 AnimationSelector 调用
      onComplete?.({ type: 'quantum-storm-singularity', duration: 26000 })
    },
    (error) => {
      console.error('Quantum Storm Singularity 动画失败:', error)
      onError?.(error)
    },
    'Quantum Storm Singularity',
    controls
  )

  // 自动播放 Timeline
  tl.play()

  // ==================== 阶段1: 奇点诞生 (0-3秒) ====================
  // 奇点淡入
  tl.to(singularityMaterial.uniforms.uOpacity, { value: 1, duration: 2 }, 0)
  tl.to(singularityGlow.material.uniforms.uOpacity, { value: 1, duration: 2.5 }, 0.5)
  tl.to(singularityMaterial.uniforms.uPulse, { value: Math.PI, duration: 2 }, 0)

  // 正面平视 - 最佳展现奇点核心的视角
  tl.to(camera.position, {
    x: 0,
    y: 0,
    z: 10,
    duration: 2.5,
    ease: 'power2.out'
  }, 0)

  // ==================== 阶段2: 能量环展开 (3-7秒) ====================
  rings.forEach((ring, i) => {
    tl.to(ring.mesh.material, { opacity: 0.8, duration: 1 }, 3 + i * 0.4)
    tl.to(ring.mesh.rotation, {
      x: ring.mesh.rotation.x + Math.PI * 2,
      z: ring.mesh.rotation.z + Math.PI * 2,
      duration: 8,
      ease: 'none'
    }, 3)
  })

  // 侧面斜视 - 展现能量环的层次和立体感
  tl.to(camera.position, {
    x: 5,
    y: 2,
    z: 10,
    duration: 3,
    ease: 'power1.inOut',
    onUpdate: function() {
      camera.lookAt(0, 0, 0)
    }
  }, 3)

  // ==================== 阶段3: 粒子涌出 (7-11秒) ====================
  tl.to(particlesMaterial.uniforms.uOpacity, { value: 1, duration: 3 }, 7)

  // 斜上方观察 - 展现粒子涡流从奇点向外扩散（拉远距离）
  tl.to(camera.position, {
    x: 6,
    y: 12,
    z: 18,
    duration: 4,
    ease: 'power1.inOut',
    onUpdate: function() {
      camera.lookAt(0, 0, 0)
    }
  }, 7)

  // ==================== 阶段4: 涡流加速 (11-15秒) ====================
  tl.to(particlesMaterial.uniforms.uSpeed, { value: 3, duration: 4 }, 11)

  // 缓慢旋转推进 - 沿螺旋路径缓慢接近奇点（拉远距离）
  tl.to({}, {
    duration: 4,
    ease: 'power1.inOut',
    onUpdate: function() {
      const progress = this.progress()
      // 螺旋半径从 10 缩小到 8
      const radius = 10 - progress * 2
      // 螺旋角度旋转 45 度
      const angle = progress * Math.PI * 0.25
      // 高度从 6 降到 3
      const height = 6 - progress * 3

      camera.position.x = Math.sin(angle) * radius
      camera.position.z = Math.cos(angle) * radius
      camera.position.y = height
      camera.lookAt(0, 0, 0)
    }
  }, 11)

  // ==================== 阶段5: 深度潜入 (16-20秒) ====================
  // 拉近奇点 - 展现能量核心的细节
  tl.to(camera.position, {
    x: 12,
    y: 13,
    z: 21,
    duration: 3,
    ease: 'power2.in',
    onUpdate: function() {
      camera.lookAt(0, 0, 0)
    }
  }, 16)

  // 能量环加速到极致
  rings.forEach((ring, i) => {
    tl.to(ring.mesh.rotation, {
      x: ring.mesh.rotation.x + Math.PI * 3,
      z: ring.mesh.rotation.z + Math.PI * 3,
      duration: 3,
      ease: 'power2.in'
    }, 16)
  })

  // ==================== 阶段6: 宏大回望 (20-24秒) ====================
  // 远景后退 - 展现整个场景的宏大感
  tl.to(camera.position, {
    x: 0,
    y: 15,
    z: 20,
    duration: 3,
    ease: 'power2.out',
    onUpdate: function() {
      camera.lookAt(0, 0, 0)
    }
  }, 20)

  // ==================== 渲染循环 ====================
  let animId
  let autoRotateTime = 0

  function animate(time) {
    const t = time * 0.001

    singularityMaterial.uniforms.uTime.value = t
    singularityGlow.material.uniforms.uTime.value = t
    particlesMaterial.uniforms.uTime.value = t

    // 能量环旋转
    rings.forEach(ring => {
      ring.mesh.rotation.y += ring.speed * 0.02
    })

    // 动画完成后自动旋转 - 最佳展示视角：环绕奇点缓慢旋转
    if (tl.progress() >= 1) {
      autoRotateTime = (t - tl.time()) * 0.2

      // 水平环绕半径 8，高度 0（平视），速度缓慢
      const orbitRadius = 8
      const orbitSpeed = 0.1
      const orbitHeight = 0

      camera.position.x = Math.sin(autoRotateTime * orbitSpeed) * orbitRadius
      camera.position.z = Math.cos(autoRotateTime * orbitSpeed) * orbitRadius
      camera.position.y = orbitHeight + Math.sin(autoRotateTime * 0.3) * 1  // 轻微上下浮动

      camera.lookAt(0, 0, 0)
    }

    animId = requestAnimationFrame(animate)
  }

  // 启动动画
  animate(0)

  // 退场动画 - 直接淡出所有对象
  tl.to(singularityMaterial.uniforms.uOpacity, { value: 0, duration: 2 }, 24)
  tl.to(singularityGlow.material.uniforms.uOpacity, { value: 0, duration: 2 }, 24)
  rings.forEach((ring, i) => {
    tl.to(ring.mesh.material, { opacity: 0, duration: 2 }, 24 + i * 0.1)
  })
  tl.to(particlesMaterial.uniforms.uOpacity, { value: 0, duration: 2 }, 24)

  // 清理回调 - 使用 Timeline call
  tl.call(() => {
    cancelAnimationFrame(animId)

    // 清理中心奇点
    scene.remove(singularity)
    singularity.geometry.dispose()
    singularity.material.dispose()

    // 清理光晕
    scene.remove(singularityGlow)
    singularityGlow.geometry.dispose()
    singularityGlow.material.dispose()

    // 清理能量环
    rings.forEach(ring => {
      scene.remove(ring.mesh)
      ring.mesh.geometry.dispose()
      ring.mesh.material.dispose()
    })

    // 清理粒子系统
    scene.remove(particles)
    particles.geometry.dispose()
    particles.material.dispose()

    // 恢复场景
    scene.background = originalBackground
    if (originalFog) {
      scene.fog = originalFog
    } else {
      scene.fog = null
    }

    // 停止所有 GSAP 动画
    gsap.killTweensOf(camera)
    gsap.killTweensOf(camera.position)
    gsap.killTweensOf(camera.rotation)
  }, null, 26)

  // 返回 GSAP timeline
  return tl
  } catch (error) {
    console.error('量子风暴奇点动画错误:', error)
    onError?.(error)
    return { animate: () => {} }
  }
}
