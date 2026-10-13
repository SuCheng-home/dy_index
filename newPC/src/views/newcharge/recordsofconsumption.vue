<template>
<div class="recordsofconsumption"  >
     <div class="top"> 
         <el-select size="medium" v-model="userType" placeholder="请选择类型" @change="listUserByTypes()">
                <el-option label="学生" :value="2"></el-option>
                <el-option label="老师" :value="1"></el-option>
            </el-select>
           <el-select size="medium" v-if="userType==2" v-model="gradeId" placeholder="请选择年级" @change="queryClassByGradeIds()">
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select size="medium"  v-if="userType==2" v-model="classId" placeholder="请选择班级" @change="listUserByTypes()">
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select> 
            <el-button type="primary"  size="medium" @click="syncConsumeListBySchoolIdpop=true">同步全校</el-button>
            <el-input class="search-input" style="width:20%;    float: right;"  placeholder="老师或学生姓名" icon="search" size="medium" @keyup.enter.native="listUserByTypes()" v-model.trim="username">
                <el-button slot="append" icon="el-icon-search" @click="listUserByTypes()"></el-button>
            </el-input>    
      </div>
        <el-dialog title="同步全校" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="syncConsumeListBySchoolIdpop" width="480px" :lock-scroll="false" :modal-append-to-body='false'>
		    同步时间&nbsp;&nbsp;<el-date-picker :editable="false" size="medium"  v-model.trim="bigdate" type="date" :clearable="false" placeholder="请选择同步" format="yyyy-MM-dd" />
			<span slot="footer" class="dialog-footer">
				<el-button  @click="syncConsumeListBySchoolIdpop=false">取 消</el-button>
				<el-button type="primary" @click="syncConsumeListBySchoolIds()">确 定</el-button>
			</span>
		</el-dialog> 
     <div class="subject" :style="`height: ${nobottommaxH-25}px;`">
         <div class="left">
             <default-page Mes="暂无数据" v-if="!leftlist.length"></default-page>
              <div class="li"  :class="{'color' :item.id==pagination.userId}" @click="switchfun(item.id)" v-for="(item,index) in leftlist" :key="index">{{item.name}}</div>   
         </div>  
         <div class="right">     
             <div class="righttop">
                 更新时间：{{consumeTime?consumeTime:"----"}}<el-button type="primary" v-if="pagination.userId" @click="syncConsumeListByUserIdAndDatepop=true" style="float: right;" size="small">同步</el-button></div> 
                 
             <div class="ul" :style="`height: ${nobottommaxH-110}px;`">
                 <div class="li" v-for="(item,index) in rightlist" :key="index">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/qian.png" alt="">
                            <div class="name">{{item.consumeTime.split('.')[0]}}</div>
                            <div class="time"> <span>余额:￥{{item.accBal/100}}</span></div>
                            <div class="num">{{0-(item.amount/100)}}</div>
                 </div>
                 <default-page Mes="暂无消费记录" v-if="!rightlist.length"></default-page>
             </div>       
            <el-pagination @size-change="listConsumeMoneyRecords" @current-change="listConsumeMoneyRecords"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
            </el-pagination>
        </div>      
     </div>
      <el-dialog title="同步时间请选择一周内" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="syncConsumeListByUserIdAndDatepop" width="480px" :lock-scroll="false" :modal-append-to-body='false'>
		    同步时间&nbsp;&nbsp;
            <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false" :editable="false"  :picker-options="pickerOptions"
                >
                </el-date-picker>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="syncConsumeListByUserIdAndDatepop=false">取 消</el-button>
				<el-button type="primary" @click="syncConsumeListByUserIdAndDates()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import {getCardBySid,listConsumeMoneyRecord,listUserByType,syncConsumeListByUserIdAndDate,syncConsumeListBySchoolId,querySchoolGrade,queryClassByGradeId} from "@/api/recordsofconsumption";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
           gradeId: '',
           gradeList: [],
           classId: '',
           classList: [],
           leftlist:[],
           rightlist:[],
           userType:2,
           username:"",
           userId:"",
           pagination: {
                pageNo: 1,
                pageSize: 20,
                total: null,
                userId: "",
            },
           consumeTime:"",
           bigdate:new Date(),
           syncConsumeListBySchoolIdpop:false,
           syncConsumeListByUserIdAndDatepop:false,
           daterange: [new Date(), new Date()],
            pickerOptions: {
          shortcuts: [{
            text: '同步今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '同步一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }
          // , {
          //   text: '同步一个月',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          //     picker.$emit('pick', [start, end]);
          //   }
          // },
          ],
          onPick: ({maxDate, minDate}) => {
        this.daterange= minDate.getTime();
        if (maxDate) {
          this.daterange= [new Date(), new Date()]
        }
        }, disabledDate: (time) => {
          if (this.daterange!== '') {
            const one = 7 * 24 * 3600 * 1000;
            const minTime = this.daterange- one;
            const maxTime = this.daterange+ one;
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
        },
        choiceDate:""
    };
  },
  mixins: [mixin],
  components: { DefaultPage },
  created() {
        querySchoolGrade().then(res => res.data).then(data => {
                this.gradeList = data.data;
                if (data.data.length !== 0) {
                    this.gradeId = data.data[0].id;
                    this.queryClassByGradeIds();
                }
            });
  },
  methods: {
      syncConsumeListByUserIdAndDates(){
           syncConsumeListByUserIdAndDate({userId:this.pagination.userId,startDate:this.$moment(this.daterange[0]).format( "YYYY-MM-DD"),endDate:this.$moment(this.daterange[1]).format( "YYYY-MM-DD")})
            .then(res => res.data)
            .then(data => {
                
                 if (data.code == 200) {
                      this.$message({
              type: "success",
              message: "同步成功，请您稍后查看！"
            });
            this.syncConsumeListByUserIdAndDatepop=false;
              } else {
                   this.$message({
                    type: "error",
                    message:data.msg
                  });
              }
            });
      },
      syncConsumeListBySchoolIds(){
          syncConsumeListBySchoolId(this.$moment(this.bigdate).format( "YYYY-MM-DD"))
            .then(res => res.data)
            .then(data => {
                 if (data.code == 200) {
                      this.$message({
              type: "success",
              message: "同步成功，请您稍后查看！"
            });
            this.syncConsumeListBySchoolIdpop=false;
              } else {
                   this.$message({
                    type: "error",
                    message:data.msg
                  });
              }
            });
      },
       getCardBySids(){
      getCardBySid(this.pagination.userId)
            .then(res => res.data)
            .then(data => {
             let mydata=data.data;
             this.consumeTime=mydata.consumeTime.split('.')[0];
            });
    },
       //获取班级
            queryClassByGradeIds() {
                queryClassByGradeId(this.gradeId).then(res => res.data).then(data => {
                    this.classList = data.data;
                    if (data.data.length !== 0) {
                        this.classId = data.data[0].id;
                        this.listUserByTypes();
                    }
                });
            },
        //获取学生或者老师
        listUserByTypes(){
            this.userId="";
            this.rightlist=[];
            this.pagination.total=0;
             listUserByType({
                 classId:this.classId, userType:this.userType, username:this.username,
             }).then(res => res.data).then(data => {
                this.leftlist = data.data;
                if(this.leftlist.length){
                    this.pagination.userId= this.leftlist[0].id;
                    this.listConsumeMoneyRecords();
                }else{
                  this.pagination.userId=""
                }

        });
        },
        //获取消费记录
        listConsumeMoneyRecords(){
            listConsumeMoneyRecord(this.pagination).then(res => res.data).then(data => {
                this.pagination.total = data.data.pagination.total;
                this.rightlist = data.data.dataList;
            });
            this.getCardBySids()
        },
        //切换人
        switchfun(id){
          this.pagination.userId=id;
          this.pagination.pageNo = 1;
          this.listConsumeMoneyRecords();
        }
  }
};
</script>
<style lang="scss" scoped>
.recordsofconsumption {
  padding:12px;
  *{
      box-sizing:border-box;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    width: 810px;
    border:1px #EBEEF5 solid;
    margin: 20px auto;
  }
  .left{
      width:40%;
      height:100%;
      overflow: auto;
      border-right:1px #EBEEF5 solid;
      background-color: #ecf5ff;
      float:left;
      .li{
          width:22%;
          margin: 8px 1.5%;
          border:1px #EBEEF5 solid;   
          color:#409EFF;
          background-color: #fff; 
          cursor:pointer;
          font-size:12px;
          border-radius: 8px;
          text-align: center;
          line-height: 30px;
          float: left;  
          overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
      }
      .color{
           color:#fff;
           background-color: #409EFF; 
           border-color: #409EFF; 
      }
  }
  .right{
     width:60%;
     float:left;
     height:100%;
     .righttop{
         line-height: 32px;
         padding: 8px 20px;
         font-size: 16px;
          color:#303133;
           border-bottom:1px #EBEEF5 solid;
     }
     .el-pagination{
         float: right;
     }
     .ul{
         overflow: auto;
         padding-left: 30px;
         .li{
          padding: 10px 10px 0 40px;          
          position: relative;
          img{
              width: 34px;
              position: absolute;
              top:10px;
              left: 0;
          }
          .name{
              font-size: 14px;
              color:#303133;
              line-height: 32px;
          }
          .time{
              padding-bottom: 5px;
              line-height: 24px;
              font-size: 13px;
              color:#909399;
              border-bottom: 1px #eee solid;
              overflow: hidden;
              span{
                 color:#303133;
              }
          }
          .noborder{
               border-bottom: none;
          }
          .num{
                position: absolute;
                top: 20px;
                right: 15px;
                font-size: 18px;
                color: #303133;
                font-weight: 600;
            }
      }
     }
  }
}
</style>