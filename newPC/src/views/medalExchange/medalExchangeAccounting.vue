<template>
    <div class="homeschoolthroughapproveindex">
        <div class="top">
            <el-col :span="24">
                <el-button size="medium" type="default" @click="$router.back()">返回</el-button>
                <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="medium"
                    @change="getList()"
                    :clearable="false" style="width:240px"
                >
                </el-date-picker>
                <el-select class="filter-item" v-model="query.classId" @change="onClassIdChange" size="medium"
                           style="width:130px">
                    <el-option label="全部班级" :value="0" :key="0"></el-option>

                    <el-option :label="item.name" :value="item.id" :key="index"
                               v-for="(item,index) in classlist"></el-option>
                </el-select>
                <a :href="exportUrl" target="_blank" download="examName">
                    <el-button size="medium" type="primary">导出</el-button>
                </a>
                <el-input class="search-input search-input--right"
                          placeholder="请输入姓名" icon="el-icon-search" size="medium" @change="getList"
                          v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search" size="medium" @click="getList"></el-button>
                </el-input>
            </el-col>

        </div>
        <div class="time-table">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级">
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="兑换次数">
                    <template slot-scope="scope">
                        <span>{{scope.row.exchangeCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="兑换数量">
                    <template slot-scope="scope">
                        <span>{{scope.row.cardCount }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {querySchoolClass} from '@/api/common/common';
    import {
        insertMedalExchangeRecord,
        deleteMedalExchangeRecord,
        queryMedalExchangeAnalysis
    } from '@/api/medalExhange';
    import mixin from '@/mixins/windowResize';

    export default {
        data: function () {
            const medalValidator = (rule, value, callback) => {
                if (this.medalList.every(item => item.cardCount == 0)) {
                    return callback(new Error('至少兑换一个！'));
                } else {
                    callback();
                }
            };
            return {
                daterange: [this.$route.query.startDate, this.$route.query.endDate],
                dataList: [],//表格主题数据
                total: null,
                query: {
                    startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                    endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                    pageNo: 1, //页数
                    pageSize: 20,//条数
                    searchName: '',
                    classId: parseInt(this.$route.query.classId),
                },
                classlist: [],

            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            querySchoolClass().then(res => res.data)
                .then(data => {
                    for (let i = 0; i < data.data.length; i++) {
                        this.classlist.push(data.data[i])
                    }
                });
            this.getList()
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/medalExchange/downMedalExchangeAnalysis?classId=${this.query.classId}&token=${this.$store.getters.token}&startDate=${this.daterange[0] || ''}&endDate=${this.daterange[1] || ''}`
            }
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            exchangeConfirmFunc() {
                this.$refs.exchangeForm.validate(isValid => {
                    if (isValid) {
                        let cardCount = 0;
                        const relativeList = [];
                        this.medalList.forEach(item => {
                            if (item.cardCount != 0) {
                                cardCount += item.cardCount;
                                relativeList.push({
                                    cardCode: item.code,
                                    cardCount: item.cardCount,
                                    cardName: item.value
                                });
                            }
                        });
                        insertMedalExchangeRecord({
                            relativeList,
                            cardCount,
                            stuId: this.exchangeForm.stuId
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('新增成功');
                                    this.isShowExchangeDialog = false;
                                    this.getList();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            onClassIdChange() {
                this.getList();
            },
            exchangeFunc() {
                this.exchangeForm = {
                    stuId: ''
                };
                const medalList = JSON.parse(JSON.stringify(this.medalList));
                medalList.forEach(item => {
                    item.cardCount = 0;
                })
                this.medalList = medalList;
                this.isShowExchangeDialog = true;
            },
            //删除
            deleteFunc(id) {
                this.$confirm('是否删除该兑换?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteMedalExchangeRecord(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    }).catch();

                }).catch(() => {
                });
            },
            //切换页码
            sizeChangeHandler(pageSize) {
                this.query.pageNo = 1;
                this.query.pageSize = pageSize;
                this.getList();
            },
            //切换页数
            currentChangeHandler(pageNo) {
                this.query.pageNo = pageNo;
                this.getList();
            },
            getList() {
                this.query = {
                    startDate: this.daterange[0] || '', //开始时间
                    endDate: this.daterange[1] || '', //结束时间
                    pageNo: this.query.pageNo, //页数
                    pageSize: this.query.pageSize,//条数
                    searchName: this.query.searchName,
                    classId: this.query.classId,
                }
                queryMedalExchangeAnalysis(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    })
            }
        }
    };
</script>
<style lang="scss" scoped>
    .homeschoolthroughapproveindex {
        padding: 12px;

        .top {
            padding-bottom: 10px;
            overflow: auto;
        }

        .link {
            color: #409eff;
            cursor: pointer;
        }
    }
</style>
