/**
 * 后期处理特效
 * 使用 EffectComposer 实现泛光、故障等效果
 */

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { gsap } from 'gsap'

/**
 * 创建后期处理器
 * @param {WebGLRenderer} renderer - Three.js 渲染器
 * @param {Scene} scene - Three.js 场景
 * @param {Camera} camera - Three.js 相机
 * @param {Number} width - 渲染宽度
 * @param {Number} height - 渲染高度
 * @returns {Object} 包含 composer 和各效果的引用
 */
export function createPostProcessor(renderer, scene, camera, width, height) {
  const composer = new EffectComposer(renderer)

  // 渲染通道
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // 泛光效果
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5,  // 强度
    0.4,  // 半径
    0.85  // 阈值
  )
  bloomPass.enabled = false
  composer.addPass(bloomPass)

  // 故障效果
  const glitchPass = new GlitchPass()
  glitchPass.goWild = false
  glitchPass.enabled = false
  composer.addPass(glitchPass)

  // 胶片效果
  const filmPass = new FilmPass(
    0.35,   // 噪点强度
    0.025,  // 扫描线强度
    648,    // 扫描线数量
    false
  )
  filmPass.enabled = false
  composer.addPass(filmPass)

  return {
    composer,
    renderPass,
    bloomPass,
    glitchPass,
    filmPass
  }
}

/**
 * 泛光动画
 * @param {UnrealBloomPass} bloomPass - 泛光效果对象
 * @param {Number} duration - 动画持续时间（秒）
 * @param {Boolean} explode - 是否为爆炸式泛光
 */
export function animateBloom(bloomPass, duration = 2, explode = true) {
  bloomPass.enabled = true

  if (explode) {
    gsap.timeline()
      .to(bloomPass, {
        strength: 4,
        radius: 1.2,
        threshold: 0.5,
        duration: duration * 0.3,
        ease: 'power2.in'
      })
      .to(bloomPass, {
        strength: 1.5,
        radius: 0.4,
        threshold: 0.85,
        duration: duration * 0.7,
        ease: 'power2.out'
      })
  } else {
    gsap.to(bloomPass, {
      strength: 2.5,
      duration: duration * 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.to(bloomPass, {
          strength: 1.5,
          duration: 0.5
        })
      }
    })
  }
}

/**
 * 关闭泛光效果
 * @param {UnrealBloomPass} bloomPass - 泛光效果对象
 */
export function disableBloom(bloomPass) {
  gsap.to(bloomPass, {
    strength: 0,
    duration: 0.5,
    onComplete: () => {
      bloomPass.enabled = false
      bloomPass.strength = 1.5
    }
  })
}

/**
 * 故障动画
 * @param {GlitchPass} glitchPass - 故障效果对象
 * @param {Number} duration - 持续时间（秒）
 * @param {Number} intensity - 故障强度（0-1）
 */
export function animateGlitch(glitchPass, duration = 1.5, intensity = 0.5) {
  glitchPass.enabled = true
  glitchPass.goWild = intensity > 0.7

  // 短暂的故障效果
  const glitchCount = Math.floor(duration * 10)
  for (let i = 0; i < glitchCount; i++) {
    gsap.to(glitchPass, {
      duration: 0.05 + Math.random() * 0.1,
      delay: i * 0.1,
      onComplete: () => {
        if (Math.random() > 0.5) {
          glitchPass.enabled = false
        } else {
          glitchPass.enabled = true
          glitchPass.curF = Math.random()
        }
      }
    })
  }

  // 最终关闭
  gsap.to({}, {
    duration: 0.1,
    delay: duration,
    onComplete: () => {
      glitchPass.enabled = false
      glitchPass.goWild = false
    }
  })
}

/**
 * 胶片动画
 * @param {FilmPass} filmPass - 胶片效果对象
 * @param {Number} duration - 持续时间（秒）
 */
export function animateFilm(filmPass, duration = 2) {
  filmPass.enabled = true

  gsap.to(filmPass, {
    noiseIntensity: 0.6,
    scanlineIntensity: 0.05,
    duration: duration * 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      gsap.to(filmPass, {
        noiseIntensity: 0,
        scanlineIntensity: 0,
        duration: 0.5,
        onComplete: () => {
          filmPass.enabled = false
          filmPass.noiseIntensity = 0.35
          filmPass.scanlineIntensity = 0.025
        }
      })
    }
  })
}
