<template>
    <div class="compositeExamTwoInfo">
        <div class="header">
             <el-button size="medium" @click="$router.back()">返回</el-button>
             <el-button type="primary" size="medium"   @click="print()">导出pdf</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">           
            <div class="compositeExamTwoInfobodybox"  ref="print">
                 <div class="bigtop" >
               {{$route.query.dutyName}}
                <div class="time" v-if="dataList.length">
                     {{dataList[0].checkDateStr}}（{{dataList[0].weekName}}）&nbsp;&nbsp;&nbsp;&nbsp;值班人员：{{$route.query.createUserName}}
                </div>
            </div>
              <div class="ul">
                  <div class="li"  v-for="(items,indexs) in dataList" :key="indexs">
                      <div class="top">
                          {{items.checkItemName}}
                           <span class="red"> {{items.evaluateLevel}}</span>
                          <span class="plue" v-if="items.gradeName"> {{items.gradeName}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                         
                      </div>
                      <div class="txtbox">
                           <image-previewer tag="richtext">
                          <div>{{items.remark}}</div>
                          <img :src="item"  v-for="(item, index) in JSON.parse(items.picUrl)" :key="index" />
                          </image-previewer>
                      </div>
                      <div class="bottom">
                        {{items.createUserName}}&nbsp;&nbsp;&nbsp;&nbsp; {{items.createTime}}  
                       </div>
                  </div>
              </div>
            </div>
            <div class="bigbottom" v-if="myobj.yesReaderUserList.length||myobj.notReaderUserList.length">
              <span class="plue" @click="compositeExamTwoYes()">已读：{{myobj.yesReaderUserList.length}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span class="red" @click="compositeExamTwoNo()">未读：{{myobj.notReaderUserList.length}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import {getComplexCheckRecordList,getComplexCheckStatistics} from '@/api/compositeExamSetTwo';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    export default {
        name: "statisticsIndex",
         components: {
            ImagePreviewer,
        },
        data() {
            return {
                dataList: [],
                myobj:{},
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getComplexCheckRecordList();
        },
        methods: {
             //打印
            print() {
            this.$print(this.$refs.print);
            },
            compositeExamTwoNo(obj){
                this.$router.push({
                    path: "compositeExamTwoNo",
                    query:this.$route.query
                    });
            },
            compositeExamTwoYes(obj){
                this.$router.push({
                    path: "compositeExamTwoYes",
                    query:this.$route.query
                    });
            },
            getComplexCheckRecordList() {
                 getComplexCheckRecordList(this.$route.query)
                    .then(res => res.data)
                    .then(data => {
                        for(let i=0;i<data.data.length;i++){
                            data.data[i].createTime=moment(new Date(data.data[i].createTime)).format('YYYY-MM-DD HH:mm:ss')
                        }
                        this.dataList = data.data;
                    })
                getComplexCheckStatistics(this.$route.query)
                    .then(res => res.data)
                    .then(data => {
                       
                        this.myobj = data.data;
                    })
                
            }
        }
    }
</script>
<style>
 .compositeExamTwoInfobodybox{
               width:810px;
               margin:0 auto;
 }
  .compositeExamTwoInfobodybox .bigtop{
            text-align: center;
            padding: 20px;
            color: #303133;
            font-size: 20px;
            font-weight: 600;
            
       }
 .compositeExamTwoInfobodybox .bigtop .time{
                font-size:16px;
                padding-top:10px;
                color:#606266;
            }
  .compositeExamTwoInfobodybox .ul{
      overflow:hidden;
   }
   .compositeExamTwoInfobodybox .li   .top{
                    font-size: 18px;
                    line-height: 24px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                    margin-bottom: 8px;
                }
     .compositeExamTwoInfobodybox .li   .top span{
                        float:right;
                    }
     .compositeExamTwoInfobodybox .li   .top .plue{
                        color:#409EFF;
                    }
    .compositeExamTwoInfobodybox .li   .top .red{
                       color:#67C23A;
                    }
   .compositeExamTwoInfobodybox .li{
               float: left;
                width: 385px;
                margin: 10px;
                padding: 10px;
                border: 1px solid #eee;
                border-radius: 5px;
              
           }
    .compositeExamTwoInfobodybox .li .bottom{
                   font-size: 14px;
                   color: #909399;
                   padding-top: 10px;
                }
                 .compositeExamTwoInfobodybox .li .txtbox{
                 border-bottom: 1px solid #eee;
                height: 200px;
                overflow: auto;
                font-size: 14px;
                color: #606266;
                 }
                .compositeExamTwoInfobodybox .li img{
                    width:70px;
                    height:70px;
                    margin:5px 5px 5px 0;
                }
           
</style>

<style lang="scss" scoped>
    .compositeExamTwoInfo {
        padding:12px;
         .header {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
       }
       .body{
           overflow: auto;           
           .bigbottom{
               width:810px;
               margin:0 auto;
               padding:20px 10px;
               .plue{
                   color:#409EFF;
                   cursor:pointer;
               }
               .red{
                   color:#F56C6C;
                   cursor:pointer;
               }
           }
       }
       
    }
   
</style>
