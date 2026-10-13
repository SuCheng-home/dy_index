<template>
    <div class="app-container calendar-list-container" id="printApplyDetail">
        <back-tool>
            <el-button v-if="isApply && (ruleForm.status == 1 || ruleForm.status == 3)" class="filter-item" type="primary" @click="jumpToPage('printApplyAddEdit', {id, kind})" size="medium">编辑</el-button>
            <el-button v-if="isApply && ruleForm.status == 2" class="filter-item" type="danger" @click="revokeHandler()" size="medium">撤回</el-button>
            <el-button v-if="isApply && ruleForm.status == 5 &&(myobj.createUserId==userInfo.id)" class="filter-item" type="primary" @click="confirmHandler()" size="medium">确认</el-button>
            <el-button v-if="isPrint && ruleForm.status == 4" class="filter-item" type="primary" @click="finishPrintHandler()" size="medium">{{kind === 'file' ? '影印完成' : '发放完成'}}</el-button>
            <el-button v-if="isReview && ruleForm.status == 2" class="filter-item" type="primary" @click="reviewHandler(4)" size="medium">通过</el-button>
            <el-button v-if="isReview && ruleForm.status == 2" class="filter-item" type="danger" @click="reviewHandler(3)" size="medium">不同意</el-button>
            <el-button v-if="isReview && ruleForm.status == 4 && state == null" class="filter-item" type="danger" @click="revokeBeforePrint()" size="medium">撤回</el-button>
            <template v-if="isReview && ruleForm.status == 4 && state == 3">
                <el-button class="filter-item" type="primary" @click="revokeReviewHandler(1)" size="medium">通过</el-button>
                <el-button class="filter-item" type="danger" @click="revokeReviewHandler(2)" size="medium">不同意</el-button>
            </template>
        </back-tool>
        <div class="content-container">
            <div class="activebox" >
                   <el-steps :active="active" v-if="active>0&&kind === 'file'" direction="vertical">
                    <el-step :title="kind === 'file' ? '印制申请' : '发放申请'" :description="active>0?(myobj.createTime.split('.')[0] + myobj.createUserName):''"></el-step>
                    <el-step :title="kind === 'file' ? '印制审批' : '发放审批'"  :description="active>1?((myobj.approveTime?myobj.approveTime.split('.')[0]:'') +(myobj.approveUserName||'')):''"></el-step>
                    <el-step :title="kind === 'file' ? '文件打印' : '发放'"  :description="active>2?((myobj.printTime?myobj.printTime.split('.')[0]:'') + myobj.printerName):''"></el-step>
                    <el-step :title="kind === 'file' ? '领取确认' : '发放确认'"   :description="active>3?((myobj.updateTime?myobj.updateTime.split('.')[0]:'') + myobj.createUserName):''"></el-step>
                    </el-steps>
            </div>
           
           
            <div>
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>申请信息
                    </div>
                </div>
                <div class="content">
                    <el-row style="margin: 20px 0;" :gutter="30">
                        <el-col :span="4">
                            <div class="label">
                                资料名称
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.name}}
                            </div>
                        </el-col>
                         <el-col :span="4">
                            <div class="label">
                                申请人
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.createUserName}}
                            </div>
                        </el-col>
                         </el-row>
                         <el-row style="margin: 20px 0;" :gutter="30">
                          <el-col :span="4">
                            <div class="label">
                                部门
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.applyDepartName}}
                            </div>
                        </el-col>
                          <el-col :span="4">
                            <div class="label">
                                用途类型
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.useTypeName}}
                            </div>
                        </el-col>
                         </el-row>
                         <el-row style="margin: 20px 0;" :gutter="30">
                         <el-col :span="4">
                            <div class="label">
                                使用时间
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.useDate}}&nbsp;&nbsp;{{['', '上午', '下午'][ruleForm.morningOrAfternoon]}}
                            </div>
                        </el-col>
                          <el-col :span="4">
                            <div class="label">
                                {{kind === 'file' ? '打印份数' : '申请数量'}}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.copies}}
                            </div>
                        </el-col>
                         </el-row>
                         <el-row style="margin: 20px 0;" :gutter="30"  v-if="kind === 'file'">
                              <el-col :span="4">
                            <div class="label">
                                纸张大小
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.paperSizeName}}
                            </div>
                        </el-col>
                          <el-col v-if="kind === 'file'" :span="4">
                            <div class="label">
                                印制方式
                            </div>
                        </el-col>
                        <el-col v-if="kind === 'file'" :span="6">
                            <div class="value">
                                {{['', '自印', '委外'][ruleForm.outsource]}}
                            </div>
                        </el-col>
                    </el-row>
                     <el-row style="margin: 20px 0;" :gutter="30" v-if="(ruleForm.approveType != 4 &&ruleForm.approveType != 5 &&ruleForm.approveType != 5 && ruleForm.approveType != 2)||ruleForm.officeName">
                        <el-col :span="4"  v-if="ruleForm.approveType != 4 &&ruleForm.approveType != 5 &&ruleForm.approveType != 5 && ruleForm.approveType != 2">
                            <div class="label">
                                {{['', '年级', '部门', '教研组'][ruleForm.approveType]}}
                            </div>
                        </el-col>
                        <el-col :span="6"   v-if="ruleForm.approveType != 4 &&ruleForm.approveType != 5 &&ruleForm.approveType != 5 && ruleForm.approveType != 2">
                            <div class="value">
                                {{ruleForm.applyGradeName || ruleForm.applyGroupName }}
                            </div>
                        </el-col>
                         <el-col :span="4" v-if="ruleForm.officeName">
                            <div class="label">
                                办公室
                            </div>
                        </el-col>
                        <el-col :span="4" v-if="ruleForm.officeName">
                            <div class="value">
                                {{ruleForm.officeName}}
                            </div>
                        </el-col>
                    </el-row>
                     <el-row style="margin: 20px 0;" :gutter="30" v-if="isApply && ruleForm.status == 2">
                        <el-col :span="4">
                            <div class="label">
                                审批人
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="value text-overflow-300" :title="ruleForm.approveUserNameStr">
                                {{ ruleForm.approveUserNameStr }}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 20px 0;" :gutter="30">
                        <el-col :span="4">
                            <div class="label">
                                申请人备注
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="value">
                                {{ruleForm.applyRemark || '无'}}
                            </div>
                        </el-col>
                    </el-row>
                     <el-row style="margin: 20px 0;" :gutter="30" v-if="JSON.parse(ruleForm.photoJson||'[]').length">
                        <el-col :span="4">
                            <div class="label">
                                图片
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="value">
                               <image-previewer tag="richtext">
                                  <img class="image_view" style="display: inline;width: 30px;height: 30px;margin:0 5px 5px 0;" v-for="item in JSON.parse(ruleForm.photoJson||'[]')" :key="item" :src="item" />
                                </image-previewer>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 20px 0;" :gutter="30" v-if="files && files.length !== 0">
                        <el-col :span="4">
                            <div class="label">
                                附件
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="value">
                               <file-list :fileList="files"></file-list>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
          
            <div v-if="isReview && ruleForm.status == 2&&ruleForm.approveType != 5">
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>审批信息
                    </div>
                </div>
                <div class="content">
                    <el-form ref="reviewForm" :model="reviewForm" :rules="reviewFormRules" label-width="0">
                        <el-row style="margin: 20px 0;" :gutter="30">
                           <el-col :span="20">
                            <div class="line">
                                <el-form-item prop="approveRemark">
                                    <el-input
                                        style="width: 95%"
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请填写审批意见"
                                        v-model="reviewForm.approveRemark">
                                    </el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                           
                        </el-row>
                    </el-form>

                </div>
            </div>
            <div v-if="(ruleForm.status == 3 || ruleForm.status == 5 || ruleForm.status == 6 || (ruleForm.status == 4 && (state != 3 || isApply || isPrint)))&&ruleForm.approveType != 5">
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>审批信息
                    </div>
                </div>
                <div class="content">
                     <el-row style="margin: 20px 0;" :gutter="30">
                           <el-col :span="4">
                            <div class="label">
                                审批时间
                            </div>
                        </el-col>
                        <el-col :span="6">
                              <div class="value">
                          {{ruleForm.approveTime | timeFilter}}
                          </div>
                         
                        </el-col>
                        <!-- <el-col :span="4">
                            <div class="label">
                                状态
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <el-tag type="primary" size="mini" v-if="kind === 'file'">{{getStatusText(ruleForm)}}</el-tag>
                           <el-tag type="primary" size="mini" v-else>{{ruleForm.status | statusFilterMaterial}}</el-tag>
                        </el-col> -->
                        <el-col :span="4">
                            <div class="label">
                                审批人
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                           {{ruleForm.approveUserName}}
                          </div>
                         
                        </el-col>
                    </el-row>
                    <el-row style="margin: 20px 0;" :gutter="30">
                      
                        <el-col :span="4">
                            <div class="label">
                                审批备注
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                          {{state == 1 ? ruleForm.approvalContent : ruleForm.approveRemark}}
                          </div>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div v-if="!isPrint && (state == 3 && isReview) && ruleForm.status == 4">
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>撤回理由
                    </div>
                </div>
                <div class="content">
                    <el-row style="margin: 20px 0;" :gutter="30">
                         <el-col :span="20">
                            <div class="line">
                            {{ruleForm.revokeReason}}
                        </div>
                        </el-col>
                        
                    </el-row>
                </div>
            </div>
            <div v-if="isReview && state == 3 && ruleForm.status == 4">
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>审批意见
                    </div>
                </div>
                <div class="content">
                    <el-form ref="revokeReviewForm" :model="revokeReviewForm" :rules="revokeReviewRule" label-width="0">
                        <el-row style="margin: 20px 0;" :gutter="30">
                             <el-col :span="20">
                            <div class="line">
                                <el-form-item prop="approvalContent">
                                    <el-input
                                        style="width: 95%"
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请填写审批意见"
                                        v-model="revokeReviewForm.approvalContent">
                                    </el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        
                           
                        </el-row>
                    </el-form>

                </div>
            </div>

            <div v-if="ruleForm.status >= 5">
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>{{kind === 'file' ? '印制内容' : '发放信息'}}
                    </div>
                </div>
                <div class="content">
                    <el-row style="margin: 20px 0;" :gutter="30">
                        <el-col :span="4">
                            <div class="label">
                                {{kind === 'file' ? '印制份数' : '发放数量'}}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ kind === 'file' ? ruleForm.copies : ruleForm.totalPapers}}
                            </div>
                        </el-col>
                         <el-col :span="4">
                            <div class="label">
                                {{kind === 'file' ? '打印时间' : '发放时间'}}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.printTime | timeFilterSecond}}
                            </div>
                        </el-col>                       
                    </el-row>
                    <el-row  style="margin: 20px 0;" :gutter="30">
                        <el-col :span="4" v-if="kind === 'material'">
                            <div class="label">
                                发放人
                            </div>
                        </el-col>
                        <el-col :span="6" v-if="kind === 'material'">
                            <div class="value">
                                {{ruleForm.printerName}}
                            </div>
                        </el-col>
                         <el-col :span="4"  v-if="kind === 'file'">
                            <div class="label">
                                纸张大小
                            </div>
                        </el-col>
                        <el-col :span="6"  v-if="kind === 'file'">
                            <div class="value">
                                {{ruleForm.paperSizeName}}
                            </div>
                        </el-col>
                          <el-col v-if="kind === 'file'" :span="4">
                            <div class="label">
                                印制方式
                            </div>
                        </el-col>
                        <el-col v-if="kind === 'file'" :span="6">
                            <div class="value">
                                {{['', '自印', '委外'][ruleForm.outsource]}}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row v-if="kind === 'file'" style="margin: 20px 0;" :gutter="30">   
                         <el-col v-if="kind === 'file'" :span="4">
                            <div class="label">
                                每份张数
                            </div>
                        </el-col>
                        <el-col v-if="kind === 'file'" :span="6">
                            <div class="value">
                                单页：{{ruleForm.pageSingle}}&nbsp;&nbsp;&nbsp;&nbsp;双页：{{ruleForm.pageDouble}}
                            </div>
                        </el-col>                    
                        <el-col :span="4">
                            <div class="label">
                                纸张数
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                单页：{{ruleForm.paperSingle}}&nbsp;&nbsp;&nbsp;&nbsp;双页：{{ruleForm.paperDouble}}

                            </div>
                        </el-col>
                    </el-row>
                    <el-row v-if="kind === 'file'" style="margin: 20px 0;" :gutter="30">
                        <el-col :span="4">
                            <div class="label">
                                总计
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="value">
                                {{ruleForm.totalPapers}}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 20px 0;" :gutter="30">
                        <el-col :span="4">
                            <div class="label">
                                {{kind === 'file' ? '打印人' : '发放人'}}备注
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="value">
                                {{ruleForm.printerRemark || '无'}}
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="ruleForm.status == 4 && isPrint" class="print-form-container">
                <div class="big-title">
                    <div class="mudule-info">
                        <span class="color-block"></span>{{kind === 'file' ? '印制内容' : '发放信息'}}
                    </div>
                </div>
                <el-form ref="printForm" :model="printForm" :rules="printFormRules" label-width="100px">
                    <el-row style="margin: 20px 0;" :gutter="30">
                        <el-col span="10">
                            <el-form-item v-if="kind === 'file'" label="印制份数" prop="copies">
                               <el-input maxlength="4" v-model="printForm.copies" @input="enMakeOut('copies')"></el-input>
                            </el-form-item>
                            <el-form-item v-else label="发放数量" prop="copies">
                                <el-input maxlength="4" v-model="printForm.copies" @input="enMakeOut('copies')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="kind === 'file'" span="10">
                            <el-form-item label="每份张数" prop="pages">
                                单页&nbsp;<el-input style="width: 74px" v-model="printForm.pageSingle" @input="enMakeOut('pageSingle')"></el-input>
                                双页&nbsp;<el-input style="width: 75px" v-model="printForm.pageDouble" @input="enMakeOut('pageDouble')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="kind === 'file'" style="margin: 20px 0;" :gutter="30"> 
                        <el-col span="10">
                            <el-form-item label="纸张大小" prop="pageSizeType">
                                <el-select v-model="printForm.paperSizeType" placeholder="请选择">
                                    <el-option v-for="item in typeList" :key="item.code" :label="item.value" :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col span="10">
                            <el-form-item label="纸张数">
                                单页：{{paperSingle}}&nbsp;&nbsp;&nbsp;&nbsp;双页：{{paperDouble}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="kind === 'file'" style="margin: 20px 0;" :gutter="30">
                        <el-col span="10">
                            <el-form-item label="总计">
                                {{totalPapers}}
                            </el-form-item>
                        </el-col>
                        <el-col span="10">
                            <el-form-item label="印制方式" prop="outsource">
                                <el-radio-group v-model="printForm.outsource">
                                    <el-radio label="1">自印</el-radio>
                                    <el-radio label="2">委外</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col span="20">
                            <el-form-item label="备注">
                                <el-input
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入内容"
                                    v-model="printForm.printerRemark">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <el-dialog title="撤回理由" :visible.sync="isShowRevokeDialog" width="30%">
            <div class="ebody">
                <el-form ref="revokeForm" :model="revokeForm" :rules="revokeRule" label-width="0">
                    <el-form-item :label="''" prop="revokeReason">
                        <el-input v-model.trim="revokeForm.revokeReason" :rows="5" :maxlength="100" type="textarea" placeholder="请输入撤回理由(1-100个字符)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="isShowRevokeDialog = false">取 消</el-button>
				<el-button type="primary" @click="revokeBeforePrintConfirm()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import BackTool from "@/components/BackTool";
    import FileList from '@/components/FileList/FileList.vue';
    import baseMixin from '@/mixins/baseMixin';
    import {mapGetters} from 'vuex';
    import {
        getApplyEditInfo,
        finishPrintSeniorApply,
        revokePrintSeniorApply,
        confirmPrintSeniorApply,
        approveApply,
        approvalNotPrinted,
        findPriceList
    } from '@/api/printApplication';
    import {getDicByCode} from '@/utils/utils';
     import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    export default {
        name: "printApplyDetail",
        components: {BackTool, FileList,ImagePreviewer},
        mixins: [baseMixin],
        filters: {
            statusFilterMaterial(status) {
                return {
                    '-1': '已撤回',
                    1: '草稿',
                    2: '待审批',
                    3: '被驳回',
                    4: '已通过',
                    5: '已发放',
                    6: '已领取'
                }[status];
            },
            timeFilter(value) {
                return value?value.slice(0, value.lastIndexOf(':')):"";
            },
            timeFilterSecond(value) {
                return value?value.slice(0, value.lastIndexOf('.')):"";
            }
        },
        data() {
            const pageValidator = (rule, value, callback) => {
                if (this.printForm.pageDouble.trim() === '' || this.printForm.pageSingle.trim() === '') {
                    return callback(new Error('页数不能为空！'));
                } else {
                    callback();
                }
            };

            return {
                id: this.$route.query.id,
                kind: this.$route.query.kind,
                isApply: this.$route.query.isApply == 1,
                isPrint: this.$route.query.isPrint == 1,
                isReview: this.$route.query.isReview == 1,
                state: null,
                copies:"",
                reviewForm: {
                    approveRemark: ''
                },
                reviewFormRules: {
                    approveRemark: [
                        {required: true, message: '请填写审批意见', trigger: "blur"},
                    ]
                },                
                ruleForm: {
                    name: '',
                    useDate: '',
                    morningOrAfternoon: 1,
                    copies: 1,
                    paperSizeType: 1,
                    side: 1,
                    applyRemark: '',
                    approveType: '',
                    useType: '',
                    useTypeName: '',
                    pageDouble: '',
                    pageSingle: '',
                    paperDouble: '',
                    paperSingle: '',
                    totalPapers: ''
                },
                files: [],
                printForm: {
                    copies: '',
                    pageDouble: '',
                    pageSingle: '',
                    side: '0',
                    outsource: '1',
                    printerRemark: '',
                    paperSizeType: '1'
                },
                printFormRules: {
                    copies: [
                        {required: true, message: `${this.kind === 'file' ? '印制份数' : '发放数量'}不能为空`, trigger: "blur"},
                    ],
                    pages: [
                        {required: true, validator: pageValidator},
                    ],
                    side: [
                        {required: true},
                    ],
                    outsource: [
                        {required: true},
                    ],
                    paperSizeType: [
                        {required: true, message: "纸张大小不能为空", trigger: "blur"},
                    ],
                },
                typeList: [],

                isShowRevokeDialog: false,
                revokeForm: {
                    revokeReason: ''
                },
                revokeRule: {
                    revokeReason: [
                        {required: true, message: `撤回理由不能为空`, trigger: "blur"},
                    ],
                },
                revokeReviewForm: {
                    approvalContent: ''
                },

                revokeReviewRule: {
                    approvalContent: [
                        {required: true, message: `审批内容不能为空`, trigger: "blur"},
                    ],
                },
                active:0,
                myobj:{
                    createTime:"",
                    createUserName:"",
                    approveTime:"",
                    approveUserName:"",
                    printTime:"",
                    printerName:"",
                    updateTime:"",
                    createUserId:""
                }
               
            }
        },        
        created() {
            getDicByCode('printSeniorApplyPaperSizeType')
                .then(list => {
                    findPriceList()
                        .then(res => res.data)
                        .then(data => {
                            const types = data.data.map(({type}) => `${type}`);
                            this.typeList = list.filter(({code}) => types.indexOf(`${code}`) != -1);
                        })
                });
            getApplyEditInfo({
                printApplyId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data.print;
                    pageData.paperSizeType = pageData.paperSizeType.toString();
                    pageData.approveUserNameStr = pageData.approveUserList.map(e => e.name).join(' ')
                    this.ruleForm = pageData;
                    this.files = JSON.parse(pageData.fileJson);
                    this.printForm.copies = pageData.copies;
                    this.copies= pageData.copies;
                    this.printForm.side = `${pageData.side}`;
                    this.printForm.paperSizeType = pageData.paperSizeType;
                    this.state = pageData.state;
                    // 状态 -1撤回 1-草稿 2-待审核 3-驳回 4-已审核(未打印) 5-已打印(未领取) 6
                    if(pageData.status==2){
                      this.active=1
                    }
                    if(pageData.status==3||pageData.status==4){
                      this.active=2
                    }
                    if(pageData.status==5){
                      this.active=3
                    }
                    if(pageData.status==6){
                      this.active=4
                    }
                    this.myobj=pageData
                })
        },
        computed: {
             ...mapGetters(['userInfo']),
            totalPapers() {
                let paperDouble = 0, paperSingle = 0;
                if(this.printForm.pageDouble) {
                    paperDouble = Number.parseInt(this.printForm.copies) * Number.parseInt(this.printForm.pageDouble);
                }
                if(this.printForm.pageSingle) {
                    paperSingle = Number.parseInt(this.printForm.copies) * Number.parseInt(this.printForm.pageSingle);
                }
                return paperDouble + paperSingle;
            },
            paperDouble() {
                if(this.printForm.pageDouble) {
                    return Number.parseInt(this.printForm.copies) * Number.parseInt(this.printForm.pageDouble);
                } else {
                    return 0;
                }
            },
            paperSingle() {
                if(this.printForm.pageSingle) {
                    return Number.parseInt(this.printForm.copies) * Number.parseInt(this.printForm.pageSingle);
                } else {
                    return 0;
                }
            }
        },
        methods: {
            getStatusText(item) {
                let text = '';
                if(item.status != 4) {
                    text = {
                        '-1': '已撤回',
                        1: '草稿',
                        2: '待审批',
                        3: this.isPrint ? '被驳回' : '已驳回',
                        4: this.isPrint ? '未打印' : '已通过',
                        5: '已打印',
                        6: '已领取'
                    }[item.status];
                } else {
                    text = {
                        1: '已撤回',
                        2: this.isPrint ? '未打印' : '已通过',
                        3: this.isPrint ? '未打印' : '已通过',
                        null: this.isPrint ? '未打印' : '已通过'
                    }[item.state]
                }
                return text;

            },
            enMakeOut(key) {
                this.printForm[key] = this.printForm[key].replace(/[^\d]/ig,'');
            },
            revokeReviewHandler(state) {
                this.$refs.revokeReviewForm.validate(isValid => {
                    if(isValid) {
                        approvalNotPrinted({
                            approvalContent: this.revokeReviewForm.approvalContent,
                            applyId: this.id,
                            state
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('审批成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 500);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            reviewHandler(status) {
                this.$refs.reviewForm.validate(isValid => {
                    if(isValid) {
                        approveApply({
                            approveRemark: this.reviewForm.approveRemark,
                            id: this.id,
                            status
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('审批成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 500);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })

            },
            confirmHandler() {
                this.$confirm('是否确认该条申请吗？', '确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmPrintSeniorApply({
                        id: this.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('确认成功');
                                this.$router.back();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            revokeHandler() {
                this.$confirm('是否撤回该条申请吗？', '撤回', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    revokePrintSeniorApply({
                        id: this.id,
                        revokeReason: '',

                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('撤回成功');
                                this.$router.back();

                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            revokeBeforePrint() {
                this.isShowRevokeDialog = true;
            },
            revokeBeforePrintConfirm() {
                this.$refs.revokeForm.validate(isValid => {
                    if(isValid) {
                        this.$confirm('是否撤回该条申请吗？', '撤回', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            revokePrintSeniorApply({
                                id: this.id,
                                revokeReason: this.revokeForm.revokeReason,
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if(data.result) {
                                        this.$message.success('撤回成功');
                                        this.$router.back();

                                    } else {
                                        this.$message.error(data.msg);
                                    }
                                })
                        });
                    }
                });

            },
            finishPrintHandler() {
                this.$refs.printForm.validate(isValid => {
                    if(isValid) {
                        let args = {
                            id: this.id,
                            printerRemark: this.printForm.printerRemark,
                            status: 5,
                        };
                        if(this.kind === 'file') {
                            args = {
                                ...args,
                                copies: this.printForm.copies,
                                outsource: this.printForm.outsource,
                                paperDouble: this.paperDouble,
                                paperSingle: this.paperSingle,
                                pageDouble: this.printForm.pageDouble,
                                pageSingle: this.printForm.pageSingle,
                                side: this.printForm.side,
                                paperSizeType: this.printForm.paperSizeType
                            };
                            const pageSizeObj = this.typeList.find(item => item.code == this.printForm.paperSizeType);
                            args.paperSizeName = pageSizeObj.value;
                            args.totalPapers = this.totalPapers;
                        } else {
                            args.copies = this.ruleForm.copies;
                            args.totalPapers = this.printForm.copies;
                        }

                        finishPrintSeniorApply(args)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.kind == 'file' ? '影印' : '发放'}完成`);
                                    this.$router.back();

                                } else {
                                    this.$message.error(data.msg);
                                }
                            })

                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

    .label {
        text-align: right;
    }

    .content-container {
        margin: 20px;
        padding-right: 200px;
        position: relative;
    }
    .activebox{
           position: absolute;
            top: 40px;
            left: 800px;
            height: 500px;
            width: 300px;
        }
    .big-title {
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }

    .content {
        width: 800px;
        box-sizing: border-box;
    }

    .value {
        color: #666;
    }

    .file-list {
        width: 70%;
        min-width: 500px;
    }

    .line {
        padding-left: 80px;
        margin-bottom: 10px;
    }
    .print-form-container {
        width: 900px;

    }
    .text-overflow-300 {
      width: 300px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
</style>
<style lang="scss">

    #printApplyDetail .file-list {
        width: 70%;
        box-sizing: border-box;
        padding-left: 80px;

        .file_list_box {
            background-color: #fff !important;
        }

    }
    #printApplyDetail {
        .file-list__title {
            display: none;
        }
    }
</style>
