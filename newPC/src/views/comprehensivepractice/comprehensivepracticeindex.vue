<template>
    <div  class="app-container calendar-list-container comprehensivepracticeindex">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-select size="medium" v-model="pagination.schoolTimeId" @change="getPracticeActivityPageLists()" placeholder="请选择学期">
                        <el-option  label="全部学期"   :value="0"></el-option>
                        <el-option   v-for="item in termList"  :key="item.id"  :label="item.schoolTimeName"   :value="item.id"></el-option>
                    </el-select>
                     <el-select size="medium" v-model="pagination.typeCode" @change="getPracticeActivityPageLists()" placeholder="请选择类型">
                        <el-option  label="全部类型"   :value="0"></el-option>
                        <el-option   v-for="item in typelist"  :key="item.code" :label="item.value" :value="item.code"></el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="comprehensivepracticeadd()" >新建主题活动</el-button>
                    <el-button type="primary" size="medium" @click="starExchangeSet()" >星值兑换设置</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="名称" icon="el-icon-search" @keyup.enter.native="getPracticeActivityPageLists()"
                              v-model="pagination.activityName">
                        <el-button slot="append" icon="el-icon-search" @click="getPracticeActivityPageLists()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="主题活动名称" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span class="link" @click="comprehensivepracticedetails(scope.row.id,scope.row.state)">
                        {{scope.row.activityName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="实践类型">
                <template slot-scope="scope">
                    <span>{{scope.row.typeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学期" >
                <template slot-scope="scope">
                    <span>{{scope.row.schoolTimeName}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="创建人" >
                <template slot-scope="scope">
                    <span>{{scope.row.createUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" >
                <template slot-scope="scope">
                    <el-tag  size="mini" type="info"  v-if="scope.row.state == 1">草稿</el-tag>
                    <el-tag  size="mini"  v-else-if="scope.row.state == 2">已发布</el-tag>
                    <el-tag  size="mini" type="info"  v-else-if="scope.row.state == -1">待审核</el-tag>
                    <el-tag  size="mini" type="danger"  v-else-if="scope.row.state == 3" :title="scope.row.approveOption">驳回</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button  type="text" @click="comprehensivepracticedetails(scope.row.id, scope.row.state)" v-if="scope.row.state == -1">审核</el-button>
                    <el-button  type="text" @click="comprehensivepracticeeidt(scope.row.id, scope.row.state)" v-if="scope.row.state == 1 || scope.row.state == 2">编辑</el-button>
                    <el-button  type="text" @click="deletePracticeActivityById(scope.row.id)"  class="buttontextred">删除</el-button>
                    <el-button  type="text" @click="comprehensivepracticeStatistics(scope.row.id)" v-if="scope.row.state == 2">统计</el-button>
                    <el-button  type="text" @click="publishPracticeActivityById(scope.row.id)" v-if="scope.row.state == 1">发布</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import { getSchoolTimeAllList,getPracticeActivityPageList,findSchoolDicsByCode,publishPracticeActivityById,deletePracticeActivityById} from '@/api/comprehensivepractice';
    export default {
        name: 'comprehensivepracticeindex',
        data() {
            return {
                dataList: [],
                pagination:{
                    pageSize:20,
                    pageNo:1,
                    typeCode:0,
                    activityName:"",
                    schoolTimeId:0,
                    total:null
                },
                termList:[],
                typelist:[]
            }
        },
        mixins: [baseMixin, mixin],
        computed: {
            ...mapGetters([ 'userInfo'])
        },
        created() {
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    this.termList = data.data;
            });
           findSchoolDicsByCode("practiceActivityType").then((res) => {
                const data = res.data.data;
                if (res.data.code === 200) {
                    this.typelist = data;
                }
            });
            this.getPracticeActivityPageLists();
        },
        methods: {
            getPracticeActivityPageLists() {
                getPracticeActivityPageList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleInputChange() {
                this.getPracticeActivityPageLists();
            },
            sizeChangeHandler(val) {
                 this.pagination.pageNo=1;
                this.pagination.pageSize=val;
                this.getPracticeActivityPageLists();
            },
            currentChangeHandler() {
                this.getPracticeActivityPageLists();
            },
            deletePracticeActivityById(id) {
                this.$confirm('是否删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePracticeActivityById(id).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.$message({
                                message: "删除成功！",
                                type: "success"
                            });
                            this.getPracticeActivityPageLists()
                        }
                    })

                }).catch(() => {
                });
            },
            publishPracticeActivityById(id) {
                this.$confirm('是否发布', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    publishPracticeActivityById(id).then(res => res.data).then(data => {
                        if (data.result) {
                            this.$message({
                                message: "发布成功！",
                                type: "success"
                            });
                            this.getPracticeActivityPageLists()
                        }else{
                            this.$message({
                                message: data.msg,
                                type: 'warning'
                            });
                        }
                    })

                }).catch(() => {
                });
            },
            comprehensivepracticeStatistics(id){
                this.$router.push({
                            path: "comprehensivepracticeStatistics",
                            query: {id:id}
                    })
            },
            comprehensivepracticeeidt(id,state){
                this.$router.push({
                            path: "comprehensivepracticeeidt",
                            query: {id:id, state: state}
                    })
            },
            comprehensivepracticedetails(id,state){
                this.$router.push({
                            path: "comprehensivepracticedetails",
                            query: {id:id,state:state}
                    })
            },
            comprehensivepracticeadd(){
                this.$router.push({
                            path: "comprehensivepracticeadd"
                    })
            },
            starExchangeSet(){
                this.$router.push({
                            path: "starExchangeSet"
                    })
            }
        }
    }
</script>

<style scoped>
        .link {
            color: #409eff;
            cursor: pointer;
        }

</style>
