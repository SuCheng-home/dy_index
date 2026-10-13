<template>
<div class="campusCircleteachereidt"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="editTopicGroups()">保存</el-button> 
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="分组名称" prop="groupName">
              <el-input type="input" v-model.trim="ruleForm.groupName" placeholder="请输入分组名称" :maxlength="15"></el-input>
            </el-form-item>   
            <el-form-item label="指导老师" prop="addressDataprop">
              <address-book v-model="addressData" :config="teacherConfigData"  :isSchoolManager="true" ></address-book>
            </el-form-item>   
            <el-form-item label="序号" prop="orderNo">
              <el-input-number v-model="ruleForm.orderNo" :min="1" :max="100" label="序号"></el-input-number>
            </el-form-item>   
             <el-form-item label="学生">
              <address-book v-model="addressDatatwo" :config="teacherConfigDatatwo" :isSchoolManager="true"></address-book>
            </el-form-item>              
      </el-form>
     </div>
     <el-dialog title="提示" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="numpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
		  <div v-html="myhtml"></div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="numpopfun()">确 定</el-button>
			</span>
		</el-dialog>
</div> 
</template>
<script>
import {editTopicGroup,getCircleTopicGroupInfoById} from "@/api/campusCircle";
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
export default {
  components: { AddressBook},
  data() {
    const addressDatapropfun = (rule, value, callback) => {
      if (this.addressData.userJson.length) {
        return callback();
      } else {
        return callback(new Error("请选择指导老师"));
      }
    };
    return {
      teacherConfigData: {
        title: "指导老师",
        depart: { target: "user", departType: "t", userTypes: "1" },
        group: false
      },
      teacherConfigDatatwo: {
        title: "学生",
        depart: { target: "user", departType: "s", userTypes: "2" },
        group: false
      },
      ruleForm: {
        groupName: "",        
        studentJson:"",
        teacherJson:"",
        topicId:this.$route.query.topicId,
        id:this.$route.query.id,
        orderNo:1
      },
      addressData: { departJson: [], groupJson: []},
      addressDatatwo: { departJson: [], groupJson: []},
      
      rules: {
        groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
        addressDataprop: [
          { validator: addressDatapropfun, trigger: "change", required: true }
        ],
        orderNo:[{ required: true, message: "请输入序号", trigger: "change" }],
      },
      myhtml:"",
      numpop:false
    };
  },
  mixins: [mixin],
  created() {
      this.getCircleTopicGroupInfoByIds();
  },
  methods: {
       getCircleTopicGroupInfoByIds() {
      getCircleTopicGroupInfoById(this.$route.query.id).then(res => {
        let data = res.data.data;
        
        this.ruleForm.orderNo = data.orderNo;
        this.ruleForm.groupName = data.groupName;
        if(data.teacherJson){
           this.$set(this.addressData, "userJson", JSON.parse(data.teacherJson));
        }else{
           this.$set(this.addressData, "userJson", []);
        }
        if(data.studentJson){
           this.$set(this.addressDatatwo, "userJson", JSON.parse(data.studentJson));
        }else{
           this.$set(this.addressDatatwo, "userJson", []);
        }
        this.$forceUpdate();
      });
    },
     numpopfun(){
             this.$router.back();
          },
      editTopicGroups() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm.teacherJson = JSON.stringify(
            this.addressData.userJson
          );
          if(this.addressDatatwo.userJson.length){
            this.ruleForm.studentJson = JSON.stringify(
            this.addressDatatwo.userJson
          );
          }         
          editTopicGroup(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {              
                this.loading = false;
                 this.numpop=true;
              this.myhtml=data.msg;
              this.addressData.userJson = [];
              }else{
                 this.loading = false;
                 this.numpop=true;
                  this.myhtml=data.msg;
                  this.addressData.userJson = [];
              }
              
            })
            .catch(() => {});
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.campusCircleteachereidt {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 0 auto;
    }
  }
}
</style>