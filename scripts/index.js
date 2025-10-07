const fs = require('fs');
const path = require('path');

function updateIndexFile() {
    const srcDir = path.join(__dirname, '..', 'src');
    const indexPath = path.join(srcDir, 'index.ts');
    
    const directories = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    const exports = [];
    
    directories.forEach(dir => {
        const indexFile = path.join(srcDir, dir, 'index.ts');
        if (fs.existsSync(indexFile)) {
            exports.push(`export * from './${dir}';`);
        }
    });
    
    const content = exports.join('\n') + '\n';
    fs.writeFileSync(indexPath, content, 'utf8');
}

if (require.main === module) {
    updateIndexFile();
}

module.exports = { updateIndexFile };
