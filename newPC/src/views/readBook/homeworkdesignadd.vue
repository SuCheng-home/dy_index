<template>
  <div class="reaction_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="saveReaction" :loading="!canSaveReaction">保存</el-button>
    </div>
    <div class="reaction_add_box" :style="`height: ${nobottommaxH}px;`">
      <div class="reaction_box">
        <el-form label-width="100px" class="demo-ruleForm" >
           <el-form-item label="设计主题" class="is-required" > 
                <el-input  v-model.trim="title" :maxlength="100"  placeholder="请输入主题"></el-input>
          </el-form-item>
          <el-form-item label="设计老师" class="is-required">
            <address-book v-model="addressData" :config="configData"></address-book>
          </el-form-item>
          <el-form-item>
            <div slot="label">设计附件</div>
            <uploader pathPrefix="yuwenshuku" module="yuwenshuku" moduleCode="202009082" :multiple="false" :extList="allFileTypeList" v-model="fileJson" ></uploader>
          </el-form-item>
          <el-form-item>
            <div slot="label">作业设计</div>
          </el-form-item>
          <el-form-item label-width="40px">
            <ueditor class="rich-editor" ref="ueditor" :defaultMes="content" @editModel="richTextEditHandler"></ueditor>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import Ueditor from "@/components/Ueditor";
  import Uploader from '@/components/Uploader/WebUploader';
  import {addLanguageBookHomework, updateLanguageBookHomework, getLanguageBookHomework} from '@/api/stackRoom';

  export default {
    name: "stackRoomReactionAdd",
    components: {
      AddressBook,
      Ueditor,
      Uploader
    },
    data() {
      return {
        bookId: this.$route.query.bookId,
        homeworkId: this.$route.query.homeworkId,
        canSaveReaction: true,
        configData: {
          title: '请选择老师',
          depart: {target: 'user', departType: 't', userTypes: '1'},
           SingleChose: true
        },
        addressData: {
          userJson: []
        },
        fileJson:[],
        allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
        content: '',
        state:2,
        title:''
      }
    },
    mixins: [mixins],
    created() {
      if (this.homeworkId) {
        this.getLanguageBookHomework();
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getLanguageBookHomework() {
        getLanguageBookHomework(this.homeworkId).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
              this.content=data.content;
            this.$refs.ueditor.setContent(data.content);
            this.fileJson = JSON.parse(data.fileJson);
            this.title=data.title;
            this.state=data.state;            
            this.addressData = {
              userJson:JSON.parse(data.thJson)
            };
            let self = this;
            setTimeout(() => {
              self.$refs.ueditor.setContent(data.content);
            }, 300)
          }
        });
      },
      saveReaction() {
          if (!this.title) {
          this.$message.error('请输入设计主题');
          return;
        }
        if (!this.addressData.userJson.length) {
          this.$message.error('选择设计老师');
          return;
        }
        if (!this.fileJson.length && !this.content) {
          this.$message.error('请上传附件或添加设计内容');
          return;
        }
        let query = {
          bookId:this.bookId,
          content: this.$refs.ueditor.getContent(),
          fileJson: this.fileJson,
          title:this.title,
          thJson: this.addressData.userJson,
          state:this.state
        };

        if (this.homeworkId) {
          query.id = this.homeworkId;
          this.updateLanguageBookHomework(query);
        } else {
          this.addLanguageBookHomework(query);
        }
      },
      addLanguageBookHomework(query) {
        this.canSaveReaction = false;
        addLanguageBookHomework(query).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('上传成功');
            this.$router.back();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.canSaveReaction = true;
        });
      },
      updateLanguageBookHomework(query) {
        this.canSaveReaction = false;
        updateLanguageBookHomework(query).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('编辑成功');
            this.$router.back();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.canSaveReaction = true;
        });
      },
      richTextEditHandler(content) {
        this.content = content;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .reaction_add_wrap {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .reaction_add_box {
      padding-top: 20px;
      overflow-x: hidden;
      overflow-y: auto;
      .reaction_box{

        width: 820px;
        margin: 0 auto;
      }
    }
  }
</style>
