/**
 * 全息特效核心库
 * 专注于全息投影、扫描线、故障效果、霓虹发光等视觉风格
 */

import * as THREE from 'three'

/**
 * 全息投影材质
 * 特点：边缘发光、扫描线、半透明、青色/蓝色调
 */
export class HolographicMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    const {
      color = new THREE.Color(0x00ffff),
      scanlineSpeed = 0.5,
      scanlineIntensity = 0.3,
      glitchIntensity = 0.0,
      glowIntensity = 1.0
    } = options

    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uScanlineSpeed: { value: scanlineSpeed },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchIntensity: { value: glitchIntensity },
        uGlowIntensity: { value: glowIntensity },
        uAlpha: { value: 1.0 }
      },

      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uScanlineSpeed;
        uniform float uScanlineIntensity;
        uniform float uGlitchIntensity;
        uniform float uGlowIntensity;
        uniform float uAlpha;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // 基础全息颜色
          vec3 color = uColor;

          // 扫描线效果
          float scanline = sin(vUv.y * 50.0 + uTime * uScanlineSpeed * 10.0) * 0.5 + 0.5;
          color *= 1.0 - scanline * uScanlineIntensity * 0.5;

          // 边缘发光（Fresnel 效应）
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 3.0);
          color += fresnel * uGlowIntensity * 0.5;

          // 故障效果
          if (uGlitchIntensity > 0.0) {
            float glitch = step(0.98, sin(uTime * 20.0 + vUv.y * 100.0));
            float offset = glitch * uGlitchIntensity * 0.1;
            color.r = mix(color.r, color.r + offset, glitch);
            color.g = mix(color.g, color.g - offset, glitch);
          }

          // 半透明
          gl_FragColor = vec4(color, uAlpha * (0.3 + fresnel * 0.7));
        }
      `,

      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  update(time) {
    this.uniforms.uTime.value = time
  }

  setGlitch(intensity) {
    this.uniforms.uGlitchIntensity.value = intensity
  }

  setColor(color) {
    this.uniforms.uColor.value.set(color)
  }
}

/**
 * 全息扫描线材质
 */
export class HolographicScanlineMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    const {
      color = new THREE.Color(0x00ffff),
      lineCount = 50,
      lineSpeed = 2.0,
      lineIntensity = 0.8
    } = options

    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uLineCount: { value: lineCount },
        uLineSpeed: { value: lineSpeed },
        uLineIntensity: { value: lineIntensity }
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
        uniform float uLineCount;
        uniform float uLineSpeed;
        uniform float uLineIntensity;

        varying vec2 vUv;

        void main() {
          // 移动的扫描线
          float scanline = sin(vUv.y * uLineCount - uTime * uLineSpeed) * 0.5 + 0.5;
          float line = pow(scanline, 10.0) * uLineIntensity;

          // 扫描线发光
          vec3 color = uColor * (line + 0.2);

          // 渐变透明度
          float alpha = line * 0.5 + 0.1;

          gl_FragColor = vec4(color, alpha);
        }
      `,

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  update(time) {
    this.uniforms.uTime.value = time
  }
}

/**
 * 全息粒子材质
 */
export class HolographicParticleMaterial extends THREE.PointsMaterial {
  constructor(options = {}) {
    const {
      color = 0x00ffff,
      size = 2,
      opacity = 0.8
    } = options

    super({
      color: color,
      size: size,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })
  }
}

/**
 * 全息网格材质
 */
export class HolographicGridMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    const {
      color = new THREE.Color(0x00aaff),
      gridSpacing = 10.0,
      gridLineWidth = 0.02,
      glowIntensity = 1.0
    } = options

    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uGridSpacing: { value: gridSpacing },
        uGridLineWidth: { value: gridLineWidth },
        uGlowIntensity: { value: glowIntensity }
      },

      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uGridSpacing;
        uniform float uGridLineWidth;
        uniform float uGlowIntensity;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          // 网格线
          vec2 grid = abs(fract(vPosition.xy / uGridSpacing - 0.5) - 0.5) / fwidth(vPosition.xy / uGridSpacing);
          float line = min(grid.x, grid.y);
          float gridLine = 1.0 - min(line, 1.0);

          // 网格发光
          float glow = gridLine * uGlowIntensity;

          // 距离衰减
          float distance = length(vPosition.xy);
          float falloff = 1.0 - smoothstep(0.0, 100.0, distance);

          // 组合效果
          vec3 color = uColor * glow * falloff;
          float alpha = gridLine * 0.5 * falloff;

          gl_FragColor = vec4(color, alpha);
        }
      `,

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  update(time) {
    this.uniforms.uTime.value = time
  }
}

/**
 * 全息故障效果材质
 */
export class HolographicGlitchMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    const {
      color = new THREE.Color(0xff00ff),
      glitchSpeed = 5.0,
      glitchAmount = 0.3
    } = options

    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uGlitchSpeed: { value: glitchSpeed },
        uGlitchAmount: { value: glitchAmount }
      },

      vertexShader: `
        uniform float uTime;
        uniform float uGlitchAmount;

        varying vec2 vUv;

        void main() {
          vUv = uv;

          // 顶点位移
          vec3 pos = position;
          float glitch = step(0.98, sin(uTime * 10.0 + position.y * 50.0));
          pos.x += glitch * uGlitchAmount * sin(uTime * 20.0) * 0.5;
          pos.y += glitch * uGlitchAmount * cos(uTime * 20.0) * 0.5;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,

      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uGlitchSpeed;
        uniform float uGlitchAmount;

        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          // RGB 分离
          float shift = sin(uTime * uGlitchSpeed) * uGlitchAmount * 0.05;
          vec2 uvR = vUv + vec2(shift, 0.0);
          vec2 uvG = vUv;
          vec2 uvB = vUv - vec2(shift, 0.0);

          // 随机故障
          float glitch = step(0.97, random(floor(vUv * 50.0) + floor(uTime * 10.0)));

          // 颜色组合
          vec3 color;
          color.r = uColor.r * (1.0 + glitch * 0.5);
          color.g = uColor.g;
          color.b = uColor.b * (1.0 - glitch * 0.5);

          // 闪烁
          float flicker = 0.8 + 0.2 * sin(uTime * 20.0);

          gl_FragColor = vec4(color * flicker, 0.8);
        }
      `,

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  update(time) {
    this.uniforms.uTime.value = time
  }
}

/**
 * 全息光束材质
 */
export class HolographicBeamMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    const {
      color = new THREE.Color(0x00ffff),
      beamWidth = 0.5,
      beamIntensity = 1.0,
      beamSpeed = 2.0
    } = options

    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uBeamWidth: { value: beamWidth },
        uBeamIntensity: { value: beamIntensity },
        uBeamSpeed: { value: beamSpeed }
      },

      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uBeamWidth;
        uniform float uBeamIntensity;
        uniform float uBeamSpeed;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          // 光束核心
          float beam = exp(-abs(vUv.x - 0.5) / uBeamWidth);

          // 光束脉动
          float pulse = 0.8 + 0.2 * sin(uTime * uBeamSpeed);

          // 光束流动
          float flow = 0.5 + 0.5 * sin(vUv.y * 20.0 - uTime * uBeamSpeed * 3.0);

          // 组合效果
          float intensity = beam * pulse * flow * uBeamIntensity;

          vec3 color = uColor * intensity;
          float alpha = beam * 0.6;

          gl_FragColor = vec4(color, alpha);
        }
      `,

      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  update(time) {
    this.uniforms.uTime.value = time
  }
}
