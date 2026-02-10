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

// 🔮 全息投影特效系统（全新技术栈）
import {
  animateHolographicDataStream,
  animateHolographicRingArray,
  animateHolographicSpiral,
  animateHolographicSphereArray,
  animateHolographicGlitch
} from './holographic/holographic-animations-enhanced.js'

// 🎭 专业级全息多边形特效（全新电影级VFX）
import animateHolographicPolygonPrism from './holographic-polygon-prism.js'
import animateHolographicGeometricNexus from './holographic-geometric-nexus.js'
import animateHolographicPolyphonicMatrix from './holographic-polyphonic-matrix.js'
import animateHolographicCrystallineFormation from './holographic-crystalline-formation.js'
import animateHolographicSacredGeometry from './holographic-sacred-geometry.js'

// 🌌 超越级全息特效（全新突破）
import animateHolographicNexusRift from './holographic-nexus-rift.js'
import animateHolographicNeuralNetwork from './holographic-neural-network.js'
import animateHolographicQuantumFlux from './holographic-quantum-flux.js'
import animateHolographicDimensionFold from './holographic-dimension-fold.js'
import animateHolographicVoidCosmos from './holographic-void-cosmos.js'

// 🌌 次世代超越级全息特效（奥斯卡级别VFX）
import animateTranscendentSingularity from './transcendent-singularity.js'
import animateTranscendentConsciousness from './transcendent-consciousness.js'
import animateTranscendentEntropy from './transcendent-entropy.js'
import animateTranscendentRaymarchingTunnel from './transcendent-raymarching-tunnel.js'
import animateTranscendentRocaille from './transcendent-rocaille.js'
import animateTranscendentFractalPyramid from './transcendent-fractal-pyramid.js'
import animateTranscendentFractalVortex from './transcendent-fractal-vortex.js'
    import animateTranscendentSynthwaveTerrain from './transcendent-synthwave-terrain.js'
    import animateTranscendentVaporwaveCity from './transcendent-vaporwave-city.js'
    import animateTranscendentMetaOrb from './transcendent-meta-orb.js'
    import animateTranscendentKaleidosphere from './transcendent-kaleidosphere.js'
    import animateTranscendentVolumetricCloud from './transcendent-volumetric-cloud.js'
    import animateTranscendentSDFArchitecture from './transcendent-sdf-architecture.js'
    import animateTranscendentFractalHueScape from './transcendent-fractal-hue-scape.js'
    import animateTranscendentUltimateSynthesis from './transcendent-ultimate-synthesis.js'

    // ✨ 传说级全息特效（奇迹重现）
import animateHolographicAuroraBorealis from './holographic-aurora-borealis.js'
import animateHolographicBioluminescence from './holographic-bioluminescence.js'
import animateHolographicCrystalCathedral from './holographic-crystal-cathedral.js'
import animateHolographicPhoenixRebirth from './holographic-phoenix-rebirth.js'
import animateHolographicEtherealGarden from './holographic-ethereal-garden.js'

// 🌟 神话级全息特效（传说超越）
import animateHolographicCreation from './holographic-creation.js'
import animateHolographicDragonAwakening from './holographic-dragon-awakening.js'

// 🧘 全新禅意全息特效（东方美学）
import animateHolographicZenithMandala from './holographic-zenith-mandala.js'

// 新增特效动画
import animateCyberGridCity from './cyber-grid-city'
import animateDNAHelix from './dna-helix'
import animateAncientRuins from './ancient-ruins'
import animateDigitalRain from './digital-rain'
import animatePortalGate from './portal-gate'
import animateEnergySphere from './energy-sphere'
import animateCrystalPyramid from './crystal-pyramid'
import animateSpectralWaves from './spectral-waves.js'
import animateQuantumMatrix from './quantum-matrix.js'
import animateTimeWeaver from './time-weaver.js'
import animateStellarWhisperer from './stellar-whisperer.js'
import animateGalacticVortex from './galactic-vortex.js'
import animateQuantumLeap from './quantum-leap.js'

// 全新维度共鸣交响曲特效
import animateDimensionalResonance from './dimensional-resonance-symphony.js'

// 全新虚空创世交响曲特效
import animateVoidCreation from './void-creation-symphony.js'

// 全新量子纠缠时空交响曲特效
import animateQuantumEntanglement from './quantum-entanglement-symphony.js'

// 全新宇宙史诗交响曲特效
import animateCosmicEpic from './cosmic-epic-symphony.js'

// 全新时间之沙特效
import animateTimeSand from './time-sand.js'

// 全新风花雪月特效
import animateWindFlowerSnowMoon from './wind-flower-snow-moon.js'

// 全新烟花月夜特效
import animateFireworksMoonNight from './fireworks-moon-night.js'

// 全新青春年华特效


// 组合动画 - 使用动态导入避免 SSR 问题
import animateCosmicRainfall from './cosmic-rainfall.js'
import animateHyperspacePortal from './hyperspace-portal.js'
import animateCyberEnergyExplosion from './cyber-energy-explosion.js'
import animateGalaxyTimePortal from './galaxy-time-portal.js'
// 新增组合动画
import animateCrystalAuroraDream from './crystal-aurora-dream.js'
import animateQuantumFireStorm from './quantum-fire-storm.js'
import animateButterflyNebulaDance from './butterfly-nebula-dance.js'
import animateAncientLightningAwakening from './ancient-lightning-awakening.js'
import animateDNAQuantumEvolution from './dna-quantum-evolution.js'


import animateBigBangGenesis from './big-bang-genesis-optimized.js'

// 全新超越级特效
import animateCyberSpaceRift from './cyber-space-rift.js'
import animateInterstellarSupernova from './interstellar-supernova.js'
import animateQuantumDreamWeaver from './quantum-dream-weaver.js'
import animateEternalReturn from './eternal-return-optimized.js'
import animateAuroraFantasy from './aurora-fantasy.js'

// 全新维度创世交响曲特效（超越级）
import animateDimensionGenesis from './dimension-genesis-symphony.js'

// 全新数字生命绽放特效（独特概念）
import animateDigitalLifeBloom from './digital-life-bloom.js'


// 太极-Taichi.js + Three.js 融合特效
import animateTaichiThree from '../taichi-three-animation/taichi-shuimo-effect.js'
import animateTaichiYouth from '../taichi-three-animation/taichi-youth.js'
import animateDewdropLens from '../taichi-three-animation/dewdrop-lens-prairie.js'
import animateGalaxyButterfly from '../taichi-three-animation/galaxy-butterfly.js'
import animateElegantSnowMoon from '../taichi-three-animation/elegant-snow-moon.js'


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
  'light-wings': animateLightWings,
  // 新增炸裂特效动画
  'cosmic-supernova': animateCosmicSupernova,
  'quantum-dimension-break': animateQuantumDimensionBreak,
  'hyperspace-warp-drive': animateHyperspaceWarpDrive,
  'animate-nebula-energy-burst': animateNebulaEnergyBurst,
  'quantum-rainbow-foam': animateQuantumRainbowFoam,
  'time-shards': animateTimeShards,
  'cosmic-particle-symphony': animateCosmicParticleSymphony,
  'cyber-grid-city': animateCyberGridCity,
  'dna-helix': animateDNAHelix,
  'ancient-ruins': animateAncientRuins,
  'digital-rain': animateDigitalRain,
  'portal-gate': animatePortalGate,
  'energy-sphere': animateEnergySphere,
  'crystal-pyramid': animateCrystalPyramid,
   'spectral-waves': animateSpectralWaves,
   'quantum-matrix': animateQuantumMatrix,
   'time-weaver': animateTimeWeaver,
   'stellar-whisperer': animateStellarWhisperer,

   'galactic-vortex': animateGalacticVortex,
   'quantum-leap': animateQuantumLeap,

   // 全新维度共鸣交响曲特效
   'dimensional-resonance': animateDimensionalResonance,

   // 全新虚空创世交响曲特效
   'void-creation': animateVoidCreation,

   // 全新量子纠缠时空交响曲特效
   'quantum-entanglement': animateQuantumEntanglement,

   // 全新宇宙史诗交响曲特效
   'cosmic-epic': animateCosmicEpic,

   // 全新时间之沙特效
   'time-sand': animateTimeSand,

   // 全新风花雪月特效
   'wind-flower-snow-moon': animateWindFlowerSnowMoon,

   // 全新烟花月夜特效
   'fireworks-moon-night': animateFireworksMoonNight,



   // 组合动画
   'cosmic-rainfall': animateCosmicRainfall,
   'hyperspace-portal': animateHyperspacePortal,
   'cyber-energy-explosion': animateCyberEnergyExplosion,
   'galaxy-time-portal': animateGalaxyTimePortal,
   // 新增组合动画
   'crystal-aurora-dream': animateCrystalAuroraDream,
   'quantum-fire-storm': animateQuantumFireStorm,
   'butterfly-nebula-dance': animateButterflyNebulaDance,
   'ancient-lightning-awakening': animateAncientLightningAwakening,
   'dna-quantum-evolution': animateDNAQuantumEvolution,



    'big-bang-genesis': animateBigBangGenesis,

    // 全新超越级特效
    'cyber-space-rift': animateCyberSpaceRift,
    'interstellar-supernova': animateInterstellarSupernova,
    'quantum-dream-weaver': animateQuantumDreamWeaver,
    'eternal-return': animateEternalReturn,
    'aurora-fantasy': animateAuroraFantasy,

    // 全新维度创世交响曲特效（超越级）
    'dimension-genesis': animateDimensionGenesis,

    // 全新数字生命绽放特效（独特概念）
    'digital-life-bloom': animateDigitalLifeBloom,


// 太极-Taichi.js + Three.js 融合特效
    [ANIMATION_CONFIG.TAICHI_THREE]: animateTaichiThree,
    'taichi-youth': animateTaichiYouth,
    'dewdrop-lens-prairie': animateDewdropLens,
    'galaxy-butterfly': animateGalaxyButterfly,
    'elegant-snow-moon': animateElegantSnowMoon,

    // 🔮 全息投影特效系统（全新技术栈）
    'holographic-data-stream': animateHolographicDataStream,
    'holographic-ring-array': animateHolographicRingArray,
    'holographic-spiral': animateHolographicSpiral,
    'holographic-sphere-array': animateHolographicSphereArray,
    'holographic-glitch': animateHolographicGlitch,

    // 🎭 专业级全息多边形特效（全新电影级VFX）
    'holographic-polygon-prism': animateHolographicPolygonPrism,
    'holographic-geometric-nexus': animateHolographicGeometricNexus,
    'holographic-polyphonic-matrix': animateHolographicPolyphonicMatrix,
    'holographic-crystalline-formation': animateHolographicCrystallineFormation,
    'holographic-sacred-geometry': animateHolographicSacredGeometry,

    // 🌌 超越级全息特效（全新突破）
    'holographic-nexus-rift': animateHolographicNexusRift,
    'holographic-neural-network': animateHolographicNeuralNetwork,
    'holographic-quantum-flux': animateHolographicQuantumFlux,
    'holographic-dimension-fold': animateHolographicDimensionFold,
    'holographic-void-cosmos': animateHolographicVoidCosmos,

    // 🌌 次世代超越级全息特效（奥斯卡级别VFX）
    'transcendent-singularity': animateTranscendentSingularity,
    'transcendent-consciousness': animateTranscendentConsciousness,
    'transcendent-entropy': animateTranscendentEntropy,
    'transcendent-raymarching-tunnel': animateTranscendentRaymarchingTunnel,
    'transcendent-rocaille': animateTranscendentRocaille,
    'transcendent-fractal-pyramid': animateTranscendentFractalPyramid,
    'transcendent-fractal-vortex': animateTranscendentFractalVortex,
    'transcendent-synthwave-terrain': animateTranscendentSynthwaveTerrain,
    'transcendent-vaporwave-city': animateTranscendentVaporwaveCity,
    'transcendent-meta-orb': animateTranscendentMetaOrb,
    'transcendent-kaleidosphere': animateTranscendentKaleidosphere,
    'transcendent-volumetric-cloud': animateTranscendentVolumetricCloud,
    'transcendent-sdf-architecture': animateTranscendentSDFArchitecture,
    'transcendent-fractal-hue-scape': animateTranscendentFractalHueScape,
    'transcendent-ultimate-synthesis': animateTranscendentUltimateSynthesis,

    // ✨ 传说级全息特效（奇迹重现）
    'holographic-aurora-borealis': animateHolographicAuroraBorealis,
    'holographic-bioluminescence': animateHolographicBioluminescence,
    'holographic-crystal-cathedral': animateHolographicCrystalCathedral,
    'holographic-phoenix-rebirth': animateHolographicPhoenixRebirth,
    'holographic-ethereal-garden': animateHolographicEtherealGarden,

    // 🌟 神话级全息特效（传说超越）
    'holographic-creation': animateHolographicCreation,
    'holographic-dragon-awakening': animateHolographicDragonAwakening,

    // 🧘 禅意全息特效（东方美学）
    'holographic-zenith-mandala': animateHolographicZenithMandala

}

/**
 * 获取所有可用的动画类型
 */
export const getAnimationTypes = () => Object.keys(animations)

/**
 * 默认导出
 */
export default animations
