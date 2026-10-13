<template>
  <div class="Importone" v-loading.body="listLoading">
    <div class="el-row menu-tools">
      <el-button  @click="$router.back()" size="medium">返回</el-button>   
    </div>
     <div class="Importone-main" :style="{height: `${maxH}px`}" >
                <span class="main-explain">说明:</span>
				<ol class="main-list" style="width:60%;">
					<li>请先下载模板，严格根据模板的格式来录入数据；</li>
					<li>姓名, 用户名, 卡号 ，来源 为必填字段，并且卡号不得超过30个字符；</li>
					<li>在执行批量导入操作后，会跳转到结果页面。如有失败结果，可下载之后修改再次导入。</li>
				</ol>
                <div class="button" v-if="name=='下载模板'">
                    <a  href="https://cdnfile-10043692.file.myqcloud.com/admin/xls/campusCard_teacher.xls" download="下载模板" target="_blank">
                          <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png" alt="">
                          <el-button size="medium" class="filter-item" type="primary" icon="upload">{{name}}</el-button>
                    </a>
                </div>
                <div class="button" v-if="name!='下载模板'">
                          <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png" alt="">
                          <el-button @click="downloadFile" size="medium" class="filter-item" type="primary" icon="upload">{{name}}</el-button>
                </div>
                <div class="button">
                    <el-upload class="upload-import" name='userfile' accept=".xls" :action="uploadPath" :data="uploadData" :show-file-list='false'  :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                      <el-button type="primary"  size="medium">导入数据</el-button>
                    </el-upload> 
                </div>
      
    </div>      
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
export default {
  data() {
    return {
        exportURL:'',
        uploadPath:global.newcard + "structure/campusCard/importCampusCardTeacher",
        uploadData: {
          token: this.$store.getters.token
        },
        mydialogVisibles:false,
        mydataname:'',
        listLoading:false,  
        name:'下载模板'  
    };
  },
  mixins: [mixins, baseMixin],
  created() {
       this.exportURL =`${global.newcard}structure/excelExport/downLoadExcelTemplate?token=${this.$store.getters.token}&fileName=campusCard_teacher&folderName=campuscard`;
  },
  methods: {
     //导入
    handleAvatarSuccess(res) {
      if (res.code == 200) {
        if (res.data.errorUserCount == 0) {
          this.$message({
            message: "模版导入成功！",
            type: "success"
          });
          this.listLoading = false;
        } else {
          this.mydataname = res.data;
          this.listLoading = false;
          this.name = "下载导入失败数据";
          this.$message.error("导入失败，请下载失败数据查看!");
        }
      } else {
        this.$message.error(res.msg);
        this.listLoading = false;
      }
    },
     downloadFile() {
      let url = `${global.newcard}structure/excelExport/downloadWrongDataExcel`;
      let params = {
        token: this.$store.getters.token,
        errorUserStr: JSON.stringify(this.mydataname),
        cardType: 2
      };
      var form = document.createElement("form");
      form.style.display = "none";
      form.action = url;
      form.method = "post";
      document.body.appendChild(form);
      // 动态创建input并给value赋值
      for (var key in params) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      form.submit();
      form.remove();
    },
    beforeAvatarUpload(file) {
      let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix!=='xls') {
        this.$message.error("请上传后缀为.xls的模版文件!");
        return false;
      } else {
        this.listLoading = true;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.Importone {
  padding: 20px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .Importone-main{
      overflow: auto;
      .main-explain {
            font-size: 16px;
            margin: 20px 0 0 20px;
            display: block;
            width: 40px;
            height: 30px;
        }
        .main-list li {
            width: 100%;
            line-height: 40px;
            font-size: 16px;
        }
        .button{
          padding-left: 50px;
          padding-bottom: 20px;
          img{
            width: 60px;
            display: block;
            margin: 10px;
          }
        }
  }
 
}
</style>


