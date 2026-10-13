import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

/**
 * 审核列表页
 * */
export function schoolfellowList(args) {
  const params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("status", args.status);
  if (args.classId) {
      params.append("classId", args.classId);
  }
  if (args.gradeId) {
      params.append("gradeId", args.gradeId);
  }
  return systemFetch({
    url: 'schoolfellow/list',
    method: 'GET',
    params
  })
}

/**
 * 审核列表页-非鉴权
 * */
export function schoolfellowCommonList(args) {
  const params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("status", args.status);

  return systemFetch({
    url: 'schoolfellow/common/list',
    method: 'GET',
    params
  })
}

/**
 * 查询校友审核设置信息
 * */
export function getConfigInfo() {
  const params = new URLSearchParams();

  return systemFetch({
    url: 'schoolfellow/getConfigInfo',
    method: 'GET',
    params
  })
}

/**
 * 修改设置
 * */
export function updateConfig(args) {
  const params = new URLSearchParams();
  params.append("homePagePic", args.homePagePic);
  params.append("id", args.id);
  params.append("isNeedCheck", args.isNeedCheck);
  params.append("schoolId", args.schoolId);
  params.append("wxqrcode", args.wxqrcode);

  return systemFetch({
    url: 'schoolfellow/updateConfig',
    method: 'POST',
    data: params
  })
}

/**
 * 校友申请详情页
 * */
export function getApplyInfo(args) {
  const params = new URLSearchParams();
  params.append("id", args.id);

  return systemFetch({
    url: 'schoolfellow/detail',
    method: 'GET',
    params
  })
}

/**
 * 申请审核操作
 * */
export function checkFellowApply(args) {
  const params = new URLSearchParams();
  params.append("id", args.id);
  params.append("status", args.status);
  params.append("checkRemark", args.checkRemark);

  return systemFetch({
    url: 'schoolfellow/checkFellowApply',
    method: 'POST',
    data: params
  })
}
export function deleteFellowApply(id) {
    const params = new URLSearchParams();
    params.append("id", id);

    return systemFetch({
        url: 'schoolfellow/deleteFellowApply',
        method: 'GET',
        params
    })
}

    export function getGradeAndClass() {
        return systemFetch({
            url: 'schoolfellow/getGradeAndClass',
            method: 'GET'
        })
    }
// export function updateApply(args) {
//     const params = new URLSearchParams();
//     params.append("classId", args.classId);
//     params.append("className", args.className);
//     params.append("id", args.id);

//     return systemFetch({
//         url: 'schoolfellow/updateApply',
//         method: 'GET',
//         params
//     })
// }
export function updateApply(params) {
    return systemFetch({
        url: 'schoolfellow/updateApply',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}
export function checkFellowApplyBatch(params) {
    return systemFetch({
        url: 'schoolfellow/checkFellowApplyBatch',
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        data: JSON.stringify(params)
    })
}
export function exportSchoolFellowFile() {
    return systemFetch({
        url: 'schoolfellow/exportSchoolFellowFile',
        method: 'GET'
    })
}