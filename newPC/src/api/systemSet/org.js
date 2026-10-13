/*
 * @Author: ZQ
 * @Date: 2017-10-30 15:41:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-09 20:24:20
 */
import {
    getAxiosService,
    systemFetch
} from '@/utils/fetch';
import fetch from '@/utils/fetch';

const orgFetch = getAxiosService({
    baseURL: global.command === 'production' ? 'https://www.zhxiaoyuan.cn/ucenter-web/' : 'https://www.weixiaojia.net/ucenter-web/',
    timeout: 60000,
});

/**
 * 获得所有部门，返回Tree列表
 */
export function queryDeparts() {
    return orgFetch({
        url: 'sys/depart/queryDeparts',
        method: 'post'
    });
}

/**
 * 分页获得部门下的用户列表
 * @param {*} listQuery
 */
export function getUserList(listQuery) {
    let params = new URLSearchParams();
    params.append('filterStatus', listQuery.filterStatus);
    params.append('id', listQuery.id); //部门id
    params.append('isIncludeChild', listQuery.isIncludeChild);
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchVal', listQuery.searchVal);
    params.append('type', listQuery.type);
    return orgFetch({
        url: 'sys/user/list',
        method: 'post',
        data: params
    });
}

/**
 * 获得年级列表
 * @param {*}
 */
export function querySchoolGrade(isFilterNewGrade) {
    let params = new URLSearchParams();
    params.append('isFilterNewGrade', isFilterNewGrade);
    return orgFetch({
        url: 'api/depart/querySchoolGrade',
        method: 'POST',
        data: params
    });
}

/**
 * 新增部门
 * @param {*} query
 */
export function departAdd(query) {
    let params = new URLSearchParams();
    params.append('code', query.code);
    params.append('name', query.name);
    params.append('order', query.order);
    params.append('pid', query.pid);
    params.append('type', query.type);
    if (query.wxDepartId) {
        params.append('wxDepartId', query.wxDepartId);
    }
    if (query.learningStages) {
        params.append('learningStages', query.learningStages);
    }
    if (query.learnYear) {
        params.append('learnYear', query.learnYear);
    }
    params.append('standardGrade', query.standardGrade);
    return orgFetch({
        url: 'sys/depart/add',
        method: 'post',
        data: params
    });
}

/**
 * 修改部门
 * @param {*} query
 */
export function departUpdate(query) {
    let params = new URLSearchParams();
    params.append('code', query.code);
    params.append('name', query.name);
    params.append('order', query.order);
    params.append('id', query.id);
    params.append('wxDepartId', query.wxDepartId);
    if (query.learnYear) {
        params.append('learnYear', query.learnYear);
    }

    return orgFetch({
        url: 'sys/depart/update',
        method: 'post',
        data: params
    });
}


/**
 * 根据id获取部门详情
 * @param {*} id
 */
export function queryDepartById(id) {
    let params = new URLSearchParams();
    params.append('id', id);
    return orgFetch({
        url: 'api/depart/queryDepartById',
        method: 'post',
        data: params
    });
}

/**
 * 根据ID获得其他负责人
 * @param {*} id
 */
export function queryOtherManager(id) {
    let params = new URLSearchParams();
    params.append('departId', id);
    return orgFetch({
        url: 'api/depart/queryOtherManager',
        method: 'post',
        data: params
    });
}

/**
 * 获取部门信息和负责人信息
 * @param {*} id
 */
export function getDeptInAndMaster(id) {
    let params = new URLSearchParams();
    params.append('departId', id);
    return orgFetch({
        url: 'sys/depart/getDeptInAndMaster',
        method: 'post',
        data: params
    });
}

/**
 * 根据ID获得负责人
 * @param {*} id
 */
export function queryManager(id) {
    let params = new URLSearchParams();
    params.append('departId', id);
    return orgFetch({
        url: 'api/depart/queryManager',
        method: 'post',
        data: params
    });
}

/**
 * 删除老师/校外
 * @param {*} sourceArray
 */
export function deleteTeacher(sourceArray) {
    let userIds = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            userIds += item.id + ',';
        } else {
            userIds += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('userIds', userIds);
    return orgFetch({
        url: 'sys/user/deleteTeacher',
        method: 'post',
        data: params
    });
}

/**
 * 将一个或多个用户移动到至少一个部门中
 * @param {*} sourceArray
 */
export function moveTeacher(sourceArray, selectedDepartArray) {
    let loginnames = '';
    let userIds = '';
    let selectedDepartIds = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            loginnames += item.loginname + ',';
            userIds += item.id + ',';
        } else {
            loginnames += item.loginname;
            userIds += item.id;
        }
    }
    for (let i = 0; i < selectedDepartArray.length; i++) {
        let item = selectedDepartArray[i];
        if (i < selectedDepartArray.length - 1) {
            selectedDepartIds += item.id + ',';
        } else {
            selectedDepartIds += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('loginnames', loginnames);
    params.append('userIds', userIds);
    params.append('selectedDepartIds', selectedDepartIds);
    return orgFetch({
        url: 'sys/user/moveTeacher',
        method: 'post',
        data: params
    });
}

/**
 * 移动校友
 * @param {*} sourceArray
 */
export function moveSchoolfellow(sourceArray, selectedDepartArray) {
    let loginnames = '';
    let ids = '';
    let selectDepartId = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            loginnames += item.loginname + ',';
            ids += item.id + ',';
        } else {
            loginnames += item.loginname;
            ids += item.id;
        }
    }
    for (let i = 0; i < selectedDepartArray.length; i++) {
        let item = selectedDepartArray[i];
        if (i < selectedDepartArray.length - 1) {
            selectDepartId += item.id + ',';
        } else {
            selectDepartId += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('loginnames', loginnames);
    params.append('ids', ids);
    params.append('selectDepartId', selectDepartId);
    return orgFetch({
        url: 'sys/user/moveSchoolfellow',
        method: 'post',
        data: params
    });
}

/**
 * 同步部门下子部门和用户
 * @param {*} departId
 * @param {*} wxDepartId
 */
export function syncDepartAndUser(departId, wxDepartId) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('wxDepartId', wxDepartId);
    return orgFetch({
        url: 'sys/user/sync/departAndUser',
        method: 'post',
        data: params
    });
}

/**
 * 同步部门
 * @param {*} departId
 */
export function syncDepart(departId) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    return orgFetch({
        timeout: 300000,
        url: 'sys/sync/depart',
        method: 'post',
        data: params
    });
}

/**
 * 同步用户
 * @param {*} departId
 * @param {*} type
 */
export function syncUser(departId, type) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('type', type);
    return orgFetch({
        url: 'sys/sync/user',
        method: 'post',
        data: params
    });
}

/**
 * 移除老师/校外
 * @param {*} departId
 * @param {*} userIds
 */
export function removeTeacherDepart(sourceArray, departId) {
    let userIds = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            userIds += item.id + ',';
        } else {
            userIds += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('userIds', userIds);
    return orgFetch({
        url: 'sys/user/removeTeacherDepart',
        method: 'post',
        data: params
    });
}

/**
 * 老师成为流出用户
 * @param {*} sourceArray
 * @param {*} selectedDepartId
 */
export function outflowTeacher(sourceArray, selectedDepartId) {
    let ids = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            ids += item.id + ',';
        } else {
            ids += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('selectedDepartId', selectedDepartId);
    params.append('ids', ids);
    return orgFetch({
        url: 'sys/user/outflowTeacher',
        method: 'post',
        data: params
    });
}

/**
 * 可以启用或禁用，老师、校外用户、流入用户
 * @param {*} loginname
 * @param {*} userId
 * @param {*} way
 */
export function enableUser(loginname, userId, way) {
    let params = new URLSearchParams();
    params.append('loginname', loginname);
    params.append('userId', userId);
    params.append('way', way);
    return orgFetch({
        url: 'sys/user/enableUser',
        method: 'post',
        data: params
    });
}

/**
 * 老师：获得基本信息、所在部门、角色、发布范围，以及其他职业等信息 学生：获得基本信息、家长列表
 * @param {*} userId
 * @param {*} userType
 * @param {*} convertConstant
 */
export function getdetail(userId, userType, convertConstant) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('userType', userType);
    params.append('convertConstant', convertConstant);
    return orgFetch({
        url: 'sys/user/detail',
        method: 'post',
        data: params
    });
}
export function getdetailBoe(userId, userType, convertConstant) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('userType', userType);
    params.append('convertConstant', convertConstant);
    return orgFetch({
        url: 'sys/user/detail',
        method: 'get',
        params
    });
}

/**
 * 老师：获得基本信息、所在部门、角色、发布范围，以及其他职业等信息 学生：获得基本信息、家长列表
 * @param {*} convertConstant
 */
export function getSelfDetail(convertConstant) {
    let params = new URLSearchParams();
    params.append('convertConstant', convertConstant);
    const convertConstantNum = convertConstant || 1;
    return orgFetch({
        url: 'oneself/detail?convertConstant=' + convertConstantNum,
        method: 'get',
        data: params
    });
}

/**
 * 获得学校下可选的角色
 */
export function getAllRoleList() {
    let params = new URLSearchParams();
    params.append('isChoose', 0);
    return orgFetch({
        url: 'api/role/queryList',
        method: 'post',
        data: params
    });
}

/**
 * 获得用户具备的角色
 * @param {*} userId
 */
export function getRoleListByUserId(userId) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    return orgFetch({
        url: 'api/user/role/queryRoleList',
        method: 'post',
        data: params
    });
}

/**
 * 获得用户具备的角色
 * @param {*} userId
 */
export function queryRoleAndModuleByUserId(query) {
    let params = new URLSearchParams();
    params.append('userId', query.userId);
    params.append('source', query.source);
    return orgFetch({
        url: 'sys/user/queryRoleAndModuleBySchoolId',
        method: 'POST',
        data: params
    });
}

/**
 * 获得用户具备的角色
 * @param {*} userId
 */
export function queryRoleAndModuleBySchoolId() {
    let params = new URLSearchParams();
    return orgFetch({
        url: 'oneself/queryRoleAndModuleBySchoolId',
        method: 'post',
        data: params
    });
}

// 新增老师/校外
export function addTeacher(query) {
    // let params = new URLSearchParams();
    // params.append('birthDate', query.birthDate);
    // params.append('cardId', query.cardId);
    // params.append('cardType', query.cardType);
    // params.append('gender', query.gender);
    // params.append('mobile', query.mobile);
    // params.append('name', query.name);
    // params.append('peopleState', query.peopleState);
    // params.append('position', query.position);
    // params.append('source', query.source);
    // params.append('username', query.username);
    // params.append('peopleSchoolState', query.peopleSchoolState);
    // params.append('departIds', query.departIds);
    // params.append('releaseDepartIds', query.releaseDepartIds);
    // params.append('roleIds', query.roleIds);
    // params.append('loginname', query.loginname);

    // return orgFetch({
    //     url: 'sys/user/addTeacher',
    //     method: 'post',
    //     data: params
    // });
    return orgFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'sys/user/addTeacher',
        method: 'POST',
        data: JSON.stringify(query)
    });
}


/**
 * 局端 新增 老师
 */
export function addTeacherBoe(query) {
    let params = new URLSearchParams();
    params.append('birthDate', query.birthDate);
    params.append('cardId', query.cardId);
    params.append('education', query.education);
    params.append('email', query.email);
    params.append('gender', query.gender);
    params.append('honoraryTitle', query.honoraryTitle);
    params.append('mainTeachCourse', query.mainTeachCourse);
    params.append('mobile', query.mobile);
    params.append('name', query.name);
    params.append('peopleState', query.peopleState);
    params.append('politicalCode', query.politicalCode);
    params.append('position', query.position);
    params.append('professionalTitle', query.professionalTitle);
    params.append('regdPopulation', query.regdPopulation);
    params.append('source', query.source);
    params.append('teachCourses', query.teachCourses);
    params.append('teacherType', query.teacherType);
    params.append('username', query.username);
    params.append('departIds', query.departIds);
    params.append('eduGrantJson', query.eduGrantJson); //局端地址簿
    params.append('roleIds', query.roleIds);
    return orgFetch({
        url: 'sys/user/addTeacher',
        method: 'post',
        data: params
    });
}

//eduGrantJson    releaseDepartIds

/**
 * 修改老师/校外
 * @param {*} query
 */
export function updateTeacher(query) {
    // let params = new URLSearchParams();
    // params.append('id', query.id);

    // params.append('birthDate', query.birthDate);
    // params.append('cardId', query.cardId);
    // params.append('cardType', query.cardType);
    // params.append('gender', query.gender);
    // params.append('mobile', query.mobile);
    // params.append('name', query.name);
    // params.append('peopleState', query.peopleState);
    // params.append('peopleSchoolState', query.peopleSchoolState);
    // params.append('position', query.position);
    // params.append('username', query.username);
    // params.append('departIds', query.departIds);
    // params.append('releaseDepartIds', query.releaseDepartIds);
    // params.append('roleIds', query.roleIds);
    // return orgFetch({
    //     url: 'sys/user/updateTeacher',
    //     method: 'post',
    //     data: params
    // });
    return orgFetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'sys/user/updateTeacher',
        method: 'POST',
        data: JSON.stringify(query)
    });
}


/**
 * 局端 编辑  人员
 */
export function updateTeacherBoe(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('birthDate', query.birthDate);
    params.append('cardId', query.cardId);
    params.append('education', query.education);
    params.append('email', query.email);
    params.append('gender', query.gender);
    params.append('honoraryTitle', query.honoraryTitle);
    params.append('mainTeachCourse', query.mainTeachCourse);
    params.append('mobile', query.mobile);
    params.append('name', query.name);
    params.append('peopleState', query.peopleState);
    params.append('politicalCode', query.politicalCode);
    params.append('position', query.position);
    params.append('professionalTitle', query.professionalTitle);
    params.append('regdPopulation', query.regdPopulation);
    //params.append('source', query.source);
    params.append('teachCourses', query.teachCourses);
    params.append('teacherType', query.teacherType);
    params.append('username', query.username);
    params.append('departIds', query.departIds);
    params.append('eduGrantJson', query.eduGrantJson); //局端地址簿
    params.append('roleIds', query.roleIds);
    return orgFetch({
        url: 'sys/user/updateTeacher',
        method: 'post',
        data: params
    });
}

/**
 * 管理员重置用户的密码
 * @param {*} userId
 * @param {*} newPass
 */
export function resetPass(userId, newPass) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('newPwd', newPass);
    return orgFetch({
        url: 'sys/user/password/reset',
        method: 'post',
        data: params
    });
}


/**
 * 移动学生到其他班级，家长跟随变动
 * @param {*} sourceArray
 */
export function moveStudent(sourceArray, selectedDepartArray) {
    let names = '';
    let ids = '';
    let selectedDepartId = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            names += item.name + ',';
            ids += item.id + ',';
        } else {
            names += item.name;
            ids += item.id;
        }
    }
    for (let i = 0; i < selectedDepartArray.length; i++) {
        let item = selectedDepartArray[i];
        if (i < selectedDepartArray.length - 1) {
            selectedDepartId += item.id + ',';
        } else {
            selectedDepartId += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('names', names);
    params.append('ids', ids);
    params.append('selectedDepartId', selectedDepartId);
    return orgFetch({
        url: 'sys/user/moveStudent',
        method: 'post',
        data: params
    });
}

/**
 * 新增学生
 * @param {*} query
 */
export function addStudent(args) {
    let params = new URLSearchParams();
    params.append('birthDate', args.birthDate);
    params.append('gender', args.gender);
    params.append('departId', args.departId);
    params.append('name', args.name);
    params.append('learnNum', args.learnNum);
    params.append('wxDepartId', args.wxDepartId);
    params.append('cardId', args.cardId);
    params.append('cardType', args.cardType);
    params.append('learnJi', args.learnJi);
    params.append('regdPopulation', args.regdPopulation);

    return orgFetch({
        url: 'sys/user/addStudent',
        method: 'POST',
        data: params
    });
}

/**
 * 修改学生
 * @param {*} query
 */
export function updateStudent(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    params.append('birthDate', args.birthDate);
    params.append('gender', args.gender);
    params.append('departId', args.departId);
    params.append('name', args.name);
    params.append('learnNum', args.learnNum);
    params.append('wxDepartId', args.wxDepartId);
    params.append('cardId', args.cardId);
    params.append('cardType', args.cardType);
    params.append('learnJi', args.learnJi);
    params.append('regdPopulation', args.regdPopulation);
    params.append('avatar', args.avatar);

    return orgFetch({
        url: 'sys/user/updateStudent',
        method: 'POST',
        data: params
    });
}

/**
 * 删除学生
 * @param {*} sourceArray
 */
export function deleteStudent(sourceArray) {
    let names = '';
    let userIds = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            names += item.name + ',';
            userIds += item.id + ',';
        } else {
            names += item.name;
            userIds += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('names', names);
    params.append('userIds', userIds);
    return orgFetch({
        url: 'sys/user/deleteStudent',
        method: 'post',
        data: params
    });
}

/**
 * 删除部门
 * @param {*} departId
 * @param {*} wxDepartId
 */
export function deleteDepart(query) {
    let params = new URLSearchParams();
    params.append('departId', query.departId);
    params.append('wxDepartId', query.wxDepartId);
    return orgFetch({
        url: 'sys/depart/delete',
        method: 'post',
        data: params
    });
}
export function deleteWxGrade(departId) {
    let params = new URLSearchParams();
    params.append('gradeId', departId);
    return orgFetch({
        url: 'sys/schoolfellow/deleteWxGrade',
        method: 'get',
        params
    });
}


/**
 * 移动班级到其他年级
 * @param {*} sourceArray
 */
export function moveClassToGrade(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('otherDepartId', args.otherDepartId);
    return orgFetch({
        url: 'sys/depart/move',
        method: 'post',
        data: params
    });
}

/**
 * 移动班级到其他年级
 */
export function getQrCodeUrl(args) {
    let params = new URLSearchParams();
    params.append('type', args.type);
    return orgFetch({
        url: 'sys/user/export/getQrCodeUrl',
        method: 'post',
        data: params
    });
}

/**
 * 根据学生查家长
 * @param {*} childId
 */
export function queryParent(childId) {
    let params = new URLSearchParams();
    params.append('childId', childId);
    return orgFetch({
        url: 'sys/user/queryParent',
        method: 'post',
        data: params
    });
}
/**
 *  区端根据学生查家长
 * @param {*} childId
 */
export function queryParentBoe(childId) {
    let params = new URLSearchParams();
    params.append('childId', childId);
    return orgFetch({
        url: 'edu/schoolEdu/queryParent',
        method: 'post',
        data: params
    });
}
/**
 * 新增家长
 * @param {*} query
 */
export function addParent(query) {
    let params = new URLSearchParams();
    params.append('gender', query.gender);
    params.append('mobile', query.mobile);
    params.append('nick', query.nick);
    params.append('studentId', query.studentId);
    params.append('studentName', query.studentName);
    params.append('parentName', query.parentName); //家长姓名
    params.append('cardId', query.cardId); //身份证
    params.append('education', query.education); //学历
    params.append('parentUnit', query.parentUnit); //单位
    params.append('parentPosition', query.parentPosition); //职务
    params.append('externalUserid', query.externalUserid); //职务
    params.append('address', query.address); //职务

    return orgFetch({
        url: 'sys/user/addParent',
        method: 'post',
        data: params
    });
}

/**
 * 修改家长
 * @param {*} query
 */
export function updateParent(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('gender', query.gender);
    params.append('mobile', query.mobile);
    params.append('nick', query.nick);
    params.append('studentId', query.studentId);
    params.append('studentName', query.studentName);
    params.append('parentName', query.parentName); //家长姓名
    params.append('cardId', query.cardId); //身份证
    params.append('education', query.education); //学历
    params.append('parentUnit', query.parentUnit); //单位
    params.append('parentPosition', query.parentPosition); //职务
    params.append('externalUserid', query.externalUserid); //职务
    params.append('address', query.address); //职务

    return orgFetch({
        url: 'sys/user/updateParent',
        method: 'post',
        data: params
    });
}

/**
 * 删除家长
 * @param {*} query
 */
export function deleteParent(query) {
    let params = new URLSearchParams();
    params.append('parentId', query.parentId);
    params.append('studentId', query.studentId);
    return orgFetch({
        url: 'sys/user/deleteParent',
        method: 'post',
        data: params
    });
}

/**
 * 流出用户回到老师
 * @param {*} sourceArray
 * @param {*} selectedDepartArray
 */
export function outflowTeacherEnd(sourceArray, selectedDepartId) {
    let ids = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            ids += item.id + ',';
        } else {
            ids += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('selectedDepartId', selectedDepartId);
    params.append('ids', ids);
    return orgFetch({
        url: 'sys/user/outflowTeacherEnd',
        method: 'post',
        data: params
    });
}

/**
 * 工具方法
 */

/**
 * 根据数据返回id集合
 * @param {*} data
 */
export function getIdsByArrayData(data) {
    let ids = '';
    if (data) {
        ids = data.map(function (item) {
            return item.id
        }).toString();
    }

    return ids;
}

/**
 * 根据部门id获取父部门id
 * @param {*} source
 * @param {*} id
 */
export function getPidByid(source, id) {
    let currentDepart = source.filter(function (item) {
        return item.id == id;
    });
    let parentDepart = source.filter(function (item) {
        return item.id == currentDepart[0].pId;
    });

    return parentDepart[0];
}

/**
 * 删除校友
 * @param {*} sourceArray
 */
export function deleteSchoolfellow(sourceArray) {
    let loginnames = '';
    let userIds = '';
    for (let i = 0; i < sourceArray.length; i++) {
        let item = sourceArray[i];
        if (i < sourceArray.length - 1) {
            loginnames += item.loginname + ',';
            userIds += item.id + ',';
        } else {
            loginnames += item.loginname;
            userIds += item.id;
        }
    }
    let params = new URLSearchParams();
    params.append('loginnames', loginnames);
    params.append('userIds', userIds);
    return orgFetch({
        url: 'sys/user/deleteSchoolfellow',
        method: 'post',
        data: params
    });

}
/**
 * 删除民族
 */
export function getNation(query) {
    let params = new URLSearchParams();
    params.append('dicCode', query.dicCode);
    return fetch({
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        data: params
    });
}

/**
 * 展示导入学生进度
 * @param {*}
 */
export function importSchedule(importFlag) {
    let params = new URLSearchParams();
    params.append('importFlag', importFlag);
    return orgFetch({
        url: 'sys/user/import/student/importSchedule',
        method: 'post',
        data: params
    });

}

/**
 * 展示导入学生进度
 * @param {*}
 */
export function importResult(importFlag) {
    let params = new URLSearchParams();
    params.append('importFlag', importFlag);
    return orgFetch({
        url: 'sys/user/import/student/importResult',
        method: 'post',
        data: params
    });

}

// ==============================================================
// 获得用户信息
export function getUserDetail({
    userId,
    userType,
    convertConstant
}) {
    let params = new URLSearchParams();
    params.append('userId', userId);
    params.append('userType', userType);
    params.append('convertConstant', convertConstant);
    return orgFetch({
        url: 'sys/user/detail',
        method: 'post',
        data: params
    });
}
// 查看老师档案
export function getUserDetailArchive({
    userId
}) {
    let params = new URLSearchParams();
    params.append('userId', userId);

    return orgFetch({
        url: 'sys/user/teaArchiveDetail',
        method: 'GET',
        params
    });
}
// 新增或修改老师档案信息
export function addOrUpdateTeaArchive(args) {
    let params = new URLSearchParams();
    params.append('degree', args.degree);
    params.append('education', args.education);
    params.append('honoraryTitle', args.honoraryTitle);
    params.append('nation', args.nation);
    params.append('nativenPlace', args.nativenPlace);
    params.append('politicalCode', args.politicalCode);
    params.append('professionalTitle', args.professionalTitle);
    params.append('userId', args.userId);
    params.append('teachDate', args.teachDate);
    params.append('isPermission', args.isPermission);
    params.append('major', args.major);
    params.append('teacherOrg', args.teacherOrg);
    params.append('certificateType', args.certificateType);
    params.append('certificateNum', args.certificateNum);

    return orgFetch({
        url: 'sys/user/addOrUpdateTeaArchive',
        method: 'POST',
        data: params
    });
}
// 查询学生档案
export function getStuDetailArchive({
    userId
}) {
    let params = new URLSearchParams();
    params.append('userId', userId);

    return orgFetch({
        url: 'sys/user/stuArchiveDetail',
        method: 'GET',
        params
    });
}
// 新增或修改学生档案信息
export function addOrUpdateStuArchive(args) {
    let params = new URLSearchParams();
    params.append('nation', args.nation);
    params.append('nativenPlace', args.nativenPlace);
    params.append('nationality', args.nationality);
    params.append('hk_tw_macao', args.hk_tw_macao);
    params.append('birthPlace', args.birthPlace);
    params.append('nonAgriculture', args.nonAgriculture);
    params.append('accountNature', args.accountNature);
    params.append('bloodType', args.bloodType);
    params.append('address', args.address);
    params.append('startSchoolDate', args.startSchoolDate);
    params.append('attendSchoolType', args.attendSchoolType);
    params.append('disabilityChildType', args.disabilityChildType);
    params.append('isOrphan', args.isOrphan);
    params.append('isOnlyChild', args.isOnlyChild);
    params.append('isStayChild', args.isStayChild);
    params.append('isMigrantMorker', args.isMigrantMorker);
    params.append('healthType', args.healthType);
    params.append('isDisabilityChild', args.isDisabilityChild);
    params.append('politicalCode', args.politicalCode);
    params.append('houseRegistration', args.houseRegistration);
    params.append('idPhoto', args.idPhoto);
    params.append('userId', args.userId);

    return orgFetch({
        url: 'sys/user/addOrUpdateStuArchive',
        method: 'POST',
        data: params
    });
}

// 导出用户二维码
export function exportUserQrcode(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);

    return orgFetch({
        url: 'sys/user/export/exportUserQrcode',
        method: 'GET',
        params
    });
}

// 修改用户名
export function updateLoginname(args) {
    let params = new URLSearchParams();
    params.append('loginname', args.loginname);
    params.append('userId', args.userId);
    params.append('onlyModifySys', args.onlyModifySys);
    return orgFetch({
        url: 'sys/user/updateLoginname',
        method: 'POST',
        data: params
    });
}

// 档案日志列表页
export function logList(args) {
    let params = new URLSearchParams();
    params.append('userName', args.userName);
    params.append('userType', args.userType);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);

    return orgFetch({
        url: 'sys/userLog/logList',
        method: 'POST',
        data: params
    });
}

//根据用户姓名，添加至指定部门
export function addUsersByDepart(args) {
    let params = new URLSearchParams();
    params.append('departId', args.departId);
    params.append('userNames', args.userNames);

    return orgFetch({
        url: 'sys/user/addUsersByDepart',
        method: 'POST',
        data: params
    });
}

// 批量新增班级
export function addBatch(args) {
    let params = new URLSearchParams();
    params.append('num', args.num);
    params.append('order', args.order);
    params.append('pid', args.pid);

    return orgFetch({
        url: 'sys/depart/addBatch',
        method: 'POST',
        data: params
    });
}

// 获取order
export function getOrder(args) {
    let params = new URLSearchParams();
    params.append('pid', args.pid);

    return orgFetch({
        url: 'sys/depart/getOrder',
        method: 'GET',
        params
    });
}
// 获取失败信息
export function downloadGuideManagerResultXls(args) {
    let params = new URLSearchParams();
    params.append('errorInfoStr', args.errorInfoStr);
    params.append('token', args.token);
    return fetch({
        url: 'structure/guide/downloadGuideManagerResultXls',
        method: 'POST',
        data: params
    });
}
// 显示导入老师进度
export function importTeacherSchedule(args) {
    let params = new URLSearchParams();
    params.append('importFlag', args);
    return systemFetch({
        url: 'sys/user/import/teacher/importSchedule',
        method: 'GET',
        params
    });
}
// 显示导入老师结果
export function importTeacherResult(args) {
    let params = new URLSearchParams();
    params.append('importFlag', args);
    return systemFetch({
        url: 'sys/user/import/teacher/importResult',
        method: 'GET',
        params
    });
}
// 显示导入老师结果
export function isExistSyncFailData(args) {
    let params = new URLSearchParams();
    params.append('eventType', args.eventType);
    params.append('schoolId', args.schoolId);

    return systemFetch({
        url: 'pushRecordLog/isExistSyncFailData',
        method: 'GET',
        params
    });
}
// 日志列表页
export function pushRecordLogList(args) {
    let params = new URLSearchParams();
    params.append('appName', args.appName);
    params.append('startDateTime', args.startDateTime);
    params.append('endDateTime', args.endDateTime);
    params.append('httpResultCode', args.httpResultCode);
    params.append('messageId', args.messageId);
    params.append('schoolName', args.schoolName);
    params.append('operationType', args.operationType);
    params.append('result', args.result);
    params.append('pageNo', args.pageNo);
    params.append('pageSize', args.pageSize);
    params.append('eventType', args.eventType);
    params.append('serachContentVal', args.serachContentVal);

    return systemFetch({
        url: 'pushRecordLog/list',
        method: 'POST',
        data: params
    })
}

// 重试
export function retryPush(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return systemFetch({
        url: 'pushRecordLog/retryPush',
        method: 'GET',
        params
    })
}

// 已处理
export function updatePushtState(args) {
    let params = new URLSearchParams();
    params.append('id', args.id);

    return systemFetch({
        url: 'pushRecordLog/updatePushtState',
        method: 'GET',
        params
    })
}
export function updateInitGradeClass(args) {
    let params = new URLSearchParams();
    params.append('classCount', args.classCount);
    params.append('gradeCount', args.gradeCount);
    params.append('learningStages', args.learningStages);
    params.append('pid', args.pid);

    return systemFetch({
        url: 'sys/depart/updateInitGradeClass',
        method: 'POST',
        data: params
    })
}

export function updateSync(departId, type) {
    let params = new URLSearchParams();
    params.append('departId', departId);
    params.append('type', type);
    return orgFetch({
        url: 'sys/sync/depart/updateSync',
        method: 'GET',
        params
    });
}


export function importSchedulefun(importMarkId) {
    let params = new URLSearchParams();
    params.append('importMarkId', importMarkId);
    return orgFetch({
        url: 'sys/user/import/common/importSchedule',
        method: 'post',
        data: params
    });

}

export function downloadResultXls(importMarkId) {
    let params = new URLSearchParams();
    params.append('importMarkId', importMarkId);
    return orgFetch({
        url: 'sys/user/import/common/downloadResultXls',
        method: 'post',
        data: params
    });

}
