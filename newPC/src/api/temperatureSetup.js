import fetch from '@/utils/fetch';
//保存学校体温检查设置信息
export function saveSchoolTemperatureSetInfo(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.id);
    params.append('mEndTime', listQuery.mEndTime);
    params.append('mStartTime', listQuery.mStartTime);
    params.append('mSendSys', listQuery.mSendSys);
    params.append('nEndTime', listQuery.nEndTime);
    params.append('nSendSys', listQuery.nSendSys);
    params.append('nStartTime', listQuery.nStartTime);
    return fetch({
        url: 'structure/temperatureReport/saveSchoolTemperatureSetInfo',
        method: 'post',
        data: params
    });
}
//获得学校体温检查设置信息
export function getSchoolTemperatureSetInfo() {   
    return fetch({
        url: 'structure/temperatureReport/getSchoolTemperatureSetInfo',
        method: 'get'
    });
}