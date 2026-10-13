import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 天气
export const getWeather = data =>
    fetch({
        url: 'common/getWeather',
        method: 'POST',
        data: filterURLSearchParams(data)
    })

// 根据字典code获得字典数据
export const findDicsByCode = data =>
    fetch({
        url: 'common/sysDictionary/findDicsByCode',
        method: 'POST',
        data: filterURLSearchParams(data)
    })
export const getWeatherByCityNm = data =>
    fetch({
        url: 'common/getWeatherByCityNm',
        method: 'POST',
        data: filterURLSearchParams(data)
    })
