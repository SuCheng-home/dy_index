<template>
    <div class="page">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <!---->
                    <grade-class-selector :schoolManagerRoles="[20220920]" :gradeManagerRoles="[]"
                                          @change="onGradeClassChange"></grade-class-selector>
                    <el-select @change="getList(true)" v-model="status" placeholder="请选择状态" size="medium"
                               style="width: 150px;">
                        <el-option label="全部状态" :value="0"></el-option>
                        <el-option label="未审核" :value="1"></el-option>
                        <el-option label="未通过" :value="2"></el-option>
                        <el-option label="待定" :value="3"></el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="clearAllFunc" v-if="isShowByRole(20220920)">一键清空</el-button>
                    <a :href="exportURL" download="导出结果" target="_blank">
                        <el-button size="medium" class="btnLeftLine" type="primary" icon="upload">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" placeholder="请输入姓名" v-model.trim="name"
                              @keyup.enter.native="getList(true)">
                        <el-button slot="append" icon="el-icon-search" @click="getList(true)"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table
                :data="dataList"
                border
                style="width: 100%"
                :height="maxH"
            >
                <el-table-column
                    label="学生姓名"
                    show-overflow-tooltip
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="身份证号"
                    align="center"
                    :resizable="false"
                    show-overflow-tooltip
                    prop="cardId"
                >
                </el-table-column>
                <el-table-column
                    label="年级"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{scope.row.gradeName}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="班级"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{scope.row.className}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="家长"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <div v-for="parentItem in scope.row.parents">
                            <span>{{parentItem.nick}}</span>&nbsp;&nbsp;<span>{{parentItem.mobile}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="登记时间"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{scope.row.createTime | timeSuffixFilter}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="primary"  v-if="scope.row.status == 1">未审核</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.status == 2">未通过</el-tag>
                        <el-tag  size="mini" type="info"  v-if="scope.row.status == 3">待定</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            v-if="scope.row.status == 1"
                            @click="reviewFunc(scope.row, 1)">通过
                        </el-button>
                        <el-button
                            size="small"
                            type="text"
                            v-if="scope.row.status == 1"
                            @click="reviewFunc(scope.row, 2)">不通过
                        </el-button>
                        <el-button
                            size="small"
                            type="text"
                            @click="editFunc(scope.row)">编辑
                        </el-button>
                        <el-button size="small" type="text" @click="reviewFunc(scope.row, 3)" v-if="scope.row.status != 3">待定
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    @size-change="sizeChangeHandler"
                    @current-change="currentChangeHandler"
                    :current-page.sync="pagination.pageNo"
                    :page-sizes="[10 , 20, 30, 50]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync="isShowEditDialog"
                   :close-on-click-modal="false" :show-close="false" :lock-scroll="false"
                   size="tiny" width="500px"
                   :modal-append-to-body='false'>
            <el-form :model="editForm" ref="editForm" :rules="editFormRules">
                <el-form-item label="学生姓名" label-width="100px" prop="name">
                    <el-input style="width: 90%" v-model.trim="editForm.name" :maxlength="20"
                              placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" label-width="100px" prop="cardId">
                    <el-input @blur="editForm.cardId = editForm.cardId.replace(/[^\dxX]/g, '')"
                              placeholder="请输入身份证号" style="width: 90%;" type="text"
                              v-model.trim="editForm.cardId"
                              :maxlength="18"/>
                </el-form-item>
                <el-form-item label="年级" label-width="100px" prop="gradeId">
                    <el-select v-model="editForm.gradeId" placeholder="请选择年级" size="medium"
                               @change="onEditGradeCange"
                               style="width: 150px;">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" label-width="100px" prop="classId">
                    <el-select v-model="editForm.classId" placeholder="请选择班级" size="medium"
                               style="width: 150px;">
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="家长" label-width="100px" prop="parents">
                    <div style="margin-bottom: 5px;" v-for="(parentItem, index) in editForm.parents">
                        <el-select v-model="parentItem.nick" placeholder="请选择班级"
                                   style="width: 100px;">
                            <el-option v-for="[key, text] in parentsNickConstants" :key="key" :label="text" :value="text">
                            </el-option>
                        </el-select>
                        <el-input placeholder="请输入手机号" style="width: 50%;" type="text"
                                  v-model.trim="parentItem.mobile"
                                  :maxlength="13"/>
                        <i class="el-icon-close" @click="deleteParent(index)"></i>
                    </div>
                    <div>
                        <i class="el-icon-plus" @click="addParent()"></i>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="editConfirmFunc">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { isShowByRole } from "@/utils";
    import windowResizeMixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import GradeClassSelector from '@/components/GradeClassSelector';
    import {parentsNickConstants} from '@/utils/constants'
    import idCard from 'idcard';
    import {
        newRegistrationListPage,
        newRegistrationUpdate,
        newRegistrationClearAll,
        newRegistrationTentative,
        newRegistrationNoPass,
        newRegistrationPass
    } from '@/api/newStuReview';
    import { querySchoolGrade, querySchoolClass } from '@/api/system';

    import {mapGetters} from 'vuex';

    export default {
        data() {
            const idCardValidator = (rule, value, callback) => {
                if (this.editForm.cardId.trim() === '') {
                    callback(new Error('请输入身份证号'));
                } else if (!idCard.verify(this.editForm.cardId.toUpperCase())) {
                    callback(new Error('身份证号格式不正确'));
                } else {
                    callback();
                }
            };
            const parentsValidator = (rule, value, callback) => {
                if (this.editForm.parents.length === 0) {
                    callback(new Error('至少填写一个家长'));
                } else if (this.editForm.parents.some(item => item.mobile.trim() === '')) {
                    callback(new Error('家长手机号不能为空'));
                } else if (this.editForm.parents.some(item => !(/^0?1[345789][0-9]\d{8}$/.test(item.mobile.trim())))) {
                    callback(new Error("手机号码格式不正确！"))
                } else {
                    callback();
                }
            };
            return {
                parentsNickConstants,
                status: 0,
                classId: 0,
                gradeId: 0,

                name: '',
                dataList: [],

                gradeList: [],
                allClassList: [],

                isShowEditDialog: false,
                editId: null,
                editForm: {
                    name: '',
                    cardId: '',
                    gradeId: '',
                    classId: '',
                    parents: [{
                        nick: '爸爸',
                        mobile: ''
                    }]
                },
                editFormRules: {
                    name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
                    cardId: [{ required: true, validator: idCardValidator, trigger: 'blur' }], //
                    gradeId: [{ required: true, message: "请选择年级", trigger: 'blur' }],
                    classId: [{ required: true, message: "请选择班级", trigger: 'blur' }],
                    parents: [{ required: true, validator: parentsValidator, trigger: 'blur' }], //
                }
            };
        },
        components: {GradeClassSelector},
        mixins: [windowResizeMixin, baseMixin],
        created() {
            querySchoolGrade({
                isFilterNewGrade: false
            })
                .then(res => res.data)
                .then(data => {
                    this.gradeList = data.data;
                });
            querySchoolClass({
                isFilterNewGrade: false
            })
                .then(res => res.data)
                .then(data => {
                    console.log(data.data)
                    this.allClassList = data.data;
                });
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ]),
            exportURL() {
                const prefix = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/ucenter-web/' : 'https://www.weixiaojia.net/ucenter-web/';
                return `${prefix}newRegistration/exportData?gradeId=${this.gradeId}&classId=${this.classId}&name=${this.name}&status=${this.status}&token=${this.$store.getters.token}`;
            },
            classList() {
                if(this.editForm.gradeId) {
                    return this.allClassList.filter(item => item.pid == this.editForm.gradeId);
                } else {
                    return []
                }
            }
        },
        methods: {
            isShowByRole,
            onEditGradeCange() {
                this.editForm.classId = '';
            },
            deleteParent(index) {
                this.editForm.parents.splice(index, 1);
            },
            addParent() {
                this.editForm.parents.push({
                    nick: '爸爸',
                    mobile: ''
                })
            },
            onGradeClassChange(obj) {
                this.gradeId = obj.gradeId;
                this.classId = obj.classId;
                this.getList(true);
            },
            getList(isFromPage1 = false) {
                if (isFromPage1) {
                    this.pagination.pageNo = 1;
                }
                newRegistrationListPage({
                    classId: this.classId,
                    gradeId: this.gradeId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    status: this.status,
                    name: this.name
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.dataList.forEach(item => {
                            if(item.parents) {
                                item.parents = JSON.parse(item.parents);
                            }
                        });
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },

            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getList(true);
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getList(false);
            },
            clearAllFunc() {
                this.$confirm('确认要清空删除全部登记信息吗？', '清除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    newRegistrationClearAll()
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('清空成功');
                                this.getList(true);
                            }
                        })
                });
            },
            reviewFunc(item, opt) {
                this.$confirm(`是否确认${['', '通过', '不通过', '待定'][opt]}该学生`, '操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const args = {
                        id: item.id
                    };
                    new Promise(resolve => {
                        if(opt === 1) {
                            newRegistrationPass(args)
                                .then(resolve)
                        } else if(opt === 2) {
                            newRegistrationNoPass(args)
                                .then(resolve)
                        } else if(opt === 3) {
                            newRegistrationTentative(args)
                                .then(resolve)
                        }
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message(`操作成功`);
                                this.getList();
                            }
                        })
                });

            },
            editFunc(item) {
                this.editId = item.id;
                let gradeId = 0;
                this.allClassList.forEach(classItem => {
                    if(classItem.id == item.classId) {
                        gradeId = classItem.pid;
                    }
                });
                this.editForm = {
                    name: item.name,
                    cardId: item.cardId,
                    gradeId,
                    classId: item.classId,
                    parents: JSON.parse(JSON.stringify(item.parents))
                }
                this.isShowEditDialog = true;
            },
            editConfirmFunc() {
                this.$refs.editForm.validate(isValid => {
                    if(isValid) {
                        newRegistrationUpdate({
                            cardId: this.editForm.cardId,
                            classId: this.editForm.classId,
                            id: this.editId,
                            name: this.editForm.name,
                            parents: JSON.stringify(this.editForm.parents)
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('编辑成功');
                                    this.getList();
                                    this.isShowEditDialog = false;
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .page {
        padding: 12px;
    }

    .header {
        margin-bottom: 10px;

    }

    .search-input {
        vertical-align: middle;
    }
    .el-icon-close {
        color: #F08080;
        font-weight: bold;
        cursor: pointer;
    }
    .el-icon-plus {
        font-weight: bold;
        cursor: pointer;
    }
</style>
