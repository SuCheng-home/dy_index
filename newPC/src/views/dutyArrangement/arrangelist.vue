<template>
    <div class="page">
        <div class="page-header">
             <el-button size="medium" @click.native="$router.back()">返回</el-button>
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="handleSizeChange()"></el-date-picker>
            <el-select v-model="query.stationId" style="width: 140px;" @change="handleSizeChange()" size="medium">
                <el-option label="全部岗位" :value="0"></el-option>
                <el-option :label="item.title" :value="item.id"  v-for="(item,index) in gangweiList" :key="index"></el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="arrangeadd(0)">新增</el-button>
            <import-file :config="importConf" @success="handleSizeChange"></import-file>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
            	<el-button size="medium" type="primary" @click="stationInitIdList()">批量删除</el-button>
            <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入老师姓名" v-model.trim="query.teacherUserName" @change="handleSizeChange">
            <el-button slot="append" icon="el-icon-search" @click="handleSizeChange"></el-button>    
            </el-input>    
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH"  @select="selectionChangeHandler"
                            @select-all="selectionChangeHandler">
                            <el-table-column type="selection" width="55" ></el-table-column>
                <el-table-column align="center" label="岗位名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stationTitle}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="值班日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.watchDate}}（{{scope.row.weekNamer}}）</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="值班教师" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.teacherUserNames}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="值班时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="课时计算" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.classHourCount-0}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" 
                               @click="arrangeadd(scope.row.id)">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="delWatchStationInit(scope.row.id)" class="buttontextred">删除
                    </el-button>
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
    </div>
</template>

<script>
    import moment from "moment";
    import {getSchoolTimeAllList} from "@/api/schedule";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import ImportFile from '@/components/ImportFile'
    import {getWatchGroupStationList,getWatchStationInitListPage,delWatchStationInit,stationInitIdList} from '@/api/dutyArrangement';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                total: null,
                query: {
                    startDate: "",
                    endDate: "",
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    stationId: 0,
                    groupId: this.$route.query.groupId,
                    teacherUserName:''
                },
                 importConf: {
                    btnName: '导入',
                    title: '值班人员导入',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/zhibantemplateone.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/watch/importWatchStationInit',
                    uploadArgs: {
                         groupId: this.$route.query.groupId,
                         watchType:2
                    },
                    errUrl: 'structure/watch/downloadStationInitResultXls',
                    lingjie:1,
                    name:'file'
                },
                exportUrl: '',
                isApproval: false,
                gangweiList:[],
                selected:[]
            }
        },
         components: {
          ImportFile
        },
        mixins: [baseMixin, mixin],
        created() {           
             getWatchGroupStationList(this.$route.query.groupId)
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                           this.gangweiList = data.data                           
                        }
                    })
            getSchoolTimeAllList().then(res => {
                let data = res.data.data;
                for (let item of data) {
                    if (item.isCurrent == 1) {
                        this.daterange = [item.startDate,item.endDate];
                        
                    }
                }
                this.getWatchStationInitListPage();
            }).catch(err => {
            });
        },
        methods: {
              selectionChangeHandler(selection) {
                this.selected = selection;
            },
             stationInitIdList() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要删除的值班安排');
                } else {
                    this.$confirm('删除值班安排无法恢复，确认要批量删除值班安排吗?', '批量删除值班安排', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        stationInitIdList(this.selected.map(item => item.id))
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('批量删除成功');
									this.selected=[];
                                     this.getWatchStationInitListPage();
                                }
                            })
                    });
                }
            },
              delWatchStationInit(id) {
                let _this = this;
                this.$confirm('确认删除值班安排？', '提示', {
                    type: 'error'
                }).then(() => {
                    delWatchStationInit(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getWatchStationInitListPage();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
             arrangeadd(id){
                    this.$router.push({
                                path: 'arrangeadd',
                                query:{
                                    groupId: this.$route.query.groupId,
                                    watchType: this.$route.query.watchType,
                                    id:id,
                                }
                            });
                },
            //切换条数
            handleSizeChange() {
                this.query.pageNo = 1;
                this.getWatchStationInitListPage();
            },
            //切换页数
            handleCurrentChange() {
                this.getWatchStationInitListPage();
            },
            getWatchStationInitListPage() {
                this.query.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.query.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/watch/exportStationInitXls?endDate=${this.query.endDate}&startDate=${this.query.startDate}&stationId=${this.query.stationId}&groupId=${this.query.groupId}&token=${this.$store.getters.token}`;
                getWatchStationInitListPage(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
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
</style>
