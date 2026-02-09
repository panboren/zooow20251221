import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'holographic-sacred-geometry.js',
  'holographic-void-cosmos.js',
  'holographic-quantum-flux.js',
  'holographic-polygon-prism.js',
  'holographic-polyphonic-matrix.js',
  'holographic-phoenix-rebirth.js',
  'holographic-neural-network.js',
  'holographic-geometric-nexus.js',
  'holographic-ethereal-garden.js',
  'holographic-dragon-awakening.js',
  'holographic-dimension-fold.js',
  'holographic-crystalline-formation.js',
  'holographic-crystal-cathedral.js',
  'holographic-bioluminescence.js',
  'holographic-creation.js',
  'holographic-aurora-borealis.js',
  'holographic/holographic-animations-enhanced.js',
  'holographic/holographic-core.js'
];

const dir = path.join(__dirname, 'pages/home/components/animation/animations');

console.log('检查所有着色器的精度声明...\n');

let issuesFound = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ 文件不存在: ${file}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 查找所有 shader 定义
  const shaderMatches = content.matchAll(/(vertexShader|fragmentShader):\s*`([\s\S]*?)`/g);
  
  for (const match of shaderMatches) {
    const shaderType = match[1];
    const shaderBody = match[2];
    const firstLine = shaderBody.trim().split('\n')[0].trim();

    // 检查第一行是否是 precision 声明
    if (!firstLine.startsWith('precision')) {
      const startLine = content.substring(0, match.index).split('\n').length;
      console.log(`❌ ${file}:${startLine} - ${shaderType} 缺少精度声明`);
      console.log(`   第一行: "${firstLine}"\n`);
      issuesFound++;
    }
  }
});

if (issuesFound === 0) {
  console.log('✅ 所有着色器都包含精度声明！');
} else {
  console.log(`\n⚠️ 发现 ${issuesFound} 个着色器缺少精度声明`);
}
