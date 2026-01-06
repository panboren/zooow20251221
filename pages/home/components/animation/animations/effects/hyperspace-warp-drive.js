/**
 * effects/hyperspace-warp-drive.js
 * 超空间曲速驱动特效
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
    starCount = 10000,
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

  // 曲速隧道
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

        // 螺旋扭曲效果
        float twist = uv.y * uSpeed * 0.5 + uTime * 5.0;
        float angle = atan(pos.z, pos.x) + twist;

        // 呼吸效果
        float breathe = sin(uTime * 10.0 + uv.y * 10.0) * 5.0;
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
        // 条纹效果
        float stripe = sin(vUv.y * 50.0 + uTime * 20.0 * uSpeed) * 0.5 + 0.5;
        float alpha = stripe * 0.3;

        // 边缘发光
        float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
        alpha *= edge;

        // 距离衰减
        float fade = 1.0 - smoothstep(0.3, 0.7, abs(vDist - 0.5) * 2.0);
        alpha *= fade;

        // 颜色变化
        vec3 color = uColor * (1.0 + stripe * 0.5);
        color += vec3(0.5, 0.7, 1.0) * stripe * 0.3;

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

  // 能量场
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
        float wave = sin(uTime * 15.0 + length(pos) * 0.5) * 2.0;
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
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        float pulse = sin(uTime * 20.0) * 0.3 + 0.7;
        vec3 color = uColor * pulse;
        color += vec3(0.8, 0.9, 1.0) * fresnel * 0.5;
        gl_FragColor = vec4(color, fresnel * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const energyField = new THREE.Mesh(energyFieldGeometry, energyFieldMaterial)
  energyField.scale.setScalar(0)
  scene.add(energyField)

  // 速度线
  const speedLines = []
  const lineCount = 50
  for (let i = 0; i < lineCount; i++) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 200, 4)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    const line = new THREE.Mesh(geometry, material)
    line.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 80,
      0
    )
    line.visible = false
    scene.add(line)
    speedLines.push(line)
  }

  let currentSpeed = 1

  return {
    stars,
    starGeometry,
    tunnel,
    energyField,
    speedLines,
    update(deltaTime, time) {
      // 更新速度
      const targetSpeed = currentSpeed
      currentSpeed += (targetSpeed - tunnelMaterial.uniforms.uSpeed.value) * deltaTime * 2
      tunnelMaterial.uniforms.uSpeed.value = currentSpeed

      tunnelMaterial.uniforms.uTime.value = time
      energyField.material.uniforms.uTime.value = time

      // 更新星星位置
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

      // 更新速度线
      speedLines.forEach((line, i) => {
        if (line.visible && line.material.opacity > 0) {
          line.position.z += 300 * deltaTime * currentSpeed
          line.material.opacity -= deltaTime * 0.5
          if (line.position.z > 100 || line.material.opacity <= 0) {
            line.visible = false
            line.position.z = -100
            line.position.x = (Math.random() - 0.5) * 80
            line.position.y = (Math.random() - 0.5) * 80
          }
        } else if (Math.random() < 0.1 * currentSpeed) {
          line.visible = true
          line.material.opacity = 0.8
        }
      })
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
        opacity: 0.8,
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
        value: 10,
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
        value: 25,
        duration: 1.5,
        delay: 1.5,
        ease: 'power3.in'
      })

      gsap.to(energyField.scale, {
        x: 2, y: 2, z: 2,
        duration: 1.5,
        delay: 1.5,
        ease: 'power3.in'
      })

      gsap.to(starMaterial, {
        size: 8,
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
