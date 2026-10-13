<template>
    <div class="homeschoolthroughapproveindex">
        <div class="top">
            <el-col :span="24">
                <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="medium"
                    @change="findGateInfoLists()"
                    :clearable="false" style="width:240px"
                >
                </el-date-picker>
                <el-select class="filter-item" v-model="query.classId" @change="findGateInfoLists()" size="medium" style="width:130px">
                    <el-option :label="item.name" :value="item.id" :key="index"
                               v-for="(item,index) in classlist"></el-option>
                </el-select>
                <el-select class="filter-item" v-model="query.applyType" @change="findGateInfoLists()" size="medium" style="width:130px">
                     <el-option label="全部类型" :value="0" ></el-option>
                     <el-option label="志愿服务" :value="1" ></el-option>
                     <el-option label="家长培训" :value="2" ></el-option>
                     <el-option label="社会实践" :value="3" ></el-option>
                </el-select>
                <el-select class="filter-item" v-model="query.status" @change="findGateInfoLists()" size="medium" style="width:130px">
                     <el-option label="全部状态" :value="0" ></el-option>
                     <el-option label="待审核" :value="2" ></el-option>
                     <el-option label="通过" :value="3" ></el-option>
                     <el-option label="不通过" :value="4" ></el-option>
                </el-select>
                 <el-button type="primary" @click="aKeyBys()"  size="medium" >一键通过</el-button>
                 <a :href="downLoadHref" target="_blank" v-if="dateList.length" download="examName"><el-button size="medium" type="primary" >导出</el-button></a>
                <el-input class="search-input search-input--right"
                          placeholder="姓名" icon="el-icon-search" size="medium" @change="findGateInfoLists"
                          v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search" size="medium" @click="findGateInfoLists"></el-button>
                </el-input>
            </el-col>

        </div>
        <div class="time-table">
            <el-table stripe :data="dateList" border fit highlight-current-row   style="width: 100%" :height="maxH">
                <el-table-column align="center" label="学生" >
                    <template slot-scope="scope">
                        <span class="link" @click="homeschoolthroughapprovedetails(scope.row.id)">{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家长" >
                    <template slot-scope="scope">
                        <span>{{scope.row.createName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="活动类型" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==1">志愿服务</span>
                        <span v-if="scope.row.type==2">家长培训</span>
                        <span v-if="scope.row.type==3">社会实践</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级" >
                    <template slot-scope="scope">
                        <span>{{scope.row.className	}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="日期" >
                    <template slot-scope="scope">
                        <span>{{scope.row.applyDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时长（小时）" >
                    <template slot-scope="scope">
                        <span>{{scope.row.duration!=0?scope.row.duration:"----"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template slot-scope="scope">
                         <!-- <el-tag  size="mini" type="gray" v-if="scope.row.status==1">草稿</el-tag> -->
                        <el-tag  size="mini" type="warning"  v-if="scope.row.status==2">待审核</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.status==4">不通过</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.status==3">通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                   <template slot-scope="scope">
                         <el-button v-if="scope.row.status==2" @click.native.prevent="auditContentones(scope.row.id)"  type="text" size="small">通过</el-button>                         
                         <el-button v-if="scope.row.status==2" @click.native.prevent="auditContenttwos(scope.row.id)"  type="text" size="small">不通过</el-button>
                         <el-button  @click.native.prevent="deleteApplyByIds(scope.row.id)"  type="text" size="small" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination  @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import { querySchoolClass,queryApply,deleteApplyById,auditContentone,auditContenttwo,aKeyBy} from '@/api/homeschoolthrough';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "homeschoolthroughstatistics",
        data: function () {
            return {
                daterange: [new Date(), new Date()],
                dateList: [],//表格主题数据
                total: null,
                query: {
                    startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                    endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                    pageNo: 1, //页数
                    pageSize: 20,//条数
                    searchName: '',
                    classId: 0,
                    applyType:0,
                    status:0
                },
                downLoadHref:'',
                classlist: [{name: '全部班级', id: 0}]
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
           this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
           querySchoolClass().then(res => res.data)
                        .then(data => {
                            for (let i = 0; i < data.data.length; i++) {
                                this.classlist.push(data.data[i])
                            }
                        });
            this.findGateInfoLists()
        },
        methods: {  
            //跳转详情
            homeschoolthroughapprovedetails(id) {
                this.$router.push({
                    path: "homeschoolthroughapprovedetails",
                    query: {id: id}
                });
            },
              auditContentones(id){
         this.$confirm('是否通过?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    auditContentone(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '审批成功!'
                        });
                        this.findGateInfoLists();
                    }).catch();

                }).catch(() => {
                });
    },
      auditContenttwos(id){
         this.$confirm('是否不通过?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    auditContenttwo(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '审批成功!'
                        });
                        this.findGateInfoLists();
                    }).catch();

                }).catch(() => {
                });
    },
             //删除
    deleteApplyByIds(id){
         this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteApplyById(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.findGateInfoLists();
                    }).catch();

                }).catch(() => {
                });
    },
    
    aKeyBys(){
         this.$confirm('此操作将通过所有未审批的活动, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    aKeyBy().then(res => {
                        this.$message({
                            type: 'success',
                            message: '一键通过成功!'
                        });
                        this.findGateInfoLists();
                    }).catch();

                }).catch(() => {
                });
    },
            //切换页码
                sizeChangeHandler(pageSize) {
                this.query.pageNo = 1;
                this.query.pageSize = pageSize;
                this.findGateInfoLists();
                },
                //切换页数
                currentChangeHandler(pageNo) {
                this.query.pageNo = pageNo;
                this.findGateInfoLists();
                },         
            findGateInfoLists() {
                this.dateList = [];
                this.total = null;
                this.query.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.downLoadHref =
                                global.BasePath +
                                "structure/activitiesApply/downApply?endDate=" +
                                this.query.endDate +
                                "&startDate=" +
                                this.query.startDate+
                                "&classId=" +
                                this.query.classId+
                                "&searchName=" +
                                this.query.searchName+
                                "&applyType=" +
                                this.query.applyType+
                                "&status=" +
                                this.query.status+
                                "&token=" +
                                this.$store.getters.token;
                queryApply(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
.homeschoolthroughapproveindex {
   padding:12px;
  .top {
    padding-bottom: 10px;
    overflow:auto;
  }
    .link {
            color: #409eff;
            cursor: pointer;
        }
}
</style>
