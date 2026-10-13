<template>
  <div class="memorabiliaList">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <!---->
          <template>
            <el-select
              class="select-width"
              v-model="schoolTimeCode"
              placeholder="请选择学期"
              @change="changeSchool"
              size="medium"
            >
              <el-option
                v-for="(item,index) in schoolYearList"
                :key="index"
                :label="item.schoolTimeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template>
            <el-select
              class="select-width"
              v-model="departCode"
              placeholder="请选择部门"
              @change="changeDepart"
              size="medium"
            >
              <el-option label="全部部门" :value="0"></el-option>
              <el-option
                v-for="departItem in departList"
                :key="departItem.id"
                :label="departItem.name"
                :value="departItem.id"
              ></el-option>
            </el-select>
          </template>
          <template>
            <el-date-picker
              v-model="daterange"
              type="daterange" class="time-select mywidthdaterange"
              size="medium"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              @change="findDate()"
            ></el-date-picker>
          </template>
          <el-button type="primary" size="medium"  @click="examHandler">统计</el-button>
          <el-button
            type="primary"
            size="medium"
             v-if="listData.length"
            @click="jumpTo('memorabiliaStaticExport',{departId:departCode,schoolTermId:schoolTimeCode,startTimeStr:startTimeStr,endTimeStr:endTimeStr})"
          >导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
        :height="maxH"
        :data="listData"
        v-loading.body="tabLoading"
      >
        <el-table-column align="center" label="日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="link-type"
              @click="gotoDetail(scope.row)"
            >{{ scope.row.happenTimeStr || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上报人" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createUserName || '--' }}</template>
        </el-table-column>
        <el-table-column align="center" label="部门" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.departName || '--' }}</template>
        </el-table-column>
        <el-table-column align="center" label="上报时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createTime | filterDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag  size="mini" type="info"  v-if="scope.row.state == 0">草稿</el-tag>
            <el-tag  size="mini"  v-if="scope.row.state == 1">已上报</el-tag>
            <el-tag  size="mini" type="success"  v-if="scope.row.state == 2">重大事件</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="jumpTo('editMemorabiliaStatic',{id:scope.row.id})"
            >编辑</el-button>
            <el-button
              size="small"
              type="text"
              @click="delHandler(scope.row.id)"
            class="text-danger buttontextred">删除</el-button>
            <el-button
              size="small"
              type="text"
              @click="delImportEvent(scope.row.id)"
              v-if="scope.row.state===2"
            >撤销</el-button>
            <el-button
              size="small"
              type="text"
              @click="setImportEvent(scope.row.id)"
              v-if="scope.row.state!==2"
            >设置为重大事件</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-sizes="[10,20,30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixins/windowResize";
import moment from "moment";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {
  findDepartList,
  getSchoolTimeAllList,
  findBigEventNoteListBySta,
  deleteBigEventNote,
  updateBigEventNote,
} from "@/api/memorabilia";
export default {
  components: { ImagePreviewer },
  data() {
    return {
      daterange: [new Date(), new Date()],
      departList: [],
      departCode: "",
      departName: "",
      schoolYearList: [],
      schoolName: "",
      schoolTimeCode: "",
      pageNo: 1,
      pageSize: 20,
      startTimeStr: "",
      endTimeStr: "",
      listData: [],
      total: 0,
      isBtnSearch: false,
    };
  },
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.startTimeStr = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
    this.endTimeStr = this.$moment(this.daterange[1]).format("YYYY-MM-DD");
    this.departCode = 0;
    this.departName = "";
    this.findDepartListFunc();
    this.getSchoolTimeAllListFunc();
  },
  mounted() {},
  filters: {
    filterDate(date) {
      return date
        ? moment(new Date(Number(date))).format("YYYY-MM-DD HH:mm:ss")
        : "";
    },
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    findDate() {
      this.pageNo = 1;
      this.startTimeStr = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
      this.endTimeStr = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
    },
    examHandler() {
      this.isBtnSearch = true;
      this.findBigEventNoteListByStaFunc();
    },
    updateBigEventNoteFunc(id, state) {
      updateBigEventNote({
        id: id,
        state: state,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200) {
            if (state == 2) {
              this.$message({
                type: "success",
                message: "设置成功!",
              });
            }
            if (state == 1) {
              this.$message({
                type: "success",
                message: "取消成功!",
              });
            }
            this.findBigEventNoteListByStaFunc();
          }
        });
    },
    setImportEvent(id) {
      var This = this;
      this.$confirm("您确定设置为重大事件吗?", "提示", {
        type: "error",
      })
        .then(() => {
          This.updateBigEventNoteFunc(id, 2);
        })
        .catch(() => {});
    },
    delImportEvent(id) {
      var This = this;
      this.$confirm("您确定取消该重大事件吗?", "提示", {
        type: "error",
      })
        .then(() => {
          This.updateBigEventNoteFunc(id, 1);
        })
        .catch(() => {});
    },
    delHandler(id) {
      let _this = this;
      this.$confirm("您确定删除该大事件吗?", "提示", {
        type: "error",
      })
        .then(() => {
          deleteBigEventNote({
            id: id,
          }).then((res) => {
            let data = res.data;
            if (data.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.findBigEventNoteListByStaFunc();
            } else {
              this.$message({
                type: "error",
                message: data.msg,
              });
            }
          });
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageNo = 1;
      this.pageSize = val;
      this.findBigEventNoteListByStaFunc();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.findBigEventNoteListByStaFunc();
    },
    findBigEventNoteListByStaFunc() {
      findBigEventNoteListBySta({
        departId: this.departCode,
        endTimeStr: this.endTimeStr,
        isBtnSearch: this.isBtnSearch,
        isExport: false,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        schoolTermId: this.schoolTimeCode,
        startTimeStr: this.startTimeStr,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {
            this.isBtnSearch = false;
            let goData = data.data;
            this.listData = goData.dataList;
            this.total = goData.pagination.total;
          }
        })
        .catch(() => {});
    },
    jumpTo(path, query) {
      this.$router.push({
        path,
        query,
      });
    },
    changeSchool(val) {
      this.pageNo = 1;
      this.schoolTimeCode = val;
      let schoolItem = this.schoolYearList.find((item) => item.id == val);
      this.schoolName = schoolItem.schoolTimeName;
      this.findBigEventNoteListByStaFunc();
    },
    getSchoolTimeAllListFunc() {
      //学期列表
      getSchoolTimeAllList()
        .then((res) => res.data)
        .then((data) => {
          this.schoolYearList = data.data;
          this.schoolYearList.forEach((item) => {
            if (item.isCurrent == 1) {
              this.schoolName = item.schoolTimeName;
              this.schoolTimeCode = item.id;
              this.findBigEventNoteListByStaFunc();
            }
          });
        });
    },
    changeDepart(val) {
      //切换部门
      this.pageNo = 1;
      if (val == 0) {
        this.departCode = 0;
        this.departName = "";
      } else {
        this.departCode = val;
        let departItem = this.departList.find((item) => item.id == val);
        this.departName = departItem.name;
      }
      this.findBigEventNoteListByStaFunc();
    },
    findDepartListFunc() {
      //那部门
      findDepartList({
        isReporter: false,
      }).then((res) => {
        this.departList = res.data;
      });
    },
    // 详情页
    gotoDetail(item) {
      this.$router.push({
        path: "detail",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-range-editor--medium.el-input__inner {
  margin: 0;
}
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
.clearfix:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

ul,
li {
  list-style: none;
}
.memorabiliaList {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
 
}
.main-wrap {
  padding-top: 0;
}
.item-wrap {
  width: 100%;
  padding-right: 6px;
  height: auto;
  padding-top: 20px;
  box-sizing: border-box;
  .item {
    width: 90%;
    height: auto;
    min-width: 810px;
    min-height: 160px;
    padding: 10px 20px;
    box-sizing: border-box;
    margin: 10px auto;
    border: 1px solid #ccc;
    word-break: break-all;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    padding-bottom: 40px;
    padding-top: 40px;
    position: relative;
    .content {
      line-height: 24px;
      width: 100%;
      text-indent: 2em;
    }
  }
  .happenTimeStr {
    position: absolute;
    top: 10px;
    left: 50px;
    font-size: 16px;
  }
  .control-btn {
    position: absolute;
    right: 20px;
    top: 10px;
    max-width: 200px;
  }
  .control-btn a {
    text-align: right;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    color: #337ab7;
  }
  .control-btn i.fa-edit {
    font-size: 20px;
    margin-top: 4px;
  }
  .control-btn i.fa-fw {
    font-size: 19px;
    margin-top: 3px;
  }
  .bottom-text {
    position: absolute;
    bottom: 10px;
    right: 20px;
    color: #337ab7;
    text-decoration: none;
  }
  .tag-box {
    position: absolute;
    top: 6px;
    left: 3px;
    width: 30px;
    height: 30px;
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_edit_btn.png)
      no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    z-index: -1;
  }
  .tag-edit {
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_edit_btn.png)
      no-repeat;
    background-size: 100% 100%;
  }
  .tag-select {
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_select_btn.png)
      no-repeat;
    background-size: 100% 100%;
  }
  .tag-important {
    background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/chronicle_of_events/me_import_btn.png)
      no-repeat;
    background-size: 100% 100%;
  }
  .uploadFiles {
    width: 100%;
    height: auto;

    position: relative;
    padding-top: 10px;
    box-sizing: border-box;
  }
}
.time-select {
  width: 220px !important;
}
.select-width {
  width: 195px !important;
}
</style>
