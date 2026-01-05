/**
 * effects/tunnel-effect.js
 * 时空隧道特效 - 使用自定义Shader实现穿越虫洞的效果
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 时空隧道Shader材质
 */
const tunnelVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const tunnelFragmentShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uDistortion;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // 噪声函数
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered);
    
    // 螺旋效果
    float angle = atan(centered.y, centered.x);
    float spiral = sin(angle * 8.0 - uTime * uSpeed + dist * 20.0);
    
    // 隧道深度
    float tunnel = sin(dist * 30.0 - uTime * uSpeed * 2.0);
    
    // 噪声扭曲
    float noise = snoise(centered * 5.0 + uTime * 0.5);
    
    // 混合颜色
    vec3 color = mix(uColor1, uColor2, dist + noise * uDistortion);
    
    // 添加螺旋和隧道效果
    float intensity = tunnel * 0.5 + spiral * 0.3 + 0.2;
    
    // 中心发光
    float centerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
    
    color *= intensity * (1.0 + centerGlow * 2.0);
    
    gl_FragColor = vec4(color, 1.0 - smoothstep(0.4, 0.5, dist));
  }
`

/**
 * 创建时空隧道
 * @param {Scene} scene - Three.js场景
 * @param {Object} options - 配置选项
 * @returns {Object} 隧道对象
 */
export function createTunnel(scene, options = {}) {
  const {
    radius = 20,
    length = 100,
    segments = 64,
    color1 = new THREE.Color(0x00ffff),
    color2 = new THREE.Color(0xff00ff),
    speed = 2.0,
    distortion = 0.3
  } = options

  // 创建圆柱体几何体作为隧道
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    length,
    segments,
    1,
    true
  )

  // Shader材质
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
      uDistortion: { value: distortion }
    },
    vertexShader: tunnelVertexShader,
    fragmentShader: tunnelFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const tunnel = new THREE.Mesh(geometry, material)
  tunnel.rotation.x = Math.PI / 2
  scene.add(tunnel)

  // 添加光环效果
  const ringCount = 10
  const rings = []

  for (let i = 0; i < ringCount; i++) {
    const ringGeometry = new THREE.TorusGeometry(radius, 0.1, 8, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color1,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.z = -length / 2 + (i / ringCount) * length
    scene.add(ring)
    rings.push(ring)
  }

  return {
    tunnel,
    rings,
    material,
    geometry,
    update(time) {
      material.uniforms.uTime.value = time
    },
    animate(duration, onComplete) {
      const tl = gsap.timeline({ onComplete })

      // 隧道收缩
      tl.to(tunnel.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: duration * 0.4,
        ease: 'power2.in'
      })

      // 隧道膨胀
      tl.to(tunnel.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: duration * 0.6,
        ease: 'elastic.out(1, 0.5)'
      })

      return tl
    },
    destroy() {
      scene.remove(tunnel)
      rings.forEach(ring => scene.remove(ring))
      geometry.dispose()
      material.dispose()
    }
  }
}
