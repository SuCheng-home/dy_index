<template>
    <div class="page">
        <back-tool>
        </back-tool>
        <div class="content-container">
            <div class="body">
              <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>资源名称：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.resourceName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>申请人：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.orderName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>开始时间：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.beginTime | trimSeconds }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>结束时间：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.endTime | trimSeconds }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line" v-if="data.orderResion !== null && data.orderResion !== ''">
                <el-col :span="4" class="label-container">
                    <div>使用内容(预约理由)：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.orderResion }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line">
                <el-col :span="4" class="label-container">
                    <div>状态：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.status | statusToText }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line" v-if="data.examineOptions !== null && data.examineOptions !== ''">
                <el-col :span="4" class="label-container">
                    <div>审批意见：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ data.examineOptions }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="0" class="content-line"
                    v-if="data.sendAppointerList && data.sendAppointerList.length !== 0">
                <el-col :span="4" class="label-container">
                    <div>支持人：</div>
                </el-col>
                <el-col :span="16" :push="1">
                    <div>{{ appointerNames }}</div>
                </el-col>
            </el-row>
            </div>
            
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {resourceOrderDetailInfo} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                orderId: this.$route.query.orderId,

                data: {
                    orderName: '',
                    resourceName: '',
                    beginTime: '',
                    endTime: '',
                    orderResion: '',
                    status: null,
                    examineOptions: '',
                    sendAppointerList: []
                }
            }
        },
        components: {
            BackTool
        },
        computed: {
            appointerNames() {
                return this.data.sendAppointerList.map(dataEntry => dataEntry.name).join('，')
            }
        },
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
        created() {
            resourceOrderDetailInfo(this.$route.query)
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        const dataPage = data.data;
                        this.data = Object.assign({}, this.data, dataPage);
                    } else {
                        this.$message.error('error');
                    }
                })
                .catch(() => {
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
