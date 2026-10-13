import {
    login,
    logout,
    getInfo,
    fromOldFramework,
    permissions
} from '@/api/login';
import {
    getSchoolYear
} from '@/api/schoolTimeList';
import {
    getSchoolMapInit
} from "@/api/map";
import {
    getCurrentSchoolTimeBySchoolId
} from '@/api/common/schoolTime';
import Cookies from 'js-cookie';
import moment from 'moment';

const user = {
    state: {
        user: '',
        status: '',
        email: '',
        code: '',
        uid: undefined,
        auth_type: '',
        token: Cookies.get('Admin-Token'),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        },
        userInfo: {},
        schoolInfo: {},
        permissions: [],
        permissionNameMapping: {},
        departs: [],
        schoolYearList: [],
        currentSchoolYear: {},
        selectedSchoolYear: 0
    },

    mutations: {
        SET_AUTH_TYPE: (state, type) => {
            state.auth_type = type;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_SCHOOLINFO: (state, schoolInfo) => {
            window.sessionStorage.setItem('schoolId', schoolInfo.id);
            state.schoolInfo = schoolInfo;
        },
        SET_PERMISSIONS: (state, permissionList) => {
            const permissions = [],
                permissionNameMapping = {};
            permissionList.forEach(item => {
                permissions.push(item.url.trim());
                permissionNameMapping[item.url.trim()] = item.description ? item.description.trim() : item.name;
            });
            state.permissions = permissions;
            state.permissionNameMapping = permissionNameMapping;
        },
        SET_SCHOOLYEAR: (state, schoolYearList) => {
            state.schoolYearList = schoolYearList;
            const currentSchoolYear = schoolYearList.find(item => item.currentYear == 1);
            state.currentSchoolYear = currentSchoolYear || {};
            state.selectedSchoolYear = currentSchoolYear ? currentSchoolYear.year : 0;
        },
        RESET_SCHOOLYEAR: (state) => {
            state.selectedSchoolYear = state.currentSchoolYear.year;
            sessionStorage.setItem('selectedSchoolYear', state.currentSchoolYear.year);
        },
        SET_SELECTED_SCHOOLYEAR: (state, selectedSchoolYear) => {
            state.selectedSchoolYear = selectedSchoolYear;
            sessionStorage.setItem('selectedSchoolYear', selectedSchoolYear);
        },
        SET_DEPARTS: (state, departs) => {
            state.departs = departs;
        },
        LOGIN_SUCCESS: () => {},
        LOGOUT_USER: state => {
            state.user = '';
        }
    },

    actions: {
        // 登录
        Login({
            commit,
            dispatch
        }, userInfo) {
            const account = userInfo.account.trim();
            return new Promise((resolve, reject) => {
                login(account, userInfo.password).then(response => {
                    const data = response.data.data;
                    Cookies.set('Admin-Token', data.token);
                    commit('SET_TOKEN', data.token);
                    commit('SET_USERINFO', data.userPageModel);
                    commit('SET_SCHOOLINFO', data.schoolPageModel);
                    commit('SET_ROLES', data.roleList);
                    commit('SET_DEPARTS', data.departList);
                    if (!sessionStorage.getItem("mymapKey") && Cookies.get("Admin-Token")) {
                        getSchoolMapInit().then(res => {
                            if (res.data.code === 200 && res.data.data) {
                                if (res.data.data.mapKey) {
                                    sessionStorage.setItem("mymapKey", res.data.data.mapKey);
                                    window._AMapSecurityConfig = {
                                        securityJsCode: res.data.data.mapSecurity,
                                    }
                                } else {
                                    // sessionStorage.setItem("mymapKey", '9243692cd0ebfce439a16c9ab1f4acd4');
                                    // window._AMapSecurityConfig = {
                                    //     securityJsCode: "fbdf8704c1986d9a5c878b14db1dbc98",
                                    // }
                                    sessionStorage.setItem("mymapKey", '');
                                    window._AMapSecurityConfig = {
                                        securityJsCode: "",
                                    }
                                }
                            } else {
                                sessionStorage.setItem("mymapKey", '');
                                window._AMapSecurityConfig = {
                                    securityJsCode: "",
                                }
                            }
                        })
                    }
                    Promise.all([
                            dispatch('GetPermission', sessionStorage.getItem('pcModuleCode')),
                            dispatch('GetSchoolYear')
                        ])
                        .then(() => {
                            resolve(response);
                        });
                }).catch(error => {
                    reject(error);
                });
            });
        },
        SetLoginInfo({
            commit,
            dispatch
        }, userInfo) { //设置登录信息，由于当前的登录逻辑中存在多学校和首次登录的验证，登录会被连续调用，故此放在用于完全验证通过后，调用，而store中login，在此不适用
            return new Promise(resolve => {
                const data = userInfo;
                Cookies.set('Admin-Token', data.token);
                commit('SET_TOKEN', data.token);
                commit('SET_USERINFO', data.userPageModel);
                commit('SET_SCHOOLINFO', data.schoolPageModel);
                commit('SET_ROLES', data.roleList);
                commit('SET_DEPARTS', data.departList);
                if (!sessionStorage.getItem("mymapKey") && Cookies.get("Admin-Token")) {
                    getSchoolMapInit().then(res => {
                        if (res.data.code === 200 && res.data.data) {
                            if (res.data.data.mapKey) {
                                sessionStorage.setItem("mymapKey", res.data.data.mapKey);
                                window._AMapSecurityConfig = {
                                    securityJsCode: res.data.data.mapSecurity,
                                }
                            } else {
                                sessionStorage.setItem("mymapKey", '');
                                window._AMapSecurityConfig = {
                                    securityJsCode: "",
                                }
                            }
                        } else {
                            sessionStorage.setItem("mymapKey", '');
                            window._AMapSecurityConfig = {
                                securityJsCode: "",
                            }
                        }
                    })
                }
                Promise.all([
                        dispatch('GetPermission', sessionStorage.getItem('pcModuleCode')),
                        dispatch('GetSchoolYear')
                    ])
                    .then(() => {
                        resolve();
                    });
            });
        },
        // 获取用户信息
        GetInfo({
            commit,
            state,
            dispatch
        }) {
            return new Promise((resolve, reject) => {
                getInfo(Cookies.get('Admin-Token')).then(response => {
                    const data = response.data.data;
                    dispatch('SetInfo', data);
                    Promise.all([
                            dispatch('GetPermission', sessionStorage.getItem('pcModuleCode')),
                            dispatch('GetSchoolYear')
                        ])
                        .then(() => {
                            resolve(response);
                        });
                }).catch(error => {
                    reject(error);
                });
            });
        },
        FromOldFramework({
            commit,
            state,
            dispatch
        }, userToken) {
            return new Promise((resolve, reject) => {
                fromOldFramework(userToken).then(response => {
                    const data = response.data.data;
                    Cookies.set('Admin-Token', data.token);
                    if (!sessionStorage.getItem("mymapKey") && Cookies.get("Admin-Token")) {
                        getSchoolMapInit().then(res => {
                            if (res.data.code === 200 && res.data.data) {
                                if (res.data.data.mapKey) {
                                    sessionStorage.setItem("mymapKey", res.data.data.mapKey);
                                    window._AMapSecurityConfig = {
                                        securityJsCode: res.data.data.mapSecurity,
                                    }
                                } else {
                                    // sessionStorage.setItem("mymapKey", '9243692cd0ebfce439a16c9ab1f4acd4');
                                    // window._AMapSecurityConfig = {
                                    //     securityJsCode: "fbdf8704c1986d9a5c878b14db1dbc98",
                                    // }
                                    sessionStorage.setItem("mymapKey", '');
                                    window._AMapSecurityConfig = {
                                        securityJsCode: "",
                                    }
                                }
                            } else {
                                sessionStorage.setItem("mymapKey", '');
                                window._AMapSecurityConfig = {
                                    securityJsCode: "",
                                }
                            }
                        })
                    }
                    dispatch('SetInfo', data);
                    Promise.all([
                            dispatch('GetPermission', sessionStorage.getItem('pcModuleCode')),
                            dispatch('GetSchoolYear')
                        ])
                        .then(() => {
                            resolve(response);
                        });
                }).catch(error => {
                    reject(error);
                });
            });
        },
        GetPermission({
            commit,
            state,
            dispatch
        }, moduleCode) {
            return new Promise((resolve, reject) => {
                permissions({
                        moduleCode
                    }).then(response => response.data)
                    .then(data => {
                        commit('SET_PERMISSIONS', data.data);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        GetSchoolYear({
            commit,
            state,
            dispatch
        }) {
            return new Promise((resolve, reject) => {
                getSchoolYear().then(response => response.data)
                    .then(data => {
                        const pageData = data.data;
                        pageData.sort((item1, item2) => {
                            return item2.id - item1.id;
                        });
                        console.log(pageData);
                        commit('SET_SCHOOLYEAR', data.data);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        SetInfo({
            commit,
            state
        }, data) {
            commit('SET_TOKEN', data.token);
            Cookies.set('Admin-Token', data.token);
            commit('SET_USERINFO', data.userPageModel);
            commit('SET_SCHOOLINFO', data.schoolPageModel);
            commit('SET_ROLES', data.roleList);
            commit('SET_DEPARTS', data.departList);
            if (!sessionStorage.getItem("mymapKey") && Cookies.get("Admin-Token")) {
                getSchoolMapInit().then(res => {
                    if (res.data.code === 200 && res.data.data) {
                        if (res.data.data.mapKey) {
                            sessionStorage.setItem("mymapKey", res.data.data.mapKey);
                            window._AMapSecurityConfig = {
                                securityJsCode: res.data.data.mapSecurity,
                            }
                        } else {
                            // sessionStorage.setItem("mymapKey", '9243692cd0ebfce439a16c9ab1f4acd4');
                            // window._AMapSecurityConfig = {
                            //     securityJsCode: "fbdf8704c1986d9a5c878b14db1dbc98",
                            // }
                            sessionStorage.setItem("mymapKey", '');
                            window._AMapSecurityConfig = {
                                securityJsCode: "",
                            }
                        }
                    } else {
                        sessionStorage.setItem("mymapKey", '');
                        window._AMapSecurityConfig = {
                            securityJsCode: "",
                        }
                    }
                })
            }
        },

        // 第三方验证登录
        LoginByThirdparty({
            commit,
            state
        }, code) {
            return new Promise((resolve, reject) => {
                commit('SET_CODE', code);
                loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
                    commit('SET_TOKEN', response.data.token);
                    Cookies.set('Admin-Token', response.data.token);
                    if (!sessionStorage.getItem("mymapKey") && Cookies.get("Admin-Token")) {
                        getSchoolMapInit().then(res => {
                            if (res.data.code === 200 && res.data.data) {
                                if (res.data.data.mapKey) {
                                    sessionStorage.setItem("mymapKey", res.data.data.mapKey);
                                    window._AMapSecurityConfig = {
                                        securityJsCode: res.data.data.mapSecurity,
                                    }
                                } else {
                                    // sessionStorage.setItem("mymapKey", '9243692cd0ebfce439a16c9ab1f4acd4');
                                    // window._AMapSecurityConfig = {
                                    //     securityJsCode: "fbdf8704c1986d9a5c878b14db1dbc98",
                                    // }
                                    sessionStorage.setItem("mymapKey", '');
                                    window._AMapSecurityConfig = {
                                        securityJsCode: "",
                                    }
                                }
                            } else {
                                sessionStorage.setItem("mymapKey", '');
                                window._AMapSecurityConfig = {
                                    securityJsCode: "",
                                }
                            }
                        })
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },


        // 登出
        LogOut({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    Cookies.remove('Admin-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Admin-Token');
                resolve();
            });
        },
        ResetPermissions({
            commit
        }, newPermissins) { //重构Permissions,用于增加二级以后的菜单（含二级）
            return new Promise(resolve => {
                commit('SET_PERMISSIONS', newPermissins);
                resolve();
            });
        }
    }
};

export default user;
