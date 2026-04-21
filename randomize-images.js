const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('/view/view1.jpg')) {
    content = content.replace(/\/view\/view1\.jpg/g, () => {
      const rand = Math.floor(Math.random() * 8) + 1;
      return `/view/view${rand}.jpg`;
    });
    fs.writeFileSync(file, content, 'utf8');
  }
});
