<template>
    <div class="campusFeesadd">
        <back-tool>
            <el-button type="primary" size="medium" @click="saveChargeNotice(1)">保存草稿</el-button>
            <el-button type="primary" size="medium" @click="saveChargeNotice(2)">提交审核</el-button>
            <el-button type="primary" size="medium" @click="saveChargeNotice(11)">保存并预览</el-button>
        </back-tool>
        <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'">
            <div class="body">
                <el-form ref="query" :model="query" label-width="140px" :rules="rules" v-loading="loading">
                    <el-form-item label="收费名称" prop="chargeName">
                        <el-input v-model.trim="query.chargeName" placeholder="请输入收费名称(1~30)"
                                  :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="收费类型" prop="typeId">
                        <el-select v-model="query.typeId" placeholder="请选择收费类型">
                            <el-option v-for="item in NoticeType" :label="item.typeName" :value="item.typeId"
                                       :key="item.typeId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="截止时间" prop="deadlineTime">
                        <el-date-picker v-model.trim="query.deadlineTime" :editable="false" type="date"
                                        placeholder="选择截止时间" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="收费方式">
                        <el-radio-group v-model="query.payUserType">
                            <el-radio :label="0">收费金额相同</el-radio>
                            <el-radio :label="1">收费金额不同</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="query.payUserType==0">
                        <el-form-item label="收费金额（元）" prop="money">
                            <el-input v-model.trim="query.money" placeholder="请输入收费金额（例如：365.55）"
                                      :maxlength="7"></el-input>
                        </el-form-item>
                        <el-form-item label="缴费人群" prop="membersInformation">
                            <div class="myaddress-box">
                                <address-book v-model="query.membersInformation" :config="configData"></address-book>
                            </div>
                        </el-form-item>
                    </div>
                    <el-form-item label="缴费模板" v-if="query.payUserType==1">
                        <a :href="downLoadHref" target="_blank" download="examName">
                            <el-button type="primary" size="medium">交费名单模板下载</el-button>
                        </a>
                    </el-form-item>
                    <el-form-item label="缴费名单" v-if="query.payUserType==1">
                        <uploader pathPrefix="xiaoyuanshoufei" module="xiaoyuanshoufei" moduleCode="1227" :extList="allFileTypeList" v-model="query.fileJson"
                                  :multiple="false"></uploader>
                    </el-form-item>
                    <el-form-item label="审批人">
                        <el-radio-group v-model="query.examineUser.id">
                            <el-radio v-for="item in sprList" :label="item.id" :key="item.id">{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="落款">
                        <div class="boxInput">
                            <el-input v-model.trim="query.inscription" placeholder="请输入或选则落款部门(1~10)"
                                      :maxlength="10"></el-input>
                            <div class="boederheid"></div>
                        </div>
                        <div class="box">
                            <el-select v-model="query.inscription">
                                <el-option v-for="item in departmentList" :label="item.name" :value="item.name"
                                           :key="item.name"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item class="form-item--richtext" prop="content" label="收费内容">
                        <ueditor style="width:666px" class="rich-editor" ref="ueditor" :defaultMes="query.content"
                                 @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                </el-form>
            </div>

        </div>
        <el-dialog title="新建提示内容" :visible.sync="dialogVisible">
            <div class="content-box" v-html="content"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import AddressBook from "@/components/AddressBook/indexExpand";
    //	返回按钮
    import BackTool from "@/components/BackTool";
    import Ueditor from "@/components/Ueditor";
    import Uploader from '@/components/Uploader/WebUploader';
    import {
        queryChargeNoticeList,
        saveChargeNotice,
        queryChargeTypeList
    } from "@/api/campusFees";
    import mixin from "@/mixins/windowResize";

    export default {
        name: "campusFeesadd",
        //引入返回模块
        components: {BackTool, AddressBook, Uploader, Ueditor},
        data: function () {
            const checkAddressData = (rule, value, callback) => {
                if (
                    (value.userJson && value.userJson.length > 0) ||
                    (value.departJson && value.departJson.length > 0) ||
                    (value.groupJson && value.groupJson.length > 0)
                ) {
                    callback();
                } else {
                    return callback(new Error("缴费人群不能为空！"));
                }
            };
            return {
                pickerOptions: {
                    //设置默认大于今天
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                rules: {
                    chargeName: [
                        {
                            required: true,
                            message: "请输入收费名称",
                            trigger: "blur"
                        }
                    ],
                    money: [
                        {
                            required: true,
                            message: "请输入收费金额！",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
                            message: "请输入正确的收费金额！",
                            trigger: "blur"
                        }
                    ],
                    content: [
                        {
                            required: true,
                            message: "请输入收费内容！",
                            trigger: "blur"
                        }
                    ],
                    typeId: [
                        {required: true, message: "请选择收费类型", trigger: "change"}
                    ],
                    membersInformation: [
                        {required: true, validator: checkAddressData, trigger: "blur"}
                    ],
                    deadlineTime: [
                        {required: true, message: "请选择截止时间", trigger: "blur"}
                    ],
                },
                query: {
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    searchVal: "",
                    chargeName: "", //	收费名称	string
                    deadlineTime: "", //	截止时间	string
                    id: 0, //	主键id	number	新增传参为0
                    inscription: "", //	落款	string
                    money: "", //	收费金额	number
                    payUserType: 0, //	收费方式	number	0所有人收费金额相同 1所有人收费金额不完全相同
                    content: "", //	收费内容	string
                    type: "1",
                    payUserListName: "", //	交费名单	string
                    payUserListUrl: "", //	交费名单	string
                    examineUser: {id: "", name: "", loginname: ""}, //	审批人	string	数据格式{"id":10003338,"name":"曹冰","loginname":"caobing"}
                    membersInformation: {}, //	交费人群	string	数据格式 {"departs":[{"id":"944","name":"总校高二（1）班"}],"users":[],"groups":[]}
                    fileJson: [],
                    membersInformations: {},
                    typeId: "",
                    typeName: "",
                    chargeType: 1,
                    teachers: ""
                },
                downLoadHref:
                    global.BasePath +
                    "chargeNotice/getTemplateDownload?chargeType=1" +
                    "&token=" +
                    this.$store.getters.token,
                configData: {
                    title: "选择缴费人群",
                    depart: {
                        target: "depart",
                        departType: "s",
                        userTypes: "1",
                        group: "show", notCheckSchool: true
                    },
                    group: false
                },
                allFileTypeList: ["xls"],
                departmentList: [], //下拉框  落款部门
                sprList: [],
                NoticeType: [],
                is: true,
                dialogVisible: false,
                content: "",
                loading: false
            };
        },
        mixins: [mixin],
        created() {
            queryChargeTypeList().then(res => {
                let data = res.data.data;
                this.NoticeType = data;
                this.query.typeId = "";
            });
            queryChargeNoticeList(this.query).then(res => {
                let data = res.data.data;
                this.departmentList = data.inscriptionList;
                this.sprList = data.sprList;
                if (data.sprList[0].id) {
                    this.query.examineUser.id = data.sprList[0].id;
                }

            });
        },
        methods: {
            richTextEditHandler(content) {
                this.query.content = content;
            },
            //保存
            saveChargeNotice(num) {
                let $this = this;
                this.query.type = num;
                this.query.content = this.$refs.ueditor.getContent();
                if (this.query.deadlineTime) {
                    this.query.deadlineTime = this.$moment(this.query.deadlineTime).format(
                        "YYYY-MM-DD"
                    ); //时间
                } else {
                    this.query.deadlineTime = "";
                }
                if (this.query.payUserType == 1) {
                    if (this.query.fileJson.length == 0) {
                        this.$message({
                            type: "warning",
                            message: "请上传缴费名单！"
                        });
                        return;
                    }
                    this.query.payUserListName = this.query.fileJson[0].fileName;
                    this.query.payUserListUrl = this.query.fileJson[0].fileUrl;
                    this.query.membersInformations = {};
                    this.query.money = "";
                } else {
                    this.query.payUserListName = "";
                    this.query.payUserListUrl = "";
                    this.query.membersInformations = {departs: [], users: [], groups: []};
                    if (this.query.membersInformation.departJson) {
                        this.query.membersInformations.departs = this.query.membersInformation.departJson;
                    }
                    if (this.query.membersInformation.userJson) {
                        this.query.membersInformations.users = this.query.membersInformation.userJson;
                    }
                }
                ;
                if (this.query.examineUser.id) {
                    for (let i = 0; i < this.sprList.length; i++) {
                        if (this.query.examineUser.id == this.sprList[i].id) {
                            this.query.examineUser.name = this.sprList[i].name;
                            this.query.examineUser.loginname = this.sprList[i].loginname;
                        }
                    }
                } else {
                    this.$message({
                        type: "warning",
                        message: "请选择审批人！"
                    });
                    return;
                }
                this.query.membersInformations = JSON.stringify(
                    this.query.membersInformations
                );
                this.query.examineUser = JSON.stringify(this.query.examineUser);
                this.$refs["query"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        for (let i = 0; i < this.NoticeType.length; i++) {
                            if (this.NoticeType[i].typeId == this.query.typeId) {
                                this.query.typeName = this.NoticeType[i].typeName;
                            }
                        }
                        if (this.is) {
                            this.is = false;
                            saveChargeNotice(this.query)
                                .then(res => {
                                    this.loading = false;
                                    this.is = true;
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: "success",
                                            message: "操作成功!"
                                        });
                                        this.$router.back();
                                    }
                                    if (res.data.code === 1005) {
                                        this.dialogVisible = true;
                                        this.content = res.data.msg;
                                    }
                                })
                                .catch(function () {
                                    $this.loading = false;
                                    $this.is = true;
                                });
                        }
                    }
                    this.query.examineUser = JSON.parse(this.query.examineUser); //将json字符串转换成json对象
                });
            }
        }
    };
</script>
<style scoped>
    .campusFeesadd {
        padding: 12px;
    }

    .body {
        width: 810px;
        margin: 0 auto;
        overflow: hidden;
    }

    .campusFeesadd .el-select,
    .campusFeesadd .el-input {
        width: 100%;
    }

    .campusFeesadd .box {
        width: 670px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .campusFeesadd .box .el-select {
        width: 100%;
    }

    .campusFeesadd .myaddress-box {
        width: 100%;
    }

    .campusFeesadd .boxInput {
        width: 600px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        border-right: none;
    }

    .campusFeesadd .boxInput .el-input {
        width: 100%;
    }

    .campusFeesadd .boederheid {
        width: 30px;
        position: absolute;
        right: -25px;
        top: 1px;
        z-index: 1000;
        background: #fff;
        height: 34px;
    }
</style>
