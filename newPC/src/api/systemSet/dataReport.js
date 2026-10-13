import fetch from '@/utils/fetch';

/**
 * 根据学校Id查询数据报告初始化设置
 */
export function getDataReportInit() {
    return fetch({
        url: 'structure/dataReport/getDataReportInit',
        method: 'post',
    });
}

/**
 * 新增修改数据报告初始化设置
 */
export function addAndUpdateDataReportInit(query) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/dataReport/addAndUpdateDataReportInit',
        method: 'post',
        data:JSON.stringify(query) 
    });
}
