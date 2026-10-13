<template>
    <div class="campusCrdindexone">
        <div class="top">
            <el-select style="width:120px;" size="medium" v-model="query.gradeId" placeholder="请选择年级"
                       @change="changeGrade">
                <el-option v-for="item in gradelist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-select style="width:120px;" size="medium" v-model="query.classId" placeholder="请选择班级"
                       @change="changeClass">
                <el-option v-for="item in classlist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" size="medium"    v-if="isShowByPermission('/structure/campusCard/resetSchoolFriendsCard')" @click="resetSchoolFriendsCards()">一键解绑校友校园卡</el-button>
            <el-button type="primary" size="medium"   @click="Importone()">导入</el-button>
            <el-button type="primary" size="medium"   @click="deviceSetting()"
                       v-if="isShowByPermission('/campusCard/isManager')">读卡器设置
            </el-button>
            <el-button type="primary" size="medium"   @click="thermometerGun()"
                       v-if="isShowByPermission('/temperatureReport/temperatureReportSet')">体温枪绑卡
            </el-button>
            <el-button type="primary" size="medium"   @click="sourceSettings()"
                       v-if="isShowByPermission('/structure/campusCard/company')">来源设置
            </el-button>
            <el-input class="search-input search-input--right" size="medium" placeholder="请输入学生姓名"
                      v-model.trim="query.name" @input="findCardListones()">
                <el-button slot="append" icon="el-icon-search" @click="findCardListones()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="mydataList" border fit highlight-current-row style="width: 100%"
                  :height="maxH">
            <el-table-column label="学生姓名" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
              <span class="link" @click="campusCrdindexonedetails(scope.row.userId)">
                {{scope.row.userName}}
              </span>
                </template>
            </el-table-column>
              <el-table-column  label="班级" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.classDepartName}}
              </span>
            </template>
        </el-table-column>
            <el-table-column align="center" label="学生卡SID1" v-if="maxSidCount>0" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[0]">
              {{scope.row.sids[0]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID2" v-if="maxSidCount>1" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[1]">
              {{scope.row.sids[1]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID3" v-if="maxSidCount>2" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[2]">
              {{scope.row.sids[2]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID4" v-if="maxSidCount>3" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[3]">
              {{scope.row.sids[3]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID5" v-if="maxSidCount>4" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[4]">
              {{scope.row.sids[4]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID6" v-if="maxSidCount>5" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[5]">
              {{scope.row.sids[5]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID7" v-if="maxSidCount>6" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[6]">
              {{scope.row.sids[6]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID8" v-if="maxSidCount>7" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[7]">
              {{scope.row.sids[7]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID9" v-if="maxSidCount>8" show-overflow-tooltip>
                <template slot-scope="scope">
            <span v-if="scope.row.sids[8]">
              {{scope.row.sids[8]}}
            </span>
                    <span v-else>----</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生卡SID10" v-if="maxSidCount>9" show-overflow-tooltip>
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
                <div class="name">学生姓名：</div>
                <div class="input">{{studentName}}</div>
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
				<el-button type="primary" @click="addCampusCardones()">确 定</el-button>
			</span>
        </el-dialog>

    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {
        findCardListone,
        addCampusCardone,
        findGradeListByRole2,
        findClassListByRole2,
        listBySchoolId,resetSchoolFriendsCard
    } from '@/api/campusCrd';
    import {isShowByPermission} from '@/utils/utils';

    export default {
        data() {
            return {
                dataList: [],
                mydataList: [],
                classlist: [],
                gradelist: [],
                maxSidCount: 0,
                dialogVisible: false,
                studentId: '',
                sid: '',
                studentName: '',
                query: {
                    classId: '',
                    gradeId: '',
                    name: ""
                },
                sourcelist: [],
                companyCode: ""
            }
        },
        created() {
            this.findGradeListByRole2s();
            this.findSchoolDicsByCodes();
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        mixins: [mixin],
        methods: {
            resetSchoolFriendsCards(){
                 this.$confirm("确认要一键解绑校友校园卡吗？", "一键解绑校友校园卡", { 
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                        lockScroll: false
                    }).then(() => {         
                        resetSchoolFriendsCard().then(res => {
                            if (res.data.code === 200) {
                            this.$message.success("一键解绑校友校园卡成功");
                            this.findGradeListByRole2s();
                            this.findSchoolDicsByCodes();
                            } else {
                            this.$message.error(res.data.msg);
                            }
                        });
                        })
                .catch(() => {});
            },
            isShowByPermission,
            //获取年级
            findGradeListByRole2s() {
                findGradeListByRole2().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.gradelist = data.data;
                            if (data.data.length > 0) {
                                this.query.gradeId = data.data[0].id;
                                this.findClassListByRole2s(data.data[0].id)
                            }
                        }
                    })
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
            //获取班级
            findClassListByRole2s() {
                findClassListByRole2(this.query.gradeId).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (data.data.length > 0) {
                                this.query.classId = data.data[0].id;
                                this.classlist = data.data;
                                this.findCardListones();
                            }
                        }
                    })
            },
            //切换年级
            changeGrade() {
                this.findClassListByRole2s();
            },
            //切换班级
            changeClass() {
                this.findCardListones();
            },
            //弹框
            dialogVisiblefun(studentId, studentName) {
                this.studentId = studentId;
                this.studentName = studentName;
                this.dialogVisible = true;
                this.$nextTick(function () {
                    this.$refs.customerInput.$el.querySelector('input').focus();
                });
            },
            // //搜索
            // inputsearchNametime() {
            //     this.mydataList = []
            //     for (let i = 0; i < this.dataList.length; i++) {
            //         if (this.dataList[i].studentName.indexOf(this.name) != -1) {
            //             this.mydataList.push(this.dataList[i])
            //         }
            //     }
            // },
            //获取列表
            findCardListones() {
                if ((!this.query.classId) || (!this.query.gradeId)) {
                    return;
                }
                findCardListone(this.query).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.dataList = data.data.cardList_final;
                            this.mydataList = data.data.cardList_final;
                            this.maxSidCount = data.data.maxSidCount;
                        }
                    })
            },
            //跳转详情
            campusCrdindexonedetails(studentId) {
                this.$router.push({
                    path: "campusCrdindexonedetails",
                    query: {studentId: studentId}
                });
            },
            //设置
            deviceSetting() {
                this.$router.push({
                    path: "deviceSetting"
                });
            },
            //体温枪
            thermometerGun() {
                this.$router.push({
                    path: "thermometerGun"
                });
            },
            sourceSettings() {
                this.$router.push({
                    path: "sourceSettings"
                });
            },
            //导入
            Importone() {
                this.$router.push({
                    path: "Importone"
                });
            },
            //卡库
            lukaku() {
                this.$router.push({
                    path: "lukaku"
                });
            },
            //绑卡
            addCampusCardones() {
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
                addCampusCardone(this.sid, this.studentId, this.companyCode, name).then(res => res.data).then(data => {
                    if (data.code == 200) {
                        this.$message({message: "新增校园卡成功!", type: "success", duration: 1000});
                        this.sid = '';
                        this.dialogVisible = false;
                        this.findCardListones();
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
    .campusCrdindexone {
        padding: 12px;
        box-sizing: border-box;

        .top {
            padding-bottom: 10px;
            overflow: hidden;
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
