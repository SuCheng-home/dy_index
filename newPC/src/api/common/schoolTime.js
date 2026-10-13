import fetch from '@/utils/fetch';


// 当前学期
export function getCurrentSchoolTimeBySchoolId() {

    return fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'GET',
    });
}

// 学年列表
export function getSchoolYear() {
    return fetch({
        url: 'structure/schoolTime/getSchoolYear',
        method: 'GET',
    });
}
