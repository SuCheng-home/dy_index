<template>
    <div
        id="area-setting"
        class="shortmessageTemplate"
    >
        <div class="second-header">
            <el-button
                type="default"
                @click="$router.back()"
                size="medium"
            >返回</el-button>
                <el-button
                    type="primary"
                    @click="addHandler()"
                    size="medium"
                >创建模板</el-button>
                <!-- <el-button type="primary" size="medium"  @click="poptxt=true">使用帮助</el-button> -->
        </div>
        <div
            class="body"
            :style="`height: ${maxH}px;`"
        >
            <div class="main-container">
                <div class="message-template-list">
                    <div
                        class="message-template-item"
                        v-for="templateItem in messageTemplateList"
                    >
                        <div class="message-template-item__inner">
                            <div class="tag-container">
                                <el-tag  size="mini" v-if="templateItem.statusCode == 1">待审核</el-tag>
                                <el-tag  size="mini"
                                    v-else-if="templateItem.statusCode == 0"
                                    type="success"
                                >已通过</el-tag>
                                    <el-tag  size="mini"
                                        v-else-if="templateItem.statusCode == -1"
                                        type="danger"
                                    >未通过</el-tag>
                            </div>
                            <h4 class="message-template-item__title">{{templateItem.title}}</h4>
                            <div class="message-template-item__content">{{templateItem.content}}</div>
                            <div class="message-template-item__footer">
                                <span
                                    class="edit-btn"
                                    v-if="templateItem.statusCode == 1 || templateItem.statusCode == -1"
                                    @click="editHandler(templateItem)"
                                >
                                    <i class="fa fa-edit"></i>
                                    </span>
                                    <span
                                        class="delete-btn"
                                        @click="deleteHandler(templateItem.id, templateItem.templateId)"
                                    >
                                        <i class="fa fa-trash"></i>
                                        </span>
                                        <span v-if="templateItem.statusCode == -1">
                                            <span
                                                class="link"
                                                @click="showFailMessage(templateItem.reviewReply)"
                                            >查看失败原因</span>
                                        </span>
                            </div>
                        </div>
                </div>
            </div>
            </div>
            </div>
            <el-dialog  :close-on-click-modal='false'   title="短信模板规范" :visible.sync="poptxt" width="800px">
                <div class="box-p"> 
                  <div>1、短信总长度（含签名和变量的实际取值）最长不超过500字，汉字、字母、数字、标点符号（不区分全角/半角）以及空格等都按1个字计算。</div>
                  <div>2、不支持【】，以免与签名混淆。</div>
                  <div>3、不支持￥、★以及通过按键录入的组合型特殊符号，例如^_^&、☞、✓、※等，以免引起短信出现乱码。</div>
                  <div>4、模板必须体现实际业务，除变量以外的文本内容必须可判断短信含义和使用场景。</div>
                  <div>5、禁止发送金融相关的所有内容（验证码、通知和营销短信）。</div>
                  <div>6、禁止发送违法违规相关内容。</div>
                  <div>7、禁止发送未经许可的邀请，主要指邀请注册、邀请成为会员等。</div>
                  <div>8、短信正文模板可以包含变量，用户可通过变量实现自定义短信内容。   变量格式  {数字}，从{1}、{2}开始顺序填写。</div>
                </div>
                <span   slot="footer" class="dialog-footer" >                    
                   <el-button size="medium" type="primary" @click="poptxt=false">关闭</el-button>
                </span>
             </el-dialog>
            <el-dialog
                @close="cancelHandler"
                :close-on-click-modal='false'
                title="短信"
                :visible.sync="isShowMessageDialog"
                width="600px"
            >
                <div>
                    <el-form
                        :model="formData"
                        label-width="78px"
                        :rules="formRules"
                        ref="form"
                    >
                        <el-form-item
                            label="模板名称"
                            prop="title"
                        >
                            <el-input
                                @blur.stop="blurInput('title')"
                                :maxlength="20"
                                style="width: 480px;"
                                v-model="formData.title"
                            ></el-input>
                                </el-form-item>
                                <el-form-item
                                    label="模板内容"
                                    prop="content"
                                >
                                    <el-input
                                        @blur.stop="blurInput('content')"
                                        :maxlength="500"
                                        type="textarea"
                                        style="width: 480px;"
                                        v-model="formData.content"
                                        :rows="3"
                                    ></el-input>
                                        </el-form-item>
                                        </el-form>
                </div>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button
                        size="medium"
                        @click="cancelHandler"
                    >取 消</el-button>
                        <el-button
                            size="medium"
                            type="primary"
                            @click="confirmHandler()"
                        >确 定</el-button>
                            </span>
                            </el-dialog>
                            </div>
</template>

<script>
import {
  queryTemplateBySchoolId,
  deleteTemplate,
  addTemplate,
  editTemplate
} from "@/api/shortmessage";
import mixins from "@/mixins/windowResize";

export default {
  name: "messageTemplateList",
  data() {
    return {
      isPrimary: window.location.href.indexOf("primary") !== -1,
      messageTemplateList: [],
      isShowMessageDialog: false,
      formData: {
        content: "",
        title: ""
      },
      formRules: {
        title: [
          {
            required: true,
            message: "模板名称不能为空",
            trigger: "blur"
          }
        ],
        content: [
          {
            required: true,
            message: "模板内容不能为空",
            trigger: "blur"
          }
        ]
      },
      mode: "add",
      editTemplateId: null,
      editId: null,
      poptxt:false,
    };
  },
  mixins: [mixins],
  mounted() {
    this.queryTemplateBySchoolIdFunc();
  },
  methods: {
    blurInput(key) {
      this.$set(this.formData, key, this.formData[key].trim());
    },
    addHandler() {
      // this.mode = "add";
      // this.isShowMessageDialog = true;
      this.$router.push({
        path: 'createTemplate'
      })
    },
    queryTemplateBySchoolIdFunc() {
      queryTemplateBySchoolId()
        .then(res => res.data)
        .then(data => {
          this.messageTemplateList = data.data;
        });
    },
    deleteHandler(id, templateId) {
      this.$confirm("是否确认删除?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTemplate({
          templateId: id,
          templateMessageId: templateId
        })
          .then(res => res.data)
          .then(data => {
            if (data.result) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.queryTemplateBySchoolIdFunc();
            } else {
              this.$alert(data.msg, "提示");
            }
          });
      });
    },
    editHandler({ content, title, id, templateId }) {
      this.$router.push({
        path: 'createTemplate',
        query: {
          templateId: id
        }
      })
      // this.formData = {
      //   content,
      //   title
      // };
      // this.mode = "edit";
      // this.editId = id;
      // this.editTemplateId = templateId;
      // this.isShowMessageDialog = true;
    },
    cancelHandler() {
      this.isShowMessageDialog = false;
      setTimeout(() => {
        this.formData = {
          content: "",
          title: ""
        };
      }, 300);
    },
    showFailMessage(message) {
      this.$alert(message, "未通过原因");
    },
    confirmHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          new Promise(resolve => {
            if (this.mode === "add") {
              addTemplate(this.formData)
                .then(res => res.data)
                .then(resolve);
            } else {
              const args = Object.assign({}, this.formData, {
                id: this.editId,
                templateId: this.editTemplateId
              });
              editTemplate(args)
                .then(res => res.data)
                .then(resolve);
            }
          }).then(data => {
            if (data.result) {
              this.$message({
                type: "success",
                message: `${this.mode === "add" ? "新增" : "编辑"}成功!`
              });
              this.isShowMessageDialog = false;
              this.queryTemplateBySchoolIdFunc();
              setTimeout(() => {
                this.formData = {
                  content: "",
                  title: ""
                };
              }, 300);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";

@include reset-global;
.shortmessageTemplate {
  padding:12px;
}
.body {
  overflow: auto;
}
.second-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.main-wrap {
  width: 100%;
}
.main-wrap--primary {
  width: 100%;
}

.box-p{
  color:#606266;
  line-height:20px;
  font-size:14px;
  div{
    padding:5px 0;
  }
}
.custom—scrollbar {
  overflow-x: hidden;
  overflow-y: auto;
}

.custom—scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

.custom—scrollbar::-webkit-scrollbar-thumb {
  background-color: #999;
}

.custom—scrollbar::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
.message-template-item {
  float: left;
  width: 325px;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 13px;  
  .message-template-item__inner {
    /*width: 80%;*/
    border-radius: 5px;
    height: 300px;
    background: #fff;
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    margin: 0 auto;
    border: 1px solid #ddd;
    /*box-shadow: 0 1px 2px #c5c5c5;*/
    &:hover {
      /*box-shadow: 1px 4px 10px 2px #CCC;*/
      transform: translateY(-1%);
      transition: all 0.4s;
    }
  }
  .message-template-item__title {
    font-size: 19px;
    font-weight: bold;
    line-height: 1.1;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    color: rgb(51, 51, 51);
    display: block;
  }
  .message-template-item__content {
    height: 200px;
    color: #303133;
    overflow-y: auto;
    line-height: 20px;
    font-size: 14px;
  }
  .message-template-item__footer {
    position: absolute;
    bottom: 3px;
  }
  .edit-btn {
    margin-right: 10px;
    color: #409eff;
    cursor: pointer;
  }
  .delete-btn {
    color: #f08080;
    cursor: pointer;
  }
}
.tag-container {
  position: absolute;
  right: 10px;
  top: 10px;
}
.fa {
  font-size: 18px;
}
.link {
  color: #409eff;
  cursor: pointer;
  margin-left: 10px;
}
</style>

