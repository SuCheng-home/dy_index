<template>
  <div class="integral_list_wrap">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary"   size="medium" @click="addHandler">新增</el-button>
    </div>
    <div class="main-wrap">
      <el-table ref="multipleTable" :data="tableData" :height="nobottommaxH" tooltip-effect="dark" border
                style="width: 100%">
        <el-table-column label="积分值" align="center">
          <template slot-scope="scope">达到{{ scope.row.levelPoint}}</template>
        </el-table-column>
        <el-table-column label="对应等级" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.levelName}}</template>
        </el-table-column>
        <el-table-column label="是否提醒家长" align="center">
          <template slot-scope="scope">{{ scope.row.stuRemind === 1 ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column label="是否提醒积分管理员" align="center">
          <template slot-scope="scope">{{ scope.row.managerRemind === 1 ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row.id)" class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getCreditPointLevelList, deleteCreditPointLevelById} from '@/api/wtCredit';
  import mixin from '@/mixins/windowResize';

  export default {
    name: 'integralList',
    data() {
      return {
        multipleSelection: [],
        tableData: [],

      }
    },
    created() {
      this.getCreditPointLevelList();
    },
    mounted() {
    },
    mixins: [mixin],
    methods: {
      getCreditPointLevelList() {
        getCreditPointLevelList().then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.tableData = data.data;
          }
        })
      },
      handleEdit(item) {
        this.$router.push({
          path: 'integralAdd',
          query: {
            id: item.id,
            levelPoint: item.levelPoint,
            levelName: item.levelName,
            stuRemind: item.stuRemind,
            managerRemind: item.managerRemind
          }
        })
      },
      addHandler() {
        this.$router.push({
          path: 'integralAdd'
        })
      },
      handleDelete(id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'error'
        }).then(() => {
          deleteCreditPointLevelById({id: id}).then(res => {
            if (res.data.code === 200 && res.data.result) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getCreditPointLevelList();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }).catch(function (error) {
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .integral_list_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
    }
  }
</style>
