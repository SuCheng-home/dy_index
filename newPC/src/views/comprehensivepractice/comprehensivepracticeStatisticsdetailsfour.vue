<template>
    <div  class="app-container calendar-list-container comprehensivepracticeindex">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                 &nbsp;&nbsp;&nbsp;
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="学生姓名" icon="el-icon-search" @keyup.enter.native="getActivityStuEvalPageListForStus()"
                              v-model="pagination.stuName">
                        <el-button slot="append" icon="el-icon-search" @click="getActivityStuEvalPageListForStus()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH-80">
            <el-table-column align="center" label="姓名" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span class="link" @click="popfun(scope.row.stuId)">
                        {{scope.row.stuName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级">
                <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="综合评分" >
                <template slot-scope="scope">
                    <span>{{scope.row.evalStarNum||"----"}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="状态" >
                <template slot-scope="scope">
                    <el-tag  size="mini" type="info"  v-if="scope.row.evalState == 0">未评分</el-tag>
                    <el-tag  size="mini" v-if="scope.row.evalState == 1">已评分</el-tag>
                </template>
            </el-table-column>
             <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                   <el-button  size="small" type="text"  @click="getStuActivityEvalInfoLists(scope.row.stuId)">评分</el-button>
               </template>
            </el-table-column> -->
        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
         <el-dialog title="评分" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="stupop" width="900px" :lock-scroll="false" :modal-append-to-body='false'>
                <el-table ref="table" stripe :data="stulist" border fit highlight-current-row style="width: 100%" >
            <el-table-column align="center" label="评价项" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span  >
                        {{scope.row.optionName}}
                    </span>
                </template>
                </el-table-column>
                <el-table-column align="center" :label="item.evalType==1?'教师':(item.evalType==2?'同伴':(item.evalType==3?'家长':'自己'))" v-for="(item,index) in optionEvalStarList"  :key="item.id">
                        <template slot-scope="scope">
                             <el-rate :disabled="item.evalType>2" v-model="scope.row.optionEvalStarList[index].evalStar"></el-rate>
                        </template>
                </el-table-column>                
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="stupop = false">取 消</el-button>
                    <el-button type="primary" @click="addActivityStuEvals()">确 定</el-button>
                </span>                
     </el-dialog>
     <el-dialog title="学生作业" :close-on-press-escape='false' :append-to-body='true' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false"  :modal-append-to-body='false'>
                    <el-tabs type="border-card" v-model="stageId" @tab-click="getStuSubmitActivityStageWorkInfos()">
                     <el-tab-pane  v-for="item in activityStageList"  :key="item.id"  :name="item.id" :label="item.stageName">
                     <el-form  ref="numberValidateForm" label-width="100px" class="demo-ruleForm" v-if="isSubmit==2">
                       <el-form-item label="学生作业">
                              {{workContent}}
                       </el-form-item>
                       <el-form-item label="学生作业图片"  v-if="workPicsJson.length">
                         <image-previewer tag="richtext">
                               <img :src="item.photoUrl" style="width:60px;height: 60px;margin-right: 10px;" alt="" :key="index" v-for="(item, index) in workPicsJson">
                         </image-previewer>                             
                       </el-form-item>
                       <el-form-item label="状态" v-if="(mystate==2||mystate==3)">
                              {{mystate==2?"通过":"不通过"}}
                       </el-form-item>
                       <el-form-item label="等第" v-if="(mystate==2)">
                             {{rankName}}
                       </el-form-item>
                       <el-form-item label="是否加精" v-if="(mystate==2)">
                            {{isFine==1?"未加精":"已加精"}}
                       </el-form-item>
                       <el-form-item label="评语" v-if="(mystate==2||mystate==3)&&evalOption">
                              {{evalOption}}
                       </el-form-item>
                     </el-form>
                     <default-page Mes="暂无作业" v-if="isSubmit==1"></default-page>
                     </el-tab-pane>
                          </el-tabs>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false">关 闭</el-button>
                    </span>
                </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import DefaultPage from "@/components/DefaultPage";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import { getActivityStuEvalPageListForStu,getStuActivityEvalInfoList,addActivityStuEval,getPracticeActivityInfoById,getStuSubmitActivityStageWorkInfo} from '@/api/comprehensivepractice';
    export default {
        name: 'comprehensivepracticeindex',
        data() {
            return {
                dataList: [],
                pagination:{
                    pageSize:20,
                    pageNo:1,
                    activityId:this.$route.query.id,
                    stuName:"",
                    teacherId:this.$route.query.teacherId,
                    total:null
                },
                stupop:false,
                stulist:[],
                optionEvalStarList:[],
                stuId:"",
                dialogVisible:false,
                activityStageList:[],
                stageId:"",
                workPicsJson: [],
                workContent:"",
                mystate:-1,
                rankName:"",
                evalOption:"",
                rank:1,
                isFine:false,
                isSubmit:""
            }
        },
        mixins: [baseMixin, mixin],
        computed: {
            ...mapGetters([ 'userInfo'])
        },
        components: { DefaultPage,ImagePreviewer},
        created() {        
            this.getActivityStuEvalPageListForStus();
            this.getPracticeActivityInfoByIds();
        },      
        methods: {   
        popfun(stuId){
            this.stuId=stuId;
            this.dialogVisible=true;
            this.getStuSubmitActivityStageWorkInfos();

       },
       getStuSubmitActivityStageWorkInfos(){
        getStuSubmitActivityStageWorkInfo(this.stageId,this.stuId).then(res => res.data).then(data => {
                                let mydata=data.data;
                                if(mydata){
                                    this.workContent=mydata.workContent;
                                    this.mystate=mydata.state;                       
                                    this.workPicsJson = mydata.workPicsJson?JSON.parse(mydata.workPicsJson):[];
                                    this.rankName=mydata.rankName;
                                    this.evalOption=mydata.evalOption;
                                    this.isFine=mydata.isFine;
                                    this.isSubmit=mydata.isSubmit;
                                }else{
                                    this.isSubmit=1;
                                }
                               
            })
       },
             getPracticeActivityInfoByIds(){
                getPracticeActivityInfoById(this.$route.query.id).then(res => res.data).then(data => {
                        let mydata=data.data;
                        this.activityStageList=mydata.activityStageList;
                        this.stageId=this.activityStageList[0].id;
                    })
                }, 
            addActivityStuEvals(){
               let list=[];
               for(let i=0;i<this.stulist.length;i++){
                   let obj={
                       id:this.stulist[i].id,
                       optionName:this.stulist[i].optionName,
                       optionEvalStarList:[]
                   }
                   for(let j=0;j<this.stulist[i].optionEvalStarList.length;j++){
                       obj.optionEvalStarList.push({
                           evalStar:this.stulist[i].optionEvalStarList[j].evalStar,
                           evalType:this.stulist[i].optionEvalStarList[j].evalType
                       })
                   }
                   list.push(obj)
               }
               addActivityStuEval(this.$route.query.id,this.stuId,list)
                    .then(res => res.data)
                    .then(data => {
                      if(data.result) {
                                        this.$message({
                                            message: '评价成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.getActivityStuEvalPageListForStus();
                                    }else{
                                         this.$message({
                                            message: data.msg,
                                            type: 'warning'
                                        });
                                    }
                                     this.stupop=false;
                    })
            },
            getStuActivityEvalInfoLists(stuId){
               this.stupop=true;
               this.stuId=stuId;
               getStuActivityEvalInfoList(this.$route.query.id,stuId)
                    .then(res => res.data)
                    .then(data => {
                      this.stulist=data.data;
                      this.optionEvalStarList=data.data[0].optionEvalStarList;
                    })
            }, 
            getActivityStuEvalPageListForStus() {
                getActivityStuEvalPageListForStu(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            sizeChangeHandler(val) {
                 this.pagination.pageNo=1;
                this.pagination.pageSize=val;
                this.getActivityStuEvalPageListForStus();
            },
            currentChangeHandler() {
                this.getActivityStuEvalPageListForStus();
            }
        }
    }
</script>

<style scoped>    
        .link {
            color: #409eff;
            cursor: pointer;
        }

</style>
