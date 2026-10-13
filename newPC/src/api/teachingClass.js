import fetch from '@/utils/fetchNew';

/**
 * 获取分页列表teacherClass/index
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function getTeachingClassList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('userName', listQuery.userName);
  
    return fetch({
        url: 'sys/teacherClass/index',
        method: 'post',
        data: params
    });

}


/**
 * 新增修改 /teacherClass/saveOrUpdate
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function saveOrUpdate(query) {
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'sys/teacherClass/saveOrUpdate',
        method: 'post',
        data: JSON.stringify(query)
    });
}



/**
 * 获取课程 /teacherClass/toAddPop
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function toAddPop() {
    let params = new URLSearchParams();
  
    return fetch({
        url: 'sys/teacherClass/toAddPop',
        method: 'post',
        data: params
    });
}

/**
 * 判断用户已存在 /teacherClass/isExist
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function isExist(listQuery) {
    let params = new URLSearchParams();
     params.append('userId', listQuery.userId);
    return fetch({
        url: 'sys/teacherClass/isExist',
        method: 'post',
        data: params
    });
}

/**
 * 删除 /teacherClass/delete
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function deletes(listQuery) {
    let params = new URLSearchParams();
    params.append('userIds', listQuery.userIds);
    return fetch({
        url: 'sys/teacherClass/delete',
        method: 'post',
        data: params
    });
}



/**
 * 删除  /teacherClass/toUpdate
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function TeachingEdit(listQuery) {
    let params = new URLSearchParams();
    params.append('userId', listQuery.userId);
    return fetch({
        url: 'sys/teacherClass/toUpdate',
        method: 'post',
        data: params
    });
}


 
/**
 * 上传 /teacherClass/upload
 * 
 * @export
 * @param {any} listQuery 
 * @returns 
 */
export function uploadFile(file) {
    let params = new URLSearchParams();
    return fetch({
        url: 'sys/teacherClass/upload',
        method: 'post',
        data: params
    });
}
// 所教班级课程同步到企业微信
export function updateSyncWxDepartAdmins() {
    return fetch({
        url: 'sys/teacherClass/updateSyncWxDepartAdmins',
        method: 'GET'
    });
}
