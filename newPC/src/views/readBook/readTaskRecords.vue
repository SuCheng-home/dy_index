<template>
  <div class="task_record_wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button size="medium" @click="goBack">返回</el-button>          
          <el-date-picker   size="medium" v-model="taskRecordDate" type="date" placeholder="选择日期" :clearable="false" @change="changeRecordDate"></el-date-picker>
          <el-button size="medium" type="primary" @click="remindStu" v-show="isShowRecordStu && !isEndRemind">提醒未打卡学生</el-button>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入学生姓名" v-model.trim="searchName" size="medium"
                    @keyup.enter.native="searchNameHandler">
            <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="task_record_table_wrap">
      <el-table stripe :data="taskRecordList" border style="width: 100%;" :height="maxH">
        <el-table-column align="center" prop="studentNo" label="学号"></el-table-column>
        <el-table-column align="center" prop="studentName" label="学生姓名"></el-table-column>
        <el-table-column align="center" prop="className" label="所在班级"></el-table-column>
        <el-table-column align="center" label="打卡情况">
          <template slot-scope="scope">
            <el-tag  size="mini" v-if="scope.row.status === 2"  type="success">已打卡</el-tag>
            <el-tag  size="mini" v-else type="danger">未打卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatTimeMap}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡内容" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.content || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.fileJson && scope.row.fileJson.length > 2" class="link-type">
                <image-previewer :images="getViewPic(JSON.parse(scope.row.fileJson))" tag="img" text="预览"></image-previewer>
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click.native="emptyRecord(scope.row.id)">清空打卡记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 15px;">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import baseMixin from '@/mixins/baseMixin';
  import mixins from '@/mixins/windowResize';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
  import {getTaskRecordListByDate, resLanguageBookTaskRecord, remindBookTaskRecord} from '@/api/stackRoom';

  export default {
    name: "readTaskRecords",
    components: {
      ImagePreviewer
    },
    data() {
      return {
        isShowRecordStu: true,
        searchName: '',
        taskId: this.$route.query.taskId,
        startDate: this.$route.query.startDate,
        endDate: this.$route.query.endDate,
        isEndRemind: false,
        taskRecordDate: new Date(),
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        taskRecordList: []
      }
    },
    mixins: [mixins, baseMixin],
    filters: {
      formatTimeMap(type) {
        if (type) {
          return type.substring(0, 19);
        }
        return '-';
      }
    },
    created() {
      this.isEndRemind = this.$moment(this.taskRecordDate).format('YYYY-MM-DD') > this.endDate;
      if (this.isEndRemind) {
        this.taskRecordDate = new Date(this.startDate)
      }
      this.getTaskRecordListByDate();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getTaskRecordListByDate() {
        getTaskRecordListByDate({
          createDate: this.$moment(this.taskRecordDate).format('YYYY-MM-DD'),
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          studentName: this.searchName,
          taskId: this.taskId
        }).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.taskRecordList = data.dataList;
            this.pagination.total = data.pagination.total;
          }
        });
      },
      changeRecordDate() {
        this.isShowRecordStu = this.$moment(new Date()).format('YYYY-MM-DD') === this.$moment(this.taskRecordDate).format('YYYY-MM-DD');
        this.searchName = '';
        this.getTaskRecordListByDate();
      },
      searchNameHandler() {
        this.pagination.pageNo = 1;
        this.getTaskRecordListByDate();
      },
      // 提醒未打卡学生
      remindStu() {
        this.$confirm('确认提醒未打卡学生？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remindBookTaskRecord();
        }).catch(() => {
        });
      },
      remindBookTaskRecord() {
        remindBookTaskRecord({
          createDate: this.$moment(this.taskRecordDate).format('YYYY-MM-DD'),
          taskId: this.taskId
        }).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('提醒成功');
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      // 清空记录
      emptyRecord(recordId) {
        this.$confirm('是否清空当前打卡记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resLanguageBookTaskRecord(recordId);
        }).catch(() => {
        });
      },
      resLanguageBookTaskRecord(recordId) {
        resLanguageBookTaskRecord({
          recordId: recordId
        }).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('操作成功');
            this.getTaskRecordListByDate();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.getTaskRecordListByDate();
      },
      currentChangeHandler() {
        this.getTaskRecordListByDate();
      },
      getViewPic(picList){
        return picList.map(function(item){
          return {'src': item.picUrl}
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .task_record_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;

    }
  }
</style>
