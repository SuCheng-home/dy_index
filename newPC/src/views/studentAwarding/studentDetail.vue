<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <template v-if="isFromManager">
                <el-button type="primary" v-if="studentDetail.state != 4 && !isManagerEdit" size="medium"
                           @click="isManagerEdit = true">编辑
                </el-button>
                <template v-if="isManagerEdit">
                    <template v-if="studentDetail.state == 2">
                        <el-button type="primary" @click="reviewHandler()" size="medium">完成审核</el-button>
                        <el-button type="danger" @click="backHandler()" size="medium">退回学生重新上传</el-button>
                    </template>
                    <template v-else>
                        <el-button type="primary" @click="reviewHandler(true)" size="medium">保存</el-button>
                        <el-button type="danger" @click="backHandler()" size="medium">退回学生重新上传</el-button>
                    </template>
                </template>
            </template>
        </backtool>
        <div class="header">
            <img class="stu-avatar" :src="studentDetail.stuAvatar || 'https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_teacher_head.jpg'" />
            <div class="header__inner">
                <div class="header-line">
                    <span class="info-label">
                        活动信息：
                    </span>
                    <span class="info-value">
                        <span class="header-item">
                            {{activityInfo.title}}
                        </span>
                    </span>
                </div>
                <div class="header-line">
                    <span class="info-label">
                        学生信息：
                    </span>
                    <span class="info-value">
                        <span class="header-item">
                        申报人：{{studentDetail.studentName}}
                        </span>
                        <span class="header-item">
                            班级：{{studentDetail.className}}
                        </span>
                        <span class="header-item">
                            性别：{{['', '男', '女'][studentDetail.gender]}}
                        </span>
                        <span class="header-item">
                            出生年月：{{studentDetail.birthDate}}
                        </span>
                        <span class="header-item">
                            民族：{{studentDetail.national}}
                        </span>
                    </span>
                </div>
                <div class="header-line">
                    <span class="info-label">
                        申报奖项：
                    </span>
                    <span class="info-value">
                        <span class="header-item">
                            {{studentDetail.awardText.join(',')}}
                        </span>
                    </span>

                </div>
                <div class="header-line" v-if="studentDetail.teamTime">
                    <span class="info-label">
                        入队时间：
                    </span>
                    <span class="info-value">
                        <span class="header-item">
                            {{studentDetail.teamTime}}
                        </span>
                    </span>

                </div>
                <div class="header-line" v-if="studentDetail.positionName">
                    <span class="info-label">
                        现有职务：
                    </span>
                    <span class="info-value">
                        <span class="header-item">
                            {{studentDetail.positionName}}
                        </span>
                    </span>

                </div>
                <div class="header-line" v-if="studentDetail.diathAwardJson&&miscAwardList.length">
                    <span class="info-label">
                        单项素质：
                    </span>
                    <span class="info-value">
                        <span class="header-item">
                            <span class="link preview-text" v-for="(miscAwardItem, index) in miscAwardList">
                                <image-previewer style="display: inline-block"
                                    :images="miscAwardItem.photoList"
                                    tag="img"
                                    :text="miscAwardItem.title"
                                ></image-previewer>&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        </span>
                    </span>

                </div>
            </div>
        </div>
        <!--        <div class="header" v-if="!isFromManager && !isFromStudent">-->
        <!--            <div class="header__inner">-->
        <!--                <span class="header-item">-->
        <!--                        评优活动：{{activityInfo.title}}-->
        <!--                    </span>-->
        <!--                <span class="header-item">-->
        <!--                        申报人：{{upTeacherName}}-->
        <!--                    </span>-->
        <!--                <span class="header-item">-->
        <!--                        班级：{{className}}-->
        <!--                    </span>-->
        <!--            </div>-->
        <!--        </div>-->
        <div class="section">
            <div class="section-title">
                <span class="section-title__text">荣誉获奖</span><span
                v-if="!isFromSchool"
                class="rate">（分值占比{{activityInfo.classHonorScale}}%）</span>
                <span   v-if="isFromSchool || isFromAll"
                    class="rate">（校评分值占比{{activityInfo.schHonorScale}}%）</span>
                 <span class="section-title__score"  v-for="item in newbiglist" v-if="myawardJsonfun(item)">
                   {{item.applyAwardName}}总分：<span class="section-title__score-text">{{yaobuyaosuan?(((item.num?item.num.toFixed(2):(parseFloat(getTotalScore()).toFixed(2)))*(activityInfo.classHonorScale)/item.myobj.maxScore).toFixed(2)):(item.num?item.num.toFixed(2):(parseFloat(getTotalScore()).toFixed(2)))}}</span>
                </span>
                <span class="section-title__score">
                    荣誉获奖总分：<span class="section-title__score-text">{{parseFloat(getTotalScore()).toFixed(2)}}</span>
                </span>
            </div>
            <div class="section-content" v-for="honorItem in honorTypeList">
                <div class="section-title-sub">
                    <span class="section-title-sub__title">{{honorItem.certType}}
                        <span class="rate" v-if="honorItem.behProjectJson.length">
                               （ <span   v-for="item in honorItem.behProjectJson">
                                    &nbsp;{{item.applyAwardName}}上限{{item.myobj.maxScore.toFixed(2)}}&nbsp;
                                </span>）
                        </span>
                    </span>
                    <span class="section-title__score">
                        <el-button type="primary" @click="openHonorSelector(honorItem)" size="mini" v-if="isFromManager && isManagerEdit">添加奖项</el-button>
                         {{honorItem.certType}}总分：<span class="section-title__score-text">{{parseFloat(getScore(honorItem)).toFixed(2)}}</span>
                        <span   v-for="item in honorItem.behProjectJson"  v-if="myawardJsonfun(item)">
                            &nbsp;&nbsp;{{item.applyAwardName}}参选：<span class="section-title__score-text">{{item.num}}</span>
                         </span>
                       
                    </span>
                </div>
                <el-table stripe :data="honorItem.certList" border fit highlight-current-row    style="width: 100%">
                    <el-table-column align="center" label="奖项名称" prop="honorName">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="证书级别" prop="honorTypeName">
                    </el-table-column>
                    <el-table-column align="center" label="获奖类型" prop="awardTypeName">
                    </el-table-column>
                    <el-table-column align="center" label="获奖等级" prop="awardLevelName">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="颁发机构" prop="issueOrgan">
                    </el-table-column>
                    <el-table-column align="center" label="颁发时间" prop="issueDate">
                    </el-table-column>
                    <el-table-column align="center" label="份数" prop="num">
                    </el-table-column>
                    <!-- <el-table-column align="center" label="证书图片">
                        <template slot-scope="scope">
                            <div
                                style="color: #409eff"
                                v-if="scope.row.pics && scope.row.pics.length"
                            >
                                <image-previewer
                                    :images="scope.row.pics"
                                    tag="img"
                                    text="查看图片"
                                ></image-previewer>
                            </div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center" label="得分">
                        <template slot-scope="scope">
                            {{scope.row.score ? parseFloat(scope.row.score).toFixed(2) : '0.00'}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" v-if="isFromManager && isManagerEdit"
                                       @click="editHonor(scope.row)">编辑
                            </el-button>
                            <el-button size="small" type="text" v-if="isFromManager && isManagerEdit"
                                       @click="commentHandler(scope.row)"><i
                                v-if="scope.row.batchContent && scope.row.batchContent.trim() != ''"
                                class="el-icon-s-comment"></i>
                                {{scope.row.batchContent && scope.row.batchContent.trim() != '' ? '编辑' : ''}}评语
                            </el-button>
                            <el-button size="small" type="text" v-if="isFromManager && isManagerEdit"
                                       @click="deleteHonor(scope.row.honorId)">移除
                            </el-button>
                            <el-button size="small" type="text"
                                       @click="showHonor(scope.row)">查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="section" v-if="studentDetail.state == 4 && isFromManager">
            <div class="section-title">
                <span class="section-title__text">退回原因</span>
            </div>
            <div class="section-content">
                <div class="section__line">
                    {{studentDetail.batchContent}}
                </div>
            </div>
        </div>
        <div class="section" v-if="(activityInfo.classThCurr == 1 && isFromStudent) ||
        (activityInfo.schThCurr == 1 && isFromSchool) ||
        (isFromAll && (activityInfo.schThCurr == 1 || activityInfo.classThCurr == 1))">
            <div class="section-title">
                <span class="section-title__text">教师评分</span><span
                v-if="!isFromSchool"
                class="rate">（分值占比{{activityInfo.classThCurrScale}}%）</span>
                <span
                    v-if="isFromSchool || isFromAll"
                    class="rate">（校评分值占比{{activityInfo.schThCurrScale}}%）</span>
                <span class="section-title__score">
                    教师评分总分：<span class="section-title__score-text">{{parseFloat(yaobuyaosuan?(voteTotalScoreFormulaTw-0):(voteTotalScore-0)).toFixed(2)}}</span>
                </span>
            </div>
            <div class="section-content">
                <el-table stripe :data="teacherInfoList" border fit highlight-current-row
                          style="width: 100%">
                    <el-table-column v-for="currItem in teacherInfoData" align="center"
                                     :label="currItem.curriculumName">
                        <template slot-scope="scope">
                            <span v-if="scope.$index == 0">
                                <span class="td-span" v-if="scope.row[`col${currItem.curriculumId}`] != 2">
                                </span>
                                <span class="td-span" v-else>
                                    <i class="el-icon-success" style="font-size: 16px;color: #409EFF"></i>
                                </span>
                            </span>
                            <span class="td-span" v-if="scope.$index == 1">
                                {{scope.row[`col${currItem.curriculumId}`]}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <div class="section" v-if="
        (activityInfo.classStuVote == 1 && isFromStudent) ||
        (activityInfo.schStuVote == 1 && isFromSchool) ||
        (isFromAll && (activityInfo.classStuVote == 1 || activityInfo.schStuVote == 1))">
            <div class="section-title">
                <span class="section-title__text">学生投票</span>
                <span class="rate" v-if="!isFromSchool">（分值占比{{activityInfo.classStuVoteScale}}%）</span>
                <span
                    v-if="isFromSchool || isFromAll"
                    class="rate">（校评分值占比{{activityInfo.schStuVoteScale}}%）</span>
                <span class="section-title__score">
                    学生投票总分：<span class="section-title__score-text">{{parseFloat(yaobuyaosuan?stuVoteTatalScoreFormulaTw-0:stuVoteTatalScore-0).toFixed(2)}}</span>
                </span>
            </div>
            <div class="section-content">
                <el-table stripe :data="studentScore" border fit highlight-current-row
                          style="width: 100%">
                     <el-table-column align="center" label="参与投票学生">
                        <template slot-scope="scope">
                            {{choseStuVoteUserCount}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="赞成票数">
                        <template slot-scope="scope">
                            {{stuVoteCount}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="反对票数">
                        0

                    </el-table-column>
                    <el-table-column align="center" label="弃权票数">
                        0
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="section" v-if="(elseInfoData.length != 0 && (isFromSchool || isFromAll)) ">
            <div class="section-title">
                <span class="section-title__text">其他</span>
                <span class="section-title__score">
                </span>
            </div>
            <div class="section-content">
                <el-table stripe :data="elseInfoList" border fit highlight-current-row
                          style="width: 100%">
                    <el-table-column v-for="(elseItem, index) in elseInfoData" align="center"
                                     :label="`${elseItem.behTypeName}(${elseItem.behTypeScale}%)`">
                        <template slot-scope="scope">
                            <span>
                                <span>
                                    {{scope.row[`col${index}`] ? parseFloat(scope.row[`col${index}`]).toFixed(2) : '0.00'}}
                                </span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <div class="section" v-if="studentDetail.choseAwardName && (isFromStudent || isFromAll)">
            <div class="section-title">
                <span class="section-title__text">班级评比结果</span>
            </div>
            <div class="section-content">
                <div class="section__line">
                    <div class="section__label">总分：</div>
                    <div class="section__value">{{parseFloat(studentDetail.classScore).toFixed(2)}}（{{studentDetail.choseAwardName}}）</div>
                </div>
                <div class="section__line">
                    <div class="section__label">评比结果：</div>
                    <div class="section__value">{{studentDetail.choseAwardName}}</div>
                </div>
                <div class="section__line">
                    <div class="section__label">评语：</div>
                    <div class="section__value">{{studentDetail.behClassContent}}</div>
                </div>
            </div>
        </div>
        <div class="section" v-if="studentDetail.isSchChose == 2 && (isFromSchool || isFromAll)">
            <div class="section-title">
                <span class="section-title__text">校评比结果</span>
            </div>
            <div class="section-content">
                <div class="section__line">
                    <div class="section__label">总分：</div>
                    <div class="section__value">{{parseFloat(studentDetail.schScore).toFixed(2)}}（{{studentDetail.choseAwardName}}）</div>
                </div>
                <div class="section__line">
                    <div class="section__label">评比结果：</div>
                    <div class="section__value">{{studentDetail.choseAwardName}}</div>
                </div>
                <div class="section__line">
                    <div class="section__label">评语：</div>
                    <div class="section__value">{{studentDetail.behSchContent}}</div>
                </div>
            </div>
        </div>
        <el-dialog title="添加荣誉获奖" :visible.sync="isShowDialog" size="tiny" width="400px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div>
                <div class="honor-list">
                    <div :class="['honor-item', selectedCertIds.includes(honorItem.id) ? 'honor-item--selected' : '']"
                         v-for="honorItem in dialogCertList"
                         @click="toggle(honorItem.id, allSelectedCertIds.includes(honorItem.id))">
                        <div class="honor-item__text">
                            {{honorItem.text}}
                            <el-tag size="mini" v-if="allSelectedCertIds.includes(honorItem.id)">已添加</el-tag>
                        </div>
                        <div class="honor-item__subtext" v-if="honorItem.subText">{{honorItem.subText}}</div>
                    </div>
                </div>
                <div class="footer clearfix">
                    <div class="sum">已选{{selectedCertIds.length}}个</div>
                    <div class="confirm-btn">
                        <el-button size="small" type="default" @click="isShowDialog = false">取消</el-button>
                        <el-button size="small" type="primary" @click="onSelectCertConfirm()">确定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="退回学生重新上传" :visible.sync="isShowBackCommentDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="backForm" :model="backForm" :rules="backFormRules">
                <el-form-item label="退回原因" label-width="100px" prop="comment">
                    <el-input v-model="backForm.comment" @blur="backForm.comment = backForm.comment.trim()"
                              auto-complete="off" type="textarea" maxlength="100" placeholder="请输入退回原因"
                              :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowBackCommentDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="backConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="荣誉证书评语" :visible.sync="isShowHonorCommentDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="honorForm" :model="honorForm" :rules="honorFormRules">
                <el-form-item label="评语备注" label-width="100px" prop="comment">
                    <el-input v-model="honorForm.comment" @blur="honorForm.comment = honorForm.comment.trim()"
                              auto-complete="off" type="textarea" maxlength="100" placeholder="请输入材料问题和批复意见"
                              :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowHonorCommentDialog = false" size="medium">取 消</el-button>
                <el-button v-show="currentHonorItem.batchContent && currentHonorItem.batchContent.trim() != ''"
                           size="medium" type="danger" @click="deleteComment()">删除评语
                </el-button>
                <el-button type="primary" @click="honorCommentConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="荣誉证书详情" :visible.sync="isShowHonorDetail" size="tiny" width="400px"
                   :close-on-click-modal="false" :close-on-press-escape="false" show-close>
            <div class="form-container">
                <el-form>
                    <el-form-item label="奖项名称" label-width="100px">
                        {{currentHonorItem.honorName}}
                    </el-form-item>
                    <el-form-item label="证书级别" label-width="100px">
                        {{currentHonorItem.honorTypeName}}
                    </el-form-item>
                    <el-form-item label="证书类型" label-width="100px">
                        {{currentHonorItem.certType}}
                    </el-form-item>
                    <el-form-item label="获奖类型" label-width="100px">
                        {{currentHonorItem.awardTypeName}}
                    </el-form-item>
                    <el-form-item label="获奖等级" label-width="100px">
                        {{currentHonorItem.awardLevelName}}
                    </el-form-item>
                    <el-form-item label="颁发机构" label-width="100px">
                        {{currentHonorItem.issueOrgan}}
                    </el-form-item>
                    <el-form-item label="颁发时间" label-width="100px">
                        {{currentHonorItem.issueDate}}
                    </el-form-item>
                    <el-form-item label="份数" label-width="100px">
                        {{currentHonorItem.num}}
                    </el-form-item>
                    <el-form-item
                        v-if="currentHonorItem.pics && currentHonorItem.pics.length"
                        label="图片" label-width="100px">
                        <image-previewer tag="richtext" viewclass="image_view" :images="currentHonorItem.pics">
                            <ul>
                                <li class="pic image_view" v-for="(picItem, index) in currentHonorItem.pics"
                                    :style="`background-image: url(${picItem.src})`"
                                    :key="index">
                                </li>
                            </ul>
                        </image-previewer>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <el-dialog title="荣誉证书编辑" :visible.sync="isShowHonorEditDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="honorEditForm" :model="honorEditForm" :rules="honorEditFormRule">
                <el-form-item label="奖项名称"  label-width="100px" prop="honorName">
                    <el-select filterable v-model="honorEditForm.honorName" @change="editHonorNameChangeHandler" placeholder="请选择奖项名称" size="medium">
                        <el-option v-for="item in allAwardList" :key="item.id" :label="item.honorName"
                                   :value="item.honorName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证书级别" label-width="100px" prop="honorTypeName">
                    {{honorEditForm.honorTypeName}}
                </el-form-item>
                <el-form-item label="证书类型" label-width="100px" prop="certType">
                    {{honorEditForm.certType}}
                </el-form-item>
                <el-form-item label="获奖类型" label-width="100px" prop="awardTypeCode">
                    <el-select v-model="honorEditForm.awardTypeCode" placeholder="请选择获奖类型" size="medium">
                        <el-option v-for="item in awardTypeList" :key="item.value" :label="item.name"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="获奖等级" label-width="100px" prop="awardLevelCode">
                    <el-select v-model="honorEditForm.awardLevelCode" placeholder="请选择获奖类型" size="medium">
                        <el-option v-for="item in awardLevelList" :key="item.id" :label="item.levelName"
                                   :value="`${item.id}`">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="颁发机构" label-width="100px" prop="issueOrgan">
                    <el-select allow-create filterable v-model="honorEditForm.issueOrgan" placeholder="请选择颁发机构" size="medium">
                        <el-option v-for="item in organList" :key="item.id" :label="item.issueOrgan"
                                   :value="`${item.issueOrgan}`">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="颁发时间" label-width="100px" prop="issueDate">
                    <el-date-picker
                        v-model="honorEditForm.issueDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="份数" label-width="100px" prop="num">
                    <el-input-number size="small" v-model="honorEditForm.num"
                                     @blur="honorEditForm.num = honorEditForm.num || 0" auto-complete="off"
                                     type="textarea" :max="200" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item
                    label="图片" label-width="100px" prop="files">
                    <uploader pathPrefix="xueshengkaoping" module="xueshengkaoping" moduleCode="20211119" multiple v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"></uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowHonorEditDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="editHonorConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import moment from 'moment';
    import {mapGetters} from 'vuex';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {getSchoolTimeAllList} from '@/api/system';
    import {
        getStuBehActivityAction,
        getStuBehActivityActionHonorList,
        getStuBehActivity,
        findApproverHonorListByIssueDate,
        addStuBehActivityActionHonorList,
        delStuBehActivityActionHonor,
        updarteStuBehActivityAction,
        updateStuBehActivityActionHonor,
        getStuBehActivityThList,
        getStuBehActivityCurrList,
        getStuApplyAward
    } from '@/api/studentAwarding';
    import {
        getSchoolHonorStuById,
        getSchoolHonorTitleList,
        findSchoolHonorTypeList,
        getSchoolHonorTypeIssueorganList,
        updateSchoolHonorStuHead,
        getLevelByGradeId
    } from '@/api/honour/honourGradeSet';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: 'studentAwardingStudentDetail',
        mixins: [baseMixin],
        computed: {
            ...mapGetters(['userInfo']),
            awardLevelList() {
                let resultList = [];
                if (this.allAwardList.length !== 0 && this.honorEditForm.honorName) {
                    const awardObj = this.allAwardList.find(item => item.honorName == this.honorEditForm.honorName);
                    if (awardObj) {
                        resultList = JSON.parse(awardObj.awardLevelJson);
                    }
                }
                return resultList;
            }
        },
        data() {
            const filesValidator = (rule, value, callback) => {
                if (!this.files || this.files.length === 0) {
                    callback(new Error('图片不能为空'))
                } else {
                    callback()
                }
            };

            return {
                currentTermId: null,

                isStartBeh: this.$route.query.isStartBeh,

                isFromSchool: this.$route.query.isFromSchool == 1,
                isFromManager: this.$route.query.isFromManager == 1,
                isManagerEdit: this.$route.query.isManagerEdit == 1,
                isFromStudent: this.$route.query.isFromStudent == 1,
                isFromAll: this.$route.query.isFromAll == 1,
                applyAwardCode: this.$route.query.applyAwardCode,
                studentScore: [0],
                myawardJson:[],

                id: this.$route.query.id,
                studentId: this.$route.query.studentId,
                studentDetail: {
                    awardText: []
                },
                honorTypeList: [],
                activityInfo: {},

                currentHonorItem: {},
                allSelectedCertIds: [],
                dialogCertList: [],
                selectedCertIds: [],
                isShowHonorDetail: false,

                honorList: [],
                voteTotalScore: 0,
                stuVoteTatalScore: 0,
                stuVoteTatalScoreFormulaTw: 0,
                voteTotalScoreFormulaTw: 0,
                stuVoteCount: 0,
                choseStuVoteUserCount:0,
                isShowDialog: false,
                isShowBackCommentDialog: false,
                backForm: {
                    comment: ''
                },
                backFormRules: {
                    comment: [
                        {required: true, message: "请输入退回原因", trigger: "blur"},
                    ],
                },
                isShowHonorCommentDialog: false,
                honorForm: {
                    comment: ''
                },
                honorFormRules: {
                    comment: [
                        {required: true, message: "请输入评语备注", trigger: "blur"},
                    ],
                },
                teacherInfoData: [],
                teacherInfoList: [],
                elseInfoList: [],
                elseInfoData: [],

                isShowHonorEditDialog: false,
                honorEditForm: {
                    certType: "", //证书类型
                    certTypeId: "", //	学生荣誉证书类型id
                    honorName: "", // 荣誉级别
                    honorTypeId: "", //荣誉级别Id
                    honorTypeName: "", //荣誉级别名称
                    issueDate: "",
                    issueOrgan: "",
                    schoolHonorStuFileList: [],
                    studentId: "",
                    picList: [],
                    studentName: "",
                    awardLevelName: "",
                    awardTypeCode: '',
                    choosedHonorName: [],
                    num: 1,
                },
                allAwardList: [],
                allHonorTypeList: [],
                awardTypeList: [
                    {
                        value: '1',
                        name: '个人奖'
                    },
                    {
                        value: '2',
                        name: '集体奖'
                    }
                ],
                organList: [],
                files: [],
                yaobuyaosuan:false,
                honorEditFormRule: {
                    honorName: [
                        {required: true, message: "奖项名称不能为空", trigger: "blur"},
                    ],
                    honorTypeName: [
                        {required: true, message: "证书级别不能为空", trigger: "blur"},
                    ],
                    certType: [
                        {required: true, message: "证书类型不能为空", trigger: "blur"},
                    ],
                    awardTypeCode: [
                        {required: true, message: "获奖类型不能为空", trigger: "blur"},
                    ],
                    awardLevelCode: [
                        {required: true, message: "获奖等级不能为空", trigger: "blur"},
                    ],
                    issueOrgan: [
                        {required: true, message: "颁发机构不能为空", trigger: "blur"},
                    ],
                    issueDate: [
                        {required: true, message: "颁发时间不能为空", trigger: "blur"},
                    ],
                    files: [
                        {required: true, validator: filesValidator, trigger: "blur"},
                    ],
                },
                miscAwardList: [],
                newbiglist:[]
            }
        },
        components: {ImagePreviewer, Uploader},
        created() {
            findSchoolHonorTypeList()
                .then((res) => res.data)
                .then((data) => {
                    // 证书级别honorType
                    if (data.code === 200) {
                        this.allHonorTypeList = data.data;
                    }
                });


            getStuBehActivityAction({
                activityId: this.id,
                studentId: this.studentId
            })
                .then(res => res.data)
                .then(data => {
                    data.data.awardText = JSON.parse(data.data.awardJson).map(item => item.applyAwardName);
                    this.myawardJson=JSON.parse(data.data.awardJson)
                    if (data.data.eleTypeScoreJson) {
                        const elseInfoList = [{}];
                        const elseInfoData = [];
                        const eleTypeScoreJson = JSON.parse(data.data.eleTypeScoreJson);

                        eleTypeScoreJson.forEach((item, index) => {
                            elseInfoData.push({
                                behTypeName: item.behTypeName,
                                behTypeScale: item.behTypeScale
                            });
                            elseInfoList[0][`col${index}`] = item.score;
                        });
                        this.elseInfoData = elseInfoData;
                        this.elseInfoList = elseInfoList;
                    }
                    let miscAwardList = [];

                    if(data.data.diathAwardJson && data.data.diathAwardJson.length !== 0) {
                        if(data.data.diathAwardJson[0] == '[') {
                            miscAwardList = JSON.parse(data.data.diathAwardJson);
                            miscAwardList.forEach(item => {
                                item.photoList = item.photoList.map(src => ({
                                    src:src.photoUrl?src.photoUrl:src
                                }))
                            });
                        } else {
                            miscAwardList = data.data.diathAwardJson.split(',').map(title => ({
                                title,
                                photoList: []
                            }));
                        }
                    }
                    this.miscAwardList = miscAwardList;
                    this.studentDetail = data.data;

                    getSchoolTimeAllList()
                        .then(res => res.data)
                        .then(data => {
                            if (data.data.length !== 0) {
                                this.currentTermId = data.data.find(item => item.isCurrent === 1).id;
                                getLevelByGradeId({
                                    gradeId: this.studentDetail.gradeId
                                })
                                    .then(res => res.data)
                                    .then(data => {
                                        this.gradeLearnLevel = data.data.level;
                                        getSchoolHonorTitleList({
                                            gradeLeave: this.gradeLearnLevel,
                                            schoolTimeId: this.currentTermId
                                        })
                                            .then(res => res.data)
                                            .then(data => {
                                                // 所有荣誉证书
                                                this.allAwardList = data.data;
                                            })
                                    });
                            }
                        });

                });

            if (this.applyAwardCode) {
                getStuBehActivityThList({
                    activityId: this.id,
                    applyAwardCode: this.applyAwardCode,
                    studentId: this.studentId
                })
                    .then(res => res.data)
                    .then(data => {
                        const teacherInfoList = [{}, {}];
                        this.teacherInfoData = data.data;
                        data.data.forEach(item => {
                            if (item.stuBehActivityTh) {
                                teacherInfoList[0][`col${item.curriculumId}`] = item.stuBehActivityTh.isVote;
                                teacherInfoList[1][`col${item.curriculumId}`] = item.stuBehActivityTh.behContent;
                            }

                        });
                        this.teacherInfoList = teacherInfoList;
                    });
                getStuApplyAward({
                    activityId: this.id,
                    applyAwardCode: this.applyAwardCode,
                    studentId: this.studentId
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.voteTotalScore = pageData.voteTotalScore;
                        this.stuVoteTatalScoreFormulaTw = pageData.stuVoteTatalScoreFormulaTw;
                        this.voteTotalScoreFormulaTw = pageData.voteTotalScoreFormulaTw;
                        this.stuVoteTatalScore = pageData.stuVoteTatalScore;
                        this.stuVoteCount = pageData.stuVoteCount;
                        this.choseStuVoteUserCount= pageData.choseStuVoteUserCount;
                    });
            }

            this.init();

        },
        methods: {
            myawardJsonfun(obj){
                let is=false
                for(let i=0;i<this.myawardJson.length;i++){
                    if( this.myawardJson[i].applyAwardCode==obj.applyAwardCode){
                        is=true
                    }
                   
                }
             return is
            },
            init() {
                this.allSelectedCertIds = [];
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.activityInfo = data.data;
                        this.yaobuyaosuan=this.activityInfo.scoringFormula==2
                        const honorTypeList = JSON.parse(data.data.honorTypeJson);
                        let behProjectJson=JSON.parse(data.data.behProjectJson);

                        honorTypeList.forEach(item => {
                            item.certList = [];
                            item.behProjectJson=[];
                            for(let i=0;i<behProjectJson.length;i++){
                                for(let j=0;j<behProjectJson[i].conditList.length;j++){
                                    if(behProjectJson[i].conditList[j].certTypeId==item.certTypeId){
                                       item.behProjectJson.push({
                                           applyAwardName:behProjectJson[i].applyAwardName,
                                           applyAwardCode:behProjectJson[i].applyAwardCode,
                                           myobj:behProjectJson[i].conditList[j]
                                       }) 
                                    }
                                   
                                }
                            }
                        });
                        this.newbiglist=[];
                         for(let i=0;i<behProjectJson.length;i++){
                                for(let j=0;j<behProjectJson[i].conditList.length;j++){
                                   if(behProjectJson[i].conditList[j].certTypeId==0){
                                        this.newbiglist.push(
                                            {
                                                applyAwardName:behProjectJson[i].applyAwardName,
                                                applyAwardCode:behProjectJson[i].applyAwardCode,
                                                myobj:behProjectJson[i].conditList[j],
                                                num:0
                                            }
                                        )
                                    }                                    
                                }
                            }
                        this.honorTypeList = honorTypeList;

                        getStuBehActivityActionHonorList({
                            activityId: this.id,
                            studentId: this.studentId 
                        })
                            .then(res => res.data)
                            .then(data => {
                                data.data.forEach(item => {
                                    if (typeof item.fileJson === 'string') {
                                        item.pics = JSON.parse(item.fileJson);
                                    } else {
                                        item.pics = item.fileJson;
                                    }
                                    if (item.pics && item.pics.forEach) {
                                        item.pics.forEach(item => {
                                            item.src = item.accessUrl || item.fileUrl;
                                        })
                                    }
                                    this.allSelectedCertIds.push(item.honorId);
                                    const honorObj = this.honorTypeList.find(honorItem => honorItem.certTypeId == item.certTypeId);
                                    if (honorObj) {
                                        honorObj.certList.push(item);
                                    }
                                   });
                                for(let i=0;i<this.honorTypeList.length;i++){
                                    for(let j=0;j<this.honorTypeList[i].behProjectJson.length;j++){
                                        this.honorTypeList[i].behProjectJson[j].num=(parseFloat(this.getScore(this.honorTypeList[i]))>this.honorTypeList[i].behProjectJson[j].myobj.maxScore?this.honorTypeList[i].behProjectJson[j].myobj.maxScore:parseFloat(this.getScore(this.honorTypeList[i]))).toFixed(2)
                                    }
                                 }
                                 for(let i=0;i<this.newbiglist.length;i++){
                                     for(let j=0;j<this.honorTypeList.length;j++){
                                         for(let k=0;k<this.honorTypeList[j].behProjectJson.length;k++){
                                             
                                             if(this.newbiglist[i].applyAwardCode==this.honorTypeList[j].behProjectJson[k].applyAwardCode){
                                                 this.newbiglist[i].num+=(this.honorTypeList[j].behProjectJson[k].num-0);
                                             }
                                         
                                        }
                                     }
                                 }
                            });


                    });
            },
            editHonorNameChangeHandler() {
                const honorObj = this.allAwardList.find(item => item.honorName === this.honorEditForm.honorName);
                if(honorObj) {
                    this.honorEditForm.honorTypeName = honorObj.honorTypeName;
                    this.honorEditForm.honorTypeId = honorObj.honorTypeId;
                    this.honorEditForm.certType = honorObj.certType;
                    this.honorEditForm.certTypeId = honorObj.certTypeId;
                    this.honorEditForm.awardTypeCode = '1';
                    if(honorObj.awardLevelJson) {
                        const awardLevelJson = JSON.parse(honorObj.awardLevelJson);
                        if(awardLevelJson && awardLevelJson.length !== 0) {
                            this.honorEditForm.awardLevelCode = `${awardLevelJson[0].id}`;
                        }
                    }
                    this.getSchoolHonorTypeIssueorganListFunc(honorObj.honorTypeId);
                } else {
                }
            },
            getSchoolHonorTypeIssueorganListFunc(honorTypeId) {
                const honorTypeObj = this.allHonorTypeList.find(item => item.honorTypeCode == honorTypeId);
                if(honorTypeObj) {
                    getSchoolHonorTypeIssueorganList({
                        honorTypeId: honorTypeObj.id,
                        pageNo: 1,
                        pageSize: 1000,
                    })
                        .then((res) => res.data)
                        .then((data) => {
                            if (data.code === 200) {
                                let organData = data.data;
                                this.organList = organData.schoolHonorTypeIssueorganList;
                            }
                        });
                } else {
                }

            },
            editHonor(certItem) {
                this.currentHonorItem = certItem;
                getSchoolHonorStuById({
                    honorStuId: certItem.honorId,
                }).then((res) => res.data).then((data) => {
                    if (data.code === 200) {
                        let honorDetail = data.data;
                        this.files = data.data.schoolHonorStuFileList.map(item => ({
                            fileUrl: item.accessUrl
                        }))
                        this.getSchoolHonorTypeIssueorganListFunc(honorDetail.honorTypeCode || honorDetail.honorTypeId);
                        this.honorEditForm = honorDetail;
                        this.isShowHonorEditDialog = true;
                    }
                });

            },
            editHonorConfirm() {
                this.$refs.honorEditForm.validate(isValid => {
                    if(isValid) {
                        const awardLevelObj = this.awardLevelList.find(item => item.id == this.honorEditForm.awardLevelCode);
                        let awardLevelName = '';
                        let oneScore = 0;
                        if(awardLevelObj) {
                            awardLevelName = awardLevelObj.levelName;
                            oneScore = parseFloat(awardLevelObj.score);
                        }
                        const honorObj = this.allAwardList.find(item => item.honorName === this.honorEditForm.honorName);

                        let honorTypeId = '';
                        const honorTypeObj = this.allHonorTypeList.find(item => item.honorTypeCode == honorObj.honorTypeId);
                        if(honorTypeObj) {
                            honorTypeId = honorTypeObj.id;
                        }
                        const awardArgs = {
                            activityId: this.id,
                            awardLevelCode: this.honorEditForm.awardLevelCode,
                            awardLevelName,
                            awardTypeCode: this.honorEditForm.awardTypeCode,
                            awardTypeName: ['', '个人奖', '集体奖'][this.honorEditForm.awardTypeCode],
                            certType: this.honorEditForm.certType,
                            certTypeId: honorObj.certTypeCode,
                            honorTypeId: honorObj.honorTypeId,
                            honorTypeName: this.honorEditForm.honorTypeName,
                            issueDate: this.honorEditForm.issueDate,
                            issueOrgan: this.honorEditForm.issueOrgan,
                            num: this.honorEditForm.num,
                            honorName: this.honorEditForm.honorName,
                            honorId: this.currentHonorItem.honorId,
                            fileJson: this.files,
                            studentId: this.studentId,
                            oneScore,
                            score: oneScore * this.honorEditForm.num,
                            batchContent: this.currentHonorItem.batchContent
                        };
                        updateStuBehActivityActionHonor(awardArgs)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    const form = {
                                        id: this.currentHonorItem.honorId,
                                        certType: this.honorEditForm.certType,
                                        certTypeId: this.honorEditForm.certTypeId,
                                        certTypeCode: honorObj.certTypeCode,
                                        honorName: this.honorEditForm.honorName,
                                        honorTypeId,
                                        honorTypeCode: honorObj.honorTypeId,
                                        honorTypeName: this.honorEditForm.honorTypeName,
                                        issueDate: this.honorEditForm.issueDate,
                                        issueOrgan: this.honorEditForm.issueOrgan,
                                        schoolHonorStuFileList: this.files.map(item => ({fileId: 0, accessUrl: item.fileUrl})),
                                        studentId: this.studentId,
                                        isHeadTeacher: true,
                                        awardTypeCode: this.honorEditForm.awardTypeCode,
                                        awardTypeName: ['', '个人奖', '集体奖'][this.honorEditForm.awardTypeCode],
                                        typeCode1: honorObj.certTypeCode,
                                        typeName1: this.honorEditForm.certType,
                                        updateUserType: 2,
                                        state: 1,
                                        studentName:this.studentDetail.studentName,
                                        certTypeOld:this.honorEditForm.certType,
                                        num: this.honorEditForm.num,
                                        oneScore,
                                        score: oneScore * this.honorEditForm.num,
                                        awardLevelCode: this.honorEditForm.awardLevelCode,
                                        awardLevelName,
                                    };
                                    updateSchoolHonorStuHead(form)
                                        .then(res => res.data)
                                        .then(data => {
                                            if (data.result) {
                                                this.$message.success('编辑成功');
                                                window.location.reload();
                                            }
                                        })
                                } else {
                                }
                            })
                    }
                })
            },
            getTotalScore() {
                let score = 0;
                this.honorTypeList.forEach(item => {
                    score += this.getScore(item);
                });
                return score;
            },
            getScore(honorItem) {
                let score = 0;
                honorItem.certList.forEach(item => {
                    score += item.score;
                });
                return score;
            },
            openHonorSelector(honorItem) {
                this.currentHonorItem = honorItem;
                this.selectedCertIds = [];
                this.isShowDialog = true;
                findApproverHonorListByIssueDate({
                    certTypeCode: honorItem.certTypeId,
                    startDate: this.activityInfo.sueStartDate,
                    endDate: this.activityInfo.sueEndDate,
                    stuId: this.studentId
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.forEach(item => {
                            item.text = item.honorName;
                            item.subText = `${item.honorTypeName}  ${item.awardLevelName}`
                        });
                        // this.dialogCertList = data.data.filter(item => !this.allSelectedCertIds.includes(item.id));
                        this.dialogCertList = data.data;

                    })
            },
            reviewHandler(isSave = false) {
                const args = this.packBatchData();
                new Promise(resolve => {
                    if(isSave) {
                        resolve();
                    } else {
                        getStuBehActivityCurrList({
                            activityId: this.id,
                            classId: this.studentDetail.classId
                        })
                            .then(res => res.data)
                            .then(data => {
                                const currTeacherReportList = data.data.filter(({reportState}) => reportState == 2);
                                if(!currTeacherReportList || currTeacherReportList.length === 0) {
                                    resolve();
                                } else {
                                    this.$confirm('已有任课老师提交评比结果，若想对此学生进行评比，则需退回任课老师评比结果', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        resolve();
                                    });
                                }
                            });

                    }
                })
                    .then(() => {
                        updarteStuBehActivityAction(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(isSave ? '编辑成功' : '审核成功');
                                    window.setTimeout(() => {
                                        this.$router.back();
                                    }, 500);
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    });
            },
            backHandler() {
                this.isShowBackCommentDialog = true;
                this.backForm.comment = '';
            },
            deleteHonor(honorId) {
                this.$confirm('确认移除该荣誉？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delStuBehActivityActionHonor({
                        honorId,
                        activityId: this.id,
                        studentId: this.studentId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('删除成功');
                                this.init();
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                });
            },
            showHonor(certItem) {
                this.currentHonorItem = certItem;
                this.isShowHonorDetail = true;
            },
            commentHandler(certItem) {
                this.currentHonorItem = certItem;
                this.honorForm.comment = certItem.batchContent || '';
                this.isShowHonorCommentDialog = true;

            },
            addHonor() {
                this.isShowDialog = true;
            },
            toggle(id, hasChecked) {
                if (!hasChecked) {
                    const index = this.selectedCertIds.indexOf(id);
                    if (index !== -1) {
                        this.selectedCertIds.splice(index, 1);
                    } else {
                        this.selectedCertIds.push(id);
                    }
                }

            },
            onSelectCertConfirm() {
                this.isShowDialog = false;
                setTimeout(() => {
                    if (this.selectedCertIds.length !== 0) {
                        // this.allSelectedCertIds = [...this.allSelectedCertIds, ...this.selectedCertIds];
                        const certList = [];
                        this.dialogCertList.find(item => {
                            if (this.selectedCertIds.includes(item.id)) {
                                const obj = {
                                    activityId: this.id,
                                    awardLevelCode: item.awardLevelCode,
                                    awardLevelName: item.awardLevelName,
                                    awardTypeCode: item.awardTypeCode,
                                    awardTypeName: item.awardTypeName,
                                    certType: item.certType,
                                    certTypeId: item.certTypeCode,
                                    honorId: item.id,
                                    honorName: item.honorName,
                                    fileJson: item.schoolHonorStuFileList,
                                    honorTypeId: item.honorTypeCode,
                                    honorTypeName: item.honorTypeName,
                                    issueDate: item.issueDate,
                                    issueOrgan: item.issueOrgan,
                                    num: item.num,
                                    oneScore: item.oneScore,
                                    score: item.score,
                                    studentId: this.studentId,
                                    classId: this.studentDetail.classId,
                                    gradeId: this.studentDetail.gradeId,
                                };
                                certList.push(JSON.parse(JSON.stringify(obj)));
                            }
                        });
                        addStuBehActivityActionHonorList(certList)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('新增成功');
                                    this.init();
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })

                    }

                }, 100)
            },
            packBatchData(isBack = false) {
                const args = {
                    batchContent: isBack ? this.backForm.comment : '同意',
                    batchState: isBack ? 3 : 2,
                    batchTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    batchUserId: this.userInfo.id,
                    batchUserName: this.userInfo.name,
                    studentId: this.studentId,
                    classId: this.studentDetail.classId,
                    gradeId: this.studentDetail.gradeId,
                    activityId: this.id,
                    state: isBack ? 4 : 3,
                    studentName: this.studentDetail.studentName
                };
                if (!isBack) {
                    args.honTotalScore = this.getTotalScore();
                }
                return args;
            },
            backConfirm() {
                this.$refs.backForm.validate(isValid => {
                    if (isValid) {
                        this.$confirm('确认退回后将退回学生所有申报奖项', '退回', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.isShowBackCommentDialog = false;
                            const args = this.packBatchData(true);
                            updarteStuBehActivityAction(args)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        this.$message.success('驳回成功');
                                        window.setTimeout(() => {
                                            this.$router.back();
                                        }, 500);
                                    } else {
                                        this.$message.error(data.msg)
                                    }
                                })
                        });


                    }
                });

            },
            deleteComment() {
                this.isShowHonorCommentDialog = false;

                updateStuBehActivityActionHonor({
                    activityId: this.id,
                    honorId: this.currentHonorItem.honorId,
                    score: this.currentHonorItem.score,
                    studentId: this.studentId,
                    delBatchContent: 1
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('删除成功');
                            this.init();
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
            },
            honorCommentConfirm() {
                this.$refs.honorForm.validate(isValid => {
                    if (isValid) {
                        this.isShowHonorCommentDialog = false;
                        const obj = {
                            activityId: this.id,
                            honorId: this.currentHonorItem.honorId,
                            score: this.currentHonorItem.score,
                            studentId: this.studentId,
                            batchContent: this.honorForm.comment
                        };
                        updateStuBehActivityActionHonor(obj)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('新增成功');
                                    this.init();
                                } else {
                                    this.$message.error(data.msg)
                                }
                            })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .header {
        margin: 5px 0;
        font-size: 14px;
        background: #F9FBFF;

    }

    .header-item {
        margin-right: 30px
    }

    .header__inner {
        padding: 10px;
    }

    .section-title {
        padding: 16px 10px 16px 5px;
        background: #F9FBFF;
        margin: 20px 0 10PX 0;
        color: #333333;

    }

    .section-title__text {
        border-left: 3px solid #409EFF;
        display: inline-block;
        padding-left: 5px;
        font-weight: bold;
        margin-left: 5px;
    }

    .section-title .section-title__score-text {
        font-weight: bold;
    }

    .section-title__score {
        float: right;
        font-size: 14px;
    }

    .section-title .section-title__score {
       font-size: 154x;
      margin-left: 20px;

    }

    .section-title__score-text {
        color: #409EFF;

    }

    .section-title-sub__title {
        font-weight: bold;
    }

    .section-title-sub {
        margin: 12px 0;
        padding: 10px 16px;
        background: #F9FBFF;
    }

    .rate {
        font-size: 14px;
        color: #409EFF;

    }

    .section-content {
        padding-left: 18px;
    }

    .section__line {
        margin: 10px 0;
    }

    .section__label {
        display: inline-block;
        vertical-align: top;
        width: 8em;
        margin-right: 5px;
        text-align: right;
        color: #409EFF;

    }

    .section__value {
        display: inline-block;
        vertical-align: top;
    }

    .honor-list {
        height: 368px;
        padding: 0 20px;
        overflow-y: auto;
    }


    .honor-item {
        box-sizing: border-box;
        width: 100%;
        padding: 5px 20px;
        box-shadow: #ccc 0 0 5px;
        margin: 12px 0;
        border-radius: 6px;
        border: 1px solid #fff;
    }

    .honor-item--selected {
        /*box-shadow: unset;*/
        border: 1px solid #409EFF;
        background: right -1px top -1px / auto 30px no-repeat url(https://cdnfile-10043692.file.myqcloud.com/mobile/images/studentAwarding/check-icon.png);
    }

    .honor-item__subtext {
        color: #ACACAC;
    }

    .footer {
        border-top: 1px solid #EEEEEE;
        padding: 10px 20px;
    }

    .sum {
        margin-top: 8px;
        color: #409EFF;
        float: left;
    }

    .el-icon-s-comment {
        color: #409EFF;
    }

    .confirm-btn {
        float: right;
    }

    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden
    }

    .header-line {
        margin-bottom: 20px;
        position: relative;

        & > * {
            display: inline-block;
            vertical-align: top;
        }

        &:last-of-type {
            margin-bottom: 0;
        }

    }
    .header {
        position: relative;
    }
    .header .header__inner {
        margin-left: 125px;
    }
    .stu-avatar {
        position: absolute;
        top: 10px;
        left: 16px;
        max-width: 100px;
        max-height: 100px;
    }
    .info-label {
        color: #409EFF;
        margin-right: 10px;
    }

    .info-value {
        color: #333333;
    }

    ul {
        list-style-type: none;
        margin: 0;
    }

    .image_view {
        width: 60px;
        height: 60px;
        background: no-repeat center center / cover;
        float: left;
        margin: 0 5px 5px 0;
    }
    .td-span {
        height: 16px;
        display: inline-block;
    }
    @media screen and (max-height: 700px) {
        .form-container {
            height: 350px;
            overflow-y: auto;
        }
    }

</style>
