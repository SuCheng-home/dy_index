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
 * 增加不就餐人员
 * @param {Object} params
 * @returns
 */
export function addNoRepastUser(params) {
    return fetch({
        url: 'structure/repastManagement/addNoRepastUser',
        method: 'post',
        data: formatParams(params)
    })
}
/**
 *  查询不就餐人员
 * @param {Object} params
 * @returns
 */
export function queryNoRepastUser(params) {
    return fetch({
        url: 'structure/repastManagement/queryNoRepastUser',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 *  移除单个不就餐人员
 * @param {Object} params
 * @returns
 */
export function deleteRepastUserByIds(params) {
    return fetch({
        url: 'structure/repastManagement/deleteRepastUserByIds',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 *  除就餐教师全设为非就餐
 * @param {Object} params
 * @returns
 */
export function setTeacherToNoRepastUser(params) {
    return fetch({
        url: 'structure/repastManagement/setTeacherToNoRepastUser',
        method: 'get'
        // params: formatParams(params)
    })
}
/**
 * 增加就餐点
 * @param {Object} params
 * @returns
 */
export function createRestaurant(params) {
    return fetch({
        url: 'structure/repastManagement/createRestaurant',
        method: 'post',
        data: formatParams(params)
    })
}
/**
 * 更具学校id获取就餐地点
 * @param {Object} args
 * @returns
 */
export function queryRestaurantBySchoolId(args) {
    let params = new URLSearchParams()
    params.append('pageSize', args.pageSize)
    params.append('pageNo', args.pageNo)
    // if (args.searchName) {
    // 	params.append('searchName', args.searchName)
    // }
    params.append('searchName', args.searchName)
    return fetch({
        url: 'structure/repastManagement/queryRestaurantBySchoolId',
        method: 'get',
        params
    })
}
/**
 * 删除就餐地点
 * @param {Object} args
 * @returns
 */
export function deleteRestaurantByIds(args) {
    let params = new URLSearchParams()
    params.append('restaurantIds', args.restaurantIds)
    return fetch({
        url: 'structure/repastManagement/deleteRestaurantByIds',
        method: 'get',
        params
    })
}
/**
 * 初始化停伙日期
 * @param  noParam
 * @returns
 */
export function initFireManage() {
    return fetch({
        url: 'structure/repastManagement/initFireManage',
        method: 'get'
    })
}
/**
 * 复制上学期停伙设置
 * @param  noParam
 * @returns
 */
export function updateStuLearNumInfoList() {
    return fetch({
        url: 'structure/repastManagement/updateStuLearNumInfoList',
        method: 'get'
    })
}
export function copyTermRepastUser() {
    return fetch({
        url: 'structure/repastManagement/copyTermRepastUser',
        method: 'get'
    })
}

export function queryClassListBySchoolId() {
    return fetch({
        url: 'structure/repastManagement/queryClassListBySchoolId',
        method: 'get'
    })
}

/**
 * 根据餐厅id查详情
 * @param {*} id
 * @returns
 */
export function getRestaurantDetailsById(id) {
    let params = new URLSearchParams()
    params.append('restaurantId', id)
    return fetch({
        url: 'structure/repastManagement/getRestaurantDetailsById',
        method: 'get',
        params
    })
}
/**
 * 编辑餐厅
 * @param {Object} params
 * @returns
 */
export function updateRestaurant(params) {
    return fetch({
        url: 'structure/repastManagement/updateRestaurant',
        method: 'post',
        data: formatParams(params)
    })
}
/**
 * 根据餐厅id获取就餐人列表
 * @param {Object} params
 * @returns
 */
export function queryRepastUserByRestaurantId(params) {
    return fetch({
        url: 'structure/repastManagement/queryRepastUserByRestaurantId',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 修改就餐人就餐时间
 * @param {Object} params
 * @returns
 */
export function updateRepastDate(params) {
    return fetch({
        url: 'structure/repastManagement/updateRepastDate',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 批量修改就餐人就餐时间
 * @param {Object} params
 * @returns
 */
export function batchUpdateRepastDate(params) {
    return fetch({
        url: 'structure/repastManagement/batchUpdateRepastDate',
        method: 'get',
        params: formatParams(params)
    })
}
/**
 * 就餐地添加就餐人
 * @param {Object} params
 * @returns
 */
export function addRepastUser(params) {
    return fetch({
        url: 'structure/repastManagement/addRepastUser',
        method: 'post',
        data: formatParams(params)
    })
}
/**
 * 获取教师餐厅二维码
 * @param {Object} params
 * @returns
 */
export function getRestaurantQrCodeUrl(params) {
    return fetch({
        url: 'structure/repastManagement/getRestaurantQrCodeUrl',
        method: 'get',
        params: formatParams(params)
    })
}
// 管理员管理停伙
export function insertFireManageTw(args) {
    let params = new URLSearchParams();
    params.append('fireDate', args.fireDate);
    params.append('fireType', args.fireType);
    if (args.gradeId != 0) {
        params.append('gradeId', args.gradeId);
        params.append('gradeName', args.gradeName);
    }
    params.append('manageDateListStr', args.manageDateListStr);

    return fetch({
        url: 'structure/repastManagement/insertFireManageTw',
        method: 'get',
        params
    });
}
// 根据时间和停伙类型获取一个月的可停伙时间
export function getMonthDateTw(args) {
    let params = new URLSearchParams();
    params.append('date', args.date);
    params.append('fireType', args.fireType);
    params.append('isManage', args.isManage);
    if (args.fireType == 1) {
        params.append('gradeId', 0);
    } else {
        params.append('gradeId', args.gradeId);
    }


    return fetch({
        url: 'structure/repastManagement/getMonthDateTw',
        method: 'get',
        params
    });
}

// 批量取消停伙 2024-05-28
export function initFireManageByGroup(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/repastManagement/initFireManageByGroup',
        method: 'POST',
        data: JSON.stringify(args)
    })
}