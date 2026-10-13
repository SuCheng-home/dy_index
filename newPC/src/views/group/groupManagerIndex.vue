<template>
    <div class="app-container">
        <el-row>
            <el-col :span="4">
                <div style="margin-right: 5px">
                    <router-link :to="{ path: 'groupManagerAdd' }">
                        <el-button v-if="isShowByPermission('/groupManager/groupManagerAdd')" class="filter-item" type="primary" size="medium">
                            添加常用组
                        </el-button>
                    </router-link>
                    <div class="itemWrapper" :style="`height: ${nobottommaxH}px;`">
                        <div
                            @click="itemChange(index)"
                            class="left_bar"
                            :id="item.id"
                            :key="item.id"
                            :class="index === selectIndex ? 'active' : ''"
                            v-for="(item, index) in items"
                        >
                            <a href="javascript: void(0);" :title="item.name">
                              <span class="group_icon group_icon_stu" v-if="item.type === 2">生</span>
                              <span class="group_icon group_icon_parent" v-else-if="item.type === 3">家</span>
                              <span class="group_icon" v-else>师</span>
                              {{item.name}}
                            </a>
                            <i
                                title="编辑"
                                class="el-icon-edit el-icon"
                                @click.stop="handleEditGroup(item.id)"
                            ></i>
                            <i
                                title="删除"
                                class="el-icon-delete el-icon"
                                @click.stop="handleDeleteGroup(index)"
                            ></i>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="20" v-if="items.length !== 0">
                <div class="right_bar">
                    <div style="padding-bottom: 10px" v-show="showBtn">
                        <address-book v-model="addressData" :config="configData" :isbutton="true" :isSchoolManager="true">添加组成员
                        </address-book>
                        <el-button
                            class="filter-item"
                            type="danger"
                            size="medium"
                            icon="delete"
                            @click="handleDeleteGroupMembers"
                        >删除组成员
                        </el-button>
                        <el-button
                            class="filter-item"
                            type="primary"
                            icon="upload"
                            size="medium"
                            @click="handleExcelShow"
                        >Excel导入成员
                        </el-button>
                        <el-select
                            v-model="listQuery.filterVal"
                            size="medium"
                            placeholder="请选择"
                            @change="handleSelectChange"
                            style="width: 90px"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-input
                            size="medium"
                            placeholder="输入姓名搜索"
                            icon="el-icon-search"
                            class="search-input search-input--right"
                            style="width: 24.83333% !important;"
                            @change="handleInputChange"
                            v-model.trim="listQuery.query_name"
                        >
                            <el-button
                                slot="append"
                                icon="el-icon-search"
                                @click="handleInputChange"
                            ></el-button>
                        </el-input>
                    </div>
                    <el-table
                        stripe
                        :data="list"
                        v-loading.body="listLoading"
                        border
                        fit
                        highlight-current-row
                        :height="maxH"
                        @selection-change="handleSelectionChange"
                        ref="mainTable"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column
                            prop="avatar"
                            align="center"
                            label="头像"
                            width="70"
                        >
                            <template slot-scope="scope">
                                <image-previewer tag="richtext">
                                    <img
                                        :src="
                      scope.row.avatar ===
                      '/wxcepClient/resources/admin/images/user_default_head.jpg'
                        ? 'https://cdnfile-10043692.file.myqcloud.com/admin/images/class/user_default_head.jpg'
                        : scope.row.avatar
                    "
                                        alt=""
                                        style="width: 32px; height: 32px; vertical-align: middle"
                                    />
                                </image-previewer>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="姓名">
                            <template slot-scope="scope">
                <span
                >{{ scope.row.name
                  }}<template v-if="scope.row.type == 3"
                    >（家长）</template
                    ></span
                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="gender" align="center" label="性别">
                            <template slot-scope="scope">
                                <span>{{ scope.row.gender | sexFilter }}</span>
                            </template>
                        </el-table-column>
                      <template v-if="selectItem.type === 2">
                        <el-table-column prop="mobile" align="center" label="学号">
                          <template slot-scope="scope">
                            <span>{{ scope.row.learnNum || '--'}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="mobile" align="center" label="班级">
                          <template slot-scope="scope">
                            <span>{{(scope.row.departs && scope.row.departs.length) ? scope.row.departs[0].name : '--' }}</span>
                          </template>
                        </el-table-column>
                      </template>
                      <el-table-column prop="mobile" align="center" label="手机号" v-else>
                        <template slot-scope="scope">
                          <span>{{ scope.row.mobile }}</span>
                        </template>
                      </el-table-column>
                        <el-table-column prop="status" align="center" label="关注状态">
                            <template slot-scope="scope">
                <span
                    :class="
                    scope.row.status === 4 || scope.row.status === 2
                      ? 'redColor'
                      : ''
                  "
                >{{ scope.row.status | statusFilter }}</span
                >
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button
                                    v-show="showBtn"
                                    size="small"
                                    type="text"
                                    @click="handleDelete(scope.row)" class="buttontextred" >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-show="!listLoading" class="pagination-container">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="listQuery.pageNo"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="listQuery.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-col>
            <el-col :span="16" v-if="items.length === 0">
                <default-page Mes="您暂无可操作群组"></default-page>
            </el-col>
        </el-row>

        <el-dialog
            title="Excel导入成员"
            :visible.sync="ExcelDialogVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            size="large"
        >
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="">说明:</span>
                </div>
                <div class="p-box">
          <span class="bold">1.导入顺序</span
          >：请先下载模板，编辑好模板保存为.csv文件，点击选择文件上传编辑好的.csv文件，点击批量导入即可。
                </div>
                <div class="p-box">
          <span class="bold">2.导入规则</span
          >：只有系统用户才可以导入成功，按照{{selectItem.type === 2 ? '学号' : '手机号'}}进行匹配，{{selectItem.type === 2 ? '学号' : '手机号'}}不在系统的用户无法导入成功
                </div>
                <div class="p-box">
          <span class="bold">3.导入结果</span
          >：导入成功后会返回导入结果，用户可先下载导入失败的用户列表
                </div>
            </el-card>
            <a
                :href="`${selectItem.type === 2 ? 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/template/wxcep/user/GroupMemberStu.csv' : 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/template/wxcep/user/GroupMember.csv'}`"
                download="下载模板"
            >
                <el-button class="downLoadTemplate" type="primary" size="medium"
                >下载模板
                </el-button
                >
            </a>
            <transition name="fade">
                <el-upload
                    v-show="uploadShow"
                    ref="upload"
                    class="upload-demo"
                    multiple
                    :action="path"
                    accept=".csv"
                    :on-success="handleUploadSuccess"
                    :before-upload="handleBeforeUpload"
                    :data="{
            groupId: selectItem.id,
            groupName: selectItem.name,
            token: token,
          }"
                >
                    <el-button type="primary" size="medium">点击上传</el-button>
                </el-upload>
            </transition>
            <div v-if="downloadMessage">
                {{ downloadMessage }}
                <el-button
                    v-if="isShowDownloadFailBtn"
                    type="primary"
                    @click="handleDownloadFail"
                    size="medium"
                >下载失败名单
                </el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';

    import _ from "lodash";
    import {
        getAllGroupList,
        getGroupMembersList,
        addGroupMembers,
        deleteGroupMembers,
        deleteGroups,
        toUpdate,
    } from "@/api/group";
    import Cookies from "js-cookie";
    import AddressBook from "@/components/AddressBook/indexExpand";
    import DefaultPage from "@/components/DefaultPage";
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    const sexTypeMap = {1: "男", 2: "女", 0: "未知"};
    const statusTypeMap = {1: "已关注", 4: "未关注", 2: "已禁用"};
    export default {
        name: "group",
        data: function () {
            return {
                items: [],
                selectItem: {},
                selectIndex: 0,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    query_name: "",
                    filterVal: "其他",
                    group_id: "",
                },
                ExcelDialogVisible: false,
                form: {
                    groupName: "",
                    managerSelected: "",
                    employeeSelected: "",
                },
                addressData: {},
                configData: {
                    title: "选择用户",
                    depart: {target: "user", departType: "t", userTypes: "1,3"},
                },
                tConfigData: {title: "选择用户", depart: {target: "user", departType: "t", userTypes: "1,3"}},
                sConfigData: {title: "选择用户", depart: {target: "user", departType: "s", userTypes: "2"}},
                pConfigData: {title: "选择用户", depart: {target: "user", departType: "s", userTypes: "3"}},
                multipleSelection: [],
                downloadMessage: "",
                isShowDownloadFailBtn: false,
                token: Cookies.get("Admin-Token"),
                download: null,
                uploadShow: true,
                options: [
                    {
                        value: "其他",
                        label: "全部",
                    },
                    {
                        value: "yes",
                        label: "已关注",
                    },
                    {
                        value: "no",
                        label: "未关注",
                    },
                    {
                        value: "enable",
                        label: "已禁用",
                    },
                ],
                path: global.BaseNewPath + "oneself/group/importGroupMember",
                showBtn: true
            };
        },
        watch: {
            addressData: {
                handler(curVal) {
                    if (JSON.stringify(curVal) !== "{}") {
                        this.getAddressData(curVal);
                    }
                },
                deep: true,
            },
        },
        components: {
            AddressBook,
            ImagePreviewer,
            DefaultPage,
        },
        mixins: [mixin],
        created() {
            this.getAllGroupList();
        },
        filters: {
            sexFilter(type) {
                return sexTypeMap[type];
            },
            placeFilter(type) {
                if (type === 0) {
                    return "";
                } else {
                    return type;
                }
            },
            statusFilter(type) {
                return statusTypeMap[type];
            },
        },
        methods: {
            isShowByPermission,
            getAddressData(data) {
                const group_id = this.selectItem.id;
                const userids = data.userJson
                    .map((res) => {
                        return res.id;
                    })
                    .toString();
                if (userids !== "") {
                    addGroupMembers({
                        group_id: group_id,
                        userids: userids,
                    })
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.getGroupMembersList();
                                this.$message({
                                    type: "success",
                                    message: "添加成功!",
                                });
                                this.addressData = {}; //清空地址簿默认值，防止下次选择的时候有默认值
                            }
                        })
                        .catch(function (error) {
                        });
                } else {
                    this.$message({
                        type: "info",
                        message: "请选择组成员",
                    });
                }
            },
            handleSelectChange() {
                this.getGroupMembersList();
            },
            handleDownloadFail() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require("@/vendor/Export2Excel");
                    const tHeader = ["姓名", this.selectItem.type === 2 ? "学号" : "手机", "失败原因"];
                    const filterVal = ["name", "mobile", "reason"];
                    const list = JSON.parse(this.download.errorUserStr);
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, "常用组用户导入失败列表");
                });
            },
            handleExcelShow() {
                this.ExcelDialogVisible = true;
                this.$refs.upload.clearFiles();
                this.downloadMessage = "";
                this.isShowDownloadFailBtn = false;
                if (this.download) {
                    this.download.errorUserStr = "";
                }
                this.uploadShow = true;
            },
            handleBeforeUpload(file) {
                const FileExt = file.name.replace(/.+\./, "");
                if (FileExt !== "csv") {
                    this.$message({
                        type: "warning",
                        message: "请上传csv后缀的Excel文件!",
                    });
                    return false;
                }
            },
            handleUploadSuccess(response) {
                // 上传失败
                if (response.code !== 200) {
                    this.$message({
                        type: "warning",
                        message: response.msg,
                    });
                    this.$refs.upload.clearFiles();
                } else {
                    this.uploadShow = false;
                    this.downloadMessage =
                        "上传成功" +
                        response.data.success +
                        "条数据，上传失败" +
                        response.data.fail +
                        "条数据";
                    this.download = response.data;

                    if (response.data.fail > 0) {
                        this.isShowDownloadFailBtn = true;
                    }
                    this.$message({
                        message:
                            "上传成功" +
                            response.data.success +
                            "条数据，上传失败" +
                            response.data.fail +
                            "条数据",
                        type: "info",
                    });
                }
                this.getGroupMembersList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleDeleteGroupMembers() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: "请选择要删除的组成员",
                        type: "warning",
                    });
                } else {
                    this.$confirm("确定要删除吗？", "提示", {
                        type: "error",
                    }).then(() => {
                        const group_id = this.selectItem.id;
                        let userid = "";
                        this.multipleSelection.forEach(function (value) {
                            userid += value.id + ",";
                        });
                        deleteGroupMembers({
                            group_id: group_id,
                            userids: userid.substring(0, userid.length - 1),
                        })
                            .then((res) => {
                                if (res.data.code === 1001) {
                                    this.$message({
                                        type: "error",
                                        message: "不合法的参数!",
                                    });
                                } else {
                                    this.getGroupMembersList();
                                    this.$message({
                                        type: "success",
                                        message: "删除成功!",
                                    });
                                }
                            })
                            .catch(function (error) {
                            });
                    });
                }
            },
            handleDelete(row) {
                this.$confirm("确定要删除吗？", "提示", {
                    type: "error",
                }).then(() => {
                    const group_id = this.selectItem.id;
                    deleteGroupMembers({
                        group_id: group_id,
                        userids: row.id,
                    })
                        .then((res) => {
                            if (res.data.code === 1001) {
                                this.$message({
                                    type: "error",
                                    message: "不合法的参数!",
                                });
                            } else {
                                this.getGroupMembersList();
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                            }
                        })
                        .catch(function (error) {
                        });
                });
            },
            handleDeleteGroup(index) {
                getGroupMembersList({
                    pageNo: 1,
                    pageSize: 20,
                    query_name: "",
                    filterVal: "其他",
                    group_id: this.items[index].id,
                })
                    .then((res) => res.data)
                    .then((data) => {
                        const pageData = data.data;
                        if (pageData.pagination.total !== 0) {
                            this.$message({
                                message: "常用组还有成员，不能删除！",
                                type: "error",
                            });
                        } else {
                            this.$confirm("确定要删除吗？", "提示", {
                                type: "error",
                            }).then(() => {
                                const group_id = this.items[index].id;
                                deleteGroups({
                                    group_id: group_id,
                                })
                                    .then((res) => {
                                        if (res.data.code === 1001) {
                                            this.$message({
                                                type: "error",
                                                message: "不合法的参数!",
                                            });
                                        } else {
                                            this.getAllGroupList();
                                            this.$message({
                                                type: "success",
                                                message: "删除成功!",
                                            });
                                        }
                                    })
                                    .catch(function (error) {
                                    });
                            });
                        }
                    });
            },
            handleEditGroup(id) {
                toUpdate(id).then((res) => {
                        //跳转前通过接口获取使用人、创建人信息
                        this.$router.push({path: "groupManagerAdd", query: res.data.data});
                    })
                    .catch(function (error) {
                    });
            },
            handleInputChange: _.debounce(
                function (val) {
                    this.getGroupMembersList();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            itemChange(index) {
                this.selectIndex = index;
                this.selectItem = this.items[this.selectIndex];
              this.changeConfig();
                this.showBtn = this.$store.state.user.userInfo.id === this.selectItem.manuserId;
                this.listQuery.group_id = this.selectItem.id;
                this.getGroupMembersList();
            },
            getGroupMembersList() {
                this.listLoading = true;
                getGroupMembersList(this.listQuery)
                    .then((res) => {
                        this.list = res.data.data.dataList;
                        this.total = res.data.data.pagination.total;
                        this.listLoading = false;
                    })
                    .catch(function (error) {
                    });
            },
            getAllGroupList() {
                getAllGroupList()
                    .then((res) => {
                        this.items = res.data.data;
                        // 新增从首页进入
                        if (this.$route.query.groupId) {
                            this.items.forEach((item, index) => {
                                if (item.id == this.$route.query.groupId) {
                                    this.selectIndex = index;
                                }
                            });
                        } else {
                            this.selectIndex = 0;
                        }
                        if (res.data.data && res.data.data.length) {
                            this.selectItem = this.items[this.selectIndex];
                            this.changeConfig();
                            this.showBtn = this.$store.state.user.userInfo.id === this.selectItem.manuserId;
                            this.listQuery.group_id = this.selectItem.id;
                            this.getGroupMembersList();
                        }
                    })
                    .catch(function (error) {
                    });
            },
          changeConfig() {
            if (this.selectItem.type === 3) {
              this.configData = this.pConfigData;
            } else if (this.selectItem.type === 2) {
              this.configData = this.sConfigData;
            } else if (this.selectItem.type === 1) {
              this.configData = this.tConfigData;
            }
          },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getGroupMembersList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getGroupMembersList();
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map((v) => filterVal.map((j) => v[j]));
            },
        },
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    .p-box {
        line-height: 24px;
        padding-bottom: 5px;
    }

    .left_bar {
        margin-bottom: 10px;
        padding: 5px;
        display: flex;

        a {
            display: block;
            width: 215px;
            width: 80%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor: pointer;
        }

        i {
            flex: 1;
            cursor: pointer;
        }
    }

    .active {
        color: #20a0ff;
        background: #e5e9f2;
    }

    .redColor {
        color: red;
    }

    .el-icon-delete,
    .el-icon-edit {
        font-size: 12px;
        float: right;
        line-height: 21px;
    }

    .el-icon-delete:hover,
    .el-icon-delete:focus,
    .el-icon-delete:visited {
        color: #e64340;
    }

    .el-icon-edit:hover,
    .el-icon-edit:focus,
    .el-icon-edit:visited {
        color: #e64340;
    }

    .el-icon + .el-icon {
        padding-right: 8px;
    }

    .bold {
        font-weight: bold;
    }

    .downLoadTemplate {
        margin: 5px 0 5px 0;
    }

    .itemWrapper {
        margin-top: 10px;
        overflow-y: auto;
        @include scrollBar;
      .group_icon{
        margin-right: 4px;
        padding: 2px;
        font-size: 12px;
        color: #fff;
        background-color: #67C23A;
        border-radius: 4px;
      }
      .group_icon_stu{
        background-color: #F56C6C;
      }
      .group_icon_parent{
        background-color: #E6A23C;
      }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>
