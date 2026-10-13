import fetch from '@/utils/fetch';

/**
 * 列表 树
 * */
export function initTree() {
  let params = new URLSearchParams();

  return fetch({
    url: 'structure/beautifulEnglishTree/initTree',
    method: 'GET',
    params
  });
}

/**
 * 新增 树节点
 * */
export function treeDomInsert(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/beautifulEnglishTree/insert',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 编辑 树节点
 * */
export function treeDomUpdateByModel(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/beautifulEnglishTree/updateByModel',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 删除树节点
 * */
export function deleteTreeDomById(args) {
  let params = new URLSearchParams();
  params.append("id", args.id);

  return fetch({
    url: 'structure/beautifulEnglishTree/deleteById',
    method: 'POST',
    data: params
  });
}

/**
 * 美文记录
 * */

/**
 * 列表 美文记录(全校所有)
 * */
export function listBySchoolIdAndContent(args) {
  let params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);

  return fetch({
    url: 'structure/beautifulEnglishRecord/listPageBySchoolIdAndContent',
    method: 'GET',
    params
  });
}

/**
 * 列表 美文记录(树节点)
 * */
export function listByTreeNodeId(args) {
  let params = new URLSearchParams();
  params.append("pageNo", args.pageNo);
  params.append("pageSize", args.pageSize);
  params.append("folderCode", args.folderCode);

  return fetch({
    url: 'structure/beautifulEnglishRecord/listPageByFolderCodeAndContent',
    method: 'GET',
    params
  });
}

/**
 * 新增 美文记录
 * */
export function articleInsert(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/beautifulEnglishRecord/insert',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 编辑 美文记录
 * */
export function articleUpdateByModel(args) {

  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/beautifulEnglishRecord/updateByModel',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 详情 美文记录
 * */
export function getArticleById(args) {
  let params = new URLSearchParams();
  params.append("id", args.id);

  return fetch({
    url: 'structure/beautifulEnglishRecord/getById',
    method: 'GET',
    params
  });
}

/**
 * 删除 美文记录
 * */
export function deleteArticleById(args) {
  let params = new URLSearchParams();
  params.append("id", args.id);

  return fetch({
    url: 'structure/beautifulEnglishRecord/deleteById',
    method: 'POST',
    data: params
  });
}

/**
 * 点赞or取消点赞
 * */
export function isGreatArticle(args) {
  let params = new URLSearchParams();
  params.append("recordId", args.recordId);

  return fetch({
    url: 'structure/beautifulEnglishGreat/great',
    method: 'POST',
    data: params
  });
}
