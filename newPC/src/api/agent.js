import {
    systemFetch
} from '@/utils/fetch';
export function getBotToken(params) {
    return systemFetch({
        url: 'ai/getBotToken',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}