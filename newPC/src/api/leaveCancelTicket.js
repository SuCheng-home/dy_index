import fetch from '@/utils/fetch';

// 新增抵扣类型
export function addOvertimeDeductionType(args) {
    const params = new URLSearchParams();
    params.append('deductionName', args.deductionName);
    params.append('leaveCodes', args.leaveCodes);
    params.append('leaveNames', args.leaveNames);
    params.append('typeCode', args.typeCode);
    params.append('typeName', args.typeName);
    params.append('validityTime', args.validityTime);

    return fetch({
        url: 'structure/overTimeDeduction/addOvertimeDeductionType',
        method: 'POST',
        data: params
    });
}

// 编辑抵扣类型
export function editOvertimeDeductionType(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);
    params.append('deductionName', args.deductionName);
    params.append('leaveCodes', args.leaveCodes);
    params.append('leaveNames', args.leaveNames);
    params.append('typeCode', args.typeCode);
    params.append('typeName', args.typeName);
    params.append('validityTime', args.validityTime);

    return fetch({
        url: 'structure/overTimeDeduction/editOvertimeDeductionType',
        method: 'POST',
        data: params
    });
}
// 删除抵扣类型
export function deleteOvertimeDeductionTypeById(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/overTimeDeduction/deleteOvertimeDeductionTypeById',
        method: 'POST',
        data: params
    });
}
// 删除抵扣类型
export function getSchoolOvertimeDeductionTypeList(args) {
    const params = new URLSearchParams();
    params.append('deductionName', args.deductionName);

    return fetch({
        url: 'structure/overTimeDeduction/getSchoolOvertimeDeductionTypeList',
        method: 'POST',
        data: params
    });
}
// 查询抵扣类型详情
export function getOvertimeDeductionTypeInfoById(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/overTimeDeduction/getOvertimeDeductionTypeInfoById',
        method: 'POST',
        data:params
    });
}
// 查询抵扣类型详情
export function saveSchoolOvertimeDeductionRuleRemark(args) {
    const params = new URLSearchParams();
    params.append('remark', args.remark);

    return fetch({
        url: 'structure/overTimeDeduction/saveSchoolOvertimeDeductionRuleRemark',
        method: 'POST',
        data: params
    });
}
// 查询抵扣类型详情
export function getSchoolOvertimeDeductionRuleRemark(args) {
    const params = new URLSearchParams();

    return fetch({
        url: 'structure/overTimeDeduction/getSchoolOvertimeDeductionRuleRemark',
        method: 'POST',
        data: params
    });
}
export function sendDeductionToTeachers(args) {
    const params = new URLSearchParams();
    params.append('deductionsJson', args.deductionsJson);
    params.append('departsJson', args.departsJson);
    params.append('leaveCount', args.leaveCount);
    params.append('remark', args.remark);
    params.append('state', args.state);
    params.append('teacherJson', args.teacherJson);

    return fetch({
        url: 'structure/overTimeDeduction/sendDeductionToTeachers',
        method: 'POST',
        data: params
    });
}
export function addDeductionOntimeRule(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/overTimeDeduction/addDeductionOntimeRule',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

export function editDeductionOntimeRule(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/overTimeDeduction/editDeductionOntimeRule',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function getDeductionOntimeRuleInfoById(args) {
    const params = new URLSearchParams();
    params.append('ruleId', args.ruleId);

    return fetch({
        url: 'structure/overTimeDeduction/getDeductionOntimeRuleInfoById',
        method: 'POST',
        data: params
    });
}
export function getSchoolDeductionOntimeRuleList() {
    const params = new URLSearchParams();

    return fetch({
        url: 'structure/overTimeDeduction/getSchoolDeductionOntimeRuleList',
        method: 'POST',
        data: params
    });
}
export function deleteDeductionOntimeRule(args) {
    const params = new URLSearchParams();
    params.append('id', args.id);

    return fetch({
        url: 'structure/overTimeDeduction/deleteDeductionOntimeRule',
        method: 'POST',
        data: params
    });
}
export function getDeductionStatisticPageList(args) {
    const params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('teacherName', args.teacherName);
    params.append('monthStr', args.monthStr);

    return fetch({
        url: 'structure/overTimeDeduction/getDeductionStatisticPageList',
        method: 'POST',
        data: params
    });
}
export function getTeacherTypeDeductionStaticsList(args) {
    const params = new URLSearchParams();
    params.append('dataType', args.dataType);
    params.append('schoolTimeId', args.schoolTimeId);
    params.append('teacherId', args.teacherId);

    return fetch({
        url: 'structure/overTimeDeduction/getTeacherTypeDeductionStaticsList',
        method: 'POST',
        data: params
    });
}
