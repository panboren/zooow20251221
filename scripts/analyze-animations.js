/**
 * 运行代码分析器，诊断动画文件
 */

import { CodeAnalyzer } from '../utils/CodeAnalyzer.js'
import { resolve } from 'path'

const analyzer = new CodeAnalyzer()

const animationsDir = resolve('pages/home/components/animation/animations')

console.log('🔍 开始分析动画文件...\n')

const summary = analyzer.analyzeDirectory(animationsDir)

analyzer.logReport()

// 生成JSON报告文件
const fs = await import('fs')
const reportPath = resolve('code-analysis-report.json')
fs.writeFileSync(reportPath, analyzer.generateJSONReport())

console.log(`\n✅ 完整报告已保存到: ${reportPath}`)
