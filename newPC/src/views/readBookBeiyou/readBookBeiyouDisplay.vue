<template>
    <div class="main-container" id="readBookBeiyouDisplay">
        <div v-if="isShowAllAccounting">
            <div class="modal"></div>
            <div class="panel panel--big">
                <div class="info info--title">
                    <div>阅读统计</div>
                </div>
                <div class="panel__close" @click="isShowAllAccounting = false"></div>
                <div class="panel--small__left-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>阅读方式
                        <div class="pie-chart" id="pie-chart-all"></div>
                    </div>
                </div>
                <div class="panel--small__right-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>阅读次数
                    </div>
                    <div class="rank-table-container">
                        <div class="table-header">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>排名</td>
                                    <td>名称</td>
                                    <td>次数</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="table-body">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <tbody>
                                <tr v-for="(studentItem, index) in studentListForAll">
                                    <td>{{index + 1}}</td>
                                    <td>{{studentItem.studentName}}</td>
                                    <td>{{studentItem.totalCount}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="panel--small__right-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>书本排名
                    </div>
                    <div class="rank-table-container">
                        <div class="table-header">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>排名</td>
                                    <td>名称</td>
                                    <td>次数</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="table-body">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <tbody>
                                <tr :key="index" v-for="(bookItem, index) in bookListForAll">
                                    <td>{{index + 1}}</td>
                                    <td>{{bookItem.bookName}}</td>
                                    <td>{{bookItem.totalCount}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isShowBookAccounting">
            <div class="modal"></div>
            <div class="panel panel--small">
                <div class="info info--book">
                    <div class="info__photo--book" :style="{backgroundImage: `url(${currentBook.logoUrl})`}"></div>
                    <div>{{currentBook.bookName}}</div>
                </div>
                <div class="panel__close" @click="isShowBookAccounting = false"></div>
                <div class="panel--small__left-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>阅读方式
                        <div class="pie-chart" id="pie-chart-book"></div>
                    </div>
                </div>
                <div class="panel--small__right-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>排名情况
                    </div>
                    <div class="rank-table-container">
                        <div class="table-header">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>排名</td>
                                    <td>名称</td>
                                    <td>次数</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="table-body">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <tbody>
                                <tr v-for="(studentItem, index) in currentBookStudentList">
                                    <td>{{index + 1}}</td>
                                    <td>{{studentItem.studentName}}</td>
                                    <td>{{studentItem.totalCount}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isShowStudentAccounting">
            <div class="modal"></div>
            <div class="panel panel--small">
                <div class="info">
                    <div class="info__photo" :style="{backgroundImage: `url(${currentStudent.avatar})`}"></div>
                    <div>{{currentStudent.studentName}}</div>
                </div>
                <div class="panel__close" @click="isShowStudentAccounting = false"></div>
                <div class="panel--small__left-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>阅读方式
                        <div class="pie-chart" id="pie-chart"></div>
                    </div>
                </div>
                <div class="panel--small__right-container">
                    <div class="panel__container-title">
                        <i class="icon"></i>排名情况
                    </div>
                    <div class="rank-table-container">
                        <div class="table-header">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <thead>
                                <tr>
                                    <td>排名</td>
                                    <td>名称</td>
                                    <td>次数</td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="table-body">
                            <table>
                                <colgroup>
                                    <col style="width: 140px;" />
                                    <col style="width: 210px;" />
                                    <col style="width: 174px;" />
                                </colgroup>
                                <tbody>
                                <tr v-for="(bookItem, index) in currentStudentBookList">
                                    <td>{{index + 1}}</td>
                                    <td>{{bookItem.bookName}}</td>
                                    <td>{{bookItem.totalCount}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-container">
            <el-table
                border
                :data="stuList"
                style="width: 100%"
                height="1060px"
            >
                <el-table-column
                    fixed
                    prop="date"
                    align="center"
                    width="117">
                    <template slot="header" slot-scope="scope">
                        <img class="legend" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/legend.png" />
                    </template>
                    <template slot-scope="scope">
                        <span class="link" @click="showStudentAccounting(scope.row)">{{scope.row.studentName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="80" :key="index" v-for="(colItem, index) in bookList">
                    <template slot="header" slot-scope="scope">
                        <div @click="showBookAccounting(colItem)" class="book-item" :style="{backgroundImage: `url(${colItem.logoUrl})`}"></div>
                    </template>
                    <template slot-scope="scope">
                        <div v-if="scope.row.readCountList[index] && scope.row.readCountList[index] != 0" class="icon icon--star1"></div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="accounting-btn" @click="showAllAccounting"></div>
    </div>
</template>

<script>
    import {
        getStuListByClassId,
        getStuWayListByStuId,
        getBookCountListByStuId,
        getStuCountListByBookId,
        getStuWayListByBookId,
        getStuCountListByStuId,getNowReadIndependBatch
    } from '@/api/readBookBeiyou';
    export default {
        name: "readBookBeiyouDisplay",
        data() {
            return {
                schoolId: this.$route.query.schoolId,
                classId: this.$route.query.classId,
                bookList: [],
                stuList: [],
                currentStudent: {},
                currentStudentBookList: [],
                currentBook: {},
                currentBookStudentList: [],

                bookListForAll: [],
                studentListForAll: [],

                isShowStudentAccounting: false,
                isShowBookAccounting: false,
                isShowAllAccounting: false,
                batchId:''
            }
        },
        mounted() {
          
         getNowReadIndependBatch({
                schoolId: this.schoolId,
                classId: this.classId
            })
                .then(res => res.data)
                .then(data => {
                    this.batchId = data.data.id;
                      getStuListByClassId({
                schoolId: this.schoolId,
                classId: this.classId,
                batchId:this.batchId
            })
                .then(res => res.data)
                .then(data => {
                    this.stuList = data.data.stuList;
                    this.bookList = data.data.bookList;
                });
                });
        },
        methods: {
            showAllAccounting() {
                getStuCountListByStuId({
                    classId: this.classId,
                    batchId:this.batchId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.studentListForAll = data.data;
                    });
                getBookCountListByStuId({
                    classId: this.classId,
                    studentId: 0,
                     batchId:this.batchId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.bookListForAll = data.data;
                    });
                getStuWayListByStuId({
                    classId: this.classId,
                    studentId: 0,
                     batchId:this.batchId
                })
                    .then(res => res.data)
                    .then(data => {
                        const seriesData = [];
                        data.data.forEach(item => {
                            seriesData.push({
                                name: item.wayTypeName,
                                value: item.totalCount
                            });
                        });
                        this.drawPieChart('pie-chart-all', {seriesData});
                    });
                this.isShowAllAccounting = true;
            },
            showBookAccounting(bookItem) {
                this.currentBook = bookItem;
                Promise.all([
                    getStuWayListByBookId({
                        bookId: bookItem.bookId,
                        classId: this.classId,
                         batchId:this.batchId
                    })
                        .then(res => res.data.data),
                    getStuCountListByBookId({
                        bookId: bookItem.bookId,
                        classId: this.classId,
                         batchId:this.batchId
                    })
                        .then(res => res.data.data)

                ])
                    .then(([data1, data2]) => {
                        this.isShowBookAccounting = true;
                        this.currentBookStudentList = data2;

                        setTimeout(() => {
                            const seriesData = [];
                            data1.forEach(item => {
                                seriesData.push({
                                    name: item.wayTypeName,
                                    value: item.totalCount
                                });
                            });
                            this.drawPieChart('pie-chart-book', {seriesData});
                        }, 300)
                    })
            },
            showStudentAccounting(studentItem) {
                this.currentStudent = studentItem;
                Promise.all([
                    getStuWayListByStuId({
                        studentId: studentItem.studentId,
                        classId: this.classId,
                         batchId:this.batchId
                    })
                        .then(res => res.data.data),
                    getBookCountListByStuId({
                        studentId: studentItem.studentId,
                        classId: this.classId,
                         batchId:this.batchId
                    })
                        .then(res => res.data.data)

                ])
                    .then(([data1, data2]) => {
                        this.isShowStudentAccounting = true;
                        this.currentStudentBookList = data2;

                        setTimeout(() => {
                            const seriesData = [];
                            data1.forEach(item => {
                                seriesData.push({
                                    name: item.wayTypeName,
                                    value: item.totalCount
                                });
                            });
                            this.drawPieChart('pie-chart', {seriesData});
                        }, 300)
                    })
            },
            drawPieChart(container, args) {
                const option = {
                    color: [
                        "#E9654B",
                        "#8BCFDE",
                        "#25B8EC",
                        "#FDC333",
                        "#AECF74",
                        "#B18BBF"
                    ],
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        top: '320px',
                        formatter: function(name) {
                            var data = option.series[0].data;
                            var total = 0;
                            var tarValue;
                            for (var i = 0, l = data.length; i < l; i++) {
                                total += data[i].value;
                                if (data[i].name == name) {
                                    tarValue = data[i].value;
                                }
                            }
                            var p = Math.round((tarValue / total * 100));
                            return name + " " + " " + p + "%";
                        },
                    },
                    series: [
                        {
                            avoidLabelOverlap: true,
                            name: '阅读方式',
                            center: ['50%', '30%'],
                            type: 'pie',
                            radius: '70%',
                            data: args.seriesData,
                            label: {
                                normal: {
                                    position: 'inside',
                                    color: '#333',
                                    formatter: function(val) {
                                        return `${val.name}:${val.value}`
                                    }
                                }
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                if(document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                }
            }

        }
    }
</script>

<style lang="scss">
    @import '../../styles/mixin';

    #readBookBeiyouDisplay {
        width: 1920px;
        height: 1080px;
        background: no-repeat center center / 100% 100% url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/main-bg.png);
        box-sizing: border-box;
        padding: 10px;
        .legend {
            width: 117px;
            height: auto;
        }
        .table-container {
            th {
                padding: 0!important;
                background: transparent;

                .cell {
                    padding: 0!important;
                    line-height: 0!important;
                }
            }
            th:not(.gutter) {
                border-right: 2px solid #8FC8FF !important;
                border-bottom: 2px solid #8FC8FF !important;
            }
            tr {
                background: transparent !important;

            }
            tr.hover-row>td {
                background: transparent !important;
            }
            td {
                padding: 0 !important;
                height: 22px !important;
                border-right: 2px solid #8FC8FF !important;
                border-bottom: 2px solid #8FC8FF !important;
            }
            .el-table {
                background: rgba(255, 255, 255, 0.5);

            }
            .el-table_1_column_1 {
                background-color: #C7E4FF !important;
            }
            .book-item {
                width: 70px;
                height: 96px;
                @include cover-bg;
                margin: 0 auto;
            }
            .icon--star1 {
                height: 20px;
                width: 20px;
                background: no-repeat center center / 100% 100% url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/star1.png);
                margin: 0 auto;
                position: relative;
                top: -1px;
            }
            .link {
                color: #409EFF;
            }
        }

        .modal {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .5;
            background: #000;
            z-index: 2000;
        }
        .panel {
            @include cover-bg;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            z-index: 2200;
        }
        .panel__container-title {
            font-weight: bold;
            font-size: 18px;
            & > * {
                @include middleIB;
            }
            .icon {
                height: 55px;
                width: 55px;
                @include cover-bg;
                background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/star2.png);
                margin-right: 10px;
            }
        }
        .panel--small {
            width: 1145px;
            height: 690px;
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/small-panel.png);
            box-sizing: border-box;
            padding: 120px 50px 70px 110px;
            .panel--small__left-container {
                width: 390px;
                float: left;
            }
            .panel--small__right-container {
                width: 590px;
                float: right;
            }
        }
        .panel--big {
            width: 1700px;
            height: 800px;
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/big-panel.png);
            box-sizing: border-box;
            padding: 120px 45px 70px 80px;
            .table-body {
                height: 424px !important;
                overflow-y: auto;
            }
            .panel--small__left-container {
                width: 390px;
                float: left;
                height: 600px;
            }
            .panel--small__right-container {
                width: 590px;
                float: right;
            }
        }
        .info {
            position: absolute;
            left: 60px;
            top: 11px;
            color: #fff;
            font-size: 26px;
            & > * {
                @include middleIB;
            }
            .info__photo {
                width: 40px;
                height: 40px;
                @include cover-bg;
                border-radius: 50%;
            }
            .info__photo--book {
                width: 44px;
                height: 40px;
                background: no-repeat center center / contain;
            }

        }
        .info--title {
            top: 24px;
            left: 100px;
        }
        .info.info--book {
            left: 30px;
        }
        .panel__close {
            position: absolute;
            right: 0;
            top: 0;
            width: 70px;
            height: 70px;
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/close-icon.png);
            z-index: 2300;
            cursor: pointer;
        }
        #pie-chart, #pie-chart-book, #pie-chart-all {
            width: 370px;
            height: 600px;
        }
        .rank-table-container {
            padding-left: 60px;
            .table-header {
                td {
                    background-color: #DDB172;
                }
            }
            .table-body {
                height: 365px;
                overflow-y: auto;
            }
            table {
                table-layout: fixed;
                border-collapse: collapse;
                th, td {
                    border: 2px solid #fff;
                    text-align: center;
                    padding: 20px 0;
                }
                td {
                    background-color: #F3CF9B;
                }

            }
        }
        .accounting-btn {
            width: 85px;
            height: 85px;
            position: absolute;
            background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/beiyou/account-btn.png);
            right: 66px;
            bottom: 40px;
        }
    }
</style>
