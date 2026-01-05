/**
 * effects/light-wings.js
 * 光之羽翼特效
 * 唯美飘逸、羽毛般光束、梦幻氛围
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建光之羽翼
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 羽翼对象
 */
export function createLightWings(scene, options = {}) {
  const {
    wingCount = 8,
    featherCount = 15,
    wingSpan = 60,
    featherLength = 12
  } = options

  // 梦幻色彩
  const wingColors = [
    new THREE.Color(0xffffff), // 纯白
    new THREE.Color(0xfff8dc), // 玉米丝色
    new THREE.Color(0xffe4e1), // 迷雾玫瑰色
    new THREE.Color(0xe6e6fa), // 薰衣草紫
    new THREE.Color(0xfffacd)  // 柠檬绸色
  ]

  const wings = []
  const featherGroups = []

  // 创建羽翼
  for (let w = 0; w < wingCount; w++) {
    const wingGroup = new THREE.Group()
    const color = wingColors[w % wingColors.length]
    const feathers = []

    for (let f = 0; f < featherCount; f++) {
      const angle = (f / featherCount) * Math.PI * 0.8 - Math.PI * 0.4
      const distance = (f / featherCount) * wingSpan * 0.5
      const y = (f / featherCount - 0.5) * featherLength * 2

      // 羽毛几何体
      const featherGeometry = new THREE.PlaneGeometry(
        featherLength * (1 - f / featherCount * 0.5),
        featherLength * 0.15,
        16,
        4
      )

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: color },
          uFeatherIndex: { value: f },
          uWingIndex: { value: w }
        },
        vertexShader: `
          uniform float uTime;
          uniform float uFeatherIndex;
          uniform float uWingIndex;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying float vWave;

          void main() {
            vUv = uv;
            vPosition = position;
            
            // 羽毛波动
            float wave1 = sin(position.x * 2.0 + uTime * 3.0 + uFeatherIndex * 0.5);
            float wave2 = sin(position.y * 3.0 + uTime * 4.0 + uWingIndex * 0.3);
            vWave = wave1 + wave2;
            
            vec3 pos = position;
            pos.z += vWave * 0.3;
            pos.x += sin(uTime * 2.0 + uWingIndex) * 0.2;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uFeatherIndex;
          uniform float uWingIndex;
          
          varying vec2 vUv;
          varying vec3 vPosition;
          varying float vWave;

          void main() {
            // 羽毛渐变
            float gradient = smoothstep(0.0, 1.0, vUv.x);
            
            // 光泽
            float shine = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 3.0);
            
            // 流动光效
            float flow = sin(vUv.x * 10.0 - uTime * 2.0 + vWave) * 0.5 + 0.5;
            
            // 梦幻色彩
            vec3 color = uColor;
            color += vec3(0.5, 0.6, 1.0) * flow * 0.3;
            color += vec3(1.0, 0.9, 0.8) * shine * 0.5;
            
            // 透明度
            float alpha = (1.0 - gradient * 0.8) * (0.6 + flow * 0.3);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      const feather = new THREE.Mesh(featherGeometry, material)
      feather.position.set(
        Math.cos(angle) * distance,
        y,
        Math.sin(angle) * distance * 0.3
      )
      feather.rotation.z = angle
      feather.rotation.x = (f / featherCount - 0.5) * 0.5
      wingGroup.add(feather)
      feathers.push(feather)
    }

    wingGroup.position.y = -wingSpan * 0.3 + w * 8
    wingGroup.rotation.y = (w / wingCount) * Math.PI * 2
    scene.add(wingGroup)
    wings.push(wingGroup)
    featherGroups.push(feathers)
  }

  // 光点粒子
  const sparkleCount = 300
  const sparkleGeometry = new THREE.BufferGeometry()
  const sparklePositions = new Float32Array(sparkleCount * 3)
  const sparkleColors = new Float32Array(sparkleCount * 3)
  const sparkleSizes = new Float32Array(sparkleCount)

  for (let i = 0; i < sparkleCount; i++) {
    sparklePositions[i * 3] = (Math.random() - 0.5) * wingSpan * 2
    sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * wingSpan
    sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * wingSpan

    const color = wingColors[Math.floor(Math.random() * wingColors.length)]
    sparkleColors[i * 3] = color.r
    sparkleColors[i * 3 + 1] = color.g
    sparkleColors[i * 3 + 2] = color.b

    sparkleSizes[i] = Math.random() * 1.5 + 0.3
  }

  sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3))
  sparkleGeometry.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3))
  sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sparkleSizes, 1))

  const sparkleMaterial = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial)
  scene.add(sparkles)

  return {
    wings,
    featherGroups,
    sparkles,
    sparkleGeometry,
    update(time) {
      // 更新羽翼
      wings.forEach((wing, w) => {
        featherGroups[w].forEach((feather, f) => {
          feather.material.uniforms.uTime.value = time
        })
        wing.rotation.y += time * 0.02
        wing.position.y += Math.sin(time + w) * 0.01
      })

      // 更新光点
      const positions = sparkleGeometry.attributes.position.array
      for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.02
        if (positions[i * 3 + 1] > wingSpan / 2) {
          positions[i * 3 + 1] = -wingSpan / 2
        }
      }
      sparkleGeometry.attributes.position.needsUpdate = true
      sparkles.rotation.y = time * 0.01
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 羽翼展开
      wings.forEach((wing, i) => {
        gsap.to(wing.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0,
          ease: 'none'
        })

        gsap.to(wing.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1,
          delay: i * 0.1,
          ease: 'back.out(1.7)'
        })
      })

      // 羽翼飘动
      wings.forEach((wing, i) => {
        gsap.to(wing.rotation, {
          z: (i % 2 === 0 ? 0.5 : -0.5),
          duration: 2,
          delay: 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1
        })
      })

      // 光点闪烁
      tl.to(sparkles.material, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)

      tl.to(sparkles.material, {
        opacity: 0.5,
        duration: 1,
        ease: 'power2.in'
      }, 0.3)

      return tl
    },
    destroy() {
      wings.forEach((wing, i) => {
        featherGroups[i].forEach(feather => {
          wing.remove(feather)
          feather.geometry.dispose()
          feather.material.dispose()
        })
        scene.remove(wing)
      })
      scene.remove(sparkles)
      sparkleGeometry.dispose()
      sparkleMaterial.dispose()
    }
  }
}
