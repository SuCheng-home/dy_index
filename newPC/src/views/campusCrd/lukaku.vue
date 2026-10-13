<template>
<div class="campusCrdindexonedetails"  >
     <div class="top"> 
          <el-col :span="19">
              <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
              <el-button type="primary" size="medium"   @click="dialogVisiblefun()">新增绑卡</el-button>  
              <el-button type="primary" size="medium"   @click="tiedCard()">已绑卡查询</el-button>
          </el-col>
         <el-col :span="5">
            <el-input placeholder="卡号" size="medium" v-model.trim="query.cardNo" @change="searchfun()">
                <el-button slot="append" icon="el-icon-search" @click="searchfun()"></el-button>
            </el-input>
        </el-col>   
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${maxH}px;`">
        <div class="kabox" v-for="(item,index) in datalist" :key="index"><div class="num">{{item.cardNo}}</div><i class="el-icon-delete" @click="deleteCardByCardNos(item.cardNo)"></i></div>
         <default-page Mes="暂无卡片" v-if="datalist.length==0"></default-page>        
     </div>
     <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
     <el-dialog title="新增（如无读卡器请认真核对卡号,每换行一次相当于一张卡）" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="50%" :lock-scroll="false" :modal-append-to-body='false'>
		    <el-input   type="textarea" :autosize="{ minRows: 10, maxRows: 10}"   v-model="cardNos"  placeholder="请输入卡号"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="insertBatchCampusCards()">确 定</el-button>
			</span>
	</el-dialog>
  <el-dialog title="失败信息" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="listpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
      <div class="listpop">
          <div class="listpop-box" v-if="frontRepeatList.length>0">
            <div class="listpop-box-top">输入卡号重复</div>
            <div class="ul">
              <div class="li"  v-for="(item,index) in frontRepeatList" :key="index">
               {{item}}
              </div>
            </div>
          </div>
          <div class="listpop-box" v-if="dataBaseRepeatList.length>0">
            <div class="listpop-box-top">与卡库卡号重复</div>
             <div class="ul">
              <div class="li"  v-for="(item,index) in dataBaseRepeatList" :key="index">
               {{item}}
              </div>
            </div>
          </div>
      </div>
      
     	<span slot="footer" class="dialog-footer">
				<el-button type="primary" size="medium" @click="listpop=false">确定</el-button>
			</span>
	</el-dialog>
</div> 
</template>
<script>
import {listCardByModelAndPage,insertBatchCampusCard,deleteCardByCardNo} from "@/api/campusCrd";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      dialogVisible:false,
      cardNos:'',
      total:null,
      query: {
        pageNo: 1, //页数
        pageSize:50,//条数
        cardNo:'',
      },
      dataBaseRepeatList:[],
      frontRepeatList:[],
      listpop:false
    };
  },
  mixins: [mixin],
  created() {
    this.listCardByModelAndPages();
  },
  components: { DefaultPage},
  methods: {
    searchfun(){
      this.query.pageNo = 1;
      this.listCardByModelAndPages();
    },
    //获取详情
    listCardByModelAndPages() {
      listCardByModelAndPage(this.query)
        .then(res => res.data)
        .then(data => {
            this.datalist=data.data.dataList;
            this.total = data.data.pagination.total;
        });
    },
    handleSizeChange(val) {
                this.query.pageSize = val;
                this.listCardByModelAndPages();
            },
    handleCurrentChange(val) {
                this.query.pageNo = val;
                this.listCardByModelAndPages();
    },
    //已绑卡
    tiedCard(){
      this.$router.push({
        path: "tiedCard"
      });
    },
    //删除
    deleteCardByCardNos(sid) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteCardByCardNo(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
               this.listCardByModelAndPages();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //弹框
    dialogVisiblefun(){
      this.dialogVisible=true;
     
    },
    //绑卡
    insertBatchCampusCards(){
        if(!this.cardNos){
           this.$message.error('请输入卡号');
           return;
        };
       let list= this.cardNos.split(/[(\r\n)\r\n]+/);
       insertBatchCampusCard(list).then(res=>res.data).then(data=>{
        if(data.code==200){
            this.$message({ message: "新增成功!",type: "success",duration: 1000});
            this.cardNos='';
            this.dialogVisible=false;
            this.listCardByModelAndPages();
         }else{
           if(data.code==300){
              this.dataBaseRepeatList=data.data.dataBaseRepeatList;
              this.frontRepeatList=data.data.frontRepeatList;
              this.listpop=true;
           }else{
              this.$message.error(data.msg);
           }
          
            this.cardNos='';
            this.dialogVisible=false;
         }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.campusCrdindexonedetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    overflow: hidden;
  }
  .listpop{
    max-height: 300px;
    overflow: auto;
    .listpop-box-top{
    padding-left: 10px;
    border-left: 3px solid #409eff;
    font-size: 16px;
    line-height: 20px;
    margin: 5px 0;
    }
    .ul{
      overflow: hidden;
      min-height: 100px;
      .li{
        width: 33%;
        float: left;
        padding: 10px;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
        color: #409eff;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: none;
        -webkit-transition: .1s;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 5px;
        font-size: 12px;
        border-radius: 4px;
        margin: 5px;
        width: 140px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .kabox{
        float: left;
        padding: 10px;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
        color: #409eff;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 5px;
        font-size: 14px;
        border-radius: 4px;
        margin: 5px;
        width: 140px;
        position: relative;
        .num{
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        }
        i{
            opacity: 0;
            color:#f56c6c;
            font-size: 16px;
            position: absolute;
            top:10px;
            right: 5px;
        }
    }
    .kabox:hover{
        i{
            opacity: 1;
        }
    }
  }
}
</style>