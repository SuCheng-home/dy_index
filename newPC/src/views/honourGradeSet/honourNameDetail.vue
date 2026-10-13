<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm form--display">
                    <el-form-item label="荣誉名称" prop="honorName">
                        <span>{{ruleForm.honorName}}</span>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="certTypeCode">
                        <span>{{ruleForm.certType}}</span>

                    </el-form-item>
                    <el-form-item label="适用年级" prop="gradeLeaves">
                        <div>
                            {{ruleForm.gradeLeaveName}}
                        </div>
                    </el-form-item>
                    <el-form-item label="证书级别" prop="honorTypeId">
                        <div>
                            {{ruleForm.honorTypeName}}
                        </div>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <div>{{ruleForm.orderNum}}</div>
                    </el-form-item>
                    <el-form-item label="奖项及分值" prop="award">
                        <div class="award-item" v-for="(awardItem, index) in ruleForm.awardList">
                            {{awardItem.levelName}}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {{awardItem.score}}分
                        </div>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import {
        getSchoolHonorTitle,
    } from '@/api/honour/honourGradeSet';


    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo']),
        },
        data() {
            return {
                id: this.$route.query.id,
                ruleForm: {
                    honorName: '',
                    certTypeCode: '',
                    gradeLeaves: [],
                    honorTypeId: '',
                    awardList: [],
                    honorList: [],
                    orderNum: 1
                },
                certTypeList: [],
                schoolTimeId: '',
                schoolTimeName: ''
            };
        },
        mixins: [mixin],
        created() {
            getSchoolHonorTitle({
                titleId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    pageData.gradeLeaves = pageData.gradeLeaves.split(',');
                    pageData.awardList = JSON.parse(pageData.awardLevelJson);
                    console.log(data.data);
                    this.ruleForm = data.data;
                    this.schoolTimeId = data.data.schoolTimeId;
                    this.schoolTimeName = data.data.schoolTimeName;
                })
        }
    }
</script>
<style scoped lang="scss">
    @import "../../styles/mixin";


    .award-item {
        margin-bottom: 10px;
    }

    .fa-trash {
        color: #F08080;
        cursor: pointer;
    }

    .condition-item {
        float: left;
        width: 50%;
        box-sizing: border-box;
        padding: 10px;
    }

    .condition-item__name {
        width: 6em;
        text-align: right;
    }

    .condition-item > * {
        display: inline-block;
        vertical-align: top;
    }

    .section {
        border: 1px solid #ddd;
        padding: 10px 10px 0 10px;
        margin-bottom: 22px;
    }

    .section-title__sub {
        font-weight: bold;
    }

    .section-label {
        display: inline-block;
        width: 8em;
        margin-right: 5px;
        text-align: right;
    }

    .course-list {
        display: inline-block;
        vertical-align: top;
    }

    .condition-list-container {
        clear: both;
    }

    .add-icon {
        font-size: 20px;
        cursor: pointer;
        color: #409EFF;
    }
</style>
