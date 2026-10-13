<template>
  <div class="admissionReservationup">
    <div class="header" v-if="myis">
      <el-button type="primary" size="medium" @click="admissionReservationup()">编辑设置</el-button>
    </div>
    <div class="school_mate_apply_set_box" v-if="myis" :style="`height: ${nobottommaxH}px;`">
      <div class="school_mate_inner_box">
        <div class="code_title">
          <span>预约限制</span>
        </div>
        &nbsp;
        <div>
            上午限制人数：{{ruleForm.morningCount}}人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            下午限制人数：{{ruleForm.afternoonCount}}人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            预约限制：{{(ruleForm.isAdvance==1)?"暂无":"提前"+ruleForm.advanceDayCount+"天"}}
        </div>
        &nbsp;
        <div>
           预约链接：{{mobileUrl}}
        </div>
        &nbsp;
         <div  >
             <image-previewer  tag="richtext">
            <img class="qrcode-container" :src="qrcodeUrl" />
            </image-previewer>
          
        </div>
        &nbsp;
        <div class="code_title">
          <span>预约须知</span>
        </div>
         <image-previewer  tag="richtext">
            <div class="meeting-content" v-html="ruleForm.reserNotice">
            </div>
            </image-previewer>
        <div></div>
        <div class="code_title">
          <span>注意事项</span>
        </div>
        <div v-html="ruleForm.matterContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import QRCode from 'qrcode'
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
  import {getSocialReserInit} from '@/api/admissionReservation';
  export default {
    components:{ImagePreviewer},
    data() {
      return {
          ruleForm:{
            advanceDayCount:"",//	提前天数	number	
            afternoonCount:"",//	下午数量	number	
            createTime:"",//	创建时间	string	
            createUserId:"",//	创建人id	number	
            createUserName:"",//	创建人	string	
            isAdvance:"",//	是否提前 1 不提前 2 提前	number	
            matterContent:"",//	注意事项	string	
            morningCount:"",//	上午数量	number	
            reserNotice:"",//	预约须知	string	
          },
          myis:0,
          mobileUrl:"",
          qrcodeUrl: '',
      }
    },
    mixins: [mixins],
    created() {
      this.getSocialReserInit()
    },
    methods: {
      getSocialReserInit() {
        getSocialReserInit().then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
             if(data){
                 data.matterContent=data.matterContent.replace(/\n/g, '<br>')
                 this.ruleForm=data;
                 this.myis=1
                  const baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/common/#/' : 'https://m.www.weixiaojia.cn/common/#/';
                  QRCode.toDataURL(`${baseHref}admissionReservation/admissionReservationindex?encryptSchId=${this.ruleForm.encryptSchId}`)
                        .then(url => {
                            this.qrcodeUrl = url;
                        })
                        .catch(() => {
                        });

                    this.mobileUrl = `${baseHref}admissionReservation/admissionReservationindex?encryptSchId=${this.ruleForm.encryptSchId}`;
             }else{
                 this.admissionReservationup()
             }
              
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      },
      admissionReservationup(){
        this.$router.push({
            path: 'admissionReservationup'
        })
      }
    }
  }
</script>
<style>

.meeting-content ol,.meeting-content ul{
  padding-left: 30px;
}
.meeting-content td, .meeting-content th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}
.meeting-content p{
  margin: 0 0 10px;
}
.meeting-content img{
  display:block;
  max-width:100%;
  height:auto;
}
</style>
<style lang="scss" scoped>
  .admissionReservationup {
    padding:12px;
    .qrcode-container{
        height:100px;
    }
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .school_mate_apply_set_box {
      overflow-x: hidden;
      overflow-y: auto;
      .school_mate_inner_box{
        width: 810px;
        margin: 20px auto;
        .code_title {
          height: 20px;
          line-height: 20px;
          margin: 10px 0;
          padding-left: 8px;
          border-left: 4px solid #409eff;
          color: #333;
        }
      }
    }
  }
</style>
