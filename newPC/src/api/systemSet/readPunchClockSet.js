import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';

/**
 * 根据学校类型获取年级列表
 */
export function listGradeBySchoolType(schoolType) {
  let params = new URLSearchParams();
  params.append('schoolType', schoolType);

  return systemFetch({
    url: 'common/depart/listGradeBySchoolType',
    method: 'post',
    data: params
  });

}

/**
 * 获取阅读打卡设置
 */
export function getReadClockInSet() {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/readClockIn/getReadClockInSet',
    method: 'post',
    data: params
  });

}

/**
 *  保存获取阅读打卡设置
 */
export function saveReadClockInSet(query) {
    let params = new URLSearchParams();
    params.append('allSchool', query.allSchool);
    params.append('gradeListJson', query.gradeListJson);
    params.append('warnClockIn', query.warnClockIn);
    params.append('warnLookClockIn', query.warnLookClockIn);
    params.append('warnLookWeekPlan', query.warnLookWeekPlan);
    params.append('warnWeekPlan', query.warnWeekPlan);

    return fetch({
        url: 'structure/readClockIn/saveReadClockInSet',
        method: 'post',
        data: params
    });

}
