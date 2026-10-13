<!--用户已发送通知列表-->
<template>
    <div  class="shenpione">  
        <div class="top">
            <el-row>
                <el-col :span="19">
                     <el-select style="width:150px" size="medium" v-model="noticeId" placeholder="请选择报名批次" @change="getNoticeCountryListFromDatas()">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="selectJuniorSchoolFunc" size="medium" v-model="locationArray" placeholder="请选择区">
                        <el-option :key="0" label="全部区" value=""></el-option>
                        <el-option v-for="item in qulist" :key="item.schoolCountryCode" :label="item.schoolCountyName" :value="item.schoolCountryCode"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="handleFilter" size="medium" v-model="graduateSchoolCode" placeholder="请选择毕业学校">
                        <el-option :key="0" label="全部毕业学校" value=""></el-option>
                        <el-option v-for="item in juniorSchoolList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                    </el-select>
                    <el-cascader v-model="subjectStudentCode" :props="props" placeholder="全部特长生" :show-all-levels="false" size="medium" clearable @change="handleFilter"></el-cascader>
                    <!-- <el-select style="width:150px" @change="handleFilter" size="medium" v-model="subjectStudentCode" placeholder="请选择特长生">
                        <el-option :key="0" label="全部特长生" value=""></el-option>
                        <el-option v-for="item in subjectStudentList" :key="item.code" :label="item.value"  :value="item.code"></el-option>
                    </el-select> -->
                     <el-select style="width:150px" @change="handleFilter" size="medium" v-model="approvalState" placeholder="请选择状态">
                         <el-option  label="全部" :value="''"></el-option>
                        <el-option :key="0" label="未审核" :value="0"></el-option>
                        <el-option :key="1" label="通过" :value="1"></el-option>
                        <el-option :key="2" label="不通过" :value="2"></el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="funshowBox(1)">批量通过</el-button>
                    <el-button type="primary" size="medium" @click="funshowBox(2)">批量不通过</el-button>
                     <import-file :config="importConf" @success="handleFilter"></import-file>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="姓名" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
                <el-table stripe :data="dataList" border fit highlight-current-row
                          style="width: 100%" :height="nobottommaxH - 35"
                          @select="handleSelectionChange" @select-all="handleSelectionChange"
                          
                >
                    <el-table-column type="selection" :selectable="selectedfun" align="center" width="65px" :resizable="false">
                    </el-table-column>
                    <el-table-column align="center" label="建档号" prop="recordNum">
                    </el-table-column>
                    <el-table-column label="姓名" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="link-type" @click="jumpToPage('signupStuDetail', {id: scope.row.id, noticeId,approvalStepId:2,secondExamState:scope.row.secondExamState})">
                                {{scope.row.stuName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="学校区域">
                        <template slot-scope="scope">
                            <span>{{scope.row.schoolCountyName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="毕业院校">
                        <template slot-scope="scope">
                            <span>{{scope.row.graduateSchoolName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="班级">
                        <template slot-scope="scope">
                            <span>{{scope.row.locateClassName }}</span>
                        </template>
                    </el-table-column>
                     <el-table-column show-overflow-tooltip align="center" label="特长生（首选）">
                        <template slot-scope="scope">
                            <span>{{scope.row.subjectStuSchoolName }}{{scope.row.subjectStudentName }}</span>
                        </template>
                    </el-table-column>
                      <el-table-column show-overflow-tooltip align="center" label="特长生（备选）">
                        <template slot-scope="scope">
                            <span>{{scope.row.spareSubStuSchoolName }}{{scope.row.spareSubStuName }}</span>
                        </template>
                    </el-table-column>
                     <el-table-column show-overflow-tooltip align="center" label="二审结果">
                         <template slot-scope="scope">
                        <el-tag v-if="scope.row.secondExamState == 0" size="mini" type="warning">待审批</el-tag>
                        <el-tag v-if="scope.row.secondExamState == 1" size="mini" type="success">通过</el-tag>
                        <el-tag v-if="scope.row.secondExamState == 2" size="mini" type="danger">不通过</el-tag>
                    </template>
                    </el-table-column>
                     <el-table-column align="center" label="咨询会签到次数" prop="signCount">
                    </el-table-column>
                   
                </el-table>
                <div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
      <el-dialog :title="listQuery.examState==1?'批量通过':'批量不通过'" :visible.sync="showBox" width="500px" :close-on-press-escape='false'
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
    </div>
</template>

<script>
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import { mapGetters } from 'vuex'
    import {findDicsByCode, findSchoolDicsByCode, getSchoolDicDetailsByTypeCode2} from '@/api/common/common';
    import {
        selectJuniorSchool,getEnrollStuFieldBySchoolId,getNoticeCountryListFromDatas,
        getSchoolPublishEnrollNoticeList,getApprovalEnrollStuInfoPageList,approvalEnrollStuInfo
    } from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import ImportFile from '@/components/ImportFile'
    export default {
        name: 'signupStuList',
        data() {
            return {
                listQuery:{
                    examRemark:"",//	审核意见	string	
                    examState:1,//	审核状态 1通过 2不通过 3退回	number	
                    examType:2,//	审核类型 1预审 2二审 3三审	number	
                    noticeId:"",//	招生通知ID	number	
                    stuIds:"",//	学生IDS,多个使用逗号分隔	string	
                },
                 rules: {
                    examRemark: [{ required: true, message: '请填写审批意见', trigger: 'change' }]
                    },
                showBox:false,
                approvalState:'',
                noticeId: '',
                noticeList: [],
                dataList: [],
                cutH: 225,
                searchTitle: '',
                locationArray:'',
                juniorSchoolList: [],
                zhiyuanList: [],
                graduateSchoolCode: '',
                firBatchFirWishSchoolCode: '',
                subjectStudentCode: '',
                groupId: '',
                isHasMidTestPic: 0,
                isHasWishPic: 0,
                isSubjectTalentStu: 0,
                orderType: 0,
                selection: [],
                midPics: [],
                zyPics: [],

                isShowMoveDialog: false,
                moveIds: '',
                moveFormData: {
                    targetGroupId: ''
                },
                moveFormDataRules: {
                    targetGroupId: [
                        {required: true, message: '请选择要移动到的分组', trigger: 'blur'}
                    ]
                },
                subjectStudentList: [],
                fieldRemark:{
                    onetxt:'',
                    twotxt:''
                },
                qulist:[],
                  importConf: {
                    btnName: '导入审核名单',
                    title: '导入审核名单',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/import_approve_template.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/enrollStudentInfo/importApprove',
                    uploadArgs: {
                        noticeId:"",
                        operateType:2
                    },
                    errUrl: 'structure/enrollStudentInfo/downloadImportApproveResultXls',
                    lingjie:1,
                    name:'datafile'
                },
                props: {
                    emitPath: false,
                    lazy: true,
                    leaf: 'isLeaf',
                    lazyLoad: (node, resolve) => {
                        const { level, data } = node;
                        if (level === 0) {
                            getSchoolDicDetailsByTypeCode2({
                                typeCode: "talentCampusSubjectDict",
                                schoolId:this.schoolInfo.id
                            }).then(res => {
                                const data = res.data.data
                                resolve(data.map(i => ({
                                    label: i.name,
                                    value: i.code
                                })))
                            })
                        } else if (level > 1) {
                            resolve([])
                        } else if (data.value) {
                            findSchoolDicsByCode({
                                dicCode: data.value,
                                schoolId: this.schoolInfo.id
                            }).then(res => {
                                const resData = res.data.data
                                resolve(resData.map(i => ({
                                    label: i.value,
                                    value: data.value + '_' + i.code,
                                    isLeaf: true
                                })))
                            })
                        } else {
                            resolve([])
                        }
                    }
                }
            }
        },
        components: { ImagePreviewer,ImportFile},
        computed: {
            ...mapGetters(['schoolInfo']),
        },
        created() {
             getEnrollStuFieldBySchoolId()
                .then(res => res.data)
                .then(data => {
                    data.data.forEach(item => {
                        if(item.fieldName=="newshenhetwo"){
                                   this.fieldRemark=JSON.parse(item.fieldRemark)
                         }
                    })
                })
            // findSchoolDicsByCode({ dicCode: 'subjectStudentList' })
            //     .then(res => res.data)
            //     .then(({data}) => {
            //         if (data && data.length !== 0) {
            //             this.subjectStudentList = data;
            //         }
            //     });
            getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        this.noticeId = data.data[0].id;
                    }
                    this.getNoticeCountryListFromDatas();
                });
            findDicsByCode({
                dicCode: 'nanjing_senior_school_first'
            })
                .then(res => res.data)
                .then(data => {
                    this.zhiyuanList = data.data;
                })
        },
        activated() {
            this.noticeId && this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {

            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
              getNoticeCountryListFromDatas(){
                this.juniorSchoolList=[]
                this.graduateSchoolCode='',
                this.locationArray=''
                this.getList()
                getNoticeCountryListFromDatas(this.noticeId).then(res => {
                            const data = res.data;
                            this.qulist=data.data;                            
                            }).catch(() => {});
            },
            selectedfun(row, index) {
                if (row.secondExamState==0) { // 根据你的条件来设置
                    return true //可选择
                } else {
                    return false; //不可选择
                }
            },
              selectJuniorSchoolFunc() {
                selectJuniorSchool({
                    areaCode:  `${!this.locationArray?'':this.locationArray}`
                })
                    .then(res => res.data)
                    .then(data => {
                        this.juniorSchoolList = data.data;
                        this.handleFilter();
                    })
            },
            isShowByPermission,
            handleSelectionChange(val) {
                this.selection = val
            },
            getList() {
                this.importConf.uploadArgs.noticeId=this.noticeId
                const args = {
                     graduateSchoolCode: this.graduateSchoolCode,
                     schoolCountryCode: `${!this.locationArray?'':this.locationArray}`,
                     noticeId: this.noticeId,
                     pageNo: this.pagination.pageNo,
                     pageSize: this.pagination.pageSize,
                     searchTitle: this.searchTitle,
                     orderType: 0,                    
                     approvalState:this.approvalState,
                     approvalStepId:2                   
                };
                if (this.subjectStudentCode) {
                    const [subjectStuSchoolCode, subjectStudentCode] = this.subjectStudentCode.split('_');
                    args.subjectStudentCode = subjectStudentCode || ''
                    args.subjectStuSchoolCode = subjectStuSchoolCode || ''
                } else {
                    args.subjectStudentCode = ''
                }
                getApprovalEnrollStuInfoPageList(args).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;                    
                        this.pagination.total = data.pagination.total;
                    } else {
                        this.$message({
                        message: data.msg,
                        type: 'warning'
                        });
                    }
                    }).catch();
                
            },
            handleFilter() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.pagination.pageNo = val;
                this.getList();
            },
            funshowBox(num) {
               
                if (this.selection.length === 0) {
                    this.$message.error('请选择至少一个审批学生');
                } else {
                    this.listQuery.stuIds=this.selection.map(item => item.id).join(',')
                    this.listQuery.examState=num
                    this.listQuery.noticeId=this.noticeId
                    if(num==1){
                         this.listQuery.examRemark=this.fieldRemark.onetxt
                    }else{
                        this.listQuery.examRemark=this.fieldRemark.twotxt
                    }
                    this.showBox=true;
                }
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
                            this.getList();
                           this.showBox=false;
                            }).catch(() => {
                           this.showBox=false;
                            });
                    //   this.approvePracticeActivity(this.listQuery)
                    }
                })
            },
        }
    }
</script>
<style lang="scss">
.shenpione{
    padding: 12px;
    .top{
        padding-bottom: 10px;
    }
}
</style>
<style lang="scss" scoped>
    /deep/.el-cascader {
        .el-input__inner {
            /* 通用修改所有输入框的 placeholder 颜色 */
            &::placeholder {
                color: #606266; /* 你想要的颜色 */
                opacity: 1; /* 防止部分浏览器默认半透明 */
            }

            /* 兼容旧版 Chrome/Safari/Edge */
            &::-webkit-input-placeholder {
                color: #606266;
                opacity: 1;
            }

            /* 兼容旧版 Firefox */
            &::-moz-placeholder {
                color: #606266;
                opacity: 1;
            }

            /* 兼容旧版 IE */
            &:-ms-input-placeholder {
                color: #606266;
                opacity: 1;
            }
        }
    }
</style>
