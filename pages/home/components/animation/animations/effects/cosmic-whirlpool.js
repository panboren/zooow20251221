/**
 * effects/cosmic-whirlpool.js
 * 宇宙漩涡特效
 * 主题：深空中的能量漩涡，带有引力透镜效果和星尘
 */

import * as THREE from 'three'

/**
 * 创建宇宙漩涡
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 漩涡对象
 */
export function createCosmicWhirlpool(scene, options = {}) {
  const {
    particleCount = 5000,
    armCount = 3,
    colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3]
  } = options

  const whirlpoolGroup = new THREE.Group()
  let time = 0
  let isDestroyed = false

  // 创建漩涡着色器
  const whirlpoolShader = {
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(colors[0]) },
      color2: { value: new THREE.Color(colors[1]) }
    },
    vertexShader: `
      uniform float time;
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = customColor;

        vec3 pos = position;

        // 漩涡旋转
        float angle = time * 0.5 + atan(pos.z, pos.x);
        float radius = length(pos.xz);
        float spiral = sin(radius * 0.3 - time * 2.0) * 2.0;

        pos.x = radius * cos(angle) + spiral * cos(angle + 1.57);
        pos.z = radius * sin(angle) + spiral * sin(angle + 1.57);
        pos.y += sin(radius * 0.2 + time) * 3.0;

        // 基于距离的透明度
        float dist = length(pos);
        vAlpha = smoothstep(40.0, 10.0, dist);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // 圆形粒子
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);

        if (dist > 0.5) discard;

        // 边缘柔化
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        alpha *= vAlpha;

        // 辉光效果
        float glow = 1.0 - dist * 2.0;
        vec3 finalColor = vColor + vec3(glow * 0.3);

        gl_FragColor = vec4(finalColor, alpha * 0.8);
      }
    `
  }

  // 创建粒子几何体
  const particleGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    // 螺旋分布
    const arm = i % armCount
    const t = i / particleCount
    const radius = t * 35 + Math.random() * 5
    const angle = (arm / armCount) * Math.PI * 2 + t * Math.PI * 4

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = Math.sin(angle) * radius

    // 颜色渐变
    const colorIndex = Math.floor(t * colors.length) % colors.length
    const color = new THREE.Color(colors[colorIndex])
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // 大小变化
    sizes[i] = 2 + Math.random() * 3
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(whirlpoolShader.uniforms),
    vertexShader: whirlpoolShader.vertexShader,
    fragmentShader: whirlpoolShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  whirlpoolGroup.add(particleSystem)

  // 创建中心黑洞
  const blackHoleGeometry = new THREE.SphereGeometry(2, 32, 32)
  const blackHoleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
        vec3 color = vec3(0.0, 0.0, 0.0) + vec3(0.5, 0.2, 0.8) * fresnel;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  })

  const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial)
  whirlpoolGroup.add(blackHole)

  // 创建吸积盘
  const accretionGeometry = new THREE.RingGeometry(3, 8, 64)
  const accretionMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      innerColor: { value: new THREE.Color(0xff6b6b) },
      outerColor: { value: new THREE.Color(0x4ecdc4) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 innerColor;
      uniform vec3 outerColor;
      varying vec2 vUv;
      void main() {
        vec2 center = vUv - vec2(0.5);
        float radius = length(center);
        float angle = atan(center.y, center.x);

        // 旋转效果
        float rotate = angle + time + 1.0 / (radius + 0.1);

        // 颜色混合
        vec3 color = mix(innerColor, outerColor, radius * 2.0);

        // 脉冲效果
        float pulse = sin(rotate * 10.0) * 0.5 + 0.5;
        color += pulse * 0.2;

        // 边缘渐变
        float alpha = smoothstep(0.5, 0.3, radius) * smoothstep(0.0, 0.1, radius);

        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })

  const accretionDisk = new THREE.Mesh(accretionGeometry, accretionMaterial)
  accretionDisk.rotation.x = Math.PI / 2
  whirlpoolGroup.add(accretionDisk)

  scene.add(whirlpoolGroup)

  return {
    whirlpoolGroup,
    particleSystem,
    blackHole,
    accretionDisk,
    time: 0,
    isDestroyed: false,

    update(deltaTime, elapsed) {
      if (this.isDestroyed) return

      this.time += deltaTime

      // 更新粒子系统
      particleMaterial.uniforms.time.value = this.time

      // 更新黑洞
      blackHole.material.uniforms.time.value = this.time
      blackHole.rotation.y += deltaTime * 0.5

      // 更新吸积盘
      accretionDisk.material.uniforms.time.value = this.time

      // 粒子重新分布
      const posArray = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        let x = posArray[i3]
        let y = posArray[i3 + 1]
        let z = posArray[i3 + 2]

        // 向中心吸引
        const radius = Math.sqrt(x * x + z * z)
        const angle = Math.atan2(z, x)
        const attraction = 5 * deltaTime / (radius + 1)

        x -= Math.cos(angle) * attraction
        z -= Math.sin(angle) * attraction

        // 如果太靠近中心，重置到外部
        if (radius < 3) {
          const newRadius = 30 + Math.random() * 10
          const newAngle = angle + Math.PI * 2
          x = Math.cos(newAngle) * newRadius
          z = Math.sin(newAngle) * newRadius
        }

        posArray[i3] = x
        posArray[i3 + 1] = y
        posArray[i3 + 2] = z
      }
      particleGeometry.attributes.position.needsUpdate = true
    },

    animate(duration, onComplete) {
      const tl = { progress: 0 }
      return gsap.to(tl, {
        progress: 1,
        duration,
        ease: 'power2.in',
        onUpdate: () => {
          blackHole.scale.setScalar(1 + tl.progress * 0.5)
          accretionDisk.scale.setScalar(1 + tl.progress * 0.8)
        },
        onComplete
      })
    },

    destroy() {
      this.isDestroyed = true
      particleMaterial.dispose()
      particleGeometry.dispose()
      blackHole.material.dispose()
      blackHole.geometry.dispose()
      accretionDisk.material.dispose()
      accretionDisk.geometry.dispose()
      scene.remove(whirlpoolGroup)
    }
  }
}
