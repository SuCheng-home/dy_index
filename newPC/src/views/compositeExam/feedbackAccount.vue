<template>
    <div class="feed-back-account">
        <el-row style="padding-bottom: 10px">
            <el-col :span="19">
                <el-date-picker
                    size="medium"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    v-model="form.daterange"
                    @change="handleDateRange"
                ></el-date-picker>

                <el-select
                    class="el-select-short"
                    size="medium"
                    placeholder="请选择"
                    v-model="form.dutyId"
                    @change="handleDutyId"
                >
                    <el-option label="全部值班组" :value="0"></el-option>
                    <el-option
                        v-for="(item, idx) in dutyList"
                        :key="idx"
                        :label="item.dutyName"
                        :value="item.id"
                    ></el-option>
                </el-select>

                <a :href="exportUrl" target="_blank" download="examName" v-if="tabList.length">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
            </el-col>
            <el-col :span="5">
                <el-input
                    class="search-input"
                    icon="el-icon-search"
                    size="medium"
                    placeholder="请输入教师姓名"
                    clearable
                    v-model.trim="form.teacherName"
                    @change="handleContent"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="handleContent"
                    ></el-button>
                </el-input>
            </el-col>
        </el-row>

        <el-table
            border
            fit
            stripe
            highlight-current-row
            style="width: 100%"
            :height="nobottommaxH - 25"
            :data="tabList"
            v-loading.body="tabLoading"
        >
            <el-table-column align="center" label="检查项" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.itemName || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="反馈人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.createUserName || "--" }}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="反馈时间"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    {{ scope.row.createTime | filterDate }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="内容" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.content || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="图片">
                <template slot-scope="scope">
                    <div
                        style="color: #409eff"
                        v-if="scope.row.picList && scope.row.picList.length"
                    >
                        <image-previewer
                            :images="getViewPic(scope.row.picList)"
                            tag="img"
                            text="查看图片"
                        ></image-previewer>
                    </div>
                    <div v-else>--</div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
    </div>
</template>
<script>
    /* utils */
    import mixin from "@/mixins/windowResize";

    /* components */
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    /* api */
    import {
        findDutyBasehavingRecordList,
        findCheckEventListByPage,
        exportFindCheckEventList,
    } from "@/api/compositeExam";

    export default {
        mixins: [mixin],
        components: {
            ImagePreviewer,
        },
        filters: {
            filterDate(val) {
                return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
            },
        },
        computed: {},
        data() {
            return {
                // 值班组列表 { Array }
                dutyList: [],
                // 是否正在加载数据 { Boolean }
                tabLoading: false,
                // 表格数据 { Array }
                tabList: [],
                // 分页
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    pageSizes: [10, 20, 30, 50],
                    total: 0,
                },
                // 请求表单
                form: {
                    daterange: [
                        this.$moment().startOf("month").format("YYYY-MM-DD"),
                        this.$moment().format("YYYY-MM-DD"),
                    ],
                    dutyId: 0,
                    teacherName: "",
                },
            };
        },
        created() {
            this.findDutyBasehavingRecordList();
        },
        methods: {
            // 查询有问题反馈的值班组
            findDutyBasehavingRecordList() {
                findDutyBasehavingRecordList({
                    startDate: this.form.daterange[0],
                    endDate: this.form.daterange[1],
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        if (Array.isArray(data) && data.length) {
                            this.dutyList = [...data];
                        } else {
                            this.dutyList = [];
                        }
                        this.findCheckEventListByPage();
                    });
            },
            // 条件查询 问题 反馈列表(分页)
            findCheckEventListByPage() {
                let startDate = this.form.daterange ? this.form.daterange[0] : "";
                let endDate = this.form.daterange ? this.form.daterange[1] : "";
                findCheckEventListByPage({
                    dutyId: this.form.dutyId,
                    teacherName: this.form.teacherName,
                    startDate,
                    endDate,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        if (data) {
                            let {dataList, pagination} = data;
                            this.tabList = [...dataList];
                            this.pagination.total = pagination.total;

                            this.exportUrl = `${global.BasePath}structure/compositeNew/exportFindCheckEventList?startDate=${startDate}&endDate=${endDate}&teacherName=${this.form.teacherName}&dutyId=${this.form.dutyId}&token=${this.$store.getters.token}`;
                        }
                    });
            },
            // 检索条件 改变
            filterSearch() {
                this.pagination.pageNo = 1;
                this.findCheckEventListByPage();
            },
            // 输入框改变
            handleContent() {
                this.filterSearch();
            },
            // dutyId 改变
            handleDutyId(val) {
                this.filterSearch();
            },
            // 日期范围改变
            handleDateRange() {
                this.pagination.pageNo = 1;
                this.form.dutyId = 0;
                this.findDutyBasehavingRecordList();
            },
            // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.findCheckEventListByPage();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.findCheckEventListByPage();
            },
            getViewPic(picList) {
                if (picList) {
                    return picList.map((item) => ({src: item.picUrl}));
                }
                return [];
            },
        },
    };
</script>
<style lang="scss" scoped>
    .feed-back-account {
        padding: 12px;
    }
</style>
