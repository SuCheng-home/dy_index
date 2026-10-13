
import {newcharge} from "@/utils/fetch";
import fetch from '@/utils/fetch';
//查询商户设置
export function queryChargesettingList() {
    return newcharge({
        url: 'orderpay/chargeSetting/queryChargesettingList',
        method: 'get'
    });
}
//删除商户设置
export function deleteChargesetting(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/deleteChargesetting?id='+id,
        method: 'get'
    });
}
//设为默认商户
export function updateChargesettingDefault(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/updateChargesettingDefault?id='+id,
        method: 'get'
    });
}
//新增微信商户
export function insertWxSetting(args){
    const params=new URLSearchParams();
    params.append("key",args.key);
    params.append("mchId",args.mchId);
    return newcharge({
      url:'orderpay/chargeSetting/insertWxSetting',
      method:'post',
      data:params
    })
  }
  //编辑微信商户
export function updateWxSetting(args){
    const params=new URLSearchParams();
    params.append("key",args.key);
    params.append("mchId",args.mchId);
    params.append("id",args.id);
    return newcharge({
      url:'orderpay/chargeSetting/updateWxSetting',
      method:'post',
      data:params
    })
  }
  //查询微信商户
export function queryWxSetting(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/queryWxSetting?id='+id,
        method: 'get'
    });
}
//新增建融慧学
export function insertCcbCampusSetting(args){
    const params=new URLSearchParams();
    params.append("ccbSchoolId",args.ccbSchoolId);
    params.append("md5Key",args.md5Key);
    params.append("projectId",args.projectId);
    params.append("sm4Key",args.sm4Key);
    params.append("smsCode",args.smsCode);
    return newcharge({
      url:'orderpay/chargeSetting/insertCcbCampusSetting',
      method:'post',
      data:params
    })
  }
  //编辑建融慧学
export function updateCcbCampusSetting(args){
    const params=new URLSearchParams();
    params.append("ccbSchoolId",args.ccbSchoolId);
    params.append("md5Key",args.md5Key);
    params.append("projectId",args.projectId);
    params.append("sm4Key",args.sm4Key);
    params.append("id",args.id);
    params.append("smsCode",args.smsCode);
    return newcharge({
      url:'orderpay/chargeSetting/updateCcbCampusSetting',
      method:'post',
      data:params
    })
  }
  //查询建融慧学
export function queryCcbCampusSetting(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/queryCcbCampusSetting?id='+id,
        method: 'get'
    });
}
export function deleteIcbcSetting(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/deleteIcbcSetting?id=' + id,
        method: 'get'
    });
}
//新增工行商户
export function insertIcbcSetting(args){
  const params=new URLSearchParams();
  params.append("appId",args.appId);
  params.append("epayPayType",args.epayPayType);
  params.append("merId",args.merId);
  params.append("smsCode",args.smsCode);
  params.append("wxPayType",args.wxPayType);
  params.append("typeId", args.typeId);
  params.append("typeName", args.typeName);
  return newcharge({
    url:'orderpay/chargeSetting/insertIcbcSetting',
    method:'post',
    data:params
  })
}
//查询商户设置
export function queryIcbcSettingList() {
    return newcharge({
        url: 'orderpay/chargeSetting/queryIcbcSettingList',
        method: 'get'
    });
}
//编辑工行商户
export function updateIcbcSetting(args){
  const params=new URLSearchParams();
  params.append("appId",args.appId);
  params.append("epayPayType",args.epayPayType);
  params.append("merId",args.merId);
  params.append("smsCode",args.smsCode);
  params.append("wxPayType",args.wxPayType);
  params.append("id",args.id);
   params.append("typeId", args.typeId);
   params.append("typeName", args.typeName);
  return newcharge({
    url:'orderpay/chargeSetting/updateIcbcSetting',
    method:'post',
    data:params
  })
}
  //查询工行商户
  export function queryIcbcSetting(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/queryIcbcSetting?id='+id,
        method: 'get'
    });
}
 //发送验证码
 export function queryVerificationCode(smsCodeKey) {
  return newcharge({
      url: 'orderpay/chargeSetting/queryVerificationCode?smsCodeKey='+smsCodeKey,
      method: 'get'
  });
}

//新增建行商户
export function insertCcbSetting(args){
  const params=new URLSearchParams();
  params.append("branchId",args.branchId);
  params.append("certPasswd",args.certPasswd);
  params.append("certPath",args.certPath);
  params.append("merchantId",args.merchantId);
  params.append("operId",args.operId);
  params.append("wxPayType",args.wxPayType);
  params.append("operPasswd",args.operPasswd);
  params.append("smsCode",args.smsCode);
  params.append("unionPayType",args.unionPayType);
  params.append("bankPayType",args.bankPayType);
  return newcharge({
    url:'orderpay/chargeSetting/insertCcbSetting',
    method:'post',
    data:params
  })
}
//编辑建行商户
export function updateCcbSetting(args){
  const params=new URLSearchParams();
  params.append("branchId",args.branchId);
  params.append("certPasswd",args.certPasswd);
  params.append("certPath",args.certPath);
  params.append("merchantId",args.merchantId);
  params.append("operId",args.operId);
  params.append("wxPayType",args.wxPayType);
  params.append("operPasswd",args.operPasswd);
  params.append("smsCode",args.smsCode);
  params.append("unionPayType",args.unionPayType);
  params.append("bankPayType",args.bankPayType);
  params.append("id",args.id);
  return newcharge({
    url:'orderpay/chargeSetting/updateCcbSetting',
    method:'post',
    data:params
  })
}
  //查询建行商户
  export function queryCcbSetting(id) {
    return newcharge({
        url: 'orderpay/chargeSetting/queryCcbSetting?id='+id,
        method: 'get'
    });
}
//查询柜台号收费类型关联
export function queryCcbPosList(ccbId) {
  return newcharge({
      url: 'orderpay/chargeSetting/queryCcbPosList?ccbId='+ccbId,
      method: 'get'
  });
}
//查删除柜台号收费类型关联
export function deleteCcbPos(id) {
  return newcharge({
      url: 'orderpay/chargeSetting/deleteCcbPos?id='+id,
      method: 'get'
  });
}
//新增柜台号收费类型关联
export function insertCcbPos(args){
  const params=new URLSearchParams();
  params.append("ccbId",args.ccbId);
  params.append("posId",args.posId);
  params.append("pub",args.pub);
  params.append("typeIds",args.typeIds);
  params.append("typeNames",args.typeNames);
  return newcharge({
    url:'orderpay/chargeSetting/insertCcbPos',
    method:'post',
    data:params
  })
}
//编辑柜台号收费类型关联
export function updateCcbPos(args){
  const params=new URLSearchParams();
  params.append("ccbId",args.ccbId);
  params.append("posId",args.posId);
  params.append("pub",args.pub);
  params.append("typeIds",args.typeIds);
  params.append("typeNames",args.typeNames);
  params.append("id",args.id);
  return newcharge({
    url:'orderpay/chargeSetting/updateCcbPos',
    method:'post',
    data:params
  })
}
//查询柜台号未关联收费类型
export function queryCcbPosTypeNoUsedList(ccbId) {
  return newcharge({
      url: 'orderpay/chargeSetting/queryCcbPosTypeNoUsedList?ccbId='+ccbId,
      method: 'get'
  });
}

//新增农行商户
export function insertAbcSetting(args){
  const params=new URLSearchParams();
  params.append("certPath",args.certPath);
  params.append("keystorePassword",args.keystorePassword);
  params.append("merchantId",args.merchantId);
  params.append("projectCode",args.projectCode);
  params.append("smsCode",args.smsCode);
  params.append("typeIds",args.typeIds);
  params.append("typeNames",args.typeNames); 
  params.append("companyName",args.companyName); 
  params.append("epayName",args.epayName); 
  params.append("withoutCert",args.withoutCert); 
  params.append("nonAbcAccout",args.nonAbcAccout);
  return newcharge({
    url:'orderpay/chargeSetting/insertAbcSetting',
    method:'post',
    data:params
  })
}
//编辑农行商户
export function updateAbcSetting(args){
  const params=new URLSearchParams();
  params.append("smsCode",args.smsCode);
  params.append("projectCode",args.projectCode);
  params.append("merchantId",args.merchantId);
  params.append("keystorePassword",args.keystorePassword);
  params.append("certPath",args.certPath);
  params.append("id",args.id);
  params.append("typeIds",args.typeIds);
  params.append("typeNames",args.typeNames); 
  return newcharge({
    url:'orderpay/chargeSetting/updateAbcSetting',
    method:'post',
    data:params
  })
}
//查询农行商户
export function queryAbcSetting(id) {
  return newcharge({
      url: 'orderpay/chargeSetting/queryAbcSetting?id='+id,
      method: 'get'
  });
}
//查询农行商户列表
export function queryAbcSettingList() {
  return newcharge({
      url: 'orderpay/chargeSetting/queryAbcSettingList',
      method: 'get'
  });
}
//删除农行商户
export function deleteAbcSetting(id) {
  return newcharge({
      url: 'orderpay/chargeSetting/deleteAbcSetting?id='+id,
      method: 'get'
  });
}
//查询未关联收费类型
export function queryAbcTypeNoUsedList() {
  return newcharge({
      url: 'orderpay/chargeSetting/queryAbcTypeNoUsedList',
      method: 'get'
  });
}

//查询交易流水
export function queryBillFlowList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  if(args.paidByBilled&&args.transferFlag==1){
    params.append("paidByBilled",args.paidByBilled);
  }
  if(args.notOneDate&&args.transferFlag==1){
    params.append("notOneDate",args.notOneDate);
  }
  params.append("repeat",args.transferFlag==1?args.repeat:false);
  params.append("searchVal",args.searchVal);
  params.append("tradeDateEnd",args.tradeDateEnd);
  params.append("tradeDateStart",args.tradeDateStart);
  params.append("transferFlag",args.transferFlag);
  return newcharge({
    url:'orderpay/billflow/queryBillFlowList',
    method:'get',
    params
  })
}
//流水退款
export function updateBillflowRefund(id) {
  return newcharge({
      url: 'orderpay/billflow/updateBillflowRefund?id='+id,
      method: 'get'
  });
}

//查询对账日期
export function queryBillDate(args){
  const params=new URLSearchParams();
  params.append("billDateEnd",args.billDateEnd);
  params.append("billDateStart",args.billDateStart);
  params.append("mchType",args.mchType);
  params.append("mertId",args.mertId);
  return newcharge({
    url:'orderpay/bill/queryBillDate',
    method:'get',
    params
  })
}
//查询农行对账单
export function queryBillabcSummary(billDate,mertId){
  const params=new URLSearchParams();
  params.append("billDate",billDate);
  params.append("mertId",mertId);
  return newcharge({
    url:'orderpay/bill/queryBillabcSummary',
    method:'get',
    params
  })
}
//查询平台账单
export function queryBillSummary(billDate,mertId,mchType){
  const params=new URLSearchParams();
  params.append("billDate",billDate);
  params.append("mertId",mertId);
  params.append("mchType",mchType);
  return newcharge({
    url:'orderpay/bill/queryBillSummary',
    method:'get',
    params
  })
}
//查询对账明细
export function queryBillSummaryDetail(billSumId){
  const params=new URLSearchParams();
  params.append("billSumId",billSumId);
  return newcharge({
    url:'orderpay/bill/queryBillSummaryDetail',
    method:'get',
    params
  })
}
//查询异常订单
export function queryRepeatBillFlowList(billSumDetailId){
  const params=new URLSearchParams();
  params.append("billSumDetailId",billSumDetailId);
  return newcharge({
    url:'orderpay/bill/queryRepeatBillFlowList',
    method:'get',
    params
  })
}

//查询商户号
export function querymchIdList(id){
  const params=new URLSearchParams();
  params.append("id",id);
  return newcharge({
    url:'orderpay/chargeSetting/querymchIdList',
    method:'get',
    params
  })
}
//查询农行对账单
export function queryBillccbSummary(billDate,mertId){
  const params=new URLSearchParams();
  params.append("billDate",billDate);
  params.append("mertId",mertId);
  return newcharge({
    url:'orderpay/bill/queryBillccbSummary',
    method:'get',
    params
  })
}
//商户账单明细
export function queryBillmchList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("id",args.id);
  params.append("uname",args.uname);
  return newcharge({
    url:'orderpay/bill/queryBillmchList',
    method:'get',
    params
  })
}
//对账日期
export function queryRefundbilldate(datemonth,mertId){
  const params=new URLSearchParams();
  params.append("datemonth",datemonth);
  params.append("mertId",mertId);
  return newcharge({
    url:'abcpay/refundBill/queryRefundbilldate',
    method:'get',
    params
  })
}
//对账日期
export function updateBillReconciliation(date){
  const params=new URLSearchParams();
  params.append("date",date);
  return newcharge({
    url:'abcpay/refundBill/updateBillReconciliation',
    method:'get',
    params
  })
}

//商户账单明细
export function queryRefundbilldetailList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("billdate",args.billdate);
  params.append("merhId",args.merhId);
  return newcharge({
    url:'abcpay/refundBill/queryRefundbilldetailList',
    method:'get',
    params
  })
}

//商户号日期对账
export function updateHandleBill(billDate,mertId,mchType){
  const params=new URLSearchParams();
  params.append("billDate",billDate);
  params.append("mertId",mertId);
  params.append("mchType",mchType);
  return newcharge({
    url:'orderpay/bill/updateHandleBill',
    method:'get',
    params
  })
}

//支付下发记录列表  
export function queryDispatchrecordList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("success",args.success==1?true:false);
  params.append("orderNo",args.orderNo);
  params.append("tradeDateEnd",args.tradeDateEnd);
  params.append("tradeDateStart",args.tradeDateStart);
  params.append("tradeType",args.tradeType);
  return newcharge({
    url:'orderpay/dispatchrecord/queryDispatchrecordList',
    method:'get',
    params
  })
}
export function queryPayRefundapplyDetailListByDate(args) {
    const params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("end", args.end);
    params.append("start", args.start);
    return newcharge({
        url: 'abcpay/refundapplyDetail/queryPayRefundapplyDetailListByDate',
        method: 'get',
        params
    })
}
//支付下发重试
export function updateRetry(id){
  const params=new URLSearchParams();
  params.append("id",id);
  return newcharge({
    url:'orderpay/dispatchrecord/updateRetry',
    method:'get',
    params
  })
}

//查询二级商户
export function queryAbcsubmerhList() {
  return newcharge({
      url: 'orderpay/chargeSetting/queryAbcsubmerhList',
      method: 'get'
  });
}
//删除二级商户
export function deleteAbcsubmerh(id) {
  return newcharge({
      url: 'orderpay/chargeSetting/deleteAbcsubmerh?id='+id,
      method: 'get'
  });
}

//新增农行二级商户设置
export function addAbcsubmerh(args,smsCode) {
  return newcharge({
      headers: {
          'content-type': 'application/json'
      },
      url: 'orderpay/chargeSetting/addAbcsubmerh?smsCode='+smsCode,
      method: 'POST',
      data: JSON.stringify(args)
  });
}

//二级商户钱包列表
export function querySubmerhPurseWithTypeList() {
  return newcharge({
      url: 'orderpay/withd/querySubmerhPurseWithTypeList',
      method: 'get'
  });
}

//清分(出金)
export function addWithdBatch(args) {
  return newcharge({
      headers: {
          'content-type': 'application/json'
      },
      url: 'orderpay/withd/addWithdBatch',
      method: 'POST',
      data: JSON.stringify(args)
  });
}

//清分明细列表
export function queryWithdBatchList(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("subMerId",args.subMerId);
  params.append("withdDate",args.withdDate);
  return newcharge({
    url:'orderpay/withd/queryWithdBatchList',
    method:'get',
    params
  })
}

//查询农行综合收银台平台默认商户
export function queryAbcagentDefaultList() {
  return newcharge({
      url: 'orderpay/chargeSetting/queryAbcagentDefaultList',
      method: 'get'
  });
}

//查询二级商户
export function querySubmerhListBySchoolId(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("searchVal",args.searchVal);
  return newcharge({
    url:'orderpay/merhPurse/querySubmerhListBySchoolId',
    method:'get',
    params
  })
}


//查询二级商户
export function querySubmerhDetailListBySchoolId(args){
  const params=new URLSearchParams();
  params.append("pageNo",args.pageNo);
  params.append("pageSize",args.pageSize);
  params.append("balmodTimeEnd",args.balmodTimeEnd);
  params.append("balmodTimeStart",args.balmodTimeStart);
  params.append("subMerId",args.subMerId);
  params.append("revenue",args.revenue?(args.revenue==1?true:false):"");
  return newcharge({
    url:'orderpay/merhPurse/querySubmerhDetailListBySchoolId',
    method:'get',
    params
  })
}


//编辑学校收费配置
export function updateChargeTypeBatch(args) {
  return newcharge({
      headers: {
          'content-type': 'application/json'
      },
      url: 'orderpay/chargeType/updateChargeTypeBatch',
      method: 'POST',
      data: JSON.stringify(args)
  });
}

//查询学校支付设置
export function queryChargeTypeList() {
  return newcharge({
      url: 'orderpay/chargeType/queryChargeTypeList',
      method: 'get'
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

//群收款设置新增
export function addGroupCollectionSetting(args) {
  return fetch({
      headers: {
          'content-type': 'application/json'
      },
      url: 'groupCollection/addGroupCollectionSetting',
      method: 'POST',
      data: JSON.stringify(args)
  });
}
//群收款设置查询列表
export function queryGroupCollectionSettingList() {
  return fetch({
      url: 'groupCollection/queryGroupCollectionSettingList',
      method: 'get'
  });
}

//群收款设置删除
export function deleteGroupCollectionSetting(id) {
  return fetch({
      url: 'groupCollection/deleteGroupCollectionSetting?id='+id,
      method: 'get'
  });
}