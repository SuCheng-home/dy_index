import fetch from '@/utils/fetch';
/**
 * 根据开始日期，结束日期，类型，学校id查询检查统计
 */
export function getCheckUserRecordList(startDate,endDate,type) {
    return fetch({
        url: 'structure/star/getCheckUserRecordList?endDate='+endDate+'&startDate='+startDate+'&type='+type,
        method: 'get',
    });
}
/**
 * 根据开始日期，结束日期，类型，学校id查询班级检查统计
 */
export function getClassCheckCountRecordList(startDate,endDate,type) {
    return fetch({
        url: 'structure/star/getClassCheckCountRecordList?endDate='+endDate+'&startDate='+startDate+'&type='+type,
        method: 'get',
    });
}
/**
 * 根据开始日期，结束日期，类型，学校id查询被检查老师统计
 */
export function getThCheckCountRecordList(startDate,endDate,type,pageNo,pageSize) {
    return fetch({
        url: 'structure/star/getThCheckCountRecordList?endDate='+endDate+'&startDate='+startDate+'&type='+type+'&pageNo='+pageNo+'&pageSize='+pageSize,
        method: 'get',
    });
}