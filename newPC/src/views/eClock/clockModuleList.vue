<template>
  <div class="clock_module_list_wrap">
    <common-header show-back show-search @search="nameSearch" placeholder="请输入模板名称">
      <el-button type="primary" size="medium" @click="addModuleClock">新建</el-button>
    </common-header>
    <div>
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="boxH-200">
        <el-table-column align="center" label="模板名称" show-overflow-tooltip width="400px">
          <template slot-scope="scope">
            <span class="link-type" @click="toModuleInfo(scope.row.id)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="介绍" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click.native="editModuleClock(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" @click.native="delClock(scope.row.id)" class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import baseMixin from '@/mixins/baseMixin'
  import CommonHeader from './components/CommonHeader'
  import {getEcardTempList, delEcardTemp} from '@/api/eClock'

  export default {
    name: 'clockModuleList',
    components: {CommonHeader},
    data() {
      return {
        exportUrl: '',
        dataList: [],
        searchName: '',
        listQuery: {
          searchName: ''
        },
        total: 0
      }
    },
    mixins: [baseMixin, mixin],
    created() {
      this.getClockList();
    },
    methods: {
      addModuleClock() {
        this.$router.push({path: 'clockModuleAdd'});
      },
      editModuleClock(moduleId) {
        this.$router.push({path: 'clockModuleAdd', query: {moduleId: moduleId}});
      },
      toModuleInfo(moduleId) {
        this.$router.push({path: 'clockModuleInfo', query: {moduleId: moduleId}});
      },
      nameSearch(val) {
        this.searchName = val;
        this.getClockList()
      },
      delClock(tempId) {
        this.$confirm('是否删除该模板?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delEcardTemp({ecardTempId: tempId}).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({type: 'success', message: '删除成功!'});
              this.getClockList();
            } else {
              this.$message({type: 'error', message: data.msg})
            }
          }).catch();
        }).catch(() => {});
      },
      // 获取数据列表
      getClockList() {
        getEcardTempList({title: this.searchName}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.dataList = data.data;
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .clock_module_list_wrap {
    padding: 12px;
    box-sizing: border-box;
  }
</style>
