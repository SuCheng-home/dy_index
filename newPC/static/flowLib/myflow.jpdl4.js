var initFunc2 = function ($) {
    var myflow = $.myflow;

    $.extend(true, myflow.config.rect, {
        attr: {
            r: 8,
            fill: '#F6F7FF',
            stroke: '#03689A',
            "stroke-width": 2
        }
    });
    var flowdataObj = window.workFlowJson ? JSON.parse(workFlowJson) : null

    var propsObj = {};
    if(flowdataObj) {
        for(var k in flowdataObj.processInfo) {
            var obj = {
                value: flowdataObj.processInfo[k]
            };
            propsObj[k] = obj;
        }
    }



    $.extend(true, myflow.config.props.props, {
        name: {
            name: 'name', label: '名称', value: '流程名称', editor: function () {
                return new myflow.editors.inputEditor();
            }
        },
        code: {
            name: 'code', label: '标识', value: '1', editor: function () {
                return new myflow.editors.codeSelect();
            }
        },
        version: {
            name: 'condition', label: '版本', value: 'v1.0', editor: function () {
                return new myflow.editors.inputEditor();
            }
        }
    }, propsObj);

    $.extend(true, myflow.config.tools.states, {
        start: {
            showType: 'start_text',
            type: 'start',
            name: {text: '<<state>>'},
            text: {text: '开始'},
            img: {src: 'http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/start_event_empty.png', width: 48, height: 48},
            props: {
                name: {
                    name: 'name', label: '名称', value: '名称', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                text: {
                    name: 'text', label: '显示状态', value: '显示状态', editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                },
                action: {
                    name: 'action', label: '操作', value: '0', editor: function () {
                        return new myflow.editors.actionEditor();
                    }
                },
                copy: {
                    name: 'copy', label: '抄送', value: [], editor: function () {
                        return new myflow.editors.copyToEditor();
                    }
                },
                handlerType: {
                    name: 'handler', label: '处理人', value: [], editor: function () {
                        return new myflow.editors.handlerEditor('start');
                    }
                },
                turningType: {
                    name: 'turningType', label: '流转', value: '0', editor: function () {
                        return new myflow.editors.turningTypeEditor();
                    }
                },
                stepBatchEffect1: {
                    name: 'stepBatchEffect', label: '流程状态', value: '1', editor: function () {
                        return new myflow.editors.stepBatchEffectEditor();
                    }
                },
                stepBatchEffect: 1,
                isCancel: 2,
                isSave: 2,
                isEditor: 2,
                isSubmit: 2,
                isBack: 2,
                isBatchContent: 2,
                isAddress: 2,
                isTransfer: 2,
                isHerAsk: 2,
                saveName: '',
                editorName: '',
                submitName: '',
                backName: '',
                isRemind: 2,
                deealSelectedType: 1,
                transfer: 1,
                batchType: 1,
                remindUser: {
                    isCreateUser: 2,
                    isRole: 2,
                    isDepartManger: 2,
                    isPidHeader: 2,
                    isEleDepartManger: 2,
                    isFixe: 2,
                    role: [],
                    fixe: {},
                    fixeHtml: ''
                },
                dealUser: {
                    isCreateUser: 2,
                    isRole: 2,
                    isDepartManger: 2,
                    isPidHeader: 2,
                    isEleDepartManger: 2,
                    isFixe: 2,
                    userSelectedType: 1,
                    role: [],
                    fixe: {},
                    fixeHtml: ''
                }
            }
        },
        end: {
            showType: 'image', type: 'end',
            name: {text: '<<end>>'},
            text: {text: '结束'},
            img: {src: 'http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/end_event_terminate.png', width: 48, height: 48},
            attr: {width: 50, heigth: 50},
            props: {

                name: {
                    name: 'name', label: '名称', value: '结束', editor: function () {
                        return new myflow.editors.display();
                    }
                },
                text: '结束',
                copy: {
                    name: 'copy', label: '抄送', value: '0', editor: function () {
                        return new myflow.editors.copyToEditor();
                    }
                },
                isCancel: 2,
                isSave: 2,
                isFile: 2,
                isEditor: 2,
                isSubmit: 2,
                isBack: 2,
                isBatchContent: 2,
                isAddress: 2,
                isTransfer: 2,
                isHerAsk: 2,
                saveName: '',
                editorName: '',
                submitName: '',
                backName: '',
                isRemind: 2,
                deealSelectedType: 1,
                transfer: 1,
                batchType: 1,
                remindUser: {
                    isCreateUser: 2,
                    isRole: 2,
                    isDepartManger: 2,
                    isPidHeader: 2,
                    isEleDepartManger: 2,
                    isFixe: 2,
                    isDealUser: 2,
                    role: [],
                    fixe: {},
                    fixeHtml: ''
                },
                dealUser: {
                    isCreateUser: 2,
                    isRole: 2,
                    isDepartManger: 2,
                    isPidHeader: 2,
                    isEleDepartManger: 2,
                    isFixe: 2,
                    userSelectedType: 1,
                    role: [],
                    fixe: {},
                    fixeHtml: ''
                }
            }
        },
        state: {
            showType: 'text', type: 'state',
            name: {text: '<<state>>'},
            text: {text: '状态'},
            img: {src: 'http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/task_empty.png', width: 48, height: 48},
            props: {
                name: {
                    name: 'name', label: '名称', value: '名称', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                text: {
                    name: 'text', label: '显示状态', value: '显示状态', editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                },
                action: {
                    name: 'action', label: '操作', value: '0', editor: function () {
                        return new myflow.editors.actionEditor();
                    }
                },
                copy: {
                    name: 'copy', label: '抄送', value: '0', editor: function () {
                        return new myflow.editors.copyToEditor();
                    }
                },
                handlerType: {
                    name: 'handler', label: '处理人', value: '0', editor: function () {
                        return new myflow.editors.handlerEditor('<<state>>');
                    }
                },
                turningType: {
                    name: 'turningType', label: '流转', value: '0', editor: function () {
                        return new myflow.editors.turningTypeEditor();
                    }
                },
                stepBatchEffect1: {
                    name: 'stepBatchEffect', label: '流程状态', value: '1', editor: function () {
                        return new myflow.editors.stepBatchEffectEditor();
                    }
                },
                stepBatchEffect: 1,
                isCancel: 2,
                isSave: 2,
                isFile: 2,
                isEditor: 2,
                isSubmit: 2,
                isBack: 2,
                isBatchContent: 2,
                isAddress: 2,
                isTransfer: 2,
                isHerAsk: 2,
                saveName: '',
                editorName: '',
                submitName: '',
                backName: '',
                isRemind: 2,
                deealSelectedType: 1,
                transfer: 1,
                batchType: 1,
                remindUser: {
                    isCreateUser: 2,
                    isRole: 2,
                    isDepartManger: 2,
                    isPidHeader: 2,
                    isEleDepartManger: 2,
                    isFixe: 2,
                    isDealUser: 2,
                    role: [],
                    fixe: {},
                    fixeHtml: ''
                },
                dealUser: {
                    isCreateUser: 2,
                    isRole: 2,
                    isDepartManger: 2,
                    isPidHeader: 2,
                    isEleDepartManger: 2,
                    isFixe: 2,
                    userSelectedType: 1,
                    role: [],
                    fixe: {},
                    fixeHtml: ''
                }

            }
        }
    });
};
