<template>
    <div class="general-loading-container">
        <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/led_billboard/general-loading.jpg" />
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data(){
    return{
      
    }
  },
  mounted(){
    if(this.templateTypePc){
      if(this.templateTypePc==100001){
        this.$router.push({
            path: '/webOne'
        });
      }else if(this.templateTypePc==100002){
        this.$router.push({
            path: '/webTwo'
        });
      }
    }
  },
  methods:{
    // changeSkin(){
    //   var Link=document.querySelector(".skinLink");
    //   if(this.infoType==1){
    //     Link.setAttribute("href","./static/styles/skin.css");
    //   }else if(this.infoType==2){
    //     Link.setAttribute("href","./static/styles/skin2.css");
    //   }else if(this.infoType==3){
    //     Link.setAttribute("href","./static/styles/skin3.css");
    //   }
    // }
  },
  computed:{
    ...mapGetters([
      'id',
      'templateTypePc',
      'infoType'
    ])
  },
}
</script>

<style lang="scss">
.general-loading-container {
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 3000;
  img {
      width: 100%;
      height: 100%;
  }
}
</style>
