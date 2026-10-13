<template>
    <div class="app-container calendar-list-container">
        <div>
            <el-button type="primary" size="medium" @click="sendMessageFunc">发送
            </el-button>
        </div>
        <el-tabs v-model="active" @tab-click="tabClick">
            <el-tab-pane label="批量发送" name="group">
                <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                    <el-form :model="groupFormData" ref="groupForm" label-width="170px" :rules="groupFormDataRules">
                        <el-form-item label="报名批次" prop="noticeId">
                            <el-select size="medium" v-model="groupFormData.noticeId" placeholder="请选择报名批次">
                                <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送方式" prop="sendType">
                            <el-radio-group v-model="groupFormData.sendType">
                                <el-radio :label="2">按分组</el-radio>
                                <el-radio :label="1">按批次</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="分组" prop="groupIds" v-if="groupFormData.sendType == 2">
                            <el-select size="medium" multiple v-model="groupFormData.groupIds" placeholder="请选择报名批次">
                                <el-option v-for="item in groupList" :key="item.id" :label="item.groupName"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="短信模板" prop="tempId">
                            <el-select size="medium" v-model="groupFormData.tempId" placeholder="请选择报名批次"
                                       @change="onGroupTempIdChange">
                                <el-option v-for="item in templateList" :key="item.id" :label="item.title"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模板" prop="temp" key="1">
                            <!-- <template v-for="(segment, index) in temp">
                                <span v-if="segment.text !== ''" v-html="segment.text"></span>
                                <el-input style="width: 80px;" v-else v-model="tempAnswer[index].text"></el-input>
                            </template> -->
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
            </el-tab-pane>
            <el-tab-pane label="单个发送" name="single">
                <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                    <el-form :model="singleFormData" ref="singleForm" label-width="170px" :rules="singleFormDataRules">
                        <el-form-item label="发送手机号(换行分割)" prop="receiveUser">
                            <el-input type="textarea" :rows="4" placeholder="请输入发送手机号"
                                      v-model="singleFormData.receiveUser"></el-input>
                        </el-form-item>
                        <el-form-item label="短信模板" prop="tempId">
                            <el-select size="medium" v-model="singleFormData.tempId" placeholder="请选择报名批次"
                                       @change="onSingleTempContentChange">
                                <el-option v-for="item in templateList" :key="item.id" :label="item.title"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模板" prop="temp" key="2">
                            <!-- <template v-for="(segment, index) in temp">
                                <span v-if="segment.text !== ''" v-html="segment.text"></span>
                                <el-input style="width: 80px;" v-else v-model="tempAnswer[index].text"></el-input>
                            </template> -->
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

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {
        queryTemplateBySchoolId,
    } from '@/api/messageTemplate';
    import {
        getSchoolPublishEnrollNoticeList,
        getSchoolEnrollGroupList,
        batchSendMessage,
        singleSendMessage
    } from '@/api/schoolSignupHigh';

    export default {
        name: "sendMessage",
        data() {
            const groupIdsValidator = (rule, value, callback) => {
                if (this.groupFormData.sendType == 1 || this.groupFormData.groupIds.length !== 0) {
                    callback();
                } else {
                    callback(new Error('请选择分组'));
                }
            };
            const tempValidator = (rule, value, callback) => {
                // console.log('this.tempAnswer', this.tempAnswer)
                // if (this.tempAnswer.some(item => item.text === '')) {
                //     callback(new Error('请正确填写模板！'));
                // } else {
                //     callback();
                // }
                const hasEmptyVar = Object.values(this.tempVars).some(val => val === '');
                if (hasEmptyVar) {
                    callback(new Error('请正确填写模板变量！'));
                } else {
                    callback();
                }
            };
            return {
                templateList: [],
                noticeList: [],
                groupList: [],
                active: 'group',
                groupFormData: {
                    groupIds: [],
                    noticeId: '',
                    tempId: '',
                    sendType: 2,
                },
                groupFormDataRules: {
                    sendType: [
                        {required: true, message: '请选择发送方式', trigger: 'blur'}
                    ],
                    noticeId: [
                        {required: true, message: '请选择报名批次', trigger: 'blur'}
                    ],
                    groupIds: [
                        {required: true, validator: groupIdsValidator, trigger: 'blur'}
                    ],
                    tempId: [
                        {required: true, message: '请选择模板', trigger: 'blur'}
                    ],
                    temp: [{
                        required: true, trigger: 'blur', validator: tempValidator
                    }],
                },
                singleFormData: {
                    receiveUser: '',
                    noticeId: '',
                    tempId: '',
                },
                singleFormDataRules: {
                    receiveUser: [
                        {required: true, message: '请输入手机号', trigger: 'blur'}
                    ],
                    tempId: [
                        {required: true, message: '请选择模板', trigger: 'blur'}
                    ],
                    temp: [{
                        required: true, trigger: 'blur', validator: tempValidator
                    }],
                },
                tempSegments: [],
                tempVars: {},
                temp: [],
                tempAnswer: [],
            }
        },
        created() {
            queryTemplateBySchoolId()
                .then(res => res.data)
                .then(data => {
                    this.templateList = data.data.filter(item => item.statusCode == 0);
                });
            getSchoolPublishEnrollNoticeList({
                pageNo: 1,
                pageSize: 1000,
                searchTitle: ''
            })
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                });
            getSchoolEnrollGroupList()
                .then(res => res.data)
                .then(data => {
                    this.groupList = data.data;
                });

        },
        methods: {
            tabClick() {
                this.singleFormData = {
                    receiveUser: '',
                    noticeId: '',
                    tempId: '',
                };
                this.groupFormData = {
                    groupIds: [],
                    noticeId: '',
                    tempId: '',
                    sendType: 2,
                };
                this.temp = [];
                this.tempAnswer = [];
            },
            getTemp(id) {
                const template = this.templateList.find(item => item.id === id);
                // if (template) {
                //     const temp = template.content.split(/[{}]/).filter(item => item !== '');
                //     this.temp = temp.map(item => ({
                //         text: /^\d+$/.test(item) ? '' : item
                //     }));
                //     this.tempAnswer = temp.map(item => ({
                //         text: /^\d+$/.test(item) ? '' : item
                //     }));
                // }
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
            onGroupTempIdChange() {
                this.getTemp(this.groupFormData.tempId)
            },
            onSingleTempContentChange() {
                this.getTemp(this.singleFormData.tempId)
            },
            sendMessageFunc() {
                if (this.active === 'group') {
                    this.sendGroup();
                } else {
                    this.sendSingle();
                }
            },
            buildSmsContent(templateContent) {
                if (!templateContent) return '';
                const regex = /\$\{([^}]+)\}/g;
                return templateContent.replace(regex, (match, varName) => {
                    return this.tempVars[varName] || '';
                });
            },
            sendGroup() {
                this.$refs.groupForm.validate(isValid => {
                    if (isValid) {
                        const groupNamesList = [];

                        if (this.groupFormData.sendType == 2) {
                            this.groupFormData.groupIds.forEach(id => {
                                groupNamesList.push(this.groupList.find(groupItem => groupItem.id == id).groupName);
                            });
                        }
                        const template = this.templateList.find(item => item.id === this.groupFormData.tempId);

                        const args = {
                            groupIds: this.groupFormData.sendType == 2 ? this.groupFormData.groupIds.join(',') : '',
                            groupNames: this.groupFormData.sendType == 2 ? groupNamesList.join(',') : '',
                            noticeId: this.groupFormData.noticeId,
                            sendType: this.groupFormData.sendType,
                            tempContent: this.buildSmsContent(template ? template.content : ''),
                            tempId: this.groupFormData.tempId,
                            templateParamJson: JSON.stringify(this.tempVars)
                        };
                        batchSendMessage(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(`发送成功`);
                                } else {
                                    this.message.error(data.msg);
                                }
                            })
                    }
                })
            },
            sendSingle() {
                this.$refs.singleForm.validate(isValid => {
                    if (isValid) {
                        const template = this.templateList.find(item => item.id === this.singleFormData.tempId);
                        const args = {
                            noticeId: 0,
                            receiveUser: this.singleFormData.receiveUser.split('\n').join('#'),
                            smsContent: this.buildSmsContent(template ? template.content : ''),
                            smsTempId: this.singleFormData.tempId,
                            templateParamJson: JSON.stringify(this.tempVars)
                        };
                        singleSendMessage(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(`发送成功`);
                                } else {
                                    this.message.error(data.msg);
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
