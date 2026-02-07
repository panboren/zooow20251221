# 📂 文件索引

## 核心工具文件

### 粒子系统
- `utils/ParticleFactory.js` - 统一粒子创建工厂
- `utils/GPUCompute.js` - GPU计算加速
- `utils/TextureAtlas.js` - 纹理图集优化
- `utils/MemoryPool.js` - 内存池管理

### 性能监控
- `utils/PerformanceMonitor.js` - 性能监控器
- `utils/LODManager.js` - 自适应LOD管理
- `components/PerformancePanel.js` - 可视化性能面板

### 代码分析
- `utils/CodeAnalyzer.js` - 代码分析工具
- `utils/quick-analyze.js` - 快速分析脚本

### 基类
- `pages/home/components/animation/animations/base/BaseEffect.js` - 基础特效基类
- `pages/home/components/animation/animations/base/EnhancedBaseEffect.js` - 增强特效基类

## 开发工具脚本

### 模板和生成
- `scripts/AnimationTemplateGenerator.js` - 动画模板生成器
- `scripts/BatchRefactor.js` - 批量重构工具

### 测试
- `scripts/AnimationTestSuite.js` - 动画测试套件
- `scripts/PerformanceBenchmark.js` - 性能基准测试
- `scripts/RegressionTest.js` - 回归测试

### 部署
- `scripts/Deploy.js` - 部署工具

### 分析
- `scripts/analyze-animations.js` - 动画分析脚本
- `utils/quick-analyze.js` - 快速分析脚本

## 文档

### 使用指南
- `docs/TOOL_GUIDE.md` - 工具使用指南
- `docs/EXAMPLES.md` - 示例代码

### 项目文档
- `完整优化总结.md` - 完整优化总结
- `优化总结.md` - 第一、二、三阶段总结
- `第三阶段总结.md` - 第三阶段总结
- `优化步骤.md` - 原始优化计划
- `剩余优化计划.md` - 剩余优化计划
- `快速开始.md` - 快速开始指南
- `FILES_INDEX.md` - 本文件索引

## 类型定义

- `types/animation.d.ts` - 完整TypeScript类型定义

## 示例文件

- `pages/home/components/animation/animations/optimized/galaxy-flow-enhanced.js` - 优化版galaxy-flow

## 优化后的动画

- `pages/home/components/animation/animations/galaxy-flow.js` - 已优化（O(n²) → O(n)）
- `pages/home/components/animation/animations/wind-flower-snow-moon.js` - 已优化（粒子数减半）

## 工具分类

### 创建类
- ParticleFactory - 粒子创建
- AnimationTemplateGenerator - 模板生成

### 监控类
- PerformanceMonitor - 性能监控
- PerformancePanel - 可视化面板
- LODManager - LOD管理

### 分析类
- CodeAnalyzer - 代码分析
- PerformanceBenchmark - 性能基准
- RegressionTest - 回归测试

### 优化类
- GPUCompute - GPU加速
- TextureAtlas - 纹理优化
- MemoryPool - 内存优化
- BatchRefactor - 代码重构

### 测试类
- AnimationTestSuite - 功能测试
- RegressionTest - 回归测试

### 部署类
- Deploy - 自动部署

## 按使用场景查找

### 我想创建新动画
1. `scripts/AnimationTemplateGenerator.js` - 生成模板
2. `utils/ParticleFactory.js` - 创建粒子
3. `utils/EnhancedBaseEffect.js` - 使用基类

### 我想优化现有动画
1. `scripts/BatchRefactor.js` - 批量重构
2. `utils/CodeAnalyzer.js` - 分析代码
3. `utils/PerformanceMonitor.js` - 监控性能

### 我想测试动画
1. `scripts/AnimationTestSuite.js` - 功能测试
2. `scripts/PerformanceBenchmark.js` - 性能测试
3. `scripts/RegressionTest.js` - 回归测试

### 我想部署项目
1. `scripts/Deploy.js` - 自动部署

### 我想了解工具使用
1. `docs/TOOL_GUIDE.md` - 工具指南
2. `docs/EXAMPLES.md` - 示例代码
3. `快速开始.md` - 快速开始

## 文件统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 核心工具 | 8 | 粒子、性能、分析工具 |
| 脚本工具 | 7 | 生成、测试、部署脚本 |
| 基类 | 2 | BaseEffect、EnhancedBaseEffect |
| 文档 | 7 | 指南、总结、示例 |
| 类型定义 | 1 | TypeScript类型 |
| 总计 | 25 | 完整工具链 |

## 快速导航

- 🚀 **开始**: `快速开始.md`
- 📚 **文档**: `docs/TOOL_GUIDE.md`
- 💡 **示例**: `docs/EXAMPLES.md`
- 📊 **总结**: `完整优化总结.md`
- 🔍 **索引**: `FILES_INDEX.md` (本文件)
