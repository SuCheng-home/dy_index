<template>
    <div class="compositeExamTwoIndex">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                        @change="getComplexCheckStatisticsByDutyUser()"></el-date-picker>
                </el-col>
                <el-col :span="5">
                    <el-input class="search-input" icon="el-icon-search" size="medium" placeholder="请输入责任人姓名" clearable
                        v-model.trim="query.userName" @change="getComplexCheckStatisticsByDutyUser()">
                        <el-button slot="append" icon="el-icon-search"
                            @click="getComplexCheckStatisticsByDutyUser()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="page-main">
            <el-table stripe :data="listUser" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="责任人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="compositeExamTwoInfo(scope.row)">{{ scope.row.dutyUserName
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" show-overflow-tooltip v-for="(item, index) in itemList"
                    :key="item.dutyId" :label="item.checkItemName">
                    <template slot-scope="scope">
                        <span>{{ scope.row.checkCountList[index] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总计" show-overflow-tooltip prop="checkCount">
                </el-table-column>
            </el-table>
            <!-- <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="query.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div> -->
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { getSchoolTimeAllList } from "@/api/schedule";
import { getComplexCheckStatisticsByDutyUser } from '@/api/compositeExamSetTwo';
import baseMixin from '@/mixins/baseMixin';
import mixin from '@/mixins/windowResize';

export default {
    name: "statisticsIndex",
    data() {
        return {
            daterange: [new Date(), new Date()],
            listUser: [],
            itemList: [],
            query: {
                startDate: "",
                endDate: "",
                userName: '',
                // pageNo: 1, //页数
                // pageSize: 20, //条数
            },
        }
    },
    mixins: [baseMixin, mixin],
    created() {
        getSchoolTimeAllList().then(res => {
            let data = res.data.data;
            for (let item of data) {
                if (item.isCurrent == 1) {
                    if (item.startDate > (this.$moment(new Date()).format('YYYY-MM-DD') + "")) {
                        this.daterange = [new Date(), item.startDate];
                    } else {
                        this.daterange = [item.startDate, new Date()];
                    }
                }
            }
            this.getComplexCheckStatisticsByDutyUser();
        }).catch(err => {
        });
    },
    methods: {
        compositeExamTwoInfo(obj) {
            console.log(89, obj);
            this.$router.push({
                path: "personInChargeInfo",
                query: {
                    endDate:this.query.endDate,
                    startDate:this.query.startDate ,
                    userId: obj.dutyUserId,
                    dutyName: obj.dutyUserName+'的巡查报告'
                }
            });
        },
        // //切换条数
        // handleSizeChange() {
        //     this.query.pageNo = 1;
        //     this.getComplexCheckStatisticsByDutyUser();
        // },
        // //切换页数
        // handleCurrentChange() {
        //     this.getComplexCheckStatisticsByDutyUser();
        // },
        getComplexCheckStatisticsByDutyUser() {
            this.query.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
            this.query.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
            getComplexCheckStatisticsByDutyUser(this.query)
                .then(res => res.data)
                .then(data => {
                    console.log(123, data);
                    this.listUser = data.data.listUser;
                    this.itemList = data.data.itemList;
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.compositeExamTwoIndex {
    padding: 12px;

    .header {
        padding-bottom: 10px;
    }
}
</style>
