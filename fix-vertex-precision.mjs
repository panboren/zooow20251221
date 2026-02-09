import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'pages/home/components/animation/animations');

const filesToFix = [
  'holographic-sacred-geometry.js',
  'holographic-polygon-prism.js'
];

let totalAdded = 0;

filesToFix.forEach(file => {
  const filePath = path.join(dir, file);

  let content = fs.readFileSync(filePath, 'utf8');

  // 匹配 vertexShader: ` 后面紧跟 varying，但没有 precision 声明的情况
  const newContent = content.replace(
    /vertexShader:\s*`\s*\n\s*(varying)/g,
    'vertexShader: `\n      precision highp float;\n\n      $1'
  );

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    const added = (newContent.match(/precision highp float;/g) || []).length -
                 (content.match(/precision highp float;/g) || []).length;
    totalAdded += added;
    console.log(`✓ ${file}: 添加了 ${added} 行 "precision highp float;"`);
  }
});

console.log('\n总计添加了', totalAdded, '行 "precision highp float;"');
