<template>
  <div
    class="lostPropertyDeclarationDetails"
    style="width: 100%;"
  >
    <back-tool>
     
    </back-tool>
    <div
      class="mainRepairContent"
      :style="`height: ${nobottommaxH}px;`"
    >
      <div class="body">
         <div class="title">{{announcementType==1?"寻物启事详情":"招领启事详情"}}</div>
        <el-form
          ref="ruleForm"
          label-width="140px"
        >
          <el-form-item
            v-show="declareUserName!=''"
            label="失主姓名："
          >
            <div>{{declareUserName}}</div>
          </el-form-item>
          <el-form-item
            v-show="declareUserPhone!=''"
            label="失主手机："
          >
            <div>{{declareUserPhone}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==1"
            label="申报时间："
          >
            <div>{{createDate|formatTimeFilter}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==2"
            label="发布时间："
          >
            <div>{{createDate|formatTimeFilter}}</div>
          </el-form-item>
          <el-form-item
            v-show="inscribeDeptName!=''"
            label="落款部门："
          >
            <div>{{inscribeDeptName}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==1"
            label="失物描述："
          >
            <div>{{content}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==2"
            label="物品描述："
          >
            <div>{{content}}</div>
          </el-form-item>
          <el-form-item
            v-if="lostSearchPicList.length>0"
            v-show="announcementType==1"
            label="失物图片："
          >
            <div
              class="repairimgs imgfack"
              v-if="lostSearchPicList.length>0"
            >
             <image-previewer tag="richtext" v-show="photoUrlArr.length">
                    <span class="img" :key="index" v-for="(item, index) in photoUrlArr">
                        <img :src="item.src">
                    </span>
                </image-previewer>
              
            </div>
          </el-form-item>
          <el-form-item
            v-if="lostSearchPicList.length>0"
            v-show="announcementType==2"
            label="物品图片："
          >
            <div
              class="repairimgs imgfack"
              v-if="lostSearchPicList.length>0"
            >
              <image-previewer tag="richtext" v-show="photoUrlArr.length">
                    <span class="img" :key="index" v-for="(item, index) in photoUrlArr">
                        <img :src="item.src">
                    </span>
                </image-previewer>
            </div>
          </el-form-item>
          <el-form-item label="">
            <div><span>已读人数:<span>{{readCount}}</span></span> <span
                class="link-type"
                @click="goEnlightenment(id)"
              >查看回复</span></div>
          </el-form-item>
        </el-form>

      </div>
    </div>
  </div>
</template>
<script>
//返回组件
import BackTool from "@/components/BackTool";
//获取详情的方法
import { searchFountDetails } from "@/api/lostPropertyDeclaration";
import mixin from "@/mixins/windowResize";
//图片预览
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

export default {
  name: "lostPropertyDeclarationDetails",
  components: {
    ImagePreviewer,
    BackTool,
  },
  data() {
    return {
      listQuery: {
        searchFoundId: this.$route.query.id,
        submitRead: 0,
      },
      inscribeDeptName: "",
      content: "",
      createDate: "",
      lostSearchPicList: [],
      declareUserName: "",
      declareUserPhone: "",
      readCount: "",
      id: "",
      announcementType: "",
      photoUrlArr: [],
    };
  },
  created() {
    let id = this.$route.query.id;
    searchFountDetails(this.listQuery).then((res) => {
      let data = res.data.data;
      this.inscribeDeptName = data.inscribeDeptName;
      this.content = data.content;
      this.createDate = data.createDate;
      this.lostSearchPicList = data.lostSearchPicList;
      this.declareUserName = data.declareUserName;
      this.declareUserPhone = data.declareUserPhone;
      this.readCount = data.readCount;
      this.id = data.id;
      this.announcementType = data.announcementType;
      this.photoUrlArr = data.lostSearchPicList.map((entry) => ({
        src: entry.picUrl,
      }));
    });
  },
  filters: {
    formatTimeFilter(date) {
      return date.split(".")[0];
    },
  },
  mixins: [mixin],
  methods: {
    //跳转回复详情
    goEnlightenment(id) {
      this.$router.push({
        path: "lostPropertyDeclarationListReply",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>
<style scoped>
.lostPropertyDeclarationDetails .link-type {
  margin-left: 20px;
}
 .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }

.mainRepairContent {
  padding-top: 20px;
  overflow: auto;
}

.dealcontent {
  border: 1px solid #9ea7b3;
  border-radius: 5px;
}
.body {
  width: 810px;
  margin: 0 auto;
}
.dealcontent > p {
  padding: 0 15px;
  margin: 0;
}

.repairimgs .images {
  width: 100px;
  height: 100px;
  margin: 5px;
  display: inline-block;
}

.imgfack.repairimgs {
  min-height: 110px;
}

.lostPropertyDeclarationDetails {
  padding:12px;
}
</style>
<style lang="scss" scoped>
.menu-tools {
  position: relative;
}
.lostPropertyDeclarationDetails .title {
  height: 20px;
    line-height: 20px;
    margin: 10px;
    padding-left: 8px;
    border-left: 4px solid #409EFF;
    color: #333;
}
</style>