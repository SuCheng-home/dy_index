switch (process.env.ENV_TAREGT) {  
    case 'dev_test':
        global.LoginPath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BasePath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BaseNewPath = 'https://www.weixiaojia.net/ucenter-web/';
        global.command = 'dev_mock';
        break;   
    case 'build_test':
        global.LoginPath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BasePath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BaseNewPath = 'https://www.weixiaojia.net/ucenter-web/';
        global.command = 'build_test';
        break;
    case 'production':
        global.LoginPath = 'https://www.zhxiaoyuan.cn/wxcepClient1/';
        global.BasePath = 'https://www.zhxiaoyuan.cn/wxcepClient1/';
        global.BaseNewPath = 'https://www.zhxiaoyuan.cn/ucenter-web/';
        global.command = 'production';
        break;
}
