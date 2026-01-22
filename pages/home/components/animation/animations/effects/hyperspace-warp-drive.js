/**
 * effects/hyperspace-warp-drive.js
 * 超空间曲速驱动特效（优化版）
 * 光速穿越、空间扭曲、视觉冲击
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建超空间曲速驱动
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 曲速对象
 */
export function createHyperspaceWarpDrive(scene, options = {}) {
  const {
    starCount = 5000,  // 减少星星数量
    tunnelLength = 200
  } = options

  // 拉伸的星星
  const starGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const speeds = new Float32Array(starCount)
  const originalPos = []

  for (let i = 0; i < starCount; i++) {
    // 在隧道中随机分布
    positions[i * 3] = (Math.random() - 0.5) * 100
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * tunnelLength

    const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    speeds[i] = 50 + Math.random() * 100
    originalPos.push({
      x: positions[i * 3],
      y: positions[i * 3 + 1],
      z: positions[i * 3 + 2]
    })
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  starGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1))

  const starMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // 曲速隧道 - 使用简化着色器
  const tunnelGeometry = new THREE.CylinderGeometry(40, 40, tunnelLength, 32, 20, true)
  const tunnelMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 1 },
      uColor: { value: new THREE.Color(0x00aaff) }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSpeed;
      varying vec2 vUv;
      varying float vDist;

      void main() {
        vUv = uv;
        vec3 pos = position;
        vDist = uv.y;

        // 螺旋扭曲效果 - 简化计算
        float twist = uv.y * uSpeed * 0.3 + uTime * 3.0;
        float angle = atan(pos.z, pos.x) + twist;

        // 呼吸效果 - 降低频率
        float breathe = sin(uTime * 5.0 + uv.y * 5.0) * 3.0;
        pos.x = cos(angle) * (40.0 + breathe);
        pos.z = sin(angle) * (40.0 + breathe);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSpeed;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying float vDist;

      void main() {
        // 条纹效果 - 简化计算
        float stripe = sin(vUv.y * 30.0 + uTime * 10.0 * uSpeed) * 0.5 + 0.5;
        float alpha = stripe * 0.2;

        // 边缘发光
        float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
        alpha *= edge;

        // 距离衰减
        float fade = 1.0 - smoothstep(0.3, 0.7, abs(vDist - 0.5) * 2.0);
        alpha *= fade;

        // 颜色变化
        vec3 color = uColor * (1.0 + stripe * 0.3);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial)
  tunnel.rotation.x = Math.PI / 2
  tunnel.scale.setScalar(0)
  scene.add(tunnel)

  // 能量场 - 使用简化着色器
  const energyFieldGeometry = new THREE.SphereGeometry(30, 32, 32)
  const energyFieldMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        vec3 pos = position;
        // 波浪效果 - 降低频率
        float wave = sin(uTime * 8.0 + length(pos) * 0.3) * 1.5;
        pos += normal * wave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vPos;

      void main() {
        // 菲涅尔效果
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

        // 脉冲效果
        float pulse = sin(uTime * 5.0) * 0.3 + 0.7;

        vec3 color = uColor * pulse * fresnel;

        gl_FragColor = vec4(color, fresnel * 0.5);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const energyField = new THREE.Mesh(energyFieldGeometry, energyFieldMaterial)
  energyField.scale.setScalar(0)
  scene.add(energyField)

  // 速度线 - 减少数量
  const speedLines = []
  const speedLineCount = 20  // 从30减少到20

  for (let i = 0; i < speedLineCount; i++) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(6)  // 2个点 * 3个坐标
    positions[0] = (Math.random() - 0.5) * 80
    positions[1] = (Math.random() - 0.5) * 80
    positions[2] = -100
    positions[3] = positions[0]
    positions[4] = positions[1]
    positions[5] = 0

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })

    const line = new THREE.Line(geometry, material)
    line.visible = false
    scene.add(line)
    speedLines.push(line)
  }

  let currentSpeed = 0
  let updateCounter = 0  // 更新计数器

  return {
    stars,
    starGeometry,
    tunnel,
    energyField,
    speedLines,
    update(deltaTime, time) {
      updateCounter++

      // 更新速度
      const targetSpeed = currentSpeed
      currentSpeed += (targetSpeed - tunnelMaterial.uniforms.uSpeed.value) * deltaTime * 2
      tunnelMaterial.uniforms.uSpeed.value = currentSpeed

      tunnelMaterial.uniforms.uTime.value = time
      energyField.material.uniforms.uTime.value = time

      // 优化：每3帧更新一次星星位置
      if (updateCounter % 3 === 0) {
        const pos = starGeometry.attributes.position.array
        for (let i = 0; i < starCount; i++) {
          if (starMaterial.opacity > 0) {
            // 向观察者移动
            pos[i * 3 + 2] += speeds[i] * deltaTime * currentSpeed

            // 重置到远端
            if (pos[i * 3 + 2] > tunnelLength / 2) {
              pos[i * 3 + 2] = -tunnelLength / 2
              pos[i * 3] = (Math.random() - 0.5) * 100
              pos[i * 3 + 1] = (Math.random() - 0.5) * 100
            }
          }
        }
        starGeometry.attributes.position.needsUpdate = true
      }

      // 优化：每5帧更新一次速度线
      if (updateCounter % 5 === 0) {
        speedLines.forEach((line, i) => {
          if (line.visible && line.material.opacity > 0) {
            line.position.z += 200 * deltaTime * currentSpeed  // 降低速度
            line.material.opacity -= deltaTime * 0.3  // 降低衰减率
            if (line.position.z > 100 || line.material.opacity <= 0) {
              line.visible = false
              line.position.z = -100
              line.position.x = (Math.random() - 0.5) * 80
              line.position.y = (Math.random() - 0.5) * 80
            }
          } else if (Math.random() < 0.05 * currentSpeed) {  // 降低出现概率
            line.visible = true
            line.material.opacity = 0.6
          }
        })
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 阶段1: 初始准备
      gsap.to(tunnel.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.5,
        ease: 'power2.out'
      })

      gsap.to(starMaterial, {
        opacity: 0.6,  // 降低透明度
        duration: 0.5
      })

      gsap.to(energyField.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.3,
        delay: 0.5
      })

      // 阶段2: 加速
      currentSpeed = 1
      gsap.to(tunnelMaterial.uniforms.uSpeed, {
        value: 8,  // 降低最大速度
        duration: 1,
        delay: 0.5,
        ease: 'power2.in'
      })

      gsap.to(energyField.material.uniforms.uColor.value, {
        r: 0.5, g: 0.2, b: 1.0,
        duration: 0.5,
        delay: 1
      })

      // 阶段3: 超光速
      gsap.to(tunnelMaterial.uniforms.uSpeed, {
        value: 18,  // 降低最大速度
        duration: 1.5,
        delay: 1.5,
        ease: 'power3.in'
      })

      gsap.to(energyField.scale, {
        x: 1.5, y: 1.5, z: 1.5,  // 降低缩放倍数
        duration: 1.5,
        delay: 1.5,
        ease: 'power3.in'
      })

      gsap.to(starMaterial, {
        size: 6,  // 降低最大尺寸
        duration: 1.5,
        delay: 1.5
      })

      // 阶段4: 减速
      gsap.to(tunnelMaterial.uniforms.uSpeed, {
        value: 2,
        duration: 2,
        delay: 3,
        ease: 'power2.out'
      })

      gsap.to(energyField.scale, {
        x: 0.5, y: 0.5, z: 0.5,
        duration: 2,
        delay: 3,
        ease: 'power2.out'
      })

      gsap.to(energyField.material.uniforms.uColor.value, {
        r: 0, g: 1, b: 1,
        duration: 2,
        delay: 3
      })

      gsap.to(starMaterial, {
        size: 3,
        duration: 2,
        delay: 3
      })

      return tl
    },
    destroy() {
      scene.remove(stars)
      scene.remove(tunnel)
      scene.remove(energyField)
      speedLines.forEach(line => {
        scene.remove(line)
        line.geometry.dispose()
        line.material.dispose()
      })
      starGeometry.dispose()
      starMaterial.dispose()
      tunnelGeometry.dispose()
      tunnelMaterial.dispose()
      energyFieldGeometry.dispose()
      energyFieldMaterial.dispose()
    }
  }
}
