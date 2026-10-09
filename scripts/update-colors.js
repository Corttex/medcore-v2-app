const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app/dashboard'),
  path.join(__dirname, '../src/features/dashboard')
];

function replaceColorsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Replace 'brand' and 'lilac' with 'rd-cyan'
  const prefixes = ['text-', 'bg-', 'border-', 'ring-', 'shadow-', 'from-', 'via-', 'to-', 'group-hover:text-', 'group-hover:bg-', 'hover:text-', 'hover:bg-', 'hover:border-', 'focus-within:border-', 'focus-within:text-'];
  
  prefixes.forEach(prefix => {
    // For brand
    const regexBrand = new RegExp(prefix + 'brand(\\/\\d+)?', 'g');
    newContent = newContent.replace(regexBrand, (match, opacity) => {
      return prefix + 'rd-cyan' + (opacity || '');
    });
    
    // For lilac
    const regexLilac = new RegExp(prefix + 'lilac(\\/\\d+)?', 'g');
    newContent = newContent.replace(regexLilac, (match, opacity) => {
      return prefix + 'rd-cyan' + (opacity || '');
    });

    // For lilac-container
    const regexLilacContainer = new RegExp(prefix + 'lilac-container(\\/\\d+)?', 'g');
    newContent = newContent.replace(regexLilacContainer, (match, opacity) => {
      return prefix + 'rd-cyan' + (opacity || '');
    });
  });

  // Also replace explicit CSS variable usages if any
  newContent = newContent.replace(/var\(--brand\)/g, 'var(--color-rd-cyan)');
  newContent = newContent.replace(/var\(--brand-container\)/g, 'var(--color-rd-cyan)');
  
  // Replace the specific lilac-based shadow string in DashboardSidebar
  newContent = newContent.replace(/rgba\(167,139,250,0\.\d+\)/g, 'var(--color-rd-cyan)');
  newContent = newContent.replace(/rgba\(167,\s*139,\s*250,\s*0\.\d+\)/g, 'var(--color-rd-cyan)');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
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
      replaceColorsInFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => traverseDir(dir));
console.log('Color update complete.');
