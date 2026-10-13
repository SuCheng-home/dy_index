<template>
    <div class="page">
        <div class="page-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="deyuRemindersettings()">设置</el-button>
            <el-button type="primary" size="medium" @click="deyuCardManagement()" v-if="isShowByPermission('/schoolConductCard/schoolConductCardSet')">积分及养正卡配置</el-button>
            <el-button type="primary"  @click="copywritingSettings()" size="medium">学生周报文案设置</el-button>
        </div>
        <div class="page-main" :style="{height: `${maxH}px`}">
            <div class="deyu-list">
                <div  class="deyu-item " @click="jumpToPage(deyuItem.id)" :key="index" v-for="(deyuItem, index) in deyuList">
                    <div class="deyu-item__name">{{deyuItem.dimensionName}}</div>
                    <el-tag type="warning" size="small" v-if="deyuItem.typeTitle">{{deyuItem.typeTitle}}</el-tag>   
                    <div class="deyu-item__buttons"> 
                                            
                        <i class="fa fa-pencil" @click.stop="editDeyu(deyuItem.id)"></i>
                        <i class="fa fa-trash" @click.stop="deleteItem(deyuItem.id)"></i>
                    </div>
                </div>
                <div class="deyu-add-btn" @click="addDeyu">+</div>
            </div>
        </div>
        <el-dialog
            title="德育评价维度设置"
            :visible.sync="isShowDialog"
            width="800px"
        >
            <el-form ref="form" :model="formQuery" :rules="formRule" label-width="120px">
                <el-form-item label="名称" prop="dimensionName">
                    <el-input style="width: 600px;" :maxlength="8" v-model.trim="formQuery.dimensionName" placeholder="请输入名称（1-8个字符）"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="formQuery.typeCode" size="medium"  placeholder="请选择">
                        <el-option label="其他" :value="''"></el-option>
                        <el-option :key="index" v-for="(item, index) in typeList" :label="item.typeName" :value="item.typeCode1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="初始分" prop="initScore">
                    <el-input-number v-model="formQuery.initScore" :min="0" :max="999" label="请输入初始分"></el-input-number>
                </el-form-item> 
                 <el-form-item label="排序" prop="orderNum">
                    <el-input-number v-model="formQuery.orderNum" :min="1" :max="999" label="请输入排序"></el-input-number>
                </el-form-item> 
                <el-row style="margin-bottom:20px">
                    <el-col :span="5">
                        <el-form-item label="logo" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <div class="login-box" v-if="formQuery.logoUrl">
                            <img :src="formQuery.logoUrl" alt="">
                        </div>
                        <div class="logoAdd" @click="showDialogLogo">
                            <i class="el-icon-plus avatar-uploader-icon navAddIcon"></i>
                            <span class="navAddTitle">添加logo</span>
                        </div>                         
                    </el-col>
                </el-row>
                <el-form-item label="评价类型" prop="initScore">
                  <el-radio-group v-model="formQuery.type">
                        <el-radio label="1">老师评价（每天）</el-radio>
                        <el-radio label="3">老师评价（每周）</el-radio>
                        <el-radio label="2">学生互评</el-radio>
                    </el-radio-group> 
                </el-form-item>               
                <div class="box" v-show="formQuery.type==1">
                    <el-form-item label="每天上限" prop="dayMaxScord">
                      <el-input-number v-model.trim="formQuery.dayMaxScord" :min="1" :max="99" label="加减分上限"></el-input-number>
                   </el-form-item>
                    <el-form-item label="对所有老师使用" prop="isAllUse">
                    <el-checkbox v-model.trim="formQuery.isAllUse" :true-label="2" :false-label="1">是</el-checkbox>
                    </el-form-item>
                    <el-form-item label="其他评价项">
                         <el-checkbox v-model.trim="formQuery.isOtherType" :true-label="1" :false-label="0">表扬增加其他</el-checkbox>
                        <el-checkbox v-model.trim="formQuery.isOtherTypeLess" :true-label="1" :false-label="0">批评增加其他</el-checkbox>
                    </el-form-item> 
                </div>
                <div class="box" v-show="formQuery.type==2">
                    <el-form-item label="评价类型上限" prop="maxType">
                      <el-input-number v-model.trim="formQuery.maxType" :min="1" :max="99" label="评价类型上限"></el-input-number>
                    </el-form-item>
                    <el-form-item label="每周评价人数" prop="maxPerson">
                      <el-input-number v-model.trim="formQuery.maxPerson" :min="1" :max="99" label="每周评价人数"></el-input-number>
                    </el-form-item>                    
                    <el-form-item label="评价开始时间">
                       <el-select style="width: 300px;" v-model="formQuery.assessTimeJson.beginWeekId">
                            <el-option label="周一" value="1"></el-option>
                            <el-option label="周二" value="2"></el-option>
                            <el-option label="周三" value="3"></el-option>
                            <el-option label="周四" value="4"></el-option>
                            <el-option label="周五" value="5"></el-option>
                            <el-option label="周六" value="6"></el-option>
                            <el-option label="周日" value="7"></el-option>
                        </el-select>
                        <el-time-select  style="width: 300px;" :editable="false" :clearable="false" v-model="formQuery.assessTimeJson.beginTime" :picker-options="{start: '06:00',step: '00:05',end: '24:00'}" placeholder="选择时间"></el-time-select>
                    </el-form-item>
                     <el-form-item label="评价结束时间">
                     <el-select style="width: 300px;" v-model="formQuery.assessTimeJson.endWeekId">
                            <el-option label="周一" value="1"></el-option>
                            <el-option label="周二" value="2"></el-option>
                            <el-option label="周三" value="3"></el-option>
                            <el-option label="周四" value="4"></el-option>
                            <el-option label="周五" value="5"></el-option>
                            <el-option label="周六" value="6"></el-option>
                            <el-option label="周日" value="7"></el-option>
                        </el-select>
                        <el-time-select  style="width: 300px;" :editable="false" :clearable="false" v-model="formQuery.assessTimeJson.endTime" :picker-options="{start: '06:00',step: '00:05',end: '24:00'}" placeholder="选择时间"></el-time-select>
                    </el-form-item>                   
                </div>
                 <div class="box" v-show="formQuery.type==3">
                    <el-form-item label="对所有老师使用" prop="isAllUse">
                    <el-checkbox v-model.trim="formQuery.isAllUse" :true-label="2" :false-label="1">是</el-checkbox>
                    </el-form-item>
                    <el-form-item label="其他评价项">
                        <el-checkbox v-model.trim="formQuery.isOtherType" :true-label="1" :false-label="0">表扬增加其他</el-checkbox>
                        <el-checkbox v-model.trim="formQuery.isOtherTypeLess" :true-label="1" :false-label="0">批评增加其他</el-checkbox>
                    </el-form-item> 
                </div>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addEditDeyuSubmit">确 定</el-button>
              </span>
        </el-dialog>
         <el-dialog title="logo添加或更换" :visible.sync="diaLogoVisible" class="dialoglinkWrap" width="590px">
                <div class="dialoglinkBox clearfix">
                <div class="checkitem" v-for="(logoItem,index) in logoList" :key="index">
                    <input class="check-select" type="checkbox" v-model="logoItem.isShow" name="imgText" v-on:click="Checklogo(logoItem)">
                    <div class="checkitem-box">
                        <img class="check-img" v-if="logoItem.url" :src="logoItem.url">
                        <img class="check-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                        <!-- <p class="check-title" >{{logoItem.name}}</p> -->
                    </div>
                </div>
                 <uploader pathPrefix="deyu" module="deyu" moduleCode="2029" multiple v-model="imgfiles" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" @outInput="imgInput" :deleteFlag="true"></uploader>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="diaLogoVisible=false">取 消</el-button>
                    <el-button type="primary" @click="addLogoHandler()">保 存</el-button>
                </div>
            </el-dialog>
    </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {findSchoolHonorTypeCertList} from '@/api/fiveEducationSetup';
    import BaseMixin from '@/mixins/baseMixin';
    import {
        getSchoolConductDimensionList,
        deleteConductDimension,
        addSchoolConductDimension,
        getConductDimensionInfoById,
        editSchoolConductDimension
    } from  '@/api/deyu';
    import Uploader from '@/components/Uploader/WebUploader';
    import {findDicsByCode} from '@/api/common/common';
    import { isShowByPermission } from "@/utils";
    export default {
        components:{
          Uploader
         },
        name: "deyuSettingList",        
        mixins: [mixins, BaseMixin],
        data() {
            return {
                imgfiles:[],
                isShowDialog: false,
                formQuery: {
                    assessTimeJson:	{
                        beginTime:'17:00',//		开始时间	string	
                        beginWeekId:'4',//		开始星期	number	
                        beginWeekName:'',//		开始星期名称	string	
                        endTime:'24:00',//		结束时间	string	
                        endWeekId:'7',//		结束星期	number	
                        endWeekName:'',//		结束星期名称	string
                    },//学生互评时间Json
                    dayMaxScord:10,//	每天分数上限 教师使用	number	
                    dimensionName:'',//	维度名称	string	
                    initScore:60,//	初始分数	number	
                    isAllUse:1,//	是否对所有教师使用 教师使用 1否 2是	number	
                    isOtherType:0,//	是否增加其他项 0否 1是	number	
                    isOtherTypeLess:0,
                    maxPerson:3,//	评价人数上限 学生互评使用	number	
                    maxType:3,//	评价类型上限 学生互评使用	number	
                    type:'1',//	类型（1代表老师评价，2代表学生互评，3老师评价（每周））	number
                    logoUrl:'',
                    orderNum:1,
                    typeCode:'',
                    typeTitle:''
                },
                formRule: {
                    dimensionName: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    orderNum: [
                        { required: true, message: '请输入排序', trigger: 'blur' },
                    ],
                    initScore: [
                        { required: true, message: '请输入初始分', trigger: 'blur' },
                    ],
                    dayMaxScord: [
                        { required: true, message: '请输入每天上限', trigger: 'blur' },
                    ],
                    maxPerson:[
                        { required: true, message: '请输入评价人数上限', trigger: 'blur' },
                    ],
                     maxType:[
                        { required: true, message: '请输入评价类型上限', trigger: 'blur' },
                    ]
                },
                deyuList: [],
                isEdit: false,
                editId: null,
                logoList:[
                    {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu1.png',
                        isShow:false,
                        name:'德育'
                    },
                     {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu12.png',
                        isShow:false,
                        name:'德育'
                    },
                     {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu3.png',
                        isShow:false,
                        name:'德育'
                    }, {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu10.png',
                        isShow:false,
                        name:'德育'
                    },
                     {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu5.png',
                        isShow:false,
                        name:'德育'
                    },
                     {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu11.png',
                        isShow:false,
                        name:'德育'
                    },
                     {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu7.png',
                        isShow:false,
                        name:'德育'
                    },
                     {
                        url:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/deyu/deyu8.png',
                        isShow:false,
                        name:'德育'
                    },
                ],
                diaLogoVisible:false,
                logoItem:{},
                typeList: [],
            }
        },
        created() {
              findSchoolHonorTypeCertList()
                .then(res => res.data)
                .then(data => {
                    this.typeList = data.data;
                });
            this.getSchoolConductDimensionListFunc();
        },
        methods: {
            copywritingSettings(){
                this.$router.push({
                        path: "copywritingSettings",  
                        query: { moduleType:1 }    
                });
            },
            isShowByPermission,
    imgInput(val){
      this.logoList.push({url:val[0].fileUrl,isShow:false})
      this.imgfiles=[]
    },
             Checklogo(item){
                this.logoList.forEach((item)=>{
                    item.isShow=false;
                });
                this.logoItem=item;
            },
             addLogoHandler(){
                if(Object.keys(this.logoItem).length==0||this.logoItem&&this.logoItem.isShow==false){
                    this.$message({
                        type: 'error',
                        message: '请选择logo'
                    })
                }else{
                    this.formQuery.logoUrl=this.logoItem.url;
                    this.diaLogoVisible=false;
                }
            },
             showDialogLogo(){
                this.diaLogoVisible=true;
            },
            // 列表
            getSchoolConductDimensionListFunc() {
                getSchoolConductDimensionList()
                    .then(res => res.data)
                    .then(data => {
                        this.deyuList = data.data;
                    });
            },
            //删除
            deleteItem(dimensionId) {
                this.$confirm('您确定删除此德育评价维度吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteConductDimension({
                        dimensionId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getSchoolConductDimensionListFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            //新增
            addDeyu() {
                this.isEdit = false;
                this.isShowDialog = true;  
                 this.formQuery={
                                assessTimeJson:	{
                                    beginTime:'17:00',//		开始时间	string	
                                    beginWeekId:'4',//		开始星期	number	
                                    beginWeekName:'',//		开始星期名称	string	
                                    endTime:'24:00',//		结束时间	string	
                                    endWeekId:'7',//		结束星期	number	
                                    endWeekName:'',//		结束星期名称	string
                                },//学生互评时间Json
                                dayMaxScord:10,//	每天分数上限 教师使用	number	
                                dimensionName:'',//	维度名称	string	
                                initScore:60,//	初始分数	number	
                                isAllUse:1,//	是否对所有教师使用 教师使用 1否 2是	number	
                                isOtherType:0,//	是否增加其他项 0否 1是	number	
                                isOtherTypeLess:0,
                                maxPerson:3,//	评价人数上限 学生互评使用	number	
                                maxType:3,//	评价类型上限 学生互评使用	number	
                                type:'1',//	类型（1代表老师评价，2代表学生互评，3老师评价（每周））	number
                                logoUrl:'',
                                orderNum:1,
                                typeCode:''
                            }             
            }, 
            //编辑
            editDeyu(dimensionId) {
                getConductDimensionInfoById({dimensionId}).then(res => res.data).then(data => {
                        let mydata= data.data;
                        this.isShowDialog = true;
                        this.isEdit = true;
                        this.editId = dimensionId; 
                        this.formQuery.type=mydata.type+'';
                        this.formQuery.typeCode=mydata.typeCode||'';
                        this.formQuery.dimensionName=mydata.dimensionName;
                        this.formQuery.orderNum=mydata.orderNum||1;                        
                        this.formQuery.initScore=mydata.initScore;
                        this.formQuery.logoUrl=mydata.logoUrl||'';
                        if(mydata.type==1){
                          this.formQuery.dayMaxScord=mydata.dayMaxScord;
                          this.formQuery.isAllUse=mydata.isAllUse;
                          this.formQuery.isOtherType=mydata.isOtherType;
                          this.formQuery.isOtherTypeLess=mydata.isOtherTypeLess;
                        };    
                        if(mydata.type==3){
                          this.formQuery.isAllUse=mydata.isAllUse;
                          this.formQuery.isOtherType=mydata.isOtherType;
                          this.formQuery.isOtherTypeLess=mydata.isOtherTypeLess;
                        }; 
                        if(mydata.type==2){
                          this.formQuery.maxPerson=mydata.maxPerson;
                          this.formQuery.maxType=mydata.maxType;
                          this.formQuery.assessTimeJson=mydata.conductDimensionTimeInfo;
                          this.formQuery.assessTimeJson.beginWeekId=this.formQuery.assessTimeJson.beginWeekId+'';
                          this.formQuery.assessTimeJson.endWeekId=this.formQuery.assessTimeJson.endWeekId+'';
                        }; 
                    })
            },
            //保存
            addEditDeyuSubmit() {
                this.$refs.form.validate((isValid) => {
                    if(isValid) {
                        if(!this.formQuery.logoUrl){
                            this.$alert('请添加logo!', '提示', {
                                type: 'error'
                            }, {
                                confirmButtonText: '确定'
                            });
                    return false;
                        }
                        let myformQuery=this.formQuery;
                        if(this.formQuery.type==2){
                           let weeknamelist=['','周一','周二','周三','周四','周五','周六','周日'];
                           myformQuery.assessTimeJson.beginWeekName=weeknamelist[myformQuery.assessTimeJson.beginWeekId/1];
                           myformQuery.assessTimeJson.endWeekName=weeknamelist[myformQuery.assessTimeJson.endWeekId/1];  
                           myformQuery.assessTimeJson=JSON.stringify(myformQuery.assessTimeJson) 
                        }else{
                            myformQuery.assessTimeJson=''
                        };
                        if(this.formQuery.typeCode){
                           myformQuery.typeTitle = this.typeList[this.typeList.map(item => item.typeCode1).indexOf(this.formQuery.typeCode)].typeName || '';
                        }else{
                            myformQuery.typeTitle=''
                        }
                        if(this.isEdit) {
                            editSchoolConductDimension(Object.assign({},myformQuery, {
                                id: this.editId
                            }))
                                .then(res => res.data)
                                .then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '编辑成功',
                                            type: 'success'
                                        });
                                        this.getSchoolConductDimensionListFunc();
                                        this.isShowDialog = false;
                                    } else {
                                        this.$message.error(data.msg);
                                    }
                                });
                        } else {
                            addSchoolConductDimension(myformQuery)
                                .then(res => res.data)
                                .then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                        this.getSchoolConductDimensionListFunc();
                                        this.isShowDialog = false;
                                    } else {
                                        this.$message.error(data.msg);
                                    }
                                });
                        };
                        this.formQuery={
                                assessTimeJson:	{
                                    beginTime:'17:00',//		开始时间	string	
                                    beginWeekId:'4',//		开始星期	number	
                                    beginWeekName:'',//		开始星期名称	string	
                                    endTime:'24:00',//		结束时间	string	
                                    endWeekId:'7',//		结束星期	number	
                                    endWeekName:'',//		结束星期名称	string
                                },//学生互评时间Json
                                dayMaxScord:10,//	每天分数上限 教师使用	number	
                                dimensionName:'',//	维度名称	string	
                                initScore:60,//	初始分数	number	
                                isAllUse:1,//	是否对所有教师使用 教师使用 1否 2是	number	
                                isOtherType:0,//	是否增加其他项 0否 1是	number	
                                isOtherTypeLess:0,
                                maxPerson:3,//	评价人数上限 学生互评使用	number	
                                maxType:3,//	评价类型上限 学生互评使用	number	
                                type:'1',//	类型（1代表老师评价，2代表学生互评，3老师评价（每周））	number
                                logoUrl:this.formQuery.logoUrl,
                                orderNum:1,
                                typeCode:''
                            };
                    }
                })
            },            
            //详情
            jumpToPage(id) {
                 this.$router.push({
                        path:'deyuDetail', query:{id:id}                      
                    })
            },
            deyuCardManagement() {
                 this.$router.push({
                        path:'deyuCardManagement'                     
                    })
            },
            deyuRemindersettings() {
                 this.$router.push({
                        path:'deyuRemindersettings'                     
                    })
            },
        }
    }
</script>

<style lang="scss" scoped>
 .login-box{
        float: left;
        width:100px;
        height:100px;
        border-radius:6px;
        overflow: hidden;
        margin-right:20px;
        img{
            display: block;
            width:100px;
            height:100px;
        }
    }
    .logoAdd{
        float: left;
        width: 100px;
        height: 100px;
        padding-top: 17px;
        line-height: 1;
        border: 1px solid #d0d0d0;
        background-color: #fbfdff;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;
        .navAddIcon{
            font-size: 40px;
            color: #8c939d;
            width:auto;
            height:auto;
        }
        .navAddTitle{
            font-size: 14px;
            color: #8c939d;
            display: block;
            margin-top: 10px;
        }
    }
    .logoAdd:hover{
      border:1px solid  #409EFF;
    }
    .logoAdd:hover .navAddIcon{
      color:#409EFF;
    }
    .logoAdd:hover .navAddTitle{
      color:#409EFF;
    }
 .checkitem{
        width: 100px;
        float: left;
        position: relative;
        margin-right: 10px;
        .checkitem-box{
            width: 100px;
            padding: 10px 0;
            float: left;
            text-align: center;
            position: relative;
            .check-img{
            width: 66px;
            height: 66px;
            display: block;
            border-radius: 6px;
            margin: 0 auto;
            }
            .check-title{
            display: inline-block;
            width:100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            }
            .link-title{
            font-size: 14px;
            color: #333;
            line-height: 26px;
            margin-bottom: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            }

        }
 }
    .page {
        padding:12px;
    }
    .page-header{
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
    .page-main {
        overflow-y: auto;
    }

    .deyu-list {
        margin-top: 20px;
    }

    .deyu-item {
        background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/deyu/dimension_bmg.jpg) no-repeat center center / cover;
        margin-right: 20px;
        margin-bottom: 20px;
        box-shadow: 0 0 7px #777;
        position: relative;
        width: 200px;
        height: 150px;
        text-align: center;
        float: left;
        .el-tag{
            position:absolute;
            left:5px;
            top:5px;
        }
        .deyu-item__name {
            background-color: rgba(0, 0, 0, 0.2);
            color: #fff;
            position: absolute;
            bottom: 0;
            padding: 5px;
            width: 100%;
            box-sizing: border-box;
        }

        .deyu-item__buttons {
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 16px;
            display: none;
             cursor:pointer;

            .fa-pencil {
                color: #409eff;
            }

            .fa-trash {
                color: #f56c6c;
            }
        }

        &:hover {
            .deyu-item__buttons {
                display: block;
            }

        }
    }

    .deyu-add-btn {
        width: 200px;
        height: 150px;
        text-align: center;
        float: left;
        line-height: 150px;
        border: 1px dashed #ccc;
        cursor: pointer;
        font-size: 36px;
        border-radius: 5px;
    }
</style>
