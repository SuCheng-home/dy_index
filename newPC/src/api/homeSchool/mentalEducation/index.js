// 统一处理请求参数
export const filterURLSearchParams = (args = {}) => {
    const params = new URLSearchParams();
    Object.keys(args).forEach(key => {
        params.append(key, args[key]);
    })
    return params;
}