import fetch from '@/utils/fetch';
//新增修改晨检设置
export function addAndUpdateStuMoringCheckInit(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/stuMoringCheck/addAndUpdateStuMoringCheckInit',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//根据学校id查询晨检设置
export function getStuMoringCheckInit() {
    return fetch({
        url: 'structure/stuMoringCheck/getStuMoringCheckInit',
        method: 'get'
    });
}