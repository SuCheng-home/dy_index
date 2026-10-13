import fetch from '@/utils/fetch'
import {getFetchArgs} from '@/utils/fetch'

export function getSchoolReceiveEduBureauDocumentPageList(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/getSchoolReceiveEduBureauDocumentPageList',
        args,
        'POST'
    ));
}

export function getBureauDocEduInfoById(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/getBureauDocEduInfoById',
        args,
        'POST'
    ));
}
export function saveSchoolUserReadData(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/saveSchoolUserReadData',
        args,
        'POST'
    ));
}
export function saveBureauDocForwardUserReadData(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/saveBureauDocForwardUserReadData',
        args,
        'POST'
    ));
}
// 转发局发文至本校部门单位人员
export function forwardEduBureauDocToSelfSchool(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/forwardEduBureauDocToSelfSchool',
        args,
        'POST'
    ));
}
// 转发局发文至分校
export function forwardEduBureauDocToBranchSchool(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/forwardEduBureauDocToBranchSchool',
        args,
        'POST'
    ));
}
// 保存收文人回执信息
export function saveSchoolUserReceiptData(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/saveSchoolUserReceiptData',
        args,
        'POST'
    ));
}
// 保存转发人员回执数据
export function saveBureauDocForwardUserReceiptData(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/saveBureauDocForwardUserReceiptData',
        args,
        'POST'
    ));
}
// 查询转发阅读回执统计列表(分页)
export function getSchoolForwardReadReceiptDataPageList(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/getSchoolForwardReadReceiptDataPageList',
        args,
        'POST'
    ));
}
// 查询转发单位人员阅读回执统计列表（分页）
export function getForwardScopeUserReadReceiptDataPageList(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/getForwardScopeUserReadReceiptDataPageList',
        args,
        'POST'
    ));
}
// 查询用户的阅读回执信息(转发)
export function getUserDocReadReceiptInfo(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/getUserDocReadReceiptInfo',
        args,
        'POST'
    ));
}
// 查询学校收文人阅读回执信息（局发文）
export function getSchoolUserReadReceiptInfo(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/getSchoolUserReadReceiptInfo',
        args,
        'POST'
    ));
}
//
export function downloadSchoolUserReceiptFilesList(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/downloadSchoolUserReceiptFilesList',
        args,
        'POST'
    ));
}
export function downloadForwardScopeReceiptFilesList(args) {
    return fetch(getFetchArgs(
        'structure/bureauDocument/downloadForwardScopeReceiptFilesList',
        args,
        'POST'
    ));
}
