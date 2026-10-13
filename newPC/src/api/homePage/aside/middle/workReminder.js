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

// 获得个人日工作计划内容列表
export const getSelfDayPlanContentList = params =>
    fetch({
        url: 'structure/weekPlan/getSelfDayPlanContentList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据用户id，模块code,主题查询待办
export const getBackLogNotList = params =>
    fetch({
        url: 'structure/backLog/getBackLogNotList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据计划ID获得计划详细信息
export const getWorkPlanInfoById = data =>
    fetch({
        url: 'structure/weekPlan/getWorkPlanInfoById',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify(data)
    })

// 根据学校id查询模块列表
export const getBackLogModuleList = params =>
    fetch({
        url: 'structure/backLog/getBackLogModuleList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据用户id，模块code,主题查询已办
export const getBackLogYesList = params =>
    fetch({
        url: 'structure/backLog/getBackLogYesList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })