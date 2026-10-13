<template>
    <div class="addCheckDuty">
        <div class="el-row">
            <div class="top">
                <div>
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button v-if="activeStep > 1" @click="handlePrevStep()" size="medium">上一步</el-button>
                    <el-button v-if="activeStep < 3" @click="handleNextStep()" type="primary" size="medium">下一步</el-button>
                    <el-button v-else size="medium" type="primary" @click.native="handleNextStep()">保存</el-button>
                </div>
                <div class="button_wrap" >
                    <span class="tab_left" :class="{
                        'tab_color': activeStep >= 1
                    }" >检查组</span>
                    <span :class="{
                        'tab_color': activeStep >= 2
                    }">值班设置</span>
                    <span class="tab_right" :class="{
                        'tab_color': activeStep >= 3
                    }">检查项设置</span>
                </div>
                <div></div>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <GroupForm v-if="activeStep === 1" ref="stepCom" :id.sync="id" />
            <OnDutyForm v-else-if="activeStep === 2" ref="stepCom" :id="id" />
            <CheckItemForm v-else-if="activeStep === 3" ref="stepCom" :id="id" />
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import GroupForm from './addSteps/GroupForm.vue';
    import OnDutyForm from './addSteps/OnDutyForm.vue';
    import CheckItemForm from './addSteps/CheckItemForm.vue';
    export default {
        components: {
            GroupForm,
            OnDutyForm,
            CheckItemForm
        },
        mixins: [mixin],
        data() {
            return {
                id: this.$route.query.id||0,
                activeStep: 1
            }
        },
        methods: {
            async handlePrevStep() {
                try {
                    await this.$refs.stepCom.handleSave()
                    this.activeStep--;
                } catch (err) {
                    console.log(err)
                }
            },
            async handleNextStep() {
                try {
                    await this.$refs.stepCom.handleSave()
                    if (this.activeStep == 3) {
                        this.$router.back();
                    } else {
                        this.activeStep++;
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }
    .totalScore{
        float: right;
        color:#67C23A;
    }
    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    .demo-ruleForm {
        width: 810px;
        margin: 0 auto;
    }

    ul, li {
        list-style: none;
    }

    .addCheckDuty {
        padding: 12px;
    }

    .main-wrap {
        width: 100%;
        padding-top: 20px;
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }

    .jia_btn {
        font-size: 32px;
        line-height: 1;
        padding: 0;
        display: inline-block;
    }

    .scoreShow {
        padding: 0 20px;
        display: inline-block;
        min-width: 200px;
    }

    .totalScore {
        line-height: 36px;
        padding: 0 20px;
    }

    .login-box {
        float: left;
        width: 100px;
        height: 100px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 20px;

        img {
            display: block;
            width: 100px;
            height: 100px;
        }
    }

    .logoAdd {
        float: left;
        width: 100px;
        height: 100px;
        padding-top: 17px;
        line-height: 1;
        border: 1px solid #d0d0d0;
        background-color: #fbfdff;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;

        .navAddIcon {
            font-size: 40px;
            color: #8c939d;
            width: auto;
            height: auto;
        }

        .navAddTitle {
            font-size: 14px;
            color: #8c939d;
            display: block;
            margin-top: 10px;
        }
    }

    .logoAdd:hover {
        border: 1px solid #409EFF;
    }

    .logoAdd:hover .navAddIcon {
        color: #409EFF;
    }

    .logoAdd:hover .navAddTitle {
        color: #409EFF;
    }

    .dialoglinkBox {
        .check-select {
            position: absolute;
            top: 0;
            right: 9px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            z-index: 10;
        }

        .checkitem {
            width: 100px;
            float: left;
            position: relative;
            margin-right: 10px;

            .checkitem-box {
                width: 100px;
                padding: 10px 0;
                float: left;
                text-align: center;
                position: relative;

                .check-img {
                    width: 66px;
                    height: 66px;
                    display: block;
                    border-radius: 6px;
                    margin: 0 auto;
                }

                .check-title {
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .link-title {
                    font-size: 14px;
                    color: #333;
                    line-height: 26px;
                    margin-bottom: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

            }
        }
    }
</style>
<style lang="scss" scoped>
.addCheckDuty{
    .el-select {
        width: 100%;
    }
    .el-radio-group {
        height: 36px;
        line-height: 1;
        padding-top: 10px;
    }
}
.button_wrap {
    width: 50%;
    margin-right: 20%;
    overflow: hidden;
    float: right;

    span {
        width: 33%;
        line-height: 34px;
        float: left;
        text-align: center;
        background: #fff;
        border: 1px solid #bfcbd9;
        // cursor: pointer;
    }
    span+span {
        border-left: none;
    }

    .tab_left {
        border-radius: 4px 0 0 4px;
    }

    .tab_right {
        border-radius: 0 4px 4px 0;
    }

    .tab_color {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        // -webkit-box-shadow: -1px 0 0 0 #409eff;
        // box-shadow: -1px 0 0 0 #409eff;
        &:not(:last-child) {
            border-right-color: #fff;
        }
    }
}
</style>
