<template>
    <div  style="    padding: 12px;">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-date-picker
                      size="medium"
                      @change="SearchList"
                      :clearable='false'
                      v-model="searchTime"
                      type="daterange" class="mywidthdaterange"
                      value-format="yyyy-MM-dd"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                    <el-select v-model="searchSure" placeholder="请选择" size="medium" @change="SearchList">
                        <el-option
                          v-for="item in searchSureList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                    <a :href="exportTableUrl" download="导出" target="_blank" v-if="tableData.length">
                        <el-button type="primary" size="medium">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" v-model.trim="searchName" placeholder="请输入学生/老师姓名" class="search-input" @keyup.enter.native="SearchList">
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="SearchList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table
            :data="tableData"
            border
            :stripe='true'
            :height="`${boxH - 220}px`"
            class="orderListTable">
            <el-table-column
              prop="meetTeacherName"
              label="面询老师"
              align="center">
            </el-table-column>
            <el-table-column
              prop="stuName"
              label="学生姓名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="className"
              label="班级"
              align="center">
            </el-table-column>
            <el-table-column
              prop="stuSex"
              label="性别"
              align="center">
            </el-table-column>
            <el-table-column
              prop="stuAge"
              label="年龄"
              align="center">
            </el-table-column>
            <el-table-column
              prop="renderMeetTime"
              label="面询时间"
              width="240"
              align="center">
            </el-table-column>
            <el-table-column
              prop="renderState"
              label="是否面询"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="LinkToDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30,50]"
                         :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="total" class="list-pagination">
          </el-pagination>
    </div>
</template>

<script>
    import { querySchedule } from '@/api/psychological';
    import baseMixin from '@/mixins/baseMixin';
    import windowResizeMixin from '@/mixins/windowResize';
    const _ = require('lodash');
    export default {
        mixins: [windowResizeMixin, baseMixin],
        data() {
            return {
                searchTime: [],//搜索条件-时间
                searchSure:0,//搜索条件-是否面询
                searchSureList:[{
                      value: 0,
                      label: '全部面询状态'
                    }, {
                      value: 1,
                      label: '已面询'
                    }, {
                      value: 2,
                      label: '未面询'
                    }],//搜索条件-是否面询数据源
                searchName:'',//搜索条件-学生姓名
                tableData: [],//表格数据源
                listQuery: {
                    pageNo: 1,//当前页数
                    pageSize: 20//每页条数
                },//分页相关
                total:null,//数据总条数
                exportTableUrl:''//导出地址
            };
        },
        created(){
            this.SetDate()
        },
        methods: {
            //设置默认日期
            SetDate(){
                let nowDate = new Date();
                let firstDay = new Date(nowDate.getFullYear(), nowDate.getMonth(),1);
                let tempFirstDayDay=firstDay.getDate()<10?'0'+firstDay.getDate():firstDay.getDate();
                let tempLastDayDay=nowDate.getDate()<10?'0'+nowDate.getDate():nowDate.getDate();
                this.searchTime[0]=nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+tempFirstDayDay;
                this.searchTime[1]=nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+tempLastDayDay;
                this.GetPlanList();
            },
            //获取列表
            GetPlanList(){
                let startDate=this.searchTime&&this.searchTime.length>0?this.searchTime[0]:'2000-01-01';
                let endDate=this.searchTime&&this.searchTime.length>0?this.searchTime[1]:'2050-01-01';
                this.exportTableUrl = `${global.BasePath}structure/psychological/downSchedule?startDate=${startDate}&endDate=${endDate}&searchName=${this.searchName}&state=${this.searchSure}&token=${this.$store.getters.token}`;
                querySchedule(this.listQuery.pageNo,this.listQuery.pageSize,this.searchTime,this.searchSure,this.searchName)
                    .then(res => res.data)
                    .then(data => {
                        this.tableData=data.data.dataList.map(v=>
                            Object.assign({},v,{
                                renderOrderTime:this.SetRenderOrderTime(v.saturdayOrder,v.sundayOrder),
                                renderState:v.state==1?'已面询':'未面询',
                                renderMeetTime:v.meetDate+' '+v.meetDateRange
                            }));
                        this.total=data.data.pagination.total;
                    });
            },
            //跳转详情
            LinkToDetail(e){
                this.$router.push({
                    path: 'orderDetail',
                    query: {id:e.subscribeId}
                });
            },
            //搜索
            SearchList(){
              this.listQuery.pageNo=1;
              this.GetPlanList()
            },
            //匹配预约时间渲染
            SetRenderOrderTime(e,v){
                let tempOrderArr=[];
                switch (e) {
                    case 1 :
                        tempOrderArr.push('周六-上午');
                        break;
                    case 2 :
                        tempOrderArr.push('周六-下午');
                        break;
                    case 3 :
                        tempOrderArr.push('周六-上午 周六-下午');
                        break;
                }
                switch (v) {
                    case 1 :
                        tempOrderArr.push('周日-上午');
                        break;
                    case 2 :
                        tempOrderArr.push('周日-下午');
                        break;
                    case 3 :
                        tempOrderArr.push('周日-上午 周日-下午');
                        break;
                }
                return tempOrderArr.join(' ')
            },
            //每页条数更改
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.GetPlanList();
            },
            //当前页码更改
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.GetPlanList();
            },
        }
    };
</script>

<style scoped>
    .header{
       padding-bottom: 10px;
    }
    .list-pagination{
        margin-top: 10px;
    }
</style>
