

function codeChangeHandler() {
    sessionStorage.setItem('flowType', $('select.select--code').val());
    window.location.reload();
}


var initFunc3 = function ($) {
    initAddressDataInIndex();
    function initCopyComponent() {
        setTimeout(function() {
            var $selectpicker = $('.selectpicker');
            $selectpicker.selectpicker('render');
            $selectpicker.selectpicker('refresh');

            var json = {
                title : '请选择固定人员',
                org : {
                    range : 'release',
                    target : 'all'
                },
                departType: 't'
            };

            $('#showCopyAddress').wyAddress(json, function(sourceData) {
                wxcepInitAddress(sourceData);
            });
        }, 200);
    }
    function initHandleComponent() {
        setTimeout(function() {
            var $selectpicker = $('.selectpicker');

            $selectpicker.selectpicker('render');
            $selectpicker.selectpicker('refresh');

            var json = {
                title : '请选择固定人员',
                org : {
                    range : 'release',
                    target : 'all'
                },
                departType: 't'
            };

            $('#showHandleAddress').wyAddress(json, function(sourceData, simpleData) {
                wxcepInitAddress(sourceData);
            });
        }, 200);
    }

    var myflow = $.myflow;
    myflow.editors = {};
    $.extend(true, myflow.editors, {
        // 展示文本框型
        textEditor: function () {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                $('<input class="form-control input-sm" style="width:100%;"/>').val(_src.text()).change(
                    function () {
                        props[_k].value = $(this).val();
                        $(_r).trigger('textchange', [$(this).val(), _src]);
                    }).appendTo('#' + _div);
                // $('body').append('aaaa');

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                    $(_r).trigger('textchange', [$(this).val(), _src]);
                });
                // $('body').append('destroy.');
            };
        },
        // 纯展示型
        display: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                $('<span></span>').text(props[_k].value).appendTo('#' + _div);

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' span').each(function () {
                    _props[_k].value = $(this).text();
                });
            }
        },
        // 文本框型
        inputEditor: function () {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                $('<input class="form-control input-sm" style="width:100%;"/>').val(props[_k].value).change(function () {
                    props[_k].value = $(this).val();
                }).appendTo('#' + _div);

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                });
            }
        },
        // 下拉选择型
        selectEditor: function (arg) {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                var sle = $('<select class="form-control" style="width:100%;"/>').val(props[_k].value).change(function () {
                    props[_k].value = $(this).val();
                }).appendTo('#' + _div);

                for (var idx = 0; idx < arg.length; idx++) {
                    sle.append('<option value="' + arg[idx].value + '">' + arg[idx].name + '</option>');
                }
                sle.val(_props[_k].value);

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                });
            };
        },
        // 单选型(操作)
        actionEditor: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                var htmlStr = '';
                var actionPropList = [{
                    isProp: 'isSave',
                    nameProp: 'saveName',
                    checkboxText: '保存'
                }, {
                    isProp: 'isEditor',
                    nameProp: 'editorName',
                    checkboxText: '编辑'
                }, {
                    isProp: 'isSubmit',
                    nameProp: 'submitName',
                    checkboxText: '提交'
                }, {
                    isProp: 'isBack',
                    nameProp: 'backName',
                    checkboxText: '退回'
                }, {
                    isProp: 'isCancel',
                    nameProp: 'cancelName',
                    checkboxText: '撤销'
                }, {
                    isProp: 'isBatchContent',
                    checkboxText: '填写意见'
                }, {
                    isProp: 'isFile',
                    checkboxText: '附件'
                },
                {
                    isProp: 'isAddress',
                    checkboxText: '定位'
                }, {
                    isProp: 'isTransfer',
                    checkboxText: '转办'
                }, {
                    isProp: 'isHerAsk',
                    checkboxText: '销假'
                }
                ];
                $.each(actionPropList, function(index, obj) {
                    htmlStr += '' +
                        '<div class="action-item">' +
                        '<label class="checkbox-inline"><input data-key="' + obj.isProp + '" type="checkbox" class="action-item__checkbox" ' + (_props[obj.isProp] === 1 ? ' checked' : '') + '/>' + obj.checkboxText + '</label>' ;
                    if (obj.isProp !== 'isBatchContent' && obj.isProp !== 'isFile' && obj.isProp !== 'isAddress' && obj.isProp !== 'isTransfer' && obj.isProp !== 'isHerAsk') {
                        htmlStr += '<input placeholder="按钮别名" data-key="' + obj.nameProp + '" style="' + (_props[obj.isProp] === 2 ? 'display: none;' : '') + '" data-default-value="' + obj.checkboxText + '" class="action-item__action-name form-control input-sm" value="' + (_props[obj.nameProp] || '') + '">';
                    }
                    htmlStr += '</div>';
                });
                $(htmlStr)
                    .appendTo('#' + _div)
                    .find('.action-item__checkbox')
                    .change( function() {
                        var $this = $(this);
                        var $actionNameInput = $this.closest('div').find('.action-item__action-name');
                        $actionNameInput.toggle($this.prop('checked'));
                        if(!$this.prop('checked')) {
                            $actionNameInput.val('');
                        } else {
                            $actionNameInput.val($actionNameInput.data('default-value'));
                        }
                    });
                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div).find('.action-item').each(function (index, actionItem) {
                    var $actionItem = $(actionItem),
                        $checkbox = $actionItem.find('.action-item__checkbox'),
                        $nameInput = $actionItem.find('.action-item__action-name');
                    _props[$checkbox.data('key')] = $checkbox.prop('checked') ? 1 : 2;
                    if($nameInput.length !== 0) {
                        _props[$nameInput.data('key')] = $nameInput.val();
                    }
                });
            };
        },
        turningTypeEditor: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;
                console.log(_props);
                var htmlStr = '';
                htmlStr += '' +
                    '<div>' +
                    '<label class="radio-inline turning-type-label"><input class="turning-type" type="radio" name="turning-type" value="1" ' + (_props['transfer'] == 1 ? 'checked' : '') + ' />自动流转</label>' +
                    '<label class="radio-inline turning-type-label"><input class="turning-type" type="radio" name="turning-type" value="2" ' + (_props['transfer'] == 2 ? 'checked' : '') + '/>人为选择</label>' +
                    '</div>';
                $(htmlStr)
                    .appendTo('#' + _div);
                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                _props['transfer'] = parseInt($('#' + _div).find('.turning-type:checked').val());
            };
        },
        stepBatchEffectEditor: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;
                console.log(_props);
                var htmlStr = '';
                htmlStr += '' +
                    '<div>' +
                    '<label class="checkbox-inline batch-effect-label"><input class="batch-effect" type="checkbox" name="turning-type" value="2" ' + (_props['stepBatchEffect'] == 2 ? 'checked' : '') + ' />到达本环节审批单生效</label>' +
                    '</div>';
                $(htmlStr)
                    .appendTo('#' + _div);
                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                _props['stepBatchEffect'] = parseInt($('#' + _div).find('.batch-effect').prop('checked') ? 2 : 1);
            };
        },
        copyToEditor: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                var roleIdList = _props.remindUser['role'].map(function(role) {
                    return parseInt(role.constantId);
                });

                var optionStr = '';
                $.each(roleList, function(index, role) {
                    optionStr += '' +
                        '<option value="' + role.constantId + '" ' + (roleIdList.indexOf(role.constantId) !== -1 ? 'selected' : '') + '>' + role.name + '</option>';
                });
                var fixeHtml = '';
                if(_props.remindUser.isFixe === 1) {
                    $.each(_props.remindUser.fixeHtmlData, function(index, dataItem) {
                        fixeHtml += '' +
                            '<span class="address-source-item">' +
                            '<img src="' + dataItem.avatar + '">' +
                            '<input type="hidden" value="' + dataItem.value + '" data-type="' + dataItem.type + '" data-wxdepartid="' + dataItem.wxdepartid + '" data-wxtagid="' + dataItem.wxtagid + '" data-mobile="' + dataItem.mobile + '" data-loginname="' + dataItem.loginname + '">' +
                            '<span class="address-source-item-des">' + dataItem.name + '</span>' +
                            '</span>';
                    })
                }

                var htmlStr = '' +
                    '<div class="copy-type-container">' +
                    '<div>' +
                    '<label class="checkbox-inline"><input type="checkbox" class="checkbox--is-remind" data-key="isRemind" ' + (_props.isRemind === 1 ? ' checked' : '') + '/>需要抄送</label>' +
                    '</div>' +
                    '<div class="copy-setting-container" style="' + (_props.isRemind === 2 ? 'display: none;' : '') + '">' +

                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isCreateUser" class="copy-item__checkbox" ' + (_props.remindUser['isCreateUser'] === 1 ? ' checked' : '') + '/>申请人</label>' +
                    '</div>' +
                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isDepartManger" class="copy-item__checkbox" ' + (_props.remindUser['isDepartManger'] === 1 ? ' checked' : '') + '/>部门主任</label>' +
                    '</div>' +
                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isEleDepartManger" class="copy-item__checkbox" ' + (_props.remindUser['isEleDepartManger'] === 1 ? ' checked' : '') + '/>部门副主任</label>' +
                    '</div>' +
                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isPidHeader" class="copy-item__checkbox" ' + (_props.remindUser['isPidHeader'] === 1 ? ' checked' : '') + '/>上级领导</label>' +
                    '</div>' +
                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isDealUser" class="copy-item__checkbox" ' + (_props.remindUser['isDealUser'] === 1 ? ' checked' : '') + '/>环节处理人</label>' +
                    '</div>' +
                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isRole" class="copy-item__checkbox copy-item__checkbox--role" ' + (_props.remindUser['isRole'] === 1 ? ' checked' : '') + '/>角色</label>' +
                    '<div class="copy-role-select-container" style="' + (_props.remindUser['isRole'] === 1 ? '' : 'display: none;') + '">' +
                    '<select id="input5" class="selectpicker select--copy-role" multiple title="请选择角色" data-none-selected-text data-live-search="true">' +
                    optionStr +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="copy-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isFixe" class="copy-item__checkbox copy-item__checkbox--address-book" ' + (_props.remindUser['isFixe'] === 1 ? ' checked' : '') + '/>固定人员</label>' +
                    '<div class="copy-address-book-container" style="' + (_props.remindUser['isFixe'] === 1 ? '' : 'display: none;') + '">' +
                    '<div id="showCopyAddress">' +
                    fixeHtml +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                var $sle = $(htmlStr).appendTo('#' + _div);

                initCopyComponent();

                $sle
                    .find('.copy-item__checkbox--role')
                    .on('change', function() {
                        $('.copy-role-select-container').toggle($(this).prop('checked'));
                    });
                $sle
                    .find('.copy-item__checkbox--address-book')
                    .on('change', function() {
                        $('.copy-address-book-container').toggle($(this).prop('checked'));
                    });
                $sle.find('.checkbox--is-remind').on('change', function() {
                    $('.copy-setting-container').toggle($(this).prop('checked'));
                });

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                var $container = $('#' + _div);
                _props['isRemind'] = $container.find('.checkbox--is-remind').prop('checked') ? 1 : 2;
                $container.find('.copy-item__checkbox').each(function(index, copyItemCheckbox) {
                    var $copyItemCheckbox = $(copyItemCheckbox);
                    _props.remindUser[$copyItemCheckbox.data('key')] = $copyItemCheckbox.prop('checked') ? 1 : 2;
                });
                var roleList = [];
                $('select.select--copy-role').find('option:selected').each(function(index, option) {
                    var $option = $(option);
                    roleList.push({
                        constantId: $option.val(),
                        name: $option.text()
                    });
                });
                if(_props.isRemind === 1 && _props.remindUser['isRole'] === 1) {
                    _props.remindUser.role = roleList;
                } else {
                    _props.remindUser.role = [];
                }
                if(_props.isRemind === 1 && _props.remindUser['isFixe'] === 1) {
                    var fixe = {}, depart = [], user = [], fixeHtmlData = [];
                    $('#showCopyAddress').find('.address-source-item').each(function(index, addressItem) {
                        var $input = $(addressItem).find('input');
                        var value = $input.val(), name = $(addressItem).text();
                        var type = value.split(',')[0], id = value.split(',')[1];
                        var avatar = $(addressItem).find('img').prop('src');

                        switch(type) {
                            case '0':
                                depart.push({
                                    id: id,
                                    name: name
                                });
                                break;
                            case '1':
                                user.push({
                                    id: id,
                                    name: name
                                });
                                break;
                        }
                        fixeHtmlData.push({
                            value: $input.val(),
                            type: $input.data('type'),
                            wxdepartid: $input.data('wxdepartid'),
                            wxtagid: $input.data('wxtagid'),
                            mobile: $input.data('mobile'),
                            loginname: $input.data('loginname'),
                            name: name,
                            avatar: avatar
                        });
                    });
                    fixe = {
                        depart: depart,
                        user: user
                    };
                    _props.remindUser.fixe = fixe;
                    _props.remindUser.fixeHtmlData = fixeHtmlData;
                } else {
                    _props.remindUser.fixe = {};
                    _props.remindUser.fixeHtmlData = [];
                }
            };
        },
        handlerEditor: function(type) {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                var roleId = parseInt(_props.dealUser['role'].constantId);

                var optionStr = '';
                $.each(roleList, function(index, role) {
                    optionStr += '' +
                        '<option value="' + role.constantId + '" ' + (roleId === role.constantId ? 'selected' : '') + '>' + role.name + '</option>';
                });

                var fixeHtml = '';
                if(_props.dealUser.isFixe === 1) {
                    $.each(_props.dealUser.fixeHtmlData, function(index, dataItem) {
                        fixeHtml += '' +
                            '<span class="address-source-item">' +
                            '<img src="' + dataItem.avatar + '">' +
                            '<input type="hidden" value="' + dataItem.value + '" data-type="' + dataItem.type + '" data-wxdepartid="' + dataItem.wxdepartid + '" data-wxtagid="' + dataItem.wxtagid + '" data-mobile="' + dataItem.mobile + '" data-loginname="' + dataItem.loginname + '">' +
                            '<span class="address-source-item-des">' + dataItem.name + '</span>' +
                            '</span>'
                    })
                }

                var htmlStr = '' +
                    '<div class="handle-type-container">' +
                    '<div class="handle-setting-container">' +

                    '<div class="handle-item">' +
                    '<div>' +
                    '<label class="radio-inline deal-type-label"><input class="deal-type" type="radio" name="deal-type" value="1" ' + (_props.deealSelectedType == 1 ? 'checked' : '') + ' />通过配置计算</label>' +
                    '<label class="radio-inline deal-type-label"><input class="deal-type" type="radio" name="deal-type" value="2" ' + (_props.deealSelectedType == 2 ? 'checked' : '') + '/>提交时指定</label>' +
                    '</div>' +
                    '</div>' +

                    '<div class="handle-detail-container" style="' + (_props.deealSelectedType === 2 ? 'display: none;' : '') + '">' +

                    '<div class="handle-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isCreateUser" class="handle-item__checkbox" ' + (_props.dealUser['isCreateUser'] === 1 ? ' checked' : '') + '/>申请人</label>' +
                    '</div>' +
                    '<div class="handle-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isDepartManger" class="handle-item__checkbox" ' + (_props.dealUser['isDepartManger'] === 1 ? ' checked' : '') + '/>部门主任</label>' +
                    '</div>' +
                    '<div class="handle-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isEleDepartManger" class="handle-item__checkbox" ' + (_props.dealUser['isEleDepartManger'] === 1 ? ' checked' : '') + '/>部门副主任</label>' +
                    '</div>' +
                    '<div class="handle-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isPidHeader" class="handle-item__checkbox" ' + (_props.dealUser['isPidHeader'] === 1 ? ' checked' : '') + '/>上级领导</label>' +
                    '</div>' +
                    '<div class="handle-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isRole" class="handle-item__checkbox handle-item__checkbox--role" ' + (_props.dealUser['isRole'] === 1 ? ' checked' : '') + '/>角色</label>' +
                    '<div class="handle-role-select-container" style="' + (_props.dealUser['isRole'] === 1 ? '' : 'display: none;') + '">' +
                    '<select id="input5" class="selectpicker select--handle-role" data-live-search="true">' +
                    optionStr +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="handle-item">' +
                    '<label class="checkbox-inline"><input type="checkbox" data-key="isFixe" class="handle-item__checkbox handle-item__checkbox--address-book" ' + (_props.dealUser['isFixe'] === 1 ? ' checked' : '') + '/>固定人员</label>' +
                    '<div class="handle-address-book-container" style="' + (_props.dealUser['isFixe'] === 1 ? '' : 'display: none;') + '">' +
                    '<div id="showHandleAddress">' +
                    fixeHtml +
                    '</div>' +
                    '</div>' +
                    '</div>' +

                    '<div class="handle-item">' +
                    '<div class="handle-item-title">提交方式</div>' +
                    '<div>' +
                    '<label class="radio-inline"><input class="turning-type" type="radio" name="submit-type" value="1" ' + (_props.dealUser['userSelectedType'] == 1 ? 'checked' : '') + ' />默认全部</label>' +
                    '<label class="radio-inline"><input class="turning-type" type="radio" name="submit-type" value="2" ' + (_props.dealUser['userSelectedType'] == 2 ? 'checked' : '') + '/>人员选择</label>' +
                    '</div>' +
                    '</div>' +

                    '</div>' +

                    '<div class="handle-item" style="' + (type !== 'start' ? '' : 'display: none;') + '">' +
                    '<div class="handle-item-title">审核方式</div>' +
                    '<div>' +
                    '<label class="radio-inline"><input class="batch-type" type="radio" name="batch-type" value="1" ' + (_props.batchType == 1 ? 'checked' : '') + ' />或签</label>' +
                    '<label class="radio-inline"><input class="batch-type" type="radio" name="batch-type" value="2" ' + (_props.batchType == 2 ? 'checked' : '') + '/>会签</label>' +
                    '</div>' +
                    '</div>' +

                    '</div>' +
                    '</div>';

                var $sle = $(htmlStr).appendTo('#' + _div);

                initHandleComponent();

                $sle
                    .find('.handle-item__checkbox--role')
                    .on('change', function() {
                        $('.handle-role-select-container').toggle($(this).prop('checked'));
                    });
                $sle
                    .find('.handle-item__checkbox--address-book')
                    .on('change', function() {
                        $('.handle-address-book-container').toggle($(this).prop('checked'));
                    });
                $sle
                    .find('.deal-type')
                    .on('change', function() {
                        $('.handle-detail-container').toggle($('.deal-type:checked').val() == 1);
                    });

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                var $container = $('#' + _div);
                _props.deealSelectedType = parseInt($('.deal-type:checked').val());
                _props.batchType = parseInt($container.find('.batch-type:checked').val());
                if(_props.deealSelectedType === 1) {
                    $container.find('.handle-item__checkbox').each(function(index, copyItemCheckbox) {
                        var $copyItemCheckbox = $(copyItemCheckbox);
                        _props.dealUser[$copyItemCheckbox.data('key')] = $copyItemCheckbox.prop('checked') ? 1 : 2;
                    });
                    _props.dealUser['userSelectedType'] = parseInt($container.find('.turning-type:checked').val());
                    var roleObj = {};
                    $('select.select--handle-role').find('option:selected').each(function(index, option) {
                        var $option = $(option);
                        roleObj = {
                            constantId: $option.val(),
                            name: $option.text()
                        };
                    });


                    if(_props.dealUser['isRole'] === 1) {
                        _props.dealUser.role = roleObj;
                    } else {
                        _props.dealUser.role = {};
                    }
                    if(_props.dealUser['isFixe'] === 1) {
                        var fixe = {}, depart = [], user = [], fixeHtmlData = [];
                        $('#showHandleAddress').find('.address-source-item').each(function(index, addressItem) {
                            var $input = $(addressItem).find('input');
                            var value = $input.val(), name = $(addressItem).text();
                            var type = value.split(',')[0], id = value.split(',')[1];
                            var avatar = $(addressItem).find('img').prop('src');

                            switch(type) {
                                case '0':
                                    depart.push({
                                        id: id,
                                        name: name
                                    });

                                    break;
                                case '1':
                                    user.push({
                                        id: id,
                                        name: name
                                    });
                                    break;
                            }
                            fixeHtmlData.push({
                                value: $input.val(),
                                type: $input.data('type'),
                                wxdepartid: $input.data('wxdepartid'),
                                wxtagid: $input.data('wxtagid'),
                                mobile: $input.data('mobile'),
                                loginname: $input.data('loginname'),
                                name: name,
                                avatar: avatar
                            });
                        });
                        fixe = {
                            depart: depart,
                            user: user
                        };
                        _props.dealUser.fixe = fixe;
                        _props.dealUser.fixeHtmlData = fixeHtmlData;

                    } else {
                        _props.dealUser.fixe = {};
                        _props.dealUser.fixeHtmlData = [];
                    }
                } else {

                    _props.dealUser = {
                        userSelectedType: 1,
                        isCreateUser: 2,
                        isDepartManger: 2,
                        isEleDepartManger: 2,
                        isFixe: 2,
                        isPidHeader: 2,
                        isRole: 2,
                        role: {},
                        fixe: {},
                        fixeHtmlData: []
                    };
                }

            };
        },
        lineCondition: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                var constantIdList = [];
                $.each(_props.role, function(index, item) {
                    constantIdList.push(parseInt(item.constantId));
                });
                var optionStr = '';
                $.each(roleList, function(index, role) {
                    optionStr += '' +
                        '<option value="' + role.constantId + '" ' + (constantIdList.indexOf(role.constantId) !== -1 ? 'selected' : '') + '>' + role.name + '</option>';
                });

                var conditsList = [];
                if(_props.conditionTypeTw !== '') {
                    var conditsList = _props.conditionTypeTw.split(',')
                }
                var conditTwStr = '';
                $.each(condit2Dic, function (index, condit) {
                    conditTwStr += '' +
                        '<option value="' + condit.code + '" ' + (conditsList.indexOf(condit.code) !== -1 ? 'selected' : '') + '>' + condit.value + '</option>';
                });

                var htmlStr = '' +
                    '<div class="handle-type-container">' +
                    '<div style="' + (flowType === 'askLeave' ? '' : 'display: none;') + '">' +
                    '<div>' +
                    '<label class="checkbox-inline"><input type="checkbox" value="0" class="checkbox--is-condit" data-key="condition-type" ' + (_props.isCondit === 1 ? ' checked' : '') + '/>请假天数</label>' +
                    '</div>' +
                    '<div class="condition-setting-container" style="' + (_props.isCondit === 2 ? 'display: none;' : '') + '">' +
                    '<select class="form-control" style="margin-right: 4%;">' +
                    '<option value="==" ' + (_props.conditionType === '==' ? 'selected' : '') + '>等于</option>' +
                    '<option value="<" ' + (_props.conditionType === '<' ? 'selected' : '') + '>小于</option>' +
                    '<option value="<=" ' + (_props.conditionType === '<=' ? 'selected' : '') + '>小于等于</option>' +
                    '<option value=">" ' + (_props.conditionType === '>' ? 'selected' : '') + '>大于</option>' +
                    '<option value=">=" ' + (_props.conditionType === '>=' ? 'selected' : '') + '>大于等于</option>' +
                    '</select>' +
                    '<input type="text" class="form-control condition-param" value="' + _props.conditionParam + '" />' +
                    '</div>' +
                    '</div>' +

                    '<div style="' + (condit2Dic.length !== 0 && (flowType === 'askLeave' || flowType === 'procure') ? '' : 'display: none;') + '">' +
                    '<div>' +
                    '<label class="checkbox-inline"><input type="checkbox" value="0" class="checkbox--is-conditTw" data-key="condition-type" ' + (_props.isConditTw === 1 ? ' checked' : '') + '/>' + (flowType === 'askLeave' ? '请假' : '采购') + '类型</label>' +
                    '</div>' +
                    '<div class="conditiontw-setting-container" style="' + (_props.isConditTw === 2 ? 'display: none;' : '') + '">' +
                    '等于' +
                    '<select class="form-control selectpicker" multiple style="margin-right: 0;margin-left: 16px;display: inline-block;vertical-align: middle;width: 84%;">' +
                    conditTwStr +
                    '</select>' +
                    '</div>' +
                    '</div>' +

                    '<div>' +
                    '<label class="checkbox-inline"><input type="checkbox" value="1" class="checkbox--is-role" data-key="condition-type" ' + (props.isRole === 1 ? ' checked' : '') + '/>角色</label>' +
                    '</div>' +
                    '<div class="role-setting-container" style="' + (_props.isRole === 2 ? 'display: none;' : '') + '">' +
                    '<select id="input5" multiple class="selectpicker select--condition-role" data-live-search="true">' +
                    optionStr +
                    '</select>' +
                    '</div>' +
                    '<div style="' + (flowType === 'askLeave' ? '' : 'display: none;') + '">' +
                    '<label class="checkbox-inline"><input type="checkbox" value="1" class="checkbox--adjustClass" data-key="condition-type" ' + (_props.adjustClass === 1 ? ' checked' : '') + '/>是否调课</label>' +
                    '</div>' +
                    '</div>';

                var $sle = $(htmlStr).appendTo('#' + _div);

                var $selectpicker = $('.selectpicker');
                $selectpicker.selectpicker('render');
                // console.log(123);
                $selectpicker.selectpicker('refresh');

                $sle
                    .find('.checkbox--is-role')
                    .on('change', function() {
                        var $this = $(this);
                        $('.role-setting-container').toggle($this.prop('checked'));
                    });
                $sle
                    .find('.checkbox--is-condit')
                    .on('change', function() {
                        var $this = $(this);
                        $('.condition-setting-container').toggle($this.prop('checked'));
                    });

                $sle
                    .find('.checkbox--is-conditTw')
                    .on('change', function() {
                        var $this = $(this);
                        $('.conditiontw-setting-container').toggle($this.prop('checked'));
                    });

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                var $container = $('#' + _div);

                _props.isRole = $container.find('.checkbox--is-role').prop('checked') ? 1 : 2;
                _props.isCondit = $container.find('.checkbox--is-condit').prop('checked') ? 1 : 2;
                _props.isConditTw = $container.find('.checkbox--is-conditTw').prop('checked') ? 1 : 2;
                _props.adjustClass = $container.find('.checkbox--adjustClass').prop('checked') ? 1 : 2;
                var role = [];
                if(_props.isRole === 1) {
                    var $option = $container.find('.role-setting-container').find('option:selected');
                    $option.each(function(index, item) {
                        var $item = $(item);
                        role.push({
                            name: $item.text(),
                            constantId: $item.val()
                        })
                    });
                }
                _props.role = role;

                if(_props.isCondit === 1) {
                    _props.conditionType = $container.find('.condition-setting-container').find('select').val();
                    _props.conditionParam = $container.find('.condition-param').val();
                    _props.linCondition = '[condit]' + _props.conditionType + _props.conditionParam;
                } else {
                    _props.conditionType = '';
                    _props.conditionParam = '';
                    _props.linCondition = '';
                }
                if(_props.isConditTw === 1) {
                    var linConditionTwList = [], conditionTypeTw = [];
                    $container.find('.conditiontw-setting-container').find('option:selected').each(function(index, item) {
                        linConditionTwList.push('[conditTw]==' + item.value);
                        conditionTypeTw.push(item.value);
                    });
                    _props.conditionTypeTw = conditionTypeTw.join(',');
                    _props.linConditionTw = linConditionTwList.join('or');
                } else {
                    _props.conditionTypeTw = '';
                    _props.linConditionTw = '';
                }
            };
        },
        codeSelect: function() {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                if(!_props['dealUser']) {
                    _props.dealUser = {
                    };
                    $(['isCreateUser', 'isRole', 'isDepartManger', 'isEleDepartManger', 'isFixe']).each(function (index, key) {
                        _props.dealUser[key] = 2;
                    });
                    _props.dealUser['role'] = {};
                    _props.dealUser.fixe = {};
                    _props.dealUser.fixeHtml = '';
                }

                var code = myflow.config.props.props.code.value;

                var optionStr = '';
                $.each(sysDictionaryList, function(index, type) {
                    optionStr += '' +
                        '<option ' + ( window.sessionStorage.getItem('flowType') == type.code ? 'selected' : '' ) + ' value="' + type.code + '" ' + (code === type.code ? 'selected' : '') + '>' + type.value + '</option>';
                });

                var htmlStr = '' +
                    '<div class="code-type-container">' +
                    '<div class="code-setting-container">' +

                    '<div class="code-item">' +
                    '<div class="code-role-select-container">' +
                    '<select id="input5" class="selectpicker select--code" data-live-search="true" onchange="codeChangeHandler()">' +
                    optionStr +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                var $sle = $(htmlStr).appendTo('#' + _div);

                var $selectpicker = $('.selectpicker');
                $selectpicker.selectpicker('render');
                $selectpicker.selectpicker('refresh');
                console.log(123);

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                var $container = $('#' + _div);
                myflow.config.props.props.code.value = $container.find('select.select--code').val();
            };
        }
    });

}
