<template>
  <div class="task_info_show_wrap">
    <div class="clock_user_box" :style="`height: ${maxH-20}px;`">
      <div class="user_card_task_wrap" v-if="listData && listData.length">
        <div class="user_task_info_box" :key="taskIndex" v-for="(taskItem, taskIndex) in listData">
          <div class="user_header_info">
            <div class="user_avatar">
              <img :src="taskItem.avatar" alt="">
            </div>
            <div class="user_name">
              <div>{{taskItem.userName}}&nbsp;&nbsp;{{taskItem.classDepartName}}</div>
              <div class="task_date">{{taskItem.createTime | timeFilter}}</div>
            </div>
            <div class="score_input_box" v-if="isCard===2">
              <div class="score_text">评分</div>
              <el-input-number v-model="taskItem.batchScore" size="mini" :step="0.1" :min="0.1" :max="cardScore" step-strictly @change="changeScore(taskItem)"></el-input-number>
            </div>
          </div>
          <div class="user_task_content">{{taskItem.content}}</div>

          <div class="topic_box" :key="index" v-for="(item, index) in taskItem.topicList">
            <div class="topic_title">{{index+1}}.{{item.topicTitle}}</div>
            <div class="topic_content">
              <div class="tip_input" v-if="item.topType===5">{{item.topicAnswer}}</div>
              <div class="tip_radio" v-else-if="item.topType === 1 || item.topType === 2">
                <div class="radio_item" :key="checkIndex" v-for="(checkItem, checkIndex) in item.optionList" v-show="checkItem.isSelected">{{radioList[checkItem.optionSeq]}}.{{checkItem.optionTitle}}</div>
              </div>
              <div class="tip_upload" v-else-if="item.topType === 11">
<!--                <image-previewer tag="richtext">-->
<!--                  <div class="clearfix">-->
<!--                    <el-image class="img_block" :src="picItem.split('&')[0]" fit="cover" v-for="(picItem, picIndex) in JSON.parse(item.topicAnswer)" :key="picIndex"></el-image>-->
<!--                  </div>-->
<!--                </image-previewer>-->
                <image-previewer tag="richtext">
                  <div class="pic" v-for="(picItem, picIndex) in JSON.parse(item.topicAnswer)" :key="picIndex">
                    <img :src="picItem.split('&')[0]" alt="" style="width:100%;height: 100%;"/>
                    <div class="mark_entry" @click="showWordBox(picItem.split('&'))" v-if="picItem && picItem.split('&') && picItem.split('&').length > 1">
                      <i class="el-icon-edit"></i>查看批注
                    </div>
                    <div class="mark_entry" @click="showComment(picItem.split('&')[0], picIndex, JSON.parse(item.topicAnswer), item, taskItem)" v-else>
                      <i class="el-icon-edit"></i>红笔点评
                    </div>
                  </div>
                </image-previewer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <default-page Mes="暂无数据" v-else></default-page>
    </div>
    <div class="pagination-container" style="text-align: right;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo" :page-sizes="[20, 30, 50, 100]"
                     :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
    <comment ref="commentBox" @success="successComment"></comment>
    <dialog-show :show="showDialogBox" :pic-list="wordPicList" @close="showDialogBox=false"></dialog-show>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import DefaultPage from '@/components/DefaultPage';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  import {getEcardUserDateList, batchEcardUserDate, updateEcardUserSelected} from '@/api/eClock';
  import Comment from "@/components/Comment"
  import DialogShow from "./DialogShow"

  export default {
    name: "card-clock",
    components: {DefaultPage, ImagePreviewer, Comment, DialogShow},
    props: {
      cardDate: {
        type: [String, Number],
        default: ''
      },
      cardId: {
        type: [String, Number],
        default: ''
      },
      cardScore: {
        type: [String, Number],
        default: ''
      },
      isCard: {
        type: [String, Number],
        default: '2'
      }
    },
    mixins: [mixin],
    data() {
      return {
        showDialogBox: false,
        loading: false,
        finishLoad: false,
        radioList: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
        listData: [],
        listQuery: {
          state: 2,
          pageNo: 1,
          pageSize: 20,
          userName: ''
        },
        total: null,
        topicIndex: 0,
        topicList: [],
        baseInfo: {},
        wordPicList: []
      }
    },
    filters: {
      timeFilter(date) {
        return date ? date.substring(0, 16) : date;
      }
    },
    created() {
      this.getList();
    },
    methods: {
      showWordBox(list) {
        this.showDialogBox = true;
        this.wordPicList = [{picUrl: list[0], markUrl: list[1]}];
        console.log(this.wordPicList);
      },
      showComment(picUrl, index, list, info, taskItem) {
        this.baseInfo = {
          cardDate: taskItem.cardDate,
          eCardId: taskItem.eCardId,
          topicId: info.id,
          userId: taskItem.userId,
        };
        this.topicIndex = index;
        this.topicList = list;
        this.$refs['commentBox'].showCommentBox(picUrl);
      },
      successComment(newUrl, oldUrl) {
        this.topicList[this.topicIndex] = oldUrl+'&'+newUrl;
        this.updateEcardUserSelected({...this.baseInfo, ...{topicAnswer: JSON.stringify(this.topicList)}});
      },
      updateEcardUserSelected(query) {
        updateEcardUserSelected(query).then(res => {
          const data = res.data;
          if (data.code === 200) {
            this.getList();
            this.$message({type: 'success', message: '批注成功'});
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      },
      changeScore(val) {
        if (val.batchScore && parseFloat(val.batchScore) > 0) {
          const query = {
            batchScore: val.batchScore,
            batchState: 2,
            cardDate: val.cardDate,
            eCardId: val.eCardId,
            sendUserType: val.sendUserType,
            userId: val.userId
          };
          this.batchEcardUserDate(query);
        }
      },
      batchEcardUserDate(query) {
        batchEcardUserDate(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({type: 'success', message: '评分成功'});
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      },
      initData(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.userName = val || '';
        this.listData = [];
        this.getList();
      },
      getList() {
        if (!this.cardDate || !this.cardId) {
          return;
        }
        getEcardUserDateList({
          ...{
            cardDate: this.cardDate,
            eCardId: this.cardId
          },
          ...this.listQuery
        }).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.listData = data.dataList.map(item => {
              if (!item.batchScore) {
                item.batchScore = undefined;
              }
              return item;
            });
            this.total = data.pagination.total;
          } else {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getList();
      }
    }
  }
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .task_info_show_wrap{
    position: relative;
    padding: 10px 15px;
    background-color: #fff;
    overflow: hidden;
    .clock_user_box{
      overflow-x: hidden;
      overflow-y: auto;
      .user_card_task_wrap{
        width: 750px;
        margin: 5px auto;
        padding: 15px;
        border: 1px solid #e7eaec;
        /*box-shadow: 0 15px 30px rgba(0,0,0,.1);*/
        .user_task_info_box{
          &+.user_task_info_box{
            padding-top: 10px;
            border-top: 1px solid #f8f8f8;
          }
          .user_header_info{
            display: flex;
            padding: 0 10px;
            line-height: 24px;
            margin-bottom: 12px;
            .user_avatar{
              width: 24px;
              height: 24px;
              margin-top: 9px;
              margin-right: 10px;
              overflow: hidden;
              border-radius: 50%;
              img{
                display: block;
                width: 100%;
                height: 100%;
              }
            }
            .user_name{
              flex: 1;
              font-size: 14px;
              color: #48A6FC;
              .task_date{
                line-height: 18px;
                font-size: 12px;
                color: #B0B0B0;
              }
            }
            .score_input_box{
              display: flex;
              width: 150px;
              height: 30px;
              line-height: 42px;
              padding: 6px 0;
              font-size: 12px;
              color: #B0B0B0;
              .score_text{
                width: 30px;
                line-height: 30px;
                margin-right: 5px;
              }
              .score_input{
                flex: 1;
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                background-color: #f8f8f8;
                border-radius: 3px;
              }
            }
          }
          .user_task_content{
            line-height: 18px;
            margin-bottom: 12px;
            padding: 0 10px;
            font-size: 14px;
            color: #333;
          }

          .topic_box{
            font-size: 14px;
            .topic_title{
              line-height: 20px;
              color: #333;
            }
            .topic_content{
              margin-left: 10px;
              line-height: 18px;
              color: #5F5F5F;
              .tip_radio{
                padding: 5px 0;
              }
              .tip_upload{
                padding: 10px 10px 0;
                overflow: hidden;
                .img_block{
                  width: 100px;
                  height: 100px;
                  float:left;
                  margin-right: 15px;
                  margin-bottom: 15px;
                }

                .pic {
                  float: left;
                  width: 200px;
                  height: 200px;
                  margin-right: 20px;
                  margin-bottom: 20px;
                  background-size: 100% 100%;
                  position: relative;
                  overflow: hidden;
                  .mark_entry{
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    height: 22px;
                    line-height: 22px;
                    padding: 0 5px;
                    font-size: 12px;
                    color: #fff;
                    background-color: rgba(0,0,0,.4);
                    border: 1px solid #fff;
                    border-radius: 10px;
                    overflow: hidden;
                    cursor: pointer;
                  }
                }
                &:after {
                  content: '';
                  display: table;
                  clear: both;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
