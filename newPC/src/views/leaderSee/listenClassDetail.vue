<template>
    <div class="listen_class_wrap page">
        <div>
            <div style="margin-bottom: 10px">
               <term-grade-class-selector :isGradeShowAll="true" :isClassShow="false" :queryArgs="queryArgs"   @input="getStatistics()" ref="selector" v-model="obj" ></term-grade-class-selector>  
                <el-select v-model="addressType" placeholder="请选择" size="medium" @change="getStatistics()">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <template v-if="listenTypeList && listenTypeList.length !== 0 && addressType === 1">
                    <el-select
                        v-model="recordTypeId"
                        size="medium"
                        placeholder="请选择"
                        @change="getStatistics()"
                    >
                        <el-option :key="0" label="全部上课类型" :value="0"></el-option>
                        <el-option
                            v-for="item in listenTypeList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </template>
                <!-- <el-button size="medium" type="primary" @click="getStatistics"
                >统计
                </el-button
                > -->
                <a :href="exportUrl" download="导出" target="_blank">
                    <el-button
                        size="medium"
                        class="filter-item"
                        type="primary"
                        icon="upload"
                    >导出
                    </el-button
                    >
                </a>
            </div>
            <div class="listen_class_table_box">
                <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH"
                          v-if="showSideTable" key="2">
                    <el-table-column align="center" label="听课人">
                        <template slot-scope="scope">
                            <span class="link-type" @click="jumpToPage('listenClassDetailTeacher', {id: scope.row.id})">{{ scope.row.listenerName || scope.row.createUserName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="听课日期" prop="createDate"></el-table-column>
                    <el-table-column align="center" label="听课学校" prop="schoolName"
                                     show-overflow-tooltip></el-table-column>

                    <el-table-column align="center" label="上课老师" prop="teacherName"></el-table-column>
                    <el-table-column align="center" label="照片" width="100px">
                        <template slot-scope="scope">
              <span v-if="scope.row.photoJson && scope.row.photoJson.length>2" class="link-type">
                <image-previewer :images="getViewPic(JSON.parse(scope.row.photoJson))" tag="img"
                                 text="预览"></image-previewer>
              </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="听课评价" prop="evaluate">
                        <template slot-scope="scope">
                            <span>{{scope.row.appraiseName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="评价内容" prop="appraiseContent"
                                     show-overflow-tooltip></el-table-column>
                      <el-table-column align="center" label="数据来源">
                                <template slot-scope="scope">
                                    <span>{{scope.row.fromType==2?"青蓝同辉":"听课记录"}}</span>
                                </template>
                            </el-table-column>
                </el-table>

                <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH"
                          v-else key="1">
                    <el-table-column align="center" label="听课人">
                        <template slot-scope="scope">
                            <span class="link-type" @click="jumpToPage('listenClassDetailTeacher', {id: scope.row.id})">{{ scope.row.listenerName || scope.row.createUserName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="听课班级/课程">
                        <template slot-scope="scope">
                            <span>{{ scope.row.className }}&nbsp;&nbsp;{{ scope.row.subjectName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="听课时间">
                        <template slot-scope="scope">
                            <span>{{ scope.row.listenDate | formatTime }}&nbsp;&nbsp;{{ scope.row.classNoName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="上课老师" prop="teacherName"></el-table-column>
                    <el-table-column align="center" label="上课主题" prop="title" show-overflow-tooltip></el-table-column>
                    <el-table-column v-if="listenTypeList && listenTypeList.length !== 0 && addressType === 1"
                                     align="center" label="上课类型" prop="recordTypeName"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="随堂照片" width="100px">
                        <template slot-scope="scope">
              <span v-if="scope.row.picList && scope.row.picList.length" class="link-type">
                <image-previewer :images="getViewPic(scope.row.picList)" tag="img" text="预览"></image-previewer>
              </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="听课评价" prop="evaluate">
                        <template slot-scope="scope">
                            <span v-if="scope.row.starAppraise == 0">{{ evaluateNameList[scope.row.evaluate - 1] }}</span>
                            <span v-else>{{ scope.row.appraiseScore }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="评价内容" prop="record" show-overflow-tooltip></el-table-column>
                     <el-table-column align="center" label="数据来源">
                                <template slot-scope="scope">
                                    <span>{{scope.row.fromType==2?"青蓝同辉":"听课记录"}}</span>
                                </template>
                            </el-table-column>
                </el-table>
                <div class="pagination-container" style="margin-top: 12px">
                    <el-pagination
                        @size-change="sizeChangeHandler"
                        @current-change="currentChangeHandler"
                        :current-page.sync="pagination.pageNo"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size.sync="pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool'
    import mixins from '@/mixins/windowResize'
    import {getSchoolDicByCode} from '@/utils/utils'
    import {getClassRecordList, listByModelAndPage} from '@/api/listenClass'
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";
    export default {
        name: 'listenClassDetail',
        components: {
            Backtool,
            ImagePreviewer,TermGradeClassSelector
        },
        data() {
            return {
                 queryArgs: {
        all: true, //所有班级年级
        manager: true, //班主任
        notlimit: true, //所有班级年级
        submanager: true, //副班主任
        teacher: true //普通所交
      },  
      obj: {
        termId: "",
        duration: ["", ""],
        gradeId: "",
        classId: ""
      },
                showSideTable: false,
                addressType: 1,
                typeList: [
                    {
                        value: 1,
                        label: '校内听课'
                    }, {
                        value: 2,
                        label: '校外听课'
                    }
                ],
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null,
                },
                dataList: [],
                evaluateNameList: ['优', '良', '中', '合格', '不合格'],
                activeName: 'detailAccounting',
                recordTypeId: 0,
                listenTypeList: [],
                noRecordType: false,
            }
        },
        mixins: [mixins],
        computed: {
            exportUrl() {
                if (this.obj.duration && this.obj.duration.length && this.obj.duration[0]) {
                    let start = ''
                    let end = ''
                    if (this.obj.duration[0] && this.obj.duration[0].length) {
                        start = this.obj.duration[0]
                        end = this.obj.duration[1]
                    } else {
                        start = this.getStrDate(this.obj.duration[0])
                        end = this.getStrDate(this.obj.duration[1])
                    }
                    if (this.showSideTable) {
                        return `${global.BasePath}structure/listenClassRecordSide/exportListByModel?startDate=${start}&endDate=${end}&token=${this.$store.getters.token}`
                    } else {
                        return `${global.BasePath}structure/listenClassRecord/exportClassRecordList?startDate=${start}&endDate=${end}&recordTypeId=${this.noRecordType ? '-1' : this.recordTypeId}&gradeId=${this.obj.gradeId}&token=${this.$store.getters.token}`
                    }
                } else {
                    return ''
                }
            }
        },
        filters: {
            formatTime(date) {
                if (date) {
                    return date.substring(0, 10)
                }
                return '--'
            },
        },
        created() {
            this.obj.duration = [
                this.getCurrentMonthDay(this.getDate(0)),
                this.getDate(0),
            ] // 列表日期
            this.getStatistics()
            getSchoolDicByCode('openClassType').then((list) => {
                this.listenTypeList = list
                this.noRecordType = !list || list.length === 0
            })
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            tabsfun() {
                if (this.activeName === 'listenAccounting') {
                    this.$router.replace({
                        path: 'statistics',
                    })
                } else if (this.activeName === 'listenedAccounting') {
                    this.$router.replace({
                        path: 'thStatistics',
                    })
                }
            },
            getCurrentMonthDay(date) {
                if (date) {
                    return date.substring(0, 8) + '01'
                }
                return ''
            },
            indexChange() {
                this.$router.replace({path: 'statistics'})
            },
            indexThChange() {
                this.$router.replace({path: 'thStatistics'})
            },
            getStatistics() {
                let start = ''
                let end = ''
                if (this.obj.duration && this.obj.duration.length && this.obj.duration[0]) {
                    if (this.obj.duration[0] && this.obj.duration[0].length) {
                        start = this.obj.duration[0]
                        end = this.obj.duration[1]
                    } else {
                        start = this.getStrDate(this.obj.duration[0])
                        end = this.getStrDate(this.obj.duration[1])
                    }
                } else {
                    this.$message({
                        message: '请选择日期范围！',
                        type: 'warning',
                    })
                }

                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    endDate: end,
                    startDate: start,
                    recordTypeId: this.recordTypeId,
                    gradeId:this.obj.gradeId
                }
                if (this.addressType === 2) {
                    this.showSideTable = true;
                    this.listByModelAndPage(query)
                } else {
                    this.showSideTable = false;
                    this.getClassRecordList(query)
                }
            },
            getClassRecordList(query) {
                getClassRecordList(query).then((res) => {
                    const data = res.data
                    if (res.data.code === 200) {
                        this.dataList = data.data.dataList
                        this.pagination.total = data.data.pagination.total
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning',
                        })
                    }
                }).catch()
            },
            listByModelAndPage(query) {
                listByModelAndPage(query).then((res) => {
                    const data = res.data
                    if (res.data.code === 200) {
                        this.dataList = data.data.dataList
                        this.pagination.total = data.data.pagination.total
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning',
                        })
                    }
                }).catch()
            },
            getDate(n) {
                const data = new Date()
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n)
                let localDateStr =
                    data.getFullYear() +
                    '-' +
                    this.fillZero(data.getMonth() + 1) +
                    '-' +
                    this.fillZero(data.getDate())
                return localDateStr
            },
            getStrDate(data) {
                let strDate =
                    data.getFullYear() +
                    '-' +
                    this.fillZero(data.getMonth() + 1) +
                    '-' +
                    this.fillZero(data.getDate())
                return strDate
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n
            },
            sizeChangeHandler() {
                this.getStatistics()
            },
            currentChangeHandler() {
                this.getStatistics()
            },
            getViewPic(picList) {
                if (picList) {
                    return picList.map(function (item) {
                        return {src: item.picUrl}
                    })
                }
                return []
            },
        },
    }
</script>

<style lang="scss" scoped>
    .page {
        padding: 10px;
    }

    .listen_class_wrap {
        .header {
            padding: 12px;

            .statistics_title {
                display: flex;
                margin: 0;

                .btn_group {
                    flex: 1;
                    text-align: center;

                    .btn {
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid #ccc;
                        border-left-width: 0;
                        color: #333;
                        cursor: pointer;
                    }

                    .btn_selected {
                        color: #fff;
                        background: #409eff;
                        border: 1px solid #409eff;
                    }
                }

                .btn_group:first-child {
                    .btn {
                        border-radius: 4px 0 0 4px;
                        border-left-width: 1px;
                    }
                }

                .btn_group:last-child {
                    .btn {
                        border-radius: 0 4px 4px 0;
                    }
                }
            }

            .listen_date {
                margin-top: 10px;
                margin-right: 10px;
                margin-left: 80px;
            }
        }
    }
    .link-type{
        color: #409EFF;
        cursor:pointer;
    }
</style>
