<template>
    <div class="page">
        <back-tool>
            <el-button type="primary"  size="medium" @click="approveHandler" :passLoading="loadingArr[0]">通过</el-button>
            <el-button type="primary"  size="medium"  @click="rejectHandler" :rejectLoading="loadingArr[1]">不通过</el-button>

        </back-tool>
        <div class="content-container">
            <div class="body">
                <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>资源名称：</div>
                </el-col>
                <el-col :span="20" >
                    <div>{{ data.resourceName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>开始时间：</div>
                </el-col>
                <el-col :span="20">
                    <div>{{ data.beginTime | trimSeconds }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>结束时间：</div>
                </el-col>
                <el-col :span="20">
                    <div>{{ data.endTime | trimSeconds }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line" v-if="data.orderResion !== null && data.orderResion !== ''">
                <el-col :span="4" class="label-container">
                    <div>使用内容(预约理由)：</div>
                </el-col>
                <el-col :span="20">
                    <div>{{ data.orderResion }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>状态：</div>
                </el-col>
                <el-col :span="20" >
                    <div>{{ data.status | statusToText }}</div>
                </el-col>
            </el-row>
            <el-form
                    :model="formData"
                    ref="form"
            >
                <el-form-item>
                    <el-row :gutter="0">
                        <el-col :span="4" class="label-container">
                            <div>审批意见：</div>
                        </el-col>
                        <el-col :span="20" >
                            <div>
                                <el-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="请输入内容"
                                        v-model="formData.options">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row :gutter="0">
                        <el-col :span="4" class="label-container">
                            <div>支持人：</div>
                        </el-col>
                        <el-col :span="20">
                            <div>
                                <el-checkbox-group v-model="formData.appointer">
                                    <el-checkbox
                                            v-for="(appointerEntry, index) in data.appointer"
                                            :key="index"
                                            :label="appointerEntry.id"
                                    >
                                        {{ appointerEntry.name }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            </div>
           
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {resourceOrderDetailInfo, noPassExamineOrder, passExamineResource} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                orderId: this.$route.query.orderId,
                loadingArr: [false, false],
                data: {
                    resourceName: '',
                    beginTime: '',
                    endTime: '',
                    orderResion: '',
                    status: null,
                    examineOptions: '',
                    appointer: []
                },
                formData: {
                    appointer: [],
                    isAppoint: 0,
                    options: '',
                    orderId: this.$route.query.orderId,
                    appointerIdStr: '',
                    appointerJson: ''
                }
            }
        },
        components: {
            BackTool
        },
        computed: {},
        filters: {
            trimSeconds(value) {
                return value.slice(0, value.lastIndexOf(':'));
            },
            statusToText(status) {
                let textStr = '';
                switch (status) {
                    case '':
                    case -1:
                        textStr = '取消预约';
                        break;
                    case 0:
                        textStr = '待审核';
                        break;
                    case 1:
                        textStr = '使用中';
                        break;
                    case 2:
                        textStr = '未使用';
                        break;
                    case 3:
                        textStr = '同意预约';
                        break;
                    case 4:
                        textStr = '拒绝预约';
                        break;
                    case 5:
                        textStr = '预约中';
                        break;
                    case 6:
                        textStr = '已过期';
                        break;
                    case 7:
                        textStr = '使用结束';
                        break;
                    default:
                        break;
                }
                return textStr;
            }
        },
        methods: {
            examineCb(res) {
                const data = res.data;
                this.loadingArr = [false, false];
                if (data.result) {
                    const pageData = data.data;
                    const messageObj = {};
                    switch (pageData) {
                        case 'true':
                            messageObj.type = 'success';
                            messageObj.msg = '审批成功';
                            break;
                        case '':
                        case '-1' | -1:
                            messageObj.type = 'error';
                            messageObj.msg = '已被管理员取消';
                            break;
                        case '-2' | -2:
                            messageObj.type = 'error';
                            messageObj.msg = '审批权限被删除';
                            break;
                        case '3' | 3:
                        case '4' | 4:
                            messageObj.type = 'error';
                            messageObj.msg = '已被其他人审核';
                            break;
                        case '6' | 6:
                            messageObj.type = 'error';
                            messageObj.msg = '审核时间已过 预约失效';
                            break;
                    }
                    this.$message({
                        message: messageObj.msg,
                        type: messageObj.type
                    });
                    setTimeout(() => {
                        this.$router.push('resourceExamineIndex');
                    }, 500)
                }
            },
            approveHandler() {
                this.loadingArr[0] = true;
                const queryObj = {};
                queryObj.isAppoint = this.formData.appointer.length === 0 ? 0 : 1;
                queryObj.appointerIdStr = this.formData.appointer.join(',');
                queryObj.appointerJson = JSON.stringify(this.data.appointer
                    .filter(appointerEntry => this.formData.appointer.indexOf(appointerEntry.id) > -1)
                );
                queryObj.options = this.formData.options;
                queryObj.orderId = this.orderId;
                passExamineResource(queryObj)
                    .then(this.examineCb)
                    .catch(error => {
                        this.$message.error(error);
                    });
            },
            rejectHandler() {
                this.loadingArr[1] = true;
                noPassExamineOrder({
                    options: this.formData.options,
                    orderId: this.orderId
                })
                    .then(this.examineCb)
                    .catch(error => {
                        this.$message.error(error);
                    })

            }
        },
        created() {
            resourceOrderDetailInfo(this.$route.query)
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        const pageData = data.data;
                        this.data = Object.assign({}, this.data, pageData);
                        this.data.appointer = JSON.parse(pageData.appointerJson);
                    } else {
                        this.$message.error('error');
                    }
                })
                .catch(error => {
                    this.$message.error('error');
                })
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .content-container {
        padding-top: 10px;
    }

    .content-line {
        margin: 20px 0;
    }

    .label-container {
        text-align: right;
    }
    .body{
        width: 810px;
         margin: 0 auto;
    }
</style>
