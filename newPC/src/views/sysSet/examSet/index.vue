<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" icon="plus" @click.native="addExamSet">添加规则</el-button>
        </backtool>
        <div class="exam-set-box" :style="`height: ${nobottommaxH}px;overflow: auto;`">
            <div class="rule-item" v-for="item in list" :key="item.id">
                <div class="rule-title">
                    <div class="rule-title-des">{{item.gradeName}}成绩规则</div>
                    <div class="tools">
                        <span class="tool-edit" @click="editExamSet(item.id)">
                            <i class="el-icon-edit"></i>
                        </span>
                        <span class="tool-del" @click="deleteExamSet(item.id)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </div>
                </div>
                <div class="option-list">
                    <div class="option-item">
                        <span>{{item.levelAName}}</span>
                        <span>&gt;=</span>
                        <span>{{item.levelAVal}}%</span>
                    </div>
                    <div class="option-item">
                        <span>{{item.levelBName}}</span>
                        <span>&gt;=</span>
                        <span>{{item.levelBVal}}%</span>
                    </div>
                    <div class="option-item">
                        <span>{{item.levelCName}}</span>
                        <span>&gt;=</span>
                        <span>{{item.levelCVal}}%</span>
                    </div>
                    <div class="option-item">
                        <span>{{item.levelDName}}</span>
                        <span>&gt;=</span>
                        <span>{{item.levelDVal}}%</span>
                    </div>
                    <div class="option-item">
                        <span>{{item.levelEName}}</span>
                        <span>&gt;=</span>
                        <span>{{item.levelEVal}}</span>
                    </div>

                </div>
                <div class="mate-info">
                    <template v-if="item.parentDisplayRank==1">
                        <span class="mate-info-order-type">
                            <span class="parentDisplayRank-flag-sucess">
                                <i class="el-icon-check"></i>
                            </span>对家长展示排名</span>
                    </template>
                    <template v-else>
                        <span class="mate-info-order-type">
                            <span class="parentDisplayRank-flag-warn">
                                <i class="el-icon-information"></i>
                            </span>不对家长展示排名</span>
                    </template>
                     <template v-if="item.parentDisplayAvg==1">
                        <span class="mate-info-order-type">
                            <span class="parentDisplayRank-flag-sucess">
                                <i class="el-icon-check"></i>
                            </span>对家长展示均分</span>
                    </template>
                    <template v-else>
                        <span class="mate-info-order-type">
                            <span class="parentDisplayRank-flag-warn">
                                <i class="el-icon-information"></i>
                            </span>不对家长展示均分</span>
                    </template>
                </div>
                <div class="mate-info">
                    <!-- <span>匹配课程:</span> -->
                    <!-- <span class="mate-info-des"> -->
                    <template v-for="classItem in item.classSetList">
                        <span class="tag-item">
                            <el-tag type="primary">{{classItem.currName}}</el-tag>
                        </span>
                        <!-- {{classItem.currName}}&nbsp;&nbsp; -->
                    </template>

                    <!-- </span> -->
                </div>
            </div>
        </div>

        <el-dialog title="规则设置" :visible.sync="dialogVisible" size="tiny">
            <div class="exam-role">
                <div class="modal-body diet-modal-body ">
                    <div class="order-setter ">
                        <div class="order-setter-body ">
                            <div class="order-setter-list order-setter-list-hide " style="display: block; ">
                                <el-row>
                                    <el-col :span="3">
                                        <el-input v-model=" query.levelAName" size="medium" placeholder="等级"></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="set-suffix">&nbsp; &gt;=&nbsp;</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input-number v-model="query.levelAVal"  size="medium" :min="parseInt (query.levelBVal)+1" :debounce="1000" :max="100" :controls='false'></el-input-number>
                                    </el-col>
                                    <el-col :span="1"><div class="set-suffix">&nbsp;&nbsp;%</div></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">
                                        <el-input v-model=" query.levelBName" size="medium" placeholder="等级"></el-input>
                                    </el-col>
                                    <el-col :span="2"><div class="set-suffix">&nbsp; &gt;=&nbsp;</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input-number size="medium" v-model="query.levelBVal" :min="parseInt (query.levelCVal)+1" :debounce="1000" :max="query.levelAVal-1" :controls='false'></el-input-number>
                                    </el-col>
                                    <el-col :span="1"><div class="set-suffix">&nbsp;&nbsp;%</div></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">
                                        <el-input size="medium" v-model="query.levelCName" placeholder="等级"></el-input>
                                    </el-col>
                                    <el-col :span="2"><div class="set-suffix">&nbsp; &gt;=&nbsp;</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input-number size="medium" v-model="query.levelCVal" :min="parseInt (query.levelDVal)+1" :debounce="1000" :max="query.levelBVal-1" :controls='false'></el-input-number>
                                    </el-col>
                                    <el-col :span="1"><div class="set-suffix">&nbsp;&nbsp;%</div></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">
                                        <el-input size="medium" v-model="query.levelDName" placeholder="等级"></el-input>
                                    </el-col>
                                    <el-col :span="2"><div class="set-suffix">&nbsp; &gt;=&nbsp;</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input-number size="medium" v-model="query.levelDVal" :min="parseInt (query.levelEVal)+1" :debounce="1000" :max="query.levelCVal-1" :controls='false'></el-input-number>
                                    </el-col>
                                    <el-col :span="1"><div class="set-suffix">&nbsp;&nbsp;%</div></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="3">
                                        <el-input size="medium" v-model="query.levelEName" placeholder="等级"></el-input>
                                    </el-col>
                                    <el-col :span="2"><div class="set-suffix">&nbsp; &gt;=&nbsp;</div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input-number size="medium" v-model="query.levelEVal" :min="0" :max="query.levelDVal-1" :controls='false' disabled></el-input-number>
                                    </el-col>
                                    <el-col :span="1"><div class="set-suffix">&nbsp;&nbsp;%</div></el-col>
                                </el-row>
                                <br/>
                                <el-row>
                                    <el-col :span="3">
                                        匹配年级:
                                    </el-col>
                                    <el-col :span="18">
                                        <el-select v-model="selectclassValue" placeholder="请选择" @change="classChangeValue">
                                            <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <br/>
                                <el-row>
                                    <el-col :span="3">
                                        匹配学科:
                                    </el-col>
                                    <el-col :span="18">
                                        <el-select v-model="selectSubject" multiple placeholder="请选择">
                                            <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <br/>
                                <el-row>
                                    <el-col :span="4">
                                        对家长展示排名:
                                    </el-col>
                                    <el-col :span="2">
                                        <el-tooltip :content="query.parentDisplayRank?'显示排名':'不显示排名'" placement="top">
                                            <el-switch v-model="query.parentDisplayRank" on-text="" off-text="">
                                            </el-switch>
                                        </el-tooltip>
                                    </el-col>
                                     <el-col :span="4">
                                        对家长展示均分:
                                    </el-col>
                                    <el-col :span="2">
                                        <el-tooltip :content="query.parentDisplayAvg?'展示均分':'不展示均分'" placement="top">
                                            <el-switch v-model="query.parentDisplayAvg" on-text="" off-text="">
                                            </el-switch>
                                        </el-tooltip>
                                    </el-col>

                                </el-row>
                            </div>
                        </div>
                    </div>
                    <div style="clear: both; "></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save_set">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Backtool from '@/components/BackTool';
import { examSetList, deleteExamSet, insertExamSet,examSetDetails,editExamSet } from '@/api/systemSet/exam';
import { querySchoolGrade, queryCourseByGradeId } from '@/api/system';
import {getDropDownList} from '@/utils/utils';
import mixin from '@/mixins/windowResize';
const parentDisplayRank = { OK: 1, NO: 0 };
const parentDisplayAvg = { OK: 1, NO: 0 };
export default {
    components: {
        Backtool
    },
    data() {
        return {
            list: null,
            dialogVisible: false,
            query: {
                id:'',
                levelAName: '优',
                levelAVal: '90',
                levelBName: '良',
                levelBVal: '80',
                levelCName: '中',
                levelCVal: '70',
                levelDName: '及格',
                levelDVal: '60',
                levelEName: '差',
                levelEVal: '0',
                parentDisplayRank: false,
                parentDisplayAvg:false,
                gradeId: '',
                gradeName: '',
                currJson: '',
                editGradeIdId:''//编辑状态下班级id，用于表示不刷新

            },
            selectclassValue: '',
            classList: [],
            subjectList: [],
            selectSubject: [],
            saveState:'add'
        }
    },
    created() {
        this.getlist();
        querySchoolGrade().then(res => {
            this.classList = getDropDownList(res.data.data, { label: "name", value: "id" });
            this.selectclassValue = this.classList.length > 0 ? this.classList[0].value : '';
            this.getSubjectList(this.selectclassValue);
        }).catch();
    },
    mixins: [mixin],
    methods: {
        addExamSet(){
            this.dialogVisible=true;
            this.saveState='add';
            this.setDefualtForm();
        },
        deleteExamSet(id) {
            this.$confirm('此操作将永久删除此消息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteExamSet(id).then(res => {
                    this.getlist();
                }).catch();

            }).catch(() => {
            });
        },
        getlist() {
            examSetList().then(res => {
                this.list = res.data.data;
            }).catch();
        },
        getSubjectList(id) {
            queryCourseByGradeId(id).then(res => {
                this.subjectList = getDropDownList(res.data.data, { label: "name", value: "id" });
                
            }).catch();
        },
        classChangeValue(val) {
            if(this.editGradeIdId!=val){
                this.selectSubject=[];
                this.getSubjectList(val);
            }
        },
        save_set() {
            if(this.selectSubject.length==0){
                 this.$message.error('请选择匹配学科！');
                return;
            }
            this.query.parentDisplayRank = this.query.parentDisplayRank ? parentDisplayRank.OK : parentDisplayRank.NO;
            this.query.parentDisplayAvg = this.query.parentDisplayAvg ? parentDisplayAvg.OK : parentDisplayAvg.NO;
            this.query.gradeId = this.selectclassValue;
            this.query.gradeName = this.classList.find(item => item.value === this.query.gradeId).label;
            let currArry = new Array();
            let _this = this;
            this.selectSubject.forEach(function (item) {
                let name = _this.subjectList.find(subitem => subitem.value === item).label;
                currArry.push({ currId: item, currName: name });
            });
            this.query.currJson = JSON.stringify(currArry);
            if(this.saveState=='add'){
                insertExamSet(this.query).then(res => {
                       this.getlist();
                       this.dialogVisible = false;
                       this.setDefualtForm();
                 }).catch(err => {
                       this.dialogVisible = false;
                });
            }else{
                editExamSet(this.query).then(res=>{
                     this.getlist();
                     this.dialogVisible = false;
                     this.setDefualtForm();
                }).catch(err=>{
                       this.dialogVisible = false;
                });
            }
           
        },
        setDefualtForm() {
            this.query.levelAName = '优';
            this.query.levelAVal = '90';
            this.query.levelBName = '良';
            this.query.levelBVal = '80';
            this.query.levelCName = '中';
            this.query.levelCVal = '70';
            this.query.levelDName = '及格';
            this.query.levelDVal = '60';
            this.query.levelEName = '差';
            this.query.levelEVal = '0';
            this.query.parentDisplayRank=false;
            this.query.parentDisplayAvg=false;
            this.selectclassValue = this.classList.length > 0 ? this.classList[0].value : '';
            this.getSubjectList(this.selectclassValue);
            this.selectSubject=[];
        },
        editExamSet(id){
            this.dialogVisible = true;
            this.saveState='edit';
            examSetDetails(id).then(res=>{
                let data=res.data.data;
                this.query.id=data.id;
                this.query.levelAName =data.levelAName;
                this.query.levelAVal = data.levelAVal;
                this.query.levelBName = data.levelBName;
                this.query.levelBVal = data.levelBVal;
                this.query.levelCName = data.levelCName;
                this.query.levelCVal = data.levelCVal;
                this.query.levelDName = data.levelDName;
                this.query.levelDVal = data.levelDVal;
                this.query.levelEName = data.levelEName;
                this.query.levelEVal = data.levelEVal;
                this.query.parentDisplayRank=data.parentDisplayRank==parentDisplayRank.OK?true:false;
                this.query.parentDisplayAvg=data.parentDisplayAvg==parentDisplayAvg.OK?true:false;
                this.selectclassValue=data.gradeId;
                this.getSubjectList(this.selectclassValue);
                this.editGradeIdId=data.gradeId;
                this.selectSubject=[];
                let _this=this;
                data.classSetList.forEach(function(item){
                    _this.selectSubject.push(item.currId);
                 });

            }).catch();
        }
    }
}
</script>
<style scoped>
.rule-item {
    width: 300px;
    min-height: 250px;
    max-height: 350px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    float: left;
    margin-right: 10px;
    margin-top: 10px;
    color: #3C3C3C;
}
.order-setter-list{
    line-height: 30px;
}

.rule-item .rule-title {
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    background-color: #D3DCE6;
    color: #5e6d82;
}

.rule-item .rule-title-des {
    padding-left: 20px;
    width: 240px;
    float: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.rule-item .tools {
    width: 50px;
    float: right;
}

.rule-item .tools span {
    cursor: pointer;
    margin-left: 4px;
}

.rule-item .tools span {
    cursor: pointer;
    font-size: 14px;
}

.rule-item .tool-edit {
    color: #20A0FF;
}

.rule-item .tool-del {
    color: #FF4949;
}

.rule-item .option-list {
    margin-bottom: 20px;
    padding-left: 20px;
}

.rule-item .option-item {
    font-size: 16px;
}

.rule-item .option-list {
    padding: 10px 20px;
}

.rule-item .mate-info {
    padding: 0 10px;
    margin-bottom: 10px;
}

.rule-item .mate-info-des {
    font-weight: bold;
}

.tag-item {
    margin-left: 4px;
    margin-bottom: 4px;
    height: 24px;
    display: block;
    float: left;
}

.parentDisplayRank-flag-sucess {
    color: #13CE66;
    margin: 0 4px 0 6px;
    font-size: 16px;
}

.mate-info-order-type {
    font-size: 14px;
}

.parentDisplayRank-flag-warn {
    color: #F7BA2A;
    margin: 0 4px 0 6px;
    font-size: 16px;
}

.el-input-number {
    width: 80px !important;
}
.set-suffix{
    height: 40px;
    line-height: 40px;
}
</style>
