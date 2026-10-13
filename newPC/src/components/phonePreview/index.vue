<template>
    <div class="pcBox-preview">
        <div class="title">
            手机端实时演示
        </div>
        <div class="pcBox">
            <div class="phone-box scrollBar">
                <div class="noData" v-if="!title&&!phoneContent">
                    暂无手机预览数据
                </div>
                <div class="header" v-show="title">
                    <h1>{{ title }}</h1>
                </div>
                <div class="phone-content" v-html="phoneContent" v-show="phoneContent"></div>
            </div>
        </div>
    </div>
    
  
</template>
<script>
export default {
  props: {
    phoneContent: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data(){
    return{

    }
  }
}
</script>
<style lang="scss" scoped>
.pcBox-preview{
    width:371px;
    margin:0 auto;
    .title{
        text-align: center;
        height:36px;
        line-height: 36px;
        color:#666;
        font-size:18px;
    }
    .pcBox{
            
        width:371px;
        height:574px; 
        z-index:1000;
        padding:0px 0px 0px;
        border:1px solid #d4d4d4;
        border-radius:5px;
        box-sizing: border-box;
        background:#fff;
        // margin:0 auto;
        // background:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/phone_bg.png) no-repeat;
        background-size:100% 100%;
        
    }
}

.phone-box{
    width:100%;
    height:100%;
    padding:20px 12px 12px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    .header {
        margin-bottom: 10px;
        line-height: 1.4;
        word-wrap: break-word;
    }

    .header h1 {
        font-weight: 400;
        font-size: 24px;
        text-align: left;
        margin:0;
    }
    .noData{
        width:100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color:#666;
        // padding-top:60px;
    }
}
</style>
<style lang="scss">
.phone-content{
    width:100%;
    line-height: 26px;
    letter-spacing: 1px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    color: #3e3e3e;
    min-height: 200px;
    box-sizing: border-box;
    section{
        max-width:100% !important;
        box-sizing: border-box;
    }
    ul,ol {
        padding-left: 30px;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    ul li {
        list-style-type: disc;
    }

    ol li {
        list-style-type: decimal;
    }
    p{
        margin:0;
    }
    video {
        width: 100%;
        border: 1px solid #3e3e3e;
        box-sizing: border-box;
        height: 220px !important;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }
    td,th{
        border: 1px solid #3e3e3e;
        padding: 5px;
    }
    iframe {
        width: 100%;
    }
    img{
        max-width: 100%;
        display:block;
    }
    .td, .th {
        border: 1px solid #3e3e3e;
        padding: 5px;
    }
}
</style>
