<template>
    <div class="parentResourceslist">
        <div class="top"> 
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>   
            <el-select v-model="pagination.status" size="medium" placeholder="请选择" @change="searchHandler">
						<el-option label="可用" value="1"></el-option>
						<el-option label="不可用" value="2"></el-option>
					</el-select>        
            <el-button type="primary" size="medium" @click="parentResourcesadd()">添加家长资源</el-button>  
            <el-input class="search-input search-input--right" size="medium"  placeholder="请输入资源名称" v-model.trim="pagination.name" @change="searchHandler"><el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button></el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="maxH">            					              
             <el-table-column align="center" label="序号" show-overflow-tooltip  width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.orderNum}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="资源名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span >{{scope.row.name}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="审核人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="item in JSON.parse(scope.row.batchUserJson)">&nbsp;{{item.name}}&nbsp;</span>
                </template>
            </el-table-column>
             <el-table-column align="center"  label="资源状态" width="100"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="info" v-if="scope.row.status==2">不可用</el-tag>
                    <el-tag  size="mini"  type="success" v-if="scope.row.status==1">可用</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="封面" show-overflow-tooltip>
                <template slot-scope="scope">
                    <image-previewer tag="richtext">
                                <img class="img" :src="scope.row.cover" alt="">
                            </image-previewer>
                  
                </template>
            </el-table-column>           
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="text"  @click.native="parentResourceseidt(scope.row.id)" >编辑 </el-button>
                    <el-button size="small" type="text"  @click.native="delParentResource(scope.row.id)">删除</el-button>
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
    import {getParentResourceListByPage,delParentResource} from '@/api/resourceOrder';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer'
    export default {
        data() {
            return {
                dataList: [],
                pagination:{
                   pageNo:1,
                   pageSize:20,
                   total:null,
                   name:'',
                   status:'1'
                }
            }
        },
        mixins: [windowResize],  
         components: {ImagePreviewer},     
        created() {
            this.getParentResourceListByPage()
        },
        methods: {
            //搜索
            searchHandler() {
                this.pagination.pageNo = 1;
                this.getParentResourceListByPage();
            },
            //码数
            handleSizeChange() {
                this.pagination.pageNo = 1;
                this.getParentResourceListByPage();
            },
            //页数
            handleCurrentChange() {
                this.getParentResourceListByPage();
            },
            //获取列表
            getParentResourceListByPage() {
               getParentResourceListByPage(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            //删除
            delParentResource(id) {
                this.$confirm('是否删除此资源', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delParentResource(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.getParentResourceListByPage();
                           }
                        })
                });
            },
            //新增
             parentResourcesadd() {
                this.$router.push({path: 'parentResourcesadd'});
            },
            //编辑
             parentResourceseidt(id) {
                this.$router.push({path: 'parentResourcesadd', query: {id: id}});
            }
        },
    }
</script>

<style lang="scss" scoped>
   .parentResourceslist{
       padding:12px;
       .top{
           padding-bottom: 10px;
       }
       .pagination-container{
        margin-top: 10px !important;
       }
       .img{
           height: 32px;
       }
       .link {
        color: #20a0ff;
        cursor: pointer;
      }
   }
  
   
</style>
