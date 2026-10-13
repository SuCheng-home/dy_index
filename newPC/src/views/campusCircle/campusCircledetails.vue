<template>
<div class="campusCircledetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="campusCircletype()">圈子类型设置</el-button> 
         <el-button type="primary" size="medium"   @click="campusCircleteacher()">指导老师设置</el-button>  
         <!-- <el-button type="primary" size="medium"   @click="campusCircle()" v-if="state==2">进入圈子</el-button>   -->
         <el-button type="primary" size="medium"   @click="campusCirclelistone()" v-if="state==2">数据统计</el-button>
         <el-button type="primary" size="medium"   @click="campusCircleeidt()" v-if="state==1">编辑</el-button>
         <el-button type="primary" size="medium"   @click="publishCircleTopicByIds()" v-if="state==1">发布</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="article-container">
                <div class="title">{{title}}</div>
                <div class="sub-title">
                    {{offDate}} 
                </div>
                <div>
                    <div class="content">
                        <image-previewer tag="richtext">
                            <div class="notice-content" v-html="content"></div>
                        </image-previewer>
                    </div>
                    <div class="row" >
                        <div class="col-lg-12">
                            <div class="section-title">
                                发布范围
                            </div>
                            <range-list :departJson="departJson" :groupJson="groupJson"
                                        :userJson="userJson"></range-list>
                        </div>
                    </div>
                </div>
            </div>
         
     </div>
</div> 
</template>
<script>
import {
  publishCircleTopicById,
  getSchoolCircleTopicInfoById
} from "@/api/campusCircle";
import RangeList from "@/components/RangeList/RangeList";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import mixin from "@/mixins/windowResize";
import {strToHtml} from '@/utils/utils';
export default {
  data() {
    return {
      id: this.$route.query.id,
      state: 3,
      content: "",
      offDate: "",
      title: "",
      departJson: [],
      groupJson: [],
      userJson: []
    };
  },
  mixins: [mixin],
  components: {
    RangeList,
    ImagePreviewer
  },
  created() {
    this.getSchoolCircleTopicInfoByIds();
  },
  methods: {
    strToHtml,
    getSchoolCircleTopicInfoByIds() {
      getSchoolCircleTopicInfoById(this.id).then(res => {
        let data = res.data.data;
        this.state = data.state;
        this.offDate = data.offDate;
        this.title = this.strToHtml(data.title);
        this.content = this.strToHtml(data.content);
        this.departJson = data.departJson && data.departJson !== '' ? JSON.parse(data.departJson) : [];
      });
    },
    //发布
    publishCircleTopicByIds() {
      this.$confirm("确认要发布吗？", "发布", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          publishCircleTopicById(this.id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("发布成功");
              this.getSchoolCircleTopicInfoByIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    campusCircleeidt() {
      this.$router.push({
        path: "campusCircleeidt",
        query: { id: this.id }
      });
    },
    campusCircleteacher() {
      this.$router.push({
        path: "campusCircleteacher",
        query: { id: this.id }
      });
    },
    campusCircletype() {
      this.$router.push({
        path: "campusCircletype",
        query: { id: this.id }
      });
    },
    campusCirclelistone() {
      this.$router.push({
        path: "campusCirclelistone",
        query: { id: this.id }
      });
    },
    campusCircle() {
      this.$router.push({
        path: "campusCircle",
        query: { id: this.id }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
   @import "../../../src/styles/mixin.scss";

    @include articleDetailPageStyles;
.campusCircledetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
  }
}
</style>