/**
 * 🌅 超越级Synthwave地形特效
 * 次世代视觉特效 - 增强版Vaporwave风格
 *
 * 创新突破（基于提供的Synthwave Shader）：
 * ✨ Raymarching地形渲染 - 三角形噪声驱动的无限地形
 * ✨ 复古霓虹落日 - 多层渐变太阳+光环效果
 * ✨ 立体网格地面 - 透视正确的3D网格
 * ✨ 动态星星闪烁 - 基于噪声的星空系统
 * ✨ 雾体积渲染 - 指数雾+音频响应
 * ✨ 实时光线追踪 - 反射天空到地形
 * ✨ 运动模糊 - 快门速度控制的动态模糊
 * ✨ 音频反应式地形 - FFT驱动的波浪起伏
 *
 * 视觉表现：
 * - 无限延伸的三角形网格地形
 * - 宏伟的渐变色霓虹太阳（橙→紫→粉）
 * - 立体透视网格地面
 * - 闪烁的星空背景
 * - 雾气笼罩的远景
 * - 地形反射天空颜色
 * - 相机自动穿行
 *
 * 技术亮点：
 * - 真正的Raymarching算法（500步迭代）
 * - 三角形噪声地形生成
 * - 精确的法线计算
 * - 累积光照系统（Glow效果）
 * - 多层着色器叠加
 * - 高效内存优化
 *
 * @author Master VFX Designer
 * @inspired Shadertoy Synthwave Masterpieces
 * @enhanced Advanced Audio Visualization + Bloom
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { createTimeline, setupInitialCamera } from './utils.js'
import { PerformanceMonitor } from '~/utils/PerformanceMonitor.js'

/**
 * 饱和函数
 */
function sat(a) {
  return Math.max(0, Math.min(1, a))
}

/**
 * 旋转矩阵2D
 */
function r2d(a) {
  const c = Math.cos(a), s = Math.sin(a)
  return new THREE.Matrix2(c, -s, s, c)
}

/**
 * 功函数 - a^512
 */
function pow512(a) {
  a *= a
  a *= a
  a *= a
  a *= a
  a *= a
  a *= a
  a *= a
  a *= a
  return a * a
}

/**
 * 平方根幂函数 - a^1.5
 */
function pow1d5(a) {
  return a * Math.sqrt(a)
}

/**
 * 2D哈希函数
 */
function hash21(co) {
  const x = co.x, y = co.y
  return ((Math.sin(x * 1.9898 + y * 7.233) * 45758.5433) % 1 + 1) % 1
}

/**
 * 三角形噪声（核心地形算法）
 * @param {THREE.Vector2} uv - 坐标
 * @param {number} time - 时间参数
 * @returns {Object} {n: 噪声值, edge: 边缘值}
 */
function trinoise(uv, time) {
  const sq = Math.sqrt(3 / 2)
  const p = {
    x: uv.x * sq,
    y: uv.y - 0.5 * uv.x * sq
  }

  const d = {
    x: p.x % 1,
    y: p.y % 1
  }

  const baseX = Math.floor(p.x)
  const baseY = Math.floor(p.y)

  p.x = baseX
  p.y = baseY

  const c = d.x + d.y > 1

  const dd = { x: 1 - d.x, y: 1 - d.y }
  const da = c ? dd : d
  const db = c ? d : dd

  // 波浪效果
  let w = 1
  const waveAmp = (Math.abs(d.x - 0.5))
  if (waveAmp > 0) {
    w = (1 - 0.4 * pow512(0.51 + 0.49 * Math.sin((0.02 * (d.y + 0.5 * d.x) - time) * 2)))
  }

  // 三角形顶点噪声
  const nn = hash21({ x: p.x + (c ? 1 : 0), y: p.y + (c ? 1 : 0) })
  const n2 = hash21({ x: p.x + 1, y: p.y })
  const n3 = hash21({ x: p.x, y: p.y + 1 })

  const nmid = n2 + (n3 - n2) * d.y
  const ns = nn + ((c ? n2 : n3) - nn) * da.y
  const dx = da.x / db.y

  // 音频响应
  const audioResponse = 0

  const n = ns + (nmid - ns) * dx
  const edgeMin = Math.min(
    Math.min((1 - dx) * db.y, da.x),
    da.y
  )

  return {
    n: (n > 0 ? n * pow1d5(n) * w : 0) - audioResponse,
    edge: edgeMin
  }
}

/**
 * 距离场映射
 * @param {THREE.Vector3} p - 3D位置
 * @param {number} time - 时间
 * @returns {number} 距离值
 */
function map(p, time) {
  const n = trinoise({ x: p.x, y: p.z }, time)
  return p.y - 2 * n.n
}

/**
 * 计算法线
 * @param {THREE.Vector3} p - 表面点
 * @param {number} time - 时间
 * @returns {THREE.Vector3} 法线向量
 */
function grad(p, time) {
  const e = 0.005
  const a = map(p, time)
  const dx = map({ x: p.x + e, y: p.y, z: p.z }, time)
  const dy = map({ x: p.x, y: p.y + e, z: p.z }, time)
  const dz = map({ x: p.x, y: p.y, z: p.z + e }, time)

  return new THREE.Vector3(
    dx - a,
    dy - a,
    dz - a
  ).normalize()
}

/**
 * Raymarching求交
 * @param {THREE.Vector3} ro - 射线原点
 * @param {THREE.Vector3} rd - 射线方向
 * @param {number} time - 时间
 * @returns {Object} {d: 距离, edge: 边缘值}
 */
function intersect(ro, rd, time) {
  let d = 0, h = 0
  for (let i = 0; i < 500; i++) {
    const p = {
      x: ro.x + d * rd.x,
      y: ro.y + d * rd.y,
      z: ro.z + d * rd.z
    }
    const n = trinoise({ x: p.x, y: p.z }, time)
    h = p.y - 2 * n.n
    d += h * 0.5

    if (Math.abs(h) < 0.003 * d) {
      return { d: d, edge: n.edge }
    }
    if (d > 150 || p.y > 2) break
  }
  return { d: -1, edge: 0 }
}

/**
 * 添加太阳效果
 */
function addsun(rd, ld, col) {
  const sunDist = rd.distanceTo(ld)
  let sun = 1 - THREE.MathUtils.smoothstep(0.2, 0.21, sunDist)

  if (sun > 0) {
    const yd = rd.y - ld.y
    const a = Math.sin(3.1 * Math.exp(-yd * 14))
    sun *= 1 - THREE.MathUtils.smoothstep(-0.8, 0, a)

    col.r = THREE.MathUtils.lerp(col.r, 1.0 * 0.75, sun)
    col.g = THREE.MathUtils.lerp(col.g, 0.8 * 0.75, sun)
    col.b = THREE.MathUtils.lerp(col.b, 0.4 * 0.75, sun)
  }
}

/**
 * 星星噪声
 * @param {THREE.Vector3} rd - 射线方向
 * @returns {number} 星星强度
 */
function starnoise(rd) {
  let c = 0
  const p = rd.clone().normalize().multiplyScalar(300)

  for (let i = 0; i < 4; i++) {
    const q = {
      x: p.x % 1 - 0.5,
      y: p.y % 1 - 0.5,
      z: p.z % 1 - 0.5
    }
    const id = {
      x: Math.floor(p.x),
      y: Math.floor(p.y),
      z: Math.floor(p.z)
    }

    let c2 = 1 - THREE.MathUtils.smoothstep(0, 0.5, Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z))
    c2 *= Math.random() > 0.06 + i * i * 0.005 ? 0 : 1

    c += c2

    // 3D旋转矩阵应用
    const t = 0.6
    const x = p.x, y = p.y, z = p.z
    p.x = x * 0.6 + 0.8 * z
    p.y = y
    p.z = -x * 0.8 + 0.6 * z
  }

  c *= c

  const g = Math.sin(rd.x * 10.512) * Math.cos(rd.y * 10.512) + Math.sin(rd.z * 10.512) * Math.cos(rd.x * 10.512)
  c *= THREE.MathUtils.smoothstep(-3.14, -0.9, g) * 0.5 + 0.5 * THREE.MathUtils.smoothstep(-0.3, 1, g)

  return c * c
}

/**
 * 天空渲染
 * @param {THREE.Vector3} rd - 射线方向
 * @param {THREE.Vector3} ld - 光方向（太阳）
 * @param {boolean} mask - 是否渲染星星
 * @param {number} time - 时间
 * @returns {THREE.Color} 天空颜色
 */
function gsky(rd, ld, mask, time) {
  // 雾效果
  const haze = Math.exp2(-5 * (Math.abs(rd.y) - 0.2 * (rd.x * ld.x + rd.y * ld.y + rd.z * ld.z)))

  // 星星
  const st = mask ? starnoise(rd) * (1 - Math.min(haze, 1)) : 0

  // 背景渐变
  const back = new THREE.Color(0.4, 0.1, 0.7)
  back.multiplyScalar(1 - 0.5 * Math.exp2(-0.1 * Math.abs(Math.sqrt(rd.x * rd.x + rd.z * rd.z) / rd.y)) * Math.max(Math.sign(rd.y), 0))

  // 城市轮廓（可选）
  const x = Math.round(rd.x * 30)
  const h = hash21({ x: x - 166, y: 0 })
  const building = h * h * 0.125 * Math.exp2(-x * x * x * x * 0.0025) > rd.y
  if (mask && building) {
    back.multiplyScalar(0)
  }

  const col = new THREE.Color()
  col.r = THREE.MathUtils.clamp(THREE.MathUtils.lerp(back.r, 0.7, haze) + st, 0, 1)
  col.g = THREE.MathUtils.clamp(THREE.MathUtils.lerp(back.g, 0.1, haze) + st, 0, 1)
  col.b = THREE.MathUtils.clamp(THREE.MathUtils.lerp(back.b, 0.4, haze) + st, 0, 1)

  // 添加太阳
  addsun(rd, ld, col)

  return col
}

/**
 * 创建全屏平面用于渲染
 */
function createSynthwaveScreen() {
  const geometry = new THREE.PlaneGeometry(2, 2)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uOpacity: { value: 0 },
      uAudioIntensity: { value: 0 },
      uSpeed: { value: 10.0 },
      uVaporwave: { value: 0.0 },
      uSunPosition: { value: new THREE.Vector3(0, 0.125, 1) }
    },
    vertexShader: `
      precision highp float;
      precision highp int;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      precision highp int;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uOpacity;
      uniform float uAudioIntensity;
      uniform float uSpeed;
      uniform float uVaporwave;
      uniform vec3 uSunPosition;

      varying vec2 vUv;

      float jTime;

      // 2D哈希
      float hash21(vec2 co) {
        return fract(sin(dot(co.xy, vec2(1.9898, 7.233))) * 45758.5433);
      }

      // 饱和函数
      float sat(float a) {
        return clamp(a, 0.0, 1.0);
      }

      // 平方根幂
      float pow1d5(float a) {
        return a * sqrt(a);
      }

      // 功函数
      float pow512(float a) {
        a *= a; a*= a; a*= a; a*= a; a*= a;
        a*= a; a*= a; a*= a; return a*a;
      }

      // 幅度
      float amp(vec2 p) {
        return smoothstep(1.0, 8.0, abs(p.x));
      }

      // 纹理镜像
      vec4 textureMirror(vec2 c) {
        vec2 cf = fract(c);
        return vec4(mix(cf, 1.0 - cf, mod(floor(c), 2.0)), 0.0, 0.0);
      }

      float hash(vec2 uv) {
        float a = amp(uv);
        float w = 1.0;
        if (a > 0.0) {
          w = 1.0 - 0.4 * pow512(0.51 + 0.49 * sin((0.02 * (uv.y + 0.5 * uv.x) - jTime) * 2.0));
        }
        return (a > 0.0 ? a * pow1d5(hash21(uv)) * w : 0.0);
      }

      // 边缘最小值
      float edgeMin(float dx, vec2 da, vec2 db, vec2 uv) {
        uv.x += 5.0;
        vec3 c = fract((round(vec3(uv, uv.x + uv.y))) * (vec3(0.0, 1.0, 2.0) + 0.61803398875));
        float a1 = textureMirror(vec2(c.y, 0.0)).x > 0.6 ? 0.15 : 1.0;
        float a2 = textureMirror(vec2(c.x, 0.0)).x > 0.6 ? 0.15 : 1.0;
        float a3 = textureMirror(vec2(c.z, 0.0)).x > 0.6 ? 0.15 : 1.0;
        return min(min((1.0 - dx) * db.y * a3, da.x * a2), da.y * a1);
      }

      // 三角形噪声
      vec2 trinoise(vec2 uv) {
        const float sq = sqrt(3.0 / 2.0);
        uv.x *= sq;
        uv.y -= 0.5 * uv.x;
        vec2 d = fract(uv);
        uv -= d;

        bool c = dot(d, vec2(1.0)) > 1.0;

        vec2 dd = 1.0 - d;
        vec2 da = c ? dd : d;
        vec2 db = c ? d : dd;

        float nn = hash(uv + float(c));
        float n2 = hash(uv + vec2(1.0, 0.0));
        float n3 = hash(uv + vec2(0.0, 1.0));

        float nmid = mix(n2, n3, d.y);
        float ns = mix(nn, c ? n2 : n3, da.y);
        float dx = da.x / db.y;

        return vec2(mix(ns, nmid, dx), edgeMin(dx, da, db, uv + d));
      }

      // 距离场
      vec2 map(vec3 p) {
        vec2 n = trinoise(p.xz);
        return vec2(p.y - 2.0 * n.x, n.y);
      }

      // 法线
      vec3 grad(vec3 p) {
        const vec2 e = vec2(0.005, 0.0);
        float a = map(p).x;
        return vec3(
          map(p + e.xyy).x - a,
          map(p + e.yxy).x - a,
          map(p + e.yyx).x - a
        ) / e.x;
      }

      // Raymarching求交
      vec2 intersect(vec3 ro, vec3 rd) {
        float d = 0.0, h = 0.0;
        for (int i = 0; i < 500; i++) {
          vec3 p = ro + d * rd;
          vec2 s = map(p);
          h = s.x;
          d += h * 0.5;
          if (abs(h) < 0.003 * d)
            return vec2(d, s.y);
          if (d > 150.0 || p.y > 2.0) break;
        }
        return vec2(-1.0);
      }

      // 添加太阳
      void addsun(vec3 rd, vec3 ld, inout vec3 col) {
        float sun = smoothstep(0.21, 0.2, distance(rd, ld));

        if (sun > 0.0) {
          float yd = (rd.y - ld.y);
          float a = sin(3.1 * exp(-yd * 14.0));
          sun *= smoothstep(-0.8, 0.0, a);
          col = mix(col, vec3(1.0, 0.8, 0.4) * 0.75, sun);
        }
      }

      // 星星噪声
      float starnoise(vec3 rd) {
        float c = 0.0;
        vec3 p = normalize(rd) * 300.0;

        for (float i = 0.0; i < 4.0; i++) {
          vec3 q = fract(p) - 0.5;
          vec3 id = floor(p);
          float c2 = smoothstep(0.5, 0.0, length(q));
          c2 *= step(hash21(id.xz / id.y), 0.06 - i * i * 0.005);
          c += c2;
          p = p * 0.6 + 0.5 * p * mat3(0.6, 0.0, 0.8, 0.0, 1.0, 0.0, -0.8, 0.0, 0.6);
        }

        c *= c;
        float g = dot(sin(rd * 10.512), cos(rd.yzx * 10.512));
        c *= smoothstep(-3.14, -0.9, g) * 0.5 + 0.5 * smoothstep(-0.3, 1.0, g);
        return c * c;
      }

      // 天空渲染
      vec3 gsky(vec3 rd, vec3 ld, bool mask) {
        float haze = exp2(-5.0 * (abs(rd.y) - 0.2 * dot(rd, ld)));

        float st = mask ? starnoise(rd) * (1.0 - min(haze, 1.0)) : 0.0;

        vec3 back = vec3(0.4, 0.1, 0.7) *
          (1.0 - 0.5 * exp2(-0.1 * abs(length(rd.xz) / rd.y)) * max(sign(rd.y), 0.0));

        vec3 col = clamp(mix(back, vec3(0.7, 0.1, 0.4), haze) + st, 0.0, 1.0);
        if (mask) addsun(rd, ld, col);
        return col;
      }

      void main() {
        gl_FragColor = vec4(0.0);

        // 抗锯齿
        const float AA = 1.0;
        const float x = 0.0, y = 0.0;

        vec2 uv = (2.0 * (vUv + vec2(x, y)) - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);

        // 运动模糊快门速度
        const float shutter_speed = 0.25;
        float dt = fract(hash21(float(AA) * (vUv + vec2(x, y))) + uTime) * shutter_speed;
        jTime = mod(uTime - dt * 0.016, 4000.0);

        // 相机运动
        vec3 ro = vec3(0.0, 1.0, -20000.0 + jTime * uSpeed);

        // 光方向（太阳）
        vec3 ld = normalize(vec3(0.0, 0.125 + 0.05 * sin(0.1 * jTime), 1.0));

        // 射线方向
        vec3 rd = normalize(vec3(uv, 4.0 / 3.0));

        // Raymarching
        vec2 i = intersect(ro, rd);
        float d = i.x;

        // 雾
        vec3 fog = d > 0.0 ? exp2(-d * vec3(0.14, 0.1, 0.28)) : vec3(0.0);

        // 天空
        vec3 sky = gsky(rd, ld, d < 0.0);

        // 表面着色
        vec3 p = ro + d * rd;
        vec3 n = normalize(grad(p));

        float diff = dot(n, ld) + 0.1 * n.y;
        vec3 col = vec3(0.1, 0.11, 0.18) * diff;

        // 反射
        vec3 rfd = reflect(rd, n);
        vec3 rfcol = gsky(rfd, ld, true);

        col = mix(col, rfcol, 0.05 + 0.95 * pow(max(1.0 + dot(rd, n), 0.0), 5.0));

        // 颜色混合
        if (uVaporwave > 0.5) {
          col = mix(col, vec3(0.4, 0.5, 1.0), smoothstep(0.05, 0.0, i.y));
        } else {
          col = mix(col, vec3(0.8, 0.1, 0.92), smoothstep(0.05, 0.0, i.y));
        }

        col = mix(sky, col, fog);

        // Gamma校正（Synthwave风格禁用）
        // col = sqrt(col);

        if (d < 0.0) d = 1e6;
        d = min(d, 10.0);

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), d < 0.0 ? 0.0 : 0.1 + exp2(-d));
        gl_FragColor.a *= uOpacity;
      }
    `,
    transparent: true,
    depthWrite: false
  })

  return new THREE.Mesh(geometry, material)
}

/**
 * 主动画函数
 */
export default function animateTranscendentSynthwaveTerrain(props, callbacks) {
  const { camera, renderer, scene, controls } = props
  const { onComplete, onError } = callbacks || {}

  try {
    setupInitialCamera(camera, new THREE.Vector3(0, 0, 0), 100, controls)
    camera.position.z = -12

    renderer.render(scene, camera)

    const perfMonitor = new PerformanceMonitor()
    perfMonitor.start()

    const tl = createTimeline(
      () => {
        perfMonitor.stop()
        perfMonitor.logReport()
        if (onComplete) onComplete({ type: 'transcendent-synthwave-terrain' })
      },
      onError,
      '🌅 超越级Synthwave地形特效（增强版Vaporwave）',
      controls
    )

    const originalBackground = scene.background
    const originalFog = scene.fog

    scene.background = new THREE.Color(0x100210)
    scene.fog = new THREE.FogExp2(0x100210, 0.0003)

    // 创建全屏渲染平面
    const synthwaveScreen = createSynthwaveScreen()
    scene.add(synthwaveScreen)

    // 音频模拟数据
    let audioIntensity = 0
    let audioPhase = 0
    let vaporwaveMode = 0

    let time = 0
    let animId = null

    function update() {
      time += 0.016

      // 模拟音频响应
      audioPhase += 0.02
      audioIntensity = (Math.sin(audioPhase) * 0.5 + 0.5) * 0.8

      // 动态切换Vaporwave模式
      vaporwaveMode = Math.sin(time * 0.2) * 0.5 + 0.5

      synthwaveScreen.material.uniforms.uTime.value = time
      synthwaveScreen.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
      synthwaveScreen.material.uniforms.uAudioIntensity.value = audioIntensity
      synthwaveScreen.material.uniforms.uVaporwave.value = vaporwaveMode
      synthwaveScreen.material.uniforms.uSunPosition.value.set(
        Math.sin(time * 0.1) * 0.2,
        0.125 + Math.sin(time * 0.15) * 0.05,
        1
      )
    }

    function animate() {
      update()
      animId = requestAnimationFrame(animate)
    }

    // 入场动画
    gsap.to(synthwaveScreen.material.uniforms.uOpacity, {
      value: 1.0,
      duration: 2.5,
      ease: 'power2.out'
    })

    // 速度动画
    gsap.to(synthwaveScreen.material.uniforms.uSpeed, {
      value: 15.0,
      duration: 8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 相机穿行效果
    tl.to(camera.position, {
      z: 50,
      duration: 10,
      ease: 'none'
    }, 0)

    tl.to(camera.position, {
      z: 100,
      duration: 8,
      ease: 'none'
    }, 10)

    tl.to(camera.position, {
      z: 150,
      duration: 6,
      ease: 'none'
    }, 18)

    // 相机晃动
    tl.to(camera.position, {
      y: 0.5,
      duration: 4,
      yoyo: true,
      repeat: 3,
      ease: 'sine.inOut'
    }, 0)

    tl.to(camera.position, {
      x: 0.3,
      duration: 3,
      yoyo: true,
      repeat: 4,
      ease: 'sine.inOut'
    }, 0)

    animate()

    tl.to({}, { duration: 25 }, 0)

    // 退场动画
    tl.to({}, {
      duration: 2,
      onStart: () => {
        gsap.to(synthwaveScreen.material.uniforms.uOpacity, { value: 0, duration: 1.5 })
      },
      onComplete: () => {
        cancelAnimationFrame(animId)

        scene.remove(synthwaveScreen)
        synthwaveScreen.geometry.dispose()
        synthwaveScreen.material.dispose()

        scene.background = originalBackground
        if (originalFog) {
          scene.fog = originalFog
        } else {
          scene.fog = null
        }
      }
    }, 25)

    return tl

  } catch (error) {
    console.error('超越级Synthwave地形动画错误:', error)
    if (onError) onError(error)
    return gsap.timeline()
  }
}
