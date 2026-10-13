<template>
  <div class="reaction_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="saveReaction" :loading="!canSaveReaction">保存</el-button>
    </div>
    <div class="reaction_add_box" :style="`height: ${maxH+40}px;`">
      <div class="reaction_box">
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="学生姓名" class="is-require">
            <address-book v-model="addressData" :config="configData"></address-book>
          </el-form-item>
          <el-form-item>
            <div slot="label">附件</div>
            <uploader pathPrefix="yuwenshuku" module="yuwenshuku" moduleCode="202009082" :multiple="false" :extList="allFileTypeList" v-model="fileJson" ></uploader>
          </el-form-item>
          <el-form-item>
            <div slot="label">读后感</div>
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
  import {addLanguageBookReaction, updateLanguageBookReaction, getLanguageBookReaction} from '@/api/stackRoom';

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
        reactionId: this.$route.query.reactionId,
        canSaveReaction: true,
        configData: {
          title: '请选择学生',
          depart: {target: 'user', departType: 's', userTypes: '2'},
          SingleChose: true
        },
        addressData: {
          userJson: []
        },
        fileJson:[],
        allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
        content: '',
        isEssence:2
      }
    },
    mixins: [mixins],
    created() {
      if (this.reactionId) {
        this.getLanguageBookReaction();
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getLanguageBookReaction() {
        getLanguageBookReaction({reactionId: this.reactionId}).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
              this.content=data.content;
            this.$refs.ueditor.setContent(data.content);
            this.fileJson = JSON.parse(data.fileJson);
            this.isEssence=data.isEssence;
            this.addressData = {
              userJson: [{
                id: data.studentId,
                name: data.studentName,
                avatar: 'https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_default_head.jpg'
              }]
            };
            let self = this;
            setTimeout(() => {
              self.$refs.ueditor.setContent(data.content);
            }, 300)
          }
        });
      },
      saveReaction() {
        if (!this.addressData.userJson.length) {
          this.$message.error('选择学生');
          return;
        }
        if (!this.fileJson.length && !this.content) {
          this.$message.error('请上传附件或添加读后感内容');
          return;
        }
        let query = {
          bookId: Number(this.bookId),
          content: this.$refs.ueditor.getContent(),
          fileJson: this.fileJson,
          studentId: this.addressData.userJson[0].id,
          studentName: this.addressData.userJson[0].name,
          isEssence:this.isEssence
        };

        if (this.reactionId) {
          query.id = this.reactionId;
          this.updateLanguageBookReaction(query);
        } else {
          this.addLanguageBookReaction(query);
        }
      },
      addLanguageBookReaction(query) {
        this.canSaveReaction = false;
        addLanguageBookReaction(query).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('保存成功');
            this.$router.back();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.canSaveReaction = true;
        });
      },
      updateLanguageBookReaction(query) {
        this.canSaveReaction = false;
        updateLanguageBookReaction(query).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('保存成功');
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
