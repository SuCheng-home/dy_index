<template>
    <div class="entry_exit_wrap">
        <div class="header">
                <el-button @click="goBack"  size="medium">返回</el-button>
                    <el-select  size="medium" v-model="schoolName" placeholder="请选择学年" @change="changeSchoolYear" style="width:150px;">
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="`${item.year}学年`" :value="item.id">
                        </el-option>
                    </el-select>
                <el-date-picker  style="width:220px;" size="medium"  v-model="entryExitDate" type="daterange" class="mywidthdaterange" :clearable="false" :picker-options="dormDateOptions"
                                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <el-select  size="medium" v-model="buildingSelect" placeholder="请选择宿舍楼" @change="changeBuilding" style="width:120px;">
                    <el-option v-for="item in schoolBuildingList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select  size="medium" v-model="classSelect" placeholder="请选择班级" @change="changeClass" style="width:120px;">
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select  size="medium" v-model="bedRoomSelect" placeholder="请选择宿舍" @change="changeRoom" style="width:120px;">
                    <el-option v-for="item in bedRoomList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-button  size="medium" type="primary" v-if="entryExitList.length" @click="exportExcel('#outTable', '宿舍进出记录.xlsx')">导出</el-button>
                <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入姓名" icon="search" size="medium"  @change="getStatistics()"
                          v-model.trim="userName">
                    <el-button slot="append" icon="el-icon-search" @click="getStatistics" ></el-button>
            </el-input>  
        </div>
        <div class="entry_exit_table_wrap">
            <el-table stripe :data="entryExitList" border style="width: 100%;" :height="maxH" id="outTable">
                <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
                <el-table-column align="center" prop="className" label="所在班级"></el-table-column>
                <el-table-column align="center" prop="dormName" label="所在宿舍">
                    <template slot-scope="scope">
                        <span>{{scope.row.buildName}}&nbsp;{{floorNumList[scope.row.floorNo - 1] || scope.row.floorNo}}{{!!scope.row.floorNo ? '楼' : ''}}&nbsp;{{scope.row.dormName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userType === 1">老师</span>
                        <span v-else-if="scope.row.userType === 2">学生</span>
                        <span v-else-if="scope.row.userType === 3">家长</span>
                        <span v-else-if="scope.row.userType === 13">老师家长</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.inoutTime | formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="进出类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.inoutType === 1">进入</span>
                        <span v-else-if="scope.row.inoutType === 2">出去</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="buildName" label="进出位置"></el-table-column>
                <el-table-column align="center" label="图片" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.inoutImgs" class="link-type">
                            <image-previewer :images="getViewPic(scope.row.inoutImgs)" tag="img" text="预览"></image-previewer>
                        </span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixins from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {getCurrentSchoolTimeBySchoolId,getSchoolYear, possessRole, getSchoolDormBuildingList, getUserManageDormBuildingList, getDormBuildingClassList, getDormListByClassIdAndBuildId, getDormInOutPageList} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryEntryExitRecords",
        components: {
            ImagePreviewer
        },
        data() {
            return {
                isManager: false,
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                entryExitDate: '',
                buildingSelect: '0',
                schoolBuildingList: [],
                classSelect: '0',
                classList: [],
                bedRoomSelect: '0',
                bedRoomList: [],
                initListJson: {
                    name: '全部班级',
                    id: '0'
                },
                userName: '',
                exportUrl: '',
                floorNumList: ['一', '二', '三','四', '五', '六','七', '八', '九','十', '十一','十二', '十三','十四', '十五','十六', '十七','十八', '十九','二十'],
                entryExitList: [],
                dormDateOptions: {
                    disabledDate(time) {
                        return (time.getTime() > new Date('2020-08-31')) || (time.getTime() < new Date('2019-09-01'));
                    }
                }
            }
        },
        mixins: [mixins, baseMixin],
        filters: {
            formatTimeMap(type) {
                if (type) {
                    return type.substring(0,19);
                }
                return '-';
            }
        },
        created() {
            this.getSchoolYear();
            this.checkIsManager();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            checkIsManager() {
                let roleId = '300';
                possessRole(roleId).then(res  =>{
                    if(res.data.code === 200 && res.data.data){
                        this.isManager = res.data.data.result;
                        if (this.isManager) {
                            this.getSchoolDormBuildingList();
                        } else {
                            this.getUserManageDormBuildingList();
                        }
                    }
                }).catch(err => {
                });
            },
            // 学年
            getSchoolYear() {
                getCurrentSchoolTimeBySchoolId().then(res => {
                   let data=res.data.data;
                    this.schoolName = data.schoolYear + '学年';
                   this.schoolTimeCode = data.schoolYearId+'';

                 }).catch();
                getSchoolYear().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.schoolYearList = data;                       
                        this.entryExitDate = [this.getDate(0), this.getDate(0)]; // 列表日期
                        // this.entryExitDate = [data[data.length - 1].year.split('-')[0] + '-09-01', data[data.length - 1].year.split('-')[1] + '-08-31']; // 列表日期
                    }
                }).catch();
            },
            changeSchoolYear(val) {
                const self = this;
                this.schoolName = val;
                this.schoolYearList.forEach(function (item) {
                    if (item.id === val) {
                        self.schoolTimeCode = item.id;
                        self.entryExitDate = [item.year.split('-')[0] + '-09-01', item.year.split('-')[1] + '-08-31']; // 列表日期
                        self.dormDateOptions =  {
                            disabledDate(time) {
                                return (time.getTime() > new Date(item.year.split('-')[1] + '-08-31')) || (time.getTime() < new Date(item.year.split('-')[0] + '-09-01'));
                            }
                        }
                    }
                });
                this.getStatistics();
            },
            // 宿舍楼列表
            getSchoolDormBuildingList() {
                getSchoolDormBuildingList().then(res => {
                    this.schoolBuildingList = [];
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.schoolBuildingList.push({
                            name:"全部宿舍楼",
                            id:'0'
                        });
                        this.schoolBuildingList.push.apply(this.schoolBuildingList, data);
                        this.getDormBuildingClassList();
                    }
                }).catch();
            },
            // 用户所负责宿舍楼列表
            getUserManageDormBuildingList() {
                getUserManageDormBuildingList().then(res => {
                    this.schoolBuildingList = [];
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.schoolBuildingList = data;
                        this.buildingSelect = !!data[0].id ? data[0].id : '0';
                        this.getDormBuildingClassList();
                    }
                }).catch();
            },
            changeBuilding() {
                this.getDormBuildingClassList();
            },
            // 班级列表
            getDormBuildingClassList() {
                let buildingId = !!parseInt(this.buildingSelect) ? this.buildingSelect : '';
                getDormBuildingClassList(buildingId).then(res => {
                    this.classList = [];
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.classList.push(this.initListJson);
                        this.classList.push.apply(this.classList, data);
                        this.classSelect = '0';
                        this.getDormListByClassIdAndBuildId();
                    }
                }).catch();
            },
            changeClass() {
                this.getDormListByClassIdAndBuildId();
            },
            // 宿舍列表
            getDormListByClassIdAndBuildId() {
                getDormListByClassIdAndBuildId({
                    buildId: !!parseInt(this.buildingSelect) ? this.buildingSelect : '',
                    classIds: !!parseInt(this.classSelect) ? this.classSelect.toString() : ''
                }).then(res => {
                    this.bedRoomList = [];
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.bedRoomList.push({
                            name: '全部宿舍',
                            id: '0'
                        });
                        this.bedRoomList.push.apply(this.bedRoomList, data);
                        this.bedRoomSelect = '0';
                        this.getStatistics();
                    }
                }).catch();
            },
            changeRoom() {
                this.getStatistics();
            },
            // 获取列表信息
            getStatistics() {
                if (!this.schoolTimeCode) {
                    return;
                }
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    buildId: !!parseInt(this.buildingSelect) ? this.buildingSelect : '',
                    classId: this.classSelect,
                    dormId: !!parseInt(this.bedRoomSelect) ? this.bedRoomSelect : '',
                    startDate: this.getStrDate(this.entryExitDate[0]),
                    endDate: this.getStrDate(this.entryExitDate[1]),
                    schoolYearId: this.schoolTimeCode,
                    userName: this.userName
                };

                this.getDormInOutPageList(query);
            },
            getDormInOutPageList(query) {
                getDormInOutPageList(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.entryExitList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            // 其他
            getDate(n) {
                const data = new Date();
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
                let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return localDateStr;
            },
            getStrDate(oldDate) {
                let data = new Date(oldDate);
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            },
            getViewPic(picUrl){
                return [{'src': picUrl}];
            }
        }
    }
</script>

<style scoped>
    .entry_exit_wrap .el-select {
        width: 150px;
    }
</style>
<style lang="scss" scoped>
    .entry_exit_wrap{
        padding:12px;
        .header{
            padding-bottom: 10px;
        }
    }
</style>
