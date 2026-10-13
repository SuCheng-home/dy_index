<template>
    <div class="supply_class_wrap">
        <div class="header">
            <!-- <el-button @click="goBack" size="medium">返回</el-button> -->
            <el-date-picker v-model="supplyDate" type="daterange" class="mywidthdaterange" :clearable="false" @change="getStatistics"
                            range-separator="-" start-placeholder="开始日期" size="medium" end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" @click="printStatistics" size="medium">打印</el-button>
             <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `代课调课统计.xlsx`)"   v-if="dataList.length>0">导出</el-button>
        </div>
        <div class="supply_class_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="nobottommaxH">
                <el-table-column prop="teacherName" label="姓名"></el-table-column>
                <el-table-column prop="dkTimes" label="代课次数"></el-table-column>
                <el-table-column prop="dkDetailStr" label="代课明细"></el-table-column>
                <el-table-column prop="bkdTimes" label="被代课次数"></el-table-column>
                <el-table-column prop="bdkDetailStr" label="被代课明细"></el-table-column>
                <el-table-column prop="tkTimes" label="调课次数"></el-table-column>
                <el-table-column  label="其他">
                    <template slot-scope="scope">
                        <span class="link" v-if="scope.row.otherDkTimes" @click="otherlist(scope.row.teacherId)">{{scope.row.otherDkTimes}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="height: 0; overflow: hidden;" id="outTable" >
            <table ref="print">
                <thead>
                <tr>
                    <th>姓名</th>
                    <th>代课次数</th>
                    <th>代课明细</th>
                    <th>被代课次数</th>
                    <th>被代课明细</th>
                    <th>调课次数</th>
                    <th>其他</th>
                </tr>
                </thead>
                <tbody>
                <tr :key="index" v-for="(item, index) in dataList">
                    <td>{{item.teacherName}}</td>
                    <td>{{item.dkTimes}}</td>
                    <td>{{item.dkDetailStr || '--'}}</td>
                    <td>{{item.bkdTimes}}</td>
                    <td>{{item.bdkDetailStr || '--'}}</td>
                    <td>{{item.tkTimes}}</td>
                    <td>{{item.otherDkTimes||'--'}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
     import baseMixin from '@/mixins/baseMixin';
    import {getSupplyClassStatisticsData} from '@/api/supplyClass';

    export default {
        name: "supplyClassStatistics",
        data() {
            return {
                supplyDate: ['',''],
                dataList: []
            }
        },
        mixins: [mixins,baseMixin],
        created() {
            this.supplyDate = [this.getCurrentMonthDay(this.getDate(0)), this.getDate(0)]; // 列表日期
            this.getStatistics();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            otherlist(teacherId){
                this.$router.push({path: 'otherlist', query: {teacherId: teacherId,startDate:this.$moment(this.supplyDate[0]).format("YYYY-MM-DD"),endDate:this.$moment(this.supplyDate[1]).format("YYYY-MM-DD")}});
            },
            printStatistics() {
                this.$print(this.$refs.print);
            },
            getCurrentMonthDay(date) {
                if (date) {
                    return date.substring(0, 8) + '01';
                }
                return ''
            },
            getStatistics() {
                let start = '';
                let end = '';
                if (this.supplyDate && this.supplyDate.length && this.supplyDate[0]) {
                    if (this.supplyDate[0] && this.supplyDate[0].length) {
                        start = this.supplyDate[0];
                        end = this.supplyDate[1];
                    } else {
                        start = this.getStrDate(this.supplyDate[0]);
                        end = this.getStrDate(this.supplyDate[1]);
                    }
                } else {
                    this.$message({
                        message: '请选择日期范围！',
                        type: 'warning'
                    });
                    return;
                }

                let query = {
                    endDate: end,
                    startDate: start
                };
                this.getSupplyClassStatisticsData(query);
            },
            getSupplyClassStatisticsData(query) {
                getSupplyClassStatisticsData(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.dataList = data.data;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            getDate(n) {
                const data = new Date();
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
                let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return localDateStr;
            },
            getStrDate(data) {
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supply_class_wrap{
        padding:12px;
        .header{
            padding-bottom: 10px;
        }
        .link{
            color: #1989fa;
            cursor:pointer
        }
    }
</style>
<style scoped>
    table{
        width: 100%;
        box-sizing: border-box;
        border-collapse:collapse;
    }
    table th, table td{
        width: 14.2%;
        height: 40px;
        text-align: center;
        border: 1px solid #ddd;
    }
</style>
