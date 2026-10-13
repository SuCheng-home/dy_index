<template>
    <div class="shortmessageMassadd">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="sendSMSs()">发送</el-button>
        </div>
        <div class="body" :style="`height: ${maxH}px;`">
            <div class="from-box">
                <el-form :model="singleData" label-width="180px" :rules="singleRules" ref="single">
                    <el-form-item label="操作类型">
                        <el-radio-group v-model="singleData.type">
                            <el-radio :label="1">手机号</el-radio>
                            <el-radio :label="2">通讯录</el-radio>
                            <el-radio :label="3">群组</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发送手机号（每行一条）" prop="receiveUser" v-if="singleData.type==1">
                        <el-input type="textarea" rows="8" v-model="singleData.receiveUser"></el-input>
                    </el-form-item>
                    <el-form-item label="通知范围" prop="addressData" v-if="singleData.type==2">
                        <address-book v-model="singleData.addressData" :config="singleData.configData"></address-book>
                    </el-form-item>
                     <el-form-item label="群组" prop="groupId" v-if="singleData.type==3">
                        <el-select v-model="singleData.groupId" placeholder="请选择">
                            <el-option v-for="item in groupList" :label="item.groupName" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="短信模板" prop="templateId">
                        <el-select @change="getTemp" v-model="singleData.templateId" placeholder="请选择">
                            <el-option v-for="tempItem in templateList" :label="tempItem.title" :key="tempItem.id"
                                       :value="tempItem.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模板" prop="temp">
                        <template v-for="(segment, index) in tempSegments">
                            <span v-if="segment.type === 'text'" :key="index + 1" v-html="segment.value"></span>
                            <el-input :key="index + 2"
                                style="width: 120px; margin: 0 4px;" 
                                v-else 
                                v-model="tempVars[segment.varName]"
                                :placeholder="'请输入' + segment.varName"
                                size="small"
                            ></el-input>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {queryTemplateBySchoolId, sendSMS,getSchoolSmsMobileGroupList} from "@/api/shortmessage";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import baseMixin from "@/mixins/baseMixin";
    import mixin from "@/mixins/windowResize";

    export default {
        name: "statisticsIndex",
        components: {
            AddressBook,
        },
        data() {
            const tempValidator = (rule, value, callback) => {
                const hasEmptyVar = Object.values(this.tempVars).some(val => val === '');
                if (hasEmptyVar) {
                    callback(new Error('请正确填写模板变量！'));
                } else {
                    callback();
                }
            };
            const checkAddressData = (rule, value, callback) => {
                if ((value.userJson && value.userJson.length > 0) || (value.departJson && value.departJson.length > 0) || (value.groupJson && value.groupJson.length > 0)) {
                    callback();
                } else {
                    return callback(new Error('通知范围不能为空！'));
                }
            };
            return {
                singleData: {
                    noticeId: '',
                    groupId: '',
                    smsContent: '',
                    templateId: '',
                    receiveUser: '',
                    type: 1,
                    configData: {
                        title: '发布范围',
                        depart: {target: 'all', departType: 'all', userTypes: '1,3'},
                        group: true
                    },
                    addressData: {},
                },
                groupList:[],
                tempSegments: [],
                tempVars: {},
                templateList: [],
                singleRules: {
                    receiveUser: [{
                        required: true, message: '发送目标不能为空', trigger: 'blur'
                    }],
                    templateId: [{
                        required: true, message: '模板不能为空', trigger: 'blur'
                    }],
                    groupId: [{
                        required: true, message: '请选择群组', trigger: 'change'
                    }],
                    temp: [{
                        required: true, trigger: 'blur', validator: tempValidator
                    }],
                    addressData: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ]
                },
            };
        },
        mixins: [baseMixin, mixin],
        created() {
            getSchoolSmsMobileGroupList()
                .then(res => res.data)
                .then(data => {
                    this.groupList = data.data;
                });
            queryTemplateBySchoolId()
                .then(res => res.data)
                .then(data => {
                    this.templateList = data.data.filter(item => item.statusCode == 0);
                    if (this.templateList.length !== 0) {
                        this.singleData.templateId = this.templateList[0].id;
                        this.getTemp()
                    }
                });
        },
        methods: {
            getTemp() {
                let id = this.singleData.templateId;
                const template = this.templateList.find(item => item.id === id);
                if (template) {
                    const regex = /\$\{([^}]+)\}/g;
                    const segments = [];
                    let lastIndex = 0;
                    let match;
                    const varNames = new Set();
                    
                    while ((match = regex.exec(template.content)) !== null) {
                        if (match.index > lastIndex) {
                            segments.push({
                                type: 'text',
                                value: template.content.slice(lastIndex, match.index)
                            });
                        }
                        const varName = match[1];
                        varNames.add(varName);
                        segments.push({
                            type: 'var',
                            varName: varName
                        });
                        lastIndex = match.index + match[0].length;
                    }
                    
                    if (lastIndex < template.content.length) {
                        segments.push({
                            type: 'text',
                            value: template.content.slice(lastIndex)
                        });
                    }
                    
                    this.tempSegments = segments;
                    
                    this.tempVars = {};
                    varNames.forEach(name => {
                        this.$set(this.tempVars, name, '');
                    });
                }
            },
            buildSmsContent(templateContent) {
                if (!templateContent) return '';
                const regex = /\$\{([^}]+)\}/g;
                return templateContent.replace(regex, (match, varName) => {
                    return this.tempVars[varName] || '';
                });
            },
            sendSMSs() {
                let phoneValid = true;
                if (this.singleData.receiveUser) {
                    const phoneList = this.singleData.receiveUser.split('\n');
                    phoneList.forEach(phone => {
                        if (!/^0?1[0-9]\d{9}$/.test(`${phone}`.trim())) {
                            phoneValid = false;
                            return false;
                        }
                    });
                }
                if (!phoneValid && (this.singleData.type == 1)) {
                    this.$message({
                        type: 'error',
                        message: '发送手机号的格式存在不正确的'
                    });
                    return false;
                }
                this.$refs.single.validate((valid) => {
                    if (valid) {
                        const template = this.templateList.find(item => item.id === this.singleData.templateId);
                        const args = {
                            moduleCode: 1240,//	模块code	number	写死: 1240
                            moduleName: "短信管理",//	模块名称	string	写死:
                            receivers: this.singleData.type == 1 ? this.singleData.receiveUser.split('\n').join("#") : (this.singleData.type == 3?this.singleData.groupId:JSON.stringify(this.singleData.addressData)),
                            smsContent: this.buildSmsContent(template ? template.content : ''),//	发送内容	string
                            templateId: this.singleData.templateId,//	模板id	number
                            templateName: "",//模板名称	string
                            type: this.singleData.type,
                            templateParamJson: JSON.stringify(this.tempVars)
                        };
                        for (let i = 0; i < this.templateList.length; i++) {
                            if (this.templateList[i].id == this.singleData.templateId) {
                                args.templateName = this.templateList[i].title
                            }
                        }
                        sendSMS(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message({
                                        message: '已发送短信',
                                        type: 'success'
                                    });
                                    this.$router.back();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: data.msg
                                    });
                                }
                            });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .shortmessageMassadd {
        padding: 12px;

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .body {
            overflow: auto;

            .from-box {
                padding-top: 20px;
                width: 810px;
                margin: 0 auto;
            }
        }
    }
</style>
