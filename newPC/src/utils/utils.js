import store from '@/store';
import constants from './constants';
import {findDicsByCode, findSchoolDicsByCode} from '@/api/common/common';
import moment from 'moment';

export class AdaptiveManager {
    constructor(designWidth = 640, maxWidth = 750, bodyFontSize = '0.16rem') {
        this.designWidth = designWidth;
        this.maxWidth = maxWidth;
        this.bodyFontSize = bodyFontSize;
    }

    calcBaseFontSize() {
        var documentElement = document.documentElement;
        var baseFontSize = Math.min(documentElement.getBoundingClientRect().width, this.maxWidth) / this.designWidth * 100;
        document.documentElement.style.fontSize = baseFontSize + 'px';
        document.body.style.fontSize = this.bodyFontSize;
    }

    bindEvents() {
        window.addEventListener('resize', this.calcBaseFontSize, false);
    }

    init() {
        this.calcBaseFontSize();
        this.bindEvents();
    }
}

export function checkPermission(permissionList, permissionPath) {
    let target = null;
    permissionList.forEach(permissionItem => {
        if (permissionItem.path === permissionPath) {
            target = permissionItem;
            return false;
        } else {
            if (permissionItem.children && permissionItem.children.length !== 0) {
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

export function isShowByPermission(permissionPath) {
    return store.getters.permission.indexOf(permissionPath) !== -1;
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

function setAttributes(script, attrs) {
    for (var attr in attrs) {
        script.setAttribute(attr, attrs[attr])
    }
}

export function loadScript(src, opts) {
    return new Promise(function (resolve, reject) {
        var head = document.head || document.getElementsByTagName('head')[0]
        var script = document.createElement('script')

        opts = opts || {}

        script.type = opts.type || 'text/javascript'
        script.charset = opts.charset || 'utf8'
        script.src = src;
        script.className = opts.className || '';

        if (opts.attrs) {
            setAttributes(script, opts.attrs)
        }

        if (opts.text) {
            script.text = '' + opts.text
        }

        script.onload = function () {
            resolve(script)
            this.onerror = this.onload = null
        }

        script.onerror = function () {
            reject(script)
            this.onerror = this.onload = null
        }
        console.log('script', script)
        head.appendChild(script)
    })
}
export function loadStyle(href, opts) {
    return new Promise(function (resolve, reject) {
        var head = document.head || document.getElementsByTagName('head')[0]
        var style = document.createElement('link')

        opts = opts || {}

        style.rel = 'stylesheet'
        style.charset = opts.charset || 'utf8'
        style.href = href;
        style.className = opts.className || '';

        if (opts.attrs) {
            setAttributes(style, opts.attrs)
        }

        if (opts.text) {
            style.text = '' + opts.text
        }

        style.onload = function () {
            resolve(style)
            this.onerror = this.onload = null
        }

        style.onerror = function () {
            reject(style)
            this.onerror = this.onload = null
        }

        head.appendChild(style)
    })
}
export function strToHtml(str) {
    return str.replace(/&lt;|&gt;|&quot;|&#39;|&nbsp;|&amp;/g, function (matched) {
        let replaced = '';
        switch (matched) {
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
              case '&ldquo;':
                replaced = '“';
                break;
              case '&rdquo;':
                replaced = '”';
                break;
            case '&hellip;':
                replaced = '...';
            break;
            default:
                break;
        }
        return replaced;
    });
}

export function encrypt(msg) {
    const CryptoJS = window.CryptoJS;
    var key = CryptoJS.enc.Utf8.parse('2019092415weiyan');
    var iv = CryptoJS.enc.Utf8.parse('weiyan2019092415');
    var passwd = CryptoJS.enc.Utf8.parse(msg.trim());
    const result = CryptoJS.AES.encrypt(passwd, key, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return result.ciphertext.toString();
}

export function getDropDownList(list, role) {
    var array = [];
    for (let item of Object.values(list)) {
        array.push({label: item[role.label], value: item[role.value]});
    }
    return array;
}

export function hasRoleByComponent(sourceData, component) {
    let flag = false;
    if (sourceData) {
        for (let i = 0; i < sourceData.length; i++) {
            if (sourceData[i].component == component) {
                flag = true;
                break;
            }
        }
    }
    return flag;
}

export function getRoleNameByComponent(sourceData, component) {
    let name = '';
    if (sourceData) {
        for (let i = 0; i < sourceData.length; i++) {
            if (sourceData[i].component == component) {
                name = sourceData[i].name;
                break;
            }
        }
    }
    return name;
}

export function parseToConstants(value, constKey) {
    if (value == null) {
        return ''
    } else {
        return constants[constKey].get(value.toString()) || '';
    }
}

export function parseToConstantsKey(value, constKey) {
    if (value == null) {
        return ''
    } else {
        const resultItem = [...constants[constKey].entries()].find(item => {
            return item[1] == value;
        });
        return resultItem ? resultItem[0] : '';
    }
}

export function getDicByCode(dicCode) {
    return new Promise((resolve, reject) => {
        findDicsByCode({
            dicCode
        })
            .then(res => res.data)
            .then(data => {
                if (data.result) {
                    resolve(data.data);
                } else {
                    reject(data.msg);
                }
            })
            .catch(error => {
                reject(error);
            });
    })
}

export function getSchoolDicByCode(dicCode) {
    return new Promise((resolve, reject) => {
        findSchoolDicsByCode({
            dicCode
        })
            .then(res => res.data)
            .then(data => {
                if (data.result) {
                    resolve(data.data);
                } else {
                    reject(data.msg);
                }
            })
            .catch(error => {
                reject(error);
            });
    })
}

export function getValueFromDicCode(code, dicCode) {
    return new Promise((resolve, reject) => {
        getDicByCode(dicCode)
            .then(data => {
                const result = data.find((item => item.code == code));
                resolve(result ? result.value : '');
            })
            .catch(error => {
                reject(error);
            });
    });
}
export function formatToDate(date, mode = 'date') {
    let result = '';
    if(date) {
        switch(mode) {
            case 'date':
                result = moment(date).format('YYYY-MM-DD');
                break;
            case 'minute':
                result = moment(date).format('YYYY-MM-DD HH:mm');
                break;
            case 'second':
                result = moment(date).format('YYYY-MM-DD HH:mm:ss');
                break;
        }
    }
    return result;
}
export function thunderExport(fileName, redisKey) {
    const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'https://api.weixiaojia.net/';
    window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${fileName}&key=${redisKey}&token=${store.getters.token}`, "_blank");
}
