import fetch from '@/utils/fetch';

/*获取值班组*/
export function getDutySetList(args) {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/composite/getDutySetList',
        method: 'post',
        data: params
    });
}

/*删除值班表*/
export function delDuty(args) {
    let params = new URLSearchParams();
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/composite/delDuty',
        method: 'post',
        data: params
    })
}

/*添加值班表*/
export function addDuty(params) {
    return fetch({
        url: 'structure/composite/addDuty',
        method: 'post',
        data: params
    })
}

/*值班表详情*/
export function getDutyById(args) {
    let params = new URLSearchParams();
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/composite/getDutyById',
        method: 'post',
        data: params
    })
}

/*编辑值班组*/
export function editDuty(params) {
    return fetch({
        url: 'structure/composite/editDuty',
        method: 'post',
        data: params
    })
}

/*添加&编辑分组*/
export function addGroup(args) {
    let params = new URLSearchParams();
    [
        'day',
        'dutyId',
        'groupName',
        'groupType',
        'id',
        'old_user',
        'monCheckUser',
        'tuesdayCheckUser',
        'wednesdayCheckUser',
        'thursdayCheckUser',
        'fridayCheckUser'
    ].forEach((propItem) => {
        if (args[propItem] !== null && args[propItem] !== undefined) {
            params.append(propItem, args[propItem]);
        }
    });
    return fetch({
        url: 'structure/composite/addGroup',
        method: 'post',
        data: params
    })
}
/*删除分组*/
export function delGroup(args) {
    let params = new URLSearchParams();
    params.append("groupId", args.groupId);
    return fetch({
        url: 'structure/composite/delGroup',
        method: 'post',
        data: params
    })
}

/*检查项列表（分页）*/
export function getCheckItemList(args) {
    let params = new URLSearchParams();
    params.append("itemName", args.itemName);
    params.append("pageNo", args.pageNo);
    params.append("pageSize", args.pageSize);
    return fetch({
        url: 'structure/composite/getCheckItemList',
        method: 'post',
        data: params
    })
}

/*获取检查组列表*/
export function getCheckGroupList(args) {
    let params = new URLSearchParams();
    params.append("dutyId", args.dutyId);
    return fetch({
        url: 'structure/composite/getCheckGroupList',
        method: 'post',
        data: params
    })
}
export function getCheckItemListAll(args) {
    let params = new URLSearchParams();
    params.append("isStar", args.isStar);
    return fetch({
        url: 'structure/composite/getCheckItemListAll',
        method: 'post',
        data: params
    })
}

/*获取课表节次信息*/
export function getClassNoList(args) {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/composite/getClassNoList',
        method: 'post',
        data: params
    })
}

/*添加&编辑检查项*/
export function addItem(params) {
    return fetch({
        url: 'structure/composite/addItem',
        method: 'post',
        data: params
    })
}

/*删除检查项*/
export function delItem(args) {
    let params = new URLSearchParams();
    params.append("itemId", args.itemId);
    return fetch({
        url: 'structure/composite/delItem',
        method: 'post',
        data: params
    })
}

/*根据用户获取检查项*/
export function getItemById(args) {
    let params = new URLSearchParams();
    params.append("itemId", args.itemId);
    return fetch({
        url: 'structure/composite/getItemById',
        method: 'post',
        data: params
    })
}

/*根据学校id查询综合检查设置*/
export function getCompositeCheckInit() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/composite/getCompositeCheckInit',
        method: 'post',
        data: params
    })
}

/*新增修改综合检查设置*/
export function addAndUpdateCompositeCheckInit(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/composite/addAndUpdateCompositeCheckInit',
        method: 'post',
        data: JSON.stringify(args)
    })
}
export function addCompositeCheckItemGroupList(args) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/composite/addCompositeCheckItemGroupList',
        method: 'post',
        data: JSON.stringify(args)
    })
}
