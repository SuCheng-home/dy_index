<template>
    <div class="page">
        <div class="page-header">
             <el-button size="medium" @click.native="$router.back()">返回</el-button>            
            <el-button type="primary" size="medium" @click="arrangeadd(0,1)">新增</el-button>
            <import-file :config="importConf" @success="getWatchStationInitListWeek"></import-file>
            <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `值班安排.xlsx`)"   v-if="dataList.length>0">导出</el-button>
        </div>
        <div class="page-main" id="outTable">
            
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="nobottommaxH">
                <el-table-column align="center" label="岗位名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="item.weekNamer" v-for="(item,index) in weekList" :key="item.weekNumber">
                    <template slot-scope="scope">
                        <div class="box">
                             <div v-if="scope.row.stationInitlList[index]">
                            {{scope.row.stationInitlList[index].teacherUserNames}}
                        </div>
                         <div v-if="scope.row.stationInitlList[index]">
                            {{scope.row.stationInitlList[index].startTime}}-{{scope.row.stationInitlList[index].endTime}}
                        </div>
                         <div v-if="scope.row.stationInitlList[index]">
                            {{scope.row.stationInitlList[index].classHourCount-0}}课时
                            <i class="el-icon-edit" @click="arrangeadd(scope.row.stationInitlList[index].id,scope.row.stationInitlList[index].watchType)" style="color:#409EFF"></i>
                            <i class="el-icon-delete" @click="delWatchStationInit(scope.row.stationInitlList[index].id)" style="color:red"></i>
                        </div>
                        </div>                       
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import ImportFile from '@/components/ImportFile'
    import {getSchoolTimeAllList} from "@/api/schedule";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {getWatchStationInitListWeek,delWatchStationInit} from '@/api/dutyArrangement';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                dataList:[],
                weekList:[],
                query: {
                    groupId: this.$route.query.groupId
                },
                 importConf: {
                    btnName: '导入',
                    title: '值班人员导入',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/zhibantemplatetwo.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/watch/importWatchStationInit',
                    uploadArgs: {
                         groupId: this.$route.query.groupId,
                         watchType:1
                    },
                    errUrl: 'structure/watch/downloadStationInitResultXls',
                    lingjie:1,
                    name:'file'
                },
                exportUrl: '',
            }
        },
        components: {
          ImportFile
        },
        mixins: [baseMixin, mixin],
        created() {
           this.getWatchStationInitListWeek();
        },
        methods: {
            
              delWatchStationInit(id) {
                let _this = this;
                this.$confirm('确认删除值班安排？', '提示', {
                    type: 'error'
                }).then(() => {
                    delWatchStationInit(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getWatchStationInitListWeek();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
             arrangeadd(id,watchType){
                    this.$router.push({
                                path: 'arrangeadd',
                                query:{
                                    groupId: this.$route.query.groupId,
                                    watchType: watchType,
                                    id:id,
                                }
                            });
                },
            getWatchStationInitListWeek() {
                this.exportUrl = `${global.BasePath}structure/watch/exportStationInitXls?groupId=${this.query.groupId}&token=${this.$store.getters.token}`;
                getWatchStationInitListWeek(this.query.groupId)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.stationList;
                        this.weekList = data.data.weekList;
                    })
            }
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .page-header {
        padding-bottom: 10px;
    }
    .box{
        cursor:pointer;
    }
    .box i{
        opacity: 0;
        
    }
    .box:hover i{
          opacity: 1;
    }
</style>
