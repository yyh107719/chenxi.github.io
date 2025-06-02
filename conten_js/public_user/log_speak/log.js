// 模拟服务器数据和API请求
const mockServer = {
    // 模拟数据库（存储文章数据）
    data: {
        articles: [
            {
                id: 1,
                title: "Web安全基础教程",
                content: "本文介绍了Web安全的基础知识，包括XSS、CSRF、SQL注入等常见安全漏洞的原理和防范方法。适合Web开发初学者了解Web安全的基本概念和最佳实践。",
                category: "security",
                tags: ["security", "web"],
                status: "published",
                created_at: "2023-06-01T12:00:00Z",
                updated_at: "2023-06-01T12:00:00Z",
                author:"李四"
            },
            {
                id: 2,
                title: "JavaScript自动化测试实战",
                content: "如何使用Jest和Cypress进行JavaScript代码的单元测试和端到端测试。本文详细介绍了测试框架的安装配置、测试用例编写、测试覆盖率分析等内容，并通过实例演示了如何构建完整的自动化测试流程。",
                category: "automation",
                tags: ["javascript", "testing"],
                status: "published",
                author:"张三",
                created_at: "2023-05-15T14:30:00Z",
                updated_at: "2023-05-15T14:30:00Z"
            },
            {
                id: 3,
                title: "Web安全基础教程",
                content: "本文介绍了Web安全的基础知识，包括XSS、CSRF、SQL注入等常见安全漏洞的原理和防范方法。适合Web开发初学者了解Web安全的基本概念和最佳实践。",
                category: "security",
                tags: ["security", "web"],
                status: "published",
                created_at: "2023-06-01T12:00:00Z",
                updated_at: "2023-06-01T12:00:00Z",
                author:"李四"
            },
            {
                id: 4,
                title: "JavaScript自动化测试实战",
                content: "如何使用Jest和Cypress进行JavaScript代码的单元测试和端到端测试。本文详细介绍了测试框架的安装配置、测试用例编写、测试覆盖率分析等内容，并通过实例演示了如何构建完整的自动化测试流程。",
                category: "automation",
                tags: ["javascript", "testing"],
                status: "published",
                author:"张三",
                created_at: "2023-05-15T14:30:00Z",
                updated_at: "2023-05-15T14:30:00Z"
            }
        ]
    },

    // 模拟 GET 请求（获取文章列表）
    getArticles() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 200,
                    data: this.data.articles
                });
            }, 500); // 模拟网络延迟
        });
    },

    // 模拟 GET 请求（获取单篇文章详情）
    getArticleById(id) {
        return new Promise(resolve => {
            setTimeout(() => {
                const article = this.data.articles.find(a => a.id === id);
                resolve({
                    status: article ? 200 : 404,
                    data: article
                });
            }, 600); // 模拟网络延迟
        });
    },

    // 模拟 POST 请求（添加新文章）
    addArticle(article) {
        return new Promise(resolve => {
            setTimeout(() => {
                const newArticle = {
                    id: this.data.articles.length + 1,
                    ...article,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                this.data.articles.push(newArticle);
                resolve({
                    status: 201,
                    data: newArticle
                });
            }, 800); // 模拟网络延迟
        });
    }
};

// 从模拟接口获取文章列表并渲染
async function loadArticles() {
    try {
        const container = document.getElementById('articles-container');
        if (!container) return;

        // 清空原有内容（避免重复渲染）
        container.innerHTML = '';

        const response = await mockServer.getArticles();
        if (response.status === 200) {
            const articles = response.data;
            articles.forEach(article => {
                container.innerHTML += `
                    <div class="bg-panel backdrop-blur-sm rounded-xl p-6 border border-accent/20 mb-6 cursor-pointer hover:shadow-lg transition-all duration-300" 
                         data-article-id="${article.id}">
                        <h3 class="text-xl font-semibold mb-2 text-white">${article.title}</h3>
                        <p class="text-gray-400 mb-4 line-clamp-3">${article.content}</p>
                        <div class="flex items-center justify-between text-sm text-gray-400">
                            <span>作者：${article.author}</span>
                            <span>发布时间：${new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            });

            // 为所有文章添加点击事件
            document.querySelectorAll('[data-article-id]').forEach(articleEl => {
                articleEl.addEventListener('click', function() {
                    const articleId = this.getAttribute('data-article-id');
                    navigateToArticleDetail(articleId);
                });
            });
        }
    } catch (error) {
        console.error('获取文章失败:', error);
    }
}

// 导航到文章详情页
function navigateToArticleDetail(articleId) {
    // 使用URL参数传递文章ID
    window.location.href = `article.html?id=${articleId}`;
}

// 在文章详情页加载文章内容
async function loadArticleDetail() {
    try {
        // 从URL中获取文章ID
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = parseInt(urlParams.get('id'));
        
        if (!articleId) {
            document.getElementById('article-content').innerHTML = '<div class="text-center py-16 text-gray-400">未找到文章ID</div>';
            return;
        }

        const response = await mockServer.getArticleById(articleId);
        if (response.status === 200) {
            const article = response.data;
            const articleContent = document.getElementById('article-content');
            
            articleContent.innerHTML = `
                <div class="bg-panel backdrop-blur-sm rounded-xl p-8 border border-accent/20">
                    <h1 class="text-3xl font-bold mb-4 text-white">${article.title}</h1>
                    <div class="flex items-center text-sm text-gray-400 mb-6">
                        <span>作者：${article.author}</span>
                        <span class="mx-3">•</span>
                        <span>发布时间：${new Date(article.created_at).toLocaleDateString()}</span>
                        <span class="mx-3">•</span>
                        <span>分类：${article.category}</span>
                    </div>
                    <div class="prose prose-invert max-w-none text-gray-300">
                        <p>${article.content}</p>
                    </div>
                </div>
                <div class="mt-8">
                    <button id="back-btn" class="px-6 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white transition-colors duration-300">
                        <i class="fa fa-arrow-left mr-2"></i>返回文章列表
                    </button>
                </div>
            `;

            // 返回按钮事件
            document.getElementById('back-btn').addEventListener('click', () => {
                window.history.back();
            });
        } else {
            document.getElementById('article-content').innerHTML = '<div class="text-center py-16 text-gray-400">文章不存在</div>';
        }
    } catch (error) {
        console.error('加载文章详情失败:', error);
        document.getElementById('article-content').innerHTML = '<div class="text-center py-16 text-red-500">加载文章失败，请稍后重试</div>';
    }
}

// 根据当前页面决定执行哪个函数
window.onload = function() {
    if (window.location.pathname.includes('article.html')) {
        loadArticleDetail();
    } else {
        loadArticles();
    }
};