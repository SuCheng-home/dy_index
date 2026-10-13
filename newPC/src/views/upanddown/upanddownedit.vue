<template>
    <div class="upanddownedit">
        <back-tool>
            <el-button type="primary"  size="medium" @click="updateCurrLevels()">保存</el-button>
        </back-tool>
        <div class="body">
               <div style="padding-top:20px;">
                    <el-form label-width="140px">
                        <el-form-item label="姓名">
                            <address-book v-model="addressData" :config="configData" ref="address"></address-book>
                        </el-form-item>
                        <el-form-item label="职务">
                            <el-select v-model="position">
                                <el-option v-for="(item,index) in datalist" :label="item.value" :value="item.code" :key="index"></el-option>
                            </el-select>
                        </el-form-item>               
                                    
                    </el-form>
                </div>
        </div>       
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {postion,updateCurrLevel, sysUserDetail} from '@/api/upanddown';
    export default {
        components: {
            BackTool,
            AddressBook
        },
        data() {          
            return {
                datalist: [],//上级类型               
                position:'' , 
                id:this.$route.query.id,
                name:this.$route.query.position,
                configData:{title: '请选择人员', depart: {target: 'user', departType: 't', userTypes: '1'},SingleChose:true},
                addressData: {},
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
                           if(this.name==res.data.data[i].value){
                                this.position=res.data.data[i].code;
                           }
                     };
                     
                }else{
                   this.datalist =[];
                } }).catch(err => {});
            this.getUserJsonInfo()
           },     
        methods: {
            getUserJsonInfo() {
              sysUserDetail({userId: this.id, userType: 1}).then(res => {
                this.addressData = { userJson: [res.data.data] }
              })
            },
            //保存
            updateCurrLevels() {
                if(!this.position){
                       this.$message.error('请选择职务！');
                         return
                };
                if((this.addressData=={})||(this.addressData.userJson.length==0)){
                      this.$message.error('请选择人员！');
                         return
                }  
               updateCurrLevel(this.id,this.position,this.addressData.userJson[0].id).then(res => { 
                          if(res.data.code==200){
                                  this.$message({
                                      type: "success",
                                      message: "编辑成功!"
                            });   
                            this.$router.back();
                          }                                  
                        }).catch(err => {});
            }           
        }
    }
</script>
<style lang="scss" scoped>
    .upanddownedit {
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
