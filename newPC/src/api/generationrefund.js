import {newcharge} from "@/utils/fetch";
import fetch from '@/utils/fetch';

//退款申请列表(分页)
export function queryPayRefundapplyList(args){
    const params=new URLSearchParams();
    params.append("pageNo",args.pageNo);
    params.append("pageSize",args.pageSize);
    return newcharge({
      url:'abcpay/refundapply/queryPayRefundapplyList',
      method:'get',
      params
    })
  }
//退款申请删除
export function deletePayRefundapply(id){
    const params=new URLSearchParams();
    params.append("id",id);
    return newcharge({
      url:'abcpay/refundapply/deletePayRefundapply',
      method:'get',
      params
    })
  }
//退费申请新增
 export function addPayRefundapply(args) {

    return newcharge({
        headers: {
            'content-type': 'application/json'
        },
        url: 'abcpay/refundapply/addPayRefundapply',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//单号
export function querymchIdList(type){
    const params=new URLSearchParams();
    params.append("type",type);
    return newcharge({
      url:'orderpay/chargeSetting/querymchIdList',
      method:'get',
      params
    })
  }
//根据学校id, 停伙类型和时间范围统计各用户停伙次数
export function fireAnalysisByFireTypeAndDateRange(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('fireType', args.fireType);
    params.append('searchName', args.searchName);
    params.append('startDate', args.startDate);
    return fetch({
        url: 'structure/fire/fireAnalysisByFireTypeAndDateRange',
        method: 'post',
        data: params
    });
  }
//退款申请详情
export function queryPayRefundapplyById(id){
  const params=new URLSearchParams();
  params.append("id",id);
  return newcharge({
    url:'abcpay/refundapply/queryPayRefundapplyById',
    method:'get',
    params
  })
}
//退款申请详情applyBatchSn
export function queryPayRefundapplyByApplyBatchSn(applyBatchSn){
  const params=new URLSearchParams();
  params.append("applyBatchSn",applyBatchSn);
  return newcharge({
    url:'abcpay/refundapply/queryPayRefundapplyByApplyBatchSn',
    method:'get',
    params
  })
}
  
//退款申请明细列表(分页)
export function queryPayRefundapplyDetailList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("applyBatchSn",args.applyBatchSn);
  params.append("status",args.status==0?"":args.status);
  return newcharge({
    url:'abcpay/refundapplyDetail/queryPayRefundapplyDetailList',
    method:'get',
    params
  })
}
//提交退款
export function addRefundSubmit(applyBatchSn,cmdBatchSn){
  const params=new URLSearchParams();
  params.append("applyBatchSn",applyBatchSn);
  params.append("cmdBatchSn",cmdBatchSn);
  return newcharge({
    url:'abcpay/refundapply/addRefundSubmit',
    method:'get',
    params
  })
}
//退款指令列表
export function queryRefundcmdList(merhId){
  const params=new URLSearchParams();
  params.append("merhId",merhId);
  return newcharge({
    url:'abcpay/payRefundcmd/queryRefundcmdList',
    method:'get',
    params
  })
}
//申请审核-审核人员
export function queryAuditorList(){
  return newcharge({
    url:'abcpay/audit/queryAuditorList',
    method:'get'
  })
}
//申请审核-添加审核人员
export function addAuditort(applyBatchSn,uid,uname){
  const params=new URLSearchParams();
  params.append("applyBatchSn",applyBatchSn);
  params.append("uid",uid);
  params.append("uname",uname);
  return newcharge({
    url:'abcpay/audit/addAuditor',
    method:'get',
    params
  })
}
//绑卡统计-用户列表
export function queryAccountUserList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("classId",args.classId?args.classId:"");
  params.append("gradeId",args.gradeId?args.gradeId:"");
  params.append("utype",args.utype);
  params.append("uname",args.uname);
  params.append("bind",args.bind==1);
  return newcharge({
    url:'abcpay/payAccount/queryAccountUserList',
    method:'get',
    params
  })
}
//绑卡统计未绑定提醒
export function updateRemindNonbind(utype){
  const params=new URLSearchParams();
  params.append("utype",utype);
  return newcharge({
    url:'abcpay/payAccount/updateRemindNonbind',
    method:'get',
    params
  })
}