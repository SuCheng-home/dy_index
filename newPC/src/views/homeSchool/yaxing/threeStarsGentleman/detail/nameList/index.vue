<template>
  <div class="name-list">
    <el-row style="padding-bottom: 10px">
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button
          type="primary"
          size="medium"
          v-if="state == 2 && isJXZ"
          @click="handleRemind"
          >提醒未评选班级</el-button
        >
        <address-book
          :isbutton="true"
          :config="configData"
          v-model="form.addressData"
          >添加三星小雅士</address-book
        >
      </el-col>
    </el-row>
    <el-row
      style="
        padding-bottom: 10px;
        text-align: center;
        color: #303133;
        font-size: 24px;
      "
    >
      <el-col :span="24">三星小雅士名单</el-col>
    </el-row>
    <el-table
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      :height="nobottommaxH - 37"
      :data="tabList"
      v-loading.body="tabLoading"
    >
      <el-table-column align="center" label="学号" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.studentNo || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.studentName || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="所在班级" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.className || "--"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="gotoPropaganda(scope.row)"
            >维护宣传信息</el-button
          >
          <el-button
            size="small"
            type="text"
            v-if="scope.row.status == 2"
            @click="handleRecovery(scope.row)"
            >恢复</el-button
          >
          <el-button
            class="text-danger"
            size="small"
            type="text"
            v-if="scope.row.status == 1"
            @click="handleDelete(scope.row)"
            >无效</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
import {
  getThreeStarStuThreeList,
  getThreeStarBatch,
  remindClassHeader,
  addThreeStarStuThreeList,
  updateThreeStarStuThree,
} from "@/api/homeSchool/yaxing/threeStarsGentleman/detail/nameList/index";

export default {
  name: "nameList",
  mixins: [mixin],
  components: {
    AddressBook,
  },
  watch: {
    "form.addressData"(addressData) {
      if (addressData.userJson && addressData.userJson.length) {
        this.form.list = addressData.userJson.map((stu) => ({
          batchId: this.id,
          createType: 2,
          status: 1,
          studentId: stu.id,
        }));
        this.addThreeStarStuThreeList();
      }
    },
  },
  computed: {
    // 是否进行中
    isJXZ() {
      return (
        this.$moment() >= this.$moment(this.startDate) &&
        this.$moment() <= this.$moment(this.endDate + " 23:59:59")
      );
    },
  },
  data() {
    return {
      // 批次id
      id: this.$route.query.id,
      // 主题
      title: "",
      // 状态
      state: "",
      // 开始日期
      startDate: "",
      // 结束日期
      endDate: "",
      // 是否正在加载数据 { Boolean }
      tabLoading: false,
      // 表格数据 { Array }
      tabList: [],
      // 地址簿参数
      configData: {
        title: "选择三星小雅士",
        depart: { target: "user", departType: "s", userTypes: "2" },
      },
      // 请求表单
      form: {
        addressData: {},
        // 三星小雅士列表
        list: [],
      },
    };
  },
  created() {
    this.getThreeStarBatch();
    this.getThreeStarStuThreeList();
  },
  methods: {
    // 根据批次id查询批次详情
    getThreeStarBatch() {
      getThreeStarBatch({
        batchId: this.id,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.title = data.title;
          this.state = data.state;
          this.startDate = data.startDate;
          this.endDate = data.endDate;
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 根据班级id,批次id,查询三星小雅士
    getThreeStarStuThreeList() {
      getThreeStarStuThreeList({
        batchId: this.id,
        classId: 0,
        createType: 0,
        status: 0,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.tabList = [...data];
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 批量新增三星小雅士
    addThreeStarStuThreeList() {
      addThreeStarStuThreeList(this.form.list)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.form.addressData = {};
          this.getThreeStarStuThreeList();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 修改三星小雅士
    updateThreeStarStuThree(item, status) {
      updateThreeStarStuThree({
        id: item.id,
        studentId: item.studentId,
        status,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.form.addressData = {};
          this.getThreeStarStuThreeList();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 提醒未评选班级
    remindClassHeader() {
      remindClassHeader({
        batchId: this.id,
        title: this.title,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "提醒成功",
            type: "success",
          });
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },
    // 点击*提醒未评选班级*
    handleRemind() {
      this.$confirm("确认要提醒未评选班级吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.remindClassHeader();
        })
        .catch(() => {});
    },
    // 点击*恢复*
    handleRecovery(item) {
      this.$confirm("确认要恢复吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.updateThreeStarStuThree(item, 1);
        })
        .catch(() => {});
    },
    // 点击*无效*
    handleDelete(item) {
      this.$confirm("确认要无效吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
      })
        .then(() => {
          this.updateThreeStarStuThree(item, 2);
        })
        .catch(() => {});
    },
    // 宣传信息维护
    gotoPropaganda(item) {
      this.$router.push({
        path: "propaganda/form",
        query: {
          id: item.id,
          batchId: this.id,
          studentId: item.studentId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.name-list {
  padding:12px;

  tbody {
    .text-danger {
      /deep/ span {
        color: #f56c6c;
      }
    }
  }
}
</style>
