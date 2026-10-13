<template>
    <div class="guide_group_add_wrap">
        <div class="header">
            <el-button size="medium" @click.native="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click.native="addGuideGroup">保存</el-button>
        </div>
        <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
            <el-form :model="form" ref="form" label-position="right" label-width="140px">
                <el-form-item label="上报方式：" prop="radio">
                    <el-radio v-model="form.isAddCreateType" :label="2">家长上报(选孩子)</el-radio>
                    <el-radio v-model="form.isAddCreateType" :label="3">家委上报(选家长)</el-radio>
                </el-form-item>
                <!-- 1有 2无 -->
                <!-- 家长上报(2)选字段：服务内容，时间，参与人，地点，时长，部门分组，内容，图片 -->
                <el-form-item label="展示字段：" v-if="form.isAddCreateType === 2">
                    <!-- 必填字段，不可更改 -->
                    <el-checkbox label="服务内容" v-model="form.isTitle2" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <!-- 必填字段，不可更改 -->
                    <el-checkbox label="时间" v-model="form.isAcvitityTime2" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <el-checkbox label="参与人" v-model="form.isJoinUser2" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <el-checkbox label="地点" v-model="form.isAdress2" :true-label="1" :false-label="2"></el-checkbox>
                    <el-checkbox label="时长(分)" v-model="form.isTimeLength2" :true-label="1"
                        :false-label="2"></el-checkbox>
                    <el-checkbox label="部门分组" v-model="form.isDepartGroup2" :true-label="1"
                        :false-label="2"></el-checkbox>
                    <!-- 必填字段，不可更改 -->
                    <el-checkbox label="内容描述" v-model="form.isContent2" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <el-checkbox label="图片" v-model="form.isFile2" :true-label="1" :false-label="2"></el-checkbox>
                </el-form-item>
                <el-form-item label="部门分组设置：" prop="radio"
                    v-if="form.isDepartGroup2 === 1 && form.isAddCreateType === 2">
                    <el-button type="text" icon="el-icon-plus" @click="addEvent">添加分组</el-button>
                </el-form-item>
                <div v-if="form.isDepartGroup2 === 1 && form.isAddCreateType === 2" class="department-buttons">
                    <!-- 动态数据展示 -->
                    <div v-for="(group, index) in groupingList" :key="index" class="department-item"
                        @click="selectGroup(group)">
                        <span class="department-name">
                            {{ group.groupName || "未命名部门" }}</span>
                        <span class="manager">{{
                            group.groupNames || "未设置管理员"
                            }}</span>

                        <i class="el-icon-delete delete-icon" @click.stop="deleteGroup(group)"></i>
                    </div>
                </div>
                <el-form-item label="展示字段：" v-if="form.isAddCreateType === 3">
                    <!-- 1有 2无 -->
                    <!-- 家委上报(3)选字段：服务名称，班级，时间，参与人，内容，图片 -->
                    <!-- 必填字段，不可更改 -->
                    <el-checkbox label="服务内容" v-model="form.isTitle3" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <!-- 家委上报特有字段 -->
                    <el-checkbox label="班级" v-model="form.isClassName3" :true-label="1" :false-label="2"></el-checkbox>
                    <!-- 必填字段，不可更改 -->
                    <el-checkbox label="时间" v-model="form.isAcvitityTime3" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <el-checkbox label="参与人" v-model="form.isJoinUser3" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <!-- 必填字段，不可更改 -->
                    <el-checkbox label="内容描述" v-model="form.isContent3" :true-label="1" :false-label="2"
                        disabled></el-checkbox>
                    <el-checkbox label="图片" v-model="form.isFile3" :true-label="1" :false-label="2"></el-checkbox>
                </el-form-item>

            </el-form>
        </div>

        <el-dialog :title="groupForm.id ? '更新分组' : '添加分组'" :visible.sync="dialogFormVisible" width="600px"
            @close="handleDialogClose">
            <el-form :model="groupForm" :rules="rules" ref="groupFormRef">
                <el-form-item label="分组名称：" :label-width="formLabelWidth" prop="groupName">
                    <el-input v-model="groupForm.groupName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="审核人：" :label-width="formLabelWidth" prop="batchUserJson">
                    <address-book v-model="groupForm.batchUserJson" :config="configData" ref="address"></address-book>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGroupingEvent">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
import {
    getHeartVolunteerInit,
    addUpdateHeartVolunteerInit,
    addHeartVolunteerGroup,
    getHeartVolunteerGroupList,
    delHeartVolunteerGroup,
    updateHeartVolunteerGroup,
    getHeartVolunteerGroup
} from "@/api/systemSet/volunteerService";

export default {
    name: "volunteerService",
    components: {
        AddressBook
    },
    data() {
        const addressDatapropfun = (rule, value, callback) => {
            console.log(this.groupForm.batchUserJson, value);
            if (this.groupForm.batchUserJson.userJson.length>0) {
                return callback();
            } else {
                return callback(new Error("请选择审核人"));
            }
        };
        return {

            form: {
                isAddCreateType: 3, //	创建方式2 家长 3 学生
                isAcvitityTime: 1, //	是否有时间 1有 2 无
                isAdress: 2, //	是否有地点 1有 2无
                isClassName: 2, //	是否有班级 1 有 2 无
                isContent: 1, //	是否有内容 1 有 2无
                isDepartGroup: 1, //	是否有部门分组 1 有 2无
                isFile: 2, //	是否有附件 1 有2无
                isJoinUser: 1, //	是否有参与人 1 有 2无
                isTimeLength: 2, //	是否有时长 1 有 2 无
                isTitle: 1, //	是否有标题 1有 2无

                //家委上报(3)选字段：服务名称，班级，时间，参与人，内容，图片
                isTitle3: 1, //	是否有标题 1有 2无
                isClassName3: 2, //	是否有班级 1 有 2 无
                isAcvitityTime3: 1, //	是否有时间 1 有 2 无
                isJoinUser3: 1, //	是否有参与人 1 有 2无
                isContent3: 1, //	是否有内容 1 有 2无
                isFile3: 2, //	是否有附件 1 有2无

                //家长上报(2)选字段：服务名称，时间，参与人，地点，时长，部门分组，内容，图片
                isTitle2: 1, //	是否有标题 1有 2无
                isAcvitityTime2: 1, //	是否有时间 1 有 2 无
                isJoinUser2: 1, //	是否有参与人 1 有 2无
                isAdress2: 2, //	是否有地点 1有 2无
                isTimeLength2: 2, //	是否有时长 1 有 2 无
                isDepartGroup2: 1, //	是否有部门分组 1 有 2无
                isContent2: 1, //	是否有内容 1 有 2无
                isFile2: 2, //	是否有附件 1 有2无

            },
            dialogFormVisible: false,
            groupingList: [],
            formLabelWidth: "120px",
            groupForm: {
                groupName: "",
                batchUserJson: {
                    userJson: []
                }
            },
            rules: {
                groupName: [
                    { required: true, message: "请输入分组名称", trigger: "blur" }
                ],
                batchUserJson: [
                    { validator: addressDatapropfun, trigger: "blur", required: true }
                ]
            },
            configData: {
                title: "请选择",
                depart: { target: "user", departType: "t", userTypes: "1" }
            }
        };
    },
    mixins: [mixins],
    created() {
        this.getHeartVolunteerInit();
        this.getHeartVolunteerGroupList();
    },

    methods: {
        selectGroup(val) {
            console.log(val);
            getHeartVolunteerGroup({
                groupId: val.id
            }).then(res => {
                if (res.data.data) {
                    this.dialogFormVisible = true;
                    this.groupForm = res.data.data
                    this.groupForm.batchUserJson = { userJson: JSON.parse(this.groupForm.batchUserJson) };
                    console.log('res', this.groupForm);
                }
            });

        },
        deleteGroup(val) {
            this.$confirm("确认删除该分组吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                delHeartVolunteerGroup({
                    groupId: val.id
                }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success("删除成功");
                        this.getHeartVolunteerGroupList();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
            });
        },
        goBack() {
            this.$router.back();
        },
        getHeartVolunteerInit() {
            getHeartVolunteerInit().then(res => {
                if (res.data.data) {
                    const obj = res.data.data;
                    this.form.isAddCreateType = obj.isAddCreateType;
                    if (obj.isAddCreateType == 2) {
                        this.form.isContent2 = obj.isContent;
                        this.form.isAdress2 = obj.isAdress;
                        this.form.isDepartGroup2 = obj.isDepartGroup;
                        this.form.isTimeLength2 = obj.isTimeLength;
                        this.form.isFile2 = obj.isFile;
                    }
                    if (obj.isAddCreateType == 3) {
                        this.form.isClassName3 = obj.isClassName;
                        this.form.isFile3 = obj.isFile;
                    }
                }
            });
        },
        getHeartVolunteerGroupList() {
            getHeartVolunteerGroupList().then(res => {
                if (res.data.data) {
                    this.groupingList = res.data.data;
                    this.groupingList.forEach(item => {
                        item.batchUserJson = JSON.parse(item.batchUserJson);
                        console.log(item.batchUserJson);
                        item.groupNames = item.batchUserJson
                            .map(item => item.name)
                            .join("、");
                    });
                }
            });
        },
        addGuideGroup() {
            //   家长上报(2)选字段：服务名称，时间，参与人，地点，时长，部门分组，内容，图片
            //   家委上报(3)选字段：服务名称，班级，时间，参与人，内容，图片  
            let obj = {
                isAddCreateType: this.form.isAddCreateType, //	创建方式2 家长 3 学生
                isAcvitityTime: 1, //	是否有时间 1有 2 无
                isAdress: this.form.isAddCreateType == 2 ? this.form.isAdress2 : 2, //	是否有地点 1有 2无
                isClassName: this.form.isAddCreateType == 3 ? this.form.isClassName3 : 2, //	是否有班级 1 有 2 无
                isContent: 1, //	是否有内容 1 有 2无
                isDepartGroup: this.form.isAddCreateType == 2 ? this.form.isDepartGroup2 : 2, //	是否有部门分组 1 有 2无
                isFile: this.form.isAddCreateType == 2 ? this.form.isFile2 : this.form.isFile3, //	是否有附件 1 有2无
                isJoinUser: 1, //	是否有参与人 1 有 2无
                isTimeLength: this.form.isAddCreateType == 2 ? this.form.isTimeLength2 : 2, //	是否有时长 1 有 2 无
                isTitle: 1, //	是否有标题 1有 2无
            }
            addUpdateHeartVolunteerInit(obj).then(res => {
                if (res.data.code === 200 && res.data.result) {
                    this.$message.success("保存成功");
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        addEvent() {
            this.groupForm = {
                id: '',
                groupName: '',
                batchUserJson: {
                    userJson: []
                }
            },
                this.dialogFormVisible = true;
        },
        handleDialogClose() {
            this.$refs.groupFormRef && this.$refs.groupFormRef.resetFields();
            this.groupForm = {
                id: '',
                groupName: '',
                batchUserJson: {
                    userJson: []
                }
            };
        },
        addGroupingEvent() {
            this.$refs.groupFormRef.validate(valid => {
                if (!valid) return;
                if (this.groupForm.id) {
                    updateHeartVolunteerGroup({
                        id: this.groupForm.id,
                        groupName: this.groupForm.groupName,
                        batchUserJson: JSON.stringify(
                            this.groupForm.batchUserJson.userJson
                        )
                    }).then(res => {
                        this.$message.success("保存成功");
                        this.dialogFormVisible = false;
                        this.getHeartVolunteerGroupList();
                    });
                } else {
                    addHeartVolunteerGroup({
                        groupName: this.groupForm.groupName,
                        batchUserJson: JSON.stringify(
                            this.groupForm.batchUserJson.userJson
                        )
                    }).then(res => {
                        this.$message.success("保存成功");
                        this.dialogFormVisible = false;
                        this.getHeartVolunteerGroupList();
                    });
                }
            });
        },

    }
};
</script>

<style lang="scss" scoped="scoped">
.guide_group_add_wrap {
    padding: 12px;

    .header {
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    .guide_group_add_box {
        width: 810px;
        margin: 20px auto;
    }

    .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        margin-left: -10px;
        margin-top: -10px;

        .el-checkbox {
            margin-left: 10px;
            margin-top: 10px;
            padding: 5px 10px;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            transition: all 0.3s;

            &:hover {
                border-color: #409eff;
            }
        }

        .el-checkbox.is-checked {
            border-color: #409eff;
            background-color: rgba(64, 158, 255, 0.1);
        }
    }

    .radio-group {
        display: flex;
        flex-direction: column;

        .el-radio {
            margin-bottom: 10px;
        }
    }

    .department-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .department-item {
            min-width: 120px;
            max-width: 150px;
            height: 60px;
            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: space-evenly;
            border: 1px solid #02a7f0;
            border-radius: 4px;
            background-color: #02a7f0;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;

            &:hover {
                background-color: #66b1ff;
                border-color: #66b1ff;
            }
        }

        .manager {
            width: 100px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .delete-icon {
            position: absolute;
            top: 3px;
            right: 3px;
            font-size: 14px;
            color: #ff4949;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
                color: #ff7875;
            }
        }
    }
}

.department-name {
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    text-align: center;
}
</style>
