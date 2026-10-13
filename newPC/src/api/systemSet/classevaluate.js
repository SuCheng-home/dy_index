import fetch from '@/utils/fetch';
 /**
 * 选择课程列表  /structure/course/getChooseCourseList
 * 
 * @export
 * @param {any} listQuery  
 * @returns 
 */
export function getClassRatingSet() {
    let params = new URLSearchParams();
    return fetch({
        url: 'structure/classRating/getClassRatingSet',
        method: 'get',
        data: params
    });

}
// 新增课堂行为配置
export function addClassRatingSet(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classRating/addClassRatingSet',
        method: 'post',
        data: JSON.stringify(args)
    });
}
// 新增课堂行为配置
export function updateClassRatingSet(args) {   
    return fetch({
        headers: {
            'content-type': 'application/json'
        },
        url: 'structure/classRating/updateClassRatingSet',
        method: 'post',
        data: JSON.stringify(args)
    });
}