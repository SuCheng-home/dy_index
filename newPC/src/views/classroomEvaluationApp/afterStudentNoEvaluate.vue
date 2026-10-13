<template>
  <div>
    <app-header>
      <span>{{afterClassName}}</span>
    </app-header>
    <app-footer active="afterStudentNoEvaluate" is-after
                :routeQueryArgs="{afterClassId, afterClassName, stage}"></app-footer>
    <div class="student-list">
      <div @click="onStudentItemClick(studentItem)" v-for="studentItem in studentList"
           class="student_item">
        <div class="photo"
             style="backgroundImage: url('https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_default_head.jpg')"></div>
        <span class="name">{{studentItem.studentName.slice(0, 4)}}</span>
        <span class="name class_name">{{studentItem.className}}</span>
        <span class="score">{{studentItem.behScore || 0}}</span>
      </div>
    </div>

    <el-dialog title="点评" :visible.sync="isShowEvaluateDialog" width="480px">
      <div class="dialog-content">
        <div v-if="buffList && buffList.length !== 0">
          <h2 class="page-modal__content-type">真棒</h2>
          <ul class="page-modal__content buff">
            <li class="modal-item" @click="onModalItemClick(item)" v-for="item in buffList">
              <img
                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/buff-item.png">
              <span class="modal-item__desc">{{item.title}}</span>
            </li>
          </ul>
        </div>
        <div v-if="debuffList && debuffList.length !== 0">
          <h2 class="page-modal__content-type">加油</h2>
          <ul class="page-modal__content debuff">
            <li class="modal-item" @click="onModalItemClick(item)" v-for="item in debuffList">
              <img
                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/penalty-item.png">
              <span class="modal-item__desc">{{item.title}}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
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
    name: "afterStudentNoEvaluate",
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
        studentList: [],
        buffList: [],
        debuffList: [],
        isShowEvaluateDialog: false,
        studentItem: null,
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
      onStudentItemClick(studentItem) {
        this.studentItem = studentItem;
        this.isShowEvaluateDialog = true;
      },
      onModalItemClick(modalItem = null) {
        if (modalItem) {
          this.modalItem = modalItem;
        }
        if (this.modalItem) {
          addAfterBehaviorStuList([{
            afterClassId: this.afterClassId,
            afterClassName: this.afterClassName,
            behTypeId: this.modalItem.id,
            behTypeName: this.modalItem.title,
            classId: this.studentItem.classId,
            className: this.studentItem.className,
            classOrder: this.studentItem.classOrder,
            gradeId: this.studentItem.gradeId,
            gradeName: this.studentItem.gradeName,
            gradeOrder: this.studentItem.gradeOrder,
            stage: this.stage,
            stageName: this.stageName,
            stepScore: `${this.modalItem.type == 1 ? '-' : ''}${this.modalItem.stepScore}`,
            studentId: this.studentItem.studentId,
            studentName: this.studentItem.studentName,
            studentNo: this.studentItem.studentNo,
            type: this.modalItem.type
          }]).then(res => res.data).then(data => {
            this.isShowEvaluateDialog = false;
            if (data.result) {
              this.$refs.scoreDisplay.displayScore({
                studentName: this.studentItem.studentName,
                scoreName: this.modalItem.title,
                scoreNum: this.modalItem.stepScore,
                type: this.modalItem.type
              });
              this.getAfterBehaviorStuListFunc();
            } else if (data.code == 1005) {
              this.$refs.scoreDisplay.displayScore({
                studentName: this.studentItem.studentName,
                scoreName: data.msg,
                scoreNum: '',
                type: this.modalItem.type
              });
            }

          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../src/styles/mixin.scss";

  .teacher {
    width: 110px;
    height: 43px;
    margin: 0 auto;
    padding: 5px;
    text-align: center;
    line-height: 33px;
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/platform.png) left top / 100% 100% no-repeat;
    font-size: 14px;
    color: #fff;
  }

  .class_position {
    height: 550px;
    overflow-y: auto;
  }

  .class_position {
    margin-top: 5px;
    clear: both;
  }

  .student-list .student_item {
    float: left;
    cursor: pointer;
    width: 100px;
    height: 80px;
    margin: 10px 14px;
    position: relative;
    font-size: 14px;
  }

  .student-list .student_item div.photo {
    margin: 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .student-list .student_item .name {
    position: absolute;
    top: 58px;
    right: 0;
    width: 100%;
    text-align: center;
    font-size: 13px;
    line-height: 15px;
  }

  .student-list .student_item .class_name {
    top: 75px;
  }

  .student_item .name, .empty_item .name {
    position: relative;
    z-index: 800;
  }

  .student_item .photo {
    @include cover-bg;
  }

  .student-list .student_item .num {
    position: absolute;
    top: 58px;
    left: 0;
    width: 35px;
    text-align: right;
    font-size: 13px;
    line-height: 15px;
  }

  .student-list .student_item .score {
    position: absolute;
    width: 40px;
    background-color: #CCEBFA;
    color: #0099e8;
    left: 30px;
    bottom: 22px;
    font-size: 12px;
    border-radius: 11px;
    z-index: 700;
    text-align: center;
    padding: 1px 0;
  }

  .dialog-content {
    height: 320px;
    overflow-y: auto;

    .page-modal__content-type {
      border-left: 3px solid #0099e8;
      height: 20px;
      font-size: 14px;
      line-height: 20px;
      margin: 0 20px;
      padding: 0 10px;
    }

    .page-modal__content {
      padding: 10px;
      overflow-y: auto;

      img {
        width: 80%;
        border-radius: 50%;
      }

      .modal-item__desc {
        font-size: 12px;
        display: block;
        text-align: center;
        white-space: nowrap;
      }
    }

    li {
      width: 15%;
      margin: 0 2% 10px 2%;
      text-align: center;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>
