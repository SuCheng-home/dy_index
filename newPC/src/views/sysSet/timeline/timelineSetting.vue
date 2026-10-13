<template>
    <div class="app-container calendar-list-container" id="timelineSetting">
        <div class="filter-container">
            <el-button type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" @click="addTimeCard()" size="medium">添加作息时间</el-button>
            <el-button type="primary" @click="listTemplateBySchoolIdLastSchTime()" size="medium">复制上学期设置</el-button>
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}">
            <el-row :gutter="20">
                <el-col :lg="24" :xl="12" v-for="(timelineItem, index) in timelineList" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="template-name">{{timelineItem.templateName}}&nbsp;&nbsp;<i class="fa fa-edit"
                                                                                                    @click="changeName(timelineItem)"></i></span>
                            <el-button style="float: right;margin-left: 5px;" size="small" type="danger"
                                       @click="deleteHandler(timelineItem, index)" v-show="timelineList.length > 1">删除
                            </el-button>&nbsp;&nbsp;
                            &nbsp;&nbsp;<el-button style="float: right;margin-left: 5px;" size="small" type="primary"
                                                   v-show="timelineItem.id" @click="copyHandler(timelineItem)">
                            复制
                        </el-button>&nbsp;&nbsp;
                            &nbsp;&nbsp;<el-button style="float: right;margin-left: 5px;" size="small" type="primary"
                                                   @click="saveFunc(timelineItem)">保存
                        </el-button>&nbsp;&nbsp;
                            &nbsp;&nbsp;<el-button style="float: right;margin-left: 5px;" size="small" type="primary"
                                                   @click="addTimeItem(timelineItem, index)">添加安排
                        </el-button>&nbsp;&nbsp;
                        </div>
                        <div class="timeline-item-list">
                            <div class="timeline-item">
                <span class="timeline-item__label">教师上班时间：
                </span>
                                <el-time-picker
                                    format="HH:mm"
                                    default-value="2010-10-10 00:00:00"
                                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                                    style="width: 200px;margin: 0 20px;"
                                    v-model="timelineItem.timeList.teaAttend.time"></el-time-picker>
                                之前
                                <div class="error-msg">{{timelineItem.timeList.teaAttend.errorMsg}}</div>
                            </div>
                            <div class="timeline-item">
                <span class="timeline-item__label">学生到校时间：
                </span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model="timelineItem.timeList.stuAttend.time"></el-time-picker>
                                之前
                                <div class="error-msg">{{timelineItem.timeList.stuAttend.errorMsg}}</div>
                            </div>
                            <div class="timeline-item" v-for="(item, index) in timelineItem.timeList.morning">
                                <span class="timeline-item__label"><i class="fa fa-edit"
                                                                      @click="changeName(item)"></i><i
                                    class="fa fa-trash" @click="deleteTimeItem(timelineItem.timeList.morning, index)"
                                    v-show="item.customize == 1"></i>{{item.alias}}：</span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.startTime"></el-time-picker>
                                ——
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.endTime"></el-time-picker>
                                <div class="error-msg">{{item.errorMsg}}</div>
                                 <el-checkbox :true-label="2" :false-label="1" v-model="item.isBeh" >可评价</el-checkbox>
                            </div>
                            <div class="timeline-item" v-for="(item, index) in timelineItem.timeList.forenoon">
                                <span class="timeline-item__label">
                                    <i class="fa fa-edit" @click="changeName(item)"></i><i class="fa fa-trash"
                                                                                           v-show="item.customize == 1"
                                                                                           @click="deleteTimeItem(timelineItem.timeList.forenoon, index)"></i>{{item.alias}}：</span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.startTime"></el-time-picker>
                                ——
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.endTime"></el-time-picker>
                                <div class="error-msg">{{item.errorMsg}}</div>
                                 <el-checkbox :true-label="2" :false-label="1" v-model="item.isBeh" >可评价</el-checkbox>
                            </div>
                            <div class="timeline-item" v-for="(item, index) in timelineItem.timeList.noon">
                                <span class="timeline-item__label"><i class="fa fa-edit"
                                                                      @click="changeName(item)"></i><i
                                    class="fa fa-trash" @click="deleteTimeItem(timelineItem.timeList.noon, index)"
                                    v-show="item.customize == 1"></i>{{item.alias}}：</span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.startTime"></el-time-picker>
                                ——
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.endTime"></el-time-picker>
                                <div class="error-msg">{{item.errorMsg}}</div>
                                <el-checkbox :true-label="2" :false-label="1" v-model="item.isBeh" >可评价</el-checkbox>
                            </div>
                            <div class="timeline-item" v-for="(item, index) in timelineItem.timeList.afternoon">
                                <span class="timeline-item__label"><i class="fa fa-edit"
                                                                      @click="changeName(item)"></i><i
                                    class="fa fa-trash" @click="deleteTimeItem(timelineItem.timeList.afternoon, index)"
                                    v-show="item.customize == 1"></i>{{item.alias}}：</span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.startTime"></el-time-picker>
                                ——
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.endTime"></el-time-picker>

                                <div class="error-msg">{{item.errorMsg}}</div>
                                 <el-checkbox :true-label="2" :false-label="1" v-model="item.isBeh" >可评价</el-checkbox>
                            </div>
                            <div class="timeline-item" v-for="(item, index) in timelineItem.timeList.night">
                                <span class="timeline-item__label"><i class="fa fa-edit"
                                                                      @click="changeName(item)"></i><i
                                    class="fa fa-trash" @click="deleteTimeItem(timelineItem.timeList.night, index)"
                                    v-show="item.customize == 1"></i>{{item.alias}}：</span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.startTime"></el-time-picker>
                                ——
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="item.endTime"></el-time-picker>
                                <div class="error-msg">{{item.errorMsg}}</div>
                                 <el-checkbox :true-label="2" :false-label="1" v-model="item.isBeh" >可评价</el-checkbox>
                            </div>
                            <div class="timeline-item">
                <span class="timeline-item__label">教师下班时间：
                </span>
                                <el-time-picker format="HH:mm" default-value="2010-10-10 00:00:00"
                                                :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                    }"
                                                style="width: 200px;margin: 0 20px;"
                                                v-model.trim="timelineItem.timeList.leave.time"></el-time-picker>
                                之后
                                <div class="error-msg">{{timelineItem.timeList.leave.errorMsg}}</div>
                            </div>
                        </div>
                        <div class="week-container">
                            <div>
                                使用日期：
                            </div>
                            <div class="week-checkbox-container">
                                <el-checkbox-group v-model="timelineItem.weeks" @change="weekChangeHandler">
                                    <el-checkbox :label="1"
                                                 :disabled="selectedWeeks.has(1) && !timelineItem.weeks.includes(1)">周一
                                    </el-checkbox>
                                    <el-checkbox :label="2"
                                                 :disabled="selectedWeeks.has(2) && !timelineItem.weeks.includes(2)">周二
                                    </el-checkbox>
                                    <el-checkbox :label="3"
                                                 :disabled="selectedWeeks.has(3) && !timelineItem.weeks.includes(3)">周三
                                    </el-checkbox>
                                    <el-checkbox :label="4"
                                                 :disabled="selectedWeeks.has(4) && !timelineItem.weeks.includes(4)">周四
                                    </el-checkbox>
                                    <el-checkbox :label="5"
                                                 :disabled="selectedWeeks.has(5) && !timelineItem.weeks.includes(5)">周五
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>

                        </div>
                    </el-card>

                </el-col>
            </el-row>
            <el-dialog title="添加作息安排" :visible.sync="isShowAddTimeItemDialog" size="tiny" width="600px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-form :model="addTimeItemForm" :rules="rules" ref="addTimeItemForm">
                    <el-form-item label="名称" label-width="120px" prop="alias">
                        <el-input type="text" v-model="addTimeItemForm.alias" :value="''"
                                  @blur="addTimeItemForm.alias = addTimeItemForm.alias.trim()" :maxlength="50">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="添加位置" label-width="120px" prop="refTimeItem">
                        <el-select v-model="addTimeItemForm.refTimeItem" placeholder="请选择添加位置">
                            <el-option :label="item.alias" :value="`morning||${index}`" :key="index"
                                       v-for="(item, index) in currentTimelineItem.timeList.morning"></el-option>
                            <el-option :label="item.alias" :value="`forenoon||${index}`" :key="index"
                                       v-for="(item, index) in currentTimelineItem.timeList.forenoon"></el-option>
                            <el-option :label="item.alias" :value="`noon||${index}`" :key="index"
                                       v-for="(item, index) in currentTimelineItem.timeList.noon"></el-option>
                            <el-option :label="item.alias" :value="`afternoon||${index}`" :key="index"
                                       v-for="(item, index) in currentTimelineItem.timeList.afternoon"></el-option>
                            <el-option :label="item.alias" :value="`night||${index}`" :key="index"
                                       v-for="(item, index) in currentTimelineItem.timeList.night"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" label-width="120px">
                        <el-radio-group v-model="addTimeItemForm.isBefore">
                            <el-radio :label="1">之前</el-radio>
                            <el-radio :label="2">之后</el-radio>
                        </el-radio-group>
                    </el-form-item> 
                    <el-form-item label="所属时段" label-width="120px">
                        <el-radio-group v-model="addTimeItemForm.type">
                            <el-radio :label="1">早上</el-radio>
                            <el-radio :label="2">上午</el-radio>
                            <el-radio :label="3">中午</el-radio>
                            <el-radio :label="4">下午</el-radio>
                            <el-radio :label="5">晚上</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowAddTimeItemDialog = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="addTimeItemComfirm()" size="medium">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改" :visible.sync="isShowChange" size="tiny" width="600px"
                       :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-form :model="changeForm" :rules="rules" ref="changeForm">
                    <el-form-item label="名称" label-width="120px" prop="alias">
                        <el-input type="text" v-model="changeForm.alias" :value="''"
                                  @blur="changeForm.alias = changeForm.alias.trim()" :maxlength="50">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowChange = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="changeNameConfirm()" size="medium">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import mixin from '@/mixins/windowResize';
    import {
        classScheduleSet,
        listTemplateBySchoolId,
        addScheduleTemplate,
        deleteScheduleTemplate,
        copyScheduleTemplate,listTemplateBySchoolIdLastSchTime
    } from '@/api/timeline';
    import {
        mapGetters
    } from 'vuex';


    export default {
        name: "timelineSetting",
        data() {
            return {
                sectionList: ['morning', 'forenoon', 'noon', 'afternoon', 'night'],
                timelineList: [],
                isShowAddTimeItemDialog: false,
                addTimeItemForm: {
                    alias: '',
                    refTimeItem: '',
                    type:1,
                    isBeh:1,
                    isBefore: 1 //1 是
                },
                changeForm: {
                    alias: ''
                },
                rules: {
                    alias: [
                        {required: true, message: "请输入名称！", trigger: "blur"},
                    ],
                    refTimeItem: [{required: true, message: '请选择添加位置', trigger: 'blur'}],

                },
                currentTimelineItem: {
                    timeList: {}
                },
                currentTimelineItemIndex: null,

                isShowChange: false,
                currentChangeObj: null,

                classSheduleData: null,
                selectedWeeks: new Set()
            }
        },
        computed: {
            ...mapGetters(['isStandalone', 'schoolInfo'])
        },
        mounted() {
            classScheduleSet({
                schoolId: this.schoolInfo.id
            })
                .then(res => res.data)
                .then(data => {
                    this.classSheduleData = data.data;
                    this.listTemplateBySchoolIdFunc();
                });
        },
        mixins: [mixin],
        methods: {
            listTemplateBySchoolIdLastSchTime(){
                this.$confirm('是否复制上学期设置?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            listTemplateBySchoolIdLastSchTime()
                            .then(res => res.data)
                            .then(data => {
                                if (data.data && data.data.length === 0) {
                                     this.$message.error('上学期设置为空!');
                                } else {
                                    this.initTimeline(data.data,1);
                                    this.$message({
                                    type: 'success',
                                    message: '复制上学期设置成功!'
                                });

                                }
                            })
                           

                        }).catch(() => {
                        });
            },
            listTemplateBySchoolIdFunc() {
                return listTemplateBySchoolId()
                    .then(res => res.data)
                    .then(data => {
                        if (data.data && data.data.length === 0) {
                            this.addTimeCard();
                        } else {
                            this.initTimeline(data.data,0);

                        }
                    })
            },
            initTimeline(timelineList,num) {
                const resultTimelineList = [];
                timelineList.forEach(timelineItem => {
                    const weeks = [];
                    if(timelineItem.weeks) {
                        timelineItem.weeks.split(',').filter(week => week !== null && !Number.isNaN(week)).forEach(week => {
                            weeks.push(Number.parseInt(week));
                            this.selectedWeeks.add(Number.parseInt(week));
                        });
                    }

                    const pushTimelineItem = {
                        templateName: timelineItem.templateName,
                        id: num?0:timelineItem.id,
                        weeks,
                        timeList: {
                            teaAttend: {
                                errorMsg: '',
                                time: ''
                            },
                            stuAttend: {
                                errorMsg: '',
                                time: ''
                            },
                            leave: {
                                time: '',
                                errorMsg: ''
                            },
                            morning: [],
                            forenoon: [],
                            noon: [],
                            afternoon: [],
                            night: [],
                        }
                    };
                    let lastSection = 'morning';
                    timelineItem.timeList.forEach((item, index) => {
                        switch (item.type) {
                            case 6:
                                // 教师上班
                                pushTimelineItem.timeList.teaAttend = {
                                    errorMsg: '',
                                    time: `2010-10-10 ${item.startTime}:00`
                                };
                                break;
                            case 7:
                                // 教师下班
                                pushTimelineItem.timeList.leave = {
                                    errorMsg: '',
                                    time: `2010-10-10 ${item.startTime}:00`
                                };
                                break;
                            case 8:
                                pushTimelineItem.timeList.stuAttend = {
                                    errorMsg: '',
                                    time: `2010-10-10 ${item.startTime}:00`
                                };
                                // 学生入校
                                break;
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                                lastSection = this.sectionList[item.type - 1];
                                pushTimelineItem.timeList[lastSection].push({
                                    startTime: `2010-10-10 ${item.startTime}:00`,
                                    endTime: `2010-10-10 ${item.endTime}:00`,
                                    errorMsg: '',
                                    text: `早上 ${item.nodeLevelName}`,
                                    customize: item.customize,
                                    alias: item.alias,
                                    isBeh:item.isBeh,
                                    nodeNum:item.nodeNum,
                                    nodeLevelName:item.nodeLevelName,
                                    type:item.type
                                });
                                break;
                            case null:
                                pushTimelineItem.timeList[lastSection].push({
                                    startTime: `2010-10-10 ${item.startTime}:00`,
                                    endTime: `2010-10-10 ${item.endTime}:00`,
                                    errorMsg: '',
                                    text: `${item.alias}`,
                                    customize: 1,
                                    alias: item.alias,
                                    isBeh:item.isBeh,
                                    nodeNum:item.nodeNum,
                                    nodeLevelName:item.nodeLevelName,type:item.type
                                });
                                break;
                        }
                    });
                    resultTimelineList.push(pushTimelineItem);
                });
                this.timelineList = resultTimelineList;
            },
            changeName(item) {
                this.currentChangeObj = item;
                this.changeForm.alias = item.templateName || item.alias;
                this.isShowChange = true;
            },
            changeNameConfirm() {
                this.$refs.changeForm.validate(isValid => {
                    if (isValid) {
                        if (this.currentChangeObj.templateName) {
                            this.currentChangeObj.templateName = this.changeForm.alias;
                        } else {
                            this.currentChangeObj.alias = this.changeForm.alias;
                        }
                        this.isShowChange = false;
                    }
                })

            },
            weekChangeHandler() {
                const selectedWeeks = new Set();
                this.timelineList.forEach(item => {
                    item.weeks.forEach(value => {
                        selectedWeeks.add(value);
                    })
                });
                this.selectedWeeks = selectedWeeks;
            },
            getEmptyTimeList() {
                const timeList = {
                    teaAttend: {
                        errorMsg: '',
                        time: ''
                    },
                    stuAttend: {
                        errorMsg: '',
                        time: ''
                    },
                    leave: {
                        time: '',
                        errorMsg: ''
                    },
                    morning: [],
                    forenoon: [],
                    noon: [],
                    afternoon: [],
                    night: [],

                };
                ['morning', 'forenoon', 'noon', 'afternoon', 'night']
                    .forEach((key, keyIndex) => {
                        const sectionStr = ['早自习', '上午', '午自习', '下午', '晚自习'][keyIndex];
                        const array = [];
                        for (let index = 0; index < Number.parseInt(this.classSheduleData[key]); index++) {
                            array.push({
                                text: `${sectionStr}  第${index + 1}节`,
                                startTime: '',
                                endTime: '',
                                errorMsg: '',
                                customize: 0,
                                alias: `${sectionStr}  第${index + 1}节`
                            });
                        }
                        timeList[key] = array;
                    });
                return timeList;
            },
            addTimeCard() {
                this.timelineList.push({
                    id: null,
                    templateName: `作息时间${this.timelineList.length + 1}`,
                    timeList: this.getEmptyTimeList(),
                    weeks: []
                });
            },
            validateData(timelineItem) {
                let isValid = true;
                const timeList = timelineItem.timeList;
                if (timelineItem.alias === '') {
                    this.$message.error('作息时间名字不能为空');
                    isValid = false;
                }
                // else if (timelineItem.weeks.length === 0) {
                //     this.$message.error('使用日期至少设置一天');
                //     isValid = false;
                // }
                if (timeList.teaAttend.time === '') {
                    timeList.teaAttend.errorMsg = '不能为空';
                    isValid = false;
                } else if (moment(timeList.teaAttend.time).format('HH:mm') >= '12:00') {
                    timeList.teaAttend.errorMsg = '教师上班时间应小于12点';
                    isValid = false;
                } else {
                    timeList.teaAttend.errorMsg = '';
                }
                if (timeList.stuAttend.time === '') {
                    timeList.stuAttend.errorMsg = '不能为空';
                    isValid = false;
                } else if (moment(timeList.stuAttend.time).format('HH:mm') >= '12:00') {
                    timeList.stuAttend.errorMsg = '学生到校时间应小于12点';
                    isValid = false;
                } else if(timeList.morning.length !== 0 && timeList.forenoon.length !== 0) {
                    const firstStartTime = timeList.morning.length !== 0 ? timeList.morning[0].startTime : timeList.forenoon[0].startTime;

                    if (moment(timeList.stuAttend.time).format('HH:mm') > moment(firstStartTime).format('HH:mm')) {
                        timeList.stuAttend.errorMsg = '学生到校时间应小于或等于早自习或上午第一节课开始时间';
                        isValid = false;
                    } else {
                        timeList.stuAttend.errorMsg = '';
                    }
                }
                if (timeList.leave.time === '') {
                    timeList.leave.errorMsg = '不能为空';
                    isValid = false;
                } else if (moment(timeList.leave.time).format('HH:mm') <= '12:00') {
                    timeList.leave.errorMsg = '教师下班时间应大于12点';
                    isValid = false;
                } else {
                    timeList.leave.errorMsg = '';
                }

                ['morning', 'forenoon', 'noon', 'afternoon', 'night']
                    .forEach((key, keyIndex) => {
                        timeList[key].forEach(item => {
                            item.errorMsg = '';
                        });
                    });
                let time = '';
                ['morning', 'forenoon', 'noon', 'afternoon', 'night']
                    .forEach((key, keyIndex) => {
                        if (isValid) {
                            timeList[key].forEach(item => {

                                if (isValid) {
                                    if (item.startTime === '' || item.startTime === null || item.endTime === '' || item.endTime === null) {
                                        isValid = false;
                                        item.errorMsg = '不能为空';
                                    } else if (moment(item.startTime).format('HH:mm') >= moment(item.endTime).format('HH:mm')) {
                                        isValid = false;
                                        item.errorMsg = '同一节次的结束时间必须大于开始时间';
                                    } else if (moment(item.startTime).format('HH:mm') < time) {
                                        isValid = false;
                                        item.errorMsg = '节次的开始时间必须大于或等于上一节次的结束时间';
                                    } else {
                                        time = moment(item.endTime).format('HH:mm');
                                    }
                                }
                            })
                        }
                    });
                return isValid;
            },
            saveFunc(timelineItem) {
                if (this.validateData(timelineItem)) {
                    const args = {
                        templateName: timelineItem.templateName,
                        weeks: timelineItem.weeks.filter(week => week !== null && !Number.isNaN(week)).join(','),
                        timeList: []
                    };
                    if (timelineItem.id) {
                        args.id = timelineItem.id;
                    }

                    args.timeList.push({
                        startTime: moment(timelineItem.timeList.teaAttend.time).format('HH:mm'),
                        type: 6,
                    });
                    args.timeList.push({
                        startTime: moment(timelineItem.timeList.leave.time).format('HH:mm'),
                        type: 7,
                    });
                    args.timeList.push({
                        startTime: moment(timelineItem.timeList.stuAttend.time).format('HH:mm'),
                        type: 8,
                    });
                    let nodeNumber = 1;
                    ['morning', 'forenoon', 'noon', 'afternoon', 'night']
                        .forEach((key, keyIndex) => {
                            let nodeNum = 1;
                            let typeName = ['早上', '上午', '中午', '下午', '晚上'][keyIndex];
                            timelineItem.timeList[key].forEach((item, itemIndex) => {
                                const timeItem = {
                                    alias: item.alias,
                                    type: item.type,
                                    isBeh: item.isBeh,
                                    customize: item.customize,
                                    endTime: moment(item.endTime).format('HH:mm'),
                                    startTime: moment(item.startTime).format('HH:mm'),
                                    nodeNumber
                                };
                                if (item.customize == 0) {
                                    timeItem.type =item.type|| (keyIndex + 1);
                                    timeItem.nodeNum =item.nodeNum|| nodeNum;
                                    timeItem.nodeLevelName = item.alias||`${typeName}第${itemIndex + 1}节`;
                                    nodeNum++;

                                }else{
                                    timeItem.type=item.type
                                    timeItem.nodeNum =item.nodeNum||nodeNumber;
                                    timeItem.nodeLevelName = item.alias;
                                }
                                args.timeList.push(timeItem);
                                nodeNumber++;
                            });

                        });
                    addScheduleTemplate(args)
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: "保存成功！",
                                    type: 'success'
                                });
                                this.listTemplateBySchoolIdFunc()
                                    .then(() => {
                                        this.weekChangeHandler();
                                    });
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }
            },
            deleteTimeItem(section, index) {
                section.splice(index, 1);

            },
            addTimeItem(timelineItem, index) {
                this.currentTimelineItem = timelineItem;
                this.currentTimelineItemIndex = index;
                this.addTimeItemForm = {
                    alias: '',
                    refTimeItem: '',
                    type:1,
                    isBeh:1,
                    isBefore: 1 //1 是
                };
                this.isShowAddTimeItemDialog = true;
            },
            addTimeItemComfirm() {
                this.$refs.addTimeItemForm.validate(isValid => {
                    if (isValid) {
                        const timeItem = {
                            text: this.addTimeItemForm.alias,
                            startTime: '',
                            endTime: '',
                            errorMsg: '',
                            customize: 1,
                            type: this.addTimeItemForm.type,
                            alias: this.addTimeItemForm.alias,
                            isBeh:1
                        };
                        const [section, index] = this.addTimeItemForm.refTimeItem.split('||');
                        let insertIndex = Number.parseInt(index);
                        if (this.addTimeItemForm.isBefore == 2) {
                            insertIndex = Number.parseInt(index) + 1;
                        }
                        this.currentTimelineItem.timeList[section].splice(insertIndex, 0, timeItem);
                        this.isShowAddTimeItemDialog = false;
                    }
                })
            },
            copyHandler(timelineItem) {
                copyScheduleTemplate({
                    id: timelineItem.id
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('复制成功');
                            this.selectedWeeks = new Set();
                            this.listTemplateBySchoolIdFunc();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            deleteHandler(timelineItem, index) {
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    new Promise((resolve, reject) => {
                        if (timelineItem.id) {
                            deleteScheduleTemplate({
                                id: timelineItem.id
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        resolve()
                                    } else {
                                        reject(data.msg)
                                    }
                                })
                        } else {
                            resolve()
                        }
                    })
                        .then(() => {
                            timelineItem.weeks.forEach(week => {
                                this.selectedWeeks.delete(Number.parseInt(week));
                            });

                            this.$message.success('删除成功');
                            this.timelineList.splice(index, 1);
                        })
                        .catch(error => {
                            this.$message.error(error);
                        })
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../styles/mixin';

    .page-main {
        overflow: auto;
        overflow-x: hidden;
    }

    #timelineSetting .el-button + .el-button {
        margin-left: 5px !important;
    }

    .filter-container {
        border-bottom: 1px solid #e7eaec;
    }
    .timeline-item-list {
        height: 770px;
        overflow-y: auto;
    }
    .timeline-item {
        width: 100%;
        margin: 10px auto;
        position: relative;

        .error-msg {
            position: absolute;
            color: #F56C6C;
            left: 7%;
            font-size: 12px;
        }
    }

    .timeline-item__label {
        @include middleIB;
        width: 10em;
        text-align: right;
    }

    .box-card {
        margin-bottom: 20px;
    }

    .template-name {
        display: inline-block;
        font-size: 20px;
        padding-top: 6px;
    }

    .fa {
        margin-right: 5px;
        color: #409EFF;
        cursor: pointer;
    }

    .fa.fa-trash {
        color: #F08080;
    }

    .week-container {
        & > * {
            @include middleIB;
        }

        .week-checkbox-container {
            width: 600px;
        }
    }
</style>
