/**
 * 🎹 全息多声部矩阵特效
 * 专业级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 多边形矩阵系统
 * - 声波可视化模拟
 * - 频谱分析效果
 * - 动态波形变换
 * - 和谐色彩流动
 *
 * 视觉表现:
 * 200+ 矩阵单元
  多种多边形类型
 * 实时波形动画
 * 色彩渐变流动
 * 专业音频可视化
 *
 * @author Professional VFX Artist
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera, safeCameraTransform } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建多边形单元
 */
function createPolygonCell(sides, radius, color) {
  const geometry = new THREE.CylinderGeometry(radius, radius, radius * 0.3, sides, 1, true)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uWavePhase: { value: Math.random() * Math.PI * 2 },
      uWaveSpeed: { value: 1 + Math.random() }
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
      uniform float uWavePhase;
      uniform float uWaveSpeed;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
        
        // 波形动画
        float wave = sin(uTime * uWaveSpeed + uWavePhase + vPosition.y * 0.5) * 0.5 + 0.5;
        
        // 频谱效果
        float spectrum = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
        
        vec3 finalColor = uColor * (fresnel * 0.6 + wave * 0.2 + spectrum * 0.2);
        float alpha = (fresnel * 0.5 + wave * 0.3 + spectrum * 0.2) * uOpacity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  return new THREE.Mesh(geometry, material)
}

/**
 * 创建波形地面
 */
function createWaveGrid(size, divisions, color) {
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions)
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uWaveSpeed: { value: 2.0 },
      uWaveHeight: { value: 3.0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uWaveSpeed;
      uniform float uWaveHeight;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        
        vec3 pos = position;
        float wave = sin(pos.x * 0.2 + uTime * uWaveSpeed) * 
                     cos(pos.y * 0.2 + uTime * uWaveSpeed * 0.7) * 
                     uWaveHeight;
        pos.z += wave;
        
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
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
        // 网格线效果
        float gridX = smoothstep(0.0, 0.1, abs(sin(vPosition.x * 0.2)));
        float gridY = smoothstep(0.0, 0.1, abs(sin(vPosition.y * 0.2)));
        float grid = max(gridX, gridY);
        
        // 波形强度
        float wave = 0.5 + 0.5 * sin(vPosition.z * 2.0 + uTime * 3.0);
        
        vec3 color = uColor * grid * wave;
        float alpha = grid * 0.5 * uOpacity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -30
  
  return mesh
}

/**
 * 创建声波粒子
 */
function createSoundwaveParticles(count, radius) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
    
    const hue = (i / count) * 0.3 + 0.5
    const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    
    sizes[i] = 1 + Math.random() * 2
    phases[i] = Math.random() * Math.PI * 2
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;

      attribute float size;
      attribute float phase;
      attribute vec3 color;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vColor = color;
        vPhase = phase;

        vec3 pos = position;
        float wave = sin(uTime * 3.0 + phase) * 2.0;
        pos += normalize(pos) * wave;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uOpacity;
      
      varying vec3 vColor;
      varying float vPhase;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;
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
export default function animateHolographicPolyphonicMatrix(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}
  
  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 40, 100), 85, controls)
    camera.lookAt(0, 0, 0)
    
    renderer.render(scene, camera)
    
    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()
    
    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'holographic-polyphonic-matrix' })
      },
      onError,
      '🎹 全息多声部矩阵（专业VFX版）',
      controls
    )
    
    const originalBackground = scene.background
    const originalFog = scene.fog
    
    scene.background = new THREE.Color(0x0a0818)
    scene.fog = new THREE.FogExp2(0x0a0818, 0.0025)
    
    // 创建多边形矩阵
    const matrixCells = []
    const polygonTypes = [3, 4, 5, 6, 8] // 三角形、正方形、五边形、六边形、八边形
    const matrixSize = 10
    const spacing = 8
    
    for (let x = 0; x < matrixSize; x++) {
      for (let z = 0; z < matrixSize; z++) {
        const sides = polygonTypes[(x + z) % polygonTypes.length]
        const radius = 2 + Math.random() * 2
        const hue = ((x + z) / (matrixSize * 2)) * 0.4 + 0.5
        const color = new THREE.Color().setHSL(hue, 1.0, 0.5).getHex()
        
        const cell = createPolygonCell(sides, radius, color)
        cell.position.x = (x - matrixSize / 2 + 0.5) * spacing
        cell.position.z = (z - matrixSize / 2 + 0.5) * spacing
        cell.position.y = -15 + Math.random() * 5
        
        scene.add(cell)
        matrixCells.push({
          mesh: cell,
          baseY: cell.position.y,
          waveOffset: Math.random() * Math.PI * 2
        })
      }
    }
    
    // 创建波形地面
    const waveGrid = createWaveGrid(120, 40, 0x8800ff)
    scene.add(waveGrid)
    
    // 创建声波粒子
    const soundwaveParticles = createSoundwaveParticles(4000, 80)
    scene.add(soundwaveParticles)
    
    // 创建频率柱
    const frequencyBars = []
    for (let i = 0; i < 32; i++) {
      const geometry = new THREE.BoxGeometry(2, 20, 2)
      const hue = i / 32
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1.0, 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      
      const bar = new THREE.Mesh(geometry, material)
      const angle = (i / 32) * Math.PI * 2
      const radius = 50
      
      bar.position.x = Math.cos(angle) * radius
      bar.position.z = Math.sin(angle) * radius
      bar.position.y = -10
      
      scene.add(bar)
      frequencyBars.push({
        mesh: bar,
        angle,
        baseScale: 1
      })
    }
    
    // 创建旋律光带
    const melodyRibbons = []
    for (let i = 0; i < 8; i++) {
      const points = []
      const segments = 100
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const angle = t * Math.PI * 4
        const radius = 30 + Math.sin(angle * 2) * 10
        
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          (t - 0.5) * 60,
          Math.sin(angle) * radius
        ))
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const hue = i / 8
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1.0, 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
      
      const ribbon = new THREE.Line(geometry, material)
      scene.add(ribbon)
      melodyRibbons.push({ mesh: ribbon, rotationSpeed: (Math.random() - 0.5) * 0.01 })
    }
    
    let time = 0
    let animId = null
    
    function update() {
      time += 0.016
      
      // 更新矩阵单元
      matrixCells.forEach((cell, i) => {
        const wave = Math.sin(time * 2 + cell.waveOffset) * 3
        cell.mesh.position.y = cell.baseY + wave
        cell.mesh.rotation.y += 0.01
        cell.mesh.material.uniforms.uTime.value = time
      })
      
      // 更新波形地面
      waveGrid.material.uniforms.uTime.value = time
      
      // 更新声波粒子
      soundwaveParticles.material.uniforms.uTime.value = time
      soundwaveParticles.rotation.y += 0.002
      
      // 更新频率柱
      frequencyBars.forEach((bar, i) => {
        const frequency = Math.sin(time * 3 + bar.angle * 2) * 0.5 + 0.5
        const scale = 0.5 + frequency * 2.5
        bar.mesh.scale.y = scale
        bar.mesh.position.y = -10 + scale * 5
      })
      
      // 更新旋律光带
      melodyRibbons.forEach((ribbon, i) => {
        ribbon.mesh.rotation.y += ribbon.rotationSpeed
        ribbon.mesh.rotation.x = Math.sin(time * 0.5 + i) * 0.1
      })
    }
    
    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }
    
    // 入场动画
    matrixCells.forEach((cell, i) => {
      gsap.to(cell.mesh.material.uniforms.uOpacity, {
        value: 0.8,
        duration: 1,
        ease: 'power2.out',
        delay: i * 0.005
      })
    })
    
    gsap.to(waveGrid.material.uniforms.uOpacity, {
      value: 0.5,
      duration: 2,
      ease: 'power2.out',
      delay: 0.5
    })
    
    gsap.to(soundwaveParticles.material.uniforms.uOpacity, {
      value: 0.6,
      duration: 2,
      ease: 'power2.out',
      delay: 1
    })
    
    frequencyBars.forEach((bar, i) => {
      gsap.to(bar.mesh.material, {
        opacity: 0.7,
        duration: 1,
        ease: 'power2.out',
        delay: 1 + i * 0.03
      })
    })
    
    melodyRibbons.forEach((ribbon, i) => {
      gsap.to(ribbon.mesh.material, {
        opacity: 0.8,
        duration: 1.5,
        ease: 'power2.out',
        delay: 1.5 + i * 0.1
      })
    })
    
    // 相机运动
    tl.to(camera.position, {
      x: 60,
      y: 20,
      z: 60,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)
    
    tl.to(camera.position, {
      x: -60,
      y: -10,
      z: 70,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)
    
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 90,
      duration: 4,
      ease: 'power2.inOut'
    }, 12)
    
    animate()
    
    tl.to({}, { duration: 18 }, 0)
    
    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        matrixCells.forEach(cell => {
          gsap.to(cell.mesh.material.uniforms.uOpacity, { value: 0, duration: 1 })
        })
        gsap.to(waveGrid.material.uniforms.uOpacity, { value: 0, duration: 1 })
        gsap.to(soundwaveParticles.material.uniforms.uOpacity, { value: 0, duration: 1 })
        frequencyBars.forEach(bar => {
          gsap.to(bar.mesh.material, { opacity: 0, duration: 1 })
        })
        melodyRibbons.forEach(ribbon => {
          gsap.to(ribbon.mesh.material, { opacity: 0, duration: 1 })
        })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)
        matrixCells.forEach(cell => {
          scene.remove(cell.mesh)
          cell.mesh.geometry.dispose()
          cell.mesh.material.dispose()
        })
        scene.remove(waveGrid)
        waveGrid.geometry.dispose()
        waveGrid.material.dispose()
        scene.remove(soundwaveParticles)
        soundwaveParticles.geometry.dispose()
        soundwaveParticles.material.dispose()
        frequencyBars.forEach(bar => {
          scene.remove(bar.mesh)
          bar.mesh.geometry.dispose()
          bar.mesh.material.dispose()
        })
        melodyRibbons.forEach(ribbon => {
          scene.remove(ribbon.mesh)
          ribbon.mesh.geometry.dispose()
          ribbon.mesh.material.dispose()
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
    console.error('全息多声部矩阵动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
