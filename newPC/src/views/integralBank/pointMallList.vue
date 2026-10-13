<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-col :span="19">
        <el-select v-model="listQuery.typeCode" placeholder="请选择分类" size="medium" @change="getSchoolIntegralGoodsPageList">
          <el-option label="全部所属分类" :value="''"></el-option>
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.value" :value="item.code"></el-option>
        </el-select>
        <el-select v-model="listQuery.status" placeholder="请选择上架状态" size="medium" @change="getSchoolIntegralGoodsPageList">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item" :value="index"></el-option>
        </el-select>
         <el-button type="primary" size="medium" @click="popfun()">导入商品</el-button>
        <el-button type="primary" size="medium"   @click="toInputRecord">入库记录</el-button>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入商品名称" size="medium" v-model.trim="listQuery.goodsName" @change="getSchoolIntegralGoodsPageList">
          <el-button slot="append" icon="el-icon-search" @click="getSchoolIntegralGoodsPageList"></el-button>
        </el-input>
      </el-col>
    </div>
    <el-table stripe :data="dataList" :height="`${maxH - 1}`" border style="width: 100%">
      <el-table-column align="center" label="商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#409eff;cursor: pointer;" @click="toGoodsInfo(scope.row.goodsId)">{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属分类" prop="typeName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="所需积分" prop="requirePoint" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="图片" show-overflow-tooltip>
        <template slot-scope="scope">
          <image-previewer tag="richtext">
            <img class="picimg" :src="scope.row.goodsLogo" alt="">
          </image-previewer>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 2">已上架</span>
          <span v-else>未上架</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" prop="stockCount" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="updateStatus(scope.row.goodsId, scope.row.status)">{{scope.row.status === 2 ? '下架' : '上架'}}</el-button>
          <el-button type="text" @click="insertGoods(scope.row.goodsId)">入库</el-button>
          <el-button type="text"  class="buttontextred" @click="deleteSchoolIntegralGoodsByGoodId(scope.row.goodsId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination-container" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <el-dialog title="商品入库" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' :visible.sync="dialogFormVisible">
      <el-form :model="ruleDialogForm" :rules="rulesDialog" ref="ruleDialogForm" label-width="100px">
        <el-form-item label="入库数量" prop="wareCount">
          <el-input-number v-model.trim="ruleDialogForm.wareCount" :min="-1000" :max="100000" label="请输入数量"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="ruleDialogForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNum">取 消</el-button>
        <el-button type="primary" @click="addGoodsNum">确 定</el-button>
      </div>
    </el-dialog>

     <el-dialog title="导入商品" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' :visible.sync="pop">
         <div class="foodtop">
            <el-select v-model="typeCode" placeholder="请选择分类" size="medium" @change="getSchoolCanAddIntegralGoodsList">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.value" :value="item.code"></el-option>
        </el-select>

         </div>
        
         <default-page Mes="暂无可导入商品" v-show="poplist.length==0"></default-page>
         <div class="food-box" v-show="poplist.length!=0">
            <el-checkbox-group v-model="foodtypelist">
              <el-checkbox  border v-for="item in poplist" :key="item.goodsId" :label="item.goodsId">
                <img class="img" :src="item.goodsLogo" alt="">
                {{item.goodsName}}
              </el-checkbox>
            </el-checkbox-group>
         </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pop=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisiblefun">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
  import windowResize from "@/mixins/windowResize";
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  import {findDicsByCode} from '@/api/common/common';
  import {getSchoolCanAddIntegralGoodsList,batchAddSchoolIntegralGoods,getSchoolIntegralGoodsPageList, updateSchoolIntegralGoodsStock, updateSchoolIntegralGoodsStatus,deleteSchoolIntegralGoodsByGoodId} from '@/api/integralBank';
import DefaultPage from '@/components/DefaultPage';
  export default {
    name: "pointMallList",
    components: {ImagePreviewer},
    data() {
      return {
        typeList: [],
        statusList: ['全部上架状态', '未上架', '已上架'],
        dataList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          goodsName: '',
          status: 0,
          typeCode: ''
        },
        total: null,
        dialogFormVisible: false,
        ruleDialogForm: {
          goodsId: '',
          wareCount: 1,
          remark: ''
        },
        rulesDialog: {
          wareCount: [
            {required: true, message: '请输入入库数量', trigger: 'blur'}
          ]
        },
        pop:false,
        typeCode:'',
        poplist:[],
        foodtypelist:[],
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      },
    },
    mixins: [windowResize],
      components: {DefaultPage},
    created() {
      this.findDicsByCode();
      this.getSchoolIntegralGoodsPageList();
    },
    methods: {
        //确定取消
   dialogVisiblefun(){    
      if(this.foodtypelist.length==0){
          this.$message({type: 'error', message:'请选择导入商品!'});
          return;
      };
      let goodsId=[]
      for(let i=0;i<this.foodtypelist.length;i++){
        goodsId.push({goodsId:this.foodtypelist[i]})
      }
       batchAddSchoolIntegralGoods(goodsId) .then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '导入成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.pop=false;
                                        this.getSchoolIntegralGoodsPageList();
                }
            }).catch(() => {})     
      
   },
      popfun(){
        this.typeCode=this.typeList[0].code;
        this.pop=true
        this.getSchoolCanAddIntegralGoodsList()
      },
      getSchoolCanAddIntegralGoodsList(){
           this.poplist=[]
           this.foodtypelist=[]
           getSchoolCanAddIntegralGoodsList({typeCode:this.typeCode}).then(res => res.data).then(data => {
              if (data.code === 200 && data.result) {
                this.poplist=data.data;
              } else {
                this.$message.error(data.msg);
              }
            });
      },
      toInputRecord() {
        this.$router.push({path: 'goodsInputRecord'})
      },
      toGoodsInfo(id) {
        this.$router.push({path: 'goodsInfo', query: {goodsId: id}})
      },
      cancelNum() {
        this.dialogFormVisible = false;
        this.ruleDialogForm = {
          goodsId: '',
          wareCount: 1,
          remark: ''
        }
      },
      addGoodsNum() {
        this.$refs.ruleDialogForm.validate((valid) => {
          if (valid) {
            updateSchoolIntegralGoodsStock(this.ruleDialogForm).then(res => res.data).then(data => {
              if (data.code === 200 && data.result) {
                this.$message.success('入库成功！');
                this.getSchoolIntegralGoodsPageList();
              } else {
                this.$message.error(data.msg);
              }
            });
            this.cancelNum();
          }
        });
      },
      findDicsByCode() {
        findDicsByCode({dicCode: 'integralGoodsType'}).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.typeList = data.data;
          }
        });
      },
      getSchoolIntegralGoodsPageList() {
        getSchoolIntegralGoodsPageList(this.listQuery).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        });
      },
      insertGoods(id) {
        this.ruleDialogForm.goodsId = id;
        this.dialogFormVisible = true;
      },
      deleteSchoolIntegralGoodsByGoodId(id){
         this.$confirm("确认要删除当前商品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false
        }).then(() => {
          deleteSchoolIntegralGoodsByGoodId({goodsId: id}).then(res => res.data).then(data => {
            if (data.code === 200 && data.result) {
              this.$message.success('删除成功！');
              this.getSchoolIntegralGoodsPageList();
            } else {
              this.$message.error(data.msg);
            }
          })
        });

      },
      updateStatus(id, status) {
        this.$confirm("确认要" + (status===2 ? '下架' : '上架') + "当前商品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false
        }).then(() => {
          updateSchoolIntegralGoodsStatus({goodsId: id, status: (status===2 ? 1 : 2)}).then(res => res.data).then(data => {
            if (data.code === 200 && data.result) {
              this.$message.success((status===2 ? '下架' : '上架') + '成功！');
              this.getSchoolIntegralGoodsPageList();
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
        this.getSchoolIntegralGoodsPageList();
      },
      //切换页数
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getSchoolIntegralGoodsPageList();
      },
    }
  }
</script>

<style lang="scss" scoped>
.foodtop{
  text-align: right;
  padding-bottom: 20px;
}
.food-box{
      height: 240px;
      overflow: auto;
      border-bottom: 1px #EBEEF5 solid;
    .img{
        width: 45px;
        height: 45px;
        left: 40px;
        position: absolute;
        top: 5px;
    }
    .el-checkbox.is-bordered {        
          height: 80px;
          min-width: 130px;
          padding: 50px 10px 10px 10px;
          margin: 5px;
      }
  }
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
