<template>
    <div class="app-container calendar-list-container" id="signupStuDetail">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" @click="$router.back()" size="medium">返回</el-button>
                    <el-button @click="print()" type="primary" size="medium">打印</el-button>
                    <span v-if="listQuery.examType">
                         <el-button v-if="(listQuery.examType==1&&this.firstExamState==0)||(listQuery.examType==2&&this.secondExamState==0)||(listQuery.examType==3&&this.thridExamState==0)"  type="primary" size="medium" @click="funshowBox(1)">
                             <span v-if="listQuery.examType==1">预审通过</span>
                             <span v-if="listQuery.examType==2">二审通过</span>
                             <span v-if="listQuery.examType==3">三审通过</span>
                         </el-button>
                         <el-button v-if="(listQuery.examType==1&&this.firstExamState==0)||(listQuery.examType==2&&this.secondExamState==0)||(listQuery.examType==3&&this.thridExamState==0)" type="primary" size="medium" @click="funshowBox(2)">
                             <span v-if="listQuery.examType==1">预审不通过</span>
                             <span v-if="listQuery.examType==2">二审不通过</span>
                             <span v-if="listQuery.examType==3">三审不通过</span>
                         </el-button>
                    </span>
                   
                </el-col>
            </el-row>
        </div>
         <el-dialog :title="listQuery.examState==1?'通过':'不通过'" :visible.sync="showBox" width="500px" :close-on-press-escape='false'
               :close-on-click-modal='false' :modal-append-to-body='false'>
      <div>
        <el-form :model="listQuery" :rules="rules" ref="form" class="demo-ruleForm">
          <el-form-item label="" prop="examRemark">
            <el-input type="textarea" :rows="4" placeholder="请填写审批意见" maxlength="200" v-model="listQuery.examRemark"></el-input>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showBox = false">取 消</el-button>
        <el-button type="primary" @click="approvalEnrollStuInfo()" :loading="isLoading">确 定</el-button>
      </div>
    </el-dialog>
    <div class="body">
         <div ref="print" >
            <div class="content" id="content">
                <div class="print-header print-header--sub">
                    {{studentData.stuName}}&nbsp;&nbsp;&nbsp;&nbsp;{{['', '男', '女'][studentData.gender]}}&nbsp;&nbsp;&nbsp;&nbsp;登记ID号：{{studentData.orderNo}}
                </div>
                <div class="section section--general-info">
                    <div class="section-header"><i class="color-block"></i>
                        基本信息
                        <div class="section-header__bottom-block">
                        </div>
                    </div>
                    <div class="section-body">
                        <el-row>
                            <el-col span="8" v-if="isShowBySetting('applySchoolCode')" class="student-info-item">
                                <span class="item__label">报名学校：</span>
                                <span class="item__value">{{studentData.applySchoolName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item">
                                <span class="item__label">出生日期：</span>
                                <span class="item__value">{{studentData.birthday}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item">
                                <span class="item__label">身份证号：</span>
                                <span class="item__value">{{studentData.idCard}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('recordNum')">
                                <span class="item__label">建档号：</span>
                                <span class="item__value">{{studentData.recordNum || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('examNum')">
                                <span class="item__label">准考证号：</span>
                                <span class="item__value">{{studentData.examNum || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('parentName')">
                                <span class="item__label">家长姓名：</span>
                                <span class="item__value">{{studentData.parentName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item">
                                <span class="item__label">家长号码1：</span>
                                <span class="item__value">{{studentData.loginPhone}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('loginPhone2')">
                                <span class="item__label">家长号码2：</span>
                                <span class="item__value">{{studentData.loginPhone2 || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('qqNumber')">
                                <span class="item__label">家长QQ号：</span>
                                <span class="item__value">{{studentData.qqNumber || '--'}}</span>
                            </el-col>
                             <el-col span="8" class="student-info-item" v-if="isShowBySetting('loginPhone3')">
                                <span class="item__label">家长号码3：</span>
                                <span class="item__value">{{studentData.loginPhone3 || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('homeAddress')">
                                <span class="item__label">家庭住址：</span>
                                <span class="item__value">{{studentData.homeAddress || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('locateCountryCode')">
                                <span class="item__label">所在区县：</span>
                                <span class="item__value">{{studentData.locateCountryName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item">
                                <span class="item__label">毕业学校：</span>
                                <span class="item__value">江苏省南京市{{studentData.schoolCountyName}}{{studentData.graduateSchoolName}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('locateClassName')">
                                <span class="item__label">初三所在班级：</span>
                                <span class="item__value">{{studentData.locateClassName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('isFreshGraduate')">
                                <span class="item__label">是否应届毕业生：</span>
                                <span class="item__value">{{studentData.isFreshGraduate === 2 ? '是' : '否'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('basicInfoRemark')">
                                <span class="item__label">备注：</span>
                                <span class="item__value"> {{studentData.basicInfoRemark || '--' }}</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="section" v-if="scoreTableData.length && isShowBySetting('cjxx')">
                    <div class="section-header"><i class="color-block"></i>
                        成绩信息
                        <div class="section-header__bottom-block">
                        </div>
                    </div>
                    <div class="section-body">
                        <el-table border :data='scoreTableData' >
                            <el-table-column prop='name' label='考试名称'>
                            </el-table-column>
                            <el-table-column prop='sumScore' label='7门总分' >
                            </el-table-column>
                            <el-table-column prop='ywScore' label='语文' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <el-table-column prop='sxScore' label='数学' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <!-- <el-table-column prop='yysjScore' label='英语(试卷满分)' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column> -->
                            <el-table-column prop='yyScore' label='英语' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <el-table-column prop='wlScore' label='物理' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <el-table-column prop='hxScore' label='化学' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <el-table-column prop='lsScore' label='历史' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <el-table-column prop='zzScore' label='政治' v-if="isShowBySetting('showSubjectsScore')">
                            </el-table-column>
                            <el-table-column prop='classRank' label='班级排名'>
                            </el-table-column>
                            <el-table-column prop='gradeRank' label='年级排名'>
                            </el-table-column>
                            <el-table-column prop='areaRank' label='区排名'>
                            </el-table-column>
                            <el-table-column prop='isJointExam' label='是否联合体考试'>
                                <template slot-scope='{row}'>
                                    {{ row.isJointExam === 2 ? '是' : '否' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop='jointRank' label='联合体排名'>
                            </el-table-column>
                              <el-table-column label="成绩单" v-if="isShowBySetting('needTranscript')">
                                <template slot-scope='{row}'>
                                    <image-previewer v-if="row.scorePics&&row.scorePics.length" :images="getViewPic(row.scorePics)" tag="img"
                                                 text="查看图片"></image-previewer>
                                    <span v-else class="item__value">--</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="section " v-if="isShowBySetting('score')&& isShowBySetting('cjxx')">
                    <div class="section-header"><i class="color-block"></i>
                        中考成绩
                        <div class="section-header__bottom-block">
                        </div>
                    </div>
                    <div class="section-body">
                        <el-row>
                            <el-col span="6" class="student-info-item">
                                <span class="item__label">中考总分：</span>
                                <span class="item__value">{{studentData.score || '--'}}</span>
                            </el-col>
                            <el-col span="6" class="student-info-item">
                                <span class="item__label">全市排名：</span>
                                <span class="item__value">{{studentData.midTestCityNo || '--'}}</span>
                            </el-col>
                            <el-col span="6" class="student-info-item">
                                    <span class="item__label">
                                        成绩单：</span>
                                <span class="pic">
                                <image-previewer v-if="studentData.midTestPicList.length" :images="getViewPic(studentData.midTestPicList)" tag="img"
                                                 text="查看图片"></image-previewer>
                                <span v-else class="item__value">--</span>
                            </span>
                            </el-col>
                            <el-col span="6" class="student-info-item">
                                <span class="item__label">备注：</span>
                                <span class="item__value">{{studentData.midTestInfoRemark || '--'}}</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="section section--honor" v-if="isShowBySetting('ryxx')">
                    <div class="section-header"><i class="color-block"></i>
                        荣誉信息
                        <div class="section-header__bottom-block">
                        </div>
                    </div>
                    <div class="section-body">
                        <el-row>
                            <el-col v-if="isShowBySetting('sshCount')" span="8" class="student-info-item">
                                <span class="item__label">市三好次数：</span>
                                <span class="item__value">{{studentData.sshCount || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('qshCount')" span="8" class="student-info-item">
                                <span class="item__label">区三好次数：</span>
                                <span class="item__value">{{studentData.qshCount || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('xshCount')" span="8" class="student-info-item">
                                <span class="item__label">校三好次数：</span>
                                <span class="item__value">{{studentData.xshCount || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('syxxsgbCount')" span="8" class="student-info-item">
                                <span class="item__label">市优秀学生干部次数：</span>
                                <span class="item__value">{{studentData.syxxsgbCount || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('qyxxsgbCount')" span="8" class="student-info-item">
                                <span class="item__label">区优秀学生干部次数：</span>
                                <span class="item__value">{{studentData.qyxxsgbCount || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('xyxxsgbCount')" span="8" class="student-info-item">
                                <span class="item__label">校优秀学生干部次数：</span>
                                <span class="item__value">{{studentData.xyxxsgbCount || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('otherAwardInfo')" span="12" class="student-info-item">
                                <span class="item__label">其他获奖：</span>
                                <span class="item__value">{{studentData.otherAwardInfo || '--'}}</span>
                            </el-col>
                            <el-col v-if="isShowBySetting('honorAwardPics')" span="12" class="student-info-item">
                                <span class="item__label">获奖证书：</span>
                                <span class="item__value">
                                    <image-previewer v-if="studentData.honorAwardPicJson.length" :images="getViewPic(studentData.honorAwardPicJson)" tag="img"
                                                 text="查看图片"></image-previewer>
                                    <span v-else class="item__value">--</span>
                                </span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <template v-if="isShowBySetting('talentStuInfo') && studentData.isSubjectTalentStu === 2">
                    <div class="section">
                        <div class="section-header"><i class="color-block"></i>
                            特长生信息
                            <router-link :to="{
                                path: 'signupStuTalentTable',
                                query: { id, schoolId: schoolInfo.id,enKey }
                            }">
                                <small class="link-type">查看特长生信息表</small>
                            </router-link>
                        </div>
                        <div class="section-body">
                            <el-row>
                                <el-col span="8" class="student-info-item" v-if="isShowBySetting('subjectStudentCode')">
                                    <span class="item__label">{{keywordConfig.name}}（首选）：</span>
                                    <span class="item__value">{{studentData.subjectStuSchoolName}}{{studentData.subjectStudentName || '--'}}</span>
                                </el-col>
                                <el-col span="8" class="student-info-item" v-if="isShowBySetting('spareSubStuCode')">
                                    <span class="item__label">{{keywordConfig.name}}（备选）：</span>
                                    <span class="item__value">{{studentData.spareSubStuSchoolName}}{{studentData.spareSubStuName || '--'}}</span>
                                </el-col>
                                 <el-col span="8" class="student-info-item" v-if="isShowBySetting('isObey')">
                                    <span class="item__label">特长生志愿是否服从调剂：</span>
                                    <span class="item__value">{{studentData.isObey==1?'否':'是'}}</span>
                                </el-col>
                                <el-col span="8" class="student-info-item" v-if="isShowBySetting('masterRecommend')">
                                    <span class="item__label">是否有初中校长推荐：</span>
                                    <span class="item__value">{{['无', '有'][studentData.hasMasterRecommend]}}
                                        <!-- <template v-if="studentData.recommendPicList && studentData.recommendPicList.length !== 0">
                                            <image-previewer  :images="getViewPic(studentData.recommendPicList)" tag="img"
                                                            text="查看图片"></image-previewer>
                                        </template>
                                        <span v-else class="item__value">--</span> -->
                                    </span>
                                </el-col>
                                <el-col span="8" class="student-info-item" v-if="isShowBySetting('otherTalentInfo')">
                                    <span class="item__label">其他特长：</span>
                                    <span class="item__value">
                                        {{studentData.otherTalentInfo || '--'}}
                                    </span>
                                </el-col>
                                <el-col span="24" class="student-info-item" v-if="isShowBySetting('subjectTalentPicJson')">
                                    <span class="item__label">特长生报名截图：</span>
                                    <span class="pic" v-if="studentData.subjectTalentPicJson.length">
                                    <image-previewer :images="getViewPic(studentData.subjectTalentPicJson)" tag="img"
                                                    text="查看图片"></image-previewer>
                                                </span>
                                    <span v-else class="item__value">--</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section " v-if="isShowBySetting('subjectAward')">
                        <div class="subjectAward-header"><i class="color-block"></i>
                            <span>特长获奖</span>
                            <div v-if="keywordConfig.remark">
                                <small>{{keywordConfig.remark}}</small>
                            </div>
                            <template v-else>
                                <div>
                                    <small>学科特长生—请对应所报特长生学科，仅填写学科获市二等奖及以上奖项的名称及次数</small>
                                </div>
                                <div>
                                    <small>科技特长生—请对应招生简章，按要求填写相关获奖信息</small>
                                </div>
                            </template>
                        </div>
                        <div class="section-body">
                            <el-row v-for="item in studentData.subjectAwardJson" :key="item.id">
                                <el-col span="8" class="student-info-item">
                                    <span class="item__label">获奖名称：</span>
                                    <span class="item__value">{{item.awardName || '--'}}</span>
                                </el-col>
                                <el-col span="8" class="student-info-item">
                                    <span class="item__label">级别：</span>
                                    <span class="item__value">{{item.levelName || '--'}}</span>
                                </el-col>
                                <el-col span="8" class="student-info-item">
                                    <span class="item__label">图片：</span>
                                    <span class="item__value">
                                         <image-previewer v-if="item.awardPics&&item.awardPics.length" :images="getViewPic(item.awardPics)" tag="img"
                                                 text="查看图片"></image-previewer>
                                    <span v-else class="item__value">--</span>
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section " v-if="isShowBySetting('growthFoot')">
                        <div class="section-header"><i class="color-block"></i>
                            初中生素质发展记录册《我的成长足迹》
                            <div class="section-header__bottom-block">
                            </div>
                        </div>

                        <div class="section-body">
                            <div class="sub-section-header">
                                第18页八年级下学期期末成绩
                            </div>
                            <el-row>
                                <el-col span="8" class="student-info-item" v-for="growFootItem in studentData.growFootScores">
                                    <span class="item__label">{{growFootItem.courseName}}：</span>
                                    <span class="item__value">{{growFootItem.score || '--'}}</span>
                                </el-col>
                            </el-row>
                            <el-row v-if="studentData.growFootPicList && studentData.growFootPicList.length !== 0">
                                <el-col span="24" class="student-info-item">
                                    <span class="item__label">截图：</span>
                                    <span class="pic" v-if="studentData.growFootPicList.length">
                                    <image-previewer :images="getViewPic(studentData.growFootPicList)" tag="img"
                                                    text="查看图片"></image-previewer>
                                                </span>
                                    <span v-else class="item__value">--</span>
                                </el-col>
                            </el-row>
                            <div class="sub-section-header">
                                第23页九年级上学期期末成绩
                            </div>
                            <el-row>
                                <el-col span="8" class="student-info-item" v-for="growFootItem in studentData.growFootTwoScores">
                                    <span class="item__label">{{growFootItem.courseName}}：</span>
                                    <span class="item__value">{{growFootItem.score || '--'}}</span>
                                </el-col>

                            </el-row>
                            <el-row>
                                <el-col span="24" class="student-info-item">
                                    <span class="item__label">截图：</span>
                                    <span class="pic" v-if="studentData.growFootTwoPicList.length">
                                    <image-previewer :images="getViewPic(studentData.growFootTwoPicList)" tag="img"
                                                    text="查看图片"></image-previewer>
                                    </span>
                                    <span v-else class="item__value">--</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </template>
                <div class="section " v-if="isShowBySetting('zyxx')">
                    <div class="section-header"><i class="color-block"></i>
                        报考信息
                        <div class="section-header__bottom-block">
                        </div>
                    </div>
                    <div class="section-body">
                        <el-row>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('indexStudent')">
                                <span class="item__label">指标生：</span>
                                <span class="item__value">{{['--', '否', '是'][studentData.indexStudent]}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('indexSchoolCode')">
                                <span class="item__label">指标学校：</span>
                                <span class="item__value">{{studentData.indexSchoolName || '--'}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('firBatchFirWishSchoolCode')">
                                <span class="item__label">A志愿：</span>
                                <span class="item__value">{{studentData.firBatchFirWishSchoolName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('firBatchSecWishSchoolCode')">
                                <span class="item__label">B志愿：</span>
                                <span class="item__value">{{studentData.firBatchSecWishSchoolName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('secBatchFirWishSchoolCode')">
                                <span class="item__label">C志愿：</span>
                                <span class="item__value">{{studentData.secBatchFirWishSchoolName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('secBatchSecWishSchoolCode')">
                                <span class="item__label">D志愿：</span>
                                <span class="item__value">{{studentData.secBatchSecWishSchoolName || '--'}}</span>
                            </el-col>
                            <el-col span="8" class="student-info-item" v-if="isShowBySetting('picJson')">
                                    <span class="item__label">
                                        志愿表：</span>
                                <span class="pic" v-if="studentData.picList.length">
                                <image-previewer :images="getViewPic(studentData.picList)" tag="img"
                                                 text="查看图片"></image-previewer>
                                </span>
                                <span v-else class="item__value">--</span>
                            </el-col>
                        </el-row>

                    </div>
                </div>
                <div class="section section--print">
                    <div class="section-header"><i class="color-block"></i>
                        签到信息
                        <div class="section-header__bottom-block">
                        </div>
                    </div>
                    <table class="signTable" id="signTable">
                        <thead>
                        <th>
                            活动名称
                        </th>
                        <th>
                            签到时间
                        </th>
                        </thead>
                        <tr v-for="item in signList">
                            <td>{{item.activityName}}</td>
                            <td>{{item.signTime | trimTime}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="shenpilist">
            <div v-if="shenpilist.length>0">
               <div class="title">预审
                    <el-tag v-if="shenpilist[0].examState == 1" size="mini" type="success">通过</el-tag>
                    <el-tag v-if="shenpilist[0].examState == 2" size="mini" type="danger">不通过</el-tag>
               </div>
               <div class="txt">{{shenpilist[0].examRemark}}</div>
               <div class="time">{{shenpilist[0].examUserName}}&nbsp;&nbsp;{{shenpilist[0].examTime.split('.')[0]}}</div>
            </div>
             <div v-if="shenpilist.length>1">
               <div class="title">二审
                    <el-tag v-if="shenpilist[1].examState == 1" size="mini" type="success">通过</el-tag>
                    <el-tag v-if="shenpilist[1].examState == 2" size="mini" type="danger">不通过</el-tag>
               </div>
               <div class="txt">{{shenpilist[1].examRemark}}</div>
               <div class="time">{{shenpilist[1].examUserName}}&nbsp;&nbsp;{{shenpilist[1].examTime.split('.')[0]}}</div>
            </div>
            <div v-if="shenpilist.length>2">
               <div class="title">三审
                    <el-tag v-if="shenpilist[2].examState == 1" size="mini" type="success">通过</el-tag>
                    <el-tag v-if="shenpilist[2].examState == 2" size="mini" type="danger">不通过</el-tag>
               </div>
               <div class="txt">{{shenpilist[2].examRemark}}</div>
               <div class="time">{{shenpilist[2].examUserName}}&nbsp;&nbsp;{{shenpilist[2].examTime.split('.')[0]}}</div>
            </div>
        </div>
    </div>
       
        <div class="section ">
            <div class="section-header"><i class="color-block"></i>
                咨询会签到信息（共签到{{signList.length}}次）
                <div class="section-header__bottom-block">
                </div>
            </div>
        </div>
        <div style="margin-top: 10px;">
            <el-table stripe :data="signList" border fit highlight-current-row
                      style="width: 100%" :height="nobottommaxH - 25">
                <el-table-column align="center" label="咨询会活动名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.activityName }}</span>
                    </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip align="center" label="签到时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.signTime | trimTime }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>


<script>
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import {
        getEnrollStuInfoById,
        getEnrollStuFieldBySchoolId,
        getEnrollNoticeActivitySignPageList,
        getDicDetailInfoByCode,approvalEnrollStuInfo,getEnrollStuInfoExamineLogList
    } from '@/api/schoolSignupHigh';

    export default {
        name: "signupDetail",

        data() {
            return {
                firstExamState:1,//
                secondExamState:1,//
                thridExamState:1,//
                shenpilist:[],
                 listQuery:{
                    examRemark:"",//	审核意见	string	
                    examState:1,//	审核状态 1通过 2不通过 3退回	number	
                    examType:this.$route.query.approvalStepId,//	审核类型 1预审 2二审 3三审	number	
                    noticeId:this.$route.query.noticeId,//	招生通知ID	number	
                    stuIds:this.$route.query.id,//	学生IDS,多个使用逗号分隔	string	
                },
                 rules: {
                    examRemark: [{ required: true, message: '请填写审批意见', trigger: 'change' }]
                    },
                id: this.$route.query.id,
                noticeId: this.$route.query.noticeId,
                active: 'baoming',
                studentData: {
                    "thirdUppMidTermGrade": null,
                    "thirdUppMidTermGradePics": [],
                    "thirdUppMidTermGradeNo": null,
                    "thirdUppFinalExamGrade": null,
                    "thirdUppFinalExamGradePics": [],
                    "thirdUppFinalExamGradeNo": null,
                    'thirdLowMidTermGradePics': [],
                    'thirdLowFinalExamGradePics': [],
                    "thirdLowMidTermGrade": null,
                    "thirdLowMidTermGradeNo": null,
                    "thirdLowFinalExamGrade": null,
                    "thirdLowFinalExamGradeNo": null,
                    "applySchoolCode": null,
                    "applySchoolName": null,
                    "basicInfoRemark": null,
                    "birthday": null,
                    "createTime": null,
                    "examNum": null,
                    "firBatchFirWishSchoolCode": null,
                    "firBatchFirWishSchoolName": null,
                    "firBatchSecWishSchoolCode": null,
                    "firBatchSecWishSchoolName": null,
                    "firstTestGrade": null,
                    "zeroTestGrade":null,
                    "firstTestNo": null,
                    "firstTestPicList": [],
                    "firstTestPics": null,
                    "gender": null,
                    "graduateSchoolCode": null,
                    "graduateSchoolName": null,
                    "groupId": null,
                    "growFootOneScoreList": [],
                    "growFootPicList": [],
                    "growFootPicsJson": [],
                    "growFootScores": [],
                    "growFootTwoPicList": [],
                    "growFootTwoPics": [],
                    "growFootTwoScoreList": [],
                    "growFootTwoScores": [],
                    "hasMasterRecommend": 0,
                    "homeAddress": null,
                    "id": 0,
                    "idCard": null,
                    "indexSchoolCode": null,
                    "indexSchoolName": null,
                    "indexStudent": 0,
                    "isHasMidTestPic": 0,
                    "isHasWishPic": 0,
                    "locateClassId": null,
                    "locateClassName": null,
                    "locateCountryCode": null,
                    "locateCountryName": null,
                    "loginPhone": null,
                    "loginPhone2": null,
                    "midTestCityNo": null,
                    "midTestCountryNo": null,
                    "midTestGrade": null,
                    "midTestInfoRemark": null,
                    "midTestPicJson": [],
                    "midTestPicList": [],
                    "noticeId": 0,
                    "orderNo": null,
                    "orderType": 0,
                    "otherTalentInfo": null,
                    "parentName": null,
                    "picJson": [],
                    "picList": [],
                    "recommendPicJson": [],
                    "recommendPicList": [],
                    "recordNum": null,
                    "schoolCityCode": null,
                    "schoolCityName": null,
                    "schoolCountryCode": null,
                    "schoolCountyName": null,
                    "schoolId": 0,
                    "schoolProvCode": null,
                    "schoolProvName": null,
                    "score": null,
                    "searchTitle": null,
                    "secBatchFirWishSchoolCode": null,
                    "secBatchFirWishSchoolName": null,
                    "secBatchSecWishSchoolCode": null,
                    "secBatchSecWishSchoolName": null,
                    "secTestGrade": null,
                    "secTestNo": null,
                    "secTestPicList": [],
                    "secTestPics": null,
                    "ssqjjsCount": null,
                    "ssqjjsNames": null,
                    "ssqjjsPicList": [],
                    "ssqjjsPicsJson": [],
                    "ssqjryCount": null,
                    "ssqjryNames": null,
                    "ssqjryPicList": [],
                    "ssqjryPicsJson": [],
                    "state": 0,
                    "stuName": null,
                    "subjectStudentCode": 0,
                    "spareSubStuCode":0,
                    "subjectStudentName": null,
                    "xjjsCount": null,
                    "xjjsNames": null,
                    "xjjsPicList": [],
                    "xjjsPicsJson": [],
                    "xjryCount": null,
                    "xjryNames": null,
                    "xjryPicList": [],
                    "xjryPicsJson": []
                },
                settingData: [],
                signList: [],
                keywordConfig: {
                    name: '学科、科技特长生',
                    remark: ''
                },
                showBox:false,
                 fieldRemark:{
                    onetxt:'',
                    twotxt:''
                },
                enKey:""
            }
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        computed: {
            ...mapGetters(['schoolInfo']),
            scoreTableData() {
                const tableData = []
                 if (this.isShowBySetting('zeroTestGrade')) {
                    tableData.push({
                        name: '0模成绩',
                        ...this.studentData.zeroTestGradeJson
                    })
                }
                if (this.isShowBySetting('firstTestGrade')) {
                    tableData.push({
                        name: '区一模成绩',
                        ...this.studentData.firstTestGradeJson
                    })
                }
                if (this.isShowBySetting('secTestGrade')) {
                    tableData.push({
                        name: '区二模成绩',
                        ...this.studentData.secTestGradeJson
                    })
                }
                
                  if (this.isShowBySetting('secLowFinalExamGrade')) {
                    tableData.push({
                        name: '初二下期末成绩',
                        ...this.studentData.secLowFinalExamGradeJson
                    })
                }
                if (this.isShowBySetting('thirdUppMidTermGrade')) {
                    tableData.push({
                        name: '初三上期中成绩',
                        ...this.studentData.thirdUppMidTermGradeJson
                    })
                }
                if (this.isShowBySetting('thirdUppFinalExamGrade')) {
                    tableData.push({
                        name: '初三上期末成绩',
                        ...this.studentData.thirdUppFinalExamGradeJson
                    })
                }
                if (this.isShowBySetting('thirdLowMidTermGrade')) {
                    tableData.push({
                        name: '初三下期中成绩',
                        ...this.studentData.thirdLowMidTermGradeJson
                    })
                }
                if (this.isShowBySetting('thirdLowFinalExamGrade')) {
                    tableData.push({
                        name: '初三下期末成绩',
                        ...this.studentData.thirdLowFinalExamGradeJson
                    })
                }
                return tableData
            }
        },
        components: {ImagePreviewer},
        mounted() {
             getEnrollStuFieldBySchoolId()
                .then(res => res.data)
                .then(data => {
                    data.data.forEach(item => {
                        if(item.fieldName=="newshenheone"&&this.$route.query.approvalStepId==1){
                                   this.fieldRemark=JSON.parse(item.fieldRemark)
                         }
                         if(item.fieldName=="newshenhetwo"&&this.$route.query.approvalStepId==2){
                                   this.fieldRemark=JSON.parse(item.fieldRemark)
                         }
                         if(item.fieldName=="newshenhethree"&&this.$route.query.approvalStepId==3){
                                   this.fieldRemark=JSON.parse(item.fieldRemark)
                         }
                         
                    })
                })
            this.getKeyWord()
            getEnrollNoticeActivitySignPageList({
                pageNo: 1,
                pageSize: 100,
                stuName: '',
                stuId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    this.signList = data.data.dataList;
                })
            getEnrollStuFieldBySchoolId({
                schoolId: this.schoolInfo.id
            })
                .then(res => res.data)
                .then(data => {
                    this.settingData = data.data;
                });
           this.getEnrollStuInfoById()
        },
        methods: {
            getEnrollStuInfoById(){
                 getEnrollStuInfoById({
                infoId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    const picKeyList = [
                        'ssqjjsPicList',
                    ];
                    picKeyList.forEach(key => {
                        if (pageData[key] && pageData[key].length !== 0) {
                            pageData[key].forEach(item => {
                                item.src = item.picUrl;
                            });
                        }
                    });
                    if (pageData.growFootScores) {
                        pageData.growFootScores = JSON.parse(pageData.growFootScores);
                    }
                    if (pageData.growFootTwoScores) {
                        pageData.growFootTwoScores = JSON.parse(pageData.growFootTwoScores);
                    }
                    
                    pageData.subjectTalentPicJson = JSON.parse(pageData.subjectTalentPicJson || '[]')
                    pageData.midTestPicJson = JSON.parse(pageData.midTestPicJson || '[]')
                    pageData.thirdUppMidTermGradeJson = JSON.parse(pageData.thirdUppMidTermGradeJson || '{}')
                    pageData.thirdUppFinalExamGradeJson = JSON.parse(pageData.thirdUppFinalExamGradeJson || '{}')
                    pageData.thirdLowMidTermGradeJson = JSON.parse(pageData.thirdLowMidTermGradeJson || '{}')
                    pageData.thirdLowFinalExamGradeJson = JSON.parse(pageData.thirdLowFinalExamGradeJson || '{}')
                    pageData.firstTestGradeJson = JSON.parse(pageData.firstTestGradeJson || '{}')
                    pageData.zeroTestGradeJson = JSON.parse(pageData.zeroTestGradeJson || '{}')
                    pageData.secTestGradeJson = JSON.parse(pageData.secTestGradeJson || '{}')
                    pageData.subjectAwardJson = JSON.parse(pageData.subjectAwardJson || '[]')
                    pageData.honorAwardPicJson = JSON.parse(pageData.honorAwardPicJson || '[]')
                    pageData.secLowFinalExamGradeJson = JSON.parse(pageData.secLowFinalExamGradeJson || '[]')
                    this.studentData = pageData;
                    this.firstExamState=pageData.firstExamState
                    this.secondExamState=pageData.secondExamState
                    this.thridExamState=pageData.thridExamState
                    this.enKey=pageData.enKey
                })
                 getEnrollStuInfoExamineLogList(this.id)
                .then(res => res.data)
                .then(data => {
                    this.shenpilist=data.data;
                })
            },
            approvalEnrollStuInfo(state) {
                this.$refs.form.validate(isValid => {
                    if (isValid) {                        
                        approvalEnrollStuInfo(this.listQuery).then(res => {
                            const data = res.data;
                            if (data.code === 200 && data.result) {
                                this.$message.success('审批成功');
                            } else {
                                this.$message.error(data.msg);
                            }
                           this.showBox=false;
                           this.getEnrollStuInfoById()
                            }).catch(() => {
                           this.showBox=false;
                            });
                    }
                })
            },
              funshowBox(num) {
               this.listQuery.examState=num
                    if(num==1){
                         this.listQuery.examRemark=this.fieldRemark.onetxt
                    }else{
                        this.listQuery.examRemark=this.fieldRemark.twotxt
                    }
                    this.showBox=true;
            },
            async getKeyWord() {
                try {
                    const { data } = await getDicDetailInfoByCode({
                        code: 'subjectStudentDec',
                        schoolId: this.schoolInfo.id
                    });
                    if (data.data) {
                        this.keywordConfig.name = data.data.name || this.keywordConfig.name
                        this.keywordConfig.remark = data.data.remark
                    }
                    console.log(data);
                } catch (err) {
                    console.log(err)
                }
            },
            print() {
                this.$print(this.$refs.print)
            },
            isShowBySetting(fieldName) {
                return this.settingData.findIndex(item => item.fieldName === fieldName && item.fieldValue == 1) !== -1;
            },
            getViewPic(picList) {
                if (picList) {
                    return picList.map((item) => {
                        return {'src': item.picUrl}
                    });
                }
                return [];
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../styles/mixin";

    @include globalstyle;
    /*===================== global resetting ============*/

    /*=============== base ==================*/
    .body{
        padding-right: 300px;
        position: relative;
            overflow: hidden;
        .shenpilist{
            width: 300px;
            position: absolute;
            right:0px;
            top:30px;
            padding-left:30px;
            height: 100%;
            font-size: 14px;
            .title{
                line-height: 14px;
                margin: 10px 0;
                border-left: 3px solid #409EFF;
                color:#303133;
                height: 14px;
                padding-left: 10px;
                .el-tag{
                    float: right;
                }
            }
            .txt{
                color:#606266;
                padding: 10px;
            }
            .time{
                color:#909399;
                padding: 10px;
            }
        }
    }
    .print-header {
        font-size: 26px;
        text-align: center;
        font-weight: bold;
        position: relative;

        .print-header__recruit-no {
            position: absolute;
            left: 0;
        }

        .print-header__status {
            position: absolute;
            right: 0;
        }
    }

    .print-header--sub {
        font-size: 18px;
        color: #999;
    }

    body {
        background-color: #5D5D5D;

    }

    .notify {
        color: #ff0000;
    }

    .global-container {
        background-color: #fff;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .icon {
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        background: no-repeat center center / cover;
    }

    .icon--record {
        /*background-image: url(../../../assets/images/primary/icon-record2.png);*/
        position: relative;
        top: -2px;
        margin-right: 10px;
    }

    .icon--score {
        /*background-image: url(../../../assets/images/primary/icon-score.png);*/
        position: relative;
        top: -2px;
        margin-right: 10px;
    }

    .icon--honor {
        /*background-image: url(../../../assets/images/primary/icon-honor.png);*/
        position: relative;
        top: -2px;
        height: 26px;
        width: 26px;
        margin-right: 10px;
    }

    .icon--duty {
        /*background-image: url(../../../assets/images/primary/icon-duty.png);*/
        position: relative;
        top: -2px;
        height: 24px;
        width: 24px;
        margin-right: 10px;
    }

    .icon--prize {
        /*background-image: url(../../../assets/images/primary/icon-prize.png);*/
        position: relative;
        top: -2px;
        height: 24px;
        width: 24px;
        margin-right: 10px;
    }

    .icon--sport {
        /*background-image: url(../../../assets/images/primary/icon-sport.png);*/
        position: relative;
        top: -2px;
        height: 24px;
        width: 24px;
        margin-right: 10px;
    }

    /*=============== studentInfo =============*/
    .header {
        height: 54px;
        box-sizing: border-box;
        border-top: 10px solid #22A98B;
        color: #7B7B7B;
        line-height: 44px;
        padding-left: 16px;
    }

    .section-header {
        position: relative;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        border-bottom: 1px solid #bbb;
        /*color: rgb(64, 158, 255);*/
    }

    .item__label, .item__value {
        display: inline-block;
        vertical-align: top;
    }

    .item__label {
        min-width: 8em;
        margin-right: 10px;
        color: #888;
        text-align: right;
    }
    .section--honor {
        .item__label {
            min-width: 10em;
        }
    }

    .color-block {
        height: 16px;
        width: 16px;
        background-color: #409eff;
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
    }

    .section-body {
        padding: 20px 0 10px 0;
        clear: both;
    }

    .section-body:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .section-body__left-block {
        float: left;
    }

    .section-body__right-block {
        float: right;
    }

    .section--general-info .section-body__left-block {
        width: 30%;
    }

    .section--general-info .section-body__right-block {
        width: 500px;
    }

    .student-photo {
        width: 180px;
        margin: 0 auto;
        background: no-repeat center center / cover;
    }

    .student-name {
        font-size: 28px;
        width: 324px;
        text-align: center;
        margin-bottom: 20px;
        margin-left: 100px;
    }

    .student-info-item {
        margin-bottom: 10px;
        line-height: 24px;
        font-size: 14px;
    }


    .info-item {
        margin-bottom: 10px;
        line-height: 24px;
        font-size: 14px;

        &.info-item--wide {
            width: 100% !important;
            clear: both;
        }
    }

    .info-item > * {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
    }


    .section--address-info .item__label {
        vertical-align: top;
    }

    .section-body--parent {
        padding: 20px 30px 0 30px;

        .item__label {
            margin-right: 10px;
            width: 32%;
        }

        .item__value {
            width: 58%;
        }
    }

    .parent-info-container {
        width: 49%;
        float: left;
        box-sizing: border-box;
    }

    .item__value > * {
        display: block;
        word-break: break-all;
    }

    .sub-info {
        font-size: 12px;
    }

    .image-container {
        width: 40px;
        height: 40px;
        background: no-repeat center center / cover;
        float: left;
        margin: 0 5px 5px 0;
    }



    .personal-info__title {
        margin-bottom: 10px;
        color: #409EFF;
        font-size: 18px;
    }

    .personal-info__item > * {
        display: inline-block;
    }

    .personal-info__item-label {
        margin-bottom: 10px;
        color: #409EFF;
        width: 120px;
        margin-right: 30px;
    }

    .personal-info__item-value {
        width: 540px;
        color: #464A4B;
    }

    .score-item, .honor-item, .duty-item {
        margin-right: 20px;
    }

    .score-item > * {
        margin-right: 7px;
    }

    .line-container {
        clear: both;
        padding: 0 20px;
        @include clearfix;
    }
    .pic {
        margin-right: 10px;
        display: inline-block;
        vertical-align: top;
    }


    .pic-item {
        width: 80px;
        height: 80px;
        background: no-repeat center center / cover;
        display: inline-block;
        margin: 0 10px 10px 0;
    }

    .section {
        clear: both;
    }

    .section--character-card .sub-section {
        border-top: 1px solid #23A68B;
        margin: 0 auto;
        width: 750px;
        box-sizing: border-box;
        padding: 0 25px;
    }

    .personal-info-entry {
        font-size: 16px;
        margin-top: 30px;
    }

    .personal-info-section:first-child {
        border: 0;
    }

    .personal-info-section > *:first-child {
        margin-top: 0;
    }

    .personal-info__bottom-line, .sub-section-item__bottom-line {
        width: 40%;
        height: 5px;
        background-color: #23A68B;
    }

    .personal-info-entry:last-child .personal-info__bottom-line {
        display: none;
    }

    .sub-section-item:last-child .sub-section-item__bottom-line {
        display: none;
    }

    /*=============== 专长==========*/
    .sub-section__title {
        margin-bottom: 10px;
        color: #409EFF;
        padding-top: 30px;
        font-size: 18px;
    }

    .sub-section-item {
        font-size: 16px;
        margin-bottom: 10px;
        position: relative;
    }

    .sub-section-item .sub-section-item__pic-container {
        padding: 10px 0;
    }

    .sub-section-item > span {
        margin: 0 5px;
        color: #9E9E9E;
    }

    .sub-section-item .sub-section-item__name {
        display: inline-block;
        min-width: 60px;
        font-weight: bold;
        margin-right: 20px;
        color: #333;
    }

    #print_div {
        display: none;
    }

    .printRemindMsg {
        display: none;
    }

    .remindMsg {
        display: block;
    }

    @media print {
        #content {
            width: 900px !important;
        }
        #content * {
            color: #000 !important;
        }
        .content {
            border: 0 !important;
        }
        .notify--not-print {
            display: none !important;
        }
        #print_div {
            display: block;
        }
        .header {
            font-size: 28px !important;
        }
        * {
            -webkit-print-color-adjust: exact;
        }
        .sub-section__title {
        }
        .icon {
            width: 30px !important;
            height: 30px !important;
            display: inline-block !important;
            vertical-align: middle !important;
            background: no-repeat center center / cover !important;
        }
        /*.icon--record {*/
        /*    background-image: url(../../../assets/images/primary/icon-record2.png) !important;*/
        /*}*/
        /*.icon--score {*/
        /*    background-image: url(../../../assets/images/primary/icon-score.png) !important;*/
        /*}*/
        /*.icon--honor {*/
        /*    background-image: url(../../../assets/images/primary/icon-honor.png) !important;*/
        /*}*/
        /*.icon--duty {*/
        /*    background-image: url(../../../assets/images/primary/icon-duty.png) !important;*/
        /*}*/
        /*.icon--prize {*/
        /*    background-image: url(../../../assets/images/primary/icon-prize.png) !important;*/
        /*}*/
        /*.icon--sport {*/
        /*    background-image: url(../../../assets/images/primary/icon-sport.png) !important;*/
        /*}*/

        #print_div .section-body__right-block {
            width: 500px !important;
        }
        #print_div .section-body__right-block .item__value {
            width: 310px !important;
        }
        #print_div .item__value {
            width: 560px !important;
        }
        #print_div .item__label, #print_div .item__value {
            font-size: 20px;
        }
        #print_div .info-item > * {
            font-size: 20px;
        }

        .printRemindMsg {
            display: block;
        }
        .remindMsg {
            display: none;
        }
    }

    .second-header-wrap {
        left: 0;
        width: 68%;
        height: 60px;
        line-height: 60px;
        padding: 5px 0;
        background-color: #fff;
        z-index: 1000;
    }

    .content {
        box-sizing: border-box;
    }

    .review-list--live {
        .review-item {
            .review-item__detail {
                float: left;
                width: 62%;
                margin-left: 8%;
            }

            .review-item__remark {
                word-break: break-all;
            }

            .review-item__info {
                font-size: 14px;
                text-align: right;
            }

            .review-item__user {
                text-align: right;
                font-size: 14px;
                color: #333;
            }
        }
    }

    .review-item {
        @include clearfix;
        margin-bottom: 10px;
        padding: 5px;
        border-bottom: 1px solid #ddd;

        .review-item__state {
            float: left;
            width: 30%;
        }

        .review-item__detail {
            float: left;
            width: 62%;
            margin-left: 8%;
        }

        .review-item__remark {
            word-break: break-all;
        }

        .review-item__info {
            font-size: 14px;
            text-align: right;
        }

        .review-item__user {
            text-align: right;
            font-size: 14px;
            color: #333;
        }
    }

    .review-list-container {
        float: left;
        width: 29%;
        margin-left: 2%;
    }

    .section--address-info {
        .section-body {
            padding: 20px 30px 0 30px;
        }

        .info-item {
            float: left;
            width: 49%;
            box-sizing: border-box;

            .item__label {
                width: 32%;
                margin-right: 10px;
            }
        }
    }

    .photo-fill.section-body__left-block {
        width: 3.5cm;
        height: 4.9cm;
        border: 1px dashed #333;
        margin-left: 50px;
        margin-top: 30px;
        line-height: 4.9cm;
        text-align: center;
    }

    .fa-edit {
        color: #66b1ff;
        font-size: 20px;
        margin-left: 20px;
        cursor: pointer;
    }

    .sub-section-header {
        border-left: 4px solid #409eff;
        padding-left: 8px;
        margin-bottom: 8px;
    }

    #signTable {
        margin-top: 15px;
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
    }

    .section--print {
        display: none;

    }

    @media print {
        .section--print {
            display: block !important;
        }
        .item__label {
            min-width: 8em;
            margin-right: 10px;
            color: #777 !important;
            text-align: right;
        }
    }

    td, th {
        border: 1px solid #000;
        text-align: center;
        padding: 5px;
    }
    .subjectAward-header {
        position: relative;
        font-size: 18px;
        padding-bottom: 5px;
        border-bottom: 1px solid #bbb;
        div {
            padding-left: 30px;
        }
    }
</style>
<style lang="scss">
    #signupStuDetail {
        .previewer-text {
            color: #409eff
        }
    }
</style>

