<template>
  <div class="campusFeesSetup">
    <backtool>
       <el-button type="primary"  size="medium" @click.native="editistrue()" v-if="(query.type==1)&&(istrue)">编辑</el-button>
      <el-button type="primary"  size="medium" @click.native="saveReadClockInSet()" v-else>保存</el-button>
    </backtool>
    <div  :style="'overflow: auto;height:'+(boxH-110)+'px'">
      <el-form ref="query" :model="query" label-width="140px" :rules="rules">
                 <el-form-item label="商户选择">
                        <el-radio-group v-model="query.type">
                            <el-radio :label="0">微信商户 </el-radio>
                            <el-radio :label="1">建行商户</el-radio>
                            <el-radio :label="2">工行商户</el-radio>
                        </el-radio-group>
                </el-form-item>
                  <el-form-item label="APPID" prop="myappId" v-if="query.type==2">
                    <el-input v-model.trim="query.myappId" placeholder="api注册生成，可以联系工行获取"  :maxlength="50"></el-input>
                </el-form-item>
                  <el-form-item label="merId" prop="merId" v-if="query.type==2">
                    <el-input v-model.trim="query.merId" placeholder="请输入商户编码" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="支付方式"  v-if="query.type==2" >
                    <el-checkbox v-model="EPAYPayType">EPay</el-checkbox>
                     <el-checkbox v-model="mywxPayType">微信支付</el-checkbox>
                     
                 </el-form-item>


                 <el-form-item label="企业号ID" prop="appId" v-if="query.type==0">
                    <el-input v-model.trim="query.appId" placeholder="请输入企业号ID" :disabled="true" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="商户ID" prop="mchId" v-if="query.type==0">
                    <el-input v-model.trim="query.mchId" placeholder="请输入商户ID" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="KEY" prop="key" v-if="query.type==0">
                    <el-input v-model.trim="query.key" placeholder="请输入KEY" :maxlength="50"></el-input>
                </el-form-item>
                 <el-form-item label="商户代号" prop="merchantId" v-if="query.type==1">
                    <el-input v-model.trim="query.merchantId" placeholder="请输入商户代号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                <el-form-item label="分行代号" prop="branchId" v-if="query.type==1">
                    <el-input v-model.trim="query.branchId" placeholder="请输入分行代号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                 <el-form-item label="证书密码" prop="certPasswd" v-if="query.type==1">
                    <el-input v-model.trim="query.certPasswd" placeholder="请输入证书密码" :maxlength="50" :disabled="istrue" show-password></el-input>
                </el-form-item>
                 <el-form-item label="操作员号" prop="operId" v-if="query.type==1">
                    <el-input v-model.trim="query.operId" placeholder="请输入操作员号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                 <el-form-item label="操作员交易密码" prop="operPasswd" v-if="query.type==1" >
                    <el-input v-model.trim="query.operPasswd" placeholder="请输入操作员交易密码" :maxlength="50" :disabled="istrue" show-password></el-input>
                </el-form-item>
                <el-form-item label="支付方式"  v-if="query.type==1" >
                     <el-checkbox v-model="bankPayType" :disabled="istrue">龙支付</el-checkbox>
                     <el-checkbox v-model="wxPayType" :disabled="istrue">微信支付</el-checkbox>
                     <el-checkbox v-model="unionPayType" :disabled="istrue">银联支付</el-checkbox>
                 </el-form-item>
                <el-form-item label="证书"  v-if="query.type==1">
                      <div class="uploader-box" v-if="istrue"></div>
                      <uploader pathPrefix="xiaoyuanshoufei" module="xiaoyuanshoufei" moduleCode="1227" :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                </el-form-item>
                 <el-form-item label="验证码" prop="code" v-if="((query.type==1)&&(!istrue))||(query.type==2)" >
                     <div class="input">
                            <el-input v-model.trim="query.code" placeholder="请输入验证码" :maxlength="50" ></el-input>
                            <el-button type="primary" @click="queryVerificationCodes()" >获取验证码</el-button>
                     </div>

                </el-form-item>
            </el-form>
            <div class="biaoge"  v-if="(query.type==1)&&(istrue)">
                  <el-button type="primary" @click="feerelationship(0)"  size="medium" style="margin-bottom: 10px;">添加收费关系</el-button>
                  <el-table stripe  :data="dataList" border fit highlight-current-row  style="width: 100%" >
                <el-table-column  label="柜台代码">
                    <template slot-scope="scope">
                       <span >{{scope.row.posId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="公钥">
                    <template slot-scope="scope">
                       <span >{{scope.row.pub}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="可收费类型">
                    <template slot-scope="scope">
                       <span >{{scope.row.typeNames}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="180">
                   <template slot-scope="scope">
                         <el-button type="text"   size="small" @click.native.prevent="deleteSchoolChargeRelations(scope.row.id)" class="buttontextred">删除</el-button>
                         <el-button type="text" size="small" @click.native.prevent="feerelationship(1,scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
    </div>
    <div class="pop">
           <el-dialog title="收费关系"   :visible.sync="mydialogVisibleone" width="70%">
            <el-form :model="ruleForm" :rules="rule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="柜台代码" prop="posId" >
                    <el-input v-model.trim="ruleForm.posId" placeholder="请输入柜台代码" :maxlength="50" ></el-input>
                </el-form-item>
                <el-form-item label="公钥" prop="pub" >
                    <el-input v-model.trim="ruleForm.pub" placeholder="请输入公钥后30位" :maxlength="50" ></el-input>
                </el-form-item>
                <el-form-item label="收费类型" prop="idlist" >
                        <el-select v-model="ruleForm.idlist" multiple placeholder="请选择收费类型">
                        <el-option v-for="item in typelist" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="mydialogVisibleone = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>

  </div>
</template>
<script>
import Backtool from "@/components/BackTool";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
import {
  querySchoolChargeDetail,
  saveSchoolChargeWx,
  saveSchoolChargeBank,
  queryVerificationCode,
  addSchoolChargePos,
  querySchoolChargeTypeListNoSetting,
  updateSchoolChargeRelation,
  querySchoolChargeRelationList,
  querySchoolChargeRelationDetail,
  deleteSchoolChargeRelation,
  saveSchoolChargeICBC
} from "@/api/campusFees";
export default {
  name: "campusFeesSetup",
  components: {
    Backtool,
    Uploader
  },
  data() {
    return {
      istrue: false,
      query: {
        branchId: "", //	分行代码	string
        certPasswd: "",
        certPath: "",
        code: "",
        merchantId: "", //	商户代号	string
        operPasswd: "",
        operId: "",
        // posId:'',//	商户柜台代码	string
        // pub:'',//	公钥后30位	string
        appId: "", //公众号id	string
        key: "", //密码	string
        mchId: "", //商户id	string
        type: 0,
        bankPayType: 0,
        unionPayType: 0,
        wxPayType: 0,
        EPAYPayType:0,
        mywxPayType:0,
        myappId:'',
        merId:''
      },
      ruleForm: {
        id: "", //	主键id	number
        posId: "", //	柜台号	string
        pub: "", //	公钥	string
        typeIds: "", //	收费类型id	string	多个','分割
        typeNames: "", //	收费类型名称	string	多个','分割
        idlist: []
      },
      typelist: [],
      rule: {
        posId: [
          {
            required: true,
            message: "请输入商户柜台代码",
            trigger: "blur"
          }
        ],
        pub: [
          {
            required: true,
            message: "请输入公钥后30位",
            trigger: "blur"
          }
        ],
        idlist: [
          { required: true, message: "请选择收费类型", trigger: "change" }
        ]
      },
      dataList: [],
      mydialogVisibleone: false,
      allFileTypeList: ["pfx"],
      fileJson: [],
      rules: {
        appId: [
          {
            required: true,
            message: "请输入企业号ID",
            trigger: "blur"
          }
        ],
        myappId: [
          {
            required: true,
            message: "请输入appId",
            trigger: "blur"
          }
        ],
        merId: [
          {
            required: true,
            message: "请输入请输入商户编码",
            trigger: "blur"
          }
        ],
        mchId: [
          {
            required: true,
            message: "请输入商户ID",
            trigger: "blur"
          }
        ],
        key: [
          {
            required: true,
            message: "请输入KEY",
            trigger: "blur"
          }
        ],
        branchId: [
          {
            required: true,
            message: "请输入分行代码",
            trigger: "blur"
          }
        ],
        merchantId: [
          {
            required: true,
            message: "请输入商户代号",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        certPasswd: [
          {
            required: true,
            message: "请输入证书密码",
            trigger: "blur"
          }
        ],
        operId: [
          {
            required: true,
            message: "请输入操作员号",
            trigger: "blur"
          }
        ],
        operPasswd: [
          {
            required: true,
            message: "请输入操作员交易密码",
            trigger: "blur"
          }
        ]
      },
      isadd: 0,
      bankPayType: false,
      unionPayType: false,
      wxPayType: false,
      EPAYPayType:false,
      mywxPayType:false
    };
  },
  mixins: [mixin],
  created() {
    this.querySchoolChargeRelationLists();
    querySchoolChargeDetail()
      .then(res => {
        let data = res.data.data;
        this.query.appId = data.modelWx.appId;
        this.query.key = data.modelWx.key;
        this.query.mchId = data.modelWx.mchId;
        if(data.modelBank){
            this.query.branchId = data.modelBank.branchId;
        this.query.merchantId = data.modelBank.merchantId;
        //   this.query.posId=data.modelBank.posId ;
        this.query.pub = data.modelBank.pub;
        this.query.certPasswd = data.modelBank.certPasswd;
        this.query.operId = data.modelBank.operId;
        this.query.operPasswd = data.modelBank.operPasswd;
         if (data.modelBank.bankPayType == 1) {
          this.bankPayType = true;
        }
        if (data.modelBank.unionPayType == 1) {
          this.unionPayType = true;
        }
         if (data.modelBank.wxPayType == 1) {
          this.wxPayType = true;
        }
         if (data.modelBank.certPath) {
          this.fileJson = [
            {
              fileName: "证书",
              fileUrl: data.modelBank.certPath
            }
          ];
        }
       
        }
        if(data.modelIcbc){          
        this.query.myappId=data.modelIcbc.appId;
        this.query.merId=data.modelIcbc.merId;
        if (data.modelIcbc.ePAYPayType == 1) {
          this.EPAYPayType = true;
        }
        if (data.modelIcbc.wxPayType == 1) {
          this.mywxPayType = true;
        }
        }
      
       
        
       
        if (data.modelWx.appId) {
          this.istrue = true;
        } else {
          this.istrue = false;
        }
        if (data.type == "wx") {
        } else if(data.type == "bank"){
          this.query.type = 1;
        }else if(data.type == "icbc"){
           this.query.type = 2;
        }
        
      })
      .catch();
  },
  methods: {
    //删除
    deleteSchoolChargeRelations(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSchoolChargeRelation(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.querySchoolChargeRelationLists();
            })
            .catch();
        })
        .catch(() => {});
    },
    //获取列表
    querySchoolChargeRelationLists() {
      querySchoolChargeRelationList()
        .then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        })
        .catch(function() {});
    },
    //弹框
    feerelationship(num, obj) {
      let $this = this;
      let list = [];
      this.isadd = num;
      this.mydialogVisibleone = true;
      $this.ruleForm.posId = "";
      $this.ruleForm.pub = "";
      $this.ruleForm.id = "";
      $this.ruleForm.idlist = [];
      if (obj) {
        $this.ruleForm.posId = obj.posId;
        $this.ruleForm.pub = obj.pub;
        $this.ruleForm.id = obj.id;
        for (let i = 0; i < obj.typeList.length; i++) {
          $this.ruleForm.idlist.push(obj.typeList[i].typeId);
        }
        list = obj.typeList;
      }
      querySchoolChargeTypeListNoSetting()
        .then(res => {
          if (res.data.code === 200) {
            this.typelist = res.data.data.concat(list);
          }
        })
        .catch(function() {});
    },
    //获取验证码
    queryVerificationCodes() {
      queryVerificationCode()
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "验证码请求成功!"
            });
          }
        })
        .catch(function() {});
    },
    //编辑新增
    submitForm(formName) {
      let $this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          $this.ruleForm.typeIds = "";
          $this.ruleForm.typeNames = "";
          for (let i = 0; i < $this.ruleForm.idlist.length; i++) {
            if (i == $this.ruleForm.idlist.length - 1) {
              $this.ruleForm.typeIds += $this.ruleForm.idlist[i];
            } else {
              $this.ruleForm.typeIds += $this.ruleForm.idlist[i] + ",";
            }
            for (let j = 0; j < $this.typelist.length; j++) {
              if ($this.ruleForm.idlist[i] == $this.typelist[j].typeId) {
                if (i == $this.ruleForm.idlist.length - 1) {
                  $this.ruleForm.typeNames += $this.typelist[j].typeName;
                } else {
                  $this.ruleForm.typeNames += $this.typelist[j].typeName + ",";
                }
              }
            }
          }
          if ($this.isadd == 0) {
            addSchoolChargePos($this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "新增成功!"
                  });
                  $this.ruleForm.posId = "";
                  $this.ruleForm.pub = "";
                  $this.ruleForm.id = "";
                  $this.ruleForm.idlist = [];
                  this.querySchoolChargeRelationLists();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          } else {
            updateSchoolChargeRelation($this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  $this.ruleForm.posId = "";
                  $this.ruleForm.pub = "";
                  $this.ruleForm.id = "";
                  $this.ruleForm.idlist = [];
                  this.querySchoolChargeRelationLists();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          }
          $this.mydialogVisibleone = false;
        }
      });
    },
    editistrue() {
      this.istrue = false;
    },

    saveReadClockInSet() {
      if (this.fileJson.length == 0 && this.query.type == 1) {
        this.$message({
          type: "warning",
          message: "请上传证书！"
        });
        return;
      }
      if(this.query.type == 2){
          if (!(this.EPAYPayType || this.mywxPayType)) {
          this.$message({
            type: "warning",
            message: "支付方式至少选择一种！"
          });
          return;
        }
        if (this.EPAYPayType) {
          this.query.EPAYPayType = 1;
        } else {
          this.query.EPAYPayType = 0;
        }
        if (this.mywxPayType) {
          this.query.mywxPayType = 1; 
        } else {
          this.query.mywxPayType = 0;
        }
      }
      if (this.query.type == 1) {
        if (!(this.bankPayType || this.unionPayType || this.wxPayType)) {
          this.$message({
            type: "warning",
            message: "支付方式至少选择一种！"
          });
          return;
        }
        if (this.bankPayType) {
          this.query.bankPayType = 1;
        } else {
          this.query.bankPayType == 0;
        }
        if (this.unionPayType) {
          this.query.unionPayType = 1;
        } else {
          this.query.unionPayType = 0;
        }
        if (this.wxPayType) {
          this.query.wxPayType = 1;
        } else {
          this.query.wxPayType = 0;
        }
      }
      if (this.fileJson.length) {
        this.query.certPath = this.fileJson[0].fileUrl;
      }
      this.$refs["query"].validate(valid => {
        if (valid) {
          if (this.query.type == 0) {
            saveSchoolChargeWx(this.query)
              .then(res => {
                let data = res.data;
                if (data.code === 200) {
                  this.$message({
                    message: "设置成功！",
                    type: "success"
                  });
                  this.$router.back();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch();
          } else if(this.query.type==1){
            saveSchoolChargeBank(this.query)
              .then(res => {
                let data = res.data;
                if (data.code === 200) {
                  this.$message({
                    message: "设置成功！",
                    type: "success"
                  });
                  this.istrue = true;
                  this.query.code = "";
                  this.$router.back();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch();
          }else{
              //工商
              saveSchoolChargeICBC(this.query)
              .then(res => {
                let data = res.data;
                if (data.code === 200) {
                  this.$message({
                    message: "设置成功！",
                    type: "success"
                  });
                  this.istrue = true;
                  this.query.code = "";
                  this.$router.back();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.campusFeesSetup {
  padding:12px;
  .pop {
    .el-form {
      padding-top: 20px;
      width: 80%;
    }
  }
  .uploader-box {
    position: absolute;
    width: 100%;
    height: 50px;
  }
}
.campusFeesSetup .el-form {
  padding-top: 20px;
  width: 810px;
  margin: 0 auto;
}
.input .el-input {
  width: 380px;
}
</style>
