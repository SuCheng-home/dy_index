<template>
    <div class="building_info_wrap">
        <div class="header">
            <el-button @click="goBack"  size="medium">返回</el-button>
            <el-button type="primary" @click="toEditRoom"  size="medium">编辑</el-button>
        </div>
        <div class="building_info_msg_box custom—scrollbar" :style="`height: ${nobottommaxH}px;`">
            <div class="room_info_title">宿舍信息</div>
            <div class="room_info_msg">
                <div class="room_info_line">
                    <div class="room_info_left">宿舍名称/编号</div>
                    <div class="room_info_right">{{roomInfoMsg.name}}</div>
                </div>
                <div class="room_info_line">
                    <div class="room_info_left">宿舍类型</div>
                    <div class="room_info_right">{{roomInfoMsg.type === 2 ? '女生宿舍' : '男生宿舍'}}</div>
                </div>
                <div class="room_info_line">
                    <div class="room_info_left">入住班级</div>
                    <div class="room_info_right">{{roomInfoMsg.classNames}}</div>
                </div>
                <div class="room_info_line">
                    <div class="room_info_left">入住情况</div>
                    <div class="room_info_right">{{roomInfoMsg.liveNum}}/{{roomInfoMsg.bedNum}}</div>
                </div>
            </div>
            <div class="room_info_title">宿舍成员</div>
            <div class="room_info_msg">
                <div class="bed_list_wrap">
                    <div class="bed_init_item" :key="index" v-for="(item, index) in bedList">
                        <div class="bed_info_item clearfix" v-if="item.id">
                            <img :src="item.stuAvatar" alt="" class="stu_logo_img">
                            <div class="bed_stu_msg">
                                <div class="bed_no">{{item.bedNo}}号床</div>
                                <div class="bed_stu_name">{{item.stuName}}</div>
                                <div class="bed_stu_text">学号：{{item.stuNo}}</div>
                                <div class="bed_stu_text">班级：{{item.className}}</div>
                            </div>
                            <i class="el-icon-close" @click="delRoomStu(item.id, item.stuName)"></i>
                        </div>
                        <div class="bed_add_item clearfix" v-else>
                            <div class="add_logo_img" @click="showStuList(item)">+</div>
                            <div class="bed_stu_msg">
                                <div class="bed_no">{{item.bedNo}}号床</div>
                                <div class="bed_other_text">空床</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="showStuDialogVisible" size="tiny" :close-on-press-escape='false' :show-close="false"
                   :close-on-click-modal='false' :modal-append-to-body='false' width="960px">
            <div slot="title" class="dialog-header">
                <el-row :gutter="20">
                    <el-col :span="16">添加学生</el-col>
                    <el-col :span="8">
                        <el-input placeholder="学生姓名" v-model.trim="stuName" size="small" clearable class="input-with-select" @keyup.enter.native="searchStu">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchStu"></i>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="class_stu_wrap custom—scrollbar">
                <div class="stu_box clearfix" v-show="chooseStuList && chooseStuList.length">
                    <div class="stu_item" :key="index" v-for="(item, index) in chooseStuList" @click="chooseStu(item.id)">
                        <img :src="item.avatar" alt="">
                        <div>{{item.name}}</div>
                        <i class="el-icon-circle-check" v-show="isShowStudentIcon(item.id)"></i>
                    </div>
                </div>
                <div class="no_stu_text" v-show="!chooseStuList.length">暂无学生</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showStuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoomStu">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getDormInfo, getNoDormStuList, addDormStu, delDormStu} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryManageRoomInfo",
        props: ['currentBuilding'],
        data() {
            return {
                showStuDialogVisible: false,
                roomInfoMsg: {},
                bedList: [],
                initStudentList: [],
                chooseStuList: [],
                checkedStuId: 0,
                roomBedMsg: {},
                stuName: ''
            }
        },
        mixins: [mixins],
        created() {
            this.getDormInfo();
            this.getNoDormStuList();
        },
        methods: {
            goBack() {
                this.$router.replace('building');
            },
            toEditRoom() {
                this.$router.replace({path: 'roomAdd', query: {id: this.$route.query.id}});
            },
            searchStu() {
                if (this.stuName) {
                    let newStuArray = [];
                    this.initStudentList.forEach((item) => {
                        if (item.name.indexOf(this.stuName) > -1) {
                            newStuArray.push(item);
                        }
                    });
                    this.chooseStuList = newStuArray;
                } else {
                    this.chooseStuList = this.initStudentList;
                }
            },
            // 添加学生
            addRoomStu() {
                if (!this.checkedStuId) {
                    this.$message({
                        message: '请选择学生!',
                        type: 'info'
                    });
                    return;
                }

                let query = Object.assign({}, this.roomBedMsg, {stuId: this.checkedStuId});
                this.addDormStu(query);
            },
            addDormStu(query) {
                addDormStu(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.getDormInfo();
                        this.getNoDormStuList();
                        this.showStuDialogVisible = false;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            // 删除学生
            delRoomStu(stuId, stuName) {
                this.$confirm('此操作将从当前宿舍移除学生'+ stuName +'，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delDormStu(stuId).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getDormInfo();
                            this.getNoDormStuList();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch();
                }).catch(() => {
                });
            },
            // 宿舍详情
            getDormInfo() {
                let self = this;
                getDormInfo(this.$route.query.id).then(res => {
                    const data = res.data.data;
                    self.bedList = [];
                    if (res.data.code === 200) {
                        this.roomInfoMsg = data;
                        for (let i = 0; i < data.bedNum; i++) {
                            let query = {};
                            query.bedNo = parseInt(i + 1);
                            query.buildId = data.buildId;
                            query.dormId = data.id;
                            let bedIndex = data.dormStuList.map(item => item.bedNo).indexOf(parseInt(i + 1));
                            if (!!data.dormStuList.length && bedIndex > -1) {
                                let bedItem = data.dormStuList[bedIndex];
                                query.id = bedItem.id;
                                query.stuAvatar = bedItem.stuAvatar;
                                query.stuNo = bedItem.stuNo;
                                query.stuName = bedItem.stuName;
                                query.className = bedItem.className;
                            }
                            self.bedList.push(query);
                        }
                    }
                }).catch();
            },
            // 学生列表展示
            showStuList(emptyItem) {
                this.checkedStuId = 0;
                this.roomBedMsg = emptyItem;
                this.stuName = '';
                this.chooseStuList = this.initStudentList;
                this.showStuDialogVisible = true;
            },
            isShowStudentIcon(studentId) {
                let isShow = false;
                if (this.checkedStuId === studentId) {
                    isShow = true;
                }
                return isShow;
            },
            chooseStu(stuId) {
                this.checkedStuId = stuId;
            },
            getNoDormStuList() {
                getNoDormStuList(this.$route.query.id).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.initStudentList = data;
                    }
                }).catch();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/style";
    .building_info_wrap{
        .header{
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        .building_info_msg_box{
            padding-bottom: 30px;
            .room_info_title{
                height: 20px;
                line-height: 20px;
                margin: 15px;
                padding-left: 10px;
                border-left: 3px solid #409eff;
                font-weight: 700;
                color: #333;
            }
            .room_info_msg{
                padding: 5px 10px;
                font-size: 15px;
                .room_info_line{
                    display: flex;
                    margin: 10px 25px;
                    color: #666;
                    .room_info_left{
                        width: 150px;
                    }
                    .room_info_right{
                        flex: 1;
                    }
                }
                .bed_list_wrap{
                    overflow: hidden;
                    .bed_init_item{
                        width: 320px;
                        height: 150px;
                        margin: 20px 30px 20px 10px;
                        padding: 10px;
                        float: left;
                        overflow: hidden;
                        border-radius: 5px;
                        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                        transition: all .2s linear;
                        .bed_info_item{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            .stu_logo_img{
                                float: left;
                                width: 86px;
                                height: 86px;
                                margin: 22px;
                                border-radius: 4px;
                            }
                            .bed_stu_msg{
                                float: left;
                                width: 165px;
                                height: 125px;
                                .bed_no{
                                    margin-top: 20px;
                                    margin-bottom: 5px;
                                    font-size: 16px;
                                    font-weight: bold;
                                    color: #333;
                                }
                                .bed_stu_name{
                                    height: 26px;
                                    line-height: 26px;
                                    color: #409EFF;
                                }
                                .bed_stu_text{
                                    height: 26px;
                                    line-height: 26px;
                                    color: #777;
                                }
                            }
                            i{
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                font-size: 24px;
                                color: #F56C6C;
                                border: 1px solid #F56C6C;
                                border-radius: 50%;
                                cursor: pointer;
                                display: none;
                            }
                            &:hover{
                                i{
                                    display: block;
                                }
                            }
                        }
                        .bed_add_item{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            .add_logo_img{
                                float: left;
                                width: 100px;
                                height: 100px;
                                line-height: 100px;
                                text-align: center;
                                margin: 15px;
                                border: 1px dashed #ddd;
                                color: #ddd;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            .bed_stu_msg{
                                float: left;
                                width: 165px;
                                height: 125px;
                                .bed_no{
                                    margin-top: 20px;
                                    margin-bottom: 15px;
                                    font-size: 16px;
                                    font-weight: bold;
                                    color: #333;
                                }
                                .bed_other_text{
                                    margin-left: 10px;
                                    color: #999;
                                }
                            }
                        }

                        &:hover {
                            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                            transform: translate3d(0, -2px, 0);
                        }
                    }
                }
            }
        }

        .class_stu_wrap{
            max-height: 400px;
            .stu_box{
                .stu_item{
                    position: relative;
                    width: 88px;
                    float: left;
                    margin-bottom: 20px;
                    margin-left: 25px;
                    cursor: pointer;
                    img{
                        display: block;
                        width: 60px;
                        height: 60px;
                        margin: 10px auto;
                        border-radius: 5px;
                    }
                    div{
                        text-align: center;
                        height: 20px;
                        line-height: 20px;
                        overflow: hidden;
                    }
                    i{
                        position: absolute;
                        top: 0;
                        right: 10px;
                        font-size: 26px;
                        color: #409EFF;
                        background: #fff;
                        border-radius: 50%;
                    }
                }
            }
            .no_stu_text{
                height: 20px;
                line-height: 20px;
                margin: 20px auto;
                text-align: center;
                color: #999;
            }
        }
    }
</style>
