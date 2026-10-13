<template>
    <div class="app-container ">
        <div class="filter-container">
            <el-col :span="19">
               <el-button @click="$router.back()" type="default" size="medium">返回</el-button>               
               <el-select class="filter-item" v-model="listQuery.typeId" size="medium" @change="handleFilter()">
                   <el-option v-for="item in foodTypeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
               </el-select>
               <el-button type="primary" size="medium" @click="schoolfoodbankadd()">新增</el-button>
               <el-button type="danger" size="medium" @click="deleteFoodss()">删除</el-button>
            </el-col>
            <el-col :span="5">
                <el-input size="medium"  placeholder="请输入菜品名称" v-model.trim="listQuery.searchName" @change="handleFilter">
                  <el-button size="medium" slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                </el-input>
            </el-col>
        </div>			
        <el-table stripe :data="dataList"  :height="`${maxH}px`" border style="width: 100%"   @select="handleSelectionChange" @select-all="handleSelectionChange"> 
           <el-table-column type="selection" align="center" width="65px" :resizable="false"></el-table-column>  
           <el-table-column  label="图片"  align="center" width="60">
                <template slot-scope="scope">
                    <img class="img" :src="scope.row.pic" alt="">
                </template>
            </el-table-column>      
            <el-table-column  label="名称" show-overflow-tooltip  width="180">
                <template slot-scope="scope">
                    <span class="link-type" @click="schoolfoodbankdetails(scope.row.id)">{{scope.row.name}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="分类" align="center" width="120">
                <template slot-scope="scope">
                        {{scope.row.typeName}}
                </template>
            </el-table-column> 
            <el-table-column label="状态" align="center" width="120">
                <el-tag  size="mini"  type="warning">待审核</el-tag>
            </el-table-column>  
            <el-table-column label="成分及配比">
                <template slot-scope="scope">
                      <span v-for="(item,index) in scope.row.materialList" :key="index">{{item.materialName}}{{item.percent}}%;</span>
                </template>
            </el-table-column> 
             <el-table-column label="操作" align="center" width="120">
                 <template slot-scope="scope">
                         <el-button  @click.native.prevent="deleteFoods(scope.row.id)"  type="text" size="small" class="buttontextred">删除</el-button>
                         <el-button  @click.native.prevent="schoolfoodbankeidt(scope.row.id)"  type="text" size="small">编辑</el-button>
                    </template>
            </el-table-column> 
        </el-table>
        <el-pagination
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {findDicsByCode,queryFoodBySchoolId,deleteFood} from '@/api/dietaryManagement';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchName: '',
                    typeId:'0'
                },
                dataList: [],
                total: null,
                foodTypeList:[],
                selected:[],
                menuIds:''
            }
        },
        created() {
            this.queryFoodBySchoolIds();
            findDicsByCode('foodType').then(res=>{
                this.foodTypeList=[{id:'0',value:'全部分类'}];
                for(let i=0;i<res.data.data.length;i++){
                  this.foodTypeList.push(res.data.data[i])
                }
            }).catch();
        },
        mixins: [mixin],       
        methods: { 
             //获取选中
            handleSelectionChange(val) {
                this.selected = val;
                this.menuIds='';
                for(let i=0;i<this.selected.length;i++){
                    if(i<this.selected.length-1){
                       this.menuIds+=this.selected[i].id+',';
                    }else{
                       this.menuIds+=this.selected[i].id; 
                    }
                };
               
            }, 
             //删除多条
            deleteFoodss(){
                if(this.selected.length==0){
                    this.$message({type: 'error', message:'请选择需要删除的菜品!'});
                    return;
                };
               this.$confirm('此操作将永久删除所选菜品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteFood(this.menuIds).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryFoodBySchoolIds();
                    }).catch();

                }).catch(() => {
                });
            },
            //删除单条
            deleteFoods(id){
               this.$confirm('此操作将永久删除此菜品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteFood(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryFoodBySchoolIds();
                    }).catch();

                }).catch(() => {
                });
            },
            //获取列表          
            queryFoodBySchoolIds() {
                queryFoodBySchoolId(this.listQuery)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }).catch(err => {
                })
            },
            //搜索
            handleFilter (){
                this.listQuery.pageNo=1;
                this.queryFoodBySchoolIds();
            }, 
            //切换码数          
            handleSizeChange(val) {
                this.listQuery.pageNo=1;
                this.listQuery.pageSize = val;
                this.queryFoodBySchoolIds();
            },
            //切换页数
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryFoodBySchoolIds();
            },
            //详情
            schoolfoodbankdetails(id){
              this.$router.push({
                    path: "schoolfoodbankdetails",
                    query: {id: id}
                });
            },
            //编辑
            schoolfoodbankeidt(id){
              this.$router.push({
                    path: "schoolfoodbankeidt",
                    query: {id: id}
                });
            },
            //新增
            schoolfoodbankadd(){
              this.$router.push({
                    path: "schoolfoodbankadd"
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }
    .filter-container{
        padding-bottom: 10px;
        overflow: hidden;
    }
    .filter-container .filter-item{
      margin: 0
    }
    .img{
      width: 30px;
      height: 30px;
    }
</style>
