<template>
    <div class="schoolLogeidt">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="editSchoolLogs()">保存</el-button>
        </div>
        <div class="content" :style="`height:${maxH+50}px`">
            <div class="ul">
                <!-- <div class="li">
                    <div class="name">创建日期</div> {{query.createTime}}
                </div> -->
                <div class="li">
                    <div class="name">记录日期</div>
                    <el-date-picker style="margin-left: 10px" disabled v-model="query.recordDate" size="medium" :clearable="false"
                                    :editable="false" type="date" placeholder="选择日期"></el-date-picker>
                </div>
                <!-- 根据设置 -->
                <div v-if="isAddAttendanceData">
                    <div class="li">
                        <div class="name">教职工</div>
                        <div class="li-input">
                            <span>出勤人数</span>
                            <el-input-number size="medium" v-model="inputobj.teacherWorkNum" :min="0"
                                             :max="99999"></el-input-number>
                        </div>
                        <div class="li-input">
                            <span>请假总数</span>
                            <el-input-number size="medium" v-model="inputobj.teacherLeaveNum" :min="0"
                                             :max="99999"></el-input-number>
                        </div>
                    </div>
                    <div class="li">
                        <div class="name">教职工请假明细</div>
                        <div class="li-input" v-for="(item,index) in inputobj.teacherleaveList" :key="index">
                            <span>{{item.leaveTypeName}}</span>
                            <el-input-number size="medium" v-model="item.peopleCount" :min="0"
                                             :max="99999"></el-input-number>
                        </div>
                    </div>
                    <div class="li">
                        <div class="name">学生</div>
                        <div class="li-input">
                            <span>出勤人数</span>
                            <el-input-number size="medium" v-model="inputobj.studentWorkNum" :min="0"
                                             :max="99999"></el-input-number>
                        </div>
                        <div class="li-input">
                            <span>请假总数</span>
                            <el-input-number size="medium" v-model="inputobj.studentLeaveNum" :min="0"
                                             :max="99999"></el-input-number>
                        </div>
                    </div>
                    <div class="li">
                        <div class="name">学生请假明细</div>
                        <div class="li-input" v-for="(item,index) in inputobj.studentleaveList" :key="index">
                            <span>{{item.leaveTypeName}}</span>
                            <el-input-number size="medium" v-model="item.peopleCount" :min="0"
                                             :max="99999"></el-input-number>
                        </div>
                    </div>
                </div>
                <div class="li">
                    <div class="name">
                        <el-checkbox v-model="query.inscribe">落款部门</el-checkbox>
                    </div>
                    <el-select style="margin-left: 10px" size="medium" v-model="query.departId" placeholder="请选择落款部门" v-if="query.inscribe">
                        <el-option v-for="item in departmentList" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="li">
                    <div class="name">对教师公开阅读情况</div>
                    <el-tooltip style="margin-left: 10px" :content="isOpenForTeacher === 1 ? '公开阅读情况' : '不公开阅读情况'" placement="top">
                        <el-switch v-model="isOpenForTeacher" :active-value="1" :inactive-value="2"></el-switch>
                    </el-tooltip>
                </div>
                <div class="li">
                    <div class="name">校务日志</div>
                    <br />
                    <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor" ref="ueditor" :defaultMes="query.content"></ueditor>
                </div>
                <div class="li">
                    <div class="name">附件</div>
                    <uploader pathPrefix="xiaowurizhi" module="xiaowurizhi" moduleCode="100010" style="margin-left: 10px" class="schoolLogFile" :multiple="true" :extList="allFileTypeList"
                              v-model="fileJson"></uploader>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import Ueditor from '@/components/Ueditor';
    import Uploader from '@/components/Uploader/WebUploader';
    import moment from "moment";
    import {mapGetters} from 'vuex';
    import {editSchoolLog, selectDate, queryDepartByUserId, getSchoolLogDetail} from '@/api/schoolLog';

    export default {
        components: {Ueditor, Uploader},
        data() {
            return {
                isAddAttendanceData: false,
                departmentList: [],
                query: {
                    id: this.$route.query.id,
                    content: '',	//	内容	string	@mock=<p>内容11</p>
                    createTime: '',	//	创建时间	string	@mock=2019-11-25 10:46:18
                    departId: '',	//	落款部门id	number	@mock=0
                    departName: '',	//	落款部门名称	string	@mock=
                    inscribe: false,	//	是否落款部门 1不落款 2落款	number	@mock=1
                    recordDate: '',	//	记录日期	string	@mock=2019-11-25
                    studentLeaveNum: '',	//	学生请假总人数	number	@mock=10
                    studentWorkNum: '',	//	学生出勤数 默认学生总数-请假人数	number	@mock=28
                    studentleaveJson: '',	//	学生 各类型请假人数	string	@mock=[{"leaveTypeId":"0","leaveTypeName":"事假","peopleCount":"11"},{"leaveTypeId":"1","leaveTypeName":"病假","peopleCount":"12"}]
                    teacherLeaveNum: '',	//	老师请假总人数	number	@mock=0
                    teacherWorkNum: '',	//	老师出勤数 默认教职工总人数-请假人数	number	@mock=53
                    teacherleaveJson: '',	//	老师各类型的请假人数	string
                },
                inputobj: {
                    studentLeaveNum: 0,	//	学生请假总人数	number	@mock=0
                    studentWorkNum: 0,	//	学生出勤数 默认学生总数-请假人数	number	@mock=3759
                    studentleaveList: [],	//	学生请假明细 List
                    teacherLeaveNum: 0,	//	老师请假总人数	number	@mock=0
                    teacherWorkNum: 0,	//	老师出勤数 默认教职工总人数-请假人数	number	@mock=42
                    teacherleaveList: [],	//	老师请假明细 List
                },
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
                fileJson: [],//上传附件
                isOpenForTeacher: 1,
                picsJson:[]
            }
        },
        computed: {...mapGetters(['userInfo'])},
        mixins: [windowResize],
        created() {
            this.queryDepartByUserIds();
        },
        methods: {
            //获取详情
            getSchoolLogDetails() {
                getSchoolLogDetail(this.query.id).then(res => {
                    if (res.data.code === 200) {
                        let mydata = res.data.data.schoolLog;
                        this.$refs.ueditor.setContent(mydata.content);
                        this.inputobj.studentLeaveNum = mydata.studentLeaveNum;
                        this.inputobj.studentWorkNum = mydata.studentWorkNum;
                        this.inputobj.studentleaveList = mydata.studentleaveList;
                        this.inputobj.teacherLeaveNum = mydata.teacherLeaveNum;
                        this.inputobj.teacherWorkNum = mydata.teacherWorkNum;
                        this.inputobj.teacherleaveList = mydata.teacherleaveList;
                        this.picsJson= mydata.picsJson?JSON.parse(mydata.picsJson):[];
                        this.query.content = mydata.content;
                        this.query.createTime = mydata.createTime;
                        this.query.recordDate = mydata.recordDate;
                        this.isOpenForTeacher = mydata.isOpenForTeacher;
                        if (mydata.inscribe == 2) {
                            this.query.inscribe = true;
                            this.query.departId = mydata.departId;
                        }
                        if (mydata.isAddAttendanceData == 1) {
                            this.isAddAttendanceData = true;
                        }
                        this.fileJson = mydata.filesJson ? JSON.parse(mydata.filesJson) : [];
                    }
                }).catch(err => {
                });
            },
            //获取落款部门
            queryDepartByUserIds() {
                queryDepartByUserId(this.userInfo.id, '7').then(res => {
                    if (res.data.code === 200) {
                        this.departmentList = res.data.data;
                        if (this.departmentList[0]) {
                            this.query.departId = this.departmentList[0].id;
                            this.getSchoolLogDetails()
                        }
                    }
                }).catch(err => {
                });
            },
            //保存
            editSchoolLogs() {
                let obj = {
                    id: this.query.id,
                    createType: 0,
                    content: this.$refs.ueditor.getContent(),	//	内容	string	@mock=<p>内容11</p>
                    createTime: this.query.createTime,	//	创建时间	string	@mock=2019-11-25 10:46:18
                    departId: '',	//	落款部门id	number	@mock=0
                    departName: '',	//	落款部门名称	string	@mock=
                    inscribe: 1,	//	是否落款部门 1不落款 2落款	number	@mock=1
                    recordDate: this.query.recordDate,	//	记录日期	string	@mock=2019-11-25
                    studentLeaveNum: 0,	//	学生请假总人数	number	@mock=10
                    studentWorkNum: 0,	//	学生出勤数 默认学生总数-请假人数	number	@mock=28
                    studentleaveJson: [],	//	学生 各类型请假人数	string	@mock=[{"leaveTypeId":"0","leaveTypeName":"事假","peopleCount":"11"},{"leaveTypeId":"1","leaveTypeName":"病假","peopleCount":"12"}]
                    teacherLeaveNum: 0,	//	老师请假总人数	number	@mock=0
                    teacherWorkNum: 0,	//	老师出勤数 默认教职工总人数-请假人数	number	@mock=53
                    teacherleaveJson: [],	//	老师各类型的请假人数	string
                    filesJson: (this.fileJson && this.fileJson.length !== 0) ? this.fileJson : '',
                    isOpenForTeacher: this.isOpenForTeacher,
                    picsJson:this.picsJson
                };
                if (this.query.inscribe) {
                    obj.inscribe = 2;
                    if (!this.query.departId) {
                        this.$message({type: "warning", message: "暂无部门!"});
                        return;
                    }
                    obj.departId = this.query.departId;
                    for (let i = 0; i < this.departmentList.length; i++) {
                        if (this.query.departId == this.departmentList[i].id) {
                            obj.departName = this.departmentList[i].name
                        }
                    }
                }
                if (this.isAddAttendanceData) {
                    if (this.inputobj.studentLeaveNum) {
                        obj.studentLeaveNum = this.inputobj.studentLeaveNum;
                    }
                    if (this.inputobj.studentWorkNum) {
                        obj.studentWorkNum = this.inputobj.studentWorkNum;
                    }
                    if (this.inputobj.teacherLeaveNum) {
                        obj.teacherLeaveNum = this.inputobj.teacherLeaveNum;
                    }
                    if (this.inputobj.teacherWorkNum) {
                        obj.teacherWorkNum = this.inputobj.teacherWorkNum;
                    }
                    for (let i = 0; i < this.inputobj.teacherleaveList.length; i++) {
                        let myobj = {
                            leaveTypeId: this.inputobj.teacherleaveList[i].leaveTypeId,
                            leaveTypeName: this.inputobj.teacherleaveList[i].leaveTypeName,
                            peopleCount: 0
                        };
                        if (this.inputobj.teacherleaveList[i].peopleCount) {
                            myobj.peopleCount = this.inputobj.teacherleaveList[i].peopleCount
                        }
                        obj.teacherleaveJson.push(myobj)
                    }
                    for (let i = 0; i < this.inputobj.studentleaveList.length; i++) {
                        let myobj = {
                            leaveTypeId: this.inputobj.studentleaveList[i].leaveTypeId,
                            leaveTypeName: this.inputobj.studentleaveList[i].leaveTypeName,
                            peopleCount: 0
                        };
                        if (this.inputobj.studentleaveList[i].peopleCount) {
                            myobj.peopleCount = this.inputobj.studentleaveList[i].peopleCount
                        }
                        obj.studentleaveJson.push(myobj)
                    }
                }
                editSchoolLog(obj).then(res => {
                    let _this = this;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success',
                        duration: 1000,
                        onClose: function () {
                            _this.$router.back();
                        }
                    });
                }).catch(err => {
                });

            }
        },
    }
</script>
<style lang="scss" scoped>
    .schoolLogeidt {
        padding:12px;

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;
        }

        .content {
            overflow: auto;

            .ul {
                width: 810px;
                margin: 0 auto;
            }

            .li {
                overflow: hidden;
                position: relative;
                padding: 0px 0 0px 140px;
                min-height: 40px;
                color: #999;
                line-height: 40px;
                margin: 10px 0;

                .el-date-editor.el-input, .el-select {
                    width: 660px;
                }

                .name {
                    position: absolute;
                    line-height: 40px;
                    color: #222;
                    font-size: 14px;
                    width: 140px;
                    text-align: right;
                    left: 0;
                    top: 0px;
                }

                .li-input {
                    float: left;
                    width: 270px;
                    margin-bottom: 10px;

                    .el-input-number--medium {
                        width: 130px;
                    }
                }

                .li-input > span {
                    display: inline-block;
                    width: 100px;
                    margin-right: 10px;
                    text-align: right;
                }
            }
        }
    }
</style>
<style lang="scss">
    .schoolLogeidt {
        .schoolLogFile .file_title {
            font-size: 14px;
            color: #000;
        }
    }
</style>
