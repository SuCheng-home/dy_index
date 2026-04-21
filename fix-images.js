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

const userFiles = [
  'app/party/members/page.tsx',
  'app/teachers/page.tsx',
  'app/teachers/studio/page.tsx',
  'app/teachers/achievements/page.tsx',
  'app/teachers/training/page.tsx',
  'app/international/teachers/page.tsx',
  'components/principal-message.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const isUserFile = userFiles.some(uFile => file.includes(uFile));
  
  if (!isUserFile) {
    if (content.includes('/placeholder-user.jpg')) {
      content = content.replace(/\/placeholder-user\.jpg/g, () => {
        const rand = Math.floor(Math.random() * 8) + 1;
        return `/view/view${rand}.jpg`;
      });
      fs.writeFileSync(file, content, 'utf8');
    }
  } else {
    // If it's a user file, ensure it uses placeholder-user
    if (content.includes('/view/view')) {
      content = content.replace(/\/view\/view[0-9]\.jpg/g, '/placeholder-user.jpg');
      fs.writeFileSync(file, content, 'utf8');
    }
  }
});
