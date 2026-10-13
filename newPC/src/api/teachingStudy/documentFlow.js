import fetch from '@/utils/fetch';

/**
 * 根据条件查询公文流转
 * */
export function possessRole(ConstantId) {
  let params = new URLSearchParams();
  params.append('roleConstantId', ConstantId);
  return fetch({
    url: 'userRole/possessRole',
    method: 'POST',
    params
  });
}


/**
 * 根据条件查询公文流转
 * */
export function getDocumentFlowList(args) {
  let params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("title", args.title);
  params.append("schoolTimeId", args.schoolTimeId);

  return fetch({
    url: 'structure/documentFlow/getDocumentFlowList',
    method: 'GET',
    params
  });
}

/**
 * 新增公文流转
 * */
export function addDocumentFlow(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/documentFlow/addDocumentFlow',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 编辑公文流转
 * */
export function updateDocumentFlow(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/documentFlow/updateDocumentFlow',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

export function addAndUpdateDocumentFlowInit(args) {

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/documentFlow/addAndUpdateDocumentFlowInit',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

/**
 * 根据id查询公文流转
 * */
export function getDocumentFlowById(documentId) {
  let params = new URLSearchParams();
  params.append("documentId", documentId);

  return fetch({
    url: 'structure/documentFlow/getDocumentFlowById',
    method: 'GET',
    params
  });
}
export function remindNowDealUserList(documentId, stepIdNo, title) {
    let params = new URLSearchParams();
    params.append("documentId", documentId);
    params.append("stepIdNo", stepIdNo);
    params.append("title", title);
    return fetch({
        url: 'structure/documentFlow/remindNowDealUserList',
        method: 'GET',
        params
    });
}
export function getDocumentFlowInit() {
    return fetch({
        url: 'structure/documentFlow/getDocumentFlowInit',
        method: 'GET'
    });
}

/**
 * 根据id删除公文流转
 * */
export function delDocumentFlowById(documentId) {
  let params = new URLSearchParams();
  params.append("documentId", documentId);

  return fetch({
    url: 'structure/documentFlow/delDocumentFlowById',
    method: 'GET',
    params
  });
}

/**
 * 公文处理
 * */
export function dealWorkFlow(args) {
  let params = new URLSearchParams();
  params.append("batchType", args.batchType);
  params.append("createUserId", args.createUserId);
  params.append("dealUserList", args.dealUserList);
  params.append("documentFlow", args.documentFlow);
  params.append("stepIdNo", args.stepIdNo);
  params.append("toStepIdNo", args.toStepIdNo);
  params.append("workFlowId", args.workFlowId);
  params.append("batchContent", args.batchContent || '');
 if (args.isTransfer) {
     params.append("isTransfer", args.isTransfer);
 }
  return fetch({
    url: 'structure/documentFlow/dealWorkFlow',
    method: 'POST',
    data: params
  });
}

export function backDocumentFlowDeal(args) {
    let params = new URLSearchParams();
    params.append("createUserId", args.createUserId);
    params.append("dealUserList", args.dealUserList);
    params.append("documentFlow", args.documentFlow);
    params.append("stepIdNo", args.stepIdNo);
    params.append("toStepIdNo", args.toStepIdNo);
    params.append("workFlowId", args.workFlowId);
    params.append("batchContent", args.batchContent || '');
    return fetch({
        url: 'structure/documentFlow/backDocumentFlowDeal',
        method: 'POST',
        data: params
    });
}
export function newgetDealUserList(stepIdNo, workFlowId, operatId, appUserId, isTransfer) {
    let params = new URLSearchParams();
    params.append("stepIdNo", stepIdNo);
    params.append("workFlowId", workFlowId);
    params.append("operatId", operatId);
    params.append("appUserId", appUserId);
    params.append("departId", 0);
     if (isTransfer) {
         params.append("isTransfer", isTransfer);
     }
    return fetch({
        url: 'structure/workFlow/getDealUserList',
        method: 'GET',
        params
    });
}

// 驳回流程
export function sendBackWorkFlow(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/workFlow/sendBackWorkFlow',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
