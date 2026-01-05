/**
 * effects/energy-wave.js
 * 能量波动特效 - 顶点着色器实现动态波纹效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

const waveVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    
    vec3 position = position;
    
    // 计算距离中心的距离
    float dist = distance(position.xy, vec2(0.0));
    
    // 波浪效果
    float wave = sin(dist * uFrequency - uTime * uSpeed);
    
    // 衰减
    float attenuation = 1.0 - smoothstep(0.0, 50.0, dist);
    
    // 应用高度变化
    position.z += wave * uAmplitude * attenuation;
    vElevation = wave * attenuation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const waveFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // 基础颜色
    vec3 color = uColor;
    
    // 根据高度添加发光
    float glowIntensity = smoothstep(-0.5, 1.0, vElevation);
    color = mix(color, uGlowColor, glowIntensity);
    
    // 添加能量脉冲效果
    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    color *= (1.0 + pulse * 0.3);
    
    // 边缘渐变
    float dist = distance(vUv, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * 创建能量波
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 能量波对象
 */
export function createEnergyWave(scene, options = {}) {
  const {
    size = 60,
    segments = 128,
    color = new THREE.Color(0x00ff88),
    glowColor = new THREE.Color(0x00ffff),
    amplitude = 5,
    frequency = 0.3,
    speed = 2.0
  } = options

  // 创建平面几何体
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(-Math.PI / 2)

  // Shader材质
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: amplitude },
      uFrequency: { value: frequency },
      uSpeed: { value: speed },
      uColor: { value: color },
      uGlowColor: { value: glowColor }
    },
    vertexShader: waveVertexShader,
    fragmentShader: waveFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const wave = new THREE.Mesh(geometry, material)
  wave.position.y = -20
  scene.add(wave)

  // 创建波纹环
  const rings = []
  for (let i = 0; i < 5; i++) {
    const ringGeometry = new THREE.RingGeometry(size * (i + 1) * 0.2, size * (i + 1) * 0.25, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = -20
    ring.userData.originalScale = 1
    scene.add(ring)
    rings.push(ring)
  }

  return {
    wave,
    rings,
    material,
    geometry,
    update(time) {
      material.uniforms.uTime.value = time

      // 更新波纹环
      rings.forEach((ring, i) => {
        const offset = i * 0.5
        const scale = (time * 2 + offset) % 3
        ring.scale.setScalar(1 + scale)
        ring.material.opacity = Math.max(0, 0.5 - scale * 0.15)
      })
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 振幅增加
      tl.to(material.uniforms.uAmplitude, {
        value: amplitude * 3,
        duration: duration * 0.3,
        ease: 'power2.in'
      })

      // 频率加快
      tl.to(material.uniforms.uFrequency, {
        value: frequency * 2,
        duration: duration * 0.3
      }, '<')

      // 恢复
      tl.to(material.uniforms.uAmplitude, {
        value: amplitude,
        duration: duration * 0.4,
        ease: 'power2.out'
      })

      tl.to(material.uniforms.uFrequency, {
        value: frequency,
        duration: duration * 0.4
      }, '<')

      return tl
    },
    destroy() {
      scene.remove(wave)
      rings.forEach(ring => scene.remove(ring))
      geometry.dispose()
      material.dispose()
    }
  }
}
