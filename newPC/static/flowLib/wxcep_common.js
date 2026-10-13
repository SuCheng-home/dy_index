var callbackFuc = null;

/**
 * 对话框提示
 * @param  {[type]} message [提示内容]
 * @return {[type]}         [无]
 */
function bootboxAlert(message) {
    removeMoreAlert();
    bootbox.alert({
        buttons: {
            ok: {
                label: '确定'
            }
        },
        message: message,
        title: '提示'
    });
}

/*
 * 对话框提示
 * @param  {[type]}   message  [提示内容]
 * @param  {Function} callback [回调函数]
 * @return {[type]}            [无]
 */
function bootboxAlertCallBack(message, callback) {
    bootbox.alert({
        buttons: {
            ok: {
                label: '确定'
            }
        },
        message: message,
        callback: function () {
            if (typeof callback == 'function') {
                callback();
            }
        },
        title: '提示'
    });
}

/**
 * 选择对话框
 * @param  {[type]}   message  [提示内容]
 * @param  {Function} callback [回调函数]
 * @return {[type]}            [无]
 */
function bootboxConfirm(message, callback, callbackCancel) {
    bootbox.confirm({
        buttons: {
            confirm: {
                label: '确认'
            },
            cancel: {
                label: '取消',
            }
        },
        message: message,
        callback: function (result) {
            if (result) {
                if (typeof callback == 'function') {
                    callback();
                }
            } else {
                if (typeof callbackCancel == 'function') {
                    callbackCancel();
                }
            }
        },
        title: '提示',
    });
}

/**
 * 页面加载方法
 * @param  {[type]} type [显示方式   type=show 显示 type=hidden 隐藏]
 * @return {[type]}      [description]
 */
function loadPage(type) {
    switch (type) {
        case 'show':
            privateShowLoad();
            break;
        case 'hidden':
            privateHidden();
            break;
    }
}

/**
 * 重新加载页面
 */
function reLoadPage() {
    window.location.reload();
}

function loadAjaxPage(json, callback) {//异步加载,用于输出代码片段

    $.ajax({
        url: json.param.requestURL,
        type: 'POST',
        dataType: 'html',
        data: json.data,
        success: function (data) {
            callbackFuc = callback;
            $('#' + json.param.dialogId).parent().remove();
            $('body').append(data);
            $('#' + json.param.dialogId).modal({//弹出模态框
                backdrop: 'static',
                keyboard: false
            }).on('hidden.bs.modal', function () {
                $('#' + json.param.dialogId).parent().remove();
            });
        }
    });
}

/**
 * 显示加载界面（私有方法）
 * @return {[type]} [description]
 */
function privateShowLoad() {
    var loadObj = $('#wxcep-loadPage');
    if (loadObj.length === 0) {
        var load_html = '<div id="wxcep-loadPage" class="modal fade"><div class="modal-dialog" style="padding-left:200px;padding-top:300px;"><img src="' + cepPath + '/resources/admin/images/load.gif" height="32" width="32"></div></div>';
        $('body').append(load_html);
    }
    $('#wxcep-loadPage').modal({keyboard: false, backdrop: 'static'});
}

/**
 * 隐藏加载界面（私有方法）
 * @return {[type]} [description]
 */
function privateHidden() {
    $('#wxcep-loadPage').modal('hide').hide();
}


function removeMoreAlert() {
    $('.bootbox').remove();
    $('.modal-backdrop').remove();
}

// 加载模态框
function loadJsonPage(json, callback){
  callbackFuc = callback;
  $('body').append(json);
  $('body').append('<div class="modal-backdrop fade in"></div>');
}
