<template>
    <div class="foodReservationlibraryindex">
        <div class="top"> 
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>           
            <el-button type="primary" size="medium" @click="foodReservationlibraryadd()">添加</el-button>  
            <!-- <el-button type="primary" size="medium" @click="foodReservationclassification()">食品分类设置</el-button> -->
            <el-input class="search-input search-input--right" size="medium"  placeholder="请输入食品名称" v-model.trim="pagination.searchName" @change="searchHandler"><el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button></el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="maxH">            					              
            
            <el-table-column align="center" label="图片" show-overflow-tooltip>
                <template slot-scope="scope">
                   <img class="img" :src="scope.row.pastryUrl" alt="">
                </template>
            </el-table-column>
            <el-table-column align="center" label="食品名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.pastryName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="食品分类" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.typeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="价格（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.pastryPrice/100}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="状态" width="100"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="info" v-if="scope.row.shelfState==0">未上架</el-tag>
                    <el-tag  size="mini"  type="success" v-if="scope.row.shelfState==1">已上架</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="text"  @click.native="foodReservationlibraryeidt(scope.row.id)" :disabled="scope.row.state==2">编辑 </el-button>
                    <el-button size="small" type="text"  @click.native="deletePastryByIds(scope.row.id)" :disabled="scope.row.state==2">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"> </el-pagination>
        </div>
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import {queryPastryBySchoolId, deletePastryById} from '@/api/foodReservation';
    export default {
        data() {
            return {
                dataList: [],
                pagination:{
                   pageNo:1,
                   pageSize:20,
                   total:null,
                   searchName:''
                }
            }
        },
        mixins: [windowResize],       
        created() {
            this.queryPastryBySchoolIds()
        },
        methods: {
            //搜索
            searchHandler() {
                this.pagination.pageNo = 1;
                this.queryPastryBySchoolIds();
            },
            //码数
            handleSizeChange() {
                this.pagination.pageNo = 1;
                this.queryPastryBySchoolIds();
            },
            //页数
            handleCurrentChange() {
                this.queryPastryBySchoolIds();
            },
            //获取列表
            queryPastryBySchoolIds() {
               queryPastryBySchoolId(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            //分类
            foodReservationclassification(){
                this.$router.push({
                    path: "foodReservationclassification"
                });
            },
            //删除
            deletePastryByIds(id) {
                this.$confirm('是否删除此日志', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePastryById(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.queryPastryBySchoolIds();
                           }
                        })
                });
            },
            //新增
             foodReservationlibraryadd() {
                this.$router.push({path: 'foodReservationlibraryadd'});
            },
            //编辑
             foodReservationlibraryeidt(id) {
                this.$router.push({path: 'foodReservationlibraryeidt', query: {id: id}});
            }
        },
    }
</script>

<style lang="scss" scoped>
   .foodReservationlibraryindex{
       padding:12px;
       .top{
           padding-bottom: 10px;
       }
       .pagination-container{
        margin-top: 10px !important;
       }
       .img{
           width: 32px;
           height: 32px;
       }
   }
  
   
</style>
