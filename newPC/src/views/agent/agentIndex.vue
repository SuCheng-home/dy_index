<template>
  <div class="agentIndex"  style="height: 100vh;width: 100vw;background-color: #477bc4;" >
      <iframe  :src="cyrl" frameborder="0" width="1280" height="98%"></iframe>
      <div class="agentIndexpop"   v-loading="loading" element-loading-text="拼命加载中..."></div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import {getBotToken} from '@/api/agent';
import { mapGetters } from 'vuex'
export default {
  name: 'agent',
  data() {
    return {
      code: this.$route.query.code,
      loading:true,
      appList:[
         {
            id: 20251013,
            name: '和小美',
            icon: 'https://cdnfile-10043692.file.myqcloud.com/productVersion/projects/agentPlatform/QQ%E5%9B%BE%E7%89%8720250917174821.png',
            bot_id: '7555757221896978432',
        },
        {
            id: 20250929,
            name: 'AI助手',
            icon: 'https://sysfile-1251008840.picsh.myqcloud.com/wyms/2025/1759127841225/1759127841225028764.png',
            bot_id: '7592163106454143028',  
            
        },
        {
            id: 20251015,
            name: '科小助',
            icon: 'https://sysfile-1251008840.picsh.myqcloud.com/wyms/2025/1760441553730/1760441553730067278.png',
            bot_id: '7560977939035455551',
        },
        {
            id: 20251112,
            name: '一一',
            icon: 'https://sysfile-1251008840.picsh.myqcloud.com/wyms/2025/1759127841225/1759127841225028764.png',
            bot_id: '7571762528423231534',
        },
          {
            id:20251118,
            name: '学习伙伴小导',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/aisxxd.png',
            bot_id: '7576139152220471330',
        },
         {
            id: 20251120,
            name: '学习助手小思',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/aisxxs.png',
            bot_id: '7575346535349665842',
        },
        {
            id: 20251124,
            name: '出题助手小思',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/aictzs.png',
            bot_id: '7575422542631403520',
        },
        {
            id: 20251204,
            name: '小鹤',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/newxiaohe.png',
            bot_id: '7579940936118435867',
        },
        {
            id: 20260314,
            name: '爱探险的小读者',
            icon: '	https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/maoxian.jpg',
            bot_id: '7616669672380973106'
        },
        {
            id: 20260315,
            name: '探险专家团',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/zhuanjia.jpg',
            bot_id: '7616340469903327241'
        },
        {
            id: 20251221,
            name: '小水滴',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/xiaoshuidi.png',
            bot_id: '7585490955713691682',
        },
        {
            id: 20251222,
            name: '小e',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/xiaoe.png',
            bot_id: '7585487235219357739',
        },
        {
            id: 20251230,
            name: 'YOU AI',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/youai.jpg',
            bot_id: '7588002493096214538',
        },
        {
            id: 20260119,
            name: '九思',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/jgznt.jpg',
            bot_id: '7597004201906634792',
        },
        {
            id: 20260120,
            name: '九高招生小助手',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/jgzsxzs.png',
            bot_id: '7597250249451208723',
        },
         {
            id: 20260402,
            name: '北小星学伴（数学）',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/jgzsxzs.png',
            bot_id: '7624035425023426606',
        },
        {
            id: 20260409,
            name: '北小星学伴（语文）',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/yuwen.jpg',
            bot_id: '7626341214543593508',
        },
         {
            id: 20260414,
            name: '北小星学伴（英语）',
            icon: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/newyingyu.png',
            bot_id: '7629543970154496051',
        }
        ],
      app: {},
      coze: null,
      cyrl:""
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'token','schoolInfo'])
  },
  mounted() {
    // this.renderHeader()
    this.app = this.appList.find(item => item.id == this.code)
    if (!this.code || !this.app) {
      this.$message.error('应用不存在')
      return
    }else{
       const orgId =(this.code==20260414)?"":((this.code == 20260314 || this.code == 20260315) ? 'nsfxtb' : this.schoolInfo.id)
      getBotToken({session_name:'wxcep_' + this.userInfo.id,platform:'coze',org_id:orgId})
                        .then(res => res.data)
                        .then(data => {
                              this.app.userInfo=this.userInfo
                              this.app.schoolInfo=this.schoolInfo
                              this.app.token=this.token
                               this.app.serverName= window.location.href.split('/#')[0]
                               this.app.userType=1
                              this.app.newtoken=data.data.token
                              localStorage.setItem("agentIndexobj", JSON.stringify(this.app));
                              const path = window.location.href.split('#')[0];
                              if(path.includes('localhost')) {
                                this.cyrl = `${path}static/AIDemo/index.html`;
                              } else {
                                this.cyrl  = `${path}/AIDemo/index.html`;
                             }
                              setInterval(() => {
                                this.getBotTokenfun();
                              }, 10*60*1000); 
                        })
     
    }
 
  },
  methods: {
    getBotTokenfun(){
       const orgId = (this.code == 20260314 || this.code == 20260315) ? 'nsfxtb' : this.schoolInfo.id
         getBotToken({session_name:'wxcep_' + this.userInfo.id,platform:'coze',org_id:orgId})
                        .then(res => res.data)
                        .then(data => {
                              this.app.userInfo=this.userInfo
                              this.app.schoolInfo=this.schoolInfo
                              this.app.token=this.token
                              this.app.serverName= window.location.href.split('/#')[0]
                              this.app.userType=1
                              this.app.newtoken=data.data.token
                              localStorage.setItem("agentIndexobj", JSON.stringify(this.app));
        })
    },
    renderHeader() {
      document.title = 'AI平台'
      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://snj-qinhua-1251008840.cos.ap-shanghai.myqcloud.com/open/platform/lv0bfyq4k9k77c/1713147408986.png'
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }
}
</script>
<style>
.agentIndex iframe{
    margin: 0 auto;
    display: block;
    padding: 10px;    
    z-index:2001;
    position: relative;
}
.agentIndexpop{
  margin: 0 auto;
  width:1100px;
  height:88%;
  z-index:1001;
  top:-92%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
</style>
