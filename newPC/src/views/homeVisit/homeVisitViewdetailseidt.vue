<template>
<div class="homeVisiteidt" v-loading="loading" >
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="updateStuHomeVisits()">保存</el-button>  
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
         <div class="h3">{{name}}</div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="教师姓名" prop="visitTeacher" v-if="visitFieldsfun(1001)">
              <el-input type="input" v-model.trim="ruleForm.visitTeacher" placeholder="请输入教师姓名" :maxlength="20"></el-input>
            </el-form-item>  
            <el-form-item label="家访时间" prop="visitTime" v-if="visitFieldsfun(1002)">
              <el-date-picker :editable="false"   :clearable="false" v-model.trim="ruleForm.visitTime" type="date" placeholder="请选择家访时间"/>
            </el-form-item>
             <el-form-item label="地点" prop="visitSite" v-if="visitFieldsfun(1003)">
              <el-input type="input" v-model.trim="ruleForm.visitSite" placeholder="请输入地点" :maxlength="50"></el-input>
            </el-form-item>    
            <el-form-item label="家访内容" prop="visitContentlist" v-if="visitFieldsfun(1004)">
              <el-checkbox-group v-model="ruleForm.visitContentlist">
                <el-checkbox   v-for="item in typelist" :key="item.id" :label="item.code" :name="item.code">{{item.value}}</el-checkbox>
                <el-checkbox    :label="-1">其他</el-checkbox>
              </el-checkbox-group>
            </el-form-item>   
            <el-form-item label="其他备注" prop="othervalue" v-if="typefun()">
              <el-input type="input" v-model.trim="ruleForm.othervalue" placeholder="请输入其他备注" :maxlength="50"></el-input>
            </el-form-item>       
            <el-form-item label="家访效果" prop="visitEffect" v-if="visitFieldsfun(1005)">
              <el-input type="textarea" v-model.trim="ruleForm.visitEffect" placeholder="请输入家访效果" :maxlength="200"></el-input>
            </el-form-item> 
             <el-form-item label="家长意见" v-if="visitFieldsfun(1007)">
              <el-input type="textarea" v-model.trim="ruleForm.parentOpinion" placeholder="请输入家长意见" :maxlength="200"></el-input>
            </el-form-item> 
            <el-form-item label="家访照片" prop="visitPicslist" v-if="visitFieldsfun(1006)">
              <uploader pathPrefix="studentLeave" multiple v-model="ruleForm.visitPicslist" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" :lineList="false"></uploader>
            </el-form-item>
            <el-form-item label="家访表照片" prop="visitTablePicslist" v-if="visitFieldsfun(1008)">
                <uploader pathPrefix="studentLeave" multiple v-model="ruleForm.visitTablePicslist" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" :lineList="false"></uploader>
            </el-form-item>
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import moment from "moment";
import {
  findSchoolDicsByCode,
  updateStuHomeVisit,
  getBatchStuHomeVisitInfo,
  getHomeVisitBatchById
} from "@/api/homeVisit";
import { mapGetters } from "vuex";
export default {
  data() {
    const visitTablePicslistfun = (rule, value, callback) => {
      if (this.ruleForm.visitTablePicslist.length) {
        return callback();
      } else {
        return callback(new Error("请上传家访表照片"));
      }
    };
     const visitPicslistfun = (rule, value, callback) => {
      if (this.ruleForm.visitPicslist.length) {
        return callback();
      } else {
        return callback(new Error("请上传家访照片"));
      }
    };
    return {
      ruleForm: {
        batchId: this.$route.query.id,
        stuId: this.$route.query.stuId,
        visitState: 2,
        visitContent: "",
        visitEffect: "",
        visitPics: "",
        visitSite: "",
        visitTablePics: "",
        visitTeacher: "",
        visitTime: "",
        visitContentlist: [],
        visitPicslist: [],
        visitTablePicslist: [],
        othervalue: "",
        parentOpinion:""
      },
      rules: {
        visitTeacher: [
          { required: true, message: "请输入教师姓名", trigger: "blur" }
        ],
        othervalue: [
          { required: true, message: "请输入家访内容其他备注", trigger: "blur" }
        ],
        visitSite: [{ required: true, message: "请输入地点", trigger: "blur" }],
        visitTime: [
          { required: true, message: "请选择家访时间", trigger: "change" }
        ],
        visitEffect: [
          { required: true, message: "请输入家访效果", trigger: "blur" }
        ],
        visitTablePicslist: [
          {
            validator: visitTablePicslistfun,
            trigger: "change",
            required: true
          }
        ],
        visitPicslist: [
          {
            validator:visitPicslistfun,
            trigger: "change",
            required: true
          }
        ],
        visitContentlist: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个家访内容",
            trigger: "change"
          }
        ]
      },
      typelist: [],
      name: "",
      visitFields: [],
      tuneEndTime:""
    };
  },
  mixins: [mixin],
  components: { Uploader },
  computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
  created() {
    this.findSchoolDicsByCodes();    
    this.getHomeVisitBatchByIds();
  },
  methods: {
    getHomeVisitBatchByIds() {
      getHomeVisitBatchById(this.$route.query.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.tuneEndTime= moment(mydata.tuneEndTime).format("YYYY-MM-DD" );
          this.visitFields =JSON.parse(mydata.visitFields);
          this.getBatchStuHomeVisitInfos();
        });
    },
    visitFieldsfun(num) {
        for(let i=0;i<this.visitFields.length;i++){
            if(this.visitFields[i]==num){
                return true;
            }
        }
        return false;
    },
    getBatchStuHomeVisitInfos() {
      getBatchStuHomeVisitInfo(this.$route.query.id, this.$route.query.stuId)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.name = mydata.className + "    " + mydata.stuName + "   " + " 家访记录表";          
          if(this.visitFieldsfun(1001)){
            this.ruleForm.visitTeacher = mydata.visitTeacher?mydata.visitTeacher:this.userInfo.name;
          }
          if(mydata.visitTime){
            this.ruleForm.visitTime = mydata.visitTime;
          }else{
            if(this.visitFieldsfun(1002)){
               this.ruleForm.visitTime=new Date();
            }else{
                this.ruleForm.visitTime='';
            }
            
          }        
          this.ruleForm.visitEffect = mydata.visitEffect?mydata.visitEffect:"";
          this.ruleForm.visitSite = mydata.visitSite?mydata.visitSite:"";
          this.ruleForm.parentOpinion = mydata.parentOpinion?mydata.parentOpinion:"";
          let listone = mydata.visitPics ? JSON.parse(mydata.visitPics) : [];
          for (let i = 0; i < listone.length; i++) {
            this.ruleForm.visitPicslist.push({
              id: '',
              fileUrl: listone[i].picUrl,
              fileName: listone[i].fileName
            });
          }
          let listtwo = mydata.visitTablePics
            ? JSON.parse(mydata.visitTablePics)
            : [];
          for (let i = 0; i < listtwo.length; i++) {
            this.ruleForm.visitTablePicslist.push({
              id: '',
              fileUrl: listtwo[i].picUrl,
              fileName: listtwo[i].fileName
            });
          }
          let listthree = mydata.visitContent
            ? JSON.parse(mydata.visitContent)
            : [];
          for (let i = 0; i < listthree.length; i++) {
            this.ruleForm.visitContentlist.push(listthree[i].id);
            if (listthree[i].id == -1) {
              this.ruleForm.othervalue = listthree[i].name;
            }
          }
        });
    },
    typefun() {
      for (let i = 0; i < this.ruleForm.visitContentlist.length; i++) {
        if (this.ruleForm.visitContentlist[i] == -1) {
          return true;
        }
      }
      return false;
    },
    findSchoolDicsByCodes() {
      findSchoolDicsByCode()
        .then(res => res.data)
        .then(data => {
          this.typelist = data.data;
        });
    },
    updateStuHomeVisits() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let imglistone = [];
          let imglisttwo = [];
          for (let i = 0; i < this.ruleForm.visitPicslist.length; i++) {
            imglistone.push({
              id: '',
              picUrl: this.ruleForm.visitPicslist[i].fileUrl,
              fileName: this.ruleForm.visitPicslist[i].fileName
            });
          }
          for (let i = 0; i < this.ruleForm.visitTablePicslist.length; i++) {
            imglisttwo.push({
              id: '',
              picUrl: this.ruleForm.visitTablePicslist[i].fileUrl,
              fileName: this.ruleForm.visitTablePicslist[i].fileName
            });
          }
          if (imglistone.length) {
            this.ruleForm.visitPics = JSON.stringify(imglistone);
          }
          if (imglisttwo.length) {
            this.ruleForm.visitTablePics = JSON.stringify(imglisttwo);
          }
          let list = [];
          for (let i = 0; i < this.ruleForm.visitContentlist.length; i++) {
            if (this.ruleForm.visitContentlist[i] == -1) {
              list.push({
                id: -1,
                name: this.ruleForm.othervalue
              });
            }
            for (let j = 0; j < this.typelist.length; j++) {
              if (this.ruleForm.visitContentlist[i] == this.typelist[j].code) {
                list.push({
                  id: this.typelist[j].code,
                  name: this.typelist[j].value
                });
              }
            }
          }
          this.ruleForm.visitContent = JSON.stringify(list);
          this.ruleForm.visitTime =this.ruleForm.visitTime? moment(this.ruleForm.visitTime).format("YYYY-MM-DD" ):'';
          if(this.tuneEndTime> this.ruleForm.visitTime&&this.ruleForm.visitTime){
              this.$message({
                message: '家访时间需要大于等于家访批次的前调截止时间！',
                type: 'warning'
              });              
              return;
          }
          updateStuHomeVisit(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
              }
            })
            .catch(() => {});
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.homeVisiteidt {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 20px auto;
    }
    .h3 {
      font-size: 24px;
      text-align: center;
      line-height: 80px;
      color: #303133;
    }
  }
}
</style>