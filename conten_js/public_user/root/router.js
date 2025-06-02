// 合法路由白名单
const ALLOWED_ROUTES = [
    'http://127.0.0.1:5500/index.html',
    '/index.html',
    '/article.html'
];

// 初始化路由监控
window.onload = function () {
    // 1. 验证初始路由
    validateRoute(window.location.pathname);

    // 2. 重写history方法
    const originPushState = history.pushState;
    history.pushState = function (state, title, url) {
        if (url && !validateRoute(url)) {
            return blockNavigation();
        }
        return originPushState.apply(this, arguments);
    };

    // 3. 监听链接点击
    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && !validateRoute(href)) {
                e.preventDefault();
                blockNavigation();
            }
        }
    });
};

// 路由验证核心逻辑
function validateRoute(path) {
    const cleanPath = path.split('?')[0].split('#')[0];
    return ALLOWED_ROUTES.includes(cleanPath);
}

// 阻断导航并断开连接
function blockNavigation() {
    // 停止页面加载
    if (window.stop) window.stop();
    else document.execCommand('Stop');

    // 清空DOM
    document.body.innerHTML = `
                <h1 style="color:red;text-align:center;margin-top:100px">
                    非法路由访问已被拦截
                </h1>
            `;

    // 禁用所有交互
    document.body.style.pointerEvents = 'none';
}