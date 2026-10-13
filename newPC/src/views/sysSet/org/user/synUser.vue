<template>
  <span>
       <el-button type="primary" size="mini" @click="dialogSynUserVisible = true">同步</el-button>
        <el-dialog :title="'同步【'+departName+'】下用户信息'" :visible.sync="dialogSynUserVisible"
                   :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false'>
            <div class="bs-callout bs-callout-danger" id="callout-glyphicons-dont-mix">
                <div class="info-title">1、同步会以系统中的部门创建规则为准向微信企业号进行同步。</div>
                <div class="info-title">2、为了避免双向操作带来的数据不一致的问题和保证通讯录的真实性，通讯录维护请只在此管理后台操作。</div>
                <div class="info-title">3、如果用户数据比较多，同步会比较慢，请您耐心等待同步结束。</div>
                <div class="info-title">4、如果微信中存在的用户系统中没有，则点击以微信为准同步。</div>
                <div class="info-title">5、如果系统中存在的用户微信中没有，则点击以系统为准同步。</div>
            </div>
           <div class="sns-btn-div">
               <template v-if="departType == 2">
                    <el-button type="primary" :loading="synLoading" @click="updateSyncFunc(1)">微信为准同步组织</el-button>
                    <el-button type="primary" :loading="synLoading" @click="updateSyncFunc(2)">系统为准同步组织</el-button>
               </template>
               <el-button v-else type="primary" :loading="synLoading" @click="syncDepart">同步组织</el-button>
               <el-button type="primary" :loading="synLoading" @click="syncUser(1)">微信为准同步用户</el-button>
               <el-button type="primary" :loading="synLoading" @click="syncUser(2)">系统为准同步用户</el-button>
           </div>
           <div>{{errInfo}}</div>
        </el-dialog>
  </span>
</template>
<script>
    import {syncDepart, syncUser, updateSync} from '@/api/systemSet/org.js';

    export default {
        props: {
            departName: {
                type: String,
                default: ""
            },
            departId: {
                type: Number,
                default: ""
            },
            departType: {
                type: Number,
            }
        },
        data() {
            return {
                lastMessageInstance: null,
                dialogSynUserVisible: false,
                synLoading: false,
                errInfo: ''
            }
        },
        beforeDestroy() {
            if (this.lastMessageInstance) {
                this.lastMessageInstance.close();
            }
        },
        methods: {
            syncDepart() {
                this.synLoading = true;
                syncDepart(this.departId).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let _this = this;
                        this.$message({
                            message: '同步成功！',
                            type: 'success',
                            duration: 1000,
                            onClose: function () {
                                // _this.dialogSynUserVisible=false;
                            }
                        });
                    } else {
                        if (data.code == 1005) {
                            this.lastMessageInstance = this.$message({
                                showClose: true,
                                dangerouslyUseHTMLString: true,
                                message: `<div style="max-height: 65px;overflow-y:auto;min-height: 16px;">${data.msg}</div>`,
                                type: 'warning',
                                duration: 0
                            });
                        } else {
                            this.$message.error(data.mes);
                        }
                    }
                    this.synLoading = false;
                }).catch(err => {
                    this.synLoading = false;
                });
            },
            updateSyncFunc(type) {
                this.synLoading = true;
                updateSync(this.departId, type)
                    .then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            let _this = this;
                            this.$message({
                                message: '同步成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    // _this.dialogSynUserVisible=false;
                                }
                            });
                        } else {
                            if (data.code == 1005) {
                                this.lastMessageInstance = this.$message({
                                    showClose: true,
                                    dangerouslyUseHTMLString: true,
                                    message: `<div style="max-height: 65px;overflow-y:auto;min-height: 16px;">${data.msg}</div>`,
                                    type: 'warning',
                                    duration: 0
                                });
                            } else {
                                this.$message.error(data.mes);
                            }
                        }
                        this.synLoading = false;
                    }).catch(err => {
                    this.synLoading = false;
                });
            },
            syncUser(type) {
                if (this.lastMessageInstance) {
                    this.lastMessageInstance.close();
                }
                new Promise(resolve => {
                    syncUser(this.departId, type)
                        .then(resolve)
                })
                    .then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            let _this = this;
                            this.$message({
                                message: '同步成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    // _this.dialogSynUserVisible=false;
                                }
                            });
                        } else {
                            if (data.code == 1005) {
                                this.lastMessageInstance = this.$message({
                                    showClose: true,
                                    dangerouslyUseHTMLString: true,
                                    message: `<div style="max-height: 65px;overflow-y:auto;min-height: 16px;">${data.msg}</div>`,
                                    type: 'warning',
                                    duration: 0
                                });
                            } else {
                                this.$message.error(data.mes);
                            }
                        }
                        this.synLoading = false;
                    }).catch(err => {
                    this.synLoading = false;
                });
            }
        }
    };
</script>
<style scoped>
    .sns-btn-div {
        height: 80px;
        padding-left: 20px;
        padding-top: 20px;
    }

    .bs-callout {
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #eee;
        border-left-width: 5px;
        border-radius: 3px;
    }

    .bs-callout-danger {
        border-left-color: #ce4844;
    }

    .info-title {
        line-height: 30px;
    }
</style>
