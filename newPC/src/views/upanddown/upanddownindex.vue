<template>
    <div class="campusFeesSetup">
        <div class="campusFeesSetup-top">
            <el-button type="primary" v-if="data.length!=0" size="medium" @click="emptyAlls()">重置</el-button>
            <el-button type="primary" v-else size="medium" @click="upanddownadd(0)">设置</el-button>
        </div>

        <div>
            <div class="block" :style="`height: ${nobottommaxH}px;`" v-if="data.length>0">
                <p class="top-p">上下级配置</p>
                <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{node,data}">
                    <span><span class="name">{{data.name}}</span><span class="post">{{data.position}}</span></span>
                    <span class="operation">  
                            <i class="el-icon-circle-plus" @click="() => upanddownadd(data.id)" title="添加"></i>
                            <i class="el-icon-remove" @click="() => remove(data.id)" title="删除"
                               v-show="node.childNodes.length==0"></i>
                            <i class="el-icon-edit" @click="() => upanddownedit(data.id,data.position)" title="编辑"></i>
                    </span>
              </span>
                </el-tree>
            </div>
            <div class="Notime" v-else>暂无上下级配置,请设置</div>
        </div>
    </div>
</template>
<script>
    import {relationTrees, delLowerLevel, emptyAll} from '@/api/upanddown';
    import mixin from '@/mixins/windowResize';

    export default {
        name: 'upanddownindex',

        data() {
            return {
                data: []
            }
        },
        mixins: [mixin],
        created() {
            this.relationTreess()
        },
        methods: {
            //添加上下级
            upanddownadd(id) {
                this.$router.push({
                    path: "upanddownadd",
                    query: {id: id}
                });
            },
            //删除上下级 
            remove(id) {
                this.$confirm("确定要删除吗？", "提示", {type: "warning"}).then(() => {
                    delLowerLevel(id).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.relationTreess()
                        }
                    }).catch(err => {
                    });
                }).catch(() => {
                });

            },
            //编辑
            upanddownedit(id, position) {
                this.$router.push({
                    path: "upanddownedit",
                    query: {id: id, position: position}
                });
            },
            //获取详情
            relationTreess() {
                relationTrees().then(res => {
                    if (res.data.data) {
                        this.data = res.data.data;
                    } else {
                        this.data = [];
                    }

                }).catch(err => {
                });
            },
            //重置
            emptyAlls() {
                this.$confirm("确定要重置吗？", "提示", {type: "warning"}).then(() => {
                    emptyAll().then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: "重置成功!"
                            });
                            this.relationTreess()
                        }
                    }).catch(err => {
                    });
                }).catch(() => {
                });

            }


        }
    };
</script>

<style lang="scss" scoped>
    .campusFeesSetup {
        padding:12px;
    }

    .campusFeesSetup-top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }

    .block {
        padding: 0 0 0 20px;
        overflow: auto;
        font-size: 14px;
        color: #555;
        font-weight: 600;
    }

    .block span {
        display: inline-block;
    }

    .block .top-p {
        font-size: 24px;
        font-weight: 600;
        color: #000;
    }

    .block .name {
        margin-right: 15px;
    }

    .block .post {
        color: #888;
        margin-right: 15px;
    }

    .operation i {
        color: #fff;
        margin: 0 5px 0 0;
    }

    .custom-tree-node:hover i {
        color: #bbb;
    }

    .operation i:hover {
        color: #409eff;
    }

    .operation .el-icon-remove:hover {
        color: #f56c6c;
    }

    .Notime {
        font-size: 30px;
        color: #666;
        font-weight: 600;
        line-height: 200px;
        text-align: center;
    }

</style>
<style scoped>
    .block .el-tree-node__content {
        padding: 15px 20px;
    }
</style>
