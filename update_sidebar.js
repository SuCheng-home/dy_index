const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/about/**/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('href: "/about/leadership" },') && !content.includes('href: "/about/canteen"')) {
    content = content.replace(
      '{ label: "领导班子", href: "/about/leadership" },',
      '{ label: "领导班子", href: "/about/leadership" },\n  { label: "食堂菜谱", href: "/about/canteen" },'
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
