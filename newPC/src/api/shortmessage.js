import fetch from '@/utils/fetch';
import {wymsFetchNoProcess,newcharge } from '@/utils/fetch';
//近一月统计
export function findListByDay(startTime,endTime) {
    let params = new URLSearchParams();
    params.append('startTime', startTime);
    params.append('endTime',endTime);
    return fetch({
        url: 'structure/smsMessage/findListByDay',
        method: 'get',
        params
    });
}
//某个学校的短信使用情况
export function statisticBySchoolId() {
    return fetch({
        url: 'structure/smsRecharge/statisticBySchoolId',
        method: 'get'
    });
}
//右侧面板栏
export function statisticAll() {
    return fetch({
        url: 'structure/smsMessage/statisticAll',
        method: 'get'
    });
}
// 获取学校短信模板
export function queryTemplateBySchoolId() {
    return fetch({
        url: 'structure/recruitMessageTemplate/queryTemplateBySchoolId',
        method: 'GET',
    });
}

// 删除模板
export function deleteTemplate(args) {
    let params = new URLSearchParams();
    params.append('templateId', args.templateId);
    params.append('templateMessageId', args.templateMessageId && args.templateMessageId != 0 ? args.templateMessageId : '');

    return fetch({
        url: 'structure/recruitMessageTemplate/deleteTemplate',
        method: 'GET',
        params
    });
}

// 根据id获取详情
export function getTemplateDetail(args) {
    let params = new URLSearchParams();
    params.append('templateId', args.templateId);

    return fetch({
        url: '/structure/recruitMessageTemplate/getTemplateDetail',
        method: 'GET',
        params
    });
}

// 新增模板
export function addTemplate(args) {
    let params = new URLSearchParams();
    params.append('title', args.title);
    params.append('content', args.content);
    params.append('scene', args.scene);
    if (args.templateParams) {
        params.append('templateParams', args.templateParams);
    }

    return fetch({
        url: 'structure/recruitMessageTemplate/addTemplate',
        method: 'GET',
        params
    });
}

// 编辑模板
export function editTemplate(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);
    params.append('templateId', args.templateId && args.templateId != 0 ? args.templateId : '');
    params.append('title', args.title);
    params.append('content', args.content);
    params.append('scene', args.scene);
    if (args.templateParams) {
        params.append('templateParams', args.templateParams);
    }
    return fetch({
        url: 'structure/recruitMessageTemplate/editTemplate',
        method: 'GET',
        params
    });
}
//列表查询
export function index(args) {
    let params = new URLSearchParams();
    params.append('endTime', args.endTime);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startTime', args.startTime);
    params.append('mobile', args.mobile);
    params.append('isReply', args.isReply);
    if(args.result){
        params.append('result', args.result);
    }   
    return fetch({
        url: 'structure/smsMessage/index',
        method: 'GET',
        params
    });
}
//单个学校短信概览
export function listByModel(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    return fetch({
        url: 'structure/smsRecharge/listByModel',
        method: 'GET',
        params
    });
}

//列表查询
export function listPageByModel(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return fetch({
        url: 'structure/smsRecharge/listPageByModel',
        method: 'GET',
        params
    });
}
//提醒学校管理员余量不足
export function remindCurUser() {
    return fetch({
        url: 'structure/smsRecharge/remindCurUser',
        method: 'GET'
    });
}
//充值
export function insert(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/smsRecharge/insert',
        method: 'POST',
        data: JSON.stringify(args)
    });
  }
  // 单条充值记录
export function queryLiableList(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('type', 2);
    return wymsFetchNoProcess({
        url: 'school/queryLiableList',
        method: 'get',
        params
    });
}

//发送明细
export function listSmsByGroupId(args) {
    let params = new URLSearchParams();
    params.append('endTime', args.endTime);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('startTime', args.startTime);
    params.append('mobile', args.mobile);
    params.append('groupId', args.groupId);
    params.append('isReply', args.isReply);
    params.append('result', args.result);
    params.append('moduleCode', args.moduleCode);
    return fetch({
        url: 'structure/smsMessage/listSmsByGroupId',
        method: 'GET',
        params
    });
}

//新增群发
export function sendSMS(args) {
    let params = new URLSearchParams();
    params.append('moduleCode', args.moduleCode);
    params.append('moduleName', args.moduleName);
    params.append('receivers', args.receivers);
    params.append('smsContent', args.smsContent);
    params.append('templateId', args.templateId);
    params.append('templateName', args.templateName);
    params.append('templateParamJson', args.templateParamJson);
    params.append('type', args.type);
    return fetch({
        url: 'structure/smsRecharge/sendSMS',
        method: 'post',
        data:params
    });
  }
//单个学校短信充值记录(已审批 + 已充值)
export function listByState() {
    return fetch({
        url: 'structure/smsRecharge/listByState',
        method: 'GET'
    });
}

    //获取农行支付url(缴费中心)
export function queryAbcPayUrl(orderNo) {
    let params = new URLSearchParams();
    params.append('orderNo', orderNo);
    return newcharge({
        url: 'orderpay/order/queryAbcPayUrl',
        method: 'GET',
        params
    });
}
    //农行一码多扫
    export function queryAbcOneQR(orderNo) {
        let params = new URLSearchParams();
        params.append('orderNo', orderNo);
        return newcharge({
            url: 'orderpay/orderPay/queryAbcOneQR',
            method: 'GET',
            params
        });
    }

    //查询学校短信群组列表（分页）
export function getSchoolSmsMobileGroupPageList(args) {
    let params = new URLSearchParams();
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('groupName', args.groupName);
    return fetch({
        url: 'structure/smsMobileGroup/getSchoolSmsMobileGroupPageList',
        method: 'GET',
        params
    });
}

    //删除短信群组
    export function deleteSmsMobileGroupById(id) {
        let params = new URLSearchParams();
        params.append('id', id);
        return fetch({
            url: 'structure/smsMobileGroup/deleteSmsMobileGroupById',
            method: 'GET',
            params
        });
    }

    //新增短信群组
export function addSmsMobileGroup(args) {
    let params = new URLSearchParams();
    params.append('groupName', args.groupName);
    params.append('mobiles', args.mobiles);
    return fetch({
        url: 'structure/smsMobileGroup/addSmsMobileGroup',
        method: 'post',
        data:params
    });
  }
  //查询短信群组详细信息
  export function getSmsMobileGroupInfoById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return fetch({
        url: 'structure/smsMobileGroup/getSmsMobileGroupInfoById',
        method: 'GET',
        params
    });
}

   //编辑短信群组
   export function editSmsMobileGroup(args) {
    let params = new URLSearchParams();
    params.append('groupName', args.groupName);
    params.append('mobiles', args.mobiles);
    params.append('id', args.id);
    return fetch({
        url: 'structure/smsMobileGroup/editSmsMobileGroup',
        method: 'post',
        data:params
    });
  }

  //查询学校短信群组列表
  export function getSchoolSmsMobileGroupList() {
    return fetch({
        url: 'structure/smsMobileGroup/getSchoolSmsMobileGroupList',
        method: 'GET'
    });
}