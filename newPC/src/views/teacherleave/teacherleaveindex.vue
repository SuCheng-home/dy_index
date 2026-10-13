<template>
    <div class="leaveContent">
        <div class="header">
            <el-row>
                <el-col :span="24">
                    <el-date-picker v-model="daterange" type="daterange" class="mywidthdaterange right-line" size="medium" 
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                                    :clearable="false" @change="findDate()"></el-date-picker>
                     <el-select v-model="listQuery.departId" placeholder="请选择部门" size="medium"   @change="getTeacherAskleaveStatisticalLists()">
                        <el-option label="全部部门" :value="0"></el-option>
                        <el-option v-for="item in departList" :key="item.departId" :label="item.departName"
                                   :value="item.departId"></el-option>
                    </el-select>
                    <a class="export-btn" :href="exportUrl" download="导出结果" target="_blank" v-if="dataList.length">
                        <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
                    </a>
                   
                </el-col>
            </el-row>
        </div>
        <div class="leaveList">
            <el-table stripe :data="dataList" ref="table" border fit highlight-current-row style="width: 100%"
                      :height="maxH">
                <el-table-column align="center" fixed label="姓名" width="100" :key="Math.random()" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="handleCheckDetail(scope)">{{scope.row.teacherName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed label="部门" width="100" :key="Math.random()" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.departName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed label="请假总时长" width="150" :key="Math.random()"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.leaveTotalDate}}天
                        {{scope.row.leaveTotalClassHourCount}}节
                        {{(scope.row.leaveTotalTimeLenth / 60).toFixed(2)-0}}小时
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed label="请假次数" width="100" :key="Math.random()"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.leaveTotalCount}}
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="item.leaveTypeName" min-width="150"
                                 v-for="(item,index) in askleaveTypeList" :key="index" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.typeTimeLengList[index]">----</span>
                        {{scope.row.typeTimeLengList[index]}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import moment from "moment";
    import {mapGetters} from 'vuex';
    import {getTeacherAskleaveStatisticalList,getDepartList} from '@/api/teacherleave';

    export default {
        data() {
            return {
                daterange: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                exportUrl: '',
                dataList: [],
                askleaveTypeList: [],
                departList:[],
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    startDate: '',
                    endDate: '',
                    departId:0
                },
                total: 0,
                timer: null
            }
        },
        mixins: [baseMixin, mixin],
        name: 'teacherleaveindex',
        created() {
            this.daterange[0] = moment().set('date', 1).format('YYYY-MM-DD');
            this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
            this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
            this.getDepartList()
            this.getTeacherAskleaveStatisticalLists();
        },
        activated() {
            this.daterange[0] = moment().set('date', 1).format('YYYY-MM-DD');
            this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
            this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
            this.getDepartList()
            this.getTeacherAskleaveStatisticalLists();
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
        },
        mounted() {
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        },
        filters: {
            trimTime(dateTime) {
                let dateTimeData = "";
                let h = Math.floor(dateTime / 60);
                dateTime -= h * 60;
                if (dateTime == 0) {
                    dateTimeData = h ? h + "小时" : "";
                } else {
                    if (dateTime < 10) {
                        dateTime = "0" + dateTime;
                    }
                    dateTimeData = (h ? h + "小时" : "") + (dateTime ? dateTime + "分" : "");
                }
                return dateTimeData;
            },
        },
        methods: {           
            handleCheckDetail(scope) {
                sessionStorage.setItem('refresh-leave-list', 1)
                this.jumpToPage('teacherleavelist', {
                    startDate: this.daterange[0],
                    endDate: this.daterange[1],
                    userName: scope.row.teacherName
                })
            },
            findDate() {
                this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                this.listQuery.departId=0;
                this.getDepartList()
                this.getTeacherAskleaveStatisticalLists();
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.getTeacherAskleaveStatisticalLists();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getTeacherAskleaveStatisticalLists();
            },
            getDepartList(){
                this.departList=[]
              getDepartList(this.listQuery)
				.then(res => res.data)
				.then(data => {
					if (data.code === 200) {
						this.departList = data.data
					} else {
						this.$message({
							type: 'error',
							message: data.msg
						})
					}
				})
				.catch(() => {})
		},
            // 获取数据列表
            getTeacherAskleaveStatisticalLists() {
                getTeacherAskleaveStatisticalList(this.listQuery).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let tableData = data.data;
                            this.dataList = tableData.askleaveList;
                            this.total = tableData.pagination.total;
                            this.askleaveTypeList = tableData.askleaveTypeList;
                            this.exportUrl = global.BasePath + 'structure/teacherAskleave/exportTeacherAskleaveStatisticalList?startDate=' + this.listQuery.startDate + '&departId=' + this.listQuery.departId +'&endDate=' + this.listQuery.endDate + '&token=' + this.$store.getters.token;
                            this.$nextTick(() => {
                                this.timer = setTimeout(() => {
                                    this.$refs.table.doLayout()
                                }, 300)
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.msg
                            });
                        }
                    }).catch(() => {
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .leaveContent {
        padding: 12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
            font-size: 14px;

            .el-input {
                width: auto;
            }

        }

    }

</style>
