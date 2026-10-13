import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
import {wymsFetchNoProcess,newcard} from '@/utils/fetch';
export function findCardListone(args) {
    let params = new URLSearchParams();
    params.append("gradeId",args.name?0:args.gradeId);
    params.append("classId",args.name?0:args.classId);
    params.append("cardType", '1');
    params.append("name", args.name);
    return newcard({
      url: 'structure/campusCard/findCardList',
      method: 'GET',
      params
    });
  }

//老师卡列表
export function findCardListtwo() {
    let params = new URLSearchParams();
    params.append("cardType", '2');
    return newcard({
        url: 'structure/campusCard/findCardList',
        method: 'GET',
        params
    });
}

//班级卡列表
export function findCardListthree() {
    let params = new URLSearchParams();
    params.append('cardType', '3');
    return newcard({
        url: 'structure/campusCard/findCardList',
        method: 'get',
        params
    });
}

//新增学生卡
export function addCampusCardone(sid, userId,companyCode,companyName) {
    let params = new URLSearchParams();
    params.append('cardType', '1');
    params.append('sid', sid);
    params.append('userId', userId);
    params.append('companyCode', companyCode);
    params.append('companyName', companyName);
    return newcard({
        url: 'structure/campusCard/addCampusCard',
        method: 'post',
        data: params
    });
}

//新增老师卡
export function addCampusCardtwo(sid, userId,companyCode,companyName) {
    let params = new URLSearchParams();
    params.append('cardType', '2');
    params.append('sid', sid);
    params.append('userId', userId);
    params.append('companyCode', companyCode);
    params.append('companyName', companyName);
    return newcard({
        url: 'structure/campusCard/addCampusCard',
        method: 'post',
        data: params
    });
}

//新增班级卡
export function addCampusCardthree(sid, classDepartId) {
    let params = new URLSearchParams();
    params.append('cardType', '3');
    params.append('sid', sid);
    params.append('classDepartId', classDepartId);
    return newcard({
        url: 'structure/campusCard/addCampusCard',
        method: 'post',
        data: params
    });
}

//查看学生卡信息
export function getCampusCardInfo(cardType, userId) {
    let params = new URLSearchParams();
    params.append('cardType', cardType);
    params.append('userId', userId);
    return newcard({
        url: 'structure/campusCard/getCampusCardInfo',
        method: 'get',
        params
    });
}

//解绑
export function deleteCampusCard(sid) {
    let params = new URLSearchParams();
    params.append('sid', sid);
    return newcard({
        url: 'structure/campusCard/deleteCampusCard',
        method: 'post',
        data: params
    });
}

//校园卡管理员或者班主任所得到的年级
export function findGradeListByRole2() {
    return newcard({
        url: 'structure/campusCard/findGradeListByRole2',
        method: 'get'
    })
}

//校园卡管理员或者班主任所得到的班级
export function findClassListByRole2(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return newcard({
        url: 'structure/campusCard/findClassListByRole2',
        method: 'get',
        params
    });
}

//一键绑定
export function whetherBindAllTwq(classId, gradeId) {
    let params = new URLSearchParams();
    params.append('classId', classId);
    params.append('gradeId', gradeId);
    params.append('twqStatus', '1');
    return newcard({
        url: 'structure/campusCard/whetherBindAllTwq',
        method: 'post',
        data: params
    });
}

//绑定/解绑体温枪
export function bindOrunBindBatchTwq(ids, sids, twqStatus) {
    let params = new URLSearchParams();
    params.append('ids', ids);
    params.append('sids', sids);
    params.append('twqStatus', twqStatus);
    return newcard({
        url: 'structure/campusCard/bindOrunBindBatchTwq',
        method: 'post',
        data: params
    });
}

//学生体温枪列表
export function findCampusCardListTwq(args) {
    let params = new URLSearchParams();
    params.append("gradeId", args.gradeId);
    params.append("classId", args.classId);
    params.append("studentNameOrNo", args.studentNameOrNo);
    params.append("twqStatus", args.twqStatus);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/campusCard/findCampusCardListTwq',
        method: 'GET',
        params
    });
}

//家长验证码（校园卡补卡使用）
export function getCardReaderSetBySchoolId() {
    return newcard({
        url: 'structure/cardReaderSet/getCardReaderSetBySchoolId',
        method: 'GET',
    });
}

// 新增或修改
export function insertOrUpdateCardReaderSet(args) {
    let params = new URLSearchParams();
    params.append("decodingRule", args.decodingRule);

    return newcard({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/cardReaderSet/insertOrUpdateCardReaderSet',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

//动态卡列表
export function classCard() {
    return fetch({
        url: 'structure/classCardManage/classCard',
        method: 'GET',
    });
}

//卡模板正/反面url
export function findSchoolDicsByCode(dicCode) {
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);
    return fetch({
        url: 'structure/schoolDictionary/findSchoolDicsByCode',
        method: 'post',
        data: params
    })
}

//生成放学卡
export function buildClassCard(cardUrl, rearCardUrl) {
    let params = new URLSearchParams();
    params.append('cardUrl', cardUrl);
    params.append('rearCardUrl', rearCardUrl);
    return fetch({
        url: 'structure/classCardManage/buildClassCard',
        method: 'post',
        data: params
    })
}

//班级卡/社团卡列表
export function classCardStatic(type) {
    let params = new URLSearchParams();
    params.append('type', type);
    return fetch({
        url: 'structure/classCardManage/classCardStatic',
        method: 'get',
        params
    })
}
//字典值列表
export function listValue() {
    let params = new URLSearchParams();
    params.append('key', "campuscardCompany");
    return wymsFetchNoProcess({
        url: 'sysDic/listValue?pageSize=500',
        method: 'get',
        params
    });
}
//删除静态班级卡
export function deleteClassCardStatic(cardId) {
    let params = new URLSearchParams();
    params.append('cardId', cardId);
    return fetch({
        url: 'structure/classCardManage/deleteClassCardStatic',
        method: 'post',
        data: params
    })
}

//根据学校类型获取年级列表
export function listGradeBySchoolType(schoolType) {
    let params = new URLSearchParams();
    params.append('schoolType', schoolType);
    return systemFetch({
        url: 'common/depart/listGradeBySchoolType',
        method: 'get',
        params
    });
}

//新增班级卡/社团卡
export function buildClassCardStatic(args) {
    let params = new URLSearchParams();
    params.append('cardLevel', args.cardLevel);
    params.append('cardName', args.cardName);
    params.append('cardNo', args.cardNo);
    params.append('cardOrder', args.cardOrder);
    params.append('cardUrl', args.cardUrl);
    params.append('rearCardUrl', args.rearCardUrl);
    params.append('type', args.type);
    return fetch({
        url: 'structure/classCardManage/buildClassCardStatic',
        method: 'post',
        data: params
    })
}

//编辑静态卡
export function updateClassCardStatic(args) {
    let params = new URLSearchParams();
    params.append('cardLevel', args.cardLevel);
    params.append('id', args.id);
    params.append('cardName', args.cardName);
    params.append('cardNo', args.cardNo);
    params.append('cardOrder', args.cardOrder);
    params.append('type', args.type);
    params.append('cardUrl', args.cardUrl);

    return fetch({
        url: 'structure/classCardManage/updateClassCardStatic',
        method: 'post',
        data: params
    })
}

//条件查询卡列表(分页)
export function listCardByModelAndPage(args) {
    let params = new URLSearchParams();
    params.append('cardNo', args.cardNo);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/campusCardPool/listCardByModelAndPage',
        method: 'get',
        params
    });
}

//新增卡(批量)
export function insertBatchCampusCard(cardNoList) {
    return newcard({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/campusCardPool/insertBatchCampusCard',
        method: 'POST',
        data: JSON.stringify(cardNoList)
    });
}

//根据卡号删除卡(物理删除)
export function deleteCardByCardNo(cardNo) {
    let params = new URLSearchParams();
    params.append('cardNo', cardNo);
    return newcard({
        url: 'structure/campusCardPool/deleteCardByCardNo',
        method: 'post',
        data: params
    });
}

//重置卡
export function resetCard(sid) {
    let params = new URLSearchParams();
    params.append('sid', sid);
    return newcard({
        url: 'structure/campusCard/resetCard',
        method: 'post',
        data: params
    });
}

//根据卡号查询所有绑定过和已删除的校园卡信息
export function getAllCardBySid(sid) {
    let params = new URLSearchParams();
    params.append('sid', sid);
    return newcard({
        url: 'structure/campusCard/getAllCardBySid',
        method: 'get',
        params
    });
}

//重置班级卡
export function resetClassCard() {
    return newcard({
        url: 'structure/campusCard/resetClassCard',
        method: 'post',
    });
}

//班级卡列表(模糊查找)
export function findClassCardList(sid) {
    let params = new URLSearchParams();
    params.append('sid', sid);
    return newcard({
        url: 'structure/campusCard/findClassCardList',
        method: 'get',
        params
    });
}
/**
 * 来源设置
 * */
 export function insertBatch(args) {
    return newcard({
      headers: {
        'content-type': 'application/json'
      },
      url: 'structure/campuscardCompany/insertBatch',
      method: 'POST',
      data: JSON.stringify(args)
    });
  }
  //来源列表
export function listBySchoolId() {
    return newcard({
        url: 'structure/campuscardCompany/listBySchoolId',
        method: 'get',
    });
}
//查询并更新订单状态(主动拉取)
export function getUpdatetOrder(orderNo) {
    let params = new URLSearchParams();
    params.append('orderNo', orderNo);
    return newcard({
        url: 'structure/oneCartoon/getUpdatetOrder',
        method: 'get',
        params
    });
}
//对账
export function listRechargeThird(listQuery) {
    let params = new URLSearchParams();
    params.append("search", listQuery.search);
    params.append("pageNo", listQuery.pageNo);
    params.append("pageSize", listQuery.pageSize);
    params.append("stateReal", listQuery.stateReal?2:1);
    return newcard({
        url: 'structure/oneCartoon/listRechargeThird',
        method: 'get',
        params
    });
  }
  //换卡
export function replaceCard(sid, oldSid) {
    let params = new URLSearchParams();
    params.append('sid', sid);
    params.append('oldSid', oldSid);
    return newcard({
        url: 'structure/campusCard/replaceCard',
        method: 'get',
        params
    });
}
//一键解绑校友校园卡
export function resetSchoolFriendsCard() {
    return newcard({
        url: 'structure/campusCard/resetSchoolFriendsCard',
        method: 'get'
    })
}