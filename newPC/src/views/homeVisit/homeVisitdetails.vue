
<template>
    <div class="app-container calendar-list-container">
        <div class="menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="homeVisiteidt()" v-if="ispossessRole">编辑</el-button>  
            <el-button type="primary" size="medium" v-if="state==1&&ispossessRole" @click="publishHomeBatchByBatchIds()">发布</el-button>             
            <address-book v-model="addressData" v-if="state!=1&&ispossessRole" :config="configData" :isbutton="true" :isSchoolManager="true">补发</address-book>
            <el-button type="primary" size="medium" v-if="(state!=1)&&ishide" @click="speedofprogresslist()">家访进度</el-button> 
            <el-button type="primary" size="medium" v-if="state!=1&&ispossessRole" @click="remindMasterFillInHomeVisits()">提醒班主任</el-button>
             <el-button type="primary" size="medium" icon="upload" v-if="state!=1"  @click="downWork">下载家访图片</el-button>
          </div>
            <div class="article-container"  :style="`height: ${nobottommaxH}px;`">
                <div class="title">{{batchName}}</div>
                <div class="sub-title">
                    前调截止时间：{{tuneEndTime}}
                </div>
                <div>
                    <div class="content">
                        <image-previewer tag="richtext">
                            <div class="notice-content"   v-html="content"></div>
                        </image-previewer>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="section-title">
                                发布范围
                            </div>
                            <range-list :departJson="departJson" ></range-list>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import RangeList from "@/components/RangeList/RangeList";
import {
  getHomeVisitBatchById,
  reissueHomeVisitBatch,exportSchoolHomeVistPicList,
  publishHomeBatchByBatchId,remindMasterFillInHomeVisit,possessRole
} from "@/api/homeVisit";
import AddressBook from "@/components/AddressBook/indexExpand";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import mixin from "@/mixins/windowResize";
export default {
  components: {
    RangeList,
    ImagePreviewer,
    AddressBook
  },
  data() {
    return {
      configData: {
        title: "发布范围",
        depart: { target: "depart", departType: "s", userTypes: "2" },
        group: false
      },
      addressData: {},
      id: this.$route.query.id,
      departJson: [],
      groupJson: [],
      userJson: [],
      batchName: "",
      tuneEndTime: "",
      ishide:false,
      ispossessRole:false
    };
  },
  watch: {
    addressData(addressData) {
      if (addressData.departJson.length !== 0) {
        reissueHomeVisitBatch({
          id: this.$route.query.id,
          sendScopes: addressData.departJson
        })
          .then(res => res.data)
          .then(data => {
            if (data.result) {
              this.$message({
                message: "补发成功！",
                type: "success"
              });
              this.addressData.departJson = [];
              this.getHomeVisitBatchByIds();
            }
          });
      } else {
        this.$message.error("请选择发布范围！");
      }
    }
  },
  mixins: [mixin],
  created() {
    this.getHomeVisitBatchByIds();
    //判断是不是管理员
			possessRole().then(res=>{
				this.ispossessRole= res.data.data.result;
			});
  },
  methods: {
      downWork() {
        exportSchoolHomeVistPicList({
          batchId: this.$route.query.id,
          schoolId: this.$store.getters.schoolInfo.id
        }).then(res => res.data).then(data => {
          if (data.result&&data.data) {
            const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'http://api.weixiaojia.net/';
            window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
          })
      },
    homeVisiteidt() {
      this.$router.push({
        path: "homeVisiteidt",
        query: { id: this.id }
      });
    },
     speedofprogresslist() {
      this.$router.push({
        path: "speedofprogresslist",
        query: { id: this.id }
      });
    },
    getHomeVisitBatchByIds() {
      getHomeVisitBatchById(this.$route.query.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.batchName = mydata.batchName;
          this.content = mydata.content;
          this.tuneEndTime =moment(mydata.tuneEndTime).format('YYYY-MM-DD HH:mm');
          this.ishide=this.tuneEndTime<moment(new Date()).format('YYYY-MM-DD HH:mm');
          this.state = mydata.state;
          this.departJson = JSON.parse(mydata.sendScopes);
        });
    },
    publishHomeBatchByBatchIds(){
         this.$confirm('确定要发布吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.state=2;
                    publishHomeBatchByBatchId(this.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '发布成功!'
                        });
                        this.getHomeVisitBatchByIds();
                    }).catch();

                }).catch(() => {
                });
    },
    remindMasterFillInHomeVisits(){
         this.$confirm('确定要提醒班主任吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remindMasterFillInHomeVisit(this.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '提醒成功!'
                        });
                    }).catch();

                }).catch(() => {
                });
    }
  }
};
</script>
<style lang="scss">
@import "../../../src/styles/mixin.scss";
@include articleDetailPageStyles;
.menu-tools {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>
