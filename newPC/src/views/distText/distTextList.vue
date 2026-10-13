<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
        <!-- <el-input size="medium" style="width: 210px;" placeholder="请输入公文名称" @input="handleSearch"
                           v-model="docTitle">
        </el-input> -->
            <el-date-picker
                size="medium"
                v-model="duration"
                type="daterange" class="mywidthdaterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
              <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入公文名称" icon="search" size="medium" @change="handleSearch()"
                          v-model.trim="docTitle">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column label="阅读状态">
                <template slot-scope="scope">
                    <el-tag  size="mini"  v-if="scope.row.isRead == 2" type="success">已读</el-tag>
                    <el-tag  size="mini"  v-else type="danger">未读</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="公文名称" >
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('distTextDetail', {id: scope.row.id, isForward: scope.row.isForward})">
                        {{scope.row.docTitle}}
                        <el-tag  size="mini" v-if="scope.row.isForward == 1" >转</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="发送时间">
                <template slot-scope="scope">
                    <span>{{scope.row.sendTime | secondFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送人">
                <template slot-scope="scope">
                    <span>{{scope.row.sendUser}}({{scope.row.sendDepart}})</span>
                </template>
            </el-table-column>
            <el-table-column label="转发本校阅读数" >
                <template slot-scope="scope">
                 <span class="link-type"
                       @click="jumpToPage('distTextReadInfo', {id: scope.row.id})">{{scope.row.readCount}}/{{scope.row.schoolCount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="转发校外阅读数" >
                <template slot-scope="scope">
                 <span class="link-type"
                       @click="jumpToPage('distTextReadInfo', {id: scope.row.id, isBranch: 1})">{{scope.row.branchReadCount}}/{{scope.row.branchSchoolCount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click.native="jumpToPage('distTextDetail', {id: scope.row.id, isForward: scope.row.isForward})">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {mapGetters} from 'vuex';
    import {getSchoolReceiveEduBureauDocumentPageList} from '@/api/distText'

    export default {
        data() {
            const validateBufaData = (rule, value, callback) => {
                if ((!value.departJson || value.departJson.length === 0) &&
                    (!value.userJson || value.userJson.length === 0) &&
                    (!value.schoolJson || value.schoolJson.length === 0)) {
                    return callback(new Error('请选择补发人或单位'));
                } else {
                    return callback()
                }
            };
            return {
                dataList: [],
                configData: {
                    title: '请选择发布学校',
                    depart: {target: 'all', departType: 'all', userTypes: '1,3'},
                    group: false,
                },
                docTitle: '',
                duration: [],
                isShowBufaDialog: false,

                cutH: 190,
            }
        },
        watch: {
            duration() {
                this.handleSearch();
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.isStandalone ? this.pagination.pageSize = 10 : this.pagination.pageSize = 20;
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {
            secondFilter(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            handleSearch() {
                this.pagination.pageNo = 1;
                this.docTitle = this.docTitle.trim();
                this.getList();
            },
            getList() {
                const [searchBeginDate, searchEndDate] = this.duration || [];

                getSchoolReceiveEduBureauDocumentPageList({
                    docTitle: this.docTitle,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchBeginDate: searchBeginDate || '',
                    searchEndDate: searchEndDate || ''
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.pagination.pageNo = val;
                this.getList();
            },
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }

</style>
