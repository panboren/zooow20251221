/**
 * effects/ethereal-aurora.js
 * 空灵极光特效
 * 主题：北极光般的梦幻光幕，带有粒子闪烁和渐变色彩
 */

import * as THREE from 'three'

/**
 * 创建空灵极光
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 极光对象
 */
export function createEtherealAurora(scene, options = {}) {
  const {
    ribbonCount = 8,
    particleCount = 2000,
    colors = [0x00ffff, 0xff00ff, 0x00ff00, 0x0000ff]
  } = options

  const auroraGroup = new THREE.Group()
  const ribbons = []
  const particles = []

  // 创建自定义着色器材质
  const auroraShader = {
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(colors[0]) },
      color2: { value: new THREE.Color(colors[1]) },
      opacity: { value: 0.6 }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // 波浪变形
        float wave1 = sin(pos.x * 0.5 + time) * 5.0;
        float wave2 = sin(pos.y * 0.3 + time * 1.5) * 3.0;
        float wave3 = sin((pos.x + pos.y) * 0.2 + time * 0.5) * 4.0;

        pos.z += wave1 + wave2 + wave3;
        vElevation = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float opacity;
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        // 创建渐变
        float gradient = smoothstep(-10.0, 10.0, vElevation);
        vec3 finalColor = mix(color1, color2, gradient);

        // 添加发光效果
        float glow = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
        finalColor += glow * 0.2;

        // 边缘淡出
        float alpha = opacity * (1.0 - abs(vUv.x - 0.5) * 1.5);
        alpha *= (1.0 - abs(vUv.y - 0.5) * 0.5);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  }

  // 创建光带
  for (let i = 0; i < ribbonCount; i++) {
    const geometry = new THREE.PlaneGeometry(60, 20, 50, 20)
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(auroraShader.uniforms),
      vertexShader: auroraShader.vertexShader,
      fragmentShader: auroraShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    // 为每条光带设置不同的颜色
    material.uniforms.color1.value.setHex(colors[i % colors.length])
    material.uniforms.color2.value.setHex(colors[(i + 1) % colors.length])
    material.uniforms.opacity.value = 0.4 + Math.random() * 0.3

    const ribbon = new THREE.Mesh(geometry, material)
    ribbon.rotation.x = Math.PI * 0.3
    ribbon.rotation.z = (Math.random() - 0.5) * 0.5
    ribbon.position.y = 20 + (Math.random() - 0.5) * 10
    ribbon.position.x = (Math.random() - 0.5) * 20
    ribbon.position.z = (Math.random() - 0.5) * 20

    auroraGroup.add(ribbon)
    ribbons.push(ribbon)
  }

  // 创建闪烁粒子
  const particleGeometry = new THREE.BufferGeometry()
  const particlePositions = new Float32Array(particleCount * 3)
  const particleSizes = new Float32Array(particleCount)
  const particleColors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 80
    particlePositions[i * 3 + 1] = Math.random() * 40
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80
    particleSizes[i] = Math.random() * 3 + 1

    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
    particleColors[i * 3] = color.r
    particleColors[i * 3 + 1] = color.g
    particleColors[i * 3 + 2] = color.b
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  auroraGroup.add(particleSystem)

  scene.add(auroraGroup)

  return {
    auroraGroup,
    ribbons,
    particleSystem,
    time: 0,
    isDestroyed: false,

    update(deltaTime, elapsed) {
      if (this.isDestroyed) return

      this.time += deltaTime

      // 更新光带
      ribbons.forEach((ribbon, i) => {
        ribbon.material.uniforms.time.value = this.time
        ribbon.rotation.z += deltaTime * 0.05 * (i % 2 === 0 ? 1 : -1)
      })

      // 更新粒子
      const positions = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        // 粒子缓慢漂浮
        positions[i * 3 + 1] += Math.sin(this.time + i) * 0.02
        positions[i * 3] += Math.cos(this.time * 0.5 + i) * 0.01

        // 边界循环
        if (positions[i * 3 + 1] > 50) positions[i * 3 + 1] = 0
        if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 50
      }
      particleGeometry.attributes.position.needsUpdate = true
    },

    animate(duration, onComplete) {
      const tl = { progress: 0 }
      const animation = gsap.to(tl, {
        progress: 1,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          // 光带扩散
          ribbons.forEach(ribbon => {
            ribbon.scale.setScalar(1 + tl.progress * 0.5)
            ribbon.material.uniforms.opacity.value = 0.4 + tl.progress * 0.4
          })
        },
        onComplete
      })
      return animation
    },

    destroy() {
      this.isDestroyed = true
      ribbons.forEach(ribbon => {
        ribbon.material.dispose()
        ribbon.geometry.dispose()
      })
      particleSystem.material.dispose()
      particleSystem.geometry.dispose()
      scene.remove(auroraGroup)
    }
  }
}
