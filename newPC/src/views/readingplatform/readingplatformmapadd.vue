<template>
    <div class="readingplatformgradeadd ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="insertFoods('ruleForm')">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
               <el-form-item label="地图等级" prop="levelOrder">
                    <el-select v-model="ruleForm.levelOrder" placeholder="请选择地图等级" size="medium">
                    <el-option  :value="item.level"  :label="item.name" v-for="item in gradeList" :key="item.level"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="地图背景">
                     <img :src="ruleForm.mapLogo" class="img" alt="">
                     <el-button type="primary" size="medium" @click="dialogVisible=true">更换地图背景</el-button>
                </el-form-item>
               </el-form>
            </div>
             <el-dialog title="更换图片" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
                <div class="img-box">
                      <el-radio-group v-model="url">
                        <el-radio :label="item" v-for="(item,index) in imglist" :key="index" border>
                            <img :src="item" alt="">
                        </el-radio>
                      </el-radio-group>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="imgfun()">确 定</el-button>
                </span>
            </el-dialog> 
            
         </div>   			
        
    </div>
</template>
<script>
import {querySchoolGrade,insertReadPlatMap} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        levelOrder: "",   
        mapLogo: "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg1.png",
        mapName:'',
        status:2,
      },
      gradeList:[],
      rules: {
        levelOrder: [
          { required: true, message: "请选择地图等级", trigger: "change" }
        ]
      },
       url:"https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg1.png",
                imglist:[
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg1.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg2.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg3.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg4.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg5.png",
                    "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/mobile/images/readPlat/map_bg6.png"
                ],
      dialogVisible:false
    };
  },
  created() {
     querySchoolGrade().then(res => res.data).then(data => {
                this.gradeList = data.data;
                if (data.data.length !== 0) {
                    this.ruleForm.levelOrder = data.data[0].level;
                }
            });
  },
  mixins: [mixin],
  methods: {
       imgfun(){
           this.ruleForm.mapLogo=this.url;
         this.dialogVisible=false;
      },
    //保存
    insertFoods(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {         
              for(let i=0;i<this.gradeList.length;i++){
                  if(this.gradeList[i].level==this.ruleForm.levelOrder){
                      this.ruleForm.mapName=this.gradeList[i].name;
                  }
              }
            let $this=this;
             insertReadPlatMap(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "新增成功!"
                  });
                  $this.$router.back();
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
          };
        });
    },
    
  }
};
</script>

<style scoped>
.readingplatformgradeadd .el-radio__input{
                position: absolute;
                left: 120px;
                top: 4px;
        }
</style>
<style lang="scss" scoped>
.readingplatformgradeadd {
  padding:12px;
  * {
    box-sizing: border-box;
  }
 
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 20px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      .img{
          width: 100px;
          float: left;
              margin-right: 15px;
      }
      .el-select {
        width: 100%;
      }
    }
     .img-box{
        img{
            width: 100px;
        }
        .el-radio{
            margin: 10px;
            height: 180px;
        }
    }
  }
}
</style>
