<template>
    <div class="classScheduleCardindex"  v-loading.body="listLoading">
       <div class="header" v-if="isShowByPermission('/classSchedule/allClassSchedule')">
            <el-button type="primary" size="medium" @click="classScheduleCardadd()">新增</el-button> 
            <el-button type="primary" size="medium" @click="copyTermClassSchedules()" v-if="isshow==2">复制上学期课表</el-button>  
            <el-button type="primary" size="medium" @click="dialogGroupfun()" >生成周课表</el-button>  
            <!-- <el-button type="primary" size="medium" @click="classScheduleCardwholeone()">全部课程表</el-button> -->
            <el-button type="primary" size="medium" @click="classScheduleCardsetup()">模板设置</el-button> 
            <el-button type="primary" size="medium" @click="refreshClassScheduleCurr()" v-if="datalist.length">更新课程信息</el-button>
            <a href=" https://cdnfile-10043692.file.myqcloud.com/admin/images/xls/%E8%AF%BE%E7%A8%8B%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls" download="下载模板" target="_blank">
              <el-button size="medium" class="filter-item" type="primary" icon="upload">下载模板</el-button>
            </a>   
            <el-upload class="upload-import" name='file' accept=".xls" :action="uploadPath" :data="uploadData" :show-file-list='false'  :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-button type="primary"  size="medium">导入模板</el-button>
            </el-upload> 
             <el-upload class="upload-import" name='file' accept=".xls" :action="newuploadPath" :data="newuploadData" :show-file-list='false'  :before-upload="newbeforeAvatarUpload" :on-success="newhandleAvatarSuccess">
                <el-button type="primary"  size="medium">导入周课表</el-button>
            </el-upload> 
            
           
       </div>  
       <el-dialog title="生成周课表" :visible.sync="dialogGroup">
         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="myweekList" @change="handleCheckedCitiesChange">
            <el-checkbox :label="item" v-for="(item,index) in weekList" :key="index" >
               第 {{item}} 周
               <span style="color:red" v-if="myweeknum==item">
                 （当前周）
               </span>
            </el-checkbox>
        </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGroup=false">取 消</el-button>
          <el-button type="primary" @click="copyClassScheduleCurrWeek()">保 存</el-button>
      </div>
    </el-dialog>
        <div class="box-body" :style="`height: ${nobottommaxH}px;`" v-if="isShowByPermission('/classSchedule/allClassSchedule')">
            <div class="listbox" :key="gradeIndex" v-for="(grade,gradeIndex) in datalist">
                 <div class="box-top">{{grade.name}}</div>
                 <div class="box-ul">
                         <div :key="index"  v-for="(item,index) in grade.list"  class="box-li contentInfo" @click="classScheduleCardwholeonedetails(item.id)">
                              <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class.png" alt="">
                              {{item.departName}}
                        </div>
                 </div>
            </div>
              <default-page Mes="暂无课程表" v-if="ishide"></default-page>
        </div>
        <div class="box-body" :style="`height: ${notbmaxH}px;`" v-else>
            <div class="listbox" :key="gradeIndex" v-for="(grade,gradeIndex) in datalist" >
                 <div class="box-top">{{grade.name}}</div>
                 <div class="box-ul">
                         <div :key="index"  v-for="(item,index) in grade.list"  class="box-li contentInfo"  @click="classScheduleCardwholeonedetails(item.id)">
                              <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class.png" alt="">
                              {{item.departName}}
                        </div>
                 </div>
            </div>
              <default-page Mes="暂无课程表" v-if="ishide"></default-page>
        </div>
        
    </div>
</template>
<script>
import {
  copyTermClassSchedule,refreshClassScheduleCurr,schoolClassSchedule,copyClassScheduleCurrWeek,getSchoolTimeAllList,getSeveralWeekListBySchoolTImeId
} from "@/api/classScheduleCard";
import mixin from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import { isShowByPermission } from "@/utils";
import DefaultPage from "@/components/DefaultPage";
import {getCurrentSchoolTimeBySchoolId} from '@/api/classCircle';
export default {
  data() {
    return {
      listLoading: false,
      datalist: [],
      uploadPath:
      global.BasePath + "structure/classSchedule/uploadScheduleCurr",
      uploadData: {
        token: this.$store.getters.token
      },
      newuploadPath:global.BasePath + "structure/classSchedule/uploadClassScheduleWeek",
      uploadData: {
        token: this.$store.getters.token
      },
      newuploadData: {
        token: this.$store.getters.token
      },
      ishide:false,
      isshow:1,
      weekList:[],
      dialogGroup:false,
      myweekList:[],
      checkAll: false,
      isIndeterminate: true,
      myweeknum:-1
    };
  },
  created() {
     getSchoolTimeAllList().then(res => {
                    res.data.data.forEach((item) => {
                        if (item.isCurrent === 1) {
                              this.weekList=[]
                             getSeveralWeekListBySchoolTImeId(item.id).then((res) => {
                              const data = res.data.data;
                              if (res.data.code === 200) {
                                for(let i=0;i<data.length;i++){
                                  if(data[i].nowWeek){
                                    this.myweeknum=data[i].week
                                  }
                                   this.weekList.push(data[i].week)
                                }                                  
                              }
                          }).catch(() => {
                          });
                        }
                    });
                }).catch();
    this.teacherClassSchedules();
    getCurrentSchoolTimeBySchoolId().then(res => {
                    this.isshow = res.data.data.term;
                })
  },
  mixins: [mixin],
  components: { DefaultPage},
  methods: {
       handleCheckAllChange(val) {
        let cityOptions=[]
        for(let i=0;i<this.weekList.length;i++){
            cityOptions.push(this.weekList[i])
        }
        this.myweekList = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
       handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.weekList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekList.length;
      },
     dialogGroupfun(){
          this.dialogGroup=true;
          this.myweekList=[]
      },
    isShowByPermission,
    //获取班级列表
    teacherClassSchedules() {
      schoolClassSchedule().then(res => {
        let data = res.data.data;
        this.datalist = [];
        for (let key in data) {
          this.datalist.push({
            name: JSON.parse(key).name,
            list: data[key]
          });
        }
        if(this.datalist.length==0){
          this.ishide=true;
        }else{
          this.ishide=false;
        }
      });
    },
    copyClassScheduleCurrWeek() {
       if(this.myweekList.length==0){
               this.$message.error('请选择要刷新的周次');
               return
           }
      // this.$confirm("确认要生成周课表吗？", "生成周课表", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   lockScroll: false
      // })
      //   .then(() => {
          copyClassScheduleCurrWeek(
            {classId:0,weekList:this.myweekList}
          ).then(res => {
            if (res.data.code === 200) {
              this.dialogGroup=false
              this.$message.success("生成周课表成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        // })
        // .catch(() => {});
    },
    //复制
    copyTermClassSchedules() {
      this.$confirm("确认要复制上学期课表吗？", "复制上学期课表", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          copyTermClassSchedule().then(res => {
            if (res.data.code === 200) {
              this.$message.success("复制上学期课表成功");
              this.teacherClassSchedules();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //复制
    refreshClassScheduleCurr() {
      this.$confirm("确认要更新课程信息吗？课程表内课程将同步系统内课程名称", "更新课程信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          refreshClassScheduleCurr().then(res => {
            if (res.data.code === 200) {
              this.$message.success("更新课程信息成功");
              this.teacherClassSchedules();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //导入
    handleAvatarSuccess(res) {
      if (res.result) {
          this.$message({
            message: "模版导入成功！",
            type: "success"
          });
          this.listLoading = false;       
      } else {
        this.$message.error(res.msg);
        this.listLoading = false;
      }
       this.teacherClassSchedules();
    },
    beforeAvatarUpload(file) {
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix !== "xls") {
        this.$message.error("请上传后缀为.xls的模版文件!");
        return false;
      } else {
        this.listLoading = true;
      }
    },
    //导入
    newhandleAvatarSuccess(res) {
      if (res.result) {
          this.$message({
            message: "模版导入成功！",
            type: "success"
          });
          this.listLoading = false;       
      } else {
        this.$message.error(res.msg);
        this.listLoading = false;
      }
       this.teacherClassSchedules();
    },
    newbeforeAvatarUpload(file) {
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix !== "xls") {
        this.$message.error("请上传后缀为.xls的模版文件!");
        return false;
      } else {
        this.listLoading = true;
      }
    },
    //跳转详情
    classScheduleCardwholeonedetails(id){
      if(this.isShowByPermission('/classSchedule/allClassSchedule')){
        this.$router.push({
          path: "classScheduleCardwholeonedetails",
          query: { id: id}
        });
      }else{
       this.$router.push({
        path: "classScheduleCardwholedetails",
        query: { id: id}
       });
      }
      
    },
    //设置
    classScheduleCardsetup(){
        this.$router.push({
        path: "classScheduleCardsetup"
      });
    },
    //新增
    classScheduleCardadd(){
        this.$router.push({
        path: "classScheduleCardadd"
      });
    },
    //全部
    classScheduleCardwholeone(){
        this.$router.push({
        path: "classScheduleCardwholeone"
      });
    },
  }
};
</script>
<style scoped="scoped">
.classScheduleCardindex {
  padding:12px;
}
.upload-import{
    display: inline-block;
}
.header {
  padding-bottom: 10px;
  border-bottom: 1px solid #e7eaec;
}
.box-body {
  overflow: auto;
  padding-top: 30px;
}
.contentInfo {
  color: #303133;
}
.box-ul {
  overflow: auto;
}
.box-top {
  line-height: 20px;
  font-size: 16px;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}
.box-li {
  width: 120px;
  text-align: center;
  margin: 10px 20px;
  cursor: pointer;
  float: left;
  height: 150px;
  font-size: 14px;
  line-height: 24px;
}
.box-li img {
  width: 100px;
  margin: 0 10px;
}
</style>
