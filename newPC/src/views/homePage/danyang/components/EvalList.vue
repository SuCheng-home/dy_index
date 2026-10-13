<template>
  <div class="card" v-if="isClassLeader || isSchoolLeader">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-award" style="color: #faad14;"></i> 文明班级评比</div>
      <div v-if="isClassLeader && isSchoolLeader" style="display: flex; gap: 8px;">
        <div class="card-btn" :style="{ background: activeRole === 'teacher' ? 'var(--primary)' : '#f0f2f5', color: activeRole === 'teacher' ? 'white' : 'var(--text-sec)' }" @click="switchRole('teacher')">我是班主任</div>
        <div class="card-btn" :style="{ background: activeRole === 'leader' ? 'var(--primary)' : '#f0f2f5', color: activeRole === 'leader' ? 'white' : 'var(--text-sec)' }" @click="switchRole('leader')">我是校领导</div>
      </div>
    </div>
    <div class="card-body">
      <!-- Teacher View -->
      <div v-if="activeRole === 'teacher' && isClassLeader">
        <div style="margin-bottom: 16px; font-size: 14px; color: var(--text-sec); display: flex; justify-content: space-between; align-items: center;">
          <span>当前管理班级：<span v-for="item in classList" class="class-tag" :class="{
            'active-class': item.id === classId
          }" :key="item.id"  @click="handleClassClick(item)">{{ item.name }}</span></span>
          <span style="font-size: 12px; color: var(--primary); cursor: pointer;" @click="openHistoryDialog"><i class="fas fa-history"></i> 历史记录</span>
        </div>
        
        <div class="eval-list">
          <div v-for="(item, index) in evaluationItems" :key="index" class="evaluation-item">
            <div class="evaluation-item-content">
              <div class="evaluation-item-header">
                <!-- <div class="evaluation-item-icon">
                  <i :class="item.icon"></i>
                </div> -->
                <div class="evaluation-item-title">
                  <div class="item-name">{{ item.itemName }}</div>
                  <div class="item-stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= item.score }">
                      ★
                    </span>
                  </div>
                </div>
              </div>
              <div class="evaluation-item-desc">{{ item.batchContent }}</div>
            </div>
            <div class="evaluation-item-footer">
              <div class="evaluation-item-time">{{ item.createTime | filterDate }}</div>
              <button class="evaluation-btn" >班级评比</button>
            </div>
          </div>
        </div>

        <!-- 历史记录弹框 -->
        <el-dialog append-to-body
          title="班级评比历史记录"
          :visible.sync="historyDialogVisible"
          width="1000px"
          center
        >
          <div class="history-filter">
            <el-form size="small" :inline="true" :model="historyQuery" class="demo-form-inline">
              <el-form-item label="班级">
                <el-select v-model="historyQuery.classId" placeholder="选择班级">
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="日期范围">
                <el-date-picker
                  v-model="historyQuery.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="searchHistory">查询</el-button>
                <el-button @click="resetHistoryQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <el-table :data="historyData" style="width: 100%" border>
            <el-table-column prop="itemName" label="评比项目" width="180"></el-table-column>
            <el-table-column prop="className" label="班级" width="100"></el-table-column>
            <el-table-column prop="score" label="评分" width="80">
              <template slot-scope="scope">
                <div class="table-stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= scope.row.score }">★</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="batchContent" label="评价内容"></el-table-column>
            <el-table-column prop="createTime" label="评价时间" width="160">
              <template slot-scope="scope">
                {{ scope.row.createTime | filterDate }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="teacherName" label="评价人" width="100"></el-table-column> -->
          </el-table>
          
          <div class="history-pagination" slot="footer">
            <el-pagination
              background
              layout="prev, pager, next, jumper"
              :total="historyTotal"
              :page-size="historyQuery.pageSize"
              :current-page="historyQuery.pageNo"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-dialog>
      </div>

      <!-- Leader View -->
      <div v-else-if="activeRole === 'leader' && isSchoolLeader">
        <div class="leader-filter">
          <el-form size="small" :inline="true" :model="historyQuery" class="demo-form-inline" label-width="0">
            <el-form-item>
              <el-date-picker
                  v-model="date"
                  type="date"
                  size="medium"
                  class="filter-item"
                  placeholder="请选择日期"
                  :clearable="false"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-select
                  size="medium"
                  class="filter-item"
                  v-model="dutySel"
                  placeholder="请选择值班组"
                  @change="getDutyList"
              >
                  <el-option
                      v-for="item in dutyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                  size="medium"
                  class="filter-item"
                  v-model="gradeId"
                  placeholder="请选择年级"
                  @change="getList"
              >
                  <el-option label="全部年级" :value="0"></el-option>
                  <el-option
                      v-for="item in gradeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="switchRole('')">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-card class="table-card" >
          <el-table 
            stripe
            :data="dateList"
            v-loading.body="listLoading"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :row-class-name="tableRowClassName"
            >
            <el-table-column align="center" label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ scope.row.className }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :key="index"
                v-for="(item, index) in itemList"
                align="center"
                :label="item.itemName"
            >
                <template slot-scope="scope">
              <span v-if="scope.row.scoreList[index].scoreStr === '--'"
              >--</span
              >
                    <el-button
                        v-else
                        type="text"
                        @click.native="
                  showSendDialog(
                    scope.row.scoreList[index].itemId,
                    scope.row.classId,
                    scope.row.className,
                    item.itemName
                  )
                "
                    >
                        {{ scope.row.scoreList[index].scoreStr }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总计">
                <template slot-scope="scope">
              <span style="color: green; font-weight: bold">{{
                scope.row.totalScore
              }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" sortable label="总分排名" prop="ranking">
            </el-table-column>
          </el-table>
        </el-card>

        <el-dialog :title="titleMax" :visible.sync="dialogFormVisible" append-to-body width="800px">
            <div :dialogDate="dialogDate">
                <div class="diarow">
                    <div class="col-md-2">检查人:</div>
                    <div class="col-md-10">
                        {{ dialogDate.createUserName }}
                    </div>
                </div>
                <div class="diarow">
                    <div class="col-md-2">检查时间:</div>
                    <div class="col-md-10">
                        {{ dialogDate.createTime | trimTime }}
                    </div>
                </div>
                <div class="diarow" v-if="dialogDate.isStar === 1">
                    <div class="col-md-2">评分:</div>
                    <div class="col-md-10">
                        <span v-if="score && score.length === 0">0</span>
                        <!-- <i class="el-icon-star-on star-line" ></i> -->
                        <i
                            class="el-icon-star-on star-line"
                            v-else
                            v-for="(item, index) in score"
                            :key="index"
                        ></i>
                    </div>
                </div>
                <div class="diarow" v-if="dialogDate.isStar === 2">
                    <div class="col-md-2">评分:</div>
                    <div class="col-md-10">
                        <div
                            class="subrow"
                            v-for="(item, index) in dialogDate.scoreList"
                            :key="index"
                        >
                            <div class="subcol-md-2">{{ item.checkItemName }}</div>
                            <div class="subcol-md-10">{{ item.score }}</div>
                        </div>
                    </div>
                </div>
                <div class="diarow" v-if="dialogDate.teacherUserName">
                    <div class="col-md-2">是否到岗:</div>
                    <div class="col-md-10">
                        <div
                            v-for="(item, index) in dialogDate.nameAndIsWorkList"
                            :key="index"
                        >
                            <div class="col-md-2">{{ item.teacherName }}</div>
                            <div class="col-md-8">
                                {{ item.isWork == 1 ? "到岗" : "未到岗" }}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="diarow"
                    v-if="dialogDate.picList && dialogDate.picList.length !== 0"
                >
                    <div class="col-md-2">&nbsp;</div>
                    <div class="col-md-10">
                         <image-previewer tag="richtext">
                            <div class="imgBox" v-for="(item, index) in dialogDate.picList"  :key="index">
                                <img :src="`${item.picUrl}?imageMogr2/auto-orient`"/>
                            </div>
                         </image-previewer>
                        
                    </div>
                </div>
                <div class="diarow">
                    <div class="col-md-2">备注:</div>
                    <div class="col-md-10" v-if="dialogDate.batchContent">
                        {{ dialogDate.batchContent }}
                    </div>
                    <div class="col-md-10" v-else>无</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false"
                >确 定
                </el-button
                >
            </div>
        </el-dialog>
      </div>
    </div>
  </div>
  <div v-else></div>
  </template>

<script>
import Moment from 'moment';
import { mapGetters } from 'vuex'
import {possessRole} from '@/api/supplyClass';
import { queryDepartByUserId2 } from "@/api/system"
import { getCheckItemAndScoreByPage } from "@/api/homePage/danyang"
import {  findDutyList, dateStatisticScore, dateDetailByDate } from "@/api/compositeExam";
export default {
  name: 'EvalList',
  filters: {
    filterDate(val) {
      return val ? Moment(val).format("YYYY-MM-DD HH:mm") : "--";
    }
  },
  data() {
    return {
      isClassLeader: false,
      isSchoolLeader: false,
      // 文明班级评比
      activeRole: '',
      classList: [],
      classId: '',
      gradeList: [],
      date: this.$moment(new Date()).format("YYYY-MM-DD"),
      gradeId: 0,
      dutySel: '',
      dateList: [],
      itemList: [],
      evaluationItems: [],
      // 历史记录
      historyDialogVisible: false,
      historyQuery: {
        classId: '',
        dateRange: [],
        pageNo: 1,
        pageSize: 10
      },
      historyData: [],
      historyTotal: 0,
      dialogFormVisible: false,
      dialogDate: {},
      title1: "",
      title2: "",
      titleMax: "",
      score: [],
    }
  },
  computed: {
    ...mapGetters([
      "userInfo"
    ])
  },
  created() {
    this.initRole()
  },
  methods: {
    async initRole() {
      try {
        await Promise.all([
          // 判断是否是 2学校管理员 280校领导 191客服 和 10020微研客服
          possessRole('2,280,191,10020').then(res => {
            this.isSchoolLeader = res.data.data.result
          }),
          // 判断是否是 11班主任
          possessRole('11').then(res => {
            this.isClassLeader = res.data.data.result
          })
        ])
        if (this.isSchoolLeader) {
          this.activeRole = 'leader'
          await this.findDutyListFunc()
        }
        if (this.isClassLeader) {
          this.activeRole = 'teacher'
          await this.initClassList()
        }
        console.log(this.isClassLeader, this.activeRole)
        if (this.activeRole) {
          this.switchRole(this.activeRole)
        }
      } catch (err) {
        console.log(err)
      }
    },
    initClassList() {
			return queryDepartByUserId2(this.userInfo.id, 4)
				.then(res => res.data)
				.then(data => {
					this.classList = data.data || []
          if (this.classList.length) {
            this.classId = this.classList[0].id
          }
				})
    },
    findDutyListFunc() {
      return findDutyList()
        .then((res) => res.data)
        .then((data) => {
            if (data.code === 200) {
                this.dutyList = [];
                data.data.forEach((item) => {
                    this.dutyList.push({
                        value: item.id,
                        label: item.dutyName,
                    });
                });
                this.dutySel = this.dutyList[0].value;
            }
        });
    },
    async switchRole(role = '') {
      this.activeRole = role || this.activeRole;
      if (role === 'teacher') {
        const res = await getCheckItemAndScoreByPage({
          classId: this.classId,
          pageNo: 1,
          pageSize: 5,
        })
        this.evaluationItems = res.data.data.dataList
      } else {
        if (this.date == "Invalid date" || this.date == "") {
            this.$message({
                type: "error",
                message: "时间不能为空！",
            });
            return false;
        }
        const res = await dateStatisticScore({
          checkDate: this.date,
          gradeId: this.gradeId,
          seeType: 1,
          dutyId: this.dutySel
        })
        const data = res.data.data;
        this.dateList = data.countList;
        this.itemList = data.itemList;
        this.gradeList = data.gradeList || []
        if (data.gradeList.length > 0 && !this.gradeId) {
          this.gradeId = this.gradeList[0].id;
        }
      }
    },
    resetQuery() {
      this.date = this.$moment(new Date()).format("YYYY-MM-DD");
      this.gradeId = 0;
      this.dutySel = '';
      this.switchRole()
    },
    dateChangeHandler(value) {
        this.date = this.$moment(value).format("YYYY-MM-DD");
        this.switchRole();
    },
    getDutyList(value) {
        this.dutySel = value;
        this.switchRole();
    },
    getList(value) {
        this.gradeId = value;
        this.switchRole();
    },
    showSendDialog(itemId, classId, className, itemName) {
      this.dialogFormVisible = true;
      dateDetailByDate({
        checkTime: this.date,
        classId: classId,
        itemId: itemId,
      }).then((res) => {
        this.dialogDate = res.data.data[0];
        this.score = [];
        if (this.dialogDate.isStar === 1) {
            for (let i = 0; i < this.dialogDate.score; i++) {
                this.score.push(i);
            }
        }

        this.title1 = className;
        this.title2 = itemName;
        this.titleMax = this.title1 + " " + this.title2;
      });
    },
    async handleClassClick(item) {
      this.classId = item.id
      await this.switchRole('teacher')
    },
    // 打开历史记录弹框
    openHistoryDialog() {
      this.historyDialogVisible = true;
      this.historyQuery.classId = this.classId;
      this.searchHistory();
    },
    // 查询历史记录
    async searchHistory() {
      try {
        const params = {
          classId: this.historyQuery.classId,
          pageNo: this.historyQuery.pageNo,
          pageSize: this.historyQuery.pageSize
        };
        const res = await getCheckItemAndScoreByPage(params);
        this.historyData = res.data.data.dataList;
        this.historyTotal = res.data.data.pagination.total;
      } catch (error) {
        console.error('查询历史记录失败:', error);
      }
    },
    // 重置查询条件
    resetHistoryQuery() {
      this.historyQuery.classId = this.classId;
      this.historyQuery.dateRange = [];
      this.historyQuery.pageNo = 1;
      this.historyQuery.pageSize = 10;
      this.searchHistory();
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.historyQuery.pageSize = size;
      this.historyQuery.pageNo = 1;
      this.searchHistory();
    },
    // 当前页码变化
    handleCurrentChange(current) {
      this.historyCurrentPage = current;
      this.searchHistory();
    },
    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.ranking === 1) {
        return 'success-row';
      } else if (row.ranking <= 3) {
        return 'warning-row';
      }
      return '';
    }
  }
}
</script>

<style lang='scss' scoped>
.eval-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evaluation-item {
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.2s;
}

.evaluation-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-color: var(--primary);
}

.evaluation-item-content {
  margin-bottom: 12px;
}

.evaluation-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.evaluation-item-icon {
  width: 32px;
  height: 32px;
  background: #f0f2f5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #52c41a;
  font-size: 16px;
}

.evaluation-item-title {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
}

.item-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 16px;
  color: #e8e8e8;
  transition: color 0.2s;
}

.star.active {
  color: #faad14;
}

.evaluation-item-desc {
  font-size: 12px;
  color: var(--text-sec);
  line-height: 1.4;
  // margin-left: 44px;
}

.evaluation-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  // margin-left: 44px;
}

.evaluation-item-time {
  font-size: 12px;
  color: var(--text-light);
}

.evaluation-btn {
  font-size: 12px;
  padding: 4px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 12px;
  color: #52c41a;
  cursor: pointer;
  transition: all 0.2s;
}

.evaluation-btn:hover {
  background: #52c41a;
  color: white;
  border-color: #52c41a;
}

/* 领导视图样式保持不变 */
.eval-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: white;
  color: var(--text-sec);
  transition: all 0.2s;
}

.action-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.action-btn.primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.action-btn.primary:hover {
  background: var(--primary-hover);
}
.class-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #f0f2f5;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-sec);
  transition: all 0.2s;
  cursor: pointer;
}
.active-class {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
.class-tag+.class-tag {
  margin-left: 10px;
}
.class-tag:hover {
  background: #e6f7ff;
  border-color: var(--primary);
  color: var(--primary);
}

/* 历史记录弹框样式 */
.history-filter {
  // margin-bottom: 20px;
}

.history-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.table-stars {
  display: flex;
  gap: 2px;
}

.table-stars .star {
  font-size: 14px;
  color: #e8e8e8;
}

.table-stars .star.active {
  color: #faad14;
}

/* 校领导视图样式 */
.leader-filter {
  // margin-bottom: 20px;
}

.filter-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.filter-item {
  margin-right: 12px;
  min-width: 180px;
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* 表格行样式 */
.el-table .warning-row {
  background-color: #fff7e6 !important;
}

.el-table .success-row {
  background-color: #f6ffed !important;
}

/* 弹框样式 */
.diarow {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.diarow .col-md-2 {
  width: 80px;
  font-weight: 500;
  color: var(--text-main);
  margin-right: 16px;
  flex-shrink: 0;
}

.diarow .col-md-10 {
  flex: 1;
  color: var(--text-sec);
  line-height: 1.4;
}

.subrow {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.subrow .subcol-md-2 {
  width: 120px;
  margin-right: 12px;
  flex-shrink: 0;
}

.subrow .subcol-md-10 {
  flex: 1;
}

.imgBox {
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 12px;
}

.imgBox img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.star-line {
  color: #faad14;
  font-size: 16px;
  margin-right: 4px;
}

.el-button--small {
  padding: 9px 15px;
}
.el-select /deep/.el-input__inner {
  padding-left: 15px;
}
</style>
