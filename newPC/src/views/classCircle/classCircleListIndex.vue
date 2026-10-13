<template>
    <div class="app-container calendar-list-container">  
        <div class="header" v-if="isShowByPermission('/classCircle/schoolClassCircleStatics')">
          <el-button type="primary" @click="classlistone()"  size="medium" >班级圈统计</el-button>     
        </div>   
        <div class="box-body" :style="`height: ${nobottommaxH}px;`">
            <div class="listbox" :key="gradeIndex" v-for="(grade,gradeIndex) in gradeList" >
                 <div class="box-top">{{grade.parentName}}</div>
                 <div class="box-ul">
                         <router-link :key="index"  v-for="(item,index) in grade.classList"  class="box-li contentInfo" :to="{path: 'classCircleDetails',query: {id:item.id,classname:item.name}}" target =' _blank'>
                              <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class.png" alt="">
                              {{item.name}}
                        </router-link>
                 </div>
            </div>
        </div>
         

                
        <!-- <el-table @select="selectionChangeHandler" @select-all="selectionChangeHandler"  :data="classList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="maxH">
            <el-table-column align="left" label="年级" width="100"><template slot-scope="scope"><span>{{scope.row.parentName}}</span></template></el-table-column>
            <el-table-column align="left" label="班级" show-overflow-tooltip>
                <template slot-scope="scope"></template>
            </el-table-column>
        </el-table> -->
    </div>
</template>
<script>
    import _ from 'lodash';
    import {getClassCircleList, getTeacherClassList} from '@/api/classCircle';
    import {queryClassGrade, queryManager, queryRoleList} from '@/api/system';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import baseMixin from "@/mixins/baseMixin";
    import { isShowByPermission } from "@/utils";
    export default {
        data() {
            return {               
                listLoading: false,
                gradeList:[],
                classList: [],
                url:`${global.LoginPath}`
            };
        },
        created() {
            this.currId = this.$store.getters.userInfo.id;
            getTeacherClassList().then(res => {
                let data = res.data;
                if (data.code === 200) {
                      let gradenamelist=[];
                     let is=true;
                    for(let i=0;i<data.data.length;i++){                       
                        is=true;
                        for(let j=0;j<gradenamelist.length;j++){
                            if(data.data[i].parentName==gradenamelist[j]){
                                is=false;
                            }
                        };
                       if(is){
                          gradenamelist.push(data.data[i].parentName)
                       };
                    };
                     for(let j=0;j<gradenamelist.length;j++){
                           let obj={parentName:gradenamelist[j],classList:[]}
                            for(let i=0;i<data.data.length;i++){ 
                               if(data.data[i].parentName==gradenamelist[j]){
                                   obj.classList.push(data.data[i])
                                 }
                            };
                            this.gradeList.push(obj);
                        };
                }
            });
        },
        mixins: [mixin,baseMixin],
        methods: {
            isShowByPermission,
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            classlistone() {      
                this.$router.push({
                    path: "classlistone"
                });
           },
        }
    }
</script>
<style scoped="scoped"> 
.header {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;   
  }   
  .box-body{
      overflow: auto;
      padding-top: 30px;
  }
    .contentInfo {
        color: #337ab7;
    }
    .box-ul{
        overflow: auto;
    }
    .box-top{
        line-height: 20px;
    font-size: 16px;
    border-left: 4px solid #409eff;
    padding-left: 10px;
    }
    .box-li{
        width: 120px;
        text-align: center;
        margin: 10px 30px;
        cursor:pointer;
        float: left;
        height: 160px;
        font-size: 14px;
    }
    .box-li img{
        width: 100px;
        margin: 0 10px;
        
    }
</style>
