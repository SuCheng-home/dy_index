<template>
  <div class="school_mate_apply_set_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click="saveApplySet">保存</el-button>
    </div>
    <div class="school_mate_apply_set_box" :style="`height: ${boxH - 200}px;`">
      <div class="school_mate_inner_box">
        <div class="code_title">
          <span>审核设置</span>
        </div>
        <div class="code_list">
          <el-checkbox v-model="isNeedCheck">需要审核</el-checkbox>
        </div>
        <div class="code_title">
          <span>首页图片</span>
        </div>
        <div class="code_list">
          <el-checkbox v-model="isNeedHomePic">需要首页</el-checkbox>
        </div>
        <div class="code_list" v-if="isNeedHomePic">
          <uploader pathPrefix="xiaoyouguanli" module="xiaoyouguanli" moduleCode="20201126" :multiple="false" v-model="homePic" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                    :isDeleteCosUrl="isDeleteCosUrl" showMode="image" showResult="image" @delete="changeCosFlag"></uploader>
        </div>

        <div class="code_title">
          <span>校友申请二维码</span>
        </div>
        <div class="code_list">
          <img :src="applySetInfo.wxqrcode" alt="" v-if="!!applySetInfo.wxqrcode">
          <span v-else>暂无二维码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import Uploader from '@/components/Uploader/WebUploader';
  import {getConfigInfo, updateConfig} from '@/api/schoolMate';

  export default {
    name: "schoolMateApplySet",
    components: {
      Uploader
    },
    data() {
      return {
        isDeleteCosUrl: false,
        listLoading: false,
        isNeedCheck: false,
        isNeedHomePic: false,
        applySetInfo: {},
        homePic: [{
          fileUrl: 'https://cdnfile-10043692.file.myqcloud.com/mobile/images/others/schoolmate_normal_pic.png'
        }]
      }
    },
    mixins: [mixins],
    created() {
      this.getConfigInfo()
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      changeCosFlag() {
        this.isDeleteCosUrl = true;
      },
      getConfigInfo() {
        getConfigInfo().then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.applySetInfo = data;
            this.isNeedCheck = data.isNeedCheck === 1;
            this.isNeedHomePic = !!data.homePagePic;
            if (data.homePagePic) {
              this.homePic = [{
                fileUrl: data.homePagePic
              }]
            }
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      },
      saveApplySet() {
        if (this.isNeedHomePic && !this.homePic.length) {
          this.$message.warning('请上传首页图片');
          return;
        }
        let query = {
          id: this.applySetInfo.id,
          isNeedCheck: this.isNeedCheck ? 1 : 2,
          homePagePic: this.isNeedHomePic ? this.homePic[0].fileUrl : '',
          schoolId: this.$store.getters.schoolInfo.id,
          wxqrcode: this.applySetInfo.wxqrcode
        };
        this.updateConfig(query);
      },
      updateConfig(query) {
        if (this.listLoading) {
          return;
        }
        this.listLoading = true;
        updateConfig(query).then(res => {
          if (res.data.code === 200) {
            this.$message.success('保存成功');
            this.listLoading = false;
            this.goBack();
          } else {
            this.$message.warning(res.data.msg);
            this.listLoading = false;
          }
        })
      }
    }
  }
</script>

<style>
  .school_mate_apply_set_wrap .upload-block-container .upload-file-item{
    height: 85px;
  }
</style>
<style lang="scss" scoped>
  .school_mate_apply_set_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .school_mate_apply_set_box {
      overflow-x: hidden;
      overflow-y: auto;

      .school_mate_inner_box{
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
          img{
            display: block;
            width: 240px;
            height: 240px;
            border: 1px solid #f8f8f8;
          }
          span{
            margin-left: 20px;
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
</style>
