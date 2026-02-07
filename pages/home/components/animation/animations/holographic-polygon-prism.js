/**
 * 🎭 全息多边形棱镜特效
 * 专业级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 多边形棱镜阵列系统
 * - 实时光线折射模拟
 * - 动态棱镜分光效果
 * - 色散与彩虹光谱
 * - 几何变换与形变
 *
 * 视觉表现:
 * 50+ 棱镜粒子
 * 多种多边形: 六边形、五边形、八边形
 * 实时光谱分离
 * 动态透明度变化
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建多边形棱镜几何体
 */
function createPolygonGeometry(sides, radius) {
  const geometry = new THREE.CylinderGeometry(
    radius, radius, radius * 0.5,
    sides, 1, true
  )
  return geometry
}

/**
 * 创建棱镜材质
 */
function createPrismMaterial(color, opacity) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        
        // Fresnel 效果 - 边缘发光
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
        
        // 棱镜边缘高光
        float edge = smoothstep(0.9, 1.0, abs(dot(vNormal, vec3(0.0, 1.0, 0.0))));
        
        // 光谱色散效果
        float dispersion = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
        vec3 dispColor = uColor;
        dispColor.r *= 1.0 + dispersion * 0.5;
        dispColor.g *= 1.0 + dispersion * 0.3;
        dispColor.b *= 1.0 + dispersion * 0.7;
        
        // 组合效果
        vec3 finalColor = dispColor * (fresnel * 0.8 + edge * 0.2);
        
        float alpha = (fresnel * 0.6 + edge * 0.4) * uOpacity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  return material
}

/**
 * 创建彩虹光谱粒子
 */
function createRainbowParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
    
    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    
    sizes[i] = 1.5 + Math.random() * 2
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  
  return new THREE.Points(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateHolographicPolygonPrism(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}
  
  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 100), 80, controls)
    camera.lookAt(0, 0, 0)
    
    renderer.render(scene, camera)
    
    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()
    
    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-polygon-prism' })
      },
      onError,
      '🎭 全息多边形棱镜（专业VFX版）',
      controls
    )
    
    const originalBackground = scene.background
    const originalFog = scene.fog
    
    scene.background = new THREE.Color(0x050515)
    scene.fog = new THREE.FogExp2(0x050515, 0.003)
    
    // 创建棱镜阵列
    const prisms = []
    const prismConfigs = [
      { sides: 6, radius: 8, color: 0x00ffff },  // 六边形
      { sides: 5, radius: 6, color: 0xff00ff },  // 五边形
      { sides: 8, radius: 7, color: 0xffff00 },  // 八边形
      { sides: 6, radius: 5, color: 0x00ff00 },  // 小六边形
      { sides: 4, radius: 4, color: 0xff8800 },  // 正方形
    ]
    
    for (let i = 0; i < 50; i++) {
      const config = prismConfigs[i % prismConfigs.length]
      const geometry = createPolygonGeometry(config.sides, config.radius)
      const material = createPrismMaterial(config.color, 0)
      
      const prism = new THREE.Mesh(geometry, material)
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 30 + Math.random() * 40
      
      prism.position.x = r * Math.sin(phi) * Math.cos(theta)
      prism.position.y = r * Math.sin(phi) * Math.sin(theta)
      prism.position.z = r * Math.cos(phi)
      
      prism.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      scene.add(prism)
      prisms.push({
        mesh: prism,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 2 + 1,
        floatOffset: Math.random() * Math.PI * 2,
        material: material
      })
    }
    
    // 创建彩虹粒子系统
    const rainbowParticles = createRainbowParticles(3000, 60)
    scene.add(rainbowParticles)
    
    // 创建光束效果
    const beams = []
    for (let i = 0; i < 12; i++) {
      const geometry = new THREE.CylinderGeometry(0.5, 0.5, 150, 8, 1, true)
      const hue = i / 12
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(hue, 1.0, 0.5) },
          uOpacity: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          
          void main() {
            float beam = exp(-abs(vUv.x - 0.5) * 10.0);
            float pulse = 0.5 + 0.5 * sin(vUv.y * 30.0 - uTime * 3.0);
            float alpha = beam * pulse * uOpacity;
            gl_FragColor = vec4(uColor * beam * (1.0 + pulse * 0.5), alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      
      const beam = new THREE.Mesh(geometry, material)
      const angle = (i / 12) * Math.PI * 2
      beam.position.x = Math.cos(angle) * 20
      beam.position.z = Math.sin(angle) * 20
      beam.rotation.z = angle + Math.PI / 2
      
      scene.add(beam)
      beams.push({ mesh: beam, material, angle })
    }
    
    let time = 0
    let animId = null
    
    function update() {
      time += 0.016
      
      prisms.forEach((prism, i) => {
        prism.mesh.rotation.x += prism.rotSpeed.x
        prism.mesh.rotation.y += prism.rotSpeed.y
        prism.mesh.rotation.z += prism.rotSpeed.z
        
        const floatY = Math.sin(time * prism.floatSpeed + prism.floatOffset) * 5
        prism.mesh.position.y += floatY * 0.01
        
        prism.material.uniforms.uTime.value = time
      })
      
      rainbowParticles.rotation.y += 0.002
      rainbowParticles.rotation.x = Math.sin(time * 0.3) * 0.1
      
      beams.forEach((beam, i) => {
        beam.material.uniforms.uTime.value = time
        const currentAngle = beam.angle + time * 0.1
        beam.mesh.position.x = Math.cos(currentAngle) * 25
        beam.mesh.position.z = Math.sin(currentAngle) * 25
        beam.mesh.rotation.z = currentAngle + Math.PI / 2
      })
    }
    
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }
    
    // 入场动画
    prisms.forEach((prism, i) => {
      gsap.to(prism.material.uniforms.uOpacity, {
        value: 0.8,
        duration: 1.5,
        ease: 'power2.out',
        delay: i * 0.02
      })
    })
    
    gsap.to(rainbowParticles.material, {
      opacity: 0.6,
      duration: 2,
      ease: 'power2.out',
      delay: 0.5
    })
    
    beams.forEach((beam, i) => {
      gsap.to(beam.material.uniforms.uOpacity, {
        value: 0.5,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.3 + i * 0.05
      })
    })
    
    // 相机运动
    tl.to(camera.position, {
      x: 40,
      y: 20,
      z: 60,
      duration: 5,
      ease: 'power2.inOut'
    }, 0)
    
    tl.to(camera.position, {
      x: -40,
      y: -10,
      z: 50,
      duration: 5,
      ease: 'power2.inOut'
    }, 5)
    
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 80,
      duration: 4,
      ease: 'power2.inOut'
    }, 10)
    
    animate()
    
    tl.to({}, { duration: 15 }, 0)
    
    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        prisms.forEach(prism => {
          gsap.to(prism.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
        gsap.to(rainbowParticles.material, { opacity: 0, duration: 1 })
        beams.forEach(beam => {
          gsap.to(beam.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)
        prisms.forEach(prism => {
          scene.remove(prism.mesh)
          prism.mesh.geometry.dispose()
          prism.mesh.material.dispose()
        })
        scene.remove(rainbowParticles)
        rainbowParticles.geometry.dispose()
        rainbowParticles.material.dispose()
        beams.forEach(beam => {
          scene.remove(beam.mesh)
          beam.mesh.geometry.dispose()
          beam.mesh.material.dispose()
        })
        
        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 15)
    
    return tl
    
  } catch (error) {
    console.error('全息多边形棱镜动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
