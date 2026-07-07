#!/usr/bin/env node

/**
 * Script để thêm class 'notranslate' cho các phần nội dung động
 * nhằm chặn Google Translate dịch những phần không mong muốn
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Các pattern cần tìm và thay thế
const patterns = [
    // Nội dung bài viết/blog
    {
        search: /(<div[^>]*class="[^"]*prose[^"]*"[^>]*)\s+v-html="[^"]*\.content"/g,
        replace: '$1 notranslate" v-html="$2.content"',
        description: 'Blog/Post content'
    },
    
    // Mô tả sản phẩm
    {
        search: /(<div[^>]*)\s+v-html="[^"]*\.description"/g,
        replace: '$1 class="notranslate" v-html="$2.description"',
        description: 'Product descriptions'
    },
    
    // Tiêu đề động
    {
        search: /(<h[1-6][^>]*)\s+v-html="[^"]*\.title"/g,
        replace: '$1 class="notranslate" v-html="$2.title"',
        description: 'Dynamic titles'
    },
    
    // Nội dung feedback/review
    {
        search: /(<div[^>]*)\s+v-html="item\.content"/g,
        replace: '$1 class="notranslate" v-html="item.content"',
        description: 'Feedback content'
    }
];

// Danh sách các file cần kiểm tra
const filesToCheck = [
    'resources/Frontend/js/Pages/Jobs/Show.vue',
    'resources/Frontend/js/Pages/Posts/Show.vue', 
    'resources/Frontend/js/Pages/Products/Show.vue',
    'resources/Frontend/js/Pages/Products/Index.vue',
    'resources/Frontend/js/Pages/Member.vue',
    'resources/Frontend/js/Components/SectionFeedback.vue',
    'resources/Frontend/js/Components/Timeline.vue',
    'resources/Frontend/js/Components/DynamicBanner.vue',
    'resources/Frontend/js/Components/Card/CardProduct.vue',
    'resources/Frontend/js/Components/Product/DescFeature.vue',
    'resources/Frontend/js/Components/Product/Significant.vue',
    'resources/Frontend/js/Components/Product/Ingredient.vue',
    'resources/Frontend/js/Components/Product/DescDetail.vue',
    'resources/Frontend/js/Components/SectionAboutProduct.vue',
    'resources/Frontend/js/Components/AutoCountSection.vue',
    'resources/Frontend/js/Components/BannerIcon.vue'
];

function addNotranslateClass(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File không tồn tại: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changes = [];

    // Kiểm tra các pattern cần thay thế
    patterns.forEach(pattern => {
        const matches = content.match(pattern.search);
        if (matches) {
            content = content.replace(pattern.search, pattern.replace);
            modified = true;
            changes.push(pattern.description);
        }
    });

    // Thêm notranslate cho các trường hợp cụ thể
    const specificReplacements = [
        // Job content
        {
            from: '<div class="prose prose-blog" v-html="job.content">',
            to: '<div class="prose prose-blog notranslate" v-html="job.content">',
            file: 'Jobs/Show.vue'
        },
        
        // Post content  
        {
            from: '<div class="prose prose-blog" v-html="post?.content"></div>',
            to: '<div class="prose prose-blog notranslate" v-html="post?.content"></div>',
            file: 'Posts/Show.vue'
        },
        
        // Member bio
        {
            from: '<div class="prose prose-member body-1" v-html="member.bio"></div>',
            to: '<div class="prose prose-member body-1 notranslate" v-html="member.bio"></div>',
            file: 'Member.vue'
        },
        
        // Product overview sections
        {
            from: '<div class="body-1" v-html="product.overview"></div>',
            to: '<div class="body-1 notranslate" v-html="product.overview"></div>',
            file: 'Products/Show.vue'
        },
        
        // Feedback content
        {
            from: '<div class="body-2 text-gray-900 h-[160px]" v-html="item.content"></div>',
            to: '<div class="body-2 text-gray-900 h-[160px] notranslate" v-html="item.content"></div>',
            file: 'SectionFeedback.vue'
        },
        
        // Timeline description
        {
            from: 'v-html="history.description"',
            to: 'v-html="history.description" class="notranslate"',
            file: 'Timeline.vue'
        }
    ];

    specificReplacements.forEach(replacement => {
        if (filePath.includes(replacement.file) && content.includes(replacement.from)) {
            content = content.replace(replacement.from, replacement.to);
            modified = true;
            changes.push(`Specific: ${replacement.file}`);
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Đã cập nhật: ${filePath}`);
        changes.forEach(change => console.log(`   - ${change}`));
        return true;
    } else {
        console.log(`ℹ️  Không cần thay đổi: ${filePath}`);
        return false;
    }
}

// Chạy script
console.log('🚀 Bắt đầu thêm class notranslate cho nội dung động...\n');

let totalModified = 0;
filesToCheck.forEach(file => {
    if (addNotranslateClass(file)) {
        totalModified++;
    }
});

console.log(`\n✨ Hoàn thành! Đã cập nhật ${totalModified} file(s).`);

// Tạo CSS bổ sung để đảm bảo notranslate hoạt động
const additionalCSS = `
/* CSS để đảm bảo Google Translate không dịch các phần tử có class notranslate */
.notranslate {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
}

/* Ẩn hoàn toàn Google Translate UI */
.goog-te-banner-frame,
.goog-te-menu-frame,
.goog-te-balloon-frame {
    display: none !important;
}

body {
    top: 0px !important;
}

/* Đảm bảo các phần tử quan trọng không bị dịch */
[class*="notranslate"],
.notranslate *,
[translate="no"],
[translate="no"] * {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
}
`;

fs.writeFileSync('resources/Frontend/css/notranslate.css', additionalCSS);
console.log('📝 Đã tạo file CSS bổ sung: resources/Frontend/css/notranslate.css');