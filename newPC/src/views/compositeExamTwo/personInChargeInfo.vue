<template>
    <div class="compositeExamTwoInfo">
        <div class="header">
            <el-button size="medium" @click="$router.back()">返回</el-button>
            <el-button type="primary" size="medium" @click="print()">导出pdf</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="compositeExamTwoInfobodybox" ref="print">
                <div class="bigtop">
                    {{ $route.query.dutyName }}
                    <div class="time">
                        {{ formatDate($route.query.startDate) }} - {{ formatDate($route.query.endDate) }}
                    </div>
                </div>
                <div class="ul">
                    <div class="li" v-for="(items, indexs) in dataList" :key="indexs">
                        <div class="top">
                            <div class="check-item-name">{{ items.checkItemName }} <span v-if="items.dutyUserName"
                                    class="duty-user" style="float: none;">责任人：{{ items.dutyUserName }}</span></div>
                            <span class="red"> {{ items.evaluateLevel }}</span>
                            <span class="plue" v-if="items.gradeName">
                                {{ items.gradeName }}&nbsp;&nbsp;&nbsp;&nbsp;</span>

                        </div>
                        <div class="txtbox">
                            <image-previewer tag="richtext">
                                <div>{{ items.remark }}</div>
                                <img :src="item" v-for="(item, index) in JSON.parse(items.picUrl)" :key="index" />
                            </image-previewer>
                        </div>
                        <div class="bottom">
                            {{ items.createUserName }}&nbsp;&nbsp;&nbsp;&nbsp; {{ items.createTime }}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import moment from "moment";
import { getComplexRecordByDutyUser } from '@/api/compositeExamSetTwo';
import baseMixin from '@/mixins/baseMixin';
import mixin from '@/mixins/windowResize';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
export default {
    name: "statisticsIndex",
    components: {
        ImagePreviewer,
    },
    data() {
        return {
            dataList: []
        }
    },
    mixins: [baseMixin, mixin],
    created() {
        this.getComplexRecordByDutyUser();
    },
    methods: {
        //打印
        print() {
            this.$print(this.$refs.print);
        },
        compositeExamTwoNo(obj) {
            this.$router.push({
                path: "compositeExamTwoNo",
                query: this.$route.query
            });
        },
        // 格式化日期为2026年03月02日格式
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}年${month}月${day}日`;
        },

        getComplexRecordByDutyUser() {
            getComplexRecordByDutyUser(this.$route.query)
                .then(res => res.data)
                .then(data => {
                    for (let i = 0; i < data.data.length; i++) {
                        data.data[i].createTime = moment(new Date(data.data[i].createTime)).format('YYYY-MM-DD HH:mm:ss')
                    }
                    this.dataList = data.data;
                })
        }
    }
}
</script>
<style>
.compositeExamTwoInfobodybox {
    width: 810px;
    margin: 0 auto;
}

.compositeExamTwoInfobodybox .bigtop {
    text-align: center;
    padding: 20px;
    color: #303133;
    font-size: 20px;
    font-weight: 600;

}

.compositeExamTwoInfobodybox .bigtop .time {
    font-size: 16px;
    padding-top: 10px;
    color: #606266;
}

.compositeExamTwoInfobodybox .ul {
    overflow: hidden;
}

.compositeExamTwoInfobodybox .li .top {
    font-size: 18px;
    line-height: 24px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
}

.compositeExamTwoInfobodybox .li .top span {
    float: right;
}

.compositeExamTwoInfobodybox .li .top .plue {
    color: #409EFF;
}

.compositeExamTwoInfobodybox .li .top .red {
    color: #67C23A;
}

.compositeExamTwoInfobodybox .li {
    float: left;
    width: 385px;
    margin: 10px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;

}

.compositeExamTwoInfobodybox .li .bottom {
    font-size: 14px;
    color: #909399;
    padding-top: 10px;
}

.compositeExamTwoInfobodybox .li .txtbox {
    border-bottom: 1px solid #eee;
    height: 200px;
    overflow: auto;
    font-size: 14px;
    color: #606266;
}

.compositeExamTwoInfobodybox .li img {
    width: 70px;
    height: 70px;
    margin: 5px 5px 5px 0;
}
</style>

<style lang="scss" scoped>
.compositeExamTwoInfo {
    padding: 12px;

    .header {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    .body {
        overflow: auto;

    }

}

.check-item-name {
    font-weight: 500;
    color: #303133;
}

.duty-user {
    margin-left: 10px;
    font-size: 15px;
    color: #909399;
}
</style>
