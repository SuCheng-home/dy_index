<template>
    <div class="chineseCharactersfive">
        <div class="top">
            <el-radio-group v-model="searchType" size="medium" style="margin-top: -2px;" @change="getPlayWordClassDateLists()">
                <el-radio-button label="1">按周</el-radio-button>
                <el-radio-button label="2">按月</el-radio-button>
                <el-radio-button label="3">按学期</el-radio-button>
            </el-radio-group>
            <el-select size="medium" v-model="gradeId" placeholder="请选择年级" @change="gradeIdFun()">
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select size="medium" v-model="classId" placeholder="请选择班级" @change="classIdFun()">
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
             推荐识字量：1000
        </div>
        <div class="content" :style="`height:${notbmaxH -110}px`">
            <div v-show="datalist.length>0">
                <div id="myecharts"></div>
            </div>
            <default-page Mes="暂无数据" v-show="datalist.length==0"></default-page>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import echarts from 'echarts';
    import DefaultPage from '@/components/DefaultPage';
    import {querySchoolGrade, queryClassByGradeId, getPlayWordClassDateList} from '@/api/chineseCharacters';

    export default {
        data() {
            return {
                gradeId: '',
                gradeList: [],
                classId: '',
                classList: [],
                searchType: '1',
                datalist: [],
            }
        },
        mixins: [mixins],
        components: {DefaultPage},
        created() {
            querySchoolGrade().then(res => res.data).then(data => {
                this.gradeList = data.data;
                if (data.data.length !== 0) {
                    this.gradeId = data.data[0].id;
                    this.queryClassByGradeIds();
                }
            });
        },
        methods: {
            //切换年级
            gradeIdFun() {
                this.queryClassByGradeIds();
            },
            //切换班级
            classIdFun() {
                this.getPlayWordClassDateLists();
            },
            //获取班级
            queryClassByGradeIds() {
                queryClassByGradeId(this.gradeId).then(res => res.data).then(data => {
                    this.classList = data.data;
                    if (data.data.length !== 0) {
                        this.classId = data.data[0].id;
                        this.getPlayWordClassDateLists();
                    }
                });
            },
            //获取详情
            getPlayWordClassDateLists() {
                getPlayWordClassDateList(this.classId, this.searchType).then(res => res.data).then(data => {
                    this.datalist = data.data;
                    let listname = [];
                    let listone = [];
                    let listtwo = []
                    for (let i = 0; i < data.data.length; i++) {
                        listname.push(data.data[i].dateInfo);
                        listone.push(data.data[i].agvRightCount - 0);
                        listtwo.push(data.data[i].checkStuCount - 0);
                    }
                    this.myechartsfun(listname, listone, listtwo);
                });
            },
            //折线图
            myechartsfun(listname, listone, listtwo) {
                this.myecharts = echarts.init(document.getElementById("myecharts"));
                this.myecharts.setOption({
                    title: {text: "", x: "center"},
                    grid: {left: "2%", right: "4%", bottom: "6%", containLabel: true},
                    color: ["#50E0BD", '#1893FB'], //每个区域的颜色
                    tooltip: {trigger: "item", formatter: " {b}<br/> {a}: {c}"},
                    legend: {data: ["平均识字量", "参加人数"], x: "center", y: "top"},
                    xAxis: {data: listname, name: '日期',},
                    dataZoom: [{
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        left: ' 4%',
                        bottom: -5,
                        start: 0,
                        end: 100
                    }],
                    yAxis: [{name: '平均识字量', type: 'value'}, {name: '参加人数', type: 'value', splitLine: {show: false}},],
                    series: [
                        {
                            name: '平均识字量',
                            type: 'line',
                            yAxisIndex: 0,
                            data: listone,
                            label: {normal: {show: true, position: "top"}}
                        },
                        {
                            name: '参加人数',
                            type: 'line',
                            yAxisIndex: 1,
                            data: listtwo,
                            label: {normal: {show: true, position: "top"}}
                        }
                    ]
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .chineseCharactersfive {
        padding: 12px;

        * {
            box-sizing: border-box;
        }

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;
        }

        .content {
            overflow: auto;
            padding-top: 20px;

            #myecharts {
                width: 1000px;
                height: 500px;
                margin: 0 auto;
            }
        }
    }

</style>


