<template>
  <div class="homeVisitadd" v-loading="loading">
    <div class="header" v-if="isMain==1">
      <el-button type="primary" size="medium" @click="groupingsettingsadd()">新增</el-button>
    </div>
    <div class="body ">
      <div class="group_list" :style="`height: ${scopeType==1?maxH-30:notopmaxH-30}px;`">
        <div class="group_item" :key="index" v-for="(item, index) in dataList">
          <div class="group_title">
            {{item.groupName}}
            <i class="el-icon-edit" @click="groupingsettingseidt(item.id)"></i>
            <i class="el-icon-delete" @click="delActivityGroupByGroupIds(item.id)"></i>
          </div>
          <div class="group_user">成员：<span>{{funname(item.groupStuList)}}</span></div>
          <div class="group_work_box">
            <div class="group_work_title">小组作品<i class="el-icon-plus" @click="addWork(item)">
              <uploader pathPrefix="zongheshijianpingjia" module="zongheshijianpingjia" moduleCode="20220418" :multiple="true" :extList="allFileTypeList"
                        v-model="fileList" style="opacity: 0;position: absolute;top: 0;left: 0;" @input="changePic"></uploader>
            </i></div>
            <div class="work_list clearfix">
              <div class="work_item" :key="workItem.id" v-for="workItem in item.groupOpusList">
                <el-image class="pic_box" :src="workItem.opusUrl" :preview-src-list="[workItem.opusUrl]" fit="cover" v-if="workItem.opusType===1"></el-image>
                <video :src="workItem.opusUrl" v-else-if="workItem.opusType===2" controls></video>
              </div>
            </div>
          </div>
        </div>
        <div class="no_data_msg" v-if="!dataList || !dataList.length">暂无分组</div>
      </div>
    </div>
  </div>
</template>
<script>
  import mixin from "@/mixins/windowResize";
  import RangeList from "@/components/RangeList/RangeList";
  import {
    delActivityGroupByGroupId,
    getThActivityGroupList,
    getPracticeActivityInfoById,
    addPracticeActivityGroupOpusList
  } from "@/api/comprehensivepractice";
  import Uploader from '@/components/Uploader/WebUploader';

  export default {
    data() {
      return {
        allFileTypeList: ['png', 'jpg', 'mp4'],
        fileList: [],
        dataList: [],
        scopeType: "",
        groupId: '',
        activityId: this.$route.query.id,
        opusType: 1,
        opusUrl: '',
        isMain: this.$route.query.isMain
      };
    },
    components: {RangeList, Uploader},
    mixins: [mixin],
    created() {
      getPracticeActivityInfoById(this.$route.query.id).then(res => res.data).then(data => {
        let mydata = data.data;
        this.scopeType = mydata.scopeType;
      })
      this.getActivityGroupListByActivityIds();
    },
    methods: {
      addWork(val) {
        this.groupId = val.id;
      },
      changePic(val) {
        if (this.groupId && val && val.length) {
          if (val[0].fileUrl.indexOf('.mp4') > -1) {
            this.opusType = 2;
          } else {
            this.opusType = 1;
          }
          this.opusUrl = val[0].fileUrl;
          let query = {
            groupId: this.groupId,
            activityId: this.activityId,
            opusType: this.opusType,
            opusUrl: this.opusUrl
          };

          this.addPracticeActivityGroupOpusList([query]);
        }
      },
      addPracticeActivityGroupOpusList(query) {
        addPracticeActivityGroupOpusList(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({
              message: "添加成功！",
              type: "success"
            });
            this.fileList = [];
            this.getActivityGroupListByActivityIds();
          }
        })
      },
      funname(list) {
        let name = "";
        for (let i = 0; i < list.length; i++) {
          name = name + " " + list[i].stuName + " "
        }
        return name;
      },
      getActivityGroupListByActivityIds() {
        getThActivityGroupList(this.$route.query.id).then(res => res.data).then(data => {
          this.dataList = data.data;
        })
      },
      delActivityGroupByGroupIds(id) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delActivityGroupByGroupId(id).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getActivityGroupListByActivityIds()
            }
          })

        }).catch(() => {
        });
      },
      groupingsettingseidt(id) {
        this.$router.push({
          path: "thcomprehensivepracticetwoeidt",
          query: {id: id, activityId: this.$route.query.id}
        })
      },
      groupingsettingsadd() {
        this.$router.push({
          path: "thcomprehensivepracticetwoadd",
          query: {activityId: this.$route.query.id}
        })
      },

    }
  };
</script>

<style>
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0
  }

  .clearfix {
    zoom: 1;
  }

</style>
<style lang="scss" scoped>
  .homeVisitadd {
    padding: 12px;

    .header {
      padding-bottom: 10px;
    }

    .body {
      .group_list{
        overflow: hidden auto;
        .group_item{
          color: #333;
          font-size: 15px;
          font-weight: bold;
          overflow: hidden;
          .group_title{
            height: 15px;
            line-height: 15px;
            margin: 10px 0;
            padding-left: 5px;
            border-left: 3px solid #409eff;
            i{
              color: #409eff;
              font-weight: bold;
              margin-left: 8px;
              cursor: pointer;
            }
            .el-icon-delete{
              color: #F56C6C;
            }
          }
          .group_user{
            line-height: 20px;
            font-size: 15px;
            margin-bottom: 10px;
            span{
              font-weight: normal;
              color: #666;
            }
          }
          .group_work_box{
            margin-bottom: 5px;
            .group_work_title{
              i{
                width: 19px;
                height: 19px;
                margin-left: 5px;
                overflow: hidden;
                color: #409eff;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                position: relative;
                top: 5px;
              }
            }
            .work_list{
              padding-top: 10px;
              .work_item{
                float: left;
                width: 160px;
                height: 120px;
                margin-right: 10px;
                margin-bottom: 10px;
                border: 1px solid #efefef;
                .pic_box{
                  width: 100%;
                  height: 100%;
                }
                video{
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }

        .no_data_msg{
          height: 60px;
          line-height: 60px;
          font-size: 16px;
          color: #666;
          text-align: center;
        }
      }
    }

  }
</style>
