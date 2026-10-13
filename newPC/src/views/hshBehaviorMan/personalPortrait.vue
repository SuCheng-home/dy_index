<template>
  <div class="personal-portrait">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <term-grade-class-selector
            :queryArgs="queryArgs"
            :isShowDuration="false"
            v-model="obj"
            @input="handleSelectorInput"
            ref="selector">
          </term-grade-class-selector>
        </el-col>
        <el-col :span="5"> <el-input class="search-input" placeholder="请输入学生姓名" icon="el-icon-search" size="medium"
            @change="onSearch" v-model.trim="studentName">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="onSearch"></el-button>
          </el-input></el-col>
      </el-row>
    </div>

    <div class="schoolWrap scrollStyle">
      <el-table :data="dataList" border stripe :height="maxH" ref="table">
        <el-table-column prop="studentName" fixed label="学生姓名" align="center" min-width="100"></el-table-column>
        <el-table-column prop="studentNo" label="学号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="gradeName" label="年级" align="center" min-width="100"></el-table-column>
        <el-table-column prop="className" label="班级" align="center" min-width="100"></el-table-column>

        <el-table-column v-for="(titleItem, tIdx) in titleList" :key="'title-' + titleItem.id" :label="titleItem.title"
          align="center" min-width="110">
          <template slot-scope="scope">
            <span class="link" @click="goDetail(scope.row, titleItem)">
              {{ scope.row.stuScoreStringList && scope.row.stuScoreStringList[tIdx] || 0 }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="totalScore" label="总分" fixed="right" align="center" min-width="100">
          <template slot-scope="scope">
            <span class="link" @click="goDetail(scope.row)">{{ scope.row.stuScore || 0 }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
        :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import BaseMixin from '@/mixins/baseMixin';
import TermGradeClassSelector from '@/components/TermGradeClassSelector';
import { getHshSchoolBehaviorScoreList } from '@/api/hshBehaviorMan';

export default {
  name: 'personalPortrait',
  mixins: [mixins, BaseMixin],
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
      studentName: '',
      dataList: [],
      titleList: [],
      timer: null
    }
  },
  watch: {
    obj: {
      handler(val) {
        if (val && val.termId) {
          this.onSearch();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.timer = setTimeout(() => {
        this.$refs.table && this.$refs.table.doLayout();
      }, 300);
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    handleSelectorInput(val) {
      if (!val.termId && this.$refs.selector && this.$refs.selector.termList && this.$refs.selector.termList.length > 0) {
        this.obj = Object.assign({}, val, { termId: this.$refs.selector.termList[0].id });
        return;
      }
      this.onSearch();
    },
    onSearch() {
      this.pagination.pageNo = 1;
      this.getList();
    },
    getList() {
      if (!this.obj.termId) return;
      const params = {
        schoolTimeId: this.obj.termId,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      };
      if (this.obj.gradeId) params.gradeId = this.obj.gradeId;
      if (this.obj.classId) params.classId = this.obj.classId;
      if (this.studentName) params.studentName = this.studentName;

      getHshSchoolBehaviorScoreList(params).then(res => {
        const data = res.data;
        if (data.code === 200 && data.data) {
          this.dataList = data.data.dataList || [];
          this.titleList = data.data.titleList || [];
          this.pagination.total = (data.data.pagination && data.data.pagination.total) || 0;
          this.$nextTick(() => {
            this.timer = setTimeout(() => {
              this.$refs.table && this.$refs.table.doLayout();
            }, 300);
          });
        } else {
          this.dataList = [];
          this.titleList = [];
          this.pagination.total = 0;
        }
      });
    },
    sizeChangeHandler(pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      this.getList();
    },
    currentChangeHandler(pageNo) {
      this.pagination.pageNo = pageNo;
      this.getList();
    },
    goDetail(row, titleItem) {
      this.$router.push({
        path: '/main/stuEvaluate/hshBehaviorMan/personalPortraitDetail',
        query: {
          studentId: row.studentId,
          studentName: row.studentName,
          schoolTimeId: this.obj.termId,
          classId: row.classId || this.obj.classId || '',
          gradeId: row.gradeId || this.obj.gradeId || '',
          behTypeId: titleItem ? titleItem.id : 0,
          titleName: titleItem ? titleItem.title : '总分',
          studentNo: row.studentNo,
          gradeName: row.gradeName,
          className: row.className,
          avatar: row.avatar || ''
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.personal-portrait {
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

  .link {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
