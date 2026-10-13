<template>
<div class="Intelligencecoursedownload" >
     <div class="top"> 
         <el-button  type="default"  size="medium" @click="$router.back()">返回</el-button>
     </div>        
     <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'">
         <div class="box">
            <div class="top-name">下载排课客户端</div>
            <div class="p">立即下载-标准版<a href="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/%E5%9B%9B%E7%BB%B4%E6%8E%92%E8%AF%BE%E8%BD%AF%E4%BB%B6-%E6%A0%87%E5%87%86%E7%89%88Setup4_16_1_2997.msi" target="_blank" download="examName"><el-button type="primary" size="small">下载</el-button></a></div>
            <div class="top-name">NET Framework下载</div>
            <div class="p">微软官方下载: Web 安装程序  <a href="https://www.microsoft.com/zh-CN/download/details.aspx?id=17851" target="_blank" download="examName"><el-button type="primary" size="small">下载</el-button></a></div>
            <div class="p">微软官方下载: 独立安装程序  <a href="https://www.microsoft.com/zh-cn/download/details.aspx?id=17718" target="_blank" download="examName"><el-button type="primary" size="small">下载</el-button></a></div>
            <div class="p">本地下载  <a href="http://www.pk8.net/download/dotNetFx40_Full_x86_x64.exe" target="_blank" download="examName"><el-button type="primary" size="small">下载</el-button></a></div>
            <div class="top-name">常见问题及解决方法</div>
            <div class="p p-name">问题1：提示缺少 Net Framework</div>
            <div class="p-name">方案：下载并安装 Net Framework.</div>
            <div class="p p-name">问题2：安装 Net Framework出错</div>
            <div class="p-name">方案：部分系统，特别是Win7安装.Net Framework时会出错导致安装失败，请使用搜索引擎查找解决办法或联系学校IT管理人员</div>
            <div class="p p-name">问题3：运行时提示无法连接服务器</div>
            <div class="p-name">方案：因为四维排课软件是一个云应用程序，请确认：1.防火墙等系统允许本软件联网，2.联系学校IT管理人员。</div>
        </div>         
     </div>
</div> 
</template>
<script>
//窗口大小调整
import mixin from '@/mixins/windowResize';
export default {
  data() {
    return {};
  },
  mixins: [mixin], 
  mounted() {
  }, 
  methods: { }
};
</script>
<style scoped>
.Intelligencecoursedownload{
    padding:12px;
}
.Intelligencecoursedownload .top {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.top-name{
    margin: 20px 0;
    line-height: 30px;
    height: 30px;
    border-left:5px #409eff solid;
    padding-left: 10px;
    color:#444;
    font-size: 18px;
    font-weight: 600
}
.p{
    padding-left: 20px;
    color:#666;
    font-size: 16px;
    width:810px;
    line-height: 32px;
    margin-bottom: 20px;
}
.p a{
    float: right;
}
.p.p-name{
    padding-left: 20px;
    color:#444;
    padding-bottom: 0
}
.p-name{
    margin-bottom: 0px;
    color:#666;
    padding-left: 77px;
    padding-bottom: 20px;
    width: 810px;

}
.box{
  width: 810px;
  margin: 0 auto;
}
</style>