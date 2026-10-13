<template>
  <div class="school_mate_apply_info_wrap">
    <div class="header">
      <el-button
        size="medium"
        @click="goBack"
      >返回</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="isShowReviewDialog=true"
          v-if="applyStatus === 0"
        >审核</el-button>
         <el-button
          type="primary"
          size="medium"
          @click="newpop=true"
          v-if="applyStatus === 1"
        >编辑届数班级</el-button>
    </div>
     <el-dialog
      title="编辑届数班级"
      :visible.sync="newpop"
      size="tiny"
      append-to-body
      width="500px"
    >
      <div>
         <el-select size="medium"  v-model="applyInfo.gradeId" placeholder="请选择年级"  @change="queryClassByGradeIds()">
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select size="medium"   v-model="applyInfo.classId"  placeholder="请选择班级" >
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
          <el-button size="medium" @click="newpop=false">取消</el-button>
          <el-button
            type="primary"
            size="medium"
           @click="updateApply()" >确定</el-button>
  </div>
  </el-dialog>
    <el-dialog
      title="审核"
      :visible.sync="isShowReviewDialog"
      size="tiny"
      append-to-body
      width="30%"
    >
      <div>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入审核意见"
          v-model.trim="checkRemark"
        >
          </el-input>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="medium"
          @click="saveApplyCheck(1)"
          v-if="applyStatus === 0"
        >通过</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="saveApplyCheck(2)"
            v-if="applyStatus === 0"
          >不通过</el-button>
  </div>
  </el-dialog>
  <div
    class="school_mate_apply_set_box"
    :style="`height: ${boxH - 200}px;`"
  >
    <div class="school_mate_inner_box">
      <div class="code_list">
        <el-form
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
        >
          <div class="code_title">
            <span>校友基本信息</span>
          </div>
          <el-form-item label="姓名">{{applyInfo.realName || '--'}}</el-form-item>
          <el-form-item label="性别">{{sexTypeList[applyInfo.sex] || '--'}}</el-form-item>
          <el-form-item label="手机号">{{applyInfo.mobile || '--'}}</el-form-item>
          <el-form-item label="身份证号">{{applyInfo.cardId || '--'}}</el-form-item>
          <el-form-item label="QQ号">{{applyInfo.qqCard || '--'}}</el-form-item>
          <el-form-item label="电子邮箱">{{applyInfo.email || '--'}}</el-form-item>
          <el-form-item label="年级（毕业年份）">{{applyInfo.gradeName || '--'}}</el-form-item>
          <el-form-item label="班级">{{applyInfo.className || '--'}}</el-form-item>
          <el-form-item label="班主任或老师">{{applyInfo.teacherName || '--'}}</el-form-item>
          <el-form-item label="毕业校区" v-if="applyInfo.graduationCampus">{{applyInfo.graduationCampus || '--'}}</el-form-item>
          <el-form-item
            label="毕业回忆"
            style="width:90%"
          >
            <div
              class="apply_pic_img_box"
              v-if="picList.length"
            >
              <image-previewer tag="richtext">
                <div>
                  <img
                    :key="picIndex"
                    v-for="(picItem, picIndex) in picList"
                    :src="picItem.fileUrl || picItem.accessUrl || picItem"
                  >
                </div>
              </image-previewer>
      </div>
      <div v-else>--</div>
      </el-form-item>
      <div class="code_title">
        <span>校友工作信息</span>
      </div>
      <el-form-item label="工作单位">{{applyInfo.workUnit || '--'}}</el-form-item>
      <el-form-item label="所属领域">{{applyInfo.workDomain || '--'}}</el-form-item>
      <el-form-item label="所在部门">{{applyInfo.workDept || '--'}}</el-form-item>
      <el-form-item label="职务">{{applyInfo.workPosition || '--'}}</el-form-item>
      <div
        v-if="workHistory.length"
        class="code_title"
      >
        <span>工作经历</span>
    </div>
    <el-table
      v-if="workHistory.length"
      stripe
      :data="workHistory"
      style="width: 100%"
      border
      highlight-current-row
    >
      <el-table-column label="工作时段">
        <template slot-scope="scope">
          <span>{{scope.row.kaishi}}</span>
          <span v-if="scope.row.jieshu">~{{scope.row.jieshu}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="scope">
          <span>{{scope.row.danwei || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务">
        <template slot-scope="scope">
          <span>{{scope.row.zhiwu || '--'}}</span>
        </template>
      </el-table-column>
      </el-table>
      <div class="code_title">
        <span>求学经历</span>
      </div>
      <el-form-item label="初中就读学校">{{applyInfo.juniorHighSchool || '--'}}</el-form-item>
      <el-form-item label="高中就读学校">{{applyInfo.highSchool || '--'}}</el-form-item>
      <el-form-item label="大学就读学校">{{applyInfo.university || '--'}}</el-form-item>
      <el-form-item label="硕士研究生就读学校">{{applyInfo.graduateSchool || '--'}}</el-form-item>
      <el-form-item label="博士研究生就读学校">{{applyInfo.doctoralSchool || '--'}}</el-form-item>
      <el-form-item label="其他">{{applyInfo.otherSchool || '--'}}</el-form-item>
      <div v-if="applyInfo.schoolId==852">
          <div class="code_title">
            <span>29，我想对你说</span>
          </div>
           <div class="namebox">
           在校期间令您印象最深刻的元素有哪些？（包括且不限于:人物、场景、画面、事件……越生动越细节越好）
           <div>{{applyInfo.extendQuestion1||'--'}}</div>
        </div>
        <div class="namebox">
           在您的心目中，二十九中有着怎样的特质?您最爱她的一点是什么？
           <div>{{applyInfo.extendQuestion2||'--'}}</div>
        </div>
         <div class="namebox">
           从二十九中毕业，您最大收获的是什么？（母校带给您的影响有哪些？）
           <div>{{applyInfo.extendQuestion3||'--'}}</div>
        </div>
        <div class="namebox">
           如果能够借由平行时空重返校园，您想做些什么？
           <div>{{applyInfo.extendQuestion4||'--'}}</div>
        </div>
       </div>
      <div class="code_title">
        <span>审核信息</span>
      </div>

      <el-form-item label="审核状态">
        <el-tag
          type="info"
          size="medium"
          v-if="applyStatus===0"
        >未审核</el-tag>
          <el-tag
            type="success"
            size="medium"
            v-if="applyStatus===1"
          >已通过</el-tag>
            <el-tag
              type="danger"
              size="medium"
              v-else-if="applyStatus===2"
            >未通过</el-tag>
      </el-form-item>
      <div v-if="applyStatus!=0">
        <el-form-item
          label="审核意见"
          style="width: 100%;"
          v-if="applyInfo.checkRemark"
        >
          {{applyInfo.checkRemark}}
          </el-form-item>
      </div>
      </el-form>

      </div>

      </div>
      </div>
      </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer";
import AddressBook from "@/components/AddressBook/indexExpand";
import { getApplyInfo, checkFellowApply,updateApply,getGradeAndClass,getDicDetailValuePageList} from "@/api/schoolMate";

export default {
  name: "schoolMateApplyInfo",
  components: {
    ImagePreviewer,
    AddressBook,
  },
  data() {
    return {
      applyId: Number(this.$route.query.applyId),
      applyStatus: Number(this.$route.query.applyStatus),
      listLoading: false,
      sexTypeList: ["未知", "男", "女"],
      applyInfo: {},
      picList: [],
      checkRadio: "1",
      addressData: {},
      configData: {
        title: "请选择放入班级",
        nodeTitle: "请选择放入班级",
        depart: { target: "depart", departType: "sf", userTypes: "5" },
        group: false,
        SingleChose: true,
      },
      workHistory: [],
      isShowReviewDialog: false,
      checkRemark: "",
      newpop:false,
      gradeList:[],
      classList:[]
    };
  },
  mixins: [mixins],
  created() {
    this.getApplyInfo();
    getGradeAndClass().then(res => {
          const data = res.data.data;
          this.gradeList=res.data.data 
          this.queryClassByGradeIds(1)
        }).catch(() => {
        });
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    updateApply(){
      updateApply({
        classId:this.applyInfo.classId,
        id:this.applyId,
        className:(this.classList.find((item) => item.id == this.applyInfo.classId)).name
      })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success("编辑成功");
              this.newpop = false;
              this.getApplyInfo();
            } else {
              this.$message.warning(res.data.msg);
              this.newpop = false;
              this.getApplyInfo();
            }
          })
          .catch(() => {
            this.newpop = false;
          });
    },
     //获取班级
   queryClassByGradeIds(num) {
                this.classList=[];
                for(let i=0;i<this.gradeList.length;i++){
                   if(this.applyInfo.gradeId==this.gradeList[i].id){
                     this.classList=this.gradeList[i].classList
                   }
                 }
                 if(!num){
                   this.applyInfo.classId=this.classList[0].id
                 }
               
   },
    
    getApplyInfo() {
      getApplyInfo({ id: this.applyId }).then(res => {
        const data = res.data.data;
        if (res.data.code === 200 && res.data.result) {
          this.applyInfo = data;
          this.picList = data.graduationMemories
            ? data.graduationMemories.split(",")
            : [];
          if (data.message) {
            this.applyInfo.messageList = data.message.split("\n");
          }
          this.workHistory = data.workHistory
            ? JSON.parse(data.workHistory)
            : [];
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    saveApplyCheck(num) {
      let query = {
        id: this.applyId,
        status: num,
        checkRemark: this.checkRemark,
      };
      if (num == 2 && !this.checkRemark) {
        this.$message.warning("请输入 审核意见");
        return;
      }
      this.checkFellowApply(query);
    },
    checkFellowApply(query) {
      this.$confirm("是否" + (query.status == 1 ? "通过" : "不通过"), "审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        checkFellowApply(query)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success("审核成功");
              this.listLoading = false;
              this.goBack();
            } else {
              this.$message.warning(res.data.msg);
              this.listLoading = false;
              this.goBack();
            }
            this.isShowReviewDialog = false;
            // this.getApplyInfo()
          })
          .catch(() => {
            this.listLoading = false;
          });
      });
    },
  },
};
</script>

<style scoped>
.school_mate_apply_info_wrap .el-form-item {
  margin-bottom: 0px;
  width: 45%;
  display: inline-block;
}
</style>
<style lang="scss" scoped>
.namebox{
  font-size: 14px;
    padding: 10px;
    background: #fff;
    color:#606266;
    div{
          margin-top: 5px;
        color: #333;
        background: #efefef;
        padding: 10px;
        border-radius: 10px;
    }
}
.school_mate_apply_info_wrap {
  padding: 12px;

  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .school_mate_apply_set_box {
    overflow-x: hidden;
    overflow-y: auto;

    .school_mate_inner_box {
      width: 810px;
      margin: 20px auto;

      .code_title {
        height: 20px;
        line-height: 20px;
        margin: 10px 15px;
        padding-left: 8px;
        border-left: 4px solid #409eff;
        color: #333;
      }

      .code_list {
        margin: 15px;
        padding-left: 15px;

        .apply_pic_img_box {
          img {
            display: block;
            float: left;
            width: 120px;
            height: 120px;
            margin-right: 10px;
            margin-bottom: 15px;
          }
        }

        .apply_address_box {
          padding: 15px 0;
        }
      }
    }
  }
}
</style>
