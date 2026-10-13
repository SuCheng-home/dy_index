<template>
    <div style="padding:10px">
        <div class="top">
            <el-select size="medium" class="filter-item" v-model="ListQuery.schoolTimeId" placeholder="请选择学期"
                       @change="changeschoolTimeId()">
                <el-option v-for="item in SchoolTimeAllList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="subject">
            <el-table stripe :data="dataList" border :height="nobottommaxH">
                <el-table-column label="工作计划标题">
                    <template slot-scope="scope">
                        <span class="link-type" @click="bigplandetails(scope.row.id)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工作计划时间范围">
                    <template slot-scope="scope">
                        <span>{{scope.row.startDate}}至{{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="发布人"></el-table-column>
                <el-table-column label="发布时间">
                    <template slot-scope="scope">

                        <span>{{scope.row.publishTime | formatDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布状态" width="100">
                    <template slot-scope="scope">

                        <el-tag  size="mini" v-if="scope.row.createUserName" type="success">已发布</el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>
<script>
    //窗口大小调整
    import mixin from '@/mixins/windowResize';
    import {
        getSchoolTimeAllList,
        findPublishedWorkPlanList
    } from "@/api/workPlan";

    export default {
        data() {
            return {
                ListQuery: {
                    schoolTimeId: ''
                },
                dataList: [],
                SchoolTimeAllList: []
            };
        },
        mixins: [mixin],
        filters: {
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            }
        },
        mounted() {
            getSchoolTimeAllList()
                .then(res => {
                    this.SchoolTimeAllList = res.data.data;
                    for (let item of this.SchoolTimeAllList) {
                        if (item.isCurrent == 1) {
                            this.ListQuery.schoolTimeId = item.id;
                            this.findWorkPlanLists();
                        }
                    }
                })
                .catch(err => {
                });
        },
        methods: {
            //切换学期
            changeschoolTimeId() {
                this.findWorkPlanLists();
            },
            //获取列表
            findWorkPlanLists() {
                findPublishedWorkPlanList(this.ListQuery.schoolTimeId)
                    .then(res => {
                        this.dataList = res.data.data.dataList;
                    })
                    .catch(err => {
                    });
            },
            //详情
            bigplandetails(id) {
                this.$router.push({
                    path: "bigplandetails",
                    query: {
                        id: id
                    }
                });
            },
        }
    };
</script>
<style scoped>
    .top {
        padding-bottom: 10px;
    }
</style>
