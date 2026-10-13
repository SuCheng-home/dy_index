<template>
    <div class="page">
        <div class="header">
            <back-tool>
                <span class="header_title">{{deviceName}}</span>
            </back-tool>
        </div>
        <div class="btn_wrap">
            <address-book v-model="teacherAddressData" :config="teacherConfigData" :isbutton="true" size="medium">添加老师</address-book>
            <address-book v-model="stuAddressData" :config="stuConfigData" :isbutton="true" size="medium">添加学生</address-book>
            <address-book v-model="parentAddressData" :config="parentConfigData" :isbutton="true"> 添加家长</address-book>
            <el-button type="primary" :loading="searchLoading" @click="syncDeviceUser" size="medium">同步至设备</el-button>
            <el-button type="primary" :loading="searchLoading" @click="remindUser" size="medium">提醒未上传人脸照片人员</el-button>
              <import-file :config="importConf" @success="handSuccess"></import-file>
            <el-input placeholder="请输入姓名" v-model.trim="listQuery.userName" size="medium" class="search-input"
                      @keyup.enter.native="searchMember">
                <el-button slot="append" icon="el-icon-search" @click="searchMember"
                           :loading="searchLoading"></el-button>
            </el-input>
        </div>
        <div class="face_manage_wrap">
            <el-table stripe :key='tableKey' :data="listData" v-loading.body="listLoading" border fit
                      highlight-current-row
                      style="width: 100%" :height="maxH - 75">
                <el-table-column align="center" label="注册照片">
                    <template slot-scope="scope">
                        <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" width="27" height="27"
                             style="margin-top: 5px;" :alt="scope.row.userName">
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender === 1">男</span>
                        <span v-else-if="scope.row.gender === 2">女</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门（班级）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.departs">{{item.name}}&nbsp;&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userType === 1">老师</span>
                        <span v-else-if="scope.row.userType === 2">学生</span>
                        <span v-else-if="scope.row.userType === 3">家长</span>
                        <span v-else-if="scope.row.userType === 13">老师&nbsp;&nbsp;家长</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="delDeviceUser(scope.row.userId)" class="buttontextred">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="footer_wrap clearfix">
                <el-radio-group v-model="listQuery.userType" @change="stateChange"
                                style="float: left;line-height: 32px;">
                    <el-radio label="0">全部</el-radio>
                    <el-radio label="1">老师</el-radio>
                    <el-radio label="2">学生</el-radio>
                    <el-radio label="3">家长</el-radio>
                </el-radio-group>
                <div v-show="!listLoading" style="float: right;">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {getDeviceUserList, addUserDevice, syncDeviceUser, remindUser, delDeviceUser,addScancodeEquipmentUserByDepart} from '@/api/systemSet/deviceManage'
    import ImportFile from '@/components/ImportFile'
    export default {
        name: 'deviceMemberManage',
        components: {
            BackTool,
            AddressBook,
            ImportFile
        },
        data() {
            return {
                  importConf: {
                    btnName: '导入',
                    title: '用户导入',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/shebeitemplateUrl.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/scancodeEquipment/importEquipmentUsers',
                    uploadArgs: {
                         equipmentId: this.$route.query.equipmentId,
                         scanEquipId: this.$route.query.deviceId,
                    },
                    errUrl: 'structure/watch/downloadStationInitResultXls',
                    lingjie:1,
                    name:'file'
                },
                searchLoading: false,
                deviceName: '',
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    scanId: 0,
                    userName: '',
                    userType: '0'
                },
                listData: [],
                total: 0,
                listLoading: false,
                tableKey: 0,
                teacherAddressData: {},
                teacherConfigData: {
                    title: '选择老师',
                    depart: {target: 'all', departType: 'all', userTypes: '1'},
                    group: false
                },
                stuAddressData: {},
                stuConfigData: {
                    title: '选择学生',
                    depart: {target: 'all', departType: 's', userTypes: '2'},
                    group: false
                },
                parentAddressData: {},
                parentConfigData: {
                    title: '选择家长',
                    depart: {target: 'all', departType: 'all', userTypes: '3'},
                    group: false
                },
            }
        },
        mixins: [windowResizeMixin],
        watch: {
            teacherAddressData: {
                handler(curVal) {
                    if (JSON.stringify(curVal) !== '{}') {
                        this.addUserDevice(curVal,1);
                    }
                },
                deep: true
            },
            stuAddressData: {
                handler(curVal) {
                    if (JSON.stringify(curVal) !== '{}') {
                        this.addUserDevice(curVal,2);
                    }
                },
                deep: true
            },
            parentAddressData: {
                handler(curVal) {
                    if (JSON.stringify(curVal) !== '{}') {
                        this.addUserDevice(curVal,3);
                    }
                },
                deep: true
            },
        },
        created() {
            this.listQuery.scanId = parseInt(this.$route.query.deviceId);
            this.deviceName = this.$route.query.deviceName;
            this.getDeviceUserList();
        },
        methods: {
             handSuccess() {
                this.getDeviceUserList()
            },
            getDeviceUserList() {
                getDeviceUserList(this.listQuery).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.listData = data.dataList;
                        this.total = data.pagination.total;
                    }
                }).catch(() => {
                });
            },
            addUserDevice(obj,userType) {
                if ((!obj.departJson || !obj.departJson.length)&&(!obj.userJson || !obj.userJson.length)) {
                    return;
                }
                // let list = [];
                // obj.userArray.forEach((item) => {
                //     list.push({
                //         equipmentId: this.$route.query.equipmentId,
                //         scanEquipId: this.listQuery.scanId,
                //         userId: item.id,
                //         userName: item.name,
                //         userType: item.type
                //     });
                // });
                addScancodeEquipmentUserByDepart({
                   departJson:obj.departJson,
                   userJson:obj.userJson,
                   userType:userType,
                   equipmentId: this.$route.query.equipmentId,
                   scanEquipId: this.listQuery.scanId,
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '新增成功!',
                            type: 'success'
                        });
                        this.getDeviceUserList();
                        this.teacherAddressData = {};
                        this.stuAddressData = {};
                        this.parentAddressData = {};
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(() => {
                });
            },
            searchMember() {
                this.getDeviceUserList();
            },
            delDeviceUser(id) {
                this.$confirm("是否确认要删除该设备下用户？", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    delDeviceUser({
                        scanId: this.listQuery.scanId,
                        userId: id
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: '删除成功!',
                                type: 'success'
                            });
                            this.getDeviceUserList();
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
                            });
                        }
                    }).catch(() => {
                    });
                }).catch(() => {
                });
            },
            syncDeviceUser() {
                this.searchLoading = true;
                syncDeviceUser(this.$route.query.equipmentId).then(res => {
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
                    this.searchLoading = false;
                }).catch(() => {
                    this.searchLoading = false;
                });
            },
            remindUser() {
                this.searchLoading = true;
                remindUser(this.listQuery.scanId).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '提醒发送成功!',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        });
                    }
                    this.searchLoading = false;
                }).catch(() => {
                    this.searchLoading = false;
                });
            },
            stateChange(val) {
                this.listQuery.userType = val;
                this.getDeviceUserList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getDeviceUserList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getDeviceUserList();
            },
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    .page {
        padding:12px;

        .header {
            padding-bottom: 10px;

            .header_title {
                display: inline-block;
                width: 80%;
                text-align: center;
                font-size: 20px;
                font-weight: 700;
                color: #333;
            }
        }

        .btn_wrap {
            padding: 0 10px;
        }

        .face_manage_wrap {
            padding: 10px;

            .header_title_wrap {
                margin-bottom: 20px;
                /*padding-bottom: 20px;*/
                /*border-bottom: 1px solid #eee;*/
                .manage_name {
                    font-size: 20px;
                    font-weight: 700;
                    margin-right: 10px;
                }
            }

            .footer_wrap {
                padding:12px;
            }
        }
    }


    .search-input {
        float: right;
        vertical-align: middle;
        margin-left: 10px;
        width: 220px;
    }


</style>
