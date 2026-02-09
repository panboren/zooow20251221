/**
 * 💎 全息晶体形成特效
 * 专业级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 晶体生长动画
 * - 多面体折射效果
 * - 棱镜光色散
 * - 能量结晶化
 * - 动态晶格结构
 *
 * 视觉表现:
 * 150+ 晶体组件
 * 多种多面体类型
 * 实时光色散
 * 晶体生长动画
 * 专业玻璃效果
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建晶体几何体
 */
function createCrystalGeometry(type, size) {
  switch (type) {
    case 'octahedron':
      return new THREE.OctahedronGeometry(size, 0)
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(size, 0)
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(size, 0)
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(size, 0)
    default:
      return new THREE.OctahedronGeometry(size, 0)
  }
}

/**
 * 创建晶体材质
 */
function createCrystalMaterial(color, opacity) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uGrowth: { value: 0 },
      uRefractiveIndex: { value: 1.5 }
    },
    vertexShader: `
      precision highp float;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vViewDir = normalize(cameraPosition - position);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGrowth;
      uniform float uRefractiveIndex;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      varying vec2 vUv;
      
      void main() {
        vec3 viewDir = normalize(vViewDir);
        
        // Fresnel 效果
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
        
        // 棱镜色散
        vec3 refractDir = refract(-viewDir, vNormal, 1.0 / uRefractiveIndex);
        float dispersion = sin(dot(refractDir, vec3(1.0, 1.0, 1.0)) * 10.0 + uTime) * 0.5 + 0.5;
        
        // 彩虹光谱
        vec3 rainbow;
        rainbow.r = sin(dispersion * 6.28 + 0.0) * 0.5 + 0.5;
        rainbow.g = sin(dispersion * 6.28 + 2.09) * 0.5 + 0.5;
        rainbow.b = sin(dispersion * 6.28 + 4.19) * 0.5 + 0.5;
        
        // 混合颜色
        vec3 finalColor = mix(uColor, rainbow, fresnel * 0.5);
        finalColor += fresnel * 0.3;
        
        // 晶体边框
        float edge = smoothstep(0.95, 1.0, abs(dot(vNormal, vec3(1.0, 1.0, 1.0))));
        finalColor += edge * 0.5;
        
        // 生长效果
        float alpha = (fresnel * 0.6 + edge * 0.4) * uOpacity * uGrowth;
        
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
 * 创建晶格连接
 */
function createCrystalLattice(radius, segments) {
  const points = []
  
  for (let i = 0; i < segments; i++) {
    const theta1 = (i / segments) * Math.PI * 2
    const phi1 = Math.random() * Math.PI
    
    for (let j = 0; j < segments; j++) {
      const theta2 = (j / segments) * Math.PI * 2
      const phi2 = Math.random() * Math.PI
      
      const p1 = new THREE.Vector3(
        radius * Math.sin(phi1) * Math.cos(theta1),
        radius * Math.sin(phi1) * Math.sin(theta1),
        radius * Math.cos(phi1)
      )
      
      const p2 = new THREE.Vector3(
        radius * Math.sin(phi2) * Math.cos(theta2),
        radius * Math.sin(phi2) * Math.sin(theta2),
        radius * Math.cos(phi2)
      )
      
      points.push(p1, p2)
    }
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })
  
  return new THREE.LineSegments(geometry, material)
}

/**
 * 创建能量结晶粒子
 */
function createCrystallizationParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const targets = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())
    
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200
    
    targets[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    targets[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    targets[i * 3 + 2] = r * Math.cos(phi)
    
    const hue = Math.random()
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    
    sizes[i] = 1 + Math.random() * 2
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('target', new THREE.BufferAttribute(targets, 3))
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCrystallization: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uCrystallization;

      attribute float size;
      attribute vec3 target;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;

        vec3 pos = mix(position, target, uCrystallization);
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      varying vec3 vColor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, dist);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  return new THREE.Points(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateHolographicCrystallineFormation(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}
  
  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 20, 110), 95, controls)
    camera.lookAt(0, 0, 0)
    
    renderer.render(scene, camera)
    
    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()
    
    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-crystalline-formation' })
      },
      onError,
      '💎 全息晶体形成（专业VFX版）',
      controls
    )
    
    const originalBackground = scene.background
    const originalFog = scene.fog
    
    scene.background = new THREE.Color(0x081020)
    scene.fog = new THREE.FogExp2(0x081020, 0.002)
    
    // 创建晶体阵列
    const crystals = []
    const crystalTypes = ['octahedron', 'dodecahedron', 'icosahedron', 'tetrahedron']
    
    for (let i = 0; i < 150; i++) {
      const type = crystalTypes[i % crystalTypes.length]
      const size = 2 + Math.random() * 4
      const geometry = createCrystalGeometry(type, size)
      
      const hue = (i / 150) * 0.5 + 0.4
      const material = createCrystalMaterial(
        new THREE.Color().setHSL(hue, 1.0, 0.5).getHex(),
        0
      )
      
      const crystal = new THREE.Mesh(geometry, material)
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 15 + Math.random() * 60
      
      crystal.position.x = r * Math.sin(phi) * Math.cos(theta)
      crystal.position.y = r * Math.sin(phi) * Math.sin(theta)
      crystal.position.z = r * Math.cos(phi)
      
      crystal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      scene.add(crystal)
      crystals.push({
        mesh: crystal,
        material,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015
        }
      })
    }
    
    // 创建晶格连接
    const crystalLattice = createCrystalLattice(80, 30)
    scene.add(crystalLattice)
    
    // 创建结晶粒子
    const crystallizationParticles = createCrystallizationParticles(5000, 80)
    scene.add(crystallizationParticles)
    
    // 创建核心晶体
    const coreGeometry = createCrystalGeometry('icosahedron', 15)
    const coreMaterial = createCrystalMaterial(0xffffff, 0)
    const coreCrystal = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(coreCrystal)
    crystals.push({
      mesh: coreCrystal,
      material: coreMaterial,
      rotSpeed: { x: 0.01, y: 0.01, z: 0.01 },
      isCore: true
    })
    
    // 创建能量光环
    const haloGeometries = []
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.TorusGeometry(25 + i * 10, 0.5, 8, 100)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / 5, 1.0, 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      const halo = new THREE.Mesh(geometry, material)
      halo.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.2 : -0.2)
      scene.add(halo)
      haloGeometries.push({ mesh: halo, rotSpeed: (Math.random() - 0.5) * 0.02 })
    }
    
    let time = 0
    let animId = null
    
    function update() {
      time += 0.016
      
      // 更新晶体
      crystals.forEach((crystal, i) => {
        crystal.mesh.rotation.x += crystal.rotSpeed.x
        crystal.mesh.rotation.y += crystal.rotSpeed.y
        crystal.mesh.rotation.z += crystal.rotSpeed.z
        crystal.material.uniforms.uTime.value = time
        
        if (!crystal.isCore) {
          const floatY = Math.sin(time * 0.5 + i) * 2
          crystal.mesh.position.y += floatY * 0.01
        }
      })
      
      // 更新晶格
      crystalLattice.rotation.y += 0.002
      crystalLattice.rotation.x = Math.sin(time * 0.3) * 0.05
      
      // 更新结晶粒子
      crystallizationParticles.material.uniforms.uTime.value = time
      crystallizationParticles.rotation.y -= 0.001
      
      // 更新光环
      haloGeometries.forEach((halo, i) => {
        halo.mesh.rotation.z += halo.rotSpeed
        halo.mesh.rotation.x = Math.PI / 2 + Math.sin(time + i) * 0.1
      })
    }
    
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }
    
    // 入场动画 - 结晶效果
    gsap.to(crystallizationParticles.material.uniforms.uCrystallization, {
      value: 1,
      duration: 4,
      ease: 'power2.inOut'
    })
    
    gsap.to(crystallizationParticles.material.uniforms.uTime, {
      value: 1,
      duration: 2,
      ease: 'power2.out'
    })
    
    crystals.forEach((crystal, i) => {
      gsap.to(crystal.material.uniforms.uGrowth, {
        value: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: i * 0.01
      })
    })
    
    gsap.to(crystalLattice.material, {
      opacity: 0.4,
      duration: 2,
      ease: 'power2.out',
      delay: 2
    })
    
    haloGeometries.forEach((halo, i) => {
      gsap.to(halo.mesh.material, {
        opacity: 0.5,
        duration: 1.5,
        ease: 'power2.out',
        delay: 2.5 + i * 0.2
      })
    })
    
    // 相机运动
    tl.to(camera.position, {
      x: 55,
      y: 25,
      z: 65,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)
    
    tl.to(camera.position, {
      x: -55,
      y: -15,
      z: 75,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)
    
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 95,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)
    
    animate()
    
    tl.to({}, { duration: 18 }, 0)
    
    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        crystals.forEach(crystal => {
          gsap.to(crystal.material.uniforms.uGrowth, { value: 0, duration: 1 })
        })
        gsap.to(crystalLattice.material, { opacity: 0, duration: 1 })
        gsap.to(crystallizationParticles.material.uniforms.uCrystallization, { value: 0, duration: 1 })
        haloGeometries.forEach(halo => {
          gsap.to(halo.mesh.material, { opacity: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)
        crystals.forEach(crystal => {
          scene.remove(crystal.mesh)
          crystal.mesh.geometry.dispose()
          crystal.mesh.material.dispose()
        })
        scene.remove(crystalLattice)
        crystalLattice.geometry.dispose()
        crystalLattice.material.dispose()
        scene.remove(crystallizationParticles)
        crystallizationParticles.geometry.dispose()
        crystallizationParticles.material.dispose()
        haloGeometries.forEach(halo => {
          scene.remove(halo.mesh)
          halo.mesh.geometry.dispose()
          halo.mesh.material.dispose()
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
    console.error('全息晶体形成动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
