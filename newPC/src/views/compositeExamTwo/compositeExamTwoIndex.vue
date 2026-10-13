<template>
    <div class="compositeExamTwoIndex">
        <div class="header">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="handleSizeChange()"></el-date-picker>
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="compositeExamTwoInfo(scope.row)">{{scope.row.checkDateStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="检查组" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.dutyName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="值班人员" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
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
    import {getComplexCheckBaseListByDateScope} from '@/api/compositeExamSetTwo';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';

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
                },
            }
        },
        mixins: [baseMixin, mixin],
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
                    }
                }
                 this.getComplexCheckBaseListByDateScope();
            }).catch(err => {
            });
        },
        methods: {
            compositeExamTwoInfo(obj){
                this.$router.push({
                    path: "compositeExamTwoInfo",
                    query:{checkDate:obj.checkDateStr,userId:0,baseId:obj.baseId,createUserName:obj.createUserName,dutyName:obj.dutyName}
                    });
            },
            //切换条数
            handleSizeChange() {
                this.query.pageNo = 1;
                this.getComplexCheckBaseListByDateScope();
            },
            //切换页数
            handleCurrentChange() {
                this.getComplexCheckBaseListByDateScope();
            },
            getComplexCheckBaseListByDateScope() {
                this.query.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.query.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                 getComplexCheckBaseListByDateScope(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .compositeExamTwoIndex {
        padding:12px;
         .header {
        padding-bottom: 10px;
    }
    }
   
</style>
