<template>
    <div class="app-container" id="listenClassDetailTeacher">
        <back-tool>
            <div></div>
        </back-tool>
        <div :style="'height:'+maxH+'px;overflow: auto;'">
            <div style="width:810px;padding-top:20px;margin: 0 auto;">
                <el-form
                    ref="form"
                    :model="detailInfo"
                    label-width="140px"
                >
                    <el-form-item label="听课人">
                        {{detailInfo.listenerName}}
                    </el-form-item>
                    <el-form-item label="听课班级/课程">
                        {{detailInfo.className}}&nbsp;&nbsp;{{detailInfo.subjectName}}
                    </el-form-item>
                    <el-form-item label="听课时间">
                        {{detailInfo.listenDate | dateFilter}}&nbsp;&nbsp;{{detailInfo.classNoName}}
                    </el-form-item>
                    <el-form-item label="上课老师">
                        {{detailInfo.teacherName}}
                    </el-form-item>
                    <el-form-item label="上课主题">
                        {{detailInfo.title}}
                    </el-form-item>
                    <el-form-item label="上课类型">
                        {{detailInfo.recordTypeName}}
                    </el-form-item>
                    <template v-if="detailInfo.picList && detailInfo.picList.length !== 0">
                        <div class="section-title">
                            照片
                        </div>
                        <div class="pic-list">
                            <image-previewer tag="richtext" viewclass="image_view" :images="detailInfo.picList">
                                <div class="pic-item">
                                    <div class="pic-item__image-list">
                                        <div :class="['pic-item_image image_view']" v-for="item in detailInfo.picList" :style="{
                                            backgroundImage: `url(${item.src})`
                                        }"></div>
                                    </div>

                                </div>
                            </image-previewer>
                        </div>
                    </template>

                    <div class="section-title">
                        听课评价
                    </div>
                    <div v-if="detailInfo.starAppraise == 1">
                        <el-table :span-method="spanMethod" stripe :data="level1List" border fit highlight-current-row style="width: 100%">
                            <el-table-column align="center" label="一级指标" prop="level1Name">
                            </el-table-column>
                            <el-table-column align="center" label="二级指标" prop="level2Name"></el-table-column>
                            <el-table-column align="center" label="评价等第" prop="score">
                                <template slot-scope="scope">
                                    <el-rate v-model="scope.row.score" disabled :max="scope.row.starNum"></el-rate>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-form-item label="评价等第">
                        {{detailInfo.starAppraise == 1 ? detailInfo.appraiseScore : evaluateNameList[detailInfo.evaluate - 1]}}
                    </el-form-item>
                    <el-form-item label="评价">
                        {{detailInfo.record}}
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from "@/components/BackTool";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import mixin from "@/mixins/windowResize";

    import {
        listenClassRecordInfoById
    } from '@/api/listenClass';

    export default {
        name: "listenClassDetailTeacher",
        components: {BackTool, ImagePreviewer},
        mixins: [mixin],
        filters: {
            dateFilter(value) {
                return value ? value.split(' ')[0] : '';
            }
        },
        data() {
            return {
                id: this.$route.query.id,
                detailInfo: {
                    evaluate: 1,
                    picList: []
                },
                level1List: [],
                evaluateNameList: ['优', '良', '中', '合格', '不合格'],
            }
        },
        created() {
            listenClassRecordInfoById(this.id)
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    if(pageData.starAppraise == 1) {
                        const level1List = [];
                        const appraiseList = JSON.parse(pageData.appraiseJson)
                        appraiseList.forEach(level1Item => {
                            level1Item.appraiseList.forEach((level2Item, level2Index) => {
                                console.log('level2Item', level2Item)
                                level1List.push({
                                    level2Count: level1Item.appraiseList.length,
                                    level2Index,
                                    level1Name: level1Item.name,
                                    level2Name: level2Item.name,
                                    score: level2Item.score,
                                    starNum: level2Item.starNum
                                });
                            })
                        });

                        this.level1List = level1List;
                    }
                    pageData.picList.forEach(item => {
                        item.src = item.picUrl;
                    })
                    this.detailInfo = pageData;
                    console.log(data);
                })
        },
        methods: {
            spanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex == 0) {
                    if (row.level2Index == 0) {
                        return {
                            rowspan: row.level2Count,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }

                return {
                    rowspan: 1,
                    colspan: 1
                };
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../styles/mixin";
    #listenClassDetailTeacher {
        .el-form-item {
            margin-bottom: 12px;
        }
        .section-title {
            margin: 22px 0 14px 0;
            border-left: 4px solid #66b1ff;
            color: #303133;
            font-size: 16px;
            padding-left: 12px;
            height: 16px;
            line-height: 16px;
        }
        .pic-list {
            margin-top: 10px;

            .pic-item {
                width: 100%;
                padding: 10px;
                box-sizing: border-box;
            }

            .pic-item__image-list {
                box-sizing: border-box;
                @include clearfix;
            }

            .fa-trash {
                color: #F08080;
                cursor: pointer;
            }

            .pic-item_image {
                float: left;
                @include cover-bg;
                @include wh(60px, 60px);
                margin: 0 10px 10px 0;
            }
        }
    }
</style>
