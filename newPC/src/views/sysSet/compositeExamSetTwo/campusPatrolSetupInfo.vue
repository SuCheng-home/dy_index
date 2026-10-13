<template>
    <div class="campusPatrolSetupEidt">
        <div class="el-row">
            <div class="top">
                  <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                   <el-button size="medium" type="primary" @click.native="campusPatrolSetupEidt()">编辑</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="巡查组名称">
                    {{ruleForm.dutyName}}
                </el-form-item>
                 <!-- v-if="ruleForm.isPush==0||ruleForm.isPushGradeMan==2" -->
                <el-form-item label="推送设置">
                     <span  v-if="ruleForm.isPush==0">指定人员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                     <span  v-if="ruleForm.isPushGradeMan==2">级部主任（关联年级的巡查项可以推送级部主任）</span>
                      <span v-if="ruleForm.isRemindDutyUser==2">责任人</span>
                </el-form-item>
                <el-form-item label="推送人员"  v-if="ruleForm.isPush==0">
                    <span  v-for="(item,index) in newaddressData.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                     <el-form-item label="周一巡查人员" >
                         <span  v-for="(item,index) in addressData1.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="周二巡查人员" >
                    <span  v-for="(item,index) in addressData2.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="周三巡查人员" >
                    <span  v-for="(item,index) in addressData3.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="周四巡查人员" >
                    <span  v-for="(item,index) in addressData4.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="周五巡查人员" >
                    <span  v-for="(item,index) in addressData5.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="周六巡查人员" >
                    <span  v-for="(item,index) in addressData6.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="周日巡查人员" >
                    <span  v-for="(item,index) in addressData7.userJson" :key="index">{{item.name}}&nbsp;&nbsp;</span>
                </el-form-item>    
                <el-form-item label="关联巡查项" >
                    <div class="ul">
                    <div class="li" v-for="(item,index) in xuanzhongdataList" :key="index">
                            <img  :src="item.cover||'https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png'" />                    
                                <el-tooltip class="item" v-if="item.checkItemName.length>10" effect="dark" :content="item.checkItemName" placement="top">
                                    <div class="name" >
                                    {{item.checkItemName}}
                                    </div>
                                </el-tooltip>                      
                            <div class="name" v-else>
                                {{item.checkItemName}}
                            </div>
                    </div>                               
                </div>
                </el-form-item>
            </el-form>
            <el-dialog title="关联巡查项"
                :visible.sync="isShowDialog"
                width="50%"
            >
            <div class=" pop">
                   <el-checkbox-group v-model="checkList"  >
                <el-checkbox :label="item.id" :key="index" v-for="(item,index) in dataList" border>
                     <div class="ul">
                    <div class="li">
                            <img  :src="item.cover||'https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png'" />                    
                                <el-tooltip class="item" v-if="item.checkItemName.length>7" effect="dark" :content="item.checkItemName" placement="top">
                                    <div class="name" >
                                    {{item.checkItemName}}
                                    </div>
                                </el-tooltip>                      
                            <div class="name" v-else>
                                {{item.checkItemName}}
                            </div>
                    </div> 
                    </div> 
                </el-checkbox>
            </el-checkbox-group>
            </div>
           
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addScoreItemSubmit">确 定</el-button>
              </span>
        </el-dialog>
        </div>
    </div>
</template>
<script>
    import {updateComplexCheckBase,getComplexCheckItemList,getComplexCheckBase} from '@/api/compositeExamSetTwo';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    export default {
        components: {
            AddressBook,
        },
        data() {
            return {
                ruleForm: {
                    dutyName:'',//	值班名称	string	
                    pushUsers:'',//	推送人	string		
                    isPush:1,//	是否推送检查结果(0:推送 1:不推送)	number	
                    isPushGradeMan:1,//	是否推送检查结果给年级组长(2:推送 1:不推送)	number	
                    isRemindDutyUser:2,//	责任人(2:是 1:否)	number	
                    itemIdList:[],
                    monCheckUser:'',//	周一值班人员	string	
                    monCheckUserIds:'',//	周一值班人员Ids	string	
                    secondCheckUser:'',//	周二值班人员	string	
                    secondCheckUserIds:'',//	周二值班人员Ids	string
                    wednesCheckUser:'',//	周三值班人员	string	
                    wednesCheckUserIds:'',//	周三值班人员Ids	string	
                    thursCheckUser:'',//	周四值班人	string	
                    thursCheckUserIds:'',//	周四值班人Ids	string	
                    friCheckUser:'',//	周五值班人	string	
                    friCheckUserIds:'',//	周五值班人Ids	string                    
                    satCheckUser:'',//	周六检查人	string	
                    satCheckUserIds:'',//	周六检查人Ids	string	                   
                    sunCheckUser:'',//	周日检查人	string	
                    sunCheckUserIds:'',//	周日检查人ids	string	
                    id:this.$route.query.id
                },
                configData: {title: '选择人员', depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true}},               
                newaddressData: {
                    userJson:[]
                },
                addressData1: {
                    userJson:[]
                },
                addressData2: {
                    userJson:[]
                },
                addressData3: {
                    userJson:[]
                },
                addressData4: {
                    userJson:[]
                },
                addressData5: {
                    userJson:[]
                },
                addressData6: {
                    userJson:[]
                },
                addressData7: {
                    userJson:[]
                },
                dataList:[],
                xuanzhongdataList:[],
                checkList:[],
                is:false
            }
           
        },
        created() {
           getComplexCheckItemList().then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.dataList = data.data;
                        getComplexCheckBase(this.$route.query.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {                                             
                        this.newaddressData.userJson=JSON.parse(data.data.pushUsers||'[]')
                        this.addressData1.userJson=JSON.parse(data.data.monCheckUser||'[]')                        
                        this.addressData2.userJson=JSON.parse(data.data.secondCheckUser||'[]')
                        this.addressData3.userJson=JSON.parse(data.data.wednesCheckUser||'[]')
                        this.addressData4.userJson=JSON.parse(data.data.thursCheckUser||'[]')
                        this.addressData5.userJson=JSON.parse(data.data.friCheckUser||'[]')
                        this.addressData6.userJson=JSON.parse(data.data.satCheckUser||'[]')
                        this.addressData7.userJson=JSON.parse(data.data.sunCheckUser||'[]')
                         this.ruleForm.dutyName=data.data.dutyName
                        this.ruleForm.isPush=data.data.isPush
                        this.ruleForm.isPushGradeMan=data.data.isPushGradeMan  
                        this.ruleForm.isRemindDutyUser=data.data.isRemindDutyUser
                        
                        this.is=true
                        this.xuanzhongdataList=[]
                        for(let i=0;i<data.data.itemIdList.length;i++){
                            for(let j=0;j<this.dataList.length;j++){
                                if(data.data.itemIdList[i]==this.dataList[j].id){
                                    this.xuanzhongdataList.push(this.dataList[j])
                                }                 
                            }
                        }
                    }
                }).catch(() => {
                })
                    }
                }).catch(() => {
                })
        },
        mixins: [mixin],
       methods:{
           campusPatrolSetupEidt() {
                this.$router.push({
                    path: 'campusPatrolSetupEidt',
                    query: {
                        id: this.$route.query.id
                    }
                })
            },
          addfun(){
              this.checkList=[]
              for(let i=0;i<this.xuanzhongdataList.length;i++){
                  this.checkList.push(this.xuanzhongdataList[i].id)
              }
              this.isShowDialog=true
          },
          addScoreItemSubmit(){
              this.xuanzhongdataList=[]
              for(let i=0;i<this.checkList.length;i++){
                 for(let j=0;j<this.dataList.length;j++){
                     if(this.checkList[i]==this.dataList[j].id){
                         this.xuanzhongdataList.push(this.dataList[j])
                     }                 
                 }
              }
              this.isShowDialog=false;
          },
          delComplexCheckItem(index){              
              this.xuanzhongdataList.splice(index,1)
          },
          idsfun(list){
            return (list.map(item => item.id)).join(',');
          },
          updateComplexCheckBase(){
               if (this.ruleForm.dutyName === "") {
                    this.$alert('请填写巡查组名称！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
            if (this.ruleForm.isPush ==0&&this.newaddressData.userJson.length==0) {
                    this.$alert('请选择推送人员！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
            }
            if (this.xuanzhongdataList.length==0) {
                    this.$alert('请选择关联巡查项！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
            }
            this.ruleForm.pushUsers=this.ruleForm.pushUsers==0?this.newaddressData.userJson:[]
            this.ruleForm.itemIdList=this.xuanzhongdataList.map(item => item.id)
            this.ruleForm.monCheckUser=this.addressData1.userJson
            this.ruleForm.monCheckUserIds=(this.addressData1.userJson.map(item => item.id)).join(',')
            this.ruleForm.secondCheckUser=this.addressData2.userJson
            this.ruleForm.secondCheckUserIds=(this.addressData2.userJson.map(item => item.id)).join(',')
            this.ruleForm.wednesCheckUser=this.addressData3.userJson
            this.ruleForm.wednesCheckUserIds=(this.addressData3.userJson.map(item => item.id)).join(',')
            this.ruleForm.thursCheckUser=this.addressData4.userJson
            this.ruleForm.thursCheckUserIds=(this.addressData4.userJson.map(item => item.id)).join(',')
            this.ruleForm.friCheckUser=this.addressData5.userJson
            this.ruleForm.friCheckUserIds=(this.addressData5.userJson.map(item => item.id)).join(',')
            this.ruleForm.satCheckUser=this.addressData6.userJson
            this.ruleForm.satCheckUserIds=(this.addressData6.userJson.map(item => item.id)).join(',')
            this.ruleForm.sunCheckUser=this.addressData7.userJson
            this.ruleForm.sunCheckUserIds=(this.addressData7.userJson.map(item => item.id)).join(',')
             updateComplexCheckBase(this.ruleForm).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '巡查组添加成功！'
                        });
                        this.$router.back();
                    }
                })
          }
       }
    }
</script>
<style lang="scss" scoped>
.campusPatrolSetupEidt{
    padding:12px;
    .top {
      padding-bottom: 10px;
      border-bottom: 1px solid  #e7eaec;
    }
    .scrollBar{
        overflow:auto;
    }
    .demo-ruleForm{
        width: 810px;
        margin: 20px auto;
    }
    .pop{
        height:360px;
        overflow:auto;
    }
    .ul{
        overflow:hidden;
        .li{
            float: left;
            width: 145px;
            margin: 10px;
            text-align: center;
            position: relative;
            img{
                width:80px;
            }
            .name{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 30px;
                font-size: 14px;
                color: #303133;
                font-weight: 600;
            }
            i{
                position: absolute;
                right: 0;
                font-size: 18px;
                color:#F56C6C;
            }
        }
    }
}

</style>
