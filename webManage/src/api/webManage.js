import fetch from '@/utils/fetch';

/*新增栏目*/
export function addSchooWebColumn(args) {
    return fetch({
        url: 'structure/schoolWebTwo/addSchooWebColumn',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*根据网站Id获取栏目列表*/
export function getSchooWebColumnListByWebId(args) {
    let params = new URLSearchParams();
    params.append('webId', args.webId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchooWebColumnListByWebId',
        method: 'get',
        params
    })
}

/*根据栏目Id查询栏目信息*/
export function getSchooWebColumnById(args) {
    let params = new URLSearchParams();
    params.append('columnId', args.columnId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchooWebColumnById',
        method: 'get',
        params
    })
}

/*修改栏目*/
export function updateSchooWebColumn(args) {
    return fetch({
        url: 'structure/schoolWebTwo/updateSchooWebColumn',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*根据栏目Id删除*/
export function delSchooWebColumnById(args) {
    let params = new URLSearchParams();
    params.append("columnId", args.columnId);
    return fetch({
        url: 'structure/schoolWebTwo/delSchooWebColumnById',
        method: 'get',
        params
    })
}

/*新增模块*/
export function addSchoolWebModule(args) {
    return fetch({
        url: 'structure/schoolWebTwo/addSchoolWebModule',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*根据栏目id查询模块列表*/
export function getSchoolWebModuleListByColumnId(args) {
    let params = new URLSearchParams();
    params.append("columnId", args.columnId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebModuleListByColumnId',
        method: 'get',
        params
    })
}

/*根据模块id查询模块信息*/
export function getSchoolWebModuleById(args) {
    let params = new URLSearchParams();
    params.append("moduleId", args.moduleId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebModuleById',
        method: 'get',
        params
    })
}
/*修改模块*/
export function updateSchoolWebModule(args) {
    return fetch({
        url: 'structure/schoolWebTwo/updateSchoolWebModule',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*根据模块id删除模块信息*/
export function delSchoolWebModuleById(args) {
    let params = new URLSearchParams();
    params.append("moduleId", args.moduleId);
    return fetch({
        url: 'structure/schoolWebTwo/delSchoolWebModuleById',
        method: 'get',
        params
    })
}
/*模块里面的消息*/
/*新增模块消息*/
export function addSchoolWebModuleMessage(args) {
    return fetch({
        url: 'structure/schoolWebTwo/addSchoolWebModuleMessage',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*根据模块id,学校id,消息标题查询消息列表*/
export function getSchoolWebModuleMessageList(args) {
    let params = new URLSearchParams();
    params.append("webId", args.webId);
    params.append("moduleId", args.moduleId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("state", args.state);
    params.append("title", args.title);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebModuleMessageList?' + Math.random(),
        method: 'get',
        params
    })
}
/*根据消息id删除多条模块消息*/
export function delSchoolWebModuleMessageByIds(args) {
    let params = new URLSearchParams();
    params.append("messageIds", args.messageIds);
    return fetch({
        url: 'structure/schoolWebTwo/delSchoolWebModuleMessageByIds',
        method: 'get',
        params
    })
}

/*修改模块消息*/
export function updateSchoolWebModuleMessage(args) {
    return fetch({
        url: 'structure/schoolWebTwo/updateSchoolWebModuleMessage',
        method: 'post',
        data: JSON.stringify(args)
    })
}
/*置顶模块消息*/
export function updateSchoolWebModuleMessageTop(args) {
    let params = new URLSearchParams();
    params.append("messageId", args.messageId);
    params.append("ropAndDownState", args.ropAndDownState);
    return fetch({
        url: 'structure/schoolWebTwo/updateSchoolWebModuleMessageTop',
        method: 'get',
        params
    })
}

/*根据消息id查询模块消息信息*/
export function getSchoolWebModuleMessageById(args) {
    let params = new URLSearchParams();
    params.append("messageId", args.messageId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebModuleMessageById',
        method: 'get',
        params
    })
}

/*根据网站id查询列表及图片型模块列表*/
export function getSchoolWebModuleListByWebId(args) {
    let params = new URLSearchParams();
    params.append("webId", args.webId);
    params.append("type", args.type);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebModuleListByWebId',
        method: 'get',
        params
    })
}

/*根据模块id查询消息列表*/
export function getModuleMessageListByModuleId(args) {
    let params = new URLSearchParams();
    params.append("moduleId", args.moduleId);
    return fetch({
        url: 'structure/schoolWebTwo/getModuleMessageListByModuleId',
        method: 'get',
        params
    })
}
/*根据网站Id查询url类型栏目及消息列表*/
export function getSchoolWebColumnAndMessageUrlListByWebId(args) {
    let params = new URLSearchParams();
    params.append("webId", args.webId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebColumnAndMessageUrlListByWebId',
        method: 'get',
        params
    })
}
/*根据网站Id,标题查询校长信箱列表*/
export function getSchoolWebLetterBoxList(args) {
    let params = new URLSearchParams();
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("title", args.title);
    params.append("webId", args.webId);
    params.append("status", args.status);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebLetterBoxList',
        method: 'get',
        params
    })
}
/*根据消息ids删除删除校长信箱*/
export function delSchoolWebLetterBoxByIds(args) {
    let params = new URLSearchParams();
    params.append("messageIds", args.messageIds);
    return fetch({
        url: 'structure/schoolWebTwo/delSchoolWebLetterBoxByIds',
        method: 'get',
        params
    })
}
/*根据消息id查询校长信箱*/
export function getSchoolWebLetterBoxById(args) {
    let params = new URLSearchParams();
    params.append("messageId", args.messageId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebLetterBoxById',
        method: 'get',
        params
    })
}

/*消息审批*/
export function batchSchoolWebModuleMessage(args) {
    return fetch({
        url: 'structure/schoolWebTwo/batchSchoolWebModuleMessage',
        method: 'post',
        data: JSON.stringify(args)
    })
}
/*移动消息*/
export function moveSchoolWebModuleMessage(args) {
    return fetch({
        url: 'structure/schoolWebTwo/moveSchoolWebModuleMessage',
        method: 'post',
        data: JSON.stringify(args)
    })
}

/*查询用户创建的模块消息列表*/
export function getWebCreateUserList(args) {
    let params = new URLSearchParams();
    params.append("moduleId", args.moduleId);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    params.append("state", args.state);
    params.append("title", args.title);
    params.append("webId", args.webId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebCreateUserMessageList?' + Math.random(),
        method: 'get',
        params
    })
}

/*创建人查询模块列表*/
export function getSchoolWebModuleList(args) {
    let params = new URLSearchParams();
    params.append("webId", args.webId);
    return fetch({
        url: 'structure/schoolWebTwo/getSchoolWebModuleList',
        method: 'get',
        params
    })
}