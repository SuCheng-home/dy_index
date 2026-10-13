<template>
    <div class="upanddownadd">
        <back-tool>
            <el-button type="primary"  size="medium" @click="addTopLevels()" v-if="id==0">保存</el-button>
             <el-button type="primary"  size="medium" @click="addLowerLevels()" v-if="id!=0">保存</el-button>
        </back-tool>
        <div style="padding-top:20px;">
            <div class="body">
                 <el-form   label-width="140px">
                <el-form-item label="职务">
                    <el-select v-model="position">
                        <el-option v-for="(item,index) in datalist" :label="item.value" :value="item.code" :key="index"></el-option>
                    </el-select>
                </el-form-item>                
                <el-form-item label="姓名"  v-if="id==0">
                    <address-book v-model="addressData" :config="configData" ref="address"></address-book>
                </el-form-item>
                 <el-form-item label="下级"  v-if="id!=0">
                    <address-book v-model="addressData" :config="myconfigData" ref="address"></address-book>
                </el-form-item>                  
            </el-form>
            </div>
           
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {postion,addTopLevel,addLowerLevel} from '@/api/upanddown';
    export default {
        components: {
            AddressBook,
            BackTool
        },
        data() {          
            return {
                datalist: [],//上级类型               
                position:'' ,         
                configData:{title: '请选择第一级人员', depart: {target: 'user', departType: 't', userTypes: '1'},SingleChose:true},
                myconfigData:{title: '请选择下级人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
                addressData: {userJson:[]},
                id:this.$route.query.id
            }
        },
        created() {
            //获取职务
            postion().then(res => {
                if(res.data.data){                   
                     for(let i=0;i<res.data.data.length;i++){
                          if(res.data.data[i].value!=''){
                               this.datalist.push(res.data.data[i])
                           };
                     };
                      this.position=this.datalist[0].code;
                }else{
                   this.datalist =[];
                } }).catch(err => {});
           },     
        methods: {
            //保存
            addTopLevels() {
                if(!this.position){
                       this.$message.error('请选择职务！');
                         return
                };
                if((this.addressData=={})||(this.addressData.userJson.length==0)){
                      this.$message.error('请选择第一级人员！');
                         return
                }               
               addTopLevel(this.addressData.userJson[0].id,this.position).then(res => { 
                          if(res.data.code==200){
                                  this.$message({
                                      type: "success",
                                      message: "设置成功!"
                            });   
                            this.$router.back();
                          }                                  
                        }).catch(err => {});
            },
            addLowerLevels(){
                 if(!this.position){
                       this.$message.error('请选择职务！');
                         return
                };
                if((this.addressData=={})||(this.addressData.userJson.length==0)){
                      this.$message.error('请选择下级人员！');
                         return
                };   
                let userIds='';
                for(let i=0;i<this.addressData.userJson.length;i++){
                    if(i==this.addressData.userJson.length-1){
                         userIds+=this.addressData.userJson[i].id;
                    }else{
                      userIds+=this.addressData.userJson[i].id+',';
                    }
                }        
               addLowerLevel(this.id,this.position,userIds).then(res => { 
                          if(res.data.code==200){
                                  this.$message({
                                      type: "success",
                                      message: "添加成功!"
                            });   
                            this.$router.back();
                          }else{
                             this.$message.error(res.data.msg); 
                          }                                
                        }).catch(err => {});
            }
        }
    }
</script>
<style lang="scss" scoped>
    .upanddownadd {
        padding:12px;
    }
    .body{
       width: 810px;
       margin: 0 auto;
    }
  .el-select, .address-input{
        width: 100%;
    }
</style>
