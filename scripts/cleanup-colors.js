const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app/dashboard'),
  path.join(__dirname, '../src/features/dashboard')
];

function fixContainerSuffix(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(/rd-cyan-container/g, 'rd-navy');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fixContainerSuffix(fullPath);
    }
  }
}

targetDirs.forEach(dir => traverseDir(dir));
console.log('Cleanup complete.');
