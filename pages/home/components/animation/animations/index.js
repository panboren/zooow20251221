/**
 * 动画模块导出文件
 * 统一导出所有动画函数
 */

import animateEpicDive from './epic-dive'
import animateDimensionFold from './dimension-fold'
import animateEnergyWave from './energy-wave'
import animateDizzyCam from './dizzy-cam'
import animateHyperspace from './hyperspace'
import animateTimeRift from './time-rift'
import animatePlanetExplosion from './planet-explosion'
import animateVirtualReality from './virtual-reality'
import animateSceneRoaming from './scene-roaming'
import animateOrbitalRotation from './orbital-rotation'
import animateDimensionalPortal from './dimensional-portal'
import animateTimeTravel from './time-travel'
import animateTimeRewind from './time-rewind'
import animateSpaceWarp from './space-warp'
import animateQuantumShift from './quantum-shift'
// 新增特效动画
import animateParticleExplosion from './particle-explosion'
import animateGlitchEffect from './glitch-effect'
import animateCrystalShards from './crystal-shards'
import animateLightningChain from './lightning-chain'
import animateNebulaVortex from './nebula-vortex'
import animateQuantumRainbowTunnel from './quantum-rainbow-tunnel'
import animateEnergyPulseRing from './energy-pulse-ring'
import animateLightWings from './light-wings'
// 新增炸裂特效动画
import animateCosmicSupernova from './cosmic-supernova'
import animateQuantumDimensionBreak from './quantum-dimension-break'
import animateHyperspaceWarpDrive from './hyperspace-warp-drive'


import { ANIMATION_CONFIG } from './utils'


import animateCherryBlossom from './cherry-blossom'
import animateButterflySwarm from './butterfly-swarm'
import animateOceanAurora from './ocean-aurora'
import animateGalaxyVortex from './galaxy-vortex'
import animateAuroraFluid from './aurora-fluid'
import animateNebulaEnergyBurst from './nebula-vortex-open'

import animateQuantumRainbowFoam from './quantum-rainbow-foam'

import animateTimeShards from './time-shards'


import animateCosmicParticleSymphony from './cosmic-particle-symphony'












/**
 * 动画函数映射表
 * 将动画类型字符串映射到对应的动画函数
 */
export const animations = {
  [ANIMATION_CONFIG.EPIC_DIVE]: animateEpicDive,
  [ANIMATION_CONFIG.SPACE_WARP]: animateSpaceWarp,
  [ANIMATION_CONFIG.QUANTUM_SHIFT]: animateQuantumShift,
  [ANIMATION_CONFIG.DIMENSION_FOLD]: animateDimensionFold,
  [ANIMATION_CONFIG.ENERGY_WAVE]: animateEnergyWave,
  [ANIMATION_CONFIG.DIZZY_CAM]: animateDizzyCam,
  [ANIMATION_CONFIG.HYPERSPACE]: animateHyperspace,
  [ANIMATION_CONFIG.TIME_RIFT]: animateTimeRift,
  [ANIMATION_CONFIG.PLANET_EXPLOSION]: animatePlanetExplosion,
  [ANIMATION_CONFIG.VIRTUAL_REALITY]: animateVirtualReality,
  [ANIMATION_CONFIG.SCENE_ROAMING]: animateSceneRoaming,
  [ANIMATION_CONFIG.ORBITAL_ROTATION]: animateOrbitalRotation,
  [ANIMATION_CONFIG.DIMENSIONAL_PORTAL]: animateDimensionalPortal,
  [ANIMATION_CONFIG.TIME_TRAVEL]: animateTimeTravel,
  [ANIMATION_CONFIG.TIME_REWIND]: animateTimeRewind,
  // 新增特效动画
  'particle-explosion': animateParticleExplosion,
  'glitch-effect': animateGlitchEffect,
  'crystal-shards': animateCrystalShards,
  'lightning-chain': animateLightningChain,
  'cherry-blossom': animateCherryBlossom,
  'butterfly-swarm': animateButterflySwarm,
  'ocean-aurora': animateOceanAurora,
  'galaxy-vortex': animateGalaxyVortex,
  'aurora-fluid': animateAuroraFluid,

  'nebula-vortex': animateNebulaVortex,
  'quantum-rainbow-tunnel': animateQuantumRainbowTunnel,
  'energy-pulse-ring': animateEnergyPulseRing,
  'light-wings': animateLightWings,
  // 新增炸裂特效动画
  'cosmic-supernova': animateCosmicSupernova,
  'quantum-dimension-break': animateQuantumDimensionBreak,
  'hyperspace-warp-drive': animateHyperspaceWarpDrive,
  'animate-nebula-energy-burst': animateNebulaEnergyBurst,
  'quantum-rainbow-foam': animateQuantumRainbowFoam,
  'time-shards': animateTimeShards,
  'cosmic-particle-symphony': animateCosmicParticleSymphony
}

/**
 * 获取所有可用的动画类型
 */
export const getAnimationTypes = () => Object.keys(animations)

/**
 * 默认导出
 */
export default animations
