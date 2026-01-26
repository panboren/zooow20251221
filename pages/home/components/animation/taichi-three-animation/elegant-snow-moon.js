/**
 * 风华雪月-Taichi.js 特效（升级版）
 *
 * 设计理念：
 * - 风：轻纱飘舞，流云飞逝
 * - 华：华灯初上，繁华似锦
 * - 雪：雪花纷飞，如梦如幻
 * - 月：明月当空，清辉如水
 *
 * 升级特性：
 * - 5万粒子实时物理模拟
 * - 动态风场计算
 * - 月华投射光影
 * - 雪花融化成水珠
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { createTimeline, setupInitialCamera, safeCameraTransform } from '../animations/utils.js';

/**
 * 风华雪月特效主函数
 */
export default async function animateElegantSnowMoon(props, callbacks) {
    const { camera, renderer, scene, controls } = props;
    const { onComplete, onError } = callbacks || {};

    console.log('🌙 启动风华雪月-Taichi.js 特效（升级版）');

    // Taichi.js 相关
    let ti = null;
    let useTaichi = false;

    // Taichi 字段
    let snowField = null;
    let snowVelField = null;
    let windField = null;
    let snowColorField = null;
    let snowLifeField = null;

    // Taichi kernels
    let initKernel = null;
    let updateKernel = null;

    // 粒子数量
    const SNOW_COUNT = 50000;
    const WIND_RESOLUTION = 50;

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

        // ========== 步骤2: 创建 Taichi 字段和 Kernels（风雪月物理）==========
        if (useTaichi && ti) {
            console.log('🔨 步骤 2/5: 创建风华雪月 Taichi 字段和 Kernels...');

            try {
                await new Promise(resolve => setTimeout(resolve, 200));

                if (!ti.Vector) {
                    throw new Error('Taichi实例已失效');
                }

                // 风华雪月专用字段
                snowField = ti.Vector.field(3, ti.f32, [SNOW_COUNT]);
                snowVelField = ti.Vector.field(3, ti.f32, [SNOW_COUNT]);
                windField = ti.Vector.field(3, ti.f32, [WIND_RESOLUTION, WIND_RESOLUTION]);
                snowColorField = ti.Vector.field(3, ti.f32, [SNOW_COUNT]);
                snowLifeField = ti.field(ti.f32, [SNOW_COUNT]);

                console.log('✅ 风华雪月 Taichi 字段创建成功');

                ti.addToKernelScope({
                    snowPositions: snowField,
                    snowVelocities: snowVelField,
                    windGrid: windField,
                    snowColors: snowColorField,
                    snowLives: snowLifeField,
                    SNOW_COUNT: SNOW_COUNT,
                    WIND_RESOLUTION: WIND_RESOLUTION,
                    time: 0.0
                });

                console.log('✅ 风华雪月 Kernel scope 设置完成');

                // 初始化内核 - 创建雪花
                initKernel = ti.kernel(() => {
                    // 初始化风场
                    for (let i of ti.range(WIND_RESOLUTION)) {
                        for (let j of ti.range(WIND_RESOLUTION)) {
                            const x = (i * 1.0 - WIND_RESOLUTION / 2.0) / WIND_RESOLUTION * 2.0;
                            const y = (j * 1.0 - WIND_RESOLUTION / 2.0) / WIND_RESOLUTION * 2.0;

                            // 风场噪声
                            const windX = ti.sin(x * 3.0 + y * 2.0) * 0.5;
                            const windY = ti.cos(x * 2.0 - y * 3.0) * 0.3;
                            const windZ = ti.sin(x * y * 5.0) * 0.2;

                            windGrid[i, j] = [windX, windY, windZ];
                        }
                    }

                    // 初始化雪花
                    for (let i of ti.range(SNOW_COUNT)) {
                        snowPositions[i] = [
                            (ti.random() - 0.5) * 100.0,
                            ti.random() * 50.0 + 20.0,
                            (ti.random() - 0.5) * 100.0
                        ];

                        snowVelocities[i] = [
                            (ti.random() - 0.5) * 0.02,
                            -0.02 - ti.random() * 0.03,
                            (ti.random() - 0.5) * 0.02
                        ];

                        // 雪花颜色：纯白到淡蓝
                        const blueTint = ti.random() * 0.2;
                        snowColors[i] = [
                            0.9 + blueTint * 0.1,
                            0.95 + blueTint * 0.05,
                            1.0
                        ];

                        // 雪花生命
                        snowLives[i] = 1.0;
                    }
                });

                // 更新内核 - 风雪物理
                updateKernel = ti.kernel(() => {
                    // 更新风场（动态变化）
                    for (let i of ti.range(WIND_RESOLUTION)) {
                        for (let j of ti.range(WIND_RESOLUTION)) {
                            const x = (i * 1.0 - WIND_RESOLUTION / 2.0) / WIND_RESOLUTION * 2.0;
                            const y = (j * 1.0 - WIND_RESOLUTION / 2.0) / WIND_RESOLUTION * 2.0;

                            // 动态风场噪声
                            const windX = ti.sin(x * 3.0 + y * 2.0 + time) * 0.5 + ti.sin(time * 0.5) * 0.2;
                            const windY = ti.cos(x * 2.0 - y * 3.0 + time * 0.8) * 0.3;
                            const windZ = ti.sin(x * y * 5.0 + time * 1.2) * 0.2;

                            windGrid[i, j] = [windX, windY, windZ];
                        }
                    }

                    // 更新雪花
                    for (let i of ti.range(SNOW_COUNT)) {
                        // 获取风场影响
                        const gridX = ti.floor((snowPositions[i][0] / 100.0 + 0.5) * WIND_RESOLUTION);
                        const gridY = ti.floor((snowPositions[i][2] / 100.0 + 0.5) * WIND_RESOLUTION);

                        const clampedX = ti.max(0, ti.min(WIND_RESOLUTION - 1, gridX));
                        const clampedY = ti.max(0, ti.min(WIND_RESOLUTION - 1, gridY));

                        const wind = windGrid[clampedX, clampedY];

                        // 风力影响速度
                        snowVelocities[i][0] += wind[0] * 0.001;
                        snowVelocities[i][1] += wind[1] * 0.001;
                        snowVelocities[i][2] += wind[2] * 0.001;

                        // 重力
                        snowVelocities[i][1] -= 0.001;

                        // 更新位置
                        snowPositions[i][0] += snowVelocities[i][0];
                        snowPositions[i][1] += snowVelocities[i][1];
                        snowPositions[i][2] += snowVelocities[i][2];

                        // 空气阻力
                        snowVelocities[i][0] *= 0.99;
                        snowVelocities[i][1] *= 0.99;
                        snowVelocities[i][2] *= 0.99;

                        // 飘落效果
                        snowPositions[i][0] += ti.sin(time * 2.0 + i * 0.01) * 0.01;

                        // 边界重置
                        if (snowPositions[i][1] < -10.0) {
                            snowPositions[i][1] = 60.0;
                            snowPositions[i][0] = (ti.random() - 0.5) * 100.0;
                            snowPositions[i][2] = (ti.random() - 0.5) * 100.0;
                            snowLives[i] = 1.0;
                        }

                        // 雪花融化（接近地面）
                        if (snowPositions[i][1] < 2.0) {
                            snowLives[i] *= 0.98;
                        }
                    }
                });

                console.log('✅ 风华雪月 Taichi Kernels 编译完成');

                initKernel();
                console.log('✅ 风华雪月初始化执行完成');

            } catch (error) {
                console.warn('⚠️ 风华雪月 Taichi 字段或 Kernels 创建失败，降级到 JavaScript:', error.message);
                useTaichi = false;
            }
        }

        // ========== 步骤3: 初始化 Three.js 风华雪月场景 ==========
        console.log('🎨 步骤 3/5: 初始化风华雪月场景...');

        // 初始设置 - 中景视角
        setupInitialCamera(camera, new THREE.Vector3(0, 10, 50), 50, controls);
        camera.lookAt(0, 15, 0);
        renderer.render(scene, camera);

        // 创建月亮系统
        const moon = createMoon(scene);

        // 创建雪花系统
        const snow = createSnow(scene, {
            snowCount: SNOW_COUNT,
            useTaichi,
            snowField,
            snowColorField,
            snowLifeField
        });

        // 创建风场可视化
        const windVisualizer = createWindVisualizer(scene);

        // 创建华灯系统
        const lanterns = createLanterns(scene);

        // 创建雪地场景
        const snowGround = createSnowGround(scene);

        console.log('✅ 风华雪月场景创建完成');

        // ========== 步骤4: 创建风华雪月动画时间轴 ==========
        console.log('⏱️  步骤 4/5: 创建风华雪月动画时间轴...');

        const tl = createTimeline(
            () => {
                cleanup();
                if (onComplete) onComplete({ type: 'elegant-snow-moon' });
            },
            onError,
            '风华雪月-Taichi.js 特效',
            controls
        );

        console.log('✅ 风华雪月动画时间轴创建完成');

        // ========== 风华雪月动画阶段 ==========

        // 阶段1: 月上柳梢 - 明月升起
        tl.to(camera.position, {
            x: 0,
            y: 8,
            z: 50,
            duration: 0.8,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 15, 0),
                '月上柳梢错误'
            )
        });

        tl.call(() => {
            moon.rise();
            snowGround.appear();
        }, null, 0.2);

        // 阶段2: 雪落无声 - 雪花初现，开始环绕
        tl.to(camera.position, {
            x: 15,
            y: 7,
            z: 40,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 10, 0),
                '雪落无声错误'
            )
        }, 0.8);

        tl.call(() => {
            snow.start();
            windVisualizer.appear();
        }, null, 1.0);

        // 阶段3: 风拂柳絮 - 继续环绕
        tl.to(camera.position, {
            x: 25,
            y: 6,
            z: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 8, 0),
                '风拂柳絮错误'
            )
        }, 1.6);

        tl.call(() => {
            snow.intensify();
            windVisualizer.activate();
        }, null, 1.8);

        // 阶段4: 华灯初上 - 继续环绕
        tl.to(camera.position, {
            x: 15,
            y: 5,
            z: -32,
            duration: 0.7,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 6, 0),
                '华灯初上错误'
            )
        }, 2.4);

        tl.call(() => {
            lanterns.ignite();
            moon.fullMoon();
        }, null, 2.6);

        // 阶段5: 雪舞流年 - 继续环绕
        tl.to(camera.position, {
            x: -12,
            y: 4,
            z: -28,
            duration: 0.6,
            ease: 'power2.in',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 5, 0),
                '雪舞流年错误'
            )
        }, 3.1);

        tl.call(() => {
            snow.blizzard();
            lanterns.twinkle();
        }, null, 3.3);

        // 阶段6: 月华如水 - 辉煌时刻，靠近
        tl.to(camera.position, {
            x: -20,
            y: 3,
            z: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 4, 0),
                '月华如水错误'
            )
        }, 3.7);

        tl.to(camera, {
            fov: 45,
            duration: 0.3,
            ease: 'power2.out',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV扩展错误'
            )
        }, 4.1);

        tl.call(() => {
            moon.moonlight();
            snow.crystallize();
        }, null, 4.3);

        // 阶段7: 风雪归宁 - 雪月交辉，完成环绕
        tl.to(camera.position, {
            x: 0,
            y: 3.5,
            z: 18,
            duration: 0.6,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.lookAt(0, 6, 0),
                '风雪归宁错误'
            )
        }, 4.4);

        tl.to(camera, {
            fov: 50,
            duration: 0.6,
            ease: 'power2.inOut',
            onUpdate: () => safeCameraTransform(
                () => camera.updateProjectionMatrix(),
                'FOV恢复错误'
            )
        }, 5.0);

        tl.call(() => {
            snow.fade();
            lanterns.fade();
            windVisualizer.fade();
        }, null, 5.2);

        // ========== 更新循环 ==========
        let lastTaichiUpdate = 0;
        const TAIICHI_UPDATE_INTERVAL = 16;

        const updateHandler = async () => {
            const time = Date.now() * 0.001;

            // 更新所有元素
            moon?.update(time);
            snow?.update(time);
            windVisualizer?.update(time);
            lanterns?.update(time);
            snowGround?.update(time);

            // 如果使用 Taichi.js，更新物理
            if (useTaichi && updateKernel && time - lastTaichiUpdate >= TAIICHI_UPDATE_INTERVAL / 1000) {
                try {
                    lastTaichiUpdate = time;
                    // 更新时间变量到kernel scope
                    if (ti && ti.set) {
                        ti.set('time', time);
                    }
                    updateKernel();

                    const [snowPositions, snowColors, snowLives] = await Promise.all([
                        snowField.toArray1D(),
                        snowColorField.toArray1D(),
                        snowLifeField.toArray1D()
                    ]);

                    if (snow?.geometry) {
                        const particlePositions = snow.geometry.attributes.position.array;
                        const particleColors = snow.geometry.attributes.color.array;
                        const particleLives = snow.geometry.attributes.life.array;

                        const count = Math.min(
                            snowPositions.length / 3,
                            particlePositions.length / 3
                        );

                        for (let i = 0; i < count; i++) {
                            const i3 = i * 3;
                            particlePositions[i3] = snowPositions[i3];
                            particlePositions[i3 + 1] = snowPositions[i3 + 1];
                            particlePositions[i3 + 2] = snowPositions[i3 + 2];
                            particleColors[i3] = snowColors[i3];
                            particleColors[i3 + 1] = snowColors[i3 + 1];
                            particleColors[i3 + 2] = snowColors[i3 + 2];
                            particleLives[i] = snowLives[i];
                        }

                        snow.geometry.attributes.position.needsUpdate = true;
                        snow.geometry.attributes.color.needsUpdate = true;
                        snow.geometry.attributes.life.needsUpdate = true;
                    }

                } catch (error) {
                    console.warn('⚠️ 风华雪月 Taichi 更新失败:', error);
                }
            }
        };

        // 清理函数
        const cleanup = () => {
            console.log('🧹 清理风华雪月特效资源');
            moon?.destroy();
            snow?.destroy();
            windVisualizer?.destroy();
            lanterns?.destroy();
            snowGround?.destroy();

            if (snowField?.destroy) snowField.destroy();
            if (snowVelField?.destroy) snowVelField.destroy();
            if (windField?.destroy) windField.destroy();
            if (snowColorField?.destroy) snowColorField.destroy();
            if (snowLifeField?.destroy) snowLifeField.destroy();

            snowField = null;
            snowVelField = null;
            windField = null;
            snowColorField = null;
            snowLifeField = null;
            initKernel = null;
            updateKernel = null;
        };

        tl.call(cleanup, null, 8);

        return { updateHandler };

    } catch (error) {
        console.error('❌ 风华雪月-Taichi.js 特效启动失败:', error);
        if (onError) onError(error);
        return null;
    }
}

/**
 * 创建月亮系统
 */
function createMoon(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const moonGeometry = new THREE.SphereGeometry(5, 64, 64);
    const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 0 },
            uGlowIntensity: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float uTime;

            void main() {
                vNormal = normal;
                vPosition = position;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float uTime;
            uniform float uIntensity;
            uniform float uGlowIntensity;

            void main() {
                vec3 normal = normalize(vNormal);

                // 月球表面
                float crater = sin(vPosition.x * 10.0) * sin(vPosition.y * 10.0) * sin(vPosition.z * 10.0);
                float brightness = 0.9 + crater * 0.1;

                // 月晕
                float fresnel = pow(1.0 - abs(dot(normal, vec3(0, 0, 1))), 3.0);

                vec3 moonColor = vec3(0.95, 0.95, 0.95) * brightness;
                vec3 glowColor = vec3(0.8, 0.85, 1.0);

                vec3 finalColor = mix(moonColor, glowColor, fresnel * uGlowIntensity);

                float alpha = uIntensity;

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        depthWrite: false
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, 25, -30);
    moon.visible = false;
    group.add(moon);

    // 月晕光晕
    const haloGeometry = new THREE.SphereGeometry(6, 32, 32);
    const haloMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            varying vec3 vNormal;

            void main() {
                vNormal = normal;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vNormal;
            uniform float uTime;
            uniform float uIntensity;

            void main() {
                vec3 normal = normalize(vNormal);
                float fresnel = pow(1.0 - abs(dot(normal, vec3(0, 0, 1))), 4.0);

                vec3 haloColor = vec3(0.7, 0.75, 0.9);
                float alpha = fresnel * uIntensity * 0.5;

                gl_FragColor = vec4(haloColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide
    });

    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.copy(moon.position);
    halo.visible = false;
    group.add(halo);

    return {
        group,
        moon,
        halo,
        material: moonMaterial,
        haloMaterial,
        rise() {
            moon.visible = true;
            halo.visible = true;

            gsap.to(moon.position, {
                y: 35,
                duration: 2,
                ease: 'power2.out'
            });
            gsap.to(halo.position, {
                y: 35,
                duration: 2,
                ease: 'power2.out'
            });
            gsap.to(moonMaterial.uniforms.uIntensity, {
                value: 1.0,
                duration: 1.5
            });
            gsap.to(haloMaterial.uniforms.uIntensity, {
                value: 1.0,
                duration: 2
            });
        },
        fullMoon() {
            gsap.to(moonMaterial.uniforms.uGlowIntensity, {
                value: 1.0,
                duration: 1.5
            });
        },
        moonlight() {
            gsap.to(moonMaterial.uniforms.uGlowIntensity, {
                value: 1.5,
                duration: 1
            });
            gsap.to(haloMaterial.uniforms.uIntensity, {
                value: 1.5,
                duration: 1
            });
        },
        update(time) {
            material.uniforms.uTime.value = time;
            haloMaterial.uniforms.uTime.value = time;
            moon.rotation.y = time * 0.05;
        },
        destroy() {
            scene.remove(group);
            moonGeometry.dispose();
            moonMaterial.dispose();
            haloGeometry.dispose();
            haloMaterial.dispose();
        }
    };
}

/**
 * 创建雪花系统
 */
function createSnow(scene, options) {
    const { snowCount = 50000, useTaichi = false } = options;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(snowCount * 3);
    const colors = new Float32Array(snowCount * 3);
    const lives = new Float32Array(snowCount);
    const sizes = new Float32Array(snowCount);

    for (let i = 0; i < snowCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = Math.random() * 50 + 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

        const blueTint = Math.random() * 0.2;
        colors[i * 3] = 0.9 + blueTint * 0.1;
        colors[i * 3 + 1] = 0.95 + blueTint * 0.05;
        colors[i * 3 + 2] = 1.0;

        lives[i] = 1.0;
        sizes[i] = 0.3 + Math.random() * 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('life', new THREE.BufferAttribute(lives, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uGlobalAlpha: { value: 0 },
            uCrystallize: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            attribute vec3 color;
            attribute float life;
            attribute float size;
            uniform float uTime;
            uniform float uGlobalAlpha;
            uniform float uCrystallize;
            varying vec3 vColor;
            varying float vLife;

            void main() {
                vColor = color;
                vLife = life;

                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                // 结晶效果：变大
                float crystallizeSize = 1.0 + uCrystallize * 0.5;
                gl_PointSize = size * (400.0 / -mvPosition.z) * crystallizeSize;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vColor;
            varying float vLife;
            uniform float uGlobalAlpha;
            uniform float uCrystallize;

            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);

                if (dist > 0.5) discard;

                // 雪花形状
                float angle = atan(center.y, center.x);
                float petals = cos(angle * 6.0) * 0.3 + 0.7;
                float edge = smoothstep(0.5, 0.2, dist);

                // 结晶效果
                vec3 crystallizeColor = vec3(0.9, 0.95, 1.0) * uCrystallize;

                vec3 finalColor = mix(vColor, crystallizeColor, uCrystallize * 0.5);
                float alpha = edge * vLife * uGlobalAlpha * petals;

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const snow = new THREE.Points(geometry, material);
    group.add(snow);

    return {
        group,
        snow,
        geometry,
        material,
        start() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.0,
                duration: 1.5
            });
        },
        intensify() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.2,
                duration: 1
            });
        },
        blizzard() {
            gsap.to(material.uniforms.uGlobalAlpha, {
                value: 1.5,
                duration: 1,
                yoyo: true,
                repeat: 2
            });
        },
        crystallize() {
            gsap.to(material.uniforms.uCrystallize, {
                value: 1.0,
                duration: 1.5
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

            if (!useTaichi) {
                const positionsArray = geometry.attributes.position.array;

                for (let i = 0; i < snowCount; i++) {
                    const i3 = i * 3;
                    positionsArray[i3 + 1] -= 0.1;
                    positionsArray[i3] += Math.sin(time * 2 + i * 0.01) * 0.01;

                    if (positionsArray[i3 + 1] < -10) {
                        positionsArray[i3 + 1] = 60;
                        positionsArray[i3] = (Math.random() - 0.5) * 100;
                        positionsArray[i3 + 2] = (Math.random() - 0.5) * 100;
                    }
                }

                geometry.attributes.position.needsUpdate = true;
            }
        },
        destroy() {
            scene.remove(group);
            geometry.dispose();
            material.dispose();
        }
    };
}

/**
 * 创建风场可视化
 */
function createWindVisualizer(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const lineCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 2 * 3);
    const colors = new Float32Array(lineCount * 2 * 3);

    for (let i = 0; i < lineCount; i++) {
        const x = (Math.random() - 0.5) * 80;
        const y = Math.random() * 30 + 10;
        const z = (Math.random() - 0.5) * 80;

        positions[i * 6] = x;
        positions[i * 6 + 1] = y;
        positions[i * 6 + 2] = z;
        positions[i * 6 + 3] = x + Math.random() * 2 - 1;
        positions[i * 6 + 4] = y + Math.random() * 1 - 0.5;
        positions[i * 6 + 5] = z + Math.random() * 2 - 1;

        colors[i * 6] = 0.7;
        colors[i * 6 + 1] = 0.8;
        colors[i * 6 + 2] = 0.9;
        colors[i * 6 + 3] = 0.8;
        colors[i * 6 + 4] = 0.9;
        colors[i * 6 + 5] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);

    return {
        group,
        lines,
        geometry,
        material,
        appear() {
            gsap.to(material, {
                opacity: 0.3,
                duration: 1.5
            });
        },
        activate() {
            gsap.to(material, {
                opacity: 0.5,
                duration: 1
            });
        },
        fade() {
            gsap.to(material, {
                opacity: 0,
                duration: 1.5
            });
        },
        update(time) {
            const positionsArray = geometry.attributes.position.array;

            for (let i = 0; i < lineCount; i++) {
                const i6 = i * 6;
                positionsArray[i6 + 3] = positionsArray[i6] + Math.sin(time + i) * 1.5;
                positionsArray[i6 + 4] = positionsArray[i6 + 1] + Math.cos(time * 0.5 + i) * 0.5;
                positionsArray[i6 + 5] = positionsArray[i6 + 2] + Math.sin(time * 0.8 + i) * 1.5;
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
 * 创建华灯系统
 */
function createLanterns(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const lanternCount = 50;
    const lanterns = [];

    for (let i = 0; i < lanternCount; i++) {
        const lanternGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const lanternMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.08 + Math.random() * 0.08, 0.9, 0.5),
            transparent: true,
            opacity: 0
        });

        const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
        lantern.position.set(
            (Math.random() - 0.5) * 60,
            Math.random() * 15 + 5,
            (Math.random() - 0.5) * 60
        );
        lantern.visible = false;
        group.add(lantern);

        lanterns.push({ mesh: lantern, material: lanternMaterial });
    }

    return {
        group,
        lanterns,
        ignite() {
            lanterns.forEach((lantern, i) => {
                lantern.mesh.visible = true;
                gsap.to(lantern.material, {
                    opacity: 0.8,
                    duration: 0.5,
                    delay: i * 0.02
                });
            });
        },
        twinkle() {
            lanterns.forEach((lantern, i) => {
                gsap.to(lantern.material, {
                    opacity: 0.4 + Math.random() * 0.6,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 3,
                    delay: i * 0.01
                });
            });
        },
        fade() {
            lanterns.forEach(lantern => {
                gsap.to(lantern.material, {
                    opacity: 0,
                    duration: 1.5
                });
            });
        },
        update(time) {
            lanterns.forEach((lantern, i) => {
                lantern.mesh.position.y += Math.sin(time + i) * 0.002;
            });
        },
        destroy() {
            lanterns.forEach(lantern => {
                lantern.mesh.geometry.dispose();
                lantern.material.dispose();
            });
            scene.remove(group);
        }
    };
}

/**
 * 创建雪地场景
 */
function createSnowGround(scene) {
    const group = new THREE.Group();
    scene.add(group);

    const groundGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    const groundMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 0 }
        },
        vertexShader: `
            precision highp float;
            varying vec2 vUv;
            varying float vHeight;
            uniform float uTime;

            void main() {
                vUv = uv;
                vec3 pos = position;

                // 雪地起伏
                vHeight = sin(pos.x * 0.1) * cos(pos.y * 0.1) * 2.0;
                pos.z += vHeight;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec2 vUv;
            varying float vHeight;
            uniform float uTime;
            uniform float uOpacity;

            void main() {
                vec3 snowColor = vec3(0.95, 0.98, 1.0);
                vec3 shadowColor = vec3(0.8, 0.85, 0.9);

                vec3 finalColor = mix(snowColor, shadowColor, (vHeight + 2.0) / 4.0);

                float alpha = uOpacity;

                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.visible = false;
    group.add(ground);

    return {
        group,
        ground,
        material: groundMaterial,
        appear() {
            ground.visible = true;
            gsap.to(groundMaterial.uniforms.uOpacity, {
                value: 0.8,
                duration: 2
            });
        },
        update(time) {
            groundMaterial.uniforms.uTime.value = time;
        },
        destroy() {
            scene.remove(group);
            groundGeometry.dispose();
            groundMaterial.dispose();
        }
    };
}
