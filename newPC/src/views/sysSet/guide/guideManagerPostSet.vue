<template>
  <div class="guide_manager_post_set">
    <div class="header">
      <el-row>
        <el-col :span="14">
          <el-button size="medium" @click="goBack">返回</el-button>
          <el-button type="primary" size="medium" @click="copyLastWeek" v-if="currentWeek>0">复制上一周数据</el-button>
          <el-button type="primary" size="medium" @click="emptyCurrentWeek">重置本周数据</el-button>
          <import-file :config="importConf" @success="handSuccess"></import-file>
          <a target="_blank" :href="exportUrl" download="互导" v-if="guideManagerList.length">
                <el-button type="primary" size="medium">导出</el-button>
          </a>
        </el-col>
        <el-col :span="4">
          <div class="header_title">{{name}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="weekday_list_box" :style="`height: ${boxH - 95}px;`">
      <div class="table table-hover">
        <div class="thead">
          <div class="tr clearfix">
            <div class="th first_th">岗位</div>
            <div class="th">星期一</div>
            <div class="th">星期二</div>
            <div class="th">星期三</div>
            <div class="th">星期四</div>
            <div class="th">星期五</div>
            <div class="th">星期六</div>
            <div class="th">星期日</div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr clearfix" :key="index" v-for="(item, index) in guideManagerList">
            <div class="td first_td" :title="item.place">{{item.place}}</div>
            <div class="td" :key="tdIndex" v-for="(tdItem, tdIndex) in item.guideManagers">
              <div class="chose_teacher">
                <address-book v-model="tdItem.managerNewJson" @input="addressChange(tdItem, item.id)" :config="managerConfigData"></address-book>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ImportFile from '@/components/ImportFile'
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import { getGroupWeekGuideManagerList, saveGuideWeekNumberManager, copyBeforeWeekGroupGuideManagerList, deleteGroupWeekGuideManager } from '@/api/systemSet/guide';

  export default {
    components: {
      AddressBook,
      ImportFile
    },
    name: "guideManagerPostSet",
    data() {
      return {
        importConf: {
          btnName: '导入',
          title: '用户导入',
          templateUrl: 'structure/guide/downloadImportGuideManagerTemplate',
          templateArgs: {groupId: this.$route.query.guideGroupId},
          uploadUrl: 'structure/guide/importGuideManagerDatas',
          uploadArgs: {weekNo: this.$route.query.week,groupId: this.$route.query.guideGroupId},
          errUrl: 'structure/guide/downloadGuideManagerResultXls'
        },
        exportUrl: '',
        guideGroupId: this.$route.query.guideGroupId,
        currentWeek: this.$route.query.week,
        name: this.$route.query.name,
        managerConfigData: {
          title: '请选择岗位负责人',
          nodeTitle: '请选择岗位负责人',
          depart: {target: 'user', departType: 't', userTypes: '1'}
        },
        guideManagerList: []
      }
    },
    mixins: [mixins],
    created() {
      // init 获取本周的排班，复制或清空后重新执行
      this.getGroupWeekGuideManagerList();
      // 修改提交后进行提示 （人员未修改，点击确认，是否提示）
      this.exportUrl = global.BasePath + "structure/guide/exportGuideWeekManagerDatas?groupId="+this.guideGroupId+'&weekNo='+parseInt(this.currentWeek)+"&token=" + this.$store.getters.token;
    },
    methods: {
      handSuccess() {
        this.getGroupWeekGuideManagerList()
      },
      goBack() {
        this.$router.back();
      },
      // 获取信息
      getGroupWeekGuideManagerList() {
        getGroupWeekGuideManagerList({
          groupId: this.guideGroupId,
          weekNo: parseInt(this.currentWeek)
        }).then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            data.forEach((item) => {
              item.guideManagers.forEach((itemGuide) => {
                if (itemGuide.managerJson) {
                  itemGuide.managerNewJson = {userJson: JSON.parse(itemGuide.managerJson)};
                }
              })
            });
            this.guideManagerList = data;
          }
        }).catch()
      },
      // 复制上周数据
      copyLastWeek() {
        this.$confirm('复制上周数据将覆盖本周数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.copyBeforeWeekGroupGuideManagerList();
        }).catch(() => {
        });
      },
      copyBeforeWeekGroupGuideManagerList() {
        copyBeforeWeekGroupGuideManagerList({
          groupId: this.guideGroupId,
          weekNo: parseInt(this.currentWeek)
        }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '复制成功!'
            });
            this.getGroupWeekGuideManagerList();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }).catch()
      },
      // 清空数据
      emptyCurrentWeek() {
        this.$confirm('重置本周数据会清空当前设置的所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteGroupWeekGuideManager();
        }).catch(() => {
        });
      },
      deleteGroupWeekGuideManager() {
        deleteGroupWeekGuideManager({
          groupId: this.guideGroupId,
          weekNo: parseInt(this.currentWeek)
        }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            });
            this.getGroupWeekGuideManagerList();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }).catch()
      },
      // 新增修改数据
      addressChange(rowItem, stationId) {
        // if (!rowItem.managerNewJson.userJson || !rowItem.managerNewJson.userJson.length) {
        //   return;
        // }
        let query = {
          groupId: this.guideGroupId,
          guideDate: rowItem.guideDate,
          managerJson: JSON.stringify(rowItem.managerNewJson.userJson) || {},
          stationId: stationId,
          weekNo: Number(this.currentWeek),
          weekNumber: rowItem.weekNumber
        };
        this.saveGuideWeekNumberManager(query);
      },
      saveGuideWeekNumberManager(query) {
        saveGuideWeekNumberManager(query).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }).catch()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/style";

  .guide_manager_post_set {
    padding: 10px 15px;
    .header {
      padding-bottom: 10px;
      .header_title{
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        line-height: 36px;
      }
    }

    .weekday_list_box {
      overflow-x: hidden;
      overflow-y: auto;

      .table {
        .thead {
          border-right: 1px solid #DFE6EC;

          .tr {
            background: #EEF1F6;

            .th {
              float: left;
              width: 12%;
              height: 50px;
              line-height: 50px;
              text-align: center;
              font-size: 15px;
              font-weight: 700;
              color: #333;
              border-top: 1px solid #DFE6EC;
              border-left: 1px solid #DFE6EC;
            }

            .first_th{
              width: 15%;
            }
          }
        }

        .tbody {
          border-right: 1px solid #DFE6EC;
          border-bottom: 1px solid #DFE6EC;

          .tr {
            .td {
              float: left;
              width: 12%;
              height: 65px;
              padding: 5px;
              border-top: 1px solid #DFE6EC;
              border-left: 1px solid #DFE6EC;
            }

            .first_td {
              width: 15%;
              line-height: 80px;
              background: #EEF1F6;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
