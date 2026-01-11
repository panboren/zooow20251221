/**
 * effects/liquid-metal.js
 * 液态金属特效
 * 主题：像水银般的流动金属球体，带有镜面反射和动态变形
 */

import * as THREE from 'three'

/**
 * 创建液态金属
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 液态金属对象
 */
export function createLiquidMetal(scene, options = {}) {
  const {
    sphereCount = 5,
    baseSize = 3,
    color = 0x888888
  } = options

  const metalGroup = new THREE.Group()
  const spheres = []

  // 创建自定义着色器
  const metalShader = {
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(color) },
      metalness: { value: 1.0 },
      roughness: { value: 0.2 }
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

        // 动态变形
        float noise1 = sin(pos.x * 2.0 + time * 2.0) * 0.1;
        float noise2 = sin(pos.y * 2.0 + time * 1.5) * 0.1;
        float noise3 = sin(pos.z * 2.0 + time * 1.8) * 0.1;

        pos += normal * (noise1 + noise2 + noise3);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform float metalness;
      uniform float roughness;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // 菲涅尔效应
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);

        // 环境反射模拟
        vec3 reflectDir = reflect(-viewDir, normal);
        float reflectIntensity = max(0.0, reflectDir.y);

        // 混合颜色
        vec3 metalColor = baseColor;
        metalColor += vec3(0.8, 0.9, 1.0) * reflectIntensity * 0.3;
        metalColor += fresnel * vec3(1.0, 1.0, 1.0) * 0.5;

        // 高光
        vec3 lightDir = normalize(vec3(1.0, 2.0, 3.0));
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

        metalColor += spec * vec3(1.0, 1.0, 1.0) * 0.8;

        gl_FragColor = vec4(metalColor, 0.95);
      }
    `
  }

  // 创建多个金属球
  for (let i = 0; i < sphereCount; i++) {
    const size = baseSize + Math.random() * 2

    const geometry = new THREE.IcosahedronGeometry(size, 4)
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(metalShader.uniforms),
      vertexShader: metalShader.vertexShader,
      fragmentShader: metalShader.fragmentShader,
      transparent: true
    })

    const sphere = new THREE.Mesh(geometry, material)

    // 随机位置
    sphere.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 20
    )

    // 运动参数
    sphere.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 1,
        z: (Math.random() - 0.5) * 2
      },
      rotationSpeed: {
        x: Math.random() * 0.02,
        y: Math.random() * 0.02
      },
      baseScale: 1,
      phase: Math.random() * Math.PI * 2
    }

    metalGroup.add(sphere)
    spheres.push(sphere)
  }

  // 添加地面反射平面
  const reflectionGeometry = new THREE.PlaneGeometry(80, 80)
  const reflectionMaterial = new THREE.ShaderMaterial({
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
        float alpha = smoothstep(0.4, 0.0, dist);
        vec3 color = vec3(0.1, 0.15, 0.2);
        gl_FragColor = vec4(color, alpha * 0.3);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  })

  const reflectionPlane = new THREE.Mesh(reflectionGeometry, reflectionMaterial)
  reflectionPlane.rotation.x = -Math.PI / 2
  reflectionPlane.position.y = -15
  metalGroup.add(reflectionPlane)

  scene.add(metalGroup)

  return {
    metalGroup,
    spheres,
    reflectionPlane,
    time: 0,
    isDestroyed: false,

    update(deltaTime, elapsed) {
      if (this.isDestroyed) return

      this.time += deltaTime

      // 更新金属球
      spheres.forEach(sphere => {
        sphere.material.uniforms.time.value = this.time

        // 旋转
        sphere.rotation.x += sphere.userData.rotationSpeed.x
        sphere.rotation.y += sphere.userData.rotationSpeed.y

        // 移动
        sphere.position.x += sphere.userData.velocity.x * deltaTime
        sphere.position.y += sphere.userData.velocity.y * deltaTime
        sphere.position.z += sphere.userData.velocity.z * deltaTime

        // 边界反弹
        if (Math.abs(sphere.position.x) > 25) sphere.userData.velocity.x *= -1
        if (Math.abs(sphere.position.y) > 15) sphere.userData.velocity.y *= -1
        if (Math.abs(sphere.position.z) > 25) sphere.userData.velocity.z *= -1

        // 呼吸效果
        const breathe = 1 + Math.sin(this.time * 2 + sphere.userData.phase) * 0.05
        sphere.scale.setScalar(sphere.userData.baseScale * breathe)
      })

      // 更新反射平面
      reflectionPlane.material.uniforms.time.value = this.time
    },

    animate(duration, onComplete) {
      const tl = { progress: 0 }
      return gsap.to(tl, {
        progress: 1,
        duration,
        ease: 'elastic.out(1, 0.5)',
        onUpdate: () => {
          spheres.forEach((sphere, i) => {
            const phase = (i / spheres.length) * Math.PI * 2
            sphere.position.y = Math.sin(tl.progress * Math.PI + phase) * 10
          })
        },
        onComplete
      })
    },

    destroy() {
      this.isDestroyed = true
      spheres.forEach(sphere => {
        sphere.material.dispose()
        sphere.geometry.dispose()
      })
      reflectionPlane.material.dispose()
      reflectionPlane.geometry.dispose()
      scene.remove(metalGroup)
    }
  }
}
