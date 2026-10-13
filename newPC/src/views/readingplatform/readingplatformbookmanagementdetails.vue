<template>
  <div class="book_intro_wrap">
     <div class="header">
        <el-button  size="medium" @click="goBack">返回</el-button>
        <el-button type="primary" size="medium" @click="jumpTo('readingplatformbookmanagementeidt',{id:id})">编辑</el-button>
        <el-button type="primary" size="medium" @click="jumpTo('readingplatformsubjectlist',{id:id})">本书阅读任务</el-button>
    </div>
    <div class="book_intro_box" :style="`height: ${nobottommaxH}px;`">
      <div class="book_title_box">
        <div class="book_img">
          <img :src="bookInfo.coverUrl" alt="">
        </div>
        <a :href="bookInfo.bookQRCodeUrl" v-if="bookInfo.bookQRCodeUrl" target="_Blank" class="aimg">
            <img :src="bookInfo.bookQRCodeUrl" alt="">
        </a>
        <div class="book_title">
          <div class="title">{{bookInfo.boolName}}</div>
          <div>书籍类别：{{bookInfo.typeName}}</div>
          <div>书籍库存：{{bookInfo.inventory}}</div>
          <div v-if="bookInfo.taskRemark">任务说明：{{bookInfo.taskRemark}}</div>
        </div>
      </div>
      <div class="book_remark_box">
            <image-previewer tag="richtext" :images="pics" viewclass="pic-item">
               <div v-html="bookInfo.introduce"></div>
            </image-previewer>       
        <file-list :isShowTitle="false" :fileList="bookInfo.playWordBookFileList"></file-list>
      </div>
    </div>   
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getReadPlatBookById} from '@/api/readingplatform';
  import FileList from '@/components/FileList/FileList';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  export default {
       components: {
            FileList,
            ImagePreviewer
        },
    data() {
      return {
        id: this.$route.query.id,
        bookInfo: {}
      }
    },
    mixins: [mixins],
    created() {
      this.getReadPlatBookByIds();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
      getReadPlatBookByIds() {
        getReadPlatBookById(this.id).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.bookInfo = data;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .book_intro_wrap {
    padding:12px;
    .header {
      padding-bottom:10px;
      border-bottom: 1px solid #eee;
    }

    .book_intro_box {
      overflow-x: hidden;
      overflow-y: auto;

      .book_title_box {
        display: flex;
        max-width: 1000px;
        margin: 20px auto;
        position: relative;
        .aimg{
            right: 10px;
            top:10px;
            position: absolute;
            img{
                width: 70px;
            }
        }
        .book_img {
          width: 140px;
          height: 200px;
          margin-right: 20px;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .book_title {
          flex: 1;
          line-height: 40px;
          color: #666;

          .title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
        }
      }

      .book_remark_box {
        max-width: 1000px;
        margin: 20px auto;
        overflow: hidden;
      }
    }
  }
</style>
