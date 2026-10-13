<template>
    <div class="building_box">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <div class="header_title_box" v-show="currentBuilding && currentBuilding.name">
                <div class="building_name">{{currentBuilding.name}}</div>
                <i class="el-icon-edit" @click="editBuilding"></i>
                <i class="el-icon-delete" @click="deleteBuilding"></i>
                <i class="el-icon-refresh" @click="refreshBuilding"></i>
            </div>
        </div>
        <div class="building_level_list custom—scrollbar" :style="`height: ${nobottommaxH}px;`" v-if="floorList && floorList.length">
            <div class="floor_item" :key="index" v-for="(item, index) in floorList">
                <div class="floor_name">{{floorNumList[item.floorNo - 1] || item.floorNo}}楼</div>
                <div class="room_list clearfix">
                    <div class="room_item" :key="roomItem.roomId" v-for="(roomItem, roomIndex) in item.roomList" @click="showRoomInfo(roomItem.id)">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/dormitoryManage/bedroom.png" alt="">
                        <div class="room_name">{{roomItem.name}}</div>
                        <i class="el-icon-close" @click.stop="deleteRoom(roomItem.id, roomItem.name)"></i>
                    </div>
                    <div class="room_add_icon" @click="addRoom(item)">
                        <i class="el-icon-plus"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="no_floor_text" v-else>暂无楼层</div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getDormBuildingInfo, delDormBuilding, delDorm, clearBuildDormStu} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryManageBuilding",
        props: ['currentBuilding'],
        data() {
            return {
                floorNumList: ['一', '二', '三','四', '五', '六','七', '八', '九','十', '十一','十二', '十三','十四', '十五','十六', '十七','十八', '十九','二十'],
                floorList: [],
                buildingFloor: []
            }
        },
        watch: {
            currentBuilding(val) {
                if (!val.id) {
                    this.floorList = [];
                }
                this.getDormBuildingInfo();
            }
        },
        mixins: [mixins],
        created() {
            this.getDormBuildingInfo();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            // 宿舍楼操作
            editBuilding() {
                this.$router.replace({path: 'buildingAdd', query: {id: this.currentBuilding.id}});
            },
            deleteBuilding() {
                let deleteMsg = '此操作将删除'+ this.currentBuilding.name +'，是否继续?';
                if (!!this.buildingFloor.length) {
                    deleteMsg = '当前宿舍楼已维护宿舍，是否确认删除？';
                }
                this.$confirm(deleteMsg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDormBuilding(this.currentBuilding.id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$emit('buildingChange');
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch();
                }).catch(() => {
                });
            },
            refreshBuilding() {
                this.$confirm('此操作将重置宿舍楼'+ this.currentBuilding.name +'，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    clearBuildDormStu(this.currentBuilding.id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '重置成功!'
                            });
                            this.getDormBuildingInfo();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch();
                }).catch(() => {
                });
            },
            // 楼层操作
            addRoom(item) {
                this.$router.replace({path: 'roomAdd', query: {floorNo: item.floorNo, buildId: item.buildId}});
            },
            showRoomInfo(id) {
                this.$router.replace({path: 'roomInfo', query: {id: id}});
            },
            deleteRoom(roomId, roomName) {
                this.$confirm('删除宿舍'+ roomName +'将清空已安排宿舍学生，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDorm(roomId).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getDormBuildingInfo();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch();
                }).catch(() => {
                });
            },
            // 接口
            getDormBuildingInfo() {
                if (!this.currentBuilding.id) {
                    return;
                }
                let self = this;
                getDormBuildingInfo(this.currentBuilding.id).then(res => {
                    const data = res.data.data;
                    self.buildingFloor = data.dormList;
                    self.floorList = [];
                    if (res.data.code === 200) {
                        // 宿舍楼展示
                        for (let i = 0; i < data.floorNum; i++) {
                            let query = {};
                            query.floorNo = parseInt(i + 1);
                            query.buildId = data.id;
                            let floorRoomList = [];
                            data.dormList.forEach((item) => {
                                if (item.floorNo - 1 === i) {
                                    floorRoomList.push(item);
                                }
                            });
                            query.roomList = floorRoomList.sort(this.sortRoomNumber);
                            self.floorList.unshift(query);
                        }
                    }
                }).catch();
            },
            sortRoomNumber(x,y){
                return x.orderNo-y.orderNo
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/style";
    .building_box{
        .header{
            padding: 10px;
            height: 60px;
            line-height: 40px;
            border-bottom: 1px solid #eee;
            .header_title_box{
                display: inline-block;
                margin-left: 10px;
                .building_name{
                    float: left;
                    margin-right: 20px;
                    font-size: 20px;
                    font-weight: 700;
                }
                i{
                    margin-right: 8px;
                    font-size: 16px;
                    color: #409EFF;
                    cursor: pointer;
                }
                .el-icon-delete{
                    color: #F56C6C;
                }
            }
        }
        .building_level_list{
            padding-bottom: 30px;
            .floor_item{
                display: flex;
                padding: 10px;
                border-bottom: 1px solid #eee;
                .floor_name{
                    width: 70px;
                    height: 80px;
                    line-height: 80px;
                    overflow: hidden;
                }
                .room_list{
                    flex: 1;
                    .room_item{
                        float: left;
                        position: relative;
                        margin: 10px;
                        overflow: hidden;
                        cursor: pointer;
                        img{
                            display: block;
                            width: 100px;
                            height: 60px;
                        }
                        .room_name{
                            width: 100px;
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            font-size: 14px;
                            color: #333;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        i{
                            position: absolute;
                            top: 0;
                            right: 0;
                            font-size: 16px;
                            font-weight: 700;
                            color: #F56C6C;
                            background: #fff;
                            display: none;
                        }
                        &:hover{
                            i{
                                display: block;
                            }
                        }
                    }
                    .room_add_icon{
                        float: left;
                        border: 1px dashed #999;
                        margin: 15px 10px;
                        padding: 10px;
                        i{
                            font-size: 24px;
                            color: #999;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .no_floor_text{
            height: 20px;
            line-height: 20px;
            margin: 30px 0;
            text-align: center;
            color: #999;
        }
    }
</style>
