import fetch from '@/utils/fetch'
import { systemFetch } from '@/utils/fetch'
/**
 * 查询退费登记列表（分页）
 * */
export function getSchoolRefundRegisterPageList(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('state', args.state);
	params.append('stuName', args.stuName);
	params.append('isRefund', args.isRefund);

	return fetch({
		url: 'structure/refundRegister/getSchoolRefundRegisterPageList',
		method: 'post',
		data: params
	})
}

/**
 * 新增退费登记
 * */
export function addRefundRegister(args) {
	let params = new URLSearchParams();
	params.append('accountName', args.accountName || '');
	params.append('accountCardNo', args.accountCardNo || '');
	params.append('className', args.className || '');
	params.append('mobile', args.mobile);
	params.append('rechargeNo', args.rechargeNo);
	params.append('state', args.state);
	params.append('stuName', args.stuName);

	return fetch({
		url: 'structure/refundRegister/addRefundRegister',
		method: 'post',
		data: params
	})
}

/**
 * 编辑退费登记
 * */
export function editRefundRegister(args) {
	let params = new URLSearchParams();
	params.append('accountName', args.accountName || '');
	params.append('accountCardNo', args.accountCardNo || '');
	params.append('className', args.className || '');
	params.append('id', args.id);
	params.append('mobile', args.mobile || '');
	params.append('rechargeNo', args.rechargeNo);
	params.append('state', args.state);
	params.append('stuName', args.stuName);

	return fetch({
		url: 'structure/refundRegister/editRefundRegister',
		method: 'post',
		data: params
	})
}

/**
 * 根据ID删除退费登记信息
 * */
export function delRefundRegisterById(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);

	return fetch({
		url: 'structure/refundRegister/delRefundRegisterById',
		method: 'post',
		data: params
	})
}

/**
 * 根据ID标记已退费
 * */
export function refundSign(args) {
	let params = new URLSearchParams();
	params.append('ids', args.ids);
	params.append('isRefund', args.isRefund || 2);

	return fetch({
		url: 'structure/refundRegister/refundSign',
		method: 'post',
		data: params
	})
}

/**
 * 根据ID查询退费登记信息
 * */
export function getRefundRegisterInfoById(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);

	return fetch({
		url: 'structure/refundRegister/getRefundRegisterInfoById',
		method: 'post',
		data: params
	})
}
/**
 * 新增退费登记2(某个学校单独需求)
 * */
export function addRefundRegister2(args) {
	let params = new URLSearchParams();
	params.append('accountBankCode', args.accountBankCode || '');
	params.append('accountBankName', args.accountBankName || '');
	params.append('accountCardNo', args.accountCardNo);
	params.append('mobile', args.mobile);
	params.append('accountName', args.accountName);
	params.append('rechargeNo', args.rechargeNo);
	params.append('stuName', args.stuName);
	params.append('state', args.state);
	params.append('enrollType', args.enrollType);
	params.append('refundMoney', args.refundMoney);
	params.append('idCard', args.idCard);
	return fetch({
		url: 'structure/refundRegisterTwo/addRefundRegister',
		method: 'post',
		data: params
	})
}
/**
 * 新增退费登记2--查询退费登记信息(某个学校单独需求)
 * */
export function getRefundRegisterInfo(args) {
	let params = new URLSearchParams();
	params.append('rechargeNo', args.rechargeNo);
	params.append('stuName', args.stuName);
	params.append('schoolId', args.schoolId);
	params.append('idCard', args.idCard);
	return fetch({
		url: 'common/refundRegisterTwo/getRefundRegisterInfo',
		method: 'post',
		data: params
	})
}
/**
 * 编辑退费登记2(某个学校单独需求)
 * */
export function submitRefundRegisterInfo(args) {
	let params = new URLSearchParams();
	params.append('accountBankCode', args.accountBankCode);
	params.append('accountBankName', args.accountBankName);
	params.append('accountCardNo', args.accountCardNo);
	params.append('mobile', args.mobile);
	params.append('accountName', args.accountName);
	params.append('rechargeNo', args.rechargeNo);
	params.append('stuName', args.stuName);
	params.append('state', args.state);
	params.append('schoolId', args.schoolId);
	params.append('enrollType', args.enrollType);
	params.append('refundMoney', args.refundMoney);
	params.append('id', args.id);
	params.append('idCard', args.idCard);
	return fetch({
		url: 'common/refundRegisterTwo/submitRefundRegisterInfo',
		method: 'post',
		data: params
	})
}
/**
 * 查询退费登记列表2（分页）
 * */
export function getSchoolRefundRegisterPageList2(args) {
	let params = new URLSearchParams();
	params.append('pageNo', args.pageNo);
	params.append('pageSize', args.pageSize);
	params.append('state', args.state);
	params.append('stuName', args.stuName);
	params.append('isRefund', args.isRefund);

	return fetch({
		url: 'structure/refundRegisterTwo/getSchoolRefundRegisterPageList',
		method: 'post',
		data: params
	})
}
/**
 * 根据ID删除退费登记信息2
 * */
export function delRefundRegisterById2(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);

	return fetch({
		url: 'structure/refundRegisterTwo/delRefundRegisterById',
		method: 'post',
		data: params
	})
}
/**
 * 根据ID查询退费登记信息2
 * */
export function getRefundRegisterInfoById2(args) {
	let params = new URLSearchParams();
	params.append('id', args.id);

	return fetch({
		url: 'structure/refundRegisterTwo/getRefundRegisterInfoById',
		method: 'post',
		data: params
	})
}
/**
 * 编辑退费登记(鉴权)
 * */
export function editRefundRegister2(args) {
	let params = new URLSearchParams();
	params.append('accountBankCode', args.accountBankCode || '');
	params.append('accountBankName', args.accountBankName || '');
	params.append('accountName', args.accountName || '');
	params.append('accountCardNo', args.accountCardNo || '');
	params.append('id', args.id);
	params.append('mobile', args.mobile || '');
	params.append('rechargeNo', args.rechargeNo);
	params.append('state', args.state);
	params.append('stuName', args.stuName);
	params.append('enrollType', args.enrollType);
	params.append('refundMoney', args.refundMoney);
	params.append('idCard', args.idCard);
	return fetch({
		url: 'structure/refundRegisterTwo/editRefundRegister',
		method: 'post',
		data: params
	})
}
/**
 * 根据ID标记已退费
 * */
export function refundSign2(args) {
	let params = new URLSearchParams();
	params.append('ids', args.ids);
	params.append('isRefund', args.isRefund || 2);

	return fetch({
		url: 'structure/refundRegisterTwo/refundSign',
		method: 'post',
		data: params
	})
}
