<template>
    <div class="page">
        <div v-show="kind == 'file'">
            <div>
                <div class="page-header">
                     <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                            @change="searchTitleHandler()"></el-date-picker>
                    <el-select size="medium" v-model="status" placeholder="请选择" @change="searchTitleHandler">
                      <el-option
                        v-for="item in optionsStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="jumpToPage('printApplyAddEdit', {kind: kind})">
                        新建
                    </el-button>
                      <a :href="exportUrl" download="导出" target="_blank" >
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
                    <el-input placeholder="资料名称" size="medium" v-model="searchTitle"
                              class="search-input search-input--right"
                              @keyup.enter.native="searchTitleHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
                    </el-input>
                </div>
                <el-table stripe :data="dataList" border fit highlight-current-row
                          style="width: 100%" :height="nobottommaxH - 5">
                    <el-table-column label="资料名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span class="link-type"
                                      @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind, isApply: 1})">{{scope.row.name}}</span>
                           
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="applyUserName" label="申请人">
                    </el-table-column>
                     <!-- <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column> -->
                    <el-table-column align="center" label="申请时间">
                        <template slot-scope="scope">
                            {{scope.row.createTime | timeSuffixFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column class-name="status-col" label="状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini">{{getStatusText(scope.row)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                                       :disabled=" scope.row.status != 1 && scope.row.status != 2 && scope.row.status != 3"
                                       @click.native="jumpToPage(`printApplyAddEdit`, {kind, id: scope.row.id})">编辑
                            </el-button>
                            <el-button size="small" type="text"
                                       :disabled="scope.row.status != 1 && scope.row.status != 3 && scope.row.status != -1"
                                       @click.native="deleteHandler(scope.row)" class="buttontextred">删除
                            </el-button>
                            <el-button size="small" type="text"
                                       v-if="scope.row.status == 4 && scope.row.state == null"
                                       @click.native="revokeBeforePrint(scope.row)">撤回
                            </el-button>
                            <el-button size="small" type="text" v-else :disabled="scope.row.status != 2"
                                       @click.native="revokeHandler(scope.row)">撤回
                            </el-button>
                            <el-button size="small" type="text" :disabled="(scope.row.status != 5)||(scope.row.createUserId!=userInfo.id)"
                                       @click.native="confirmHandler(scope.row)">确认
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div  v-show="kind == 'material'">
            <div>
                <div class="page-header">
                     <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                            @change="searchTitleHandler()"></el-date-picker>
                    <el-select size="medium" v-model="status" placeholder="请选择" @change="searchTitleHandler">
                      <el-option
                        v-for="item in optionsStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="jumpToPage('printApplyAddEdit', {kind: kind})">
                        新建
                    </el-button>
                      <!-- <a :href="exportUrl" download="导出" target="_blank" >
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a> -->
                    <el-input placeholder="申请名称" size="medium" v-model="searchTitle"
                              class="search-input search-input--right"
                              @keyup.enter.native="searchTitleHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
                    </el-input>
                </div>
                <el-table stripe :data="dataList" border fit highlight-current-row
                          style="width: 100%" :height="nobottommaxH - 5">
                    <el-table-column label="申请名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span class="link-type"
                                      @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind, isApply: 1})">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="useTypeName" label="用途类型">
                    </el-table-column>
                     <el-table-column align="center" prop="applyUserName" label="申请人">
                    </el-table-column>
                     <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column>
                    <el-table-column align="center" label="申请时间">
                        <template slot-scope="scope">
                            {{scope.row.createTime | timeSuffixFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column class-name="status-col" label="状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini">{{scope.row.status | statusFilterMaterial}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                                       :disabled="scope.row.status != 1 &&  scope.row.status != 3"
                                       @click.native="jumpToPage(`printApplyAddEdit`, {kind, id: scope.row.id})">编辑
                            </el-button>
                            <el-button size="small" type="text"
                                       :disabled="scope.row.status != 1 && scope.row.status != 3 && scope.row.status != -1"
                                       @click.native="deleteHandler(scope.row)" class="buttontextred">删除
                            </el-button>
                            <el-button size="small" type="text" :disabled="scope.row.status != 2"
                                       @click.native="revokeHandler(scope.row)">撤回
                            </el-button>
                            <el-button size="small" type="text" :disabled="(scope.row.status != 5)||(scope.row.createUserId!=userInfo.id)"
                                       @click.native="confirmHandler(scope.row)">确认
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <el-dialog title="撤回理由" :visible.sync="isShowRevokeDialog" width="30%">
            <div class="ebody">
                <el-form ref="revokeForm" :model="revokeForm" :rules="revokeRule" label-width="0">
                    <el-form-item :label="''" prop="revokeReason">
                        <el-input v-model.trim="revokeForm.revokeReason" :rows="5" :maxlength="100" type="textarea"
                                  placeholder="请输入撤回理由(1-100个字符)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="isShowRevokeDialog = false">取 消</el-button>
				<el-button type="primary" @click="revokeBeforePrintConfirm()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        findApplyList,
        delPrintSeniorApply,
        confirmPrintSeniorApply,
        revokePrintSeniorApply
    } from '@/api/printApplication';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeAllList} from "@/api/schedule";
    export default {
        name: "printApply",
        mixins: [baseMixin, mixin],
        data() {
            return {
                 daterange: ['', ''],
                kind: this.$route.query.kind || 'file',
                searchTitle: '',
                status: 0,
                dataList: [],
                 pagination: {
                    startDate: "",
                    endDate: "",
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                },
                optionsStatus: [
                  {value: 0, label: '全部状态'},
                  {value: 1, label: '草稿'},
                  {value: 2, label: '待审批'},
                  {value: 3, label: '被驳回'},
                  {value: 4, label: '已通过'},
                  {value: 5, label: '已打印'},
                  {value: 6, label: '已领取'}
                ],
                isShowRevokeDialog: false,
                revokeForm: {
                    revokeReason: ''
                },
                revokeRule: {
                    revokeReason: [
                        {required: true, message: `撤回理由不能为空`, trigger: "blur"},
                    ],
                },
                revokeItem: null,
                 exportUrl: ''
            }
        },
        watch: {
            $route(newRoute) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = 20;
                this.kind = newRoute.query.kind || 'file';
                this.findApplyListFunc();
            }
        },
         computed: {
            ...mapGetters(['userInfo'])
        },
        filters: {
            statusFilterMaterial(status) {
                return {
                    '-1': '已撤回',
                    1: '草稿',
                    2: '待审批',
                    3: '被驳回',
                    4: '已通过',
                    5: '已发放',
                    6: '已领取'
                }[status];
            }
        },
        created() {
             getSchoolTimeAllList().then(res => {
                let data = res.data.data;
                for (let item of data) {
                    if (item.isCurrent == 1) {
                        if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.daterange = [new Date(),item.startDate];
                            }else{
                              this.daterange = [item.startDate,new Date()];
                            }
                       this.findApplyListFunc();
                    }
                }
            }).catch(err => {
            });
            
        },
        methods: {
            getStatusText(item) {
                let text = '';
                if(item.status != 4) {
                    text = {
                        '-1': '已撤回',
                        1: '草稿',
                        2: '待审批',
                        3: '已驳回',
                        4: '已通过',
                        5: '已打印',
                        6: '已领取'
                    }[item.status];
                } else {
                    text = {
                        1: '已撤回',
                        2: '已通过',
                        3: '已通过',
                        null: '已通过'
                    }[item.state]
                }
                return text;

            },
            searchTitleHandler() {
                this.pagination.pageNo = 1;
                this.findApplyListFunc();
            },
            handleSizeChange(val) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = val;
                this.findApplyListFunc();
            },
            handleCurrentChange(val) {
                this.pagination.pageNo = val;
                this.findApplyListFunc();
            },
            tabsfunc() {
                this.pagination.pageNo = 1;
                this.searchTitle = '';
                this.status = 0;
                if (this.kind === 'file') {
                    this.$router.replace({
                        path: "printApply",
                        query: {
                            kind: 'file'
                        }
                    });
                } else if (this.kind === 'material') {
                    this.$router.replace({
                        path: "printApply",
                        query: {
                            kind: 'material'
                        }
                    });
                }
            },
            revokeBeforePrint(item) {
                this.revokeItem = item;
                this.revokeForm = {
                    revokeReason: ''
                };
                this.isShowRevokeDialog = true;
            },
            revokeBeforePrintConfirm() {
                this.$refs.revokeForm.validate(isValid => {
                    if (isValid) {
                        this.$confirm('是否撤回该条申请吗？', '撤回', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            revokePrintSeniorApply({
                                id: this.revokeItem.id,
                                revokeReason: this.revokeForm.revokeReason,

                            })
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        this.$message.success('撤回成功');
                                        this.isShowRevokeDialog = false;
                                        this.findApplyListFunc();

                                    } else {
                                        this.$message.error(data.msg);
                                    }
                                })
                        });
                    }
                });

            },
            findApplyListFunc() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                 this.exportUrl = `${global.BasePath}structure/printSeniorApply/exportApplyList?token=${this.$store.getters.token}&kind=${ this.kind === 'file' ? 1 : 2}&searchTitle=${this.searchTitle}&startDate=${this.pagination.startDate}&endDate=${this.pagination.endDate}&status=${this.status}`;
                findApplyList({
                    kind: this.kind === 'file' ? 1 : 2,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    startDate: this.pagination.startDate,
                    endDate: this.pagination.endDate,
                    searchTitle: this.searchTitle,
                    status: this.status
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            deleteHandler(item) {
                this.$confirm('是否删除该条申请吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delPrintSeniorApply({
                        printIds: item.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('删除成功');
                                this.findApplyListFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            confirmHandler(item) {
                this.$confirm('是否确认该条申请吗？', '确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmPrintSeniorApply({
                        id: item.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('确认成功');
                                this.findApplyListFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            revokeHandler(item) {
                this.$confirm('是否撤回该条申请吗？', '撤回', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    revokePrintSeniorApply({
                        id: item.id,
                        revokeReason: ''
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('撤回成功');
                                this.findApplyListFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        padding: 12px;
    }

    .page-header {
        padding-bottom: 10px;
    }
    .red{
        color:red;
    }
</style>
