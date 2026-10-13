import fetch from '@/utils/fetch';

// pc端分页获取个人管理的的图书领用记录(typeId=0代表全部)
export function pcQueryManageBookReceiveRecord(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("searchName", args.searchName);
    params.append("startDate", args.startDate);
    params.append("typeId", args.typeId);

    return fetch({
        url: 'structure/bookReceive/pcQueryManageBookReceiveRecord',
        method: 'GET',
        params
    });
}

// pc端分页获取个人创建的图书领用记录(typeId=0代表全部)
export function pcQueryBookReceiveRecord(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("searchName", args.searchName);
    params.append("startDate", args.startDate);
    params.append("typeId", args.typeId);

    return fetch({
        url: 'structure/bookReceive/pcQueryBookReceiveRecord',
        method: 'GET',
        params
    });
}

// 新增图书类型
export function insertBookType(args) {
    let params = new URLSearchParams();
    params.append("orderNo", args.orderNo);
    params.append("typeName", args.typeName);
    params.append("userJson", args.userJson);

    return fetch({
        url: 'structure/bookReceive/insertBookType',
        method: 'POST',
        data: params
    });
}

// 编辑图书类型
export function editBookType(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);
    params.append("orderNo", args.orderNo);
    params.append("typeName", args.typeName);
    params.append("userJson", args.userJson);

    return fetch({
        url: 'structure/bookReceive/editBookType',
        method: 'POST',
        data: params
    });
}

// 获取学校图书类型
export function getBookTypeBySchoolId() {

    return fetch({
        url: 'structure/bookReceive/getBookTypeBySchoolId',
        method: 'GET'
    });
}

// 根据类型id获取类型详情
export function getBookTypeById(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);

    return fetch({
        url: 'structure/bookReceive/getBookTypeById',
        method: 'GET',
        params
    });
}

// 除图书类型
export function deleteBookTypeById(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);

    return fetch({
        url: 'structure/bookReceive/deleteBookTypeById',
        method: 'GET',
        params
    });
}

// 新增图书领用记录
export function insertBookReceiveRecord(args) {
    let params = new URLSearchParams();
    params.append("bookCount", args.bookCount);
    params.append("bookName", args.bookName);
    params.append("bookPrice", args.bookPrice);
    params.append("classId", args.classId	);
    params.append("className", args.className);
    params.append("picJson", args.picJson);
    params.append("receiveDate", args.receiveDate);
    params.append("receiveType", args.receiveType);
    params.append("totalPrice", args.totalPrice);
    params.append("typeId", args.typeId);
    params.append("typeName", args.typeName);
    params.append("remark", args.remark);

    return fetch({
        url: 'structure/bookReceive/insertBookReceiveRecord',
        method: 'POST',
        data: params
    });
}

// 新增图书领用记录
export function editBookReceiveRecord(args) {
    let params = new URLSearchParams();
    params.append("bookCount", args.bookCount);
    params.append("bookName", args.bookName);
    params.append("bookPrice", args.bookPrice);
    params.append("classId", args.classId	);
    params.append("className", args.className);
    params.append("picJson", args.picJson);
    params.append("receiveDate", args.receiveDate);
    params.append("receiveType", args.receiveType);
    params.append("totalPrice", args.totalPrice);
    params.append("typeId", args.typeId);
    params.append("typeName", args.typeName);
    params.append("id", args.id);
    params.append("remark", args.remark);


    return fetch({
        url: 'structure/bookReceive/editBookReceiveRecord',
        method: 'POST',
        data: params
    });
}

export function getManageBookType() {

    return fetch({
        url: 'structure/bookReceive/getManageBookType',
        method: 'GET',
    });
}

// 删除图书领用记录
export function deleteBookReceiveRecord(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);
    return fetch({
        url: 'structure/bookReceive/deleteBookReceiveRecord',
        method: 'GET',
        params
    });
}

// 根据id获取图书领用记录详情
export function getBookReceiveRecordById(args) {
    let params = new URLSearchParams();
    params.append("id", args.id);
    return fetch({
        url: 'structure/bookReceive/getBookReceiveRecordById',
        method: 'GET',
        params
    });
}

// 图书领用记录统计(typeId=0代表全部)
export function bookReceiveAnalysis(args) {
    let params = new URLSearchParams();
    params.append("endDate", args.endDate);
    params.append("startDate", args.startDate);
    params.append("typeId", args.typeId);

    return fetch({
        url: 'structure/bookReceive/bookReceiveAnalysis',
        method: 'GET',
        params
    });
}
