import {systemFetch} from '@/utils/fetch';

/**
 * 初始化地址簿接口
 * 
 * @export
 * @param {any} token 
 * @returns 
 */
export function init() {
    let params = new URLSearchParams();

    return systemFetch({
        url: 'api/address/init',
        method: 'post',
        params
    });

}

/**
 * 获取下级部门
 * 
 * @export
 * @param {any} departId 
 * @param {any} userTypes 
 * @returns 
 */
export function queryByDepartId(departId, userTypes) {

    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('userTypes', userTypes);
    return systemFetch({
        url: 'api/address/queryByDepartId',
        method: 'post',
        params
    });
}

/**
 * 检索用户
 * @param {*} queryList 
 */
export function retrievalUsers(queryList) {

    let params = new URLSearchParams();
    params.append('condition', queryList.condition);
    params.append('userTypes', queryList.userTypes);
    params.append('excludeUserIdsStr', queryList.excludeUserIdsStr);
    params.append('departIds', queryList.departIds);

    return systemFetch({
        url: 'api/address/retrievalUsers',
        method: 'post',
        params
    });
}

/**
 * 获取群组下的用户
 * @param {*} groupId 
 * @param {*} groupId 
 */
export function queryByGroupId(groupId) {

    let params = new URLSearchParams();
    params.append('groupId', groupId);
    return systemFetch({
        url: 'api/address/queryByGroupId',
        method: 'post',
      data: params
    });
}


/**
 * 打包部门数组，是返回的数组组装成需要的数据(含用户信息)
 * @param {*} departArray 
 */
export function packgeDepartArray(dataArray, pchecked, headerList, filterJson) {
    if (filterJson.departType == undefined) {
        filterJson.departType = 'all';
    }
    let packageArray = new Array();
    if (dataArray.departArray != undefined) {
        for (let item of dataArray.departArray) {
            if (checkShowDepartBytype(filterJson.departType, item.type)) {
                if (pchecked) {
                    packageArray.push({ id: item.id, pid: item.pid, name: item.name, wxDepartId: item.wxDepartId, checked: true, dataType: 'depart', hasChild: item.hasChild === 1 ? true : false, children: [], disabled: true, type: item.type });

                } else {
                    if (cleckHasSameId(headerList, item.id)) {
                        packageArray.push({ id: item.id, pid: item.pid, name: item.name, wxDepartId: item.wxDepartId, checked: true, dataType: 'depart', hasChild: item.hasChild === 1 ? true : false, children: [], disabled: false, type: item.type });
                    } else {
                        packageArray.push({ id: item.id, pid: item.pid, name: item.name, wxDepartId: item.wxDepartId, checked: false, dataType: 'depart', hasChild: item.hasChild === 1 ? true : false, children: [], disabled: false, type: item.type });
                    }
                }
            }
        }
    }
    if (dataArray.userArray != undefined) {
        for (let item of dataArray.userArray) {
            if (pchecked) {
                packageArray.push({ id: item.id, pid: item.pid, name: item.name, loginname: item.loginname, checked: true, mobile: item.mobile, dataType: 'user', hasChild: false, avatar: item.photoImg, disabled: true, type: item.type });
            } else {
                if (cleckHasSameId(headerList, item.id)) {
                    packageArray.push({ id: item.id, pid: item.pid, name: item.name, loginname: item.loginname, checked: true, mobile: item.mobile, dataType: 'user', hasChild: false, avatar: item.photoImg, disabled: false, type: item.type });
                } else {
                    packageArray.push({ id: item.id, pid: item.pid, name: item.name, loginname: item.loginname, checked: false, mobile: item.mobile, dataType: 'user', hasChild: false, avatar: item.photoImg, disabled: false, type: item.type });
                }
            }
        }
    }
    if (dataArray.groupArray != undefined) {
        for (let item of dataArray.groupArray) {
            if (pchecked) {
                packageArray.push({ id: item.id, pid: item.pid, name: item.name, wxTagId: item.wxTagId, checked: true, dataType: 'group', hasChild: false, disabled: true, type: item.type });

            } else {
                if (cleckHasSameId(headerList, item.id)) {
                    packageArray.push({ id: item.id, pid: item.pid, name: item.name, wxTagId: item.wxTagId, checked: true, dataType: 'group', hasChild: false, disabled: false, type: item.type });
                } else {
                    packageArray.push({ id: item.id, pid: item.pid, name: item.name, wxTagId: item.wxTagId, checked: false, dataType: 'group', hasChild: false, disabled: false, type: item.type });

                }
            }
        }
    }
    return packageArray;
}




/**
 * 过滤导航栏的菜单，获取当前点击的前面数组
 * @param {*} menuData 
 * @param {*} id 
 */
export function packageCheckedOrg(menuData, id) {
    let packgeArray = new Array();
    for (let item of menuData) {
        packgeArray.push(item);
        if (item.id === id) {
            break;
        }
    }
    return packgeArray;
}

/**
 * 获取头部选择的集合
 * @param {*} chosedArray 
 * @param {*} currentObj 
 */
export function getChosedData(chosedArray, currentObj, SingleChose, target) {
    let newChosedArray = new Array();
    if (target == 'all' || target == currentObj.dataType) {
        if (SingleChose) { //如果是线段
            newChosedArray.push(getHeaderJson(currentObj));
        } else {
            if (chosedArray.length > 0) {
                let flag = 0;
                for (let item of chosedArray) {
                    if (item.id != currentObj.id) {
                        newChosedArray.push(getHeaderJson(item));
                    } else {
                        flag++;
                    }
                }
                if (flag === 0) {
                    newChosedArray.push(getHeaderJson(currentObj));
                }
            } else {
                newChosedArray.push(getHeaderJson(currentObj));
            }
        }
    } else {
        newChosedArray = chosedArray;
    }
    return newChosedArray;
}



/**
 * 删除选择信息
 * @param {*} chosedArray 
 * @param {*} id 
 */
export function delCurrentHeaderData(chosedArray, id) {
    return chosedArray.filter(item => item.id != id)
}


/**
 * 获取提交数据库时处理过的数据
 * @param {*} chosedArray 
 */
export function getCommitAddressParams(chosedArray) {
    let departArray = new Array();
    let groupArray = new Array();
    let userArray = new Array();
    chosedArray.forEach(function(element) {
        let itemJsonStr = element;
        switch (element.dataType) {
            case 'depart':
                departArray.push(itemJsonStr);
                break;
            case 'group':
                groupArray.push(itemJsonStr);
                break;
            case 'user':
                userArray.push(itemJsonStr);
                break;
        }
    });
    return { departJson: departArray, groupJson: groupArray, userJson: userArray };

}


/**
 * 初始化地址簿数据 提供初始化存储
 * @param {*} token 
 */
export function initAddress() {
    let params = new URLSearchParams();
    return systemFetch({
        url: 'api/address/init',
        method: 'post',
        params
    })
}

/**
 * 处理头部集合数据
 * @param {*} json 
 */
export function packgeHeaderArray(dataArray) {
    let packageArray = new Array();
    if (dataArray.departArray != undefined) {
        for (let item of dataArray.departArray) {
            packageArray.push({ id: item.id, name: item.name, wxDepartId: item.wxDepartId, dataType: 'depart', type: item.type });
        }
    }
    if (dataArray.userArray != undefined) {
        for (let item of dataArray.userArray) {
            packageArray.push({ id: item.id, name: item.name, loginname: item.loginname, dataType: 'user', avatar: item.avatar, mobile: item.mobile, type: item.type });
        }
    }
    if (dataArray.groupArray != undefined) {
        for (let item of dataArray.groupArray) {
            packageArray.push({ id: item.id, name: item.name, wxTagId: item.wxTagId, dataType: 'group', type: item.type });
        }
    }
    return packageArray;
}

//检测是否存在相同的数据，用于判断头部是否有当前列表的数据
function cleckHasSameId(headerList, id) {
    let result = headerList.filter(function(item) {
        return item.id == id;
    });
    return result.length > 0 ? true : false;
}

/**
 * 根据数据获取头部json组合数据
 * @param {*} data 
 */
function getHeaderJson(data) {
    let result = '';
    switch (data.dataType) {
        case 'depart':
            result = { id: data.id, name: data.name, wxDepartId: data.wxDepartId, dataType: 'depart', type: data.type };
            break;
        case 'user':
            result = { id: data.id, name: data.name, loginname: data.loginname, dataType: 'user', avatar: data.avatar, mobile: data.mobile, type: data.type };
            break;
        case 'group':
            result = { id: data.id, name: data.name, wxTagId: data.wxTagId, dataType: 'group', type: data.type };
            break;
    }
    return result;
}

//通过部门id检测此部门是否在当前的departType控制线显示
function checkShowDepartBytype(departType, type) {
    var isShowDepart = false;
    switch (departType) {
        case 't':
            if (type == '1' || type == '7' || type == '5') {
                isShowDepart = true;
            }
            break;
        case 's':
            if (type == '2' || type == '3' || type == '4' || type == '5') {
                isShowDepart = true;
            }
            break;
        case 'sf':
            if (type == '10' || type == '5' || type == '11' || type == '12') {
                isShowDepart = true;
            }
            break;
        case 'outside':
            if (type == '20' || type == '5' || type == '21') {
                isShowDepart = true;
            }
            break;
        case 'tOrOutside':
            if (type == '1' || type == '7' || type == '20' || type == '5' || type == '21') {
                isShowDepart = true;
            }
            break;
        case 'all':
            isShowDepart = true;
            break;
    }
    return isShowDepart;
}

/**
 * 根据部门集合获取id拼接
 * @param {*} activeDepartData 
 */
export function getDepartIds(activeDepartData){
    let departIds='';
    if(activeDepartData){
        for(let i=0;i<activeDepartData.length;i++){
            if(activeDepartData[i].dataType=='depart'){
                departIds+=activeDepartData[i].id+',';
            }
            // if(i<activeDepartData.length-1){
            //     departIds+=activeDepartData[i].id+',';
            // }else{
            //     departIds+=activeDepartData[i].id;
            // }
        }
    }
    return departIds;
    
}
