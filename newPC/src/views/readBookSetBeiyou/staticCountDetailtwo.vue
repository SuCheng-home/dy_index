<template>
    <div class="read-way">
        <div class="header">
             <el-button size="medium" @click="goBack">返回</el-button>
             <el-button type="primary" size="medium"  @click="jumpToPage()">查看明细</el-button>
             <span class="name">{{query.studentName}}同学在{{query.startDate}} ~ {{query.endDate}} 期间共阅读{{bookList.length}}本书，共计{{totalCount}}次</span>
        </div>
        <div class="body" :style="`height: ${notbmaxH - 68}px;`">
            <div class="box"  :key="indexs" v-for="(items, indexs) in bookList">
                  <div  class="book-item" :style="`background: url(${items.logoUrl}) center center / cover no-repeat;`" >
                  <div class="book-name">
                                <div class="book-name__child">{{ items.bookName }}</div>
                                <div class="book-name__child">类型：{{ items.bookTypeName }}</div>
                            </div>
                  </div>
                  <div class="ul">
                      <div class="li" :key="index" v-for="(item, index) in wayList" v-if="items.strList[index]">
                          {{item.wayTypeName}}：{{items.strList[index]}}
                      </div>
                  </div>
            </div>
            
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import {getReadIndepenStudBookStatisticalList} from '@/api/readBookBeiyou';
    export default {
        data() {
            return {
                bookList: [],
                wayList:[],
                query:this.$route.query,
                totalCount:0
            }
        },
        mixins: [mixins],
        created() {
            this.getReadIndepenStudBookStatisticalList()
        },
        methods: {
            getReadIndepenStudBookStatisticalList() {
                getReadIndepenStudBookStatisticalList(this.$route.query).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.bookList = res.data.data.bookList;
                        this.wayList = res.data.data.wayList;
                        let num=0
                        for(let i=0;i<this.bookList.length;i++){
                            for(let j=0;j<this.bookList[i].strList.length;j++){
                               num=num+(this.bookList[i].strList[j]-0);
                            }
                        }
                        this.totalCount=Math.floor(num)
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
            }
        },
    }
</script>
<style lang="scss" scoped>
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
    .read-way {
        padding:12px;
    }

    .header {
        padding-bottom: 10px;
         border-bottom: 1px solid #e7eaec;
    }
    .body{
        overflow: auto;
        margin: 20px 0;
    }
    .box{
         float: left; 
         width: 500px;
         margin-right: 30px;
          margin-bottom: 30px;
    }
    .li{
            padding-left: 220px;
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
                    position: relative;
                }
</style>
