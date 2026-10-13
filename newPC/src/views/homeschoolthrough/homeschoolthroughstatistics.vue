<template>
    <div class="homeschoolthroughstatistics">
        <div class="top">
            <el-col :span="24">
                <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="medium"
                    @change="findGateInfoLists()"
                    :clearable="false"
                >
                </el-date-picker>
                <el-select class="filter-item" v-model="query.classId" @change="findGateInfoLists()" size="medium">
                    <el-option :label="item.name" :value="item.id" :key="index"
                               v-for="(item,index) in classlist"></el-option>
                </el-select>
                 <a :href="downLoadHref" target="_blank" v-if="dateList.length" download="examName"><el-button size="medium" type="primary" >导出</el-button></a>
                <el-input class="search-input search-input--right"
                          placeholder="姓名" icon="el-icon-search" size="medium" @change="findGateInfoLists"
                          v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search" size="medium" @click="findGateInfoLists"></el-button>
                </el-input>
            </el-col>

        </div>
        <div class="time-table">
            <el-table stripe :data="dateList" border fit highlight-current-row   style="width: 100%" :height="maxH">
                <el-table-column align="center" label="学生" >
                    <template slot-scope="scope">
                        <span>{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" >
                    <template slot-scope="scope">
                        <span>{{scope.row.className	}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="家长志愿服务累计时长（小时）" >
                    <template slot-scope="scope">
                        <span>{{scope.row.voluntaryDuration	}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="家长培训累计时长（小时）" >
                    <template slot-scope="scope">
                        <span>{{scope.row.trainDuration	}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="社会实践累计次数" >
                    <template slot-scope="scope">
                        <span>{{scope.row.socialCount}}</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination  @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import { querySchoolClass,queryApplyAnalysis} from '@/api/homeschoolthrough';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "homeschoolthroughstatistics",
        data: function () {
            return {
                daterange: [new Date(), new Date()],
                dateList: [],//表格主题数据
                total: null,
                query: {
                    startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                    endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                    pageNo: 1, //页数
                    pageSize: 20,//条数
                    searchName: '',
                    classId: 0
                },
                downLoadHref:'',
                classlist: [{name: '全部班级', id: 0}]
            };
        },
        mixins: [mixin],
        //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
           this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
           querySchoolClass().then(res => res.data)
                        .then(data => {
                            for (let i = 0; i < data.data.length; i++) {
                                this.classlist.push(data.data[i])
                            }
                        });
            this.findGateInfoLists()
        },
        methods: {  
            //切换页码
                sizeChangeHandler(pageSize) {
                this.query.pageNo = 1;
                this.query.pageSize = pageSize;
                this.findGateInfoLists();
                },
                //切换页数
                currentChangeHandler(pageNo) {
                this.query.pageNo = pageNo;
                this.findGateInfoLists();
                },         
            findGateInfoLists() {
                this.dateList = [];
                this.total = null;
                this.query.startDate = this.$moment(this.daterange[0]).format("YYYY-MM-DD"); //时间
                this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
                this.downLoadHref =
                                global.BasePath +
                                "structure/activitiesApply/downApplyAnalysis?endDate=" +
                                this.query.endDate +
                                "&startDate=" +
                                this.query.startDate+
                                "&classId=" +
                                this.query.classId+
                                "&searchName=" +
                                this.query.searchName+
                                "&token=" +
                                this.$store.getters.token;
                queryApplyAnalysis(this.query).then(res => {
                    let data = res.data.data;
                    this.dateList = data.dataList;
                    this.total = data.pagination.total;
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
.homeschoolthroughstatistics {
   padding:12px;
  .top {
    padding-bottom: 10px;
    overflow:auto;
  }
}
</style>
