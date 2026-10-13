import fetch from '@/utils/fetch';

/**
 * 统一处理请求参数
 * */
function filterURLSearchParams(args = {}) {
  const params = new URLSearchParams();
  Object.keys(args).forEach(key => {
    params.append(key, args[key]);
  });
  return params;
}

/**
 * 书库
 * */
/**
 * 查询学校书本列表
 * */
export function getSchoolBookList(args) {
  return fetch({
    url: 'structure/playWord/getPlayWordBookList',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}

/**
 * 根据学校Id查询书本列表
 * */
export function getLanguageBookList(args) {
  return fetch({
    url: 'structure/languageBook/getLanguageBookList',
    method: 'GET',
    data: filterURLSearchParams(args)
  });
}

/**
 * 批量新增书本
 * */
export function addLanguageBookList(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/addLanguageBookList',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 删除书本信息
 * */
export function delBook(args) {
  let params = new URLSearchParams();
  params.append('bookId', args.bookId);

  return fetch({
    url: 'structure/languageBook/delBook',
    method: 'GET',
    params
  });
}

/**
 * 书本信息
 * */
export function getBookInfo(args) {
  let params = new URLSearchParams();
  params.append('bookId', args.bookId);

  return fetch({
    url: 'structure/playWord/getPlayWordBookById',
    method: 'GET',
    params
  });
}


/**
 * 读后感
 * */
/**
 * 查询读后感列表
 * */
export function getLanguageBookReactionList(args) {
  let params = new URLSearchParams();
  params.append('bookId', args.bookId);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('isEssence', 0);

  return fetch({
    url: 'structure/languageBook/getLanguageBookReactionList',
    method: 'GET',
    params
  });
}

/**
 * 新增读后感
 * */
export function addLanguageBookReaction(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/addLanguageBookReaction',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 编辑读后感
 * */
export function updateLanguageBookReaction(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/updateLanguageBookReaction',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 读后感详情
 * */
export function getLanguageBookReaction(args) {
  return fetch({
    url: 'structure/languageBook/getLanguageBookReaction',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}

/**
 * 删除读后感
 * */
export function delLanguageBookReaction(args) {
  return fetch({
    url: 'structure/languageBook/delLanguageBookReaction',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}


/**
 * 任务
 * */
/**
 * 查询任务列表
 * */
export function getLanguageBookTaskList(args) {
  let params = new URLSearchParams();
  params.append('bookId', args.bookId || 0);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);

  return fetch({
    url: 'structure/languageBook/getLanguageBookTaskList',
    method: 'GET',
    params
  });
}

/**
 * 新增任务
 * */
export function addLanguageBookTask(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/addLanguageBookTask',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 编辑任务
 * */
export function updateLanguageBookTask(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/updateLanguageBookTask',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 发布任务
 * */
export function sendLanguageBookTask(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/sendLanguageBookTask',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/**
 * 任务详情
 * */
export function getLanguageBookTask(args) {
  return fetch({
    url: 'structure/languageBook/getLanguageBookTask',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}

/**
 * 删除任务
 * */
export function delLanguageBookTask(args) {
  return fetch({
    url: 'structure/languageBook/delLanguageBookTask',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}


/**
 * 打卡记录
 * */
/**
 * 根据日期查询任务记录列表
 * */
export function getTaskRecordListByDate(args) {
  let params = new URLSearchParams();
  params.append('createDate', args.createDate);
  params.append('pageNo', args.pageNo);
  params.append('pageSize', args.pageSize);
  params.append('status', args.status || 0);
  params.append('studentName', args.studentName);
  params.append('taskId', args.taskId);

  return fetch({
    url: 'structure/languageBook/getTaskRecordListByDate',
    method: 'GET',
    params
  });
}

/**
 * 清空任务记录
 * */
export function resLanguageBookTaskRecord(args) {
  return fetch({
    url: 'structure/languageBook/resLanguageBookTaskRecord',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}

/**
 * 提醒未上报学生
 * */
export function remindBookTaskRecord(args) {
  return fetch({
    url: 'structure/languageBook/remindBookTaskRecord',
    method: 'POST',
    data: filterURLSearchParams(args)
  });
}

/**
 * 权限
 * */
export function possessRole() {
  let params = new URLSearchParams();
  params.append('roleConstantId', '10044');
  return fetch({
    baseURL: global.BaseNewPath,
    url: 'api/user/role/possessRole',
    method: 'GET',
    params
  });
}



/**
 *修改书本信息 2024-03-18
 * */
 export function updateLanguageBook(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/updateLanguageBook',
    method: 'POST',
    data: JSON.stringify(args)
  });
}


/**
 * 删除书本信息
 * */
 export function getLanguageBook(bookId) {
  let params = new URLSearchParams();
  params.append('bookId', bookId);

  return fetch({
    url: 'structure/languageBook/getLanguageBook',
    method: 'GET',
    params
  });
}


export function updateLanguageBookHomework(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/updateLanguageBookHomework',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

export function updateLanguageBookHomeworkStu(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/updateLanguageBookHomeworkStu',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

export function addLanguageBookHomework(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/addLanguageBookHomework',
    method: 'POST',
    data: JSON.stringify(args)
  });
}
export function addLanguageBookHomeworkStu(args) {
  return fetch({
    headers: {
      'content-type': 'application/json'
    },
    url: 'structure/languageBook/addLanguageBookHomeworkStu',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

export function delLanguageBookHomework(homeworkId) {
  let params = new URLSearchParams();
  params.append('homeworkId', homeworkId);
  return fetch({
    url: 'structure/languageBook/delLanguageBookHomework',
    method: 'GET',
    params
  });
}

export function delLanguageBookHomeworkStu(homeworkStuId) {
  let params = new URLSearchParams();
  params.append('homeworkStuId', homeworkStuId);
  return fetch({
    url: 'structure/languageBook/delLanguageBookHomeworkStu',
    method: 'GET',
    params
  });
}

export function getLanguageBookHomework(homeworkId) {
  let params = new URLSearchParams();
  params.append('homeworkId', homeworkId);
  return fetch({
    url: 'structure/languageBook/getLanguageBookHomework',
    method: 'GET',
    params
  });
}
export function getLanguageBookHomeworkStu(homeworkStuId) {
  let params = new URLSearchParams();
  params.append('homeworkStuId', homeworkStuId);
  return fetch({
    url: 'structure/languageBook/getLanguageBookHomeworkStu',
    method: 'GET',
    params
  });
}
export function getLanguageBookHomeworkList(bookId) {
  let params = new URLSearchParams();
  params.append('bookId', bookId);
  return fetch({
    url: 'structure/languageBook/getLanguageBookHomeworkList',
    method: 'GET',
    params
  });
}
export function getLanguageBookHomeworkStuList(homeworkId) {
  let params = new URLSearchParams();
  params.append('homeworkId', homeworkId);
  return fetch({
    url: 'structure/languageBook/getLanguageBookHomeworkStuList',
    method: 'GET',
    params
  });
}