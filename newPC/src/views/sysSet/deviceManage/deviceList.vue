<template>
    <div class="page">
        <div class="header">
            <!-- <back-tool> -->
                <el-button
                    type="primary"
                    size="medium"
                    @click="showDeviceAddBox"
                >添加设备
                </el-button>
                <el-input
                    placeholder="设备名称"
                    size="medium"
                    style="width:20%"
                    v-model.trim="searchName"
                    class="search-input"
                    @keyup.enter.native="searchDevice"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="searchDevice"
                        :loading="searchLoading"
                    ></el-button>
                </el-input>
            <!-- </back-tool> -->
        </div>
        <div class="device_list">
            <div class="footer_wrap clearfix">
                <el-radio-group
                    v-model="deviceType"
                    @change="stateChange"
                    style="float: left;line-height: 32px;"
                >
                    <el-radio label="0">全部</el-radio>
                    <el-radio
                        :label="item.code"
                        :key="index"
                        v-for="(item, index) in deviceTypes"
                    >{{item.value}}
                    </el-radio>
                </el-radio-group>
            </div>
            <div
                class="device_out_box custom—scrollbar"
                :style="`height: ${maxH-25}px;`"
                v-if="showDeviceList&&showDeviceList.length"
            >
                <div class="device_wrap clearfix">
                    <div
                        class="device_item"
                        :key="index"
                        v-for="(item, index) in showDeviceList"
                    >
                        <div class="device_title">
                            <div class="device_name">
                                {{item.equipmentName}}
                                <template v-if="item.equipType == 10001||item.equipType == 10003">
                                    <el-tag size="mini" v-if="item.status == 1" type="danger">离线</el-tag>
                                    <el-tag size="mini" v-if="item.status == 2">在线</el-tag>
                                </template>
                                <i
                                    class="el-icon-edit option_box"
                                    @click="popfun(item)"
                                    style="right: 35px;"
                                ></i>
                                <i
                                    class="el-icon-delete option_box"
                                    @click="delDevice(item.id)"
                                    style="color:red"
                                ></i>
                            </div>
                            <div
                                class="to_member_btn"
                                v-show="(item.equipType === 10002)&&(item.useType != '201')"
                            >
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="toMemberManage(item.id, item.equipmentName, item.equipmentId)"
                                >设备人员管理
                                </el-button>
                            </div>
                            <div
                                class="to_member_btn"
                                v-show="item.useType == '201'"
                            >
                                <el-button
                                    type="primary" @click="morningCheckInits(item.equipmentId)"
                                    size="mini"
                                >初始化
                                </el-button>
                            </div>
                            <div
                                class="to_member_btn"
                                v-show="item.useType === 12"
                            >
                                <el-button
                                    type="primary" @click="syncDeviceUsers(item.equipmentId)"
                                    size="mini"
                                >同步到设备
                                </el-button>
                            </div>
                        </div>
                        <div class="device_info clearfix">
                            <div class="info_name">设备ID</div>
                            <div class="info_content">{{item.equipmentId}}</div>
                        </div>
                        <div class="device_info clearfix">
                            <div class="info_name">设备类型</div>
                            <div class="info_content">{{item.equipTypeName}}</div>
                        </div>
                        <div class="device_info clearfix">
                            <div class="info_name">使用场景</div>
                            <div class="info_content">{{item.useTypeName}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="no_device_box"
                v-if="!showDeviceList || !showDeviceList.length"
            >暂无设备
            </div>
        </div>
        <el-dialog
            title="编辑设备"
            :visible.sync="newisShowAddDialog"
            width="720px"
            :close-on-click-modal="false"
        >
            <div class="device_add_box">
                <el-form
                    :model="deviceMsg"
                    :rules="deviceRules"
                    ref="deviceRuleForm"
                >
                    <el-form-item
                        label="设备名称"
                        prop="deviceName"
                        label-width="100px"
                    >
                        <el-input
                            v-model.trim="deviceMsg.deviceName"
                            maxlength="20"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="设备ID"
                        label-width="100px"
                    >
                     {{deviceMsg.deviceId}}
                    </el-form-item>
                    <el-form-item
                        label="设备类型"
                        label-width="100px"
                    >
                        {{deviceMsg.equipTypeName}}
                    </el-form-item>
                    <el-form-item
                        v-if="equipDetail.equipType != 10005 && equipDetail.equipType != 10006"
                        label="使用场景"
                        prop="selectUserType"
                        label-width="100px"
                    >
                        <el-select
                            v-model="deviceMsg.selectUserType"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in userTypes"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="newisShowAddDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    :disabled="disabled"
                    @click="editScancodeEquipmentt"
                >确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="添加设备"
            :visible.sync="isShowAddDialog"
            width="720px"
            :close-on-click-modal="false"
        >
            <div class="device_add_box">
                <el-form
                    :model="deviceMsg"
                    :rules="deviceRules"
                    ref="deviceRuleForm"
                >
                    <el-form-item
                        label="设备名称"
                        prop="deviceName"
                        label-width="100px"
                    >
                        <el-input
                            v-model.trim="deviceMsg.deviceName"
                            maxlength="20"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="设备ID"
                        prop="deviceId"
                        label-width="100px"
                    >
                        <el-input
                            v-model.trim="deviceMsg.deviceId"
                            maxlength="20"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="设备类型"
                        label-width="100px"
                    >
                        {{equipDetail.equipTypeName}}
                    </el-form-item>
                    <el-form-item
                        v-if="equipDetail.equipType != 10005 && equipDetail.equipType != 10006"
                        label="使用场景"
                        prop="selectUserType"
                        label-width="100px"
                    >
                        <el-select
                            v-model="deviceMsg.selectUserType"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in userTypes"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="isShowAddDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    :disabled="disabled"
                    @click="toAddDevice"
                >确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import windowResizeMixin from "@/mixins/windowResize";
    import BackTool from "@/components/BackTool";
    import {findDicsByCode} from "@/api/system";
    import {
        getAllEquipmentList,
        addDevice,
        batchDeleteDevice,
        syncDeviceUser,
        morningCheckInit,
        getEquipmentLibrary,
        editScancodeEquipmentt
    } from "@/api/systemSet/deviceManage";

    export default {
        name: "deviceList",
        components: {
            BackTool,
        },
        data() {
            const deviceIdValidator = (rule, value, callback) => {
                this.equipDetail = {};
                if (!this.deviceMsg.deviceId) {
                    callback(new Error('请输入设备ID'));

                } else {
                    getEquipmentLibrary({
                        equipType: 0,
                        equipmentId: this.deviceMsg.deviceId,
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (!data.data) {
                                callback(new Error('系统中不存在此设备ID'));
                            } else if (data.data.state == 2) {
                                callback(new Error('该设备ID已绑定'));
                            } else {
                                this.equipDetail = data.data;
                                this.getUserTypes(this.equipDetail.equipType);
                                callback();
                            }
                        })
                }
            };
            return {
                equipDetail: {},
                newisShowAddDialog:false,
                disabled: false,
                isShowAddDialog: false,
                searchName: "",
                searchLoading: false,
                deviceType: "0",
                deviceList: [],
                showDeviceList: [],
                deviceTypes: [],
                userTypes: [],
                deviceMsg: {
                    deviceName: "",
                    deviceId: "",
                    selectUserType: "",
                    equipTypeName:''
                },
                deviceRules: {
                    deviceName: [
                        {required: true, message: "请输入设备名称", trigger: "blur"},
                        {
                            min: 1,
                            max: 20,
                            message: "请输入 20 个以内有效字符",
                            trigger: "blur",
                        },
                    ],
                    deviceId: [
                        {required: true, validator: deviceIdValidator, trigger: 'blur'}
                    ],
                    selectUserType: [{required: true, message: "请选择使用场景！"}],
                },
            };
        },
        mixins: [windowResizeMixin],
        created() {
            this.getAllEquipmentList();
            this.getDeviceTypes();
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        methods: {
            popfun(obj){
                this.newisShowAddDialog=true
                this.deviceMsg.deviceName=obj.equipmentName
                this.deviceMsg.deviceId=obj.equipmentId
                this.deviceMsg.selectUserType=obj.useType+''
                this.deviceMsg.equipTypeName=obj.equipTypeName
                
                 getEquipmentLibrary({
                        equipType: 0,
                        equipmentId: this.deviceMsg.deviceId,
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.equipDetail = data.data;
                                this.getUserTypes(this.equipDetail.equipType,1);
                        })
            },
            getDeviceTypes() {
                findDicsByCode("equipType")
                    .then((res) => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            this.deviceTypes = data;
                        }
                    })
                    .catch();
            },
            toMemberManage(id, name, equipmentId) {
                this.$router.push({
                    path: "deviceMemberManage",
                    query: {deviceId: id, deviceName: name, equipmentId: equipmentId},
                });
            },
            searchDevice() {
                this.filterDevice();
            },
            showDeviceAddBox() {
                this.isShowAddDialog = true;
            },
            morningCheckInits(equipmentId) {
                this.$confirm("是否初始化?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        morningCheckInit(equipmentId).then(res => {
                            if (res.data.code === 200) {

                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch(() => {
                        });
                        this.$message({
                            message: '初始化进行中请耐心等待!',
                            type: 'success'
                        });
                    })
                    .catch(() => {
                    });

            },
            syncDeviceUsers(equipmentId) {
                this.$confirm("是否同步到设备?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        syncDeviceUser(equipmentId).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    message: '同步成功!',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch(() => {
                        });
                    })
                    .catch(() => {
                    });

            },
            changeType(val) {
                this.getUserTypes(val);
            },
            getUserTypes(code,num) {
                findDicsByCode(code)
                    .then((res) => {
                        const data = res.data.data;
                        if (res.data.code === 200) {
                            this.userTypes = data;
                            if(!num){
                               this.deviceMsg.selectUserType = data[0].code;
                            }                              
                        }
                    })
                    .catch();
            },
            stateChange() {
                this.searchName = "";
                this.filterDevice();
            },
            getAllEquipmentList() {
                getAllEquipmentList()
                    .then((res) => {
                        const data = res.data;
                        if (res.data.code === 200) {
                            this.deviceList = data.data;
                            this.filterDevice();
                        }
                    })
                    .catch(() => {
                    });
            },
            filterDevice() {
                let newDeviceArray = [];
                if (this.deviceType === "0") {
                    newDeviceArray = this.deviceList;
                } else {
                    this.deviceList.forEach((item) => {
                        if (item.equipType === parseInt(this.deviceType)) {
                            newDeviceArray.push(item);
                        }
                    });
                }

                // 过滤搜索名称 searchName
                let filterNameArray = [];
                newDeviceArray.forEach((item) => {
                    if (!!item.equipmentName.match(this.searchName)) {
                        filterNameArray.push(item);
                    }
                });

                this.showDeviceList = filterNameArray;
            },
            codeGetName(list, code) {
                return list[list.map((item) => item.code).indexOf(code)].value;
            },
            toAddDevice() {
                this.$refs["deviceRuleForm"].validate((valid) => {
                    if (valid) {
                        let query = {
                            equipType: parseInt(this.equipDetail.equipType),
                            equipTypeName: this.equipDetail.equipTypeName,
                            equipmentId: this.deviceMsg.deviceId,
                            equipmentName: this.deviceMsg.deviceName,
                            useType: this.equipDetail.equipType != 10005 && this.equipDetail.equipType != 10006 ? parseInt(this.deviceMsg.selectUserType) : '',
                            useTypeName: this.equipDetail.equipType != 10005 && this.equipDetail.equipType != 10006 ? this.codeGetName(
                                this.userTypes,
                                this.deviceMsg.selectUserType
                            ) : '',
                            state: 2,
                        };

                        this.addDevice(query);
                    } else {
                        return false;
                    }
                });
            },
            editScancodeEquipmentt() {
                this.$refs["deviceRuleForm"].validate((valid) => {
                    if (valid) {
                        let query = {                           
                            equipmentId: this.deviceMsg.deviceId,
                            equipmentName: this.deviceMsg.deviceName,
                            useType: this.equipDetail.equipType != 10005 && this.equipDetail.equipType != 10006 ? parseInt(this.deviceMsg.selectUserType) : '',
                            useTypeName: this.equipDetail.equipType != 10005 && this.equipDetail.equipType != 10006 ? this.codeGetName(
                                this.userTypes,
                                this.deviceMsg.selectUserType
                            ) : '',
                        };
                         editScancodeEquipmentt(query)
                    .then((res) => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: "success",
                                message: "编辑成功!",
                            });
                            this.deviceMsg.deviceId = "";
                            this.deviceMsg.deviceName = "";
                            this.newisShowAddDialog = false;
                            this.getAllEquipmentList();
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.data.msg,
                            });
                        }
                    })
                    .catch();
                        
                    } else {
                        return false;
                    }
                });
            },
            addDevice(query) {
                addDevice(query)
                    .then((res) => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功!",
                            });
                            this.deviceMsg.deviceId = "";
                            this.deviceMsg.deviceName = "";
                            this.isShowAddDialog = false;
                            this.getAllEquipmentList();
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.data.msg,
                            });
                        }
                    })
                    .catch();
            },
            delDevice(id) {
                this.$confirm("此操作将删除此设备, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        batchDeleteDevice(id.toString())
                            .then((res) => {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                                this.getAllEquipmentList();
                            })
                            .catch();
                    })
                    .catch(() => {
                    });
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "./../../../styles/style";

    .page {
        padding: 12px;
    }

    .header {
        padding-bottom: 10px;
    }

    .search-input {
        float: right;
        vertical-align: middle;
        margin-left: 10px;
        width: 220px;
    }

    .device_list {
        .footer_wrap {
            padding: 0 20px 20px;
        }

        .device_out_box {
            .device_wrap {
                .device_item {
                    float: left;
                    width: 350px;
                    margin-bottom: 40px;
                    margin-left: 15px;
                    padding: 10px 20px;
                    border: 1px solid #ddd;

                    .device_title {
                        display: flex;

                        .device_name {
                            position: relative;
                            flex: 1;
                            height: 40px;
                            line-height: 20px;
                            font-weight: 700;
                            padding: 10px 30px 10px 0;
                            color: #333;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;

                            .option_box {
                                position: absolute;
                                top: 12px;
                                right: 10px;
                                color: #66b1ff;
                                cursor: pointer;
                            }
                        }

                        .to_member_btn {
                            padding-top: 5px;
                        }
                    }

                    .device_info {
                        padding: 15px 0;
                        line-height: 20px;
                        border-top: 1px solid #eee;
                        color: #666;

                        .info_name {
                            float: left;
                            width: 25%;
                            height: 20px;
                            overflow: hidden;
                        }

                        .info_content {
                            float: right;
                            max-width: 75%;
                            height: 20px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                        }
                    }
                }
            }
        }

        .no_device_box {
            padding: 20px;
            text-align: center;
            color: #999;
        }
    }

    .device_add_box {
        padding-right: 30px;
    }
</style>
