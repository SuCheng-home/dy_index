import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据学校id,用户id，类型,日期查询咨询列表
export const getHeartEduConsultListByDateScope = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduConsultListByDateScope',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 查询分类列表
export const getHeartEduGroupList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduGroupList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 获取当前学期
export const getCurrentSchoolTimeBySchoolId = params =>
    fetch({
        url: 'structure/schoolTime/getCurrentSchoolTimeBySchoolId',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据咨询id删除咨询
export const delHeartEduConsultById = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduConsultById',
        method: 'GET',
        params: filterURLSearchParams(params)
    })