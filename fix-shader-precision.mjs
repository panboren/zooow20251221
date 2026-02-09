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

let totalRemoved = 0;
const results = [];

files.forEach(file => {
  const filePath = path.join(dir, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ 文件不存在: ${file}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const newLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed !== 'precision highp int;';
  });

  const removed = lines.length - newLines.length;
  totalRemoved += removed;

  if (removed > 0) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    results.push({ file, removed });
    console.log(`✓ ${file}: 删除了 ${removed} 行 "precision highp int;"`);
  } else {
    console.log(`- ${file}: 无需修改`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('修复完成！');
console.log(`共处理 ${results.length} 个文件`);
console.log(`总计删除了 ${totalRemoved} 行 "precision highp int;"`);
console.log('='.repeat(60));
