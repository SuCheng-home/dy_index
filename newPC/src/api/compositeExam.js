import fetch from '@/utils/fetch';

/*获取值班组*/
export function findDutyList(args) {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/compositeStatistic/findDutyList',
        method: 'post',
        data: params
    });

}
/*按日期统计*/
export function dateStatisticScore(args) {
    let params = new URLSearchParams();
    params.append("checkDate", args.checkDate);
    params.append("gradeId", args.gradeId);
    params.append("seeType", args.seeType);
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/compositeStatistic/statisticScore',
        method: 'post',
        data: params
    });
}
/*按日期统计详情*/
export function dateDetailByDate(args) {
    let params = new URLSearchParams();
    params.append("checkTime", args.checkTime);
    params.append("classId", args.classId);
    params.append("itemId", args.itemId);

    return fetch({
        url: 'structure/compositeStatistic/getDetailByDate',
        method: 'post',
        data: params
    });

}

/*按周次统计*/
export function weekStatisticScore(args) {
    let params = new URLSearchParams();
    params.append("gradeId", args.gradeId);
    params.append("seeType", args.seeType);
    params.append("severalWeek", args.severalWeek);
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/compositeStatistic/statisticScore',
        method: 'post',
        data: params
    });

}

/*按周次统计详情*/
export function weekDetailByDate(args) {
    let params = new URLSearchParams();
    params.append("severalWeek", args.severalWeek);
    params.append("classId", args.classId);
    params.append("itemId", args.itemId);

    return fetch({
        url: 'structure/compositeStatistic/getDetailByWeek',
        method: 'post',
        data: params
    });

}

/*按时间段统计*/
export function timeStatisticScore(args) {
    let params = new URLSearchParams();
    params.append("endTimeStr", args.endTimeStr);
    params.append("gradeId", args.gradeId);
    params.append("seeType", args.seeType);
    params.append("startTimeStr", args.startTimeStr);
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/compositeStatistic/statisticScore',
        method: 'post',
        data: params
    });

}

/*按检查项统计*/
export function findStatisticByItem(args) {
    let params = new URLSearchParams();
    params.append("gradeId", args.gradeId);
    params.append("itemId", args.itemId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/compositeStatistic/findStatisticByItem',
        method: 'post',
        data: params
    });

}


/**
 * @type create
 * @date 2020 - 12 - 07
 * @description
 *      综合检查迭代：
 *          新增问题反馈记录tab
 */
// 统一处理请求参数
const filterURLSearchParams = (args = {}) => {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 查询有问题反馈的值班组
export const findDutyBasehavingRecordList = params =>
    fetch({
        url: 'structure/compositeNew/findDutyBasehavingRecordList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 条件查询 问题 反馈列表(分页)
export const findCheckEventListByPage = params =>
    fetch({
        url: 'structure/compositeNew/findCheckEventListByPage',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 问题 反馈列表(导出Excel)
export const exportFindCheckEventList = params =>
    fetch({
        url: 'structure/compositeNew/exportFindCheckEventList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })