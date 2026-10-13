import fetch from '@/utils/fetch'
import { systemFetch } from '@/utils/fetch'
// 遍历处理参数方法
function formatParams(args) {
	let params = new URLSearchParams()
	Object.keys(args).forEach(v => {
		params.append(v, args[v])
	})
	return params
}
/**
 * 增加用户信息
 * @param {Object} params
 * @returns
 */
export function addCarUser(params) {
	return fetch({
		url: 'structure/car/addCarUser',
		headers: {
			'content-type': 'application/json'
		},
		method: 'post',
		data: JSON.stringify(params)
	})
}
export function updateCarUser(params) {
    return fetch({
        url: 'structure/car/updateCarUser',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}
/**
 * 查询用户列表
 * @param {Object} params
 * @returns
 */
export function getCarUserListPage(params) {
	return fetch({
		url: 'structure/car/getCarUserListPage',
		method: 'post',
		params: formatParams(params)
	})
}
/**
 * 删除车牌用户信息
 * @param {Object} params
 * @returns
 */
export function delCarUser(params) {
	return fetch({
		url: 'structure/car/delCarUser',
		method: 'post',
		params: formatParams(params)
	})
}
/**
 * 查询车辆地点
 * @param {Object} params
 * @returns
 */
export function getCarPlaceList(params) {
	return fetch({
		url: 'structure/car/getCarPlaceList',
		method: 'get'
	})
}
/**
 * 新增车辆地点
 * @param {Object} params
 * @returns
 */
export function addCarPlace(params) {
	return fetch({
		url: 'structure/car/addCarPlace',
		headers: {
			'content-type': 'application/json'
		},
		method: 'post',
		data: JSON.stringify(params)
	})
}
/**
 * 删除车辆地点
 * @param {Object} params
 * @returns
 */
export function delCarPlace(params) {
	return fetch({
		url: 'structure/car/delCarPlace',
		method: 'get',
		params: formatParams(params)
	})
}
export function delCarUserByUserId(params) {
    return fetch({
        url: 'structure/car/delCarUserByUserId',
        method: 'get',
        params: formatParams(params)
    })
}
export function addUpdateCarUserList(params) {
    return fetch({
        url: 'structure/car/addUpdateCarUserList',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}