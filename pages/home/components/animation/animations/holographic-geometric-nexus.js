/**
 * 🔮 全息几何核心特效
 * 专业级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 多层级几何核心系统
 * - 旋转多边形轨道
 * - 能量流动与脉动
 * - 量子纠缠连接线
 * - 动态全息投影效果
 *
 * 视觉表现:
 * 100+ 几何组件
 * 8层旋转轨道
 * 5000+ 连接粒子
 * 实时能量流动
 * 电影级视觉冲击力
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建几何核心
 */
function createGeometricCore(radius, detail, color) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uGlowIntensity: { value: 1.0 }
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
      uniform float uGlowIntensity;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
        
        // 能量脉动
        float pulse = 0.7 + 0.3 * sin(uTime * 3.0);
        
        // 几何图案
        float pattern = sin(vUv.x * 20.0) * sin(vUv.y * 20.0);
        pattern = smoothstep(-0.5, 0.5, pattern);
        
        vec3 finalColor = uColor * (fresnel * 0.8 + pattern * 0.2) * pulse * uGlowIntensity;
        float alpha = (fresnel * 0.5 + pattern * 0.5) * uOpacity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    wireframe: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  return new THREE.Mesh(geometry, material)
}

/**
 * 创建旋转轨道
 */
function createOrbitRing(radius, segments, color) {
  const geometry = new THREE.TorusGeometry(radius, 0.3, 8, segments)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // 能量流动
        float flow = 0.5 + 0.5 * sin(vUv.x * 50.0 - uTime * 5.0);
        
        vec3 color = uColor * flow;
        float alpha = (0.3 + flow * 0.7) * uOpacity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  return new THREE.Mesh(geometry, material)
}

/**
 * 创建连接粒子系统
 */
function createConnectionParticles(count, outerRadius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 5 + Math.random() * (outerRadius - 5)
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
    
    const hue = 0.5 + Math.random() * 0.3
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    
    sizes[i] = 0.8 + Math.random() * 1.5
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  
  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  
  return new THREE.Points(geometry, material)
}

/**
 * 创建量子纠缠线
 */
function createQuantumLines(count, maxRadius) {
  const lines = []
  
  for (let i = 0; i < count; i++) {
    const points = []
    const segments = 20 + Math.floor(Math.random() * 30)
    
    for (let j = 0; j <= segments; j++) {
      const t = j / segments
      const theta = t * Math.PI * 2 + Math.random() * 0.5
      const phi = Math.random() * Math.PI
      const r = 5 + t * (maxRadius - 5)
      
      points.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 1.0, 0.5),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    })
    
    const line = new THREE.Line(geometry, material)
    lines.push(line)
  }
  
  return lines
}

/**
 * 主动画函数
 */
export default function animateHolographicGeometricNexus(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}
  
  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 30, 120), 90, controls)
    camera.lookAt(0, 0, 0)
    
    renderer.render(scene, camera)
    
    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()
    
    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-geometric-nexus' })
      },
      onError,
      '🔮 全息几何核心（专业VFX版）',
      controls
    )
    
    const originalBackground = scene.background
    const originalFog = scene.fog
    
    scene.background = new THREE.Color(0x080818)
    scene.fog = new THREE.FogExp2(0x080818, 0.002)
    
    // 创建多层级核心
    const coreLayers = []
    const coreConfigs = [
      { radius: 8, detail: 2, color: 0xff00ff },
      { radius: 12, detail: 1, color: 0x00ffff },
      { radius: 16, detail: 0, color: 0xffff00 },
      { radius: 20, detail: 1, color: 0x00ff00 },
      { radius: 24, detail: 0, color: 0xff8800 }
    ]
    
    coreConfigs.forEach((config, i) => {
      const core = createGeometricCore(config.radius, config.detail, config.color)
      scene.add(core)
      coreLayers.push({
        mesh: core,
        rotSpeed: 0.01 * (i + 1),
        pulseSpeed: 2 + i * 0.5
      })
    })
    
    // 创建旋转轨道
    const orbits = []
    for (let i = 0; i < 8; i++) {
      const radius = 35 + i * 8
      const segments = 64 + i * 8
      const hue = i / 8
      const orbit = createOrbitRing(radius, segments, new THREE.Color().setHSL(hue, 1.0, 0.5).getHex())
      
      orbit.rotation.x = Math.random() * 0.5
      orbit.rotation.z = Math.random() * 0.5
      
      scene.add(orbit)
      orbits.push({
        mesh: orbit,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        tiltSpeed: (Math.random() - 0.5) * 0.01
      })
    }
    
    // 创建连接粒子
    const connectionParticles = createConnectionParticles(5000, 100)
    scene.add(connectionParticles)
    
    // 创建量子纠缠线
    const quantumLines = createQuantumLines(100, 100)
    quantumLines.forEach(line => scene.add(line))
    
    // 创建能量脉冲环
    const pulseRings = []
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.TorusGeometry(30 + i * 15, 0.5, 8, 100)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / 5, 1.0, 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      const ring = new THREE.Mesh(geometry, material)
      ring.rotation.x = Math.PI / 2
      scene.add(ring)
      pulseRings.push({ mesh: ring, baseScale: 1, pulsePhase: i * 0.5 })
    }
    
    let time = 0
    let animId = null
    
    function update() {
      time += 0.016
      
      // 更新核心层
      coreLayers.forEach((layer, i) => {
        layer.mesh.rotation.y += layer.rotSpeed
        layer.mesh.rotation.x += layer.rotSpeed * 0.5
        layer.mesh.material.uniforms.uTime.value = time
        const pulse = 1 + Math.sin(time * layer.pulseSpeed) * 0.2
        layer.mesh.scale.setScalar(pulse)
      })
      
      // 更新轨道
      orbits.forEach((orbit, i) => {
        orbit.mesh.rotation.y += orbit.rotSpeed
        orbit.mesh.rotation.x += orbit.tiltSpeed
        orbit.mesh.rotation.z += orbit.tiltSpeed * 0.5
        orbit.mesh.material.uniforms.uTime.value = time
      })
      
      // 更新连接粒子
      connectionParticles.rotation.y -= 0.001
      connectionParticles.rotation.x = Math.sin(time * 0.2) * 0.05
      
      // 更新量子线
      quantumLines.forEach((line, i) => {
        line.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1)
        line.rotation.z += 0.0005
      })
      
      // 更新脉冲环
      pulseRings.forEach((ring, i) => {
        const pulse = Math.sin(time * 2 + ring.pulsePhase) * 0.1
        ring.mesh.scale.setScalar(1 + pulse)
        ring.mesh.material.opacity = 0.3 + pulse * 0.2
      })
    }
    
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }
    
    // 入场动画
    coreLayers.forEach((layer, i) => {
      gsap.to(layer.mesh.material.uniforms.uOpacity, {
        value: 0.9,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: i * 0.15
      })
    })
    
    orbits.forEach((orbit, i) => {
      gsap.to(orbit.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.5 + i * 0.08
      })
    })
    
    gsap.to(connectionParticles.material, {
      opacity: 0.5,
      duration: 2,
      ease: 'power2.out',
      delay: 1
    })
    
    quantumLines.forEach((line, i) => {
      gsap.to(line.material, {
        opacity: 0.3 + Math.random() * 0.3,
        duration: 1,
        ease: 'power2.out',
        delay: 0.8 + i * 0.005
      })
    })
    
    pulseRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material, {
        opacity: 0.4,
        duration: 2,
        ease: 'power2.out',
        delay: 1.2 + i * 0.1
      })
    })
    
    // 相机运动
    tl.to(camera.position, {
      x: 50,
      y: 30,
      z: 70,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)
    
    tl.to(camera.position, {
      x: -50,
      y: -20,
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)
    
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 100,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)
    
    animate()
    
    tl.to({}, { duration: 18 }, 0)
    
    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        coreLayers.forEach(layer => {
          gsap.to(layer.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
        orbits.forEach(orbit => {
          gsap.to(orbit.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
        gsap.to(connectionParticles.material, { opacity: 0, duration: 1 })
        quantumLines.forEach(line => {
          gsap.to(line.material, { opacity: 0, duration: 1 })
        })
        pulseRings.forEach(ring => {
          gsap.to(ring.mesh.material, { opacity: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)
        coreLayers.forEach(layer => {
          scene.remove(layer.mesh)
          layer.mesh.geometry.dispose()
          layer.mesh.material.dispose()
        })
        orbits.forEach(orbit => {
          scene.remove(orbit.mesh)
          orbit.mesh.geometry.dispose()
          orbit.mesh.material.dispose()
        })
        scene.remove(connectionParticles)
        connectionParticles.geometry.dispose()
        connectionParticles.material.dispose()
        quantumLines.forEach(line => {
          scene.remove(line)
          line.geometry.dispose()
          line.material.dispose()
        })
        pulseRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })
        
        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 18)
    
    return tl
    
  } catch (error) {
    console.error('全息几何核心动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
