<template>
    <div class="planSummary" style="padding:10px">
        <div class="top">
            <el-button type="primary" :disabled='!hideshow' size="medium" @click="addWorkPlans('ruleForm',3)">
                发布
            </el-button>
            <el-button type="primary" :disabled='!hideshow' size="medium" @click="addWorkPlans('ruleForm',4)">
                预览
            </el-button>
        </div>
        <div class="subject" :style="`height: ${maxH-20}px;`">
            <div class="body">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px"
                         class="demo-ruleForm">
                    <el-form-item label="计划名称" prop="title">
                        <el-input v-model.trim="ruleForm.title" :maxlength="50"
                                  @blur="textareablur()"></el-input>
                    </el-form-item>
                    <el-form-item label="工作计划时间范围" prop="dateRange">
                        <el-date-picker
                            v-model="ruleForm.startDate"
                            forma="yyyy-MM-dd"
                            type="date"
                            placeholder="开始日期"
                            @change="changetime()"
                        >
                        </el-date-picker>
                        至
                        <el-date-picker
                            v-model="ruleForm.endDate"
                            forma="yyyy-MM-dd"
                            type="date"
                            placeholder="结束日期"
                            @change="changetime()"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="工作计划明细" v-show="hideshow">
                        <div class="boxli" :key="indexs" v-for="(items,indexs) in dataList">
                                    <span class="title">{{items.departName}} <i class="el-icon-plus my-el-icon-plus"
                                                                                title="添加计划"
                                                                                @click="rangadd(indexs)"></i></span>

                            <div class="li" :key="index" v-for="(item,index) in items.workPlanDetailModelList">
                                <span class="content">{{item.planContent}}</span>
                                <span class="name">{{item.dutyUserName}}</span>
                                <i class="el-icon-upload2" title="上移" @click="Moveupward(indexs,index)"></i>
                                <i class="el-icon-edit" title="编辑" @click="rangadd(indexs,index)"></i>
                                <i class="el-icon-delete" title="删除计划"
                                   @click="rangedelete(item.id,indexs,index)"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <div class="notime" v-show="!hideshow">暂无工作计划上报</div>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="ruleForm.remark" @blur="textareablur()"></el-input>
                    </el-form-item>
                </el-form>
            </div>

        </div>
        <div v-show="dialogVisible" class="popbox">
            <div class="bigBox">
                <el-form class="demo-form-inline" label-width="120px">
                    <el-form-item label="计划内容">
                        <el-input type="textarea" :rows="4" placeholder="请输入计划内容" v-model.trim="planContent"
                                  :maxlength="200"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人">
                        <address-book v-model="teacherNameData" :config="teacherConfigData"></address-book>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="primarydialogVisible()">确 定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import Backtool from "@/components/BackTool";
    import moment from "moment";
    import AddressBook from "@/components/AddressBook/indexExpand";
    import {
        findReportedWorkPlan,
        publishWorkPlan,
        getInitStartAndEndDate,
        getWorkPlanTitle,
        deletes,
        addWorkPlanDetail,
        updateWorkPlanDetail,
        previewWorkPlan,
        getWorkPlanInfoSync,
        updateWorkPlanListSortNoSync,
        addWorkPlanInfoSync,
        updateWorkPlanInfoSync,
    } from "@/api/workPlan";

    export default {
        components: {
            AddressBook,
            Backtool
        },
        data() {
            const daterangeValidator = (rule, value, callback) => {
                if (!this.ruleForm.startDate || !this.ruleForm.endDate) {
                    callback(new Error("工作计划时间范围不能为空！"));
                    return;
                }
            };
            return {
                id: '',
                teacherConfigData: {
                    title: "责任人",
                    depart: {target: "user", departType: "t", userTypes: "1"},
                    group: false,
                    SingleChose: true
                },
                teacherNameData: {userJson: []},
                planContent: "",
                num: 0,
                numtwo: "",
                hideshow: true,
                dialogVisible: false,
                ruleForm: {
                    title: "",
                    startDate: "",
                    endDate: "",
                    state: "1",
                    remark: '',
                    workPlanModelList: []
                },
                dataList: [], //计划数组
                departmentlist: [], //部门
                rules: {
                    title: [{required: true, message: "请输入计划名称", trigger: "blur"}],
                    dateRange: [
                        {
                            required: true,
                            trigger: "blur",
                            validator: daterangeValidator
                        }
                    ],
                    departId: [
                        {
                            type: "number",
                            required: true,
                            message: "请选择活动部门",
                            trigger: "change"
                        }
                    ]
                },
                istitle: true,
                isnum: true,
                timenum: 0
            };
        },
        mixins: [mixin],
        mounted() {
            getWorkPlanInfoSync().then(res => {
                if (res.data.data == null) {
                    //获取时间
                    getInitStartAndEndDate()
                        .then(res => {
                            let list = res.data.data.split(",");
                            if (res.data.data != "") {
                                this.ruleForm.startDate = list[0];
                                this.ruleForm.endDate = list[1];
                                this.changetime();
                            } else {
                                this.hideshow = false;
                            }
                        })
                        .catch(err => {
                        });
                } else {
                    this.id = res.data.data.id;
                    if ((this.id != '') && (this.id != null)) {
                        this.ruleForm.startDate = res.data.data.startDate;
                        this.ruleForm.endDate = res.data.data.endDate;
                        this.ruleForm.remark = res.data.data.remark;
                        this.changetime();
                    } else {
                        //获取时间
                        getInitStartAndEndDate()
                            .then(res => {
                                let list = res.data.data.split(",");
                                if (res.data.data != "") {
                                    this.ruleForm.startDate = list[0];
                                    this.ruleForm.endDate = list[1];
                                    this.changetime();
                                } else {
                                    this.hideshow = false;
                                }
                            })
                            .catch(err => {
                            });
                    }
                }


            })
                .catch(err => {
                });

        },
        methods: {
            //切换时间
            changetime() {
                let timeone = new Date(moment(this.ruleForm.startDate).format("YYYY/MM/DD")).getTime();
                let timetwo = new Date(moment(this.ruleForm.endDate).format("YYYY/MM/DD")).getTime();
                if (timeone > timetwo) {
                    this.$message.error("工作计划时间范围开始日期必须小于结束日期！");
                    return;
                }
                if (timeone > 0 && timetwo > 0) {
                    this.ruleForm.startDate = this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD"); //时间
                    this.ruleForm.endDate = this.$moment(this.ruleForm.endDate).format("YYYY-MM-DD"); //时间
                    this.findReportedWorkPlans();
                    //获取名称
                    getWorkPlanTitle(this.ruleForm.startDate, this.ruleForm.endDate)
                        .then(res => {
                            this.timenum++;
                            let name = res.data.data;
                            getWorkPlanInfoSync().then(res => {
                                if (res.data.data != null) {
                                    this.id = res.data.data.id;
                                    if ((this.id != '') && (this.id != null)) {
                                        if (this.istitle) {
                                            this.ruleForm.title = res.data.data.title;
                                            this.istitle = false;
                                        }
                                        if ((this.timenum != 2) && (this.timenum != 1)) {
                                            this.ruleForm.title = name;
                                            this.textareablur()
                                        }
                                    } else {
                                        this.ruleForm.title = name;
                                        this.textareablur()
                                    }
                                } else {
                                    this.ruleForm.title = name;
                                    this.textareablur()
                                }

                            })
                                .catch(err => {
                                });
                        })
                        .catch(err => {
                        });
                }
            },

            //获取详情
            findReportedWorkPlans() {
                findReportedWorkPlan(this.ruleForm.startDate, this.ruleForm.endDate)
                    .then(res => {
                        this.dataList = res.data.data;
                        if (this.dataList.length === 0) {
                            this.hideshow = false;
                        } else {
                            this.hideshow = true;

                        }
                    })
                    .catch(err => {
                    });
            },
            //上移
            Moveupward(indexs, index) {
                if (index == 0) {
                    return;
                }
                this.dataList[indexs].workPlanDetailModelList[index] = this.dataList[indexs].workPlanDetailModelList.splice(index - 1, 1, this.dataList[indexs].workPlanDetailModelList[index])[0];
                let modelList = [];
                let num = 1;
                for (let i = 0; i < this.dataList.length; i++) {
                    for (
                        let j = 0;
                        j < this.dataList[i].workPlanDetailModelList.length;
                        j++
                    ) {
                        let obj = {id: this.dataList[i].workPlanDetailModelList[j].id, sortNo: j + 1};
                        modelList.push(obj);

                    }
                }
                ;
                //改变序号
                updateWorkPlanListSortNoSync(modelList).then(res => {
                })
                    .catch(err => {
                    });
            },
            //删除
            rangedelete(id, indexs, index) {
                this.$confirm("确定要删除吗？", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        deletes(id)
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "删除成功!"
                                    });
                                    this.dataList[indexs].workPlanDetailModelList.splice(index, 1);
                                }
                            })
                            .catch(err => {
                            });
                    })
                    .catch(() => {
                    });
            },
            //备注
            textareablur() {
                if (this.dataList.length == 0) {
                    return;
                }
                if (this.isnum) {
                    this.isnum = false;
                    if (this.id != '') {
                        //编辑
                        updateWorkPlanInfoSync({
                            id: this.id,
                            remark: this.ruleForm.remark,
                            title: this.ruleForm.title,
                            startDate: this.ruleForm.startDate,
                            endDate: this.ruleForm.endDate,
                        }).then(res => {
                            this.isnum = true;
                        })
                            .catch(err => {
                            });
                    } else {
                        //新增
                        addWorkPlanInfoSync({
                            remark: this.ruleForm.remark,
                            title: this.ruleForm.title,
                            startDate: this.ruleForm.startDate,
                            endDate: this.ruleForm.endDate,
                        }).then(res => {
                            this.isnum = true;
                            this.id = res.data.data
                        })
                            .catch(err => {
                            });
                    }
                }


            },
            //添加计划
            rangadd(one, two) {
                this.teacherNameData = {userJson: []};
                this.planContent = "";
                if (two || two == 0) {
                    this.numtwo = two;
                    this.planContent = this.dataList[one].workPlanDetailModelList[
                        two
                        ].planContent;
                    this.teacherNameData = {
                        userJson: [
                            {
                                dataType: "user",
                                name: this.dataList[one].workPlanDetailModelList[two]
                                    .dutyUserName,
                                id: this.dataList[one].workPlanDetailModelList[two].dutyUserId,
                                avatar: this.dataList[one].workPlanDetailModelList[two].avatar
                            }
                        ]
                    };
                }

                this.dialogVisible = true;
                this.num = one;
            },
            //添加 编辑
            primarydialogVisible() {
                if (this.planContent == "") {
                    this.$message.error("计划内容不能为空！");
                    return;
                }
                if (this.teacherNameData.userJson.length === 0) {
                    this.$message.error("请选择计划负责人！");
                    return;
                }

                if (this.numtwo === "") {
                    let obj = {
                        id: this.teacherNameData.userJson[0].id,
                        loginname: this.teacherNameData.userJson[0].loginname,
                        mobile: this.teacherNameData.userJson[0].mobile,
                        name: this.teacherNameData.userJson[0].name,
                        avatar: this.teacherNameData.userJson[0].avatar
                    };
                    let getobj = {
                        departId: this.dataList[this.num].departId,
                        departName: this.dataList[this.num].departName,
                        dutyUserJson: obj,
                        planContent: this.planContent,
                        sortNo: this.dataList[this.num].workPlanDetailModelList.length + 1,
                        endDate: this.$moment(this.ruleForm.endDate).format("YYYY-MM-DD"),
                        startDate: this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD"),
                        title: this.ruleForm.title,
                    };
                    addWorkPlanDetail(getobj)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    message: "添加成功！",
                                    type: "success",
                                    duration: 1000
                                });
                                let obj = {
                                    planContent: this.planContent,
                                    dutyUserName: this.teacherNameData.userJson[0].name,
                                    dutyUserId: this.teacherNameData.userJson[0].id,
                                    id: res.data.data,
                                    avatar: this.teacherNameData.userJson[0].avatar,
                                    loginname: this.teacherNameData.userJson[0].loginname,
                                    mobile: this.teacherNameData.userJson[0].mobile,

                                };
                                this.dataList[this.num].workPlanDetailModelList.push(obj);
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                        });
                } else {
                    let obj = {
                        id: this.teacherNameData.userJson[0].id,
                        loginname: this.teacherNameData.userJson[0].loginname,
                        mobile: this.teacherNameData.userJson[0].mobile,
                        name: this.teacherNameData.userJson[0].name,
                        avatar: this.teacherNameData.userJson[0].avatar
                    };
                    let getobj = {
                        departId: this.dataList[this.num].departId,
                        departName: this.dataList[this.num].departName,
                        dutyUserJson: obj,
                        planContent: this.planContent,
                        sortNo: this.dataList[this.num].workPlanDetailModelList.length + 1,
                        endDate: this.$moment(this.ruleForm.endDate).format("YYYY-MM-DD"),
                        startDate: this.$moment(this.ruleForm.startDate).format("YYYY-MM-DD"),
                        title: this.ruleForm.title,
                        id: this.dataList[this.num].workPlanDetailModelList[this.numtwo].id
                    };
                    updateWorkPlanDetail(getobj)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    message: "编辑成功！",
                                    type: "success",
                                    duration: 1000
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                        });
                    this.dataList[this.num].workPlanDetailModelList[this.numtwo].planContent = this.planContent;
                    this.dataList[this.num].workPlanDetailModelList[this.numtwo].dutyUserName = this.teacherNameData.userJson[0].name;
                    this.dataList[this.num].workPlanDetailModelList[this.numtwo].dutyUserId = this.teacherNameData.userJson[0].id;
                    this.dataList[this.num].workPlanDetailModelList[this.numtwo].avatar = this.teacherNameData.userJson[0].avatar;
                    this.dataList[this.num].workPlanDetailModelList[this.numtwo].loginname = this.teacherNameData.userJson[0].loginname;
                    this.dataList[this.num].workPlanDetailModelList[this.numtwo].mobile = this.teacherNameData.userJson[0].mobile;
                }
                this.dialogVisible = false;
                this.numtwo = "";
            },
            //发布
            addWorkPlans(ruleForm, nums) {
                this.ruleForm.state = nums;
                this.ruleForm.startDate = this.$moment(this.ruleForm.startDate).format(
                    "YYYY-MM-DD"
                ); //时间
                this.ruleForm.endDate = this.$moment(this.ruleForm.endDate).format(
                    "YYYY-MM-DD"
                ); //时间
                //拼装计划
                this.ruleForm.workPlanModelList = [];
                for (let i = 0; i < this.dataList.length; i++) {
                    for (
                        let j = 0;
                        j < this.dataList[i].workPlanDetailModelList.length;
                        j++
                    ) {
                        let obj = {
                            id: this.dataList[i].workPlanDetailModelList[j].id,
                            loginname: this.dataList[i].workPlanDetailModelList[j].loginname,
                            mobile: this.dataList[i].workPlanDetailModelList[j].mobile,
                            name: this.dataList[i].workPlanDetailModelList[j].dutyUserName,
                            avatar: this.dataList[i].workPlanDetailModelList[j].avatar
                        };
                        this.ruleForm.workPlanModelList.push({
                            departId: this.dataList[i].departId,
                            departName: this.dataList[i].departName,
                            planContent: this.dataList[i].workPlanDetailModelList[j].planContent,
                            sortNo: j + 1,
                            dutyUserJson: obj,
                            id: this.dataList[i].workPlanDetailModelList[j].id
                        });
                    }
                }
                ;
                if (this.ruleForm.workPlanModelList.length === 0) {
                    this.$message.error("暂无计划！");
                    return;
                }
                ;
                if (this.ruleForm.state == 4) {
                    previewWorkPlan(this.ruleForm)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    message: "预览成功！",
                                    type: "success",
                                    duration: 1000
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                        });
                } else {
                    publishWorkPlan(this.ruleForm)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    message: "操作成功！",
                                    type: "success",
                                    duration: 1000
                                });
                                this.$router.push({
                                    path: "bigplandetails",
                                    query: {
                                        id: res.data.data
                                    }
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                        });
                }


            }
        }
    };
</script>
<style scoped>
    .notime {
        text-align: center;
        font-size: 30px;
        line-height: 100px;
        color: #666;
    }

    .top {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    .body {
        width: 810px;
        margin: 0 auto;
    }

    .subject {
        padding-top: 10px;
        overflow: auto;
        word-break: break-all;
        word-wrap: break-word;
        overflow: auto;
    }

    .subject {
        padding-top: 10px;
        overflow: auto;
    }

    .boxli {
        overflow: hidden;
        margin: 0 0 20px 0;
        padding: 10px;
        border: 1px #eee solid;
        width: 660px;
        border-radius: 5px;
    }

    .boxli .title {
        float: left;
        width: 100%;
        font-size: 18px;
        color: #666;
        font-weight: 600;
        line-height: 40px;
    }

    .boxli .content {
        float: left;
        width: 400px;
        margin-right: 20px;
    }

    .boxli .responsibility {
        float: left;
        width: 120px;
        margin-right: 20px;
    }

    .boxli i {
        color: #8492a6;
        font-size: 20px;
        display: inline-block;
        cursor: pointer;
        margin-left: 20px;
    }

    .boxli i:hover {
        color: #20a0ff;
    }

    .planSummary .el-date-editor.el-input {
        width: 320px;
    }

    .planSummary .el-input {
        width: 660px;
    }

    .boxli .my-el-icon-plus {
        border: 2px #ccc solid;
        padding: 3px;
        font-size: 16px;
        border-radius: 50%;
        color: #8492a6;
        display: inline-block;
        cursor: pointer;
        margin-left: 15px;
    }

    .boxli .my-el-icon-plus:hover {
        border: 2px #20a0ff solid;
        padding: 3px;
        font-size: 16px;
        border-radius: 50%;
    }

    .boxli .li {
        padding: 10px;
        font-size: 14px;
        overflow: hidden;
        line-height: 20px;
        border-bottom: 1px #eee solid;
    }

    .boxli .li .name {
        width: 60px;
        display: inline-block;
    }

    .bigBox {
        padding: 50px 20px;
        width: 800px;
        margin: 14% auto;
        border-radius: 8px;
        background: #fff;
    }

    .popbox .dialog-footer {
        padding-left: 500px;
    }

    .planSummary .el-textarea {
        width: 660px;
    }

    .popbox {
        z-index: 100;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        position: fixed;
        overflow: auto;
        margin: 0;
        background: rgb(0, 0, 0, 0.3);
    }
</style>
