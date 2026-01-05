/**
 * effects/aurora-fluid.js
 * 极光流体特效
 * 梦幻、流动、迷离
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建极光流体
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 极光流体对象
 */
export function createAuroraFluid(scene, options = {}) {
  const {
    fluidCount = 12,
    fluidRadius = 60
  } = options

  const fluids = []

  // 更鲜艳的极光颜色
  const auroraColors = [
    new THREE.Color(0x00ff00),  // 极光绿
    new THREE.Color(0xff00ff),  // 紫粉
    new THREE.Color(0x00ffff),  // 青
    new THREE.Color(0xff6600),  // 橙
    new THREE.Color(0x0080ff)   // 蓝
  ]

  // 创建极光带
  for (let i = 0; i < fluidCount; i++) {
    const geometry = new THREE.PlaneGeometry(fluidRadius * 2, 50, 128, 64)
    geometry.rotateX(-Math.PI / 4)

    const color = auroraColors[i % auroraColors.length]
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uBandIndex: { value: i }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uBandIndex;
        varying vec2 vUv;
        varying float vAlpha;
        varying vec3 vPos;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // 更复杂的波动效果
          float wave1 = sin(uv.x * 8.0 + uTime * 0.4 + uBandIndex * 0.3);
          float wave2 = sin(uv.x * 4.0 + uTime * 0.6 + uBandIndex * 0.2);
          float wave3 = cos(uv.y * 3.0 + uTime * 0.5);
          float wave4 = sin(uv.x * 6.0 + uTime * 0.7 + uBandIndex * 0.4);
          
          // 垂直波动
          pos.y += (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * 12.0;
          
          // 水平波动
          pos.x += (wave4 + wave1) * 6.0;
          
          // 高度渐变 - 使用更平滑的曲线
          float height = pow(sin(uv.y * 3.14159 * 0.5 + 0.5), 2.0);
          pos.y += height * 25.0;
          
          vAlpha = height;
          vPos = pos;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        varying float vAlpha;
        varying vec3 vPos;
        
        void main() {
          // 增强透明度 - 更清晰
          float alpha = vAlpha * 0.5 * (1.0 - abs(vUv.x - 0.5) * 1.8);
          
          // 流动效果 - 更强的对比
          float flow = sin(uTime * 3.0 + vUv.y * 6.0 + vPos.x * 0.1) * 0.2 + 0.9;
          
          // 边缘柔化 - 更锐利的边缘
          float edge = 1.0 - smoothstep(0.25, 0.45, abs(vUv.x - 0.5));
          
          // 添加高光
          float highlight = pow(flow, 3.0) * 0.3;
          
          vec3 finalColor = uColor * flow + vec3(highlight);
          
          gl_FragColor = vec4(finalColor, alpha * edge);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    const fluid = new THREE.Mesh(geometry, material)
    fluid.position.z = -25 + i * 4
    fluid.position.y = 20 + i * 5
    fluid.rotation.y = (i / fluidCount) * Math.PI * 0.4
    scene.add(fluid)
    fluids.push(fluid)
  }

  // 星光粒子 - 增强背景
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 300
  const starPositions = new Float32Array(starCount * 3)
  const starSizes = new Float32Array(starCount)
  const starColors = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 150
    starPositions[i * 3 + 1] = Math.random() * 80 + 10
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 150

    starSizes[i] = Math.random() * 3 + 1

    // 星星颜色
    const starColor = new THREE.Color().setHSL(Math.random(), 0.8, 0.7)
    starColors[i * 3] = starColor.r
    starColors[i * 3 + 1] = starColor.g
    starColors[i * 3 + 2] = starColor.b
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

  const starMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  return {
    fluids,
    stars,
    update(deltaTime, time) {
      // 更新极光
      fluids.forEach((fluid, i) => {
        fluid.material.uniforms.uTime.value = time + i * 0.2
      })

      // 星星闪烁
      const starPositions = starGeometry.attributes.position.array
      for (let i = 0; i < starCount; i++) {
        if (Math.random() < 0.02) {
          starMaterial.size = 2 + Math.random() * 2
        }
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 极光增强
      fluids.forEach((fluid, i) => {
        const delay = i * 0.08
        gsap.to(fluid.scale, {
          y: 1.8,
          duration: 2.5,
          delay,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1
        })

        // 颜色增强
        gsap.to(fluid.material, {
          opacity: 0.9,
          duration: 1.5,
          delay,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        })
      })

      // 星星爆发
      tl.to(starMaterial, {
        size: 5,
        duration: 1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 2
      })

      return tl
    },
    destroy() {
      fluids.forEach(fluid => {
        scene.remove(fluid)
        fluid.geometry.dispose()
        fluid.material.dispose()
      })
      scene.remove(stars)
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }
}
