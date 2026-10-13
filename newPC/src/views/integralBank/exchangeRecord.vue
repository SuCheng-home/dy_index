<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-col :span="19">
        <el-date-picker
                v-model="daterange" size="medium"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"  @change="getSchoolStuIntegralExchangePageList()"
                :clearable="false" style="width:220px;"
            >
            </el-date-picker>   
         <el-select v-model="listQuery.gradeId" style="width:150px;" placeholder="请选择年级" size="medium" @change="changeGrade">
          <el-option label="全部年级" :value="0"></el-option>
          <el-option v-for="(item, index) in gradeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="listQuery.classId" style="width:150px;" placeholder="请选择班级" size="medium" @change="getSchoolStuIntegralExchangePageList">
          <el-option label="全部班级" :value="0"></el-option>
          <el-option v-for="(item, index) in classList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
         <el-select v-model="type" placeholder="请选择状态" style="width:120px;" size="medium" @change="typefun()">
            <el-option label="线上兑换" :value="1"></el-option>
            <el-option label="线下兑换" :value="2"></el-option>         
        </el-select>
        <el-select v-if="type==1" v-model="listQuery.status" placeholder="请选择状态" style="width:120px;" size="medium" @change="getSchoolStuIntegralExchangePageList">
           <el-option label="全部状态" :value="0"></el-option>
           <el-option label="未发放" :value="1"></el-option>
           <el-option label="已发放" :value="2"></el-option>         
        </el-select>
         <el-select v-if="type==2" v-model="listQuery.status" placeholder="请选择状态" style="width:120px;" size="medium" @change="getSchoolStuIntegralExchangePageList">
           <el-option label="全部状态" :value="-1"></el-option>
           <el-option label="已兑换" :value="0"></el-option>
           <el-option label="已退回" :value="1"></el-option>         
        </el-select>
         <a :href="exportUrl" download="导出" target="_blank" style="margin-left:10px;" v-if="dataList.length&&type==1">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入姓名" size="medium" v-model.trim="listQuery.stuName" @change="getSchoolStuIntegralExchangePageList">
          <el-button slot="append" icon="el-icon-search" @click="getSchoolStuIntegralExchangePageList"></el-button>
        </el-input>
      </el-col>
    </div>
    <el-table stripe :data="dataList" :height="`${maxH - 1}`" border style="width: 100%">
      <el-table-column align="center" label="订单编号" prop="orderNo" show-overflow-tooltip>
         <template slot-scope="scope">
          {{scope.row.orderNo || scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="学号" prop="stuNo" show-overflow-tooltip>
         <template slot-scope="scope">
          {{scope.row.stuNo || scope.row.studentNo}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="stuName" show-overflow-tooltip>
         <template slot-scope="scope">
          {{scope.row.stuName || scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级" prop="className" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="兑换物品" prop="goodsName" show-overflow-tooltip>
         <template slot-scope="scope">
          {{scope.row.goodsName || scope.row.productName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所需积分" prop="goodsPoint" show-overflow-tooltip>
         <template slot-scope="scope">
          {{scope.row.goodsPoint || scope.row.changePoint}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实付积分" prop="pointSpent" show-overflow-tooltip>
         <template slot-scope="scope">
          {{scope.row.pointSpent || scope.row.changePointTotal}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑换时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.exchangeTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
           <span v-if="type==1">
            <el-tag  size="mini"   v-if="scope.row.status === 1">已申请</el-tag>
            <el-tag  size="mini" type="success" v-else-if="scope.row.status === 2" >已兑换</el-tag>
            <span v-else>--</span>
            </span>
             <span v-if="type==2">
            <el-tag  size="mini"   v-if="scope.row.status === 1">已退回</el-tag>
            <el-tag  size="mini" type="success" v-else-if="scope.row.status === 0" >已兑换</el-tag>
            <span v-else>--</span>
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <span v-if="type==1"><el-button type="text" @click="insertGoods(scope.row.id)" v-if="scope.row.status === 1">发放</el-button>
          <el-button type="text" v-else>&nbsp;</el-button></span>
          <span v-if="type==2">
            <el-button type="text" @click="evalExchangeReturn(scope.row.id)" v-if="scope.row.status === 0">退回</el-button>
          <el-button type="text" v-else>&nbsp;</el-button>
          </span>
          
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination-container" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import windowResize from "@/mixins/windowResize";
  import {getSchoolGradeClass} from '@/api/common/common';
  import {getSchoolStuIntegralExchangePageList, updateStuExchangeStatus,getExchangeLogList,evalExchangeReturn} from '@/api/integralBank';

  export default {
    name: "exchangeRecord",
    data() {
      return {
        dataList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          stuName: '',
          classId:0,//	班级ID	number	0全部
          gradeId:0,//	年级ID	number	0全部
          searchEDate:'',//	搜索结束日期	string	
          searchSDate:'',//	搜索开始日期	string	
          status:0,//	状态 0全部 1未发放 2已发放	number	
        },
        total: null,
        gradeList: [],
        classList: [],
         daterange: [new Date(), new Date()],
         exportUrl:'',
         type:1
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      }
    },
    mixins: [windowResize],
    created() {
       this.daterange[0] = new Date(moment().set('date', 1).valueOf()); 
       this.getSchoolGradeClass();
    },
    methods: {
        getSchoolGradeClass() {
        getSchoolGradeClass().then(res => res.data).then(data => {
          if (data.code === 200 && data.result && data.data) {
            this.gradeList = data.data;
            this.getSchoolStuIntegralExchangePageList();
          }
        });
      },
       changeGrade(val) {
        let gradeIndex = this.gradeList.map(item => item.id).indexOf(val);
        if (gradeIndex > -1) {
          this.classList = this.gradeList[gradeIndex].classList;
          this.listQuery.classId = 0;
        } else {
          this.classList = [];
          this.listQuery.classId = 0;
        }
        this.getSchoolStuIntegralExchangePageList();
      },
      goBack() {
        this.$router.back()
      },
      typefun(){
        if(this.type==1){
          this.listQuery.status=0
        }else{
          this.listQuery.status=-1
        }
        this.listQuery.pageNo = 1;
        this.getSchoolStuIntegralExchangePageList();
      },
      getSchoolStuIntegralExchangePageList() {
        if(this.type==1){
            this.listQuery.searchSDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
         this.listQuery.searchEDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
         this.exportUrl = `${global.BasePath}structure/integralBank/exportSchoolStuIntegralExchangeList?token=${this.$store.getters.token}&classId=${this.listQuery.classId}&gradeId=${this.listQuery.gradeId}&searchEDate=${this.listQuery.searchEDate}&searchSDate=${this.listQuery.searchSDate}&status=${this.listQuery.status}&stuName=${this.listQuery.stuName}`;
        getSchoolStuIntegralExchangePageList(this.listQuery).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        });

        }else{
          let obj={
            classId:this.listQuery.classId,//	班级id	number	可不传
            endDate:this.$moment(this.daterange[1]).format("YYYY-MM-DD"),//	结束日期	string	可不传
            gradeId:this.listQuery.gradeId,//	年级id	number	可不传
            pageNo:this.listQuery.pageNo,//	页码	number	可不传
            pageSize:this.listQuery.pageSize,//	分页数	number	可不传
            startDate:this.$moment(this.daterange[0]).format("YYYY-MM-DD"),//	开始日期	string	可不传
            status:this.listQuery.status,//	状态（0是正常，1是已退还）	number	-1 全部
            userName:this.listQuery.stuName
          }
          getExchangeLogList(obj).then(data => {
           this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
        });
        }
       
      },
      insertGoods(id) {
        this.$confirm("确认要发放当前物品吗？", "发放", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false
        }).then(() => {
          updateStuExchangeStatus({exchangeId: id}).then(res => res.data).then(data => {
            if (data.code === 200 && data.result) {
              this.$message.success('发放成功！');
              this.getSchoolStuIntegralExchangePageList();
            } else {
              this.$message.error(data.msg);
            }
          })
        });
      },
      evalExchangeReturn(id) {
        this.$confirm("确认要退回当前物品兑换吗？", "退回", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false
        }).then(() => {
          evalExchangeReturn({changeThird: id}).then(res => res.data).then(data => {
            if (data.code === 200 && data.result) {
              this.$message.success('退回成功！');
              this.getSchoolStuIntegralExchangePageList();
            } else {
              this.$message.error(data.msg);
            }
          })
        });
      },
      //切换码数
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getSchoolStuIntegralExchangePageList();
      },
      //切换页数
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getSchoolStuIntegralExchangePageList();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goods_manage_wrap{
    padding: 12px;

    .header {
      padding-bottom: 10px;
      overflow: hidden;
    }
    .picimg{
      display: block;
      width: 28px;
      height: 21px;
      margin: 0 auto;
      cursor: pointer;
    }
  }
</style>
