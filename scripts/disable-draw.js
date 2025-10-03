const fs = require('fs');
const path = require('path');

/**
 * 脚本功能：在所有src下的test文件中为GameModel添加debug配置
 * 添加配置：state: { debug: { isDrawDisabled: true }}
 * 配置位置：GameModel的根级别，与child同级
 */

// 递归查找所有测试文件
function findTestFiles(dir) {
    const testFiles = [];
    
    function traverse(currentDir) {
        const files = fs.readdirSync(currentDir);
        
        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // 跳过node_modules等目录
                if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
                    traverse(filePath);
                }
            } else if (file.endsWith('.test.ts') || file.endsWith('.test.js')) {
                testFiles.push(filePath);
            }
        }
    }
    
    traverse(dir);
    return testFiles;
}

// 处理单个文件
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // 检查是否已经包含debug配置
        if (content.includes('debug: { isDrawDisabled: true }')) {
            console.log(`✓ ${filePath} - 已包含debug配置，跳过`);
            return false;
        }
        
        // 查找new GameModel(() => ({的位置
        const gameModelRegex = /new GameModel\(\(\) => \(\{/g;
        
        content = content.replace(gameModelRegex, (match) => {
            modified = true;
            console.log(`✓ ${filePath} - 在GameModel下方添加debug配置`);
            return `new GameModel(() => ({
        state: { debug: { isDrawDisabled: true }},`;
        });
        
        // 如果文件被修改，写回文件
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`✗ ${filePath} - 处理失败:`, error.message);
        return false;
    }
}

// 主函数
function main() {
    const srcDir = path.join(__dirname, '..', 'src');
    
    if (!fs.existsSync(srcDir)) {
        console.error('错误：找不到src目录');
        process.exit(1);
    }
    
    console.log('开始查找测试文件...');
    const testFiles = findTestFiles(srcDir);
    
    if (testFiles.length === 0) {
        console.log('未找到任何测试文件');
        return;
    }
    
    console.log(`找到 ${testFiles.length} 个测试文件:`);
    testFiles.forEach(file => {
        console.log(`  - ${path.relative(srcDir, file)}`);
    });
    
    console.log('\n开始处理文件...');
    let processedCount = 0;
    let modifiedCount = 0;
    
    for (const filePath of testFiles) {
        processedCount++;
        const modified = processFile(filePath);
        if (modified) {
            modifiedCount++;
        }
    }
    
    console.log(`\n处理完成！`);
    console.log(`总计处理: ${processedCount} 个文件`);
    console.log(`成功修改: ${modifiedCount} 个文件`);
    console.log(`无需修改: ${processedCount - modifiedCount} 个文件`);
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { findTestFiles, processFile };
