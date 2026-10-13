<template>
    <div class="evaluate_statistics" :style="`height: ${boxH - 30}px;`">
        <div class="header">
            <el-button @click="goBack()">返回</el-button>
        </div>
        <div class="stu_info_box">
            <div class="name_score_box">
                <div class="name_title">{{teacherName}}</div>
                <div class="score_title">总分：{{totalScore}}分</div>
            </div>
            <div class="evaluate_item_wrap clearfix">
                <div class="evaluate_item" :key="index" v-for="(item, index) in evaluateItemList" @click="toStuCheckDetail(item.dimensionId, item.dimensionName)">{{item.dimensionName}}({{item.totalScore}}分)</div>
            </div>
        </div>
        <div class="statistics_img_box">
            <div class="picture_box">
                <div class="pic_title">能力发展</div>
                <div class="pic_wrap pic_wrap_water">
                    <div class="out_box">
                        <div class="inner_box_line" :style="`width: ${item.boardWidth}px;height: ${item.boardHeight}px;left: ${item.boardWidth*index}px;`" :key="index" v-for="(item, index) in boardList">{{item.name}}</div>
                    </div>
                </div>
            </div>
            <div class="picture_box">
                <div class="pic_title">评价考核</div>
                <div class="pic_wrap pic_wrap_tree"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getThDimensionScoreDataList} from '@/api/youngTeacherDevelopment';

    export default {
        name: "evaluateCheckStatistics",
        data() {
            return {
                teacherName: '',
                totalScore: 0,
                evaluateItemList: [],
                boardList: []
            }
        },
        mixins: [mixins],
        created() {
            this.teacherName = this.$route.query.teacherName;
            this.totalScore = this.$route.query.totalScore;
            this.getThDimensionScoreDataList();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            toStuCheckDetail(id, name) {
                this.$router.push({path: 'evaluateCheckDetail', query: {id: id, name: name, schoolTimeId: this.$route.query.schoolTimeId, teacherId: this.$route.query.teacherId}});
            },
            getThDimensionScoreDataList() {
                let self = this;
                getThDimensionScoreDataList({
                    schoolTimeId: this.$route.query.schoolTimeId,
                    teacherId: this.$route.query.teacherId
                }).then(res => {
                    const data = res.data.data;
                    this.boardList = [];
                    if (res.data.code === 200) {
                        this.evaluateItemList = data;
                        if (data.length > 6) { // 做length个
                            const maxScore = data.map(item => item.totalScore).sort();
                            let scoreNumLevel = 1;
                            if (maxScore && maxScore[maxScore.length - 1]) {
                                scoreNumLevel = 140 / maxScore[maxScore.length - 1];
                            }
                            data.forEach((item) => {
                                this.boardList.push({
                                    name: item.dimensionName,
                                    score: item.totalScore,
                                    boardHeight: parseInt(150 + item.totalScore*scoreNumLevel),
                                    boardWidth: data.length > 8 ? 40.5 : (260 / data.length).toFixed(3)
                                });
                            });
                        } else { // 做6个
                            let emptyJson = {
                                name: '',
                                score: 0,
                                boardHeight: 270,
                                boardWidth: 54
                            };
                            let startEmptyNum = parseInt((6 - data.length) / 2);
                            let endEmptyNum = 6 - data.length - startEmptyNum;
                            for (let i = 0; i < startEmptyNum; i++) {
                                self.boardList.push(emptyJson);
                            }
                            const maxScore = data.map(item => item.totalScore).sort();
                            let scoreNumLevel = 1;
                            if (maxScore && maxScore[maxScore.length - 1]) {
                                scoreNumLevel = 140 / maxScore[maxScore.length - 1];
                            }
                            data.forEach((item) => {
                                this.boardList.push({
                                    name: item.dimensionName,
                                    score: item.totalScore,
                                    boardHeight: parseInt(150 + item.totalScore*scoreNumLevel),
                                    boardWidth: 54
                                });
                            });
                            for (let i = 0; i < endEmptyNum; i++) {
                                self.boardList.push(emptyJson);
                            }
                        }
                        if (this.boardList.length > 8) {
                            this.boardList.length = 8;
                        }
                    }
                }).catch();
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    .evaluate_statistics{
        overflow-x: hidden;
        overflow-y: auto;
        .header{
            padding:12px;
            border-bottom: 1px solid #eee;
        }
        .stu_info_box{
            .name_score_box{
                padding: 20px 40px;
                .name_title{
                    display: inline-block;
                    font-size: 24px;
                    font-weight: 700;
                    margin-right: 20px;
                    color: #333;
                }
                .score_title{
                    display: inline-block;
                    font-size: 14px;
                    color: #666;
                }
            }
            .evaluate_item_wrap{
                padding: 20px 40px;
                .evaluate_item{
                    float: left;
                    height: 50px;
                    line-height: 50px;
                    margin-right: 20px;
                    margin-bottom: 20px;
                    padding: 0 20px;
                    color: #333;
                    background: #eee;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
        }
        .statistics_img_box{
            display: flex;
            border-top: 1px solid #eee;
            .picture_box{
                flex: 1;
                .pic_title{
                    margin: 20px;
                }
                .pic_wrap{
                    width: 450px;
                    height: 450px;
                    margin: 10px auto;
                }
                .pic_wrap_water{
                    background: url("./../../assets/images/water_bg.png") center /cover no-repeat;
                    overflow: hidden;
                    .out_box{
                        position: relative;
                        width: 324px;
                        height: 300px;
                        margin-top: 100px;
                        margin-left: 62px;
                        .inner_box_line{
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 40.5px;
                            min-height: 150px;
                            max-height: 300px;
                            padding: 20px 15px;
                            text-align: center;
                            border-top: 6px solid #ffb769;
                            border-right: 1px solid #836138;
                            border-left: 1px solid #836138;
                            color: #fff;
                            background: #daa15d;
                            box-sizing: border-box;
                            overflow: hidden;
                        }
                    }
                }
                .pic_wrap_tree{
                    background: url("./../../assets/images/apple_tree.png") center /cover no-repeat;
                }
            }
        }
    }
</style>
