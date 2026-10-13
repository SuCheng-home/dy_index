<template>
<div class="recordbookindex" >
     <div class="top" v-if="isShowByPermission('/structure/scoreBook/queryScoreBookSet')"> 
         <el-button type="primary" size="medium" @click="questiontypesetting()">科目题型设置</el-button> 
     </div>        
     <div class="subject" :style="`height:${maxH+50}px`">
        <div class="listbox" v-for="(items,indexs) in dataList" :key="indexs">
            <div class="box-top">{{items.name}}</div>
            <div  class="box-ul">
                <div class="box-ul-li"  v-for="(item,index) in items.list" :key="index" @click="recordbookclassdetails(items.name,items.id,item.name,item.id)">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class.png" alt="">
                    <p>{{item.name}}</p>
                </div>
             </div>
        </div> 
         <div class="Notime" v-if="dataList.length==0">暂无数据</div>             
     </div>
</div> 
</template>
<script>
//窗口大小调整
import mixin from "@/mixins/windowResize";
import { lostDeclareDetails } from "@/api/recordbook";
import { isShowByPermission } from "@/utils";
export default {
  data() {
    return {
      dataList: []
    };
  },
  mixins: [mixin],
  mounted() {
    this.lostDeclareDetailss();
  },
  methods: {
    isShowByPermission,
    //科目题型设置  
    questiontypesetting() {
      this.$router.push({
        path: "questiontypesetting"
      });
    },
    //班级详情
    recordbookclassdetails(gradeName,gradeId,className,classId){
      this.$router.push({
                    path: 'recordbookclassdetails',
                    query: {
                        className:className,
                        classId:classId,
                        gradeName:gradeName,
                        gradeId:gradeId
                    }
                });
    },
    //获取详情
    lostDeclareDetailss() {
      lostDeclareDetails().then(res => {
        let mydata = res.data.data;
        let list = Object.keys(mydata);
        for (let i = 0; i < list.length; i++) {
          let obj = JSON.parse(list[i]);
          obj.list = mydata[list[i]];
          this.dataList.push(obj);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.recordbookindex {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    padding-top: 30px;
     .Notime{
      text-align: center;
      color: #666;
      line-height: 280px;
      font-size: 16px;
    }
    .box-top {
      line-height: 20px;
    font-size: 16px;
    border-left: 4px solid #409eff;
    padding-left: 10px;
    }
    .box-ul {
      overflow: auto;      
      .box-ul-li {
        width: 120px;
        text-align: center;
        margin: 10px 30px;
        cursor: pointer;
        float: left;
        height: 160px;
        font-size: 14px;
        img {
          width: 100px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>