<template>
    <div class="supply_class_wrap">
        <div class="header">
            <el-row>                 
                <el-col :span="20">
                     <el-select  size="medium" style="width: 180px" v-model="pagination.schoolTimeId" placeholder="请选择学期" @change="changeSchool()">
                       <!-- <el-option label="全部学期" :value="0"> </el-option> -->
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        size="medium"
                        v-model="duration"
                        type="daterange" class="mywidthdaterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        @change="searchHandler" style="width: 218px"
                    >
                    </el-date-picker>
                    <el-select size="medium" style="width: 120px" class="inputSelect" v-model="type" @change="searchHandler">
                        <el-option label="全部类型" :value="0">全部类型</el-option>
                        <el-option label="代课" :value="1">代课</el-option>
                        <el-option label="调课" :value="2">调课</el-option>
                        <el-option label="其他" :value="3">其他</el-option>
                    </el-select>
                    <el-select size="medium" style="width: 120px" class="inputSelect" v-model="state" @change="searchHandler">
                        <el-option label="全部状态" :value="0">全部状态</el-option>
                        <el-option label="草稿" :value="1">草稿</el-option>
                        <el-option label="已发布" :value="2">已发布</el-option>
                        <el-option label="已确认" :value="3">已确认</el-option>
                        <el-option label="待审核" :value="-2">待审核</el-option>
                        <el-option label="未发布" :value="-3">未发布</el-option>
                    </el-select>
                    <el-select size="medium" style="width: 120px" class="inputSelect" v-model="searchClassId" @change="searchHandler">
                        <el-option label="全部班级" :value="0">全部班级</el-option>
                        <el-option :label="item.name" :value="item.id" v-for="item in allClassList">{{item.name}}</el-option>
                    </el-select>
                    <el-button type="primary" @click="createNewClass" size="medium">新建</el-button>
                    <!-- <el-button type="primary" @click="toClassStatistics" size="medium">统计</el-button>
                    <el-button type="primary" @click="toOffsetStatistics" size="medium">代课抵扣</el-button> -->
                    <el-button type="primary" @click="printHandler" size="medium">打印</el-button>
                    <a :href="exportUrl" download="导出" target="_blank" >
                        <el-button type="primary" size="medium" icon="upload">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="4">
                    <el-input @keyup.enter.native="searchHandler" size="medium" class="filter-item" placeholder="请输入姓名"
                              v-model.trim="searchTitle" maxlength="20">
                        <el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="supply_class_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH"
                      @select="selectionChangeHandler"
                      @select-all="selectionChangeHandler"
            >
                <el-table-column type="selection" align="center" width="65" :selectable="selectable">
                </el-table-column>
                <el-table-column align="center" label="代课/调课老师" prop="supplyTeacherName"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supplyDate | formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supplyClassName || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="节次/天数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supplyClassNoName || scope.row.substituteDayNum || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="课程">
                    <template slot-scope="scope">
                        <span>{{scope.row.supplySubjectName || '--'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="被代课/被调课老师">
                    <template slot-scope="scope">
                        <span>{{scope.row.adjustTeacherName || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.type !== 3">{{scope.row.adjustDate | formatTime}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.adjustClassName || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="节次" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.adjustClassNoName || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="课程" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.adjustSubjectName || '--'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.typeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="原因" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.reasonType}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="图片">
                    <template slot-scope="scope" >
                     <span v-if="(!scope.row.adjustPics)||(JSON.parse(scope.row.adjustPics).length==0)"> ----</span>  
                     <span>
                          <image-previewer tag="richtext">
                               <img v-for="(item,index) in  JSON.parse(scope.row.adjustPics)" :key="index" :src="item.picUrl" style="margin: 0 3px; width: 20px;height:20px;vertical-align: middle;">
                          </image-previewer></span>             
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info" v-if="scope.row.state === 1">草稿</el-tag>
                        <el-tag  size="mini" v-else-if="scope.row.state === 2&&scope.row.isAffirm != 1">已发布</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.state === 2&&scope.row.isAffirm === 1">已确认</el-tag>
                        <el-tag  size="mini" type="warning" v-else-if="scope.row.state === -2">待审核</el-tag>
                        <el-tag  size="mini" type="danger" v-else-if="scope.row.state === -1">未通过</el-tag>
                        <el-tag  size="mini" type="warning" v-else-if="scope.row.state === -3">未发布</el-tag>
                        <span v-else>--</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="scope.row.state === 1"
                                   @click.native.prevent="editSupplyClass(scope.row)">编辑
                        </el-button>
                        <el-button type="text" style="color: #f56c6c" size="small" @click.native.prevent="deleteSupplyClass(scope.row)">删除
                        </el-button>
                        <el-button type="text" size="small" v-if="scope.row.state === -2"
                                   @click.native.prevent="checkSupplyClass(scope.row.id,scope.row.type)">审核
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <div ref="print" class="print-container">
            <table class="print-table" v-for="item in selected">
                <colgroup>
                    <col style="width: 100px" />
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <tr>
                    <td colspan="5" class="td--title">代课/调课情况表</td>
                </tr>
                <tr>
                    <td rowspan="4" class="td--title td--vertical">代<br />课<br />/<br />调<br />课<br />信<br />息</td>
                    <td class="td--title">代课/调课老师</td>
                    <td class="td--title">日期</td>
                    <td class="td--title">年级</td>
                    <td class="td--title">班级</td>
                </tr>
                <tr>
                    <td>{{item.supplyTeacherName || '--'}}</td>
                    <td>{{item.supplyDate | formatTime}}</td>
                    <td>{{item.supplyGradeName || '--'}}</td>
                    <td>{{item.supplyClassName || '--'}}</td>
                </tr>
                <tr>
                    <td class="td--title">节次</td>
                    <td class="td--title">课程</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>{{item.supplyClassNoName || '--'}}</td>
                    <td>{{item.supplySubjectName || '--'}}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td rowspan="4" class="td--title td--vertical">被<br />代<br />课<br />/<br />调<br />课<br />信<br />息</td>
                    <td class="td--title">被代课/调课老师</td>
                    <td class="td--title">日期</td>
                    <td class="td--title">年级</td>
                    <td class="td--title">班级</td>
                </tr>
                <tr>
                    <td>{{item.adjustTeacherName || '--'}}</td>
                    <td>{{item.adjustDate | formatTime}}</td>
                    <td>{{item.adjustGradeName || '--'}}</td>
                    <td>{{item.adjustClassName || '--'}}</td>
                </tr>
                <tr>
                    <td class="td--title">节次</td>
                    <td class="td--title">课程</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>{{item.adjustClassNoName || '--'}}</td>
                    <td>{{item.adjustSubjectName || '--'}}</td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import {querySchoolClass} from '@/api/system';
    import {getSchoolTimeList} from '@/api/record';
    import mixins from '@/mixins/windowResize';
    import {getSupplyAdjustClassPageListForPC, deleteSupplyClass} from '@/api/supplyClass';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    export default {
        name: "supplyClassIndex",
        data() {
            return {
                  schoolYearList: [],
                searchTitle: '',
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null,
                    schoolTimeId:0
                },
                dataList: [],
                selected: [],

                duration: ['', ''],
                searchClassId: 0,
                state: 0,
                type: 0,
                allClassList: [],
                 exportUrl: ''
            }
        },
        components: {
            ImagePreviewer
        },
        mixins: [mixins],
        filters: {
            formatTime(date) {
                if (date) {
                    return date.substring(0, 10);
                }
                return '--';
            }
        },
        created() {
             getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;   
                     this.schoolYearList.forEach(function (item) {
                        if (item.isCurrent === 1) {
                            self.pagination.schoolTimeId=item.id;
                            self.duration = [item.startDate, item.endDate]; // 列表日期
                        }
                    });   
                     querySchoolClass()
                .then(res => res.data)
                .then(data => {
                    this.allClassList = data.data;
                })
            this.getStatistics();             
                }).catch();
            
           
        },
        methods: {
              getDate(n) {
                const data = new Date();
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
                let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return localDateStr;
            },
             fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
             changeSchool() {
                if(this.pagination.schoolTimeId){
                    let mythis=this;
                   this.schoolYearList.forEach(function (item) {
                    if (item.id == mythis.pagination.schoolTimeId) {  
                        mythis.duration = [item.startDate, item.endDate]; // 列表日期
                    }
                   });
                }
                this.searchHandler();
            },
            printHandler() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要打印的条目');
                } else {
                    this.$print(this.$refs.print)
                }
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            createNewClass() {
                this.$router.push({path: 'addReplace'});
            },
            toClassStatistics() {
                this.$router.push({path: 'statistics'});
            },
            toOffsetStatistics() {
                this.$router.push({path: 'offsetStatistics'});
            },
            editSupplyClass(item) {
                if (item.type === 1) {
                    this.$router.push({path: 'addReplace', query: {id: item.id}});
                } else if (item.type === 2) {
                    this.$router.push({path: 'addChange', query: {id: item.id}});
                } else {
                    this.$router.push({path: 'otheradd', query: {id: item.id}});
                }
            },
            checkSupplyClass(id, type) {
                if (type === 2) {
                    this.$router.push({path: 'checkSupply', query: {id: id}});
                } else {
                    this.$router.push({path: 'check', query: {id: id, type: type}});
                }
            },
            deleteSupplyClass(item) {
                this.$confirm('此操作将删除本次' + item.typeName + ', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSupplyClass(item.id.toString()).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.selected = [];
                            this.getStatistics();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch();
                }).catch(() => {
                });
            },
            getCurrentMonthDay(date) {
                if (date) {
                    return date.substring(0, 8) + '01';
                }
                return ''
            },
            searchHandler() {
                this.pagination.pageNo = 1;
                this.selected = [];
                this.getStatistics();
            },
            getStatistics() {
                const [searchStartDate, searchEndDate] = this.duration;
                let query = {
                    pageNo: this.pagination.pageNo,
                    schoolTimeId: this.pagination.schoolTimeId,
                    pageSize: this.pagination.pageSize,
                    searchTitle: this.searchTitle,
                    state: this.state,
                    type: this.type,
                    searchClassId: this.searchClassId,
                    searchStartDate: searchStartDate || '',
                    searchEndDate: searchEndDate || ''
                };
                if(!this.searchClassId) {
                    query.searchGradeId = 0
                } else {
                    query.searchGradeId = this.allClassList.find(item => item.id == this.searchClassId).pid;
                }
                this.getSupplyAdjustClassPageListForPC(query);
            },
            getSupplyAdjustClassPageListForPC(query) {
                this.exportUrl = `${global.BasePath}structure/supplyClass/exportAllSupplyAdjustClassList?token=${this.$store.getters.token}&schoolTimeId=${query.schoolTimeId}&searchTitle=${query.searchTitle}&state=${query.state}&type=${query.type}&searchClassId=${query.searchClassId}&searchEndDate=${query.searchEndDate}&searchGradeId=${query.searchGradeId}&searchStartDate=${query.searchStartDate}`;
                getSupplyAdjustClassPageListForPC(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.selected = [];
                this.getStatistics();
            },
            currentChangeHandler() {
                this.selected = [];
                this.getStatistics();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supply_class_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;
        }
    }
    .print-container {
        display: none;
        width: 100%;
    }
    .print-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        margin-bottom: 20px;
        td {
            border: 1px solid #000;
            line-height: 30px;
            text-align: center;
        }
        .td--title {
            font-weight: bold;
        }
        .td--vertical {
            font-size: 13px;
            line-height: 19px;
        }
    }
    @media print {
        .print-container {
            display: block !important;
        }
    }
</style>
