<template>
    <div class="eatSettingclasslist">  
        <div class="top">  
                <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
                <!-- 前端导出 -->
                <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `按班级统计.xlsx`)"   v-if="datalist.length>0">导出</el-button>
               <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入学生姓名" v-model.trim="name" @input="handleInputChange">
            <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
       </el-input>
        </div>
         <div  id="outTable" >
            <el-table :data="datalist" border style="width: 100%" ref="print">
                  <el-table-column align="center"  label="班级">
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                 </el-table-column>
                <el-table-column align="center"  label="班级人数">
                    <template slot-scope="scope">
                        <span>{{scope.row.userCount}}</span>
                    </template>
                 </el-table-column>
                  <el-table-column align="center"  label="就餐人数">
                    <template slot-scope="scope">
                        <span>{{scope.row.repastCount}}</span>
                    </template>
                 </el-table-column>
                   <el-table-column align="center"  label="不就餐人数">
                    <template slot-scope="scope">
                        <span>{{scope.row.repastNotCount}}</span>
                    </template>
                 </el-table-column>
                 <el-table-column align="center"  label="不就餐名单"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.repastNotUser}}</span>
                    </template>
                 </el-table-column>
             </el-table>            
        </div> 
      
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {queryClassListBySchoolId} from '@/api/eatSetting';
    export default {
        data() {
            return {
               datalist:[],
               newdatalist:[],
               name:''
            }
        },
        mixins: [windowResize,baseMixin],       
        created() {
            this.queryClassListBySchoolId()
        },
        methods: {
             //前端搜索
             handleInputChange(){
                let list=[];
                for(let i=0;i<this.newdatalist.length;i++){
                    if((!this.name)||(this.newdatalist[i].repastNotUser&&this.newdatalist[i].repastNotUser.indexOf(this.name) !== -1)){
                          list.push(this.newdatalist[i])
                    };
                };
                this.datalist=list;

                },
              //获取详情
             queryClassListBySchoolId(){
                  queryClassListBySchoolId().then(res => {
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
   .eatSettingclasslist{
       padding: 12px;
       .top{
           *{
               box-sizing: border-box;
               overflow: hidden;
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
