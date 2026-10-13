<template>
  <div class="work-reminder-work-plan">
    <el-row style="padding-bottom: 10px">
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>

        <span style="margin: 0 10px">{{ schoolTimeName }}</span>
        <el-select
          class="el-select-short"
          size="medium"
          placeholder="请选择"
          v-model="form.weekNo"
          @change="handleWeekNo"
        >
          <el-option
            v-for="(item, idx) in weeklist"
            :key="idx"
            :label="`第${item.weekNo}周`"
            :value="item.weekNo"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>

    <div class="body" :style="`height: ${maxH - 20}px;`">
      <div class="big-box">
        <div
          class="box"
          :key="indexs"
          v-for="(items, indexs) in dataList"
          v-show="indexs < 6"
        >
          <div class="name-top">
            {{ items.dayName }} {{ items.dayDate }}
            <span v-if="indexs == 5"
              >{{ dataList[6].dayName }} {{ dataList[6].dayDate }}</span
            >
          </div>
          <div class="ul">
            <div
              class="li"
              :key="index"
              @click="handlePlan(item)"
              v-for="(item, index) in items.dayPlanList"
            >
              [ 个人 ] {{ item.content }}
            </div>
            <div v-if="indexs == 5">
              <div
                class="li"
                :key="index"
                @click="handlePlan(item)"
                v-for="(item, index) in dataList[6].dayPlanList"
              >
                {{ dataList[5].dayPlanList.length + index + 1 }}.
                {{ item.content }}
              </div>
            </div>
            <div
              class="zanwu"
              v-if="indexs < 5 && items.dayPlanList.length == 0"
            >
              暂无计划
            </div>
            <div
              class="zanwu"
              v-if="
                indexs == 5 &&
                items.dayPlanList.length + dataList[6].dayPlanList.length == 0
              "
            >
              暂无计划
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="计划详情"
      top="25vh"
      width="45%"
      style="min-height: 500px"
      :visible.sync="dialogVisible"
    >
      <el-form label-width="140px">
        <el-form-item label="负责部门">{{ department || "--" }}</el-form-item>
        <el-form-item label="参与人">{{ principals || "--" }}</el-form-item>
        <el-form-item label="计划内容">{{ content || "--" }}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import { isShowByPermission } from "@/utils";

/* components */

/* api */
import {
  getSchoolTimeAllList,
  getPersonWorkPlanList,
  getPersonWorkPlanNoticeList,
} from "@/api/newWorkPlan";

export default {
  name: "workReminderWorkPlan",
  mixins: [mixin],
  components: {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  data() {
    return {
      //  模态框
      dialogVisible: false,
      department: "",
      principals: "",
      content: "",
      // 学期名称
      schoolTimeName: "",
      // 周次列表
      weeklist: [],
      dataList: [],
      // 请求表单
      form: {
        schoolTimeId: "",
        weekNo: "",
        moduleCode: 0,
        title: "",
      },
    };
  },
  created() {
    this.getSchoolTimeAllList();
  },
  methods: {
    isShowByPermission,

    getSchoolTimeAllList() {
      getSchoolTimeAllList()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            let current = data.find((item) => item.isCurrent == 1);
            this.form.schoolTimeId = current.id;
            this.schoolTimeName = current.schoolTimeName;
            this.getPersonWorkPlanList();
          }
        });
    },

    getPersonWorkPlanList() {
      getPersonWorkPlanList(this.form.schoolTimeId)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.weeklist = [...data];
            let current = this.weeklist.find((item) => item.isCurrent == 1);
            if (current) this.form.weekNo = current.weekNo;
            else this.form.weekNo = this.weeklist[0].weekNo;
            this.getPersonWorkPlanNoticeList();
          }
        });
    },

    getPersonWorkPlanNoticeList() {
      getPersonWorkPlanNoticeList(this.form.schoolTimeId, this.form.weekNo)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.dataList = [...data];
          }
        });
    },

    // 检索条件 改变
    filterSearch() {
      this.getPersonWorkPlanNoticeList();
    },

    // weekNo 改变
    handleWeekNo(val) {
      this.filterSearch();
    },

    // 计划详情
    handlePlan(item) {
      this.department = item.department;
      this.principals = item.principals;
      this.content = item.content;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.work-reminder-work-plan {
  .body {
    overflow: auto;
    .big-box {
      overflow: hidden;
      border-top: 1px solid #e7eaec;
      border-left: 1px solid #e7eaec;
      .box {
        float: left;
        width: 33.33333%;
        border-right: 1px solid #e7eaec;
        border-bottom: 1px solid #e7eaec;
        padding: 10px;
        .zanwu {
          line-height: 200px;
          text-align: center;
          font-size: 18px;
          color: #909399;
        }
        .name-top {
          color: #909399;
          font-size: 17px;
          line-height: 36px;
          font-weight: 600;
        }
        .ul {
          font-size: 14px;
          line-height: 30px;
          height: 200px;
          overflow: auto;
          .li {
            color: #409eff;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .el-form {
    width: 100%;
    margin: 0 auto;
    overflow: auto;
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
}
</style>
