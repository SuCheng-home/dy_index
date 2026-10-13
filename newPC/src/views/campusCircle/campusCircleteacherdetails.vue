<template>
<div class="campusCircleteacherdetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <address-book v-model="addressData"  :config="configData" :isbutton="true" :isSchoolManager="true">新增学生</address-book>
         <el-button type="primary" size="medium"   @click="campusCircleImport()">导入学生</el-button>
     </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="article-container">
                <div class="title">{{groupName}}</div>
                <div class="sub-title">
                    {{teacherNames}} 
                </div>
            </div>
            <div class="stu-box">
                <div class="stu" v-for="item in groupStuList" :key="item.stuId">
                    <i class="el-icon-delete" @click="deleteTopicGroupStus(item.stuId)"></i>
                    <img :src="item.stuAvatar" alt="">
                    <div class="name">{{item.stuName}}</div>
                    <div class="class-name">{{item.className}}</div>
                </div>
            </div>
         
     </div>
     <el-dialog title="新增失败学生" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="numpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
		  <div v-html="myhtml"></div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="numpop=false">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import { getCircleTopicGroupInfoById,deleteTopicGroupStu,addTopicGroupStu} from "@/api/campusCircle";
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
export default {
  data() {
    return {
      id: this.$route.query.id,
      groupStuList: [],
      groupName: "",
      teacherNames: "",
      configData: {
        title: "学生",
        depart: { target: "user", departType: "s", userTypes: "2" },
        group: false
      },
      addressData: { departJson: [], groupJson: [], userJson: [] },
      myhtml:"",
      numpop:false
    };
  },
   components: {AddressBook},
  mixins: [mixin],
   watch: {
    addressData(addressData) {
      if (addressData.userJson.length !== 0) {
        addTopicGroupStu({
          groupId: this.$route.query.id,
          studentJson:JSON.stringify(addressData.userJson),
          topicId:this.$route.query.topicId
        })
          .then(res => res.data)
          .then(data => {
            if (data.result) {
              this.$message({
                message: "新增学生成功！",
                type: "success"
              });
              this.addressData.userJson = [];
              this.getCircleTopicGroupInfoByIds();
            }else{
              this.numpop=true;
              this.myhtml=data.msg;
              this.addressData.userJson = [];
              this.getCircleTopicGroupInfoByIds();
            }
          });
      } else {
        this.$message.error("请选择学生！");
      }
    }
  },
  created() {
    this.getCircleTopicGroupInfoByIds();
  },
  methods: {
      deleteTopicGroupStus(id){
         this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          deleteTopicGroupStu(this.id,id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
              this.getCircleTopicGroupInfoByIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
      },
    getCircleTopicGroupInfoByIds() {
      getCircleTopicGroupInfoById(this.$route.query.id).then(res => {
        let data = res.data.data;
        this.groupName = data.groupName;
        this.teacherNames = data.teacherNames;
        this.groupStuList = data.groupStuList;
      });
    },
    campusCircleImport(){
         this.$router.push({
        path: "campusCircleImport",
        query: this.$route.query
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../src/styles/mixin.scss";

@include articleDetailPageStyles;
.campusCircleteacherdetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .stu-box {
      width: 840px;
      margin: 0 auto;
      overflow: hidden;
      .stu {
        float: left;
        width: 130px;
        font-size: 13px;
        line-height: 30px;
        margin: 5px;
        color: #409eff;
        border: 1px solid #d9ecff;
        background-color: #ecf5ff;
        border-radius: 5px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: 10px 40px;
        }
        i{
            position: absolute;
            top:5px;
            right: 5px;
            font-size: 18px;
            cursor: pointer;
            color:#f56c6c;
        }
      }
    }
  }
}
</style>