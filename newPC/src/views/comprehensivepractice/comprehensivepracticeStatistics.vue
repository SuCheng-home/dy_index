<template>
    <div  class="app-container calendar-list-container comprehensivepracticeindex">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                   <el-button @click="$router.back()" type="default" size="medium">返回</el-button>                    
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="老师姓名" icon="el-icon-search" @keyup.enter.native="getActivityTeacherGroupDataPageLists()"
                              v-model="pagination.teacherName">
                        <el-button slot="append" icon="el-icon-search" @click="getActivityTeacherGroupDataPageLists()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH ">
            <el-table-column align="center" label="指导教师" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span class="link"  @click="comprehensivepracticeStatisticsdetails(scope.row.teacherId)">
                        {{scope.row.teacherName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="协助教师">
                <template slot-scope="scope">
                    <span>{{scope.row.assistThNames||"----"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分组数" >
                <template slot-scope="scope">
                    <span>{{scope.row.groupCount}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="学生数" >
                <template slot-scope="scope">
                    <span>{{scope.row.groupStuCount}}</span>
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
    import {getActivityTeacherGroupDataPageList} from '@/api/comprehensivepractice';
    export default {
        name: 'comprehensivepracticeindex',
        data() {
            return {
                dataList: [],
                pagination:{
                    pageSize:20,
                    pageNo:1,
                    teacherName:"",
                    activityId:this.$route.query.id,
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
            this.getActivityTeacherGroupDataPageLists();
        },      
        methods: {          
            getActivityTeacherGroupDataPageLists() {
                getActivityTeacherGroupDataPageList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleInputChange() {
                this.getActivityTeacherGroupDataPageLists();
            },
            sizeChangeHandler(val) {
                 this.pagination.pageNo=1;
                this.pagination.pageSize=val;
                this.getActivityTeacherGroupDataPageLists();
            },
            currentChangeHandler() {
                this.getActivityTeacherGroupDataPageLists();
            },           
            comprehensivepracticeStatisticsdetails(teacherId){
                this.$router.push({
                            path: "comprehensivepracticeStatisticsdetails",
                            query: {id:this.$route.query.id,teacherId}
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
