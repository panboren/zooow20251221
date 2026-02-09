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

let totalAdded = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ 文件不存在: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 匹配 fragmentShader: ` 后面紧跟 uniform，但没有 precision 声明的情况
  const pattern = /fragmentShader:\s*`\s*\n\s*(uniform|varying)/g;

  if (pattern.test(content)) {
    // 替换为添加 precision 声明
    const newContent = content.replace(
      /fragmentShader:\s*`\s*\n\s*(uniform|varying)/g,
      'fragmentShader: `\n      precision highp float;\n\n      $1'
    );

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      const added = (newContent.match(/precision highp float;/g) || []).length -
                   (content.match(/precision highp float;/g) || []).length;
      totalAdded += added;
      console.log(`✓ ${file}: 添加了 ${added} 行 "precision highp float;"`);
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log('修复完成！');
console.log(`总计添加了 ${totalAdded} 行 "precision highp float;"`);
console.log('='.repeat(60));
