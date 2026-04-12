const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const targetDir = path.join(__dirname, '..', 'src', 'app', 'dashboard');
console.log('Target directory:', targetDir);

walkDir(targetDir, function(filePath) {
  if (filePath.endsWith('page.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove the import line
    content = content.replace(/import\s*\{\s*DashboardLayout\s*\}\s*from\s*['"].*DashboardLayout['"];?\n?/, '');
    
    // Replace <DashboardLayout> with <>
    content = content.replace(/<DashboardLayout[^>]*>/, '<>');
    
    // Replace </DashboardLayout> with </>
    content = content.replace(/<\/DashboardLayout>/, '</>');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
