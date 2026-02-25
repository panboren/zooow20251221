/**
 * 🌌 全息时空织机 - 量子编织终极特效
 * 
 * 创作灵感：
 * - 融合时空裂缝的扭曲场 + 维度折叠的莫比乌斯带
 * - 引入"时空织机"概念：在宇宙中编织时间和空间
 * - 3层独立编织系统：时间流、空间网、命运线
 * 
 * 核心特性：
 * 1. 3个同心Torus Knot作为时空梭
 * 2. 5000条时空弦（粒子流）在梭子间穿梭
 * 3. 12层同心圆环作为织机框架
 * 4. 8个量子纠缠节点作为"命运锚点"
 * 5. 完整的Simplex噪声驱动的时空扭曲场
 */

import * as THREE from 'three'

export default async function animateHolographicLoom(props = {}, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  try {
    // 🎨 性能配置
    const config = {
      timeShuttles: 3,      // 时空梭数量
     时空弦数量: 5000,       // 粒子流
      loomRings: 12,        // 织机圆环
      fateAnchors: 8,       // 命运锚点
      weaveLayers: 5        // 编织层级
    }

    // ✨ 程序化生成粒子纹理（不依赖外部图片）
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
      
      const texture = new THREE.CanvasTexture(canvas)
      return texture
    }
    
    const particleTexture = createParticleTexture()

    // 🔮 Simplex 3D 噪声函数（完整实现）
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
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
    `

    // 🕸️ 织机框架（同心圆环）
    const loomGroup = new THREE.Group()
    for (let i = 0; i < config.loomRings; i++) {
      const ringGeometry = new THREE.TorusGeometry(60 + i * 15, 0.5, 16, 100)
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(0.6 + i * 0.04, 0.8, 0.5) }
        },
        vertexShader: `
          precision highp float;
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;

          ${simplex3D}

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;

            vec3 pos = position;
            float warp = snoise(vec3(pos.x * 0.02, pos.y * 0.02, uTime * 0.5));
            pos += normal * warp * 2.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uColor;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;

          ${simplex3D}

          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
            float noise = snoise(vec3(vPosition.xy * 0.05, uTime * 0.3));

            vec3 color = uColor;
            color += vec3(0.3) * fresnel;
            color += vec3(0.2) * noise;

            float pulse = 0.4 + 0.3 * sin(uTime * 2.0 + vPosition.x * 0.01);

            gl_FragColor = vec4(color, pulse + fresnel * 0.3);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.userData.originalScale = 1
      ring.userData.rotationSpeed = (i % 2 === 0 ? 1 : -1) * 0.001 * (i + 1)
      loomGroup.add(ring)
    }
    scene.add(loomGroup)

    // 🧵 时空梭（Torus Knot）
    const shuttleGroup = new THREE.Group()
    for (let i = 0; i < config.timeShuttles; i++) {
      const shuttleGeometry = new THREE.TorusKnotGeometry(20 + i * 10, 3, 150, 20, 2, 3)
      const shuttleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(0.1 + i * 0.15, 0.9, 0.6) }
        },
        vertexShader: `
          precision highp float;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vNoise;
          uniform float uTime;

          ${simplex3D}

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vNoise = snoise(position * 0.03 + uTime * 0.5);

            vec3 pos = position;
            pos += normal * vNoise * 5.0;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uColor;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vNoise;

          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

            vec3 color = uColor;
            color += vec3(0.4) * fresnel;
            color += vec3(vNoise * 0.3);

            float pulse = 0.5 + 0.3 * sin(uTime * 3.0);

            gl_FragColor = vec4(color, pulse + fresnel * 0.4);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      })
      const shuttle = new THREE.Mesh(shuttleGeometry, shuttleMaterial)
      shuttle.userData.rotationSpeed = (i % 2 === 0 ? 1 : -1) * 0.003 * (i + 1)
      shuttleGroup.add(shuttle)
    }
    scene.add(shuttleGroup)

    // ✨ 时空弦（粒子流）
    const strandGeometry = new THREE.BufferGeometry()
    const strandCount = config.时空弦数量
    const positions = new Float32Array(strandCount * 3)
    const colors = new Float32Array(strandCount * 3)
    const phases = new Float32Array(strandCount)
    const frequencies = new Float32Array(strandCount)
    const amplitudes = new Float32Array(strandCount)

    for (let i = 0; i < strandCount; i++) {
      const angle = (i / strandCount) * Math.PI * 2
      const radius = 80 + Math.random() * 40
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const hue = 0.55 + Math.random() * 0.3
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      phases[i] = Math.random() * Math.PI * 2
      frequencies[i] = 0.5 + Math.random() * 1.5
      amplitudes[i] = 10 + Math.random() * 20
    }

    strandGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    strandGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    strandGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
    strandGeometry.setAttribute('frequency', new THREE.BufferAttribute(frequencies, 1))
    strandGeometry.setAttribute('amplitude', new THREE.BufferAttribute(amplitudes, 1))

    const strandMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: particleTexture },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        precision highp float;
        attribute float phase;
        attribute float frequency;
        attribute float amplitude;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          // 粒子波动
          float wave = sin(uTime * frequency + phase);
          vAlpha = 0.5 + 0.3 * wave;

          float pulse = 1.0 + 0.5 * sin(uTime * 2.0 + phase);
          float finalSize = amplitude * 0.15 * pulse * uPixelRatio;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = finalSize * (400.0 / -mvPosition.z);
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

    const strands = new THREE.Points(strandGeometry, strandMaterial)
    scene.add(strands)

    // ⚓ 命运锚点（量子纠缠节点）
    const anchorGroup = new THREE.Group()
    for (let i = 0; i < config.fateAnchors; i++) {
      const anchorGeometry = new THREE.OctahedronGeometry(5, 2)
      const anchorMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(i / config.fateAnchors, 0.9, 0.5) }
        },
        vertexShader: `
          precision highp float;
          varying vec3 vNormal;
          varying float vPulse;
          uniform float uTime;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPulse = sin(uTime * 2.0);

            vec3 pos = position;
            pos += normal * vPulse * 1.5;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uColor;
          uniform float uTime;
          varying vec3 vNormal;
          varying float vPulse;

          void main() {
            vec3 viewDir = normalize(cameraPosition - vec3(0.0));
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);

            vec3 color = uColor;
            color += vec3(0.5) * fresnel;
            color += vec3(0.3 * vPulse);

            gl_FragColor = vec4(color, 0.7 + fresnel * 0.3);
          }
        `,
        transparent: true
      })
      const anchor = new THREE.Mesh(anchorGeometry, anchorMaterial)
      const angle = (i / config.fateAnchors) * Math.PI * 2
      anchor.position.set(
        Math.cos(angle) * 100,
        (Math.random() - 0.5) * 40,
        Math.sin(angle) * 100
      )
      anchor.userData.orbitAngle = angle
      anchor.userData.orbitSpeed = 0.0005 + Math.random() * 0.001
      anchor.userData.orbitRadius = 100
      anchorGroup.add(anchor)
    }
    scene.add(anchorGroup)

    // 🎬 动画循环
    const clock = new THREE.Clock()
    const originalPositions = positions.slice()
    let animationId = null

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // 更新织机圆环
      loomGroup.children.forEach((ring, i) => {
        ring.rotation.z += ring.userData.rotationSpeed
        ring.material.uniforms.uTime.value = time
        const scale = ring.userData.originalScale + Math.sin(time * 0.5 + i) * 0.05
        ring.scale.setScalar(scale)
      })

      // 更新时空梭
      shuttleGroup.children.forEach((shuttle, i) => {
        shuttle.rotation.x += shuttle.userData.rotationSpeed
        shuttle.rotation.y += shuttle.userData.rotationSpeed * 0.7
        shuttle.material.uniforms.uTime.value = time
      })

      // 更新时空弦
      const posAttr = strands.geometry.attributes.position
      for (let i = 0; i < strandCount; i++) {
        const i3 = i * 3
        const angle = Math.atan2(originalPositions[i3 + 2], originalPositions[i3])
        const baseX = originalPositions[i3]
        const baseY = originalPositions[i3 + 1]
        const baseZ = originalPositions[i3 + 2]

        // 织机运动
        const weaveX = Math.sin(time * frequencies[i] + phases[i]) * amplitudes[i] * 0.3
        const weaveY = Math.cos(time * frequencies[i] * 0.7 + phases[i]) * amplitudes[i] * 0.2

        posAttr.array[i3] = baseX + weaveX
        posAttr.array[i3 + 1] = baseY + weaveY + Math.sin(time + angle) * 5
        posAttr.array[i3 + 2] = baseZ + Math.cos(time * frequencies[i] + phases[i]) * amplitudes[i] * 0.2
      }
      posAttr.needsUpdate = true
      strands.material.uniforms.uTime.value = time
      strands.rotation.y = time * 0.05

      // 更新命运锚点
      anchorGroup.children.forEach(anchor => {
        anchor.userData.orbitAngle += anchor.userData.orbitSpeed
        anchor.position.x = Math.cos(anchor.userData.orbitAngle) * anchor.userData.orbitRadius
        anchor.position.z = Math.sin(anchor.userData.orbitAngle) * anchor.userData.orbitRadius
        anchor.rotation.x += 0.01
        anchor.rotation.y += 0.01
        anchor.material.uniforms.uTime.value = time
      })

      renderer.render(scene, camera)
    }

    animate()

    // 启动动画后，等待一段时间完成展示
    setTimeout(() => {
      // 停止动画循环
      if (animationId) {
        cancelAnimationFrame(animationId)
      }

      // 清理所有资源
      scene.remove(loomGroup)
      scene.remove(shuttleGroup)
      scene.remove(strands)
      scene.remove(anchorGroup)
      loomGroup.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      shuttleGroup.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      anchorGroup.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      strandGeometry.dispose()
      strandMaterial.dispose()

      // 调用完成回调
      if (onComplete) {
        onComplete({ type: 'holographic-loom' })
      }

      // 重新启用控制器并启动自动旋转
      if (controls) {
        controls.enabled = true
        controls.autoRotate = true
        controls.autoRotateSpeed = 2.0
        controls.update()
      }
    }, 15000) // 15秒后完成动画

    // 返回一个空的清理函数（因为动画自己会清理）
    return () => {}

  } catch (error) {
    console.error('时空织机错误:', error)
    if (onError) onError(error)
    return () => {}
  }
}
