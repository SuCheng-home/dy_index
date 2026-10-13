var coze = new CozeWebSDK.WebChatClient({
    config: {
        type: 'bot',
        bot_id: JSON.parse(localStorage.getItem("agentIndexobj")).bot_id,
        isIframe: false,
        botInfo: {
            parameters: {
               "source": "wxj",
               "schoolId": JSON.parse(localStorage.getItem("agentIndexobj")).schoolInfo.id,
                   "userToken": JSON.parse(localStorage.getItem("agentIndexobj")).token,
                   "userType": JSON.parse(localStorage.getItem("agentIndexobj")).userType,
                   "serverName": JSON.parse(localStorage.getItem("agentIndexobj")).serverName,
                   'xm': JSON.parse(localStorage.getItem("agentIndexobj")).userInfo.name
            },
        },
    },
    auth: {
        type: 'token',
        token: JSON.parse(localStorage.getItem("agentIndexobj")).newtoken,
            onRefreshToken: async () => JSON.parse(localStorage.getItem("agentIndexobj")).newtoken
            // onRefreshToken: async function () {
            //     const prefixPath = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/ucenter-web/' : 'https://www.weixiaojia.net/ucenter-web/'
            //     const newToken = await $.ajax({
            //         headers: {
            //             'content-type': 'application/json'
            //         },
            //         url: prefixPath + 'ai/getBotToken',
            //         type: 'POST',
            //         dataType: 'json',
            //         data: JSON.stringify({
            //             session_name: 'wxcep_' + JSON.parse(localStorage.getItem("agentIndexobj")).userInfo.id,
            //             platform: 'coze',
            //             schoolId: JSON.parse(localStorage.getItem("agentIndexobj")).schoolInfo.id
            //         }),
            //         success: function (data) {
            //             resolve(data.data.token);
            //             console.log(data, '专心致志')
            //         }
            //     });
            //     return newToken;
            // }
    },
    userInfo: { // 用户信息（对话框中显示）
        id: JSON.parse(localStorage.getItem("agentIndexobj")).token + '', // 用户业务 ID
        url: JSON.parse(localStorage.getItem("agentIndexobj")).userInfo.avatar, // 用户头像 URL（需公开可访问）
        nickname: JSON.parse(localStorage.getItem("agentIndexobj")).userInfo.name // 用户昵称
    },
    ui: {
        base: {
            icon: JSON.parse(localStorage.getItem("agentIndexobj")).icon,
            layout: 'pc',
            lang: 'zh-CN',
            zIndex: 1000
        },
        header: {
            isShow: true,
            isNeedClose: false,
        },
        asstBtn: {
            isNeed: false
        },
        footer: {
            isShow: true,
            expressionText: '所有内容均由AI生成仅供参考' // 底部文案
        },
        conversations: {
            isNeed: true,
        },
        chatBot: {
            title: JSON.parse(localStorage.getItem("agentIndexobj")).name,
            uploadable: true, // 禁用文件上传
            width: 1200,
        },
    },
});
coze.showChatBot()