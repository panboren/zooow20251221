/**
 * ✨ 全息神圣几何特效
 * 专业级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 神圣几何图案
 * - 梅塔特隆立方体
 * - 生命之花
 * - 维度变换效果
 * - 黄金比例之美
 *
 * 视觉表现:
 * 多层几何系统
 * 完美比例结构
 * 能量流动模式
 * 维度展开动画
 * 神秘视觉效果
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建梅塔特隆立方体顶点
 */
function createMetatronsCubeVertices() {
  const vertices = []
  const phi = (1 + Math.sqrt(5)) / 2 // 黄金比例
  
  // 立方体8个顶点
  const cubeVertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
  ]
  
  cubeVertices.forEach(v => vertices.push(new THREE.Vector3(...v)))
  
  // 面心6个
  const faceCenters = [
    [0, 0, -phi], [0, 0, phi],
    [-phi, 0, 0], [phi, 0, 0],
    [0, -phi, 0], [0, phi, 0]
  ]
  
  faceCenters.forEach(v => vertices.push(new THREE.Vector3(...v)))
  
  return vertices
}

/**
 * 创建梅塔特隆立方体
 */
function createMetatronsCube(radius, color) {
  const vertices = createMetatronsCubeVertices()
  const lines = []
  
  // 创建连接线
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      lines.push(vertices[i].clone(), vertices[j].clone())
    }
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(lines)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

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

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // 能量流动
        float flow = 0.5 + 0.5 * sin(vPosition.x * 2.0 + uTime * 3.0);
        
        vec3 color = uColor * (0.5 + flow * 0.5);
        float alpha = flow * uOpacity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  const mesh = new THREE.LineSegments(geometry, material)
  mesh.scale.setScalar(radius)
  
  return mesh
}

/**
 * 创建生命之花
 */
function createFlowerOfLife(radius, layers, color) {
  const circles = []
  const group = new THREE.Group()
  
  const phi = (1 + Math.sqrt(5)) / 2
  
  for (let layer = 0; layer < layers; layer++) {
    const circlesInLayer = 6 + layer * 6
    const layerRadius = radius * (1 + layer * 0.5)
    
    for (let i = 0; i < circlesInLayer; i++) {
      const angle = (i / circlesInLayer) * Math.PI * 2
      const x = Math.cos(angle) * layerRadius * 0.5
      const y = Math.sin(angle) * layerRadius * 0.5
      
      const geometry = new THREE.RingGeometry(radius * 0.8, radius, 64)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
          uPhase: { value: angle + layer }
        },
        vertexShader: `
          precision highp float;

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

          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uPhase;
          
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            // 脉动效果
            float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + uPhase);
            
            // 环形渐变
            float ring = smoothstep(0.9, 1.0, length(vUv - 0.5));
            
            vec3 color = uColor * pulse;
            float alpha = (0.3 + ring * 0.7) * uOpacity;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      
      const circle = new THREE.Mesh(geometry, material)
      circle.position.set(x, y, (layer - layers / 2) * radius * 0.3)
      
      group.add(circle)
      circles.push({ mesh: circle, material })
    }
  }
  
  group.userData.circles = circles
  return group
}

/**
 * 创建柏拉图立体
 */
function createPlatonicSolid(type, size, color) {
  let geometry
  switch (type) {
    case 'tetrahedron':
      geometry = new THREE.TetrahedronGeometry(size, 0)
      break
    case 'cube':
      geometry = new THREE.BoxGeometry(size, size, size)
      break
    case 'octahedron':
      geometry = new THREE.OctahedronGeometry(size, 0)
      break
    case 'dodecahedron':
      geometry = new THREE.DodecahedronGeometry(size, 0)
      break
    case 'icosahedron':
      geometry = new THREE.IcosahedronGeometry(size, 0)
      break
    default:
      geometry = new THREE.OctahedronGeometry(size, 0)
  }
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

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

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
        
        // 神圣几何光效
        float sacred = sin(vUv.x * 20.0) * sin(vUv.y * 20.0);
        sacred = smoothstep(0.0, 0.5, sacred);
        
        vec3 color = uColor * (fresnel * 0.7 + sacred * 0.3);
        float alpha = (fresnel * 0.5 + sacred * 0.5) * uOpacity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    wireframe: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  return new THREE.Mesh(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateHolographicSacredGeometry(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}
  
  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 25, 105), 90, controls)
    camera.lookAt(0, 0, 0)
    
    renderer.render(scene, camera)
    
    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()
    
    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-sacred-geometry' })
      },
      onError,
      '✨ 全息神圣几何（专业VFX版）',
      controls
    )
    
    const originalBackground = scene.background
    const originalFog = scene.fog
    
    scene.background = new THREE.Color(0x0a0515)
    scene.fog = new THREE.FogExp2(0x0a0515, 0.002)
    
    // 创建梅塔特隆立方体
    const metatronsCube = createMetatronsCube(30, 0x9933ff)
    scene.add(metatronsCube)
    
    // 创建生命之花
    const flowerOfLife = createFlowerOfLife(15, 4, 0x00ffff)
    flowerOfLife.rotation.x = Math.PI / 2
    scene.add(flowerOfLife)
    
    // 创建柏拉图立体群
    const platonicSolids = []
    const solidTypes = ['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron']
    const colors = [0xff0066, 0xffcc00, 0x00ff66, 0x0099ff, 0xff66ff]
    
    for (let i = 0; i < solidTypes.length; i++) {
      const solid = createPlatonicSolid(solidTypes[i], 12, colors[i])
      const angle = (i / solidTypes.length) * Math.PI * 2
      const radius = 45
      
      solid.position.x = Math.cos(angle) * radius
      solid.position.y = Math.sin(angle) * radius
      solid.position.z = (i % 2 === 0 ? 1 : -1) * 20
      
      scene.add(solid)
      platonicSolids.push({
        mesh: solid,
        rotSpeed: { x: 0.01, y: 0.01, z: 0.005 }
      })
    }
    
    // 创建能量粒子
    const particleCount = 4000
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 20 + Math.random() * 60
      
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePositions[i * 3 + 2] = r * Math.cos(phi)
      
      const hue = Math.random()
      const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    
    // 创建维度变换环
    const dimensionRings = []
    for (let i = 0; i < 7; i++) {
      const geometry = new THREE.TorusGeometry(35 + i * 8, 0.3, 8, 100)
      const hue = i / 7
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color().setHSL(hue, 1.0, 0.5) },
          uOpacity: { value: 0 }
        },
        vertexShader: `
      precision highp float;

      varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
      precision highp float;

      uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          
          void main() {
            float flow = 0.5 + 0.5 * sin(vUv.x * 50.0 - uTime * 4.0);
            vec3 color = uColor * flow;
            float alpha = flow * uOpacity;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      
      const ring = new THREE.Mesh(geometry, material)
      ring.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.3 : -0.3)
      ring.rotation.z = i * 0.2
      
      scene.add(ring)
      dimensionRings.push({ mesh: ring, material, rotSpeed: (Math.random() - 0.5) * 0.02 })
    }
    
    let time = 0
    let animId = null
    
    function update() {
      time += 0.016
      
      // 更新梅塔特隆立方体
      metatronsCube.rotation.y += 0.003
      metatronsCube.rotation.x = Math.sin(time * 0.3) * 0.1
      metatronsCube.material.uniforms.uTime.value = time
      
      // 更新生命之花
      flowerOfLife.rotation.z += 0.002
      flowerOfLife.userData.circles.forEach(circle => {
        circle.material.uniforms.uTime.value = time
      })
      
      // 更新柏拉图立体
      platonicSolids.forEach((solid, i) => {
        solid.mesh.rotation.x += solid.rotSpeed.x
        solid.mesh.rotation.y += solid.rotSpeed.y
        solid.mesh.rotation.z += solid.rotSpeed.z
        solid.mesh.material.uniforms.uTime.value = time
      })
      
      // 更新粒子
      particles.rotation.y -= 0.001
      particles.rotation.x = Math.sin(time * 0.2) * 0.05
      
      // 更新维度环
      dimensionRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.y = Math.sin(time * 0.5 + i) * 0.1
        ring.material.uniforms.uTime.value = time
      })
    }
    
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }
    
    // 入场动画
    gsap.to(metatronsCube.material.uniforms.uOpacity, {
      value: 0.8,
      duration: 2,
      ease: 'power2.out'
    })
    
    flowerOfLife.userData.circles.forEach((circle, i) => {
      gsap.to(circle.material.uniforms.uOpacity, {
        value: 0.6,
        duration: 1.5,
        ease: 'power2.out',
        delay: i * 0.01
      })
    })
    
    platonicSolids.forEach((solid, i) => {
      gsap.to(solid.mesh.material.uniforms.uOpacity, {
        value: 0.7,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.5 + i * 0.15
      })
    })
    
    gsap.to(particleMaterial, {
      opacity: 0.5,
      duration: 2,
      ease: 'power2.out',
      delay: 1
    })
    
    dimensionRings.forEach((ring, i) => {
      gsap.to(ring.material.uniforms.uOpacity, {
        value: 0.5,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.5 + i * 0.1
      })
    })
    
    // 相机运动
    tl.to(camera.position, {
      x: 60,
      y: 30,
      z: 70,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)
    
    tl.to(camera.position, {
      x: -60,
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
        gsap.to(metatronsCube.material.uniforms.uOpacity, { value: 0, duration: 1 })
        flowerOfLife.userData.circles.forEach(circle => {
          gsap.to(circle.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
        platonicSolids.forEach(solid => {
          gsap.to(solid.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
        gsap.to(particleMaterial, { opacity: 0, duration: 1 })
        dimensionRings.forEach(ring => {
          gsap.to(ring.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)
        scene.remove(metatronsCube)
        metatronsCube.geometry.dispose()
        metatronsCube.material.dispose()
        scene.remove(flowerOfLife)
        flowerOfLife.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) obj.material.dispose()
        })
        platonicSolids.forEach(solid => {
          scene.remove(solid.mesh)
          solid.mesh.geometry.dispose()
          solid.mesh.material.dispose()
        })
        scene.remove(particles)
        particles.geometry.dispose()
        particles.material.dispose()
        dimensionRings.forEach(ring => {
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
    console.error('全息神圣几何动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
