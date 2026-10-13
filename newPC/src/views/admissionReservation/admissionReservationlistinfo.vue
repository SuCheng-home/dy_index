<template>
    <div class="admissionReservationlistinfo">  
        <div class="top">  
                <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
                 <el-select v-model="isMorning" size="medium" @change="handleInputChange()" placeholder="请选择类型">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="上午" :value="1"></el-option>
                        <el-option label="下午" :value="2"></el-option>
                    </el-select>
                <!-- 前端导出 -->
                <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `预约明细.xlsx`)"   v-if="datalist.length>0">导出</el-button>
                 {{watchDate}}  预约明细
        </div>
         <div  id="outTable" >
            <el-table :data="datalist" border style="width: 100%" ref="print">
                  <el-table-column align="center"  label="预约人">
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                 </el-table-column>
                <el-table-column align="center"  label="手机号">
                    <template slot-scope="scope">
                        <span>{{scope.row.phone}}</span>
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  label="身份证号">
                    <template slot-scope="scope">
                        <span>{{scope.row.idCard}}</span>
                    </template>
                 </el-table-column>
                   <el-table-column align="center"  label="预约时段">
                    <template slot-scope="scope">
                        <span>{{scope.row.isMorning==1?"上午":"下午"}}</span>
                    </template>
                 </el-table-column>
                 <el-table-column align="center"  label="预约时间"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime.slice(0,19)}}</span>
                    </template>
                 </el-table-column>
                 <el-table-column align="center"  label="状态" width="100">
                <template slot-scope="scope">                    
                     <el-tag  size="mini"  v-if="scope.row.status==2">已入校</el-tag>
                    <el-tag  size="mini"  type="info" v-if="scope.row.status==1">未入校</el-tag>                    
                </template>
            </el-table-column>
                 <el-table-column align="center"  label="入校时间"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.intSchTime?scope.row.intSchTime.slice(0,19):''}}</span>
                    </template>
                 </el-table-column>
             </el-table>            
        </div> 
      
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {getSocialReserRecordList} from '@/api/admissionReservation';
    export default {
        data() {
            return {
               datalist:[],
               newdatalist:[],
               name:'',
               isMorning:0,
               watchDate:this.$route.query.watchDate
            }
        },
        mixins: [windowResize,baseMixin],       
        created() {
            this.getSocialReserRecordList()
        },
        methods: {
             //前端搜索
             handleInputChange(){
                let list=[];
                if(this.isMorning==0){
                    this.datalist=this.newdatalist;
                }else{
                     for(let i=0;i<this.newdatalist.length;i++){
                    if(this.isMorning==this.newdatalist[i].isMorning){
                          list.push(this.newdatalist[i])
                    };
                };
                this.datalist=list;

                }
               

                },
              //获取详情
             getSocialReserRecordList(){
                  getSocialReserRecordList(this.$route.query.watchDate).then(res => {
                    if (res.data.code === 200) {
                        this.datalist=res.data.data;
                        this.newdatalist=  res.data.data;             
                    }; 
                }).catch(err => {});
             },          
        },
    }
</script>
<style lang="scss" scoped>
   .admissionReservationlistinfo{
       padding: 12px;
       .top{
           *{
               box-sizing: border-box;
            //    overflow: hidden;
           }
           padding: 0 0 10px 0;
          .button{
            margin-bottom:20px;
            width: 100%;
            margin: 10px auto;
            overflow: hidden;
            margin-top: 0;
            span{
                color: #222;
                width: 33%;
                padding: 10px 0;
                font-size: 14px;
                line-height: 16px;
                text-align: center;
                border: 1px #ddd solid;
                float: left;
                cursor: pointer;
            }
            p{
                    padding: 0;
                    margin: 0;
            }
           .left{
                border-radius: 5px 0 0 5px;
            }
            .right{
                border-radius: 0 5px 5px 0;            
            }
           .color{
                color: #fff;
                background-color: #409eff;
                border-color: #409eff;
            }            
      }
       }
       .content{
            overflow:auto;
       }     
   }   
</style>
