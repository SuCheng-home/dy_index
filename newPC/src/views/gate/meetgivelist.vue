<template>
    <div class="meetgivelist">
        <div class="top">
            <el-col :span="24">
                <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="findGateInfoLists()"
                    :clearable="false"
                >
                </el-date-picker>
                <el-select class="filter-item" v-model="query.classId" @change="findGateInfoLists()">
                    <el-option :label="item.name" :value="item.id" :key="index"
                               v-for="(item,index) in classlist"></el-option>
                </el-select>
                 <a :href="downLoadHref" v-if="dateList.length>0" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>
                <el-input class="search-input search-input--right"
                          placeholder="姓名" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                          v-model.trim="query.stuNameOrTransferName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>

        </div>
        <div class="time-table">
            <el-table stripe :data="dateList" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%" :height="maxH">
                <el-table-column align="center" label="学生姓名" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{scope.row.className	}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="入校">
                    <el-table-column label="入校时间" min-width="180px">
                        <template slot-scope="scope"><span
                            v-if="scope.row.inModel!={}">{{scope.row.inModel.transferTime}}</span></template>
                    </el-table-column>
                    <el-table-column label="接送人" min-width="80px">
                        <template slot-scope="scope"><span v-if="scope.row.inModel!={}">{{scope.row.inModel.userName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="图片" min-width="80px">
                        <template slot-scope="scope">
                            <image-previewer tag="richtext"><span class="img" v-if="scope.row.inModel!={}"><img
                                :src="scope.row.inModel.picture"> </span></image-previewer>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="离校">
                    <el-table-column label="离校时间" min-width="180px">
                        <template slot-scope="scope"><span
                            v-if="scope.row.outModel!={}">{{scope.row.outModel.transferTime}}</span></template>
                    </el-table-column>
                    <el-table-column label="接送人" min-width="80px">
                        <template slot-scope="scope"><span
                            v-if="scope.row.outModel!={}">{{scope.row.outModel.userName}}</span></template>
                    </el-table-column>
                    <el-table-column label="图片" min-width="80px">
                        <template slot-scope="scope">
                            <image-previewer tag="richtext" v-if="scope.row.outModel!={}"><span class="img"><img
                                :src="scope.row.outModel.picture"> </span></image-previewer>
                        </template>
                    </el-table-column>
                </el-table-column>

            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import {findStuTransferRecordList, queryClass, possessRole, querySchoolClass} from '@/api/gate';
    import _ from 'lodash';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';

    export default {
        name: "meetgivelist",
        data: function () {
            return {
                daterange: [new Date(), new Date()],
                listLoading: false,
                dateList: [],//表格主题数据
                total: null,
                query: {
                    startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                    endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                    pageNo: 1, //页数
                    pageSize: 20,//条数
                    stuNameOrTransferName: '',
                    classId: 0
                },
                downLoadHref:'',
                classlist: [{name: '全部班级', id: 0}]
            };
        },
        components: {ImagePreviewer},
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            //获取所教班级
            possessRole('2').then(res => {
                if (res.data.data.result) {
                    querySchoolClass().then(res => res.data)
                        .then(data => {
                            for (let i = 0; i < data.data.length; i++) {
                                this.classlist.push(data.data[i])
                            }
                        });
                } else {
                    queryClass()
                        .then(res => res.data)
                        .then(data => {
                            for (let i = 0; i < data.data.length; i++) {
                                this.classlist.push(data.data[i])
                            }
                        });
                }
            });

            this.findGateInfoLists()
        },
        methods: {
            handleInputChange: _.debounce(
                function () {
                    this.findGateInfoLists();
                },
                // 这是我们为用户停止输入等待的毫秒数
                1000
            ),
            findGateInfoLists() {
                this.dateList = [];
                this.total = null;
                this.query.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.downLoadHref =
                                global.BasePath +
                                "structure/stuTransfer/exportStuTransferRecordList?endDate=" +
                                this.query.endDate +
                                "&startDate=" +
                                this.query.startDate+
                                "&classId=" +
                                this.query.classId+
                                "&stuNameOrTransferName=" +
                                this.query.stuNameOrTransferName+
                                "&token=" +
                                this.$store.getters.token;
                findStuTransferRecordList(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            },

            handleSizeChange(val) {
                this.query.pageSize = val;
                this.findGateInfoLists();
            },
            handleCurrentChange(val) {
                this.query.pageNo = val;
                this.findGateInfoLists();
            }

        }
    };
</script>
<style scoped>
    .meetgivelist {
        padding: 20px 15px;
    }

    .meetgivelist .top {
        border-bottom: 1px solid #e7eaec;
        height: 56px;
    }

    .meetgivelist .img img {
        height: 30px;
    }
</style>
