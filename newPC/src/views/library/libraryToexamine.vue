<template>
    <div class="libraryToexamine">
          <div class="top">
                      <el-row >
                        <el-col :span="19"> 
                            <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                        </el-col>
                        <el-col :span="5">
                            <el-input placeholder="请输入书籍名称" size="medium" icon="el-icon-search" @change="handleInputChange"
                          v-model.trim="query.boolName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input> 
                        </el-col>
                    </el-row>
                    </div>

        <!-- <div class="button">
             <span :class="{'color' : query.typeId==0}"  @click="buttonclidk(0)">全部</span>
             <span  :class="{'color' : query.typeId==item.code}"  :key="index" v-for="(item,index) in typeList" @click="buttonclidk(item.code)">{{item.value}}</span>
        </div> -->
        <div class="time-table">
            <el-table stripe  :data="dateList" border fit highlight-current-row  style="width: 100%" :height="maxH">
                <el-table-column  label="封面">
                    <template slot-scope="scope">
                       <image-previewer tag="richtext"><span class="img"><img :src="scope.row.coverUrl"> </span>
                        </image-previewer>
                    </template>
                </el-table-column>
                <el-table-column  label="书籍名称">
                    <template slot-scope="scope">
                       <span class="link" @click="librarydetails(scope.row.id)">{{scope.row.boolName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="书籍分类">
                    <template slot-scope="scope">
                       <span >{{scope.row.typeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="上传学校">
                    <template slot-scope="scope">
                       <span >{{scope.row.schoolName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.state==1" type="danger">未审核</el-tag>
                        <el-tag  size="mini" v-if="scope.row.state==2" type="success">已审核</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column  label="操作">
                    <template slot-scope="scope">
                           <el-button  size="small" type="text" @click="libraryedit(scope.row.id)" >编辑</el-button>
                           <el-button  size="small" type="text"  @click="batchPlayWordBooks(scope.row.id)"  :disabled="scope.row.state==2" >审核通过</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import BackTool from '@/components/BackTool';
    import {findDicsByCode,getPlayWordBookListByNum,delPlayWordBookById,batchPlayWordBook} from '@/api/library';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    export default {
        name: "libraryToexamine",
        data: function () {
            return {
                dateList: [],//表格主题数据
                typeList:[],//类型
                total: null,
                query: {
                    boolName: '', //书籍名称
                    pageNo: 1, //页数
                    pageSize: 20,//条数
                    typeId:0,
                    state:1,
                }
            };
        },
        components: { BackTool,ImagePreviewer},
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            this.getPlayWordBookListByNums();
            this.findDicsByCodes()
        },
        methods: {
            //获取类型
            findDicsByCodes(){
               findDicsByCode().then(res => {
                    let data = res.data.data;
                    this.typeList = data;
                });
            },
            //详情
            getPlayWordBookListByNums(){
                getPlayWordBookListByNum(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            },
            //搜索
            handleInputChange(){
                this.query.pageNo=1;
                this.getPlayWordBookListByNums();
            },
            //切换条数
            handleSizeChange(val) {
                this.query.pageNo=1;
                this.query.pageSize=val;
                this.getPlayWordBookListByNums();
            },
            //切换页数
            handleCurrentChange() {
                this.getPlayWordBookListByNums();
            },
            //切换类型
            buttonclidk(id){
                this.query.pageNo=1;
                this.query.typeId=id;
                this.getPlayWordBookListByNums();
            },
            //跳转编辑
			libraryedit(id) {
				this.$router.push({
					path: 'libraryedit',
					query: {
                        id: id,
                        num:1
					}
				})
            },
             //跳转详情
			librarydetails(id) {
				this.$router.push({
					path: 'librarydetails',
					query: {
                        id: id
					}
				})
            },
            //审核
            batchPlayWordBooks(id){
                 this.$confirm('确定审核通过吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    batchPlayWordBook({id:id,state:2}).then(res => {
                        if (res.data.code === 200) {
                            this.$message({type: 'success',message: '审核成功!'});
                            this.getPlayWordBookListByNums();
                        }
                    }).catch(function (error) {});
                }).catch(() => {});
            }

        }
    };
</script>
<style lang="scss" scoped>
    .libraryToexamine {
        padding:12px;
        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
         .img img {
                height: 30px;
            }
            .link{
                color:#409EFF;
                cursor:pointer;
            }
        .button{
            padding:10px 0;
            span{
                cursor: pointer;
                border: 1px solid #dddddd;
                border-radius: 5px;
                text-align: center;
                display: inline-block;
                width: 80px;
                padding: 5px;
                font-size: 14px;
                margin-right: 10px;
            }
            .color{
                background-color: #12B7F5;
                 color: #fff;
                 border-color: #12B7F5;
            }
        }


    }


</style>
