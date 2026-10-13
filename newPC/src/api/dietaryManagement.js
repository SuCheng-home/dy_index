import fetch from '@/utils/fetch';
//分页获取学校食谱
export function querySchoolMenu(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchName);  
    return fetch({
        url: 'structure/dietary/querySchoolMenu',
        method: 'post',
        data: params
    });
}
//删除食谱
export function deleteSchoolMenu(menuIds) {
    let params = new URLSearchParams();
    params.append('menuIds', menuIds); 
    return fetch({
        url: 'structure/dietary/deleteSchoolMenu',
        method: 'get',
        params
    });
}
//食谱审核设置
export function menuAuditSet() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/dietary/menuAuditSet',
        method: 'get'
    });
}
//保存审核设置
export function saveAuditUserSet(listQuery) {
    let params = new URLSearchParams();
    params.append('auditUserStr', listQuery.auditUserStr);
    params.append('needAudit', listQuery.needAudit);
    params.append('needPushTeacher', listQuery.needPushTeacher); 
    params.append('schoolId', listQuery.schoolId); 
    return fetch({
        url: 'structure/dietary/saveAuditUserSet',
        method: 'post',
        data: params
    });
}
//专家食谱列表
export function publicMenuList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/dietary/publicMenuList?isShow=1',
        method: 'get'
    });
}
//专家食谱的详情
export function publicMenuDetails(menuId) {
    let params = new URLSearchParams();
    params.append('menuId', menuId); 
    return fetch({
        url: 'structure/dietary/publicMenuDetails',
        method: 'get',
        params
    });
}
//分页获取系统食谱
export function queryFoodList(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchName); 
    params.append('typeId', listQuery.typeId); 
    return fetch({
        url: 'structure/dietary/queryFoodList',
        method: 'post',
        data: params
    });
}
//根据字典code获得字典数据
export function findDicsByCode(dicCode){
    let params = new URLSearchParams();
    params.append('dicCode', dicCode);
    return fetch({
        url: 'structure/sysDictionary/findDicsByCode',
        method: 'post',
        data: params
    });
}
//食物详情
export function foodDetails(id) {
    let params = new URLSearchParams();
    params.append('id', id); 
    return fetch({
        url: 'structure/dietary/foodDetails',
        method: 'get',
        params
    });
}
//新增食谱
export function insertSchoolMenu(listQuery) {
    let params = new URLSearchParams();
    params.append('mondayFoodStr', listQuery.mondayFoodStr);
    params.append('tuesdayFoodStr', listQuery.tuesdayFoodStr);
    params.append('wednesdayFoodStr', listQuery.wednesdayFoodStr); 
    params.append('thursdayFoodStr', listQuery.thursdayFoodStr);
    params.append('fridayFoodStr', listQuery.fridayFoodStr); 
    params.append('saturdayFoodStr', listQuery.saturdayFoodStr);
    params.append('sundayFoodStr', listQuery.sundayFoodStr);
    params.append('dietMenuWeek', listQuery.dietMenuWeek);
    params.append('name', listQuery.name);
    params.append('showMenu', listQuery.showMenu);
    params.append('schoolTimeName	', listQuery.schoolTimeName	);
    params.append('schoolTimeId', listQuery.schoolTimeId);
    return fetch({
        url: 'structure/dietary/insertSchoolMenu',
        method: 'post',
        data: params
    });
}
//编辑食谱
export function updateSchoolMenu(listQuery) {
    let params = new URLSearchParams();
    params.append('mondayFoodStr', listQuery.mondayFoodStr);
    params.append('tuesdayFoodStr', listQuery.tuesdayFoodStr);
    params.append('wednesdayFoodStr', listQuery.wednesdayFoodStr); 
    params.append('thursdayFoodStr', listQuery.thursdayFoodStr);
    params.append('fridayFoodStr', listQuery.fridayFoodStr); 
    params.append('saturdayFoodStr', listQuery.saturdayFoodStr);
    params.append('sundayFoodStr', listQuery.sundayFoodStr);
    params.append('dietMenuWeek', listQuery.dietMenuWeek);
    params.append('name', listQuery.name);
    params.append('showMenu', listQuery.showMenu);
    params.append('schoolTimeName	', listQuery.schoolTimeName	);
    params.append('schoolTimeId', listQuery.schoolTimeId);
    params.append('id', listQuery.id);
    return fetch({
        url: 'structure/dietary/updateSchoolMenu',
        method: 'post',
        data: params
    });
}
//学校食谱详情页面
export function schoolMenuDetails(menuId) {
    let params = new URLSearchParams();
    params.append('menuId', menuId); 
    return fetch({
        url: 'structure/dietary/schoolMenuDetails',
        method: 'get',
        params
    });
}
//查询周次列表
export function getSeveralWeekList() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/schoolTime/getSeveralWeekList',
        method: 'get'
    });
}
//查询学校所有学期列表
export function getCurrentSchoolTimeBySchoolId() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'get'
    });
}
//获取系统菜品并携带菜品类型设置的量
export function chooseSchoolFoodAndCount(searchName,typeId) {
    let params = new URLSearchParams();
    params.append('searchName', searchName); 
    params.append('typeId', typeId);
    return fetch({
        url: 'structure/dietary/chooseSchoolFoodAndCount',
        method: 'get',
        params
    });
}
//发布食谱
export function showSchoolMenu(menuId) {
    let params = new URLSearchParams();
    params.append('menuId', menuId); 
    return fetch({
        url: 'structure/dietary/showSchoolMenu',
        method: 'get',
        params
    });
}
//获取某个元素含量最高的十份食物
export function getDietaryFoodByElement(element) {
    let params = new URLSearchParams();
    params.append('element', element); 
    return fetch({
        url: 'structure/dietary/getDietaryFoodByElement',
        method: 'get',
        params
    });
}
//获根据食谱id和食物类型获取这个周的食物
export function getWeekFoodByMenuIdAndFoodType(menuId,typeId) {
    let params = new URLSearchParams();
    params.append('menuId', menuId); 
    params.append('typeId', typeId);
    return fetch({
        url: 'structure/dietary/getWeekFoodByMenuIdAndFoodType',
        method: 'get',
        params
    });
}
//替换食物
export function replaceFood(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.foodId);
    params.append('name', listQuery.foodName);
    params.append('pic', listQuery.foodPic); 
    params.append('typeId', listQuery.foodTypeId); 
    params.append('typeName', listQuery.foodTypeName); 
    params.append('menuDetailsIds', listQuery.menuDetailsIds); 
    params.append('menuId', listQuery.menuId); 
    return fetch({
        url: 'structure/dietary/replaceFood',
        method: 'post',
        data: params
    });
}
//分页获取学校食谱
export function queryFoodBySchoolId(listQuery) {
    let params = new URLSearchParams();
    params.append('pageNo', listQuery.pageNo);
    params.append('pageSize', listQuery.pageSize);
    params.append('searchName', listQuery.searchName); 
    params.append('typeId', listQuery.typeId); 
    return fetch({
        url: 'structure/dietary/queryFoodBySchoolId',
        method: 'post',
        data: params
    });
}
//删除食物
export function deleteFood(ids) {
    let params = new URLSearchParams();
    params.append('ids', ids); 
    return fetch({
        url: 'structure/dietary/deleteFood',
        method: 'get',
        params
    });
}
//新增食物
export function insertFood(listQuery) {
    let params = new URLSearchParams();
    params.append('materialJson', listQuery.materialJson);
    params.append('methodId', listQuery.methodId);
    params.append('methodName', listQuery.methodName); 
    params.append('name', listQuery.name); 
    params.append('pic', listQuery.pic); 
    params.append('publicFood', listQuery.publicFood); 
    params.append('remark', listQuery.remark);
    params.append('schoolId', listQuery.schoolId); 
    params.append('typeId', listQuery.typeId);
    params.append('typeName', listQuery.typeName);
    return fetch({
        url: 'structure/dietary/insertFood',
        method: 'post',
        data: params
    });
}
//编辑食物
export function updateFood(listQuery) {
    let params = new URLSearchParams();
    params.append('id', listQuery.id);
    params.append('materialJson', listQuery.materialJson);
    params.append('methodId', listQuery.methodId);
    params.append('methodName', listQuery.methodName); 
    params.append('name', listQuery.name); 
    params.append('pic', listQuery.pic); 
    params.append('publicFood', listQuery.publicFood); 
    params.append('remark', listQuery.remark);
    params.append('schoolId', listQuery.schoolId); 
    params.append('typeId', listQuery.typeId);
    params.append('typeName', listQuery.typeName);
    return fetch({
        url: 'structure/dietary/updateFood',
        method: 'post',
        data: params
    });
}
//选择食材
export function chooseMaterial(searchName,typeId) {
    let params = new URLSearchParams();
    params.append('searchName', searchName); 
    params.append('typeId', typeId);
    return fetch({
        url: 'structure/dietary/chooseMaterial',
        method: 'get',
        params
    });
}