<template>
    <div class="ketanggroupone">
          <div class="top">
            <term-grade-class-selector :queryArgs="queryArgs"   @input="getSchoolBehaviorGroupStatic()" ref="selector" v-model="obj" ></term-grade-class-selector>
           <!-- <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `小组积分统计.xlsx`)"   v-if="dataList.length>0">导出</el-button> -->
        </div> 
        <div  id="outTable" >
          <el-table stripe :data="dataList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="分组名称" align="center">
                           <template slot-scope="scope">
                             {{scope.row.groupName}}
                          </template>
                        </el-table-column>  
                         <el-table-column label="小组成员" align="center">
                           <template slot-scope="scope">
                               <span v-for="(items,indexs) in scope.row.groupTeahcerStuList" :key="indexs">
                                   {{items.studentName}}&nbsp;&nbsp;
                               </span>
                          </template>
                        </el-table-column>  
                         <el-table-column label="小组积分" align="center">
                           <template slot-scope="scope">
                             {{scope.row.totalScore}}
                          </template>
                        </el-table-column>
                         <el-table-column label="操作" align="center">
                           <template slot-scope="scope">
                            <el-button size="small" type="text" @click="ketanggroupfourinfo(scope.row.groupId)">
                                        查看详情
                                    </el-button>
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
    import {getSchoolBehaviorGroupStatic} from "@/api/ketanggroupone";
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
             ketanggroupfourinfo(groupId){
                 this.query.groupId=groupId
               this.$router.push({
                    path: 'ketanggroupfourinfo',
                    query:this.query
                })
            },
            getSchoolBehaviorGroupStatic(){
                this.isshow=true;
                this.query.classId=this.obj.classId;
                this.query.schoolTimeId=this.obj.termId;
                this.dataList=[]
                if(!this.query.classId){
                    return;
                }
                 this.query.startDate = this.$moment(this.obj.duration[0]).format('YYYY-MM-DD'); //时间
                  this.query.endDate = this.$moment(this.obj.duration[1]).format('YYYY-MM-DD'); //时间
                getSchoolBehaviorGroupStatic(this.query).then(res => {
                    let data = res.data.data;
                    this.dataList=data;
                    

                });
            },
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
