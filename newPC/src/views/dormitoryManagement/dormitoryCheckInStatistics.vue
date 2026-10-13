<template>
    <div class="check_in_statistics_wrap">
        <div class="header">
            <el-button @click="goBack"  size="medium">返回</el-button>
                <el-select  size="medium" v-model="buildingSelect" placeholder="请选择宿舍楼" @change="changeBuilding">
                    <el-option v-for="item in schoolBuildingList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select  size="medium" v-model="classSelect" placeholder="请选择班级" @change="changeClass">
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select  size="medium" v-model="roomTypeSelect" placeholder="请选择宿舍类型" @change="changeRoomType">
                    <el-option v-for="item in roomTypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select  size="medium" v-model="isFullSelect" placeholder="请选择入住情况" @change="changeFullStatus">
                    <el-option v-for="item in liveFullStatus" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary"  size="medium" @click="getStatistics">检索</el-button>
                <a :href="exportUrl" download="导出结果" target="_blank" v-if="checkInList.length">
                    <el-button type="primary"  size="medium" icon="upload">导出</el-button>
                </a>
        </div>
        <div class="check_in_statistics_table_box">
            <el-table stripe :data="checkInList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" prop="name" label="宿舍名称/编号"></el-table-column>
                <el-table-column align="center" prop="classNames" label="入住班级"></el-table-column>
                <el-table-column align="center" label="宿舍类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 1">男生宿舍</span>
                        <span v-else-if="scope.row.type === 2">女生宿舍</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="入住情况">
                    <template slot-scope="scope">
                        <span>{{scope.row.liveNum}}/{{scope.row.bedNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="宿舍位置">
                    <template slot-scope="scope">
                        <span>{{scope.row.buildName}}&nbsp;&nbsp;{{floorNumList[scope.row.floorNo - 1] || scope.row.floorNo}}楼</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="宿舍信息">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="toCheckDormitoryInfo(scope.row.id)">查看</el-button>
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
    import mixins from '@/mixins/windowResize';
    import {possessRole, getSchoolDormBuildingList, getUserManageDormBuildingList, getDormBuildingClassList, getDormStaticsData} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryCheckInStatistics",
        data() {
            return {
                isManager: false,
                buildingSelect: '0',
                schoolBuildingList: [],
                classSelect: '0',
                classList: [],
                isFullSelect: '0',
                liveFullStatus: [
                    {
                        name: '全部入住状态',
                        id: '0'
                    },
                    {
                        name: '满员',
                        id: '1'
                    },
                    {
                        name: '尚有床位',
                        id: '2'
                    }
                ],
                roomTypeSelect: '0',
                roomTypeList: [
                    {
                        name: '全部宿舍类型',
                        id: '0'
                    },
                    {
                        name: '男生宿舍',
                        id: '1'
                    },
                    {
                        name: '女生宿舍',
                        id: '2'
                    }
                ],
                initListJson: {
                    name: '全部宿舍楼',
                    id: '0'
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                exportUrl: '',
                checkInList: [],
                floorNumList: ['一', '二', '三','四', '五', '六','七', '八', '九','十', '十一','十二', '十三','十四', '十五','十六', '十七','十八', '十九','二十']
            }
        },
        mixins: [mixins],
        created() {
            this.checkIsManager();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            toCheckDormitoryInfo(id) {
                this.$router.push({path: 'checkInRoomInfo', query: {id: id}});
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
            // 宿舍楼列表
            getSchoolDormBuildingList() {
                getSchoolDormBuildingList().then(res => {
                    this.schoolBuildingList = [];
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.schoolBuildingList.push(this.initListJson);
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
                        this.getStatistics();
                    }
                }).catch();
            },
            changeClass() {
                this.getStatistics();
            },
            changeFullStatus() {
                this.getStatistics();
            },
            changeRoomType() {
                this.getStatistics();
            },
            getStatistics() {
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    buildId: !!parseInt(this.buildingSelect) ? this.buildingSelect : '',
                    classIds: !!parseInt(this.classSelect) ? this.classSelect : '',
                    liveNum: this.isFullSelect,
                    type: this.roomTypeSelect
                };
                this.exportUrl = `${global.BasePath}structure/dormManage/exportDormLiveData?token=${this.$store.getters.token}&buildId=${query.buildId}&classIds=${query.classIds}&liveNum=${query.liveNum}&type=${query.type}&pageNo=${query.pageNo}&pageSize=${query.pageSize}`;
                this.getDormStaticsData(query);
            },
            getDormStaticsData(query) {
                getDormStaticsData(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.checkInList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            sizeChangeHandler() {
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            }
        }
    }
</script>

<style scoped>
    .check_in_statistics_wrap .el-select {
        width: 145px;
    }
</style>
<style lang="scss" scoped>
    .check_in_statistics_wrap{
        padding:12px;
        .header{
            padding-bottom: 10px;
        }
    }
</style>
