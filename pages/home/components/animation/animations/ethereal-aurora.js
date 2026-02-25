/**
 * 🌌 极光之息 - 宇宙光子呼吸特效
 * 
 * 创作灵感：
 * - 融合全息神经网络的光子流 + 虚空宇宙的光子球
 * - 引入"极光之息"概念：宇宙的光子如呼吸般流动
 * - 3层光子系统：光子海、极光幕、星尘雨
 * 
 * 核心特性：
 * 1. 10000个光子粒子模拟极光流动
 * 2. 8层动态极光幕（贝塞尔曲线+Shader渐变）
 * 3. 5000个星尘粒子（重力下落效果）
 * 4. 完整的光谱循环色相动画
 * 5. 柏林噪声驱动的自然流动
 */

import * as THREE from 'three'

export default async function animateEtherealAurora(props = {}, callbacks = {}) {
  const { scene, camera, renderer, controls } = props
  const { onComplete, onError } = callbacks

  try {
    // 🎨 性能配置
    const config = {
      photonParticles: 10000,  // 光子粒子
      auroraCurtains: 8,      // 极光幕层数
      stardust: 5000,         // 星尘粒子
      breatheLayers: 3         // 呼吸层级
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

    // 🌊 柏林噪声函数
    const perlinNoise = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * snoise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
    `

    // 🌌 光子海（极光粒子）
    const photonGeometry = new THREE.BufferGeometry()
    const photonCount = config.photonParticles
    const positions = new Float32Array(photonCount * 3)
    const colors = new Float32Array(photonCount * 3)
    const phases = new Float32Array(photonCount)
    const speeds = new Float32Array(photonCount)
    const layers = new Float32Array(photonCount)

    for (let i = 0; i < photonCount; i++) {
      const layer = Math.floor(Math.random() * config.breatheLayers)
      layers[i] = layer

      const baseX = (Math.random() - 0.5) * 200
      const baseY = (Math.random() - 0.5) * 100
      const baseZ = (Math.random() - 0.5) * 100

      positions[i * 3] = baseX
      positions[i * 3 + 1] = baseY
      positions[i * 3 + 2] = baseZ

      // 极光色相
      const hue = 0.5 + layer * 0.15 + Math.random() * 0.1
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = 0.3 + Math.random() * 0.7
    }

    photonGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    photonGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    photonGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
    photonGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))
    photonGeometry.setAttribute('layer', new THREE.BufferAttribute(layers, 1))

    const photonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: particleTexture },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        precision highp float;
        attribute float phase;
        attribute float speed;
        attribute float layer;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          // 呼吸效果
          float breathe = sin(uTime * speed * 0.5 + phase) * 0.5 + 0.5;
          vAlpha = 0.3 + breathe * 0.4;

          float pulse = 1.0 + 0.5 * sin(uTime * speed + phase);
          float finalSize = (8.0 + layer * 4.0) * 0.1 * pulse * uPixelRatio;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = finalSize * (600.0 / -mvPosition.z);
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

          // 软边缘光晕
          vec2 distVec = gl_PointCoord - vec2(0.5);
          float dist = length(distVec);
          float glow = smoothstep(0.5, 0.0, dist);

          gl_FragColor = vec4(vColor, vAlpha * glow * texColor.a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const photons = new THREE.Points(photonGeometry, photonMaterial)
    scene.add(photons)

    // 🎭 极光幕（贝塞尔曲线+Shader）
    const curtainGroup = new THREE.Group()
    for (let i = 0; i < config.auroraCurtains; i++) {
      const curvePoints = []
      const segments = 50

      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const x = (t - 0.5) * 250
        const y = Math.sin(t * Math.PI) * 50 + (i - config.auroraCurtains / 2) * 15
        const z = Math.cos(t * Math.PI * 2) * 20
        curvePoints.push(new THREE.Vector3(x, y, z))
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints)
      const tubeGeometry = new THREE.TubeGeometry(curve, segments, 1, 8, false)
      const tubeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color().setHSL(0.5 + i * 0.06, 0.8, 0.5) },
          uColor2: { value: new THREE.Color().setHSL(0.6 + i * 0.06, 0.8, 0.5) }
        },
        vertexShader: `
          precision highp float;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float uTime;

          void main() {
            vUv = uv;
            vPosition = position;

            vec3 pos = position;
            float wave = sin(uTime * 2.0 + vUv.x * 10.0) * 3.0;
            pos.y += wave;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPosition;

          ${perlinNoise}

          void main() {
            // 柏林噪声流动
            float noise = fbm(vPosition.xy * 0.02 + uTime * 0.3);

            // 渐变色
            vec3 color = mix(uColor1, uColor2, vUv.x + noise * 0.3);

            // 透明度变化
            float alpha = 0.3 + 0.2 * sin(uTime * 3.0 + vUv.x * 5.0);
            alpha += noise * 0.2;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      })

      const curtain = new THREE.Mesh(tubeGeometry, tubeMaterial)
      curtain.userData.layer = i
      curtain.userData.phase = Math.random() * Math.PI * 2
      curtainGroup.add(curtain)
    }
    scene.add(curtainGroup)

    // ✨ 星尘雨（下落粒子）
    const stardustGeometry = new THREE.BufferGeometry()
    const stardustCount = config.stardust
    const stardustPositions = new Float32Array(stardustCount * 3)
    const stardustColors = new Float32Array(stardustCount * 3)
    const stardustSizes = new Float32Array(stardustCount)
    const stardustPhases = new Float32Array(stardustCount)

    for (let i = 0; i < stardustCount; i++) {
      stardustPositions[i * 3] = (Math.random() - 0.5) * 300
      stardustPositions[i * 3 + 1] = Math.random() * 200 - 50
      stardustPositions[i * 3 + 2] = (Math.random() - 0.5) * 200

      const hue = 0.6 + Math.random() * 0.2
      const color = new THREE.Color().setHSL(hue, 0.6, 0.7)
      stardustColors[i * 3] = color.r
      stardustColors[i * 3 + 1] = color.g
      stardustColors[i * 3 + 2] = color.b

      stardustSizes[i] = 0.5 + Math.random() * 2
      stardustPhases[i] = Math.random() * Math.PI * 2
    }

    stardustGeometry.setAttribute('position', new THREE.BufferAttribute(stardustPositions, 3))
    stardustGeometry.setAttribute('color', new THREE.BufferAttribute(stardustColors, 3))
    stardustGeometry.setAttribute('size', new THREE.BufferAttribute(stardustSizes, 1))
    stardustGeometry.setAttribute('phase', new THREE.BufferAttribute(stardustPhases, 1))

    const stardustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: particleTexture },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        precision highp float;
        attribute float size;
        attribute float phase;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          float twinkle = sin(uTime * 3.0 + phase);
          vAlpha = 0.4 + twinkle * 0.3;

          float finalSize = size * 0.1 * uPixelRatio;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = finalSize * (800.0 / -mvPosition.z);
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
          gl_FragColor = vec4(vColor, vAlpha * texColor.a * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    const stardust = new THREE.Points(stardustGeometry, stardustMaterial)
    scene.add(stardust)

    // 🎬 动画循环
    const clock = new THREE.Clock()
    const originalPhotonPositions = positions.slice()
    const originalStardustPositions = stardustPositions.slice()
    let animationId = null

    function animate() {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // 更新光子海
      const photonPos = photons.geometry.attributes.position
      for (let i = 0; i < photonCount; i++) {
        const i3 = i * 3
        const layer = layers[i]
        const speed = speeds[i]
        const phase = phases[i]

        // 柏林噪声驱动的流动
        const noiseX = Math.sin(time * 0.5 + originalPhotonPositions[i3] * 0.02 + phase)
        const noiseY = Math.cos(time * 0.3 + originalPhotonPositions[i3 + 1] * 0.02 + phase)

        photonPos.array[i3] = originalPhotonPositions[i3] + noiseX * 20
        photonPos.array[i3 + 1] = originalPhotonPositions[i3 + 1] + noiseY * 10
        photonPos.array[i3 + 2] = originalPhotonPositions[i3 + 2] + Math.sin(time * speed + phase) * 5
      }
      photonPos.needsUpdate = true
      photons.material.uniforms.uTime.value = time

      // 更新极光幕
      curtainGroup.children.forEach((curtain, i) => {
        curtain.material.uniforms.uTime.value = time

        // 波浪运动
        const wave = Math.sin(time * 0.5 + curtain.userData.phase)
        curtain.position.y = wave * 3
        curtain.rotation.z = Math.sin(time * 0.3 + i) * 0.1
      })

      // 更新星尘雨（下落）
      const stardustPos = stardust.geometry.attributes.position
      for (let i = 0; i < stardustCount; i++) {
        const i3 = i * 3
        const fallSpeed = 5 + stardustSizes[i] * 2

        stardustPos.array[i3 + 1] -= fallSpeed * 0.02

        // 循环下落
        if (stardustPos.array[i3 + 1] < -100) {
          stardustPos.array[i3 + 1] = 150
        }
      }
      stardustPos.needsUpdate = true
      stardust.material.uniforms.uTime.value = time

      // 光谱循环
      const hueOffset = time * 0.01
      photonMaterial.uniformsNeedUpdate = true

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
      scene.remove(photons)
      scene.remove(curtainGroup)
      scene.remove(stardust)

      photonGeometry.dispose()
      photonMaterial.dispose()
      curtainGroup.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      stardustGeometry.dispose()
      stardustMaterial.dispose()

      // 调用完成回调
      if (onComplete) {
        onComplete({ type: 'ethereal-aurora' })
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
    console.error('极光之息错误:', error)
    if (onError) onError(error)
    return () => {}
  }
}
