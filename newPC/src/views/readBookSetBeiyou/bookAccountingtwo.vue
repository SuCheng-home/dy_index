<template>
    <div class="read-way">
        <div class="header">
             <el-button size="medium" @click="goBack">返回</el-button>
              </div>
        <div class="body" :style="`height: ${notbmaxH - 88}px;`">
              <div
                            class="book-item"
                            :style="`backgroundImage: url(${ruleForm.coverUrl})`"
                        >
                            <div class="book-name">
                                <div class="book-name__child">{{ ruleForm.boolName }}</div>
                                <div class="book-name__child">类型：{{ ruleForm.typeName }}</div>
                            </div>
                        </div>
            <div class="box" >
                 
                      
                  <div class="ul" :key="indexs" v-for="(items, indexs) in wayList" v-if="numfun(indexs)">
                      <div class="title">{{items.wayTypeName}}</div>
                      <div class="li" >
                         <el-tag :key="index" v-for="(item, index) in stuList" v-if="item.strList[indexs]">
                              {{item.studentName}}&nbsp;{{item.strList[indexs]||0}} 次
                          </el-tag>
                      </div>
                  </div>
            </div>
            
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import {getReadIndependStuStatisticalList2,getReadIndependBookSch} from '@/api/readBookBeiyou';
    export default {
        data() {
            return {
                stuList: [],
                wayList:[],
                query:this.$route.query,
                ruleForm: {
				boolName: '',	
                typeName:""	,
                coverUrl:""
			}
            }
        },
        mixins: [mixins],
        created() {
            	getReadIndependBookSch(this.$route.query.bookId)
				.then(res => res.data)
				.then(data => {
                    data.data.fileJson= data.data.fileJson?JSON.parse( data.data.fileJson):[];
					this.ruleForm = data.data
				})
            this.getReadIndependStuStatisticalList2()
        },
        methods: {
            getReadIndependStuStatisticalList2() {
                getReadIndependStuStatisticalList2(this.$route.query).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.stuList = res.data.data.stuList;
                        this.wayList = res.data.data.wayList;
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
            },
             jumpToPage() {
                this.$router.push({
                    path:'staticCountDetail',
                    query:this.$route.query
                })
            },
            goBack() {
                this.$router.back()
            },
            numfun(num){
                for(let i=0;i<this.stuList.length;i++){
                   if(this.stuList[i].strList[num]){
                       return true;
                   }
                }
                return false;
            }
        },
    }
</script>
<style lang="scss" scoped>
      .book-item {
                    position: absolute;
                    width: 140px;
                    height: 200px;
                    line-height: 20px;
                    text-align: center;
                    margin-right: 40px;
                    margin-bottom: 30px;
                    font-size: 14px;
                    border: 1px solid #f8f8f8;
                    left:20px;
                    top:20px;
                        background: no-repeat center center / cover;
                    .book-name {
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        color: #fff;
                        background: #bebebe;
                        background: rgba(0, 0, 0, 0.3);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .el-icon-delete {
                        position: absolute;
                        top: 6px;
                        right: 6px;
                        color: #f56c6c;
                        font-weight: bold;
                        cursor: pointer;
                        display: none;
                    }

                    &:hover {
                        .el-icon-delete {
                            display: inline-block;
                        }
                    }
                }
    .read-way {
        padding:12px;
    }
    .el-tag{
        margin:10px 5px;
    }
    .title{
        line-height: 20px;
        border-left: 3px solid #409eff;
        padding-left: 10px;
        font-size: 16px;
        color: #666;
        font-weight: 600;
        margin-top: 20px;
    }
    .header {
        padding-bottom: 10px;
         border-bottom: 1px solid #e7eaec;
    }
    .body{
        overflow: auto;
        margin: 20px 0;
        padding-left: 300px;
         position: relative;
    }
    .box{
         float: left; 
         width: 500px;
         margin-right: 30px;
          margin-bottom: 30px;
    }
    .li{
            line-height: 48px;
            font-size: 18px;
            color:#303133;
    }
    .book-item {
                 
                    float: left;
                    width: 210px;
                    height: 300px;
                    line-height: 20px;
                    text-align: center;                   
                    font-size: 14px;
                    border: 1px solid #f8f8f8;
                }
</style>
