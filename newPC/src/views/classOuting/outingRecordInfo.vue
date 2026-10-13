<template>
    <div class="meetingDetail">
        <div class="el-row menu-tools">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>

        </div>
        <div class="main-wrap scrollBar" :height="maxH">
            <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm form--display">
                <el-form-item label="外出班级">
                    {{ listQuery.className }}
                </el-form-item>
                <el-form-item label="外出日期">
                    {{ listQuery.createDate }}
                </el-form-item>
                <el-form-item label="申请老师">
                    {{ listQuery.createUserName }}
                </el-form-item>
                <el-form-item label="外出时段">
                    <span>{{ listQuery.outDayType == 1 ? '全天' : listQuery.outDayType == 2 ? '上午' : listQuery.outDayType
                        ==
                        3 ? '下午' : '' }}</span>
                </el-form-item>
                <el-form-item label="日程内容">
                    {{ listQuery.content }}
                </el-form-item>
                <el-form-item label="外出地点">
                    {{ listQuery.address }}
                </el-form-item>
                <el-form-item label="在校(园)就餐情况">
                    {{
                        listQuery.repastJson ? JSON.parse(listQuery.repastJson).map(item => item.repastName).join('、') :
                            '无'}}
                </el-form-item>
                <el-form-item label="参与幼儿人数">

                    {{ listQuery.stuList.length }}人
                </el-form-item>

                <el-form-item label="参与幼儿名单" v-if="listQuery.stuList.length > 0">
                    <div class="addtxt" @click="popaddfun(1)">点击查看</div>
                </el-form-item>
                <el-form-item label="是否家长陪同">
                    {{ listQuery.isAccompanyph == 2 ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="参与家长名单" v-if="listQuery.isAccompanyph == 2">
                    <div class="addtxt" @click="popaddfun(2)">点击查看</div>
                </el-form-item>
                <el-form-item label="参与老师">
                    {{
                        listQuery.thList.length > 0 ? listQuery.thList.map(item => item.userName).join('、') :
                            '未安排'}}
                </el-form-item>

            </el-form>
        </div>

        <el-dialog :title="newtype == 1 ? '参与幼儿名单' : '参与家长名单'" :visible.sync="myshow" width="35%"
            :before-close="handleClose">
            <div>
                <div v-if="newtype == 1">
                    <div style="text-align: center;padding: 10px 0;">
                        <span
                            style="width: 17px;height: 17px;display: inline-block;background: #909399; margin: 2px; position: relative; top: 5px;}"></span>未到
                        <span
                            style="width: 17px;height: 17px;display: inline-block;background: #409eff; margin: 2px; position: relative; top: 5px;}"></span>已到
                        <span
                            style="width: 17px;height: 17px;display: inline-block;background: #e6a23c; margin: 2px; position: relative; top: 5px;}"></span>请假
                    </div>
                    <div class="stubox" style="min-height: 100px;">
                        <div class="renbox"
                            @click="createDate == listQuery.createDate ? (item.state == 3 ? item.state = 3 : (item.state == 2 ? item.state = 1 : item.state = 2)) : ''"
                            :class="{ 'yellow': item.state == 3, 'plue': item.state == 2 }"
                            v-for="(item, index) in stuList" :key="index">
                            {{ item.userName }}
                        </div>
                    </div>

                </div>
                <div v-if="newtype == 2">
                    <div class="stubox" style="min-height: 100px;">
                        <div class="ren" v-for="(item, index) in xuanzhongclassliststu" :key="index">
                            {{ item.userName }}
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="myshow = false">关 闭</el-button>

            </span>
        </el-dialog>

    </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import { mapGetters } from 'vuex';
import { getClassOut ,getClassStuList} from '@/api/classOuting';
import { getMeetingInfo } from '@/api/metting';

export default {
    components: {},
    data() {
        return {

            listQuery: [],
            stuList: [],
            jazhangwodehuobanlist: [],
            xuanzhongidlidt: [],
            myshow: false,
            newtype: 0,
            classliststu: [],
            xuanzhongclassliststu: [],

        }
    },
    created() {
    },
    mounted() {
        this.getMeetingInfoFunc();
    },
    mixins: [mixin],
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },

    methods: {
        popaddfun(newtype) {
            this.xuanzhongidlidt = [];
            this.newtype = newtype
            if (newtype == 1) {
                this.stuList = JSON.parse(JSON.stringify(this.listQuery.stuList));
            } else {
                this.jazhangwodehuobanlist = this.listQuery.phList;
                for (let i = 0; i < this.jazhangwodehuobanlist.length; i++) {
                    this.xuanzhongidlidt.push(this.jazhangwodehuobanlist[i].userId);
                }
                this.getClassStuList();
            }
            this.myshow = true;
        },
        getClassStuList() {
            getClassStuList(this.listQuery.classId)
                .then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.classliststu = res.data.data;
                        this.xuanzhongclassliststu = [];
                        for (let i = 0; i < this.classliststu.length; i++) {
                            for (let j = 0; j < this.xuanzhongidlidt.length; j++) {
                                if (this.classliststu[i].userId == this.xuanzhongidlidt[j]) {
                                    this.xuanzhongclassliststu.push(this.classliststu[i]);
                                }
                            }
                        }
                    }
                })
                .catch(() => { });
        },


        getMeetingInfoFunc() {
            console.log('123,', this.$route.query.outId);

            getClassOut(this.$route.query.outId).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.listQuery = data.data;
                    }
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.scrollBar {
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }
}

.clearfix:after {
    content: "";
    height: 0;
    display: block;
    clear: both;
    visibility: hidden;
}

.el-form-item.is-required .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
}

.meetingDetail {
    padding: 12px;
    color: #333;
    box-sizing: border-box;

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        position: relative;

        .HTitle {
            display: block;
            position: absolute;
            left: 50%;
            width: 100px;
            height: 24px;
            font-weight: bold;
            font-size: 18px;
            margin-left: -25px;
            margin-top: -12px;
            top: 50%;
        }
    }

    .main-wrap {
        width: 100%;
        padding-top: 20px;
        padding-bottom: 10px;
        box-sizing: border-box;

        .demo-ruleForm {
            width: 810px;
            box-sizing: border-box;
            margin: 0 auto;
        }

        .file {
            position: relative;
            display: inline-block;
            background: #fff;
            border: 1px dashed #ccc;
            color: #fff;
            text-decoration: none;
            text-indent: 0;
            width: 50px;
            height: 50px;
            font-size: 30px;
            text-align: center;
            font-weight: blode;
            cursor: pointer;
            color: #000;
            padding-top: 3px;
            margin-top: 10px;
        }

        .for-box {
            min-width: 100px;
            width: auto;
            height: 70px;
            float: left;
            margin-bottom: 10px;
            margin-top: 10px;

            .upload-img {
                width: 50px;
                height: 50px;
                vertical-align: middle;
            }

            .file_del {
                text-decoration: none;
                color: #337ab7;
            }

            .file-name {
                display: block;
                width: 100px;
                line-height: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}

.file-list,
.range-list {
    //margin: 10px;
    margin: 0 !important;
}

.range-item {
    height: 30px;
    display: block;
    float: left;
    margin-left: 4px;
    margin-top: 4px;
    margin-right: 10px;
    border: 1px solid #e7eaec;
}

.range-item-img {
    height: 28px;
    width: 28px;
    display: block;
    float: left;
    background-position: center center;
    background-size: cover;
}

.range-item-des {
    padding-left: 4px;
    line-height: 30px;
    padding-right: 4px;
    color: #676a6c;
    float: left;
    font-size: 13px;
}

.social-feed-box {
    border: 1px solid #e7eaec;
    background: #fff;
    margin-bottom: 15px;
}

.file-item-img {
    height: 28px;
    width: 28px;
    display: block;
    float: left;
    background-position: center center;
    background-size: cover;
}

.file-item {
    height: 30px;
    display: block;
    border-bottom: 1px solid #e7eaec;
    margin-left: 4px;
    margin-top: 4px;
}

.file-item-des {
    padding-left: 4px;
    line-height: 30px;
    padding-right: 4px;
}
</style>
<style lang="scss">
.meetingDetail .el-form-item__content {
    padding-left: 10px;
}

.meetingDetail .el-form-item__label {
    font-weight: 700;
    color: #666;
    padding-right: 20px;
}

.meeting-content {
    p {
        padding: 0;
        margin: 0;
    }

    .file-item {
        margin-bottom: 10px;
    }
}

.meetingDetail ol,
.meetingDetail ul {
    padding-left: 30px;
}

.meetingDetail td,
.meetingDetail th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}

.meetingDetail p {
    margin: 0 0 10px;
}

.meetingDetail img {
    max-width: 250px;
    height: auto;
    margin-right: 50px;
}

.addtxt {
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
}

.stubox {
    padding: 10px 2%;
    overflow: auto;
    min-height: 30px;

    .ren {
        width: 24%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #409eff;
        font-size: 14px;
        float: left;
        line-height: 32px;
    }

    .renbox {
        width: 23%;
        margin: 5px 1%;
        display: inline-block;
        height: 32px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        border: 1px solid #909399;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #909399;
    }

    .yellow {
        background-color: #e6a23c;
        border-color: #e6a23c;
        color: #fff;
    }

    .plue {
        background-color: #409eff;
        color: #fff;
        border: 1px solid #409eff;
    }
}
</style>
