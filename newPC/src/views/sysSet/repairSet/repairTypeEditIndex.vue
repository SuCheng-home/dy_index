<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button size="medium" class="filter-item" type="primary" @click="editRepairType()" :loading="listLoading">确定
            </el-button>
        </back-tool>
        <div style="padding-top:20px;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="140px"
                     style="width:810px;margin:10px auto;">
                <el-form-item label="上级类型：">
                    <el-select v-model="pId" @change="onChange">
                        <el-option v-for="item in Superiorlist" :label="item.repairTypeName" :value="item.id"
                                   :key="item.repairTypeName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型名称：" prop="repairTypeName">
                    <el-input v-model="ruleForm.repairTypeName" :maxlength="50" placeholder="类型名称(1-50个字符)"
                              @blur="inputBlurHandler"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNo" >
                    <el-input-number v-model="ruleForm.orderNo" :min="1" :step="1" :max="99999" step-strictly></el-input-number>
                </el-form-item>
                <el-form-item label="类型分类：" prop="checkedType">
                    <el-checkbox-group v-model="ruleForm.checkedType" size="small" @change="checkTypeSet">
                        <el-checkbox label="1" :disabled="teshuFlag==2">报修</el-checkbox>
                        <el-checkbox label="2" :disabled="teshuFlag==1">资产</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="资产负责人：" prop="managerUserNames2" v-if="type==2||type==0">
                    <address-book v-model="addressData2" :config="configData" ref="address"></address-book>
                </el-form-item>
                <el-form-item label="报修负责人：" prop="managerUserNames"  v-if="type==1||type==0">
                    <address-book v-model="addressData" :config="configData" ref="address"></address-book>
                </el-form-item>
                <el-form-item label="需要反馈：" prop="type"  v-if="type==1||type==0">
                    <el-checkbox v-model="isFback"></el-checkbox>
                </el-form-item>
            </el-form>
        </div>

    </div>

</template>

<script>
    import {
        getRepairTypeInfo,
        updateRepairType,
        findParentRepairPlaceList,
        getRepairTypeById
    } from '@/api/repairManage';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import BackTool from '@/components/BackTool';

    export default {
        components: {
            AddressBook,
            BackTool
        },
        data() {
            const examineValidator2= (rule, value, callback) => {
                if (!this.addressData2.userJson||this.addressData2.userJson.length < 1) {
                    callback(new Error('请选择资产负责人'));
                } else {
                    callback();
                }
            };
            const examineValidator = (rule, value, callback) => {
                // if (value == undefined || this.addressData.userJson.length < 1) {
                //     callback(new Error('请选择报修负责人'));
                // } else {
                //     callback();
                // }
                if (!this.addressData.userJson||this.addressData.userJson.length < 1) {
                    callback(new Error('请选择报修负责人'));
                } else {
                    callback();
                }
            };
            const validatecheckedType= (rule, value, callback) => {
                if(this.ruleForm.checkedType){
                    if (value.length==0) {
                        callback(new Error('至少选择一个类型！'));
                    } else {
                        callback();
                    }
                }else{
                    callback();
                }
                    
            };
            return {
                mid: '',
                Superiorlist: [{"id": 0, "repairTypeName": "无"}],//上级类型
                pId: 0,
                listLoading: false,
                labelPosition: 'right',
                isFback: false,
                isFback1: '',
                ruleForm: {
                    repairTypeName: '',
                    checkedType:[],//类型分类
                    orderNo: 1
                },
                rules: {
                    repairTypeName: [{
                        required: true,
                        message: '请输入报修类型名称',
                        trigger: 'blur'
                    }],
                    managerUserNames: [{
                        required: true,
                        validator: examineValidator
                    }],
                    managerUserNames2: [{
                        required: true,
                        validator: examineValidator2
                    }],
                    checkedType:[
                        {  required: true,validator: validatecheckedType, trigger: 'change' }
                    ],
                    orderNo: [{
                        required: true,
                        message: '请输入排序号',
                        trigger: 'blur'
                    }]
                },
                configData: {title: '请选择报修负责人', depart: {target: 'user', departType: 'tOrOutside', userTypes: '1,6'}},
                addressData: {},
                addressData1: {},
                addressData2:{},
                type:3,
                teshuFlag:0

            }
        },
        // 获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            let id = this.$route.query.id;
            findParentRepairPlaceList({
                id:id,
                type:0
            }).then(res => {
                let data = res.data.data;
                this.Superiorlist = this.Superiorlist.concat(data);
            });
            getRepairTypeInfo(id).then(res => {
                let data = res.data.data;
                this.pId = data.pId;
                this.id = data.pId;
                this.isFback = data.isFback == 1;
                this.mid = data.pId;
                this.isFback1 = data.isFback == 1;
                this.addressData1 = {
                    departJson: [],
                    userJson: data.managerUserList,
                    groupJson: []
                };
                this.type=data.type;
                
                this.ruleForm.repairTypeName = data.repairTypeName;
                this.ruleForm.orderNo = data.orderNo;
                if(this.type==0){
                    this.ruleForm.checkedType.push("1","2");
                    this.teshuFlag=0;
                }else if(this.type==1){
                    this.ruleForm.checkedType.push("1");
                    this.teshuFlag=1;
                }else if(this.type==2){
                    this.ruleForm.checkedType.push("2")
                    this.teshuFlag=2;
                }
                
                this.addressData = {
                    departJson: [],
                    userJson: data.managerUserList,
                    groupJson: []
                };
                this.addressData2={
                    departJson: [],
                    userJson: data.managerUserZcList,
                    groupJson: []
                }
            })
        },
        mounted() {
            this.isexit();
        },
        watch: {
            addressData: function (val) {
            },
            'addressData2':{
                handler:function(val,oldVal){
                this.$refs.ruleForm.validateField('managerUserNames2');
                },
                deep:true
            }
        },
        methods: {
            checkTypeSet(val){
                if(val){
                    let typeItem=val.toString();
                    if(typeItem.indexOf('1')!==-1&&typeItem.indexOf('2')!==-1){
                        this.type=0;
                    }else if(typeItem.indexOf('1')!==-1){
                        this.type=1;
                    }else if(typeItem.indexOf('2')!==-1){
                        this.type=2;
                    }else{
                        this.type=3;
                    }
                }
               // if()
            },  
            onChange(val) {
                this.ruleForm.checkedType=[];
                let SuperiorItem=this.Superiorlist.find(item=>item.id==val);
                if (val == this.mid) {
                    let _this = this;
                    if(SuperiorItem.type===0){
                        _this.ruleForm.checkedType.push("1","2");
                        _this.teshuFlag=0;
                        _this.type=0;
                    }else if(SuperiorItem.type===1){
                        _this.ruleForm.checkedType.push("1");
                        _this.teshuFlag=1;
                        _this.type=1;
                    }else if(SuperiorItem.type===2){
                        _this.ruleForm.checkedType.push("2");
                        _this.teshuFlag=2;
                        _this.type=2;
                    }
                    this.isFback = this.isFback1 == 1;
                    this.addressData = this.addressData1
                }
                if (val != this.id) {
                    let _this = this;
                    if (val) {
                        if(SuperiorItem.type===0){
                            _this.ruleForm.checkedType.push("1","2");
                            _this.teshuFlag=0;
                            _this.type=0;
                        }else if(SuperiorItem.type===1){
                            _this.ruleForm.checkedType.push("1");
                            _this.teshuFlag=1;
                            _this.type=1;
                        }else if(SuperiorItem.type===2){
                            _this.ruleForm.checkedType.push("2");
                            _this.teshuFlag=2;
                            _this.type=2;
                        }
                        getRepairTypeById(val).then(res => {
                            let data = res.data.data;
                            _this.isFback = data.repairTypePageModel.isFback == 1;
                            _this.addressData = {
                                departJson: [],
                                userJson: data.users,
                                groupJson: []
                            };
                            _this.addressData2 = {
                            departJson: [],
                            userJson: data.repairTypePageModel.managerUserZcList,
                            groupJson: []
                        };
                        });
                    } else {
                        _this.isFback = false;
                        _this.teshuFlag=0;
                        _this.addressData = {
                            departJson: [],
                            userJson: [],
                            groupJson: []
                        }
                    }

                }
            },
            inputBlurHandler() {
                this.ruleForm.repairTypeName = this.ruleForm.repairTypeName.trim();
            },
            isexit() {//验证地址簿中是否为空
                let _this = this;
                _this.$watch("addressData", function (data) {
                    if (data.userJson.length < 1) {
                        _this.ruleForm.managerUserNames = "";
                        _this.$refs.ruleForm.validateField('managerUserNames');
                    } else {
                        _this.ruleForm.managerUserNames = JSON.stringify(this.addressData.userJson);
                        _this.$refs.ruleForm.validateField('managerUserNames');
                    }

                })
            },
            goBack() {
                this.$router.back();
            },

            editRepairType() {
                this.ruleForm.managerUserNames = JSON.stringify(this.addressData.userJson);
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let repairTypeId = this.$route.query.id;
                        let repairTypeName = this.ruleForm.repairTypeName;
                        const departJson = JSON.stringify(this.addressData.departJson); //部门json字符串JSON.parse(this.addressData.departJson)
                        const groupJson = JSON.stringify(this.addressData.groupJson); //群组json字符串JSON.parse(this.addressData.groupJson)
                        const userJson = JSON.stringify(this.addressData.userJson); //用户json字符串
                        if(departJson&&userJson&&groupJson){
                            var scope = JSON.stringify({
                                departs: JSON.parse(departJson),
                                users: JSON.parse(userJson),
                                groups: JSON.parse(groupJson)
                            });
                        }

                        const departJson2 = JSON.stringify(this.addressData2.departJson); //部门json字符串JSON.parse(this.addressData.departJson)
                        const groupJson2 = JSON.stringify(this.addressData2.groupJson); //群组json字符串JSON.parse(this.addressData.groupJson)
                        const userJson2 = JSON.stringify(this.addressData2.userJson); //用户json字符串
                        if(departJson2&&userJson2&&groupJson2){
                            var scope2 = JSON.stringify({
                                departs: JSON.parse(departJson2),
                                users: JSON.parse(userJson2),
                                groups: JSON.parse(groupJson2)
                            });
                        }
                       if (this.isFback) {
                            this.isFback = 1;
                        } else {
                            this.isFback = 0;
                        }
                        if(this.type==1){
                            scope2=JSON.stringify({
                                departs: [],
                                users: [],
                                groups: []
                            });
                        }
                         if(this.type==2){
                            scope=JSON.stringify({
                                departs: [],
                                users: [],
                                groups: []
                            });
                        }
                        let listQuery = {
                            "pId": this.pId,//上级id 无为0
                            "repairTypeName": repairTypeName,//名称
                            "scope": scope,//报修类型负责人
                            "scope2":scope2,
                            "isFback": this.type!=2?(this.isFback ? 1 : 0):0,//是否反馈
                            "repairTypeId": repairTypeId,
                            "type":this.type,
                            orderNo: this.ruleForm.orderNo
                        };

                        updateRepairType(listQuery).then(res => {
                            this.listLoading = true;

                            if (res.data.code === 200) {
                                this.$message.success(res.data.msg);
                                this.goBack();
                            } else {
                                this.$message.error(res.data.msg);
                            }
                            this.listLoading = false;
                        })

                    } else {
                        return undefined;
                    }
                })
            }
        }
    }
</script>

<style scoped="scoped">
.el-select{
    width:100%;
}
</style>
