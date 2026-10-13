<template>
    <div class="app-container ">
        <div class="filter-container">
            <el-col :span="19">
               <el-button @click="$router.back()" type="default" size="medium" v-if="(mynum==1)||isStandalone">返回</el-button>               
               <el-select class="filter-item" v-model="listQuery.typeId" size="medium" @change="handleFilter()">
                   <el-option v-for="item in foodTypeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
               </el-select>
               <el-button type="primary" size="medium" @click="schoolfoodbankindex()">学校菜品库</el-button>
            </el-col>
            <el-col :span="5">
                <el-input size="medium"  placeholder="请输入菜品名称" v-model.trim="listQuery.searchName" @change="handleFilter">
                  <el-button size="medium" slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                </el-input>
            </el-col>
        </div>			
        <el-table stripe :data="dataList"  :height="`${maxH}px`" border style="width: 100%"  > 
           <el-table-column  label="图片"  align="center" width="80">
                <template slot-scope="scope">
                    <img class="img" :src="scope.row.pic" alt="">
                </template>
            </el-table-column>      
            <el-table-column  label="名称" show-overflow-tooltip  width="180">
                <template slot-scope="scope">
                    <span class="link-type" @click="foodbankdetails(scope.row.id)">{{scope.row.name}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="分类" align="center" width="120">
                <template slot-scope="scope">
                        {{scope.row.typeName}}
                </template>
            </el-table-column>   
            <el-table-column label="成分及配比">
                <template slot-scope="scope">
                      <span v-for="(item,index) in scope.row.materialList" :key="index">{{item.materialName}}{{item.percent}}%;</span>
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
    import {findDicsByCode,queryFoodList} from '@/api/dietaryManagement';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
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
                mynum:0
            }
        },
        created() {
            this.queryFoodLists();
            if(this.$route.query.mynum){
                this.mynum=this.$route.query.mynum;
            }
            findDicsByCode('foodType').then(res=>{
                this.foodTypeList=[{id:'0',value:'全部菜品分类'}];
                for(let i=0;i<res.data.data.length;i++){
                  this.foodTypeList.push(res.data.data[i])
                }
            }).catch();
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        mixins: [mixin],       
        methods: { 
            //获取列表          
            queryFoodLists() {
                queryFoodList(this.listQuery)
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
                this.queryFoodLists();
            }, 
            //切换码数          
            handleSizeChange(val) {
                this.listQuery.pageNo=1;
                this.listQuery.pageSize = val;
                this.queryFoodLists();
            },
            //切换页数
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryFoodLists();
            },
            //详情
            foodbankdetails(id){
              this.$router.push({
                    path: "foodbankdetails",
                    query: {id: id}
                });
            },
            //学校菜品库
            schoolfoodbankindex(){
                this.$router.push({
                    path: "schoolfoodbankindex"
                });
            }
            
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
