<template>
    <div class="ketanggroupone">
          <div class="top">
            <term-grade-class-selector :isShowDuration="false" :queryArgs="queryArgs"   @input="getSchoolBehaviorGroupListStatic()" ref="selector" v-model="obj" ></term-grade-class-selector>
            <el-date-picker v-model.trim="query.behDate" type="date" :clearable="false" size="medium" placeholder="请选择日期" @change="listTimeByWeekDayByDate()"></el-date-picker>
            <el-select size="medium" v-model="query.nodeNumber" placeholder="请选择节次" @change="getSchoolBehaviorGroupListStatic()">
                 <el-option label="全部节次" :value="0"></el-option>
                 <el-option v-for="item in nodeNumberlist" :key="item.id" :label="item.alias" :value="item.nodeNumber"></el-option>
            </el-select>
            <!-- <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `积分记录按节统计.xlsx`)"   v-if="dataList.length>0">导出</el-button> -->
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
                         <el-table-column label="节次" align="center">
                           <template slot-scope="scope">
                             {{scope.row.morningName}}
                          </template>
                        </el-table-column>
                        <el-table-column label="总加分" align="center">
                           <template slot-scope="scope">
                             {{scope.row.addScore}}
                          </template>
                        </el-table-column> 
                          <el-table-column label="总扣分" align="center">
                           <template slot-scope="scope">
                             {{scope.row.lessScore}}
                          </template>
                        </el-table-column>
                        <el-table-column label="积分总计" align="center">
                           <template slot-scope="scope">
                             {{scope.row.totalScore}}
                          </template>
                        </el-table-column>
                         <el-table-column label="排名" align="center">
                           <template slot-scope="scope">
                             {{scope.row.rank}}
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
    import {getSchoolBehaviorGroupListStatic,listTimeByWeekDayByDate} from "@/api/ketanggroupone";
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";   
    export default {
        components: { TermGradeClassSelector },
        data() {
            return {
                query: {
                    classId:"",//	班级id	number
                    behGroupType:1,
                    groupId:0,
                    nodeNumber:0,
                    behDate:this.$moment().format("YYYY-MM-DD"),
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
          this.listTimeByWeekDayByDate()
        },
        methods: {
            listTimeByWeekDayByDate(){
                this.query.nodeNumber=0
                this.query.behDate=this.$moment(this.query.behDate).format("YYYY-MM-DD")
                this.getSchoolBehaviorGroupListStatic()
                listTimeByWeekDayByDate({
                    isBeh:2,
                    customize:10,
                    secrchDate:this.query.behDate
                }).then((res) => res.data).then((data) => { 
                    this.nodeNumberlist=data.data
                });
            },            
            getSchoolBehaviorGroupListStatic(){
                this.isshow=true;
                this.query.classId=this.obj.classId;
                this.query.schoolTimeId=this.obj.termId;
                this.dataList=[]
                if(!this.query.classId){
                    return;
                }
                this.query.behDate=this.$moment(this.query.behDate).format("YYYY-MM-DD")
                getSchoolBehaviorGroupListStatic(this.query).then(res => {
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
