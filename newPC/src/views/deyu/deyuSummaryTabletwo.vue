<template>
    <div id="deyuSummaryTable">
        <div class="header">
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-select size="medium" style="width:200px" v-model="currentTermId" @change="schoolchange" placeholder="请选择学期">
                <el-option
                    v-for="item in termList"
                    :key="item.id"
                    :label="item.schoolTimeName"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-date-picker size="medium" v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"  @change="getClassConductCollectPageDataList2Func()" :clearable="false" >
                        </el-date-picker>
            <el-select size="medium" v-model="currentGradeId" placeholder="请选择年级" @change="gradechange()">
                <el-option
                    v-for="item in gradeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select size="medium" v-model="currentClassId" placeholder="请选择班级"
                       @change="getClassConductCollectPageDataList2Func">
                <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <a :href="downLoadHrefone" v-if="dataList.length>0" target="_blank" download="examName">
                <el-button type="primary" size="medium">导出</el-button>
            </a>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="学生姓名" icon="search" size="medium" 
                          v-model.trim="studentName"  @change="getClassConductCollectPageDataList2Func">
                    <el-button slot="append" icon="el-icon-search" @click="getClassConductCollectPageDataList2Func" ></el-button>
            </el-input>   
        </div>
        <div class="schoolWrap scrollStyle">
            <el-table :data="dataList" border stripe :height="nobottommaxH" ref="table">
                <el-table-column prop="studentName" fixed label="姓名" align="center" min-width="100"></el-table-column>
                <el-table-column prop="className" fixed label="班级" align="center" min-width="100"></el-table-column>
                <el-table-column v-for="(dimensionName, dimensionIndex) in dimensionList" :label="dimensionName"
                                 :key="dimensionIndex" align="center" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.stringList[dimensionIndex]}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalScore" label="总分" fixed="right" align="center"
                                 min-width="100"></el-table-column>
            </el-table>
            <el-pagination
                @size-change="getClassConductCollectPageDataList2Func"
                @current-change="getClassConductCollectPageDataList2Func"
                :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {
        getSchoolTimeAllList,
        getGradeListByTermId,
        getGradeClassList,
        getClassConductCollectPageDataList2,
        possessRole
    } from '@/api/deyu';

    export default {
        data() {
            return {
                termList: [],
                currentTermId: null,
                gradeList: [],
                currentGradeId: null,
                classList: [],
                currentClassId: null,
                dataList: [],
                dimensionList: [],
                downLoadHrefone: '',
                is: false,
                timer: null,
                daterange:[ this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
                studentName:""
            }
        },
        mixins: [mixins, BaseMixin],
        mounted() {
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.table.doLayout()
                }, 300)
            })
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        },
        created() {
            //获取所教班级
            possessRole('171').then(res => {
                this.is = res.data.data.result;
            });
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    this.termList = data.data;
                    if (data.data.length !== 0) {
                        this.currentTermId = data.data.find(item => item.isCurrent === 1).id;
                        this.daterange= [data.data.find(item => item.isCurrent === 1).startDate, data.data.find(item => item.isCurrent === 1).endDate];
                        this.getGradeListByTermIds()
                    }
                });
        },
        methods: {
            //切换学期
            schoolchange(val) {
                 this.daterange= [this.termList.find(item => item.id === this.currentTermId).startDate, this.termList.find(item => item.id === this.currentTermId).endDate];
                this.getGradeListByTermIds()
            },
            //获取年级
            getGradeListByTermIds() {
                getGradeListByTermId(this.currentTermId).then(res => res.data).then(data => {
                    this.gradeList = data.data;
                    if (data.data.length !== 0) {
                        this.currentGradeId = data.data[0].id;
                        this.getGradeClassLists();
                    }
                })
            },
            //切换年级
            gradechange() {
                this.getGradeClassLists()
            },
            //获取班级
            getGradeClassLists() {
                getGradeClassList(this.currentTermId, this.currentGradeId)
                    .then(res => res.data)
                    .then(data => {
                        const classList = data.data;
                        if (data.data.length !== 0) {

                            this.currentClassId = classList[0].id;
                        }
                        this.classList = classList;
                        this.getClassConductCollectPageDataList2Func();
                    })
            },
            getClassConductCollectPageDataList2Func() {
                if (this.currentClassId != null && this.currentGradeId != null && this.currentTermId != null) {
                    let gradeName = '';
                    let className = '';
                    for (let i = 0; i < this.gradeList.length; i++) {
                        if (this.gradeList[i].id == this.currentGradeId) {
                            gradeName = this.gradeList[i].name;
                        }
                        ;
                    }
                    ;
                    for (let i = 0; i < this.classList.length; i++) {
                        if (this.classList[i].id == this.currentClassId) {
                            className = this.classList[i].name;
                        }
                        ;
                    }
                    ;
                     let startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                     let endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                    this.downLoadHrefone = global.BasePath + "structure/schoolConduct/downClassConductCollectPageDataList2?classId=" + this.currentClassId+  "&startDate=" + startDate+  "&endDate=" + endDate+  "&schoolTimeId=" + this.currentTermId + "&gradeId=" + this.currentGradeId + "&studentName=" + this.studentName + "&gradeName=&token=" + this.$store.getters.token;
                      getClassConductCollectPageDataList2({
                        pageNo: this.pagination.pageNo,
                        pageSize: this.pagination.pageSize,
                        classId: this.currentClassId,
                        gradeId: this.currentGradeId,
                        schoolTimeId: this.currentTermId,
                        endDate:endDate,
                        startDate:startDate,
                        studentName:this.studentName
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.pagination.total = data.data.pagination.total;
                            this.dataList = data.data.dataList;
                             this.dimensionList = data.data.titleList.map(({dimensionName}) => dimensionName);
                            this.$nextTick(()=>{
                                    this.timer=setTimeout(()=> {
                                    this.$refs.table.doLayout()
                                    },300) 
                                })
                        });

                } else {
                    this.pagination.total = 0;
                    this.dataList = [];
                }
            },
            //维度统计
            deyuAccountingByDimension() {
                this.$router.push({
                    path: "deyuAccountingByDimension"
                });
            }
        }
    }
</script>
<style scoped lang="scss">
    #deyuSummaryTable {
        padding:12px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .header {
        padding-bottom: 10px;

        .el-select {
            width: 120px;
        }
    }
</style>
