import store from '@/store';

export function parseTime(time, cFormat) {
    if (!time) {
        return '--';
    }
    time = time.substring(0, 19);
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time == 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}

export function formatTime(time, option) {
    if (time == '' || time == null) {
        return '--';
    }
    //time格式为 	2017-08-08 12:25:51.0
    time = time.substring(0, 19);
    time = time.replace(new RegExp("-", "gm"), "/");
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    }
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}


/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) {
            len += 1;
        } else { len += 0.5; }
    }
    return Math.floor(len);
}

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function param(json) {
    if (!json) return '';
    return cleanArray(Object.keys(json).map(key => {
        if (json[key] === undefined) return '';
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    })).join('&');
}

export function param2Obj(url) {
    const search = url.split('?')[1];
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

    if (typeof target !== 'object') {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            const sourceProperty = source[property];
            if (typeof sourceProperty === 'object') {
                target[property] = objectMerge(target[property], sourceProperty);
                continue;
            }
            target[property] = sourceProperty;
        }
    }
    return target;
}


export function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;
    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += '' + className;
    } else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}

export const pickerOptions = [{
    text: '今天',
    onClick(picker) {
        const end = new Date();
        const start = new Date(new Date().toDateString());
        end.setTime(start.getTime());
        picker.$emit('pick', [start, end]);
    }
}, {
    text: '最近一周',
    onClick(picker) {
        const end = new Date(new Date().toDateString());
        const start = new Date();
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
    }
}, {
    text: '最近一个月',
    onClick(picker) {
        const end = new Date(new Date().toDateString());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
    }
}, {
    text: '最近三个月',
    onClick(picker) {
        const end = new Date(new Date().toDateString());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
    }
}];

export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

export function checkPermission(permissionList, permissionPath) {
    let target = null;
    permissionList.forEach(permissionItem => {
        if(permissionItem.path === permissionPath) {
            target = permissionItem;
            return false;
        } else {
            if(permissionItem.children && permissionItem.children.length !== 0) {
                target = checkPermission(permissionItem.children, permissionPath);
                return target === null;
            }
        }
    });
    return target;
}

export function checkIndexPermission(permissionList, permissionPath) {
    return permissionList.indexOf(permissionPath) !== -1;
}

export function isIE() {
    return window.navigator.userAgent.indexOf("MSIE") >= 1;
}

export function isShowByPermission(permissionPath) {
    return store.getters.permission.indexOf(permissionPath) !== -1 || permissionPath === null || permissionPath === undefined;
}
export function isShowByRole(comparisonValue, comparisonKey = 'constantId') {
    return store.getters.roles.findIndex(roleItem => roleItem[comparisonKey] == comparisonValue) !== -1;
}
export function jumpToPage(path, query = {}) {
    this.$router.push({
        path,
        query
    })
}

export function strToHtml(str) {
    return str.replace(/&lt;|&gt;|&quot;|&#39;|&nbsp;|&amp;|&mdash;|&laquo;|&raquo;/g, function(matched) {
        let replaced= '';
        switch(matched) {
            case '&lt;':
                replaced = '<';
                break;
            case '&gt;':
                replaced = '>';
                break;
            case '&quot;':
                replaced = '"';
                break;
            case '&#39;':
                replaced = '\'';
                break;
            case '&nbsp;':
                replaced = ' ';
                break;
            case '&amp;':
                replaced = '&';
                break;
            case '&mdash;':
                replaced = '—';
                break;
            case '&laquo;':
                replaced = '《';
                break;
            case '&raquo;':
                replaced = '》';
                break;
            default:
                break;
        }
        return replaced;
    });
}

// 身份证校验
// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
export function checkIDCard(idcode) {
  // 加权因子
  let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  let check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let code = idcode + "";
  let last = idcode[17];//最后一个

  let seventeen = code.substring(0, 17);

  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  let arr = seventeen.split("");
  let len = arr.length;
  let num = 0;
  for (let i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }

  // 获取余数
  let resisue = num % 11;
  let last_no = check_code[resisue];

  // 格式的正则
  // 正则思路
  /*
  第一位不可能是0 第二位到第六位可以是0-9 第七位到第十位是年份，所以七八位为19或者20 十一位和十二位是月份，这两位是01-12之间的数值
  十三位和十四位是日期，是从01-31之间的数值 十五，十六，十七都是数字0-9 十八位可能是数字0-9，也可能是X
  */
  let idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
  // 判断格式是否正确
  let format = idcard_patter.test(idcode);
  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return last === last_no && format;
}

export function isShowByPermissionList(permissionList, isOr = true) {
    if(isOr) {
        return permissionList.some(permissionPath => {
            return isShowByPermission(permissionPath)
        })
    } else {
        return permissionList.every(permissionPath => isShowByPermission(permissionPath))
    }
}

// 文件预览
export function previewFile(filename, page = 1, extraArgs = {}) {
    const params = new URLSearchParams();
    params.append('page', 1);
    Object.keys(extraArgs).forEach(key => {
        params.append(key, extraArgs[key]);
    });
    let previewUrl = '';
    if(filename !== '') {
        let ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase() || extraArgs.sf;
        previewUrl = `${filename.replace(/file.myqcloud.com/, 'preview.myqcloud.com')}?${params.toString()}`;
    }
}

// 深度克隆
export function deepClone(source) {
    if (!source || typeof source !== 'object') {
        return source
        // throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    });
    return targetObj
}

export function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    // alert(JSON.stringify(arr));
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
