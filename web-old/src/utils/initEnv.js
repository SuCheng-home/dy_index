switch (process.env.ENV_TAREGT) {
    case 'dev_mock':
        global.LoginPath = 'http://182.254.149.97:8088/wxcepClient1/';
        global.BasePath = 'http://192.168.6.110:8080/mockjsdata/19/';
        global.command = 'dev_mock';
        break;
    case 'dev_test':
        global.LoginPath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BasePath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BaseNewPath = 'https://www.weixiaojia.net/ucenter-web/';
        global.command = 'dev_mock';
        global.OldBasePath ='http://www.weixiaojia.net/wxcepClient/';
        break;
    case 'dev_build':
        global.LoginPath = 'http://115.159.34.36:8081/wxcepClient1/';
        global.BasePath = 'http://115.159.34.36:8081/wxcepClient1/';
        global.BaseNewPath = 'http://115.159.34.36:8081/ucenter-web/';
        global.command = 'dev_build';
        global.OldBasePath = 'http://www.weixiaojia.cn/wxcepClient/';
        break;
    case 'development':
        global.LoginPath = 'http://182.254.218.202:8088/wxcepClient1/';
        global.BasePath = 'http://182.254.218.202:8088/wxcepClient1/';
        global.BaseNewPath = 'http://182.254.218.202:8088/ucenter-web/';
        global.command = 'development';
        global.OldBasePath ='http://www.weixiaojia.net/wxcepClient/';
        break;
    case 'build_dev':
        global.LoginPath = 'http://dev1.weixiaojia.cn:8088/wxcepClient1/';
        global.BasePath = 'http://dev1.weixiaojia.cn:8088/wxcepClient1/';
        global.BaseNewPath = 'http://dev1.weixiaojia.cn:8088/ucenter-web/';
        global.OldBasePath ='http://www.weixiaojia.net/wxcepClient/';
        global.command = 'build_dev';
        break;
    case 'build_test':
        global.LoginPath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BasePath = 'https://www.weixiaojia.net/wxcepClient1/';
        global.BaseNewPath = 'https://www.weixiaojia.net/ucenter-web/';
        global.OldBasePath ='http://www.weixiaojia.net/wxcepClient/';
        global.command = 'build_test';
        break;
    case 'production':
        global.LoginPath = 'https://www.zhxiaoyuan.cn/wxcepClient1/';
        global.BasePath = 'https://www.zhxiaoyuan.cn/wxcepClient1/';
        global.BaseNewPath = 'https://www.zhxiaoyuan.cn/ucenter-web/';
        global.OldBasePath = 'http://www.weixiaojia.cn/wxcepClient/';
        global.command = 'production';
        break;
}
