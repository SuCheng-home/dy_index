import fetch from '@/utils/fetch';
import {
    getAxiosService
} from '@/utils/fetch';
import {
    newcharge
} from "@/utils/fetch";
const longFetch = getAxiosService({
    timeout: 300000
});

/**
 *校园收费列表
 */
export function queryChargeNoticeList(query) {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeList?searchVal=' + query.searchVal + '&pageNo=' + query.pageNo + '&pageSize=' + query.pageSize + '&chargeType=' + query.chargeType,
        method: 'get',
    });
}
/**
 *校园收费删除
 */
//收费通知撤回
export function updateWithdraw(cid) {
    let params = new URLSearchParams();
    params.append('cid', cid);
    return fetch({
        url: 'chargeNoticeProduct/updateWithdraw',
        method: 'GET',
        params
    });
}
export function deleteChargeNotice(noticeId) {
    let params = new URLSearchParams();
    params.append("noticeId", noticeId);
    return fetch({
        url: 'chargeNotice/deleteChargeNotice',
        method: 'post',
        params
    });
}
/**
 *校园收费总览
 */
export function queryChargeNoticeStatic(chargeId) {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeStatic?chargeId=' + chargeId,
        method: 'get',
    });
}
/**
 *校园收费列表
 */
export function queryChargeNoticeDetailList(query) {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeDetailList?searchVal=' + query.searchVal + '&pageNo=' + query.pageNo + '&pageSize=' + query.pageSize + '&chargeId=' + query.chargeId + '&classId=' + query.classId + '&status=' + query.status,
        method: 'get',
    });
}
/**
 *校园收费线下补缴
 */
export function chargeNoticeOffLinePay(chargeId, studentId, status) {
    let params = new URLSearchParams();
    params.append("chargeId", chargeId);
    params.append("studentId", studentId);
    params.append("status", status);
    return fetch({
        url: 'chargeNotice/chargeNoticeOffLinePay',
        method: 'post',
        params
    });
}
/**
 *校园收费通知详情
 */
export function queryChargeNoticeDetail(noticeId) {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeDetail?noticeId=' + noticeId,
        method: 'get',
    });
}
/**
 *校园收费通知详情
 */
export function queryChargeNoticeRejectList(noticeId) {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeRejectList?noticeId=' + noticeId,
        method: 'get',
    });
}
/**
 *校园收费添加保存编辑
 */
export function saveChargeNotice(query) {
    let params = new URLSearchParams();
    params.append("chargeName", query.chargeName);
    params.append("content", query.content);
    params.append("deadlineTime", query.deadlineTime);
    params.append("examineUser", query.examineUser);
    params.append("id", query.id);
    params.append("inscription", query.inscription);
    params.append("membersInformation", query.membersInformations);
    params.append("money", query.money);
    params.append("payUserListName", query.payUserListName);
    params.append("payUserListUrl", query.payUserListUrl);
    params.append("payUserType", query.payUserType);
    params.append("type", query.type);
    params.append("typeId", query.typeId);
    params.append("typeName", query.typeName);
    params.append("chargeType", query.chargeType);
    params.append("teachers", query.teachers);
    return longFetch({
        url: 'chargeNotice/saveChargeNotice',
        method: 'post',
        data: params
    });
}
/**
 *校园收费设置
 */
export function querySchoolChargeDetail() {
    return fetch({
        url: 'schoolCharge/querySchoolChargeDetail',
        method: 'get',
    });
}
/**
 *校园收费保存建行设置
 */
export function saveSchoolChargeBank(query) {
    let params = new URLSearchParams();
    params.append("branchId", query.branchId);
    params.append("merchantId", query.merchantId);
    //    params.append("posId",query.posId);
    //    params.append("pub",query.pub);
    params.append("certPasswd", query.certPasswd);
    params.append("certPath", query.certPath);
    params.append("operPasswd", query.operPasswd);
    params.append("operId", query.operId);
    params.append("code", query.code);
    params.append("unionPayType", query.unionPayType);
    params.append("wxPayType", query.wxPayType);
    params.append("bankPayType", query.bankPayType);
    return fetch({
        url: 'schoolCharge/saveSchoolChargeBank',
        method: 'post',
        data: params
    });
}
/**
 *校园收费保存工行设置
 */
export function saveSchoolChargeICBC(query) {
    let params = new URLSearchParams();
    params.append("appId", query.myappId);
    params.append("code", query.code);
    params.append("merId", query.merId);
    params.append("EPAYPayType", query.EPAYPayType);
    params.append("wxPayType", query.mywxPayType);
    return fetch({
        url: 'schoolCharge/saveSchoolChargeIcbc',
        method: 'post',
        data: params
    });
}
/**
 *校园收费保存微信设置
 */
export function saveSchoolChargeWx(query) {
    let params = new URLSearchParams();
    params.append("appId", query.appId);
    params.append("key", query.key);
    params.append("mchId", query.mchId);
    return fetch({
        url: 'schoolCharge/saveSchoolChargeWx',
        method: 'post',
        data: params
    });
}
/**
 *校园收费查询收费类型(新增)
 */
export function queryChargeNoticeType() {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeType',
        method: 'get',
    });
}
export function queryChargeTypeList() {
    return newcharge({
        url: 'orderpay/chargeType/queryChargeTypeList',
        method: 'get',
    });
}
/**
 *校园收费退款(新增)
 */
export function updateRefund(noticeId, refundMoney, refundRemark, id) {
    return fetch({
        url: 'chargeNotice/updateRefund?noticeId=' + noticeId + '&refundMoney=' + refundMoney + '&refundRemark=' + refundRemark + '&id=' + id,
        method: 'get',
    });
}
/**
 *校园收费提醒未交费通知(新增)
 */
export function updateRemindUnPayed(noticeId) {
    return fetch({
        url: 'chargeNotice/updateRemindUnPayed?noticeId=' + noticeId,
        method: 'get',
    });
}
/**
 *班级
 */
export function queryChargeStaticGroupByClass(noticeId) {
    return fetch({
        url: 'chargeNotice/queryChargeStaticGroupByClass?noticeId=' + noticeId,
        method: 'get',
    });
}
/**
 *校园收费按班统计查询未缴费学生
 */
export function queryChargeNoticeDetailListByClass(chargeId, classId) {
    return fetch({
        url: 'chargeNotice/queryChargeNoticeDetailListByClass?chargeId=' + chargeId + '&classId=' + classId,
        method: 'get',
    });
}

/**
 *校园收费设置获取验证码
 */
export function queryVerificationCode() {
    return fetch({
        url: 'schoolCharge/queryVerificationCode',
        method: 'get',
    });
}
/**
 *校园收费设置添加收费关系
 */
export function addSchoolChargePos(query) {
    let params = new URLSearchParams();
    params.append("posId", query.posId);
    params.append("pub", query.pub);
    params.append("typeIds", query.typeIds);
    params.append("typeNames", query.typeNames);
    return fetch({
        url: 'schoolCharge/addSchoolChargePos',
        method: 'post',
        data: params
    });
}
/**
 *校园收费设置未设置收费类型
 */
export function querySchoolChargeTypeListNoSetting() {
    return fetch({
        url: 'schoolCharge/querySchoolChargeTypeListNoSetting',
        method: 'get',
    });
}
/**
 *校园收费设置关系编辑
 */
export function updateSchoolChargeRelation(query) {
    let params = new URLSearchParams();
    params.append("id", query.id);
    params.append("posId", query.posId);
    params.append("pub", query.pub);
    params.append("typeIds", query.typeIds);
    params.append("typeNames", query.typeNames);
    return fetch({
        url: 'schoolCharge/updateSchoolChargeRelation',
        method: 'post',
        data: params
    });
}
/**
 *校园收费收费关系列表
 */
export function querySchoolChargeRelationList() {
    return fetch({
        url: 'schoolCharge/querySchoolChargeRelationList',
        method: 'get',
    });
}
/**
 *校园收费关系详情
 */
export function querySchoolChargeRelationDetail(id) {
    return fetch({
        url: 'schoolCharge/querySchoolChargeRelationDetail?id=' + id,
        method: 'get',
    });
}
/**
 *校园收费关系删除
 */
export function deleteSchoolChargeRelation(ids) {
    return fetch({
        url: 'schoolCharge/deleteSchoolChargeRelation?id=' + ids,
        method: 'get',
    });
}
export function queryOrderTradeByOrderNo(orderNo) {
    return newcharge({
        url: 'orderpay/order/queryOrderTradeByOrderNo?orderNo=' + orderNo,
        method: 'get',
    });
}
export function refreshOrderbatch(cid) {
    return fetch({
        url: 'chargeNoticeProduct/refreshOrderbatch?cid=' + cid,
        method: 'get',
    });
}
export function updateCancelStatus(id) {
    return fetch({
        url: 'chargeNoticeProduct/updateCancelStatus?id=' + id,
        method: 'get',
    });
}
export function clearOrderNo(id) {
    return fetch({
        url: 'chargeNoticeProduct/clearOrderNo?id=' + id,
        method: 'get',
    });
}
/**
 *校园收费删除
 */
export function deleteChargeNoticeUser(cId, uId) {
    return fetch({
        url: 'chargeNoticeProduct/deleteChargeUserHard?id=' + uId,
        method: 'get',
    });
}
/**
 *退费明细列表
 */
export function queryRefundList(query) {
    let params = new URLSearchParams();
    params.append("cid", query.cid);
    params.append("pageNo", query.pageNo);
    params.append("pageSize", query.pageSize);
    params.append("studentName", query.studentName);
    params.append("status", query.status);
    return fetch({
        url: 'chargeNotice/queryRefundList',
        method: 'post',
        params
    });
}
/**
 *校园收费修改延期日期
 */
export function updateDeadlineTimeById(deadlineTime, noticeId) {
    return fetch({
        url: 'chargeNotice/updateDeadlineTimeById?deadlineTime=' + deadlineTime + '&noticeId=' + noticeId,
        method: 'get',
    });
}
/**
 *查询是否存在未截止的收费
 */
export function queryDeadlineTimeChargeNotice() {
    return fetch({
        url: 'chargeNotice/queryDeadlineTimeChargeNotice',
        method: 'get',
    });
}
//收费补发
export function updateChargeNoticeReissue(query) {
    let params = new URLSearchParams();
    params.append("deptids", query.deptids);
    params.append("noticeId", query.noticeId);
    params.append("uids", query.uids);
    return fetch({
        url: 'chargeNoticeProduct/updateChargeNoticeReissue',
        method: 'post',
        data: params
    });
}
export function updateChargeNoticeUserFee(query) {
    let params = new URLSearchParams();
    params.append("cid", query.cid);
    params.append("fee", query.fee);
    params.append("uid", query.uid);
    return fetch({
        url: 'chargeNoticeProduct/updateChargeNoticeUserFee',
        method: 'post',
        data: params
    });
}
/**
 *查询农行商户非农行户
 */
export function queryAbcMerchNonNonAbcAccout(noticeId) {
    return fetch({
        url: 'chargeNoticeProduct/queryAbcMerchNonNonAbcAccout?noticeId=' + noticeId,
        method: 'get',
    });
}
/**
 * 补发--新增补发记录
 * */
export function addReissue(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'chargeNoticeProduct/addReissue',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
/**
 * 补发--新增补发记录
 * */
export function updateBatchRefund(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'chargeNoticeProduct/updateBatchRefund',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//补发--列表
export function queryReissueList(args) {
    let params = new URLSearchParams();
    params.append('cid', args.cid);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'chargeNoticeReissue/queryReissueList',
        method: 'get',
        params
    });
}
//退款--列表
export function queryRefundsourceList(args) {
    let params = new URLSearchParams();
    params.append('cid', args.cid);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'chargeNoticeRefundsource/queryRefundsourceList',
        method: 'get',
        params
    });
}
//补发--详情
export function queryReissueDetail(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'chargeNoticeReissue/queryReissueDetail',
        method: 'get',
        params
    });
}
//退款--明细列表
export function queryRefundDetailList(args) {
    let params = new URLSearchParams();
    params.append('batchSn', args.batchSn);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'chargeNoticeRefundsource/queryRefundDetailList',
        method: 'get',
        params
    });
}
//退款--发布
export function refundPublish(batchSn) {
    let params = new URLSearchParams();
    params.append('batchSn', batchSn);
    return fetch({
        url: 'chargeNotice/refundPublish',
        method: 'get',
        params
    });
}
//退款--发布
export function deleteRefundsourceByBatchSn(batchSn) {
    let params = new URLSearchParams();
    params.append('batchSn', batchSn);
    return fetch({
        url: 'chargeNoticeRefundsource/deleteRefundsourceByBatchSn',
        method: 'get',
        params
    });
}
//退款统计
export function queryRefundCount(cid) {
    return fetch({
        url: 'chargeNoticeProduct/queryRefundCount?cid=' + cid,
        method: 'get',
    });
}
export function queryAbcsubmerh(noticeId) {
    return fetch({
        url: 'chargeNoticeProduct/queryAbcsubmerh?noticeId=' + noticeId,
        method: 'get',
    });
}
export function updateChargenoticeWithd(cid) {
    return fetch({
        url: 'chargeNoticeProduct/updateChargenoticeWithd?cid=' + cid,
        method: 'get',
    });
}

/**
 *清分列表
 */
export function queryChargenoticeWithdList(query) {
    let params = new URLSearchParams();
    params.append("cid", query.cid);
    params.append("pageNo", query.pageNo);
    params.append("pageSize", query.pageSize);
    return fetch({
        url: 'chargeNoticeProduct/queryChargenoticeWithdList',
        method: 'get',
        params
    });
}
export function queryChargenoticeWithdStatic(cid) {
    let params = new URLSearchParams();
    params.append("cid", cid);
    return fetch({
        url: 'chargeNoticeProduct/queryChargenoticeWithdStatic',
        method: 'get',
        params
    });
}
export function updateChargenoticeWithdnew(cid, fee, remark) {
    let params = new URLSearchParams();
    params.append("cid", cid);
    params.append("fee", fee);
    params.append("remark", remark);
    return fetch({
        url: 'chargeNoticeProduct/updateChargenoticeWithd',
        method: 'get',
        params
    });
}

//从订单列表提交审核
export function sendToCheck(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'chargeNotice/sendToCheck',
        method: 'get',
        params
    });
}


export function batchFeedelete(id) {
    return fetch({
        url: 'njFinace/batchFee/delete?id=' + id,
        method: 'get',
    });
}
export function batchFeesubmit(id) {
    return fetch({
        url: 'njFinace/batchFee/submit?id=' + id,
        method: 'get',
    });
}


export function batchFeelist(query) {
    let params = new URLSearchParams();
    params.append("serchval", query.serchval);
    params.append("pageNo", query.pageNo);
    params.append("pageSize", query.pageSize);
    return fetch({
        url: 'njFinace/batchFee/list',
        method: 'get',
        params
    });
}
export function finaceOrderlist(query) {
    let params = new URLSearchParams();
    params.append("serchval", query.serchval);
    params.append("pid", query.pid);
    params.append("pageNo", query.pageNo);
    params.append("pageSize", query.pageSize);
    return fetch({
        url: 'njFinace/finaceOrder/list',
        method: 'get',
        params
    });
}

export function checkExcel(fileUrl) {
    let params = new URLSearchParams();
    params.append('fileUrl', fileUrl);
    return fetch({
        url: 'njFinace/finaceOrder/checkExcel',
        method: 'post',
        data: params
    });
}

export function batchFeesave(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'njFinace/batchFee/save',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
export function sendNotify(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'njFinace/batchFee/sendNotify',
        method: 'post',
        data: params
    });
}
export function finaceOrderdelete(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: '/njFinace/finaceOrder/deleteOrder',
        method: 'post',
        data: params
    });
}
export function updateStatus(id, status) {
    let params = new URLSearchParams();
    params.append('id', id);
    params.append('status', status);
    return fetch({
        url: 'njFinace/finaceOrder/updateStatus',
        method: 'post',
        data: params
    });
}
export function getById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'njFinace/finaceOrder/getById',
        method: 'post',
        data: params
    });
}

export function finaceOrderupdate(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'njFinace/finaceOrder/update',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
