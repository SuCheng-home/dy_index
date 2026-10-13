<template>
  <div class="linshiindex">
    <div class="header">
        <el-col :span="19">
            <!---->
          <template>
            <el-select
              class="select-width"
              v-model="schoolTimeId"
              placeholder="请选择学期"
              @change="getClassScheduleStopList"
              size="medium"
            >
              <el-option
                v-for="(item,index) in schoolYearList"
                :key="index"
                :label="item.schoolTimeName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button
                type="primary"
                size="medium"
                @click="$router.push({ path: 'linshiadd' })"
            >新增
            </el-button>
          </template></el-col>
            <el-col :span="5">
              <el-input  size="medium" placeholder="请输入原因" v-model.trim="reason" @input="getClassScheduleStopList">
            <el-button slot="append" icon="el-icon-search" @click="getClassScheduleStopList"></el-button>
       </el-input>
            </el-col>
    </div>
    <div class="main-wrap" id="outTable">
      <el-table
        border
        stripe
        style="width: 100%;"
        :height="maxH"
        :data="dataList"
      >
        <el-table-column align="center" label="停课原因" show-overflow-tooltip>
          <template slot-scope="scope">
              <span class="link-type" @click="linshilist(scope.row.id)">{{ scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="停课年级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.gradeJson">
               <span
               v-for="(item,index) in JSON.parse(scope.row.gradeJson)"
                :key="index">{{item.gradeName}}；</span>
            </span>
            <span v-else>
               <span
               v-for="(item,index) in JSON.parse(scope.row.studepartJson)"
                :key="index">{{item.name}}；</span>
            </span>
             
          </template>
        </el-table-column>
        <el-table-column align="center" label="停课日期" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.stopDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="停课节次" show-overflow-tooltip>
          <template slot-scope="scope">
              <span
               v-for="(item,index) in JSON.parse(scope.row.sectionNoJson)"
                :key="index">
                <span v-if="item.dayStage==1"> 早自习</span>
                <span v-if="item.dayStage==2"> 上午</span>
                <span v-if="item.dayStage==3"> 午自习</span>
                <span v-if="item.dayStage==4"> 下午</span>
                <span v-if="item.dayStage==5"> 晚自习</span>
                <span> 第{{item.seq}}节</span>
                </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="涉及课时数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.classHourCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="备注" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.remark||'--'}}</template>
        </el-table-column>
       <el-table-column align="center" label="操作">
                   <template slot-scope="scope">
                         <el-button type="text"  @click="delClassScheduleStop(scope.row.id)"  size="small"  class="buttontextred">删除</el-button>
                    </template>
         </el-table-column>
      </el-table>
        <el-pagination
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import moment from "moment";
import {getSchoolTimeAllList} from "@/api/memorabilia";
import {getClassScheduleStopList,delClassScheduleStop} from "@/api/classScheduleCard";
export default {
  data() {
    return {
      schoolYearList: [],
      schoolTimeId: "",
      reason:'',
      dataList: [],
      pagination:{
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
     
    };
  },
  created() {
    this.getSchoolTimeAllListFunc();
  },
  mixins: [mixin,baseMixin],
  methods: {  
        linshilist(id){
        this.$router.push({
        path: "linshilist",
        query: { id: id}
      });
    },
       delClassScheduleStop(id) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                delClassScheduleStop(id)
                    .then(res => {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    this.getClassScheduleStopList();
                    })
                    .catch();
                })
                .catch(() => {});
            },
       // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getClassScheduleStopList();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getClassScheduleStopList();
            },
    getClassScheduleStopList() {
      getClassScheduleStopList({
        schoolTimeId: this.schoolTimeId,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.pageNo,
        reason:this.reason
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {
              console.log(data)
               this.dataList=data.data.dataList
                this.pagination.total = data.data.pagination.total;
            // let {dataList, pagination} = data;
            //                 this.dataList = [...dataList];
            //                 this.pagination.total = pagination.total;
          }
        })
        .catch(() => {});
    },
    getSchoolTimeAllListFunc() {
      //学期列表
      getSchoolTimeAllList()
        .then((res) => res.data)
        .then((data) => {
          this.schoolYearList = data.data;
          this.schoolYearList.forEach((item) => {
            if (item.isCurrent == 1) {
              this.schoolTimeId = item.id;
              this.getClassScheduleStopList();
            }
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.linshiindex {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
</style>
