<template>
    <div id="noticeCount" class="app-container noticeCount">
        <div class="head-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" size="medium" @click="$router.back()" v-if="isStandalone">返回</el-button>
                    <el-date-picker ref="date" size="medium"  v-model="date" type="daterange"  class="mywidthdaterange filter-item"
                                    :editable="false"
                                    :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                                    :picker-options="shortcutOptions" @change="dateChange">
                    </el-date-picker>
                    <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
                    <a :href="exportUrl" download="阅读率统计" target="_blank" v-if="countList.length">
                        <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                    </a>
                   <span v-if="!$store.getters.schoolInfo.accessDate||isMoreThanOneYearAgo($store.getters.schoolInfo.accessDate)" class="important-hint">超过一年的数据已归档</span>

                </el-col>
                <el-col :span="5">
                    <el-input
                        placeholder="姓名" icon="el-icon-search" size="medium" @keyup.enter.native="handleFilter"
                        v-model="listQuery.teacherName">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="countList" v-loading.body="listLoading" border style="width: 100%"
                  :height="`${nobottommaxH}px`">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.releaseUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所在部门" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发送通知数">
                <template slot-scope="scope">
                    <span>{{scope.row.publishCount}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {getNoticePublishCount} from '@/api/notice';
    import mixin from '@/mixins/windowResize';
    import {pickerOptions} from '@/utils';
    import moment from 'moment';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                cutH: 170,
                listQuery: {
                    beginTime: '',
                    endTime: '',
                    teacherName: ''
                },
                date: [],
                listLoading: false,
                countList: [],
                shortcutOptions: {
                    shortcuts: pickerOptions
                },
                exportUrl: '',
            }
        },
        created() {
            this.getNoticePublishCountFunc()
                .then(() => {
                    this.exportUrl = `${global.BasePath}structure/notice/downloadPublishCount?token=${this.$store.getters.token}&beginTime=${moment(this.listQuery.beginTime).format('YYYY-MM-DD')}&endTime==${moment(this.listQuery.endTime).format('YYYY-MM-DD')}`
                });
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        mixins: [mixin],
        methods: {
              isMoreThanOneYearAgo(dateString) {
                 if(dateString){
                        const date = moment(dateString);
                        const now = moment();
                        return date.isBefore(now.subtract(1, 'years'));
                 }                
            },
            handleFilter() {
                if (this.date) {
                    this.listQuery.beginTime = this.$moment(this.date[0]).format('YYYY-MM-DD');
                    this.listQuery.endTime = this.$moment(this.date[1]).format('YYYY-MM-DD');
                } else {
                    this.listQuery.beginTime = '';
                    this.listQuery.endTime = '';
                }
                this.getNoticePublishCountFunc()

            },
            dateChange(val) {
                this.date = [val[0], val[1]];
                this.exportUrl = `${global.BasePath}structure/notice/downloadPublishCount?token=${this.$store.getters.token}&beginTime=${moment(this.date[0]).format('YYYY-MM-DD')}&endTime==${moment(this.date[1]).format('YYYY-MM-DD')}`
                this.handleFilter();
            },
            getNoticePublishCountFunc() {
                this.listLoading = true;
                return getNoticePublishCount(this.listQuery).then(res => res.data)
                    .then(data => {
                        if (data.code == 200) {
                            this.countList = data.data.dataList;
                           
                            if(!this.listQuery.endTime){
                              if((moment(data.beginTime).format('YYYY-MM-DD')+"")>(moment(data.endTime).format('YYYY-MM-DD')+"")){
                                this.date = [moment(data.endTime).format('YYYY-MM-DD'),moment(data.beginTime).format('YYYY-MM-DD')];
                                    this.listQuery.beginTime = data.endTime;
                                    this.listQuery.endTime = data.beginTime;
                                }else{
                                this.date = [moment(data.beginTime).format('YYYY-MM-DD'), moment(data.endTime).format('YYYY-MM-DD')];
                                    this.listQuery.beginTime = data.beginTime;
                                    this.listQuery.endTime = data.endTime;
                                } 
                            }
                            
                            this.listLoading = false;
                        }
                    }).catch(err => {
                        this.listLoading = false;
                    })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .head-container {
        padding-bottom: 10px;
    }
</style>
