import fetch from '@/utils/fetch';

/**
 * index
 * */
/**
 * 加载学校字典类型表
 * */
export function loadSchoolDicTypeList() {
    let params = new URLSearchParams();
    params.append("clickName", 'link');

    return fetch({
        url: 'structure/schoolDictionary/loadSchoolDicTypeList',
        method: 'POST',
        params
    });
}

/**
 * 保存学校字典类型
 * */
export function saveSchoolDicType(args) {
    let params = new URLSearchParams();
    params.append("code", args.code);
    if (!!args.id) {
        params.append("id", args.id);
    }
    params.append("name", args.name);
    params.append("remark", args.remark);

    return fetch({
        url: 'structure/schoolDictionary/saveSchoolDicType',
        method: 'POST',
        params
    });
}

/**
 * 获得字典类型信息
 * */
export function getSchoolDicTypeInfoByCode(code) {
    let params = new URLSearchParams();
    params.append("code", code);

    return fetch({
        url: 'structure/schoolDictionary/getSchoolDicTypeInfoByCode',
        method: 'POST',
        params
    });
}

/**
 * 删除学校字典类型
 * */
export function deleteSchoolDicType(code) {
    let params = new URLSearchParams();
    params.append("code", code);

    return fetch({
        url: 'structure/schoolDictionary/deleteSchoolDicType',
        method: 'POST',
        params
    });
}
/**
 * 字典项 ******
 * */
/**
 * 保存字典项
 * */
export function saveDicDetail(args) {
    let params = new URLSearchParams();
    params.append("code", args.code);
    if (!!args.id) {
        params.append("id", args.id);
    }
    params.append("name", args.name);
    params.append("remark", args.remark);
    params.append("typeCode", args.typeCode);

    return fetch({
        url: 'structure/schoolDictionary/saveDicDetail',
        method: 'POST',
        params
    });
}

/**
 * 获得字典项信息
 * */
export function getDicDetailInfoByCode(code) {
    let params = new URLSearchParams();
    params.append("code", code);

    return fetch({
        url: 'structure/schoolDictionary/getDicDetailInfoByCode',
        method: 'POST',
        params
    });
}

/**
 * 删除学校字典类型
 * */
export function deleteDicDetail(code) {
    let params = new URLSearchParams();
    params.append("code", code);

    return fetch({
        url: 'structure/schoolDictionary/deleteDicDetail',
        method: 'POST',
        params
    });
}
/**
 * 字典信息 ******
 * */
/**
 * 保存字典信息
 * */
export function saveDicValue(args) {
    let params = new URLSearchParams();
    params.append("code", args.code);
    params.append("dictionaryCode", args.dictionaryCode);
    if (!!args.id) {
        params.append("id", args.id);
    }
    params.append("remark", args.remark);
    params.append("sort", args.sort);
    params.append("value", args.value);

    return fetch({
        url: 'structure/schoolDictionary/saveDicValue',
        method: 'POST',
        params
    });
}

/**
 * 根据字典id获得字典详细信息
 * */
export function getDicValueInfoById(id) {
    let params = new URLSearchParams();
    params.append("id", id);

    return fetch({
        url: 'structure/schoolDictionary/getDicValueInfoById',
        method: 'POST',
        params
    });
}

/**
 * 根据ID删除字典信息
 * */
export function deleteDicValueById(valueId) {
    let params = new URLSearchParams();
    params.append("valueId", valueId);

    return fetch({
        url: 'structure/schoolDictionary/deleteDicValueById',
        method: 'POST',
        params
    });
}


/**
 * 列表页 list
 * */
/**
 * 获得字典项下的字典列表
 * */
export function getDicDetailValuePageList(args) {
    let params = new URLSearchParams();
    params.append("dictionaryCode", args.dictionaryCode);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("value", args.searchName);

    return fetch({
        url: 'structure/schoolDictionary/getDicDetailValuePageList',
        method: 'POST',
        params
    });
}
