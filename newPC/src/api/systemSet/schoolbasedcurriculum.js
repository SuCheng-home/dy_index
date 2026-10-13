import fetch from '@/utils/fetch';
export function getSchoolCourseplatformSetInfo() {
    return fetch({
      url: 'structure/coursePlatform/getSchoolCourseplatformSetInfo',
      method: 'post'
    });
  
  }

  export function saveSchoolCourseplatformSetInfo(query) {
    let params = new URLSearchParams();
    params.append('courseScopeType', query.courseScopeType);
    params.append('receiveUserJson', query.receiveUserJson);
    params.append('isRemindStuSK', query.isRemindStuSK);
    params.append('sendDayAttend', query.sendDayAttend);
    return fetch({
        url: 'structure/coursePlatform/saveSchoolCourseplatformSetInfo',
        method: 'post',
        data: params
    });

}
