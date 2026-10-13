import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

export const getSchoolWebSearch = (params) => {
    //用于搜索的接口，只有模板二有
    return fetch({
        url: `common/schoolWebTwo/getSchoolWebModuleMessageList`,
        method: 'GET',
        params: filterURLSearchParams(params)
    })
}

//根据消息id查询模块消息信息
export const getSchoolWebModuleMessageById = (params) => {
    return fetch({
        url: `common/schoolWebTwo/getSchoolWebModuleMessageById`,
        method: 'GET',
        params: filterURLSearchParams(params)
    })
}

/*模板二校长信箱*/
export const addSchoolWebLetterBox = (data) => {
    //用于搜索的接口，只有模板二有
    return fetch({
        url: `common/schoolWebTwo/addSchoolWebLetterBox`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify(data)
    })
}