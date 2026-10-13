<template>
  <div>
    <app-header>
      <span>{{afterClassName}}</span>
    </app-header>
    <div class="evaluate-big-box">
      <div class="evaluate-subject">
        <div class="bonuspoints">
          <div class="name">真棒</div>
          <div class="boxs">
            <div v-for="scoreItem in buffList" class="box" @click="onModalItemClick(scoreItem)">
              {{scoreItem.title}}
            </div>
          </div>
        </div>
        <div class="Subtraction">
          <div class="name">加油</div>
          <div class="boxs">
            <div class="box" v-for="scoreItem in debuffList" @click="onModalItemClick(scoreItem)">
              {{scoreItem.title}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="学生" :visible.sync="isShowStudentDialog" width="1050px">
      <div class="page-modal-box">
        <label :class="['label', checkedStudent.includes(studentItem.studentId) ? 'label-color' : '']"
               v-for="studentItem in studentList">
          <img src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_default_head.jpg" alt="">
          <input type="checkbox" :value="studentItem.studentId" v-model="checkedStudent" class="box-checkbox"><i
          class=" fa fa-check fa-lg"></i>
          <span class="num">{{studentItem.studentNo.slice(-2)}}</span>
          <div class="box-name">{{studentItem.studentName}}</div>
        </label>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="isShowStudentDialog = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="onStudentConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <app-footer active="afterScoreItemEvaluate" is-after
                :routeQueryArgs="{afterClassId, afterClassName, stage}"></app-footer>
    <score-display ref="scoreDisplay"></score-display>
  </div>
</template>

<script>
  import AppHeader from './components/AppHeader';
  import AppFooter from './components/AppFooter';
  import ScoreDisplay from './components/ScoreDisplay';

  import {
    getAfterBehaviorStuList,
    getAfterBehaviorTypeListBySchoolId,
    addAfterBehaviorStuList
  } from "@/api/classroomEvaluationApp";

  export default {
    name: "afterScoreItemEvaluate",
    components: {
      AppHeader,
      AppFooter,
      ScoreDisplay
    },
    data() {
      return {
        afterClassId: this.$route.query.afterClassId,
        afterClassName: this.$route.query.afterClassName,
        stage: this.$route.query.stage,
        stageName: this.$route.query.stageName,
        checkedStudent: [],
        studentList: [],
        buffList: [],
        debuffList: [],
        isShowStudentDialog: false,
        modalItem: null,
      }
    },
    created() {
      this.getTypeList();
      this.getAfterBehaviorStuListFunc();
    },
    methods: {
      getTypeList() {
        getAfterBehaviorTypeListBySchoolId({
          type: 0
        }).then(res => res.data).then(data => {
          this.buffList = data.data;
        });
        getAfterBehaviorTypeListBySchoolId({
          type: 1
        }).then(res => res.data).then(data => {
          this.debuffList = data.data;
        });
      },
      getAfterBehaviorStuListFunc() {
        getAfterBehaviorStuList({
          afterClassId: this.afterClassId,
          stage: this.stage
        }).then(res => res.data).then(data => {
          this.studentList = data.data;
        });
      },
      onModalItemClick(modalItem) {
        this.modalItem = modalItem;
        this.isShowStudentDialog = true;
      },
      onStudentConfirm() {
        if (this.checkedStudent.length === 0) {
          this.$message.warning('请选择评价学生');
        } else {
          const args = [];
          this.checkedStudent.forEach(studentId => {
            args.push({
              afterClassId: this.afterClassId,
              afterClassName: this.afterClassName,
              behTypeId: this.modalItem.id,
              behTypeName: this.modalItem.title,
              stage: this.stage,
              stageName: this.stageName,
              stepScore: `${this.modalItem.type == 1 ? '-' : ''}${this.modalItem.stepScore}`,
              type: this.modalItem.type,
              studentId
            });

          });
          addAfterBehaviorStuList(args).then(res => res.data).then(data => {
            if (data.result) {
              this.checkedStudent = [];
              this.isShowStudentDialog = false;

              if (data.result) {
                this.$refs.scoreDisplay.displayScore({
                  studentName: this.modalItem.title,
                  scoreName: this.modalItem.type == 0 ? '加分' : '减分',
                  scoreNum: this.modalItem.stepScore,
                  type: this.modalItem.type
                });
                this.getAfterBehaviorStuListFunc();
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .evaluate-big-box {
    height: 550px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .evaluate-subject {
    max-width: 1280px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 10px 20px;
  }

  .name {
    border-left: 5px solid #0099e8;
    font-size: 24px;
    color: #666;
    font-weight: 600;
    line-height: 40px;
    margin-top: 10px;
    padding-left: 20px;
  }

  .boxs {
    overflow: hidden;
    padding: 20px;
  }

  .box {
    background-color: rgb(49, 178, 49);
    cursor: pointer;
    width: 22%;
    height: 60px;
    border: 1px solid #31B231;
    border-radius: 15px;
    line-height: 60px;
    float: left;
    margin: 5px 1%;
    text-align: center;
    color: #fff;
  }

  .Subtraction .box {
    background-color: rgb(228, 165, 49);
    border: 1px solid #E4A531;
  }

  .page-modal-box {
    height: 350px;
    overflow: auto;
    border-bottom: 1px #eee solid;
    padding-bottom: 5px;

    .label-color {
      border: 1px #04BE02 solid;

    }

    label.label-color i {
      color: #04BE02;
      border: 1px #04BE02 solid;
    }

    label {
      height: 100px;
      position: relative;
      float: left;
      width: 6.5%;
      margin: 5px 0.3%;
      padding: 0;
      border: 1px #eee solid;
      box-sizing: border-box;
      cursor: pointer;

      img {
        display: block;
        border-radius: 50%;
        margin: 0px auto;
        margin-top: 15px;
        width: 50px;
        height: 50px;
      }

      .box-checkbox {
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
      }

      i {
        position: absolute;
        right: 3px;
        top: 3px;
        border: 1px #ccc solid;
        font-size: 15px;
        height: 16px;
        width: 16px;
        margin: 0;
        padding: 0;
        border-radius: 50%;
        line-height: 16px;
        text-align: center;
        color: #fff;
      }

      .num {
        float: left;
        line-height: 16px;
        font-size: 13px;
        padding-left: 3px;
      }

      .box-name {
        font-size: 13px;
        line-height: 15px;
        text-align: center;
        color: #666;
        font-weight: 600;
      }
    }
  }
</style>
