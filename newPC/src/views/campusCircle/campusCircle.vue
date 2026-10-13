<template>
<div class="campusCircle"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-select v-model="listQuery.isDigest" placeholder="请选择" size="medium" @change="retrievaltime()">
             <el-option label="全部圈子" :value="0"></el-option>
             <el-option label="加精" :value="1"></el-option>
         </el-select>
         <el-button type="primary" size="medium"   @click="campusCircledetails()">圈子详情</el-button> 
         <el-button type="primary" size="medium"   @click="print()">打印</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH+30}px;`" id="boxDiv">
        <!-- 圈子 -->
        <div class="Box"  >
            <!-- 白色盒子 -->
            <div class="middle_content"   ref="print" >
                <!-- 主体 -->
                <div class="inner_content" >
                    <!-- 主体头部 -->
                    <div class="top_content">
                        <img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/campus_circle/circle.png">
                        <span v-html="strToHtml(title)"></span>
                    </div>
                    <div class="list">
                        <div class="noTime" v-if="contentList.length==0">
                            暂无数据
                        </div>
                        <div v-else>
                            <div class="classCircleDetailsInfo"  :key="indexs" v-for="(items, indexs) in contentList">
                             <div class="top-box">
                               <img class="top-name-img" :src="items.createLogo" alt="">
                               <div class="top-name-name">{{items.createUser}}&nbsp;&nbsp; <el-tag size="mini" v-if="items.circleType != 0">{{items.circleTypeName}}</el-tag>&nbsp;&nbsp;<img v-if="items.isDigest==1" src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/best_flag.gif" alt="" class="img-jing"></div>
                               <div class="top-name-time">{{items.createDate.slice(0,19)}}</div>
                               <span class="ispan" v-if="items.isApprove==0">  
                                 <i class="el-icon-circle-check" @click="approveSchoolCircles(1,items.id)"></i> 
                                 <i class="el-icon-circle-close" @click="approveSchoolCircles(2,items.id)"></i>
                              </span>
                             </div>
                             <div class="txt-box">
                               <div v-html="strToHtml(items.content)"></div>
                                <image-previewer tag="richtext">
                                  <span class="img" :key="index" v-for="(item, index) in items.circlePics">
                                      <img :src="item.picUrl">
                                  </span>
                              </image-previewer>
                              <video v-if="items.circleVideo!=null&&items.circleVideo.videoUrl!=''" :src="items.circleVideo.videoUrl" controls="controls" width="50%">
                                            您的浏览器不支持 video 标签。
                              </video>                              
                             </div>
                              <div  class="partingLine"><div  class="el-row"><div  class="leftLine el-col el-col-16"></div><div  class="rightLine el-col el-col-8"></div></div></div> 
                              <div class="foot-box">
                                <div class="i-box">点赞人数 &nbsp;{{items.circleFabulous.length}}&nbsp; &nbsp; &nbsp; &nbsp;评论人数 &nbsp;{{items.circleComments.length}} </div>
                                <div class="foot-box-ul" v-if="items.circleComments.length">
                                  <div class="foot-box-ul-li" :key="index" v-for="(item, index) in items.circleComments">
                                     <img :src="item.commentLogo" alt="">
                                     <div class="foot-box-ul-li-name">
                                         {{item.commentUser}}<span v-if="item.type!=1">&nbsp;回复&nbsp;{{item.receiveUser}}</span> 
                                         <span class="foot-box-ul-li-time">{{item.commentTime.slice(0,16)}}</span>                      
                                     </div>
                                     <div class="foot-box-ul-li-txt" v-html="strToHtml(item.commentContent)">
                                     </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          <div class="foot">{{footName}}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
         
     </div>
</div> 
</template>
<script>
import { getTopicSchoolCircleList,getSchoolCircleTopicInfoById,approveSchoolCircle} from "@/api/campusCircle";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import mixin from "@/mixins/windowResize";
import {strToHtml} from '@/utils/utils';
export default {
  data() {
    return {
      listQuery: {
        topicId: this.$route.query.id,
        isDigest: 0,
        pageNo: 1,
        pageSize: 10
      },
      scollY: "", //底部距离
      pullRefreshss: true, //是否下拉刷新
      lastPage: "", //总页数
      footName: "", //提示
      contentList: [],
      title:""
    };
  },
  mixins: [mixin],
  mounted: function() {
    window.addEventListener("scroll", this.scrollChange, true);
  },
  components: { ImagePreviewer },
  created() {
    this.getTopicSchoolCircleLists();
    this.getSchoolCircleTopicInfoByIds();
  },
  methods: {
    strToHtml,
    campusCircledetails() {
      this.$router.push({
        path: "campusCircledetails",
        query: { id: this.$route.query.id }
      });
    },
     getSchoolCircleTopicInfoByIds() {
      getSchoolCircleTopicInfoById(this.$route.query.id).then(res => {
        let data = res.data.data;
        this.title = data.title;
      });
    },
    approveSchoolCircles(num,id){
         this.$confirm("确认要"+(num==1?"审核通过":"审核不通过")+"吗？", num==1?"通过":"不通过", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          approveSchoolCircle(id,num).then(res => {
            if (res.data.code === 200) {
              this.$message.success("审批成功");
              this.retrievaltime();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //打印
    print() {
      this.$print(this.$refs.print);
    },
    //缓加载下拉加载ajax
    scrollChange: function() {
      let _this = this;
      // 加页码数
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight; // 设备/屏幕高度
      let scrollObj = document.getElementById("boxDiv"); // 滚动区域
      let scrollTops = scrollObj.scrollTop; // div 到头部的距离
      let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
      this.scollY = scrollTops + clientHeight - scrollHeight;
      // 把下拉刷新置为false，防止多次请求
      if (this.scollY >= 0) {
        if (this.listQuery.pageNo > this.lastPage - 1) {
          this.footName = "已加载全部";
          return false;
        }
        if (!this.pullRefreshss) {
          return false;
        }
        this.footName = "正在加载";
        this.listQuery.pageNo++;
        this.pullRefreshss = false;
        this.getTopicSchoolCircleLists();
      } else {
        // 其他时候把下拉刷新置为true
        _this.pullRefreshss = true;
      }
    },
    //检索
    retrievaltime() {
      this.listQuery.pageNo = 1;
      this.listQuery.pageSize = 10;
      this.contentList = [];
      this.getTopicSchoolCircleLists();
    },
    getTopicSchoolCircleLists() {
      getTopicSchoolCircleList(this.listQuery).then(res => {
        let data = res.data.data;
        this.lastPage=data.pagination.pages;
        this.contentList=[...this.contentList,...data.dataList];
      });
    }
  },
  beforeDestroy: function() {
    window.removeEventListener("scroll", this.scrollChange, true); //  离开页面清除（移除）滚轮滚动事件
  }
};
</script>
<style scoped lang="scss">
.ispan{
      position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
    color: #409eff;
    .el-icon-circle-close{
      color:#F56C6C;
    }
}
.foot-box-ul-li-time{
  float: right;
  font-size: 12px;
}
.foot-box-ul-li {
  border-bottom: 1px solid #F2F6FC;
  padding: 5px;
  position: relative;
  padding-left: 40px;
}
.foot-box-ul-li-txt{
      font-size: 13px;
    min-height: 30px;
    color: #909399;
    padding-top: 5px;
}
.foot-box-ul-li img{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  top:5px;
  left: 5px;
}
.foot-box-ul-li-name{
  font-size: 13px;
    line-height: 30px;
    color: #606266;
}
.i-box{
  line-height: 36px;
    font-size: 13px;
    color: #409eff;
}
.txt-box{
  padding: 20px 0;
    font-size: 13px;
    color: #606266;
        min-height: 200px;
}
 .leftLine {
        height: 10px;
        background-color: #bbf6ce;
    }
    .rightLine {
        height: 10px;
        background-color: #ffb8b5;
    }
.img img{
    width: 80px;
    height: 80px;
    margin: 10px 10px 10px 0;
}
.top-name-name{
  font-size: 14px;
  line-height: 30px;
  color:#606266;
}
.top-name-time{
  font-size: 13px;
  color:#909399;
}
.top-name-img{
  position:absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  left: 3px;
  top:12px;
}
.campusCircle {
  padding-top: 15px;
}
.top {
  padding-bottom: 10px;
  padding: 0 0 10px 15px;
}
.subject {
  overflow: auto;
  background-image: url("https://cdnfile-10043692.file.myqcloud.com/admin/images/campus_circle/campus_bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow-x: hidden;
  overflow-y: auto;
}
.middle_content {
  width: 810px;
  min-height: 646px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.35);
  overflow: hidden;
}
.inner_content {
  width: 778px;
  margin: 20px auto 44px;
  padding: 10px 10px 100px 10px;
  border: 1px solid #DCDFE6;
  background: #fff;
  border-radius: 10px;
}
.top_content {
  height: 70px;
  line-height: 70px;
  padding-left: 5px;
  font-size: 25px;
  border-bottom: 2px solid #E4E7ED;
  position: relative;
      color: #303133;
}
.top_content .img {
  float: left;
  width: 50px;
  height: 50px;
  margin: 10px 15px 10px 0;
}
.top_content span {
  float: left;
}
.noTime {
  text-align: center;
    color: #606266;
    font-size: 18px;
    line-height: 200px;
}
 .classCircleDetailsInfo {
        background: #fff;
        border-bottom: 2px dashed #EBEEF5;
        padding-bottom: 30px;
        padding-top: 10px;
        min-height: 200px;
        padding-left: 55px;
        position: relative;
    }
    .foot{
        text-align: center;
        padding-top: 10px;
        color: #666;
    }
</style>
