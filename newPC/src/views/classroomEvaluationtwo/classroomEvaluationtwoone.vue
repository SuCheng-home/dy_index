<template>
    <div class="classroomEvaluationtwoone">
        <!-- <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
         <el-tab-pane label="课堂评价统计(单)" name="three" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"></el-tab-pane>
         <el-tab-pane label="课堂评价老师统计" name="four" v-if="isShowByPermission('/schoolBehEval/classBehEvalCurrStuScore')"></el-tab-pane>
         <el-tab-pane label="课堂评价学期统计" name="one"  v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"> -->
        <div class="top">
            <term-grade-class-selector :isShowDuration="false" :queryArgs="queryArgs"   @input="getStuCurrRankAnalysisLists()" ref="selector" v-model="obj" ></term-grade-class-selector>
            <el-button type="primary" size="medium" class="left-line" @click="print()" :disabled="isshow">打印</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="ul"  >
                <div class="li" style="overflow: hidden;border-bottom: 1px solid #e7eaec;">
                    <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">学号</div>
                    <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">姓名</div>
                    <div class="li-box" style="width:10%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">得分</div>
                    <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">班级排名</div>
                    <div class="li-box" style="width:63%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">评价内容</div>
                </div>
                <div  v-for="(items,indexs) in dataList" :key="indexs">
                    <div class="li" style="overflow: hidden;border-bottom: 1px solid #e7eaec; page-break-after: always;" v-if="numfun(indexs+1)" >
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.studentNo}}
                        </div>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.studentName}}
                        </div>
                        <div class="li-box" style="width:10%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.totalScore}}
                        </div>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.stuRank}}
                        </div>
                        <div class="li-box" style="width:63%;float: left;font-size: 14px;color:#909399;padding: 8px 0;">
                            <div :id="'chart'+indexs" style="width:280px;float: left;height: 170px;padding:0 8px;"></div>
                            <div class="div" style="padding-top:40px">
                                <div style="    text-align: center;float: none;font-size: 20px;font-family: kaiti;  width: 100%; font-weight: 800;">玄外附小学生课堂表现性评价</div>
                                <div style="vertical-align: top;white-space: normal;word-break: break-all;font-size: 20px;font-family: kaiti;">{{items.commonLeaveTitle}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="li" style="overflow: hidden;border-bottom: 1px solid #e7eaec;" v-else>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.studentNo}}
                        </div>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.studentName}}
                        </div>
                        <div class="li-box" style="width:10%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.totalScore}}
                        </div>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#909399;line-height: 170px;padding: 8px 0;">
                            {{items.stuRank}}
                        </div>
                        <div class="li-box" style="width:63%;float: left;font-size: 14px;color:#909399;padding: 8px 0;">
                            <div :id="'chart'+indexs" style="width:280px;float: left;height: 170px;padding:0 8px;"></div>
                            <div class="div" style="padding-top:40px">
                                <div style="    text-align: center;float: none;font-size: 20px;font-family: kaiti;  width: 100%; font-weight: 800;">玄外附小学生课堂表现性评价</div>
                                <div style="vertical-align: top;white-space: normal;word-break: break-all;font-size: 20px;font-family: kaiti;">{{items.commonLeaveTitle}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="    display: none;">
                <div class="ul"  ref="print" >
                    <div class="li" style="overflow: hidden;border-bottom: 1px solid #e7eaec;">
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">学号</div>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">姓名</div>
                        <div class="li-box" style="width:10%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">得分</div>
                        <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">班级排名</div>
                        <div class="li-box" style="width:63%;float: left;text-align:center;font-size: 14px;color:#303133;line-height: 28px;padding: 8px 0;">评价内容</div>
                    </div>
                    <div  v-for="(items,indexs) in dataList" :key="indexs">
                        <div class="li" style="overflow: hidden;border-bottom: 1px solid #e7eaec; page-break-after: always;" v-if="numfun(indexs+1)" >
                            <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.studentNo}}
                            </div>
                            <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.studentName}}
                            </div>
                            <div class="li-box" style="width:10%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.totalScore}}
                            </div>
                            <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.stuRank}}
                            </div>
                            <div class="li-box" style="width:63%;float: left;font-size: 14px;color:#606266;padding: 8px 0;">
                                <img src="" :id="'chart'+indexs+'img'" style="width:280px;float: left;height: 170px;padding:0 8px;">
                                <div class="div" style="padding-top:40px">
                                    <div style="    text-align: center;float: none;font-size: 20px;font-family: kaiti;  width: 100%; font-weight: 800;">玄外附小学生课堂表现性评价</div>
                                    <div style="vertical-align: top;white-space: normal;word-break: break-all;font-size: 20px;font-family: kaiti;">{{items.commonLeaveTitle}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="li" style="overflow: hidden;border-bottom: 1px solid #e7eaec;" v-else>
                            <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.studentNo}}
                            </div>
                            <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.studentName}}
                            </div>
                            <div class="li-box" style="width:10%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.totalScore}}
                            </div>
                            <div class="li-box" style="width:9%;float: left;text-align:center;font-size: 14px;color:#606266;line-height: 170px;padding: 8px 0;">
                                {{items.stuRank}}
                            </div>
                            <div class="li-box" style="width:63%;float: left;font-size: 14px;color:#606266;padding: 8px 0;">
                                <img src="" :id="'chart'+indexs+'img'" style="width:280px;float: left;height: 170px;padding:0 8px;">
                                <div class="div" style="padding-top:40px">
                                    <div style="text-align: center;float: none;font-size: 20px;font-family: kaiti;  width: 100%; font-weight: 800;">玄外附小学生课堂表现性评价</div>
                                    <div style="vertical-align: top;white-space: normal;word-break: break-all;font-size: 20px;font-family: kaiti;">{{items.commonLeaveTitle}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- </el-tab-pane>

        <el-tab-pane label="课堂评价统计" name="two"  v-if="isShowByPermission('/schoolBehEval/classBehEvalStuScoreH')"></el-tab-pane>  -->
<!--        </el-tabs>-->
    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import {mapGetters} from 'vuex';
    import {isShowByPermission} from '@/utils/utils';
    import {getStuCurrRankAnalysisList,possessRole} from "@/api/classroomEvaluationtwo";
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";
    function drawRadar(containerId, config) {
        const configObj = {
            title: {
                text: '',
            },
            tooltip: {},
            legend: {
                data: [""],
                top: '20%;'
            },
            grid: {
                top: '0%',
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            color:['#409EFF'],
            radar: {
                radius: 40,
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [0, 0]
                    }
                },
                indicator: config.indicator
            },
            series: [{
                name:"",
                type: 'radar',
                // label: {
                //     show: true
                // },
                data : [
                    {
                        value : config.data,
                        name : '排名'
                    }
                ]
            }]
        };
        echarts.init(document.getElementById(containerId)).setOption(configObj);
        setTimeout(() => {
            document.getElementById(containerId+'img').setAttribute('src',  echarts.init(document.getElementById(containerId)).getDataURL());
        }, 2000);
    }
    export default {
        components: { TermGradeClassSelector },
        data() {
            return {
                activeName:'one',
                query: {
                    classId:"",//	班级id	number
                    schoolTimeId:"",//	学期id	number
                },
                queryArgs: {
                    all: true, //所有班级年级
                    manager: false, //班主任
                    notlimit: true, //所有班级年级
                    submanager: false, //副班主任
                    teacher: false //普通所交
                },
                obj: {
                    termId: "",
                    duration: ["", ""],
                    gradeId: "",
                    classId: ""
                },
                dataList:[],
                isshow:false
            };
        },
        mixins: [mixin],
        computed:{
            ...mapGetters(['userInfo'])
        },
        mounted() {
            possessRole(50).then(res => {
                this.queryArgs.all=res.data.data.result;
                this.queryArgs.notlimit=res.data.data.result;
                this.queryArgs.manager=!res.data.data.result;
                this.queryArgs.submanager=!res.data.data.result;
                this.queryArgs.teacher=!res.data.data.result;
            });
        },
        methods: {
            isShowByPermission,
            numfun(num){
                if(num%6==0){
                    return true;
                }else{
                    return false;
                }

            },
            getStuCurrRankAnalysisLists(){
                this.isshow=true;
                this.query.classId=this.obj.classId;
                this.query.schoolTimeId=this.obj.termId;
                if(this.query.classId){

                }else{
                    return;
                }
                getStuCurrRankAnalysisList(this.query).then(res => {
                    let data = res.data.data;
                    this.dataList=data;
                    setTimeout(() => {
                        for(let i=0;i<data.length;i++){
                            let numlist=[];
                            let namelist=[];
                            for(let j=0;j<data[i].currRankList.length;j++){
                                numlist.push(data[i].currRankList[j].stuRank)
                                namelist.push(data[i].currRankList[j].curriculumName)
                            }
                            let max = data.length;
                            let indicator = namelist.map(name => ({name, max}));
                            console.log(numlist)
                            drawRadar('chart'+i, {
                                name: '排名',
                                indicator,
                                data: numlist
                            });
                            //动态的渲染到打印html的标签上

                        }
                    }, 1000);
                    setTimeout(() => {
                        this.isshow=false

                    }, 3000);

                });
            },
            print() {
                this.$print(this.$refs.print);
            },
            activeNamefun(){
                if(this.activeName=='one'){
                    this.$router.push({
                        path: "classroomEvaluationtwoone"
                    });
                }
                if(this.activeName=='two'){
                    this.$router.push({
                        path: "classroomEvaluationtwotwo"
                    });
                }
                if(this.activeName=='three'){
                    this.$router.push({
                        path: "classroomEvaluationtwothree"
                    });
                }
                if(this.activeName=='four'){
                    this.$router.push({
                        path: "classroomEvaluationtwofour"
                    });
                }
            },

        }
    };
</script>
<style lang="scss" scoped>
    .classroomEvaluationtwoone{
        padding: 10px;
        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
        .body{
            overflow: auto;
            .ul{
                width: 1105px;
                margin: 0 auto;
            }
        }
    }
</style>
