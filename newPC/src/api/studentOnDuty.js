import fetch from '@/utils/fetch';

// 设置详情
export function getBySchoolId() {

    return fetch({
        url: '/structure/dutyStudentSet/getBySchoolId',
        method: 'GET'
    });
}

// 新增or修改
export function insertOrUpdate(query) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: '/structure/dutyStudentSet/insertOrUpdate',
        method: 'POST',
        data: JSON.stringify(query)
    });
}

