<template>
    <div class="goodstypeadd">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-button class="filter-item" type="primary" icon="upload" size="medium" @click="insertGoodTypes()">保存</el-button>
        </div>
        <div class="body"  :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="typeName">
              <el-input type="input" v-model.trim="ruleForm.typeName" placeholder="请输入分类名称" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" prop="pId">
              <el-select v-model="ruleForm.pId">
                <el-option    label="无" :value="0"></el-option>
               <el-option   v-for="item in typelist" :key="item.id"  :label="item.typeName" :value="item.id"></el-option>
            </el-select>
            </el-form-item>  
            <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model.trim="ruleForm.orderNum" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
        </el-form-item>          
            <el-form-item label="发放员" prop="addressData" class="is-required">
              <address-book v-model="ruleForm.addressData" :config="teacherConfigData"></address-book>
            </el-form-item>
            <el-form-item label="领取限制" class="is-required">
                     <el-radio-group v-model="ruleForm.isLimit">
                        <el-radio :label="1">无限制</el-radio>
                        <el-radio :label="2">按人员限制</el-radio>
                    </el-radio-group>
            </el-form-item>  
            <el-form-item label="可申请人员" class="is-required" prop="newaddressData" v-if="ruleForm.isLimit==2">
              <address-book v-model="ruleForm.newaddressData" :config="newteacherConfigData"></address-book>
            </el-form-item>  
      </el-form>
        </div>        
    </div>
</template>
<script>
    import {queryFGoodType,insertGoodType,getGoodTypeById} from "@/api/itemManagement";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import AddressBook from '@/components/AddressBook/indexExpand';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                teacherConfigData: {
                title: '发放员',
                depart: {target: 'user', departType: 't', userTypes: '1'},
                group: false
                },
                newteacherConfigData: {
                title: '可申请人员',
                depart: {target: 'user', departType: 't', userTypes: '1'},
                group: false
                },
                 ruleForm: {
                    addressData: {
                        userJson: []
                    },
                    newaddressData: {
                        userJson: []
                    },
                    pId:0,
                    typeName:'',
                    orderNum:'',
                    isLimit:1
                },
                rules: {
                addressData: [
                    {required: true}
                ],
                newaddressData: [
                    {required: true}
                ],
                pId: [
                    {required: true}
                ],
                typeName: [
                    {required: true, message: '请输入分类名称！'}
                ],
                orderNum: [
                    {required: true, message: '请输入排序！'}
                ]
                },
                typelist:[]
               
            }
        },
        components: {
      AddressBook
    },
        mixins: [baseMixin, mixin],
        created() {
            this.queryFGoodTypes();
            this.getGoodTypeByIds();
        },
        methods: {
              queryFGoodTypes(){
                  queryFGoodType()
                    .then(res => res.data)
                    .then(data => {
                        this.typelist=data.data;
                    })
            },
            getGoodTypeByIds(){
                if(this.$route.query.id!=0){
                   getGoodTypeById(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        if(data.data.level!=3){
                            this.ruleForm.pId=this.$route.query.id-0;
                        }
                    })
                }
               
            },
            //保存
            insertGoodTypes(){
             this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (!this.ruleForm.addressData.userJson || !this.ruleForm.addressData.userJson.length) {
              this.$message({
                message: '请选择发放员！',
                type: 'warning'
              });
              return;
            }
            if ((!this.ruleForm.newaddressData.userJson || !this.ruleForm.newaddressData.userJson.length)&&this.ruleForm.isLimit==2) {
              this.$message({
                message: '请选择可申请人员！',
                type: 'warning'
              });
              return;
            }
            let level=1;
            if(this.ruleForm.pId!=0){
              for(let i=0;i<this.typelist.length;i++){
                  if(this.ruleForm.pId==this.typelist[i].id){
                      level=this.typelist[i].level+1;
                  }
              }
            }
            let ids='';
            for(let  i=0;i<this.ruleForm.newaddressData.userJson.length;i++){
                if(i<this.ruleForm.newaddressData.userJson.length-1){
                        ids+=this.ruleForm.newaddressData.userJson[i].id+',';
                    }else{
                        ids+=this.ruleForm.newaddressData.userJson[i].id;
                    }
            };
            let query = {
              typeName: this.ruleForm.typeName,
              pId: this.ruleForm.pId,
              level: level,
              orderNum: this.ruleForm.orderNum,
              isLimit: this.ruleForm.isLimit,
              limitUserIds:this.ruleForm.isLimit==2?ids:'',
              userJson: JSON.stringify(this.ruleForm.addressData.userJson),
              limitUserJson: this.ruleForm.isLimit==2?JSON.stringify(this.ruleForm.newaddressData.userJson):'',
            };
            insertGoodType(query).then(res => res.data).then(data => {
                            if (data.code === 200) {
                                this.$message.success("保存成功");
                                this.$root.$emit('next')
                                this.$router.back();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
          }
        });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .goodstypeadd {
        padding: 12px;
        .top {
          padding-bottom: 10px;
          border-bottom: 1px solid #e7eaec;
       }
       .body{
           padding-top:10px;
           overflow: auto;
           .demo-ruleForm{
               width: 810px;
               margin: 0 auto;
           }
           .el-select{
               width: 100%;
           }
       }
    }
</style>
