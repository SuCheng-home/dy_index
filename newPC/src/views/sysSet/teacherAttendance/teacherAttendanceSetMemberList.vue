<template>
    <div class="attendance_member_wrap">
        <div class="top">
             <el-row>
            <el-col :span="19">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <address-book v-model="teacherAddressData" :config="teacherAddressConfigData" :isbutton="true" @input="addNewMember">增加人员</address-book>
                <el-button type="primary" size="medium" @click.native="removeMembers" >移除</el-button>
                <el-button type="primary" size="medium" @click.native="effectiveSelectImmediately">立即生效</el-button>
            </el-col>
            <el-col :span="5">
                 <el-input placeholder="请输入姓名"  size="medium" v-model.trim="searchName"
                      @keyup.enter.native="queryRuleUserByRuleId">
                <el-button slot="append" icon="el-icon-search" @click="queryRuleUserByRuleId"></el-button>
            </el-input>
            </el-col>
        </el-row>
        </div>       
        <div>
            <el-table ref="multipleTable" :data="attendanceMemberList" border stripe :height="maxH" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
                <el-table-column label="所在部门" align="center" prop="userDepartNames" show-overflow-tooltip></el-table-column>
                <el-table-column label="手机号码" align="center" prop="mobile"></el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="effectiveImmediately(scope.row.id)">立即生效</el-button>
                        <el-button  size="small" type="text" @click="removeMember(scope.row.id)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pageNo" :page-sizes="[10,20,30,50]"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixins from '@/mixins/windowResize';
    import {queryRuleUserByRuleId, deleteRuleUserByIds, rightEffectByRuleUserIds, addRuleUser} from '@/api/systemSet/teacherAttendanceSet';

    export default {
        name: "teacherAttendanceSetMemberList",
        components: {
            AddressBook
        },
        data() {
            return {
                pageNo:1,
                pageSize:20,
                total:null,
                listLoading:false,
                searchName: '',
                attendanceMemberList: [],
                memberIds: [],
                teacherAddressData: {},
                teacherAddressConfigData: {
                    title: '请选择老师',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: false
                },
            }
        },
        created() {
            this.queryRuleUserByRuleId();
        },
        mixins:[mixins],
        methods: {
            queryRuleUserByRuleId() {
                let query = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    ruleId: parseInt(this.$route.query.ruleId),
                    searchName: this.searchName
                };
                queryRuleUserByRuleId(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.attendanceMemberList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }
                }).catch(() => {});
            },
            addNewMember(val) {
                // 完成后清空人员
                let query = {
                    departIds: this.getIds(val.departJson),
                    ruleId: parseInt(this.$route.query.ruleId),
                    userIds: this.getIds(val.userJson)
                };
                this.addRuleUser(query);
            },
            getIds(list) {
                let idArray = [];
                list.forEach((item) => {
                    idArray.push(item.id);
                });
                return idArray.length ? idArray.toString() : '';
            },
            removeMembers() {
                if (this.isChooseMember()) {
                    this.deleteRuleUserByIds(this.memberIds.toString());
                }
            },
            effectiveSelectImmediately() {
                if (this.isChooseMember()) {
                    this.rightEffectByRuleUserIds(this.memberIds.toString());
                }
            },
            isChooseMember() {
                if (!this.memberIds || !this.memberIds.length) {
                    this.$message({
                        type: 'info',
                        message: '请选择人员'
                    });
                    return false;
                }
                return true;
            },
            handleCurrentChange(val){
                this.pageNo=val;
                this.queryRuleUserByRuleId();
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.pageNo=1;
                this.queryRuleUserByRuleId();
            },
            handleSelectionChange(val){
                this.memberIds = [];
                val.forEach((item) => {
                    this.memberIds.push(item.id);
                });
            },
            effectiveImmediately(memberId) {
                this.rightEffectByRuleUserIds(memberId.toString());
            },
            rightEffectByRuleUserIds(ruleUserIds) {
                let query = {
                    ruleId: parseInt(this.$route.query.ruleId),
                    ruleUserIds: ruleUserIds,
                };
                rightEffectByRuleUserIds(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    }
                }).catch(() => {});
            },
            removeMember(memberId) {
                this.$confirm('是否移除该人员？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRuleUserByIds(memberId.toString());
                }).catch(() => {
                });
            },
            deleteRuleUserByIds(ruleUserIds) {
                deleteRuleUserByIds(ruleUserIds).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '人员移除成功'
                        });
                        this.queryRuleUserByRuleId();
                    }
                }).catch(() => {});
            },
            addRuleUser(query) {
                addRuleUser(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '人员添加成功'
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: data.msg
                        });
                    }
                    this.teacherAddressData = {};
                    this.queryRuleUserByRuleId();
                }).catch(() => {
                    this.teacherAddressData = {};
                    this.queryRuleUserByRuleId();
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .attendance_member_wrap{
        padding:12px;
    }
    .top{
        padding-bottom: 10px;
    }
</style>
