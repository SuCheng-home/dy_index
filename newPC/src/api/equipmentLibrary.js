import fetch from '@/utils/fetch';
//书本类型
export function findDicsByCode() {
    let params = new URLSearchParams();
    params.append("dicCode",'equipType');   
    return fetch({
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        params:params
    });
}
//根据状态查询设备列表
export function getAllScancodeEquipmentListByState(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('equipType', query.equipType);
    params.append('scanEquipId', query.scanEquipId);
    params.append('status', query.status);
    return fetch({
        url: 'structure/scancodeEquipment/getAllScancodeEquipmentListByState',
        method: 'get',
        params
    });
}