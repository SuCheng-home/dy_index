switch (process.env.ENV_TAREGT) {   
    case 'dev_test':
        global.LoginPath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BasePath = 'https://api.weixiaojia.net/wxcepClient1/';
        global.BaseNewPath = 'https://www.weixiaojia.net/ucenter-web/';
        global.newcharge = 'https://pay.weixiaojia.net/';
        global.newcard = 'https://www.weixiaojia.net/card/';
        global.homeworkfetch = 'https://www.weixiaojia.net/module-web/';
        global.command = 'dev_mock';
        global.renlianPath = 'https://api.weixiaojia.net/';
        break;  
    case 'build_test':
        global.LoginPath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BasePath = 'https://api.weixiaojia.net/wxcepClient1/';
        global.BaseNewPath = 'https://www.weixiaojia.net/ucenter-web/';
        global.newcharge = 'https://pay.weixiaojia.net/';
        global.newcard = 'https://www.weixiaojia.net/card/';
        global.homeworkfetch = 'https://www.weixiaojia.net/module-web/';
        global.command = 'build_test';
        global.renlianPath = 'https://api.weixiaojia.net/';
        break;
    case 'production':
        global.LoginPath = 'https://www.zhxiaoyuan.cn/wxcepClient1/';
        global.BasePath = 'https://www.zhxiaoyuan.cn/wxcepClient1/';
        global.BaseNewPath = 'https://www.zhxiaoyuan.cn/ucenter-web/';
        global.newcharge = 'https://pay.zhxiaoyuan.cn/';
        global.newcard = 'https://www.zhxiaoyuan.cn/card/';
        global.homeworkfetch = 'https://www.zhxiaoyuan.cn/module-web/';
        global.command = 'production';
        global.renlianPath = 'https://www.zhxiaoyuan.cn/';
        break;
}
