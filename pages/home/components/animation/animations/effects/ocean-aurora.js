/**
 * effects/ocean-aurora.js
 * 海洋波浪 + 极光特效
 * 深邃、神秘、绚烂
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 创建海洋极光
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 海洋极光对象
 */
export function createOceanAurora(scene, options = {}) {
  const {
    waveSize = 100,
    waveSegments = 256,
    auroraBandCount = 8  // 修改参数名，避免与数组变量冲突
  } = options

  // 海洋Shader
  const oceanGeometry = new THREE.PlaneGeometry(waveSize, waveSize, waveSegments, waveSegments)
  oceanGeometry.rotateX(-Math.PI / 2)

  const oceanMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color(0x001a33) },
      uSurfaceColor: { value: new THREE.Color(0x0066cc) },
      uFoamColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // 多层波浪
        float wave1 = sin(pos.x * 0.1 + uTime * 1.0) * 2.0;
        float wave2 = sin(pos.z * 0.15 + uTime * 1.2) * 1.5;
        float wave3 = sin((pos.x + pos.z) * 0.05 + uTime * 0.8) * 3.0;
        
        pos.y += wave1 + wave2 + wave3;
        vElevation = (wave1 + wave2 + wave3) / 6.5;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uDeepColor;
      uniform vec3 uSurfaceColor;
      uniform vec3 uFoamColor;
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        // 深浅渐变
        vec3 color = mix(uDeepColor, uSurfaceColor, vElevation * 0.5 + 0.5);
        
        // 泡沫
        float foam = step(0.7, vElevation);
        color = mix(color, uFoamColor, foam * 0.3);
        
        // 闪烁
        float shimmer = sin(uTime * 3.0 + vUv.x * 10.0) * 0.05 + 0.95;
        color *= shimmer;
        
        gl_FragColor = vec4(color, 0.95);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  })

  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
  ocean.position.y = -10
  scene.add(ocean)

  // 极光
  const auroraBands = []  // 数组变量名保持不变
  const auroraColors = [
    new THREE.Color(0x00ff00),
    new THREE.Color(0xff00ff),
    new THREE.Color(0x00ffff),
    new THREE.Color(0x0066ff)
  ]

  for (let i = 0; i < auroraBandCount; i++) {  // 使用重命名后的参数
    const geometry = new THREE.PlaneGeometry(waveSize, waveSize * 0.6, 128, 64)
    geometry.rotateX(Math.PI / 3)

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
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // 波浪形
          pos.x += sin(uv.y * 10.0 + uTime * 0.5 + uBandIndex) * 5.0;
          pos.y += cos(uv.y * 8.0 + uTime * 0.6 + uBandIndex) * 3.0;
          
          // 高度渐变
          float height = sin(uv.y * 3.14159) * 20.0;
          pos.y += height;
          
          vAlpha = height / 20.0;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        varying float vAlpha;
        
        void main() {
          // 渐变透明度
          float alpha = vAlpha * 0.4 * (1.0 - abs(vUv.x - 0.5) * 2.0);
          
          // 闪烁
          float shimmer = sin(uTime * 2.0 + vUv.y * 5.0) * 0.2 + 0.8;
          
          gl_FragColor = vec4(uColor * shimmer, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    const band = new THREE.Mesh(geometry, material)
    band.position.y = 30 + i * 8
    band.position.z = -20
    scene.add(band)
    auroraBands.push(band)
  }

  // 星空背景
  const starsGeometry = new THREE.BufferGeometry()
  const starsPositions = new Float32Array(3000 * 3)

  for (let i = 0; i < 3000; i++) {
    starsPositions[i * 3] = (Math.random() - 0.5) * 500
    starsPositions[i * 3 + 1] = Math.random() * 200 + 50
    starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 500
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)

  return {
    ocean,
    auroraBands,
    stars,
    update(deltaTime, time) {
      oceanMaterial.uniforms.uTime.value = time

      auroraBands.forEach((band, i) => {
        band.material.uniforms.uTime.value = time + i * 0.5
      })

      // 星星闪烁
      if (Math.random() < 0.05) {
        starsMaterial.opacity = 0.5 + Math.random() * 0.5
      }
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 极光增强
      auroraBands.forEach((band, i) => {
        gsap.to(band.material.uniforms, {
          value: duration * (i + 1) * 0.2,
          duration: 2,
          ease: 'power2.inOut'
        })
      })

      // 海浪加强
      tl.to(ocean.scale, {
        y: 1.2,
        duration: 3,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      })

      return tl
    },
    destroy() {
      scene.remove(ocean)
      scene.remove(stars)
      auroraBands.forEach(band => scene.remove(band))
      oceanGeometry.dispose()
      oceanMaterial.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
      auroraBands.forEach(band => {
        band.geometry.dispose()
        band.material.dispose()
      })
    }
  }
}
