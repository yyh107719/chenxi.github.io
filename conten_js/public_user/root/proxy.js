// VPN/代理检测工具
window.onload = function () {
    // 获取用户IP和网络信息
    fetch('https://ipapi.co/json/')
        .then(response =>{
            console.log('IP检测成功',response)
            return response.json();
        })
        .then(data => {
            checkVPN(data)
        })
        .catch(error => {
            console.error('IP检测失败:', error);
        });

    // 检测VPN/代理的方法
    function checkVPN(ipData) {
        const warningMsg = "检测到VPN/代理访问，本网站禁止此类连接";
        
        // 1. 检查IP类型（数据中心IP通常是VPN）
        if(ipData.network && /data center|hosting/i.test(ipData.network)) {
            showBlockPage(warningMsg);
            return;
        }

        // 2. 检查ASN（云服务提供商）
        const cloudProviders = [
            'amazon', 'google', 'microsoft', 'alibaba', 
            'digitalocean', 'linode', 'vultr', 'ovh'
        ];
        if(ipData.asn && cloudProviders.some(p => ipData.asn.toLowerCase().includes(p))) {
            showBlockPage(warningMsg);
            return;
        }

        // 3. 检查时区与IP地理位置是否匹配
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(ipData.timezone && ipData.timezone !== browserTimezone) {
            showBlockPage("检测到地理位置异常");
            return;
        }

        // 4. 检查常见VPN端口
        if(window.RTCPeerConnection) {
            const pc = new RTCPeerConnection({iceServers:[]});
            pc.createDataChannel("");
            pc.createOffer().then(offer => {
                if(offer.sdp.includes('srflx') || offer.sdp.includes('relay')) {
                    showBlockPage(warningMsg);
                }
            });
            pc.close();
        }
    }

    // 显示拦截页面
    function showBlockPage(message) {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #1a1a2e;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: Arial;
                z-index: 9999;
                padding: 20px;
                text-align: center;
            ">
                <h1 style="color: #ff4d4d; font-size: 2em;">检测到非法网络,访问被限制</h1>
                <p style="font-size: 1.2em; max-width: 600px;">${message}</p>
                <p style="margin-top: 20px;">请关闭VPN或代理服务后刷新页面</p>
                <p style="margin-top: 20px;">为了互联网安全,暂时断开您的网站链接,谢谢您的配合!</p>
            </div>
        `;
        throw new Error("VPN Access Blocked");
    }
};
