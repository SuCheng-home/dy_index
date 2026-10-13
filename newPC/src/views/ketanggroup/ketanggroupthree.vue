<template>
    <div class="ketanggroupone">
          <div class="top">
            <term-grade-class-selector :queryArgs="queryArgs"   @input="getClassroomInitGroupListByTh()" ref="selector" v-model="obj" ></term-grade-class-selector>
             <el-select size="medium" v-model="query.groupId" placeholder="请选择小组" @change="getSchoolBehaviorGroupDateListStatic()">
                 <el-option label="全部小组" :value="0"></el-option>
                 <el-option v-for="item in nodeNumberlist" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <!-- <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `小组积分按天.xlsx`)"   v-if="dataList.length>0">导出</el-button> -->
        </div> 
        <div  id="outTable" >
          <el-table stripe :data="dataList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="分组名称" align="center">
                           <template slot-scope="scope">
                             {{scope.row.groupName}}
                          </template>
                        </el-table-column>  
                        <el-table-column label="日期" align="center">
                           <template slot-scope="scope">
                               {{scope.row.behDate}}
                          </template>
                        </el-table-column>  
                          <el-table-column label="事由" align="center">
                           <template slot-scope="scope">
                              总分第{{scope.row.rank}}名次
                          </template>
                        </el-table-column>
                         <el-table-column label="积分" align="center">
                           <template slot-scope="scope">
                             {{scope.row.score}}
                          </template>
                        </el-table-column>
      </el-table> 
      </div>
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {mapGetters} from 'vuex';
    import {getSchoolBehaviorGroupDateListStatic,listTimeByWeekDayByDate,getClassroomInitGroupListByTh} from "@/api/ketanggroupone";
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";   
    export default {
        components: { TermGradeClassSelector },
        data() {
            return {
                query: {
                    classId:"",//	班级id	number
                    behGroupType:1,
                    groupId:0,
                    endDate:'',
                    startDate:'',
                    schoolTimeId:0,
                },
                queryArgs: {
                    all: true, //所有班级年级
                    manager: false, //班主任
                    notlimit: true, //所有班级年级
                    submanager: false, //副班主任
                    teacher: false //普通所交
                },
                obj: {
                    termId: "",
                    duration: ["", ""],
                    gradeId: "",
                    classId: ""
                },
                dataList:[],
                isshow:false,
                nodeNumberlist:[]
            };
        },
        mixins: [windowResize,baseMixin],
        computed:{
            ...mapGetters(['userInfo'])
        },
        mounted() {
          
        },
        methods: {
            listTimeByWeekDayByDate(){
                this.query.nodeNumber=0
                this.query.behDate=this.$moment(this.query.behDate).format("YYYY-MM-DD")
                this.getSchoolBehaviorGroupDateListStatic()
                listTimeByWeekDayByDate({
                    isBeh:2,
                    customize:10,
                    secrchDate:this.query.behDate
                }).then((res) => res.data).then((data) => { 
                    this.nodeNumberlist=data.data
                });
            },            
            getSchoolBehaviorGroupDateListStatic(){
                this.isshow=true;
                this.query.classId=this.obj.classId;
                this.query.schoolTimeId=this.obj.termId;
                this.dataList=[]
                if(!this.query.classId){
                    return;
                }
                 this.query.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
        this.query.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间
                getSchoolBehaviorGroupDateListStatic(this.query).then(res => {
                    let data = res.data.data;
                    this.dataList=data;
                    

                });
            },
            getClassroomInitGroupListByTh(){
                this.query.classId=this.obj.classId;
                 this.dataList=[]
                 this.query.groupId=0
                  this.nodeNumberlist=[]
                if(!this.query.classId){
                    return;
                }
                this.query.groupId=0
                 getClassroomInitGroupListByTh(this.query.classId).then(res => {
                    let data = res.data.data;
                    this.nodeNumberlist=data;
                    this.getSchoolBehaviorGroupDateListStatic()

                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .ketanggroupone{
        padding: 10px;
        .top {
            padding-bottom: 10px;
        }
    }
</style>
