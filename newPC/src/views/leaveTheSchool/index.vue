<template>
    <div class="leaveTheSchoolIndex">
        <!-- header start -->
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <el-button type="primary" size="medium" :loading="saveLoading" @click="updateElSchoolOverInit">保存
            </el-button>
            <el-button type="primary" size="medium" @click="handleReset">重置当日放学数据</el-button>
        </div>
        <!-- header end -->
        <!-- form start -->
        <div class="formWrapper" :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <el-form ref="form" :model="form">
                <el-form-item size="small">
                    <el-checkbox
                        v-model="form.isSendClassHeader"
                        :true-label="1"
                        :false-label="2"
                        @change="form.automaticSchool = 1"
                    >提醒班主任放学
                    </el-checkbox
                    >
                    <span style="margin-left: 20px;color:#e4393c;">(下午13：00至19：00才能正常使用)</span>
                </el-form-item>
                <el-form-item
                    size="small"
                    :key="index"
                    :label="item.gradeName"
                    v-if="form.isSendClassHeader == 1"
                    v-for="(item, index) in gradeSendTimeList"
                >
                    <el-time-picker
                        placeholder="任意时间点"
                        format="HH:mm"
                        value-format="HH:mm"
                        :picker-options="{
                            format: 'HH:mm'
                        }"
                        v-model="item.sendTime"
                    >
                    </el-time-picker>
                </el-form-item>
                <el-form-item size="small">
                    <el-checkbox
                        v-model="form.automaticSchool"
                        v-if="form.isSendClassHeader == 1"
                        :true-label="2"
                        :false-label="1"
                    >自动放学
                    </el-checkbox
                    >
                    <span
                        style="margin-left: 15px;"
                        v-if="(form.isSendClassHeader == 1) && (form.automaticSchool == 2)"
                    >
                        收到提醒
                        <el-select
                            class="automaticMin"
                            v-model="form.automaticMin"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in [10, 15, 20, 25, 30, 60]"
                                :key="item"
                                :value="item"
                            >
                            </el-option>
                        </el-select>
                        分钟后
                    </span>
                </el-form-item>
                <el-form-item size="small">
                    <p>放学权限</p>
                    <el-radio
                        v-model="form.isOverUserType"
                        :label="1"
                    >班主任或副班主任
                    </el-radio
                    >
                    <el-radio
                        v-model="form.isOverUserType"
                        :label="2"
                    >任课老师(如勾选任课老师，需通知客服进行设置)
                    </el-radio
                    >
                </el-form-item>
                <el-form-item size="small">
                    <el-checkbox v-model="form.isSendParent"
                                 :true-label="1"
                                 :false-label="2"
                    >放学后提醒家长
                    </el-checkbox
                    >
                </el-form-item>
                <el-form-item size="small">
                    <p>放学看板设置</p>
                    <div class="boardWrapper">
                        <!-- 放学看板列表 -->
                        <el-card class="boxCard showBox"
                                 shadow="hover"
                                 :key="index"
                                 v-for="(board, index) in clardGradeList"
                        >
                            <div class="boxCardHeader">
                                <span class="title">{{board.deviceName}}</span>
                                <span class="el-icon-close" @click="deleteBoard(index)"></span>
                            </div>
                            <div class="boxCardFooter">
                        <span
                            :key="index"
                            v-for="(grade, index) in board.gradeJson">{{grade.gradeName}}</span>
                            </div>
                        </el-card>
                        <!-- 新增 -->
                        <el-card class="boxCard createBox">
                            <el-select class="boxCardHeader"
                                       filterable
                                       placeholder="请选择看板"
                                       value-key="id"
                                       v-model="boardSelectVal">
                                <el-option
                                    v-for="item in classCardDeviceList"
                                    :key="item.id"
                                    :label="item.deviceName"
                                    :value="item">
                                </el-option>
                            </el-select>
                            <div class="boxCardFooter">
                                <div class="gradesList">
                                    <el-checkbox-group v-model="boardCheckGradeList">
                                        <el-checkbox
                                            :key="index"
                                            :label="classObj"
                                            v-for="(classObj, index) in gradeArry"
                                        >{{classObj.name}}
                                        </el-checkbox
                                        >
                                    </el-checkbox-group>
                                </div>
                                <div class="comfirm">
                                    <el-button type="primary" @click="addBoard">新增</el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-form-item>
                <el-form-item size="small">
                    <p>刷卡放学设置</p>
                    <el-checkbox
                        v-model="form.cardType"
                        :true-label="1"
                        :false-label="2"
                    >刷卡后直接放学
                    </el-checkbox
                    >
                </el-form-item>
                <el-form-item size="small">
                    <el-checkbox
                        v-model="form.isClub"
                        :true-label="1"
                        :false-label="2"
                    >关联校本课程
                    </el-checkbox
                    >
                </el-form-item>
            </el-form>
        </div>
        <!-- form end -->
    </div>
</template>

<script>
    import {getElSchoolOverInit, updateElSchoolOverInit, resetSchoolOver} from "@/api/leaveTheSchool/index";
    import mixin from '@/mixins/windowResize';

    export default {
        name: "leaveTheSchoolIndex",
        components: {},
        data() {
            return {
                // 保存按钮Loading状态 { Boolean } true | false
                saveLoading: false,
                // 重置按钮Loading状态 { Boolean } true | false
                resetLoading: false,
                // 每个年级的放学时间设置 { Array }
                gradeSendTimeList: [],
                // 放学看板展示数据 { Array }
                clardGradeList: [],
                // 新增放学看板设备下拉列表
                classCardDeviceList: [],
                // 新增放学看板设备选择框的值
                boardSelectVal: '',
                // 新增放学看板中年级多选框
                gradeArry: [],
                // 新增放学看板选中的年级组
                boardCheckGradeList: [],
                form: {
                    // 是否提醒班主任 { Number } 1(提醒) | 2(不提醒)
                    isSendClassHeader: 2,
                    // 是否自动放学 { Number } 1(不自动) | 2(自动)
                    automaticSchool: 1,
                    // 收到提醒后X分钟开始放学 { Number }
                    automaticMin: 10,
                    // 放学权限 { Number } 1(班主任/副班主任放学) | 2(任课老师放学)
                    isOverUserType: 1,
                    // 放学后提醒家长 { Number } 1(提醒) | 2(不提醒)
                    isSendParent: 2,
                    // 是否刷卡后放学 { Number } 1(直接放学) | 2(放学中)
                    cardType: 2,
                    isClub: 1
                }
            };
        },
        mixins: [mixin],
        created() {
            this.getElSchoolOverInit();
        },
        methods: {
            // 获取初始状态
            getElSchoolOverInit() {
                getElSchoolOverInit()
                    .then(res => res.data)
                    .then(res => {
                        if (res.code === 200) {
                            let data = res.data;
                            this.form.isSendClassHeader = data.elSchoolOverInit.isSendClassHeader;
                            this.form.automaticSchool = data.elSchoolOverInit.automaticSchool;
                            this.form.automaticMin = data.elSchoolOverInit.automaticMin || 10;
                            this.form.isOverUserType = data.elSchoolOverInit.isOverUserType;
                            this.form.isSendParent = data.elSchoolOverInit.isSendParent;
                            this.form.cardType = data.elSchoolOverInit.cardType;
                            this.form.isClub = data.elSchoolOverInit.isClub ? data.elSchoolOverInit.isClub : 1;
                            // 放学时间列表 和 放学看板展示列表
                            this.gradeSendTimeList = data.gradeSendTimeList;
                            this.clardGradeList = data.clardGradeList;
                            // 放学看板新增 下拉框列表 和 多选框组
                            this.classCardDeviceList = data.classCardDeviceList;
                            this.gradeArry = data.gradeArry;
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {
                        this.$message.error(res.msg);
                    });
            },
            // 更新放学模块设置
            updateElSchoolOverInit() {
                let error = false;
                let gradeSendTimeJsonStr = [];
                this.saveLoading = true;
                if (this.form.isSendClassHeader == 1) {
                    this.gradeSendTimeList.forEach(item => {
                        if (!item.sendTime && !error) {
                            this.$message.error('存在没有设置的选项');
                            error = true;
                            return;
                        }
                    });
                    if (error) {
                        this.saveLoading = false;
                        return;
                    } else
                        gradeSendTimeJsonStr = this.gradeSendTimeList;
                }
                if (this.form.automaticSchool == 1) {
                    this.form.automaticMin = 10;
                }
                updateElSchoolOverInit(Object.assign(this.form, {
                    gradeSendTimeJsonStr: JSON.stringify(gradeSendTimeJsonStr),
                    clardGradeJsonStr: JSON.stringify(this.clardGradeList),
                }))
                    .then(res => res.data)
                    .then(res => {
                        this.saveLoading = false;
                        if (res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: res.msg || '保存成功!'
                            });
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {
                        this.saveLoading = false;
                        this.$message.error(res.msg);
                    });
            },
            // 新增放学看板
            addBoard() {
                if (!this.boardSelectVal.deviceName) {
                    this.$message.error('请选择看板');
                    return;
                }
                if (this.boardCheckGradeList.length === 0) {
                    this.$message.error('请选择看板要展示的年级');
                    return;
                }
                let repeatBoard = false;
                this.clardGradeList.forEach(item => {
                    if (item.serialNo == this.boardSelectVal.serialNo && !repeatBoard) {
                        repeatBoard = true;
                    }
                });
                if (!repeatBoard) {
                    this.clardGradeList.push({
                        deviceName: this.boardSelectVal.deviceName,
                        gradeJson: this.boardCheckGradeList.map(item => (
                            {
                                gradeName: item.name,
                                gradeId: item.id
                            }
                        )),
                        serialNo: this.boardSelectVal.serialNo,
                    });
                } else {
                    this.$message.error('请勿重复设置该班牌！');
                }
            },
            // 删除放学看板
            deleteBoard(index) {
                this.clardGradeList.splice(index, 1);
            },
            // 点击重置按钮
            handleReset() {
                this.$confirm('重置后当日放学数据将清除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(() => {
                    this.resetSchoolOver();
                });
            },
            // 重置当日放学数据
            resetSchoolOver() {
                this.resetLoading = true;
                resetSchoolOver()
                    .then(res => res.data)
                    .then(res => {
                        this.resetLoading = false;
                        if (res.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '重置成功！'
                            })
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch(err => {
                        this.resetLoading = false;
                        this.$message.error(err.msg);
                    })
            },
            //返回
            goBack() {
                this.$router.back();
            }
        }
    };
</script>
<style lang="scss" scoped>
    .leaveTheSchoolIndex {
        padding:12px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .formWrapper {
            .el-form {
                width: 810px;
                padding: 20px;
                margin: 0 auto;
            }

            p {
                font-weight: bold;
                margin: 0;
            }

            .automaticMin.el-select {
                width: 65px;
            }

            .boardWrapper {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;

                .boxCard {
                    width: 270px;
                    margin: 0 10px 10px 0;

                    &.showBox {
                        .boxCardHeader {
                            display: flex;
                            line-height: 16px;

                            .title {
                                flex: 1;
                            }

                            .el-icon-close {
                                cursor: pointer;
                                color: #f08080;
                            }
                        }

                        .boxCardFooter {
                            span {
                                display: inline-block;
                                margin-right: 10px;
                            }
                        }
                    }

                    &.createBox {
                        .boxCardHeader {
                            width: 100%;
                            margin-bottom: 10px;
                        }

                        .boxCardFooter {
                            display: flex;

                            .gradesList {
                                flex: 0 0 172px;
                                width: 172px;

                                .el-checkbox {
                                    margin-right: 20px;
                                }
                            }

                            .comfirm {
                                flex: 1;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
