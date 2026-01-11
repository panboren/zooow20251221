/**
 * effects/crystalline-forest.js
 * 水晶森林特效
 * 主题：像宝石般的水晶晶体从地面生长，带有光影折射效果
 */

import * as THREE from 'three'

/**
 * 创建水晶森林
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 水晶森林对象
 */
export function createCrystallineForest(scene, options = {}) {
  const {
    crystalCount = 30,
    maxHeight = 20,
    baseRadius = 30
  } = options

  const forestGroup = new THREE.Group()
  const crystals = []

  // 水晶颜色
  const crystalColors = [
    0x00ffff,  // 青色
    0xff69b4,  // 粉色
    0x9370db,  // 紫色
    0x00ff7f,  // 绿色
    0xffd700,  // 金色
    0x1e90ff   // 蓝色
  ]

  // 创建水晶着色器
  const crystalShader = {
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(0x00ffff) },
      opacity: { value: 0.8 }
    },
    vertexShader: `
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        vec3 pos = position;

        // 晶体生长动画
        pos.y *= smoothstep(0.0, 0.5, time);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform float opacity;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // 内部发光
        float glow = 1.0 - abs(dot(normal, viewDir));
        vec3 interiorColor = baseColor * (glow * 0.5 + 0.5);

        // 边缘高光
        float rim = pow(1.0 - abs(dot(normal, viewDir)), 4.0);
        vec3 rimColor = vec3(1.0) * rim * 0.8;

        // 棱镜效果
        float prism = sin(vPosition.y * 0.5 + time) * 0.5 + 0.5;
        vec3 prismColor = baseColor * prism * 0.3;

        // 最终颜色
        vec3 finalColor = interiorColor + rimColor + prismColor;

        // 透明度渐变
        float alpha = opacity * (0.6 + glow * 0.4);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  }

  // 创建水晶
  for (let i = 0; i < crystalCount; i++) {
    const height = 5 + Math.random() * (maxHeight - 5)
    const radius = 0.5 + Math.random() * 1.5
    const color = crystalColors[Math.floor(Math.random() * crystalColors.length)]

    // 创建水晶几何体 - 多面体
    const segments = 6 + Math.floor(Math.random() * 4)
    const geometry = new THREE.CylinderGeometry(0, radius, height, segments, 1, false)

    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(crystalShader.uniforms),
      vertexShader: crystalShader.vertexShader,
      fragmentShader: crystalShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    })

    material.uniforms.baseColor.value.setHex(color)
    material.uniforms.time.value = 0

    const crystal = new THREE.Mesh(geometry, material)

    // 随机位置
    const angle = (i / crystalCount) * Math.PI * 2 + Math.random() * 0.5
    const dist = Math.random() * baseRadius
    crystal.position.x = Math.cos(angle) * dist
    crystal.position.z = Math.sin(angle) * dist
    crystal.position.y = -10

    // 随机旋转
    crystal.rotation.y = Math.random() * Math.PI * 2
    crystal.rotation.z = (Math.random() - 0.5) * 0.3

    // 存储原始状态
    crystal.userData = {
      baseHeight: height,
      baseColor: color,
      growthDelay: Math.random() * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01
    }

    forestGroup.add(crystal)
    crystals.push(crystal)
  }

  // 添加地面
  const groundGeometry = new THREE.CircleGeometry(baseRadius + 10, 64)
  const groundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
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
      varying vec2 vUv;
      void main() {
        float dist = distance(vUv, vec2(0.5));
        float grid = sin(vUv.x * 50.0) * sin(vUv.y * 50.0);
        vec3 color = mix(vec3(0.02, 0.05, 0.1), vec3(0.05, 0.1, 0.15), grid * 0.1);
        float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
        gl_FragColor = vec4(color, alpha * 0.5);
      }
    `,
    transparent: true
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -10
  forestGroup.add(ground)

  scene.add(forestGroup)

  return {
    forestGroup,
    crystals,
    ground,
    time: 0,
    isDestroyed: false,

    update(deltaTime, elapsed) {
      if (this.isDestroyed) return

      this.time += deltaTime

      // 更新水晶
      crystals.forEach(crystal => {
        const data = crystal.userData

        // 缓慢旋转
        crystal.rotation.y += data.rotationSpeed

        // 生长动画
        const growthTime = Math.max(0, this.time - data.growthDelay)
        const growthProgress = Math.min(1, growthTime / 3)
        crystal.material.uniforms.time.value = growthProgress

        // 脉冲发光
        const pulse = Math.sin(this.time * 2 + data.growthDelay) * 0.1 + 0.9
        crystal.material.uniforms.opacity.value = 0.8 * pulse
      })

      // 更新地面
      ground.material.uniforms.time.value = this.time
    },

    animate(duration, onComplete) {
      const tl = { progress: 0 }
      return gsap.to(tl, {
        progress: 1,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          crystals.forEach((crystal, i) => {
            const phase = (i / crystals.length) * Math.PI * 2
            crystal.scale.y = 0.1 + Math.sin(tl.progress * Math.PI * 0.5 + phase) * 0.9
          })
        },
        onComplete
      })
    },

    destroy() {
      this.isDestroyed = true
      crystals.forEach(crystal => {
        crystal.material.dispose()
        crystal.geometry.dispose()
      })
      ground.material.dispose()
      ground.geometry.dispose()
      scene.remove(forestGroup)
    }
  }
}
