import fetch from '@/utils/fetch';
import { filterURLSearchParams } from "@/api/homeSchool/mentalEducation"

// 查询分类列表
export const getHeartEduGroupList = params =>
    fetch({
        url: 'structure/heartEdu/getHeartEduGroupList',
        method: 'GET',
        params: filterURLSearchParams(params)
    })

// 根据id删除分类
export const delHeartEduGroup = params =>
    fetch({
        url: 'structure/heartEdu/delHeartEduGroup',
        method: 'GET',
        params: filterURLSearchParams(params)
    })