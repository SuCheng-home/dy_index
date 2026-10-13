import fetch from '@/utils/fetchNew';
import fetchs from '@/utils/fetch';
import {
    systemFetch, renlianfetch
} from '@/utils/fetch';

// 统一处理请求参数
function filterURLSearchParams(args = {}) {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}

// 判断是否已有人员库
export function isInstallFaceBase() {
    let params = new URLSearchParams();

    return fetch({
        url: 'api/faceBase/isInstallFaceBase',
        method: 'get',
        data: params
    });
}

// 初始化人员库
export function createFaceBase() {
    let params = new URLSearchParams();

    return fetch({
        url: 'sys/faceBaseManager/createFaceBase',
        method: 'get',
        data: params
    });
}

// 修改人员库
export function updateFaceBase(query) {
    let params = new URLSearchParams();
    params.append('id', query.id);
    params.append('isParentFace', query.isParentFace || 2);
    params.append('name', query.name);

    return fetch({
        url: 'sys/faceBaseManager/modifyFaceBase',
        method: 'POST',
        data: params
    });
}

// 人员库数据统计
export function getFaceDataBase() {
    let params = new URLSearchParams();
    return fetch({
        url: 'sys/faceBaseManager/getFaceDataBase',
        method: 'get',
        data: params
    });
}

// 人脸用户列表
export function getFaceUserList(query) {
    let params = new URLSearchParams();
    params.append('pageNo', query.pageNo);
    params.append('pageSize', query.pageSize);
    params.append('userName', query.userName);
    params.append('userType', query.userType);
    params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    params.append('status', query.status);
    params.append('syncStatus', query.syncStatus);

    return fetch({
        url: 'sys/faceBaseManager/getFaceUserList',
        method: 'POST',
        data: params
    });
}

// -------------------
// 添加用户人脸照片
export function addOrUpdateFaceUser(query) {
    let params = new URLSearchParams();
    params.append('imageUrl', query.imageUrl);
    params.append('userId', query.userId);

    return fetch({
        url: 'oneself/addOrUpdateFaceUser',
        method: 'POST',
        data: params
    });
}

// 添加用户人脸照片
export function addOrUpdateFaceManager(query) {
    let params = new URLSearchParams();
    params.append('imageUrl', query.imageUrl);
    params.append('userId', query.userId);

    return fetch({
        url: 'sys/faceBaseManager/addOrUpdateFaceUser',
        method: 'POST',
        data: params
    });
}

// 删除人脸用户
export function deleteFaceBaseUser(userId) {
    let params = new URLSearchParams();
    params.append('userId', userId);

    return fetch({
        url: 'sys/faceBaseManager/deleteFaceBaseUser',
        method: 'POST',
        data: params
    });
}

// 查询人脸用户
export function getFaceUserByUserId(userId) {
    let params = new URLSearchParams();
    params.append('userId', userId);

    return fetch({
        url: 'oneself/getFaceUserByUserId',
        method: 'POST',
        data: params
    });
}

// 查询人脸用户
export function getFaceUserManager(userId) {
    let params = new URLSearchParams();
    params.append('userId', userId);

    return fetch({
        url: 'sys/faceBaseManager/getFaceUserByUserId',
        method: 'POST',
        data: params
    });
}

// 删除人脸照片
export function deleteFaceImage(faceUserId) {
    let params = new URLSearchParams();
    params.append('faceUserId', faceUserId);

    return fetch({
        url: 'sys/faceBaseManager/deleteFaceImage',
        method: 'POST',
        data: params
    });
}

// 同步个人信息
export function syncUserInfo(userId) {
    let params = new URLSearchParams();
    // params.append('userId', userId);

    return fetch({
        url: 'oneself/syncInfo',
        method: 'POST',
        data: params
    });
}

// 获取课程
export function getCourseList() {
    let params = new URLSearchParams();

    return fetch({
        url: 'api/teacherClass/querySchoolAllCourse',
        method: 'get',
        data: params
    });
}

// 编辑个人信息
export function updateUserSelf(query) {
    let params = new URLSearchParams();
    params.append('birthDate', query.birthDate);
    params.append('cardId', query.cardId);
    params.append('email', query.email);
    params.append('gender', query.gender);
    // params.append('id', query.id);
    params.append('mainTeachCourse', query.mainTeachCourse);
    params.append('mobile', query.mobile);
    params.append('name', query.name);
    params.append('politicalCode', query.politicalCode);
    params.append('teacherType', query.teacherType);

    return fetch({
        url: 'oneself/updateInfo',
        method: 'POST',
        data: params
    });
}

// 用户证书
export function getDiplomaDetail(query) {
    let params = new URLSearchParams();
    params.append('teacherType', query.teacherType);
    params.append('userId', query.userId);

    return fetch({
        url: 'oneself/getDiplomaDetail',
        method: 'POST',
        data: params
    });
}

// 用户证书添加
export function addDiploma(query) {
    let params = new URLSearchParams();
    params.append('deriveTime', query.deriveTime);
    params.append('filePaths', query.filePaths);
    params.append('teacherType', query.teacherType);
    params.append('userId', query.userId);

    return fetch({
        url: 'oneself/addDiploma',
        method: 'POST',
        data: params
    });
}

// 用户证书编辑
export function updateDiploma(query) {
    let params = new URLSearchParams();
    params.append('deriveTime', query.deriveTime);
    params.append('filePaths', query.filePaths);
    params.append('teacherType', query.teacherType);
    params.append('id', query.id);

    return fetch({
        url: 'oneself/updateDiploma',
        method: 'POST',
        data: params
    });
}
// 解除绑定微信
export function removeBindingWX() {
    return systemFetch({
        url: '/oneself/removeBindingWX',
        method: 'GET'
    });
}
// 绑定微信
export function bindingWx(code) {
    let params = new URLSearchParams();
    params.append('code', code);
    return systemFetch({
        url: '/oneself/bindingWx',
        method: 'POST',
        params
    });
}
// 验证个人密码是否正确
export function verify(password) {
    let params = new URLSearchParams();
    params.append('password', password);
    return systemFetch({
        url: '/oneself/password/verify',
        method: 'POST',
        params
    });
}
// 判断用户是否绑定微信
export function isBindingWx() {
    return systemFetch({
        url: '/oneself/isBindingWx',
        method: 'GET'
    });
}
/**
 *保存骨干教师信息
 */
export function saveBackbone(query) {
    let params = new URLSearchParams();
    params.append("backboneType", query.backboneType);
    params.append("backboneTypeDate", query.backboneTypeDate);
    params.append("certificateFileId", query.certificateFileId);
    params.append("certificateFileUrl", query.certificateFileUrl);
    params.append("id", query.id);
    params.append("userId", query.userId);
    params.append("userType", query.userType);
    return fetchs({
        url: 'structure/cadreTeacher/saveBackbone',
        method: 'post',
        params
    });
}
/**
 * 查询用户骨干信息
 */
export function getUserBackboneInfo(userId) {
    let params = new URLSearchParams();
    params.append("userId", userId);
    return fetchs({
        url: 'structure/cadreTeacher/getUserBackboneInfo',
        method: 'post',
        params
    });
}
/**
 *获得教师类别列表
 */
export function getTeacherTypeList() {
    return fetchs({
        url: 'structure/cadreTeacher/getTeacherTypeList',
        method: 'post',
    });
}
/**
 *获得骨干教师类型列表
 */
export function getBackboneTypeList() {
    return fetchs({
        url: 'structure/cadreTeacher/getBackboneTypeList',
        method: 'post',
    });
}

// 删除校友人脸照片
export const delAlumnusFace = () =>
    systemFetch({
        url: 'sys/faceBaseManager/delAlumnusFace',
        method: 'GET',
    })

export function queryFaceUserImageArchive(query) {
    let params = new URLSearchParams();
    params.append('classId', query.classId);
    params.append('gradeId', query.gradeId);
    params.append('userName', query.userName);
    params.append('userType', query.userType);

    return fetch({
        url: 'sys/faceBaseManager/queryFaceUserImageArchive',
        method: 'GET',
        params
    });

}

export function setFaceBase(args) {
    let params = new URLSearchParams();
    params.append('clientId', args.clientId);
    params.append('deviceType', args.deviceType);
    params.append('id', args.id);
    params.append('secret', args.secret);
    params.append('userType', args.userType);
    params.append('key', args.key);

    return fetch({
        url: 'sys/faceBaseManager/setFaceBase',
        method: 'GET',
        params
    });
}
export function uploadBatchFace(uploadNum, userType) {
    let params = new URLSearchParams();
    params.append('uploadNum', uploadNum);
    params.append('userType', userType);
    return systemFetch({
        url: '/sys/faceBaseManager/uploadBatchFace',
        method: 'get',
        params
    });
}