<template>
    <div class="page">
        <div class="page-header">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="handleSizeChange()"></el-date-picker>
            <el-button type="primary" @click="dialogFormVisible=true" size="medium">添加开放日</el-button>
          <a :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                 <el-table-column align="center" label="开放日" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link" @click="admissionReservationlistinfo(scope.row.watchDate)">{{scope.row.watchDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上午名额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.morningCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上午已预约" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.morningUserCount}}</span>
                    </template>
                </el-table-column>  
                  <el-table-column align="center" label="下午名额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.afternoonCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下午已预约" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.afternoonUserCount}}</span>
                    </template>
                </el-table-column>    
                <el-table-column align="center"  label="签到状态" width="100">
                <template slot-scope="scope">                    
                    <el-tag  size="mini"  type="success" v-if="scope.row.state==2&&scope.row.watchDate>=mydate">已开启</el-tag>
                    <el-tag  size="mini"  v-if="scope.row.state==2&&scope.row.watchDate<mydate">已结束</el-tag>
                    <el-tag  size="mini"  type="info" v-if="scope.row.state==1">未开启</el-tag>                    
                </template>
            </el-table-column>
             <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" v-if="scope.row.state==1&&scope.row.watchDate>=mydate" @click="updateSocialReserDate(scope.row.watchDate)">
                                开启预约
                            </el-button>
                            <el-button size="small" v-if="scope.row.state==1" type="text" @click="delSocialReserDate(scope.row.watchDate)" class="buttontextred">
                                删除
                            </el-button>
                            <el-button size="small" v-if="scope.row.state==2" type="text" @click="admissionReservationlistinfo(scope.row.watchDate)">
                                查看详情
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="query.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加开放日" :visible.sync="dialogFormVisible">
			<el-form :model="formData" label-width="140px">
				<el-form-item label="开放日"  :required="true">
					<el-date-picker
                        size="medium"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="formData.watchDate"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
				</el-form-item>
				<el-form-item label="开放时段" :required="true">
					 <el-checkbox v-model="formData.checked1">上午开放</el-checkbox>
                     <el-checkbox v-model="formData.checked2">下午开放</el-checkbox>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSocialReserDate()">确 定</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
    import moment from "moment";
    import {getSchoolTimeAllList} from "@/api/schedule";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {getSocialReserDateListPage,addSocialReserDate,delSocialReserDate,updateSocialReserDate} from '@/api/admissionReservation';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                total: null,
                dialogFormVisible: false,
                formData: {
                    watchDate: '',
                    checked1: '',
                    checked2: '',
			    },
                query: {
                    startDate: "",
                    endDate: "",
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                },
                gangweiList:[],
                mydate:moment().format('YYYY-MM-DD'),
                exportUrl: ''
            }
        },
        mixins: [baseMixin, mixin],
        created() {
                               getSchoolTimeAllList().then(res => {
                                let data = res.data.data;
                                for (let item of data) {
                                    if (item.isCurrent == 1) {
                                        this.daterange = [item.startDate,item.endDate];
                                        
                                    }
                                }
                                this.getSocialReserDateListPage();
                            }).catch(err => {
                            });
            
        },
        methods: {
            admissionReservationlistinfo(watchDate){
               this.$router.push({
                    path: 'admissionReservationlistinfo',
                    query:{watchDate:watchDate}
                })
            },
            updateSocialReserDate(watchDate) {
                this.$confirm('是否开启', '开启', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateSocialReserDate({
                        watchDate:watchDate,
                        state:2,
                        schoolId:this.$store.getters.schoolInfo.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '开启成功!'
                                });
                                this.getSocialReserDateListPage();
                            }
                        })
                });

            },
             delSocialReserDate(watchDate) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delSocialReserDate(watchDate)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getSocialReserDateListPage();
                            }
                        })
                });

            },
            handleSizeChange() {
                this.query.pageNo = 1;
                this.getSocialReserDateListPage();
            },
            //切换页数
            handleCurrentChange() {
                this.getSocialReserDateListPage();
            },
            getSocialReserDateListPage() {
                this.query.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.query.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                 this.exportUrl = `${global.BasePath}structure/socialReser/exportSocialReserDateList?token=${this.$store.getters.token}&startDate=${this.query.startDate}&endDate=${this.query.endDate}`;
                getSocialReserDateListPage(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            addSocialReserDate(){
                if (this.formData.watchDate == '') {
                    this.$message({
                        type: "error",
                        message: "请选择开放日！"
                    });
                    return false;
                }
                if (!this.formData.checked1&&!this.formData.checked2) {
                    this.$message({
                        type: "error",
                        message: "请选择开放时段！"
                    });
                    return false;
                }
                let isMorning=1
                if(this.formData.checked1){
                    isMorning=1
                }
                if(this.formData.checked2){
                    isMorning=2
                }
                if(this.formData.checked1&&this.formData.checked2){
                    isMorning=3
                }
                
             addSocialReserDate({
                 isMorning:isMorning,
                 state:1,
                 watchDate:moment(this.formData.watchDate).format('YYYY-MM-DD')
             }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('新增成功');
                        this.dialogFormVisible=false
                        this.getSocialReserDateListPage();
                         this.formData= {
                            watchDate: '',
                            checked1: '',
                            checked2: '',
                        }
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }
    .page-header {
        padding-bottom: 10px;
    }
    .link {
            color: #409eff;
            cursor: pointer;
        }
</style>
