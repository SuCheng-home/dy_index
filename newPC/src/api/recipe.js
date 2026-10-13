import fetch from '@/utils/fetch';
import {
    systemFetch
} from '@/utils/fetch';
export function isOpenModule(moduleCode) {
    let params = new URLSearchParams();
    params.append('moduleCode', moduleCode);
    return systemFetch({
        url: 'api/module/school/isOpenModule',
        method: 'GET',
        params
    })
}
/*
 * 食谱列表
 */
export function recipeList(query) {
  let params = new URLSearchParams();
  params.append('pageNo', query.pageNo);
  params.append('pageSize', query.pageSize);
  params.append('searchTitle', query.searchTitle);
  params.append('schoolTimeId', query.schoolTimeId);
  return fetch({
    url: 'structure/recipe/recipeList',
    method: 'post',
    params
  });
}
/**
 *
 * 获取食谱通知详情
 *
 * @export
 * @param {any} noticeId
 * @param {any} submitRead
 * @returns
 */
export function recipeDetails(query) {
  let params = new URLSearchParams();
  params.append('recipeId', query.recipeId);
  params.append('submitRead', query.submitRead);
  return fetch({
    url: 'structure/recipe/recipeDetails',
    method: 'post',
    params
  });
}

/**
 * 编辑或发布食谱
 * @export
 * @param {any} listQuery
 * @returns
 */
export function updateOrPublishRecipe(query) {
  let params = new URLSearchParams();
  params.append('content', query.content);
  params.append('isPc', query.isPc);
  params.append('id', query.id);
  params.append('isShow', query.isShow);
  params.append('recipeType', query.recipeType);
  params.append('recipeWeek', query.recipeWeek);
  params.append('title', query.title);
  params.append('isSendToWebsite', query.isSendToWebsite);
  if(query.timed==1){
    params.append('timeDate', query.timeDate);
  };
  params.append('timed', query.timed);
  return fetch({
    url: 'structure/recipe/updateOrPublishRecipe',
    method: 'post',
    data: params
  });
}
/**
 * 新增或发布食谱通知
 * @export
 * @param {any} listQuery
 * @returns
 */
export function insertOrPublishRecipe(query) {
  let params = new URLSearchParams();
  params.append('content', query.content);
  params.append('isPc', query.isPc);
  params.append('isShow', query.isShow);
  params.append('recipeType', query.recipeType);
  params.append('recipeWeek', query.recipeWeek);
  params.append('title', query.title);
  params.append('isSendToWebsite', query.isSendToWebsite);
  if(query.timed==1){
    params.append('timeDate', query.timeDate);
  };
  params.append('timed', query.timed);
  return fetch({
    url: 'structure/recipe/insertOrPublishRecipe',
    method: 'post',
    data: params
  });
}

/**
 * 编辑并预览食谱
 * @export
 * @param {any} listQuery
 * @returns
 */
export function updatePreviewRecipe(query) {
  let params = new URLSearchParams();
  params.append('content', query.content);
  params.append('isPc', query.isPc);
  params.append('id', query.id);
  params.append('isShow', query.isShow);
  params.append('recipeType', query.recipeType);
  params.append('recipeWeek', query.recipeWeek);
  params.append('title', query.title);
  if(query.timed==1){
    params.append('timeDate', query.timeDate);
  };
  params.append('timed', query.timed);
  return fetch({
    url: 'structure/recipe/updatePreviewRecipe',
    method: 'post',
    data: params
  });
}

/**
 * 新增并预览食谱
 * @export
 * @param {any} listQuery
 * @returns
 */
export function insertPreviewRecipe(query) {
  let params = new URLSearchParams();
  params.append('content', query.content);
  params.append('isPc', query.isPc);
  params.append('isShow', query.isShow);
  params.append('recipeType', query.recipeType);
  params.append('recipeWeek', query.recipeWeek);
  params.append('title', query.title);
  if(query.timed==1){
    params.append('timeDate', query.timeDate);
  };
  params.append('timed', query.timed);
  return fetch({
    url: 'structure/recipe/insertPreviewRecipe',
    method: 'post',
    data: params
  });
}
/**
 * 手机端获取教师或学生食谱通知
 * @export
 * @param {any} listQuery
 * @returns
 */
export function mobileHomeRecipe(listQuery) {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/recipe/mobileHomeRecipe',
    method: 'post',
    params
  });
}


/**
 *
 * 删除食谱
 *
 * @export
 * @param {any} listQuery
 * @returns
 */
export function deleteRecipe(listQuery) {
  let params = new URLSearchParams();
  params.append('recipeIds', listQuery);
  return fetch({
    url: 'structure/recipe/deleteRecipe',
    method: 'post',
    params
  });
}
/**
 *
 * 获取当前周
 *
 * @export
 * @param {any}
 * @returns
 */
export function getCurrentWeek() {
  let params = new URLSearchParams();
  return fetch({
    url: 'structure/recipe/getCurrentWeek',
    method: 'post',
    params
  });
}
