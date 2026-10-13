<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" @click.native="saveHandler">保存</el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <span class="label-hint">解码规则：</span><el-radio-group v-model="decodingRule">
                <el-radio :label="0">全序列</el-radio>
                <el-radio :label="1">截取8-16位转10进制</el-radio>
                <el-radio :label="2">截取6-14位</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import {
        insertOrUpdateCardReaderSet,
        getCardReaderSetBySchoolId
    } from '@/api/cardManage';
    import {mapGetters} from 'vuex';
    export default {
        name: "deviceSetting",
        components: {Backtool},
        data() {
            return {
                decodingRule: 0
            }
        },
        created() {
            getCardReaderSetBySchoolId()
                .then(res => res.data)
                .then(data => {
                    if(data.result) {
                        if(data.data.decodingRule) {
                            this.decodingRule = data.data.decodingRule;
                        }
                    }
                })
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        methods: {
            saveHandler() {
                insertOrUpdateCardReaderSet({
                    decodingRule: this.decodingRule
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message({
                                type: 'success',
                                message: '设置成功!',
                            });
                            setTimeout(() => {
                                this.$router.back();
                            }, 1000);
                        }
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-main {
        padding-top: 50px;
    }
    .label-hint {
        font-size: 14px;
        color: #606266;
        box-sizing: border-box;
    }
</style>
