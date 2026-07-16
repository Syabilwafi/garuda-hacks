const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const targetDir = path.join(__dirname, 'src');

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove multi-line comments /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove single-line comments // ... but avoid https:// or http://
    content = content.replace(/(?<!https?:)\/\/.*$/gm, '');
    
    // Clean up empty JSX braces {  } that might be left behind from {/* comment */}
    content = content.replace(/\{\s*\}/g, '');
    
    // Remove multiple blank lines left by comment removal
    content = content.replace(/\n\s*\n/g, '\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Stripped comments from ${filePath}`);
  }
});

// Also remove CSS comments in globals.css
const cssFile = path.join(__dirname, 'src', 'app', 'globals.css');
if (fs.existsSync(cssFile)) {
  let cssContent = fs.readFileSync(cssFile, 'utf8');
  cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
  cssContent = cssContent.replace(/\n\s*\n/g, '\n\n');
  fs.writeFileSync(cssFile, cssContent, 'utf8');
  console.log(`Stripped comments from ${cssFile}`);
}
