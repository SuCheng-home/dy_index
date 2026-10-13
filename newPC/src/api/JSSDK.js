import fetch from '@/utils/fetch';

/**
 * 获取初始化JSSDK数据
 */
export function getJSAPI(query) {
    var params = new URLSearchParams();
    params.append('url', query.url);
    params.append('schoolId', query.schoolId);
    params.append('isUseModlueJsapiticket', query.isUseModlueJsapiticket || false);
    if(query.moduleCode) {
        params.append('moduleCode', query.moduleCode);
    }
    return fetch({
        url: 'common/getJSAPI',
        method: 'post',
        params
    });
}

/**
 *根据serverId上传图片下载
 * @param {*} serverId 
 */
export function download(serverId, downloadUrl, moduleCode) {
    let params = new URLSearchParams();
    params.append('serverId', serverId);
    if(moduleCode) {
        params.append('moduleCode', moduleCode);
    }

    return fetch({
        url: downloadUrl,
        method: 'post',
        params
    });
}

export function commonDownload(serverId, schoolId, downloadUrl, moduleCode) {
    let params = new URLSearchParams();
    params.append('serverId', serverId);
    params.append('schoolId', schoolId);
    if(moduleCode) {
        params.append('moduleCode', moduleCode);
    }
    return fetch({
        url: downloadUrl,
        method: 'post',
        params
    });
}
