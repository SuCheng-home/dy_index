<template>
  <div class="memorabiliaList">
    <div class="header">
      <el-row>
        <el-col :span="24">
         
          <!-- <el-button
            type="primary"
            size="medium"
             
            @click="jumpTo('memorabiliaListExport',{departId:departCode,schoolTermId:schoolTimeCode})"
          >导出</el-button>-->
          <template>
            <el-select
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
          <!---->
          <template>
            <el-select
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
           <el-button
            type="primary"
            size="medium"
             
            @click="jumpTo('addMemorabilia')"
          >新增</el-button>
        </el-col>
      </el-row>
    </div>
    <!--
    <div class="main-wrap">
      <div class="item-wrap scrollBar" :style="{'height':maxH-10+'px'}">
        <div class="item" v-for="(listItem,listIndex) in listData" :key="listIndex">
          <div class="happenTimeStr">{{listItem.happenTimeStr}}</div>
          <div class="tag-box tag-edit" v-if="listItem.state===0"></div>
          <div class="tag-box tag-select" v-else-if="listItem.state===1"></div>
          <div class="tag-box tag-important" v-else-if="listItem.state===2"></div>
          <div class="control-btn" v-if="listItem.state!==2">
            <a href="javascript:;" @click="jumpTo('editMemorabilia',{id:listItem.id})">
               <i	class="fa fa-edit" title="编辑"></i>
            </a>
            <a href="javascript:;" class="a_delete" @click="delHandler(listItem.id)">
              <i class="fa fa-trash-o fa-lg" title="删除"></i>
            </a>
          </div>
          <div class="content">{{listItem.desc}}</div>
          <div class="uploadFiles">
            <image-previewer tag="richtext"> 
              <span class="img">
                <img style="width: 100px!important;height: 100px;margin-right: 10px;"  v-for="(picItem,picIndex) in listItem.picUrlList" :src="picItem" :key="picIndex">
              </span> 
            </image-previewer> 
          </div>
          <div class="bottom-text">
            <span>{{listItem.departName}}&nbsp;</span> <span>{{listItem.createUserName}}&nbsp;</span> <span>{{listItem.createTime|filterDate}}</span>
          </div>
        </div>
      </div>
    </div>
    -->

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
            v-if="scope.row.state!==2"
            @click="jumpTo('editMemorabilia',{id:scope.row.id})"
          >编辑</el-button>
          <el-button
            size="small"
            type="text"
            v-if="scope.row.state!==2"
            @click="delHandler(scope.row.id)"
          class="text-danger buttontextred">删除</el-button>
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
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixins/windowResize";
import moment from "moment";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {
  findDepartList,
  getSchoolTimeAllList,
  findBigEventNoteListByReporter,
  deleteBigEventNote,
} from "@/api/memorabilia";
export default {
  components: { ImagePreviewer },
  data() {
    return {
      departList: [],
      departCode: "",
      departName: "",
      schoolYearList: [],
      schoolName: "",
      schoolTimeCode: "",
      pageNo: 1,
      pageSize: 20,
      listData: [],
      total: 0,
    };
  },
  created() {
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
              this.findBigEventNoteListByReporterFunc();
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
      this.findBigEventNoteListByReporterFunc();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.findBigEventNoteListByReporterFunc();
    },
    findBigEventNoteListByReporterFunc() {
      findBigEventNoteListByReporter({
        departId: this.departCode,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        isExport: false,
        schoolTermId: this.schoolTimeCode,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {
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
      this.findBigEventNoteListByReporterFunc();
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
              this.findBigEventNoteListByReporterFunc();
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
      this.findBigEventNoteListByReporterFunc();
    },
    findDepartListFunc() {
      //那部门
      findDepartList({
        isReporter: true,
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
    border-bottom: 1px solid #e7eaec;
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
</style>
