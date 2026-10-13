<template>
    <div class="open_class_sign_wrap">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <a :href="exportURL" download="导出结果" target="_blank" v-if="signList.length">
                <el-button class="filter-item" size="medium" type="primary">导出</el-button>
            </a>
            <address-book v-if="isSchoolOpenClass && isShowByRole(7)" v-model="addressData" @input="onAddressBookInput" :config="configData" :isbutton="true" :isSchoolManager="true">添加预约人</address-book>
        </div>
        <div class="open_class_sign_box">
            <el-table stripe :data="signList" border style="width: 100%;" :height="maxH - 1">
                <el-table-column prop="teacherName" label="姓名"></el-table-column>
                <el-table-column label="预约情况">
                    <template slot-scope="scope">
                        <span v-if="scope.row.appointmentState === 1">已预约</span>
                        <span v-else>未预约</span>
                    </template>
                </el-table-column>
                <el-table-column label="签到情况">
                    <template slot-scope="scope">
                        <span v-if="scope.row.registerState === 1">已签到</span>
                        <span v-else>未签到</span>
                    </template>
                </el-table-column>
                <el-table-column label="签到时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.registerState === 1">{{scope.row.registerDate | timeFilter}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {isShowByRole} from '@/utils';
    import mixins from '@/mixins/windowResize';
    import {queryRegisterOrder, insertOrderFromRegister} from "@/api/teachingStudy/openClass";
    import AddressBook from "@/components/AddressBook/indexExpand";

    export default {
        name: "openClassSignList",
        data() {
            return {
                isSchoolOpenClass: this.$route.query.isSchoolOpenClass == 1,
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                signList: [],
                exportURL: '',
                searchName: '',
                addressData: {},
                configData: {
                    title: "发布范围",
                    depart: { target: "all", departType: "t", userTypes: "1", notCheckSchool: false },
                    group: false
                },
            }
        },
        components: {AddressBook},
        mixins: [mixins],
        filters: {
            timeFilter(time) {
                return time ? time.slice(0, 19) : '--';
            }
        },
        created() {
            this.getStatistics();
        },
        methods: {
            isShowByRole,
            onAddressBookInput(addressData) {
                if (addressData.departJson.length !== 0 || addressData.userJson.length !== 0) {
                    insertOrderFromRegister({
                        registerId: this.$route.query.id,
                        userJSON: JSON.stringify(addressData.userJson),
                        departJSON: JSON.stringify(addressData.departJson)

                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: "添加成功！",
                                    type: "success"
                                });
                                this.addressData = {
                                    departJson: [],
                                    groupJson: [],
                                    userJson: []
                                };
                                this.getStatistics();
                            }
                        });
                } else {
                    this.$message.error("请选择添加的预约人！");
                }
            },
            goBack() {
                this.$router.back();
            },
            getStatistics() {
                this.exportURL = global.BasePath + 'structure/listenClassRegister/downRegisterOrder?registerId='
                    + this.$route.query.id + '&searchName=' + this.searchName + '&token=' + this.$store.getters.token;
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    registerId: this.$route.query.id,
                    searchName: this.searchName
                };
                this.queryRegisterOrder(query);
            },
            queryRegisterOrder(query) {
                queryRegisterOrder(query).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.signList = data.dataList;
                        this.pagination.total = data.pagination.total;
                    }
                }).catch();
            },
            sizeChangeHandler() {
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .open_class_sign_wrap {
        padding:12px;

        .header {
            padding-bottom: 10px;
        }
    }
</style>
