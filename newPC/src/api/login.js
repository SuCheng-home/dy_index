import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
export function logout(token) {
    let params = new URLSearchParams();
    params.append('token', token);
    return systemFetch({
        url: 'login/logout',
        method: 'post',
        params
    });
}


export function getInfo(token) {
    let params = new URLSearchParams();
    params.append('token', token);
    return systemFetch({
        url: 'login/refresh',
        method: 'post',
        params
    });
}
export function login(account, password, clientType) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    if (clientType) {
        params.append('clientType', clientType);
    }
    return systemFetch({
        url: 'login',
        method: 'post',
        data: params
    });
}


/**
 * 根据上级权限id获取子权限
 * @param {*} permId 
 */
export function getNewUserSonPerm(permId) {
    let params = new URLSearchParams();
    params.append('permId', permId);
    return systemFetch({
        url: 'permission/getNewUserSonPerm',
        method: 'post',
        data: params
    });
}

/**
 * 选择学校登录
 * @param {*} account 
 * @param {*} password 
 * @param {*} schoolId 
 */
export function loginForChosedSchoold(account, password, schoolId) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    params.append('schoolId', schoolId);
    return systemFetch({
        url: 'login',
        method: 'post',
        data: params
    });
}

/**
 * 登录的用户修改自己的密码
 * @param {*} newPwd 
 * @param {*} oldPwd 
 */
export function modifyPassword(newPwd, oldPwd, userId) {
    let params = new URLSearchParams();
    params.append('newPwd', newPwd);
    params.append('oldPwd', oldPwd);
    params.append('userId', userId);
    return systemFetch({
        url: 'login/modifyPassword',
        method: 'post',
        data: params
    });
}

/**
 * 微信登录
 */
export function loginForWX(code, state, loginType = '', clientType) {
    let params = new URLSearchParams();
    params.append('code', code);
    params.append('state', state);
    if (loginType) {
        params.append('loginType', loginType);
    }
    if (clientType) {
        params.append('clientType', clientType);
    }
    return systemFetch({
        url: 'login/weixin',
        method: 'post',
        data: params
    });
}

/**
 * 微信登录：微信接口配置
 */
export function getWXInitData(loginType) {
    let params = new URLSearchParams();
    if (loginType) {
        params.append('loginType', loginType);
    }
    return systemFetch({
        url: 'login/weixin/permit',
        method: 'post',
        data: params
    });
}

/**
 * 微信登录：获得验证码(这个接口用来做绑定微信登录的时候使用)
 * @param {*} mobile 
 */
export function getCode(mobile, clientType) {
    let params = new URLSearchParams();
    params.append('mobile', mobile);
    if (clientType) {
        params.append('clientType', clientType);
    }
    return systemFetch({
        url: 'login/weixin/bind/getCode',
        method: 'post',
        data: params
    });
}

/**
 * 微信登录：绑定接口(先调用【微信登录：获得验证码】接口，引导客户输入收到的验证码后，调用此接口 如果成功后，会自动进行登录操作)
 * @param {*} code 
 * @param {*} mobile 
 * @param {*} wxToken 
 */
export function wxBind(code, mobile, wxToken, clientType) {
    let params = new URLSearchParams();
    params.append('code', code);
    params.append('mobile', mobile);
    params.append('wxToken', wxToken);
    if (clientType) {
        params.append('clientType', clientType);
    }
    return systemFetch({
        url: 'login/weixin/bind',
        method: 'post',
        data: params
    });
}


/**
 * 扫码登录
 * @param {*} schoolId 
 * @param {*} wxToken 
 */
export function loginWx(schoolId, wxToken) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    params.append('wxToken', wxToken);
    return systemFetch({
        url: 'login/weixin',
        method: 'post',
        data: params
    });
}

export function fromOldFramework(userToken) {
    let params = new URLSearchParams();
    params.append('userToken', userToken);
    return systemFetch({
        url: 'login/fromOldFramework',
        method: 'GET',
        params
    });
}

export function permissions(args) {
    let params = new URLSearchParams();
    if (args.moduleCode) {
        params.append('moduleCode', args.moduleCode);
    }

    return systemFetch({
        url: 'oneself/permissions',
        method: 'GET',
        params
    });
}

export function userSign(args) {
    let params = new URLSearchParams();
    params.append('userSign', args.userSign);
    params.append('orgCode', args.orgCode);

    return systemFetch({
        url: 'login/userSign',
        method: 'GET',
        params
    });
}

export function wxLoginLogin(args) {
    let params = new URLSearchParams();
    params.append('appId', args.appId);
    params.append('openId', args.openId);
    params.append('schoolId', args.schoolId);

    return systemFetch({
        url: 'common/thirdparty/wxLogin/login',
        method: 'GET',
        params
    });
}
export function wxLoginChooseSchool(args) {
    let params = new URLSearchParams();
    params.append('appId', args.appId);
    params.append('openId', args.openId);

    return systemFetch({
        url: 'common/thirdparty/wxLogin/chooseSchool',
        method: 'GET',
        params
    });
}

export function ability() {
    return systemFetch({
        url: 'login/switchSchool/ability',
        method: 'get'
    });
}
export function switchSchoollist() {
    return systemFetch({
        url: 'login/switchSchool/list',
        method: 'get'
    });
}
export function switchSchoollogin(schoolId) {
    let params = new URLSearchParams();
    params.append('schoolId', schoolId);
    return systemFetch({
        url: 'login/switchSchool/login',
        method: 'GET',
        params
    });
}
