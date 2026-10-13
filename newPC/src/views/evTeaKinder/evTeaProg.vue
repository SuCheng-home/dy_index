<template>
    <div class="app-container calendar-list-container" id="evTeaAddEdit">
        <backtool>
            <el-button type="primary" size="medium" @click="notifyAll">提醒未上报</el-button>
        </backtool>
        <div :class="['page-main']" :style="{'height':(nobottommaxH)+'px'}" style="overflow: auto">
            <div class="main-container">
                <div class="prog-list">
                    <div class="prog-item">
                        <div class="prog-item__left"><i class="el-icon-s-data"></i>&nbsp;&nbsp;{{batchTitle}}</div>
                        <div class="prog-item__right">
                            <div class="prog-item__prog">
                                <el-progress text-inside :stroke-width="16" :percentage="totalInfo.percent"></el-progress>
                            </div>
                            <div class="prog-item__data">
                                <div class="pro-item__data-count">
                                    {{totalInfo.voteTotal}}/{{totalInfo.stuTotal}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="prog-item" v-for="progItem in progList">
                        <div class="prog-item__left">{{progItem.className}}</div>
                        <div class="prog-item__right">
                            <div class="prog-item__prog">
                                <el-progress text-inside :stroke-width="16" :percentage="progItem.percent"></el-progress>
                            </div>
                            <div class="prog-item__data">
                                <span class="pro-item__data-count">{{progItem.voteCount}}/{{progItem.stuCount}}</span>
                                &nbsp;&nbsp;
                                <span class="link-type" @click="jumpToPage('evTeaProgDetail', {id, batchTitle, classId: progItem.classId})">查看详情</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {
        getClassProgressList,
        remindToStuParent
    } from '@/api/evTeaKinder';
    export default {
        name: "evTeaProg",
        data() {
            return {
                id: this.$route.query.id,
                batchTitle: this.$route.query.batchTitle,
                progList: [],
                totalInfo: {
                    voteTotal: 0,
                    stuTotal: 0,
                    percent: 0
                }
            }
        },
        components: {
            Backtool,
        },
        mixins: [mixin, baseMixin],

        created() {
            getClassProgressList({
                batchId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    let voteTotal = 0, stuTotal = 0;
                    data.data.forEach(item => {
                        item.percent = Number.parseFloat((item.voteCount / item.stuCount * 100).toFixed());
                        voteTotal += item.voteCount;
                        stuTotal += item.stuCount;

                    });
                    this.progList = data.data;
                    this.totalInfo = {
                        voteTotal,
                        stuTotal,
                        percent: Number.parseFloat((voteTotal / stuTotal * 100).toFixed())
                    }
                })
        },
        methods: {
            notifyAll() {
                remindToStuParent({
                    batchId: this.id,
                    batchTitle: this.batchTitle,
                    classId: 0,
                    studentId: 0
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('提醒成功');
                        }
                    });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../styles/mixin";

    .main-container {
        width: 810px;
        margin: 10px auto;
    }
    .prog-item {
        @include clearfix;
        width: 100%;
        margin: 30px 0;
    }
    .prog-item__left {
        width: 25%;
        float: left;
        text-align: right;
    }
    .prog-item__right {
        width: 70%;
        float: right;
        & > * {
            @include  middleIB;
        }
        .prog-item__prog {
            width: 75%;
            margin-right: 5px;
        }
    }
    .el-icon-s-data {
        font-size: 18px;
        color: #20a0ff;
    }
    .prog-item__data {
        & > * {
            @include middleIB;
        }
    }
    .pro-item__data-count {
        width: 36px;
    }
</style>
