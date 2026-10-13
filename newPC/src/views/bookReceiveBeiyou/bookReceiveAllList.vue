<template>
    <div class="stack-room-wrap">
        <el-tabs v-model="activeName" type="border-card" @tab-click="clickTab">
            <el-tab-pane label="图书领用" name="bookReceiveList">

            </el-tab-pane>
            <el-tab-pane label="领用记录" name="bookReceiveAllList">
                <div class="header">
                    <el-row>
                        <el-col :span="19">
                            <el-date-picker
                                v-model="duration"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                size="medium"
                                type="daterange" class="mywidthdaterange"
                                range-separator="-"
                                @change="getList"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <el-select v-model="typeId" size="medium" @change="getList" placeholder="请选择班级">
                                <el-option label="全部班级" value="0"></el-option>
                                <el-option
                                    v-for="item in typeList"
                                    :key="item.id"
                                    :label="item.typeName"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <a :href="exportUrl" target="_blank" download="导出结果" v-if="dataList.length">
                                <el-button type="primary" size="medium">导出</el-button>
                            </a>
                        </el-col>
                        <el-col :span="5">
                            <el-input size="medium" class="search-input" placeholder="请输入领用人姓名/名称"
                                      v-model.trim="searchName" @change="getList">
                                <el-button size="medium" slot="append" icon="el-icon-search"
                                           @click="getList"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
                <el-table stripe :data="dataList" border :height="notbmaxH - 125" style="width: 100%" id="outTable">
                    <el-table-column align="center" prop="typeName" label="类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="领用人" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.createName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="ownerName" label="持有人" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.receiveType == 1 ? '个人' : scope.row.className}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="bookName" label="名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="bookCount" label="数量" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="单价（元）" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.bookPrice / 100}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="总价（元）" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.totalPrice / 100}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="receiveDate" label="购买/领取日期" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="stuName" label="照片" show-overflow-tooltip>
                        <template slot-scope="scope">
                             <span v-if="scope.row.pic && scope.row.pic.length>0" class="link-type">
                                <image-previewer
                                    :images="scope.row.pic"
                                    tag="img"
                                    text="预览"
                                >
                                </image-previewer>
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button size="small" type="text"
                                       @click="jumpToPage('bookReceiveAddEdit', {id: scope.row.id})">编辑
                            </el-button>
                            <el-button size="small" type="text danger" @click="deleteHandler(scope.row.id)" class="buttontextred">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="pcQueryManageBookReceiveRecordFunc"
                    @current-change="pcQueryManageBookReceiveRecordFunc"
                    :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                    :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="汇总统计" name="bookReceiveSummary"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import moment from 'moment';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    import {
        pcQueryManageBookReceiveRecord,
        getManageBookType,
        deleteBookReceiveRecord
    } from '@/api/bookReceiveBeiyou';

    export default {
        name: "bookReceiveAllList",
        mixins: [mixins, baseMixin],
        components: {ImagePreviewer},
        data() {
            return {
                activeName: 'bookReceiveAllList',
                duration: [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                typeId: '0',
                searchName: '',
                typeList: [],
                dataList: []
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/bookReceive/downManageBookReceiveRecord?endDate=${this.duration[1]}&startDate=${this.duration[0]}&typeId=${this.typeId}&searchName=${this.searchName}&token=${this.$store.getters.token}`
            }
        },
        mounted() {
            getManageBookType()
                .then(res => res.data)
                .then(data => {
                    this.typeList = data.data;
                });
            this.pcQueryManageBookReceiveRecordFunc();
        },
        methods: {
            pcQueryManageBookReceiveRecordFunc() {
                pcQueryManageBookReceiveRecord({
                    startDate: this.duration[0],
                    endDate: this.duration[1],
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName,
                    typeId: this.typeId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        data.data.dataList.forEach(item => {
                            item.pic = JSON.parse(item.picJson).map(item => ({
                                src: item
                            }));
                        });
                        this.dataList = data.data.dataList;
                    });
            },
            // 点击tab
            clickTab() {
                this.$router.replace({path: this.activeName})

            },
            getList() {
                this.pagination.pageNo = 1;
                this.pcQueryManageBookReceiveRecordFunc();
            },
            deleteHandler(id) {
                this.$confirm('是否确定要删除该领用记录', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        deleteBookReceiveRecord({id})
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('删除成功');
                                    this.pcQueryManageBookReceiveRecordFunc();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    });
            }
        }
    }
</script>

<style scoped>
    .stack-room-wrap {
       padding:12px;
    }


    .header {
        padding-bottom: 10px;
    }
</style>
