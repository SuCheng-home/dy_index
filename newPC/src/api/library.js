import fetch from '@/utils/fetch';
//书本类型
export function findDicsByCode() {
    let params = new URLSearchParams();
    params.append("dicCode",'booktype');   
    return fetch({
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        params:params
    });
}
//按条件分页查询书本列表
export function getPlayWordBookListByNum(query) {
    let params = new URLSearchParams();
    params.append("boolName",query.boolName);
    params.append("pageNo",query.pageNo);
    params.append("pageSize",query.pageSize);
    params.append("state",query.state);
    params.append("typeId",query.typeId);
    return fetch({
        url: 'structure/playWord/getPlayWordBookListByNum',
        method: 'get',
        params
    });
}
//书本审批
export function batchPlayWordBook(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/batchPlayWordBook',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//新增书本
export function addPlayWordBook(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/addPlayWordBook',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//修改书本
export function updatePlayWordBook(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/playWord/updatePlayWordBook',
        method: 'post',
        data: JSON.stringify(args)
    });
}
//根据书本id查询书本详情
export function getPlayWordBookById(bookId) {
    let params = new URLSearchParams();
    params.append("bookId",bookId);   
    return fetch({
        url: 'structure/playWord/getPlayWordBookById',
        method: 'get',
        params
    });
}
//删除书本信息
export function delPlayWordBookById(bookId) {
    let params = new URLSearchParams();
    params.append("bookId",bookId);   
    return fetch({
        url: 'structure/playWord/delPlayWordBookById',
        method: 'get',
        params
    });
}