import store from '../store';
export default {
    data() {
        return {
            maxH: '',
            maxW: '',
            cutH: 270,
            fileH:180,
            cutW: 230,
            headerH:90,
            boxH:'',
            notopmaxH:'',
            nobottommaxH:'',
            notbmaxH:''
        }
    },
    mounted() {
        this.maxH = document.body.clientHeight - this.cutH-75;
        this.maxW = document.body.clientWidth - this.cutW;
        this.boxH = document.body.clientHeight - this.headerH;
        if(store.getters.isStandalone){
            this.maxH=this.maxH+90
        }
        this.notopmaxH=this.maxH +47;//顶部没有新增返回搜索
        this.nobottommaxH=this.maxH +42;//底部没有分页
        this.notbmaxH=this.maxH+89;//顶部没有新增返回搜索底部没有分页
        this.filemaxH=document.body.clientHeight-this.fileH;//用作文件预览
        window.addEventListener("resize", this.windowResize, false);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.windowResize, false)
    },
    watch:{
        '$route':{
          handler:function(to, from){
            this.cutH = 150;
            this.fileH=140;
            this.headerH = -30;
            if (window.sessionStorage.getItem("standalone")) {
              
            } else if (to.path.match('system/sysManage')) { // 老框架跳转系统设置入口页
                this.cutH = 240;
            }
          },
          immediate:true
        }
    },
    methods: {
        windowResize() {
            this.maxH = document.body.clientHeight - this.cutH-75;
            if(store.getters.isStandalone){
                this.maxH=this.maxH+90
            }
            this.maxW = document.body.clientWidth - this.cutW;
            this.boxH = document.body.clientHeight - this.headerH;
            this.notopmaxH=this.maxH +47;//顶部没有新增返回搜索
            this.nobottommaxH=this.maxH +42;//底部没有分页
            this.notbmaxH=this.maxH+89;//顶部没有新增返回搜索底部没有分页
            this.filemaxH=document.body.clientWidth-this.fileH;
        }
    }
}
