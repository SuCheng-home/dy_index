<template>
    <div class="feedBackStatic">
        <back-tool>
           
            <!---->
            <template>
                <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    size="medium"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                    @change="findDate()"
                >
                </el-date-picker>
            </template>
             <a :href="exportURL" download="导出结果" target="_blank" v-if="tableData&&tableData.length!==0"
                >
                <el-button size="medium" class="filter-item" type="primary">导出</el-button>
            </a>
            <template>
                <el-input class="search-input" style="width:20%"
                          placeholder="姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                          v-model.trim="listQuery.teacherName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </template>
        </back-tool>
        <el-table
            :data="tableData"
            class="tableStatic"
            stripe
            border
            style="width: 100%"
            :height="nobottommaxH">
            <el-table-column
                prop="date"
                label="姓名"
                align="center"
                width="150">
                <template slot-scope="scope">
                    <span class="link-type"
                          @click="jumpTo('feedBackOneList',{teacherId:scope.row.teacherId,startDate:listQuery.startDate,endDate:listQuery.endDate})">{{scope.row.teacherName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                :label="columnItem.title"
                v-for="(columnItem,columnIndex) in colunms" :key="columnIndex" v-if="columnItem.title!=='姓名'">
                <el-table-column
                    :label="childItem.title"
                    align="center" v-for="(childItem,childIndex) in columnItem.children" :key="childIndex">
                    <template slot-scope="scope">
                        {{scope.row[childItem.prop]}}
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import BackTool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import _ from 'lodash';
    import {statisticEveryTeacherList} from '@/api/checkFeedBack';

    export default {
        components: {
            BackTool
        },
        data() {
            return {
                daterange: [new Date(), new Date()],
                listQuery: {
                    startDate: '',
                    endDate: '',
                    teacherName: ''
                },
                colunms: [],
                tableData: [],
                exportURL: ''
            }
        },
        created() {
            this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
            this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
            this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
        },
        mounted() {
            this.statisticEveryTeacherListFunc();
        },
        mixins: [mixin],
        methods: {
            handleInputChange: _.debounce(
                function () {
                    this.statisticEveryTeacherListFunc();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            statisticEveryTeacherListFunc() {
                statisticEveryTeacherList({
                    startDate: this.listQuery.startDate,
                    endDate: this.listQuery.endDate,
                    teacherName: this.listQuery.teacherName
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let feedBackData = data.data;
                            this.tableData = feedBackData.data;
                            this.colunms = feedBackData.colunms;
                            /*导出*/
                            this.exportURL = global.BasePath + 'structure/checkFeedback/exportStatisticEveryTeacherList?startDate=' + this.listQuery.startDate + '&fileName=' + '老师检查反馈统计' + '&endDate=' + this.listQuery.endDate + '&token=' + this.$store.getters.token;
                        }
                    })
            },
            findDate() {
                this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                this.statisticEveryTeacherListFunc();
            },
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .feedBackStatic {
        padding:12px;
        box-sizing: border-box;

        .el-input {
            width: auto;
            float: right;
        }
    }
</style>

