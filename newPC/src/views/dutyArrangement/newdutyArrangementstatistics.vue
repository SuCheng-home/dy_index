<template>
    <div class="page">
        <div class="page-header">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="handleSizeChange()"></el-date-picker>
            <el-select v-model="query.groupId" style="width: 140px;" @change="handleSizeChange()" size="medium">
                <el-option :label="item.title" :value="item.id"  v-for="(item,index) in gangweiList" :key="index"></el-option>
            </el-select>
             <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
            <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入老师姓名" v-model.trim="query.teacherUserName" @change="handleSizeChange">
            <el-button slot="append" icon="el-icon-search" @click="handleSizeChange"></el-button>    
            </el-input>    
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.watchDate}}（{{scope.row.weekNamer}}）</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="今日食谱" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.signSheetJson&&scope.row.signSheetJson.menuList.length">
                            <div   v-for="(item,index) in scope.row.signSheetJson.menuList" :key="index">
                                {{item.foodName}}（{{item.foodTypeName}}）
                            </div>
                        </div>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="岗位名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stationTitle}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="评价" show-overflow-tooltip>
                    <template slot-scope="scope">                     
                        <span>{{(scope.row.signSheetJson&&scope.row.signSheetJson.behContent)?scope.row.signSheetJson.behContent:'----'}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="改进建议" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <span>{{(scope.row.signSheetJson&&scope.row.signSheetJson.adviceContent)?scope.row.signSheetJson.adviceContent:'----'}}</span>
                    </template>
                </el-table-column> 
                  <el-table-column align="center" label="拍照" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <div style="color: #409eff;"
                                 v-if="scope.row.signSheetJson && scope.row.signSheetJson.photoJson.length">
                                <image-previewer :images="getViewPic(scope.row.signSheetJson.photoJson)" tag="img"
                                                 text="查看图片"></image-previewer>
                            </div>
                            <div v-else>----</div>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="签到人员" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.teacherUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  label="签到状态" width="100">
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="success" v-if="scope.row.signState==2">已签到</el-tag>
                    <el-tag  size="mini"  type="info" v-if="scope.row.signState==1">未签到</el-tag>
                </template>
            </el-table-column>
                 <el-table-column align="center" label="签到时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.signTime?scope.row.signTime.slice(0, 19):'----'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="query.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import {getSchoolTimeAllList} from "@/api/schedule";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {getWatchStationSignRecordList,getWatchGroupList} from '@/api/dutyArrangement';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                total: null,
                query: {
                    startDate: "",
                    endDate: "",
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    stationId: 0,
                    groupId: '',
                    teacherUserName:''
                },
                gangweiList:[],
                exportUrl: '',
            }
        },
         components: {
            ImagePreviewer
        },
        mixins: [baseMixin, mixin],
        created() {
             getWatchGroupList('',10001)
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                           this.gangweiList = data.data  
                           if(this.gangweiList.length){
                               this.query.groupId=this.gangweiList[0].id
                               getSchoolTimeAllList().then(res => {
                                let data = res.data.data;
                                for (let item of data) {
                                    if (item.isCurrent == 1) {
                                        this.daterange = [item.startDate,item.endDate];
                                        
                                    }
                                }
                                this.getWatchStationSignRecordList();
                            }).catch(err => {
                            });

                           }                        
                        }
                    })
            
        },
        methods: {
              getViewPic(picList) {
                  console.log(picList)
                if (picList) {
                    return picList.map((item) => {
                        return {'src': item.picUrl}
                    });
                }
                return [];
            },
            handleSizeChange() {
                this.query.pageNo = 1;
                this.getWatchStationSignRecordList();
            },
            //切换页数
            handleCurrentChange() {
                this.getWatchStationSignRecordList();
            },
            getWatchStationSignRecordList() {
                this.query.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.query.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/watch/exportWatchStationSignRecordList?endDate=${this.query.endDate}&teacherUserName=${this.query.teacherUserName}&startDate=${this.query.startDate}&groupId=${this.query.groupId}&token=${this.$store.getters.token}`;
                getWatchStationSignRecordList(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.total = data.data.pagination.total;
                        for(let i=0;i<data.data.dataList.length;i++){
                            if(data.data.dataList[i].signSheetJson){
                                data.data.dataList[i].signSheetJson=JSON.parse(data.data.dataList[i].signSheetJson)
                            }
                            
                        }
                        this.dataList = data.data.dataList;
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
</style>
