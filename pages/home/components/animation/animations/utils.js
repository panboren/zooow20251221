/**
 * 动画工具函数库（加速版）
 * 提供所有动画共享的通用功能
 * 新增：全局速度倍率控制
 */

import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * 动画配置常量
 */
export const ANIMATION_CONFIG = {
  EPIC_DIVE: 'epic-dive',
  SPACE_WARP: 'space-warp',
  MATRIX_HACK: 'matrix-hack',
  QUANTUM_SHIFT: 'quantum-shift',
  DIMENSION_FOLD: 'dimension-fold',
  ENERGY_WAVE: 'energy-wave',
  DIZZY_CAM: 'dizzy-cam',
  HYPERSPACE: 'hyperspace',
  TIME_RIFT: 'time-rift',
  PLANET_EXPLOSION: 'planet-explosion',
  QUANTUM_ENTANGLEMENT: 'quantum-entanglement',
  VIRTUAL_REALITY: 'virtual-reality',
  SCENE_ROAMING: 'scene-roaming',
  ORBITAL_ROTATION: 'orbital-rotation',
  DIMENSIONAL_PORTAL: 'dimensional-portal',
  TIME_TRAVEL: 'time-travel',
  BLACK_HOLE: 'black-hole',
  COSMIC_BIG_BANG: 'cosmic-big-bang',
  DIMENSION_COLLAPSE: 'dimension-collapse',
  TIME_REWIND: 'time-rewind',

  // ✅ 新增：全局速度倍率配置
  // 值越小，动画越快。建议范围：0.4-1.0
  // 0.5 = 2倍速（快）
  // 0.6 = 1.67倍速（较快）
  // 0.7 = 1.43倍速（中等快）
  // 1.0 = 正常速度（默认）
  SPEED_MULTIPLIER: 0.5,  // 🔥 默认2倍速

  DEFAULT_DURATION: 7000,
  PARTICLE_COUNT: 50,
  START_FOV: 170,
  FINAL_FOV: 75,
  FINAL_POSITION: { x: 0.01, y: 0.01, z: 0.01 },
  FINAL_THETA: Math.PI / 2.5,
  FINAL_PHI: Math.PI / 1.9
}

/**
 * 错误信息常量
 */
export const ERROR_MESSAGES = {
  NO_CAMERA: 'Camera not available for animation',
  NO_CONTROLS: 'Controls not available for animation',
  ANIMATION_FAILED: 'Animation failed',
  RENDER_FAILED: 'Render failed during animation'
}

/**
 * ✅ 应用速度倍率到时长
 * @param {Number} duration - 原始时长
 * @returns {Number} 调整后的时长
 */
export function applySpeedMultiplier(duration) {
  return duration * ANIMATION_CONFIG.SPEED_MULTIPLIER
}

/**
 * ✅ 创建 GSAP 时间线（带速度倍率）
 * @param {Function} onComplete - 完成回调
 * @param {Function} onError - 错误回调
 * @param {String} animationName - 动画名称
 * @returns {Timeline} GSAP 时间线对象
 */
export function createTimeline(onComplete, onError, animationName, controls = null) {
  const originalDefaultDuration = gsap.defaults().duration || 1

  // 应用全局速度倍率
  gsap.defaults({
    duration: applySpeedMultiplier(originalDefaultDuration)
  })

  return gsap.timeline({
    onComplete,
    onError: () => onError(new Error(`${animationName} animation failed`)),
    onUpdate: function() {
      // 更新控制器
      try {
        if (controls) {  // ✅ 使用传入的 controls
          controls.update()
        }
      } catch (error) {
        console.error('控制器更新错误:', error)
      }
    }
  })
}

/**
 * 设置相机初始状态
 * @param {Camera} camera - Three.js 相机对象
 * @param {Vector3} startPosition - 起始位置
 * @param {Number} fov - 初始视野角度
 * @param {Controls} controls - 轨道控制器
 */
export function setupInitialCamera(camera, startPosition, fov = 170, controls = null) {
  if (!camera) {
    throw new Error(ERROR_MESSAGES.NO_CAMERA)
  }

  // 设置起始位置
  camera.position.copy(startPosition)

  // 设置FOV
  camera.fov = fov
  camera.updateProjectionMatrix()

  // 设置控制器
  if (controls) {
    controls.target.set(0, 0, 0)
    controls.enabled = false
  }
}

/**
 * 设置相机最终状态
 * @param {Camera} camera - Three.js 相机对象
 * @param {Controls} controls - 轨道控制器
 */
export function setupFinalCamera(camera, controls = null) {
  if (!camera) {
    throw new Error(ERROR_MESSAGES.NO_CAMERA)
  }

  // 使用球坐标系统定位最终位置
  const spherical = new THREE.Spherical()
  spherical.radius = ANIMATION_CONFIG.FINAL_POSITION.x
  spherical.theta = ANIMATION_CONFIG.FINAL_THETA
  spherical.phi = ANIMATION_CONFIG.FINAL_PHI

  camera.position.setFromSpherical(spherical)
  camera.lookAt(controls?.target || new THREE.Vector3(0, 0, 0))

  // 设置最终FOV
  camera.fov = ANIMATION_CONFIG.FINAL_FOV
  camera.updateProjectionMatrix()

  // 启用控制器
  if (controls) {
    controls.enabled = true
    controls.update()
  }
}

/**
 * 安全的相机变换
 * @param {Function} transformFn - 变换函数
 * @param {String} errorContext - 错误上下文信息
 */
export function safeCameraTransform(transformFn, errorContext) {
  try {
    return transformFn()
  } catch (error) {
    console.error(`${errorContext}:`, error)
    return null
  }
}

/**
 * 渲染场景
 * @param {WebGLRenderer} renderer - 渲染器
 * @param {Scene} scene - 场景
 */
export function renderScene(renderer, scene, camera) {
  try {
    renderer.render(scene, camera)
  } catch (error) {
    console.error('场景渲染失败:', error)
  }
}
