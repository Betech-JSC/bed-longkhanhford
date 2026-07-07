#!/usr/bin/env node

/**
 * Script kiểm tra bảo vệ notranslate cho các Card components
 */

const fs = require('fs');
const path = require('path');

const cardComponents = [
    'resources/Frontend/js/Components/Card/CardApp.vue',
    'resources/Frontend/js/Components/Card/CardBook.vue',
    'resources/Frontend/js/Components/Card/CardCourse.vue',
    'resources/Frontend/js/Components/Card/CardCourseDetail.vue',
    'resources/Frontend/js/Components/Card/CardPost.vue',
    'resources/Frontend/js/Components/Card/CardPostRow.vue',
    'resources/Frontend/js/Components/Card/CardProduct.vue',
    'resources/Frontend/js/Components/Card/CardProductAbout.vue',
    'resources/Frontend/js/Components/Card/CardProductOrigin.vue',
    'resources/Frontend/js/Components/Card/CardService.vue',
    'resources/Frontend/js/Components/Card/CardSign.vue',
    'resources/Frontend/js/Components/Card/CardTeam.vue'
];

function checkCardProtection(filePath) {
    if (!fs.existsSync(filePath)) {
        return {
            file: filePath,
            exists: false,
            protected: false,
            issues: ['File không tồn tại']
        };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    const checks = {
        hasNotranslateClass: /class="[^"]*notranslate[^"]*"/.test(content),
        hasTranslateNo: /translate="no"/.test(content),
        hasVHtml: /v-html/.test(content),
        hasDynamicContent: /\{\{\s*item\.(title|description|content|name)/.test(content),
        hasTextContent: /\{\{\s*item\./.test(content)
    };

    const issues = [];
    const protectedElements = [];
    
    // Kiểm tra v-html có được bảo vệ
    if (checks.hasVHtml) {
        const vHtmlMatches = content.match(/v-html="[^"]*"/g) || [];
        vHtmlMatches.forEach(match => {
            const lineContent = content.split('\n').find(line => line.includes(match));
            if (lineContent && !lineContent.includes('notranslate')) {
                issues.push(`v-html chưa được bảo vệ: ${match}`);
            } else {
                protectedElements.push(`v-html được bảo vệ: ${match}`);
            }
        });
    }

    // Kiểm tra nội dung động có được bảo vệ
    if (checks.hasDynamicContent) {
        const dynamicMatches = content.match(/\{\{\s*item\.(title|description|content|name)[^}]*\}\}/g) || [];
        dynamicMatches.forEach(match => {
            const lines = content.split('\n');
            const lineIndex = lines.findIndex(line => line.includes(match));
            if (lineIndex >= 0) {
                const lineContent = lines[lineIndex];
                if (!lineContent.includes('notranslate')) {
                    issues.push(`Nội dung động chưa được bảo vệ: ${match} (dòng ${lineIndex + 1})`);
                } else {
                    protectedElements.push(`Nội dung động được bảo vệ: ${match}`);
                }
            }
        });
    }

    return {
        file: fileName,
        exists: true,
        protected: issues.length === 0,
        checks,
        issues,
        protectedElements,
        summary: {
            totalIssues: issues.length,
            totalProtected: protectedElements.length,
            hasVHtml: checks.hasVHtml,
            hasDynamicContent: checks.hasDynamicContent
        }
    };
}

console.log('🔍 Kiểm tra bảo vệ notranslate cho Card Components...\n');

const results = cardComponents.map(checkCardProtection);

// Tạo báo cáo
console.log('📊 BÁO CÁO TỔNG QUAN:');
console.log('='.repeat(50));

let totalFiles = 0;
let protectedFiles = 0;
let totalIssues = 0;

results.forEach(result => {
    if (result.exists) {
        totalFiles++;
        if (result.protected) {
            protectedFiles++;
        }
        totalIssues += result.issues.length;
    }
});

console.log(`📁 Tổng số files: ${totalFiles}`);
console.log(`✅ Files được bảo vệ: ${protectedFiles}`);
console.log(`❌ Files có vấn đề: ${totalFiles - protectedFiles}`);
console.log(`🚨 Tổng số vấn đề: ${totalIssues}\n`);

// Chi tiết từng file
console.log('📋 CHI TIẾT TỪNG FILE:');
console.log('='.repeat(50));

results.forEach(result => {
    if (!result.exists) {
        console.log(`❌ ${result.file} - File không tồn tại`);
        return;
    }

    const status = result.protected ? '✅' : '⚠️';
    console.log(`${status} ${result.file}`);
    
    if (result.summary.hasVHtml) {
        console.log(`   📝 Có v-html`);
    }
    
    if (result.summary.hasDynamicContent) {
        console.log(`   🔄 Có nội dung động`);
    }

    if (result.protectedElements.length > 0) {
        console.log(`   ✅ Được bảo vệ: ${result.protectedElements.length} phần tử`);
    }

    if (result.issues.length > 0) {
        console.log(`   ❌ Vấn đề (${result.issues.length}):`);
        result.issues.forEach(issue => {
            console.log(`      - ${issue}`);
        });
    }
    
    console.log('');
});

// Khuyến nghị
console.log('💡 KHUYẾN NGHỊ:');
console.log('='.repeat(50));

if (totalIssues === 0) {
    console.log('🎉 Tất cả Card components đã được bảo vệ tốt!');
} else {
    console.log('🔧 Cần khắc phục các vấn đề sau:');
    console.log('1. Thêm class "notranslate" cho các phần tử có nội dung động');
    console.log('2. Thêm attribute translate="no" cho các phần tử quan trọng');
    console.log('3. Đảm bảo v-html được bảo vệ');
    console.log('4. Kiểm tra lại các tiêu đề và mô tả sản phẩm');
}

console.log('\n🛠️  Để tự động sửa, chạy:');
console.log('node scripts/add-notranslate-protection.js');

// Tạo file báo cáo JSON
const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
        totalFiles,
        protectedFiles,
        totalIssues,
        protectionRate: Math.round((protectedFiles / totalFiles) * 100)
    },
    results
};

fs.writeFileSync('reports/card-protection-report.json', JSON.stringify(reportData, null, 2));
console.log('\n📄 Báo cáo chi tiết đã được lưu: reports/card-protection-report.json');