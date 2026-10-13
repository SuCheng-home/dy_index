<template>
  <div class="newList">
    <ul class="newList-ul" v-loading.body="listLoading" v-if="columnList&&columnList.length!==0 &&query.type!==4">
      <li v-for="(listItem,index) in columnList" :key="index">
        <span class="fa fa-caret-right list-head"></span> 
        <!--二级栏目列表-->
        <template v-if="query.id&&query.secondColumn&&!query.indexid">
        <a href="javascript:;" v-if="listItem.messageType===1" @click="subjumpTo('/webOne/main/column/newdetail',query,listItem)" v-html="listItem.title"></a> 
        </template>
        <!--首页栏目列表-->
        <template v-if="query.id&&query.indexid">
        <a href="javascript:;" v-if="listItem.messageType===1" @click="nosubjumpTo('/webOne/main/column/newdetail',query,listItem)" v-html="listItem.title"></a> 
        </template>
        <a :href="listItem.messageUrl" target="_blank" v-if="listItem.messageType===2">{{listItem.title}}</a> 
        <span class="time">{{listItem.createTime}}</span>
      </li>
      <!-- <li>
        <span class="fa fa-caret-right list-head"></span> 
        <a href="javascript:;">南京日报：边背《锄禾》边插秧 方知&amp;ldquo;粒粒皆辛苦&amp;rdquo;</a> 
        <span class="time">2017-08-24  09:30:17</span>
      </li> -->
    </ul>
    <div class="pagination-container" v-show="!listLoading&&total!==0">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo"
        :page-sizes="[15, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination> 
    </div>
    <ul class="no-data" v-if="columnList==''|| query.type==4">
      <img src="http://cdn.weixiaojia.cn/mobile/images/nodata.png" alt="">
      <p>暂无数据</p>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSchoolWebModuleMessageList} from '@/api/firstPage';
export default {
  data(){
    return{
      query:null,
      total:null,
      listLoading: true,
      listQuery:{
        pageNo:1,
        pageSize:15
      },
      columnList:null
    }
  },
  mounted(){
    
  },
  watch:{
    '$route':{
      handler:function(to,from){
        if(to.query){
          this.query=to.query;
          //nav一级跳2级，或者2级跳
          if(this.query.id&&this.query.secondColumn||this.query.id&&this.query.indexid){
            if(this.query.type==2){
              this.getSchoolWebModuleMessageListFunc();
            }
            if(this.query.type==4){
              console.log('')
            }
          }
        }
      },
      immediate: true
    }
  },
  methods:{
    //nav栏目消息列表跳转
    subjumpTo(url,parquery,query){
      //console.log("ss",parquery,query)
      this.$router.push({path:url,query:{parentsid:parquery.parentid,parentid:parquery.id,id:query.id,messageType:query.messageType}})
    },
    //首页栏目消息跳转
    nosubjumpTo(url,parquery,query){
      this.$router.push({path:url,query:{indexid:parquery.indexid,columnName:parquery.columnName,parentid:parquery.id,type:parquery.type,id:query.id,messageType:query.messageType}})
    },
    getSchoolWebModuleMessageListFunc(){
      this.listLoading = true;
      getSchoolWebModuleMessageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        moduleId:this.query.id
      })
      .then(res=>res.data)
      .then(res=>{
        //console.log(res.data.dataList);
        let dataList=res.data.dataList;
        for(var i=0;i<dataList.length;i++){
          dataList[i].createTime=dataList[i].createTime.substring(0,19);
        }
        this.columnList=dataList;
        this.total=res.data.pagination.total;
        this.listLoading = false;
      })
    },
    handleSizeChange(val) {
			this.listQuery.pageSize = val;
			this.getSchoolWebModuleMessageListFunc();
		},
		handleCurrentChange(val) {
			this.listQuery.pageNo = val;
			this.getSchoolWebModuleMessageListFunc();
		}

  },
  computed:{
    ...mapGetters([
      'schoolId'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/mixin.scss';
.newList{
  width:100%;
  height:auto;
  min-height: 669px;
  padding-bottom:66px;
  position: relative;
  .newList-ul{
    width: 100%;
    height: 602px;
    margin: 0 auto;
    overflow:auto;
    &>li{
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px dashed #999999;
      overflow: hidden;
      .list-head{
        display: block;
        float: left;
        font-size: 14px;
        padding-top: 12px;
        // color: $golbal-color;
        margin-right: 10px;
      }
      &>a{
        float: left;
        display: block;
        width: 76%;
        height: 39px;
        line-height: 39px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #5C5C5C;
      }
      &>a:hover{
        text-decoration: underline;
      }
      &>.time{
        width: 18%;
        color: #5C5C5C;
        display: block;
        float: right;
        text-align: right;
        height: 39px;
        font-size: 14px;
        line-height: 39px;
      }
    }
  }
  .pagination-container{
    position: absolute;
    left:0;
    bottom:20px;
    width:100%;
    margin:0 auto;
  }
  .no-data{
    text-align: center;
    padding:80px 0 20px 0;
    &>img{
      width:auto;
      display:block;
      max-width:100%;
      margin:0 auto;
    }
    &>p{
      font-size:14px;
      color:#000;
    }
  }
  
}
</style>
