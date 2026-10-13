import store from '@/store';
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

export function isShowByPermission(permissionPath) {
  return store.getters.permission.indexOf(permissionPath) !== -1;
}

function setAttributes (script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr])
  }
}

export function loadScript (src, opts) {
  return new Promise(function (resolve, reject) {
    var head = document.head || document.getElementsByTagName('head')[0]
    var script = document.createElement('script')

    opts = opts || {}

    script.type = opts.type || 'text/javascript'
    script.charset = opts.charset || 'utf8'
    script.async = 'async' in opts ? !!opts.async : true
    script.src = src

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

    head.appendChild(script)
  })
}
