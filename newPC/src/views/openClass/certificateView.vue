<template>
  <div class="open_class_info_wrap">
    <div class="header">
      <el-button size="medium"  @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="print()">打印</el-button>
    </div>
    <div class="open_class_info_box" :style="`height:${nobottommaxH}px`">
      <div class="open_class_info_list" ref="print" id="print">
         <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/certificate_honor.png" alt="">
         <div class="name">{{openClassInfo.teacherName}}</div>
         <div class="timetype">{{openClassInfo.schoolTimeName}}{{openClassInfo.openClassType}}</div>
         <div class="subjectTheme">开设公开课《{{openClassInfo.subjectTheme}}》</div>
         <div class="time">{{openClassInfo.listenDate}}</div>
         <img v-if="imgsrc" class="img" :src="imgsrc" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/windowResize";
import { registerDetail,findSchoolDicsByCode} from "@/api/teachingStudy/openClass";
import html2canvas from 'html2canvas'
export default {
  name: "openClassInfo",
  data() {
    return {
      openClassId: this.$route.query.id,
      openClassInfo: {},
      imgsrc:""
    };
  },
  created() {
    this.registerDetail();
     findSchoolDicsByCode('seal').then(res=>res.data).then(data=>{
        if(data.data.length>0){
                this.imgsrc=data.data[0].remark;
            }else{
                this.imgsrc='';
            }  
      });
  },
  mixins: [mixins],
  methods: {
    convertToImage() {
           let canvas=html2canvas(this.$refs.print)// 在这里，将需要转换成图片的部分作为参数传入html2canvas
          let image=canvas.toDataURL("image/png");// 将生成的canvas转换为DataURL格式
          console.log(image)// 可以将image保存到vuex或者调用保存图片的方法等
   },
    print() {
      this.$print(this.$refs.print);
    },
    goBack() {
      this.$router.back();
    },
    registerDetail() {
      registerDetail(this.openClassId)
        .then(res => res.data)
        .then(data => {
          if (data.code === 200) {
            let list = data.data.listenDate.split("-");
            data.data.listenDate =
              list[0] + "年" + list[1] + "月" + list[2] + "日";
            this.openClassInfo = data.data;
            // this.convertToImage()
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}
.open_class_info_wrap {
  padding:12px;
}
.open_class_info_box {
  overflow-x: hidden;
  overflow-y: auto;
}
.open_class_info_list {
  width: 810px;
  margin: 0 auto;
  color: #333;
  position: relative;
}
.open_class_info_list img {
  width: 100%;
  //   float: left;
}
.open_class_info_list .name {
  position: absolute;
  top: 260px;
  left: 110px;
  font-size: 32px;
  color: #303133;
  font-weight: 600;
}
.timetype {
  position: absolute;
  top: 320px;
  left: 160px;
  font-size: 26px;
  color: #303133;
  width: 540px;
  font-weight: 600;
  line-height: 32px;
}
.img{
    position: absolute;
    right: 145px;
    bottom: 60px;
    height: 120px;
    width: 120px !important;
    border-radius: 50%;
}
.subjectTheme {
  position: absolute;
  top: 380px;
  left: 110px;
  font-size: 26px;
  color: #303133;
  width: 580px;
  font-weight: 600;
  line-height: 32px;
}
.time {
  position: absolute;
  top: 480px;
  right: 100px;
  font-size: 28px;
  color: #303133;
  font-weight: 600;
}
</style>
