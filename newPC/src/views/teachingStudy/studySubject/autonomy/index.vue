<template>
  <div class="study-subject-autonomy-index">
    <el-row style="padding-bottom: 10px">
      <el-col :span="24">
        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择学期"
          value-key="id"
          v-model="form.schoolTime"
          @change="handleSchoolTime"
        >
          <el-option
            v-for="(item, idx) in schoolTimeAllList"
            :key="idx"
            :label="item.schoolTimeName"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择"
          value-key="week"
          v-model="form.weekObj"
          @change="handleWeek"
        >
          <el-option label="全部周次" :value="{ week: 0 }"></el-option>
          <el-option
            v-for="(item, idx) in weekList"
            :key="idx"
            :label="`第${item.week}周`"
            :value="item"
          ></el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="print()"
          >打印</el-button
        >
        <el-button type="primary" size="medium" @click="gotoDetail"
          >听课明细</el-button
        >
      </el-col>
    </el-row>

    <div ref="print" id="print">
      <el-form :inline="true">
        <el-form-item label="等第" style="margin-right: 100px">
          <span style="margin-right: 20px"
            >优：{{ goodCount | filterCount }}</span
          >
          <span style="margin-right: 20px"
            >良：{{ fineCount | filterCount }}</span
          >
          <span>及格：{{ passCount | filterCount }}</span>
        </el-form-item>
        <el-form-item label="等第占比">
          <span style="margin-right: 20px"
            >优：{{ goodRate | filterCount }}%</span
          >
          <span style="margin-right: 20px"
            >良：{{ fineRate | filterCount }}%</span
          >
          <span>及格：{{ passRate | filterCount }}%</span>
        </el-form-item>
      </el-form>

      <el-table
        border
        stripe
        :style="{
          width: '100%',
          'margin-top': '20px',
          'min-height': nobottommaxH - 120 + 'px',
        }"
        :data="tabList"
        :span-method="objectSpanMethod"
        v-loading.body="tabLoading"
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
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { isShowByPermission } from "@/utils";
import { mapGetters } from "vuex";

/* components */

/* api */
import {
  getSchoolDicDetailsByTypeCode,
  findSchoolDicsByCode,
  getSchoolTimeAllListBySchoolId,
  getSeveralWeekListBySchoolTImeId,
  studySubjectOwnAnalysis,
} from "@/api/teachingStudy/erTongYanJiuTingKe";

export default {
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["schoolInfo"]),
  },
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
    filterCount(val) {
      if (val == null || val === "") return "--";
      else return val;
    },
  },
  data() {
    return {
      // 学期列表
      schoolTimeAllList: [],
      // 周次列表
      weekList: [],
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      goodCount: "",
      fineCount: "",
      passCount: "",
      goodRate: "",
      fineRate: "",
      passRate: "",
      // 表格数据 { Array }
      tabList: [],
      spanArr: [],
      // 请求表单
      form: {
        schoolTime: {},
        weekObj: { week: 0 },
      },
    };
  },
  created() {
    this.tabLoading = true;
    this.getSchoolDicDetailsByTypeCode();
  },
  methods: {
    isShowByPermission,

    getSchoolDicDetailsByTypeCode() {
      getSchoolDicDetailsByTypeCode({
        typeCode: "studySubject",
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.appraiseJson = data.map((item) => ({
              typeId: item.id,
              typeName: item.name,
              code: item.code,
              itemList: [],
            }));
            let temp = Promise.all(
              this.appraiseJson.map((item) =>
                findSchoolDicsByCode({
                  dicCode: item.code,
                }).then((res) => {
                  let _res = res.data;
                  if (_res.code != 200) return Promise.reject(_res.msg);
                  else return _res.data;
                })
              )
            );
            temp
              .then((res) => {
                this.appraiseJson.forEach((item, idx) => {
                  item.itemList = res[idx].map((sub) => ({
                    typeId: sub.id,
                    typeName: sub.remark
                      ? `${sub.value}：${sub.remark}`
                      : sub.value,
                  }));
                });
                this.getSchoolTimeAllListBySchoolId();
              })
              .catch(() => {
                this.tabLoading = false;
                this.$message({
                  message: msg,
                  type: "error",
                });
              });
          }
        });
    },

    // 根据学校id获取学期列表
    getSchoolTimeAllListBySchoolId() {
      this.tabLoading = true;
      getSchoolTimeAllListBySchoolId({
        schoolId: this.schoolInfo.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.schoolTimeAllList = [...data];
            let schoolTime = this.schoolTimeAllList.find(
              (item) => item.isCurrent
            );
            if (schoolTime) this.form.schoolTime = schoolTime;
            else this.form.schoolTime = this.schoolTimeAllList[0];
            this.getSeveralWeekListBySchoolTImeId();
          }
          this.tabLoading = false;
        })
        .catch((msg) => {
          this.tabLoading = false;
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 根据schoolTimeId获取学期的周次
    getSeveralWeekListBySchoolTImeId() {
      getSeveralWeekListBySchoolTImeId({
        schoolTimeId: this.form.schoolTime.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            this.weekList = [...data];
            this.studySubjectOwnAnalysis();
          }
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    // 根据学期和周分页获取自主听课,week=0代表全部周
    studySubjectOwnAnalysis() {
      studySubjectOwnAnalysis({
        week: this.form.weekObj.week,
        schoolTimeId: this.form.schoolTime.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.goodCount = data.goodCount;
            this.fineCount = data.fineCount;
            this.passCount = data.passCount;
            this.goodRate = data.goodRate;
            this.fineRate = data.fineRate;
            this.passRate = data.passRate;

            let appraiseJson = JSON.parse(JSON.stringify(this.appraiseJson));
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
            this.tabList = [...temp];
            this.getSpanArr(this.tabList);
            this.tabLoading = false;
          }
        })
        .catch((msg) => {
          this.tabLoading = false;
          this.$message({
            message: msg,
            type: "error",
          });
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

    // 检索条件 改变
    filterSearch() {
      this.tabLoading = true;
      this.tabList = [];
      this.spanArr = [];
      this.studySubjectOwnAnalysis();
    },
    // 学期改变
    handleSchoolTime() {
      this.tabLoading = true;
      this.form.weekObj = { week: 0 };
      this.tabList = [];
      this.spanArr = [];
      this.getSeveralWeekListBySchoolTImeId();
    },
    // 周次改变
    handleWeek() {
      this.filterSearch();
    },

    // 打印
    print() {
      this.$print(this.$refs.print);
    },

    // 详情页
    gotoDetail(item) {
      this.$router.push({
        path: "autonomy/detail",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.study-subject-autonomy-index {
  .el-form {
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

  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
}
</style>
