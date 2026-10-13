<template>
    <div id="formAddEdit">
        <div style="height: 700px; overflow-y: auto;position: relative;">
            <div id="wxcep-dialog"></div>
            <div id="myflow_tools" class="tools">
                <div id="myflow_tools_handle" class="tools__header" style="text-align: center;"> 工具集
                </div>

                <div class="tools__section">
                    <div class="node" id="return_page"><img style="width: 16px;height: 16px;"
                                                            src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/return-page.png"/>&nbsp;&nbsp;返回
                    </div>
                    <div class="node selectable selected" id="pointer"><img
                        src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/select16.gif"/>&nbsp;&nbsp;选择
                    </div>
                    <div class="node selectable" id="path"><img
                        src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/flow_sequence_16.png"/>&nbsp;&nbsp;流转
                    </div>
                    <div class="node selectable" id="delete"><i class="fa fa-close"></i>&nbsp;&nbsp;删除
                    </div>
                </div>
                <div class="tools__section">
                    <div class="node state" id="start" type="start"><img
                        src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/start_event_empty_16.png"/>&nbsp;&nbsp;开始
                    </div>
                    <div class="node state" id="state" type="state"><img
                        src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/task_empty_16.png"/>&nbsp;&nbsp;环节
                    </div>
                    <div class="node state" id="end" type="end"><img
                        src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/end_event_terminate_16.png"/>&nbsp;&nbsp;结束
                    </div>
                </div>
                <div class="tools__section">
                    <div class="node" id="myflow_publish"><img
                        src="http://cdnfile-10043692.file.myqcloud.com/admin/images/workflow/save.gif"/>&nbsp;&nbsp;保存
                    </div>
                </div>
            </div>
            <div id="myflow_props" class="props">
                <div id="myflow_props_handle" class="props__header">属性</div>
                <div id="prop-table-container">
                    <table cellpadding="0" cellspacing="0">
                    </table>
                </div>
            </div>

            <div id="myflow"></div>
        </div>
    </div>
</template>

<script>
    import {getAllRoleList} from '@/api/systemSet/org';

    import Cookies from 'js-cookie';
    import {loadScript, loadStyle, getDicByCode} from '@/utils/utils';
    import {getWorkFlowById} from '@/api/flow';

    export default {
        name: "flowAddEdit",
        beforeDestroy() {
            $('[class*="-temp1"]').remove();
        },
        mounted() {
            window.token = Cookies.get('Admin-Token');
            window.schoolId = this.$store.getters.schoolInfo.id;
            window.cepPath = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/wxcepClient1' : 'https://api.weixiaojia.net/wxcepClient1';
            window.workFlowId = this.$route.query.id;
            window.workFlowJson = '{}';
            const path = window.location.href.split('#')[0];
            let prefix = '';
            if(path.includes('localhost')) {
                prefix = `${path}/static/flowLib`;
            } else {
                prefix = `${path}/flowLib`;

            }

            new Promise(resolve => {
                if(window.workFlowId) {
                    getWorkFlowById({
                        workFlowId: window.workFlowId
                    })
                        .then(res => res.data)
                        .then(data => {
                            window.workFlowJson = data.data.workFlowJson;
                            resolve();
                        })
                } else {
                    resolve();
                }

            })
                .then(() => {
                    getAllRoleList()
                        .then(res => res.data)
                        .then(data => {
                            window.roleList = data.data;
                            getDicByCode('workFlow')
                                .then(data => {
                                    window.sysDictionaryList = data;
                                    if($('.address-style-temp').length === 0) {
                                        loadStyle('https://cdnfile-10043692.file.myqcloud.com/lib/bootstrap_3.0.3.min.css', {className: 'bootstrap-style-temp'});
                                        loadStyle('https://cdnfile-10043692.file.myqcloud.com/lib/boostrap-select/bootstrap-select.min.css', {className: 'bootstrap-select-style-temp'});
                                        loadStyle(prefix + '/address3.css', {className: 'address-style-temp'});
                                        loadStyle(prefix + '/workflow.css', {className: 'workflow-style-temp'});
                                        loadStyle(prefix + '/common.css', {className: 'common-style-temp'});

                                        loadScript(prefix + '/jquery.js', {className: 'jquery-temp'})
                                            .then(() => {
                                                loadScript('https://cdnfile-10043692.file.myqcloud.com/admin/js/raphael-min.js', {className: 'raphael-temp'})
                                                    .then(() => {
                                                        loadScript(prefix + '/jquery-ui.js', {className: 'jqui-temp'})
                                                            .then(() => {
                                                                loadScript(prefix + '/wxcep_address3.js', {className: 'address-temp'});
                                                                loadScript(prefix + '/wxcep_common.js', {className: 'wxcep-common-temp'});
                                                                loadScript(prefix + '/wxcep_tools.js', {className: 'wxcep-tool-temp'});
                                                                loadScript(prefix + '/bootstrap.js', {className: 'bootstrap-temp'})
                                                                    .then(() => {
                                                                        loadScript(prefix + '/boot-box.js', {className: 'bootbox-temp'});
                                                                        loadScript(prefix + '/bootstrap-select.js', {className: 'bootstrap-select'});
                                                                        setTimeout(() => {
                                                                            loadScript(prefix + '/myflow.jpdl4.js', {className: 'myflow-jpdl4-temp1'});
                                                                            loadScript(prefix + '/myflow.editors.js?ver=3', {className: 'myflow-editors-temp1'});
                                                                            loadScript(prefix + '/workflow.js?ver=3', {className: 'workflow-temp1'});
                                                                            loadScript(prefix + '/myflow.js?ver=3', {className: 'myflow-temp1'});
                                                                        }, 500);


                                                                    });
                                                            })
                                                    })
                                            });

                                    } else{
                                        setTimeout(() => {
                                            loadScript(prefix + '/myflow.jpdl4.js', {className: 'myflow-jpdl4-temp'});
                                            loadScript(prefix + '/myflow.editors.js?ver=3', {className: 'myflow-editors-temp'});
                                            loadScript(prefix + '/workflow.js?ver=3', {className: 'workflow-temp'});
                                            loadScript(prefix + '/myflow.js?ver=3', {className: 'myflow-temp'});
                                        }, 500);

                                    }


                                })
                        });
                })
        }
    }
</script>
<style lang="scss">

</style>
