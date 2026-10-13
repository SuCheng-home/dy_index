<template>
    <div class="dataPushinfo">
        <div class="top"> 
            <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>   
              <el-select size="medium" v-model="classId" placeholder="请选择班级" @change="getStuInitscoreList()">
                <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
            </el-select>
            <a :href="templateHref" target="_blank"  download="模板"><el-button  type="primary" size="medium">下载模板</el-button></a>
             <el-upload   class="upload-import" :action="uploadPath"  :data="uploadData" name="file" :show-file-list='false' accept=".csv,.xls" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-button type="primary"   size="medium">导入期初分</el-button>
            </el-upload>
            <el-button @click="initStuInitscoreList()" type="primary" v-if="initScore==0" size="medium" >设置上学期得分为期初分</el-button>                 
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH"> 
                <el-table-column align="center" label="学号"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.studentNo}}</span>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="姓名"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.studentName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="期初分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.score}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="popfun(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="delStuInitscore(scope.row.studentId)" class="buttontextred">清空</el-button>
                   </template>
                </el-table-column> 
            </el-table>
             <el-dialog title="编辑期初分" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="numpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
		   分数 &nbsp; &nbsp;<el-input-number v-model="myonbj.score" :min="0" :max="10000" label="分数"></el-input-number>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="numpop=false">取 消</el-button>
				<el-button type="primary" @click="addStuInitscore()">确 定</el-button>
			</span>
		</el-dialog> 

          <el-dialog title="导入返回信息" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
			  <div v-html="myhtml">
              
              </div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible=false">确 定</el-button>
			</span>
		</el-dialog> 
    </div>
</template>
<script>
import {getStuInitscoreList,delStuInitscore,addStuInitscore,getStuInitscore,initStuInitscoreList} from "@/api/classroomEvaluation";
import {getSchoolBehaviorInstallNew} from  '@/api/ketang';
import {queryAllClassCourse} from '@/api/task';
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      classId:'',
      classList:[],
      templateHref:'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/期初分模板.xls',
      uploadPath: global.homeworkfetch + "structure/schoolBehavior/uploadStuInitscoreExcel",
      uploadData: {
        classId: '',
        token: this.$store.getters.token
      },
      numpop:false,
      myonbj:{
          score:0
      },
      initScore:-1,
      myhtml:'',
      dialogVisible:false
    };
  },
  mixins: [baseMixin, mixin],
  created() {
      queryAllClassCourse(this.$store.getters.userInfo.id).then(res => res.data).then(data => {
          if (data.code === 200) {
             this.classList=data.data;
             this.classId=this.classList[0].classId;  
             this.getStuInitscoreList()
          }
        });
        getSchoolBehaviorInstallNew()
                .then(res => res.data)
                .then(data => {
                   if(data.data!=null){
                      this.initScore=data.data.initScore-0
                   }else{
                       this.initScore=0
                   }                  
                });
    
  },
  methods: {
      popfun(obj){
       this.myonbj=obj
       this.numpop=true;
      },
      addStuInitscore(){
          let obj={
                classId:this.myonbj.classId,//	班级id	number	
                className:this.myonbj.className,//	班级名称	string	
                classOrder:this.myonbj.classOrder,//	班级序号	number	
                gradeId:this.myonbj.gradeId,//	年级Id	number	
                gradeName:this.myonbj.gradeName,//	年级名称	string	
                gradeOrder:this.myonbj.gradeOrder,//	年级序号	number	
                score:this.myonbj.score,//	分数	number	
                studentId:this.myonbj.studentId,//	学生id	number	
                studentName:this.myonbj.studentName,//	学生姓名	string	
                studentNo:this.myonbj.studentNo,//	学号	string	 
          }
          addStuInitscore(obj).then(res => {
               this.$message({
                            type: 'success',
                            message: '编辑成功!'
                        });
						this.getStuInitscoreList();
						this.numpop=false;
					})

      },
      beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "csv" && suffix != "xls") {
                    this.$message.error("请上传模版文件!");
                }
            },
     handleAvatarSuccess(res, file) {
                if (res.result) {
                    this.myhtml=res.data?res.data:'导入成功'
                    this.dialogVisible=true;
                    // this.$alert('导入'+res.data.totalCount+'条，成功'+res.data.successCount+'条', '提示', {
                    //     confirmButtonText: '确定'
                    // });
                } else {
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
                this.getStuInitscoreList();
            },
      initStuInitscoreList(){
         this.$confirm('设置上学期得分为期初分?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    initStuInitscoreList(this.classId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        });
                        this.getStuInitscoreList();
                    }).catch();

                }).catch(() => {
                });
    },
    delStuInitscore(id){
         this.$confirm('此操作将清空期初分, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delStuInitscore(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getStuInitscoreList();
                    }).catch();

                }).catch(() => {
                });
    },
    getStuInitscoreList() {
      this.uploadData.classId=this.classId
      getStuInitscoreList(this.classId)
        .then(res => res.data)
        .then(data => {          
          this.dataList = data.data;
        });
    },
    
  }
};
</script>

<style lang="scss" scoped>
.dataPushinfo {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .upload-import {
  display: inline-block;
}
}
</style>
