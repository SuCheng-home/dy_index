<template>
    <div class="campusCrdindexthree">
        <div class="top">
            <a :href="exportURL" download="导出" target="_blank" v-if="dataList.length">
                <el-button size="medium" class="filter-item" type="primary">导出</el-button>
            </a>
            <el-upload class="upload-import" name='userfile' accept=".xls" :action="uploadPath"
                       :data="uploadData" :show-file-list='false' :before-upload="beforeAvatarUpload"
                       :on-success="handleAvatarSuccess">
                <el-button type="primary" size="medium">导入</el-button>
            </el-upload>
            <el-button type="primary" size="medium"   @click="resetClassCards()">清空班级卡
            </el-button>
            <el-input class="search-input search-input--right" size="medium" placeholder="请输入卡号"
                      v-model.trim="name" @input="findCardListthrees()">
                <el-button slot="append" icon="el-icon-search" @click="findCardListthrees()"></el-button>
            </el-input>
        </div>

        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                  :height="maxH">
            <el-table-column label="班级名称" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
              <span class="link" @click="campusCrdindexthreedetails(scope.row.classDepartId)">
                {{scope.row.classDepartName}}
              </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID1" v-if="maxSidCount>0" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[0]">
              {{scope.row.sids[0]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID2" v-if="maxSidCount>1" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[1]">
              {{scope.row.sids[1]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID3" v-if="maxSidCount>2" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[2]">
              {{scope.row.sids[2]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID4" v-if="maxSidCount>3" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[3]">
              {{scope.row.sids[3]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID5" v-if="maxSidCount>4" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[4]">
              {{scope.row.sids[4]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID6" v-if="maxSidCount>5" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[5]">
              {{scope.row.sids[5]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID7" v-if="maxSidCount>6" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[6]">
              {{scope.row.sids[6]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID8" v-if="maxSidCount>7" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[7]">
              {{scope.row.sids[7]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID9" v-if="maxSidCount>8" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[8]">
              {{scope.row.sids[8]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级卡SID10" v-if="maxSidCount>9" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[9]">
              {{scope.row.sids[9]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <el-button size="small" type="text" 
                               @click="dialogVisiblefun(scope.row.classDepartId,scope.row.classDepartName)">绑卡
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增绑卡（如无读卡器请认真核对卡号）" :close-on-press-escape='false' :close-on-click-modal='false'
                   :visible.sync="dialogVisible" width="700px" :lock-scroll="false"
                   :modal-append-to-body='false'>
            <div class="input-box">
                <div class="name">班级：</div>
                <div class="input">{{className}}</div>
            </div>
            <div class="input-box">
                <div class="name"><span>* </span>卡号：</div>
                <div class="input">
                    <el-input :maxlength="30" ref="customerInput" v-model.trim="sid"
                              oninput="value=value.replace(/[\W]/g,'')" size="medium"
                              placeholder="请输入卡号"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCampusCardthrees()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import {mapGetters} from "vuex";
    import {findCardListthree, addCampusCardthree, resetClassCard, findClassCardList} from "@/api/campusCrd";
    import {isShowByPermission} from "@/utils/utils";

    export default {
        data() {
            return {
                dataList: [],
                maxSidCount: 0,
                dialogVisible: false,
                classId: "",
                sid: "",
                className: "",
                name: "",
                exportURL: "",
                uploadPath: global.newcard + "structure/campusCard/importClassCard",
                uploadData: {
                    token: this.$store.getters.token
                }
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
        },
        created() {
            this.findCardListthrees();
        },
        computed: {
            ...mapGetters(["userInfo"])
        },
        mixins: [mixin],
        methods: {
            isShowByPermission,
            //弹框
            dialogVisiblefun(classId, className) {
                this.classId = classId;
                this.className = className;
                this.dialogVisible = true;
                this.$nextTick(function () {
                    this.$refs.customerInput.$el.querySelector("input").focus();
                });
            },
            //清空
            resetClassCards() {
                this.$confirm('此操作将清空班级卡, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetClassCard().then(res => {
                        this.$message({
                            type: 'success',
                            message: '清空成功!'
                        });
                        this.findCardListthrees();
                    }).catch();

                }).catch(() => {
                });

            },
            //获取列表
            findCardListthrees() {
                this.exportURL = `${global.newcard}structure/campusCard/exportClassCardList?token=${this.$store.getters.token}`;
                if (this.name) {
                    findClassCardList(this.name)
                        .then(res => res.data)
                        .then(data => {
                            if (data.code === 200) {
                                this.dataList = data.data.classCardList;
                                this.maxSidCount = data.data.maxSidCount;
                            }
                        });

                } else {
                    findCardListthree()
                        .then(res => res.data)
                        .then(data => {
                            if (data.code === 200) {
                                this.dataList = data.data.classCardList_final;
                                this.maxSidCount = data.data.maxSidCount;
                                this.$nextTick(() => {
                                    this.timer = setTimeout(() => {
                                        this.$refs.table.doLayout()
                                    }, 300)
                                })
                            }
                        });
                }

            },
            //跳转详情
            campusCrdindexthreedetails(classId) {
                this.$router.push({
                    path: "campusCrdindexthreedetails",
                    query: {classId: classId}
                });
            },
            //导入
            handleAvatarSuccess(res) {
                if (res.code == 200) {
                    this.$message({
                        message: "导入成功！",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.msg);
                }
                this.findCardListthrees();
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix !== 'xls') {
                    this.$message.error("请上传后缀为.xls的模版文件!");
                    return false;
                }
            },
            //绑卡
            addCampusCardthrees() {
                if (!this.sid) {
                    this.$message.error("请输入卡号");
                    return;
                }
                addCampusCardthree(this.sid, this.classId)
                    .then(res => res.data)
                    .then(data => {
                        if (data.code == 200) {
                            this.$message({
                                message: "新增校园卡成功!",
                                type: "success",
                                duration: 1000
                            });
                            this.sid = "";
                            this.dialogVisible = false;
                            this.findCardListthrees();
                        }
                        if (data.code == 1005) {
                            this.$message.error(data.msg);
                            this.sid = "";
                            this.dialogVisible = false;
                        }
                    });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .campusCrdindexthree {
        padding: 12px;
        box-sizing: border-box;

        .link {
            color: #409eff;
            cursor: pointer;
        }

        .upload-import {
            display: inline-block;
        }

        .top {
            padding-bottom: 10px;
        }

        .input-box {
            overflow: hidden;
            line-height: 36px;
            margin: 10px 0;

            .name {
                width: 100px;
                text-align: right;
                font-size: 14px;
                padding-right: 10px;
                float: left;

                span {
                    color: red;
                }
            }

            .input {
                float: left;
                width: 500px;
            }
        }
    }
</style>
