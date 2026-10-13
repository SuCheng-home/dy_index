<template>
    <div class="supply_class_wrap">
        <div class="header">
            <el-button type="primary" @click="jumpToPage('supplyLessonAddEdit')" size="medium">新增</el-button>
            <el-button type="primary" @click="jumpToPage('supplyLessonAccounting')" size="medium">查看统计</el-button>
            <el-select v-model="state" placeholder="请选择状态" size="medium" style="width: 150px;"
                               @change="getSubstituteClassPageList">
                        <el-option label="全部状态" :value="0"></el-option>
                        <el-option label="待审核" :value="-2"></el-option>
                        <el-option label="已审核" :value="2"></el-option>
                        <el-option label="草稿" :value="1"></el-option>
                        <!-- <el-option label="被驳回" :value="-1"></el-option> -->
                    </el-select>
             <el-input class="search-input" style="width:20%;float: right;"  
                          placeholder="请输入老师姓名" icon="search" size="medium" @change="getSubstituteClassPageList()"
                          v-model.trim="supplyTeacherName">
                    <el-button slot="append" icon="el-icon-search" @click="getSubstituteClassPageList()"></el-button>
            </el-input>
        </div>
        <div class="supply_class_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                      :height="maxH">
                <el-table-column prop="supplyTeacherName" label="代班老师"></el-table-column>
                <el-table-column prop="adjustDate" label="日期">
                    <template slot-scope="scope">
                        {{weekfun(scope.row.adjustDate)}}
                        <span v-if="scope.row.substituteType == 2">
                             {{scope.row.startDayType == 2 ? '下午':'上午'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="adjustClassName" label="需代班级"></el-table-column>
                <el-table-column prop="adjustTeacherName" label="被代班老师"></el-table-column>
                <el-table-column label="节次/天数">
                    <template slot-scope="scope">
                        {{scope.row.substituteType == 1 ? scope.row.adjustClassNoName : scope.row.substituteDayNum+'天'}}
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    代班
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini"  type="info" v-if="scope.row.state == 1">草稿</el-tag>
                        <el-tag  size="mini" v-else-if="scope.row.state == -2" type="warning">待审核</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.state == 2">已同意</el-tag>
                        <el-tag  size="mini" type="danger" v-else>被驳回</el-tag>
                    </template>

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.state == -2" @click="reviewHandler(scope.row)">审核</el-button>
                        <el-button type="text" v-if="scope.row.state == 1" @click="jumpToPage('supplyLessonAddEdit', {id: scope.row.id})">编辑</el-button>
                        <el-button type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <el-dialog title="审核" :visible.sync="isShowReviewDialog" @close="onDialogClose" size="tiny" append-to-body width="30%">
            <div>
                <el-form
                    :model="formData"
                    ref="form"
                    :rules="rules"
                    label-width="80px"
                >
                    <el-form-item label="代班老师" v-if="reviewItem.supplyTeacherName">
                        {{reviewItem.supplyTeacherName}}
                    </el-form-item>
                    <el-form-item label="代班老师" prop="supplyTeacherJson" v-else>
                        <address-book ref="addressBook" v-model="formData.supplyTeacherJson" :config="otherTeacherConfig"></address-book>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入审批意见"
                            @blur="formData.examineRemark = formData.examineRemark.trim()"
                            v-model="formData.examineRemark"
                        >
                        </el-input>
                    </el-form-item>

                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="medium" @click="reviewConfirm(2)">同意</el-button>
                <el-button type="danger" size="medium" @click="reviewConfirm(-1)">不同意</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixins from '@/mixins/windowResize';
    import {
        getSubstituteClassPageList,
        deleteSupplyClass,
        examineSupplyAdjustClass
    } from '@/api/supplyLesson';

    export default {
        name: "supplyLessonList",
        data() {
            const checkAddressData = (rule, value, callback) => {
                if ((value.userJson && value.userJson.length > 0) ) {
                    callback();
                } else {
                    return callback(new Error('请选择代班老师！'));
                }
            };
            return {
                dataList: [],
                reviewItem: {},
                otherTeacherConfig: {
                    title: '选择老师',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: false,
                    SingleChose: true
                },
                formData: {
                    supplyTeacherJson: {
                        userJson: []
                    },
                    examineRemark: '',
                },
                rules: {
                    supplyTeacherJson: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ]
                },
                isShowReviewDialog: false,
                state:0,
                 listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                },
                total:0,
                supplyTeacherName:''
            }
        },
        components: {AddressBook},
        mixins: [mixins],
        created() {
            this.getSubstituteClassPageList();
        },
        methods: {
             weekfun(day){
             if(day){
                let myDate = new Date(day)
                let wk = myDate.getDay()
                let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                return day + weeks[wk]
             }            
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
             handleSizeChange(val) {
                this.listQuery.pageNo = 1
                this.listQuery.pageSize = val
                this.getSubstituteClassPageList()
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val
                this.getSubstituteClassPageList()
            },
            getSubstituteClassPageList() {
                getSubstituteClassPageList({
                    searchDate: '',
                    state: this.state,
                    supplyTeacherName: this.supplyTeacherName,
                    pageNo:this.listQuery.pageNo,
                    pageSize:this.listQuery.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList
                        this.total = data.data.pagination.total
                    })
            },
            deleteHandler(id) {
                this.$confirm('确认删除该代班记录吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSupplyClass({
                        supplyClassIds: id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getSubstituteClassPageList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            onDialogClose() {
                this.formData = {
                    supplyTeacherJson: {
                        userJson: []
                    },
                    examineRemark: '',
                };
            },
            reviewHandler(item) {
                this.isShowReviewDialog = true;
                this.reviewItem = item;
            },
            reviewConfirm(state) {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        if(state == -1 && this.formData.examineRemark.trim() === '') {
                            this.$message.error('请输入审批意见');
                            return undefined;
                        }
                        const args = {
                            id: this.reviewItem.id,
                            examineRemark: this.formData.examineRemark.trim(),
                            supplyTeacherJson: JSON.stringify(this.formData.supplyTeacherJson.userJson),
                            state,
                            adjustClassId: this.reviewItem.adjustClassId,
                            adjustClassName: this.reviewItem.adjustClassName,
                            adjustClassNo: this.reviewItem.adjustClassNo,
                            adjustClassNoName: this.reviewItem.adjustClassNoName,
                            adjustDate: this.reviewItem.adjustDate,
                            createUserType: this.reviewItem.createUserType,
                            substituteDayNum: this.reviewItem.substituteDayNum,
                            substituteType: this.reviewItem.substituteType,
                            supplyDate: this.reviewItem.supplyDate,
                            reason: this.reviewItem.reason,

                        };
                        examineSupplyAdjustClass(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(`审核成功`);
                                } else {
                                    this.$message.error(data.msg);
                                }
                                setTimeout(() => {
                                    this.isShowReviewDialog = false;
                                    this.getSubstituteClassPageList();
                                }, 1000);
                            });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supply_class_wrap {
        padding:12px;

        .header {
            padding-bottom: 10px;
        }

        .link {
            color: #1989fa;
            cursor: pointer
        }
    }
</style>
<style scoped>
    table {
        width: 100%;
        box-sizing: border-box;
        border-collapse: collapse;
    }

    table th, table td {
        width: 14.2%;
        height: 40px;
        text-align: center;
        border: 1px solid #ddd;
    }
</style>
