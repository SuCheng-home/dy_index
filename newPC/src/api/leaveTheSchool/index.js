import fetch from '@/utils/fetch';

// 获取初始状态
export const getElSchoolOverInit = () =>
    fetch({
        url: '/structure/elSchoolOver/getElSchoolOverInit',
        method: 'GET'
    })

// 更新放学模块设置
export const updateElSchoolOverInit = args => {
    let params = new URLSearchParams();
    params.append("isSendClassHeader", args.isSendClassHeader);
    params.append("automaticSchool", args.automaticSchool);
    params.append("automaticMin", args.automaticMin);
    params.append("isOverUserType", args.isOverUserType);
    params.append("isSendParent", args.isSendParent);
    params.append("cardType", args.cardType);
    params.append("isClub", args.isClub);
    params.append("clardGradeJsonStr", args.clardGradeJsonStr);
    params.append("gradeSendTimeJsonStr", args.gradeSendTimeJsonStr);
    return fetch({
        url: '/structure/elSchoolOver/addAndUpdateElSchoolOverInit',
        method: 'POST',
        data: params
    })
}

// 重置当日放学数据
export const resetSchoolOver = () =>
    fetch({
        url: '/structure/elSchoolOver/resetSchoolOver',
        method: 'POST'
    })
