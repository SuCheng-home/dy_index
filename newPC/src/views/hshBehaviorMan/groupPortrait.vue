<template>
  <div class="group-portrait">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <term-grade-class-selector
            :queryArgs="queryArgs"
            :isShowDuration="false"
            v-model="obj"
            @input="handleSelectorInput"
            ref="selector">
          </term-grade-class-selector>
     
          <el-select size="medium" v-model="currentBehTypeId" placeholder="请选择评价项" @change="onSearch">
            <el-option label="全部" :value="0"></el-option>
            <el-option v-for="item in behTypeList" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <div class="content scrollStyle">
      <div class="rank-card">
        <div class="rank-header">
          <div class="rank-title-wrap">
            <span class="rank-title">{{ obj.className || '' }} · 小组活跃度排行</span>
            <span class="rank-sub">共{{ groupList.length }}个小组 · 点击小组名称查看详情</span>
          </div>
        </div>
        <div class="rank-empty" v-if="!groupList.length">
          <div class="empty-illustration">
            <div class="empty-circle">
              <span class="empty-icon">👨‍👩</span>
            </div>
            <div class="empty-dot dot1"></div>
            <div class="empty-dot dot2"></div>
            <div class="empty-dot dot3"></div>
          </div>
          <div class="empty-title">暂无小组数据</div>
          <div class="empty-desc">当前班级还未创建小组，请先在课堂中划分小组</div>
        </div>

        <div class="rank-list" v-else>
          <div class="rank-item" v-for="(item, index) in groupList" :key="item.id" @click="goDetail(item)">
            <div class="rank-no" :class="rankNoClass(index)">
              <span v-if="index < 3">{{ ['🥇','🥈','🥉'][index] }}</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="rank-info">
              <div class="rank-name">{{ item.title }}</div>
              <div class="rank-meta">{{ (item.groupTeahcerStuList || []).length }} 名成员</div>
            </div>
            <div class="rank-members">
              <span class="member-tag" v-for="stu in (item.groupTeahcerStuList || []).slice(0, 8)"
                :key="stu.id || stu.studentId">
                {{ stu.studentName || stu.name || stu.title }}
              </span>
              <span class="more" v-if="(item.groupTeahcerStuList || []).length > 8">
                +{{ item.groupTeahcerStuList.length - 8 }}
              </span>
            </div>
            <div class="rank-score">
              <span class="score">{{ item.totalScore || 0 }}</span>
              <span class="unit">分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import TermGradeClassSelector from '@/components/TermGradeClassSelector';
import { getHshSchoolBehaviorPortraitGroupList } from '@/api/hshBehaviorMan';
import { getSchoolBehaviorTypeListBySchoolId } from '@/api/ketang';

export default {
  name: 'groupPortrait',
  mixins: [mixins],
  components: { TermGradeClassSelector },
  data() {
    return {
      obj: {
        termId: '',
        duration: ['', ''],
        gradeId: '',
        classId: ''
      },
      queryArgs: {
        all: true,
        manager: false,
        notlimit: true,
        submanager: false,
        teacher: false
      },
      behTypeList: [],
      currentBehTypeId: 0,
      groupList: []
    };
  },
  created() {
    this.getBehTypeList();
  },
  methods: {
    // 获取评价项列表
    getBehTypeList() {
      getSchoolBehaviorTypeListBySchoolId(2)
        .then(res => res.data)
        .then(data => {
          this.behTypeList = (data && data.data) || [];
        });
    },
    handleSelectorInput(val) {
      if (!val.termId && this.$refs.selector && this.$refs.selector.termList && this.$refs.selector.termList.length > 0) {
        this.obj = Object.assign({}, val, { termId: this.$refs.selector.termList[0].id });
        return;
      }
      this.onSearch();
    },
    onSearch() {
      this.getList();
    },
    getList() {
      if (!this.obj.termId || !this.obj.classId) {
        this.groupList = [];
        return;
      }
      const params = {
        behTypeId: this.currentBehTypeId || 0,
        classId: this.obj.classId,
        schoolTimeId: this.obj.termId
      };
      getHshSchoolBehaviorPortraitGroupList(params).then(res => {
        const data = res.data;
        if (data.code === 200 && data.data) {
          this.groupList = data.data || [];
        } else {
          this.groupList = [];
        }
      });
    },
    rankNoClass(index) {
      if (index === 0) return 'rank-1';
      if (index === 1) return 'rank-2';
      if (index === 2) return 'rank-3';
      return '';
    },
    goDetail(item) {
      this.$router.push({
        path: '/main/stuEvaluate/hshBehaviorMan/groupPortraitDetail',
        query: {
          groupId: item.id,
          groupName: item.title,
          schoolTimeId: this.obj.termId,
          gradeId: this.obj.gradeId || '',
          classId: this.obj.classId || '',
          className: this.obj.className || ''
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.group-portrait {
  padding: 12px;
  box-sizing: border-box;
  font-size: 14px;

  .header {
    padding-bottom: 10px;

    ::v-deep .el-select {
      width: 200px;
      margin-right: 10px;
    }
  }

  .content {
    overflow: auto;
  }

  .rank-card {
    background: #fff;
    border: 1px solid #eef0f3;
    border-radius: 12px;
    padding: 18px 20px;

    .rank-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;

      .rank-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-right: 10px;
      }

      .rank-sub {
        font-size: 12px;
        color: #9ca3af;
      }
    }

    .rank-empty {
      text-align: center;
      padding: 60px 0 80px;

      .empty-illustration {
        position: relative;
        width: 140px;
        height: 140px;
        margin: 0 auto 24px;

        .empty-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, #eef2ff 0%, #fce7f3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
          animation: emptyFloat 3s ease-in-out infinite;

          .empty-icon {
            font-size: 52px;
            filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2));
          }
        }

        .empty-dot {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;

          &.dot1 {
            width: 14px;
            height: 14px;
            top: 12px;
            right: 16px;
            background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
            animation: emptyPulse 2s ease-in-out infinite;
          }

          &.dot2 {
            width: 10px;
            height: 10px;
            bottom: 18px;
            left: 10px;
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            animation: emptyPulse 2s ease-in-out infinite 0.4s;
          }

          &.dot3 {
            width: 8px;
            height: 8px;
            top: 28px;
            left: 18px;
            background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
            animation: emptyPulse 2s ease-in-out infinite 0.8s;
          }
        }
      }

      .empty-title {
        font-size: 16px;
        font-weight: 600;
        color: #4b5563;
        margin-bottom: 8px;
      }

      .empty-desc {
        font-size: 13px;
        color: #9ca3af;
      }
    }

    @keyframes emptyFloat {
      0%, 100% { transform: translate(-50%, -50%); }
      50% { transform: translate(-50%, -58%); }
    }

    @keyframes emptyPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.3); opacity: 1; }
    }

    .rank-list {
        padding: 20px 150px;
      .rank-item {
        width: 85%;
        display: flex;
        align-items: center;
        padding: 14px 16px;
        margin-bottom: 10px;
        background: #fafbfc;
        border: 1px solid #f0f2f5;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #3b82f6;
          background: #f0f7ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.08);
        }

        &:last-child {
          margin-bottom: 0;
        }

        .rank-no {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 14px;
          flex-shrink: 0;

          &.rank-1,
          &.rank-2,
          &.rank-3 {
            background: transparent;
            font-size: 22px;
          }
        }

        .rank-info {
          width: 180px;
          flex-shrink: 0;

          .rank-name {
            font-size: 15px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
          }

          .rank-meta {
            font-size: 12px;
            color: #9ca3af;
          }
        }

        .rank-members {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 12px;

          .member-tag {
            background: #eef2ff;
            color: #4f46e5;
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 999px;
          }

          .more {
            background: #f3f4f6;
            color: #6b7280;
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 999px;
          }
        }

        .rank-score {
          flex-shrink: 0;
          text-align: right;

          .score {
            font-size: 22px;
            font-weight: 700;
            color: #f59e0b;
          }

          .unit {
            font-size: 12px;
            color: #9ca3af;
            margin-left: 2px;
          }
        }
      }
    }
  }
}
</style>
