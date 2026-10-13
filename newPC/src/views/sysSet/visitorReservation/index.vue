<template>
    <div class="visitorReservation">
        <div class="el-row menu-tools">
            <!-- <el-button @click="$router.back()" size="medium">返回</el-button> -->
            <el-button type="primary" size="medium"   @click="addAndUpdateVisitInit()">保存
            </el-button>
        </div>
        <div class="main-wrap">
            <el-form ref="ruleForm" :model="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="访客填写信息" required>
                   <el-checkbox v-model="ruleForm.isName" disabled :true-label="2" :false-label="1">姓名</el-checkbox>
                   <el-checkbox v-model="ruleForm.isMobile" disabled :true-label="2" :false-label="1">手机号</el-checkbox>
                   <el-checkbox v-model="ruleForm.isCardId" disabled :true-label="2" :false-label="1">身份证</el-checkbox>
                   <el-checkbox v-model="ruleForm.isVisitDate" disabled :true-label="2" :false-label="1">来访日期</el-checkbox>
                   <el-checkbox v-model="ruleForm.isVisitUser" disabled :true-label="2" :false-label="1">来访时间</el-checkbox>
                   <el-checkbox v-model="ruleForm.isVisitUser" disabled :true-label="2" :false-label="1">拜访人</el-checkbox>
                   <el-checkbox v-model="ruleForm.isReason" disabled :true-label="2" :false-label="1">事由</el-checkbox>                   
                   <el-checkbox v-model="ruleForm.isUnit"  :true-label="2" :false-label="1">单位</el-checkbox>
                   <el-checkbox v-model="ruleForm.isPeerUser"  :true-label="2" :false-label="1">同行人员</el-checkbox>
                   <el-checkbox v-model="ruleForm.isCarNo"  :true-label="2" :false-label="1">车牌号</el-checkbox>
                </el-form-item>
                <el-form-item label="审批设置" >
                    <el-checkbox v-model="ruleForm.isBatch" disabled :true-label="2" :false-label="1">被访人审批</el-checkbox>
                    <el-checkbox v-model="ruleForm.isBatchTw"  :true-label="2" :false-label="1">加审</el-checkbox>
                </el-form-item>
                <el-form-item label="加审人员" required v-if="ruleForm.isBatchTw==2">
                    <address-book v-model="addressDataone" :config="configPushDataone"></address-book>
                </el-form-item>
                 <el-form-item label="抄送设置" >
                    <el-checkbox v-model="ruleForm.isRimd"  :true-label="2" :false-label="1">需要抄送</el-checkbox>
                </el-form-item>
                <el-form-item label="抄送人员" required v-if="ruleForm.isRimd==2">
                    <address-book v-model="addressDatatwo" :config="configPushDatatwo"></address-book>
                </el-form-item>
                 <el-form-item label="预约码" v-if="qrcodeUrl">
                            <image-previewer  tag="richtext">
                    <img class="qrcode-container" :src="qrcodeUrl" />
                    </image-previewer>
                </el-form-item>
                
            </el-form>
        </div>
    </div>
</template>
<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import QRCode from 'qrcode'
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    import {getVisitInit,addAndUpdateVisitInit} from '@/api/visitorReservation';
    export default {
        components: {AddressBook,ImagePreviewer},
        data() {
            return {
                ruleForm: {
                    batchTwUserJson:[],//	加审人员json	string	
                    isBatch:2,//	是否需要审批 1 不需要 2 需要	number	
                    isBatchTw:1,//	是否需要加审 1不需要 2 需要	number	
                    isCarNo:1,//	车牌号 1 无 2 有	number	
                    isCardId:2,//	身份证1 无 2 有	number	
                    isMobile:2,//	手机号 1 无 2 有	number	
                    isName:2,//	姓名 1 无 2 有	number	
                    isPeerUser:1,//	同行人员 1 无 2 有	number	
                    isReason:2,//	事由 1 无 2 有	number	
                    isRimd:1,//	是否需要抄送 1 不需要 2 需要	number	
                    isUnit:1,//	单位 1 无 2 有	number	
                    isVisitDate:2,//	来访日期 1 无 2 有	number	
                    isVisitUser:2,//	拜访人 1 无 2 有	number	
                    remindUserJson:[],//	抄送人员json	string
                },
                addressDataone: {},
                addressDatatwo: {},
                configPushDataone: {
                    title: '加审人员',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: 'show'
                },
                configPushDatatwo: {
                    title: '抄送人员',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: 'show'
                },
                qrcodeUrl:""
            }
        },
        created() {
            this.getVisitInit()
        },
        methods: {
            //获取详情
            getVisitInit() {
                getVisitInit().then(res => res.data)
                    .then(data => {
                        if (data.code === 200&&data.data) {
                            let detailObject = data.data;
                            this.ruleForm.isBatch = detailObject.isBatch
                            this.ruleForm.isBatchTw = detailObject.isBatchTw
                            this.ruleForm.isCarNo = detailObject.isCarNo
                            this.ruleForm.isCardId = detailObject.isCardId
                            this.ruleForm.isMobile = detailObject.isMobile
                            this.ruleForm.isName = detailObject.isName
                            this.ruleForm.isPeerUser = detailObject.isPeerUser
                            this.ruleForm.isReason = detailObject.isReason
                            this.ruleForm.isRimd = detailObject.isRimd
                            this.ruleForm.isUnit = detailObject.isUnit
                            this.ruleForm.isVisitDate = detailObject.isVisitDate
                            this.ruleForm.isVisitUser = detailObject.isVisitUser
                            this.addressDataone.userJson = JSON.parse(detailObject.batchTwUserJson);
                            this.addressDatatwo.userJson = JSON.parse(detailObject.remindUserJson);
                             const baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/mobile/#/' : 'https://m.www.weixiaojia.cn/mobile/#/';
                              QRCode.toDataURL(`${baseHref}admissionReservation/visitorReservation?encryptSchId=${detailObject.encryptSchId}`)
                        .then(url => {
                            this.qrcodeUrl = url;
                        })
                        .catch(() => {
                        });

                        }
                    }).catch(() => {
                })
            },
            //保存
            addAndUpdateVisitInit() {
                if ((this.ruleForm.isBatchTw==2)&&this.addressDataone.userJson&&(this.addressDataone.userJson.length == 0)) {
                        this.$message({
                            message: '请选择加审人员！',
                            type: 'error'
                        });
                        return false;
                    }
                    if(this.ruleForm.isBatchTw==2){
                      this.ruleForm.batchTwUserJson=this.addressDataone.userJson
                    }
                    if ((this.ruleForm.isRimd==2)&& this.addressDatatwo.userJson&&(this.addressDatatwo.userJson.length == 0)) {
                        this.$message({
                            message: '请选择抄送人员！',
                            type: 'error'
                        });
                        return false;
                    }
                     if(this.ruleForm.isRimd==2){
                      this.ruleForm.remindUserJson=this.addressDatatwo.userJson
                    }
              
                addAndUpdateVisitInit(this.ruleForm).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({message: '设置成功！', type: 'success'});
                        this.getVisitInit()
                        // this.$router.back();
                    }
                }).catch(() => {
                })

            }
        }
    }
</script>
<style lang="scss" scoped>
    .visitorReservation {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
        .qrcode-container{
        height:100px;
    }
        .main-wrap {
            padding-top: 20px;
            padding-left: 20px;
            width: 810px;
            box-sizing: border-box;
            margin: 0 auto;
        }
    }
</style>


