<template>
    <div class="supply_class_wrap">
        <div class="header">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="supplyDate" type="daterange" class="mywidthdaterange" :clearable="false" @change="getSubstituteClassStatisticsDataFunc"
                            range-separator="-" start-placeholder="开始日期" size="medium" end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" @click="printStatistics" size="medium">打印</el-button>
              <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                        <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
                    </a>
        </div>
        <div class="supply_class_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                      :height="nobottommaxH">
                <el-table-column prop="teacherName" label="姓名"></el-table-column>
                <el-table-column label="代班次数">
                    <template slot-scope="scope">
                        <span class="link" v-if="scope.row.dkTimes && scope.row.dkTimes != 0" @click="jumpToPage('supplyLessonDetailAccounting', {
                            teacherId: scope.row.teacherId,
                            startDate: supplyDate[0],
                            endDate: supplyDate[1],
                            isDB: 1
                        })">{{scope.row.dkTimes}}</span>
                        <span v-else>0</span>
                    </template>
                </el-table-column>
                <el-table-column label="代班明细">
                    <template slot-scope="scope">
                        {{scope.row.dkDetailStr || '--'}}
                    </template>
                </el-table-column>
                <el-table-column label="被代班次数">
                    <template slot-scope="scope">
                        <span class="link" v-if="scope.row.bkdTimes && scope.row.bkdTimes != 0" @click="jumpToPage('supplyLessonDetailAccounting', {
                            teacherId: scope.row.teacherId,
                            startDate: supplyDate[0],
                            endDate: supplyDate[1],
                            isDB: 0
                        })">{{scope.row.bkdTimes}}</span>
                        <span v-else>0</span>
                    </template>
                </el-table-column>
                <el-table-column label="被代班明细">
                    <template slot-scope="scope">
                        {{scope.row.bdkDetailStr || '--'}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="height: 0; overflow: hidden;">
            <table ref="print">
                <thead>
                <tr>
                    <th>姓名</th>
                    <th>代班次数</th>
                    <th>代班明细</th>
                    <th>被代班次数</th>
                    <th>被代班明细</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="index" v-for="(item, index) in dataList">
                    <td>{{item.teacherName}}</td>
                    <td>{{item.dkTimes}}</td>
                    <td>{{item.dkDetailStr || '--'}}</td>
                    <td>{{item.bkdTimes}}</td>
                    <td>{{item.bdkDetailStr || '--'}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getSubstituteClassStatisticsData} from '@/api/supplyLesson';
    import {getSchoolTimeAllList} from '@/api/system';

    export default {
        name: "supplyClassStatistics",
        data() {
            return {
                supplyDate: [],
                dataList: [],
                exportUrl: '',
            }
        },
        mixins: [mixins],
        created() {
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    for (let item of data.data) {
                    if (item.isCurrent == 1) {
                       
                        if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.supplyDate = [this.$moment(new Date()).format('YYYY-MM-DD')+"",item.startDate];
                            }else{
                              this.supplyDate = [item.startDate,this.$moment(new Date()).format('YYYY-MM-DD')+""];
                            }
                    }
                }
                 this.getSubstituteClassStatisticsDataFunc();                     
                })
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
            printStatistics() {
                this.$print(this.$refs.print);
            },
            getSubstituteClassStatisticsDataFunc() {
            this.exportUrl = global.BasePath + 'structure/supplyClass/exportDbBdbDetailDatas?startDate=' + this.supplyDate[0] + '&endDate=' + this.supplyDate[1] +'&token=' + this.$store.getters.token
                getSubstituteClassStatisticsData({
                    startDate: this.supplyDate[0],
                    endDate: this.supplyDate[1]
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
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
