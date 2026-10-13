<template>
    <div class="app-container calendar-list-container" id="primarySignupSetting">
        <div>
            <el-button size="medium" @click="saveHandler" type="primary">保存</el-button>
        </div>
        <template v-for="level1Item in level1">
            <div class="header">
                <span class="color-block"></span>
                <el-checkbox
                    v-if="level1CheckNameList.includes(level1Item.fieldName)"
                    @change="onLevel1FieldValueChange(level1Item)"
                    v-model="level1Item.fieldValue"
                    :false-label="2"
                    :true-label="1"
                >
                    {{level1Item.fieldDesc}}
                </el-checkbox>
                <span v-else>{{level1Item.fieldDesc}}</span>
            </div>
            <div class="content"
                 v-show="!level1CheckNameList.includes(level1Item.fieldName) || level1Item.fieldValue == 1">
                <template v-for="level2Item in getLevel2(level1Item.fieldType)">
                    <el-radio v-if="radioNameList.includes(level2Item.fieldName)"
                              v-model="radioValues[level2Item.fieldName]" :label="level2Item.fieldDesc">
                        {{level2Item.fieldDesc}}
                    </el-radio>
                    <span  v-else>
                         <div v-if="level1Item.fieldType === 'newshenhe'">
                              <el-checkbox        
                                    v-model="level2Item.fieldValue"
                                    :disabled="disabledNameList.includes(level2Item.fieldName)"
                                    :false-label="2"
                                    :true-label="1"
                                >
                                {{level2Item.fieldDesc}}
                            </el-checkbox>
                            <div class="inputbox" v-if="level2Item.fieldValue==1&&level2Item.fieldName!='newshenhefour'"> 
                                  <el-input
                                    type="textarea"
                                    :rows="4"
                                    :placeholder="'请输入通过'+level2Item.fieldDesc"
                                    v-model="level2Item.fieldRemark.onetxt">
                                    </el-input>
                                    <el-input
                                    type="textarea"
                                    :rows="4"
                                    :placeholder="'请输入未通过'+level2Item.fieldDesc"
                                    v-model="level2Item.fieldRemark.twotxt">
                                    </el-input>

                            </div>
                          

                    </div>
                         <el-checkbox    
                         v-else                   
                        v-model="level2Item.fieldValue"
                        :disabled="disabledNameList.includes(level2Item.fieldName)"
                        :false-label="2"
                        :true-label="1"
                        @change="handleChange(level2Item)"
                    >
                        {{level2Item.fieldDesc}}
                    </el-checkbox>
                    </span>
                   
                   

                </template>
                <div v-if="level1Item.fieldName === 'talentStuInfo' && isShowMasterRecommend">
                    <!-- <div class="header">
                        <span class="color-block"></span>
                        <span>校长推荐表</span>
                    </div> -->
                    <!-- <div class="content" style="width: 250px;"> -->
                        <uploader pathPrefix="zhaoshengbaominggaozhong" module="zhaoshengbaominggaozhong" moduleCode="248" :successCallback="uploadSuccessCallback"
                                :deleteCallback="uploadDeleteCallback" :extList="['doc', 'docx', 'xls', 'xlsx', 'pdf']"
                                v-model="files" :multiple="false"></uploader>
                    <!-- </div> -->
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import {
        saveFieldList,
        getEnrollStuFieldBySchoolId,
        saveSchoolMasterRecommend,
        deleteSchoolMasterRecommend,
        getSchoolMasterRecommendInfo
    } from '@/api/schoolSignupHigh.js';

    export default {
        name: "singupSetting",
        data: function () {
            return {
                files: [],
                linkageKeys: ['zeroTestGrade','firstTestGrade', 'thirdUppFinalExamGrade', 'thirdUppMidTermGrade','secLowFinalExamGrade'],
                level1CheckNameList: ['talentStuInfo', 'zyxx','cjxx','ryxx'],
                disabledNameList: ['graduateSchoolCode',
                    'stuName',
                    'idCard',
                    'loginPhone',
                    'subjectStudentCode'
                ],
                radioNameList: ['loginType'],
                radioValues: {
                    loginType: "短信验证码登录"
                },
                settingList: [{
                    "fieldValue": 2,
                    "fieldName": "stuBaseInfo",
                    "fieldDesc": "登录方式",
                    fieldRemark: '',
                    fieldType: 'login_type',
                    isFirst: 1,
                },
                {
                    "fieldValue": 1,
                    "fieldName": "loginType",
                    "fieldDesc": "短信验证码登录",
                    "fieldType": "login_type",
                    "isFirst": "2",
                    "orderVal": "1",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "loginType",
                    "fieldDesc": "身份证+姓名登录",
                    "fieldType": "login_type",
                    "isFirst": "2",
                    "orderVal": "1",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "stuBaseInfo",
                    "fieldDesc": "基本信息登记",
                    fieldRemark: '',
                    fieldType: 'stu_basic_info',
                    isFirst: 1,
                },
                {
                    "fieldValue": 2,
                    "fieldName": "applySchoolCode",
                    "fieldDesc": "报名学校",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "2",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "recordNum",
                    "fieldDesc": "建档号",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "3",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "locateCountryCode",
                    "fieldDesc": "所在区县",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "4",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 1,
                    "fieldName": "graduateSchoolCode",
                    "fieldDesc": "所在学校",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "5",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "locateClassName",
                    "fieldDesc": "初三所在班级",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "6",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 1,
                    "fieldName": "stuName",
                    "fieldDesc": "学生姓名",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "7",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 1,
                    "fieldName": "idCard",
                    "fieldDesc": "学生身份证号",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "8",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "examNum",
                    "fieldDesc": "准考证号",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "9",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "isFreshGraduate",
                    "fieldDesc": "是否应届毕业生",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "9",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "parentName",
                    "fieldDesc": "家长姓名",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "10",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 1,
                    "fieldName": "loginPhone",
                    "fieldDesc": "家长号码1",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "11",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "loginPhone2",
                    "fieldDesc": "家长号码2",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "38",
                    "fieldRemark": ""
                },                
                {
                    "fieldValue": 2,
                    "fieldName": "loginPhone3",
                    "fieldDesc": "家长号码3",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "57",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "qqNumber",
                    "fieldDesc": "家长QQ号",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "66",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "basicInfoRemark",
                    "fieldDesc": "备注",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "12",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "homeAddress",
                    "fieldDesc": "家庭住址",
                    "fieldType": "stu_basic_info",
                    "isFirst": "2",
                    "orderVal": "44",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "cjxx",
                    "fieldDesc": "成绩信息",
                    fieldRemark: '',
                    fieldType: 'stu_midTest_info',
                    isFirst: 1,
                },
                {
                    "fieldValue": 2,
                    "fieldName": "secLowFinalExamGrade",
                    "fieldDesc": "初二下期末成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "58",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "thirdUppMidTermGrade",
                    "fieldDesc": "初三上期中成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "13",
                    "fieldRemark": ""
                },
                
                // {
                //     "fieldValue": 2,
                //     "fieldName": "thirdUppMidTermGradeNo",
                //     "fieldDesc": "初三上期中成绩名次",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "14",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "thirdUppFinalExamGrade",
                    "fieldDesc": "初三上期末成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "15",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "thirdUppFinalExamGradeNo",
                //     "fieldDesc": "初三上期末成绩名次",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "16",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "thirdLowMidTermGrade",
                    "fieldDesc": "初三下期中成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "17",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "thirdLowMidTermGradeNo",
                //     "fieldDesc": "初三下期中成绩名次",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "18",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "thirdLowFinalExamGrade",
                    "fieldDesc": "初三下期末成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "19",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "thirdLowFinalExamGradeNo",
                //     "fieldDesc": "初三下期末成绩名次",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "20",
                //     "fieldRemark": ""
                // },
                 {
                    "fieldValue": 2,
                    "fieldName": "zeroTestGrade",
                    "fieldDesc": "0模成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "221",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "firstTestGrade",
                    "fieldDesc": "区一模成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "21",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "firstTestNo",
                //     "fieldDesc": "一模年级名次",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "22",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "secTestGrade",
                    "fieldDesc": "区二模成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "23",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "secTestNo",
                //     "fieldDesc": "二模年级名次",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "24",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "score",
                    "fieldDesc": "中考成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "25",
                    "fieldRemark": ""
                },
                 {
                    "fieldValue": 2,
                    "fieldName": "needTranscript",
                    "fieldDesc": "上传成绩单",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "59",
                    "fieldRemark": ""
                },
                 {
                    "fieldValue": 2,
                    "fieldName": "showSubjectsScore",
                    "fieldDesc": "需要学科成绩",
                    "fieldType": "stu_midTest_info",
                    "isFirst": "2",
                    "orderVal": "60",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "midTestCityNo",
                //     "fieldDesc": "中考全市排名",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "26",
                //     "fieldRemark": ""
                // },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "midTestCountryNo",
                //     "fieldDesc": "中考城区排名",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "27",
                //     "fieldRemark": ""
                // },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "midTestInfoRemark",
                //     "fieldDesc": "备注(选填)",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "28",
                //     "fieldRemark": ""
                // },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "midTestPicJson",
                //     "fieldDesc": "中考成绩单",
                //     "fieldType": "stu_midTest_info",
                //     "isFirst": "2",
                //     "orderVal": "32",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "ryxx",
                    "fieldDesc": "荣誉信息",
                    "fieldType": "stu_honor_info",
                    "isFirst": 1,
                    "orderVal": "49",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "sshCount",
                    "fieldDesc": "市三好次数",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "50",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "qshCount",
                    "fieldDesc": "区三好次数",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "51",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "xshCount",
                    "fieldDesc": "校三好次数",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "52",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "syxxsgbCount",
                    "fieldDesc": "市优秀学生干部次数",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "53",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "qyxxsgbCount",
                    "fieldDesc": "区优秀学生干部次数",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "54",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "xyxxsgbCount",
                    "fieldDesc": "校优秀学生干部次数",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "55",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "otherAwardInfo",
                    "fieldDesc": "其他获奖",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "56",
                    "fieldRemark": ""
                },
                 {
                    "fieldValue": 2,
                    "fieldName": "honorAwardPics",
                    "fieldDesc": "获奖证书",
                    "fieldType": "stu_honor_info",
                    "isFirst": 2,
                    "orderVal": "61",
                    "fieldRemark": ""
                },
                
                {
                    "fieldValue": 2,
                    "fieldName": "talentStuInfo",
                    "fieldDesc": "特长生信息",
                    "fieldType": "stu_talent_info",
                    "isFirst": 1,
                    "orderVal": "47",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 1,
                    "fieldName": "subjectStudentCode",
                    "fieldDesc": "特长生（首选）",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "32",
                    "fieldRemark": ""
                },
                 {
                    "fieldValue": 2,
                    "fieldName": "spareSubStuCode",
                    "fieldDesc": "特长生（备选）",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "62",
                    "fieldRemark": ""
                },
                 {
                    "fieldValue": 2,
                    "fieldName": "isObey",
                    "fieldDesc": "是否服从调剂",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "63",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "zeroTestGrade",
                    "fieldDesc": "0模成绩",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "221",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "firstTestGrade",
                    "fieldDesc": "区一模成绩",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "21",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "secLowFinalExamGrade",
                    "fieldDesc": "初二下期末成绩",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "13",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "thirdUppFinalExamGrade",
                    "fieldDesc": "初三上期末成绩",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "15",
                    "fieldRemark": ""
                },
                 
                {
                    "fieldValue": 2,
                    "fieldName": "thirdUppMidTermGrade",
                    "fieldDesc": "初三上期中成绩",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "13",
                    "fieldRemark": ""
                },
               
                // {
                //     "fieldValue": 2,
                //     "fieldName": "ssqjjshjqkInfo",
                //     "fieldDesc": "省、市、区级学科竞赛获奖情况",
                //     "fieldType": "stu_talent_info",
                //     "isFirst": "2",
                //     "orderVal": "40",
                //     "fieldRemark": ""
                // },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "xjjshjqkInfo",
                //     "fieldDesc": "校级学科竞赛获奖情况",
                //     "fieldType": "stu_talent_info",
                //     "isFirst": "2",
                //     "orderVal": "41",
                //     "fieldRemark": ""
                // },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "ssqjzhryhjqkInfo",
                //     "fieldDesc": "省、市、区级综合荣誉获奖情况",
                //     "fieldType": "stu_talent_info",
                //     "isFirst": "2",
                //     "orderVal": "42",
                //     "fieldRemark": ""
                // },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "xjzhryhjqkInfo",
                //     "fieldDesc": "校级综合荣誉获奖情况",
                //     "fieldType": "stu_talent_info",
                //     "isFirst": "2",
                //     "orderVal": "43",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "subjectAward",
                    "fieldDesc": "对应学科获奖证书",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "39",
                    "fieldRemark": ""
                },
                // {
                //     "fieldValue": 2,
                //     "fieldName": "growthFoot",
                //     "fieldDesc": "成长手册",
                //     "fieldType": "stu_talent_info",
                //     "isFirst": "2",
                //     "orderVal": "39",
                //     "fieldRemark": ""
                // },
                {
                    "fieldValue": 2,
                    "fieldName": "masterRecommend",
                    "fieldDesc": "校长推荐表",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "48",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "otherTalentInfo",
                    "fieldDesc": "其他",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "46",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "subjectTalentPicJson",
                    "fieldDesc": "特长生报名截图",
                    "fieldType": "stu_talent_info",
                    "isFirst": "2",
                    "orderVal": "60",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "zyxx",
                    "fieldDesc": "志愿信息",
                    "fieldType": "stu_wish_info",
                    "isFirst": 1,
                    "orderVal": "36",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "indexStudent",
                    "fieldDesc": "指标生",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "30",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "indexSchoolCode",
                    "fieldDesc": "指标学校",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "31",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "firBatchFirWishSchoolCode",
                    "fieldDesc": "A志愿",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "33",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "firBatchSecWishSchoolCode",
                    "fieldDesc": "B志愿",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "34",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "secBatchFirWishSchoolCode",
                    "fieldDesc": "C志愿",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "35",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "secBatchSecWishSchoolCode",
                    "fieldDesc": "D志愿",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "36",
                    "fieldRemark": ""
                },
                {
                    "fieldValue": 2,
                    "fieldName": "picJson",
                    "fieldDesc": "志愿表截图",
                    "fieldType": "stu_wish_info",
                    "isFirst": "2",
                    "orderVal": "37",
                    "fieldRemark": ""
                },
                {
                    "fieldName": "",
                    "fieldDesc": "审核设置",
                    fieldRemark: '',
                    fieldType: 'newshenhe',
                    isFirst: 1,
                },
                {
                    fieldValue: 2,
                    fieldName: "newshenheone",
                    fieldDesc: "预审意见",//展示，名字
                    fieldRemark: {
                        onetxt:'',
                        twotxt:''
                    },
                    fieldType: 'newshenhe',//同一类型一样
                    isFirst: 2,//类型是标题还是子结构
                    
                },
                {
                    fieldValue: 2,
                    fieldName: "newshenhetwo",
                    fieldDesc: "二审意见",//展示，名字
                    fieldRemark: {
                        onetxt:'',
                        twotxt:''
                    },
                    fieldType: 'newshenhe',//同一类型一样
                    isFirst: 2,//类型是标题还是子结构
                },
                {
                    fieldValue: 2,
                    fieldName: "newshenhethree",
                    fieldDesc: "三审意见",//展示，名字
                    fieldRemark: {
                        onetxt:'',
                        twotxt:''
                    },
                    fieldType: 'newshenhe',//同一类型一样
                    isFirst: 2,//类型是标题还是子结构
                },
                 {
                    fieldValue: 2,
                    fieldName: "newshenhefour",
                    fieldDesc: "开放审核查询",//展示，名字
                    fieldRemark: {},
                    fieldType: 'newshenhe',//同一类型一样
                    isFirst: 2,//类型是标题还是子结构
                },
                ]
            }
        },
        components: {Uploader},
        computed: {
            level1() {
                return this.settingList.filter(item => item.isFirst === 1)
            },
            isShowMasterRecommend() {
                return this.settingList.find(item => item.fieldName == 'masterRecommend').fieldValue == 1;
            }
        },
        created() {
            getSchoolMasterRecommendInfo()
                .then(res => res.data)
                .then(data => {
                    if (data.data && data.data.id !== 0) {
                        this.files = [data.data];
                    }
                })
            getEnrollStuFieldBySchoolId()
                .then(res => res.data)
                .then(data => {
                    console.log(data.data);
                    data.data.forEach(item => {
                        if (this.radioNameList.includes(item.fieldName)) {
                            this.radioValues[item.fieldName] = item.fieldDesc;
                        } else {
                            const settingObj = this.settingList.find(settingItem => settingItem.fieldName == item.fieldName  && settingItem.fieldType == item.fieldType);
                             if (settingObj) {
                                settingObj.fieldValue = 1;
                                if(item.fieldType=="newshenhe"){
                                   settingObj.fieldRemark=JSON.parse(item.fieldRemark)
                                }
                            }
                        }

                    })
                })
        },
        methods: {
            handleChange(item) {
                console.log(this.linkageKeys.includes(item.fieldName), item);
                if (this.linkageKeys.includes(item.fieldName)) {
                    this.settingList.forEach(i => {
                        if (i.fieldName === item.fieldName) {
                            i.fieldValue = item.fieldValue
                        }
                    })
                }
            },
            onLevel1FieldValueChange(item) {
                // if (item.fieldValue == 2) {
                //     this.settingList.forEach(settingItem => {
                //         if (settingItem.fieldType == item.fieldType) {
                //             settingItem.fieldValue = 2;
                //         }
                //     })
                // }
            },
            getItem(fieldName) {
                let result = null;
                this.settingList.forEach(item => {
                    if (!result) {
                        if (item.fieldName === fieldName) {
                            result = item;
                        } else if (item.children && item.children.length !== 0) {
                            item.children.forEach(item => {
                                if (!result) {
                                    if (item.fieldName === fieldName) {
                                        result = item;
                                    }
                                }
                            });
                        }
                    }
                });
                return result;
            },
            getLevel2(fieldType) {
                return this.settingList.filter(item => item.fieldType === fieldType && item.isFirst == 2);
            },
            saveHandler() {
                const fieldList = [];
                this.settingList.forEach((item, index) => {
                    if (item.isFirst == 2 || this.level1CheckNameList.includes(item.fieldName)) {
                        if (this.radioNameList.includes(item.fieldName)) {
                            if (this.radioValues[item.fieldName] == item.fieldDesc) {
                                fieldList.push({
                                    fieldDesc: item.fieldDesc,
                                    fieldName: item.fieldName,
                                    fieldRemark: item.fieldRemark,
                                    fieldType: item.fieldType,
                                    isFirst: item.isFirst,
                                    fieldValue: item.fieldValue,
                                    orderVal: fieldList.length
                                });
                            }
                        } else {
                            if (item.fieldValue == 1) {
                                fieldList.push({
                                    fieldDesc: item.fieldDesc,
                                    fieldName: item.fieldName,
                                    fieldRemark: item.fieldRemark,
                                    fieldType: item.fieldType,
                                    isFirst: item.isFirst,
                                    fieldValue: 1,
                                    orderVal: fieldList.length
                                });
                            }
                        }
                    }
                });
                saveFieldList(fieldList)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message({
                                message: '设置成功',
                                type: 'success'
                            });
                        }
                    });
            },
            uploadSuccessCallback(item) {
                saveSchoolMasterRecommend({
                    fileId: 123,
                    fileName: item.fileName,
                    fileUrl: item.fileUrl,
                })
            },
            uploadDeleteCallback(item) {
                deleteSchoolMasterRecommend()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";

    @include globalstyle;
    .inputbox{
        padding: 10px 0;
        overflow: hidden;
        .el-textarea{
            width: 49%;
            float: left;
            margin-right: 1%
        }
    }
    .second-header-wrap {
        left: 0;
        width: 92%;
        min-width: 1200px;
        background-color: #fff;
        z-index: 1000;
        padding: 20px 0 0 0;
    }

    .header {
        font-size: 18px;
        width: 250px;
        white-space: nowrap;
        margin: 16px 5px 6px 0;
        padding: 0 0 10px 0;

        .color-block {
            @include wh(12px, 12px);
            @include middleIB;
            background-color: #20a0ff;
            margin-right: 5px;
        }
    }

    .content {
        margin: 10px 0;
        padding-left: 30px;
        font-size: 14px;
        width: 90%;
    }

    .textarea-container {
        display: inline-block;
        vertical-align: top;
        width: 70%;
    }

    .radio-label {
        margin-right: 30px;
    }
</style>
<style lang="scss">
    #primarySignupSetting {
        .el-checkbox__label {
            vertical-align: top;
            margin-bottom: 10px;
        }

        .el-radio:last-child {
            margin-right: 30px !important;
        }

        .el-checkbox:last-child {
            margin-right: 30px !important;
        }
    }
</style>
