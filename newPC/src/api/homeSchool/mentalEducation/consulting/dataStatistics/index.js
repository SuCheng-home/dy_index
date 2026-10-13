import fetch from '@/utils/fetch';
import { systemFetch } from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 根据学校id,日期查询教师回复量统计表
export const getStatisticalConsultListTh = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultListTh',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询时段统计报表
export const getStatisticalConsultQuantumListTh = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultQuantumListTh',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询时段统计报表分组
export const getStatisticalConsultQuantumGroupListTh = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultQuantumGroupListTh',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询问题类别统计报表
export const getStatisticalConsultGroupListTh = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultGroupListTh',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询家长年龄段统计报表
export const getStatisticalConsultAgeListParent = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultAgeListParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询家长年龄段统计报表分组
export const getStatisticalConsultAgeGroupListParent = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultAgeGroupListParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询家长学历统计报表
export const getStatisticalConsultEducationListParent = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultEducationListParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询家长学历统计报表分组
export const getStatisticalConsultEducationGroupListParent = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultEducationGroupListParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询身份统计报表
export const getStatisticalConsultNickListParent = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultNickListParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询身份统计报表分组
export const getStatisticalConsultNickGroupListParent = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultNickGroupListParent',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询年级统计报表
export const getStatisticalConsultGradeListSt = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultGradeListSt',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询年级统计报表分组
export const getStatisticalConsultGradeGroupListSt = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultGradeGroupListSt',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询学生性别统计报表
export const getStatisticalConsultSexListSt = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultSexListSt',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询学生性别统计报表分组
export const getStatisticalConsultSexGroupListSt = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultSexGroupListSt',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 独生子女统计报表
export const getStatisticalConsultOnlyListSt = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultOnlyListSt',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据学校id,日期查询独生子女统计报表分组
export const getStatisticalConsultOnlyGroupListSt = params =>
    fetch({
        url: 'structure/heartEdu/getStatisticalConsultOnlyGroupListSt',
        method: 'GET',
        params: filterURLSearchParams(params)
    })
