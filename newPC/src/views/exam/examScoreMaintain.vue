<template>
    <div class="app-container">
        <backtool>
            <el-button type="primary" size="medium" @click.native="showSendDialog(query.id)">发布</el-button>
            <a :href="downLoadHref" target="_blank" download="examName">
                <el-button type="primary" size="medium">下载模版</el-button>
            </a>
            <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false'
                       accept=".xls,.xlsx" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-button type="primary" size="medium">模版导入</el-button>
            </el-upload>
        </backtool>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH">
            <el-table-column :label="'【'+examName+'】考试分数维护'" align="center">
                <el-table-column align="center" label="序号" width="65">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="学号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.learnNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.stuName }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item,index) in examList" align="left" :key="index"
                                 :label="item.curriculumName">
                    <template slot-scope="scope">
                        <!-- {{scope.row.scoreList}} -->
                        <el-input :maxlength="5" size="mini" v-model="scope.row.stuScoreList[index].score" placeholder="录入并保存成绩"
                                  @blur="scoreBlur(scope.row.stuName,scope.row.stuId,scope.row.stuScoreList[index].stuTotalScore,scope.row.stuScoreList[index])"></el-input>
                    </template>
                </el-table-column>

            </el-table-column>
        </el-table>
        <send-dialog ref="showSendDialog"></send-dialog>

        <el-dialog title="提示" :visible.sync="uploadDialogVisible" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false'>
            <span v-html="uploadMes"></span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadDialogVisible = false">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import {examScoreMaintain, examDetails, writeScore} from '@/api/systemSet/exam';
    import SendDialog from './sendDialog';
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';

    export default {
        data() {
            return {
                currIds: '',//科目id
                examList: [],
                tableKey: 'scoreMaintain',
                list: null,
                listLoading: false,
                examName: '',
                maxScore: '',
                uploadDialogVisible: false,
                uploadMes: '',
                query: {
                    id: '',
                    schoolTimeId: '',
                    gradeId: '',
                    gradeName: '',
                    departId: '',
                    departName: '',
                    curriculumId: '',
                    curriculumName: '',
                    stuId: '',
                    score: '',
                    classType:this.$route.query.classType
                },
                downLoadHref: '',
                uploadPath: '',
                uploadData: {
                    curriculumId: '',
                    curriculumName: '',
                    departId: '',
                    departName: '',
                    examType: '',
                    id: '',
                    name: '',
                    score: ''
                }
            }
        },
        components: {
            Backtool,
            SendDialog
        },
        mixins: [mixin],
        created() {
            this.query.id = this.$route.query.examId;
            this.listLoading = true;
            this.downLoadHref = global.BasePath + 'structure/exam/downLoadStuScore?examId=' + this.query.id + '&token=' + this.$store.getters.token;
            this.uploadPath = global.BasePath + 'structure/exam/uploadTemplate';
            examDetails(this.query.id).then(res => {
                let data = res.data.data;
                this.examName = data.name;
                this.query = {
                    id: data.id,
                    schoolTimeId: data.schoolTimeId,
                    gradeId: data.gradeId,
                    gradeName: data.gradeName,
                    departId: data.departId,
                    departName: data.departName,
                    curriculumId: data.curriculumId,
                    curriculumName: data.curriculumName,
                    stuId: data.stuId,
                    score: '',
                    classType:this.$route.query.classType
                };
                this.uploadData = {
                    curriculumId: data.curriculumId,
                    curriculumName: data.curriculumName,
                    departId: data.departId,
                    departName: data.departName,
                    examType: data.examType,
                    id: data.id,
                    name: data.name,
                    score: data.score,
                    token: this.$store.getters.token
                }
            }).catch();
            this.getList();
        },
        methods: {
            scoreBlur(StuName, stuId, maxScore, row) {
                this.maxScore = maxScore;
                this.query.curriculumName = row.curriculumName;
                this.query.curriculumId = row.curriculumId;
                this.query.stuId = stuId;
                let stuName = StuName;
                let score = row.score;
                let reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (!reg.test(score.trim()) && score != '') {
                    this.$message.error('请输入正数！');
                    row.score = '';
                } else {
                    if (score.trim() <= parseInt(this.maxScore)) {
                        this.query.score = score.trim();
                        this.listLoading = true;
                        writeScore(this.query).then(res => {
                            this.$message({
                                message: stuName + '成绩维护成功！',
                                type: 'success',
                                duration: 1000
                            });
                            row.score = score.trim();
                            this.listLoading = false;
                        }).catch(() => {
                            this.listLoading = false;
                        });
                    } else {
                        this.$message.error('请输入不大于' + this.maxScore + '的整数！');
                        row.score = '';
                    }
                }
            },
            handleAvatarSuccess(res) {
                this.getList();
                if (res.data.length === 0) {
                    this.$message({
                        message: '模版导入成功！',
                        type: 'success'
                    });
                } else {
                    this.uploadDialogVisible = true;
                    this.uploadMes = res.data;
                }
                this.listLoading = false;
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split('.')[file.name.split('.').length - 1];
                if (suffix !== 'xls' && suffix !== 'xlsx') {

                    this.$message.error('请上传模版文件!');
                } else {
                    this.listLoading = true;
                }
            },
            showSendDialog(id) {
                let _this = this;
                _this.currIds = _this.examList;
                _this.$refs.showSendDialog.showDialog(id, _this.currIds);
            },
            getList() {
                examScoreMaintain(this.query.id).then(res => {
                    let _this = this;
                    _this.list = res.data.data;
                    if (_this.list.length > 0) {
                        _this.examList = _this.list[0].stuScoreList;
                    }

                    _this.listLoading = false;
                }).catch(() => {
                    _this.listLoading = false;
                });
            }
        }
    }
</script>
<style scoped>
    .upload-import {
        display: inline-block;
    }
</style>
