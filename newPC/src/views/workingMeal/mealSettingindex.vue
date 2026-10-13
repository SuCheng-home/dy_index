<template>
    <div class="mealSettingindex">
        <div class="top">       
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>   
            <el-button @click="mealSettingadd()" type="primary" size="medium">添加</el-button>
            <el-button @click="deliverySettings()" type="primary" size="medium">配送设置</el-button>           
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="地点名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.placeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime?scope.row.createTime.slice(0,19):""}}</span>
                    </template>
                </el-table-column>
                 <el-table-column      label="操作"  align="center">
                    <template slot-scope="scope">
					       <el-button  @click="delSarahPlaces(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>
                           <el-button type="text" size="small" @click="mealSettingeidt(scope.row.id)">编辑</el-button>
                     </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getSarahPlaceLists" @current-change="getSarahPlaceLists"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
    import {getSarahPlaceList,delSarahPlace} from "@/api/workingMeal";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                dataList: [],
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:null,
                    searchName:'',
                }
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getSarahPlaceLists()
        },
        methods: {
             //删除
            delSarahPlaces(id) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delSarahPlace(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.getSarahPlaceLists();
                           }
                        })
                });
            },
            getSarahPlaceLists() {
                 getSarahPlaceList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            deliverySettings(){
                this.$router.push({
                    path: 'deliverySettings'
                });
            },
            mealSettingadd(){
                this.$router.push({
                    path: 'mealSettingadd'
                });
            },
            mealSettingeidt(id){
                this.$router.push({
                    path: 'mealSettingeidt',
                    query: {
                        id:id
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mealSettingindex {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
