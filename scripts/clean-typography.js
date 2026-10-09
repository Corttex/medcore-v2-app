const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../src/app/dashboard'),
  path.join(__dirname, '../src/features/dashboard')
];

function cleanTypography(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Remove standalone 'italic'
  // Regex looks for "italic" with spaces or quotes around it
  newContent = newContent.replace(/(["'`\s])italic(["'`\s])/g, '$1$2');
  newContent = newContent.replace(/(["'`\s])italic(["'`\s])/g, '$1$2'); // double pass for consecutive

  // Replace font-black with font-semibold
  newContent = newContent.replace(/font-black/g, 'font-semibold');

  // Replace font-bold with font-medium
  newContent = newContent.replace(/font-bold/g, 'font-medium');

  // Clean up double spaces left by removing 'italic'
  newContent = newContent.replace(/\s{2,}/g, ' '); // Warning: might mess up indentation, let's be careful.
  
  if (content !== newContent) {
    // Actually, let's not do the global space replace as it breaks JSX indentation!
    let saferContent = content;
    saferContent = saferContent.replace(/(["'`\s])italic(["'`\s])/g, '$1$2');
    saferContent = saferContent.replace(/(["'`\s])italic(["'`\s])/g, '$1$2');
    saferContent = saferContent.replace(/font-black/g, 'font-semibold');
    saferContent = saferContent.replace(/font-bold/g, 'font-medium');
    // Just fix double spaces inside className strings (approximate)
    saferContent = saferContent.replace(/className=(["'`])(.*?)["'`]/g, (match, quote, inner) => {
       return `className=${quote}${inner.replace(/\s{2,}/g, ' ')}${quote}`;
    });
    
    fs.writeFileSync(filePath, saferContent, 'utf8');
    console.log(`Cleaned typography in ${filePath}`);
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
      cleanTypography(fullPath);
    }
  }
}

targetDirs.forEach(dir => traverseDir(dir));
console.log('Typography cleanup complete.');
