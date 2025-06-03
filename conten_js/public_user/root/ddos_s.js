class DDoSDetection {
    constructor(options = {}) {
        // 配置选项
        this.config = {
            // 时间窗口（毫秒）
            timeWindow: options.timeWindow || 10000,
            // 请求阈值（超过此数量视为可疑）
            requestThreshold: options.requestThreshold || 50,
            // IP检查阈值（不同IP数量超过此值视为可疑）
            ipThreshold: options.ipThreshold || 10,
            // 请求间隔阈值（小于此间隔视为快速请求）
            intervalThreshold: options.intervalThreshold || 100,
            // 报告函数
            onReport: options.onReport || ((message, data) => console.log(message, data)),
            // 自动重置检测
            autoReset: options.autoReset !== undefined ? options.autoReset : true,
            // 重置时间（毫秒）
            resetInterval: options.resetInterval || 60000
        };
        
        // 存储请求记录
        this.requests = [];
        this.uniqueIPs = new Set();
        
        // 性能数据
        this.performanceMetrics = {
            cpuUsage: 0,
            memoryUsage: 0
        };
        
        // 检测状态
        this.isDetecting = false;
        this.detectionResult = {
            isUnderAttack: false,
            attackType: null,
            severity: 0
        };
        
        // 绑定方法
        this.startDetection = this.startDetection.bind(this);
        this.stopDetection = this.stopDetection.bind(this);
        this.recordRequest = this.recordRequest.bind(this);
        this.analyzeTraffic = this.analyzeTraffic.bind(this);
        this.checkPerformance = this.checkPerformance.bind(this);
        this.resetDetection = this.resetDetection.bind(this);
        
        // 安装XHR拦截
        this._installXHRInterceptor();
        
        // 安装Fetch API拦截
        this._installFetchInterceptor();
        
        // 如果启用自动重置，设置定时器
        if (this.config.autoReset) {
            setInterval(this.resetDetection, this.config.resetInterval);
        }
    }
    
    // 安装XHR拦截器
    _installXHRInterceptor() {
        const originalXHR = window.XMLHttpRequest;
        const self = this;
        
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            
            const originalOpen = xhr.open;
            xhr.open = function(method, url) {
                self.recordRequest({
                    method,
                    url,
                    timestamp: Date.now(),
                    ip: self._getClientIP() // 注意：前端无法直接获取真实IP，这里是模拟
                });
                return originalOpen.apply(xhr, arguments);
            };
            
            return xhr;
        };
    }
    
    // 安装Fetch API拦截器
    _installFetchInterceptor() {
        const originalFetch = window.fetch;
        const self = this;
        
        window.fetch = function(input, init = {}) {
            const requestInfo = {
                method: init.method || 'GET',
                url: typeof input === 'string' ? input : input.url,
                timestamp: Date.now(),
                ip: self._getClientIP() // 注意：前端无法直接获取真实IP，这里是模拟
            };
            
            self.recordRequest(requestInfo);
            return originalFetch.apply(this, arguments);
        };
    }
    
    // 模拟获取客户端IP（注意：前端无法真正获取客户端IP）
    _getClientIP() {
        // 在实际应用中，需要通过服务器端或其他手段获取IP
        // 这里仅作模拟，返回一个随机IP-like字符串
        return `192.168.1.${Math.floor(Math.random() * 255)}`;
    }
    
    // 开始检测
    startDetection() {
        if (this.isDetecting) return;
        
        this.isDetecting = true;
        this.analysisInterval = setInterval(this.analyzeTraffic, 5000);
        this.performanceInterval = setInterval(this.checkPerformance, 10000);
        
        this.config.onReport('DDoS检测已启动', {
            timeWindow: this.config.timeWindow,
            requestThreshold: this.config.requestThreshold
        });
    }
    
    // 停止检测
    stopDetection() {
        if (!this.isDetecting) return;
        
        this.isDetecting = false;
        clearInterval(this.analysisInterval);
        clearInterval(this.performanceInterval);
        
        this.config.onReport('DDoS检测已停止', {});
    }
    
    // 记录请求
    recordRequest(request) {
        if (!this.isDetecting) return;
        
        // 添加请求到记录
        this.requests.push(request);
        this.uniqueIPs.add(request.ip);
        
        // 移除时间窗口外的请求
        const windowStart = Date.now() - this.config.timeWindow;
        this.requests = this.requests.filter(r => r.timestamp >= windowStart);
        
        // 更新唯一IP集合
        const currentIPs = new Set(this.requests.map(r => r.ip));
        this.uniqueIPs = new Set([...this.uniqueIPs].filter(ip => currentIPs.has(ip)));
    }
    
    // 分析流量
    analyzeTraffic() {
        if (!this.isDetecting || this.requests.length === 0) return;
        
        const requestCount = this.requests.length;
        const uniqueIPCount = this.uniqueIPs.size;
        
        // 计算请求间隔
        const intervals = [];
        for (let i = 1; i < this.requests.length; i++) {
            intervals.push(this.requests[i].timestamp - this.requests[i-1].timestamp);
        }
        
        const avgInterval = intervals.length > 0 ? 
            intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length : 
            Infinity;
        
        const fastRequests = intervals.filter(interval => interval < this.config.intervalThreshold).length;
        
        // 分析URL分布
        const urlDistribution = {};
        this.requests.forEach(request => {
            urlDistribution[request.url] = (urlDistribution[request.url] || 0) + 1;
        });
        
        // 检测各种DDoS模式
        let isUnderAttack = false;
        let attackType = null;
        let severity = 0;
        
        // 1. 高请求频率攻击
        if (requestCount > this.config.requestThreshold) {
            isUnderAttack = true;
            attackType = '高请求频率攻击';
            severity = Math.min(10, Math.round(requestCount / this.config.requestThreshold));
        }
        
        // 2. 慢速loris攻击（请求间隔长但持续不断）
        else if (requestCount > this.config.requestThreshold * 0.7 && avgInterval > this.config.intervalThreshold * 3) {
            isUnderAttack = true;
            attackType = '慢速loris攻击';
            severity = Math.min(8, Math.round(requestCount / (this.config.requestThreshold * 0.7)));
        }
        
        // 3. 多IP分布式攻击
        else if (uniqueIPCount > this.config.ipThreshold) {
            isUnderAttack = true;
            attackType = '分布式攻击';
            severity = Math.min(10, Math.round(uniqueIPCount / this.config.ipThreshold));
        }
        
        // 4. 特定URL洪水攻击
        const urlAttackThreshold = Math.max(3, Math.floor(this.config.requestThreshold * 0.6));
        const targetedUrls = Object.entries(urlDistribution)
            .filter(([url, count]) => count > urlAttackThreshold)
            .map(([url, count]) => url);
        
        if (targetedUrls.length > 0) {
            isUnderAttack = true;
            attackType = 'URL洪水攻击';
            severity = Math.min(10, Math.round(Math.max(...Object.values(urlDistribution)) / urlAttackThreshold));
        }
        
        // 更新检测结果
        this.detectionResult = {
            isUnderAttack,
            attackType,
            severity,
            requestCount,
            uniqueIPCount,
            avgInterval,
            fastRequests,
            urlDistribution
        };
        
        // 报告检测结果
        if (isUnderAttack) {
            this.config.onReport(`检测到DDoS攻击: ${attackType}`, this.detectionResult);
        }
        
        return this.detectionResult;
    }
    
    // 检查系统性能（仅作示例，实际准确性有限）
    checkPerformance() {
        if (typeof window.performance === 'undefined') return;
        
        try {
            // 获取内存使用情况（非标准API，部分浏览器支持）
            if (typeof window.performance.memory !== 'undefined') {
                const memoryInfo = window.performance.memory;
                this.performanceMetrics.memoryUsage = Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100);
            }
            
            // 模拟CPU使用情况（前端无法直接获取，这里仅作示例）
            const start = performance.now();
            for (let i = 0; i < 1000000; i++);
            const end = performance.now();
            
            // 计算相对CPU使用率（非准确值）
            this.performanceMetrics.cpuUsage = Math.min(100, Math.round((end - start) * 10));
            
            // 如果性能异常，可能是受到攻击
            if (this.performanceMetrics.cpuUsage > 80 || this.performanceMetrics.memoryUsage > 90) {
                this.config.onReport('系统性能异常，可能受到DDoS攻击', this.performanceMetrics);
            }
            
        } catch (error) {
            console.error('获取性能数据失败:', error);
        }
    }
    
    // 重置检测状态
    resetDetection() {
        this.requests = [];
        this.uniqueIPs.clear();
        this.config.onReport('DDoS检测状态已重置', {});
    }
    
    // 获取当前检测结果
    getDetectionResult() {
        return {
            ...this.detectionResult,
            performance: this.performanceMetrics
        };
    }
}

// 使用示例
const ddosDetector = new DDoSDetection({
    timeWindow: 10000,       // 10秒时间窗口
    requestThreshold: 50,    // 超过50个请求视为可疑
    ipThreshold: 10,         // 超过10个不同IP视为可疑
    intervalThreshold: 100,  // 请求间隔小于100ms视为快速请求
    onReport: (message, data) => {
        console.log(`[DDoS检测] ${message}`, data);
        
        // 可以在这里添加UI显示逻辑
        if (data.isUnderAttack) {
            alert(`警告: 检测到DDoS攻击 (${data.attackType})! 严重程度: ${data.severity}/10`);
        }
    }
});

// 启动检测
ddosDetector.startDetection();

// 可选：一段时间后停止检测
// setTimeout(() => {
//     ddosDetector.stopDetection();
// }, 3600000); // 1小时后停止    