<template>
    <div id="deyuAccountingByDimension" class="page">
        <div class="header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-select size="medium" v-model="currentTermId"  @change="schoolchange()" placeholder="请选择学期">
                <el-option
                    v-for="item in termList"
                    :key="item.id"
                    :label="item.schoolTimeName"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select size="medium" v-model="currentGradeId" placeholder="请选择年级"  @change="gradechange()">
                <el-option
                    v-for="item in gradeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select size="medium" v-model="currentClassId" placeholder="请选择班级" @change="getClassConductListFunc">
                <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select size="medium" v-model="currentDimensionId" placeholder="请选择维度" @change="getClassDimensionConductCollectPageListFunc">
                <el-option
                    v-for="item in dimensionList"
                    :key="item.id"
                    :label="item.dimensionName"
                    :value="item.id">
                </el-option>
            </el-select>
            <a :href="downLoadHref" v-if="dataList.length>0" target="_blank" download="examName"><el-button type="primary" size="medium">导出</el-button></a> 
        </div>
        <el-table border stripe :data="dataList" :height="nobottommaxH" ref="table">
            <el-table-column prop="stuName" fixed label="姓名" align="center" min-width="100">
                <template slot-scope="scope">
                    <router-link :to="{path: 'deyuAccountingPersonal', query: {studentId: scope.row.stuId, stuName: scope.row.stuName, classId: currentClassId, dimensionId: currentDimensionId, schoolTimeId: currentTermId}}">
                        {{scope.row.stuName}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="baseScore" fixed label="基础分" align="center" min-width="100"></el-table-column>
            <el-table-column v-for="(conductItem, conductIndex) in conductList" :label="conductItem" :key="conductIndex" align="center" min-width="100">
                <template slot-scope="scope">
                    <span @click="popfun(conductItem,scope.row.stuId)" v-if="(conductItem.indexOf('其他')!==-1)&&(scope.row.stuConducts[conductIndex].totalScore!='--')" style="cursor:pointer;color:#409EFF"> {{scope.row.stuConducts[conductIndex].totalScore}}</span>
                    <span v-else> {{scope.row.stuConducts[conductIndex].totalScore}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalScore" label="总分"  fixed="right" align="center" min-width="100"></el-table-column>
            <el-table-column prop="classRank" label="排名" fixed="right" align="center" min-width="100"></el-table-column>
        </el-table>
         <el-dialog title="其他评分" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="stupop" width="900px" :lock-scroll="false" :modal-append-to-body='false'>
                <el-table ref="table" stripe :data="stulist" border fit highlight-current-row style="width: 100%" >
            <el-table-column align="center" label="评价人" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span  >
                        {{scope.row.createUserName}}
                    </span>
                </template>
                </el-table-column>   
                <el-table-column align="center" label="备注" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span  >
                        {{scope.row.typeMark}}
                    </span>
                </template>
                </el-table-column>     
                <el-table-column align="center" label="得分" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span  >
                        {{scope.row.stepScore}}
                    </span>
                </template>
                </el-table-column>          
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="stupop = false">确 定</el-button>
                </span>                
     </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {
        getSchoolTimeAllList,
        getGradeListByTermId,
        getGradeClassList,
        getClassConductList,
        getClassDimensionConductCollectPageList,
        getAllDimensionConductTypeList,
        getDimensionBehTypeScoreList
    } from '@/api/deyu';
    export default {
        name: "deyuAccountingByDimension",
        data() {
            return {
                termList: [],
                currentTermId: null,
                gradeList: [],
                currentGradeId: null,
                classList: [],
                currentClassId: null,
                dataList: [],
                dimensionList: [],
                currentDimensionId: null,
                conductList: [],
                downLoadHref:'',
                 timer:null,
                 stulist:[],
                 stupop:false,
            }
        },
        mixins: [mixins, BaseMixin],
          mounted(){
            this.$nextTick(()=>{
                this.timer=setTimeout(()=> {
                this.$refs.table.doLayout()
                },300) 
            })
        },
         beforeDestroy(){
          clearTimeout(this.timer);
        },
        created() {
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    this.termList = data.data;
                    if (data.data.length !== 0) {
                        this.currentTermId = data.data.find(item => item.isCurrent === 1).id;
                        this.getGradeListByTermIds()
                    }
                });
           
        },
        methods: {
            popfun(name,id){
               getDimensionBehTypeScoreList({
                    dimensionId: this.currentDimensionId,
                    schoolTimeId: this.currentTermId,
                    studentId:id,
                    behTypeId:name=="其他（加）"?-2:-3
                })
                    .then(res => res.data)
                    .then(data => {
                        this.stulist = data.data;
                        this.stupop=true;
                        
                    })
            },
             //切换学期
            schoolchange(){
             this.getGradeListByTermIds()
            },
            //获取年级
            getGradeListByTermIds(){
                 getGradeListByTermId(this.currentTermId).then(res => res.data).then(data => {
                    this.gradeList = data.data;
                    if (data.data.length !== 0) {
                        this.currentGradeId = data.data[0].id;
                        this.getGradeClassLists();
                    }
                })
            },
            //切换年级
            gradechange(){
              this.getGradeClassLists()
            },
            //获取班级
            getGradeClassLists() {
                getGradeClassList(this.currentTermId,this.currentGradeId)
                    .then(res => res.data)
                    .then(data => {
                        const classList = data.data; 
                         if (data.data.length !== 0) {
                            this.currentClassId = data.data[0].id;
                        } else {
                            this.currentClassId = '';
                            this.currentDimensionId = '';
                            this.dataList = [];
                            this.conductList = [];
                            this.dimensionList = [];
                        }
                        this.classList = classList;
                        this.getClassConductListFunc();
                    })
            },
          
            getClassConductListFunc() {
                getClassConductList({
                    classId: this.currentClassId,
                    schoolTimeId: this.currentTermId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dimensionList = data.data;
                        if(data.data.length !== 0) {
                            this.currentDimensionId = data.data[0].id;
                            this.getClassDimensionConductCollectPageListFunc();
                        } else {
                            this.dataList = [];
                            this.conductList = [];
                            this.currentDimensionId = '';
                        }
                    })

            },
            getClassDimensionConductCollectPageListFunc() {
                let className='';
                let dimensionName='';
                for(let i=0;i<this.classList.length;i++){
                    if(this.classList[i].id==this.currentClassId){
                       className=this.classList[i].name
                    }
                };
                 for(let i=0;i<this.dimensionList.length;i++){
                    if(this.dimensionList[i].id==this.currentDimensionId){
                       dimensionName=this.dimensionList[i].dimensionName
                    }
                }
                this.downLoadHref=global.BasePath+ "structure/schoolConduct/downloadXls?classId=" + this.currentClassId +"&schoolTimeId=" +this.currentTermId +"&dimensionId=" + this.currentDimensionId + "&className=" +className+"&dimensionName=" +dimensionName+"&token=" +this.$store.getters.token;
                getClassDimensionConductCollectPageList({
                    classId: this.currentClassId,
                    dimensionId: this.currentDimensionId,
                    schoolTimeId: this.currentTermId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                         getAllDimensionConductTypeList({
                    type: 2,
                    dimensionId: this.currentDimensionId
                })
                    .then(res => res.data)
                    .then(data => {
                        for(let i=0;i<data.data.length;i++){
                            if(data.data[i].title=='其它'||data.data[i].title=='其他'){
                                if(data.data[i].id==-2){
                                    data.data[i].title='其他（加）'
                                }
                                if(data.data[i].id==-3){
                                     data.data[i].title='其他（减）'
                                }
                                
                            }
                        }
                        this.conductList = data.data.map(({title}) => title);
                         this.$nextTick(()=>{
                                    this.timer=setTimeout(()=> {
                                    this.$refs.table.doLayout()
                                    },300) 
                                })
                    })
                    });
               
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        padding:12px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .header {
        padding-bottom: 10px;
    }
    .el-select{
        width:155px;
    }
</style>
<style scoped>
    #deyuAccountingByDimension a {
        color: #20a0ff !important;
        text-decoration: none !important;
    }
</style>
