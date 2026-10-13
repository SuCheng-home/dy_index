import {newcard,systemFetch} from "../utils/fetch";
//根据卡号得到消费记录列表
export function listConsumeMoneyRecord(args) {
    let params = new URLSearchParams();
    params.append('userId', args.userId);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    return newcard({
        url: 'structure/oneCartoon/listConsumeMoneyRecord',
        method: 'GET',
        params
    });
}
//同步消费记录-查人
export function listUserByType(args) {
    let params = new URLSearchParams();
    params.append('classId', args.classId);
    params.append('userType', args.userType);
    params.append('username', args.username);
    return newcard({
        url: 'structure/oneCartoon/listUserByType',
        method: 'GET',
        params
    });
}
//同步某人某时间段的消费记录
export function syncConsumeListByUserIdAndDate(args) {
    let params = new URLSearchParams();
    params.append('endDate', args.endDate);
    params.append('startDate', args.startDate);
    params.append('userId', args.userId);
    return newcard({
        url: 'structure/oneCartoon/syncConsumeListByUserIdAndDate',
        method: 'GET',
        params
    });
}
//同步当前学校某一天的消费记录
export function syncConsumeListBySchoolId(date) {
    let params = new URLSearchParams();
    params.append('date', date);
    return newcard({
        url: 'structure/oneCartoon/syncConsumeListBySchoolId',
        method: 'GET',
        params
    });
}
  /**
 * 获得年级列表
 * **/
   export function querySchoolGrade() {
    return systemFetch({
      url: 'api/depart/querySchoolGrade',
      method: 'get'
    });
  }
  /**
 * 根据年级ID获得班级列表
 * **/
export function queryClassByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return systemFetch({
      url: 'api/depart/queryClassByGradeId',
      method: 'get',
      params
    });
  }
  //查询单张卡的信息
export function getCardBySid(userId) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    return newcard({
        url: 'structure/oneCartoon/getCardBySid',
        method: 'GET',
        params
    });
}
