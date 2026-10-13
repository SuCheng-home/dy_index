<template>
  <div class="leave-board-container leaveBoardindex">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="title">
        <i class="el-icon-school"></i>
        <h1>学校教师请假管理系统</h1>
      </div>
      <div class="header-info">
        <div class="date-time">{{ currentDateTime }}</div>
        <div class="user-info">
          <i class="el-icon-s-custom"></i>
          <span>门卫室</span>
        </div>
      </div>
    </div>

    <!-- 请假状态概览 -->
    <div class="status-overview">
      <h2>
        <i class="el-icon-data-analysis"></i>
        请假状态概览
      </h2>
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-title">今日请假总数</div>
          <div class="card-value">{{bignum}}</div>
          <div class="card-desc">教师请假</div>
          <div class="card-icon">
            <i class="el-icon-notebook-2" style="color: #64ffda;"></i>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-title">待离校</div>
          <div class="card-value">{{pendingTeachers.length}}</div>
          <div class="card-desc">请假教师待离校</div>
          <div class="card-icon">
            <i class="el-icon-location-outline" style="color: #64ffda;"></i>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-title">已离校</div>
          <div class="card-value">{{leftTeachers.length}}</div>
          <div class="card-desc">请假教师已离校</div>
          <div class="card-icon ">
            <i class="el-icon-position" style="color: #64ffda;"></i>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-title">已返校</div>
          <div class="card-value">{{returnedTeachers.length}}</div>
          <div class="card-desc">请假教师已返校</div>
          <div class="card-icon">
            <i class="el-icon-office-building" style="color: #64ffda;"></i>
          </div>
        </div>
        
      </div>
    </div>

    <!-- 请假教师列表 -->
    <div class="teacher-list">
      <div class="list-header">
        <h2>
          <i class="el-icon-user"></i>
          请假教师列表
        </h2>
      </div>

      <div class="list-content">
        <!-- 待离校 -->
        <div class="list-section">
          <div class="section-header">
            <span class="section-title"><i class="el-icon-time"></i> 待离校</span>
            <span class="section-count">{{pendingTeachers.length}}</span>
          </div>
          <div class="teacher-cards">
            <div class="teacher-card" v-for="teacher in pendingTeachers" :key="teacher.id">
              <div class="teacher-status">
                <span class="status-badge pending">待离校</span>
              </div>
              <div class="teacher-header">
                <div class="teacher-avatar" :style="{ backgroundColor: getAvatarColor(teacher.teacherName) }">
                  {{ teacher.teacherName.charAt(0) }}
                </div>
                <div class="teacher-info">
                  <h3>{{ teacher.teacherName }}</h3>
                  <div class="teacher-department">{{ teacher.departName }}</div>
                  <div class="teacher-detail">
                    <i class="el-icon-time"></i>
                    请假时间: {{ teacher.startTime }}
                  </div>
                  <div class="teacher-detail">
                    <i class="el-icon-circle-check"></i>
                    预计返校: {{ teacher.endTime }}
                  </div>
                  <div class="teacher-detail">
                    <i class="el-icon-document"></i>
                    请假原因: {{ teacher.content }}
                  </div>
                </div>
              </div>
              <div class="action-buttons">
                <el-button size="small" type="primary" @click="handleConfirmLeave(teacher)">
                  <i class="el-icon-check"></i> 确认离校
                </el-button>
                <el-button size="small" type="success" @click="handleDirectReturn(teacher)">
                  <i class="el-icon-back"></i> 直接返校
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 已离校 -->
        <div class="list-section">
          <div class="section-header">
            <span class="section-title"><i class="el-icon-location-outline"></i> 已离校</span>
            <span class="section-count">{{leftTeachers.length}}</span>
          </div>
          <div class="teacher-cards">
            <div class="teacher-card" v-for="teacher in leftTeachers" :key="teacher.id">
              <div class="teacher-status">
                <span class="status-badge left">已离校</span>
              </div>
              <div class="teacher-header">
                <div class="teacher-avatar" :style="{ backgroundColor: getAvatarColor(teacher.teacherName) }">
                  {{ teacher.teacherName.charAt(0) }}
                </div>
                <div class="teacher-info">
                  <h3>{{ teacher.teacherName }}</h3>
                  <div class="teacher-department">{{ teacher.departName }}</div>
                  <div class="teacher-detail">
                    <i class="el-icon-time"></i>
                    请假时间: {{ teacher.startTime }}
                  </div>
                  <div class="teacher-detail">
                    <i class="el-icon-circle-check"></i>
                    预计返校: {{ teacher.endTime }}
                  </div>
                  <div class="teacher-detail warning" v-if="timeDifference(teacher.endTime)">
                    <i class="el-icon-warning"></i>
                    已超时: {{timeDifference(teacher.endTime)}}
                  </div>
                  <div class="teacher-detail">
                    <i class="el-icon-document"></i>
                    请假原因: {{ teacher.content }}
                  </div>
                </div>
              </div>
              <div class="action-buttons">
                <el-button size="small" type="warning" @click="handleConfirmReturn(teacher)">
                  <i class="el-icon-back"></i> 确认返校
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 已返校 -->
        <div class="list-section">
          <div class="section-header">
            <span class="section-title"><i class="el-icon-check"></i> 已返校</span>
            <span class="section-count">{{returnedTeachers.length}}</span>
          </div>
          <div class="teacher-cards">
            <div class="teacher-card" v-for="teacher in returnedTeachers" :key="teacher.id">
              <div class="teacher-status">
                <span class="status-badge returned">已返校</span>
              </div>
              <div class="teacher-header">
                <div class="teacher-avatar" :style="{ backgroundColor: getAvatarColor(teacher.teacherName) }">
                  {{ teacher.teacherName.charAt(0) }}
                </div>
                <div class="teacher-info">
                  <h3>{{ teacher.teacherName }}</h3>
                  <div class="teacher-department">{{ teacher.departName }}</div>
                  <div class="teacher-detail">
                    <i class="el-icon-time"></i>
                    请假时间: {{ teacher.startTime }}
                  </div>
                  <div class="teacher-detail">
                    <i class="el-icon-circle-check"></i>
                    预计返校: {{ teacher.endTime }}
                  </div>
                  <div class="teacher-detail">
                    <i class="el-icon-document"></i>
                    请假原因: {{ teacher.content }}
                  </div>
                </div>
              </div>
              <div class="completed-tag">已完成请假流程</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <el-dialog
    :visible.sync="dialogVisible" :close-on-click-modal="false"
      :title="dialogTitle"
      width="400px"
      top="20%"
      custom-class="custom-dialog"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-content">
        {{ dialogMessage }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="cancel-button">取消</el-button>
        <el-button type="primary" @click="handleConfirm" class="confirm-button">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getThAskleaveFouLListByLeaveSchState,updateThAskLeaveFourLeaveSchState} from '@/api/teacherLeave4';
export default {
  name: 'LeaveBoardIndex',
  data() {
    return {
      currentDateTime: '',
      searchQuery: '',
      statusFilter: 'all',
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogTeacher: null,
      bignum:0,
      pendingTeachers: [],
      leftTeachers: [],
      returnedTeachers: [],
      leaveSchState:0
    }
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 1000);
     this.getThAskleaveFouLListByLeaveSchState();
    setInterval(this.getThAskleaveFouLListByLeaveSchState, 300000);
  },
  methods: {
    getThAskleaveFouLListByLeaveSchState(){         
          getThAskleaveFouLListByLeaveSchState({searchDate:this.$moment().format("YYYY-MM-DD"),leaveSchState:-1}).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.bignum = data.length;
          }
        }).catch(() => {
        });
         getThAskleaveFouLListByLeaveSchState({searchDate:this.$moment().format("YYYY-MM-DD"),leaveSchState:0}).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.pendingTeachers = data;
          }
        }).catch(() => {
        });
         getThAskleaveFouLListByLeaveSchState({searchDate:this.$moment().format("YYYY-MM-DD"),leaveSchState:2}).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.leftTeachers = data;
          }
        }).catch(() => {
        });
        getThAskleaveFouLListByLeaveSchState({searchDate:this.$moment().format("YYYY-MM-DD"),leaveSchState:3}).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.returnedTeachers = data;
          }
        }).catch(() => {
        });
    },
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      const second = String(now.getSeconds()).padStart(2, '0');
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[now.getDay()];
      this.currentDateTime = `${year}年${month}月${day}日${weekday} ${hour}:${minute}:${second}`;
    },
    openConfirmDialog(title, message, teacher,leaveSchState) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialogTeacher = teacher;
      this.dialogVisible = true;
      this.leaveSchState=leaveSchState
    },
    handleConfirm() {      
      updateThAskLeaveFourLeaveSchState({leaveSchState:this.leaveSchState,id:this.dialogTeacher.id}).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '操作成功！',
                                            type: 'success',
                                            duration: 1000
                                        })
                                      this.getThAskleaveFouLListByLeaveSchState()
                                       this.dialogVisible = false;
                }
            }).catch(() => {})
     
    },
    handleConfirmLeave(teacher) {    
      this.openConfirmDialog('确认离校', `确认 ${teacher.teacherName} 老师已离校？`, teacher,2);
    },
    handleDirectReturn(teacher) {
      this.openConfirmDialog('直接返校', `确认 ${teacher.teacherName} 老师直接返校？`, teacher,3);
    },
    handleConfirmReturn(teacher) {
      this.openConfirmDialog('确认返校', `确认 ${teacher.teacherName} 老师已返校？`, teacher,3);
    },
    getAvatarColor(name) {
      // 基于名字生成一个唯一的颜色
      const colors = [
        '#66BB6A', '#42A5F5', '#FFB74D', '#BA68C8',
        '#EF5350', '#4DD0E1', '#FF7043', '#78909C',
        '#A1887F', '#9575CD', '#5C6BC0', '#4DB6AC'
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
    timeDifference(endTimes) {
    let startTime = new Date(endTimes)
    let endTime = new Date()
    let diff = endTime.getTime() - startTime.getTime()
    if(diff>0){
        let hours = Math.floor(diff / (1000 * 60 * 60)) // 获取小时数
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) // 获取分钟数
        return (hours>0?(hours+'小时'):"")+(minutes>0?(minutes+'分钟'):"")
    }else{
        return ""
    }  
  }
  }
}
</script>
<style>
.leaveBoardindex .custom-dialog {
  background: rgba(17, 34, 64, 0.9);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(100, 255, 218, 0.3);
  overflow: hidden;
}

.leaveBoardindex .custom-dialog .el-dialog__header {
  padding: 15px 20px;
}

.leaveBoardindex .custom-dialog .el-dialog__title {
  color: #64ffda;
  font-size: 16px;
  font-weight: bold;
}

.leaveBoardindex .custom-dialog .el-dialog__body {
  padding: 20px;
  color: #e6f1ff;
}

.leaveBoardindex .dialog-content {
  font-size: 14px;
  line-height: 1.5;
}

.leaveBoardindex .custom-dialog .el-dialog__footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

<style lang="scss" scoped>
.leave-board-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a192f 0%, #172a45 100%);
  color: #e6f1ff;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow: hidden;
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
}

/* 主题色变量 - 设计图颜色 */
:root {
  --primary-color: #64ffda;
  --primary-light: #a1ffec;
  --primary-dark: #2de8d6;
  --secondary-color: #64ffda;
  --accent-color: #4DB6AC;
  --warning-color: #FFA726;
  --danger-color: #EF5350;
  --success-color: #64ffda;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background: rgba(10, 25, 47, 0.8);
  border-bottom: 1px solid rgba(76, 175, 80, 0.5);

  .title {
    display: flex;
    align-items: center;
    color:#64ffda;
    i {
      font-size: 24px;
      color: var(--primary-color);
      margin-right: 12px;
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
      color: var(--primary-color);
    }
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 30px;

    .date-time {
      font-size: 17px;
      color: #8892b0;
      font-weight: bold;
    }

    .user-info {
      display: flex;
      align-items: center;

      i {
        font-size: 20px;
        color: #64ffda;
        margin-right: 8px;
      }

      span {
        font-size: 20px;
        color: #e6f1ff;
        font-weight: bold;
      }
    }
  }
}

.status-overview {
  padding: 30px;

  h2 {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--primary-color);

    i {
      font-size: 20px;
      color: #64ffda;
      margin-right: 10px;
    }
  }

  .overview-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    .overview-card {
      background: rgba(17, 34, 64, 0.8);
      border: 1px solid rgba(100, 255, 218, 0.5);
      border-radius: 8px;
      padding: 20px;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 0 10px #64ffda, 0 0 20px rgba(100, 255, 218, 0.5);
      }

      .card-title {
        font-size: 14px;
        color: #8892b0;
        margin-bottom: 10px;
      }

      .card-value {
        font-size: 36px;
        font-weight: bold;
        color:#64ffda;
        margin-bottom: 10px;
      }

      .card-desc {
        font-size: 12px;
        color: #8892b0;
      }

      .card-icon {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(100, 255, 218, 0.5);

        i {
          font-size: 20px;
          color: var(--primary-color);
        }

        &.warning {
          background: rgba(255, 167, 38, 0.5);

          i {
            color: var(--warning-color);
          }
        }

        &.success {
          background: rgba(100, 255, 218, 0.5);

          i {
            color: var(--primary-color);
          }
        }

        &.info {
          background: rgba(77, 182, 172, 0.5);

          i {
            color: #4DB6AC;
          }
        }
      }
    }
  }
}

.teacher-list {
  padding: 0 30px 30px;

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #e6f1ff;

      i {
      font-size: 20px;
      color: #64ffda;
      margin-right: 10px;
    }
    }

    .list-controls {
      display: flex;
      gap: 10px;

      .el-input {
        width: 200px;

        .el-input__inner {
          background: rgba(17, 34, 64, 0.8);
          border: 1px solid rgba(76, 175, 80, 0.5);
          color: #e6f1ff;

          &::placeholder {
            color: #8892b0;
          }
        }

        .el-input__prefix {
          color: var(--primary-color);
        }
      }

      .el-select {
        .el-select__input {
          color: #e6f1ff;
        }

        .el-select__caret {
          color: var(--primary-color);
        }

        .el-select__dropdown {
          background: rgba(17, 34, 64, 0.95);
          border: 1px solid rgba(76, 175, 80, 0.5);

          .el-option {
            color: #e6f1ff;

            &:hover {
              background: rgba(76, 175, 80, 0.5);
            }

            &:selected {
              background: rgba(76, 175, 80, 0.3);
            }
          }
        }
      }
    }
  }

  .list-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    height: 600px;

    .list-section {
      background: rgba(17, 34, 64, 0.8);
      border: 1px solid rgba(100, 255, 218, 0.3);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 0 20px rgba(100, 255, 218, 0.2);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        animation: glow 3s ease-in-out infinite;
      }

      @keyframes glow {
        0%, 100% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #e6f1ff;
          display: flex;
          align-items: center;

          i {
            margin-right: 8px;
            color: var(--primary-color);
          }
        }

        .section-count {
          background: rgba(100, 255, 218, 0.2);
          color: var(--primary-color);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }
      }

      .teacher-cards {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow-y: auto;
        padding-right: 10px;

        /* 自定义滚动条 */
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: rgba(10, 25, 47, 0.5);
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(100, 255, 218, 0.5);
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 255, 218, 0.8);
        }

        .teacher-card {
          background: rgba(10, 25, 47, 0.8);
          border: 1px solid rgba(100, 255, 218, 0.2);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          position: relative;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
          }

          .teacher-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 10px;
          }

          .teacher-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
          }

          .teacher-info {
            flex: 1;

            h3 {
              font-size: 14px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 2px;
            }

            .teacher-department {
              font-size: 12px;
              color: #8892b0;
              margin-bottom: 8px;
            }
          }

          .action-buttons {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            justify-content: flex-end;

            .el-button {
              border-radius: 4px;
              font-size: 11px;
              padding: 4px 10px;
              height: 28px;

              &.el-button--primary {
                background: rgba(100, 255, 218, 0.2);
                border-color: #64ffda;
                color: #64ffda;

                &:hover {
                  background: rgba(100, 255, 218, 0.3);
                }
              }

              &.el-button--success {
                background: rgba(76, 175, 80, 0.2);
                border-color: #4CAF50;
                color: #4CAF50;

                &:hover {
                  background: rgba(76, 175, 80, 0.3);
                }
              }

              &.el-button--warning {
                background: rgba(255, 167, 38, 0.2);
                border-color: #FFA726;
                color: #FFA726;

                &:hover {
                  background: rgba(255, 167, 38, 0.3);
                }
              }
            }
          }

          .teacher-status {
            position: absolute;
            top: 15px;
            right: 15px;

            .status-badge {
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

              &.pending {
                background: rgba(255, 167, 38, 0.3);
                color: #FFA726;
                border: 1px solid rgba(255, 167, 38, 0.5);
              }

              &.left {
                background: rgba(239, 83, 80, 0.3);
                color: #EF5350;
                border: 1px solid rgba(239, 83, 80, 0.5);
              }

              &.returned {
                background: rgba(100, 255, 218, 0.3);
                color: #64ffda;
                border: 1px solid rgba(100, 255, 218, 0.5);
              }
            }
          }

          .teacher-info {
            flex: 1;

            .teacher-detail {
              font-size: 12px;
              color: #8892b0;
              margin-bottom: 4px;
              display: flex;
              align-items: center;

              i {
                font-size: 12px;
                margin-right: 6px;
                color: var(--primary-color);
              }

              &.warning {
                color: #dc3545;

                i {
                  color: #dc3545;
                }
              }
            }
          }

          .completed-tag {
            font-size: 11px;
            color: #8892b0;
            text-align: right;
            margin-top: 8px;
            padding: 4px 10px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            display: inline-block;
            float: right;
          }
        }
      }
    }
  }
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .status-overview .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .teacher-list .list-content {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .status-overview .overview-cards {
    grid-template-columns: 1fr;
  }

  .teacher-list .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .teacher-list .list-controls {
    width: 100%;

    .el-input {
      flex: 1;
    }
  }

  .teacher-card {
    flex-direction: column;
    align-items: flex-start;

    .teacher-status {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .action-buttons {
        flex-direction: row;
      }
    }
  }
}

/* 确认弹框样式 */


.cancel-button {
  background: transparent;
  border: 1px solid #8892b0;
  color: #8892b0;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 14px;

  &:hover {
    background: rgba(136, 146, 176, 0.1);
  }
}

.confirm-button {
  background: rgba(100, 255, 218, 0.2);
  border: 1px solid #64ffda;
  color: #64ffda;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 14px;

  &:hover {
    background: rgba(100, 255, 218, 0.3);
  }
}
</style>