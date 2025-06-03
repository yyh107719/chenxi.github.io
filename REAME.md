说明:
    Thank you for using my software. This software is a toolbox software, mainly used for automated testers and Internet personnel, including student body tools. The tools are very simple, simple, free and open source, and do not spend money for everyone to use. However, we hope that everyone will pay attention to legal responsibilities, respect the copyright of the author, and prohibit commercial use. Copyright: Xiaoyu programmer, prohibited for commercial use. The tools do not have drainage and any behavior, and will continue to update in the future. Please look forward to it! If you use it for illegal purposes, you will bear legal responsibility personally!
License:
    感谢您使用我的软件,本软件是一款工具箱软件,主要用于自动化测试人员以及互联网人员包括学生体工具,工具非常简单,页面简化,工具免费开源,且不要花费钱,供大家使用,但希望大家注意法律责任,尊重作者版权,禁止用于商用,版权:小鱼程序员,禁止用于商用,工具不具有引流以及任何行为,后期将不断的更新功能,敬请期待!如果您用于违法,由您个人承担法律责任!
    1.禁止恶意售卖,篡改源码,进行第三方售卖!
    2.非法用于web开发,请勿用于非法用途!
    3.禁止用于商业用途,请勿用于商业用途!
    4.未经作者授权,该套源码,您可以搭建服务器,或者本地搭建均没有问题,但仅供测试,禁止用于商业!一经发现,追究相关法律法规!

`版本说明:`
    小鱼工具箱V1.0
        1.支持本地数据新增 、修改、删除、查询博客  需要注意是JSON数组格式 在log_spreak.js中修改即可
        2.支持动态数据切换:
            1.活跃工具,月使用量 API调用 满意度评分
        3.支持功能自动化分区功能:MD5加密,Base64编码/解码 JSON格式转换 IP地址合法性查询 代码一键生成 AST解混淆(待完善)
        4.网络安全模块:
            1.密码生成器
            2.端口扫描器
        5.支持本地安全Debuger,您可以选择关闭,也可以选择开启!默认是开启的!在des.js文件夹下(上线建议开启)
        6.另外本地支持开启路由保护,但并非所有路由都支持路由保护,后续在新的版本会进行优化!
        7.支持三端响应式布局
        8.支持多端多浏览器兼容
        9.支持IP检测,proxy代理检测,杜绝网站例如虚拟流量脚本,您可以关闭,默认开启!关闭去 root目录下/proxy.js注释代码!
        10.支持路由检测,默认是关闭的,如果你需要开启,你可以进行开启
                <script src="./conten_js/public_user/root/router.js"></script>
                注意,引入必须,在首次js文件,不能引入脚本最后!不然容易导致文件错误!


`关于小鱼工具箱1.17:`
    1.新增文章发布模块
    2.优化了界面,优化了工具箱文章发布功能
        支持发布文章属于个人博客!目前支持两种方式
        1.通过本地的js文件进行发布(这种别人访问也可以看到)
        2.就是通过新建文章,如果你要是懒得话,通过这种方式也是可以发布文章,但是这种属于个人博客!
    3.自动化分区支持功能模块
        1.MD5加密,Base64编码/解码 JSON格式转换 IP地址合法性查询 代码一键生成 AST解混淆(待完善)
    4.网络安全模块:
        1.密码生成器 2.端口扫描器 
    5.http3/QUIC流量解析功能正在完善,后续版本会进行更加完善化(仅供模拟装逼,真正解析,还需要引入第三方库,后续会优化!)
    6.另外本地支持开启路由保护,但并非所有路由都支持路由保护,后续在新的版本会进行优化!
    7.支持三端响应式布局
    8.支持多端多浏览器兼容
    9.支持IP检测,proxy代理检测,杜绝网站例如虚拟流量脚本,您可以关闭,默认开启!关闭去 root目录下/proxy.js注释代码!
    10.优化了部分垃圾代码,重复代码!减少代码复用
    11.持路由检测,默认是关闭的,如果你需要开启,你可以进行开启
    12.支持Debuger调试,默认开启,路径可在DES中注释关闭,上线建议开启,因为保护网站
    13.文中集成了分布式攻击以及CC脚本默认流量检测,可开启或者关闭,建议开启有利于网站防护!