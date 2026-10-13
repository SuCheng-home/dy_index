import fetch from '@/utils/fetch';

export function getGateInfoCountByDate(createDate, schoolId) {
    let params = new URLSearchParams();
    params.append('createDate', createDate);
    params.append('schoolId', schoolId);
    return fetch({
        url: 'common/gateInfo/getGateInfoCountByDate',
        method: 'get',
        params
    });
}