<template>
<div class="newchargesetupeidtjh"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   v-if="istrue" @click="istrue=false">编辑</el-button>
         <el-button type="primary" size="medium"   v-if="!istrue" @click="istrue=true">取消编辑</el-button>
         <el-button type="primary" size="medium"   v-if="!istrue" :disabled="loading" @click="updateCcbSettings()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                 <el-form-item label="商户代号" prop="merchantId" >
                    <el-input v-model.trim="ruleForm.merchantId" placeholder="请输入商户代号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                <el-form-item label="分行代号" prop="branchId">
                    <el-input v-model.trim="ruleForm.branchId" placeholder="请输入分行代号" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                 <el-form-item label="证书密码" prop="certPasswd">
                    <el-input v-model.trim="ruleForm.certPasswd" placeholder="请输入证书密码" :maxlength="50" :disabled="istrue" show-password></el-input>
                </el-form-item>
                 <el-form-item label="操作员" prop="operId">
                    <el-input v-model.trim="ruleForm.operId" placeholder="请输入操作员" :maxlength="50" :disabled="istrue"></el-input>
                </el-form-item>
                <el-form-item label="操作员交易密码" prop="operPasswd" >
                    <el-input v-model.trim="ruleForm.operPasswd" placeholder="请输入操作员交易密码" :maxlength="50" :disabled="istrue" show-password ></el-input>
                </el-form-item>
                 <el-form-item label="短信验证码" prop="smsCode" v-if="!istrue">
                    <el-input v-model.trim="ruleForm.smsCode" placeholder="请输入验证码" :maxlength="15"></el-input>
                    <el-button type="primary" @click="queryVerificationCodes()">获取验证码</el-button>
                </el-form-item>               
                <el-form-item label="证书">
                      <div class="uploader-box" v-if="istrue"></div>
                      <uploader pathPrefix="shoufei" module="shoufei" moduleCode="" useSysBucket :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                </el-form-item>               
                 <el-form-item label="支付方式"  prop="type">
                      <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox label="龙支付" name="type" :disabled="istrue"></el-checkbox>
                        <el-checkbox label="微信支付" name="type" :disabled="istrue"></el-checkbox>
                        <el-checkbox label="银联支付" name="type" :disabled="istrue"></el-checkbox>
                    </el-checkbox-group>
                 </el-form-item>
            </el-form>  
            <div class="list-box" v-if="istrue">
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
                         <el-button type="text" size="small" @click.native.prevent="deleteCcbPoss(scope.row.id)" class="buttontextred">删除</el-button>
                         <el-button type="text" size="small" @click.native.prevent="feerelationship(1,scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>    
            <el-dialog title="收费关系"   :visible.sync="mydialogVisibleone" width="60%">
            <el-form :model="tworuleForm" :rules="tworule" ref="tworuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="柜台代码" prop="posId" >
                    <el-input v-model.trim="tworuleForm.posId" placeholder="请输入柜台代码" :maxlength="50" ></el-input>
                </el-form-item>
                <el-form-item label="公钥" prop="pub" >
                    <el-input v-model.trim="tworuleForm.pub" placeholder="请输入公钥后30位" :maxlength="50" ></el-input>
                </el-form-item>
                <el-form-item label="收费类型" prop="idlist" >
                        <el-select v-model="tworuleForm.idlist" multiple placeholder="请选择收费类型">
                        <el-option v-for="item in typelist" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="mydialogVisibleone = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('tworuleForm')">确 定</el-button>
            </span>
        </el-dialog> 
     </div>
</div> 
</template>
<script>
import {
  updateCcbSetting,
  queryVerificationCode,
  queryCcbSetting,
  deleteCcbPos,
  queryCcbPosList,
  queryCcbPosTypeNoUsedList,
  updateCcbPos,
  insertCcbPos
} from "@/api/newcharge";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        branchId: "", //	分行代码	string
        certPasswd: "", //	证书密码	string
        certPath: "", //	证书路径	string
        merchantId: "", //	商户代号	string
        operId: "", //	操作员	string
        operPasswd: "", //	操作员密码	string
        smsCode: "", //	验证码	string
        type: [],
        bankPayType: "", //	龙支付	string	0 未选 1选中
        unionPayType: "", //	银联支付	string	0 未选 1选中
        wxPayType: "", //	微信支付	string	0 未选 1选中
        id: this.$route.query.id
      },
      tworuleForm: {
        ccbId: this.$route.query.id, //	建行商户主键	number
        posId: "", //	柜台号	string
        pub: "", //	公钥	string
        typeIds: "", //	收费类型id集合	string	多个,分割
        typeNames: "", //	收费类型名称集合	string	多个,分割
        idlist: []
      },
      allFileTypeList: ["pfx"],
      istrue: true,
      fileJson: [],
      rules: {
        appId: [
          { required: true, message: "请输入商户appid", trigger: "blur" }
        ],
        merId: [{ required: true, message: "请输入商户号", trigger: "blur" }],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个支付方式",
            trigger: "change"
          }
        ]
      },
      loading: false,
      dataList: [],
      mydialogVisibleone: false,
      isadd: 0,
      typelist: [],
      tworule: {
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
      }
    };
  },
  mixins: [mixin],
  components: { Uploader },
  created() {
    this.queryCcbSettings();
    this.queryCcbPosLists();
  },
  methods: {
    //删除
    deleteCcbPoss(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCcbPos(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryCcbPosLists();
            })
            .catch();
        })
        .catch(() => {});
    },
    //编辑新增
    submitForm(formName) {
      let $this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          $this.tworuleForm.typeIds = "";
          $this.tworuleForm.typeNames = "";
          for (let i = 0; i < $this.tworuleForm.idlist.length; i++) {
            if (i == $this.tworuleForm.idlist.length - 1) {
              $this.tworuleForm.typeIds += $this.tworuleForm.idlist[i];
            } else {
              $this.tworuleForm.typeIds += $this.tworuleForm.idlist[i] + ",";
            }
            for (let j = 0; j < $this.typelist.length; j++) {
              if ($this.tworuleForm.idlist[i] == $this.typelist[j].typeId) {
                if (i == $this.tworuleForm.idlist.length - 1) {
                  $this.tworuleForm.typeNames += $this.typelist[j].typeName;
                } else {
                  $this.tworuleForm.typeNames +=
                    $this.typelist[j].typeName + ",";
                }
              }
            }
          }
          if ($this.isadd == 0) {
            insertCcbPos($this.tworuleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "新增成功!"
                  });
                  $this.tworuleForm.posId = "";
                  $this.tworuleForm.pub = "";
                  $this.tworuleForm.id = "";
                  $this.tworuleForm.idlist = [];
                  this.queryCcbPosLists();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          } else {
            updateCcbPos($this.tworuleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  $this.tworuleForm.posId = "";
                  $this.tworuleForm.pub = "";
                  $this.tworuleForm.id = "";
                  $this.tworuleForm.idlist = [];
                  this.queryCcbPosLists();
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
    queryCcbPosLists() {
      queryCcbPosList(this.$route.query.id)
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
      $this.tworuleForm.posId = "";
      $this.tworuleForm.pub = "";
      $this.tworuleForm.id = "";
      $this.tworuleForm.idlist = [];
      if (obj) {
        $this.tworuleForm.posId = obj.posId;
        $this.tworuleForm.pub = obj.pub;
        $this.tworuleForm.id = obj.id;
        for (let i = 0; i < obj.typeList.length; i++) {
          $this.tworuleForm.idlist.push(obj.typeList[i].typeId);
        }
        list = obj.typeList;
      }
      queryCcbPosTypeNoUsedList(this.$route.query.id)
        .then(res => {
          if (res.data.code === 200) {
            this.typelist = res.data.data.concat(list);
          }
        })
        .catch(function() {});
    },
    //获取详情
    queryCcbSettings() {
      queryCcbSetting(this.$route.query.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.ruleForm.branchId = mydata.branchId;
          this.ruleForm.certPasswd = mydata.certPasswd;
          this.ruleForm.merchantId = mydata.merchantId;
          this.ruleForm.operId = mydata.operId;
          this.ruleForm.operPasswd = mydata.operPasswd;
          this.ruleForm.merId = mydata.merId;
          this.ruleForm.merId = mydata.merId;
          this.ruleForm.merId = mydata.merId;
          if (mydata.wxPayType == 1) {
            this.ruleForm.type.push("微信支付");
          }
          if (mydata.bankPayType == 1) {
            this.ruleForm.type.push("龙支付");
          }
          if (mydata.unionPayType == 1) {
            this.ruleForm.type.push("银联支付");
          }
          this.fileJson = [
            {
              fileName: "证书",
              fileUrl: mydata.certPath
            }
          ];
        });
    },
    queryVerificationCodes() {
      queryVerificationCode("ccb")
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
    updateCcbSettings() {
      if (this.fileJson.length == 0) {
        this.$message({
          type: "warning",
          message: "请上传证书！"
        });
        return;
      } else {
        this.ruleForm.certPath = this.fileJson[0].fileUrl;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.ruleForm.bankPayType = 0;
          this.ruleForm.unionPayType = 0;
          this.ruleForm.wxPayType = 0;
          for (let i = 0; i < this.ruleForm.type.length; i++) {
            if (this.ruleForm.type[i] == "龙支付") {
              this.ruleForm.bankPayType = 1;
            }
            if (this.ruleForm.type[i] == "银联支付") {
              this.ruleForm.unionPayType = 1;
            }
            if (this.ruleForm.type[i] == "微信支付") {
              this.ruleForm.wxPayType = 1;
            }
          }
          updateCcbSetting(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "编辑成功！",
                  type: "success",
                  duration: 1000
                });
                this.istrue = true;
                this.ruleForm.smsCode = "";
              } else {
                this.$message({
                  type: "error",
                  message: data.msg
                });
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.newchargesetupeidtjh {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .el-form {
      padding-top: 20px;
      width: 810px;
      margin: 0 auto;
      .el-input {
        width: 80%;
      }
      .uploader-box {
        position: absolute;
        width: 100%;
        height: 50px;
      }
    }
    .list-box {
      width: 810px;
      margin: 0 auto;
    }
  }
}
</style>
