import fetch from '@/utils/fetch'

/**
 * 统一处理请求参数
 * */
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key])
    });
    return params
}

/**
 * 积分商城
 * */
/**
 * 查询商品列表（分页）
 * */
export function getSchoolIntegralGoodsPageList(args) {
    return fetch({
        url: 'structure/integralBank/getSchoolIntegralGoodsPageList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 查询商品详细信息
 * */
export function getIntegralGoodsInfoById(args) {
    return fetch({
        url: 'structure/integralBank/getIntegralGoodsInfoById',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 上下架商品
 * */
export function updateSchoolIntegralGoodsStatus(args) {
    return fetch({
        url: 'structure/integralBank/updateSchoolIntegralGoodsStatus',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 入库学校商品
 * */
export function updateSchoolIntegralGoodsStock(args) {
    return fetch({
        url: 'structure/integralBank/updateSchoolIntegralGoodsStock',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 入库记录
 * */
export function getIntegralGoodsWareRecordPageList(args) {
    return fetch({
        url: 'structure/integralBank/getIntegralGoodsWareRecordPageList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 积分卡使用
 * */
/**
 * 查询用户积分统计（分页）
 * */
export function getSchoolUserIntegralDataPageList(args) {
    return fetch({
        url: 'structure/integralBank/getSchoolUserIntegralDataPageList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 查询学校学生兑换记录列表（分页）
 * */
export function getSchoolStuIntegralExchangePageList(args) {
    return fetch({
        url: 'structure/integralBank/getSchoolStuIntegralExchangePageList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

export function getExchangeLogList(args) {
    return fetch({
        url: 'structure/integralBank/getExchangeLogList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 发送兑换物品
 * */
export function updateStuExchangeStatus(args) {
    return fetch({
        url: 'structure/integralBank/updateStuExchangeStatus',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 查询操作记录列表
 * */
export function getIntegralBankList(args) {
    return fetch({
        url: 'structure/integralBank/getIntegralBankList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 批量开户
 * */
export function addIntegralBankUserList(args) {
    return fetch({
        url: 'structure/integralBank/addIntegralBankUserList',
        timeout: 60000,
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 *
 * */
/**
 * 查询学校各班级积分统计列表
 * */
export function getSchoolClassCardPointStaticsList(args) {
    return fetch({
        url: 'structure/integralBank/getSchoolClassCardPointStaticsList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 查询学生积分卡积分获得记录(分页）
 * */
export function getStuGainCardPointPageList(args) {
    return fetch({
        url: 'structure/integralBank/getStuGainCardPointPageList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}

/**
 * 根据班级ID和学生ID查询获得积分统计数据
 * */
export function getStuGainIntegralCardPointData(args) {
    return fetch({
        url: 'structure/integralBank/getStuGainIntegralCardPointData',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}
export function getStuGainIntegralCardPointData2(args) {
    return fetch({
        url: 'structure/integralBank/getStuGainIntegralCardPointData2',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}
export function getSchoolCanAddIntegralGoodsList(args) {
    return fetch({
        url: 'structure/integralBank/getSchoolCanAddIntegralGoodsList',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}
export function deleteSchoolIntegralGoodsByGoodId(args) {
    return fetch({
        url: 'structure/integralBank/deleteSchoolIntegralGoodsByGoodId',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}
export function batchAddSchoolIntegralGoods(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/integralBank/batchAddSchoolIntegralGoods',
        method: 'POST',
        data: JSON.stringify(args)
    });
}
//根据字典code获得字典数据
export function findDicsByCode() {
    let params = new URLSearchParams();
    params.append('dicCode', 'integralGoodsType');
    return fetch({
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        data: params
    });
}
// export function evalExchangeReturn(args) {
//     return fetch({
//         headers: {
//             'content-type': 'application/json'
//         },
//         url: 'structure/integralBank/evalExchangeReturn',
//         method: 'POST',
//         data: JSON.stringify(args)
//     });
// }
export function evalExchangeReturn(args) {
    return fetch({
        url: 'structure/integralBank/evalExchangeReturn',
        method: 'POST',
        data: filterURLSearchParams(args)
    })
}