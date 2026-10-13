import fetch from '@/utils/fetch';

// 新增or修改
export function insertOrUpdate(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/birthdayWish/insertOrUpdate',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 查看详情
export function getBySchoolId() {

    return fetch({
        url: 'structure/birthdayWish/getBySchoolId',
        method: 'GET',
    });
}

