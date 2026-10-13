<template>
    <div class="app-container officeManager">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <a :href="exportURL" download="导出结果" target="_blank" v-if="tableData.length">
                        <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
                    </a>
                    <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false'
                               :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                        <el-button type="primary" size="medium">导入</el-button>
                    </el-upload>
                    <el-button class="filter-item" type="primary" v-if="listQuery.type == 3 || listQuery.type == 4" size="medium" @click="syncFunc()">同步到企业微信</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入内容查找" size="medium" icon="el-icon-search" class="search-input"
                              v-model.trim="listQuery.name" @keyup.enter.native="contSearch">
                        <el-button slot="append" icon="el-icon-search" @click="contSearch"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="main-wrap">
            <el-table stripe :data="tableData" border v-loading.body="listLoading" :height="maxH">
                <el-table-column label="名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.departName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="主任" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.userName&&scope.row.userName!==''">{{scope.row.userName}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column label="副主任" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.otherUserNames&&scope.row.otherUserNames!==''">{{scope.row.otherUserNames }}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="setHandler(scope.row)">
                            设置
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="btns">
                <el-radio-group v-model="listQuery.type" @change="typeChange">
                    <el-radio :label="7">部门主任</el-radio>
                    <el-radio :label="3">年级主任</el-radio>
                    <el-radio :label="4">班主任</el-radio>
                </el-radio-group>
            </div>
        </div>
        <el-dialog title="导入提示" :visible.sync="dialogVisible" size="tiny">
            <div v-html="dataname"></div>
            <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import debounce from 'lodash/debounce';
    import {master, updateDepartManagerSyncWxDepartAdmins} from '@/api/system';

    export default {
        data() {
            return {
                listQuery: {
                    name: '',
                    type: null
                },
                listLoading: false,
                tableData: [],
                exportURL: '',
                type: this.$route.query.type,
                dataname: '',
                dialogVisible: false,
                uploadPath: global.BaseNewPath + "sys/depart/master/updateImport",
                uploadData: {
                    type: null,
                    token: this.$store.getters.token,
                }
            }
        },
        created() {
            if (this.type) {
                this.listQuery.type = this.type;
                this.uploadData.type = this.type
            } else {
                this.listQuery.type = 7;
                this.uploadData.type = 7;
            }
            this.masterFunc();
        },
        mounted() {

        },
        mixins: [mixin],
        methods: {
            contSearch: debounce(function () {
                this.masterFunc();
            }, 500),
            syncFunc() {
                updateDepartManagerSyncWxDepartAdmins({
                    departType: this.listQuery.type
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('同步企业微信成功');
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            typeChange(val) {
                this.listQuery.type = val;
                this.uploadData.type = val;
                this.masterFunc();
            },
            setHandler(row) {
                this.$router.push({
                    name: 'officeManagerEdit',
                    params: {
                        row: row,
                        type: this.listQuery.type
                    }
                })
            },
            masterFunc() {
                this.listLoading = true;
                master({
                    name: this.listQuery.name,
                    type: this.listQuery.type
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.tableData = data.data;
                            this.exportURL = global.BaseNewPath + 'sys/depart/master/exportByDepartType?type=' + this.listQuery.type + '&token=' + this.$store.getters.token;
                            this.listLoading = false;
                        }
                    }).catch(() => {
                    this.listLoading = false;
                })
            },
            //导入
            handleAvatarSuccess(res) {
                if (res.code == 200) {
                    this.$message({
                        message: "模版导入成功！",
                        type: "success"
                    });
                    this.listLoading = false;
                    if (res.msg && (res.msg != 'ok')) {
                        this.dialogVisible = true;
                        this.dataname = res.msg;
                    }
                    ;
                    this.masterFunc();
                } else {
                    this.dialogVisible = true;
                    this.dataname = res.msg;
                    this.listLoading = false;
                    this.masterFunc();
                }
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix !== "xls" && suffix !== "xlsx" && suffix !== "csv") {
                    this.$message.error("请上传后缀为.xls,.xlsx,.csv的模版文件!");
                    return false;
                } else {
                    this.listLoading = true;
                    this.masterFunc();
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .header {
        margin-bottom: 10px;
    }

    .btns {
        padding-top: 20px;
    }

    .upload-import {
        display: inline-block;
    }
</style>
<style scoped>
    .officeManager .el-input__icon + .el-input__inner {
        padding-right: 30px !important;
    }
</style>
