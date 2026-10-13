<template>
    <div class="building_info_wrap">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
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
                        </div>
                        <div class="bed_add_item clearfix" v-else>
                            <div class="add_logo_img"></div>
                            <div class="bed_stu_msg">
                                <div class="bed_no">{{item.bedNo}}号床</div>
                                <div class="bed_other_text">空床</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getDormInfo} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryCheckInRoomInfo",
        data() {
            return {
                roomInfoMsg: {},
                bedList: [],
                roomBedMsg: {}
            }
        },
        mixins: [mixins],
        created() {
            this.getDormInfo();
        },
        methods: {
            goBack() {
                this.$router.back();
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../styles/style";
    .building_info_wrap{
        padding:12px;
        .header{
            padding-bottom: 10px;
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
        }
    }
</style>
