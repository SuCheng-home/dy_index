const MAP_KEY = ''

export const loadAMap = () => {
    if (sessionStorage.getItem("mymapKey")) {
        return AMapLoader.load({
            key: sessionStorage.getItem("mymapKey"), // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            viewMode: '2D', // 默认使用 2D 模式
        })
    } else {
        return AMapLoader.load({
            key: MAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            viewMode: '2D', // 默认使用 2D 模式
        })

    }
}

/**
 *  计算两点的距离
 * @param {Array} p1 [经度，纬度]
 * @param {Array} p2 [经度，纬度]
 * @param {AMap} target
 * @returns num 单位：米
 */
export const computedDistance = function (p1, p2, target) {
    const AMap = target || this
    return AMap.GeometryUtil.distance(p1, p2)
}

// 获取本地经纬度（pc会存在兼容问题）
export const getLocalPosition = async function (target) {
    const AMap = target || this
    let onComplete = null
    let onError = null
    AMap.plugin('AMap.Geolocation', function () {
        const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 10 * 1000, // 设置定位超时时间，默认：无穷大
            offset: [10, 20], // 定位按钮的停靠位置的偏移量
            zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            position: 'RB' //  定位按钮的排放位置,  RB表示右下
        })

        geolocation.getCurrentPosition(function (status, result) {
            if (status == 'complete') {
                onComplete(result)
            } else {
                onError(result)
            }
        });
    })
    return new Promise((r, j) => {
        onComplete = r
        onError = j
    })
}
