<template>
  <div class="guide_manager_set">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      {{currentWeek}}
      <import-file :config="importConf"></import-file>
      <el-button size="medium" type="primary" @click="syncFunc">复制到剩余周次</el-button>
    </div>
    <div class="week_list_box" :style="`height: ${boxH - 200}px;`">
      <div class="week_list clearfix">
        <div class="week_item" :class="{'no_check_item': item.status !== 1, 'now_week_item': item.nowWeek === 1}" :key="index"  v-for="(item, index) in weekList" @click="toWeekdaySet(item.week,((item.weekType==0?'第':item.weekType==1?'预':'加')+(item.weekType==0?item.week:item.weekType==1?(-item.week):item.week-mynum)+'周'))">
          <div class="bottom_msg_week">
            {{item.weekType==0?'第':item.weekType==1?"预":"加"}}{{item.weekType==0?item.week:item.weekType==1?(-item.week):item.week-mynum}}周</div>
          <div class="bottom_msg_date">{{item.startDate}}&nbsp;到&nbsp;{{item.endDate}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ImportFile from '@/components/ImportFile'
  import mixins from '@/mixins/windowResize';
  import {
    getSchoolWeekTimeList,
    copyGuideManagerToNextOtherWeek
  } from '@/api/systemSet/guide';

  export default {
    components: {
      ImportFile
    },
    name: "guideManagerSet",
    data() {
      return {
        importConf: {
          btnName: '按日期导入',
          title: '用户导入',
          templateUrl: 'structure/guide/downloadTermGuideManagerTemplate',
          templateArgs: {groupId: this.$route.query.guideGroupId},
          uploadUrl: 'structure/guide/importTermGuideManagerDatas',
          uploadArgs: {groupId: this.$route.query.guideGroupId},
          errUrl: 'structure/guide/downloadTermGuideManagerResultXls'
        },
        guideGroupId: this.$route.query.guideGroupId,
        weekList: [],
        mynum:0,
        mytwonum:0
      }
    },
    mixins: [mixins],
    created() {
      this.getSchoolWeekTimeList();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      // 周次
      getSchoolWeekTimeList() {
        getSchoolWeekTimeList(this.$route.query.guideGroupId).then(res => {
          if (res.data.code === 200) {
            this.weekList = res.data.data;
            for(let i=0;i<this.weekList.length;i++){
              if(this.weekList[i].weekType==0){
                this.mynum=this.weekList[i].week
              }
            }
            if(this.weekList[0].weekType==1){
              this.mytwonum=this.weekList[0].week
            }
          }
        }).catch()
      },
      toWeekdaySet(week,name) {
        this.$router.push({path: 'guideManagerPostSet', query: {week: week, guideGroupId: this.guideGroupId,name:name}});
      },
      syncFunc() {
        this.$confirm('同步数据将覆盖已有的护导数据，请谨慎操作！', '同步', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const weekObj = this.weekList.find(item => item.nowWeek == 1);
          copyGuideManagerToNextOtherWeek({
            groupId: this.guideGroupId,
            weekNo: weekObj.week
          })
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message.success(`同步成功`);
                this.getSchoolWeekTimeList();
              } else {
                this.$message.error(data.msg);
              }
            });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/style";

  .guide_manager_set {
    padding: 12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .week_list_box {
      padding: 20px 15px;
      overflow-x: hidden;
      overflow-y: auto;

      .week_list {
        .week_item {
          float: left;
          width: 240px;
          height: 120px;
          margin-top: 15px;
          margin-left: 30px;
          text-align: center;
          color: #409EFF;
          background: #ECF5FF;
          border: 1px solid #B7DAFF;
          cursor: pointer;
          border-radius: 5px;
          overflow: hidden;

          .bottom_msg_week {
            height: 60px;
            line-height: 60px;
            margin-top: 10px;
            font-size: 22px;
            font-weight: 700;
          }

          .bottom_msg_date {
            height: 40px;
            line-height: 40px;
          }
        }

        .no_check_item {
          color: #E6A440;
          background: #FDF6EC;
          border: 1px solid #F5DCB5;
        }

        .now_week_item {
          color: #fff;
          background: #409eff;
          border: 1px solid #B7DAFF;
        }
      }
    }
  }
</style>
