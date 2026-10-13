import fetch from '@/utils/fetch';
import {systemFetch} from '@/utils/fetch';
/**
 * 玩转汉字班级统计趋势图
 * **/
export function getPlayWordClassDateList(classId,searchType) {
    let params = new URLSearchParams();
    params.append('searchType', searchType);
    params.append('classId', classId);
    return fetch({
      url: 'structure/playWord/getPlayWordClassDateList',
      method: 'get',
      params
    });
  }
/**
 * 玩转汉字年级统计趋势图
 * **/
export function getPlayWordGradeDateList(gradeId,searchType) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    params.append('searchType', searchType);
    return fetch({
      url: 'structure/playWord/getPlayWordGradeDateList',
      method: 'get',
      params
    });
  }

  /**
 * 玩转汉字年级统计趋势图
 * **/
export function getGradeRankStuList(gradeId,endCount,startCount) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    params.append('endCount', endCount);
    params.append('startCount', startCount);
    return fetch({
      url: 'structure/playWord/getGradeRankStuList',
      method: 'get',
      params
    });
  }
  /**
 * 根据年级Id查询各班级识字量图表
 * **/
export function getCheckClassCharByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return fetch({
      url: 'structure/playWord/getCheckClassCharByGradeId',
      method: 'get',
      params
    });
  }
  /**
 * 根据学校Id查询各年级识字量图表
 * **/
export function getCheckGradeCharBySchoolId() {
  return fetch({
    url: 'structure/playWord/getCheckGradeCharBySchoolId',
    method: 'get'
  });
}
  /**
 * 获得年级列表
 * **/
export function querySchoolGrade() {
    return systemFetch({
      url: 'api/depart/querySchoolGrade',
      method: 'get'
    });
  }
  /**
 * 根据年级ID获得班级列表
 * **/
export function queryClassByGradeId(gradeId) {
    let params = new URLSearchParams();
    params.append('gradeId', gradeId);
    return systemFetch({
      url: 'api/depart/queryClassByGradeId',
      method: 'get',
      params
    });
  }