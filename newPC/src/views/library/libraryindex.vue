<template>
    <div class="libraryindex">
              
                    <div class="top">
                      <el-row >
                        <el-col :span="19"> 
                            <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                            <el-button size="medium" type="primary" @click="libraryadd()">新增书籍</el-button> 
            <el-button type="primary" size="medium" @click="libraryToexamine()">待审核书籍</el-button>                         
                        </el-col>
                        <el-col :span="5">
                            <el-input placeholder="请输入书籍名称" size="medium" icon="el-icon-search" @change="handleInputChange"
                          v-model.trim="query.boolName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input> 
                        </el-col>
                    </el-row>
                    </div>
       
        <div class="button">
             <span :class="{'color' : query.typeId==0}"  @click="buttonclidk(0)">全部</span>
             <span  :class="{'color' : query.typeId==item.code}"  :key="index" v-for="(item,index) in typeList" @click="buttonclidk(item.code)">{{item.value}}</span>
        </div>
        <div class="time-table" :style="{height: (maxH-50)+'px'}">
             <div class="book">
                 <div class="li" :key="index" v-for="(item,index) in dateList" :style="{backgroundImage: 'url(' + item.coverUrl + ')'}">
                      <i class="el-icon-edit" @click="libraryedit(item.id)"></i>
                      <i class="el-icon-delete" @click="delPlayWordBookByIds(item.id)"></i>
                      <div class="book__info" @click="librarydetails(item.id)">                           
                            <div :title="item.boolName">{{item.boolName}}</div>
                            <div>字数：{{item.wordCount}}字</div>
                      </div>
                 </div>
             </div>
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
    import {findDicsByCode,getPlayWordBookListByNum,delPlayWordBookById} from '@/api/library'; 
    import mixin from '@/mixins/windowResize';
    export default {
        name: "libraryindex",
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
                    state:2,
                }
            };
        },
        components: { BackTool },
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
                this.query.pageSize=val;
                this.query.pageNo=1;
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
            //删除
            delPlayWordBookByIds(id) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    delPlayWordBookById(id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({type: 'success',message: '删除成功!'});
                            this.getPlayWordBookListByNums();
                        }
                    }).catch(function (error) {});
                }).catch(() => {});
            },
            //跳转编辑
			libraryedit(id) {
				this.$router.push({
					path: 'libraryedit',
					query: {
                        id: id,
                        num:2
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
            //跳转新增
			libraryadd() {
				this.$router.push({
					path: 'libraryadd',					
				})
            },
            //跳转待审批
			libraryToexamine() {
				this.$router.push({
					path: 'libraryToexamine',					
				})
			},
        }
    };
</script>
<style lang="scss" scoped>
    .libraryindex {
        padding:12px;
        .top {
            border-bottom: 1px solid #e7eaec;
         padding-bottom: 10px;
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
        .time-table{
              overflow: auto;
              .book{
                  overflow: hidden;
                  .li:hover{
                    i{
                        display: block;
                      }
                  }
                  .li {
                    position: relative;
                    background: no-repeat center center / cover;
                    margin-right: 42px;
                    margin-bottom: 30px;
                    box-shadow: 0 0 10px #777;
                    position: relative;
                    width: 140px;
                    height: 200px;
                    text-align: center;
                    float: left;
                    i{
                        display: none;
                        font-size: 20px;
                        cursor: pointer;
                    }
                    .el-icon-delete{
                        position: absolute;
                        color: red;
                        right:5px;
                        top:5px;
                    }
                    .el-icon-edit{
                        position: absolute;
                        color: #409EFF;
                        right:30px;
                        top:5px

                    }
                    .book__info {
                        cursor: pointer;
                        background-color: rgba(0, 0, 0, 0.5);
                        color: #fff;
                        position: absolute;
                        bottom: 0;
                        padding: 2px;
                        width: 100%;
                        div {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }
                }

              }
               
        }
       
    }

    
</style>
