import fetch from '@/utils/fetch';

// 新增组件
export function addClassCardComponent(args) {
    let params = new URLSearchParams();
    params.append('cover', args.cover);
    params.append('introduce', args.introduce);
    params.append('sizeInfo', args.sizeInfo);
    params.append('title', args.title);
    params.append('componentType', args.componentType);
    params.append('comSysType', args.comSysType);

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classCard/addClassCardComponent',
        method: 'post',
        data: JSON.stringify(args)
    });
}

// 根据条件查询组件列表
export function getClassCardComponentList() {

    return fetch({
        url: 'structure/classCard/getClassCardComponentList',
        method: 'GET',
    });
}

// 组件删除
export function delClassCardComponent(args) {
    let params = new URLSearchParams();
    params.append('componentId', args.componentId);

    return fetch({
        url: 'structure/classCard/delClassCardComponent',
        method: 'GET',
        params
    });
}

// 根据组件Id查询组件详情
export function getClassCardComponent(args) {
    let params = new URLSearchParams();
    params.append('componentId', args.componentId);

    return fetch({
        url: 'structure/classCard/getClassCardComponent',
        method: 'GET',
        params
    });
}

// 修改组件
export function updateClassCardComponent(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classCard/updateClassCardComponent',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 新增模板
export function addClassCardTemplate(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classCard/addClassCardTemplate',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 根据条件查询模板
export function getClassCardTemplateList(args) {
    let params = new URLSearchParams();
    params.append('templateType', args.templateType);
    params.append('typeCode', args.typeCode);

    return fetch({
        url: 'structure/classCard/getClassCardTemplateList',
        method: 'GET',
        params
    });
}

// 刪除模板
export function delClassCardTemplate(args) {
    let params = new URLSearchParams();
    params.append('templateId', args.templateId);

    return fetch({
        url: 'structure/classCard/delClassCardTemplate',
        method: 'GET',
        params
    });
}

// 根据模板Id查询模板详情
export function getClassCardTemplate(args) {
    let params = new URLSearchParams();
    params.append('templateId', args.templateId);

    return fetch({
        url: 'structure/classCard/getClassCardTemplate',
        method: 'GET',
        params
    });
}

// 修改模板
export function updateClassCardTemplate(args) {
    let params = new URLSearchParams();

    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classCard/updateClassCardTemplate',
        method: 'POST',
        data: JSON.stringify(args)
    });
}

// 获得学校的班牌设备列表
export function getSchoolClassCardDeviceListByTypeCode(args) {
    let params = new URLSearchParams();
    params.append('typeCode', args.typeCode);

    return fetch({
        url: 'structure/classCard/getSchoolClassCardDeviceListByTypeCode',
        method: 'GET',
        params
    });
}

// 新增模板设备关系
export function addClassCardTempList(args) {
    let params = new URLSearchParams();
    params.append('classCardIdList', args.classCardIdList);
    params.append('templeateId', args.templeateId);

    return fetch({
        url: 'structure/classCard/addClassCardTempList',
        method: 'GET',
        params
    });
}
