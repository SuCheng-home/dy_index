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
export function getOralClockInit() {
  return fetch({
    url: 'structure/oralClock/getOralClockInit',
    method: 'get'
  });

}

/**
 *  新增修改口算打卡设置
 */
export function addAndUpdateOralClockInit(query) {
        return fetch({
          headers: {
              'content-type': 'application/json'
          },
          url: 'structure/oralClock/addAndUpdateOralClockInit',
          method: 'POST',
          data: JSON.stringify(query)
      });
}
