<template>
    <div class="readingplatformbasicsettings ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="addAndUpdateReadPlatTaskCovers()">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
                <div class="li" @click="popfun(1)">
                    <span>任务未做图片</span>
                    <img :src="ruleForm.stateOneUrl" alt="">                    
                </div>
                <div class="li" @click="popfun(2)">
                    <span>任务已做图片</span>
                    <img :src="ruleForm.stateTwoUrl" alt="">                    
                </div>
                <div class="li" @click="popfun(3)">
                    <span>任务已删除图片</span>
                    <img :src="ruleForm.stateThreeUrl" alt="">                    
                </div>
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
import {getReadPlatTaskCover,addAndUpdateReadPlatTaskCover} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {  
          stateOneUrl:"https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskfour.png",
          stateThreeUrl:"https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskfive.png",
          stateTwoUrl:"https://cdnfile-10043692.file.myqcloud.com/admin/images/read/tasksix.png"   
      },
      imglist:[
          "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskone.png",
          "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/tasktwo.png",
          "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskthree.png",
          "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskfour.png",
          "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskfive.png",
          "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/tasksix.png"
      ],
      dialogVisible:false,
      url:"https://cdnfile-10043692.file.myqcloud.com/admin/images/read/taskone.png",
      num:1
    };
  },
  created() {
    getReadPlatTaskCover().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let detailObject = data.data;
                            if(detailObject){
                                this.ruleForm.stateOneUrl = detailObject.stateOneUrl;
                                this.ruleForm.stateThreeUrl = detailObject.stateThreeUrl;
                                this.ruleForm.stateTwoUrl = detailObject.stateTwoUrl;
                            }else{
                                addAndUpdateReadPlatTaskCover(this.ruleForm)
                                .then(res => {
                                    if (res.data.code === 200) {
                                    }else{
                                    this.$message({type: 'error', message:res.data.msg});
                                    return;
                                    }             
                                }).catch();
                            }
                            
                        }
                    }).catch(() => {
                })
  },
  mixins: [mixin],
  methods: {
      popfun(num){
         this.num=num;
         this.dialogVisible=true;
         this.url=this.imglist[0]
      },
      imgfun(){
          if(this.num==1){
              this.ruleForm.stateOneUrl=this.url;
          }
           if(this.num==2){
              this.ruleForm.stateTwoUrl=this.url;
          }
           if(this.num==3){
              this.ruleForm.stateThreeUrl=this.url;
          }
         this.dialogVisible=false;
      },
    //保存
    addAndUpdateReadPlatTaskCovers(){     
             addAndUpdateReadPlatTaskCover(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
    },
   
  }
};
</script>
<style scoped>
.readingplatformbasicsettings .el-radio__input{
                position: absolute;
                left: 120px;
                top: 4px;
        }
</style>

<style lang="scss" scoped>
.readingplatformbasicsettings {
  padding:12px;
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
     .li{
         float: left;
         width: 250px;
         margin: 10px;
         text-align: center;
          cursor:pointer;
          color: #409EFF;
         span{
             display: block;
             width: 100%;
             text-align: center;
             line-height: 32px;
             font-size: 16px;
         }
         img{
             width: 208px;
         }
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
