/**
 * 代码分析器 - 自动分析动画文件复杂度
 * 检测性能问题、代码质量问题、最佳实践遵循情况
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

export class CodeAnalyzer {
  constructor() {
    this.analyzedFiles = []
    this.issues = []
    this.stats = {
      totalFiles: 0,
      totalLines: 0,
      totalParticles: 0,
      avgComplexity: 0,
      filesUsingBaseEffect: 0,
      filesWithCleanup: 0,
      filesWithON2Loops: 0
    }
  }

  /**
   * 分析单个文件
   */
  analyzeFile(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      const analysis = {
        filePath,
        fileName: filePath.split('\\').pop(),
        lines: lines.length,
        particleCount: this.extractParticleCount(content),
        complexity: this.calculateComplexity(content, lines),
        usesBaseEffect: this.checkUsesBaseEffect(content),
        hasCleanup: this.checkHasCleanup(content),
        hasON2Loops: this.checkForON2Loops(content, lines),
        issues: [],
        priority: 'P2'
      }

      // 生成问题列表
      analysis.issues = this.generateIssues(analysis)

      // 计算优先级
      analysis.priority = this.calculatePriority(analysis)

      return analysis
    } catch (error) {
      console.error(`分析文件失败: ${filePath}`, error)
      return null
    }
  }

  /**
   * 提取粒子数量
   */
  extractParticleCount(content) {
    const patterns = [
      /count\s*[:=]\s*(\d+)/i,
      /particle.*count.*[:=]\s*(\d+)/i,
      /(\d{3,6}).*particle/i,
      /create.*\((\d{3,6})/i
    ]

    for (const pattern of patterns) {
      const match = content.match(pattern)
      if (match) {
        return parseInt(match[1])
      }
    }

    return 0
  }

  /**
   * 计算复杂度
   */
  calculateComplexity(content, lines) {
    let complexity = 0

    // 嵌套层级
    const maxNesting = this.calculateMaxNesting(lines)
    complexity += maxNesting * 2

    // 循环数量
    const loopCount = (content.match(/\b(for|while|do)\b/g) || []).length
    complexity += loopCount

    // 函数数量
    const functionCount = (content.match(/\bfunction\b|\b=>\b/g) || []).length
    complexity += functionCount * 0.5

    // 条件语句数量
    const ifCount = (content.match(/\bif\b/g) || []).length
    complexity += ifCount * 0.5

    return Math.round(complexity)
  }

  /**
   * 计算最大嵌套层级
   */
  calculateMaxNesting(lines) {
    let maxNesting = 0
    let currentNesting = 0

    for (const line of lines) {
      // 增加嵌套
      if (/^\s*[\{\(]/.test(line)) {
        currentNesting++
        maxNesting = Math.max(maxNesting, currentNesting)
      }
      // 减少嵌套
      if (/^\s*[\}\)]/.test(line)) {
        currentNesting = Math.max(0, currentNesting - 1)
      }
    }

    return maxNesting
  }

  /**
   * 检查是否使用BaseEffect
   */
  checkUsesBaseEffect(content) {
    return /extends\s+BaseEffect|import.*BaseEffect/.test(content)
  }

  /**
   * 检查是否有cleanup逻辑
   */
  checkHasCleanup(content) {
    return /cleanup\s*\(|dispose\s*\(/.test(content)
  }

  /**
   * 检查O(n²)嵌套循环
   */
  checkForON2Loops(content, lines) {
    const on2Loops = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const match = line.match(/for\s*\(\s*\w+\s*=\s*0;\s*\w+\s*<\s*(\d+|\w+)/)

      if (match) {
        // 检查后续行是否有嵌套循环
        let nesting = 0
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
          const nestedLine = lines[j]
          if (nestedLine.includes('for') || nestedLine.includes('while')) {
            nesting++
            if (nesting >= 2) {
              on2Loops.push({
                line: j + 1,
                content: nestedLine.trim().substring(0, 60)
              })
              break
            }
          }
        }
      }
    }

    return on2Loops
  }

  /**
   * 生成问题列表
   */
  generateIssues(analysis) {
    const issues = []

    if (!analysis.usesBaseEffect) {
      issues.push({
        type: 'architecture',
        severity: 'warning',
        message: '未使用BaseEffect基类，可能导致代码重复'
      })
    }

    if (!analysis.hasCleanup) {
      issues.push({
        type: 'memory',
        severity: 'error',
        message: '缺少cleanup逻辑，可能导致内存泄漏'
      })
    }

    if (analysis.hasON2Loops.length > 0) {
      issues.push({
        type: 'performance',
        severity: 'critical',
        message: `发现${analysis.hasON2Loops.length}个O(n²)嵌套循环，严重影响性能`
      })
    }

    if (analysis.particleCount > 50000 && !analysis.usesBaseEffect) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: '粒子数量超过5万，建议使用LOD系统'
      })
    }

    if (analysis.lines > 500 && analysis.complexity > 50) {
      issues.push({
        type: 'maintainability',
        severity: 'warning',
        message: '文件过于复杂，建议拆分'
      })
    }

    return issues
  }

  /**
   * 计算优先级
   */
  calculatePriority(analysis) {
    const criticalIssues = analysis.issues.filter(i => i.severity === 'critical').length
    const errorIssues = analysis.issues.filter(i => i.severity === 'error').length

    if (criticalIssues > 0 || analysis.hasON2Loops.length > 0) {
      return 'P0'
    }
    if (errorIssues > 0 || analysis.particleCount > 100000) {
      return 'P1'
    }
    if (analysis.issues.length > 0) {
      return 'P2'
    }
    return 'P3'
  }

  /**
   * 分析目录
   */
  analyzeDirectory(dirPath, recursive = true) {
    const files = this.getJSFiles(dirPath, recursive)
    this.analyzedFiles = []
    this.issues = []

    files.forEach(filePath => {
      const analysis = this.analyzeFile(filePath)
      if (analysis) {
        this.analyzedFiles.push(analysis)
        this.issues.push(...analysis.issues)
      }
    })

    // 更新统计
    this.updateStats()

    return this.getSummary()
  }

  /**
   * 获取目录中的JS文件
   */
  getJSFiles(dirPath, recursive = true) {
    const files = []

    const scan = (path) => {
      const items = readdirSync(path)
      for (const item of items) {
        const fullPath = join(path, item)
        const stat = statSync(fullPath)

        if (stat.isDirectory() && recursive) {
          scan(fullPath)
        } else if (item.endsWith('.js') && !item.includes('test') && !item.includes('spec')) {
          files.push(fullPath)
        }
      }
    }

    scan(dirPath)
    return files
  }

  /**
   * 更新统计信息
   */
  updateStats() {
    this.stats.totalFiles = this.analyzedFiles.length
    this.stats.totalLines = this.analyzedFiles.reduce((sum, f) => sum + f.lines, 0)
    this.stats.totalParticles = this.analyzedFiles.reduce((sum, f) => sum + f.particleCount, 0)
    this.stats.avgComplexity = Math.round(
      this.analyzedFiles.reduce((sum, f) => sum + f.complexity, 0) / this.stats.totalFiles
    )
    this.stats.filesUsingBaseEffect = this.analyzedFiles.filter(f => f.usesBaseEffect).length
    this.stats.filesWithCleanup = this.analyzedFiles.filter(f => f.hasCleanup).length
    this.stats.filesWithON2Loops = this.analyzedFiles.filter(f => f.hasON2Loops.length > 0).length
  }

  /**
   * 获取摘要
   */
  getSummary() {
    return {
      stats: this.stats,
      priorityList: this.getPriorityList(),
      topIssues: this.getTopIssues(),
      recommendations: this.getRecommendations()
    }
  }

  /**
   * 获取优先级列表
   */
  getPriorityList() {
    const priorityOrder = ['P0', 'P1', 'P2', 'P3']
    const result = {}

    priorityOrder.forEach(priority => {
      result[priority] = this.analyzedFiles.filter(f => f.priority === priority)
    })

    return result
  }

  /**
   * 获取最重要的问题
   */
  getTopIssues(limit = 10) {
    const severityWeight = { critical: 3, error: 2, warning: 1 }
    return this.issues
      .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity])
      .slice(0, limit)
  }

  /**
   * 获取建议
   */
  getRecommendations() {
    const recommendations = []

    if (this.stats.filesWithON2Loops > 0) {
      recommendations.push(
        `发现 ${this.stats.filesWithON2Loops} 个文件存在O(n²)循环，优先优化`
      )
    }

    if (this.stats.filesWithCleanup < this.stats.totalFiles * 0.8) {
      recommendations.push(
        `${this.stats.totalFiles - this.stats.filesWithCleanup} 个文件缺少cleanup逻辑，需要补充`
      )
    }

    if (this.stats.filesUsingBaseEffect < this.stats.totalFiles * 0.5) {
      recommendations.push(
        `${this.stats.totalFiles - this.stats.filesUsingBaseEffect} 个文件未使用BaseEffect，建议重构`
      )
    }

    if (this.stats.avgComplexity > 30) {
      recommendations.push(`平均复杂度过高(${this.stats.avgComplexity})，建议拆分复杂文件`)
    }

    return recommendations
  }

  /**
   * 打印报告
   */
  logReport() {
    const summary = this.getSummary()

    console.group('📈 代码分析报告')
    console.log(`总文件数: ${summary.stats.totalFiles}`)
    console.log(`总代码行数: ${summary.stats.totalLines.toLocaleString()}`)
    console.log(`总粒子数: ${summary.stats.totalParticles.toLocaleString()}`)
    console.log(`平均复杂度: ${summary.stats.avgComplexity}`)
    console.log(`使用BaseEffect: ${summary.stats.filesUsingBaseEffect}/${summary.stats.totalFiles}`)
    console.log(`有cleanup: ${summary.stats.filesWithCleanup}/${summary.stats.totalFiles}`)
    console.log(`存在O(n²)循环: ${summary.stats.filesWithON2Loops}`)

    console.group('🎯 优先级列表')
    Object.entries(summary.priorityList).forEach(([priority, files]) => {
      if (files.length > 0) {
        console.log(`${priority} (${files.length}个文件):`)
        files.forEach(f => {
          console.log(`  - ${f.fileName}: ${f.particleCount}粒子, ${f.issues.length}个问题`)
        })
      }
    })
    console.groupEnd()

    if (summary.recommendations.length > 0) {
      console.group('💡 建议')
      summary.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`)
      })
      console.groupEnd()
    }

    console.groupEnd()
  }

  /**
   * 生成JSON报告
   */
  generateJSONReport() {
    const summary = this.getSummary()
    return JSON.stringify(summary, null, 2)
  }
}
