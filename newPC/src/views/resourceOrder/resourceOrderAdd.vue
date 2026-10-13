<template>
    <div class="page resourceOrderAdd">
        <back-tool>
            <el-button type="primary" size="medium" @click="orderHandler" :disabled="isButtonDisabled"
                       :loading="orderLoading">预约
            </el-button>
        </back-tool>
        <div class="form-container">
            <el-form
                :model="formData"
                label-width="140px"
                :rules="rules"
                ref="form"
            >
                <el-form-item label="资源选择" prop="resource">
                    <el-select class="resource-select" @change="typeChangeHandler" v-model="formData.resourceTypeId"
                               placeholder="请选择资源类型">
                        <el-option
                            v-for="( typeEntry, index ) in typeList"
                            :key="index"
                            :label="typeEntry.name"
                            :value="typeEntry.id">
                        </el-option>
                    </el-select>
                    <el-select class="resource-select" @change="resourceChangeHandler" v-model="formData.resourceId"
                               placeholder="请选择资源">
                        <el-option
                            v-for="( resourcesEntry, index ) in resourcesList"
                            :key="index"
                            :label="resourcesEntry.name"
                            :value="resourcesEntry.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="orderReasonList && orderReasonList.length !== 0" label="事由(用途)" prop="orderReasonCode">
                    <el-select class="resource-select" v-model="formData.orderReasonCode"
                               placeholder="请选择资源">
                        <el-option
                            v-for="( item, index ) in orderReasonList"
                            :key="index"
                            :label="item.value"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="serviceObjectList && serviceObjectList.length !== 0" label="服务对象" prop="serviceObjectCode">
                    <el-select class="resource-select" v-model="formData.serviceObjectCode"
                               placeholder="请选择资源">
                        <el-option
                            v-for="( item, index ) in serviceObjectList"
                            :key="index"
                            :label="item.value"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预约日期" prop="orderDay">
                    <el-date-picker
                        class="resource-day"
                        @change="orderDayChangeHandler"
                        format="yyyy-MM-dd"
                        v-model="formData.orderDay"
                        type="date"
                        placeholder="选择预约日期"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预约时间" prop="orderTime">
                    <el-time-picker
                        is-range
                        class="resource-time"
                        format="HH:mm"
                        v-model="formData.orderTime"
                        placeholder="选择预约时间范围">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="支持人" v-if="currentResourceType.isAppoint == 1 && currentResourceType.isApplyAppoint == 1" prop="addressData">
                    <address-book ref="addressBook" v-model="addressData" :config="addressConfig" ></address-book>
                </el-form-item>
                <el-form-item label="使用内容(预约理由)" prop="orderResion">
                    <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请填写使用内容(预约理由)"
                        v-model="formData.orderResion">
                    </el-input>
                      &nbsp;
                      <uploader
                      pathPrefix="ziyuanyuyue" module="ziyuanyuyue" moduleCode="1207"  v-model="fileJson"
                        showResult="image"
                        showMode="image"
                        :extList="['png', 'jpg', 'jpeg', 'bmp', 'gif']"
                        :multiple="true"
                        ></uploader>
                     <!-- <uploader pathPrefix="ziyuanyuyue" module="ziyuanyuyue" moduleCode="1207"  v-model="fileJson"
                              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                              showResult="image"></uploader> -->
                        <!-- <uploader  :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="cover" :showModeCover="true" showResult="image"></uploader> -->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import BackTool from '@/components/BackTool';
    import {getSchoolDicByCode} from '@/utils/utils';
    import {toOrderResource, reloadChangeType, orderResources} from '@/api/resourceOrder';
   import Uploader from "@/components/Uploader/WebUploader";
    export default {
        data: function () {
            const timerangeValidator = (rule, value, callback) => {

                const moment = this.$moment;
                if (this.formData.orderDay) {
                    if (moment().isSame(moment(this.formData.orderDay).format('YYYY-MM-DD'), 'day')) {
                        const selectedTime = moment(this.formData.orderTime[0]).format('YYYY-MM-DD HH:mm'),
                            currentTime = moment(`${moment(new Date(2016, 10, 1)).format('YYYY-MM-DD')} ${moment().format('HH:mm')}`);
                        if (currentTime.isAfter(selectedTime, 'minute') ||
                            currentTime.isSame(selectedTime, 'minute')
                        ) {
                            callback(new Error('预约开始时间必须大于当前时间'));
                        }
                    }
                }
                const firstTime = moment(this.formData.orderTime[0]),
                    secondTime = moment(this.formData.orderTime[1]);
                if (
                    secondTime.isBefore(firstTime, 'minute') ||
                    secondTime.isSame(firstTime, 'minute')
                ) {
                    callback(new Error('预约结束时间必须大于开始时间'));
                }
                callback();
            };

            const resourceValidator = (rule, value, callback) => {
                if (this.formData.resourceId === null) {
                    callback(new Error('该类型下没有对应的资源'));
                } else {
                    callback();
                }
            };
            const addressDataValidator  = (rule, value, callback) => {
                if (this.currentResourceType.isApplyAppoint == 1 && this.addressData.userJson.length === 0) {
                    callback(new Error('请选择支持人'));
                } else {
                    callback();
                }
            };

            return {
                fileJson:[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                addressConfig:{
                    title: '请选择发布范围',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: true
                },
                addressData: {departJson: [], groupJson: [], userJson: []},
                currentResourceType: {},
                formData: {
                    orderDay: null,
                    orderTime: [new Date(2016, 10, 1, 7, 0, 0), new Date(2016, 10, 1, 19, 0, 0)],
                    beginTime: '',
                    endTime: '',
                    examineOptions: '',
                    examineUserId: 0,
                    orderResion: '',
                    orderUserId: this.$store.getters.userInfo.id,
                    resourceId: null,
                    resourceTypeId: null,

                    orderReasonCode: '',
                    serviceObjectCode: ''
                },
                isButtonDisabled: false,
                orderLoading: false,
                resourceTypeList: [],
                typeList: [],
                resourcesList: [],
                resourceId: null,
                resourceTypeId: null,
                rules: {
                    orderResion: [
                        {min: 0, max: 300, message: '长度为 1 到 300 个字符', trigger: 'blur'}
                    ],
                    orderDay: [{
                        required: true, message: '请填写预约日期'
                    }],
                    orderTime: [{
                        required: true, message: '请填写预约时间范围'
                    }, {
                        validator: timerangeValidator
                    }],
                    resource: [{
                        validator: resourceValidator
                    }],
                    orderReasonCode: [{
                        required: true, message: '请选择事由(用途)'
                    }],
                    serviceObjectCode: [{
                        required: true, message: '请选择服务对象'
                    }],
                    addressData: [{
                        required: true, validator: addressDataValidator
                    }]
                },

                serviceObjectList: [],
                orderReasonList: []
            }
        },
        created() {
            getSchoolDicByCode('orderReasons')
                .then(data => {
                    if(data && data.length !== 0) {
                        this.orderReasonList = data;
                        this.formData.orderReasonCode = `${data[0].code}`;
                    }
                });
            getSchoolDicByCode('serviceObjects')
                .then(data => {
                    if(data && data.length !== 0) {
                        this.serviceObjectList = data;
                        this.formData.serviceObjectCode = `${data[0].code}`;
                    }
                });
            toOrderResource()
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        const pageData = data.data;
                        this.resourceTypeList = pageData.typeList;
                        this.typeList = pageData.typeList;
                        this.resourcesList = pageData.resourcesList;
                        this.currentResourceType = pageData.typeList[0];
                        this.formData.resourceTypeId = pageData.typeList[0].id;
                        this.formData.resourceId = pageData.resourcesList[0].id;
                        if(this.currentResourceType.isAppoint == 1 && this.currentResourceType.isApplyAppoint == 1) {
                            this.addressData = {departJson: [], groupJson: [], userJson: JSON.parse(this.currentResourceType.appointerJson)};
                        } else {
                            this.addressData = {departJson: [], groupJson: [], userJson: []};
                        }
                    } else {
                        this.$message.error('error')
                    }
                })
                .catch(error => {
                    this.$message.error(error);
                })
        },
        methods: {
            orderHandler() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const vm = this;
                        var date = this.$moment(this.formData.orderDay).format('YYYY-MM-DD');
                        const formData = {
                            fileJson: JSON.stringify(this.fileJson),
                            resourceId: this.formData.resourceId,
                            resourceTypeId: this.formData.resourceTypeId,
                            beginTime: `${date} ${this.$moment(this.formData.orderTime[0]).format('HH:mm:ss')}`,
                            endTime: `${date} ${this.$moment(this.formData.orderTime[1]).format('HH:mm:ss')}`,
                            orderResion: this.formData.orderResion,
                            orderReasonCode: this.orderReasonList && this.orderReasonList.length !== 0 ? this.formData.orderReasonCode : '',
                            orderReasonValue: this.orderReasonList && this.orderReasonList.length !== 0 ? this.orderReasonList.find(item => item.code == this.formData.orderReasonCode).value : '',
                            serviceObjectCode: this.serviceObjectList && this.serviceObjectList.length !== 0 ? this.formData.serviceObjectCode : '',
                            serviceObjectValue: this.serviceObjectList && this.serviceObjectList.length !== 0 ? this.serviceObjectList.find(item => item.code == this.formData.serviceObjectCode).value : '',
                            sendAppointerJson: this.currentResourceType.isAppoint == 1 && this.currentResourceType.isApplyAppoint == 1 ? JSON.stringify(this.addressData.userJson) : ''
                        };
                        orderResources(formData)
                            .then(res => res.data)
                            .then(data => {
                                vm.orderLoading = false;
                                vm.isButtonDisabled = false;
                                if (data.result && data.data === 'true') {
                                    vm.$message({
                                        message: '资源预约成功',
                                        type: 'success'
                                    });
                                    setTimeout(() => {
                                        window.history.back();
                                    }, 500)
                                } else if (data.data === '-1') {
                                    vm.isButtonDisabled = false;
                                    this.$message.error('资源已被预约');
                                } else if (data.data.slice(0, 2) === '-2') {
                                    this.$message.error(data.data.slice(2));
                                } else {
                                    this.$message.error('异常发生，请稍后重试');
                                }
                            })
                            .catch(error => {
                                vm.isButtonDisabled = false;
                                vm.orderLoading = false;
                                vm.$message.error(error);
                            })
                    }
                })
            },
            dateChangeHandler(date) {
                [this.formData.beginTime, this.formData.endTime] = date.split(' - ');
            },
            typeChangeHandler(typeId) {
                reloadChangeType({
                    typeId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const pageData = data.data;

                            this.resourcesList = pageData.resourcesList;
                            this.currentResourceType = this.resourceTypeList.find(({id}) => id == typeId) || {};
                            if(this.currentResourceType.isAppoint == 1 && this.currentResourceType.isApplyAppoint == 1) {
                                this.addressData = {departJson: [], groupJson: [], userJson: JSON.parse(this.currentResourceType.appointerJson)};
                            } else {
                                this.addressData = {departJson: [], groupJson: [], userJson: []};
                            }
                            if (pageData.resourcesList && pageData.resourcesList.length > 0) {
                                this.formData.resourceId = pageData.resourcesList[0].id;
                                this.formData.resourceName = pageData.resourcesList[0].name;
                            } else {
                                this.formData.resourceId = null;
                                this.formData.resourceName = null;

                            }
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                    })
            },
            resourceChangeHandler(selectedId) {
                if (selectedId !== null) {
                    this.formData.resourceName = this.resourcesList.find((resourceEntry) => resourceEntry.id === selectedId).name;
                }
            },
            orderDayChangeHandler() {
                this.$refs.form.validateField('orderTime')
            }
        },
        components: {
            BackTool,
            AddressBook,Uploader
        }
    }
</script>

<style lang="scss">
    .el-scrollbar__wrap {
        box-sizing: initial;
    }

    .page.resourceOrderAdd {
        padding:12px;

        .form-container {
            width: 810px;
            margin: 10px auto;
        }

        .resource-select {
            width: 49%;
        }

        .resource-timerange {
            width: 100%;
        }

        .el-time-spinner__list {
            box-sizing: border-box;
        }
    }


</style>
