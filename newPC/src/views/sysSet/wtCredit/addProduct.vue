<template>
  <div class="addProduct">
    <div class="el-row menu-tools">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary"   size="medium" @click="saveHandler">保存</el-button>
    </div>
    <div class="main-wrap">
      <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="所需积分" class="required">
            <el-input type="number" pattern="[0-9]*" v-model.trim="ruleForm.point" min="0" placeholder="请输入积分(1-3个字符)" @keyup.native="proving"></el-input>
        </el-form-item>
        <el-form-item label="物品" class="required">
          <div class="product-input" v-html="ruleForm.productJson" @click="productClick"></div>
        </el-form-item>
      </el-form>
      <el-dialog title="选择物品" 
      class="dialogProduct"
      :visible.sync="productVisible" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false'>
          <div>
            <p>
              <span class="checkSpan"><input type="checkbox" v-model="checkAll" @change="selectAll"><label></label>全选</span></p>
            <div class="itemSection" v-for="(item,index) in productList">
              <div class="item-top">
                <span class="checkSpan"><input type="checkbox" v-model="item.checked" @change="selectItem1(item,productList)"><label></label>{{item.typeName}}</span>
              </div>
              <div class="subItemSection">
                 <div class="subItem" v-for="(subItem,subIndex) in item.goodList">
                  <div class="">
                    <span class="checkSpan"><input type="checkbox" v-model="subItem.checked" @change="selectItem2(item,productList)"><label></label>{{subItem.goodName}}</span></div>
                </div>
              </div>
             
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="productVisible = false">取 消</el-button>
              <el-button type="primary" @click="chooseProduct">确 定</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {chooseGood,saveCreditPointGood} from '@/api/wtCredit';
export default{
  data(){
    return{
      ruleForm:{
        point:'',
        id:0,
        productJson:'',
        goodJson:[]
      },
      productVisible:false,
      checkAll:false,
      productList:[],
      checkedProduct: [],
      cpgId:0,
      saveSelectProduct:[]

    }
  },
  created(){
    this.chooseGoodFunc();
  },
  methods:{
    proving(){
      this.ruleForm.point=this.ruleForm.point.replace(/[^\.\d]/g,'');
      this.ruleForm.point=this.ruleForm.point.replace('.','');
    },
    chooseGoodFunc(){
      chooseGood({
        cpgId:this.cpgId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.productList=data.data;
          this.productList.forEach((item)=>{
            this.$set(item,"checked",false);
            item.goodList.forEach((subItem)=>{
              this.$set(subItem,"checked",false);
            })
          })
        }
      })
    },
    saveHandler(){
      let flag=true;
      if(this.ruleForm.point==''){
        this.$message({
          type:'error',
          message:'所需积分不能为空！'
        })
        return false;
      }
      if(this.ruleForm.point.length>3){
        this.$message({
          type:'error',
          message:'所需积分不能超过3个字段'
        })
        return false;
      }
      if(this.ruleForm.point==0){
        this.$message({
          type:'error',
          message:'所需积分不能为0！'
        })
        return false;
      }
      if(this.ruleForm.productJson==''){
        this.$message({
          type:'error',
          message:'物品不能为空！'
        })
        return false;
      }
      this.saveSelectProduct.forEach((item)=>{
        this.$set(item,"point",this.ruleForm.point);
      })
      if (flag) {
        saveCreditPointGood({
          goodJson:JSON.stringify(this.saveSelectProduct),
          id:this.ruleForm.id,
          point:this.ruleForm.point
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: 'success',
              message: '新增物品成功！'
            });
            this.$router.push({
              path: 'wtCreditIndex'
            });
          }
        })
      }
    },
    chooseProduct(){
      this.saveSelectProduct=[];
      this.productList.forEach(item=>[
        item.goodList.forEach(subItem=>{
          if(subItem.checked==true){
            this.saveSelectProduct.push({
              goodName:subItem.goodName,
              goodId:subItem.id,
              goodUrl:subItem.goodUrl
            })
          }
        })
      ]);
      this.productVisible=false;
      
      let productNameList=this.saveSelectProduct.map(item=>{
        return item.goodName
      })
      this.ruleForm.productJson=productNameList.toString();
      
    },
    selectAll(){
      this.productList.forEach(item=>{
        item.checked=this.checkAll;
        item.goodList.forEach(subItem=>{
          subItem.checked=this.checkAll;
        })
      })
    },
    selectItem1(item,productList){
      let firstItem=productList.every(item=>{
        return item.checked==true;
      })
      if(firstItem){
        this.checkAll=true;
      }else{
        this.checkAll=false;
      }
      item.goodList.forEach(subItem=>{
        subItem.checked=item.checked;
      })
    },
    selectItem2(item,productList){
     
      let lengths=item.goodList.length;
      let checkeds=item.goodList.filter(subItem=>{
        return subItem.checked==true;
      });
      if(lengths==checkeds.length){
        item.checked=true;
        let firstItem=productList.every(item=>{
          return item.checked==true;
        })
        if(firstItem){
          this.checkAll=true;
        }else{
          this.checkAll=false;
        }
      }else{
        item.checked=false;
        this.checkAll=false;
      }
    },
    productClick(){
      this.productVisible=true;
    },
    goback(){
      this.$router.push({
        path:'wtCreditIndex'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/mixin.scss";
 .addProduct{
    padding:12px;
    box-sizing: border-box;
  }
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .main-wrap{
    padding-top:20px;
  }
  .demo-ruleForm{
    width:810px;
    margin: 0 auto;
  }
  .product-input{
    width:100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    line-height:28px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    font-size: inherit;
    min-height: 36px;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .itemSection{
    .item-top{
      margin-bottom:10px;
      background:#F2F2F2;
    }
    .subItemSection{
      width:100%;
      margin-bottom:10px;
      @include clearfix;
    }
    .subItem{
      float:left;
      margin-right:20px;
    }
  }
  .dialogProduct{
    .checkSpan{
      padding-left:22px;
      display: inline-block;
      height:18px;
      line-height: 18px;
      position: relative;
    }
    label{
      display: inline-block;
      position: absolute;
      left:0;
      top:0;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    }
    label:after{
      box-sizing: content-box;
      content: "";
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 8px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 4px;
      transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
      transform-origin: center;
    }
    input{
      position:absolute;
      left:0;
      top:0;
      width:18px;
      height:18px;
      opacity: 0;
      z-index:5;
    }
    input[type=checkbox]:checked+label{
      background-color: #20a0ff;
      border-color: #0190fe;
    }
    input[type=checkbox]:checked+label:after{
      transform: rotate(45deg) scaleY(1);
    }
  }
  
</style>
<style scoped>
input[type=number] {  
-moz-appearance:textfield;  
}  
input[type=number]::-webkit-inner-spin-button,  
input[type=number]::-webkit-outer-spin-button {  
  -webkit-appearance: none;  
  margin: 0;  
}
.el-form-item.required .el-form-item__label:before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
</style>
