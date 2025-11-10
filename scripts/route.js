const fs = require('fs');
const path = require('path');

function updateIndexFile() {
    const srcDir = path.join(__dirname, '..', 'src');
    const indexPath = path.join(srcDir, 'index.ts');
    
    // 动态读取 src 目录下的所有二级目录（职业文件夹）
    const classDirs = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    const exports = [];
    
    // 遍历每个职业文件夹
    classDirs.forEach(classDir => {
        const classPath = path.join(srcDir, classDir);
        
        // 检查职业文件夹是否存在
        if (!fs.existsSync(classPath)) {
            return;
        }
        
        // 读取职业文件夹下的所有子目录（牌文件夹）
        const cardDirs = fs.readdirSync(classPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        // 遍历每个牌文件夹
        cardDirs.forEach(cardDir => {
            const cardIndexFile = path.join(classPath, cardDir, 'index.ts');
            if (fs.existsSync(cardIndexFile)) {
                exports.push(`export * from './${classDir}/${cardDir}';`);
            }
        });
    });
    
    // 按字母顺序排序
    exports.sort();
    
    const content = exports.join('\n') + '\n';
    fs.writeFileSync(indexPath, content, 'utf8');
}

if (require.main === module) {
    updateIndexFile();
}

module.exports = { updateIndexFile };
