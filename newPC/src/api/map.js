import fetch from '@/utils/fetch';
//新增修改地图设置
export function addUpdateSchoolMapInit(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/schoolMap/addUpdateSchoolMapInit',
        method: 'post',
        data: JSON.stringify(args)
    });
}

export function getSchoolMapInit() {
    return fetch({
        url: 'structure/schoolMap/getSchoolMapInit',
        method: 'get'
    });
}