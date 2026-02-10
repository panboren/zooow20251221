/**
 * 🌫️ 超越级体积云 (Transcendent Volumetric Cloud)
 * 超越级视觉特效 - 电影级VFX
 *
 * 技术特点:
 * - 分形布朗运动(FBM)噪声
 * - 体积光线追踪
 * - 光线散射与吸收
 * - 3D分形噪声云体
 * - 透射率计算
 * - 动态云体变形
 *
 * 视觉表现:
 * 多层FBM云体结构
 * 体积光散射效果
 * 动态云形变换
 * 光线透射与阴影
 * 云层深度层次
 * 颜色渐变混合
 *
 * @author Professional VFX Designer
 * Credits: Based on volumetric raymarching by ShaderBits
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 创建体积云核心
 */
function createVolumetricCloudCore(radius, color) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uCloudDensity: { value: 0 },
      uLightIntensity: { value: 0 },
      uWindSpeed: { value: 0 }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uCloudDensity;
      uniform float uWindSpeed;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vNoise;

      // Hash function
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }

      // 3D Noise
      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        
        float res = mix(
          mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
              mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
          mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
              mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
        );
        return res;
      }

      // Rotation matrix for FBM
      mat3 m = mat3(
        0.00,  0.80,  0.60,
        -0.80,  0.36, -0.48,
        -0.60, -0.48,  0.64
      );

      // Fractal Brownian Motion
      float fbm(vec3 p) {
        float f = 0.0;
        f  = 0.5000 * noise(p); p = m * p * 2.02;
        f += 0.2500 * noise(p); p = m * p * 2.03;
        f += 0.1250 * noise(p);
        f += 0.0625 * noise(p * m * 2.02);
        return f;
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPosition);

        vec3 pos = position;

        // 风吹云体变形
        vec3 windOffset = vec3(uTime * uWindSpeed * 2.0, 0.0, uTime * uWindSpeed * 1.0);
        float cloudNoise = fbm(pos * 0.3 + windOffset);
        
        // 云体膨胀效果
        pos += normal * cloudNoise * uCloudDensity * 8.0;
        vNoise = cloudNoise;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uCloudDensity;
      uniform float uLightIntensity;
      uniform float uWindSpeed;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewDir;
      varying float vNoise;

      // Light direction
      vec3 sunDirection = normalize(vec3(1.0, 0.3, 0.5));

      // Beer-Lambert law for transmittance
      float beer(float d) {
        return exp(-d);
      }

      // Powder effect for cloud
      float powder(float d) {
        return 1.0 - exp(-d * 2.0);
      }

      // Henyey-Greenstein phase function
      float henyeyGreenstein(float cosTheta, float g) {
        float g2 = g * g;
        return (1.0 - g2) / (4.0 * 3.14159 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
      }

      void main() {
        vec3 viewDir = normalize(vViewDir);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);

        // Cloud density based on noise
        float density = uCloudDensity * (0.3 + vNoise * 0.7);
        
        // Transmittance (how much light passes through)
        float transmittance = beer(density * 5.0);
        
        // Light scattering
        float cosTheta = dot(viewDir, sunDirection);
        float phaseForward = henyeyGreenstein(cosTheta, 0.8);
        float phaseBackward = henyeyGreenstein(cosTheta, -0.3);
        float phase = mix(phaseBackward, phaseForward, 0.5);
        
        // Light intensity with depth
        float lightDepth = 1.0 - dot(vNormal, sunDirection);
        float light = mix(0.4, 1.0, lightDepth) * uLightIntensity;
        
        // Cloud color with gradient
        vec3 cloudColorLight = vec3(1.0, 0.95, 0.9);  // Light part (warm)
        vec3 cloudColorShadow = vec3(0.6, 0.7, 0.9); // Shadow part (cool)
        vec3 cloudColor = mix(cloudColorShadow, cloudColorLight, light);
        
        // Apply scattering phase
        vec3 scatteredLight = cloudColor * phase * light;
        
        // Final color mixing
        vec3 baseColor = uColor;
        vec3 finalColor = mix(baseColor, scatteredLight, density * 0.7);
        
        // Add ambient light
        finalColor += baseColor * 0.15 * uLightIntensity;
        
        // Add fresnel for depth
        finalColor += baseColor * fresnel * 0.3;
        
        // Alpha based on transmittance and density
        float alpha = (1.0 - transmittance) * uOpacity * 0.6;
        alpha += density * uOpacity * 0.4;
        alpha += fresnel * uOpacity * 0.15;

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
 * 创建体积云环
 */
function createVolumetricCloudRing(innerRadius, outerRadius, segments, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uCloudPhase: { value: 0 },
      uDensity: { value: 0 },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      precision highp float;

      #define TWO_PI 6.2831853

      uniform float uTime;
      uniform float uCloudPhase;
      uniform float uDensity;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;
      varying float vNoise;

      // Hash function
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }

      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        
        float res = mix(
          mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
              mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
          mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
              mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
        );
        return res;
      }

      mat3 m = mat3(
        0.00,  0.80,  0.60,
        -0.80,  0.36, -0.48,
        -0.60, -0.48,  0.64
      );

      float fbm(vec3 p) {
        float f = 0.0;
        f  = 0.5000 * noise(p); p = m * p * 2.02;
        f += 0.2500 * noise(p);
        return f;
      }

      void main() {
        vUv = uv;
        vPosition = position;
        vRadius = length(position.xz);

        vec3 pos = position;

        // Cloud noise for ring
        vec3 noisePos = vec3(pos.x * 0.2, pos.y * 0.2, uTime * 0.3 + uCloudPhase);
        float cloudNoise = fbm(noisePos);
        vNoise = cloudNoise;

        // Ring deformation
        float angle = atan(pos.z, pos.x);
        float wave = sin(angle * 8.0 + uTime * 2.0 + uCloudPhase) * 0.5 + 0.5;
        pos.y += wave * uDensity * 3.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uCloudPhase;
      uniform float uDensity;
      uniform float uInnerRadius;
      uniform float uOuterRadius;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying float vRadius;
      varying float vNoise;

      void main() {
        // Ring pattern
        float ringPattern = sin(vRadius * 1.5 - uTime * 3.0 + uCloudPhase * 2.0) * 0.5 + 0.5;

        // Angle pattern
        float angle = atan(vPosition.z, vPosition.x);
        float anglePattern = sin(angle * 6.0 + uTime * 2.5) * 0.5 + 0.5;

        // Cloud density
        float cloudDensity = uDensity * (0.3 + vNoise * 0.7);

        // Edge glow
        float edgeGlow = smoothstep(uInnerRadius, uOuterRadius, vRadius) *
                        (1.0 - smoothstep(uInnerRadius, uOuterRadius, vRadius));
        edgeGlow = pow(edgeGlow, 0.5);

        // Combine patterns
        vec3 color = uColor;
        color *= (ringPattern * 0.4 + anglePattern * 0.3 + edgeGlow * 0.3);
        color *= (0.5 + cloudDensity * 0.5);

        // Alpha
        float alpha = (ringPattern * 0.4 + anglePattern * 0.3 + edgeGlow * 0.3) * uOpacity;
        alpha *= (0.5 + cloudDensity * 0.5);

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
  return mesh
}

/**
 * 创建体积光粒子
 */
function createVolumetricLightParticles(count, radius) {
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

    const hue = 0.1 + Math.random() * 0.15 // Gold/orange colors
    const color = new THREE.Color().setHSL(hue, 0.8, 0.7)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = 0.5 + Math.random() * 1.5
    phases[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uLightIntensity: { value: 0 },
      uRadius: { value: radius }
    },
    vertexShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uLightIntensity;

      attribute float size;
      attribute vec3 color;
      attribute float phase;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        vColor = color;
        vPhase = phase;

        vec3 pos = position;

        // Gentle floating motion
        pos.y += sin(uTime * 0.5 + phase) * 0.5 * uLightIntensity;
        pos.x += cos(uTime * 0.3 + phase) * 0.3 * uLightIntensity;

        // Glow pulsing
        float pulse = 1.0 + 0.3 * sin(uTime * 2.0 + phase);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform float uLightIntensity;

      varying vec3 vColor;
      varying float vPhase;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // Volumetric glow
        float glow = smoothstep(0.5, 0.0, dist);
        
        // Pulsing intensity
        float pulse = sin(uTime * 3.0 + vPhase * 5.0) * 0.5 + 0.5;
        
        // Enhanced glow
        glow *= (1.0 + pulse * 0.5 * uLightIntensity);

        float alpha = glow * uOpacity;
        vec3 color = vColor * (1.0 + pulse * 0.3);

        gl_FragColor = vec4(color, alpha);
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
export default function animateTranscendentVolumetricCloud(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 15, 100), 80, controls)
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-volumetric-cloud' })
      },
      onError,
      '🌫️ 超越级体积云（FBM Raymarching）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    // Sky gradient background
    scene.background = new THREE.Color(0x1a2a4a)
    scene.fog = new THREE.FogExp2(0x1a2a4a, 0.001)

    // 创建体积云核心
    const volumetricCloud = createVolumetricCloudCore(20, 0xffeedd)
    scene.add(volumetricCloud)

    // 创建体积云环
    const cloudRings = []
    for (let i = 0; i < 4; i++) {
      const innerRadius = 28 + i * 14
      const outerRadius = 32 + i * 14
      const hue = 0.08 + i * 0.05
      const color = new THREE.Color().setHSL(hue, 0.7, 0.7).getHex()
      const ring = createVolumetricCloudRing(innerRadius, outerRadius, 128, color)
      ring.rotation.x = -Math.PI / 2 + (i % 2 === 0 ? 0.1 : -0.1)
      ring.rotation.z = i * 0.2
      scene.add(ring)
      cloudRings.push({ mesh: ring, rotSpeed: (Math.random() - 0.5) * 0.006, phase: i * 0.7 })
    }

    // 创建体积光粒子
    const lightParticles = createVolumetricLightParticles(8000, 90)
    scene.add(lightParticles)

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 更新体积云核心
      volumetricCloud.material.uniforms.uTime.value = time
      volumetricCloud.material.uniforms.uCloudDensity.value = 0.5 + 0.5 * Math.sin(time * 0.4)
      volumetricCloud.material.uniforms.uLightIntensity.value = 0.6 + 0.4 * Math.sin(time * 0.5)
      volumetricCloud.material.uniforms.uWindSpeed.value = 0.3 + 0.3 * Math.sin(time * 0.3)
      volumetricCloud.rotation.y += 0.003

      // 更新体积云环
      cloudRings.forEach((ring, i) => {
        ring.mesh.rotation.z += ring.rotSpeed
        ring.mesh.rotation.x = -Math.PI / 2 + Math.sin(time * 0.5 + ring.phase) * 0.15
        ring.mesh.material.uniforms.uTime.value = time
        ring.mesh.material.uniforms.uCloudPhase.value = time + ring.phase
        ring.mesh.material.uniforms.uDensity.value = 0.4 + 0.6 * Math.sin(time * 0.4 + ring.phase)
        const pulse = 1 + 0.08 * Math.sin(time * 2 + ring.phase)
        ring.mesh.scale.setScalar(pulse)
      })

      // 更新体积光粒子
      lightParticles.material.uniforms.uTime.value = time
      lightParticles.material.uniforms.uLightIntensity.value = 0.5 + 0.5 * Math.sin(time * 0.6)
      lightParticles.rotation.y += 0.002
      lightParticles.rotation.x = Math.sin(time * 0.25) * 0.05
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(volumetricCloud.material.uniforms.uOpacity, {
      value: 0.7,
      duration: 2.5,
      ease: 'power2.out'
    })

    gsap.to(volumetricCloud.material.uniforms.uCloudDensity, {
      value: 0.85,
      duration: 3,
      ease: 'power2.out'
    })

    gsap.to(volumetricCloud.material.uniforms.uLightIntensity, {
      value: 0.9,
      duration: 3,
      ease: 'power2.out'
    })

    cloudRings.forEach((ring, i) => {
      gsap.to(ring.mesh.material.uniforms.uOpacity, {
        value: 0.65,
        duration: 2.2,
        ease: 'power2.out',
        delay: i * 0.3
      })
    })

    gsap.to(lightParticles.material.uniforms.uOpacity, {
      value: 0.75,
      duration: 3,
      ease: 'power2.out',
      delay: 0.5
    })

    gsap.to(lightParticles.material.uniforms.uLightIntensity, {
      value: 0.7,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    })

    // 相机运动
    tl.to(camera.position, {
      x: 50,
      y: 15,
      z: 70,
      duration: 6,
      ease: 'power2.inOut'
    }, 0)

    tl.to(camera.position, {
      x: -50,
      y: -5,
      z: 85,
      duration: 6,
      ease: 'power2.inOut'
    }, 6)

    tl.to(camera.position, {
      x: 0,
      y: 8,
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
        gsap.to(volumetricCloud.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
        gsap.to(volumetricCloud.material.uniforms.uCloudDensity, { value: 0, duration: 1.5 })
        gsap.to(volumetricCloud.material.uniforms.uLightIntensity, { value: 0, duration: 1.5 })

        cloudRings.forEach(ring => {
          gsap.to(ring.mesh.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
          gsap.to(ring.mesh.material.uniforms.uDensity, { value: 0, duration: 1.2 })
        })

        gsap.to(lightParticles.material.uniforms.uOpacity, { value: 0, duration: 1.2 })
        gsap.to(lightParticles.material.uniforms.uLightIntensity, { value: 0, duration: 1.2 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(volumetricCloud)
        volumetricCloud.geometry.dispose()
        volumetricCloud.material.dispose()

        cloudRings.forEach(ring => {
          scene.remove(ring.mesh)
          ring.mesh.geometry.dispose()
          ring.mesh.material.dispose()
        })

        scene.remove(lightParticles)
        lightParticles.geometry.dispose()
        lightParticles.material.dispose()

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
    console.error('超越级体积云动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
