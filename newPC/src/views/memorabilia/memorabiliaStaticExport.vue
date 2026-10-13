<template>
  <div class="memorabiliaListExport">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button size="medium" @click="$router.back()">返回</el-button>
          <el-button type="primary" size="medium" v-if="listData.length"  @click="print()">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}" v-loading="listLoading">
      <div class="print-wrapper" ref="print" id="print" style="width: 810px;margin: 0 auto;padding-top: 20px;">
        <div v-for="(listItem,listIndex) in listData" :key="listIndex"
             style="width: 100%;margin-bottom: 15px;padding: 10px 20px;position: relative;
             box-sizing: border-box;border: 1px solid #eee;border-radius: 4px;">
          <div style="font-size: 18px;color: #333;">{{listItem.happenTimeStr}}</div>
          <div style="margin: 10px 0;color: #666;word-break: break-all;">{{listItem.desc}}</div>
          <div class="clearfix">
            <div v-for="(item,index) in listItem.picUrlList" :key="index"
                 style="float: left;width:100px;height:100px;margin: 10px;border: 1px solid #fafafa">
              <img :src='item' alt="" style="display: block;width:100%;height:100%;">
            </div>
          </div>
          <div style="text-align: right;font-size: 15px;color: #333;">{{listItem.departName}}&nbsp;&nbsp;{{listItem.createUserName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import {findBigEventNoteListBySta} from '@/api/memorabilia';
export default {
  data(){
    return{
      departId:this.$route.query.departId,
      schoolTermId:this.$route.query.schoolTermId,
      startTimeStr:this.$route.query.startTimeStr,
      endTimeStr:this.$route.query.endTimeStr,
      listData:[],
      listLoading:false
    }
  },
  created(){
    this.findBigEventNoteListByStaFunc();
  },
  mounted(){

  },
  mixins: [mixin],
  methods:{
    print() {
      this.$print(this.$refs.print);
    },
    findBigEventNoteListByStaFunc(){
      this.listLoading=true;
      findBigEventNoteListBySta({
        departId:this.departId,
        endTimeStr:this.endTimeStr,
        isBtnSearch:false,
        isExport:true,
        pageNo:0,
        pageSize:0,
        schoolTermId:this.schoolTermId,
        startTimeStr:this.startTimeStr,
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200&&data.data){
          let goData=data.data;
          this.listData=goData;
          this.listLoading=false;
        }else{
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
  }
  &::-webkit-scrollbar {
      width: 6px;
  }
  &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
  }
}
.clearfix:after {
    content: "";
    height: 0;
    display: block;
    clear: both;
    visibility: hidden;
}
.memorabiliaListExport{
  padding:12px;
  box-sizing: border-box;
  .header{
    border-bottom:1px solid #e7eaec;
    padding-bottom:10px;
    margin-bottom:0;
  }
  .main-wrap{
    width:100%;
    padding-top:20px;
  }
}

/*@media print {*/
/*  .print-wrapper{*/
/*    width: 810px;*/
/*    margin: 0 auto;*/
/*    padding-top:20px;*/
/*    .p_item{*/
/*      width:80%;*/
/*      margin:0 auto;*/
/*      word-break: break-all;*/
/*		  border-radius: 4px;*/
/*      padding:10px 10px 0;*/
/*      box-sizing: border-box;*/
/*      position: relative;*/
/*    }*/
/*    .uploadFile-li{*/
/*      display: block;*/
/*      list-style-type: none;*/
/*      float: left;*/
/*      width: 100px;*/
/*      height: 100px;*/
/*      line-height: 25px;*/
/*      margin: 10px 10px 10px 0;*/
/*      position: relative;*/
/*      cursor: pointer;*/
/*      img{*/
/*        display: block;*/
/*        width:100%;*/
/*        height:100%;*/
/*      }*/
/*    }*/
/*  }*/
/*}*/
</style>


