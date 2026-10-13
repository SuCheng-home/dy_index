<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div style="border: 0;margin-bottom: 10px;">
            <a :href="tableExportUrl" target="_blank" download="导出列表">
                <el-button type="primary" size="medium">导出列表</el-button>
            </a>
            <a :href="scoreExportUrl" target="_blank" download="导出列表">
                <el-button type="primary" size="medium">导出成绩</el-button>
            </a>
            <el-button type="primary" size="medium" @click="exportPics">导出图片</el-button>
            <el-button type="primary" size="medium" @click="batchMove">批量移动</el-button>
            <import-file :config="importConf" @success="handleFilter"></import-file>
            <import-file :config="newimportConf" @success="handleFilter"></import-file>
        </div>
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                   <el-select style="width:150px" size="medium" v-model="noticeId" placeholder="请选择报名批次" @change="getNoticeCountryListFromDatas()">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="selectJuniorSchoolFunc('')" size="medium" v-model="locationArray" placeholder="请选择区">
                        <el-option :key="0" label="全部区" value=""></el-option>
                        <el-option v-for="item in qulist" :key="item.schoolCountryCode" :label="item.schoolCountyName" :value="item.schoolCountryCode"></el-option>
                    </el-select>
                    <el-select  style="width:150px" @change="handleFilter" size="medium" v-model="graduateSchoolCode" placeholder="请选择毕业学校">
                        <el-option :key="0" label="全部毕业学校" value=""></el-option>
                        <el-option v-for="item in juniorSchoolList" :key="item.code" :label="item.value"
                                   :value="item.code"></el-option>
                    </el-select>
                    <el-select  style="width:150px" @change="handleFilter" size="medium" v-model="firBatchFirWishSchoolCode"
                               placeholder="请选择A志愿学校">
                        <el-option :key="0" label="全部A志愿学校" value=""></el-option>
                        <el-option v-for="item in zhiyuanList" :key="item.code" :label="item.value"
                                   :value="item.code"></el-option>
                    </el-select>
                    <el-cascader v-model="subjectStudentCode" :props="props" placeholder="全部特长生(首选)" :show-all-levels="false" size="medium" clearable @change="handleFilter"></el-cascader>
                    <el-cascader v-model="spareSubStuCode" :props="props" placeholder="全部特长生(备选)" :show-all-levels="false" size="medium" clearable @change="handleFilter"></el-cascader>
                    <!-- <el-select  style="width:150px" @change="handleFilter" size="medium" v-model="subjectStudentCode"
                               placeholder="请选择特长生">
                        <el-option :key="0" label="全部特长生(首选)" value=""></el-option>
                        <el-option v-for="item in subjectStudentList" :key="item.code" :label="item.value+'(首选)'"
                                   :value="item.code"></el-option>
                    </el-select>
                     <el-select  style="width:150px" @change="handleFilter" size="medium" v-model="spareSubStuCode"
                               placeholder="请选择特长生">
                        <el-option :key="0" label="全部特长生(备选)" value=""></el-option>
                        <el-option v-for="item in subjectStudentList" :key="item.code" :label="item.value+'(备选)'"
                                   :value="item.code"></el-option>
                    </el-select> -->
                    <el-select  style="width:150px" @change="handleFilter" size="medium" v-model="isHasTalentPic" placeholder="请选择态">
                        <el-option  label="全部特长生志愿截图" :value="''"></el-option>
                        <el-option  label="已上传特长生志愿截图" :value="1"></el-option>
                        <el-option  label="未上传特长生志愿截图" :value="0"></el-option>
                    </el-select>
                    <el-select  style="width:150px" @change="handleFilter" size="medium" v-model="state"
                               placeholder="请选择学生状态">
                        <el-option  label="全部学生" :value="0"></el-option>
                        <el-option  label="已填报完成学生" :value="2"></el-option>
                        <el-option  label="未填报完成学生" :value="1"></el-option>
                    </el-select>
                    <el-switch @change="handleFilter" :active-value="1" :inactive-value="0" v-model="isHasMidTestPic"
                               active-text="仅查看上传中考成绩单截图"></el-switch>
                    <el-switch @change="handleFilter" :active-value="1" :inactive-value="0" v-model="isHasWishPic"
                               active-text="仅查看上传志愿截图"></el-switch>
                    <el-switch @change="handleFilter" :active-value="2" :inactive-value="0" v-model="isSubjectTalentStu"
                               active-text="仅查看特长生"></el-switch>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="姓名/准考证号" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <div class="left-panel">
                <div class="group-list">
                    <div @click="onGroupChange(groupItem)"
                         :class="['group-item', groupItem.id == groupId ? 'group-item--active' : '']"
                         v-for="(groupItem, index) in groupList">{{groupItem.groupName}}
                    </div>
                </div>
            </div>
            <div class="right-panel">
                <el-table stripe :data="list" border fit highlight-current-row
                          style="width: 100%" :height="nobottommaxH - 85"
                          @select="handleSelectionChange" @select-all="handleSelectionChange"
                          @sort-change="onSortChange"
                >
                    <el-table-column type="selection" align="center" width="65px" :resizable="false">
                    </el-table-column>
                    <el-table-column align="center" label="登记ID号" prop="orderNo">
                    </el-table-column>
                    <el-table-column align="center" label="建档号" prop="recordNum">
                    </el-table-column>                     
                    <el-table-column label="姓名" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="link-type" @click="jumpToPage('signupStuDetail', {id: scope.row.id, noticeId})">
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
                    <el-table-column show-overflow-tooltip align="center" label="特长生">
                        <template slot-scope='{row}'>
                            <span v-if="row.isSubjectTalentStu === 2">{{ row.subjectStuSchoolName}}{{ row.subjectStudentName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="status-col" label="中考成绩" prop="score" sortable>
                    </el-table-column>
                    <el-table-column align="center" label="名次" prop="midTestCityNo">
                    </el-table-column>
                    <el-table-column align="center" label="指标生">
                        <template slot-scope="scope">
                            {{['', '否', '是'][scope.row.indexStudent]}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="A志愿">
                        <template slot-scope="scope">
                            {{scope.row.firBatchFirWishSchoolName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="B志愿">
                        <template slot-scope="scope">
                            {{scope.row.firBatchSecWishSchoolName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="C志愿">
                        <template slot-scope="scope">
                            {{scope.row. secBatchFirWishSchoolName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="中考成绩单截图">
                        <template slot-scope="scope">
                            <span class="link-type" v-if="scope.row.midTestPics.length !== 0"
                                  @click="showMidPics(scope.row)">查看图片</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="志愿截图">
                        <template slot-scope="scope">
                            <span class="link-type" v-if="scope.row.pics.length !== 0" @click="showZyPics(scope.row)">查看图片</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="咨询会签到次数" prop="signCount">
                    </el-table-column>
                     <el-table-column align="center" label="填报时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime?scope.row.createTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column> 
                  <el-table-column align="center" label="填报状态" >
                    <template slot-scope="scope">
                       <el-tag  size="mini" v-if="scope.row.state === 2" type="success">已完成</el-tag>
                       <el-tag  size="mini" v-else type="info">未完成</el-tag>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="招生专员" >
                    <template slot-scope="scope">
                       {{scope.row.agentUserName}}
                    </template>
                </el-table-column> 
                    <el-table-column align="center" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="groupId" size="small"  type="text" @click="handleRemoveGroup(scope.row.id)" class="buttontextred">
                                移除
                            </el-button>
                            <el-button v-else-if="scope.row.state !== 2" size="small"  type="text" @click="deleteStuById(scope.row.id)" class="buttontextred">
                                删除
                            </el-button>
                            <el-button size="small" type="text"
                                       :disabled="scope.row.state == 2"
                                       @click="moveFunc(scope.row.id)">移动
                            </el-button>
                            <router-link v-if="scope.row.isSubjectTalentStu === 2" :to="{
                                path: 'signupStuTalentTable',
                                query: { enKey: scope.row.enKey,id: scope.row.id, schoolId: schoolInfo.id }
                            }">
                                <el-button size="small" type="text">特长生表
                                </el-button>
                            </router-link>
                        </template>
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
        </div>
        <image-previewer ref="midPreviewer" :images="midPics"></image-previewer>
        <image-previewer ref="zyPreviewer" :images="zyPics"></image-previewer>
        <el-dialog width="400px" title="分组" :visible.sync="isShowMoveDialog" custom-class="dialog">
            <el-form :model="moveFormData" ref="moveForm" label-width="120px" :rules="moveFormDataRules">
                <el-form-item label="移动到的分组" prop="targetGroupId">
                    <el-select size="medium" v-model="moveFormData.targetGroupId" placeholder="请选择报名批次">
                        <el-option v-for="(groupItem, index) in moveGroupList" :key="groupItem.id" :label="groupItem.groupName"
                                   :value="groupItem.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowMoveDialog = false">取 消</el-button>
                <el-button type="primary" @click="moveConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import LocationSelector from '@/components/LocationSelector';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import { mapGetters } from 'vuex'
    import {findDicsByCode, findSchoolDicsByCode, getSchoolDicDetailsByTypeCode2} from '@/api/common/common';
    import {
        getEnrollStuInfoPageList,
        getNoticeGroupStudentPageList,
        delNoticeByIds,
        selectJuniorSchool,
        getSchoolEnrollGroupList,
        moveEnrollStudentsToGroup,
        exportAllStuAndAllPicList,
        getSchoolPublishEnrollNoticeList,getNoticeCountryListFromDatas,deleteStuById, deleteEnrollGroupStu
    } from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import ImportFile from '@/components/ImportFile'

    export default {
        name: 'signupStuList',
        components: { LocationSelector, ImagePreviewer, ImportFile },
        data() {
            return {
                noticeId: '',
                noticeList: [],
                list: [],
                cutH: 225,
                searchTitle: '',
                locationArray:'',
                juniorSchoolList: [],
                zhiyuanList: [],
                groupList: [],
                graduateSchoolCode: '',
                firBatchFirWishSchoolCode: '',
                subjectStudentCode: '',
                spareSubStuCode:'',
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
                qulist:[],
                state:0,
                 importConf: {
                    btnName: '导入分组名单',
                    title: '导入分组名单',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/import_enroll_group_template.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/enrollStudentInfo/importGroupStus',
                    uploadArgs: {
                        noticeId:""
                    },
                    errUrl: 'structure/enrollStudentInfo/downloadImportGroupStuResultXls',
                    lingjie:1,
                    name:'datafile'
                },
                newimportConf:{
                    btnName: '导入学生',
                    title: '导入学生',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/import_enroll_stu_template.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/enrollStudentInfo/importEnrollStus',
                    uploadArgs: {
                        noticeId:"",
                    },
                    errUrl: 'structure/enrollStudentInfo/downloadImportEnrollStusResultXls',
                    lingjie:1,
                    name:'datafile'
                },
                isHasTalentPic:"",
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
        computed: {
            ...mapGetters(['schoolInfo']),
            moveGroupList() {
                return this.groupList.filter(item => item.id != '' && item.id != this.groupId);
            },
            tableExportUrl() {
                let url = global.BasePath + `structure/enrollStudentInfo/exportNoticeStudentInfoList?firBatchFirWishSchoolCode=${this.firBatchFirWishSchoolCode}&subjectStudentCode=${this.subjectStudentCode}&spareSubStuCode=${this.spareSubStuCode}&graduateSchoolCode=${this.graduateSchoolCode}` +
                 `&isHasMidTestPic=${this.isHasMidTestPic}&isHasWishPic=${this.isHasWishPic}&isSubjectTalentStu=${this.isSubjectTalentStu}&isHasTalentPic=${this.isHasTalentPic}&state=${this.state}&noticeId=${this.noticeId}&orderType=${this.orderType}&schoolCountryCode=${!this.locationArray?'':this.locationArray}&token=${this.$store.getters.token}`;
                if (this.groupId) {
                    url += `&groupId=${this.groupId}`;
                }
                console.log('tableExportUrl', url)
                return url
            },
            scoreExportUrl() {
                return global.BasePath + `structure/enrollStudentInfo/exportGrowFootScoreList?firBatchFirWishSchoolCode=${this.firBatchFirWishSchoolCode}&subjectStudentCode=${this.subjectStudentCode}&spareSubStuCode=${this.spareSubStuCode}&graduateSchoolCode=${this.graduateSchoolCode}` +
                    `&isHasMidTestPic=${this.isHasMidTestPic}&isHasWishPic=${this.isHasWishPic}&isSubjectTalentStu=${this.isSubjectTalentStu}&isHasTalentPic=${this.isHasTalentPic}&state=${this.state}&noticeId=${this.noticeId}&orderType=${this.orderType}&schoolCountryCode=${!this.locationArray?'':this.locationArray}&token=${this.$store.getters.token}`;
            }
        },
        created() {
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
                        if(this.$route.query.noticeId){
                            this.noticeId = this.$route.query.noticeId;
                        }else{
                            this.noticeId = data.data[0].id;
                        }
                       
                       
                    }
                    this.getNoticeCountryListFromDatas(this.$route.query.schoolCountryCode)
                });
            findDicsByCode({
                dicCode: 'nanjing_senior_school_first'
            })
                .then(res => res.data)
                .then(data => {
                    this.zhiyuanList = data.data;
                })
            getSchoolEnrollGroupList()
                .then(res => res.data)
                .then(data => {
                    data.data.unshift({
                        groupName: '全部报名批次',
                        id: ''
                    })
                    this.groupList = data.data;
                })
        },
        activated() {
            if(this.$route.query.noticeId){
                 getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        if(this.$route.query.noticeId){
                            this.noticeId = this.$route.query.noticeId-0;
                        }else{
                            this.noticeId = data.data[0].id;
                        }
                        this.importConf.uploadArgs.noticeId = this.noticeId;
                        this.newimportConf.uploadArgs.noticeId = this.noticeId;
                    }
                    this.getNoticeCountryListFromDatas(this.$route.query.schoolCountryCode)
                });
            }
            this.noticeId && this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {

            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
             getNoticeCountryListFromDatas(schoolCountryCode){
                this.juniorSchoolList=[]
                this.graduateSchoolCode='',
                this.locationArray=schoolCountryCode||''
                this.getList()
                getNoticeCountryListFromDatas(this.noticeId).then(res => {
                            const data = res.data;
                            this.qulist=data.data;    
                            if( this.locationArray){
                                this.selectJuniorSchoolFunc(this.$route.query.graduateSchoolCode)
                            }                        
                            }).catch(() => {});
            },
            isShowByPermission,
            exportPics() {
                exportAllStuAndAllPicList({
                    noticeId: this.noticeId,
                    state:this.state
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'https://api.weixiaojia.net/';
                            console.log(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`)
                            window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            batchMove() {
                if(this.selection.length === 0) {
                    this.$message.error('请选择至少一个要移动的条目');
                } else {
                    this.moveIds = this.selection.map(item => item.id).join(',');
                    this.moveFormData = {
                        targetGroupId: ''
                    };
                    this.isShowMoveDialog = true;
                }
            },
            moveFunc(id) {
                this.moveIds = id;
                this.moveFormData = {
                    targetGroupId: ''
                };
                this.isShowMoveDialog = true;
            },
            moveConfirm() {
                this.$refs.moveForm.validate(isValid => {
                    if(isValid) {
                        moveEnrollStudentsToGroup({
                            noticeId: this.noticeId,
                            stuIds: this.moveIds,
                            targetGroupId: this.moveFormData.targetGroupId
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('移动成功');
                                    this.stuIds = '';
                                    this.selection = [];
                                    this.getList();
                                    this.isShowMoveDialog = false;
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            showMidPics(item) {
                const index = this.midPics.findIndex(picItem => item.id == picItem.id);
                this.$refs.midPreviewer.showPreviewer(index);
            },
            showZyPics(item) {
                const index = this.zyPics.findIndex(picItem => item.id == picItem.id);
                this.$refs.zyPreviewer.showPreviewer(index);
            },
            onSortChange({order}) {
                if (order === 'ascending') {
                    this.orderType = 2;
                } else if (order === 'descending') {
                    this.orderType = 1;
                } else {
                    this.orderType = 0;
                }
                this.getList();
            },
            handleSelectionChange(val) {
                this.selection = val
            },
            onGroupChange(groupItem) {
                this.moveIds = '';
                this.selection = [];
                this.groupId = groupItem.id;
                this.getList();
            },
            selectJuniorSchoolFunc(graduateSchoolCode) {
                selectJuniorSchool({
                    areaCode:  `${!this.locationArray?'':this.locationArray}`
                })
                    .then(res => res.data)
                    .then(data => {
                        this.juniorSchoolList = data.data;
                         this.graduateSchoolCode=''
                        if(graduateSchoolCode&&this.$route.query.schoolCountryCode){
                            this.graduateSchoolCode=graduateSchoolCode
                        }
                        this.handleFilter();
                    })
            },
            handleRemoveGroup(id) {
                this.$confirm('是否从分组中移除该学生？', '确定移除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteEnrollGroupStu({
                        stuIds: id,
                        groupId: this.groupId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '移除成功!'
                                });
                                this.getList();
                            }
                        })
                });
            },
             deleteStuById(id) {
                this.$confirm('是否删除,删除将无法找回', '确定删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteStuById(id)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getList();
                            }
                        })
                });

            },
            getList() {
                 this.importConf.uploadArgs.noticeId = this.noticeId;
                 this.newimportConf.uploadArgs.noticeId = this.noticeId;
                const args = {
                    firBatchFirWishSchoolCode: this.firBatchFirWishSchoolCode,
                    graduateSchoolCode: this.graduateSchoolCode,
                    isHasMidTestPic: this.isHasMidTestPic,
                    isHasWishPic: this.isHasWishPic,
                    isSubjectTalentStu: this.isSubjectTalentStu,
                    noticeId: this.noticeId,
                    orderType: this.orderType,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchTitle: this.searchTitle,
                    schoolCountryCode:  `${!this.locationArray?'':this.locationArray}`,
                    state:this.state,
                    isHasTalentPic:this.isHasTalentPic
                };
                if (this.subjectStudentCode) {
                    const [subjectStuSchoolCode, subjectStudentCode] = this.subjectStudentCode.split('_');
                    args.subjectStudentCode = subjectStudentCode || ''
                    args.subjectStuSchoolCode = subjectStuSchoolCode || ''
                } else {
                    args.subjectStudentCode = ''
                }
                if (this.spareSubStuCode) {
                    const [spareSubStuSchoolCode, spareSubStuCode] = this.spareSubStuCode.split('_');
                    args.spareSubStuCode = spareSubStuCode || ''
                    args.spareSubStuSchoolCode = spareSubStuSchoolCode || ''
                } else {
                    args.spareSubStuCode = ''
                }
                new Promise(resolve => {
                    if (this.groupId) {
                        args.groupId = this.groupId;
                        getNoticeGroupStudentPageList(args)
                            .then(resolve)
                    } else {
                        getEnrollStuInfoPageList(args)
                            .then(resolve)
                    }

                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        const midPics = [], zyPics = [];
                        pageData.dataList.forEach(item => {
                            if (item.midTestPicJson) {
                                const pics = JSON.parse(item.midTestPicJson);
                                pics.forEach(picItem => {
                                    picItem.id = item.id;
                                    picItem.src = picItem.picUrl;
                                    picItem.remark = `学生姓名：${item.stuName}   (登记ID号：${item.orderNo})`;
                                });
                                item.midTestPics = pics;
                                midPics.push(...pics);
                            } else {
                                item.midTestPics = [];
                            }
                            if (item.picJson) {
                                const pics = JSON.parse(item.picJson);
                                pics.forEach(picItem => {
                                    picItem.id = item.id;
                                    picItem.src = picItem.picUrl;
                                    picItem.remark = `学生姓名：${item.stuName}   (登记ID号：${item.orderNo})`;
                                });
                                item.pics = pics;
                                zyPics.push(...pics);
                            } else {
                                item.pics = [];
                            }
                        });
                        this.midPics = midPics;
                        this.zyPics = zyPics;
                        this.list = pageData.dataList;
                        this.pagination.total = pageData.pagination.total;
                    }).catch(err => {
                });
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
            batchDelete() {
                if (this.selection.length === 0) {
                    this.$message.error('请选择至少一个要删除的条目');
                } else {
                    this.deleteFunc(this.selection.map(item => item.id).join(','));
                }
            },
            deleteFunc(ids) {
                this.$confirm('是否确认删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delNoticeByIds({ids})
                        .then(res => {
                            this.getList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch();

                }).catch(() => {
                });

            },
        }
    }
</script>
<style lang="scss">
    .pagination-container {
        margin-top: 10px;
    }

    .el-icon-paperclip {
        margin-right: 3px;
    }

    .group-item {
        box-sizing: border-box;
        padding: 10px;
        margin-bottom: 10px;
        text-align: left;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;

        &.group-item--active {
            background-color: #409EFF;
            color: #fff;
        }
    }

    .left-panel {
        float: left;
        width: 12%;
    }

    .right-panel {
        float: right;
        width: 87.5%
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
