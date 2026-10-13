<template>
    <div class="campusCrdindextwo">
        <div class="top">
            <el-button type="primary" size="medium"   @click="Importtwo()">导入</el-button>
            <el-input class="search-input search-input--right" size="medium" placeholder="请输入老师姓名"
                      v-model.trim="name" @input="inputsearchNametime()">
                <el-button slot="append" icon="el-icon-search" @click="inputsearchNametime()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="mydataList" border fit highlight-current-row style="width: 100%"
                  :height="`${maxH}px`">
            <el-table-column label="老师姓名" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
              <span class="link" @click="campusCrdindextwodetails(scope.row.userId)">
                {{scope.row.userName}}
              </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID1" v-if="maxSidCount>0" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[0]">
              {{scope.row.sids[0]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID2" v-if="maxSidCount>1" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[1]">
              {{scope.row.sids[1]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID3" v-if="maxSidCount>2" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[2]">
              {{scope.row.sids[2]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID4" v-if="maxSidCount>3" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[3]">
              {{scope.row.sids[3]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID5" v-if="maxSidCount>4" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[4]">
              {{scope.row.sids[4]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID6" v-if="maxSidCount>5" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[5]">
              {{scope.row.sids[5]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID7" v-if="maxSidCount>6" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[6]">
              {{scope.row.sids[6]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID8" v-if="maxSidCount>7" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[7]">
              {{scope.row.sids[7]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID9" v-if="maxSidCount>8" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[8]">
              {{scope.row.sids[8]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="老师卡SID10" v-if="maxSidCount>9" show-overflow-tooltip>
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
                               @click="dialogVisiblefun(scope.row.userId,scope.row.userName)">绑卡
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增绑卡（如无读卡器请认真核对卡号）" :close-on-press-escape='false' :close-on-click-modal='false'
                   :visible.sync="dialogVisible" width="700px" :lock-scroll="false"
                   :modal-append-to-body='false'>
            <div class="input-box">
                <div class="name">老师姓名：</div>
                <div class="input">{{teacherName}}</div>
            </div>
            <div class="input-box">
                <div class="name"><span>* </span>卡号：</div>
                <div class="input">
                    <el-input :maxlength="30" ref="customerInput" v-model.trim="sid"
                              oninput="value=value.replace(/[\W]/g,'')" size="medium"
                              placeholder="请输入卡号"></el-input>
                </div>
            </div>
            <div class="input-box" v-if="sourcelist.length>1">
                <div class="name"><span>* </span>来源：</div>
                <div class="input">
                    <el-radio-group v-model="companyCode">
                        <el-radio :label="item.code" v-for="(item,index) in sourcelist" :key="index">
                            {{item.value}}
                        </el-radio>
                    </el-radio-group>

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCampusCardtwos()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {findCardListtwo, addCampusCardtwo, listBySchoolId} from '@/api/campusCrd';
    import {isShowByPermission} from '@/utils/utils';

    export default {
        data() {
            return {
                dataList: [],
                mydataList: [],
                maxSidCount: 0,
                dialogVisible: false,
                teacherId: '',
                sid: '',
                teacherName: '',
                name: '',
                sourcelist: [],
                companyCode: ""
            }
        },
        created() {
            this.findCardListtwos();
            this.findSchoolDicsByCodes();
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        mixins: [mixin],
        methods: {
            isShowByPermission,
            //弹框
            dialogVisiblefun(teacherId, teacherName) {
                this.teacherId = teacherId;
                this.teacherName = teacherName;
                this.dialogVisible = true;
                this.$nextTick(function () {
                    this.$refs.customerInput.$el.querySelector('input').focus();
                });
            },
            findSchoolDicsByCodes() {
                listBySchoolId().then(res => res.data).then(data => {
                    if (data.code === 200) {
                        let mydata = data.data;
                        this.sourcelist = mydata;
                        if (this.sourcelist.length) {
                            this.companyCode = this.sourcelist[0].code;
                        }
                    }
                })
            },
            //搜索
            inputsearchNametime() {
                this.mydataList = []
                for (let i = 0; i < this.dataList.length; i++) {
                    if (this.dataList[i].userName.indexOf(this.name) != -1) {
                        this.mydataList.push(this.dataList[i])
                    }
                }
            },
            //获取列表
            findCardListtwos() {
                findCardListtwo().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.dataList = data.data.teacherCardList_final;
                            this.mydataList = data.data.teacherCardList_final;
                            this.maxSidCount = data.data.maxSidCount;
                        }
                    })
            },
            //跳转详情
            campusCrdindextwodetails(teacherId) {
                this.$router.push({
                    path: "campusCrdindextwodetails",
                    query: {teacherId: teacherId}
                });
            },
            //导入
            Importtwo() {
                this.$router.push({
                    path: "Importtwo"
                });
            },
            //绑卡
            addCampusCardtwos() {
                if (!this.sid) {
                    this.$message.error('请输入卡号');
                    return;
                }
                ;
                if (!this.companyCode) {
                    this.$message.error('请输创建来源');
                    return;
                }
                let name = "";
                for (let i = 0; i < this.sourcelist.length; i++) {
                    if (this.companyCode == this.sourcelist[i].code) {
                        name = this.sourcelist[i].value
                    }
                }
                addCampusCardtwo(this.sid, this.teacherId, this.companyCode, name).then(res => res.data).then(data => {
                    if (data.code == 200) {
                        this.$message({message: "新增校园卡成功!", type: "success", duration: 1000});
                        this.sid = '';
                        this.dialogVisible = false;
                        this.findCardListtwos();
                    }
                    ;
                    if (data.code == 1005) {
                        this.$message.error(data.msg);
                        this.sid = '';
                        this.dialogVisible = false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .campusCrdindextwo {
        padding: 12px;
        box-sizing: border-box;

        .top {
            padding-bottom: 10px;
            overflow: hidden;

            .search-input--right {
                width: 240px !important;
                float: right;
            }
        }

        .link {
            color: #409eff;
            cursor: pointer;
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
                    color: red
                }
            }

            .input {
                float: left;
                width: 500px;
            }
        }
    }
</style>
