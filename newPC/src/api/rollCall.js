import fetch from '@/utils/fetch';
export function getCallName(date) {
    const params = new URLSearchParams();
    params.append('date', date);
    return fetch({
        url: 'structure/callName/getCallName',
        method: 'get',
        params
    });
}