<template>
  <div class="er-tong-yan-jiu-ting-ke-detail">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button type="primary" size="medium" @click="print()"
          >打印</el-button
        >
        <el-button type="primary" size="medium" @click="gotoEvaluateDetail"
          >评价详情</el-button
        >
      </el-col>
    </el-row>
    <div
      class="detail-wrapper"
      :style="{ height: nobottommaxH - 10 + 'px' }"
      ref="print"
      id="print"
    >
      <div class="detail-title">基本信息</div>
      <el-form label-width="140px">
        <el-form-item label="听课时间"
          >第{{ week }}周 星期{{ weekDay | filerWeek }}
          {{ dayStage | filteDayStage }}（第{{ seq }}节）</el-form-item
        >
        <el-form-item label="听课班级">{{ className }}</el-form-item>
        <el-form-item label="执教教师">{{
          classTeacherJson | filterTeacherJson
        }}</el-form-item>
        <el-form-item label="课题">{{ subjectName }}</el-form-item>
        <el-form-item label="听课老师">{{
          listenJson | filterTeacherJson
        }}</el-form-item>
        <el-form-item label="等第">
          <span style="margin-right: 20px">优：{{ goodCount }}</span>
          <span style="margin-right: 20px">良：{{ fineCount }}</span>
          <span>及格：{{ passCount }}</span>
        </el-form-item>
        <el-form-item label="等第占比">
          <span style="margin-right: 20px">优：{{ goodRate }}%</span>
          <span style="margin-right: 20px">良：{{ fineRate }}%</span>
          <span>及格：{{ passRate }}%</span>
        </el-form-item>

        <el-table
          border
          stripe
          style="width: 100%; margin-top: 20px"
          :data="tableData"
          :span-method="objectSpanMethod"
        >
          <el-table-column align="center" prop="typeName" label="项目">
          </el-table-column>
          <el-table-column align="center" prop="itemTypeName" label="内容">
          </el-table-column>
          <el-table-column align="center" prop="levelA" label="A">
          </el-table-column>
          <el-table-column align="center" prop="levelB" label="B">
          </el-table-column>
          <el-table-column align="center" prop="levelC" label="C">
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */

/* api */
import { getStudySubjectAnalysis } from "@/api/teachingStudy/erTongYanJiuTingKe";

export default {
  name: "erTongYanJiuTingKeDetail",
  mixins: [mixin],
  components: {},
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
    filterTeacherJson(val) {
      return val
        ? JSON.parse(val)
            .map((item) => item.name)
            .join("，")
        : "--";
    },
    filerWeek(val) {
      let map = ["一", "二", "三", "四", "五", "六", "日"];
      return map[val - 1];
    },
    filteDayStage(val) {
      let map = ["早自习", "上午", "午自习", "下午", "晚自习"];
      return map[val - 1];
    },
  },
  watch: {},
  computed: {
    ...mapGetters(["userInfo"]),
    isShowHandleBtn() {
      if (this.isComplaint == 1) {
        return true;
      } else {
        if (
          this.state == 1 &&
          this.batchUserIdList.includes(this.userInfo.id)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  data() {
    return {
      isEmpty: false,
      // 研究课听课id
      studySubjectId: this.$route.query.studySubjectId,
      week: "",
      weekDay: "",
      dayStage: "",
      seq: "",
      className: "",
      classTeacherJson: "",
      subjectName: "",
      listenJson: "",
      goodCount: "",
      fineCount: "",
      passCount: "",
      goodRate: "",
      fineRate: "",
      passRate: "",
      // 表格数据
      tableData: [],
      spanArr: [],
      // 请求表单
      form: {},
    };
  },
  created() {
    this.getStudySubjectAnalysis();
  },
  methods: {
    // 获取研究听课评价分析
    getStudySubjectAnalysis() {
      getStudySubjectAnalysis({
        studySubjectId: this.studySubjectId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.week = data.week;
            this.weekDay = data.weekDay;
            this.dayStage = data.dayStage;
            this.seq = data.seq;
            this.className = data.className;
            this.classTeacherJson = data.classTeacherJson;
            this.subjectName = data.subjectName;
            let listenDepart = JSON.parse(data.listenDepartJson || "[]");
            let listenTeacher = JSON.parse(data.listenTeacherJson || "[]");
            this.listenJson = JSON.stringify(
              listenDepart.concat(listenTeacher)
            );
            this.goodCount = data.goodCount;
            this.fineCount = data.fineCount;
            this.passCount = data.passCount;
            this.goodRate = data.goodRate;
            this.fineRate = data.fineRate;
            this.passRate = data.passRate;
            let appraiseJson = JSON.parse(data.appraiseJson || "[]");
            let appraiseList = data.appraiseList;
            let temp = [];
            appraiseJson.forEach((appraiseJsonItem) => {
              appraiseJsonItem.itemList.forEach((item, itemIdx) => {
                let obj = {
                  typeId: appraiseJsonItem.typeId,
                  typeName: appraiseJsonItem.typeName,
                  itemTypeId: item.typeId,
                  itemTypeName: `${itemIdx + 1}.${item.typeName}`,
                  levelA: "0（0%）",
                  levelB: "0（0%）",
                  levelC: "0（0%）",
                };
                appraiseList.forEach((appraiseListItem) => {
                  if (appraiseListItem.typeId == item.typeId) {
                    obj.levelA = `${appraiseListItem.levelACount}（${appraiseListItem.levelARate}%）`;
                    obj.levelB = `${appraiseListItem.levelBCount}（${appraiseListItem.levelBRate}%）`;
                    obj.levelC = `${appraiseListItem.levelCCount}（${appraiseListItem.levelCRate}%）`;
                  }
                });
                temp.push(obj);
              });
            });
            this.tableData = [...temp];
            this.getSpanArr(this.tableData);
          }
        });
    },

    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].typeId === data[i - 1].typeId) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },

    // 打印
    print() {
      this.$print(this.$refs.print);
    },

    // 评价详情
    gotoEvaluateDetail() {
      this.$router.push({
        path: "evaluate/detail",
        query: {
          studySubjectId: this.studySubjectId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.er-tong-yan-jiu-ting-ke-detail {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-form {
    width: 810px;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-form-item__label {
      color: #909399;
    }
    /deep/ .el-form-item__content {
      padding-left: 18px;
    }
  }

  .detail-wrapper {
    overflow: auto;
    padding-bottom: 50px;
  }

  .detail-title {
    width: 810px;
    margin: 22px auto 14px;
    border-left: 4px solid #409eff;
    padding-left: 12px;
    height: 16px;
    line-height: 16px;
    font-size: 15px;
    color: #676a6c;
    font-weight: bold;
    .danger {
      color: #f56c6c;
    }
  }
}
</style>