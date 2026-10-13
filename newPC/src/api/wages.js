import fetch from '@/utils/fetch';
//分页查询工资单批次
export function queryPayrollBatch(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'structure/payroll/queryPayrollBatch',
        method: 'GET',
        params
    });
}
//删除工资单
export function deletePayroll(payrollId) {
    let params = new URLSearchParams();
    params.append('payrollId', payrollId);
    return fetch({
        url: 'structure/payroll/deletePayroll',
        method: 'GET',
        params
    });
}
//删除工资单类型
export function deletePayrollType(payrollTypeId) {
    let params = new URLSearchParams();
    params.append('payrollTypeId', payrollTypeId);
    return fetch({
        url: 'structure/payroll/deletePayrollType',
        method: 'GET',
        params
    });
}
//删除批次
export function deletePayrollBatch(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/payroll/deletePayrollBatch',
        method: 'GET',
        params
    });
}
//发布个人工资单
export function sendUserPayroll(payrollId) {
    let params = new URLSearchParams();
    params.append('payrollId', payrollId);
    return fetch({
        url: 'structure/payroll/sendUserPayroll',
        method: 'GET',
        params
    });
}
//发布批次工资单
export function sendBatchPayroll(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/payroll/sendBatchPayroll',
        method: 'GET',
        params
    });
}
//工资单列表
export function queryPayroll(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('batchId', args.batchId);
    return fetch({
        url: 'structure/payroll/queryPayroll',
        method: 'GET',
        params
    });
}
//工资单批次详情
export function payrollBatchDetails(batchId) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return fetch({
        url: 'structure/payroll/payrollBatchDetails',
        method: 'GET',
        params
    });
}
//工资单类型list
export function payrollTypeList() {
    return fetch({
        url: 'structure/payroll/payrollTypeList',
        method: 'GET'
    });
}
//工资单类型详情
export function payrollTypeDetails(payrollTypeId) {
    let params = new URLSearchParams();
    params.append('payrollTypeId', payrollTypeId);
    return fetch({
        url: 'structure/payroll/payrollTypeDetails',
        method: 'GET',
        params
    });
}
//工资单详情
export function payrollDetails(payrollId) {
    let params = new URLSearchParams();
    params.append('payrollId', payrollId);
    params.append('readStatus', '0');
    return fetch({
        url: 'structure/payroll/payrollDetails',
        method: 'GET',
        params
    });
}
//新增工资单类型
export function insertPayrollType(args) {
    let params = new URLSearchParams();
    params.append('orderNo', args.orderNo);
    params.append('payrollType', args.payrollType);
    params.append('payrollTypeDes', args.payrollTypeDes);
    return fetch({
        url: 'structure/payroll/insertPayrollType',
        method: 'POST',
        data:params
    });
}
//编辑工资单类型
export function updatePayrollType(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    params.append('orderNo', args.orderNo);
    params.append('payrollType', args.payrollType);
    params.append('payrollTypeDes', args.payrollTypeDes);
    return fetch({
        url: 'structure/payroll/updatePayrollType',
        method: 'POST',
        data:params
    });
}
//用户工资单数据
export function userPayrollList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'structure/payroll/userPayrollList',
        method: 'GET',
        params
    });
}
//编辑工资单
export function updatePayroll(id,dataStr) {
    let params = new URLSearchParams();
    params.append('id', id);
    params.append('dataStr',dataStr);
    return fetch({
        url: 'structure/payroll/updatePayroll',
        method: 'POST',
        data:params
    });
}
//补录工资单
export function payrollInsert(args) {
    let params = new URLSearchParams();
    params.append('batchId', args.batchId);
    params.append('dataStr', args.dataStr);
    params.append('monthDate', args.monthDate);
    params.append('payrollTitle', args.payrollTitle);
    params.append('payrollType', args.payrollType);
    params.append('payrollTypeId', args.payrollTypeId);
    params.append('userIdNumber', args.userIdNumber);
    params.append('userName', args.userName);
    return fetch({
        url: 'structure/payroll/payrollInsert',
        method: 'POST',
        data:params
    });
}