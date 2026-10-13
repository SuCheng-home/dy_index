import fetch from '@/utils/fetch';

/*根据学校Id查询网站设置*/
export function getSchoolWebSettingBySchoolId(){
  return fetch({
    url:'structure/schoolWebTwo/getSchoolWebSettingBySchoolId',
    method:'post'
  })
}

/*新增修改网站设置*/
export function addAndUpdateSchoolWebSetting(args) {
  return fetch({
    url: 'structure/schoolWebTwo/addAndUpdateSchoolWebSetting',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

/*根据网站Id开始日期结束日期查询网站访问量*/
export function getWebAccessNumberList(query){
  let params=new URLSearchParams();
  params.append('webId',query.webId);
  params.append('startDate',query.startDate);
  params.append('endDate',query.endDate);
  return fetch({
    url:`structure/schoolWebTwo/getWebAccessNumberList`,
    method:'get',
    params
  })
}

//新增网站设置(新增接口)
export function addSchoolWebSetting(args) {
  return fetch({
    url: 'structure/schoolWebTwo/addSchoolWebSetting',
    method: 'POST',
    data: JSON.stringify(args)
  });
}

//根据网站id查询网站设置(新增接口)
export function getSchoolWebSettingById(query){
  let params=new URLSearchParams();
  params.append('webId',query.webId);
  return fetch({
    url:`structure/schoolWebTwo/getSchoolWebSettingById`,
    method:'get',
    params
  })
}

//修改网站设置
export function updateSchoolWebSetting(args) {
  return fetch({
    url: 'structure/schoolWebTwo/updateSchoolWebSetting',
    method: 'POST',
    data: JSON.stringify(args)
  });
}