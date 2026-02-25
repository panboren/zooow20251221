/**
 * 🌌 天体子午线 - 宇宙经纬网络特效（震撼运镜版）
 * 
 * 创作灵感：
 * - 融合全息网络的发光效果 + 量子涡旋的能量流动
 * - 超越级视觉：多层发光网格 + 粒子能量场 + 脉冲波纹
 * - 电影级运镜：轨道环绕、俯冲上升、螺旋穿越
 * 
 * 核心特性：
 * 1. 双层发光经纬网络（AdditiveBlending叠加发光）
 * 2. 3个旋转能量环（带脉冲动画）
 * 3. 10000个能量粒子（流动效果）
 * 4. 12个脉冲波纹（扩散动画）
 * 5. 全息球体核心（呼吸效果）
 * 6. 5层发光能量壳（同心球）
 * 
 * 运镜序列：
 * - 阶段1 (0-5s): 远景展开，网格显现
 * - 阶段2 (5-10s): 俯冲进入，穿越核心
 * - 阶段3 (10-15s): 环绕上升，全景展示
 * 
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

export default async function animateCelestialMeridian(props = {}, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  try {
    // 保存原始背景
    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x020205)
    scene.fog = new THREE.FogExp2(0x020205, 0.0008)

    // 初始相机位置
    camera.position.set(0, 50, 200)
    camera.lookAt(0, 0, 0)
    controls.enabled = false
    controls.autoRotate = false

    // ✨ 程序化生成粒子纹理
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)
      
      return new THREE.CanvasTexture(canvas)
    }
    
    const particleTexture = createParticleTexture()

    // 🔮 Simplex 3D 噪声函数
    const simplex3D = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }
    `

    // 🌐 全局组
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ==================== 5层发光能量壳 ====================
    const shellGroup = new THREE.Group()
    mainGroup.add(shellGroup)

    const shellGeometries = []
    const shellMaterials = []
    const shellColors = [0x00ffff, 0x0088ff, 0x8800ff, 0xff0088, 0xffaa00]

    for (let i = 0; i < 5; i++) {
      const radius = 25 + i * 15
      const geometry = new THREE.SphereGeometry(radius, 64, 64)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(shellColors[i]) },
          uOpacity: { value: 0 },
          uLayer: { value: i }
        },
        vertexShader: `
          precision highp float;
          uniform float uTime;
          uniform float uLayer;
          varying vec3 vNormal;
          varying vec3 vPosition;
          ${simplex3D}

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;

            vec3 pos = position;
            float noise = snoise(vec3(pos * 0.2 + uTime * 0.3 + uLayer));
            pos += normal * noise * (1.5 + uLayer * 0.5);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uLayer;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

            float pulse = sin(uTime * 2.0 + uLayer * 1.256) * 0.5 + 0.5;
            vec3 color = uColor * (1.0 + pulse * 0.6);
            color += fresnel * uColor * 0.5;

            float alpha = fresnel * uOpacity * (0.3 + pulse * 0.2);

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const shell = new THREE.Mesh(geometry, material)
      shellGroup.add(shell)
      shellGeometries.push(geometry)
      shellMaterials.push(material)
    }

    // ==================== 双层经纬网络 ====================
    const gridGroup = new THREE.Group()
    mainGroup.add(gridGroup)

    const innerGridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        uniform float uTime;
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        varying vec3 vPosition;

        void main() {
          vec3 baseColor = vec3(0.0, 1.0, 1.0);
          float alpha = uOpacity * (0.4 + 0.2 * sin(uTime * 3.0 + vPosition.y * 0.1));
          gl_FragColor = vec4(baseColor * 1.5, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const outerGridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        uniform float uTime;
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        varying vec3 vPosition;

        void main() {
          vec3 baseColor = vec3(0.8, 0.0, 1.0);
          float alpha = uOpacity * (0.3 + 0.15 * sin(uTime * 2.0 + vPosition.y * 0.05));
          gl_FragColor = vec4(baseColor * 1.3, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    function createSphereGrid(radius, material, meridians, parallels) {
      const group = new THREE.Group()

      for (let i = 0; i < meridians; i++) {
        const angle = (i / meridians) * Math.PI * 2
        const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI, false, angle)
        const points = curve.getPoints(64)
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)))
        const line = new THREE.Line(geometry, material)
        line.rotation.y = angle
        group.add(line)
      }

      for (let i = 1; i < parallels; i++) {
        const phi = (i / parallels) * Math.PI
        const ringRadius = Math.sin(phi) * radius
        const y = Math.cos(phi) * radius
        const ringGeometry = new THREE.TorusGeometry(ringRadius, 0.3, 8, 64)
        const ring = new THREE.Line(ringGeometry, material)
        ring.rotation.x = Math.PI / 2
        ring.position.y = y
        group.add(ring)
      }

      return group
    }

    const innerGrid = createSphereGrid(55, innerGridMaterial, 32, 16)
    const outerGrid = createSphereGrid(75, outerGridMaterial, 48, 24)
    gridGroup.add(innerGrid)
    gridGroup.add(outerGrid)

    // ==================== 3个旋转能量环 ====================
    const ringGroup = new THREE.Group()
    mainGroup.add(ringGroup)

    const energyRingGeometry = new THREE.TorusGeometry(90, 3, 16, 100)
    const ringColors = [0x00ffff, 0xff00ff, 0xffff00]
    const energyRings = []

    for (let i = 0; i < 3; i++) {
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(ringColors[i]) },
          uOpacity: { value: 0 },
          uOffset: { value: i }
        },
        vertexShader: `
          precision highp float;
          uniform float uTime;
          uniform float uOffset;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin(uTime * 4.0 + vUv.x * 30.0 + uOffset * 2.094) * 2.5;
            pos += normal * wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uOffset;
          varying vec2 vUv;

          void main() {
            float pulse = sin(uTime * 5.0 + vUv.x * 15.0 + uOffset * 2.094) * 0.5 + 0.5;
            vec3 color = uColor * (1.0 + pulse * 1.0);
            float alpha = uOpacity * (0.6 + pulse * 0.4);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const ring = new THREE.Mesh(energyRingGeometry, ringMaterial)
      ring.rotation.x = (i / 3) * Math.PI
      ring.rotation.y = (i / 3) * Math.PI * 0.7
      ringGroup.add(ring)
      energyRings.push(ring)
    }

    // ==================== 10000个能量粒子 ====================
    const particleCount = 10000
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    const particleSpeeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 30 + Math.random() * 90

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i * 3 + 2] = radius * Math.cos(phi)

      const hue = (i / particleCount) * 0.4 + 0.5
      const color = new THREE.Color().setHSL(hue, 1.0, 0.65)
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b

      particleSizes[i] = 2 + Math.random() * 5
      particleSpeeds[i] = 0.3 + Math.random() * 1.2
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: particleTexture },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        uniform float uTime;
        uniform float uOpacity;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;

          vec3 pos = position;
          float orbit = sin(uTime * size * 0.08 + position.y * 0.03) * 4.0;
          pos.y += orbit;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float pulse = sin(uTime * 4.0 + size) * 0.5 + 0.5;
          gl_PointSize = size * (500.0 / -mvPosition.z) * (0.7 + 0.5 * pulse);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        varying vec3 vColor;

        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          vec3 finalColor = vColor * 1.6;
          gl_FragColor = vec4(finalColor, texColor.a * uOpacity * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    mainGroup.add(particles)

    // ==================== 12个脉冲波纹 ====================
    const pulseGroup = new THREE.Group()
    mainGroup.add(pulseGroup)

    const pulseGeometry = new THREE.RingGeometry(0, 1, 64)
    const pulseMaterialBase = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        precision highp float;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 distVec = vUv - vec2(0.5);
          float dist = length(distVec) * 2.0;
          float alpha = smoothstep(dist, dist + 0.05, 1.0) * smoothstep(dist + 0.15, dist + 0.05, 1.0);
          vec3 color = vec3(0.0, 1.0, 1.0) * (1.0 - dist);
          gl_FragColor = vec4(color, alpha * 0.4);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const pulses = []
    for (let i = 0; i < 12; i++) {
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterialBase.clone())
      pulse.rotation.x = Math.random() * Math.PI
      pulse.rotation.y = Math.random() * Math.PI
      pulse.userData = {
        startTime: i * 1.25,
        duration: 3
      }
      pulseGroup.add(pulse)
      pulses.push(pulse)
    }

    // ==================== 运镜动画序列 ====================
    const tl = gsap.timeline({
      onComplete: () => {
        // 动画完成，清理资源
        cancelAnimationFrame(animationId)
        
        scene.remove(mainGroup)
        mainGroup.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (obj.material.uniforms && obj.material.uniforms.uTexture) {
              obj.material.uniforms.uTexture.value.dispose()
            }
            obj.material.dispose()
          }
        })

        scene.background = originalBackground
        scene.fog = originalFog

        if (onComplete) onComplete({ type: 'celestial-meridian' })

        if (controls) {
          controls.enabled = true
          controls.autoRotate = true
          controls.autoRotateSpeed = 2.0
          controls.update()
        }
      }
    })

    // 阶段1: 能量壳渐入 (0-2s)
    shellMaterials.forEach((mat, i) => {
      tl.to(mat.uniforms.uOpacity, {
        value: 0.25 + i * 0.1,
        duration: 1.5,
        ease: 'power2.out'
      }, i * 0.15)
    })

    // 阶段1: 网格渐入 (0-2s)
    tl.to([innerGridMaterial.uniforms.uOpacity, outerGridMaterial.uniforms.uOpacity], {
      value: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0)

    // 阶段1: 粒子渐入 (0-2s)
    tl.to(particleMaterial.uniforms.uOpacity, {
      value: 1,
      duration: 1.8,
      ease: 'power2.out'
    }, 0.3)

    // 阶段1: 能量环渐入 (0-2s)
    energyRings.forEach((ring, i) => {
      tl.to(ring.material.uniforms.uOpacity, {
        value: 1,
        duration: 1.5,
        ease: 'power2.out'
      }, 0.5 + i * 0.2)
    })

    // 运镜阶段1: 远景展开，相机环绕 (0-5s)
    tl.to(camera.position, {
      x: 100,
      y: 30,
      z: 150,
      duration: 5,
      ease: 'power2.inOut'
    }, 0)
    tl.to(camera.rotation, {
      x: 0,
      y: 0.5,
      z: 0,
      duration: 5,
      ease: 'power2.inOut'
    }, 0)

    // 运镜阶段2: 俯冲进入核心 (5-8s)
    tl.to(camera.position, {
      x: 0,
      y: -20,
      z: 60,
      duration: 3,
      ease: 'power3.inOut'
    }, 5)
    tl.to(camera.rotation, {
      x: 0.4,
      y: 0,
      z: 0,
      duration: 3,
      ease: 'power3.inOut'
    }, 5)

    // 运镜阶段3: 环绕上升，全景展示 (8-12s)
    tl.to(camera.position, {
      x: -80,
      y: 40,
      z: 120,
      duration: 4,
      ease: 'power2.inOut'
    }, 8)
    tl.to(camera.rotation, {
      x: -0.2,
      y: -0.6,
      z: 0,
      duration: 4,
      ease: 'power2.inOut'
    }, 8)

    // 运镜阶段4: 螺旋回归中心 (12-15s)
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 180,
      duration: 3,
      ease: 'power2.inOut'
    }, 12)
    tl.to(camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 3,
      ease: 'power2.inOut'
    }, 12)

    // 阶段3: 渐出 (13-15s)
    shellMaterials.forEach((mat, i) => {
      tl.to(mat.uniforms.uOpacity, {
        value: 0,
        duration: 1.5,
        ease: 'power2.in'
      }, 13 + i * 0.1)
    })

    tl.to([innerGridMaterial.uniforms.uOpacity, outerGridMaterial.uniforms.uOpacity], {
      value: 0,
      duration: 1.5,
      ease: 'power2.in'
    }, 13)

    tl.to(particleMaterial.uniforms.uOpacity, {
      value: 0,
      duration: 1.5,
      ease: 'power2.in'
    }, 13)

    energyRings.forEach((ring, i) => {
      tl.to(ring.material.uniforms.uOpacity, {
        value: 0,
        duration: 1.5,
        ease: 'power2.in'
      }, 13 + i * 0.15)
    })

    // ==================== 动画循环 ====================
    const clock = new THREE.Clock()
    const originalPositions = particlePositions.slice()
    let animationId = null

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // 更新能量壳
      shellMaterials.forEach((mat, i) => {
        mat.uniforms.uTime.value = time
      })

      // 更新网格
      innerGridMaterial.uniforms.uTime.value = time
      outerGridMaterial.uniforms.uTime.value = time
      innerGrid.rotation.y += 0.001
      outerGrid.rotation.y -= 0.0008

      // 更新能量环
      energyRings.forEach((ring, i) => {
        ring.rotation.x += 0.006 * (i + 1)
        ring.rotation.y += 0.01 * (i + 1)
        ring.material.uniforms.uTime.value = time
      })

      // 更新粒子
      const posAttr = particleGeometry.attributes.position
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const angle = time * particleSpeeds[i] * 0.05
        const radius = Math.sqrt(
          originalPositions[i3] * originalPositions[i3] +
          originalPositions[i3 + 2] * originalPositions[i3 + 2]
        )
        posAttr.array[i3] = Math.cos(angle) * radius
        posAttr.array[i3 + 2] = Math.sin(angle) * radius
      }
      posAttr.needsUpdate = true
      particleMaterial.uniforms.uTime.value = time
      particles.rotation.y += 0.0006

      // 更新脉冲波纹
      pulses.forEach((pulse) => {
        const elapsed = time - pulse.userData.startTime % 15
        const progress = (elapsed % pulse.userData.duration) / pulse.userData.duration
        if (progress < 1) {
          const scale = 20 + progress * 150
          pulse.scale.set(scale, scale, scale)
          pulse.visible = true
        } else {
          pulse.visible = false
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {}

  } catch (error) {
    console.error('天体子午线错误:', error)
    if (onError) onError(error)
    return () => {}
  }
}
