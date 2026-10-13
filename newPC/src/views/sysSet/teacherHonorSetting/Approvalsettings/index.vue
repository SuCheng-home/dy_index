<template>
    <div class="awards-level">
        <div class="filter-wrapper">
            <el-button
                @click="$router.back()"
                size="medium"
            >返回</el-button>
                <el-button
                    type="primary"
                    size="medium"
                    @click="insertOrUpdates()"
                >保存</el-button>
        </div>
        <div
            class="body"
            :style="`height: ${maxH-20}px;`"
        >
            <div class="box">
                <el-checkbox v-model="checked">是否需要审批</el-checkbox>
            </div>

    </div>
    </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import {
  getBySchoolId,
  insertOrUpdate
} from "@/api/systemSet/teacherHonorSetting/awardsLevel/index";
export default {
  name: "Approvalsettings",
  mixins: [mixin],
  data() {
    return {
      checked: false
    };
  },
  created() {
    getBySchoolId()
      .then(res => res.data)
      .then(data => {
        if (data.data) {
          this.checked = data.data.autoPass == 2;
        }
      });
  },
  methods: {
    insertOrUpdates() {
      this.$confirm("确认要保存吗？", "保存", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        insertOrUpdate({ autoPass: this.checked ? 2 : 1 })
          .then(res => {
            const data = res.data;
            if (res.data.code === 200) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
            } else {
              this.$message({
                message: data.msg,
                type: "warning"
              });
            }
          })
          .catch();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.awards-level {
  .filter-wrapper {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
  }
  .el-table__body-wrapper {
    .delete-btn {
      color: #f56c6c;
    }
  }
  .box {
    padding: 20px 80px;
  }
}
</style>