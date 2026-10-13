import fetch from '@/utils/fetch';

/**
 * 新增修改考勤设置
 * */
export function addAndUpdateCheckWorkInit(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/checkWork/addAndUpdateCheckWorkInit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 查询考勤设置
 * */
export function getCheckWorkInitBySchoolId() {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/checkWork/getCheckWorkInitBySchoolId',
        method: 'POST',
        params
    });
}

/**
 * 删除考勤设置
 * */
export function delCheckWorkInit() {
    let params = new URLSearchParams();

    return fetch({
        url: 'structure/checkWork/delCheckWorkInit',
        method: 'GET',
        params
    });
}
