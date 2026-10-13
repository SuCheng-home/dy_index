import fetch from '@/utils/fetch'

/**
 * 根据开始日期结束日期查询听课统计
 */
export function getClassRecordStatisticalList(args) {
    let params = new URLSearchParams()
    params.append('endDate', args.endDate)
    params.append('startDate', args.startDate)
    params.append('recordTypeId', args.recordTypeId)
    params.append('gradeId', args.gradeId)
    return fetch({
        url: 'structure/listenClassRecord/getClassRecordStatisticalList',
        method: 'get',
        params
    })
    }

    /**
     * 每人 时间段内的 听课次数
     */
    export function countListByModel(args) {
        let params = new URLSearchParams()
        params.append('endDate', args.endDate)
        params.append('startDate', args.startDate)

        return fetch({
            url: 'structure/listenClassRecordSide/countListByModel',
            method: 'POST',
            params
        })
    }

    /**
     * 时间段内 听课记录列表(分页)
     */
    export function listByModelAndPage(args) {
        let params = new URLSearchParams()
        params.append('endDate', args.endDate)
        params.append('startDate', args.startDate)
        params.append('pageNo', args.pageNo)
        params.append('pageSize', args.pageSize)

        return fetch({
            url: 'structure/listenClassRecordSide/listByModelAndPage',
            method: 'POST',
            params
        })
}

/**
 * 根据开始日期结束日期分页查询听课列表
 */
export function getClassRecordList(args) {
    let params = new URLSearchParams()
    params.append('endDate', args.endDate)
    params.append('pageNo', args.pageNo)
    params.append('pageSize', args.pageSize)
    params.append('startDate', args.startDate)
    params.append('recordTypeId', args.recordTypeId)
    params.append('gradeId', args.gradeId)
    return fetch({
        url: 'structure/listenClassRecord/getClassRecordList',
        method: 'get',
        params
    })
}

/**
 * 根据开始日期结束日期查询上课统计
 */
export function getClassRecordThStatisticalList(args) {
    let params = new URLSearchParams()
    params.append('endDate', args.endDate)
    params.append('startDate', args.startDate)
    params.append('recordTypeId', args.recordTypeId)
    params.append('gradeId', args.gradeId)
    return fetch({
        url: 'structure/listenClassRecord/getClassRecordThStatisticalList',
        method: 'get',
        params
    })
}

export function listenClassRecordInfoById(recordId) {
    let params = new URLSearchParams();
    params.append("recordId", recordId);

    return fetch({
        url: 'structure/listenClassRecord/listenClassRecordInfoById',
        method: 'GET',
        params
    });
}
