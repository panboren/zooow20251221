/**
 * 银河蝴蝶-Taichi.js 特效
 *
 * 设计理念：
 * - 深邃太空中的一滴融化的银河
 * - 初始如墨色珍珠，舒展成凤尾蝶形态
 * - 极光色谱：靛青到绛紫，核心迸发铜金闪光
 * - 鼠标交互产生时空涟漪，流体凝固为fractal分支
 * - 星尘雪花接触流体激发量子玫瑰花纹
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { createTimeline, setupInitialCamera, safeCameraTransform } from '../animations/utils.js';

/**
 * 银河蝴蝶特效主函数
 */
export default async function animateGalaxyButterfly(props, callbacks) {
    const { camera, renderer, scene, controls } = props;
    const { onComplete, onError } = callbacks || {};

    console.log('🦋 启动银河蝴蝶-Taichi.js 特效');

    // Taichi.js 相关
    let ti = null;
    let useTaichi = false;

    // Taichi 字段
    let particleField = null;
    let velocityField = null;
    let colorField = null;
    let intensityField = null;
    let freezeField = null;
    let rippleField = null;

    // Taichi kernels
    let initKernel = null;
    let updateKernel = null;
    let rippleKernel = null;

    // 粒子数量
    const PARTICLE_COUNT = 50000;
    const RIPPLE_RADIUS = 15;
    const RIPPLE_STRENGTH = 0.8;

    // 鼠标交互
    let mouseX = 0;
    let mouseY = 0;
    let lastRippleTime = 0;
    const RIPPLE_COOLDOWN = 300; // ms

    try {
        // ========== 步骤1: 加载和初始化 Taichi.js ==========
        console.log('📦 步骤 1/5: 加载 Taichi.js...');

        const { $loadTaichi, $initTaichi } = useNuxtApp();

        try {
            ti = await $loadTaichi();
            console.log('✅ Taichi.js 加载成功');

            await $initTaichi(ti);
            console.log('✅ Taichi.js 初始化成功');

            if (!ti || typeof ti.Vector !== 'object') {
                console.warn('⚠️ Taichi.js 实例无效，使用 JavaScript 模拟');
                useTaichi = false;
            } else {
                useTaichi = true;
            }
        } catch (error) {
            console.warn('⚠️ Taichi.js 加载或初始化失败，使用 JavaScript 模拟:', error.message);
            useTaichi = false;
        }

        // ========== 步骤2: 创建 Taichi 字段和 Kernels（银河蝴蝶物理）==========
        if (useTaichi && ti) {
            console.log('🔨 步骤 2/5: 创建银河蝴蝶 Taichi 字段和 Kernels...');

            try {
                await new Promise(resolve => setTimeout(resolve, 200));

                if (!ti.Vector) {
                    throw new Error('Taichi实例已失效');
                }

                // 银河蝴蝶专用字段
                particleField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT]);
                velocityField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT]);
                colorField = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT]);
                intensityField = ti.field(ti.f32, [PARTICLE_COUNT]);
                freezeField = ti.field(ti.f32, [PARTICLE_COUNT]);
                rippleField = ti.field(ti.f32, [PARTICLE_COUNT]);

                console.log('✅ 银河蝴蝶 Taichi 字段创建成功');

                ti.addToKernelScope({
                    positions: particleField,
                    velocities: velocityField,
                    colors: colorField,
                    intensities: intensityField,
                    freezeStates: freezeField,
                    ripples: rippleField,
                    PARTICLE_COUNT: PARTICLE_COUNT,
                    RIPPLE_RADIUS: RIPPLE_RADIUS,
                    RIPPLE_STRENGTH: RIPPLE_STRENGTH
                });

                console.log('✅ 银河蝴蝶 Kernel scope 设置完成');

                // 初始化内核 - 创建珍珠形态
                initKernel = ti.kernel(() => {
                    for (let i of ti.range(PARTICLE_COUNT)) {
                        // 珍球形分布
                        const theta = ti.random() * 6.28318;
                        const phi = Math.acos(2.0 * ti.random() - 1.0);
                        const r = 3.0 + ti.random() * 0.5;

                        positions[i] = [
                            r * Math.sin(phi) * Math.cos(theta),
                            r * Math.sin(phi) * Math.sin(theta),
                            r * Math.cos(phi)
                        ];

                        // 初始速度
                        velocities[i] = [
                            (ti.random() - 0.5) * 0.001,
                            (ti.random() - 0.5) * 0.001,
                            (ti.random() - 0.5) * 0.001
                        ];

                        // 靛青到绛紫的色谱
                        const hue = 0.7 + ti.random() * 0.15;
                        colors[i] = [
                            ti.sin(hue * 6.28318) * 0.3 + 0.2,
                            ti.sin((hue + 0.333) * 6.28318) * 0.2 + 0.1,
                            ti.sin((hue + 0.667) * 6.28318) * 0.4 + 0.4
                        ];

                        // 初始强度
                        intensities[i] = 0.3 + ti.random() * 0.3;

                        // 冻结状态
                        freezeStates[i] = 0.0;

                        // 涟漪值
                        ripples[i] = 0.0;
                    }
                });

                // 更新内核 - 银河蝴蝶物理
                updateKernel = ti.kernel(() => {
                    for (let i of ti.range(PARTICLE_COUNT)) {
                        // 位置更新
                        positions[i][0] += velocities[i][0];
                        positions[i][1] += velocities[i][1];
                        positions[i][2] += velocities[i][2];

                        // 蝴蝶形态力场
                        const dist = ti.sqrt(
                            positions[i][0] ** 2 +
                            positions[i][1] ** 2 +
                            positions[i][2] ** 2
                        );

                        // 目标蝴蝶形态 (简化的四翼结构)
                        const targetX = positions[i][0] * (1.0 + 0.3 * ti.sin(positions[i][2] * 0.2));
                        const targetY = positions[i][1] * (1.0 + 0.2 * ti.cos(positions[i][0] * 0.3));
                        const targetZ = positions[i][2] * 0.8;

                        // 向目标形态靠近
                        velocities[i][0] += (targetX - positions[i][0]) * 0.0003;
                        velocities[i][1] += (targetY - positions[i][1]) * 0.0003;
                        velocities[i][2] += (targetZ - positions[i][2]) * 0.0003;

                        // 阻尼
                        velocities[i][0] *= 0.99;
                        velocities[i][1] *= 0.99;
                        velocities[i][2] *= 0.99;

                        // 涟漪影响
                        if (ripples[i] > 0.01) {
                            velocities[i][0] *= (1.0 - ripples[i] * RIPPLE_STRENGTH);
                            velocities[i][1] *= (1.0 - ripples[i] * RIPPLE_STRENGTH);
                            velocities[i][2] *= (1.0 - ripples[i] * RIPPLE_STRENGTH);

                            // 形成fractal分支结构
                            if (ripples[i] > 0.5) {
                                const branchAngle = ti.atan2(positions[i][1], positions[i][0]);
                                velocities[i][0] += ti.cos(branchAngle * 3.0) * ripples[i] * 0.01;
                                velocities[i][1] += ti.sin(branchAngle * 3.0) * ripples[i] * 0.01;
                            }

                            ripples[i] *= 0.98;
                        }

                        // 颜色脉动（核心闪烁）
                        if (dist < 2.0) {
                            intensities[i] = 0.5 + ti.sin(dist * 10.0) * 0.3;
                        }

                        // 偶尔超新星闪光
                        if (ti.random() < 0.0001 && dist < 1.5) {
                            colors[i] = [1.0, 0.8, 0.4]; // 铜金色
                            intensities[i] = 2.0;
                        } else if (intensities[i] > 1.0) {
                            intensities[i] *= 0.98;
                        }
                    }
                });

                // 涟漪内核 - 鼠标交互
                rippleKernel = ti.kernel((mouseX, mouseY) => {
                    for (let i of ti.range(PARTICLE_COUNT)) {
                        const dx = positions[i][0] - mouseX * 20.0;
                        const dy = positions[i][1] - mouseY * 20.0;
                        const dist = ti.sqrt(dx * dx + dy * dy);

                        if (dist < RIPPLE_RADIUS) {
                            const strength = (1.0 - dist / RIPPLE_RADIUS);
                            ripples[i] = ti.max(ripples[i], strength * RIPPLE_STRENGTH);
                            freezeStates[i] = 1.0;
                        }
                    }
                });

                console.log('✅ 银河蝴蝶 Taichi Kernels 编译完成');

                initKernel();
                console.log('✅ 银河蝴蝶初始化执行完成');

            } catch (error) {
                console.warn('⚠️ 银河蝴蝶 Taichi 字段或 Kernels 创建失败，降级到 JavaScript:', error.message);
                useTaichi = false;
            }
        }

        // ========== 步骤3: 初始化 Three.js 银河蝴蝶场景 ==========
        console.log('🎨 步骤 3/5: 初始化银河蝴蝶场景...');

        // 初始设置 - 远景太空视角
        setupInitialCamera(camera, new THREE.Vector3(0, 0, 40), 50, controls);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);

        // 创建银河蝴蝶粒子系统
        const galaxyButterfly = createGalaxyButterfly(scene, {
            particleCount: PARTICLE_COUNT,
            useTaichi,
            particleField,
            colorField,
            intensityField,
            freezeField,
            rippleField
        });

        // 创建星尘雪花
        const starDust = createStarDust(scene);

        // 创建量子玫瑰
        const quantumRoses = createQuantumRoses(scene);

        // 创建深空背景
        const deepSpace = createDeepSpace(scene);

        console.log('✅ 银河蝴蝶场景创建完成');

        // ========== 步骤4: 创建银河蝴蝶动画时间轴 ==========
        console.log('⏱️  步骤 4/5: 创建银河蝴蝶动画时间轴...');

        const tl = createTimeline(
            () => {
                cleanup();
                if (onComplete) onComplete({ type: 'galaxy-butterfly' });
            },
            onError,
            '银河蝴蝶-Taichi.js 特效',
            controls
        );

        console.log('✅ 银河蝴蝶动画时间轴创建完成');

        // ========== 银河蝴蝶动画阶段 ==========

        // 阶段1: 深空幽浮 - 墨色珍珠
        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 30,
            duration: 1.0,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '深空幽浮错误'
            )
        });

        tl.call(() => {
            galaxyButterfly.pearlMode();
            deepSpace.starsAppear();
        }, null, 0.2);

        // 阶段2: 星风轻抚 - 开始舒展
        tl.to(camera.position, {
            x: 1,
            y: 0.5,
            z: 25,
            duration: 0.8,
            ease: 'power1.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '星风轻抚错误'
            )
        }, 1.0);

        tl.call(() => {
            galaxyButterfly.beginUnfold();
            starDust.startFalling();
        }, null, 1.3);

        // 阶段3: 蝶翼初展 - 形态形成
        tl.to(camera.position, {
            x: 0,
            y: 0.2,
            z: 20,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '蝶翼初展错误'
            )
        }, 1.8);

        tl.call(() => {
            galaxyButterfly.butterflyMode();
            galaxyButterfly.polarLights();
        }, null, 2.0);

        // 阶段4: 极光流溢 - 绚丽绽放
        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 16,
            duration: 0.7,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '极光流溢错误'
            )
        }, 2.6);

        tl.call(() => {
            galaxyButterfly.intensify();
            quantumRoses.activate();
        }, null, 2.8);

        // 阶段5: 核心闪耀 - 超新星
        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 13,
            duration: 0.5,
            ease: 'power1.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '核心闪耀错误'
            )
        }, 3.3);

        tl.call(() => {
            galaxyButterfly.supernova();
            quantumRoses.bloom();
        }, null, 3.5);

        // 阶段6: 时空涟漪 - 交互时刻
        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 10,
            duration: 0.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '时空涟漪错误'
            )
        }, 3.8);

        tl.to(camera, {
            fov: 40,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV扩展错误'
            )
        }, 4.1);

        tl.call(() => {
            galaxyButterfly.fractalMode();
        }, null, 4.3);

        // 阶段7: 晶融回归 - 最终形态
        tl.to(camera.position, {
            x: 0,
            y: 0.3,
            z: 14,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 0, 0),
                '晶融回归错误'
            )
        }, 4.8);

        tl.to(camera, {
            fov: 50,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 5.6);

        tl.call(() => {
            galaxyButterfly.fade();
            starDust.fade();
            quantumRoses.fade();
        }, null, 5.8);

        // ========== 鼠标交互事件 ==========
        const handleMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // 触发涟漪
            const now = Date.now();
            if (useTaichi && rippleKernel && now - lastRippleTime > RIPPLE_COOLDOWN) {
                lastRippleTime = now;
                try {
                    rippleKernel(mouseX, mouseY);
                } catch (error) {
                    console.warn('⚠️ 涟漪内核执行失败:', error);
                }
            }
        };

        renderer.domElement.addEventListener('mousemove', handleMouseMove);

        // ========== 更新循环 ==========
        let lastTaichiUpdate = 0;
        const TAIICHI_UPDATE_INTERVAL = 16;

        const updateHandler = async () => {
            const time = Date.now() * 0.001;

            // 更新所有元素
            galaxyButterfly?.update(time);
            starDust?.update(time);
            quantumRoses?.update(time);
            deepSpace?.update(time);

            // 如果使用 Taichi.js，更新物理
            if (useTaichi && updateKernel && time - lastTaichiUpdate >= TAIICHI_UPDATE_INTERVAL / 1000) {
                try {
                    lastTaichiUpdate = time;
                    updateKernel();

                    const [positions, colors, intensities, freezeStates, ripples] = await Promise.all([
                        particleField.toArray1D(),
                        colorField.toArray1D(),
                        intensityField.toArray1D(),
                        freezeField.toArray1D(),
                        rippleField.toArray1D()
                    ]);

                    if (galaxyButterfly?.geometry) {
                        const particlePositions = galaxyButterfly.geometry.attributes.position.array;
                        const particleColors = galaxyButterfly.geometry.attributes.color.array;
                        const particleIntensities = galaxyButterfly.geometry.attributes.intensity.array;
                        const particleFreeze = galaxyButterfly.geometry.attributes.freeze.array;
                        const particleRipples = galaxyButterfly.geometry.attributes.ripple.array;

                        const count = Math.min(
                            positions.length / 3,
                            particlePositions.length / 3
                        );

                        for (let i = 0; i < count; i++) {
                            const i3 = i * 3;
                            particlePositions[i3] = positions[i3];
                            particlePositions[i3 + 1] = positions[i3 + 1];
                            particlePositions[i3 + 2] = positions[i3 + 2];
                            particleColors[i3] = colors[i3];
                            particleColors[i3 + 1] = colors[i3 + 1];
                            particleColors[i3 + 2] = colors[i3 + 2];
                            particleIntensities[i] = intensities[i];
                            particleFreeze[i] = freezeStates[i];
                            particleRipples[i] = ripples[i];
                        }

                        galaxyButterfly.geometry.attributes.position.needsUpdate = true;
                        galaxyButterfly.geometry.attributes.color.needsUpdate = true;
                        galaxyButterfly.geometry.attributes.intensity.needsUpdate = true;
                        galaxyButterfly.geometry.attributes.freeze.needsUpdate = true;
                        galaxyButterfly.geometry.attributes.ripple.needsUpdate = true;
                    }

                } catch (error) {
                    console.warn('⚠️ 银河蝴蝶 Taichi 更新失败:', error);
                }
            }
        };

        // 清理函数
        const cleanup = () => {
            console.log('🧹 清理银河蝴蝶特效资源');
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            galaxyButterfly?.destroy();
            starDust?.destroy();
            quantumRoses?.destroy();
            deepSpace?.destroy();

            if (particleField?.destroy) particleField.destroy();
            if (velocityField?.destroy) velocityField.destroy();
            if (colorField?.destroy) colorField.destroy();
            if (intensityField?.destroy) intensityField.destroy();
            if (freezeField?.destroy) freezeField.destroy();
            if (rippleField?.destroy) rippleField.destroy();

            particleField = null;
            velocityField = null;
            colorField = null;
            intensityField = null;
            freezeField = null;
            rippleField = null;
            initKernel = null;
            updateKernel = null;
            rippleKernel = null;
        };

        tl.call(cleanup, null, 8);

        return { updateHandler };

    } catch (error) {
        console.error('❌ 银河蝴蝶-Taichi.js 特效启动失败:', error);
        if (onError) onError(error);
        return null;
    }
}

/**
 * 创建银河蝴蝶粒子系统
 */
function createGalaxyButterfly(scene, options) {
    const { particleCount = 50000, useTaichi = false } = options;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const intensities = new Float32Array(particleCount);
    const freeze = new Float32Array(particleCount);
    const ripples = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 + Math.random() * 0.5;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // 靛青到绛紫
        const hue = 0.7 + Math.random() * 0.15;
        const hsl = hslToRgb(hue, 0.8, 0.3);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];

        intensities[i] = 0.3 + Math.random() * 0.3;
        freeze[i] = 0;
        ripples[i] = 0;
        sizes[i] = 0.2 + Math.random() * 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('intensity', new THREE.BufferAttribute(intensities, 1));
    geometry.setAttribute('freeze', new THREE.BufferAttribute(freeze, 1));
    geometry.setAttribute('ripple', new THREE.BufferAttribute(ripples, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uGlobalAlpha: { value: 0 },
            uMode: { value: 0 } // 0: pearl, 1: butterfly, 2: fractal
        },
        vertexShader: `
            precision highp float;
            attribute vec3 color;
            attribute float intensity;
            attribute float freeze;
            attribute float ripple;
            attribute float size;
            uniform float uTime;
            uniform float uGlobalAlpha;
            uniform float uMode;
            varying vec3 vColor;
            varying float vIntensity;
            varying float vFreeze;
            varying float vRipple;

            void main() {
                vColor = color;
                vIntensity = intensity;
                vFreeze = freeze;
                vRipple = ripple;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                // 涟漪影响大小
                float rippleSize = 1.0 + vRipple * 0.5;
                gl_PointSize = size * (300.0 / -mvPosition.z) * rippleSize * (1.0 + vIntensity * 0.3);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            varying float vIntensity;
            varying float vFreeze;
            varying float vRipple;

            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);

                if (dist > 0.5) discard;

                float edge = smoothstep(0.5, 0.0, dist);
                float glow = pow(1.0 - dist, 2.0);

                vec3 baseColor = vColor;
                vec3 glowColor = vec3(1.0, 0.85, 0.5) * vIntensity;

                // 冻结状态：水晶般透明
                float crystal = vFreeze * 0.5;
                vec3 crystalColor = vec3(0.9, 0.95, 1.0);

                vec3 finalColor = mix(baseColor, glowColor, vIntensity * 0.5);
                finalColor = mix(finalColor, crystalColor, crystal);

                // 涟漪效果：冰裂纹
                if (vRipple > 0.1) {
                    float crack = sin(dist * 50.0) * vRipple * 0.3;
                    finalColor += vec3(crack);
                }

                float alpha = edge * (0.6 + vIntensity * 0.4);

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    return {
        group,
        particles,
        geometry,
        material,
        pearlMode() {
            gsap.to(material.uniforms.uMode, {
                value: 0,
                duration: 1
            });
        },
        beginUnfold() {
            gsap.to(material.uniforms.uMode, {
                value: 0.5,
                duration: 2,
                ease: 'power2.inOut'
            });
        },
        butterflyMode() {
            gsap.to(material.uniforms.uMode, {
                value: 1,
                duration: 1.5
            });
        },
        polarLights() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.2,
                duration: 2,
                yoyo: true,
                repeat: 3
            });
        },
        intensify() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.5,
                duration: 1
            });
        },
        supernova() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 2.5,
                duration: 0.5,
                yoyo: true,
                repeat: 2
            });
        },
        fractalMode() {
            gsap.to(material.uniforms.uMode, {
                value: 2,
                duration: 1.5
            });
        },
        fade() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 0,
                duration: 2.5
            });
        },
        update(time) {
            material.uniforms.uTime.value = time;
            group.rotation.y = time * 0.05;
            group.rotation.x = Math.sin(time * 0.03) * 0.1;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建星尘雪花
 */
function createStarDust(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const dustCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);
    const velocities = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = Math.random() * 50 + 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        // 星尘颜色
        const hue = 0.55 + Math.random() * 0.1;
        const hsl = hslToRgb(hue, 0.5, 0.8);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];

        velocities[i] = 0.5 + Math.random() * 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dust = new THREE.Points(geometry, material);
    group.add(dust);

    return {
        group,
        dust,
        geometry,
        material,
        velocities,
        startFalling() {
            gsap.to(material, {
                opacity: 0.6,
                duration: 1.5
            });
        },
        fade() {
            gsap.to(material, {
                opacity: 0,
                duration: 2
            });
        },
        update(time) {
            const positionsArray = geometry.attributes.position.array;

            for (let i = 0; i < dustCount; i++) {
                const i3 = i * 3;
                positionsArray[i3 + 1] -= velocities[i] * 0.1;

                // 重置到顶部
                if (positionsArray[i3 + 1] < -10) {
                    positionsArray[i3 + 1] = 50;
                }
            }

            geometry.attributes.position.needsUpdate = true;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建量子玫瑰
 */
function createQuantumRoses(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const roseCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(roseCount * 3);
    const colors = new Float32Array(roseCount * 3);
    const sizes = new Float32Array(roseCount);
    const life = new Float32Array(roseCount);

    for (let i = 0; i < roseCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = -5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        // 玫瑰色
        const hue = 0.9 + Math.random() * 0.1;
        const hsl = hslToRgb(hue, 0.9, 0.6);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];

        sizes[i] = 1 + Math.random() * 2;
        life[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('life', new THREE.BufferAttribute(life, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uGlobalAlpha: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            attribute vec3 color;
            attribute float size;
            attribute float life;
            uniform float uTime;
            uniform float uGlobalAlpha;
            varying vec3 vColor;
            varying float vLife;

            void main() {
                vColor = color;
                vLife = life;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z) * vLife;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            varying float vLife;
            uniform float uGlobalAlpha;

            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);

                if (dist > 0.5) discard;

                // 玫瑰花瓣形状
                float angle = atan(center.y, center.x);
                float petals = sin(angle * 5.0) * 0.2 + 0.5;
                float edge = smoothstep(0.5, 0.3, dist);

                vec3 finalColor = vColor * vLife;
                float alpha = edge * vLife * uGlobalAlpha;

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const roses = new THREE.Points(geometry, material);
    group.add(roses);

    return {
        group,
        roses,
        geometry,
        material,
        activate() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.0,
                duration: 1.5
            });
        },
        bloom() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.5,
                duration: 1,
                yoyo: true,
                repeat: 2
            });
        },
        fade() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 0,
                duration: 2
            });
        },
        update(time) {
            material.uniforms.uTime.value = time;

            const lifeArray = geometry.attributes.life.array;

            for (let i = 0; i < roseCount; i++) {
                lifeArray[i] = Math.max(0, lifeArray[i] - 0.01);

                // 随机重生
                if (lifeArray[i] <= 0 && Math.random() < 0.01) {
                    lifeArray[i] = 1.0;
                }
            }

            geometry.attributes.life.needsUpdate = true;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建深空背景
 */
function createDeepSpace(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const radius = 100 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // 星星颜色
        const hue = Math.random();
        const hsl = hslToRgb(hue, 0.3, 0.9);
        colors[i * 3] = hsl[0];
        colors[i * 3 + 1] = hsl[1];
        colors[i * 3 + 2] = hsl[2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    group.add(stars);

    return {
        group,
        stars,
        geometry,
        material,
        starsAppear() {
            gsap.to(material, {
                opacity: 0.8,
                duration: 2
            });
        },
        update(time) {
            group.rotation.y = time * 0.01;
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * HSL转RGB辅助函数
 */
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r, g, b];
}
