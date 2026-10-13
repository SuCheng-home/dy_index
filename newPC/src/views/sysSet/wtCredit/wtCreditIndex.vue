<template>
  <div class="wtCreditList">
    <div class="el-row menu-tools">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary"    size="medium" @click="addHandler">新增</el-button>
      <el-button type="danger"    size="medium" @click="handleMultDelete">删除</el-button>
      <el-button type="primary"    size="medium" @click="initialHandler">初始化设置</el-button>
      <el-button type="primary"    size="medium" @click="autoApplySet">自主申领设置</el-button>
      <el-button type="primary"    size="medium" @click="integralList">积分划档</el-button>
    </div>
    <div class="main-wrap">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :height="nobottommaxH"
        tooltip-effect="dark"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55" align="center">
        </el-table-column>
        <el-table-column
          label="所需积分"
          align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="goEdit(scope.row.id)"> {{ scope.row.point }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="奖品名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.product}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
              <el-button size="small" type="text" @click="handleDelete(scope.row.id)" class="buttontextred">
                  删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {getCreditPointGood,deleteCreditPointGood} from '@/api/wtCredit';
import mixin from '@/mixins/windowResize';
import Cookies from "js-cookie";
export default{
  data(){
    return{
      multipleSelection:[],
      tableData:[],

    }
  },
  created(){
    this.getCreditPointGoodFunc();
  },
  mounted(){
  },
  mixins:[mixin],
  methods:{
    getCreditPointGoodFunc(){
      getCreditPointGood().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let TableData=data.data;
          TableData.forEach((item,itemIndex)=>{
            item.product=item.goodList.map(subItem=>subItem.goodName).toString();
          })
          this.tableData=TableData;
        }
      })
    },
    goEdit(id){
      this.$router.push({
        path:'editProduct',
        query:{
          id:id
        }
      })
    },
    addHandler(){
      this.$router.push({
        path:'addProduct'
      })
    },
    initialHandler(){
      this.$router.push({
        path:'initialSet'
      })
    },
    autoApplySet(){
      this.$router.push({
        path:'autoApplySet'
      })
    },
    integralList(){
      this.$router.push({
        path:'integralList'
      })
    },
    goback(){

      let host=window.location.host;
      if(this.$route.query.new||Cookies.get("new")){
        if(this.$route.query.new){
          Cookies.set("new",this.$route.query.new);
        }
        this.$router.push({
          path: '/main/sysManage/sysSet/sysSetIndex'
        })
      }else{
        Cookies.remove("new");
        window.location.href = global.command === 'production' ? 'http://www.weixiaojia.cn/wxcepClient/sysOthers' : 'http://www.weixiaojia.net/wxcepClient/sysOthers';
        // let httpVal=window.location.protocol;
        // let host=window.location.host ;
        // window.location.href=httpVal+'//'+host+'/wxcepClient/sysOthers';
        // window.location.href="/wxcepClient/sysOthers";
      }
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    handleMultDelete(){
      //批量删除
      if (!this.multipleSelection.length) {
        this.$message({
            message: '请选择要删除的积分卡',
            type: 'warning'
        });
      }else{
        this.$confirm('确定要删除吗？', '提示', {
            type: 'error'
        }).then(() => {
            let arr = this.multipleSelection.map(obj => {
                return obj.id
            });
            deleteCreditPointGood({cpgIds:arr.toString()}).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }
                this.getCreditPointGoodFunc();
            })
        }).catch(() => {
        });
      }
    },
    handleDelete(id){
      //单个删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'error'
      }).then(() => {
        deleteCreditPointGood({
            cpgIds: id,
        }).then(res => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.getCreditPointGoodFunc();
        })
      }).catch(function (error) {
      });
    },
  }
}
</script>
<style lang="scss" scoped>
  .wtCreditList{
   padding:12px;
   box-sizing: border-box;
  }
  .menu-tools {
    padding-bottom: 10px;
  }
</style>
