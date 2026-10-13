<template>
    <div id="deyuAccountingPersonalDetail">
        <div class="header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
        </div>
        <div class="schoolWrap scrollStyle">
            <el-table :data="dataList" border
        stripe :height="maxH">
                <el-table-column prop="createUserName" label="评价人" align="center" min-width="100"></el-table-column>
                <el-table-column label="评价时间" align="center" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.createTime | timeSuffixFilter}}
                    </template>
                </el-table-column>
                <el-table-column prop="behTypeName" label="评价项" align="center" min-width="100">
                     <template slot-scope="scope">
                        {{scope.row.behTypeName=="其它"?"其他":scope.row.behTypeName}}
                        <span v-if="scope.row.typeMark">
                            （{{scope.row.typeMark}}）
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="stepScore" label="得分" align="center" min-width="100"></el-table-column>
            </el-table>
            <el-pagination
                @size-change="getStuConductDetailListFunc" @current-change="getStuConductDetailListFunc"
                :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {
        getStuConductDetailList
    } from '@/api/deyu';

    export default {
        name: "deyuAccountingPersonalDetail",
        data() {
            return {
                dimensionId: this.$route.query.dimensionId,
                schoolTimeId: this.$route.query.schoolTimeId,
                studentId: this.$route.query.studentId,
                type: this.$route.query.type,
                dataList: []
            }
        },
        mixins: [mixins, BaseMixin],
        mounted() {
            this.getStuConductDetailListFunc();
        },
        methods: {
            getStuConductDetailListFunc() {
                getStuConductDetailList({
                    dimensionId: this.dimensionId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeId,
                    studentId: this.studentId,
                    type: this.type
                })
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #deyuAccountingPersonalDetail {
        padding:12px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .header {
        padding-bottom: 10px;
    }
</style>
