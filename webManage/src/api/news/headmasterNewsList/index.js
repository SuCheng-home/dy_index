import fetch from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

/*根据网站Id,标题查询校长信箱列表*/
export const getSchoolWebLetterBoxList = params =>
    fetch({
        url: 'structure/schoolWebTwo/getSchoolWebLetterBoxList',
        method: 'get',
        params: filterURLSearchParams(params)
    })

/*根据消息ids删除删除校长信箱*/
export const delSchoolWebLetterBoxByIds = params =>
    fetch({
        url: 'structure/schoolWebTwo/delSchoolWebLetterBoxByIds',
        method: 'get',
        params: filterURLSearchParams(params)
    })