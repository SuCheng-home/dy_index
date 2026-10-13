<template>
  <div class="beautiful_english_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="toArticleEdit" v-show="isShowByPermission('/beautifulEnglish/initTree')">编辑</el-button>
    </div>
    <div class="beautiful_english_add_box" :style="`height: ${nobottommaxH}px;`">
      <div class="beautiful_english_box">
        <div class="reaction_box">
          <div class="reaction_title">
            <span>{{articleInfo.className}}</span>
            <span>{{articleInfo.stuName}}</span>
            <span>{{articleInfo.createDate}}</span>
          </div>
          <div class="reaction_remark">
            <div v-html="articleInfo.content"></div>
          </div>
          <div v-show="articleInfo.fileList && articleInfo.fileList.length">
            <file-list :fileList="articleInfo.fileList"></file-list>
          </div>
        </div>
        <div class="article_good_box">
          <i @click="isGreatArticle('add')" v-if="!isGreat" class="fa fa-thumbs-o-up" aria-hidden="true">&nbsp;{{articleInfo.greatCount}}</i>
          <i @click="isGreatArticle('delete')" v-else class="fa fa-thumbs-up select_good_icon" aria-hidden="true">&nbsp;{{articleInfo.greatCount}}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {isShowByPermission} from "@/utils";
  import FileList from '@/components/FileList/FileList.vue';
  import {getArticleById, isGreatArticle} from '@/api/beautifulEnglish';

  export default {
    name: "beautifulEnglishInfo",
    components: {
      FileList
    },
    data() {
      return {
        isGreat: false,
        articleId: this.$route.query.articleId,
        articleInfo: {}
      }
    },
    mixins: [mixins],
    created() {
      this.getArticleById();
    },
    methods: {
      isShowByPermission,
      goBack() {
        this.$router.back();
      },
      toArticleEdit() {
        this.$router.push({
          path: 'add',
          query: {articleId: this.articleInfo.id}
        })
      },
      getArticleById() {
        getArticleById({id: this.articleId}).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.articleInfo = data;
            this.isGreat = data.whetherGreat;
          }
        });
      },
      isGreatArticle(type) {
        isGreatArticle({
          recordId: this.articleId
        }).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            if (type === 'add') {
              this.$message.success('点赞成功');
              this.articleInfo.greatCount += 1;
              this.isGreat = true;
            } else {
              this.$message.success('取消成功');
              this.articleInfo.greatCount -= 1;
              this.isGreat = false;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .beautiful_english_add_wrap {
 padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .beautiful_english_add_box {
      padding-top: 20px;
      overflow-x: hidden;
      overflow-y: auto;

      .beautiful_english_box {
        width: 820px;
        margin: 0 auto;
        .reaction_box {
          padding: 10px 0;

          .reaction_title {
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
            color: #333;

            span {
              margin-right: 8px;
            }
          }

          .reaction_remark {
            color: #666;
          }
        }

        .article_good_box{
          margin-top: 10px;
          border-top: 1px solid #eee;
          i{
            margin-top: 5px;
            margin-left: 5px;
            padding-top: 5px;
            color: #666;
            cursor: pointer;
          }
          .select_good_icon{
            color: #F56C6C;
          }
        }
      }
    }
  }
</style>
