<template>
    <div class="supply_class_wrap">
        <div class="header">
            <el-button @click="$router.back()" size="medium">返回</el-button>
        </div>
        <div class="supply_class_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                      :height="maxH">
                <el-table-column prop="supplyTeacherName" v-if="isDB" label="代班老师"></el-table-column>
                <el-table-column prop="adjustTeacherName" v-else label="被代班老师"></el-table-column>
                <el-table-column prop="adjustDate" label="日期">
                    <template slot-scope="scope">
                        {{weekfun(scope.row.adjustDate)}}
                        <span v-if="scope.row.substituteType == 2">
                             {{scope.row.startDayType == 2 ? '下午':'上午'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column  label="节次/天数">
                    <template slot-scope="scope">
                        {{scope.row.substituteType == 1 ? scope.row.adjustClassNoName : scope.row.substituteDayNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="adjustTeacherName" v-if="isDB" label="被代班老师">
                </el-table-column>
                <el-table-column prop="supplyTeacherName" v-else label="代班老师">
                </el-table-column>
                <el-table-column prop="adjustClassName" label="需代班级"></el-table-column>
                <el-table-column prop="reason" label="备注"></el-table-column>

            </el-table>
            <div class="pagination-container">
                <el-pagination
                    @size-change="getList" @current-change="getList"
                    :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                    :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>
            </div>

        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getTeacherDBList, getTeacherBDBList} from '@/api/supplyLesson';

    export default {
        name: "supplyClassStatistics",
        data() {
            return {
                startDate: this.$route.query.startDate,
                endDate: this.$route.query.endDate,
                teacherId: this.$route.query.teacherId,
                isDB: this.$route.query.isDB,

                dataList: []
            }
        },
        mixins: [mixins, baseMixin],
        created() {
            this.getList();
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
            getList() {
                new Promise(resolve => {
                    const args = {
                        endDate: this.endDate,
                        startDate: this.startDate,
                        teacherId: this.teacherId,
                        pageNo: this.pagination.pageNo,
                        pageSize: this.pagination.pageSize
                    };
                    if(this.isDB) {
                        getTeacherDBList(args)
                            .then(res => res.data)
                            .then(resolve)
                    } else {
                        getTeacherBDBList(args)
                            .then(res => res.data)
                            .then(resolve)
                    }
                })
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
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
    .pagination-container {
        margin-top: 10px;
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
