<template>
    <div class="schoolLogSetup">
        <div class="top">
            <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="editSchoolLogSets()">保存</el-button>
        </div>
        <div  class="content" :style="`height:${nobottommaxH}px`">
            <div class="body">
              <div>
               <el-checkbox v-model="query.isAddAttendanceData">添加考勤数据</el-checkbox>
            </div>
            <div>
               <el-checkbox v-model="query.isAddCheckData">添加检查数据</el-checkbox>
            </div>
            <div>
               <el-checkbox v-model="query.isAddCalendarData">添加日程数据</el-checkbox> 
            </div>
            <div>
                <el-checkbox v-model="query.isNeedSend">需要发布</el-checkbox>
            </div>
            <div class="box" v-if="query.isNeedSend">
                <span class="red">*</span> 发送范围:
                <div class="box-addres">
                      <address-book v-model="addressData" :config="configData"></address-book>
                </div>
            </div>
            </div>
        </div>        
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {initSchoolLogSet, editSchoolLogSet} from '@/api/schoolLog';
    export default {
        components: { AddressBook},
        data() {
            return {
               query:{
                    departJson:[],//	地址簿部门json	string	@mock=
                    groupJson:[],//	地址簿常用组json	string	@mock=
                    userJson:[],//	地址簿用户json	string
                    id:'',	//主键	number	
                    isAddAttendanceData:false,//	是否添加考勤数据 1添加 2不添加	number	@mock=1
                    isAddCalendarData:false,	//是否添加日程数据 1添加 2不添加	number	@mock=1
                    isAddCheckData:false,	//是否添加检查数据 1添加 2不添加	number	@mock=1
                    isNeedSend:false,	//是否需要发送 1需要 2不需要	number	@mock=1                    	
                },
                configData: {
                        title: '发布范围',
                        depart: {target: 'all', departType: 'all', userTypes: '1,3'},
                        group: true
                },
                addressData: {
                    departJson:[],//	地址簿部门json	string	@mock=
                    groupJson:[],//	地址簿常用组json	string	@mock=
                    userJson:[],//	地址簿用户json	string
                },

            }
        },
        mixins: [windowResize],       
        created() {
           initSchoolLogSet().then(res => res.data).then(data => {              
               if(data.code==200){
                    let mydata=data.data;
                    if(mydata.isAddAttendanceData==1){
                        this.query.isAddAttendanceData=true;
                    };
                    if(mydata.isAddCalendarData==1){
                        this.query.isAddCalendarData=true;
                    };
                    if(mydata.isAddCheckData==1){
                        this.query.isAddCheckData=true;
                    };
                    if(mydata.isNeedSend==1){
                        this.query.isNeedSend=true;
                        if(mydata.departJson){
                           this.addressData.departJson=JSON.parse(mydata.departJson);
                        };
                        if(mydata.groupJson){
                           this.addressData.groupJson=JSON.parse(mydata.groupJson);
                        };
                        if(mydata.userJson){
                           this.addressData.userJson=JSON.parse(mydata.userJson);
                        };
                    };
                    this.query.id=mydata.id;
               }
            })
        },
        methods: {
            //保存
            editSchoolLogSets(){
                let obj={
                        departJson:this.addressData.departJson,//	地址簿部门json	string	@mock=
                        groupJson:this.addressData.groupJson,//	地址簿常用组json	string	@mock=
                        userJson:this.addressData.userJson,//	地址簿用户json	string
                        id:this.query.id,	//主键	number	
                        isAddAttendanceData:2,//	是否添加考勤数据 1添加 2不添加	number	@mock=1
                        isAddCalendarData:2,	//是否添加日程数据 1添加 2不添加	number	@mock=1
                        isAddCheckData:2,	//是否添加检查数据 1添加 2不添加	number	@mock=1
                        isNeedSend:2	//是否需要发送 1需要 2不需要	number	@mock=1  
                   };
                    if(this.query.isAddAttendanceData){
                        obj.isAddAttendanceData=1;
                    };
                    if(this.query.isAddCalendarData){
                        obj.isAddCalendarData=1;
                    };
                    if(this.query.isAddCheckData){
                        obj.isAddCheckData=1;
                    };
                    if(this.query.isNeedSend){
                        obj.isNeedSend=1;
                        let num=0;
                        if(this.addressData.departJson){
                            num+=this.addressData.departJson.length;
                        };
                        if(this.addressData.groupJson){
                            num+=this.addressData.groupJson.length;
                        };
                        if(this.addressData.userJson){
                            num+=this.addressData.userJson.length;
                        };
                        if(num==0){
                            this.$message({type: "warning",message: "发送范围不能为空!"});
                            return;
                       }
                    }else{
                        obj.userJson=[];
                        obj.groupJson=[];
                        obj.departJson=[];
                    }
                    editSchoolLogSet(obj).then(res => {
                                let _this = this;
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            }).catch(err => {});
            }
        },
    }
</script>
<style lang="scss" scoped>
   .schoolLogSetup{
       padding:12px;
       .top{
           padding-bottom: 10px;
           border-bottom: 1px solid #e7eaec;
       }
       .content{
            overflow:auto;
            .body{
                margin: 0 auto;
            }
       } 
      
       .content>div{
           width: 800px;
           padding-left: 100px;
           margin: 10px 0;
           line-height: 30px;
           font-size: 14px;
           .red{
               color:red;
           }
           .box-addres{
               float: right;
               width: 600px;
           }
       }    
   }   
</style>
