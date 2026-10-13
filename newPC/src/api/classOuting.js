import fetch from '@/utils/fetch';
export function getClassOutSatticBySchTimeId(args) {
    const params = new URLSearchParams();
    params.append('schoolTimeId', args.schoolTimeId);
    return fetch({
        url: 'structure/classOut/getClassOutSatticBySchTimeId',
        method: 'GET',
        params
    });
}

export function getClassOutList(args) {
    const params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startDate', args.startDate);
    params.append('endDate', args.endDate);
    return fetch({
        url: 'structure/classOut/getClassOutList',
        method: 'GET',
        params
    });
}

export function getClassThList(args) {
    const params = new URLSearchParams();
    params.append('classId', args.classId);
    return fetch({
        url: 'structure/classOut/getClassThList',
        method: 'GET',
        params
    });
}

export function getClassOut(outId) {
    let params = new URLSearchParams();
    params.append('outId', outId);
    return fetch({
        url: 'structure/classOut/getClassOut',
        method: 'GET',
        params
    });
}

export function getClassStuList(classId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    return fetch({
        url: 'structure/classOut/getClassStuList',
        method: 'GET',
        params
    });
}

export function updateClassOutAll(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classOut/updateClassOutAll',
        method: 'POST',
        data: JSON.stringify(args)
    });
}