<template>
    <div class="app-container">
        <div class="header">
            <el-row>
                <el-col :span="24">
                   <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button class="filter-item" type="primary"  size="medium" @click="save()">保存</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="main-wrap" :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <el-form :model="ruleForm" ref="addServiceForm" label-width="140px" class="column-ruleForm custom—scrollbar">
                <el-form-item label="招生批次" >
                    {{title}}
                </el-form-item>
                <el-form-item label="分管领导" class="is-required" v-show="!id">
                     <address-book v-model="addressData" :config="activityScopeData"  ref="address"></address-book>
                </el-form-item>
                  <el-form-item label="分管领导" v-if="id">
                    {{addressData.userJson[0].name}}
                </el-form-item>
                <el-form-item label="管理范围"  class="is-required" >
                     <el-button type="primary" plain size="small"   @click="isShowDialogfun">编辑管理范围</el-button>
                    <div  v-for="(items,indexs) in ruleForm.inchargeScopeJson" :key="indexs">
                        <div class="title">{{items.schoolCountyName}}</div>
                        <span  v-for="(item,index) in items.areaSchoolList" :key="index">
                            &nbsp;<el-tag type="info">{{item.graduateSchoolName}}</el-tag>&nbsp;
                         </span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
         <el-dialog title="管理范围" :visible.sync="isShowDialog" width="900px" :close-on-click-modal="false">
              <div v-for="(items,indexs) in poplist" :key="indexs">
                   <el-checkbox :indeterminate="items.isIndeterminate" v-model="items.checkAll" @change="handleCheckAllChange(indexs)">{{items.schoolCountyName}}</el-checkbox>
                    <div style="padding: 15px;background: #efefef;margin: 10px;">
                        <el-checkbox-group v-model="items.checkedCities" @change="handleCheckedCitiesChange(indexs)">
                           <el-checkbox v-for="(item,index) in items.areaSchoolList" :key="index" :label="item.graduateSchoolCode" > {{item.graduateSchoolName}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
              </div>
            <span slot="footer">
                <el-button size="medium" @click="isShowDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="addfun()">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    import {getNoticeSchoolCountryList,addNoticeIncharge,editNoticeIncharge,getNoticeInchargeInfoById} from "@/api/schoolSignupHigh";
    export default {
        mixins: [mixin],
        components: {
            AddressBook
        },
        data() {
            return {
                id: this.$route.query.id,
                title: this.$route.query.title,
                ruleForm: {
                    inchargeUserId: '',
                    inchargeUserName: '',
                    inchargeUserJson: '',
                    noticeId: this.$route.query.noticeId,
                    inchargeScopeJson:[]
                },
                isShowDialog:false,
                 activityScopeData: {
                    title: '分管领导',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    SingleChose:true,
                    group: true,
                },
                addressData:{
                 userJson:[]
                },
                poplist:[],
                
            }
        },
        created() {
            this.getNoticeSchoolCountryList()
            if(this.id){
                getNoticeInchargeInfoById(this.id).then(res => {
                const data = res.data.data;
                if (res.data.code === 200) {
                    this.ruleForm.inchargeScopeJson=JSON.parse(data.inchargeScopeJson)
                    this.addressData = {
                      userJson:data.inchargeUserJson? JSON.parse(data.inchargeUserJson) : []
                    }
                }
                })
            }
        },
        methods: {
             save(){
                 if(!this.addressData.userJson||this.addressData.userJson.length==0){
                   this.$message({
                                                type: 'error',
                                                message: '请选择分管领导'
                                            });
                    return
                 }
                 if(this.ruleForm.inchargeScopeJson.length==0){
                     this.$message({
                                                type: 'error',
                                                message: '请选择管理范围'
                                            });
                    return
                 }
                 this.ruleForm.inchargeUserId=this.addressData.userJson[0].id
                 this.ruleForm.inchargeUserName=this.addressData.userJson[0].name
                 this.ruleForm.inchargeUserJson=this.addressData.userJson
                if(this.id){
                    this.ruleForm.id=this.id
                     editNoticeIncharge(this.ruleForm)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        if(data.data.length){
                                            this.$alert(data.data, '设置结果', {
                                            confirmButtonText: '确定',
                                            callback: action => {
                                                 this.$router.back()
                                            }
                                            });

                                        }else{
                                            this.$message({
                                                message: '编辑成功',
                                                type: 'success'
                                            });
                                           this.$router.back()
                                        }
                                       
                                    }else{
                                           this.$message({
                                                type: 'error',
                                                message: data.msg
                                            });
                                   
                                    }
                                });
                }else{
                    addNoticeIncharge(this.ruleForm)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                         if(data.data.length){
                                           this.$alert(data.data, '设置结果', {
                                            confirmButtonText: '确定',
                                            callback: action => {
                                                 this.$router.back()
                                            }
                                            });

                                        }else{
                                           this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                        this.$router.back()
                                        }
                                        
                                    }else{
                                    this.$message({
                                                type: 'error',
                                                message: data.msg
                                            });
                                    }
                                });
                }
                },
            getNoticeSchoolCountryList(){
                getNoticeSchoolCountryList(this.$route.query.noticeId).then(res => {
                    if (res.data.code === 200) {
                        let data=res.data.data
                        for(let i=0;i<data.length;i++){
                            data[i].checkAll=false
                            data[i].isIndeterminate=false
                            data[i].checkedCities=[]
                        }
                        this.poplist=data
                    };
                }).catch(err => {});
            },
            isShowDialogfun(){
                for(let i=0;i<this.poplist.length;i++){
                    this.poplist[i].checkAll=false
                    this.poplist[i].isIndeterminate=false
                    this.poplist[i].checkedCities=[]
                   
                    for(let j=0;j<this.ruleForm.inchargeScopeJson.length;j++){
                        if(this.poplist[i].schoolCountryCode==this.ruleForm.inchargeScopeJson[j].schoolCountryCode){  
                            for(let k=0;k<this.ruleForm.inchargeScopeJson[j].areaSchoolList.length;k++){
                                 this.poplist[i].checkedCities.push(this.ruleForm.inchargeScopeJson[j].areaSchoolList[k].graduateSchoolCode)
                            }
                        }
                    }
                    this.poplist[i].checkAll=false
                    this.poplist[i].isIndeterminate=false
                    this.handleCheckedCitiesChange(i)
                }
                
                this.isShowDialog=true;
            },
            addfun(){
                let inchargeScopeJson=[]
                for(let i=0;i<this.poplist.length;i++){
                    if(this.poplist[i].checkedCities.length){
                        let obj={
                            schoolCountryCode:this.poplist[i].schoolCountryCode,
                            schoolCountyName:this.poplist[i].schoolCountyName,
                            areaSchoolList:[]
                        }
                        for(let j=0;j<this.poplist[i].checkedCities.length;j++){
                            for(let k=0;k<this.poplist[i].areaSchoolList.length;k++){
                                if(this.poplist[i].checkedCities[j]==this.poplist[i].areaSchoolList[k].graduateSchoolCode){
                                    obj.areaSchoolList.push(this.poplist[i].areaSchoolList[k])
                                }
                             }
                        }
                        inchargeScopeJson.push(obj)
                    }
                }
                this.ruleForm.inchargeScopeJson=inchargeScopeJson
                this.isShowDialog=false;

            },
            handleCheckAllChange(index) {
                let cityOptions=[]
                for(let i=0;i<this.poplist[index].areaSchoolList.length;i++){
                    cityOptions.push(this.poplist[index].areaSchoolList[i].graduateSchoolCode)
                }
                this.poplist[index].checkedCities = this.poplist[index].checkAll ? cityOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(index) {
                    let checkedCount = this.poplist[index].checkedCities.length;
                    this.poplist[index].checkAll = checkedCount === this.poplist[index].areaSchoolList.length;
                    this.poplist[index].isIndeterminate = checkedCount > 0 && checkedCount < this.poplist[index].areaSchoolList.length;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .header {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    .column-ruleForm {
        width: 810px;
        margin: 0 auto;
        padding-top: 20px;
        box-sizing: border-box;
    }

</style>
