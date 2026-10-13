import fetch from '@/utils/fetch'
import {
    systemFetch
} from '@/utils/fetch'
// 遍历处理参数方法
function formatParams(args) {
    let params = new URLSearchParams()
    Object.keys(args).forEach(v => {
        params.append(v, args[v])
    })
    return params
}
/**
 * 查询学校所有的部门列表
 * @param {Object} params
 * @returns
 */
export function queryDepartByTypes(params) {
    return systemFetch({
        url: 'api/depart/queryDepartByTypes',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 基础统计列表
 * @param {Object} params
 * @returns
 */
export function getBaseStatistics(params) {
    return fetch({
        url: 'structure/repastManagement/statistics',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 更具类型获得就餐地点
 * @param {Object} params
 * @returns
 */
export function getRestaurantListBySchoolIdAndRestaurantType(params) {
    return fetch({
        url: 'structure/repastManagement/getRestaurantListBySchoolIdAndRestaurantType',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 获取学校的所有学期列表
 *
 * @returns
 */
export function getSchoolTimeAllList() {
    return fetch({
        url: 'structure/schoolTime/getSchoolTimeAllList',
        method: 'get'
    })
}
/**
 * 取消（删除）停伙记录
 * @param {Object} params
 * @returns
 */
export function cancelFireById(params) {
    return fetch({
        url: 'structure/repastManagement/cancelFireById',
        method: 'get',
        params: formatParams(params)
    })
}
export function cancelFireByIds(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/repastManagement/cancelFireByIds',
        method: 'POST',
        data: JSON.stringify(args)
    })
}
/**
 * 统计报表
 * @param {Object} params
 * @returns
 */
export function statisticsForm(params) {
    return fetch({
        url: 'structure/repastManagement/statisticsForm',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 加餐上报统计
 * @param {Object} params
 * @returns
 */
export function reportAddAnalysis(params) {
    return fetch({
        url: 'structure/report/reportAddAnalysis',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 缺餐上报统计
 * @param {Object} params
 * @returns
 */
export function reportMissAnalysis(params) {
    return fetch({
        url: 'structure/report/reportMissAnalysis',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 获取缺餐停伙次数统计
 * @param {Object} params
 * @returns
 */
export function statisticsUserFire(params) {
    return fetch({
        url: 'structure/repastManagement/statisticsUserFire',
        method: 'get',
        params: formatParams(params)
    })
}
